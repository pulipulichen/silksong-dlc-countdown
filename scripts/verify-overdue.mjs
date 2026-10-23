// Run on the verification server with Node 22.13+; no npm dependencies required.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { test } from "node:test";
import { createContext, Script } from "node:vm";

const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const dictionarySource = stripTypeScriptTypes(readFileSync(new URL("src/i18n.ts", root), "utf8"))
  .replace(/^export /gm, "");
const { texts, isLocale } = new Script(dictionarySource + "\n({ texts, isLocale });").runInNewContext();
const mainSource = stripTypeScriptTypes(readFileSync(new URL("src/main.ts", root), "utf8"))
  .replace(/^import .*;$/gm, "")
  .replace(/^export /gm, "")
  .replace(/(const simulationSettings\s*=\s*\{[\s\S]*?\n\};)/, "$1\nObject.assign(simulationSettings, testSettings);");
assert.ok(mainSource.includes("Object.assign(simulationSettings, testSettings)"), "Simulation settings must be injectable for boundary checks.");

function element(dataset = {}) {
  return {
    dataset, hidden: false, textContent: "", attributes: {}, listeners: {},
    classList: { remove() {}, add() {} },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    getContext() { return null; },
  };
}

function setup(settings = {}, initialLocale = "zh-TW") {
  let now = Date.parse("2026-10-23T00:00:00Z");
  const nodes = new Map();
  const get = (selector) => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  for (const id of ["dlc", "switch"]) {
    const card = get('[data-card="' + id + '"]');
    const timer = get('[data-timer="' + id + '"]');
    timer.closest = () => card;
    timer.querySelector = (selector) => get(id + " " + selector);
  }
  const bindings = Array.from(html.matchAll(/<[^>]*\bdata-i18n="([^"]+)"[^>]*>/g), ([tag, key]) => {
    const overdueKey = /data-i18n-overdue="([^"]+)"/.exec(tag)?.[1];
    return element({ i18n: key, i18nOverdue: overdueKey });
  });
  const alt = element({ i18nAlt: "overdueArtAlt" });
  const events = [];
  const storage = new Map();
  const context = createContext({
    Intl, URL, Event, console: { warn() {} },
    Date: class extends Date { static now() { return now; } },
    texts, isLocale, getInitialLocale: () => initialLocale,
    testSettings: { mode: "custom", date: "2027-12-01", dlcReleased: false, ...settings },
    startSilkCursor() {}, startInstallPrompt() {}, startReleaseCelebration() {},
    localStorage: { setItem: (key, value) => storage.set(key, value) },
    document: {
      documentElement: { dataset: {}, style: { setProperty() {} } },
      querySelector: get,
      querySelectorAll(selector) {
        if (selector === "[data-i18n]") return bindings;
        if (selector === "[data-i18n-alt]") return [alt];
        return [];
      },
    },
    window: {
      matchMedia: () => ({ matches: true, addEventListener() {} }),
      setTimeout() {}, dispatchEvent: (event) => events.push(event.type),
    },
  });
  new Script(mainSource, { filename: "src/main.ts" }).runInContext(context);
  return {
    context, get, bindings, alt, events, storage,
    root: context.document.documentElement,
    text: (key) => bindings.find((node) => node.dataset.i18n === key)?.textContent,
    digit: (unit) => get('dlc [data-unit="' + unit + '"]').textContent,
    advance(milliseconds) { now += milliseconds; new Script("update()").runInContext(context); },
    setLocale(locale) { get("#locale").value = locale; get("#locale").listeners.change(); },
  };
}

test("the configured December 2027 preview counts 334 days from January 1, not 335", () => {
  const page = setup();
  assert.equal(page.root.dataset.dlcOverdue, "true");
  assert.equal(page.get(".overdue-art").hidden, false);
  assert.equal(page.get(".overdue-since").hidden, false);
  assert.equal(page.get('[data-card="switch"]').hidden, true);
  assert.equal(page.digit("days"), "334");
  assert.equal(page.digit("hours"), "00");
  assert.equal(page.digit("seconds"), "00");
  assert.equal(page.text("heroEnd"), texts["zh-TW"].overdueHeroEnd);
  assert.equal(page.get('[data-status="dlc"]').textContent, texts["zh-TW"].overdueStatus);
});

test("January 1 starts at zero and the simulated clock continues counting up", () => {
  const page = setup({ date: "2027-01-01" });
  assert.equal(page.root.dataset.dlcOverdue, "true");
  assert.equal(page.digit("days"), "00");
  assert.equal(page.digit("seconds"), "00");
  page.advance(90061000);
  assert.equal(page.digit("days"), "01");
  assert.equal(page.digit("hours"), "01");
  assert.equal(page.digit("minutes"), "01");
  assert.equal(page.digit("seconds"), "01");
});

test("December 31 retains the ordinary countdown, including its original marker", () => {
  const page = setup({ date: "2026-12-31" });
  assert.equal(page.root.dataset.dlcOverdue, "false");
  assert.equal(page.get(".overdue-art").hidden, true);
  assert.equal(page.get(".overdue-since").hidden, true);
  assert.equal(page.text("heroStart"), texts["zh-TW"].heroStart);
  assert.equal(page.text("dlcDescription"), texts["zh-TW"].dlcDescription);
  assert.equal(page.digit("days"), "00");
});

test("a running page switches exactly at Adelaide midnight without a reload", () => {
  const page = setup({ date: "2026-12-31" });
  page.advance(86399999);
  assert.equal(page.root.dataset.dlcOverdue, "false");
  page.advance(1);
  assert.equal(page.root.dataset.dlcOverdue, "true");
  assert.equal(page.digit("days"), "00");
  assert.equal(page.digit("seconds"), "00");
  assert.equal(page.text("dlcTitle"), texts["zh-TW"].overdueTitle);
  assert.equal(page.context.document.title, texts["zh-TW"].overduePageTitle);
  assert.equal(page.get('meta[name="theme-color"]').content, "#241620");
  assert.ok(page.events.includes("silksong-theme-changed"));
});

test("all four languages update overtime copy, image alt, timer label, title, and storage", () => {
  const page = setup();
  const expectedKeys = Object.keys(texts.en).sort();
  for (const locale of ["en", "zh-TW", "zh-CN", "ja"]) {
    assert.deepEqual(Object.keys(texts[locale]).sort(), expectedKeys);
    page.setLocale(locale);
    assert.equal(page.root.lang, locale);
    for (const binding of page.bindings) {
      const key = binding.dataset.i18nOverdue ?? binding.dataset.i18n;
      assert.equal(binding.textContent, texts[locale][key], key);
      assert.equal(typeof texts[locale][key], "string", key);
    }
    assert.equal(page.alt.alt, texts[locale].overdueArtAlt);
    assert.equal(page.get('[data-timer="dlc"]').attributes["aria-label"], texts[locale].overdueAria);
    assert.equal(page.context.document.title, texts[locale].overduePageTitle);
    assert.equal(page.get('[data-status="dlc"]').textContent, texts[locale].overdueStatus);
    assert.equal(page.storage.get("silksong-countdown-locale"), locale);
    assert.equal(page.digit("days"), "334");
  }
});

test("the released screen takes priority and never displays the clown theme", () => {
  const page = setup({ dlcReleased: true, dlcReleasedAt: "2027-11-30T00:00:00+10:30" });
  assert.equal(page.root.dataset.dlcOverdue, "false");
  assert.equal(page.get(".overdue-art").hidden, true);
  assert.equal(page.get(".overdue-since").hidden, true);
  assert.equal(page.text("heroEnd"), texts["zh-TW"].releasedHeroEnd);
  assert.equal(page.context.document.title, texts["zh-TW"].releasedPageTitle);
  assert.equal(page.digit("days"), "01");
});

test("four-digit day counts are preserved rather than truncated", () => {
  const page = setup({ date: "2030-01-01" });
  assert.equal(page.root.dataset.dlcOverdue, "true");
  assert.equal(page.digit("days"), "1096");
});

test("the pre-November-28 layout still shows both original cards", () => {
  const page = setup({ date: "2026-11-27" });
  assert.equal(page.root.dataset.dlcOverdue, "false");
  assert.equal(page.get('[data-card="switch"]').hidden, false);
  assert.equal(page.text("dlcTitle"), texts["zh-TW"].dlcTitle);
});

test("the default release timestamp stays unset until an actual release time is configured", () => {
  const page = setup({ dlcReleased: true });
  for (const unit of ["days", "hours", "minutes", "seconds"]) assert.equal(page.digit(unit), "--");
  assert.equal(page.text("dlcDateNote"), texts["zh-TW"].releasedDateUnknown);
  assert.equal(page.get("#dlc-release-time").hidden, true);
});

test("release time uses the configured instant and continues counting in preview mode", () => {
  const page = setup({ dlcReleased: true, dlcReleasedAt: "2027-11-30T18:30:00+10:30" });
  assert.equal(page.digit("days"), "00");
  assert.equal(page.digit("hours"), "05");
  assert.equal(page.digit("minutes"), "30");
  assert.equal(page.digit("seconds"), "00");
  assert.equal(page.get("#dlc-release-time").dateTime, "2027-11-30T08:00:00.000Z");
  assert.equal(page.get("#dlc-release-time").hidden, false);
  page.advance(90061000);
  assert.equal(page.digit("days"), "01");
  assert.equal(page.digit("hours"), "06");
  assert.equal(page.digit("minutes"), "31");
  assert.equal(page.digit("seconds"), "01");
});

test("UTC timestamps with milliseconds match explicit Adelaide offsets", () => {
  const page = setup({ dlcReleased: true, dlcReleasedAt: "2027-11-30T08:00:00.000Z" });
  assert.equal(page.digit("hours"), "05");
  assert.equal(page.digit("minutes"), "30");
});

test("auto mode uses real time and hides the speculative Switch card after release", () => {
  const page = setup({ mode: "auto", dlcReleased: true, dlcReleasedAt: "2026-10-22T00:00:00Z" });
  assert.equal(page.digit("days"), "01");
  assert.equal(page.get('[data-card="switch"]').hidden, true);
  assert.equal(page.root.dataset.dlcOverdue, "false");
});

test("a future release time never becomes a backwards elapsed timer", () => {
  const page = setup({ dlcReleased: true, dlcReleasedAt: "2027-12-02T00:00:00+10:30" });
  for (const unit of ["days", "hours", "minutes", "seconds"]) assert.equal(page.digit(unit), "00");
});

test("missing or invalid release times show an honest unset state instead of invented elapsed time", () => {
  for (const dlcReleasedAt of ["", "not-a-date", "2027-02-30T00:00:00Z", "2027-11-30T00:00:00", "2027-11-30T24:00:00Z"]) {
    const page = setup({ dlcReleased: true, dlcReleasedAt });
    for (const unit of ["days", "hours", "minutes", "seconds"]) assert.equal(page.digit(unit), "--", dlcReleasedAt);
    assert.equal(page.text("dlcDateNote"), texts["zh-TW"].releasedDateUnknown);
    assert.equal(page.get("#dlc-release-time").hidden, true);
  }
});

test("only configured HTTP(S) announcement URLs are shown in release mode", () => {
  for (const dlcAnnouncementUrl of ["https://example.com/news/released?from=timer", "http://example.com/news"]) {
    const page = setup({ dlcReleased: true, dlcAnnouncementUrl });
    const link = page.get('[data-card="dlc"] .reference');
    assert.equal(link.hidden, false);
    assert.equal(link.href, dlcAnnouncementUrl);
    assert.equal(page.text("teaser"), texts["zh-TW"].releasedAnnouncement);
  }
  for (const dlcAnnouncementUrl of ["", "/relative-news", "javascript:alert(1)", "data:text/html,news", "not a url"]) {
    const page = setup({ dlcReleased: true, dlcAnnouncementUrl });
    assert.equal(page.get('[data-card="dlc"] .reference').hidden, true, dlcAnnouncementUrl);
  }
});

test("all four languages keep release copy, metadata, and accessible labels in sync", () => {
  const page = setup({ dlcReleased: true, dlcReleasedAt: "2027-11-30T00:00:00+10:30" });
  for (const locale of ["en", "zh-TW", "zh-CN", "ja"]) {
    page.setLocale(locale);
    assert.equal(page.text("heroStart"), texts[locale].heroStart);
    assert.equal(page.text("heroEnd"), texts[locale].releasedHeroEnd);
    assert.equal(page.text("intro"), texts[locale].releasedIntro);
    assert.equal(page.text("dlcTitle"), texts[locale].releasedTitle);
    assert.equal(page.text("dlcDescription"), texts[locale].releasedDescription);
    assert.equal(page.text("dlcDateNote"), texts[locale].releasedDateNote);
    assert.equal(page.text("disclaimer"), texts[locale].releasedDisclaimer);
    assert.equal(page.get('[data-timer="dlc"]').attributes["aria-label"], texts[locale].releasedAria);
    assert.equal(page.get('[data-status="dlc"]').textContent, texts[locale].releasedStatus);
    assert.equal(page.context.document.title, texts[locale].releasedPageTitle);
    assert.equal(page.get('meta[name="description"]').content, texts[locale].releasedIntro);
    assert.equal(page.get('meta[name="theme-color"]').content, "#103e47");
    assert.equal(page.digit("days"), "01");
  }
});

test("the Adelaide boundary follows both summer and winter UTC offsets", () => {
  const page = setup();
  const january = new Script("adelaideMidnight(2027, 1, 1)").runInContext(page.context);
  const july = new Script("adelaideMidnight(2027, 7, 1)").runInContext(page.context);
  assert.equal(new Date(january).toISOString(), "2026-12-31T13:30:00.000Z");
  assert.equal(new Date(july).toISOString(), "2027-06-30T14:30:00.000Z");
});

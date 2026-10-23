import "./style.css";
import "./overdue.css";
import "./released.css";
import { startReleaseCelebration } from "./released-effects";
import { startSilkCursor } from "./flower-cursor";
import { startInstallPrompt } from "./install-prompt";
import { getInitialLocale, isLocale, texts, type Locale, type TextKey } from "./i18n";

type TimerId = "dlc" | "switch";

type SimulationSettings = {
  mode: SimulationMode;
  date: string;
  dlcReleased: boolean;
  dlcReleasedAt: string;
  dlcAnnouncementUrl: string;
};
const zone = "Australia/Adelaide";
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

type SimulationMode = "auto" | "custom";
const simulationSettings: SimulationSettings = {
  mode: "auto", // Use "custom" to preview the date below.
  date: "2026-12-01", // Custom start date in YYYY-MM-DD format, at Adelaide midnight.
  dlcReleased: false, // Set to true to show the released celebration screen.
  dlcReleasedAt: "2027-10-01T00:00:00+09:30", // Adelaide midnight for the configured release date; replace with the confirmed release time when known.
  dlcAnnouncementUrl: "https://www.teamcherry.com.au/", // Full https:// URL of the release announcement. Leave empty to hide the button.
};

const simulationStartedAt = Date.now();

/** Convert midnight in Adelaide to a UTC timestamp, with local DST rules. */
export function adelaideMidnight(year: number, month: number, day: number): number {
  const desiredWallTime = Date.UTC(year, month - 1, day);
  let current = desiredWallTime;
  for (let attempt = 0; attempt < 3; attempt++) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(current))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );
    const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    current = desiredWallTime - (localAsUtc - current);
  }
  return current;
}

const target: Record<TimerId, number> = {
  dlc: adelaideMidnight(2026, 12, 31),
  switch: adelaideMidnight(2026, 11, 27),
};
// Keep the November 27 card through that Adelaide calendar day.
const switchCardHideAt = adelaideMidnight(2026, 11, 28);
const switchCard = document.querySelector<HTMLElement>('[data-card="switch"]');
// The announced year ends at the next Adelaide midnight, not the start of December 31.
const overdueStartsAt = adelaideMidnight(2027, 1, 1);
const overdueArt = document.querySelector<HTMLElement>(".overdue-art");
const overdueSince = document.querySelector<HTMLElement>(".overdue-since");

function parseAdelaideDate(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return adelaideMidnight(year, month, day);
}

function currentTime(): number {
  if (simulationSettings.mode !== "custom") return Date.now();
  const start = parseAdelaideDate(simulationSettings.date);
  if (start === null) return Date.now();
  return start + Date.now() - simulationStartedAt;
}

function parseReleaseTime(value: string): number | null {
  // Require an explicit time zone so every visitor counts from the same instant.
  const match = /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value.trim());
  if (!match || parseAdelaideDate(match[1]) === null) return null;
  const timestamp = Date.parse(value.trim());
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseAnnouncementUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

const releasedAt = parseReleaseTime(simulationSettings.dlcReleasedAt);
const announcementUrl = parseAnnouncementUrl(simulationSettings.dlcAnnouncementUrl);
const releasedTextKeys: Partial<Record<TextKey, TextKey>> = {
  heroEnd: "releasedHeroEnd",
  intro: "releasedIntro",
  dlcKicker: "releasedKicker",
  dlcTitle: "releasedTitle",
  dlcDateNote: releasedAt === null ? "releasedDateUnknown" : "releasedDateNote",
  dlcDescription: "releasedDescription",
  teaser: "releasedAnnouncement",
  timeLabel: "releasedTimeLabel",
  disclaimer: "releasedDisclaimer",
};

const releaseTime = document.querySelector<HTMLTimeElement>("#dlc-release-time");
const dlcReference = document.querySelector<HTMLAnchorElement>('[data-card="dlc"] .reference');
document.documentElement.dataset.dlcReleased = String(simulationSettings.dlcReleased);
document.querySelectorAll<HTMLElement>("[data-release-only]").forEach((element) => {
  element.hidden = !simulationSettings.dlcReleased;
});
document.querySelectorAll<HTMLElement>("[data-countdown-only]").forEach((element) => {
  element.hidden = simulationSettings.dlcReleased;
});
if (releaseTime) {
  releaseTime.hidden = !simulationSettings.dlcReleased || releasedAt === null;
  if (releasedAt !== null) releaseTime.dateTime = new Date(releasedAt).toISOString();
}
if (simulationSettings.dlcReleased) {
  if (dlcReference) {
    dlcReference.hidden = announcementUrl === null;
    if (announcementUrl !== null) dlcReference.href = announcementUrl;
  }
  if (releasedAt === null) {
    console.warn('Set simulationSettings.dlcReleasedAt to the actual release time, including Z or a UTC offset (YYYY-MM-DDTHH:mm:ss+HH:mm). The elapsed timer shows -- until a valid time is provided.');
  }
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = "#103e47";
}

let isOverdue = currentTime() >= overdueStartsAt && !simulationSettings.dlcReleased;
let locale: Locale = getInitialLocale();
const select = document.querySelector<HTMLSelectElement>("#locale");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const timers: Record<TimerId, HTMLElement | null> = {
  dlc: document.querySelector('[data-timer="dlc"]'),
  switch: document.querySelector('[data-timer="switch"]'),
};

function changeDigit(element: HTMLElement | null, value: number | null): void {
  if (!element) return;
  const next = value === null ? "--" : String(value).padStart(2, "0");
  if (element.textContent === next) return;
  element.textContent = next;
  if (!reduceMotion.matches) {
    element.classList.remove("digit-change");
    void element.offsetWidth;
    element.classList.add("digit-change");
  }
}

function update(): void {
  const now = currentTime();
  if (switchCard) switchCard.hidden = simulationSettings.dlcReleased || now >= switchCardHideAt;
  const overdue = now >= overdueStartsAt && !simulationSettings.dlcReleased;
  if (overdue !== isOverdue) {
    isOverdue = overdue;
    applyPresentation();
    window.dispatchEvent(new Event("silksong-theme-changed"));
  }
  const copy = texts[locale];
  (["dlc", "switch"] as const).forEach((id) => {
    const timer = timers[id];
    if (!timer) return;
    const released = id === "dlc" && simulationSettings.dlcReleased;
    const origin = released ? releasedAt : id === "dlc" && isOverdue ? overdueStartsAt : target[id];
    const duration = origin === null ? null : Math.floor(
      (released ? Math.max(0, now - origin) : Math.abs(now - origin)) / 1000,
    );
    const values: Record<string, number | null> = {
      days: duration === null ? null : Math.floor(duration / 86400),
      hours: duration === null ? null : Math.floor(duration / 3600) % 24,
      minutes: duration === null ? null : Math.floor(duration / 60) % 60,
      seconds: duration === null ? null : duration % 60,
    };
    Object.entries(values).forEach(([unit, value]) => {
      changeDigit(timer.querySelector<HTMLElement>('[data-unit="' + unit + '"]'), value);
    });
    const expired = origin !== null && now >= origin;
    const card = timer.closest<HTMLElement>(".card");
    if (card) card.dataset.expired = String(expired);
    const status = document.querySelector<HTMLElement>('[data-status="' + id + '"]');
    const label = released ? copy.releasedStatus : id === "dlc" && isOverdue ? copy.overdueStatus : expired ? copy.after : copy.before;
    if (status && status.textContent !== label) status.textContent = label;
  });

  const clock = document.querySelector<HTMLElement>("#adelaide-clock");
  if (clock) {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).format(now);
  }
}

function applyPresentation(): void {
  const copy = texts[locale];
  document.documentElement.dataset.dlcOverdue = String(isOverdue);
  if (overdueArt) overdueArt.hidden = !isOverdue;
  if (overdueSince) overdueSince.hidden = !isOverdue;
  document.title = simulationSettings.dlcReleased ? copy.releasedPageTitle : isOverdue ? copy.overduePageTitle : copy.pageTitle;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as TextKey | undefined;
    if (!key || !(key in copy)) return;
    const overdueKey = element.dataset.i18nOverdue as TextKey | undefined;
    const translatedKey = simulationSettings.dlcReleased ? releasedTextKeys[key] ?? key : isOverdue && overdueKey ? overdueKey : key;
    element.textContent = copy[translatedKey];
  });
  document.querySelectorAll<HTMLImageElement>("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt as TextKey | undefined;
    if (key && key in copy) element.alt = copy[key];
  });
  if (releaseTime && releasedAt !== null) {
    releaseTime.textContent = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZoneName: "shortOffset",
    }).format(releasedAt);
  }
  if (select) { select.value = locale; select.setAttribute("aria-label", copy.language); }
  timers.dlc?.setAttribute("aria-label", simulationSettings.dlcReleased ? copy.releasedAria : isOverdue ? copy.overdueAria : copy.dlcAria);
  timers.switch?.setAttribute("aria-label", copy.switchAria);
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = simulationSettings.dlcReleased ? copy.releasedIntro : isOverdue ? copy.overdueIntro : copy.intro;
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = simulationSettings.dlcReleased ? "#103e47" : isOverdue ? "#241620" : "#061117";
}

function setLocale(next: Locale): void {
  locale = next;
  document.documentElement.lang = locale;
  applyPresentation();
  update();
  window.dispatchEvent(new Event("silksong-locale-changed"));
}

select?.addEventListener("change", () => {
  if (!select || !isLocale(select.value)) return;
  setLocale(select.value);
  try { localStorage.setItem("silksong-countdown-locale", select.value); }
  catch { /* Non-persistent selection remains functional. */ }
});

setLocale(locale);
startInstallPrompt(() => locale);

function loop(): void {
  update();
  window.setTimeout(loop, 1010 - Date.now() % 1000);
}
loop();

// A lightweight animated ambient backdrop: purely abstract light and geometry.
function startAmbient(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  type Particle = { x: number; y: number; radius: number; speed: number; phase: number; gold: boolean };
  type Ripple = { x: number; y: number; age: number };
  let width = 0, height = 0;
  let particles: Particle[] = [];
  let ripples: Ripple[] = [];
  let raf = 0;
  let lastFrame = 0;
  const frameInterval = 1000 / 30;
  let pointerX = 0, pointerY = 0;
  let easedX = 0, easedY = 0;

  function resize(): void {
    width = window.innerWidth; height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = reduceMotion.matches ? 16 : width < 700 ? 24 : 48;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: 0.4 + Math.random() * 1.6,
      speed: 0.07 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.75,
    }));
  }

  function draw(time: number): void {
    if (!ctx) return;
    if (!reduceMotion.matches && time - lastFrame < frameInterval) {
      raf = requestAnimationFrame(draw);
      return;
    }
    const step = lastFrame ? Math.min((time - lastFrame) / (1000 / 60), 4) : 1;
    lastFrame = time;
    ctx.clearRect(0, 0, width, height);
    const seconds = time * .001;
    easedX += (pointerX - easedX) * .025;
    easedY += (pointerY - easedY) * .025;

    const swell = (x: number, baseline: number, amplitude: number, phase: number): number =>
      baseline
      + Math.sin(x * 0.0075 + phase) * amplitude
      + Math.sin(x * 0.018 - phase * 0.65) * amplitude * 0.34;

    for (let layer = 0; !isOverdue && layer < 3; layer++) {
      const baseline = height * (0.06 + layer * 0.1);
      const amplitude = 12 + layer * 5;
      const phase = seconds * (0.22 + layer * 0.04) + layer;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = swell(x, baseline, amplitude, phase);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(176,228,220,${0.14 + layer * 0.05})`;
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }

    for (let layer = 0; !isOverdue && layer < 3; layer++) {
      const baseline = height * (0.56 + layer * 0.13);
      const amplitude = 22 + layer * 7;
      const phase = seconds * (0.32 + layer * 0.06) + layer * 1.4;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 12) ctx.lineTo(x, swell(x, baseline, amplitude, phase));
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = layer % 2 ? "rgba(56,150,156,0.07)" : "rgba(20,96,114,0.09)";
      ctx.fill();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = swell(x, baseline, amplitude, phase);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = layer === 2 ? "rgba(214,190,132,0.28)" : "rgba(198,240,230,0.34)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ripples = isOverdue ? [] : ripples.filter((ripple) => ripple.age < 1);
    for (const ripple of ripples) {
      const progress = ripple.age;
      const radius = 14 + progress * Math.min(width, height) * .22;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, radius, radius * .28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(164,224,211,${(1 - progress) * .2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ripple.age += .009 * step;
    }

    for (const p of particles) {
      const opacity = .2 + .38 * (1 + Math.sin(seconds * .8 + p.phase)) / 2;
      ctx.beginPath();
      if (isOverdue) {
        ctx.ellipse(p.x + easedX * .1, p.y + easedY * .1, p.radius * .6, p.radius * 1.7, -.3, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x + easedX * .1, p.y + easedY * .1, p.radius, 0, Math.PI * 2);
      }
      const color = isOverdue
        ? p.gold ? "255,194,115" : "240,122,79"
        : p.gold ? "246,197,126" : "125,234,210";
      ctx.fillStyle = "rgba(" + color + "," + opacity.toFixed(3) + ")";
      ctx.fill();
      if (!reduceMotion.matches) {
        p.y -= p.speed * step;
        p.x += Math.sin(seconds * .4 + p.phase) * .12 * step;
        if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
      }
    }

    if (!reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(draw);
  }

  function restart(): void {
    cancelAnimationFrame(raf);
    lastFrame = 0;
    resize();
    if (!document.hidden) raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", restart, { passive: true });
  window.addEventListener("silksong-theme-changed", restart);
  window.addEventListener("pointermove", (event) => {
    if (reduceMotion.matches) return;
    pointerX = (event.clientX / width - .5) * 25;
    pointerY = (event.clientY / height - .5) * 17;
    document.documentElement.style.setProperty("--mx", String(event.clientX / width - .5));
    document.documentElement.style.setProperty("--my", String(event.clientY / height - .5));
  }, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    if (isOverdue || reduceMotion.matches || !event.isPrimary || event.button !== 0) return;
    ripples.push({ x: event.clientX, y: event.clientY, age: 0 });
    if (ripples.length > 8) ripples.shift();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf); else restart();
  });
  reduceMotion.addEventListener("change", restart);
  restart();
}

const canvas = document.querySelector<HTMLCanvasElement>("#ambient");
if (canvas) startAmbient(canvas);
startSilkCursor(reduceMotion);
startReleaseCelebration();

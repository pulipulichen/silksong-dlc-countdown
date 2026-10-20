import "./style.css";
import { getInitialLocale, isLocale, texts, type Locale, type TextKey } from "./i18n";

type TimerId = "dlc" | "switch";
const zone = "Australia/Adelaide";
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

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
let locale: Locale = getInitialLocale();
const select = document.querySelector<HTMLSelectElement>("#locale");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const timers: Record<TimerId, HTMLElement | null> = {
  dlc: document.querySelector('[data-timer="dlc"]'),
  switch: document.querySelector('[data-timer="switch"]'),
};

function changeDigit(element: HTMLElement | null, value: number): void {
  if (!element) return;
  const next = String(value).padStart(2, "0");
  if (element.textContent === next) return;
  element.textContent = next;
  if (!reduceMotion.matches) {
    element.classList.remove("digit-change");
    void element.offsetWidth;
    element.classList.add("digit-change");
  }
}

function update(): void {
  const now = Date.now();
  const copy = texts[locale];
  (["dlc", "switch"] as const).forEach((id) => {
    const timer = timers[id];
    if (!timer) return;
    const duration = Math.floor(Math.abs(now - target[id]) / 1000);
    const values: Record<string, number> = {
      days: Math.floor(duration / 86400),
      hours: Math.floor(duration / 3600) % 24,
      minutes: Math.floor(duration / 60) % 60,
      seconds: duration % 60,
    };
    Object.entries(values).forEach(([unit, value]) => {
      changeDigit(timer.querySelector<HTMLElement>('[data-unit="' + unit + '"]'), value);
    });
    const expired = now >= target[id];
    const card = timer.closest<HTMLElement>(".card");
    if (card) card.dataset.expired = String(expired);
    const status = document.querySelector<HTMLElement>('[data-status="' + id + '"]');
    const label = expired ? copy.after : copy.before;
    if (status && status.textContent !== label) status.textContent = label;
  });

  const clock = document.querySelector<HTMLElement>("#adelaide-clock");
  if (clock) {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).format(now);
  }
}

function setLocale(next: Locale): void {
  locale = next;
  document.documentElement.lang = locale;
  const copy = texts[locale];
  document.title = copy.pageTitle;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as TextKey | undefined;
    if (key && key in copy) element.textContent = copy[key];
  });
  if (select) { select.value = locale; select.setAttribute("aria-label", copy.language); }
  timers.dlc?.setAttribute("aria-label", copy.dlcAria);
  timers.switch?.setAttribute("aria-label", copy.switchAria);
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = copy.intro;
  update();
}

select?.addEventListener("change", () => {
  if (!select || !isLocale(select.value)) return;
  setLocale(select.value);
  try { localStorage.setItem("silksong-countdown-locale", select.value); }
  catch { /* Non-persistent selection remains functional. */ }
});
setLocale(locale);

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
  type Spark = { x: number; y: number; dx: number; dy: number; life: number };
  type Ripple = { x: number; y: number; age: number };
  let width = 0, height = 0;
  let particles: Particle[] = [];
  let sparks: Spark[] = [];
  let ripples: Ripple[] = [];
  let raf = 0;
  let pointerX = 0, pointerY = 0;
  let easedX = 0, easedY = 0;

  function resize(): void {
    width = window.innerWidth; height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = reduceMotion.matches ? 24 : width < 700 ? 45 : 105;
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
    ctx.clearRect(0, 0, width, height);
    const seconds = time * .001;
    easedX += (pointerX - easedX) * .025;
    easedY += (pointerY - easedY) * .025;

    // Slow, layered swell lines give the scene a quiet underwater current.
    for (let layer = 0; layer < 5; layer++) {
      const baseline = height * (.55 + layer * .105);
      const amplitude = 8 + layer * 3;
      const phase = seconds * (.24 + layer * .025) + layer * 1.7;
      ctx.beginPath();
      for (let x = -20; x <= width + 20; x += 8) {
        const y = baseline + Math.sin(x * .009 + phase) * amplitude
          + Math.sin(x * .021 - phase * .7) * amplitude * .32;
        if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const fade = Math.max(.008, .042 - layer * .005);
      ctx.strokeStyle = layer % 2
        ? `rgba(111,205,192,${fade})`
        : `rgba(231,194,137,${fade})`;
      ctx.lineWidth = layer === 0 ? 1.2 : .8;
      ctx.stroke();
    }

    ripples = ripples.filter((ripple) => ripple.age < 1);
    for (const ripple of ripples) {
      const progress = ripple.age;
      const radius = 14 + progress * Math.min(width, height) * .22;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, radius, radius * .28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(164,224,211,${(1 - progress) * .2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ripple.age += .009;
    }

    for (const p of particles) {
      const opacity = .2 + .38 * (1 + Math.sin(seconds * .8 + p.phase)) / 2;
      ctx.beginPath();
      ctx.arc(p.x + easedX * .1, p.y + easedY * .1, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? "rgba(246,197,126," + opacity.toFixed(3) + ")"
        : "rgba(125,234,210," + opacity.toFixed(3) + ")";
      ctx.fill();
      if (!reduceMotion.matches) {
        p.y -= p.speed;
        p.x += Math.sin(seconds * .4 + p.phase) * .12;
        if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
      }
    }

    for (const s of sparks) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(.1, s.life / 34), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(247,208,144," + Math.max(0, s.life / 75).toFixed(3) + ")";
      ctx.fill();
      s.x += s.dx; s.y += s.dy; s.dx *= .98; s.dy *= .98; s.life -= 1.1;
    }
    sparks = sparks.filter((s) => s.life > 0);
    if (!reduceMotion.matches && !document.hidden) raf = requestAnimationFrame(draw);
  }

  function restart(): void {
    cancelAnimationFrame(raf);
    resize();
    if (!document.hidden) raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", restart, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (reduceMotion.matches) return;
    pointerX = (event.clientX / width - .5) * 25;
    pointerY = (event.clientY / height - .5) * 17;
    document.documentElement.style.setProperty("--mx", String(event.clientX / width - .5));
    document.documentElement.style.setProperty("--my", String(event.clientY / height - .5));
  }, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    if (reduceMotion.matches) return;
    ripples.push({ x: event.clientX, y: event.clientY, age: 0 });
    if (sparks.length > 50) return;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = .6 + Math.random() * 1.8;
      sparks.push({
        x: event.clientX, y: event.clientY,
        dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
        life: 25 + Math.random() * 35,
      });
    }
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf); else restart();
  });
  reduceMotion.addEventListener("change", restart);
  restart();
}

const canvas = document.querySelector<HTMLCanvasElement>("#ambient");
if (canvas) startAmbient(canvas);

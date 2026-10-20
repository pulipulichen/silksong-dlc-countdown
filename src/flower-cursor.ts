import silkUrl from "./assets/silk-cocoon.svg";

/** Keep the silk and its light above the page without intercepting input. */
export function startSilkCursor(reduceMotion: MediaQueryList): void {
  const finePointer = window.matchMedia("(any-pointer: fine)");
  const cursor = document.createElement("div");
  cursor.className = "silk-cursor";
  cursor.setAttribute("aria-hidden", "true");
  const silk = document.createElement("img");
  silk.src = silkUrl;
  silk.alt = "";
  silk.draggable = false;
  silk.width = 48;
  silk.height = 56;
  cursor.append(silk);

  const effects = document.createElement("div");
  effects.className = "silk-effects";
  effects.setAttribute("aria-hidden", "true");
  document.body.append(effects, cursor);

  let ready = false;
  let flash: Animation | undefined;
  const bursts = new Map<HTMLElement, Animation[]>();

  function hide(): void {
    cursor.classList.remove("is-visible");
    document.documentElement.classList.remove("silk-cursor-active");
  }

  function move(event: PointerEvent): void {
    if (!ready || !finePointer.matches || event.pointerType !== "mouse") {
      hide();
      return;
    }
    // The silk's center, not the image's corner, is the click hotspot.
    cursor.style.transform = `translate3d(${event.clientX - 24}px, ${event.clientY - 28}px, 0)`;
    cursor.classList.toggle("is-interactive", event.target instanceof Element
      && Boolean(event.target.closest("a, button, select, label, input, textarea, [role='button']")));
    cursor.classList.add("is-visible");
    document.documentElement.classList.add("silk-cursor-active");
  }

  silk.addEventListener("load", () => { ready = true; });
  silk.addEventListener("error", () => { ready = false; hide(); });
  // A cached image may already be complete before the listeners are attached.
  ready = silk.complete && silk.naturalWidth > 0;

  function removeBurst(burst: HTMLElement): void {
    bursts.get(burst)?.forEach((animation) => animation.cancel());
    bursts.delete(burst);
    burst.remove();
  }

  function clearEffects(): void {
    flash?.cancel();
    for (const burst of bursts.keys()) removeBurst(burst);
  }

  function animateImmediately(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
    startedAt: number | null,
  ): Animation {
    const animation = element.animate(keyframes, { ...options, fill: "both" });
    // Share the pointerdown timestamp instead of waiting for each animation's
    // pending play task. The first keyframe is already visible on the first paint.
    if (startedAt !== null) animation.startTime = startedAt;
    return animation;
  }

  function bloom(x: number, y: number, startedAt: number | null): void {
    // Bound both DOM nodes and animations even during rapid clicking.
    if (bursts.size >= 8) removeBurst(bursts.keys().next().value!);
    const burst = document.createElement("div");
    burst.className = "silk-burst";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    effects.append(burst);
    const animations: Animation[] = [];
    bursts.set(burst, animations);

    const glow = document.createElement("span");
    glow.className = "silk-glow";
    burst.append(glow);
    animations.push(animateImmediately(glow, reduceMotion.matches
      ? [{ opacity: .35 }, { opacity: 0 }]
      : [
        { opacity: .8, transform: "scale(.55)" },
        { opacity: 0, transform: "scale(1)" },
      ], { duration: reduceMotion.matches ? 180 : 240, easing: "ease-out" }, startedAt));

    if (!reduceMotion.matches) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("span");
        particle.className = `silk-particle silk-particle--${i % 5 === 0 ? "glint" : i % 3 === 0 ? "thread" : "dot"}`;
        const angle = (i / 20) * Math.PI * 2 + (Math.random() - .5) * .4;
        const initialRadius = 15 + Math.random() * 10;
        const distance = 65 + Math.random() * 65;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const size = 3 + Math.random() * 3;
        const translate = (x: number, y: number): string =>
          `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        burst.append(particle);
        animations.push(animateImmediately(particle, [
          { opacity: 1, transform: `${translate(Math.cos(angle) * initialRadius, Math.sin(angle) * initialRadius)} scale(1)`, offset: 0 },
          { opacity: .9, transform: `${translate(dx * .55, dy * .55 - 3)} scale(.85)`, offset: .3 },
          { opacity: 0, transform: `${translate(dx, dy - 18)} rotate(${90 + Math.random() * 160}deg) scale(.15)` },
        ], { duration: 380 + Math.random() * 180, easing: "cubic-bezier(.16,.65,.3,1)" }, startedAt));
      }
    }

    void Promise.all(animations.map((animation) => animation.finished))
      .then(() => removeBurst(burst))
      .catch(() => { /* Cancellation already removes the burst. */ });
  }

  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || document.hidden) return;
    const timelineTime = document.timeline.currentTime;
    const startedAt = typeof timelineTime === "number" ? timelineTime : null;
    move(event);
    flash?.cancel();
    if (cursor.classList.contains("is-visible")) {
      flash = animateImmediately(silk, [
        { filter: "brightness(0) invert(1) drop-shadow(0 0 9px white) drop-shadow(0 0 20px white)" },
        { filter: "brightness(1) drop-shadow(0 0 2px #ffffff55)" },
      ], { duration: reduceMotion.matches ? 180 : 240, easing: "ease-out" }, startedAt);
      const activeFlash = flash;
      void activeFlash.finished.then(() => activeFlash.cancel()).catch(() => {});
    }
    bloom(event.clientX, event.clientY, startedAt);
  }, { passive: true, capture: true });
  document.addEventListener("pointerout", (event) => { if (!event.relatedTarget) hide(); });
  window.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { hide(); clearEffects(); }
  });
  finePointer.addEventListener("change", hide);
  reduceMotion.addEventListener("change", clearEffects);
}

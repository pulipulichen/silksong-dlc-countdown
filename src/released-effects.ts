export function startReleaseCelebration(): void {
  const container = document.querySelector<HTMLElement>(".celebration-confetti");
  if (!container || document.documentElement.dataset.dlcReleased !== "true") return;

  const colors = ["#f6d296", "#a8ead8", "#edb29e", "#fff0c9"];
  const count = window.innerWidth < 700 ? 14 : 24;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < count; index++) {
    const piece = document.createElement("span");
    piece.className = index % 4 === 0 ? "confetti confetti--ribbon" : "confetti";
    piece.style.setProperty("--confetti-x", `${(index + Math.random()) / count * 100}%`);
    piece.style.setProperty("--confetti-rest-y", `${Math.random() * 95}%`);
    piece.style.setProperty("--confetti-duration", `${12 + Math.random() * 12}s`);
    piece.style.setProperty("--confetti-delay", `${-Math.random() * 24}s`);
    piece.style.setProperty("--confetti-sway", `${-7 + Math.random() * 14}vw`);
    piece.style.setProperty("--confetti-turn", `${180 + Math.random() * 540}deg`);
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    fragment.append(piece);
  }
  container.replaceChildren(fragment);

  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("celebration-paused", document.hidden);
  });
}

import { type Locale } from "./i18n";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const labels: Record<Locale, { title: string; description: string; install: string; later: string; close: string; ios: string }> = {
  en: { title: "Install Silksong DLC Countdown", description: "Keep the countdown on your home screen.", install: "Install now", later: "Maybe later", close: "Close", ios: "In Safari, tap Share, then Add to Home Screen." },
  "zh-TW": { title: "安裝絲綢之歌DLC倒數", description: "將倒數計時器加入主畫面，隨時查看。", install: "立即安裝", later: "稍後再說", close: "關閉", ios: "請在 Safari 點選「分享」，再選擇「加入主畫面」。" },
  "zh-CN": { title: "安装丝之歌DLC倒计时", description: "将倒计时添加到主屏幕，随时查看。", install: "立即安装", later: "稍后再说", close: "关闭", ios: "请在 Safari 点击“分享”，再选择“添加到主屏幕”。" },
  ja: { title: "シルクソング DLC カウントダウンをインストール", description: "カウントダウンをホーム画面に追加。", install: "インストール", later: "後で", close: "閉じる", ios: "Safari の共有メニューから「ホーム画面に追加」を選んでください。" },
};
const snoozeKey = "silksong-install-snooze-until";
const day = 24 * 60 * 60 * 1000;

export function startInstallPrompt(getLocale: () => Locale): void {
  if (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone) return;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /Safari/i.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
  let deferred: InstallPromptEvent | null = null;
  let dismissedThisVisit = false;
  let installed = false;
  let card: HTMLElement | null = null;

  function snoozed(): boolean {
    try { return Number(localStorage.getItem(snoozeKey) || 0) > Date.now(); }
    catch { return false; }
  }
  function hide(): void { card?.remove(); card = null; }
  function dismiss(): void {
    dismissedThisVisit = true;
    try { localStorage.setItem(snoozeKey, String(Date.now() + day)); }
    catch { /* Private mode can deny storage. */ }
    hide();
  }
  function render(): void {
    if (installed || dismissedThisVisit || snoozed() || card || (!deferred && !(ios && safari))) return;
    const copy = labels[getLocale()];
    const panel = document.createElement("aside");
    panel.className = "install-card";
    panel.setAttribute("aria-label", copy.title);
    const title = document.createElement("strong");
    title.className = "install-card__title";
    title.textContent = "🌊 " + copy.title;
    const description = document.createElement("p");
    description.textContent = deferred ? copy.description : copy.ios;
    const actions = document.createElement("div");
    actions.className = "install-card__actions";
    const later = document.createElement("button");
    later.type = "button";
    later.className = "install-card__later";
    later.textContent = copy.later;
    later.addEventListener("click", dismiss);
    if (deferred) {
      const install = document.createElement("button");
      install.type = "button";
      install.className = "install-card__install";
      install.textContent = copy.install;
      install.addEventListener("click", async () => {
        const event = deferred;
        if (!event) return;
        deferred = null;
        hide();
        try {
          await event.prompt();
          const choice = await event.userChoice;
          if (choice.outcome === "dismissed") dismiss();
        } catch { dismiss(); }
      });
      actions.append(install);
    }
    actions.append(later);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "install-card__close";
    close.textContent = "×";
    close.setAttribute("aria-label", copy.close);
    close.addEventListener("click", dismiss);
    panel.append(close, title, description, actions);
    document.body.append(panel);
    card = panel;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    hide();
    render();
  });
  window.addEventListener("appinstalled", () => { installed = true; deferred = null; hide(); });
  window.addEventListener("silksong-locale-changed", () => { hide(); render(); });
  if (ios && safari) render();
}

# 等待漫長時光 — 絲綢之歌 DLC 倒數

[English](./README.md) · [繁體中文](./README_zh_tw.md)

[![Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)

**[開啟網站](https://pulipulichen.github.io/silksong-dlc-countdown/)**

這是一個結合深海動畫與多語系的**非官方粉絲倒數網站**，用來記錄等待《空洞騎士：絲綢之歌》免費 DLC《悲愴之海》的過程。Team Cherry 已在 Cherry Time 公布 **2026 年 12 月 11 日**為 DLC 發售日期，但沒有公布具體開放時間與時區。

## 目前倒數設定

- **官方公布發售日期：** 2026/12/11。
- **具體開放時間：** 尚未公布。
- **倒數方式：** 網站以**阿德雷德時間 00:00**作為 12 月 11 日開始的日期界線，不代表 DLC 會在午夜開放。
- **逾時計時：** 如果 DLC 尚未被標記為已開放，逾時計時會從阿德雷德時間 12 月 12 日午夜開始。

> `demo/` 中的圖片是 2026 年 11 月 27 日 Cherry Time 公布發售日期之前保存的舊版畫面，可能仍顯示先前粉絲選定的 12 月 31 日標記與舊版逾期起算日期；它們不是目前公開網站的最新倒數截圖。

## 網站的四種狀態

1. **Cherry Time 回放與 DLC 倒數。** Cherry Time 卡片記錄 11 月 27 日的發表會並連結至 YouTube 回放，會在阿德雷德時間 11 月 29 日午夜隱藏；《悲愴之海》卡片則倒數至 12 月 11 日。
2. **官方公布的發售日期到來。** 阿德雷德時間 12 月 11 日 00:00，倒數會切換為經過時間，並明確標示具體開放時間尚未公布。這不代表網站自動判定 DLC 已經開放。
3. **正式發售慶祝。** 維護者確認 DLC 已開放後，可將 `dlcReleased: true`、填入實際發售時間，並可設定官方公告連結。網站會切換成慶祝畫面，從設定的發售時刻開始累計時間。
4. **逾期等待。** 如果到了阿德雷德時間 12 月 12 日仍未將 DLC 標記為已開放，網站就會切換成帶有自嘲意味的逾期畫面，從該日期界線開始累計。

## 官方日期

| 日期 | 說明 |
| --- | --- |
| **2026/12/11** | Team Cherry 公布的《悲愴之海》DLC 發售日期。具體開放時間與時區尚未公布；網站僅以阿德雷德 00:00 作為日期界線。 |
| **2026/11/27 23:00 UTC+8**（阿德雷德 11/28 01:30） | Cherry Time 特別發表會。[前往 YouTube 重看](https://www.youtube.com/watch?v=M-QUgdcBpZU)。 |

DLC 日期與逾期起算時間使用 IANA **Australia/Adelaide** 時區，並包含日光節約時間；Cherry Time 則使用明確的 UTC+8 偏移量，確保所有訪客參照同一個時刻。

## 可安裝的 PWA（僅限線上使用）

安裝後的 App 名稱為 **Silksong DLC Countdown**（`name`）／**Silksong DLC**（`short_name`）。網站提供 Web App Manifest，並可在相容瀏覽器中以獨立 App 方式安裝。在 Android 上，使用瀏覽器的**安裝應用程式**或**新增至主畫面**；在 iOS 上，使用 Safari 的**加入主畫面**。各瀏覽器的安裝支援狀況不同。Chromium 觸發可安裝事件時，桌面版會在右下角、手機版會在畫面中央顯示小型邀請卡，提供**立即安裝**與**稍後再說**。關閉邀請後 24 小時內不會再次顯示。iOS Safari 則會顯示簡短的**分享 → 加入主畫面**提示；已安裝的獨立 App 不會顯示邀請卡。邀請卡會配合網站所選語言。

**使用本網站需要網際網路連線。** 本專案刻意不註冊 Service Worker，也不使用 Workbox、離線預快取或離線備援頁面。瀏覽器仍可能使用一般 HTTP 快取，但本網站並非離線優先應用程式。App Manifest 的範圍限定在 GitHub Pages 專案子路徑。

GitHub Actions 會從 `public/favicon.svg` 產生不透明背景的 PNG 安裝圖示：192×192 與 512×512 標準圖示、具有安全留白的 512×512 Android 遮罩圖示，以及 180×180 Apple 觸控圖示。修改 SVG 即可一起更新所有圖示；每次正式建置時，`scripts/render-icons.mjs` 都會將圖示產生到 `dist/`。

## 功能

- 桌面與手機版的自適應單畫面版面。
- 即時倒數與經過時間計時器。
- 自動偵測瀏覽器語言並記住選擇：英文、繁體中文、簡體中文、日文。
- 原創的青綠與金色 Canvas 粒子、發光弧線、指標視差、觸控火花與數字動畫。
- 支援減少動態效果設定，並降低手機版粒子數量。
- 來源連結、粉絲網站免責聲明、GitHub 連結與社群分享預覽圖。

## 維護者文件

- [倒數日期與 DLC 設定](./docs/zh_tw/configuration.md)
- [部署與本機測試](./docs/zh_tw/deploy.md)
- [Google Play AAB 設定](./docs/zh_tw/google_play.md)

**免責聲明：** 這是非官方粉絲專案，與 Team Cherry 無關。

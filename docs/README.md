# Documentation / 文件目錄

Maintainer guides for this project. Each topic has an English page and a Traditional Chinese page; the two versions cover the same steps.

本專案的維護者文件。每個主題都有英文與繁體中文頁面，兩邊說明相同的操作。

[Project README](../README.md) · [專案說明](../README_zh_tw.md)

| Topic / 主題 | English | 繁體中文 |
| --- | --- | --- |
| Countdown dates and DLC configuration<br>倒數日期與 DLC 設定 | [English](./en_us/configuration.md) | [繁體中文](./zh_tw/configuration.md) |
| Deployment and local testing<br>部署與本機測試 | [English](./en_us/deploy.md) | [繁體中文](./zh_tw/deploy.md) |
| Google Play AAB configuration<br>Google Play AAB 設定 | [English](./en_us/google_play.md) | [繁體中文](./zh_tw/google_play.md) |
| Demo screenshot history<br>Demo 畫面歷史紀錄 | [English](./en_us/demo-history.md) | [繁體中文](./zh_tw/demo-history.md) |

## What each guide covers / 各指南內容

### Countdown dates and DLC configuration / 倒數日期與 DLC 設定

Preview a simulated date or the release screen, and change the built-in Cherry Time, year-end, and overdue boundaries in `src/main.ts`.

預覽模擬日期或發售畫面，以及在 `src/main.ts` 修改內建的 Cherry Time、年底標記與逾期時間界線。

- [Preview a date or the DLC release screen](./en_us/configuration.md#preview-a-date-or-the-dlc-release-screen) · [預覽日期或 DLC 發售畫面](./zh_tw/configuration.md#預覽日期或-dlc-發售畫面)
- [Change the built-in countdown dates](./en_us/configuration.md#change-the-built-in-countdown-dates) · [修改內建倒數日期](./zh_tw/configuration.md#修改內建倒數日期)
- [Apply changes](./en_us/configuration.md#apply-changes) · [套用變更](./zh_tw/configuration.md#套用變更)

### Deployment and local testing / 部署與本機測試

Publish with GitHub Actions, or optionally preview the production build and the Vite dev server with Podman.

用 GitHub Actions 發布，或選擇以 Podman 預覽正式建置與 Vite 開發伺服器。

- [Automatic deployment with GitHub Actions](./en_us/deploy.md#automatic-deployment-with-github-actions) · [使用 GitHub Actions 自動部署](./zh_tw/deploy.md#使用-github-actions-自動部署)
- [Local production preview with Podman](./en_us/deploy.md#local-production-preview-with-podman) · [使用 Podman 預覽正式建置](./zh_tw/deploy.md#使用-podman-預覽正式建置)
- [Vite hot reload with Podman](./en_us/deploy.md#vite-hot-reload-with-podman) · [使用 Podman 啟動 Vite 熱更新](./zh_tw/deploy.md#使用-podman-啟動-vite-熱更新)

### Google Play AAB configuration / Google Play AAB 設定

Set up the upload key, build a signed Android App Bundle on GitHub Actions, and check Trusted Web Activity full-screen verification.

設定上傳金鑰、在 GitHub Actions 建置已簽署的 Android App Bundle，並檢查 Trusted Web Activity 全螢幕驗證。

- [One-time upload-key setup](./en_us/google_play.md#one-time-upload-key-setup) · [一次性上傳金鑰設定](./zh_tw/google_play.md#一次性上傳金鑰設定)
- [Build and upload an AAB](./en_us/google_play.md#build-and-upload-an-aab) · [建置並上傳 AAB](./zh_tw/google_play.md#建置並上傳-aab)
- [Verify the full-screen TWA](./en_us/google_play.md#verify-the-full-screen-twa) · [驗證全螢幕 TWA](./zh_tw/google_play.md#驗證全螢幕-twa)


### Demo screenshot history / Demo 畫面歷史紀錄

Browse the historical countdown layouts and simulated overdue/release screens preserved in `demo/`.

瀏覽 `demo/` 中保存的歷史倒數版面，以及逾期等待／發售慶祝狀態預覽。

- [Demo screenshot history](./en_us/demo-history.md) · [Demo 畫面歷史紀錄](./zh_tw/demo-history.md)

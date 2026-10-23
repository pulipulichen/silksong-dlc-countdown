# 部署與本機測試

[English](../en_us/deploy.md) · [繁體中文](./deploy.md)

## 使用 GitHub Actions 自動部署

發布網站不需要在本機安裝 Node.js、npm 或執行建置。每次推送到 `main`，GitHub-hosted runner 就會啟動[部署至 GitHub Pages 工作流程](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)。工作流程會：

1. Checkout 儲存庫並設定 Node.js 22。
2. 安裝 npm 相依套件。
3. 執行 `npm run build`（TypeScript 檢查、Vite 正式建置，以及社群預覽圖與 App 圖示產生）。
4. 驗證建置結果，並將 `dist/` 部署至 GitHub Pages。

首次部署前，請到 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。工作流程會檢查此設定；若 Pages 使用分支發布，會顯示修正指引並停止。也可以在 **Actions → Deploy to GitHub Pages → Run workflow** 手動啟動部署。

正式網站：<https://pulipulichen.github.io/silksong-dlc-countdown/>

## 使用 Podman 預覽正式建置

本機測試為選用。若不想在主機安裝 Node.js 或 npm，可在儲存庫根目錄執行以下指令，在容器內建置並提供正式網站：

```sh
podman build -t silksong-dlc-countdown -f Containerfile .
podman run --rm -p 8080:80 silksong-dlc-countdown
```

開啟 <http://localhost:8080/silksong-dlc-countdown/>。按 **Ctrl+C** 停止容器。

## 使用 Podman 啟動 Vite 熱更新

若要在修改原始碼時自動更新預覽，請在儲存庫根目錄執行：

```sh
./start.sh
```

此方式需要 Podman。腳本會建置開發映像，並將原始碼目錄掛載至容器。開啟 <http://localhost:8080/silksong-dlc-countdown/>，按 **Ctrl+C** 停止伺服器。

本專案沒有獨立的 `npm test` 指令；部署使用的 `npm run build` 會執行 TypeScript 檢查與正式建置。

原始碼中的日期與 DLC 狀態設定請參閱[倒數日期與 DLC 設定](./configuration.md)。Android App Bundle 請參閱 [Google Play AAB 設定](./google_play.md)。

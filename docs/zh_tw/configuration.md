# 倒數日期與 DLC 設定

[English](../en_us/configuration.md) · [繁體中文](./configuration.md)

本指南供維護者使用。以下設定需修改程式碼，不會成為網站訪客可操作的控制項。

## 預覽日期或 DLC 發售畫面

修改 `src/main.ts` 前段的 `simulationSettings` 設定物件：

- `mode: "auto"` 使用目前真實時間；改成 `"custom"` 後，會改用 `date` 模擬時間。
- `date` 使用 `YYYY-MM-DD` 格式。模擬時鐘從該日期的**澳洲／阿德雷德時間午夜 00:00**開始，並從頁面載入時起依真實時間前進。日期無效時，程式會退回使用目前真實時間。
- `dlcReleased: true` 是手動覆寫，可用來預覽發售慶祝畫面，或在官方提早開放時手動標記；維持 `false` 即可使用預定的自動切換。
- `dlcAutoReleaseAt` 是自動切換時間，預設為 `2026-12-12T00:00:00+08:00`（台灣時間 12/12 00:00，UTC+8）。必須包含明確時區；清空此值即可停用自動切換。
- `dlcReleasedAt` 是發售後經過時間的起算時間，預設與 `dlcAutoReleaseAt` 相同；若官方確認更早的實際開放時間，請改填該時間。留空或格式無效時，經過時間會顯示 `--`。
- `dlcAnnouncementUrl` 可設定絕對 `http://` 或 `https://` 公告網址，以顯示公告按鈕；留空則隱藏按鈕。

以下設定會預覽 **2026 年 12 月 1 日**的發售慶祝畫面。提供有效的實際發售時間前，經過時間會保持未設定：

```ts
const simulationSettings: SimulationSettings = {
  mode: "custom",
  date: "2026-12-01",
  dlcReleased: true,
  dlcAutoReleaseAt: "",
  dlcReleasedAt: "",
  dlcAnnouncementUrl: "",
};
```

要恢復即時時間，將 `mode` 改回 `"auto"`。儲存程式碼後，需重新建置／部署，公開網站才會套用變更。

## 修改內建倒數日期

內建目標日期與相關時間界線定義於 `src/main.ts`：

- Team Cherry 已公布《悲愴之海》於 **2026 年 12 月 11 日推出**。倒數會完整涵蓋當天，並於 **2026 年 12 月 12 日 00:00（Australia/Adelaide）**到期，也就是 12 月 11 日結束的那一刻。這是倒數期限，不代表官方公布了 DLC 的具體開放時間。
- 若當時仍未標記為已發售，逾時計時就會從阿德雷德午夜的時間界線開始。
- 網站會在 **2026/12/12 00:00（台灣時間，UTC+8）**自動切換為 DLC 已發售的慶祝畫面。這是網站預先設定的自動切換時間，不代表官方公布的實際開放時間。切換由瀏覽器即時判斷，即使訪客一直開著頁面，也不需要重新整理或依賴 GitHub Actions 排程。

DLC 倒數目標與逾期時間界線透過 `adelaideMidnight` 函式建立，會依 `Australia/Adelaide` 時區及日光節約時間計算；自動發售切換則使用 `dlcAutoReleaseAt` 中明確指定的 UTC 時差，不受訪客所在地時區影響。修改日期時，請一併檢查兩個時間設定，以及 `src/i18n.ts` 中與日期相關的文字，確保單一倒數畫面資訊一致。

若官方確認 DLC 會在預定切換時間之前開放，請將 `dlcReleased` 設為 `true`，並將 `dlcReleasedAt` 改成確認的實際時間。清空 `dlcAutoReleaseAt` 即可停用自動切換。

## 套用變更

將程式碼變更提交至 `main` 後，GitHub Actions 會負責建置與部署網站。請參閱[部署與本機測試](./deploy.md)。

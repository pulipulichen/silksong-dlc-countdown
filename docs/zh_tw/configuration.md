# 倒數日期與 DLC 設定

[English](../en_us/configuration.md) · [繁體中文](./configuration.md)

本指南供維護者使用。以下設定需修改程式碼，不會成為網站訪客可操作的控制項。

## 預覽日期或 DLC 發售畫面

修改 `src/main.ts` 前段的 `simulationSettings` 設定物件：

- `mode: "auto"` 使用目前真實時間；改成 `"custom"` 後，會改用 `date` 模擬時間。
- `date` 使用 `YYYY-MM-DD` 格式。模擬時鐘從該日期的**澳洲／阿德雷德時間午夜 00:00**開始，並從頁面載入時起依真實時間前進。日期無效時，程式會退回使用目前真實時間。
- `dlcReleased: true` 顯示對應語言的發售慶祝畫面；設為 `false` 則顯示倒數或逾期畫面。
- `dlcReleasedAt` 是已確認的實際發售時間。必須包含明確時區，例如 `Z` 或 `+09:30`，確保所有訪客都從同一時刻開始計時。留空或格式無效時，經過時間會顯示 `--`。
- `dlcAnnouncementUrl` 可設定絕對 `http://` 或 `https://` 公告網址，以顯示公告按鈕；留空則隱藏按鈕。

以下設定會預覽 **2026 年 12 月 1 日**的發售慶祝畫面。提供有效的實際發售時間前，經過時間會保持未設定：

```ts
const simulationSettings: SimulationSettings = {
  mode: "custom",
  date: "2026-12-01",
  dlcReleased: true,
  dlcReleasedAt: "",
  dlcAnnouncementUrl: "",
};
```

要恢復即時時間，將 `mode` 改回 `"auto"`。儲存程式碼後，需重新建置／部署，公開網站才會套用變更。

## 修改內建倒數日期

內建目標日期與相關時間界線定義於 `src/main.ts`：

- DLC 年底標記為 **2026 年 12 月 31 日阿德雷德午夜**。
- 零售商標示的 Switch 2 實體版日期為 **2026 年 11 月 27 日阿德雷德午夜**。對應卡片會在下一個阿德雷德午夜（11 月 28 日）隱藏。
- 逾期計時從 **2027 年 1 月 1 日阿德雷德午夜**開始。

這些日期透過 `adelaideMidnight` 函式建立，會依 `Australia/Adelaide` 時區及日光節約時間計算。修改目標日期時，也請檢查相關的卡片隱藏／逾期時間界線，以及 `src/i18n.ts` 中與日期相關的文字，確保畫面資訊一致。

DLC 日期是粉絲選定的年底標記，並非官方確認的發售日。Switch 2 日期來自零售商標示，該日期與 DLC 的關聯也未經證實。

## 套用變更

將程式碼變更提交至 `main` 後，GitHub Actions 會負責建置與部署網站。請參閱[部署與本機測試](./deploy.md)。

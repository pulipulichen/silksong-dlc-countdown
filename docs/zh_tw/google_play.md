# Google Play AAB 設定

[English](../en_us/google_play.md) · [繁體中文](./google_play.md)

Android App 使用 Trusted Web Activity（TWA）開啟現有的線上網站，不包含小工具或通知。套件 ID 為 `io.github.pulipulichen.silksongdlccountdown`；發布後請勿變更。此工作流程不需要在本機安裝 Android SDK 或建置 Android App。

## 一次性上傳金鑰設定

請在安全的環境中建立長期使用的上傳金鑰庫，並在 GitHub 以外妥善備份原始金鑰庫與密碼。金鑰別名必須是 `upload`。以下指令範例只需在可信任的環境執行一次，請勿提交產生的檔案：

```sh
keytool -genkeypair -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore
```

到儲存庫的 **Settings → Secrets and variables → Actions → Secrets** 新增以下 secrets：

- `ANDROID_KEYSTORE_BASE64`：二進位 JKS／PKCS12 上傳金鑰庫的單行 Base64 編碼。
- `ANDROID_KEYSTORE_PASSWORD`：金鑰庫密碼。
- `ANDROID_KEY_PASSWORD`：上傳金鑰密碼。

工作流程會從 secret 還原金鑰庫，並確認其中有 `upload` 別名。請勿提交金鑰庫、密碼或 secret 值。Google Play App Signing 使用 Google 的 App 簽署金鑰為使用者簽署發行版本；上傳金鑰則用於提交 App，兩者的憑證指紋可能不同。

## 建置並上傳 AAB

1. 前往 **Actions → Build Google Play AAB → Run workflow**。
2. 輸入唯一且遞增的正整數 `version_code`（例如首次上傳用 `1`，下一次用 `2`），並設定 `version_name`。
3. 工作流程成功後，下載 **silksong-dlc-countdown-aab** artifact。
4. 將其中的 `.aab` 上傳到 Google Play Console。

工作流程會為該次建置更新 Android 版本資訊、還原上傳金鑰，並在 GitHub Actions 上建置已簽署的 App Bundle。Artifact 保留三天。此工作流程刻意不會直接發布至 Google Play。

## 驗證全螢幕 TWA

Digital Asset Links 必須由網站來源網域根目錄提供：<https://pulipulichen.github.io/.well-known/assetlinks.json>。檔案必須授權 `delegate_permission/common.handle_all_urls`，使用套件 ID `io.github.pulipulichen.silksongdlccountdown`，並包含 **Google Play App 簽署憑證的 SHA-256 指紋**；可在 **Play Console → App integrity** 查詢。

GitHub Pages 專案網站位於 `/silksong-dlc-countdown/` 子路徑，無法由此儲存庫獨立提供網域根目錄的 `/.well-known/assetlinks.json`。網站擁有者必須設定根網域檔案，或改用可自行管理根目錄路徑的網域。在 Digital Asset Links 驗證成功前，Chrome 可能會顯示網址列，而不是全螢幕 App。此處應使用 Play App 簽署憑證指紋，不要假設上傳金鑰指紋就是相同值。

TWA 的主機網域與起始路徑設定於 `android/twa-manifest.json`。若網站來源網域或專案路徑變更，也請檢查該 manifest 與 Digital Asset Links 設定。

網站部署及選用的本機預覽方式請參閱[部署與本機測試](./deploy.md)。

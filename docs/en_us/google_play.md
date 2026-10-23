# Google Play AAB configuration

[English](./google_play.md) · [繁體中文](../zh_tw/google_play.md)

The Android app is a Trusted Web Activity (TWA) that opens the existing online website. It does not include widgets or notifications. The package ID is `io.github.pulipulichen.silksongdlccountdown`; keep it unchanged after publishing. No Android SDK or local Android build is required for this workflow.

## One-time upload-key setup

Create a long-lived upload keystore in a secure environment. Back up the original keystore and its passwords somewhere outside GitHub. The key alias must be `upload`. For example, run these commands once in a trusted environment and do not commit the generated file:

```sh
keytool -genkeypair -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore
```

Add these repository secrets under **Settings → Secrets and variables → Actions → Secrets**:

- `ANDROID_KEYSTORE_BASE64`: single-line Base64 encoding of the binary JKS/PKCS12 upload keystore.
- `ANDROID_KEYSTORE_PASSWORD`: the keystore password.
- `ANDROID_KEY_PASSWORD`: the upload-key password.

The workflow restores the keystore from the secret and verifies that it contains the `upload` alias. Never commit the keystore, passwords, or secret values. Google Play App Signing uses Google's app-signing key for distributed builds; the upload key is used to submit them and its certificate fingerprint may differ.

## Build and upload an AAB

1. Open **Actions → Build Google Play AAB → Run workflow**.
2. Enter a unique, increasing positive integer for `version_code` (for example, `1` for the first upload and `2` for the next) and set `version_name`.
3. After the workflow succeeds, download the **silksong-dlc-countdown-aab** artifact.
4. Upload the `.aab` to Google Play Console.

The workflow updates the Android version values for that build, restores the upload key, and builds a signed bundle on GitHub Actions. The artifact is retained for three days. This workflow deliberately does not publish the app to Google Play.

## Verify the full-screen TWA

Digital Asset Links must be served from the website origin's root at <https://pulipulichen.github.io/.well-known/assetlinks.json>. The file must authorize `delegate_permission/common.handle_all_urls`, use package ID `io.github.pulipulichen.silksongdlccountdown`, and include the **Google Play app-signing certificate SHA-256 fingerprint** from **Play Console → App integrity**.

A GitHub Pages project site is hosted below `/silksong-dlc-countdown/` and cannot serve the origin-root `/.well-known/assetlinks.json` from this repository. The site owner must configure that root-origin file or use a domain where the root path can be managed. Until Digital Asset Links verification succeeds, Chrome may show its address bar rather than presenting the app full-screen. Use the Play app-signing certificate fingerprint here, not a fingerprint assumed from the upload keystore.

The TWA host and start path are configured in `android/twa-manifest.json`. If the website origin or project path changes, review that manifest and the Digital Asset Links configuration as well.

For website deployment and optional local previews, see [Deployment and local testing](./deploy.md).

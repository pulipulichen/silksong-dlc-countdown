# The Long Wait — Silksong DLC Fan Countdown

[English](./README.md) · [繁體中文](./README_zh_tw.md)

[![Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)

**[Open the live website](https://pulipulichen.github.io/silksong-dlc-countdown/)**

An animated, multilingual **unofficial fan countdown** that changes with the wait for *Hollow Knight: Silksong — Sea of Sorrow*: two milestones, a final countdown, a release celebration, or an overdue surprise. Built with static Vite + TypeScript + CSS + Canvas, with no backend or official game artwork.

## Four possible futures — screenshot showcase

What if the wait continues? What if the DLC finally arrives? This site is designed to tell that story as time passes, with four possible visual states rather than a static countdown page.

> **Scenario previews:** The following images demonstrate possible site states using simulated dates and a manually configured release flag. They are not evidence of an official release date, delay, or launch. The website does **not** automatically verify DLC announcements.

### 1. Two dates, one long wait — dual countdown

![Two side-by-side countdowns for the Switch 2 physical edition and Sea of Sorrow DLC](./demo/demo_wait_switch_2.png)

Before the end of November 2026, two cards appear side by side. The first watches **November 27, 2026**, the retailer-listed Switch 2 physical-edition date; the second watches the fan-selected **December 31, 2026** year-end DLC marker. Both tick down in days, hours, minutes, and seconds.

The Switch 2 date is **not** an announced DLC release date. Its connection to the DLC is speculation.

### 2. One countdown remains — the end of 2026 approaches

![Single centered Sea of Sorrow DLC countdown card](./demo/demo_wait_2026_end.png)

Beginning **November 28, 2026** in Adelaide, the Switch 2 reference card disappears. The remaining card takes center stage as fans watch the final days of the year Team Cherry targeted for the free expansion. The moving ocean backdrop keeps the anticipation alive.

**December 31 is a fan-selected year-end checkpoint, not a confirmed launch date.**

### 3. The wait is over — release celebration

![Simulated DLC release celebration with balloons and elapsed-time counter](./demo/demo_dlc_released.png)

If the DLC is officially released, the maintainer can set `dlcReleased: true`, provide the verified release timestamp, and optionally link to the announcement. The experience switches to a festive teal-and-gold celebration with balloons and confetti, a release announcement button, and a **count-up timer showing time since release**.

**This is a hypothetical preview, not confirmation that the DLC has been released.** The release status and timestamp must be updated in the source code.

### 4. Still waiting — 2026 is over, but where is the DLC?

![Overdue DLC state with a clown-inspired fan illustration and elapsed-time counter](./demo/demo_dlc_not_released_yet.png)

If the expansion remains unreleased when **January 1, 2027** begins in Adelaide, the atmosphere transforms: dark crimson tones, a clown-inspired fan illustration, and a tongue-in-cheek **"2026 is over — where's the DLC?"** message. The clock now counts **up from the start of 2027**, making every extra day of waiting visible.

This playful overdue state reflects an unfulfilled anticipated *year*, **not** a claim that Team Cherry promised a December 31 launch.

## The two dates

| Target at Australia/Adelaide midnight | What it means |
| --- | --- |
| **2026-12-31 00:00** | Fan-selected year-end marker for the *Sea of Sorrow* DLC. Team Cherry announced a free expansion planned for **2026**, **not** an official December 31 release date. [Team Cherry announcement](https://www.teamcherry.com.au/blog/holiday2025) · [DLC teaser (0:28)](https://youtu.be/qDFEeeLy6ws?t=28). |
| **2026-11-27 00:00** | Retailer-listed date for the postponed **Switch 2 physical edition**. Any DLC launch on the same day is **unconfirmed fan speculation**. [Retailer listing](https://www.tvgame.com.tw/SalePage/Index/11873934?lang=zh-TW). |

Both counters use the IANA **Australia/Adelaide** time zone, including daylight saving. When a date passes, its timer displays an arrival message and counts **up** (days / hours / minutes / seconds).

## Installable PWA (online only)

The installed app is named **Silksong DLC Countdown** (`name`) / **Silksong DLC** (`short_name`), rather than Sea of Sorrow. This site provides a web app manifest and an installable standalone experience in compatible browsers. On Android, use the browser's **Install app** or **Add to Home screen** action; on iOS, use Safari's **Add to Home Screen**. Installation support varies by browser. When Chromium fires the installability event, a small bottom-right invitation on desktop or centered invitation on mobile offers **Install now** and **Maybe later**. Dismissing it suppresses the invitation for 24 hours. iOS Safari instead displays brief **Share → Add to Home Screen** instructions; installed standalone apps do not show the invitation. The card follows the selected site language.

**An internet connection is required**. This project intentionally does **not** register a service worker or use Workbox, offline precaching, or an offline fallback. The browser may still use its ordinary HTTP cache; this is not an offline-first application. The app's manifest is scoped to the GitHub Pages project subpath.

GitHub Actions generates opaque PNG installation icons from `public/favicon.svg`: 192×192 and 512×512 standard icons, a 512×512 maskable Android icon with safe padding, and a 180×180 Apple touch icon. Edit the SVG to update all icons together; `scripts/render-icons.mjs` creates the files in `dist/` during every production build.

## Features

- Single-screen responsive desktop/mobile layout without document scrolling.
- Two live countdown/elapsed-time timers, with source-configurable simulated time and DLC release status.
- Browser-language detection and remembered selection: English, Traditional Chinese, Simplified Chinese, Japanese.
- Original abstract teal-and-gold Canvas particles, glowing arcs, pointer parallax, touch sparks and digit animations.
- Reduced-motion accessibility support and lower mobile particle counts.
- Source references, fan-site disclaimer, GitHub link and social preview.

## Configure simulated time and DLC release status

Edit the `simulationSettings` object near the top of `src/main.ts`. These settings are code-only and do not appear as controls on the website:

- `mode: "auto"` uses the real current time. Set it to `"custom"` to preview the configured date.
- `date` is the simulation start date in `YYYY-MM-DD` format. It starts at **00:00 Australia/Adelaide time** and advances in real time from when the page loads.
- `dlcReleased: true` selects the localized release-celebration screen; `false` keeps the countdown or overdue screen. Set `dlcReleasedAt` to the confirmed release timestamp with an explicit time zone (`Z` or a UTC offset) to start the elapsed timer. If the timestamp is empty or invalid, the timer remains unset (`--`) instead of inventing a release time.
- `dlcAnnouncementUrl` accepts an absolute `http://` or `https://` URL for the announcement button. Leave it empty to hide the button.

For example, to preview **2026-12-01** with the released screen enabled, set the object as shown below. The elapsed timer stays unset until you configure the actual release timestamp:

```ts
const simulationSettings: SimulationSettings = {
  mode: "custom",
  date: "2026-12-01",
  dlcReleased: true,
};
```

To return to real time, change `mode` back to `"auto"`. Save the source change and rebuild/redeploy the site for the public website to use it.

## Automatic build & deployment — GitHub Actions

**Nothing needs to be downloaded, installed, or compiled on your computer to publish the site.**

Every push to `main` automatically starts [Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml) using a GitHub-hosted runner:

1. Checkout code and install Node.js 22 **on GitHub Actions**.
2. Install npm dependencies **on GitHub Actions**.
3. Run `npm run build` **on GitHub Actions** (TypeScript check, Vite production build, and generated social preview).
4. Verify the generated static files and deploy the `dist/` output to GitHub Pages.

Website: **https://pulipulichen.github.io/silksong-dlc-countdown/**

If needed, enable **Settings → Pages → Build and deployment → Source: GitHub Actions** once. You can also manually dispatch the workflow using **Actions → Deploy to GitHub Pages → Run workflow**.


## Google Play AAB (GitHub Actions only)

The Android release uses a Trusted Web Activity (TWA), opening the existing online-only website without widgets or notifications. The package ID is `io.github.pulipulichen.silksongdlccountdown`. Do not change it after publishing. No Android SDK or local compilation is needed.

**One-time signing setup**: Create a long-lived upload keystore in a secure environment, store a backup outside GitHub, and add three repository **Settings → Secrets and variables → Actions → Secrets**:

- `ANDROID_KEYSTORE_BASE64`: base64 encoding of the binary JKS/PKCS12 upload keystore (single line).
- `ANDROID_KEYSTORE_PASSWORD`: the keystore password.
- `ANDROID_KEY_PASSWORD`: the upload key password.

The key alias must be **`upload`**. Example creation command (run once in a trusted environment; do not commit the resulting file):

```sh
keytool -genkeypair -v -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore
```

Keep the original keystore and passwords safe. For Google Play App Signing, this is your upload key, not Google's app-signing key.

Go to **Actions → Build Google Play AAB → Run workflow**, enter a unique, increasing `version_code` (1 for first upload, 2 for next, etc.) and `version_name`. After the job succeeds, download the **silksong-dlc-countdown-aab** artifact and upload its `.aab` to Google Play Console. Artifact retention is three days. The workflow intentionally does not publish to Google Play.

**Required for full-screen TWA**: Configure Digital Asset Links on the website at `https://pulipulichen.github.io/.well-known/assetlinks.json` with `delegate_permission/common.handle_all_urls`, the package ID above, and the **Google Play app signing certificate SHA-256** (from Play Console → App integrity). GitHub Pages project sites cannot independently serve a root-origin `/.well-known/` file from this repository's subpath. The owner must configure the root origin (or move to a controlled custom domain). Without successful verification, Chrome may show its address bar instead of full-screen TWA. The upload-key fingerprint is not necessarily the Play app-signing fingerprint.

## Optional local testing with Podman

**Local testing is never required for deployment**. If you want a local preview, Podman builds everything inside a container, without installing Node.js or npm on the host:

```bash
podman build -t silksong-dlc-countdown -f Containerfile .
podman run --rm -p 8080:80 silksong-dlc-countdown
```

Preview: http://localhost:8080/silksong-dlc-countdown/

For Vite hot reload while editing source files, run `./start.sh` (Podman required). It builds the development image and serves the same preview URL with the project source mounted into the container.

## Change built-in countdown dates or translations

To configure the simulated time or DLC release status, edit the `simulationSettings` object in `src/main.ts` as described above. To change the built-in target dates or countdown logic, edit the relevant code in `src/main.ts`; edit `src/i18n.ts` for translations. Commit source changes to `main`, and GitHub Actions will build and deploy the site.

**Disclaimer**: This is an unofficial fan project, unaffiliated with Team Cherry. Neither date is confirmed as the DLC release date.

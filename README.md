# Sea of Sorrow — Silksong DLC Countdown

[English](./README.md) · [繁體中文](./README_zh_tw.md)

[![Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)

**[Open the live website](https://pulipulichen.github.io/silksong-dlc-countdown/)**

An animated, multilingual **unofficial fan countdown** for *Hollow Knight: Silksong — Sea of Sorrow*. Team Cherry announced **December 11, 2026** as the release date for the free Sea of Sorrow expansion. The exact launch time and time zone were not announced.

## Current countdown

- **Official release date:** December 11, 2026.
- **Exact launch time:** Not announced.
- **Countdown convention:** The site uses 00:00 in **Australia/Adelaide** as the start-of-date boundary. This is not a claim that the DLC launches at midnight.
- **Overdue state:** If the DLC has not been marked as released, the overdue timer begins at Adelaide midnight on December 12.

> The images in `demo/` are archived previews captured before the official December 11, 2026 release date was announced. They may show the previous fan-selected December 31 marker and the former year-end overdue boundary; they are not screenshots of the current live schedule.

## Countdown states

1. **Sea of Sorrow countdown.** The single countdown card counts down to the announced December 11 release date.
2. **The announced release date arrives.** At Adelaide midnight on December 11, the countdown changes to an elapsed-time display labelled to make clear that the exact launch time is still unknown. This does not automatically mark the DLC as released.
3. **Release celebration.** After verifying that the DLC is available, the maintainer can set `dlcReleased: true`, enter the actual release timestamp, and optionally link to the official announcement. The site switches to a celebration screen and counts up from the configured release instant.
4. **Overdue.** If the DLC has not been marked as released by December 12 in Adelaide, the site switches to its playful overdue presentation and counts up from that date boundary.

## Official dates

| Date | Meaning |
| --- | --- |
| **2026-12-11** | Team Cherry's announced Sea of Sorrow release date. The exact launch time and time zone have not been announced. The website uses 00:00 Adelaide only as a calendar boundary. |

The release date and overdue boundary use the IANA **Australia/Adelaide** time zone, including daylight saving.

## Installable PWA (online only)

The installed app is named **Sea of Sorrow Countdown** (`name`) / **Sea of Sorrow** (`short_name`). This site provides a web app manifest and an installable standalone experience in compatible browsers. On Android, use the browser's **Install app** or **Add to Home screen** action; on iOS, use Safari's **Add to Home Screen**. Installation support varies by browser. When Chromium fires the installability event, a small bottom-right invitation on desktop or centered invitation on mobile offers **Install now** and **Maybe later**. Dismissing it suppresses the invitation for 24 hours. iOS Safari instead displays brief **Share → Add to Home Screen** instructions; installed standalone apps do not show the invitation. The card follows the selected site language.

**An internet connection is required.** This project intentionally does **not** register a service worker or use Workbox, offline precaching, or an offline fallback. The browser may still use its ordinary HTTP cache; this is not an offline-first application. The app's manifest is scoped to the GitHub Pages project subpath.

GitHub Actions generates opaque PNG installation icons from `public/favicon.svg`: 192×192 and 512×512 standard icons, a 512×512 maskable Android icon with safe padding, and a 180×180 Apple touch icon. Edit the SVG to update all icons together; `scripts/render-icons.mjs` creates the files in `dist/` during every production build.

## Features

- Single-screen responsive desktop/mobile layout.
- Live countdown and elapsed-time timers.
- Browser-language detection and remembered selection: English, Traditional Chinese, Simplified Chinese, Japanese.
- Original abstract teal-and-gold Canvas particles, glowing arcs, pointer parallax, touch sparks and digit animations.
- Reduced-motion accessibility support and lower mobile particle counts.
- Source references, fan-site disclaimer, GitHub link and social preview.

## Developer documentation

- [Countdown dates and DLC configuration](./docs/en_us/configuration.md)
- [Deployment and local testing](./docs/en_us/deploy.md)
- [Google Play AAB configuration](./docs/en_us/google_play.md)

**Disclaimer:** This is an unofficial fan project, unaffiliated with Team Cherry.

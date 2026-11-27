# Sea of Sorrow — Silksong DLC Countdown

[English](./README.md) · [繁體中文](./README_zh_tw.md)

[![Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)

**[Open the live website](https://pulipulichen.github.io/silksong-dlc-countdown/)**

An animated, multilingual **unofficial fan countdown** for *Hollow Knight: Silksong — Sea of Sorrow*. Team Cherry announced **December 11, 2026** as the release date for the free Sea of Sorrow expansion. The exact launch time and time zone were not announced.

## Current countdown

- **Official release date:** December 11, 2026.
- **Exact launch time:** Not announced.
- **Countdown deadline:** **December 12, 2026, at 00:00 Australia/Adelaide** — the instant December 11 ends. The countdown therefore covers the full December 11 calendar day; this is not a claim that the DLC launches at midnight.
- **Overdue state:** If the DLC has not been marked as released by that deadline, the overdue timer begins at the same boundary.

> The images in `demo/` are archived previews captured before the official December 11, 2026 release date was announced. They may show the previous fan-selected December 31 marker and the former year-end overdue boundary; they are not screenshots of the current live schedule.

## Countdown states

1. **Sea of Sorrow countdown.** The single countdown card counts down through all of December 11 and reaches its deadline at Adelaide midnight as December 12 begins.
2. **Overdue.** If the DLC has not been marked as released by that deadline, the site switches to its overdue presentation and counts up from the same boundary. This does not automatically mark the DLC as released.
3. **Release celebration.** After verifying that the DLC is available, the maintainer can set `dlcReleased: true`, enter the actual release timestamp, and optionally link to the official announcement. The site switches to a celebration screen and counts up from the configured release instant.

## Official dates

| Date | Meaning |
| --- | --- |
| **2026-12-11** | Team Cherry's announced Sea of Sorrow release date. The exact launch time and time zone have not been announced. The countdown deadline is 00:00 Adelaide time on December 12, when December 11 ends. |

The release date and countdown deadline use the IANA **Australia/Adelaide** time zone, including daylight saving.

## Official trailers

- [Original teaser](https://www.youtube.com/watch?v=qDFEeeLy6ws)
- [Launch trailer](https://www.youtube.com/watch?v=7hj4g173FhM)

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

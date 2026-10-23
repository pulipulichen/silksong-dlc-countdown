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
- Two live countdown/elapsed-time timers.
- Browser-language detection and remembered selection: English, Traditional Chinese, Simplified Chinese, Japanese.
- Original abstract teal-and-gold Canvas particles, glowing arcs, pointer parallax, touch sparks and digit animations.
- Reduced-motion accessibility support and lower mobile particle counts.
- Source references, fan-site disclaimer, GitHub link and social preview.

## Developer documentation

- [Countdown dates and DLC configuration](./docs/en_us/configuration.md)
- [Deployment and local testing](./docs/en_us/deploy.md)
- [Google Play AAB configuration](./docs/en_us/google_play.md)

**Disclaimer**: This is an unofficial fan project, unaffiliated with Team Cherry. Neither date is confirmed as the DLC release date.

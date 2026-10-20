# The Long Wait — Silksong DLC Fan Countdown

A full-screen animated, multilingual **unofficial fan countdown** for two dates fans are watching. Built with **Vite + vanilla TypeScript + CSS + Canvas**. This is a static site with **no backend**, no game artwork or character imagery, and no affiliation with Team Cherry.

## The two countdowns

| Adelaide local midnight | What it means |
| --- | --- |
| **2026-12-31 00:00** | Fan-selected year-end marker for the *Sea of Sorrow* DLC. Team Cherry announced a free expansion planned for **2026**, but has **not** announced December 31 as its release date. [Team Cherry announcement](https://www.teamcherry.com.au/blog/holiday2025) · [DLC teaser (0:28)](https://youtu.be/qDFEeeLy6ws?t=28). |
| **2026-11-27 00:00** | A retailer-listed date for the postponed **Switch 2 physical edition**. Any DLC release at the same time is **unconfirmed fan speculation**. [Retailer listing](https://www.tvgame.com.tw/SalePage/Index/11873934?lang=zh-TW). |

Date calculations use the browser's IANA **Australia/Adelaide** time zone rules (including daylight saving). When each date passes, the counter displays a "day has arrived" message and switches to **elapsed time** (days / hours / minutes / seconds).

## Features

- Fits the entire viewport on desktop and mobile, with no page scrollbar.
- Two independent live countdown / elapsed-time timers.
- Browser-language auto-detection with fallback to English. Manual switch and saved preference for English, Traditional Chinese, Simplified Chinese, and Japanese.
- Original abstract teal/gold fantasy look: animated Canvas particles, concentric arcs, responsive pointer parallax, subtle touch sparks, rolling digits.
- Respects `prefers-reduced-motion` and automatically uses fewer particles on narrow screens.
- Source references, explicit unofficial-fan disclaimer, GitHub repo footer link and social sharing metadata.

## Local development

Requires Node.js 20.19+ or 22+.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

Vite's base path is set to `/silksong-dlc-countdown/`.

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Pushing to `main` runs the build/deploy workflow.

Expected public URL: https://pulipulichen.github.io/silksong-dlc-countdown/

## Updating dates or text

Edit `src/main.ts` for the countdown target dates and `src/i18n.ts` for all four translations. Keep any announced date distinct from fan theories.

**Disclaimer:** This is a fan project, not an official Team Cherry announcement. Neither countdown date is confirmed as a DLC release date.

## Maintainer reminder

記得把Readme寫好一點

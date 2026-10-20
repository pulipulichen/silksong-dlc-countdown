# The Long Wait — Silksong DLC Fan Countdown

[![Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml)

**[Open the live website](https://pulipulichen.github.io/silksong-dlc-countdown/)**

A full-screen animated, multilingual **unofficial fan countdown** for two dates fans are watching. Static Vite + TypeScript + CSS + Canvas, no backend and no game artwork or characters.

## The two dates

| Target at Australia/Adelaide midnight | What it means |
| --- | --- |
| **2026-12-31 00:00** | Fan-selected year-end marker for the *Sea of Sorrow* DLC. Team Cherry announced a free expansion planned for **2026**, **not** an official December 31 release date. [Team Cherry announcement](https://www.teamcherry.com.au/blog/holiday2025) · [DLC teaser (0:28)](https://youtu.be/qDFEeeLy6ws?t=28). |
| **2026-11-27 00:00** | Retailer-listed date for the postponed **Switch 2 physical edition**. Any DLC launch on the same day is **unconfirmed fan speculation**. [Retailer listing](https://www.tvgame.com.tw/SalePage/Index/11873934?lang=zh-TW). |

Both counters use the IANA **Australia/Adelaide** time zone, including daylight saving. When a date passes, its timer displays an arrival message and counts **up** (days / hours / minutes / seconds).

## Features

- Single-screen responsive desktop/mobile layout without document scrolling.
- Two live countdown/elapsed-time timers.
- Browser-language detection and remembered selection: English, Traditional Chinese, Simplified Chinese, Japanese.
- Original abstract teal-and-gold Canvas particles, glowing arcs, pointer parallax, touch sparks and digit animations.
- Reduced-motion accessibility support and lower mobile particle counts.
- Source references, fan-site disclaimer, GitHub link and social preview.

## Automatic build & deployment — GitHub Actions

**Nothing needs to be downloaded, installed, or compiled on your computer to publish the site.**

Every push to `main` automatically starts [Deploy to GitHub Pages](https://github.com/pulipulichen/silksong-dlc-countdown/actions/workflows/deploy.yml) using a GitHub-hosted runner:

1. Checkout code and install Node.js 22 **on GitHub Actions**.
2. Install npm dependencies **on GitHub Actions**.
3. Run `npm run build` **on GitHub Actions** (TypeScript check, Vite production build, and generated social preview).
4. Verify the generated static files and deploy the `dist/` output to GitHub Pages.

Website: **https://pulipulichen.github.io/silksong-dlc-countdown/**

If needed, enable **Settings → Pages → Build and deployment → Source: GitHub Actions** once. You can also manually dispatch the workflow using **Actions → Deploy to GitHub Pages → Run workflow**.

## Optional local testing with Podman

**Local testing is never required for deployment.** If you want a local preview, Podman builds everything inside a container, without installing Node.js or npm on the host:

```bash
podman build -t silksong-dlc-countdown -f Containerfile .
podman run --rm -p 8080:80 silksong-dlc-countdown
```

Preview: http://localhost:8080/silksong-dlc-countdown/

## Change countdown dates or translations

Edit `src/main.ts` for dates or countdown logic and `src/i18n.ts` for translations; then commit to `main`. GitHub Actions handles the build and deployment.

**Disclaimer:** This is an unofficial fan project, unaffiliated with Team Cherry. Neither date is confirmed as the DLC release date.

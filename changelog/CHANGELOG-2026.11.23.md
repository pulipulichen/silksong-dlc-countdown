# 2026.11.23 (Week 4)

## Changed
- Replaced the historical Switch 2 dual-countdown screenshot in both READMEs with the current Cherry Time and Sea of Sorrow screenshot.
- Refreshed the year-end, release celebration, and overdue demo screenshots.

## Fixed
- Set the custom simulation preview date to December 1, 2026, matching the maintainer configuration guide.
- November 26 (Taipei): In [run 45673351618](https://github.com/pulipulichen/silksong-dlc-countdown/actions/runs/45673351618) on `d875819`, `Deploy compiled site` failed with `No artifacts named "github-pages" were found for this workflow run.` The build and upload succeeded, and GitHub later listed the uploaded artifact under the same run. The workflow now polls for the exact uploaded artifact ID with a time limit before deploying.

## Documentation
- Added a bilingual documentation index linking the countdown configuration, deployment, and Google Play guides.

## Removed
- Removed the Cherry Time presentation card, its independent countdown, and related translations. The public site now presents only the Sea of Sorrow countdown.
- Rebranded the page title, installable app, and PWA install prompt around Sea of Sorrow.

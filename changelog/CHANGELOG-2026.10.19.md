# 2026.10.19 (Week 3)

## Fixed
- Corrected the mobile page wrapper’s selector specificity so off-screen background decorations are clipped instead of creating a long empty scroll area below the footer.
- Switched GitHub Pages to Actions-only publishing to stop the built-in Jekyll deployment from overwriting Vite output, restoring the favicon and compiled application assets.
- Added a deployment-source check that fails with an actionable message if Pages is changed back to branch publishing.
- Made everbloom clicks burst immediately: start with visible white particles around the flower, synchronize animations to pointerdown, and replace the delayed glow buildup with a brief fading flash.
- Standardized the Traditional Chinese game title as 「絲綢之歌」 across the brand, hero, introduction, and browser title.
- Removed “another” wording from the first countdown card’s Chinese and Japanese labels to match its position before the year-end countdown.
- Corrected relative asset references for GitHub Pages so the stylesheet, application script, and favicon load from the project site path.

## Improved
- Polished the animated sea scene and refined localized Silksong DLC branding across the page and sharing metadata.
- Refined the silk cocoon cursor into a tapered, densely wound thread silhouette with fine overlapping ivory strands instead of broad geometric ribbons.
- Updated browser and social-share titles to clearly identify the *Sea of Sorrow* / Silksong DLC countdown, with localized browser titles.
- Refocused the hero copy and Traditional Chinese localization on the *Sea of Sorrow* DLC countdown.
- Added a subtle animated underwater-surface effect to countdown cards.
- Replaced the brand, hero, and social-preview lines with direct Silksong DLC countdown wording in every language, including the first paint before scripts run.
- Made the page read as open water: layered sea waves, a moving horizon, surface ripples, and wave crests along the countdown cards.
- Placed the nearer November 27 countdown on the left, ahead of the December 31 countdown.
- Added a translucent footer bar so the time, disclaimer, and GitHub link stay readable over the waves.
- Removed the extra wave ornament between the introduction and the countdown cards.
- Replaced the corner wave mark with a shell icon, and added a shell mark in the center of the header.
- Redrew the header shell marks and favicon as an asymmetric spiny conch with layered spiral ridges, based on a photo reference.
- Made the language selector narrower with tighter spacing and a subtler border, and kept it inside the page frame.
- Removed the wave crests inside both countdown cards while keeping the outer background waves.
- Placed each numeric countdown date directly after its card title with a colon separator, retaining teal/gold date colors, adding localized release-date wording to the Switch 2 physical edition title, and keeping retailer/fan-date caveats below.
- Right-aligned both card reference links.

## Changed
- Replaced the reference-inspired flower cursor with an abstract, flat-color silk cocoon: separated ivory and mint ribbon shapes, no flower imagery, outlines, or gradients; retained immediate white click flashes and particle bursts.
- Automatically hide the November 27 countdown after that calendar day ends in Adelaide, and center the remaining December 31 card at its desktop width.
- Reworded the localized introduction so it remains accurate with either one or two countdown cards.

## Removed
- Removed the redundant `01 / 02` and `02 / 02` card counters.

## Added
- Added a localized fan signature on the same line as the GitHub link at the bottom-right of the footer: 「粉絲：布丁布丁吃布丁」 in Traditional Chinese and “Fan: Pulipuli Chen” in English, with Simplified Chinese and Japanese labels.
- Added an original, reference-inspired everbloom SVG mouse cursor with layered ivory petals, a white click glow, and white particle bursts above page content; preserved native touch behavior and reduced-motion support.
- Added a Cursor hook to track active project conversations, with tests for lifecycle handling, cleanup, concurrency, and status output.
- Added project guidance for weekly changelog updates and a reusable GitHub synchronization workflow.

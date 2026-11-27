# Countdown dates and DLC configuration

[English](./configuration.md) · [繁體中文](../zh_tw/configuration.md)

This guide is for maintainers. These settings are edited in source code; they are not controls available to website visitors.

## Preview a date or the DLC release screen

Edit the `simulationSettings` object near the top of `src/main.ts`:

- `mode: "auto"` uses the current real time. Set it to `"custom"` to simulate `date` instead.
- `date` uses `YYYY-MM-DD`. The simulated clock starts at **00:00 Australia/Adelaide time** on that date and advances in real time from when the page loads. If the date is invalid, the app falls back to the real current time.
- `dlcReleased: true` is a manual override for previewing the localized release celebration or marking an earlier confirmed launch. Leave it `false` for the scheduled automatic transition.
- `dlcAutoReleaseAt` is the automatic transition timestamp. The default is `2026-12-12T00:00:00+08:00` (midnight in Taiwan, UTC+8). Include an explicit time zone; clear the value to disable the automatic transition.
- `dlcReleasedAt` is the timestamp used as the origin of the elapsed-time counter. It defaults to the same instant as `dlcAutoReleaseAt`; replace it with the actual launch timestamp if an earlier launch is confirmed. If it is empty or invalid, the elapsed timer displays `--`.
- `dlcAnnouncementUrl` accepts an absolute `http://` or `https://` URL for the announcement button. Leave it empty to hide the button.

For example, this configuration previews the release celebration on December 1, 2026. The elapsed timer remains unset until a valid release timestamp is provided:

```ts
const simulationSettings: SimulationSettings = {
  mode: "custom",
  date: "2026-12-01",
  dlcReleased: true,
  dlcAutoReleaseAt: "",
  dlcReleasedAt: "",
  dlcAnnouncementUrl: "",
};
```

To return to live time, change `mode` back to `"auto"`. Save the code and rebuild/deploy for the public website to use the change.

## Change the built-in countdown dates

The built-in target dates and related boundaries are defined in `src/main.ts`:

- The announced Sea of Sorrow release date is **December 11, 2026**. The countdown covers that full calendar day and reaches its deadline at **December 12, 2026, 00:00 Australia/Adelaide** (the instant December 11 ends). This is a countdown boundary, not an announced DLC launch time.
- The overdue timer starts at that Adelaide-midnight boundary if the DLC has not already been marked as released.
- The site automatically switches to its release celebration at **December 12, 2026, 00:00 Asia/Taipei (UTC+8)**. This is a site-side fallback, not an official launch-time announcement. The transition is evaluated in the browser, so an already-open page changes without a reload or scheduled GitHub Actions run.

The DLC target and overdue boundary use the `adelaideMidnight` helper, which applies the `Australia/Adelaide` time zone and its daylight-saving rules. The automatic release transition uses an explicit UTC offset in `dlcAutoReleaseAt`, so it is independent of each visitor's time zone. When changing the release date, review both timestamps and the date-specific copy in `src/i18n.ts` so the single countdown remains consistent.

If the actual DLC launch is confirmed before the automatic transition, set `dlcReleased: true` and update `dlcReleasedAt` to the confirmed timestamp. The automatic transition can be disabled by clearing `dlcAutoReleaseAt`.

## Apply changes

Commit the source changes to `main`; the GitHub Actions deployment workflow builds and publishes the site. See [Deployment and local testing](./deploy.md).

# Countdown dates and DLC configuration

[English](./configuration.md) · [繁體中文](../zh_tw/configuration.md)

This guide is for maintainers. These settings are edited in source code; they are not controls available to website visitors.

## Preview a date or the DLC release screen

Edit the `simulationSettings` object near the top of `src/main.ts`:

- `mode: "auto"` uses the current real time. Set it to `"custom"` to simulate `date` instead.
- `date` uses `YYYY-MM-DD`. The simulated clock starts at **00:00 Australia/Adelaide time** on that date and advances in real time from when the page loads. If the date is invalid, the app falls back to the real current time.
- `dlcReleased: true` displays the localized release celebration. Set it to `false` to show the countdown or overdue state.
- `dlcReleasedAt` is the confirmed release timestamp. Include an explicit time zone, such as `Z` or `+09:30`, so every visitor counts from the same instant. If it is empty or invalid, the elapsed timer displays `--`.
- `dlcAnnouncementUrl` accepts an absolute `http://` or `https://` URL for the announcement button. Leave it empty to hide the button.

For example, this configuration previews the release celebration on December 1, 2026. The elapsed timer remains unset until a valid release timestamp is provided:

```ts
const simulationSettings: SimulationSettings = {
  mode: "custom",
  date: "2026-12-01",
  dlcReleased: true,
  dlcReleasedAt: "",
  dlcAnnouncementUrl: "",
};
```

To return to live time, change `mode` back to `"auto"`. Save the code and rebuild/deploy for the public website to use the change.

## Change the built-in countdown dates

The built-in target dates and related boundaries are defined in `src/main.ts`:

- The announced Sea of Sorrow release date is **December 11, 2026**. The countdown covers that full calendar day and reaches its deadline at **December 12, 2026, 00:00 Australia/Adelaide** (the instant December 11 ends). This is a countdown boundary, not an announced DLC launch time.
- If the DLC has not been marked as released by that deadline, the overdue timer starts at the same boundary.

The DLC target and overdue boundary use the `adelaideMidnight` helper, which applies the `Australia/Adelaide` time zone and its daylight-saving rules. When changing the release date, also review the overdue boundary and date-specific copy in `src/i18n.ts` so the single countdown remains consistent.

## Apply changes

Commit the source changes to `main`; the GitHub Actions deployment workflow builds and publishes the site. See [Deployment and local testing](./deploy.md).

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

- The DLC year-end marker is **December 31, 2026, at Adelaide midnight**.
- The retailer-listed Switch 2 physical-edition date is **November 27, 2026, at Adelaide midnight**. Its card is hidden at the next Adelaide midnight, November 28.
- The overdue timer starts at **January 1, 2027, at Adelaide midnight**.

These dates are created with the `adelaideMidnight` helper, which applies the `Australia/Adelaide` time zone and its daylight-saving rules. When changing a target, also review the related hide/overdue boundaries and date-specific copy in `src/i18n.ts` so the display remains consistent.

The DLC date is a fan-selected year-end marker, not an officially confirmed release date. The Switch 2 date is a retailer listing, and any connection between it and the DLC is unconfirmed speculation.

## Apply changes

Commit the source changes to `main`; the GitHub Actions deployment workflow builds and publishes the site. See [Deployment and local testing](./deploy.md).

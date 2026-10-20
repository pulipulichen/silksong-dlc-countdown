import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

// Keep installation icons in sync with the site's original shell artwork.
const source = readFileSync(new URL("../public/favicon.svg", import.meta.url), "utf8");
function render(filename, size, maskable = false) {
  // An opaque full-bleed background avoids transparent corners on home screens.
  // The maskable artwork fits within the central 80% safe-zone circle.
  const svg = source
    .replace('rx="13"', '')
    .replace('translate(3 3) scale(.9)', maskable
      ? 'translate(13 13) scale(.6)'
      : 'translate(3 3) scale(.9)');
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } })
    .render().asPng();
  writeFileSync(new URL("../dist/" + filename, import.meta.url), png);
  console.log("Generated dist/" + filename);
}
render("icon-192.png", 192);
render("icon-512.png", 512);
render("icon-maskable-512.png", 512, true);
render("apple-touch-icon.png", 180);

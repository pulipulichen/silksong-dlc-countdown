import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const svg = readFileSync(new URL("../public/og-preview.svg", import.meta.url), "utf8");
const renderer = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
const png = renderer.render().asPng();
writeFileSync(new URL("../dist/og-preview.png", import.meta.url), png);
console.log("Generated dist/og-preview.png social preview");

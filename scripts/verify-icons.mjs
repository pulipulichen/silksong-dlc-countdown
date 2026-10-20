import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("dist/manifest.webmanifest", "utf8"));
const expected = [
  ["icon-192.png", 192, "any"],
  ["icon-512.png", 512, "any"],
  ["icon-maskable-512.png", 512, "maskable"],
  ["apple-touch-icon.png", 180, null],
];
for (const [filename, size, purpose] of expected) {
  const png = readFileSync("dist/" + filename);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), size, filename + " width");
  assert.equal(png.readUInt32BE(20), size, filename + " height");
  if (purpose) {
    assert(manifest.icons.some(icon => icon.src === "./" + filename &&
      icon.sizes === size + "x" + size && icon.type === "image/png" &&
      icon.purpose === purpose), filename + " manifest entry");
  }
}
assert(readFileSync("dist/index.html", "utf8").includes('apple-touch-icon.png'));
console.log("Verified PNG signatures, dimensions, and installation icon references");

/**
 * Generates the installable-app icons in public/icons from the Tilly's Gallery logo.
 * Usage: node scripts/pwa-icons.mjs
 *   store:  cream tile with the logo (192, 512, maskable 512, Apple touch 180)
 *   admin:  espresso tile with the light logo, so the admin app is easy to tell apart on a home screen
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/icons");
fs.mkdirSync(out, { recursive: true });

const CREAM = "#FBF6F2";
const ESPRESSO = "#2A201C";
const logo = path.join(root, "public/logo.png");

// Light logo for the dark admin tile: lettering cream, bag sand, alpha kept.
const { data, info } = await sharp(logo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const light = Buffer.from(data);
for (let i = 0; i < light.length; i += 4) {
  const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  const [r, g, b] = lum > 140 ? [0xd9, 0xc7, 0xb6] : [0xfb, 0xf3, 0xea];
  light[i] = r;
  light[i + 1] = g;
  light[i + 2] = b;
}
const lightLogo = await sharp(light, { raw: info }).png().toBuffer();
const darkLogo = fs.readFileSync(logo);

/** Square tile with the logo covering `fill` of its width (maskable icons need <= 0.62). */
async function tile(size, background, logoBuf, fill) {
  const w = Math.round(size * fill);
  const resized = await sharp(logoBuf).resize({ width: w }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background } })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

const jobs = [
  ["icon-192.png", 192, CREAM, darkLogo, 0.78],
  ["icon-512.png", 512, CREAM, darkLogo, 0.78],
  ["icon-maskable-512.png", 512, CREAM, darkLogo, 0.6],
  ["apple-touch-icon.png", 180, CREAM, darkLogo, 0.78],
  ["admin-192.png", 192, ESPRESSO, lightLogo, 0.78],
  ["admin-512.png", 512, ESPRESSO, lightLogo, 0.78],
  ["admin-maskable-512.png", 512, ESPRESSO, lightLogo, 0.6],
  ["admin-apple-touch.png", 180, ESPRESSO, lightLogo, 0.78],
];
for (const [name, size, bg, buf, fill] of jobs) {
  fs.writeFileSync(path.join(out, name), await tile(size, bg, buf, fill));
}
console.log("Wrote", jobs.map((j) => j[0]).join(", "));

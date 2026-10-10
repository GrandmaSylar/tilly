/**
 * Builds the Tilly's Gallery business card (front + back) as print-ready PNGs and a PDF.
 * Usage: node scripts/business-card/build.mjs
 * Output: business-card/ (3.5 x 2 in card, 0.125 in bleed, 300 dpi)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Icons from "@phosphor-icons/react/dist/ssr";
import QRCode from "qrcode";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const out = path.join(root, "business-card");
fs.mkdirSync(out, { recursive: true });

const SITE_URL = "https://tilly-beige.vercel.app";
const PHONE = "+233 54 779 0821";
const ADDRESS = ["Mataheko, Dansoman Area,", "opposite Zoozoo, Accra, Ghana"];
const TIKTOK = "@tillysgallery1";
const INSTAGRAM = "@yhaa_afaribea1";

const C = { espresso: "#2A201C", mocha: "#6E564C", mochaDeep: "#5E4940", cream: "#FBF6F2", taupe: "#B8A494", sand: "#E6D8CB", honey: "#E9D9BF" };

const icon = (name, size, color) =>
  renderToStaticMarkup(React.createElement(Icons[name], { size, color, weight: "regular" }));

/* ---------- logo variants ---------- */
const logoPath = path.join(root, "public/logo.png");
const { data, info } = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Light version for the espresso front: lettering -> cream, bag -> sand, alpha kept.
const light = Buffer.from(data);
for (let i = 0; i < light.length; i += 4) {
  const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  const [r, g, b] = lum > 140 ? [0xd9, 0xc7, 0xb6] : [0xfb, 0xf3, 0xea];
  light[i] = r;
  light[i + 1] = g;
  light[i + 2] = b;
}
const logoLight = await sharp(light, { raw: info }).png().toBuffer();
const logoDark = fs.readFileSync(logoPath);

const uri = (buf) => `data:image/png;base64,${buf.toString("base64")}`;

/* ---------- branded QR ---------- */
function brandedQr(url, px) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const get = (x, y) => qr.modules.get(x, y);
  const q = 2; // quiet zone in modules
  const total = n + q * 2;
  const clear = Math.ceil(n * 0.27) | 1; // centre window reserved for the bag mark
  const c0 = Math.floor((n - clear) / 2);
  const inFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const inClear = (x, y) => x >= c0 && x < c0 + clear && y >= c0 && y < c0 + clear;

  let dots = "";
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (get(x, y) && !inFinder(x, y) && !inClear(x, y))
        dots += `<circle cx="${x + q + 0.5}" cy="${y + q + 0.5}" r="0.43"/>`;

  const finder = (fx, fy) => {
    const X = fx + q;
    const Y = fy + q;
    return `<rect x="${X + 0.5}" y="${Y + 0.5}" width="6" height="6" rx="1.9" fill="none" stroke="${C.espresso}" stroke-width="1"/>
            <rect x="${X + 2}" y="${Y + 2}" width="3" height="3" rx="1" fill="${C.mocha}"/>`;
  };

  const cs = clear + 1.2;
  const cx = q + n / 2;
  const cy = q + n / 2;
  const bag = icon("Handbag", 10, C.mocha).replace(/<svg[^>]*>/, `<svg fill="${C.mocha}" x="${cx - clear * 0.36}" y="${cy - clear * 0.36}" width="${clear * 0.72}" height="${clear * 0.72}" viewBox="0 0 256 256">`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${total} ${total}">
    <rect width="${total}" height="${total}" fill="${C.cream}"/><g fill="${C.mochaDeep}">${dots}</g>
    ${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}
    <circle cx="${cx}" cy="${cy}" r="${cs / 2}" fill="${C.cream}" stroke="${C.sand}" stroke-width="0.18"/>
    ${bag}
  </svg>`;
}

/* ---------- card markup (CSS px at 96 dpi: 3.75 x 2.25 in with bleed = 360 x 216) ---------- */
const row = (ic, html) => `<div class="row"><span class="ic">${icon(ic, 10, C.mocha)}</span><span>${html}</span></div>`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:360px;height:216px;overflow:hidden;background:#fff}
.card{position:relative;width:360px;height:216px;overflow:hidden;font-family:'Inter',sans-serif}
/* FRONT */
.front{background:radial-gradient(ellipse 70% 80% at 50% 42%, #3d302a 0%, ${C.espresso} 72%)}
.front .frame{position:absolute;inset:19px;border:.6px solid rgba(230,216,203,.45)}
.front .frame2{position:absolute;inset:23px;border:.3px solid rgba(230,216,203,.22)}
.front .logo{position:absolute;left:50%;top:50px;width:150px;transform:translateX(-50%)}
.front .rule{position:absolute;left:50%;top:151px;transform:translateX(-50%);display:flex;align-items:center;gap:6px}
.front .rule i{display:block;width:34px;height:.6px;background:${C.taupe}}
.front .rule b{display:block;width:3.5px;height:3.5px;background:${C.honey};transform:rotate(45deg)}
.front .tag{position:absolute;left:0;right:0;top:162px;text-align:center;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:7.4px;letter-spacing:2.3px;text-transform:uppercase;color:${C.sand};padding-left:2.3px}
/* BACK */
.back{background:${C.cream}}
.back .frame{position:absolute;left:19px;top:19px;bottom:19px;right:128px;border:.6px solid ${C.taupe}66}
.back .panel{position:absolute;top:0;bottom:0;right:0;width:122px;background:radial-gradient(ellipse 120% 70% at 50% 40%, #7c6358 0%, ${C.mocha} 70%)}
.back .panel::before{content:"";position:absolute;inset:19px 19px 19px 6px;border:.5px solid rgba(230,216,203,.4)}
.back .info{position:absolute;left:19px;top:29px;width:213px;padding:0 14px}
.back .logo{width:92px;display:block;margin:0 auto}
.back .rule{display:flex;align-items:center;justify-content:center;gap:5px;margin:6px 0 7px}
.back .rule i{display:block;width:28px;height:.6px;background:${C.taupe}}
.back .rule b{display:block;width:3px;height:3px;background:${C.mocha};transform:rotate(45deg)}
.details{width:max-content;margin:0 auto}
.row{display:flex;justify-content:flex-start;text-align:left;align-items:flex-start;gap:6px;font-size:7.4px;line-height:1.45;color:${C.espresso};font-weight:500;letter-spacing:.1px;margin-bottom:4.8px}
.row .ic{flex:none;width:10px;height:10px;margin-top:.4px;display:block}
.row .ic svg{display:block}
.addr2{margin:-3.4px 0 4.8px;padding-left:16px}
.qrwrap{position:absolute;right:0;top:0;bottom:0;width:122px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-right:12px;padding-bottom:1px}
.qrtile{background:${C.cream};border-radius:7px;padding:5px;box-shadow:0 2px 6px rgba(0,0,0,.18);width:88px;height:88px}
.qrtile svg{display:block}
.cap{margin-top:9px;font-size:6.4px;font-weight:600;letter-spacing:1.9px;text-transform:uppercase;color:${C.sand};text-align:center;padding-left:1.9px}
.cap2{margin-top:4px;font-family:'Cormorant Garamond',serif;font-size:8.4px;line-height:1.2;font-weight:600;letter-spacing:.4px;color:#fff;text-align:center}
`;

const frontHtml = `<div class="card front">
  <div class="frame"></div><div class="frame2"></div>
  <img class="logo" src="${uri(logoLight)}">
  <div class="rule"><i></i><b></b><i></i></div>
  <div class="tag">Perfumes &middot; Bags &middot; Fashion &middot; Beauty</div>
</div>`;

const backHtml = `<div class="card back">
  <div class="frame"></div>
  <div class="info">
    <img class="logo" src="${uri(logoDark)}">
    <div class="rule"><i></i><b></b><i></i></div>
    <div class="details">
    ${row("Phone", PHONE)}
    ${row("MapPin", ADDRESS[0]).replace("margin-bottom", "margin-bottom")}<div class="row addr2"><span>${ADDRESS[1]}</span></div>
    ${row("TiktokLogo", `TikTok&nbsp;&nbsp;${TIKTOK}`)}
    ${row("InstagramLogo", `Instagram&nbsp;&nbsp;${INSTAGRAM}`)}
    ${row("Globe", SITE_URL.replace("https://", ""))}
    </div>
  </div>
  <div class="panel"></div>
  <div class="qrwrap">
    <div class="qrtile">${brandedQr(SITE_URL, 78)}</div>
    <div class="cap">Scan to shop</div>
    <div class="cap2">Same-day delivery<br>in Accra</div>
  </div>
</div>`;

const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

/* ---------- render with headless Chrome ---------- */
const tmp = path.join(out, ".tmp");
fs.mkdirSync(tmp, { recursive: true });
const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(fs.existsSync);
if (!chrome) throw new Error("Chrome or Edge is required to render the card");

const shot = (name, html) => {
  const file = path.join(tmp, `${name}.html`);
  fs.writeFileSync(file, page(html));
  const png = path.join(out, `${name}.png`);
  const r = spawnSync(
    chrome,
    [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
      `--user-data-dir=${path.join(tmp, "profile-" + name)}`,
      "--force-device-scale-factor=3.125", "--window-size=360,216",
      "--virtual-time-budget=8000", `--screenshot=${png}`, pathToFileURL(file).href,
    ],
    { encoding: "utf8" },
  );
  if (!fs.existsSync(png)) throw new Error(`Render failed: ${r.stderr}`);
};
shot("card-front", frontHtml);
shot("card-back", backHtml);

// Trimmed (3.5 x 2 in) versions and a presentation mock-up.
const W = 1125, H = 675, B = 38; // 0.125 in bleed at 300 dpi
for (const n of ["front", "back"]) {
  await sharp(path.join(out, `card-${n}.png`))
    .extract({ left: B, top: B, width: W - 2 * B, height: H - 2 * B })
    .withMetadata({ density: 300 })
    .toFile(path.join(out, `card-${n}-trimmed.png`));
}
const tm = await sharp(path.join(out, "card-front-trimmed.png")).metadata();
const cw = tm.width, ch = tm.height, pad = 140;
const rounded = (n) =>
  sharp(path.join(out, `card-${n}-trimmed.png`))
    .composite([{ input: Buffer.from(`<svg width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" rx="14"/></svg>`), blend: "dest-in" }])
    .png()
    .toBuffer();
const shadow = Buffer.from(
  `<svg width="${cw + 80}" height="${ch + 80}"><filter id="b"><feGaussianBlur stdDeviation="18"/></filter><rect x="40" y="52" width="${cw}" height="${ch}" rx="14" fill="#000" opacity=".28" filter="url(#b)"/></svg>`,
);
await sharp({ create: { width: cw + pad * 2, height: ch * 2 + pad * 3, channels: 3, background: "#E9E0D8" } })
  .composite([
    { input: shadow, left: pad - 40, top: pad - 40 },
    { input: await rounded("front"), left: pad, top: pad },
    { input: shadow, left: pad - 40, top: pad * 2 + ch - 40 },
    { input: await rounded("back"), left: pad, top: pad * 2 + ch },
  ])
  .png()
  .toFile(path.join(out, "card-preview.png"));

// Print PDF: two pages, full bleed.
const pdfFile = path.join(tmp, "print.html");
fs.writeFileSync(
  pdfFile,
  `<!doctype html><html><head><meta charset="utf-8"><style>${css}
@page{size:3.75in 2.25in;margin:0}html,body{height:auto;overflow:visible}.card{break-after:page}.card:last-child{break-after:auto}</style></head><body>${frontHtml}${backHtml}</body></html>`,
);
spawnSync(chrome, [
  "--headless=new", "--disable-gpu", "--no-sandbox", `--user-data-dir=${path.join(tmp, "profile-pdf")}`,
  "--no-pdf-header-footer", "--virtual-time-budget=8000",
  `--print-to-pdf=${path.join(out, "tilly-business-card-print.pdf")}`, pathToFileURL(pdfFile).href,
]);

fs.writeFileSync(path.join(out, "qr-code.svg"), brandedQr(SITE_URL, 600));
fs.rmSync(tmp, { recursive: true, force: true });
console.log("Done:", fs.readdirSync(out).join(", "));

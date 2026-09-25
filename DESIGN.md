# Tilly's Gallery — Design System

Layout and component language taken from 100cedis.com (rounded cards, pill controls, bold Space Grotesk display over Inter), coloured with the Tilly's Gallery logo palette: mocha brown lettering, warm taupe bag and cream paper. Terracotta and honey sand are earthy supporting tones for deals and badges.

## Tokens (app/globals.css)
Token names are kept from the first build, so `mint` now means taupe and `brand` means mocha.

| Token | Value | Use |
|---|---|---|
| `ink` | #2E2420 espresso | Body text (14:1 on cream) |
| `brand` | #6E564C mocha | Primary buttons, announcement bar, dark panels (white text 6.8:1) |
| `brand-soft` | #5E4940 | Mocha hover |
| `cream` | #FBF6F2 | Page background |
| `ice` | #F2E9E1 | Image wells, secondary surfaces |
| `mist` | #F8F2EC | Inputs, muted surface |
| `line` | #E6DBD1 | Borders |
| `slate` | #74645B | Secondary text (5.3:1 on cream) |
| `mint` | #B8A494 warm taupe | Accent surfaces: badges, cart count, WhatsApp buttons, selection. Always carries espresso text |
| `mint-deep` | #7C6656 deep taupe | Accent text and icons on light surfaces |
| `sand` | #E6D8CB | Accent text on mocha panels |
| `gold` | #E9D9BF honey sand | "New" and "Bestseller" badges, GH₵2,500 tier |
| `coral` | #A65E45 terracotta | Deals link, low stock, GH₵5,000 tier (white text 4.9:1) |
| `coral-deep` | #8E4C36 | Sale text on tinted pills |
| Footer | #2A201C | Espresso footer |

## Type
- Display: Space Grotesk 700, tracking -0.025em, uppercase for hero and panel statements, sentence case for section titles (text-2xl).
- UI and body: Inter 400/500/600. Uppercase micro-labels at 11px, 600 weight.
- Prices use the display face with tabular numerals, e.g. `GH₵1,850`, with the struck-through original price beside it.

## Shape and depth
- Cards: radius 1.25rem, 1px `line` border, white, p-3; the image well inside uses rounded-2xl on `ice`.
- Panels (deals, newsletter): radius 2rem, mocha, with a soft taupe radial glow.
- Controls: pills (rounded-full). Mocha fill with white text for primary, white with a line border for secondary.
- Shadows are soft and offset downward, tinted espresso. Never a border plus a big shadow on the same element.

## Motion
- Press: scale(.97), 160ms, ease-out `cubic-bezier(.23,1,.32,1)`.
- Drawer: 420ms `cubic-bezier(.32,.72,0,1)`. Modal: 220ms scale .96 → 1 plus opacity.
- The one authored moment is the hero product cards settling into their tilt on load. The ticker scrolls linearly.
- Hover effects only under `(hover:hover) and (pointer:fine)`. Motion respects `prefers-reduced-motion`.

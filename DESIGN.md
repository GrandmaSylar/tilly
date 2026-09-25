# Tilly's Gallery — Design System

Visual language taken from 100cedis.com: a bright, confident Ghanaian retail feel. Deep navy ink, one mint signal colour, gold and coral used only to code price tiers and deals, generous 1rem-plus radii, pill controls, and bold tight Space Grotesk display type over Inter UI text.

## Tokens (app/globals.css)
| Token | Value | Use |
|---|---|---|
| `ink` | oklch(17.7% .0323 258.68) | Body text |
| `brand` | oklch(22.51% .051 255.57) | Navy: primary buttons, announcement bar, dark panels, footer |
| `ice` | oklch(95.58% .0154 257.2) | Image wells, secondary surfaces |
| `mist` | oklch(97.05% .0092 257.2) | Muted surface |
| `line` | oklch(91.42% .0148 257.2) | Borders, inputs |
| `slate` | oklch(51.78% .0316 257.4) | Secondary text |
| `mint` | oklch(77.33% .1736 160.47) | Accent: discount badges, highlights, focus ring, WhatsApp CTA |
| `gold` | oklch(84.87% .1508 81.27) | "New" badge, GH₵2,500 tier |
| `coral` | oklch(70.57% .1877 32.86) | Deals link, low-stock, GH₵5,000 tier |

## Type
- Display: Space Grotesk 700, tracking -0.025em, uppercase for hero and panel statements, sentence case for section titles (text-2xl).
- UI and body: Inter 400/500/600. Uppercase micro-labels at 11px, 600 weight.
- Prices use the display face with tabular numerals, e.g. `GH₵1,850`, with the struck-through original price beside it.

## Shape and depth
- Cards: radius 1.25rem, 1px `line` border, white, p-3; the image well inside uses rounded-2xl on `ice`.
- Panels (deals, newsletter): radius 2rem, navy, with a mint radial glow.
- Controls: pills (rounded-full). Navy fill for primary, white with a line border for secondary.
- Shadows are soft and offset downward, tinted navy. Never a border plus a big shadow on the same element.

## Motion
- Press: scale(.97), 160ms, ease-out `cubic-bezier(.23,1,.32,1)`.
- Drawer: 420ms `cubic-bezier(.32,.72,0,1)`. Modal: 220ms scale .96 → 1 plus opacity.
- The one authored moment is the hero product cards settling into their tilt on load. The ticker scrolls linearly.
- Hover effects only under `(hover:hover) and (pointer:fine)`. Motion respects `prefers-reduced-motion`.

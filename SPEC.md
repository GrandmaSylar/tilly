# /design-taste-frontend /high-end-visual-design /full-output-enforcement

# 

# Build the frontend for a luxury fashion e-commerce website. This is a greenfield

# Next.js 15 project with TypeScript, Tailwind CSS v4, and Geist font. The store

# sells perfumes, ladies bags, clothing, accessories, and beauty products.

# 

# BRAND IDENTITY:

# \- Name: \[YOUR STORE NAME] — use a placeholder if not decided

# \- Feel: Understated European luxury — the restraint of Celine, the quiet confidence

# &#x20; of The Row, the editorial minimalism of Net-a-Porter. Nothing loud, nothing

# &#x20; decorative for decoration's sake. Every element earns its place.

# \- Not: maximalist, ornate, heavily branded, or anything that reads as boutique

# &#x20; rather than maison

# \- Palette: Off-black (#0c0c0c), warm stone/ecru (#E8E0D0), muted sand (#C4B9A8),

# &#x20; and aged parchment white (#F7F4EF) — NO gold, NO champagne, NO bright accents.

# &#x20; The only colour is texture and proportion.

# \- Typography: Cormorant Garamond (serif, weights 300 and 400) for all

# &#x20; display/editorial headings — thin weight, wide tracking, never bold.

# &#x20; Geist for all UI/body text — small, precise, functional.

# &#x20; Load both via next/font.

# \- Imagery: editorial studio photography aesthetic — tall portrait aspect ratios,

# &#x20; products alone, no lifestyle clutter. Use placeholder divs with correct aspect

# &#x20; ratios — do NOT use picsum or random image URLs.

# \- Motion: almost imperceptible — 600ms fade-ins only, no slide-ins, no bounce,

# &#x20; no scale jumps. The page should feel like it breathes, not moves.

# \- Whitespace: aggressive. Sections should feel spacious to the point of sparse.

# &#x20; Luxury is what you leave out.

# 

# DESIGN RULES (apply everywhere):

# \- Every section: generous vertical padding (py-24 to py-40)

# \- Never use pure white (#ffffff) as a background — use #0c0c0c, #111111, or #F7F4EF

# \- Text hierarchy: Cormorant Garamond for anything editorial/decorative,

# &#x20; Geist for anything functional (prices, labels, buttons, UI copy)

# \- Buttons: off-black fill with ecru (#F7F4EF) text — OR — no fill with a 1px

# &#x20; stone (#C4B9A8) border and ecru text. Never coloured fills.

# \- Borders: very subtle warm grey (#1e1e1e on dark, #D8D0C4 on light) — thin, 1px

# \- Product card image hover: scale(1.02) over 700ms ease — nothing else changes

# \- Spacing is editorial — err toward more whitespace, not less

# \- The overall feeling: walking into a quiet Parisian maison, not browsing a store

# 

# PAGES TO BUILD:

# 

# ─── 1. HOME (app/page.tsx) ──────────────────────────────────────────────────

# 

# Hero section:

# \- Full viewport height, dark background (#0c0c0c) with a very subtle SVG grain

# &#x20; texture overlay at 3% opacity

# \- Headline split across two lines using Cormorant Garamond weight 300:

# &#x20; Line 1: "The Edit." — very large (clamp 72px–128px), wide letter-spacing

# &#x20; Line 2: "Autumn 2026" — same size, stone colour (#C4B9A8)

# \- Subtext below: "A carefully considered collection." — Geist, text-sm,

# &#x20; stone colour, tracking-widest, uppercase, mt-6

# \- Two CTAs below subtext, flex row, gap-4:

# &#x20; - "Explore the Collection" — no fill, 1px stone border, ecru text,

# &#x20;   px-8 py-3, rounded-none (square corners — more European maison)

# &#x20; - "New In →" — plain text link with a small arrow, no border, stone colour

# \- Bottom of hero: horizontal auto-scrolling ticker (CSS animation, infinite loop)

# &#x20; of category names in Geist small caps, stone colour, very slow scroll:

# &#x20; PERFUMES · BAGS · CLOTHING · JEWELLERY · BEAUTY · ACCESSORIES

# 

# Featured Categories section:

# \- Section label: "Shop by Category" — Geist, text-xs, uppercase, tracking-widest,

# &#x20; muted, left-aligned, mb-12

# \- 4 cards in a row on desktop, 2x2 on mobile

# \- Each card: aspect-\[2/3] placeholder image div (bg-neutral-900 on dark),

# &#x20; category name overlaid bottom-left inside the card — Cormorant Garamond,

# &#x20; text-2xl, weight 300, ecru — gradient overlay (transparent to black/80)

# \- Thin 1px stone border around each card

# \- On hover: border colour shifts to ecru over 300ms — nothing else

# 

# New Arrivals section:

# \- Section title: "New Arrivals" — Cormorant Garamond, weight 300,

# &#x20; clamp 40px–72px, left-aligned

# \- Subtitle right-aligned on same line (flex justify-between align-baseline):

# &#x20; "View All →" — Geist, text-sm, stone

# \- 4 product cards (see ProductCard spec below)

# \- mt-16 between title row and cards

# 

# Brand Statement section:

# \- Full-width section, background #0c0c0c, very generous padding (py-40)

# \- Centred single line in Cormorant Garamond weight 300, very large

# &#x20; (clamp 28px–56px), ecru, wide tracking:

# &#x20; "We source deliberately. We edit ruthlessly. We deliver nothing less."

# \- Nothing else in this section — no subtext, no button, no border

# 

# Bestsellers section:

# \- Same layout as New Arrivals but labelled "The Bestsellers"

# 

# Editorial / Lookbook Teaser section:

# \- Two-column layout: large image placeholder left (aspect-\[3/4]), text right

# \- Text column: category tag (Geist, xs, uppercase, muted), then large Cormorant

# &#x20; Garamond headline ("The Fragrance Edit"), then 2 lines of body copy, then

# &#x20; a plain text link "Explore →"

# \- On desktop: text column is vertically centred beside the image

# \- Background: ecru (#F7F4EF), dark text (#0c0c0c) — the only light section

# 

# Newsletter section:

# \- Dark background, centred, generous padding

# \- Headline: "Stay in the edit." — Cormorant Garamond, weight 300, large

# \- Subtext: "New arrivals and private sales, first." — Geist, text-sm, stone

# \- Inline form: email input (no fill, 1px stone border, ecru text, py-3 px-4,

# &#x20; flex-1) + "Subscribe" button (off-black fill, ecru text, px-6 py-3) — no rounded

# \- Below: "We respect your privacy." — Geist, text-xs, muted

# 

# ─── 2. PRODUCT LISTING (app/shop/page.tsx) ──────────────────────────────────

# 

# \- Page title: "The Collection" — Cormorant Garamond, large, left-aligned, py-16

# \- Sticky filter sidebar on desktop (left, 220px): Category, Price Range, Size,

# &#x20; Colour — each as a collapsible section with a thin +/- toggle, no heavy styling

# \- Mobile: filter button top-right opens a bottom sheet drawer

# \- Product grid: 2 columns mobile, 3 columns desktop, 4 columns xl — generous gap

# \- Sort dropdown top-right: "Featured", "Price: Low to High", "Price: High to Low",

# &#x20; "Newest" — minimal styling, no heavy select box

# \- 12 placeholder product cards using realistic names and prices (GH₵ currency)

# \- Pagination: simple "← Previous  1 of 4  Next →" — centred, text-sm, no heavy UI

# 

# ─── 3. PRODUCT DETAIL (app/shop/\[slug]/page.tsx) ────────────────────────────

# 

# \- Two column layout: image left (60%), product info right (40%)

# \- Image gallery: large main image placeholder, 4 small thumbnails below in a row,

# &#x20; click thumbnail to swap main image (useState)

# \- Product info column (sticky on desktop while scrolling images):

# &#x20; - Category — Geist, text-xs, uppercase, tracking-widest, stone, mb-2

# &#x20; - Product name — Cormorant Garamond, weight 300, text-4xl, ecru

# &#x20; - Price — Geist, text-lg, stone (#C4B9A8), mt-2

# &#x20; - Thin 1px divider line, my-6

# &#x20; - Short description — Geist, text-sm, stone, leading-relaxed, 3 lines

# &#x20; - Size selector (for clothing): row of square pill buttons — selected state is

# &#x20;   off-black fill with ecru text, unselected is border only

# &#x20; - Quantity: minimal minus / number / plus, no heavy styling

# &#x20; - "Add to Bag" — full width, off-black fill, ecru text, py-4, square corners,

# &#x20;   Geist font-medium — no rounding

# &#x20; - "Add to Wishlist" — text link with Heart icon, stone colour, text-sm, mt-3

# &#x20; - Thin divider, then accordion sections: Description · Details \& Care ·

# &#x20;   Delivery \& Returns — each toggles open/closed with a +/- icon, 300ms ease

# 

# ─── 4. PRODUCT CARD (components/ProductCard.tsx) ────────────────────────────

# 

# \- Image container: aspect-\[3/4], bg-neutral-900 placeholder, overflow-hidden

# \- Image hover: scale(1.02), transition 700ms ease — ONLY change on hover

# \- Below image: left-aligned

# &#x20; - Product name: Cormorant Garamond, weight 300, text-lg, ecru

# &#x20; - Category: Geist, text-xs, uppercase, tracking-wide, stone, mt-1

# &#x20; - Price: Geist, text-sm, stone, mt-1

# \- Wishlist Heart icon: top-right of image, opacity-0 by default,

# &#x20; opacity-100 on card hover — 300ms transition

# \- "Quick Add" pill: appears at bottom of image on hover — translateY(0) from

# &#x20; translateY(100%), 300ms ease — off-black fill, ecru text, text-xs, w-full,

# &#x20; py-2 — square corners

# 

# ─── 5. CART DRAWER (components/CartDrawer.tsx) ──────────────────────────────

# 

# \- Slides in from right: translateX(100%) to translateX(0), 350ms ease

# \- Backdrop: fixed inset-0 bg-black/50, click to close

# \- Drawer: fixed right-0 top-0 h-full w-full max-w-md bg-\[#0c0c0c]

# \- Header: "Your Bag" (Cormorant Garamond, text-2xl, ecru) + item count (stone)

# &#x20; + X close button right-aligned

# \- Thin 1px stone divider below header

# \- Cart items list: image thumbnail (aspect-square, 80px), name, size, price,

# &#x20; quantity controls (- number +), remove button (X, very small, stone)

# \- Empty state: centred text "Your bag is empty" + "Continue Shopping →" link

# \- Sticky footer: subtotal row (Geist, text-sm, justified) + thin divider +

# &#x20; "Proceed to Checkout" button (full width, off-black fill, ecru text, py-4,

# &#x20; square corners)

# 

# ─── 6. NAVIGATION (components/Navbar.tsx) ───────────────────────────────────

# 

# \- Transparent on hero (text white/ecru), transitions to solid #0c0c0c with

# &#x20; a 1px bottom border (#1e1e1e) after 80px scroll — JS scroll listener

# \- Logo: store name in Cormorant Garamond, text-2xl, weight 300, wide tracking

# \- Nav links: Shop · Perfumes · Bags · Clothing · About — Geist, text-xs,

# &#x20; uppercase, tracking-widest, ecru — underline on hover (CSS, no colour change)

# \- Right icons: MagnifyingGlass, Heart, Bag (Phosphor) — ecru, size 20

# \- Cart badge: small stone (#C4B9A8) dot with item count in Geist text-xs,

# &#x20; absolute top-right of the bag icon

# \- Mobile: hamburger (List icon, Phosphor) opens a full-screen overlay —

# &#x20; background #0c0c0c, links centred, large Cormorant Garamond, slide down

# &#x20; from top — CSS transition

# 

# ─── 7. FOOTER (components/Footer.tsx) ───────────────────────────────────────

# 

# \- Background: #0c0c0c, 1px stone top border

# \- 4 columns: Brand (store name + one-liner), Shop (links), Information

# &#x20; (links), Contact (email + Instagram + WhatsApp)

# \- All links: Geist, text-xs, uppercase, tracking-wide, stone — ecru on hover

# \- Bottom bar: thin 1px divider + copyright + "Crafted with intention" right-aligned

# \- Very generous top padding (pt-24), standard bottom padding (pb-12)

# 

# ─── 8. CART CONTEXT (context/CartContext.tsx) ────────────────────────────────

# 

# \- React Context + useReducer

# \- Actions: ADD\_ITEM, REMOVE\_ITEM, UPDATE\_QUANTITY, CLEAR\_CART

# \- State: items array, itemCount (derived), subtotal (derived)

# \- Wrap app/layout.tsx with CartProvider

# 

# ─── 9. LAYOUT (app/layout.tsx) ──────────────────────────────────────────────

# 

# \- Load Cormorant\_Garamond (weights: 300, 400) + Geist via next/font

# \- Apply fonts as CSS variables: --font-display and --font-body

# \- Wrap children with CartProvider

# \- Include Navbar and Footer

# \- Background: #0c0c0c default

# \- Set metadata: title and description for the store

# 

# TECH REQUIREMENTS:

# \- Next.js 15 App Router, TypeScript strict mode, Tailwind CSS v4

# \- @phosphor-icons/react for all icons

# \- All product data: static hardcoded array in lib/products.ts —

# &#x20; 12 products with realistic names, categories, prices in GH₵, and slugs

# \- No external UI libraries — pure Tailwind + custom components

# \- Cart state: React Context + useReducer only

# \- No animation libraries — CSS transitions only

# \- Mobile-first, fully responsive — 390px and 1440px breakpoints

# \- All placeholder image divs must have correct aspect ratios and

# &#x20; bg-neutral-900 background — no external image URLs

# 

# OUTPUT ORDER — one file per response, wait for confirmation before next:

# 1\. app/layout.tsx + context/CartContext.tsx

# 2\. components/Navbar.tsx

# 3\. components/Footer.tsx

# 4\. components/ProductCard.tsx

# 5\. components/CartDrawer.tsx

# 6\. lib/products.ts

# 7\. app/page.tsx

# 8\. app/shop/page.tsx

# 9\. app/shop/\[slug]/page.tsx


# Tilly's Gallery — Product

## What it is
Online storefront for Tilly's Gallery, an Accra, Ghana boutique selling perfumes, bags, clothing, accessories and beauty. Prices run from about GH₵400 to GH₵5,000.

## Who uses it
Shoppers in Greater Accra and across Ghana, mostly on phones and often from social links, who want to browse, save and order fast. Payment happens off-site (MTN MoMo, Telecel Cash, bank transfer, cash on delivery).

## Core flows
1. Browse the home page by price tier, category or collection (new, bestsellers, deals).
2. Filter and search the shop (`/shop?category=&price=&sale=&search=&sort=`).
3. Product page: pick a size and quantity, add to cart or wishlist, or ask on WhatsApp.
4. Cart drawer, then the WhatsApp checkout form, which sends a pre-filled order message to the business number.

## Truth and constraints
- Currency is GH₵. Same-day express delivery in Greater Accra, 48 hours nationwide.
- WhatsApp business number: `lib/whatsapp.ts`.
- There are no accounts and no on-site payment. Cart and wishlist live in the browser.
- Keep the script logo (`public/logo.png`).

## Platform
web (Next.js 15, React 19, Tailwind v4)

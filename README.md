# Fresh Mewa — Website

Storefront for **Fresh Mewa**, a roasted makhana brand (Pudina, Salt & Pepper, Peri Peri).
Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion (via `LazyMotion`) and Lenis smooth scrolling.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all pages are pre-rendered static HTML)
npm run start        # serve the production build
npm run lint
node lib/cart.test.ts      # cart logic check
node lib/account.test.ts   # checkout validation / order helpers check
```

> Judge animation smoothness on `npm run build && npm run start`, not on `npm run dev` — dev mode is always slower.

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage: hero, flavour ticker, intro, brand value, flavours, why Fresh Mewa, everyday moments, brand story, philosophy, "what is makhana", FAQ, final CTA, footer |
| `/shop` | Shop: hero, start here, product range (Add to Cart / Buy Now), flavour guide, before you order, shopping FAQ, final CTA |
| `/shop/[slug]` | Product page for `pudina`, `salt-pepper`, `peri-peri` (pre-rendered; any other slug → 404) |
| `/our-story` | Brand story, told in 10 chapter cards + FAQ + final CTA |
| `/shipping-returns` | Shipping and returns draft, linked from the footer and product buy boxes; excluded from indexing until policy details are confirmed |
| `/checkout` | Contact → delivery address → payment (Cash on Delivery) with a sticky order summary |
| `/checkout/success?order=…` | Order confirmation |
| `/account` | My Account: My Orders, My Addresses (add / set default / remove), My Loyalty Points (coming soon), Log out |

Navbar and Footer are rendered once in `app/layout.tsx` — pages must not render their own.

### Our Story page (`app/our-story/page.tsx`)

Deliberately more playful than the rest of the site, so a long read stays fun:

- **Hero**: sticker collage — wobbly multicolour "OUR STORY" letters, cut-out bowls/pouches, flavour stickers, a speech bubble and the outlined "Short story looong of why we exist →" pill.
- **Chapters** (`components/story/Chapters.tsx`): each chapter is a card with a thick outline + hard offset shadow, a taped chapter label, a giant outlined number and a product "sticker" hanging off the corner. Card colours cycle mint → chilli → gold → pepper → white.
- **Reading formats per chapter**: Hinglish lines as chat bubbles, sticky-note personas, checklists, marker highlights (`marker` utility), flavour rows with pouches.
- **Reading aids** (`components/story/StoryNav.tsx`): gold reading-progress bar at the top of the window and a sticky chapter list (desktop) that highlights the chapter you're reading.
- **Font**: Comic Neue (`font-hand`) for the handwritten voice — the closest Google Font to the reference pill.
- Copy lives in the components (it's page-specific); chapter titles in `storyChapters`, FAQ in `storyFaqs` (`lib/content.ts`).

### Product page (`app/shop/[slug]/page.tsx`)

- **Gallery** (`components/product/ProductGallery.tsx`): the flavour pouch plus three lifestyle shots, crossfading on thumbnail click. Tinted stage in the flavour colour with the flavour name in the background.
- **Buy box** (`components/product/BuyBox.tsx`): pack-size selector (radio buttons), quantity stepper (1–20), live price with MRP strike-through and "% off", Add to Cart and Buy Now.
- **The Details**: about this flavour, ingredients, nutrition table, storage and shipping.
- **Try Another Mood**: the other two flavours as product cards.
- **SEO**: per-flavour `<title>`/description and `Product` structured data (JSON-LD) with one offer per pack size.

---

## Where things live

```
app/
  layout.tsx            fonts, metadata, MotionConfig (reduced motion), SmoothScroll (Lenis)
  globals.css           design tokens + shared utilities (poster-h2, btn, btn-primary, btn-outline)
  page.tsx              homepage (section order)
  shop/page.tsx         shop page
  shop/[slug]/page.tsx  product page
  fonts/                subset WOFF2 builds of Veneer + Veneer Extras
components/
  Navbar.tsx            sticky glass navbar, mobile menu drawer, cart badge
  CartDrawer.tsx        slide-in cart (qty, remove, subtotal, savings)
  CartButtons.tsx       Add to Cart ("Added ✓" feedback) + Buy Now (adds, opens cart)
  FlavourCard.tsx       product card (homepage = single CTA, shop = cart buttons + price)
  MakhanaPouch.tsx      pouch photo with the printed FreshMewa label for a flavour
  PouchTrio.tsx         three floating pouches
  Hero.tsx              homepage hero (parallax bowl + poster headline)
  SmoothScroll.tsx      Lenis root (disabled for reduced-motion users)
  sections/             homepage sections; Faq, FinalCta, Marquee, Footer are shared with /shop
  shop/ShopSections.tsx shop-only sections
  product/              product page client components
  ui/Reveal.tsx         fade-up on scroll
  ui/Ornaments.tsx      Veneer Extras glyphs (✦ star "z", flourish "7")
lib/
  content.ts            ALL copy + product data (single source of truth, CMS-ready)
  cart.ts               cart store (localStorage) + pure helpers
  cart.test.ts          runnable check for the cart helpers
  motion.ts             shared easing, reveal variants, mouse-parallax hook
scripts/cutout.mjs      turns product photos shot on white into transparent WebP cutouts
public/images/hero/     product images (WebP cutouts)
```

---

## Editing content

All text, flavours, FAQs, pack sizes, prices, ingredients and nutrition live in **`lib/content.ts`**. Change it there and every page updates.

- `flavours`: name, short name, homepage tagline/description/CTA, colour tone (`mint` / `pepper` / `chilli`)
- `shopFlavours`: shop-page tagline, description and flavour-guide line per slug
- `packs`: pack sizes with `price` and `mrp` (₹). Used by cards, product page, cart and structured data
- `productDetails`: ingredients and nutrition rows per slug
- `faqs`, `education`, `shopFaqs`: FAQ content (also emitted as `FAQPage` structured data)

Adding a fourth flavour = add an entry to `flavours`, `shopFlavours` and `productDetails`, plus a `tone` (add its colours in `globals.css` and the `tones` map). The product page, shop range and cart pick it up automatically.

### ⚠️ Replace before launch

These are **sample values** so the pages could be designed. Use the figures printed on the real packaging:

- [ ] `packs`: pack sizes, prices and MRPs
- [ ] `productDetails`: ingredients and nutrition (the page shows "Refer to the pack for the final declared values")
- [ ] Product photos: the pouch is a stock kraft pouch with the label added in code; replace with real pack shots
- [ ] "MRP inclusive of all taxes" note in the buy box: confirm it's correct

Deliberately **not** included: star ratings and customer reviews. Add them only with real reviews.

---

## Checkout & orders

Flow: product/shop card → **Add to Cart / Buy Now** → cart drawer → **Checkout** → order confirmation → **My Account**.

- `components/checkout/CheckoutForm.tsx`: name, +91 mobile (validated `6–9` + 9 digits), optional email, address, state (dropdown), 6-digit pincode. Errors show inline and focus jumps to the first bad field. Returning customers get their details and saved addresses pre-filled.
- **Add New Address** (`components/account/AddressDialog.tsx`, native `<dialog>`): Customer Info (name, mobile*, email*) + Address Info (full address*, line 2, locality, landmark, pincode*, city*, state*) + "Make Default address". Rules live in `validateAddress` (`lib/account.ts`). The default address is the first in the list and pre-fills checkout; optional lines are folded into checkout's address line so nothing is lost.
- Payment: **Cash on Delivery** only. "UPI / Cards" is shown as coming soon.
- Validation + order IDs are plain functions in `lib/account.ts` (checked by `lib/account.test.ts`).
- Settings in `lib/content.ts` → `checkoutSettings`:
  - `deliveryFee` (₹, sample value `0` = free)
  - `orderWhatsApp`: your WhatsApp number with country code (e.g. `"919876543210"`). When set, placing an order opens WhatsApp with the full order pre-filled so it reaches your team.

### ⚠️ Before taking real orders

**Orders are saved to the database** (`app/checkout/actions.ts`, see *Database* below). Accounts ("My Account", saved addresses) still live only in the customer's browser (localStorage):

- [x] Save orders server-side and **recalculate prices on the server** (`placeOrder`)
- [ ] Admin page to see orders and update their status (until then: Neon console → Tables → orders)
- [ ] Real login (phone OTP) so "My Account" works across devices; today "Log out" just clears this device
- [ ] Online payments (e.g. Razorpay) + order status updates
- [ ] Set the delivery fee policy

## Database (Neon Postgres + Drizzle)

- Neon project `freshmewa`, branch `production`; linked with `neon link` (`.neon/`, `neon.ts` has `auth: true`). `neon deploy` writes `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and the `NEON_AUTH_*` vars into `.env.local` (git-ignored, never commit it).
- Schema: `lib/db/schema.ts` → `orders` table (same shape as `Order` in `lib/account.ts`; amounts in whole ₹; `status` = placed / shipped / delivered / cancelled).
- Client: `import { db } from "@/lib/db"` — **server code only** (`server-only` guard).
- Change the schema, then apply it: `npx drizzle-kit push` (uses the unpooled URL, see `drizzle.config.ts`).
- **Placing an order** = server action `placeOrder` in `app/checkout/actions.ts`. The browser sends only the form + cart lines (slug, pack, qty); the server re-validates them, rejects unknown flavours/packs and quantities outside 1–`MAX_QTY`, prices everything from `lib/content.ts`, then inserts the row. The checkout form shows its error message under the button.
- **Server vs browser code:** a `"use client"` file's exports are only placeholders on the server (a `MAX_QTY` imported from `lib/cart.ts` silently stopped working this way). Shared types, rules and constants go in `lib/orders.ts` (no `"use client"`); `lib/account.ts` / `lib/cart.ts` are browser stores.

## Cart

- Client-side store in `lib/cart.ts` (`useSyncExternalStore`), saved to `localStorage` under `freshmewa-cart-v2`.
- A line is one flavour in one pack size (`{ slug, pack, qty }`), max 20 per line.
- Any component can call `cart.add(slug, pack, qty)`, `cart.open()`, etc.; the navbar badge and drawer update instantly.
- Checkout clears the cart after an order is placed. When a backend exists, move cart + orders to the server/API.

---

## Design system

- **Colours** (`app/globals.css` → `@theme`): `cream`, `cream-deep`, `forest`, `forest-soft`, `forest-deep`, `gold`, `gold-soft`, `pista`, `ink`, plus flavour tones `mint`, `pepper`, `chilli` (each with a `-soft` tint).
- **Type**: Veneer (`font-poster`, headings/buttons, uppercase), Fraunces (`font-display`, italic accents), Manrope (`font-sans`, body), Comic Neue (`font-hand`, Our Story page), Veneer Extras (`font-ornament`, decorative glyphs).
- **Shared utilities**: `poster-h2` (section heading), `btn` + `btn-primary` / `btn-outline`, `marker` (highlighter-pen underline).
- **Spacing**: sections use `py-14 sm:py-16 lg:py-20` and `max-w-7xl px-5 sm:px-8` containers — keep it tight.
- **Motion**: transform/opacity only; shared easing in `lib/motion.ts`; scroll reveals via `ui/Reveal`. Everything respects `prefers-reduced-motion` (Motion's `MotionConfig`, Lenis disabled, CSS animations off).
- **Mobile**: card rows become horizontal swipe sliders; no horizontal page overflow.
- **Footer** (`components/sections/Footer.tsx`): cream band with the makhana bowl sitting in a curved "smile" top edge (SVG Bézier), loose makhana placed on points along that curve. Rendered once from `app/layout.tsx`.

## Performance rules (it's a store — speed sells)

Measured on the production build (homepage, first load):

| | Before tuning | Now |
| --- | --- | --- |
| Images | 2,907 KB (11,840 px logo PNG) | ~32 KB |
| Fonts | 696 KB, 8 files preloaded | ~296 KB, 3 preloaded |
| JS (uncompressed) | 668 KB | 617 KB |

Keep it that way:

- **Images**: always `next/image` with a static import + correct `sizes`. Never put a full-size export in `public/` and reference it with `<img>`. Master files go in `brand/` (not served).
- **Animation**: import from `framer-motion` and use `m.div`, not `motion.div`. `LazyMotion strict` in `app/layout.tsx` throws if `motion.*` sneaks in. Don't import from `motion/react` — its re-export pins the whole library into the bundle. Animate only `transform`/`opacity`; no `mix-blend-mode` on large areas.
- **Fonts**: Veneer is subset to capitals/digits/punctuation/₹ (`.font-poster` forces uppercase). Decorative fonts (Comic Neue, Tiro Devanagari, Veneer Extras) use `preload: false`. Re-subset with fontTools if you need more glyphs.
- **Pages** are static (pre-rendered). Keep data in `lib/content.ts` so they stay static until a real API is needed.

## Images

- Product cutouts: run `node scripts/cutout.mjs photo.jpg` on a photo shot on a white background → transparent `photo.webp` next to it (soft shadows kept, product fully opaque).
- Logo: master file at `brand/logo-original.png`; the site serves `public/images/logo.webp` (600 px).
- Chai + makhana (homepage Intro): `public/images/hero/chai-makhana.webp`, made from `brand/chai-makhana-original.webp` by `node brand/remove-pouch.mjs` — the original's pouch is another brand's pack (label reads "Mahana"), so it is removed. Don't use the original on the site.
- Green bowl + kulhad chai (homepage "A Better Snack…" section): `public/images/hero/makhana-chai-bowl.webp` (1000 px), master in `brand/chai-bowl-original.webp`.
- Illustrated hand tossing makhana (homepage Intro, above the card): `public/images/hero/hand-makhana.webp`, master in `brand/hand-makhana-original.webp`.
- Sources: stock kraft pouch from Unsplash (@mockupgraphics, label added in code); makhana bowl/pieces from Pexels (photo 7051132); seasoned makhana bowl is a generated image (`output/imagegen`). All free-licence stock; swap for brand photography when available.

## Fonts

Veneer / Veneer Extras (Yellow Design Studio) are loaded from subset WOFF2 files in `app/fonts/`. The original `.ttf` files in `public/fonts/` are publicly downloadable — confirm the font licence allows that, or move them out of `public/`.

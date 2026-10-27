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
| `/login` | Customer login: **Continue with Google** or email → 6-digit code. `?next=/checkout` returns there after login |
| `/checkout` | **Login required.** Contact → delivery address → payment (Cash on Delivery) with a sticky order summary |
| `/checkout/success?order=…` | Order confirmation |
| `/account` | **Login required.** My Account: My Orders (from the database, any device), My Addresses (this device), My Loyalty Points (coming soon), Log out |
| `/blog` | Published blog posts, newest first (not linked from the navbar yet) |
| `/blog/[slug]` | One post: "On this page" contents (left), post, "Our flavours" shop card (right) |

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

Every page is a folder in `app/` (folder path = URL). Code that only runs on the **server** (database, login, admin checks) imports `"server-only"`; code that runs in the **browser** starts with `"use client"`. Shared rules/types that both need live in `lib/orders.ts`.

### Root files

| File | What it does |
|---|---|
| `.env.local` | **Secrets** (database URL, Neon Auth URLs, cookie secret). Git-ignored — never commit or share. |
| `neon.ts`, `.neon/` | Neon project link + services (`auth: true`). Used by `neon deploy`. |
| `drizzle.config.ts` | Settings for `npx drizzle-kit push` (where the schema is, which DB URL). |
| `next.config.ts` | Next.js settings (image formats etc.). |
| `tsconfig.json` | TypeScript settings (`@/…` = project root). |
| `AGENTS.md` / `CLAUDE.md` | Notes for AI coding tools. |

### `app/` — pages and server code

| Folder / file | URL | What it does |
|---|---|---|
| `layout.tsx` | every page | Fonts, metadata, motion + smooth scroll, shop Navbar/Footer (hidden on `/admin`) |
| `globals.css` | — | Design tokens (colours, fonts) + shared classes (`poster-h2`, `btn`, …) |
| `page.tsx` | `/` | Homepage (section order) |
| `fonts/` | — | Subset WOFF2 Veneer fonts the site actually loads |
| `icon.png`, `apple-icon.png`, `favicon.ico` | — | Browser/phone icons |
| `shop/page.tsx` | `/shop` | Shop page |
| `shop/[slug]/page.tsx` | `/shop/pudina` … | Product page (`[slug]` = the flavour in the URL) |
| `our-story/` | `/our-story` | Brand story page |
| `shipping-returns/` | `/shipping-returns` | Shipping & returns policy |
| `checkout/page.tsx` | `/checkout` | Checkout page |
| `checkout/actions.ts` | — | **`placeOrder` server action**: validates, prices and saves the order to the database |
| `checkout/success/` | `/checkout/success` | Order confirmation |
| `login/` | `/login` | Customer login page, `LoginForm` and `emailLogin` action (send code / check code) |
| `account/` | `/account` | My Account (the customer's own orders from the DB; addresses still on this device) + `logOut` action |
| `blog/page.tsx` | `/blog` | Blog list (static; rebuilt when a post changes) |
| `blog/[slug]/page.tsx` | `/blog/why-makhana` … | One post + table of contents + flavours sidebar, `BlogPosting` JSON-LD |
| `api/auth/[...path]/route.ts` | `/api/auth/*` | Forwards login/session requests to Neon Auth |
| `admin/page.tsx` | `/admin` | Redirects to `/admin/orders` |
| `admin/login/` | `/admin/login` | Admin sign-in form + its server action |
| `admin/(panel)/` | — | Everything behind login. `(panel)` is a *route group*: brackets keep it out of the URL |
| `admin/(panel)/layout.tsx` | — | Admin header (email, Sign out) + admin check |
| `admin/(panel)/actions.ts` | — | `signOut` server action |
| `admin/(panel)/orders/page.tsx` | `/admin/orders` | Orders list + status filter tabs |
| `admin/(panel)/orders/[id]/page.tsx` | `/admin/orders/FM-…` | One order: items, totals, customer, address, status dropdown |
| `admin/(panel)/orders/actions.ts` | — | `updateStatus` server action |
| `admin/(panel)/blog/page.tsx` | `/admin/blog` | All posts (Draft / Published) |
| `admin/(panel)/blog/new/`, `[id]/` | `/admin/blog/new`, `/admin/blog/3` | Write / edit a post |
| `admin/(panel)/blog/PostForm.tsx`, `RichEditor.tsx` | — | Post form + WordPress-style editor (Tiptap) |
| `admin/(panel)/blog/actions.ts` | — | `savePost` (save / publish / unpublish, cleans HTML) and `removePost` |

### `components/` — UI pieces used by the pages

| Folder / file | What it does |
|---|---|
| `Navbar.tsx` | Sticky navbar, mobile menu, cart badge |
| `CartDrawer.tsx` | Slide-in cart (qty, remove, subtotal, savings) |
| `CartButtons.tsx` | Add to Cart + Buy Now |
| `FlavourCard.tsx` | Product card (homepage = CTA, shop = price + cart buttons) |
| `MakhanaPouch.tsx`, `PouchTrio.tsx` | Pouch image with flavour label; three floating pouches |
| `Hero.tsx` | Homepage hero |
| `SmoothScroll.tsx` | Lenis smooth scroll (off for reduced-motion users) |
| `HideOnAdmin.tsx` | Hides the shop Navbar/Footer on `/admin` pages |
| `Logo.tsx` | Logo used in the mobile menu |
| `sections/` | Homepage sections; `Faq`, `FinalCta`, `Marquee`, `Footer` are reused on other pages |
| `shop/` | Shop-page-only sections |
| `product/` | Product page gallery + buy box |
| `story/` | Our Story chapters, chapter nav, reading progress |
| `checkout/` | Checkout form + order confirmation |
| `account/` | My Account view + "Add New Address" dialog |
| `ui/` | Small shared bits: `Reveal` (fade-up on scroll), `Ornaments` (Veneer glyphs) |

### `lib/` — data, rules and stores (no UI)

| File | Runs in | What it does |
|---|---|---|
| `content.ts` | both | **All copy + product data** (flavours, packs, prices, FAQs, checkout settings) — edit text/prices here |
| `orders.ts` | both | Order/address types, `orderStatuses`, `MAX_QTY`, validation + helpers (server-safe, no `"use client"`) |
| `cart.ts` | browser | Cart store (localStorage) |
| `account.ts` | browser | My Account store (profile, addresses, orders on this device) |
| `motion.ts` | browser | Shared animation easing/variants/parallax hooks |
| `safe-next.ts` | both | Only allows `?next=` to our own pages (blocks open redirects) |
| `*.test.ts` | — | Runnable checks: `node lib/cart.test.ts`, `node lib/account.test.ts`, `node lib/safe-next.test.ts` |
| `db/schema.ts` | server | Database tables (Drizzle). Change → `npx drizzle-kit push` |
| `db/index.ts` | server | The `db` client (Neon over HTTP) |
| `db/orders.ts` | server | Admin order queries (`listOrders`, `getOrder`, `setOrderStatus`) — each checks admin itself. `listMyOrders()` = the logged-in customer's orders (takes no user id on purpose) |
| `db/posts.ts` | server | Blog queries: public ones return published posts only; admin ones check admin |
| `auth/server.ts` | server | Neon Auth instance (`auth.getSession`, `auth.signIn`, …) |
| `auth/admin.ts` | server | `requireAdmin()` — call at the top of every admin page/action |
| `auth/users.ts` | server | `requireUser(next)` — any logged-in customer, else `/login?next=…`. One session lookup per request (`cache`) |
| `auth/client.ts` | browser | Browser auth client (Google sign-in) |

### Assets and tools

| Folder | What it does |
|---|---|
| `public/images/hero/` | Product + illustration images the site uses (optimized WebP) |
| `public/images/logo.webp` | Site logo (600px) |
| `public/fonts/` | Original Veneer font files (TTF/PDF) — **source only**; the site loads the subsets in `app/fonts/` |
| `brand/` | Full-size originals (logo PNG, photo masters) + `image-backups/` — not served, kept for re-exporting |
| `scripts/cutout.mjs` | Turns photos shot on white into transparent WebP cutouts |
| `.claude/` | AI tool config (`launch.json` for preview servers, Neon skills) |
| `output/` | Scratch screenshots/previews — not part of the site, not committed |

> Not used by the site (safe to move to `brand/` or delete): `public/makhana-brown-bowl-no-leaves.png` (2.5 MB), `public/images/Mithila Plain Makhana.jpg`, and the default Next.js SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).

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
- [x] Admin page to see orders and update their status (`/admin`)
- [x] Customer login (Google + email code) — orders are linked to the customer and My Orders works on any device
- [ ] Before launch: own Google OAuth app (dev uses Neon's shared keys) and custom SMTP for login emails (dev sends from `auth@mail.myneon.app`)
- [ ] Saved addresses still live only in the browser — move them to the database
- [ ] Phone OTP: needs an SMS provider + DLT registration, and Neon Auth has no phone-first sign-up
- [ ] Online payments (e.g. Razorpay) + order status updates
- [ ] Set the delivery fee policy

## Deploying (Hostinger)

- **Build:** `npm run build` (= `next build --webpack`). Webpack, not Turbopack: Turbopack starts many helper processes in parallel and hit Hostinger's per-account process/memory limits ("node process exited before we could connect to it"). Same site, slower build. `npm run dev` still uses Turbopack.
- **Start:** `npm start` (`next start`, uses Hostinger's `PORT`).
- **Environment variables** (Hostinger panel, never in git): `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_COOKIE_SECRET` (make a new one for production).
- **Neon Auth:** add the live domain as a trusted domain (`neon neon-auth domain add https://your-domain`), or login redirects fail with "invalid domain".
- **Server location:** pick the data centre closest to Neon (Singapore) — every database/login call crosses that distance.

## Database (Neon Postgres + Drizzle)

- Neon project `freshmewa`, branch `production`; linked with `neon link` (`.neon/`, `neon.ts` has `auth: true`). `neon deploy` writes `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and the `NEON_AUTH_*` vars into `.env.local` (git-ignored, never commit it).
- Schema: `lib/db/schema.ts` → `posts` table (blog; `publishedAt` null = draft, `slug` unique) and `orders` table (same shape as `Order` in `lib/orders.ts`; `user_id` = the customer's `neon_auth.user.id`, indexed; amounts in whole ₹; `status` = placed / shipped / delivered / cancelled).
- Client: `import { db } from "@/lib/db"` — **server code only** (`server-only` guard).
- Change the schema, then apply it: `npx drizzle-kit push` (uses the unpooled URL, see `drizzle.config.ts`).
- **Placing an order** = server action `placeOrder` in `app/checkout/actions.ts`. The browser sends only the form + cart lines (slug, pack, qty); the server re-validates them, rejects unknown flavours/packs and quantities outside 1–`MAX_QTY`, prices everything from `lib/content.ts`, then inserts the row. The checkout form shows its error message under the button.
- **Server vs browser code:** a `"use client"` file's exports are only placeholders on the server (a `MAX_QTY` imported from `lib/cart.ts` silently stopped working this way). Shared types, rules and constants go in `lib/orders.ts` (no `"use client"`); `lib/account.ts` / `lib/cart.ts` are browser stores.

## Customer login

- **How:** `/login` — Google (browser → `/api/auth` → Google → back) or email code (`emailLogin` in `app/login/actions.ts`: no code → send one; code → sign in, first login creates the account). Same Neon Auth user list as the admin; customers have role `user`.
- **Protected:** `/checkout`, `/account` and the `placeOrder` action call `requireUser()` (`lib/auth/users.ts`). The action check is the real lock — tested: a logged-out `placeOrder` request gets a redirect and saves nothing.
- **Orders ↔ customer:** `placeOrder` saves `user_id` from the session (never from the form). `listMyOrders()` reads it from the session too, so nobody can request another customer's orders.
- **Remembering the login:** cookies set by Neon Auth — `session_token` (7 days, row in `neon_auth.session`) and `session_data` (signed with `NEON_AUTH_COOKIE_SECRET`, 5-minute shortcut so most requests skip the network). Both `HttpOnly; Secure; SameSite=Lax`. Log out deletes the session row and the cookies.
- **After login:** `?next=` is checked by `safeNext` so it can only go to our own pages.

## Admin (`/admin`)

- **Login:** `/admin/login` (email + password via **Neon Auth**, `lib/auth/server.ts`; browser auth calls go through `app/api/auth/[...path]`). Needs `NEON_AUTH_COOKIE_SECRET` in `.env.local` (32+ random chars).
- **Who gets in:** only users with role `admin`. Add one: sign up through `/api/auth/sign-up/email`, then Neon console → Auth → Users → ⋯ → **Make admin**. (Users created in the console have no password.)
- **Pages:** `/admin/orders` (newest first, filter by status) → `/admin/orders/[id]` (items, totals, customer, address, status dropdown). Admin pages hide the shop navbar/footer (`components/HideOnAdmin.tsx`).
- **Security rule:** every order query lives in `lib/db/orders.ts` and calls `requireAdmin()` (`lib/auth/admin.ts`) itself — pages *and* server actions are protected even if called directly. Tested: a logged-out `updateStatus` request is redirected to the login and the order is unchanged.
- Server-only files import `"server-only"` so the build fails if browser code ever imports them.

## Blog

- **Write:** `/admin/blog` → New post. Paste from Google Docs, Word or a website — headings, bold, lists, links and quotes are kept (Tiptap editor, `RichEditor.tsx`). Empty URL field = made from the title.
- **Buttons:** Save draft / Publish / Unpublish (Publish also saves edits), Delete (asks first). Duplicate URLs are blocked by the database (`slug` unique) and shown as an error.
- **Security:** post HTML is cleaned on the server with `sanitize-html` before saving (only headings, text formatting, lists, links, quotes, images; no scripts/styles/`javascript:` links), because the public page inserts it as HTML.
- **Speed:** `/blog` and each `/blog/[slug]` are served as static HTML; saving, publishing or deleting a post rebuilds them (`revalidatePath("/blog", "layout")`).
- **Styling:** `.blog-content` in `app/globals.css` styles the post in both the editor and the public page.
- **Images:** add by URL with the toolbar's Image button (e.g. `/images/…`). Pasted Word/screenshot images are dropped; Google Docs image links expire. Uploads need file storage (not built yet).

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

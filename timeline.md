# Change Timeline — medusa-app

A running log of changes made to this project, with timestamps. Most recent work at the bottom.

---

## 2026-06-05 — Storefront restyle: Warm Minimal (Typology × Klur)

**Goal:** Restyle the Next.js storefront (`apps/storefront`) to feel like a blend of
[typology.com](https://us.typology.com/) (Parisian apothecary minimalism) and
[klur.co](https://klur.co/) (warm earthy neutrals, approachable luxury).

**Design language:**
- Palette: warm **cream** `#FBF8F3` + **sand** `#F1E9DC` backgrounds, **espresso** `#2E2A25` text,
  **clay** `#A6794F` accent (links/CTAs), **sand border** `#E5DBCB`.
- Typography: **Fraunces** (serif) for headings + **Inter** (sans) for body.
- Soft pill buttons, generous whitespace, editorial feel. Brand name kept as "Medusa Store".

| Time (EDT) | File(s) | Change |
|---|---|---|
| 12:31 | `src/app/layout.tsx` | Loaded **Fraunces** + **Inter** via `next/font/google` as CSS variables (`--font-serif`, `--font-sans`); applied `font-sans bg-cream text-espresso` on `<body>`. |
| 12:32 | `tailwind.config.js` | Added warm palette colors (`cream`, `sand`, `sandborder`, `espresso`, `taupe`, `muted`, `clay`) and a `serif` font family mapped to `var(--font-serif)`; pointed `sans` at `var(--font-sans)`. |
| 12:33 | `src/styles/globals.css` | Overrode `@medusajs/ui-preset` design tokens (`--bg-base`, `--bg-subtle`, `--fg-base`, `--fg-subtle`, `--fg-muted`, `--border-base`, `--fg-interactive`, `--button-inverted`) to the cream/clay palette — this re-skins every component using `ui-*` classes globally. Restyled `.contrast-btn` to an espresso pill. |
| 12:34 | `src/modules/common/components/ui/index.tsx` | `Heading` now defaults to `font-serif` (all headings become serif). `Button` restyled to pill shape — primary = espresso→clay hover, secondary = espresso outline, transparent = sand hover. `Input` border → sand, focus ring → clay. |
| 12:35 | `src/modules/layout/templates/nav/index.tsx` | Serif wordmark with refined tracking + clay hover; header background → cream. |
| 12:36 | `src/modules/home/components/hero/index.tsx` | Rebuilt as a **video-ready hero**: full-bleed `<video autoPlay muted loop playsInline>` from `public/hero.mp4` with `public/hero-poster.jpg`, warm `bg-sand` + gradient overlay fallback, new serif headline ("Skincare, distilled to its essence") + subcopy + clay CTA linking to `/store`. Removed the GitHub button. |
| 12:36 | `src/modules/layout/templates/footer/index.tsx` | Serif wordmark + clay hover (warm tokens otherwise inherited). |
| 12:37 | `src/modules/products/components/product-preview/index.tsx` | Product card title → espresso, uppercase, letter-spaced (editorial), aligned price row. |
| 12:37 | `src/app/[countryCode]/(main)/page.tsx` | Updated homepage `metadata` (title/description) to brand copy; increased section spacing. |

**Verification:** storefront recompiled with no errors (`GET /dk 200`); confirmed hero copy, video element,
`bg-cream`, and both font-variable classes (`inter_*`, `fraunces_*`) present in the rendered HTML.

**To add a hero video:** drop a clip at `apps/storefront/public/hero.mp4` (optionally a still at
`apps/storefront/public/hero-poster.jpg`). Until then, the warm sand background + overlay renders cleanly.

---

## 2026-06-05 — Two Typology-style homepage sections + About page

**Goal:** Recreate the two sections after Typology's hero (the editorial value statement with a cycling
word, and a Best Sellers grid), adapted to this store's warm-minimal theme, plus a new About page.
Copy is quiet-luxury / generic ("considered, crafted, made to last"), not skincare.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 13:28 | `src/modules/home/components/value-prop/cycling-words.tsx` *(new, client)* | Animated word that cycles "considered → crafted → made to last" with a soft fade, in serif clay italic; layout-stable via an invisible sizer. |
| 13:29 | `src/modules/home/components/value-prop/index.tsx` *(new)* | "Our approach" editorial band — eyebrow + serif "Our products are {cycling word}" + supporting copy + "Read our story" link → /about. |
| 13:30 | `src/modules/home/components/best-sellers/index.tsx` *(new)* | Best Sellers section: reuses `listProducts` (limit 8) + the existing `ProductPreview` card in a 4-up grid, with a "View all" → /store link. |
| 13:32 | `src/app/[countryCode]/(main)/about/page.tsx` *(new)* | Rich editorial About page: sand hero band, brand-story prose, 3 value pillars, full-width espresso quote band, and a CTA → /store. |
| 13:33 | `src/app/[countryCode]/(main)/page.tsx` | Inserted `<ValueProp />` and `<BestSellers />` after the hero (order: Hero → ValueProp → BestSellers → FeaturedProducts). |
| 13:33 | `src/modules/layout/components/side-menu/index.tsx` | Added "About" → /about to the mobile side menu. |
| 13:33 | `src/modules/layout/templates/nav/index.tsx` | Added an "About" link to the desktop nav (beside Account). |
| 13:34 | `src/modules/layout/templates/footer/index.tsx` | Added a "Company" footer column with About + Shop all links. |

**Reused:** `ProductPreview`, `listProducts`, `Heading`/`Text`/`Button`, `InteractiveLink`,
`LocalizedClientLink`, `.content-container` — no new styling system.

---

## 2026-06-05 — Trim hero + reframe product section for a 1–2 product shop

**Goal:** Store is a brand-new shop with only 1–2 products. Reduce hero text and replace the
"Best sellers" framing (which implies an established catalog) with a calmer "The collection" section,
and remove the now-redundant featured-collections rail.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 14:13 | `src/modules/home/components/hero/index.tsx` | Reduced hero to a single neutral headline **"Fewer, better things."** + the Shop button. Removed the tagline line and the leftover skincare wording; tightened spacing; dropped the unused `Text` import. |
| 14:14 | `src/modules/home/components/collection/index.tsx` *(new; replaces `best-sellers/`)* | Renamed section to **"The collection"** (eyebrow "Now available"), centered header, and a centered/enlarged grid (`grid-cols-1 small:grid-cols-2`, `max-w-3xl mx-auto`) so 1–2 products look intentional. Reuses `listProducts` (limit 4) + `ProductPreview`. Removed the "View all" link. |
| 14:14 | `src/modules/home/components/best-sellers/` *(deleted)* | Old "Best sellers" folder removed. |
| 14:15 | `src/app/[countryCode]/(main)/page.tsx` | Removed the `FeaturedProducts` collections rail + unused `listCollections`; homepage is now Hero → ValueProp → Collection. Simplified the guard to `if (!region)`. Updated metadata to neutral copy (no "skincare"). |

**Note:** `FeaturedProducts` component file is left in place (just unused on the homepage).

---

## 2026-06-05 — Curate homepage collection to 2 items + "See full collection" button

**Goal:** Show only chosen products on the homepage (not the demo pants/shorts), with a button to the
full store. All products remain available in /store.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 14:32 | `src/modules/home/components/collection/index.tsx` | Added a `FEATURED_HANDLES = ["t-shirt", "sweatshirt"]` constant (swap for real product handles later); the section now selects just those products by handle (in order) instead of listing everything. Added a centered **"See full collection"** outline button → /store below the grid. |

**Behavior:** Homepage "The collection" shows only T-shirt + Sweatshirt; `/store` still lists all products.
To feature your real products later, edit `FEATURED_HANDLES`.

---

## 2026-06-05 — Remove "See full collection" button + duplicate "About" header link

| Time (EDT) | File(s) | Change |
|---|---|---|
| 14:38 | `src/modules/home/components/collection/index.tsx` | Removed the "See full collection" button block and its now-unused `Button` / `LocalizedClientLink` imports. |
| 14:38 | `src/modules/layout/templates/nav/index.tsx` | Removed the "About" link from the desktop header (next to Account). About remains in the slide-out menu (`side-menu`). |

---

## 2026-06-11 — North America regions: Canada (CAD) + United States (USD)

**Goal:** Replace the Europe-only Medusa commerce setup with North American regions so Canadian shoppers see **CAD** prices and US shoppers see **USD**, using Medusa core workflows (regions, store currencies, variant prices, tax regions, fulfillment/shipping) — not hardcoded storefront currency logic.

**Approach:**
- **Canada** region — `currency_code: cad`, country `ca`
- **United States** region — `currency_code: usd`, country `us`
- Remove **Europe** region entirely
- Store default currency **CAD**; default storefront country **ca**

| Time (EDT) | File(s) | Change |
|---|---|---|
| 15:05 | `apps/backend/src/migration-scripts/setup-north-america-regions.ts` *(new)* | Idempotent migration script: `deleteRegionsWorkflow` (Europe), `createRegionsWorkflow` (Canada + US), `createTaxRegionsWorkflow` (ca/us), `updateStoresWorkflow` (cad default + usd), North American warehouse + fulfillment/shipping via `createStockLocationsWorkflow` / `createShippingOptionsWorkflow`, `createInventoryLevelsWorkflow`, `upsertVariantPricesWorkflow` (cad + usd per variant). |
| 15:06 | `apps/backend/src/migration-scripts/restore-usd-variant-prices.ts` *(new)* | Follow-up migration: re-applies **USD** prices alongside CAD after upsert replaced existing EUR/USD prices on first run. |
| 15:07 | `apps/backend/src/migration-scripts/initial-data-seed.ts` | Fresh-install seed aligned with NA setup: Canada + US regions, `cad`/`usd` store currencies, Toronto warehouse, NA geo zones (ca/us), variant prices in cad + usd only (no eur). |
| 15:08 | `apps/storefront/.env.local` | `NEXT_PUBLIC_DEFAULT_REGION=ca` (was `dk`). |
| 15:08 | `apps/storefront/src/lib/util/money.ts` | Added `localeForCurrency()` — `cad` → `en-CA`, `usd` → `en-US` for natural `$` formatting via `Intl.NumberFormat`. |

**Verification:** `GET /store/regions` returns Canada (cad, ca) and United States (usd, us) only. Product API: Canada region → `calculated_price.currency_code: cad`, amount 15; US region → `usd`, amount 15. Storefront `GET /ca 200`, `GET /us 200`. Ran `npx medusa db:migrate` successfully.

---

## 2026-06-11 — Fix missing homepage sections and products

**Goal:** Restore homepage "Our approach" and "The collection" sections with product cards after the North America region migration left a stale Next.js cache serving an incomplete `/ca` page.

**Root cause:** During migration, product fetches returned empty briefly; `Collection` returned `null` (silent hide). Next.js cached that broken render via `force-cache`. Backend products were always fine — stale storefront cache was the issue.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 15:22 | `apps/storefront/.next/` *(deleted)* | Cleared stale Next.js build/data cache; restarted dev servers. |
| 15:22 | `apps/storefront/src/modules/home/components/collection/index.tsx` | Added `unstable_noStore()` before product fetch; fallback to first 2 products when `FEATURED_HANDLES` miss; pass `countryCode` to `listProducts`; only hide section when zero products exist in region. |
| 15:22 | `apps/storefront/src/app/[countryCode]/(main)/page.tsx` | Added `export const revalidate = 60`; pass `countryCode` to `<Collection />`. |

**Verification:** `GET /ca` includes Hero, "Our approach", "The collection", T-shirt + Sweatshirt product cards (`product-wrapper` present). `GET /ca/store` lists all products. Normal refresh (no hard refresh) serves full page.

---

## 2026-06-11 — Rebrand catalog to Restorative Cream (50ml / 100ml)

**Goal:** Replace demo apparel with a single skincare product — **Restorative Cream** — with size variants (50ml / 100ml), tiered CAD/USD pricing, one custom jar image for all listings, and homepage featuring only this product.

**Product definition:**
- **Handle:** `cream`
- **Option:** Size → `50ml` ($45), `100ml` ($72) in both CAD and USD
- **Image:** `http://localhost:8000/products/cream.png` (served from storefront `public/products/`)
- **Category:** Skincare (replaces Shirts/Pants/Merch demo categories)

| Time (EDT) | File(s) | Change |
|---|---|---|
| 16:10 | `apps/storefront/public/products/cream.png` *(new)* | Custom cream jar image copied to storefront public assets. |
| 16:12 | `apps/backend/src/migration-scripts/rebrand-to-cream-product.ts` *(new)* | Idempotent migration: skip if `cream` exists; `deleteProductsWorkflow` removes demo apparel (`t-shirt`, `sweatshirt`, `sweatpants`, `shorts`); `createProductCategoriesWorkflow` ensures Skincare category; `createProductsWorkflow` creates Restorative Cream with 2 variants + cad/usd prices; `createInventoryLevelsWorkflow` stocks variants at North American warehouse. |
| 16:14 | `apps/backend/src/migration-scripts/initial-data-seed.ts` | Fresh-install seed rewritten: single Skincare category + Restorative Cream product (same structure as migration); demo apparel removed. |
| 16:15 | `apps/storefront/src/modules/home/components/collection/index.tsx` | `FEATURED_HANDLES = ["cream"]` — homepage "The collection" shows only the cream product. |
| 16:18 | `apps/storefront/.next/` *(deleted)* | Cleared stale Next.js cache after migration; restarted dev servers. |

**Verification:** `GET /products/cream.png 200`. `GET /ca` shows Restorative Cream with jar image. `GET /ca/products/cream` — size selector 50ml ($45) / 100ml ($72) in CAD. `GET /us/products/cream` — same sizes in USD. `GET /ca/store` lists only cream (no apparel). Store API: 1 product, handle `cream`, 2 variants (cad:45/72, usd:45/72), 1 image. Ran `npx medusa db:migrate` successfully.

---

## 2026-06-11 — Zoom out product images on homepage and product page

**Goal:** Show the cream jar image less cropped on the homepage collection card and the product detail gallery.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 16:45 | `src/modules/products/components/thumbnail/index.tsx` | Switched `object-cover` → `object-contain`; increased card padding `p-4` → `p-8` so the full jar is visible in homepage/store previews. |
| 16:45 | `src/modules/products/components/image-gallery/index.tsx` | Same `object-contain` treatment + `p-8` padding on the gallery frame for the product page hero image. |

---

## 2026-06-11 — Further image zoom-out + homepage size/price rows

**Goal:** Show the cream jar even smaller within its frame (more breathing room), and list both **50ml** and **100ml** with individual prices on the homepage collection card.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 17:05 | `src/modules/products/components/thumbnail/index.tsx` | Increased padding to `p-12`; image inset `inset-8` for a more zoomed-out homepage/store preview. |
| 17:05 | `src/modules/products/components/image-gallery/index.tsx` | Gallery frame `p-12`; image `inset-10` on the product page. |
| 17:06 | `src/modules/products/components/product-preview/index.tsx` | When `isFeatured`, renders a size/price row per variant (50ml · $45, 100ml · $72) instead of cheapest price only; centered layout for homepage. |

---

## 2026-06-11 — Homepage variant cards + product page zoom-out

**Goal:** Show two separate homepage cards ("Cream 50ml" / "Cream 100ml") from the single Medusa product, zoom out the product page gallery image further, and preselect size when landing from a variant card — while `/store` still lists one product.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 17:30 | `src/modules/products/components/image-gallery/index.tsx` | Gallery frame `p-16`; image `inset-16` for a more zoomed-out product page jar photo. |
| 17:31 | `src/modules/products/components/product-preview/index.tsx` | Added optional `variant` + `displayTitle` props: single title, single price, link to `/products/{handle}?v_id={variantId}`. Store/related listings unchanged (no variant prop). |
| 17:32 | `src/modules/home/components/collection/index.tsx` | Expands multi-variant featured products into one card per variant (`Cream 50ml`, `Cream 100ml`), sorted by price. |
| 17:33 | `src/modules/products/components/product-actions/index.tsx` | Reads `v_id` from URL on load to preselect the matching size option. |

**Verification:** `GET /ca` — two cards "Cream 50ml" and "Cream 100ml" with individual prices. `GET /ca/products/cream?v_id=...` — 50ml preselected. `GET /ca/products/cream` — more zoomed-out gallery. `GET /ca/store` — single Restorative Cream listing. Medusa catalog unchanged (1 product, 2 variants).

---

## 2026-06-11 — Push to GitHub + Supabase Cloud setup

**Goal:** Publish the project to https://github.com/ariyazmola/skin-app and document switching from local Supabase (port 54322) to Supabase Cloud Postgres so any computer can clone and share the same online database.

| Time (EDT) | File(s) | Change |
|---|---|---|
| 18:00 | Git / GitHub | `git init`, initial commit, remote `origin` → `github.com/ariyazmola/skin-app.git`, push to `main`. |
| 18:01 | `apps/backend/.env.template` | Supabase Cloud `DATABASE_URL` example with `?sslmode=require`. |
| 18:01 | `apps/storefront/.env.local.template` *(new)* | Storefront env template (publishable key, backend URL, default region `ca`). |
| 18:02 | `SETUP.md` *(new)* | Full setup: clone, Supabase Cloud connection, migrate, env, dev, other-computer instructions. |
| 18:02 | `README.md` | Rewritten for skin-app (cream storefront, Supabase Cloud, link to SETUP.md). |
| 18:03 | `apps/backend/.env` | `DATABASE_URL` pointed at Supabase Cloud (local `.env` only, not committed). |

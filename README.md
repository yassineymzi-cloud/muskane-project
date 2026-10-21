# Muskane Parfum

A premium Arabic, RTL, mobile-first fragrance storefront prototype for Morocco, with warm ivory backgrounds, charcoal typography and restrained gold accents. YouCan remains the intended production system for products, cart, checkout, orders and Meta Pixel. This project does not connect to or change the live store.

## Stack and rationale

Semantic HTML, CSS and native JavaScript modules; Node 20+ for development utilities and tests. No runtime libraries, package downloads, third-party scripts or external assets are required. A small static storefront is easy to review and transfer into a YouCan theme without introducing a second commerce platform.

## Install and run

Install Node 20+ and clone this repository. There are no dependencies to install.

```sh
npm run dev
# Open http://127.0.0.1:4173
npm run lint
npm test
npm run build
npm run preview
node scripts/serve.mjs --dist
```

The development server binds only to loopback. Use `PORT=4200 npm run dev` to choose another port. `dist/` contains the standalone static result; serve it over HTTP, not `file://`. The server deliberately serves only the storefront entry, source and assets, never repository/private files. Its CSP is for this demo, and must be adjusted deliberately for verified YouCan requirements.

## Views

- `#/`: premium homepage, category cards, clearly labeled demo products, four-by-10 ml sample-pack concept, men's/women's collections, concise benefits, honest review placeholder and FAQ.
- `#/collection/all`, `men`, `women`, `men-packs`, `women-packs`, `packs`: dedicated collection introductions, filtered and sorted catalogue, skeleton and empty states.
- `#/product/amber-noir` and other demo IDs: gallery, quantity, related products and mobile sticky purchase action.
- `#/search`: live search with empty and result states.
- `#/contact`, `#/policy/shipping`, `#/policy/returns`, `#/policy/privacy`: clearly provisional content.
- Cart button: native modal dialog and demo localStorage cart. Checkout is intentionally disabled.

Hash routes keep this prototype usable on basic static hosting; production YouCan must use its real crawlable URLs and server-rendered metadata.

## Project structure

```text
index.html                  Arabic document, shared header/footer/cart shell
src/app.js                  Views, navigation and interaction composition
src/components/product-card.js   Reusable product cards and DH price display
src/styles.css              Tokens, responsive styles, RTL and reduced motion
src/config.js               Brand, assets, contact and integration configuration
src/data/products.js        Entirely fictional demo catalogue
src/adapters/youcan.js       Explicit demo commerce boundary
src/seo.js                  Metadata and schema helpers (production gated)
assets/                     Local, original SVG placeholder illustrations
scripts/                    Static build, safe preview server, preview generator, checks
previews/muskane-review.html Self-contained Desktop/Tablet/Mobile review artifact
tests/                      Commerce and preview behavior tests
YOUCAN-INTEGRATION.md        Production mapping and handoff
QA.md                       Verification and remaining limits
```

## Customize

Change palette tokens at the top of `src/styles.css`: `--ink`, `--gold`, `--soft`, `--muted`, `--line`. The gold is an accent, not body text on white. Typography uses installed Arabic-capable fonts with no network font request; a licensed locally hosted Arabic typeface can be added later.

Edit copy in view functions in `src/app.js`; shared navigation and footer live in `index.html`. Edit only `src/data/products.js` for the fictional catalogue. Replace assets in `assets/` and set independent mobile/desktop hero paths in `src/config.js`. Product cards reserve image space and lazy-load images below the hero. The hero uses a responsive `<picture>` and eager high-priority loading.

Set `whatsappNumber` to verified international digits (without `+`) to reveal the optional floating link. Empty configuration hides it. Set only public `contactEmail` and verified HTTPS social links; never add secrets. Contact and policy copy are placeholders until the store owner supplies approved details.

All product names, notes, sizes, prices, old prices and discounts are fictional, explicitly labeled demo data. The four-by-10 ml pack is a presentation concept, not a real Muskane offer. Prices display in Moroccan dirhams as DH; the configured currency code remains MAD.

Demo cart entries persist in localStorage under `muskane-demo-cart`. They are not orders, contain no customer data and can be cleared from the cart or browser. Browser storage failure falls back to memory.

## YouCan and SEO

Read [YOUCAN-INTEGRATION.md](YOUCAN-INTEGRATION.md) before production work. Do not deploy this demo as a second checkout. The adapter currently performs no network requests. Do not simply change `config.mode` to claim integration is done.

The demo is intentionally `noindex,nofollow`, with no invented canonical URL, Product offers or review schema. Route-specific titles/descriptions are updated for prototype navigation. `src/seo.js` contains gated Breadcrumb/Product helpers; production must emit real per-page metadata, absolute Open Graph URLs/images and canonical links through YouCan's theme rendering. Product offers and availability require actual backend data.

## Validation

`npm run lint` checks JavaScript syntax, catalogue IDs/categories, RTL attributes and entry asset paths. `npm test` checks cart merge/immutability, quantity cap, refusal of demo checkout and standalone-preview generation. `npm run build` copies the static application to `dist/`. Read [QA.md](QA.md) for browser coverage and limits. No build step minifies code; there is very little JavaScript and no dependency bundle.

## Downloadable visual preview

Generate the current self-contained snapshot with `npm run preview`. The output is `previews/muskane-review.html`; no server or build output is needed to review this file.

1. On GitHub, select the `work` branch and open `previews/muskane-review.html`.
2. Use **Download raw file** (or open **Raw** and save the file), keeping the `.html` extension.
3. Open the downloaded file directly in Chrome. Use **Desktop**, **Tablet**, and **Mobile** to switch the review width, then scroll within the storefront.

The file embeds the storefront code, styles and illustrations and retains demo navigation/cart interactions. It never connects to YouCan, submits an order or loads Meta Pixel. Regenerate it after changing the source; do not hand-edit the generated snapshot. Temporary screenshots, `work/`, `dist/` and `node_modules/` are excluded from Git.

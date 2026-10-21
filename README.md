# Muskane Parfum

An Arabic, RTL, mobile-first fragrance storefront prototype for Morocco. YouCan remains the intended production system for products, cart, checkout, orders and Meta Pixel. This project does not connect to or change the live store.

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
node scripts/serve.mjs --dist
```

The development server binds only to loopback. Use `PORT=4200 npm run dev` to choose another port. `dist/` contains the standalone static result; serve it over HTTP, not `file://`. The server deliberately serves only the storefront entry, source and assets, never repository/private files. Its CSP is for this demo, and must be adjusted deliberately for verified YouCan requirements.

## Views

- `#/`: homepage, categories, featured demo products, discovery packs, men's/women's collections, values, honest review placeholder, FAQ.
- `#/collection/all`, `men`, `women`, `men-packs`, `women-packs`, `packs`: filtered and sorted catalogue, skeleton and empty states.
- `#/product/amber-noir` and other demo IDs: gallery, quantity, related products and mobile sticky purchase action.
- `#/search`: live search with empty and result states.
- `#/contact`, `#/policy/shipping`, `#/policy/returns`, `#/policy/privacy`: clearly provisional content.
- Cart button: native modal dialog and demo localStorage cart. Checkout is intentionally disabled.

Hash routes keep this prototype usable on basic static hosting; production YouCan must use its real crawlable URLs and server-rendered metadata.

## Project structure

```text
index.html                  Arabic document, shared header/footer/cart shell
src/app.js                  Views, navigation and interaction composition
src/components/product-card.js   Reusable product cards and MAD formatting
src/styles.css              Tokens, responsive styles, RTL and reduced motion
src/config.js               Brand, assets, contact and integration configuration
src/data/products.js        Entirely fictional demo catalogue
src/adapters/youcan.js       Explicit demo commerce boundary
src/seo.js                  Metadata and schema helpers (production gated)
assets/                     Local, original SVG placeholder illustrations
scripts/                    Static build, safe preview server, source checks
tests/                     Commerce behavior tests
YOUCAN-INTEGRATION.md        Production mapping and handoff
QA.md                       Verification and remaining limits
```

## Customize

Change palette tokens at the top of `src/styles.css`: `--ink`, `--gold`, `--soft`, `--muted`, `--line`. The gold is an accent, not body text on white. Typography uses installed Arabic-capable fonts with no network font request; a licensed locally hosted Arabic typeface can be added later.

Edit copy in view functions in `src/app.js`; shared navigation and footer live in `index.html`. Edit only `src/data/products.js` for the fictional catalogue. Replace assets in `assets/` and set independent mobile/desktop hero paths in `src/config.js`. Product cards reserve image space and lazy-load images below the hero. The hero uses a responsive `<picture>` and eager high-priority loading.

Set `whatsappNumber` to verified international digits (without `+`) to reveal the optional floating link. Empty configuration hides it. Set only public `contactEmail` and verified HTTPS social links; never add secrets. Contact and policy copy are placeholders until the store owner supplies approved details.

Demo cart entries persist in localStorage under `muskane-demo-cart`. They are not orders, contain no customer data and can be cleared from the cart or browser. Browser storage failure falls back to memory.

## YouCan and SEO

Read [YOUCAN-INTEGRATION.md](YOUCAN-INTEGRATION.md) before production work. Do not deploy this demo as a second checkout. The adapter currently performs no network requests. Do not simply change `config.mode` to claim integration is done.

The demo is intentionally `noindex,nofollow`, with no invented canonical URL, Product offers or review schema. Route-specific titles/descriptions are updated for prototype navigation. `src/seo.js` contains gated Breadcrumb/Product helpers; production must emit real per-page metadata, absolute Open Graph URLs/images and canonical links through YouCan's theme rendering. Product offers and availability require actual backend data.

## Validation

`npm run lint` checks JavaScript syntax, catalogue IDs/categories, RTL attributes and entry asset paths. `npm test` checks cart merge/immutability, quantity cap and refusal of demo checkout. `npm run build` copies the static application to `dist/`. Read [QA.md](QA.md) for browser coverage and limits. No build step minifies code; there is very little JavaScript and no dependency bundle.

## Downloadable visual preview

`previews/muskane-review.html` is a self-contained review snapshot of this initial version. Download the raw file from GitHub, save it with an `.html` extension, and open it in your browser. Use its Desktop and Mobile buttons to switch layouts. It includes embedded assets and demo interactions, and has no production checkout connection. It is a review deliverable; update it deliberately when the source design changes. Temporary screenshots, `work/`, `dist/` and `node_modules/` are not committed.

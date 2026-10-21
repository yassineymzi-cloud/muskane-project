# MUSKANE PARFUM — independent preview

Arabic RTL, mobile-first perfume storefront. Buildless HTML, CSS and JavaScript; no runtime dependencies.

## Local preview

Download and extract the complete repository, then double-click `index.html` in Windows/Chrome. No server, localhost or Chrome security changes are required. Keep `catalog.js`, `app.js` and `styles.css` next to `index.html`. Product photos still use their original remote URLs and require internet access.

`catalog.js` is the browser-loadable copy of `catalog.json`; it is loaded as a classic script before `app.js`, so file:// does not require a JSON fetch. Keep both catalog files synchronized when changing source data.

Optional HTTP preview: from this repository run `python3 -m http.server 4173 --bind 127.0.0.1`, then open **http://localhost:4173**. Remote workspaces require port 4173 forwarded to your device. This command does not deploy the website.

## Files and source

- `catalog.json`: 15 real products read exclusively from https://muskaneparfum.com on 2026-10-21: seven men's fragrances, seven women's fragrances and one men's set. The sitemap and all five category pages were checked; women's sets and the default category were empty. Names, MAD prices, categories, original page URLs, descriptions and original gallery URLs come from embedded product data. No images were downloaded.
- `index.html`: accessible RTL page shell, navigation, search/cart dialogs and basic SEO metadata.
- `styles.css`: responsive cream/charcoal design, subtle gold accents, image containment and reduced-motion support.
- `app.js`: homepage, collection sorting, product details, same-category suggestions, search, local preview cart and source links.

The men's set has no description in the source product data; none has been invented. Image URLs were read, but image contents cannot be verified in the restricted Codex network. A clearly labelled typographic fallback appears if an image fails, never a substitute product image.

The cart stores product IDs and quantities in localStorage (`muskane-preview-cart`). It is explicitly a preview, with no checkout, payment/customer form, order endpoint or real order submission. Product details link to original YouCan product pages.

No invented reviews, ratings, discounts, inventory or shipping claims. Footer policy/social URLs were copied from the source storefront. Description HTML is sanitized before rendering.

No deployment is configured. Nothing is published to YouCan or muskaneparfum.com. External deployment requires owner approval.

## Checks and routes

Run `node --check app.js` and `python3 -m json.tool catalog.json > /dev/null`.

Hash routes work on any static server without rewrites: `#/collection/all`, `#/collection/parfum-homme`, `#/collection/parfum-femme`, `#/collection/packs-homme`, `#/product/<source-slug>`.

Dynamic titles/descriptions work in the browser; complete search-engine rendering requires a future server-rendering integration.

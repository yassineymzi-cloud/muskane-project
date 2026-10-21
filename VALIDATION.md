# Preview validation — 2026-10-21

Source: https://muskaneparfum.com only. All 15 product pages and five category pages were read. All eight linked information/policy pages returned HTTP 200. There are 16 original gallery image URLs; no product image files were downloaded or substituted.

## Passed

- JavaScript syntax (`node --check app.js`), JSON parsing, and `git diff --check`.
- Chromium browser verification at 375, 390, 430, 768 and 1440 pixels: homepage, all-products collection, men's collection, women's collection, men's sets and product detail. No horizontal document overflow.
- All 15 product routes: names, original source links and same-category recommendations.
- Ascending/descending price sorting; search for ASAD and navigation to its detail page.
- Preview cart: add, increase quantity, correct total (2 × 239 = 478 DH), persistence after reload, removal and empty state.
- Mobile menu open, navigation and automatic close; dialog close with Escape.
- No JavaScript page exceptions and no non-GET requests during functional browser tests.
- Visual inspection of homepage on desktop/mobile and mobile product detail; contained images, RTL, navigation, card layout, footer and readable descriptions. Unsupported diagonal-arrow glyphs were replaced with basic arrows.

## Limits

- Image domains are blocked in this execution environment. Browser QA also explicitly aborts these image domains to exercise the fallback state. Final image appearance must be reviewed in a browser that can access the original CDN URLs. Their URLs remain unchanged in the catalog and image `src` attributes.
- The men's set description is absent in source data. No description, review, inventory, discount or delivery promise was invented.
- This is a static preview with hash routes, not a connected YouCan checkout. No purchase/payment/customer-data submission exists.
- No external deployment was performed. The local HTTP preview works on port 4173; remote environments need port forwarding, or the repository can be served locally using the README command.

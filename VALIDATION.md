# Preview validation — 2026-10-21

## Current refresh

- Re-read all original 15 product pages: names, prices and original gallery URLs still match. Their complete catalog entries are unchanged.
- The live women's-set collection now exposes `https://muskaneparfum.com/products/angham-libbra-prohibit-rouge-vulcan-baie`, although the product sitemap still lists only 15 URLs. Added its verified 199 MAD price, exact name, category and original image URL. Total: 16 products, including one women's set. No description is present for either set.
- Responsive hero banners use the exact desktop/mobile image URLs in the official homepage. They are remote references, not downloaded image files or generated artwork.
- The original gallery data remains untouched; the standalone `catalog.js` was regenerated from `catalog.json` for local opening.
- Reduced homepage height by removing the repeated pack promotion; four compact category links, combined men's/women's set collection and a grouped footer retain access to every category and source link.

Source: https://muskaneparfum.com only. All 15 product pages and five category pages were read. All eight linked information/policy pages returned HTTP 200. There are now 17 original gallery image URLs; no product image files were downloaded or substituted.

## Passed

- JavaScript syntax (`node --check app.js`), JSON parsing, and `git diff --check`.
- Chromium browser verification at 375, 390, 430, 768 and 1440 pixels: homepage, all-products collection, men's collection, women's collection, men's sets and product detail. No horizontal document overflow.
- All 16 product routes: names, original source links and same-category recommendations.
- Ascending/descending price sorting; search for ASAD and navigation to its detail page.
- Preview cart: add, increase quantity, correct total (2 × 239 = 478 DH), persistence after reload, removal and empty state.
- Mobile menu open, navigation and automatic close; dialog close with Escape.
- No JavaScript page exceptions and no non-GET requests during functional browser tests.
- Visual inspection of homepage on desktop/mobile and mobile product detail; contained images, RTL, navigation, card layout, footer and readable descriptions. Unsupported diagonal-arrow glyphs were replaced with basic arrows.

## Limits

- Image domains are blocked in this execution environment. Browser QA also explicitly aborts these image domains to exercise the fallback state. Final image appearance must be reviewed in a browser that can access the original CDN URLs. Their URLs remain unchanged in the catalog and image `src` attributes.
- Both set descriptions are absent in source data. No description, review, inventory, discount or delivery promise was invented.
- This is a static preview with hash routes, not a connected YouCan checkout. No purchase/payment/customer-data submission exists.
- No external deployment was performed. Opening `index.html` directly loads the catalog via classic local scripts without fetch or a server. Managed Chromium blocks file:// navigation by policy; the browser checks use intercepted static responses for the same four local files, with no server and no JSON requests. Native Windows/Chrome file:// verification is not available in this environment.

# YouCan integration handoff

## Boundary and current status

This is a local storefront prototype built from an almost-empty repository. There is no YouCan API connection, order submission, payment processing or deployment. All six products, prices, notes, discounts and illustrations are demo content. No YouCan credentials, runtime HTML or customer data were used.

Keep YouCan as the production source of truth for product/variant IDs, inventory, prices, cart, checkout, orders, delivery rules and Meta Pixel. The precise theme capabilities and supported cart interfaces of this store have not been inspected. Do not invent API endpoints or assume that a public API supports checkout.

## Transferable parts

- CSS palette, spacing, responsive grids, RTL alignment and reduced-motion rules.
- Semantic header/footer, announcement, benefit strip, category layout, discovery block, values, FAQ and review placeholder.
- Product-card visual structure, gallery layout, filters/search presentation and mobile purchase bar.
- Approved Arabic copy and independent desktop/mobile hero art direction.

Transfer these into a duplicate/unpublished YouCan theme first. Namescope styles if YouCan's existing theme uses conflicting selectors. Preserve required platform scripts/forms and supported theme bindings. Adapt the shared layout to the actual theme partial/template structure; this repository does not assert YouCan template syntax.

## Adaptation and data mapping

1. Obtain a theme export or documentation for the store's actual supported theme version. Work against a theme copy, never the live theme first.
2. Replace `src/data/products.js` with YouCan-rendered product, category, variant, price and image data. Escape all text and validate URLs. Do not interpolate raw product descriptions into `innerHTML`; use textContent or an audited HTML sanitizer for approved rich text.
3. Map demo IDs to actual backend IDs on the server/theme side. The current demo has no variants; if production products have size variants, require a selected in-stock variant before adding.
4. Render availability and price from the backend, then reconcile after add/update calls. Never trust prices or availability from localStorage or client inputs.
5. Replace collection filtering and search with supported platform results/pagination for the real catalogue. Preserve loading, empty and error states and accessible labels. Add add-to-cart loading/error UI for the asynchronous production adapter.

### URL mapping

| Prototype | Production destination |
| --- | --- |
| `#/` | Store canonical root |
| `#/collection/men` | Actual YouCan URL for عطور رجالية |
| `#/collection/women` | Actual YouCan URL for عطور نسائية |
| `#/collection/men-packs` | Actual YouCan URL for باكات رجالية |
| `#/collection/women-packs` | Actual YouCan URL for باكات نسائية |
| `#/collection/all` / `packs` | Supported real collection page or approved category landing page |
| `#/product/{demo-id}` | Product's actual YouCan-provided public URL |
| `#/search` | Supported search URL and query convention |
| `#/policy/{slug}` | Published store policy page URL |

Use backend-generated URLs and approved handles; do not assume `/products/` or `/collections/` is the store's exact convention. Remove the demo hash router for production. Preserve existing indexed URLs or configure approved redirects where needed.

## Cart and add-to-cart

`src/adapters/youcan.js` is a deliberately small demo boundary, not a YouCan SDK. `addItem(id, quantity, cart)` currently returns an in-memory cart; `src/app.js` saves it locally. Replace the full demo cart flow with supported YouCan theme cart actions/forms or an approved documented public interface:

- Pass actual product/variant ID and validated quantity through the platform's expected form/action.
- Use platform-managed sessions and CSRF handling at runtime. Never copy a token or cookie into source.
- Read server-confirmed cart line IDs, counts, totals, stock limits and errors. Wire remove/update to real line IDs, not these demo IDs.
- Handle slow/failing requests and duplicate clicks. Announce success or errors via the live status region.
- Stop reading/writing `muskane-demo-cart` in production; never migrate it into a real order without user selection and backend validation.
- Compute shipping eligibility with real supported cart rules, including discounts and destination constraints. The demo threshold bar is only illustrative.

## Checkout and orders

Replace the disabled button with the platform's actual checkout action/URL supplied by YouCan. Preserve the supported cart-to-checkout session and let YouCan handle delivery details, payment, COD eligibility, order creation, confirmation and purchase tracking. Do not build a fake payment endpoint, collect card data here, or create a parallel order database. Verify the actual checkout end-to-end in an approved test workflow before launch.

## Meta Pixel

This prototype loads no Pixel, analytics, fingerprinting, or tag manager. Leave existing Pixel management in YouCan. When transferring the design:

1. Inventory existing native integrations, theme scripts and tag manager tags.
2. Retain one approved PageView source; do not add another on router changes.
3. Retain YouCan's confirmed-order Purchase handling; never fire Purchase from a cart action or success-looking frontend screen.
4. Do not add ViewContent/AddToCart events if YouCan already emits them. If a customization truly requires events, verify documented platform behavior and event IDs first.
5. Test with platform/Meta diagnostics and the correct consent flow. If both browser and server events are enabled, validate deduplication using platform-managed event IDs. Do not generate a second unrelated Purchase ID.

## Assets and content to replace

- `config.heroDesktop` / `heroMobile`: replace the separate SVGs with licensed product photography, correctly cropped for each breakpoint; use efficient WebP/AVIF with fallback where supported.
- `assets/bottle.svg`, `assets/pack.svg`: demonstration drawings, not actual product imagery. Replace card, category, gallery and discovery images with accurate assets from the approved catalogue; retain explicit dimensions and descriptive alt text.
- Category imagery currently reuses the demo illustrations; supply distinct approved category assets when adapting templates.
- Replace fictional Latin/Arabic names, notes, prices, strike-through prices and sizes. Only advertise verified discounts and best sellers from actual sales data.
- Keep the review section empty/clearly labeled until genuine approved reviews are available. Never add fictional star ratings or counts.
- Confirm shipping coverage, free-shipping threshold, delivery times, COD terms, returns, contact channels, social accounts and legal policy copy.

## SEO handoff

Render Arabic `lang` and `dir` on the actual theme document. Emit per-page title, description, canonical URL, Open Graph title/description/type/absolute image and URL through the platform templates. `config.canonicalBase` is intentionally blank; configure the verified store origin and map real paths. Demo uses `noindex,nofollow`; remove that only from the approved production theme after checking canonical URLs and duplicate content.

`src/seo.js` shows a production-gated BreadcrumbList and minimal Product helper. Replace demo SKUs with real identifiers. Add offers/currency/availability only from actual product data; omit aggregateRating/review without real eligible reviews. Prefer server-rendered schema on product pages rather than depending on this hash prototype's client updates. Validate with a structured-data testing tool.

## Never copy from generated store HTML

Do not commit session cookies, CSRF values, checkout/session IDs, private IDs, bearer/API tokens, license keys, customer/order data, FingerprintJS code, generated script bundles, dynamic runtime metadata, analytics/pixel snippets or session-specific cart markup. Use supported fresh runtime platform mechanisms and public theme configuration. No private API secrets belong in a browser bundle. Frontend configuration is always public.

## Concrete next steps

1. Supply a sanitized supported YouCan theme export/documentation and actual public product/category URL mapping.
2. Supply approved catalogue data, product/hero/category photos, contact details and policies.
3. Port the visual components into an unpublished theme copy and replace hash links with platform-generated URLs.
4. Wire supported cart actions and preserve the existing YouCan checkout and Pixel ownership.
5. Test stock/variants, pricing, cart errors, delivery, COD, checkout, real mobile/RTL/accessibility, SEO and tracking deduplication.
6. Obtain a separate explicit release instruction before changing the live store. Nothing in this project has been deployed.

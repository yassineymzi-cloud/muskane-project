# MUSKANE Cart Rebuilt 1.3.0

Theme artifact: `MUSKANE-theme-v1.3.0-cart-rebuilt.zip`

SHA-256: `5e7239220202aca72be2997426778a3e77b28c691f27a51aea3888bab3ddadf4`

Archive size: 786,049 bytes. ZIP integrity checked. Theme files are at the archive root. Both metadata.json and config/settings_schema.json identify MUSKANE Cart Rebuilt 1.3.0.

## Changes

- Removed the former cart-core snippet, header drawer implementation, injected product-page add button, cart-specific legacy styling and handlers, and external cart SDK dependency.
- Added one cart module and shared row/view markup for the drawer and full cart page.
- Product-page add-to-cart is a separate form from buy-now; product-card add submissions are explicitly intercepted. Existing buy-now and express-checkout behavior is preserved.
- Mutations are serialized. Every successful write is followed by an uncached server cart read. Product variants, quantity, inventory limits, removal, totals, badges, error recovery and keyboard focus are handled by the same module.
- No client-side fake cart or repeated automatic add requests. Unexpected server-side item loss produces an alert and blocks incomplete checkout.
- Images, hero, footer, product-card appearance and checkout fields were not redesigned.

## Verification

Chromium tests passed against rendered theme snippets and an in-memory cart API fixture, in desktop and mobile viewports. Tested multiple products, duplicate click suppression, queued requests, variants, refresh persistence, rapid quantity edits, stock limits, removal, empty cart, drawer/page agreement, error responses, an uncertain network reply, checkout destination and focus restoration. Array, nested and enveloped API responses were covered. A deliberately destructive mock server was detected without inventing missing items. No uncaught page errors.

The final minified JavaScript was retested. All theme JSON and JavaScript parsed successfully. The ZIP contains no test tools or development dependencies.

## Important limitation

These are local browser/fixture tests, not a successful live YouCan checkout test. The theme has not been activated by this build. If the live server itself still returns only the latest item after two additions, server/session behavior still requires investigation; a theme rewrite cannot truthfully claim to have resolved that backend issue.

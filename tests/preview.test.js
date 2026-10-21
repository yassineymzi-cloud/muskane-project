import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPreview} from '../scripts/preview.mjs';

test('standalone preview embeds the current storefront and review controls', async () => {
  const {review,page,assets} = await buildPreview();
  assert.ok(assets.length >= 5);
  assert.ok(page.includes('lang="ar" dir="rtl"'));
  assert.ok(page.includes('data:image/svg+xml;base64,'));
  assert.ok(!page.includes('<script type="module" src='));
  assert.ok(!page.includes('<link rel="stylesheet" href="./src/'));
  for (const mode of ['desktop','tablet','mobile']) assert.ok(review.includes(`data-mode="${mode}"`));
  assert.ok(review.includes("connect-src 'none'"));
  assert.ok(review.includes('Checkout is disabled.'));
});

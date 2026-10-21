import {readFile, readdir, mkdir, writeFile} from 'node:fs/promises';
import {dirname, extname, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mimeTypes = {'.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.woff2':'font/woff2'};
const safeJSON = value => JSON.stringify(value).replace(/</g, '\\u003c');

/** Build a standalone review artifact from local source; never publishes it. */
export async function buildPreview(root = projectRoot) {
  const assets = {};
  async function collectAssets(directory) {
    for (const entry of await readdir(directory, {withFileTypes:true})) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await collectAssets(path);
      else {
        const type = mimeTypes[extname(path)];
        if (!type) throw new Error(`Unsupported preview asset type: ${relative(root,path)}`);
        assets[`./${relative(root,path).split(sep).join('/')}`] = `data:${type};base64,${(await readFile(path)).toString('base64')}`;
      }
    }
  }
  await collectAssets(resolve(root, 'assets'));
  function embedAssetPaths(source) {
    // Resolve static paths first; these also cover paths stored in demo data/config.
    for (const [path,data] of Object.entries(assets)) source = source.replaceAll(path, data);
    // Dynamic template paths are resolved against the same embedded asset table.
    return source.replace(/\.\/assets\/((?:\$\{[^}]*\}|[^\s"'<>`])+?)\.(svg|png|jpe?g|webp|avif|woff2)/g, path => {
      if (!path.includes('${')) throw new Error(`Missing local preview asset: ${path}`);
      return '${previewAsset(`' + path + '`)}';
    });
  }

  const modules = [];
  const visited = new Set();
  async function bundleModule(path) {
    path = resolve(path);
    if (!path.startsWith(resolve(root) + sep)) throw new Error('Preview imports must remain in the project.');
    const id = relative(root,path).split(sep).join('/');
    if (visited.has(id)) return;
    visited.add(id);
    let source = await readFile(path,'utf8');
    const imports = [...source.matchAll(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm)];
    for (const match of imports) {
      if (!match[2].startsWith('.')) throw new Error(`Only local imports are supported: ${match[2]}`);
      const dependency = resolve(dirname(path),match[2]);
      await bundleModule(dependency);
      const dependencyId = relative(root,dependency).split(sep).join('/');
      const names = match[1].split(',').map(name => name.trim().replace(/\s+as\s+/, ': ')).join(', ');
      source = source.replace(match[0],`const {${names}} = previewModules[${safeJSON(dependencyId)}];`);
    }
    if (/^\s*import\s/m.test(source)) throw new Error(`Unsupported import syntax in ${id}`);
    const exports = [...source.matchAll(/\bexport\s+(?:async\s+)?(?:const|let|function|class)\s+([\w$]+)/g)].map(match=>match[1]);
    source = source.replace(/\bexport\s+(?=(?:async\s+)?(?:const|let|function|class)\b)/g,'');
    if (/^\s*export\s/m.test(source)) throw new Error(`Unsupported export syntax in ${id}`);
    source = embedAssetPaths(source);
    modules.push(`previewModules[${safeJSON(id)}] = (() => {\n${source}\nreturn {${exports.join(',')}};\n})();`);
  }
  await bundleModule(resolve(root,'src/app.js'));
  // Fragment anchors in srcdoc otherwise resolve against the parent file URL.
  // Assign the iframe's own hash so app routing/history stays in about:srcdoc.
  const fragmentNavigation = `document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#/"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.hash = link.getAttribute('href').slice(1);
  }, true);`;
  const bundle = `(() => {\n'use strict';\n${fragmentNavigation}\nconst previewAssets = ${safeJSON(assets)};\nconst previewAsset = path => {if (!previewAssets[path]) throw new Error('Missing embedded image: '+path); return previewAssets[path];};\nconst previewModules = {};\n${modules.join('\n')}\n})();`;
  // Fail the generation rather than writing an artifact with malformed scripts.
  new Script(bundle, {filename:'muskane-preview-bundle.js'});
  let page = await readFile(resolve(root,'index.html'),'utf8');
  page = page.replace(/<script\s+type="module"\s+src="\.\/src\/app\.js"><\/script>/,'');
  const css = embedAssetPaths(await readFile(resolve(root,'src/styles.css'),'utf8'));
  page = page.replace('<link rel="stylesheet" href="./src/styles.css">',`<style>${css}</style>`);
  page = embedAssetPaths(page);
  page = page.replace('</body>',`<script>${bundle.replace(/<\/script/gi,'<\\/script')}</script></body>`);
  if (/<(?:script|link)\b[^>]*(?:src|href)=["'](?:\.\/src\/|https?:)/i.test(page)) throw new Error('Preview contains a non-embedded script or stylesheet.');

  const review = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Muskane Parfum — Desktop & Mobile Review</title>
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-src 'self' about:; connect-src 'none'; form-action 'none'; base-uri 'none'">
<style>
*{box-sizing:border-box}body{margin:0;background:#eae7df;font-family:Arial,sans-serif;color:#202937}.review-bar{display:flex;gap:20px;align-items:center;justify-content:space-between;padding:16px 24px;background:#fdfbf6;border-bottom:1px solid #d9d3c5}.review-brand{font-family:Georgia,serif;letter-spacing:2px;font-size:17px}.review-brand small{display:block;font-family:Arial,sans-serif;letter-spacing:0;font-size:11px;color:#6a6c6b;margin-top:5px}.review-switch{display:flex;gap:8px;flex-wrap:wrap}.review-switch button{border:1px solid #c9c3b6;background:transparent;color:#27313b;padding:10px 16px;border-radius:3px;cursor:pointer;font:13px Arial,sans-serif;min-height:40px}.review-switch button[aria-pressed="true"]{background:#202937;color:#fff;border-color:#202937}.review-switch button:focus-visible{outline:3px solid #a98a4e;outline-offset:3px}.review-stage{padding:18px;overflow:auto}.review-frame{display:block;border:0;background:white;margin:0 auto;box-shadow:0 8px 40px #20293714;width:100%;height:calc(100dvh - 126px);min-height:500px}.review-frame[data-device="tablet"]{width:768px}.review-frame[data-device="mobile"]{width:390px}.review-note{margin:0;padding:0 24px 12px;color:#62675f;font-size:11px;line-height:1.6}@media(max-width:650px){.review-bar{padding:12px;align-items:start;flex-direction:column;gap:12px}.review-stage{padding:10px;overflow:auto}.review-frame{height:calc(100dvh - 195px)}.review-frame[data-device="mobile"]{width:390px}.review-note{padding-inline:12px}.review-switch button{padding:9px 13px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style></head><body>
<header class="review-bar"><div class="review-brand">MUSKANE PARFUM<small>Standalone visual review · Arabic RTL storefront</small></div><div class="review-switch" role="group" aria-label="Preview screen size"><button type="button" data-mode="desktop" aria-pressed="true">Desktop</button><button type="button" data-mode="tablet" aria-pressed="false">Tablet · 768px</button><button type="button" data-mode="mobile" aria-pressed="false">Mobile · 390px</button></div></header>
<div class="review-stage"><iframe class="review-frame" data-device="desktop" title="Muskane Parfum storefront preview"></iframe></div>
<p class="review-note">Demo products, prices and illustrations. Checkout is disabled. This file works independently and does not connect to the live store. On a small screen, scroll horizontally to inspect a larger device view.</p>
<script>const frame=document.querySelector('iframe');frame.srcdoc=${safeJSON(page)};document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{frame.dataset.device=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));</script>
</body></html>`;
  return {review, page, assets: Object.keys(assets)};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const {review,assets} = await buildPreview();
  if (process.argv.includes('--check')) console.log(`Preview generation validated: ${assets.length} embedded local assets; no file written.`);
  else {
    const output = resolve(projectRoot,'previews/muskane-review.html');
    await mkdir(dirname(output),{recursive:true});
    await writeFile(output,review);
    console.log('Updated previews/muskane-review.html with embedded assets and Desktop / Tablet / Mobile controls.');
  }
}

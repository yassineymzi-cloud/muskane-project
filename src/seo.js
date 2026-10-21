import {config} from './config.js';
export function updateSEO(title, description, path, product) {
  document.title = `${title} | ${config.brand}`;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('#schema')?.remove();
  document.querySelector('link[rel="canonical"]')?.remove();
  // Hash views are prototype routes. Production must supply real server URLs.
  if (!config.canonicalBase || config.mode === 'demo') return;
  const url = new URL(path, config.canonicalBase).href;
  const canonical = document.createElement('link'); canonical.rel='canonical'; canonical.href=url; document.head.append(canonical);
  const script = document.createElement('script'); script.id='schema'; script.type='application/ld+json';
  const breadcrumb = {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'الصفحة الرئيسية',item:config.canonicalBase},{'@type':'ListItem',position:2,name:title,item:url}]};
  script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[breadcrumb,...(product ? [{'@type':'Product',name:product.name,description,sku:product.id}] : [])]});
  document.head.append(script);
}

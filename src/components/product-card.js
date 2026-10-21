export const money = value => `${new Intl.NumberFormat('fr-MA').format(value)} DH`;
export function productCard(p) {
  return `<article class="product-card">
    <a class="product-art ${p.tone}" href="#/product/${p.id}" aria-label="عرض ${p.name}">
      <img src="./assets/${p.pack ? 'pack' : 'bottle'}.svg" alt="رسم توضيحي تجريبي لـ ${p.name}" width="360" height="420" loading="lazy">
      ${p.oldPrice ? `<span class="badge">خصم ${Math.round((1-p.price/p.oldPrice)*100)}٪ <span class="sr-only">توضيحي</span></span>` : ''}
      <span class="art-caption" lang="en" dir="ltr">${p.latin}</span>
    </a>
    <div class="product-info">
      <h3><a href="#/product/${p.id}">${p.name}</a></h3>
      <div class="product-meta"><span>الحجم: <bdi>${p.size}</bdi></span></div>
      <p class="notes">${p.notes}</p>
      <div class="price-row"><bdi dir="ltr">${money(p.price)}</bdi>${p.oldPrice ? `<del aria-label="السعر السابق التوضيحي"><bdi dir="ltr">${money(p.oldPrice)}</bdi></del>` : ''}</div>
      <button class="quick-add" data-add="${p.id}" aria-label="أضف ${p.name} إلى السلة التجريبية"><span>أضف إلى السلة</span><span aria-hidden="true">+</span></button>
    </div>
  </article>`;
}

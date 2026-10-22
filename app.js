
'use strict';
const collections = [
  {slug:'parfum-homme', name:'عطور رجالية', label:'FOR HIM', text:'حضور يعكس أسلوبك.'},
  {slug:'parfum-femme', name:'عطور نسائية', label:'FOR HER', text:'تفاصيل تعبّر عنك.'},
  {slug:'packs-homme', name:'باكات رجالية', label:'SETS FOR HIM', text:'اكتشف أكثر من بصمة.'},
  {slug:'packs-femme', name:'باكات نسائية', label:'SETS FOR HER', text:'أربع عطور، أربع بصمات.'}
];
let catalog, products = [], cart = [];
try { const saved = JSON.parse(localStorage.getItem('muskane-preview-cart') || '[]'); if(Array.isArray(saved)) cart = saved; } catch {}
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const price = n => `<span class="price">${new Intl.NumberFormat('en-US').format(n)} <small>DH</small></span>`;
const inCollection = (p, slug) => p.categories.some(c=>slug==='packs'?c.slug.startsWith('packs-'):c.slug===slug);
const productLink = p => `#/product/${p.slug}`;
const productCount = n => n===1?'منتج واحد':n===2?'منتجان':`${n} ${n<=10?'منتجات':'منتجاً'}`;
function image(p, eager=false, index=0) {
  const img=p.images[index] || p.images[0];
  return `<div class="image-box"><img src="${esc(img.url)}" alt="${esc(p.name)}" loading="${eager?'eager':'lazy'}" decoding="async" ${eager?'fetchpriority="high"':''} width="600" height="750"><div class="image-fallback" hidden><span class="monogram" aria-hidden="true">M</span><strong>${esc(p.name)}</strong><small>الصورة غير متاحة حالياً</small></div></div>`;
}
document.addEventListener('error',e=>{if(e.target.tagName==='IMG' && e.target.closest('.muskane-hero__visual'))e.target.hidden=true;if(e.target.tagName==='IMG' && e.target.closest('.image-box')){e.target.hidden=true;e.target.nextElementSibling.hidden=false;}},true);
function card(p) {return `<article class="product-card"><a href="${productLink(p)}" aria-label="عرض ${esc(p.name)}">${image(p)}</a><div class="product-info"><p class="product-category">${esc(p.categories[0]?.name)}</p><h3 title="${esc(p.name)}"><a href="${productLink(p)}">${esc(p.name)}</a></h3>${price(p.price)}<div class="card-actions"><a class="button buy-button" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="شراء ${esc(p.name)} من المتجر الأصلي">شراء الآن <span aria-hidden="true">←</span></a><button class="button add" data-add="${p.id}" aria-label="إضافة ${esc(p.name)} لسلة المعاينة">+</button></div></div></article>`;}
function section(c, limit) {const items=products.filter(p=>inCollection(p,c.slug));return `<section class="section wrap"><div class="section-head"><div><span class="eyebrow">${c.label}</span><h2>${c.name}</h2></div><a class="text-link" href="#/collection/${c.slug}">اكتشف المجموعة ←</a></div><div class="product-grid">${items.slice(0,limit||items.length).map(card).join('')}</div></section>`;}
function homepage() {
  return `<section class="muskane-hero" aria-labelledby="muskane-hero-title">
    <div class="muskane-hero__visual"><picture><source media="(max-width: 768px)" srcset="https://assets.youcan.shop/stores/7f085f1e9e8fb6db9b329d4c8b1e85527120283b/muskane-parfum-mobile-500x250-FF8Pj1AgSjQo6eEH1obHx3MSwnh.jpg"><img src="https://assets.youcan.shop/stores/7f085f1e9e8fb6db9b329d4c8b1e85527120283b/muskane-parfum-desktop-1600x500-FF8Pi4XDYsQ5gMmrrYPxBILFj2M.jpg" alt="MUSKANE PARFUM — بانر المتجر الرسمي" width="1600" height="500" fetchpriority="high" decoding="async"></picture></div>
    <div class="muskane-hero__content">
      <p class="muskane-hero__brand" lang="en">MUSKANE PARFUM</p>
      <h1 class="muskane-hero__title" id="muskane-hero-title">عطرك… بصمتك</h1>
      <p class="muskane-hero__subtitle">عطور مختارة للنساء والرجال</p>
      <p class="muskane-hero__description">اكتشف عطراً يشبهك، من أول انطباع إلى آخر تفصيل.</p>
      <div class="muskane-hero__actions"><a class="muskane-hero__cta" href="#/collection/all">اكتشف المجموعة</a><a class="muskane-hero__cta muskane-hero__cta--secondary" href="#/collection/packs">اكتشف الباكات</a></div>
    </div>
  </section>
  <div class="intro-line"><span>عطور رجالية ونسائية</span><span>أسعار بالدرهم المغربي</span><span>اختيارات من MUSKANE</span></div>
  <section class="section wrap category-section"><div class="section-head"><div><span class="eyebrow">FIND YOUR SIGNATURE</span><h2>اختر مجموعتك</h2></div><a class="text-link" href="#/collection/all">كل العطور ←</a></div><div class="categories-grid">${collections.map((c,i)=>`<a class="category-card" href="#/collection/${c.slug}"><span class="number">0${i+1}</span><span class="eyebrow">${c.label}</span><h3>${c.name}</h3><p>${productCount(products.filter(p=>inCollection(p,c.slug)).length)} · ${c.text}</p><span class="arrow" aria-hidden="true">←</span></a>`).join('')}</div></section>
  ${section(collections[0])}
  <div class="tinted section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">FOR HER</span><h2>بصمة بأنوثتك</h2></div><a class="text-link" href="#/collection/parfum-femme">العطور النسائية ←</a></div><div class="product-grid">${products.filter(p=>inCollection(p,'parfum-femme')).map(card).join('')}</div></div></div>
  ${section({slug:'packs', name:'باكات العطور', label:'THE DISCOVERY SETS'})}
  <section class="wrap"><div class="trust-grid"><div class="trust-item"><span>01</span><h3>اختر على مهل</h3><p>صور وتفاصيل كل عطر في صفحة المنتج.</p></div><div class="trust-item"><span>02</span><h3>السعر بالدرهم</h3><p>أسعار واضحة بالدرهم المغربي لكل المجموعة.</p></div><div class="trust-item"><span>03</span><h3>تابع إلى المتجر</h3><p>رابط مباشر لصفحة المنتج في متجر MUSKANE.</p></div></div></section>`;
}
function collectionPage(slug) {
  const c=collections.find(c=>c.slug===slug) || {name:slug==='all'?'جميع العطور':slug==='packs'?'باكات العطور':'المجموعة',label:'THE PERFUME EDIT'};
  const items=slug==='all'?products:products.filter(p=>inCollection(p,slug));
  return `<div class="wrap"><div class="breadcrumb"><a href="#/">الرئيسية</a><span>/</span><span>${c.name}</span></div><section class="collection-heading"><span class="eyebrow">${c.label}</span><h1>${c.name}</h1><p>اختر العطر الذي يعبّر عنك من مجموعة MUSKANE PARFUM.</p><nav class="collection-tabs" aria-label="مجموعات العطور"><a class="${slug==='all'?'active':''}" href="#/collection/all">الكل</a>${collections.map(c=>`<a class="${slug===c.slug?'active':''}" href="#/collection/${c.slug}">${c.name}</a>`).join('')}</nav></section><div class="collection-toolbar"><span>${productCount(items.length)}</span><label>الترتيب: <select id="sort"><option value="original">ترتيب المجموعة</option><option value="asc">السعر: من الأقل</option><option value="desc">السعر: من الأعلى</option><option value="name">الاسم</option></select></label></div><div id="collection-grid" class="product-grid" data-collection="${esc(slug)}">${items.map(card).join('')}</div>${items.length?'':'<p class="empty">لا توجد منتجات موثقة في هذه المجموعة حالياً.</p>'}</div>`;
}
function safeDescription(html) {
  const doc=new DOMParser().parseFromString(html,'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,form,input,button,img,svg,link,meta').forEach(n=>n.remove());
  for(const node of doc.body.querySelectorAll('*')) {
    for(const attr of [...node.attributes]) node.removeAttribute(attr.name);
    if(!['P','DIV','SPAN','BR','STRONG','B','EM','I','UL','OL','LI','H2','H3','H4','TABLE','TBODY','TR','TH','TD'].includes(node.tagName))node.replaceWith(...node.childNodes);
  }
  return doc.body.innerHTML;
}
function productPage(p) {
  const c=p.categories[0];const related=products.filter(x=>x.id!==p.id && inCollection(x,c.slug)).slice(0,4);
  return `<div class="wrap"><div class="breadcrumb"><a href="#/">الرئيسية</a><span>/</span><a href="#/collection/${c.slug}">${esc(c.name)}</a><span>/</span><span dir="auto">${esc(p.name)}</span></div><article class="product-detail"><div class="product-gallery"><div id="main-image">${image(p,true)}</div>${p.images.length>1?`<div class="thumbs" aria-label="صور المنتج">${p.images.map((img,i)=>`<button data-image="${i}" data-product="${p.id}" aria-label="عرض الصورة ${i+1}"><img src="${esc(img.url)}" alt="${esc(p.name)} — صورة ${i+1}" loading="lazy"></button>`).join('')}</div>`:''}</div><div class="product-copy"><span class="eyebrow">MUSKANE PARFUM</span><h1>${esc(p.name)}</h1><a class="muted" href="#/collection/${c.slug}">${esc(c.name)}</a><div>${price(p.price)}</div><div class="detail-actions"><button class="button" data-add="${p.id}">أضف إلى سلة المعاينة <span aria-hidden="true">+</span></button><a class="button secondary" href="${esc(p.url)}" target="_blank" rel="noopener">تابع إلى المنتج في المتجر الأصلي ←</a></div><p class="small-note">السلة للمعاينة فقط. إتمام الشراء متاح عبر صفحة المنتج في المتجر الأصلي.</p>${p.descriptionHtml?`<section class="description"><h2>عن العطر</h2><div class="description-content">${safeDescription(p.descriptionHtml)}</div></section>`:''}<a class="source-link" href="${esc(p.url)}" target="_blank" rel="noopener">المصدر: صفحة المنتج على muskaneparfum.com ←</a></div></article></div>${related.length?`<section class="wrap section"><div class="section-head"><div><span class="eyebrow">MORE TO DISCOVER</span><h2>من المجموعة نفسها</h2></div></div><div class="product-grid">${related.map(card).join('')}</div></section>`:''}`;
}
function route() {
  if(!catalog)return;
  const [page,slug]=location.hash.replace(/^#\/?/,'').split('/');
  let content,title='عطرك… بصمتك';
  if(page==='collection'){content=collectionPage(slug);title=collections.find(c=>c.slug===slug)?.name || (slug==='packs'?'باكات العطور':'جميع العطور');}
  else if(page==='product'){const p=products.find(p=>p.slug===slug);content=p?productPage(p):'<div class="error-panel"><h1>المنتج غير موجود</h1><a class="button" href="#/collection/all">عرض المجموعة</a></div>';title=p?.name || 'المنتج غير موجود';}
  else content=homepage();
  $('#main').innerHTML=content;document.title=`${title} | MUSKANE PARFUM`;
  const desc=page==='product'?products.find(p=>p.slug===slug)?.descriptionHtml:'';
  document.querySelector('meta[name="description"]').content=desc?new DOMParser().parseFromString(desc,'text/html').body.textContent.trim().slice(0,160):'اكتشف مجموعة MUSKANE PARFUM من العطور الرجالية والنسائية وباكات العطور بأسعار بالدرهم المغربي.';
  document.querySelectorAll('#navigation a').forEach(a=>{if(a.getAttribute('href')===(location.hash||'#/'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  $('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
}
function footer() {
  const labels={'/pages/about-us':'عن MUSKANE','/pages/contact-us':'تواصل معنا','/pages/how-to-pay':'طرق الدفع','/pages/faq':'الأسئلة الشائعة','/pages/terms-and-conditions':'الشروط والأحكام','/pages/return-policy':'سياسة الاسترجاع','/pages/confidentiality':'سياسة الخصوصية','/pages/shipping-delivery':'الشحن والتوصيل','/pages/privacy-policy':'سياسة الخصوصية','/pages/terms-of-service':'شروط الخدمة'};
  const policies=catalog.sourceLinks.filter(u=>u.startsWith('/') || u.startsWith(catalog.source+'/pages/'));
  const socials=catalog.sourceLinks.filter(u=>/instagram|facebook|tiktok|wa.me/.test(u));
  const link=u=>{const full=u.startsWith('/')?catalog.source+u:u;const path=new URL(full).pathname;return `<a href="${esc(full)}" target="_blank" rel="noopener">${esc(labels[path]||path.split('/').pop().replaceAll('-',' '))} ←</a>`;};
  $('#footer').innerHTML=`<div class="wrap footer-inner"><div class="footer-brand"><a class="brand" href="#/"><strong>MUSKANE</strong><span>P A R F U M</span></a><p>عطرك… بصمتك.<br>تشكيلة عطور تعبّر عن حضورك وأسلوبك.</p></div><div class="footer-links"><h2>اكتشف المجموعة</h2>${collections.map(c=>`<a href="#/collection/${c.slug}">${c.name}</a>`).join('')}<a href="#/collection/all">جميع العطور</a></div><div class="footer-links footer-policies"><h2>معلومات المتجر</h2><div class="policy-grid">${policies.map(link).join('')}</div></div><div class="footer-links"><h2>تابع MUSKANE</h2>${socials.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${/instagram/.test(u)?'Instagram':/tiktok/.test(u)?'TikTok':/facebook/.test(u)?'Facebook':'WhatsApp'} ←</a>`).join('')}</div></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} MUSKANE PARFUM</span><span>نسخة معاينة مستقلة · لا تستقبل طلبات شراء</span></div>`;
}
function saveCart(){try{localStorage.setItem('muskane-preview-cart',JSON.stringify(cart));}catch{}updateCart();}
function updateCart(){
  $('#cart-count').textContent=cart.reduce((n,c)=>n+c.qty,0);
  $('#cart-items').innerHTML=cart.length?cart.map(c=>{const p=products.find(p=>p.id===c.id);return `<div class="cart-row">${image(p)}<div class="row-info"><h3><a href="${productLink(p)}" data-close="cart-dialog">${esc(p.name)}</a></h3>${price(p.price)}<div class="quantity"><button data-quantity="${p.id}" data-delta="-1" aria-label="تقليل كمية ${esc(p.name)}">−</button><span aria-label="الكمية">${c.qty}</span><button data-quantity="${p.id}" data-delta="1" aria-label="زيادة كمية ${esc(p.name)}">+</button><button class="remove" data-remove="${p.id}">إزالة</button></div></div></div>`;}).join(''):'<p class="empty">السلة تنتظر اختياراتك.<br><a class="text-link" href="#/collection/all" data-close="cart-dialog">اكتشف المجموعة</a></p>';
  $('#cart-total').innerHTML=cart.length?`<div class="total-line"><span>مجموع المنتجات</span>${price(cart.reduce((n,c)=>n+products.find(p=>p.id===c.id).price*c.qty,0))}</div><p class="small-note">مجموع للمعاينة، دون احتساب أي رسوم توصيل. للشراء، افتح صفحة المنتج في المتجر الأصلي.</p>`:'';
}
let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2500);}
function search(){const q=$('#search-input').value.trim().toLocaleLowerCase();const found=q?products.filter(p=>p.name.toLocaleLowerCase().includes(q)||p.categories.some(c=>c.name.includes(q))):[];$('#search-status').textContent=q?`${found.length} نتائج`:'اكتب اسم العطر أو الفئة';$('#search-results').innerHTML=found.map(p=>`<a class="search-row" href="${productLink(p)}" data-close="search-dialog">${image(p)}<div class="row-info"><h3>${esc(p.name)}</h3>${price(p.price)}</div><span aria-hidden="true">←</span></a>`).join('');}
document.addEventListener('click',e=>{
  const close=e.target.closest('[data-close]');if(close)$('#'+close.dataset.close).close();
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='menu'){const open=$('#navigation').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));}
  if(action==='search'){search();$('#search-dialog').showModal();$('#search-input').focus();}
  if(action==='cart'){$('#cart-dialog').showModal();}
  const add=e.target.closest('[data-add]');if(add && products.some(p=>p.id===add.dataset.add)){const item=cart.find(c=>c.id===add.dataset.add);if(item)item.qty=Math.min(99,item.qty+1);else cart.push({id:add.dataset.add,qty:1});saveCart();toast('تمت الإضافة إلى سلة المعاينة');}
  const qty=e.target.closest('[data-quantity]');if(qty){cart=cart.map(c=>c.id===qty.dataset.quantity?{...c,qty:Math.min(99,c.qty+Number(qty.dataset.delta))}:c).filter(c=>c.qty>0);saveCart();}
  const remove=e.target.closest('[data-remove]');if(remove){cart=cart.filter(c=>c.id!==remove.dataset.remove);saveCart();}
  const thumb=e.target.closest('[data-image]');if(thumb){const p=products.find(p=>p.id===thumb.dataset.product);$('#main-image').innerHTML=image(p,true,Number(thumb.dataset.image));}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}});
$('#search-input').addEventListener('input',search);
document.addEventListener('change',e=>{if(e.target.id==='sort'){const slug=$('#collection-grid').dataset.collection;const items=(slug==='all'?[...products]:products.filter(p=>inCollection(p,slug)));if(e.target.value==='asc')items.sort((a,b)=>a.price-b.price);if(e.target.value==='desc')items.sort((a,b)=>b.price-a.price);if(e.target.value==='name')items.sort((a,b)=>a.name.localeCompare(b.name));$('#collection-grid').innerHTML=items.map(card).join('');}});
window.addEventListener('hashchange',route);
Promise.resolve().then(()=>JSON.parse($('#muskane-catalog').textContent)).then(data=>{if(!data || !Array.isArray(data.products))throw Error('Missing catalog');catalog=data;products=data.products;cart=cart.filter(c=>c && products.some(p=>p.id===c.id) && Number.isInteger(c.qty) && c.qty>0 && c.qty<=99);footer();updateCart();route();
  // Dynamic loading keeps optional remote font CSS from blocking the inline app.
  const fontStyles=document.createElement('link');
  fontStyles.rel='stylesheet';
  fontStyles.href='https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Montserrat:wght@400;500;600&display=swap';
  document.head.appendChild(fontStyles);
}).catch(()=>{$('#main').innerHTML='<div class="error-panel"><h1>تعذّر تحميل المجموعة</h1><p>أعد تحميل الصفحة أو زر المتجر الأصلي.</p><a class="button" href="https://muskaneparfum.com">MUSKANE PARFUM ←</a></div>';});



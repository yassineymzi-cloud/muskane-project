from playwright.sync_api import sync_playwright
from pathlib import Path
import json, os
PREVIEW_URL=os.environ.get("PREVIEW_URL", "http://127.0.0.1:4174/muskane-review.html")
Path('work').mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[]; bad=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:bad.append(r.url) if r.status>=400 else None)
 for width in [360,390,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for route in ['#/','#/collection/men','#/collection/women','#/collection/men-packs','#/collection/women-packs','#/product/discovery-him','#/search']:
   r=page.goto('http://127.0.0.1:4173/'+route)
   assert r is None or r.status==200
   page.wait_for_timeout(240)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow: {width} {route}'
   assert page.locator('h1').count()==1
  results.append(f'{width}px: homepage, all four collection routes, pack product and search passed')
 page.set_viewport_size({'width':1440,'height':1000})
 page.goto('http://127.0.0.1:4173/')
 page.screenshot(path='work/polished-desktop.png',full_page=True)
 page.screenshot(path='work/polished-desktop-top.png')
 assert page.locator('.discovery-art img').get_attribute('alt').find('أربع')>=0
 assert page.locator('.review-placeholder .demo-tag').is_visible()
 for c in ['men','women','men-packs','women-packs']:
  page.goto('http://127.0.0.1:4173/#/collection/'+c)
  page.wait_for_timeout(250)
  assert page.locator(f'.collection-tabs [href="#/collection/{c}"]').get_attribute('aria-current')=='page'
  assert page.locator('.collection-intro .demo-tag').is_visible()
 page.set_viewport_size({'width':390,'height':844})
 page.goto('http://127.0.0.1:4173/')
 page.screenshot(path='work/polished-mobile-top.png')
 page.screenshot(path='work/polished-mobile.png',full_page=True)
 assert page.locator('.quick-add').first.bounding_box()['height']>=48
 assert page.locator('.product-card .demo-tag').count()==0
 assert page.locator('.preview-notice').is_visible()
 assert page.locator('.hero').bounding_box()['height']<=400
 assert page.locator('.header').bounding_box()['height']<=66
 hero_cta=page.locator('.hero .button').bounding_box()
 first_product=page.locator('.featured-section .product-art').first.bounding_box()
 assert hero_cta['y']+hero_cta['height']<600
 assert first_product['y']<844,first_product
 assert page.locator('.featured-section').evaluate('(e)=>e.nextElementSibling.classList.contains("home-categories")')
 assert page.locator('.discovery-copy .button').bounding_box()['height']>=50
 for selector in ['.header .brand','.header-actions [aria-label="البحث"]','.cart-toggle','.menu-toggle']:
  box=page.locator(selector).bounding_box()
  assert box and box['x']>=0 and box['x']+box['width']<=390
 # Live device switches preserve logical reading order and desktop placement.
 page.set_viewport_size({'width':768,'height':1000})
 assert page.locator('.home-categories').evaluate('(e)=>e.nextElementSibling.classList.contains("featured-section")')
 page.set_viewport_size({'width':390,'height':844})
 assert page.locator('.featured-section').evaluate('(e)=>e.nextElementSibling.classList.contains("home-categories")')
 page.goto('http://127.0.0.1:4173/#/collection/women-packs')
 page.locator('#collection-results[aria-busy="false"]').wait_for()
 page.screenshot(path='work/polished-mobile-collection.png',full_page=True)
 page.set_viewport_size({'width':1440,'height':1000})
 # Review artifact: no external requests allowed; it must stay independent.
 requested=[]
 def gate(route):
  url=route.request.url
  if url.startswith('http://127.0.0.1:4174/'):
   route.continue_()
  else:
   requested.append(url);route.abort()
 page.route('http**/*',gate)
 page.goto(PREVIEW_URL)
 frame=page.frame_locator('iframe')
 frame.locator('.hero h1').wait_for()
 for mode,width in [('mobile',390),('tablet',768),('desktop',None)]:
  page.locator(f'[data-mode="{mode}"]').click()
  if width:assert frame.locator('html').evaluate('(el)=>el.clientWidth')==width
  assert frame.locator('html').evaluate('(el)=>el.scrollWidth<=el.clientWidth')
  assert frame.locator('.hero img').evaluate('(el)=>el.complete&&el.naturalWidth>0')
 frame.locator('.product-card .quick-add').first.click()
 assert frame.locator('#cart-count').inner_text()=='1'
 frame.locator('.cart-toggle').click()
 assert frame.locator('#cart-summary .button').is_disabled()
 page.keyboard.press('Escape')
 frame.locator('.desktop-nav [href="#/collection/men-packs"]').click()
 frame.locator('#collection-results[aria-busy="false"]').wait_for()
 assert frame.locator('.product-card').count()==1
 assert '4 × 10' in frame.locator('.product-meta').inner_text()
 assert not requested,requested
 # Exact artifact bytes also work without an HTTP origin or localStorage access.
 offline=browser.new_page(viewport={'width':1440,'height':1000})
 offline_requests=[]
 offline.on('request',lambda r:offline_requests.append(r.url))
 offline.on('pageerror',lambda e:errors.append(str(e)))
 offline.set_content(Path('previews/muskane-review.html').read_text())
 standalone=offline.frame_locator('iframe')
 standalone.locator('.hero h1').wait_for()
 standalone.locator('.hero .button').click()
 standalone.locator('#collection-results[aria-busy="false"]').wait_for()
 standalone.locator('.product-card h3 a').first.click()
 standalone.locator('#purchase-form').wait_for()
 standalone.locator('#purchase-form button[type="submit"]').click()
 assert standalone.locator('#cart-count').inner_text()=='1'
 offline.frames[1].evaluate('history.back()')
 standalone.locator('#collection-results[aria-busy="false"]').wait_for()
 assert len(offline.frames)==2
 assert not offline_requests,offline_requests
 assert not errors,errors
 assert not bad,bad
 results+=['Preview disclosure, clean product cards, shorter hero/header, first-viewport product imagery, four-vial pack data and 48px card CTA passed','Standalone preview rendered Desktop/Tablet/Mobile, all assets, collection navigation and demo cart with no external requests','Originless artifact rendering, product navigation, cart storage fallback and Back history passed without requests','No browser JavaScript errors or failed asset responses']
 print(json.dumps(results,ensure_ascii=False,indent=2))
 browser.close()

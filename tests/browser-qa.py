from playwright.sync_api import sync_playwright
import json
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 response=page.goto('http://127.0.0.1:4173/')
 assert response.status==200
 page.locator('.hero h1').wait_for()
 assert page.locator('html').get_attribute('dir')=='rtl'
 for width in [360,390,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for route in ['#/','#/collection/all','#/product/amber-noir','#/search','#/contact','#/policy/privacy']:
   page.goto('http://127.0.0.1:4173/'+route)
   page.wait_for_timeout(250)
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'Overflow {width} {route}'
  results.append(f'No horizontal overflow at {width}px across six views')
 page.set_viewport_size({'width':1440,'height':1000})
 page.goto('http://127.0.0.1:4173/#/collection/men-packs')
 page.locator('#collection-results[aria-busy="false"]').wait_for()
 page.select_option('#filter','over')
 assert page.locator('.empty').count()==1
 page.click('#reset-filter')
 assert page.locator('.product-card').count()==1
 page.goto('http://127.0.0.1:4173/#/collection/all')
 page.locator('#collection-results[aria-busy="false"]').wait_for()
 page.select_option('#sort','low')
 assert 'discovery-him' in page.locator('.product-card a').first.get_attribute('href')
 page.goto('http://127.0.0.1:4173/#/search')
 page.fill('#search-input','عنبر')
 assert page.locator('.product-card').count()==2
 page.fill('#search-input','<img src=x onerror=alert(1)>')
 assert page.locator('.empty').count()==1
 assert page.locator('#search-count img').count()==0
 page.goto('http://127.0.0.1:4173/#/product/amber-noir')
 page.click('[data-view="detail"]')
 assert page.locator('#gallery-image').evaluate('(el)=>el.classList.contains("zoom")')
 page.click('[data-step="1"]')
 assert page.input_value('#quantity')=='2'
 page.click('#purchase-form button[type="submit"]')
 assert page.locator('#cart-count').inner_text()=='2'
 page.click('.cart-toggle')
 assert page.locator('#cart-dialog').evaluate('(el)=>el.open')
 assert page.locator('#cart-summary').inner_text().find('780')>=0
 assert page.locator('#cart-summary .button').is_disabled()
 page.keyboard.press('Escape')
 assert not page.locator('#cart-dialog').evaluate('(el)=>el.open')
 page.reload()
 assert page.locator('#cart-count').inner_text()=='2'
 page.click('.cart-toggle')
 page.click('[data-cart-step="-1"]')
 assert page.locator('#cart-count').inner_text()=='1'
 page.click('[data-remove]')
 assert page.locator('#cart-count').inner_text()=='0'
 page.keyboard.press('Escape')
 page.set_viewport_size({'width':390,'height':844})
 page.click('.menu-toggle')
 assert page.locator('#mobile-nav').is_visible()
 page.locator('#mobile-nav a[href="#/collection/women"]').click()
 assert not page.locator('#mobile-nav').is_visible()
 page.goto('http://127.0.0.1:4173/#/')
 page.locator('summary').first.click()
 assert page.locator('details').first.get_attribute('open') is not None
 page.screenshot(path='work/mobile-home.png',full_page=True)
 page.set_viewport_size({'width':1440,'height':1000})
 page.screenshot(path='work/desktop-home.png',full_page=True)
 # Traverse all static routes advertised by the homepage.
 links=page.locator('a[href^="#/"]').evaluate_all('(els)=>[...new Set(els.map(el=>el.hash))]')
 for link in links:
  page.goto('http://127.0.0.1:4173/'+link)
  page.wait_for_timeout(220)
  assert 'الصفحة غير موجودة' not in page.locator('main').inner_text(),link
 assert not errors,errors
 results += ['Collection filtering, reset, sorting and empty state passed','Live Arabic search and HTML-injection input passed','Gallery, quantity, cart add/change/remove/persistence and disabled checkout passed','Mobile menu and FAQ passed',f'{len(links)} homepage routes resolved','No browser JavaScript errors']
 print(json.dumps(results,ensure_ascii=False,indent=2))
 browser.close()

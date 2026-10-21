from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844})
 failures=[]
 page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
 page.goto('http://127.0.0.1:4173/')
 page.screenshot(path='work/mobile-viewport.png')
 assert page.locator('.header').is_visible()
 page.keyboard.press('Tab')
 assert page.locator('.skip').evaluate('(el)=>el===document.activeElement')
 page.keyboard.press('Enter')
 assert page.locator('main').evaluate('(el)=>el===document.activeElement')
 page.wait_for_timeout(100)
 assert page.locator('.hero h1').count()==1
 assert page.url.endswith('/')
 page.goto('http://127.0.0.1:4173/#/product/amber-noir')
 assert page.locator('.mobile-purchase').is_visible()
 page.click('#sticky-add')
 page.click('.cart-toggle')
 page.click('[data-cart-step="1"]')
 assert page.evaluate('document.activeElement.dataset.cartStep')=='1'
 page.click('[data-remove]')
 assert page.evaluate('document.activeElement.id')=='close-cart'
 page.keyboard.press('Escape')
 assert page.locator('.cart-toggle').evaluate('(el)=>el===document.activeElement')
 page.set_viewport_size({'width':1440,'height':1000})
 page.goto('http://127.0.0.1:4173/#/')
 page.screenshot(path='work/desktop-viewport.png')
 assert not failures,failures
 print('Skip link, mobile purchase, cart keyboard focus, modal focus restoration and asset responses passed.')
 b.close()

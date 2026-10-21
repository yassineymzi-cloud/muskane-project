"""Final layout regression checks. Run with the local storefront on port 4173.

Python Playwright and an installed Chromium are required. The generated HTML is
also loaded as an originless document, so no second preview server is needed.
"""
from pathlib import Path
import json
import os

from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get('STOREFRONT_URL', 'http://127.0.0.1:4173/')
SCREENSHOTS = Path('work/final-polish')
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
WIDTHS = (390, 430, 768, 1440)


def no_horizontal_overflow(page, label):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), label


def check_heading_clearance(page, heading, label):
    # Use the browser's native alignment, rather than manually subtracting an
    # implementation-specific header height, to exercise real anchor behavior.
    heading.evaluate('(element) => element.scrollIntoView({block: "start", behavior: "instant"})')
    page.wait_for_timeout(50)
    bounds = heading.bounding_box()
    header = page.locator('.header').bounding_box()
    assert bounds and header
    assert bounds['y'] >= header['y'] + header['height'] + 4, (label, bounds, header)
    assert bounds['y'] + bounds['height'] <= page.viewport_size['height'] - 4, label
    assert heading.evaluate('(element) => element.scrollHeight <= element.clientHeight + 1'), label


def check_card_rows(page, grid, label, mobile):
    cards = grid.locator(':scope > .product-card')
    geometry = cards.evaluate_all('''elements => elements.map(card => {
      const box = element => {
        const rect = element.getBoundingClientRect();
        return {x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                bottom: rect.bottom, right: rect.right};
      };
      const fields = ['.product-art', 'h3', '.product-meta', '.notes', '.price-row', '.quick-add'];
      return {card: box(card), fields: Object.fromEntries(fields.map(selector => {
        const element = card.querySelector(selector);
        return [selector, {...box(element), clipped: element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1}];
      }))};
    })''')
    rows = []
    for entry in geometry:
        row = next((row for row in rows if abs(row[0]['card']['y'] - entry['card']['y']) <= 2), None)
        if row is None:
            row = []
            rows.append(row)
        row.append(entry)
        card = entry['card']
        for selector, field in entry['fields'].items():
            assert not field['clipped'], (label, selector, 'clipped', field)
            assert field['y'] >= card['y'] - 1 and field['bottom'] <= card['bottom'] + 1, (label, selector, 'vertical bounds')
            assert field['x'] >= card['x'] - 1 and field['right'] <= card['right'] + 1, (label, selector, 'horizontal bounds')
        assert entry['fields']['.quick-add']['height'] >= 48, label
        assert entry['fields']['.price-row']['bottom'] <= entry['fields']['.quick-add']['y'] + 1, label
    for row in rows:
        if mobile and len(row) > 1:
            assert len(row) == 2, (label, 'two cards per mobile row', len(row))
        if len(row) < 2:
            continue
        assert max(item['card']['height'] for item in row) - min(item['card']['height'] for item in row) <= 2, (label, 'card heights')
        for selector in ('.product-art', 'h3', '.product-meta', '.notes', '.price-row', '.quick-add'):
            assert max(item['fields'][selector]['y'] for item in row) - min(item['fields'][selector]['y'] for item in row) <= 2, (label, selector, 'row alignment')
        assert max(item['fields']['.quick-add']['bottom'] for item in row) - min(item['fields']['.quick-add']['bottom'] for item in row) <= 2, (label, 'CTA bottoms')
    if mobile and len(geometry) >= 2:
        assert len(rows[0]) == 2, (label, 'first mobile row')


def check_product_grids(page, label, mobile):
    for index in range(page.locator('.product-grid').count()):
        check_card_rows(page, page.locator('.product-grid').nth(index), f'{label}, grid {index}', mobile)


def wait_for_collection(page):
    page.locator('#collection-results[aria-busy="false"]').wait_for()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        headless=True,
        args=['--no-sandbox'],
    )
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    errors, failures, results = [], [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', lambda response: failures.append(response.url) if response.status >= 400 else None)

    for width in WIDTHS:
        height = 900 if width >= 768 else 844
        page.set_viewport_size({'width': width, 'height': height})
        page.goto(BASE_URL)
        page.locator('.hero h1').wait_for()
        page.wait_for_timeout(50)
        no_horizontal_overflow(page, f'{width}px homepage')
        assert page.locator('html').get_attribute('dir') == 'rtl'
        if width <= 430:
            header = page.locator('.header').bounding_box()
            assert header['height'] <= 60, (width, 'compact header', header)
            controls = page.locator('.header-actions .icon-button')
            centers = []
            for index in range(controls.count()):
                bounds = controls.nth(index).bounding_box()
                assert bounds and bounds['width'] >= 44 and bounds['height'] >= 44, (width, 'touch target')
                assert bounds['x'] >= 0 and bounds['x'] + bounds['width'] <= width, (width, 'icon clipping')
                centers.append(bounds['y'] + bounds['height'] / 2)
            assert max(centers) - min(centers) <= 1, (width, 'header icon alignment')
            brand = page.locator('.header .brand').bounding_box()
            assert abs(brand['y'] + brand['height'] / 2 - centers[0]) <= 2, (width, 'brand alignment')
        check_product_grids(page, f'{width}px homepage', width <= 430)
        page.evaluate('window.scrollTo(0, 900)')
        assert abs(page.locator('.header').bounding_box()['y']) <= 1, (width, 'sticky header')
        # Every homepage heading must be fully exposed when targeted directly.
        headings = page.locator('main h1, main h2')
        for index in range(headings.count()):
            check_heading_clearance(page, headings.nth(index), f'{width}px heading {index}')
        # Skip from a scrolled page without changing the storefront route.
        page.locator('.skip').evaluate('(element) => element.click()')
        page.wait_for_timeout(50)
        assert page.locator('main').evaluate('(element) => element === document.activeElement')
        assert page.locator('.hero h1').count() == 1
        assert page.locator('.hero h1').bounding_box()['y'] >= page.locator('.header').bounding_box()['height'] + 4
        no_horizontal_overflow(page, f'{width}px after scroll/skip')

        # A real hash route after scrolling must open its heading below the
        # sticky header, and browser Back must restore the homepage safely.
        if width < 901:
            page.locator('.menu-toggle').click()
            page.locator('#mobile-nav [href="#/collection/all"]').click()
        else:
            page.locator('.hero .button').click()
        wait_for_collection(page)
        assert page.locator('.collection h1').bounding_box()['y'] >= page.locator('.header').bounding_box()['y'] + page.locator('.header').bounding_box()['height'] + 4
        no_horizontal_overflow(page, f'{width}px collection')
        check_product_grids(page, f'{width}px collection', width <= 430)
        page.go_back()
        page.locator('.hero h1').wait_for()
        assert page.locator('.hero h1').bounding_box()['y'] >= page.locator('.header').bounding_box()['y'] + page.locator('.header').bounding_box()['height'] + 4
        page.goto(BASE_URL + '#/product/discovery-him')
        page.locator('#purchase-form').wait_for()
        check_heading_clearance(page, page.locator('.product-copy h1'), f'{width}px product title')
        no_horizontal_overflow(page, f'{width}px product')
        if width <= 430:
            sticky = page.locator('.mobile-purchase').bounding_box()
            button = page.locator('#sticky-add').bounding_box()
            assert button['height'] >= 44 and button['y'] >= sticky['y']
            assert button['y'] + button['height'] <= height + 1
            # Focusing the regular purchase action must leave it above the
            # persistent mobile purchase bar as well as below the header.
            page.locator('#purchase-form button[type="submit"]').evaluate('(element) => element.scrollIntoView({block: "center"})')
            purchase = page.locator('#purchase-form button[type="submit"]').bounding_box()
            assert purchase['y'] >= page.locator('.header').bounding_box()['height']
            assert purchase['y'] + purchase['height'] <= sticky['y']
        results.append(f'{width}px: sticky/anchor clearance, aligned cards, CTA/price bounds, RTL and overflow passed')

    # Use exact standalone bytes without any HTTP origin or server assets.
    offline = browser.new_page(viewport={'width': 1440, 'height': 1000})
    requests = []
    offline.on('request', lambda request: requests.append(request.url))
    offline.on('pageerror', lambda error: errors.append(str(error)))
    offline.set_content(Path('previews/muskane-review.html').read_text())
    frame = offline.frame_locator('iframe')
    frame.locator('.hero h1').wait_for()
    for mode, width in (('mobile', 390), ('tablet', 768), ('desktop', None)):
        offline.locator(f'[data-mode="{mode}"]').click()
        if width:
            assert frame.locator('html').evaluate('(element) => element.clientWidth') == width
        assert frame.locator('html').evaluate('(element) => element.scrollWidth <= element.clientWidth + 1')
    offline.locator('[data-mode="mobile"]').click()
    frame.locator('.menu-toggle').click()
    frame.locator('#mobile-nav [href="#/collection/all"]').click()
    frame.locator('#collection-results[aria-busy="false"]').wait_for()
    frame.locator('.product-card h3 a').first.click()
    frame.locator('#purchase-form').wait_for()
    frame.locator('#sticky-add').click()
    assert frame.locator('#cart-count').inner_text() == '1'
    assert len(offline.frames) == 2
    assert not requests, requests
    assert not errors, errors
    assert not failures, failures
    results.append('Standalone preview: device modes, mobile navigation/product/cart and zero network requests passed')
    print(json.dumps(results, ensure_ascii=False, indent=2))
    browser.close()

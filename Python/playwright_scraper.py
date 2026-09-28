from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
import time
import pandas as pd
import re

query = "restaurants in New York"
max_scrolls = 10
scroll_pause = 2

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # Enable stealth mode (playwright-stealth 2.x API)
    Stealth().apply_stealth_sync(page)

    # Open Google Maps
    page.goto("https://www.google.com/maps")
    time.sleep(5)

    # Search input and enter query
    search = page.locator("#searchboxinput")
    search.fill(query)
    search.press("Enter")
    time.sleep(5)

    # Scroll the results feed
    scrollable = page.locator('div[role="feed"]')
    for _ in range(max_scrolls):
        page.evaluate('(el) => el.scrollTop = el.scrollHeight', scrollable)
        time.sleep(scroll_pause)

    # Get all result cards
    feed_container = page.locator('div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd[role="feed"]')
    cards = feed_container.locator("div.Nv2PK.THOPZb.CpccDe")
    count = cards.count()

    data = []

    for i in range(count):
        card = cards.nth(i)

        name = ""
        rating = ""
        reviews = ""
        category = ""
        services = ""
        image_url = ""
        detail_url = ""

        # Name
        name_el = card.locator(".qBF1Pd")
        if name_el.count() > 0:
            name = name_el.nth(0).inner_text()

        # Rating
        rating_el = card.locator('span[aria-label*="stars"]')
        if rating_el.count() > 0:
            aria_label = rating_el.nth(0).get_attribute("aria-label")
            match = re.search(r"([\d.]+)", aria_label)
            if match:
                rating = match.group(1)

        # Reviews
        reviews_el = card.locator(".UY7F9")
        if reviews_el.count() > 0:
            text = reviews_el.nth(0).inner_text()
            match = re.search(r"([\d,]+)", text)
            if match:
                reviews = match.group(1).replace(",", "")

        # Category
        category_el = card.locator('div.W4Efsd > span').first
        if category_el:
            category = category_el.inner_text()

        # Services
        services_el = card.locator('div.ah5Ghc > span')
        if services_el.count() > 0:
            services = ", ".join([services_el.nth(j).inner_text() for j in range(services_el.count())])

        # Image URL
        image_el = card.locator('img[src*="googleusercontent"]')
        if image_el.count() > 0:
            image_url = image_el.nth(0).get_attribute("src")

        # Detail URL
        link_el = card.locator('a.hfpxzc')
        if link_el.count() > 0:
            detail_url = link_el.nth(0).get_attribute("href")

        data.append({
            "Name": name,
            "Rating": rating,
            "Reviews": reviews,
            "Category": category,
            "Services": services,
            "Image": image_url,
            "Detail URL": detail_url
        })

    # Save to CSV with pandas
    df = pd.DataFrame(data)
    df.to_csv("maps_data_playwright.csv", index=False)
    print(f"Saved {len(df)} records to maps_data_playwright.csv")

    browser.close()



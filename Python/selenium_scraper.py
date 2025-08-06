from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd
import re

query = "restaurants in New York"
max_scrolls = 10
scroll_pause = 2

options = Options()
driver = webdriver.Chrome(options=options)

driver.get("https://www.google.com/maps")
time.sleep(5)

search = driver.find_element(By.ID, "searchboxinput")
search.send_keys(query)
search.send_keys(Keys.ENTER)
time.sleep(5)

scrollable = driver.find_element(By.CSS_SELECTOR, 'div[role="feed"]')

for _ in range(max_scrolls):
    driver.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', scrollable)
    time.sleep(scroll_pause)

feed_container = driver.find_element(By.CSS_SELECTOR, 'div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd[role="feed"]')
cards = feed_container.find_elements(By.CSS_SELECTOR, "div.Nv2PK.THOPZb.CpccDe")
data = []

for card in cards:
    name_el = card.find_elements(By.CLASS_NAME, "qBF1Pd")
    name = name_el[0].text if name_el else ""
    print(name)

    rating_el = card.find_elements(By.XPATH, './/span[contains(@aria-label, "stars")]')
    rating = ""
    if rating_el:
        match = re.search(r"([\d.]+)", rating_el[0].get_attribute("aria-label"))
        rating = match.group(1) if match else ""

    reviews_el = card.find_elements(By.CLASS_NAME, "UY7F9")
    reviews = ""
    if reviews_el:
        match = re.search(r"([\d,]+)", reviews_el[0].text)
        reviews = match.group(1).replace(",", "") if match else ""
        
    category_el = card.find_elements(By.XPATH, './/div[contains(@class, "W4Efsd")]/span[1]')
    category = category_el[0].text if category_el else ""

    services_el = card.find_elements(By.XPATH, './/div[contains(@class, "ah5Ghc")]/span')
    services = ", ".join([s.text for s in services_el]) if services_el else ""

    image_el = card.find_elements(By.XPATH, './/img[contains(@src, "googleusercontent")]')
    image_url = image_el[0].get_attribute("src") if image_el else ""

    link_el = card.find_elements(By.CSS_SELECTOR, 'a.hfpxzc')
    detail_url = link_el[0].get_attribute("href") if link_el else ""

    data.append({
        "Name": name,
        "Rating": rating,
        "Reviews": reviews,
        "Category": category,
        "Services": services,
        "Image": image_url,
        "Detail URL": detail_url
    })

df = pd.DataFrame(data)
df.to_csv("maps_data.csv", index=False)

print(f"Saved {len(df)} records to maps_data.csv")

driver.quit()

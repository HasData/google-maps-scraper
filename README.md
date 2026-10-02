# Google Maps Scraper Examples (Python & Node.js)

![Python 3.10 or newer badge](https://img.shields.io/badge/python-3.10+-blue) ![Node.js 18 or newer badge](https://img.shields.io/badge/node.js-18+-green)

[![HasData, the Google Maps API the API examples call](banner.png)](https://hasdata.com/?utm_source=github&utm_medium=syndication&utm_campaign=how-to-scrape-google-maps&utm_content=google-maps-scraper-readme)

This repository contains working examples of scraping **Google Maps search results** using:

* **Selenium**
* **Playwright (with stealth)**
* **[HasData Google Maps API](https://hasdata.com/apis/google-maps-search-api?utm_source=github&utm_medium=syndication&utm_campaign=how-to-scrape-google-maps&utm_content=google-maps-scraper-readme)**

in both **Python** and **Node.js**. Each method includes clean and minimal code samples with working selectors and data saving logic.


## Table of Contents

1. [Requirements](#requirements)
2. [Project Structure](#project-structure)
3. [Scraper Examples](#scraper-examples)
   * [Selenium](#selenium)
   * [Playwright + Stealth](#playwright--stealth)
   * [HasData API](#hasdata-api)


## Requirements

**Python 3.10+** or **Node.js 18+**

### Python Setup

Install required packages:

```bash
pip install selenium pandas playwright playwright-stealth
playwright install
```

The second line downloads the browsers Playwright drives.

### Node.js Setup

Install required packages:

```bash
npm install selenium-webdriver playwright playwright-extra playwright-extra-plugin-stealth axios
```

The API examples need only `axios` from that list.

## Project Structure

The two folders mirror each other, one script per method.

```
google-maps-scraper/
│
├── python/
│   ├── selenium_scraper.py
│   ├── playwright_scraper.py
│   ├── hasdata_api_scraper.py
│
├── nodejs/
│   ├── selenium_scraper.js
│   ├── playwright_scraper.js
│   ├── hasdata_api_scraper.js
│
└── README.md
```

Each script scrapes the same fields, business name, rating, review count, category, services, image, and detail URL. Output is saved in both `.json` and `.csv`.

## Scraper Examples

Three routes to the same listings, pick by how defended your volume is.

### Selenium

Classic Google Maps scraping using Selenium with visible browser.

| Parameter      | Description              | Example                |
| -------------- | ------------------------ | ---------------------- |
| `query`        | Search query             | `"pizza in New York"`  |
| `max_scrolls`  | Number of scroll cycles  | `10`                   |
| `scroll_pause` | Pause between scrolls    | `2` seconds            |
| `max_scrolls`  | Scroll repetitions       | `10`                   |
| `output_file`  | Output CSV/JSON filename | `"maps_data.csv/json"` |

Selenium is the baseline, it breaks first when Maps changes markup.

### Playwright + Stealth

Runs headless or headful with stealth mode to avoid detection.

| Parameter     | Description              | Example                    |
| ------------- | ------------------------ | -------------------------- |
| `query`       | Search query             | `"restaurants in Chicago"` |
| `headless`    | Headless mode or not     | `True`                     |
| `scroll_pause`| Pause between scrolls    | `2` seconds                |
| `max_scrolls` | Scroll repetitions       | `10`                       |
| `output_file` | Output CSV/JSON filename | `"output.csv"`             |

Stealth keeps the scroll loop alive noticeably longer than the default profile.

### HasData API

Use the Google Maps scraping API by HasData, no browser automation needed.

| Parameter      | Description                   | Example                        |
| -------------- | ----------------------------- | ------------------------------ |
| `api_key`      | Your HasData API key          | `"your-key"`                   |
| `query`        | Search query                  | `"bars near San Francisco"`    |
| `output_file`  | Output file                   | `"results.json / results.csv"` |

One request returns parsed listings, so there are no selectors to maintain.

### HasData Reviews Feed

`hasdata_reviews_scraper` collects the full review feed of one place. Search resolves the place's `dataId`, then the reviews endpoint returns author, rating, date and text per review, saved to CSV. Verified live, a coffee-shop query returned its place and 8 reviews with full texts.

| Parameter      | Description                   | Example                        |
| -------------- | ----------------------------- | ------------------------------ |
| `api_key`      | Your HasData API key          | `"your-key"`                   |
| `query`        | Search query for the place    | `"coffee shop, Austin, TX"`    |
| `output_file`  | Output CSV file               | `"reviews.csv"`                |

The listing scrapers above capture the review count, this one captures the reviews themselves.

## Notes

* **Selectors change**, so verify current class names on Google Maps before a long run.
* **Rate limiting** responds to random delays, proxies, or the API route.
* **For heavy usage**, prefer the API or your own headless proxy farm.


## Disclaimer

These examples are for **educational purposes** only. Learn more about [the legality of web scraping](https://hasdata.com/blog/is-web-scraping-legal?utm_source=github&utm_medium=syndication&utm_campaign=how-to-scrape-google-maps&utm_content=google-maps-scraper-readme).



## 📎 More Resources

* [How to Scrape Google Maps Data Using Python](https://hasdata.com/blog/how-to-scrape-google-maps?utm_source=github&utm_medium=syndication&utm_campaign=how-to-scrape-google-maps&utm_content=google-maps-scraper-readme), the tutorial the listing scrapers follow
* [How to Scrape Google Maps Reviews](https://hasdata.com/blog/scrape-google-maps-reviews?utm_source=github&utm_medium=syndication&utm_campaign=how-to-scrape-google-maps&utm_content=google-maps-scraper-readme), the tutorial behind the reviews feed script
* [Join the community on Discord](https://discord.com/invite/QeuPtWpkAt)

* [Star this repo if helpful ⭐](#)

![Python](https://img.shields.io/badge/python-3.10+-blue)
![Node.js](https://img.shields.io/badge/node.js-18+-green)

# Google Maps Scraper Examples (Python & Node.js)

[![HasData\_bannner](banner.png)](https://hasdata.com/)

This repository contains working examples of scraping **Google Maps search results** using:

* **Selenium**
* **Playwright (with stealth)**
* **[HasData Google Maps API](https://hasdata.com/apis/google-maps-search-api)**

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

### Node.js Setup

Install required packages:

```bash
npm install selenium-webdriver playwright playwright-extra playwright-extra-plugin-stealth axios
```


## Project Structure

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

Each script scrapes the same data: business name, rating, reviews, category, services, image, and detail URL. Output is saved in both `.json` and `.csv`.

## Scraper Examples

### Selenium

Classic Google Maps scraping using Selenium with visible browser.

| Parameter      | Description              | Example                |
| -------------- | ------------------------ | ---------------------- |
| `query`        | Search query             | `"pizza in New York"`  |
| `max_scrolls`  | Number of scroll cycles  | `10`                   |
| `scroll_pause` | Pause between scrolls    | `2` seconds            |
| `max_scrolls`  | Scroll repetitions       | `10`                   |
| `output_file`  | Output CSV/JSON filename | `"maps_data.csv/json"` |


### Playwright + Stealth

Runs headless or headful with stealth mode to avoid detection.

| Parameter     | Description              | Example                    |
| ------------- | ------------------------ | -------------------------- |
| `query`       | Search query             | `"restaurants in Chicago"` |
| `headless`    | Headless mode or not     | `True`                     |
| `scroll_pause`| Pause between scrolls    | `2` seconds                |
| `max_scrolls` | Scroll repetitions       | `10`                       |
| `output_file` | Output CSV/JSON filename | `"output.csv"`             |


### HasData API

Use Google Maps scraping API (by HasData) — no browser automation needed.

| Parameter      | Description                   | Example                        |
| -------------- | ----------------------------- | ------------------------------ |
| `api_key`      | Your HasData API key          | `"your-key"`                   |
| `query`        | Search query                  | `"bars near San Francisco"`    |
| `output_file`  | Output file                   | `"results.json / results.csv"` |


## Notes

* **Selectors may change** — always verify current class names on Google Maps.
* **Avoid rate limiting** — random delays, proxies, or API-based approach recommended.
* **For heavy usage**, prefer HasData or your own headless proxy farm.


## Disclaimer

These examples are for **educational purposes** only. Learn more about [the legality of web scraping](https://hasdata.com/blog/is-web-scraping-legal).



## 📎 More Resources

* [How to Scrape Google Maps Data Using Python](https://hasdata.com/blog/how-to-scrape-google-maps)
* [Join the community on Discord](https://email.hasdata.com/e/c/eyJlbWFpbF9pZCI6ImRnU2RrUWdEQVBENUF1XzVBZ0dXcXhUNGdSTk12RXZEb0pPM3UxUT0iLCJocmVmIjoiaHR0cHM6Ly9oYXNkYXRhLmNvbS9qb2luLWRpc2NvcmQiLCJpbnRlcm5hbCI6IjlkOTEwODAxYmY4ZjAxZjBmOTAyIiwibGlua19pZCI6MjMzfQ/7b95f85846853ee473b2d955c1e158190975e23eb18b11156d6df08e1f544488)

* [Star this repo if helpful ⭐](#)

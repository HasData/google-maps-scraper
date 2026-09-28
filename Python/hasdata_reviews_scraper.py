"""Collect the review feed of a place through the HasData Google Maps Reviews API.

Search resolves the place's dataId first, then the reviews endpoint returns the
feed as JSON. Put your API key into API_KEY, sign-up gives one free.
"""
import csv

import requests

API_KEY = "YOUR-API-KEY"
QUERY = "coffee shop, Austin, TX"
OUTPUT_FILE = "reviews.csv"

HEADERS = {"Content-Type": "application/json", "x-api-key": API_KEY}


def find_place(query):
    url = f"https://api.hasdata.com/scrape/google-maps/search?q={query}"
    response = requests.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    results = response.json().get("localResults", [])
    return results[0] if results else None


def get_reviews(data_id):
    url = f"https://api.hasdata.com/scrape/google-maps/reviews?dataId={data_id}"
    response = requests.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    return response.json().get("reviews", [])


place = find_place(QUERY)
if not place:
    raise SystemExit(f"No places found for {QUERY!r}")

reviews = get_reviews(place["dataId"])
print(f"{place['title']}: {len(reviews)} reviews")

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["author", "rating", "date", "text"])
    for r in reviews:
        writer.writerow([
            r.get("user", {}).get("name", ""),
            r.get("rating", ""),
            r.get("date", ""),
            (r.get("snippet") or "").replace("\n", " "),
        ])
print(f"Saved to {OUTPUT_FILE}")

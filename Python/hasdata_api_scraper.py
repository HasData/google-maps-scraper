import requests
import json
import pandas as pd

api_key = 'YOUR-API-KEY'
query = 'Pizza'

url = f"https://api.hasdata.com/scrape/google-maps/search?q={query}"
headers = {
    'Content-Type': 'application/json',
    'x-api-key': api_key
}

response = requests.get(url, headers=headers)
data = response.json()

with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

results = data.get("localResults", [])

filtered = [
    {
        "title": r.get("title"),
        "address": r.get("address"),
        "phone": r.get("phone"),
        "website": r.get("website"),
        "rating": r.get("rating"),
        "reviews": r.get("reviews"),
        "type": r.get("type"),
        "price": r.get("price"),
        "latitude": r.get("gpsCoordinates", {}).get("latitude"),
        "longitude": r.get("gpsCoordinates", {}).get("longitude")
    }
    for r in results
]

df = pd.DataFrame(filtered)
df.to_csv('output.csv', index=False)
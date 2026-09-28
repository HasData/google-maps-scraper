// Collect the review feed of a place through the HasData Google Maps Reviews API.
// Search resolves the place's dataId first, then the reviews endpoint returns
// the feed as JSON. Put your API key into apiKey, sign-up gives one free.
const axios = require('axios');
const fs = require('fs');

const apiKey = 'YOUR-API-KEY';
const query = 'coffee shop, Austin, TX';
const outputFile = 'reviews.csv';

const headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey };

async function findPlace(q) {
  const { data } = await axios.get('https://api.hasdata.com/scrape/google-maps/search', {
    headers, params: { q },
  });
  return (data.localResults || [])[0] || null;
}

async function getReviews(dataId) {
  const { data } = await axios.get('https://api.hasdata.com/scrape/google-maps/reviews', {
    headers, params: { dataId },
  });
  return data.reviews || [];
}

(async () => {
  const place = await findPlace(query);
  if (!place) throw new Error(`No places found for ${query}`);

  const reviews = await getReviews(place.dataId);
  console.log(`${place.title}: ${reviews.length} reviews`);

  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  const rows = [['author', 'rating', 'date', 'text'].join(',')];
  for (const r of reviews) {
    rows.push([esc(r.user && r.user.name), esc(r.rating), esc(r.date), esc(r.snippet)].join(','));
  }
  fs.writeFileSync(outputFile, rows.join('\n'));
  console.log(`Saved to ${outputFile}`);
})();

const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

const apiKey = 'YOUR-API-KEY';
const query = 'Pizza';

(async () => {
  const url = `https://api.hasdata.com/scrape/google-maps/search?q=${encodeURIComponent(query)}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data;

    fs.writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf-8');

    const results = data.localResults || [];

    const filtered = results.map(r => ({
      title: r.title,
      address: r.address,
      phone: r.phone,
      website: r.website,
      rating: r.rating,
      reviews: r.reviews,
      type: r.type,
      price: r.price,
      latitude: r.gpsCoordinates?.latitude,
      longitude: r.gpsCoordinates?.longitude
    }));

    const parser = new Parser();
    const csv = parser.parse(filtered);

    fs.writeFileSync('output.csv', csv, 'utf-8');

    console.log(`Saved ${filtered.length} records to output.csv`);
  } catch (error) {
    console.error(error);
  }
})();

const fs = require('fs');
const { chromium } = require('playwright-extra');
const StealthPlugin = require('playwright-extra-plugin-stealth');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

chromium.use(StealthPlugin());

const query = 'restaurants in New York';
const maxScrolls = 10;
const scrollPause = 2000;

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Open Google Maps
  await page.goto('https://www.google.com/maps', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Enter search query
  await page.fill('#searchboxinput', query);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  // Scroll result panel
  const scrollable = await page.locator('div[role="feed"]');
  for (let i = 0; i < maxScrolls; i++) {
    await page.evaluate((el) => el.scrollTop = el.scrollHeight, await scrollable.elementHandle());
    await page.waitForTimeout(scrollPause);
  }

  // Scrape cards
  const feedContainer = await page.locator('div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd[role="feed"]');
  const cards = await feedContainer.locator('div.Nv2PK.THOPZb.CpccDe');
  const count = await cards.count();

  const data = [];

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    const name = await getText(card, '.qBF1Pd');
    const rating = await getRating(card, 'span[aria-label*="stars"]');
    const reviews = await getText(card, '.UY7F9', true);
    const category = await getText(card, 'div.W4Efsd > span');
    const services = await getMultipleTexts(card, 'div.ah5Ghc > span');
    const image = await getAttr(card, 'img[src*="googleusercontent"]', 'src');
    const detailUrl = await getAttr(card, 'a.hfpxzc', 'href');

    data.push({
      Name: name,
      Rating: rating,
      Reviews: reviews,
      Category: category,
      Services: services,
      Image: image,
      'Detail URL': detailUrl,
    });
  }

  // Save to CSV
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, 'maps_data_playwright.csv'),
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key }))
  });

  await csvWriter.writeRecords(data);
  console.log(`Saved ${data.length} records to maps_data_playwright.csv`);

  await browser.close();
})();

// Helpers
async function getText(parent, selector, digitsOnly = false) {
  try {
    const el = await parent.locator(selector);
    if ((await el.count()) > 0) {
      const text = await el.nth(0).innerText();
      return digitsOnly ? (text.match(/[\d,]+/)?.[0].replace(/,/g, '') || '') : text;
    }
  } catch (_) {}
  return '';
}

async function getAttr(parent, selector, attr) {
  try {
    const el = await parent.locator(selector);
    if ((await el.count()) > 0) {
      return await el.nth(0).getAttribute(attr);
    }
  } catch (_) {}
  return '';
}

async function getRating(parent, selector) {
  try {
    const el = await parent.locator(selector);
    if ((await el.count()) > 0) {
      const label = await el.nth(0).getAttribute('aria-label');
      const match = label.match(/[\d.]+/);
      return match ? match[0] : '';
    }
  } catch (_) {}
  return '';
}

async function getMultipleTexts(parent, selector) {
  try {
    const els = await parent.locator(selector);
    const count = await els.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(await els.nth(i).innerText());
    }
    return texts.join(', ');
  } catch (_) {}
  return '';
}

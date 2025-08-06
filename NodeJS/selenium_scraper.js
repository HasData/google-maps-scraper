const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');
const fs = require('fs');

(async function() {
  const query = "restaurants in New York";
  const maxScrolls = 10;
  const scrollPause = 2000;

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get("https://www.google.com/maps");
    const searchBox = await driver.wait(until.elementLocated(By.id("searchboxinput")), 10000);
    await searchBox.sendKeys(query, Key.RETURN);
    await driver.sleep(5000);
    const feed = await driver.wait(until.elementLocated(By.css('div[role="feed"]')), 10000);

    for (let i = 0; i < maxScrolls; i++) {
      await driver.executeScript('arguments[0].scrollTop = arguments[0].scrollHeight', feed);
      await driver.sleep(scrollPause);
    }

    const feedContainer = await driver.findElement(By.css('div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd[role="feed"]'));
    const cards = await feedContainer.findElements(By.css('div.Nv2PK.THOPZb.CpccDe'));

    const data = [];

    for (const card of cards) {
      let name = "";
      try { name = await (await card.findElement(By.className("qBF1Pd"))).getText(); } catch {}
      let rating = "";
      try {
        const ariaLabel = await (await card.findElement(By.xpath('.//span[contains(@aria-label, "stars")]'))).getAttribute("aria-label");
        const match = ariaLabel.match(/([\d.]+)/);
        rating = match ? match[1] : "";
      } catch {}
      let reviews = "";
      try {
        const text = await (await card.findElement(By.className("UY7F9"))).getText();
        const match = text.match(/([\d,]+)/);
        reviews = match ? match[1].replace(/,/g, "") : "";
      } catch {}
      let category = "";
      try { category = await (await card.findElement(By.xpath('.//div[contains(@class, "W4Efsd")]/span[1]'))).getText(); } catch {}
      let services = "";
      try {
        const servicesEls = await card.findElements(By.xpath('.//div[contains(@class, "ah5Ghc")]/span'));
        const servicesTexts = [];
        for (const el of servicesEls) servicesTexts.push(await el.getText());
        services = servicesTexts.join(", ");
      } catch {}
      let imageUrl = "";
      try { imageUrl = await (await card.findElement(By.xpath('.//img[contains(@src, "googleusercontent")]'))).getAttribute("src"); } catch {}
      let detailUrl = "";
      try { detailUrl = await (await card.findElement(By.css('a.hfpxzc'))).getAttribute("href"); } catch {}

      data.push({ Name: name, Rating: rating, Reviews: reviews, Category: category, Services: services, Image: imageUrl, "Detail URL": detailUrl });
    }

    const csvHeader = "Name,Rating,Reviews,Category,Services,Image,Detail URL\n";
    const csvRows = data.map(d =>
      `"${d.Name.replace(/"/g, '""')}",${d.Rating},${d.Reviews},"${d.Category.replace(/"/g, '""')}","${d.Services.replace(/"/g, '""')}","${d.Image}","${d["Detail URL"]}"`
    );
    fs.writeFileSync("maps_data.csv", csvHeader + csvRows.join("\n"));
    console.log(`Saved ${data.length} records to maps_data.csv`);

  } finally {
    await driver.quit();
  }
})();

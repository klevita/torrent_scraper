async function extractTitle(tr) {
  const topic = await tr.$(".torTopic");
  if (topic) {
    const text = await topic.evaluate((item) => item.innerText);
    const regex = new RegExp(
      ["√·", "\\*·", "Горячая", "\\[ Опрос \\]"].join("|"),
      "gi"
    );
    const formattedText = text.replaceAll(regex, "").trim();
    return formattedText;
  }
}
async function extractLink(tr) {
  const topic = await tr.$(".torTopic > .torTopic");
  if (topic) {
    const link = await (await topic.getProperty("href")).jsonValue();
    return link;
  }
}
async function extractSeeds(tr) {
  const seeds = await tr.$(".seedmed > *");
  if (seeds) {
    return Number(await seeds.evaluate((item) => item.innerText));
  }
}
async function extractLeaches(tr) {
  const leaches = await tr.$(".leechmed > *");
  if (leaches) {
    return Number(await leaches.evaluate((item) => item.innerText));
  }
}
async function extractSize(tr) {
  const sizeContainer = await tr.$(".small.f-dl.dl-stub");
  if (sizeContainer) {
    const rawSize = await sizeContainer.evaluate((item) => item.innerText);
    return rawSize;
  }
}

async function extractTorrentsList(browser, pagePath) {
  const page = await browser.newPage();
  await page.goto(pagePath, {
    waitUntil: "domcontentloaded",
  });

  const trs = await page.$$("table.forum > tbody > tr");

  let startReading = false;
  const torrents = [];
  for (const tr of trs) {
    if (!startReading) {
      const text = await tr.evaluate((item) => item.innerText);
      if (text === "Темы") {
        startReading = true;
      }
    } else {
      const title = await extractTitle(tr);
      const seeds = await extractSeeds(tr);
      const leaches = await extractLeaches(tr);
      const size = await extractSize(tr);
      const link = await extractLink(tr);
      const id = await (await tr.getProperty("id")).jsonValue();

      torrents.push({ title, link, seeds, leaches, size, id });

      if (Object.values(torrents.at(-1)).some((v) => v === undefined)) {
        torrents.pop();
      }
    }
  }
  browser.close();

  return torrents;
}

module.exports = {
  extractTorrentsList,
  extractSize,
  extractLeaches,
  extractLink,
  extractSeeds,
  extractTitle,
};

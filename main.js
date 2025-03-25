const { extractTorrentsList } = require("./src/TorrentsScraper");
const { saveTorrents } = require("./src/api/SaveTorrents");
const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const torrents = await extractTorrentsList(
    browser,
    "https://rutracker.org/forum/viewforum.php?f=635"
  ); 
  console.log(torrents);

  saveTorrents(torrents);
}

main();

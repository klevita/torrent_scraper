import { expect, describe, beforeAll, afterAll, it } from "vitest";
import { extractTorrentsList } from "../TorrentsScraper";
import { RUTRACKER_GAMES_WINDOWS_RESULTS } from "./results.mjs";
import puppeteer from "puppeteer";

describe("Integration Test (with real browser)", async () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  it("should extract real data from test page", async () => {
    const torrents = await extractTorrentsList(
      browser,
      "file://" + __dirname + "/test-hot-windows-games.html"
    );

    expect(String(torrents)).toMatch(String(RUTRACKER_GAMES_WINDOWS_RESULTS));
  });

  afterAll(async () => {
    await browser.close();
  });
});

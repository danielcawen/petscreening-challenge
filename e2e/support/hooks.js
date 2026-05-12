import { Before, After } from "@cucumber/cucumber";
import { chromium, firefox, webkit, request } from "@playwright/test";
import { BASE_URL } from "./env.js";

const browsers = { chromium, firefox, webkit };

const viewports = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 390, height: 844 },
};

Before({ tags: "@ui" }, async function () {
  const browserType = browsers[process.env.BROWSER] ?? chromium;
  this.browser = await browserType.launch({ headless: process.env.HEADED !== "true" });
  const viewport = viewports[process.env.VIEWPORT] ?? viewports.desktop;
  this.page = await this.browser.newPage({ viewport });
});

After({ tags: "@ui" }, async function () {
  await this.browser?.close();
});

Before({ tags: "@api" }, async function () {
  this.apiContext = await request.newContext({ baseURL: BASE_URL });
});

After({ tags: "@api" }, async function () {
  await this.apiContext?.dispose();
});

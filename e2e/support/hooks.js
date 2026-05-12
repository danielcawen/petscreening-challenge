import { Before, After, AfterStep } from "@cucumber/cucumber";
import { chromium, firefox, webkit, request } from "@playwright/test";
import fs from "fs";
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
  this.context = await this.browser.newContext({
    recordVideo: { dir: "reports/videos/" },
    viewport,
  });
  this.page = await this.context.newPage();
});

AfterStep({ tags: "@ui" }, async function ({ result }) {
  if (result?.status === "FAILED") {
    const screenshot = await this.page?.screenshot();
    if (screenshot) await this.attach(screenshot, { mediaType: "image/png", fileName: "screenshot.png" });

    const video = this.page?.video();
    await this.page?.close();
    await this.context?.close();
    this._uiTornDown = true;

    if (video) {
      const videoPath = await video.path();
      if (videoPath) {
        await this.attach(fs.readFileSync(videoPath), { mediaType: "video/webm", fileName: "video.webm" });
        fs.unlinkSync(videoPath);
      }
    }
  }
});

After({ tags: "@ui" }, async function () {
  if (this._uiTornDown) {
    await this.browser?.close();
    return;
  }

  const video = this.page?.video();
  await this.page?.close();
  await this.context?.close();

  if (video) {
    const videoPath = await video.path();
    if (videoPath) fs.unlinkSync(videoPath);
  }

  await this.browser?.close();
});

Before({ tags: "@api" }, async function () {
  this.apiContext = await request.newContext({ baseURL: BASE_URL });
});

After({ tags: "@api" }, async function () {
  await this.apiContext?.dispose();
});

import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as weatherPage from "../../../pages/checkout/weather.js";

When("I select the {string} weather", async function (weather) {
  await weatherPage.selectWeather(this.page, weather);
});

Then("the {string} weather option should be active", async function (weather) {
  const background = await weatherPage.getWeatherBackground(this.page, weather);
  expect(background).not.toBe(weatherPage.INACTIVE_BACKGROUND);
});

Then("the {string} weather option should be inactive", async function (weather) {
  const background = await weatherPage.getWeatherBackground(this.page, weather);
  expect(background).toBe(weatherPage.INACTIVE_BACKGROUND);
});

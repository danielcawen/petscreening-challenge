import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as weatherPage from "../../../pages/checkout/weather.js";

When("I select the {string} weather", async function (weather) {
  await weatherPage.selectWeather(this.page, weather);
});

Then("the {string} weather option should be active", async function (weather) {
  const background = await weatherPage.getWeatherBackground(this.page, weather);
  // Active Clear uses var(--action); active Raining uses var(--sky-500)
  expect(background).not.toBe("var(--bg-raised)");
});

Then("the {string} weather option should be inactive", async function (weather) {
  const background = await weatherPage.getWeatherBackground(this.page, weather);
  expect(background).toBe("var(--bg-raised)");
});

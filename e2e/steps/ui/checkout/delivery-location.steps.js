import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as deliveryLocationPage from "../../../pages/checkout/delivery-location.js";

When("I select the {string} location mode", async function (mode) {
  await deliveryLocationPage.selectLocationMode(this.page, mode);
});

Then("the {string} location mode should be active", async function (mode) {
  const bg = await deliveryLocationPage.getLocationModeBackground(this.page, mode);
  expect(bg).toBe("var(--action)");
});

Then("an address input field should be visible", async function () {
  await expect(this.page.getByPlaceholder("Enter your address")).toBeVisible();
});

Then("a {string} button should be visible", async function (label) {
  await expect(this.page.getByRole("button", { name: label })).toBeVisible();
});

Then("a distance input field should be visible", async function () {
  await expect(this.page.getByPlaceholder("e.g. 10.5")).toBeVisible();
});

Then("a distance slider should be visible", async function () {
  await expect(this.page.locator("input[type='range']")).toBeVisible();
});

When("I enter a distance of {string} km", async function (distance) {
  await deliveryLocationPage.enterManualDistance(this.page, distance);
});

When("I enter a valid near-range distance", async function () {
  const distance = faker.number.float({ min: 1, max: 9.9, fractionDigits: 1 });
  await deliveryLocationPage.enterManualDistance(this.page, String(distance));
});

When("I enter an out-of-range distance", async function () {
  const distance = faker.number.int({ min: 101, max: 500 });
  await deliveryLocationPage.enterManualDistance(this.page, String(distance));
});

Then("I should see the distance message {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

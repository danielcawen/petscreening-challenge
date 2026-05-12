import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as deliveryInstructionsPage from "../../../pages/checkout/delivery-instructions.js";

When("I enter delivery instructions {string}", async function (text) {
  await deliveryInstructionsPage.enterDeliveryInstructions(this.page, text);
});

When("I enter a short random delivery instruction", async function () {
  this.instructionText = faker.lorem.sentence();
  await deliveryInstructionsPage.enterDeliveryInstructions(this.page, this.instructionText);
});

Then("the character counter should show the correct count", async function () {
  const expected = `${this.instructionText.length}/200 characters`;
  await expect(this.page.getByText(expected)).toBeVisible();
});

When("I enter random delivery instructions", async function () {
  const instructions = faker.lorem.sentences(2).slice(0, 160);
  this.deliveryInstructions = instructions;
  await deliveryInstructionsPage.enterDeliveryInstructions(this.page, instructions);
});

When("I enter delivery instructions that exceed the character limit", async function () {
  await deliveryInstructionsPage.enterDeliveryInstructions(this.page, "A".repeat(201));
});

Then("the character counter should show {string}", async function (expected) {
  await expect(this.page.getByText(expected, { exact: false })).toBeVisible();
});

Then("the character counter should be within the 200-character limit", async function () {
  const count = await deliveryInstructionsPage.getCharCounterCount(this.page);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(200);
});

Then("no character limit warning should be shown", async function () {
  await expect(this.page.getByText("Instructions too long", { exact: false })).not.toBeVisible();
});

Then("the character counter should show more than 200 characters used", async function () {
  const count = await deliveryInstructionsPage.getCharCounterCount(this.page);
  expect(count).toBeGreaterThan(200);
});

Then("I should see a character limit warning", async function () {
  await expect(this.page.getByText("Instructions too long", { exact: false })).toBeVisible();
});

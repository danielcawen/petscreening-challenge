import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as paymentPage from "../../../pages/checkout/payment.js";

Then("the Payment card should be visible", async function () {
  await expect(paymentPage.getPaymentCard(this.page)).toBeVisible();
});

Then("the Payment card should show the {string} field", async function (fieldLabel) {
  await expect(
    paymentPage.getPaymentCard(this.page).getByText(fieldLabel, { exact: false })
  ).toBeVisible();
});

Then("the Payment card should show the demo disclaimer", async function () {
  await expect(
    paymentPage
      .getPaymentCard(this.page)
      .getByText("No real charges will be made", { exact: false })
  ).toBeVisible();
});

When("I fill in the card number {string}", async function (card) {
  await this.page.getByPlaceholder("4242 4242 4242 4242").fill(card);
});

When("I fill in the expiry {string}", async function (expiry) {
  await this.page.getByPlaceholder("MM / YY").fill(expiry);
});

When("I fill in the CVV {string}", async function (cvv) {
  await this.page.getByPlaceholder("123").fill(cvv);
});

Then("the card number should be formatted as {string}", async function (formatted) {
  const value = await paymentPage.getCardNumberValue(this.page);
  expect(value).toBe(formatted);
});

Then("the expiry should be formatted as {string}", async function (formatted) {
  const value = await paymentPage.getExpiryValue(this.page);
  expect(value).toBe(formatted);
});

Then("the CVV value should be {string}", async function (expected) {
  const value = await paymentPage.getCvvValue(this.page);
  expect(value).toBe(expected);
});

When("I fill in a randomly generated card number", async function () {
  const rawCard = faker.finance.creditCardNumber({ issuer: "visa" });
  this.cardDigits = rawCard.replace(/\D/g, "").slice(0, 16);
  await this.page.getByPlaceholder("4242 4242 4242 4242").fill(rawCard);
});

Then("the card number should be formatted in groups of four digits", async function () {
  const expected = this.cardDigits.replace(/(\d{4})(?=\d)/g, "$1 ");
  const value = await paymentPage.getCardNumberValue(this.page);
  expect(value).toBe(expected);
});

When("I fill in a randomly generated expiry date", async function () {
  const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
  const year = String(faker.number.int({ min: 26, max: 35 })).padStart(2, "0");
  this.expiryRaw = `${month}${year}`;
  await this.page.getByPlaceholder("MM / YY").fill(this.expiryRaw);
});

Then("the expiry should be formatted correctly", async function () {
  const expected = `${this.expiryRaw.slice(0, 2)} / ${this.expiryRaw.slice(2, 4)}`;
  const value = await paymentPage.getExpiryValue(this.page);
  expect(value).toBe(expected);
});

When("I fill in a CVV containing only letters", async function () {
  this.cvvInput = faker.string.alpha({ length: { min: 3, max: 8 } });
  await this.page.getByPlaceholder("123").fill(this.cvvInput);
});

Then("the CVV value should be empty", async function () {
  const value = await paymentPage.getCvvValue(this.page);
  expect(value).toBe("");
});

When("I fill in a CVV with more than four digits", async function () {
  this.cvvInput = faker.string.numeric({ length: { min: 5, max: 8 } });
  await this.page.getByPlaceholder("123").fill(this.cvvInput);
});

Then("the CVV should only show the first four digits", async function () {
  const value = await paymentPage.getCvvValue(this.page);
  expect(value).toBe(this.cvvInput.slice(0, 4));
});

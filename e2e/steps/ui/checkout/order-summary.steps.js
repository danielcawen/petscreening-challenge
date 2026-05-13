import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as orderSummaryPage from "../../../pages/checkout/order-summary.js";
import { computeSubtotal, formatMoney } from "./helpers.js";

Then("the {string} section should be visible", async function (sectionName) {
  await expect(this.page.getByText(sectionName, { exact: false })).toBeVisible();
});

Then("the Order Summary items row should show {string}", async function (amount) {
  const text = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Items");
  expect(text.trim()).toBe(amount);
});

Then("the Order Summary grand total should be {string}", async function (amount) {
  const text = await orderSummaryPage.getGrandTotal(this.page);
  expect(text.trim()).toBe(amount);
});

Then("the Order Summary items row should show the correct subtotal", async function () {
  const text = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Items");
  expect(text.trim()).toBe(formatMoney(computeSubtotal(this.cartItems)));
});

// Computes expected grand total as: cartItems subtotal + sum of all non-Items fee/discount rows
// shown on the page. This keeps the assertion resilient to both product price changes and
// billing rule changes.
Then("the Order Summary grand total should be correct", async function () {
  await orderSummaryPage.waitForDeliveryRow(this.page);
  await orderSummaryPage.waitForGrandTotal(this.page);
  const subtotal = computeSubtotal(this.cartItems);
  const feeTexts = await orderSummaryPage
    .getOrderSummaryCard(this.page)
    .locator(".space-y-2 .flex.justify-between.items-center.text-sm")
    .filter({ hasNotText: "Items" })
    .locator("span.font-medium")
    .allTextContents();
  const fees = feeTexts.reduce((sum, t) => sum + parseFloat(t.replace("$", "")), 0);
  const text = await orderSummaryPage.getGrandTotal(this.page);
  expect(text.trim()).toBe(formatMoney(subtotal + fees));
});

Then("the Order Summary promo should reflect {int}% off", async function (percent) {
  const discount = computeSubtotal(this.cartItems) * (percent / 100);
  const text = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Promo:");
  expect(text.trim()).toBe(`-${formatMoney(discount)}`);
});

Then(
  "the Order Summary should contain a line {string} with {string}",
  async function (label, amount) {
    const row = orderSummaryPage
      .getOrderSummaryCard(this.page)
      .locator(".space-y-2 .flex.justify-between.items-center.text-sm")
      .filter({ hasText: label });
    await expect(row.locator("span.font-medium")).toHaveText(amount);
  }
);

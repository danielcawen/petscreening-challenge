import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as tipPage from "../../../pages/checkout/tip.js";
import * as orderSummaryPage from "../../../pages/checkout/order-summary.js";
import { computeSubtotal, formatMoney } from "./helpers.js";

When("I select the {int}% tip", async function (percent) {
  await tipPage.selectTipPreset(this.page, percent);
});

When("I select no tip", async function () {
  await tipPage.selectNoTip(this.page);
});

When("I select a custom tip", async function () {
  await tipPage.selectCustomTip(this.page);
});

When("I enter a custom tip amount of {string}", async function (amount) {
  await tipPage.enterCustomTipAmount(this.page, amount);
});

Then("the {int}% tip button should be active", async function (percent) {
  const bg = await tipPage.getTipPresetBackground(this.page, percent);
  expect(bg).toBe("var(--action)");
});

Then("the {int}% tip button should be inactive", async function (percent) {
  const bg = await tipPage.getTipPresetBackground(this.page, percent);
  expect(bg).toBe("var(--bg-raised)");
});

Then("the no tip button should be active", async function () {
  const bg = await tipPage.getNoTipBackground(this.page);
  expect(bg).toBe("var(--action)");
});

Then("I should see a tip hint of {string}", async function (hint) {
  const text = await tipPage.getTipHintText(this.page);
  expect(text.trim()).toBe(hint);
});

Then("I should see the correct {int}% tip hint", async function (percent) {
  const tip = computeSubtotal(this.cartItems) * (percent / 100);
  const text = await tipPage.getTipHintText(this.page);
  expect(text.trim()).toBe(`${formatMoney(tip)} tip`);
});

Then("the tip in the Order Summary should reflect {int}%", async function (percent) {
  const tip = computeSubtotal(this.cartItems) * (percent / 100);
  const text = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Tip");
  expect(text.trim()).toBe(formatMoney(tip));
});

Then("the Order Summary grand total should reflect a {int}% tip", async function (percent) {
  const subtotal = computeSubtotal(this.cartItems);
  const tip = subtotal * (percent / 100);
  const deliveryText = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Delivery");
  const delivery = parseFloat(deliveryText.replace("$", ""));
  const text = await orderSummaryPage.getGrandTotal(this.page);
  expect(text.trim()).toBe(formatMoney(subtotal + delivery + tip));
});

Then(
  "the Order Summary grand total should reflect a {string} custom tip",
  async function (customTip) {
    const subtotal = computeSubtotal(this.cartItems);
    const tip = parseFloat(customTip);
    const deliveryText = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Delivery");
    const delivery = parseFloat(deliveryText.replace("$", ""));
    const text = await orderSummaryPage.getGrandTotal(this.page);
    expect(text.trim()).toBe(formatMoney(subtotal + delivery + tip));
  }
);

Then("the tip in the Order Summary should be {string}", async function (amount) {
  const text = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Tip");
  expect(text.trim()).toBe(amount);
});

Then("the Order Summary should not show a tip line", async function () {
  const row = orderSummaryPage
    .getOrderSummaryCard(this.page)
    .locator(".space-y-2 .flex.justify-between.items-center.text-sm")
    .filter({ hasText: "Tip" });
  await expect(row).not.toBeVisible();
});

Then("the custom tip input should be visible", async function () {
  await expect(this.page.getByPlaceholder("0.00")).toBeVisible();
});

Then("I should see a validation error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as cartPage from "../../../pages/checkout/cart.js";
import * as deliveryLocationPage from "../../../pages/checkout/delivery-location.js";
import * as deliveryDateTimePage from "../../../pages/checkout/delivery-date-time.js";
import * as weatherPage from "../../../pages/checkout/weather.js";
import * as deliveryInstructionsPage from "../../../pages/checkout/delivery-instructions.js";
import * as orderSummaryPage from "../../../pages/checkout/order-summary.js";
import * as promoCodePage from "../../../pages/checkout/promo-code.js";
import * as tipPage from "../../../pages/checkout/tip.js";
import * as paymentPage from "../../../pages/checkout/payment.js";
import { FRONTEND_URL } from "../../../support/env.js";

// ---------------------------------------------------------------------------
// Billing helpers — compute expected amounts from cart state rather than
// hardcoding dollar values that break when product prices change.
// ---------------------------------------------------------------------------

function computeSubtotal(cartItems) {
  return cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Known product data — matches data/db.json exactly
// ---------------------------------------------------------------------------
const PRODUCT_CATALOG = {
  "Signature Cherry Lattice": {
    id: "cherry-lattice",
    name: "Signature Cherry Lattice",
    description: "Tart Montmorency cherries in a buttery lattice crust, baked fresh this morning.",
    price: 32,
    image: "/icon-pie.svg",
    category: "fruit",
    available: true,
    popularity: 95,
  },
  "Apple Crumble": {
    id: "apple-crumble",
    name: "Apple Crumble",
    description: "Honeycrisp apples with cinnamon and a brown sugar oat crumble topping.",
    price: 28,
    image: "/icon-pie.svg",
    category: "fruit",
    available: true,
    popularity: 88,
  },
};

// ---------------------------------------------------------------------------
// Date helpers — use local time to avoid UTC offset issues with date inputs
// ---------------------------------------------------------------------------
function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

function getNextWeekday() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return formatLocalDate(d);
}

function getNextSaturday() {
  const d = new Date();
  const daysUntilSat = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat);
  return formatLocalDate(d);
}

// ---------------------------------------------------------------------------
// Cart setup — injects cart state via sessionStorage so tests skip the catalog
// ---------------------------------------------------------------------------

Given("I have {string} in my cart with quantity {int}", async function (productName, qty) {
  const product = PRODUCT_CATALOG[productName];
  this.cartItems = [{ product, quantity: qty }];
  await this.page.goto(FRONTEND_URL);
  await cartPage.setCartInSession(this.page, this.cartItems);
});

Given("I also have {string} in my cart with quantity {int}", async function (productName, qty) {
  const product = PRODUCT_CATALOG[productName];
  this.cartItems = [...(this.cartItems ?? []), { product, quantity: qty }];
  await cartPage.setCartInSession(this.page, this.cartItems);
});

Given("I am on the checkout page", async function () {
  await this.page.goto(`${FRONTEND_URL}/checkout`);
  await this.page.locator("text=Your Order").waitFor({ timeout: 10_000 });
});

// ---------------------------------------------------------------------------
// Your Order — subtotal math
// ---------------------------------------------------------------------------

When("I increment the quantity of {string}", async function (productName) {
  await cartPage.incrementQuantity(this.page, productName);
});

When("I decrement the quantity of {string}", async function (productName) {
  await cartPage.decrementQuantity(this.page, productName);
});

When("I remove {string} from the cart", async function (productName) {
  await cartPage.removeItem(this.page, productName);
});

Then("the line totals and subtotal should reflect correct math", async function () {
  await cartPage.verifySubtotalMath(this.page, this.cartItems);
});

Then("I should be redirected to the catalog page", async function () {
  await this.page.waitForURL(`${FRONTEND_URL}/`, { timeout: 8_000 });
});

// ---------------------------------------------------------------------------
// Delivery location
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Delivery date and time
// ---------------------------------------------------------------------------

When("I set the delivery date to yesterday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getYesterday());
});

When("I set the delivery date to next weekday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getNextWeekday());
});

When("I set the delivery date to next Saturday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getNextSaturday());
});

When("I set the delivery time to {string}", async function (time) {
  await deliveryDateTimePage.setDeliveryTime(this.page, time);
});

Then("I should see the date error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see the date message {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see the time error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see a {string} badge", async function (text) {
  await expect(this.page.getByText(text, { exact: false })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Weather simulation
// ---------------------------------------------------------------------------

When("I select the {string} weather", async function (weather) {
  await weatherPage.selectWeather(this.page, weather);
});

Then("the {string} weather option should be active", async function (weather) {
  const bg = await weatherPage.getWeatherBackground(this.page, weather);
  // Active Clear uses var(--action); active Raining uses var(--sky-500)
  expect(bg).not.toBe("var(--bg-raised)");
});

Then("the {string} weather option should be inactive", async function (weather) {
  const bg = await weatherPage.getWeatherBackground(this.page, weather);
  expect(bg).toBe("var(--bg-raised)");
});

// ---------------------------------------------------------------------------
// Delivery instructions
// ---------------------------------------------------------------------------

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
  // Generate a realistic-looking instruction string well under 200 chars
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

// ---------------------------------------------------------------------------
// Order Summary
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Promo code
// ---------------------------------------------------------------------------

When("I apply the promo code {string}", async function (code) {
  await promoCodePage.applyPromoCode(this.page, code);
});

When("I remove the applied promo code", async function () {
  await promoCodePage.removeAppliedPromo(this.page);
});

Then("I should see the promo error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("the promo code {string} should appear as applied", async function (code) {
  await expect(this.page.getByText(code)).toBeVisible();
});

// ---------------------------------------------------------------------------
// Tip selector
// ---------------------------------------------------------------------------

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

Then("the Order Summary grand total should reflect a {string} custom tip", async function (customTip) {
  const subtotal = computeSubtotal(this.cartItems);
  const tip = parseFloat(customTip);
  const deliveryText = await orderSummaryPage.getOrderSummaryRowAmount(this.page, "Delivery");
  const delivery = parseFloat(deliveryText.replace("$", ""));
  const text = await orderSummaryPage.getGrandTotal(this.page);
  expect(text.trim()).toBe(formatMoney(subtotal + delivery + tip));
});

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

// ---------------------------------------------------------------------------
// Payment form
// ---------------------------------------------------------------------------

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

// Faker-based payment steps — generate random data each run so tests never
// rely on a hardcoded card number or expiry date that could become stale.

When("I fill in a randomly generated card number", async function () {
  // Generate a realistic Visa number (includes dashes, e.g. "4882-6649-9900-7324")
  const rawCard = faker.finance.creditCardNumber({ issuer: "visa" });
  // Store only the digits — the Then step uses these to compute the expected formatted value
  this.cardDigits = rawCard.replace(/\D/g, "").slice(0, 16);
  // Fill with the raw value (dashes included) so the formatter's strip-non-digits path is exercised too
  await this.page.getByPlaceholder("4242 4242 4242 4242").fill(rawCard);
});

Then("the card number should be formatted in groups of four digits", async function () {
  // Mirror the app's formatCardNumber logic to compute the expected value
  const expected = this.cardDigits.replace(/(\d{4})(?=\d)/g, "$1 ");
  const value = await paymentPage.getCardNumberValue(this.page);
  expect(value).toBe(expected);
});

When("I fill in a randomly generated expiry date", async function () {
  // Always pick a future year so the date never "expires" and breaks the test
  const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
  const year = String(faker.number.int({ min: 26, max: 35 })).padStart(2, "0");
  this.expiryRaw = `${month}${year}`; // e.g. "0831"
  await this.page.getByPlaceholder("MM / YY").fill(this.expiryRaw);
});

Then("the expiry should be formatted correctly", async function () {
  // Mirror formatExpiry: "MMYY" → "MM / YY"
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

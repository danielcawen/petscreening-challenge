import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as paymentPage from "../../../pages/checkout/payment.js";
import * as placeOrderPage from "../../../pages/checkout/place-order.js";
import * as confirmationPage from "../../../pages/checkout/confirmation.js";
import { computeSubtotal, formatMoney } from "./helpers.js";
import { FRONTEND_URL } from "../../../support/env.js";

When("I fill in the payment form with valid details", async function () {
  const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const rawCard = faker.finance.creditCardNumber({ issuer: "visa" });
  const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
  const year = String(faker.number.int({ min: 26, max: 35 })).padStart(2, "0");
  const cvv = faker.string.numeric(3);
  await paymentPage.fillPaymentForm(this.page, {
    name,
    card: rawCard,
    expiry: `${month}${year}`,
    cvv,
  });
});

When("I place the order", async function () {
  await placeOrderPage.clickPlaceOrder(this.page);
  await this.page.waitForURL(`${FRONTEND_URL}/confirmation`, { timeout: 15_000 });
  await confirmationPage.verifyOnConfirmationPage(this.page);
});

Then("the Place Order button should be disabled", async function () {
  await placeOrderPage.verifyPlaceOrderDisabled(this.page);
});

Then("the Place Order button should be enabled", async function () {
  await placeOrderPage.verifyPlaceOrderEnabled(this.page);
});

Then("I should be on the confirmation page", async function () {
  await this.page.waitForURL(`${FRONTEND_URL}/confirmation`, { timeout: 10_000 });
  await confirmationPage.verifyOnConfirmationPage(this.page);
});

Then("the confirmation should show a valid order ID", async function () {
  const orderId = await confirmationPage.getOrderId(this.page);
  // TODO: understand what is the expected order id, all the previous
  // order ids are PIE-{6 alphanumeric} and the new ones are:
  // PITS-{8 digits}-{4 alphanumeric}
  // The new ones are not displayed in the order history
  expect(orderId.trim()).toMatch(/^PITS-\d{8}-[A-Z0-9]{4}$/);
});

Then("the confirmation should mention {string}", async function (productName) {
  await expect(
    confirmationPage.getBillingCard(this.page).getByText(productName, { exact: false })
  ).toBeVisible();
});

Then("the confirmation grand total should be correct", async function () {
  const subtotal = computeSubtotal(this.cartItems);
  const deliveryText = await confirmationPage.getDeliveryAmount(this.page);
  const delivery = parseFloat(deliveryText.replace("$", ""));
  const grandTotalText = await confirmationPage.getGrandTotal(this.page);
  expect(grandTotalText.trim()).toBe(formatMoney(subtotal + delivery));
});

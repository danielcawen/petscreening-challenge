import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as loginPage from "../../../pages/login.js";
import * as cartPage from "../../../pages/checkout/cart.js";
import * as deliveryLocationPage from "../../../pages/checkout/delivery-location.js";
import * as tipPage from "../../../pages/checkout/tip.js";
import * as paymentPage from "../../../pages/checkout/payment.js";
import * as confirmationPage from "../../../pages/checkout/confirmation.js";
import * as orderHistoryPage from "../../../pages/account/order-history.js";
import { navigateTo } from "../../../support/helpers.js";
import { FRONTEND_URL } from "../../../support/env.js";

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
};

Given(
  "I am at the checkout with a logged in user and an item in the cart",
  async function () {
    await navigateTo(this.page, `${FRONTEND_URL}/login`);
    await loginPage.fillEmail(this.page, "bronze@test.com");
    await loginPage.fillPassword(this.page, "password123");
    await loginPage.submit(this.page);
    await this.page.waitForURL(/\/account/, { timeout: 8_000 });

    this.cartItems = [{ product: PRODUCT_CATALOG["Signature Cherry Lattice"], quantity: 1 }];
    await this.page.addInitScript((data) => {
      sessionStorage.setItem("pits_cart", JSON.stringify(data));
    }, { items: this.cartItems });
    await this.page.goto(FRONTEND_URL);
    await cartPage.clickCheckoutLink(this.page);
    await cartPage.waitForCheckoutReady(this.page);

    await deliveryLocationPage.selectLocationMode(this.page, "Manual");
    await deliveryLocationPage.enterManualDistance(this.page, "5");
    await tipPage.selectNoTip(this.page);

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
  }
);

When("I search for my order", async function () {
  await this.page.waitForURL(`${FRONTEND_URL}/confirmation`, { timeout: 10_000 });
  await confirmationPage.verifyOnConfirmationPage(this.page);
  // Save the order id and the total amount
  this.orderId = (await confirmationPage.getOrderId(this.page)).trim();
  this.grandTotal = (await confirmationPage.getGrandTotal(this.page)).trim();
  // Go to the orders page
  await this.page.goto(`${FRONTEND_URL}/account/orders`);
  await orderHistoryPage.verifyOnOrderHistoryPage(this.page);
  // Filter by my order
  await orderHistoryPage.openFilters(this.page);
  await orderHistoryPage.searchOrderById(this.page, this.orderId);
});

Then("my order is listed and the information displayed is correct", async function () {
  await expect(this.page.getByText("No orders found", { exact: true })).not.toBeVisible();
  await orderHistoryPage.verifyOrderCardId(this.page, this.orderId); // TODO: by id or by date?
  // Verify the card container
  const total = await orderHistoryPage.getOrderCardTotal(this.page, this.orderId);
  expect(total.trim()).toBe(this.grandTotal);
  // Verify the card itself
  await orderHistoryPage.expandOrderCard(this.page, this.orderId);
  await orderHistoryPage.verifyExpandedItemVisible(this.page, this.orderId, PRODUCT_CATALOG["Signature Cherry Lattice"].name);
});




// Then("I save the order ID and grand total from the confirmation page", async function () {
//   this.orderId = (await confirmationPage.getOrderId(this.page)).trim();
//   this.grandTotal = (await confirmationPage.getGrandTotal(this.page)).trim();
// });

// When("I navigate to the order history page", async function () {
//   await this.page.goto(`${FRONTEND_URL}/account/orders`);
//   await orderHistoryPage.verifyOnOrderHistoryPage(this.page);
// });

// When("I expand the order history filters", async function () {
//   await orderHistoryPage.openFilters(this.page);
// });

// When("I search for the order by its ID", async function () {
//   await orderHistoryPage.searchOrderById(this.page, this.orderId);
// });

// Then('the {string} message should not be displayed', async function (message) {
//   await expect(this.page.getByText(message, { exact: true })).not.toBeVisible();
// });

// Then("the order card should show the correct order ID", async function () {
//   await orderHistoryPage.verifyOrderCardId(this.page, this.orderId);
// });

// Then("the order card should show the correct grand total", async function () {
//   const total = await orderHistoryPage.getOrderCardTotal(this.page, this.orderId);
//   expect(total.trim()).toBe(this.grandTotal);
// });

// When("I expand the order card", async function () {
//   await orderHistoryPage.expandOrderCard(this.page, this.orderId);
// });

// Then("the order items should include {string}", async function (itemText) {
//   await orderHistoryPage.verifyExpandedItemVisible(this.page, this.orderId, itemText);
// });

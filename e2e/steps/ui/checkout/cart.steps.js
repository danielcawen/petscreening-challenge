import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as cartPage from "../../../pages/checkout/cart.js";
import * as catalogPage from "../../../pages/catalog.js";
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

Given("I have {string} in my cart with quantity {int}", async function (productName, qty) {
  const product = PRODUCT_CATALOG[productName];
  this.cartItems = [{ product, quantity: qty }];
});

Given("I also have {string} in my cart with quantity {int}", async function (productName, qty) {
  const product = PRODUCT_CATALOG[productName];
  this.cartItems = [...(this.cartItems ?? []), { product, quantity: qty }];
});

Given("I am on the checkout page", async function () {
  // Inject cart into sessionStorage before React runs so CartProvider hydrates with items.
  // Then use the header's cart link (client-side nav) so CartProvider stays mounted and
  // CheckoutPage never sees an empty cart — avoiding the empty-cart redirect race condition.
  await this.page.addInitScript((data) => {
    sessionStorage.setItem("pits_cart", JSON.stringify(data));
  }, { items: this.cartItems });
  await this.page.goto(FRONTEND_URL);
  await cartPage.clickCheckoutLink(this.page);
  await cartPage.waitForCheckoutReady(this.page);
});

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
  await catalogPage.verifyOnCatalogPage(this.page);
});

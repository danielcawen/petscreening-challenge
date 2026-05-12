import { Given, When, Then } from "@cucumber/cucumber";
import * as catalogPage from "../../../pages/catalog.js";
import { FRONTEND_URL } from "../../../support/env.js";
import { navigateTo } from "../../../support/helpers.js";

Given("I am on the catalog page", async function () {
  await navigateTo(this.page, FRONTEND_URL);
});

When("I add {string} to the cart", async function (productName) {
  await catalogPage.addToCart(this.page, productName);
});

When("I navigate to page {int}", async function (pageNumber) {
  await catalogPage.goToPage(this.page, pageNumber);
});

Then("the header cart count should be {string}", async function (count) {
  await catalogPage.verifyHeaderCartCount(this.page, count);
});

Then("the bottom bar should show {string}", async function (text) {
  await catalogPage.verifyBottomBarText(this.page, text);
});

Then("the {string} item should show {string}", async function (productName, _label) {
  await catalogPage.verifyOutOfStock(this.page, productName);
});

Then("the {string} add button should be disabled", async function (productName) {
  await catalogPage.verifyAddButtonDisabled(this.page, productName);
});

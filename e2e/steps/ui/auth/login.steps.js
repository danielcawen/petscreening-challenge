import { Given, When, Then } from "@cucumber/cucumber";
import * as loginPage from "../../../pages/login.js";
import { FRONTEND_URL } from "../../../support/env.js";
import { navigateTo } from "../../../support/helpers.js";

Given("I am on the login page", async function () {
  await navigateTo(this.page, `${FRONTEND_URL}/login`);
});

When("I enter email {string} and password {string}", async function (email, password) {
  await loginPage.fillEmail(this.page, email);
  await loginPage.fillPassword(this.page, password);
});

When("I submit the login form", async function () {
  await loginPage.submit(this.page);
});

Then("I should be redirected to the account page", async function () {
  await loginPage.verifyRedirectedToAccount(this.page);
});

Then("I should see an error message {string}", async function (message) {
  await loginPage.verifyErrorMessage(this.page, message);
});

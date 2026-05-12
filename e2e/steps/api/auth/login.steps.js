import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { postAuth } from "../../../api/auth.js";

When("I send a login request with email {string} and password {string}", async function (email, password) {
  this.response = await postAuth(this.apiContext, { email, password });
  this.responseBody = await this.response.json();
});

When("I send a login request with only password {string}", async function (password) {
  this.response = await postAuth(this.apiContext, { password });
  this.responseBody = await this.response.json();
});

When("I send a login request with only email {string}", async function (email) {
  this.response = await postAuth(this.apiContext, { email });
  this.responseBody = await this.response.json();
});

Then("the response status should be {int}", async function (status) {
  expect(this.response.status()).toBe(status);
});

Then("the response body should include success equal to true", async function () {
  expect(this.responseBody.success).toBe(true);
});

Then("the response user should not include a password field", async function () {
  expect(this.responseBody.user).toBeDefined();
  expect(this.responseBody.user.password).toBeUndefined();
});

Then("the response error should be {string}", async function (errorText) {
  expect(this.responseBody.error).toBe(errorText);
});

Then("the response error should contain {string}", async function (errorText) {
  expect(this.responseBody.error).toContain(errorText);
});

import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as promoCodePage from "../../../pages/checkout/promo-code.js";

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

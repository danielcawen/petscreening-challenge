import { expect } from "@playwright/test";

const placeOrderButton = 'button:has-text("PLACE ORDER")';

export async function clickPlaceOrder(page) {
  await page.locator(placeOrderButton).click();
}

export async function verifyPlaceOrderDisabled(page) {
  await expect(page.locator(placeOrderButton)).toBeDisabled();
}

export async function verifyPlaceOrderEnabled(page) {
  await expect(page.locator(placeOrderButton)).toBeEnabled();
}

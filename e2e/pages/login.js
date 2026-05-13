import { expect } from "@playwright/test";

const emailInput = "#email";
const passwordInput = "#password";
const submitButton = "button[type='submit']";
const errorMessage = ".p-3.rounded-lg.text-sm";

export async function fillEmail(page, email) {
  await page.fill(emailInput, email);
}

export async function fillPassword(page, password) {
  await page.fill(passwordInput, password);
}

export async function submit(page) {
  await page.click(submitButton);
}

export async function verifyRedirectedToAccount(page) {
  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByRole("heading", { name: "My Profile" })).toBeVisible();
  await expect(page.getByText("Account Details")).toBeVisible();
}

export async function verifyErrorMessage(page, text) {
  await expect(page.locator(errorMessage)).toContainText(text);
}

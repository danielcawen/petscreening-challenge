import { expect } from "@playwright/test";

const deliveryTextarea = "textarea";
const charCounterPattern = /\d+\/200 characters/;
const charLimitWarning = "Instructions too long";

export async function enterDeliveryInstructions(page, text) {
  await page.locator(deliveryTextarea).fill(text);
}

export async function getCharCounterText(page) {
  return page.getByText(charCounterPattern).textContent();
}

export async function verifyCharLimitWarningVisible(page) {
  await expect(page.getByText(charLimitWarning, { exact: false })).toBeVisible();
}

export async function verifyNoCharLimitWarning(page) {
  await expect(page.getByText(charLimitWarning, { exact: false })).not.toBeVisible();
}

export async function getCharCounterCount(page) {
  const text = await getCharCounterText(page);
  return parseInt(text.split("/")[0], 10);
}

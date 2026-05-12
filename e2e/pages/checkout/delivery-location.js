import { expect } from "@playwright/test";

const addressInputPlaceholder = "Enter your address";
const manualDistancePlaceholder = "e.g. 10.5";
const distanceSlider = "input[type='range']";

export async function selectLocationMode(page, mode) {
  // Mode buttons are unique to the delivery location section
  await page.getByRole("button", { name: mode }).click();
}

export async function getLocationModeBackground(page, mode) {
  return page
    .getByRole("button", { name: mode })
    .evaluate((el) => el.style.background);
}

export async function verifyAddressInputVisible(page) {
  await expect(page.getByPlaceholder(addressInputPlaceholder)).toBeVisible();
}

export async function verifyLocationButtonVisible(page, label) {
  await expect(page.getByRole("button", { name: label })).toBeVisible();
}

export async function verifyDistanceInputVisible(page) {
  await expect(page.getByPlaceholder(manualDistancePlaceholder)).toBeVisible();
}

export async function verifyDistanceSliderVisible(page) {
  await expect(page.locator(distanceSlider)).toBeVisible();
}

export async function enterManualDistance(page, distance) {
  const input = page.getByPlaceholder(manualDistancePlaceholder);
  await input.fill(distance);
  await input.press("Tab"); // triggers onBlur → sets touched
}

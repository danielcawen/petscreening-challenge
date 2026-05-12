const manualDistancePlaceholder = "e.g. 10.5";

export async function selectLocationMode(page, mode) {
  // Mode buttons are unique to the delivery location section
  await page.getByRole("button", { name: mode }).click();
}

export async function getLocationModeBackground(page, mode) {
  return page
    .getByRole("button", { name: mode })
    .evaluate((el) => el.style.background);
}

export async function enterManualDistance(page, distance) {
  const input = page.getByPlaceholder(manualDistancePlaceholder);
  await input.fill(distance);
  await input.press("Tab"); // triggers onBlur → sets touched
}

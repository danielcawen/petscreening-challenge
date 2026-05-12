import { expect } from "@playwright/test";

const sectionContainer = "div.space-y-3";
const customTipPlaceholder = "0.00";
const tipHint = "p.text-xs";

function tipSection(page) {
  return page.locator(sectionContainer).filter({ hasText: "Add a tip for your drone pilot" });
}

export async function selectTipPreset(page, percent) {
  await tipSection(page).getByRole("button", { name: `${percent}%` }).click();
}

export async function selectNoTip(page) {
  await tipSection(page).getByRole("button", { name: "No tip" }).click();
}

export async function selectCustomTip(page) {
  await tipSection(page).getByRole("button", { name: "Custom" }).click();
}

export async function enterCustomTipAmount(page, amount) {
  const input = page.getByPlaceholder(customTipPlaceholder);
  await input.fill(amount);
  await input.press("Tab"); // triggers onBlur → validates and shows error if invalid
}

export async function getTipPresetBackground(page, percent) {
  return tipSection(page)
    .getByRole("button", { name: `${percent}%` })
    .evaluate((el) => el.style.background);
}

export async function getNoTipBackground(page) {
  return tipSection(page)
    .getByRole("button", { name: "No tip" })
    .evaluate((el) => el.style.background);
}

export async function verifyCustomTipInputVisible(page) {
  await expect(page.getByPlaceholder(customTipPlaceholder)).toBeVisible();
}

// Returns the hint text shown below preset buttons, e.g. "$4.80 tip".
export async function getTipHintText(page) {
  return tipSection(page).locator(tipHint).textContent();
}

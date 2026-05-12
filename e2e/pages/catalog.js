import { expect } from "@playwright/test";

const headerCartBadge = 'a[href="/checkout"] span';
const bottomBar = ".sticky.bottom-0"; // TODO: verify selector
const productCard = ".rounded-2xl"; // TODO: verify selector
const productCardHeading = "h3";
const paginationButton = (n) => `button[aria-label="Page ${n}"]`;

export async function addToCart(page, productName) {
  const card = page
    .locator(productCard)
    .filter({ has: page.locator(productCardHeading, { hasText: productName }) });
  await card.getByRole("button", { name: "Add" }).click();
}

export async function goToPage(page, pageNumber) {
  await page.click(paginationButton(pageNumber));
}

export async function verifyHeaderCartCount(page, count) {
  await expect(page.locator(headerCartBadge)).toHaveText(count);
}

export async function verifyBottomBarText(page, text) {
  await expect(page.locator(bottomBar)).toContainText(text);
}

export async function verifyOutOfStock(page, productName) {
  const card = page
    .locator(productCard)
    .filter({ has: page.locator(productCardHeading, { hasText: productName }) });
  await expect(card.getByText("Out of Stock")).toBeVisible();
}

export async function verifyAddButtonDisabled(page, productName) {
  const card = page
    .locator(productCard)
    .filter({ has: page.locator(productCardHeading, { hasText: productName }) });
  await expect(card.getByRole("button", { name: "Add" })).toBeDisabled();
}

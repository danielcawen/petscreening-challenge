import { expect } from "@playwright/test";

const pageHeading = "h1";
const pageHeadingText = "Order History";
const filtersButton = 'button:has-text("Filters")';
const searchIdInput = 'input[placeholder="PIE-XXXXXX"]';
const noOrdersFoundMessage = "No orders found";
const orderRowContainer = ".rounded-xl.overflow-hidden";
const orderIdCell = "p.font-mono";
const orderSummaryButton = "button";
const orderTotalCell = "span.font-medium";

export async function verifyOnOrderHistoryPage(page) {
  await expect(page.locator(pageHeading)).toHaveText(pageHeadingText);
}

export async function openFilters(page) {
  await page.locator(filtersButton).click();
}

export async function searchOrderById(page, orderId) {
  await page.locator(searchIdInput).fill(orderId);
}

export async function verifyNoOrdersFoundNotVisible(page) {
  await expect(page.getByText(noOrdersFoundMessage, { exact: true })).not.toBeVisible();
}

function getOrderRow(page, orderId) {
  return page
    .locator(orderRowContainer)
    .filter({ has: page.locator(orderIdCell, { hasText: orderId }) });
}

export async function verifyOrderCardId(page, orderId) {
  await expect(getOrderRow(page, orderId).locator(orderIdCell)).toHaveText(orderId);
}

export async function getOrderCardTotal(page, orderId) {
  return getOrderRow(page, orderId)
    .locator(orderSummaryButton)
    .locator(orderTotalCell)
    .textContent();
}

export async function expandOrderCard(page, orderId) {
  await getOrderRow(page, orderId).locator(orderSummaryButton).click();
}

export async function verifyExpandedItemVisible(page, orderId, itemText) {
  await expect(getOrderRow(page, orderId).getByText(itemText, { exact: false })).toBeVisible();
}

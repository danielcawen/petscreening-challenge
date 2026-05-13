import { expect } from "@playwright/test";

const confirmationHeading = "h1";
const confirmationHeadingText = "Your pie is on its way!";
const orderIdLocator = "span.font-mono";
const billingCard = ".rounded-2xl.p-6.space-y-4";
const billingRow = ".space-y-2 .flex.justify-between.items-center.text-sm";
const grandTotalRow = ".flex.justify-between.items-baseline";

export async function verifyOnConfirmationPage(page) {
  await expect(page.locator(confirmationHeading)).toHaveText(confirmationHeadingText);
}

export async function getOrderId(page) {
  return page.locator(orderIdLocator).textContent();
}

export function getBillingCard(page) {
  return page.locator(billingCard).filter({ hasText: "Order Summary" });
}

export async function getDeliveryAmount(page) {
  const row = getBillingCard(page)
    .locator(billingRow)
    .filter({ hasText: /delivery/i });
  return row.locator("span.font-medium").textContent();
}

export async function getGrandTotal(page) {
  return getBillingCard(page).locator(grandTotalRow).locator("span").last().textContent();
}

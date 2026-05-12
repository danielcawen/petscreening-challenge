const summaryCard = ".rounded-2xl.p-6.space-y-4";
// Line item rows (items, delivery, promo, tip) — excludes the grand-total row
const summaryRow = ".space-y-2 .flex.justify-between.items-center.text-sm";
const grandTotalSpan = ".flex.justify-between.items-baseline span";

export function getOrderSummaryCard(page) {
  return page.locator(summaryCard).filter({ hasText: "Order Summary" });
}

// Returns the span.font-medium amount text for the first row whose label contains labelContains.
export async function getOrderSummaryRowAmount(page, labelContains) {
  const row = getOrderSummaryCard(page)
    .locator(summaryRow)
    .filter({ hasText: labelContains });
  return row.locator("span.font-medium").textContent();
}

// Returns the grand total text (e.g. "$42.00") from the bottom of the Order Summary card.
export async function getGrandTotal(page) {
  return getOrderSummaryCard(page).locator(grandTotalSpan).last().textContent();
}

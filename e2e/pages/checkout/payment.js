const summaryCard = ".rounded-2xl.p-6.space-y-4";
const cardholderNamePlaceholder = "J. Doe";
const cardNumberPlaceholder = "4242 4242 4242 4242";
const expiryPlaceholder = "MM / YY";
const cvvPlaceholder = "123";

export function getPaymentCard(page) {
  // Both Payment and Order Summary cards share the same CSS classes; filter by heading text.
  return page.locator(summaryCard).filter({ hasText: "Payment" });
}

export async function fillPaymentForm(page, { name, card, expiry, cvv } = {}) {
  if (name !== undefined) await page.getByPlaceholder(cardholderNamePlaceholder).fill(name);
  if (card !== undefined) await page.getByPlaceholder(cardNumberPlaceholder).fill(card);
  if (expiry !== undefined) await page.getByPlaceholder(expiryPlaceholder).fill(expiry);
  if (cvv !== undefined) await page.getByPlaceholder(cvvPlaceholder).fill(cvv);
}

export async function getCardNumberValue(page) {
  return page.getByPlaceholder(cardNumberPlaceholder).inputValue();
}

export async function getExpiryValue(page) {
  return page.getByPlaceholder(expiryPlaceholder).inputValue();
}

export async function getCvvValue(page) {
  return page.getByPlaceholder(cvvPlaceholder).inputValue();
}

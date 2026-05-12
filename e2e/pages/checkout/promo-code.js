const sectionContainer = "div.space-y-3";
const promoCodePlaceholder = "Enter code";

export async function applyPromoCode(page, code) {
  await page.getByPlaceholder(promoCodePlaceholder).fill(code);
  await page.getByRole("button", { name: "Apply" }).click();
}

export async function removeAppliedPromo(page) {
  // The Remove button inside the applied-promo card — scope to avoid cart item Remove buttons
  const promoSection = page.locator(sectionContainer).filter({ hasText: "Promo code" });
  await promoSection.getByRole("button", { name: "Remove" }).click();
}

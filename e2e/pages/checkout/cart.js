import { expect } from "@playwright/test";

const cartSection = ".rounded-2xl.p-5";
const itemRow = ".space-y-3 .flex.justify-between.items-start";
const itemNameTag = "p";
const itemLineTotalTag = "p.font-medium";
const qtyDisplay = ".flex.items-center.gap-2.mt-1 span";
const qtyButton = ".flex.items-center.gap-2.mt-1 button";
const subtotalAmount = ".pt-3.mt-3 span.font-medium";
const removeItemTag = "button";

export async function setCartInSession(page, items) {
  await page.evaluate(
    (data) => sessionStorage.setItem("pits_cart", JSON.stringify(data)),
    { items }
  );
}

// Reads all item rows, verifies (unit_price × displayed_qty === displayed_line_total)
// for each item, then verifies subtotal === sum of all line totals.
export async function verifySubtotalMath(page, cartItems) {
  const section = page.locator(cartSection);
  let sumOfLineTotals = 0;

  for (const cartItem of cartItems) {
    const row = section
      .locator(itemRow)
      .filter({ has: page.locator(itemNameTag, { hasText: cartItem.product.name }) });

    const qtyText = await row.locator(qtyDisplay).textContent();
    const displayedQty = parseInt(qtyText.trim(), 10);

    // The line total is the rightmost p.font-medium in the row (product name is the first one)
    const pTexts = await row.locator(itemLineTotalTag).allTextContents();
    const lineTotal = parseFloat(pTexts[pTexts.length - 1].replace("$", ""));

    expect(lineTotal).toBeCloseTo(cartItem.product.price * displayedQty, 2);
    sumOfLineTotals += lineTotal;
  }

  const subtotalText = await section.locator(subtotalAmount).last().textContent();
  expect(parseFloat(subtotalText.replace("$", ""))).toBeCloseTo(sumOfLineTotals, 2);
}

function getItemRow(page, productName) {
  return page
    .locator(cartSection)
    .locator(itemRow)
    .filter({ has: page.locator(itemNameTag, { hasText: productName }) });
}

export async function incrementQuantity(page, productName) {
  // Quantity controls: [button−, span, button+, buttonRemove] — plus is index 1
  await getItemRow(page, productName).locator(qtyButton).nth(1).click();
}

export async function decrementQuantity(page, productName) {
  await getItemRow(page, productName).locator(qtyButton).first().click();
}

export async function removeItem(page, productName) {
  await getItemRow(page, productName)
    .locator(removeItemTag)
    .filter({ hasText: "Remove" })
    .click();
}

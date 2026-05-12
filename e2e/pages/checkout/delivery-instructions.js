const deliveryTextarea = "textarea";
const charCounterPattern = /\d+\/200 characters/;

export async function enterDeliveryInstructions(page, text) {
  await page.locator(deliveryTextarea).fill(text);
}

export async function getCharCounterText(page) {
  return page.getByText(charCounterPattern).textContent();
}

export async function getCharCounterCount(page) {
  const text = await getCharCounterText(page);
  return parseInt(text.split("/")[0], 10);
}

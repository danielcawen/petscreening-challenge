const dateInput = "input[type='date']";
const timeInput = "input[type='time']";

export async function setDeliveryDate(page, dateString) {
  await page.locator(dateInput).fill(dateString);
  await page.locator(dateInput).press("Tab"); // triggers onBlur → sets touched
}

export async function setDeliveryTime(page, timeString) {
  await page.locator(timeInput).fill(timeString);
  await page.locator(timeInput).press("Tab"); // triggers onBlur → sets touched
}

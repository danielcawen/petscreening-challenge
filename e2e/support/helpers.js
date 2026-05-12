export async function navigateTo(page, url) {
  await page.goto(url);
}

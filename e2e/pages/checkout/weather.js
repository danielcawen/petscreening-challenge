const sectionContainer = "div.space-y-3";

export const INACTIVE_BACKGROUND = "var(--bg-raised)";

function weatherSection(page) {
  // Scope to the div containing the "Weather simulation" label to avoid false matches
  return page.locator(sectionContainer).filter({ hasText: "Weather simulation" });
}

export async function selectWeather(page, weather) {
  await weatherSection(page).locator("button").filter({ hasText: weather }).click();
}

export async function getWeatherBackground(page, weather) {
  return weatherSection(page)
    .locator("button")
    .filter({ hasText: weather })
    .evaluate((el) => el.style.background);
}

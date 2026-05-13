import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as deliveryDateTimePage from "../../../pages/checkout/delivery-date-time.js";

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
}

function getNextWeekday() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
  return formatLocalDate(date);
}

function getNextSaturday() {
  // The app parses date strings as UTC midnight (known timezone bug in DateTimePicker).
  // UTC Sunday midnight is always Saturday or Sunday in local time, so isWeekend() returns
  // true everywhere regardless of UTC offset.
  const date = new Date();
  const daysUntilSun = (7 - date.getUTCDay()) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + daysUntilSun);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

When("I set the delivery date to yesterday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getYesterday());
});

When("I set the delivery date to next weekday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getNextWeekday());
});

When("I set the delivery date to next Saturday", async function () {
  await deliveryDateTimePage.setDeliveryDate(this.page, getNextSaturday());
});

When("I set the delivery time to {string}", async function (time) {
  await deliveryDateTimePage.setDeliveryTime(this.page, time);
});

Then("I should see the date error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see the date message {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see the time error {string}", async function (message) {
  await expect(this.page.getByText(message, { exact: false })).toBeVisible();
});

Then("I should see a {string} badge", async function (text) {
  await expect(this.page.getByText(text, { exact: false })).toBeVisible();
});

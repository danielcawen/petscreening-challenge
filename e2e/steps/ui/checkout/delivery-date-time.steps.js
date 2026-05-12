import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import * as deliveryDateTimePage from "../../../pages/checkout/delivery-date-time.js";

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

function getNextWeekday() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return formatLocalDate(d);
}

function getNextSaturday() {
  const d = new Date();
  const daysUntilSat = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat);
  return formatLocalDate(d);
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

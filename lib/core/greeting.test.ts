import assert from "node:assert/strict";
import {
  countryDefaultTimezone,
  formatWelcomeMessage,
  getGreetingPeriod,
  getGreetingPeriodForTimezone,
  getLocalHour,
  resolveTimezone,
} from "./greeting";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("getGreetingPeriod uses specified hour bands", () => {
  assert.equal(getGreetingPeriod(5), "morning");
  assert.equal(getGreetingPeriod(10), "morning");
  assert.equal(getGreetingPeriod(11), "afternoon");
  assert.equal(getGreetingPeriod(16), "afternoon");
  assert.equal(getGreetingPeriod(17), "evening");
  assert.equal(getGreetingPeriod(22), "evening");
  assert.equal(getGreetingPeriod(23), "late");
  assert.equal(getGreetingPeriod(4), "late");
});

test("countryDefaultTimezone maps Nordic countries", () => {
  assert.equal(countryDefaultTimezone("NO"), "Europe/Oslo");
  assert.equal(countryDefaultTimezone("se"), "Europe/Stockholm");
  assert.equal(countryDefaultTimezone("DK"), "Europe/Copenhagen");
  assert.equal(countryDefaultTimezone("US"), null);
});

test("resolveTimezone follows priority order", () => {
  assert.equal(
    resolveTimezone({
      userTimezone: "America/New_York",
      customerTimezone: "Europe/Oslo",
      country: "NO",
      browserTimezone: "Europe/London",
    }),
    "America/New_York"
  );

  assert.equal(
    resolveTimezone({
      customerTimezone: "Europe/Stockholm",
      country: "NO",
    }),
    "Europe/Stockholm"
  );

  assert.equal(resolveTimezone({ country: "NO" }), "Europe/Oslo");
  assert.equal(resolveTimezone({ browserTimezone: "Europe/London" }), "Europe/London");
  assert.equal(resolveTimezone({}), "UTC");
});

test("evening in Oslo does not produce morning greeting", () => {
  const labels = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    late: ["Working late? Aipify is still monitoring your business."],
  };

  const eveningOslo = new Date("2026-06-10T18:30:00Z");
  assert.equal(getLocalHour("Europe/Oslo", eveningOslo), 20);
  assert.equal(getGreetingPeriodForTimezone("Europe/Oslo", eveningOslo), "evening");

  const result = formatWelcomeMessage(labels, {
    timezone: "Europe/Oslo",
    userName: "Svein",
    now: eveningOslo,
  });

  assert.equal(result.period, "evening");
  assert.equal(result.message, "Good evening, Svein.");
  assert.ok(!result.message.toLowerCase().includes("morning"));
});

console.log("All greeting tests passed.");

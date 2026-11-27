import assert from "node:assert/strict";
import {
  buildPlatformTrafficStatus,
  calendarDayBounds,
  countCreatedOnCalendarDay,
  countNewAppCustomersToday,
} from "./traffic-status";

const now = new Date("2026-11-27T12:00:00.000Z");

const utc = calendarDayBounds(now, "UTC");
assert.ok(utc);
assert.equal(utc.startMs, Date.parse("2026-11-27T00:00:00.000Z"));
assert.equal(utc.endMs, Date.parse("2026-11-28T00:00:00.000Z"));

const oslo = calendarDayBounds(now, "Europe/Oslo");
assert.ok(oslo);
assert.equal(oslo.startMs, Date.parse("2026-11-26T23:00:00.000Z"));

const today = countCreatedOnCalendarDay({
  rows: [
    { created_at: "2026-11-27T00:30:00.000Z" },
    { created_at: "2026-11-26T23:30:00.000Z" },
  ],
  now,
  timeZone: "UTC",
});
assert.deepEqual(today, { state: "value", value: 1 });

assert.deepEqual(
  countCreatedOnCalendarDay({ rows: [], now, timeZone: "UTC" }),
  { state: "value", value: 0 },
);

assert.equal(
  countCreatedOnCalendarDay({
    rows: [{ created_at: null }],
    now,
    timeZone: "UTC",
  }).state,
  "unavailable",
);

assert.equal(
  countCreatedOnCalendarDay({
    rows: [{ created_at: "2026-11-27T01:00:00.000Z" }],
    now,
    timeZone: "UTC",
    truncated: true,
  }).state,
  "unavailable",
);

assert.deepEqual(
  countCreatedOnCalendarDay({
    rows: [
      { created_at: "2026-11-27T01:00:00.000Z" },
      { created_at: "2026-11-26T01:00:00.000Z" },
    ],
    now,
    timeZone: "UTC",
    truncated: true,
  }),
  { state: "value", value: 1 },
);

const environments = new Map<string, string | null>([
  ["cust-today", "customer"],
  ["cust-staging", "staging"],
  ["cust-yesterday", "production"],
]);

assert.deepEqual(
  countNewAppCustomersToday({
    registry: {
      customers: [
        { customer_id: "cust-today", created_at: "2026-11-27T08:00:00.000Z" },
        { customer_id: "cust-staging", created_at: "2026-11-27T09:00:00.000Z" },
        { customer_id: "cust-yesterday", created_at: "2026-11-26T09:00:00.000Z" },
      ],
    },
    environmentByCustomerId: environments,
    now,
    timeZone: "UTC",
  }),
  { state: "value", value: 1 },
);

assert.equal(
  countNewAppCustomersToday({
    registry: { summary: { total: 0 } },
    environmentByCustomerId: new Map(),
    now,
    timeZone: "UTC",
  }).state,
  "unavailable",
);

assert.equal(
  countNewAppCustomersToday({
    registry: {
      customers: [{ customer_id: "cust-today", created_at: "2026-11-27T08:00:00.000Z" }],
    },
    environmentByCustomerId: null,
    now,
    timeZone: "UTC",
  }).state,
  "unavailable",
);

const view = buildPlatformTrafficStatus({
  checkedAt: now.toISOString(),
  dayTimeZone: "UTC",
  newAppCustomersToday: { state: "value", value: 0 },
  newSellersToday: { state: "unavailable", reason: "source_unavailable" },
});
assert.equal(view.operational, "console_responding");
for (const count of [
  view.appCustomersOnline,
  view.sellersOnline,
  view.signedInUsers,
  view.visitorsToday,
]) {
  assert.equal(count.state, "unavailable");
  if (count.state === "unavailable") assert.equal(count.reason, "not_measured");
}
assert.equal(view.newAppCustomersToday.state, "value");

console.log("traffic-status.test.ts: ok");

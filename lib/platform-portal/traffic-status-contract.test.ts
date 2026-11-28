import assert from "node:assert/strict";
import {
  PLATFORM_TRAFFIC_STATUS_POLL_MS,
  PLATFORM_TRAFFIC_STATUS_STALE_MS,
  parsePlatformTrafficStatus,
  parseTrafficCount,
  trafficStatusFreshness,
} from "./traffic-status-contract";

assert.equal(PLATFORM_TRAFFIC_STATUS_POLL_MS, 30_000);
assert.equal(PLATFORM_TRAFFIC_STATUS_STALE_MS, 90_000);

assert.deepEqual(parseTrafficCount({ state: "value", value: 0 }), {
  state: "value",
  value: 0,
});
assert.equal(parseTrafficCount({ state: "value", value: null }), null);
assert.equal(parseTrafficCount({ state: "value", value: -1 }), null);
assert.deepEqual(parseTrafficCount({ state: "unavailable", reason: "not_measured" }), {
  state: "unavailable",
  reason: "not_measured",
});
assert.equal(parseTrafficCount({ state: "unavailable", reason: "other" }), null);

const sources = {
  operational: "platform_admin_api",
  newAppCustomersToday: "registry",
  newSellersToday: "sellers",
  appCustomersOnline: "presence",
  sellersOnline: "presence",
  signedInUsers: "presence",
  visitorsToday: "ga4-pending",
};

const good = parsePlatformTrafficStatus({
  checkedAt: "2026-11-28T12:00:00.000Z",
  dayTimeZone: "UTC",
  operational: {
    state: "console_responding",
    scope: "platform_admin_api",
    fullServiceProbe: false,
  },
  newAppCustomersToday: { state: "value", value: 0 },
  newSellersToday: { state: "value", value: 2 },
  appCustomersOnline: { state: "unavailable", reason: "not_measured" },
  sellersOnline: { state: "unavailable", reason: "not_measured" },
  signedInUsers: { state: "unavailable", reason: "not_measured" },
  visitorsToday: { state: "unavailable", reason: "not_measured" },
  sources,
});
assert.ok(good);
assert.equal(good.operational.fullServiceProbe, false);
assert.equal(good.newAppCustomersToday.state, "value");
if (good.newAppCustomersToday.state === "value") {
  assert.equal(good.newAppCustomersToday.value, 0);
}

assert.equal(
  parsePlatformTrafficStatus({
    checkedAt: "2026-11-28T12:00:00.000Z",
    dayTimeZone: "UTC",
    operational: "console_responding",
    newAppCustomersToday: { state: "value", value: 1 },
    newSellersToday: { state: "value", value: 1 },
  }),
  null,
);

assert.equal(trafficStatusFreshness(null), "unavailable");
assert.equal(trafficStatusFreshness(Date.now() - 1_000, Date.now()), "fresh");
assert.equal(
  trafficStatusFreshness(Date.now() - PLATFORM_TRAFFIC_STATUS_STALE_MS - 1, Date.now()),
  "stale",
);

console.log("traffic-status-contract.test.ts: ok");

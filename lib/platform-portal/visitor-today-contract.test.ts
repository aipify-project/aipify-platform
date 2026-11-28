import assert from "node:assert/strict";
import {
  VISITOR_TODAY_METRIC,
  buildMeasuredVisitorToday,
  buildUnavailableVisitorToday,
  visitorTodayToTrafficCount,
} from "./visitor-today-contract";
import {
  readGa4VisitorTodayEnv,
  resolveVisitorTodayFromGa4,
} from "./visitor-today-ga4-adapter";

async function main() {
  const now = new Date("2026-11-28T15:00:00.000Z");

  const unavailable = buildUnavailableVisitorToday({
    asOf: now.toISOString(),
    dayTimeZone: "Europe/Oslo",
    note: "test",
  });
  assert.equal(unavailable.metric, VISITOR_TODAY_METRIC);
  assert.equal(unavailable.count.state, "unavailable");
  assert.equal(unavailable.freshness, "unavailable");
  assert.equal(visitorTodayToTrafficCount(unavailable).state, "unavailable");

  const measured = buildMeasuredVisitorToday({
    asOf: now.toISOString(),
    dayTimeZone: "UTC",
    dayStartIso: "2026-11-28T00:00:00.000Z",
    dayEndIso: "2026-11-29T00:00:00.000Z",
    value: 0,
    source: "fixture",
    freshness: "fresh",
  });
  assert.deepEqual(measured.count, { state: "value", value: 0 });

  const envEmpty = readGa4VisitorTodayEnv({});
  assert.equal(envEmpty.propertyId, undefined);
  assert.equal(envEmpty.credentialsConfigured, false);

  const closed = await resolveVisitorTodayFromGa4({
    now,
    dayTimeZone: "UTC",
    env: { propertyId: undefined, credentialsConfigured: false },
  });
  assert.equal(closed.source, "not_configured");
  assert.equal(closed.count.state, "unavailable");
  if (closed.count.state === "unavailable") {
    assert.equal(closed.count.reason, "not_measured");
  }

  const gated = await resolveVisitorTodayFromGa4({
    now,
    dayTimeZone: "UTC",
    env: { propertyId: "123456", credentialsConfigured: true },
  });
  assert.equal(gated.source, "ga4_data_api");
  assert.equal(gated.count.state, "unavailable");
  assert.match(gated.note ?? "", /gated/i);

  const fixture = await resolveVisitorTodayFromGa4({
    now,
    dayTimeZone: "UTC",
    fixtureUniqueVisitors: 12,
  });
  assert.equal(fixture.source, "fixture");
  assert.deepEqual(fixture.count, { state: "value", value: 12 });
  assert.equal(fixture.freshness, "fresh");

  console.log("visitor-today-contract.test.ts: ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

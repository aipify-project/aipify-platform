import assert from "node:assert/strict";
import { parsePlatformLivePresenceSnapshot } from "./parse-snapshot";

const good = parsePlatformLivePresenceSnapshot({
  checked_at: "2026-11-28T20:00:00.000Z",
  freshness_window_seconds: 300,
  app_customers_online: 0,
  sellers_online: 2,
  signed_in_users: 2,
});
assert.ok(good);
assert.equal(good.measured, true);
assert.deepEqual(good.appCustomersOnline, { state: "value", value: 0 });

assert.equal(
  parsePlatformLivePresenceSnapshot({
    checked_at: "2026-11-28T20:00:00.000Z",
    app_customers_online: 5,
    sellers_online: 2,
    signed_in_users: 4, // smaller than app — invalid
  }),
  null,
);

assert.equal(
  parsePlatformLivePresenceSnapshot({
    checked_at: "2026-11-28T20:00:00.000Z",
    app_customers_online: null,
    sellers_online: 0,
    signed_in_users: 0,
  }),
  null,
);

console.log("live-presence/parse-snapshot.test.ts: ok");

import assert from "node:assert/strict";
import {
  healthyOrganizationRatio,
  readNonNegativeCount,
  toPlatformDashboardLiveView,
} from "./dashboard-live-view";

assert.deepEqual(readNonNegativeCount(0), { state: "value", value: 0 });
assert.deepEqual(readNonNegativeCount(4), { state: "value", value: 4 });
assert.deepEqual(readNonNegativeCount(null), { state: "unavailable" });
assert.deepEqual(readNonNegativeCount(undefined), { state: "unavailable" });
assert.deepEqual(readNonNegativeCount("0"), { state: "unavailable" });
assert.deepEqual(readNonNegativeCount(-1), { state: "unavailable" });
assert.deepEqual(readNonNegativeCount(Number.NaN), { state: "unavailable" });

assert.deepEqual(
  healthyOrganizationRatio({ state: "value", value: 0 }, { state: "value", value: 0 }),
  { state: "unavailable" },
);
assert.deepEqual(
  healthyOrganizationRatio({ state: "unavailable" }, { state: "value", value: 0 }),
  { state: "unavailable" },
);
assert.deepEqual(
  healthyOrganizationRatio({ state: "value", value: 4 }, { state: "value", value: 2 }),
  { state: "value", value: 50 },
);

const live = toPlatformDashboardLiveView({
  organizations_requiring_attention: 1,
  active_subscriptions: 1,
  open_support_workload: 0,
  checked_at: "2026-11-27T12:00:00.000Z",
  payment_status_summary: { active: 1, past_due: 0, trialing: 0 },
  customer_success_indicators: {
    organizations_total: 2,
    organizations_requiring_attention: 1,
    healthy_ratio_pct: 100,
  },
  marketplace_moderation: { pending_review: 7, published: 14 },
  support_inbox: { state: "value", open: 0, waiting: 0, resolved_or_closed: 4 },
});

assert.equal(live.organizationsTotal.state === "value" && live.organizationsTotal.value, 2);
assert.equal(live.supportOpen.state === "value" && live.supportOpen.value, 0);
assert.equal(live.supportResolved.state === "value" && live.supportResolved.value, 4);
assert.equal(live.supportCritical.state, "unavailable");
assert.equal(live.healthyRatioPct.state === "value" && live.healthyRatioPct.value, 50);
assert.equal(live.pastDue.state === "value" && live.pastDue.value, 0);
assert.equal(live.checkedAt, "2026-11-27T12:00:00.000Z");

const missingInbox = toPlatformDashboardLiveView({
  organizations_requiring_attention: 0,
  active_subscriptions: 0,
  open_support_workload: 0,
  customer_success_indicators: {
    organizations_total: 0,
    healthy_ratio_pct: 100,
  },
  payment_status_summary: {},
  marketplace_moderation: {},
});
assert.equal(missingInbox.supportOpen.state, "unavailable");
assert.equal(missingInbox.supportWaiting.state, "unavailable");
assert.equal(missingInbox.healthyRatioPct.state, "unavailable");
assert.equal(missingInbox.pastDue.state, "unavailable");
assert.equal(missingInbox.skillsPublished.state, "unavailable");
assert.equal(missingInbox.organizationsTotal.state === "value" && missingInbox.organizationsTotal.value, 0);

console.log("dashboard-live-view.test.ts: ok");

/**
 * LOCAL synthetic fixture parity for past_due / trialing customer scope.
 * NOT Staging E2E — Staging Core (auedugihkduoaikfusqe) lacks subscriptions/companies/RPC.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  buildParityFixtures,
  countActiveSubscriptions,
  countPastDue,
  countPastDueUnscoped,
  countTrialing,
  countTrialingUnscoped,
  isCustomerScopedSubscription,
  paymentStatusSummary,
  type SyntheticWorld,
} from "./payment-status-customer-scope-predicates";

const SQL_PATH =
  "docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql";
const EXPECTED_SHA256 =
  "a18dd074eaa879534a55f228033eaa8ffc218ed200ab5478b33a9a07e9f05dc3";

const digest = createHash("sha256").update(readFileSync(SQL_PATH)).digest("hex");
assert.equal(digest, EXPECTED_SHA256);

const world = buildParityFixtures();

// Positive: APP customer past_due / trialing / active are counted when scoped.
assert.equal(countPastDue(world), 1, "one APP past_due");
assert.equal(countTrialing(world), 1, "one APP trialing");
assert.equal(countActiveSubscriptions(world), 3, "active + trialing + duplicate active");

// Unscoped still includes platform + orphan rows — proves zero Production gap is not enough.
assert.equal(countPastDueUnscoped(world), 3, "APP + platform + orphan past_due");
assert.equal(countTrialingUnscoped(world), 2, "APP + platform trialing");
assert.ok(countPastDueUnscoped(world) > countPastDue(world));
assert.ok(countTrialingUnscoped(world) > countTrialing(world));

// Negative: platform-internal org subscriptions excluded.
const platformPastDue = world.subscriptions.find((s) => s.id === "sub_platform_past_due");
assert.ok(platformPastDue);
assert.equal(isCustomerScopedSubscription(world, platformPastDue), false);

// Negative: partner without APP customer org does not create scoped rows.
assert.equal(world.partners[0]?.has_app_customer_org, false);
assert.equal(
  world.subscriptions.some(
    (s) => s.customer_id === "partner_csp_only" && isCustomerScopedSubscription(world, s),
  ),
  false,
);

// Negative: orphan subscription (no customer/org/company chain) excluded when scoped.
const orphan = world.subscriptions.find((s) => s.id === "sub_orphan_past_due");
assert.ok(orphan);
assert.equal(isCustomerScopedSubscription(world, orphan), false);

// Empty world: scoped and unscoped both 0 — null state must not invent green totals.
const empty: SyntheticWorld = {
  companies: [],
  customers: [],
  organizations: [],
  subscriptions: [],
  partners: [],
};
assert.deepEqual(paymentStatusSummary(empty), { active: 0, past_due: 0, trialing: 0 });
assert.equal(countPastDueUnscoped(empty), 0);

// RPC JSON shape contract for payment_status_summary (keys only).
const summary = paymentStatusSummary(world);
assert.deepEqual(Object.keys(summary).sort(), ["active", "past_due", "trialing"]);
assert.equal(typeof summary.active, "number");
assert.equal(typeof summary.past_due, "number");
assert.equal(typeof summary.trialing, "number");

// Candidate SQL still contains the scoped predicates (guard against drift).
const sql = readFileSync(SQL_PATH, "utf8");
assert.match(sql, /into v_past_due[\s\S]*is_platform, false\) = false[\s\S]*status = 'past_due'/);
assert.match(sql, /into v_trialing[\s\S]*is_platform, false\) = false[\s\S]*status = 'trialing'/);

console.log("payment-status-customer-scope-parity: LOCAL_FIXTURE_PASS (not Staging E2E)");
console.log(JSON.stringify({ digest, summary, unscoped_past_due: countPastDueUnscoped(world) }));

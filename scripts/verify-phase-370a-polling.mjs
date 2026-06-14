/**
 * Phase 370A — polling policy verification (no browser required).
 * Run: node scripts/verify-phase-370a-polling.mjs
 */

import {
  allowsExecutivePolling,
  allowsOperationsPolling,
  allowsPlatformWidgetPolling,
  allowsPresenceBriefingFetch,
  allowsPresenceSummaryPolling,
  allowsSuperAdminHealthPolling,
  isAuditRoute,
  isExecutiveRoute,
  isSettingsRoute,
  shouldPollNotifications,
} from "../lib/polling/route-policy.ts";
import {
  BACKOFF_STEPS_MS,
  CACHE_TTL_LICENSE_MS,
  POLL_INTERVAL_NOTIFICATIONS_MS,
  POLL_INTERVAL_PRESENCE_OPEN_MS,
  PRESENCE_POLL_INTERVAL_CLOSED_MS,
} from "../lib/polling/policy.ts";
import {
  clearPollingBackoff,
  getBackoffIntervalMs,
  recordPollingFailure,
  recordPollingSuccess,
} from "../lib/polling/backoff.ts";
import { cancelPendingFetches, dedupeFetch } from "../lib/polling/dedup.ts";
import {
  clearPollingCache,
  getCachedValue,
  setCachedValue,
} from "../lib/polling/cache.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${message}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${message}`);
  }
}

console.log("\nPhase 370A — polling policy checks\n");

console.log("Route policy");
assert(isSettingsRoute("/app/settings"), "settings route detected");
assert(isSettingsRoute("/app/settings/security"), "settings sub-route detected");
assert(isAuditRoute("/app/audit"), "audit route detected");
assert(isExecutiveRoute("/app/executive"), "executive route detected");
assert(!allowsExecutivePolling("/app/settings"), "no executive polling on settings");
assert(allowsExecutivePolling("/app/executive"), "executive polling on executive center");
assert(!shouldPollNotifications("/app/settings/billing"), "no notification polling on settings");
assert(shouldPollNotifications("/app"), "notification polling on app home");
assert(
  allowsOperationsPolling("/app/command-center"),
  "operations polling on command center"
);
assert(!allowsOperationsPolling("/app/settings"), "no operations polling on settings");
assert(
  allowsSuperAdminHealthPolling("/super"),
  "super admin health polling on /super"
);
assert(
  !allowsPlatformWidgetPolling("/app/executive", "platform"),
  "platform widgets not on customer routes"
);
assert(
  allowsPlatformWidgetPolling("/platform", "platform"),
  "platform widgets on platform home"
);

console.log("\nPresence rules");
assert(
  allowsPresenceSummaryPolling("/app", true),
  "presence summary when indicator visible"
);
assert(
  !allowsPresenceSummaryPolling("/app/settings", true),
  "no presence summary on settings"
);
assert(
  allowsPresenceBriefingFetch("/app/executive", false),
  "briefing fetch on executive route"
);
assert(
  !allowsPresenceBriefingFetch("/app", false),
  "no briefing fetch outside executive when drawer closed"
);
assert(
  allowsPresenceBriefingFetch("/app", true),
  "briefing fetch when drawer open"
);

console.log("\nInterval constants");
assert(POLL_INTERVAL_NOTIFICATIONS_MS === 60_000, "notifications 60s");
assert(POLL_INTERVAL_PRESENCE_OPEN_MS === 60_000, "presence open 60s");
assert(PRESENCE_POLL_INTERVAL_CLOSED_MS === 0, "presence closed disables interval");
assert(CACHE_TTL_LICENSE_MS === 5 * 60_000, "license cache 5 min");

console.log("\nDedup");
let fetchCount = 0;
const result = await Promise.all([
  dedupeFetch("test-key", async () => {
    fetchCount += 1;
    await new Promise((r) => setTimeout(r, 50));
    return "ok";
  }),
  dedupeFetch("test-key", async () => {
    fetchCount += 1;
    return "dup";
  }),
]);
assert(fetchCount === 1, "dedupeFetch runs fetcher once");
assert(result[0] === "ok" && result[1] === "ok", "dedupeFetch shares result");
cancelPendingFetches();

console.log("\nBackoff");
clearPollingBackoff();
assert(getBackoffIntervalMs("task-a", 60_000) === 60_000, "base interval before failures");
recordPollingFailure("task-a");
assert(getBackoffIntervalMs("task-a", 60_000) === BACKOFF_STEPS_MS[0], "backoff after 1 failure");
recordPollingFailure("task-a");
assert(getBackoffIntervalMs("task-a", 60_000) === BACKOFF_STEPS_MS[1], "backoff after 2 failures");
recordPollingSuccess("task-a");
assert(getBackoffIntervalMs("task-a", 60_000) === 60_000, "backoff cleared after success");

console.log("\nCache");
clearPollingCache();
setCachedValue("license-sidebar", { ok: true }, 60_000);
assert(getCachedValue("license-sidebar")?.ok === true, "cache stores value");
clearPollingCache();
assert(getCachedValue("license-sidebar") === null, "cache clears on logout helper");

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

import assert from "node:assert/strict";
import {
  resolveAttentionKpiStatus,
  resolveAwaitingApprovalKpiStatus,
  resolveHealthKpiStatus,
  resolvePreparedKpiStatus,
  resolveSinceLastLoginKpiStatus,
} from "./command-brief-kpi-status";

const labels = {
  sinceLastLoginZero: "No new events",
  sinceLastLoginActive: "{count} new events",
  preparedZero: "Nothing newly prepared",
  preparedActive: "{count} items prepared",
  attentionZero: "No open items",
  attentionActive: "{count} items need attention",
  approvalZero: "No pending approvals",
  approvalActive: "{count} awaiting you",
  healthHealthy: "Healthy",
  healthModerate: "Moderate",
  healthLow: "Needs attention",
  healthCritical: "Critical",
  healthUnavailable: "Unavailable",
};

assert.equal(resolveSinceLastLoginKpiStatus(0, labels).statusLabel, "No new events");
assert.equal(resolveSinceLastLoginKpiStatus(3, labels).statusLabel, "3 new events");
assert.equal(resolvePreparedKpiStatus(0, labels).statusLabel, "Nothing newly prepared");
assert.equal(resolveAttentionKpiStatus(0, labels).semanticValue, "completed");
assert.equal(resolveAttentionKpiStatus(0, labels).statusLabel, "No open items");
assert.equal(resolveAwaitingApprovalKpiStatus(0, labels).statusLabel, "No pending approvals");
assert.equal(resolveAwaitingApprovalKpiStatus(0, labels).semanticValue, "completed");
assert.equal(resolveAwaitingApprovalKpiStatus(2, labels).statusLabel, "2 awaiting you");
assert.equal(resolveAwaitingApprovalKpiStatus(2, labels).semanticValue, "awaiting_approval");
assert.equal(resolveHealthKpiStatus(76, labels).statusLabel, "Moderate");
assert.equal(resolveHealthKpiStatus(null, labels).statusLabel, "Unavailable");

console.log("command-brief-kpi-status.test.ts: all assertions passed");

import assert from "node:assert/strict";
import {
  getAccessPresentation,
  getEccCriticalItemsMetricBadge,
  getEccHealthMetricBadge,
  getEccOpenAlertsMetricBadge,
  getEccPendingActionsMetricBadge,
  getEccSinceLastLoginMetricBadge,
  getHealthPresentation,
  getLifecycleStatusPresentation,
  getSemanticPresentation,
  getSeverityPresentation,
  getWorkflowStatePresentation,
  mapBusinessContinuityStatusToSemantic,
  mapChangeOperationStatusToSemantic,
  mapExecutivePriorityToSeverity,
  mapHealthScoreToHealthState,
  mapReliabilityStatusToSemantic,
} from "./semantic-status-system";

// 1. Active lifecycle uses blue/purple — not warning amber.
assert.match(getLifecycleStatusPresentation("active").badgeClassName, /violet/);
assert.doesNotMatch(getLifecycleStatusPresentation("active").badgeClassName, /amber/);

// 2. Critical severity is red.
assert.match(getSeverityPresentation("critical").badgeClassName, /red/);
assert.equal(getSeverityPresentation("critical").icon, "❌");

// 3. Pending is workflow — not severity.
assert.equal(getWorkflowStatePresentation("pending").value, "pending");
assert.match(getWorkflowStatePresentation("pending").badgeClassName, /slate|aipify/);
assert.doesNotMatch(getSeverityPresentation("pending").badgeClassName, /red/);

// 4. Moderate health uses restrained amber — not severity resolver.
assert.equal(getHealthPresentation("moderate").value, "moderate");
assert.match(getHealthPresentation("moderate").badgeClassName, /amber/);
assert.equal(getHealthPresentation("moderate").a11yLabelKey, "common.status.semantic.a11y.organizationalHealth");

// 5. Open workflow is calm blue — not lifecycle Active yellow/amber.
assert.equal(getWorkflowStatePresentation("open").value, "open");
assert.match(getWorkflowStatePresentation("open").badgeClassName, /violet/);
assert.doesNotMatch(getWorkflowStatePresentation("open").badgeClassName, /amber/);

// 6. Zero critical items → positive completed workflow badge — not severity critical.
const zeroCritical = getEccCriticalItemsMetricBadge(0);
assert.equal(zeroCritical.type, "workflow");
assert.equal(zeroCritical.value, "completed");
assert.equal(zeroCritical.labelKey, "customerApp.executiveCommandCenter.premium.metrics.noCriticalItems");

// 7. Non-zero critical uses severity critical.
const activeCritical = getEccCriticalItemsMetricBadge(3);
assert.equal(activeCritical.type, "severity");
assert.equal(activeCritical.value, "critical");

// 8. Dual semantic types on recommendation cards — severity + workflow are distinct.
assert.notEqual(
  getSeverityPresentation(mapExecutivePriorityToSeverity("critical")).value,
  getWorkflowStatePresentation("open").value
);

// 9. Cross-portal reliability mapping — operational → health healthy (green), not warning.
const operational = mapReliabilityStatusToSemantic("operational");
assert.equal(operational.type, "health");
assert.equal(operational.value, "healthy");

// 10. Cross-portal business continuity — active → lifecycle active (blue).
const bcActive = mapBusinessContinuityStatusToSemantic("active");
assert.equal(bcActive.type, "lifecycle");
assert.equal(bcActive.value, "active");

// 11. Change operations pending → workflow awaiting_approval / pending — not amber Active.
const changePending = mapChangeOperationStatusToSemantic("pending");
assert.equal(changePending.type, "workflow");

// 12. Health score banding (85 / 70 / 50 canonical thresholds).
assert.equal(mapHealthScoreToHealthState(85), "healthy");
assert.equal(mapHealthScoreToHealthState(75), "moderate");
assert.equal(mapHealthScoreToHealthState(65), "poor");
assert.equal(mapHealthScoreToHealthState(45), "critical_health");
assert.equal(mapHealthScoreToHealthState(20), "critical_health");

// 13. ECC health metric uses health type.
assert.equal(getEccHealthMetricBadge(72).type, "health");
assert.equal(getEccHealthMetricBadge(72).value, "moderate");
assert.equal(getEccHealthMetricBadge(88).value, "healthy");

// 14. Since last login — no badge at zero; info at non-zero.
assert.equal(getEccSinceLastLoginMetricBadge(0), null);
assert.equal(getEccSinceLastLoginMetricBadge(5)?.type, "severity");
assert.equal(getEccSinceLastLoginMetricBadge(5)?.value, "info");

// 15. Open alerts workflow open when count > 0.
const openAlertsBadge = getEccOpenAlertsMetricBadge(2);
assert.ok(openAlertsBadge);
assert.equal(openAlertsBadge.type, "workflow");
assert.equal(openAlertsBadge.value, "open");

// 16. Pending actions workflow pending when count > 0.
const pendingActionsBadge = getEccPendingActionsMetricBadge(4);
assert.ok(pendingActionsBadge);
assert.equal(pendingActionsBadge.type, "workflow");
assert.equal(pendingActionsBadge.value, "pending");

// 17. Priority mapping — attention → medium severity, not workflow.
assert.equal(mapExecutivePriorityToSeverity("attention"), "medium");
assert.equal(mapExecutivePriorityToSeverity("urgent"), "high");

// 18. Access verified is green.
assert.match(getAccessPresentation("verified").badgeClassName, /emerald/);

// 19. Access not allowed is red.
assert.match(getAccessPresentation("not_allowed").badgeClassName, /red/);

// 20. Explicit getSemanticPresentation requires type — workflow open.
assert.equal(getSemanticPresentation("workflow", "open").labelKey, "common.status.semantic.workflow.open");

// 21. Translation keys exist for all lifecycle values.
for (const value of ["active", "inactive", "enabled", "disabled", "paused", "archived"]) {
  assert.ok(getLifecycleStatusPresentation(value).labelKey.startsWith("common.status.semantic."));
}

// 22. Translation keys for severity levels.
for (const value of ["critical", "high", "medium", "low", "info"]) {
  assert.ok(getSeverityPresentation(value).labelKey.includes("severity"));
}

// 23. Overdue workflow retains amber (genuine warning).
assert.match(getWorkflowStatePresentation("overdue").badgeClassName, /amber/);

// 24. High severity is orange — not amber medium.
assert.match(getSeverityPresentation("high").badgeClassName, /orange/);

// 25. Sort priority — critical severity sorts before info.
assert.ok(getSeverityPresentation("critical").sortPriority < getSeverityPresentation("info").sortPriority);

console.log("semantic-status-system: all 25 scenarios passed");

import assert from "node:assert/strict";
import { parseOnboarding } from "./parse";
import {
  computeApplicableProgress,
  filterValidMilestones,
  mapOnboardingWorkflowState,
  mapWorkflowStateForSemantic,
  partitionAdoptionFeatures,
  partitionCompletedTasks,
  partitionRemainingTasks,
  reconcileIntegrationTask,
  resolveNextIncompleteTask,
  resolveOverviewWorkflowState,
  resolveTaskHref,
  resolveTaskPriority,
  isApplicableTask,
} from "./presentation";
import { GETTING_STARTED_SUPPORT_HREF, ONBOARDING_TASK_LINKS } from "./config";

const baseChecklist = [
  { key: "org_profile", category: "organization", optional: false, status: "completed" as const },
  { key: "org_settings", category: "organization", optional: false, status: "in_progress" as const },
  { key: "integration_connect", category: "integrations", optional: false, status: "not_started" as const },
  { key: "knowledge_explore", category: "knowledge_support", optional: true, status: "optional" as const },
];

// 1. Parser returns found=false for invalid payload.
assert.equal(parseOnboarding(null).found, false);

// 2. Parser maps connected_integrations.
assert.equal(parseOnboarding({ found: true, connected_integrations: 2 }).connected_integrations, 2);

// 3. reconcileIntegrationTask marks connect completed when connected > 0.
const reconciled = reconcileIntegrationTask(
  [{ key: "integration_connect", category: "integrations", optional: false, status: "not_started" }],
  1
);
assert.equal(reconciled[0].status, "completed");

// 4. reconcileIntegrationTask resets connect when connected = 0.
const reset = reconcileIntegrationTask(
  [{ key: "integration_connect", category: "integrations", optional: false, status: "completed", auto_detected: true }],
  0
);
assert.equal(reset[0].status, "not_started");

// 5. computeApplicableProgress excludes optional tasks.
const progress = computeApplicableProgress(baseChecklist);
assert.equal(progress.total, 3);
assert.equal(progress.completed, 1);
assert.equal(progress.progress_percent, 33);

// 6. isApplicableTask ignores optional.
assert.equal(isApplicableTask(baseChecklist[3]), false);

// 7. resolveTaskPriority maps optional correctly.
assert.equal(resolveTaskPriority(baseChecklist[3]), "optional");
assert.equal(resolveTaskPriority(baseChecklist[0]), "required");

// 8. partitionRemainingTasks sorts required before optional.
const remaining = partitionRemainingTasks(baseChecklist);
assert.equal(remaining[remaining.length - 1].key, "knowledge_explore");

// 9. partitionCompletedTasks returns completed only.
assert.equal(partitionCompletedTasks(baseChecklist).length, 1);

// 10. resolveNextIncompleteTask picks first required incomplete.
assert.equal(resolveNextIncompleteTask(baseChecklist)?.key, "org_settings");

// 11. resolveOverviewWorkflowState returns in_progress when started.
const workflowChecklist = baseChecklist.filter((t) => t.key !== "integration_connect");
assert.equal(
  resolveOverviewWorkflowState({ status: "in_progress", progress_percent: 33, required_completed: 1, required_total: 2 }, workflowChecklist),
  "in_progress"
);

// 12. resolveOverviewWorkflowState returns completed when done.
assert.equal(
  resolveOverviewWorkflowState({ status: "completed", progress_percent: 100, required_completed: 3, required_total: 3 }, []),
  "completed"
);

// 13. mapOnboardingWorkflowState normalizes states.
assert.equal(mapOnboardingWorkflowState("completed"), "completed");
assert.equal(mapOnboardingWorkflowState("requires_attention"), "requires_attention");

// 14. mapWorkflowStateForSemantic maps not_started to pending.
assert.equal(mapWorkflowStateForSemantic("not_started"), "pending");

// 15. filterValidMilestones removes first_integration without connections.
const milestones = filterValidMilestones(
  [{ key: "first_integration", celebration: true }, { key: "org_setup_complete", celebration: true }],
  0
);
assert.equal(milestones.length, 1);
assert.equal(milestones[0].key, "org_setup_complete");

// 16. filterValidMilestones keeps first_integration when connected.
const withIntegration = filterValidMilestones([{ key: "first_integration", celebration: true }], 1);
assert.equal(withIntegration.length, 1);

// 17. partitionAdoptionFeatures structures explored/recommended.
const adoptionChecklist = [
  { key: "pack_install", category: "business_packs", optional: false, status: "completed" as const },
  { key: "integration_connect", category: "integrations", optional: false, status: "not_started" as const },
];
const adoption = partitionAdoptionFeatures(adoptionChecklist, {
  features_explored: 1,
  features_not_discovered: ["integration_connect"],
  suggested_business_packs: [],
  recommended_actions: [],
});
assert.equal(adoption.explored.length, 1);
assert.equal(adoption.recommended[0].key, "integration_connect");

// 18. resolveTaskHref returns integration connect path.
assert.equal(resolveTaskHref("integration_connect"), ONBOARDING_TASK_LINKS.integration_connect);

// 19. Support href is canonical history route.
assert.equal(GETTING_STARTED_SUPPORT_HREF, "/app/support/history");

// 20. parseOnboarding reconciles integration on parse.
const parsed = parseOnboarding({
  found: true,
  connected_integrations: 1,
  checklist: [{ key: "integration_connect", category: "integrations", optional: false, status: "not_started" }],
});
assert.equal(parsed.checklist?.[0].status, "completed");

// 21. partitionRemainingTasks excludes completed.
assert.equal(partitionRemainingTasks([baseChecklist[0]]).length, 0);

// 22. mapWorkflowStateForSemantic maps blocked.
assert.equal(mapWorkflowStateForSemantic("blocked"), "blocked");

console.log("onboarding.test.ts: 22 scenarios passed");

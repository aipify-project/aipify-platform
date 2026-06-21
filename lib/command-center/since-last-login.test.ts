import assert from "node:assert/strict";
import {
  buildSinceLastLoginDataset,
  classifyActivityEvent,
  classifyEccSummaryItem,
  groupSinceLastLoginEvents,
  mergeSinceLastLoginEvents,
} from "./since-last-login";
import {
  getSeverityPresentation,
  getWorkflowStatePresentation,
  mapExecutivePriorityToSeverity,
} from "@/lib/design/semantic-status-system";

// 1. Critical severity uses red presentation
const criticalPresentation = getSeverityPresentation("critical");
assert.equal(criticalPresentation.icon, "❌");
assert.match(criticalPresentation.badgeClassName, /red/);

// 2. High severity uses orange presentation
const highPresentation = getSeverityPresentation("high");
assert.match(highPresentation.badgeClassName, /orange/);

// 3. Medium severity uses amber presentation
const mediumPresentation = getSeverityPresentation("medium");
assert.match(mediumPresentation.badgeClassName, /amber/);

// 4. Legacy urgent maps to high severity
assert.equal(mapExecutivePriorityToSeverity("urgent"), "high");

// 5. Legacy attention maps to medium severity
assert.equal(mapExecutivePriorityToSeverity("attention"), "medium");

// 6. Contract milestone critical → requires attention group
const contractItem = classifyEccSummaryItem({
  item_key: "contract-1",
  item_title: "Contract milestones",
  item_category: "contract",
  item_count: 1,
  priority: "critical",
  summary: "One contract milestone overdue.",
});
assert.equal(contractItem.category, "requires_attention");
assert.equal(contractItem.severity, "critical");
assert.equal(contractItem.title, "Contract milestones");
assert.equal(contractItem.count, 1);

// 7. Title has no count prefix
assert.ok(!contractItem.title.startsWith("1 —"));

// 8. Companion completed activity → completed by Aipify
const companionEvent = classifyActivityEvent({
  id: "act-companion",
  scope: "organization",
  category: "companion_activity",
  priority: "completed",
  title: "Companion summary prepared",
  summary: "Aipify prepared your executive summary.",
  record_href: "/app/activity",
});
assert.equal(companionEvent.category, "completed_by_aipify");

// 9. Risk detected → requires attention, not completed
const riskEvent = classifyActivityEvent({
  id: "act-risk",
  scope: "organization",
  category: "customer_activity",
  priority: "attention_required",
  title: "Customer health shift detected",
  summary: "Risk detected in customer segment.",
  record_href: "/app/customers",
});
assert.equal(riskEvent.category, "requires_attention");

// 10. Informational business pack update → other changes
const infoItem = classifyEccSummaryItem({
  item_key: "pack-1",
  item_title: "Business Pack updates",
  item_category: "business_pack",
  item_count: 2,
  priority: "information",
  summary: "Two pack configuration updates.",
});
assert.equal(infoItem.category, "information");

// 11. Grouping separates attention, completed, and information
const grouped = groupSinceLastLoginEvents([
  contractItem,
  companionEvent,
  riskEvent,
  infoItem,
]);
assert.equal(grouped.counts.requiresAttention, 2);
assert.equal(grouped.counts.completedByAipify, 1);
assert.equal(grouped.counts.otherChanges, 1);

// 12. Dedup by dedupeKey
const deduped = mergeSinceLastLoginEvents([
  contractItem,
  { ...contractItem, explanation: "duplicate" },
]);
assert.equal(deduped.length, 1);

// 13. Dataset merges ECC + activity sources with dedup
const dataset = buildSinceLastLoginDataset({
  eccItems: [contractItem as unknown as Record<string, unknown>],
  activitySinceLogin: {
    top_changes: [
      {
        id: "act-1",
        scope: "organization",
        category: "operational_activity",
        priority: "information",
        title: "Workspace policy updated",
        summary: "Policy refresh.",
        record_href: "/app/activity",
      },
    ],
    top_risks: [riskEvent],
  },
});
assert.ok(dataset.length >= 2);

// 14. Valid navigation href on classified events
assert.ok(contractItem.href.startsWith("/app/"));
assert.ok(companionEvent.href.startsWith("/app/"));

// 15. Workflow awaiting approval presentation
const awaiting = getWorkflowStatePresentation("awaiting_approval");
assert.equal(awaiting.icon, "⏳");

// 16. Completed workflow presentation for Aipify completions
const completedWorkflow = getWorkflowStatePresentation("completed");
assert.equal(completedWorkflow.icon, "✅");

// 17. Approval category maps to awaiting approval workflow
const approvalEvent = classifyActivityEvent({
  id: "act-approval",
  scope: "organization",
  category: "approval_activity",
  priority: "pending",
  title: "Executive approval queued",
  summary: "Pending your review.",
  record_href: "/app/approvals",
});
assert.equal(approvalEvent.workflowState, "awaiting_approval");
assert.equal(approvalEvent.href, "/app/approvals");

// 18. Information severity for neutral items
const neutral = classifyEccSummaryItem({
  item_key: "knowledge-1",
  item_title: "Knowledge publications",
  item_category: "knowledge",
  item_count: 5,
  priority: "information",
  summary: "Five knowledge updates published.",
});
assert.equal(neutral.severity, "info");

// 19. Unknown legacy values fall back to information category
const unknown = classifyEccSummaryItem({
  item_key: "misc-1",
  item_title: "Workspace notice",
  item_category: "operational",
  item_count: 1,
  priority: "notice",
  summary: "Routine notice logged.",
});
assert.equal(unknown.category, "information");

console.log("since-last-login tests: 19 scenarios passed");

import assert from "node:assert/strict";
import { parseCustomerSuccessOverview } from "./parse";
import {
  CUSTOMER_SUCCESS_SUPPORT_HREF,
  SUCCESS_PLAN_STATUSES,
} from "./config";
import {
  formatScoreCardValue,
  resolveScoreCardHealthState,
  resolveWorkflowStatusLabel,
  resolveRiskImpactLabel,
  resolveOverviewHealthState,
  resolveRecommendationHref,
  mapPlanStatusToWorkflow,
  mapRiskImpactToSeverity,
  mapRecommendationPriorityToSeverity,
  isValidSortOption,
  isFollowUpOverdue,
} from "./presentation";
import { legacyScoresToEntries } from "./score-availability";

// 1. Parser handles null.
assert.equal(parseCustomerSuccessOverview(null).found, false);

// 2. Parser maps workspace payload.
const parsed = parseCustomerSuccessOverview({
  found: true,
  health_score: 72,
  health_state: "moderate",
  adoption_score: 72,
  utilization_score: 55,
  engagement_score: 48,
  recommended_next_action: { key: "connectIntegrations", priority: "important", category: "integration" },
  success_plans: [
    {
      id: "p1",
      title: "Adoption plan",
      goal_summary: "Expand usage",
      owner_label: "Admin",
      status: "in_progress",
      category: "adoption",
      priority: "important",
      progress_percent: 40,
      target_date: "2026-12-01",
    },
  ],
  follow_ups: [
    {
      id: "f1",
      title: "Review onboarding",
      status: "open",
      category: "internal_follow_up",
      priority: "high",
      owner_label: "Owner",
      due_at: "2026-01-01T00:00:00Z",
      item_type: "follow_up",
    },
  ],
  outcomes: [
    {
      id: "o1",
      title: "Training completion",
      target_value: "80%",
      current_value: "45%",
      progress_percent: 45,
      category: "learning",
      status: "active",
    },
  ],
  active_risks: [
    {
      id: "r1",
      title: "Low integration usage",
      description: "No integrations connected",
      category: "technology",
      status: "identified",
      likelihood: "moderate",
      impact: "major",
      owner_label: "Admin",
    },
  ],
  adoption_signals: [{ key: "team_count", label_key: "teamCount", value: 5, unit: "count" }],
  timeline: [{ id: "a1", event_type: "view", description: "Workspace viewed", created_at: "2026-06-21T10:00:00Z" }],
  owners: ["Admin", "Owner"],
});
assert.equal(parsed.health_score, 72);
assert.equal(parsed.health_state, "moderate");
assert.equal(parsed.success_plans?.length, 1);
assert.equal(parsed.follow_ups?.length, 1);
assert.equal(parsed.outcomes?.length, 1);
assert.equal(parsed.active_risks?.length, 1);
assert.equal(parsed.recommended_next_action?.key, "connectIntegrations");

// 3. Health resolver bands.
assert.equal(resolveOverviewHealthState(85), "healthy");
assert.equal(resolveOverviewHealthState(75), "moderate");
assert.equal(resolveOverviewHealthState(40), "critical_health");
assert.equal(resolveOverviewHealthState(90, "poor"), "poor");

// 4. Recommendation href uses canonical routes.
assert.equal(resolveRecommendationHref("connectIntegrations"), "/app/platform/integrations");
assert.equal(resolveRecommendationHref("completeOnboardingTraining"), "/app/support/getting-started");

// 5. Support back link targets Support hub — not APP dashboard.
assert.equal(CUSTOMER_SUCCESS_SUPPORT_HREF, "/app/support/history");

// 6. Plan states map to workflow semantics — no raw enum in mapper output.
assert.equal(mapPlanStatusToWorkflow("requires_attention"), "overdue");
assert.equal(mapPlanStatusToWorkflow("completed"), "completed");

// 7. All plan states registered for i18n.
assert.equal(SUCCESS_PLAN_STATUSES.length, 8);

// 8. Risk impact maps to severity presentation values.
assert.equal(mapRiskImpactToSeverity("critical"), "critical");
assert.equal(mapRiskImpactToSeverity("major"), "high");

// 9. Recommendation priority maps to severity.
assert.equal(mapRecommendationPriorityToSeverity("high_impact"), "high");

// 10. Sort option guard rejects unknown values.
assert.equal(isValidSortOption("due_date"), true);
assert.equal(isValidSortOption("invalid"), false);

// 11. Overdue follow-up detection.
assert.equal(isFollowUpOverdue("2020-01-01T00:00:00Z", "open"), true);
assert.equal(isFollowUpOverdue("2030-01-01T00:00:00Z", "open"), false);
assert.equal(isFollowUpOverdue("2020-01-01T00:00:00Z", "completed"), false);

// 12. Missing score availability does not map to critical health.
const unavailable = legacyScoresToEntries({}, false).health;
assert.equal(unavailable.score, null);
assert.equal(resolveScoreCardHealthState(unavailable), "unknown");
assert.equal(formatScoreCardValue(unavailable), "—");

// 13. Verified zero score may render when calculation completed.
const zeroAvailable = {
  score: 0,
  availability: "available" as const,
  calculatedAt: "2026-06-21T12:00:00Z",
  sourceFreshness: "current" as const,
  explanationKey: "customerApp.portalStructure.customerSuccess.scoreAvailability.available",
};
assert.equal(formatScoreCardValue(zeroAvailable), "0");
assert.equal(resolveScoreCardHealthState(zeroAvailable), "critical_health");

// 14. Workflow and severity labels normalize raw enums.
const labelFixture = {
  workflowStates: {
    open: "Åpen",
    in_progress: "Pågår",
    waiting: "Venter",
    escalated: "Eskalert",
    completed: "Fullført",
    overdue: "Forfalt",
    blocked: "Blokkert",
    pending: "Venter",
    cancelled: "Avbrutt",
  },
  severityLabels: {
    critical: "Kritisk",
    high: "Høy risiko",
    medium: "Krever oppmerksomhet",
    low: "Lav risiko",
    info: "Informasjon",
  },
  healthStates: { unknown: "Utilstrekkelig datagrunnlag" },
  scoreAvailability: { insufficient_data: "Utilstrekkelig datagrunnlag" },
  scoreAvailabilityDescriptions: { insufficientData: "Mer data kreves." },
  overview: { advisory: "Veiledende." },
} as unknown as import("./types").CustomerSuccessLabels;
assert.equal(resolveWorkflowStatusLabel("in_progress", labelFixture), "Pågår");
assert.equal(resolveRiskImpactLabel("major", labelFixture), "Høy risiko");
assert.equal(resolveRiskImpactLabel("moderate", labelFixture), "Krever oppmerksomhet");

console.log("customer-success.test.ts: all assertions passed");

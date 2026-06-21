import assert from "node:assert/strict";
import { mapHealthScoreToHealthState } from "@/lib/design/semantic-status-system";
import {
  dedupeHealthHistory,
  formatHealthScoreDisplay,
  formatScoreChangeDisplay,
  hasTrendChartData,
  resolveDriverEffectSemantic,
  resolveHealthOverviewState,
  sortNeedsAttention,
} from "./presentation";
import { resolvePurposeSummaryKey } from "@/lib/app-portal/success-center/presentation";
import { parseCustomerHealthWorkspace } from "./parse";
import { CUSTOMER_HEALTH_SUPPORT_HREF, CUSTOMER_HEALTH_RECOMMENDATION_LINKS } from "./config";

assert.equal(parseCustomerHealthWorkspace(null).found, false);

const insufficient = parseCustomerHealthWorkspace({
  found: true,
  has_activity: false,
  scores: {
    health: {
      score: null,
      availability: "insufficient_data",
      calculated_at: null,
      source_freshness: "unavailable",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.insufficientData",
    },
    adoption: {
      score: null,
      availability: "insufficient_data",
      calculated_at: null,
      source_freshness: "unavailable",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.insufficientData",
    },
    utilization: {
      score: null,
      availability: "insufficient_data",
      calculated_at: null,
      source_freshness: "unavailable",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.insufficientData",
    },
    engagement: {
      score: null,
      availability: "insufficient_data",
      calculated_at: null,
      source_freshness: "unavailable",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.insufficientData",
    },
  },
  overview: {
    health_score: null,
    health_state: "unknown",
    adoption_score: null,
    engagement_score: null,
    utilization_score: null,
    learning_score: null,
    risk_level: "low",
    trend_state: "insufficient_data",
    score_change: null,
    explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.insufficientData",
    score_availability: "insufficient_data",
    source_freshness: "unavailable",
  },
  drivers: [
    { key: "adoption", score: null, effect: "unavailable", availability: "insufficient_data" },
    { key: "engagement", score: null, effect: "unavailable", availability: "insufficient_data" },
  ],
  strengths: [],
  needs_attention: [],
  trend_points: [],
  risks: [],
  operational_signals: [],
  health_history: [],
  recommended_action: null,
});

assert.equal(insufficient.overview?.health_score, null);
assert.notEqual(insufficient.overview?.health_score, 0);
assert.equal(resolveHealthOverviewState(insufficient.overview), "unknown");
assert.equal(formatHealthScoreDisplay(insufficient.overview), "—");
assert.equal(
  formatScoreChangeDisplay(insufficient.overview, "Unavailable"),
  "Unavailable"
);
assert.equal(resolveDriverEffectSemantic("unavailable"), "unknown");
assert.equal(insufficient.recommended_action, null);

const parsed = parseCustomerHealthWorkspace({
  found: true,
  has_activity: true,
  scores: {
    health: {
      score: 72,
      availability: "available",
      calculated_at: "2026-06-21T09:25:00Z",
      source_freshness: "current",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.available",
    },
    adoption: {
      score: 40,
      availability: "available",
      calculated_at: "2026-06-21T09:25:00Z",
      source_freshness: "current",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.available",
    },
    utilization: {
      score: 25,
      availability: "available",
      calculated_at: "2026-06-21T09:25:00Z",
      source_freshness: "current",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.available",
    },
    engagement: {
      score: 38,
      availability: "available",
      calculated_at: "2026-06-21T09:25:00Z",
      source_freshness: "current",
      explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.available",
    },
  },
  overview: {
    health_score: 72,
    health_state: "moderate",
    adoption_score: 40,
    engagement_score: 38,
    utilization_score: 25,
    learning_score: 20,
    risk_level: "moderate",
    trend_state: "stable",
    score_change: 2,
    explanation_key: "customerApp.portalStructure.customerHealth.scoreAvailability.available",
    score_availability: "available",
    source_freshness: "current",
    last_calculated_at: "2026-06-21T09:25:00Z",
  },
  metrics: {
    team_count: 1,
    active_users: 1,
    business_packs: 0,
    active_capabilities: 5,
    integrations: 0,
    operations_activity: 2,
  },
  drivers: [
    { key: "adoption", score: 40, effect: "moderate_negative", availability: "available" },
    { key: "engagement", score: 38, effect: "strong_negative", availability: "available" },
  ],
  strengths: [{ key: "active_users", value: 1, impact: "positive", description_key: "active_users" }],
  needs_attention: [],
  trend_points: [
    { recorded_at: "2026-06-01T00:00:00Z", score: 68 },
    { recorded_at: "2026-06-15T00:00:00Z", score: 72 },
  ],
  risks: [
    {
      key: "low_engagement",
      severity: "medium",
      description_key: "lowEngagement",
      category: "engagement",
      status: "warning",
    },
  ],
  operational_signals: [
    {
      key: "team_activity",
      category: "adoption",
      description_key: "teamActivity",
      description_params: { count: 1 },
      trend: "stable",
      status: "neutral",
    },
  ],
  health_history: [
    {
      id: "1",
      event_type: "score_calculated",
      event_type_key: "scoreCalculated",
      description_key: "scoreCalculated",
      description_params: { overall_score: 72 },
      score: 72,
      status: "moderate",
      recorded_at: "2026-06-21T09:25:00Z",
    },
    {
      id: "1",
      event_type: "score_calculated",
      event_type_key: "scoreCalculated",
      description_key: "scoreCalculated",
      description_params: { overall_score: 72 },
      score: 72,
      status: "moderate",
      recorded_at: "2026-06-21T09:25:00Z",
    },
  ],
  recommended_action: { key: "reviewSupport", priority: "high", module: "support" },
});

assert.equal(parsed.overview?.health_state, "moderate");
assert.equal(parsed.metrics?.team_count, 1);
assert.equal(parsed.needs_attention?.length, 0);
assert.equal(parsed.health_history?.length, 1);
assert.equal(parsed.overview?.trend_state, "stable");
assert.equal(formatHealthScoreDisplay(parsed.overview), "72");
assert.equal(formatScoreChangeDisplay(parsed.overview, "Unavailable"), "+2");

assert.equal(resolveHealthOverviewState({ ...parsed.overview!, health_score: null, score_availability: "insufficient_data" }), "unknown");
assert.equal(mapHealthScoreToHealthState(85), resolveHealthOverviewState({ ...parsed.overview!, health_score: 85, score_availability: "available" }));

assert.equal(resolvePurposeSummaryKey("healthy"), "healthy");
assert.equal(resolvePurposeSummaryKey("unknown" as never), "critical");

assert.notEqual(CUSTOMER_HEALTH_RECOMMENDATION_LINKS.inviteTeam, "/platform");
assert.equal(CUSTOMER_HEALTH_SUPPORT_HREF, "/app/support/history");

assert.equal(hasTrendChartData(parsed.trend_points ?? []), true);
assert.equal(hasTrendChartData([{ recorded_at: "x", score: 1 }]), false);

const sorted = sortNeedsAttention([
  { key: "b", severity: "medium", impact: "low", value: 1 },
  { key: "a", severity: "critical", impact: "high", value: 2 },
]);
assert.equal(sorted[0]?.key, "a");

assert.equal(dedupeHealthHistory(parsed.health_history ?? []).length, 1);

const filteredSynthetic = parseCustomerHealthWorkspace({
  found: true,
  has_activity: true,
  health_history: [
    {
      id: "s1",
      event_type: "score_calculated",
      description: "Synthetic layout testing record",
      recorded_at: "2026-06-21T09:25:00Z",
    },
  ],
});
assert.equal(filteredSynthetic.health_history?.length, 0);

console.log("customer-health.test.ts: all assertions passed");

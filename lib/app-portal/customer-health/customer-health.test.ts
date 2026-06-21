import assert from "node:assert/strict";
import { mapHealthScoreToHealthState } from "@/lib/design/semantic-status-system";
import {
  dedupeHealthHistory,
  hasTrendChartData,
  sortNeedsAttention,
} from "./presentation";
import { resolveOverviewHealthState, resolvePurposeSummaryKey } from "@/lib/app-portal/success-center/presentation";
import { parseCustomerHealthWorkspace } from "./parse";
import { CUSTOMER_HEALTH_SUPPORT_HREF, CUSTOMER_HEALTH_RECOMMENDATION_LINKS } from "./config";

assert.equal(parseCustomerHealthWorkspace(null).found, false);

const parsed = parseCustomerHealthWorkspace({
  found: true,
  has_activity: true,
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
    explanation: "Combined from adoption (40), engagement (38), and utilization (25).",
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
    { key: "adoption", score: 40, effect: "moderate_negative" },
    { key: "engagement", score: 38, effect: "strong_negative" },
  ],
  strengths: [{ key: "active_users", value: 1, impact: "positive" }],
  needs_attention: [{ key: "business_packs", severity: "high", impact: "high", value: 0 }],
  trend_points: [
    { recorded_at: "2026-06-01T00:00:00Z", score: 68 },
    { recorded_at: "2026-06-15T00:00:00Z", score: 72 },
  ],
  risks: [{ key: "low_engagement", severity: "medium", description: "Low engagement", category: "engagement" }],
  operational_signals: [
    { key: "team_activity", category: "adoption", description: "1 active user", trend: "stable" },
  ],
  health_history: [
    { id: "1", event_type: "score_calculated", description: "Score 72", score: 72, recorded_at: "2026-06-21T09:25:00Z" },
    { id: "1", event_type: "score_calculated", description: "Score 72", score: 72, recorded_at: "2026-06-21T09:25:00Z" },
  ],
  recommended_action: { key: "inviteTeam", priority: "high", module: "organization" },
});

assert.equal(parsed.overview?.health_state, "moderate");
assert.equal(parsed.metrics?.business_packs, 0);
assert.equal(parsed.metrics?.active_capabilities, 5);
assert.equal(parsed.health_history?.length, 1);

assert.equal(resolveOverviewHealthState(85), "healthy");
assert.equal(resolveOverviewHealthState(75), "moderate");
assert.equal(resolveOverviewHealthState(65), "poor");
assert.equal(resolveOverviewHealthState(40), "critical_health");
assert.equal(mapHealthScoreToHealthState(85), resolveOverviewHealthState(85));

assert.equal(resolvePurposeSummaryKey("healthy"), "healthy");
assert.equal(resolvePurposeSummaryKey("critical_health"), "critical");

assert.equal(CUSTOMER_HEALTH_RECOMMENDATION_LINKS.inviteTeam, "/app/organization/team");
assert.equal(CUSTOMER_HEALTH_SUPPORT_HREF, "/app/support/history");

assert.equal(hasTrendChartData(parsed.trend_points ?? []), true);
assert.equal(hasTrendChartData([{ recorded_at: "x", score: 1 }]), false);

const sorted = sortNeedsAttention([
  { key: "b", severity: "medium", impact: "low", value: 1 },
  { key: "a", severity: "critical", impact: "high", value: 2 },
]);
assert.equal(sorted[0]?.key, "a");

assert.equal(dedupeHealthHistory(parsed.health_history ?? []).length, 1);

console.log("customer-health.test.ts: all assertions passed");

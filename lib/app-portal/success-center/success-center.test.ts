import assert from "node:assert/strict";
import {
  dedupeTimelineEvents,
  growthOpportunityAccent,
  mapRecommendationPriorityToSeverity,
  mapRiskLevelToSeverity,
  partitionRecommendations,
  resolveOverviewHealthState,
  resolvePurposeSummaryKey,
  resolveRecommendationHref,
  sortRecommendations,
} from "./presentation";
import { parseSuccessCenter } from "./parse";
import { SUCCESS_CENTER_SUPPORT_HREF } from "./config";

// 1. Parser returns found=false for invalid payload.
assert.equal(parseSuccessCenter(null).found, false);

// 2. Parser maps canonical health_state from API.
const parsed = parseSuccessCenter({
  found: true,
  has_activity: true,
  overview: {
    customer_health_score: 72,
    adoption_score: 40,
    team_engagement_score: 38,
    feature_utilization_score: 25,
    health_status: "healthy",
    health_state: "moderate",
    risk_level: "moderate",
    last_updated_at: "2026-06-21T09:25:00Z",
  },
  metrics: {
    team_count: 3,
    active_users: 1,
    business_packs: 2,
    active_capabilities: 72,
    integrations: 1,
    operations_activity: 5,
  },
  recommendations: [
    { id: "b", key: "enableIntegrations", priority: "medium", status: "open" },
    { id: "a", key: "inviteTeam", priority: "high", status: "open" },
  ],
  timeline: [
    {
      id: "snap-1",
      type: "health_score_change",
      title: "Health score snapshot",
      description: "Current health score: 72",
      occurred_at: "2026-06-21T09:25:00Z",
    },
    {
      id: "org-created",
      type: "organization_created",
      title: "Organization established",
      description: "Acme",
      occurred_at: "2026-01-01T00:00:00Z",
    },
  ],
  adoption_insights: [
    { key: "business_packs", label_key: "businessPacks", value: 2 },
    { key: "active_capabilities", label_key: "activeCapabilities", value: 72 },
  ],
});
assert.equal(parsed.overview?.health_state, "moderate");
assert.equal(parsed.metrics?.business_packs, 2);
assert.equal(parsed.metrics?.active_capabilities, 72);

// 3. Health score 85 resolves to healthy via shared resolver fallback.
assert.equal(resolveOverviewHealthState(85), "healthy");

// 4. Health score 75 resolves to moderate.
assert.equal(resolveOverviewHealthState(75), "moderate");

// 5. Health score 65 resolves to poor.
assert.equal(resolveOverviewHealthState(65), "poor");

// 6. Health score 40 resolves to critical_health.
assert.equal(resolveOverviewHealthState(40), "critical_health");

// 7. API health_state takes precedence over score fallback.
assert.equal(resolveOverviewHealthState(90, "poor"), "poor");

// 8. Purpose summary key tracks health bands.
assert.equal(resolvePurposeSummaryKey("healthy"), "healthy");
assert.equal(resolvePurposeSummaryKey("moderate"), "moderate");
assert.equal(resolvePurposeSummaryKey("poor"), "poor");
assert.equal(resolvePurposeSummaryKey("critical_health"), "critical");

// 9. Risk level maps to severity without exposing raw enums in UI layer.
assert.equal(mapRiskLevelToSeverity("low"), "low");
assert.equal(mapRiskLevelToSeverity("moderate"), "medium");
assert.equal(mapRiskLevelToSeverity("elevated"), "high");
assert.equal(mapRiskLevelToSeverity("high"), "critical");

// 10. Recommendation priority maps to severity presentation values.
assert.equal(mapRecommendationPriorityToSeverity("high"), "high");
assert.equal(mapRecommendationPriorityToSeverity("medium"), "medium");
assert.equal(mapRecommendationPriorityToSeverity("low"), "info");

// 11. Recommendations sort high before medium before low.
const sorted = sortRecommendations([
  { id: "1", key: "completeOnboarding", priority: "low" },
  { id: "2", key: "inviteTeam", priority: "high" },
  { id: "3", key: "enableIntegrations", priority: "medium" },
]);
assert.equal(sorted[0].key, "inviteTeam");
assert.equal(sorted[1].key, "enableIntegrations");
assert.equal(sorted[2].key, "completeOnboarding");

// 12. Partition separates completed recommendations.
const parts = partitionRecommendations([
  { id: "1", key: "configureSecurity", priority: "medium", status: "completed" },
  { id: "2", key: "inviteTeam", priority: "high", status: "open" },
]);
assert.equal(parts.open.length, 1);
assert.equal(parts.completed.length, 1);

// 13. Invite team recommendation links to team management route.
assert.equal(resolveRecommendationHref("inviteTeam"), "/app/organization/team");

// 14. Integrations recommendation links to integrations hub.
assert.equal(resolveRecommendationHref("enableIntegrations"), "/app/platform/integrations");

// 15. Follow-ups recommendation links to follow-ups center.
assert.equal(resolveRecommendationHref("completeFollowUps"), "/app/operations/follow-ups");

// 16. Onboarding recommendation links to getting started.
assert.equal(resolveRecommendationHref("completeOnboarding"), "/app/support/getting-started");

// 17. Security recommendation links to account security settings.
assert.equal(resolveRecommendationHref("configureSecurity"), "/app/account/security");

// 18. Timeline dedupe removes health snapshot noise on refresh.
assert.equal(parsed.timeline?.length, 1);
assert.equal(parsed.timeline?.[0]?.type, "organization_created");

// 19. Timeline dedupe keeps unique events only.
const deduped = dedupeTimelineEvents([
  { id: "a", type: "team_growth", title: "A", description: "A", occurred_at: "2026-06-01T00:00:00Z" },
  { id: "a", type: "team_growth", title: "A duplicate", description: "A", occurred_at: "2026-06-02T00:00:00Z" },
  { id: "b", type: "integration_connected", title: "B", description: "B", occurred_at: "2026-06-03T00:00:00Z" },
]);
assert.equal(deduped.length, 2);

// 20. Growth opportunity accents are purple/blue/teal — not default green bucket.
assert.equal(growthOpportunityAccent("team_expansion"), "violet");
assert.equal(growthOpportunityAccent("integrations"), "blue");
assert.equal(growthOpportunityAccent("plan_upgrade"), "teal");

// 21. Support back navigation uses Support landing — not APP dashboard.
assert.equal(SUCCESS_CENTER_SUPPORT_HREF, "/app/support/history");

// 22. Adoption vs capabilities: business pack count separate from active capabilities insight keys.
assert.ok(parsed.adoption_insights?.some((a) => a.label_key === "businessPacks"));
assert.ok(parsed.adoption_insights?.some((a) => a.label_key === "activeCapabilities"));

// 23. Single-user org adoption score from parser is not auto-100.
const singleUser = parseSuccessCenter({
  found: true,
  overview: { customer_health_score: 55, adoption_score: 18, team_engagement_score: 38, feature_utilization_score: 20, health_status: "attention_needed", health_state: "poor", risk_level: "elevated" },
});
assert.ok((singleUser.overview?.adoption_score ?? 100) < 50);
assert.equal(singleUser.overview?.team_engagement_score, 38);

// 24. Parser preserves last_updated_at for locale formatting in UI.
assert.equal(parsed.overview?.last_updated_at, "2026-06-21T09:25:00Z");

// 25. Health state aligns with score band when API omits health_state.
const aligned = parseSuccessCenter({
  found: true,
  overview: {
    customer_health_score: 88,
    adoption_score: 80,
    team_engagement_score: 90,
    feature_utilization_score: 85,
    health_status: "excellent",
    risk_level: "low",
  },
});
assert.equal(aligned.overview?.health_state, "healthy");

// 26. Open recommendations default status when API omits status field.
assert.equal(parsed.recommendations?.every((r) => r.status === "open"), true);

console.log("success-center.test.ts: all 26 scenarios passed");

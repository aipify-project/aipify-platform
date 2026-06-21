/** View permission keys for APP portal list/GET API routes. */
export const APP_PORTAL_LIST_ROUTE_PERMISSIONS: Record<string, { view: string; manage?: string }> = {
  "activity-history": { view: "activity_history.view", manage: "activity_history.manage" },
  "decision-center": { view: "decisions.view", manage: "decisions.manage" },
  "culture": { view: "trust_culture.view", manage: "trust_culture.manage" },
  "goals": { view: "goals.view", manage: "goals.manage" },
  "playbooks": { view: "playbooks.view", manage: "playbooks.manage" },
  "risks": { view: "risks.view", manage: "risks.manage" },
  "compliance": { view: "compliance.view", manage: "compliance.manage" },
  "meetings": { view: "meetings.view", manage: "meetings.manage" },
  "continuity": { view: "continuity.view", manage: "continuity.manage" },
  "learning": { view: "learning.view", manage: "learning.manage" },
  "capacity": { view: "capacity.view", manage: "capacity.manage" },
  "success": { view: "success_value.view", manage: "success_value.manage" },
  "strategy": { view: "strategy.view", manage: "strategy.manage" },
  "prioritization": { view: "prioritization.view", manage: "prioritization.manage" },
  "commitments": { view: "commitments.view", manage: "commitments.manage" },
  "briefings": { view: "briefings.view", manage: "briefings.manage" },
  "momentum": { view: "momentum.view", manage: "momentum.manage" },
  "resilience": { view: "resilience.view", manage: "resilience.manage" },
  "executive-companion": { view: "executive_companion.view", manage: "executive_companion.manage" },
  "benchmarking": { view: "benchmarking.view", manage: "benchmarking.manage" },
  "predictive-intelligence": { view: "predictive_intelligence.view", manage: "predictive_intelligence.manage" },
  "scenario-planning": { view: "scenario_planning.view", manage: "scenario_planning.manage" },
  "executive-foresight": { view: "executive_foresight.view", manage: "executive_foresight.manage" },
  "strategic-opportunities": { view: "strategic_opportunities.view", manage: "strategic_opportunities.manage" },
  "organizational-forecasting": { view: "organizational_forecasting.view", manage: "organizational_forecasting.manage" },
  "enterprise-readiness": { view: "enterprise_readiness.view", manage: "enterprise_readiness.manage" },
  "cross-functional-intelligence": { view: "cross_functional_intelligence.view", manage: "cross_functional_intelligence.manage" },
  "intelligence-command-center": { view: "intelligence_command_center.view", manage: "intelligence_command_center.manage" },
  "future-state-planning": { view: "future_state_planning.view", manage: "future_state_planning.manage" },
  "command-center": { view: "operations_center.view", manage: "operations_center.manage" },
  "support-history": { view: "support_requests.view", manage: "support_requests.manage" },
  "support-requests": { view: "support_requests.view", manage: "support_requests.manage" },
  "academy": { view: "customer_academy.view", manage: "customer_academy.manage" },
  "customer-health": { view: "customer_health.view", manage: "customer_health.manage" },
  "customer-success": { view: "success.view" },
  "assets": { view: "organizational_assets.view", manage: "organizational_assets.manage" },
  "external-relationships": { view: "external_relationships.view", manage: "external_relationships.manage" },
  "responsibilities": { view: "responsibilities.view", manage: "responsibilities.manage" },
  "communications": { view: "communications.view", manage: "communications.manage" },
};

export function resolveListRoutePermission(routePath: string) {
  for (const [segment, keys] of Object.entries(APP_PORTAL_LIST_ROUTE_PERMISSIONS)) {
    if (routePath.includes(`/api/aipify/${segment}/route.ts`) || routePath.endsWith(`/api/aipify/${segment}/route.ts`)) {
      return keys;
    }
  }
  if (routePath.includes("/business-packs/")) {
    return { view: "business_packs.view", manage: "business_packs.manage" };
  }
  return null;
}

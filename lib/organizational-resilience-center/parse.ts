import type { OrganizationalResilienceCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalResilienceCenter(raw: unknown): OrganizationalResilienceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            resilience_score: Number(dash.resilience_score ?? 0),
            resilience_label: String(dash.resilience_label ?? "moderate"),
            critical_dependencies: Number(dash.critical_dependencies ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
            reviews_pending: Number(dash.reviews_pending ?? 0),
            recovery_capability: String(dash.recovery_capability ?? "moderate"),
            knowledge_resilience: Number(dash.knowledge_resilience ?? 0),
            operational_resilience: Number(dash.operational_resilience ?? 0),
            workforce_resilience: Number(dash.workforce_resilience ?? 0),
            technical_resilience: Number(dash.technical_resilience ?? 0),
            governance_resilience: Number(dash.governance_resilience ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            companion_usefulness: Number(dash.companion_usefulness ?? 0),
          }
        : null,
    dependencies: Array.isArray(row.dependencies)
      ? row.dependencies.map((d) => {
          const item = asRecord(d);
          return {
            dependency_key: String(item.dependency_key ?? ""),
            domain: String(item.domain ?? ""),
            dependency_type: String(item.dependency_type ?? ""),
            title: String(item.title ?? ""),
            message: String(item.message ?? ""),
            severity: String(item.severity ?? "medium"),
            status: String(item.status ?? "open"),
          };
        })
      : [],
    preparedness_reviews: Array.isArray(row.preparedness_reviews)
      ? row.preparedness_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            review_state: String(item.review_state ?? "current"),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    scenarios: Array.isArray(row.scenarios)
      ? row.scenarios.map((s) => {
          const item = asRecord(s);
          return {
            scenario_key: String(item.scenario_key ?? ""),
            scenario_type: String(item.scenario_type ?? ""),
            title: String(item.title ?? ""),
            prompt: String(item.prompt ?? ""),
            readiness_level: String(item.readiness_level ?? "moderate"),
          };
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    executive_reviews: Array.isArray(row.executive_reviews)
      ? row.executive_reviews.map((er) => {
          const item = asRecord(er);
          return {
            exec_review_key: String(item.exec_review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

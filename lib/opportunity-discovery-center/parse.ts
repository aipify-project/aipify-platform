import type { DiscoveryOpportunity, OpportunityDiscoveryCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseOpportunity(raw: unknown): DiscoveryOpportunity {
  const row = asRecord(raw);
  return {
    opportunity_key: String(row.opportunity_key ?? ""),
    domain: String(row.domain ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    score_level: String(row.score_level ?? "monitor"),
    strategic_alignment: String(row.strategic_alignment ?? "medium"),
    potential_impact: String(row.potential_impact ?? "medium"),
    required_effort: String(row.required_effort ?? "medium"),
    workflow_status: String(row.workflow_status ?? "identified"),
    status: String(row.status ?? "open"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseOpportunityDiscoveryCenter(raw: unknown): OpportunityDiscoveryCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            opportunities_identified: Number(dash.opportunities_identified ?? 0),
            under_review: Number(dash.under_review ?? 0),
            high_value: Number(dash.high_value ?? 0),
            realization_trend: String(dash.realization_trend ?? "stable"),
            strategic_alignment_score: Number(dash.strategic_alignment_score ?? 0),
            executive_satisfaction: Number(dash.executive_satisfaction ?? 0),
            companion_usefulness: Number(dash.companion_usefulness ?? 0),
          }
        : null,
    opportunities: Array.isArray(row.opportunities) ? row.opportunities.map(parseOpportunity) : [],
    discovery_signals: Array.isArray(row.discovery_signals)
      ? row.discovery_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            message: String(item.message ?? ""),
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
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    opportunity_learning: Array.isArray(row.opportunity_learning)
      ? row.opportunity_learning.map((l) => {
          const item = asRecord(l);
          return {
            learning_key: String(item.learning_key ?? ""),
            opportunity_key: item.opportunity_key ? String(item.opportunity_key) : null,
            title: String(item.title ?? ""),
            content: String(item.content ?? ""),
            outcome_type: String(item.outcome_type ?? "lesson"),
            created_at: item.created_at ? String(item.created_at) : null,
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

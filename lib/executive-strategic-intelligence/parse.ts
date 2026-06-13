import type {
  ExecutiveStrategicIntelligenceCenter,
  ScenarioPrompt,
  StrategicInsight,
  StrategicRecommendation,
  StrategicReview,
  StrategicSignal,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseSignal(raw: unknown): StrategicSignal {
  const row = asRecord(raw);
  return {
    signal_key: String(row.signal_key ?? ""),
    signal_type: String(row.signal_type ?? ""),
    domain: String(row.domain ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    priority_matrix: String(row.priority_matrix ?? "evaluate"),
    impact: String(row.impact ?? "medium"),
    urgency: String(row.urgency ?? "medium"),
    trend_direction: row.trend_direction ? String(row.trend_direction) : null,
    status: String(row.status ?? "open"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseExecutiveStrategicIntelligenceCenter(
  raw: unknown,
): ExecutiveStrategicIntelligenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            opportunities_count: Number(dash.opportunities_count ?? 0),
            risks_count: Number(dash.risks_count ?? 0),
            priorities_count: Number(dash.priorities_count ?? 0),
            trends_count: Number(dash.trends_count ?? 0),
            escalations_count: Number(dash.escalations_count ?? 0),
            reviews_pending: Number(dash.reviews_pending ?? 0),
            executive_satisfaction: Number(dash.executive_satisfaction ?? 0),
            leadership_trust_score: Number(dash.leadership_trust_score ?? 0),
          }
        : null,
    opportunities: Array.isArray(row.opportunities) ? row.opportunities.map(parseSignal) : [],
    risks: Array.isArray(row.risks) ? row.risks.map(parseSignal) : [],
    trends: Array.isArray(row.trends) ? row.trends.map(parseSignal) : [],
    priorities: Array.isArray(row.priorities) ? row.priorities.map(parseSignal) : [],
    executive_insights: Array.isArray(row.executive_insights)
      ? row.executive_insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies StrategicInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies StrategicRecommendation;
        })
      : [],
    strategic_reviews: Array.isArray(row.strategic_reviews)
      ? row.strategic_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
            created_at: item.created_at ? String(item.created_at) : null,
          } satisfies StrategicReview;
        })
      : [],
    scenario_prompts: Array.isArray(row.scenario_prompts)
      ? row.scenario_prompts.map((s) => {
          const item = asRecord(s);
          return {
            key: String(item.key ?? ""),
            prompt: String(item.prompt ?? ""),
          } satisfies ScenarioPrompt;
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

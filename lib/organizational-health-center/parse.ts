import type { HealthDomainScore, OrganizationalHealthCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseDomainScore(raw: unknown): HealthDomainScore {
  const row = asRecord(raw);
  return {
    domain_key: String(row.domain_key ?? ""),
    score: Number(row.score ?? 0),
    health_band: String(row.health_band ?? "stable"),
    trend_direction: String(row.trend_direction ?? "stable"),
    summary: String(row.summary ?? ""),
    updated_at: row.updated_at ? String(row.updated_at) : null,
  };
}

export function parseOrganizationalHealthCenter(raw: unknown): OrganizationalHealthCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            overall_health_score: Number(dash.overall_health_score ?? 0),
            overall_health_band: String(dash.overall_health_band ?? "stable"),
            domains_improving: Number(dash.domains_improving ?? 0),
            domains_needing_attention: Number(dash.domains_needing_attention ?? 0),
            open_warnings: Number(dash.open_warnings ?? 0),
            reviews_pending: Number(dash.reviews_pending ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            review_completion_rate: Number(dash.review_completion_rate ?? 0),
            recommendation_usefulness: Number(dash.recommendation_usefulness ?? 0),
            leadership_satisfaction: Number(dash.leadership_satisfaction ?? 0),
          }
        : null,
    domain_scores: Array.isArray(row.domain_scores)
      ? row.domain_scores.map(parseDomainScore)
      : [],
    indicators: Array.isArray(row.indicators)
      ? row.indicators.map((i) => {
          const item = asRecord(i);
          return {
            indicator_key: String(item.indicator_key ?? ""),
            domain_key: String(item.domain_key ?? ""),
            title: String(item.title ?? ""),
            message: String(item.message ?? ""),
            trend_direction: String(item.trend_direction ?? "stable"),
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
    early_warnings: Array.isArray(row.early_warnings)
      ? row.early_warnings.map((w) => {
          const item = asRecord(w);
          return {
            warning_key: String(item.warning_key ?? ""),
            category: String(item.category ?? ""),
            message: String(item.message ?? ""),
            severity: String(item.severity ?? "watch"),
            status: String(item.status ?? "open"),
          };
        })
      : [],
    health_reviews: Array.isArray(row.health_reviews)
      ? row.health_reviews.map((hr) => {
          const item = asRecord(hr);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            scheduled_for: item.scheduled_for ? String(item.scheduled_for) : null,
            completed_at: item.completed_at ? String(item.completed_at) : null,
          };
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            event_key: String(item.event_key ?? ""),
            period_label: String(item.period_label ?? ""),
            event_type: String(item.event_type ?? ""),
            summary: String(item.summary ?? ""),
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

import type {
  AdaptabilityInsight,
  AdaptabilityRecommendation,
  AdaptabilityReview,
  AdaptabilitySnapshot,
  AdaptationHistoryEntry,
  AdaptationOpportunity,
  ChangeSignal,
  ExecutivePriority,
  OrganizationalAdaptabilityCenter,
  ResponsivenessIndicator,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalAdaptabilityCenter(raw: unknown): OrganizationalAdaptabilityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            adaptability_score: Number(dash.adaptability_score ?? 0),
            adaptability_health_label: String(dash.adaptability_health_label ?? "stable"),
            adaptation_opportunities: Number(dash.adaptation_opportunities ?? 0),
            emerging_changes: Number(dash.emerging_changes ?? 0),
            strong_adaptability_count: Number(dash.strong_adaptability_count ?? 0),
            responsiveness_pct: Number(dash.responsiveness_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            change_readiness_pct: Number(dash.change_readiness_pct ?? 0),
            recovery_flexibility_pct: Number(dash.recovery_flexibility_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    change_signals: Array.isArray(row.change_signals)
      ? row.change_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            signal_type: String(item.signal_type ?? ""),
            domain: String(item.domain ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies ChangeSignal;
        })
      : [],
    adaptation_opportunities: Array.isArray(row.adaptation_opportunities)
      ? row.adaptation_opportunities.map((o) => {
          const item = asRecord(o);
          return {
            opportunity_key: String(item.opportunity_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            adaptability_score: Number(item.adaptability_score ?? 0),
          } satisfies AdaptationOpportunity;
        })
      : [],
    responsiveness_indicators: Array.isArray(row.responsiveness_indicators)
      ? row.responsiveness_indicators.map((i) => {
          const item = asRecord(i);
          return {
            indicator_key: String(item.indicator_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            value_label: String(item.value_label ?? ""),
            trend: String(item.trend ?? "stable"),
          } satisfies ResponsivenessIndicator;
        })
      : [],
    executive_priorities: Array.isArray(row.executive_priorities)
      ? row.executive_priorities.map((p) => {
          const item = asRecord(p);
          return {
            priority_key: String(item.priority_key ?? ""),
            title: String(item.title ?? ""),
            owner_label: String(item.owner_label ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ExecutivePriority;
        })
      : [],
    adaptation_history: Array.isArray(row.adaptation_history)
      ? row.adaptation_history.map((h) => {
          const item = asRecord(h);
          return {
            history_key: String(item.history_key ?? ""),
            history_type: String(item.history_type ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies AdaptationHistoryEntry;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            adaptability_score: Number(item.adaptability_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies AdaptabilitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AdaptabilityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AdaptabilityRecommendation;
        })
      : [],
    adaptability_reviews: Array.isArray(row.adaptability_reviews)
      ? row.adaptability_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AdaptabilityReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_flexibility: String(exec.strategic_flexibility ?? ""),
            responsiveness_trends: String(exec.responsiveness_trends ?? ""),
            learning_integration: String(exec.learning_integration ?? ""),
            adaptation_opportunities: String(exec.adaptation_opportunities ?? ""),
          }
        : null,
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

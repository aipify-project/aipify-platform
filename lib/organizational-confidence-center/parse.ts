import type {
  ConfidenceFactor,
  ConfidenceInitiative,
  ConfidenceInsight,
  ConfidenceMilestone,
  ConfidenceRecommendation,
  ConfidenceReview,
  ConfidenceSession,
  ConfidenceSnapshot,
  ConfidenceTimelineEvent,
  OrganizationalConfidenceCenter,
  UncertaintyItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalConfidenceCenter(raw: unknown): OrganizationalConfidenceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            confidence_score: Number(dash.confidence_score ?? 0),
            confidence_health_label: String(dash.confidence_health_label ?? "healthy"),
            confidence_trend_pct: Number(dash.confidence_trend_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            preparedness_effectiveness_pct: Number(dash.preparedness_effectiveness_pct ?? 0),
            capability_maturity_pct: Number(dash.capability_maturity_pct ?? 0),
            leadership_consistency_pct: Number(dash.leadership_consistency_pct ?? 0),
            learning_participation_pct: Number(dash.learning_participation_pct ?? 0),
            recovery_readiness_pct: Number(dash.recovery_readiness_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
            preparedness_indicators: Number(dash.preparedness_indicators ?? 0),
          }
        : null,
    confidence_factors: Array.isArray(row.confidence_factors)
      ? row.confidence_factors.map((f) => {
          const item = asRecord(f);
          return {
            factor_key: String(item.factor_key ?? ""),
            domain: String(item.domain ?? ""),
            factor_type: String(item.factor_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            factor_tone: String(item.factor_tone ?? "neutral"),
          } satisfies ConfidenceFactor;
        })
      : [],
    uncertainty_items: Array.isArray(row.uncertainty_items)
      ? row.uncertainty_items.map((u) => {
          const item = asRecord(u);
          return {
            uncertainty_key: String(item.uncertainty_key ?? ""),
            uncertainty_type: String(item.uncertainty_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies UncertaintyItem;
        })
      : [],
    confidence_initiatives: Array.isArray(row.confidence_initiatives)
      ? row.confidence_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies ConfidenceInitiative;
        })
      : [],
    confidence_reviews: Array.isArray(row.confidence_reviews)
      ? row.confidence_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ConfidenceReview;
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            timeline_key: String(item.timeline_key ?? ""),
            event_type: String(item.event_type ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies ConfidenceTimelineEvent;
        })
      : [],
    confidence_milestones: Array.isArray(row.confidence_milestones)
      ? row.confidence_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ConfidenceMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            confidence_score: Number(item.confidence_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies ConfidenceSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ConfidenceInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ConfidenceRecommendation;
        })
      : [],
    confidence_sessions: Array.isArray(row.confidence_sessions)
      ? row.confidence_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ConfidenceSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_indicators: String(exec.leadership_indicators ?? ""),
            preparedness_measures: String(exec.preparedness_measures ?? ""),
            resilience_trends: String(exec.resilience_trends ?? ""),
            building_opportunities: String(exec.building_opportunities ?? ""),
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

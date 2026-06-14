import type {
  ImpactIndicator,
  ImpactInitiative,
  ImpactInsight,
  ImpactMilestone,
  ImpactRecommendation,
  ImpactReflection,
  ImpactReview,
  ImpactSession,
  ImpactSnapshot,
  ImpactTimelineEvent,
  OrganizationalImpactCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalImpactCenter(raw: unknown): OrganizationalImpactCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            impact_profile_score: Number(dash.impact_profile_score ?? 0),
            impact_health_label: String(dash.impact_health_label ?? "meaningful"),
            positive_outcome_trend_pct: Number(dash.positive_outcome_trend_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            customer_outcome_pct: Number(dash.customer_outcome_pct ?? 0),
            employee_development_pct: Number(dash.employee_development_pct ?? 0),
            community_engagement_pct: Number(dash.community_engagement_pct ?? 0),
            purpose_alignment_pct: Number(dash.purpose_alignment_pct ?? 0),
            mission_fulfillment_pct: Number(dash.mission_fulfillment_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
            stakeholder_summaries: Number(dash.stakeholder_summaries ?? 0),
          }
        : null,
    reflection_questions: Array.isArray(row.reflection_questions)
      ? row.reflection_questions.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            question: String(item.question ?? ""),
            status: String(item.status ?? "open"),
          } satisfies ImpactReflection;
        })
      : [],
    impact_indicators: Array.isArray(row.impact_indicators)
      ? row.impact_indicators.map((i) => {
          const item = asRecord(i);
          return {
            indicator_key: String(item.indicator_key ?? ""),
            domain: String(item.domain ?? ""),
            indicator_type: String(item.indicator_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            indicator_tone: String(item.indicator_tone ?? "neutral"),
          } satisfies ImpactIndicator;
        })
      : [],
    impact_initiatives: Array.isArray(row.impact_initiatives)
      ? row.impact_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies ImpactInitiative;
        })
      : [],
    impact_reviews: Array.isArray(row.impact_reviews)
      ? row.impact_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ImpactReview;
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
          } satisfies ImpactTimelineEvent;
        })
      : [],
    impact_milestones: Array.isArray(row.impact_milestones)
      ? row.impact_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ImpactMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            impact_profile_score: Number(item.impact_profile_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies ImpactSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ImpactInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ImpactRecommendation;
        })
      : [],
    impact_sessions: Array.isArray(row.impact_sessions)
      ? row.impact_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ImpactSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            stakeholder_indicators: String(exec.stakeholder_indicators ?? ""),
            mission_fulfillment: String(exec.mission_fulfillment ?? ""),
            contribution_opportunities: String(exec.contribution_opportunities ?? ""),
            organizational_influence: String(exec.organizational_influence ?? ""),
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

import type {
  CompoundingInitiative,
  CompoundingInsight,
  CompoundingMilestone,
  CompoundingRecommendation,
  CompoundingReview,
  CompoundingSession,
  CompoundingSignal,
  CompoundingSnapshot,
  CompoundingTimelineEvent,
  LeveragePrompt,
  OrganizationalCompoundingCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalCompoundingCenter(raw: unknown): OrganizationalCompoundingCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            compounding_score: Number(dash.compounding_score ?? 0),
            compounding_health_label: String(dash.compounding_health_label ?? "healthy"),
            positive_momentum_pct: Number(dash.positive_momentum_pct ?? 0),
            long_term_improvement_pct: Number(dash.long_term_improvement_pct ?? 0),
            compounding_opportunities: Number(dash.compounding_opportunities ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            consistency_execution_pct: Number(dash.consistency_execution_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            relationship_stability_pct: Number(dash.relationship_stability_pct ?? 0),
            improvement_sustainability_pct: Number(dash.improvement_sustainability_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    compounding_signals: Array.isArray(row.compounding_signals)
      ? row.compounding_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies CompoundingSignal;
        })
      : [],
    leverage_prompts: Array.isArray(row.leverage_prompts)
      ? row.leverage_prompts.map((g) => {
          const item = asRecord(g);
          return {
            leverage_key: String(item.leverage_key ?? ""),
            leverage_type: String(item.leverage_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies LeveragePrompt;
        })
      : [],
    compounding_initiatives: Array.isArray(row.compounding_initiatives)
      ? row.compounding_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies CompoundingInitiative;
        })
      : [],
    compounding_reviews: Array.isArray(row.compounding_reviews)
      ? row.compounding_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CompoundingReview;
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
          } satisfies CompoundingTimelineEvent;
        })
      : [],
    compounding_milestones: Array.isArray(row.compounding_milestones)
      ? row.compounding_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies CompoundingMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            compounding_score: Number(item.compounding_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies CompoundingSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CompoundingInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CompoundingRecommendation;
        })
      : [],
    compounding_sessions: Array.isArray(row.compounding_sessions)
      ? row.compounding_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CompoundingSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            long_term_value: String(exec.long_term_value ?? ""),
            leadership_consistency: String(exec.leadership_consistency ?? ""),
            growth_trends: String(exec.growth_trends ?? ""),
            patience_opportunities: String(exec.patience_opportunities ?? ""),
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

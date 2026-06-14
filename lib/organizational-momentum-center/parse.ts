import type {
  ArchivedAchievement,
  MilestoneRecognition,
  MomentumInsight,
  MomentumRecommendation,
  MomentumReview,
  MomentumSession,
  MomentumSignal,
  MomentumSnapshot,
  MomentumTimelineEvent,
  OrganizationalMomentumCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalMomentumCenter(raw: unknown): OrganizationalMomentumCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            momentum_score: Number(dash.momentum_score ?? 0),
            momentum_health_label: String(dash.momentum_health_label ?? "steady"),
            progress_trend_pct: Number(dash.progress_trend_pct ?? 0),
            positive_momentum_pct: Number(dash.positive_momentum_pct ?? 0),
            initiative_progression_pct: Number(dash.initiative_progression_pct ?? 0),
            review_participation_pct: Number(dash.review_participation_pct ?? 0),
            strategic_consistency_pct: Number(dash.strategic_consistency_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            cross_functional_collaboration_pct: Number(dash.cross_functional_collaboration_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
            pending_recognitions: Number(dash.pending_recognitions ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    momentum_signals: Array.isArray(row.momentum_signals)
      ? row.momentum_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies MomentumSignal;
        })
      : [],
    milestone_recognitions: Array.isArray(row.milestone_recognitions)
      ? row.milestone_recognitions.map((r) => {
          const item = asRecord(r);
          return {
            recognition_key: String(item.recognition_key ?? ""),
            domain: String(item.domain ?? ""),
            recognition_type: String(item.recognition_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "pending"),
          } satisfies MilestoneRecognition;
        })
      : [],
    momentum_reviews: Array.isArray(row.momentum_reviews)
      ? row.momentum_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies MomentumReview;
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
          } satisfies MomentumTimelineEvent;
        })
      : [],
    archived_achievements: Array.isArray(row.archived_achievements)
      ? row.archived_achievements.map((a) => {
          const item = asRecord(a);
          return {
            achievement_key: String(item.achievement_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ArchivedAchievement;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            momentum_score: Number(item.momentum_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies MomentumSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies MomentumInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies MomentumRecommendation;
        })
      : [],
    momentum_sessions: Array.isArray(row.momentum_sessions)
      ? row.momentum_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies MomentumSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_progress: String(exec.strategic_progress ?? ""),
            leadership_consistency: String(exec.leadership_consistency ?? ""),
            organizational_confidence: String(exec.organizational_confidence ?? ""),
            long_term_opportunities: String(exec.long_term_opportunities ?? ""),
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

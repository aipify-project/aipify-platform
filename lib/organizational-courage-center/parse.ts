import type {
  OrganizationalCourageCenter,
  ConversationPrompt,
  CourageInitiative,
  CourageInsight,
  CourageMilestone,
  CourageRecommendation,
  CourageReview,
  CourageSession,
  CourageSignal,
  CourageSnapshot,
  CourageTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalCourageCenter(raw: unknown): OrganizationalCourageCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            courage_score: Number(dash.courage_score ?? 0),
            courage_health_label: String(dash.courage_health_label ?? "healthy"),
            values_aligned_decisions_pct: Number(dash.values_aligned_decisions_pct ?? 0),
            leadership_reflection_pct: Number(dash.leadership_reflection_pct ?? 0),
            innovation_participation_pct: Number(dash.innovation_participation_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            leadership_transparency_pct: Number(dash.leadership_transparency_pct ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            ethical_consistency_pct: Number(dash.ethical_consistency_pct ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            responsible_innovation_pct: Number(dash.responsible_innovation_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    courage_signals: Array.isArray(row.courage_signals)
      ? row.courage_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies CourageSignal;
        })
      : [],
    conversation_prompts: Array.isArray(row.conversation_prompts)
      ? row.conversation_prompts.map((g) => {
          const item = asRecord(g);
          return {
            conversation_key: String(item.conversation_key ?? ""),
            conversation_type: String(item.conversation_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ConversationPrompt;
        })
      : [],
    courage_initiatives: Array.isArray(row.courage_initiatives)
      ? row.courage_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies CourageInitiative;
        })
      : [],
    courage_reviews: Array.isArray(row.courage_reviews)
      ? row.courage_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CourageReview;
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
          } satisfies CourageTimelineEvent;
        })
      : [],
    courage_milestones: Array.isArray(row.courage_milestones)
      ? row.courage_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies CourageMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            courage_score: Number(item.courage_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies CourageSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CourageInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies CourageRecommendation;
        })
      : [],
    courage_sessions: Array.isArray(row.courage_sessions)
      ? row.courage_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies CourageSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_integrity: String(exec.leadership_integrity ?? ""),
            innovation_confidence: String(exec.innovation_confidence ?? ""),
            ethical_consistency: String(exec.ethical_consistency ?? ""),
            values_based_decisions: String(exec.values_based_decisions ?? ""),
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

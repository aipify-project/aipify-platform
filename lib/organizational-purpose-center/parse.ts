import type {
  OrganizationalPurposeCenter,
  PurposeAlignment,
  PurposeInsight,
  PurposeMilestone,
  PurposeRecommendation,
  PurposeReflectionPrompt,
  PurposeReview,
  PurposeSession,
  PurposeSnapshot,
  PurposeTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalPurposeCenter(raw: unknown): OrganizationalPurposeCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            purpose_score: Number(dash.purpose_score ?? 0),
            purpose_health_label: String(dash.purpose_health_label ?? "maturing"),
            purpose_clarity_pct: Number(dash.purpose_clarity_pct ?? 0),
            values_alignment_trend_pct: Number(dash.values_alignment_trend_pct ?? 0),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            reflections_completed: Number(dash.reflections_completed ?? 0),
            strategic_alignment_pct: Number(dash.strategic_alignment_pct ?? 0),
            employee_understanding_pct: Number(dash.employee_understanding_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    purpose_alignment: Array.isArray(row.purpose_alignment)
      ? row.purpose_alignment.map((a) => {
          const item = asRecord(a);
          return {
            alignment_key: String(item.alignment_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            alignment_area: String(item.alignment_area ?? ""),
            alignment_score: Number(item.alignment_score ?? 0),
          } satisfies PurposeAlignment;
        })
      : [],
    reflection_prompts: Array.isArray(row.reflection_prompts)
      ? row.reflection_prompts.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            prompt: String(item.prompt ?? ""),
            domain: String(item.domain ?? ""),
          } satisfies PurposeReflectionPrompt;
        })
      : [],
    purpose_reviews: Array.isArray(row.purpose_reviews)
      ? row.purpose_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies PurposeReview;
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
          } satisfies PurposeTimelineEvent;
        })
      : [],
    purpose_milestones: Array.isArray(row.purpose_milestones)
      ? row.purpose_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies PurposeMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            purpose_score: Number(item.purpose_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies PurposeSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies PurposeInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies PurposeRecommendation;
        })
      : [],
    purpose_sessions: Array.isArray(row.purpose_sessions)
      ? row.purpose_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies PurposeSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            mission_alignment: String(exec.mission_alignment ?? ""),
            values_consistency: String(exec.values_consistency ?? ""),
            reflection_participation: String(exec.reflection_participation ?? ""),
            long_term_impact: String(exec.long_term_impact ?? ""),
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

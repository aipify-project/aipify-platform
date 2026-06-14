import type {
  OrganizationalFocusCenter,
  PriorityPrompt,
  FocusInitiative,
  FocusInsight,
  FocusMilestone,
  FocusRecommendation,
  FocusReview,
  FocusSession,
  FocusSignal,
  FocusSnapshot,
  FocusTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalFocusCenter(raw: unknown): OrganizationalFocusCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            focus_score: Number(dash.focus_score ?? 0),
            focus_health_label: String(dash.focus_health_label ?? "healthy"),
            priority_alignment_pct: Number(dash.priority_alignment_pct ?? 0),
            initiative_concentration_pct: Number(dash.initiative_concentration_pct ?? 0),
            execution_clarity_pct: Number(dash.execution_clarity_pct ?? 0),
            priority_clarity_pct: Number(dash.priority_clarity_pct ?? 0),
            initiative_overload_risk_pct: Number(dash.initiative_overload_risk_pct ?? 0),
            leadership_consistency_pct: Number(dash.leadership_consistency_pct ?? 0),
            resource_concentration_pct: Number(dash.resource_concentration_pct ?? 0),
            strategic_discipline_pct: Number(dash.strategic_discipline_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    focus_signals: Array.isArray(row.focus_signals)
      ? row.focus_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies FocusSignal;
        })
      : [],
    priority_prompts: Array.isArray(row.priority_prompts)
      ? row.priority_prompts.map((g) => {
          const item = asRecord(g);
          return {
            question_key: String(item.question_key ?? ""),
            question_type: String(item.question_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies PriorityPrompt;
        })
      : [],
    focus_initiatives: Array.isArray(row.focus_initiatives)
      ? row.focus_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies FocusInitiative;
        })
      : [],
    focus_reviews: Array.isArray(row.focus_reviews)
      ? row.focus_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FocusReview;
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
          } satisfies FocusTimelineEvent;
        })
      : [],
    focus_milestones: Array.isArray(row.focus_milestones)
      ? row.focus_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies FocusMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            focus_score: Number(item.focus_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies FocusSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FocusInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FocusRecommendation;
        })
      : [],
    focus_sessions: Array.isArray(row.focus_sessions)
      ? row.focus_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FocusSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            priority_alignment: String(exec.priority_alignment ?? ""),
            strategic_concentration: String(exec.strategic_concentration ?? ""),
            leadership_reinforcement: String(exec.leadership_reinforcement ?? ""),
            focus_opportunities: String(exec.focus_opportunities ?? ""),
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

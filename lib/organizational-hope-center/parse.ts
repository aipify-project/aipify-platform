import type {
  OrganizationalHopeCenter,
  ProgressPrompt,
  HopeInitiative,
  HopeInsight,
  HopeMilestone,
  HopeRecommendation,
  HopeReview,
  HopeSession,
  HopeSignal,
  HopeSnapshot,
  HopeTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalHopeCenter(raw: unknown): OrganizationalHopeCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            hope_score: Number(dash.hope_score ?? 0),
            hope_health_label: String(dash.hope_health_label ?? "healthy"),
            progress_indicators_pct: Number(dash.progress_indicators_pct ?? 0),
            future_confidence_pct: Number(dash.future_confidence_pct ?? 0),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            progress_recognition_pct: Number(dash.progress_recognition_pct ?? 0),
            leadership_communication_pct: Number(dash.leadership_communication_pct ?? 0),
            purpose_alignment_pct: Number(dash.purpose_alignment_pct ?? 0),
            learning_participation_pct: Number(dash.learning_participation_pct ?? 0),
            organizational_resilience_pct: Number(dash.organizational_resilience_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    hope_signals: Array.isArray(row.hope_signals)
      ? row.hope_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies HopeSignal;
        })
      : [],
    progress_prompts: Array.isArray(row.progress_prompts)
      ? row.progress_prompts.map((g) => {
          const item = asRecord(g);
          return {
            progress_key: String(item.progress_key ?? ""),
            progress_type: String(item.progress_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ProgressPrompt;
        })
      : [],
    hope_initiatives: Array.isArray(row.hope_initiatives)
      ? row.hope_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies HopeInitiative;
        })
      : [],
    hope_reviews: Array.isArray(row.hope_reviews)
      ? row.hope_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies HopeReview;
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
          } satisfies HopeTimelineEvent;
        })
      : [],
    hope_milestones: Array.isArray(row.hope_milestones)
      ? row.hope_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies HopeMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            hope_score: Number(item.hope_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies HopeSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies HopeInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies HopeRecommendation;
        })
      : [],
    hope_sessions: Array.isArray(row.hope_sessions)
      ? row.hope_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies HopeSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_confidence: String(exec.leadership_confidence ?? ""),
            organizational_resilience: String(exec.organizational_resilience ?? ""),
            progress_recognition: String(exec.progress_recognition ?? ""),
            future_opportunity: String(exec.future_opportunity ?? ""),
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

import type {
  OrganizationalAwarenessCenter,
  ObservationPrompt,
  AwarenessInitiative,
  AwarenessInsight,
  AwarenessMilestone,
  AwarenessRecommendation,
  AwarenessReview,
  AwarenessSession,
  AwarenessSignal,
  AwarenessSnapshot,
  AwarenessTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalAwarenessCenter(raw: unknown): OrganizationalAwarenessCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            awareness_score: Number(dash.awareness_score ?? 0),
            awareness_health_label: String(dash.awareness_health_label ?? "healthy"),
            emerging_themes_pct: Number(dash.emerging_themes_pct ?? 0),
            strategic_observations_pct: Number(dash.strategic_observations_pct ?? 0),
            environmental_developments_pct: Number(dash.environmental_developments_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            reflection_participation_pct: Number(dash.reflection_participation_pct ?? 0),
            review_discipline_pct: Number(dash.review_discipline_pct ?? 0),
            environmental_scanning_pct: Number(dash.environmental_scanning_pct ?? 0),
            insight_utilization_pct: Number(dash.insight_utilization_pct ?? 0),
            leadership_responsiveness_pct: Number(dash.leadership_responsiveness_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    awareness_signals: Array.isArray(row.awareness_signals)
      ? row.awareness_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies AwarenessSignal;
        })
      : [],
    observation_prompts: Array.isArray(row.observation_prompts)
      ? row.observation_prompts.map((g) => {
          const item = asRecord(g);
          return {
            observation_key: String(item.observation_key ?? ""),
            observation_type: String(item.observation_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ObservationPrompt;
        })
      : [],
    awareness_initiatives: Array.isArray(row.awareness_initiatives)
      ? row.awareness_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies AwarenessInitiative;
        })
      : [],
    awareness_reviews: Array.isArray(row.awareness_reviews)
      ? row.awareness_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AwarenessReview;
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
          } satisfies AwarenessTimelineEvent;
        })
      : [],
    awareness_milestones: Array.isArray(row.awareness_milestones)
      ? row.awareness_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies AwarenessMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            awareness_score: Number(item.awareness_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies AwarenessSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AwarenessInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies AwarenessRecommendation;
        })
      : [],
    awareness_sessions: Array.isArray(row.awareness_sessions)
      ? row.awareness_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies AwarenessSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_attentiveness: String(exec.leadership_attentiveness ?? ""),
            strategic_observation: String(exec.strategic_observation ?? ""),
            environmental_awareness: String(exec.environmental_awareness ?? ""),
            insight_opportunities: String(exec.insight_opportunities ?? ""),
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

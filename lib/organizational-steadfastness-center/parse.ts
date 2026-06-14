import type {
  OrganizationalSteadfastnessCenter,
  PersistencePrompt,
  SteadfastnessInitiative,
  SteadfastnessInsight,
  SteadfastnessMilestone,
  SteadfastnessRecommendation,
  SteadfastnessReview,
  SteadfastnessSession,
  SteadfastnessSignal,
  SteadfastnessSnapshot,
  SteadfastnessTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalSteadfastnessCenter(raw: unknown): OrganizationalSteadfastnessCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            steadfastness_score: Number(dash.steadfastness_score ?? 0),
            steadfastness_health_label: String(dash.steadfastness_health_label ?? "stable"),
            resilience_indicators_pct: Number(dash.resilience_indicators_pct ?? 0),
            commitment_consistency_pct: Number(dash.commitment_consistency_pct ?? 0),
            leadership_steadiness_pct: Number(dash.leadership_steadiness_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            values_consistency_pct: Number(dash.values_consistency_pct ?? 0),
            leadership_reliability_pct: Number(dash.leadership_reliability_pct ?? 0),
            recovery_effectiveness_pct: Number(dash.recovery_effectiveness_pct ?? 0),
            strategic_persistence_pct: Number(dash.strategic_persistence_pct ?? 0),
            organizational_resilience_pct: Number(dash.organizational_resilience_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    steadfastness_signals: Array.isArray(row.steadfastness_signals)
      ? row.steadfastness_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies SteadfastnessSignal;
        })
      : [],
    persistence_prompts: Array.isArray(row.persistence_prompts)
      ? row.persistence_prompts.map((g) => {
          const item = asRecord(g);
          return {
            persistence_key: String(item.persistence_key ?? ""),
            persistence_type: String(item.persistence_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies PersistencePrompt;
        })
      : [],
    steadfastness_initiatives: Array.isArray(row.steadfastness_initiatives)
      ? row.steadfastness_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies SteadfastnessInitiative;
        })
      : [],
    steadfastness_reviews: Array.isArray(row.steadfastness_reviews)
      ? row.steadfastness_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SteadfastnessReview;
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
          } satisfies SteadfastnessTimelineEvent;
        })
      : [],
    steadfastness_milestones: Array.isArray(row.steadfastness_milestones)
      ? row.steadfastness_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies SteadfastnessMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            steadfastness_score: Number(item.steadfastness_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies SteadfastnessSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SteadfastnessInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SteadfastnessRecommendation;
        })
      : [],
    steadfastness_sessions: Array.isArray(row.steadfastness_sessions)
      ? row.steadfastness_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SteadfastnessSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_consistency: String(exec.leadership_consistency ?? ""),
            strategic_resilience: String(exec.strategic_resilience ?? ""),
            values_continuity: String(exec.values_continuity ?? ""),
            confidence_opportunities: String(exec.confidence_opportunities ?? ""),
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

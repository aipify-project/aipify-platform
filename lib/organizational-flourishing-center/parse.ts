import type {
  FlourishingCondition,
  FlourishingInitiative,
  FlourishingInsight,
  FlourishingMilestone,
  FlourishingRecommendation,
  FlourishingReview,
  FlourishingSession,
  FlourishingSnapshot,
  FlourishingTimelineEvent,
  MeaningPrompt,
  OrganizationalFlourishingCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalFlourishingCenter(raw: unknown): OrganizationalFlourishingCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            flourishing_score: Number(dash.flourishing_score ?? 0),
            flourishing_health_label: String(dash.flourishing_health_label ?? "healthy"),
            positive_momentum_pct: Number(dash.positive_momentum_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            learning_participation_pct: Number(dash.learning_participation_pct ?? 0),
            collaboration_effectiveness_pct: Number(dash.collaboration_effectiveness_pct ?? 0),
            leadership_consistency_pct: Number(dash.leadership_consistency_pct ?? 0),
            organizational_resilience_pct: Number(dash.organizational_resilience_pct ?? 0),
            purpose_alignment_pct: Number(dash.purpose_alignment_pct ?? 0),
            sustainability_pct: Number(dash.sustainability_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    flourishing_conditions: Array.isArray(row.flourishing_conditions)
      ? row.flourishing_conditions.map((c) => {
          const item = asRecord(c);
          return {
            condition_key: String(item.condition_key ?? ""),
            domain: String(item.domain ?? ""),
            condition_type: String(item.condition_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            condition_tone: String(item.condition_tone ?? "neutral"),
          } satisfies FlourishingCondition;
        })
      : [],
    meaning_prompts: Array.isArray(row.meaning_prompts)
      ? row.meaning_prompts.map((m) => {
          const item = asRecord(m);
          return {
            meaning_key: String(item.meaning_key ?? ""),
            meaning_type: String(item.meaning_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies MeaningPrompt;
        })
      : [],
    flourishing_initiatives: Array.isArray(row.flourishing_initiatives)
      ? row.flourishing_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies FlourishingInitiative;
        })
      : [],
    flourishing_reviews: Array.isArray(row.flourishing_reviews)
      ? row.flourishing_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FlourishingReview;
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
          } satisfies FlourishingTimelineEvent;
        })
      : [],
    flourishing_milestones: Array.isArray(row.flourishing_milestones)
      ? row.flourishing_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies FlourishingMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            flourishing_score: Number(item.flourishing_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies FlourishingSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FlourishingInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FlourishingRecommendation;
        })
      : [],
    flourishing_sessions: Array.isArray(row.flourishing_sessions)
      ? row.flourishing_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FlourishingSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            sustainability_indicators: String(exec.sustainability_indicators ?? ""),
            resilience_measures: String(exec.resilience_measures ?? ""),
            leadership_participation: String(exec.leadership_participation ?? ""),
            flourishing_opportunities: String(exec.flourishing_opportunities ?? ""),
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

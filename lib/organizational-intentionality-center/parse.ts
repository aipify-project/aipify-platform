import type {
  OrganizationalIntentionalityCenter,
  PurposePrompt,
  IntentionalityInitiative,
  IntentionalityInsight,
  IntentionalityMilestone,
  IntentionalityRecommendation,
  IntentionalityReview,
  IntentionalitySession,
  IntentionalitySignal,
  IntentionalitySnapshot,
  IntentionalityTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalIntentionalityCenter(raw: unknown): OrganizationalIntentionalityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            intentionality_score: Number(dash.intentionality_score ?? 0),
            intentionality_health_label: String(dash.intentionality_health_label ?? "healthy"),
            priority_alignment_pct: Number(dash.priority_alignment_pct ?? 0),
            strategic_discipline_pct: Number(dash.strategic_discipline_pct ?? 0),
            resource_allocation_insight_pct: Number(dash.resource_allocation_insight_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            strategic_consistency_pct: Number(dash.strategic_consistency_pct ?? 0),
            values_alignment_pct: Number(dash.values_alignment_pct ?? 0),
            leadership_reflection_pct: Number(dash.leadership_reflection_pct ?? 0),
            resource_allocation_pct: Number(dash.resource_allocation_pct ?? 0),
            purpose_integration_pct: Number(dash.purpose_integration_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    intentionality_signals: Array.isArray(row.intentionality_signals)
      ? row.intentionality_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies IntentionalitySignal;
        })
      : [],
    purpose_prompts: Array.isArray(row.purpose_prompts)
      ? row.purpose_prompts.map((g) => {
          const item = asRecord(g);
          return {
            purpose_key: String(item.purpose_key ?? ""),
            purpose_type: String(item.purpose_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies PurposePrompt;
        })
      : [],
    intentionality_initiatives: Array.isArray(row.intentionality_initiatives)
      ? row.intentionality_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies IntentionalityInitiative;
        })
      : [],
    intentionality_reviews: Array.isArray(row.intentionality_reviews)
      ? row.intentionality_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies IntentionalityReview;
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
          } satisfies IntentionalityTimelineEvent;
        })
      : [],
    intentionality_milestones: Array.isArray(row.intentionality_milestones)
      ? row.intentionality_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies IntentionalityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            intentionality_score: Number(item.intentionality_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies IntentionalitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies IntentionalityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies IntentionalityRecommendation;
        })
      : [],
    intentionality_sessions: Array.isArray(row.intentionality_sessions)
      ? row.intentionality_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies IntentionalitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_discipline: String(exec.strategic_discipline ?? ""),
            purpose_alignment: String(exec.purpose_alignment ?? ""),
            leadership_reflection: String(exec.leadership_reflection ?? ""),
            opportunity_prioritization: String(exec.opportunity_prioritization ?? ""),
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

import type {
  ContinuityInsight,
  ContinuityMilestone,
  ContinuityRecommendation,
  ContinuityReview,
  ContinuitySession,
  ContinuitySnapshot,
  ContinuityTimelineEvent,
  DependencySignal,
  OrganizationalContinuityCenter,
  SuccessionItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalContinuityCenter(raw: unknown): OrganizationalContinuityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            continuity_score: Number(dash.continuity_score ?? 0),
            continuity_health_label: String(dash.continuity_health_label ?? "stable"),
            leadership_preparedness_pct: Number(dash.leadership_preparedness_pct ?? 0),
            knowledge_continuity_pct: Number(dash.knowledge_continuity_pct ?? 0),
            operational_resilience_pct: Number(dash.operational_resilience_pct ?? 0),
            strategic_stability_pct: Number(dash.strategic_stability_pct ?? 0),
            succession_readiness_pct: Number(dash.succession_readiness_pct ?? 0),
            documentation_maturity_pct: Number(dash.documentation_maturity_pct ?? 0),
            process_resilience_pct: Number(dash.process_resilience_pct ?? 0),
            cultural_preservation_pct: Number(dash.cultural_preservation_pct ?? 0),
            dependency_risks: Number(dash.dependency_risks ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    dependency_signals: Array.isArray(row.dependency_signals)
      ? row.dependency_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
            status: String(item.status ?? "open"),
          } satisfies DependencySignal;
        })
      : [],
    succession_items: Array.isArray(row.succession_items)
      ? row.succession_items.map((s) => {
          const item = asRecord(s);
          return {
            succession_key: String(item.succession_key ?? ""),
            domain: String(item.domain ?? ""),
            succession_type: String(item.succession_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "pending"),
          } satisfies SuccessionItem;
        })
      : [],
    continuity_reviews: Array.isArray(row.continuity_reviews)
      ? row.continuity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ContinuityReview;
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
          } satisfies ContinuityTimelineEvent;
        })
      : [],
    continuity_milestones: Array.isArray(row.continuity_milestones)
      ? row.continuity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ContinuityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            continuity_score: Number(item.continuity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies ContinuitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ContinuityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ContinuityRecommendation;
        })
      : [],
    continuity_sessions: Array.isArray(row.continuity_sessions)
      ? row.continuity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ContinuitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_continuity: String(exec.leadership_continuity ?? ""),
            strategic_consistency: String(exec.strategic_consistency ?? ""),
            knowledge_preservation: String(exec.knowledge_preservation ?? ""),
            resilience_opportunities: String(exec.resilience_opportunities ?? ""),
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

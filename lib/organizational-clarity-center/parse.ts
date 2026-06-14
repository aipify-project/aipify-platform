import type {
  OrganizationalClarityCenter,
  AlignmentPrompt,
  ClarityInitiative,
  ClarityInsight,
  ClarityMilestone,
  ClarityRecommendation,
  ClarityReview,
  ClaritySession,
  ClaritySignal,
  ClaritySnapshot,
  ClarityTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalClarityCenter(raw: unknown): OrganizationalClarityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            clarity_score: Number(dash.clarity_score ?? 0),
            clarity_health_label: String(dash.clarity_health_label ?? "healthy"),
            communication_effectiveness_pct: Number(dash.communication_effectiveness_pct ?? 0),
            role_understanding_pct: Number(dash.role_understanding_pct ?? 0),
            priority_transparency_pct: Number(dash.priority_transparency_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            communication_consistency_pct: Number(dash.communication_consistency_pct ?? 0),
            responsibility_awareness_pct: Number(dash.responsibility_awareness_pct ?? 0),
            priority_understanding_pct: Number(dash.priority_understanding_pct ?? 0),
            governance_transparency_pct: Number(dash.governance_transparency_pct ?? 0),
            expectation_alignment_pct: Number(dash.expectation_alignment_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    clarity_signals: Array.isArray(row.clarity_signals)
      ? row.clarity_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies ClaritySignal;
        })
      : [],
    alignment_prompts: Array.isArray(row.alignment_prompts)
      ? row.alignment_prompts.map((g) => {
          const item = asRecord(g);
          return {
            alignment_key: String(item.alignment_key ?? ""),
            alignment_type: String(item.alignment_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies AlignmentPrompt;
        })
      : [],
    clarity_initiatives: Array.isArray(row.clarity_initiatives)
      ? row.clarity_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies ClarityInitiative;
        })
      : [],
    clarity_reviews: Array.isArray(row.clarity_reviews)
      ? row.clarity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ClarityReview;
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
          } satisfies ClarityTimelineEvent;
        })
      : [],
    clarity_milestones: Array.isArray(row.clarity_milestones)
      ? row.clarity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ClarityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            clarity_score: Number(item.clarity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies ClaritySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ClarityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies ClarityRecommendation;
        })
      : [],
    clarity_sessions: Array.isArray(row.clarity_sessions)
      ? row.clarity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies ClaritySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            communication_effectiveness: String(exec.communication_effectiveness ?? ""),
            strategic_understanding: String(exec.strategic_understanding ?? ""),
            responsibility_transparency: String(exec.responsibility_transparency ?? ""),
            clarity_opportunities: String(exec.clarity_opportunities ?? ""),
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

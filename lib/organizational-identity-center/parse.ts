import type {
  OrganizationalIdentityCenter,
  PurposeAlignmentPrompt,
  IdentityInitiative,
  IdentityInsight,
  IdentityMilestone,
  IdentityRecommendation,
  IdentityReview,
  IdentitySession,
  IdentitySignal,
  IdentitySnapshot,
  IdentityTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalIdentityCenter(raw: unknown): OrganizationalIdentityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            identity_score: Number(dash.identity_score ?? 0),
            identity_health_label: String(dash.identity_health_label ?? "healthy"),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            values_alignment_pct: Number(dash.values_alignment_pct ?? 0),
            cultural_consistency_pct: Number(dash.cultural_consistency_pct ?? 0),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            legacy_preservation_pct: Number(dash.legacy_preservation_pct ?? 0),
            purpose_clarity_pct: Number(dash.purpose_clarity_pct ?? 0),
            values_consistency_pct: Number(dash.values_consistency_pct ?? 0),
            leadership_alignment_pct: Number(dash.leadership_alignment_pct ?? 0),
            cultural_reinforcement_pct: Number(dash.cultural_reinforcement_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    identity_signals: Array.isArray(row.identity_signals)
      ? row.identity_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies IdentitySignal;
        })
      : [],
    purpose_alignment_prompts: Array.isArray(row.purpose_alignment_prompts)
      ? row.purpose_alignment_prompts.map((g) => {
          const item = asRecord(g);
          return {
            application_key: String(item.application_key ?? ""),
            application_type: String(item.application_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies PurposeAlignmentPrompt;
        })
      : [],
    identity_initiatives: Array.isArray(row.identity_initiatives)
      ? row.identity_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies IdentityInitiative;
        })
      : [],
    identity_reviews: Array.isArray(row.identity_reviews)
      ? row.identity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies IdentityReview;
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
          } satisfies IdentityTimelineEvent;
        })
      : [],
    identity_milestones: Array.isArray(row.identity_milestones)
      ? row.identity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies IdentityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            identity_score: Number(item.identity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies IdentitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies IdentityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies IdentityRecommendation;
        })
      : [],
    identity_sessions: Array.isArray(row.identity_sessions)
      ? row.identity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies IdentitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            purpose_alignment: String(exec.purpose_alignment ?? ""),
            leadership_consistency: String(exec.leadership_consistency ?? ""),
            values_reinforcement: String(exec.values_reinforcement ?? ""),
            stewardship_opportunities: String(exec.stewardship_opportunities ?? ""),
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

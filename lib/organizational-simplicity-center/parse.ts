import type {
  FrictionPrompt,
  OrganizationalSimplicityCenter,
  SimplicityInsight,
  SimplicityMilestone,
  SimplicityRecommendation,
  SimplicityReview,
  SimplicitySession,
  SimplicitySignal,
  SimplicitySnapshot,
  SimplicityTimelineEvent,
  SimplificationInitiative,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalSimplicityCenter(raw: unknown): OrganizationalSimplicityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            simplicity_score: Number(dash.simplicity_score ?? 0),
            simplicity_health_label: String(dash.simplicity_health_label ?? "healthy"),
            complexity_reduction_pct: Number(dash.complexity_reduction_pct ?? 0),
            workflow_efficiency_pct: Number(dash.workflow_efficiency_pct ?? 0),
            process_clarity_pct: Number(dash.process_clarity_pct ?? 0),
            navigation_simplicity_pct: Number(dash.navigation_simplicity_pct ?? 0),
            communication_effectiveness_pct: Number(dash.communication_effectiveness_pct ?? 0),
            bureaucratic_burden_pct: Number(dash.bureaucratic_burden_pct ?? 0),
            accessibility_pct: Number(dash.accessibility_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    simplicity_signals: Array.isArray(row.simplicity_signals)
      ? row.simplicity_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies SimplicitySignal;
        })
      : [],
    friction_prompts: Array.isArray(row.friction_prompts)
      ? row.friction_prompts.map((g) => {
          const item = asRecord(g);
          return {
            question_key: String(item.question_key ?? ""),
            question_type: String(item.question_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies FrictionPrompt;
        })
      : [],
    simplification_initiatives: Array.isArray(row.simplification_initiatives)
      ? row.simplification_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies SimplificationInitiative;
        })
      : [],
    simplicity_reviews: Array.isArray(row.simplicity_reviews)
      ? row.simplicity_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SimplicityReview;
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
          } satisfies SimplicityTimelineEvent;
        })
      : [],
    simplicity_milestones: Array.isArray(row.simplicity_milestones)
      ? row.simplicity_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies SimplicityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            simplicity_score: Number(item.simplicity_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies SimplicitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SimplicityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SimplicityRecommendation;
        })
      : [],
    simplicity_sessions: Array.isArray(row.simplicity_sessions)
      ? row.simplicity_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SimplicitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            complexity_reduction: String(exec.complexity_reduction ?? ""),
            workflow_efficiency: String(exec.workflow_efficiency ?? ""),
            leadership_communication: String(exec.leadership_communication ?? ""),
            simplification_opportunities: String(exec.simplification_opportunities ?? ""),
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

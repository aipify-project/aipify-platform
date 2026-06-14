import type {
  BalancePrompt,
  OrganizationalRenewalCenter,
  RenewalInitiative,
  RenewalInsight,
  RenewalMilestone,
  RenewalOpportunity,
  RenewalRecommendation,
  RenewalReview,
  RenewalSession,
  RenewalSnapshot,
  RenewalTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalRenewalCenter(raw: unknown): OrganizationalRenewalCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            renewal_score: Number(dash.renewal_score ?? 0),
            renewal_health_label: String(dash.renewal_health_label ?? "healthy"),
            strategic_reassessment_pct: Number(dash.strategic_reassessment_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            learning_integration_pct: Number(dash.learning_integration_pct ?? 0),
            strategic_adaptability_pct: Number(dash.strategic_adaptability_pct ?? 0),
            learning_participation_pct: Number(dash.learning_participation_pct ?? 0),
            leadership_reflection_pct: Number(dash.leadership_reflection_pct ?? 0),
            capability_development_pct: Number(dash.capability_development_pct ?? 0),
            improvement_momentum_pct: Number(dash.improvement_momentum_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    renewal_opportunities: Array.isArray(row.renewal_opportunities)
      ? row.renewal_opportunities.map((o) => {
          const item = asRecord(o);
          return {
            opportunity_key: String(item.opportunity_key ?? ""),
            domain: String(item.domain ?? ""),
            opportunity_type: String(item.opportunity_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            opportunity_tone: String(item.opportunity_tone ?? "neutral"),
          } satisfies RenewalOpportunity;
        })
      : [],
    balance_prompts: Array.isArray(row.balance_prompts)
      ? row.balance_prompts.map((b) => {
          const item = asRecord(b);
          return {
            balance_key: String(item.balance_key ?? ""),
            balance_type: String(item.balance_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies BalancePrompt;
        })
      : [],
    renewal_initiatives: Array.isArray(row.renewal_initiatives)
      ? row.renewal_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies RenewalInitiative;
        })
      : [],
    renewal_reviews: Array.isArray(row.renewal_reviews)
      ? row.renewal_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies RenewalReview;
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
          } satisfies RenewalTimelineEvent;
        })
      : [],
    renewal_milestones: Array.isArray(row.renewal_milestones)
      ? row.renewal_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies RenewalMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            renewal_score: Number(item.renewal_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies RenewalSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies RenewalInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies RenewalRecommendation;
        })
      : [],
    renewal_sessions: Array.isArray(row.renewal_sessions)
      ? row.renewal_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies RenewalSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            strategic_evolution: String(exec.strategic_evolution ?? ""),
            leadership_development: String(exec.leadership_development ?? ""),
            capability_readiness: String(exec.capability_readiness ?? ""),
            renewal_opportunities: String(exec.renewal_opportunities ?? ""),
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

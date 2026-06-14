import type {
  ImpactHighlight,
  OrganizationalStewardshipCenter,
  StewardshipIndicator,
  StewardshipInsight,
  StewardshipMilestone,
  StewardshipRecommendation,
  StewardshipReflectionPrompt,
  StewardshipReview,
  StewardshipSession,
  StewardshipSnapshot,
  SuccessionIntegrationLink,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalStewardshipCenter(raw: unknown): OrganizationalStewardshipCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            stewardship_score: Number(dash.stewardship_score ?? 0),
            stewardship_health_label: String(dash.stewardship_health_label ?? "developing"),
            leadership_participation_pct: Number(dash.leadership_participation_pct ?? 0),
            resource_stewardship_pct: Number(dash.resource_stewardship_pct ?? 0),
            knowledge_continuity_pct: Number(dash.knowledge_continuity_pct ?? 0),
            governance_participation_pct: Number(dash.governance_participation_pct ?? 0),
            reflection_frequency_pct: Number(dash.reflection_frequency_pct ?? 0),
            sustainable_decisions_pct: Number(dash.sustainable_decisions_pct ?? 0),
            succession_preparedness_pct: Number(dash.succession_preparedness_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
            sessions_completed: Number(dash.sessions_completed ?? 0),
          }
        : null,
    stewardship_indicators: Array.isArray(row.stewardship_indicators)
      ? row.stewardship_indicators.map((a) => {
          const item = asRecord(a);
          return {
            indicator_key: String(item.indicator_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            indicator_score: Number(item.indicator_score ?? 0),
          } satisfies StewardshipIndicator;
        })
      : [],
    reflection_prompts: Array.isArray(row.reflection_prompts)
      ? row.reflection_prompts.map((r) => {
          const item = asRecord(r);
          return {
            reflection_key: String(item.reflection_key ?? ""),
            prompt: String(item.prompt ?? ""),
            domain: String(item.domain ?? ""),
          } satisfies StewardshipReflectionPrompt;
        })
      : [],
    stewardship_reviews: Array.isArray(row.stewardship_reviews)
      ? row.stewardship_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies StewardshipReview;
        })
      : [],
    impact_highlights: Array.isArray(row.impact_highlights)
      ? row.impact_highlights.map((h) => {
          const item = asRecord(h);
          return {
            highlight_key: String(item.highlight_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ImpactHighlight;
        })
      : [],
    stewardship_milestones: Array.isArray(row.stewardship_milestones)
      ? row.stewardship_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies StewardshipMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            stewardship_score: Number(item.stewardship_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies StewardshipSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies StewardshipInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies StewardshipRecommendation;
        })
      : [],
    stewardship_sessions: Array.isArray(row.stewardship_sessions)
      ? row.stewardship_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies StewardshipSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_continuity: String(exec.leadership_continuity ?? ""),
            long_term_readiness: String(exec.long_term_readiness ?? ""),
            responsibility_measures: String(exec.responsibility_measures ?? ""),
            stewardship_opportunities: String(exec.stewardship_opportunities ?? ""),
          }
        : null,
    succession_integration: Array.isArray(row.succession_integration)
      ? row.succession_integration.map((l) => {
          const item = asRecord(l);
          return {
            key: String(item.key ?? ""),
            label: String(item.label ?? ""),
            route: String(item.route ?? ""),
          } satisfies SuccessionIntegrationLink;
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

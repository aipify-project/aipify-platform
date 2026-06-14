import type {
  GrowthPrompt,
  OrganizationalSustainabilityCenter,
  SustainabilityConcern,
  SustainabilityInitiative,
  SustainabilityInsight,
  SustainabilityMilestone,
  SustainabilityRecommendation,
  SustainabilityReview,
  SustainabilitySession,
  SustainabilitySnapshot,
  SustainabilityTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalSustainabilityCenter(raw: unknown): OrganizationalSustainabilityCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            sustainability_score: Number(dash.sustainability_score ?? 0),
            sustainability_health_label: String(dash.sustainability_health_label ?? "healthy"),
            sustainability_trend_pct: Number(dash.sustainability_trend_pct ?? 0),
            capacity_indicators_pct: Number(dash.capacity_indicators_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            workforce_resilience_pct: Number(dash.workforce_resilience_pct ?? 0),
            operational_maintainability_pct: Number(dash.operational_maintainability_pct ?? 0),
            strategic_consistency_pct: Number(dash.strategic_consistency_pct ?? 0),
            leadership_preparedness_pct: Number(dash.leadership_preparedness_pct ?? 0),
            financial_stability_pct: Number(dash.financial_stability_pct ?? 0),
            resilience_measures_pct: Number(dash.resilience_measures_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    sustainability_concerns: Array.isArray(row.sustainability_concerns)
      ? row.sustainability_concerns.map((c) => {
          const item = asRecord(c);
          return {
            concern_key: String(item.concern_key ?? ""),
            domain: String(item.domain ?? ""),
            concern_type: String(item.concern_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            concern_tone: String(item.concern_tone ?? "neutral"),
          } satisfies SustainabilityConcern;
        })
      : [],
    growth_prompts: Array.isArray(row.growth_prompts)
      ? row.growth_prompts.map((g) => {
          const item = asRecord(g);
          return {
            growth_key: String(item.growth_key ?? ""),
            growth_type: String(item.growth_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies GrowthPrompt;
        })
      : [],
    sustainability_initiatives: Array.isArray(row.sustainability_initiatives)
      ? row.sustainability_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies SustainabilityInitiative;
        })
      : [],
    sustainability_reviews: Array.isArray(row.sustainability_reviews)
      ? row.sustainability_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SustainabilityReview;
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
          } satisfies SustainabilityTimelineEvent;
        })
      : [],
    sustainability_milestones: Array.isArray(row.sustainability_milestones)
      ? row.sustainability_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies SustainabilityMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            sustainability_score: Number(item.sustainability_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies SustainabilitySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SustainabilityInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies SustainabilityRecommendation;
        })
      : [],
    sustainability_sessions: Array.isArray(row.sustainability_sessions)
      ? row.sustainability_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies SustainabilitySession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            long_term_viability: String(exec.long_term_viability ?? ""),
            leadership_preparedness: String(exec.leadership_preparedness ?? ""),
            resilience_trends: String(exec.resilience_trends ?? ""),
            sustainability_opportunities: String(exec.sustainability_opportunities ?? ""),
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

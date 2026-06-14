import type {
  OrganizationalStewardshipCenter,
  ResponsibilityPrompt,
  StewardshipInitiative,
  StewardshipInsight,
  StewardshipMilestone,
  StewardshipRecommendation,
  StewardshipReview,
  StewardshipSession,
  StewardshipSignal,
  StewardshipSnapshot,
  StewardshipTimelineEvent,
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
            stewardship_health_label: String(dash.stewardship_health_label ?? "healthy"),
            leadership_stewardship_pct: Number(dash.leadership_stewardship_pct ?? 0),
            trust_preservation_pct: Number(dash.trust_preservation_pct ?? 0),
            knowledge_continuity_pct: Number(dash.knowledge_continuity_pct ?? 0),
            resource_sustainability_pct: Number(dash.resource_sustainability_pct ?? 0),
            strategic_consistency_pct: Number(dash.strategic_consistency_pct ?? 0),
            leadership_responsibility_pct: Number(dash.leadership_responsibility_pct ?? 0),
            customer_trust_pct: Number(dash.customer_trust_pct ?? 0),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    stewardship_signals: Array.isArray(row.stewardship_signals)
      ? row.stewardship_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies StewardshipSignal;
        })
      : [],
    responsibility_prompts: Array.isArray(row.responsibility_prompts)
      ? row.responsibility_prompts.map((g) => {
          const item = asRecord(g);
          return {
            question_key: String(item.question_key ?? ""),
            question_type: String(item.question_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies ResponsibilityPrompt;
        })
      : [],
    stewardship_initiatives: Array.isArray(row.stewardship_initiatives)
      ? row.stewardship_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies StewardshipInitiative;
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
          } satisfies StewardshipTimelineEvent;
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
            leadership_responsibility: String(exec.leadership_responsibility ?? ""),
            trust_preservation: String(exec.trust_preservation ?? ""),
            knowledge_continuity: String(exec.knowledge_continuity ?? ""),
            future_investment_opportunities: String(exec.future_investment_opportunities ?? ""),
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

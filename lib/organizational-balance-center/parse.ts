import type {
  OrganizationalBalanceCenter,
  RecalibrationPrompt,
  BalanceInitiative,
  BalanceInsight,
  BalanceMilestone,
  BalanceRecommendation,
  BalanceReview,
  BalanceSession,
  BalanceSignal,
  BalanceSnapshot,
  BalanceTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalBalanceCenter(raw: unknown): OrganizationalBalanceCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            balance_score: Number(dash.balance_score ?? 0),
            balance_health_label: String(dash.balance_health_label ?? "healthy"),
            initiatives_in_progress: Number(dash.initiatives_in_progress ?? 0),
            sustainability_indicators_pct: Number(dash.sustainability_indicators_pct ?? 0),
            strategic_pacing_pct: Number(dash.strategic_pacing_pct ?? 0),
            leadership_consistency_pct: Number(dash.leadership_consistency_pct ?? 0),
            workforce_resilience_pct: Number(dash.workforce_resilience_pct ?? 0),
            governance_effectiveness_pct: Number(dash.governance_effectiveness_pct ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    balance_signals: Array.isArray(row.balance_signals)
      ? row.balance_signals.map((c) => {
          const item = asRecord(c);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies BalanceSignal;
        })
      : [],
    recalibration_prompts: Array.isArray(row.recalibration_prompts)
      ? row.recalibration_prompts.map((g) => {
          const item = asRecord(g);
          return {
            application_key: String(item.application_key ?? ""),
            application_type: String(item.application_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
          } satisfies RecalibrationPrompt;
        })
      : [],
    balance_initiatives: Array.isArray(row.balance_initiatives)
      ? row.balance_initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "planned"),
          } satisfies BalanceInitiative;
        })
      : [],
    balance_reviews: Array.isArray(row.balance_reviews)
      ? row.balance_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies BalanceReview;
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
          } satisfies BalanceTimelineEvent;
        })
      : [],
    balance_milestones: Array.isArray(row.balance_milestones)
      ? row.balance_milestones.map((m) => {
          const item = asRecord(m);
          return {
            milestone_key: String(item.milestone_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies BalanceMilestone;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            balance_score: Number(item.balance_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies BalanceSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies BalanceInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies BalanceRecommendation;
        })
      : [],
    balance_sessions: Array.isArray(row.balance_sessions)
      ? row.balance_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies BalanceSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            sustainability_indicators: String(exec.sustainability_indicators ?? ""),
            strategic_pacing: String(exec.strategic_pacing ?? ""),
            leadership_consistency: String(exec.leadership_consistency ?? ""),
            equilibrium_opportunities: String(exec.equilibrium_opportunities ?? ""),
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

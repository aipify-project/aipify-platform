import type {
  ArchivedScenario,
  FutureScenario,
  FutureSignal,
  FuturesInsight,
  FuturesRecommendation,
  FuturesReview,
  FuturesSession,
  FuturesTimelineEvent,
  ForesightSnapshot,
  OrganizationalFuturesCenter,
  ReadinessItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalFuturesCenter(raw: unknown): OrganizationalFuturesCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            readiness_score: Number(dash.readiness_score ?? 0),
            readiness_label: String(dash.readiness_label ?? "developing"),
            scenarios_explored: Number(dash.scenarios_explored ?? 0),
            scenarios_total: Number(dash.scenarios_total ?? 0),
            signals_identified: Number(dash.signals_identified ?? 0),
            preparedness_initiatives: Number(dash.preparedness_initiatives ?? 0),
            review_participation_pct: Number(dash.review_participation_pct ?? 0),
            capabilities_readiness_pct: Number(dash.capabilities_readiness_pct ?? 0),
            governance_readiness_pct: Number(dash.governance_readiness_pct ?? 0),
            technology_readiness_pct: Number(dash.technology_readiness_pct ?? 0),
            leadership_readiness_pct: Number(dash.leadership_readiness_pct ?? 0),
            strategic_flexibility_pct: Number(dash.strategic_flexibility_pct ?? 0),
            executive_confidence: Number(dash.executive_confidence ?? 0),
            reviews_completed: Number(dash.reviews_completed ?? 0),
          }
        : null,
    scenarios: Array.isArray(row.scenarios)
      ? row.scenarios.map((s) => {
          const item = asRecord(s);
          return {
            scenario_key: String(item.scenario_key ?? ""),
            domain: String(item.domain ?? ""),
            scenario_type: String(item.scenario_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            status: String(item.status ?? "draft"),
          } satisfies FutureScenario;
        })
      : [],
    future_signals: Array.isArray(row.future_signals)
      ? row.future_signals.map((s) => {
          const item = asRecord(s);
          return {
            signal_key: String(item.signal_key ?? ""),
            domain: String(item.domain ?? ""),
            signal_type: String(item.signal_type ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            signal_tone: String(item.signal_tone ?? "neutral"),
          } satisfies FutureSignal;
        })
      : [],
    readiness_items: Array.isArray(row.readiness_items)
      ? row.readiness_items.map((r) => {
          const item = asRecord(r);
          return {
            readiness_key: String(item.readiness_key ?? ""),
            dimension: String(item.dimension ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            readiness_level: String(item.readiness_level ?? "developing"),
          } satisfies ReadinessItem;
        })
      : [],
    futures_reviews: Array.isArray(row.futures_reviews)
      ? row.futures_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FuturesReview;
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
          } satisfies FuturesTimelineEvent;
        })
      : [],
    archived_scenarios: Array.isArray(row.archived_scenarios)
      ? row.archived_scenarios.map((a) => {
          const item = asRecord(a);
          return {
            archive_key: String(item.archive_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            summary: String(item.summary ?? ""),
            archived_at: item.archived_at ? String(item.archived_at) : null,
          } satisfies ArchivedScenario;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            readiness_score: Number(item.readiness_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies ForesightSnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FuturesInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FuturesRecommendation;
        })
      : [],
    futures_sessions: Array.isArray(row.futures_sessions)
      ? row.futures_sessions.map((s) => {
          const item = asRecord(s);
          return {
            session_key: String(item.session_key ?? ""),
            session_type: String(item.session_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FuturesSession;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            scenario_readiness: String(exec.scenario_readiness ?? ""),
            strategic_resilience: String(exec.strategic_resilience ?? ""),
            emerging_signals: String(exec.emerging_signals ?? ""),
            long_term_opportunities: String(exec.long_term_opportunities ?? ""),
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

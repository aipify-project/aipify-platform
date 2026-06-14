import type {
  FocusInitiative,
  FocusInsight,
  FocusOverload,
  FocusRecommendation,
  FocusReview,
  FocusSnapshot,
  FocusTimelineEvent,
  OrganizationalFocusCenter,
  PrioritizationFactor,
  PriorityDistribution,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalFocusCenter(raw: unknown): OrganizationalFocusCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            focus_score: Number(dash.focus_score ?? 0),
            focus_health_label: String(dash.focus_health_label ?? "stable"),
            active_initiatives: Number(dash.active_initiatives ?? 0),
            strong_focus_count: Number(dash.strong_focus_count ?? 0),
            focus_risks: Number(dash.focus_risks ?? 0),
            overload_open: Number(dash.overload_open ?? 0),
            initiative_concentration_pct: Number(dash.initiative_concentration_pct ?? 0),
            priority_clarity_pct: Number(dash.priority_clarity_pct ?? 0),
            review_discipline_pct: Number(dash.review_discipline_pct ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    initiatives: Array.isArray(row.initiatives)
      ? row.initiatives.map((i) => {
          const item = asRecord(i);
          return {
            initiative_key: String(item.initiative_key ?? ""),
            domain: String(item.domain ?? ""),
            title: String(item.title ?? ""),
            owner_label: String(item.owner_label ?? ""),
            summary: String(item.summary ?? ""),
            focus_score: Number(item.focus_score ?? 0),
            status: String(item.status ?? "active"),
          } satisfies FocusInitiative;
        })
      : [],
    priority_distribution: Array.isArray(row.priority_distribution)
      ? row.priority_distribution.map((p) => {
          const item = asRecord(p);
          return {
            priority_key: String(item.priority_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            weight_pct: Number(item.weight_pct ?? 0),
          } satisfies PriorityDistribution;
        })
      : [],
    overloads: Array.isArray(row.overloads)
      ? row.overloads.map((o) => {
          const item = asRecord(o);
          return {
            overload_key: String(item.overload_key ?? ""),
            overload_type: String(item.overload_type ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies FocusOverload;
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((t) => {
          const item = asRecord(t);
          return {
            timeline_key: String(item.timeline_key ?? ""),
            event_type: String(item.event_type ?? ""),
            label: String(item.label ?? ""),
            summary: String(item.summary ?? ""),
            recorded_at: item.recorded_at ? String(item.recorded_at) : null,
          } satisfies FocusTimelineEvent;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            initiative_label: String(item.initiative_label ?? ""),
            focus_score: Number(item.focus_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies FocusSnapshot;
        })
      : [],
    prioritization_factors: Array.isArray(row.prioritization_factors)
      ? row.prioritization_factors.map((f) => {
          const item = asRecord(f);
          return {
            factor_key: String(item.factor_key ?? ""),
            label: String(item.label ?? ""),
            guidance: String(item.guidance ?? ""),
          } satisfies PrioritizationFactor;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FocusInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies FocusRecommendation;
        })
      : [],
    focus_reviews: Array.isArray(row.focus_reviews)
      ? row.focus_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies FocusReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            attention_trends: String(exec.attention_trends ?? ""),
            strategic_concentration: String(exec.strategic_concentration ?? ""),
            overload_risks: String(exec.overload_risks ?? ""),
            priority_alignment: String(exec.priority_alignment ?? ""),
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

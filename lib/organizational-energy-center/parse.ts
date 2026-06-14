import type {
  CapacityIndicator,
  EnergyInsight,
  EnergyPattern,
  EnergyRecommendation,
  EnergyReview,
  EnergySnapshot,
  EnergyTimelineEvent,
  LoadTrend,
  OrganizationalEnergyCenter,
  RecoveryOpportunity,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseOrganizationalEnergyCenter(raw: unknown): OrganizationalEnergyCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const exec = asRecord(row.executive_view);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            energy_score: Number(dash.energy_score ?? 0),
            energy_health_label: String(dash.energy_health_label ?? "balanced"),
            capacity_indicators: Number(dash.capacity_indicators ?? 0),
            recovery_opportunities: Number(dash.recovery_opportunities ?? 0),
            focus_alerts: Number(dash.focus_alerts ?? 0),
            initiative_load_pct: Number(dash.initiative_load_pct ?? 0),
            review_intensity_pct: Number(dash.review_intensity_pct ?? 0),
            change_saturation_pct: Number(dash.change_saturation_pct ?? 0),
            recovery_headroom: Number(dash.recovery_headroom ?? 0),
            leadership_confidence: Number(dash.leadership_confidence ?? 0),
          }
        : null,
    capacity_indicators: Array.isArray(row.capacity_indicators)
      ? row.capacity_indicators.map((c) => {
          const item = asRecord(c);
          return {
            capacity_key: String(item.capacity_key ?? ""),
            domain: String(item.domain ?? ""),
            label: String(item.label ?? ""),
            value_label: String(item.value_label ?? ""),
            trend: String(item.trend ?? "stable"),
          } satisfies CapacityIndicator;
        })
      : [],
    energy_patterns: Array.isArray(row.energy_patterns)
      ? row.energy_patterns.map((p) => {
          const item = asRecord(p);
          return {
            pattern_key: String(item.pattern_key ?? ""),
            pattern_type: String(item.pattern_type ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies EnergyPattern;
        })
      : [],
    recovery_opportunities: Array.isArray(row.recovery_opportunities)
      ? row.recovery_opportunities.map((r) => {
          const item = asRecord(r);
          return {
            recovery_key: String(item.recovery_key ?? ""),
            label: String(item.label ?? ""),
            guidance: String(item.guidance ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies RecoveryOpportunity;
        })
      : [],
    load_trends: Array.isArray(row.load_trends)
      ? row.load_trends.map((t) => {
          const item = asRecord(t);
          return {
            trend_key: String(item.trend_key ?? ""),
            label: String(item.label ?? ""),
            load_pct: Number(item.load_pct ?? 0),
            period_label: String(item.period_label ?? ""),
          } satisfies LoadTrend;
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
          } satisfies EnergyTimelineEvent;
        })
      : [],
    snapshots: Array.isArray(row.snapshots)
      ? row.snapshots.map((s) => {
          const item = asRecord(s);
          return {
            snapshot_key: String(item.snapshot_key ?? ""),
            period_label: String(item.period_label ?? ""),
            energy_score: Number(item.energy_score ?? 0),
            summary: String(item.summary ?? ""),
            captured_at: item.captured_at ? String(item.captured_at) : null,
          } satisfies EnergySnapshot;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EnergyInsight;
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies EnergyRecommendation;
        })
      : [],
    energy_reviews: Array.isArray(row.energy_reviews)
      ? row.energy_reviews.map((r) => {
          const item = asRecord(r);
          return {
            review_key: String(item.review_key ?? ""),
            review_type: String(item.review_type ?? ""),
            prompt: String(item.prompt ?? ""),
            status: String(item.status ?? "pending"),
            completed_at: item.completed_at ? String(item.completed_at) : null,
          } satisfies EnergyReview;
        })
      : [],
    executive_view:
      Object.keys(exec).length > 0
        ? {
            leadership_demand: String(exec.leadership_demand ?? ""),
            strategic_pacing: String(exec.strategic_pacing ?? ""),
            recovery_opportunities: String(exec.recovery_opportunities ?? ""),
            sustainable_execution: String(exec.sustainable_execution ?? ""),
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

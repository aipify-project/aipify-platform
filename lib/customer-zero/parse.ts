import type { CustomerZeroCenter, CustomerZeroExpansionGate, CustomerZeroRecommendation } from "./types";
import { PILOT_LEVELS } from "./constants";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseCustomerZeroCenter(raw: unknown): CustomerZeroCenter {
  const row = asRecord(raw);
  const settings = asRecord(row.settings);
  const level = Number(settings.pilot_level ?? row.pilot_level ?? 1);

  return {
    pilot_level: PILOT_LEVELS.includes(level as (typeof PILOT_LEVELS)[number])
      ? (level as CustomerZeroCenter["pilot_level"])
      : 1,
    readiness_state: String(settings.readiness_state ?? row.readiness_state ?? "learning"),
    readiness_message: String(row.readiness_message ?? ""),
    learning_sources: Array.isArray(row.learning_sources)
      ? row.learning_sources.map((source) => {
          const s = asRecord(source);
          return {
            source_key: String(s.source_key ?? ""),
            source_label: String(s.source_label ?? ""),
            source_type: String(s.source_type ?? ""),
            item_count: Number(s.item_count ?? 0),
            indexed_count: Number(s.indexed_count ?? 0),
            status: String(s.status ?? "discovered"),
          };
        })
      : [],
    readiness: Array.isArray(row.readiness)
      ? row.readiness.map((item) => {
          const r = asRecord(item);
          return {
            dimension_key: String(r.dimension_key ?? ""),
            score: Number(r.score ?? 0),
            state: String(r.state ?? "learning"),
            notes: r.notes ? String(r.notes) : null,
          };
        })
      : [],
    pending_recommendations: Array.isArray(row.pending_recommendations)
      ? row.pending_recommendations.map(parseRecommendation)
      : [],
    value_metrics: Array.isArray(row.value_metrics)
      ? row.value_metrics.map((metric) => {
          const m = asRecord(metric);
          return {
            metric_key: String(m.metric_key ?? ""),
            metric_value: Number(m.metric_value ?? 0),
            period: String(m.period ?? "30d"),
          };
        })
      : [],
    expansion_gate: row.expansion_gate ? parseExpansionGate(row.expansion_gate) : null,
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((entry) => {
          const e = asRecord(entry);
          return {
            id: String(e.id ?? ""),
            event_type: String(e.event_type ?? ""),
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
          };
        })
      : [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    pilot_overview: row.pilot_overview ? asRecord(row.pilot_overview) : null,
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

function parseRecommendation(raw: unknown): CustomerZeroRecommendation {
  const row = asRecord(raw);
  const level = Number(row.pilot_level ?? 2);
  return {
    id: String(row.id ?? ""),
    recommendation_type: String(row.recommendation_type ?? ""),
    pilot_level: PILOT_LEVELS.includes(level as (typeof PILOT_LEVELS)[number])
      ? (level as CustomerZeroRecommendation["pilot_level"])
      : 2,
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    confidence: String(row.confidence ?? "moderate"),
    status: String(row.status ?? "pending"),
    requires_approval: Boolean(row.requires_approval ?? true),
  };
}

function parseExpansionGate(raw: unknown): CustomerZeroExpansionGate {
  const row = asRecord(raw);
  return {
    pilot_kpis_achieved: Boolean(row.pilot_kpis_achieved),
    stable_governance: Boolean(row.stable_governance),
    positive_admin_feedback: Boolean(row.positive_admin_feedback),
    demonstrated_time_savings: Boolean(row.demonstrated_time_savings),
    proven_operational_value: Boolean(row.proven_operational_value),
    acceptable_error_rates: Boolean(row.acceptable_error_rates),
    external_rollout_approved: Boolean(row.external_rollout_approved),
    gate_status: String(row.gate_status ?? "blocked"),
  };
}

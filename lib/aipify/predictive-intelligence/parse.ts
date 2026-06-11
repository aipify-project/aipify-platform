import type {
  PredictionsCenter,
  PredictionModel,
  PredictionSettings,
  PredictiveAlert,
} from "./types";

function asAlert(raw: unknown): PredictiveAlert | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  return {
    id: o.id,
    alert_type: o.alert_type as PredictiveAlert["alert_type"],
    severity: o.severity as PredictiveAlert["severity"],
    title: o.title,
    summary: String(o.summary ?? ""),
    evidence: (o.evidence as Record<string, unknown>) ?? {},
    recommendation: o.recommendation == null ? null : String(o.recommendation),
    confidence_score: Number(o.confidence_score ?? 0.7),
    predicted_date: o.predicted_date == null ? null : String(o.predicted_date),
    status: o.status as PredictiveAlert["status"],
    acknowledged_at: o.acknowledged_at == null ? null : String(o.acknowledged_at),
    resolved_at: o.resolved_at == null ? null : String(o.resolved_at),
    snoozed_until: o.snoozed_until == null ? null : String(o.snoozed_until),
    generated_by: String(o.generated_by ?? "aipify"),
    created_at: String(o.created_at ?? ""),
    updated_at: String(o.updated_at ?? ""),
  };
}

export function parsePredictionsCenter(data: unknown): PredictionsCenter {
  const o = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const alerts = Array.isArray(o.alerts)
    ? o.alerts.map(asAlert).filter((a): a is PredictiveAlert => a !== null)
    : undefined;
  const resolved = Array.isArray(o.resolved_recent)
    ? o.resolved_recent.map(asAlert).filter((a): a is PredictiveAlert => a !== null)
    : undefined;

  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    enabled: o.enabled == null ? undefined : Boolean(o.enabled),
    upgrade_required: Boolean(o.upgrade_required),
    plan: o.plan == null ? undefined : String(o.plan),
    privacy_note: o.privacy_note == null ? undefined : String(o.privacy_note),
    settings_url: o.settings_url == null ? undefined : String(o.settings_url),
    open_alerts: o.open_alerts == null ? undefined : Number(o.open_alerts),
    upcoming_week: o.upcoming_week == null ? undefined : Number(o.upcoming_week),
    prediction_horizon_days:
      o.prediction_horizon_days == null ? undefined : Number(o.prediction_horizon_days),
    alerts,
    resolved_recent: resolved,
  };
}

export function parsePredictionSettings(data: unknown): {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  settings: PredictionSettings | null;
  models: PredictionModel[];
} {
  const o = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const s =
    o.settings && typeof o.settings === "object"
      ? (o.settings as Record<string, unknown>)
      : null;

  const models = Array.isArray(o.models)
    ? o.models
        .filter((m) => m && typeof m === "object")
        .map((m) => {
          const row = m as Record<string, unknown>;
          return {
            id: String(row.id),
            model_key: String(row.model_key),
            description: row.description == null ? null : String(row.description),
            category: String(row.category ?? "operations"),
            enabled: Boolean(row.enabled ?? true),
            thresholds: (row.thresholds as Record<string, unknown>) ?? {},
          };
        })
    : [];

  return {
    has_customer: Boolean(o.has_customer),
    has_access: Boolean(o.has_access),
    upgrade_required: Boolean(o.upgrade_required),
    settings: s
      ? {
          enabled: Boolean(s.enabled),
          allow_bottleneck_predictions: Boolean(s.allow_bottleneck_predictions),
          allow_churn_predictions: Boolean(s.allow_churn_predictions),
          allow_workload_predictions: Boolean(s.allow_workload_predictions),
          allow_growth_predictions: Boolean(s.allow_growth_predictions),
          allow_followup_predictions: Boolean(s.allow_followup_predictions),
          allow_sla_predictions: Boolean(s.allow_sla_predictions),
          require_admin_approval_for_actions: Boolean(
            s.require_admin_approval_for_actions
          ),
          prediction_horizon_days: Number(s.prediction_horizon_days ?? 14),
        }
      : null,
    models,
  };
}

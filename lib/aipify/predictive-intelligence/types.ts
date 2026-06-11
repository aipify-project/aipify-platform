export const ALERT_TYPES = [
  "future_bottleneck",
  "churn_risk",
  "workload_risk",
  "growth_opportunity",
  "followup_risk",
  "sla_risk",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_SEVERITIES = [
  "info",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_STATUSES = [
  "open",
  "acknowledged",
  "dismissed",
  "resolved",
  "snoozed",
] as const;

export type AlertStatus = (typeof ALERT_STATUSES)[number];

export type PredictiveAlert = {
  id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  recommendation: string | null;
  confidence_score: number;
  predicted_date: string | null;
  status: AlertStatus;
  acknowledged_at: string | null;
  resolved_at: string | null;
  snoozed_until: string | null;
  generated_by: string;
  created_at: string;
  updated_at: string;
};

export type PredictionSettings = {
  enabled: boolean;
  allow_bottleneck_predictions: boolean;
  allow_churn_predictions: boolean;
  allow_workload_predictions: boolean;
  allow_growth_predictions: boolean;
  allow_followup_predictions: boolean;
  allow_sla_predictions: boolean;
  require_admin_approval_for_actions: boolean;
  prediction_horizon_days: number;
};

export type PredictionModel = {
  id: string;
  model_key: string;
  description: string | null;
  category: string;
  enabled: boolean;
  thresholds: Record<string, unknown>;
};

export type PredictionsCenter = {
  has_customer: boolean;
  has_access: boolean;
  enabled?: boolean;
  upgrade_required: boolean;
  plan?: string;
  privacy_note?: string;
  settings_url?: string;
  open_alerts?: number;
  upcoming_week?: number;
  prediction_horizon_days?: number;
  alerts?: PredictiveAlert[];
  resolved_recent?: PredictiveAlert[];
};

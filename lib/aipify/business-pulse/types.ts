import type {
  PulseAlertSeverity,
  PulseAlertStatus,
  PulseArea,
  PulseStatus,
} from "./dimensions";

export type PulseMetric = {
  metric_name: string;
  current_value: number;
  expected_value: number;
  difference_percent: number;
  direction: "up" | "down" | "stable";
  status: PulseStatus;
  explanation: string;
  recommendation: string;
};

export type PulseAreaSnapshot = {
  area: PulseArea;
  status: PulseStatus;
  metrics?: PulseMetric[];
  summary?: string;
};

export type PulseAlert = {
  id: string;
  alert_type: string;
  source_module: string;
  title: string;
  description: string;
  severity: PulseAlertSeverity;
  status: PulseAlertStatus;
  metric_name?: string;
  current_value?: number;
  expected_value?: number;
  difference_percent?: number;
  recommendation_text?: string;
  created_at: string;
};

export type PulseSnapshot = {
  id: string;
  pulse_date: string;
  overall_status: PulseStatus;
  support_status: PulseStatus;
  sales_status: PulseStatus;
  operations_status: PulseStatus;
  team_status: PulseStatus;
  customer_status: PulseStatus;
  automation_status: PulseStatus;
  summary_text: string;
  metrics_json: Record<string, unknown>;
  anomalies_json: unknown[];
  recommendations_json: string[];
  created_at: string;
};

export type BusinessPulseCenter = {
  has_customer: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  plan?: string;
  enterprise_features?: boolean;
  overall_status?: PulseStatus;
  briefing?: string;
  since_yesterday?: unknown[];
  since_last_week?: unknown[];
  areas?: PulseAreaSnapshot[];
  normal_areas?: PulseArea[];
  attention_areas?: PulseArea[];
  snapshot?: PulseSnapshot | null;
  alerts?: PulseAlert[];
  history?: PulseSnapshot[];
  recommended_focus?: string[];
  data_sources?: string[];
  privacy_note?: string;
};

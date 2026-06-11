export type ValueMetricRecord = {
  id?: string;
  metric_name?: string;
  category?: string;
  baseline_value?: number;
  current_value?: number;
  improvement_percentage?: number;
  measurement_period?: string;
  [key: string]: unknown;
};

export type ValueBaselineRecord = {
  id?: string;
  baseline_type?: string;
  baseline_value?: number;
  unit?: string;
  metadata?: Record<string, unknown>;
  captured_at?: string;
  [key: string]: unknown;
};

export type ValueMilestoneRecord = {
  id?: string;
  milestone_name?: string;
  milestone_key?: string;
  target_value?: number;
  current_value?: number;
  status?: string;
  achieved_at?: string;
  [key: string]: unknown;
};

export type ValueSettingsRecord = {
  reporting_enabled?: boolean;
  default_measurement_period?: string;
  executive_visibility?: boolean;
  auto_suggest_improvements?: boolean;
  [key: string]: unknown;
};

export type ValueImprovementSuggestion = {
  category?: string;
  metric_name?: string;
  improvement_percentage?: number;
  recommendation?: string;
  confidence?: string;
  [key: string]: unknown;
};

export type ValueReportExportPayload = {
  id?: string;
  report_type?: string;
  status?: string;
  period_start?: string;
  period_end?: string;
  summary_metadata?: Record<string, unknown>;
  exported_at?: string;
  privacy_note?: string;
  [key: string]: unknown;
};

export type ValueRealizationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  metrics_count?: number;
  avg_improvement?: number;
  pending_milestones?: number;
  [key: string]: unknown;
};

export type ValueRealizationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  metrics?: ValueMetricRecord[];
  baselines?: ValueBaselineRecord[];
  milestones?: ValueMilestoneRecord[];
  settings?: ValueSettingsRecord;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ValueRoiMetric = {
  id?: string;
  metric_key?: string;
  metric_title?: string;
  period_type?: string;
  subscription_cost?: number;
  operational_savings?: number;
  revenue_impact?: number;
  efficiency_gains?: number;
  risk_reduction?: number;
  net_roi_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueTimeSaving = {
  id?: string;
  savings_key?: string;
  savings_title?: string;
  hours_saved?: number;
  tasks_automated?: number;
  category?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ValueCostSaving = {
  id?: string;
  savings_key?: string;
  savings_title?: string;
  savings_type?: string;
  amount?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueRevenueImpact = {
  id?: string;
  impact_key?: string;
  impact_title?: string;
  impact_type?: string;
  amount?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueWorkforceImpact = {
  id?: string;
  impact_key?: string;
  impact_title?: string;
  impact_type?: string;
  score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueStrategicImpact = {
  id?: string;
  impact_key?: string;
  impact_title?: string;
  impact_type?: string;
  score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueTimelineEntry = {
  id?: string;
  timeline_key?: string;
  period_label?: string;
  estimated_value?: number;
  hours_saved?: number;
  cost_savings?: number;
  revenue_impact?: number;
  roi_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueBenchmark = {
  id?: string;
  benchmark_key?: string;
  benchmark_title?: string;
  benchmark_type?: string;
  current_value?: number;
  comparison_value?: number;
  variance_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ValueReport = {
  id?: string;
  report_key?: string;
  report_title?: string;
  report_type?: string;
  status?: string;
  summary?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ValueIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ValueAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EnterpriseValueRealizationRoiCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  value_engine_route?: string;
  value_realization_route?: string;
  impact_metrics_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  roi_metrics?: ValueRoiMetric[];
  time_savings?: ValueTimeSaving[];
  cost_savings?: ValueCostSaving[];
  revenue_impact?: ValueRevenueImpact[];
  workforce_impact?: ValueWorkforceImpact[];
  strategic_impact?: ValueStrategicImpact[];
  value_timeline?: ValueTimelineEntry[];
  benchmarks?: ValueBenchmark[];
  value_reports?: ValueReport[];
  intelligence_signals?: ValueIntelligenceSignal[];
  advisor_signals?: ValueAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};

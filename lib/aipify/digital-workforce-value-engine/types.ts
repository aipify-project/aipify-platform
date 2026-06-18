export type DepartmentValue = {
  id?: string;
  department_key?: string;
  department_name?: string;
  department_type?: string;
  support_value?: number;
  sales_value?: number;
  productivity_gain_percent?: number;
  automation_value?: number;
  roi_percent?: number;
  [key: string]: unknown;
};

export type ValueScorecard = {
  id?: string;
  scorecard_key?: string;
  employee_name?: string;
  performance_score?: number;
  reliability_score?: number;
  productivity_score?: number;
  savings_generated?: number;
  business_impact_score?: number;
  automation_coverage?: number;
  overall_value_score?: number;
  [key: string]: unknown;
};

export type RoiAnalysis = {
  id?: string;
  analysis_key?: string;
  analysis_title?: string;
  workforce_cost?: number;
  operational_savings?: number;
  productivity_gains?: number;
  revenue_impact?: number;
  automation_value?: number;
  return_on_investment?: number;
  [key: string]: unknown;
};

export type ValueForecast = {
  id?: string;
  forecast_key?: string;
  forecast_title?: string;
  forecast_horizon?: string;
  future_savings?: number;
  future_productivity_gains?: number;
  workforce_expansion_roi?: number;
  [key: string]: unknown;
};

export type ValueBenchmark = {
  id?: string;
  benchmark_key?: string;
  benchmark_title?: string;
  benchmark_scope?: string;
  comparison_data?: unknown;
  [key: string]: unknown;
};

export type WorkforceEconomics = {
  id?: string;
  economics_key?: string;
  platform_costs?: number;
  licensing_costs?: number;
  department_costs?: number;
  operational_costs?: number;
  training_costs?: number;
  infrastructure_costs?: number;
  workforce_allocation?: Record<string, unknown>;
  [key: string]: unknown;
};

export type BusinessValueMetric = {
  id?: string;
  metric_key?: string;
  metric_period?: string;
  hours_saved?: number;
  employees_assisted?: number;
  tasks_completed?: number;
  projects_accelerated?: number;
  customer_requests_resolved?: number;
  operational_efficiency?: number;
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

export type DigitalWorkforceValueCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  recruitment_route?: string;
  lifecycle_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  department_value?: DepartmentValue[];
  scorecards?: ValueScorecard[];
  roi_analyses?: RoiAnalysis[];
  forecasts?: ValueForecast[];
  benchmarks?: ValueBenchmark[];
  workforce_economics?: WorkforceEconomics[];
  business_metrics?: BusinessValueMetric[];
  advisor_signals?: ValueAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};

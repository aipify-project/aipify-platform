export type StrategicObjective = {
  id?: string;
  objective_key?: string;
  objective_title?: string;
  owner_name?: string;
  timeline_label?: string;
  progress_percent?: number;
  status?: string;
  expected_outcomes?: unknown;
  [key: string]: unknown;
};

export type StrategicInitiative = {
  id?: string;
  initiative_key?: string;
  initiative_title?: string;
  owner_name?: string;
  impact_score?: number;
  status?: string;
  [key: string]: unknown;
};

export type ExecutiveBriefing = {
  id?: string;
  briefing_key?: string;
  briefing_title?: string;
  briefing_type?: string;
  executive_summary?: string;
  generated_at?: string;
  [key: string]: unknown;
};

export type StrategicRisk = {
  id?: string;
  risk_key?: string;
  risk_title?: string;
  risk_category?: string;
  severity?: string;
  likelihood?: string;
  status?: string;
  impact_summary?: string;
  [key: string]: unknown;
};

export type StrategicOpportunity = {
  id?: string;
  opportunity_key?: string;
  opportunity_title?: string;
  opportunity_category?: string;
  potential_impact?: string;
  status?: string;
  recommendation?: string;
  [key: string]: unknown;
};

export type StrategicForecast = {
  id?: string;
  forecast_key?: string;
  forecast_title?: string;
  forecast_category?: string;
  forecast_horizon?: string;
  projected_value?: number;
  confidence_percent?: number;
  trend_direction?: string;
  [key: string]: unknown;
};

export type StrategicScenario = {
  id?: string;
  scenario_key?: string;
  scenario_title?: string;
  scenario_type?: string;
  outcome_summary?: string;
  probability_percent?: number;
  [key: string]: unknown;
};

export type ExecutivePriority = {
  id?: string;
  priority_key?: string;
  priority_title?: string;
  owner_name?: string;
  business_impact?: string;
  status?: string;
  deadline_at?: string;
  [key: string]: unknown;
};

export type CompetitiveSignal = {
  id?: string;
  signal_key?: string;
  signal_type?: string;
  observation?: string;
  relevance?: string;
  [key: string]: unknown;
};

export type DecisionSupportReport = {
  id?: string;
  report_key?: string;
  report_title?: string;
  recommendation?: string;
  confidence?: string;
  generated_at?: string;
  [key: string]: unknown;
};

export type ExecutiveAdvisorSignal = {
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

export type EnterpriseStrategicIntelligenceAdvisoryCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  decision_support_route?: string;
  executive_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  objectives?: StrategicObjective[];
  initiatives?: StrategicInitiative[];
  briefings?: ExecutiveBriefing[];
  risks?: StrategicRisk[];
  opportunities?: StrategicOpportunity[];
  forecasts?: StrategicForecast[];
  scenarios?: StrategicScenario[];
  priorities?: ExecutivePriority[];
  competitive_signals?: CompetitiveSignal[];
  decision_reports?: DecisionSupportReport[];
  advisor_signals?: ExecutiveAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};

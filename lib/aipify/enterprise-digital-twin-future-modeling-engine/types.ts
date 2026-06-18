export type TwinOrganizationModel = {
  id?: string;
  model_key?: string;
  model_title?: string;
  model_type?: string;
  entity_count?: number;
  coverage_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type TwinOperationalModel = {
  id?: string;
  model_key?: string;
  model_title?: string;
  model_type?: string;
  maturity_score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type TwinFinancialModel = {
  id?: string;
  model_key?: string;
  model_title?: string;
  model_type?: string;
  current_value?: number;
  forecast_value?: number;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TwinWorkforceModel = {
  id?: string;
  model_key?: string;
  model_title?: string;
  model_type?: string;
  utilization_percent?: number;
  headcount?: number;
  summary?: string;
  [key: string]: unknown;
};

export type TwinSimulation = {
  id?: string;
  simulation_key?: string;
  simulation_title?: string;
  simulation_type?: string;
  scenario_type?: string;
  status?: string;
  forecast_horizon?: string;
  outcome_summary?: string;
  confidence?: string;
  [key: string]: unknown;
};

export type TwinScenario = {
  id?: string;
  scenario_key?: string;
  scenario_title?: string;
  decision_type?: string;
  scenario_type?: string;
  impact_summary?: string;
  recommendation?: string;
  status?: string;
  [key: string]: unknown;
};

export type TwinForecast = {
  id?: string;
  forecast_key?: string;
  forecast_title?: string;
  forecast_type?: string;
  horizon?: string;
  projected_value?: number;
  confidence?: string;
  assumptions?: string;
  disclaimer?: string;
  [key: string]: unknown;
};

export type TwinStressTest = {
  id?: string;
  stress_key?: string;
  stress_title?: string;
  stress_type?: string;
  severity?: string;
  outcome_summary?: string;
  resilience_score?: number;
  [key: string]: unknown;
};

export type TwinRiskModel = {
  id?: string;
  risk_key?: string;
  risk_title?: string;
  risk_type?: string;
  exposure_level?: string;
  mitigation_summary?: string;
  status?: string;
  [key: string]: unknown;
};

export type TwinIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type TwinAdvisorSignal = {
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

export type EnterpriseDigitalTwinCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  simulation_lab_route?: string;
  legacy_twin_route?: string;
  decisions_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  scenario_types?: string[];
  forecast_horizons?: string[];
  organization_models?: TwinOrganizationModel[];
  operational_models?: TwinOperationalModel[];
  financial_models?: TwinFinancialModel[];
  workforce_models?: TwinWorkforceModel[];
  simulations?: TwinSimulation[];
  scenarios?: TwinScenario[];
  forecasts?: TwinForecast[];
  stress_tests?: TwinStressTest[];
  risk_models?: TwinRiskModel[];
  intelligence_signals?: TwinIntelligenceSignal[];
  advisor_signals?: TwinAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};

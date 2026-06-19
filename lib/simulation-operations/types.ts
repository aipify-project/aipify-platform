export type SimulationOperationsTab =
  | "overview"
  | "organization_twin"
  | "scenarios"
  | "forecasts"
  | "experiments"
  | "comparisons"
  | "decision_lab"
  | "reports"
  | "executive";

export type SimulationScenario = {
  id: string;
  scenario_key?: string;
  scenario_type: string;
  simulation_category?: string;
  title: string;
  description?: string;
  status?: string;
  variables?: unknown;
  domain_id?: string;
  business_pack_key?: string;
  created_at?: string;
  updated_at?: string;
};

export type SimulationForecast = {
  id: string;
  scenario_id?: string;
  scenario_title?: string;
  run_type?: string;
  forecast?: Record<string, unknown>;
  revenue_impact?: number;
  cost_impact?: number;
  risk_level?: string;
  forecast_confidence_pct?: number;
  recommendations?: unknown;
  risks?: unknown;
  completed_at?: string;
};

export type DecisionOption = {
  id: string;
  decision_title: string;
  option_label: string;
  option_summary?: string;
  cost_estimate?: number;
  risk_level?: string;
  complexity?: string;
  time_weeks?: number;
  expected_return_pct?: number;
  scenario_id?: string;
};

export type TwinModel = {
  id: string;
  model_domain: string;
  title: string;
  summary?: string;
  confidence_pct?: number;
  updated_at?: string;
};

export type SimulationOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  organization_twin?: TwinModel[];
  twin_understands?: string[];
  scenarios?: SimulationScenario[];
  forecasts?: SimulationForecast[];
  experiments?: SimulationScenario[];
  comparisons?: { id: string; comparison_title: string; summary?: string; comparison_matrix?: unknown; created_at?: string }[];
  decision_lab?: DecisionOption[];
  simulation_workflow?: string[];
  risk_integration?: Record<string, unknown>;
  scenario_comparison_engine?: Record<string, unknown>;
  executive_simulation_center?: Record<string, unknown>;
  simulation_history?: { scenario_id?: string; title?: string; status?: string; created_at?: string; category?: string }[];
  learning_loop?: { id: string; forecast_summary?: string; actual_summary?: string; variance_pct?: number; decision_taken?: string; outcome?: string; lessons_learned?: string; recorded_at?: string }[];
  business_pack_integration?: Record<string, unknown>;
  companion_advisor?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};

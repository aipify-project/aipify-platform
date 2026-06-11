export const SIMULATION_CATEGORIES = [
  "workflow",
  "governance",
  "notification",
  "organization",
  "resource",
  "automation",
  "marketplace",
  "blueprint",
  "executive",
] as const;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export type SimulationScenario = {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  status?: string;
  created_at?: string;
  latest_run?: SimulationRunSummary | null;
};

export type SimulationRunSummary = {
  run_id: string;
  confidence_level: string;
  estimated_value?: number;
  estimated_risk?: number;
  estimated_time_saved?: number;
  estimated_workload_change?: number;
  governance_impact_score?: number;
};

export type SimulationRun = {
  id: string;
  scenario_id: string;
  confidence_level: string;
  confidence_score: number;
  estimated_value: number;
  estimated_risk: number;
  estimated_time_saved: number;
  estimated_workload_change: number;
  governance_impact_score: number;
  production_isolated: boolean;
  explanation_id?: string | null;
  created_at?: string;
};

export type SimulationOutcome = {
  outcome_type: string;
  description: string;
  impact_score: number;
};

export type SimulationAssumption = {
  assumption: string;
  source: string;
  confidence: number;
};

export type SimulationLabCard = {
  has_customer: boolean;
  scenario_count?: number;
  run_count?: number;
  philosophy?: string;
  production_isolated?: boolean;
};

export type SimulationLabDashboard = {
  has_customer: boolean;
  production_isolated?: boolean;
  scenarios: SimulationScenario[];
  recent_runs: Array<SimulationRunSummary & { scenario_title?: string; category?: string; created_at?: string }>;
  categories: Array<{ category: string; count: number }>;
  integrations?: Record<string, string>;
  categories_supported?: string[];
};

export type SimulationRunDetail = {
  run: SimulationRun;
  outcomes: SimulationOutcome[];
  assumptions: SimulationAssumption[];
};

export type SimulationRunResult = {
  run_id: string;
  scenario_id: string;
  confidence_level: string;
  confidence_score: number;
  estimated_value: number;
  estimated_risk: number;
  estimated_time_saved: number;
  estimated_workload_change: number;
  governance_impact_score: number;
  production_isolated: boolean;
  explanation?: string;
  philosophy?: string;
};

export type ScenarioComparison = {
  comparison_id: string;
  scenarios: Array<{
    scenario_id: string;
    title: string;
    category: string;
    latest_run?: SimulationRunSummary | null;
  }>;
  production_isolated: boolean;
};

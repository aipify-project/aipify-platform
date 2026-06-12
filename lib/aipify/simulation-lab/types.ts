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

export type SimulationObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type SimulationExampleCategory = {
  domain?: string;
  label?: string;
  examples?: string[];
};

export type SimulationExamplesBlueprint = {
  principle?: string;
  categories?: SimulationExampleCategory[];
};

export type DecisionComparisonFramework = {
  principle?: string;
  structure?: Array<{ key?: string; label?: string; fields?: string[] }>;
  comparison_dimensions?: string[];
  boundary?: string;
  route?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type SimulationEngagementSummary = {
  scenarios_total?: number;
  scenarios_ready?: number;
  simulation_runs_total?: number;
  simulation_runs_last_30d?: number;
  comparisons_total?: number;
  comparisons_last_30d?: number;
  low_confidence_runs?: number;
  categories_used?: number;
  production_isolated?: boolean;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  route?: string;
  mapping_note?: string;
};

export type SimulationLabCard = {
  has_customer: boolean;
  scenario_count?: number;
  run_count?: number;
  philosophy?: string;
  production_isolated?: boolean;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  engagement_summary?: SimulationEngagementSummary;
  blueprint_note?: string;
};

export type SimulationLabDashboard = {
  has_customer: boolean;
  production_isolated?: boolean;
  scenarios: SimulationScenario[];
  recent_runs: Array<SimulationRunSummary & { scenario_title?: string; category?: string; created_at?: string }>;
  categories: Array<{ category: string; count: number }>;
  integrations?: Record<string, string>;
  categories_supported?: string[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  simulation_lab_note?: string;
  distinction_note?: string;
  simulation_objectives?: SimulationObjective[];
  simulation_examples?: SimulationExamplesBlueprint;
  decision_comparison_framework?: DecisionComparisonFramework;
  companion_examples?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  integration_links?: IntegrationLink[];
  engagement_summary?: SimulationEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  safety_note?: string;
  principles?: string[];
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

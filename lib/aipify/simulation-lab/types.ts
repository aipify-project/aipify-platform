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
  journey_phrase?: string;
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

export type ScenarioTypeCategory = {
  key?: string;
  label?: string;
  examples?: string[];
};

export type ScenarioTypesBlueprint = {
  principle?: string;
  categories?: ScenarioTypeCategory[];
};

export type SimulationQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  consideration?: string;
};

export type SimulationQuestionsBlueprint = {
  principle?: string;
  questions?: SimulationQuestion[];
};

export type MultipleFuture = {
  key?: string;
  label?: string;
  description?: string;
};

export type MultipleFuturesBlueprint = {
  principle?: string;
  futures?: MultipleFuture[];
  boundary_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidanceBlueprint = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
};

export type CollaborativeSimulationContext = {
  key?: string;
  label?: string;
  description?: string;
};

export type CollaborativeSimulationBlueprint = {
  principle?: string;
  contexts?: CollaborativeSimulationContext[];
  dialogue_note?: string;
};

export type LeadershipInsightType = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type LeadershipInsightsBlueprint = {
  principle?: string;
  insight_types?: LeadershipInsightType[];
  dialogue_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type DecisionLabEnvironmentEntry = {
  key?: string;
  label?: string;
  description?: string;
  encouragement?: string;
};

export type DecisionLabEnvironmentBlueprint = {
  principle?: string;
  environments?: DecisionLabEnvironmentEntry[];
  boundary_note?: string;
};

export type SimulationInputCategory = {
  key?: string;
  label?: string;
  description?: string;
};

export type SimulationInputsBlueprint = {
  principle?: string;
  input_categories?: SimulationInputCategory[];
  assumption_note?: string;
};

export type BlueprintScenarioOption = {
  key?: string;
  label?: string;
  description?: string;
  consideration?: string;
};

export type ScenarioComparisonBlueprint = {
  principle?: string;
  scenarios?: BlueprintScenarioOption[];
  comparison_note?: string;
};

export type CollaborativeStakeholder = {
  key?: string;
  label?: string;
  description?: string;
};

export type CollaborativeDecisionMakingBlueprint = {
  principle?: string;
  stakeholders?: CollaborativeStakeholder[];
  dialogue_note?: string;
};

export type LearningDimension = {
  key?: string;
  label?: string;
  description?: string;
};

export type LearningThroughSimulationBlueprint = {
  principle?: string;
  reflection_prompts?: string[];
  learning_dimensions?: LearningDimension[];
  boundary_note?: string;
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
  implementation_blueprint_phase76?: ImplementationBlueprintMeta;
  engagement_summary?: SimulationEngagementSummary;
  blueprint_note?: string;
  blueprint_phase76_mission?: string;
  blueprint_phase76_abos_principle?: string;
  blueprint_phase76_engagement_summary?: SimulationEngagementSummary;
  blueprint_phase76_note?: string;
  implementation_blueprint_phase78?: ImplementationBlueprintMeta;
  blueprint_phase78_mission?: string;
  blueprint_phase78_abos_principle?: string;
  blueprint_phase78_engagement_summary?: SimulationEngagementSummary;
  blueprint_phase78_note?: string;
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
  implementation_blueprint_phase76?: ImplementationBlueprintMeta;
  scenario_simulation_engine_note?: string;
  blueprint_phase76_distinction_note?: string;
  blueprint_phase76_mission?: string;
  blueprint_phase76_philosophy?: string;
  blueprint_phase76_abos_principle?: string;
  blueprint_phase76_objectives?: SimulationObjective[];
  blueprint_phase76_scenario_types?: ScenarioTypesBlueprint;
  blueprint_phase76_simulation_questions?: SimulationQuestionsBlueprint;
  blueprint_phase76_multiple_futures?: MultipleFuturesBlueprint;
  blueprint_phase76_companion_guidance?: CompanionGuidanceBlueprint;
  blueprint_phase76_collaborative_simulation?: CollaborativeSimulationBlueprint;
  blueprint_phase76_self_love_connection?: SelfLoveConnection;
  blueprint_phase76_leadership_insights?: LeadershipInsightsBlueprint;
  blueprint_phase76_trust_connection?: TrustConnection;
  blueprint_phase76_limitation_principles?: LimitationPrinciples;
  blueprint_phase76_dogfooding?: SimulationLabDashboard["dogfooding"];
  blueprint_phase76_integration_links?: IntegrationLink[];
  blueprint_phase76_engagement_summary?: SimulationEngagementSummary;
  blueprint_phase76_success_criteria?: AbosSuccessCriterion[];
  blueprint_phase76_vision_phrases?: string[];
  blueprint_phase76_safety_note?: string;
  implementation_blueprint_phase78?: ImplementationBlueprintMeta;
  decision_lab_engine_note?: string;
  blueprint_phase78_distinction_note?: string;
  blueprint_phase78_mission?: string;
  blueprint_phase78_philosophy?: string;
  blueprint_phase78_abos_principle?: string;
  blueprint_phase78_objectives?: SimulationObjective[];
  blueprint_phase78_decision_lab_environment?: DecisionLabEnvironmentBlueprint;
  blueprint_phase78_simulation_inputs?: SimulationInputsBlueprint;
  blueprint_phase78_scenario_comparison?: ScenarioComparisonBlueprint;
  blueprint_phase78_companion_guidance?: CompanionGuidanceBlueprint;
  blueprint_phase78_collaborative_decision_making?: CollaborativeDecisionMakingBlueprint;
  blueprint_phase78_learning_through_simulation?: LearningThroughSimulationBlueprint;
  blueprint_phase78_self_love_connection?: SelfLoveConnection;
  blueprint_phase78_leadership_insights?: LeadershipInsightsBlueprint;
  blueprint_phase78_trust_connection?: TrustConnection;
  blueprint_phase78_limitation_principles?: LimitationPrinciples;
  blueprint_phase78_dogfooding?: SimulationLabDashboard["dogfooding"];
  blueprint_phase78_integration_links?: IntegrationLink[];
  blueprint_phase78_engagement_summary?: SimulationEngagementSummary;
  blueprint_phase78_success_criteria?: AbosSuccessCriterion[];
  blueprint_phase78_vision_phrases?: string[];
  blueprint_phase78_safety_note?: string;
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

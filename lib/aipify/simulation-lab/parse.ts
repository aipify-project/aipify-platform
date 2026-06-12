import type {
  AbosSuccessCriterion,
  CollaborativeDecisionMakingBlueprint,
  CompanionExample,
  CompanionGuidanceBlueprint,
  CollaborativeSimulationBlueprint,
  DecisionComparisonFramework,
  DecisionLabEnvironmentBlueprint,
  IntegrationLink,
  LeadershipInsightsBlueprint,
  LearningThroughSimulationBlueprint,
  LimitationPrinciples,
  MultipleFuturesBlueprint,
  ScenarioComparison,
  ScenarioComparisonBlueprint,
  ScenarioTypesBlueprint,
  SelfLoveConnection,
  SimulationEngagementSummary,
  SimulationExamplesBlueprint,
  SimulationInputsBlueprint,
  EcosystemScenarioPlanningBlueprint,
  SimulationLabCard,
  SimulationLabDashboard,
  SimulationObjective,
  SimulationQuestionsBlueprint,
  SimulationRunDetail,
  SimulationRunResult,
  SimulationScenario,
  TrustConnection,
} from "./types";

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseSimulationObjectives(data: unknown): SimulationObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as SimulationObjective[];
}

function parseSimulationExamples(data: unknown): SimulationExamplesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SimulationExamplesBlueprint;
}

function parseDecisionComparisonFramework(data: unknown): DecisionComparisonFramework | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DecisionComparisonFramework;
}

function parseCompanionExamples(data: unknown): CompanionExample[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CompanionExample[];
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): SimulationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SimulationEngagementSummary;
}

function parseScenarioTypes(data: unknown): ScenarioTypesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ScenarioTypesBlueprint;
}

function parseSimulationQuestions(data: unknown): SimulationQuestionsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SimulationQuestionsBlueprint;
}

function parseMultipleFutures(data: unknown): MultipleFuturesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MultipleFuturesBlueprint;
}

function parseCompanionGuidance(data: unknown): CompanionGuidanceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidanceBlueprint;
}

function parseCollaborativeSimulation(data: unknown): CollaborativeSimulationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollaborativeSimulationBlueprint;
}

function parseLeadershipInsights(data: unknown): LeadershipInsightsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LeadershipInsightsBlueprint;
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseDecisionLabEnvironment(data: unknown): DecisionLabEnvironmentBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DecisionLabEnvironmentBlueprint;
}

function parseSimulationInputs(data: unknown): SimulationInputsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SimulationInputsBlueprint;
}

function parseScenarioComparisonBlueprint(data: unknown): ScenarioComparisonBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ScenarioComparisonBlueprint;
}

function parseCollaborativeDecisionMaking(data: unknown): CollaborativeDecisionMakingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollaborativeDecisionMakingBlueprint;
}

function parseLearningThroughSimulation(data: unknown): LearningThroughSimulationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LearningThroughSimulationBlueprint;
}

function parseBlueprintMeta(data: unknown): SimulationLabDashboard["implementation_blueprint_phase76"] {
  if (typeof data !== "object" || !data) return undefined;
  return data as SimulationLabDashboard["implementation_blueprint_phase76"];
}

function parseEcosystemScenarioPlanning(data: unknown): EcosystemScenarioPlanningBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EcosystemScenarioPlanningBlueprint;
}

export function parseSimulationLabCard(data: unknown): SimulationLabCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    scenario_count: d.scenario_count as number | undefined,
    run_count: d.run_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    production_isolated: d.production_isolated as boolean | undefined,
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    implementation_blueprint: d.implementation_blueprint as SimulationLabCard["implementation_blueprint"],
    implementation_blueprint_phase76: parseBlueprintMeta(d.implementation_blueprint_phase76),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
    blueprint_phase76_mission: d.blueprint_phase76_mission as string | undefined,
    blueprint_phase76_abos_principle: d.blueprint_phase76_abos_principle as string | undefined,
    blueprint_phase76_engagement_summary: parseEngagementSummary(d.blueprint_phase76_engagement_summary),
    blueprint_phase76_note: d.blueprint_phase76_note as string | undefined,
    implementation_blueprint_phase78: parseBlueprintMeta(d.implementation_blueprint_phase78),
    blueprint_phase78_mission: d.blueprint_phase78_mission as string | undefined,
    blueprint_phase78_abos_principle: d.blueprint_phase78_abos_principle as string | undefined,
    blueprint_phase78_engagement_summary: parseEngagementSummary(d.blueprint_phase78_engagement_summary),
    blueprint_phase78_note: d.blueprint_phase78_note as string | undefined,
    implementation_blueprint_phase84: parseBlueprintMeta(d.implementation_blueprint_phase84),
    blueprint_phase84_mission: d.blueprint_phase84_mission as string | undefined,
    blueprint_phase84_abos_principle: d.blueprint_phase84_abos_principle as string | undefined,
    blueprint_phase84_engagement_summary: parseEngagementSummary(d.blueprint_phase84_engagement_summary),
    blueprint_phase84_note: d.blueprint_phase84_note as string | undefined,
  };
}

export function parseSimulationLabDashboard(data: unknown): SimulationLabDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    production_isolated: d.production_isolated as boolean | undefined,
    scenarios: Array.isArray(d.scenarios) ? (d.scenarios as SimulationScenario[]) : [],
    recent_runs: Array.isArray(d.recent_runs) ? (d.recent_runs as SimulationLabDashboard["recent_runs"]) : [],
    categories: Array.isArray(d.categories) ? (d.categories as SimulationLabDashboard["categories"]) : [],
    integrations: d.integrations as Record<string, string> | undefined,
    categories_supported: d.categories_supported as string[] | undefined,
    implementation_blueprint: d.implementation_blueprint as SimulationLabDashboard["implementation_blueprint"],
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    simulation_lab_note: d.simulation_lab_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    simulation_objectives: parseSimulationObjectives(d.simulation_objectives),
    simulation_examples: parseSimulationExamples(d.simulation_examples),
    decision_comparison_framework: parseDecisionComparisonFramework(d.decision_comparison_framework),
    companion_examples: parseCompanionExamples(d.companion_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: d.dogfooding as SimulationLabDashboard["dogfooding"],
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    safety_note: d.safety_note as string | undefined,
    principles: parseStringArray(d.principles),
    implementation_blueprint_phase76: parseBlueprintMeta(d.implementation_blueprint_phase76),
    scenario_simulation_engine_note: d.scenario_simulation_engine_note as string | undefined,
    blueprint_phase76_distinction_note: d.blueprint_phase76_distinction_note as string | undefined,
    blueprint_phase76_mission: d.blueprint_phase76_mission as string | undefined,
    blueprint_phase76_philosophy: d.blueprint_phase76_philosophy as string | undefined,
    blueprint_phase76_abos_principle: d.blueprint_phase76_abos_principle as string | undefined,
    blueprint_phase76_objectives: parseSimulationObjectives(d.blueprint_phase76_objectives),
    blueprint_phase76_scenario_types: parseScenarioTypes(d.blueprint_phase76_scenario_types),
    blueprint_phase76_simulation_questions: parseSimulationQuestions(d.blueprint_phase76_simulation_questions),
    blueprint_phase76_multiple_futures: parseMultipleFutures(d.blueprint_phase76_multiple_futures),
    blueprint_phase76_companion_guidance: parseCompanionGuidance(d.blueprint_phase76_companion_guidance),
    blueprint_phase76_collaborative_simulation: parseCollaborativeSimulation(d.blueprint_phase76_collaborative_simulation),
    blueprint_phase76_self_love_connection: parseSelfLoveConnection(d.blueprint_phase76_self_love_connection),
    blueprint_phase76_leadership_insights: parseLeadershipInsights(d.blueprint_phase76_leadership_insights),
    blueprint_phase76_trust_connection: parseTrustConnection(d.blueprint_phase76_trust_connection),
    blueprint_phase76_limitation_principles: parseLimitationPrinciples(d.blueprint_phase76_limitation_principles),
    blueprint_phase76_dogfooding: d.blueprint_phase76_dogfooding as SimulationLabDashboard["blueprint_phase76_dogfooding"],
    blueprint_phase76_integration_links: parseIntegrationLinks(d.blueprint_phase76_integration_links),
    blueprint_phase76_engagement_summary: parseEngagementSummary(d.blueprint_phase76_engagement_summary),
    blueprint_phase76_success_criteria: parseSuccessCriteria(d.blueprint_phase76_success_criteria),
    blueprint_phase76_vision_phrases: parseStringArray(d.blueprint_phase76_vision_phrases),
    blueprint_phase76_safety_note: d.blueprint_phase76_safety_note as string | undefined,
    implementation_blueprint_phase78: parseBlueprintMeta(d.implementation_blueprint_phase78),
    decision_lab_engine_note: d.decision_lab_engine_note as string | undefined,
    blueprint_phase78_distinction_note: d.blueprint_phase78_distinction_note as string | undefined,
    blueprint_phase78_mission: d.blueprint_phase78_mission as string | undefined,
    blueprint_phase78_philosophy: d.blueprint_phase78_philosophy as string | undefined,
    blueprint_phase78_abos_principle: d.blueprint_phase78_abos_principle as string | undefined,
    blueprint_phase78_objectives: parseSimulationObjectives(d.blueprint_phase78_objectives),
    blueprint_phase78_decision_lab_environment: parseDecisionLabEnvironment(d.blueprint_phase78_decision_lab_environment),
    blueprint_phase78_simulation_inputs: parseSimulationInputs(d.blueprint_phase78_simulation_inputs),
    blueprint_phase78_scenario_comparison: parseScenarioComparisonBlueprint(d.blueprint_phase78_scenario_comparison),
    blueprint_phase78_companion_guidance: parseCompanionGuidance(d.blueprint_phase78_companion_guidance),
    blueprint_phase78_collaborative_decision_making: parseCollaborativeDecisionMaking(
      d.blueprint_phase78_collaborative_decision_making
    ),
    blueprint_phase78_learning_through_simulation: parseLearningThroughSimulation(
      d.blueprint_phase78_learning_through_simulation
    ),
    blueprint_phase78_self_love_connection: parseSelfLoveConnection(d.blueprint_phase78_self_love_connection),
    blueprint_phase78_leadership_insights: parseLeadershipInsights(d.blueprint_phase78_leadership_insights),
    blueprint_phase78_trust_connection: parseTrustConnection(d.blueprint_phase78_trust_connection),
    blueprint_phase78_limitation_principles: parseLimitationPrinciples(d.blueprint_phase78_limitation_principles),
    blueprint_phase78_dogfooding: d.blueprint_phase78_dogfooding as SimulationLabDashboard["blueprint_phase78_dogfooding"],
    blueprint_phase78_integration_links: parseIntegrationLinks(d.blueprint_phase78_integration_links),
    blueprint_phase78_engagement_summary: parseEngagementSummary(d.blueprint_phase78_engagement_summary),
    blueprint_phase78_success_criteria: parseSuccessCriteria(d.blueprint_phase78_success_criteria),
    blueprint_phase78_vision_phrases: parseStringArray(d.blueprint_phase78_vision_phrases),
    blueprint_phase78_safety_note: d.blueprint_phase78_safety_note as string | undefined,
    ecosystem_scenario_planning: parseEcosystemScenarioPlanning(d.ecosystem_scenario_planning),
  };
}

export function parseSimulationRunResult(data: unknown): SimulationRunResult | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.run_id) return null;
  return {
    run_id: String(d.run_id),
    scenario_id: String(d.scenario_id ?? ""),
    confidence_level: String(d.confidence_level ?? "medium"),
    confidence_score: Number(d.confidence_score ?? 0),
    estimated_value: Number(d.estimated_value ?? 0),
    estimated_risk: Number(d.estimated_risk ?? 0),
    estimated_time_saved: Number(d.estimated_time_saved ?? 0),
    estimated_workload_change: Number(d.estimated_workload_change ?? 0),
    governance_impact_score: Number(d.governance_impact_score ?? 0),
    production_isolated: Boolean(d.production_isolated ?? true),
    explanation: d.explanation as string | undefined,
    philosophy: d.philosophy as string | undefined,
  };
}

export function parseSimulationRunDetail(data: unknown): SimulationRunDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.run) return null;
  return {
    run: d.run as SimulationRunDetail["run"],
    outcomes: Array.isArray(d.outcomes) ? (d.outcomes as SimulationRunDetail["outcomes"]) : [],
    assumptions: Array.isArray(d.assumptions) ? (d.assumptions as SimulationRunDetail["assumptions"]) : [],
  };
}

export function parseScenarioComparison(data: unknown): ScenarioComparison {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    comparison_id: String(d.comparison_id ?? ""),
    scenarios: Array.isArray(d.scenarios) ? (d.scenarios as ScenarioComparison["scenarios"]) : [],
    production_isolated: Boolean(d.production_isolated ?? true),
  };
}

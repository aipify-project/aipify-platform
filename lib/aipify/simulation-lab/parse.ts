import type {
  AbosSuccessCriterion,
  CompanionExample,
  DecisionComparisonFramework,
  IntegrationLink,
  ScenarioComparison,
  SelfLoveConnection,
  SimulationEngagementSummary,
  SimulationExamplesBlueprint,
  SimulationLabCard,
  SimulationLabDashboard,
  SimulationObjective,
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
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
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

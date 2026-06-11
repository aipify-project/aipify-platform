import type {
  ScenarioComparison,
  SimulationLabCard,
  SimulationLabDashboard,
  SimulationRunDetail,
  SimulationRunResult,
  SimulationScenario,
} from "./types";

export function parseSimulationLabCard(data: unknown): SimulationLabCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    scenario_count: d.scenario_count as number | undefined,
    run_count: d.run_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    production_isolated: d.production_isolated as boolean | undefined,
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

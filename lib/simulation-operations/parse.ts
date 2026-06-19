import type {
  DecisionOption,
  SimulationForecast,
  SimulationOperationsCenter,
  SimulationScenario,
  TwinModel,
} from "./types";

function parseScenario(row: Record<string, unknown>): SimulationScenario {
  return {
    id: String(row.id ?? ""),
    scenario_key: row.scenario_key ? String(row.scenario_key) : undefined,
    scenario_type: String(row.scenario_type ?? ""),
    simulation_category: row.simulation_category ? String(row.simulation_category) : undefined,
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    status: row.status ? String(row.status) : undefined,
    variables: row.variables,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function parseSimulationOperationsCenter(row: Record<string, unknown>): SimulationOperationsCenter {
  const parseScenarios = (value: unknown) =>
    Array.isArray(value) ? value.map((r) => parseScenario(r as Record<string, unknown>)) : undefined;

  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    organization_twin: Array.isArray(row.organization_twin)
      ? row.organization_twin.map((m) => {
          const item = m as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            model_domain: String(item.model_domain ?? ""),
            title: String(item.title ?? ""),
            summary: item.summary ? String(item.summary) : undefined,
            confidence_pct: item.confidence_pct != null ? Number(item.confidence_pct) : undefined,
            updated_at: item.updated_at ? String(item.updated_at) : undefined,
          } satisfies TwinModel;
        })
      : undefined,
    twin_understands: Array.isArray(row.twin_understands) ? row.twin_understands.map(String) : undefined,
    scenarios: parseScenarios(row.scenarios),
    forecasts: Array.isArray(row.forecasts)
      ? row.forecasts.map((f) => {
          const item = f as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            scenario_id: item.scenario_id ? String(item.scenario_id) : undefined,
            scenario_title: item.scenario_title ? String(item.scenario_title) : undefined,
            run_type: item.run_type ? String(item.run_type) : undefined,
            forecast: item.forecast as Record<string, unknown> | undefined,
            revenue_impact: item.revenue_impact != null ? Number(item.revenue_impact) : undefined,
            cost_impact: item.cost_impact != null ? Number(item.cost_impact) : undefined,
            risk_level: item.risk_level ? String(item.risk_level) : undefined,
            forecast_confidence_pct: item.forecast_confidence_pct != null ? Number(item.forecast_confidence_pct) : undefined,
            recommendations: item.recommendations,
            risks: item.risks,
            completed_at: item.completed_at ? String(item.completed_at) : undefined,
          } satisfies SimulationForecast;
        })
      : undefined,
    experiments: parseScenarios(row.experiments),
    comparisons: Array.isArray(row.comparisons)
      ? row.comparisons.map((c) => {
          const item = c as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            comparison_title: String(item.comparison_title ?? ""),
            summary: item.summary ? String(item.summary) : undefined,
            comparison_matrix: item.comparison_matrix,
            created_at: item.created_at ? String(item.created_at) : undefined,
          };
        })
      : undefined,
    decision_lab: Array.isArray(row.decision_lab)
      ? row.decision_lab.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            decision_title: String(item.decision_title ?? ""),
            option_label: String(item.option_label ?? ""),
            option_summary: item.option_summary ? String(item.option_summary) : undefined,
            cost_estimate: item.cost_estimate != null ? Number(item.cost_estimate) : undefined,
            risk_level: item.risk_level ? String(item.risk_level) : undefined,
            complexity: item.complexity ? String(item.complexity) : undefined,
            time_weeks: item.time_weeks != null ? Number(item.time_weeks) : undefined,
            expected_return_pct: item.expected_return_pct != null ? Number(item.expected_return_pct) : undefined,
            scenario_id: item.scenario_id ? String(item.scenario_id) : undefined,
          } satisfies DecisionOption;
        })
      : undefined,
    simulation_workflow: Array.isArray(row.simulation_workflow) ? row.simulation_workflow.map(String) : undefined,
    risk_integration: row.risk_integration as Record<string, unknown> | undefined,
    scenario_comparison_engine: row.scenario_comparison_engine as Record<string, unknown> | undefined,
    executive_simulation_center: row.executive_simulation_center as Record<string, unknown> | undefined,
    simulation_history: Array.isArray(row.simulation_history)
      ? row.simulation_history.map((h) => {
          const item = h as Record<string, unknown>;
          return {
            scenario_id: item.scenario_id ? String(item.scenario_id) : undefined,
            title: item.title ? String(item.title) : undefined,
            status: item.status ? String(item.status) : undefined,
            created_at: item.created_at ? String(item.created_at) : undefined,
            category: item.category ? String(item.category) : undefined,
          };
        })
      : undefined,
    learning_loop: Array.isArray(row.learning_loop)
      ? row.learning_loop.map((l) => {
          const item = l as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            forecast_summary: item.forecast_summary ? String(item.forecast_summary) : undefined,
            actual_summary: item.actual_summary ? String(item.actual_summary) : undefined,
            variance_pct: item.variance_pct != null ? Number(item.variance_pct) : undefined,
            decision_taken: item.decision_taken ? String(item.decision_taken) : undefined,
            outcome: item.outcome ? String(item.outcome) : undefined,
            lessons_learned: item.lessons_learned ? String(item.lessons_learned) : undefined,
            recorded_at: item.recorded_at ? String(item.recorded_at) : undefined,
          };
        })
      : undefined,
    business_pack_integration: row.business_pack_integration as Record<string, unknown> | undefined,
    companion_advisor: row.companion_advisor as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseSimulationSearchResults(row: Record<string, unknown>): SimulationScenario[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseScenario(r as Record<string, unknown>));
}

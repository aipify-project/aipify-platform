import type {
  EnterpriseDigitalTwinCenter,
  TwinAdvisorSignal,
  TwinFinancialModel,
  TwinForecast,
  TwinIntelligenceSignal,
  TwinOperationalModel,
  TwinOrganizationModel,
  TwinRiskModel,
  TwinScenario,
  TwinSimulation,
  TwinStressTest,
  TwinWorkforceModel,
} from "./types";

function parseOrgModel(raw: unknown): TwinOrganizationModel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    model_key: typeof d.model_key === "string" ? d.model_key : undefined,
    model_title: typeof d.model_title === "string" ? d.model_title : undefined,
    model_type: typeof d.model_type === "string" ? d.model_type : undefined,
    entity_count: Number(d.entity_count ?? 0),
    coverage_percent: Number(d.coverage_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseOpModel(raw: unknown): TwinOperationalModel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    model_key: typeof d.model_key === "string" ? d.model_key : undefined,
    model_title: typeof d.model_title === "string" ? d.model_title : undefined,
    model_type: typeof d.model_type === "string" ? d.model_type : undefined,
    maturity_score: Number(d.maturity_score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseFinModel(raw: unknown): TwinFinancialModel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    model_key: typeof d.model_key === "string" ? d.model_key : undefined,
    model_title: typeof d.model_title === "string" ? d.model_title : undefined,
    model_type: typeof d.model_type === "string" ? d.model_type : undefined,
    current_value: Number(d.current_value ?? 0),
    forecast_value: Number(d.forecast_value ?? 0),
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseWfModel(raw: unknown): TwinWorkforceModel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    model_key: typeof d.model_key === "string" ? d.model_key : undefined,
    model_title: typeof d.model_title === "string" ? d.model_title : undefined,
    model_type: typeof d.model_type === "string" ? d.model_type : undefined,
    utilization_percent: Number(d.utilization_percent ?? 0),
    headcount: Number(d.headcount ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseSimulation(raw: unknown): TwinSimulation {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    simulation_key: typeof d.simulation_key === "string" ? d.simulation_key : undefined,
    simulation_title: typeof d.simulation_title === "string" ? d.simulation_title : undefined,
    simulation_type: typeof d.simulation_type === "string" ? d.simulation_type : undefined,
    scenario_type: typeof d.scenario_type === "string" ? d.scenario_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    forecast_horizon: typeof d.forecast_horizon === "string" ? d.forecast_horizon : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
  };
}

function parseScenario(raw: unknown): TwinScenario {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    scenario_key: typeof d.scenario_key === "string" ? d.scenario_key : undefined,
    scenario_title: typeof d.scenario_title === "string" ? d.scenario_title : undefined,
    decision_type: typeof d.decision_type === "string" ? d.decision_type : undefined,
    scenario_type: typeof d.scenario_type === "string" ? d.scenario_type : undefined,
    impact_summary: typeof d.impact_summary === "string" ? d.impact_summary : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseForecast(raw: unknown): TwinForecast {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    forecast_key: typeof d.forecast_key === "string" ? d.forecast_key : undefined,
    forecast_title: typeof d.forecast_title === "string" ? d.forecast_title : undefined,
    forecast_type: typeof d.forecast_type === "string" ? d.forecast_type : undefined,
    horizon: typeof d.horizon === "string" ? d.horizon : undefined,
    projected_value: Number(d.projected_value ?? 0),
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    assumptions: typeof d.assumptions === "string" ? d.assumptions : undefined,
    disclaimer: typeof d.disclaimer === "string" ? d.disclaimer : undefined,
  };
}

function parseStress(raw: unknown): TwinStressTest {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    stress_key: typeof d.stress_key === "string" ? d.stress_key : undefined,
    stress_title: typeof d.stress_title === "string" ? d.stress_title : undefined,
    stress_type: typeof d.stress_type === "string" ? d.stress_type : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    resilience_score: Number(d.resilience_score ?? 0),
  };
}

function parseRisk(raw: unknown): TwinRiskModel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    risk_key: typeof d.risk_key === "string" ? d.risk_key : undefined,
    risk_title: typeof d.risk_title === "string" ? d.risk_title : undefined,
    risk_type: typeof d.risk_type === "string" ? d.risk_type : undefined,
    exposure_level: typeof d.exposure_level === "string" ? d.exposure_level : undefined,
    mitigation_summary: typeof d.mitigation_summary === "string" ? d.mitigation_summary : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseIntelligence(raw: unknown): TwinIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): TwinAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseEnterpriseDigitalTwinCenter(raw: unknown): EnterpriseDigitalTwinCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    simulation_lab_route: typeof d.simulation_lab_route === "string" ? d.simulation_lab_route : undefined,
    legacy_twin_route: typeof d.legacy_twin_route === "string" ? d.legacy_twin_route : undefined,
    decisions_route: typeof d.decisions_route === "string" ? d.decisions_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    scenario_types: Array.isArray(d.scenario_types) ? (d.scenario_types as string[]) : [],
    forecast_horizons: Array.isArray(d.forecast_horizons) ? (d.forecast_horizons as string[]) : [],
    organization_models: Array.isArray(d.organization_models) ? d.organization_models.map(parseOrgModel) : [],
    operational_models: Array.isArray(d.operational_models) ? d.operational_models.map(parseOpModel) : [],
    financial_models: Array.isArray(d.financial_models) ? d.financial_models.map(parseFinModel) : [],
    workforce_models: Array.isArray(d.workforce_models) ? d.workforce_models.map(parseWfModel) : [],
    simulations: Array.isArray(d.simulations) ? d.simulations.map(parseSimulation) : [],
    scenarios: Array.isArray(d.scenarios) ? d.scenarios.map(parseScenario) : [],
    forecasts: Array.isArray(d.forecasts) ? d.forecasts.map(parseForecast) : [],
    stress_tests: Array.isArray(d.stress_tests) ? d.stress_tests.map(parseStress) : [],
    risk_models: Array.isArray(d.risk_models) ? d.risk_models.map(parseRisk) : [],
    intelligence_signals: Array.isArray(d.intelligence_signals) ? d.intelligence_signals.map(parseIntelligence) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}

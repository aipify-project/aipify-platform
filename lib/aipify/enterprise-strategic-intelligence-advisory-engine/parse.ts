import type {
  CompetitiveSignal,
  DecisionSupportReport,
  EnterpriseStrategicIntelligenceAdvisoryCenter,
  ExecutiveAdvisorSignal,
  ExecutiveBriefing,
  ExecutivePriority,
  StrategicForecast,
  StrategicInitiative,
  StrategicObjective,
  StrategicOpportunity,
  StrategicRisk,
  StrategicScenario,
} from "./types";

function parseObjective(raw: unknown): StrategicObjective {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    objective_key: typeof d.objective_key === "string" ? d.objective_key : undefined,
    objective_title: typeof d.objective_title === "string" ? d.objective_title : undefined,
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    timeline_label: typeof d.timeline_label === "string" ? d.timeline_label : undefined,
    progress_percent: Number(d.progress_percent ?? 0),
    status: typeof d.status === "string" ? d.status : undefined,
    expected_outcomes: d.expected_outcomes,
  };
}

function parseInitiative(raw: unknown): StrategicInitiative {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    initiative_key: typeof d.initiative_key === "string" ? d.initiative_key : undefined,
    initiative_title: typeof d.initiative_title === "string" ? d.initiative_title : undefined,
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    impact_score: Number(d.impact_score ?? 0),
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseBriefing(raw: unknown): ExecutiveBriefing {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    briefing_key: typeof d.briefing_key === "string" ? d.briefing_key : undefined,
    briefing_title: typeof d.briefing_title === "string" ? d.briefing_title : undefined,
    briefing_type: typeof d.briefing_type === "string" ? d.briefing_type : undefined,
    executive_summary: typeof d.executive_summary === "string" ? d.executive_summary : undefined,
    generated_at: typeof d.generated_at === "string" ? d.generated_at : undefined,
  };
}

function parseRisk(raw: unknown): StrategicRisk {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    risk_key: typeof d.risk_key === "string" ? d.risk_key : undefined,
    risk_title: typeof d.risk_title === "string" ? d.risk_title : undefined,
    risk_category: typeof d.risk_category === "string" ? d.risk_category : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    likelihood: typeof d.likelihood === "string" ? d.likelihood : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    impact_summary: typeof d.impact_summary === "string" ? d.impact_summary : undefined,
  };
}

function parseOpportunity(raw: unknown): StrategicOpportunity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    opportunity_key: typeof d.opportunity_key === "string" ? d.opportunity_key : undefined,
    opportunity_title: typeof d.opportunity_title === "string" ? d.opportunity_title : undefined,
    opportunity_category: typeof d.opportunity_category === "string" ? d.opportunity_category : undefined,
    potential_impact: typeof d.potential_impact === "string" ? d.potential_impact : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
  };
}

function parseForecast(raw: unknown): StrategicForecast {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    forecast_key: typeof d.forecast_key === "string" ? d.forecast_key : undefined,
    forecast_title: typeof d.forecast_title === "string" ? d.forecast_title : undefined,
    forecast_category: typeof d.forecast_category === "string" ? d.forecast_category : undefined,
    forecast_horizon: typeof d.forecast_horizon === "string" ? d.forecast_horizon : undefined,
    projected_value: Number(d.projected_value ?? 0),
    confidence_percent: Number(d.confidence_percent ?? 0),
    trend_direction: typeof d.trend_direction === "string" ? d.trend_direction : undefined,
  };
}

function parseScenario(raw: unknown): StrategicScenario {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    scenario_key: typeof d.scenario_key === "string" ? d.scenario_key : undefined,
    scenario_title: typeof d.scenario_title === "string" ? d.scenario_title : undefined,
    scenario_type: typeof d.scenario_type === "string" ? d.scenario_type : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    probability_percent: Number(d.probability_percent ?? 0),
  };
}

function parsePriority(raw: unknown): ExecutivePriority {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    priority_key: typeof d.priority_key === "string" ? d.priority_key : undefined,
    priority_title: typeof d.priority_title === "string" ? d.priority_title : undefined,
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    business_impact: typeof d.business_impact === "string" ? d.business_impact : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    deadline_at: typeof d.deadline_at === "string" ? d.deadline_at : undefined,
  };
}

function parseCompetitive(raw: unknown): CompetitiveSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    relevance: typeof d.relevance === "string" ? d.relevance : undefined,
  };
}

function parseReport(raw: unknown): DecisionSupportReport {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    report_key: typeof d.report_key === "string" ? d.report_key : undefined,
    report_title: typeof d.report_title === "string" ? d.report_title : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    generated_at: typeof d.generated_at === "string" ? d.generated_at : undefined,
  };
}

function parseAdvisorSignal(raw: unknown): ExecutiveAdvisorSignal {
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

export function parseEnterpriseStrategicIntelligenceAdvisoryCenter(
  raw: unknown
): EnterpriseStrategicIntelligenceAdvisoryCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    decision_support_route: typeof d.decision_support_route === "string" ? d.decision_support_route : undefined,
    executive_route: typeof d.executive_route === "string" ? d.executive_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    objectives: Array.isArray(d.objectives) ? d.objectives.map(parseObjective) : [],
    initiatives: Array.isArray(d.initiatives) ? d.initiatives.map(parseInitiative) : [],
    briefings: Array.isArray(d.briefings) ? d.briefings.map(parseBriefing) : [],
    risks: Array.isArray(d.risks) ? d.risks.map(parseRisk) : [],
    opportunities: Array.isArray(d.opportunities) ? d.opportunities.map(parseOpportunity) : [],
    forecasts: Array.isArray(d.forecasts) ? d.forecasts.map(parseForecast) : [],
    scenarios: Array.isArray(d.scenarios) ? d.scenarios.map(parseScenario) : [],
    priorities: Array.isArray(d.priorities) ? d.priorities.map(parsePriority) : [],
    competitive_signals: Array.isArray(d.competitive_signals) ? d.competitive_signals.map(parseCompetitive) : [],
    decision_reports: Array.isArray(d.decision_reports) ? d.decision_reports.map(parseReport) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisorSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}

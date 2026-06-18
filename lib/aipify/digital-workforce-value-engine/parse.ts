import type {
  BusinessValueMetric,
  DepartmentValue,
  DigitalWorkforceValueCenter,
  RoiAnalysis,
  ValueAdvisorSignal,
  ValueBenchmark,
  ValueForecast,
  ValueScorecard,
  WorkforceEconomics,
} from "./types";

function parseDepartment(raw: unknown): DepartmentValue {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    department_key: typeof d.department_key === "string" ? d.department_key : undefined,
    department_name: typeof d.department_name === "string" ? d.department_name : undefined,
    department_type: typeof d.department_type === "string" ? d.department_type : undefined,
    support_value: Number(d.support_value ?? 0),
    sales_value: Number(d.sales_value ?? 0),
    productivity_gain_percent: Number(d.productivity_gain_percent ?? 0),
    automation_value: Number(d.automation_value ?? 0),
    roi_percent: Number(d.roi_percent ?? 0),
  };
}

function parseScorecard(raw: unknown): ValueScorecard {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    scorecard_key: typeof d.scorecard_key === "string" ? d.scorecard_key : undefined,
    employee_name: typeof d.employee_name === "string" ? d.employee_name : undefined,
    performance_score: Number(d.performance_score ?? 0),
    reliability_score: Number(d.reliability_score ?? 0),
    productivity_score: Number(d.productivity_score ?? 0),
    savings_generated: Number(d.savings_generated ?? 0),
    business_impact_score: Number(d.business_impact_score ?? 0),
    automation_coverage: Number(d.automation_coverage ?? 0),
    overall_value_score: Number(d.overall_value_score ?? 0),
  };
}

function parseRoi(raw: unknown): RoiAnalysis {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    analysis_key: typeof d.analysis_key === "string" ? d.analysis_key : undefined,
    analysis_title: typeof d.analysis_title === "string" ? d.analysis_title : undefined,
    workforce_cost: Number(d.workforce_cost ?? 0),
    operational_savings: Number(d.operational_savings ?? 0),
    productivity_gains: Number(d.productivity_gains ?? 0),
    revenue_impact: Number(d.revenue_impact ?? 0),
    automation_value: Number(d.automation_value ?? 0),
    return_on_investment: Number(d.return_on_investment ?? 0),
  };
}

function parseForecast(raw: unknown): ValueForecast {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    forecast_key: typeof d.forecast_key === "string" ? d.forecast_key : undefined,
    forecast_title: typeof d.forecast_title === "string" ? d.forecast_title : undefined,
    forecast_horizon: typeof d.forecast_horizon === "string" ? d.forecast_horizon : undefined,
    future_savings: Number(d.future_savings ?? 0),
    future_productivity_gains: Number(d.future_productivity_gains ?? 0),
    workforce_expansion_roi: Number(d.workforce_expansion_roi ?? 0),
  };
}

function parseBenchmark(raw: unknown): ValueBenchmark {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    benchmark_key: typeof d.benchmark_key === "string" ? d.benchmark_key : undefined,
    benchmark_title: typeof d.benchmark_title === "string" ? d.benchmark_title : undefined,
    benchmark_scope: typeof d.benchmark_scope === "string" ? d.benchmark_scope : undefined,
    comparison_data: d.comparison_data,
  };
}

function parseEconomics(raw: unknown): WorkforceEconomics {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    economics_key: typeof d.economics_key === "string" ? d.economics_key : undefined,
    platform_costs: Number(d.platform_costs ?? 0),
    licensing_costs: Number(d.licensing_costs ?? 0),
    department_costs: Number(d.department_costs ?? 0),
    operational_costs: Number(d.operational_costs ?? 0),
    training_costs: Number(d.training_costs ?? 0),
    infrastructure_costs: Number(d.infrastructure_costs ?? 0),
    workforce_allocation:
      typeof d.workforce_allocation === "object" && d.workforce_allocation
        ? (d.workforce_allocation as Record<string, unknown>)
        : undefined,
  };
}

function parseMetric(raw: unknown): BusinessValueMetric {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    metric_key: typeof d.metric_key === "string" ? d.metric_key : undefined,
    metric_period: typeof d.metric_period === "string" ? d.metric_period : undefined,
    hours_saved: Number(d.hours_saved ?? 0),
    employees_assisted: Number(d.employees_assisted ?? 0),
    tasks_completed: Number(d.tasks_completed ?? 0),
    projects_accelerated: Number(d.projects_accelerated ?? 0),
    customer_requests_resolved: Number(d.customer_requests_resolved ?? 0),
    operational_efficiency: Number(d.operational_efficiency ?? 0),
  };
}

function parseSignal(raw: unknown): ValueAdvisorSignal {
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

export function parseDigitalWorkforceValueCenter(raw: unknown): DigitalWorkforceValueCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    recruitment_route: typeof d.recruitment_route === "string" ? d.recruitment_route : undefined,
    lifecycle_route: typeof d.lifecycle_route === "string" ? d.lifecycle_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    department_value: Array.isArray(d.department_value) ? d.department_value.map(parseDepartment) : [],
    scorecards: Array.isArray(d.scorecards) ? d.scorecards.map(parseScorecard) : [],
    roi_analyses: Array.isArray(d.roi_analyses) ? d.roi_analyses.map(parseRoi) : [],
    forecasts: Array.isArray(d.forecasts) ? d.forecasts.map(parseForecast) : [],
    benchmarks: Array.isArray(d.benchmarks) ? d.benchmarks.map(parseBenchmark) : [],
    workforce_economics: Array.isArray(d.workforce_economics) ? d.workforce_economics.map(parseEconomics) : [],
    business_metrics: Array.isArray(d.business_metrics) ? d.business_metrics.map(parseMetric) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}

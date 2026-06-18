import type {
  EnterpriseValueRealizationRoiCenter,
  ValueAdvisorSignal,
  ValueBenchmark,
  ValueCostSaving,
  ValueIntelligenceSignal,
  ValueReport,
  ValueRevenueImpact,
  ValueRoiMetric,
  ValueStrategicImpact,
  ValueTimeSaving,
  ValueTimelineEntry,
  ValueWorkforceImpact,
} from "./types";

function num(v: unknown): number {
  return Number(v ?? 0);
}

function parseRoi(raw: unknown): ValueRoiMetric {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    metric_key: typeof d.metric_key === "string" ? d.metric_key : undefined,
    metric_title: typeof d.metric_title === "string" ? d.metric_title : undefined,
    period_type: typeof d.period_type === "string" ? d.period_type : undefined,
    subscription_cost: num(d.subscription_cost),
    operational_savings: num(d.operational_savings),
    revenue_impact: num(d.revenue_impact),
    efficiency_gains: num(d.efficiency_gains),
    risk_reduction: num(d.risk_reduction),
    net_roi_percent: num(d.net_roi_percent),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseTimeSaving(raw: unknown): ValueTimeSaving {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    savings_key: typeof d.savings_key === "string" ? d.savings_key : undefined,
    savings_title: typeof d.savings_title === "string" ? d.savings_title : undefined,
    hours_saved: num(d.hours_saved),
    tasks_automated: num(d.tasks_automated),
    category: typeof d.category === "string" ? d.category : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseCostSaving(raw: unknown): ValueCostSaving {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    savings_key: typeof d.savings_key === "string" ? d.savings_key : undefined,
    savings_title: typeof d.savings_title === "string" ? d.savings_title : undefined,
    savings_type: typeof d.savings_type === "string" ? d.savings_type : undefined,
    amount: num(d.amount),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseRevenue(raw: unknown): ValueRevenueImpact {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    impact_key: typeof d.impact_key === "string" ? d.impact_key : undefined,
    impact_title: typeof d.impact_title === "string" ? d.impact_title : undefined,
    impact_type: typeof d.impact_type === "string" ? d.impact_type : undefined,
    amount: num(d.amount),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseWorkforce(raw: unknown): ValueWorkforceImpact {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    impact_key: typeof d.impact_key === "string" ? d.impact_key : undefined,
    impact_title: typeof d.impact_title === "string" ? d.impact_title : undefined,
    impact_type: typeof d.impact_type === "string" ? d.impact_type : undefined,
    score: num(d.score),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseStrategic(raw: unknown): ValueStrategicImpact {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    impact_key: typeof d.impact_key === "string" ? d.impact_key : undefined,
    impact_title: typeof d.impact_title === "string" ? d.impact_title : undefined,
    impact_type: typeof d.impact_type === "string" ? d.impact_type : undefined,
    score: num(d.score),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseTimeline(raw: unknown): ValueTimelineEntry {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    timeline_key: typeof d.timeline_key === "string" ? d.timeline_key : undefined,
    period_label: typeof d.period_label === "string" ? d.period_label : undefined,
    estimated_value: num(d.estimated_value),
    hours_saved: num(d.hours_saved),
    cost_savings: num(d.cost_savings),
    revenue_impact: num(d.revenue_impact),
    roi_percent: num(d.roi_percent),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseBenchmark(raw: unknown): ValueBenchmark {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    benchmark_key: typeof d.benchmark_key === "string" ? d.benchmark_key : undefined,
    benchmark_title: typeof d.benchmark_title === "string" ? d.benchmark_title : undefined,
    benchmark_type: typeof d.benchmark_type === "string" ? d.benchmark_type : undefined,
    current_value: num(d.current_value),
    comparison_value: num(d.comparison_value),
    variance_percent: num(d.variance_percent),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseReport(raw: unknown): ValueReport {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    report_key: typeof d.report_key === "string" ? d.report_key : undefined,
    report_title: typeof d.report_title === "string" ? d.report_title : undefined,
    report_type: typeof d.report_type === "string" ? d.report_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseIntelligence(raw: unknown): ValueIntelligenceSignal {
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

function parseAdvisor(raw: unknown): ValueAdvisorSignal {
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

function parseArray<T>(raw: unknown, parser: (item: unknown) => T): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser);
}

export function parseEnterpriseValueRealizationRoiCenter(raw: unknown): EnterpriseValueRealizationRoiCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    value_engine_route: typeof d.value_engine_route === "string" ? d.value_engine_route : undefined,
    value_realization_route: typeof d.value_realization_route === "string" ? d.value_realization_route : undefined,
    impact_metrics_route: typeof d.impact_metrics_route === "string" ? d.impact_metrics_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    roi_metrics: parseArray(d.roi_metrics, parseRoi),
    time_savings: parseArray(d.time_savings, parseTimeSaving),
    cost_savings: parseArray(d.cost_savings, parseCostSaving),
    revenue_impact: parseArray(d.revenue_impact, parseRevenue),
    workforce_impact: parseArray(d.workforce_impact, parseWorkforce),
    strategic_impact: parseArray(d.strategic_impact, parseStrategic),
    value_timeline: parseArray(d.value_timeline, parseTimeline),
    benchmarks: parseArray(d.benchmarks, parseBenchmark),
    value_reports: parseArray(d.value_reports, parseReport),
    intelligence_signals: parseArray(d.intelligence_signals, parseIntelligence),
    advisor_signals: parseArray(d.advisor_signals, parseAdvisor),
    audit_logs: parseArray(d.audit_logs, (l) => l as Record<string, unknown>),
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard !== null
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
    governance:
      typeof d.governance === "object" && d.governance !== null ? (d.governance as Record<string, unknown>) : undefined,
  };
}

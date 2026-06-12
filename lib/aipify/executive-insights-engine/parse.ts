import type {
  AbosSuccessCriterion,
  CompanionCommunicationExample,
  DataSources,
  ExecutiveInsightsEngineCard,
  ExecutiveInsightsEngineDashboard,
  ExecutiveInsightItem,
  ExecutiveObjective,
  ExecutiveRecommendedAction,
  ExecutiveReportExport,
  ExecutiveReportSchedule,
  ExecutiveReportSummary,
  ImplementationBlueprint,
  InsightCategory,
  IntegrationLink,
  OverviewCapability,
  SelfLoveConnection,
  SinceLastTimeSummary,
  TrustConnection,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

function parseStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? (value as string[]) : undefined;
}

function parseImplementationBlueprint(value: unknown): ImplementationBlueprint | undefined {
  if (!value || typeof value !== "object") return undefined;
  const b = value as Record<string, unknown>;
  return {
    phase: typeof b.phase === "string" ? b.phase : undefined,
    doc: typeof b.doc === "string" ? b.doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    route: typeof b.route === "string" ? b.route : undefined,
    mapping_note: typeof b.mapping_note === "string" ? b.mapping_note : undefined,
  };
}

function parseSuccessCriteria(value: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof c.key === "string" ? c.key : undefined,
      label: typeof c.label === "string" ? c.label : undefined,
      met: Boolean(c.met),
      note: typeof c.note === "string" ? c.note : null,
    };
  });
}

function parseIntegrationLinks(value: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const l = (item ?? {}) as Record<string, unknown>;
    return {
      label: typeof l.label === "string" ? l.label : undefined,
      route: typeof l.route === "string" ? l.route : undefined,
      note: typeof l.note === "string" ? l.note : undefined,
    };
  });
}

function parseSinceLastTime(value: unknown): SinceLastTimeSummary | undefined {
  if (!value || typeof value !== "object") return undefined;
  const s = value as Record<string, unknown>;
  return {
    since: typeof s.since === "string" ? s.since : undefined,
    since_source: typeof s.since_source === "string" ? s.since_source : undefined,
    assumption_note: typeof s.assumption_note === "string" ? s.assumption_note : undefined,
    support_cases_resolved: Number(s.support_cases_resolved ?? 0),
    kc_articles_updated: Number(s.kc_articles_updated ?? 0),
    high_priority_tasks_completed: Number(s.high_priority_tasks_completed ?? 0),
    bottlenecks_open: Number(s.bottlenecks_open ?? 0),
    bell_moments: Number(s.bell_moments ?? 0),
    trend_summary: typeof s.trend_summary === "string" ? s.trend_summary : undefined,
  };
}

function parseExecutiveObjectives(value: unknown): ExecutiveObjective[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      label: typeof o.label === "string" ? o.label : undefined,
      description: typeof o.description === "string" ? o.description : undefined,
    };
  });
}

function parseOverviewCapabilities(value: unknown): OverviewCapability[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof c.key === "string" ? c.key : undefined,
      label: typeof c.label === "string" ? c.label : undefined,
      description: typeof c.description === "string" ? c.description : undefined,
    };
  });
}

function parseInsightCategories(value: unknown): InsightCategory[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof c.key === "string" ? c.key : undefined,
      label: typeof c.label === "string" ? c.label : undefined,
      description: typeof c.description === "string" ? c.description : undefined,
      examples: parseStringArray(c.examples),
      source_modules: parseStringArray(c.source_modules),
    };
  });
}

function parseCompanionExamples(value: unknown): CompanionCommunicationExample[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const e = (item ?? {}) as Record<string, unknown>;
    return {
      emoji: typeof e.emoji === "string" ? e.emoji : undefined,
      key: typeof e.key === "string" ? e.key : undefined,
      scenario: typeof e.scenario === "string" ? e.scenario : undefined,
      example: typeof e.example === "string" ? e.example : undefined,
    };
  });
}

function parseSelfLoveConnection(value: unknown): SelfLoveConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const s = value as Record<string, unknown>;
  return {
    principle: typeof s.principle === "string" ? s.principle : undefined,
    executive_patterns: parseStringArray(s.executive_patterns),
    self_love_route: typeof s.self_love_route === "string" ? s.self_love_route : undefined,
    naming_doc: typeof s.naming_doc === "string" ? s.naming_doc : undefined,
    boundary_note: typeof s.boundary_note === "string" ? s.boundary_note : undefined,
  };
}

function parseTrustConnection(value: unknown): TrustConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const t = value as Record<string, unknown>;
  return {
    principle: typeof t.principle === "string" ? t.principle : undefined,
    executives_should_know: parseStringArray(t.executives_should_know),
    organizations_should_understand: parseStringArray(t.organizations_should_understand),
    audit_note: typeof t.audit_note === "string" ? t.audit_note : undefined,
  };
}

function parseDataSources(value: unknown): DataSources | undefined {
  if (!value || typeof value !== "object") return undefined;
  const d = value as Record<string, unknown>;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    modules: asRecordList(d.modules),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

export function parseExecutiveInsightsEngineCard(data: unknown): ExecutiveInsightsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    health_score: typeof d.health_score === "number" ? d.health_score : Number(d.health_score ?? 0),
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    risk_count: Number(d.risk_count ?? 0),
    action_count: Number(d.action_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    executive_insights_engine_note:
      typeof d.executive_insights_engine_note === "string" ? d.executive_insights_engine_note : undefined,
    since_last_time: parseSinceLastTime(d.since_last_time),
  };
}

export function parseExecutiveInsightsEngineDashboard(
  data: unknown
): ExecutiveInsightsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    executive_insights_engine_note:
      typeof d.executive_insights_engine_note === "string" ? d.executive_insights_engine_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    executive_objectives: parseExecutiveObjectives(d.executive_objectives),
    overview_capabilities: parseOverviewCapabilities(d.overview_capabilities),
    insight_categories: parseInsightCategories(d.insight_categories),
    since_last_time: parseSinceLastTime(d.since_last_time),
    companion_communication_examples: parseCompanionExamples(d.companion_communication_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseTrustConnection(d.trust_connection),
    data_sources: parseDataSources(d.data_sources),
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as Record<string, unknown>)
        : undefined,
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    integration_links: parseIntegrationLinks(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringArray(d.principles),
    summary:
      typeof d.summary === "object" && d.summary
        ? (d.summary as ExecutiveInsightsEngineDashboard["summary"])
        : undefined,
    organization_health:
      typeof d.organization_health === "object" && d.organization_health
        ? (d.organization_health as ExecutiveInsightsEngineDashboard["organization_health"])
        : undefined,
    major_achievements: asRecordList(d.major_achievements) as ExecutiveInsightItem[],
    operational_risks: asRecordList(d.operational_risks) as ExecutiveInsightItem[],
    strategic_opportunities: asRecordList(d.strategic_opportunities) as ExecutiveInsightItem[],
    customer_trends: asRecordList(d.customer_trends),
    ai_recommendations: asRecordList(d.ai_recommendations) as ExecutiveRecommendedAction[],
    recommended_actions: asRecordList(d.recommended_actions) as ExecutiveRecommendedAction[],
    recent_reports: asRecordList(d.recent_reports) as ExecutiveReportSummary[],
    schedules: asRecordList(d.schedules) as ExecutiveReportSchedule[],
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    source_modules: asRecordList(d.source_modules),
  };
}

export function parseExecutiveReport(data: unknown): Record<string, unknown> {
  return (data ?? {}) as Record<string, unknown>;
}

export function parseExecutiveReportExport(data: unknown): ExecutiveReportExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    export_format: typeof d.export_format === "string" ? d.export_format : undefined,
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    report:
      typeof d.report === "object" && d.report ? (d.report as Record<string, unknown>) : undefined,
  };
}

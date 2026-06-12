import type {
  AbosSuccessCriterion,
  CompanionCommunicationExample,
  ImplementationBlueprint,
  IntegrationLink,
  ModuleOverviews,
  OperationalObjective,
  OperationsCenterFoundationEngineCard,
  OperationsCenterFoundationEngineDashboard,
  OperationsEvent,
  SelfLoveConnection,
  SinceLastTimeSummary,
  TrustConnection,
} from "./types";

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
    recognition_moments: Number(s.recognition_moments ?? 0),
    operations_events_acknowledged: Number(s.operations_events_acknowledged ?? 0),
    trend_summary: typeof s.trend_summary === "string" ? s.trend_summary : undefined,
  };
}

function parseModuleOverviews(value: unknown): ModuleOverviews | undefined {
  if (!value || typeof value !== "object") return undefined;
  const m = value as Record<string, unknown>;
  const block = (key: string) => {
    const b = m[key];
    if (!b || typeof b !== "object") return undefined;
    return b as ModuleOverviews[keyof ModuleOverviews];
  };
  return {
    support_overview: block("support_overview"),
    task_overview: block("task_overview"),
    knowledge_overview: block("knowledge_overview"),
    executive_overview: block("executive_overview"),
    recognition_overview: block("recognition_overview"),
  };
}

function parseOperationalObjectives(value: unknown): OperationalObjective[] | undefined {
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
    operations_patterns: Array.isArray(s.operations_patterns) ? (s.operations_patterns as string[]) : undefined,
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
    operators_should_know: Array.isArray(t.operators_should_know) ? (t.operators_should_know as string[]) : undefined,
    organizations_should_understand: Array.isArray(t.organizations_should_understand)
      ? (t.organizations_should_understand as string[])
      : undefined,
    audit_note: typeof t.audit_note === "string" ? t.audit_note : undefined,
  };
}

function parseEvents(value: unknown): OperationsEvent[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value as OperationsEvent[];
}

export function parseOperationsCenterFoundationEngineCard(data: unknown): OperationsCenterFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    open_events: Number(d.open_events ?? 0),
    urgent_events: Number(d.urgent_events ?? 0),
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    operations_center_foundation_engine_note:
      typeof d.operations_center_foundation_engine_note === "string"
        ? d.operations_center_foundation_engine_note
        : undefined,
    module_overviews: parseModuleOverviews(d.module_overviews),
    since_last_time: parseSinceLastTime(d.since_last_time),
    ...d,
  } as OperationsCenterFoundationEngineCard;
}

export function parseOperationsCenterFoundationEngineDashboard(
  data: unknown
): OperationsCenterFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    operations_center_foundation_engine_note:
      typeof d.operations_center_foundation_engine_note === "string"
        ? d.operations_center_foundation_engine_note
        : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    operational_objectives: parseOperationalObjectives(d.operational_objectives),
    module_overviews: parseModuleOverviews(d.module_overviews),
    since_last_time: parseSinceLastTime(d.since_last_time),
    companion_communication_examples: parseCompanionExamples(d.companion_communication_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseTrustConnection(d.trust_connection),
    data_sources: typeof d.data_sources === "object" && d.data_sources ? (d.data_sources as Record<string, unknown>) : undefined,
    dogfooding: typeof d.dogfooding === "object" && d.dogfooding ? (d.dogfooding as Record<string, unknown>) : undefined,
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    integration_links: parseIntegrationLinks(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    urgent_actions: parseEvents(d.urgent_actions),
    events: parseEvents(d.events),
    recent_completed: parseEvents(d.recent_completed),
    ...d,
  } as OperationsCenterFoundationEngineDashboard;
}

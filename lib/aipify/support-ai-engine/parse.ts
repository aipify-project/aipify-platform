import type {
  AbosSuccessCriterion,
  CaseManagementCapabilities,
  ImplementationBlueprint,
  IntegrationLink,
  KcConnection,
  SelfLoveConnection,
  SupportAiEngineCard,
  SupportAiEngineDashboard,
  SupportObjective,
  SupportTier,
  TrustConnection,
} from "./types";

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

function parseSupportObjectives(value: unknown): SupportObjective[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      label: typeof o.label === "string" ? o.label : undefined,
    };
  });
}

function parseSupportTiers(value: unknown): SupportTier[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const t = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof t.key === "string" ? t.key : undefined,
      label: typeof t.label === "string" ? t.label : undefined,
      focus: parseStringArray(t.focus),
      examples: parseStringArray(t.examples),
      response_modes: parseStringArray(t.response_modes),
    };
  });
}

function parseKcConnection(value: unknown): KcConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const k = value as Record<string, unknown>;
  return {
    principle: typeof k.principle === "string" ? k.principle : undefined,
    flows: Array.isArray(k.flows) ? (k.flows as KcConnection["flows"]) : undefined,
    knowledge_center_route: typeof k.knowledge_center_route === "string" ? k.knowledge_center_route : undefined,
    gap_rpc: typeof k.gap_rpc === "string" ? k.gap_rpc : undefined,
  };
}

function parseSelfLoveConnection(value: unknown): SelfLoveConnection | undefined {
  if (!value || typeof value !== "object") return undefined;
  const s = value as Record<string, unknown>;
  return {
    principle: typeof s.principle === "string" ? s.principle : undefined,
    support_patterns: parseStringArray(s.support_patterns),
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
    customers_should_know: parseStringArray(t.customers_should_know),
    organizations_should_understand: parseStringArray(t.organizations_should_understand),
    audit_note: typeof t.audit_note === "string" ? t.audit_note : undefined,
  };
}

function parseCaseManagementCapabilities(value: unknown): CaseManagementCapabilities | undefined {
  if (!value || typeof value !== "object") return undefined;
  const c = value as Record<string, unknown>;
  return {
    note: typeof c.note === "string" ? c.note : undefined,
    capabilities: Array.isArray(c.capabilities) ? (c.capabilities as CaseManagementCapabilities["capabilities"]) : undefined,
  };
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

function parseDogfooding(value: unknown): SupportAiEngineDashboard["dogfooding"] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const d = value as Record<string, unknown>;
  const parseEntry = (entry: unknown) => {
    if (!entry || typeof entry !== "object") return undefined;
    const e = entry as Record<string, unknown>;
    return {
      slug: typeof e.slug === "string" ? e.slug : undefined,
      role: typeof e.role === "string" ? e.role : undefined,
      focus: parseStringArray(e.focus),
    };
  };
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    aipify_group: parseEntry(d.aipify_group),
    unonight: parseEntry(d.unonight),
  };
}

export function parseSupportAiEngineCard(data: unknown): SupportAiEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_cases: Number(d.open_cases ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    support_ai_engine_note: typeof d.support_ai_engine_note === "string" ? d.support_ai_engine_note : undefined,
  };
}

export function parseSupportAiEngineDashboard(data: unknown): SupportAiEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    implementation_blueprint: parseImplementationBlueprint(d.implementation_blueprint),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    support_ai_engine_note: typeof d.support_ai_engine_note === "string" ? d.support_ai_engine_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    support_objectives: parseSupportObjectives(d.support_objectives),
    support_tiers: parseSupportTiers(d.support_tiers),
    case_management_capabilities: parseCaseManagementCapabilities(d.case_management_capabilities),
    kc_connection: parseKcConnection(d.kc_connection),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: parseDogfooding(d.dogfooding),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    integration_links: parseIntegrationLinks(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: parseStringArray(d.principles),
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as SupportAiEngineDashboard["settings"])
        : undefined,
    open_cases: Array.isArray(d.open_cases) ? (d.open_cases as SupportAiEngineDashboard["open_cases"]) : [],
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as SupportAiEngineDashboard["pending_approvals"])
      : [],
    escalated_cases: Array.isArray(d.escalated_cases)
      ? (d.escalated_cases as SupportAiEngineDashboard["escalated_cases"])
      : [],
    unresolved_issues: Array.isArray(d.unresolved_issues)
      ? (d.unresolved_issues as SupportAiEngineDashboard["unresolved_issues"])
      : [],
    ai_statistics:
      typeof d.ai_statistics === "object" && d.ai_statistics
        ? (d.ai_statistics as SupportAiEngineDashboard["ai_statistics"])
        : undefined,
    metrics: typeof d.metrics === "object" && d.metrics ? (d.metrics as Record<string, unknown>) : undefined,
    knowledge_gaps: Array.isArray(d.knowledge_gaps)
      ? (d.knowledge_gaps as SupportAiEngineDashboard["knowledge_gaps"])
      : [],
    response_modes: parseStringArray(d.response_modes),
    channels: parseStringArray(d.channels),
  };
}

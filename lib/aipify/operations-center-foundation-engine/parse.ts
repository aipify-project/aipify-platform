import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionCommunicationExample,
  EngagementSummary,
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
    spec_doc: typeof b.spec_doc === "string" ? b.spec_doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    era: typeof b.era === "string" ? b.era : undefined,
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
    practices: Array.isArray(s.practices) ? (s.practices as string[]) : undefined,
    journey_phrase: typeof s.journey_phrase === "string" ? s.journey_phrase : undefined,
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

function parseBlueprintObjectives(value: unknown): BlueprintObjective[] | undefined {
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

function parseEngagementSummary(value: unknown): EngagementSummary | undefined {
  if (!value || typeof value !== "object") return undefined;
  const e = value as Record<string, unknown>;
  return {
    module_overview_blocks: Number(e.module_overview_blocks ?? 0),
    open_operations_events: Number(e.open_operations_events ?? 0),
    urgent_operations_events: Number(e.urgent_operations_events ?? 0),
    support_open_cases: Number(e.support_open_cases ?? 0),
    knowledge_open_gaps: Number(e.knowledge_open_gaps ?? 0),
    tasks_overdue: Number(e.tasks_overdue ?? 0),
    connection_chain_length: Number(e.connection_chain_length ?? 0),
    cross_functional_observations: Number(e.cross_functional_observations ?? 0),
    collaboration_examples: Number(e.collaboration_examples ?? 0),
    pending_leadership_approvals: Number(e.pending_leadership_approvals ?? 0),
    recognition_signals: Number(e.recognition_signals ?? 0),
    executive_overview_signals: Number(e.executive_overview_signals ?? 0),
    executive_dashboard_dimensions: Number(e.executive_dashboard_dimensions ?? 0),
    daily_briefing_elements: Number(e.daily_briefing_elements ?? 0),
    companion_guidance_examples: Number(e.companion_guidance_examples ?? 0),
    initiative_orchestration_elements: Number(e.initiative_orchestration_elements ?? 0),
    companion_network_count: Number(e.companion_network_count ?? 0),
    health_monitoring_themes: Number(e.health_monitoring_themes ?? 0),
    review_cycle_count: Number(e.review_cycle_count ?? 0),
    era_cross_link_count: Number(e.era_cross_link_count ?? 0),
    companion_limitations_count: Number(e.companion_limitations_count ?? 0),
    privacy_note: typeof e.privacy_note === "string" ? e.privacy_note : undefined,
  };
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
    implementation_blueprint_phase70: parseImplementationBlueprint(d.implementation_blueprint_phase70),
    operations_center_foundation_engine_note:
      typeof d.operations_center_foundation_engine_note === "string"
        ? d.operations_center_foundation_engine_note
        : undefined,
    module_overviews: parseModuleOverviews(d.module_overviews),
    since_last_time: parseSinceLastTime(d.since_last_time),
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle: typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    cross_functional_note: typeof d.cross_functional_note === "string" ? d.cross_functional_note : undefined,
    implementation_blueprint_phase75: parseImplementationBlueprint(d.implementation_blueprint_phase75),
    eocbp_mission: typeof d.eocbp_mission === "string" ? d.eocbp_mission : undefined,
    eocbp_abos_principle: typeof d.eocbp_abos_principle === "string" ? d.eocbp_abos_principle : undefined,
    eocbp_engagement_summary: parseEngagementSummary(d.eocbp_engagement_summary),
    eocbp_note: typeof d.eocbp_note === "string" ? d.eocbp_note : undefined,
    executive_leadership_note:
      typeof d.executive_leadership_note === "string" ? d.executive_leadership_note : undefined,
    implementation_blueprint_phase130: parseImplementationBlueprint(d.implementation_blueprint_phase130),
    eoccep130_mission: typeof d.eoccep130_mission === "string" ? d.eoccep130_mission : undefined,
    eoccep130_abos_principle: typeof d.eoccep130_abos_principle === "string" ? d.eoccep130_abos_principle : undefined,
    eoccep130_engagement_summary: parseEngagementSummary(d.eoccep130_engagement_summary),
    eoccep130_note: typeof d.eoccep130_note === "string" ? d.eoccep130_note : undefined,
    enterprise_command_note: typeof d.enterprise_command_note === "string" ? d.enterprise_command_note : undefined,
    enterprise_intelligence_era_capstone_note:
      typeof d.enterprise_intelligence_era_capstone_note === "string"
        ? d.enterprise_intelligence_era_capstone_note
        : undefined,
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
    implementation_blueprint_phase70: parseImplementationBlueprint(d.implementation_blueprint_phase70),
    cross_functional_intelligence_note:
      typeof d.cross_functional_intelligence_note === "string" ? d.cross_functional_intelligence_note : undefined,
    blueprint_distinction_note: typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle: typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseBlueprintObjectives(d.blueprint_objectives),
    organizational_connections:
      typeof d.organizational_connections === "object" && d.organizational_connections
        ? (d.organizational_connections as OperationsCenterFoundationEngineDashboard["organizational_connections"])
        : undefined,
    cross_functional_observations:
      typeof d.cross_functional_observations === "object" && d.cross_functional_observations
        ? (d.cross_functional_observations as OperationsCenterFoundationEngineDashboard["cross_functional_observations"])
        : undefined,
    information_flow_visibility:
      typeof d.information_flow_visibility === "object" && d.information_flow_visibility
        ? (d.information_flow_visibility as OperationsCenterFoundationEngineDashboard["information_flow_visibility"])
        : undefined,
    bottleneck_identification:
      typeof d.bottleneck_identification === "object" && d.bottleneck_identification
        ? (d.bottleneck_identification as OperationsCenterFoundationEngineDashboard["bottleneck_identification"])
        : undefined,
    collaboration_opportunities:
      typeof d.collaboration_opportunities === "object" && d.collaboration_opportunities
        ? (d.collaboration_opportunities as OperationsCenterFoundationEngineDashboard["collaboration_opportunities"])
        : undefined,
    blueprint_leadership_insights:
      typeof d.blueprint_leadership_insights === "object" && d.blueprint_leadership_insights
        ? (d.blueprint_leadership_insights as OperationsCenterFoundationEngineDashboard["blueprint_leadership_insights"])
        : undefined,
    blueprint_self_love_connection: parseSelfLoveConnection(d.blueprint_self_love_connection),
    blueprint_trust_connection: parseTrustConnection(d.blueprint_trust_connection),
    privacy_principles:
      typeof d.privacy_principles === "object" && d.privacy_principles
        ? (d.privacy_principles as OperationsCenterFoundationEngineDashboard["privacy_principles"])
        : undefined,
    blueprint_dogfooding:
      typeof d.blueprint_dogfooding === "object" && d.blueprint_dogfooding
        ? (d.blueprint_dogfooding as Record<string, unknown>)
        : undefined,
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases)
      ? (d.blueprint_vision_phrases as string[])
      : undefined,
    blueprint_privacy_note: typeof d.blueprint_privacy_note === "string" ? d.blueprint_privacy_note : undefined,
    implementation_blueprint_phase75: parseImplementationBlueprint(d.implementation_blueprint_phase75),
    executive_operations_center_note:
      typeof d.executive_operations_center_note === "string" ? d.executive_operations_center_note : undefined,
    eocbp_distinction_note: typeof d.eocbp_distinction_note === "string" ? d.eocbp_distinction_note : undefined,
    eocbp_mission: typeof d.eocbp_mission === "string" ? d.eocbp_mission : undefined,
    eocbp_philosophy: typeof d.eocbp_philosophy === "string" ? d.eocbp_philosophy : undefined,
    eocbp_abos_principle: typeof d.eocbp_abos_principle === "string" ? d.eocbp_abos_principle : undefined,
    eocbp_objectives: parseBlueprintObjectives(d.eocbp_objectives),
    eocbp_executive_dashboard:
      typeof d.eocbp_executive_dashboard === "object" && d.eocbp_executive_dashboard
        ? (d.eocbp_executive_dashboard as OperationsCenterFoundationEngineDashboard["eocbp_executive_dashboard"])
        : undefined,
    eocbp_daily_executive_briefings:
      typeof d.eocbp_daily_executive_briefings === "object" && d.eocbp_daily_executive_briefings
        ? (d.eocbp_daily_executive_briefings as OperationsCenterFoundationEngineDashboard["eocbp_daily_executive_briefings"])
        : undefined,
    eocbp_executive_priority_center:
      typeof d.eocbp_executive_priority_center === "object" && d.eocbp_executive_priority_center
        ? (d.eocbp_executive_priority_center as OperationsCenterFoundationEngineDashboard["eocbp_executive_priority_center"])
        : undefined,
    eocbp_organizational_health_overview:
      typeof d.eocbp_organizational_health_overview === "object" && d.eocbp_organizational_health_overview
        ? (d.eocbp_organizational_health_overview as OperationsCenterFoundationEngineDashboard["eocbp_organizational_health_overview"])
        : undefined,
    eocbp_meeting_decision_continuity:
      typeof d.eocbp_meeting_decision_continuity === "object" && d.eocbp_meeting_decision_continuity
        ? (d.eocbp_meeting_decision_continuity as OperationsCenterFoundationEngineDashboard["eocbp_meeting_decision_continuity"])
        : undefined,
    eocbp_strategic_momentum_tracking:
      typeof d.eocbp_strategic_momentum_tracking === "object" && d.eocbp_strategic_momentum_tracking
        ? (d.eocbp_strategic_momentum_tracking as OperationsCenterFoundationEngineDashboard["eocbp_strategic_momentum_tracking"])
        : undefined,
    eocbp_companion_guidance:
      typeof d.eocbp_companion_guidance === "object" && d.eocbp_companion_guidance
        ? (d.eocbp_companion_guidance as OperationsCenterFoundationEngineDashboard["eocbp_companion_guidance"])
        : undefined,
    eocbp_self_love_connection: parseSelfLoveConnection(d.eocbp_self_love_connection),
    eocbp_trust_connection: parseTrustConnection(d.eocbp_trust_connection),
    eocbp_dogfooding:
      typeof d.eocbp_dogfooding === "object" && d.eocbp_dogfooding
        ? (d.eocbp_dogfooding as Record<string, unknown>)
        : undefined,
    eocbp_integration_links: parseIntegrationLinks(d.eocbp_integration_links),
    eocbp_engagement_summary: parseEngagementSummary(d.eocbp_engagement_summary),
    eocbp_success_criteria: parseSuccessCriteria(d.eocbp_success_criteria),
    eocbp_vision_phrases: Array.isArray(d.eocbp_vision_phrases)
      ? (d.eocbp_vision_phrases as string[])
      : undefined,
    eocbp_privacy_note: typeof d.eocbp_privacy_note === "string" ? d.eocbp_privacy_note : undefined,
    implementation_blueprint_phase130: parseImplementationBlueprint(d.implementation_blueprint_phase130),
    enterprise_command_engine_note:
      typeof d.enterprise_command_engine_note === "string" ? d.enterprise_command_engine_note : undefined,
    enterprise_intelligence_era_capstone_note:
      typeof d.enterprise_intelligence_era_capstone_note === "string"
        ? d.enterprise_intelligence_era_capstone_note
        : undefined,
    eoccep130_distinction_note:
      typeof d.eoccep130_distinction_note === "string" ? d.eoccep130_distinction_note : undefined,
    eoccep130_mission: typeof d.eoccep130_mission === "string" ? d.eoccep130_mission : undefined,
    eoccep130_philosophy: typeof d.eoccep130_philosophy === "string" ? d.eoccep130_philosophy : undefined,
    eoccep130_abos_principle: typeof d.eoccep130_abos_principle === "string" ? d.eoccep130_abos_principle : undefined,
    eoccep130_vision: typeof d.eoccep130_vision === "string" ? d.eoccep130_vision : undefined,
    eoccep130_objectives: parseBlueprintObjectives(d.eoccep130_objectives),
    eoccep130_executive_operations_center:
      typeof d.eoccep130_executive_operations_center === "object" && d.eoccep130_executive_operations_center
        ? (d.eoccep130_executive_operations_center as OperationsCenterFoundationEngineDashboard["eoccep130_executive_operations_center"])
        : undefined,
    eoccep130_enterprise_command_dashboard:
      typeof d.eoccep130_enterprise_command_dashboard === "object" && d.eoccep130_enterprise_command_dashboard
        ? (d.eoccep130_enterprise_command_dashboard as OperationsCenterFoundationEngineDashboard["eoccep130_enterprise_command_dashboard"])
        : undefined,
    eoccep130_initiative_orchestration:
      typeof d.eoccep130_initiative_orchestration === "object" && d.eoccep130_initiative_orchestration
        ? (d.eoccep130_initiative_orchestration as OperationsCenterFoundationEngineDashboard["eoccep130_initiative_orchestration"])
        : undefined,
    eoccep130_executive_alignment:
      typeof d.eoccep130_executive_alignment === "object" && d.eoccep130_executive_alignment
        ? (d.eoccep130_executive_alignment as OperationsCenterFoundationEngineDashboard["eoccep130_executive_alignment"])
        : undefined,
    eoccep130_decision_execution:
      typeof d.eoccep130_decision_execution === "object" && d.eoccep130_decision_execution
        ? (d.eoccep130_decision_execution as OperationsCenterFoundationEngineDashboard["eoccep130_decision_execution"])
        : undefined,
    eoccep130_executive_companion_network:
      typeof d.eoccep130_executive_companion_network === "object" && d.eoccep130_executive_companion_network
        ? (d.eoccep130_executive_companion_network as OperationsCenterFoundationEngineDashboard["eoccep130_executive_companion_network"])
        : undefined,
    eoccep130_organizational_health_monitoring:
      typeof d.eoccep130_organizational_health_monitoring === "object" && d.eoccep130_organizational_health_monitoring
        ? (d.eoccep130_organizational_health_monitoring as OperationsCenterFoundationEngineDashboard["eoccep130_organizational_health_monitoring"])
        : undefined,
    eoccep130_executive_review_cycles: Array.isArray(d.eoccep130_executive_review_cycles)
      ? (d.eoccep130_executive_review_cycles as OperationsCenterFoundationEngineDashboard["eoccep130_executive_review_cycles"])
      : undefined,
    eoccep130_enterprise_memory_integration:
      typeof d.eoccep130_enterprise_memory_integration === "object" && d.eoccep130_enterprise_memory_integration
        ? (d.eoccep130_enterprise_memory_integration as OperationsCenterFoundationEngineDashboard["eoccep130_enterprise_memory_integration"])
        : undefined,
    eoccep130_companion_limitations: Array.isArray(d.eoccep130_companion_limitations)
      ? (d.eoccep130_companion_limitations as OperationsCenterFoundationEngineDashboard["eoccep130_companion_limitations"])
      : undefined,
    eoccep130_self_love_connection: parseSelfLoveConnection(d.eoccep130_self_love_connection),
    eoccep130_enterprise_knowledge_library: parseBlueprintObjectives(d.eoccep130_enterprise_knowledge_library),
    eoccep130_integration_links: parseIntegrationLinks(d.eoccep130_integration_links),
    eoccep130_era_cross_links: Array.isArray(d.eoccep130_era_cross_links)
      ? (d.eoccep130_era_cross_links as OperationsCenterFoundationEngineDashboard["eoccep130_era_cross_links"])
      : undefined,
    eoccep130_dogfooding:
      typeof d.eoccep130_dogfooding === "object" && d.eoccep130_dogfooding
        ? (d.eoccep130_dogfooding as Record<string, unknown>)
        : undefined,
    eoccep130_engagement_summary: parseEngagementSummary(d.eoccep130_engagement_summary),
    eoccep130_success_criteria: parseSuccessCriteria(d.eoccep130_success_criteria),
    eoccep130_vision_phrases: Array.isArray(d.eoccep130_vision_phrases)
      ? (d.eoccep130_vision_phrases as string[])
      : undefined,
    eoccep130_privacy_note: typeof d.eoccep130_privacy_note === "string" ? d.eoccep130_privacy_note : undefined,
    ...d,
  } as OperationsCenterFoundationEngineDashboard;
}

import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  BlueprintSection,
  BottleneckResult,
  DigitalTwinCard,
  DigitalTwinDashboard,
  DigitalTwinEngagementSummary,
  DigitalTwinInsight,
  DigitalTwinKnowledgeOwner,
  DigitalTwinProcess,
  DigitalTwinRole,
  EscalationResult,
  ImplementationBlueprintMeta,
  IntegrationLink,
  KnowledgeRouteResult,
  OrganizationalDigitalTwinPhase124Blueprint,
  ProcessDetail,
  TwinHealthResult,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseBlueprintSection(data: unknown): BlueprintSection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintSection;
}

function parseEngagementSummary(data: unknown): DigitalTwinEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DigitalTwinEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parsePhase124Blueprint(data: unknown): OrganizationalDigitalTwinPhase124Blueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    phase: d.phase as string | undefined,
    doc: d.doc as string | undefined,
    spec_doc: d.spec_doc as string | undefined,
    engine_phase: d.engine_phase as string | undefined,
    era: d.era as string | undefined,
    route: d.route as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    objectives: parseObjectives(d.objectives),
    organizational_digital_twin: parseBlueprintSection(d.organizational_digital_twin),
    digital_twin_center: Array.isArray(d.digital_twin_center)
      ? (d.digital_twin_center as BlueprintObjective[])
      : undefined,
    organizational_map_engine: Array.isArray(d.organizational_map_engine)
      ? (d.organizational_map_engine as BlueprintObjective[])
      : undefined,
    dependency_intelligence: Array.isArray(d.dependency_intelligence)
      ? (d.dependency_intelligence as BlueprintObjective[])
      : undefined,
    simulation_workspace: parseBlueprintSection(d.simulation_workspace),
    transformation_impact_model: Array.isArray(d.transformation_impact_model)
      ? (d.transformation_impact_model as BlueprintObjective[])
      : undefined,
    knowledge_network_engine: Array.isArray(d.knowledge_network_engine)
      ? (d.knowledge_network_engine as BlueprintObjective[])
      : undefined,
    resilience_visualization: Array.isArray(d.resilience_visualization)
      ? (d.resilience_visualization as BlueprintObjective[])
      : undefined,
    executive_digital_twin_companion: Array.isArray(d.executive_digital_twin_companion)
      ? (d.executive_digital_twin_companion as BlueprintObjective[])
      : undefined,
    companion_limitations: Array.isArray(d.companion_limitations)
      ? (d.companion_limitations as BlueprintObjective[])
      : undefined,
    self_love_connection: parseBlueprintSection(d.self_love_connection),
    memory_engine: parseBlueprintSection(d.memory_engine),
    cross_links: parseIntegrationLinks(d.cross_links),
    limitation_principles: parseBlueprintSection(d.limitation_principles),
    companion_adaptation: parseBlueprintSection(d.companion_adaptation),
    success_metrics: Array.isArray(d.success_metrics)
      ? (d.success_metrics as BlueprintObjective[])
      : undefined,
    success_criteria: parseSuccessCriteria(d.success_criteria),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    privacy_note: d.privacy_note as string | undefined,
  };
}

function parseRole(row: unknown): DigitalTwinRole {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: s.id as string | undefined,
    role_key: String(s.role_key ?? ""),
    role_name: String(s.role_name ?? ""),
    description: s.description as string | null | undefined,
    responsibility_types: Array.isArray(s.responsibility_types)
      ? (s.responsibility_types as string[])
      : [],
    escalation_authority: Boolean(s.escalation_authority),
    knowledge_ownership: Boolean(s.knowledge_ownership),
  };
}

function parseInsight(row: unknown): DigitalTwinInsight {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    insight_type: String(s.insight_type ?? ""),
    summary: String(s.summary ?? ""),
    confidence: Number(s.confidence ?? 0),
    status: s.status as string | undefined,
  };
}

export function parseDigitalTwinCard(data: unknown): DigitalTwinCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    twin_health_score: d.twin_health_score as number | undefined,
    open_insights: d.open_insights as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
    implementation_blueprint_phase77: parseBlueprintMeta(d.implementation_blueprint_phase77),
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
    understanding_note: d.understanding_note as string | undefined,
    implementation_blueprint_phase124: parseBlueprintMeta(d.implementation_blueprint_phase124),
    phase124_mission: d.phase124_mission as string | undefined,
    phase124_abos_principle: d.phase124_abos_principle as string | undefined,
    phase124_engagement_summary: parseEngagementSummary(d.phase124_engagement_summary),
    phase124_note: d.phase124_note as string | undefined,
  };
}

export function parseDigitalTwinDashboard(data: unknown): DigitalTwinDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    twin_health_score: d.twin_health_score as number | undefined,
    process_coverage: d.process_coverage as number | undefined,
    knowledge_owners: d.knowledge_owners as number | undefined,
    low_confidence_count: d.low_confidence_count as number | undefined,
    roles: Array.isArray(d.roles) ? (d.roles as unknown[]).map(parseRole) : [],
    processes: Array.isArray(d.processes) ? (d.processes as DigitalTwinProcess[]) : [],
    knowledge_routing: Array.isArray(d.knowledge_routing)
      ? (d.knowledge_routing as DigitalTwinKnowledgeOwner[])
      : [],
    insights: Array.isArray(d.insights) ? (d.insights as unknown[]).map(parseInsight) : [],
    organization_units: Array.isArray(d.organization_units)
      ? (d.organization_units as DigitalTwinDashboard["organization_units"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    implementation_blueprint_phase77: parseBlueprintMeta(d.implementation_blueprint_phase77),
    organizational_digital_twin_note: d.organizational_digital_twin_note as string | undefined,
    blueprint_distinction_note: d.blueprint_distinction_note as string | undefined,
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_philosophy: d.blueprint_philosophy as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    blueprint_objectives: parseObjectives(d.blueprint_objectives),
    digital_twin_definition: parseBlueprintSection(d.digital_twin_definition),
    organizational_mapping: parseBlueprintSection(d.organizational_mapping),
    companion_observations: parseBlueprintSection(d.companion_observations),
    simulation_connection: parseBlueprintSection(d.simulation_connection),
    learning_organization_connection: parseBlueprintSection(d.learning_organization_connection),
    blueprint_self_love_connection: parseBlueprintSection(d.blueprint_self_love_connection),
    blueprint_leadership_insights: parseBlueprintSection(d.blueprint_leadership_insights),
    privacy_principles: parseBlueprintSection(d.privacy_principles),
    blueprint_trust_connection: parseBlueprintSection(d.blueprint_trust_connection),
    blueprint_dogfooding: d.blueprint_dogfooding as Record<string, unknown> | undefined,
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases)
      ? (d.blueprint_vision_phrases as string[])
      : undefined,
    blueprint_privacy_note: d.blueprint_privacy_note as string | undefined,
    implementation_blueprint_phase124: parsePhase124Blueprint(d.implementation_blueprint_phase124),
    organizational_digital_twin_phase124_note: d.organizational_digital_twin_phase124_note as
      | string
      | undefined,
  };
}

export function parseKnowledgeRouteResult(data: unknown): KnowledgeRouteResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    routed: Boolean(d.routed),
    topic: d.topic as string | undefined,
    role_key: d.role_key as string | undefined,
    role_name: d.role_name as string | undefined,
    confidence: d.confidence as number | undefined,
    confidence_level: d.confidence_level as string | undefined,
    requires_review: d.requires_review as boolean | undefined,
    explanation: d.explanation as string | undefined,
    reason: d.reason as string | undefined,
  };
}

export function parseEscalationResult(data: unknown): EscalationResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    resolved: Boolean(d.resolved),
    process_key: d.process_key as string | undefined,
    current_step: d.current_step as number | undefined,
    role_key: d.role_key as string | undefined,
    role_name: d.role_name as string | undefined,
    next_role_key: d.next_role_key as string | undefined,
    explanation: d.explanation as string | undefined,
    reason: d.reason as string | undefined,
  };
}

export function parseBottleneckResult(data: unknown): BottleneckResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    bottlenecks_found: Number(d.bottlenecks_found ?? 0),
    insights: Array.isArray(d.insights) ? (d.insights as unknown[]).map(parseInsight) : [],
  };
}

export function parseTwinHealthResult(data: unknown): TwinHealthResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    twin_health_score: d.twin_health_score as number | undefined,
    process_coverage: d.process_coverage as number | undefined,
    role_count: d.role_count as number | undefined,
    knowledge_owners: d.knowledge_owners as number | undefined,
    low_confidence_count: d.low_confidence_count as number | undefined,
  };
}

export function parseProcessDetail(data: unknown): ProcessDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.process) return null;
  return {
    process: d.process as DigitalTwinProcess,
    steps: Array.isArray(d.steps) ? (d.steps as ProcessDetail["steps"]) : [],
    escalation_path: Array.isArray(d.escalation_path)
      ? (d.escalation_path as ProcessDetail["escalation_path"])
      : [],
  };
}

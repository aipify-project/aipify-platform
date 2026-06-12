import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  BlueprintSection,
  ContinuityCard,
  ContinuityDashboard,
  ContinuityEngagementSummary,
  ImplementationBlueprintMeta,
  IncidentDetail,
  IncidentModeResult,
  IntegrationLink,
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

function parseEngagementSummary(data: unknown): ContinuityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ContinuityEngagementSummary;
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

export function parseContinuityCard(data: unknown): ContinuityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    overall_score: d.overall_score as number | undefined,
    readiness_band: d.readiness_band as string | undefined,
    incident_mode_active: d.incident_mode_active as boolean | undefined,
    open_incidents: d.open_incidents as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    implementation_blueprint_phase73: parseBlueprintMeta(d.implementation_blueprint_phase73),
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
    continuity_note: d.continuity_note as string | undefined,
  };
}

export function parseContinuityDashboard(data: unknown): ContinuityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    overall_score: d.overall_score as number | undefined,
    readiness_band: d.readiness_band as string | undefined,
    readiness_components: d.readiness_components as ContinuityDashboard["readiness_components"],
    incident_mode: d.incident_mode as ContinuityDashboard["incident_mode"],
    plans: Array.isArray(d.plans) ? (d.plans as ContinuityDashboard["plans"]) : [],
    critical_processes: Array.isArray(d.critical_processes) ? (d.critical_processes as ContinuityDashboard["critical_processes"]) : [],
    incidents: Array.isArray(d.incidents) ? (d.incidents as ContinuityDashboard["incidents"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as ContinuityDashboard["briefings"]) : [],
    incident_levels: d.incident_levels as ContinuityDashboard["incident_levels"],
    integrations: d.integrations as Record<string, string> | undefined,
    implementation_blueprint_phase73: parseBlueprintMeta(d.implementation_blueprint_phase73),
    organizational_continuity_note: d.organizational_continuity_note as string | undefined,
    blueprint_distinction_note: d.blueprint_distinction_note as string | undefined,
    blueprint_mission: d.blueprint_mission as string | undefined,
    blueprint_philosophy: d.blueprint_philosophy as string | undefined,
    blueprint_abos_principle: d.blueprint_abos_principle as string | undefined,
    blueprint_objectives: parseObjectives(d.blueprint_objectives),
    knowledge_continuity: parseBlueprintSection(d.knowledge_continuity),
    role_continuity: parseBlueprintSection(d.role_continuity),
    succession_support: parseBlueprintSection(d.succession_support),
    operational_resilience: parseBlueprintSection(d.operational_resilience),
    companion_guidance: parseBlueprintSection(d.companion_guidance),
    onboarding_connection: parseBlueprintSection(d.onboarding_connection),
    blueprint_self_love_connection: parseBlueprintSection(d.blueprint_self_love_connection) as ContinuityDashboard["blueprint_self_love_connection"],
    blueprint_leadership_insights: parseBlueprintSection(d.blueprint_leadership_insights),
    blueprint_trust_connection: parseBlueprintSection(d.blueprint_trust_connection) as ContinuityDashboard["blueprint_trust_connection"],
    privacy_principles: parseBlueprintSection(d.privacy_principles) as ContinuityDashboard["privacy_principles"],
    blueprint_dogfooding: d.blueprint_dogfooding as Record<string, unknown> | undefined,
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases) ? (d.blueprint_vision_phrases as string[]) : undefined,
    blueprint_privacy_note: d.blueprint_privacy_note as string | undefined,
  };
}

export function parseIncidentDetail(data: unknown): IncidentDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.incident) return null;
  return {
    incident: d.incident as IncidentDetail["incident"],
    recovery_actions: Array.isArray(d.recovery_actions) ? (d.recovery_actions as IncidentDetail["recovery_actions"]) : [],
    human_leadership_required: d.human_leadership_required as boolean | undefined,
  };
}

export function parseIncidentModeResult(data: unknown): IncidentModeResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    incident_id: d.incident_id as string | undefined,
    incident_mode_active: d.incident_mode_active as boolean | undefined,
    incident_level: d.incident_level as number | undefined,
    level_label: d.level_label as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    note: d.note as string | undefined,
  };
}

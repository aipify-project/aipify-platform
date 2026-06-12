import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CivilizationalCoordinationBlueprint,
  CivilizationalCoordinationCard,
  CivilizationalCoordinationDashboard,
  CivilizationalCoordinationEngagementSummary,
  CoordinationMilestone,
  CoordinationPartnership,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  SharedActionProgram,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(
  data: unknown,
): CivilizationalCoordinationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalCoordinationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CivilizationalCoordinationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalCoordinationBlueprint;
}

function parsePrograms(data: unknown): SharedActionProgram[] {
  if (!Array.isArray(data)) return [];
  return data as SharedActionProgram[];
}

function parsePartnerships(data: unknown): CoordinationPartnership[] {
  if (!Array.isArray(data)) return [];
  return data as CoordinationPartnership[];
}

function parseMilestones(data: unknown): CoordinationMilestone[] {
  if (!Array.isArray(data)) return [];
  return data as CoordinationMilestone[];
}

export function parseCivilizationalCoordinationCard(data: unknown): CivilizationalCoordinationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    coordination_score: Number(d.coordination_score ?? 0),
    enabled: Boolean(d.enabled),
    coordination_mode: typeof d.coordination_mode === "string" ? d.coordination_mode : undefined,
    programs_count: Number(d.programs_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    shared_programs_enabled: Boolean(d.shared_programs_enabled),
    partnership_opt_in_enabled: Boolean(d.partnership_opt_in_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_coordination_mission:
      typeof d.civilizational_coordination_mission === "string"
        ? d.civilizational_coordination_mission
        : undefined,
    civilizational_coordination_abos_principle:
      typeof d.civilizational_coordination_abos_principle === "string"
        ? d.civilizational_coordination_abos_principle
        : undefined,
    civilizational_coordination_engagement_summary: parseEngagementSummary(
      d.civilizational_coordination_engagement_summary,
    ),
    civilizational_coordination_note:
      typeof d.civilizational_coordination_note === "string"
        ? d.civilizational_coordination_note
        : undefined,
    civilizational_coordination_vision_note:
      typeof d.civilizational_coordination_vision_note === "string"
        ? d.civilizational_coordination_vision_note
        : undefined,
  };
}

export function parseCivilizationalCoordinationDashboard(
  data: unknown,
): CivilizationalCoordinationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    coordination_mode: typeof d.coordination_mode === "string" ? d.coordination_mode : undefined,
    shared_programs_enabled: Boolean(d.shared_programs_enabled),
    partnership_opt_in_enabled: Boolean(d.partnership_opt_in_enabled),
    milestone_tracking_enabled: Boolean(d.milestone_tracking_enabled),
    executive_coordination_reviews_enabled: Boolean(
      d.executive_coordination_reviews_enabled,
    ),
    cross_org_coordination_opt_in: Boolean(d.cross_org_coordination_opt_in),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    coordination_score: Number(d.coordination_score ?? 0),
    programs_count: Number(d.programs_count ?? 0),
    active_programs_count: Number(d.active_programs_count ?? 0),
    partnerships_count: Number(d.partnerships_count ?? 0),
    active_partnerships_count: Number(d.active_partnerships_count ?? 0),
    milestones_count: Number(d.milestones_count ?? 0),
    programs: parsePrograms(d.programs),
    partnerships: parsePartnerships(d.partnerships),
    milestones: parseMilestones(d.milestones),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_coordination_blueprint: parseBlueprintBlock(d.civilizational_coordination_blueprint),
    civilizational_coordination_mission:
      typeof d.civilizational_coordination_mission === "string"
        ? d.civilizational_coordination_mission
        : undefined,
    civilizational_coordination_philosophy:
      typeof d.civilizational_coordination_philosophy === "string"
        ? d.civilizational_coordination_philosophy
        : undefined,
    civilizational_coordination_abos_principle:
      typeof d.civilizational_coordination_abos_principle === "string"
        ? d.civilizational_coordination_abos_principle
        : undefined,
    civilizational_coordination_objectives: parseObjectives(d.civilizational_coordination_objectives),
    shared_action_center_meta:
      typeof d.shared_action_center_meta === "object" && d.shared_action_center_meta
        ? (d.shared_action_center_meta as Record<string, unknown>)
        : undefined,
    coordination_engine_meta:
      typeof d.coordination_engine_meta === "object" && d.coordination_engine_meta
        ? (d.coordination_engine_meta as Record<string, unknown>)
        : undefined,
    shared_action_framework_meta:
      typeof d.shared_action_framework_meta === "object" && d.shared_action_framework_meta
        ? (d.shared_action_framework_meta as Record<string, unknown>)
        : undefined,
    executive_coordination_reviews_meta:
      typeof d.executive_coordination_reviews_meta === "object" &&
      d.executive_coordination_reviews_meta
        ? (d.executive_coordination_reviews_meta as Record<string, unknown>)
        : undefined,
    coordination_companion_meta:
      typeof d.coordination_companion_meta === "object" && d.coordination_companion_meta
        ? (d.coordination_companion_meta as Record<string, unknown>)
        : undefined,
    voluntary_alignment_engine_meta:
      typeof d.voluntary_alignment_engine_meta === "object" && d.voluntary_alignment_engine_meta
        ? (d.voluntary_alignment_engine_meta as Record<string, unknown>)
        : undefined,
    collective_execution_engine_meta:
      typeof d.collective_execution_engine_meta === "object" && d.collective_execution_engine_meta
        ? (d.collective_execution_engine_meta as Record<string, unknown>)
        : undefined,
    relationship_stewardship_engine_meta:
      typeof d.relationship_stewardship_engine_meta === "object" &&
      d.relationship_stewardship_engine_meta
        ? (d.relationship_stewardship_engine_meta as Record<string, unknown>)
        : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta:
      typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta
        ? (d.self_love_connection_meta as Record<string, unknown>)
        : undefined,
    security_requirements_meta:
      typeof d.security_requirements_meta === "object" && d.security_requirements_meta
        ? (d.security_requirements_meta as Record<string, unknown>)
        : undefined,
    ccaebp166_integration_links: parseIntegrationLinks(d.ccaebp166_integration_links),
    civilizational_coordination_engagement_summary: parseEngagementSummary(
      d.civilizational_coordination_engagement_summary,
    ),
    civilizational_coordination_success_criteria: parseSuccessCriteria(
      d.civilizational_coordination_success_criteria,
    ),
    civilizational_coordination_vision:
      typeof d.civilizational_coordination_vision === "string"
        ? d.civilizational_coordination_vision
        : undefined,
    civilizational_coordination_vision_phrases: Array.isArray(
      d.civilizational_coordination_vision_phrases,
    )
      ? (d.civilizational_coordination_vision_phrases as string[])
      : undefined,
    civilizational_coordination_privacy_note:
      typeof d.civilizational_coordination_privacy_note === "string"
        ? d.civilizational_coordination_privacy_note
        : undefined,
    civilizational_coordination_dogfooding:
      typeof d.civilizational_coordination_dogfooding === "string"
        ? d.civilizational_coordination_dogfooding
        : undefined,
    civilizational_coordination_engine_note:
      typeof d.civilizational_coordination_engine_note === "string"
        ? d.civilizational_coordination_engine_note
        : undefined,
    civilizational_coordination_distinction_note:
      typeof d.civilizational_coordination_distinction_note === "string"
        ? d.civilizational_coordination_distinction_note
        : undefined,
  };
}

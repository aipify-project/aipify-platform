import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CivilizationalForesightBlueprint,
  CivilizationalForesightCard,
  CivilizationalForesightDashboard,
  CivilizationalForesightEngagementSummary,
  ExecutiveForesightReview,
  ForesightMemoryEntry,
  ForesightScenario,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
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

function parseEngagementSummary(data: unknown): CivilizationalForesightEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalForesightEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CivilizationalForesightBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalForesightBlueprint;
}

function parseScenarios(data: unknown): ForesightScenario[] {
  if (!Array.isArray(data)) return [];
  return data as ForesightScenario[];
}

function parseReviews(data: unknown): ExecutiveForesightReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveForesightReview[];
}

function parseMemory(data: unknown): ForesightMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ForesightMemoryEntry[];
}

export function parseCivilizationalForesightCard(data: unknown): CivilizationalForesightCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    civilizational_foresight_score: Number(d.civilizational_foresight_score ?? 0),
    foresight_readiness_level: Number(d.foresight_readiness_level ?? 1),
    scenarios_count: Number(d.scenarios_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    scenario_exploration_enabled: Boolean(d.scenario_exploration_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_foresight_mission:
      typeof d.civilizational_foresight_mission === "string"
        ? d.civilizational_foresight_mission
        : undefined,
    civilizational_foresight_abos_principle:
      typeof d.civilizational_foresight_abos_principle === "string"
        ? d.civilizational_foresight_abos_principle
        : undefined,
    civilizational_foresight_engagement_summary: parseEngagementSummary(
      d.civilizational_foresight_engagement_summary,
    ),
    civilizational_foresight_note:
      typeof d.civilizational_foresight_note === "string"
        ? d.civilizational_foresight_note
        : undefined,
    civilizational_foresight_vision_note:
      typeof d.civilizational_foresight_vision_note === "string"
        ? d.civilizational_foresight_vision_note
        : undefined,
  };
}

export function parseCivilizationalForesightDashboard(
  data: unknown,
): CivilizationalForesightDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    foresight_readiness_level: Number(d.foresight_readiness_level ?? 1),
    horizon_focus: typeof d.horizon_focus === "string" ? d.horizon_focus : undefined,
    scenario_exploration_enabled: Boolean(d.scenario_exploration_enabled),
    executive_review_enabled: Boolean(d.executive_review_enabled),
    foresight_memory_enabled: Boolean(d.foresight_memory_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    civilizational_foresight_score: Number(d.civilizational_foresight_score ?? 0),
    scenarios_count: Number(d.scenarios_count ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    foresight_memory_count: Number(d.foresight_memory_count ?? 0),
    scenarios: parseScenarios(d.scenarios),
    executive_foresight_reviews: parseReviews(d.executive_foresight_reviews),
    foresight_memory_entries: parseMemory(d.foresight_memory_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_foresight_blueprint: parseBlueprintBlock(d.civilizational_foresight_blueprint),
    civilizational_foresight_mission:
      typeof d.civilizational_foresight_mission === "string"
        ? d.civilizational_foresight_mission
        : undefined,
    civilizational_foresight_philosophy:
      typeof d.civilizational_foresight_philosophy === "string"
        ? d.civilizational_foresight_philosophy
        : undefined,
    civilizational_foresight_abos_principle:
      typeof d.civilizational_foresight_abos_principle === "string"
        ? d.civilizational_foresight_abos_principle
        : undefined,
    civilizational_foresight_objectives: parseObjectives(d.civilizational_foresight_objectives),
    long_horizon_center_meta:
      typeof d.long_horizon_center_meta === "object" && d.long_horizon_center_meta
        ? (d.long_horizon_center_meta as Record<string, unknown>)
        : undefined,
    foresight_engine_meta:
      typeof d.foresight_engine_meta === "object" && d.foresight_engine_meta
        ? (d.foresight_engine_meta as Record<string, unknown>)
        : undefined,
    long_horizon_framework_meta:
      typeof d.long_horizon_framework_meta === "object" && d.long_horizon_framework_meta
        ? (d.long_horizon_framework_meta as Record<string, unknown>)
        : undefined,
    executive_foresight_reviews_meta:
      typeof d.executive_foresight_reviews_meta === "object" &&
      d.executive_foresight_reviews_meta
        ? (d.executive_foresight_reviews_meta as Record<string, unknown>)
        : undefined,
    foresight_companion_meta:
      typeof d.foresight_companion_meta === "object" && d.foresight_companion_meta
        ? (d.foresight_companion_meta as Record<string, unknown>)
        : undefined,
    scenario_exploration_engine_meta:
      typeof d.scenario_exploration_engine_meta === "object" &&
      d.scenario_exploration_engine_meta
        ? (d.scenario_exploration_engine_meta as Record<string, unknown>)
        : undefined,
    intergenerational_responsibility_framework_meta:
      typeof d.intergenerational_responsibility_framework_meta === "object" &&
      d.intergenerational_responsibility_framework_meta
        ? (d.intergenerational_responsibility_framework_meta as Record<string, unknown>)
        : undefined,
    foresight_memory_engine_meta:
      typeof d.foresight_memory_engine_meta === "object" && d.foresight_memory_engine_meta
        ? (d.foresight_memory_engine_meta as Record<string, unknown>)
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
    cfiebp165_era_cross_links: parseIntegrationLinks(d.cfiebp165_era_cross_links),
    cfiebp165_extended_cross_links: parseIntegrationLinks(d.cfiebp165_extended_cross_links),
    cfiebp165_integration_links: parseIntegrationLinks(d.cfiebp165_integration_links),
    civilizational_foresight_engagement_summary: parseEngagementSummary(
      d.civilizational_foresight_engagement_summary,
    ),
    civilizational_foresight_success_criteria: parseSuccessCriteria(
      d.civilizational_foresight_success_criteria,
    ),
    civilizational_foresight_vision:
      typeof d.civilizational_foresight_vision === "string"
        ? d.civilizational_foresight_vision
        : undefined,
    civilizational_foresight_vision_phrases: Array.isArray(d.civilizational_foresight_vision_phrases)
      ? (d.civilizational_foresight_vision_phrases as string[])
      : undefined,
    civilizational_foresight_privacy_note:
      typeof d.civilizational_foresight_privacy_note === "string"
        ? d.civilizational_foresight_privacy_note
        : undefined,
    civilizational_foresight_dogfooding:
      typeof d.civilizational_foresight_dogfooding === "string"
        ? d.civilizational_foresight_dogfooding
        : undefined,
    civilizational_foresight_engine_note:
      typeof d.civilizational_foresight_engine_note === "string"
        ? d.civilizational_foresight_engine_note
        : undefined,
    civilizational_foresight_distinction_note:
      typeof d.civilizational_foresight_distinction_note === "string"
        ? d.civilizational_foresight_distinction_note
        : undefined,
  };
}

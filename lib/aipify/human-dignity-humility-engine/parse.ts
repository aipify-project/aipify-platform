import type {
  AbosSuccessCriterion,
  ScaffoldNote,
  BlueprintObjective,
  ExecutiveReview,
  HumanDignityHumilityBlueprint,
  HumanDignityHumilityCard,
  HumanDignityHumilityDashboard,
  HumanDignityHumilityEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  ReflectionEntry,
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

function parseEngagementSummary(data: unknown): HumanDignityHumilityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanDignityHumilityEngagementSummary;
}

function parseBlueprintBlock(data: unknown): HumanDignityHumilityBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanDignityHumilityBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveReview[];
}

function parseReflectionEntrys(data: unknown): ReflectionEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ReflectionEntry[];
}

function parseScaffoldNotes(data: unknown): ScaffoldNote[] {
  if (!Array.isArray(data)) return [];
  return data as ScaffoldNote[];
}

export function parseHumanDignityHumilityCard(data: unknown): HumanDignityHumilityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_dignity_technological_humility_score: Number(d.human_dignity_technological_humility_score ?? 0),
    enabled: Boolean(d.enabled),
    humility_mode: typeof d.humility_mode === "string" ? d.humility_mode : undefined,
    dignity_readiness_level: Number(d.dignity_readiness_level ?? 1),
    dignity_reflections_count: Number(d.dignity_reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    purpose_reflection_enabled: Boolean(d.purpose_reflection_enabled),
    agency_preservation_enabled: Boolean(d.agency_preservation_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_dignity_technological_humility_mission:
      typeof d.human_dignity_technological_humility_mission === "string"
        ? d.human_dignity_technological_humility_mission
        : undefined,
    human_dignity_technological_humility_abos_principle:
      typeof d.human_dignity_technological_humility_abos_principle === "string"
        ? d.human_dignity_technological_humility_abos_principle
        : undefined,
    human_dignity_technological_humility_engagement_summary: parseEngagementSummary(
      d.human_dignity_technological_humility_engagement_summary,
    ),
    human_dignity_technological_humility_note:
      typeof d.human_dignity_technological_humility_note === "string"
        ? d.human_dignity_technological_humility_note
        : undefined,
    human_dignity_technological_humility_vision_note:
      typeof d.human_dignity_technological_humility_vision_note === "string"
        ? d.human_dignity_technological_humility_vision_note
        : undefined,
  };
}

export function parseHumanDignityHumilityDashboard(data: unknown): HumanDignityHumilityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    humility_mode: typeof d.humility_mode === "string" ? d.humility_mode : undefined,
    dignity_readiness_level: Number(d.dignity_readiness_level ?? 1),
    purpose_reflection_enabled: Boolean(d.purpose_reflection_enabled),
    belonging_reflection_enabled: Boolean(d.belonging_reflection_enabled),
    agency_preservation_enabled: Boolean(d.agency_preservation_enabled),
    identity_discovery_enabled: Boolean(d.identity_discovery_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    human_dignity_technological_humility_score: Number(d.human_dignity_technological_humility_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    dignity_reflections_count: Number(d.dignity_reflections_count ?? 0),
    compassion_notes_count: Number(d.compassion_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    dignity_reflections: parseReflectionEntrys(d.dignity_reflections),
    compassion_notes: parseScaffoldNotes(d.compassion_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_dignity_technological_humility_blueprint: parseBlueprintBlock(d.human_dignity_technological_humility_blueprint),
    human_dignity_technological_humility_mission:
      typeof d.human_dignity_technological_humility_mission === "string"
        ? d.human_dignity_technological_humility_mission
        : undefined,
    human_dignity_technological_humility_philosophy:
      typeof d.human_dignity_technological_humility_philosophy === "string"
        ? d.human_dignity_technological_humility_philosophy
        : undefined,
    human_dignity_technological_humility_abos_principle:
      typeof d.human_dignity_technological_humility_abos_principle === "string"
        ? d.human_dignity_technological_humility_abos_principle
        : undefined,
    human_dignity_technological_humility_objectives: parseObjectives(d.human_dignity_technological_humility_objectives),
    dignity_center_meta:
      typeof d.dignity_center_meta === "object" && d.dignity_center_meta
        ? (d.dignity_center_meta as Record<string, unknown>)
        : undefined,
    human_dignity_engine_meta:
      typeof d.human_dignity_engine_meta === "object" && d.human_dignity_engine_meta
        ? (d.human_dignity_engine_meta as Record<string, unknown>)
        : undefined,
    technological_humility_framework_meta:
      typeof d.technological_humility_framework_meta === "object" &&
      d.technological_humility_framework_meta
        ? (d.technological_humility_framework_meta as Record<string, unknown>)
        : undefined,
    executive_humility_reviews_meta:
      typeof d.executive_humility_reviews_meta === "object" &&
      d.executive_humility_reviews_meta
        ? (d.executive_humility_reviews_meta as Record<string, unknown>)
        : undefined,
    dignity_companion_meta:
      typeof d.dignity_companion_meta === "object" && d.dignity_companion_meta
        ? (d.dignity_companion_meta as Record<string, unknown>)
        : undefined,
    compassion_engine_meta:
      typeof d.compassion_engine_meta === "object" && d.compassion_engine_meta
        ? (d.compassion_engine_meta as Record<string, unknown>)
        : undefined,
    human_value_framework_meta:
      typeof d.human_value_framework_meta === "object" &&
      d.human_value_framework_meta
        ? (d.human_value_framework_meta as Record<string, unknown>)
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
    hdthbp177_integration_links: parseIntegrationLinks(d.hdthbp177_integration_links),
    hdthbp177_era_opener_summary: parseIntegrationLinks(d.hdthbp177_era_opener_summary),
    human_dignity_technological_humility_engagement_summary: parseEngagementSummary(
      d.human_dignity_technological_humility_engagement_summary,
    ),
    human_dignity_technological_humility_success_criteria: parseSuccessCriteria(
      d.human_dignity_technological_humility_success_criteria,
    ),
    human_dignity_technological_humility_vision:
      typeof d.human_dignity_technological_humility_vision === "string"
        ? d.human_dignity_technological_humility_vision
        : undefined,
    human_dignity_technological_humility_vision_phrases: Array.isArray(d.human_dignity_technological_humility_vision_phrases)
      ? (d.human_dignity_technological_humility_vision_phrases as string[])
      : undefined,
    human_dignity_technological_humility_privacy_note:
      typeof d.human_dignity_technological_humility_privacy_note === "string"
        ? d.human_dignity_technological_humility_privacy_note
        : undefined,
    human_dignity_technological_humility_dogfooding:
      typeof d.human_dignity_technological_humility_dogfooding === "string"
        ? d.human_dignity_technological_humility_dogfooding
        : undefined,
    human_dignity_technological_humility_engine_note:
      typeof d.human_dignity_technological_humility_engine_note === "string"
        ? d.human_dignity_technological_humility_engine_note
        : undefined,
    human_dignity_technological_humility_distinction_note:
      typeof d.human_dignity_technological_humility_distinction_note === "string"
        ? d.human_dignity_technological_humility_distinction_note
        : undefined,
  };
}

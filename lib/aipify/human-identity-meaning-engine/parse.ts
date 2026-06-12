import type {
  AbosSuccessCriterion,
  AgencyNote,
  BlueprintObjective,
  ExecutiveHumanityReview,
  HumanIdentityMeaningBlueprint,
  HumanIdentityMeaningCard,
  HumanIdentityMeaningDashboard,
  HumanIdentityMeaningEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  MeaningReflection,
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

function parseEngagementSummary(data: unknown): HumanIdentityMeaningEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanIdentityMeaningEngagementSummary;
}

function parseBlueprintBlock(data: unknown): HumanIdentityMeaningBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanIdentityMeaningBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveHumanityReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveHumanityReview[];
}

function parseMeaningReflections(data: unknown): MeaningReflection[] {
  if (!Array.isArray(data)) return [];
  return data as MeaningReflection[];
}

function parseAgencyNotes(data: unknown): AgencyNote[] {
  if (!Array.isArray(data)) return [];
  return data as AgencyNote[];
}

export function parseHumanIdentityMeaningCard(data: unknown): HumanIdentityMeaningCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_identity_meaning_score: Number(d.human_identity_meaning_score ?? 0),
    enabled: Boolean(d.enabled),
    discovery_mode: typeof d.discovery_mode === "string" ? d.discovery_mode : undefined,
    meaning_readiness_level: Number(d.meaning_readiness_level ?? 1),
    meaning_reflections_count: Number(d.meaning_reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    purpose_reflection_enabled: Boolean(d.purpose_reflection_enabled),
    agency_preservation_enabled: Boolean(d.agency_preservation_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_identity_meaning_mission:
      typeof d.human_identity_meaning_mission === "string"
        ? d.human_identity_meaning_mission
        : undefined,
    human_identity_meaning_abos_principle:
      typeof d.human_identity_meaning_abos_principle === "string"
        ? d.human_identity_meaning_abos_principle
        : undefined,
    human_identity_meaning_engagement_summary: parseEngagementSummary(
      d.human_identity_meaning_engagement_summary,
    ),
    human_identity_meaning_note:
      typeof d.human_identity_meaning_note === "string"
        ? d.human_identity_meaning_note
        : undefined,
    human_identity_meaning_vision_note:
      typeof d.human_identity_meaning_vision_note === "string"
        ? d.human_identity_meaning_vision_note
        : undefined,
  };
}

export function parseHumanIdentityMeaningDashboard(data: unknown): HumanIdentityMeaningDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    discovery_mode: typeof d.discovery_mode === "string" ? d.discovery_mode : undefined,
    meaning_readiness_level: Number(d.meaning_readiness_level ?? 1),
    purpose_reflection_enabled: Boolean(d.purpose_reflection_enabled),
    belonging_reflection_enabled: Boolean(d.belonging_reflection_enabled),
    agency_preservation_enabled: Boolean(d.agency_preservation_enabled),
    identity_discovery_enabled: Boolean(d.identity_discovery_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    human_identity_meaning_score: Number(d.human_identity_meaning_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    meaning_reflections_count: Number(d.meaning_reflections_count ?? 0),
    agency_notes_count: Number(d.agency_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    meaning_reflections: parseMeaningReflections(d.meaning_reflections),
    agency_notes: parseAgencyNotes(d.agency_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_identity_meaning_blueprint: parseBlueprintBlock(d.human_identity_meaning_blueprint),
    human_identity_meaning_mission:
      typeof d.human_identity_meaning_mission === "string"
        ? d.human_identity_meaning_mission
        : undefined,
    human_identity_meaning_philosophy:
      typeof d.human_identity_meaning_philosophy === "string"
        ? d.human_identity_meaning_philosophy
        : undefined,
    human_identity_meaning_abos_principle:
      typeof d.human_identity_meaning_abos_principle === "string"
        ? d.human_identity_meaning_abos_principle
        : undefined,
    human_identity_meaning_objectives: parseObjectives(d.human_identity_meaning_objectives),
    meaning_identity_center_meta:
      typeof d.meaning_identity_center_meta === "object" && d.meaning_identity_center_meta
        ? (d.meaning_identity_center_meta as Record<string, unknown>)
        : undefined,
    human_identity_engine_meta:
      typeof d.human_identity_engine_meta === "object" && d.human_identity_engine_meta
        ? (d.human_identity_engine_meta as Record<string, unknown>)
        : undefined,
    meaning_preservation_framework_meta:
      typeof d.meaning_preservation_framework_meta === "object" &&
      d.meaning_preservation_framework_meta
        ? (d.meaning_preservation_framework_meta as Record<string, unknown>)
        : undefined,
    executive_humanity_reviews_meta:
      typeof d.executive_humanity_reviews_meta === "object" &&
      d.executive_humanity_reviews_meta
        ? (d.executive_humanity_reviews_meta as Record<string, unknown>)
        : undefined,
    meaning_companion_meta:
      typeof d.meaning_companion_meta === "object" && d.meaning_companion_meta
        ? (d.meaning_companion_meta as Record<string, unknown>)
        : undefined,
    belonging_engine_meta:
      typeof d.belonging_engine_meta === "object" && d.belonging_engine_meta
        ? (d.belonging_engine_meta as Record<string, unknown>)
        : undefined,
    agency_preservation_engine_meta:
      typeof d.agency_preservation_engine_meta === "object" &&
      d.agency_preservation_engine_meta
        ? (d.agency_preservation_engine_meta as Record<string, unknown>)
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
    himpbp173_integration_links: parseIntegrationLinks(d.himpbp173_integration_links),
    himpbp173_era_opener_summary: parseIntegrationLinks(d.himpbp173_era_opener_summary),
    human_identity_meaning_engagement_summary: parseEngagementSummary(
      d.human_identity_meaning_engagement_summary,
    ),
    human_identity_meaning_success_criteria: parseSuccessCriteria(
      d.human_identity_meaning_success_criteria,
    ),
    human_identity_meaning_vision:
      typeof d.human_identity_meaning_vision === "string"
        ? d.human_identity_meaning_vision
        : undefined,
    human_identity_meaning_vision_phrases: Array.isArray(d.human_identity_meaning_vision_phrases)
      ? (d.human_identity_meaning_vision_phrases as string[])
      : undefined,
    human_identity_meaning_privacy_note:
      typeof d.human_identity_meaning_privacy_note === "string"
        ? d.human_identity_meaning_privacy_note
        : undefined,
    human_identity_meaning_dogfooding:
      typeof d.human_identity_meaning_dogfooding === "string"
        ? d.human_identity_meaning_dogfooding
        : undefined,
    human_identity_meaning_engine_note:
      typeof d.human_identity_meaning_engine_note === "string"
        ? d.human_identity_meaning_engine_note
        : undefined,
    human_identity_meaning_distinction_note:
      typeof d.human_identity_meaning_distinction_note === "string"
        ? d.human_identity_meaning_distinction_note
        : undefined,
  };
}

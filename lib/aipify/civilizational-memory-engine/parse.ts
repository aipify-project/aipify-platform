import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CivilizationalMemoryBlueprint,
  CivilizationalMemoryCard,
  CivilizationalMemoryDashboard,
  CivilizationalMemoryEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LegacyEntry,
  LimitationPrinciples,
  MemoryArchive,
  StewardshipReview,
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

function parseEngagementSummary(data: unknown): CivilizationalMemoryEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalMemoryEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CivilizationalMemoryBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalMemoryBlueprint;
}

function parseArchives(data: unknown): MemoryArchive[] {
  if (!Array.isArray(data)) return [];
  return data as MemoryArchive[];
}

function parseReviews(data: unknown): StewardshipReview[] {
  if (!Array.isArray(data)) return [];
  return data as StewardshipReview[];
}

function parseLegacyEntries(data: unknown): LegacyEntry[] {
  if (!Array.isArray(data)) return [];
  return data as LegacyEntry[];
}

export function parseCivilizationalMemoryCard(data: unknown): CivilizationalMemoryCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    civilizational_memory_score: Number(d.civilizational_memory_score ?? 0),
    preservation_readiness_level: Number(d.preservation_readiness_level ?? 1),
    archives_count: Number(d.archives_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    discernment_required: Boolean(d.discernment_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_memory_mission:
      typeof d.civilizational_memory_mission === "string" ? d.civilizational_memory_mission : undefined,
    civilizational_memory_abos_principle:
      typeof d.civilizational_memory_abos_principle === "string"
        ? d.civilizational_memory_abos_principle
        : undefined,
    civilizational_memory_engagement_summary: parseEngagementSummary(
      d.civilizational_memory_engagement_summary,
    ),
    civilizational_memory_note:
      typeof d.civilizational_memory_note === "string" ? d.civilizational_memory_note : undefined,
    civilizational_memory_vision_note:
      typeof d.civilizational_memory_vision_note === "string"
        ? d.civilizational_memory_vision_note
        : undefined,
  };
}

export function parseCivilizationalMemoryDashboard(data: unknown): CivilizationalMemoryDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    preservation_readiness_level: Number(d.preservation_readiness_level ?? 1),
    curation_stage: typeof d.curation_stage === "string" ? d.curation_stage : undefined,
    discernment_required: Boolean(d.discernment_required),
    cross_org_sharing_opt_in: Boolean(d.cross_org_sharing_opt_in),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    civilizational_memory_score: Number(d.civilizational_memory_score ?? 0),
    archives_count: Number(d.archives_count ?? 0),
    stewardship_reviews_count: Number(d.stewardship_reviews_count ?? 0),
    legacy_entries_count: Number(d.legacy_entries_count ?? 0),
    memory_archives: parseArchives(d.memory_archives),
    stewardship_reviews: parseReviews(d.stewardship_reviews),
    legacy_entries: parseLegacyEntries(d.legacy_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_memory_blueprint: parseBlueprintBlock(d.civilizational_memory_blueprint),
    civilizational_memory_mission:
      typeof d.civilizational_memory_mission === "string" ? d.civilizational_memory_mission : undefined,
    civilizational_memory_philosophy:
      typeof d.civilizational_memory_philosophy === "string"
        ? d.civilizational_memory_philosophy
        : undefined,
    civilizational_memory_abos_principle:
      typeof d.civilizational_memory_abos_principle === "string"
        ? d.civilizational_memory_abos_principle
        : undefined,
    civilizational_memory_objectives: parseObjectives(d.civilizational_memory_objectives),
    civilizational_memory_center_meta:
      typeof d.civilizational_memory_center_meta === "object" && d.civilizational_memory_center_meta
        ? (d.civilizational_memory_center_meta as Record<string, unknown>)
        : undefined,
    knowledge_preservation_engine_meta:
      typeof d.knowledge_preservation_engine_meta === "object" &&
      d.knowledge_preservation_engine_meta
        ? (d.knowledge_preservation_engine_meta as Record<string, unknown>)
        : undefined,
    wisdom_curation_framework_meta:
      typeof d.wisdom_curation_framework_meta === "object" && d.wisdom_curation_framework_meta
        ? (d.wisdom_curation_framework_meta as Record<string, unknown>)
        : undefined,
    institutional_memory_networks_meta:
      typeof d.institutional_memory_networks_meta === "object" &&
      d.institutional_memory_networks_meta
        ? (d.institutional_memory_networks_meta as Record<string, unknown>)
        : undefined,
    memory_companion_meta:
      typeof d.memory_companion_meta === "object" && d.memory_companion_meta
        ? (d.memory_companion_meta as Record<string, unknown>)
        : undefined,
    knowledge_stewardship_engine_meta:
      typeof d.knowledge_stewardship_engine_meta === "object" &&
      d.knowledge_stewardship_engine_meta
        ? (d.knowledge_stewardship_engine_meta as Record<string, unknown>)
        : undefined,
    legacy_library_engine_meta:
      typeof d.legacy_library_engine_meta === "object" && d.legacy_library_engine_meta
        ? (d.legacy_library_engine_meta as Record<string, unknown>)
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
    gcmebp163_integration_links: parseIntegrationLinks(d.gcmebp163_integration_links),
    civilizational_memory_engagement_summary: parseEngagementSummary(
      d.civilizational_memory_engagement_summary,
    ),
    civilizational_memory_success_criteria: parseSuccessCriteria(
      d.civilizational_memory_success_criteria,
    ),
    civilizational_memory_vision:
      typeof d.civilizational_memory_vision === "string" ? d.civilizational_memory_vision : undefined,
    civilizational_memory_vision_phrases: Array.isArray(d.civilizational_memory_vision_phrases)
      ? (d.civilizational_memory_vision_phrases as string[])
      : undefined,
    civilizational_memory_privacy_note:
      typeof d.civilizational_memory_privacy_note === "string"
        ? d.civilizational_memory_privacy_note
        : undefined,
    civilizational_memory_dogfooding:
      typeof d.civilizational_memory_dogfooding === "string"
        ? d.civilizational_memory_dogfooding
        : undefined,
    civilizational_memory_engine_note:
      typeof d.civilizational_memory_engine_note === "string"
        ? d.civilizational_memory_engine_note
        : undefined,
    civilizational_memory_distinction_note:
      typeof d.civilizational_memory_distinction_note === "string"
        ? d.civilizational_memory_distinction_note
        : undefined,
  };
}

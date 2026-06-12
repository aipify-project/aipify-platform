import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveTrustReview,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  RelationshipHealthEntry,
  SocialCohesionBlueprint,
  SocialCohesionCard,
  SocialCohesionDashboard,
  SocialCohesionEngagementSummary,
  TrustMemoryEntry,
  TrustRepairRecord,
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

function parseEngagementSummary(data: unknown): SocialCohesionEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SocialCohesionEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SocialCohesionBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SocialCohesionBlueprint;
}

function parseTrustReviews(data: unknown): ExecutiveTrustReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveTrustReview[];
}

function parseRelationshipHealth(data: unknown): RelationshipHealthEntry[] {
  if (!Array.isArray(data)) return [];
  return data as RelationshipHealthEntry[];
}

function parseRepairRecords(data: unknown): TrustRepairRecord[] {
  if (!Array.isArray(data)) return [];
  return data as TrustRepairRecord[];
}

function parseTrustMemory(data: unknown): TrustMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as TrustMemoryEntry[];
}

export function parseSocialCohesionCard(data: unknown): SocialCohesionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    social_cohesion_score: Number(d.social_cohesion_score ?? 0),
    enabled: Boolean(d.enabled),
    trust_development_mode:
      typeof d.trust_development_mode === "string" ? d.trust_development_mode : undefined,
    trust_reviews_count: Number(d.trust_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    trust_reflection_enabled: Boolean(d.trust_reflection_enabled),
    relationship_health_enabled: Boolean(d.relationship_health_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    social_cohesion_mission:
      typeof d.social_cohesion_mission === "string" ? d.social_cohesion_mission : undefined,
    social_cohesion_abos_principle:
      typeof d.social_cohesion_abos_principle === "string"
        ? d.social_cohesion_abos_principle
        : undefined,
    social_cohesion_engagement_summary: parseEngagementSummary(d.social_cohesion_engagement_summary),
    social_cohesion_note:
      typeof d.social_cohesion_note === "string" ? d.social_cohesion_note : undefined,
    social_cohesion_vision_note:
      typeof d.social_cohesion_vision_note === "string" ? d.social_cohesion_vision_note : undefined,
  };
}

export function parseSocialCohesionDashboard(data: unknown): SocialCohesionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    trust_development_mode:
      typeof d.trust_development_mode === "string" ? d.trust_development_mode : undefined,
    trust_reflection_enabled: Boolean(d.trust_reflection_enabled),
    relationship_health_enabled: Boolean(d.relationship_health_enabled),
    repair_programs_enabled: Boolean(d.repair_programs_enabled),
    executive_reviews_enabled: Boolean(d.executive_reviews_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    social_cohesion_score: Number(d.social_cohesion_score ?? 0),
    trust_reviews_count: Number(d.trust_reviews_count ?? 0),
    relationship_health_count: Number(d.relationship_health_count ?? 0),
    repair_records_count: Number(d.repair_records_count ?? 0),
    trust_memory_count: Number(d.trust_memory_count ?? 0),
    trust_reviews: parseTrustReviews(d.trust_reviews),
    relationship_health: parseRelationshipHealth(d.relationship_health),
    repair_records: parseRepairRecords(d.repair_records),
    trust_memory_entries: parseTrustMemory(d.trust_memory_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    social_cohesion_blueprint: parseBlueprintBlock(d.social_cohesion_blueprint),
    social_cohesion_mission:
      typeof d.social_cohesion_mission === "string" ? d.social_cohesion_mission : undefined,
    social_cohesion_philosophy:
      typeof d.social_cohesion_philosophy === "string" ? d.social_cohesion_philosophy : undefined,
    social_cohesion_abos_principle:
      typeof d.social_cohesion_abos_principle === "string"
        ? d.social_cohesion_abos_principle
        : undefined,
    social_cohesion_objectives: parseObjectives(d.social_cohesion_objectives),
    social_cohesion_center_meta:
      typeof d.social_cohesion_center_meta === "object" && d.social_cohesion_center_meta
        ? (d.social_cohesion_center_meta as Record<string, unknown>)
        : undefined,
    trust_development_engine_meta:
      typeof d.trust_development_engine_meta === "object" && d.trust_development_engine_meta
        ? (d.trust_development_engine_meta as Record<string, unknown>)
        : undefined,
    relationship_health_framework_meta:
      typeof d.relationship_health_framework_meta === "object" &&
      d.relationship_health_framework_meta
        ? (d.relationship_health_framework_meta as Record<string, unknown>)
        : undefined,
    executive_trust_reviews_meta:
      typeof d.executive_trust_reviews_meta === "object" && d.executive_trust_reviews_meta
        ? (d.executive_trust_reviews_meta as Record<string, unknown>)
        : undefined,
    trust_companion_meta:
      typeof d.trust_companion_meta === "object" && d.trust_companion_meta
        ? (d.trust_companion_meta as Record<string, unknown>)
        : undefined,
    social_cohesion_engine_meta:
      typeof d.social_cohesion_engine_meta === "object" && d.social_cohesion_engine_meta
        ? (d.social_cohesion_engine_meta as Record<string, unknown>)
        : undefined,
    repair_restoration_framework_meta:
      typeof d.repair_restoration_framework_meta === "object" &&
      d.repair_restoration_framework_meta
        ? (d.repair_restoration_framework_meta as Record<string, unknown>)
        : undefined,
    trust_memory_engine_meta:
      typeof d.trust_memory_engine_meta === "object" && d.trust_memory_engine_meta
        ? (d.trust_memory_engine_meta as Record<string, unknown>)
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
    cstcebp169_integration_links: parseIntegrationLinks(d.cstcebp169_integration_links),
    social_cohesion_engagement_summary: parseEngagementSummary(
      d.social_cohesion_engagement_summary,
    ),
    social_cohesion_success_criteria: parseSuccessCriteria(d.social_cohesion_success_criteria),
    social_cohesion_vision:
      typeof d.social_cohesion_vision === "string" ? d.social_cohesion_vision : undefined,
    social_cohesion_vision_phrases: Array.isArray(d.social_cohesion_vision_phrases)
      ? (d.social_cohesion_vision_phrases as string[])
      : undefined,
    social_cohesion_privacy_note:
      typeof d.social_cohesion_privacy_note === "string"
        ? d.social_cohesion_privacy_note
        : undefined,
    social_cohesion_dogfooding:
      typeof d.social_cohesion_dogfooding === "string" ? d.social_cohesion_dogfooding : undefined,
    social_cohesion_engine_note:
      typeof d.social_cohesion_engine_note === "string" ? d.social_cohesion_engine_note : undefined,
    social_cohesion_distinction_note:
      typeof d.social_cohesion_distinction_note === "string"
        ? d.social_cohesion_distinction_note
        : undefined,
  };
}

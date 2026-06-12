import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  FlourishingSnapshot,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  LivingEnterpriseBlueprint,
  LivingEnterpriseCard,
  LivingEnterpriseDashboard,
  LivingEnterpriseEngagementSummary,
  LivingMemoryEntry,
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

function parseEngagementSummary(data: unknown): LivingEnterpriseEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LivingEnterpriseEngagementSummary;
}

function parseBlueprintBlock(data: unknown): LivingEnterpriseBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LivingEnterpriseBlueprint;
}

function parseReviews(data: unknown): StewardshipReview[] {
  if (!Array.isArray(data)) return [];
  return data as StewardshipReview[];
}

function parseFlourishing(data: unknown): FlourishingSnapshot[] {
  if (!Array.isArray(data)) return [];
  return data as FlourishingSnapshot[];
}

function parseLivingMemory(data: unknown): LivingMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as LivingMemoryEntry[];
}

export function parseLivingEnterpriseCard(data: unknown): LivingEnterpriseCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    living_enterprise_score: Number(d.living_enterprise_score ?? 0),
    living_readiness_level: Number(d.living_readiness_level ?? 1),
    stewardship_reviews_count: Number(d.stewardship_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    living_enterprise_mission:
      typeof d.living_enterprise_mission === "string" ? d.living_enterprise_mission : undefined,
    living_enterprise_abos_principle:
      typeof d.living_enterprise_abos_principle === "string"
        ? d.living_enterprise_abos_principle
        : undefined,
    living_enterprise_engagement_summary: parseEngagementSummary(
      d.living_enterprise_engagement_summary,
    ),
    living_enterprise_note:
      typeof d.living_enterprise_note === "string" ? d.living_enterprise_note : undefined,
    living_enterprise_vision_note:
      typeof d.living_enterprise_vision_note === "string"
        ? d.living_enterprise_vision_note
        : undefined,
  };
}

export function parseLivingEnterpriseDashboard(data: unknown): LivingEnterpriseDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    living_readiness_level: Number(d.living_readiness_level ?? 1),
    maturity_stage: typeof d.maturity_stage === "string" ? d.maturity_stage : undefined,
    reflection_opt_in: Boolean(d.reflection_opt_in),
    flourishing_review_enabled: Boolean(d.flourishing_review_enabled),
    living_memory_enabled: Boolean(d.living_memory_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    living_enterprise_score: Number(d.living_enterprise_score ?? 0),
    stewardship_reviews_count: Number(d.stewardship_reviews_count ?? 0),
    flourishing_snapshots_count: Number(d.flourishing_snapshots_count ?? 0),
    living_memory_count: Number(d.living_memory_count ?? 0),
    stewardship_reviews: parseReviews(d.stewardship_reviews),
    flourishing_snapshots: parseFlourishing(d.flourishing_snapshots),
    living_memory_entries: parseLivingMemory(d.living_memory_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    living_enterprise_blueprint: parseBlueprintBlock(d.living_enterprise_blueprint),
    living_enterprise_mission:
      typeof d.living_enterprise_mission === "string" ? d.living_enterprise_mission : undefined,
    living_enterprise_philosophy:
      typeof d.living_enterprise_philosophy === "string" ? d.living_enterprise_philosophy : undefined,
    living_enterprise_abos_principle:
      typeof d.living_enterprise_abos_principle === "string"
        ? d.living_enterprise_abos_principle
        : undefined,
    living_enterprise_objectives: parseObjectives(d.living_enterprise_objectives),
    living_enterprise_center_meta:
      typeof d.living_enterprise_center_meta === "object" && d.living_enterprise_center_meta
        ? (d.living_enterprise_center_meta as Record<string, unknown>)
        : undefined,
    transcendence_engine_meta:
      typeof d.transcendence_engine_meta === "object" && d.transcendence_engine_meta
        ? (d.transcendence_engine_meta as Record<string, unknown>)
        : undefined,
    living_systems_framework_meta:
      typeof d.living_systems_framework_meta === "object" && d.living_systems_framework_meta
        ? (d.living_systems_framework_meta as Record<string, unknown>)
        : undefined,
    enterprise_flourishing_engine_meta:
      typeof d.enterprise_flourishing_engine_meta === "object" &&
      d.enterprise_flourishing_engine_meta
        ? (d.enterprise_flourishing_engine_meta as Record<string, unknown>)
        : undefined,
    transcendence_companion_meta:
      typeof d.transcendence_companion_meta === "object" && d.transcendence_companion_meta
        ? (d.transcendence_companion_meta as Record<string, unknown>)
        : undefined,
    stewardship_maturity_engine_meta:
      typeof d.stewardship_maturity_engine_meta === "object" &&
      d.stewardship_maturity_engine_meta
        ? (d.stewardship_maturity_engine_meta as Record<string, unknown>)
        : undefined,
    collective_flourishing_framework_meta:
      typeof d.collective_flourishing_framework_meta === "object" &&
      d.collective_flourishing_framework_meta
        ? (d.collective_flourishing_framework_meta as Record<string, unknown>)
        : undefined,
    living_memory_engine_meta:
      typeof d.living_memory_engine_meta === "object" && d.living_memory_engine_meta
        ? (d.living_memory_engine_meta as Record<string, unknown>)
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
    letebp160_era_capstone_summary: parseIntegrationLinks(d.letebp160_era_capstone_summary),
    letebp160_extended_cross_links: parseIntegrationLinks(d.letebp160_extended_cross_links),
    letebp160_integration_links: parseIntegrationLinks(d.letebp160_integration_links),
    living_enterprise_engagement_summary: parseEngagementSummary(
      d.living_enterprise_engagement_summary,
    ),
    living_enterprise_success_criteria: parseSuccessCriteria(
      d.living_enterprise_success_criteria,
    ),
    living_enterprise_vision:
      typeof d.living_enterprise_vision === "string" ? d.living_enterprise_vision : undefined,
    living_enterprise_vision_phrases: Array.isArray(d.living_enterprise_vision_phrases)
      ? (d.living_enterprise_vision_phrases as string[])
      : undefined,
    living_enterprise_privacy_note:
      typeof d.living_enterprise_privacy_note === "string"
        ? d.living_enterprise_privacy_note
        : undefined,
    living_enterprise_dogfooding:
      typeof d.living_enterprise_dogfooding === "string"
        ? d.living_enterprise_dogfooding
        : undefined,
    living_enterprise_engine_note:
      typeof d.living_enterprise_engine_note === "string"
        ? d.living_enterprise_engine_note
        : undefined,
    living_enterprise_distinction_note:
      typeof d.living_enterprise_distinction_note === "string"
        ? d.living_enterprise_distinction_note
        : undefined,
  };
}

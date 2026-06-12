import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  OpportunityInitiative,
  ProsperityMemoryEntry,
  SharedProsperityBlueprint,
  SharedProsperityCard,
  SharedProsperityDashboard,
  SharedProsperityEngagementSummary,
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

function parseEngagementSummary(data: unknown): SharedProsperityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedProsperityEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SharedProsperityBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedProsperityBlueprint;
}

function parseReviews(data: unknown): StewardshipReview[] {
  if (!Array.isArray(data)) return [];
  return data as StewardshipReview[];
}

function parseInitiatives(data: unknown): OpportunityInitiative[] {
  if (!Array.isArray(data)) return [];
  return data as OpportunityInitiative[];
}

function parseMemory(data: unknown): ProsperityMemoryEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ProsperityMemoryEntry[];
}

export function parseSharedProsperityCard(data: unknown): SharedProsperityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    shared_prosperity_score: Number(d.shared_prosperity_score ?? 0),
    prosperity_readiness_level: Number(d.prosperity_readiness_level ?? 1),
    stewardship_reviews_count: Number(d.stewardship_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    shared_prosperity_mission:
      typeof d.shared_prosperity_mission === "string" ? d.shared_prosperity_mission : undefined,
    shared_prosperity_abos_principle:
      typeof d.shared_prosperity_abos_principle === "string"
        ? d.shared_prosperity_abos_principle
        : undefined,
    shared_prosperity_engagement_summary: parseEngagementSummary(
      d.shared_prosperity_engagement_summary,
    ),
    shared_prosperity_note:
      typeof d.shared_prosperity_note === "string" ? d.shared_prosperity_note : undefined,
    shared_prosperity_vision_note:
      typeof d.shared_prosperity_vision_note === "string"
        ? d.shared_prosperity_vision_note
        : undefined,
  };
}

export function parseSharedProsperityDashboard(data: unknown): SharedProsperityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    prosperity_readiness_level: Number(d.prosperity_readiness_level ?? 1),
    prosperity_maturity_stage:
      typeof d.prosperity_maturity_stage === "string" ? d.prosperity_maturity_stage : undefined,
    reflection_opt_in: Boolean(d.reflection_opt_in),
    stewardship_review_enabled: Boolean(d.stewardship_review_enabled),
    opportunity_development_enabled: Boolean(d.opportunity_development_enabled),
    prosperity_memory_enabled: Boolean(d.prosperity_memory_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    shared_prosperity_score: Number(d.shared_prosperity_score ?? 0),
    stewardship_reviews_count: Number(d.stewardship_reviews_count ?? 0),
    opportunity_initiatives_count: Number(d.opportunity_initiatives_count ?? 0),
    prosperity_memory_count: Number(d.prosperity_memory_count ?? 0),
    stewardship_reviews: parseReviews(d.stewardship_reviews),
    opportunity_initiatives: parseInitiatives(d.opportunity_initiatives),
    prosperity_memory_entries: parseMemory(d.prosperity_memory_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    shared_prosperity_blueprint: parseBlueprintBlock(d.shared_prosperity_blueprint),
    shared_prosperity_mission:
      typeof d.shared_prosperity_mission === "string" ? d.shared_prosperity_mission : undefined,
    shared_prosperity_philosophy:
      typeof d.shared_prosperity_philosophy === "string" ? d.shared_prosperity_philosophy : undefined,
    shared_prosperity_abos_principle:
      typeof d.shared_prosperity_abos_principle === "string"
        ? d.shared_prosperity_abos_principle
        : undefined,
    shared_prosperity_objectives: parseObjectives(d.shared_prosperity_objectives),
    shared_prosperity_center_meta:
      typeof d.shared_prosperity_center_meta === "object" && d.shared_prosperity_center_meta
        ? (d.shared_prosperity_center_meta as Record<string, unknown>)
        : undefined,
    stewardship_engine_meta:
      typeof d.stewardship_engine_meta === "object" && d.stewardship_engine_meta
        ? (d.stewardship_engine_meta as Record<string, unknown>)
        : undefined,
    shared_prosperity_framework_meta:
      typeof d.shared_prosperity_framework_meta === "object" && d.shared_prosperity_framework_meta
        ? (d.shared_prosperity_framework_meta as Record<string, unknown>)
        : undefined,
    executive_stewardship_reviews_meta:
      typeof d.executive_stewardship_reviews_meta === "object" &&
      d.executive_stewardship_reviews_meta
        ? (d.executive_stewardship_reviews_meta as Record<string, unknown>)
        : undefined,
    stewardship_companion_meta:
      typeof d.stewardship_companion_meta === "object" && d.stewardship_companion_meta
        ? (d.stewardship_companion_meta as Record<string, unknown>)
        : undefined,
    opportunity_development_engine_meta:
      typeof d.opportunity_development_engine_meta === "object" &&
      d.opportunity_development_engine_meta
        ? (d.opportunity_development_engine_meta as Record<string, unknown>)
        : undefined,
    ecosystem_health_engine_meta:
      typeof d.ecosystem_health_engine_meta === "object" && d.ecosystem_health_engine_meta
        ? (d.ecosystem_health_engine_meta as Record<string, unknown>)
        : undefined,
    prosperity_memory_engine_meta:
      typeof d.prosperity_memory_engine_meta === "object" && d.prosperity_memory_engine_meta
        ? (d.prosperity_memory_engine_meta as Record<string, unknown>)
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
    cspebp167_era_cross_links: parseIntegrationLinks(d.cspebp167_era_cross_links),
    cspebp167_extended_cross_links: parseIntegrationLinks(d.cspebp167_extended_cross_links),
    cspebp167_integration_links: parseIntegrationLinks(d.cspebp167_integration_links),
    shared_prosperity_engagement_summary: parseEngagementSummary(
      d.shared_prosperity_engagement_summary,
    ),
    shared_prosperity_success_criteria: parseSuccessCriteria(d.shared_prosperity_success_criteria),
    shared_prosperity_vision:
      typeof d.shared_prosperity_vision === "string" ? d.shared_prosperity_vision : undefined,
    shared_prosperity_vision_phrases: Array.isArray(d.shared_prosperity_vision_phrases)
      ? (d.shared_prosperity_vision_phrases as string[])
      : undefined,
    shared_prosperity_privacy_note:
      typeof d.shared_prosperity_privacy_note === "string"
        ? d.shared_prosperity_privacy_note
        : undefined,
    shared_prosperity_dogfooding:
      typeof d.shared_prosperity_dogfooding === "string" ? d.shared_prosperity_dogfooding : undefined,
    shared_prosperity_engine_note:
      typeof d.shared_prosperity_engine_note === "string"
        ? d.shared_prosperity_engine_note
        : undefined,
    shared_prosperity_distinction_note:
      typeof d.shared_prosperity_distinction_note === "string"
        ? d.shared_prosperity_distinction_note
        : undefined,
  };
}

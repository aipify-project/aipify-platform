import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CrossSectorIntelligenceBlueprint,
  CrossSectorIntelligenceCard,
  CrossSectorIntelligenceDashboard,
  CrossSectorIntelligenceEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LearningProgram,
  LimitationPrinciples,
  PreparednessReview,
  ResilienceNetwork,
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

function parseEngagementSummary(data: unknown): CrossSectorIntelligenceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CrossSectorIntelligenceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CrossSectorIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CrossSectorIntelligenceBlueprint;
}

function parseLearningPrograms(data: unknown): LearningProgram[] {
  if (!Array.isArray(data)) return [];
  return data as LearningProgram[];
}

function parseResilienceNetworks(data: unknown): ResilienceNetwork[] {
  if (!Array.isArray(data)) return [];
  return data as ResilienceNetwork[];
}

function parsePreparednessReviews(data: unknown): PreparednessReview[] {
  if (!Array.isArray(data)) return [];
  return data as PreparednessReview[];
}

export function parseCrossSectorIntelligenceCard(data: unknown): CrossSectorIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    resilience_score: Number(d.resilience_score ?? 0),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    enabled: Boolean(d.enabled),
    preparedness_level:
      typeof d.preparedness_level === "string" ? d.preparedness_level : undefined,
    programs_count: Number(d.programs_count ?? 0),
    networks_count: Number(d.networks_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    cross_sector_intelligence_mission:
      typeof d.cross_sector_intelligence_mission === "string"
        ? d.cross_sector_intelligence_mission
        : undefined,
    cross_sector_intelligence_abos_principle:
      typeof d.cross_sector_intelligence_abos_principle === "string"
        ? d.cross_sector_intelligence_abos_principle
        : undefined,
    cross_sector_intelligence_engagement_summary: parseEngagementSummary(
      d.cross_sector_intelligence_engagement_summary,
    ),
    cross_sector_intelligence_note:
      typeof d.cross_sector_intelligence_note === "string"
        ? d.cross_sector_intelligence_note
        : undefined,
    cross_sector_intelligence_vision_note:
      typeof d.cross_sector_intelligence_vision_note === "string"
        ? d.cross_sector_intelligence_vision_note
        : undefined,
  };
}

export function parseCrossSectorIntelligenceDashboard(data: unknown): CrossSectorIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    participation_status:
      typeof d.participation_status === "string" ? d.participation_status : undefined,
    preparedness_level:
      typeof d.preparedness_level === "string" ? d.preparedness_level : undefined,
    leadership_coordination_enabled: Boolean(d.leadership_coordination_enabled),
    learning_programs_enabled: Boolean(d.learning_programs_enabled),
    network_participation_enabled: Boolean(d.network_participation_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    resilience_score: Number(d.resilience_score ?? 0),
    programs_count: Number(d.programs_count ?? 0),
    networks_count: Number(d.networks_count ?? 0),
    active_networks_count: Number(d.active_networks_count ?? 0),
    preparedness_reviews_count: Number(d.preparedness_reviews_count ?? 0),
    learning_programs: parseLearningPrograms(d.learning_programs),
    resilience_networks: parseResilienceNetworks(d.resilience_networks),
    preparedness_reviews: parsePreparednessReviews(d.preparedness_reviews),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    cross_sector_intelligence_blueprint: parseBlueprintBlock(d.cross_sector_intelligence_blueprint),
    cross_sector_intelligence_mission:
      typeof d.cross_sector_intelligence_mission === "string"
        ? d.cross_sector_intelligence_mission
        : undefined,
    cross_sector_intelligence_philosophy:
      typeof d.cross_sector_intelligence_philosophy === "string"
        ? d.cross_sector_intelligence_philosophy
        : undefined,
    cross_sector_intelligence_abos_principle:
      typeof d.cross_sector_intelligence_abos_principle === "string"
        ? d.cross_sector_intelligence_abos_principle
        : undefined,
    cross_sector_intelligence_objectives: parseObjectives(d.cross_sector_intelligence_objectives),
    societal_resilience_center_meta:
      typeof d.societal_resilience_center_meta === "object" && d.societal_resilience_center_meta
        ? (d.societal_resilience_center_meta as Record<string, unknown>)
        : undefined,
    cross_sector_intelligence_engine_meta:
      typeof d.cross_sector_intelligence_engine_meta === "object" &&
      d.cross_sector_intelligence_engine_meta
        ? (d.cross_sector_intelligence_engine_meta as Record<string, unknown>)
        : undefined,
    preparedness_framework_engine_meta:
      typeof d.preparedness_framework_engine_meta === "object" &&
      d.preparedness_framework_engine_meta
        ? (d.preparedness_framework_engine_meta as Record<string, unknown>)
        : undefined,
    collective_resilience_networks_meta:
      typeof d.collective_resilience_networks_meta === "object" &&
      d.collective_resilience_networks_meta
        ? (d.collective_resilience_networks_meta as Record<string, unknown>)
        : undefined,
    resilience_companion_meta:
      typeof d.resilience_companion_meta === "object" && d.resilience_companion_meta
        ? (d.resilience_companion_meta as Record<string, unknown>)
        : undefined,
    ecosystem_health_engine_meta:
      typeof d.ecosystem_health_engine_meta === "object" && d.ecosystem_health_engine_meta
        ? (d.ecosystem_health_engine_meta as Record<string, unknown>)
        : undefined,
    leadership_preparedness_engine_meta:
      typeof d.leadership_preparedness_engine_meta === "object" &&
      d.leadership_preparedness_engine_meta
        ? (d.leadership_preparedness_engine_meta as Record<string, unknown>)
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
    csiebp162_integration_links: parseIntegrationLinks(d.csiebp162_integration_links),
    cross_sector_intelligence_engagement_summary: parseEngagementSummary(
      d.cross_sector_intelligence_engagement_summary,
    ),
    cross_sector_intelligence_success_criteria: parseSuccessCriteria(
      d.cross_sector_intelligence_success_criteria,
    ),
    cross_sector_intelligence_vision:
      typeof d.cross_sector_intelligence_vision === "string"
        ? d.cross_sector_intelligence_vision
        : undefined,
    cross_sector_intelligence_vision_phrases: Array.isArray(d.cross_sector_intelligence_vision_phrases)
      ? (d.cross_sector_intelligence_vision_phrases as string[])
      : undefined,
    cross_sector_intelligence_privacy_note:
      typeof d.cross_sector_intelligence_privacy_note === "string"
        ? d.cross_sector_intelligence_privacy_note
        : undefined,
    cross_sector_intelligence_dogfooding:
      typeof d.cross_sector_intelligence_dogfooding === "string"
        ? d.cross_sector_intelligence_dogfooding
        : undefined,
    cross_sector_intelligence_engine_note:
      typeof d.cross_sector_intelligence_engine_note === "string"
        ? d.cross_sector_intelligence_engine_note
        : undefined,
    cross_sector_intelligence_distinction_note:
      typeof d.cross_sector_intelligence_distinction_note === "string"
        ? d.cross_sector_intelligence_distinction_note
        : undefined,
  };
}

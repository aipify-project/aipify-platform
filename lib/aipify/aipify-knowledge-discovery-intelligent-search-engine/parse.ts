import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  AipifyKnowledgeDiscoveryIntelligentSearchEngineBlueprint,
  AipifyKnowledgeDiscoveryIntelligentSearchEngineCard,
  AipifyKnowledgeDiscoveryIntelligentSearchEngineDashboard,
  AipifyKnowledgeDiscoveryIntelligentSearchEngineEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  ReflectionEntry,
  ScaffoldNote,
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

function parseEngagementSummary(data: unknown): AipifyKnowledgeDiscoveryIntelligentSearchEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyKnowledgeDiscoveryIntelligentSearchEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): AipifyKnowledgeDiscoveryIntelligentSearchEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyKnowledgeDiscoveryIntelligentSearchEngineBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveReview[];
}

function parseReflections(data: unknown): ReflectionEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ReflectionEntry[];
}

function parseScaffoldNotes(data: unknown): ScaffoldNote[] {
  if (!Array.isArray(data)) return [];
  return data as ScaffoldNote[];
}

export function parseAipifyKnowledgeDiscoveryIntelligentSearchEngineCard(data: unknown): AipifyKnowledgeDiscoveryIntelligentSearchEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    aipify_knowledge_discovery_intelligent_search_score: Number(d.aipify_knowledge_discovery_intelligent_search_score ?? 0),
    enabled: Boolean(d.enabled),
    search_discovery_mode: typeof d.search_discovery_mode === "string" ? d.search_discovery_mode : undefined,
    search_relevance_level: Number(d.search_relevance_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_knowledge_discovery_intelligent_search_mission: typeof d.aipify_knowledge_discovery_intelligent_search_mission === "string" ? d.aipify_knowledge_discovery_intelligent_search_mission : undefined,
    aipify_knowledge_discovery_intelligent_search_abos_principle: typeof d.aipify_knowledge_discovery_intelligent_search_abos_principle === "string" ? d.aipify_knowledge_discovery_intelligent_search_abos_principle : undefined,
    aipify_knowledge_discovery_intelligent_search_engagement_summary: parseEngagementSummary(d.aipify_knowledge_discovery_intelligent_search_engagement_summary),
    aipify_knowledge_discovery_intelligent_search_note: typeof d.aipify_knowledge_discovery_intelligent_search_note === "string" ? d.aipify_knowledge_discovery_intelligent_search_note : undefined,
    aipify_knowledge_discovery_intelligent_search_vision_note: typeof d.aipify_knowledge_discovery_intelligent_search_vision_note === "string" ? d.aipify_knowledge_discovery_intelligent_search_vision_note : undefined,
  };
}

export function parseAipifyKnowledgeDiscoveryIntelligentSearchEngineDashboard(data: unknown): AipifyKnowledgeDiscoveryIntelligentSearchEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    search_discovery_mode: typeof d.search_discovery_mode === "string" ? d.search_discovery_mode : undefined,
    search_relevance_level: Number(d.search_relevance_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    aipify_knowledge_discovery_intelligent_search_score: Number(d.aipify_knowledge_discovery_intelligent_search_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    feedback_notes_count: Number(d.feedback_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_knowledge_discovery_intelligent_search_blueprint: parseBlueprintBlock(d.aipify_knowledge_discovery_intelligent_search_blueprint),
    aipify_knowledge_discovery_intelligent_search_mission: typeof d.aipify_knowledge_discovery_intelligent_search_mission === "string" ? d.aipify_knowledge_discovery_intelligent_search_mission : undefined,
    aipify_knowledge_discovery_intelligent_search_philosophy: typeof d.aipify_knowledge_discovery_intelligent_search_philosophy === "string" ? d.aipify_knowledge_discovery_intelligent_search_philosophy : undefined,
    aipify_knowledge_discovery_intelligent_search_abos_principle: typeof d.aipify_knowledge_discovery_intelligent_search_abos_principle === "string" ? d.aipify_knowledge_discovery_intelligent_search_abos_principle : undefined,
    aipify_knowledge_discovery_intelligent_search_objectives: parseObjectives(d.aipify_knowledge_discovery_intelligent_search_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    akdisebp204_integration_links: parseIntegrationLinks(d.akdisebp204_integration_links),
    akdisebp204_era_opener_summary: parseIntegrationLinks(d.akdisebp204_era_opener_summary),
    aipify_knowledge_discovery_intelligent_search_engagement_summary: parseEngagementSummary(d.aipify_knowledge_discovery_intelligent_search_engagement_summary),
    aipify_knowledge_discovery_intelligent_search_success_criteria: parseSuccessCriteria(d.aipify_knowledge_discovery_intelligent_search_success_criteria),
    aipify_knowledge_discovery_intelligent_search_vision: typeof d.aipify_knowledge_discovery_intelligent_search_vision === "string" ? d.aipify_knowledge_discovery_intelligent_search_vision : undefined,
    aipify_knowledge_discovery_intelligent_search_vision_phrases: Array.isArray(d.aipify_knowledge_discovery_intelligent_search_vision_phrases) ? (d.aipify_knowledge_discovery_intelligent_search_vision_phrases as string[]) : undefined,
    aipify_knowledge_discovery_intelligent_search_privacy_note: typeof d.aipify_knowledge_discovery_intelligent_search_privacy_note === "string" ? d.aipify_knowledge_discovery_intelligent_search_privacy_note : undefined,
    aipify_knowledge_discovery_intelligent_search_dogfooding: typeof d.aipify_knowledge_discovery_intelligent_search_dogfooding === "string" ? d.aipify_knowledge_discovery_intelligent_search_dogfooding : undefined,
    aipify_knowledge_discovery_intelligent_search_engine_note: typeof d.aipify_knowledge_discovery_intelligent_search_engine_note === "string" ? d.aipify_knowledge_discovery_intelligent_search_engine_note : undefined,
    aipify_knowledge_discovery_intelligent_search_distinction_note: typeof d.aipify_knowledge_discovery_intelligent_search_distinction_note === "string" ? d.aipify_knowledge_discovery_intelligent_search_distinction_note : undefined,
  };
}

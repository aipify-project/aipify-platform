import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  SharedGratitudeAppreciativeStewardshipEngineBlueprint,
  SharedGratitudeAppreciativeStewardshipEngineCard,
  SharedGratitudeAppreciativeStewardshipEngineDashboard,
  SharedGratitudeAppreciativeStewardshipEngineEngagementSummary,
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

function parseEngagementSummary(data: unknown): SharedGratitudeAppreciativeStewardshipEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedGratitudeAppreciativeStewardshipEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SharedGratitudeAppreciativeStewardshipEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedGratitudeAppreciativeStewardshipEngineBlueprint;
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

export function parseSharedGratitudeAppreciativeStewardshipEngineCard(data: unknown): SharedGratitudeAppreciativeStewardshipEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    humanity_shared_gratitude_appreciative_stewardship_score: Number(d.humanity_shared_gratitude_appreciative_stewardship_score ?? 0),
    enabled: Boolean(d.enabled),
    gratitude_mode: typeof d.gratitude_mode === "string" ? d.gratitude_mode : undefined,
    appreciation_readiness_level: Number(d.appreciation_readiness_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    humanity_shared_gratitude_appreciative_stewardship_mission: typeof d.humanity_shared_gratitude_appreciative_stewardship_mission === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_mission : undefined,
    humanity_shared_gratitude_appreciative_stewardship_abos_principle: typeof d.humanity_shared_gratitude_appreciative_stewardship_abos_principle === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_abos_principle : undefined,
    humanity_shared_gratitude_appreciative_stewardship_engagement_summary: parseEngagementSummary(d.humanity_shared_gratitude_appreciative_stewardship_engagement_summary),
    humanity_shared_gratitude_appreciative_stewardship_note: typeof d.humanity_shared_gratitude_appreciative_stewardship_note === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_note : undefined,
    humanity_shared_gratitude_appreciative_stewardship_vision_note: typeof d.humanity_shared_gratitude_appreciative_stewardship_vision_note === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_vision_note : undefined,
  };
}

export function parseSharedGratitudeAppreciativeStewardshipEngineDashboard(data: unknown): SharedGratitudeAppreciativeStewardshipEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    gratitude_mode: typeof d.gratitude_mode === "string" ? d.gratitude_mode : undefined,
    appreciation_readiness_level: Number(d.appreciation_readiness_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    humanity_shared_gratitude_appreciative_stewardship_score: Number(d.humanity_shared_gratitude_appreciative_stewardship_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    recognition_notes_count: Number(d.recognition_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    humanity_shared_gratitude_appreciative_stewardship_blueprint: parseBlueprintBlock(d.humanity_shared_gratitude_appreciative_stewardship_blueprint),
    humanity_shared_gratitude_appreciative_stewardship_mission: typeof d.humanity_shared_gratitude_appreciative_stewardship_mission === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_mission : undefined,
    humanity_shared_gratitude_appreciative_stewardship_philosophy: typeof d.humanity_shared_gratitude_appreciative_stewardship_philosophy === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_philosophy : undefined,
    humanity_shared_gratitude_appreciative_stewardship_abos_principle: typeof d.humanity_shared_gratitude_appreciative_stewardship_abos_principle === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_abos_principle : undefined,
    humanity_shared_gratitude_appreciative_stewardship_objectives: parseObjectives(d.humanity_shared_gratitude_appreciative_stewardship_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    hsgasbp188_integration_links: parseIntegrationLinks(d.hsgasbp188_integration_links),
    hsgasbp188_era_opener_summary: parseIntegrationLinks(d.hsgasbp188_era_opener_summary),
    humanity_shared_gratitude_appreciative_stewardship_engagement_summary: parseEngagementSummary(d.humanity_shared_gratitude_appreciative_stewardship_engagement_summary),
    humanity_shared_gratitude_appreciative_stewardship_success_criteria: parseSuccessCriteria(d.humanity_shared_gratitude_appreciative_stewardship_success_criteria),
    humanity_shared_gratitude_appreciative_stewardship_vision: typeof d.humanity_shared_gratitude_appreciative_stewardship_vision === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_vision : undefined,
    humanity_shared_gratitude_appreciative_stewardship_vision_phrases: Array.isArray(d.humanity_shared_gratitude_appreciative_stewardship_vision_phrases) ? (d.humanity_shared_gratitude_appreciative_stewardship_vision_phrases as string[]) : undefined,
    humanity_shared_gratitude_appreciative_stewardship_privacy_note: typeof d.humanity_shared_gratitude_appreciative_stewardship_privacy_note === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_privacy_note : undefined,
    humanity_shared_gratitude_appreciative_stewardship_dogfooding: typeof d.humanity_shared_gratitude_appreciative_stewardship_dogfooding === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_dogfooding : undefined,
    humanity_shared_gratitude_appreciative_stewardship_engine_note: typeof d.humanity_shared_gratitude_appreciative_stewardship_engine_note === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_engine_note : undefined,
    humanity_shared_gratitude_appreciative_stewardship_distinction_note: typeof d.humanity_shared_gratitude_appreciative_stewardship_distinction_note === "string" ? d.humanity_shared_gratitude_appreciative_stewardship_distinction_note : undefined,
  };
}

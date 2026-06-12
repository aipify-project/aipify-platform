import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  HumanLegacyEternalStewardshipEngineBlueprint,
  HumanLegacyEternalStewardshipEngineCard,
  HumanLegacyEternalStewardshipEngineDashboard,
  HumanLegacyEternalStewardshipEngineEngagementSummary,
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

function parseEngagementSummary(data: unknown): HumanLegacyEternalStewardshipEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanLegacyEternalStewardshipEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): HumanLegacyEternalStewardshipEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanLegacyEternalStewardshipEngineBlueprint;
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

export function parseHumanLegacyEternalStewardshipEngineCard(data: unknown): HumanLegacyEternalStewardshipEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_legacy_eternal_stewardship_score: Number(d.human_legacy_eternal_stewardship_score ?? 0),
    enabled: Boolean(d.enabled),
    stewardship_mode: typeof d.stewardship_mode === "string" ? d.stewardship_mode : undefined,
    legacy_readiness_level: Number(d.legacy_readiness_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_legacy_eternal_stewardship_mission: typeof d.human_legacy_eternal_stewardship_mission === "string" ? d.human_legacy_eternal_stewardship_mission : undefined,
    human_legacy_eternal_stewardship_abos_principle: typeof d.human_legacy_eternal_stewardship_abos_principle === "string" ? d.human_legacy_eternal_stewardship_abos_principle : undefined,
    human_legacy_eternal_stewardship_engagement_summary: parseEngagementSummary(d.human_legacy_eternal_stewardship_engagement_summary),
    human_legacy_eternal_stewardship_note: typeof d.human_legacy_eternal_stewardship_note === "string" ? d.human_legacy_eternal_stewardship_note : undefined,
    human_legacy_eternal_stewardship_vision_note: typeof d.human_legacy_eternal_stewardship_vision_note === "string" ? d.human_legacy_eternal_stewardship_vision_note : undefined,
  };
}

export function parseHumanLegacyEternalStewardshipEngineDashboard(data: unknown): HumanLegacyEternalStewardshipEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    stewardship_mode: typeof d.stewardship_mode === "string" ? d.stewardship_mode : undefined,
    legacy_readiness_level: Number(d.legacy_readiness_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    human_legacy_eternal_stewardship_score: Number(d.human_legacy_eternal_stewardship_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    stewardship_notes_count: Number(d.stewardship_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_legacy_eternal_stewardship_blueprint: parseBlueprintBlock(d.human_legacy_eternal_stewardship_blueprint),
    human_legacy_eternal_stewardship_mission: typeof d.human_legacy_eternal_stewardship_mission === "string" ? d.human_legacy_eternal_stewardship_mission : undefined,
    human_legacy_eternal_stewardship_philosophy: typeof d.human_legacy_eternal_stewardship_philosophy === "string" ? d.human_legacy_eternal_stewardship_philosophy : undefined,
    human_legacy_eternal_stewardship_abos_principle: typeof d.human_legacy_eternal_stewardship_abos_principle === "string" ? d.human_legacy_eternal_stewardship_abos_principle : undefined,
    human_legacy_eternal_stewardship_objectives: parseObjectives(d.human_legacy_eternal_stewardship_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    hlesbp180_integration_links: parseIntegrationLinks(d.hlesbp180_integration_links),
    hlesbp180_era_opener_summary: parseIntegrationLinks(d.hlesbp180_era_opener_summary),
    human_legacy_eternal_stewardship_engagement_summary: parseEngagementSummary(d.human_legacy_eternal_stewardship_engagement_summary),
    human_legacy_eternal_stewardship_success_criteria: parseSuccessCriteria(d.human_legacy_eternal_stewardship_success_criteria),
    human_legacy_eternal_stewardship_vision: typeof d.human_legacy_eternal_stewardship_vision === "string" ? d.human_legacy_eternal_stewardship_vision : undefined,
    human_legacy_eternal_stewardship_vision_phrases: Array.isArray(d.human_legacy_eternal_stewardship_vision_phrases) ? (d.human_legacy_eternal_stewardship_vision_phrases as string[]) : undefined,
    human_legacy_eternal_stewardship_privacy_note: typeof d.human_legacy_eternal_stewardship_privacy_note === "string" ? d.human_legacy_eternal_stewardship_privacy_note : undefined,
    human_legacy_eternal_stewardship_dogfooding: typeof d.human_legacy_eternal_stewardship_dogfooding === "string" ? d.human_legacy_eternal_stewardship_dogfooding : undefined,
    human_legacy_eternal_stewardship_engine_note: typeof d.human_legacy_eternal_stewardship_engine_note === "string" ? d.human_legacy_eternal_stewardship_engine_note : undefined,
    human_legacy_eternal_stewardship_distinction_note: typeof d.human_legacy_eternal_stewardship_distinction_note === "string" ? d.human_legacy_eternal_stewardship_distinction_note : undefined,
  };
}

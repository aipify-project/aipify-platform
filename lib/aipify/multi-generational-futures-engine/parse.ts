import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  EraOpenerNote,
  ExecutiveFuturesReview,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LegacyContinuityEntry,
  LimitationPrinciples,
  LongHorizonReflection,
  MultiGenerationalFuturesBlueprint,
  MultiGenerationalFuturesCard,
  MultiGenerationalFuturesDashboard,
  MultiGenerationalFuturesEngagementSummary,
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

function parseEngagementSummary(data: unknown): MultiGenerationalFuturesEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MultiGenerationalFuturesEngagementSummary;
}

function parseBlueprintBlock(data: unknown): MultiGenerationalFuturesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as MultiGenerationalFuturesBlueprint;
}

function parseEraOpenerNote(data: unknown): EraOpenerNote | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EraOpenerNote;
}

function parseExecutiveReviews(data: unknown): ExecutiveFuturesReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveFuturesReview[];
}

function parseLongHorizonReflections(data: unknown): LongHorizonReflection[] {
  if (!Array.isArray(data)) return [];
  return data as LongHorizonReflection[];
}

function parseLegacyEntries(data: unknown): LegacyContinuityEntry[] {
  if (!Array.isArray(data)) return [];
  return data as LegacyContinuityEntry[];
}

export function parseMultiGenerationalFuturesCard(data: unknown): MultiGenerationalFuturesCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    multi_generational_futures_score: Number(d.multi_generational_futures_score ?? 0),
    enabled: Boolean(d.enabled),
    stewardship_mode: typeof d.stewardship_mode === "string" ? d.stewardship_mode : undefined,
    stewardship_readiness_level: Number(d.stewardship_readiness_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    long_horizon_reflection_enabled: Boolean(d.long_horizon_reflection_enabled),
    legacy_continuity_enabled: Boolean(d.legacy_continuity_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    multi_generational_futures_mission:
      typeof d.multi_generational_futures_mission === "string"
        ? d.multi_generational_futures_mission
        : undefined,
    multi_generational_futures_abos_principle:
      typeof d.multi_generational_futures_abos_principle === "string"
        ? d.multi_generational_futures_abos_principle
        : undefined,
    multi_generational_futures_engagement_summary: parseEngagementSummary(
      d.multi_generational_futures_engagement_summary,
    ),
    multi_generational_futures_note:
      typeof d.multi_generational_futures_note === "string"
        ? d.multi_generational_futures_note
        : undefined,
    multi_generational_futures_vision_note:
      typeof d.multi_generational_futures_vision_note === "string"
        ? d.multi_generational_futures_vision_note
        : undefined,
  };
}

export function parseMultiGenerationalFuturesDashboard(
  data: unknown,
): MultiGenerationalFuturesDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    stewardship_mode: typeof d.stewardship_mode === "string" ? d.stewardship_mode : undefined,
    stewardship_readiness_level: Number(d.stewardship_readiness_level ?? 1),
    long_horizon_reflection_enabled: Boolean(d.long_horizon_reflection_enabled),
    legacy_continuity_enabled: Boolean(d.legacy_continuity_enabled),
    intergenerational_stewardship_enabled: Boolean(d.intergenerational_stewardship_enabled),
    executive_futures_reviews_enabled: Boolean(d.executive_futures_reviews_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    multi_generational_futures_score: Number(d.multi_generational_futures_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    legacy_entries_count: Number(d.legacy_entries_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    long_horizon_reflections: parseLongHorizonReflections(d.long_horizon_reflections),
    legacy_entries: parseLegacyEntries(d.legacy_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_note: parseEraOpenerNote(d.era_opener_note),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    multi_generational_futures_blueprint: parseBlueprintBlock(d.multi_generational_futures_blueprint),
    multi_generational_futures_mission:
      typeof d.multi_generational_futures_mission === "string"
        ? d.multi_generational_futures_mission
        : undefined,
    multi_generational_futures_philosophy:
      typeof d.multi_generational_futures_philosophy === "string"
        ? d.multi_generational_futures_philosophy
        : undefined,
    multi_generational_futures_abos_principle:
      typeof d.multi_generational_futures_abos_principle === "string"
        ? d.multi_generational_futures_abos_principle
        : undefined,
    multi_generational_futures_objectives: parseObjectives(d.multi_generational_futures_objectives),
    multi_generational_futures_center_meta:
      typeof d.multi_generational_futures_center_meta === "object" &&
      d.multi_generational_futures_center_meta
        ? (d.multi_generational_futures_center_meta as Record<string, unknown>)
        : undefined,
    future_generations_engine_meta:
      typeof d.future_generations_engine_meta === "object" && d.future_generations_engine_meta
        ? (d.future_generations_engine_meta as Record<string, unknown>)
        : undefined,
    long_horizon_responsibility_framework_meta:
      typeof d.long_horizon_responsibility_framework_meta === "object" &&
      d.long_horizon_responsibility_framework_meta
        ? (d.long_horizon_responsibility_framework_meta as Record<string, unknown>)
        : undefined,
    executive_futures_reviews_meta:
      typeof d.executive_futures_reviews_meta === "object" && d.executive_futures_reviews_meta
        ? (d.executive_futures_reviews_meta as Record<string, unknown>)
        : undefined,
    futures_companion_meta:
      typeof d.futures_companion_meta === "object" && d.futures_companion_meta
        ? (d.futures_companion_meta as Record<string, unknown>)
        : undefined,
    intergenerational_stewardship_engine_meta:
      typeof d.intergenerational_stewardship_engine_meta === "object" &&
      d.intergenerational_stewardship_engine_meta
        ? (d.intergenerational_stewardship_engine_meta as Record<string, unknown>)
        : undefined,
    legacy_continuity_engine_meta:
      typeof d.legacy_continuity_engine_meta === "object" && d.legacy_continuity_engine_meta
        ? (d.legacy_continuity_engine_meta as Record<string, unknown>)
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
    mgfebp171_integration_links: parseIntegrationLinks(d.mgfebp171_integration_links),
    mgfebp171_era_opener_note: parseEraOpenerNote(d.mgfebp171_era_opener_note),
    multi_generational_futures_engagement_summary: parseEngagementSummary(
      d.multi_generational_futures_engagement_summary,
    ),
    multi_generational_futures_success_criteria: parseSuccessCriteria(
      d.multi_generational_futures_success_criteria,
    ),
    multi_generational_futures_vision:
      typeof d.multi_generational_futures_vision === "string"
        ? d.multi_generational_futures_vision
        : undefined,
    multi_generational_futures_vision_phrases: Array.isArray(d.multi_generational_futures_vision_phrases)
      ? (d.multi_generational_futures_vision_phrases as string[])
      : undefined,
    multi_generational_futures_privacy_note:
      typeof d.multi_generational_futures_privacy_note === "string"
        ? d.multi_generational_futures_privacy_note
        : undefined,
    multi_generational_futures_dogfooding:
      typeof d.multi_generational_futures_dogfooding === "string"
        ? d.multi_generational_futures_dogfooding
        : undefined,
    multi_generational_futures_engine_note:
      typeof d.multi_generational_futures_engine_note === "string"
        ? d.multi_generational_futures_engine_note
        : undefined,
    multi_generational_futures_distinction_note:
      typeof d.multi_generational_futures_distinction_note === "string"
        ? d.multi_generational_futures_distinction_note
        : undefined,
  };
}

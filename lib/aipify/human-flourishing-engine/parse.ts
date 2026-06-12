import type {
  AbosSuccessCriterion,
  BelongingReflection,
  BlueprintObjective,
  ExecutiveFlourishingReview,
  HumanFlourishingBlueprint,
  HumanFlourishingCard,
  HumanFlourishingDashboard,
  HumanFlourishingEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LearningRecord,
  LimitationPrinciples,
  StrengthsNote,
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

function parseEngagementSummary(data: unknown): HumanFlourishingEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanFlourishingEngagementSummary;
}

function parseBlueprintBlock(data: unknown): HumanFlourishingBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanFlourishingBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveFlourishingReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveFlourishingReview[];
}

function parseBelongingReflections(data: unknown): BelongingReflection[] {
  if (!Array.isArray(data)) return [];
  return data as BelongingReflection[];
}

function parseStrengthsNotes(data: unknown): StrengthsNote[] {
  if (!Array.isArray(data)) return [];
  return data as StrengthsNote[];
}

function parseLearningRecords(data: unknown): LearningRecord[] {
  if (!Array.isArray(data)) return [];
  return data as LearningRecord[];
}

export function parseHumanFlourishingCard(data: unknown): HumanFlourishingCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_flourishing_score: Number(d.human_flourishing_score ?? 0),
    enabled: Boolean(d.enabled),
    development_mode: typeof d.development_mode === "string" ? d.development_mode : undefined,
    flourishing_readiness_level: Number(d.flourishing_readiness_level ?? 1),
    learning_records_count: Number(d.learning_records_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    belonging_reflection_enabled: Boolean(d.belonging_reflection_enabled),
    strengths_development_enabled: Boolean(d.strengths_development_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_flourishing_mission:
      typeof d.human_flourishing_mission === "string" ? d.human_flourishing_mission : undefined,
    human_flourishing_abos_principle:
      typeof d.human_flourishing_abos_principle === "string"
        ? d.human_flourishing_abos_principle
        : undefined,
    human_flourishing_engagement_summary: parseEngagementSummary(
      d.human_flourishing_engagement_summary,
    ),
    human_flourishing_note:
      typeof d.human_flourishing_note === "string" ? d.human_flourishing_note : undefined,
    human_flourishing_vision_note:
      typeof d.human_flourishing_vision_note === "string"
        ? d.human_flourishing_vision_note
        : undefined,
  };
}

export function parseHumanFlourishingDashboard(data: unknown): HumanFlourishingDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    development_mode: typeof d.development_mode === "string" ? d.development_mode : undefined,
    flourishing_readiness_level: Number(d.flourishing_readiness_level ?? 1),
    belonging_reflection_enabled: Boolean(d.belonging_reflection_enabled),
    strengths_development_enabled: Boolean(d.strengths_development_enabled),
    lifelong_learning_enabled: Boolean(d.lifelong_learning_enabled),
    leadership_growth_enabled: Boolean(d.leadership_growth_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    human_flourishing_score: Number(d.human_flourishing_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    belonging_reflections_count: Number(d.belonging_reflections_count ?? 0),
    strengths_notes_count: Number(d.strengths_notes_count ?? 0),
    learning_records_count: Number(d.learning_records_count ?? 0),
    active_learning_count: Number(d.active_learning_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    belonging_reflections: parseBelongingReflections(d.belonging_reflections),
    strengths_notes: parseStrengthsNotes(d.strengths_notes),
    learning_records: parseLearningRecords(d.learning_records),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_capstone_summary: parseIntegrationLinks(d.era_capstone_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_flourishing_blueprint: parseBlueprintBlock(d.human_flourishing_blueprint),
    human_flourishing_mission:
      typeof d.human_flourishing_mission === "string" ? d.human_flourishing_mission : undefined,
    human_flourishing_philosophy:
      typeof d.human_flourishing_philosophy === "string"
        ? d.human_flourishing_philosophy
        : undefined,
    human_flourishing_abos_principle:
      typeof d.human_flourishing_abos_principle === "string"
        ? d.human_flourishing_abos_principle
        : undefined,
    human_flourishing_objectives: parseObjectives(d.human_flourishing_objectives),
    human_flourishing_center_meta:
      typeof d.human_flourishing_center_meta === "object" && d.human_flourishing_center_meta
        ? (d.human_flourishing_center_meta as Record<string, unknown>)
        : undefined,
    human_potential_engine_meta:
      typeof d.human_potential_engine_meta === "object" && d.human_potential_engine_meta
        ? (d.human_potential_engine_meta as Record<string, unknown>)
        : undefined,
    flourishing_framework_meta:
      typeof d.flourishing_framework_meta === "object" && d.flourishing_framework_meta
        ? (d.flourishing_framework_meta as Record<string, unknown>)
        : undefined,
    executive_flourishing_reviews_meta:
      typeof d.executive_flourishing_reviews_meta === "object" &&
      d.executive_flourishing_reviews_meta
        ? (d.executive_flourishing_reviews_meta as Record<string, unknown>)
        : undefined,
    flourishing_companion_meta:
      typeof d.flourishing_companion_meta === "object" && d.flourishing_companion_meta
        ? (d.flourishing_companion_meta as Record<string, unknown>)
        : undefined,
    belonging_engine_meta:
      typeof d.belonging_engine_meta === "object" && d.belonging_engine_meta
        ? (d.belonging_engine_meta as Record<string, unknown>)
        : undefined,
    strengths_development_engine_meta:
      typeof d.strengths_development_engine_meta === "object" &&
      d.strengths_development_engine_meta
        ? (d.strengths_development_engine_meta as Record<string, unknown>)
        : undefined,
    lifelong_learning_framework_meta:
      typeof d.lifelong_learning_framework_meta === "object" &&
      d.lifelong_learning_framework_meta
        ? (d.lifelong_learning_framework_meta as Record<string, unknown>)
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
    cfhpbp170_integration_links: parseIntegrationLinks(d.cfhpbp170_integration_links),
    cfhpbp170_era_capstone_summary: parseIntegrationLinks(d.cfhpbp170_era_capstone_summary),
    human_flourishing_engagement_summary: parseEngagementSummary(
      d.human_flourishing_engagement_summary,
    ),
    human_flourishing_success_criteria: parseSuccessCriteria(
      d.human_flourishing_success_criteria,
    ),
    human_flourishing_vision:
      typeof d.human_flourishing_vision === "string" ? d.human_flourishing_vision : undefined,
    human_flourishing_vision_phrases: Array.isArray(d.human_flourishing_vision_phrases)
      ? (d.human_flourishing_vision_phrases as string[])
      : undefined,
    human_flourishing_privacy_note:
      typeof d.human_flourishing_privacy_note === "string"
        ? d.human_flourishing_privacy_note
        : undefined,
    human_flourishing_dogfooding:
      typeof d.human_flourishing_dogfooding === "string"
        ? d.human_flourishing_dogfooding
        : undefined,
    human_flourishing_engine_note:
      typeof d.human_flourishing_engine_note === "string"
        ? d.human_flourishing_engine_note
        : undefined,
    human_flourishing_distinction_note:
      typeof d.human_flourishing_distinction_note === "string"
        ? d.human_flourishing_distinction_note
        : undefined,
  };
}

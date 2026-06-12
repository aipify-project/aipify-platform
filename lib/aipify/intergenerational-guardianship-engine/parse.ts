import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ContinuityReflection,
  ExecutiveGuardianshipReview,
  GuardianshipEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  IntergenerationalGuardianshipBlueprint,
  IntergenerationalGuardianshipCard,
  IntergenerationalGuardianshipDashboard,
  LegacyResilienceEntry,
  LimitationPrinciples,
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

function parseEngagementSummary(data: unknown): GuardianshipEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GuardianshipEngagementSummary;
}

function parseBlueprintBlock(data: unknown): IntergenerationalGuardianshipBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as IntergenerationalGuardianshipBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveGuardianshipReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveGuardianshipReview[];
}

function parseContinuityReflections(data: unknown): ContinuityReflection[] {
  if (!Array.isArray(data)) return [];
  return data as ContinuityReflection[];
}

function parseLegacyEntries(data: unknown): LegacyResilienceEntry[] {
  if (!Array.isArray(data)) return [];
  return data as LegacyResilienceEntry[];
}

export function parseIntergenerationalGuardianshipCard(data: unknown): IntergenerationalGuardianshipCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    guardianship_score: Number(d.guardianship_score ?? 0),
    enabled: Boolean(d.enabled),
    guardianship_mode:
      typeof d.guardianship_mode === "string" ? d.guardianship_mode : undefined,
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    continuity_reflection_enabled: Boolean(d.continuity_reflection_enabled),
    values_preservation_enabled: Boolean(d.values_preservation_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    intergenerational_guardianship_mission:
      typeof d.intergenerational_guardianship_mission === "string"
        ? d.intergenerational_guardianship_mission
        : undefined,
    intergenerational_guardianship_abos_principle:
      typeof d.intergenerational_guardianship_abos_principle === "string"
        ? d.intergenerational_guardianship_abos_principle
        : undefined,
    intergenerational_guardianship_engagement_summary: parseEngagementSummary(
      d.intergenerational_guardianship_engagement_summary,
    ),
    intergenerational_guardianship_note:
      typeof d.intergenerational_guardianship_note === "string"
        ? d.intergenerational_guardianship_note
        : undefined,
    intergenerational_guardianship_vision_note:
      typeof d.intergenerational_guardianship_vision_note === "string"
        ? d.intergenerational_guardianship_vision_note
        : undefined,
  };
}

export function parseIntergenerationalGuardianshipDashboard(
  data: unknown,
): IntergenerationalGuardianshipDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    guardianship_mode:
      typeof d.guardianship_mode === "string" ? d.guardianship_mode : undefined,
    continuity_reflection_enabled: Boolean(d.continuity_reflection_enabled),
    values_preservation_enabled: Boolean(d.values_preservation_enabled),
    legacy_resilience_enabled: Boolean(d.legacy_resilience_enabled),
    executive_reviews_enabled: Boolean(d.executive_reviews_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    guardianship_score: Number(d.guardianship_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    continuity_reflections_count: Number(d.continuity_reflections_count ?? 0),
    legacy_entries_count: Number(d.legacy_entries_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    continuity_reflections: parseContinuityReflections(d.continuity_reflections),
    legacy_entries: parseLegacyEntries(d.legacy_entries),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    intergenerational_guardianship_blueprint: parseBlueprintBlock(
      d.intergenerational_guardianship_blueprint,
    ),
    intergenerational_guardianship_mission:
      typeof d.intergenerational_guardianship_mission === "string"
        ? d.intergenerational_guardianship_mission
        : undefined,
    intergenerational_guardianship_philosophy:
      typeof d.intergenerational_guardianship_philosophy === "string"
        ? d.intergenerational_guardianship_philosophy
        : undefined,
    intergenerational_guardianship_abos_principle:
      typeof d.intergenerational_guardianship_abos_principle === "string"
        ? d.intergenerational_guardianship_abos_principle
        : undefined,
    intergenerational_guardianship_objectives: parseObjectives(
      d.intergenerational_guardianship_objectives,
    ),
    guardianship_center_meta:
      typeof d.guardianship_center_meta === "object" && d.guardianship_center_meta
        ? (d.guardianship_center_meta as Record<string, unknown>)
        : undefined,
    human_continuity_engine_meta:
      typeof d.human_continuity_engine_meta === "object" && d.human_continuity_engine_meta
        ? (d.human_continuity_engine_meta as Record<string, unknown>)
        : undefined,
    intergenerational_responsibility_framework_meta:
      typeof d.intergenerational_responsibility_framework_meta === "object" &&
      d.intergenerational_responsibility_framework_meta
        ? (d.intergenerational_responsibility_framework_meta as Record<string, unknown>)
        : undefined,
    executive_guardianship_reviews_meta:
      typeof d.executive_guardianship_reviews_meta === "object" &&
      d.executive_guardianship_reviews_meta
        ? (d.executive_guardianship_reviews_meta as Record<string, unknown>)
        : undefined,
    guardianship_companion_meta:
      typeof d.guardianship_companion_meta === "object" && d.guardianship_companion_meta
        ? (d.guardianship_companion_meta as Record<string, unknown>)
        : undefined,
    values_preservation_engine_meta:
      typeof d.values_preservation_engine_meta === "object" && d.values_preservation_engine_meta
        ? (d.values_preservation_engine_meta as Record<string, unknown>)
        : undefined,
    legacy_resilience_engine_meta:
      typeof d.legacy_resilience_engine_meta === "object" && d.legacy_resilience_engine_meta
        ? (d.legacy_resilience_engine_meta as Record<string, unknown>)
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
    ighcebp172_integration_links: parseIntegrationLinks(d.ighcebp172_integration_links),
    intergenerational_guardianship_engagement_summary: parseEngagementSummary(
      d.intergenerational_guardianship_engagement_summary,
    ),
    intergenerational_guardianship_success_criteria: parseSuccessCriteria(
      d.intergenerational_guardianship_success_criteria,
    ),
    intergenerational_guardianship_vision:
      typeof d.intergenerational_guardianship_vision === "string"
        ? d.intergenerational_guardianship_vision
        : undefined,
    intergenerational_guardianship_vision_phrases: Array.isArray(
      d.intergenerational_guardianship_vision_phrases,
    )
      ? (d.intergenerational_guardianship_vision_phrases as string[])
      : undefined,
    intergenerational_guardianship_privacy_note:
      typeof d.intergenerational_guardianship_privacy_note === "string"
        ? d.intergenerational_guardianship_privacy_note
        : undefined,
    intergenerational_guardianship_dogfooding:
      typeof d.intergenerational_guardianship_dogfooding === "string"
        ? d.intergenerational_guardianship_dogfooding
        : undefined,
    intergenerational_guardianship_engine_note:
      typeof d.intergenerational_guardianship_engine_note === "string"
        ? d.intergenerational_guardianship_engine_note
        : undefined,
    intergenerational_guardianship_distinction_note:
      typeof d.intergenerational_guardianship_distinction_note === "string"
        ? d.intergenerational_guardianship_distinction_note
        : undefined,
  };
}

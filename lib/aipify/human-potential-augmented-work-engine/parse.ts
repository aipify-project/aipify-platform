import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  GrowthCompanionMeta,
  HumanPotentialBlueprint,
  HumanPotentialCard,
  HumanPotentialDashboard,
  HumanPotentialEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
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

function parseEngagementSummary(data: unknown): HumanPotentialEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanPotentialEngagementSummary;
}

function parseBlueprintBlock(data: unknown): HumanPotentialBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as HumanPotentialBlueprint;
}

function parseRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data as Record<string, unknown>[];
}

export function parseHumanPotentialCard(data: unknown): HumanPotentialCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    augmentation_engagement_score: Number(d.augmentation_engagement_score ?? 0),
    learning_recommendations_pending: Number(d.learning_recommendations_pending ?? 0),
    reflection_entries_active: Number(d.reflection_entries_active ?? 0),
    recognition_moments_active: Number(d.recognition_moments_active ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    no_ranking_mode: Boolean(d.no_ranking_mode ?? true),
    user_owned_reflections: Boolean(d.user_owned_reflections ?? true),
    human_potential_center_enabled: Boolean(d.human_potential_center_enabled ?? true),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    human_potential_mission:
      typeof d.human_potential_mission === "string" ? d.human_potential_mission : undefined,
    human_potential_abos_principle:
      typeof d.human_potential_abos_principle === "string" ? d.human_potential_abos_principle : undefined,
    human_potential_engagement_summary: parseEngagementSummary(d.human_potential_engagement_summary),
    human_potential_note: typeof d.human_potential_note === "string" ? d.human_potential_note : undefined,
    human_potential_vision_note:
      typeof d.human_potential_vision_note === "string" ? d.human_potential_vision_note : undefined,
  };
}

export function parseHumanPotentialDashboard(data: unknown): HumanPotentialDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_potential_center_enabled: Boolean(d.human_potential_center_enabled ?? true),
    growth_companion_enabled: Boolean(d.growth_companion_enabled ?? true),
    strengths_reflection_enabled: Boolean(d.strengths_reflection_enabled ?? true),
    meaningful_work_enabled: Boolean(d.meaningful_work_enabled ?? true),
    recognition_scaffolds_enabled: Boolean(d.recognition_scaffolds_enabled ?? true),
    no_ranking_mode: Boolean(d.no_ranking_mode ?? true),
    user_owned_reflections: Boolean(d.user_owned_reflections ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    augmentation_engagement_score: Number(d.augmentation_engagement_score ?? 0),
    learning_recommendations_pending: Number(d.learning_recommendations_pending ?? 0),
    reflection_entries_active: Number(d.reflection_entries_active ?? 0),
    recognition_moments_active: Number(d.recognition_moments_active ?? 0),
    growth_profiles_count: Number(d.growth_profiles_count ?? 0),
    learning_recommendations: Array.isArray(d.learning_recommendations)
      ? (d.learning_recommendations as HumanPotentialDashboard["learning_recommendations"])
      : [],
    reflection_entries: Array.isArray(d.reflection_entries)
      ? (d.reflection_entries as HumanPotentialDashboard["reflection_entries"])
      : [],
    recognition_moments: Array.isArray(d.recognition_moments)
      ? (d.recognition_moments as HumanPotentialDashboard["recognition_moments"])
      : [],
    human_potential_center: parseRecordArray(d.human_potential_center),
    augmented_work_framework: parseRecordArray(d.augmented_work_framework),
    strengths_intelligence_engine: parseRecordArray(d.strengths_intelligence_engine),
    growth_companion: d.growth_companion as GrowthCompanionMeta | undefined,
    meaningful_work_engine: parseRecordArray(d.meaningful_work_engine),
    career_development_framework: parseRecordArray(d.career_development_framework),
    recognition_engine: parseRecordArray(d.recognition_engine),
    reflection_practice_engine: parseRecordArray(d.reflection_practice_engine),
    companion_limitations: parseRecordArray(d.companion_limitations),
    augmentation_principles: parseRecordArray(d.augmentation_principles),
    self_love_connection: parseRecordArray(d.self_love_connection),
    security_requirements: parseRecordArray(d.security_requirements),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.hpawbp139_cross_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    human_potential_blueprint: parseBlueprintBlock(d.human_potential_blueprint),
    human_potential_mission:
      typeof d.human_potential_mission === "string" ? d.human_potential_mission : undefined,
    human_potential_philosophy:
      typeof d.human_potential_philosophy === "string" ? d.human_potential_philosophy : undefined,
    human_potential_abos_principle:
      typeof d.human_potential_abos_principle === "string" ? d.human_potential_abos_principle : undefined,
    human_potential_objectives: parseObjectives(d.human_potential_objectives),
    human_potential_engagement_summary: parseEngagementSummary(d.human_potential_engagement_summary),
    human_potential_success_criteria: parseSuccessCriteria(d.human_potential_success_criteria),
    hpawbp139_cross_links: parseIntegrationLinks(d.hpawbp139_cross_links),
    human_potential_vision:
      typeof d.human_potential_vision === "string" ? d.human_potential_vision : undefined,
    human_potential_vision_phrases: Array.isArray(d.human_potential_vision_phrases)
      ? (d.human_potential_vision_phrases as string[])
      : undefined,
    human_potential_privacy_note:
      typeof d.human_potential_privacy_note === "string" ? d.human_potential_privacy_note : undefined,
    human_potential_engine_note:
      typeof d.human_potential_engine_note === "string" ? d.human_potential_engine_note : undefined,
  };
}

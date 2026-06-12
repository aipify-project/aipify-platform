import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  SharedPurposeContributionEngineBlueprint,
  SharedPurposeContributionEngineCard,
  SharedPurposeContributionEngineDashboard,
  SharedPurposeContributionEngineEngagementSummary,
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

function parseEngagementSummary(data: unknown): SharedPurposeContributionEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedPurposeContributionEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): SharedPurposeContributionEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SharedPurposeContributionEngineBlueprint;
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

export function parseSharedPurposeContributionEngineCard(data: unknown): SharedPurposeContributionEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    humanity_shared_purpose_contribution_score: Number(d.humanity_shared_purpose_contribution_score ?? 0),
    enabled: Boolean(d.enabled),
    contribution_mode: typeof d.contribution_mode === "string" ? d.contribution_mode : undefined,
    purpose_readiness_level: Number(d.purpose_readiness_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    humanity_shared_purpose_contribution_mission: typeof d.humanity_shared_purpose_contribution_mission === "string" ? d.humanity_shared_purpose_contribution_mission : undefined,
    humanity_shared_purpose_contribution_abos_principle: typeof d.humanity_shared_purpose_contribution_abos_principle === "string" ? d.humanity_shared_purpose_contribution_abos_principle : undefined,
    humanity_shared_purpose_contribution_engagement_summary: parseEngagementSummary(d.humanity_shared_purpose_contribution_engagement_summary),
    humanity_shared_purpose_contribution_note: typeof d.humanity_shared_purpose_contribution_note === "string" ? d.humanity_shared_purpose_contribution_note : undefined,
    humanity_shared_purpose_contribution_vision_note: typeof d.humanity_shared_purpose_contribution_vision_note === "string" ? d.humanity_shared_purpose_contribution_vision_note : undefined,
  };
}

export function parseSharedPurposeContributionEngineDashboard(data: unknown): SharedPurposeContributionEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    contribution_mode: typeof d.contribution_mode === "string" ? d.contribution_mode : undefined,
    purpose_readiness_level: Number(d.purpose_readiness_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    humanity_shared_purpose_contribution_score: Number(d.humanity_shared_purpose_contribution_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    contribution_notes_count: Number(d.contribution_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    humanity_shared_purpose_contribution_blueprint: parseBlueprintBlock(d.humanity_shared_purpose_contribution_blueprint),
    humanity_shared_purpose_contribution_mission: typeof d.humanity_shared_purpose_contribution_mission === "string" ? d.humanity_shared_purpose_contribution_mission : undefined,
    humanity_shared_purpose_contribution_philosophy: typeof d.humanity_shared_purpose_contribution_philosophy === "string" ? d.humanity_shared_purpose_contribution_philosophy : undefined,
    humanity_shared_purpose_contribution_abos_principle: typeof d.humanity_shared_purpose_contribution_abos_principle === "string" ? d.humanity_shared_purpose_contribution_abos_principle : undefined,
    humanity_shared_purpose_contribution_objectives: parseObjectives(d.humanity_shared_purpose_contribution_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    hspcbp183_integration_links: parseIntegrationLinks(d.hspcbp183_integration_links),
    hspcbp183_era_opener_summary: parseIntegrationLinks(d.hspcbp183_era_opener_summary),
    humanity_shared_purpose_contribution_engagement_summary: parseEngagementSummary(d.humanity_shared_purpose_contribution_engagement_summary),
    humanity_shared_purpose_contribution_success_criteria: parseSuccessCriteria(d.humanity_shared_purpose_contribution_success_criteria),
    humanity_shared_purpose_contribution_vision: typeof d.humanity_shared_purpose_contribution_vision === "string" ? d.humanity_shared_purpose_contribution_vision : undefined,
    humanity_shared_purpose_contribution_vision_phrases: Array.isArray(d.humanity_shared_purpose_contribution_vision_phrases) ? (d.humanity_shared_purpose_contribution_vision_phrases as string[]) : undefined,
    humanity_shared_purpose_contribution_privacy_note: typeof d.humanity_shared_purpose_contribution_privacy_note === "string" ? d.humanity_shared_purpose_contribution_privacy_note : undefined,
    humanity_shared_purpose_contribution_dogfooding: typeof d.humanity_shared_purpose_contribution_dogfooding === "string" ? d.humanity_shared_purpose_contribution_dogfooding : undefined,
    humanity_shared_purpose_contribution_engine_note: typeof d.humanity_shared_purpose_contribution_engine_note === "string" ? d.humanity_shared_purpose_contribution_engine_note : undefined,
    humanity_shared_purpose_contribution_distinction_note: typeof d.humanity_shared_purpose_contribution_distinction_note === "string" ? d.humanity_shared_purpose_contribution_distinction_note : undefined,
  };
}

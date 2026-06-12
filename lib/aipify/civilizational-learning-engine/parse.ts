import type {
  AbosSuccessCriterion,
  AdaptationReview,
  BlueprintObjective,
  CivilizationalLearningBlueprint,
  CivilizationalLearningCard,
  CivilizationalLearningDashboard,
  CivilizationalLearningEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LearningProgram,
  LessonLearned,
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

function parseEngagementSummary(data: unknown): CivilizationalLearningEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalLearningEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CivilizationalLearningBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CivilizationalLearningBlueprint;
}

function parsePrograms(data: unknown): LearningProgram[] {
  if (!Array.isArray(data)) return [];
  return data as LearningProgram[];
}

function parseReviews(data: unknown): AdaptationReview[] {
  if (!Array.isArray(data)) return [];
  return data as AdaptationReview[];
}

function parseLessons(data: unknown): LessonLearned[] {
  if (!Array.isArray(data)) return [];
  return data as LessonLearned[];
}

export function parseCivilizationalLearningCard(data: unknown): CivilizationalLearningCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    collective_adaptation_score: Number(d.collective_adaptation_score ?? 0),
    adaptation_readiness_level: Number(d.adaptation_readiness_level ?? 1),
    adaptation_reviews_count: Number(d.adaptation_reviews_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    cross_org_learning_opt_in: Boolean(d.cross_org_learning_opt_in),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_learning_mission:
      typeof d.civilizational_learning_mission === "string"
        ? d.civilizational_learning_mission
        : undefined,
    civilizational_learning_abos_principle:
      typeof d.civilizational_learning_abos_principle === "string"
        ? d.civilizational_learning_abos_principle
        : undefined,
    civilizational_learning_engagement_summary: parseEngagementSummary(
      d.civilizational_learning_engagement_summary,
    ),
    civilizational_learning_note:
      typeof d.civilizational_learning_note === "string"
        ? d.civilizational_learning_note
        : undefined,
    civilizational_learning_vision_note:
      typeof d.civilizational_learning_vision_note === "string"
        ? d.civilizational_learning_vision_note
        : undefined,
  };
}

export function parseCivilizationalLearningDashboard(data: unknown): CivilizationalLearningDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    adaptation_readiness_level: Number(d.adaptation_readiness_level ?? 1),
    learning_maturity_stage:
      typeof d.learning_maturity_stage === "string" ? d.learning_maturity_stage : undefined,
    cross_org_learning_opt_in: Boolean(d.cross_org_learning_opt_in),
    reflection_opt_in: Boolean(d.reflection_opt_in),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    collective_adaptation_score: Number(d.collective_adaptation_score ?? 0),
    learning_programs_count: Number(d.learning_programs_count ?? 0),
    adaptation_reviews_count: Number(d.adaptation_reviews_count ?? 0),
    lessons_learned_count: Number(d.lessons_learned_count ?? 0),
    learning_programs: parsePrograms(d.learning_programs),
    adaptation_reviews: parseReviews(d.adaptation_reviews),
    lessons_learned: parseLessons(d.lessons_learned),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    civilizational_learning_blueprint: parseBlueprintBlock(d.civilizational_learning_blueprint),
    civilizational_learning_mission:
      typeof d.civilizational_learning_mission === "string"
        ? d.civilizational_learning_mission
        : undefined,
    civilizational_learning_philosophy:
      typeof d.civilizational_learning_philosophy === "string"
        ? d.civilizational_learning_philosophy
        : undefined,
    civilizational_learning_abos_principle:
      typeof d.civilizational_learning_abos_principle === "string"
        ? d.civilizational_learning_abos_principle
        : undefined,
    civilizational_learning_objectives: parseObjectives(d.civilizational_learning_objectives),
    collective_adaptation_center_meta:
      typeof d.collective_adaptation_center_meta === "object" &&
      d.collective_adaptation_center_meta
        ? (d.collective_adaptation_center_meta as Record<string, unknown>)
        : undefined,
    collective_learning_engine_meta:
      typeof d.collective_learning_engine_meta === "object" && d.collective_learning_engine_meta
        ? (d.collective_learning_engine_meta as Record<string, unknown>)
        : undefined,
    adaptation_framework_engine_meta:
      typeof d.adaptation_framework_engine_meta === "object" &&
      d.adaptation_framework_engine_meta
        ? (d.adaptation_framework_engine_meta as Record<string, unknown>)
        : undefined,
    executive_learning_reviews_meta:
      typeof d.executive_learning_reviews_meta === "object" &&
      d.executive_learning_reviews_meta
        ? (d.executive_learning_reviews_meta as Record<string, unknown>)
        : undefined,
    adaptation_companion_meta:
      typeof d.adaptation_companion_meta === "object" && d.adaptation_companion_meta
        ? (d.adaptation_companion_meta as Record<string, unknown>)
        : undefined,
    collective_resilience_engine_meta:
      typeof d.collective_resilience_engine_meta === "object" &&
      d.collective_resilience_engine_meta
        ? (d.collective_resilience_engine_meta as Record<string, unknown>)
        : undefined,
    humility_innovation_framework_meta:
      typeof d.humility_innovation_framework_meta === "object" &&
      d.humility_innovation_framework_meta
        ? (d.humility_innovation_framework_meta as Record<string, unknown>)
        : undefined,
    adaptation_memory_engine_meta:
      typeof d.adaptation_memory_engine_meta === "object" && d.adaptation_memory_engine_meta
        ? (d.adaptation_memory_engine_meta as Record<string, unknown>)
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
    claebp164_integration_links: parseIntegrationLinks(d.claebp164_integration_links),
    civilizational_learning_engagement_summary: parseEngagementSummary(
      d.civilizational_learning_engagement_summary,
    ),
    civilizational_learning_success_criteria: parseSuccessCriteria(
      d.civilizational_learning_success_criteria,
    ),
    civilizational_learning_vision:
      typeof d.civilizational_learning_vision === "string"
        ? d.civilizational_learning_vision
        : undefined,
    civilizational_learning_vision_phrases: Array.isArray(d.civilizational_learning_vision_phrases)
      ? (d.civilizational_learning_vision_phrases as string[])
      : undefined,
    civilizational_learning_privacy_note:
      typeof d.civilizational_learning_privacy_note === "string"
        ? d.civilizational_learning_privacy_note
        : undefined,
    civilizational_learning_dogfooding:
      typeof d.civilizational_learning_dogfooding === "string"
        ? d.civilizational_learning_dogfooding
        : undefined,
    civilizational_learning_engine_note:
      typeof d.civilizational_learning_engine_note === "string"
        ? d.civilizational_learning_engine_note
        : undefined,
    civilizational_learning_distinction_note:
      typeof d.civilizational_learning_distinction_note === "string"
        ? d.civilizational_learning_distinction_note
        : undefined,
  };
}

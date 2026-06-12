export const IMPLEMENTATION_BLUEPRINT_PHASE14_MISSION =
  "Maintain relevant, accurate, useful knowledge through proactive, explainable recommendations.";

export const IMPLEMENTATION_BLUEPRINT_PHASE14_PHILOSOPHY =
  "Knowledge is not static — organizations, processes, and customers evolve.";

export const IMPLEMENTATION_BLUEPRINT_PHASE14_ABOS_PRINCIPLE =
  "Evolution without transparency creates distrust — Aipify recommends; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE14_HEALTH_INDICATORS = [
  "freshness_score",
  "coverage_score",
  "quality_score",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE14_RECOMMENDATION_TYPES = [
  "stale_content",
  "review_queue",
  "knowledge_gap",
  "overlapping_content",
  "frequent_topic",
] as const;

export function getImplementationBlueprintPhase14Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE14_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE14_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE14_ABOS_PRINCIPLE,
    healthIndicators: IMPLEMENTATION_BLUEPRINT_PHASE14_HEALTH_INDICATORS,
    recommendationTypes: IMPLEMENTATION_BLUEPRINT_PHASE14_RECOMMENDATION_TYPES,
  };
}

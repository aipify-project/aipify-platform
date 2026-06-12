export const IMPLEMENTATION_BLUEPRINT_PHASE23_MISSION =
  "Continuous improvement through observation, feedback, and experience — preserving trust, governance, and human oversight.";

export const IMPLEMENTATION_BLUEPRINT_PHASE23_PHILOSOPHY =
  "Learning is intentional; adaptation is transparent; improvement never compromises trust.";

export const IMPLEMENTATION_BLUEPRINT_PHASE23_ABOS_PRINCIPLE =
  "Strongest organizations keep learning — make learning visible, practical, and continuous.";

export const IMPLEMENTATION_BLUEPRINT_PHASE23_CORE_PRINCIPLE =
  "Aipify learns WITH the customer — not FROM the customer.";

export const IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_OBJECTIVE_KEYS = [
  "feedback_collection",
  "recommendation_refinement",
  "workflow_improvement",
  "knowledge_enhancement",
  "support_optimization",
  "organizational_learning",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_SOURCE_DOMAINS = [
  "support",
  "knowledge",
  "operational",
  "companion",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE23_VISION_PHRASES = [
  "Organizations become wiser through experience; Aipify grows alongside them responsibly, one lesson at a time.",
  "Strongest organizations keep learning — make learning visible, practical, and continuous.",
  "Aipify learns WITH the customer — not FROM the customer.",
  "Learning is intentional; adaptation is transparent; improvement never compromises trust.",
  "Feedback loops work when outcomes are visible, explainable, auditable, and reversible.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE23_COMPANION_EXAMPLES = [
  "🦉 Support resolution times improved — Aipify suggests prioritizing similar workflows for team review.",
  "🌹 Your feedback on draft templates helped refine support suggestions — the organization benefits together.",
  "🔔 Automation success rate has risen for three consecutive weeks — a positive trend worth celebrating.",
  "🦉 Your approval workflow is stronger than three months ago — steady organizational learning.",
] as const;

export function getImplementationBlueprintPhase23Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE23_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE23_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE23_ABOS_PRINCIPLE,
    corePrinciple: IMPLEMENTATION_BLUEPRINT_PHASE23_CORE_PRINCIPLE,
    learningObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_OBJECTIVE_KEYS,
    learningSourceDomains: IMPLEMENTATION_BLUEPRINT_PHASE23_LEARNING_SOURCE_DOMAINS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE23_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE23_COMPANION_EXAMPLES,
    engineRoute: "/app/learning",
    reviewRoute: "/app/learning/review",
    enginePhase: "Phase 65",
    reviewPhase: "Phase 29",
    blueprintPhase: "Phase 23 — Learning & Adaptation Engine",
    learningTrainingDistinction: "Learning & Training Engine A.36 — user education at /app/learning-training-engine, distinct from operational learning",
    knowledgeEvolutionDistinction: "Knowledge Evolution Blueprint Phase 14 — article lifecycle at /app/knowledge-center-engine",
    growthEvolutionDistinction: "Growth & Evolution Engine A.81 — growth cycles at /app/growth-evolution-engine",
    selfLoveBoundary: "Self Love celebrates progress and normalizes learning — principle only; Learning Engine stores metadata, not wellbeing content.",
  };
}

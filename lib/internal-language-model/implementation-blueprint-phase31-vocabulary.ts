export const IMPLEMENTATION_BLUEPRINT_PHASE31_MISSION =
  "Help organizations accelerate adoption, strengthen competence, and create long-term success through guided learning and certification experiences.";

export const IMPLEMENTATION_BLUEPRINT_PHASE31_PHILOSOPHY =
  "Knowledge creates confidence. Confidence accelerates adoption. Learning should feel achievable — not intimidating.";

export const IMPLEMENTATION_BLUEPRINT_PHASE31_ABOS_PRINCIPLE =
  "The most powerful tools create the greatest value when people understand how to use them confidently. Learning transforms capability into impact.";

export const IMPLEMENTATION_BLUEPRINT_PHASE31_LEARNING_PATH_KEYS = [
  "aipify_foundations",
  "support_specialist_certification",
  "executive_companion_certification",
  "administrator_certification",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE31_VISION_PHRASES = [
  "We know how to succeed with this.",
  "Learning transforms capability into impact.",
  "People feel empowered rather than overwhelmed.",
  "Teams grow together through achievable paths.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE31_COMPANION_EXAMPLES = [
  "🌹 You are making excellent progress.",
  "🔔 A learning milestone has been achieved.",
  "🦉 This concept becomes easier with practice.",
  "❤️ Remember that mastery develops over time.",
] as const;

export function getImplementationBlueprintPhase31Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE31_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE31_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE31_ABOS_PRINCIPLE,
    learningPathKeys: IMPLEMENTATION_BLUEPRINT_PHASE31_LEARNING_PATH_KEYS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE31_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE31_COMPANION_EXAMPLES,
    engineRoute: "/app/learning-training-engine",
    enginePhase: "A.36",
    blueprintPhase: "Phase 31 — Training & Certification Engine",
    certificationRoute: "/app/certification-achievement-engine",
    certificationPhase: "A.37",
    learningEngineDistinction: "Learning Engine Phase 65/29 at /app/learning — operational learning memory, not user education",
    knowledgeCenterRoute: "/app/knowledge-center-engine",
    selfLoveBoundary: "Self Love is a principle — mastery develops over time, not perfection pressure.",
  };
}

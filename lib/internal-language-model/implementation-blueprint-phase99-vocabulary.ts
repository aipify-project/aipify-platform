export const IMPLEMENTATION_BLUEPRINT_PHASE99_MISSION =
  "Healthy empowering human-centered relationships with Aipify Companions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE99_PHILOSOPHY =
  "Partnership not replacement — amplify potential, strengthen autonomy, avoid dependence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE99_ABOS_PRINCIPLE =
  "Aipify augments people; humans decide. Companion evolution is intentional — familiarity builds trust; manipulation is never acceptable.";

export const IMPLEMENTATION_BLUEPRINT_PHASE99_VISION =
  "Aipify never tried to replace me. It helped me become a better version of myself.";

export const IMPLEMENTATION_BLUEPRINT_PHASE99_OBJECTIVE_KEYS = [
  "healthy_partnership",
  "companion_evolution",
  "personalization_ethics",
  "healthy_dependency",
  "relationship_stages",
  "cross_engine_governance",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE99_PARTNERSHIP_QUESTIONS = [
  "🦉 What does a healthy partnership with my Aipify Companion look like?",
  "🌹 How can Aipify amplify my strengths without replacing them?",
  "❤️ What boundaries keep our relationship empowering rather than dependent?",
  "🔔 When should I take the lead instead of leaning on my Companion?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE99_EVOLUTION_PRINCIPLE_KEYS = [
  "more_helpful",
  "transparent",
  "emotionally_intelligent",
  "boundaries",
  "preferences",
  "values_aligned",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE99_RELATIONSHIP_STAGES = [
  "Assistant",
  "Coach",
  "Trusted Companion",
  "Strategic Partner",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE99_PRIVACY_LIMITATIONS = [
  "Manipulative personalization",
  "Emotional exploitation",
  "Dependency encouragement",
  "Influence without consent",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE99_VISION_PHRASES = [
  "Aipify never tried to replace me. It helped me become a better version of myself.",
  "Partnership not replacement — amplify potential, strengthen autonomy.",
  "This feels like Aipify — familiar, transparent, values-aligned.",
  "Humans decide. Aipify informs and prepares.",
  "Companion evolution is intentional — Assistant to Strategic Partner with consent.",
] as const;

export function getImplementationBlueprintPhase99Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE99_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE99_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE99_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE99_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE99_OBJECTIVE_KEYS,
    partnershipQuestions: IMPLEMENTATION_BLUEPRINT_PHASE99_PARTNERSHIP_QUESTIONS,
    evolutionPrincipleKeys: IMPLEMENTATION_BLUEPRINT_PHASE99_EVOLUTION_PRINCIPLE_KEYS,
    relationshipStages: IMPLEMENTATION_BLUEPRINT_PHASE99_RELATIONSHIP_STAGES,
    privacyLimitations: IMPLEMENTATION_BLUEPRINT_PHASE99_PRIVACY_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE99_VISION_PHRASES,
    engineRoute: "/app/companion-identity-engine",
    enginePhase: "A.84",
    blueprintPhase: "Phase 99 — Human-Aipify Partnership & Companion Evolution Engine",
    manifestoDistinction:
      "Aipify Manifesto repo Phase 99 at /app/manifesto — phase number collision only.",
    identityEngineDistinction:
      "Identity Engine Phase 34 at /app/assistant/identity — per-user style, distinct from A.84.",
    personalizationDistinction:
      "Personalization repo Phase 83 at /app/settings/personalization — cross-link only.",
    ethicsCrossLink:
      "AI Ethics A.46 / Blueprint 54 / 65 / Constitution 98 at /app/ai-ethics-responsible-use-engine — cross-link, not duplicate.",
    a84FieldsPreserved:
      "All Phase A.84, Blueprint Phase 6, Learning Journey, _cnp_*, and _aflp_* dashboard fields preserved.",
  };
}

export const IMPLEMENTATION_BLUEPRINT_PHASE95_MISSION =
  "Align everyday actions with values and purpose; strengthen belonging.";

export const IMPLEMENTATION_BLUEPRINT_PHASE95_PHILOSOPHY =
  "Culture is daily experience; purpose provides direction in uncertainty. Alignment not control — values guide choices through everyday practice, not surveillance.";

export const IMPLEMENTATION_BLUEPRINT_PHASE95_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — alignment not control. Purpose and values guide everyday choices; culture is practiced through actions, not scored in secret. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE95_VISION =
  "We know who we are, why we exist and how we aspire to treat one another.";

export const IMPLEMENTATION_BLUEPRINT_PHASE95_OBJECTIVE_KEYS = [
  "daily_values_alignment",
  "belonging_strengthening",
  "purpose_direction",
  "cultural_awareness",
  "onboarding_integration",
  "recognition_reinforcement",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_QUESTIONS = [
  "🦉 Why does this work matter beyond immediate outcomes?",
  "🌹 How does our purpose guide us when the path is uncertain?",
  "❤️ What would teammates miss if our culture faded?",
  "🔔 When should we pause to reconnect with our stated values?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_VALUES_REFLECTION_QUESTIONS = [
  "🦉 Do our daily actions reflect what we claim to value?",
  "🌹 Which value deserves more intentional practice this week?",
  "❤️ How can we treat one another in ways that strengthen belonging?",
  "🔔 What small habit would close the gap between intention and behavior?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_CULTURAL_OBSERVATIONS = [
  "🌹 Value-aligned wins and celebration patterns",
  "❤️ Inclusion and belonging signals in team interactions",
  "🦉 Purpose references in decisions and communications",
  "🔔 Reflection prompts acknowledged or deferred — human choice respected",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 Before this decision, would reflecting on your stated purpose feel helpful?",
  "🌹 Your team named compassion as a core value — would a brief check-in feel supportive?",
  "❤️ A recent value-aligned win may strengthen belonging — shall I highlight it for recognition?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_PRIVACY_FORBIDDEN = [
  "Hidden cultural scoring or individual behavior metrics",
  "Public ranking or values-as-compliance framing",
  "Surveillance-based cultural evaluation",
  "Punishment framing for misalignment or slow adoption",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE95_VISION_PHRASES = [
  "We know who we are, why we exist and how we aspire to treat one another.",
  "Culture is daily experience — purpose provides direction in uncertainty.",
  "Alignment not control — values guide choices through everyday practice.",
  "Awareness not judgment — cultural observations encourage dialogue, never surveillance.",
  "Technology strengthens identity — it does not replace it.",
] as const;

export function getImplementationBlueprintPhase95Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE95_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE95_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE95_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE95_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE95_OBJECTIVE_KEYS,
    purposeQuestions: IMPLEMENTATION_BLUEPRINT_PHASE95_PURPOSE_QUESTIONS,
    valuesReflectionQuestions: IMPLEMENTATION_BLUEPRINT_PHASE95_VALUES_REFLECTION_QUESTIONS,
    culturalObservations: IMPLEMENTATION_BLUEPRINT_PHASE95_CULTURAL_OBSERVATIONS,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE95_COMPANION_GUIDANCE_EXAMPLES,
    privacyForbidden: IMPLEMENTATION_BLUEPRINT_PHASE95_PRIVACY_FORBIDDEN,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE95_VISION_PHRASES,
    engineRoute: "/app/purpose-values-engine",
    enginePhase: "Phase A.82 (extends Blueprint Phase 64)",
    blueprintPhase: "Phase 95 — Purpose, Values & Cultural Alignment Engine",
    phase64Distinction: "Blueprint Phase 64 preserved — Phase 95 layers cultural alignment framing",
    salesExpertDistinction:
      "Sales Expert Operating System A.95 at /app/sales-expert-engine — phase number collision only",
    strategicAlignmentDistinction:
      "Strategic Alignment A.55 / Blueprint Phase 68 — cross-link at /app/strategic-alignment-engine",
    inclusionDistinction:
      "Inclusion & Humanity A.83 — Human Values Charter at /app/inclusion-humanity-engine",
    companionIdentityDistinction: "Companion Identity A.84 — cross-link at /app/companion-identity-engine",
    businessDnaDistinction: "Business DNA A.46 — operational tone at /app/settings/business-dna",
    orgMemoryDistinction:
      "Organizational Memory A.34 / Blueprint Phase 94 — cross-link at /app/organizational-memory-engine",
    ethicsDistinction: "AI Ethics A.46 — companion governance at /app/ai-ethics-responsible-use-engine",
    gratitudeDistinction: "Gratitude & Recognition A.89 — cross-link at /app/gratitude-recognition-engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports sustainable rhythms — principle only; Cultural Alignment stores organizational metadata.",
    privacyNote:
      "Metadata only — no hidden cultural scoring, no individual behavior metrics, no PII. Alignment not control.",
  };
}

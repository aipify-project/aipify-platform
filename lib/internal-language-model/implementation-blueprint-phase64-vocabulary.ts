export const IMPLEMENTATION_BLUEPRINT_PHASE64_MISSION =
  "Clarify, preserve, and actively live purpose and values in daily operations and strategic decisions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE64_PHILOSOPHY =
  "Values are meaningful only when they influence behavior; purpose guides priorities; culture is practiced intentionally — practical, not decorative.";

export const IMPLEMENTATION_BLUEPRINT_PHASE64_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — purpose provides direction; values provide boundaries; together they shape choices over time. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE64_OBJECTIVE_KEYS = [
  "purpose_clarification",
  "values_alignment",
  "cultural_reinforcement",
  "leadership_reflection",
  "organizational_storytelling",
  "decision_alignment",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_DISCOVERY_EXAMPLES = [
  "🦉 Why do we exist beyond financial outcomes?",
  "🌹 What positive impact do we seek to create?",
  "❤️ What would customers miss if we disappeared?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE64_VALUES_IN_ACTION = [
  "Respect → listening, feedback, supporting colleagues",
  "Innovation → experimentation, sharing ideas, learning from outcomes",
  "Integrity → honest commitments, explain trade-offs openly",
  "Compassion → recognize effort, sustainable pacing, include diverse perspectives",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE64_DECISION_ALIGNMENT_EXAMPLES = [
  "🦉 Does this decision align with your stated values?",
  "🌹 Which principles should influence this discussion?",
  "🦉 What trade-offs matter most here?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE64_VISION_PHRASES = [
  "Preserve humanity as organizations grow — we remember why we started.",
  "Purpose provides direction; values provide boundaries — together they shape choices over time.",
  "The work you do contributes to the purpose your organization has chosen.",
  "Technology strengthens identity — it does not replace it.",
  "Culture practiced intentionally — values influence behavior, not decoratively.",
] as const;

export function getImplementationBlueprintPhase64Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE64_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE64_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE64_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE64_OBJECTIVE_KEYS,
    purposeDiscoveryExamples: IMPLEMENTATION_BLUEPRINT_PHASE64_PURPOSE_DISCOVERY_EXAMPLES,
    valuesInAction: IMPLEMENTATION_BLUEPRINT_PHASE64_VALUES_IN_ACTION,
    decisionAlignmentExamples: IMPLEMENTATION_BLUEPRINT_PHASE64_DECISION_ALIGNMENT_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE64_VISION_PHRASES,
    engineRoute: "/app/purpose-values-engine",
    enginePhase: "Phase A.82",
    blueprintPhase: "Phase 64 — Purpose & Values Engine",
    brandIdentityDistinction:
      "Brand Identity & Personhood Standard — Aipify product naming, not tenant purpose/values",
    businessDnaDistinction: "Business DNA Engine — tenant products, tone, templates at /app/settings/business-dna",
    strategicAlignmentDistinction: "Strategic Alignment A.55 — cross-link at /app/strategic-alignment-engine",
    ethicsDistinction: "AI Ethics A.46 — companion governance at /app/ai-ethics-responsible-use-engine",
    inclusionDistinction:
      "Inclusion & Humanity A.83 — Human Values Charter vs tenant purpose/values at /app/inclusion-humanity-engine",
    impactDistinction: "Impact Engine A.85 — outcome measurement at /app/impact-engine",
    growthDistinction: "Growth & Evolution A.81 — cross-link at /app/growth-evolution-engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports reflection and sustainable rhythms — principle only; Purpose & Values stores organizational metadata.",
    privacyNote: "Metadata only — stated values, alignment signal summaries, reflection prompts. No PII or raw operational content.",
  };
}

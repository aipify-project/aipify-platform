export const IMPLEMENTATION_BLUEPRINT_PHASE80_MISSION =
  "Cultivate curiosity and strategic awareness by identifying opportunities worthy of exploration and thoughtful consideration.";

export const IMPLEMENTATION_BLUEPRINT_PHASE80_PHILOSOPHY =
  "Opportunity rarely announces itself — it emerges through observation, experimentation, and willingness to explore. The objective is to recognize the right opportunities, not chase every one.";

export const IMPLEMENTATION_BLUEPRINT_PHASE80_ABOS_PRINCIPLE =
  "Open to possibility while grounded in purpose and values — curiosity guided by wisdom. Aipify informs and prepares; humans decide what to pursue.";

export const IMPLEMENTATION_BLUEPRINT_PHASE80_OBJECTIVE_KEYS = [
  "opportunity_identification",
  "prioritization",
  "capability_alignment",
  "cross_functional_exploration",
  "strategic_experimentation",
  "responsible_innovation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE80_OPPORTUNITY_QUESTIONS = [
  "Which opportunities may deserve more attention than they currently receive?",
  "Which organizational strengths could support a new direction?",
  "What unmet customer needs might open a thoughtful exploration path?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE80_COMPANION_EXAMPLES = [
  "🦉 This opportunity may align with existing strengths — would mapping capability patterns help your review?",
  "🌹 Several teams could contribute perspectives on this exploration — would a cross-functional summary help?",
  "🔔 Additional exploration may clarify whether this opportunity deserves deeper consideration — shall I prepare a metadata summary?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE80_LIMITATIONS = [
  "No FOMO or missed-opportunity pressure",
  "No excessive chasing of every signal",
  "No possibilities presented as guarantees",
  "Exploration not urgency",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE80_VISION_PHRASES = [
  "This opportunity was already within reach. We simply needed to recognize it.",
  "Awareness of overlooked possibilities — curiosity guided by wisdom.",
  "Recognize the right opportunities — not chase every one.",
  "Exploration not urgency — thoughtful consideration before pursuit.",
  "Not every opportunity must be pursued immediately.",
] as const;

export function getImplementationBlueprintPhase80Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE80_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE80_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE80_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE80_OBJECTIVE_KEYS,
    opportunityQuestions: IMPLEMENTATION_BLUEPRINT_PHASE80_OPPORTUNITY_QUESTIONS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE80_COMPANION_EXAMPLES,
    limitations: IMPLEMENTATION_BLUEPRINT_PHASE80_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE80_VISION_PHRASES,
    engineRoute: "/app/curiosity-discovery-engine",
    enginePhase: "Phase A.87",
    blueprintPhase: "Phase 80 — Opportunity Exploration Engine",
    continuityRoute: "/app/continuity",
    continuityDistinction:
      "Continuity repo Phase 80 / Blueprint Phase 73 — phase number collision, distinct surface",
    strategyRoute: "/app/strategy",
    strategyDistinction: "Legacy Strategic Intelligence & Opportunity Phase 81 — cross-link only",
    growthRoute: "/app/growth-evolution-engine",
    growthDistinction: "Growth & Evolution A.81 emerging_opportunity signals — cross-link",
    innovationLabRoute: "/app/innovation-lab",
    innovationLabDistinction: "Innovation Lab Phase 96 / Blueprint 38 — controlled experiments",
    simulationRoute: "/app/simulations",
    simulationDistinction: "Simulation Decision Lab Phase 78 — predicts, does not explore",
    strategicIntelligenceRoute: "/app/strategic-intelligence-foundation-engine",
    strategicIntelligenceDistinction: "Strategic Intelligence A.31 / Blueprint 79 — strategic awareness",
    wonderRoute: "/app/wonder-engine",
    wonderDistinction: "Wonder Engine A.88 — amazement, distinct surface",
    wisdomRoute: "/app/wisdom-engine",
    wisdomDistinction: "Wisdom Engine A.93 — experience synthesis",
    salesExpertRoute: "/app/sales-expert-engine",
    knowledgeCenterRoute: "/app/knowledge-center-engine",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "Not every opportunity must be pursued immediately.",
    selfLoveBoundary:
      "Self Love supports patience and sustainable ambition — principle only; Opportunity Exploration stores metadata.",
    explorationNote: "Exploration not urgency — possibilities are not guarantees.",
    helperPrefix: "_oebp_*",
    engineHelperPrefix: "_cde_* (A.87) — do not collide",
  };
}

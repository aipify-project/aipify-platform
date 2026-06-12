export const IMPLEMENTATION_BLUEPRINT_PHASE68_MISSION =
  "Connect individuals, teams, and leadership to common priorities, expectations, and objectives.";

export const IMPLEMENTATION_BLUEPRINT_PHASE68_PHILOSOPHY =
  "Alignment does not mean everyone doing the same things — people must understand how their contributions support the mission. Clarity strengthens collaboration.";

export const IMPLEMENTATION_BLUEPRINT_PHASE68_ABOS_PRINCIPLE =
  "Extraordinary organizations emerge when people move together toward meaningful goals. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE68_OBJECTIVE_KEYS = [
  "strategic_alignment",
  "goal_visibility",
  "cross_functional_awareness",
  "shared_understanding",
  "priority_communication",
  "organizational_coherence",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE68_ALIGNMENT_QUESTIONS = [
  "🦉 Do teams understand current strategic priorities?",
  "🌹 Can individuals explain how their work supports the mission?",
  "🔔 Are conflicting priorities creating friction across teams?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE68_CASCADING_LEVELS = [
  "Vision",
  "Strategic Objectives",
  "Department Priorities",
  "Team Goals",
  "Individual Contributions",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE68_COMPANION_EXAMPLES = [
  "🦉 Several teams share objectives in this area — would a brief alignment review help?",
  "🌹 This initiative appears connected to strategic priorities — shall I summarize the alignment links?",
  "🔔 Clarifying expectations across teams often improves collaboration — would context help?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE68_VISION_PHRASES = [
  "I understand how my work contributes to something larger.",
  "Clarity, connection, and shared purpose strengthen collaboration.",
  "Alignment is not sameness — it is shared understanding of what matters.",
  "Extraordinary organizations emerge when people move together toward meaningful goals.",
  "People often thrive when they understand why their work matters.",
] as const;

export function getImplementationBlueprintPhase68Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE68_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE68_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE68_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE68_OBJECTIVE_KEYS,
    alignmentQuestions: IMPLEMENTATION_BLUEPRINT_PHASE68_ALIGNMENT_QUESTIONS,
    cascadingLevels: IMPLEMENTATION_BLUEPRINT_PHASE68_CASCADING_LEVELS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE68_COMPANION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE68_VISION_PHRASES,
    engineRoute: "/app/strategic-alignment-engine",
    enginePhase: "Phase A.55",
    blueprintPhase: "Phase 68 — Organizational Alignment Engine",
    purposeValuesRoute: "/app/purpose-values-engine",
    purposeValuesDistinction: "Purpose & Values A.82 — mission and values context, not objective alignment register",
    goalsOkrRoute: "/app/goals-okr-engine",
    goalsOkrDistinction: "Goals & OKR A.65 — OKR hierarchy for cascading, not duplicate objective storage",
    executiveInsightsRoute: "/app/executive-insights-engine",
    executiveInsightsDistinction: "Executive Insights A.35 and Blueprint Phases 13/59/66 — executive reporting, distinct",
    legacyStrategyRoute: "/app/strategy",
    legacyStrategyDistinction: "Legacy Strategy Phase 81 — distinct from A.55 alignment engine",
    strategicIntelligenceRoute: "/app/strategic-intelligence-foundation-engine",
    strategicIntelligenceDistinction: "Strategic Intelligence Foundation A.31 — signal detection, distinct",
    orgDecisionSupportRoute: "/app/organizational-decision-support-engine",
    orgDecisionSupportDistinction: "Organizational Decision Support A.54 — strategic decisions, cross-link only",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "People often thrive when they understand why their work matters.",
    selfLoveBoundary:
      "Self Love supports clarity and sustainable expectations — principle only; Organizational Alignment stores metadata.",
    noAutoReprioritizeNote:
      "Aipify surfaces alignment gaps — humans define objectives and resolve priority conflicts.",
  };
}

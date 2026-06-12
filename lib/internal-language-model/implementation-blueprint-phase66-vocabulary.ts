export const IMPLEMENTATION_BLUEPRINT_PHASE66_MISSION =
  "Trusted executive companion — clarity, preparation, strategic awareness; preserve human judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE66_PHILOSOPHY =
  "Leadership creates direction, enables people, and decides under uncertainty — Aipify strengthens leaders, does not replace them.";

export const IMPLEMENTATION_BLUEPRINT_PHASE66_ABOS_PRINCIPLE =
  "Leadership means better questions, listening, and environments where people succeed — not having all the answers.";

export const IMPLEMENTATION_BLUEPRINT_PHASE66_OBJECTIVE_KEYS = [
  "executive_preparation",
  "leadership_reflection",
  "strategic_awareness",
  "priority_clarification",
  "organizational_visibility",
  "decision_readiness",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE66_BRIEFING_EXAMPLES = [
  "📈 Here are your strategic priorities and emerging opportunities for today — prepared when you are ready.",
  "🦉 Three milestones progressed this week — would you like a summary before your leadership session?",
  "🔔 Several positive developments surfaced across teams — available for your briefing when convenient.",
  "🌹 Your briefing includes progress recognition — leadership is a journey rather than a destination.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE66_REFLECTION_EXAMPLES = [
  "🦉 Which long-term priorities deserve your attention this month — and which can wait without guilt?",
  "🌹 What progress deserves recognition — for your team and for your own leadership journey?",
  "❤️ Where does your team need support most — and what would intentional leadership look like there?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE66_VISION_PHRASES = [
  "Navigate complexity with wisdom, humility, and confidence.",
  "Aipify helped me become a better leader.",
  "Leadership creates direction — Aipify strengthens, never replaces.",
  "Better questions and listening beat having all the answers.",
  "Leadership is a journey rather than a destination.",
] as const;

export function getImplementationBlueprintPhase66Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE66_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE66_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE66_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE66_OBJECTIVE_KEYS,
    briefingExamples: IMPLEMENTATION_BLUEPRINT_PHASE66_BRIEFING_EXAMPLES,
    reflectionExamples: IMPLEMENTATION_BLUEPRINT_PHASE66_REFLECTION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE66_VISION_PHRASES,
    engineRoute: "/app/executive-insights-engine",
    enginePhase: "A.35",
    blueprintPhase: "Phase 66 — Executive Companion Engine",
    phase13Blueprint: "Phase 13 — Executive Insights Engine Foundation",
    phase59Blueprint: "Phase 59 — Strategic Thinking Engine",
    predictiveInsightsDistinction:
      "Predictive Insights Engine Phase A.66 — forward-looking predictions at /app/predictive-insights-engine (repo phase number collision with ABOS blueprint 66)",
    commandCenterRoute: "/app/command-center",
    briefingRoute: "/app/briefing",
    personalDseRoute: "/app/assistant/decisions",
    orgDecisionSupportRoute: "/app/organizational-decision-support-engine",
    platformExecutiveDistinction: "Platform Admin /platform/executive — global governance only",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "Leadership is a journey rather than a destination.",
    selfLoveBoundary:
      "Self Love supports sustainable pacing and perspective — principle only; Executive Companion stores metadata scaffolds.",
    noAutoExecutionNote: "Aipify strengthens leaders — humans decide; no automated leadership execution.",
  };
}

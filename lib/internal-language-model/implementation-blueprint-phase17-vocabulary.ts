export const IMPLEMENTATION_BLUEPRINT_PHASE17_MISSION =
  "Surface emerging trends, opportunities, risks, and strategic considerations from operational metadata — humans decide strategy.";

export const IMPLEMENTATION_BLUEPRINT_PHASE17_PHILOSOPHY =
  "Operations run today; strategy helps evolve — Aipify supports both with proactive signal detection and explainable metadata.";

export const IMPLEMENTATION_BLUEPRINT_PHASE17_ABOS_PRINCIPLE =
  "Strategy evolves from operations — explainable signals help leaders plan ahead without noise.";

export const IMPLEMENTATION_BLUEPRINT_PHASE17_INSIGHT_CATEGORIES = [
  "growth_opportunities",
  "operational_risks",
  "knowledge_risks",
  "relationship_insights",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE17_VISION_PHRASES = [
  "Operations run today; strategy helps evolve — Aipify supports both.",
  "Explainable strategic signals build trust — every insight shows its source and assumption.",
  "Humans decide strategy — Aipify informs, prepares, and recommends.",
  "Sustainable growth respects people, pacing, and long-term health — not growth-at-all-costs.",
  "Proactive planning from operational metadata — not noise, not autonomous execution.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE17_COMPANION_EXAMPLES = [
  "🔔 Two high-impact strategic insights are ready for review — steady signals worth leadership attention.",
  "🌹 Your team resolved support strain this week — sustainable pacing supports stronger strategic decisions.",
  "🦉 Before the quarterly planning session, here are emerging operational risks and growth opportunities — take a moment to reflect.",
] as const;

export function getImplementationBlueprintPhase17Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE17_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE17_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE17_ABOS_PRINCIPLE,
    insightCategories: IMPLEMENTATION_BLUEPRINT_PHASE17_INSIGHT_CATEGORIES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE17_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE17_COMPANION_EXAMPLES,
    engineRoute: "/app/strategic-intelligence-foundation-engine",
    enginePhase: "A.31",
    blueprintPhase: "Phase 17 — Strategic Intelligence Engine Foundation",
    legacyStrategyDistinction:
      "Legacy Strategic Intelligence & Opportunity Phase 81 at /app/strategy — A.31 is canonical ABOS Strategic Intelligence",
    executiveInsightsDistinction:
      "Executive Insights A.35 — executive summaries, distinct from strategic signal scanning",
    predictiveDistinction: "Predictive Insights A.66 — forward predictions, distinct from signal detection",
    wisdomDistinction: "Wisdom Engine A.93 — experience synthesis, distinct from operational signal detection",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
    metadataOnlyNote: "Insights use metadata only — no customer email, chat, orders, or PII",
  };
}

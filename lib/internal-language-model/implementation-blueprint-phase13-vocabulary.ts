export const IMPLEMENTATION_BLUEPRINT_PHASE13_MISSION =
  "Clear executive guidance from organizational data — healthier decisions, stronger operations, sustainable growth.";

export const IMPLEMENTATION_BLUEPRINT_PHASE13_PHILOSOPHY =
  "Executives need clarity, not more dashboards — surface what matters with explainable metadata summaries.";

export const IMPLEMENTATION_BLUEPRINT_PHASE13_ABOS_PRINCIPLE =
  "Clarity beats noise — explainable executive insights help leaders decide with confidence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE13_INSIGHT_CATEGORIES = [
  "operational",
  "support",
  "knowledge",
  "companion",
  "strategic",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE13_VISION_PHRASES = [
  "Clarity beats more dashboards — executives need what matters, not everything at once.",
  "Explainable insights build trust — every signal shows its source and assumption.",
  "Humans decide — Aipify informs, prepares, and recommends.",
  "Sustainable growth comes from healthy operations, supported teams, and transparent priorities.",
  "Since Last Time — pick up where you left off with counts and trends, not noise.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE13_COMPANION_EXAMPLES = [
  "🔔 Your team resolved 12 support cases since your last visit — steady progress worth celebrating.",
  "🌹 Three teammates completed high-priority tasks this week — would you like to send recognition?",
  "🦉 Before the quarterly review, here is what changed in operations health — take a moment to reflect.",
] as const;

export function getImplementationBlueprintPhase13Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE13_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE13_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE13_ABOS_PRINCIPLE,
    insightCategories: IMPLEMENTATION_BLUEPRINT_PHASE13_INSIGHT_CATEGORIES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE13_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE13_COMPANION_EXAMPLES,
    engineRoute: "/app/executive-insights-engine",
    enginePhase: "A.35",
    blueprintPhase: "Phase 13 — Executive Insights Engine Foundation",
    executiveBriefingDistinction:
      "Customer /app/executive briefings — distinct from Executive Insights Engine A.35",
    platformExecutiveDistinction:
      "Platform Admin /platform/executive — global governance only, never mix into Customer App",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
    sinceLastTimeNote:
      "Counts only — previous login, auth.last_sign_in_at, presence engagement, or 7-day fallback",
  };
}

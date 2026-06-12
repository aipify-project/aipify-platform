export const IMPLEMENTATION_BLUEPRINT_PHASE101_MISSION =
  "Commercial outcomes through opportunity discovery, product intelligence, and market awareness.";

export const IMPLEMENTATION_BLUEPRINT_PHASE101_PHILOSOPHY =
  "Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs. Awareness not hype — trends inform, humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE101_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — wisdom not speculation. Aipify Commerce Companion informs and prepares product research, trend awareness, margin analysis, and supplier evaluation; humans approve every import and commercial decision.";

export const IMPLEMENTATION_BLUEPRINT_PHASE101_VISION =
  "We understand our commercial opportunities more clearly than ever before.";

export const IMPLEMENTATION_BLUEPRINT_PHASE101_OBJECTIVE_KEYS = [
  "trend_intelligence",
  "product_opportunity_discovery",
  "margin_intelligence",
  "supplier_insights",
  "store_fit_analysis",
  "commerce_strategy_connection",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_TREND_INTELLIGENCE = [
  "🦉 What trend signals mean for your store — context before action",
  "🌹 Seasonal and audience-fit opportunities — aligned with strengths",
  "🔔 When to pause before chasing popularity — human approval always",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_SUPPLIER_INSIGHTS = [
  "🦉 Delivery, defect rate, and price stability patterns",
  "🌹 Trusted suppliers for testing vs high-risk alternatives",
  "🔔 When supplier risk should block impulsive product tests",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 This product is trending — would a margin and store-fit summary help before you decide?",
  "🌹 Store fit looks strong for your active lifestyle catalog — shall Aipify prepare a test-product checklist?",
  "🔔 Supplier reliability signals are mixed — would pausing for an alternative evaluation feel wise?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_LIMITATION_FORBIDDEN = [
  "Guaranteed success promises or hype-driven urgency framing",
  "Impulsive product decisions driven by trend popularity alone",
  "Popularity-only recommendations that ignore store fit, margin thresholds, or supplier risk",
  "Ignoring stated purpose, values, or long-term customer trust for short-term trend chasing",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_SELF_LOVE_QUOTES = [
  "Patience and disciplined decisions beat impulsive product launches — sustainable commerce grows one thoughtful choice at a time.",
  "Not every trending product deserves your energy — rest is part of sustainable business growth.",
  "Margin clarity before scale protects wellbeing — rushed imports create avoidable stress.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE101_VISION_PHRASES = [
  "We understand our commercial opportunities more clearly than ever before.",
  "Wisdom guides commerce — sustainable opportunities aligned with strengths and customer needs.",
  "Awareness not hype — trends inform, humans decide.",
  "Aipify Commerce Companion informs and prepares — humans approve every import.",
] as const;

export function getImplementationBlueprintPhase101Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE101_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE101_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE101_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE101_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE101_OBJECTIVE_KEYS,
    trendIntelligence: IMPLEMENTATION_BLUEPRINT_PHASE101_TREND_INTELLIGENCE,
    supplierInsights: IMPLEMENTATION_BLUEPRINT_PHASE101_SUPPLIER_INSIGHTS,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE101_COMPANION_GUIDANCE_EXAMPLES,
    limitationForbidden: IMPLEMENTATION_BLUEPRINT_PHASE101_LIMITATION_FORBIDDEN,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE101_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE101_VISION_PHRASES,
    engineRoute: "/app/commerce-intelligence",
    enginePhase: "Repo Phase 101 Commerce Intelligence Engine",
    blueprintPhase: "Phase 101 — Commerce Intelligence Engine",
    commercePerformanceDistinction:
      "Commerce Performance & Profit repo Phase 104 at /app/commerce-performance — profit/operations cross-link",
    revenueIntelligenceDistinction:
      "Revenue Intelligence Blueprint Phase 39 at /app/commercial — subscription MRR/ARR only",
    strategicIntelligenceDistinction:
      "Strategic Intelligence A.31 at /app/strategic-intelligence-foundation-engine — cross-link",
    curiosityDistinction:
      "Curiosity & Discovery A.87 / Phase 80 at /app/curiosity-discovery-engine — opportunity exploration",
    companionName: "Commerce Companion",
    notGenericAi: "not generic AI commerce bot",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports wellbeing rhythms — principle only; Commerce Intelligence stores product metadata.",
    privacyNote:
      "Metadata only — no guaranteed success promises, no auto-import without approval. Humans decide; Aipify Commerce Companion informs and prepares.",
  };
}

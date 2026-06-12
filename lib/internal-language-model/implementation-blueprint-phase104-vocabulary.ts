export const IMPLEMENTATION_BLUEPRINT_PHASE104_MISSION =
  "Transform financial and operational data into meaningful profitability insights.";

export const IMPLEMENTATION_BLUEPRINT_PHASE104_PHILOSOPHY =
  "More sales ≠ better business — balance growth with profitability; wisdom guides ambition. Revenue measures activity; profitability reflects sustainability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE104_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — sustainability not extraction. Aipify Commerce Companion informs and prepares profit visibility, product performance, cost awareness, and strategic prioritization; humans retain financial oversight and commercial decisions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE104_VISION =
  "We finally understand what truly drives profitability in our business.";

export const IMPLEMENTATION_BLUEPRINT_PHASE104_OBJECTIVE_KEYS = [
  "profit_visibility",
  "product_performance",
  "revenue_intelligence",
  "cost_awareness",
  "strategic_prioritization",
  "sustainable_growth",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_PROFIT_INTELLIGENCE = [
  "🦉 Margin observations and cost pressure signals — context before scaling",
  "🌹 Products and categories with sustainable profit contribution",
  "🔔 When returns, ad spend, or weak margins need human review",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_PRICING_INSIGHTS = [
  "🦉 When pricing may not cover landed cost and ad spend",
  "🌹 Categories where thoughtful pricing supports sustainable margins",
  "🔔 When discounting or ad scaling compresses net profit",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 Net margin dipped on ad-heavy SKUs — would a cost breakdown summary help before you adjust spend?",
  "🌹 Fitness accessories show strong profit contribution — shall Aipify prepare a category focus brief?",
  "🔔 Return rates rose in electronics — would reviewing product messaging and supplier quality feel wise?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_LIMITATION_FORBIDDEN = [
  "Growth-at-any-cost framing that ignores margin or customer experience",
  "Short-term-only optimization that sacrifices long-term profitability",
  "Ignoring customer experience for volume or conversion metrics alone",
  "Treating metrics as the sole definition of business success",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_SELF_LOVE_QUOTES = [
  "Profitability clarity before scale protects wellbeing — rushed growth creates avoidable operational stress.",
  "Not every revenue spike deserves immediate reinvestment — rest and review are part of sustainable commerce.",
  "Understanding what truly drives profit is calmer than chasing every metric — wisdom guides ambition.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE104_VISION_PHRASES = [
  "We finally understand what truly drives profitability in our business.",
  "More sales ≠ better business — balance growth with profitability.",
  "Revenue measures activity; profitability reflects sustainability.",
  "Aipify Commerce Companion informs and prepares — does not replace professional financial expertise.",
] as const;

export function getImplementationBlueprintPhase104Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE104_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE104_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE104_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE104_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE104_OBJECTIVE_KEYS,
    profitIntelligence: IMPLEMENTATION_BLUEPRINT_PHASE104_PROFIT_INTELLIGENCE,
    pricingInsights: IMPLEMENTATION_BLUEPRINT_PHASE104_PRICING_INSIGHTS,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE104_COMPANION_GUIDANCE_EXAMPLES,
    limitationForbidden: IMPLEMENTATION_BLUEPRINT_PHASE104_LIMITATION_FORBIDDEN,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE104_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE104_VISION_PHRASES,
    engineRoute: "/app/commerce-performance",
    enginePhase: "Repo Phase 104 Commerce Performance & Profit Engine",
    blueprintPhase: "Phase 104 — Commerce Performance & Profit Engine",
    commerceIntelligenceDistinction:
      "Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence — discovery/opportunity",
    revenueIntelligenceDistinction:
      "Revenue Intelligence Blueprint Phase 39 at /app/commercial — subscription MRR/ARR only, NOT product profit",
    productAutomationDistinction: "Product Automation Phase 102 at /app/product-automation — catalog automation cross-link",
    dropshippingDistinction:
      "Dropshipping Operations Phase 103 at /app/dropshipping-operations — operational margin/supplier context",
    fikenDistinction: "Fiken = accounting source of truth; Aipify = operational intelligence layer",
  };
}

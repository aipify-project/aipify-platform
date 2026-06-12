export const IMPLEMENTATION_BLUEPRINT_PHASE109_MISSION =
  "Expand confidently while preserving identity and reducing operational complexity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE109_PHILOSOPHY =
  "Global growth without becoming generic — authentic adaptation, intentional expansion.";

export const IMPLEMENTATION_BLUEPRINT_PHASE109_ABOS_PRINCIPLE =
  "Humans accountable — Aipify Expansion Companion informs and prepares market readiness, localization, cultural intelligence, and expansion recommendations. auto_market_entry_disabled remains default true.";

export const IMPLEMENTATION_BLUEPRINT_PHASE109_VISION =
  "We can expand internationally without losing what makes us unique.";

export const IMPLEMENTATION_BLUEPRINT_PHASE109_OBJECTIVE_KEYS = [
  "market_readiness",
  "localization_support",
  "cultural_intelligence",
  "multi_currency",
  "regional_commerce",
  "stewardship_expansion",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE109_COMPANION_GUIDANCE = [
  "🦉 Sweden localization coverage is improving — would a terminology review checklist help before your next campaign?",
  "🌹 Denmark readiness is progressing — shall I prepare a preparation summary rather than rushing launch?",
  "🔔 Germany regulatory scaffold flagged counsel review — would linking your legal checklist feel helpful?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE109_SELF_LOVE_QUOTES = [
  "International growth is a journey — not every market needs to launch this quarter.",
  "Curiosity about new markets can coexist with patience for proven ones.",
  "Sustainable expansion protects wellbeing — rushed market entry creates avoidable stress.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE109_VISION_PHRASES = [
  "We can expand internationally without losing what makes us unique.",
  "Global growth without becoming generic — authentic adaptation.",
  "Stewardship not unchecked expansion — humans decide market entry.",
  "Aipify Expansion Companion informs and prepares — humans accountable.",
] as const;

export function getImplementationBlueprintPhase109Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE109_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE109_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE109_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE109_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE109_OBJECTIVE_KEYS,
    companionGuidance: IMPLEMENTATION_BLUEPRINT_PHASE109_COMPANION_GUIDANCE,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE109_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE109_VISION_PHRASES,
    engineRoute: "/app/global-commerce-expansion",
    enginePhase: "Repo Phase 109",
    blueprintPhase: "Phase 109 — Global Commerce Expansion Engine",
    companionName: "Expansion Companion",
    notLabel: "AI expansion bot",
    globalExpansionDistinction:
      "Global Expansion & Localization repo Phase 95 at /app/global-expansion — platform i18n, NOT commerce market entry",
    multiStoreDistinction: "Multi-Store Orchestration Phase 105 at /app/multi-store — portfolio cross-link",
    productAutomationDistinction:
      "Product Automation Phase 102 at /app/product-automation — catalog translation workflow",
    commerceIntelligenceDistinction:
      "Commerce Intelligence Phase 101 at /app/commerce-intelligence — market opportunity signals",
    commercePerformanceDistinction:
      "Commerce Performance Phase 104 at /app/commerce-performance — regional profitability",
    growthPartnerDistinction: "Growth Partner Phase 107 at /app/partners — regional implementation partners",
    approvalsRoute: "/app/approvals",
    autoMarketEntryNote: "auto_market_entry_disabled default true — no automatic market launch",
    regulatoryDisclaimer:
      "Aipify provides awareness scaffolds only — not legal or compliance advice. Consult qualified counsel.",
    dogfoodingSite: "Sportsklær.no — Shopify Nordic expansion, multi-language commerce",
  };
}

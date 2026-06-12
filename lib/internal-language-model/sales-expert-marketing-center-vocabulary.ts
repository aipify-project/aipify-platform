export const SALES_EXPERT_MARKETING_CENTER_MISSION =
  "Equip Sales Experts with ethical, honest marketing tools — personal tracking links, banners, and ready-made copy that represent Aipify accurately.";

export const SALES_EXPERT_MARKETING_CENTER_PHILOSOPHY =
  "Marketing should be helpful and educational — never spam, fake claims, or pressure. One channel at a time, sustainable pace.";

export const SALES_EXPERT_MARKETING_CENTER_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners grow through genuine value — marketing tools should reflect install-first, human-centered operations.";

export const SALES_EXPERT_MARKETING_CENTER_CORE_RULE =
  "Mass unsolicited outreach is not supported — same boundary as Email Center and Sales Expert OS.";

export const SALES_EXPERT_MARKETING_CENTER_FORBIDDEN_TERMS = [
  "Affiliate",
  "Referral hustler",
  "Guaranteed results",
] as const;

export const SALES_EXPERT_MARKETING_CENTER_LINK_PATTERNS = [
  "aipify.ai/partner/{slug}",
  "aipify.ai/sales/{slug}",
  "aipify.ai/?ref={slug}",
] as const;

export const SALES_EXPERT_MARKETING_CENTER_BANNER_SIZES = [
  "728x90",
  "300x250",
  "1080x1080",
  "1080x1920",
] as const;

export const SALES_EXPERT_MARKETING_CENTER_VISION_PHRASES = [
  "Ethical promotion builds lasting partnerships — honesty is the best marketing.",
  "Sales Experts represent Aipify professionally while building their own sustainable businesses.",
  "One helpful conversation beats a hundred spam messages.",
  "Aipify supports people — marketing should never imply replacement or manipulation.",
] as const;

export const SALES_EXPERT_MARKETING_CENTER_COMPANION_EXAMPLES = [
  "🌹 You shared helpful content in a WordPress forum — thoughtful outreach builds trust over time.",
  "🦉 Three prospects clicked your link this week — consider a gentle follow-up, not a mass email.",
  "🔔 Your LinkedIn post reached engagement — one channel at a time keeps marketing sustainable.",
  "❤️ Marketing pace looks healthy — Self Love reminds you that consistency beats intensity.",
] as const;

export function getSalesExpertMarketingCenterVocabulary() {
  return {
    mission: SALES_EXPERT_MARKETING_CENTER_MISSION,
    philosophy: SALES_EXPERT_MARKETING_CENTER_PHILOSOPHY,
    abosPrinciple: SALES_EXPERT_MARKETING_CENTER_ABOS_PRINCIPLE,
    coreRule: SALES_EXPERT_MARKETING_CENTER_CORE_RULE,
    forbiddenTerms: SALES_EXPERT_MARKETING_CENTER_FORBIDDEN_TERMS,
    linkPatterns: SALES_EXPERT_MARKETING_CENTER_LINK_PATTERNS,
    bannerSizes: SALES_EXPERT_MARKETING_CENTER_BANNER_SIZES,
    visionPhrases: SALES_EXPERT_MARKETING_CENTER_VISION_PHRASES,
    companionExamples: SALES_EXPERT_MARKETING_CENTER_COMPANION_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 33 Extension — Sales Expert Marketing Center",
    coachDistinction: "Sales Coach Phase 45/46 — daily coaching complements marketing outreach",
    performanceDistinction: "Performance Phase 41 — milestones and commission overview",
    partnerEcosystemDistinction: "Partner Ecosystem A.45 — certified partner program context",
    localizationDistinction: "Global Expansion Phase 35 — promotional text locale packs (en, no, sv, da)",
    selfLoveBoundary:
      "Self Love A.76 influences marketing tone — one channel at a time; encouragement only, not wellbeing storage.",
    trustBoundary:
      "Metadata counts only — leads, signups, subscriptions; no visitor PII in marketing dashboard RPCs.",
  };
}

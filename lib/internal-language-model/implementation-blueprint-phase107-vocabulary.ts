export const IMPLEMENTATION_BLUEPRINT_PHASE107_MISSION =
  "A thriving ecosystem of independent businesses supporting implementation, education, consulting, and customer success.";

export const IMPLEMENTATION_BLUEPRINT_PHASE107_PHILOSOPHY =
  "Growth Partners, not affiliates — entrepreneurs, educators, implementation specialists, and trusted advisors. Aipify succeeds when partners succeed.";

export const IMPLEMENTATION_BLUEPRINT_PHASE107_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — partnership not extraction. Competence-based certification, credible specializations, and ecosystem stewardship. Aipify informs and prepares partner programs; humans govern certification quality.";

export const IMPLEMENTATION_BLUEPRINT_PHASE107_VISION =
  "We did not simply purchase software. We gained a trusted partner who helped us succeed.";

export const IMPLEMENTATION_BLUEPRINT_PHASE107_OBJECTIVE_KEYS = [
  "partner_recruitment",
  "partner_education",
  "certification_pathways",
  "customer_matching",
  "revenue_opportunities",
  "ecosystem_stewardship",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_CERTIFICATION_LEVELS = [
  { key: "certified_partner", label: "Certified Partner", mapsToTier: "certified" },
  { key: "professional_partner", label: "Professional Partner", mapsToTier: "sales_expert" },
  { key: "elite_partner", label: "Elite Partner", mapsToTier: "expert" },
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 Your certification progress is strong — would a pathway summary for Professional Partner help you plan next steps?",
  "🌹 A customer in your region needs Shopify onboarding support — shall Aipify prepare a matching summary for your review?",
  "🔔 Your partner scorecard shows strong customer feedback — would celebrating one outcome before taking on more engagements feel wise?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_PARTNER_RECOGNITION = [
  "🌹 Success awards — celebrate partner and customer outcomes",
  "❤️ Community leadership — forums, advisory councils, ecosystem contribution",
  "🦉 Innovation — implementation excellence and shared learnings",
  "🔔 Mentorship — guide emerging partners without pressure",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_LIMITATION_FORBIDDEN = [
  "Disposable sales channels or short-term transactional partner focus",
  "Recruitment volume over partner success and customer outcomes",
  "Diluted certification standards to inflate partner counts",
  "Affiliate language — Growth Partner terminology only",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_SELF_LOVE_QUOTES = [
  "Your partner business can grow at a pace that protects wellbeing — competence and customer outcomes beat volume-for-volume's sake.",
  "Celebrating one customer success deeply matters more than chasing the next opportunity immediately.",
  "Partnership not extraction — your independent business deserves sustainable rhythms.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE107_VISION_PHRASES = [
  "We did not simply purchase software. We gained a trusted partner who helped us succeed.",
  "Growth Partners, not affiliates — Aipify succeeds when partners succeed.",
  "Partnership not extraction — competence-based certification and ecosystem stewardship.",
  "Aipify Growth Partner Companion informs and prepares — humans govern programs.",
] as const;

export function getImplementationBlueprintPhase107Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE107_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE107_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE107_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE107_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE107_OBJECTIVE_KEYS,
    certificationLevels: IMPLEMENTATION_BLUEPRINT_PHASE107_CERTIFICATION_LEVELS,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE107_COMPANION_GUIDANCE_EXAMPLES,
    partnerRecognition: IMPLEMENTATION_BLUEPRINT_PHASE107_PARTNER_RECOGNITION,
    limitationForbidden: IMPLEMENTATION_BLUEPRINT_PHASE107_LIMITATION_FORBIDDEN,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE107_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE107_VISION_PHRASES,
    engineRoute: "/app/partners",
    enginePhase: "Repo Phase 91 Partner & Certification Ecosystem",
    blueprintPhase: "Phase 107 — Growth Partner Ecosystem Engine",
    marketplaceDistinction:
      "Marketplace Partner Ecosystem A.45 at /app/marketplace-partner-ecosystem-foundation-engine — marketplace connectors, distinct",
    partnerSuccessDistinction:
      "Partner Success A.73 at /app/partner-success-engine — partner portfolio health for customer orgs, distinct",
    salesExpertDistinction:
      "Sales Expert OS Phase 33 / A.95 at /app/sales-expert-engine — Sales Expert as Growth Partner type, cross-link",
    certificationAchievementDistinction:
      "Certification & Achievement A.37 at /app/certification-achievement-engine — internal team certs, NOT partner certification",
    companionName: "Growth Partner Companion",
    notGenericAi: "not generic AI partner recruitment bot",
    neverAffiliateLanguage: "Growth Partner terminology only — never Affiliate",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports wellbeing rhythms — principle only; Growth Partner engine stores partner metadata.",
    privacyNote:
      "Metadata only — no Affiliate language, no automated partner assignment. Humans govern programs; Aipify Growth Partner Companion informs and prepares.",
  };
}

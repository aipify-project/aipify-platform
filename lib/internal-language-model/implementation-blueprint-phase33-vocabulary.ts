export const IMPLEMENTATION_BLUEPRINT_PHASE33_MISSION =
  "Build a global network of qualified Aipify professionals — Sales Representatives, Sales Experts, Certified Partners, and Expert Partners — who help organizations succeed with ABOS adoption.";

export const IMPLEMENTATION_BLUEPRINT_PHASE33_PHILOSOPHY =
  "Technology succeeds when knowledgeable people guide adoption — partners strengthen trust through verified expertise and professional engagement.";

export const IMPLEMENTATION_BLUEPRINT_PHASE33_ABOS_PRINCIPLE =
  "Verified expertise earns trust — official partner tiers must be credible and outcomes-driven.";

export const OFFICIAL_PARTNER_TIER_KEYS = [
  "sales_representative",
  "sales_expert",
  "certified",
  "expert",
] as const;

export const OFFICIAL_PARTNER_TIER_LABELS: Record<(typeof OFFICIAL_PARTNER_TIER_KEYS)[number], string> = {
  sales_representative: "Aipify Sales Representative",
  sales_expert: "Aipify Sales Expert",
  certified: "Aipify Certified Partner",
  expert: "Aipify Expert Partner",
};

export const PARTNER_PORTAL_PREFERRED_TERMS = [
  "Customers",
  "Opportunities",
  "Pipeline",
  "Commission Overview",
  "Certifications",
  "Performance Insights",
  "Partner Resources",
] as const;

export const PARTNER_PORTAL_AVOID_TERMS = [
  "Affiliate",
  "Affiliate Dashboard",
  "Affiliate Earnings",
  "Referral hustle",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE33_VISION_PHRASES = [
  "Technology succeeds when knowledgeable people guide adoption.",
  "Partners strengthen trust — verified expertise, not anonymous marketplaces.",
  "Official tiers must be credible — earned through demonstrated outcomes.",
  "Professional partner language — never affiliate hustle in public copy.",
] as const;

export function getPartnerTierLabel(tier?: string | null): string {
  if (!tier) return "";
  const key = tier as (typeof OFFICIAL_PARTNER_TIER_KEYS)[number];
  if (key in OFFICIAL_PARTNER_TIER_LABELS) return OFFICIAL_PARTNER_TIER_LABELS[key];
  const legacy: Record<string, string> = {
    registered: OFFICIAL_PARTNER_TIER_LABELS.sales_representative,
    advanced: OFFICIAL_PARTNER_TIER_LABELS.expert,
    strategic: OFFICIAL_PARTNER_TIER_LABELS.expert,
    premier: OFFICIAL_PARTNER_TIER_LABELS.expert,
  };
  return legacy[tier] ?? tier.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getImplementationBlueprintPhase33Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE33_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE33_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE33_ABOS_PRINCIPLE,
    tierKeys: OFFICIAL_PARTNER_TIER_KEYS,
    tierLabels: OFFICIAL_PARTNER_TIER_LABELS,
    portalPreferredTerms: PARTNER_PORTAL_PREFERRED_TERMS,
    portalAvoidTerms: PARTNER_PORTAL_AVOID_TERMS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE33_VISION_PHRASES,
    engineRoute: "/app/marketplace-partner-ecosystem-foundation-engine",
    partnersRoute: "/app/partners",
    salesExpertRoute: "/app/sales-expert-engine",
    certificationRoute: "/app/certification-achievement-engine",
    trainingRoute: "/app/learning-training-engine",
    enginePhase: "A.45",
    blueprintPhase: "Phase 33 — Partner & Aipify Expert Network Engine",
    terminologyDoc: "PARTNER_TERMINOLOGY_UPDATE.md",
  };
}

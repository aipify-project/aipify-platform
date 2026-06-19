/** Phase 400 — Website governance constants (public marketing + platform enforcement). */

export const WEBSITE_GOVERNANCE_VERSION = "1.0";

export const APPROVED_BRAND_TERMS = [
  "Aipify",
  "Business Operating System",
  "Companion",
  "Business Packs",
  "Growth Partners",
  "Operational Intelligence",
  "Governance",
  "Knowledge",
  "Trust",
  "Visibility",
] as const;

export const FORBIDDEN_BRAND_TERMS = [
  "AI Tool",
  "Chatbot",
  "Virtual Assistant",
  "Automation Platform",
  "Productivity Hack",
] as const;

export const WEBSITE_GOVERNANCE_RULES = [
  "approved_messaging",
  "approved_colors",
  "approved_typography",
  "approved_terminology",
  "approved_cta_structure",
] as const;

export const WEBSITE_DESIGN_GOVERNANCE = {
  primaryTheme: {
    canvas: "Offwhite (#F7F6F3)",
    companionPurple: "#7C3AED",
    accents: "Blue-Purple",
    surfaces: "Soft Gray",
  },
  typography: ["Clean", "Professional", "Enterprise-grade"],
  principles: ["Clarity", "Whitespace", "Trust", "Accessibility", "Consistency"],
} as const;

export const APPROVED_CTA_ORDER = ["bookDemo", "earlyAccess", "growthPartners", "learnMore"] as const;

export const PUBLIC_WEBSITE_PRINCIPLES = [
  "educate",
  "build_trust",
  "generate_demand",
  "support_customers",
  "support_partners",
  "support_growth",
] as const;

export const WEBSITE_COMPLETION_CHECKPOINTS = [
  "website_foundation",
  "brand_foundation",
  "trust_foundation",
  "conversion_foundation",
  "growth_partner_foundation",
  "seo_foundation",
  "analytics_foundation",
  "governance_foundation",
] as const;

export const WEBSITE_HEALTH_CHECKS = [
  "broken_links",
  "missing_pages",
  "performance",
  "accessibility",
  "seo_health",
  "localization_coverage",
  "conversion_paths",
] as const;

export const TRANSITION_FOCUS_AREAS = [
  "platform",
  "companion",
  "business_packs",
  "customer_experience",
  "enterprise_capabilities",
] as const;

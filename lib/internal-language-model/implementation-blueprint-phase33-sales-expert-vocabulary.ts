import { OFFICIAL_PARTNER_TIER_LABELS } from "./implementation-blueprint-phase33-vocabulary";

export const IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_MISSION =
  "Empower Aipify Sales Representatives and Sales Experts with a professional partner portal for pipeline, commissions, training, and one-to-one customer follow-up.";

export const IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_PHILOSOPHY =
  "Professional partner engagement — Customers, Opportunities, Pipeline, Commission Overview. Never affiliate hustle language.";

export const SALES_EXPERT_PORTAL_SECTION_KEYS = [
  "dashboard",
  "customers",
  "opportunities",
  "commission_center",
  "training_center",
  "resource_library",
  "email_center",
  "implementation_services",
] as const;

export const SALES_EXPERT_EMAIL_TEMPLATE_KEYS = [
  "introduction",
  "discovery_meeting",
  "post_demo_follow_up",
  "knowledge_outreach",
  "support_outreach",
  "commerce_outreach",
  "executive_outreach",
  "re_engagement",
  "upgrade_recommendation",
  "welcome_to_aipify",
] as const;

export const SALES_EXPERT_FOLLOW_UP_CADENCES = [14, 30, 90] as const;

export function getImplementationBlueprintPhase33SalesExpertVocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_PHILOSOPHY,
    officialTierLabels: OFFICIAL_PARTNER_TIER_LABELS,
    portalSectionKeys: SALES_EXPERT_PORTAL_SECTION_KEYS,
    emailTemplateKeys: SALES_EXPERT_EMAIL_TEMPLATE_KEYS,
    followUpCadences: SALES_EXPERT_FOLLOW_UP_CADENCES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    parentBlueprint: "Phase 33 — Partner & Aipify Expert Network",
    marketplaceRoute: "/app/marketplace-partner-ecosystem-foundation-engine",
    partnersRoute: "/app/partners",
    trainingRoute: "/app/learning-training-engine",
    certificationRoute: "/app/certification-achievement-engine",
    massEmailSupported: false,
    subscriptionPrinciple:
      "Aipify subscription: Customer ↔ Aipify. Consulting and implementation: Customer ↔ Sales Expert.",
  };
}

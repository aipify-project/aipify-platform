import {
  ABOS_PRICING_PRINCIPLE,
  POSITIONING_COMPARISONS,
  PRICING_PHILOSOPHY_PRINCIPLE,
  PRICING_VISION_PHRASES,
  VALUE_BASED_AVOID,
} from "@/lib/commercial-packages/pricing-philosophy";

export const ENTERPRISE_PRICING_PHILOSOPHY_MISSION =
  "Communicate Aipify pricing as value-based Business Operating System licensing — transparent scope, outcomes, and governance — never as token or chatbot metering.";

export const ENTERPRISE_PRICING_AVOID_CHATBOT_LANGUAGE = [
  "per-message pricing",
  "token meter",
  "chatbot subscription",
  "AI chatbot cheaper than",
  "pay per prompt",
  "like ChatGPT for business",
] as const;

export const ENTERPRISE_PRICING_POSITIONING_PREFERRED = [
  "Aipify Business Operating System (ABOS)",
  "install-first operational companion",
  "licensed modules and outcomes",
  "human approval and audit",
  "value-based operational scope",
] as const;

export function getEnterprisePricingPhilosophyVocabulary() {
  return {
    mission: ENTERPRISE_PRICING_PHILOSOPHY_MISSION,
    principle: PRICING_PHILOSOPHY_PRINCIPLE,
    abosPrinciple: ABOS_PRICING_PRINCIPLE,
    valueBasedAvoid: VALUE_BASED_AVOID,
    positioningComparisons: POSITIONING_COMPARISONS,
    avoidChatbotLanguage: ENTERPRISE_PRICING_AVOID_CHATBOT_LANGUAGE,
    positioningPreferred: ENTERPRISE_PRICING_POSITIONING_PREFERRED,
    visionPhrases: PRICING_VISION_PHRASES,
    doc: "AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md",
    billingRoute: "/app/settings/billing",
    licenseRoute: "/app/license",
    commercialPackagesDoc: "COMMERCIAL_PACKAGES.md",
    licenseCenterDoc: "LICENSE_CENTER.md",
    corpusPath:
      "aipify-core/knowledge/internal-language-model/enterprise-pricing-philosophy-commercial-model.txt",
  };
}

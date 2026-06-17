export const IMPLEMENTATION_BLUEPRINT_PHASE35_MISSION =
  "Help organizations expand globally while respecting local languages, cultures, payment preferences, and operational realities — localization creates belonging, not just translation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE35_PHILOSOPHY =
  "Global platforms succeed when they respect local realities. Localization extends beyond translation — it creates belonging.";

export const IMPLEMENTATION_BLUEPRINT_PHASE35_ABOS_PRINCIPLE =
  "One platform. Local experiences. Global impact — technology adapts to people, not the reverse.";

export const IMPLEMENTATION_BLUEPRINT_PHASE35_OBJECTIVE_KEYS = [
  "multilingual_interfaces",
  "regional_payment_preferences",
  "country_specific_guidance",
  "localized_knowledge_center",
  "companion_language_adaptation",
  "market_operational_recommendations",
] as const;

import { CORE_LOCALES } from "@/lib/i18n/config";

export const IMPLEMENTATION_BLUEPRINT_PHASE35_PRIORITY_LOCALES = CORE_LOCALES;

export const IMPLEMENTATION_BLUEPRINT_PHASE35_FUTURE_LOCALES = ["de", "fr", "es", "nl", "pt", "it"] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE35_COMPANION_PERSONALITIES = [
  "🌹 Warm and supportive — tone adapted per locale, not literal translation",
  "🦉 Wise and thoughtful — uncertainty acknowledged in local phrasing",
  "🔔 Encouraging and attentive — milestones celebrated without pressure",
  "❤️ Human-centered and compassionate — sustainable pace during demanding expansion",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE35_VISION_PHRASES = [
  "People everywhere should feel that Aipify was built for their market — not translated as an afterthought.",
  "Global scale with local respect — belonging through language, culture, and operational context.",
  "Companion warmth travels across borders when personality is preserved, not merely translated.",
  "Expansion succeeds when local teams trust the platform understands their reality.",
  "One Aipify — many local experiences, all grounded in the same transparent principles.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE35_NORDIC_PAYMENT_MARKETS = [
  "Norway — Fiken, Vipps, Norwegian accounting expectations",
  "Sweden — Swish, Swedish payment expectations",
  "Denmark — MobilePay, Danish payment expectations",
] as const;

export function getImplementationBlueprintPhase35Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE35_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE35_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE35_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE35_OBJECTIVE_KEYS,
    priorityLocales: IMPLEMENTATION_BLUEPRINT_PHASE35_PRIORITY_LOCALES,
    futureLocales: IMPLEMENTATION_BLUEPRINT_PHASE35_FUTURE_LOCALES,
    companionPersonalities: IMPLEMENTATION_BLUEPRINT_PHASE35_COMPANION_PERSONALITIES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE35_VISION_PHRASES,
    nordicPaymentMarkets: IMPLEMENTATION_BLUEPRINT_PHASE35_NORDIC_PAYMENT_MARKETS,
    engineRoute: "/app/global-expansion",
    enginePhase: "Phase 95 — Global Expansion & Localization Framework",
    blueprintPhase: "Phase 35 — Localization & Global Expansion Engine",
    contextEngineDistinction:
      "Context Engine Phase 35 — personal calendar at /app/assistant/context — not this blueprint",
    globalLearningDistinction:
      "Global Learning Network — collective intelligence at /app/global-learning — distinct from tenant localization",
    salesExpertCrossLink: "Sales Expert OS A.95 — localized guidance at /app/sales-expert-engine",
    knowledgeCenterCrossLink: "Knowledge Center A.5 — localized articles at /app/knowledge-center",
    trainingCrossLink: "Learning & Training A.36 at /app/learning-training-engine",
    certificationCrossLink: "Certification A.37 at /app/certification-achievement-engine",
    commercialCrossLink: "Billing & Commercial Phase 93 at /app/commercial",
  };
}

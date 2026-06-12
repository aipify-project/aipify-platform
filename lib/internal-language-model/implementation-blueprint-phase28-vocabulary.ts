export const IMPLEMENTATION_BLUEPRINT_PHASE28_MISSION =
  "Deliver value quickly after adoption — guide setup through long-term success, not merely installed.";

export const IMPLEMENTATION_BLUEPRINT_PHASE28_PHILOSOPHY =
  "First experiences matter — supported from the beginning; success without technical expertise.";

export const IMPLEMENTATION_BLUEPRINT_PHASE28_ABOS_PRINCIPLE =
  "Technology succeeds when people succeed — onboarding is the beginning of the relationship.";

export const IMPLEMENTATION_BLUEPRINT_PHASE28_JOURNEY_STAGE_KEYS = [
  "welcome",
  "connect",
  "learn",
  "activate",
  "grow",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE28_SUCCESS_OBJECTIVE_KEYS = [
  "adoption_progress",
  "feature_utilization",
  "kc_growth",
  "support_outcomes",
  "engagement",
  "satisfaction",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE28_VISION_PHRASES = [
  "Easy to adopt despite depth — guided, not overwhelmed.",
  "We understood it, benefited, and were never left alone.",
  "Technology succeeds when people succeed — onboarding begins the relationship.",
  "First experiences matter — supported from the beginning.",
  "Small wins build confidence for thoughtful expansion.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE28_EARLY_SUCCESS_MOMENTS = [
  "🔔 Your first Knowledge Center article is live — a foundation others can build on.",
  "🌹 Your team completed onboarding — Aipify is ready to support daily work together.",
  "🔔 Your first support workflow is configured — customers can get help through your channels.",
  "❤️ You reached an early success milestone — small wins build confidence for what is next.",
] as const;

export function getImplementationBlueprintPhase28Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE28_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE28_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE28_ABOS_PRINCIPLE,
    journeyStageKeys: IMPLEMENTATION_BLUEPRINT_PHASE28_JOURNEY_STAGE_KEYS,
    successObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE28_SUCCESS_OBJECTIVE_KEYS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE28_VISION_PHRASES,
    earlySuccessMoments: IMPLEMENTATION_BLUEPRINT_PHASE28_EARLY_SUCCESS_MOMENTS,
    engineRoute: "/app/customer-onboarding-engine",
    enginePhase: "Phase A.10",
    blueprintPhase: "Phase 28 — Onboarding & Success Engine",
    installEngineDistinction:
      "Aipify Install Engine A.22 — technical installation and discovery; Install & Adoption ABOS already aligned",
    customerSuccessDistinction:
      "Customer Success Engine A.26 — ongoing health scores, interventions, renewal risk; distinct from setup journey",
    launchReadinessDistinction:
      "Launch Readiness A.25 — pre-launch go-live review; distinct from org onboarding",
    selfLoveBoundary:
      "Self Love encourages gradual features and celebrates small wins — principle only; onboarding tracks progress metadata.",
  };
}

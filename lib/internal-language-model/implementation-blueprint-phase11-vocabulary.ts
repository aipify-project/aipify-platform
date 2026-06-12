export const IMPLEMENTATION_BLUEPRINT_PHASE11_MISSION =
  "Faster support and higher quality through intelligent assistance, Knowledge Center utilization, and responsible escalation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE11_PHILOSOPHY =
  "People want help solved — quick, accurate, respectful resolution with AI assistance and human oversight.";

export const IMPLEMENTATION_BLUEPRINT_PHASE11_ABOS_PRINCIPLE =
  "Support should feel human — technology accelerates routine work while keeping people in control of sensitive decisions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_TIERS = [
  "tier1_self_service",
  "tier2_assisted",
  "tier3_human_escalation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE11_VISION_PHRASES = [
  "Support that feels fast, accurate, and respectful — AI assists, humans decide.",
  "Every repeated question is a chance to improve the Knowledge Center.",
  "Transparency builds trust — customers know when AI helped.",
] as const;

export function getImplementationBlueprintPhase11Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE11_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE11_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE11_ABOS_PRINCIPLE,
    supportTiers: IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_TIERS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE11_VISION_PHRASES,
    engineRoute: "/app/support-ai-engine",
    enginePhase: "A.7",
    blueprintPhase: "Phase 11 — Support Engine Foundation",
    asoDistinction: "Autonomous Support Operations at /app/settings/support-operations — distinct from Support AI Engine A.7",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
  };
}

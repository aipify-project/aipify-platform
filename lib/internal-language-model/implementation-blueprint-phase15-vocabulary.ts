export const IMPLEMENTATION_BLUEPRINT_PHASE15_MISSION =
  "Package capabilities into clear value-driven solutions — customers buy outcomes, not complexity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE15_PHILOSOPHY =
  "Understandable offerings — no technical expertise required to select. Simplicity drives adoption.";

export const IMPLEMENTATION_BLUEPRINT_PHASE15_ABOS_PRINCIPLE =
  "Customers buy outcomes. ABOS delivers them through curated packs humans approve.";

export const IMPLEMENTATION_BLUEPRINT_PHASE15_VISION =
  "Business packs should feel like choosing a solution — calm, reviewable, and expandable.";

export const IMPLEMENTATION_BLUEPRINT_PHASE15_PRODUCTIZATION_PACKS = [
  { blueprintKey: "aipify_essentials", displayName: "Aipify Essentials", mappedPackKey: "general_business" },
  { blueprintKey: "aipify_support", displayName: "Aipify Support", mappedPackKey: "support_operations" },
  { blueprintKey: "aipify_operations", displayName: "Aipify Operations", mappedPackKey: "general_business" },
  { blueprintKey: "aipify_commerce", displayName: "Aipify Commerce", mappedPackKey: "e_commerce" },
  { blueprintKey: "aipify_enterprise", displayName: "Aipify Enterprise", mappedPackKey: "enterprise_governance" },
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE15_PACKAGING_PRINCIPLES = [
  "recognizable problems",
  "easy to explain",
  "measurable value",
  "scale",
  "flexible",
] as const;

export function getImplementationBlueprintPhase15Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE15_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE15_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE15_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE15_VISION,
    productizationPacks: IMPLEMENTATION_BLUEPRINT_PHASE15_PRODUCTIZATION_PACKS,
    packagingPrinciples: IMPLEMENTATION_BLUEPRINT_PHASE15_PACKAGING_PRINCIPLES,
    route: "/app/business-packs-foundation-engine",
    enginePhase: "A.43",
  };
}

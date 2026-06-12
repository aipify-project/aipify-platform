export const IMPLEMENTATION_BLUEPRINT_PHASE5_MISSION =
  "Secure, scalable, extensible integration framework connecting Aipify to systems organizations already use.";

export const IMPLEMENTATION_BLUEPRINT_PHASE5_PHILOSOPHY =
  "Meet organizations where they work. Reduce friction. Technology adapts to people.";

export const IMPLEMENTATION_BLUEPRINT_PHASE5_ABOS_PRINCIPLE =
  "Technology should adapt to people. Integrations extend existing workflows — not replace them.";

export const IMPLEMENTATION_BLUEPRINT_PHASE5_INTEGRATION_PRINCIPLES = [
  "secure",
  "transparent",
  "permission-aware",
  "auditable",
  "easy to configure and disable",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE5_PLATFORM_CATEGORIES = [
  "commerce",
  "communication",
  "productivity",
  "support",
] as const;

export function getImplementationBlueprintPhase5Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE5_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE5_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE5_ABOS_PRINCIPLE,
    integrationPrinciples: IMPLEMENTATION_BLUEPRINT_PHASE5_INTEGRATION_PRINCIPLES,
    platformCategories: IMPLEMENTATION_BLUEPRINT_PHASE5_PLATFORM_CATEGORIES,
  };
}

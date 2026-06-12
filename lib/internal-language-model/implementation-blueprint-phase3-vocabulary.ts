export const IMPLEMENTATION_BLUEPRINT_PHASE3_MISSION =
  "Central source of truth for organizational memory, companion guidance, support knowledge, and operational intelligence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE3_PHILOSOPHY =
  "Accessible. Organized. Actionable. Continuously improved. Shared responsibly.";

export const IMPLEMENTATION_BLUEPRINT_PHASE3_ABOS_PRINCIPLE =
  "Knowledge without governance creates confusion. Governance without accessibility creates silence. Aipify combines both.";

export const IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_TYPES = [
  "operational",
  "support",
  "organizational",
  "companion",
  "training",
  "strategic",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE3_VISIBILITY = [
  "public",
  "organization",
  "workspace",
  "restricted",
] as const;

export function getImplementationBlueprintPhase3Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE3_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE3_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE3_ABOS_PRINCIPLE,
    knowledgeTypes: IMPLEMENTATION_BLUEPRINT_PHASE3_KNOWLEDGE_TYPES,
    visibilityLevels: IMPLEMENTATION_BLUEPRINT_PHASE3_VISIBILITY,
  };
}

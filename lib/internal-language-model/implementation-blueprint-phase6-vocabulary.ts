export const IMPLEMENTATION_BLUEPRINT_PHASE6_MISSION =
  "Allow Aipify to automate and perform approved actions while ensuring humans remain informed and empowered.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_PHILOSOPHY =
  "Assist. Recommend. Execute responsibly.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_ABOS_PRINCIPLE =
  "Automation should strengthen human capability. Not replace human responsibility.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_VISION =
  "Organizations move faster without sacrificing trust, governance, or accountability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_CATEGORIES = [
  "low",
  "medium",
  "high",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE6_APPROVAL_PRINCIPLES = [
  { risk: "low", rule: "Automatic execution permitted" },
  { risk: "medium", rule: "Human review recommended" },
  { risk: "high", rule: "Explicit approval required" },
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE6_TRANSPARENCY = [
  "What Aipify proposes",
  "Why the action is recommended",
  "What systems are affected",
  "Whether approval is required",
  "Whether the action succeeded",
] as const;

export function getImplementationBlueprintPhase6Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE6_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE6_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE6_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE6_VISION,
    actionCategories: IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_CATEGORIES,
    approvalPrinciples: IMPLEMENTATION_BLUEPRINT_PHASE6_APPROVAL_PRINCIPLES,
    transparency: IMPLEMENTATION_BLUEPRINT_PHASE6_TRANSPARENCY,
  };
}

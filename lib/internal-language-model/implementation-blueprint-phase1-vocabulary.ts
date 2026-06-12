export const IMPLEMENTATION_BLUEPRINT_PHASE1_MISSION =
  "Build organizational architecture that supports businesses of all sizes through secure, scalable, isolated environments.";

export const IMPLEMENTATION_BLUEPRINT_BUILD_PHILOSOPHY =
  "Build once. Build properly. Scale forever.";

export const IMPLEMENTATION_BLUEPRINT_ABOS_PRINCIPLE =
  "Intelligence without structure creates chaos. Structure without humanity creates rigidity. Aipify combines both.";

export const IMPLEMENTATION_BLUEPRINT_HIERARCHY = [
  "Organization",
  "Workspaces",
  "Users",
  "Roles",
  "Permissions",
  "Companion Experiences",
] as const;

export function getImplementationBlueprintPhase1Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE1_MISSION,
    buildPhilosophy: IMPLEMENTATION_BLUEPRINT_BUILD_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_ABOS_PRINCIPLE,
    hierarchy: IMPLEMENTATION_BLUEPRINT_HIERARCHY,
  };
}

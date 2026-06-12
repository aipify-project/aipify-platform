export const IMPLEMENTATION_BLUEPRINT_PHASE2_MISSION =
  "Secure identity management, roles, and permissions — the right access at the right time.";

export const IMPLEMENTATION_BLUEPRINT_PHASE2_BUILD_PHILOSOPHY =
  "Least privilege by default. Humans decide. Aipify prepares and enforces.";

export const IMPLEMENTATION_BLUEPRINT_PHASE2_ABOS_PRINCIPLE =
  "Access without accountability erodes trust. Accountability without empathy erodes adoption. Aipify balances both.";

export const IMPLEMENTATION_BLUEPRINT_PHASE2_DEFAULT_ROLES = [
  "Super Admin",
  "Org Owner",
  "Administrator",
  "Executive",
  "Manager",
  "Support Agent",
  "Moderator",
  "Employee",
  "Viewer",
  "Custom Roles",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE2_PERMISSION_CATEGORIES = [
  "organization",
  "workspace",
  "knowledge",
  "support",
  "companion",
  "admin",
] as const;

export function getImplementationBlueprintPhase2Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE2_MISSION,
    buildPhilosophy: IMPLEMENTATION_BLUEPRINT_PHASE2_BUILD_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE2_ABOS_PRINCIPLE,
    defaultRoles: IMPLEMENTATION_BLUEPRINT_PHASE2_DEFAULT_ROLES,
    permissionCategories: IMPLEMENTATION_BLUEPRINT_PHASE2_PERMISSION_CATEGORIES,
  };
}

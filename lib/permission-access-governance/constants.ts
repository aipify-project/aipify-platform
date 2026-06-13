export const PERMISSION_ACCESS_GOVERNANCE_ROUTE = "/app/governance/permissions-access";

export const PERMISSION_CATEGORIES = [
  "data_access",
  "action_access",
  "business_access",
  "community_access",
  "companion_access",
] as const;

export const PERMISSION_RISK_LEVELS = ["low", "moderate", "elevated", "high"] as const;

export const PERMISSION_ACCESS_CORE_PRINCIPLE =
  "Aipify can only do what it has permission to do. No permission. No action.";

export const PERMISSION_ACCESS_VISION =
  "Trust is built through transparency and control. Every action Aipify performs is grounded in explicit authorization and human oversight.";

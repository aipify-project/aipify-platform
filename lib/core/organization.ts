/**
 * Multi-tenant organization helpers (Phase A.1).
 * Business rules are enforced in Supabase RPCs — these are TypeScript mirrors for API/UI layers.
 */

export const ORGANIZATION_ROLES = [
  "owner",
  "administrator",
  "manager",
  "support_agent",
  "viewer",
] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const ORGANIZATION_STATUSES = [
  "active",
  "inactive",
  "trial",
  "suspended",
  "archived",
] as const;

export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];

export const SUBSCRIPTION_PLANS = [
  "starter",
  "business",
  "professional",
  "enterprise",
  "internal",
] as const;

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export const ORGANIZATION_MODULE_KEYS = [
  "admin_assistant",
  "support_ai",
  "knowledge_center",
  "audit_log",
  "integrations",
  "moderation_ai",
  "commerce_ai",
  "marketing_ai",
  "analytics_ai",
  "strategic_intelligence",
  "operations_center",
] as const;

export type OrganizationModuleKey = (typeof ORGANIZATION_MODULE_KEYS)[number];

export type OrganizationPermission =
  | "billing"
  | "user_management"
  | "module_management"
  | "integration_management"
  | "audit_log_access"
  | "approve_ai_actions"
  | "settings_manage"
  | "settings_limited"
  | "support_cases"
  | "knowledge_search"
  | "read_only";

const ROLE_PERMISSIONS: Record<OrganizationRole, OrganizationPermission[]> = {
  owner: [
    "billing",
    "user_management",
    "module_management",
    "integration_management",
    "audit_log_access",
    "approve_ai_actions",
    "settings_manage",
    "settings_limited",
    "support_cases",
    "knowledge_search",
    "read_only",
  ],
  administrator: [
    "user_management",
    "module_management",
    "integration_management",
    "audit_log_access",
    "approve_ai_actions",
    "settings_manage",
    "settings_limited",
    "support_cases",
    "knowledge_search",
    "read_only",
  ],
  manager: [
    "approve_ai_actions",
    "settings_limited",
    "support_cases",
    "knowledge_search",
    "read_only",
  ],
  support_agent: ["support_cases", "knowledge_search", "read_only"],
  viewer: ["knowledge_search", "read_only"],
};

/** Map legacy users.role to organization role. */
export function mapUserRoleToOrganizationRole(
  userRole: string
): OrganizationRole {
  switch (userRole) {
    case "owner":
      return "owner";
    case "admin":
      return "administrator";
    case "staff":
      return "manager";
    case "support":
      return "support_agent";
    case "read_only":
      return "viewer";
    default:
      return "viewer";
  }
}

export function roleHasPermission(
  role: OrganizationRole,
  permission: OrganizationPermission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  subscription_plan: SubscriptionPlan;
  role: OrganizationRole;
  membership_status: string;
};

export type CurrentOrganization = OrganizationSummary & {
  default_language?: string;
  timezone?: string;
};

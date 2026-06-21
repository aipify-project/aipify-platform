/** Canonical Support hub back link */
export const GETTING_STARTED_SUPPORT_HREF = "/app/support/history";

export const ONBOARDING_TASK_LINKS: Record<string, string> = {
  org_profile: "/app/organization/profile",
  org_settings: "/app/settings",
  org_localization: "/app/settings/localization",
  team_invite: "/app/organization/team",
  team_admin_roles: "/app/organization/team",
  team_permissions: "/app/organization/team",
  security_2fa: "/app/account/security",
  security_access: "/app/account/security",
  security_preferences: "/app/account/security",
  integration_connect: "/app/platform/integrations/connect",
  integration_health: "/app/platform/integrations",
  integration_sync: "/app/platform/integrations",
  pack_install: "/app/business-packs/available",
  pack_review: "/app/business-packs",
  pack_configure: "/app/business-packs",
  knowledge_explore: "/app/support/knowledge",
  support_assistant: "/app/support/assistant",
  support_contact: "/app/support/contact",
};

export const ONBOARDING_RECOMMENDATION_LINKS: Record<string, string> = {
  inviteAdmins: "/app/organization/team",
  enable2fa: "/app/account/security",
  installFirstPack: "/app/business-packs/available",
  reviewSupportAssistant: "/app/support/assistant",
  exploreExecutiveInsights: "/app/executive/insights",
};

export const ONBOARDING_RECOMMENDATION_PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const TASK_CATEGORY_ORDER = [
  "organization",
  "team",
  "security",
  "integrations",
  "business_packs",
  "knowledge_support",
] as const;

export const ADOPTION_FEATURE_KEYS = [
  "pack_install",
  "integration_connect",
  "knowledge_explore",
  "support_assistant",
] as const;

export const MILESTONE_KEYS = ["org_setup_complete", "first_integration", "onboarding_complete"] as const;

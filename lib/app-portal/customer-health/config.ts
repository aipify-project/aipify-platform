/** Canonical Support hub back link */
export const CUSTOMER_HEALTH_SUPPORT_HREF = "/app/support/history";

export const CUSTOMER_HEALTH_TREND_PERIODS = [7, 30, 90, 365] as const;
export type CustomerHealthTrendPeriod = (typeof CUSTOMER_HEALTH_TREND_PERIODS)[number];

export const CUSTOMER_HEALTH_RECOMMENDATION_LINKS: Record<string, string> = {
  inviteTeam: "/app/organization/team",
  explorePacks: "/app/business-packs/available",
  enableIntegrations: "/app/platform/integrations",
  reviewSupport: "/app/support/requests",
  reviewApprovals: "/app/approvals",
  completeFollowUps: "/app/operations/follow-ups",
  completeOnboarding: "/app/support/getting-started",
  configureSecurity: "/app/account/security",
};

export const DRIVER_ACTION_LINKS: Record<string, string> = {
  adoption: "/app/support/getting-started",
  engagement: "/app/organization/team",
  utilization: "/app/operations",
  learning: "/app/support/academy",
  security: "/app/account/security",
  integrations: "/app/platform/integrations",
};

export const NEEDS_ATTENTION_ACTION_LINKS: Record<string, string> = {
  active_users: "/app/organization/team",
  team_size: "/app/organization/team",
  business_packs: "/app/business-packs/available",
  integrations: "/app/platform/integrations",
  open_support: "/app/support/requests",
  pending_approvals: "/app/approvals",
  open_follow_ups: "/app/operations/follow-ups",
};

export const CUSTOMER_HEALTH_FILTER_CATEGORIES = [
  "support",
  "governance",
  "security",
  "engagement",
  "adoption",
  "utilization",
  "operations",
] as const;

export const CUSTOMER_HEALTH_SORT_OPTIONS = [
  "impact_desc",
  "severity_desc",
  "date_desc",
  "date_asc",
] as const;

export type CustomerHealthSortOption = (typeof CUSTOMER_HEALTH_SORT_OPTIONS)[number];

/** Canonical Support hub back link */
export const CUSTOMER_SUCCESS_SUPPORT_HREF = "/app/support/history";

export const CUSTOMER_SUCCESS_RECOMMENDATION_LINKS: Record<
  string,
  { href: string; priority: "high_impact" | "important" | "recommended" | "opportunity" }
> = {
  activate2faAllUsers: { href: "/app/account/security", priority: "high_impact" },
  completeOnboardingTraining: { href: "/app/support/getting-started", priority: "important" },
  exploreUnusedBusinessPacks: { href: "/app/business-packs/available", priority: "recommended" },
  connectIntegrations: { href: "/app/platform/integrations", priority: "important" },
  reviewOperationalDashboards: { href: "/app/command-center", priority: "recommended" },
  encourageCertification: { href: "/app/support/academy", priority: "opportunity" },
  completeFirstUnonightSync: { href: "/app/support/history", priority: "high_impact" },
};

export const RECOMMENDATION_PRIORITY_ORDER: Record<string, number> = {
  high_impact: 0,
  important: 1,
  recommended: 2,
  opportunity: 3,
};

export const SUCCESS_PLAN_STATUSES = [
  "draft",
  "active",
  "in_progress",
  "requires_attention",
  "at_risk",
  "blocked",
  "completed",
  "archived",
] as const;

export type SuccessPlanStatus = (typeof SUCCESS_PLAN_STATUSES)[number];

export const FOLLOW_UP_MILESTONE_TABS = [
  "all",
  "follow_ups",
  "milestones",
  "overdue",
  "completed",
] as const;

export type FollowUpMilestoneTab = (typeof FOLLOW_UP_MILESTONE_TABS)[number];

export const SORT_OPTIONS = [
  "due_date",
  "priority",
  "title",
  "progress",
  "updated",
] as const;

export type CustomerSuccessSortOption = (typeof SORT_OPTIONS)[number];

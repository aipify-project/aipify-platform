/** Canonical Support hub back link */
export const SUCCESS_CENTER_SUPPORT_HREF = "/app/support/history";

/** Knowledge Center article slug — present in content/knowledge/aipify/app-portal/faq/ */
export const SUCCESS_CENTER_METHODOLOGY_ARTICLE_SLUG = "success-center-faq";

export const SUCCESS_CENTER_METHODOLOGY_HREF = `/app/support/knowledge/${SUCCESS_CENTER_METHODOLOGY_ARTICLE_SLUG}`;

export const SUCCESS_RECOMMENDATION_LINKS: Record<
  string,
  { href: string; priority: "high" | "medium" | "low" }
> = {
  inviteTeam: { href: "/app/organization/team", priority: "high" },
  explorePacks: { href: "/app/business-packs/available", priority: "medium" },
  enableIntegrations: { href: "/app/platform/integrations", priority: "medium" },
  reviewSupport: { href: "/app/support/requests", priority: "high" },
  reviewApprovals: { href: "/app/approvals", priority: "medium" },
  completeFollowUps: { href: "/app/operations/follow-ups", priority: "medium" },
  completeOnboarding: { href: "/app/support/getting-started", priority: "low" },
  configureSecurity: { href: "/app/account/security", priority: "medium" },
};

export const RECOMMENDATION_PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const GROWTH_OPPORTUNITY_LINKS: Record<string, string> = {
  team_expansion: "/app/organization/team",
  business_packs: "/app/business-packs/available",
  integrations: "/app/platform/integrations",
  plan_upgrade: "/app/billing/upgrade",
};

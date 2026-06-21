import type { CompanionQuickActionId } from "./constants";

export type CompanionPageContext = {
  pathname: string;
  pageLabel: string;
  organizationName?: string;
  roleLabel?: string;
  localeLabel?: string;
  modeLabel?: string;
};

export type CompanionRouteSuggestion = {
  id: string;
  promptKey: string;
  quickActionId?: CompanionQuickActionId;
};

type RouteRule = {
  match: (pathname: string) => boolean;
  pageLabelKey: string;
  suggestions: CompanionRouteSuggestion[];
};

/** Route rules for context-aware greeting suggestions (label keys resolved via i18n). */
export const COMPANION_ROUTE_RULES: RouteRule[] = [
  {
    match: (p) => p === "/app/command-center" || p.startsWith("/app/command-center/"),
    pageLabelKey: "commandCenter",
    suggestions: [
      { id: "brief-summary", promptKey: "commandBriefSummary" },
      { id: "pending-approvals", promptKey: "pendingApprovals", quickActionId: "whatNow" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/since-last-login"),
    pageLabelKey: "sinceLastLogin",
    suggestions: [
      { id: "sll-priorities", promptKey: "sinceLastLoginPriorities" },
      { id: "sll-actions", promptKey: "sinceLastLoginActions", quickActionId: "whatNow" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/notifications"),
    pageLabelKey: "notifications",
    suggestions: [
      { id: "notif-priority", promptKey: "notificationsPriority" },
      { id: "notif-next", promptKey: "notificationsNext", quickActionId: "recentEvents" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/support"),
    pageLabelKey: "support",
    suggestions: [
      { id: "support-open", promptKey: "supportOpenCases", quickActionId: "supportCases" },
      { id: "support-kc", promptKey: "supportKnowledge", quickActionId: "knowledgeFaq" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/business-packs"),
    pageLabelKey: "businessPacks",
    suggestions: [
      { id: "bp-status", promptKey: "businessPackStatus", quickActionId: "orgStatus" },
      { id: "bp-value", promptKey: "businessPackValue", quickActionId: "customerSuccess" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/platform/integrations") || p.startsWith("/app/settings"),
    pageLabelKey: "integrations",
    suggestions: [
      { id: "int-status", promptKey: "integrationStatus", quickActionId: "integrations" },
      { id: "int-security", promptKey: "integrationSecurity", quickActionId: "securityAccess" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/organization"),
    pageLabelKey: "organization",
    suggestions: [
      { id: "org-health", promptKey: "organizationHealth", quickActionId: "orgStatus" },
      { id: "org-team", promptKey: "organizationTeam" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/billing"),
    pageLabelKey: "billing",
    suggestions: [
      { id: "billing-status", promptKey: "billingStatus" },
      { id: "billing-upgrade", promptKey: "billingUpgrade" },
    ],
  },
  {
    match: (p) => p.startsWith("/app/operations"),
    pageLabelKey: "operations",
    suggestions: [
      { id: "ops-priority", promptKey: "operationsPriority", quickActionId: "whatNow" },
      { id: "ops-events", promptKey: "operationsEvents", quickActionId: "recentEvents" },
    ],
  },
];

export function resolveCompanionRouteRule(pathname: string): RouteRule | undefined {
  return COMPANION_ROUTE_RULES.find((rule) => rule.match(pathname));
}

export function resolveCompanionPageLabelKey(pathname: string): string {
  const rule = resolveCompanionRouteRule(pathname);
  return rule?.pageLabelKey ?? "default";
}

export function resolveCompanionSuggestions(pathname: string): CompanionRouteSuggestion[] {
  const rule = resolveCompanionRouteRule(pathname);
  if (rule) return rule.suggestions;
  return [
    { id: "default-org", promptKey: "defaultOrgStatus", quickActionId: "orgStatus" },
    { id: "default-now", promptKey: "defaultWhatNow", quickActionId: "whatNow" },
  ];
}

export function resolveQuickActionHref(actionId: CompanionQuickActionId): string {
  const map: Record<CompanionQuickActionId, string> = {
    orgStatus: "/app/command-center",
    recentEvents: "/app/since-last-login",
    integrations: "/app/platform/integrations",
    supportCases: "/app/support/requests",
    customerSuccess: "/app/support/customer-success",
    knowledgeFaq: "/app/support/knowledge",
    securityAccess: "/app/settings/security",
    whatNow: "/app/operations/prioritization",
  };
  return map[actionId];
}

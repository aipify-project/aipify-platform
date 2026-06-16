export const APP_PORTAL_HOME_ROUTE = "/app";

export const APP_ORGANIZATION_ROLES = [
  "organization_owner",
  "organization_admin",
  "organization_manager",
  "organization_member",
] as const;

export type AppOrganizationRole = (typeof APP_ORGANIZATION_ROLES)[number];

export type AppPortalNavId =
  | "appDashboard"
  | "sinceLastLogin"
  | "appNotifications"
  | "teamMembers"
  | "rolesPermissions"
  | "activityOverview"
  | "installedBusinessPacks"
  | "availableBusinessPacks"
  | "businessPackSettings"
  | "appTasks"
  | "workflows"
  | "insights"
  | "executiveInsights"
  | "subscription"
  | "paymentHistory"
  | "invoices"
  | "upgradeOptions"
  | "knowledgeCenter"
  | "contactSupport"
  | "supportHistory"
  | "profile"
  | "preferences"
  | "accountSecurity"
  | "accountNotifications"
  | "integrations"
  | "connectedIntegrations"
  | "connectIntegration"
  | "apiAccess";

export type AppPortalNavGroupId =
  | "home"
  | "organization"
  | "businessPacks"
  | "operations"
  | "billing"
  | "support"
  | "account"
  | "appPlatform";

export type AppPortalNavItem = {
  id: AppPortalNavId;
  href: string;
  labelKey: string;
  featureKey?: string;
};

export type AppPortalNavGroup = {
  id: AppPortalNavGroupId;
  labelKey: string;
  items: AppPortalNavItem[];
  defaultExpanded?: boolean;
};

export const APP_PORTAL_NAV_GROUPS: AppPortalNavGroup[] = [
  {
    id: "home",
    labelKey: "customerApp.portalStructure.navGroups.home",
    defaultExpanded: true,
    items: [
      { id: "appDashboard", href: "/app", labelKey: "customerApp.portalStructure.nav.dashboard" },
      { id: "sinceLastLogin", href: "/app/since-last-login", labelKey: "customerApp.portalStructure.nav.sinceLastLogin" },
      { id: "appNotifications", href: "/app/notifications", labelKey: "customerApp.portalStructure.nav.notifications" },
    ],
  },
  {
    id: "organization",
    labelKey: "customerApp.portalStructure.navGroups.organization",
    items: [
      { id: "teamMembers", href: "/app/organization/team", labelKey: "customerApp.portalStructure.nav.teamMembers" },
      { id: "rolesPermissions", href: "/app/organization/roles", labelKey: "customerApp.portalStructure.nav.rolesPermissions", featureKey: "team_management" },
      { id: "activityOverview", href: "/app/organization/activity", labelKey: "customerApp.portalStructure.nav.activityOverview" },
    ],
  },
  {
    id: "businessPacks",
    labelKey: "customerApp.portalStructure.navGroups.businessPacks",
    items: [
      { id: "installedBusinessPacks", href: "/app/business-packs/installed", labelKey: "customerApp.portalStructure.nav.installedBusinessPacks", featureKey: "business_packs" },
      { id: "availableBusinessPacks", href: "/app/business-packs/available", labelKey: "customerApp.portalStructure.nav.availableBusinessPacks", featureKey: "business_packs" },
      { id: "businessPackSettings", href: "/app/business-packs/settings", labelKey: "customerApp.portalStructure.nav.businessPackSettings", featureKey: "business_packs" },
    ],
  },
  {
    id: "operations",
    labelKey: "customerApp.portalStructure.navGroups.operations",
    items: [
      { id: "appTasks", href: "/app/operations/tasks", labelKey: "customerApp.portalStructure.nav.tasks" },
      { id: "workflows", href: "/app/operations/workflows", labelKey: "customerApp.portalStructure.nav.workflows", featureKey: "workflows" },
      { id: "executiveInsights", href: "/app/operations/executive-insights", labelKey: "customerApp.portalStructure.nav.executiveInsights" },
      { id: "insights", href: "/app/operations/insights", labelKey: "customerApp.portalStructure.nav.insights", featureKey: "advanced_insights" },
    ],
  },
  {
    id: "billing",
    labelKey: "customerApp.portalStructure.navGroups.billing",
    items: [
      { id: "subscription", href: "/app/billing/subscription", labelKey: "customerApp.portalStructure.nav.subscription", featureKey: "billing" },
      { id: "paymentHistory", href: "/app/billing/payment-history", labelKey: "customerApp.portalStructure.nav.paymentHistory", featureKey: "billing" },
      { id: "invoices", href: "/app/billing/invoices", labelKey: "customerApp.portalStructure.nav.invoices", featureKey: "billing" },
      { id: "upgradeOptions", href: "/app/billing/upgrade", labelKey: "customerApp.portalStructure.nav.upgradeOptions", featureKey: "billing" },
    ],
  },
  {
    id: "support",
    labelKey: "customerApp.portalStructure.navGroups.support",
    items: [
      { id: "knowledgeCenter", href: "/app/support/knowledge", labelKey: "customerApp.portalStructure.nav.knowledgeCenter" },
      { id: "contactSupport", href: "/app/support/contact", labelKey: "customerApp.portalStructure.nav.contactSupport" },
      { id: "supportHistory", href: "/app/support/history", labelKey: "customerApp.portalStructure.nav.supportHistory" },
    ],
  },
  {
    id: "account",
    labelKey: "customerApp.portalStructure.navGroups.account",
    items: [
      { id: "profile", href: "/app/account/profile", labelKey: "customerApp.portalStructure.nav.profile" },
      { id: "preferences", href: "/app/account/preferences", labelKey: "customerApp.portalStructure.nav.preferences" },
      { id: "accountSecurity", href: "/app/account/security", labelKey: "customerApp.portalStructure.nav.security" },
      { id: "accountNotifications", href: "/app/account/notifications", labelKey: "customerApp.portalStructure.nav.accountNotifications" },
    ],
  },
  {
    id: "appPlatform",
    labelKey: "customerApp.portalStructure.navGroups.appPlatform",
    items: [
      { id: "integrations", href: "/app/platform/integrations", labelKey: "customerApp.portalStructure.nav.integrations", featureKey: "integrations" },
      { id: "connectedIntegrations", href: "/app/platform/integrations/connected", labelKey: "customerApp.portalStructure.nav.connectedIntegrations", featureKey: "integrations" },
      { id: "connectIntegration", href: "/app/platform/integrations/connect", labelKey: "customerApp.portalStructure.nav.connectIntegration", featureKey: "integrations" },
      { id: "apiAccess", href: "/app/platform/api-access", labelKey: "customerApp.portalStructure.nav.apiAccess", featureKey: "integrations" },
    ],
  },
];

export const APP_PORTAL_NAV: AppPortalNavItem[] = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items);

export function getAppPortalActiveNavId(pathname: string): AppPortalNavId {
  if (pathname === "/app") return "appDashboard";
  if (pathname.startsWith("/app/platform/integrations/connect")) return "connectIntegration";
  if (pathname.startsWith("/app/platform/integrations/connected")) return "connectedIntegrations";
  if (pathname.startsWith("/app/platform/integrations")) return "integrations";
  if (pathname.startsWith("/app/platform/api-access")) return "apiAccess";
  if (pathname.startsWith("/app/operations/executive-insights")) return "executiveInsights";
  for (const group of APP_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/app" && pathname.startsWith(item.href)) {
        return item.id;
      }
    }
  }
  return "appDashboard";
}

export const APP_PORTAL_FAQ_ARTICLES = [
  { slug: "what-is-aipify", titleKey: "customerApp.portalStructure.faq.whatIsAipify" },
  { slug: "invite-team-members", titleKey: "customerApp.portalStructure.faq.inviteTeamMembers" },
  { slug: "change-subscriptions", titleKey: "customerApp.portalStructure.faq.changeSubscriptions" },
  { slug: "upgrade-plan", titleKey: "customerApp.portalStructure.faq.upgradePlan" },
  { slug: "what-are-business-packs", titleKey: "customerApp.portalStructure.faq.whatAreBusinessPacks" },
  { slug: "view-invoices", titleKey: "customerApp.portalStructure.faq.viewInvoices" },
  { slug: "contact-support", titleKey: "customerApp.portalStructure.faq.contactSupport" },
  { slug: "role-management", titleKey: "customerApp.portalStructure.faq.roleManagement" },
  { slug: "since-last-login", titleKey: "customerApp.portalStructure.faq.sinceLastLogin" },
  { slug: "feature-access", titleKey: "customerApp.portalStructure.faq.featureAccess" },
  { slug: "upgrade-permissions", titleKey: "customerApp.portalStructure.faq.upgradePermissions" },
  { slug: "notification-preferences", titleKey: "customerApp.portalStructure.faq.notificationPreferences" },
] as const;

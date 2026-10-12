import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

export const APP_PORTAL_HOME_ROUTE = "/app";

export const APP_ORGANIZATION_ROLES = [
  "organization_owner",
  "organization_admin",
  "organization_manager",
  "organization_member",
] as const;

export type AppOrganizationRole = (typeof APP_ORGANIZATION_ROLES)[number];

/** Foundation nav ids (job 58) plus legacy ids retained for deep-link / type compatibility. */
export type AppPortalNavId =
  | "appDashboard"
  | "kompisWebDashboard"
  | "kompisWebQa"
  | "kompisWebFaq"
  | "kompisWebConnection"
  | "kompisWebAppearance"
  | "kompisWebModules"
  | "kompisWebSettings"
  | "kompisBedriftDashboard"
  | "kompisBedriftEmployees"
  | "kompisBedriftDocuments"
  | "kompisBedriftFaq"
  | "kompisBedriftComms"
  | "kompisBedriftMeetings"
  | "kompisBedriftModules"
  | "kompisBedriftSettings"
  | "accountSubscription"
  | "accountInvoices"
  | "accountIntegrations"
  | "accountNotifications"
  | "sinceLastLogin"
  | "appNotifications"
  | "teamMembers"
  | "responsibilities"
  | "externalRelationships"
  | "organizationalAssets"
  | "communications"
  | "trustCulture"
  | "rolesPermissions"
  | "activityOverview"
  | "installedBusinessPacks"
  | "availableBusinessPacks"
  | "softwareCatalog"
  | "businessPackSettings"
  | "businessPackSuccess"
  | "businessPackRecommendations"
  | "businessPackLifecycle"
  | "businessPackValue"
  | "businessPackCommandCenter"
  | "businessPackEcosystemIntelligence"
  | "businessPackAutomation"
  | "businessPackGovernance"
  | "businessPackCompliance"
  | "businessPackExecutivePortfolio"
  | "appTasks"
  | "workflows"
  | "insights"
  | "executiveInsights"
  | "followUps"
  | "decisionCenter"
  | "activityHistory"
  | "capabilityCenter"
  | "goalsObjectives"
  | "playbooks"
  | "risks"
  | "compliance"
  | "meetings"
  | "continuity"
  | "learningImprovement"
  | "capacityWorkload"
  | "successValue"
  | "strategyExecution"
  | "prioritizationEngine"
  | "commitmentTracking"
  | "intelligenceBriefings"
  | "momentum"
  | "resilience"
  | "executiveCompanion"
  | "enterpriseBenchmarking"
  | "predictiveIntelligence"
  | "scenarioPlanning"
  | "executiveForesight"
  | "strategicOpportunities"
  | "organizationalForecasting"
  | "enterpriseReadiness"
  | "crossFunctionalIntelligence"
  | "intelligenceCommandCenter"
  | "futureStatePlanning"
  | "abosCommandCenter"
  | "subscription"
  | "paymentHistory"
  | "invoices"
  | "upgradeOptions"
  | "knowledgeCenter"
  | "contactSupport"
  | "supportRequests"
  | "aipifyCompanion"
  | "kompisOperator"
  | "commandBrief"
  | "successCenter"
  | "gettingStarted"
  | "customerAcademy"
  | "customerSuccess"
  | "customerHealth"
  | "supportHistory"
  | "profile"
  | "preferences"
  | "accountSecurity"
  | "integrations"
  | "connectedIntegrations"
  | "connectIntegration"
  | "apiAccess"
  | "operationsCenter"
  | "risksCompliance"
  | "managementInsights"
  | "dataSources"
  | "organizationSettings";

export type AppPortalNavGroupId =
  | "kompisWeb"
  | "kompisBedrift"
  | "account"
  | "home"
  | "organization"
  | "businessPacks"
  | "operations"
  | "billing"
  | "support"
  | "integrations"
  | "intelligence";

export type AppPortalNavItem = {
  id: AppPortalNavId;
  href: string;
  labelKey: string;
  featureKey?: string;
  /** tenant_modules key — read-only entitlement adapter (no new license schema). */
  moduleKey?: string;
};

export type AppPortalNavGroup = {
  id: AppPortalNavGroupId;
  labelKey: string;
  items: AppPortalNavItem[];
  defaultExpanded?: boolean;
};

/**
 * Job 58 — canonical visible Customer APP navigation (3 product areas).
 * Underlying legacy routes remain reachable by URL; they are not listed here.
 * /app/kompis operator is preserved but intentionally omitted from primary nav.
 */
export const APP_PORTAL_NAV_GROUPS: AppPortalNavGroup[] = [
  {
    id: "kompisWeb",
    labelKey: "customerApp.portalStructure.navGroups.kompisWeb",
    defaultExpanded: true,
    items: [
      {
        id: "kompisWebDashboard",
        href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        labelKey: "customerApp.portalStructure.nav.kompisWebDashboard",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebQa",
        href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
        labelKey: "customerApp.portalStructure.nav.kompisWebQa",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebFaq",
        href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
        labelKey: "customerApp.portalStructure.nav.kompisWebFaq",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebConnection",
        href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
        labelKey: "customerApp.portalStructure.nav.kompisWebConnection",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebAppearance",
        href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
        labelKey: "customerApp.portalStructure.nav.kompisWebAppearance",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebModules",
        href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
        labelKey: "customerApp.portalStructure.nav.kompisWebModules",
        moduleKey: "website_kompis",
      },
      {
        id: "kompisWebSettings",
        href: FOUNDATION_NAV_BINDINGS.kompisWebSettings,
        labelKey: "customerApp.portalStructure.nav.kompisWebSettings",
        moduleKey: "website_kompis",
      },
    ],
  },
  {
    id: "kompisBedrift",
    labelKey: "customerApp.portalStructure.navGroups.kompisBedrift",
    defaultExpanded: true,
    items: [
      {
        id: "kompisBedriftDashboard",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftDashboard",
      },
      {
        id: "kompisBedriftEmployees",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftEmployees",
      },
      {
        id: "kompisBedriftDocuments",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftDocuments,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftDocuments",
      },
      {
        id: "kompisBedriftFaq",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftFaq",
      },
      {
        id: "kompisBedriftComms",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftComms,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftComms",
      },
      {
        id: "kompisBedriftMeetings",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftMeetings,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftMeetings",
      },
      {
        id: "kompisBedriftModules",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftModules",
      },
      {
        id: "kompisBedriftSettings",
        href: FOUNDATION_NAV_BINDINGS.kompisBedriftSettings,
        labelKey: "customerApp.portalStructure.nav.kompisBedriftSettings",
      },
    ],
  },
  {
    id: "account",
    labelKey: "customerApp.portalStructure.navGroups.account",
    defaultExpanded: true,
    items: [
      {
        id: "accountSubscription",
        href: FOUNDATION_NAV_BINDINGS.accountSubscription,
        labelKey: "customerApp.portalStructure.nav.accountSubscription",
        featureKey: "billing",
      },
      {
        id: "accountInvoices",
        href: FOUNDATION_NAV_BINDINGS.accountInvoices,
        labelKey: "customerApp.portalStructure.nav.accountInvoices",
        featureKey: "billing",
      },
      {
        id: "accountIntegrations",
        href: FOUNDATION_NAV_BINDINGS.accountIntegrations,
        labelKey: "customerApp.portalStructure.nav.accountIntegrations",
        featureKey: "integrations",
      },
      {
        id: "accountNotifications",
        href: FOUNDATION_NAV_BINDINGS.accountNotifications,
        labelKey: "customerApp.portalStructure.nav.accountNotifications",
      },
    ],
  },
];

export const APP_PORTAL_NAV: AppPortalNavItem[] = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items);

export function getAppPortalActiveNavId(pathname: string): AppPortalNavId {
  // Most-specific foundation routes first (canonical hubs + legacy deep links).
  if (pathname.startsWith("/app/account/invoices") || pathname.startsWith("/app/settings/billing/invoice-details")) {
    return "accountInvoices";
  }
  if (pathname.startsWith("/app/account/subscription") || pathname.startsWith("/app/settings/billing")) {
    return "accountSubscription";
  }
  if (pathname.startsWith("/app/account/integrations") || pathname.startsWith("/app/platform/integrations/connected")) {
    return "accountIntegrations";
  }
  if (
    pathname.startsWith("/app/account/notifications") ||
    pathname.startsWith("/app/account/notification-settings")
  ) {
    return "accountNotifications";
  }
  if (pathname.startsWith("/app/kompis-bedrift/knowledge") || pathname.startsWith("/app/settings/employee-knowledge")) {
    return "kompisBedriftFaq";
  }
  if (pathname.startsWith("/app/kompis-bedrift/modules") || pathname.startsWith("/app/settings/modules")) {
    return "kompisBedriftModules";
  }
  if (pathname.startsWith("/app/kompis-bedrift/settings")) return "kompisBedriftSettings";
  if (pathname.startsWith("/app/kompis-bedrift/employees") || pathname.startsWith("/app/organization/team")) {
    return "kompisBedriftEmployees";
  }
  if (
    pathname.startsWith("/app/kompis-bedrift/communications") ||
    pathname.startsWith("/app/organization/communications")
  ) {
    return "kompisBedriftComms";
  }
  if (pathname.startsWith("/app/kompis-bedrift/documents") || pathname.startsWith("/app/documents")) {
    return "kompisBedriftDocuments";
  }
  if (pathname.startsWith("/app/kompis-bedrift/meetings") || pathname.startsWith("/app/operations/meetings")) {
    return "kompisBedriftMeetings";
  }
  if (pathname === "/app/kompis-bedrift" || pathname === "/app/kompis-bedrift/") {
    return "kompisBedriftDashboard";
  }
  if (pathname.startsWith("/app/website-kompis/feedback")) return "kompisWebQa";
  if (pathname.startsWith("/app/website-kompis/faq")) return "kompisWebFaq";
  if (pathname.startsWith("/app/website-kompis/appearance")) return "kompisWebAppearance";
  if (pathname.startsWith("/app/website-kompis/settings")) return "kompisWebSettings";
  if (pathname === "/app/website-kompis" || pathname === "/app/website-kompis/") {
    return "kompisWebDashboard";
  }
  if (pathname.startsWith("/app/domains")) return "kompisWebConnection";
  if (pathname.startsWith("/app/software")) return "kompisWebModules";
  if (pathname === "/app" || pathname === "/app/") return "appDashboard";

  // Longest-prefix match against foundation registry.
  const ranked = APP_PORTAL_NAV.flatMap((item) => [{ item, href: item.href }]).sort(
    (a, b) => b.href.length - a.href.length
  );
  for (const { item, href } of ranked) {
    if (href !== "/app" && pathname.startsWith(href)) return item.id;
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

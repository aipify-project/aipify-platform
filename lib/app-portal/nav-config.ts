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
  | "kompisBedriftConnection"
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
  /** Visual band only. Does not change the route or who can see the item. */
  menuBand?: "commerce";
};

export type AppPortalNavGroup = {
  id: AppPortalNavGroupId;
  labelKey: string;
  items: AppPortalNavItem[];
  defaultExpanded?: boolean;
};

/**
 * Job 60 — flat product menus (no nested Account group in the sidebar).
 * Shared Faktura/Abonnement items appear in both product order lists.
 * Integrations & notifications are settings-page cards, not primary nav.
 * Appearance remains a route under Web settings, not a sidebar row.
 */
const SHARED_ACCOUNT_INVOICES: AppPortalNavItem = {
  id: "accountInvoices",
  href: FOUNDATION_NAV_BINDINGS.accountInvoices,
  labelKey: "customerApp.portalStructure.nav.accountInvoices",
  featureKey: "billing",
};

const SHARED_ACCOUNT_SUBSCRIPTION: AppPortalNavItem = {
  id: "accountSubscription",
  href: FOUNDATION_NAV_BINDINGS.accountSubscription,
  labelKey: "customerApp.portalStructure.nav.accountSubscription",
  featureKey: "billing",
};

/** Exact Kompis Web sidebar order (owner decision). */
export const KOMPIS_WEB_FLAT_NAV: AppPortalNavItem[] = [
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
    id: "kompisWebSettings",
    href: FOUNDATION_NAV_BINDINGS.kompisWebSettings,
    labelKey: "customerApp.portalStructure.nav.kompisWebSettings",
    moduleKey: "website_kompis",
  },
  {
    id: "kompisWebModules",
    href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
    labelKey: "customerApp.portalStructure.nav.kompisWebModules",
    moduleKey: "website_kompis",
    menuBand: "commerce",
  },
  {
    ...SHARED_ACCOUNT_SUBSCRIPTION,
    menuBand: "commerce",
  },
  {
    ...SHARED_ACCOUNT_INVOICES,
    menuBand: "commerce",
  },
];

/** Exact Kompis Bedrift sidebar order (owner decision). */
export const KOMPIS_BEDRIFT_FLAT_NAV: AppPortalNavItem[] = [
  {
    id: "kompisBedriftDashboard",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftDashboard",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftEmployees",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftEmployees",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftDocuments",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftDocuments,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftDocuments",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftFaq",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftFaq",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftComms",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftComms,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftComms",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftMeetings",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftMeetings,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftMeetings",
    moduleKey: "kompis_bedrift",
  },
  SHARED_ACCOUNT_INVOICES,
  {
    id: "kompisBedriftModules",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftModules",
    moduleKey: "kompis_bedrift",
  },
  SHARED_ACCOUNT_SUBSCRIPTION,
  {
    id: "kompisBedriftConnection",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftConnection,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftConnection",
    moduleKey: "kompis_bedrift",
  },
  {
    id: "kompisBedriftSettings",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftSettings,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftSettings",
    moduleKey: "kompis_bedrift",
  },
];

/**
 * Capability contract source — product groups only (no Account sidebar group).
 * Shared invoice/subscription items are listed once per product for order;
 * `buildCanonicalNavContracts` de-duplicates by id.
 */
export const APP_PORTAL_NAV_GROUPS: AppPortalNavGroup[] = [
  {
    id: "kompisWeb",
    labelKey: "customerApp.portalStructure.navGroups.kompisWeb",
    defaultExpanded: true,
    items: KOMPIS_WEB_FLAT_NAV,
  },
  {
    id: "kompisBedrift",
    labelKey: "customerApp.portalStructure.navGroups.kompisBedrift",
    defaultExpanded: true,
    items: KOMPIS_BEDRIFT_FLAT_NAV,
  },
];

/** Settings-only destinations (not primary sidebar rows). */
export const APP_SETTINGS_SURFACE_ITEMS: AppPortalNavItem[] = [
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
  {
    id: "kompisWebAppearance",
    href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
    labelKey: "customerApp.portalStructure.nav.kompisWebAppearance",
    moduleKey: "website_kompis",
  },
];

export const APP_PORTAL_NAV: AppPortalNavItem[] = (() => {
  const seen = new Set<string>();
  const items: AppPortalNavItem[] = [];
  for (const item of [
    ...KOMPIS_WEB_FLAT_NAV,
    ...KOMPIS_BEDRIFT_FLAT_NAV,
    ...APP_SETTINGS_SURFACE_ITEMS,
  ]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  return items;
})();

export function getAppPortalActiveNavId(pathname: string): AppPortalNavId {
  // Most-specific foundation routes first (canonical hubs + legacy deep links).
  if (pathname.startsWith("/app/account/invoices") || pathname.startsWith("/app/settings/billing/invoice-details")) {
    return "accountInvoices";
  }
  if (pathname.startsWith("/app/account/subscription") || pathname.startsWith("/app/settings/billing")) {
    return "accountSubscription";
  }
  // Settings surfaces — shell remaps to the active product's Settings row.
  if (pathname.startsWith("/app/website-kompis/appearance")) {
    return "kompisWebAppearance";
  }
  if (
    pathname.startsWith("/app/account/integrations") ||
    pathname.startsWith("/app/platform/integrations/connected")
  ) {
    return "accountIntegrations";
  }
  if (
    pathname.startsWith("/app/account/notifications") ||
    pathname.startsWith("/app/account/notification-settings")
  ) {
    return "accountNotifications";
  }
  if (pathname.startsWith("/app/kompis-bedrift/connection")) return "kompisBedriftConnection";
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
  if (pathname.startsWith("/app/website-kompis/connection")) return "kompisWebConnection";
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

/** Map settings deep-links to the Settings sidebar row for the active product. */
export function getAppPortalSettingsActiveNavId(
  product: "kompisWeb" | "kompisBedrift"
): AppPortalNavId {
  return product === "kompisWeb" ? "kompisWebSettings" : "kompisBedriftSettings";
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

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
  | "workspaceDashboard"
  | "softwareStore"
  | "supportTickets"
  | "salesPartnerOverview"
  | "salesPartnerProducts"
  | "salesPartnerCustomers"
  | "salesPartnerCommissions"
  | "salesPartnerAcademy"
  | "kompisWebDashboard"
  | "kompisWebQa"
  | "kompisWebFaq"
  | "kompisWebConnection"
  | "kompisWebAppearance"
  | "kompisWebUsage"
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
  | "accountProfile"
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
  | "shared"
  | "myProducts"
  | "kompisWeb"
  | "kompisBedrift"
  | "salesPartner"
  | "administration"
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
 * Unified APP shell — shared workspace + Mine Produkter module groups + administration.
 * Product-specific flat lists remain for capability contracts and deep-link stability.
 * Integrations & notifications are settings-page cards, not primary nav.
 * Appearance remains a route under Web settings, not a sidebar row.
 */
// Kept for deep-link / capability id stability (not a sidebar row in V3 tabs).
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

/** Shared workspace rows — Home, total Dashboard, product store. */
export const SHARED_WORKSPACE_NAV: AppPortalNavItem[] = [
  {
    id: "appDashboard",
    href: FOUNDATION_NAV_BINDINGS.appHome,
    labelKey: "customerApp.portalStructure.nav.appDashboard",
  },
  {
    id: "workspaceDashboard",
    href: FOUNDATION_NAV_BINDINGS.workspaceDashboard,
    labelKey: "customerApp.portalStructure.nav.workspaceDashboard",
  },
  {
    id: "softwareStore",
    href: FOUNDATION_NAV_BINDINGS.softwareStore,
    labelKey: "customerApp.portalStructure.nav.softwareStore",
  },
];

/** Kompis Web module children (Mine Produkter) — no shared Home duplicate. */
export const KOMPIS_WEB_MODULE_NAV: AppPortalNavItem[] = [
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
];

/** Kompis Bedrift module children (Mine Produkter). */
export const KOMPIS_BEDRIFT_MODULE_NAV: AppPortalNavItem[] = [
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
  {
    id: "kompisBedriftModules",
    href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
    labelKey: "customerApp.portalStructure.nav.kompisBedriftModules",
    moduleKey: "kompis_bedrift",
  },
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
 * Sales Partner module children — only when partner identity is authorized.
 * Routes point at APP thin hosts under /app/sales-partner/* (Phase B/C).
 */
export const SALES_PARTNER_MODULE_NAV: AppPortalNavItem[] = [
  {
    id: "salesPartnerOverview",
    href: FOUNDATION_NAV_BINDINGS.salesPartnerOverview,
    labelKey: "customerApp.portalStructure.nav.salesPartnerOverview",
  },
  {
    id: "salesPartnerProducts",
    href: FOUNDATION_NAV_BINDINGS.salesPartnerProducts,
    labelKey: "customerApp.portalStructure.nav.salesPartnerProducts",
  },
  {
    id: "salesPartnerCustomers",
    href: FOUNDATION_NAV_BINDINGS.salesPartnerCustomers,
    labelKey: "customerApp.portalStructure.nav.salesPartnerCustomers",
  },
  {
    id: "salesPartnerCommissions",
    href: FOUNDATION_NAV_BINDINGS.salesPartnerCommissions,
    labelKey: "customerApp.portalStructure.nav.salesPartnerCommissions",
  },
  {
    id: "salesPartnerAcademy",
    href: FOUNDATION_NAV_BINDINGS.salesPartnerAcademy,
    labelKey: "customerApp.portalStructure.nav.salesPartnerAcademy",
  },
];

/** Shared administration — subscription, invoices, tickets, account. */
export const ADMINISTRATION_NAV: AppPortalNavItem[] = [
  SHARED_ACCOUNT_SUBSCRIPTION,
  SHARED_ACCOUNT_INVOICES,
  {
    id: "supportTickets",
    href: FOUNDATION_NAV_BINDINGS.supportTickets,
    labelKey: "customerApp.portalStructure.nav.supportTickets",
  },
  {
    id: "accountProfile",
    href: FOUNDATION_NAV_BINDINGS.accountProfile,
    labelKey: "customerApp.portalStructure.nav.accountProfile",
  },
];

/**
 * Legacy flat product menus (Job 60 order) — retained for capability contracts /
 * activeProduct presentation helpers. Unified shell uses module nav + shared groups.
 */
export const KOMPIS_WEB_FLAT_NAV: AppPortalNavItem[] = [
  SHARED_WORKSPACE_NAV[0]!,
  ...KOMPIS_WEB_MODULE_NAV,
  {
    ...SHARED_ACCOUNT_SUBSCRIPTION,
    menuBand: "commerce",
  },
];

export const KOMPIS_BEDRIFT_FLAT_NAV: AppPortalNavItem[] = [
  SHARED_WORKSPACE_NAV[0]!,
  ...KOMPIS_BEDRIFT_MODULE_NAV.filter(
    (item) => item.id !== "kompisBedriftConnection" && item.id !== "kompisBedriftSettings"
  ),
  {
    ...SHARED_ACCOUNT_SUBSCRIPTION,
    menuBand: "commerce",
  },
  ...KOMPIS_BEDRIFT_MODULE_NAV.filter(
    (item) => item.id === "kompisBedriftConnection" || item.id === "kompisBedriftSettings"
  ),
];

/**
 * Capability contract source — shared + module + administration groups.
 * `buildCanonicalNavContracts` de-duplicates by id.
 */
export const APP_PORTAL_NAV_GROUPS: AppPortalNavGroup[] = [
  {
    id: "shared",
    labelKey: "customerApp.portalStructure.navGroups.shared",
    defaultExpanded: true,
    items: SHARED_WORKSPACE_NAV,
  },
  {
    id: "kompisWeb",
    labelKey: "customerApp.portalStructure.navGroups.kompisWeb",
    defaultExpanded: true,
    items: KOMPIS_WEB_MODULE_NAV,
  },
  {
    id: "kompisBedrift",
    labelKey: "customerApp.portalStructure.navGroups.kompisBedrift",
    defaultExpanded: true,
    items: KOMPIS_BEDRIFT_MODULE_NAV,
  },
  {
    id: "salesPartner",
    labelKey: "customerApp.portalStructure.navGroups.salesPartner",
    defaultExpanded: false,
    items: SALES_PARTNER_MODULE_NAV,
  },
  {
    id: "administration",
    labelKey: "customerApp.portalStructure.navGroups.administration",
    defaultExpanded: true,
    items: ADMINISTRATION_NAV,
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
  /** Usage/quota read — deep-link from Web hub; not a separate commerce checkout. */
  {
    id: "kompisWebUsage",
    href: FOUNDATION_NAV_BINDINGS.kompisWebUsage,
    labelKey: "customerApp.portalStructure.nav.kompisWebUsage",
    moduleKey: "website_kompis",
  },
  /** Software surface — deep-link / store; not a sidebar commerce row in V3. */
  {
    id: "kompisWebModules",
    href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
    labelKey: "customerApp.portalStructure.nav.kompisWebModules",
    moduleKey: "website_kompis",
  },
  /** Invoice deep-link target — Abonnement tab hosts the UI. */
  SHARED_ACCOUNT_INVOICES,
];

export const APP_PORTAL_NAV: AppPortalNavItem[] = (() => {
  const seen = new Set<string>();
  const items: AppPortalNavItem[] = [];
  for (const item of [
    ...SHARED_WORKSPACE_NAV,
    ...KOMPIS_WEB_MODULE_NAV,
    ...KOMPIS_BEDRIFT_MODULE_NAV,
    ...SALES_PARTNER_MODULE_NAV,
    ...ADMINISTRATION_NAV,
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
  if (pathname === "/app/dashboard" || pathname.startsWith("/app/dashboard/")) {
    return "workspaceDashboard";
  }
  if (pathname.startsWith("/app/explore")) {
    return "softwareStore";
  }
  if (pathname.startsWith("/app/support/requests") || pathname.startsWith("/app/support/history")) {
    return "supportTickets";
  }
  if (pathname.startsWith("/app/sales-partner/academy") || pathname.startsWith("/partners/academy")) {
    return "salesPartnerAcademy";
  }
  if (
    pathname.startsWith("/app/sales-partner/commissions") ||
    pathname.startsWith("/partners/settlement") ||
    pathname.startsWith("/partners/business-continuity/commission")
  ) {
    return "salesPartnerCommissions";
  }
  if (
    pathname.startsWith("/app/sales-partner/customers") ||
    pathname.startsWith("/app/sales-partner/leads") ||
    pathname.startsWith("/app/sales-partner/pipeline") ||
    pathname.startsWith("/partners/customers")
  ) {
    return "salesPartnerCustomers";
  }
  if (
    pathname.startsWith("/app/sales-partner/products") ||
    pathname.startsWith("/partners/marketing/product-catalog")
  ) {
    return "salesPartnerProducts";
  }
  if (
    pathname === "/app/sales-partner" ||
    pathname === "/app/sales-partner/" ||
    pathname === "/partners" ||
    pathname === "/partners/"
  ) {
    return "salesPartnerOverview";
  }
  if (
    pathname === "/app/profile" ||
    pathname.startsWith("/app/profile/") ||
    pathname.startsWith("/app/account/profile")
  ) {
    return "accountProfile";
  }
  // Invoices / modules / license deep-links highlight the single Abonnement entry (V3 tabs).
  if (
    pathname.startsWith("/app/account/invoices") ||
    pathname.startsWith("/app/settings/billing/invoice-details") ||
    pathname.startsWith("/app/settings/modules") ||
    pathname.startsWith("/app/license") ||
    pathname.startsWith("/app/licenses")
  ) {
    return "accountSubscription";
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
  if (pathname.startsWith("/app/kompis-bedrift/modules")) {
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
  if (pathname.startsWith("/app/website-kompis/usage")) return "kompisWebUsage";
  if (pathname.startsWith("/app/website-kompis/settings")) return "kompisWebSettings";
  if (pathname === "/app/website-kompis" || pathname === "/app/website-kompis/") {
    return "kompisWebDashboard";
  }
  if (pathname.startsWith("/app/domains")) return "kompisWebConnection";
  if (pathname.startsWith("/app/software") || pathname.startsWith("/app/explore")) return "kompisWebModules";
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

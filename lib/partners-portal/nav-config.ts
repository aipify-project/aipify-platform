export const PARTNERS_PORTAL_HOME_ROUTE = "/partners";

/** platform_support team_role partner_manager maps to partner_manager; partner_owner/sales_member → partner */
export const PARTNERS_PORTAL_ROLES = ["partner", "partner_manager", "super_admin"] as const;

export type PartnersPortalRole = (typeof PARTNERS_PORTAL_ROLES)[number];

export type PartnersPortalNavId =
  | "overview"
  | "performanceSummary"
  | "goals"
  | "leads"
  | "pipeline"
  | "prospects"
  | "followUps"
  | "referralLinks"
  | "referralPerformance"
  | "referralRewards"
  | "settlementPortal"
  | "certifications"
  | "trainingPrograms"
  | "salesPlaybooks"
  | "knowledgeMaterials"
  | "marketingAssets"
  | "campaignTemplates"
  | "emailTemplates"
  | "productCatalog"
  | "rankings"
  | "revenueAttribution"
  | "partnerMetrics"
  | "historicalPerformance"
  | "profile"
  | "teamMembers"
  | "notifications"
  | "settings";

export type PartnersPortalNavGroupId =
  | "dashboard"
  | "customers"
  | "referrals"
  | "settlement"
  | "academy"
  | "marketing"
  | "performance"
  | "account";

export type PartnersPortalNavItem = {
  id: PartnersPortalNavId;
  href: string;
  labelKey: string;
};

export type PartnersPortalNavGroup = {
  id: PartnersPortalNavGroupId;
  labelKey: string;
  items: PartnersPortalNavItem[];
  defaultExpanded?: boolean;
};

export const PARTNERS_PORTAL_NAV_GROUPS: PartnersPortalNavGroup[] = [
  {
    id: "dashboard",
    labelKey: "partnersPortal.navGroups.dashboard",
    defaultExpanded: true,
    items: [
      { id: "overview", href: "/partners", labelKey: "partnersPortal.nav.overview" },
      { id: "performanceSummary", href: "/partners/performance-summary", labelKey: "partnersPortal.nav.performanceSummary" },
      { id: "goals", href: "/partners/goals", labelKey: "partnersPortal.nav.goals" },
    ],
  },
  {
    id: "customers",
    labelKey: "partnersPortal.navGroups.customers",
    items: [
      { id: "leads", href: "/partners/customers/leads", labelKey: "partnersPortal.nav.leads" },
      { id: "pipeline", href: "/partners/customers/pipeline", labelKey: "partnersPortal.nav.pipeline" },
      { id: "prospects", href: "/partners/customers/prospects", labelKey: "partnersPortal.nav.prospects" },
      { id: "followUps", href: "/partners/customers/follow-ups", labelKey: "partnersPortal.nav.followUps" },
    ],
  },
  {
    id: "referrals",
    labelKey: "partnersPortal.navGroups.referrals",
    items: [
      { id: "referralLinks", href: "/partners/referrals/links", labelKey: "partnersPortal.nav.referralLinks" },
      { id: "referralPerformance", href: "/partners/referrals/performance", labelKey: "partnersPortal.nav.referralPerformance" },
      { id: "referralRewards", href: "/partners/referrals/rewards", labelKey: "partnersPortal.nav.referralRewards" },
    ],
  },
  {
    id: "settlement",
    labelKey: "partnersPortal.navGroups.settlement",
    items: [
      { id: "settlementPortal", href: "/partners/settlement", labelKey: "partnersPortal.nav.settlementPortal" },
    ],
  },
  {
    id: "academy",
    labelKey: "partnersPortal.navGroups.academy",
    items: [
      { id: "certifications", href: "/partners/academy/certifications", labelKey: "partnersPortal.nav.certifications" },
      { id: "trainingPrograms", href: "/partners/academy/training", labelKey: "partnersPortal.nav.trainingPrograms" },
      { id: "salesPlaybooks", href: "/partners/academy/playbooks", labelKey: "partnersPortal.nav.salesPlaybooks" },
      { id: "knowledgeMaterials", href: "/partners/academy/knowledge", labelKey: "partnersPortal.nav.knowledgeMaterials" },
    ],
  },
  {
    id: "marketing",
    labelKey: "partnersPortal.navGroups.marketing",
    items: [
      { id: "marketingAssets", href: "/partners/marketing/assets", labelKey: "partnersPortal.nav.marketingAssets" },
      { id: "campaignTemplates", href: "/partners/marketing/campaigns", labelKey: "partnersPortal.nav.campaignTemplates" },
      { id: "emailTemplates", href: "/partners/marketing/email-templates", labelKey: "partnersPortal.nav.emailTemplates" },
      { id: "productCatalog", href: "/partners/marketing/product-catalog", labelKey: "partnersPortal.nav.productCatalog" },
    ],
  },
  {
    id: "performance",
    labelKey: "partnersPortal.navGroups.performance",
    items: [
      { id: "rankings", href: "/partners/performance/rankings", labelKey: "partnersPortal.nav.rankings" },
      { id: "revenueAttribution", href: "/partners/performance/revenue-attribution", labelKey: "partnersPortal.nav.revenueAttribution" },
      { id: "partnerMetrics", href: "/partners/performance/metrics", labelKey: "partnersPortal.nav.partnerMetrics" },
      { id: "historicalPerformance", href: "/partners/performance/history", labelKey: "partnersPortal.nav.historicalPerformance" },
    ],
  },
  {
    id: "account",
    labelKey: "partnersPortal.navGroups.account",
    items: [
      { id: "profile", href: "/partners/account/profile", labelKey: "partnersPortal.nav.profile" },
      { id: "teamMembers", href: "/partners/account/team", labelKey: "partnersPortal.nav.teamMembers" },
      { id: "notifications", href: "/partners/account/notifications", labelKey: "partnersPortal.nav.notifications" },
      { id: "settings", href: "/partners/account/settings", labelKey: "partnersPortal.nav.settings" },
    ],
  },
];

export const PARTNERS_LEGACY_REDIRECTS: Record<string, string> = {
  "/growth-partner": "/partners",
  "/growth-partner/dashboard": "/partners",
  "/growth-partner/leads": "/partners/customers/leads",
  "/growth-partner/referrals": "/partners/referrals/performance",
  "/growth-partner/commissions": "/partners/settlement",
  "/growth-partner/payouts": "/partners/settlement",
  "/growth-partner/academy": "/partners/academy/certifications",
  "/growth-partner/assets": "/partners/marketing/assets",
  "/growth-partner/team": "/partners/account/team",
  "/growth-partner/settings": "/partners/account/settings",
  "/growth": "/partners",
  "/growth/performance-summary": "/partners/performance-summary",
  "/growth/goals": "/partners/goals",
  "/growth/customers/leads": "/partners/customers/leads",
  "/growth/customers/pipeline": "/partners/customers/pipeline",
  "/growth/customers/prospects": "/partners/customers/prospects",
  "/growth/customers/follow-ups": "/partners/customers/follow-ups",
  "/growth/referrals/links": "/partners/referrals/links",
  "/growth/referrals/performance": "/partners/referrals/performance",
  "/growth/referrals/rewards": "/partners/referrals/rewards",
  "/growth/academy/certifications": "/partners/academy/certifications",
  "/growth/academy/training": "/partners/academy/training",
  "/growth/academy/playbooks": "/partners/academy/playbooks",
  "/growth/academy/knowledge": "/partners/academy/knowledge",
  "/growth/marketing/assets": "/partners/marketing/assets",
  "/growth/marketing/campaigns": "/partners/marketing/campaigns",
  "/growth/marketing/email-templates": "/partners/marketing/email-templates",
  "/growth/marketing/product-catalog": "/partners/marketing/product-catalog",
  "/growth/performance/rankings": "/partners/performance/rankings",
  "/growth/performance/revenue-attribution": "/partners/performance/revenue-attribution",
  "/growth/performance/metrics": "/partners/performance/metrics",
  "/growth/performance/history": "/partners/performance/history",
  "/growth/account/profile": "/partners/account/profile",
  "/growth/account/team": "/partners/account/team",
  "/growth/account/notifications": "/partners/account/notifications",
  "/growth/account/settings": "/partners/account/settings",
};

export function getPartnersLegacyRedirect(pathname: string): string | null {
  if (PARTNERS_LEGACY_REDIRECTS[pathname]) {
    return PARTNERS_LEGACY_REDIRECTS[pathname];
  }
  if (pathname.startsWith("/growth/")) {
    return pathname.replace(/^\/growth/, "/partners");
  }
  return null;
}

export function getPartnersActiveNavId(pathname: string): PartnersPortalNavId {
  if (pathname === "/partners") return "overview";
  if (pathname.startsWith("/partners/settlement")) return "settlementPortal";
  for (const group of PARTNERS_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/partners" && pathname.startsWith(item.href)) {
        return item.id;
      }
    }
  }
  return "overview";
}

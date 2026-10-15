import type { PlatformNavId } from "./nav-config";

export type PlatformNavGroupId =
  | "dashboard"
  | "operations"
  | "customers"
  | "commercial"
  | "knowledge"
  | "product"
  | "auditGovernance"
  | "sellers"
  | "system";

export type PlatformNavGroupItem = {
  id: PlatformNavId;
  labelKey: string;
};

export type PlatformNavGroup = {
  id: PlatformNavGroupId;
  labelKey: string;
  items: PlatformNavGroupItem[];
  /** When true, group starts expanded on Platform desktop (multi-open). */
  defaultExpanded?: boolean;
};

/**
 * Platform sidebar structure (master navigation design standard).
 * Order: Dashboard → Drift → Kunder → Avtaler og salg → Kunnskap → Produkt →
 * Kontroll og styring → Selgere (last).
 * Dashboard is pinned outside collapsible groups; routes stay on existing hrefs.
 */
export const PLATFORM_NAV_GROUPS: PlatformNavGroup[] = [
  {
    id: "dashboard",
    labelKey: "platform.navGroups.dashboard",
    items: [{ id: "overview", labelKey: "platform.nav.overview" }],
  },
  {
    id: "operations",
    labelKey: "platform.navGroups.operations",
    defaultExpanded: true,
    items: [
      { id: "operationsOverview", labelKey: "platform.nav.operationsOverview" },
      { id: "platformHealth", labelKey: "platform.nav.platformHealth" },
      { id: "kompisAi", labelKey: "platform.nav.kompisAi" },
      { id: "websiteReleaseVerification", labelKey: "platform.nav.websiteReleaseVerification" },
      { id: "deployments", labelKey: "platform.nav.deployments" },
      { id: "installationOversight", labelKey: "platform.nav.installationOversight" },
      { id: "operationsAuditLogs", labelKey: "platform.nav.operationsAuditLogs" },
      { id: "unonightPilot", labelKey: "platform.nav.unonightPilot" },
    ],
  },
  {
    id: "customers",
    labelKey: "platform.navGroups.customers",
    defaultExpanded: true,
    items: [
      { id: "organizations", labelKey: "platform.nav.organizations" },
      { id: "customerSuccess", labelKey: "platform.nav.customerSuccess" },
      { id: "support", labelKey: "platform.nav.support" },
    ],
  },
  {
    id: "commercial",
    labelKey: "platform.navGroups.commercial",
    defaultExpanded: true,
    items: [
      // Finance overview first, then invoices / agreements / marketplace
      { id: "payments", labelKey: "platform.nav.payments" },
      { id: "invoices", labelKey: "platform.nav.invoices" },
      { id: "subscriptions", labelKey: "platform.nav.subscriptions" },
      { id: "marketplace", labelKey: "platform.nav.marketplace" },
    ],
  },
  {
    id: "knowledge",
    labelKey: "platform.navGroups.knowledge",
    defaultExpanded: true,
    items: [
      { id: "knowledgeCenter", labelKey: "platform.nav.knowledgeCenter" },
      { id: "documentation", labelKey: "platform.nav.documentation" },
    ],
  },
  {
    id: "product",
    labelKey: "platform.navGroups.product",
    defaultExpanded: true,
    items: [
      { id: "productManagement", labelKey: "platform.nav.productManagement" },
      { id: "businessPacks", labelKey: "platform.nav.businessPacks" },
      { id: "licenses", labelKey: "platform.nav.licenses" },
      { id: "websiteKompisPlans", labelKey: "platform.nav.websiteKompisPlans" },
    ],
  },
  {
    id: "auditGovernance",
    labelKey: "platform.navGroups.auditGovernance",
    defaultExpanded: true,
    items: [
      { id: "system", labelKey: "platform.nav.system" },
      { id: "translationManagement", labelKey: "platform.nav.translationManagement" },
      { id: "activityLogs", labelKey: "platform.nav.activityLogs" },
      { id: "governanceRecords", labelKey: "platform.nav.governanceRecords" },
      { id: "securityReviews", labelKey: "platform.nav.securityReviews" },
    ],
  },
  {
    id: "sellers",
    labelKey: "platform.navGroups.sellers",
    defaultExpanded: true,
    items: [
      { id: "growthPartners", labelKey: "platform.nav.growthPartners" },
      {
        id: "growthPartnerAttribution",
        labelKey: "platform.nav.growthPartnerAttribution",
      },
      { id: "commissions", labelKey: "platform.nav.commissions" },
    ],
  },
];

/** Bumped so desktop multi-open defaults apply for existing operators. */
export const PLATFORM_NAV_GROUP_STORAGE_KEY = "aipify.platform.navGroups.expanded.v4";
export const PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.platform.navGroups.open.v4";
export const PLATFORM_NAV_EXPANDED_SET_STORAGE_KEY =
  "aipify.platform.navGroups.expandedSet.v4";
export const PLATFORM_NAV_LAST_ITEM_STORAGE_KEY = "aipify.platform.nav.lastItem.v4";
export const PLATFORM_NAV_INITIALIZED_STORAGE_KEY = "aipify.platform.nav.initialized.v4";
export const PLATFORM_NAV_COMPACT_STORAGE_KEY = "aipify.platform.nav.compact.v4";

export const PLATFORM_COLLAPSIBLE_GROUPS: PlatformNavGroupId[] = [
  "operations",
  "customers",
  "commercial",
  "knowledge",
  "product",
  "auditGovernance",
  "sellers",
];

/** Always-visible top group — not collapsible. */
export const PLATFORM_FIXED_NAV_GROUPS: PlatformNavGroupId[] = ["dashboard"];

/** Groups that should start open on Platform desktop. */
export function getPlatformDefaultExpandedGroupIds(): PlatformNavGroupId[] {
  return PLATFORM_NAV_GROUPS.filter(
    (group) =>
      PLATFORM_COLLAPSIBLE_GROUPS.includes(group.id) && group.defaultExpanded !== false,
  ).map((group) => group.id);
}

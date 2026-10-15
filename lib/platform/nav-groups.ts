import type { PlatformNavId } from "./nav-config";

export type PlatformNavGroupId =
  | "dashboard"
  | "operations"
  | "customers"
  | "sellers"
  | "commercial"
  | "knowledge"
  | "product"
  | "auditGovernance"
  | "system";

export type PlatformNavGroupItem = {
  id: PlatformNavId;
  labelKey: string;
};

export type PlatformNavGroup = {
  id: PlatformNavGroupId;
  labelKey: string;
  items: PlatformNavGroupItem[];
  defaultExpanded?: boolean;
};

/**
 * Platform sidebar structure (master navigation design standard).
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
    items: [
      { id: "organizations", labelKey: "platform.nav.organizations" },
      { id: "customerSuccess", labelKey: "platform.nav.customerSuccess" },
      { id: "support", labelKey: "platform.nav.support" },
    ],
  },
  {
    id: "sellers",
    labelKey: "platform.navGroups.sellers",
    items: [
      { id: "growthPartners", labelKey: "platform.nav.growthPartners" },
      {
        id: "growthPartnerAttribution",
        labelKey: "platform.nav.growthPartnerAttribution",
      },
      { id: "commissions", labelKey: "platform.nav.commissions" },
    ],
  },
  {
    id: "commercial",
    labelKey: "platform.navGroups.commercial",
    items: [
      { id: "payments", labelKey: "platform.nav.payments" },
      { id: "invoices", labelKey: "platform.nav.invoices" },
      { id: "subscriptions", labelKey: "platform.nav.subscriptions" },
      { id: "marketplace", labelKey: "platform.nav.marketplace" },
    ],
  },
  {
    id: "knowledge",
    labelKey: "platform.navGroups.knowledge",
    items: [
      { id: "knowledgeCenter", labelKey: "platform.nav.knowledgeCenter" },
      { id: "documentation", labelKey: "platform.nav.documentation" },
    ],
  },
  {
    id: "product",
    labelKey: "platform.navGroups.product",
    items: [
      { id: "productManagement", labelKey: "platform.nav.productManagement" },
      { id: "businessPacks", labelKey: "platform.nav.businessPacks" },
      { id: "websiteKompisPlans", labelKey: "platform.nav.websiteKompisPlans" },
    ],
  },
  {
    id: "auditGovernance",
    labelKey: "platform.navGroups.auditGovernance",
    items: [
      { id: "system", labelKey: "platform.nav.system" },
      { id: "translationManagement", labelKey: "platform.nav.translationManagement" },
      { id: "activityLogs", labelKey: "platform.nav.activityLogs" },
      { id: "governanceRecords", labelKey: "platform.nav.governanceRecords" },
      { id: "securityReviews", labelKey: "platform.nav.securityReviews" },
    ],
  },
];

export const PLATFORM_NAV_GROUP_STORAGE_KEY = "aipify.platform.navGroups.expanded.v3";
export const PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.platform.navGroups.open.v3";
export const PLATFORM_NAV_LAST_ITEM_STORAGE_KEY = "aipify.platform.nav.lastItem.v3";
export const PLATFORM_NAV_INITIALIZED_STORAGE_KEY = "aipify.platform.nav.initialized.v3";
export const PLATFORM_NAV_COMPACT_STORAGE_KEY = "aipify.platform.nav.compact.v3";

export const PLATFORM_COLLAPSIBLE_GROUPS: PlatformNavGroupId[] = [
  "operations",
  "customers",
  "sellers",
  "commercial",
  "knowledge",
  "product",
  "auditGovernance",
];

/** Always-visible top group — not collapsible. */
export const PLATFORM_FIXED_NAV_GROUPS: PlatformNavGroupId[] = ["dashboard"];

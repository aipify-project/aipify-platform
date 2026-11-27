import type { PlatformNavId } from "./nav-config";

/**
 * Daily Platform Admin sidebar groups (simplification V1).
 * Order: Dashboard → Support → Kunder → Moduler → Selgere → Betaling → Drift → Innstillinger.
 * Routes stay on existing hrefs — UI regroup only; stubs removed from daily menu.
 */
export type PlatformNavGroupId =
  | "dashboard"
  | "support"
  | "customers"
  | "modules"
  | "sellers"
  | "billing"
  | "operations"
  | "settings"
  /** Search-index fallback for registry items not in the daily sidebar. */
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
 * Compact daily sidebar. Selgere is a single entry; in-page hub tabs cover the 13 routes.
 * Confirmed stubs (documentation, productManagement, translationManagement, activityLogs)
 * are not listed — routes remain reachable by direct URL.
 */
export const PLATFORM_NAV_GROUPS: PlatformNavGroup[] = [
  {
    id: "dashboard",
    labelKey: "platform.navGroups.dashboard",
    items: [{ id: "overview", labelKey: "platform.nav.overview" }],
  },
  {
    id: "support",
    labelKey: "platform.navGroups.support",
    items: [{ id: "support", labelKey: "platform.nav.support" }],
  },
  {
    id: "customers",
    labelKey: "platform.navGroups.customers",
    defaultExpanded: true,
    items: [
      { id: "organizations", labelKey: "platform.nav.organizations" },
      { id: "customerSuccess", labelKey: "platform.nav.customerSuccess" },
    ],
  },
  {
    id: "modules",
    labelKey: "platform.navGroups.modules",
    defaultExpanded: true,
    items: [
      { id: "licenses", labelKey: "platform.nav.licenses" },
      { id: "businessPacks", labelKey: "platform.nav.businessPacks" },
      { id: "marketplace", labelKey: "platform.nav.marketplace" },
      { id: "websiteKompisPlans", labelKey: "platform.nav.websiteKompisPlans" },
    ],
  },
  {
    id: "sellers",
    labelKey: "platform.navGroups.sellers",
    defaultExpanded: true,
    items: [
      // Single sidebar entry — hub tabs on /platform/sellers/* cover remaining routes.
      { id: "sellersOverview", labelKey: "platform.nav.sellersOverview" },
    ],
  },
  {
    id: "billing",
    labelKey: "platform.navGroups.billing",
    defaultExpanded: true,
    items: [
      { id: "payments", labelKey: "platform.nav.payments" },
      { id: "invoices", labelKey: "platform.nav.invoices" },
      { id: "subscriptions", labelKey: "platform.nav.subscriptions" },
    ],
  },
  {
    id: "operations",
    labelKey: "platform.navGroups.operations",
    defaultExpanded: true,
    items: [
      { id: "operationsOverview", labelKey: "platform.nav.operationsOverview" },
      { id: "publishAndVerify", labelKey: "platform.nav.publishAndVerify" },
      { id: "kompisAi", labelKey: "platform.nav.kompisAi" },
      { id: "system", labelKey: "platform.nav.system" },
    ],
  },
  {
    id: "settings",
    labelKey: "platform.navGroups.settings",
    defaultExpanded: false,
    items: [
      { id: "knowledgeCenter", labelKey: "platform.nav.knowledgeCenter" },
      { id: "communications", labelKey: "platform.nav.communications" },
      // Advanced / Super-adjacent — keep reachable without daily Control group clutter.
      { id: "superRevision", labelKey: "platform.nav.superRevision" },
      { id: "superRoleAccess", labelKey: "platform.nav.superRoleAccess" },
      { id: "governanceRecords", labelKey: "platform.nav.governanceRecords" },
      { id: "securityReviews", labelKey: "platform.nav.securityReviews" },
    ],
  },
];

/** Bumped for simplification V1 so desktop defaults re-apply for operators. */
export const PLATFORM_NAV_GROUP_STORAGE_KEY = "aipify.platform.navGroups.expanded.v5";
export const PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.platform.navGroups.open.v5";
export const PLATFORM_NAV_EXPANDED_SET_STORAGE_KEY =
  "aipify.platform.navGroups.expandedSet.v5";
export const PLATFORM_NAV_LAST_ITEM_STORAGE_KEY = "aipify.platform.nav.lastItem.v5";
export const PLATFORM_NAV_INITIALIZED_STORAGE_KEY = "aipify.platform.nav.initialized.v5";
export const PLATFORM_NAV_COMPACT_STORAGE_KEY = "aipify.platform.nav.compact.v5";

export const PLATFORM_COLLAPSIBLE_GROUPS: PlatformNavGroupId[] = [
  "customers",
  "modules",
  "sellers",
  "billing",
  "operations",
  "settings",
];

/** Always-visible top groups — not collapsible. */
export const PLATFORM_FIXED_NAV_GROUPS: PlatformNavGroupId[] = ["dashboard", "support"];

/** Groups that should start open on Platform desktop. */
export function getPlatformDefaultExpandedGroupIds(): PlatformNavGroupId[] {
  return PLATFORM_NAV_GROUPS.filter(
    (group) =>
      PLATFORM_COLLAPSIBLE_GROUPS.includes(group.id) && group.defaultExpanded !== false,
  ).map((group) => group.id);
}

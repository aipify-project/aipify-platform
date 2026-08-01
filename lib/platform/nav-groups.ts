import type { PlatformNavId } from "./nav-config";

export type PlatformNavGroupId =
  | "overview"
  | "customers"
  | "salesFinance"
  | "partners"
  | "productCore"
  | "operations"
  | "governance"
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
 * Platform global control-plane navigation.
 * Only surfaces with real backends or explicit hubs — stubs stay out of primary nav.
 */
export const PLATFORM_NAV_GROUPS: PlatformNavGroup[] = [
  {
    id: "overview",
    labelKey: "platform.navGroups.overview",
    defaultExpanded: true,
    items: [{ id: "overview", labelKey: "platform.nav.overview" }],
  },
  {
    id: "customers",
    labelKey: "platform.navGroups.customers",
    items: [
      { id: "organizations", labelKey: "platform.nav.organizations" },
      { id: "customerSuccess", labelKey: "platform.nav.customerSuccess" },
      { id: "support", labelKey: "platform.nav.support" },
      { id: "subscriptions", labelKey: "platform.nav.subscriptions" },
      { id: "licenses", labelKey: "platform.nav.licenses" },
      { id: "installationOversight", labelKey: "platform.nav.installationOversight" },
    ],
  },
  {
    id: "salesFinance",
    labelKey: "platform.navGroups.salesFinance",
    items: [
      { id: "payments", labelKey: "platform.nav.payments" },
      { id: "invoices", labelKey: "platform.nav.invoices" },
      { id: "paymentOperations", labelKey: "platform.nav.paymentOperations" },
      { id: "commercialIntelligence", labelKey: "platform.nav.commercialIntelligence" },
      { id: "taxVerification", labelKey: "platform.nav.taxVerification" },
    ],
  },
  {
    id: "partners",
    labelKey: "platform.navGroups.partners",
    items: [
      { id: "growthPartners", labelKey: "platform.nav.growthPartners" },
      {
        id: "growthPartnerAttribution",
        labelKey: "platform.billingCommerceCenter.nav.growthPartnerAttribution",
      },
      { id: "commissions", labelKey: "platform.billingCommerceCenter.nav.commissions" },
    ],
  },
  {
    id: "productCore",
    labelKey: "platform.navGroups.productCore",
    items: [
      { id: "verifiedProviders", labelKey: "platform.nav.verifiedProviders" },
      { id: "providerOnboarding", labelKey: "platform.nav.providerOnboarding" },
      { id: "moduleRegistry", labelKey: "platform.nav.moduleRegistry" },
      { id: "kompisAi", labelKey: "platform.nav.kompisAi" },
      { id: "websiteReleaseVerification", labelKey: "platform.nav.websiteReleaseVerification" },
      { id: "knowledgeCenter", labelKey: "platform.nav.knowledgeCenter" },
    ],
  },
  {
    id: "operations",
    labelKey: "platform.navGroups.operations",
    items: [
      { id: "operationsOverview", labelKey: "platform.nav.operationsOverview" },
      { id: "platformHealth", labelKey: "platform.nav.platformHealth" },
      { id: "reliabilityOperations", labelKey: "platform.nav.reliabilityOperations" },
      { id: "changeOperations", labelKey: "platform.nav.changeOperations" },
      { id: "exceptionQueue", labelKey: "platform.nav.exceptionQueue" },
    ],
  },
  {
    id: "governance",
    labelKey: "platform.navGroups.governance",
    items: [
      { id: "actions", labelKey: "platform.nav.actions" },
      { id: "securityReviews", labelKey: "platform.nav.securityReviews" },
      { id: "governanceRecords", labelKey: "platform.nav.governanceRecords" },
      { id: "trust", labelKey: "platform.nav.trust" },
    ],
  },
];

export const PLATFORM_NAV_GROUP_STORAGE_KEY = "aipify.platform.navGroups.expanded.v3";
export const PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.platform.navGroups.open.v3";
export const PLATFORM_NAV_LAST_ITEM_STORAGE_KEY = "aipify.platform.nav.lastItem.v3";
export const PLATFORM_NAV_INITIALIZED_STORAGE_KEY = "aipify.platform.nav.initialized.v3";
export const PLATFORM_NAV_COMPACT_STORAGE_KEY = "aipify.platform.nav.compact.v3";

export const PLATFORM_COLLAPSIBLE_GROUPS: PlatformNavGroupId[] = [
  "overview",
  "customers",
  "salesFinance",
  "partners",
  "productCore",
  "operations",
  "governance",
];

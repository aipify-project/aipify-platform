import type { PlatformNavId } from "./nav-config";

export type PlatformNavGroupId =
  | "platformAdmin"
  | "knowledgeGovernance"
  | "customerOperations"
  | "revenueBilling"
  | "deploymentPlatform"
  | "intelligenceAutomation"
  | "marketplace"
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

/** Platform Admin — grouped navigation for enterprise IA. */
export const PLATFORM_NAV_GROUPS: PlatformNavGroup[] = [
  {
    id: "platformAdmin",
    labelKey: "platform.navGroups.platformAdmin",
    defaultExpanded: true,
    items: [
      { id: "overview", labelKey: "platform.nav.overview" },
      { id: "executive", labelKey: "platform.nav.executive" },
      { id: "executiveOperationsCenter", labelKey: "platform.nav.executiveOperationsCenter" },
      { id: "announcementCenter", labelKey: "platform.nav.announcementCenter" },
      { id: "feedbackCenter", labelKey: "platform.nav.feedbackCenter" },
      { id: "productRoadmapCenter", labelKey: "platform.nav.productRoadmapCenter" },
      { id: "productReleaseCenter", labelKey: "platform.nav.productReleaseCenter" },
    ],
  },
  {
    id: "knowledgeGovernance",
    labelKey: "platform.navGroups.knowledgeGovernance",
    items: [
      { id: "platformKnowledgeEvolutionCenter", labelKey: "platform.nav.platformKnowledgeEvolutionCenter" },
      { id: "platformComplianceGovernanceCenter", labelKey: "platform.nav.platformComplianceGovernanceCenter" },
      { id: "platformPlaybookCenter", labelKey: "platform.nav.platformPlaybookCenter" },
      { id: "platformAcademyStudio", labelKey: "platform.nav.platformAcademyStudio" },
    ],
  },
  {
    id: "customerOperations",
    labelKey: "platform.navGroups.customerOperations",
    items: [
      { id: "customers", labelKey: "platform.nav.customers" },
      { id: "customerLifecycle", labelKey: "platform.nav.customerLifecycle" },
      { id: "customerSuccessOperations", labelKey: "platform.nav.customerSuccessOperations" },
      { id: "support", labelKey: "platform.nav.support" },
    ],
  },
  {
    id: "revenueBilling",
    labelKey: "platform.navGroups.revenueBilling",
    items: [
      { id: "subscriptions", labelKey: "platform.nav.subscriptions" },
      { id: "billing", labelKey: "platform.nav.billing" },
      { id: "paymentOperations", labelKey: "platform.nav.paymentOperations" },
      { id: "paymentHealth", labelKey: "platform.nav.paymentHealth" },
      { id: "paymentAnalytics", labelKey: "platform.nav.paymentAnalytics" },
      { id: "subscriptionOperations", labelKey: "platform.nav.subscriptionOperations" },
      { id: "revenueOperations", labelKey: "platform.nav.revenueOperations" },
      { id: "invoices", labelKey: "platform.nav.enterpriseInvoices" },
      { id: "paymentProviders", labelKey: "platform.nav.paymentProviders" },
      { id: "metrics", labelKey: "platform.nav.metrics" },
    ],
  },
  {
    id: "deploymentPlatform",
    labelKey: "platform.navGroups.deploymentPlatform",
    items: [
      { id: "installations", labelKey: "platform.nav.installations" },
      { id: "installEngine", labelKey: "platform.nav.installEngine" },
      { id: "updates", labelKey: "platform.nav.updates" },
      { id: "pilotOperations", labelKey: "platform.nav.pilotOperations" },
      { id: "pilotInstall", labelKey: "platform.nav.pilotInstall" },
    ],
  },
  {
    id: "intelligenceAutomation",
    labelKey: "platform.navGroups.intelligenceAutomation",
    items: [
      { id: "intelligence", labelKey: "platform.nav.intelligence" },
      { id: "automations", labelKey: "platform.nav.automations" },
      { id: "actions", labelKey: "platform.nav.actions" },
      { id: "analyticsCustomerJourneys", labelKey: "platform.nav.analyticsCustomerJourneys" },
    ],
  },
  {
    id: "marketplace",
    labelKey: "platform.navGroups.marketplace",
    items: [
      { id: "skills", labelKey: "platform.nav.skillsMarketplace" },
      { id: "companionMarketplace", labelKey: "platform.nav.companionMarketplace" },
      { id: "skillGovernancePipeline", labelKey: "platform.nav.skillGovernancePipeline" },
    ],
  },
  {
    id: "system",
    labelKey: "platform.navGroups.system",
    items: [
      { id: "trust", labelKey: "platform.nav.trust" },
      { id: "impact", labelKey: "platform.nav.impact" },
      { id: "system", labelKey: "platform.nav.system" },
    ],
  },
];

export const PLATFORM_NAV_GROUP_STORAGE_KEY = "aipify.platform.navGroups.expanded.v1";
export const PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.platform.navGroups.open.v1";
export const PLATFORM_NAV_LAST_ITEM_STORAGE_KEY = "aipify.platform.nav.lastItem.v1";
export const PLATFORM_NAV_INITIALIZED_STORAGE_KEY = "aipify.platform.nav.initialized.v1";
export const PLATFORM_NAV_COMPACT_STORAGE_KEY = "aipify.platform.nav.compact.v1";

export const PLATFORM_COLLAPSIBLE_GROUPS: PlatformNavGroupId[] = [
  "platformAdmin",
  "knowledgeGovernance",
  "customerOperations",
  "revenueBilling",
  "deploymentPlatform",
  "intelligenceAutomation",
  "marketplace",
  "system",
];

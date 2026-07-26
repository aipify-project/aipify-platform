import type { Translator } from "@/lib/i18n/translate";
import type {
  PlatformPortalCustomersLabels,
  PlatformPortalLabels,
} from "./types";

export function buildPlatformPortalLabels(t: Translator): PlatformPortalLabels {
  const d = "platform.portalStructure.dashboard";
  const f = "platform.portalStructure.foundation";
  const billingNav = "platform.billingCommerceCenter.nav";

  return {
    dashboard: {
      title: t(`${d}.title`),
      subtitle: t(`${d}.subtitle`),
      loading: t(`${d}.loading`),
      principle: t(`${d}.principle`),
      privacyNote: t(`${d}.privacyNote`),
      organizationsRequiringAttention: t(`${d}.organizationsRequiringAttention`),
      activeSubscriptions: t(`${d}.activeSubscriptions`),
      openSupportWorkload: t(`${d}.openSupportWorkload`),
      paymentStatusSummary: t(`${d}.paymentStatusSummary`),
      paymentActive: t(`${d}.paymentActive`),
      paymentPastDue: t(`${d}.paymentPastDue`),
      paymentTrialing: t(`${d}.paymentTrialing`),
      invoices: t(`${billingNav}.invoices`),
      paymentProviders: t(`${billingNav}.paymentProviders`),
      accountingIntegration: t(`${billingNav}.accountingIntegration`),
      customerSuccessIndicators: t(`${d}.customerSuccessIndicators`),
      healthyRatio: t(`${d}.healthyRatio`),
      marketplaceModeration: t(`${d}.marketplaceModeration`),
      pendingReview: t(`${d}.pendingReview`),
      published: t(`${d}.published`),
      partnerProgramSummary: t(`${d}.partnerProgramSummary`),
      activePrograms: t(`${d}.activePrograms`),
      pendingApplications: t(`${d}.pendingApplications`),
      productDeploymentUpdates: t(`${d}.productDeploymentUpdates`),
      noUpdates: t(`${d}.noUpdates`),
      portalModules: t(`${d}.portalModules`),
      openModule: t(`${d}.openModule`),
      loadErrorTitle: t(`${d}.loadErrorTitle`),
      loadErrorMessage: t(`${d}.loadErrorMessage`),
      retry: t(`${d}.retry`),
    },
    foundation: {
      loading: t(`${f}.loading`),
      back: t(`${f}.back`),
      structureNote: t(`${f}.structureNote`),
    },
  };
}

export function buildPlatformPortalCustomersLabels(
  t: Translator,
): PlatformPortalCustomersLabels {
  const c = "platform.customers";
  const customerStatus = "platform.status.customer";
  const subscriptionStatus = "platform.status.subscription";

  return {
    title: t(`${c}.title`),
    description: t(`${c}.subtitle`),
    summaryTotal: t(`${c}.summaryTotal`),
    summaryActive: t(`${c}.summaryActive`),
    summaryNew: t(`${c}.summaryNew`),
    summaryAttention: t(`${c}.summaryAttention`),
    loading: t(`${c}.loading`),
    error: t(`${c}.error`),
    retry: t(`${c}.retry`),
    emptyTitle: t(`${c}.emptyTitle`),
    emptyDescription: t(`${c}.emptyDescription`),
    searchPlaceholder: t(`${c}.search`),
    filterAll: t(`${c}.filterAll`),
    filterStatus: t(`${c}.filterStatus`),
    filterSubscription: t(`${c}.filterSubscription`),
    filterAttribution: t(`${c}.filterAttribution`),
    filterPartner: t(`${c}.filterPartner`),
    filterDirect: t(`${c}.filterDirect`),
    clearFilters: t(`${c}.clearFilters`),
    columnCustomer: t(`${c}.name`),
    columnOrganizationNumber: t(`${c}.organizationNumber`),
    columnStatus: t(`${c}.status`),
    columnSubscription: t(`${c}.filterSubscription`),
    columnMembers: t(`${c}.users`),
    columnAttribution: t(`${c}.filterAttribution`),
    columnSupport: t("platform.nav.support"),
    columnLastActivity: t("platform.customerLifecycleCenter.table.lastActivity"),
    columnActions: t(`${c}.actions`),
    requiresAttention: t(`${c}.requiresAttention`),
    lifetime: t(`${c}.lifetime`),
    partnerCustomer: t(`${c}.partnerCustomer`),
    directCustomer: t(`${c}.directCustomer`),
    noSubscription: t("platform.customerDetail.noSubscription"),
    notAvailable: t(`${c}.notAvailable`),
    openCustomer: t(`${c}.view`),
    noOpenSupport: t(`${c}.noOpenSupport`),
    customerStatuses: {
      trial: t(`${customerStatus}.trial`),
      active: t(`${customerStatus}.active`),
      paused: t(`${customerStatus}.paused`),
      cancelled: t(`${customerStatus}.cancelled`),
      overdue: t(`${customerStatus}.overdue`),
    },
    subscriptionStatuses: {
      active: t(`${subscriptionStatus}.active`),
      trialing: t(`${subscriptionStatus}.trialing`),
      past_due: t(`${subscriptionStatus}.past_due`),
      unpaid: t(`${subscriptionStatus}.unpaid`),
      paused: t(`${subscriptionStatus}.paused`),
      cancelled: t(`${subscriptionStatus}.cancelled`),
      canceled: t(`${subscriptionStatus}.canceled`),
    },
  };
}

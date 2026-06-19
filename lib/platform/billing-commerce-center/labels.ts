import type { Translator } from "@/lib/i18n/translate";
import { BILLING_COMMERCE_NAV } from "./config";

export function buildBillingCommerceCenterLabels(t: Translator) {
  const p = "platform.billingCommerceCenter";
  const nav = Object.fromEntries(
    BILLING_COMMERCE_NAV.map((item) => [item.id, t(item.labelKey)])
  ) as Record<string, string>;

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    openModule: t(`${p}.openModule`),
    back: t(`${p}.back`),
    overview: t(`${p}.overview`),
    stats: t(`${p}.stats`),
    records: t(`${p}.records`),
    legalReviewBanner: t(`${p}.legalReviewBanner`),
    nav,
    modules: {
      customerIdentity: t(`${p}.modules.customerIdentity`),
      billingProfiles: t(`${p}.modules.billingProfiles`),
      subscriptions: t(`${p}.modules.subscriptions`),
      invoices: t(`${p}.modules.invoices`),
      vatEngine: t(`${p}.modules.vatEngine`),
      paymentProviders: t(`${p}.modules.paymentProviders`),
      taxRules: t(`${p}.modules.taxRules`),
      businessPacks: t(`${p}.modules.businessPacks`),
      licensePurchases: t(`${p}.modules.licensePurchases`),
      domainLicenses: t(`${p}.modules.domainLicenses`),
      growthPartnerAttribution: t(`${p}.modules.growthPartnerAttribution`),
      accountingIntegration: t(`${p}.modules.accountingIntegration`),
    },
    moduleDescriptions: {
      customerIdentity: t(`${p}.moduleDescriptions.customerIdentity`),
      billingProfiles: t(`${p}.moduleDescriptions.billingProfiles`),
      subscriptions: t(`${p}.moduleDescriptions.subscriptions`),
      invoices: t(`${p}.moduleDescriptions.invoices`),
      vatEngine: t(`${p}.moduleDescriptions.vatEngine`),
      paymentProviders: t(`${p}.moduleDescriptions.paymentProviders`),
      taxRules: t(`${p}.moduleDescriptions.taxRules`),
      businessPacks: t(`${p}.moduleDescriptions.businessPacks`),
      licensePurchases: t(`${p}.moduleDescriptions.licensePurchases`),
      domainLicenses: t(`${p}.moduleDescriptions.domainLicenses`),
      growthPartnerAttribution: t(`${p}.moduleDescriptions.growthPartnerAttribution`),
      accountingIntegration: t(`${p}.moduleDescriptions.accountingIntegration`),
    },
    relatedOperations: t(`${p}.relatedOperations`),
    relatedLinks: {
      paymentOperations: t(`${p}.relatedLinks.paymentOperations`),
      revenueOperations: t(`${p}.relatedLinks.revenueOperations`),
      subscriptionOperations: t(`${p}.relatedLinks.subscriptionOperations`),
    },
    overviewStats: {
      activeCustomers: t(`${p}.overviewStats.activeCustomers`),
      overdueCustomers: t(`${p}.overviewStats.overdueCustomers`),
      openInvoices: t(`${p}.overviewStats.openInvoices`),
      draftCheckouts: t(`${p}.overviewStats.draftCheckouts`),
    },
  };
}

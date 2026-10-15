import type { Translator } from "@/lib/i18n/translate";
import { BILLING_COMMERCE_NAV } from "./config";

export function buildBillingCommerceCenterLabels(t: Translator) {
  const p = "platform.billingCommerceCenter";
  const nav = Object.fromEntries(
    BILLING_COMMERCE_NAV.map((item) => [item.id, t(item.labelKey)]),
  ) as Record<string, string>;

  const moduleIds = [
    "customerIdentity",
    "billingProfiles",
    "subscriptions",
    "invoices",
    "vatEngine",
    "paymentProviders",
    "taxRules",
    "businessPacks",
    "licensePurchases",
    "domainLicenses",
    "growthPartnerAttribution",
    "licenses",
    "commissions",
    "accountingExport",
    "disputes",
    "reports",
    "accountingIntegration",
  ] as const;

  const modules = Object.fromEntries(
    moduleIds.map((id) => [id, t(`${p}.modules.${id}`)]),
  ) as Record<string, string>;

  const moduleDescriptions = Object.fromEntries(
    moduleIds.map((id) => [id, t(`${p}.moduleDescriptions.${id}`)]),
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
    modules,
    moduleDescriptions,
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
    sections: {
      finance: t(`${p}.sections.finance`),
      customers: t(`${p}.sections.customers`),
      product: t(`${p}.sections.product`),
      sellers: t(`${p}.sections.sellers`),
      customersHint: t(`${p}.sections.customersHint`),
      productHint: t(`${p}.sections.productHint`),
      sellersHint: t(`${p}.sections.sellersHint`),
    },
  };
}

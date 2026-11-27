import type { Translator } from "@/lib/i18n/translate";
import type { EconomyPhrases } from "@/lib/platform/economy-display";
import { BILLING_COMMERCE_NAV } from "./config";

const ECONOMY_COLUMN_KEYS = [
  "rate",
  "label",
  "scope",
  "active",
  "rule_key",
  "amount",
  "currency",
  "status",
  "customer",
  "invoice_number",
  "kid",
  "kid_number",
  "due_date",
  "email",
  "organization_id",
  "environment_type",
  "connected",
  "provider",
  "billing_email",
  "billing_address",
  "vat_amount",
  "total_amount",
  "commission_amount",
  "name",
  "plan",
  "price_amount",
  "billing_cycle",
] as const;

export function buildEconomyPhrases(t: Translator): EconomyPhrases {
  const root = "platform.economyDisplay";
  const columns = Object.fromEntries(
    ECONOMY_COLUMN_KEYS.map((key) => [key, t(`${root}.columns.${key}`)]),
  );
  return {
    unavailable: t(`${root}.unavailable`),
    notRegistered: t(`${root}.notRegistered`),
    mustVerify: t(`${root}.mustVerify`),
    active: t(`${root}.active`),
    inactive: t(`${root}.inactive`),
    yes: t(`${root}.yes`),
    no: t(`${root}.no`),
    staging: t(`${root}.staging`),
    lifetime: t(`${root}.lifetime`),
    monthly: t(`${root}.monthly`),
    yearly: t(`${root}.yearly`),
    oneTime: t(`${root}.oneTime`),
    seeProductCatalog: t(`${root}.seeProductCatalog`),
    seeSellers: t(`${root}.seeSellers`),
    sourceError: t(`${root}.sourceError`),
    noRecords: t(`${root}.noRecords`),
    columns,
  };
}

export function buildBillingCommerceCenterLabels(t: Translator, locale = "en") {
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
    locale,
    economy: buildEconomyPhrases(t),
  };
}

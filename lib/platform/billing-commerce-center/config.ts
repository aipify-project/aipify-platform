export type BillingCommerceNavId =
  | "overview"
  | "customerIdentity"
  | "billingProfiles"
  | "subscriptions"
  | "invoices"
  | "vatEngine"
  | "paymentProviders"
  | "taxRules"
  | "businessPacks"
  | "licensePurchases"
  | "domainLicenses"
  | "growthPartnerAttribution"
  | "licenses"
  | "commissions"
  | "accountingExport"
  | "disputes"
  | "reports"
  | "accountingIntegration";

export type BillingCommerceNavItem = {
  id: BillingCommerceNavId;
  href: string;
  labelKey: string;
  section: string;
};

export const BILLING_COMMERCE_NAV: BillingCommerceNavItem[] = [
  {
    id: "customerIdentity",
    href: "/platform/billing/customer-identity",
    labelKey: "platform.billingCommerceCenter.nav.customerIdentity",
    section: "customer_identity",
  },
  {
    id: "billingProfiles",
    href: "/platform/billing/profiles",
    labelKey: "platform.billingCommerceCenter.nav.billingProfiles",
    section: "billing_profiles",
  },
  {
    id: "subscriptions",
    href: "/platform/billing/subscriptions",
    labelKey: "platform.billingCommerceCenter.nav.subscriptions",
    section: "subscriptions",
  },
  {
    id: "invoices",
    href: "/platform/billing/invoices",
    labelKey: "platform.billingCommerceCenter.nav.invoices",
    section: "invoices",
  },
  {
    id: "vatEngine",
    href: "/platform/billing/vat-engine",
    labelKey: "platform.billingCommerceCenter.nav.vatEngine",
    section: "vat_engine",
  },
  {
    id: "paymentProviders",
    href: "/platform/billing/payment-providers",
    labelKey: "platform.billingCommerceCenter.nav.paymentProviders",
    section: "payment_providers",
  },
  {
    id: "taxRules",
    href: "/platform/billing/tax-rules",
    labelKey: "platform.billingCommerceCenter.nav.taxRules",
    section: "tax_rules",
  },
  {
    id: "businessPacks",
    href: "/platform/billing/business-packs",
    labelKey: "platform.billingCommerceCenter.nav.businessPacks",
    section: "business_packs",
  },
  {
    id: "licensePurchases",
    href: "/platform/billing/license-purchases",
    labelKey: "platform.billingCommerceCenter.nav.licensePurchases",
    section: "license_purchases",
  },
  {
    id: "domainLicenses",
    href: "/platform/billing/domain-licenses",
    labelKey: "platform.billingCommerceCenter.nav.domainLicenses",
    section: "domain_licenses",
  },
  {
    id: "growthPartnerAttribution",
    href: "/platform/billing/growth-partner-attribution",
    labelKey: "platform.billingCommerceCenter.nav.growthPartnerAttribution",
    section: "growth_partner_attribution",
  },
  {
    id: "licenses",
    href: "/platform/billing/licenses",
    labelKey: "platform.billingCommerceCenter.nav.licenses",
    section: "licenses",
  },
  {
    id: "commissions",
    href: "/platform/billing/commissions",
    labelKey: "platform.billingCommerceCenter.nav.commissions",
    section: "commissions",
  },
  {
    id: "accountingExport",
    href: "/platform/billing/accounting-export",
    labelKey: "platform.billingCommerceCenter.nav.accountingExport",
    section: "accounting_export",
  },
  {
    id: "disputes",
    href: "/platform/billing/disputes",
    labelKey: "platform.billingCommerceCenter.nav.disputes",
    section: "disputes",
  },
  {
    id: "reports",
    href: "/platform/billing/reports",
    labelKey: "platform.billingCommerceCenter.nav.reports",
    section: "reports",
  },
  {
    id: "accountingIntegration",
    href: "/platform/billing/accounting-integration",
    labelKey: "platform.billingCommerceCenter.nav.accountingIntegration",
    section: "accounting_integration",
  },
];

export function getBillingCommerceActiveNavId(pathname: string): BillingCommerceNavId | "overview" {
  if (pathname === "/platform/billing") return "overview";
  if (pathname.startsWith("/platform/billing/customer-identity")) return "customerIdentity";
  if (pathname.startsWith("/platform/billing/profiles")) return "billingProfiles";
  if (pathname.startsWith("/platform/billing/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/billing/invoices") || pathname.startsWith("/platform/billing/enterprise-invoices")) {
    return "invoices";
  }
  if (pathname.startsWith("/platform/billing/vat-engine") || pathname.startsWith("/platform/billing/tax-verification")) {
    return "vatEngine";
  }
  if (pathname.startsWith("/platform/billing/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/billing/tax-rules")) return "taxRules";
  if (pathname.startsWith("/platform/billing/business-packs")) return "businessPacks";
  if (pathname.startsWith("/platform/billing/license-purchases")) return "licensePurchases";
  if (pathname.startsWith("/platform/billing/domain-licenses")) return "domainLicenses";
  if (pathname.startsWith("/platform/billing/growth-partner-attribution")) return "growthPartnerAttribution";
  if (pathname.startsWith("/platform/billing/licenses")) return "licenses";
  if (pathname.startsWith("/platform/billing/commissions")) return "commissions";
  if (pathname.startsWith("/platform/billing/accounting-export")) return "accountingExport";
  if (pathname.startsWith("/platform/billing/disputes")) return "disputes";
  if (pathname.startsWith("/platform/billing/reports")) return "reports";
  if (pathname.startsWith("/platform/billing/accounting-integration")) return "accountingIntegration";
  return "overview";
}

export function getBillingCommerceSection(id: BillingCommerceNavId): string {
  return BILLING_COMMERCE_NAV.find((item) => item.id === id)?.section ?? "overview";
}

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

/** Where the module appears in finance IA (routes stay unchanged). */
export type BillingCommercePlacement =
  | "primary"
  | "relatedCustomers"
  | "relatedProduct"
  | "relatedSellers";

export type BillingCommerceNavGroupId = "core" | "tax" | "reporting";

export type BillingCommerceNavItem = {
  id: BillingCommerceNavId;
  href: string;
  labelKey: string;
  section: string;
  placement: BillingCommercePlacement;
  /** Lucide icon name for overview cards (existing icon set). */
  icon:
    | "receipt"
    | "credit-card"
    | "file-check"
    | "wallet"
    | "calculator"
    | "landmark"
    | "rotate-ccw"
    | "chart-column"
    | "file-output"
    | "link"
    | "building"
    | "package"
    | "key"
    | "globe"
    | "users"
    | "percent";
};

export type BillingCommerceNavGroup = {
  id: BillingCommerceNavGroupId;
  labelKey: string;
  itemIds: BillingCommerceNavId[];
};

/**
 * All billing commerce routes (deep links preserved).
 * Primary finance sub-nav excludes Product / Sellers / Kunderegister modules
 * to avoid duplicating sidebar destinations as 17 equal pills.
 */
export const BILLING_COMMERCE_NAV: BillingCommerceNavItem[] = [
  {
    id: "invoices",
    href: "/platform/billing/invoices",
    labelKey: "platform.billingCommerceCenter.nav.invoices",
    section: "invoices",
    placement: "primary",
    icon: "receipt",
  },
  {
    id: "billingProfiles",
    href: "/platform/billing/profiles",
    labelKey: "platform.billingCommerceCenter.nav.billingProfiles",
    section: "billing_profiles",
    placement: "primary",
    icon: "credit-card",
  },
  {
    id: "subscriptions",
    href: "/platform/billing/subscriptions",
    labelKey: "platform.billingCommerceCenter.nav.subscriptions",
    section: "subscriptions",
    placement: "primary",
    icon: "file-check",
  },
  {
    id: "paymentProviders",
    href: "/platform/billing/payment-providers",
    labelKey: "platform.billingCommerceCenter.nav.paymentProviders",
    section: "payment_providers",
    placement: "primary",
    icon: "wallet",
  },
  {
    id: "vatEngine",
    href: "/platform/billing/vat-engine",
    labelKey: "platform.billingCommerceCenter.nav.vatEngine",
    section: "vat_engine",
    placement: "primary",
    icon: "calculator",
  },
  {
    id: "taxRules",
    href: "/platform/billing/tax-rules",
    labelKey: "platform.billingCommerceCenter.nav.taxRules",
    section: "tax_rules",
    placement: "primary",
    icon: "landmark",
  },
  {
    id: "disputes",
    href: "/platform/billing/disputes",
    labelKey: "platform.billingCommerceCenter.nav.disputes",
    section: "disputes",
    placement: "primary",
    icon: "rotate-ccw",
  },
  {
    id: "reports",
    href: "/platform/billing/reports",
    labelKey: "platform.billingCommerceCenter.nav.reports",
    section: "reports",
    placement: "primary",
    icon: "chart-column",
  },
  {
    id: "accountingExport",
    href: "/platform/billing/accounting-export",
    labelKey: "platform.billingCommerceCenter.nav.accountingExport",
    section: "accounting_export",
    placement: "primary",
    icon: "file-output",
  },
  {
    id: "accountingIntegration",
    href: "/platform/billing/accounting-integration",
    labelKey: "platform.billingCommerceCenter.nav.accountingIntegration",
    section: "accounting_integration",
    placement: "primary",
    icon: "link",
  },
  {
    id: "customerIdentity",
    href: "/platform/billing/customer-identity",
    labelKey: "platform.billingCommerceCenter.nav.customerIdentity",
    section: "customer_identity",
    placement: "relatedCustomers",
    icon: "building",
  },
  {
    id: "businessPacks",
    href: "/platform/billing/business-packs",
    labelKey: "platform.billingCommerceCenter.nav.businessPacks",
    section: "business_packs",
    placement: "relatedProduct",
    icon: "package",
  },
  {
    id: "licensePurchases",
    href: "/platform/billing/license-purchases",
    labelKey: "platform.billingCommerceCenter.nav.licensePurchases",
    section: "license_purchases",
    placement: "relatedProduct",
    icon: "key",
  },
  {
    id: "domainLicenses",
    href: "/platform/billing/domain-licenses",
    labelKey: "platform.billingCommerceCenter.nav.domainLicenses",
    section: "domain_licenses",
    placement: "relatedProduct",
    icon: "globe",
  },
  {
    id: "licenses",
    href: "/platform/billing/licenses",
    labelKey: "platform.billingCommerceCenter.nav.licenses",
    section: "licenses",
    placement: "relatedProduct",
    icon: "file-check",
  },
  {
    id: "growthPartnerAttribution",
    href: "/platform/billing/growth-partner-attribution",
    labelKey: "platform.billingCommerceCenter.nav.growthPartnerAttribution",
    section: "growth_partner_attribution",
    placement: "relatedSellers",
    icon: "users",
  },
  {
    id: "commissions",
    href: "/platform/billing/commissions",
    labelKey: "platform.billingCommerceCenter.nav.commissions",
    section: "commissions",
    placement: "relatedSellers",
    icon: "percent",
  },
];

/** Grouped primary finance sub-nav (replaces 17 equal pills). */
export const BILLING_COMMERCE_NAV_GROUPS: BillingCommerceNavGroup[] = [
  {
    id: "core",
    labelKey: "platform.billingCommerceCenter.groups.core",
    itemIds: ["invoices", "billingProfiles", "subscriptions", "paymentProviders"],
  },
  {
    id: "tax",
    labelKey: "platform.billingCommerceCenter.groups.tax",
    itemIds: ["vatEngine", "taxRules"],
  },
  {
    id: "reporting",
    labelKey: "platform.billingCommerceCenter.groups.reporting",
    itemIds: ["disputes", "reports", "accountingExport", "accountingIntegration"],
  },
];

export function getBillingCommercePrimaryNav(): BillingCommerceNavItem[] {
  return BILLING_COMMERCE_NAV.filter((item) => item.placement === "primary");
}

export function getBillingCommerceNavByPlacement(
  placement: BillingCommercePlacement,
): BillingCommerceNavItem[] {
  return BILLING_COMMERCE_NAV.filter((item) => item.placement === placement);
}

export function getBillingCommerceNavItem(
  id: BillingCommerceNavId,
): BillingCommerceNavItem | undefined {
  return BILLING_COMMERCE_NAV.find((item) => item.id === id);
}

export function getBillingCommerceActiveNavId(pathname: string): BillingCommerceNavId | "overview" {
  if (pathname === "/platform/billing") return "overview";
  if (pathname.startsWith("/platform/billing/customer-identity")) return "customerIdentity";
  if (pathname.startsWith("/platform/billing/profiles")) return "billingProfiles";
  if (pathname.startsWith("/platform/billing/subscriptions")) return "subscriptions";
  if (
    pathname.startsWith("/platform/billing/invoices") ||
    pathname.startsWith("/platform/billing/enterprise-invoices")
  ) {
    return "invoices";
  }
  if (
    pathname.startsWith("/platform/billing/vat-engine") ||
    pathname.startsWith("/platform/billing/tax-verification")
  ) {
    return "vatEngine";
  }
  if (pathname.startsWith("/platform/billing/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/billing/tax-rules")) return "taxRules";
  if (pathname.startsWith("/platform/billing/business-packs")) return "businessPacks";
  if (pathname.startsWith("/platform/billing/license-purchases")) return "licensePurchases";
  if (pathname.startsWith("/platform/billing/domain-licenses")) return "domainLicenses";
  if (pathname.startsWith("/platform/billing/growth-partner-attribution")) {
    return "growthPartnerAttribution";
  }
  if (pathname.startsWith("/platform/billing/licenses")) return "licenses";
  if (pathname.startsWith("/platform/billing/commissions")) return "commissions";
  if (pathname.startsWith("/platform/billing/accounting-export")) return "accountingExport";
  if (pathname.startsWith("/platform/billing/disputes")) return "disputes";
  if (pathname.startsWith("/platform/billing/reports")) return "reports";
  if (pathname.startsWith("/platform/billing/accounting-integration")) {
    return "accountingIntegration";
  }
  return "overview";
}

export function getBillingCommerceSection(id: BillingCommerceNavId): string {
  return BILLING_COMMERCE_NAV.find((item) => item.id === id)?.section ?? "overview";
}

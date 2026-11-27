/**
 * Platform Kunder hub — horizontal tabs over existing customer routes.
 * Sidebar keeps Organizations + Customer Success + Support; hub tabs add Overview.
 */

export type CustomersHubTabId = "overview" | "organizations" | "customerSuccess";

export type CustomersHubTab = {
  id: CustomersHubTabId;
  href: string;
  labelKey: string;
};

export const CUSTOMERS_HUB_TABS: readonly CustomersHubTab[] = [
  {
    id: "overview",
    href: "/platform/customers/overview",
    labelKey: "platform.customersHub.tabs.overview",
  },
  {
    id: "organizations",
    href: "/platform/customers",
    labelKey: "platform.customersHub.tabs.organizations",
  },
  {
    id: "customerSuccess",
    href: "/platform/customer-success",
    labelKey: "platform.customersHub.tabs.customerSuccess",
  },
] as const;

export const CUSTOMERS_SUPPORT_HREF = "/platform/support";

/** Page size for client-side organization register pagination. */
export const CUSTOMERS_REGISTER_PAGE_SIZE = 25;

/** KPI definitions for Overview — scope is non-platform customer organizations. */
export const CUSTOMERS_KPI_DEFINITIONS = [
  {
    id: "customerOrganizations",
    counts: "organizations",
    source: "get_platform_portal_customers.summary.total",
    excludes: "platform/is_platform companies, CSP partner identities as customers",
  },
  {
    id: "activeSubscriptions",
    counts: "subscriptions",
    source: "get_platform_portal_dashboard.active_subscriptions",
    excludes: "users, licenses, partner applications",
  },
  {
    id: "trialingSubscriptions",
    counts: "subscriptions",
    source: "dashboard payment_status_summary.trialing",
    excludes: "customer.status alone without subscription trialing",
  },
  {
    id: "paymentAttention",
    counts: "subscriptions",
    source: "dashboard payment_status_summary.past_due",
    excludes: "speculative churn scores",
  },
  {
    id: "requiresFollowUp",
    counts: "organizations",
    source: "customers.summary.requiresAttention + success overview",
    excludes: "missing-data treated as risk",
  },
  {
    id: "openSupport",
    counts: "support_cases",
    source: "dashboard open_support_workload / per-customer openSupportCount",
    excludes: "internal communications",
  },
] as const;

export function getCustomersHubActiveTabId(pathname: string): CustomersHubTabId {
  if (pathname.startsWith("/platform/customers/overview")) return "overview";
  if (
    pathname === "/platform/customer-success" ||
    pathname.startsWith("/platform/customer-success/")
  ) {
    return "customerSuccess";
  }
  return "organizations";
}

/** Hub tabs on the three primary Kunder surfaces only. */
export function shouldShowCustomersHubTabs(pathname: string): boolean {
  if (pathname === "/platform/customers/overview") return true;
  if (pathname === "/platform/customers") return true;
  if (pathname === "/platform/customer-success") return true;
  return false;
}

export function isCustomersHubPath(pathname: string): boolean {
  return shouldShowCustomersHubTabs(pathname);
}

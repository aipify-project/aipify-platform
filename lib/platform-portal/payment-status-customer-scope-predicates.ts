/**
 * Local predicate mirror of the PREPARED_ONLY SQL candidate:
 * docs/platform/sql-candidates/platform_portal_dashboard_payment_status_customer_scope_v1.sql
 *
 * Used for synthetic fixture tests only — not a Staging/Production runtime source.
 */

export type SyntheticCompany = {
  id: string;
  is_platform: boolean;
};

export type SyntheticCustomer = {
  id: string;
  company_id: string;
};

export type SyntheticOrganization = {
  id: string;
};

export type SyntheticSubscription = {
  id: string;
  customer_id: string;
  status: "active" | "trialing" | "past_due" | "unpaid" | "paused" | "canceled";
};

export type SyntheticPartnerProfile = {
  id: string;
  /** Partner without APP customer org chain — must never inflate customer KPIs. */
  has_app_customer_org: boolean;
};

export type SyntheticWorld = {
  companies: SyntheticCompany[];
  customers: SyntheticCustomer[];
  organizations: SyntheticOrganization[];
  subscriptions: SyntheticSubscription[];
  partners: SyntheticPartnerProfile[];
};

function companyById(world: SyntheticWorld, companyId: string): SyntheticCompany | undefined {
  return world.companies.find((c) => c.id === companyId);
}

/** Same join chain as SQL: subscriptions → customers → organizations → companies, is_platform=false. */
export function isCustomerScopedSubscription(
  world: SyntheticWorld,
  subscription: SyntheticSubscription,
): boolean {
  const customer = world.customers.find((c) => c.id === subscription.customer_id);
  if (!customer) return false;
  const org = world.organizations.find((o) => o.id === customer.id);
  if (!org) return false;
  const company = companyById(world, customer.company_id);
  if (!company) return false;
  return company.is_platform === false;
}

export function countActiveSubscriptions(world: SyntheticWorld): number {
  return world.subscriptions.filter(
    (s) =>
      isCustomerScopedSubscription(world, s) &&
      (s.status === "active" || s.status === "trialing"),
  ).length;
}

export function countPastDue(world: SyntheticWorld): number {
  return world.subscriptions.filter(
    (s) => isCustomerScopedSubscription(world, s) && s.status === "past_due",
  ).length;
}

export function countTrialing(world: SyntheticWorld): number {
  return world.subscriptions.filter(
    (s) => isCustomerScopedSubscription(world, s) && s.status === "trialing",
  ).length;
}

/** Unscoped counters — mirrors the LIVE bug before the candidate is applied. */
export function countPastDueUnscoped(world: SyntheticWorld): number {
  return world.subscriptions.filter((s) => s.status === "past_due").length;
}

export function countTrialingUnscoped(world: SyntheticWorld): number {
  return world.subscriptions.filter((s) => s.status === "trialing").length;
}

export function paymentStatusSummary(world: SyntheticWorld): {
  active: number;
  past_due: number;
  trialing: number;
} {
  return {
    active: countActiveSubscriptions(world),
    past_due: countPastDue(world),
    trialing: countTrialing(world),
  };
}

/** Fixture set covering positive/negative cases required by the parity job. */
export function buildParityFixtures(): SyntheticWorld {
  return {
    companies: [
      { id: "co_app_customer", is_platform: false },
      { id: "co_platform_internal", is_platform: true },
      { id: "co_partner_only", is_platform: false },
    ],
    customers: [
      { id: "cu_app_active", company_id: "co_app_customer" },
      { id: "cu_app_trialing", company_id: "co_app_customer" },
      { id: "cu_app_past_due", company_id: "co_app_customer" },
      { id: "cu_platform_internal", company_id: "co_platform_internal" },
      // Duplicate customer/org link attempt — same id counted once per subscription row.
      { id: "cu_app_duplicate_link", company_id: "co_app_customer" },
    ],
    organizations: [
      { id: "cu_app_active" },
      { id: "cu_app_trialing" },
      { id: "cu_app_past_due" },
      { id: "cu_platform_internal" },
      { id: "cu_app_duplicate_link" },
      // Partner has no organization row matching a customer — excluded.
    ],
    subscriptions: [
      { id: "sub_active", customer_id: "cu_app_active", status: "active" },
      { id: "sub_trialing", customer_id: "cu_app_trialing", status: "trialing" },
      { id: "sub_past_due", customer_id: "cu_app_past_due", status: "past_due" },
      {
        id: "sub_platform_past_due",
        customer_id: "cu_platform_internal",
        status: "past_due",
      },
      {
        id: "sub_platform_trialing",
        customer_id: "cu_platform_internal",
        status: "trialing",
      },
      {
        id: "sub_orphan_past_due",
        customer_id: "cu_missing_partner",
        status: "past_due",
      },
      {
        id: "sub_duplicate_active",
        customer_id: "cu_app_duplicate_link",
        status: "active",
      },
    ],
    partners: [{ id: "partner_csp_only", has_app_customer_org: false }],
  };
}

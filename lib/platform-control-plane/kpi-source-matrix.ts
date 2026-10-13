/**
 * Authoritative KPI source matrix for Platform control plane.
 * Null / unavailable means not connected — never fake zero or fake health.
 */

export type PlatformKpiSourceRow = {
  kpi: string;
  sourceSystem: string;
  tableViewOrRpc: string;
  formula: string;
  currency: string | null;
  freshness: string;
  failureState: string;
  drillDown: string;
};

export const PLATFORM_KPI_SOURCE_MATRIX: PlatformKpiSourceRow[] = [
  {
    kpi: "active_customers_organizations",
    sourceSystem: "Core customers/organizations",
    tableViewOrRpc: "get_platform_control_plane_overview → customers.organizations_total",
    formula: "count(organizations ⨝ customers ⨝ companies) where companies.is_platform = false",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "error tile / updateFailed",
    drillDown: "/platform/customers",
  },
  {
    kpi: "active_subscriptions",
    sourceSystem: "Core subscriptions",
    tableViewOrRpc: "get_platform_control_plane_overview → customers.active_subscriptions",
    formula: "count(subscriptions) status in (active, trialing) excluding platform company",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "error tile",
    drillDown: "/platform/subscriptions",
  },
  {
    kpi: "customers_requiring_follow_up",
    sourceSystem: "Core subscriptions",
    tableViewOrRpc: "get_platform_control_plane_overview → customers.requiring_attention",
    formula: "orgs without active/trialing subscription OR with past_due/unpaid/paused",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "error tile",
    drillDown: "/platform/customer-success",
  },
  {
    kpi: "critical_customers",
    sourceSystem: "Customer success / portal",
    tableViewOrRpc: "get_platform_portal_customer_success_overview (existing)",
    formula: "portal success critical segment — not inventing parallel risk score",
    currency: null,
    freshness: "portal overview freshness",
    failureState: "unknown / partial on overview strip",
    drillDown: "/platform/customer-success",
  },
  {
    kpi: "mrr",
    sourceSystem: "Core subscriptions (aligned with get_platform_metrics)",
    tableViewOrRpc: "get_platform_control_plane_overview → finance.monthly_recurring_revenue",
    formula: "sum(yearly price/12 else price) for subscriptions status in (active, trialing)",
    currency: "NOK (display default; mixed currency not split)",
    freshness: "RPC generated_at",
    failureState: "null → No data / Not connected",
    drillDown: "/platform/billing",
  },
  {
    kpi: "outstanding_invoices",
    sourceSystem: "Core invoices (aligned with get_platform_metrics)",
    tableViewOrRpc: "get_platform_control_plane_overview → finance.outstanding_invoices",
    formula: "sum(invoices.amount) where status in (sent, overdue)",
    currency: "invoice.currency or MIXED",
    freshness: "RPC generated_at",
    failureState: "null when invoices table unavailable",
    drillDown: "/platform/billing/invoices",
  },
  {
    kpi: "failed_payments",
    sourceSystem: "payment_events (uncertified failed-status domain)",
    tableViewOrRpc: "get_platform_control_plane_overview → finance.failed_payments",
    formula: "null until failed status domain is certified (no fake zero)",
    currency: null,
    freshness: "n/a",
    failureState: "Not connected",
    drillDown: "/platform/billing/payment-operations",
  },
  {
    kpi: "open_support_cases",
    sourceSystem: "support_cases",
    tableViewOrRpc: "get_platform_control_plane_overview → customers.open_support",
    formula: "count where status in (open, in_progress, escalated)",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "0 only when table exists and query succeeds",
    drillDown: "/platform/support",
  },
  {
    kpi: "active_partners",
    sourceSystem: "growth_partner_app_profiles",
    tableViewOrRpc: "get_platform_control_plane_overview → partners.active_partners",
    formula: "count(*) from growth_partner_app_profiles when present",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "null when table missing",
    drillDown: "/platform/partners",
  },
  {
    kpi: "earned_partner_commission",
    sourceSystem: "partner commission engines",
    tableViewOrRpc: "null on overview; commissions surface",
    formula: "not aggregated on overview until certified rollup exists",
    currency: null,
    freshness: "n/a",
    failureState: "Not connected",
    drillDown: "/platform/billing/commissions",
  },
  {
    kpi: "pending_partner_invoices",
    sourceSystem: "growth_partner_portal_settlement_invoices",
    tableViewOrRpc: "get_platform_control_plane_overview → partners.pending_partner_invoices",
    formula: "count where invoice_status in (draft, finalized, sent_to_accounting)",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "null when table/column missing",
    drillDown: "/platform/partners/settlement",
  },
  {
    kpi: "system_health",
    sourceSystem: "none connected on overview",
    tableViewOrRpc: "operations.system_health = null",
    formula: "never infer healthy from missing source",
    currency: null,
    freshness: "n/a",
    failureState: "No data source",
    drillDown: "/platform/operations/platform-health",
  },
  {
    kpi: "critical_integration_failures",
    sourceSystem: "reliability / provider health engines",
    tableViewOrRpc: "existing reliability center (not inventing count)",
    formula: "authoritative reliability readers only",
    currency: null,
    freshness: "reliability center",
    failureState: "unknown ≠ healthy",
    drillDown: "/platform/reliability",
  },
  {
    kpi: "open_incidents",
    sourceSystem: "platform_incidents (optional)",
    tableViewOrRpc: "get_platform_control_plane_overview → operations.open_incidents",
    formula: "count open-like statuses when table exists; else null",
    currency: null,
    freshness: "RPC generated_at",
    failureState: "null when table missing (not zero)",
    drillDown: "/platform/reliability",
  },
  {
    kpi: "pending_approvals",
    sourceSystem: "action approvals",
    tableViewOrRpc: "null until certified column/RPC",
    formula: "null (no invented approval count)",
    currency: null,
    freshness: "n/a",
    failureState: "Not connected",
    drillDown: "/platform/actions",
  },
];

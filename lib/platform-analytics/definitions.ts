/**
 * Authoritative KPI definitions for Platform Analytics V2.
 * Displayed in UI — never invent percentages or cross-currency totals.
 */

export type AnalyticsKpiDefinition = {
  id: string;
  source: string;
  definition: string;
};

export const PLATFORM_ANALYTICS_KPI_DEFINITIONS: readonly AnalyticsKpiDefinition[] = [
  {
    id: "customers_total",
    source: "get_platform_metrics → customers.total",
    definition: "All customer records in Core (registered accounts), including inactive.",
  },
  {
    id: "customers_active",
    source: "get_platform_metrics → customers.active",
    definition: "Customer records with status active. Not the same as paid subscriptions.",
  },
  {
    id: "customers_trial",
    source: "get_platform_metrics → customers.trial",
    definition: "Customer records with status trial.",
  },
  {
    id: "customers_cancelled",
    source: "get_platform_metrics → customers.cancelled",
    definition: "Customer records with status cancelled.",
  },
  {
    id: "new_customers_30d",
    source: "get_platform_metrics → growth.new_customers_30d",
    definition: "Customers created in the last 30 days (registration event).",
  },
  {
    id: "mrr",
    source: "get_platform_metrics → revenue.mrr",
    definition:
      "Sum of subscription price_amount for status active or trialing, with yearly amounts divided by 12. Currency is as stored on each subscription row — totals assume a single currency; mixed currencies are not converted.",
  },
  {
    id: "arr",
    source: "get_platform_metrics → revenue.arr",
    definition: "MRR × 12 from the same Core calculation. Not a separate invoice sum.",
  },
  {
    id: "outstanding_invoices",
    source: "get_platform_metrics → revenue.outstanding_invoice_amount",
    definition: "Sum of invoice amounts with status sent or overdue.",
  },
  {
    id: "installations_active",
    source: "get_platform_metrics → installations.active",
    definition: "Installations with status active.",
  },
  {
    id: "active_subscriptions",
    source: "get_platform_metrics → subscriptions.active (after enrichment SQL V2)",
    definition:
      "Count of subscription rows with status active. Unavailable until Platform Analytics metrics enrichment SQL V2 is applied.",
  },
  {
    id: "growth_partners",
    source: "csp_get_platform_overview (read-only)",
    definition: "Approved/active Certified Sales Partner aggregates from existing CSP overview RPC.",
  },
  {
    id: "visits",
    source: "GA4 Measurement ID only",
    definition:
      "Anonymous consented traffic stays in Google Analytics. Platform Admin does not import GA4 report rows without a separate Data API credential.",
  },
] as const;

export const PLATFORM_ANALYTICS_CURRENCY_POLICY =
  "Revenue figures are shown in the currency returned by Core without FX conversion. Mixed-currency portfolios must not be summed into a single converted total.";

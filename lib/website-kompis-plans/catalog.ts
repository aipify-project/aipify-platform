import type { WebsiteKompisPlanDefinition, WebsiteKompisPlanId } from "./types";

/**
 * Owner-decided Kompis Web packages (2026-10-13).
 * Marked planned — not active Stripe SKUs and not entitlement truth.
 */
export const WEBSITE_KOMPIS_PLAN_CATALOG: readonly WebsiteKompisPlanDefinition[] = [
  {
    id: "free",
    answerQuota: 150,
    quotaKind: "lifetime_total",
    offerStatus: "planned",
    requiresCard: false,
    monthlyPrice: null,
    annualPrice: null,
    annualRenewsAnswersMonthly: false,
    checkoutEnabled: false,
  },
  {
    id: "standard",
    answerQuota: 2500,
    quotaKind: "monthly_renewing",
    offerStatus: "planned",
    requiresCard: true,
    monthlyPrice: {
      currency: "NOK",
      amountMinor: 59900,
      amountDisplay: "599",
      billingPeriod: "month",
      vatStatus: "unknown",
    },
    annualPrice: {
      currency: "NOK",
      amountMinor: 599000,
      amountDisplay: "5 990",
      billingPeriod: "year",
      yearEquivalentMonthsPaid: 10,
      vatStatus: "unknown",
    },
    annualRenewsAnswersMonthly: true,
    checkoutEnabled: false,
  },
  {
    id: "pro",
    answerQuota: 10000,
    quotaKind: "monthly_renewing",
    offerStatus: "planned",
    requiresCard: true,
    monthlyPrice: {
      currency: "NOK",
      amountMinor: 119900,
      amountDisplay: "1 199",
      billingPeriod: "month",
      vatStatus: "unknown",
    },
    annualPrice: {
      currency: "NOK",
      amountMinor: 1199000,
      amountDisplay: "11 990",
      billingPeriod: "year",
      yearEquivalentMonthsPaid: 10,
      vatStatus: "unknown",
    },
    annualRenewsAnswersMonthly: true,
    checkoutEnabled: false,
  },
] as const;

export function getWebsiteKompisPlan(id: WebsiteKompisPlanId): WebsiteKompisPlanDefinition {
  const plan = WEBSITE_KOMPIS_PLAN_CATALOG.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown Website Kompis plan: ${id}`);
  return plan;
}

/** Usage meters are not available until Core answer ledger ships. */
export const WEBSITE_KOMPIS_USAGE_METER_AVAILABLE = false;

/** Suggested paid thresholds — Platform-configurable later; not emitted without ledger. */
export const WEBSITE_KOMPIS_SUGGESTED_THRESHOLD_DEFAULTS = {
  free: [30, 10, 0] as const,
  standard: [500, 200, 0] as const,
  pro: [2000, 500, 0] as const,
} as const;

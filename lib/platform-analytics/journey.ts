/**
 * Authoritative customer journey funnel for Platform Analytics V2.
 * Uses Core aggregate counts only — never the seed/demo funnel from CJA275.
 */

import type { AnalyticsPeriod } from "./period";
import { periodMatchesCoreGrowthWindow } from "./period";

export type JourneyStepStatus = "available" | "unavailable" | "partial";

export type JourneyFunnelStep = {
  id: string;
  count: number | null;
  status: JourneyStepStatus;
  source: string;
  note?: string;
};

export type PlatformAnalyticsJourney = {
  periodKey: string;
  generatedAt: string;
  privacyNote: string;
  incompleteDataNote: string;
  steps: JourneyFunnelStep[];
};

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

export function buildPlatformAnalyticsJourney(input: {
  metrics: unknown | null;
  metricsError?: string | null;
  period: AnalyticsPeriod;
  measurementConfigured: boolean;
  generatedAt?: string;
}): PlatformAnalyticsJourney {
  const metricsRow = asRecord(input.metrics);
  const available = Boolean(metricsRow) && !input.metricsError;
  const customers = asRecord(metricsRow?.customers);
  const growth = asRecord(metricsRow?.growth);
  const installations = asRecord(metricsRow?.installations);
  const subscriptions = asRecord(metricsRow?.subscriptions);
  const growthWindowOk = periodMatchesCoreGrowthWindow(input.period);

  const registrations = growthWindowOk ? num(growth?.new_customers_30d) : null;
  const totalCustomers = num(customers?.total);
  const activeCustomers = num(customers?.active);
  const trialCustomers = num(customers?.trial);
  const installsTotal = num(installations?.total);
  const installsActive = num(installations?.active);
  const paidSubs = num(subscriptions?.active) ?? num(subscriptions?.paid_active);

  const steps: JourneyFunnelStep[] = [
    {
      id: "visit",
      count: null,
      status: input.measurementConfigured ? "partial" : "unavailable",
      source: "GA4 measurement (external)",
      note: input.measurementConfigured
        ? "Consented traffic is measured in Google Analytics. Counts are not imported into Platform Admin."
        : "GA4 measurement ID is not configured in this environment.",
    },
    {
      id: "registration",
      count: available ? (growthWindowOk ? registrations : totalCustomers) : null,
      status: available
        ? growthWindowOk
          ? registrations != null
            ? "available"
            : "unavailable"
          : totalCustomers != null
            ? "partial"
            : "unavailable"
        : "unavailable",
      source: growthWindowOk
        ? "get_platform_metrics → growth.new_customers_30d"
        : "get_platform_metrics → customers.total (period not equal to Core 30d window)",
      note: growthWindowOk
        ? undefined
        : "Core exposes new registrations for a fixed 30-day window only. Showing total customers as a partial substitute for other periods.",
    },
    {
      id: "company",
      count: available ? activeCustomers : null,
      status: available && activeCustomers != null ? "partial" : "unavailable",
      source: "get_platform_metrics → customers.active",
      note: "Core metrics do not separate “company created” from active customer status. Shown as active accounts only.",
    },
    {
      id: "product_selected",
      count: available ? installsTotal : null,
      status: available && installsTotal != null ? "partial" : "unavailable",
      source: "get_platform_metrics → installations.total",
      note: "Product selection is approximated by installation records when a dedicated product-choice event is not exposed.",
    },
    {
      id: "installation_activated",
      count: available ? installsActive : null,
      status: available && installsActive != null ? "available" : "unavailable",
      source: "get_platform_metrics → installations.active",
    },
    {
      id: "paid_subscription",
      count: available ? (paidSubs ?? activeCustomers) : null,
      status: available
        ? paidSubs != null
          ? "available"
          : activeCustomers != null
            ? "partial"
            : "unavailable"
        : "unavailable",
      source:
        paidSubs != null
          ? "get_platform_metrics → subscriptions.active"
          : "get_platform_metrics → customers.active",
      note:
        paidSubs != null
          ? undefined
          : "Dedicated subscription headcount requires Platform Analytics metrics enrichment SQL V2. Until applied, active customer status is a partial proxy — not verified paid seats.",
    },
    {
      id: "trial",
      count: available ? trialCustomers : null,
      status: available && trialCustomers != null ? "available" : "unavailable",
      source: "get_platform_metrics → customers.trial",
    },
  ];

  return {
    periodKey: input.period.key,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    privacyNote:
      "Aggregates only. Anonymous visits are not joined to identified customers. No emails or payment instruments.",
    incompleteDataNote:
      "Steps marked partial or unavailable lack a dedicated Core event. Invented conversion rates are never shown.",
    steps,
  };
}

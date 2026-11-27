/**
 * Platform Analytics V2 — aggregates authorised Core metrics for Platform Admin.
 * No invented or demo figures. Missing sources surface as unavailable.
 */

import {
  PLATFORM_ANALYTICS_CURRENCY_POLICY,
  PLATFORM_ANALYTICS_KPI_DEFINITIONS,
  type AnalyticsKpiDefinition,
} from "./definitions";
import type { AnalyticsPeriod } from "./period";
import { periodMatchesCoreGrowthWindow } from "./period";

export type PlatformAnalyticsMetricCard = {
  id: string;
  value: number | null;
  available: boolean;
  /** When true, Core only exposes a fixed 30d window for this growth metric. */
  limitedToCoreWindow?: boolean;
  definitionId?: string;
};

export type PlatformAnalyticsOverview = {
  generatedAt: string;
  periodKey: string;
  privacyNote: string;
  currencyPolicy: string;
  definitions: readonly AnalyticsKpiDefinition[];
  ga4: {
    measurementConfigured: boolean;
    dataApiNote: string;
  };
  metrics: {
    customersTotal: PlatformAnalyticsMetricCard;
    customerRegistrationsPeriod: PlatformAnalyticsMetricCard;
    activeAppCustomers: PlatformAnalyticsMetricCard;
    trialCustomers: PlatformAnalyticsMetricCard;
    cancelledCustomers: PlatformAnalyticsMetricCard;
    activeBusinesses: PlatformAnalyticsMetricCard;
    installationsTotal: PlatformAnalyticsMetricCard;
    activeGrowthPartners: PlatformAnalyticsMetricCard;
    /** Explicitly not aliased from customers.active — unavailable until Core returns subscription counts. */
    activeSubscriptions: PlatformAnalyticsMetricCard;
    revenueMrr: PlatformAnalyticsMetricCard;
    revenueArr: PlatformAnalyticsMetricCard;
    outstandingInvoices: PlatformAnalyticsMetricCard;
    moduleUsage: PlatformAnalyticsMetricCard;
    academyPartners: PlatformAnalyticsMetricCard;
    certifiedPartners: PlatformAnalyticsMetricCard;
  };
  mostUsedModules: string[];
  previousPeriodNote: string;
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

function card(
  id: string,
  value: number | null,
  available: boolean,
  extras?: Partial<PlatformAnalyticsMetricCard>,
): PlatformAnalyticsMetricCard {
  return { id, value, available, ...extras };
}

export function buildPlatformAnalyticsOverview(input: {
  metrics: unknown | null;
  metricsError?: string | null;
  cspOverview: unknown | null;
  cspError?: string | null;
  measurementIdConfigured: boolean;
  period: AnalyticsPeriod;
  generatedAt?: string;
}): PlatformAnalyticsOverview {
  const metricsRow = asRecord(input.metrics);
  const customers = asRecord(metricsRow?.customers);
  const revenue = asRecord(metricsRow?.revenue);
  const growth = asRecord(metricsRow?.growth);
  const installations = asRecord(metricsRow?.installations);
  const subscriptions = asRecord(metricsRow?.subscriptions);

  const metricsAvailable = Boolean(metricsRow) && !input.metricsError;
  const cspRow = asRecord(input.cspOverview);
  const cspAvailable = Boolean(cspRow) && !input.cspError;
  const growthWindowOk = periodMatchesCoreGrowthWindow(input.period);

  const partnerCounts = asRecord(cspRow?.partner_counts) ?? asRecord(cspRow?.partners);
  const academy = asRecord(cspRow?.academy) ?? asRecord(cspRow?.academy_summary);

  let activeGrowthPartners: number | null = null;
  if (cspAvailable) {
    activeGrowthPartners =
      num(cspRow?.approved_partners) ??
      num(cspRow?.active_partners) ??
      num(partnerCounts?.approved) ??
      num(partnerCounts?.active) ??
      num(cspRow?.partner_count);
  }

  let academyPartners: number | null = null;
  if (cspAvailable) {
    academyPartners =
      num(academy?.partners_in_academy) ??
      num(academy?.in_academy) ??
      num(cspRow?.partners_in_academy) ??
      num(partnerCounts?.in_academy);
  }

  let certifiedPartners: number | null = null;
  if (cspAvailable) {
    certifiedPartners =
      num(cspRow?.certified_partners) ??
      num(partnerCounts?.certified) ??
      num(academy?.certified);
  }

  const mostUsed = Array.isArray(growth?.most_used_modules)
    ? growth!.most_used_modules.filter((m): m is string => typeof m === "string").slice(0, 8)
    : [];

  const newCustomers = num(growth?.new_customers_30d);

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    periodKey: input.period.key,
    privacyNote:
      "Aggregates only. No customer emails, chat content, or payment instrument details are shown.",
    currencyPolicy: PLATFORM_ANALYTICS_CURRENCY_POLICY,
    definitions: PLATFORM_ANALYTICS_KPI_DEFINITIONS,
    ga4: {
      measurementConfigured: input.measurementIdConfigured,
      dataApiNote:
        "GA4 traffic and conversion detail remains in Google Analytics (Measurement ID via NEXT_PUBLIC_GA_MEASUREMENT_ID). Importing GA4 report data into Platform Admin requires a separate Google Analytics Data API credential — not provisioned without owner approval.",
    },
    metrics: {
      customersTotal: card(
        "customers_total",
        metricsAvailable ? num(customers?.total) : null,
        metricsAvailable && num(customers?.total) != null,
        { definitionId: "customers_total" },
      ),
      customerRegistrationsPeriod: card(
        "customer_registrations_period",
        metricsAvailable && growthWindowOk ? newCustomers : null,
        metricsAvailable && growthWindowOk && newCustomers != null,
        {
          limitedToCoreWindow: !growthWindowOk,
          definitionId: "new_customers_30d",
        },
      ),
      activeAppCustomers: card(
        "active_app_customers",
        metricsAvailable ? num(customers?.active) : null,
        metricsAvailable && num(customers?.active) != null,
        { definitionId: "customers_active" },
      ),
      trialCustomers: card(
        "trial_customers",
        metricsAvailable ? num(customers?.trial) : null,
        metricsAvailable && num(customers?.trial) != null,
        { definitionId: "customers_trial" },
      ),
      cancelledCustomers: card(
        "cancelled_customers",
        metricsAvailable ? num(customers?.cancelled) : null,
        metricsAvailable && num(customers?.cancelled) != null,
        { definitionId: "customers_cancelled" },
      ),
      activeBusinesses: card(
        "active_businesses",
        metricsAvailable ? num(installations?.active) : null,
        metricsAvailable && num(installations?.active) != null,
        { definitionId: "installations_active" },
      ),
      installationsTotal: card(
        "installations_total",
        metricsAvailable ? num(installations?.total) : null,
        metricsAvailable && num(installations?.total) != null,
      ),
      activeGrowthPartners: card(
        "active_growth_partners",
        activeGrowthPartners,
        cspAvailable && activeGrowthPartners != null,
        { definitionId: "growth_partners" },
      ),
      activeSubscriptions: card(
        "active_subscriptions",
        metricsAvailable ? num(subscriptions?.active) ?? num(subscriptions?.paid_active) : null,
        metricsAvailable &&
          (num(subscriptions?.active) != null || num(subscriptions?.paid_active) != null),
        {
          definitionId: "active_subscriptions",
        },
      ),
      revenueMrr: card(
        "revenue_mrr",
        metricsAvailable ? num(revenue?.mrr) : null,
        metricsAvailable && num(revenue?.mrr) != null,
        { definitionId: "mrr" },
      ),
      revenueArr: card(
        "revenue_arr",
        metricsAvailable ? num(revenue?.arr) : null,
        metricsAvailable && num(revenue?.arr) != null,
        { definitionId: "arr" },
      ),
      outstandingInvoices: card(
        "outstanding_invoices",
        metricsAvailable ? num(revenue?.outstanding_invoice_amount) : null,
        metricsAvailable && num(revenue?.outstanding_invoice_amount) != null,
        { definitionId: "outstanding_invoices" },
      ),
      moduleUsage: card(
        "module_usage",
        mostUsed.length > 0 ? mostUsed.length : null,
        metricsAvailable && mostUsed.length > 0,
      ),
      academyPartners: card(
        "academy_partners",
        academyPartners,
        cspAvailable && academyPartners != null,
      ),
      certifiedPartners: card(
        "certified_partners",
        certifiedPartners,
        cspAvailable && certifiedPartners != null,
      ),
    },
    mostUsedModules: mostUsed,
    previousPeriodNote:
      "Core does not expose historical time-series for MRR or registrations. Previous-period comparisons are unavailable until a versioned metrics history RPC is approved.",
  };
}

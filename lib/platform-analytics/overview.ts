/**
 * Platform Analytics V1 — aggregates authorised Core metrics for Platform Admin.
 * No invented or demo figures. Missing sources surface as unavailable.
 */

export type PlatformAnalyticsMetricCard = {
  id: string;
  value: number | null;
  available: boolean;
};

export type PlatformAnalyticsOverview = {
  generatedAt: string;
  privacyNote: string;
  ga4: {
    measurementConfigured: boolean;
    dataApiNote: string;
  };
  metrics: {
    customerRegistrations30d: PlatformAnalyticsMetricCard;
    activeAppCustomers: PlatformAnalyticsMetricCard;
    activeBusinesses: PlatformAnalyticsMetricCard;
    activeGrowthPartners: PlatformAnalyticsMetricCard;
    activeSubscriptions: PlatformAnalyticsMetricCard;
    revenueMrr: PlatformAnalyticsMetricCard;
    moduleUsage: PlatformAnalyticsMetricCard;
    academyPartners: PlatformAnalyticsMetricCard;
  };
  mostUsedModules: string[];
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

export function buildPlatformAnalyticsOverview(input: {
  metrics: unknown | null;
  metricsError?: string | null;
  cspOverview: unknown | null;
  cspError?: string | null;
  measurementIdConfigured: boolean;
  generatedAt?: string;
}): PlatformAnalyticsOverview {
  const metricsRow = asRecord(input.metrics);
  const customers = asRecord(metricsRow?.customers);
  const revenue = asRecord(metricsRow?.revenue);
  const growth = asRecord(metricsRow?.growth);
  const installations = asRecord(metricsRow?.installations);

  const metricsAvailable = Boolean(metricsRow) && !input.metricsError;
  const cspRow = asRecord(input.cspOverview);
  const cspAvailable = Boolean(cspRow) && !input.cspError;

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
      num(partnerCounts?.in_academy) ??
      num(cspRow?.certified_partners);
  }

  const mostUsed = Array.isArray(growth?.most_used_modules)
    ? growth!.most_used_modules.filter((m): m is string => typeof m === "string").slice(0, 8)
    : [];

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    privacyNote:
      "Aggregates only. No customer emails, chat content, or payment instrument details are shown.",
    ga4: {
      measurementConfigured: input.measurementIdConfigured,
      dataApiNote:
        "GA4 traffic and conversion detail remains in Google Analytics (Measurement ID via NEXT_PUBLIC_GA_MEASUREMENT_ID). Importing GA4 report data into Platform Admin requires a separate Google Analytics Data API credential — not provisioned in this release.",
    },
    metrics: {
      customerRegistrations30d: {
        id: "customer_registrations_30d",
        value: metricsAvailable ? num(growth?.new_customers_30d) : null,
        available: metricsAvailable && num(growth?.new_customers_30d) != null,
      },
      activeAppCustomers: {
        id: "active_app_customers",
        value: metricsAvailable ? num(customers?.active) : null,
        available: metricsAvailable && num(customers?.active) != null,
      },
      activeBusinesses: {
        id: "active_businesses",
        value: metricsAvailable ? num(installations?.active) : null,
        available: metricsAvailable && num(installations?.active) != null,
      },
      activeGrowthPartners: {
        id: "active_growth_partners",
        value: activeGrowthPartners,
        available: cspAvailable && activeGrowthPartners != null,
      },
      activeSubscriptions: {
        id: "active_subscriptions",
        value: metricsAvailable ? num(customers?.active) : null,
        available: metricsAvailable && num(customers?.active) != null,
      },
      revenueMrr: {
        id: "revenue_mrr",
        value: metricsAvailable ? num(revenue?.mrr) : null,
        available: metricsAvailable && num(revenue?.mrr) != null,
      },
      moduleUsage: {
        id: "module_usage",
        value: mostUsed.length > 0 ? mostUsed.length : metricsAvailable ? num(installations?.total) : null,
        available: metricsAvailable && (mostUsed.length > 0 || num(installations?.total) != null),
      },
      academyPartners: {
        id: "academy_partners",
        value: academyPartners,
        available: cspAvailable && academyPartners != null,
      },
    },
    mostUsedModules: mostUsed,
  };
}

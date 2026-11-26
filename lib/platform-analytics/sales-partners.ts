/**
 * Read-only CSP / Growth Partner aggregates for Platform Analytics.
 * Does not mutate CSP rules or tables.
 */

export type PlatformAnalyticsSalesPartners = {
  generatedAt: string;
  available: boolean;
  error: string | null;
  privacyNote: string;
  metrics: {
    approvedPartners: number | null;
    certifiedPartners: number | null;
    inAcademy: number | null;
    attributionLinks: number | null;
    clicks: number | null;
    leads: number | null;
    qualifiedSales: number | null;
    earnedCommission: number | null;
    unpaidSettlements: number | null;
  };
  notes: string[];
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

export function buildPlatformAnalyticsSalesPartners(input: {
  cspOverview: unknown | null;
  cspError?: string | null;
  generatedAt?: string;
}): PlatformAnalyticsSalesPartners {
  const row = asRecord(input.cspOverview);
  const available = Boolean(row) && !input.cspError;
  const partners = asRecord(row?.partner_counts) ?? asRecord(row?.partners);
  const academy = asRecord(row?.academy) ?? asRecord(row?.academy_summary);
  const attribution = asRecord(row?.attribution) ?? asRecord(row?.attribution_summary);
  const sales = asRecord(row?.sales) ?? asRecord(row?.sales_summary);
  const commission = asRecord(row?.commission) ?? asRecord(row?.commission_summary);
  const settlements = asRecord(row?.settlements) ?? asRecord(row?.settlement_summary);

  const notes: string[] = [];
  if (!available) {
    notes.push("CSP platform overview is unavailable. Seller metrics cannot be shown.");
  } else {
    notes.push(
      "Figures come only from csp_get_platform_overview. Missing keys are shown as not available — they are not invented.",
    );
  }

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    available,
    error: input.cspError ?? null,
    privacyNote: "Partner aggregates only. No bank details or individual customer PII.",
    metrics: {
      approvedPartners: available
        ? num(row?.approved_partners) ??
          num(partners?.approved) ??
          num(row?.active_partners) ??
          num(partners?.active)
        : null,
      certifiedPartners: available
        ? num(row?.certified_partners) ?? num(partners?.certified)
        : null,
      inAcademy: available
        ? num(academy?.partners_in_academy) ??
          num(academy?.in_academy) ??
          num(partners?.in_academy)
        : null,
      attributionLinks: available
        ? num(attribution?.links) ?? num(attribution?.link_count) ?? num(row?.attribution_links)
        : null,
      clicks: available
        ? num(attribution?.clicks) ?? num(attribution?.click_count) ?? num(row?.clicks)
        : null,
      leads: available ? num(attribution?.leads) ?? num(row?.leads) : null,
      qualifiedSales: available
        ? num(sales?.qualified) ?? num(sales?.qualified_sales) ?? num(row?.qualified_sales)
        : null,
      earnedCommission: available
        ? num(commission?.earned) ?? num(commission?.earned_amount) ?? num(row?.earned_commission)
        : null,
      unpaidSettlements: available
        ? num(settlements?.unpaid) ??
          num(settlements?.open) ??
          num(row?.unpaid_settlements)
        : null,
    },
    notes,
  };
}

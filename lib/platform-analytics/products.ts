/**
 * Product / module analytics from authorised Core aggregates.
 * Unpublished catalog products are never invented here.
 */

export type PlatformProductAnalyticsRow = {
  key: string;
  kind: "module" | "csp_product";
  usageCount: number | null;
  published: boolean | null;
  status: "available" | "partial" | "unavailable";
  source: string;
};

export type PlatformProductAnalytics = {
  generatedAt: string;
  available: boolean;
  rows: PlatformProductAnalyticsRow[];
  notes: string[];
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

export function buildPlatformProductAnalytics(input: {
  metrics: unknown | null;
  metricsError?: string | null;
  cspOverview: unknown | null;
  cspError?: string | null;
  generatedAt?: string;
}): PlatformProductAnalytics {
  const metricsRow = asRecord(input.metrics);
  const growth = asRecord(metricsRow?.growth);
  const metricsOk = Boolean(metricsRow) && !input.metricsError;
  const cspRow = asRecord(input.cspOverview);
  const cspOk = Boolean(cspRow) && !input.cspError;

  const rows: PlatformProductAnalyticsRow[] = [];
  const modules = Array.isArray(growth?.most_used_modules) ? growth!.most_used_modules : [];
  for (const key of modules) {
    if (typeof key !== "string" || !key.trim()) continue;
    rows.push({
      key,
      kind: "module",
      usageCount: null,
      published: true,
      status: "partial",
      source: "get_platform_metrics → growth.most_used_modules (keys only; counts not returned)",
    });
  }

  const products = Array.isArray(cspRow?.products) ? cspRow!.products : [];
  for (const item of products) {
    const row = asRecord(item);
    if (!row) continue;
    const key = typeof row.product_key === "string" ? row.product_key : typeof row.key === "string" ? row.key : "";
    if (!key) continue;
    const published =
      typeof row.published === "boolean"
        ? row.published
        : typeof row.status === "string"
          ? row.status === "published" || row.status === "active"
          : null;
    if (published === false) continue;
    rows.push({
      key,
      kind: "csp_product",
      usageCount: num(row.active_subscriptions) ?? num(row.customers) ?? null,
      published,
      status: published === true ? "available" : "partial",
      source: "csp_get_platform_overview → products[]",
    });
  }

  const notes: string[] = [
    "Only modules/products returned by Core are listed. Unpublished CSP products are omitted.",
    "Plan distribution and upgrade history require dedicated Core history RPCs — not invented here.",
  ];
  if (!metricsOk && !cspOk) {
    notes.unshift("Neither platform metrics nor CSP overview returned product data.");
  }

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    available: rows.length > 0,
    rows,
    notes,
  };
}

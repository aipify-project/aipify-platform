/**
 * Pure ranking / search helpers for Platform > Selgere overview.
 * Operates only on counts Core actually returned — never invents a metric.
 */

export type SellerRankMetric = "clicks" | "registrations" | "qualifiedSales";

export type SellerRankRow = {
  partnerId: string;
  displayName: string | null;
  country: string | null;
  status: string;
  clicks: number;
  registrations: number;
  qualifiedSales: number;
  avatarUrl: string | null;
};

function count(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0;
}

function text(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}

/** `null` when the payload is not a ranking response (UI shows an honest "not available"). */
export function parseSellerRanking(payload: unknown): SellerRankRow[] | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const root = payload as Record<string, unknown>;
  const list = Array.isArray(root.sellers) ? root.sellers : Array.isArray(root.rows) ? root.rows : null;
  if (!list) return null;
  return list.flatMap((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
    const r = raw as Record<string, unknown>;
    const partnerId = text(r.partnerId);
    if (!partnerId) return [];
    return [
      {
        partnerId,
        displayName: text(r.displayName),
        country: text(r.country),
        status: text(r.status) ?? "unknown",
        clicks: count(r.clicks),
        registrations: count(r.registrations),
        qualifiedSales: count(r.qualifiedSales),
        avatarUrl: text(r.avatarUrl),
      },
    ];
  });
}

const METRIC_ORDER: Record<SellerRankMetric, SellerRankMetric[]> = {
  clicks: ["clicks", "registrations", "qualifiedSales"],
  registrations: ["registrations", "clicks", "qualifiedSales"],
  qualifiedSales: ["qualifiedSales", "clicks", "registrations"],
};

/** Descending by the chosen metric, then the remaining metrics, then name and id for a stable order. */
export function sortSellerRanking(rows: readonly SellerRankRow[], metric: SellerRankMetric = "clicks"): SellerRankRow[] {
  const order = METRIC_ORDER[metric];
  return [...rows].sort((a, b) => {
    for (const key of order) {
      if (b[key] !== a[key]) return b[key] - a[key];
    }
    const an = (a.displayName ?? "").toLocaleLowerCase();
    const bn = (b.displayName ?? "").toLocaleLowerCase();
    if (an !== bn) return an < bn ? -1 : 1;
    return a.partnerId < b.partnerId ? -1 : a.partnerId > b.partnerId ? 1 : 0;
  });
}

export function topSellers(
  rows: readonly SellerRankRow[],
  limit = 5,
  metric: SellerRankMetric = "clicks",
): SellerRankRow[] {
  return sortSellerRanking(rows, metric).slice(0, Math.max(0, limit));
}

export type SellerFilter = {
  query?: string;
  /** ISO 3166-1 alpha-2, or "all" / empty for no filter. */
  country?: string;
  /** Partner status code, or "all" / empty for no filter. */
  status?: string;
  /** Resolves a country code to a localized name so searching "Norway" / "Norge" works. */
  countryLabel?: (code: string) => string;
  /** Partner ids whose email matched the query (resolved server-side). */
  emailMatchIds?: ReadonlySet<string>;
};

const ID_PREFIX_RE = /^[0-9a-f-]{4,}$/i;

/** Name, country (code or localized name), id prefix (4+ hex chars) or server-confirmed email match. */
export function matchesSellerQuery(row: SellerRankRow, query: string, filter: SellerFilter = {}): boolean {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  if (row.displayName && row.displayName.toLocaleLowerCase().includes(q)) return true;
  if (row.country) {
    const code = row.country.toLocaleLowerCase();
    if (code === q) return true;
    const label = filter.countryLabel?.(row.country)?.toLocaleLowerCase();
    if (label && label.includes(q)) return true;
  }
  if (ID_PREFIX_RE.test(q) && row.partnerId.toLowerCase().startsWith(q)) return true;
  if (filter.emailMatchIds?.has(row.partnerId)) return true;
  return false;
}

export function filterSellerRanking(rows: readonly SellerRankRow[], filter: SellerFilter = {}): SellerRankRow[] {
  const country = filter.country && filter.country !== "all" ? filter.country.toUpperCase() : null;
  const status = filter.status && filter.status !== "all" ? filter.status : null;
  return rows.filter((row) => {
    if (country && (row.country ?? "").toUpperCase() !== country) return false;
    if (status && row.status !== status) return false;
    return matchesSellerQuery(row, filter.query ?? "", filter);
  });
}

/** Distinct countries present in the data (sorted by code) — a filter never offers a country with no sellers. */
export function availableSellerCountries(rows: readonly SellerRankRow[]): string[] {
  return [...new Set(rows.flatMap((r) => (r.country ? [r.country.toUpperCase()] : [])))].sort();
}

/** Distinct partner statuses present in the data, in the order given by `preferred` then alphabetical. */
export function availableSellerStatuses(rows: readonly SellerRankRow[], preferred: readonly string[]): string[] {
  const present = new Set(rows.map((r) => r.status));
  const ordered = preferred.filter((s) => present.has(s));
  const extra = [...present].filter((s) => !preferred.includes(s)).sort();
  return [...ordered, ...extra];
}

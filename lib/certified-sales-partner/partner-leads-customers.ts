/**
 * CSP seller Leads + Mine kunder view model — pure, client-safe, no I/O.
 *
 * Reads ONLY what the partner-scoped APIs returned. The APIs never send the customer
 * organisation id, payment method or invoice data, and these parsers never read them either.
 * Anything absent stays `null` so the UI never fabricates sales, money or dates.
 */
import { CSP_REQUIRED_PAID_PERIODS } from "./constants";

export type CspLeadRow = {
  id: string | null;
  linkCode: string | null;
  channel: string | null;
  attributedAt: string | null;
  registeredAt: string | null;
  windowExpiresAt: string | null;
  /** Latest qualified sale for this lead's customer (if any). */
  productKey: string | null;
  saleStatus: string | null;
};

export type CspCustomerRow = {
  id: string | null;
  productKey: string | null;
  status: string | null;
  paidPeriodsCount: number | null;
  snapshotAmount: number | null;
  snapshotCurrency: string | null;
  attributedAt: string | null;
  firstConfirmedAt: string | null;
};

export type CspLeadStage = "converted" | "window_open" | "window_expired" | "unknown";

export type CspCommissionQualification =
  | "awaiting_second_payment"
  | "being_verified"
  | "qualified"
  | "not_qualified"
  | "unknown";

export const CSP_LEAD_STAGES: readonly CspLeadStage[] = ["converted", "window_open", "window_expired", "unknown"];
export const CSP_COMMISSION_QUALIFICATIONS: readonly CspCommissionQualification[] = [
  "awaiting_second_payment",
  "being_verified",
  "qualified",
  "not_qualified",
  "unknown",
];

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}
function s(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}
function n(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}
function list(payload: unknown, key: string): unknown[] {
  if (Array.isArray(payload)) return payload;
  const inner = rec(payload)[key];
  return Array.isArray(inner) ? inner : [];
}

/** Partner-visible lead columns only — customer organisation identity is never read. */
export function parseCspLeadRows(payload: unknown): CspLeadRow[] {
  return list(payload, "leads").map((item) => {
    const r = rec(item);
    return {
      id: s(r.id),
      linkCode: s(r.link_code),
      channel: s(r.channel),
      attributedAt: s(r.attributed_at),
      registeredAt: s(r.registered_at),
      windowExpiresAt: s(r.window_expires_at),
      productKey: s(r.product_key),
      saleStatus: s(r.sale_status),
    };
  });
}

/** Partner-visible sale columns only — no payment method, invoice or customer organisation data. */
export function parseCspCustomerRows(payload: unknown): CspCustomerRow[] {
  return list(payload, "customers").map((item) => {
    const r = rec(item);
    return {
      id: s(r.id),
      productKey: s(r.product_key),
      status: s(r.status),
      paidPeriodsCount: n(r.paid_periods_count),
      snapshotAmount: n(r.snapshot_amount),
      snapshotCurrency: s(r.snapshot_currency),
      attributedAt: s(r.attributed_at),
      firstConfirmedAt: s(r.first_confirmed_at),
    };
  });
}

/**
 * Business stage of a lead. A lead with a qualified sale is `converted`; otherwise the 90-day
 * attribution window decides open/expired. Unparseable dates are `unknown`, never guessed.
 */
export function deriveCspLeadStage(row: CspLeadRow, now: Date = new Date()): CspLeadStage {
  if (row.saleStatus !== null) return "converted";
  if (!row.windowExpiresAt) return "unknown";
  const expires = new Date(row.windowExpiresAt).getTime();
  if (Number.isNaN(expires)) return "unknown";
  return expires > now.getTime() ? "window_open" : "window_expired";
}

/**
 * Commission qualification derived from Core's sale status. Core is authoritative: paid periods
 * are never used to promote a sale to `qualified` when the status says otherwise.
 */
export function deriveCspCommissionQualification(status: string | null): CspCommissionQualification {
  switch (status) {
    case "registered_awaiting_second_payment":
      return "awaiting_second_payment";
    case "pending_possible":
      return "being_verified";
    case "earned":
    case "approved_for_payout":
    case "queued_for_payout":
    case "paid":
      return "qualified";
    case "reversed":
    case "rejected":
      return "not_qualified";
    default:
      return "unknown";
  }
}

/** Paid-period progress toward the qualifying payment (never above the requirement). */
export function cspPaidPeriodProgress(paidPeriodsCount: number | null): { paid: number; required: number } | null {
  if (paidPeriodsCount === null || paidPeriodsCount < 0) return null;
  return { paid: Math.min(Math.floor(paidPeriodsCount), CSP_REQUIRED_PAID_PERIODS), required: CSP_REQUIRED_PAID_PERIODS };
}

function norm(v: string): string {
  return v.trim().toLocaleLowerCase();
}

function matchesQuery(haystack: Array<string | null | undefined>, query: string): boolean {
  const q = norm(query);
  if (!q) return true;
  return haystack.some((part) => typeof part === "string" && norm(part).includes(q));
}

export type CspLeadFilter = {
  query?: string;
  /** `all` or empty keeps every stage. */
  stage?: CspLeadStage | "all";
  now?: Date;
  /** Localised display text that should also be searchable (product title, channel label, stage label). */
  productNames?: Record<string, string>;
  channelLabels?: Record<string, string>;
  stageLabels?: Partial<Record<CspLeadStage, string>>;
};

export function filterCspLeadRows(rows: CspLeadRow[], filter: CspLeadFilter): CspLeadRow[] {
  const now = filter.now ?? new Date();
  return rows.filter((row) => {
    const stage = deriveCspLeadStage(row, now);
    if (filter.stage && filter.stage !== "all" && stage !== filter.stage) return false;
    return matchesQuery(
      [
        row.linkCode,
        row.channel,
        row.productKey,
        row.productKey ? filter.productNames?.[row.productKey] : null,
        row.channel ? filter.channelLabels?.[row.channel] : null,
        filter.stageLabels?.[stage],
      ],
      filter.query ?? "",
    );
  });
}

export type CspCustomerFilter = {
  query?: string;
  qualification?: CspCommissionQualification | "all";
  productNames?: Record<string, string>;
  qualificationLabels?: Partial<Record<CspCommissionQualification, string>>;
  statusLabels?: Record<string, string>;
};

export function filterCspCustomerRows(rows: CspCustomerRow[], filter: CspCustomerFilter): CspCustomerRow[] {
  return rows.filter((row) => {
    const qualification = deriveCspCommissionQualification(row.status);
    if (filter.qualification && filter.qualification !== "all" && qualification !== filter.qualification) return false;
    return matchesQuery(
      [
        row.productKey,
        row.productKey ? filter.productNames?.[row.productKey] : null,
        row.status ? filter.statusLabels?.[row.status] : null,
        filter.qualificationLabels?.[qualification],
      ],
      filter.query ?? "",
    );
  });
}

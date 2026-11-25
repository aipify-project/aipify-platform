/**
 * CSP partner dashboard view model — pure, client-safe, no I/O.
 *
 * Reads ONLY what `csp_get_partner_overview` returned. Anything Core did not send stays `null`
 * (or empty) so the UI never fabricates numbers or money.
 */
import { CSP_LINK_ELIGIBLE_PARTNER_STATUSES, parsePartnerOverview, type CspParsedOverview } from "./partner-overview";

export type CspPortalLink = {
  id: string | null;
  code: string | null;
  channel: string | null;
  active: boolean;
  createdAt: string | null;
};

export type CspPortalView = {
  overview: CspParsedOverview;
  links: CspPortalLink[];
  /** sale status -> count, exactly as Core aggregated it. */
  salesByStatus: Record<string, number>;
  salesTotal: number;
  /** currency -> ledger balance, only for currencies Core returned. */
  ledgerByCurrency: Record<string, number>;
  bankProfileStatus: string | null;
  hasBankProfile: boolean | null;
  passedCertificationCount: number;
  publishedProductCount: number;
};

export type CspNextActionKey =
  | "awaiting_approval"
  | "provide_information"
  | "not_active"
  | "train"
  | "create_link"
  | "view_sales";

export type CspNextAction = {
  key: CspNextActionKey;
  href: string | null;
};

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function numberMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(rec(v))) {
    const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
    if (Number.isFinite(n)) out[key] = n;
  }
  return out;
}

export function parseCspPortalView(data: unknown): CspPortalView {
  const root = rec(data);
  const overview = parsePartnerOverview(data);
  const links: CspPortalLink[] = (Array.isArray(root.links) ? root.links : []).map((item) => {
    const l = rec(item);
    return {
      id: typeof l.id === "string" ? l.id : null,
      code: typeof l.code === "string" ? l.code : null,
      channel: typeof l.channel_origin === "string" ? l.channel_origin : null,
      active: l.active !== false,
      createdAt: typeof l.created_at === "string" ? l.created_at : null,
    };
  });
  const summary = rec(root.sales_summary);
  const salesByStatus = numberMap(summary.by_status);
  const bank = rec(root.bank_profile);
  const passed = new Set<string>();
  for (const p of overview.products) {
    if (p.certificationStatus === "passed") passed.add(p.productKey ?? p.id ?? "");
  }
  for (const c of overview.certifications) {
    if (c.status === "passed") passed.add(c.productKey ?? c.productId ?? "");
  }
  passed.delete("");
  return {
    overview,
    links,
    salesByStatus,
    salesTotal: Object.values(salesByStatus).reduce((a, b) => a + b, 0),
    ledgerByCurrency: numberMap(summary.ledger_balance_by_currency),
    bankProfileStatus: typeof bank.status === "string" ? bank.status : null,
    hasBankProfile: typeof bank.has_profile === "boolean" ? bank.has_profile : null,
    passedCertificationCount: passed.size,
    publishedProductCount: overview.products.length,
  };
}

/** Single recommended next step for the partner — informs, never pressures. */
export function deriveCspNextAction(view: CspPortalView): CspNextAction {
  const status = view.overview.partnerStatus;
  const approved = status !== null && (CSP_LINK_ELIGIBLE_PARTNER_STATUSES as readonly string[]).includes(status);
  if (!approved) {
    if (status === "needs_information") return { key: "provide_information", href: null };
    if (status === "rejected" || status === "suspended") return { key: "not_active", href: null };
    return { key: "awaiting_approval", href: null };
  }
  if (view.passedCertificationCount === 0) return { key: "train", href: "/partners/academy/training" };
  if (view.links.filter((l) => l.active).length === 0) {
    return { key: "create_link", href: "/partners/marketing/product-catalog" };
  }
  return { key: "view_sales", href: "/partners/customers/pipeline" };
}

/** Product keys for which the partner may currently pick a sales link (published products only). */
export function listSellableProductKeys(view: CspPortalView): string[] {
  return view.overview.products.map((p) => p.productKey).filter((k): k is string => typeof k === "string");
}

export type CspSaleRow = {
  id: string | null;
  productKey: string | null;
  status: string | null;
  paidPeriodsCount: number | null;
  snapshotAmount: number | null;
  snapshotCurrency: string | null;
  attributedAt: string | null;
};

export type CspSettlementRow = {
  id: string | null;
  periodMonth: string | null;
  status: string | null;
  totalAmount: number | null;
  currency: string | null;
  closedAt: string | null;
  lineCount: number | null;
};

function s(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}
function n(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

/** Partner-visible columns only — customer organisation identity is never read. */
export function parseCspSaleRows(payload: unknown): CspSaleRow[] {
  const list = Array.isArray(payload) ? payload : Array.isArray(rec(payload).sales) ? (rec(payload).sales as unknown[]) : [];
  return list.map((item) => {
    const r = rec(item);
    return {
      id: s(r.id),
      productKey: s(r.product_key),
      status: s(r.status),
      paidPeriodsCount: n(r.paid_periods_count),
      snapshotAmount: n(r.snapshot_amount),
      snapshotCurrency: s(r.snapshot_currency),
      attributedAt: s(r.attributed_at),
    };
  });
}

export function parseCspSettlementRows(payload: unknown): CspSettlementRow[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(rec(payload).settlements)
      ? (rec(payload).settlements as unknown[])
      : [];
  return list.map((item) => {
    const r = rec(item);
    return {
      id: s(r.id),
      periodMonth: s(r.period_month),
      status: s(r.status),
      totalAmount: n(r.total_amount),
      currency: s(r.currency),
      closedAt: s(r.closed_at),
      lineCount: n(r.line_count),
    };
  });
}

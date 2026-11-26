/**
 * Pure view-model helpers for the canonical Certified Seller profile (Platform Admin).
 * No React, no i18n, no network. Anything Core did not report stays `null`
 * so the UI can show "not reported" instead of inventing a zero.
 */

export type SellerProfileLink = {
  id: string;
  code: string;
  channelOrigin: string | null;
  active: boolean;
  createdAt: string | null;
  clicks: number;
  registrations: number;
};

export type SellerProfileSale = {
  id: string;
  productKey: string | null;
  status: string | null;
  attributedAt: string | null;
  amount: number | null;
  currency: string | null;
  paidPeriodsCount: number | null;
};

export type SellerProfileSettlement = {
  id: string;
  periodMonth: string | null;
  status: string;
  totalAmount: number | null;
  currency: string | null;
  createdAt: string | null;
};

export type SellerProfileLedgerEntry = {
  id: string;
  entryType: string;
  amount: number | null;
  currency: string | null;
  createdAt: string | null;
};

export type SellerProfileAuditRow = {
  id: string;
  action: string;
  actorKind: string | null;
  createdAt: string | null;
};

export type SellerProfileData = {
  totals: {
    clicks: number | null;
    registrations: number | null;
    qualifiedSales: number | null;
    openSettlements: number | null;
  };
  /** `null` = could not be read; `[]` = read successfully and empty. */
  links: SellerProfileLink[] | null;
  sales: SellerProfileSale[] | null;
  settlements: SellerProfileSettlement[] | null;
  ledger: {
    entries: SellerProfileLedgerEntry[];
    /** `null` when the ledger was truncated or unreadable — never a partial sum. */
    earnedByCurrency: Record<string, number> | null;
  } | null;
  audit: SellerProfileAuditRow[] | null;
};

export type SellerProfileKpis = {
  clicks: number | null;
  registrations: number | null;
  sales: number | null;
  /** Sum of earned ledger entries per currency; `null` when Core did not report it. */
  commissionsEarnedByCurrency: Record<string, number> | null;
  certifications: number | null;
  openSettlements: number | null;
};

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

function nonNegative(v: unknown): number | null {
  const n = num(v);
  return n !== null && n >= 0 ? n : null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}

function list(v: unknown): Array<Record<string, unknown>> | null {
  if (!Array.isArray(v)) return null;
  return v.filter((r): r is Record<string, unknown> => !!r && typeof r === "object" && !Array.isArray(r));
}

/**
 * Sum of `earned` ledger entries per currency. Returns `null` when the entries may be incomplete
 * (truncated read) so the UI never shows a partial total as if it were final.
 */
export function summarizeLedgerEarned(
  entries: ReadonlyArray<Pick<SellerProfileLedgerEntry, "entryType" | "amount" | "currency">>,
  truncated: boolean,
): Record<string, number> | null {
  if (truncated) return null;
  const out: Record<string, number> = {};
  for (const e of entries) {
    if (e.entryType !== "earned" || e.amount === null || !e.currency) continue;
    out[e.currency] = Math.round(((out[e.currency] ?? 0) + e.amount) * 100) / 100;
  }
  return out;
}

/** Parses `{ found, profile }` from the partner-scoped profile API. `null` when absent / malformed. */
export function parseSellerProfileData(payload: unknown): SellerProfileData | null {
  const root = rec(payload);
  if (!root.profile || typeof root.profile !== "object" || Array.isArray(root.profile)) return null;
  const p = rec(root.profile);
  const totals = rec(p.totals);

  const links = list(p.links);
  const sales = list(p.sales);
  const settlements = list(p.settlements);
  const audit = list(p.audit);
  const ledgerRaw = p.ledger && typeof p.ledger === "object" && !Array.isArray(p.ledger) ? rec(p.ledger) : null;
  const ledgerEntries = ledgerRaw ? list(ledgerRaw.entries) : null;
  const earnedRaw = ledgerRaw?.earnedByCurrency;

  let earnedByCurrency: Record<string, number> | null = null;
  if (earnedRaw && typeof earnedRaw === "object" && !Array.isArray(earnedRaw)) {
    earnedByCurrency = {};
    for (const [currency, value] of Object.entries(earnedRaw as Record<string, unknown>)) {
      const n = num(value);
      if (n !== null) earnedByCurrency[currency] = n;
    }
  }

  return {
    totals: {
      clicks: nonNegative(totals.clicks),
      registrations: nonNegative(totals.registrations),
      qualifiedSales: nonNegative(totals.qualifiedSales),
      openSettlements: nonNegative(totals.openSettlements),
    },
    links: links
      ? links.flatMap((r) => {
          const id = str(r.id);
          const code = str(r.code);
          if (!id || !code) return [];
          return [
            {
              id,
              code,
              channelOrigin: str(r.channelOrigin),
              active: r.active === true,
              createdAt: str(r.createdAt),
              clicks: nonNegative(r.clicks) ?? 0,
              registrations: nonNegative(r.registrations) ?? 0,
            },
          ];
        })
      : null,
    sales: sales
      ? sales.flatMap((r) => {
          const id = str(r.id);
          if (!id) return [];
          return [
            {
              id,
              productKey: str(r.productKey),
              status: str(r.status),
              attributedAt: str(r.attributedAt),
              amount: num(r.amount),
              currency: str(r.currency),
              paidPeriodsCount: nonNegative(r.paidPeriodsCount),
            },
          ];
        })
      : null,
    settlements: settlements
      ? settlements.flatMap((r) => {
          const id = str(r.id);
          if (!id) return [];
          return [
            {
              id,
              periodMonth: str(r.periodMonth),
              status: str(r.status) ?? "unknown",
              totalAmount: num(r.totalAmount),
              currency: str(r.currency),
              createdAt: str(r.createdAt),
            },
          ];
        })
      : null,
    ledger: ledgerEntries
      ? {
          entries: ledgerEntries.flatMap((r) => {
            const id = str(r.id);
            const entryType = str(r.entryType);
            if (!id || !entryType) return [];
            return [{ id, entryType, amount: num(r.amount), currency: str(r.currency), createdAt: str(r.createdAt) }];
          }),
          earnedByCurrency,
        }
      : null,
    audit: audit
      ? audit.flatMap((r) => {
          const id = str(r.id);
          const action = str(r.action);
          if (!id || !action) return [];
          return [{ id, action, actorKind: str(r.actorKind), createdAt: str(r.createdAt) }];
        })
      : null,
  };
}

/** Number of active (passed) certifications; `null` when the certification list is unknown. */
export function countActiveCertifications(
  certifications: ReadonlyArray<{ status: string }> | null | undefined,
): number | null {
  if (!certifications) return null;
  return certifications.filter((c) => c.status === "passed").length;
}

/** Six header KPIs. Anything the profile data did not report is `null` — never defaulted to 0. */
export function buildSellerProfileKpis(
  data: SellerProfileData | null,
  certifications: ReadonlyArray<{ status: string }> | null | undefined,
): SellerProfileKpis {
  return {
    clicks: data?.totals.clicks ?? null,
    registrations: data?.totals.registrations ?? null,
    sales: data?.totals.qualifiedSales ?? null,
    commissionsEarnedByCurrency: data?.ledger?.earnedByCurrency ?? null,
    certifications: countActiveCertifications(certifications),
    openSettlements: data?.totals.openSettlements ?? null,
  };
}

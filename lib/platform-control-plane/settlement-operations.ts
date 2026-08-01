import { buildFreshness, type PlatformDataFreshness } from "./freshness";

export type PartnerSettlementOperationRow = {
  id: string;
  partnerOrgId: string;
  partnerName: string;
  settlementPeriod: string;
  periodFrom: string | null;
  periodTo: string | null;
  commissionBasis: number | null;
  qualifiedAmount: number | null;
  earnedAmount: number | null;
  approvedAmount: number | null;
  totalPayable: number | null;
  vatAmount: number | null;
  currency: string;
  settlementStatus: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceStatus: string | null;
  invoiceTotal: number | null;
  matchingStatus: string;
  dueDate: string | null;
  owner: string;
  lastUpdated: string | null;
  nextAction: string;
  readOnly: true;
};

export type PartnerSettlementDiscrepancy = {
  id: string;
  severity: string;
  partnerName: string;
  partnerOrgId: string;
  invoiceNumber: string;
  settlementId: string;
  expected: number | null;
  actual: number | null;
  difference: number | null;
  reason: string;
  owner: string;
  dueDate: string | null;
  status: string;
  nextAction: string;
  auditHref: string;
};

export type PartnerSettlementOperationsBundle = {
  generatedAt: string;
  freshness: PlatformDataFreshness;
  availability: "ready" | "partial" | "unavailable" | "error";
  settlements: PartnerSettlementOperationRow[];
  discrepancies: PartnerSettlementDiscrepancy[];
  sourceNote: string;
  mutationsAllowed: false;
};

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asIso(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

export function parsePartnerSettlementOperations(raw: unknown): PartnerSettlementOperationsBundle {
  const root = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const generatedAt = asIso(root.generated_at ?? root.generatedAt) ?? new Date(0).toISOString();
  const availabilityRaw = asString(root.availability || "partial");
  const availability =
    availabilityRaw === "ready" ||
    availabilityRaw === "partial" ||
    availabilityRaw === "unavailable" ||
    availabilityRaw === "error"
      ? availabilityRaw
      : "partial";

  const settlementsRaw = Array.isArray(root.settlements) ? root.settlements : [];
  const discrepanciesRaw = Array.isArray(root.discrepancies) ? root.discrepancies : [];

  const settlements: PartnerSettlementOperationRow[] = settlementsRaw.map((row) => {
    const r = (row && typeof row === "object" ? row : {}) as Record<string, unknown>;
    return {
      id: asString(r.id),
      partnerOrgId: asString(r.partner_org_id ?? r.partnerOrgId),
      partnerName: asString(r.partner_name ?? r.partnerName) || "Partner",
      settlementPeriod: asString(r.settlement_period ?? r.settlementPeriod),
      periodFrom: asString(r.period_from ?? r.periodFrom) || null,
      periodTo: asString(r.period_to ?? r.periodTo) || null,
      commissionBasis: asNumber(r.commission_basis ?? r.commissionBasis),
      qualifiedAmount: asNumber(r.qualified_amount ?? r.qualifiedAmount),
      earnedAmount: asNumber(r.earned_amount ?? r.earnedAmount),
      approvedAmount: asNumber(r.approved_amount ?? r.approvedAmount),
      totalPayable: asNumber(r.total_payable ?? r.totalPayable),
      vatAmount: asNumber(r.vat_amount ?? r.vatAmount),
      currency: asString(r.currency) || "NOK",
      settlementStatus: asString(r.settlement_status ?? r.settlementStatus) || "unknown",
      invoiceId: asString(r.invoice_id ?? r.invoiceId) || null,
      invoiceNumber: asString(r.invoice_number ?? r.invoiceNumber) || null,
      invoiceStatus: asString(r.invoice_status ?? r.invoiceStatus) || null,
      invoiceTotal: asNumber(r.invoice_total ?? r.invoiceTotal),
      matchingStatus: asString(r.matching_status ?? r.matchingStatus) || "unknown",
      dueDate: asString(r.due_date ?? r.dueDate) || null,
      owner: asString(r.owner) || "platform_finance",
      lastUpdated: asIso(r.last_updated ?? r.lastUpdated),
      nextAction: asString(r.next_action ?? r.nextAction) || "monitor",
      readOnly: true,
    };
  });

  const discrepancies: PartnerSettlementDiscrepancy[] = discrepanciesRaw.map((row) => {
    const r = (row && typeof row === "object" ? row : {}) as Record<string, unknown>;
    return {
      id: asString(r.id),
      severity: asString(r.severity) || "info",
      partnerName: asString(r.partner_name ?? r.partnerName),
      partnerOrgId: asString(r.partner_org_id ?? r.partnerOrgId),
      invoiceNumber: asString(r.invoice_number ?? r.invoiceNumber),
      settlementId: asString(r.settlement_id ?? r.settlementId),
      expected: asNumber(r.expected),
      actual: asNumber(r.actual),
      difference: asNumber(r.difference),
      reason: asString(r.reason) || "unknown",
      owner: asString(r.owner) || "platform_finance",
      dueDate: asString(r.due_date ?? r.dueDate) || null,
      status: asString(r.status) || "unknown",
      nextAction: asString(r.next_action ?? r.nextAction) || "review_partner_settlement",
      auditHref: asString(r.audit_href ?? r.auditHref) || "/platform/partners/settlement",
    };
  });

  return {
    generatedAt,
    freshness: buildFreshness({
      source: asString(root.source) || "get_platform_partner_settlement_operations",
      fetchedAt: generatedAt,
      calculatedAt: generatedAt,
      availability,
      partial: availability !== "ready",
    }),
    availability,
    settlements,
    discrepancies,
    sourceNote: asString(root.source_note ?? root.sourceNote) || "partial",
    mutationsAllowed: false,
  };
}

export function formatSettlementMoney(
  amount: number | null,
  currency: string,
  locale: string,
  emptyLabel: string,
): string {
  if (amount === null || !Number.isFinite(amount)) return emptyLabel;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency === "MIXED" ? "NOK" : currency || "NOK",
      currencyDisplay: "code",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

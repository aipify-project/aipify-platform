/**
 * Commission statement preview. This is not an issued document.
 * Core has no statement number, tax treatment, or recipient legal record
 * on csp_monthly_settlements, so issuance stays closed.
 */
import { COMPANY_CONFIG } from "@/lib/company/company.config";

export const STATEMENT_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;

export type StatementLocale = (typeof STATEMENT_LOCALES)[number];

/** Authoritative document titles. Product and company names are not translated. */
export const STATEMENT_TITLES: Record<StatementLocale, string> = {
  en: "Commission statement",
  no: "Provisjonsoppgjør",
  sv: "Provisionsavräkning",
  da: "Provisionsafregning",
  pl: "Rozliczenie prowizji",
  uk: "Розрахунок комісійних",
  es: "Liquidación de comisiones",
};

export type SettlementDocumentSource = {
  settlementId: string;
  periodMonth: string | null;
  status: string | null;
  totalAmount: number | null;
  currency: string | null;
  lineCount: number | null;
  partnerReference: string | null;
  paidAt?: string | null;
  paymentReference?: string | null;
};

export type SettlementDocumentModel = {
  documentType: "commission_statement";
  locale: StatementLocale;
  title: string;
  issued: false;
  documentNumber: null;
  issuance: "core_activation_required";
  taxTreatment: "verification_required";
  vatAmount: null;
  previewOnly: true;
  settlementId: string;
  periodMonth: string | null;
  status: string | null;
  totalAmount: number | null;
  currency: string | null;
  lineCount: number | null;
  partnerReference: string | null;
  issuer: {
    legalName: string;
    organizationNumberDisplay: string;
    headquarters: string;
    country: string;
    website: string;
  };
  recipientLegal: "not_on_record";
  payment: { paidAt: string; paymentReference: string } | null;
};

const PERIOD = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

export function statementLocale(locale: string | null | undefined): StatementLocale {
  const code = (locale ?? "en").toLowerCase();
  return (STATEMENT_LOCALES as readonly string[]).includes(code) ? (code as StatementLocale) : "en";
}

export function statementTitle(locale: string | null | undefined): string {
  return STATEMENT_TITLES[statementLocale(locale)];
}

function clean(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Payment metadata is shown only when Core already stored both the time and
 * the reference and the settlement is paid. A preview never invents them.
 */
export function confirmedPayment(source: SettlementDocumentSource): { paidAt: string; paymentReference: string } | null {
  if (source.status !== "paid") return null;
  const paidAt = clean(source.paidAt);
  const paymentReference = clean(source.paymentReference);
  if (!paidAt || !paymentReference) return null;
  if (Number.isNaN(new Date(paidAt).getTime())) return null;
  return { paidAt, paymentReference };
}

export function buildSettlementDocument(
  source: SettlementDocumentSource,
  locale: string | null | undefined,
): SettlementDocumentModel {
  const currency = clean(source.currency)?.toUpperCase() ?? null;
  const period = clean(source.periodMonth);
  return {
    documentType: "commission_statement",
    locale: statementLocale(locale),
    title: statementTitle(locale),
    issued: false,
    documentNumber: null,
    issuance: "core_activation_required",
    taxTreatment: "verification_required",
    vatAmount: null,
    previewOnly: true,
    settlementId: source.settlementId,
    periodMonth: period && PERIOD.test(period) ? period : period,
    status: clean(source.status),
    totalAmount: typeof source.totalAmount === "number" && Number.isFinite(source.totalAmount) ? source.totalAmount : null,
    currency: currency && /^[A-Z]{3}$/.test(currency) ? currency : null,
    lineCount: typeof source.lineCount === "number" && Number.isInteger(source.lineCount) ? source.lineCount : null,
    partnerReference: clean(source.partnerReference),
    issuer: {
      legalName: COMPANY_CONFIG.legalCompanyName,
      organizationNumberDisplay: COMPANY_CONFIG.organizationNumberDisplay,
      headquarters: COMPANY_CONFIG.headquartersAddress,
      country: COMPANY_CONFIG.country,
      website: COMPANY_CONFIG.website,
    },
    recipientLegal: "not_on_record",
    payment: confirmedPayment(source),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** Finds one settlement inside the existing list RPC payload. Never trusts a client-supplied amount. */
export function readSettlementSource(payload: unknown, settlementId: string): SettlementDocumentSource | null {
  const root = asRecord(payload);
  const list = Array.isArray(payload) ? payload : Array.isArray(root.settlements) ? root.settlements : [];
  for (const item of list) {
    const row = asRecord(item);
    if (row.id !== settlementId) continue;
    const amount = row.total_amount;
    const lines = row.line_count;
    return {
      settlementId,
      periodMonth: typeof row.period_month === "string" ? row.period_month : null,
      status: typeof row.status === "string" ? row.status : null,
      totalAmount: typeof amount === "number" ? amount : typeof amount === "string" && amount.trim() ? Number(amount) : null,
      currency: typeof row.currency === "string" ? row.currency : null,
      lineCount: typeof lines === "number" ? lines : typeof lines === "string" && lines.trim() ? Number(lines) : null,
      partnerReference: typeof row.partner_id === "string" ? row.partner_id : null,
      paidAt: typeof row.paid_at === "string" ? row.paid_at : null,
      paymentReference: typeof row.payment_reference === "string" ? row.payment_reference : null,
    };
  }
  return null;
}

/** Lines the preview PDF draws. No document number and no tax amount. */
export function settlementPreviewLines(model: SettlementDocumentModel): string[] {
  const lines = [
    model.title,
    "PREVIEW",
    model.issuer.legalName,
    model.issuer.organizationNumberDisplay,
    model.issuer.headquarters,
    model.issuer.country,
    model.periodMonth ?? "",
    model.currency ?? "",
    model.totalAmount === null ? "" : String(model.totalAmount),
    model.status ?? "",
  ];
  if (model.payment) {
    lines.push(model.payment.paidAt, model.payment.paymentReference);
  }
  return lines;
}

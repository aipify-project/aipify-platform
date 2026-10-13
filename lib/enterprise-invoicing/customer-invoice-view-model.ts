/**
 * Customer-facing invoice presentation — derived only from EnterpriseInvoice fields.
 * Never invents payment URLs, PDF originals, or billing periods.
 */

import type { InvoiceStatus } from "./constants";
import type { EnterpriseInvoice } from "./types";

export type CustomerInvoiceBucket =
  | "overdue"
  | "awaiting_payment"
  | "paid"
  | "other";

export type CustomerInvoiceTone = "positive" | "warning" | "critical" | "neutral";

export type CustomerInvoiceListItem = {
  invoice: EnterpriseInvoice;
  bucket: CustomerInvoiceBucket;
  tone: CustomerInvoiceTone;
  /** Primary unpaid invoice that is due soonest (or overdue). */
  isNextDue: boolean;
  /** Show red Pay CTA only when a verified payment URL exists (none today). */
  canPayOnline: boolean;
  paymentUrl: string | null;
  /** Original legal PDF from issuer — not available via current APP API. */
  hasOriginalPdf: boolean;
  /** Bank transfer hints from authoritative invoice fields only. */
  paymentHints: {
    kid: string | null;
    bankReference: string | null;
    billingMethod: string | null;
  };
};

export type CustomerInvoiceWorkspaceModel = {
  nextDue: CustomerInvoiceListItem | null;
  overdue: CustomerInvoiceListItem[];
  awaitingPayment: CustomerInvoiceListItem[];
  paid: CustomerInvoiceListItem[];
  other: CustomerInvoiceListItem[];
  overdueCount: number;
  hasAnyInvoices: boolean;
};

const PAID_STATUSES = new Set<InvoiceStatus>(["paid", "credited"]);
const CLOSED_OTHER = new Set<InvoiceStatus>(["cancelled", "draft", "disputed"]);

export function classifyCustomerInvoiceBucket(invoice: EnterpriseInvoice): CustomerInvoiceBucket {
  if (PAID_STATUSES.has(invoice.status)) return "paid";
  if (CLOSED_OTHER.has(invoice.status)) return "other";
  if (invoice.is_overdue || invoice.status === "overdue" || invoice.status === "reminder_sent") {
    return "overdue";
  }
  if (
    invoice.status === "sent" ||
    invoice.status === "viewed" ||
    invoice.status === "approved" ||
    invoice.status === "partially_paid"
  ) {
    return "awaiting_payment";
  }
  return "other";
}

export function toneForBucket(bucket: CustomerInvoiceBucket, invoice: EnterpriseInvoice): CustomerInvoiceTone {
  if (bucket === "paid") return "positive";
  if (bucket === "overdue") return "critical";
  if (bucket === "awaiting_payment") {
    // Not yet due → warning (action may still be needed), never paint as critical solely for unpaid.
    return invoice.is_overdue ? "critical" : "warning";
  }
  return "neutral";
}

/**
 * Payment URL gate — EnterpriseInvoice currently has no hosted checkout / payment_url field.
 * Keep this single gate so a future verified field can unlock Pay without UI invention.
 */
export function resolveVerifiedPaymentUrl(invoice: EnterpriseInvoice): string | null {
  const extended = invoice as EnterpriseInvoice & {
    payment_url?: unknown;
    hosted_invoice_url?: unknown;
    checkout_url?: unknown;
  };
  for (const key of ["payment_url", "hosted_invoice_url", "checkout_url"] as const) {
    const value = extended[key];
    if (typeof value === "string" && /^https:\/\//i.test(value.trim())) {
      return value.trim();
    }
  }
  return null;
}

function dueSortKey(invoice: EnterpriseInvoice): number {
  if (invoice.due_date) {
    const t = Date.parse(invoice.due_date);
    if (!Number.isNaN(t)) return t;
  }
  const created = Date.parse(invoice.created_at);
  return Number.isNaN(created) ? Number.MAX_SAFE_INTEGER : created;
}

function paidSortKey(invoice: EnterpriseInvoice): number {
  if (invoice.paid_at) {
    const t = Date.parse(invoice.paid_at);
    if (!Number.isNaN(t)) return -t;
  }
  return -dueSortKey(invoice);
}

function toListItem(
  invoice: EnterpriseInvoice,
  options: { isNextDue: boolean }
): CustomerInvoiceListItem {
  const bucket = classifyCustomerInvoiceBucket(invoice);
  const paymentUrl = resolveVerifiedPaymentUrl(invoice);
  return {
    invoice,
    bucket,
    tone: toneForBucket(bucket, invoice),
    isNextDue: options.isNextDue,
    canPayOnline: Boolean(paymentUrl) && (bucket === "overdue" || bucket === "awaiting_payment"),
    paymentUrl,
    hasOriginalPdf: false,
    paymentHints: {
      kid: invoice.dnb_kid?.trim() ? invoice.dnb_kid.trim() : null,
      bankReference: invoice.bank_reference?.trim() ? invoice.bank_reference.trim() : null,
      billingMethod: invoice.billing_method?.trim() ? invoice.billing_method.trim() : null,
    },
  };
}

/**
 * Build customer invoice workspace from tenant center invoices.
 */
export function buildCustomerInvoiceWorkspace(
  invoices: EnterpriseInvoice[]
): CustomerInvoiceWorkspaceModel {
  const overdueRaw: EnterpriseInvoice[] = [];
  const awaitingRaw: EnterpriseInvoice[] = [];
  const paidRaw: EnterpriseInvoice[] = [];
  const otherRaw: EnterpriseInvoice[] = [];

  for (const invoice of invoices) {
    const bucket = classifyCustomerInvoiceBucket(invoice);
    if (bucket === "overdue") overdueRaw.push(invoice);
    else if (bucket === "awaiting_payment") awaitingRaw.push(invoice);
    else if (bucket === "paid") paidRaw.push(invoice);
    else otherRaw.push(invoice);
  }

  overdueRaw.sort((a, b) => dueSortKey(a) - dueSortKey(b));
  awaitingRaw.sort((a, b) => dueSortKey(a) - dueSortKey(b));
  paidRaw.sort((a, b) => paidSortKey(a) - paidSortKey(b));
  otherRaw.sort((a, b) => dueSortKey(a) - dueSortKey(b));

  const nextSource = overdueRaw[0] ?? awaitingRaw[0] ?? null;
  const nextDueId = nextSource?.id ?? null;

  const mapList = (list: EnterpriseInvoice[]) =>
    list.map((invoice) => toListItem(invoice, { isNextDue: invoice.id === nextDueId }));

  return {
    nextDue: nextSource ? toListItem(nextSource, { isNextDue: true }) : null,
    overdue: mapList(overdueRaw),
    awaitingPayment: mapList(awaitingRaw),
    paid: mapList(paidRaw),
    other: mapList(otherRaw),
    overdueCount: overdueRaw.length,
    hasAnyInvoices: invoices.length > 0,
  };
}

export function formatInvoiceMoney(
  amount: number,
  currency: string,
  locale: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "NOK",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatInvoiceDate(value: string | null, locale: string): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(parsed));
  } catch {
    return value;
  }
}

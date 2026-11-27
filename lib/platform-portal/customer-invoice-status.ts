/**
 * Customer 360 invoice status from Platform Economy `public.invoices`
 * (`get_platform_customer_detail` / `list_platform_invoices`).
 *
 * This ledger has no partial-payment column and no "settled without payment" status.
 * Zero-amount policy:
 * - status `paid` stays paid, including 0. The amount is shown as 0. No payment event is created.
 * - status open (`sent` or stored `overdue`) with amount 0 is `zero_open`: not overdue and not paid.
 * - Overdue requires outstanding > 0 AND the due date is before today's calendar date
 *   in the authoritative timezone. Unpaid invoices that are not yet due stay open.
 * - Cancelled, failed, draft, and credited rows are neither overdue nor paid.
 * - A missing amount, currency, or incomplete list is unavailable — never a false 0.
 * Amounts are never added across currencies.
 */

import { COMPANY_CONFIG } from "@/lib/company/company.config";

export type InvoiceReadState = "ready" | "unavailable";

export type InvoicePresentationStatus =
  | "draft"
  | "open"
  | "paid"
  | "overdue"
  | "cancelled"
  | "failed"
  | "credited"
  | "zero_open"
  | "other";

export type PlatformInvoiceInput = {
  id?: string | null;
  invoiceNumber?: string | null;
  status?: string | null;
  amount?: number | string | null;
  amountPaid?: number | string | null;
  currency?: string | null;
  dueDate?: string | null;
  issuedAt?: string | null;
  paidAt?: string | null;
};

export type CurrencyAmount = {
  currency: string;
  amount: number;
};

export type CustomerInvoiceLatest = {
  id: string | null;
  invoiceNumber: string | null;
  issuedAt: string | null;
  dueDate: string | null;
  currency: string;
  amount: number;
  presentation: InvoicePresentationStatus;
};

export type CustomerInvoiceSummary = {
  readState: InvoiceReadState;
  overdueCount: number;
  paidCount: number;
  overdueAmounts: CurrencyAmount[];
  /** Sum of invoice amounts whose authoritative status is paid. Includes 0. */
  paidAmounts: CurrencyAmount[];
  paidMeasure: "summed_paid_amount";
  latest: CustomerInvoiceLatest | null;
  /** Authoritative subscription.next_billing_date only. Never derived. */
  nextBillingDate: string | null;
};

const OPEN_STATUSES = new Set([
  "sent",
  "overdue",
  "viewed",
  "approved",
  "reminder_sent",
  "partially_paid",
]);

function asMoney(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asCurrency(value: string | null | undefined): string | null {
  const code = (value ?? "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : null;
}

export function calendarDateInTimeZone(now: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch {
    /* fall through */
  }
  return now.toISOString().slice(0, 10);
}

function dueDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1]! : null;
}

export function classifyPlatformInvoice(
  invoice: PlatformInvoiceInput,
  today: string,
): { ok: true; presentation: InvoicePresentationStatus; outstanding: number; currency: string } | { ok: false } {
  const status = (invoice.status ?? "").trim().toLowerCase();
  const amount = asMoney(invoice.amount);
  const currency = asCurrency(invoice.currency);
  if (amount === null || currency === null || !status) return { ok: false };
  if (amount < 0 && status !== "credited" && status !== "credit_note") return { ok: false };

  if (status === "paid") {
    return { ok: true, presentation: "paid", outstanding: 0, currency };
  }
  if (status === "credited" || status === "credit_note") {
    return { ok: true, presentation: "credited", outstanding: 0, currency };
  }
  if (status === "cancelled") {
    return { ok: true, presentation: "cancelled", outstanding: 0, currency };
  }
  if (status === "failed") {
    return { ok: true, presentation: "failed", outstanding: 0, currency };
  }
  if (status === "draft") {
    return { ok: true, presentation: "draft", outstanding: 0, currency };
  }

  const amountPaid = asMoney(invoice.amountPaid) ?? 0;
  if (status === "partially_paid" && invoice.amountPaid == null) return { ok: false };
  const outstanding = Math.round((amount - amountPaid) * 100) / 100;
  if (outstanding < 0) return { ok: false };

  if (outstanding === 0) {
    return { ok: true, presentation: "zero_open", outstanding: 0, currency };
  }

  if (!OPEN_STATUSES.has(status)) return { ok: false };

  const due = dueDateOnly(invoice.dueDate);
  if (!due) return { ok: false };
  const pastDue = due < today;
  return {
    ok: true,
    presentation: pastDue ? "overdue" : "open",
    outstanding,
    currency,
  };
}

function addAmount(bucket: Map<string, number>, currency: string, amount: number) {
  bucket.set(currency, Math.round(((bucket.get(currency) ?? 0) + amount) * 100) / 100);
}

function toList(bucket: Map<string, number>): CurrencyAmount[] {
  return [...bucket.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([currency, amount]) => ({ currency, amount }));
}

function issuedStamp(invoice: PlatformInvoiceInput): number {
  const raw = invoice.issuedAt ?? invoice.dueDate ?? "";
  const time = Date.parse(raw);
  return Number.isNaN(time) ? 0 : time;
}

export function summarizePlatformInvoices(input: {
  invoices: PlatformInvoiceInput[] | null | undefined;
  complete: boolean;
  today: string;
  nextBillingDate?: string | null;
}): CustomerInvoiceSummary {
  const nextBillingDate = dueDateOnly(input.nextBillingDate);
  const empty = (): CustomerInvoiceSummary => ({
    readState: "unavailable",
    overdueCount: 0,
    paidCount: 0,
    overdueAmounts: [],
    paidAmounts: [],
    paidMeasure: "summed_paid_amount",
    latest: null,
    nextBillingDate: null,
  });

  if (!input.complete || !Array.isArray(input.invoices)) return empty();

  const overdueAmounts = new Map<string, number>();
  const paidAmounts = new Map<string, number>();
  let overdueCount = 0;
  let paidCount = 0;
  let latest: { invoice: PlatformInvoiceInput; presentation: InvoicePresentationStatus; amount: number; currency: string; stamp: number } | null =
    null;

  for (const invoice of input.invoices) {
    const classified = classifyPlatformInvoice(invoice, input.today);
    if (!classified.ok) return empty();
    const amount = asMoney(invoice.amount);
    if (amount === null) return empty();

    if (classified.presentation === "overdue") {
      overdueCount += 1;
      addAmount(overdueAmounts, classified.currency, classified.outstanding);
    }
    if (classified.presentation === "paid") {
      paidCount += 1;
      addAmount(paidAmounts, classified.currency, amount);
    }

    const stamp = issuedStamp(invoice);
    const candidateIsDraft = classified.presentation === "draft";
    if (!candidateIsDraft && (!latest || stamp >= latest.stamp)) {
      latest = {
        invoice,
        presentation: classified.presentation,
        amount,
        currency: classified.currency,
        stamp,
      };
    }
  }

  return {
    readState: "ready",
    overdueCount,
    paidCount,
    overdueAmounts: toList(overdueAmounts),
    paidAmounts: toList(paidAmounts),
    paidMeasure: "summed_paid_amount",
    latest: latest
      ? {
          id: latest.invoice.id ?? null,
          invoiceNumber: latest.invoice.invoiceNumber?.trim() || null,
          issuedAt: latest.invoice.issuedAt ?? null,
          dueDate: dueDateOnly(latest.invoice.dueDate),
          currency: latest.currency,
          amount: latest.amount,
          presentation: latest.presentation,
        }
      : null,
    nextBillingDate,
  };
}

/**
 * Contract fixture only. Not persisted, not emailed, not a payment, not an issued invoice.
 * Recipient is a placeholder. Production issuance stays behind an owner gate.
 */
export function buildZeroAmountInvoicePreview() {
  return {
    source: "contract_fixture" as const,
    issued: false as const,
    persisted: false as const,
    emailed: false as const,
    booked: false as const,
    paymentEvent: false as const,
    seller: {
      legalName: COMPANY_CONFIG.legalCompanyName,
      organizationNumber: COMPANY_CONFIG.organizationNumberDisplay,
      address: COMPANY_CONFIG.headquartersAddress,
      country: COMPANY_CONFIG.country,
    },
    recipientPlaceholder: "ORGANIZATION",
    line: {
      description: "Aipify APP – Ubegrenset",
      quantity: 1,
      unitAmount: 0,
      currency: "NOK",
    },
    netAmount: 0,
    vatAmount: 0,
    vatTreatment: "zero_amount_no_taxable_supply_recorded_in_this_fixture",
    totalAmount: 0,
    statusWhenLedgerSaysPaid: "paid" as const,
    statusWhenStillOpen: "zero_open" as const,
  };
}

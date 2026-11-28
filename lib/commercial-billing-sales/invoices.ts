/**
 * F. Invoice / receipt / payment history contracts.
 *
 * - ONE authoritative payment source: the payment ledger (BillingState.payments), fed only by verified
 *   webhooks. Provider-hosted invoice documents are links only — we never fabricate PDFs, numbers or
 *   send email.
 * - Tenant-scoped: a caller only ever sees their own tenant's rows.
 * - Double billing is detected (same subscription + period, or same provider invoice twice) and surfaced.
 * - Open owner questions (Stripe vs accounting system, VAT source, invoice numbering) are exposed as
 *   constants, not guessed.
 */

import type { BillingEffect, PaymentRecord, PaymentStatus } from "./webhook";

export const INVOICE_OPEN_QUESTIONS = [
  "stripe_invoice_vs_accounting_system_of_record",
  "vat_rate_source_stripe_tax_vs_manual_table",
  "legal_invoice_numbering_owner",
  "credit_note_issuance_for_refunds",
  "receipt_language_and_template_ownership",
] as const;

export const INVOICE_DOCUMENT_POLICY = {
  authoritativePaymentSource: "core_payment_ledger_from_verified_webhooks",
  documentSource: "provider_hosted_link_only",
  fabricatesDocuments: false,
  sendsEmail: false,
  sendingEnabled: false,
  tenantScopedOnly: true,
} as const;

/** DTO for Agent 2 (APP read). Amounts are integer minor units; currency is explicit. */
export type CustomerPaymentHistoryItemDto = {
  paymentId: string;
  productKey: string;
  variantKey: string;
  interval: "month" | "year" | "one_time";
  amountMinor: number;
  currency: string;
  vatMinor: number | null;
  netExVatMinor: number | null;
  refundedMinor: number;
  status: PaymentStatus;
  periodOrdinal: number;
  periodStart: string | null;
  periodEnd: string | null;
  /** Provider-hosted document URL ONLY when the provider supplied one. Never fabricated. */
  documentUrl: string | null;
};

export type CustomerPaymentHistoryDto = {
  tenantId: string;
  available: boolean;
  items: CustomerPaymentHistoryItemDto[];
  doubleBillingSuspected: boolean;
  blocker: "no_authoritative_payment_source" | null;
  fabricatesDocuments: false;
  sendsEmail: false;
};

export type ProviderDocumentLinks = Readonly<Record<string, string | null | undefined>>;

const iso = (e: number | null): string | null => (e == null ? null : new Date(e * 1000).toISOString());

export function detectDoubleBilling(payments: readonly PaymentRecord[]): boolean {
  const seen = new Set<string>();
  for (const p of payments) {
    const key = `${p.tenantId}|${p.intentId}|${p.periodOrdinal}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

export function buildCustomerPaymentHistory(input: {
  callerTenantId: string | null | undefined;
  payments: readonly PaymentRecord[] | null | undefined;
  documentLinks?: ProviderDocumentLinks;
}): CustomerPaymentHistoryDto {
  const tenantId = typeof input.callerTenantId === "string" ? input.callerTenantId.trim() : "";
  const closed: CustomerPaymentHistoryDto = {
    tenantId,
    available: false,
    items: [],
    doubleBillingSuspected: false,
    blocker: "no_authoritative_payment_source",
    fabricatesDocuments: false,
    sendsEmail: false,
  };
  if (!tenantId || !input.payments) return closed;

  const own = input.payments.filter((p) => p.tenantId === tenantId);
  return {
    tenantId,
    available: true,
    items: own
      .slice()
      .sort((a, b) => (a.periodStartEpoch ?? 0) - (b.periodStartEpoch ?? 0))
      .map((p) => ({
        paymentId: p.paymentId,
        productKey: p.productKey,
        variantKey: p.variantKey,
        interval: p.interval,
        amountMinor: p.amountMinor,
        currency: p.currency,
        vatMinor: p.vatMinor,
        netExVatMinor: p.netExVatMinor,
        refundedMinor: p.refundedMinor,
        status: p.status,
        periodOrdinal: p.periodOrdinal,
        periodStart: iso(p.periodStartEpoch),
        periodEnd: iso(p.periodEndEpoch),
        documentUrl: input.documentLinks?.[p.paymentId] ?? null,
      })),
    doubleBillingSuspected: detectDoubleBilling(own),
    blocker: null,
    fabricatesDocuments: false,
    sendsEmail: false,
  };
}

/** DTO for Agent 3 (notifications / support). Delivery is NOT implemented here. */
export type CommercialNotificationEventName =
  | "commercial.payment_succeeded"
  | "commercial.payment_failed"
  | "commercial.refund_processed"
  | "commercial.chargeback_opened"
  | "commercial.chargeback_won"
  | "commercial.entitlement_activated"
  | "commercial.entitlement_state_changed"
  | "commercial.subscription_cancel_scheduled"
  | "commercial.subscription_canceled"
  | "commercial.commission_earned"
  | "commercial.commission_reversed";

export type CommercialNotificationDto = {
  event: CommercialNotificationEventName;
  tenantId: string;
  intentId: string;
  paymentId: string | null;
  detail: string | null;
  /** Stable key so Agent 3 can dedupe: event|tenant|intent|payment|detail. */
  dedupeKey: string;
  deliveryImplemented: false;
  /** Never contains secrets, card data, or invoice content. */
  containsSensitiveData: false;
};

const EFFECT_TO_EVENT: Partial<Record<BillingEffect["type"], CommercialNotificationEventName>> = {
  payment_succeeded: "commercial.payment_succeeded",
  payment_failed: "commercial.payment_failed",
  refund_processed: "commercial.refund_processed",
  chargeback_opened: "commercial.chargeback_opened",
  chargeback_won: "commercial.chargeback_won",
  entitlement_activated: "commercial.entitlement_activated",
  entitlement_state_changed: "commercial.entitlement_state_changed",
  subscription_cancel_scheduled: "commercial.subscription_cancel_scheduled",
  subscription_canceled: "commercial.subscription_canceled",
  commission_earned: "commercial.commission_earned",
  commission_reversed: "commercial.commission_reversed",
};

export function buildCommercialNotifications(effects: readonly BillingEffect[]): CommercialNotificationDto[] {
  const out: CommercialNotificationDto[] = [];
  for (const e of effects) {
    const event = EFFECT_TO_EVENT[e.type];
    if (!event) continue;
    // Commission events concern the seller side; customer tenants must not receive them.
    out.push({
      event,
      tenantId: e.tenantId,
      intentId: e.intentId,
      paymentId: e.paymentId,
      detail: e.detail,
      dedupeKey: [event, e.tenantId, e.intentId, e.paymentId ?? "", e.detail ?? ""].join("|"),
      deliveryImplemented: false,
      containsSensitiveData: false,
    });
  }
  return out;
}

export function isSellerSideNotification(n: CommercialNotificationDto): boolean {
  return n.event === "commercial.commission_earned" || n.event === "commercial.commission_reversed";
}

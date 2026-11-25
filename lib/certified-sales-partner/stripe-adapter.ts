/**
 * CSP ↔ Stripe adapter — PURE MAPPER ONLY.
 *
 * Documents how an already-VERIFIED Stripe invoice/charge event maps onto
 * `applyVerifiedPaidPeriod()` (payment-periods.ts), which is the single source of
 * truth for the "commission after 2nd successful paid period" rule.
 *
 * Hard boundaries (do not relax without a separate owner payment-consent task):
 *  - NO Stripe SDK import, NO network call, NO live or test charge.
 *  - NO webhook route is wired here. `POST /api/certified-sales-partner/payment-events`
 *    is a secret-guarded internal endpoint; this module does not call it.
 *  - Signature verification is the CALLER's job. This mapper refuses any event that
 *    is not explicitly flagged `signatureVerified === true` (fail-closed).
 *  - Ordinals and duplicate detection come from Aipify's own ledger, never from the
 *    event payload alone, so a replayed or out-of-order event cannot earn commission.
 *
 * Mapping summary:
 *   invoice.paid | invoice.payment_succeeded  (amount_paid > 0)  → successful charge
 *   invoice.payment_failed                                       → failed charge (ignored)
 *   charge.refunded | charge.dispute.created | charge.dispute.funds_withdrawn
 *                                                                → refund/chargeback (review flag only)
 *   anything else                                                → not mapped
 */
import { applyVerifiedPaidPeriod, type CspPaidPeriodState } from "./payment-periods";

/** Wiring of this adapter into a live webhook is intentionally disabled. */
export const CSP_STRIPE_LIVE_WIRING_ENABLED = false as const;

export const CSP_STRIPE_SUCCESS_EVENT_TYPES = ["invoice.paid", "invoice.payment_succeeded"] as const;
export const CSP_STRIPE_FAILURE_EVENT_TYPES = ["invoice.payment_failed"] as const;
export const CSP_STRIPE_REVERSAL_EVENT_TYPES = [
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.funds_withdrawn",
] as const;

export type CspStripeVerifiedEventInput = {
  /** Must be true only after the caller verified the Stripe signature. */
  signatureVerified: boolean;
  eventType: string;
  /** Stripe event id (evt_…); used only as an opaque identity for duplicate checks. */
  eventId: string;
  /** Minor units paid on the invoice (invoice.amount_paid). */
  amountPaid?: number;
  /** Paid periods already recorded in the Aipify ledger for this sale. */
  currentPaidPeriods: number;
  /**
   * 1-based ordinal of the subscription period this event pays, derived from the
   * Aipify ledger (e.g. count of verified paid invoices including this one).
   */
  periodOrdinal: number;
  /** Event ids the Aipify ledger has already processed. */
  processedEventIds?: readonly string[];
  /** Carry over an earlier reversal-review flag so it is never silently cleared. */
  currentNeedsReversalReview?: boolean;
};

export type CspStripeMapResult =
  | { mapped: false; reason: "unverified_event" | "event_id_required" | "event_type_not_mapped" }
  | {
      mapped: true;
      kind: "paid_period" | "failed_charge" | "reversal";
      state: CspPaidPeriodState;
    };

function isIn(list: readonly string[], value: string): boolean {
  return list.includes(value);
}

export function mapVerifiedStripeEventToPaidPeriod(input: CspStripeVerifiedEventInput): CspStripeMapResult {
  if (input?.signatureVerified !== true) return { mapped: false, reason: "unverified_event" };
  const eventId = typeof input.eventId === "string" ? input.eventId.trim() : "";
  if (!eventId) return { mapped: false, reason: "event_id_required" };

  const type = String(input.eventType ?? "");
  const isDuplicate = (input.processedEventIds ?? []).includes(eventId);
  const base = {
    currentPaidPeriods: input.currentPaidPeriods,
    eventPeriodOrdinal: input.periodOrdinal,
    isDuplicate,
    currentNeedsReversalReview: input.currentNeedsReversalReview,
  };

  if (isIn(CSP_STRIPE_SUCCESS_EVENT_TYPES, type)) {
    // A zero-amount invoice (trial, credit-only) is not a successful paid period.
    const paid = typeof input.amountPaid === "number" && Number.isFinite(input.amountPaid) && input.amountPaid > 0;
    return {
      mapped: true,
      kind: "paid_period",
      state: applyVerifiedPaidPeriod({
        ...base,
        isSuccessfulCharge: paid,
        isRefundOrChargeback: false,
      }),
    };
  }

  if (isIn(CSP_STRIPE_FAILURE_EVENT_TYPES, type)) {
    return {
      mapped: true,
      kind: "failed_charge",
      state: applyVerifiedPaidPeriod({
        ...base,
        isSuccessfulCharge: false,
        isRefundOrChargeback: false,
      }),
    };
  }

  if (isIn(CSP_STRIPE_REVERSAL_EVENT_TYPES, type)) {
    return {
      mapped: true,
      kind: "reversal",
      state: applyVerifiedPaidPeriod({
        ...base,
        isSuccessfulCharge: false,
        isRefundOrChargeback: true,
      }),
    };
  }

  return { mapped: false, reason: "event_type_not_mapped" };
}

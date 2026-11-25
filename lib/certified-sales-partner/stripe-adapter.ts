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

/**
 * `CSP_STRIPE_LIVE_WIRING_ENABLED = false` — wiring of this adapter into a live Stripe webhook is
 * intentionally disabled. It is a compile-time constant (not an env switch); enabling it requires a
 * separate owner payment-consent task. No Stripe keys, webhook secrets or SDK exist in this module;
 * fixtures below are deterministic, offline, and NEVER represent live or test-mode Stripe traffic.
 */
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

/**
 * Offline fixture shape — a minimal stand-in for an already-verified Stripe invoice/charge event.
 * Used by deterministic tests (integration fixture). Never produced from, or sent to, Stripe.
 */
export type CspStripeFixtureEvent = {
  eventId: string;
  eventType: (typeof CSP_STRIPE_SUCCESS_EVENT_TYPES | typeof CSP_STRIPE_FAILURE_EVENT_TYPES | typeof CSP_STRIPE_REVERSAL_EVENT_TYPES)[number];
  amountPaid?: number;
  /** 1-based subscription period this event pays (from the Aipify ledger in real flows). */
  periodOrdinal: number;
};

export type CspStripeFixtureLedger = {
  paidPeriods: number;
  processedEventIds?: readonly string[];
  needsReversalReview?: boolean;
};

/**
 * Builds a `CspStripeVerifiedEventInput` from an offline fixture + ledger snapshot.
 * Marks `signatureVerified: true` because the FIXTURE stands in for a verified event — callers must
 * never pass real webhook payloads through this helper (live wiring stays disabled).
 */
export function buildPaidPeriodEventFromStripeFixture(
  fixture: CspStripeFixtureEvent,
  ledger: CspStripeFixtureLedger,
): CspStripeVerifiedEventInput {
  return {
    signatureVerified: true,
    eventType: fixture.eventType,
    eventId: fixture.eventId,
    amountPaid: fixture.amountPaid,
    currentPaidPeriods: ledger.paidPeriods,
    periodOrdinal: fixture.periodOrdinal,
    processedEventIds: ledger.processedEventIds,
    currentNeedsReversalReview: ledger.needsReversalReview,
  };
}

/**
 * CSP verified paid-period state machine — pure, fail-closed.
 * Commission is earned exactly once, on the 2nd verified successful charge.
 * History is never deleted: refunds/chargebacks only flag a reversal review.
 */
import { CSP_REQUIRED_PAID_PERIODS, type CspSaleStatus } from "./constants";

export type CspPaidPeriodInput = {
  currentPaidPeriods: number;
  eventPeriodOrdinal: number;
  isSuccessfulCharge: boolean;
  isDuplicate: boolean;
  isRefundOrChargeback: boolean;
  /** Optional carry-over of an earlier flag so it is never silently cleared. */
  currentNeedsReversalReview?: boolean;
};

export type CspPaidPeriodState = {
  paidPeriods: number;
  status: CspSaleStatus | null;
  commissionEarned: boolean;
  /** True once the one-time earn has happened. */
  earnOnce: boolean;
  /** True only on the event that crosses the earn threshold. */
  newlyEarned: boolean;
  needsReversalReview: boolean;
  changed: boolean;
  reason: string;
};

function baseStatus(paidPeriods: number): CspSaleStatus | null {
  if (paidPeriods >= CSP_REQUIRED_PAID_PERIODS) return "earned";
  if (paidPeriods === 1) return "registered_awaiting_second_payment";
  return null;
}

export function applyVerifiedPaidPeriod(input: CspPaidPeriodInput): CspPaidPeriodState {
  const current = Number.isFinite(input.currentPaidPeriods) ? Math.max(0, Math.floor(input.currentPaidPeriods)) : 0;
  const earned = current >= CSP_REQUIRED_PAID_PERIODS;
  const review = input.currentNeedsReversalReview === true;
  const state = (over: Partial<CspPaidPeriodState> & { reason: string }): CspPaidPeriodState => ({
    paidPeriods: current,
    status: baseStatus(current),
    commissionEarned: earned,
    earnOnce: earned,
    newlyEarned: false,
    needsReversalReview: review,
    changed: false,
    ...over,
  });

  if (input.isDuplicate) return state({ reason: "duplicate_event_ignored" });

  if (input.isRefundOrChargeback) {
    if (earned) {
      return state({
        needsReversalReview: true,
        changed: !review,
        reason: "needs_reversal_review",
      });
    }
    return state({ reason: "refund_before_earn_no_commission" });
  }

  if (!input.isSuccessfulCharge) return state({ reason: "failed_charge_ignored" });

  // Only the next sequential period counts; out-of-order or replayed ordinals do not.
  if (input.eventPeriodOrdinal !== current + 1) return state({ reason: "period_out_of_sequence" });

  const next = current + 1;
  if (next === 1) {
    return state({
      paidPeriods: 1,
      status: "registered_awaiting_second_payment",
      commissionEarned: false,
      earnOnce: false,
      changed: true,
      reason: "first_period_paid",
    });
  }
  if (next === CSP_REQUIRED_PAID_PERIODS) {
    return state({
      paidPeriods: next,
      status: "earned",
      commissionEarned: true,
      earnOnce: true,
      newlyEarned: true,
      changed: true,
      reason: "commission_earned",
    });
  }
  return state({
    paidPeriods: next,
    status: "earned",
    commissionEarned: true,
    earnOnce: true,
    newlyEarned: false,
    changed: true,
    reason: "renewal_no_new_commission",
  });
}

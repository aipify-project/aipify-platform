/**
 * Period-aware commission qualification rules — fail-closed until Core ledger + owner contract.
 * Fixed one-time commission from `csp_sales_products` remains Production truth.
 * Percent settlement is never computed or activated from the UI.
 */

import {
  isPercentCommissionActivatable,
  PERCENT_COMMISSION_BLOCKED_REASON,
  PERCENT_COMMISSION_STATUS,
} from "./percent-commission-contract";

export type CommissionBillingInterval = "month" | "year" | "one_time";

export type CommissionQualificationEvent =
  | "first_confirmed_payment"
  | "second_confirmed_paid_period"
  | "refund"
  | "chargeback"
  | "cancellation"
  | "renewal";

export type CommissionQualificationDecision =
  | {
      action: "accrue";
      model: "fixed_one_time";
      reason:
        | "monthly_after_second_paid_period"
        | "annual_on_first_paid_year"
        | "one_time_on_first_paid";
    }
  | {
      action: "register_pending";
      model: "fixed_one_time";
      reason: "monthly_first_payment_awaits_second_period";
    }
  | {
      action: "no_commission";
      reason:
        | "trial_or_unpaid"
        | "renewal_excluded"
        | "percent_core_blocked"
        | "unknown_interval"
        | "missing_capture";
    }
  | {
      action: "reclassify";
      reason: "refund_chargeback_or_cancel_keep_history";
    };

/** Fixed commission lifecycle — independent of later renewals. */
export function qualifyFixedCommission(input: {
  interval: CommissionBillingInterval | null | undefined;
  event: CommissionQualificationEvent;
  paymentCaptured: boolean;
}): CommissionQualificationDecision {
  if (!input.paymentCaptured && input.event === "first_confirmed_payment") {
    return { action: "no_commission", reason: "trial_or_unpaid" };
  }
  if (input.event === "renewal") {
    return { action: "no_commission", reason: "renewal_excluded" };
  }
  if (input.event === "refund" || input.event === "chargeback" || input.event === "cancellation") {
    return { action: "reclassify", reason: "refund_chargeback_or_cancel_keep_history" };
  }
  if (!input.interval) {
    return { action: "no_commission", reason: "unknown_interval" };
  }
  if (input.interval === "month") {
    if (input.event === "first_confirmed_payment") {
      return {
        action: "register_pending",
        model: "fixed_one_time",
        reason: "monthly_first_payment_awaits_second_period",
      };
    }
    if (input.event === "second_confirmed_paid_period") {
      return {
        action: "accrue",
        model: "fixed_one_time",
        reason: "monthly_after_second_paid_period",
      };
    }
  }
  if (input.interval === "year" && input.event === "first_confirmed_payment") {
    return {
      action: "accrue",
      model: "fixed_one_time",
      reason: "annual_on_first_paid_year",
    };
  }
  if (input.interval === "one_time" && input.event === "first_confirmed_payment") {
    return {
      action: "accrue",
      model: "fixed_one_time",
      reason: "one_time_on_first_paid",
    };
  }
  return { action: "no_commission", reason: "missing_capture" };
}

/** Percent is always blocked until Core settlement contract is owner-approved. */
export function qualifyPercentCommission(): CommissionQualificationDecision {
  if (!isPercentCommissionActivatable()) {
    return { action: "no_commission", reason: "percent_core_blocked" };
  }
  return { action: "no_commission", reason: "percent_core_blocked" };
}

export function percentCommissionRuntimeGate(): {
  status: typeof PERCENT_COMMISSION_STATUS;
  blockedReason: typeof PERCENT_COMMISSION_BLOCKED_REASON;
  activatable: false;
} {
  return {
    status: PERCENT_COMMISSION_STATUS,
    blockedReason: PERCENT_COMMISSION_BLOCKED_REASON,
    activatable: false,
  };
}

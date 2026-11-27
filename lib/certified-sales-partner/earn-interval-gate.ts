/**
 * Core still earns commission after two paid periods for every interval
 * (CSP_REQUIRED_PAID_PERIODS). Yearly and one-time sales must not be presented
 * as earned until Core distinguishes them. This module does not change that rule.
 */

export type BillingInterval = "monthly" | "annual" | "one_time" | "unknown";

export type EarnIntervalPresentation = {
  interval: BillingInterval;
  /** True when Core does not yet apply the interval-specific qualification. */
  corePending: boolean;
  /** False for yearly and one-time, even if a stored status says earned. */
  uiMayCountAsEarned: boolean;
  note: "monthly_authoritative" | "interval_not_on_record" | "annual_not_counted" | "one_time_not_counted";
};

const EARNED_STATUSES = new Set(["earned", "approved_for_payout", "queued_for_payout", "paid"]);

export function classifyBillingInterval(value: string | null | undefined): BillingInterval {
  const raw = (value ?? "").trim().toLowerCase();
  if (raw === "month" || raw === "monthly") return "monthly";
  if (raw === "year" || raw === "yearly" || raw === "annual") return "annual";
  if (raw === "one_time" || raw === "onetime" || raw === "once") return "one_time";
  return "unknown";
}

export function presentEarnInterval(interval: BillingInterval): EarnIntervalPresentation {
  if (interval === "monthly") {
    return {
      interval,
      corePending: false,
      uiMayCountAsEarned: true,
      note: "monthly_authoritative",
    };
  }
  if (interval === "annual") {
    return { interval, corePending: true, uiMayCountAsEarned: false, note: "annual_not_counted" };
  }
  if (interval === "one_time") {
    return { interval, corePending: true, uiMayCountAsEarned: false, note: "one_time_not_counted" };
  }
  return { interval: "unknown", corePending: true, uiMayCountAsEarned: false, note: "interval_not_on_record" };
}

/**
 * Monthly sales keep the status Core stored.
 * Yearly and one-time sales that Core marked earned stay out of the earned presentation.
 * When the interval is missing, the status is kept and flagged as not differentiated.
 */
export function presentSaleEarn(input: {
  status: string | null | undefined;
  billingInterval?: string | null;
}): { status: string | null; presentation: EarnIntervalPresentation } {
  const status = typeof input.status === "string" && input.status.trim() ? input.status.trim() : null;
  const interval = classifyBillingInterval(input.billingInterval);
  const presentation = presentEarnInterval(interval);
  if (!status) return { status, presentation };
  if (interval === "unknown") {
    // The list has no interval, so the stored status stays visible and the
    // interval rule is reported as pending rather than silently rewritten.
    return { status, presentation };
  }
  if (!presentation.uiMayCountAsEarned && EARNED_STATUSES.has(status)) {
    return { status: "core_pending", presentation };
  }
  return { status, presentation };
}

/**
 * CSP commission rules — pure functions, no I/O.
 *
 * Model (authoritative):
 *  - ONE-TIME fixed commission per product (not a percentage).
 *  - Earned only after TWO successful paid subscription periods.
 *  - NO renewal commission — periods beyond the second never create new commission.
 *  - The amount is SNAPSHOTTED at the first confirmed sale from the rate version
 *    effective at that moment; later rate changes never alter it.
 *  - At most one qualifying commission per (partner, customer org, product).
 */
import {
  CSP_ATTRIBUTION_WINDOW_DAYS,
  CSP_CUTOFF_TIME_ZONE,
  CSP_REQUIRED_PAID_PERIODS,
  CSP_TERMINAL_SALE_STATUSES,
  type CspSaleStatus,
} from "./constants";
import type { CommissionRateVersion, QualifiedSale } from "./types";

export type CommissionSnapshot = {
  amount: number;
  currency: string;
  rateVersionId: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** True when the registration happened inside the attribution window of the link click. */
export function isWithinAttributionWindow(
  attributedAt: Date | string,
  registeredAt: Date | string,
  windowDays: number = CSP_ATTRIBUTION_WINDOW_DAYS,
): boolean {
  const start = new Date(attributedAt).getTime();
  const end = new Date(registeredAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  if (end < start) return false;
  return end - start <= windowDays * DAY_MS;
}

/** Latest rate version whose effective_from is at or before `at`; null if none. */
export function pickEffectiveRateVersion(
  versions: readonly CommissionRateVersion[],
  productId: string,
  at: Date | string,
): CommissionRateVersion | null {
  const atMs = new Date(at).getTime();
  if (Number.isNaN(atMs)) return null;
  let best: CommissionRateVersion | null = null;
  for (const v of versions) {
    if (v.productId !== productId) continue;
    const eff = new Date(v.effectiveFrom).getTime();
    if (Number.isNaN(eff) || eff > atMs) continue;
    if (!best || eff > new Date(best.effectiveFrom).getTime()) best = v;
  }
  return best;
}

/** Snapshot the fixed commission at the first confirmed sale. Null when no rate applies. */
export function snapshotCommissionAtFirstConfirmedSale(
  versions: readonly CommissionRateVersion[],
  productId: string,
  firstConfirmedAt: Date | string,
): CommissionSnapshot | null {
  const v = pickEffectiveRateVersion(versions, productId, firstConfirmedAt);
  if (!v || !(v.amount >= 0)) return null;
  return { amount: v.amount, currency: v.currency, rateVersionId: v.id };
}

/** Commission is earned once two successful paid periods exist. */
export function hasReachedEarnThreshold(paidPeriodsCount: number): boolean {
  return Number.isInteger(paidPeriodsCount) && paidPeriodsCount >= CSP_REQUIRED_PAID_PERIODS;
}

/**
 * Pre-payout status derived from paid periods only.
 *  0 periods → registered_awaiting_second_payment is NOT yet applicable (no confirmed sale);
 *              callers should not create a qualified sale before the first paid period.
 *  1 period  → registered_awaiting_second_payment
 *  2+        → earned (never more than one commission, no renewals)
 */
export function deriveSaleStatusFromPaidPeriods(paidPeriodsCount: number): CspSaleStatus | null {
  if (!Number.isInteger(paidPeriodsCount) || paidPeriodsCount < 1) return null;
  return hasReachedEarnThreshold(paidPeriodsCount)
    ? "earned"
    : "registered_awaiting_second_payment";
}

/**
 * Commission payable for a sale: the snapshot once earned, else 0.
 * Renewals (paid periods > 2) never increase the amount.
 */
export function commissionAmountForSale(
  sale: Pick<QualifiedSale, "paidPeriodsCount" | "snapshotAmount" | "status">,
): number {
  if (sale.status === "reversed" || sale.status === "rejected") return 0;
  if (!hasReachedEarnThreshold(sale.paidPeriodsCount)) return 0;
  return sale.snapshotAmount ?? 0;
}

/** Renewal periods (3rd paid period onward) never generate commission. */
export function isRenewalCommissionEligible(): false {
  return false;
}

/** Allowed forward transitions; reversal is allowed from any non-terminal-negative state. */
const TRANSITIONS: Record<CspSaleStatus, readonly CspSaleStatus[]> = {
  registered_awaiting_second_payment: ["pending_possible", "earned", "rejected", "reversed"],
  pending_possible: ["earned", "registered_awaiting_second_payment", "rejected", "reversed"],
  earned: ["approved_for_payout", "reversed", "rejected"],
  approved_for_payout: ["queued_for_payout", "reversed"],
  queued_for_payout: ["paid", "approved_for_payout", "reversed"],
  paid: ["reversed"],
  reversed: [],
  rejected: [],
};

export function canTransitionSaleStatus(from: CspSaleStatus, to: CspSaleStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isTerminalSaleStatus(status: CspSaleStatus): boolean {
  return CSP_TERMINAL_SALE_STATUSES.includes(status);
}

/** Dedupe key matching the DB unique constraint (partner, customer org, product). */
export function qualifyingSaleKey(partnerId: string, customerOrgId: string, productId: string): string {
  return `${partnerId}:${customerOrgId}:${productId}`;
}

/** True if a qualifying sale already exists for the same triple (blocks double commission). */
export function wouldDoubleCommission(
  existing: ReadonlyArray<Pick<QualifiedSale, "partnerId" | "customerOrgId" | "productId" | "status">>,
  candidate: { partnerId: string; customerOrgId: string; productId: string },
): boolean {
  const key = qualifyingSaleKey(candidate.partnerId, candidate.customerOrgId, candidate.productId);
  return existing.some(
    (s) =>
      s.status !== "rejected" &&
      qualifyingSaleKey(s.partnerId, s.customerOrgId, s.productId) === key,
  );
}

/** `YYYY-MM` of an instant in the settlement time zone (Europe/Oslo). */
export function settlementMonthKey(at: Date | string, timeZone: string = CSP_CUTOFF_TIME_ZONE): string {
  const d = new Date(at);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit" }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

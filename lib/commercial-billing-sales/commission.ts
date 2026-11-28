/**
 * G. Commission ledger — pure, append-only, idempotent.
 *
 * Reuses `qualifyFixedCommission` (period rules), `qualifyingSaleKey` (dedupe), `isSelfReferral`
 * and the percent gate from product-catalog/percent-commission-contract.
 *
 *  - Fixed amount (explicit 0 valid; null rule = NOT configured, never defaulted).
 *  - Percent is CORE_BLOCKED: recorded as blocked, never earned.
 *  - Monthly: registered after 1st paid period, earned after the 2nd. Yearly: earned on first confirmed
 *    annual payment. One-time: earned on first captured payment. Renewals never earn again.
 *  - Refund / chargeback reverse by APPENDING entries; history is never deleted.
 *  - Settlement is manual only. No payout activation exists in this module.
 *  - Legacy 500/800/0 rates are NEVER introduced here.
 */

import { isSelfReferral } from "@/lib/certified-sales-partner/attribution-policy";
import { qualifyingSaleKey } from "@/lib/certified-sales-partner/commission-rules";
import { qualifyFixedCommission } from "@/lib/product-catalog/commission-rules";
import {
  isPercentCommissionActivatable,
  PERCENT_COMMISSION_BLOCKED_REASON,
} from "@/lib/product-catalog/percent-commission-contract";
import type { VariantIntervalCommissionRule } from "@/lib/product-catalog/variant-commission";
import { applyBasisPoints, majorToMinorExact, normalizeCurrency } from "./money";

export type CommissionInterval = "month" | "year" | "one_time";

export type CommissionRuleSnapshot =
  | {
      configured: true;
      model: "fixed";
      /** Explicit 0 is a configured zero commission. */
      amountMinor: number;
      currency: string;
    }
  | {
      configured: false;
      reason:
        | "not_configured"
        | "rule_inactive"
        | "amount_missing"
        | "amount_invalid"
        | "currency_invalid"
        | "currency_mismatch"
        | typeof PERCENT_COMMISSION_BLOCKED_REASON
        | "percent_core_blocked";
    };

/** null/undefined rule => not configured. Never falls back to a legacy or default rate. */
export function resolveCommissionRuleSnapshot(
  rule: VariantIntervalCommissionRule | null | undefined,
  saleCurrency: string,
): CommissionRuleSnapshot {
  if (rule == null) return { configured: false, reason: "not_configured" };
  if (rule.active === false) return { configured: false, reason: "rule_inactive" };
  if (rule.model === "percent") {
    // CORE_BLOCKED until owner-approved settlement contract.
    return { configured: false, reason: "percent_core_blocked" };
  }
  const ruleCurrency = normalizeCurrency(rule.currency);
  const sale = normalizeCurrency(saleCurrency);
  if (!ruleCurrency || !sale) return { configured: false, reason: "currency_invalid" };
  if (ruleCurrency !== sale) return { configured: false, reason: "currency_mismatch" };
  if (rule.amountMajor == null) return { configured: false, reason: "amount_missing" };
  const minor = majorToMinorExact(rule.amountMajor, ruleCurrency);
  if (!minor.ok) return { configured: false, reason: "amount_invalid" };
  return { configured: true, model: "fixed", amountMinor: minor.value, currency: ruleCurrency };
}

/**
 * Parity-only helper for percent math (net ex VAT after discount, round half up).
 * NOT wired into the ledger: `isPercentCommissionActivatable()` is false.
 */
export function computePercentCommissionMinorForParityOnly(netExVatAfterDiscountMinor: number, rateBp: number): number {
  return applyBasisPoints(netExVatAfterDiscountMinor, rateBp);
}

export function percentCommissionIsActivatable(): boolean {
  return isPercentCommissionActivatable();
}

export type CommissionSaleStatus = "registered" | "earned" | "reversed" | "cancelled_unearned";
export type CommissionSettlementState = "unsettled" | "queued" | "settled";

export type CommissionSale = {
  saleKey: string;
  programId: string;
  programKind: "aipify_certified_free" | "tenant_commercial";
  ownerTenantId: string;
  partnerId: string;
  customerTenantId: string;
  productKey: string;
  variantKey: string;
  interval: CommissionInterval;
  currency: string;
  subscriptionId: string | null;
  /** Snapshot taken at the FIRST confirmed payment; later rule edits never alter it. */
  rule: CommissionRuleSnapshot;
  paidPeriods: number;
  capturedPaymentIds: string[];
  /** Payments whose refund/chargeback reverses the commission (first, plus second when monthly). */
  qualifyingPaymentIds: string[];
  status: CommissionSaleStatus;
  statusBeforeReversal: CommissionSaleStatus | null;
  reversedByPaymentId: string | null;
  reversedByKind: "refund" | "chargeback" | null;
  earnedAmountMinor: number;
  settlementState: CommissionSettlementState;
  needsReview: boolean;
  needsClawbackReview: boolean;
  reviewReasons: string[];
};

export type CommissionLedgerEntryType =
  | "registered"
  | "earned"
  | "reversal"
  | "reinstatement"
  | "cancelled_unearned"
  | "review_flag";

export type CommissionLedgerEntry = {
  entryId: string;
  idempotencyKey: string;
  saleKey: string;
  type: CommissionLedgerEntryType;
  /** Signed minor units. reversal is negative (or 0). */
  amountMinor: number;
  currency: string;
  sourceEventId: string;
  paymentId: string | null;
  at: string;
  note: string | null;
};

export type CommissionLedger = {
  sales: Record<string, CommissionSale>;
  entries: CommissionLedgerEntry[];
  processedKeys: string[];
};

export function createEmptyCommissionLedger(): CommissionLedger {
  return { sales: {}, entries: [], processedKeys: [] };
}

export function commissionSaleKey(input: {
  programId: string;
  partnerId: string;
  customerTenantId: string;
  productKey: string;
}): string {
  return `${input.programId}:${qualifyingSaleKey(input.partnerId, input.customerTenantId, input.productKey)}`;
}

export type CommissionCaptureInput = {
  eventId: string;
  paymentId: string;
  programId: string;
  programKind: CommissionSale["programKind"];
  ownerTenantId: string;
  partnerId: string;
  partnerAuthUserId?: string | null;
  customerTenantId: string;
  customerAuthUserId?: string | null;
  productKey: string;
  variantKey: string;
  interval: CommissionInterval;
  currency: string;
  subscriptionId?: string | null;
  /** 1-based paid-period ordinal derived by the payment ledger (one_time = 1). */
  periodOrdinal: number;
  capturedMinor: number;
  /** Net ex VAT after discount for this payment (commission basis; used for sanity flag only). */
  netExVatMinor: number | null;
  rule: VariantIntervalCommissionRule | null | undefined;
  at: string;
};

export type CommissionOutcome =
  | { kind: "registered"; saleKey: string }
  | { kind: "earned"; saleKey: string; amountMinor: number }
  | { kind: "registered_earn_blocked"; saleKey: string; reason: string }
  | { kind: "renewal_no_commission"; saleKey: string }
  | { kind: "duplicate_ignored"; reason: "event_replayed" | "payment_already_recorded" | "sale_already_qualified" }
  | {
      kind: "rejected";
      reason:
        | "self_referral"
        | "cross_tenant_forbidden"
        | "no_confirmed_capture"
        | "sale_not_registered"
        | "period_out_of_sequence"
        | "sale_closed"
        | "invalid_input";
    }
  | { kind: "reversed"; saleKey: string; amountMinor: number; clawbackReview: boolean }
  | { kind: "reinstated"; saleKey: string; amountMinor: number }
  | { kind: "review_flagged"; saleKey: string; reason: string }
  | { kind: "cancelled_unearned"; saleKey: string }
  | { kind: "no_commission_impact"; reason: string }
  | { kind: "sale_not_found" };

export type CommissionResult = { ledger: CommissionLedger; outcome: CommissionOutcome };

function appendEntry(
  ledger: CommissionLedger,
  e: Omit<CommissionLedgerEntry, "entryId"> & { entryId?: string },
): CommissionLedger {
  const seq = ledger.entries.filter((x) => x.saleKey === e.saleKey).length + 1;
  return {
    ...ledger,
    entries: [...ledger.entries, { ...e, entryId: e.entryId ?? `${e.saleKey}#${seq}` }],
    processedKeys: ledger.processedKeys.includes(e.idempotencyKey)
      ? ledger.processedKeys
      : [...ledger.processedKeys, e.idempotencyKey],
  };
}

function withSale(ledger: CommissionLedger, sale: CommissionSale): CommissionLedger {
  return { ...ledger, sales: { ...ledger.sales, [sale.saleKey]: sale } };
}

function markKey(ledger: CommissionLedger, key: string): CommissionLedger {
  return ledger.processedKeys.includes(key) ? ledger : { ...ledger, processedKeys: [...ledger.processedKeys, key] };
}

function isNonNegInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0;
}

export function applyCommissionPaymentCaptured(
  ledger: CommissionLedger,
  input: CommissionCaptureInput,
): CommissionResult {
  const key = `capture:${input.eventId}`;
  if (!input.eventId || !input.paymentId || !input.partnerId || !input.customerTenantId || !input.programId) {
    return { ledger, outcome: { kind: "rejected", reason: "invalid_input" } };
  }
  if (ledger.processedKeys.includes(key)) {
    return { ledger, outcome: { kind: "duplicate_ignored", reason: "event_replayed" } };
  }
  if (isSelfReferral({ partnerAuthUserId: input.partnerAuthUserId, customerAuthUserId: input.customerAuthUserId })) {
    return { ledger, outcome: { kind: "rejected", reason: "self_referral" } };
  }
  if (!isNonNegInt(input.capturedMinor) || input.capturedMinor <= 0) {
    return { ledger, outcome: { kind: "rejected", reason: "no_confirmed_capture" } };
  }
  if (!Number.isInteger(input.periodOrdinal) || input.periodOrdinal < 1) {
    return { ledger, outcome: { kind: "rejected", reason: "invalid_input" } };
  }

  const saleKey = commissionSaleKey(input);
  const existing = ledger.sales[saleKey];

  if (existing) {
    if (existing.ownerTenantId !== input.ownerTenantId || existing.programKind !== input.programKind) {
      return { ledger, outcome: { kind: "rejected", reason: "cross_tenant_forbidden" } };
    }
    if (existing.capturedPaymentIds.includes(input.paymentId)) {
      return { ledger: markKey(ledger, key), outcome: { kind: "duplicate_ignored", reason: "payment_already_recorded" } };
    }
  }

  // ---- ordinal 1: first confirmed payment ---------------------------------------------------
  if (input.periodOrdinal === 1) {
    if (existing) {
      // At most one qualifying commission per (program, partner, customer, product).
      return { ledger: markKey(ledger, key), outcome: { kind: "duplicate_ignored", reason: "sale_already_qualified" } };
    }
    const rule = resolveCommissionRuleSnapshot(input.rule, input.currency);
    const decision = qualifyFixedCommission({
      interval: input.interval,
      event: "first_confirmed_payment",
      paymentCaptured: true,
    });
    const reviewReasons: string[] = [];
    if (!rule.configured) reviewReasons.push(`commission_${rule.reason}`);
    if (rule.configured && input.netExVatMinor != null && rule.amountMinor > input.netExVatMinor) {
      reviewReasons.push("commission_exceeds_net_sale");
    }
    let sale: CommissionSale = {
      saleKey,
      programId: input.programId,
      programKind: input.programKind,
      ownerTenantId: input.ownerTenantId,
      partnerId: input.partnerId,
      customerTenantId: input.customerTenantId,
      productKey: input.productKey,
      variantKey: input.variantKey,
      interval: input.interval,
      currency: normalizeCurrency(input.currency) ?? input.currency,
      subscriptionId: input.subscriptionId ?? null,
      rule,
      paidPeriods: 1,
      capturedPaymentIds: [input.paymentId],
      qualifyingPaymentIds: [input.paymentId],
      status: "registered",
      statusBeforeReversal: null,
      reversedByPaymentId: null,
      reversedByKind: null,
      earnedAmountMinor: 0,
      settlementState: "unsettled",
      needsReview: reviewReasons.length > 0,
      needsClawbackReview: false,
      reviewReasons,
    };
    let next = appendEntry(ledger, {
      idempotencyKey: key,
      saleKey,
      type: "registered",
      amountMinor: 0,
      currency: sale.currency,
      sourceEventId: input.eventId,
      paymentId: input.paymentId,
      at: input.at,
      note: rule.configured ? null : `commission_${rule.reason}`,
    });

    if (decision.action === "accrue") {
      if (!rule.configured) {
        next = withSale(next, sale);
        return { ledger: next, outcome: { kind: "registered_earn_blocked", saleKey, reason: `commission_${rule.reason}` } };
      }
      sale = { ...sale, status: "earned", earnedAmountMinor: rule.amountMinor };
      next = appendEntry(next, {
        idempotencyKey: `earn:${input.eventId}`,
        saleKey,
        type: "earned",
        amountMinor: rule.amountMinor,
        currency: sale.currency,
        sourceEventId: input.eventId,
        paymentId: input.paymentId,
        at: input.at,
        note: decision.reason,
      });
      return { ledger: withSale(next, sale), outcome: { kind: "earned", saleKey, amountMinor: rule.amountMinor } };
    }
    // monthly: registered, visible, not yet earned
    return { ledger: withSale(next, sale), outcome: { kind: "registered", saleKey } };
  }

  // ---- ordinal > 1 -------------------------------------------------------------------------------
  if (!existing) return { ledger, outcome: { kind: "rejected", reason: "sale_not_registered" } };
  if (existing.status === "reversed" || existing.status === "cancelled_unearned") {
    return { ledger: markKey(ledger, key), outcome: { kind: "rejected", reason: "sale_closed" } };
  }
  if (input.periodOrdinal !== existing.paidPeriods + 1) {
    return { ledger, outcome: { kind: "rejected", reason: "period_out_of_sequence" } };
  }

  const isSecondMonthly = existing.interval === "month" && input.periodOrdinal === 2;
  const decision = qualifyFixedCommission({
    interval: existing.interval,
    event: isSecondMonthly ? "second_confirmed_paid_period" : "renewal",
    paymentCaptured: true,
  });

  let sale: CommissionSale = {
    ...existing,
    paidPeriods: input.periodOrdinal,
    capturedPaymentIds: [...existing.capturedPaymentIds, input.paymentId],
  };

  if (decision.action !== "accrue") {
    // Renewal: counts as a paid period, NEVER a new commission.
    return { ledger: withSale(markKey(ledger, key), sale), outcome: { kind: "renewal_no_commission", saleKey } };
  }

  sale = { ...sale, qualifyingPaymentIds: [...sale.qualifyingPaymentIds, input.paymentId] };
  if (!sale.rule.configured) {
    return {
      ledger: withSale(markKey(ledger, key), sale),
      outcome: { kind: "registered_earn_blocked", saleKey, reason: `commission_${sale.rule.reason}` },
    };
  }
  const earnAmount = sale.rule.amountMinor;
  sale = { ...sale, status: "earned", earnedAmountMinor: earnAmount };
  const next = appendEntry(ledger, {
    idempotencyKey: key,
    saleKey,
    type: "earned",
    amountMinor: earnAmount,
    currency: sale.currency,
    sourceEventId: input.eventId,
    paymentId: input.paymentId,
    at: input.at,
    note: decision.reason,
  });
  return { ledger: withSale(next, sale), outcome: { kind: "earned", saleKey, amountMinor: earnAmount } };
}

export function findSaleByPaymentId(ledger: CommissionLedger, paymentId: string): CommissionSale | null {
  return Object.values(ledger.sales).find((s) => s.capturedPaymentIds.includes(paymentId)) ?? null;
}

/** Refund / chargeback. Full reversal only when the whole qualifying payment is returned. */
export function applyCommissionReversal(
  ledger: CommissionLedger,
  input: {
    eventId: string;
    paymentId: string;
    kind: "refund" | "chargeback";
    /** true when the entire captured amount was returned/withdrawn. */
    full: boolean;
    at: string;
  },
): CommissionResult {
  const key = `reverse:${input.eventId}`;
  if (ledger.processedKeys.includes(key)) {
    return { ledger, outcome: { kind: "duplicate_ignored", reason: "event_replayed" } };
  }
  const sale = findSaleByPaymentId(ledger, input.paymentId);
  if (!sale) return { ledger, outcome: { kind: "sale_not_found" } };
  if (sale.status === "reversed" || sale.status === "cancelled_unearned") {
    return { ledger: markKey(ledger, key), outcome: { kind: "no_commission_impact", reason: "sale_already_closed" } };
  }
  if (!sale.qualifyingPaymentIds.includes(input.paymentId)) {
    return { ledger: markKey(ledger, key), outcome: { kind: "no_commission_impact", reason: "non_qualifying_payment" } };
  }

  if (!input.full) {
    // Partial refund: never auto-reverse; flag for manual review, history intact.
    const flagged: CommissionSale = {
      ...sale,
      needsReview: true,
      reviewReasons: [...sale.reviewReasons, "partial_refund_review"],
    };
    const next = appendEntry(ledger, {
      idempotencyKey: key,
      saleKey: sale.saleKey,
      type: "review_flag",
      amountMinor: 0,
      currency: sale.currency,
      sourceEventId: input.eventId,
      paymentId: input.paymentId,
      at: input.at,
      note: "partial_refund_review",
    });
    return { ledger: withSale(next, flagged), outcome: { kind: "review_flagged", saleKey: sale.saleKey, reason: "partial_refund_review" } };
  }

  const clawback = sale.settlementState !== "unsettled" && sale.status === "earned";
  const reversed: CommissionSale = {
    ...sale,
    status: "reversed",
    statusBeforeReversal: sale.status,
    reversedByPaymentId: input.paymentId,
    reversedByKind: input.kind,
    needsClawbackReview: sale.needsClawbackReview || clawback,
    needsReview: sale.needsReview || clawback,
    reviewReasons: clawback ? [...sale.reviewReasons, "reversal_after_settlement"] : sale.reviewReasons,
  };
  const amount = sale.status === "earned" ? -sale.earnedAmountMinor : 0;
  const next = appendEntry(ledger, {
    idempotencyKey: key,
    saleKey: sale.saleKey,
    type: "reversal",
    amountMinor: amount,
    currency: sale.currency,
    sourceEventId: input.eventId,
    paymentId: input.paymentId,
    at: input.at,
    note: input.kind,
  });
  return {
    ledger: withSale(next, reversed),
    outcome: { kind: "reversed", saleKey: sale.saleKey, amountMinor: amount, clawbackReview: clawback },
  };
}

/** Chargeback won (dispute closed in merchant's favour): reinstate. Refunds are never reinstated. */
export function applyCommissionReinstatement(
  ledger: CommissionLedger,
  input: { eventId: string; paymentId: string; at: string },
): CommissionResult {
  const key = `reinstate:${input.eventId}`;
  if (ledger.processedKeys.includes(key)) {
    return { ledger, outcome: { kind: "duplicate_ignored", reason: "event_replayed" } };
  }
  const sale = findSaleByPaymentId(ledger, input.paymentId);
  if (!sale) return { ledger, outcome: { kind: "sale_not_found" } };
  if (
    sale.status !== "reversed" ||
    sale.reversedByKind !== "chargeback" ||
    sale.reversedByPaymentId !== input.paymentId ||
    !sale.statusBeforeReversal
  ) {
    return { ledger: markKey(ledger, key), outcome: { kind: "no_commission_impact", reason: "not_reinstatable" } };
  }
  const restoredAmount = sale.statusBeforeReversal === "earned" ? sale.earnedAmountMinor : 0;
  const restored: CommissionSale = {
    ...sale,
    status: sale.statusBeforeReversal,
    statusBeforeReversal: null,
    reversedByPaymentId: null,
    reversedByKind: null,
  };
  const next = appendEntry(ledger, {
    idempotencyKey: key,
    saleKey: sale.saleKey,
    type: "reinstatement",
    amountMinor: restoredAmount,
    currency: sale.currency,
    sourceEventId: input.eventId,
    paymentId: input.paymentId,
    at: input.at,
    note: "chargeback_won",
  });
  return { ledger: withSale(next, restored), outcome: { kind: "reinstated", saleKey: sale.saleKey, amountMinor: restoredAmount } };
}

/** Subscription cancelled before the earn threshold: the sale never earns. Earned sales are untouched. */
export function applyCommissionSubscriptionCancelled(
  ledger: CommissionLedger,
  input: { eventId: string; subscriptionId: string; at: string },
): CommissionResult {
  const key = `cancel:${input.eventId}`;
  if (ledger.processedKeys.includes(key)) {
    return { ledger, outcome: { kind: "duplicate_ignored", reason: "event_replayed" } };
  }
  const sale = Object.values(ledger.sales).find((s) => s.subscriptionId === input.subscriptionId);
  if (!sale) return { ledger, outcome: { kind: "sale_not_found" } };
  if (sale.status !== "registered") {
    return { ledger: markKey(ledger, key), outcome: { kind: "no_commission_impact", reason: "already_earned_or_closed" } };
  }
  const next = appendEntry(ledger, {
    idempotencyKey: key,
    saleKey: sale.saleKey,
    type: "cancelled_unearned",
    amountMinor: 0,
    currency: sale.currency,
    sourceEventId: input.eventId,
    paymentId: null,
    at: input.at,
    note: "cancelled_before_earn",
  });
  return {
    ledger: withSale(next, { ...sale, status: "cancelled_unearned" }),
    outcome: { kind: "cancelled_unearned", saleKey: sale.saleKey },
  };
}

// ---------------------------------------------------------------------------
// Manual settlement ONLY. No payout activation, no auto-approval, no money movement.
// ---------------------------------------------------------------------------

export const COMMISSION_SETTLEMENT_POLICY = {
  manualOnly: true,
  autoApprove: false,
  payoutActivation: false,
  programLedgersMixed: false,
} as const;

export function canEnterManualSettlement(sale: CommissionSale): { ok: true } | { ok: false; reason: string } {
  if (sale.status !== "earned") return { ok: false, reason: "not_earned" };
  if (sale.settlementState !== "unsettled") return { ok: false, reason: "already_in_settlement" };
  if (sale.needsReview) return { ok: false, reason: "needs_review" };
  if (!sale.rule.configured) return { ok: false, reason: "commission_not_configured" };
  return { ok: true };
}

export function queueSaleForManualSettlement(
  ledger: CommissionLedger,
  input: { saleKey: string; approvedByUserId: string | null | undefined },
): { ledger: CommissionLedger; ok: true } | { ledger: CommissionLedger; ok: false; reason: string } {
  const actor = typeof input.approvedByUserId === "string" ? input.approvedByUserId.trim() : "";
  if (!actor) return { ledger, ok: false, reason: "manual_approver_required" };
  const sale = ledger.sales[input.saleKey];
  if (!sale) return { ledger, ok: false, reason: "sale_not_found" };
  const gate = canEnterManualSettlement(sale);
  if (!gate.ok) return { ledger, ok: false, reason: gate.reason };
  return { ledger: withSale(ledger, { ...sale, settlementState: "queued" }), ok: true };
}

/** Records that a human settled out-of-band. Never triggers a payout. */
export function recordManualSettlementCompleted(
  ledger: CommissionLedger,
  input: { saleKey: string; recordedByUserId: string | null | undefined },
): { ledger: CommissionLedger; ok: true } | { ledger: CommissionLedger; ok: false; reason: string } {
  const actor = typeof input.recordedByUserId === "string" ? input.recordedByUserId.trim() : "";
  if (!actor) return { ledger, ok: false, reason: "manual_approver_required" };
  const sale = ledger.sales[input.saleKey];
  if (!sale) return { ledger, ok: false, reason: "sale_not_found" };
  if (sale.settlementState !== "queued") return { ledger, ok: false, reason: "not_queued" };
  return { ledger: withSale(ledger, { ...sale, settlementState: "settled" }), ok: true };
}

/** Net balance (earned − reversed + reinstated) for one sale from append-only entries. */
export function saleLedgerBalanceMinor(ledger: CommissionLedger, saleKey: string): number {
  return ledger.entries
    .filter((e) => e.saleKey === saleKey)
    .reduce((sum, e) => (e.type === "earned" || e.type === "reversal" || e.type === "reinstatement" ? sum + e.amountMinor : sum), 0);
}

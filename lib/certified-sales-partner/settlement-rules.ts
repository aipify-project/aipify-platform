/**
 * CSP settlement status mapping and transition rules — pure, fail-closed.
 * DB enum strings (open|closed|approved|paid|voided) are never changed;
 * business labels are a presentation mapping only.
 */
import {
  CSP_SETTLEMENT_BUSINESS_LABELS,
  type CspSettlementBusinessLabel,
  type CspSettlementStatus,
} from "./constants";

export function settlementBusinessLabel(status: CspSettlementStatus): CspSettlementBusinessLabel {
  return CSP_SETTLEMENT_BUSINESS_LABELS[status];
}

const TRANSITIONS: Record<CspSettlementStatus, readonly CspSettlementStatus[]> = {
  open: ["approved", "voided"],
  approved: ["closed"],
  closed: ["paid", "voided"],
  paid: [],
  voided: [],
};

export function canTransitionSettlement(from: CspSettlementStatus, to: CspSettlementStatus): boolean {
  return (TRANSITIONS[from] ?? []).includes(to);
}

export type CspRuleResult = { ok: true } | { ok: false; error: string };

/** Rejection (`voided`) requires a non-empty reason. Other targets need none. */
export function requireRejectionReason(to: CspSettlementStatus, reason?: string | null): CspRuleResult {
  if (to !== "voided") return { ok: true };
  if (typeof reason !== "string" || reason.trim().length === 0) {
    return { ok: false, error: "rejection_reason_required" };
  }
  return { ok: true };
}

export type CspPaidEvidence = {
  paidAt?: string | Date | null;
  paymentReference?: string | null;
  adminId?: string | null;
};

/** Marking `paid` requires paidAt, a payment reference and the acting admin. */
export function requirePaidReference(to: CspSettlementStatus, evidence: CspPaidEvidence): CspRuleResult {
  if (to !== "paid") return { ok: true };
  const paidAtOk =
    evidence?.paidAt instanceof Date
      ? !Number.isNaN(evidence.paidAt.getTime())
      : typeof evidence?.paidAt === "string" &&
        evidence.paidAt.trim().length > 0 &&
        !Number.isNaN(new Date(evidence.paidAt).getTime());
  if (!paidAtOk) return { ok: false, error: "paid_at_required" };
  if (typeof evidence.paymentReference !== "string" || evidence.paymentReference.trim() === "") {
    return { ok: false, error: "payment_reference_required" };
  }
  if (typeof evidence.adminId !== "string" || evidence.adminId.trim() === "") {
    return { ok: false, error: "admin_id_required" };
  }
  return { ok: true };
}

/** Combined transition + evidence validation for Platform finance APIs. */
export function validateSettlementTransition(
  from: CspSettlementStatus,
  to: CspSettlementStatus,
  extras: {
    rejectionReason?: string | null;
    paidAt?: string | Date | null;
    paymentReference?: string | null;
    adminId?: string | null;
  } = {},
): CspRuleResult {
  if (!canTransitionSettlement(from, to)) {
    return { ok: false, error: "invalid_settlement_transition" };
  }
  const rejection = requireRejectionReason(to, extras.rejectionReason);
  if (!rejection.ok) return rejection;
  return requirePaidReference(to, extras);
}

export { CSP_SETTLEMENT_BUSINESS_LABELS as CSP_SETTLEMENT_BUSINESS_LABEL };

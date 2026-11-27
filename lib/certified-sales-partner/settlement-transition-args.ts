/**
 * Maps the Platform settlement form onto the applied Core function
 * csp_transition_settlement(p_settlement_id, p_to, p_reason, p_paid_at, p_payment_reference).
 * Paid is refused unless the operator confirms the bank transfer already happened.
 */
import type { CspSettlementStatus } from "./constants";
import { validateSettlementTransition } from "./settlement-rules";

const STATUSES = new Set(["open", "closed", "approved", "paid", "voided"]);

export type SettlementTransitionInput = {
  settlementId?: string | null;
  fromStatus?: string | null;
  toStatus?: string | null;
  rejectionReason?: string | null;
  paidAt?: string | null;
  paymentReference?: string | null;
  adminId?: string | null;
  bankPayoutConfirmed?: boolean | null;
};

export type SettlementTransitionArgs = {
  p_settlement_id: string;
  p_to: CspSettlementStatus;
  p_reason: string | null;
  p_paid_at: string | null;
  p_payment_reference: string | null;
};

export function buildSettlementTransitionArgs(
  input: SettlementTransitionInput,
): { ok: true; args: SettlementTransitionArgs } | { ok: false; error: string } {
  const settlementId = input.settlementId?.trim() ?? "";
  const fromStatus = input.fromStatus?.trim() ?? "";
  const toStatus = input.toStatus?.trim() ?? "";
  if (!settlementId || !fromStatus || !toStatus) {
    return { ok: false, error: "settlement_transition_fields_required" };
  }
  if (!STATUSES.has(fromStatus) || !STATUSES.has(toStatus)) {
    return { ok: false, error: "invalid_settlement_status" };
  }
  if (toStatus === "paid" && input.bankPayoutConfirmed !== true) {
    return { ok: false, error: "bank_payout_confirmation_required" };
  }
  const paidAt = input.paidAt?.trim() ?? "";
  const paymentReference = input.paymentReference?.trim() ?? "";
  const validation = validateSettlementTransition(fromStatus as CspSettlementStatus, toStatus as CspSettlementStatus, {
    rejectionReason: input.rejectionReason,
    paidAt: toStatus === "paid" ? paidAt : null,
    paymentReference: toStatus === "paid" ? paymentReference : null,
    adminId: input.adminId,
  });
  if (!validation.ok) return validation;
  return {
    ok: true,
    args: {
      p_settlement_id: settlementId,
      p_to: toStatus as CspSettlementStatus,
      p_reason: input.rejectionReason?.trim() ? input.rejectionReason.trim() : null,
      p_paid_at: toStatus === "paid" ? new Date(paidAt).toISOString() : null,
      p_payment_reference: toStatus === "paid" ? paymentReference : null,
    },
  };
}

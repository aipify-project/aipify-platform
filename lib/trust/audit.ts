import type { TrustAuditEntry, TrustAuditOutcome } from "./types";

/** Required fields for immutable sensitive-operation logs (Phase 19 §15). */
export const TRUST_AUDIT_REQUIRED_FIELDS = [
  "timestamp",
  "tenant",
  "user",
  "skill",
  "action",
  "reason",
  "approval_source",
  "execution_outcome",
] as const;

export const TRUST_AUDIT_OUTCOMES: readonly TrustAuditOutcome[] = [
  "success",
  "failure",
  "blocked",
  "pending",
] as const;

export function buildTrustAuditEntry(input: {
  tenantId: string;
  action: string;
  outcome: TrustAuditOutcome;
  userId?: string;
  skillId?: string;
  reason?: string;
  approvalSource?: string;
  installationId?: string;
}): TrustAuditEntry {
  return {
    timestamp: new Date().toISOString(),
    tenantId: input.tenantId,
    userId: input.userId,
    skillId: input.skillId,
    action: input.action,
    reason: input.reason,
    approvalSource: input.approvalSource,
    outcome: input.outcome,
    installationId: input.installationId,
  };
}

export function isTrustAuditOutcome(value: string): value is TrustAuditOutcome {
  return (TRUST_AUDIT_OUTCOMES as readonly string[]).includes(value);
}

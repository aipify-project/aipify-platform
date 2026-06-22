import { sanitizeVerificationCaseForAudit } from "@/lib/integration-intelligence/verification/masking";
import type {
  VerificationCaseSummary,
  VerificationQueueSummary,
} from "@/lib/integration-intelligence/verification/types";

export type VerificationAuditEvent = {
  audit_id: string;
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  case_id: string | null;
  provider_key: string;
  created_at: string;
  payload: Record<string, unknown>;
};

const auditLog: VerificationAuditEvent[] = [];

export function createVerificationAuditEvent(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  case_id?: string | null;
  provider_key: string;
  case_summary?: VerificationCaseSummary | null;
  queue?: VerificationQueueSummary | null;
}): VerificationAuditEvent {
  const event: VerificationAuditEvent = {
    audit_id: `verification-audit-${auditLog.length + 1}`,
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.capability_key,
    outcome: input.outcome,
    case_id: input.case_id ?? null,
    provider_key: input.provider_key,
    created_at: new Date().toISOString(),
    payload: {
      queue_pending: input.queue?.total_pending ?? null,
      case: input.case_summary
        ? sanitizeVerificationCaseForAudit({
            case_id: input.case_summary.case_id,
            status: input.case_summary.status,
            source_reference: input.case_summary.source_reference,
            has_subject: Boolean(input.case_summary.subject_reference),
          })
        : null,
    },
  };
  auditLog.push(event);
  return event;
}

export function listVerificationAuditEvents(organizationId: string): readonly VerificationAuditEvent[] {
  return auditLog.filter((entry) => entry.organization_id === organizationId);
}

export function resetVerificationAuditLogForTests(): void {
  auditLog.length = 0;
}

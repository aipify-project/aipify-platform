import { sanitizeSupportCaseForAudit } from "@/lib/integration-intelligence/support/masking";
import type { SupportCaseSummary, SupportQueueSummary } from "@/lib/integration-intelligence/support/types";

export type SupportAuditEvent = {
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

const auditLog: SupportAuditEvent[] = [];

export function createSupportAuditEvent(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  case_id?: string | null;
  provider_key: string;
  case_summary?: SupportCaseSummary | null;
  queue?: SupportQueueSummary | null;
}): SupportAuditEvent {
  const event: SupportAuditEvent = {
    audit_id: `support-audit-${auditLog.length + 1}`,
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.capability_key,
    outcome: input.outcome,
    case_id: input.case_id ?? null,
    provider_key: input.provider_key,
    created_at: new Date().toISOString(),
    payload: {
      queue_open: input.queue?.total_open ?? null,
      case: input.case_summary
        ? sanitizeSupportCaseForAudit({
            case_id: input.case_summary.case_id,
            status: input.case_summary.status,
            source_reference: input.case_summary.source_reference,
            has_customer: Boolean(input.case_summary.customer_reference),
          })
        : null,
    },
  };
  auditLog.push(event);
  return event;
}

export function listSupportAuditEvents(organizationId: string): readonly SupportAuditEvent[] {
  return auditLog.filter((entry) => entry.organization_id === organizationId);
}

export function resetSupportAuditLogForTests(): void {
  auditLog.length = 0;
}

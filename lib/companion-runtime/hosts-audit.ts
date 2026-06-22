import { sanitizeHostsEntityForAudit } from "@/lib/integration-intelligence/hosts/masking";
import type { HostFinanceSummary, HostOperationsSummary } from "@/lib/integration-intelligence/hosts/types";

export type HostsAuditEvent = {
  audit_id: string;
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  entity_id: string | null;
  provider_key: string;
  created_at: string;
  payload: Record<string, unknown>;
};

const auditLog: HostsAuditEvent[] = [];

export function createHostsAuditEvent(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  entity_id?: string | null;
  provider_key: string;
  operations?: HostOperationsSummary | null;
  finance?: HostFinanceSummary | null;
}): HostsAuditEvent {
  const event: HostsAuditEvent = {
    audit_id: `hosts-audit-${auditLog.length + 1}`,
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.capability_key,
    outcome: input.outcome,
    entity_id: input.entity_id ?? null,
    provider_key: input.provider_key,
    created_at: new Date().toISOString(),
    payload: {
      arrivals: input.operations?.upcoming_arrivals ?? null,
      departures: input.operations?.upcoming_departures ?? null,
      revenue_booked: input.finance?.revenue.booked_amount ?? null,
      forecast_expected: input.finance?.forecast.expected_revenue ?? null,
      entity: input.entity_id
        ? sanitizeHostsEntityForAudit({
            entity_type: "reservation",
            entity_id: input.entity_id,
            source_reference: input.provider_key,
            has_guest: true,
          })
        : null,
    },
  };
  auditLog.push(event);
  return event;
}

export function listHostsAuditEvents(organizationId: string): readonly HostsAuditEvent[] {
  return auditLog.filter((entry) => entry.organization_id === organizationId);
}

export function resetHostsAuditLogForTests(): void {
  auditLog.length = 0;
}

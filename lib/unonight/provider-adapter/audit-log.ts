export type UnonightProviderAdapterAuditEvent = {
  adapter: "unonight_community_adapter";
  organization_id: string | null;
  ok: boolean;
  activation_status: string;
  capability_count: number;
  record_count: number;
  fetched_at: string;
  reason_key: string | null;
};

const auditTrail: UnonightProviderAdapterAuditEvent[] = [];

export function recordUnonightProviderAdapterAudit(
  event: UnonightProviderAdapterAuditEvent,
): string {
  auditTrail.push(event);
  if (auditTrail.length > 200) {
    auditTrail.shift();
  }
  return `unonight-adapter:${event.fetched_at}:${event.record_count}`;
}

export function listUnonightProviderAdapterAuditTrail(): readonly UnonightProviderAdapterAuditEvent[] {
  return auditTrail;
}

export function clearUnonightProviderAdapterAuditTrailForTests(): void {
  auditTrail.length = 0;
}

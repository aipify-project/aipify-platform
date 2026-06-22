import { sanitizeBookingForAudit } from "@/lib/integration-intelligence/booking/masking";
import type { BookingSummary } from "@/lib/integration-intelligence/booking/types";

export type BookingAuditEvent = {
  audit_id: string;
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  booking_id: string | null;
  provider_key: string;
  created_at: string;
  payload: Record<string, unknown>;
};

const auditLog: BookingAuditEvent[] = [];

export function createBookingAuditEvent(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  capability_key: string;
  outcome: string;
  booking_id?: string | null;
  provider_key: string;
  booking?: BookingSummary | null;
  metadata?: Record<string, unknown>;
}): BookingAuditEvent {
  const event: BookingAuditEvent = {
    audit_id: `booking-audit-${auditLog.length + 1}`,
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.capability_key,
    outcome: input.outcome,
    booking_id: input.booking_id ?? null,
    provider_key: input.provider_key,
    created_at: new Date().toISOString(),
    payload: {
      ...(input.metadata ?? {}),
      booking: input.booking
        ? sanitizeBookingForAudit({
            booking_id: input.booking.booking_id,
            status: input.booking.status,
            source_reference: input.booking.source_reference,
            has_customer: Boolean(input.booking.customer_reference),
          })
        : null,
    },
  };
  auditLog.push(event);
  return event;
}

export function listBookingAuditEvents(organizationId: string): readonly BookingAuditEvent[] {
  return auditLog.filter((entry) => entry.organization_id === organizationId);
}

export function resetBookingAuditLogForTests(): void {
  auditLog.length = 0;
}

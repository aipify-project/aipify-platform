import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

export type BookingCapabilityKey =
  | "service.read"
  | "employee.read"
  | "availability.read"
  | "schedule.read"
  | "booking.read"
  | "absence.read"
  | "vacation_mode.read"
  | "post_vacation_availability.read"
  | "booking.create"
  | "booking.update"
  | "booking.cancel";

export type BookingCapabilityOperation = "read" | "write";

export type NormalizedBookingStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending"
  | "blocked";

export type AvailabilitySlotStatus = "available" | "busy" | "blocked" | "unknown";

export type BookingReadiness =
  | "production_ready"
  | "production_ready_candidate"
  | "connected"
  | "connected_but_partial"
  | "source_missing"
  | "adapter_missing"
  | "specification_only"
  | "disabled"
  | "blocked_by_governance";

export type BookingFreshness = "fresh" | "stale" | "unknown";
export type BookingCompleteness = "complete" | "partial" | "empty";

export type ServiceSummary = {
  service_id: string;
  name: string;
  duration_minutes: number | null;
  buffer_before: number | null;
  buffer_after: number | null;
  price_summary: string | null;
  required_resource_type: string | null;
  location: string | null;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type EmployeeResourceSummary = {
  resource_id: string;
  display_name: string | null;
  resource_type: "employee" | "resource" | "unknown";
  location: string | null;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type AvailabilitySlot = {
  resource_id: string;
  start_at: string;
  end_at: string;
  timezone: string;
  service_id: string | null;
  location_id: string | null;
  availability_status: AvailabilitySlotStatus;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type BookingSummary = {
  booking_id: string;
  service_id: string | null;
  resource_id: string | null;
  customer_reference: string;
  start_at: string | null;
  end_at: string | null;
  status: NormalizedBookingStatus;
  location: string | null;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type AbsenceSummary = {
  absence_id: string;
  resource_id: string | null;
  start_at: string | null;
  end_at: string | null;
  absence_type: string | null;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type VacationModeSummary = {
  vacation_id: string;
  resource_id: string | null;
  scope: "employee" | "department" | "organization" | "unknown";
  start_at: string | null;
  end_at: string | null;
  return_at: string | null;
  post_vacation_available_from: string | null;
  source_reference: string;
  freshness: BookingFreshness;
  completeness: BookingCompleteness;
};

export type BookingReadOutcome =
  | "exact_match"
  | "multiple_matches"
  | "no_match"
  | "permission_denied"
  | "provider_missing"
  | "source_missing"
  | "activation_pending"
  | "partial_result"
  | "no_availability"
  | "conflict_detected"
  | "clarification_required";

export type BookingWriteOutcome =
  | "proposal_created"
  | "confirmation_required"
  | "execution_source_missing"
  | "approval_required"
  | "executed"
  | "failed"
  | "blocked_by_policy"
  | "permission_denied"
  | "provider_missing"
  | "activation_pending"
  | "conflict_detected"
  | "availability_changed";

export type BookingWriteRequest = {
  capability_key: Extract<BookingCapabilityKey, "booking.create" | "booking.update" | "booking.cancel">;
  service_id: string | null;
  resource_id: string | null;
  customer_reference: string | null;
  booking_id: string | null;
  start_at: string | null;
  end_at: string | null;
  confirmed: boolean;
  idempotency_key: string | null;
  action_request_id?: string | null;
};

export type BookingReadResult = {
  outcome: BookingReadOutcome;
  services: readonly ServiceSummary[];
  resources: readonly EmployeeResourceSummary[];
  availability_slots: readonly AvailabilitySlot[];
  bookings: readonly BookingSummary[];
  absences: readonly AbsenceSummary[];
  vacation_modes: readonly VacationModeSummary[];
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type BookingWriteProposal = {
  proposal_id: string | null;
  capability_key: BookingCapabilityKey;
  service_id: string | null;
  resource_id: string | null;
  customer_reference: string | null;
  start_at: string | null;
  end_at: string | null;
  requires_confirmation: true;
  requires_approval: boolean;
  idempotency_key: string | null;
  action_request_id: string | null;
  payload_hash: string | null;
  expires_at: string | null;
  idempotent_replay: boolean;
  limitations: readonly string[];
};

export type BookingWriteResult = {
  outcome: BookingWriteOutcome;
  proposal: BookingWriteProposal | null;
  booking: BookingSummary | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
  action_request_id: string | null;
  payload_hash: string | null;
  idempotency_key: string | null;
  expires_at: string | null;
  idempotent_replay: boolean;
};

export type BookingCapabilityManifest = {
  capability_key: BookingCapabilityKey;
  operation: BookingCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3 | 4;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
  semantic?: {
    domain: "services";
    entity: string;
    metrics?: readonly string[];
    operations?: readonly ("find" | "list" | "check" | "create" | "update" | "cancel")[];
    time_dimensions?: readonly ("date" | "time" | "duration" | "next_available")[];
    entity_aliases?: Partial<Record<CustomerActiveLocale | "en", readonly string[]>>;
    industry_terms?: readonly string[];
  };
};

export type BookingProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: string;
  implementation_status: "connected" | "partial" | "specification_only" | "placeholder";
  business_pack_key: string | null;
  industry_metadata?: readonly string[];
  capabilities: readonly BookingCapabilityManifest[];
};

export const BOOKING_BLOCKED_CAPABILITY_KEYS = [
  "booking.auto_create",
  "booking.auto_cancel",
  "booking.mass_cancel",
  "booking.delete",
] as const;

export type BookingBlockedCapabilityKey = (typeof BOOKING_BLOCKED_CAPABILITY_KEYS)[number];

export function isBookingCapabilityBlocked(capabilityKey: string): boolean {
  return (BOOKING_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

export function buildBookingCapabilityId(
  providerKey: string,
  capabilityKey: BookingCapabilityKey,
  operation: BookingCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

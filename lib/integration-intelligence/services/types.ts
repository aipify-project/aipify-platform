export type ServicesProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type ServicesCapabilityOperation = "read" | "write";

export type ServicesCapabilityKey =
  | "service.read"
  | "service.availability.read"
  | "appointment.read"
  | "appointment.create"
  | "appointment.update"
  | "work_order.read"
  | "work_order.create"
  | "work_order.assign"
  | "resource.read"
  | "customer.read"
  | "location.read"
  | "assignment.read"
  | "service_report.create";

/** Blocked in Companion runtime Phase 17 — never expose as enabled capabilities. */
export const SERVICES_BLOCKED_CAPABILITY_KEYS = [
  "appointment.cancel",
  "appointment.delete",
  "payment.execute",
  "payment.refund",
  "refund.execute",
  "work_order.delete",
  "work_order.cancel",
  "service.delete",
  "customer.delete",
] as const;

export type ServicesBlockedCapabilityKey = (typeof SERVICES_BLOCKED_CAPABILITY_KEYS)[number];

export type ServicesCapabilityManifest = {
  capability_key: ServicesCapabilityKey;
  operation: ServicesCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type ServicesProviderSourceEngine =
  | "appointment_booking"
  | "workforce_scheduling"
  | "absence_vacation_coverage"
  | "execution_operations"
  | "companion_real_world_coordination"
  | "service_network"
  | "service_intake";

export type ServicesProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: ServicesProviderSourceEngine;
  implementation_status: ServicesProviderImplementationStatus;
  capabilities: readonly ServicesCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export function buildServicesCapabilityId(
  providerKey: string,
  capabilityKey: ServicesCapabilityKey,
  operation: ServicesCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isServicesCapabilityBlocked(capabilityKey: string): boolean {
  return (SERVICES_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

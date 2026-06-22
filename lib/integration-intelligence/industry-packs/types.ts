export type IndustryPackProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type IndustryPackCapabilityOperation = "read" | "write";

export type IndustryPackCapabilityKey =
  | "service.read"
  | "treatment.read"
  | "staff.read"
  | "availability.read"
  | "appointment.read"
  | "customer.read"
  | "product.read"
  | "inventory.read"
  | "appointment.create"
  | "appointment.update"
  | "reminder.create"
  | "follow_up.create";

/** Blocked in Companion runtime Phase 19 — never expose as enabled capabilities. */
export const INDUSTRY_PACK_BLOCKED_CAPABILITY_KEYS = [
  "appointment.cancel",
  "appointment.delete",
  "payment.execute",
  "payment.refund",
  "refund.execute",
  "customer.delete",
  "product.delete",
  "service.delete",
] as const;

export type IndustryPackBlockedCapabilityKey =
  (typeof INDUSTRY_PACK_BLOCKED_CAPABILITY_KEYS)[number];

export type IndustryPackCapabilityManifest = {
  capability_key: IndustryPackCapabilityKey;
  operation: IndustryPackCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type IndustryPackProviderSourceEngine =
  | "appointment_booking"
  | "workforce_scheduling"
  | "absence_vacation_coverage"
  | "service_inventory"
  | "companion_follow_up"
  | "industry_pack_adapter";

export type IndustryPackProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: IndustryPackProviderSourceEngine;
  implementation_status: IndustryPackProviderImplementationStatus;
  capabilities: readonly IndustryPackCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
  industry_blueprint_slug: string | null;
};

export function buildIndustryPackCapabilityId(
  providerKey: string,
  capabilityKey: IndustryPackCapabilityKey,
  operation: IndustryPackCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isIndustryPackCapabilityBlocked(capabilityKey: string): boolean {
  return (INDUSTRY_PACK_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(
    capabilityKey,
  );
}

export type HostsProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type HostsCapabilityOperation = "read" | "write";

export type HostsCapabilityKey =
  | "property.read"
  | "reservation.read"
  | "availability.read"
  | "guest.read"
  | "cleaning.read"
  | "maintenance.read"
  | "payout.read"
  | "revenue.read"
  | "expense.read"
  | "forecast.read"
  | "report.export"
  | "message.draft";

/** Blocked in Companion runtime Phase 20 — never expose as enabled capabilities. */
export const HOSTS_BLOCKED_CAPABILITY_KEYS = [
  "reservation.delete",
  "reservation.cancel",
  "payment.execute",
  "payment.refund",
  "refund.execute",
  "message.send",
  "property.delete",
  "guest.delete",
  "payout.execute",
] as const;

export type HostsBlockedCapabilityKey = (typeof HOSTS_BLOCKED_CAPABILITY_KEYS)[number];

export type HostsCapabilityManifest = {
  capability_key: HostsCapabilityKey;
  operation: HostsCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type HostsProviderSourceEngine =
  | "property_center"
  | "booking_center"
  | "guest_center"
  | "calendar_center"
  | "operations_center"
  | "finance_center"
  | "communication_center"
  | "reports_center"
  | "access_center"
  | "hosts_pack_adapter";

export type HostsProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: HostsProviderSourceEngine;
  implementation_status: HostsProviderImplementationStatus;
  capabilities: readonly HostsCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const HOSTS_BUSINESS_PACK_KEYS = [
  "aipify_hosts",
  "hosts",
  "hosts_pack",
  "hospitality",
] as const;

export function isHostsBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (HOSTS_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildHostsCapabilityId(
  providerKey: string,
  capabilityKey: HostsCapabilityKey,
  operation: HostsCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isHostsCapabilityBlocked(capabilityKey: string): boolean {
  return (HOSTS_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

export type CommerceProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type CommerceCapabilityOperation = "read" | "write";

export type CommerceCapabilityKey =
  | "product.read"
  | "product.create"
  | "product.update"
  | "product.import"
  | "inventory.read"
  | "order.read"
  | "customer.read"
  | "category.read"
  | "content.read"
  | "content.generate"
  | "translation.generate"
  | "seo.generate"
  | "storefront.publish"
  | "store.read"
  | "store.create"
  | "margin.read"
  | "trend.read";

/** Blocked in Companion runtime Phase 16 — never expose as enabled capabilities. */
export const COMMERCE_BLOCKED_CAPABILITY_KEYS = [
  "payment.execute",
  "payment.refund",
  "refund.execute",
  "order.cancel",
  "order.delete",
  "product.delete",
  "customer.delete",
] as const;

export type CommerceBlockedCapabilityKey = (typeof COMMERCE_BLOCKED_CAPABILITY_KEYS)[number];

export type CommerceCapabilityManifest = {
  capability_key: CommerceCapabilityKey;
  operation: CommerceCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type CommerceProviderSourceEngine =
  | "commerce_retail_operations_pack"
  | "commerce_intelligence"
  | "product_automation"
  | "multi_store_orchestration"
  | "app_portal_integration";

export type CommerceProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: CommerceProviderSourceEngine;
  implementation_status: CommerceProviderImplementationStatus;
  capabilities: readonly CommerceCapabilityManifest[];
  search_terms_key: string;
};

export function buildCommerceCapabilityId(
  providerKey: string,
  capabilityKey: CommerceCapabilityKey,
  operation: CommerceCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isCommerceCapabilityBlocked(capabilityKey: string): boolean {
  return (COMMERCE_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

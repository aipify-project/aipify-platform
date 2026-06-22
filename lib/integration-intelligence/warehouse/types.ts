export type WarehouseProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type WarehouseCapabilityOperation = "read" | "write";

export type WarehouseCapabilityKey =
  | "warehouse.read"
  | "inventory.read"
  | "stock.read"
  | "location.read"
  | "item.read"
  | "supplier.read"
  | "purchase_order.read"
  | "goods_receipt.read"
  | "pick_order.read"
  | "shipment.read"
  | "transfer.read"
  | "replenishment.read"
  | "stock_alert.read"
  | "inventory_adjustment.create"
  | "transfer.create"
  | "pick_order.create";

/** Blocked in Companion runtime Phase 22 — never expose as enabled capabilities. */
export const WAREHOUSE_BLOCKED_CAPABILITY_KEYS = [
  "stock.delete",
  "inventory.delete",
  "inventory_adjustment.irreversible",
  "supplier.payment",
  "shipment.cancel",
  "bulk.destructive",
  "financial.posting",
  "financial.post",
  "payment.execute",
] as const;

export type WarehouseBlockedCapabilityKey = (typeof WAREHOUSE_BLOCKED_CAPABILITY_KEYS)[number];

export type WarehouseCapabilityManifest = {
  capability_key: WarehouseCapabilityKey;
  operation: WarehouseCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type WarehouseProviderSourceEngine =
  | "service_inventory"
  | "inventory_operations"
  | "warehouse_fulfillment"
  | "logistics_fleet"
  | "warehouse_pack_adapter";

export type WarehouseProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: WarehouseProviderSourceEngine;
  implementation_status: WarehouseProviderImplementationStatus;
  capabilities: readonly WarehouseCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const WAREHOUSE_BUSINESS_PACK_KEYS = [
  "warehouse_pack",
  "inventory_pack",
  "warehouse",
  "inventory",
] as const;

export function isWarehouseBusinessPackActive(
  activeBusinessPacks: readonly string[],
): boolean {
  return activeBusinessPacks.some((pack) =>
    (WAREHOUSE_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildWarehouseCapabilityId(
  providerKey: string,
  capabilityKey: WarehouseCapabilityKey,
  operation: WarehouseCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isWarehouseCapabilityBlocked(capabilityKey: string): boolean {
  return (WAREHOUSE_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}

import type { WarehouseProviderManifest } from "./types";

const WAREHOUSE_PACK = "warehouse_pack";
const INVENTORY_VIEW = "inventory.view";
const INVENTORY_MANAGE = "inventory.manage";

function readCapability(
  capability_key: WarehouseProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = INVENTORY_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

function writeCapability(
  capability_key: WarehouseProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = INVENTORY_MANAGE,
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: false,
  };
}

/** Warehouse / Inventory Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const WAREHOUSE_PROVIDER_MANIFESTS: readonly WarehouseProviderManifest[] = [
  {
    provider_key: "inventory_stock_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.warehouse.providers.inventory_stock_center",
    source_engine: "service_inventory",
    implementation_status: "connected",
    business_pack_key: WAREHOUSE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.warehouse.searchTerms.inventory_stock_center",
    capabilities: [
      readCapability("inventory.read", "inventory"),
      readCapability("stock.read", "stock"),
      readCapability("location.read", "location"),
      readCapability("item.read", "item"),
      readCapability("supplier.read", "supplier", INVENTORY_VIEW, true),
      readCapability("purchase_order.read", "purchase_order"),
      readCapability("goods_receipt.read", "goods_receipt"),
      readCapability("transfer.read", "transfer"),
      readCapability("replenishment.read", "replenishment"),
      readCapability("stock_alert.read", "stock_alert"),
      writeCapability("inventory_adjustment.create", "inventory_adjustment"),
    ],
  },
  {
    provider_key: "warehouse_control",
    display_name_key:
      "customerApp.companionPlatformKnowledge.warehouse.providers.warehouse_control",
    source_engine: "inventory_operations",
    implementation_status: "partial",
    business_pack_key: WAREHOUSE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.warehouse.searchTerms.warehouse_control",
    capabilities: [
      readCapability("warehouse.read", "warehouse"),
      readCapability("inventory.read", "inventory"),
      readCapability("stock.read", "stock"),
      readCapability("location.read", "location"),
      readCapability("item.read", "item"),
      writeCapability("transfer.create", "transfer"),
    ],
  },
  {
    provider_key: "warehouse_fulfillment",
    display_name_key:
      "customerApp.companionPlatformKnowledge.warehouse.providers.warehouse_fulfillment",
    source_engine: "warehouse_fulfillment",
    implementation_status: "placeholder",
    business_pack_key: WAREHOUSE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.warehouse.searchTerms.warehouse_fulfillment",
    capabilities: [
      readCapability("pick_order.read", "pick_order"),
      writeCapability("pick_order.create", "pick_order"),
    ],
  },
  {
    provider_key: "warehouse_logistics",
    display_name_key:
      "customerApp.companionPlatformKnowledge.warehouse.providers.warehouse_logistics",
    source_engine: "logistics_fleet",
    implementation_status: "partial",
    business_pack_key: WAREHOUSE_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.warehouse.searchTerms.warehouse_logistics",
    capabilities: [readCapability("shipment.read", "shipment")],
  },
  {
    provider_key: "warehouse_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.warehouse.providers.warehouse_pack_adapter",
    source_engine: "warehouse_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.warehouse.searchTerms.warehouse_pack_adapter",
    capabilities: [readCapability("warehouse.read", "warehouse")],
  },
];

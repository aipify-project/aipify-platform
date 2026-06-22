import type {
  WarehouseProviderImplementationStatus,
  WarehouseProviderManifest,
} from "@/lib/integration-intelligence/warehouse/types";
import {
  buildWarehouseCapabilityId,
  isWarehouseCapabilityBlocked,
} from "@/lib/integration-intelligence/warehouse/types";

export type WarehouseProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: WarehouseProviderImplementationStatus;
  service_inventory_enabled: boolean;
  inventory_operations_enabled: boolean;
  warehouse_fulfillment_enabled: boolean;
  logistics_fleet_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type WarehouseCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read" | "write";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: WarehouseProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type WarehouseCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionWarehouseContext = {
  service_inventory_enabled: boolean;
  inventory_operations_enabled: boolean;
  warehouse_fulfillment_enabled: boolean;
  logistics_fleet_enabled: boolean;
  stock_deletion_blocked: boolean;
  irreversible_adjustment_blocked: boolean;
  supplier_payment_blocked: boolean;
  shipment_cancellation_blocked: boolean;
  destructive_bulk_blocked: boolean;
  financial_posting_blocked: boolean;
  warehouse_scope_active: boolean;
  location_scope_active: boolean;
  role_filter_active: boolean;
  supplier_privacy_filtered: boolean;
  least_privilege_enforced: boolean;
  low_stock_count: number | null;
  pending_receiving_count: number | null;
  active_transfers_count: number | null;
  open_stock_counts_count: number | null;
  pending_replenishment_count: number | null;
  command_brief_signals: WarehouseCommandBriefSignal[];
  command_brief_events_linked: boolean;
  providers: WarehouseProviderRuntimeStatus[];
  capabilities: WarehouseCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_inventory: string;
  cross_link_locations: string;
  cross_link_receiving: string;
  cross_link_transfers: string;
  cross_link_logistics: string;
};

export function createEmptyCompanionWarehouseContext(
  overrides?: Partial<CompanionWarehouseContext>,
): CompanionWarehouseContext {
  return {
    service_inventory_enabled: false,
    inventory_operations_enabled: false,
    warehouse_fulfillment_enabled: false,
    logistics_fleet_enabled: false,
    stock_deletion_blocked: true,
    irreversible_adjustment_blocked: true,
    supplier_payment_blocked: true,
    shipment_cancellation_blocked: true,
    destructive_bulk_blocked: true,
    financial_posting_blocked: true,
    warehouse_scope_active: true,
    location_scope_active: true,
    role_filter_active: true,
    supplier_privacy_filtered: true,
    least_privilege_enforced: true,
    low_stock_count: null,
    pending_receiving_count: null,
    active_transfers_count: null,
    open_stock_counts_count: null,
    pending_replenishment_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_inventory: "/app/inventory",
    cross_link_locations: "/app/inventory/locations",
    cross_link_receiving: "/app/inventory/receiving",
    cross_link_transfers: "/app/inventory/transfers",
    cross_link_logistics: "/app/logistics",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: WarehouseProviderManifest,
  providerStatus: WarehouseProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "service_inventory":
      return providerStatus.service_inventory_enabled;
    case "inventory_operations":
      return providerStatus.inventory_operations_enabled;
    case "warehouse_fulfillment":
      return providerStatus.warehouse_fulfillment_enabled;
    case "logistics_fleet":
      return providerStatus.logistics_fleet_enabled;
    case "warehouse_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildWarehouseCapabilityRuntimeRef(input: {
  manifest: WarehouseProviderManifest;
  providerStatus: WarehouseProviderRuntimeStatus;
  capability: WarehouseProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): WarehouseCapabilityRuntimeRef | null {
  if (isWarehouseCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildWarehouseCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const enabled =
    engineEnabled &&
    packOk &&
    input.providerStatus.entitlement_active &&
    input.hasPermission &&
    input.providerStatus.implementation_status !== "placeholder" &&
    (input.capability.operation === "read"
      ? true
      : input.capability.approval_required &&
        input.capability.reversible &&
        input.capability.risk_level <= 2);

  return {
    capability_id: capabilityId,
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available && input.providerStatus.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.providerStatus.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function filterWarehouseCapabilitiesForPrivacy(
  context: CompanionWarehouseContext,
): WarehouseCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledWarehouseCapabilities(
  context: CompanionWarehouseContext,
): WarehouseCapabilityRuntimeRef[] {
  return filterWarehouseCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findWarehouseProviderStatus(
  context: CompanionWarehouseContext,
  providerKey: string,
): WarehouseProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}

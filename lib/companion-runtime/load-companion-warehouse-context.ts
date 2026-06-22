import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listWarehouseProviderManifests } from "@/lib/integration-intelligence/warehouse/registry";
import type { WarehouseProviderImplementationStatus } from "@/lib/integration-intelligence/warehouse/types";
import { isWarehouseBusinessPackActive } from "@/lib/integration-intelligence/warehouse/types";
import {
  buildWarehouseCapabilityRuntimeRef,
  createEmptyCompanionWarehouseContext,
  type CompanionWarehouseContext,
  type WarehouseCommandBriefSignal,
  type WarehouseProviderRuntimeStatus,
} from "./companion-warehouse-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: WarehouseProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): WarehouseProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    service_inventory_enabled: input.engineEnabled,
    inventory_operations_enabled: input.engineEnabled,
    warehouse_fulfillment_enabled: false,
    logistics_fleet_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    serviceInventory: boolean;
    inventoryOperations: boolean;
    logisticsFleet: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "inventory_stock_center":
      return flags.serviceInventory;
    case "warehouse_control":
      return flags.inventoryOperations;
    case "warehouse_fulfillment":
      return false;
    case "warehouse_logistics":
      return flags.logisticsFleet;
    case "warehouse_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractWarehouseOperationalSignals(input: {
  inventoryCenterData: unknown;
  inventoryOpsContext: unknown;
  inventorySummary: unknown;
}): {
  low_stock_count: number | null;
  pending_receiving_count: number | null;
  active_transfers_count: number | null;
  open_stock_counts_count: number | null;
  pending_replenishment_count: number | null;
  command_brief_signals: WarehouseCommandBriefSignal[];
} {
  const center =
    input.inventoryCenterData && typeof input.inventoryCenterData === "object"
      ? (input.inventoryCenterData as Record<string, unknown>)
      : {};
  const overview =
    center.overview && typeof center.overview === "object"
      ? (center.overview as Record<string, unknown>)
      : {};
  const opsContext =
    input.inventoryOpsContext && typeof input.inventoryOpsContext === "object"
      ? (input.inventoryOpsContext as Record<string, unknown>)
      : {};
  const summary =
    input.inventorySummary && typeof input.inventorySummary === "object"
      ? (input.inventorySummary as Record<string, unknown>)
      : {};

  const lowStockCount =
    readCount(overview.low_stock_count) ?? readCount(opsContext.low_stock_count);
  const pendingReceiving =
    readCount(overview.pending_receiving) ??
    readCount(summary.pending_receiving);
  const activeTransfers =
    readCount(overview.active_transfers) ?? readCount(summary.active_transfers);
  const openStockCounts = readCount(overview.open_stock_counts);
  const pendingPurchaseRequests = readCount(overview.pending_purchase_requests);

  const pendingReorders = Array.isArray(opsContext.pending_reorders)
    ? opsContext.pending_reorders.length
    : null;

  const signals: WarehouseCommandBriefSignal[] = [];
  if (lowStockCount !== null && lowStockCount > 0) {
    signals.push({ signal_key: "low_stock", count: lowStockCount });
  }
  if (pendingReceiving !== null && pendingReceiving > 0) {
    signals.push({ signal_key: "delayed_receipt", count: pendingReceiving });
  }
  if (activeTransfers !== null && activeTransfers > 0) {
    signals.push({ signal_key: "transfer_in_progress", count: activeTransfers });
  }
  if (openStockCounts !== null && openStockCounts > 0) {
    signals.push({ signal_key: "inventory_discrepancy", count: openStockCounts });
  }
  const replenishmentCount = pendingPurchaseRequests ?? pendingReorders;
  if (replenishmentCount !== null && replenishmentCount > 0) {
    signals.push({ signal_key: "replenishment_required", count: replenishmentCount });
  }

  return {
    low_stock_count: lowStockCount,
    pending_receiving_count: pendingReceiving,
    active_transfers_count: activeTransfers,
    open_stock_counts_count: openStockCounts,
    pending_replenishment_count: replenishmentCount,
    command_brief_signals: signals,
  };
}

export async function loadCompanionWarehouseContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionWarehouseContext> {
  const businessPackActive = isWarehouseBusinessPackActive(input.activeBusinessPacks);

  const [
    inventoryCenterResult,
    inventoryOpsCenterResult,
    inventoryOpsContextResult,
    inventorySummaryResult,
    logisticsCenterResult,
  ] = await Promise.all([
    supabase.rpc("get_organization_inventory_center", { p_section: "overview" }),
    supabase.rpc("get_inventory_operations_center", { p_section: null }),
    supabase.rpc("get_companion_inventory_operations_context"),
    supabase.rpc("get_my_inventory_operations_summary"),
    supabase.rpc("get_logistics_transportation_fleet_operations_center"),
  ]);

  const permissionDenied = [inventoryCenterResult, inventoryOpsCenterResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionWarehouseContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const serviceInventoryEnabled = rpcEnabled(inventoryCenterResult.data);
  const inventoryOperationsEnabled = rpcEnabled(inventoryOpsCenterResult.data);
  const logisticsFleetEnabled = rpcEnabled(logisticsCenterResult.data);

  const operationalSignals = extractWarehouseOperationalSignals({
    inventoryCenterData: inventoryCenterResult.data,
    inventoryOpsContext: inventoryOpsContextResult.data,
    inventorySummary: inventorySummaryResult.data,
  });

  const engineFlags = {
    serviceInventory: serviceInventoryEnabled,
    inventoryOperations: inventoryOperationsEnabled,
    logisticsFleet: logisticsFleetEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: WarehouseProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listWarehouseProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.service_inventory_enabled =
      engineFlags.serviceInventory && manifest.source_engine === "service_inventory";
    providerStatus.inventory_operations_enabled =
      engineFlags.inventoryOperations && manifest.source_engine === "inventory_operations";
    providerStatus.warehouse_fulfillment_enabled = false;
    providerStatus.logistics_fleet_enabled =
      engineFlags.logisticsFleet && manifest.source_engine === "logistics_fleet";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildWarehouseCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionWarehouseContext({
    service_inventory_enabled: serviceInventoryEnabled,
    inventory_operations_enabled: inventoryOperationsEnabled,
    warehouse_fulfillment_enabled: false,
    logistics_fleet_enabled: logisticsFleetEnabled,
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
    low_stock_count: operationalSignals.low_stock_count,
    pending_receiving_count: operationalSignals.pending_receiving_count,
    active_transfers_count: operationalSignals.active_transfers_count,
    open_stock_counts_count: operationalSignals.open_stock_counts_count,
    pending_replenishment_count: operationalSignals.pending_replenishment_count,
    command_brief_signals: operationalSignals.command_brief_signals,
    command_brief_events_linked:
      operationalSignals.command_brief_signals.length > 0 &&
      (businessPackActive || anyEngineEnabled),
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}

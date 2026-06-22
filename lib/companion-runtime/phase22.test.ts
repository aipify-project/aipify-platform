import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listWarehouseProviderManifests } from "@/lib/integration-intelligence/warehouse/registry";
import {
  buildWarehouseCapabilityId,
  WAREHOUSE_BLOCKED_CAPABILITY_KEYS,
  WAREHOUSE_BUSINESS_PACK_KEYS,
  isWarehouseBusinessPackActive,
  isWarehouseCapabilityBlocked,
} from "@/lib/integration-intelligence/warehouse/types";
import {
  buildWarehouseActionDefinitions,
  buildWarehouseReadToolDefinitions,
  buildWarehouseSchemaEntities,
  mapWarehouseCapabilitiesToRefs,
  mergeWarehouseCapabilities,
} from "./merge-warehouse-runtime";
import {
  createEmptyCompanionWarehouseContext,
  filterWarehouseCapabilitiesForPrivacy,
  listEnabledWarehouseCapabilities,
} from "./companion-warehouse-context";
import {
  buildBlockedWarehouseOperationAnswer,
  buildExternalWarehouseUnavailableAnswer,
  buildWarehouseProviderDiscoveryAnswer,
  hasBlockedWarehouseOperationIntent,
  hasWarehouseProviderIntent,
  matchWarehouseProviderQuery,
} from "./warehouse-answer";
import { buildActionDefinitionFromWarehouseCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listWarehouseProviderManifests();
assert.ok(manifests.length >= 5);

for (const blocked of WAREHOUSE_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isWarehouseCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isWarehouseBusinessPackActive(["warehouse_pack"]), true);
assert.equal(isWarehouseBusinessPackActive(["inventory_pack"]), true);
assert.equal(isWarehouseBusinessPackActive(["hr_pack"]), false);
assert.ok(WAREHOUSE_BUSINESS_PACK_KEYS.includes("warehouse_pack"));

const inventoryCenter = manifests.find(
  (manifest) => manifest.provider_key === "inventory_stock_center",
);
assert.ok(inventoryCenter);
assert.equal(inventoryCenter?.business_pack_key, "warehouse_pack");

const requiredReadCapabilities = [
  "warehouse.read",
  "inventory.read",
  "stock.read",
  "location.read",
  "item.read",
  "supplier.read",
  "purchase_order.read",
  "goods_receipt.read",
  "pick_order.read",
  "shipment.read",
  "transfer.read",
  "replenishment.read",
  "stock_alert.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const requiredWriteCapabilities = [
  "inventory_adjustment.create",
  "transfer.create",
  "pick_order.create",
] as const;

for (const capabilityKey of requiredWriteCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const warehouseContext = createEmptyCompanionWarehouseContext({
  service_inventory_enabled: true,
  inventory_operations_enabled: true,
  logistics_fleet_enabled: true,
  warehouse_scope_active: true,
  location_scope_active: true,
  role_filter_active: true,
  supplier_privacy_filtered: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "low_stock", count: 3 },
    { signal_key: "replenishment_required", count: 2 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    service_inventory_enabled: manifest.source_engine === "service_inventory",
    inventory_operations_enabled: manifest.source_engine === "inventory_operations",
    warehouse_fulfillment_enabled: false,
    logistics_fleet_enabled: manifest.source_engine === "logistics_fleet",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active:
      manifest.business_pack_key === "warehouse_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildWarehouseCapabilityId(
        manifest.provider_key,
        capability.capability_key,
        capability.operation,
      ),
      provider_key: manifest.provider_key,
      capability_key: capability.capability_key,
      operation: capability.operation,
      entity: capability.entity,
      adapter_available: false,
      approval_required: capability.approval_required,
      reversible: capability.reversible,
      risk_level: capability.risk_level,
      required_permission: capability.required_permission,
      runtime_status: manifest.implementation_status,
      privacy_sensitive: capability.privacy_sensitive,
      enabled:
        (!capability.required_permission || capability.required_permission === "inventory.view") &&
        (capability.operation === "read" || capability.approval_required) &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapWarehouseCapabilitiesToRefs(warehouseContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "warehouse_provider"));

const mergedCapabilities = mergeWarehouseCapabilities([], warehouseContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildWarehouseSchemaEntities(warehouseContext, [
  "inventory.view",
  "inventory.manage",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildWarehouseReadToolDefinitions({
  warehouseContext,
  effectivePermissions: ["inventory.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const transferCreate = warehouseContext.capabilities.find(
  (capability) =>
    capability.capability_key === "transfer.create" &&
    capability.provider_key === "warehouse_control",
);
assert.ok(transferCreate);

const transferDefinition = buildActionDefinitionFromWarehouseCapability(transferCreate!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(transferDefinition);
assert.equal(transferDefinition?.source, "warehouse_provider");
assert.equal(transferDefinition?.enabled, true);

const warehouseActions = buildWarehouseActionDefinitions({
  warehouseContext,
  effectivePermissions: ["inventory.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(warehouseActions.length > 0);
assert.ok(warehouseActions.every((action) => action.approval_required));

const privateCapabilities = filterWarehouseCapabilitiesForPrivacy({
  ...warehouseContext,
  capabilities: warehouseContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const permissionFiltered = buildWarehouseSchemaEntities(
  {
    ...warehouseContext,
    capabilities: warehouseContext.capabilities.map((capability) =>
      capability.required_permission === "inventory.manage"
        ? { ...capability, enabled: false }
        : capability,
    ),
  },
  ["inventory.view"],
);
assert.ok(
  permissionFiltered.some((entity) => entity.entity_key.includes("inventory_stock_center")),
);
assert.ok(
  permissionFiltered.every(
    (entity) => !entity.required_permissions.includes("inventory.manage"),
  ),
);

const enabled = listEnabledWarehouseCapabilities(warehouseContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ warehouseContext });
const match = matchWarehouseProviderQuery(
  "show inventory stock levels and low stock alerts",
  tenantContext,
);
assert.ok(match);
assert.equal(hasWarehouseProviderIntent("warehouse inventory stock supplier"), true);
assert.equal(
  hasBlockedWarehouseOperationIntent("delete stock permanently and pay supplier"),
  true,
);

const discovery = buildWarehouseProviderDiscoveryAnswer(match!, warehouseContext, t);
assert.ok(discovery.directAnswer.includes("warehouse.discoveryLead"));
assert.ok(discovery.explanation?.includes("warehouse.warehouseScopeActive"));
assert.ok(discovery.explanation?.includes("warehouse.commandBriefEventsLinked"));

const blocked = buildBlockedWarehouseOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("warehouse.blockedOperationLead"));

const externalUnavailable = buildExternalWarehouseUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("warehouse.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveWarehouseProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "airbnb", "frisør", "salon"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-warehouse-context.ts",
  "load-companion-warehouse-context.ts",
  "merge-warehouse-runtime.ts",
  "warehouse-answer.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenTerms) {
    assert.equal(new RegExp(`\\b${term}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"warehouse"'), locale);
}

console.log("phase22 companion runtime tests passed");

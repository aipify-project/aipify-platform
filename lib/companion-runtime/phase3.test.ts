import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  classifyBusinessPackLoadError,
  createEmptyCompanionBusinessPackCollection,
  hasActiveBusinessPackEntitlements,
  isCapabilityEntitled,
  normalizeCompanionBusinessPackCollection,
} from "./companion-business-pack-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import { hasApprovedInstallDiscovery } from "./discovery-answer";
import { ORG_KNOWLEDGE_MIN_RANK } from "./organization-knowledge";
import { isRegisteredLiveProvider } from "./provider-live-tools-shared";

const runtimeInstalled = {
  found: true,
  runtime_instances: [
    {
      pack_id: "operations_suite",
      runtime_status: "active",
      license_status: "active",
      installed_at: new Date().toISOString(),
    },
    {
      pack_id: "failed_pack",
      runtime_status: "active",
      license_status: "active",
      installed_at: new Date().toISOString(),
    },
  ],
};

const runtimePermissions = {
  found: true,
  capability_grants: [
    {
      pack_id: "operations_suite",
      capability_key: "inventory.read",
      grant_status: "active",
      manifest_ref: "provider.shopify",
      summary: "Read inventory metadata",
    },
    {
      pack_id: "operations_suite",
      capability_key: "inventory.write",
      grant_status: "active",
      manifest_ref: "provider.shopify",
      summary: "Write inventory metadata",
    },
    {
      pack_id: "operations_suite",
      capability_key: "billing.manage",
      grant_status: "active",
      manifest_ref: "",
      summary: "Manage billing",
    },
    {
      pack_id: "failed_pack",
      capability_key: "orders.read",
      grant_status: "active",
      manifest_ref: "",
      summary: "Read orders",
    },
  ],
};

const modulesCenter = {
  has_customer: true,
  installed_modules: [
    {
      module_key: "operations_suite.inventory",
      suite_key: "operations_suite",
      enabled: true,
      status: "enabled",
    },
    {
      module_key: "operations_suite.reporting",
      suite_key: "operations_suite",
      enabled: false,
      status: "disabled",
    },
  ],
};

const activeCollection = normalizeCompanionBusinessPackCollection({
  activeBusinessPacks: ["operations_suite", "failed_pack"],
  subscriptionStatus: "active",
  effectivePermissions: ["inventory.read"],
  gateItems: [{ pack_key: "failed_pack", activation_status: "activation_failed" }],
  runtimeInstalled,
  runtimePermissions,
  modulesCenter,
});

assert.equal(activeCollection.packs.length, 1);
assert.equal(activeCollection.packs[0]?.pack_key, "operations_suite");
assert.equal(activeCollection.enabledModules.length, 1);
assert.equal(activeCollection.entitledCapabilities.length, 1);
assert.equal(activeCollection.entitledCapabilities[0]?.capability_id, "inventory.read");
assert.equal(activeCollection.entitledCapabilities[0]?.access_mode, "read");
assert.equal(activeCollection.entitledCapabilities[0]?.pack_key, "operations_suite");

const suspendedApp = normalizeCompanionBusinessPackCollection({
  activeBusinessPacks: ["operations_suite"],
  subscriptionStatus: "cancelled",
  effectivePermissions: ["inventory.read"],
  gateItems: [],
  runtimeInstalled,
  runtimePermissions,
  modulesCenter,
});

assert.equal(suspendedApp.appEntitlementBlocked, true);
assert.equal(suspendedApp.packs.length, 0);
assert.equal(suspendedApp.entitledCapabilities.length, 0);

const pendingGate = normalizeCompanionBusinessPackCollection({
  activeBusinessPacks: ["operations_suite"],
  subscriptionStatus: "active",
  effectivePermissions: ["inventory.read", "billing.manage"],
  gateItems: [{ pack_key: "operations_suite", activation_status: "pending_activation" }],
  runtimeInstalled,
  runtimePermissions,
  modulesCenter,
});

assert.equal(pendingGate.packs.length, 0);

const emptyCollection = createEmptyCompanionBusinessPackCollection();
assert.equal(hasActiveBusinessPackEntitlements(emptyCollection), false);
assert.equal(isCapabilityEntitled(emptyCollection, "inventory.read"), false);

const permissionDenied = classifyBusinessPackLoadError("Permission denied for business pack runtime");
assert.equal(permissionDenied.permissionDenied, true);

const tenantDefaults = createEmptyCompanionTenantContext();
assert.ok(Array.isArray(tenantDefaults.businessPackContext.packs));
assert.ok(Array.isArray(tenantDefaults.entitledCapabilities));
assert.ok(Array.isArray(tenantDefaults.enabledModules));
assert.ok(tenantDefaults.discovery);

assert.equal(ORG_KNOWLEDGE_MIN_RANK, 0.08);
assert.equal(isRegisteredLiveProvider(PILOT_INTEGRATION_PROVIDER_KEY), true);
assert.equal(hasApprovedInstallDiscovery(createEmptyCompanionTenantContext().discovery), false);

const packContextSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/companion-business-pack-context.ts"),
  "utf8",
);
assertCoreSourceFreeOfCustomerPilotNames(packContextSource, "pack context");

const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), `locales/${locale}/customer-app/companionPlatformKnowledge.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    companionPlatformKnowledge: { packs: Record<string, string> };
  };
  assert.ok(parsed.companionPlatformKnowledge.packs.accessDenied, locale);
  assert.ok(parsed.companionPlatformKnowledge.packs.sourceLabel, locale);
}

console.log("phase3 companion runtime tests passed");

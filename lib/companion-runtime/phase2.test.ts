import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import {
  classifyDiscoveryLoadError,
  createEmptyCompanionDiscoveryContext,
  normalizeCompanionDiscoveryContext,
  resolveDiscoveryFreshness,
} from "./companion-discovery-context";
import { createEmptyCompanionTenantContext, resolveCompanionIntegrationContext } from "./companion-tenant-context";
import { hasApprovedInstallDiscovery } from "./discovery-answer";
import { isRegisteredLiveProvider } from "./provider-live-tools-shared";

const orgA = "11111111-1111-1111-1111-111111111111";
const orgB = "22222222-2222-2222-2222-222222222222";

const centerOrgA = {
  found: true,
  connected_systems: [
    {
      id: "sys-1",
      system_key: "shopify",
      system_name: "Shopify",
      connection_method: "oauth",
      auth_status: "authorized",
      sync_mode: "scheduled",
      sync_health: "healthy",
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sys-revoked",
      system_key: "legacy_erp",
      system_name: "Legacy ERP",
      connection_method: "api_connection",
      auth_status: "revoked",
      sync_mode: "manual",
      sync_health: "paused",
      updated_at: new Date().toISOString(),
    },
  ],
  discovery_results: [
    {
      id: "cap-1",
      discovery_type: "capability",
      entity_key: "inventory_sync",
      entity_label: "Inventory sync",
      status: "confirmed",
    },
    {
      id: "ent-rejected",
      discovery_type: "platform",
      entity_key: "ignored",
      entity_label: "Ignored",
      status: "rejected",
    },
  ],
  data_sources: [
    {
      id: "src-1",
      data_domain: "inventory",
      source_system_key: "shopify",
      source_system_name: "Shopify",
      connection_method: "oauth",
      status: "configured",
      updated_at: new Date().toISOString(),
    },
    {
      id: "src-pending",
      data_domain: "orders",
      source_system_key: "manual_setup",
      source_system_name: "Manual",
      connection_method: "manual_setup",
      status: "pending",
      updated_at: new Date().toISOString(),
    },
  ],
  reports: {
    missing_data_domains: ["customers"],
  },
};

const centerOrgB = {
  found: true,
  connected_systems: [
    {
      id: "sys-pilot-integration",
      system_key: PILOT_INTEGRATION_PROVIDER_KEY,
      system_name: "Pilot Integration",
      connection_method: "official_integration",
      auth_status: "authorized",
      sync_mode: "scheduled",
      sync_health: "healthy",
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  discovery_results: [],
  data_sources: [],
  reports: { missing_data_domains: [] },
};

const discoveryA = normalizeCompanionDiscoveryContext(
  { found: true, missing_data: ["customers"] },
  centerOrgA,
  orgA,
);
const discoveryB = normalizeCompanionDiscoveryContext(
  { found: true },
  centerOrgB,
  orgB,
);

assert.equal(discoveryA.discoveredSystems.length, 1);
assert.equal(discoveryA.discoveredSystems[0]?.systemKey, "shopify");
assert.equal(discoveryA.discoveredCapabilities.length, 1);
assert.equal(discoveryA.discoveredEntities.length, 0);
assert.equal(discoveryA.approvedSources.length, 1);
assert.equal(discoveryA.discoveryStatus, "partial");
assert.equal(discoveryA.unavailableDomains.includes("customers"), true);
assert.ok(hasApprovedInstallDiscovery(discoveryA));

assert.equal(discoveryB.discoveredSystems[0]?.systemKey, PILOT_INTEGRATION_PROVIDER_KEY);
assert.deepEqual(
  discoveryA.discoveredSystems.map((system) => system.systemKey),
  ["shopify"],
  "org A discovery must not include org B systems",
);
assert.notEqual(
  discoveryA.discoveredSystems[0]?.systemKey,
  discoveryB.discoveredSystems[0]?.systemKey,
);

const permissionDenied = classifyDiscoveryLoadError("Permission denied: install.view");
assert.equal(permissionDenied.discoveryStatus, "permission_denied");
assert.equal(permissionDenied.permissionDenied, true);

const emptyDiscovery = normalizeCompanionDiscoveryContext({ found: true }, { found: true }, orgA);
assert.equal(emptyDiscovery.discoveryStatus, "empty");
assert.equal(emptyDiscovery.discoveredSystems.length, 0);

const fresh = resolveDiscoveryFreshness(new Date().toISOString());
const stale = resolveDiscoveryFreshness(new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString());
assert.equal(fresh, "fresh");
assert.equal(stale, "stale");

const tenant = createEmptyCompanionTenantContext({
  organizationId: orgA,
  discovery: discoveryA,
  primaryVerifiedProvider: null,
  connectedProviders: [],
});
assert.equal(tenant.discovery.discoveredSystems.length, 1);
assert.equal(resolveCompanionIntegrationContext(null, tenant), null);
assert.equal(isRegisteredLiveProvider(PILOT_INTEGRATION_PROVIDER_KEY), true);
assert.equal(tenant.primaryVerifiedProvider, null, "no default provider in tenant context");

assert.equal(createEmptyCompanionTenantContext().discovery.discoveryStatus, "empty");
assert.equal(createEmptyCompanionDiscoveryContext().discoveredSystems.length, 0);

console.log("companion-runtime phase 2 tests passed");

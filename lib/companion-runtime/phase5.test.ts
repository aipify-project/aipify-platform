import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildProviderCapabilityId,
  capabilityIdForCompanionLiveTool,
  sanitizeToolOutput,
  selectToolByCapabilityId,
  validateToolInput,
  validateToolOutput,
  type CompanionToolDefinition,
} from "./companion-tool-definition";
import { resolveCompanionToolRegistry } from "./companion-tool-registry";
import {
  buildCompanionSchemaCollection,
  createEmptyCompanionSchemaCollection,
} from "./companion-schema-context";
import {
  createEmptyCompanionBusinessPackCollection,
} from "./companion-business-pack-context";
import {
  createEmptyCompanionDiscoveryContext,
  normalizeCompanionDiscoveryContext,
} from "./companion-discovery-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import { isRegisteredLiveProvider } from "./provider-tool-adapters-shared";

const discovery = normalizeCompanionDiscoveryContext(
  { found: true },
  {
    found: true,
    connected_systems: [
      {
        id: "sys-1",
        system_key: PILOT_INTEGRATION_PROVIDER_KEY,
        system_name: "Pilot Integration",
        connection_method: "oauth",
        auth_status: "authorized",
        sync_mode: "scheduled",
        sync_health: "healthy",
        updated_at: new Date().toISOString(),
      },
    ],
    discovery_results: [
      {
        id: "ent-1",
        discovery_type: "platform",
        entity_key: "registration",
        entity_label: "Registration",
        status: "confirmed",
      },
    ],
    data_sources: [],
    reports: { missing_data_domains: [] },
  },
  "11111111-1111-1111-1111-111111111111",
);

const schemaContext = buildCompanionSchemaCollection({
  discovery,
  businessPackContext: createEmptyCompanionBusinessPackCollection(),
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  effectivePermissions: [],
});

const registry = resolveCompanionToolRegistry({
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  entitledCapabilities: [],
  schemaContext,
  businessPackContext: createEmptyCompanionBusinessPackCollection(),
  discovery,
  effectivePermissions: [],
});

assert.ok(registry.enabledTools.length >= 1);
const snapshotCapability = capabilityIdForCompanionLiveTool(
  PILOT_INTEGRATION_PROVIDER_KEY,
  "get_platform_snapshot",
);
const snapshotTool = selectToolByCapabilityId(registry, snapshotCapability);
assert.ok(snapshotTool);
assert.equal(snapshotTool?.access_mode, "read");
assert.equal(snapshotTool?.operation, "read");
assert.equal(snapshotTool?.approval_required, false);

const blockedRegistry = resolveCompanionToolRegistry({
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  entitledCapabilities: [],
  schemaContext,
  businessPackContext: createEmptyCompanionBusinessPackCollection({ appEntitlementBlocked: true }),
  discovery,
  effectivePermissions: [],
});
assert.equal(blockedRegistry.enabledTools.length, 0);

const revokedDiscovery = normalizeCompanionDiscoveryContext(
  { found: true },
  {
    found: true,
    connected_systems: [
      {
        id: "sys-revoked",
        system_key: PILOT_INTEGRATION_PROVIDER_KEY,
        system_name: "Pilot Integration",
        connection_method: "oauth",
        auth_status: "revoked",
        sync_mode: "scheduled",
        sync_health: "paused",
        updated_at: new Date().toISOString(),
      },
    ],
    discovery_results: [],
    data_sources: [],
    reports: { missing_data_domains: [] },
  },
  "11111111-1111-1111-1111-111111111111",
);

const revokedRegistry = resolveCompanionToolRegistry({
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  entitledCapabilities: [],
  schemaContext: buildCompanionSchemaCollection({
    discovery: revokedDiscovery,
    businessPackContext: createEmptyCompanionBusinessPackCollection(),
    connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
    effectivePermissions: [],
  }),
  businessPackContext: createEmptyCompanionBusinessPackCollection(),
  discovery: revokedDiscovery,
  effectivePermissions: [],
});
assert.equal(revokedRegistry.enabledTools.length, 0);

const sampleTool: CompanionToolDefinition = {
  tool_id: "demo:platform_snapshot",
  capability_id: buildProviderCapabilityId("demo_booking_provider", "platform_snapshot"),
  provider_key: "demo_booking_provider",
  operation: "read",
  access_mode: "read",
  required_permission: null,
  input_schema: {
    fields: [
      { name: "providerKey", type: "string", required: true },
      { name: "refresh", type: "boolean" },
    ],
  },
  output_schema: {
    fields: [{ name: "status", type: "string" }],
  },
  source_label: "provider:demo_booking_provider",
  freshness: "unknown",
  approval_required: false,
  enabled: true,
};

assert.equal(
  validateToolInput(sampleTool, { providerKey: "demo_booking_provider", refresh: true }).ok,
  true,
);
assert.equal(validateToolInput(sampleTool, { providerKey: "other", refresh: true }).ok, false);
assert.equal(
  validateToolOutput(sampleTool, sanitizeToolOutput({ status: "available", api_secret: "hidden" })).ok,
  true,
);
assert.equal(sanitizeToolOutput({ status: "ok", api_key: "secret" }).api_key, undefined);

const emptyRegistry = resolveCompanionToolRegistry({
  connectedProviders: [],
  entitledCapabilities: [],
  schemaContext: createEmptyCompanionSchemaCollection(),
  businessPackContext: createEmptyCompanionBusinessPackCollection(),
  discovery: createEmptyCompanionDiscoveryContext(),
  effectivePermissions: [],
});
assert.equal(emptyRegistry.enabledTools.length, 0);

const tenantDefaults = createEmptyCompanionTenantContext();
assert.ok(Array.isArray(tenantDefaults.toolRegistry.tools));

assert.equal(isRegisteredLiveProvider(PILOT_INTEGRATION_PROVIDER_KEY), true);
assert.equal(isRegisteredLiveProvider("demo_booking_provider"), false);

const coreRegistrySource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/companion-tool-registry.ts"),
  "utf8",
);
const coreDefinitionSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/companion-tool-definition.ts"),
  "utf8",
);
assertCoreSourceFreeOfCustomerPilotNames(coreRegistrySource, "core registry");
assertCoreSourceFreeOfCustomerPilotNames(coreDefinitionSource, "core definition");

const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), `locales/${locale}/customer-app/companionPlatformKnowledge.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    companionPlatformKnowledge: { tools: Record<string, string> };
  };
  assert.ok(parsed.companionPlatformKnowledge.tools.missingTool, locale);
  assert.ok(parsed.companionPlatformKnowledge.tools.sourceLabel, locale);
}

console.log("phase5 companion runtime tests passed");

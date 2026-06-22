import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listMediaProviderManifests } from "@/lib/integration-intelligence/media/registry";
import { buildMediaCapabilityId } from "@/lib/integration-intelligence/media/types";
import {
  buildMediaActionDefinitions,
  buildMediaReadToolDefinitions,
  buildMediaSchemaEntities,
  mapMediaCapabilitiesToRefs,
  mergeMediaCapabilities,
} from "./merge-media-runtime";
import {
  createEmptyCompanionMediaContext,
  listEnabledMediaCapabilities,
} from "./companion-media-context";
import {
  buildMediaPlaybackUnavailableAnswer,
  buildMediaProviderDiscoveryAnswer,
  hasMediaProviderIntent,
  matchMediaProviderQuery,
} from "./media-answer";
import { buildActionDefinitionFromMediaCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listMediaProviderManifests();
assert.ok(manifests.length >= 2);
assert.equal(manifests.some((manifest) => manifest.provider_key === "spotify"), false);

const deviceEcosystem = manifests.find(
  (manifest) => manifest.provider_key === "companion_device_ecosystem",
);
assert.ok(deviceEcosystem);
assert.equal(deviceEcosystem?.implementation_status, "partial");

const capabilityId = buildMediaCapabilityId(
  "companion_presence_devices",
  "device.read",
  "read",
);
assert.equal(capabilityId, "companion_presence_devices.device.read.read");

const mediaContext = createEmptyCompanionMediaContext({
  device_ecosystem_enabled: true,
  presence_operations_enabled: true,
  connected_devices: 3,
  online_devices: 2,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    device_ecosystem_enabled: manifest.source_engine === "device_ecosystem",
    presence_operations_enabled: manifest.source_engine === "presence_operations",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildMediaCapabilityId(
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
      enabled: capability.operation === "read",
    })),
  ),
});

const capabilityRefs = mapMediaCapabilitiesToRefs(mediaContext);
assert.ok(
  capabilityRefs.some(
    (ref) => ref.capability_id === "companion_device_ecosystem.device.read.read",
  ),
);

const mergedCapabilities = mergeMediaCapabilities([], mediaContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildMediaSchemaEntities(mediaContext, [
  "companion_device_ecosystem.view",
  "companion_presence_operations.view",
]);
assert.ok(schemaEntities.length > 0);
assert.ok(schemaEntities.every((entity) => entity.source_provider));

const readTools = buildMediaReadToolDefinitions({
  mediaContext,
  effectivePermissions: [
    "companion_device_ecosystem.view",
    "companion_presence_operations.view",
  ],
});
assert.ok(readTools.length > 0);
assert.equal(readTools.every((tool) => tool.enabled), false);

const writeCapability = {
  capability_id: "companion_presence_devices.device.select.write",
  provider_key: "companion_presence_devices",
  capability_key: "device.select",
  operation: "write" as const,
  entity: "device",
  adapter_available: false,
  approval_required: true,
  reversible: true,
  risk_level: 2,
  required_permission: "companion_presence_operations.manage",
  runtime_status: "partial" as const,
  enabled: true,
};

const writeContext = createEmptyCompanionMediaContext({
  ...mediaContext,
  capabilities: [...mediaContext.capabilities, writeCapability],
});

const writeActions = buildMediaActionDefinitions({
  mediaContext: writeContext,
  effectivePermissions: ["companion_presence_operations.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(writeActions.length > 0);
assert.ok(writeActions.every((action) => action.approval_required));
assert.ok(writeActions.every((action) => action.reversible));
assert.ok(writeActions.every((action) => action.risk_level <= 2));

const writeDefinition = buildActionDefinitionFromMediaCapability(writeCapability, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(writeDefinition);
assert.equal(writeDefinition?.source, "media_provider");
assert.equal(writeDefinition?.approval_required, true);

const deniedContext = createEmptyCompanionMediaContext({ permission_denied: true });
const tenantContext = createEmptyCompanionTenantContext({ mediaContext });
const t = (key: string) => key;

assert.equal(hasMediaProviderIntent("show connected devices status"), true);
assert.equal(hasMediaProviderIntent("playback pause speaker"), true);

const match = matchMediaProviderQuery("connected devices list", tenantContext);
assert.ok(match);
assert.equal(match?.provider_key, "companion_device_ecosystem");

const discovery = buildMediaProviderDiscoveryAnswer(match!, mediaContext, t);
assert.ok(discovery.directAnswer.includes("media.discoveryLead"));
assert.ok(discovery.sources[0]?.meta);

const playbackUnavailable = buildMediaPlaybackUnavailableAnswer(t);
assert.ok(playbackUnavailable.directAnswer.includes("media.playbackUnavailableLead"));

const suspendedContext = createEmptyCompanionMediaContext({ app_entitlement_blocked: true });
const unavailable = buildMediaProviderDiscoveryAnswer(match!, suspendedContext, t);
assert.ok(unavailable.directAnswer);

assert.equal(listEnabledMediaCapabilities(deniedContext).length, 0);

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveMediaProviderAnswer"));
assert.equal(/\bspotify\b/i.test(orchestratorSource), false);

const runtimeFiles = [
  "companion-media-context.ts",
  "load-companion-media-context.ts",
  "merge-media-runtime.ts",
  "media-answer.ts",
  "orchestrator.ts",
];
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/\bspotify\b/i.test(source), false, file);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"media"'), locale);
}

console.log("phase14 companion runtime tests passed");

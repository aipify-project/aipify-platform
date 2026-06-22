import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listCreativeProviderManifests } from "@/lib/integration-intelligence/creative/registry";
import { buildCreativeCapabilityId } from "@/lib/integration-intelligence/creative/types";
import {
  buildCreativeActionDefinitions,
  buildCreativeReadToolDefinitions,
  buildCreativeSchemaEntities,
  mapCreativeCapabilitiesToRefs,
  mergeCreativeCapabilities,
} from "./merge-creative-runtime";
import {
  createEmptyCompanionCreativeContext,
  listEnabledCreativeCapabilities,
} from "./companion-creative-context";
import {
  buildCreativeProviderDiscoveryAnswer,
  hasCreativeProviderIntent,
  matchCreativeProviderQuery,
} from "./creative-answer";
import { buildActionDefinitionFromCreativeCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listCreativeProviderManifests();
assert.ok(manifests.length >= 10);

const photoshop = manifests.find((manifest) => manifest.provider_key === "photoshop");
assert.ok(photoshop);
assert.equal(photoshop?.implementation_status, "partial");

const capabilityId = buildCreativeCapabilityId("photoshop", "image.edit", "write");
assert.equal(capabilityId, "photoshop.image.edit.write");

const creativeContext = createEmptyCompanionCreativeContext({
  studio_enabled: true,
  bridge_enabled: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    studio_enabled: manifest.source_engine === "studio_byol" || manifest.source_engine === "studio_module",
    bridge_enabled: manifest.source_engine === "bridge_app",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildCreativeCapabilityId(
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
      enabled: capability.operation === "read" || (capability.approval_required && capability.reversible),
    })),
  ),
});

const capabilityRefs = mapCreativeCapabilitiesToRefs(creativeContext);
assert.ok(capabilityRefs.some((ref) => ref.capability_id === "photoshop.design.read.read"));

const mergedCapabilities = mergeCreativeCapabilities([], creativeContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildCreativeSchemaEntities(creativeContext, [
  "aipify_desktop_companion_creative_bridge.view",
]);
assert.ok(schemaEntities.length > 0);
assert.ok(schemaEntities.every((entity) => entity.source_provider));

const readTools = buildCreativeReadToolDefinitions({
  creativeContext,
  effectivePermissions: ["aipify_desktop_companion_creative_bridge.view"],
});
assert.ok(readTools.length > 0);
assert.equal(readTools.every((tool) => tool.enabled), false);

const writeActions = buildCreativeActionDefinitions({
  creativeContext,
  effectivePermissions: ["aipify_desktop_companion_creative_bridge.view"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(writeActions.length > 0);
assert.ok(writeActions.every((action) => action.approval_required));
assert.ok(writeActions.every((action) => action.reversible));
assert.ok(writeActions.every((action) => action.risk_level <= 2));

const writeCapability = creativeContext.capabilities.find(
  (capability) => capability.capability_id === "photoshop.image.edit.write",
);
assert.ok(writeCapability);
const writeDefinition = buildActionDefinitionFromCreativeCapability(writeCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(writeDefinition);
assert.equal(writeDefinition?.source, "creative_provider");
assert.equal(writeDefinition?.approval_required, true);

const deniedContext = createEmptyCompanionCreativeContext({ permission_denied: true });
const tenantContext = createEmptyCompanionTenantContext({ creativeContext });
const t = (key: string) => key;

assert.equal(hasCreativeProviderIntent("show creative design capabilities"), true);
const match = matchCreativeProviderQuery("photoshop image edit", tenantContext);
assert.ok(match);
assert.equal(match?.provider_key, "photoshop");

const discovery = buildCreativeProviderDiscoveryAnswer(match!, creativeContext, t);
assert.ok(discovery.directAnswer.includes("creative.discoveryLead"));
assert.ok(discovery.sources[0]?.meta);

const suspendedContext = createEmptyCompanionCreativeContext({ app_entitlement_blocked: true });
const unavailable = buildCreativeProviderDiscoveryAnswer(match!, suspendedContext, t);
assert.ok(unavailable.directAnswer);

assert.equal(listEnabledCreativeCapabilities(deniedContext).length, 0);

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveCreativeProviderAnswer"));
assert.equal(/\bcanva\b/i.test(orchestratorSource), false);
assert.equal(/\badobe\b/i.test(orchestratorSource), false);

const runtimeFiles = [
  "companion-creative-context.ts",
  "load-companion-creative-context.ts",
  "merge-creative-runtime.ts",
  "creative-answer.ts",
  "orchestrator.ts",
];
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/\bcanva\b|\badobe\b|\bfigma\b|\bspotify\b/i.test(source), false, file);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"creative"'), locale);
}

console.log("phase13 companion runtime tests passed");

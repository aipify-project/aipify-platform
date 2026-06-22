import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listCommerceProviderManifests } from "@/lib/integration-intelligence/commerce/registry";
import {
  buildCommerceCapabilityId,
  COMMERCE_BLOCKED_CAPABILITY_KEYS,
  isCommerceCapabilityBlocked,
} from "@/lib/integration-intelligence/commerce/types";
import {
  buildCommerceActionDefinitions,
  buildCommerceReadToolDefinitions,
  buildCommerceSchemaEntities,
  mapCommerceCapabilitiesToRefs,
  mergeCommerceCapabilities,
} from "./merge-commerce-runtime";
import {
  createEmptyCompanionCommerceContext,
  filterCommerceCapabilitiesForPrivacy,
  listEnabledCommerceCapabilities,
} from "./companion-commerce-context";
import {
  buildBlockedCommerceOperationAnswer,
  buildCommerceProviderDiscoveryAnswer,
  buildExternalCommerceUnavailableAnswer,
  hasBlockedCommerceOperationIntent,
  hasCommerceProviderIntent,
  hasExternalCommerceAdapterIntent,
  matchCommerceProviderQuery,
} from "./commerce-answer";
import { buildActionDefinitionFromCommerceCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listCommerceProviderManifests();
assert.ok(manifests.length >= 7);

for (const blocked of COMMERCE_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isCommerceCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

const retailOps = manifests.find((manifest) => manifest.provider_key === "commerce_retail_operations");
assert.ok(retailOps);
assert.equal(retailOps?.implementation_status, "partial");

const shopify = manifests.find((manifest) => manifest.provider_key === "shopify");
assert.ok(shopify);
assert.equal(shopify?.implementation_status, "specification_only");
assert.equal(shopify?.capabilities.every((capability) => !capability.adapter_available), true);

const capabilityId = buildCommerceCapabilityId("commerce_retail_operations", "product.read", "read");
assert.equal(capabilityId, "commerce_retail_operations.product.read.read");

const commerceContext = createEmptyCompanionCommerceContext({
  retail_operations_enabled: true,
  intelligence_enabled: true,
  automation_enabled: true,
  multi_store_enabled: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    retail_operations_enabled: manifest.source_engine === "commerce_retail_operations_pack",
    intelligence_enabled: manifest.source_engine === "commerce_intelligence",
    automation_enabled: manifest.source_engine === "product_automation",
    multi_store_enabled: manifest.source_engine === "multi_store_orchestration",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildCommerceCapabilityId(
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
      enabled: capability.operation === "read" || (capability.approval_required && capability.reversible),
    })),
  ),
});

const capabilityRefs = mapCommerceCapabilitiesToRefs(commerceContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "commerce_provider"));

const mergedCapabilities = mergeCommerceCapabilities([], commerceContext);
assert.ok(mergedCapabilities.length >= capabilityRefs.length);

const schemaEntities = buildCommerceSchemaEntities(commerceContext, [
  "commerce.view",
  "commerce.manage",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildCommerceReadToolDefinitions({
  commerceContext,
  effectivePermissions: ["commerce.view"],
});
assert.equal(readTools.every((tool) => tool.enabled === false), true);

const importCapability = commerceContext.capabilities.find(
  (capability) => capability.capability_key === "product.import" && capability.operation === "write",
);
assert.ok(importCapability);

const reversibleActions = buildCommerceActionDefinitions({
  commerceContext,
  effectivePermissions: ["commerce.view", "commerce.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
}).filter((action) => action.reversible);

assert.ok(reversibleActions.length > 0);
assert.ok(reversibleActions.every((action) => action.approval_required));

const importDefinition = buildActionDefinitionFromCommerceCapability(importCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(importDefinition);
assert.equal(importDefinition?.source, "commerce_provider");
assert.equal(importDefinition?.approval_required, true);

const publishCapability = commerceContext.capabilities.find(
  (capability) => capability.capability_key === "storefront.publish",
);
assert.ok(publishCapability);
const publishDefinition = buildActionDefinitionFromCommerceCapability(publishCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(publishDefinition);
assert.equal(publishDefinition?.enabled, false);
assert.equal(publishDefinition?.reversible, false);

const deniedContext = createEmptyCompanionCommerceContext({ permission_denied: true });
assert.equal(filterCommerceCapabilitiesForPrivacy(deniedContext).length, 0);
assert.equal(listEnabledCommerceCapabilities(deniedContext).length, 0);

const tenantContext = createEmptyCompanionTenantContext({ commerceContext });
const t = (key: string) => key;

assert.equal(hasCommerceProviderIntent("show product inventory"), true);
assert.equal(hasBlockedCommerceOperationIntent("issue refund for order"), true);
assert.equal(hasExternalCommerceAdapterIntent("live shopify api sync"), true);

const match = matchCommerceProviderQuery("product inventory status", tenantContext);
assert.ok(match);
assert.equal(match?.provider_key, "commerce_retail_operations");

const discovery = buildCommerceProviderDiscoveryAnswer(match!, commerceContext, t);
assert.ok(discovery.directAnswer.includes("commerce.discoveryLead"));
assert.ok(discovery.explanation?.includes("commerce.privacyNote"));

const blocked = buildBlockedCommerceOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("commerce.blockedOperationLead"));

const externalUnavailable = buildExternalCommerceUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("commerce.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveCommerceProviderAnswer"));
assert.equal(/\bif\s*\(\s*provider\s*===\s*['"]shopify['"]/i.test(orchestratorSource), false);
assert.equal(/\bif\s*\(\s*provider\s*===\s*['"]woocommerce['"]/i.test(orchestratorSource), false);
assert.equal(/\bif\s*\(\s*provider\s*===\s*['"]wordpress['"]/i.test(orchestratorSource), false);

const coreRuntimeFiles = [
  "companion-commerce-context.ts",
  "load-companion-commerce-context.ts",
  "merge-commerce-runtime.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/\bif\s*\([^)]*shopify/i.test(source), false, `${file}:shopify branch`);
  assert.equal(/\bif\s*\([^)]*woocommerce/i.test(source), false, `${file}:woocommerce branch`);
  assert.equal(/\bif\s*\([^)]*wordpress/i.test(source), false, `${file}:wordpress branch`);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"commerce"'), locale);
}

console.log("phase16 companion runtime tests passed");

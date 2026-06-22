import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listSupportProviderManifests } from "@/lib/integration-intelligence/support/registry";
import {
  buildSupportCapabilityId,
  SUPPORT_BLOCKED_CAPABILITY_KEYS,
  isSupportCapabilityBlocked,
} from "@/lib/integration-intelligence/support/types";
import {
  buildSupportActionDefinitions,
  buildSupportReadToolDefinitions,
  buildSupportSchemaEntities,
  mapSupportCapabilitiesToRefs,
  mergeSupportCapabilities,
} from "./merge-support-runtime";
import {
  createEmptyCompanionSupportContext,
  filterSupportCapabilitiesForPrivacy,
  listEnabledSupportCapabilities,
} from "./companion-support-context";
import {
  buildBlockedSupportOperationAnswer,
  buildExternalSupportUnavailableAnswer,
  buildSupportProviderDiscoveryAnswer,
  hasBlockedSupportOperationIntent,
  hasSupportProviderIntent,
  matchSupportProviderQuery,
} from "./support-answer";
import { buildActionDefinitionFromSupportCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listSupportProviderManifests();
assert.ok(manifests.length >= 7);

for (const blocked of SUPPORT_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isSupportCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

const supportAi = manifests.find((manifest) => manifest.provider_key === "support_ai_engine");
assert.ok(supportAi);
assert.equal(supportAi?.business_pack_key, "support_operations");
assert.equal(supportAi?.implementation_status, "partial");

const requiredCapabilities = [
  "support_case.read",
  "support_case.search",
  "conversation.read",
  "response.draft",
  "escalation.create",
  "sla.read",
  "customer_context.read",
  "support_insight.read",
] as const;

for (const capabilityKey of requiredCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const supportContext = createEmptyCompanionSupportContext({
  support_ai_enabled: true,
  autonomous_support_enabled: true,
  self_support_enabled: true,
  app_portal_support_enabled: true,
  proactive_support_enabled: true,
  business_dna_knowledge_enabled: true,
  human_oversight_required: true,
  draft_only_mode: true,
  auto_send_blocked: true,
  case_close_blocked: true,
  knowledge_gap_detection_enabled: true,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    support_ai_enabled: manifest.source_engine === "support_ai_engine",
    autonomous_support_enabled: manifest.source_engine === "autonomous_support_operations",
    self_support_enabled: manifest.source_engine === "self_support_engine",
    app_portal_support_enabled: manifest.source_engine === "app_portal_support",
    proactive_support_enabled: manifest.source_engine === "proactive_organization_support",
    business_dna_knowledge_enabled: manifest.source_engine === "business_dna_knowledge",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: manifest.business_pack_key === "support_operations" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildSupportCapabilityId(
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
      enabled: capability.operation === "read" || capability.approval_required,
    })),
  ),
});

const capabilityRefs = mapSupportCapabilitiesToRefs(supportContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "support_provider"));

const mergedCapabilities = mergeSupportCapabilities([], supportContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildSupportSchemaEntities(supportContext, [
  "support.view",
  "support.reply",
  "support.assign",
  "support.escalate",
  "support.view_metrics",
  "self_support.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildSupportReadToolDefinitions({
  supportContext,
  effectivePermissions: ["support.view", "self_support.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const draftCapability = supportContext.capabilities.find(
  (capability) =>
    capability.capability_key === "response.draft" && capability.provider_key === "support_ai_engine",
);
assert.ok(draftCapability);

const draftDefinition = buildActionDefinitionFromSupportCapability(draftCapability!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(draftDefinition);
assert.equal(draftDefinition?.source, "support_provider");
assert.equal(draftDefinition?.enabled, true);

const supportActions = buildSupportActionDefinitions({
  supportContext,
  effectivePermissions: ["support.view", "support.reply", "support.assign", "support.escalate"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(supportActions.length > 0);
assert.ok(supportActions.every((action) => action.approval_required));

const privateCapabilities = filterSupportCapabilitiesForPrivacy({
  ...supportContext,
  capabilities: supportContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const enabled = listEnabledSupportCapabilities(supportContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ supportContext });
const match = matchSupportProviderQuery("show support cases and draft response", tenantContext);
assert.ok(match);
assert.equal(hasSupportProviderIntent("customer service inbox"), true);
assert.equal(hasBlockedSupportOperationIntent("send reply to customer"), true);

const discovery = buildSupportProviderDiscoveryAnswer(match!, supportContext, t);
assert.ok(discovery.directAnswer.includes("support.discoveryLead"));
assert.ok(discovery.explanation?.includes("support.autoSendBlocked"));
assert.ok(discovery.explanation?.includes("support.caseCloseBlocked"));

const blocked = buildBlockedSupportOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("support.blockedOperationLead"));

const externalUnavailable = buildExternalSupportUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("support.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveSupportProviderAnswer"));

const forbiddenIndustryTerms = [
  "rørlegger",
  "frisør",
  "klinikk",
  PILOT_INTEGRATION_PROVIDER_KEY,
  "plumber",
  "salon",
  "healthcare_clinic",
];
for (const term of forbiddenIndustryTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-support-context.ts",
  "load-companion-support-context.ts",
  "merge-support-runtime.ts",
  "tenant-context.ts",
  "orchestrator.ts",
];
for (const file of coreRuntimeFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  for (const term of forbiddenIndustryTerms) {
    assert.equal(new RegExp(`\\b${term}\\b`, "i").test(source), false, `${file}:${term}`);
  }
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"support"'), locale);
}

console.log("phase18 companion runtime tests passed");

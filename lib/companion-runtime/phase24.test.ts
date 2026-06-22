import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listSalesProviderManifests } from "@/lib/integration-intelligence/sales/registry";
import {
  buildSalesCapabilityId,
  SALES_BLOCKED_CAPABILITY_KEYS,
  SALES_BUSINESS_PACK_KEYS,
  isSalesBusinessPackActive,
  isSalesCapabilityBlocked,
} from "@/lib/integration-intelligence/sales/types";
import {
  buildSalesActionDefinitions,
  buildSalesReadToolDefinitions,
  buildSalesSchemaEntities,
  mapSalesCapabilitiesToRefs,
  mergeSalesCapabilities,
} from "./merge-sales-runtime";
import {
  createEmptyCompanionSalesContext,
  filterSalesCapabilitiesForPrivacy,
  listEnabledSalesCapabilities,
} from "./companion-sales-context";
import {
  buildBlockedSalesOperationAnswer,
  buildExternalSalesUnavailableAnswer,
  buildSalesProviderDiscoveryAnswer,
  hasBlockedSalesOperationIntent,
  hasSalesProviderIntent,
  matchSalesProviderQuery,
} from "./sales-answer";
import { buildActionDefinitionFromSalesCapability } from "./companion-action-definition";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listSalesProviderManifests();
assert.ok(manifests.length >= 6);

for (const blocked of SALES_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isSalesCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isSalesBusinessPackActive(["revenue_pack"]), true);
assert.equal(isSalesBusinessPackActive(["crm"]), true);
assert.equal(isSalesBusinessPackActive(["warehouse_pack"]), false);
assert.ok(SALES_BUSINESS_PACK_KEYS.includes("revenue_pack"));

const salesPipeline = manifests.find(
  (manifest) => manifest.provider_key === "sales_revenue_pipeline",
);
assert.ok(salesPipeline);
assert.equal(salesPipeline?.business_pack_key, "revenue_pack");

const requiredReadCapabilities = [
  "lead.read",
  "prospect.read",
  "customer.read",
  "contact.read",
  "opportunity.read",
  "pipeline.read",
  "deal.read",
  "conversion.read",
  "attribution.read",
  "customer_health.read",
  "churn_risk.read",
  "sales_forecast.read",
  "follow_up.read",
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
  "follow_up.create",
  "sales_task.create",
  "response.draft",
] as const;

for (const capabilityKey of requiredWriteCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const salesContext = createEmptyCompanionSalesContext({
  sales_revenue_pipeline_enabled: true,
  customer_relationship_enabled: true,
  lead_management_enabled: true,
  revenue_intelligence_enabled: true,
  sales_role_filter_active: true,
  sensitive_contact_data_filtered: true,
  partner_attribution_metadata_only: true,
  command_brief_events_linked: true,
  command_brief_signals: [
    { signal_key: "new_lead", count: 3 },
    { signal_key: "churn_risk", count: 1 },
  ],
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    sales_revenue_pipeline_enabled: manifest.source_engine === "sales_revenue_pipeline",
    customer_relationship_enabled: manifest.source_engine === "customer_relationship",
    lead_management_enabled: manifest.source_engine === "lead_management",
    revenue_intelligence_enabled: manifest.source_engine === "revenue_intelligence",
    growth_partner_attribution_enabled: false,
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active:
      manifest.business_pack_key === "revenue_pack" || !manifest.business_pack_key,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildSalesCapabilityId(
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
        (!capability.required_permission || capability.required_permission === "sales.view") &&
        (capability.operation === "read" || capability.approval_required) &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapSalesCapabilitiesToRefs(salesContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "sales_provider"));

const mergedCapabilities = mergeSalesCapabilities([], salesContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildSalesSchemaEntities(salesContext, [
  "sales.view",
  "sales.manage",
  "customers.view",
]);
assert.ok(schemaEntities.length > 0);

const readTools = buildSalesReadToolDefinitions({
  salesContext,
  effectivePermissions: ["sales.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const followUpCreate = salesContext.capabilities.find(
  (capability) =>
    capability.capability_key === "follow_up.create" &&
    capability.provider_key === "sales_revenue_pipeline",
);
assert.ok(followUpCreate);

const followUpDefinition = buildActionDefinitionFromSalesCapability(followUpCreate!, {
  permissionAllowed: true,
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(followUpDefinition);
assert.equal(followUpDefinition?.source, "sales_provider");
assert.equal(followUpDefinition?.enabled, true);

const salesActions = buildSalesActionDefinitions({
  salesContext,
  effectivePermissions: ["sales.manage"],
  appEntitlementBlocked: false,
  emergencyStop: false,
  maxRiskLevel: 2,
});
assert.ok(salesActions.length > 0);
assert.ok(salesActions.every((action) => action.approval_required));

const privateCapabilities = filterSalesCapabilitiesForPrivacy({
  ...salesContext,
  capabilities: salesContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const permissionFiltered = buildSalesSchemaEntities(
  {
    ...salesContext,
    capabilities: salesContext.capabilities.map((capability) =>
      capability.required_permission === "sales.manage"
        ? { ...capability, enabled: false }
        : capability,
    ),
  },
  ["sales.view"],
);
assert.ok(
  permissionFiltered.some((entity) => entity.entity_key.includes("sales_revenue_pipeline")),
);
assert.ok(
  permissionFiltered.every(
    (entity) => !entity.required_permissions.includes("sales.manage"),
  ),
);

const enabled = listEnabledSalesCapabilities(salesContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ salesContext });
const match = matchSalesProviderQuery(
  "show leads pipeline deals and customer health",
  tenantContext,
);
assert.ok(match);
assert.equal(hasSalesProviderIntent("sales crm lead pipeline deal customer churn"), true);
assert.equal(
  hasBlockedSalesOperationIntent("auto send message delete customer approve contract"),
  true,
);

const discovery = buildSalesProviderDiscoveryAnswer(match!, salesContext, t);
assert.ok(discovery.directAnswer.includes("sales.discoveryLead"));
assert.ok(discovery.explanation?.includes("sales.partnerAttributionMetadataOnly"));
assert.ok(discovery.explanation?.includes("sales.commandBriefEventsLinked"));

const blocked = buildBlockedSalesOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("sales.blockedOperationLead"));

const externalUnavailable = buildExternalSalesUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("sales.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveSalesProviderAnswer"));

const forbiddenTerms = ["unonight", "salesforce.com", "frisør", "salon"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-sales-context.ts",
  "load-companion-sales-context.ts",
  "merge-sales-runtime.ts",
  "sales-answer.ts",
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
  assert.ok(raw.includes('"sales"'), locale);
}

console.log("phase24 companion runtime tests passed");

import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listProactiveProviderManifests } from "@/lib/integration-intelligence/proactive/registry";
import {
  buildProactiveCapabilityId,
  PROACTIVE_BLOCKED_CAPABILITY_KEYS,
  PROACTIVE_BUSINESS_PACK_KEYS,
  isProactiveBusinessPackActive,
  isProactiveCapabilityBlocked,
} from "@/lib/integration-intelligence/proactive/types";
import {
  buildProactiveReadToolDefinitions,
  buildProactiveSchemaEntities,
  mapProactiveCapabilitiesToRefs,
  mergeProactiveCapabilities,
} from "./merge-proactive-runtime";
import {
  createEmptyCompanionProactiveContext,
  filterProactiveCapabilitiesForPrivacy,
  listEnabledProactiveCapabilities,
  type CompanionProactiveSignal,
} from "./companion-proactive-context";
import {
  buildBlockedProactiveOperationAnswer,
  buildExternalProactiveUnavailableAnswer,
  buildProactiveProviderDiscoveryAnswer,
  hasBlockedProactiveOperationIntent,
  hasProactiveProviderIntent,
  matchProactiveProviderQuery,
} from "./proactive-answer";
import {
  collectDomainProactiveSignals,
  dedupeProactiveSignals,
  extractRecommendationProactiveSignals,
  filterProactiveSignalsForPermission,
  mergeProactiveSignalsIntoOperationalContext,
  prioritizeProactiveSignals,
} from "./normalize-proactive-signals";
import { createEmptyCompanionOperationalContext } from "./companion-operational-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listProactiveProviderManifests();
assert.ok(manifests.length >= 6);

for (const blocked of PROACTIVE_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isProactiveCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isProactiveBusinessPackActive(["proactive_pack"]), true);
assert.equal(isProactiveBusinessPackActive(["command_center"]), true);
assert.equal(isProactiveBusinessPackActive(["warehouse_pack"]), false);
assert.ok(PROACTIVE_BUSINESS_PACK_KEYS.includes("recommendations_pack"));

const requiredReadCapabilities = [
  "signal.read",
  "alert.read",
  "anomaly.read",
  "recommendation.read",
  "risk_signal.read",
  "opportunity.read",
  "health_score.read",
  "forecast_warning.read",
  "follow_up.read",
  "attention_item.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const sampleSignal: CompanionProactiveSignal = {
  signal_id: "sales:churn_risk",
  signal_type: "risk",
  severity: "high",
  source_module: "sales",
  source_reference: "churn_risk",
  detected_at: new Date().toISOString(),
  freshness: "fresh",
  title: "churn risk",
  summary: "3",
  recommended_action: null,
  required_capability: "risk_signal.read",
  required_permission: "sales.view",
  confidence: "moderate",
  status: "unresolved",
  business_impact: "high",
};

const domainSignals = collectDomainProactiveSignals([
  {
    source_module: "sales",
    signals: [
      { signal_key: "churn_risk", count: 3 },
      { signal_key: "new_lead", count: 0 },
    ],
    required_permission: "sales.view",
  },
]);
assert.equal(domainSignals.length, 1);
assert.equal(domainSignals[0]?.signal_id, "sales:churn_risk");

const recommendationSignals = extractRecommendationProactiveSignals({
  found: true,
  has_recommendations: true,
  active_recommendations_count: 1,
  recommendations: [
    {
      id: "rec-1",
      title: "Review support demand",
      description: "Support demand increased",
      reason: "Trend detected",
      suggested_action: "Open support overview",
      priority: "high",
      confidence: "moderate",
      status: "active",
      created_at: new Date().toISOString(),
    },
  ],
});
assert.equal(recommendationSignals.length, 1);
assert.equal(recommendationSignals[0]?.recommended_action, "Open support overview");

const emptyRecommendations = extractRecommendationProactiveSignals({
  found: true,
  has_recommendations: false,
  active_recommendations_count: 0,
  recommendations: [],
});
assert.equal(emptyRecommendations.length, 0);

const duplicated = prioritizeProactiveSignals([
  sampleSignal,
  { ...sampleSignal, summary: "4" },
  {
    ...sampleSignal,
    signal_id: "finance:forecast_warning",
    signal_type: "forecast_warning",
    severity: "critical",
    source_module: "finance",
    source_reference: "forecast_warning",
    title: "forecast warning",
  },
]);
assert.equal(duplicated.length, 2);
assert.equal(duplicated[0]?.severity, "critical");

const deduped = dedupeProactiveSignals([
  sampleSignal,
  { ...sampleSignal, summary: "different summary only" },
]);
assert.equal(deduped.length, 1);

const permissionFiltered = filterProactiveSignalsForPermission(
  [sampleSignal, { ...sampleSignal, required_permission: "executive.view" }],
  ["sales.view"],
);
assert.equal(permissionFiltered.length, 1);

const operational = createEmptyCompanionOperationalContext({
  attention_items: [],
});
const mergedOperational = mergeProactiveSignalsIntoOperationalContext(operational, [sampleSignal]);
assert.ok(mergedOperational.attention_items.length > 0);

const proactiveContext = createEmptyCompanionProactiveContext({
  proactive_insights_enabled: true,
  recommendation_engine_enabled: true,
  command_brief_operational_enabled: true,
  domain_signal_bus_enabled: true,
  recommendation_auto_execute_blocked: true,
  command_brief_events_linked: true,
  signals: duplicated,
  prioritized_signals: duplicated,
  providers: manifests.map((manifest) => ({
    provider_key: manifest.provider_key,
    implementation_status: manifest.implementation_status,
    proactive_insights_enabled: manifest.source_engine === "proactive_insights_engine",
    recommendation_engine_enabled: manifest.source_engine === "companion_recommendation_engine",
    proactive_organization_enabled: manifest.source_engine === "proactive_organization_center",
    command_brief_operational_enabled: manifest.source_engine === "command_brief_operational",
    domain_signal_bus_enabled: manifest.source_engine === "domain_signal_bus",
    verified: false,
    adapter_available: false,
    entitlement_active: true,
    business_pack_active: true,
  })),
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildProactiveCapabilityId(
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
        (!capability.required_permission || capability.required_permission === "executive.view") &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
});

const capabilityRefs = mapProactiveCapabilitiesToRefs(proactiveContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "proactive_provider"));

const mergedCapabilities = mergeProactiveCapabilities([], proactiveContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildProactiveSchemaEntities(proactiveContext, ["executive.view"]);
assert.ok(schemaEntities.length > 0);

const readTools = buildProactiveReadToolDefinitions({
  proactiveContext,
  effectivePermissions: ["executive.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const privateCapabilities = filterProactiveCapabilitiesForPrivacy({
  ...proactiveContext,
  capabilities: proactiveContext.capabilities.map((capability) =>
    capability.privacy_sensitive ? { ...capability, enabled: false } : capability,
  ),
});
assert.ok(
  privateCapabilities.every(
    (capability) => !capability.privacy_sensitive || capability.enabled,
  ),
);

const enabled = listEnabledProactiveCapabilities(proactiveContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ proactiveContext });
const match = matchProactiveProviderQuery(
  "show proactive alerts recommendations and risk signals",
  tenantContext,
);
assert.ok(match);
assert.equal(
  hasProactiveProviderIntent("proactive monitoring alert recommendation opportunity"),
  true,
);
assert.equal(
  hasBlockedProactiveOperationIntent("auto execute recommendation automatically"),
  true,
);

const discovery = buildProactiveProviderDiscoveryAnswer(match!, proactiveContext, t);
assert.ok(discovery.directAnswer.includes("proactive.discoveryLead"));
assert.ok(discovery.explanation?.includes("proactive.recommendationAutoExecuteBlocked"));
assert.ok(discovery.explanation?.includes("proactive.commandBriefEventsLinked"));

const blocked = buildBlockedProactiveOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("proactive.blockedOperationLead"));

const externalUnavailable = buildExternalProactiveUnavailableAnswer(t);
assert.ok(externalUnavailable.directAnswer.includes("proactive.externalUnavailableLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveProactiveProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "frisør", "salon", "vipps", "retail", "hospitality"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-proactive-context.ts",
  "normalize-proactive-signals.ts",
  "load-companion-proactive-context.ts",
  "merge-proactive-runtime.ts",
  "proactive-answer.ts",
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
  assert.ok(raw.includes('"proactive"'), locale);
  assert.ok(raw.includes("blockReason"), locale);
}

console.log("phase27 companion runtime tests passed");

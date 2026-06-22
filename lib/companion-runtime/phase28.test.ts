import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { listAnalyticsProviderManifests } from "@/lib/integration-intelligence/analytics/registry";
import {
  buildAnalyticsCapabilityId,
  ANALYTICS_BLOCKED_CAPABILITY_KEYS,
  ANALYTICS_BUSINESS_PACK_KEYS,
  isAnalyticsBusinessPackActive,
  isAnalyticsCapabilityBlocked,
} from "@/lib/integration-intelligence/analytics/types";
import {
  buildAnalyticsReadToolDefinitions,
  buildAnalyticsSchemaEntities,
  mapAnalyticsCapabilitiesToRefs,
  mergeAnalyticsCapabilities,
} from "./merge-analytics-runtime";
import {
  createEmptyCompanionAnalyticsContext,
  filterAnalyticsCapabilitiesForPrivacy,
  listEnabledAnalyticsCapabilities,
  type CompanionAnalyticsMetric,
} from "./companion-analytics-context";
import {
  arePeriodsComparable,
  areUnitsCompatible,
  buildCrossModuleAnalyticsViews,
  dedupeAnalyticsMetrics,
  extractAnalyticsCenterMetrics,
  extractCompanionAnalyticsContextMetrics,
  extractExecutiveInsightsCenterMetrics,
  filterAnalyticsMetricsForPermission,
  prioritizeAnalyticsMetrics,
  validateUnsupportedCorrelationAttempt,
} from "./normalize-analytics-metrics";
import {
  buildAnalyticsProviderDiscoveryAnswer,
  buildBlockedAnalyticsOperationAnswer,
  buildUnsupportedCorrelationAnswer,
  hasAnalyticsProviderIntent,
  hasBlockedAnalyticsOperationIntent,
  matchAnalyticsProviderQuery,
} from "./analytics-answer";
import { createEmptyCompanionOperationalContext } from "./companion-operational-context";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";

const manifests = listAnalyticsProviderManifests();
assert.ok(manifests.length >= 7);

for (const blocked of ANALYTICS_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isAnalyticsCapabilityBlocked(blocked), true, blocked);
  for (const manifest of manifests) {
    assert.equal(
      manifest.capabilities.some((capability) => (capability.capability_key as string) === blocked),
      false,
      `${manifest.provider_key}:${blocked}`,
    );
  }
}

assert.equal(isAnalyticsBusinessPackActive(["analytics"]), true);
assert.equal(isAnalyticsBusinessPackActive(["executive_intelligence"]), true);
assert.equal(isAnalyticsBusinessPackActive(["warehouse_pack"]), false);
assert.ok(ANALYTICS_BUSINESS_PACK_KEYS.includes("command_center"));

const requiredReadCapabilities = [
  "kpi.read",
  "metric.read",
  "trend.read",
  "comparison.read",
  "forecast.read",
  "executive_insight.read",
  "performance.read",
  "anomaly.read",
  "report.read",
  "dashboard.read",
  "cross_module.read",
] as const;

for (const capabilityKey of requiredReadCapabilities) {
  assert.ok(
    manifests.some((manifest) =>
      manifest.capabilities.some((capability) => capability.capability_key === capabilityKey),
    ),
    capabilityKey,
  );
}

const sampleMetric: CompanionAnalyticsMetric = {
  metric_id: "analytics_center:open_tasks",
  metric_label: "open tasks",
  value: 12,
  unit: "count",
  period: "current",
  comparison_period: null,
  change: null,
  trend: "unknown",
  source_module: "analytics_center",
  source_reference: "executive_dashboard.open_tasks",
  generated_at: new Date().toISOString(),
  freshness: "fresh",
  completeness: "complete",
  confidence: "moderate",
  warnings: [],
  required_permission: "analytics.view",
  inference: false,
};

const companionRaw = {
  found: true,
  organization_health: 82,
  open_tasks: 12,
  overdue_tasks: 3,
  active_employees: 45,
  business_packs_active: 4,
};

const companionMetrics = extractCompanionAnalyticsContextMetrics(companionRaw);
assert.ok(companionMetrics.length >= 4);
assert.ok(companionMetrics.every((metric) => metric.inference === false));

const analyticsCenterRaw = {
  found: true,
  executive_dashboard: {
    organization_health: 80,
    open_tasks: 10,
    overdue_tasks: 2,
  },
};

const centerMetrics = extractAnalyticsCenterMetrics(analyticsCenterRaw);
assert.ok(centerMetrics.length >= 3);

const insightsRaw = {
  found: true,
  organization_health: 77,
  insights: [{ id: "a", title: "Workload", metric_delta: 5, created_at: new Date().toISOString() }],
};

const insightMetrics = extractExecutiveInsightsCenterMetrics(insightsRaw);
assert.ok(insightMetrics.length >= 2);

assert.equal(arePeriodsComparable("current", "current"), true);
assert.equal(areUnitsCompatible("count", "count"), true);
assert.equal(areUnitsCompatible("count", "score"), false);

const deduped = dedupeAnalyticsMetrics([
  sampleMetric,
  { ...sampleMetric, value: 99, freshness: "fresh", confidence: "high" },
]);
assert.equal(deduped.length, 1);
assert.equal(deduped[0]?.value, 99);

const prioritized = prioritizeAnalyticsMetrics([sampleMetric, ...centerMetrics]);
assert.ok(prioritized.length > 0);

const permissionFiltered = filterAnalyticsMetricsForPermission(
  [sampleMetric, { ...sampleMetric, required_permission: "analytics.manage" }],
  ["analytics.view"],
);
assert.equal(permissionFiltered.length, 1);

const crossModule = buildCrossModuleAnalyticsViews(
  [
    sampleMetric,
    {
      ...sampleMetric,
      metric_id: "command_brief_analytics:attention_items",
      source_module: "command_brief_analytics",
      source_reference: "attention_items",
    },
  ],
  ["analytics.view", "executive.view"],
);
assert.ok(crossModule.length >= 1);
assert.equal(crossModule[0]?.inference, false);

assert.equal(
  validateUnsupportedCorrelationAttempt("why did tasks increase because of sales?", [
    sampleMetric,
    { ...sampleMetric, source_module: "executive_insights_center" },
  ]),
  true,
);

const analyticsContext = createEmptyCompanionAnalyticsContext({
  capabilities: manifests.flatMap((manifest) =>
    manifest.capabilities.map((capability) => ({
      capability_id: buildAnalyticsCapabilityId(
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
        (!capability.required_permission || capability.required_permission === "analytics.view") &&
        manifest.implementation_status !== "placeholder",
    })),
  ),
  prioritized_metrics: [sampleMetric],
  metrics: [sampleMetric],
});

const capabilityRefs = mapAnalyticsCapabilitiesToRefs(analyticsContext);
assert.ok(capabilityRefs.length > 0);
assert.ok(capabilityRefs.every((ref) => ref.pack_key === "analytics_provider"));

const mergedCapabilities = mergeAnalyticsCapabilities([], analyticsContext);
assert.equal(mergedCapabilities.length, capabilityRefs.length);

const schemaEntities = buildAnalyticsSchemaEntities(analyticsContext, ["analytics.view"]);
assert.ok(schemaEntities.length > 0);

const readTools = buildAnalyticsReadToolDefinitions({
  analyticsContext,
  effectivePermissions: ["analytics.view"],
});
assert.ok(readTools.every((tool) => !tool.enabled));

const enabled = listEnabledAnalyticsCapabilities(analyticsContext);
assert.ok(enabled.length > 0);

const t = (key: string) => key;
const tenantContext = createEmptyCompanionTenantContext({ analyticsContext });
const match = matchAnalyticsProviderQuery("show analytics KPI trends and executive insights", tenantContext);
assert.ok(match);
assert.equal(hasAnalyticsProviderIntent("analytics dashboard performance metrics"), true);
assert.equal(hasBlockedAnalyticsOperationIntent("auto generate report automatically"), true);

const discovery = buildAnalyticsProviderDiscoveryAnswer(match!, analyticsContext, t);
assert.ok(discovery.directAnswer.includes("analytics.discoveryLead"));
assert.ok(discovery.explanation?.includes("analytics.noInferredCorrelation"));

const blocked = buildBlockedAnalyticsOperationAnswer(t);
assert.ok(blocked.directAnswer.includes("analytics.blockedOperationLead"));

const unsupported = buildUnsupportedCorrelationAnswer(analyticsContext, t);
assert.ok(unsupported.directAnswer.includes("analytics.unsupportedCorrelationLead"));

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveAnalyticsProviderAnswer"));

const forbiddenTerms = [PILOT_INTEGRATION_PROVIDER_KEY, "frisør", "salon", "vipps", "retail", "hospitality"];
for (const term of forbiddenTerms) {
  assert.equal(new RegExp(`\\b${term}\\b`, "i").test(orchestratorSource), false, term);
}

const coreRuntimeFiles = [
  "companion-analytics-context.ts",
  "normalize-analytics-metrics.ts",
  "load-companion-analytics-context.ts",
  "merge-analytics-runtime.ts",
  "analytics-answer.ts",
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
  assert.ok(raw.includes('"analytics"'), locale);
  assert.ok(raw.includes("blockReason"), locale);
}

console.log("phase28 companion runtime tests passed");

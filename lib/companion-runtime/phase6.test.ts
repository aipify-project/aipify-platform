import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import { PILOT_INTEGRATION_PROVIDER_KEY } from "@/lib/integration-intelligence/pilot-integration-fixture";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createEmptyCompanionLiveResult,
  normalizeCompanionLiveResult,
} from "./companion-live-result";
import {
  extractMetricFromData,
  formatMetricStateLabel,
} from "./companion-metric-format";
import { matchLiveQuery } from "./companion-query-match";
import { buildGroundedLiveAnswer } from "./grounded-answer";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import { resolveCompanionToolRegistry } from "./companion-tool-registry";
import { buildCompanionSchemaCollection } from "./companion-schema-context";
import { createEmptyCompanionBusinessPackCollection } from "./companion-business-pack-context";
import {
  normalizeCompanionDiscoveryContext,
} from "./companion-discovery-context";
import { sanitizeToolOutput } from "./companion-tool-definition";
import type { CompanionToolDefinition } from "./companion-tool-definition";

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

const businessPackContext = createEmptyCompanionBusinessPackCollection();
const schemaContext = buildCompanionSchemaCollection({
  discovery,
  businessPackContext,
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  effectivePermissions: [],
});

const tenantContext = createEmptyCompanionTenantContext({
  connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
  discovery,
  schemaContext,
  toolRegistry: resolveCompanionToolRegistry({
    connectedProviders: [PILOT_INTEGRATION_PROVIDER_KEY],
    entitledCapabilities: [],
    schemaContext,
    businessPackContext,
    discovery,
    effectivePermissions: [],
  }),
});

const liveMatch = matchLiveQuery({
  query: "what is the registration status",
  tenantContext,
  integrationContext: PILOT_INTEGRATION_PROVIDER_KEY,
  locale: "en",
  liveRouting: {
    tool: "get_platform_snapshot",
    platformSnapshotIntent: {
      providerKey: PILOT_INTEGRATION_PROVIDER_KEY,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "full_snapshot",
      presentationMode: "full_snapshot",
    },
    integrationStatusIntent: null,
    genericIntent: null,
  },
});

assert.ok(liveMatch);
assert.equal(liveMatch?.capability_id, `${PILOT_INTEGRATION_PROVIDER_KEY}.platform_snapshot.read`);
assert.equal(liveMatch?.entity, "registration");

const sampleTool: CompanionToolDefinition = {
  tool_id: `${PILOT_INTEGRATION_PROVIDER_KEY}:platform_snapshot`,
  capability_id: `${PILOT_INTEGRATION_PROVIDER_KEY}.platform_snapshot.read`,
  provider_key: PILOT_INTEGRATION_PROVIDER_KEY,
  operation: "read",
  access_mode: "read",
  required_permission: null,
  input_schema: { fields: [{ name: "providerKey", type: "string", required: true }] },
  output_schema: {
    fields: [
      { name: "status", type: "string" },
      { name: "active_modules", type: "array" },
      { name: "checked_at", type: "string" },
    ],
  },
  source_label: `provider:${PILOT_INTEGRATION_PROVIDER_KEY}`,
  freshness: "fresh",
  approval_required: false,
  enabled: true,
};

const liveResult = normalizeCompanionLiveResult(
  {
    ok: true,
    data: {
      status: "available",
      active_modules: ["registration", "marketplace"],
      checked_at: "2026-06-22T12:00:00.000Z",
      api_secret: "hidden",
    },
    tool: sampleTool,
    freshness: "fresh",
  },
  liveMatch!,
);

assert.equal(liveResult.summary_fields.includes("status"), true);
assert.equal(liveResult.data.api_secret, undefined);
assert.equal(liveResult.completeness, "complete");
assert.equal(liveResult.permission_status, "allowed");

const countMetric = extractMetricFromData(
  { active_modules: ["registration", "marketplace"] },
  "count",
  "active_modules",
);
assert.equal(countMetric.state, "value");
assert.equal(countMetric.value, 2);

const zeroMetric = extractMetricFromData({ active_modules: [] }, "count", "active_modules");
assert.equal(zeroMetric.state, "zero");

const nullMetric = extractMetricFromData({ status: null }, "status", "status");
assert.equal(nullMetric.state, "null");

const missingMetric = extractMetricFromData({}, "total", "total");
assert.equal(missingMetric.state, "missing");

const t = (key: string) => key;
assert.ok(formatMetricStateLabel("missing", t).includes("grounded.valueMissing"));

const grounded = buildGroundedLiveAnswer(
  liveResult,
  { ...liveMatch!, metric_kind: "status", field: "status" },
  t,
  "en",
);
assert.ok(grounded.directAnswer.includes("grounded.metricLine"));
assert.ok(grounded.liveIntegrationToolUsed);
assert.equal(grounded.source, "verified_integration");

const sanitized = sanitizeToolOutput({ token: "secret-value", status: "ok" });
assert.equal(sanitized.token, undefined);
assert.equal(sanitized.status, "ok");

const empty = createEmptyCompanionLiveResult();
assert.equal(empty.completeness, "missing");

const coreFiles = [
  "companion-live-result.ts",
  "companion-query-match.ts",
  "companion-metric-format.ts",
  "grounded-answer.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assertCoreSourceFreeOfCustomerPilotNames(source, file);
}

const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  if (locale === "en") continue;
  const raw = fs.readFileSync(
    path.join(process.cwd(), `locales/${locale}/customer-app/companionPlatformKnowledge.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    companionPlatformKnowledge: { grounded?: Record<string, string> };
  };
  assert.ok(parsed.companionPlatformKnowledge.grounded?.sourceLine, locale);
}

console.log("phase6 companion runtime tests passed");

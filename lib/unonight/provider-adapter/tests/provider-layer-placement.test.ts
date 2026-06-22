import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "..", "..");

const coreModules = [
  "lib/integration-intelligence/community/metric-contract.ts",
  "lib/integration-intelligence/community/metric-binding-resolution.ts",
  "lib/integration-intelligence/community/provider-readiness.ts",
  "lib/companion-runtime/companion-semantic-query-match.ts",
  "lib/companion-runtime/companion-semantic-resolver.ts",
  "lib/companion-runtime/community-provider-adapter-answer.ts",
];

const adapterModules = [
  "lib/unonight/provider-adapter/member-statistics.ts",
  "lib/unonight/provider-adapter/metric-grounding.ts",
  "lib/unonight/provider-adapter/source-map.ts",
  "lib/unonight/provider-adapter/semantic-descriptors.ts",
  "lib/unonight/provider-adapter/member-metric-aliases.ts",
];

for (const modulePath of coreModules) {
  const source = readFileSync(join(repoRoot, modulePath), "utf8");
  assert.doesNotMatch(source, /get_unonight_member_statistics/i, `${modulePath} must not reference Unonight RPC`);
  assert.doesNotMatch(source, /unonight_supabase_views/i, `${modulePath} must not reference Unonight source`);
}

const metricGrounding = readFileSync(
  join(repoRoot, "lib/unonight/provider-adapter/metric-grounding.ts"),
  "utf8",
);
assert.doesNotMatch(metricGrounding, /classifyProviderCapabilityReadiness/);
assert.doesNotMatch(metricGrounding, /resolveProviderRecordFreshness/);
assert.doesNotMatch(metricGrounding, /resolveMetricBindingForRequestWithAliases/);
assert.match(metricGrounding, /buildUnonightMetricBindings/);
assert.match(metricGrounding, /member_statistics\./);

const normalize = readFileSync(join(repoRoot, "lib/unonight/provider-adapter/normalize.ts"), "utf8");
assert.doesNotMatch(normalize, /function resolveFreshness/);
assert.doesNotMatch(normalize, /function finalizeAuthenticatedE2eReadiness/);
assert.match(normalize, /classifyProviderCapabilityReadiness/);
assert.match(normalize, /selectExactCommandBriefSignals/);

const communityAnswer = readFileSync(
  join(repoRoot, "lib/companion-runtime/community-answer.ts"),
  "utf8",
);
assert.doesNotMatch(communityAnswer, /\bunonight\b/i);

for (const modulePath of adapterModules) {
  assert.doesNotMatch(
    readFileSync(join(repoRoot, modulePath), "utf8"),
    /resolveCompanionSemanticIntent/,
    `${modulePath} must not embed Core semantic resolver`,
  );
}

console.log("provider-layer-placement.test.ts: all assertions passed");

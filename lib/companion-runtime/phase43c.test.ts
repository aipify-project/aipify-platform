import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildCompanionFoundationCoverageArtifact,
  buildCompanionFoundationCoverageRegistry,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  assertCapabilityStatusSums,
  assertSourceClassificationSums,
  buildCanonicalCoverageSummaryFromParts,
  COMPANION_CANONICAL_COUNTING_MODEL,
} from "@/lib/companion-runtime/companion-foundation-coverage-summary";
import { mergeCommunityExternalAdapterIntoCommercial } from "@/lib/integration-intelligence/community/external-adapter-coverage-bridge";
import { buildCommercialCapabilityMatrix } from "@/lib/companion-runtime/v1-commercial-capability-matrix";
import { buildCompanionFoundationCoverageGaps } from "@/lib/companion-runtime/companion-foundation-coverage-gaps";
import { listAllRegisteredCapabilityIds } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { buildP1PriorityFreeze, reconcileCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-reconciliation";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";
import type { CompanionCoverageReadiness } from "@/lib/companion-runtime/companion-foundation-coverage-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const runtimeRoot = path.join(repoRoot, "lib/companion-runtime");

const modules = buildCompanionFoundationCoverageRegistry();
const reconciled = reconcileCoverageRegistry(modules);
const commercial = mergeCommunityExternalAdapterIntoCommercial(buildCommercialCapabilityMatrix());
const gaps = buildCompanionFoundationCoverageGaps(modules);
const artifact = buildCompanionFoundationCoverageArtifact();

const canonical = buildCanonicalCoverageSummaryFromParts({
  modules,
  reconciled,
  commercial,
  gaps,
  uniqueCapabilityIdsInModules: listAllRegisteredCapabilityIds(modules).length,
  sourceClassification: artifact.reconciliation_summary!.source_classification,
});

assert.equal(canonical.counting_model, COMPANION_CANONICAL_COUNTING_MODEL);

assert.equal(canonical.totals.modules, modules.length);
assert.equal(canonical.totals.reconciled_entries, reconciled.length);
assert.equal(artifact.summary.total_modules, canonical.totals.modules);
assert.equal(artifact.summary.total_capabilities, canonical.totals.commercial_capabilities);

const moduleReadinessSum = Object.values(canonical.module_readiness).reduce((a, b) => a + b, 0);
assert.equal(moduleReadinessSum, canonical.totals.modules, "module_readiness must sum to total_modules");

const scopeReadSum = Object.values(canonical.readiness_scope.read).reduce((a, b) => a + b, 0);
assert.equal(scopeReadSum, canonical.totals.modules, "readiness_scope.read must sum to total_modules");

const capabilitySum = Object.values(canonical.capability_status).reduce((a, b) => a + b, 0);
assert.equal(capabilitySum, canonical.totals.commercial_capabilities);
assert.ok(assertCapabilityStatusSums(canonical.capability_status, canonical.totals.commercial_capabilities));
assert.ok(assertSourceClassificationSums(canonical.source_classification, canonical.totals.reconciled_entries));

assert.notDeepEqual(canonical.module_readiness, canonical.capability_status as unknown as Record<CompanionCoverageReadiness, number>);

assert.ok(artifact.canonical_summary);
assert.deepEqual(artifact.canonical_summary!.module_readiness, canonical.module_readiness);
assert.deepEqual(artifact.canonical_summary!.capability_status, canonical.capability_status);

const p1 = buildP1PriorityFreeze(reconciled);
assert.equal(p1.packages.length, 10);

const coreTsFiles = fs.readdirSync(runtimeRoot).filter((name) => name.endsWith(".ts"));
assert.ok(coreTsFiles.includes("phase43c.test.ts"));
assert.ok(coreTsFiles.some((name) => name.endsWith(".test.ts")), "Core tests remain in companion-runtime");

const paths = writeCompanionFoundationCoverageArtifacts(artifact, repoRoot, fs, path);
for (const artifactPath of [paths.jsonPath, paths.p1Path, paths.knownGapsPath, paths.deprecatedPath, paths.markdownPath]) {
  assert.ok(fs.existsSync(artifactPath));
}

const parsed = JSON.parse(fs.readFileSync(paths.jsonPath, "utf8"));
assert.ok(parsed.canonical_summary);
assert.equal(
  Object.values(parsed.canonical_summary.module_readiness as Record<string, number>).reduce(
    (a, b) => a + b,
    0,
  ),
  parsed.summary.total_modules,
);

console.log("phase43c.test.ts passed");
console.log(`  counting_model: ${canonical.counting_model}`);
console.log(`  modules: ${canonical.totals.modules}`);
console.log(`  commercial_capabilities: ${canonical.totals.commercial_capabilities}`);
console.log(`  module_readiness connected: ${canonical.module_readiness.connected}`);
console.log(`  capability_status adapter_missing: ${canonical.capability_status.adapter_missing}`);
console.log(`  Core ts files in runtime root: ${coreTsFiles.length}`);

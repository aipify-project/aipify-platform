import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildCompanionFoundationCoverageArtifact,
  buildCompanionFoundationCoverageRegistry,
  summarizeCoverageReadiness,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  assertNoFalseProductionReady,
  buildCompanionFoundationCoverageGaps,
  countGapsByPriority,
} from "@/lib/companion-runtime/companion-foundation-coverage-gaps";
import {
  CANONICAL_READINESS_DEFINITIONS,
  CANONICAL_SOURCE_CLASSIFICATION_DEFINITIONS,
  DEPRECATED_REGISTRY_ENTRIES,
  SUPERSEDED_PROVIDER_MODULE_IDS,
  assertCanonicalReadinessOnly,
  assertNoFalseExactSource,
  buildP1PriorityFreeze,
  findDuplicateCanonicalCapabilityIds,
  reconcileCoverageRegistry,
} from "@/lib/companion-runtime/companion-foundation-coverage-reconciliation";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";
import type { CompanionCoverageReadiness } from "@/lib/companion-runtime/companion-foundation-coverage-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

const entries = buildCompanionFoundationCoverageRegistry();
const artifact = buildCompanionFoundationCoverageArtifact();
const reconciled = reconcileCoverageRegistry(entries);
const gaps = buildCompanionFoundationCoverageGaps(entries);

assert.equal(artifact.reconciliation_version, "companion-coverage-reconciliation-v1");
assert.ok(artifact.reconciled_entries);
assert.equal(artifact.reconciled_entries!.length, entries.length);
assert.ok(artifact.reconciliation_summary);
assert.ok(artifact.p1_priority_freeze);
assert.ok(artifact.known_gaps);
assert.ok(artifact.deprecated_registry);
assert.ok(artifact.duplicate_capabilities);

const canonicalReadiness = Object.keys(CANONICAL_READINESS_DEFINITIONS) as Exclude<
  CompanionCoverageReadiness,
  "placeholder"
>[];
assert.equal(canonicalReadiness.length, 10);
assert.ok(CANONICAL_SOURCE_CLASSIFICATION_DEFINITIONS.source_exact);
assert.ok(assertCanonicalReadinessOnly(reconciled));
assert.ok(assertNoFalseProductionReady(entries));
assert.ok(assertNoFalseExactSource(reconciled));

for (const entry of reconciled) {
  assert.ok(entry.source_classification, `${entry.module_id} missing source_classification`);
  assert.ok(entry.readiness_scope.read, `${entry.module_id} missing read scope`);
  assert.ok(entry.command_brief.signal_source, `${entry.module_id} missing command brief signal_source`);
  assert.ok(entry.panel_coverage.app, `${entry.module_id} missing panel_coverage`);

  if (entry.readiness === "production_ready") {
    assert.notEqual(entry.test_status, "missing", `${entry.module_id} production_ready without tests`);
    assert.notEqual(entry.schema_status, "missing", `${entry.module_id} production_ready without schema`);
    assert.ok(
      !["source_proxy", "source_seeded", "source_simulated", "source_missing"].includes(
        entry.source_classification,
      ),
      `${entry.module_id} production_ready with non-exact source`,
    );
  }

  if (["source_proxy", "source_seeded", "source_simulated"].includes(entry.source_classification)) {
    assert.notEqual(
      entry.readiness,
      "production_ready",
      `${entry.module_id} proxy/seeded/simulated cannot be production_ready`,
    );
  }
}

for (const moduleId of SUPERSEDED_PROVIDER_MODULE_IDS) {
  assert.equal(
    entries.some((entry) => entry.module_id === moduleId),
    false,
    `superseded module ${moduleId} must not appear in canonical registry`,
  );
}

const phase3842Modules = [
  "support.queue_read",
  "support.case_read",
  "support.response_draft",
  "support.case_write",
  "support.command_brief_signals",
  "hosts.property_read",
  "hosts.reservation_read",
  "hosts.operations_read",
  "hosts.finance_read",
  "hosts.task_write",
  "hosts.command_brief_signals",
  "directory.app_employee",
  "directory.crm_customer",
  "directory.supplier",
];

for (const moduleId of phase3842Modules) {
  const entry = reconciled.find((row) => row.module_id === moduleId);
  assert.ok(entry, `Phase 38–42 module ${moduleId} must exist`);
  assert.notEqual(entry!.readiness, "production_ready", `${moduleId} must not be false production_ready`);
}

const supportWrite = reconciled.find((row) => row.module_id === "support.case_write");
assert.ok(supportWrite);
assert.equal(supportWrite!.readiness, "production_ready_candidate");
assert.equal(supportWrite!.readiness_scope.write, "production_ready_candidate");
assert.ok(supportWrite!.capability_ids.some((id) => id.includes("assign")));

const hostsWrite = reconciled.find((row) => row.module_id === "hosts.task_write");
assert.ok(hostsWrite);
assert.equal(hostsWrite!.readiness, "production_ready_candidate");
assert.equal(hostsWrite!.readiness_scope.write, "production_ready_candidate");
assert.ok(hostsWrite!.capability_ids.some((id) => id.includes("host_task")));

const verificationQueue = reconciled.find((row) => row.module_id === "verification.queue_read");
assert.ok(verificationQueue);
assert.equal(verificationQueue!.readiness, "production_ready_candidate");
assert.ok(verificationQueue!.capability_ids.includes("verification_queue.read"));

const summary = artifact.reconciliation_summary!;
assert.equal(summary.total_modules, entries.length);
assert.equal(
  Object.values(summary.readiness).reduce((a, b) => a + b, 0),
  entries.length,
);
assert.equal(
  Object.values(summary.source_classification).reduce((a, b) => a + b, 0),
  entries.length,
);
assert.equal(summary.false_production_ready_violations, 0);
assert.ok(summary.phase_38_42_modules >= phase3842Modules.length);

const registryReadiness = summarizeCoverageReadiness(entries);
for (const key of Object.keys(registryReadiness) as CompanionCoverageReadiness[]) {
  assert.equal(summary.readiness[key], registryReadiness[key], `readiness count mismatch for ${key}`);
}

const p1 = buildP1PriorityFreeze(reconciled);
assert.equal(p1.version, "companion-p1-priority-freeze-v1");
assert.ok(p1.packages.length > 0);
assert.ok(p1.packages.length <= 10);
for (const pkg of p1.packages) {
  assert.ok(pkg.acceptance_criteria.length > 0, `${pkg.package_id} missing acceptance criteria`);
  assert.ok(pkg.why_p1.length > 0, `${pkg.package_id} missing why_p1`);
  assert.ok(["small", "medium", "large"].includes(pkg.estimated_complexity));
  if (!pkg.module_id.startsWith("certification.")) {
    const mod = reconciled.find((row) => row.module_id === pkg.module_id);
    assert.ok(mod, `P1 package references missing module ${pkg.module_id}`);
    assert.notEqual(mod!.readiness, "production_ready", `P1 package ${pkg.package_id} already complete`);
  }
}

assert.deepEqual(artifact.p1_priority_freeze!.packages.map((p) => p.package_id), p1.packages.map((p) => p.package_id));

const duplicates = findDuplicateCanonicalCapabilityIds(reconciled);
assert.ok(duplicates.length > 0, "duplicate capability tracking should list intentional overlaps");
for (const dup of duplicates) {
  assert.ok(dup.module_ids.length >= 2);
}

for (const deprecated of DEPRECATED_REGISTRY_ENTRIES) {
  assert.ok(deprecated.reason.length > 0);
  if (deprecated.kind === "merge_candidate" || deprecated.kind === "deprecated") {
    assert.ok(deprecated.canonical_replacement, `${deprecated.entry_id} needs replacement`);
  }
}

const paths = writeCompanionFoundationCoverageArtifacts(artifact, repoRoot, fs, path);
assert.ok(fs.existsSync(paths.jsonPath));
assert.ok(fs.existsSync(paths.p1Path));
assert.ok(fs.existsSync(paths.knownGapsPath));
assert.ok(fs.existsSync(paths.deprecatedPath));
assert.ok(fs.existsSync(paths.markdownPath));

const parsedP1 = JSON.parse(fs.readFileSync(paths.p1Path, "utf8"));
assert.equal(parsedP1.version, "companion-p1-priority-freeze-v1");
assert.ok(parsedP1.packages.length <= 10);

const parsedKnownGaps = JSON.parse(fs.readFileSync(paths.knownGapsPath, "utf8"));
assert.equal(parsedKnownGaps.version, "companion-known-gaps-v1");
assert.equal(parsedKnownGaps.total_gaps, gaps.length);

const parsedDeprecated = JSON.parse(fs.readFileSync(paths.deprecatedPath, "utf8"));
assert.equal(parsedDeprecated.version, "companion-deprecated-registry-v1");
assert.ok(parsedDeprecated.entries.length >= DEPRECATED_REGISTRY_ENTRIES.length);

const gapCounts = countGapsByPriority(gaps);
assert.ok(gapCounts.P1 + gapCounts.P2 + gapCounts.P3 > 0);

const orchestratorFiles = [
  "support-read-orchestrator.ts",
  "hosts-read-orchestrator.ts",
  "app-employee-read-orchestrator.ts",
  "crm-customer-read-orchestrator.ts",
  "supplier-vendor-read-orchestrator.ts",
];
for (const file of orchestratorFiles) {
  assert.ok(
    fs.existsSync(path.join(repoRoot, "lib/companion-runtime", file)),
    `existing orchestrator ${file} must remain — Phase 43 does not add providers`,
  );
}

console.log("phase43.test.ts passed");
console.log(`  modules: ${entries.length}`);
console.log(`  reconciled: ${reconciled.length}`);
console.log(`  P1 freeze: ${p1.packages.length} packages`);
console.log(`  gaps P0=${gapCounts.P0} P1=${gapCounts.P1} P2=${gapCounts.P2} P3=${gapCounts.P3}`);
console.log(`  production_ready: ${summary.readiness.production_ready}`);

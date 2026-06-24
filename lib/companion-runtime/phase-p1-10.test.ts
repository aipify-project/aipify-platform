import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { buildCompanionFoundationCoverageRegistry, buildCompanionFoundationCoverageArtifact } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { assertNoFalseProductionReady } from "@/lib/companion-runtime/companion-foundation-coverage-gaps";
import {
  assertCanonicalReadinessOnly,
  assertNoFalseExactSource,
  buildP1PriorityFreeze,
  reconcileCoverageRegistry,
} from "@/lib/companion-runtime/companion-foundation-coverage-reconciliation";
import { writeCompanionFoundationCoverageArtifacts } from "@/lib/companion-runtime/companion-foundation-coverage-report";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import {
  LOCKED_P1_PACKAGE_DEFINITIONS,
} from "@/lib/companion-runtime/p1-10-locked-p1-coverage-audit";
import {
  P1_10_LOCKED_P1_COVERAGE_ARTIFACT_FILENAME,
  readP1_10LockedP1CoverageCertificationArtifact,
  runP1_10LockedP1CoverageCertification,
  writeP1_10LockedP1CoverageCertificationArtifact,
} from "@/lib/companion-runtime/p1-10-locked-p1-coverage-certification";
import {
  P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION,
  P1_10_LOCKED_SEQUENCE_LABEL,
} from "@/lib/companion-runtime/p1-10-locked-p1-coverage-certification-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

function runTest(relativePath: string): boolean {
  const result = spawnSync("npx", ["--yes", "tsx", relativePath], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
  }
  return result.status === 0;
}

function main() {

  const phase43Pass = runTest("lib/companion-runtime/phase43.test.ts");
  const phase43bPass = runTest("lib/companion-runtime/phase43b.test.ts");

  for (const definition of LOCKED_P1_PACKAGE_DEFINITIONS) {
    const pass = runTest(`lib/companion-runtime/${definition.test_file}`);
    assert.ok(pass, `${definition.test_file} must pass for P1.10 certification`);
  }

  const typecheck = spawnSync("npm", ["run", "typecheck"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192" },
  });
  const typecheckPass = typecheck.status === 0;
  if (!typecheckPass) {
    console.error(typecheck.stdout);
    console.error(typecheck.stderr);
  }

  const artifact = runP1_10LockedP1CoverageCertification(repoRoot, {
    phase43: phase43Pass ? "pass" : "fail",
    phase43b: phase43bPass ? "pass" : "fail",
    typecheck: typecheckPass ? "pass" : "not_run",
  });

  assert.equal(artifact.version, P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION);
  assert.equal(artifact.locked_sequence, P1_10_LOCKED_SEQUENCE_LABEL);
  assert.equal(artifact.max_readiness_certified, "production_ready_candidate");
  assert.equal(artifact.package_audits.length, 9);

  const artifactPath = writeP1_10LockedP1CoverageCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_10_LOCKED_P1_COVERAGE_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized));

  const entries = buildCompanionFoundationCoverageRegistry();
  const reconciled = reconcileCoverageRegistry(entries);
  assert.ok(assertCanonicalReadinessOnly(reconciled));
  assert.ok(assertNoFalseProductionReady(entries));
  assert.ok(assertNoFalseExactSource(reconciled));

  const p1Freeze = buildP1PriorityFreeze(reconciled);
  const p1_10 = p1Freeze.packages.find((pkg) => pkg.package_id === "p1.10_locked_p1_coverage_certification");
  assert.ok(p1_10, "P1 freeze must include p1.10_locked_p1_coverage_certification");

  writeCompanionFoundationCoverageArtifacts(buildCompanionFoundationCoverageArtifact(), repoRoot, fs, path);

  if (!phase43Pass || !phase43bPass || !typecheckPass) {
    console.error("phase-p1-10.test.ts failed — prerequisite tests did not all pass.");
    process.exit(1);
  }

  if (artifact.overall_status !== "pass") {
    console.error("phase-p1-10.test.ts failed — locked P1 coverage audit did not pass.");
    for (const blocker of artifact.blockers) {
      console.error(`  blocker: ${blocker}`);
    }
    process.exit(1);
  }

  for (const audit of artifact.package_audits) {
    assert.equal(audit.status, "pass", `${audit.phase} package audit must pass`);
    assert.equal(audit.artifact_status, "pass");
    assert.notEqual(audit.classification, "production_ready");
  }

  const persisted = readP1_10LockedP1CoverageCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-10.test.ts passed");
  console.log(`  locked_sequence: ${artifact.locked_sequence}`);
  console.log(`  packages_certified: ${artifact.packages_certified}/9`);
  console.log(`  registry_modules_audited: ${artifact.registry_modules_audited}`);
  console.log(`  open_deviations: ${artifact.open_deviations.length}`);
}

main();

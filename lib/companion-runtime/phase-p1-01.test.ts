import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  assertCompanionCoreCustomerNamesForbidden,
  scanCompanionCoreForForbiddenCustomerNames,
} from "@/lib/companion-runtime/companion-core-customer-name-invariant";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  P1_01_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1LiveE2eArtifact,
  readP1LiveE2eCertificationArtifact,
  runP1LiveAppE2eCertification,
  writeP1LiveE2eCertificationArtifact,
} from "@/lib/companion-runtime/p1-01-live-app-e2e-certification";
import {
  formatP1LiveE2eAuthDiagnostics,
  buildP1LiveE2eAuthDiagnostics,
} from "@/lib/companion-runtime/p1-01-live-app-e2e-diagnostics";
import {
  loadP1LiveE2eEnvFiles,
  normalizeP1LiveE2eEmail,
  resolveP1LiveE2eConfig,
} from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import { P1_01_LIVE_E2E_CERTIFICATION_VERSION } from "@/lib/companion-runtime/p1-01-live-app-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);
  assert.ok(assertCompanionCoreCustomerNamesForbidden(repoRoot));
  assert.equal(scanCompanionCoreForForbiddenCustomerNames(repoRoot).length, 0);
  assert.equal(normalizeP1LiveE2eEmail("  Owner@Example.COM  "), "owner@example.com");

  const diagnostics = buildP1LiveE2eAuthDiagnostics();
  for (const line of formatP1LiveE2eAuthDiagnostics(diagnostics)) {
    console.log(`  ${line}`);
  }

  const { config } = resolveP1LiveE2eConfig();
  const artifact = config ? await runP1LiveAppE2eCertification() : buildBlockedP1LiveE2eArtifact();

  assert.equal(artifact.version, P1_01_LIVE_E2E_CERTIFICATION_VERSION);
  const artifactPath = writeP1LiveE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_01_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    assert.ok(artifact.blockers.length > 0);
    console.log("phase-p1-01.test.ts blocked — live E2E environment not configured.");
    for (const blocker of artifact.blockers) {
      console.log(`  blocker: ${blocker.code} (${blocker.required_variable ?? "n/a"})`);
    }
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-01.test.ts blocked — authenticated live session could not be established.");
    for (const blocker of artifact.blockers) {
      console.log(`  blocker: ${blocker.code}`);
      console.log(`  message: ${blocker.message}`);
    }
    process.exit(0);
  }

  assert.equal(artifact.session_mode, "live_authenticated");
  assert.ok(artifact.organization_reference);
  assert.ok(artifact.commit_hash);

  const requiredFlows = [
    "auth_login",
    "organization_context",
    "entitlement_permissions",
    "companion_context",
    "command_brief",
    "employee_directory_search",
    "crm_directory_search",
    "supplier_directory_search",
    "exact_compatible_live_read",
    "source_freshness",
  ];

  for (const flowId of requiredFlows) {
    assert.ok(
      artifact.flows.some((flow) => flow.flow_id === flowId),
      `missing flow ${flowId}`,
    );
  }

  const requiredIsolation = [
    "manipulated_organization_id_rejected",
    "cross_tenant_entity_id_rejected",
    "missing_membership_rejected",
    "suspended_app_no_data",
  ];

  for (const checkId of requiredIsolation) {
    assert.ok(
      artifact.tenant_isolation.some((check) => check.check_id === checkId),
      `missing isolation check ${checkId}`,
    );
  }

  if (artifact.overall_status !== "pass") {
    const failedFlows = artifact.flows.filter((flow) => flow.status === "fail");
    const failedIsolation = artifact.tenant_isolation.filter((check) => check.status === "fail");
    console.error("phase-p1-01.test.ts failed — live certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  const updatedModules = artifact.coverage_updates_applied;
  for (const moduleId of updatedModules) {
    const entry = registry.find((row) => row.module_id === moduleId);
    assert.ok(entry, `missing registry module ${moduleId}`);
    assert.equal(
      entry!.readiness,
      "production_ready_candidate",
      `${moduleId} should advance to production_ready_candidate`,
    );
    assert.notEqual(entry!.readiness, "production_ready");
  }

  const persisted = readP1LiveE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-01.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${updatedModules.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

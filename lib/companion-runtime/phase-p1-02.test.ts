import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import {
  ensureP1_01LiveE2ePrerequisite,
  readP1_02LiveAppEmployeeE2eCertificationArtifact,
  runP1_02LiveAppEmployeeE2eCertification,
  writeP1_02LiveAppEmployeeE2eCertificationArtifact,
  P1_02_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1_02LiveAppEmployeeE2eArtifact,
} from "@/lib/companion-runtime/p1-02-live-app-employee-e2e-certification";
import { P1_02_LIVE_E2E_MODULE_REQUIREMENTS } from "@/lib/companion-runtime/p1-02-live-app-employee-e2e-coverage";
import { P1_02_LIVE_E2E_CERTIFICATION_VERSION } from "@/lib/companion-runtime/p1-02-live-app-employee-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);

  const { config } = resolveP1LiveE2eConfig();
  if (config) {
    await ensureP1_01LiveE2ePrerequisite(repoRoot);
  }

  const artifact = config
    ? await runP1_02LiveAppEmployeeE2eCertification(repoRoot)
    : buildBlockedP1_02LiveAppEmployeeE2eArtifact();

  assert.equal(artifact.version, P1_02_LIVE_E2E_CERTIFICATION_VERSION);
  const artifactPath = writeP1_02LiveAppEmployeeE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_02_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    assert.ok(artifact.blockers.length > 0);
    console.log("phase-p1-02.test.ts blocked — live E2E environment not configured.");
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-02.test.ts blocked — prerequisite or authenticated session unavailable.");
    console.log(`  p1_01_prerequisite: ${artifact.p1_01_prerequisite}`);
    for (const blocker of artifact.blockers) {
      console.log(`  blocker: ${blocker.code}`);
      console.log(`  message: ${blocker.message}`);
    }
    process.exit(0);
  }

  assert.equal(artifact.p1_01_prerequisite, "pass");
  assert.equal(artifact.session_mode, "live_authenticated");
  assert.ok(artifact.organization_reference);
  assert.ok(artifact.commit_hash);

  const requiredFlows = [
    "live_provider_connected",
    "search_by_name",
    "owner_admin_permission",
    "unknown_employee_exact_empty",
    "access_missing_membership_denied",
    "access_suspended_denied",
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
    console.error("phase-p1-02.test.ts failed — live employee directory certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  const requiredCapabilities = P1_02_LIVE_E2E_MODULE_REQUIREMENTS["directory.app_employee"] ?? [];
  for (const capability of requiredCapabilities) {
    assert.ok(
      artifact.capabilities_passed.includes(capability),
      `missing passed capability ${capability}`,
    );
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  const employeeModule = registry.find((row) => row.module_id === "directory.app_employee");
  assert.ok(employeeModule, "missing directory.app_employee registry entry");
  assert.equal(employeeModule!.readiness, "production_ready_candidate");
  assert.notEqual(employeeModule!.readiness, "production_ready");

  assert.ok(artifact.coverage_updates_applied.includes("directory.app_employee"));

  const persisted = readP1_02LiveAppEmployeeE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-02.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${artifact.coverage_updates_applied.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  assertCompanionCoreCustomerNamesForbidden,
  scanCompanionCoreForForbiddenCustomerNames,
} from "@/lib/companion-runtime/companion-core-customer-name-invariant";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import { readP1LiveE2eCertificationArtifact } from "@/lib/companion-runtime/p1-01-live-app-e2e-certification";
import {
  runP1_07LiveAppHostsTaskWriteE2eCertification,
  writeP1_07LiveAppHostsTaskWriteE2eCertificationArtifact,
  P1_07_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1_07LiveAppHostsTaskWriteE2eArtifact,
  readP1_07LiveAppHostsTaskWriteE2eCertificationArtifact,
} from "@/lib/companion-runtime/p1-07-live-app-hosts-task-write-e2e-certification";
import { P1_07_LIVE_E2E_MODULE_REQUIREMENTS } from "@/lib/companion-runtime/p1-07-live-app-hosts-task-write-e2e-coverage";
import {
  P1_07_CLEANING_ASSIGN_WRITE_SOURCE,
  P1_07_HOST_TASK_WRITE_SOURCE,
  P1_07_MAINTENANCE_CREATE_WRITE_SOURCE,
  P1_07_LIVE_E2E_CERTIFICATION_VERSION,
} from "@/lib/companion-runtime/p1-07-live-app-hosts-task-write-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);
  assert.ok(assertCompanionCoreCustomerNamesForbidden(repoRoot));
  assert.equal(scanCompanionCoreForForbiddenCustomerNames(repoRoot).length, 0);

  const p1_01 = readP1LiveE2eCertificationArtifact(repoRoot);
  if (p1_01?.overall_status !== "pass") {
    console.log("phase-p1-07.test.ts blocked — P1.01 prerequisite artifact is not pass.");
    process.exit(0);
  }

  const { config } = resolveP1LiveE2eConfig();
  const artifact = config
    ? await runP1_07LiveAppHostsTaskWriteE2eCertification(repoRoot)
    : buildBlockedP1_07LiveAppHostsTaskWriteE2eArtifact();

  assert.equal(artifact.version, P1_07_LIVE_E2E_CERTIFICATION_VERSION);
  assert.equal(artifact.host_task_write_source, P1_07_HOST_TASK_WRITE_SOURCE);
  assert.equal(artifact.cleaning_assign_write_source, P1_07_CLEANING_ASSIGN_WRITE_SOURCE);
  assert.equal(artifact.maintenance_create_write_source, P1_07_MAINTENANCE_CREATE_WRITE_SOURCE);
  const artifactPath = writeP1_07LiveAppHostsTaskWriteE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_07_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    console.log("phase-p1-07.test.ts blocked — live E2E environment not configured.");
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-07.test.ts blocked — prerequisite or authenticated session unavailable.");
    console.log(`  p1_01_prerequisite: ${artifact.p1_01_prerequisite}`);
    for (const blocker of artifact.blockers) {
      console.log(`  blocker: ${blocker.code}`);
    }
    process.exit(0);
  }

  assert.equal(artifact.p1_01_prerequisite, "pass");
  assert.equal(artifact.session_mode, "live_authenticated");
  assert.ok(artifact.organization_reference);
  assert.ok(artifact.commit_hash);
  assert.ok(artifact.controlled_probe_tasks_created >= 2);
  assert.equal(artifact.cleanup_completed, true);

  const requiredFlows = [
    "write_source_host_task_live",
    "write_source_cleaning_assign_live",
    "write_source_maintenance_create_live",
    "confirmation_gate",
    "approval_gate",
    "create_host_task_live",
    "assign_cleaning_live",
    "create_maintenance_live",
    "permission_denied_create",
    "suspended_app_denied",
    "blocked_capabilities",
    "audit_without_pii",
    "probe_cleanup_completed",
  ];

  for (const flowId of requiredFlows) {
    assert.ok(artifact.flows.some((flow) => flow.flow_id === flowId), `missing flow ${flowId}`);
  }

  const requiredIsolation = [
    "manipulated_organization_id_rejected",
    "missing_entitlement_rejected",
    "suspended_app_no_write",
  ];

  for (const checkId of requiredIsolation) {
    assert.ok(
      artifact.tenant_isolation.some((check) => check.check_id === checkId),
      `missing isolation check ${checkId}`,
    );
  }

  assert.ok(
    artifact.idempotency.some((check) => check.check_id === "duplicate_host_task_retry"),
    "missing idempotency check duplicate_host_task_retry",
  );

  assert.ok(
    artifact.cleanup.some((check) => check.check_id === "host_task_probe_cancelled"),
    "missing cleanup check host_task_probe_cancelled",
  );
  assert.ok(
    artifact.cleanup.some((check) => check.check_id === "maintenance_probe_closed"),
    "missing cleanup check maintenance_probe_closed",
  );

  if (artifact.overall_status !== "pass") {
    const failedFlows = artifact.flows.filter((flow) => flow.status === "fail");
    const failedIsolation = artifact.tenant_isolation.filter((check) => check.status === "fail");
    const failedIdempotency = artifact.idempotency.filter((check) => check.status === "fail");
    const failedCleanup = artifact.cleanup.filter((check) => check.status === "fail");
    console.error("phase-p1-07.test.ts failed — live Hosts task write certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    for (const check of failedIdempotency) {
      console.error(`  idempotency ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    for (const check of failedCleanup) {
      console.error(`  cleanup ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_07_LIVE_E2E_MODULE_REQUIREMENTS)) {
    for (const capability of requiredCapabilities) {
      assert.ok(
        artifact.capabilities_passed.includes(capability),
        `missing passed capability ${capability} for ${moduleId}`,
      );
    }
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  const writeModule = registry.find((row) => row.module_id === "hosts.task_write");
  assert.ok(writeModule, "missing hosts.task_write registry entry");
  assert.equal(writeModule!.readiness, "production_ready_candidate");
  assert.ok(artifact.coverage_updates_applied.includes("hosts.task_write"));

  const persisted = readP1_07LiveAppHostsTaskWriteE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-07.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  host_task_write_source: ${artifact.host_task_write_source}`);
  console.log(`  cleaning_assign_write_source: ${artifact.cleaning_assign_write_source}`);
  console.log(`  maintenance_create_write_source: ${artifact.maintenance_create_write_source}`);
  console.log(`  controlled_probe_tasks_created: ${artifact.controlled_probe_tasks_created}`);
  console.log(`  cleanup_completed: ${artifact.cleanup_completed}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${artifact.coverage_updates_applied.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import { readP1LiveE2eCertificationArtifact } from "@/lib/companion-runtime/p1-01-live-app-e2e-certification";
import {
  runP1_08LiveAppMemberVerificationE2eCertification,
  writeP1_08LiveAppMemberVerificationE2eCertificationArtifact,
  P1_08_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1_08LiveAppMemberVerificationE2eArtifact,
  readP1_08LiveAppMemberVerificationE2eCertificationArtifact,
} from "@/lib/companion-runtime/p1-08-live-app-member-verification-e2e-certification";
import { P1_08_LIVE_E2E_MODULE_REQUIREMENTS } from "@/lib/companion-runtime/p1-08-live-app-member-verification-e2e-coverage";
import {
  P1_08_AUTHORITATIVE_VERIFICATION_SOURCE,
  P1_08_LIVE_E2E_CERTIFICATION_VERSION,
} from "@/lib/companion-runtime/p1-08-live-app-member-verification-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);

  const p1_01 = readP1LiveE2eCertificationArtifact(repoRoot);
  if (p1_01?.overall_status !== "pass") {
    console.log("phase-p1-08.test.ts blocked — P1.01 prerequisite artifact is not pass.");
    process.exit(0);
  }

  const { config } = resolveP1LiveE2eConfig();
  const artifact = config
    ? await runP1_08LiveAppMemberVerificationE2eCertification(repoRoot)
    : buildBlockedP1_08LiveAppMemberVerificationE2eArtifact();

  assert.equal(artifact.version, P1_08_LIVE_E2E_CERTIFICATION_VERSION);
  assert.equal(artifact.authoritative_verification_source, P1_08_AUTHORITATIVE_VERIFICATION_SOURCE);
  const artifactPath = writeP1_08LiveAppMemberVerificationE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_08_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    console.log("phase-p1-08.test.ts blocked — live E2E environment not configured.");
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-08.test.ts blocked — prerequisite or authenticated session unavailable.");
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

  const requiredFlows = [
    "provider_connected",
    "live_verification_source_available",
    "orchestrator_queue_read",
    "command_brief_verification_signals_exact_only",
    "no_fabricated_cases",
    "empty_source_exact_empty",
    "permission_denied_read",
    "suspended_app_denied",
    "blocked_capabilities",
    "audit_without_pii",
  ];

  for (const flowId of requiredFlows) {
    assert.ok(artifact.flows.some((flow) => flow.flow_id === flowId), `missing flow ${flowId}`);
  }

  const requiredIsolation = [
    "manipulated_organization_id_rejected",
    "inactive_provider_rejected",
    "suspended_app_no_read",
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
    console.error("phase-p1-08.test.ts failed — live member verification certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_08_LIVE_E2E_MODULE_REQUIREMENTS)) {
    for (const capability of requiredCapabilities) {
      assert.ok(
        artifact.capabilities_passed.includes(capability),
        `missing passed capability ${capability} for ${moduleId}`,
      );
    }
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  for (const moduleId of Object.keys(P1_08_LIVE_E2E_MODULE_REQUIREMENTS)) {
    const entry = registry.find((row) => row.module_id === moduleId);
    assert.ok(entry, `missing ${moduleId} registry entry`);
    assert.equal(entry!.readiness, "production_ready_candidate");
    assert.ok(artifact.coverage_updates_applied.includes(moduleId));
  }

  const persisted = readP1_08LiveAppMemberVerificationE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-08.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  authoritative_verification_source: ${artifact.authoritative_verification_source}`);
  console.log(`  live_pending_count: ${artifact.live_pending_count}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${artifact.coverage_updates_applied.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

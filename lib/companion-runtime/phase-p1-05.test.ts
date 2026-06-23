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
  runP1_05LiveAppSupportSlaE2eCertification,
  writeP1_05LiveAppSupportSlaE2eCertificationArtifact,
  P1_05_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1_05LiveAppSupportSlaE2eArtifact,
  readP1_05LiveAppSupportSlaE2eCertificationArtifact,
} from "@/lib/companion-runtime/p1-05-live-app-support-sla-e2e-certification";
import { P1_05_LIVE_E2E_MODULE_REQUIREMENTS } from "@/lib/companion-runtime/p1-05-live-app-support-sla-e2e-coverage";
import {
  P1_05_AUTHORITATIVE_SLA_SOURCE,
  P1_05_LIVE_E2E_CERTIFICATION_VERSION,
} from "@/lib/companion-runtime/p1-05-live-app-support-sla-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);
  assert.ok(assertCompanionCoreCustomerNamesForbidden(repoRoot));
  assert.equal(scanCompanionCoreForForbiddenCustomerNames(repoRoot).length, 0);

  const p1_01 = readP1LiveE2eCertificationArtifact(repoRoot);
  if (p1_01?.overall_status !== "pass") {
    console.log("phase-p1-05.test.ts blocked — P1.01 prerequisite artifact is not pass.");
    process.exit(0);
  }

  const { config } = resolveP1LiveE2eConfig();
  const artifact = config
    ? await runP1_05LiveAppSupportSlaE2eCertification(repoRoot)
    : buildBlockedP1_05LiveAppSupportSlaE2eArtifact();

  assert.equal(artifact.version, P1_05_LIVE_E2E_CERTIFICATION_VERSION);
  assert.equal(artifact.authoritative_sla_source, P1_05_AUTHORITATIVE_SLA_SOURCE);
  const artifactPath = writeP1_05LiveAppSupportSlaE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_05_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    console.log("phase-p1-05.test.ts blocked — live E2E environment not configured.");
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-05.test.ts blocked — prerequisite or authenticated session unavailable.");
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
    "live_sla_source_available",
    "missing_policy_unavailable",
    "no_fabricated_deadlines",
    "command_brief_sla_signals_exact_only",
    "access_missing_entitlement_denied",
    "access_suspended_denied",
  ];

  for (const flowId of requiredFlows) {
    assert.ok(artifact.flows.some((flow) => flow.flow_id === flowId), `missing flow ${flowId}`);
  }

  const requiredIsolation = [
    "manipulated_organization_id_rejected",
    "missing_entitlement_rejected",
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
    console.error("phase-p1-05.test.ts failed — live support SLA certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  for (const [moduleId, requiredCapabilities] of Object.entries(P1_05_LIVE_E2E_MODULE_REQUIREMENTS)) {
    for (const capability of requiredCapabilities) {
      assert.ok(
        artifact.capabilities_passed.includes(capability),
        `missing passed capability ${capability} for ${moduleId}`,
      );
    }
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  const queueModule = registry.find((row) => row.module_id === "support.queue_read");
  const briefModule = registry.find((row) => row.module_id === "support.command_brief_signals");
  assert.ok(queueModule, "missing support.queue_read registry entry");
  assert.ok(briefModule, "missing support.command_brief_signals registry entry");
  assert.equal(queueModule!.readiness, "production_ready_candidate");
  assert.equal(briefModule!.readiness, "production_ready_candidate");
  assert.ok(artifact.coverage_updates_applied.includes("support.queue_read"));
  assert.ok(artifact.coverage_updates_applied.includes("support.command_brief_signals"));

  const persisted = readP1_05LiveAppSupportSlaE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-05.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  authoritative_sla_source: ${artifact.authoritative_sla_source}`);
  console.log(`  sla_policy_configured: ${artifact.sla_policy_configured}`);
  console.log(`  live_open_case_count: ${artifact.live_open_case_count}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${artifact.coverage_updates_applied.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

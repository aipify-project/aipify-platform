import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { loadP1LiveE2eEnvFiles, resolveP1LiveE2eConfig } from "@/lib/companion-runtime/p1-01-live-app-e2e-env";
import { assertArtifactContainsNoSecrets } from "@/lib/companion-runtime/p1-01-live-app-e2e-session";
import { readP1LiveE2eCertificationArtifact } from "@/lib/companion-runtime/p1-01-live-app-e2e-certification";
import {
  runP1_04LiveAppSupplierVendorE2eCertification,
  writeP1_04LiveAppSupplierVendorE2eCertificationArtifact,
  P1_04_LIVE_E2E_ARTIFACT_FILENAME,
  buildBlockedP1_04LiveAppSupplierVendorE2eArtifact,
  readP1_04LiveAppSupplierVendorE2eCertificationArtifact,
} from "@/lib/companion-runtime/p1-04-live-app-supplier-vendor-e2e-certification";
import { P1_04_LIVE_E2E_MODULE_REQUIREMENTS } from "@/lib/companion-runtime/p1-04-live-app-supplier-vendor-e2e-coverage";
import { P1_04_LIVE_E2E_CERTIFICATION_VERSION } from "@/lib/companion-runtime/p1-04-live-app-supplier-vendor-e2e-types";

const repoRoot = path.join(import.meta.dirname, "..", "..");

async function main() {
  loadP1LiveE2eEnvFiles(repoRoot);

  const p1_01 = readP1LiveE2eCertificationArtifact(repoRoot);
  if (p1_01?.overall_status !== "pass") {
    console.log("phase-p1-04.test.ts blocked — P1.01 prerequisite artifact is not pass.");
    process.exit(0);
  }

  const { config } = resolveP1LiveE2eConfig();
  const artifact = config
    ? await runP1_04LiveAppSupplierVendorE2eCertification(repoRoot)
    : buildBlockedP1_04LiveAppSupplierVendorE2eArtifact();

  assert.equal(artifact.version, P1_04_LIVE_E2E_CERTIFICATION_VERSION);
  const artifactPath = writeP1_04LiveAppSupplierVendorE2eCertificationArtifact(artifact, repoRoot);
  assert.ok(fs.existsSync(artifactPath));
  assert.equal(path.basename(artifactPath), P1_04_LIVE_E2E_ARTIFACT_FILENAME);

  const serialized = fs.readFileSync(artifactPath, "utf8");
  assert.ok(assertArtifactContainsNoSecrets(serialized), "artifact must not contain secrets");

  if (!config) {
    assert.equal(artifact.overall_status, "blocked");
    console.log("phase-p1-04.test.ts blocked — live E2E environment not configured.");
    process.exit(0);
  }

  if (artifact.overall_status === "blocked") {
    console.log("phase-p1-04.test.ts blocked — prerequisite or authenticated session unavailable.");
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
    "live_provider_connected",
    "search_supplier_by_name",
    "search_by_organization_number",
    "search_contact_person",
    "unknown_supplier_exact_empty",
    "supplier_not_customer_or_partner",
    "marketplace_not_active_supplier",
    "empty_source_no_constructed_suppliers",
    "access_missing_entitlement_denied",
    "access_suspended_denied",
  ];

  for (const flowId of requiredFlows) {
    assert.ok(artifact.flows.some((flow) => flow.flow_id === flowId), `missing flow ${flowId}`);
  }

  const requiredIsolation = [
    "manipulated_organization_id_rejected",
    "cross_tenant_entity_id_rejected",
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
    console.error("phase-p1-04.test.ts failed — live supplier vendor directory certification did not pass.");
    for (const flow of failedFlows) {
      console.error(`  flow ${flow.flow_id}: ${flow.failure_reason ?? "failed"}`);
    }
    for (const check of failedIsolation) {
      console.error(`  isolation ${check.check_id}: ${check.failure_reason ?? "failed"}`);
    }
    process.exit(1);
  }

  const requiredCapabilities = P1_04_LIVE_E2E_MODULE_REQUIREMENTS["directory.supplier"] ?? [];
  for (const capability of requiredCapabilities) {
    assert.ok(
      artifact.capabilities_passed.includes(capability),
      `missing passed capability ${capability}`,
    );
  }

  const registry = buildCompanionFoundationCoverageRegistry();
  const supplierModule = registry.find((row) => row.module_id === "directory.supplier");
  assert.ok(supplierModule, "missing directory.supplier registry entry");
  assert.equal(supplierModule!.readiness, "production_ready_candidate");
  assert.notEqual(supplierModule!.readiness, "production_ready");
  assert.ok(artifact.coverage_updates_applied.includes("directory.supplier"));

  const persisted = readP1_04LiveAppSupplierVendorE2eCertificationArtifact(repoRoot);
  assert.ok(persisted);
  assert.equal(persisted!.overall_status, "pass");

  console.log("phase-p1-04.test.ts passed");
  console.log(`  environment: ${artifact.environment}`);
  console.log(`  organization_reference: ${artifact.organization_reference}`);
  console.log(`  live_supplier_candidate_count: ${artifact.live_supplier_candidate_count}`);
  console.log(`  capabilities_passed: ${artifact.capabilities_passed.join(", ")}`);
  console.log(`  coverage_updates_applied: ${artifact.coverage_updates_applied.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

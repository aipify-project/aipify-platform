import fs from "node:fs";
import path from "node:path";
import { assertNoFalseProductionReady } from "./companion-foundation-coverage-gaps";
import { reconcileCoverageRegistry } from "./companion-foundation-coverage-reconciliation";
import type { CompanionCoverageReconciledEntry } from "./companion-foundation-coverage-types";
import { buildCompanionFoundationCoverageRegistry } from "./companion-foundation-coverage-registry";
import { P1_01_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-01-live-app-e2e-coverage";
import { readP1LiveE2eCertificationArtifact } from "./p1-01-live-app-e2e-certification";
import { P1_02_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-02-live-app-employee-e2e-coverage";
import { readP1_02LiveAppEmployeeE2eCertificationArtifact } from "./p1-02-live-app-employee-e2e-certification";
import { P1_03_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-03-live-app-crm-customer-e2e-coverage";
import { readP1_03LiveAppCrmCustomerE2eCertificationArtifact } from "./p1-03-live-app-crm-customer-e2e-certification";
import { P1_04_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-04-live-app-supplier-vendor-e2e-coverage";
import { readP1_04LiveAppSupplierVendorE2eCertificationArtifact } from "./p1-04-live-app-supplier-vendor-e2e-certification";
import { P1_05_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-05-live-app-support-sla-e2e-coverage";
import { readP1_05LiveAppSupportSlaE2eCertificationArtifact } from "./p1-05-live-app-support-sla-e2e-certification";
import { P1_06_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-06-live-app-support-case-write-e2e-coverage";
import { readP1_06LiveAppSupportCaseWriteE2eCertificationArtifact } from "./p1-06-live-app-support-case-write-e2e-certification";
import { P1_07_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-07-live-app-hosts-task-write-e2e-coverage";
import { readP1_07LiveAppHostsTaskWriteE2eCertificationArtifact } from "./p1-07-live-app-hosts-task-write-e2e-certification";
import { P1_08_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-08-live-app-member-verification-e2e-coverage";
import { readP1_08LiveAppMemberVerificationE2eCertificationArtifact } from "./p1-08-live-app-member-verification-e2e-certification";
import { P1_09_LIVE_E2E_MODULE_REQUIREMENTS } from "./p1-09-live-app-community-member-directory-e2e-coverage";
import { readP1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact } from "./p1-09-live-app-community-member-directory-e2e-certification";
import type {
  P1_10LockedP1CoverageCertificationArtifact,
  P1_10OpenDeviation,
  P1_10PackageAuditResult,
} from "./p1-10-locked-p1-coverage-certification-types";
import type { CompanionCoverageReadiness } from "./companion-foundation-coverage-types";

type P1ArtifactSnapshot = {
  overall_status: string;
  commit_hash: string | null;
  capabilities_passed: readonly string[];
  coverage_updates_applied: readonly string[];
};

type LockedP1PackageDefinition = {
  priority_order: number;
  package_id: string;
  phase: string;
  artifact_filename: string;
  test_file: string;
  read_write_scope: P1_10PackageAuditResult["read_write_scope"];
  module_requirements: Readonly<Record<string, readonly string[]>>;
  readArtifact: (repoRoot: string) => P1ArtifactSnapshot | null;
};

const FORBIDDEN_SOURCE_CLASSIFICATIONS = new Set([
  "source_proxy",
  "source_seeded",
  "source_simulated",
]);

const CERTIFIED_READINESS: ReadonlySet<CompanionCoverageReadiness> = new Set([
  "production_ready_candidate",
  "connected",
]);

export const LOCKED_P1_PACKAGE_DEFINITIONS: readonly LockedP1PackageDefinition[] = [
  {
    priority_order: 1,
    package_id: "p1.01_live_app_e2e_certification",
    phase: "P1.01",
    artifact_filename: "companion-p1-01-live-e2e-certification-v1.json",
    test_file: "phase-p1-01.test.ts",
    read_write_scope: "read_certification",
    module_requirements: P1_01_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1LiveE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 2,
    package_id: "p1.02_directory_app_employee_e2e",
    phase: "P1.02",
    artifact_filename: "companion-p1-02-live-app-employee-e2e-certification-v1.json",
    test_file: "phase-p1-02.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_02_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_02LiveAppEmployeeE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 3,
    package_id: "p1.03_directory_crm_customer_close_partial",
    phase: "P1.03",
    artifact_filename: "companion-p1-03-live-app-crm-customer-e2e-certification-v1.json",
    test_file: "phase-p1-03.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_03_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_03LiveAppCrmCustomerE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 4,
    package_id: "p1.04_directory_supplier_vendor_close_partial",
    phase: "P1.04",
    artifact_filename: "companion-p1-04-live-app-supplier-vendor-e2e-certification-v1.json",
    test_file: "phase-p1-04.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_04_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_04LiveAppSupplierVendorE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 5,
    package_id: "p1.05_support_sla_exact_source",
    phase: "P1.05",
    artifact_filename: "companion-p1-05-live-app-support-sla-e2e-certification-v1.json",
    test_file: "phase-p1-05.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_05_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_05LiveAppSupportSlaE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 6,
    package_id: "p1.06_support_case_write_adapter",
    phase: "P1.06",
    artifact_filename: "companion-p1-06-live-app-support-case-write-e2e-certification-v1.json",
    test_file: "phase-p1-06.test.ts",
    read_write_scope: "write_approval_required",
    module_requirements: P1_06_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_06LiveAppSupportCaseWriteE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 7,
    package_id: "p1.07_hosts_task_write_adapter",
    phase: "P1.07",
    artifact_filename: "companion-p1-07-live-app-hosts-task-write-e2e-certification-v1.json",
    test_file: "phase-p1-07.test.ts",
    read_write_scope: "write_approval_required",
    module_requirements: P1_07_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_07LiveAppHostsTaskWriteE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 8,
    package_id: "p1.08_member_verification_exact_source",
    phase: "P1.08",
    artifact_filename: "companion-p1-08-live-app-member-verification-e2e-certification-v1.json",
    test_file: "phase-p1-08.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_08_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_08LiveAppMemberVerificationE2eCertificationArtifact(repoRoot),
  },
  {
    priority_order: 9,
    package_id: "p1.09_community_member_directory_source",
    phase: "P1.09",
    artifact_filename: "companion-p1-09-live-app-community-member-directory-e2e-certification-v1.json",
    test_file: "phase-p1-09.test.ts",
    read_write_scope: "read_only",
    module_requirements: P1_09_LIVE_E2E_MODULE_REQUIREMENTS,
    readArtifact: (repoRoot) => readP1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact(repoRoot),
  },
] as const;

function resolveRegistryEntry(
  reconciled: readonly CompanionCoverageReconciledEntry[],
  moduleId: string,
): CompanionCoverageReconciledEntry | undefined {
  return reconciled.find((entry) => entry.module_id === moduleId);
}

function classifyPackageReadiness(
  moduleIds: readonly string[],
  registryReadiness: Record<string, CompanionCoverageReadiness | "missing">,
): CompanionCoverageReadiness {
  const values = moduleIds.map((id) => registryReadiness[id]).filter((v) => v !== "missing");
  if (values.length === 0) return "specification_only";
  if (values.every((v) => v === "production_ready_candidate")) return "production_ready_candidate";
  if (values.some((v) => v === "connected_but_partial" || v === "connected")) return "connected_but_partial";
  if (values.some((v) => v === "adapter_missing")) return "adapter_missing";
  if (values.some((v) => v === "source_missing")) return "source_missing";
  return "connected_but_partial";
}

function auditPackage(
  definition: LockedP1PackageDefinition,
  repoRoot: string,
  reconciled: readonly CompanionCoverageReconciledEntry[],
): P1_10PackageAuditResult {
  const moduleIds = Object.keys(definition.module_requirements);
  const capabilitiesRequired = moduleIds.flatMap((moduleId) => definition.module_requirements[moduleId] ?? []);
  const deviations: string[] = [];
  const registryReadiness: Record<string, CompanionCoverageReadiness | "missing"> = {};
  const sourceClassification: P1_10PackageAuditResult["source_classification"] = {};

  const artifactPath = path.join(repoRoot, "lib/companion-runtime/artifacts", definition.artifact_filename);
  if (!fs.existsSync(artifactPath)) {
    deviations.push(`Missing live E2E artifact ${definition.artifact_filename}.`);
  }

  const artifact = definition.readArtifact(repoRoot);
  let artifactStatus: P1_10PackageAuditResult["artifact_status"] = artifact ? "pass" : "missing";

  if (!artifact) {
    artifactStatus = "missing";
    deviations.push(`Could not load ${definition.artifact_filename}.`);
  } else if (artifact.overall_status !== "pass") {
    artifactStatus = artifact.overall_status === "blocked" ? "blocked" : "fail";
    deviations.push(`${definition.phase} artifact overall_status is ${artifact.overall_status}, expected pass.`);
  }

  for (const moduleId of moduleIds) {
    const entry = resolveRegistryEntry(reconciled, moduleId);
    if (!entry) {
      registryReadiness[moduleId] = "missing";
      sourceClassification[moduleId] = "missing";
      deviations.push(`Registry module ${moduleId} missing from canonical coverage.`);
      continue;
    }

    registryReadiness[moduleId] = entry.readiness;
    sourceClassification[moduleId] = entry.source_classification;

    if (entry.readiness === "production_ready") {
      deviations.push(`${moduleId} must not be production_ready — max is production_ready_candidate.`);
    }

    if (definition.priority_order > 1 && !CERTIFIED_READINESS.has(entry.readiness)) {
      deviations.push(`${moduleId} readiness is ${entry.readiness}; expected production_ready_candidate after ${definition.phase} pass.`);
    }

    if (FORBIDDEN_SOURCE_CLASSIFICATIONS.has(entry.source_classification)) {
      deviations.push(`${moduleId} uses ${entry.source_classification} — cannot certify as exact live source.`);
    }

    if (definition.read_write_scope === "write_approval_required") {
      if (entry.readiness_scope.write === "source_missing" || entry.readiness_scope.write === "adapter_missing") {
        deviations.push(`${moduleId} write scope is not connected (${entry.readiness_scope.write}).`);
      }
    }
  }

  const capabilitiesVerified = artifact?.capabilities_passed ?? [];
  const passedSet = new Set(capabilitiesVerified);
  for (const capability of capabilitiesRequired) {
    if (!passedSet.has(capability)) {
      deviations.push(`${definition.phase} missing passed capability ${capability}.`);
    }
  }

  for (const moduleId of moduleIds) {
    if (!artifact?.coverage_updates_applied.includes(moduleId)) {
      deviations.push(`${definition.phase} coverage_updates_applied missing ${moduleId}.`);
    }
  }

  const status: P1_10PackageAuditResult["status"] =
    deviations.length === 0 && artifactStatus === "pass" ? "pass" : artifactStatus === "blocked" ? "blocked" : "fail";

  return {
    priority_order: definition.priority_order,
    package_id: definition.package_id,
    phase: definition.phase,
    module_ids: moduleIds,
    read_write_scope: definition.read_write_scope,
    artifact_filename: definition.artifact_filename,
    artifact_status: artifactStatus,
    artifact_commit_hash: artifact?.commit_hash ?? null,
    test_file: definition.test_file,
    test_status: "not_run",
    registry_readiness: registryReadiness,
    source_classification: sourceClassification,
    capabilities_required: capabilitiesRequired,
    capabilities_verified: capabilitiesVerified,
    classification: classifyPackageReadiness(moduleIds, registryReadiness),
    status,
    deviations,
  };
}

function collectRegistryDeviations(reconciled: readonly CompanionCoverageReconciledEntry[]): P1_10OpenDeviation[] {
  const deviations: P1_10OpenDeviation[] = [];

  if (!assertNoFalseProductionReady(buildCompanionFoundationCoverageRegistry())) {
    deviations.push({
      code: "false_production_ready",
      severity: "blocking",
      message: "Canonical registry contains false production_ready entries.",
    });
  }

  const productionReady = reconciled.filter((entry) => entry.readiness === "production_ready");
  if (productionReady.length > 0) {
    deviations.push({
      code: "production_ready_in_p1_scope",
      severity: "blocking",
      message: `P1 scope forbids production_ready; found ${productionReady.length} module(s).`,
    });
  }

  return deviations;
}

export function runLockedP1CoverageAudit(repoRoot: string): {
  package_audits: P1_10PackageAuditResult[];
  open_deviations: P1_10OpenDeviation[];
  registry_modules_audited: number;
} {
  const reconciled = reconcileCoverageRegistry(buildCompanionFoundationCoverageRegistry());
  const package_audits = LOCKED_P1_PACKAGE_DEFINITIONS.map((definition) =>
    auditPackage(definition, repoRoot, reconciled),
  );

  const open_deviations = collectRegistryDeviations(reconciled);

  for (const audit of package_audits) {
    for (const deviation of audit.deviations) {
      open_deviations.push({
        code: "package_audit",
        severity: "blocking",
        message: deviation,
        package_id: audit.package_id,
      });
    }
  }

  const auditedModuleIds = new Set(package_audits.flatMap((audit) => audit.module_ids));

  return {
    package_audits,
    open_deviations,
    registry_modules_audited: auditedModuleIds.size,
  };
}

export function summarizeLockedP1Audit(
  package_audits: readonly P1_10PackageAuditResult[],
  open_deviations: readonly P1_10OpenDeviation[],
): Pick<
  P1_10LockedP1CoverageCertificationArtifact,
  "overall_status" | "packages_certified" | "packages_failed" | "blockers"
> {
  const blocking = open_deviations.filter((deviation) => deviation.severity === "blocking");
  const packages_certified = package_audits.filter((audit) => audit.status === "pass").length;
  const packages_failed = package_audits.filter((audit) => audit.status !== "pass").length;

  if (packages_failed > 0 || blocking.length > 0) {
    return {
      overall_status: "fail",
      packages_certified,
      packages_failed,
      blockers: [
        ...blocking.map((deviation) => deviation.message),
        ...package_audits
          .filter((audit) => audit.status !== "pass")
          .map((audit) => `${audit.phase} audit ${audit.status}`),
      ],
    };
  }

  return {
    overall_status: "pass",
    packages_certified,
    packages_failed: 0,
    blockers: [],
  };
}

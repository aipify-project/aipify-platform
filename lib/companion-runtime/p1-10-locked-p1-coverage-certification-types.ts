import type { CompanionCoverageReadiness, CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION =
  "companion-p1-10-locked-p1-coverage-certification-v1" as const;

export const P1_10_LOCKED_SEQUENCE_LABEL = "p1.01-p1.09" as const;

export type P1_10AuditStatus = "pass" | "fail" | "blocked";

export type P1_10PackageAuditResult = {
  priority_order: number;
  package_id: string;
  phase: string;
  module_ids: readonly string[];
  read_write_scope: "read_certification" | "read_only" | "write_approval_required";
  artifact_filename: string;
  artifact_status: P1_10AuditStatus | "missing";
  artifact_commit_hash: string | null;
  test_file: string;
  test_status: "pass" | "not_run";
  registry_readiness: Record<string, CompanionCoverageReadiness | "missing">;
  source_classification: Record<string, CompanionCoverageSourceClassification | "missing">;
  capabilities_required: readonly string[];
  capabilities_verified: readonly string[];
  classification: CompanionCoverageReadiness;
  status: P1_10AuditStatus;
  deviations: readonly string[];
};

export type P1_10OpenDeviation = {
  code: string;
  severity: "blocking" | "informational";
  message: string;
  package_id?: string;
  module_id?: string;
};

export type P1_10LockedP1CoverageCertificationArtifact = {
  version: typeof P1_10_LOCKED_P1_COVERAGE_CERTIFICATION_VERSION;
  generated_at: string;
  commit_hash: string | null;
  locked_sequence: typeof P1_10_LOCKED_SEQUENCE_LABEL;
  overall_status: P1_10AuditStatus;
  max_readiness_certified: "production_ready_candidate";
  registry_modules_audited: number;
  packages_certified: number;
  packages_failed: number;
  package_audits: P1_10PackageAuditResult[];
  test_results: {
    phase43: "pass" | "fail" | "not_run";
    phase43b: "pass" | "fail" | "not_run";
    typecheck: "pass" | "not_run";
  };
  open_deviations: P1_10OpenDeviation[];
  blockers: readonly string[];
};

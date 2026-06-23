import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_06_LIVE_E2E_CERTIFICATION_VERSION =
  "companion-p1-06-live-app-support-case-write-e2e-certification-v1" as const;

export const P1_06_ASSIGN_WRITE_SOURCE = "assign_support_case" as const;
export const P1_06_ESCALATE_WRITE_SOURCE = "escalate_support_case" as const;

export type P1_06LiveE2eFlowStatus = "pass" | "fail" | "skipped" | "blocked";

export type P1_06LiveE2eCertificationFlowResult = {
  flow_id: string;
  capability: string;
  source_classification: CompanionCoverageSourceClassification | "source_unknown";
  status: P1_06LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_06LiveE2eTenantIsolationResult = {
  check_id: string;
  status: P1_06LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_06LiveE2eIdempotencyResult = {
  check_id: string;
  status: P1_06LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_06LiveAppSupportCaseWriteE2eCertificationArtifact = {
  version: typeof P1_06_LIVE_E2E_CERTIFICATION_VERSION;
  generated_at: string;
  environment: string;
  commit_hash: string | null;
  organization_reference: string | null;
  session_mode: "live_authenticated" | "blocked";
  p1_01_prerequisite: "pass" | "fail" | "missing";
  assign_write_source: typeof P1_06_ASSIGN_WRITE_SOURCE;
  escalate_write_source: typeof P1_06_ESCALATE_WRITE_SOURCE;
  controlled_probe_case_created: boolean;
  overall_status: "pass" | "fail" | "blocked";
  blockers: Array<{ code: string; message: string; required_variable?: string }>;
  flows: P1_06LiveE2eCertificationFlowResult[];
  tenant_isolation: P1_06LiveE2eTenantIsolationResult[];
  idempotency: P1_06LiveE2eIdempotencyResult[];
  capabilities_passed: string[];
  capabilities_failed: string[];
  coverage_updates_applied: string[];
};

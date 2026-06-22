import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_01_LIVE_E2E_CERTIFICATION_VERSION = "companion-p1-01-live-e2e-certification-v1" as const;

export type P1LiveE2eFlowStatus = "pass" | "fail" | "skipped" | "blocked";

export type P1LiveE2eCertificationFlowResult = {
  flow_id: string;
  capability: string;
  source_classification: CompanionCoverageSourceClassification | "source_unknown";
  status: P1LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1LiveE2eTenantIsolationResult = {
  check_id: string;
  status: P1LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1LiveE2eCertificationArtifact = {
  version: typeof P1_01_LIVE_E2E_CERTIFICATION_VERSION;
  generated_at: string;
  environment: string;
  commit_hash: string | null;
  organization_reference: string | null;
  session_mode: "live_authenticated" | "blocked";
  overall_status: "pass" | "fail" | "blocked";
  blockers: Array<{ code: string; message: string; required_variable?: string }>;
  flows: P1LiveE2eCertificationFlowResult[];
  tenant_isolation: P1LiveE2eTenantIsolationResult[];
  capabilities_passed: string[];
  capabilities_failed: string[];
  coverage_updates_applied: string[];
};

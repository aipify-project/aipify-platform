import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_09_LIVE_E2E_CERTIFICATION_VERSION =
  "companion-p1-09-live-app-community-member-directory-e2e-certification-v1" as const;

export const P1_09_AUTHORITATIVE_DIRECTORY_SOURCE = "get_customer_member_directory_center" as const;

export type P1_09LiveE2eFlowStatus = "pass" | "fail" | "skipped" | "blocked";

export type P1_09LiveE2eCertificationFlowResult = {
  flow_id: string;
  capability: string;
  source_classification: CompanionCoverageSourceClassification | "source_unknown";
  status: P1_09LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_09LiveE2eTenantIsolationResult = {
  check_id: string;
  status: P1_09LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_09LiveAppCommunityMemberDirectoryE2eCertificationArtifact = {
  version: typeof P1_09_LIVE_E2E_CERTIFICATION_VERSION;
  generated_at: string;
  environment: string;
  commit_hash: string | null;
  organization_reference: string | null;
  session_mode: "live_authenticated" | "blocked";
  p1_01_prerequisite: "pass" | "fail" | "missing";
  authoritative_directory_source: typeof P1_09_AUTHORITATIVE_DIRECTORY_SOURCE;
  live_member_count: number;
  overall_status: "pass" | "fail" | "blocked";
  blockers: Array<{ code: string; message: string; required_variable?: string }>;
  flows: P1_09LiveE2eCertificationFlowResult[];
  tenant_isolation: P1_09LiveE2eTenantIsolationResult[];
  capabilities_passed: string[];
  capabilities_failed: string[];
  coverage_updates_applied: string[];
};

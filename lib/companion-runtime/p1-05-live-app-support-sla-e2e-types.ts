import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_05_LIVE_E2E_CERTIFICATION_VERSION =
  "companion-p1-05-live-app-support-sla-e2e-certification-v1" as const;

export const P1_05_AUTHORITATIVE_SLA_SOURCE =
  "get_customer_support_operations_center" as const;

export type P1_05LiveE2eFlowStatus = "pass" | "fail" | "skipped" | "blocked";

export type P1_05LiveE2eCertificationFlowResult = {
  flow_id: string;
  capability: string;
  source_classification: CompanionCoverageSourceClassification | "source_unknown";
  status: P1_05LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_05LiveE2eTenantIsolationResult = {
  check_id: string;
  status: P1_05LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_05LiveAppSupportSlaE2eCertificationArtifact = {
  version: typeof P1_05_LIVE_E2E_CERTIFICATION_VERSION;
  generated_at: string;
  environment: string;
  commit_hash: string | null;
  organization_reference: string | null;
  session_mode: "live_authenticated" | "blocked";
  p1_01_prerequisite: "pass" | "fail" | "missing";
  authoritative_sla_source: typeof P1_05_AUTHORITATIVE_SLA_SOURCE;
  sla_policy_configured: boolean;
  live_open_case_count: number;
  overall_status: "pass" | "fail" | "blocked";
  blockers: Array<{ code: string; message: string; required_variable?: string }>;
  flows: P1_05LiveE2eCertificationFlowResult[];
  tenant_isolation: P1_05LiveE2eTenantIsolationResult[];
  capabilities_passed: string[];
  capabilities_failed: string[];
  coverage_updates_applied: string[];
};

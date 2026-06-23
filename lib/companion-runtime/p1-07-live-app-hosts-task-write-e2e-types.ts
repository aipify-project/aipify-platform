import type { CompanionCoverageSourceClassification } from "./companion-foundation-coverage-types";

export const P1_07_LIVE_E2E_CERTIFICATION_VERSION =
  "companion-p1-07-live-app-hosts-task-write-e2e-certification-v1" as const;

export const P1_07_HOST_TASK_WRITE_SOURCE = "create_aipify_hosts_task" as const;
export const P1_07_CLEANING_ASSIGN_WRITE_SOURCE = "perform_aipify_hosts_cleaning_action" as const;
export const P1_07_MAINTENANCE_CREATE_WRITE_SOURCE = "perform_aipify_hosts_maintenance_action" as const;

export type P1_07LiveE2eFlowStatus = "pass" | "fail" | "skipped" | "blocked";

export type P1_07LiveE2eCertificationFlowResult = {
  flow_id: string;
  capability: string;
  source_classification: CompanionCoverageSourceClassification | "source_unknown";
  status: P1_07LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_07LiveE2eTenantIsolationResult = {
  check_id: string;
  status: P1_07LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_07LiveE2eIdempotencyResult = {
  check_id: string;
  status: P1_07LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_07LiveE2eCleanupResult = {
  check_id: string;
  status: P1_07LiveE2eFlowStatus;
  failure_reason: string | null;
};

export type P1_07LiveAppHostsTaskWriteE2eCertificationArtifact = {
  version: typeof P1_07_LIVE_E2E_CERTIFICATION_VERSION;
  generated_at: string;
  environment: string;
  commit_hash: string | null;
  organization_reference: string | null;
  session_mode: "live_authenticated" | "blocked";
  p1_01_prerequisite: "pass" | "fail" | "missing";
  host_task_write_source: typeof P1_07_HOST_TASK_WRITE_SOURCE;
  cleaning_assign_write_source: typeof P1_07_CLEANING_ASSIGN_WRITE_SOURCE;
  maintenance_create_write_source: typeof P1_07_MAINTENANCE_CREATE_WRITE_SOURCE;
  controlled_probe_tasks_created: number;
  cleanup_completed: boolean;
  overall_status: "pass" | "fail" | "blocked";
  blockers: Array<{ code: string; message: string; required_variable?: string }>;
  flows: P1_07LiveE2eCertificationFlowResult[];
  tenant_isolation: P1_07LiveE2eTenantIsolationResult[];
  idempotency: P1_07LiveE2eIdempotencyResult[];
  cleanup: P1_07LiveE2eCleanupResult[];
  capabilities_passed: string[];
  capabilities_failed: string[];
  coverage_updates_applied: string[];
};

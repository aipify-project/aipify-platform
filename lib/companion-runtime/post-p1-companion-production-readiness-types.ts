export const POST_P1_COMPANION_PRODUCTION_READINESS_VERSION =
  "companion-post-p1-production-readiness-certification-v1" as const;

export type PostP1ReadinessLevel = "production_ready_candidate" | "partial" | "blocked";

export type PostP1CertificationStatus = "pass" | "partial" | "blocked" | "fail";

export type PostP1FlowResult = {
  flow_id: string;
  capability: string;
  surface?: "drawer" | "fullpage" | "desktop" | "mobile";
  status: "pass" | "fail" | "skipped";
  failure_reason: string | null;
};

export type PostP1AuditCheck = {
  check_id: string;
  status: "pass" | "fail" | "skipped";
  failure_reason: string | null;
};

export type PostP1UnitTestResult = {
  phase: string;
  test_file: string;
  status: "pass" | "fail";
  failure_reason: string | null;
};

export type PostP1EnvironmentChecks = {
  cron_secret_configured: boolean;
  supabase_service_role_key_configured: boolean;
  live_e2e_enabled: boolean;
  live_e2e_base_url_configured: boolean;
};

export type PostP1CommitRecord = {
  phase: string;
  commit_hash: string;
  summary: string;
};

export type PostP1CompanionProductionReadinessArtifact = {
  version: typeof POST_P1_COMPANION_PRODUCTION_READINESS_VERSION;
  generated_at: string;
  commit_hash: string | null;
  overall_status: PostP1CertificationStatus;
  max_readiness_certified: PostP1ReadinessLevel;
  live_e2e_status: "pass" | "partial" | "blocked" | "skipped";
  session_mode: "live_authenticated" | "blocked";
  organization_reference: string | null;
  environment: PostP1EnvironmentChecks;
  post_p1_commits: PostP1CommitRecord[];
  unit_tests: PostP1UnitTestResult[];
  static_audits: PostP1AuditCheck[];
  flows: PostP1FlowResult[];
  tenant_isolation: PostP1AuditCheck[];
  open_limitations: string[];
  blockers: { code: string; message: string }[];
};

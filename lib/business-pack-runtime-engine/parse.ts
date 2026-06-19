export type BusinessPackRuntimeCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  runtime_instances?: Record<string, unknown>[];
  deployments?: Record<string, unknown>[];
  versions?: Record<string, unknown>[];
  health_checks?: Record<string, unknown>[];
  sandbox_profiles?: Record<string, unknown>[];
  domain_licenses?: Record<string, unknown>[];
  rollback_snapshots?: Record<string, unknown>[];
  incidents?: Record<string, unknown>[];
  suspension_reasons?: Record<string, unknown>[];
  provider_suspensions?: Record<string, unknown>[];
  installation_pipeline?: Record<string, unknown>[];
  capability_grants?: Record<string, unknown>[];
  pack_health?: Record<string, unknown>[];
  update_jobs?: Record<string, unknown>[];
  license_enforcement?: Record<string, unknown>[];
  grace_periods?: Record<string, unknown>[];
  feature_flags?: Record<string, unknown>[];
  performance_quotas?: Record<string, unknown>[];
  circuit_breakers?: Record<string, unknown>[];
  notification_rules?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
  rows?: Record<string, unknown>[];
};

export function parseBusinessPackRuntimeCenter(raw: unknown): BusinessPackRuntimeCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const arr = (key: string) =>
    Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
  const obj = (key: string) =>
    typeof row[key] === "object" && row[key] ? (row[key] as Record<string, number | string>) : {};

  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    runtime_instances: arr("runtime_instances"),
    deployments: arr("deployments"),
    versions: arr("versions"),
    health_checks: arr("health_checks"),
    sandbox_profiles: arr("sandbox_profiles"),
    domain_licenses: arr("domain_licenses"),
    rollback_snapshots: arr("rollback_snapshots"),
    incidents: arr("incidents"),
    suspension_reasons: arr("suspension_reasons"),
    provider_suspensions: arr("provider_suspensions"),
    installation_pipeline: arr("installation_pipeline"),
    capability_grants: arr("capability_grants"),
    pack_health: arr("pack_health"),
    update_jobs: arr("update_jobs"),
    license_enforcement: arr("license_enforcement"),
    grace_periods: arr("grace_periods"),
    feature_flags: arr("feature_flags"),
    performance_quotas: arr("performance_quotas"),
    circuit_breakers: arr("circuit_breakers"),
    notification_rules: arr("notification_rules"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
    rows: arr("rows"),
  };
}

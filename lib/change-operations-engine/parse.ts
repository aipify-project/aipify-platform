export type ChangeOperationsCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  changes?: Record<string, unknown>[];
  change_requests?: Record<string, unknown>[];
  releases?: Record<string, unknown>[];
  deployments?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  environments?: Record<string, unknown>[];
  calendar_events?: Record<string, unknown>[];
  freeze_periods?: Record<string, unknown>[];
  feature_flags?: Record<string, unknown>[];
  database_changes?: Record<string, unknown>[];
  emergency_changes?: Record<string, unknown>[];
  rollback_decisions?: Record<string, unknown>[];
  rollback_procedures?: Record<string, unknown>[];
  forward_fix_options?: Record<string, unknown>[];
  evidence_items?: Record<string, unknown>[];
  platform_history?: Record<string, unknown>[];
  advisory_insights?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
};

export type OrganizationChangeHistory = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  stats?: Record<string, number | string>;
  history?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
};

export function parseChangeOperationsCenter(raw: unknown): ChangeOperationsCenter {
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
    changes: arr("changes"),
    change_requests: arr("change_requests"),
    releases: arr("releases"),
    deployments: arr("deployments"),
    approvals: arr("approvals"),
    environments: arr("environments"),
    calendar_events: arr("calendar_events"),
    freeze_periods: arr("freeze_periods"),
    feature_flags: arr("feature_flags"),
    database_changes: arr("database_changes"),
    emergency_changes: arr("emergency_changes"),
    rollback_decisions: arr("rollback_decisions"),
    rollback_procedures: arr("rollback_procedures"),
    forward_fix_options: arr("forward_fix_options"),
    evidence_items: arr("evidence_items"),
    platform_history: arr("platform_history"),
    advisory_insights: arr("advisory_insights"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    rows: arr("rows"),
  };
}

export function parseOrganizationChangeHistory(raw: unknown): OrganizationChangeHistory {
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
    stats: obj("stats"),
    history: arr("history"),
    rows: arr("rows"),
  };
}

export type TimeAttendanceCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  distinction_note?: string;
  section_count?: number;
  settings?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  sections_registry?: Record<string, unknown>[];
  companion_recommendations?: Record<string, unknown>[];
  record_status_defs?: Record<string, unknown>[];
  entry_method_defs?: Record<string, unknown>[];
  employee_profiles?: Record<string, unknown>[];
  time_records?: Record<string, unknown>[];
  clock_sessions?: Record<string, unknown>[];
  attendance?: Record<string, unknown>[];
  leave_types?: Record<string, unknown>[];
  leave_requests?: Record<string, unknown>[];
  leave_balances?: Record<string, unknown>[];
  overtime?: Record<string, unknown>[];
  timesheets?: Record<string, unknown>[];
  corrections?: Record<string, unknown>[];
  payroll_prep?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  policies?: Record<string, unknown>[];
  policy_acknowledgements?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
  notifications?: Record<string, unknown>[];
  analytics?: Record<string, unknown>[];
  since_last_login?: Record<string, unknown>;
  audit_recent?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  team_members?: Record<string, unknown>[];
  attribution_preserved?: Record<string, boolean>;
};

export type PartnerTeamTimeCenter = TimeAttendanceCenter;

function arr(row: unknown, key: string): Record<string, unknown>[] {
  const v = (row as Record<string, unknown>)?.[key];
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

function obj(row: unknown, key: string): Record<string, unknown> {
  const v = (row as Record<string, unknown>)?.[key];
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function parseTimeAttendanceCenter(raw: unknown): TimeAttendanceCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    distinction_note: typeof row.distinction_note === "string" ? row.distinction_note : undefined,
    section_count: typeof row.section_count === "number" ? row.section_count : undefined,
    settings: obj(row, "settings"),
    stats: obj(row, "stats") as Record<string, number | string>,
    sections_registry: arr(row, "sections_registry"),
    companion_recommendations: arr(row, "companion_recommendations"),
    record_status_defs: arr(row, "record_status_defs"),
    entry_method_defs: arr(row, "entry_method_defs"),
    employee_profiles: arr(row, "employee_profiles"),
    time_records: arr(row, "time_records"),
    clock_sessions: arr(row, "clock_sessions"),
    attendance: arr(row, "attendance"),
    leave_types: arr(row, "leave_types"),
    leave_requests: arr(row, "leave_requests"),
    leave_balances: arr(row, "leave_balances"),
    overtime: arr(row, "overtime"),
    timesheets: arr(row, "timesheets"),
    corrections: arr(row, "corrections"),
    payroll_prep: arr(row, "payroll_prep"),
    projects: arr(row, "projects"),
    policies: arr(row, "policies"),
    policy_acknowledgements: arr(row, "policy_acknowledgements"),
    integrations: arr(row, "integrations"),
    notifications: arr(row, "notifications"),
    analytics: arr(row, "analytics"),
    since_last_login: obj(row, "since_last_login"),
    audit_recent: arr(row, "audit_recent"),
    reports: obj(row, "reports"),
    team_members: arr(row, "team_members"),
    attribution_preserved: obj(row, "attribution_preserved") as Record<string, boolean>,
  };
}

export function parsePartnerTeamTimeCenter(raw: unknown): PartnerTeamTimeCenter {
  return parseTimeAttendanceCenter(raw);
}

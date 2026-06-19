export type CompensationCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  distinction_note?: string;
  section_count?: number;
  view?: string;
  settings?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  sections_registry?: Record<string, unknown>[];
  commission_status_defs?: Record<string, unknown>[];
  companion_recommendations?: Record<string, unknown>[];
  records?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
  employee_preview?: Record<string, unknown>[];
  commission_ledger?: Record<string, unknown>[];
  tip_allocations?: Record<string, unknown>[];
  bonuses?: Record<string, unknown>[];
  disputes?: Record<string, unknown>[];
  since_last_login?: Record<string, unknown>;
  audit_recent?: Record<string, unknown>[];
};

function arr(row: unknown, key: string): Record<string, unknown>[] {
  const v = (row as Record<string, unknown>)?.[key];
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

function obj(row: unknown, key: string): Record<string, unknown> {
  const v = (row as Record<string, unknown>)?.[key];
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function parseCompensationCenter(raw: unknown): CompensationCenter {
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
    view: typeof row.view === "string" ? row.view : undefined,
    settings: obj(row, "settings"),
    stats: obj(row, "stats") as Record<string, number | string>,
    sections_registry: arr(row, "sections_registry"),
    commission_status_defs: arr(row, "commission_status_defs"),
    companion_recommendations: arr(row, "companion_recommendations"),
    records: arr(row, "records"),
    integrations: arr(row, "integrations"),
    employee_preview: arr(row, "employee_preview"),
    commission_ledger: arr(row, "commission_ledger"),
    tip_allocations: arr(row, "tip_allocations"),
    bonuses: arr(row, "bonuses"),
    disputes: arr(row, "disputes"),
    since_last_login: obj(row, "since_last_login"),
    audit_recent: arr(row, "audit_recent"),
  };
}

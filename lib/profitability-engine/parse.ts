export type ProfitabilityCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  distinction_note?: string;
  data_quality_warning?: string;
  section_count?: number;
  settings?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  sections_registry?: Record<string, unknown>[];
  profitability_status_defs?: Record<string, unknown>[];
  data_quality_defs?: Record<string, unknown>[];
  companion_recommendations?: Record<string, unknown>[];
  records?: Record<string, unknown>[];
  service_profitability_cards?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
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

export function parseProfitabilityCenter(raw: unknown): ProfitabilityCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    distinction_note: typeof row.distinction_note === "string" ? row.distinction_note : undefined,
    data_quality_warning: typeof row.data_quality_warning === "string" ? row.data_quality_warning : undefined,
    section_count: typeof row.section_count === "number" ? row.section_count : undefined,
    settings: obj(row, "settings"),
    stats: obj(row, "stats") as Record<string, number | string>,
    sections_registry: arr(row, "sections_registry"),
    profitability_status_defs: arr(row, "profitability_status_defs"),
    data_quality_defs: arr(row, "data_quality_defs"),
    companion_recommendations: arr(row, "companion_recommendations"),
    records: arr(row, "records"),
    service_profitability_cards: arr(row, "service_profitability_cards"),
    integrations: arr(row, "integrations"),
    since_last_login: obj(row, "since_last_login"),
    audit_recent: arr(row, "audit_recent"),
  };
}

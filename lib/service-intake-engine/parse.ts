export type ServiceIntakeCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  stats?: Record<string, number | string>;
  records?: Record<string, unknown>[];
  forms?: Record<string, unknown>[];
  submissions?: Record<string, unknown>[];
  consents?: Record<string, unknown>[];
  service_delivery?: Record<string, unknown>[];
  routes?: Record<string, string>;
};

export type ServiceIntakeDetail = {
  found: boolean;
  error?: string;
  entity_type?: string;
  entity_key?: string;
  record?: Record<string, unknown>;
  related?: Record<string, unknown>[];
  readiness?: Record<string, unknown>;
};

export type Int618BookingReadiness = {
  found: boolean;
  error?: string;
  booking_key?: string;
  ready?: boolean;
  blocked_reasons?: string[];
  principle?: string;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseServiceIntakeCenter(raw: unknown): ServiceIntakeCenter {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    stats: (asRecord(row.stats) ?? {}) as Record<string, number | string>,
    records: asArray(row.records),
    forms: asArray(row.forms),
    submissions: asArray(row.submissions),
    consents: asArray(row.consents),
    service_delivery: asArray(row.service_delivery),
    routes: asRecord(row.routes) as Record<string, string> | undefined,
  };
}

export function parseServiceIntakeDetail(raw: unknown): ServiceIntakeDetail {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    entity_type: typeof row.entity_type === "string" ? row.entity_type : undefined,
    entity_key: typeof row.entity_key === "string" ? row.entity_key : undefined,
    record: asRecord(row.record) ?? undefined,
    related: asArray(row.related),
    readiness: asRecord(row.readiness) ?? undefined,
  };
}

export function parseInt618BookingReadiness(raw: unknown): Int618BookingReadiness {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    booking_key: typeof row.booking_key === "string" ? row.booking_key : undefined,
    ready: typeof row.ready === "boolean" ? row.ready : undefined,
    blocked_reasons: Array.isArray(row.blocked_reasons) ? (row.blocked_reasons as string[]) : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
  };
}

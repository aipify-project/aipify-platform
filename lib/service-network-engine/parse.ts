export type ServiceNetworkCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  hierarchy_note?: string;
  settings?: Record<string, unknown>;
  stats?: Record<string, number | string>;
  records?: Record<string, unknown>[];
  locations?: Record<string, unknown>[];
  resources?: Record<string, unknown>[];
  providers?: Record<string, unknown>[];
  rentals?: Record<string, unknown>[];
  companion_recommendations?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
  status_defs?: Record<string, unknown>[];
  sections_registry?: Record<string, unknown>[];
  routes?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  section_count?: number;
};

export type ServiceNetworkDetail = {
  found: boolean;
  error?: string;
  entity_type?: string;
  record_key?: string;
  record?: Record<string, unknown>;
  related_assignments?: Record<string, unknown>[];
  related_resources?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
};

export type ServiceNetworkAvailabilitySearch = {
  found: boolean;
  error?: string;
  search_params?: Record<string, unknown>;
  validation_order?: string[];
  available_slots?: Record<string, unknown>[];
  principle?: string;
  phase610_ref?: string;
  conflict_prevention?: Record<string, unknown>[];
  availability_rules?: Record<string, unknown>[];
};

export type ServiceNetworkBookingValidation = {
  found: boolean;
  valid?: boolean;
  error?: string;
  error_code?: string | null;
  message?: string;
  location_key?: string;
  provider_key?: string;
  resource_key?: string;
  phase610_ref?: string;
  duplicate_engine?: boolean;
};

export type CompanionServiceNetworkAdvisorBundle = {
  found: boolean;
  advisor_title?: string;
  principle?: string;
  insights?: Record<string, unknown>[];
  center?: ServiceNetworkCenter;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseServiceNetworkCenter(raw: unknown): ServiceNetworkCenter {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    hierarchy_note: typeof row.hierarchy_note === "string" ? row.hierarchy_note : undefined,
    settings: asRecord(row.settings) ?? undefined,
    stats: (asRecord(row.stats) ?? {}) as Record<string, number | string>,
    records: asArray(row.records),
    locations: asArray(row.locations),
    resources: asArray(row.resources),
    providers: asArray(row.providers),
    rentals: asArray(row.rentals),
    companion_recommendations: asArray(row.companion_recommendations),
    integrations: asArray(row.integrations),
    status_defs: asArray(row.status_defs),
    sections_registry: asArray(row.sections_registry),
    routes: asRecord(row.routes) as Record<string, string> | undefined,
    audit_recent: asArray(row.audit_recent),
    section_count: typeof row.section_count === "number" ? row.section_count : undefined,
  };
}

export function parseServiceNetworkDetail(raw: unknown): ServiceNetworkDetail {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    entity_type: typeof row.entity_type === "string" ? row.entity_type : undefined,
    record_key: typeof row.record_key === "string" ? row.record_key : undefined,
    record: asRecord(row.record) ?? undefined,
    related_assignments: asArray(row.related_assignments),
    related_resources: asArray(row.related_resources),
    audit_recent: asArray(row.audit_recent),
  };
}

export function parseServiceNetworkAvailabilitySearch(raw: unknown): ServiceNetworkAvailabilitySearch {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    search_params: asRecord(row.search_params) ?? undefined,
    validation_order: Array.isArray(row.validation_order)
      ? (row.validation_order as string[])
      : undefined,
    available_slots: asArray(row.available_slots),
    principle: typeof row.principle === "string" ? row.principle : undefined,
    phase610_ref: typeof row.phase610_ref === "string" ? row.phase610_ref : undefined,
    conflict_prevention: asArray(row.conflict_prevention),
    availability_rules: asArray(row.availability_rules),
  };
}

export function parseServiceNetworkBookingValidation(raw: unknown): ServiceNetworkBookingValidation {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    valid: typeof row.valid === "boolean" ? row.valid : undefined,
    error: typeof row.error === "string" ? row.error : undefined,
    error_code:
      row.error_code === null
        ? null
        : typeof row.error_code === "string"
          ? row.error_code
          : undefined,
    message: typeof row.message === "string" ? row.message : undefined,
    location_key: typeof row.location_key === "string" ? row.location_key : undefined,
    provider_key: typeof row.provider_key === "string" ? row.provider_key : undefined,
    resource_key: typeof row.resource_key === "string" ? row.resource_key : undefined,
    phase610_ref: typeof row.phase610_ref === "string" ? row.phase610_ref : undefined,
    duplicate_engine:
      typeof row.duplicate_engine === "boolean" ? row.duplicate_engine : undefined,
  };
}

export function parseCompanionServiceNetworkAdvisorBundle(
  raw: unknown,
): CompanionServiceNetworkAdvisorBundle {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    advisor_title: typeof row.advisor_title === "string" ? row.advisor_title : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    insights: asArray(row.insights),
    center: row.center ? parseServiceNetworkCenter(row.center) : undefined,
  };
}

export type ServiceExperienceCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  stats?: Record<string, number | string>;
  records?: Record<string, unknown>[];
  messages?: Record<string, unknown>[];
  templates?: Record<string, unknown>[];
  recommendations?: Record<string, unknown>[];
  actions?: Record<string, unknown>[];
  feedback?: Record<string, unknown>[];
  recovery?: Record<string, unknown>[];
  review_requests?: Record<string, unknown>[];
  alerts?: Record<string, unknown>[];
  snapshots?: Record<string, unknown>[];
  routes?: Record<string, string>;
  route?: string;
  integrations?: Record<string, string>;
};

export type ServiceExperienceDetail = {
  found: boolean;
  error?: string;
  area?: string;
  entity_type?: string;
  entity_key?: string;
  record?: Record<string, unknown>;
  phase617_link?: string;
  phase618_link?: string;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseServiceExperienceCenter(raw: unknown): ServiceExperienceCenter {
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
    messages: asArray(row.messages),
    templates: asArray(row.templates),
    recommendations: asArray(row.recommendations),
    actions: asArray(row.actions),
    feedback: asArray(row.feedback),
    recovery: asArray(row.recovery),
    review_requests: asArray(row.review_requests),
    alerts: asArray(row.alerts),
    snapshots: asArray(row.snapshots),
    routes: asRecord(row.routes) as Record<string, string> | undefined,
    route: typeof row.route === "string" ? row.route : undefined,
    integrations: asRecord(row.integrations) as Record<string, string> | undefined,
  };
}

export function parseServiceExperienceDetail(raw: unknown): ServiceExperienceDetail {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    area: typeof row.area === "string" ? row.area : undefined,
    entity_type: typeof row.entity_type === "string" ? row.entity_type : undefined,
    entity_key: typeof row.entity_key === "string" ? row.entity_key : undefined,
    record: asRecord(row.record) ?? undefined,
    phase617_link: typeof row.phase617_link === "string" ? row.phase617_link : undefined,
    phase618_link: typeof row.phase618_link === "string" ? row.phase618_link : undefined,
  };
}

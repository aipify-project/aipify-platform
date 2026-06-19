export type ServicePaymentsCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  stats?: Record<string, number | string>;
  records?: Record<string, unknown>[];
  payments?: Record<string, unknown>[];
  deposits?: Record<string, unknown>[];
};

export type CompanionServicePaymentsAdvisorBundle = {
  found: boolean;
  principle?: string;
  advisor_prompts?: string[];
  route?: string;
  privacy_note?: string;
  center?: ServicePaymentsCenter;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}
function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseServicePaymentsCenter(raw: unknown): ServicePaymentsCenter {
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
    payments: asArray(row.payments),
    deposits: asArray(row.deposits),
  };
}

export function parseCompanionServicePaymentsAdvisorBundle(raw: unknown): CompanionServicePaymentsAdvisorBundle {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    principle: typeof row.principle === "string" ? row.principle : undefined,
    advisor_prompts: Array.isArray(row.advisor_prompts) ? (row.advisor_prompts as string[]) : undefined,
    route: typeof row.route === "string" ? row.route : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    center: row.center ? parseServicePaymentsCenter(row.center) : undefined,
  };
}

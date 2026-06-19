export type MemoryCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  memories?: Record<string, unknown>[];
  preferences?: Record<string, unknown>[];
  relationships?: Record<string, unknown>[];
  important_dates?: Record<string, unknown>[];
  follow_ups?: Record<string, unknown>[];
  context?: Record<string, unknown>[];
  permissions?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseMemoryCenter(raw: unknown): MemoryCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard:
      typeof row.executive_dashboard === "object" && row.executive_dashboard
        ? (row.executive_dashboard as Record<string, number | string>)
        : {},
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    memories: Array.isArray(row.memories) ? (row.memories as Record<string, unknown>[]) : [],
    preferences: Array.isArray(row.preferences) ? (row.preferences as Record<string, unknown>[]) : [],
    relationships: Array.isArray(row.relationships) ? (row.relationships as Record<string, unknown>[]) : [],
    important_dates: Array.isArray(row.important_dates) ? (row.important_dates as Record<string, unknown>[]) : [],
    follow_ups: Array.isArray(row.follow_ups) ? (row.follow_ups as Record<string, unknown>[]) : [],
    context: Array.isArray(row.context) ? (row.context as Record<string, unknown>[]) : [],
    permissions: Array.isArray(row.permissions) ? (row.permissions as Record<string, unknown>[]) : [],
    reviews: Array.isArray(row.reviews) ? (row.reviews as Record<string, unknown>[]) : [],
    integrations: Array.isArray(row.integrations) ? (row.integrations as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function filterMemoriesByClass(
  memories: Record<string, unknown>[] | undefined,
  memoryClass: string
): Record<string, unknown>[] {
  return (memories ?? []).filter((m) => String(m.memory_class) === memoryClass);
}

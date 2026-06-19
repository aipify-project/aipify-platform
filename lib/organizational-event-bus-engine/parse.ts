export type EventCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  registry?: Record<string, unknown>[];
  live_activity?: Record<string, unknown>[];
  signals?: Record<string, unknown>[];
  correlations?: Record<string, unknown>[];
  alerts?: Record<string, unknown>[];
  subscriptions?: Record<string, unknown>[];
  sources?: Record<string, unknown>[];
  history?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  alert_orchestration?: Record<string, unknown>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseEventCenter(raw: unknown): EventCenter {
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
    registry: Array.isArray(row.registry) ? (row.registry as Record<string, unknown>[]) : [],
    live_activity: Array.isArray(row.live_activity) ? (row.live_activity as Record<string, unknown>[]) : [],
    signals: Array.isArray(row.signals) ? (row.signals as Record<string, unknown>[]) : [],
    correlations: Array.isArray(row.correlations) ? (row.correlations as Record<string, unknown>[]) : [],
    alerts: Array.isArray(row.alerts) ? (row.alerts as Record<string, unknown>[]) : [],
    subscriptions: Array.isArray(row.subscriptions) ? (row.subscriptions as Record<string, unknown>[]) : [],
    sources: Array.isArray(row.sources) ? (row.sources as Record<string, unknown>[]) : [],
    history: Array.isArray(row.history) ? (row.history as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    alert_orchestration:
      typeof row.alert_orchestration === "object" && row.alert_orchestration
        ? (row.alert_orchestration as Record<string, unknown>)
        : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

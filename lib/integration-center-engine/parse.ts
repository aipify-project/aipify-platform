export type IntegrationCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  connected_apps?: Record<string, unknown>[];
  available_apps?: Record<string, unknown>[];
  api_keys?: Record<string, unknown>[];
  permissions?: Record<string, unknown>[];
  capabilities?: Record<string, unknown>[];
  health?: Record<string, unknown>[];
  sync_runs?: Record<string, unknown>[];
  logs?: Record<string, unknown>[];
  external_actions?: Record<string, unknown>[];
  marketplace?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseIntegrationCenter(raw: unknown): IntegrationCenter {
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
    connected_apps: Array.isArray(row.connected_apps) ? (row.connected_apps as Record<string, unknown>[]) : [],
    available_apps: Array.isArray(row.available_apps) ? (row.available_apps as Record<string, unknown>[]) : [],
    api_keys: Array.isArray(row.api_keys) ? (row.api_keys as Record<string, unknown>[]) : [],
    permissions: Array.isArray(row.permissions) ? (row.permissions as Record<string, unknown>[]) : [],
    capabilities: Array.isArray(row.capabilities) ? (row.capabilities as Record<string, unknown>[]) : [],
    health: Array.isArray(row.health) ? (row.health as Record<string, unknown>[]) : [],
    sync_runs: Array.isArray(row.sync_runs) ? (row.sync_runs as Record<string, unknown>[]) : [],
    logs: Array.isArray(row.logs) ? (row.logs as Record<string, unknown>[]) : [],
    external_actions: Array.isArray(row.external_actions) ? (row.external_actions as Record<string, unknown>[]) : [],
    marketplace: Array.isArray(row.marketplace) ? (row.marketplace as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

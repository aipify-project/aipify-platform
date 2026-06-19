import type {
  CompanionDevice,
  CompanionPresenceOperationsCenter,
  OfflineCacheItem,
} from "./types";

function parseDevice(row: Record<string, unknown>): CompanionDevice {
  return {
    id: String(row.id ?? ""),
    device_type: row.device_type ? String(row.device_type) : undefined,
    platform: row.platform ? String(row.platform) : undefined,
    device_label: String(row.device_label ?? ""),
    device_status: row.device_status ? String(row.device_status) : undefined,
    app_version: row.app_version ? String(row.app_version) : undefined,
    last_activity_at: row.last_activity_at ? String(row.last_activity_at) : undefined,
    registered_at: row.registered_at ? String(row.registered_at) : undefined,
  };
}

export function parseCompanionPresenceOperationsCenter(row: Record<string, unknown>): CompanionPresenceOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    companion_identity: row.companion_identity as Record<string, unknown> | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    desktop_companion: row.desktop_companion as Record<string, unknown> | undefined,
    mobile_companion: row.mobile_companion as Record<string, unknown> | undefined,
    presence_engine: row.presence_engine as Record<string, unknown> | undefined,
    notifications: row.notifications as Record<string, unknown> | undefined,
    companion_memory: row.companion_memory as Record<string, unknown> | undefined,
    preferences: row.preferences as Record<string, unknown> | undefined,
    devices: Array.isArray(row.devices)
      ? row.devices.map((d) => parseDevice(d as Record<string, unknown>))
      : undefined,
    offline_cache: Array.isArray(row.offline_cache)
      ? row.offline_cache.map((c) => {
          const item = c as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            cache_type: item.cache_type ? String(item.cache_type) : undefined,
            title: String(item.title ?? ""),
            content_summary: item.content_summary ? String(item.content_summary) : undefined,
            sync_status: item.sync_status ? String(item.sync_status) : undefined,
            created_at: item.created_at ? String(item.created_at) : undefined,
          } satisfies OfflineCacheItem;
        })
      : undefined,
    meeting_awareness: row.meeting_awareness as Record<string, unknown> | undefined,
    meeting_integrations: Array.isArray(row.meeting_integrations) ? row.meeting_integrations.map(String) : undefined,
    role_experience: row.role_experience as Record<string, unknown> | undefined,
    companion_store: row.companion_store as Record<string, unknown> | undefined,
    business_pack_integration: row.business_pack_integration as Record<string, unknown> | undefined,
    search_integration: row.search_integration as Record<string, unknown> | undefined,
    companion_intelligence: row.companion_intelligence as Record<string, unknown> | undefined,
    device_management: row.device_management as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseCompanionPresenceSearchResults(row: Record<string, unknown>): CompanionDevice[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseDevice(r as Record<string, unknown>));
}

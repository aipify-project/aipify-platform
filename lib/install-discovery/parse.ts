import type { ConnectedSystem, ConnectionCatalogItem, InstallDiscoveryCenter } from "./types";

function parseConnectedSystem(row: Record<string, unknown>): ConnectedSystem {
  return {
    id: String(row.id ?? ""),
    system_key: String(row.system_key ?? ""),
    system_name: String(row.system_name ?? ""),
    connection_method: String(row.connection_method ?? "manual_setup"),
    auth_status: String(row.auth_status ?? "pending"),
    sync_mode: String(row.sync_mode ?? "scheduled"),
    sync_health: String(row.sync_health ?? "unknown"),
    last_sync_at: typeof row.last_sync_at === "string" ? row.last_sync_at : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseCatalogItem(row: Record<string, unknown>): ConnectionCatalogItem {
  return {
    system_key: String(row.system_key ?? ""),
    system_name: String(row.system_name ?? ""),
    category: String(row.category ?? "custom"),
    connection_method: String(row.connection_method ?? "manual_setup"),
    method_priority: Number(row.method_priority ?? 5),
  };
}

export function parseInstallDiscoveryCenter(data: unknown): InstallDiscoveryCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const mapArr = (arr: unknown) => (Array.isArray(arr) ? (arr as Record<string, unknown>[]) : []);

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    connected_systems: mapArr(row.connected_systems).map(parseConnectedSystem),
    connection_catalog: mapArr(row.connection_catalog).map(parseCatalogItem),
    discovery_results: mapArr(row.discovery_results),
    data_sources: mapArr(row.data_sources),
    import_jobs: mapArr(row.import_jobs),
    permissions: mapArr(row.permissions),
    recommendations: mapArr(row.recommendations),
    installation_status: row.installation_status as Record<string, unknown> | undefined,
    sync_schedules: mapArr(row.sync_schedules),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}

import type {
  EnvironmentCenter,
  EnvironmentRecommendationsBundle,
  LocalServices,
  NetworkStatus,
  ProjectLocationHealth,
  StorageHealth,
} from "./types";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback) || fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseOverview(row: Record<string, unknown>) {
  return {
    device_name: str(row.device_name),
    platform: str(row.platform),
    os_version: str(row.os_version),
    architecture: str(row.architecture),
    memory: str(row.memory),
    disk: str(row.disk),
    active_user: str(row.active_user),
    companion_version: str(row.companion_version),
    last_scan_at: str(row.last_scan_at),
  };
}

export function parseEnvironmentCenter(data: unknown): EnvironmentCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const permissions = (row.permissions ?? {}) as Record<string, unknown>;
  const overview = (row.device_overview ?? {}) as Record<string, unknown>;

  return {
    has_access: true,
    empty_state: bool(row.empty_state),
    positioning: str(row.positioning),
    environment_enabled: bool(row.environment_enabled),
    scan_status: str(row.scan_status, "pending"),
    success_state: bool(row.success_state),
    warning_state: bool(row.warning_state),
    permission_text: str(row.permission_text),
    permissions: {
      system_info_approved: bool(permissions.system_info_approved),
      file_locations_approved: bool(permissions.file_locations_approved),
      local_network_approved: bool(permissions.local_network_approved),
      running_processes_approved: bool(permissions.running_processes_approved),
      project_folders_approved: bool(permissions.project_folders_approved),
    },
    device_overview: parseOverview(overview),
    insights: Array.isArray(row.insights)
      ? (row.insights as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          title: str(item.title),
          message: str(item.message),
          severity: str(item.severity),
        }))
      : [],
    checklist: Array.isArray(row.checklist)
      ? (row.checklist as Record<string, unknown>[]).map((item) => ({
          check_key: str(item.check_key),
          check_label: str(item.check_label),
          check_status: str(item.check_status, "unknown"),
          message: str(item.message),
        }))
      : [],
    recent_events: Array.isArray(row.recent_events)
      ? (row.recent_events as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          event_type: str(item.event_type),
          summary: str(item.summary),
          created_at: str(item.created_at),
        }))
      : [],
    cross_link_phase344: str(row.cross_link_phase344, "/desktop/workspace"),
    privacy_note: str(row.privacy_note),
  };
}

export function parseStorageHealth(data: unknown): StorageHealth | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const storage = (row.storage ?? row) as Record<string, unknown>;
  return {
    available_disk: str(storage.available_disk),
    used_disk: str(storage.used_disk),
    warnings: Array.isArray(storage.warnings) ? storage.warnings.map(String) : [],
    large_folders: Array.isArray(storage.large_folders)
      ? (storage.large_folders as Record<string, unknown>[]).map((f) => ({
          path: str(f.path),
          size_label: str(f.size_label),
        }))
      : [],
    cache_size: str(storage.cache_size),
    build_artifact_size: str(storage.build_artifact_size),
    summary: str(storage.summary),
  };
}

export function parseProjectLocationHealth(data: unknown): ProjectLocationHealth | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const project = (row.project ?? row.development ?? row) as Record<string, unknown>;
  return {
    current_project_path: str(project.current_project_path),
    location_risk: str(project.location_risk),
    location_label: str(project.location_label),
    risky_locations_detected: Array.isArray(project.risky_locations_detected)
      ? project.risky_locations_detected.map(String)
      : [],
    preferred_path_hint: str(project.preferred_path_hint),
    git_status: str(project.git_status),
    node_version: str(project.node_version),
    npm_version: str(project.npm_version),
    next_dev_status: str(project.next_dev_status),
    localhost_status: str(project.localhost_status),
    dev_port: num(project.dev_port),
    typecheck_status: str(project.typecheck_status),
    lint_status: str(project.lint_status),
    message: str(project.message),
  };
}

export function parseNetworkStatus(data: unknown): NetworkStatus | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const network = (row.network ?? row) as Record<string, unknown>;
  return {
    online: bool(network.online),
    network_name: str(network.network_name),
    local_ip: str(network.local_ip),
    internet_reachable: bool(network.internet_reachable),
    localhost_reachable: bool(network.localhost_reachable),
    api_reachable: bool(network.api_reachable),
  };
}

export function parseLocalServices(data: unknown): LocalServices | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const services = (row.local_services ?? row) as Record<string, unknown>;
  return {
    dev_server_running: bool(services.dev_server_running),
    dev_server_port: num(services.dev_server_port),
    database_tunnel_running: bool(services.database_tunnel_running),
    supabase_local_status: str(services.supabase_local_status),
    background_processes: Array.isArray(services.background_processes)
      ? (services.background_processes as Record<string, unknown>[]).map((p) => ({
          name: str(p.name),
          status: str(p.status),
        }))
      : [],
  };
}

export function parseEnvironmentRecommendations(data: unknown): EnvironmentRecommendationsBundle | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;
  return {
    has_access: true,
    recommendations: Array.isArray(row.recommendations)
      ? (row.recommendations as Record<string, unknown>[]).map((item) => ({
          id: str(item.id),
          recommendation_key: str(item.recommendation_key),
          title: str(item.title),
          message: str(item.message),
          severity: str(item.severity),
          action_label: str(item.action_label),
        }))
      : [],
  };
}

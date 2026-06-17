export type EnvironmentScanStatus = "pending" | "ready" | "warning" | "error";

export type EnvironmentCheckStatus = "passed" | "warning" | "failed" | "unknown" | "skipped";

export type DeviceOverview = {
  device_name: string;
  platform: string;
  os_version: string;
  architecture: string;
  memory: string;
  disk: string;
  active_user: string;
  companion_version: string;
  last_scan_at: string;
};

export type EnvironmentChecklistItem = {
  check_key: string;
  check_label: string;
  check_status: EnvironmentCheckStatus | string;
  message: string;
};

export type EnvironmentRecommendation = {
  id: string;
  recommendation_key: string;
  title: string;
  message: string;
  severity: string;
  action_label: string;
};

export type EnvironmentEvent = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type EnvironmentInsight = {
  id: string;
  title: string;
  message: string;
  severity: string;
};

export type StorageHealth = {
  available_disk: string;
  used_disk: string;
  warnings: string[];
  large_folders: Array<{ path: string; size_label: string }>;
  cache_size: string;
  build_artifact_size: string;
  summary: string;
};

export type ProjectLocationHealth = {
  current_project_path: string;
  location_risk: string;
  location_label: string;
  risky_locations_detected: string[];
  preferred_path_hint: string;
  git_status: string;
  node_version: string;
  npm_version: string;
  next_dev_status: string;
  localhost_status: string;
  dev_port: number;
  typecheck_status: string;
  lint_status: string;
  message: string;
};

export type NetworkStatus = {
  online: boolean;
  network_name: string;
  local_ip: string;
  internet_reachable: boolean;
  localhost_reachable: boolean;
  api_reachable: boolean;
};

export type LocalServices = {
  dev_server_running: boolean;
  dev_server_port: number;
  database_tunnel_running: boolean;
  supabase_local_status: string;
  background_processes: Array<{ name: string; status: string }>;
};

export type EnvironmentCenter = {
  has_access: boolean;
  empty_state: boolean;
  positioning: string;
  environment_enabled: boolean;
  scan_status: EnvironmentScanStatus | string;
  success_state: boolean;
  warning_state: boolean;
  permission_text: string;
  permissions: {
    system_info_approved: boolean;
    file_locations_approved: boolean;
    local_network_approved: boolean;
    running_processes_approved: boolean;
    project_folders_approved: boolean;
  };
  device_overview: DeviceOverview;
  insights: EnvironmentInsight[];
  checklist: EnvironmentChecklistItem[];
  recent_events: EnvironmentEvent[];
  cross_link_phase344: string;
  privacy_note: string;
};

export type EnvironmentRecommendationsBundle = {
  has_access: boolean;
  recommendations: EnvironmentRecommendation[];
};

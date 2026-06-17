/** Phase 345 — read-only desktop command foundation (no destructive commands). */
export const COMPANION_DEVICE_ENVIRONMENT_COMMANDS = [
  {
    id: "get_device_overview",
    rpc: "get_companion_device_environment_center",
    description: "Device overview, checklist, and recent events",
    destructive: false,
  },
  {
    id: "get_storage_health",
    rpc: "get_companion_device_storage_health",
    description: "Storage health, cache and build artifact sizes",
    destructive: false,
  },
  {
    id: "get_project_location_health",
    rpc: "get_companion_device_project_location_health",
    description: "Project path, cloud sync risk, and development readiness",
    destructive: false,
  },
  {
    id: "get_network_status",
    rpc: "get_companion_device_network_status",
    description: "Network and localhost reachability",
    destructive: false,
  },
  {
    id: "get_local_services",
    rpc: "get_companion_device_network_status",
    description: "Local dev server and background process awareness",
    destructive: false,
  },
  {
    id: "get_environment_recommendations",
    rpc: "get_companion_device_environment_recommendations",
    description: "Safe recommendations — suggest only, no auto-fix",
    destructive: false,
  },
] as const;

export type CompanionDeviceEnvironmentCommandId =
  (typeof COMPANION_DEVICE_ENVIRONMENT_COMMANDS)[number]["id"];

export const RISKY_PROJECT_LOCATIONS = [
  "iCloud Drive",
  "Desktop synced to iCloud",
  "Documents synced to iCloud",
  "Dropbox",
  "OneDrive",
  "Google Drive",
] as const;

export const PREFERRED_PROJECT_LOCATIONS = [
  "/Users/{user}/Development",
  "/Users/{user}/Projects",
] as const;

export * from "./types";
export * from "./parse";
export * from "./labels";

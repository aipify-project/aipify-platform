/** Central pilot configuration — Phase 621 single source of truth. */

export const UNONIGHT_COMPANY_SLUG = "unonight";

export const PILOT_MODES = ["unonight_read_only", "disabled"] as const;
export type PilotMode = (typeof PILOT_MODES)[number];

export const PILOT_HEALTH_STATES = [
  "disabled",
  "discovery",
  "syncing",
  "read_only_active",
  "shadow_mode_active",
  "degraded",
  "paused",
  "failed",
] as const;
export type PilotHealthState = (typeof PILOT_HEALTH_STATES)[number];

export const PILOT_SYNC_STATUSES = [
  "idle",
  "syncing",
  "success",
  "failed",
  "denied",
  "paused",
] as const;
export type PilotSyncStatus = (typeof PILOT_SYNC_STATUSES)[number];

export const APPROVED_DATA_SOURCES = [
  "workflow_events",
] as const;

export const PENDING_DATA_SOURCES = [
  "unonight_platform_api",
  "unonight_supabase_views",
  "support_queue_metadata",
  "moderation_queue_metadata",
] as const;

export const PILOT_I18N_NS = "customerApp.unonightPilot621";
export const PLATFORM_I18N_NS = "platform.unonightPilot621";

export const UNONIGHT_PILOT_PLATFORM_ROUTE = "/platform/unonight-pilot";

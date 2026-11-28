/** Online = last heartbeat within this TTL (documented freshness window). */
export const PLATFORM_LIVE_PRESENCE_TTL_SECONDS = 300;

/** Client should heartbeat at most this often (rate limit / storage minimize). */
export const PLATFORM_LIVE_PRESENCE_HEARTBEAT_MIN_INTERVAL_MS = 60_000;

export const PLATFORM_LIVE_PRESENCE_PORTALS = [
  "app_customer",
  "seller",
  "platform_admin",
] as const;

export type PlatformLivePresencePortal = (typeof PLATFORM_LIVE_PRESENCE_PORTALS)[number];

export const PLATFORM_LIVE_PRESENCE_SNAPSHOT_RPC =
  "get_platform_admin_live_status_presence_snapshot";

export const PLATFORM_LIVE_PRESENCE_HEARTBEAT_RPC =
  "upsert_platform_live_presence_heartbeat";

export const PLATFORM_LIVE_PRESENCE_HEARTBEAT_API_PATH =
  "/api/live-presence/heartbeat";

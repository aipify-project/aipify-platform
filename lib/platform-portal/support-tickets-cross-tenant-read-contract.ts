/**
 * Platform Support — APP ticket SoT cross-tenant read RPC prepare contract.
 * Fail-closed: SQL is NOT_APPLIED; no live Platform UI / API wiring in this job.
 */

export const PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH =
  "docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql";

/** SHA-256 of the NOT_APPLIED SQL file at authoring time — update only with intentional SQL edits. */
export const PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_SHA256 =
  "63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291";

/** RPC names proposed in the NOT_APPLIED SQL (not connected). */
export const PLATFORM_SUPPORT_TICKETS_READ_RPCS = [
  "list_platform_app_portal_support_requests",
  "get_platform_app_portal_support_request",
  "get_platform_app_portal_support_request_counts",
] as const;

/** Documented channel values on app_portal_support_requests (Phase 620). */
export const APP_PORTAL_SUPPORT_CHANNEL_VALUES = [
  "app_portal",
  "email",
  "chat",
  "phone",
  "assistant",
] as const;

/**
 * Role policy for this prepare:
 * Active platform_admins with role super_admin OR platform_support
 * (via _ppsf258_require_platform_access).
 */
export const PLATFORM_SUPPORT_TICKETS_READ_ROLES = [
  "super_admin",
  "platform_support",
] as const;

/** Must stay false until a named owner apply job relocates/applies the SQL. */
export const PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED = false;

/** Must stay false — no live Platform Support UI uses APP SoT yet. */
export const PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED = false;

/** Future four-channel mapping — documentation only; no ingest in this job. */
export const PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN = {
  public_aipify_site: {
    desiredLabel: "Aipify public website",
    today: "No ticket write path (marketing /contact mailto)",
    futureSoTHint:
      "New intake → app_portal_support_requests with an additive channel or source marker (owner migration)",
  },
  kompis_web: {
    desiredLabel: "Kompis Web",
    today: "Website Kompis ask/FAQ (frozen public chain) — not APP tickets",
    futureSoTHint:
      "Optional human-request path → ticket; product badge from website_kompis entitlement only",
  },
  kompis_bedrift_app: {
    desiredLabel: "Kompis Bedrift / APP",
    today: "app_portal_support_requests (channel default app_portal)",
    futureSoTHint: "Primary SoT for Platform read RPCs in this contract",
  },
  sellers_partners: {
    desiredLabel: "Selgere / Partners",
    today: "No dedicated partner ticket table; Growth Partner links to /app/support",
    futureSoTHint:
      "Partner escalation RPC → ticket with partner attribution only (never owns customer)",
  },
} as const;

export const PLATFORM_SUPPORT_LEGACY_KPI_SOURCES_FORBIDDEN = [
  "list_platform_support_queue",
  "usage_statistics.support_requests_handled",
  "get_platform_dashboard_snapshot.support_resolved",
  "get_since_last_login_engine platform support_resolved",
] as const;

export function assertPlatformSupportTicketsReadIsFailClosed(): boolean {
  return (
    PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED === false &&
    PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED === false &&
    !PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH.includes(
      "supabase/migrations/",
    )
  );
}

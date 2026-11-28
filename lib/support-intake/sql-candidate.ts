/**
 * Authoritative SQL candidate for web + CSP intake RPCs (V3).
 * Gates stay false until owner APPLY YES + separate activation YES.
 */

export const SUPPORT_ALL_CHANNELS_INTAKE_SQL_PATH =
  "docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql" as const;

export const SUPPORT_ALL_CHANNELS_INTAKE_SQL_SHA256 =
  "9ba0499f0abe299e14a5880e75136837e2f512bd9af45a41f8d4293eb3f0d616" as const;

/** Staging-only, and only when no platform company row exists. Not applied. */
export const PLATFORM_COMPANY_RESTORE_SQL_PATH =
  "docs/platform/sql-candidates/platform_company_restore_if_missing_v1.sql" as const;

export const PLATFORM_COMPANY_RESTORE_SQL_SHA256 =
  "20b7364e46b70c82b03c42a8a6c3ad2a0fab0abb5a34c60a12aab549ac64b6ff" as const;

export const SUPPORT_ALL_CHANNELS_INTAKE_RPCS = [
  "platform_support_intake_web_create",
  "platform_support_intake_partner_create",
  "list_partner_support_requests",
  "get_partner_support_request",
  "reply_partner_support_request",
] as const;

/** Legacy placeholder — not installable DDL. */
export const SUPPORT_INTAKE_PLACEHOLDER_SQL_PATH =
  "docs/platform/sql-candidates/platform_support_center_intake_rpc_v1.sql" as const;

export const SUPPORT_INTAKE_PLACEHOLDER_SQL_SHA256 =
  "e987d820b3e0818bd6f2b9b7d0ef64caaf22136f351eced8d19af6b47c3ced0d" as const;

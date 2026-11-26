/**
 * Support Center V1 SQL candidate contract — PREPARED_ONLY, never auto-applied.
 */

export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql";

/** SHA-256 of the candidate SQL file bytes at authoring time. */
export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_SHA256 =
  "247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192";

export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_APPLIED = false as const;

export const PLATFORM_SUPPORT_CENTER_SQL_TABLES = [
  "platform_support_ticket_messages",
  "platform_support_signatures",
  "platform_support_reply_templates",
  "platform_support_ticket_admin_audit",
] as const;

/**
 * Support Center V1 SQL candidate contract — PREPARED_ONLY, never auto-applied.
 */

export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql";

/** SHA-256 of the candidate SQL file bytes at authoring time. */
export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_SHA256 =
  "247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192";

/** Consolidated Staging batch (schema + write RPCs). Prefer this for owner Staging apply. */
export const PLATFORM_SUPPORT_CENTER_STAGING_BATCH_PATH =
  "docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql";

export const PLATFORM_SUPPORT_CENTER_STAGING_BATCH_SHA256 =
  "96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95";

/** Prerequisite Platform read RPCs. */
export const PLATFORM_SUPPORT_CENTER_READ_RPC_PATH =
  "docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql";

export const PLATFORM_SUPPORT_CENTER_READ_RPC_SHA256 =
  "63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291";

/** Persist + timeline + Mine filter RPCs (complete raw SQL). */
export const PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_PATH =
  "docs/platform/sql-candidates/platform_support_center_persist_and_timeline_rpc_v1.sql";

export const PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_SHA256 =
  "7f1a499438d453ab8ab7bef441c2d3cfbdb1628177fef383ee47b4e0277c2df9";

export const PLATFORM_SUPPORT_CENTER_SQL_CANDIDATE_APPLIED = false as const;
export const PLATFORM_SUPPORT_CENTER_STAGING_BATCH_APPLIED = false as const;
/** Applied once on Production Core qbcqoixhrvhnuwphefvw (owner YES, SHA verified). */
export const PLATFORM_SUPPORT_CENTER_PERSIST_TIMELINE_APPLIED = true as const;

export const PLATFORM_SUPPORT_CENTER_SQL_TABLES = [
  "platform_support_ticket_messages",
  "platform_support_signatures",
  "platform_support_reply_templates",
  "platform_support_ticket_admin_audit",
] as const;

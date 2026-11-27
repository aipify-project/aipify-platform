/**
 * Template lifecycle that Production Core can persist today.
 * Draft and delete need the prepared SQL candidate. Do not apply it here.
 *
 * Existing rows without a status column:
 * is_active true → Active, is_active false → Archived.
 */

export const TEMPLATE_LIFECYCLE_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/platform_support_template_lifecycle_v1.sql" as const;

export const TEMPLATE_LIFECYCLE_SQL_CANDIDATE_SHA256 =
  "bb1eef717afe9c1c1e9922da3c04c1a4a7e7fb08b453ff3fb74797b87c8d234c" as const;

export const TEMPLATE_DRAFT_PERSISTED = false as const;
export const TEMPLATE_DELETE_PERSISTED = false as const;
export const TEMPLATE_ARCHIVE_PERSISTED = true as const;
export const TEMPLATE_RESTORE_PERSISTED = true as const;

export const EXISTING_TEMPLATE_STATUS_DEFAULT =
  "is_active true is Active; is_active false is Archived" as const;

/**
 * Public Send-reply Core contract — PREPARED_ONLY until owner YES.
 * Companion APP get-messages SQL is a separate gate.
 */

export const SUPPORT_SEND_PUBLIC_REPLY_SQL_PATH =
  "docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql" as const;

export const SUPPORT_SEND_PUBLIC_REPLY_SQL_SHA256 =
  "6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89" as const;

export const SUPPORT_SEND_PUBLIC_REPLY_RPC =
  "platform_support_send_public_reply" as const;

/** False until Staging/Production apply with exact owner YES. */
export const SUPPORT_SEND_PUBLIC_REPLY_APPLIED = false as const;

export const SUPPORT_APP_VISIBLE_MESSAGES_SQL_PATH =
  "docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql" as const;

export const SUPPORT_APP_VISIBLE_MESSAGES_SQL_SHA256 =
  "3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617" as const;

/** False until companion APP get RPC is applied (separate YES). */
export const SUPPORT_APP_VISIBLE_MESSAGES_APPLIED = false as const;

/**
 * Public Send-reply Core contract.
 * Staging applied 2026-11-27 (SHA 6d19b67f…).
 * Production applied 2026-11-28 (ledger 20261128175108) — runtime activation V1.
 * Companion APP get-messages: Production ledger 20261128175211.
 * Email transport remains OFF.
 */

import {
  isSupportCenterProductionCoreBound,
  isSupportCenterStagingCoreBound,
} from "./staging-core-activation";

export const SUPPORT_SEND_PUBLIC_REPLY_SQL_PATH =
  "docs/sql-candidates/20261127_platform_support_send_public_reply_v1.sql" as const;

export const SUPPORT_SEND_PUBLIC_REPLY_SQL_SHA256 =
  "6d19b67fd8c8e6fbaba5658773992d3b688f66a60f1e56cd9fa564ce3ab4fa89" as const;

export const SUPPORT_SEND_PUBLIC_REPLY_RPC =
  "platform_support_send_public_reply" as const;

/** Staging Core auedugihkduoaikfusqe — owner YES applied 2026-11-27. */
export const SUPPORT_SEND_PUBLIC_REPLY_STAGING_APPLIED = true as const;

/** Production Core qbcqoixhrvhnuwphefvw — owner YES applied 2026-11-28. */
export const SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED = true as const;

/**
 * @deprecated Prefer isSupportSendPublicReplyApplied(url).
 * Mirrors Production applied flag for legacy static imports.
 */
export const SUPPORT_SEND_PUBLIC_REPLY_APPLIED =
  SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED;

export function isSupportSendPublicReplyApplied(
  url: string | null | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL,
): boolean {
  if (isSupportCenterStagingCoreBound(url)) {
    return SUPPORT_SEND_PUBLIC_REPLY_STAGING_APPLIED;
  }
  if (isSupportCenterProductionCoreBound(url)) {
    return SUPPORT_SEND_PUBLIC_REPLY_PRODUCTION_APPLIED;
  }
  return false;
}

export const SUPPORT_APP_VISIBLE_MESSAGES_SQL_PATH =
  "docs/platform/sql-candidates/app_portal_support_customer_visible_messages_in_get_v1.sql" as const;

export const SUPPORT_APP_VISIBLE_MESSAGES_SQL_SHA256 =
  "3582eb87ad1efe3547e63821b59c7d0505239545b728683faf4808825e1a9617" as const;

/** Production get_app_portal_support_request includes customer_visible messages. */
export const SUPPORT_APP_VISIBLE_MESSAGES_APPLIED = true as const;

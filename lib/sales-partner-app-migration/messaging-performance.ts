/**
 * Sales Partner messaging performance contract (Messaging Performance V1).
 *
 * Partner messages stay under /app/sales-partner/messages — never a global APP chat.
 * Full message lists must not load from layout/topbar/auth bootstrap.
 */

export const SALES_PARTNER_MESSAGING_PERFORMANCE_MARKER = "messaging_performance_v1" as const;

export const PARTNER_MESSAGES_APP_PATH = "/app/sales-partner/messages" as const;
export const PARTNER_MESSAGES_API_PATH = "/api/certified-sales-partner/messages" as const;

/** Shared APP notifications — not CSP inbox. */
export const SHARED_APP_NOTIFICATIONS_PATH = "/app/notifications" as const;

/**
 * Unread badge policy: no lightweight count RPC exists yet.
 * Do not fall back to full-list fetches. Do not invent unread=0 on error.
 */
export type PartnerMessageUnreadBadgeStatus =
  | "deferred_no_count_rpc"
  | "live_count_rpc";

export const PARTNER_MESSAGE_UNREAD_BADGE: {
  status: PartnerMessageUnreadBadgeStatus;
  forbiddenFallback: "full_list_fetch";
  sqlCandidatePath: string;
  rpcNameProposed: string;
} = {
  status: "deferred_no_count_rpc",
  forbiddenFallback: "full_list_fetch",
  sqlCandidatePath:
    "docs/platform/sql-candidates/csp_partner_message_unread_count_rpc_v1.sql",
  rpcNameProposed: "csp_partner_message_unread_count",
};

export const PARTNER_MESSAGES_CLIENT_RULES = {
  listFetchAllowedOn: [PARTNER_MESSAGES_APP_PATH] as const,
  listFetchForbiddenIn: [
    "layout",
    "topbar",
    "auth_bootstrap",
    "pathname_change_effects",
    "shared_app_notifications",
  ] as const,
  timeoutMs: 15_000,
  cancelOnNavigate: true,
} as const;

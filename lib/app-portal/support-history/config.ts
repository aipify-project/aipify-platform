/** Canonical Support landing (alias resolves here). */
export const SUPPORT_HISTORY_LANDING_HREF = "/app/support/history";

/** Active support requests workspace. */
export const SUPPORT_REQUESTS_HREF = "/app/support/requests";

/** Create support request entry. */
export const SUPPORT_CREATE_HREF = "/app/support/requests?create=1";

export const HISTORICAL_STATUSES = ["resolved", "closed", "reopened", "archived"] as const;

export const ACTIVE_STATUSES = [
  "open",
  "in_review",
  "waiting_for_customer",
  "waiting_for_aipify",
] as const;

export const SUPPORT_HISTORY_CHANNELS = [
  "app_portal",
  "email",
  "chat",
  "phone",
  "assistant",
] as const;

export const SUPPORT_HISTORY_SORT_OPTIONS = [
  "updated_desc",
  "updated_asc",
  "created_desc",
  "created_asc",
  "priority_desc",
  "title_asc",
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export function resolveCaseDetailHref(caseId: string): string {
  return `/app/support/requests/${caseId}`;
}

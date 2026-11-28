/**
 * Visitors today — Agent 3 / Platform Analytics coordination.
 *
 * Authoritative product policy (`lib/platform-analytics/definitions.ts`):
 * GA4 measurement ID may exist for consented public traffic, but Platform Admin
 * does **not** import GA4 report rows without a separate Data API credential.
 *
 * Until that credential + server aggregate is approved:
 * - status bar shows not_measured (never invent numbers)
 * - do not add new tracking, duplicate events, or env/config changes here
 *
 * When integrating later, use:
 * - same GA4 property as public marketing measurement
 * - calendar day in the same authoritative timezone as other “today” metrics
 * - metric: unique users (activeUsers), NOT sessions or pageviews
 * - surface GA4 reporting delay in the tooltip (not “exact realtime”)
 */

export const VISITORS_TODAY_INTEGRATION = {
  status: "blocked_missing_ga4_data_api" as const,
  metric: "activeUsers",
  window: "calendar_day",
  timezonePolicy: "authoritative_platform_timezone",
  delayNote:
    "GA4 Data API aggregates are delayed relative to live collection; never label as exact realtime.",
  requiredApprovals: [
    "GA4 Data API credential (server-only, no client secrets)",
    "Same property as public consented measurement",
    "Agent 3 analytics ownership confirmation",
  ],
  uiBehavior: "not_measured",
} as const;

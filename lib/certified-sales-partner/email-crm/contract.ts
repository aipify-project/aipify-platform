/**
 * Canonical Sales Partner email + CRM contract.
 * One API family: /api/certified-sales-partner/email/*
 * One SQL file. The digest is never written into the SQL file.
 *
 * Hash method:
 *   shasum -a 256 docs/platform/sql-candidates/csp_sales_email_crm_v1.sql
 */
export const CSP_SALES_EMAIL_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/csp_sales_email_crm_v1.sql" as const;

export const CSP_SALES_EMAIL_API = {
  send: "/api/certified-sales-partner/email/marketing-send",
  inbound: "/api/certified-sales-partner/email/inbound",
  notifications: "/api/certified-sales-partner/email/notifications",
  thread: "/api/certified-sales-partner/email/thread",
  adminEvents: "/api/platform/sellers/sales-email/events",
} as const;

/** Retired names. They do not unlock sending or inbound processing. */
export const CSP_SALES_EMAIL_RETIRED_ENV = [
  "CSP_MARKETING_EMAIL_SEND_ENABLED",
  "CSP_EMAIL_INBOUND_WEBHOOK_SECRET",
] as const;

export const CSP_SALES_EMAIL_RPCS = [
  "csp_sales_email_backend_status",
  "csp_sales_email_record_send",
  "csp_sales_email_mark_send_result",
  "csp_sales_email_ingest_reply",
  "csp_sales_email_list_unread",
  "csp_sales_email_mark_notification_read",
  "csp_sales_email_list_leads",
  "csp_sales_email_list_thread",
  "csp_sales_email_admin_list",
] as const;

export const SALES_EMAIL_RETENTION_DAYS = 180;
export const SALES_EMAIL_TENANT = "aipify_internal";

/**
 * PREPARED_ONLY persistence contract. App code must not treat email replies as
 * stored leads until Core reports this package applied.
 */
export const CSP_SALES_EMAIL_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/csp_sales_email_crm_v1.sql" as const;

/** Recomputed from the candidate file. Do not edit by hand after a SQL change. */
export const CSP_SALES_EMAIL_SQL_CANDIDATE_SHA256 =
  "72369af8a9a21bb00dd291bf590e9f11c65f3f33fac5349b56ed7dd687d885b7" as const;

export const CSP_SALES_EMAIL_RPCS = [
  "csp_sales_email_backend_status",
  "csp_sales_email_list_templates",
  "csp_sales_email_save_template_draft",
  "csp_sales_email_publish_template",
  "csp_sales_email_withdraw_template",
  "csp_sales_email_record_send",
  "csp_sales_email_ingest_reply",
  "csp_sales_email_list_leads",
  "csp_sales_email_list_thread",
  "csp_sales_email_set_lead_status",
  "csp_sales_email_list_unread",
  "csp_sales_email_mark_notification_read",
] as const;

export const SALES_EMAIL_RETENTION_DAYS = 180;

export const SALES_EMAIL_OWNER_BLOCKERS = [
  "CSP_SALES_EMAIL_OUTBOUND=owner_approved",
  "CSP_SALES_EMAIL_LAWFUL_BASIS=owner_recorded",
  "CSP_SALES_EMAIL_ALLOWLIST one address",
  "CSP_SALES_EMAIL_REPLY_DOMAIN verified inbound domain",
  "CSP_SALES_EMAIL_TOKEN_SECRET",
  "CSP_SALES_EMAIL_INBOUND_SECRET or RESEND webhook whsec",
  "RESEND_API_KEY on the sending project",
  "Apply csp_sales_email_crm_v1.sql on Staging, then Production, as two separate approvals",
] as const;

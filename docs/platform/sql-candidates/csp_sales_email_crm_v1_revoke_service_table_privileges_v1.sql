-- PREPARED_ONLY. Security patch for the CSP sales email CRM candidate.
-- This file does not replace csp_sales_email_crm_v1.sql.
-- Staging already applied that candidate. Its SHA256 stays
-- a72df92796ac16140ca99b3cb16f18cf7d44c08b9973bc5c9753fcc5995924e5.
-- Apply this patch only after that file, and only with a separate owner approval
-- that names this file's own SHA256 and the target project.
--
-- Effect: remove table privileges from service_role on the seven CRM tables.
-- Staging showed those privileges as TRUNCATE, REFERENCES, TRIGGER, and MAINTAIN.
-- They came from postgres default privileges. The original file revoked
-- public, anon, and authenticated, and did not revoke service_role.
-- The RPCs are SECURITY DEFINER and owned by postgres, so they do not use
-- service_role table grants. This patch does not change function EXECUTE grants.
-- It does not insert, update, delete, or truncate rows.
-- It does not call csp_sales_email_purge_expired.
-- It does not touch csp_qualified_sales or csp_commission_ledger.

revoke all privileges on table
  public.csp_sales_email_sends,
  public.csp_sales_email_provider_events,
  public.csp_sales_email_leads,
  public.csp_sales_email_messages,
  public.csp_sales_email_notifications,
  public.csp_sales_email_suppressions,
  public.csp_sales_email_audit
from service_role;

-- NOT APPLIED — SQL candidate only.
-- Exact owner YES required before Staging/Production apply.
-- Purpose: optional security-definer RPC wrapping customers.full_name / phone updates
-- with platform-admin gate + audit. CODE path already uses service-role update after
-- is_platform_admin() + record_platform_admin_audit_event() for ordinary contact fields.
-- High-risk email remains update_platform_portal_customer_contact_email.
-- Address / company website remain blocked until company_profile_* candidates apply.

-- Suggested contract (do not apply without owner YES):
-- create or replace function public.update_platform_portal_customer_primary_contact(
--   p_customer_id uuid,
--   p_full_name text,
--   p_phone text,
--   p_confirmation boolean,
--   p_internal_reason text,
--   p_support_ticket_reference text default null,
--   p_idempotency_key text
-- ) returns jsonb ...
-- Requires: is_platform_admin(); never mutates email, organization_number, legal name.
-- Audit: record_platform_admin_audit_event('customer_primary_contact_update', ...).

select 'NOT_APPLIED_platform_customer_primary_contact_write_v1' as draft_marker;

-- =============================================================================
-- PREPARED_ONLY — Platform Support Center intake RPCs V1
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
--
-- Residual after Production Support Center LIVE (read + platform write):
--   Web / CSP / guest ticket create was NOT included in
--   platform_support_center_staging_batch_v1.sql.
--
-- Prerequisites (already on Production after Support Center LIVE apply):
--   app_portal_support_requests
--   platform_support_guest_contacts
--   _ppsf258_require_platform_access (platform writes only; intake uses narrower actors)
--
-- Non-goals:
--   No email send · no CSP sales-email CRM · no secrets/DNS
-- =============================================================================

-- Placeholder contract (implement in owner-approved apply job):
--   public.platform_support_intake_web_create(p_email, p_display_name, p_title, p_body, p_category, p_priority)
--   public.platform_support_intake_partner_create(p_title, p_body, p_category, p_priority)
-- Both must:
--   - derive company/partner from server session / guest contact — never from client IDs
--   - insert into app_portal_support_requests with channel app_portal (or additive marker)
--   - write platform_support_ticket_messages inbound row
--   - revoke execute from anon except rate-limited web RPC if product requires it
--   - grant execute to authenticated for partner path only

select 'PREPARED_ONLY_platform_support_center_intake_rpc_v1' as draft_marker;

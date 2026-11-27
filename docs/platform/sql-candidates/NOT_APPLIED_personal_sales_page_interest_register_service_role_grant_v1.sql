-- =============================================================================
-- NOT_APPLIED — GRANT-ONLY CANDIDATE — DO NOT AUTO-DEPLOY — DO NOT EXECUTE
-- WITHOUT A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Job: AIPIFY_PERSONAL_SALES_INTEREST_CODE_LIVE_SQL_GRANT_PREFLIGHT
-- Target: Production Aipify Core (project qbcqoixhrvhnuwphefvw)
-- Purpose: Allow the server-only interest route to call the existing register RPC
--          via SUPABASE_SERVICE_ROLE_KEY after PR #481 is LIVE with the form gate OFF.
--
-- LOCATION RULE:
--   This file lives under docs/platform/sql-candidates/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until an
--   owner-named apply job explicitly applies it.
--
-- Verified Production baseline (read-only, 2026-11-28):
--   signature:
--     public.register_personal_sales_page_interest(
--       p_code text,
--       p_email text,
--       p_display_name text,
--       p_product_key text,
--       p_locale text,
--       p_idempotency_key text,
--       p_follow_up_acknowledged boolean,
--       p_company_website text
--     )
--   EXECUTE today: postgres = true
--   EXECUTE today: service_role = false
--   EXECUTE today: anon = false
--   EXECUTE today: authenticated = false
--   EXECUTE today: authenticator = false
--
-- EXPLICIT NON-GOALS:
--   ZERO CREATE/REPLACE of the register function
--   ZERO grants to anon / authenticated / PUBLIC / authenticator
--   ZERO table grants on growth_partner_ops_leads
--   ZERO form activation (personalSalesLeadEnabled stays false until separate YES)
--   ZERO email / Stripe / commission / test-data changes
-- =============================================================================

revoke execute on function public.register_personal_sales_page_interest(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text
) from public, anon, authenticated;

grant execute on function public.register_personal_sales_page_interest(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text
) to service_role;

-- ---------------------------------------------------------------------------
-- Post-apply expected ACL (read-only verification — not part of apply):
--   postgres = EXECUTE
--   service_role = EXECUTE
--   anon = false
--   authenticated = false
-- ---------------------------------------------------------------------------

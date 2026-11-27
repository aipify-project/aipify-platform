-- =============================================================================
-- SUPERSEDED / DO NOT APPLY — duplicate of work already done by PR #472
-- =============================================================================
-- Authoritative Staging implementation (APPLIED):
--   PR #472 · docs/platform/sql-candidates/20261127_staging_growth_partner_permission_helpers_v1.sql
--   Staging auedugihkduoaikfusqe already has:
--     - public.users.account_status
--       CHECK (pending_verification|active|suspended|locked|deleted)
--     - public._irp_user_account_ok(uuid)
--     - public._irp_has_permission(text, uuid)
--   EXECUTE: service_role only (anon/authenticated revoked) — do not widen.
--
-- This #470 helpers candidate must NOT be applied:
--   - Would recreate/replace functions already installed by #472
--   - Would use a non-Production account_status check set (disabled/invited)
--     that conflicts with the live #472 Production-aligned CHECK
--   - Would grant EXECUTE to authenticated (widens #472 ACL)
--
-- Optional remaining (non-blocking for Growth Partner profile foundation):
--   docs/platform/sql-candidates/growth_partners_staging_irp_require_permission_v1.sql
--   Only if platform RPCs that call _irp_require_permission are needed on Staging.
--   Growth Partner _gp456_access uses _irp_has_permission only — not require.
--
-- Former helpers SHA (obsolete): c535d71e397d0b8d6437d8d9dae6e09a3317eaeb398fa356cb5e8698d0bbad93
-- =============================================================================

do $$
begin
  raise exception 'SUPERSEDED by PR #472 applied helpers — do not apply growth_partners_staging_irp_helpers_v1.sql';
end
$$;

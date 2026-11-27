-- =============================================================================
-- SUPERSEDED — DO NOT APPLY
-- =============================================================================
-- Replaced by:
--   docs/platform/sql-candidates/growth_partners_staging_irp_helpers_v1.sql
--   SHA256 c535d71e397d0b8d6437d8d9dae6e09a3317eaeb398fa356cb5e8698d0bbad93
--
-- Reason (AIPIFY_GROWTH_PARTNERS_IRP_HELPERS_RECONCILE_V1):
--   PR #469 already installed and verified on Staging (auedugihkduoaikfusqe):
--     marketplace_modules
--     aipify_permissions
--     organization_role_permissions
--     organization_user_permissions
--     organization_modules  (Production form; do not recreate)
--
-- This former foundation candidate created those five tables + optional seeds.
-- That work must NOT be re-applied. Use the helpers-only candidate instead.
--
-- Former SHA (obsolete): 85ea4efa86cba0c6ca1fe3659d48b5fcdc1cb6c033a3425f7610587edd05f11f
-- =============================================================================

do $$
begin
  raise exception 'SUPERSEDED: use growth_partners_staging_irp_helpers_v1.sql — do not apply this file';
end
$$;

-- =============================================================================
-- SUPERSEDED / DO NOT APPLY
-- =============================================================================
-- Tables: PR #469 (already on Staging) — do not recreate.
-- Helpers: PR #472 (already on Staging) — authoritative applied implementation.
-- Optional only: growth_partners_staging_irp_require_permission_v1.sql
-- =============================================================================

do $$
begin
  raise exception 'SUPERSEDED: tables via #469, helpers via #472 — do not apply this file';
end
$$;

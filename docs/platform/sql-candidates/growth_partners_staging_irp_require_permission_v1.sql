-- =============================================================================
-- PREPARED_ONLY — Staging _irp_require_permission only (OPTIONAL / MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) ONLY.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
--
-- Context (READ-ONLY verified 2026-11-27):
--   PR #472 already installed on Staging (authoritative — do NOT recreate):
--     users.account_status
--     public._irp_user_account_ok(uuid)
--     public._irp_has_permission(text, uuid)
--   EXECUTE on those helpers: service_role only (anon/authenticated false).
--
-- This file adds ONLY:
--   public._irp_require_permission(text, uuid)
--   Thin fail-closed wrapper matching Production body.
--
-- Necessity:
--   NOT required for Growth Partner profile foundation / _gp456_access
--   (those call _irp_has_permission directly).
--   Optional platform parity for RPCs that `perform _irp_require_permission(...)`.
--
-- Explicitly NOT included:
--   - users.account_status / _irp_user_account_ok / _irp_has_permission
--   - permission tables, seeds, organization_modules rows
--   - email, Stripe, Support, Production
--
-- ACL: match #472 — revoke public/anon/authenticated; grant service_role only.
--   (Does not widen existing helper grants.)
--
-- Hash:
--   shasum -a 256 docs/platform/sql-candidates/growth_partners_staging_irp_require_permission_v1.sql
-- =============================================================================

begin;

do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_has_permission'
  ) then
    raise exception 'preflight_failed: _irp_has_permission missing — apply PR #472 helpers first';
  end if;

  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_require_permission'
  ) then
    raise notice 'growth_partners_staging_irp_require_permission_v1: already present — idempotent replace';
  end if;
end
$$;

create or replace function public._irp_require_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._irp_has_permission(p_permission_key, p_organization_id) then
    raise exception 'Permission denied: %', p_permission_key;
  end if;
end;
$$;

revoke all on function public._irp_require_permission(text, uuid) from public, anon, authenticated;
grant execute on function public._irp_require_permission(text, uuid) to service_role;

do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_require_permission'
  ) then
    raise exception 'postcondition_failed: _irp_require_permission missing';
  end if;
  if has_function_privilege('anon', 'public._irp_require_permission(text,uuid)', 'execute')
     or has_function_privilege('authenticated', 'public._irp_require_permission(text,uuid)', 'execute')
     or not has_function_privilege('service_role', 'public._irp_require_permission(text,uuid)', 'execute')
  then
    raise exception 'postcondition_failed: unexpected EXECUTE grants on _irp_require_permission';
  end if;
  raise notice 'growth_partners_staging_irp_require_permission_v1: READY (optional)';
end
$$;

commit;

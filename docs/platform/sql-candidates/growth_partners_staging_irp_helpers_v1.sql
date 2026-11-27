-- =============================================================================
-- PREPARED_ONLY — Growth Partners Staging IRP helpers only (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) ONLY.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
--
-- Context (READ-ONLY verified 2026-11-27):
--   PR #469 already installed on Staging (do NOT recreate):
--     marketplace_modules
--     aipify_permissions
--     organization_role_permissions
--     organization_user_permissions
--     organization_modules  (Production form: status/activated_at/settings +
--                           FK to organizations + marketplace_modules)
--   RLS enabled on all five; table ACL = postgres + service_role only
--   (no anon/authenticated table grants). Row counts currently 0.
--
-- This file adds ONLY missing IRP helper dependencies:
--   1) users.account_status (additive column)
--   2) public._irp_user_account_ok(uuid)
--   3) public._irp_has_permission(text, uuid)
--   4) public._irp_require_permission(text, uuid) — thin wrapper used by
--      later Growth Partner / IRP callers; does not grant table access
--
-- Explicitly NOT included:
--   - CREATE/ALTER of the five #469 tables
--   - Alternate organization_modules shape
--   - Permission catalog inserts / role grants / organization_modules rows
--   - growth_partner_* tables, interest RPC, email, Stripe, Support, Production
--
-- Access note:
--   EXECUTE is granted on the three NEW functions to authenticated + service_role
--   so permission checks can run. Functions are fail-closed (false / exception).
--   No new SELECT/INSERT/UPDATE/DELETE on existing tables is granted to
--   anon or authenticated.
--
-- Rollback (manual, owner-approved):
--   drop function if exists public._irp_require_permission(text, uuid);
--   drop function if exists public._irp_has_permission(text, uuid);
--   drop function if exists public._irp_user_account_ok(uuid);
--   -- optional: alter table public.users drop column if exists account_status;
--
-- Hash:
--   shasum -a 256 docs/platform/sql-candidates/growth_partners_staging_irp_helpers_v1.sql
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 0) Preflight — require #469 tables; refuse wrong environment assumptions
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.marketplace_modules') is null
     or to_regclass('public.aipify_permissions') is null
     or to_regclass('public.organization_role_permissions') is null
     or to_regclass('public.organization_user_permissions') is null
     or to_regclass('public.organization_modules') is null
  then
    raise exception 'preflight_failed: #469 permission/module tables missing — stop';
  end if;

  if to_regclass('public.users') is null then
    raise exception 'preflight_failed: public.users missing';
  end if;
  if to_regclass('public.organizations') is null then
    raise exception 'preflight_failed: public.organizations missing';
  end if;
  if to_regclass('public.organization_users') is null then
    raise exception 'preflight_failed: public.organization_users missing';
  end if;

  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_mta_app_user_id'
  ) then
    raise exception 'preflight_failed: public._mta_app_user_id missing';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_mta_membership_active'
  ) then
    raise exception 'preflight_failed: public._mta_membership_active missing';
  end if;

  -- organization_modules must keep Production-form status column (not recreate)
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_modules'
      and column_name = 'status'
  ) then
    raise exception 'preflight_failed: organization_modules.status missing — unexpected shape';
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 1) users.account_status — required by _irp_user_account_ok
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists account_status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'users_account_status_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_account_status_check
      check (account_status in ('active', 'suspended', 'disabled', 'invited'));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2) _irp_user_account_ok
-- ---------------------------------------------------------------------------
create or replace function public._irp_user_account_ok(
  p_user_id uuid default public._mta_app_user_id()
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if p_user_id is null then
    return false;
  end if;
  select account_status into v_status from public.users where id = p_user_id;
  if not found then
    return false;
  end if;
  return coalesce(v_status, 'active') = 'active';
end;
$$;

-- ---------------------------------------------------------------------------
-- 3) _irp_has_permission — Production IRP org-resolver repair body
--    Does not depend on _mta_require_organization (absent on Staging).
-- ---------------------------------------------------------------------------
create or replace function public._irp_has_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_membership public.organization_users;
  v_override boolean;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return false; end if;
  if not public._irp_user_account_ok(v_user_id) then return false; end if;

  if p_organization_id is not null then
    v_org_id := p_organization_id;
  else
    select c.id
    into v_org_id
    from public.users u
    join public.customers c on c.company_id = u.company_id
    where u.id = v_user_id
    limit 1;

    if v_org_id is null then
      select ouc.organization_id
      into v_org_id
      from public.organization_user_context ouc
      where ouc.user_id = v_user_id;
    end if;

    if v_org_id is null then
      select ou.organization_id
      into v_org_id
      from public.organization_users ou
      where ou.user_id = v_user_id
        and ou.status = 'active'
      order by ou.joined_at nulls last, ou.created_at
      limit 1;
    end if;
  end if;

  if v_org_id is null then return false; end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then return false; end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = v_org_id
    and user_id = v_user_id
    and permission_key = p_permission_key;
  if found then return v_override; end if;

  if not exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key into v_module_key
  from public.aipify_permissions
  where permission_key = p_permission_key;

  if v_module_key is not null and exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
  ) and not exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
      and m.status in ('active', 'beta')
  ) then
    return false;
  end if;

  return true;
exception when others then
  return false;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4) _irp_require_permission — thin fail-closed wrapper
-- ---------------------------------------------------------------------------
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

-- Function EXECUTE only — no table ACL changes
revoke all on function public._irp_user_account_ok(uuid) from public, anon;
revoke all on function public._irp_has_permission(text, uuid) from public, anon;
revoke all on function public._irp_require_permission(text, uuid) from public, anon;
grant execute on function public._irp_user_account_ok(uuid) to authenticated, service_role;
grant execute on function public._irp_has_permission(text, uuid) to authenticated, service_role;
grant execute on function public._irp_require_permission(text, uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 5) Post-condition
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'account_status'
  ) then
    raise exception 'postcondition_failed: users.account_status missing';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_has_permission'
  ) then
    raise exception 'postcondition_failed: _irp_has_permission missing';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_user_account_ok'
  ) then
    raise exception 'postcondition_failed: _irp_user_account_ok missing';
  end if;
  raise notice 'growth_partners_staging_irp_helpers_v1: READY (tables untouched)';
end
$$;

commit;

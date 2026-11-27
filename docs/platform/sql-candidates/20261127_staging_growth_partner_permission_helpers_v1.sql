-- =============================================================================
-- PREPARED_ONLY — Growth Partner Staging permission helpers (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Installs the live Production function bodies for:
--   public._irp_user_account_ok(uuid)
--   public._irp_has_permission(text, uuid)
-- Adds public.users.account_status only, because Staging does not have it and the
-- account function reads that column. Existing users receive the Production default
-- 'active'. That passes only the account gate. It does not assign permissions,
-- change organizations, create sellers, or insert rows into permission tables.
--
-- Execute is revoked from public, anon, and authenticated. service_role may execute.
-- A missing role or user permission still returns false.
-- Historical migrations 20260707000000 and 20261909000001 are not applied.
-- =============================================================================

do $$
begin
  if to_regclass('public.users') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.customers') is null
     or to_regclass('public.organization_users') is null
     or to_regclass('public.organization_user_context') is null
     or to_regclass('public.aipify_permissions') is null
     or to_regclass('public.organization_role_permissions') is null
     or to_regclass('public.organization_user_permissions') is null
     or to_regclass('public.organization_modules') is null
     or to_regprocedure('public._mta_app_user_id()') is null
     or to_regprocedure('public._mta_membership_active(uuid,uuid)') is null then
    raise exception 'prerequisite missing for permission helpers';
  end if;
  if (
    select count(*) from pg_roles
    where rolname in ('anon', 'authenticated', 'service_role')
  ) <> 3 then
    raise exception 'prerequisite missing: roles anon, authenticated, service_role';
  end if;
end
$$;

alter table public.users
  add column if not exists account_status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_account_status_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_account_status_check
      check (account_status = any (array[
        'pending_verification'::text, 'active'::text, 'suspended'::text, 'locked'::text, 'deleted'::text
      ]));
  end if;
end
$$;

create or replace function public._irp_user_account_ok(p_user_id uuid default public._mta_app_user_id())
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_status text;
begin
  select account_status into v_status from public.users where id = p_user_id;
  return coalesce(v_status, 'active') = 'active';
end; $$;

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

revoke all on function public._irp_user_account_ok(uuid) from public, anon, authenticated;
revoke all on function public._irp_has_permission(text, uuid) from public, anon, authenticated;
grant execute on function public._irp_user_account_ok(uuid) to service_role;
grant execute on function public._irp_has_permission(text, uuid) to service_role;

do $$
declare
  v_ok text;
  v_has text;
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'account_status'
      and is_nullable = 'NO'
      and column_default = '''active''::text'
      and data_type = 'text'
  ) then
    raise exception 'users.account_status does not match Production';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_account_status_check'
      and conrelid = 'public.users'::regclass
      and pg_get_constraintdef(oid) = 'CHECK ((account_status = ANY (ARRAY[''pending_verification''::text, ''active''::text, ''suspended''::text, ''locked''::text, ''deleted''::text])))'
  ) then
    raise exception 'users.account_status check does not match Production';
  end if;

  select md5(p.prosrc) into v_ok
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '_irp_user_account_ok'
    and pg_get_function_identity_arguments(p.oid) = 'p_user_id uuid';
  select md5(p.prosrc) into v_has
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '_irp_has_permission'
    and pg_get_function_identity_arguments(p.oid) = 'p_permission_key text, p_organization_id uuid';

  if v_ok is distinct from '225d36df580a68e917439e46f3d01b95'
     or v_has is distinct from 'f6fc04597a3db28b21f04e380f267046' then
    raise exception 'function body does not match Production';
  end if;

  if has_function_privilege('anon', 'public._irp_has_permission(text,uuid)', 'execute')
     or has_function_privilege('authenticated', 'public._irp_has_permission(text,uuid)', 'execute')
     or has_function_privilege('anon', 'public._irp_user_account_ok(uuid)', 'execute')
     or has_function_privilege('authenticated', 'public._irp_user_account_ok(uuid)', 'execute')
     or not has_function_privilege('service_role', 'public._irp_has_permission(text,uuid)', 'execute')
     or not has_function_privilege('service_role', 'public._irp_user_account_ok(uuid)', 'execute') then
    raise exception 'function privileges are wider than this candidate allows';
  end if;
end
$$;

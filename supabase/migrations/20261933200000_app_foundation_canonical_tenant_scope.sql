-- Foundation 3.1 — canonical APP active organization + admin gates for operational access.
-- Aligns has_organization_permission and _bde_require_admin with get_app_organization_context /
-- _presence_tenant_for_auth resolution (organization_user_context first, customer fallback).

-- ---------------------------------------------------------------------------
-- Canonical active APP organization resolver
-- ---------------------------------------------------------------------------
create or replace function public._app_active_organization_id_for_auth()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_customer_id uuid;
  v_org_id uuid;
  v_context_org_id uuid;
begin
  if auth.uid() is null then
    return null;
  end if;

  select u.*
  into v_user
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user.id is null then
    return null;
  end if;

  select c.id
  into v_customer_id
  from public.customers c
  where c.company_id = v_user.company_id
  limit 1;

  if v_customer_id is null then
    return null;
  end if;

  v_org_id := v_customer_id;

  select ouc.organization_id
  into v_context_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user.id
    and exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = ouc.organization_id
        and ou.user_id = v_user.id
        and ou.status = 'active'
    )
  limit 1;

  if v_context_org_id is not null then
    v_org_id := v_context_org_id;
  end if;

  return v_org_id;
end;
$$;

comment on function public._app_active_organization_id_for_auth() is
  'Canonical APP active organization: organization_user_context (active membership) first, else home customer org.';

-- ---------------------------------------------------------------------------
-- Presence tenant — delegate to canonical resolver (fail closed when unauthenticated)
-- ---------------------------------------------------------------------------
create or replace function public._presence_tenant_for_auth()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  v_org_id := public._app_active_organization_id_for_auth();
  return v_org_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Canonical APP admin capability (tenant owner/admin OR platform super_admin)
-- ---------------------------------------------------------------------------
create or replace function public._app_has_canonical_admin_capability()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if auth.uid() is null then
    return false;
  end if;

  if exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
  ) then
    return true;
  end if;

  select u.role
  into v_role
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  return v_role in ('owner', 'admin');
end;
$$;

comment on function public._app_has_canonical_admin_capability() is
  'APP operational admin: users.role owner/admin, or platform super_admin only.';

-- ---------------------------------------------------------------------------
-- Business DNA admin gate — canonical APP admin path
-- ---------------------------------------------------------------------------
create or replace function public._bde_require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public._app_has_canonical_admin_capability() then
    return;
  end if;

  raise exception 'Owner or admin role required';
end;
$$;

-- ---------------------------------------------------------------------------
-- Organization permission — resolve org via canonical active organization
-- ---------------------------------------------------------------------------
create or replace function public.has_organization_permission(p_permission_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_membership public.organization_users;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null or p_permission_key is null then
    return false;
  end if;

  v_org_id := public._app_active_organization_id_for_auth();
  if v_org_id is null then
    return false;
  end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then
    return false;
  end if;

  if exists (
    select 1
    from public.organization_user_permissions oup
    where oup.organization_id = v_org_id
      and oup.user_id = v_user_id
      and oup.permission_key = p_permission_key
  ) then
    return (
      select oup.granted
      from public.organization_user_permissions oup
      where oup.organization_id = v_org_id
        and oup.user_id = v_user_id
        and oup.permission_key = p_permission_key
      limit 1
    );
  end if;

  if not exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key
  into v_module_key
  from public.aipify_permissions
  where permission_key = p_permission_key;

  if v_module_key is not null and exists (
    select 1
    from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
  ) and not exists (
    select 1
    from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
      and m.status in ('active', 'beta')
  ) then
    return false;
  end if;

  return true;
exception
  when others then
    return false;
end;
$$;

grant execute on function public.has_organization_permission(text) to authenticated;

notify pgrst, 'reload schema';

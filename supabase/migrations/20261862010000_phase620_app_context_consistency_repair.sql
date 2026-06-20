-- Phase 620 P1 — APP organization context, permission registry, and module gate consistency.

-- ---------------------------------------------------------------------------
-- 1. Fix IRP module gate (organization_modules uses status, not enabled)
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

  v_org_id := public._mta_require_organization(p_organization_id);
  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then return false; end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = v_org_id
    and user_id = v_user_id
    and permission_key = p_permission_key;
  if found then return v_override; end if;

  if not exists (
    select 1 from public.organization_role_permissions rp
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
-- 2. Sync APP portal permissions + modules for an organization (idempotent)
-- ---------------------------------------------------------------------------
create or replace function public.sync_app_organization_access(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module_key text;
begin
  if p_organization_id is null then return; end if;

  perform public._irp_seed_role_permissions(p_organization_id);

  insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
  select v.key, v.label, v.module_key, v.description
  from (values
    ('notifications.view', 'View Notifications', 'notification_communication', 'View organization notification center'),
    ('notifications.manage', 'Manage Notifications', 'notification_communication', 'Manage notification delivery preferences'),
    ('self_support.view', 'View Self Support', null, 'Access APP self-support areas'),
    ('success.view', 'View Customer Success', null, 'Access customer success center'),
    ('executive.view', 'View Executive Center', null, 'Access executive command center')
  ) as v(key, label, module_key, description)
  where not exists (
    select 1 from public.aipify_permissions p where p.permission_key = v.key
  );

  insert into public.organization_role_permissions (organization_id, role, permission_key)
  select p_organization_id, v.role, v.key
  from (values
    ('owner', 'notifications.view'),
    ('owner', 'notifications.manage'),
    ('owner', 'self_support.view'),
    ('owner', 'success.view'),
    ('owner', 'executive.view'),
    ('administrator', 'notifications.view'),
    ('administrator', 'notifications.manage'),
    ('administrator', 'self_support.view'),
    ('administrator', 'success.view'),
    ('administrator', 'executive.view'),
    ('manager', 'notifications.view'),
    ('manager', 'self_support.view'),
    ('manager', 'success.view'),
    ('manager', 'executive.view'),
    ('support_agent', 'notifications.view'),
    ('support_agent', 'self_support.view'),
    ('support_agent', 'success.view'),
    ('viewer', 'notifications.view'),
    ('viewer', 'self_support.view'),
    ('viewer', 'success.view'),
    ('viewer', 'executive.view')
  ) as v(role, key)
  on conflict (organization_id, role, permission_key) do nothing;

  foreach v_module_key in array array[
    'notification_communication',
    'support_ai',
    'operations_center',
    'strategic_intelligence'
  ] loop
    if exists (
      select 1 from public.marketplace_modules mm where mm.module_key = v_module_key
    ) and not exists (
      select 1 from public.organization_modules om
      where om.organization_id = p_organization_id
        and om.module_key = v_module_key
    ) then
      insert into public.organization_modules (
        organization_id,
        module_key,
        status,
        activated_at
      ) values (
        p_organization_id,
        v_module_key,
        'active',
        now()
      );
    elsif exists (
      select 1 from public.organization_modules om
      where om.organization_id = p_organization_id
        and om.module_key = v_module_key
        and om.status not in ('active', 'beta')
    ) then
      update public.organization_modules
      set status = 'active',
          activated_at = coalesce(activated_at, now()),
          updated_at = now()
      where organization_id = p_organization_id
        and module_key = v_module_key;
    end if;
  end loop;

  if exists (select 1 from pg_proc where proname = '_ls510_ensure_state') then
    perform public._ls510_ensure_state(p_organization_id);
    perform public._ls510_sync_from_subscription(p_organization_id);
  end if;

  if exists (select 1 from pg_proc where proname = '_ecc590_seed') then
    perform public._ecc590_seed(p_organization_id);
  end if;
end;
$$;

revoke all on function public.sync_app_organization_access(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Executive Command Center — use authoritative organization resolver
-- ---------------------------------------------------------------------------
create or replace function public._ecc590_org()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select public._mta_require_organization();
$$;

-- ---------------------------------------------------------------------------
-- 4. Authoritative APP organization context (membership-first)
-- ---------------------------------------------------------------------------
create or replace function public.get_app_organization_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_customer_id uuid;
  v_company_name text;
  v_org_id uuid;
  v_org public.organizations;
  v_membership public.organization_users;
  v_app_access jsonb;
  v_license jsonb;
  v_state text := 'ready';
  v_has_app_access boolean := false;
  v_plan_name text;
  v_license_status text;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated', false, 'state', 'unauthenticated');
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    begin
      perform public.provision_tenant_for_auth_user();
    exception when others then null;
    end;
    select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  end if;

  if v_user.id is null then
    return jsonb_build_object(
      'authenticated', true,
      'state', 'user_not_provisioned',
      'has_customer', false,
      'has_organization_membership', false,
      'has_app_access', false
    );
  end if;

  if v_user.company_id is not null then
    select co.name into v_company_name
    from public.companies co
    where co.id = v_user.company_id;
  end if;

  select c.id
  into v_customer_id
  from public.customers c
  where c.company_id = v_user.company_id
  limit 1;

  if v_customer_id is not null then
    perform public._mta_sync_organization_from_customer(v_customer_id);
    perform public._mta_backfill_memberships(v_customer_id);
    perform public.sync_app_organization_access(v_customer_id);
    v_org_id := v_customer_id;
    select * into v_org from public.organizations where id = v_org_id;
    v_membership := public._mta_membership_active(v_org_id, v_user.id);
  else
    v_state := 'organization_missing';
  end if;

  select coalesce(s.plan_name, initcap(replace(coalesce(s.plan_key, s.plan_type, 'business'), '_', ' ')))
  into v_plan_name
  from public.subscriptions s
  where s.customer_id = v_customer_id
  order by s.created_at desc
  limit 1;

  select public.resolve_license_service_status(v_customer_id)
  into v_license_status;

  begin
    v_app_access := public._apsf260_require_app_access();
    v_has_app_access := true;
  exception
    when others then
      v_app_access := jsonb_build_object('error', sqlerrm);
      if sqlerrm ilike '%active subscription required%' then
        v_state := 'subscription_inactive';
      elsif v_state <> 'organization_missing' then
        v_state := 'access_denied';
      end if;
  end;

  begin
    v_license := public.get_customer_license_center();
  exception
    when others then
      v_license := jsonb_build_object(
        'has_customer', v_customer_id is not null,
        'company_name', v_company_name,
        'license_status', coalesce(v_license_status, 'active')
      );
  end;

  if v_customer_id is null then
    v_state := 'organization_missing';
  elsif v_membership.id is null then
    v_state := 'membership_missing';
  elsif v_state = 'ready' and not v_has_app_access then
    v_state := 'access_denied';
  end if;

  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_user.id, v_org_id, now())
  on conflict (user_id) do update
    set organization_id = excluded.organization_id,
        updated_at = now()
  where v_org_id is not null;

  return jsonb_build_object(
    'authenticated', true,
    'state', v_state,
    'user_role', v_user.role,
    'organization_role', coalesce(v_app_access->>'organization_role', public._apsf260_map_org_role(v_user.role)),
    'company_id', v_user.company_id,
    'customer_id', v_customer_id,
    'organization_id', v_org_id,
    'workspace_name', coalesce(v_org.name, v_company_name),
    'licensed_to', coalesce(v_license->>'company_name', v_org.name, v_company_name),
    'plan_name', coalesce(v_license->'subscription'->>'plan_name', v_plan_name),
    'license_status', coalesce(v_license->>'license_status', v_license_status, 'active'),
    'has_customer', v_customer_id is not null,
    'has_organization_membership', v_membership.id is not null,
    'has_app_access', v_has_app_access,
    'can_access_self_support', v_has_app_access and v_user.role in ('owner', 'admin', 'support', 'staff', 'read_only'),
    'context_version', 2
  );
end;
$$;

grant execute on function public.get_app_organization_context() to authenticated;

-- Unonight pilot sync
do $$
declare
  v_org_id uuid;
begin
  select c.id into v_org_id
  from public.companies co
  join public.customers c on c.company_id = co.id
  where co.slug = 'unonight'
    and co.is_platform = false
  limit 1;

  if v_org_id is not null then
    perform public.sync_app_organization_access(v_org_id);
    if exists (
      select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'repair_unonight_pilot_app_context'
    ) then
      perform public.repair_unonight_pilot_app_context();
    end if;
  end if;
end;
$$;

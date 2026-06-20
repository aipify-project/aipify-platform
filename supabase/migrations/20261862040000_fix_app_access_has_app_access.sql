-- Phase 620 P1 — fix has_app_access for valid APP owners (broken platform_admins.status reference).

create or replace function public._apsf260_require_app_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_company_id uuid;
  v_customer_id uuid;
  v_sub_status text;
  v_license_status text;
begin
  if auth.uid() is null then
    raise exception 'APP portal access denied';
  end if;

  select u.*
  into v_user
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user.id is null then
    raise exception 'APP portal access denied';
  end if;

  v_company_id := v_user.company_id;

  if exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
  ) then
    return jsonb_build_object(
      'organization_role', 'organization_owner',
      'company_id', v_company_id,
      'license_status', 'active'
    );
  end if;

  if public._apsf260_map_org_role(v_user.role) is null then
    raise exception 'APP portal access denied';
  end if;

  v_sub_status := public._apsf260_subscription_status(v_company_id);

  if v_sub_status is not null and v_sub_status not in ('active', 'trialing', 'past_due') then
    raise exception 'Active subscription required';
  end if;

  select c.id
  into v_customer_id
  from public.customers c
  where c.company_id = v_user.company_id
  limit 1;

  if v_customer_id is not null then
    v_license_status := public.resolve_license_service_status(v_customer_id);
    if v_license_status is not null and v_license_status not in ('active', 'grace_period') then
      raise exception 'Active subscription required';
    end if;
  end if;

  return jsonb_build_object(
    'organization_role', public._apsf260_map_org_role(v_user.role),
    'company_id', v_user.company_id,
    'license_status', coalesce(v_license_status, v_sub_status, 'active')
  );
end;
$$;

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
  v_state text := 'ready';
  v_has_app_access boolean := false;
  v_can_self_support boolean := false;
  v_plan_name text;
  v_license_status text;
  v_app_license_status text;
  v_context_org_id uuid;
  v_organization_role text;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated', false, 'state', 'unauthenticated');
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;

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
      );

    if v_context_org_id is not null then
      v_org_id := v_context_org_id;
    end if;

    select * into v_org from public.organizations where id = v_org_id;
    v_membership := public._mta_membership_active(v_org_id, v_user.id);
  else
    v_state := 'organization_missing';
  end if;

  select coalesce(
    s.plan_name,
    initcap(replace(coalesce(os.plan_key, s.plan_key, s.plan_type, 'business'), '_', ' '))
  )
  into v_plan_name
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  left join public.organization_subscriptions os on os.organization_id = c.id
  where c.id = v_customer_id
  limit 1;

  select als.app_license_status
  into v_app_license_status
  from public.organization_app_license_state als
  where als.organization_id = v_customer_id
  limit 1;

  if v_customer_id is not null then
    v_license_status := public.resolve_license_service_status(v_customer_id);
  end if;

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

  v_organization_role := coalesce(
    v_app_access->>'organization_role',
    public._apsf260_map_org_role(v_user.role)
  );

  if v_customer_id is null then
    v_state := 'organization_missing';
  elsif v_membership.id is null then
    v_state := 'membership_missing';
  elsif v_state = 'ready' and not v_has_app_access then
    v_state := 'access_denied';
  end if;

  if v_has_app_access and v_membership.id is not null then
    select exists (
      select 1
      from public.organization_role_permissions rp
      where rp.organization_id = v_org_id
        and rp.role = v_membership.role
        and rp.permission_key = 'self_support.view'
    ) into v_can_self_support;
  end if;

  return jsonb_build_object(
    'authenticated', true,
    'state', v_state,
    'user_role', v_user.role,
    'organization_role', v_organization_role,
    'company_id', v_user.company_id,
    'customer_id', v_customer_id,
    'organization_id', v_org_id,
    'workspace_name', coalesce(v_org.name, v_company_name),
    'licensed_to', coalesce(v_org.name, v_company_name),
    'plan_name', v_plan_name,
    'license_status', coalesce(v_app_license_status, v_license_status, 'active'),
    'has_customer', v_customer_id is not null,
    'has_organization_membership', v_membership.id is not null,
    'has_app_access', v_has_app_access,
    'can_access_self_support', v_can_self_support,
    'context_version', 2
  );
end;
$$;

grant execute on function public.get_app_organization_context() to authenticated;

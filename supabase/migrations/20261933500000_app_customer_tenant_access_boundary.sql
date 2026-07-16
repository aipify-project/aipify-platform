-- APP customer tenant access boundary — eligible-set resolver, bootstrap listing/switch,
-- and replacement of APP tenant context functions without touching generic MTA helpers.

-- ---------------------------------------------------------------------------
-- Internal read-only APP tenant resolver (not granted to authenticated)
-- ---------------------------------------------------------------------------
create or replace function public._app_resolve_customer_tenant_for_auth()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_saved_context_org_id uuid;
  v_eligible_count int := 0;
  v_single_org_id uuid;
  v_selected_org_id uuid;
  v_selected_source text := null;
  v_resolution_state text;
  v_customer_id uuid;
  v_company_id uuid;
  v_organization_role text;
  v_membership public.organization_users;
begin
  if auth.uid() is null then
    return jsonb_build_object(
      'resolution_state', 'membership_missing',
      'organization_id', null,
      'customer_id', null,
      'company_id', null,
      'organization_role', null,
      'eligible_organization_count', 0,
      'saved_context_organization_id', null,
      'selected_source', null
    );
  end if;

  select u.id
  into v_user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user_id is null then
    return jsonb_build_object(
      'resolution_state', 'membership_missing',
      'organization_id', null,
      'customer_id', null,
      'company_id', null,
      'organization_role', null,
      'eligible_organization_count', 0,
      'saved_context_organization_id', null,
      'selected_source', null
    );
  end if;

  select count(*)::int
  into v_eligible_count
  from public.organization_users ou
  join public.organizations o on o.id = ou.organization_id
  join public.customers c on c.id = o.id
  join public.companies co on co.id = c.company_id
  where ou.user_id = v_user_id
    and ou.status = 'active'
    and co.is_platform = false;

  select ouc.organization_id
  into v_saved_context_org_id
  from public.organization_user_context ouc
  where ouc.user_id = v_user_id
    and exists (
      select 1
      from public.organization_users ou
      join public.organizations o on o.id = ou.organization_id
      join public.customers c on c.id = o.id
      join public.companies co on co.id = c.company_id
      where ou.organization_id = ouc.organization_id
        and ou.user_id = v_user_id
        and ou.status = 'active'
        and co.is_platform = false
    );

  if v_saved_context_org_id is not null then
    v_selected_org_id := v_saved_context_org_id;
    v_selected_source := 'saved_context';
    v_resolution_state := 'ready_candidate';
  elsif v_eligible_count = 1 then
    select ou.organization_id
    into v_single_org_id
    from public.organization_users ou
    join public.organizations o on o.id = ou.organization_id
    join public.customers c on c.id = o.id
    join public.companies co on co.id = c.company_id
    where ou.user_id = v_user_id
      and ou.status = 'active'
      and co.is_platform = false
    order by ou.joined_at nulls last, ou.created_at
    limit 1;

    v_selected_org_id := v_single_org_id;
    v_selected_source := 'single_eligible';
    v_resolution_state := 'ready_candidate';
  elsif v_eligible_count > 1 then
    v_resolution_state := 'selection_required';
  else
    v_resolution_state := 'membership_missing';
  end if;

  if v_selected_org_id is not null then
    select c.id, c.company_id
    into v_customer_id, v_company_id
    from public.customers c
    where c.id = v_selected_org_id;

    v_membership := public._mta_membership_active(v_selected_org_id, v_user_id);

    v_organization_role := case v_membership.role
      when 'owner' then 'organization_owner'
      when 'administrator' then 'organization_admin'
      when 'manager' then 'organization_manager'
      when 'support_agent' then 'organization_manager'
      when 'viewer' then 'organization_member'
      else null
    end;
  end if;

  return jsonb_build_object(
    'resolution_state', v_resolution_state,
    'organization_id', v_selected_org_id,
    'customer_id', v_customer_id,
    'company_id', v_company_id,
    'organization_role', v_organization_role,
    'eligible_organization_count', v_eligible_count,
    'saved_context_organization_id', v_saved_context_org_id,
    'selected_source', v_selected_source
  );
end;
$$;

comment on function public._app_resolve_customer_tenant_for_auth() is
  'Internal APP tenant resolver: eligible non-platform customer org memberships only; read-only.';

-- ---------------------------------------------------------------------------
-- Bootstrap-safe eligible organization listing
-- ---------------------------------------------------------------------------
create or replace function public.get_app_eligible_organizations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if auth.uid() is null then
    return '[]'::jsonb;
  end if;

  select u.id
  into v_user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user_id is null then
    return '[]'::jsonb;
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', o.id,
        'name', o.name,
        'slug', o.slug,
        'status', o.status,
        'subscription_plan', o.subscription_plan,
        'role', ou.role,
        'membership_status', ou.status
      )
      order by o.name
    )
    from public.organization_users ou
    join public.organizations o on o.id = ou.organization_id
    join public.customers c on c.id = o.id
    join public.companies co on co.id = c.company_id
    where ou.user_id = v_user_id
      and ou.status = 'active'
      and co.is_platform = false
  ), '[]'::jsonb);
end;
$$;

comment on function public.get_app_eligible_organizations() is
  'APP bootstrap listing: active memberships in non-platform customer organizations only; read-only.';

grant execute on function public.get_app_eligible_organizations() to authenticated;

-- ---------------------------------------------------------------------------
-- APP-specific organization switch (writes context only for eligible selections)
-- ---------------------------------------------------------------------------
create or replace function public.switch_app_organization(p_organization_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_membership public.organization_users;
  v_is_eligible boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_organization_id is null then
    raise exception 'organization_id required';
  end if;

  select u.id
  into v_user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select exists (
    select 1
    from public.organization_users ou
    join public.organizations o on o.id = ou.organization_id
    join public.customers c on c.id = o.id
    join public.companies co on co.id = c.company_id
    where ou.user_id = v_user_id
      and ou.organization_id = p_organization_id
      and ou.status = 'active'
      and co.is_platform = false
  )
  into v_is_eligible;

  if not v_is_eligible then
    raise exception 'Access denied for organization';
  end if;

  v_membership := public._mta_membership_active(p_organization_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then
    raise exception 'Access denied for organization';
  end if;

  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_user_id, p_organization_id, now())
  on conflict (user_id) do update
    set organization_id = excluded.organization_id,
        updated_at = now();

  perform public._mta_create_audit_log(
    p_organization_id,
    'organization_switched',
    'organization',
    p_organization_id
  );

  return jsonb_build_object(
    'status', 'ok',
    'organization_id', p_organization_id,
    'role', v_membership.role
  );
end;
$$;

comment on function public.switch_app_organization(uuid) is
  'APP organization switch: eligible non-platform customer orgs only; upserts organization_user_context.';

grant execute on function public.switch_app_organization(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Replace canonical APP active organization resolver
-- ---------------------------------------------------------------------------
create or replace function public._app_active_organization_id_for_auth()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_res jsonb;
begin
  if auth.uid() is null then
    return null;
  end if;

  v_res := public._app_resolve_customer_tenant_for_auth();

  if v_res->>'resolution_state' = 'ready_candidate'
     and v_res->>'organization_id' is not null then
    return (v_res->>'organization_id')::uuid;
  end if;

  return null;
end;
$$;

comment on function public._app_active_organization_id_for_auth() is
  'Canonical APP active organization from eligible-set resolver; null when selection required or missing.';

-- ---------------------------------------------------------------------------
-- Replace APP portal access gate (no platform super_admin bypass)
-- ---------------------------------------------------------------------------
create or replace function public._apsf260_require_app_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_res jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_sub_status text;
  v_license_status text;
  v_organization_role text;
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

  v_res := public._app_resolve_customer_tenant_for_auth();

  if v_res->>'resolution_state' <> 'ready_candidate' then
    raise exception 'APP portal access denied';
  end if;

  v_company_id := nullif(v_res->>'company_id', '')::uuid;
  v_customer_id := nullif(v_res->>'customer_id', '')::uuid;
  v_organization_role := nullif(v_res->>'organization_role', '');

  if v_customer_id is null or v_company_id is null then
    raise exception 'APP portal access denied';
  end if;

  v_sub_status := public._apsf260_subscription_status(v_company_id);

  if v_sub_status is not null and v_sub_status not in ('active', 'trialing', 'past_due') then
    raise exception 'Active subscription required';
  end if;

  v_license_status := public.resolve_license_service_status(v_customer_id);

  if v_license_status is not null and v_license_status not in ('active', 'grace_period') then
    raise exception 'Active subscription required';
  end if;

  return jsonb_build_object(
    'organization_role', coalesce(
      v_organization_role,
      public._apsf260_map_org_role(v_user.role)
    ),
    'company_id', v_company_id,
    'license_status', coalesce(v_license_status, v_sub_status, 'active')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Replace APP organization context (read-only; context_version 3)
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
  v_res jsonb;
  v_customer_id uuid;
  v_company_id uuid;
  v_org_id uuid;
  v_org public.organizations;
  v_membership public.organization_users;
  v_app_access jsonb;
  v_state text;
  v_has_app_access boolean := false;
  v_can_self_support boolean := false;
  v_plan_name text;
  v_license_status text;
  v_app_license_status text;
  v_organization_role text;
  v_eligible_count int := 0;
  v_resolution_state text;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated', false, 'state', 'unauthenticated');
  end if;

  select u.*
  into v_user
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user.id is null then
    return jsonb_build_object(
      'authenticated', true,
      'state', 'user_not_provisioned',
      'has_customer', false,
      'has_organization_membership', false,
      'has_app_access', false,
      'eligible_organization_count', 0,
      'context_version', 3
    );
  end if;

  v_res := public._app_resolve_customer_tenant_for_auth();
  v_resolution_state := v_res->>'resolution_state';
  v_eligible_count := coalesce((v_res->>'eligible_organization_count')::int, 0);
  v_customer_id := nullif(v_res->>'customer_id', '')::uuid;
  v_company_id := nullif(v_res->>'company_id', '')::uuid;
  v_org_id := nullif(v_res->>'organization_id', '')::uuid;

  if v_resolution_state = 'selection_required' then
    v_state := 'selection_required';
  elsif v_resolution_state = 'membership_missing' then
    v_state := 'membership_missing';
  else
    v_state := 'ready';
  end if;

  if v_org_id is not null then
    select * into v_org from public.organizations where id = v_org_id;
    v_membership := public._mta_membership_active(v_org_id, v_user.id);
  end if;

  if v_customer_id is not null then
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

    v_license_status := public.resolve_license_service_status(v_customer_id);
  end if;

  if v_state = 'ready' then
    begin
      v_app_access := public._apsf260_require_app_access();
      v_has_app_access := true;
    exception
      when others then
        v_app_access := jsonb_build_object('error', sqlerrm);
        if sqlerrm ilike '%active subscription required%' then
          v_state := 'subscription_inactive';
        else
          v_state := 'access_denied';
        end if;
    end;
  end if;

  v_organization_role := coalesce(
    nullif(v_res->>'organization_role', ''),
    v_app_access->>'organization_role',
    public._apsf260_map_org_role(v_user.role)
  );

  if v_state = 'ready' and v_membership.id is null then
    v_state := 'membership_missing';
  elsif v_state = 'ready' and not v_has_app_access then
    v_state := 'access_denied';
  end if;

  if v_has_app_access and v_membership.id is not null and v_org_id is not null then
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
    'company_id', v_company_id,
    'customer_id', v_customer_id,
    'organization_id', v_org_id,
    'workspace_name', v_org.name,
    'licensed_to', v_org.name,
    'plan_name', v_plan_name,
    'license_status', coalesce(v_app_license_status, v_license_status, 'active'),
    'has_customer', v_customer_id is not null,
    'has_organization_membership', v_membership.id is not null,
    'has_app_access', v_has_app_access,
    'can_access_self_support', v_can_self_support,
    'eligible_organization_count', v_eligible_count,
    'context_version', 3
  );
end;
$$;

grant execute on function public.get_app_organization_context() to authenticated;

notify pgrst, 'reload schema';

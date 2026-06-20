-- Repair APP organization context resolution and portal access checks.
-- Fixes subscriptions.company_id reference (column does not exist — use customers join).
-- Ensures legacy company users receive organization membership via _mta_backfill_memberships.

create or replace function public._apsf260_subscription_status(p_company_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sub_status text;
begin
  if p_company_id is null then
    return null;
  end if;

  select s.status
  into v_sub_status
  from public.subscriptions s
  join public.customers c on c.id = s.customer_id
  where c.company_id = p_company_id
  order by s.created_at desc
  limit 1;

  return v_sub_status;
end;
$$;

create or replace function public._apsf260_require_app_access()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_company_id uuid;
  v_sub_status text;
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
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role = 'super_admin'
      and coalesce(pa.status, 'active') = 'active'
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

  return jsonb_build_object(
    'organization_role', public._apsf260_map_org_role(v_user.role),
    'company_id', v_company_id,
    'license_status', coalesce(v_sub_status, 'active')
  );
end;
$$;

create or replace function public._mta_require_organization(p_organization_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_membership public.organization_users;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'Unauthorized'; end if;

  if p_organization_id is not null then
    v_org_id := p_organization_id;
  else
    select ouc.organization_id into v_org_id
    from public.organization_user_context ouc
    where ouc.user_id = v_user_id;
  end if;

  if v_org_id is null then
    select ou.organization_id into v_org_id
    from public.organization_users ou
    where ou.user_id = v_user_id and ou.status = 'active'
    order by ou.joined_at nulls last, ou.created_at
    limit 1;
  end if;

  if v_org_id is null then
    select c.id into v_org_id
    from public.customers c
    join public.users u on u.company_id = c.company_id
    where u.id = v_user_id
    limit 1;
  end if;

  if v_org_id is null then raise exception 'Organization context required'; end if;

  perform public._mta_backfill_memberships(v_org_id);

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null then raise exception 'Access denied for organization'; end if;

  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_user_id, v_org_id, now())
  on conflict (user_id) do update set organization_id = excluded.organization_id, updated_at = now();

  return v_org_id;
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
  v_license jsonb;
  v_state text := 'ready';
  v_has_app_access boolean := false;
begin
  if auth.uid() is null then
    return jsonb_build_object('authenticated', false, 'state', 'unauthenticated');
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    begin
      perform public.provision_tenant_for_auth_user();
    exception
      when others then null;
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
    v_org_id := v_customer_id;
    select * into v_org from public.organizations where id = v_org_id;
    v_membership := public._mta_membership_active(v_org_id, v_user.id);
  else
    v_state := 'organization_missing';
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

  begin
    v_license := public.get_customer_license_center();
  exception
    when others then
      v_license := jsonb_build_object('has_customer', false);
  end;

  if v_state = 'ready' and v_customer_id is null and coalesce(v_license->>'has_customer', 'false') = 'false' then
    v_state := 'organization_missing';
  end if;

  if v_state = 'ready' and v_membership.id is null then
    v_state := 'membership_missing';
  end if;

  return jsonb_build_object(
    'authenticated', true,
    'state', v_state,
    'user_role', v_user.role,
    'organization_role', v_app_access->>'organization_role',
    'company_id', v_user.company_id,
    'customer_id', v_customer_id,
    'organization_id', v_org_id,
    'workspace_name', coalesce(v_org.name, v_company_name),
    'licensed_to', coalesce(v_license->>'company_name', v_company_name),
    'plan_name', v_license->'subscription'->>'plan_name',
    'license_status', v_license->>'license_status',
    'has_customer', coalesce((v_license->>'has_customer')::boolean, v_customer_id is not null),
    'has_organization_membership', v_membership.id is not null,
    'has_app_access', v_has_app_access,
    'can_access_self_support', v_has_app_access and v_user.role in ('owner', 'admin', 'support', 'staff', 'read_only')
  );
end;
$$;

grant execute on function public._apsf260_subscription_status(uuid) to authenticated;
grant execute on function public.get_app_organization_context() to authenticated;

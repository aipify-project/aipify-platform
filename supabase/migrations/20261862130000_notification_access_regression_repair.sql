-- Phase 620 P1 — restore APP access guard after phase 260 re-apply regression.
-- Root cause: 20261534000000 re-applied in batch overwrote _apsf260_require_app_access()
-- with subscriptions.company_id lookup (column does not exist), breaking
-- get_app_organization_context → access_denied before notifications.view is evaluated.
-- notifications.view registry, role grants, and notification_communication module were unchanged.

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

notify pgrst, 'reload schema';

-- Phase 260 — APP Portal Structure Foundation

create or replace function public._apsf260_map_org_role(p_role text)
returns text
language sql
immutable
as $$
  select case p_role
    when 'owner' then 'organization_owner'
    when 'admin' then 'organization_admin'
    when 'support' then 'organization_manager'
    when 'staff' then 'organization_member'
    when 'read_only' then 'organization_member'
    else 'organization_member'
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

create or replace function public.get_app_portal_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return public._apsf260_require_app_access();
exception when others then
  return jsonb_build_object('has_access', false);
end;
$$;

create or replace function public.get_app_portal_feature_access(p_feature text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_plan text := 'starter';
  v_enabled boolean := true;
  v_feature text := coalesce(nullif(trim(p_feature), ''), 'core');
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_plan := coalesce(
        public.get_customer_license_center()->'subscription'->>'plan_key',
        'starter'
      );
    exception when others then
      v_plan := 'starter';
    end;
  end if;

  if v_feature in ('business_packs', 'workflows', 'advanced_insights') then
    v_enabled := v_plan in ('business', 'enterprise', 'professional', 'growth');
  elsif v_feature in ('team_management', 'billing') then
    v_enabled := v_plan not in ('paused');
  else
    v_enabled := true;
  end if;

  return jsonb_build_object(
    'feature', v_feature,
    'enabled', v_enabled,
    'plan_key', v_plan,
    'upgrade_required', not v_enabled,
    'upgrade_href', '/app/billing/upgrade'
  );
exception when others then
  return jsonb_build_object(
    'feature', v_feature,
    'enabled', false,
    'upgrade_required', true,
    'upgrade_href', '/app/billing/upgrade'
  );
end;
$$;

create or replace function public.get_app_portal_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_org_name text := '';
  v_team_active integer := 0;
  v_sub_status text := 'active';
  v_plan_key text := 'starter';
  v_business_packs jsonb := '[]'::jsonb;
  v_tasks_attention integer := 0;
  v_recommendations jsonb := '[]'::jsonb;
  v_notifications_count integer := 0;
  v_since_last_login jsonb := '{}'::jsonb;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select c.name into v_org_name from public.companies c where c.id = v_company_id;

  select count(*)::int
  into v_team_active
  from public.users u
  where u.company_id = v_company_id;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_sub_status := coalesce(
        public.get_customer_license_center()->'subscription'->>'status',
        'active'
      );
      v_plan_key := coalesce(
        public.get_customer_license_center()->'subscription'->>'plan_key',
        'starter'
      );
    exception when others then null;
    end;
  end if;

  if to_regclass('public.tenant_modules') is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'module_key', tm.module_key,
        'status', tm.status
      )
    ), '[]'::jsonb)
    into v_business_packs
    from public.tenant_modules tm
    where tm.company_id = v_company_id
      and tm.status in ('enabled', 'trial', 'beta')
    limit 8;
  else
    v_business_packs := jsonb_build_array(
      jsonb_build_object('module_key', 'core', 'status', 'enabled')
    );
  end if;

  select count(*)::int
  into v_tasks_attention
  from (
    select 1
    from public.action_requests ar
    where ar.company_id = v_company_id
      and ar.status = 'pending'
    limit 10
  ) t;

  v_recommendations := jsonb_build_array(
    jsonb_build_object(
      'id', 'review-subscription',
      'title', 'Review subscription status',
      'href', '/app/billing/subscription'
    ),
    jsonb_build_object(
      'id', 'invite-team',
      'title', 'Invite team members',
      'href', '/app/organization/team'
    )
  );

  if to_regclass('public.presence_notifications') is not null then
    select count(*)::int
    into v_notifications_count
    from public.presence_notifications pn
    where pn.company_id = v_company_id
      and pn.read_at is null;
  end if;

  v_since_last_login := jsonb_build_object(
    'important_updates', 2,
    'completed_actions', 1,
    'new_notifications', v_notifications_count,
    'recommended_next_steps', v_recommendations,
    'business_pack_highlights', v_business_packs
  );

  return jsonb_build_object(
    'principle', 'Your organization workspace — subscriptions, Business Packs, team collaboration, and operational insights.',
    'organization_overview', jsonb_build_object(
      'name', coalesce(v_org_name, 'Organization'),
      'team_active', v_team_active,
      'organization_role', v_access->>'organization_role'
    ),
    'team_activity_summary', jsonb_build_object(
      'active_members', v_team_active,
      'actions_today', 0
    ),
    'subscription_status', jsonb_build_object(
      'status', v_sub_status,
      'plan_key', v_plan_key
    ),
    'business_pack_status', v_business_packs,
    'tasks_requiring_attention', v_tasks_attention,
    'recommended_actions', v_recommendations,
    'notifications_count', v_notifications_count,
    'since_last_login_summary', v_since_last_login,
    'privacy_note', 'Your organization data stays with your organization.'
  );
end;
$$;

revoke all on function public._apsf260_require_app_access() from public, anon;
revoke all on function public.get_app_portal_access() from public, anon;
revoke all on function public.get_app_portal_feature_access(text) from public, anon;
revoke all on function public.get_app_portal_dashboard() from public, anon;
grant execute on function public.get_app_portal_access() to authenticated;
grant execute on function public.get_app_portal_feature_access(text) to authenticated;
grant execute on function public.get_app_portal_dashboard() to authenticated;

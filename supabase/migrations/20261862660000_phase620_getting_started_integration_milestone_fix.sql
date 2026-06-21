-- Phase 620 — Getting Started integration milestone + overview metadata repair

create or replace function public.get_app_portal_onboarding()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_customer_id uuid;
  v_user_id uuid;
  v_manual jsonb := '{}'::jsonb;
  v_dismissed jsonb := '[]'::jsonb;
  v_started_at timestamptz;
  v_completed_at timestamptz;
  v_updated_at timestamptz;
  v_team_count integer := 0;
  v_admin_count integer := 0;
  v_2fa_count integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_connected integer := 0;
  v_has_subscription boolean := false;
  v_checklist jsonb := '[]'::jsonb;
  v_required_total integer := 0;
  v_required_done integer := 0;
  v_progress integer := 0;
  v_milestones jsonb := '[]'::jsonb;
  v_recommendations jsonb;
  v_adoption jsonb;
  v_task jsonb;
  v_overview_status text;
  v_org_setup_done boolean := false;
  v_integration_done boolean := false;
begin
  v_access := public._apoa274_require_onboarding_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select op.started_at, op.completed_at, op.manual_tasks, op.dismissed_milestones, op.updated_at
  into v_started_at, v_completed_at, v_manual, v_dismissed, v_updated_at
  from public.app_portal_onboarding_progress op
  where op.company_id = v_company_id;

  select count(*)::int, count(*) filter (where u.role in ('owner', 'admin'))::int
  into v_team_count, v_admin_count
  from public.users u where u.company_id = v_company_id;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = v_company_id and t.enabled = true;
  end if;

  if to_regclass('public.tenant_modules') is not null and v_customer_id is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, count(*) filter (where ic.status = 'connected')::int
    into v_integrations, v_connected
    from public.app_portal_integration_connections ic
    where ic.company_id = v_company_id;
  end if;

  select exists(
    select 1 from public.subscriptions s where s.customer_id = v_customer_id
  ) into v_has_subscription;

  v_checklist := v_checklist || public._apoa274_build_task('org_profile', 'organization', false, 'completed', v_manual, now());
  v_checklist := v_checklist || public._apoa274_build_task(
    'org_settings', 'organization', false,
    case when v_has_subscription then 'completed' else case when v_started_at is not null then 'in_progress' else 'not_started' end end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task('org_localization', 'organization', true, 'optional', v_manual, null);

  v_checklist := v_checklist || public._apoa274_build_task(
    'team_invite', 'team', false,
    case when v_team_count > 1 then 'completed' when v_team_count = 1 and v_started_at is not null then 'in_progress' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task(
    'team_admin_roles', 'team', false,
    case when v_admin_count >= 1 then 'completed' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task(
    'team_permissions', 'team', false,
    case when v_admin_count >= 1 then 'in_progress' else 'not_started' end,
    v_manual, null
  );

  v_checklist := v_checklist || public._apoa274_build_task(
    'security_2fa', 'security', false,
    case when v_2fa_count > 0 then 'completed' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task('security_access', 'security', false, 'not_started', v_manual, null);
  v_checklist := v_checklist || public._apoa274_build_task('security_preferences', 'security', true, 'optional', v_manual, null);

  v_checklist := v_checklist || public._apoa274_build_task(
    'integration_connect', 'integrations', false,
    case when v_connected > 0 then 'completed' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task(
    'integration_health', 'integrations', false,
    case when v_connected > 0 then 'completed' when v_integrations > 0 then 'in_progress' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task(
    'integration_sync', 'integrations', true,
    case when v_connected > 0 then 'in_progress' else 'optional' end,
    v_manual, null
  );

  v_checklist := v_checklist || public._apoa274_build_task(
    'pack_install', 'business_packs', false,
    case when v_packs > 0 then 'completed' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task(
    'pack_review', 'business_packs', false,
    case when v_packs > 0 then 'in_progress' else 'not_started' end,
    v_manual, null
  );
  v_checklist := v_checklist || public._apoa274_build_task('pack_configure', 'business_packs', true, 'optional', v_manual, null);

  v_checklist := v_checklist || public._apoa274_build_task('knowledge_explore', 'knowledge_support', true, 'optional', v_manual, null);
  v_checklist := v_checklist || public._apoa274_build_task('support_assistant', 'knowledge_support', true, 'optional', v_manual, null);
  v_checklist := v_checklist || public._apoa274_build_task('support_contact', 'knowledge_support', true, 'optional', v_manual, null);

  for v_task in select * from jsonb_array_elements(v_checklist)
  loop
    if (v_task->>'optional')::boolean is not true then
      v_required_total := v_required_total + 1;
      if v_task->>'status' = 'completed' then
        v_required_done := v_required_done + 1;
      end if;
    end if;
  end loop;

  if v_required_total > 0 then
    v_progress := round((v_required_done::numeric / v_required_total::numeric) * 100)::integer;
  end if;

  if v_started_at is null then
    v_overview_status := 'not_started';
  elsif v_required_done >= v_required_total and v_required_total > 0 then
    v_overview_status := 'completed';
  else
    v_overview_status := 'in_progress';
  end if;

  select exists(
    select 1 from jsonb_array_elements(v_checklist) t
    where t->>'key' = 'org_profile' and t->>'status' = 'completed'
  ) and exists(
    select 1 from jsonb_array_elements(v_checklist) t
    where t->>'key' = 'org_settings' and t->>'status' = 'completed'
  ) and exists(
    select 1 from jsonb_array_elements(v_checklist) t
    where t->>'key' = 'team_invite' and t->>'status' = 'completed'
  ) into v_org_setup_done;

  v_integration_done := v_connected > 0;

  if v_org_setup_done and not coalesce(v_dismissed, '[]'::jsonb) @> jsonb_build_array('org_setup_complete') then
    v_milestones := v_milestones || jsonb_build_object('key', 'org_setup_complete', 'celebration', true);
  end if;

  if v_integration_done and not coalesce(v_dismissed, '[]'::jsonb) @> jsonb_build_array('first_integration') then
    v_milestones := v_milestones || jsonb_build_object('key', 'first_integration', 'celebration', true);
  end if;

  if v_overview_status = 'completed' and not coalesce(v_dismissed, '[]'::jsonb) @> jsonb_build_array('onboarding_complete') then
    v_milestones := v_milestones || jsonb_build_object('key', 'onboarding_complete', 'celebration', true);
  end if;

  v_recommendations := public._apoa274_build_recommendations(
    v_team_count, v_admin_count, v_2fa_count, v_packs, v_connected
  );

  v_adoption := jsonb_build_object(
    'features_explored', v_required_done + (
      select count(*)::int from jsonb_array_elements(v_checklist) t
      where (t->>'optional')::boolean is true and t->>'status' = 'completed'
    ),
    'features_not_discovered', (
      select coalesce(jsonb_agg(t->>'key'), '[]'::jsonb)
      from jsonb_array_elements(v_checklist) t
      where t->>'status' in ('not_started', 'optional', 'in_progress')
        and t->>'key' in ('pack_install', 'integration_connect', 'knowledge_explore', 'support_assistant')
        and (
          t->>'key' <> 'integration_connect'
          or v_connected = 0
        )
    ),
    'suggested_business_packs', case when v_packs < 2 then jsonb_build_array('operations', 'analytics', 'support') else '[]'::jsonb end,
    'recommended_actions', v_recommendations
  );

  return jsonb_build_object(
    'found', true,
    'started', v_started_at is not null,
    'connected_integrations', v_connected,
    'overview', jsonb_build_object(
      'status', v_overview_status,
      'progress_percent', v_progress,
      'required_completed', v_required_done,
      'required_total', v_required_total,
      'started_at', v_started_at,
      'completed_at', v_completed_at,
      'last_updated_at', coalesce(v_updated_at, v_started_at)
    ),
    'checklist', v_checklist,
    'milestones', v_milestones,
    'recommendations', v_recommendations,
    'adoption_insights', v_adoption,
    'completed_milestones', (
      select coalesce(jsonb_agg(t), '[]'::jsonb)
      from jsonb_array_elements(v_checklist) t
      where t->>'status' = 'completed'
    )
  );
end;
$$;

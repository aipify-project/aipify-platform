-- Phase 620 P1 — Getting Started repair: tenant_modules uses tenant_id (customers.id), not company_id.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('self_support.view', 'View Self Support', null, 'Access APP self-support areas'),
  ('self_support.manage', 'Manage Self Support', null, 'Manage APP self-support onboarding progress')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'self_support.view'),
  ('owner', 'self_support.manage'),
  ('administrator', 'self_support.view'),
  ('administrator', 'self_support.manage'),
  ('manager', 'self_support.view'),
  ('support_agent', 'self_support.view'),
  ('viewer', 'self_support.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._apoa274_require_onboarding_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
begin
  if not public.has_organization_permission('self_support.view') then
    raise exception 'Permission denied: self_support.view';
  end if;

  v_access := public._apsf260_require_app_access();
  return v_access;
end;
$$;

create or replace function public._apoa274_resolve_status(
  p_key text,
  p_auto text,
  p_manual jsonb,
  p_optional boolean
)
returns text
language plpgsql
immutable
as $$
declare
  v_manual text;
begin
  v_manual := p_manual->p_key->>'status';
  if v_manual in ('not_started', 'in_progress', 'completed', 'optional') then
    return v_manual;
  end if;
  if p_auto in ('not_started', 'in_progress', 'completed') then
    return p_auto;
  end if;
  if p_optional then
    return 'optional';
  end if;
  return 'not_started';
end;
$$;

create or replace function public._apoa274_build_task(
  p_key text,
  p_category text,
  p_optional boolean,
  p_auto text,
  p_manual jsonb,
  p_completed_at timestamptz default null
)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_status text;
  v_at timestamptz;
begin
  v_status := public._apoa274_resolve_status(p_key, p_auto, p_manual, p_optional);
  v_at := coalesce(
    nullif(p_manual->p_key->>'completed_at', '')::timestamptz,
    case when v_status = 'completed' then p_completed_at end
  );
  return jsonb_build_object(
    'key', p_key,
    'category', p_category,
    'optional', p_optional,
    'status', v_status,
    'completed_at', v_at,
    'auto_detected', p_auto = 'completed' and not (p_manual ? p_key)
  );
end;
$$;

create or replace function public._apoa274_build_recommendations(
  p_team_count integer,
  p_admin_count integer,
  p_2fa_count integer,
  p_packs integer,
  p_integrations integer
)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if p_admin_count < 2 then
    v_recs := v_recs || jsonb_build_object('id', 'invite-admins', 'key', 'inviteAdmins', 'priority', 'high', 'module', 'organization');
  end if;
  if p_2fa_count = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'enable-2fa', 'key', 'enable2fa', 'priority', 'high', 'module', 'security');
  end if;
  if p_packs < 1 then
    v_recs := v_recs || jsonb_build_object('id', 'install-pack', 'key', 'installFirstPack', 'priority', 'high', 'module', 'business_packs');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'review-assistant', 'key', 'reviewSupportAssistant', 'priority', 'medium', 'module', 'support');
  v_recs := v_recs || jsonb_build_object('id', 'explore-insights', 'key', 'exploreExecutiveInsights', 'priority', 'low', 'module', 'operations');
  return v_recs;
end;
$$;

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

  select op.started_at, op.completed_at, op.manual_tasks, op.dismissed_milestones
  into v_started_at, v_completed_at, v_manual, v_dismissed
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
    case when v_integrations > 0 then 'completed' else 'not_started' end,
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

  select exists(
    select 1 from jsonb_array_elements(v_checklist) t
    where t->>'key' = 'integration_connect' and t->>'status' = 'completed'
  ) into v_integration_done;

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
    v_team_count, v_admin_count, v_2fa_count, v_packs, v_integrations
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
    ),
    'suggested_business_packs', case when v_packs < 2 then jsonb_build_array('operations', 'analytics', 'support') else '[]'::jsonb end,
    'recommended_actions', v_recommendations
  );

  return jsonb_build_object(
    'found', true,
    'started', v_started_at is not null,
    'overview', jsonb_build_object(
      'status', v_overview_status,
      'progress_percent', v_progress,
      'required_completed', v_required_done,
      'required_total', v_required_total,
      'started_at', v_started_at,
      'completed_at', v_completed_at
    ),
    'checklist', v_checklist,
    'milestones', v_milestones,
    'recommendations', v_recommendations,
    'adoption_insights', v_adoption,
    'completed_milestones', (
      select coalesce(jsonb_agg(t), '[]'::jsonb)
      from jsonb_array_elements(v_checklist) t
      where t->>'status' = 'completed'
    ),
    'principle', 'Aipify guides adoption — your team decides pace and priorities.'
  );
end;
$$;

create or replace function public.patch_app_portal_onboarding(
  p_action text,
  p_task_key text default null,
  p_status text default null,
  p_milestone_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_manual jsonb;
  v_dismissed jsonb;
  v_allowed_status text[] := array['not_started', 'in_progress', 'completed', 'optional'];
begin
  if not public.has_organization_permission('self_support.manage') then
    raise exception 'Permission denied: self_support.manage';
  end if;

  v_access := public._apoa274_require_onboarding_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.app_portal_onboarding_progress (company_id)
  values (v_company_id)
  on conflict (company_id) do nothing;

  if p_action = 'start' then
    update public.app_portal_onboarding_progress
    set started_at = coalesce(started_at, now()),
        updated_at = now(),
        updated_by = v_user_id
    where company_id = v_company_id;
  elsif p_action = 'update_task' then
    if p_task_key is null or p_status is null or not (p_status = any(v_allowed_status)) then
      raise exception 'Invalid task update';
    end if;
    select manual_tasks, dismissed_milestones into v_manual, v_dismissed
    from public.app_portal_onboarding_progress where company_id = v_company_id;
    v_manual := coalesce(v_manual, '{}'::jsonb) || jsonb_build_object(
      p_task_key,
      jsonb_build_object(
        'status', p_status,
        'completed_at', case when p_status = 'completed' then now() else null end
      )
    );
    update public.app_portal_onboarding_progress
    set manual_tasks = v_manual,
        updated_at = now(),
        updated_by = v_user_id,
        completed_at = case
          when p_status = 'completed' and p_task_key = 'pack_install' then coalesce(completed_at, now())
          else completed_at
        end
    where company_id = v_company_id;
  elsif p_action = 'dismiss_milestone' then
    if p_milestone_key is null then
      raise exception 'Milestone key required';
    end if;
    select dismissed_milestones into v_dismissed
    from public.app_portal_onboarding_progress where company_id = v_company_id;
    v_dismissed := coalesce(v_dismissed, '[]'::jsonb);
    if not v_dismissed @> jsonb_build_array(p_milestone_key) then
      v_dismissed := v_dismissed || jsonb_build_array(p_milestone_key);
    end if;
    update public.app_portal_onboarding_progress
    set dismissed_milestones = v_dismissed,
        updated_at = now(),
        updated_by = v_user_id
    where company_id = v_company_id;
  else
    raise exception 'Unknown action';
  end if;

  return public.get_app_portal_onboarding();
end;
$$;

notify pgrst, 'reload schema';

-- Phase 273 (APP) — Customer Success & Health Center

create or replace function public._apsc273_health_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 80 then 'excellent'
    when p_score >= 60 then 'healthy'
    when p_score >= 40 then 'attention_needed'
    else 'at_risk'
  end;
$$;

create or replace function public._apsc273_risk_level(p_score integer, p_open_issues integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 75 and p_open_issues = 0 then 'low'
    when p_score >= 55 then 'moderate'
    when p_score >= 35 then 'elevated'
    else 'high'
  end;
$$;

create or replace function public._apsc273_require_success_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
begin
  v_access := public._apsf260_require_app_access();
  if (v_access->>'organization_role') not in ('organization_owner', 'organization_admin', 'organization_manager') then
    raise exception 'Success Center access denied';
  end if;
  return v_access;
end;
$$;

create or replace function public._apsc273_build_recommendations(
  p_team_count integer,
  p_packs integer,
  p_integrations integer,
  p_open_support integer,
  p_pending_approvals integer,
  p_open_follow_ups integer
)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if p_team_count < 3 then
    v_recs := v_recs || jsonb_build_object('id', 'invite-team', 'key', 'inviteTeam', 'priority', 'high', 'module', 'organization');
  end if;
  if p_packs < 1 then
    v_recs := v_recs || jsonb_build_object('id', 'explore-packs', 'key', 'explorePacks', 'priority', 'medium', 'module', 'business_packs');
  end if;
  if p_integrations < 1 then
    v_recs := v_recs || jsonb_build_object('id', 'enable-integrations', 'key', 'enableIntegrations', 'priority', 'medium', 'module', 'integrations');
  end if;
  if p_open_support > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'review-support', 'key', 'reviewSupport', 'priority', 'high', 'module', 'support');
  end if;
  if p_pending_approvals > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'review-approvals', 'key', 'reviewApprovals', 'priority', 'medium', 'module', 'approvals');
  end if;
  if p_open_follow_ups > 2 then
    v_recs := v_recs || jsonb_build_object('id', 'complete-follow-ups', 'key', 'completeFollowUps', 'priority', 'medium', 'module', 'operations');
  end if;
  if p_team_count >= 1 and p_packs >= 1 then
    v_recs := v_recs || jsonb_build_object('id', 'complete-onboarding', 'key', 'completeOnboarding', 'priority', 'low', 'module', 'organization');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'configure-security', 'key', 'configureSecurity', 'priority', 'medium', 'module', 'security');
  return v_recs;
end;
$$;

create or replace function public.get_app_portal_success_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_org_name text;
  v_team_count integer := 0;
  v_active_users integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_open_support integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_health integer := 65;
  v_adoption integer := 60;
  v_engagement integer := 55;
  v_utilization integer := 50;
  v_open_issues integer := 0;
  v_recommendations jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_growth jsonb := '[]'::jsonb;
  v_adoption_insights jsonb := '[]'::jsonb;
  v_factors jsonb := '[]'::jsonb;
  v_has_activity boolean := false;
  v_org_created timestamptz;
begin
  v_access := public._apsc273_require_success_access();
  v_company_id := (v_access->>'company_id')::uuid;
  select c.name, c.created_at into v_org_name, v_org_created from public.companies c where c.id = v_company_id;

  select count(*)::int, count(*) filter (where u.updated_at > now() - interval '14 days')::int
  into v_team_count, v_active_users
  from public.users u where u.company_id = v_company_id;

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.company_id = v_company_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections ic
    where ic.company_id = v_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_open_support
    from public.app_portal_support_requests sr
    where sr.company_id = v_company_id and sr.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.company_id = v_company_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*)::int into v_open_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and f.status not in ('completed', 'cancelled');
  end if;

  v_open_issues := v_open_support + v_pending_approvals + v_open_follow_ups;

  v_adoption := least(100, greatest(20, 30 + v_packs * 12 + v_integrations * 10 + case when v_team_count > 1 then 15 else 0 end));
  v_engagement := least(100, greatest(15, 25 + v_active_users * 8 + case when v_team_count >= 3 then 20 else v_team_count * 5 end));
  v_utilization := least(100, greatest(10, 20 + v_packs * 10 + v_integrations * 8 + case when v_open_follow_ups = 0 then 15 else 0 end));
  v_health := least(100, greatest(0, round((v_adoption + v_engagement + v_utilization) / 3.0)::integer
    - v_open_support * 3 - v_pending_approvals * 2 - greatest(0, v_open_follow_ups - 2) * 2));

  v_has_activity := v_team_count > 1 or v_packs > 0 or v_integrations > 0 or v_active_users > 0;

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'value', v_active_users, 'weight', 'high'),
    jsonb_build_object('key', 'team_size', 'value', v_team_count, 'weight', 'medium'),
    jsonb_build_object('key', 'business_packs', 'value', v_packs, 'weight', 'high'),
    jsonb_build_object('key', 'integrations', 'value', v_integrations, 'weight', 'medium'),
    jsonb_build_object('key', 'open_support', 'value', v_open_support, 'weight', 'medium'),
    jsonb_build_object('key', 'pending_approvals', 'value', v_pending_approvals, 'weight', 'low'),
    jsonb_build_object('key', 'open_follow_ups', 'value', v_open_follow_ups, 'weight', 'low')
  );

  v_recommendations := public._apsc273_build_recommendations(
    v_team_count, v_packs, v_integrations, v_open_support, v_pending_approvals, v_open_follow_ups
  );

  v_timeline := jsonb_build_array(jsonb_build_object(
    'id', 'org-created', 'type', 'organization_created', 'title', 'Organization created',
    'description', coalesce(v_org_name, 'Organization'), 'occurred_at', v_org_created
  ));

  if v_team_count > 1 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'team-growth', 'type', 'team_growth', 'title', 'Team growth',
      'description', format('%s team members active', v_team_count), 'occurred_at', now()
    );
  end if;

  if v_packs > 0 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'packs-installed', 'type', 'business_pack_installed', 'title', 'Business Packs installed',
      'description', format('%s Business Pack(s) active', v_packs), 'occurred_at', now()
    );
  end if;

  if v_integrations > 0 then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'integrations-connected', 'type', 'integration_connected', 'title', 'Integrations connected',
      'description', format('%s integration(s) connected', v_integrations), 'occurred_at', now()
    );
  end if;

  v_timeline := v_timeline || jsonb_build_object(
    'id', 'health-snapshot', 'type', 'health_score_change', 'title', 'Health score snapshot',
    'description', format('Current health score: %s', v_health), 'occurred_at', now()
  );

  v_growth := jsonb_build_array(
    jsonb_build_object('key', 'team_expansion', 'available', v_team_count < 5),
    jsonb_build_object('key', 'business_packs', 'available', v_packs < 3),
    jsonb_build_object('key', 'integrations', 'available', v_integrations < 2),
    jsonb_build_object('key', 'plan_upgrade', 'available', v_health >= 70 and v_packs >= 1)
  );

  v_adoption_insights := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'label_key', 'activeUsers', 'value', v_active_users),
    jsonb_build_object('key', 'packs_used', 'label_key', 'packsUsed', 'value', v_packs),
    jsonb_build_object('key', 'integrations_used', 'label_key', 'integrationsUsed', 'value', v_integrations),
    jsonb_build_object('key', 'unused_capabilities', 'label_key', 'unusedCapabilities', 'value', greatest(0, 3 - v_packs))
  );

  return jsonb_build_object(
    'found', true,
    'has_activity', v_has_activity,
    'organization_name', coalesce(v_org_name, 'Organization'),
    'overview', jsonb_build_object(
      'customer_health_score', v_health,
      'adoption_score', v_adoption,
      'team_engagement_score', v_engagement,
      'feature_utilization_score', v_utilization,
      'health_status', public._apsc273_health_status(v_health),
      'risk_level', public._apsc273_risk_level(v_health, v_open_issues)
    ),
    'health_factors', v_factors,
    'recommendations', v_recommendations,
    'timeline', v_timeline,
    'growth_opportunities', v_growth,
    'adoption_insights', v_adoption_insights,
    'principle', 'Aipify provides advisory success insights to help your organization grow — final decisions always remain with people.'
  );
end;
$$;

create or replace function public.get_app_portal_success_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_center jsonb;
begin
  v_center := public.get_app_portal_success_center();
  return jsonb_build_object(
    'found', true,
    'recommendations', coalesce(v_center->'recommendations', '[]'::jsonb),
    'advisory_only', true
  );
end;
$$;

grant execute on function public.get_app_portal_success_center() to authenticated;
grant execute on function public.get_app_portal_success_recommendations() to authenticated;

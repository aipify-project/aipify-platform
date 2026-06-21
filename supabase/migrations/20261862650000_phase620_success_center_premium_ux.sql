-- Phase 620 — APP Support Success Center premium UX: score trust, canonical pack counts, read-only timeline.

create or replace function public._apsc273_health_state(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 85 then 'healthy'
    when p_score >= 70 then 'moderate'
    when p_score >= 50 then 'poor'
    else 'critical_health'
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
  v_customer_id uuid;
  v_org_name text;
  v_team_count integer := 0;
  v_active_users integer := 0;
  v_business_packs integer := 0;
  v_active_capabilities integer := 0;
  v_integrations integer := 0;
  v_operations_activity integer := 0;
  v_open_support integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_security_configured boolean := false;
  v_health integer := 0;
  v_adoption integer := 0;
  v_engagement integer := 0;
  v_utilization integer := 0;
  v_open_issues integer := 0;
  v_recommendations jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_growth jsonb := '[]'::jsonb;
  v_adoption_insights jsonb := '[]'::jsonb;
  v_factors jsonb := '[]'::jsonb;
  v_has_activity boolean := false;
  v_org_created timestamptz;
  v_team_first_at timestamptz;
  v_pack_first_at timestamptz;
  v_integration_first_at timestamptz;
  v_unused_capabilities integer := 0;
  v_engagement_ratio numeric := 0;
begin
  if not public.has_organization_permission('success.view') then
    raise exception 'Permission denied: success.view';
  end if;

  v_access := public._apsc273_require_success_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_customer_id := public._ap620_customer_id_for_company(v_company_id);
  select c.name, c.created_at into v_org_name, v_org_created from public.companies c where c.id = v_company_id;

  select count(*)::int,
         count(*) filter (
           where u.last_login_at is not null
             and u.last_login_at > now() - interval '14 days'
         )::int,
         min(u.created_at)
  into v_team_count, v_active_users, v_team_first_at
  from public.users u
  where u.company_id = v_company_id;

  if v_customer_id is not null and to_regclass('public.organization_business_packs') is not null then
    select count(*)::int, min(obp.activated_at)
    into v_business_packs, v_pack_first_at
    from public.organization_business_packs obp
    where obp.organization_id = v_customer_id;
  end if;

  if v_customer_id is not null and to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_active_capabilities
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, min(coalesce(ic.updated_at, ic.created_at))
    into v_integrations, v_integration_first_at
    from public.app_portal_integration_connections ic
    where ic.company_id = v_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.app_portal_operations_records') is not null then
    select count(*)::int into v_operations_activity
    from public.app_portal_operations_records op
    where op.company_id = v_company_id;
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_open_support
    from public.app_portal_support_requests sr
    where sr.company_id = v_company_id and sr.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*)::int into v_open_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = v_company_id and f.status not in ('completed', 'cancelled');
  end if;

  if to_regclass('public.user_two_factor_settings') is not null then
    select exists (
      select 1
      from public.user_two_factor_settings t
      join public.users u on u.id = t.user_id
      where u.company_id = v_company_id and t.enabled = true
    ) into v_security_configured;
  end if;

  v_open_issues := v_open_support + v_pending_approvals + v_open_follow_ups;
  v_engagement_ratio := case when v_team_count > 0 then v_active_users::numeric / v_team_count else 0 end;

  v_adoption := least(100, greatest(0,
    case when v_team_count <= 1 then 12 + v_active_users * 6 else 22 + least(28, (v_team_count - 1) * 7) end
    + least(20, v_business_packs * 12)
    + least(12, v_integrations * 6)
  ));

  v_engagement := case
    when v_team_count = 0 then 0
    else least(100, greatest(0, round(v_engagement_ratio * 62 + least(12, v_team_count * 2))::integer))
  end;

  v_utilization := case
    when v_active_capabilities = 0 and v_operations_activity = 0 then least(25, 8 + v_integrations * 4)
    when v_active_capabilities = 0 then least(100, 15 + least(40, v_operations_activity * 3))
    else least(100, greatest(0, round((v_operations_activity::numeric / greatest(v_active_capabilities, 1)) * 48 + v_integrations * 4)::integer))
  end;

  v_health := least(100, greatest(0, round((v_adoption + v_engagement + v_utilization) / 3.0)::integer
    - v_open_support * 3 - v_pending_approvals * 2 - greatest(0, v_open_follow_ups - 2) * 2));

  v_unused_capabilities := greatest(0, v_active_capabilities - v_operations_activity);
  v_has_activity := v_team_count > 0 or v_business_packs > 0 or v_integrations > 0 or v_active_users > 0;

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'value', v_active_users, 'weight', 'high', 'impact', case when v_active_users >= 2 then 'positive' when v_active_users = 0 then 'negative' else 'neutral' end, 'action_href', '/app/organization/team'),
    jsonb_build_object('key', 'team_size', 'value', v_team_count, 'weight', 'medium', 'impact', case when v_team_count >= 3 then 'positive' when v_team_count <= 1 then 'negative' else 'neutral' end, 'action_href', '/app/organization/team'),
    jsonb_build_object('key', 'business_packs', 'value', v_business_packs, 'weight', 'high', 'impact', case when v_business_packs >= 2 then 'positive' when v_business_packs = 0 then 'negative' else 'neutral' end, 'action_href', '/app/business-packs/available'),
    jsonb_build_object('key', 'integrations', 'value', v_integrations, 'weight', 'medium', 'impact', case when v_integrations >= 1 then 'positive' else 'neutral' end, 'action_href', '/app/platform/integrations'),
    jsonb_build_object('key', 'open_support', 'value', v_open_support, 'weight', 'medium', 'impact', case when v_open_support > 0 then 'negative' else 'positive' end, 'action_href', '/app/support/requests'),
    jsonb_build_object('key', 'pending_approvals', 'value', v_pending_approvals, 'weight', 'low', 'impact', case when v_pending_approvals > 0 then 'negative' else 'positive' end, 'action_href', '/app/approvals'),
    jsonb_build_object('key', 'open_follow_ups', 'value', v_open_follow_ups, 'weight', 'low', 'impact', case when v_open_follow_ups > 2 then 'negative' else 'neutral' end, 'action_href', '/app/operations/follow-ups')
  );

  v_recommendations := public._apsc273_build_recommendations(
    v_team_count, v_business_packs, v_integrations, v_open_support, v_pending_approvals, v_open_follow_ups
  );

  if v_security_configured then
    v_recommendations := (
      select coalesce(jsonb_agg(
        case when r->>'key' = 'configureSecurity'
          then r || jsonb_build_object('status', 'completed')
          else r || jsonb_build_object('status', coalesce(r->>'status', 'open'))
        end
      ), '[]'::jsonb)
      from jsonb_array_elements(v_recommendations) r
    );
  else
    v_recommendations := (
      select coalesce(jsonb_agg(r || jsonb_build_object('status', coalesce(r->>'status', 'open'))), '[]'::jsonb)
      from jsonb_array_elements(v_recommendations) r
    );
  end if;

  if v_org_created is not null then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'org-created', 'type', 'organization_created', 'title', 'Organization established',
      'description', coalesce(v_org_name, 'Organization'), 'occurred_at', v_org_created, 'status', 'completed'
    );
  end if;

  if v_team_count > 1 and v_team_first_at is not null then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'team-growth', 'type', 'team_growth', 'title', 'Team expanded',
      'description', format('%s team members in workspace', v_team_count),
      'occurred_at', v_team_first_at, 'status', 'completed', 'href', '/app/organization/team'
    );
  end if;

  if v_business_packs > 0 and v_pack_first_at is not null then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'packs-installed', 'type', 'business_pack_installed', 'title', 'Business Packs activated',
      'description', format('%s Business Pack(s) installed', v_business_packs),
      'occurred_at', v_pack_first_at, 'status', 'completed', 'href', '/app/business-packs/installed'
    );
  end if;

  if v_integrations > 0 and v_integration_first_at is not null then
    v_timeline := v_timeline || jsonb_build_object(
      'id', 'integrations-connected', 'type', 'integration_connected', 'title', 'Integrations connected',
      'description', format('%s integration(s) connected', v_integrations),
      'occurred_at', v_integration_first_at, 'status', 'completed', 'href', '/app/platform/integrations/connected'
    );
  end if;

  v_growth := jsonb_build_array(
    jsonb_build_object('key', 'team_expansion', 'available', v_team_count < 5),
    jsonb_build_object('key', 'business_packs', 'available', v_business_packs < 3),
    jsonb_build_object('key', 'integrations', 'available', v_integrations < 2),
    jsonb_build_object('key', 'plan_upgrade', 'available', v_health < 70 and v_business_packs >= 1 and v_team_count >= 3)
  );

  v_adoption_insights := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'label_key', 'activeUsers', 'value', v_active_users),
    jsonb_build_object('key', 'team_size', 'label_key', 'teamSize', 'value', v_team_count),
    jsonb_build_object('key', 'business_packs', 'label_key', 'businessPacks', 'value', v_business_packs),
    jsonb_build_object('key', 'active_capabilities', 'label_key', 'activeCapabilities', 'value', v_active_capabilities),
    jsonb_build_object('key', 'integrations_used', 'label_key', 'integrationsUsed', 'value', v_integrations),
    jsonb_build_object('key', 'unused_capabilities', 'label_key', 'unusedCapabilities', 'value', v_unused_capabilities)
  );

  return jsonb_build_object(
    'found', true,
    'has_activity', v_has_activity,
    'organization_name', coalesce(v_org_name, 'Organization'),
    'metrics', jsonb_build_object(
      'team_count', v_team_count,
      'active_users', v_active_users,
      'business_packs', v_business_packs,
      'active_capabilities', v_active_capabilities,
      'integrations', v_integrations,
      'operations_activity', v_operations_activity
    ),
    'overview', jsonb_build_object(
      'customer_health_score', v_health,
      'adoption_score', v_adoption,
      'team_engagement_score', v_engagement,
      'feature_utilization_score', v_utilization,
      'health_status', public._apsc273_health_status(v_health),
      'health_state', public._apsc273_health_state(v_health),
      'risk_level', public._apsc273_risk_level(v_health, v_open_issues),
      'explanation', format(
        'Combined from adoption (%s), engagement (%s), and utilization (%s) with operational adjustments.',
        v_adoption, v_engagement, v_utilization
      ),
      'last_updated_at', now()
    ),
    'health_factors', v_factors,
    'recommendations', v_recommendations,
    'timeline', v_timeline,
    'growth_opportunities', v_growth,
    'adoption_insights', v_adoption_insights
  );
end;
$$;

notify pgrst, 'reload schema';

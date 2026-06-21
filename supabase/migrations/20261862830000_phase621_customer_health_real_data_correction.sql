-- Phase 621 — Customer Health real-data correction
-- Align canonical score sources with Customer Success (_cs621_* helpers).
-- Score availability gate, synthetic PS620 exclusion, pilot context, i18n keys.

create or replace function public._ch621_driver_effect(p_score integer, p_available boolean)
returns text
language sql
immutable
as $$
  select case
    when not coalesce(p_available, false) then 'unavailable'
    else public._ap620_customer_health_driver_effect(p_score)
  end;
$$;

create or replace function public._ap620_customer_health_scores(p_company_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_name text;
  v_metrics jsonb;
  v_categories jsonb;
  v_journey_started timestamptz;
  v_health_review timestamptz;
  v_has_activity boolean := false;
  v_journey_gate boolean := false;
  v_team_count integer := 0;
  v_active_users integer := 0;
  v_business_packs integer := 0;
  v_active_capabilities integer := 0;
  v_integrations integer := 0;
  v_connected_integrations integer := 0;
  v_operations_activity integer := 0;
  v_open_support integer := 0;
  v_pending_approvals integer := 0;
  v_open_follow_ups integer := 0;
  v_security_configured boolean := false;
  v_org_id uuid;
  v_adoption integer := 0;
  v_engagement integer := 0;
  v_utilization integer := 0;
  v_learning integer := 0;
  v_security integer := 0;
  v_health integer := 0;
  v_open_issues integer := 0;
  v_factors jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
begin
  select c.name into v_org_name from public.companies c where c.id = p_company_id;
  v_org_id := public._cs621_organization_id_for_company(p_company_id);
  v_metrics := public._acsc295_org_metrics(p_company_id);

  v_team_count := coalesce((v_metrics->>'team_count')::int, 0);
  v_business_packs := coalesce((v_metrics->>'business_packs')::int, (v_metrics->>'packs')::int, 0);
  v_integrations := coalesce((v_metrics->>'integrations')::int, 0);
  v_connected_integrations := coalesce((v_metrics->>'connected_integrations')::int, 0);
  v_operations_activity := coalesce((v_metrics->>'operations_records')::int, 0);

  select count(*) filter (
           where u.last_login_at is not null and u.last_login_at > now() - interval '14 days'
         )::int
  into v_active_users
  from public.users u
  where u.company_id = p_company_id
    and coalesce(u.status, 'active') not in ('disabled', 'inactive');

  if v_org_id is not null and to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_active_capabilities
    from public.tenant_modules tm
    where tm.tenant_id = v_org_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_open_support
    from public.app_portal_support_requests sr
    where sr.company_id = p_company_id and sr.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.action_requests') is not null and v_org_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_org_id and ar.status = 'pending';
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*)::int into v_open_follow_ups
    from public.app_portal_follow_ups f
    where f.company_id = p_company_id and f.status not in ('completed', 'cancelled');
  end if;

  if to_regclass('public.user_two_factor_settings') is not null then
    select exists (
      select 1
      from public.user_two_factor_settings t
      join public.users u on u.id = t.user_id
      where u.company_id = p_company_id and t.enabled = true
        and coalesce(u.status, 'active') not in ('disabled', 'inactive')
    ) into v_security_configured;
  end if;

  select cs.journey_started_at into v_journey_started
  from public.app_portal_customer_success_state cs
  where cs.company_id = p_company_id;

  select hs.review_started_at into v_health_review
  from public.app_portal_customer_health_state hs
  where hs.company_id = p_company_id;

  v_has_activity := v_team_count > 0
    or v_business_packs > 0
    or v_connected_integrations > 0
    or v_operations_activity > 0
    or v_active_users > 0;

  v_journey_gate := v_journey_started is not null or v_health_review is not null or v_has_activity;
  v_categories := public._acsc295_category_scores(v_metrics, v_journey_gate);

  v_adoption := round((
    (v_categories->>'learning_completion')::numeric +
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'user_engagement')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'security_completion')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 6)::int;

  v_utilization := round((
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 3)::int;

  v_engagement := (v_categories->>'user_engagement')::int;
  v_learning := (v_categories->>'learning_completion')::int;
  v_security := (v_categories->>'security_completion')::int;

  v_open_issues := v_open_support + v_pending_approvals + v_open_follow_ups;
  v_health := least(100, greatest(0, round((v_adoption + v_engagement + v_utilization) / 3.0)::integer
    - v_open_support * 3 - v_pending_approvals * 2 - greatest(0, v_open_follow_ups - 2) * 2));

  v_factors := jsonb_build_array(
    jsonb_build_object('key', 'active_users', 'value', v_active_users, 'weight', 'high', 'impact', case when v_active_users >= 2 then 'positive' when v_active_users = 0 and v_journey_gate then 'negative' else 'neutral' end, 'action_href', '/app/organization/team'),
    jsonb_build_object('key', 'team_size', 'value', v_team_count, 'weight', 'medium', 'impact', case when v_team_count >= 3 then 'positive' else 'neutral' end, 'action_href', '/app/organization/team'),
    jsonb_build_object('key', 'business_packs', 'value', v_business_packs, 'weight', 'high', 'impact', case when v_business_packs >= 2 then 'positive' when v_business_packs = 0 and v_journey_gate then 'negative' else 'neutral' end, 'action_href', '/app/business-packs/available'),
    jsonb_build_object('key', 'integrations', 'value', v_connected_integrations, 'weight', 'medium', 'impact', case when v_connected_integrations >= 1 then 'positive' else 'neutral' end, 'action_href', '/app/platform/integrations'),
    jsonb_build_object('key', 'open_support', 'value', v_open_support, 'weight', 'medium', 'impact', case when v_open_support > 0 then 'negative' else 'positive' end, 'action_href', '/app/support/requests'),
    jsonb_build_object('key', 'pending_approvals', 'value', v_pending_approvals, 'weight', 'low', 'impact', case when v_pending_approvals > 0 then 'negative' else 'positive' end, 'action_href', '/app/approvals'),
    jsonb_build_object('key', 'open_follow_ups', 'value', v_open_follow_ups, 'weight', 'low', 'impact', case when v_open_follow_ups > 2 then 'negative' else 'neutral' end, 'action_href', '/app/operations/follow-ups')
  );

  v_recommendations := public._apsc273_build_recommendations(
    v_team_count, v_business_packs, v_connected_integrations,
    v_open_support, v_pending_approvals, v_open_follow_ups
  );

  return jsonb_build_object(
    'organization_name', coalesce(v_org_name, 'Organization'),
    'has_activity', v_has_activity,
    'journey_started', v_journey_gate,
    'health_score', v_health,
    'adoption_score', v_adoption,
    'engagement_score', v_engagement,
    'utilization_score', v_utilization,
    'learning_score', v_learning,
    'security_score', v_security,
    'health_state', public._apsc273_health_state(v_health),
    'risk_level', public._apsc273_risk_level(v_health, v_open_issues),
    'explanation_key', 'customerApp.portalStructure.customerHealth.scoreAvailability.available',
    'metrics', jsonb_build_object(
      'team_count', v_team_count,
      'active_users', v_active_users,
      'business_packs', v_business_packs,
      'active_capabilities', v_active_capabilities,
      'integrations', v_connected_integrations,
      'operations_activity', v_operations_activity
    ),
    'health_factors', v_factors,
    'recommendations', v_recommendations,
    'open_support', v_open_support,
    'pending_approvals', v_pending_approvals,
    'open_follow_ups', v_open_follow_ups,
    'security_configured', v_security_configured
  );
end;
$$;

create or replace function public.list_app_portal_customer_health(
  p_category text default null,
  p_period_from date default null,
  p_department text default null,
  p_priority text default null,
  p_trend text default null,
  p_recommendation_status text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_bundle jsonb;
  v_pilot jsonb;
  v_scores jsonb;
  v_score_available boolean := false;
  v_health integer;
  v_health_state text;
  v_prior_score integer;
  v_score_change integer;
  v_trend_state text;
  v_snapshot_count integer := 0;
  v_drivers jsonb := '[]'::jsonb;
  v_strengths jsonb := '[]'::jsonb;
  v_needs_attention jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_history jsonb := '[]'::jsonb;
  v_trend_points jsonb := '[]'::jsonb;
  v_recs jsonb;
  v_top_rec jsonb;
  v_period_start timestamptz;
  v_calculated_at timestamptz := now();
  v_explanation_key text;
  v_team_count integer := 0;
begin
  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_pilot := public._cs621_pilot_context(v_company_id);
  v_bundle := public._ap620_customer_health_scores(v_company_id);

  v_health := (v_bundle->>'health_score')::int;
  v_team_count := coalesce((v_bundle->'metrics'->>'team_count')::int, 0);

  v_scores := public._cs621_resolve_scores(
    v_company_id,
    (v_bundle->>'adoption_score')::int,
    (v_bundle->>'utilization_score')::int,
    (v_bundle->>'engagement_score')::int,
    v_health,
    coalesce((v_bundle->>'journey_started')::boolean, false),
    coalesce((v_bundle->>'has_activity')::boolean, false),
    v_pilot,
    v_calculated_at
  );

  v_score_available := (v_scores->'health'->>'availability') = 'available';
  v_explanation_key := v_scores->'health'->>'explanation_key';

  v_health_state := case
    when not v_score_available then 'unknown'
    else public._apsc273_health_state(v_health)
  end;

  select hs.last_overall_score into v_prior_score
  from public.app_portal_customer_health_state hs
  where hs.company_id = v_company_id;

  select count(*)::int into v_snapshot_count
  from public.app_portal_customer_health_score_snapshots s
  where s.company_id = v_company_id;

  if v_score_available and v_snapshot_count >= 2 and v_prior_score is not null then
    v_score_change := v_health - v_prior_score;
    v_trend_state := public._ap620_customer_health_trend_state(v_health, v_prior_score, v_snapshot_count);
  else
    v_score_change := null;
    v_trend_state := 'insufficient_data';
  end if;

  if p_trend is not null and v_trend_state <> p_trend then
    return jsonb_build_object('found', true, 'filtered_out', true, 'has_activity', v_bundle->>'has_activity');
  end if;

  v_period_start := coalesce(p_period_from::timestamptz, now() - interval '30 days');

  select coalesce(jsonb_agg(jsonb_build_object(
    'recorded_at', s.recorded_at,
    'score', s.overall_score,
    'health_state', s.health_state
  ) order by s.recorded_at asc), '[]'::jsonb)
  into v_trend_points
  from public.app_portal_customer_health_score_snapshots s
  where s.company_id = v_company_id
    and s.recorded_at >= v_period_start
    and v_score_available;

  v_drivers := jsonb_build_array(
    jsonb_build_object('key', 'adoption', 'score', case when v_score_available then (v_bundle->>'adoption_score')::int else null end, 'effect', public._ch621_driver_effect((v_bundle->>'adoption_score')::int, v_score_available), 'availability', v_scores->'adoption'->>'availability'),
    jsonb_build_object('key', 'engagement', 'score', case when v_score_available then (v_bundle->>'engagement_score')::int else null end, 'effect', public._ch621_driver_effect((v_bundle->>'engagement_score')::int, v_score_available), 'availability', v_scores->'engagement'->>'availability'),
    jsonb_build_object('key', 'utilization', 'score', case when v_score_available then (v_bundle->>'utilization_score')::int else null end, 'effect', public._ch621_driver_effect((v_bundle->>'utilization_score')::int, v_score_available), 'availability', v_scores->'utilization'->>'availability'),
    jsonb_build_object('key', 'learning', 'score', case when v_score_available then (v_bundle->>'learning_score')::int else null end, 'effect', public._ch621_driver_effect((v_bundle->>'learning_score')::int, v_score_available), 'availability', v_scores->'health'->>'availability'),
    jsonb_build_object('key', 'security', 'score', case when v_score_available then (v_bundle->>'security_score')::int else null end, 'effect', public._ch621_driver_effect((v_bundle->>'security_score')::int, v_score_available), 'availability', v_scores->'health'->>'availability'),
    jsonb_build_object('key', 'integrations', 'score', case when v_score_available then least(100, coalesce((v_bundle->'metrics'->>'integrations')::int, 0) * 25) else null end, 'effect', public._ch621_driver_effect(least(100, coalesce((v_bundle->'metrics'->>'integrations')::int, 0) * 25), v_score_available), 'availability', v_scores->'health'->>'availability')
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', f->>'key',
    'value', (f->>'value')::int,
    'impact', f->>'impact',
    'action_href', f->>'action_href',
    'description_key', f->>'key',
    'availability', case when v_score_available then 'available' else 'insufficient_data' end
  )), '[]'::jsonb)
  into v_strengths
  from jsonb_array_elements(v_bundle->'health_factors') f
  where f->>'impact' = 'positive';

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', f->>'key',
    'severity', case f->>'impact'
      when 'negative' then 'high'
      else 'medium'
    end,
    'impact', f->>'weight',
    'impact_key', f->>'key',
    'action_href', f->>'action_href',
    'value', (f->>'value')::int,
    'availability', case when v_score_available then 'available' else 'insufficient_data' end
  ) order by case f->>'impact' when 'negative' then 0 else 1 end), '[]'::jsonb)
  into v_needs_attention
  from jsonb_array_elements(v_bundle->'health_factors') f
  where f->>'impact' in ('negative', 'neutral')
    and v_score_available
    and (
      (f->>'key' = 'open_support' and (f->>'value')::int > 0)
      or (f->>'key' = 'pending_approvals' and (f->>'value')::int > 0)
      or (f->>'key' = 'open_follow_ups' and (f->>'value')::int > 2)
      or (f->>'key' = 'business_packs' and (f->>'value')::int = 0)
      or (f->>'key' = 'integrations' and (f->>'value')::int = 0)
      or (f->>'key' = 'active_users' and (f->>'value')::int = 0)
    );

  v_risks := (
    select coalesce(jsonb_agg(r), '[]'::jsonb) from (
      select jsonb_build_object(
        'key', 'open_support_backlog',
        'severity', case when (v_bundle->>'open_support')::int > 3 then 'critical' when (v_bundle->>'open_support')::int > 0 then 'high' else 'info' end,
        'description_key', 'openSupportBacklog',
        'description_params', jsonb_build_object('count', (v_bundle->>'open_support')::int),
        'category', 'support',
        'status', case when (v_bundle->>'open_support')::int > 0 then 'warning' else 'neutral' end
      ) as r where v_score_available and (v_bundle->>'open_support')::int > 0
      union all
      select jsonb_build_object(
        'key', 'pending_approvals',
        'severity', case when (v_bundle->>'pending_approvals')::int > 2 then 'high' else 'medium' end,
        'description_key', 'pendingApprovals',
        'description_params', jsonb_build_object('count', (v_bundle->>'pending_approvals')::int),
        'category', 'governance',
        'status', 'warning'
      ) where v_score_available and (v_bundle->>'pending_approvals')::int > 0
      union all
      select jsonb_build_object(
        'key', 'security_not_configured',
        'severity', 'high',
        'description_key', 'securityNotConfigured',
        'description_params', '{}'::jsonb,
        'category', 'security',
        'status', 'warning'
      ) where v_score_available and coalesce((v_bundle->>'security_configured')::boolean, false) = false
      union all
      select jsonb_build_object(
        'key', 'low_engagement',
        'severity', 'medium',
        'description_key', 'lowEngagement',
        'description_params', '{}'::jsonb,
        'category', 'engagement',
        'status', 'warning'
      ) where v_score_available and (v_bundle->>'engagement_score')::int < 50
    ) sub
  );

  v_signals := jsonb_build_array(
    jsonb_build_object(
      'key', 'team_activity',
      'category', 'adoption',
      'description_key', 'teamActivity',
      'description_params', jsonb_build_object('count', coalesce((v_bundle->'metrics'->>'active_users')::int, 0)),
      'trend', case when v_score_available then v_trend_state else 'insufficient_data' end,
      'status', case when v_score_available then 'neutral' else 'unavailable' end
    ),
    jsonb_build_object(
      'key', 'business_packs_installed',
      'category', 'adoption',
      'description_key', 'businessPacksInstalled',
      'description_params', jsonb_build_object('count', coalesce((v_bundle->'metrics'->>'business_packs')::int, 0)),
      'trend', 'stable',
      'status', case when v_score_available then 'neutral' else 'unavailable' end
    ),
    jsonb_build_object(
      'key', 'capabilities_enabled',
      'category', 'utilization',
      'description_key', 'capabilitiesEnabled',
      'description_params', jsonb_build_object('count', coalesce((v_bundle->'metrics'->>'active_capabilities')::int, 0)),
      'trend', 'stable',
      'status', case when v_score_available then 'neutral' else 'unavailable' end
    ),
    jsonb_build_object(
      'key', 'operations_activity',
      'category', 'operations',
      'description_key', 'operationsActivity',
      'description_params', jsonb_build_object('count', coalesce((v_bundle->'metrics'->>'operations_activity')::int, 0)),
      'trend', case
        when not v_score_available then 'insufficient_data'
        when (v_bundle->>'utilization_score')::int >= 60 then 'improving'
        else 'stable'
      end,
      'status', case when v_score_available then 'neutral' else 'unavailable' end
    )
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'event_type_key', case l.event_type
      when 'score_calculated' then 'scoreCalculated'
      when 'review_started' then 'reviewStarted'
      else l.event_type
    end,
    'description_key', case l.event_type
      when 'score_calculated' then 'scoreCalculated'
      when 'review_started' then 'reviewStarted'
      else 'genericEvent'
    end,
    'description_params', coalesce(l.metadata, '{}'::jsonb),
    'score', nullif(l.metadata->>'overall_score', '')::int,
    'status', case
      when not v_score_available then 'unavailable'
      when nullif(l.metadata->>'overall_score', '') is null then 'neutral'
      else public._apsc273_health_state((l.metadata->>'overall_score')::int)
    end,
    'recorded_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_history
  from public.app_portal_customer_health_audit_logs l
  where l.company_id = v_company_id
    and l.event_type in ('score_calculated', 'review_started')
    and not public._cs621_is_synthetic_text(l.description)
    and not public._cs621_is_showcase_row(v_company_id, 'app_portal_customer_health_audit_logs', l.id)
    and (p_period_from is null or l.created_at::date >= p_period_from)
    and (
      p_search is null or trim(p_search) = ''
      or l.event_type ilike '%' || trim(p_search) || '%'
    );

  v_recs := v_bundle->'recommendations';
  if not v_score_available then
    v_recs := '[]'::jsonb;
  elsif coalesce(v_pilot->>'active', 'false') = 'true'
        and coalesce(v_pilot->>'awaiting_first_sync', 'false') = 'true' then
    v_recs := jsonb_build_array(
      jsonb_build_object('key', 'completeFirstUnonightSync', 'priority', 'high_impact', 'module', 'operations')
    );
  end if;

  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'module' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if p_category is not null or p_search is not null then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_risks from (
      select r from jsonb_array_elements(v_risks) r
      where (p_category is null or r->>'category' = p_category)
    ) sub;
    select coalesce(jsonb_agg(s), '[]'::jsonb) into v_signals from (
      select s from jsonb_array_elements(v_signals) s
      where (p_category is null or s->>'category' = p_category)
    ) sub;
  end if;

  select r into v_top_rec
  from jsonb_array_elements(v_recs) r
  order by case r->>'priority' when 'high' then 0 when 'high_impact' then 0 when 'medium' then 1 when 'important' then 1 else 2 end
  limit 1;

  return jsonb_build_object(
    'found', true,
    'has_activity', (v_bundle->>'has_activity')::boolean,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'organization_name', v_bundle->>'organization_name',
    'pilot_status', v_pilot,
    'scores', v_scores,
    'overview', jsonb_build_object(
      'health_score', case when v_score_available then v_health else null end,
      'health_state', v_health_state,
      'adoption_score', case when v_score_available then (v_bundle->>'adoption_score')::int else null end,
      'engagement_score', case when v_score_available then (v_bundle->>'engagement_score')::int else null end,
      'utilization_score', case when v_score_available then (v_bundle->>'utilization_score')::int else null end,
      'learning_score', case when v_score_available then (v_bundle->>'learning_score')::int else null end,
      'risk_level', case when v_score_available then v_bundle->>'risk_level' else 'low' end,
      'trend_state', v_trend_state,
      'score_change', v_score_change,
      'explanation_key', v_explanation_key,
      'score_availability', v_scores->'health'->>'availability',
      'source_freshness', v_scores->'health'->>'source_freshness',
      'last_calculated_at', case when v_score_available then v_calculated_at else null end
    ),
    'metrics', v_bundle->'metrics',
    'recommended_action', case when v_top_rec is null then null else jsonb_build_object(
      'key', v_top_rec->>'key',
      'priority', v_top_rec->>'priority',
      'module', v_top_rec->>'module'
    ) end,
    'drivers', v_drivers,
    'strengths', v_strengths,
    'needs_attention', v_needs_attention,
    'trend_points', v_trend_points,
    'trend_state', v_trend_state,
    'risks', v_risks,
    'operational_signals', v_signals,
    'health_history', v_history,
    'recommendations', v_recs,
    'health_factors', v_bundle->'health_factors'
  );
end;
$$;

notify pgrst, 'reload schema';

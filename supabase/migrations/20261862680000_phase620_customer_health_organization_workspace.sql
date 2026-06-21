-- Phase 620 — Customer Health Organization Health Workspace (read-only GET, Success Center score alignment)

create table if not exists public.app_portal_customer_health_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  health_state text not null,
  adoption_score integer,
  engagement_score integer,
  utilization_score integer,
  source text not null default 'review',
  recorded_at timestamptz not null default now()
);

create index if not exists app_portal_customer_health_score_snapshots_company_idx
  on public.app_portal_customer_health_score_snapshots (company_id, recorded_at desc);

alter table public.app_portal_customer_health_score_snapshots enable row level security;
revoke all on public.app_portal_customer_health_score_snapshots from authenticated, anon;

create or replace function public._ap620_customer_health_trend_state(
  p_current integer,
  p_prior integer,
  p_snapshot_count integer
)
returns text
language plpgsql
immutable
as $$
begin
  if coalesce(p_snapshot_count, 0) < 2 or p_prior is null then
    return 'insufficient_data';
  end if;
  if p_current - p_prior >= 8 then return 'improving'; end if;
  if p_prior - p_current >= 15 then return 'rapid_decline'; end if;
  if p_prior - p_current >= 5 then return 'declining'; end if;
  return 'stable';
end;
$$;

create or replace function public._ap620_customer_health_driver_effect(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 75 then 'positive'
    when p_score >= 55 then 'neutral'
    when p_score >= 40 then 'moderate_negative'
    when p_score >= 25 then 'strong_negative'
    else 'critical_negative'
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
  v_learning integer := 0;
  v_security integer := 0;
  v_open_issues integer := 0;
  v_engagement_ratio numeric := 0;
  v_factors jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_has_activity boolean := false;
begin
  v_customer_id := public._ap620_customer_id_for_company(p_company_id);
  select c.name into v_org_name from public.companies c where c.id = p_company_id;

  select count(*)::int,
         count(*) filter (
           where u.last_login_at is not null
             and u.last_login_at > now() - interval '14 days'
         )::int
  into v_team_count, v_active_users
  from public.users u
  where u.company_id = p_company_id;

  if v_customer_id is not null and to_regclass('public.organization_business_packs') is not null then
    select count(*)::int into v_business_packs
    from public.organization_business_packs obp
    where obp.organization_id = v_customer_id;
  end if;

  if v_customer_id is not null and to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_active_capabilities
    from public.tenant_modules tm
    where tm.tenant_id = v_customer_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int into v_integrations
    from public.app_portal_integration_connections ic
    where ic.company_id = p_company_id and ic.status = 'connected';
  end if;

  if to_regclass('public.app_portal_operations_records') is not null then
    select count(*)::int into v_operations_activity
    from public.app_portal_operations_records op
    where op.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*)::int into v_open_support
    from public.app_portal_support_requests sr
    where sr.company_id = p_company_id and sr.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.action_requests') is not null and v_customer_id is not null then
    select count(*)::int into v_pending_approvals
    from public.action_requests ar
    where ar.tenant_id = v_customer_id and ar.status = 'pending';
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

  v_learning := least(100, case
    when to_regclass('public.app_portal_academy_completions') is null then 0
    else round(((select count(*)::numeric from public.app_portal_academy_completions co where co.company_id = p_company_id) / greatest(v_team_count, 1)) * 20)::int
  end);

  v_security := case
    when v_team_count = 0 then 0
    when v_security_configured then least(100, 60 + round((v_active_users::numeric / v_team_count) * 40)::int)
    else least(40, round((v_active_users::numeric / greatest(v_team_count, 1)) * 20)::int)
  end;

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

  return jsonb_build_object(
    'organization_name', coalesce(v_org_name, 'Organization'),
    'has_activity', v_has_activity,
    'health_score', v_health,
    'adoption_score', v_adoption,
    'engagement_score', v_engagement,
    'utilization_score', v_utilization,
    'learning_score', v_learning,
    'security_score', v_security,
    'health_state', public._apsc273_health_state(v_health),
    'risk_level', public._apsc273_risk_level(v_health, v_open_issues),
    'explanation', format(
      'Combined from adoption (%s), engagement (%s), and utilization (%s) with operational adjustments.',
      v_adoption, v_engagement, v_utilization
    ),
    'metrics', jsonb_build_object(
      'team_count', v_team_count,
      'active_users', v_active_users,
      'business_packs', v_business_packs,
      'active_capabilities', v_active_capabilities,
      'integrations', v_integrations,
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

create or replace function public.begin_app_portal_customer_health_review()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_bundle jsonb;
  v_health integer;
begin
  if not public.has_organization_permission('customer_health.manage') then
    raise exception 'Permission denied: customer_health.manage';
  end if;

  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_bundle := public._ap620_customer_health_scores(v_company_id);
  v_health := (v_bundle->>'health_score')::int;

  insert into public.app_portal_customer_health_state (
    company_id, review_started_at, last_overall_score, last_engagement_score, last_snapshot_at, updated_by
  ) values (
    v_company_id, now(), v_health, (v_bundle->>'engagement_score')::int, now(), v_user_id
  )
  on conflict (company_id) do update set
    review_started_at = coalesce(public.app_portal_customer_health_state.review_started_at, now()),
    last_overall_score = v_health,
    last_engagement_score = (v_bundle->>'engagement_score')::int,
    last_snapshot_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_customer_health_score_snapshots (
    company_id, overall_score, health_state, adoption_score, engagement_score, utilization_score, source
  ) values (
    v_company_id,
    v_health,
    v_bundle->>'health_state',
    (v_bundle->>'adoption_score')::int,
    (v_bundle->>'engagement_score')::int,
    (v_bundle->>'utilization_score')::int,
    'review'
  );

  insert into public.app_portal_customer_health_audit_logs (
    company_id, event_type, description, performed_by, metadata
  ) values (
    v_company_id,
    'score_calculated',
    format('Organization health score calculated: %s', v_health),
    v_user_id,
    jsonb_build_object(
      'overall_score', v_health,
      'health_state', v_bundle->>'health_state',
      'adoption_score', (v_bundle->>'adoption_score')::int,
      'engagement_score', (v_bundle->>'engagement_score')::int,
      'utilization_score', (v_bundle->>'utilization_score')::int
    )
  );

  return public.list_app_portal_customer_health(null, null, null, null, null, null, null);
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
  v_health integer;
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
begin
  v_ctx := public._achrc296_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_bundle := public._ap620_customer_health_scores(v_company_id);
  v_health := (v_bundle->>'health_score')::int;

  select hs.last_overall_score into v_prior_score
  from public.app_portal_customer_health_state hs
  where hs.company_id = v_company_id;

  select count(*)::int into v_snapshot_count
  from public.app_portal_customer_health_score_snapshots s
  where s.company_id = v_company_id;

  v_score_change := case when v_prior_score is null then 0 else v_health - v_prior_score end;
  v_trend_state := public._ap620_customer_health_trend_state(v_health, v_prior_score, v_snapshot_count);

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
    and s.recorded_at >= v_period_start;

  v_drivers := jsonb_build_array(
    jsonb_build_object('key', 'adoption', 'score', (v_bundle->>'adoption_score')::int, 'effect', public._ap620_customer_health_driver_effect((v_bundle->>'adoption_score')::int)),
    jsonb_build_object('key', 'engagement', 'score', (v_bundle->>'engagement_score')::int, 'effect', public._ap620_customer_health_driver_effect((v_bundle->>'engagement_score')::int)),
    jsonb_build_object('key', 'utilization', 'score', (v_bundle->>'utilization_score')::int, 'effect', public._ap620_customer_health_driver_effect((v_bundle->>'utilization_score')::int)),
    jsonb_build_object('key', 'learning', 'score', (v_bundle->>'learning_score')::int, 'effect', public._ap620_customer_health_driver_effect((v_bundle->>'learning_score')::int)),
    jsonb_build_object('key', 'security', 'score', (v_bundle->>'security_score')::int, 'effect', public._ap620_customer_health_driver_effect((v_bundle->>'security_score')::int)),
    jsonb_build_object('key', 'integrations', 'score', least(100, ((v_bundle->'metrics'->>'integrations')::int * 25)), 'effect', public._ap620_customer_health_driver_effect(least(100, ((v_bundle->'metrics'->>'integrations')::int * 25)))
  );

  select coalesce(jsonb_agg(f), '[]'::jsonb) into v_strengths
  from jsonb_array_elements(v_bundle->'health_factors') f
  where f->>'impact' = 'positive';

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', f->>'key',
    'severity', case f->>'impact'
      when 'negative' then 'high'
      else 'medium'
    end,
    'impact', f->>'weight',
    'action_href', f->>'action_href',
    'value', (f->>'value')::int
  ) order by case f->>'impact' when 'negative' then 0 else 1 end), '[]'::jsonb)
  into v_needs_attention
  from jsonb_array_elements(v_bundle->'health_factors') f
  where f->>'impact' in ('negative', 'neutral')
    and (
      (f->>'key' = 'open_support' and (f->>'value')::int > 0)
      or (f->>'key' = 'pending_approvals' and (f->>'value')::int > 0)
      or (f->>'key' = 'open_follow_ups' and (f->>'value')::int > 2)
      or (f->>'key' = 'business_packs' and (f->>'value')::int = 0)
      or (f->>'key' = 'integrations' and (f->>'value')::int = 0)
      or (f->>'key' = 'team_size' and (f->>'value')::int <= 1)
      or (f->>'key' = 'active_users' and (f->>'value')::int = 0)
    );

  v_risks := (
    select coalesce(jsonb_agg(r), '[]'::jsonb) from (
      select jsonb_build_object(
        'key', 'open_support_backlog',
        'severity', case when (v_bundle->>'open_support')::int > 3 then 'critical' when (v_bundle->>'open_support')::int > 0 then 'high' else 'info' end,
        'description', format('%s open support request(s)', v_bundle->>'open_support'),
        'category', 'support'
      ) as r where (v_bundle->>'open_support')::int > 0
      union all
      select jsonb_build_object(
        'key', 'pending_approvals',
        'severity', case when (v_bundle->>'pending_approvals')::int > 2 then 'high' else 'medium' end,
        'description', format('%s pending approval(s)', v_bundle->>'pending_approvals'),
        'category', 'governance'
      ) where (v_bundle->>'pending_approvals')::int > 0
      union all
      select jsonb_build_object(
        'key', 'security_not_configured',
        'severity', 'high',
        'description', 'Security protections are not fully configured for the organization.',
        'category', 'security'
      ) where coalesce((v_bundle->>'security_configured')::boolean, false) = false
      union all
      select jsonb_build_object(
        'key', 'low_engagement',
        'severity', 'medium',
        'description', 'Recent team engagement is below expected levels.',
        'category', 'engagement'
      ) where (v_bundle->>'engagement_score')::int < 50
    ) sub
  );

  v_signals := (
    select coalesce(jsonb_agg(s), '[]'::jsonb) from (
      select jsonb_build_object(
        'key', 'team_activity',
        'category', 'adoption',
        'description', format('%s active user(s) in the last 14 days', v_bundle->'metrics'->>'active_users'),
        'trend', v_trend_state
      ) as s
      union all
      select jsonb_build_object(
        'key', 'business_packs_installed',
        'category', 'adoption',
        'description', format('%s canonical Business Pack(s) installed', v_bundle->'metrics'->>'business_packs'),
        'trend', 'stable'
      )
      union all
      select jsonb_build_object(
        'key', 'capabilities_enabled',
        'category', 'utilization',
        'description', format('%s active capabilities enabled', v_bundle->'metrics'->>'active_capabilities'),
        'trend', 'stable'
      )
      union all
      select jsonb_build_object(
        'key', 'operations_activity',
        'category', 'operations',
        'description', format('%s operational activity record(s)', v_bundle->'metrics'->>'operations_activity'),
        'trend', case when (v_bundle->>'utilization_score')::int >= 60 then 'improving' else 'stable' end
      )
    ) sub
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'description', l.description,
    'score', nullif(l.metadata->>'overall_score', '')::int,
    'recorded_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_history
  from public.app_portal_customer_health_audit_logs l
  where l.company_id = v_company_id
    and l.event_type in ('score_calculated', 'review_started')
    and (p_period_from is null or l.created_at::date >= p_period_from)
    and (
      p_search is null or trim(p_search) = ''
      or l.description ilike '%' || trim(p_search) || '%'
      or l.event_type ilike '%' || trim(p_search) || '%'
    );

  v_recs := v_bundle->'recommendations';
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
        and (p_search is null or trim(p_search) = '' or r->>'description' ilike '%' || trim(p_search) || '%')
    ) sub;
    select coalesce(jsonb_agg(s), '[]'::jsonb) into v_signals from (
      select s from jsonb_array_elements(v_signals) s
      where (p_category is null or s->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or s->>'description' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  select r into v_top_rec
  from jsonb_array_elements(v_recs) r
  order by case r->>'priority' when 'high' then 0 when 'medium' then 1 else 2 end
  limit 1;

  return jsonb_build_object(
    'found', true,
    'has_activity', (v_bundle->>'has_activity')::boolean,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'organization_name', v_bundle->>'organization_name',
    'overview', jsonb_build_object(
      'health_score', v_health,
      'health_state', v_bundle->>'health_state',
      'adoption_score', (v_bundle->>'adoption_score')::int,
      'engagement_score', (v_bundle->>'engagement_score')::int,
      'utilization_score', (v_bundle->>'utilization_score')::int,
      'learning_score', (v_bundle->>'learning_score')::int,
      'risk_level', v_bundle->>'risk_level',
      'trend_state', v_trend_state,
      'score_change', v_score_change,
      'explanation', v_bundle->>'explanation',
      'last_calculated_at', now()
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

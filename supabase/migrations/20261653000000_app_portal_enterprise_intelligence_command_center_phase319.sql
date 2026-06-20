-- Phase 319 (APP Intelligence) — Enterprise Intelligence Command Center
-- Read-only aggregation layer over Phases 311-318 Intelligence modules.

create table if not exists public.app_portal_eicc_state (
  company_id            uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled   boolean not null default false,
  last_briefing_at       timestamptz,
  preferences            jsonb   not null default '{}'::jsonb,
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_eicc_briefings (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  briefing_key  text not null default '',
  period        text not null default 'today' check (period in (
    'today','this_week','this_month','this_quarter'
  )),
  summary       text not null default '',
  key_observations  jsonb not null default '[]'::jsonb,
  suggested_actions jsonb not null default '[]'::jsonb,
  review_items      jsonb not null default '[]'::jsonb,
  generated_at  timestamptz not null default now(),
  unique (company_id, briefing_key)
);

create table if not exists public.app_portal_eicc_priorities (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  priority_key  text not null default '',
  title         text not null default '',
  source_module text not null default '',
  priority_level text not null default 'medium' check (priority_level in (
    'critical','high','medium','low'
  )),
  category      text not null default '',
  time_horizon  text not null default '',
  recommended_action text not null default '',
  review_status text not null default 'pending' check (review_status in (
    'pending','in_review','reviewed','actioned'
  )),
  created_at    timestamptz not null default now(),
  unique (company_id, priority_key)
);

create table if not exists public.app_portal_eicc_timeline (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  event_type    text not null,
  source_module text not null default '',
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists app_portal_eicc_timeline_idx
  on public.app_portal_eicc_timeline (company_id, created_at desc);

create table if not exists public.app_portal_eicc_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  event_type    text not null,
  description   text not null default '',
  performed_by  uuid references public.users (id) on delete set null,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

alter table public.app_portal_eicc_state      enable row level security;
alter table public.app_portal_eicc_briefings  enable row level security;
alter table public.app_portal_eicc_priorities enable row level security;
alter table public.app_portal_eicc_timeline   enable row level security;
alter table public.app_portal_eicc_audit_logs enable row level security;
revoke all on public.app_portal_eicc_state      from authenticated, anon;
revoke all on public.app_portal_eicc_briefings  from authenticated, anon;
revoke all on public.app_portal_eicc_priorities from authenticated, anon;
revoke all on public.app_portal_eicc_timeline   from authenticated, anon;
revoke all on public.app_portal_eicc_audit_logs from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard
-- -----------------------------------------------------------------------
create or replace function public._aeicc319_access_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_access jsonb; v_user public.users; v_role text;
  v_mgr boolean := false; v_adm boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role   := v_access->>'organization_role';
  select coalesce(s.manager_access_enabled,false), coalesce(s.admin_access_enabled,false)
  into v_mgr, v_adm
  from public.app_portal_eicc_state s
  where s.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_view',true,'can_review',true);
  elsif v_role = 'organization_admin' and v_adm then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',true,'can_view',true,'can_review',true);
  elsif v_role = 'organization_manager' and v_mgr then
    return v_access || jsonb_build_object(
      'user_id',v_user.id,'can_full',false,'can_view',true,'can_review',false);
  end if;
  raise exception 'Intelligence Command Center access requires owner authorization or explicit grant';
end; $$;

-- -----------------------------------------------------------------------
-- Aggregate module scores
-- -----------------------------------------------------------------------
create or replace function public._aeicc319_aggregate_scores(p_company_id uuid)
returns jsonb language plpgsql stable as $$
declare
  v_benchmarking_score  integer := 0;
  v_predictive_score    integer := 0;
  v_scenario_score      integer := 0;
  v_foresight_score     integer := 0;
  v_opportunities_score integer := 0;
  v_forecasting_score   integer := 0;
  v_readiness_score     integer := 0;
  v_cfi_score           integer := 0;
  v_count               integer := 0;
begin
  -- Enterprise Benchmarking (Phase 311)
  if to_regclass('public.app_portal_enterprise_benchmarking_state') is not null then
    select coalesce(round(avg(d.maturity_score)),0) into v_benchmarking_score
    from public.app_portal_enterprise_benchmarking_dimensions d where d.company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Predictive Intelligence (Phase 312)
  if to_regclass('public.app_portal_predictive_intelligence_predictions') is not null then
    select case
      when count(*) filter (where potential_impact in ('high','critical')) > 2 then 55
      when count(*) filter (where potential_impact in ('high','critical')) > 0 then 65
      else 75
    end into v_predictive_score
    from public.app_portal_predictive_intelligence_predictions where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Scenario Planning (Phase 313)
  if to_regclass('public.app_portal_scenario_planning_scenarios') is not null then
    select case
      when count(*) filter (where planning_status = 'simulated') > 0 then 72
      when count(*) > 0 then 65
      else 60
    end into v_scenario_score
    from public.app_portal_scenario_planning_scenarios where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Executive Foresight (Phase 314)
  if to_regclass('public.app_portal_executive_foresight_observations') is not null then
    select case
      when count(*) filter (where momentum_direction = 'gaining') > 3 then 75
      when count(*) filter (where momentum_direction = 'losing') > 2 then 55
      else 65
    end into v_foresight_score
    from public.app_portal_executive_foresight_observations where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Strategic Opportunities (Phase 315)
  if to_regclass('public.app_portal_strategic_opportunities') is not null then
    select least(100, greatest(40,
      50 + count(*) filter (where status in ('in_progress','approved')) * 5
         - count(*) filter (where status = 'archived') * 2
    )) into v_opportunities_score
    from public.app_portal_strategic_opportunities where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Organizational Forecasting (Phase 316)
  if to_regclass('public.app_portal_org_forecasts') is not null then
    select least(100, greatest(40,
      55 + count(*) filter (where trend_direction = 'improving') * 3
         - count(*) filter (where trend_direction = 'declining') * 4
    )) into v_forecasting_score
    from public.app_portal_org_forecasts where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Enterprise Readiness (Phase 317)
  if to_regclass('public.app_portal_enterprise_readiness_assessments') is not null then
    select coalesce(round(avg(current_score))::integer, 55) into v_readiness_score
    from public.app_portal_enterprise_readiness_assessments where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  -- Cross-Functional Intelligence (Phase 318)
  if to_regclass('public.app_portal_cfi_collaboration') is not null then
    select least(100, greatest(40,
      60 + count(*) filter (where collaboration_type = 'strong') * 5
         - count(*) filter (where health_status = 'high_priority') * 6
    )) into v_cfi_score
    from public.app_portal_cfi_collaboration where company_id = p_company_id;
    v_count := v_count + 1;
  end if;

  if v_count = 0 then
    return jsonb_build_object(
      'benchmarking',60,'predictive',60,'scenario',60,'foresight',60,
      'opportunities',60,'forecasting',60,'readiness',60,'cfi',60,'overall',60);
  end if;

  return jsonb_build_object(
    'benchmarking',  greatest(v_benchmarking_score, 40),
    'predictive',    greatest(v_predictive_score, 40),
    'scenario',      greatest(v_scenario_score, 40),
    'foresight',     greatest(v_foresight_score, 40),
    'opportunities', greatest(v_opportunities_score, 40),
    'forecasting',   greatest(v_forecasting_score, 40),
    'readiness',     greatest(v_readiness_score, 40),
    'cfi',           greatest(v_cfi_score, 40),
    'overall', (
      greatest(v_benchmarking_score,40) +
      greatest(v_predictive_score,40) +
      greatest(v_scenario_score,40) +
      greatest(v_foresight_score,40) +
      greatest(v_opportunities_score,40) +
      greatest(v_forecasting_score,40) +
      greatest(v_readiness_score,40) +
      greatest(v_cfi_score,40)
    ) / 8
  );
end; $$;

-- -----------------------------------------------------------------------
-- Sync priorities from modules
-- -----------------------------------------------------------------------
create or replace function public._aeicc319_sync_priorities(p_company_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.app_portal_eicc_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  -- from Predictive Intelligence
  if to_regclass('public.app_portal_predictive_intelligence_predictions') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'pred-'||p.prediction_key,
      p.title,
      'predictive_intelligence',
      case p.potential_impact when 'critical' then 'critical' when 'high' then 'high'
                              when 'moderate' then 'medium' else 'low' end,
      p.category,
      p.time_horizon,
      coalesce((p.recommended_actions->>0), 'Review this prediction with leadership.')
    from public.app_portal_predictive_intelligence_predictions p
    where p.company_id = p_company_id
      and p.potential_impact in ('high','critical')
      and p.review_status = 'pending'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from Readiness Gaps
  if to_regclass('public.app_portal_enterprise_readiness_gaps') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'gap-'||g.gap_key,
      g.title,
      'enterprise_readiness',
      case g.impact_level when 'critical' then 'critical' when 'high' then 'high'
                          when 'moderate' then 'medium' else 'low' end,
      'readiness',
      '90_days',
      g.recommended_action
    from public.app_portal_enterprise_readiness_gaps g
    where g.company_id = p_company_id and g.status = 'identified'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from CFI Friction
  if to_regclass('public.app_portal_cfi_friction') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'fr-'||f.friction_key,
      f.title,
      'cross_functional_intelligence',
      case f.severity when 'critical' then 'critical' when 'high' then 'high'
                      when 'moderate' then 'medium' else 'low' end,
      'cross_functional',
      '90_days',
      f.recommended_action
    from public.app_portal_cfi_friction f
    where f.company_id = p_company_id and f.status = 'identified'
    on conflict (company_id, priority_key) do nothing;
  end if;

  -- from Strategic Opportunities
  if to_regclass('public.app_portal_strategic_opportunities') is not null then
    insert into public.app_portal_eicc_priorities
      (company_id, priority_key, title, source_module, priority_level, category,
       time_horizon, recommended_action)
    select
      p_company_id,
      'opp-'||o.opportunity_key,
      o.title,
      'strategic_opportunities',
      case o.strategic_priority when 'strategic' then 'high' when 'high' then 'high'
                                when 'moderate' then 'medium' else 'low' end,
      o.category,
      o.time_horizon,
      coalesce((o.suggested_next_steps->>0), 'Schedule exploratory session.')
    from public.app_portal_strategic_opportunities o
    where o.company_id = p_company_id and o.status = 'identified'
      and o.strategic_priority in ('strategic','high')
    on conflict (company_id, priority_key) do nothing;
  end if;

  if not exists (
    select 1 from public.app_portal_eicc_timeline t
    where t.company_id = p_company_id and t.event_type = 'eicc_initialized') then
    insert into public.app_portal_eicc_timeline
      (company_id, event_type, source_module, description, performed_by)
    values (p_company_id,'eicc_initialized','command_center',
            'Intelligence Command Center initialized', p_user_id);
  end if;
end; $$;

-- -----------------------------------------------------------------------
-- Generate briefing
-- -----------------------------------------------------------------------
create or replace function public._aeicc319_generate_briefing(
  p_company_id uuid, p_scores jsonb, p_period text
) returns jsonb language plpgsql as $$
declare
  v_overall integer := coalesce((p_scores->>'overall')::integer, 60);
  v_readiness integer := coalesce((p_scores->>'readiness')::integer, 60);
  v_cfi integer := coalesce((p_scores->>'cfi')::integer, 60);
  v_summary text;
  v_observations jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_reviews jsonb := '[]'::jsonb;
begin
  v_summary := case
    when v_overall >= 72 then
      'Current intelligence indicates strong organizational performance with opportunities for targeted improvement.'
    when v_readiness < 60 then
      'Current intelligence indicates growth readiness improvements are recommended before significant expansion.'
    when v_cfi < 55 then
      'Current intelligence indicates cross-functional alignment may benefit from leadership attention.'
    else
      'Current intelligence indicates stable organizational performance with emerging areas for strategic focus.'
  end;

  v_observations := jsonb_build_array(
    'Organizational readiness score: '||(p_scores->>'readiness'),
    'Cross-functional health score: '||(p_scores->>'cfi'),
    'Enterprise benchmarking score: '||(p_scores->>'benchmarking'),
    'Strategic opportunity score: '||(p_scores->>'opportunities')
  );

  v_actions := jsonb_build_array(
    'Review intelligence priorities with executive team',
    'Schedule strategic planning session',
    'Confirm readiness gap owners and review timelines'
  );

  v_reviews := jsonb_build_array(
    'Enterprise Readiness assessments',
    'Predictive Intelligence pending reviews',
    'Cross-functional dependency risks'
  );

  return jsonb_build_object(
    'period',p_period,'summary',v_summary,
    'key_observations',v_observations,
    'suggested_actions',v_actions,
    'review_items',v_reviews
  );
end; $$;

-- -----------------------------------------------------------------------
-- Main dashboard RPC
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_intelligence_command_center(
  p_category      text  default null,
  p_priority      text  default null,
  p_time_horizon  text  default null,
  p_department    text  default null,
  p_executive_owner text default null,
  p_review_status text  default null,
  p_search        text  default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_scores jsonb; v_priorities jsonb; v_overall integer;
  v_can_full boolean;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;
  v_can_full   := coalesce(v_ctx->>'can_full','false') = 'true';
  perform public._aeicc319_sync_priorities(v_company_id, v_user_id);
  v_scores := public._aeicc319_aggregate_scores(v_company_id);
  v_overall := coalesce((v_scores->>'overall')::integer, 60);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',p.id,'priority_key',p.priority_key,'title',p.title,
    'source_module',p.source_module,'priority_level',p.priority_level,
    'category',p.category,'time_horizon',p.time_horizon,
    'recommended_action',p.recommended_action,'review_status',p.review_status
  ) order by
    case p.priority_level when 'critical' then 1 when 'high' then 2
                          when 'medium' then 3 else 4 end,
    p.created_at desc),'[]'::jsonb)
  into v_priorities
  from public.app_portal_eicc_priorities p
  where p.company_id = v_company_id
    and (p_category     is null or p.category ilike '%'||trim(p_category)||'%')
    and (p_priority     is null or p.priority_level = p_priority)
    and (p_time_horizon is null or p.time_horizon = p_time_horizon)
    and (p_review_status is null or p.review_status = p_review_status)
    and (p_search       is null or trim(p_search) = ''
         or p.title ilike '%'||trim(p_search)||'%'
         or p.recommended_action ilike '%'||trim(p_search)||'%');

  return jsonb_build_object(
    'found',                       true,
    'can_full',                    v_can_full,
    'can_view',                    coalesce(v_ctx->>'can_view','false') = 'true',
    'can_review',                  coalesce(v_ctx->>'can_review','false') = 'true',
    'has_intelligence_data',       v_overall > 0,
    'enterprise_intelligence_score', v_overall,
    'executive_health_score',      coalesce((v_scores->>'foresight')::integer,60),
    'organizational_readiness_score', coalesce((v_scores->>'readiness')::integer,60),
    'strategic_opportunity_score', coalesce((v_scores->>'opportunities')::integer,60),
    'forecast_confidence_score',   coalesce((v_scores->>'forecasting')::integer,60),
    'collaboration_health_score',  coalesce((v_scores->>'cfi')::integer,60),
    'future_preparedness_score',   coalesce((v_scores->>'scenario')::integer,60),
    'module_scores',               v_scores,
    'executive_summary', case
      when v_overall >= 72 then
        'Current intelligence indicates strong organizational performance with opportunities for targeted improvement.'
      when (v_scores->>'readiness')::integer < 60 then
        'Current intelligence indicates growth readiness improvements are recommended before significant expansion.'
      when (v_scores->>'cfi')::integer < 55 then
        'Current intelligence indicates cross-functional alignment may benefit from leadership attention.'
      else
        'Current intelligence indicates stable organizational performance with emerging areas for strategic focus.'
    end,
    'key_observations', jsonb_build_array(
      'Enterprise readiness is at level '||(v_scores->>'readiness'),
      'Cross-functional health score: '||(v_scores->>'cfi'),
      'Strategic opportunity momentum: '||(v_scores->>'opportunities'),
      'Organizational forecast confidence: '||(v_scores->>'forecasting')
    ),
    'priorities',                  v_priorities,
    'outlook', jsonb_build_object(
      '30_days',  'Short-term priorities identified from readiness and predictive modules.',
      '90_days',  'Medium-term: governance reviews and workforce capacity alignment.',
      '6_months', 'Strategic opportunity exploration and readiness gap remediation.',
      '12_months','Leadership planning and organizational scaling preparation.',
      '24_months','Long-term organizational development and enterprise-readiness milestone.'
    ),
    'intelligence_sources', jsonb_build_array(
      jsonb_build_object('key','enterprise_benchmarking','label','Enterprise Benchmarking','score',v_scores->>'benchmarking','route','/app/intelligence/benchmarking'),
      jsonb_build_object('key','predictive_intelligence','label','Predictive Intelligence','score',v_scores->>'predictive','route','/app/intelligence/predictive'),
      jsonb_build_object('key','scenario_planning','label','Scenario Planning','score',v_scores->>'scenario','route','/app/intelligence/scenario-planning'),
      jsonb_build_object('key','executive_foresight','label','Executive Foresight','score',v_scores->>'foresight','route','/app/intelligence/executive-foresight'),
      jsonb_build_object('key','strategic_opportunities','label','Strategic Opportunities','score',v_scores->>'opportunities','route','/app/intelligence/strategic-opportunities'),
      jsonb_build_object('key','organizational_forecasting','label','Organizational Forecasting','score',v_scores->>'forecasting','route','/app/intelligence/organizational-forecasting'),
      jsonb_build_object('key','enterprise_readiness','label','Enterprise Readiness','score',v_scores->>'readiness','route','/app/intelligence/enterprise-readiness'),
      jsonb_build_object('key','cross_functional_intelligence','label','Cross-Functional Intelligence','score',v_scores->>'cfi','route','/app/intelligence/cross-functional-intelligence')
    ),
    'advisory_note',
      'The Intelligence Command Center aggregates insights from all intelligence modules — Aipify advises; leadership decides.',
    'principle',
      'One place for leadership visibility — high signal, low noise.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Briefing
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_intelligence_briefing(
  p_period text default 'this_week'
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_scores jsonb; v_briefing jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aeicc319_sync_priorities(v_company_id,(v_ctx->>'user_id')::uuid);
  v_scores  := public._aeicc319_aggregate_scores(v_company_id);
  v_briefing := public._aeicc319_generate_briefing(v_company_id, v_scores, coalesce(p_period,'this_week'));
  return jsonb_build_object('found',true,'briefing',v_briefing);
end; $$;

-- -----------------------------------------------------------------------
-- Priorities
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_intelligence_priorities(
  p_priority_level text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_priorities jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aeicc319_sync_priorities(v_company_id,(v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',p.id,'priority_key',p.priority_key,'title',p.title,
    'source_module',p.source_module,'priority_level',p.priority_level,
    'category',p.category,'recommended_action',p.recommended_action,
    'review_status',p.review_status
  ) order by
    case p.priority_level when 'critical' then 1 when 'high' then 2
                          when 'medium' then 3 else 4 end),'[]'::jsonb)
  into v_priorities
  from public.app_portal_eicc_priorities p
  where p.company_id = v_company_id
    and (p_priority_level is null or p.priority_level = p_priority_level);

  return jsonb_build_object('found',true,'priorities',v_priorities);
end; $$;

-- -----------------------------------------------------------------------
-- Timeline
-- -----------------------------------------------------------------------
create or replace function public.get_app_portal_intelligence_command_center_timeline(
  p_period_from date default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aeicc319_sync_priorities(v_company_id,(v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',t.id,'event_type',t.event_type,'source_module',t.source_module,
    'description',t.description,'created_at',t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_events
  from public.app_portal_eicc_timeline t
  where t.company_id = v_company_id
    and (p_period_from is null or t.created_at::date >= p_period_from)
  limit 30;

  return jsonb_build_object('found',true,'events',v_events);
end; $$;

-- -----------------------------------------------------------------------
-- Review
-- -----------------------------------------------------------------------
create or replace function public.review_app_portal_intelligence_command_center(
  p_priority_id  uuid   default null,
  p_action       text   default null,
  p_review_notes text   default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
begin
  v_ctx        := public._aeicc319_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id    := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action,'') = 'refresh' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Refreshing intelligence requires owner authorization or higher';
    end if;
    perform public._aeicc319_sync_priorities(v_company_id, v_user_id);
    insert into public.app_portal_eicc_timeline
      (company_id, event_type, source_module, description, performed_by)
    values (v_company_id,'intelligence_refreshed','command_center',
            'Intelligence Command Center refreshed', v_user_id);
    return jsonb_build_object('found',true,'message','Intelligence refreshed from all modules.');
  end if;

  if coalesce(p_action,'') = 'mark_reviewed' then
    if coalesce(v_ctx->>'can_review','false') <> 'true' then
      raise exception 'Marking review requires owner authorization or higher';
    end if;
    if p_priority_id is null then raise exception 'Priority id required'; end if;
    update public.app_portal_eicc_priorities set
      review_status = 'reviewed'
    where company_id = v_company_id and id = p_priority_id;
    insert into public.app_portal_eicc_timeline
      (company_id, event_type, source_module, description, performed_by)
    values (v_company_id,'priority_reviewed','command_center',
            coalesce(p_review_notes,'Priority reviewed'), v_user_id);
    return jsonb_build_object('found',true,'message','Priority marked as reviewed.');
  end if;

  raise exception 'Unknown action';
end; $$;

grant execute on function public._aeicc319_access_context()                                        to authenticated;
grant execute on function public.get_app_portal_intelligence_command_center(text,text,text,text,text,text,text) to authenticated;
grant execute on function public.get_app_portal_intelligence_briefing(text)                        to authenticated;
grant execute on function public.get_app_portal_intelligence_priorities(text)                      to authenticated;
grant execute on function public.get_app_portal_intelligence_command_center_timeline(date)         to authenticated;
grant execute on function public.review_app_portal_intelligence_command_center(uuid,text,text)     to authenticated;

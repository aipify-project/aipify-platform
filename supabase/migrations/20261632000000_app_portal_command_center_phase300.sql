-- Phase 300 (APP) — Aipify Business Operating System Command Center

create table if not exists public.app_portal_command_center_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  briefing_started_at timestamptz,
  admin_access_enabled boolean not null default false,
  manager_access_enabled boolean not null default false,
  last_briefing_at timestamptz,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_command_center_grants (
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  grant_type text not null check (grant_type in ('executive', 'administrator', 'manager')),
  granted_by uuid references public.users (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.app_portal_command_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_command_center_audit_idx
  on public.app_portal_command_center_audit_logs (company_id, created_at desc);

alter table public.app_portal_command_center_state enable row level security;
alter table public.app_portal_command_center_grants enable row level security;
alter table public.app_portal_command_center_audit_logs enable row level security;
revoke all on public.app_portal_command_center_state from authenticated, anon;
revoke all on public.app_portal_command_center_grants from authenticated, anon;
revoke all on public.app_portal_command_center_audit_logs from authenticated, anon;

create or replace function public._aboscc300_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
  v_company_id uuid;
  v_admin_enabled boolean := false;
  v_manager_enabled boolean := false;
  v_grant_type text;
  v_can_full boolean := false;
  v_can_limited boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  v_company_id := (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' then
    raise exception 'Command Center access requires leadership authorization';
  end if;

  select coalesce(cs.admin_access_enabled, false), coalesce(cs.manager_access_enabled, false)
  into v_admin_enabled, v_manager_enabled
  from public.app_portal_command_center_state cs where cs.company_id = v_company_id;

  select g.grant_type into v_grant_type
  from public.app_portal_command_center_grants g
  where g.company_id = v_company_id and g.user_id = v_user.id;

  if v_role = 'organization_owner' or v_grant_type = 'executive' then
    v_can_full := true;
    v_can_limited := true;
  elsif v_role = 'organization_admin' and (v_admin_enabled or v_grant_type = 'administrator') then
    v_can_full := true;
    v_can_limited := true;
  elsif v_role = 'organization_manager' and (v_manager_enabled or v_grant_type = 'manager') then
    v_can_limited := true;
  elsif v_role in ('organization_admin', 'organization_manager') then
    raise exception 'Command Center access requires explicit authorization';
  else
    raise exception 'Command Center access requires leadership authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_can_full,
    'can_limited', v_can_limited,
    'can_manage', v_can_full,
    'grant_type', coalesce(v_grant_type, v_role)
  );
end;
$$;

create or replace function public._aboscc300_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_strategy_on_track integer := 0;
  v_strategy_delayed integer := 0;
  v_momentum_score integer := 0;
  v_teams_accelerating integer := 0;
  v_initiatives_slowing integer := 0;
  v_bottlenecks integer := 0;
  v_resilience_score integer := 0;
  v_vulnerabilities integer := 0;
  v_continuity_active integer := 0;
  v_capacity_overloaded integer := 0;
  v_capacity_healthy integer := 0;
  v_risks_high integer := 0;
  v_risks_mitigated integer := 0;
  v_success_milestones integer := 0;
  v_adoption_score integer := 0;
  v_learning_score integer := 0;
  v_support_open integer := 0;
  v_decisions_pending integer := 0;
  v_commitments_due integer := 0;
  v_follow_critical integer := 0;
  v_metrics jsonb;
  v_initiatives jsonb;
  v_cs_metrics jsonb;
  v_cs_categories jsonb;
begin
  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    select count(*) filter (where s.status in ('active', 'on_track'))::int,
           count(*) filter (where s.status in ('delayed', 'needs_attention'))::int
    into v_strategy_on_track, v_strategy_delayed
    from public.app_portal_strategy_initiatives s where s.company_id = p_company_id;
  end if;

  if to_regprocedure('public._aome297_exec_metrics(uuid)') is not null then
    v_metrics := public._aome297_exec_metrics(p_company_id);
    v_initiatives := public._aome297_build_initiatives(p_company_id);
    v_momentum_score := coalesce((public._aome297_compute_score(v_metrics, v_initiatives, true)->>'momentum_score')::int, 0);
    select count(*) filter (where i->>'momentum_status' in ('accelerating', 'healthy'))::int,
           count(*) filter (where i->>'momentum_status' in ('slowing', 'stalled'))::int
    into v_teams_accelerating, v_initiatives_slowing
    from jsonb_array_elements(v_initiatives) i;
    if to_regprocedure('public._aome297_build_bottlenecks(jsonb, jsonb)') is not null then
      v_bottlenecks := jsonb_array_length(public._aome297_build_bottlenecks(v_metrics, v_initiatives));
    end if;
  end if;

  if to_regprocedure('public._aore298_resilience_metrics(uuid)') is not null then
    v_metrics := public._aore298_resilience_metrics(p_company_id);
    v_resilience_score := coalesce((
      public._aore298_compute_scores(
        v_metrics,
        public._aore298_build_areas(p_company_id, v_metrics),
        exists(select 1 from public.app_portal_resilience_state rs where rs.company_id = p_company_id and rs.review_started_at is not null)
      )->>'resilience_score'
    )::int, 0);
    v_vulnerabilities := jsonb_array_length(public._aore298_build_vulnerabilities(v_metrics, public._aore298_build_areas(p_company_id, v_metrics)));
    v_continuity_active := (v_metrics->>'continuity_active')::int;
  end if;

  if to_regclass('public.app_portal_capacity_records') is not null then
    select count(*) filter (where cr.status in ('overloaded', 'requires_review', 'approaching_limit'))::int,
           count(*) filter (where cr.status = 'healthy')::int
    into v_capacity_overloaded, v_capacity_healthy
    from public.app_portal_capacity_records cr where cr.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    select count(*) filter (where r.impact in ('major', 'critical') and r.status not in ('resolved', 'archived'))::int,
           count(*) filter (where r.status = 'resolved')::int
    into v_risks_high, v_risks_mitigated
    from public.app_portal_risks r where r.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_customer_success_milestones') is not null then
    select count(*)::int into v_success_milestones
    from public.app_portal_customer_success_milestones m where m.company_id = p_company_id;
  end if;

  if to_regprocedure('public._acsc295_org_metrics(uuid)') is not null then
    v_cs_metrics := public._acsc295_org_metrics(p_company_id);
    v_cs_categories := public._acsc295_category_scores(v_cs_metrics, true);
    v_adoption_score := round((
      (v_cs_categories->>'learning_completion')::numeric +
      (v_cs_categories->>'feature_adoption')::numeric +
      (v_cs_categories->>'user_engagement')::numeric +
      (v_cs_categories->>'operational_maturity')::numeric +
      (v_cs_categories->>'security_completion')::numeric +
      (v_cs_categories->>'integration_usage')::numeric
    ) / 6)::int;
  end if;

  if to_regclass('public.app_portal_academy_completions') is not null then
    select least(100, count(*)::int * 5) into v_learning_score
    from public.app_portal_academy_completions co where co.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_support_requests') is not null then
    select count(*) filter (where sr.status in ('open', 'in_review', 'waiting_for_customer'))::int
    into v_support_open
    from public.app_portal_support_requests sr where sr.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select count(*) filter (where d.status in ('proposed', 'under_review'))::int into v_decisions_pending
    from public.app_portal_decisions d where d.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    select count(*) filter (where c.due_date is not null and c.due_date <= current_date + 7
      and c.status in ('accepted', 'in_progress', 'at_risk'))::int into v_commitments_due
    from public.app_portal_commitments c where c.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select count(*) filter (where f.status = 'escalated' or f.priority = 'critical')::int into v_follow_critical
    from public.app_portal_follow_ups f where f.company_id = p_company_id and f.status <> 'completed';
  end if;

  return jsonb_build_object(
    'strategy_on_track', v_strategy_on_track,
    'strategy_delayed', v_strategy_delayed,
    'momentum_score', v_momentum_score,
    'teams_accelerating', v_teams_accelerating,
    'initiatives_slowing', v_initiatives_slowing,
    'bottlenecks', v_bottlenecks,
    'resilience_score', v_resilience_score,
    'vulnerabilities', v_vulnerabilities,
    'continuity_active', v_continuity_active,
    'capacity_overloaded', v_capacity_overloaded,
    'capacity_healthy', v_capacity_healthy,
    'risks_high', v_risks_high,
    'risks_mitigated', v_risks_mitigated,
    'success_milestones', v_success_milestones,
    'adoption_score', v_adoption_score,
    'learning_score', v_learning_score,
    'support_open', v_support_open,
    'decisions_pending', v_decisions_pending,
    'commitments_due', v_commitments_due,
    'follow_critical', v_follow_critical
  );
end;
$$;

create or replace function public._aboscc300_org_status(p_metrics jsonb)
returns text
language plpgsql
immutable
as $$
declare
  v_score integer;
begin
  v_score := round((
    (p_metrics->>'momentum_score')::int +
    (p_metrics->>'resilience_score')::int +
    (p_metrics->>'adoption_score')::int
  ) / 3.0)::int;

  if (p_metrics->>'risks_high')::int > 2 or (p_metrics->>'capacity_overloaded')::int > 2 then
    return 'critical_attention_required';
  end if;
  if v_score >= 80 then return 'thriving'; end if;
  if v_score >= 65 then return 'healthy'; end if;
  if v_score >= 45 then return 'stable'; end if;
  if v_score >= 25 then return 'requires_attention'; end if;
  return 'critical_attention_required';
end;
$$;

create or replace function public._aboscc300_build_briefing(p_metrics jsonb, p_status text)
returns jsonb
language plpgsql
stable
as $$
declare
  v_lines jsonb := '[]'::jsonb;
  v_closing_key text := 'focusPrioritiesToday';
begin
  v_lines := v_lines || jsonb_build_object('key', 'overallHealth', 'status', p_status);

  if (p_metrics->>'strategy_delayed')::int > 0 then
    v_lines := v_lines || jsonb_build_object('key', 'strategicInitiativesAttention', 'count', (p_metrics->>'strategy_delayed')::int);
  end if;
  if (p_metrics->>'vulnerabilities')::int > 0 then
    v_lines := v_lines || jsonb_build_object('key', 'resilienceVulnerability', 'count', (p_metrics->>'vulnerabilities')::int);
  end if;
  if (p_metrics->>'momentum_score')::int >= 55 then
    v_lines := v_lines || jsonb_build_object('key', 'momentumPositive', 'count', (p_metrics->>'teams_accelerating')::int);
  end if;

  return jsonb_build_object(
    'greeting_key', 'goodMorning',
    'lines', v_lines,
    'closing_key', v_closing_key
  );
end;
$$;

create or replace function public._aboscc300_build_priorities(p_company_id uuid, p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
begin
  if to_regclass('public.app_portal_decisions') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'id', 'dec-' || d.id, 'title', d.title, 'category', 'decision_attention',
          'priority', case d.impact_level when 'critical' then 'immediate_attention' else 'important' end
        ) as row
        from public.app_portal_decisions d
        where d.company_id = p_company_id and d.status in ('proposed', 'under_review')
        limit 5
      ) sub
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'id', 'str-' || s.id, 'title', s.title, 'category', 'strategic_at_risk',
          'priority', 'important'
        ) as row
        from public.app_portal_strategy_initiatives s
        where s.company_id = p_company_id and s.status in ('delayed', 'needs_attention')
        limit 5
      ) sub
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'id', 'com-' || c.id, 'title', c.title, 'category', 'executive_commitment',
          'priority', case c.priority when 'critical' then 'immediate_attention' else 'important' end
        ) as row
        from public.app_portal_commitments c
        where c.company_id = p_company_id and c.due_date <= current_date + 14
          and c.status in ('accepted', 'in_progress', 'at_risk')
        limit 5
      ) sub
    ), '[]'::jsonb);
  end if;

  if (p_metrics->>'follow_critical')::int > 0 and to_regclass('public.app_portal_follow_ups') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'id', 'fu-' || f.id, 'title', f.title, 'category', 'critical_follow_up',
          'priority', 'immediate_attention'
        ) as row
        from public.app_portal_follow_ups f
        where f.company_id = p_company_id and (f.status = 'escalated' or f.priority = 'critical')
        limit 5
      ) sub
    ), '[]'::jsonb);
  end if;

  return coalesce(v_items, '[]'::jsonb);
end;
$$;

create or replace function public._aboscc300_build_recommendations(p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
begin
  if (p_metrics->>'risks_high')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'risks', 'key', 'reviewCriticalRisks', 'priority', 'immediate_attention', 'type', 'risk');
  end if;
  if (p_metrics->>'strategy_delayed')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'delayed', 'key', 'addressDelayedInitiatives', 'priority', 'important', 'type', 'strategic');
  end if;
  if (p_metrics->>'teams_accelerating')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'celebrate', 'key', 'celebrateSuccessfulTeams', 'priority', 'opportunity', 'type', 'success');
  end if;
  if (p_metrics->>'capacity_overloaded')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'capacity', 'key', 'reviewCapacityPressures', 'priority', 'important', 'type', 'capacity');
  end if;
  if (p_metrics->>'vulnerabilities')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'resilience', 'key', 'monitorResilienceImprovements', 'priority', 'informational', 'type', 'resilience');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'milestones', 'key', 'scheduleStrategicMilestoneReviews', 'priority', 'informational', 'type', 'strategic');
  return v_recs;
end;
$$;

create or replace function public.begin_app_portal_command_center_briefing()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
begin
  v_ctx := public._aboscc300_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_command_center_state (
    company_id, briefing_started_at, last_briefing_at, updated_by
  ) values (v_company_id, now(), now(), v_user_id)
  on conflict (company_id) do update set
    briefing_started_at = coalesce(public.app_portal_command_center_state.briefing_started_at, now()),
    last_briefing_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_command_center_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'briefing_generated', 'Command Center briefing generated', v_user_id);

  return public.list_app_portal_command_center(null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_command_center(
  p_organizational_area text default null,
  p_priority text default null,
  p_period_from date default null,
  p_recommendation_type text default null,
  p_focus_category text default null,
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
  v_started timestamptz;
  v_can_full boolean;
  v_metrics jsonb;
  v_status text;
  v_priorities jsonb;
  v_recs jsonb;
  v_filtered_recs jsonb;
begin
  v_ctx := public._aboscc300_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';

  select cs.briefing_started_at into v_started
  from public.app_portal_command_center_state cs where cs.company_id = v_company_id;

  v_metrics := public._aboscc300_org_metrics(v_company_id);
  v_status := public._aboscc300_org_status(v_metrics);
  v_priorities := public._aboscc300_build_priorities(v_company_id, v_metrics);
  v_recs := public._aboscc300_build_recommendations(v_metrics);
  v_filtered_recs := v_recs;

  if p_priority is not null or p_recommendation_type is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_filtered_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_recommendation_type is null or r->>'type' = p_recommendation_type)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if p_focus_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(p), '[]'::jsonb) into v_priorities from (
      select p from jsonb_array_elements(v_priorities) p
      where (p_focus_category is null or p->>'category' = p_focus_category)
        and (p_search is null or trim(p_search) = '' or p->>'title' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_limited', coalesce(v_ctx->>'can_limited', 'false') = 'true',
    'briefing_started', v_started is not null,
    'companion_briefing', public._aboscc300_build_briefing(v_metrics, v_status),
    'organizational_status', v_status,
    'todays_priorities', v_priorities,
    'strategic_overview', jsonb_build_object(
      'on_track', (v_metrics->>'strategy_on_track')::int,
      'delayed', (v_metrics->>'strategy_delayed')::int,
      'milestones_achieved', (v_metrics->>'success_milestones')::int
    ),
    'momentum_overview', jsonb_build_object(
      'score', (v_metrics->>'momentum_score')::int,
      'teams_accelerating', (v_metrics->>'teams_accelerating')::int,
      'initiatives_slowing', (v_metrics->>'initiatives_slowing')::int,
      'bottlenecks', (v_metrics->>'bottlenecks')::int
    ),
    'resilience_overview', jsonb_build_object(
      'score', (v_metrics->>'resilience_score')::int,
      'vulnerabilities', (v_metrics->>'vulnerabilities')::int,
      'continuity_readiness', (v_metrics->>'continuity_active')::int
    ),
    'capacity_overview', jsonb_build_object(
      'teams_approaching_limits', (v_metrics->>'capacity_overloaded')::int,
      'healthy_distribution', (v_metrics->>'capacity_healthy')::int,
      'capacity_risks', (v_metrics->>'capacity_overloaded')::int
    ),
    'risk_overview', jsonb_build_object(
      'high_priority', (v_metrics->>'risks_high')::int,
      'recently_mitigated', (v_metrics->>'risks_mitigated')::int
    ),
    'success_overview', jsonb_build_object(
      'milestones_achieved', (v_metrics->>'success_milestones')::int,
      'high_performing', (v_metrics->>'teams_accelerating')::int
    ),
    'customer_health_overview', jsonb_build_object(
      'adoption_score', (v_metrics->>'adoption_score')::int,
      'learning_score', (v_metrics->>'learning_score')::int,
      'support_engagement', (v_metrics->>'support_open')::int
    ),
    'recommendations', v_filtered_recs,
    'principle', 'Aipify provides insights and awareness — organizational leaders remain responsible for decisions and execution.'
  );
end;
$$;

create or replace function public.get_app_portal_command_center_briefing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_metrics jsonb;
  v_status text;
begin
  v_ctx := public._aboscc300_access_context();
  v_metrics := public._aboscc300_org_metrics((v_ctx->>'company_id')::uuid);
  v_status := public._aboscc300_org_status(v_metrics);
  return jsonb_build_object(
    'found', true,
    'briefing', public._aboscc300_build_briefing(v_metrics, v_status),
    'organizational_status', v_status,
    'metrics', v_metrics
  );
end;
$$;

create or replace function public.list_app_portal_command_center_priorities(
  p_focus_category text default null,
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
  v_priorities jsonb;
begin
  v_ctx := public._aboscc300_access_context();
  v_priorities := public._aboscc300_build_priorities((v_ctx->>'company_id')::uuid, public._aboscc300_org_metrics((v_ctx->>'company_id')::uuid));

  if p_focus_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(p), '[]'::jsonb) into v_priorities from (
      select p from jsonb_array_elements(v_priorities) p
      where (p_focus_category is null or p->>'category' = p_focus_category)
        and (p_search is null or trim(p_search) = '' or p->>'title' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'priorities', v_priorities);
end;
$$;

create or replace function public.list_app_portal_command_center_recommendations(
  p_priority text default null,
  p_recommendation_type text default null,
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
  v_recs jsonb;
begin
  v_ctx := public._aboscc300_access_context();
  v_recs := public._aboscc300_build_recommendations(public._aboscc300_org_metrics((v_ctx->>'company_id')::uuid));

  if p_priority is not null or p_recommendation_type is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_recommendation_type is null or r->>'type' = p_recommendation_type)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end;
$$;

create or replace function public.list_app_portal_command_center_timeline(
  p_period_from date default null,
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
  v_items jsonb := '[]'::jsonb;
begin
  v_ctx := public._aboscc300_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_command_center_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from);

  if to_regclass('public.app_portal_decisions') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'id', 'dec-' || d.id, 'event_type', 'decision_recorded', 'description', d.title, 'created_at', d.decision_date
        ) as row
        from public.app_portal_decisions d
        where d.company_id = v_company_id and d.status in ('approved', 'implemented')
          and (p_period_from is null or d.decision_date::date >= p_period_from)
        order by d.decision_date desc
        limit 8
      ) sub
    ), '[]'::jsonb);
  end if;

  return jsonb_build_object('found', true, 'timeline', v_items);
end;
$$;

grant execute on function public.list_app_portal_command_center(text, text, date, text, text, text) to authenticated;
grant execute on function public.get_app_portal_command_center_briefing() to authenticated;
grant execute on function public.list_app_portal_command_center_priorities(text, text) to authenticated;
grant execute on function public.list_app_portal_command_center_recommendations(text, text, text) to authenticated;
grant execute on function public.list_app_portal_command_center_timeline(date, text) to authenticated;
grant execute on function public.begin_app_portal_command_center_briefing() to authenticated;

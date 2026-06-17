-- Phase 313 (APP Intelligence) — Scenario Planning & Simulation Center
-- Executive decision-support — distinct from Simulation Lab at /app/simulations (cross-link only).

create table if not exists public.app_portal_scenario_planning_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  manager_access_enabled boolean not null default false,
  admin_access_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_scenario_planning_scenarios (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  scenario_key text not null default '',
  title text not null default '',
  category text not null check (category in (
    'strategic', 'operational', 'capacity', 'market', 'governance', 'risk'
  )),
  scenario_type text not null default 'expected' check (scenario_type in (
    'best_case', 'expected', 'challenging', 'custom'
  )),
  summary text not null default '',
  assumptions jsonb not null default '[]'::jsonb,
  variables jsonb not null default '[]'::jsonb,
  projected_outcomes jsonb not null default '[]'::jsonb,
  organizational_area text not null default 'executive',
  planning_status text not null default 'draft' check (planning_status in (
    'draft', 'active', 'simulated', 'reviewed', 'archived'
  )),
  confidence_level text not null default 'exploratory' check (confidence_level in (
    'exploratory', 'moderate', 'high'
  )),
  time_horizon text not null default 'next_quarter' check (time_horizon in (
    'next_30_days', 'next_quarter', 'next_6_months', 'next_12_months'
  )),
  metadata jsonb not null default '{}'::jsonb,
  last_simulated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, scenario_key)
);

create index if not exists app_portal_scenario_planning_scenarios_idx
  on public.app_portal_scenario_planning_scenarios (
    company_id, category, scenario_type, planning_status, time_horizon
  );

create table if not exists public.app_portal_scenario_planning_simulations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  scenario_id uuid not null references public.app_portal_scenario_planning_scenarios (id) on delete cascade,
  simulation_key text not null default '',
  title text not null default '',
  summary text not null default '',
  outcome_summary text not null default '',
  risk_notes jsonb not null default '[]'::jsonb,
  opportunity_notes jsonb not null default '[]'::jsonb,
  simulation_status text not null default 'completed' check (simulation_status in ('pending', 'completed')),
  performed_by uuid references public.users (id) on delete set null,
  simulated_at timestamptz not null default now(),
  unique (company_id, simulation_key)
);

create index if not exists app_portal_scenario_planning_simulations_idx
  on public.app_portal_scenario_planning_simulations (company_id, scenario_id, simulated_at desc);

create table if not exists public.app_portal_scenario_planning_comparisons (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  comparison_key text not null default '',
  title text not null default '',
  scenario_ids jsonb not null default '[]'::jsonb,
  comparison_summary text not null default '',
  leadership_notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (company_id, comparison_key)
);

create table if not exists public.app_portal_scenario_planning_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  scenario_id uuid references public.app_portal_scenario_planning_scenarios (id) on delete set null,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_scenario_planning_timeline_idx
  on public.app_portal_scenario_planning_timeline (company_id, created_at desc);

create table if not exists public.app_portal_scenario_planning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  scenario_id uuid,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_scenario_planning_audit_idx
  on public.app_portal_scenario_planning_audit_logs (company_id, created_at desc);

alter table public.app_portal_scenario_planning_state enable row level security;
alter table public.app_portal_scenario_planning_scenarios enable row level security;
alter table public.app_portal_scenario_planning_simulations enable row level security;
alter table public.app_portal_scenario_planning_comparisons enable row level security;
alter table public.app_portal_scenario_planning_timeline enable row level security;
alter table public.app_portal_scenario_planning_audit_logs enable row level security;
revoke all on public.app_portal_scenario_planning_state from authenticated, anon;
revoke all on public.app_portal_scenario_planning_scenarios from authenticated, anon;
revoke all on public.app_portal_scenario_planning_simulations from authenticated, anon;
revoke all on public.app_portal_scenario_planning_comparisons from authenticated, anon;
revoke all on public.app_portal_scenario_planning_timeline from authenticated, anon;
revoke all on public.app_portal_scenario_planning_audit_logs from authenticated, anon;

create or replace function public._aspsc313_access_context()
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
  v_manager_enabled boolean := false;
  v_admin_enabled boolean := false;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(ps.manager_access_enabled, false), coalesce(ps.admin_access_enabled, false)
  into v_manager_enabled, v_admin_enabled
  from public.app_portal_scenario_planning_state ps
  where ps.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_owner' then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true,
      'can_simulate', true, 'can_compare', true, 'can_review', true
    );
  elsif v_role = 'organization_admin' and v_admin_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', true, 'can_manage', true, 'can_view', true,
      'can_simulate', true, 'can_compare', true, 'can_review', true
    );
  elsif v_role = 'organization_manager' and v_manager_enabled then
    return v_access || jsonb_build_object(
      'user_id', v_user.id, 'can_full', false, 'can_manage', false, 'can_view', true,
      'can_simulate', false, 'can_compare', false, 'can_review', false
    );
  end if;

  raise exception 'Scenario Planning access requires owner authorization or explicit grant';
end;
$$;

create or replace function public._aspsc313_scenario_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'best_case_growth', 'title', 'Best-case growth trajectory', 'category', 'strategic', 'type', 'best_case', 'area', 'executive', 'horizon', 'next_12_months', 'summary', 'Explores favorable market conditions, strong adoption, and accelerated strategic momentum.'),
    jsonb_build_object('key', 'expected_steady_state', 'title', 'Expected steady-state operations', 'category', 'operational', 'type', 'expected', 'area', 'operations', 'horizon', 'next_quarter', 'summary', 'Models continued operational performance with moderate growth and stable capacity.'),
    jsonb_build_object('key', 'challenging_market_pressure', 'title', 'Challenging market pressure', 'category', 'market', 'type', 'challenging', 'area', 'strategy', 'horizon', 'next_6_months', 'summary', 'Examines external pressure, slower demand, and tightened resource allocation.'),
    jsonb_build_object('key', 'capacity_expansion', 'title', 'Capacity expansion scenario', 'category', 'capacity', 'type', 'expected', 'area', 'operations', 'horizon', 'next_quarter', 'summary', 'Evaluates staffing, workload, and operational capacity under increased demand.'),
    jsonb_build_object('key', 'strategic_pivot', 'title', 'Strategic pivot exploration', 'category', 'strategic', 'type', 'custom', 'area', 'strategy', 'horizon', 'next_12_months', 'summary', 'Considers a meaningful shift in strategic priorities and resource reallocation.'),
    jsonb_build_object('key', 'governance_disruption', 'title', 'Governance review disruption', 'category', 'governance', 'type', 'challenging', 'area', 'governance', 'horizon', 'next_30_days', 'summary', 'Plans for delayed reviews, compliance backlog, or governance process friction.'),
    jsonb_build_object('key', 'operational_disruption', 'title', 'Operational disruption response', 'category', 'risk', 'type', 'challenging', 'area', 'operations', 'horizon', 'next_30_days', 'summary', 'Rehearses response to service disruption, integration failure, or workflow bottleneck.'),
    jsonb_build_object('key', 'business_pack_acceleration', 'title', 'Business Pack adoption acceleration', 'category', 'strategic', 'type', 'best_case', 'area', 'business_packs', 'horizon', 'next_6_months', 'summary', 'Explores rapid Business Pack adoption and expanded organizational capability.')
  );
$$;

create or replace function public._aspsc313_sync_scenarios(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_item jsonb;
begin
  insert into public.app_portal_scenario_planning_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  for v_item in select jsonb_array_elements(public._aspsc313_scenario_catalog())
  loop
    insert into public.app_portal_scenario_planning_scenarios (
      company_id, scenario_key, title, category, scenario_type, summary,
      organizational_area, time_horizon, assumptions, variables, projected_outcomes
    ) values (
      p_company_id,
      v_item->>'key',
      v_item->>'title',
      v_item->>'category',
      v_item->>'type',
      v_item->>'summary',
      v_item->>'area',
      v_item->>'horizon',
      jsonb_build_array('Leadership retains decision authority', 'Inputs reflect current organizational context'),
      jsonb_build_array('Demand', 'Capacity', 'Strategic priorities', 'External conditions'),
      jsonb_build_array('Operational readiness', 'Resource implications', 'Risk exposure', 'Opportunity window')
    )
    on conflict (company_id, scenario_key) do update set
      title = excluded.title,
      summary = excluded.summary,
      updated_at = now();
  end loop;

  if not exists (
    select 1 from public.app_portal_scenario_planning_timeline t
    where t.company_id = p_company_id and t.event_type = 'scenarios_initialized'
  ) then
    insert into public.app_portal_scenario_planning_timeline (
      company_id, event_type, description, performed_by
    ) values (
      p_company_id, 'scenarios_initialized', 'Scenario planning workspace initialized', p_user_id
    );
  end if;
end;
$$;

create or replace function public._aspsc313_scenario_card(p_row public.app_portal_scenario_planning_scenarios)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'scenario_key', p_row.scenario_key,
    'title', p_row.title,
    'category', p_row.category,
    'scenario_type', p_row.scenario_type,
    'summary', p_row.summary,
    'assumptions', p_row.assumptions,
    'variables', p_row.variables,
    'projected_outcomes', p_row.projected_outcomes,
    'organizational_area', p_row.organizational_area,
    'planning_status', p_row.planning_status,
    'confidence_level', p_row.confidence_level,
    'time_horizon', p_row.time_horizon,
    'last_simulated_at', p_row.last_simulated_at,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._aspsc313_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare v_recs jsonb := '[]'::jsonb;
begin
  if exists (select 1 from public.app_portal_scenario_planning_scenarios s where s.company_id = p_company_id and s.scenario_type = 'challenging' and s.planning_status = 'draft') then
    v_recs := v_recs || jsonb_build_object('id', 'ch-' || p_company_id, 'key', 'rehearseChallengingScenarios');
  end if;
  if exists (select 1 from public.app_portal_scenario_planning_scenarios s where s.company_id = p_company_id and s.category = 'capacity') then
    v_recs := v_recs || jsonb_build_object('id', 'cap-' || p_company_id, 'key', 'reviewCapacityScenarios');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'exec-' || p_company_id, 'key', 'scheduleExecutiveScenarioReview');
  v_recs := v_recs || jsonb_build_object('id', 'compare-' || p_company_id, 'key', 'compareBestExpectedChallenging');
  v_recs := v_recs || jsonb_build_object('id', 'simlab-' || p_company_id, 'key', 'crossLinkSimulationLab');
  return v_recs;
end;
$$;

create or replace function public._aspsc313_manager_categories()
returns text[]
language sql
immutable
as $$
  select array['operational', 'capacity']::text[];
$$;

create or replace function public.list_app_portal_scenario_planning(
  p_category text default null,
  p_scenario_type text default null,
  p_planning_status text default null,
  p_time_horizon text default null,
  p_organizational_area text default null,
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
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_scenarios jsonb := '[]'::jsonb; v_comparisons jsonb := '[]'::jsonb;
  v_row record; v_total integer := 0;
  v_priorities jsonb := '[]'::jsonb; v_risks jsonb := '[]'::jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();
  perform public._aspsc313_sync_scenarios(v_company_id, v_user_id);

  for v_row in
    select s.* from public.app_portal_scenario_planning_scenarios s
    where s.company_id = v_company_id
      and (v_can_full or s.category = any(v_manager_cats))
      and (p_category is null or s.category = p_category)
      and (p_scenario_type is null or s.scenario_type = p_scenario_type)
      and (p_planning_status is null or s.planning_status = p_planning_status)
      and (p_time_horizon is null or s.time_horizon = p_time_horizon)
      and (p_organizational_area is null or s.organizational_area = p_organizational_area)
      and (p_period_from is null or s.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or s.title ilike '%' || trim(p_search) || '%' or s.summary ilike '%' || trim(p_search) || '%')
    order by case s.scenario_type when 'challenging' then 1 when 'expected' then 2 when 'best_case' then 3 else 4 end, s.updated_at desc
  loop
    v_scenarios := v_scenarios || public._aspsc313_scenario_card(v_row);
    v_total := v_total + 1;
    if v_row.scenario_type in ('best_case', 'expected') and v_row.category in ('strategic', 'market') then
      v_priorities := v_priorities || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
    if v_row.scenario_type = 'challenging' or v_row.category = 'risk' then
      v_risks := v_risks || jsonb_build_object('id', v_row.id, 'title', v_row.title);
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'comparison_key', c.comparison_key, 'title', c.title,
    'comparison_summary', c.comparison_summary, 'scenario_ids', c.scenario_ids
  )), '[]'::jsonb)
  into v_comparisons
  from public.app_portal_scenario_planning_comparisons c
  where c.company_id = v_company_id and v_can_full;

  return jsonb_build_object(
    'found', true,
    'can_full', v_can_full,
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_compare', coalesce(v_ctx->>'can_compare', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_scenario_data', v_total > 0,
    'planning_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when jsonb_array_length(v_risks) > 0 then 'Several scenarios suggest areas worth executive rehearsal.'
      else 'Scenario portfolio supports proactive leadership planning.'
    end,
    'executive_summary', case
      when v_total = 0 then 'No scenarios are available yet.'
      when exists (select 1 from public.app_portal_scenario_planning_scenarios s where s.company_id = v_company_id and s.planning_status = 'simulated') then
        'Recent simulations provide leadership with comparative preparedness insights.'
      else 'Leadership can explore best, expected, and challenging futures before committing resources.'
    end,
    'strategic_priorities', v_priorities,
    'risk_scenarios', v_risks,
    'simulation_isolation_note', 'Simulations are isolated planning exercises — they do not change production systems or execute actions.',
    'simulation_lab_route', '/app/simulations',
    'scenarios', v_scenarios,
    'comparisons', v_comparisons,
    'recommendations', public._aspsc313_build_recommendations(v_company_id),
    'principle', 'Scenario planning supports thinking ahead — organizations retain full decision authority.'
  );
end;
$$;

create or replace function public.get_app_portal_scenario_planning_scenario(p_scenario_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_row record; v_sims jsonb;
  v_can_full boolean; v_manager_cats text[];
begin
  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_can_full := coalesce(v_ctx->>'can_full', 'false') = 'true';
  v_manager_cats := public._aspsc313_manager_categories();
  perform public._aspsc313_sync_scenarios(v_company_id, (v_ctx->>'user_id')::uuid);

  select s.* into v_row from public.app_portal_scenario_planning_scenarios s
  where s.company_id = v_company_id and s.id = p_scenario_id;
  if not found then return jsonb_build_object('found', false); end if;
  if not v_can_full and not (v_row.category = any(v_manager_cats)) then
    raise exception 'This scenario is outside your authorized scope';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sim.id, 'simulation_key', sim.simulation_key, 'title', sim.title,
    'summary', sim.summary, 'outcome_summary', sim.outcome_summary,
    'risk_notes', sim.risk_notes, 'opportunity_notes', sim.opportunity_notes,
    'simulated_at', sim.simulated_at
  ) order by sim.simulated_at desc), '[]'::jsonb)
  into v_sims
  from public.app_portal_scenario_planning_simulations sim
  where sim.company_id = v_company_id and sim.scenario_id = p_scenario_id;

  return public._aspsc313_scenario_card(v_row) || jsonb_build_object(
    'found', true,
    'can_simulate', coalesce(v_ctx->>'can_simulate', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'simulations', v_sims,
    'isolation_note', 'Simulation results are illustrative — humans decide whether and how to act.'
  );
end;
$$;

create or replace function public.get_app_portal_scenario_planning_timeline(
  p_scenario_id uuid default null,
  p_period_from date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_ctx jsonb; v_company_id uuid; v_events jsonb;
begin
  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._aspsc313_sync_scenarios(v_company_id, (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb) into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'scenario_id', t.scenario_id, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_scenario_planning_timeline t
    where t.company_id = v_company_id
      and (p_scenario_id is null or t.scenario_id = p_scenario_id)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc limit 25
  ) sub;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.review_app_portal_scenario_planning(
  p_scenario_id uuid default null,
  p_action text default null,
  p_review_notes text default null,
  p_scenario_ids uuid[] default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb; v_company_id uuid; v_user_id uuid;
  v_sim_id uuid; v_cmp_id uuid; v_row record;
  v_title text; v_outcome text; v_risk jsonb; v_opp jsonb;
begin
  v_ctx := public._aspsc313_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if coalesce(p_action, '') = 'initialize' then
    if coalesce(v_ctx->>'can_simulate', 'false') <> 'true' then
      raise exception 'Initializing scenarios requires owner authorization or higher';
    end if;
    perform public._aspsc313_sync_scenarios(v_company_id, v_user_id);
    insert into public.app_portal_scenario_planning_timeline (
      company_id, event_type, description, performed_by
    ) values (v_company_id, 'scenarios_refreshed', 'Scenario catalog refreshed', v_user_id);
    return jsonb_build_object('found', true, 'message', 'Scenario portfolio refreshed — all outputs remain advisory.');
  end if;

  if coalesce(p_action, '') = 'simulate' then
    if coalesce(v_ctx->>'can_simulate', 'false') <> 'true' then
      raise exception 'Running simulations requires owner authorization or higher';
    end if;
    if p_scenario_id is null then raise exception 'Scenario id required'; end if;
    select s.* into v_row from public.app_portal_scenario_planning_scenarios s
    where s.company_id = v_company_id and s.id = p_scenario_id;
    if not found then raise exception 'Scenario not found'; end if;

    v_title := 'Simulation — ' || v_row.title;
    v_outcome := case v_row.scenario_type
      when 'best_case' then 'Favorable conditions may accelerate outcomes — monitor capacity and governance readiness.'
      when 'challenging' then 'Pressure scenarios highlight resilience gaps — prepare contingency options without alarm.'
      else 'Expected trajectory remains manageable with proactive leadership attention.'
    end;
    v_risk := jsonb_build_array('Resource constraints under stress', 'Governance cadence may slip during disruption');
    v_opp := jsonb_build_array('Early rehearsal improves decision quality', 'Cross-functional alignment strengthens preparedness');

    insert into public.app_portal_scenario_planning_simulations (
      company_id, scenario_id, simulation_key, title, summary, outcome_summary,
      risk_notes, opportunity_notes, performed_by
    ) values (
      v_company_id, p_scenario_id, 'sim-' || p_scenario_id::text || '-' || extract(epoch from now())::bigint,
      v_title, 'Isolated simulation completed for leadership review.', v_outcome, v_risk, v_opp, v_user_id
    ) returning id into v_sim_id;

    update public.app_portal_scenario_planning_scenarios set
      planning_status = 'simulated', last_simulated_at = now(), updated_at = now()
    where company_id = v_company_id and id = p_scenario_id;

    insert into public.app_portal_scenario_planning_timeline (
      company_id, scenario_id, event_type, description, performed_by
    ) values (
      v_company_id, p_scenario_id, 'simulation_completed', 'Scenario simulation completed', v_user_id
    );

    return jsonb_build_object('found', true, 'simulation_id', v_sim_id, 'message', 'Simulation completed — results are illustrative only.');
  end if;

  if coalesce(p_action, '') = 'compare' then
    if coalesce(v_ctx->>'can_compare', 'false') <> 'true' then
      raise exception 'Scenario comparison requires owner authorization or higher';
    end if;
    if p_scenario_ids is null or array_length(p_scenario_ids, 1) < 2 then
      raise exception 'At least two scenario ids required for comparison';
    end if;

    insert into public.app_portal_scenario_planning_comparisons (
      company_id, comparison_key, title, scenario_ids, comparison_summary, leadership_notes, created_by
    ) values (
      v_company_id,
      'cmp-' || extract(epoch from now())::bigint,
      'Best / Expected / Challenging comparison',
      to_jsonb(p_scenario_ids),
      'Comparing scenarios reveals trade-offs between growth optimism, steady operations, and resilience under pressure.',
      coalesce(p_review_notes, ''),
      v_user_id
    ) returning id into v_cmp_id;

    insert into public.app_portal_scenario_planning_timeline (
      company_id, event_type, description, performed_by
    ) values (
      v_company_id, 'scenarios_compared', 'Leadership scenario comparison recorded', v_user_id
    );

    return jsonb_build_object('found', true, 'comparison_id', v_cmp_id, 'message', 'Scenario comparison recorded for executive review.');
  end if;

  if coalesce(p_action, '') = 'review' then
    if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
      raise exception 'Scenario review requires owner authorization or higher';
    end if;
    if p_scenario_id is null then raise exception 'Scenario id required'; end if;
    update public.app_portal_scenario_planning_scenarios set
      planning_status = 'reviewed', updated_at = now()
    where company_id = v_company_id and id = p_scenario_id;

    insert into public.app_portal_scenario_planning_timeline (
      company_id, scenario_id, event_type, description, performed_by
    ) values (
      v_company_id, p_scenario_id, 'scenario_reviewed', coalesce(p_review_notes, 'Scenario reviewed by leadership'), v_user_id
    );

    return jsonb_build_object('found', true, 'scenario_id', p_scenario_id, 'message', 'Scenario review recorded.');
  end if;

  raise exception 'Unknown action';
end;
$$;

grant execute on function public._aspsc313_access_context() to authenticated;
grant execute on function public.list_app_portal_scenario_planning(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_scenario_planning_scenario(uuid) to authenticated;
grant execute on function public.get_app_portal_scenario_planning_timeline(uuid, date) to authenticated;
grant execute on function public.review_app_portal_scenario_planning(uuid, text, text, uuid[]) to authenticated;

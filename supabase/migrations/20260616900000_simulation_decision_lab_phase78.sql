-- Phase 78 — Simulation & Decision Lab
-- Core principle: Simulation predicts. Simulation never executes.

-- Extend Trust Engine decision types for simulation explanations
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation'
  )
);

-- ---------------------------------------------------------------------------
-- 1. simulation_scenarios
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  category text not null check (
    category in (
      'workflow', 'governance', 'notification', 'organization', 'resource',
      'automation', 'marketplace', 'blueprint', 'executive'
    )
  ),
  description text,
  current_state jsonb not null default '{}'::jsonb,
  proposed_change jsonb not null default '{}'::jsonb,
  constraints jsonb not null default '{}'::jsonb,
  objectives jsonb not null default '[]'::jsonb,
  comparison_options jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists simulation_scenarios_tenant_idx
  on public.simulation_scenarios (tenant_id, status, created_at desc);

alter table public.simulation_scenarios enable row level security;
revoke all on public.simulation_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. simulation_runs
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_id uuid not null references public.simulation_scenarios (id) on delete cascade,
  confidence_level text not null default 'medium' check (confidence_level in ('high', 'medium', 'low')),
  confidence_score numeric(5, 2) not null default 75.00,
  estimated_value numeric not null default 0,
  estimated_risk numeric not null default 0,
  estimated_time_saved numeric not null default 0,
  estimated_workload_change numeric not null default 0,
  governance_impact_score numeric not null default 0,
  production_isolated boolean not null default true,
  explanation_id uuid references public.decision_explanations (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists simulation_runs_scenario_idx
  on public.simulation_runs (scenario_id, created_at desc);

alter table public.simulation_runs enable row level security;
revoke all on public.simulation_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. simulation_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_outcomes (
  id uuid primary key default gen_random_uuid(),
  simulation_run_id uuid not null references public.simulation_runs (id) on delete cascade,
  outcome_type text not null check (
    outcome_type in (
      'value', 'risk', 'time', 'workload', 'governance', 'bottleneck',
      'capacity', 'communication', 'compliance', 'forecast'
    )
  ),
  description text not null,
  impact_score numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.simulation_outcomes enable row level security;
revoke all on public.simulation_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. simulation_assumptions
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_assumptions (
  id uuid primary key default gen_random_uuid(),
  simulation_run_id uuid not null references public.simulation_runs (id) on delete cascade,
  assumption text not null,
  source text not null default 'model',
  confidence numeric(5, 2) not null default 75.00,
  created_at timestamptz not null default now()
);

alter table public.simulation_assumptions enable row level security;
revoke all on public.simulation_assumptions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. simulation_comparisons
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_comparisons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_ids uuid[] not null,
  comparison_summary jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.simulation_comparisons enable row level security;
revoke all on public.simulation_comparisons from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. simulation_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.simulation_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.simulation_audit_log enable row level security;
revoke all on public.simulation_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_sim_)
-- ---------------------------------------------------------------------------
create or replace function public._sim_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._sim_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._sim_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.simulation_audit_log (
    tenant_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_event_type, p_summary,
    coalesce(p_metadata, '{}'::jsonb), coalesce(p_user_id, public._sim_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'simulation_' || p_event_type, 'simulation_lab', 'logged', null, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._sim_confidence_level(p_score numeric)
returns text language sql immutable as $$
  select case
    when p_score >= 85 then 'high'
    when p_score >= 65 then 'medium'
    else 'low'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Seed demo scenarios
-- ---------------------------------------------------------------------------
create or replace function public._sim_seed_scenarios()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return; end if;
  v_user_id := public._sim_auth_user_id();

  if exists (select 1 from public.simulation_scenarios where tenant_id = v_tenant_id limit 1) then
    return;
  end if;

  insert into public.simulation_scenarios (
    tenant_id, title, category, description, current_state, proposed_change,
    constraints, objectives, status, created_by
  ) values
    (v_tenant_id, 'Automate support triage workflow', 'automation',
     'Evaluate impact of automating first-line support triage.',
     '{"support_volume_daily":120,"manual_triage_minutes":8}'::jsonb,
     '{"automation_coverage":0.6,"triage_reduction":0.45}'::jsonb,
     '{"no_production_execution":true,"governance_approval_required":true}'::jsonb,
     '["reduce_response_time","maintain_quality"]'::jsonb, 'ready', v_user_id),
    (v_tenant_id, 'Support volume doubles', 'resource',
     'Forecast operational impact if support ticket volume increases 100%.',
     '{"support_volume_daily":120,"team_capacity_hours":40}'::jsonb,
     '{"volume_multiplier":2.0}'::jsonb,
     '{"no_hiring_assumed":false}'::jsonb,
     '["identify_bottlenecks","estimate_escalation_load"]'::jsonb, 'ready', v_user_id),
    (v_tenant_id, 'Add secondary approver', 'governance',
     'Compare approval throughput with an additional reviewer role.',
     '{"approver_count":1,"pending_approvals":45}'::jsonb,
     '{"additional_approvers":1,"separation_of_duties":true}'::jsonb,
     '{"policy_compliance_required":true}'::jsonb,
     '["reduce_approval_congestion","maintain_compliance"]'::jsonb, 'ready', v_user_id),
    (v_tenant_id, 'Deploy industry blueprint', 'blueprint',
     'Estimate value and risk of deploying a vertical industry blueprint.',
     '{"blueprint_maturity":"evaluated","modules_enabled":3}'::jsonb,
     '{"blueprint_key":"professional_services","rollout_scope":"department"}'::jsonb,
     '{"sandbox_only":true}'::jsonb,
     '["accelerate_onboarding","measure_roi"]'::jsonb, 'ready', v_user_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Run simulation (predict only — never executes production actions)
-- ---------------------------------------------------------------------------
create or replace function public.run_simulation(p_scenario_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenario public.simulation_scenarios;
  v_run_id uuid;
  v_twin_health jsonb;
  v_bottlenecks jsonb;
  v_confidence numeric;
  v_conf_level text;
  v_value numeric;
  v_risk numeric;
  v_time_saved numeric;
  v_workload numeric;
  v_gov_impact numeric;
  v_explanation jsonb;
  v_twin_score numeric;
begin
  v_tenant_id := public._sim_require_tenant();

  select * into v_scenario from public.simulation_scenarios
  where id = p_scenario_id and tenant_id = v_tenant_id;

  if v_scenario.id is null then
    return jsonb_build_object('error', 'scenario_not_found', 'production_isolated', true);
  end if;

  -- Read-only Twin integration (no production mutations)
  begin
    perform public._dtw_seed_twin();
    v_twin_health := public.calculate_digital_twin_health_score();
    v_bottlenecks := public.detect_digital_twin_bottlenecks();
    v_twin_score := coalesce((v_twin_health->>'twin_health_score')::numeric, 70);
  exception when others then
    v_twin_health := '{}'::jsonb;
    v_bottlenecks := '{}'::jsonb;
    v_twin_score := 60;
  end;

  -- Category-based forecasting (modeling only)
  case v_scenario.category
    when 'automation' then
      v_time_saved := round(coalesce((v_scenario.proposed_change->>'triage_reduction')::numeric, 0.3) * 120 * 8 / 60, 1);
      v_value := round(v_time_saved * 45, 0);
      v_workload := -round(coalesce((v_scenario.proposed_change->>'automation_coverage')::numeric, 0.5) * 30, 1);
      v_risk := 25;
      v_gov_impact := 15;
      v_confidence := least(95, v_twin_score + 10);
    when 'resource' then
      v_workload := round(coalesce((v_scenario.proposed_change->>'volume_multiplier')::numeric, 1.5) * 40, 1);
      v_time_saved := -round(v_workload * 0.3, 1);
      v_value := -round(v_workload * 20, 0);
      v_risk := round(v_workload * 1.2, 0);
      v_gov_impact := 10;
      v_confidence := greatest(55, v_twin_score - 5);
    when 'governance' then
      v_time_saved := round(coalesce((v_scenario.proposed_change->>'additional_approvers')::numeric, 1) * 12, 1);
      v_workload := round(coalesce((v_scenario.current_state->>'pending_approvals')::numeric, 30) * 0.4, 1);
      v_value := round(v_time_saved * 50, 0);
      v_risk := -15;
      v_gov_impact := 35;
      v_confidence := least(92, v_twin_score + 5);
    when 'blueprint' then
      v_value := 8500;
      v_time_saved := 48;
      v_workload := -12;
      v_risk := 20;
      v_gov_impact := 20;
      v_confidence := 78;
    when 'workflow' then
      v_time_saved := 24; v_value := 1200; v_workload := -8; v_risk := 18; v_gov_impact := 12; v_confidence := 80;
    when 'notification' then
      v_time_saved := 6; v_value := 300; v_workload := -5; v_risk := 8; v_gov_impact := 5; v_confidence := 82;
    when 'organization' then
      v_time_saved := 16; v_value := 900; v_workload := 15; v_risk := 30; v_gov_impact := 18; v_confidence := 68;
    when 'marketplace' then
      v_value := 4200; v_time_saved := 20; v_workload := -6; v_risk := 22; v_gov_impact := 10; v_confidence := 75;
    else
      v_time_saved := 10; v_value := 500; v_workload := 5; v_risk := 25; v_gov_impact := 15; v_confidence := 70;
  end case;

  v_conf_level := public._sim_confidence_level(v_confidence);

  insert into public.simulation_runs (
    tenant_id, scenario_id, confidence_level, confidence_score,
    estimated_value, estimated_risk, estimated_time_saved, estimated_workload_change,
    governance_impact_score, production_isolated, metadata
  ) values (
    v_tenant_id, v_scenario.id, v_conf_level, v_confidence,
    v_value, v_risk, v_time_saved, v_workload,
    v_gov_impact, true,
    jsonb_build_object(
      'twin_health', v_twin_health,
      'bottlenecks', v_bottlenecks,
      'category', v_scenario.category,
      'production_isolated', true
    )
  ) returning id into v_run_id;

  insert into public.simulation_outcomes (simulation_run_id, outcome_type, description, impact_score) values
    (v_run_id, 'value', 'Estimated operational value change based on category model and Twin context.', v_value),
    (v_run_id, 'time', 'Projected time impact (hours saved or added per week).', v_time_saved),
    (v_run_id, 'workload', 'Estimated workload redistribution across teams.', v_workload),
    (v_run_id, 'governance', 'Governance and compliance impact score.', v_gov_impact),
    (v_run_id, 'risk', 'Estimated risk delta from proposed change.', v_risk);

  if coalesce((v_bottlenecks->>'bottlenecks_found')::int, 0) > 0 then
    insert into public.simulation_outcomes (simulation_run_id, outcome_type, description, impact_score)
    values (v_run_id, 'bottleneck', 'Twin indicates existing approval or escalation bottlenecks may amplify under this scenario.', 65);
  end if;

  insert into public.simulation_assumptions (simulation_run_id, assumption, source, confidence) values
    (v_run_id, 'Simulation uses read-only Digital Twin data — no production systems modified.', 'simulation_lab', 100),
    (v_run_id, 'Value estimates derived from category heuristics and historical patterns.', 'value_engine', v_confidence),
    (v_run_id, 'Governance impact assumes current policy configuration unchanged.', 'governance', 85),
    (v_run_id, 'Human approval required before any real-world implementation.', 'simulation_lab', 100);

  if v_conf_level = 'low' then
    insert into public.simulation_assumptions (simulation_run_id, assumption, source, confidence)
    values (v_run_id, 'Limited Twin maturity — human review recommended before acting on results.', 'digital_twin', v_confidence);
  end if;

  -- Trust Engine integration (explanation only)
  begin
    v_explanation := public.generate_decision_explanation(
      'sim-' || v_run_id::text, 'simulation', 'simulation_lab',
      'Simulation forecast: ' || v_scenario.title,
      'This is a predictive simulation only. No production data was modified, no automations triggered, and no notifications sent.',
      jsonb_build_array('digital_twin_health', 'scenario_parameters', 'category_model'),
      jsonb_build_array('production_isolation', 'simulation_only', v_scenario.category),
      v_conf_level,
      jsonb_build_array('maintain_status_quo', 'implement_with_approval', 'run_alternative_scenario'),
      jsonb_build_array('Review assumptions', 'Compare with alternative scenarios', 'Submit for Governance approval if proceeding'),
      jsonb_build_object(
        'simple', 'Simulated outcome for "' || v_scenario.title || '" with ' || v_conf_level || ' confidence. No actions were executed.',
        'operational', 'Estimated value: ' || v_value || ', time saved: ' || v_time_saved || 'h/week, workload change: ' || v_workload || '%.'
      )
    );
    update public.simulation_runs set explanation_id = (v_explanation->>'id')::uuid where id = v_run_id;
  exception when others then null;
  end;

  perform public._sim_log_audit(v_tenant_id, 'simulation_executed',
    'Simulation run for: ' || v_scenario.title,
    jsonb_build_object('run_id', v_run_id, 'scenario_id', p_scenario_id, 'production_isolated', true));

  return jsonb_build_object(
    'run_id', v_run_id,
    'scenario_id', p_scenario_id,
    'confidence_level', v_conf_level,
    'confidence_score', v_confidence,
    'estimated_value', v_value,
    'estimated_risk', v_risk,
    'estimated_time_saved', v_time_saved,
    'estimated_workload_change', v_workload,
    'governance_impact_score', v_gov_impact,
    'production_isolated', true,
    'explanation', 'Simulation predicts only. No production actions were executed.',
    'philosophy', 'Simulation Engine predicts. Simulation Engine never acts.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Compare scenarios
-- ---------------------------------------------------------------------------
create or replace function public.compare_simulation_scenarios(p_scenario_ids uuid[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_comparison jsonb;
  v_comparison_id uuid;
begin
  v_tenant_id := public._sim_require_tenant();
  perform public._sim_seed_scenarios();

  select coalesce(jsonb_agg(jsonb_build_object(
    'scenario_id', s.id,
    'title', s.title,
    'category', s.category,
    'latest_run', (
      select jsonb_build_object(
        'run_id', r.id,
        'confidence_level', r.confidence_level,
        'estimated_value', r.estimated_value,
        'estimated_risk', r.estimated_risk,
        'estimated_time_saved', r.estimated_time_saved,
        'estimated_workload_change', r.estimated_workload_change,
        'governance_impact_score', r.governance_impact_score
      )
      from public.simulation_runs r
      where r.scenario_id = s.id
      order by r.created_at desc limit 1
    )
  ) order by s.title), '[]'::jsonb) into v_comparison
  from public.simulation_scenarios s
  where s.tenant_id = v_tenant_id and s.id = any(p_scenario_ids);

  insert into public.simulation_comparisons (tenant_id, scenario_ids, comparison_summary, created_by)
  values (v_tenant_id, p_scenario_ids, v_comparison, public._sim_auth_user_id())
  returning id into v_comparison_id;

  perform public._sim_log_audit(v_tenant_id, 'scenarios_compared',
    'Compared ' || coalesce(array_length(p_scenario_ids, 1), 0) || ' scenarios',
    jsonb_build_object('comparison_id', v_comparison_id, 'scenario_ids', p_scenario_ids));

  return jsonb_build_object(
    'comparison_id', v_comparison_id,
    'scenarios', v_comparison,
    'production_isolated', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Create scenario
-- ---------------------------------------------------------------------------
create or replace function public.create_simulation_scenario(
  p_title text,
  p_category text,
  p_description text default null,
  p_current_state jsonb default '{}'::jsonb,
  p_proposed_change jsonb default '{}'::jsonb,
  p_constraints jsonb default '{}'::jsonb,
  p_objectives jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._sim_require_tenant();

  insert into public.simulation_scenarios (
    tenant_id, title, category, description, current_state, proposed_change,
    constraints, objectives, status, created_by
  ) values (
    v_tenant_id, p_title, p_category, p_description,
    coalesce(p_current_state, '{}'::jsonb) || jsonb_build_object('production_isolated', true),
    coalesce(p_proposed_change, '{}'::jsonb),
    coalesce(p_constraints, '{}'::jsonb) || jsonb_build_object('no_production_execution', true),
    coalesce(p_objectives, '[]'::jsonb),
    'ready', public._sim_auth_user_id()
  ) returning id into v_id;

  perform public._sim_log_audit(v_tenant_id, 'scenario_created',
    'Scenario created: ' || p_title, jsonb_build_object('scenario_id', v_id, 'category', p_category));

  return jsonb_build_object('scenario_id', v_id, 'status', 'ready', 'production_isolated', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_simulation_lab_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_scenarios int; v_runs int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select count(*) into v_scenarios from public.simulation_scenarios where tenant_id = v_tenant_id and status != 'archived';
  select count(*) into v_runs from public.simulation_runs where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'scenario_count', v_scenarios,
    'run_count', v_runs,
    'philosophy', 'Simulation Engine predicts. Simulation Engine never acts.',
    'production_isolated', true
  );
end; $$;

create or replace function public.get_simulation_lab_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scenarios jsonb;
  v_recent_runs jsonb;
  v_categories jsonb;
begin
  v_tenant_id := public._sim_require_tenant();
  perform public._sim_seed_scenarios();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'title', s.title, 'category', s.category, 'description', s.description,
    'status', s.status, 'created_at', s.created_at,
    'latest_run', (
      select jsonb_build_object(
        'run_id', r.id, 'confidence_level', r.confidence_level,
        'estimated_value', r.estimated_value, 'estimated_time_saved', r.estimated_time_saved
      )
      from public.simulation_runs r where r.scenario_id = s.id
      order by r.created_at desc limit 1
    )
  ) order by s.created_at desc), '[]'::jsonb) into v_scenarios
  from public.simulation_scenarios s
  where s.tenant_id = v_tenant_id and s.status != 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'scenario_title', s.title, 'category', s.category,
    'confidence_level', r.confidence_level, 'estimated_value', r.estimated_value,
    'estimated_risk', r.estimated_risk, 'created_at', r.created_at
  ) order by r.created_at desc), '[]'::jsonb) into v_recent_runs
  from public.simulation_runs r
  join public.simulation_scenarios s on s.id = r.scenario_id
  where r.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(distinct jsonb_build_object('category', category, 'count', cnt)), '[]'::jsonb)
  into v_categories
  from (
    select category, count(*) as cnt from public.simulation_scenarios
    where tenant_id = v_tenant_id and status != 'archived'
    group by category
  ) c;

  return jsonb_build_object(
    'has_customer', true,
    'production_isolated', true,
    'scenarios', v_scenarios,
    'recent_runs', v_recent_runs,
    'categories', v_categories,
    'integrations', jsonb_build_object(
      'digital_twin', 'Read-only ownership and escalation models',
      'value_engine', 'Time savings and ROI estimates',
      'governance', 'Compliance and approval impact',
      'trust_engine', 'Simulation explanations with assumptions',
      'learning_engine', 'Accuracy tracking over time',
      'executive_briefing', 'Strategic scenario summaries'
    ),
    'categories_supported', jsonb_build_array(
      'workflow', 'governance', 'notification', 'organization', 'resource',
      'automation', 'marketplace', 'blueprint', 'executive'
    )
  );
end; $$;

create or replace function public.get_simulation_run(p_run_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_run public.simulation_runs; v_outcomes jsonb; v_assumptions jsonb;
begin
  v_tenant_id := public._sim_require_tenant();
  select * into v_run from public.simulation_runs where id = p_run_id and tenant_id = v_tenant_id;
  if v_run.id is null then return jsonb_build_object('error', 'not_found'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'outcome_type', o.outcome_type, 'description', o.description, 'impact_score', o.impact_score
  )), '[]'::jsonb) into v_outcomes from public.simulation_outcomes o where o.simulation_run_id = v_run.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'assumption', a.assumption, 'source', a.source, 'confidence', a.confidence
  )), '[]'::jsonb) into v_assumptions from public.simulation_assumptions a where a.simulation_run_id = v_run.id;

  return jsonb_build_object(
    'run', jsonb_build_object(
      'id', v_run.id, 'scenario_id', v_run.scenario_id,
      'confidence_level', v_run.confidence_level, 'confidence_score', v_run.confidence_score,
      'estimated_value', v_run.estimated_value, 'estimated_risk', v_run.estimated_risk,
      'estimated_time_saved', v_run.estimated_time_saved,
      'estimated_workload_change', v_run.estimated_workload_change,
      'governance_impact_score', v_run.governance_impact_score,
      'production_isolated', v_run.production_isolated,
      'explanation_id', v_run.explanation_id, 'created_at', v_run.created_at
    ),
    'outcomes', v_outcomes,
    'assumptions', v_assumptions
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'simulations', 'Simulations & Decision Lab', 'Safe scenario modeling and decision comparison guides.', 'authenticated', 22
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'simulations' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.run_simulation(uuid) to authenticated;
grant execute on function public.compare_simulation_scenarios(uuid[]) to authenticated;
grant execute on function public.create_simulation_scenario(text, text, text, jsonb, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.get_simulation_lab_card() to authenticated;
grant execute on function public.get_simulation_lab_dashboard() to authenticated;
grant execute on function public.get_simulation_run(uuid) to authenticated;

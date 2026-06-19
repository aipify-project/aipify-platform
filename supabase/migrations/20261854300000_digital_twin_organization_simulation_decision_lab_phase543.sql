-- Phase 543 — Digital Twin, Organization Simulation & Decision Lab
-- Test before you risk. Simulate before you spend.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  digital_twin_enabled boolean not null default true,
  scenario_engine_enabled boolean not null default true,
  decision_lab_enabled boolean not null default true,
  learning_loop_enabled boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_simulation_operations_settings enable row level security;
revoke all on public.organization_simulation_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Organization twin model (operational model, not data copy)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_twin_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  model_domain text not null check (
    model_domain in (
      'employees', 'customers', 'projects', 'inventory', 'assets', 'suppliers',
      'finance', 'domains', 'business_packs', 'workflows', 'automation', 'operations'
    )
  ),
  title text not null,
  summary text not null default '',
  model_state jsonb not null default '{}'::jsonb,
  confidence_pct numeric(5,2) not null default 75,
  updated_at timestamptz not null default now(),
  unique (organization_id, model_domain, title)
);

create index if not exists organization_simulation_twin_models_org_idx
  on public.organization_simulation_twin_models (organization_id, model_domain);

alter table public.organization_simulation_twin_models enable row level security;
revoke all on public.organization_simulation_twin_models from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Scenarios
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null default '',
  scenario_type text not null check (
    scenario_type in (
      'hire_employees', 'expand_market', 'open_domain', 'launch_business_pack',
      'increase_marketing', 'reduce_costs', 'replace_supplier', 'add_warehouse',
      'merge_departments', 'partner_program', 'financial', 'workforce', 'customer',
      'inventory', 'domain', 'business_pack', 'partner', 'custom'
    )
  ),
  simulation_category text not null default 'operations' check (
    simulation_category in (
      'financial', 'workforce', 'customer', 'inventory', 'domain',
      'business_pack', 'partner', 'operations', 'strategic'
    )
  ),
  title text not null,
  description text not null default '',
  status text not null default 'draft' check (
    status in ('draft', 'ready', 'running', 'completed', 'archived')
  ),
  variables jsonb not null default '{}'::jsonb,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_simulation_scenarios_org_idx
  on public.organization_simulation_scenarios (organization_id, status, updated_at desc);

alter table public.organization_simulation_scenarios enable row level security;
revoke all on public.organization_simulation_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Simulation runs (forecasts & outputs)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_id uuid not null references public.organization_simulation_scenarios (id) on delete cascade,
  run_type text not null default 'expected' check (
    run_type in ('current_state', 'expected', 'best_case', 'worst_case', 'experiment')
  ),
  status text not null default 'completed' check (status in ('pending', 'running', 'completed', 'failed')),
  forecast jsonb not null default '{}'::jsonb,
  revenue_impact numeric(14,2),
  cost_impact numeric(14,2),
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  forecast_confidence_pct numeric(5,2) not null default 70,
  recommendations jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists organization_simulation_runs_org_idx
  on public.organization_simulation_runs (organization_id, scenario_id, started_at desc);

alter table public.organization_simulation_runs enable row level security;
revoke all on public.organization_simulation_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Scenario comparisons
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_comparisons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  comparison_title text not null,
  scenario_ids jsonb not null default '[]'::jsonb,
  comparison_matrix jsonb not null default '{}'::jsonb,
  winner_scenario_id uuid references public.organization_simulation_scenarios (id) on delete set null,
  summary text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organization_simulation_comparisons enable row level security;
revoke all on public.organization_simulation_comparisons from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Decision Lab options
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_decision_options (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_title text not null,
  option_label text not null,
  option_summary text not null default '',
  cost_estimate numeric(14,2),
  risk_level text not null default 'moderate',
  complexity text not null default 'moderate' check (complexity in ('low', 'moderate', 'high')),
  time_weeks int,
  expected_return_pct numeric(8,2),
  scenario_id uuid references public.organization_simulation_scenarios (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_simulation_decision_options enable row level security;
revoke all on public.organization_simulation_decision_options from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Learning loop (forecast vs actual)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_learning_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_id uuid references public.organization_simulation_scenarios (id) on delete set null,
  run_id uuid references public.organization_simulation_runs (id) on delete set null,
  forecast_summary text not null default '',
  actual_summary text not null default '',
  variance_pct numeric(8,2),
  decision_taken text,
  outcome text,
  lessons_learned text,
  recorded_at timestamptz not null default now()
);

alter table public.organization_simulation_learning_records enable row level security;
revoke all on public.organization_simulation_learning_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_simulation_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_simulation_operations_audit_org_idx
  on public.organization_simulation_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_simulation_operations_audit_logs enable row level security;
revoke all on public.organization_simulation_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._sim543_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._sim543_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_simulation_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._sim543_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_simulation_operations_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._sim543_scenario_json(r public.organization_simulation_scenarios)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'scenario_key', r.scenario_key, 'scenario_type', r.scenario_type,
    'simulation_category', r.simulation_category, 'title', r.title, 'description', r.description,
    'status', r.status, 'variables', r.variables, 'domain_id', r.domain_id,
    'business_pack_key', r.business_pack_key, 'created_at', r.created_at, 'updated_at', r.updated_at
  );
$$;

create or replace function public._sim543_run_forecast(
  p_scenario public.organization_simulation_scenarios
)
returns jsonb language plpgsql stable as $$
declare v_vars jsonb := coalesce(p_scenario.variables, '{}'::jsonb);
declare v_headcount int := coalesce((v_vars->>'headcount')::int, 10);
declare v_pct numeric := coalesce((v_vars->>'percent_change')::numeric, 15);
begin
  return case p_scenario.simulation_category
    when 'financial' then jsonb_build_object(
      'revenue', jsonb_build_object('change_pct', -v_pct, 'note', 'Modeled revenue sensitivity'),
      'costs', jsonb_build_object('change_pct', v_pct, 'note', 'Cost pressure modeled'),
      'profitability', jsonb_build_object('impact', case when v_pct > 10 then 'negative' else 'neutral' end),
      'cash_flow', jsonb_build_object('months_runway_delta', -2),
      'risk', 'moderate'
    )
    when 'workforce' then jsonb_build_object(
      'capacity', jsonb_build_object('change_pct', v_headcount * 8),
      'workload', jsonb_build_object('relief_pct', v_headcount * 5),
      'recruitment_needs', v_headcount,
      'training_needs', greatest(1, v_headcount / 3),
      'manager_load', jsonb_build_object('change_pct', v_headcount * 3)
    )
    when 'customer' then jsonb_build_object(
      'support_load', jsonb_build_object('change_pct', v_pct * 2),
      'revenue_impact', jsonb_build_object('change_pct', v_pct),
      'churn_risk', case when v_pct < 0 then 'elevated' else 'stable' end
    )
    when 'inventory' then jsonb_build_object(
      'stock_risk', case when v_pct > 20 then 'elevated' else 'moderate' end,
      'purchasing_needs', jsonb_build_object('change_pct', v_pct),
      'warehouse_capacity', jsonb_build_object('utilization_pct', 65 + v_pct)
    )
    when 'domain' then jsonb_build_object(
      'licenses_required', 1,
      'packs_affected', coalesce(p_scenario.business_pack_key, 'commerce_pack'),
      'employees_affected', v_headcount,
      'integrations_affected', jsonb_build_array('shopify', 'stripe')
    )
    when 'business_pack' then jsonb_build_object(
      'cost_monthly', 299,
      'users', v_headcount,
      'dependencies', jsonb_build_array('inventory_pack'),
      'training_hours', 8,
      'operational_impact', 'moderate positive'
    )
    when 'partner' then jsonb_build_object(
      'revenue', jsonb_build_object('change_pct', v_pct * 3),
      'commission_costs', jsonb_build_object('change_pct', v_pct * 2),
      'support_load', jsonb_build_object('change_pct', v_pct),
      'growth_potential', 'high'
    )
    else jsonb_build_object(
      'operational_impact', 'modeled',
      'confidence', 'moderate',
      'note', 'General operations simulation'
    )
  end;
end; $$;

create or replace function public._sim543_seed_simulation(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int; v_domain uuid;
  v_hire uuid; v_domain_sc uuid; v_fin uuid; v_pack uuid;
begin
  select count(*) into v_count from public.organization_simulation_scenarios where organization_id = p_org_id;
  if v_count > 2 then return v_count; end if;

  select id into v_domain from public.organization_domains
  where organization_id = p_org_id order by is_primary desc nulls last limit 1;

  insert into public.organization_simulation_twin_models (organization_id, model_domain, title, summary, confidence_pct)
  values
    (p_org_id, 'employees', 'Workforce model', 'Capacity, roles, and manager load across departments.', 78),
    (p_org_id, 'customers', 'Customer model', 'Growth, churn, and support demand patterns.', 72),
    (p_org_id, 'finance', 'Financial model', 'Revenue, costs, cash flow, and profitability drivers.', 75),
    (p_org_id, 'domains', 'Domain model', 'Domain licenses, packs, and integration footprint.', 80),
    (p_org_id, 'business_packs', 'Business Pack model', 'Installed packs, dependencies, and operational scope.', 77),
    (p_org_id, 'operations', 'Operations model', 'Workflows, automation, and cross-functional dependencies.', 74)
  on conflict do nothing;

  insert into public.organization_simulation_scenarios (
    organization_id, scenario_key, scenario_type, simulation_category, title, description, status, variables
  ) values
    (p_org_id, 'hire-10', 'hire_employees', 'workforce', 'Hire 10 Employees', 'Simulate hiring 10 employees across operations.', 'completed', '{"headcount":10}'::jsonb),
    (p_org_id, 'open-domain', 'open_domain', 'domain', 'Open New Domain butikk.no', 'Simulate adding commerce domain with pack requirements.', 'ready', '{"domain":"butikk.no"}'::jsonb),
    (p_org_id, 'payroll-20', 'financial', 'financial', 'Payroll increases 20%', 'What happens if payroll increases 20%?', 'completed', '{"percent_change":20}'::jsonb),
    (p_org_id, 'commerce-pack', 'launch_business_pack', 'business_pack', 'Install Commerce Pack', 'Forecast cost, users, dependencies, and training.', 'ready', '{"pack_key":"commerce_pack","headcount":25}'::jsonb),
    (p_org_id, 'partners-50', 'partner_program', 'partner', 'Add 50 Growth Partners', 'Simulate partner program expansion.', 'draft', '{"percent_change":50,"partner_count":50}'::jsonb)
  on conflict do nothing;

  select id into v_hire from public.organization_simulation_scenarios where organization_id = p_org_id and scenario_key = 'hire-10' limit 1;
  select id into v_domain_sc from public.organization_simulation_scenarios where organization_id = p_org_id and scenario_key = 'open-domain' limit 1;
  select id into v_fin from public.organization_simulation_scenarios where organization_id = p_org_id and scenario_key = 'payroll-20' limit 1;
  select id into v_pack from public.organization_simulation_scenarios where organization_id = p_org_id and scenario_key = 'commerce-pack' limit 1;

  if v_hire is not null then
    insert into public.organization_simulation_runs (
      organization_id, scenario_id, run_type, forecast, revenue_impact, cost_impact, risk_level, forecast_confidence_pct, recommendations, risks, completed_at
    ) values
      (p_org_id, v_hire, 'expected', public._sim543_run_forecast((select s from public.organization_simulation_scenarios s where s.id = v_hire)),
       120000, 850000, 'moderate', 72,
       '["Phase hiring over 2 quarters","Prioritize manager capacity","Plan onboarding training"]'::jsonb,
       '["Recruitment timeline","Manager overload"]'::jsonb, now());
  end if;

  if v_fin is not null then
    insert into public.organization_simulation_runs (
      organization_id, scenario_id, run_type, forecast, revenue_impact, cost_impact, risk_level, forecast_confidence_pct, completed_at
    ) values
      (p_org_id, v_fin, 'expected', public._sim543_run_forecast((select s from public.organization_simulation_scenarios s where s.id = v_fin)),
       -50000, 200000, 'high', 68, now()),
      (p_org_id, v_fin, 'worst_case', '{"profitability":{"impact":"negative"},"cash_flow":{"months_runway_delta":-4}}'::jsonb,
       -120000, 250000, 'critical', 55, now());
  end if;

  insert into public.organization_simulation_decision_options (
    organization_id, decision_title, option_label, option_summary, cost_estimate, risk_level, complexity, time_weeks, expected_return_pct, scenario_id
  ) values
    (p_org_id, 'Scale support capacity', 'Option A — Hire 5 employees', 'Add 5 support staff to handle growth.', 450000, 'moderate', 'moderate', 12, 8, v_hire),
    (p_org_id, 'Scale support capacity', 'Option B — Automate workflow', 'Invest in automation to reduce manual load.', 120000, 'low', 'high', 8, 15, null)
  on conflict do nothing;

  insert into public.organization_simulation_learning_records (
    organization_id, forecast_summary, actual_summary, variance_pct, decision_taken, outcome, lessons_learned
  ) values
    (p_org_id, 'Support surge forecast +40% load', 'Actual support load +32%', 8, 'Hired 3 staff ahead of forecast', 'Positive — avoided backlog', 'Model slightly overestimated surge duration')
  on conflict do nothing;

  select count(*) into v_count from public.organization_simulation_scenarios where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public.search_simulation_scenarios(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('simulation_operations.view');
  v_org_id := public._sim543_org();
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._sim543_scenario_json(s) order by s.updated_at desc)
      from (
        select * from public.organization_simulation_scenarios
        where organization_id = v_org_id
          and (p_query is null or trim(p_query) = ''
            or title ilike '%' || p_query || '%'
            or scenario_type ilike '%' || p_query || '%'
            or simulation_category ilike '%' || p_query || '%')
        order by updated_at desc limit greatest(p_limit, 1)
      ) s
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Simulation Center
-- ---------------------------------------------------------------------------
create or replace function public.get_simulation_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_active int;
begin
  perform public._irp_require_permission('simulation_operations.view');
  v_org_id := public._sim543_org();
  perform public._sim543_ensure_settings(v_org_id);
  perform public._sim543_seed_simulation(v_org_id);

  select count(*) into v_active from public.organization_simulation_scenarios
  where organization_id = v_org_id and status in ('ready', 'running', 'completed');

  perform public._sim543_log(v_org_id, 'center_view', 'Digital Twin Center viewed', 'overview',
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Test before you risk. Simulate before you spend. Understand before you decide.',
    'philosophy', 'The Digital Twin is not a copy of data — it is a model of how the organization operates.',
    'overview', jsonb_build_object(
      'scenario_count', (select count(*) from public.organization_simulation_scenarios where organization_id = v_org_id),
      'active_simulations', v_active,
      'run_count', (select count(*) from public.organization_simulation_runs where organization_id = v_org_id),
      'decision_options', (select count(*) from public.organization_simulation_decision_options where organization_id = v_org_id),
      'learning_records', (select count(*) from public.organization_simulation_learning_records where organization_id = v_org_id)
    ),
    'organization_twin', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'model_domain', m.model_domain, 'title', m.title, 'summary', m.summary,
        'confidence_pct', m.confidence_pct, 'updated_at', m.updated_at
      ) order by m.model_domain)
      from public.organization_simulation_twin_models m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'twin_understands', jsonb_build_array(
      'employees', 'customers', 'projects', 'inventory', 'assets', 'suppliers',
      'finance', 'domains', 'business_packs', 'workflows', 'automation', 'operations'
    ),
    'scenarios', coalesce((
      select jsonb_agg(public._sim543_scenario_json(s) order by s.updated_at desc)
      from (select * from public.organization_simulation_scenarios where organization_id = v_org_id order by updated_at desc limit 30) s
    ), '[]'::jsonb),
    'forecasts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'scenario_id', r.scenario_id, 'run_type', r.run_type,
        'forecast', r.forecast, 'revenue_impact', r.revenue_impact, 'cost_impact', r.cost_impact,
        'risk_level', r.risk_level, 'forecast_confidence_pct', r.forecast_confidence_pct,
        'recommendations', r.recommendations, 'risks', r.risks, 'completed_at', r.completed_at,
        'scenario_title', s.title
      ) order by r.started_at desc)
      from public.organization_simulation_runs r
      join public.organization_simulation_scenarios s on s.id = r.scenario_id
      where r.organization_id = v_org_id limit 25
    ), '[]'::jsonb),
    'experiments', coalesce((
      select jsonb_agg(public._sim543_scenario_json(s))
      from public.organization_simulation_scenarios s
      where s.organization_id = v_org_id and s.status in ('ready', 'draft')
    ), '[]'::jsonb),
    'comparisons', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'comparison_title', c.comparison_title, 'summary', c.summary,
        'comparison_matrix', c.comparison_matrix, 'created_at', c.created_at
      ) order by c.created_at desc)
      from public.organization_simulation_comparisons c where c.organization_id = v_org_id limit 15
    ), '[]'::jsonb),
    'decision_lab', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'decision_title', d.decision_title, 'option_label', d.option_label,
        'option_summary', d.option_summary, 'cost_estimate', d.cost_estimate,
        'risk_level', d.risk_level, 'complexity', d.complexity, 'time_weeks', d.time_weeks,
        'expected_return_pct', d.expected_return_pct, 'scenario_id', d.scenario_id
      ) order by d.decision_title, d.option_label)
      from public.organization_simulation_decision_options d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulation_workflow', jsonb_build_array(
      'current_state', 'scenario_created', 'variables_changed', 'simulation_run',
      'forecast_generated', 'comparison_generated', 'decision_support'
    ),
    'financial_simulations', jsonb_build_array(
      'Payroll increases 20%', 'Revenue drops 15%', 'Supplier costs increase', 'Open another division'
    ),
    'workforce_simulations', jsonb_build_array(
      'Hire employees', 'Lose key employees', 'Workload increases', 'Department growth continues'
    ),
    'risk_integration', jsonb_build_object(
      'engines', jsonb_build_array('risk', 'governance', 'finance', 'strategic_intelligence'),
      'identifies', jsonb_build_array('risks', 'dependencies', 'bottlenecks', 'compliance', 'resource_constraints')
    ),
    'scenario_comparison_engine', jsonb_build_object(
      'supports', jsonb_build_array('side_by_side', 'current_state', 'best_case', 'expected_case', 'worst_case')
    ),
    'executive_simulation_center', jsonb_build_object(
      'top_risks', coalesce((
        select jsonb_agg(r.risks) from public.organization_simulation_runs r
        where r.organization_id = v_org_id and r.risk_level in ('high', 'critical') limit 5
      ), '[]'::jsonb),
      'decision_confidence', 72,
      'forecast_confidence', 68,
      'companion_recommendations', jsonb_build_array(
        'Run domain simulation before purchasing additional licenses.',
        'Compare hire vs automate options in Decision Lab before committing budget.',
        'Review learning loop variance to improve forecast accuracy.'
      )
    ),
    'simulation_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'scenario_id', s.id, 'title', s.title, 'status', s.status,
        'created_at', s.created_at, 'category', s.simulation_category
      ) order by s.created_at desc)
      from public.organization_simulation_scenarios s where s.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'learning_loop', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'forecast_summary', l.forecast_summary, 'actual_summary', l.actual_summary,
        'variance_pct', l.variance_pct, 'decision_taken', l.decision_taken,
        'outcome', l.outcome, 'lessons_learned', l.lessons_learned, 'recorded_at', l.recorded_at
      ) order by l.recorded_at desc)
      from public.organization_simulation_learning_records l where l.organization_id = v_org_id limit 15
    ), '[]'::jsonb),
    'business_pack_integration', jsonb_build_object(
      'examples', jsonb_build_array(
        jsonb_build_object('pack', 'finance', 'models', jsonb_build_array('Financial Models')),
        jsonb_build_object('pack', 'warehouse', 'models', jsonb_build_array('Inventory Models')),
        jsonb_build_object('pack', 'support', 'models', jsonb_build_array('Support Models')),
        jsonb_build_object('pack', 'partner', 'models', jsonb_build_array('Growth Models'))
      )
    ),
    'companion_advisor', jsonb_build_object(
      'prompts', jsonb_build_array(
        'Simulate opening a new domain.',
        'Simulate adding 100 users.',
        'Compare supplier options.',
        'What is the risk of delaying this project?',
        'Which scenario produces the best outcome?'
      )
    ),
    'reports', jsonb_build_object(
      'scenario_count', (select count(*) from public.organization_simulation_scenarios where organization_id = v_org_id),
      'runs_completed', (select count(*) from public.organization_simulation_runs where organization_id = v_org_id and status = 'completed'),
      'avg_forecast_confidence', (select round(avg(forecast_confidence_pct)) from public.organization_simulation_runs where organization_id = v_org_id),
      'learning_records', (select count(*) from public.organization_simulation_learning_records where organization_id = v_org_id)
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_simulation_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'organization_twin', 'scenarios', 'forecasts', 'experiments', 'comparisons', 'decision_lab', 'reports', 'executive'
    ),
    'routes', jsonb_build_object(
      'simulation', '/app/simulation',
      'scenarios', '/app/simulation/scenarios',
      'decision_lab', '/app/simulation/decision-lab',
      'digital_twin_legacy', '/app/intelligence/digital-twin',
      'simulations_legacy', '/app/simulations'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_simulation_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_scenario_id uuid;
  v_scenario public.organization_simulation_scenarios;
  v_run_id uuid;
  v_forecast jsonb;
begin
  v_org_id := public._sim543_org();
  perform public._sim543_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('create_scenario', 'run_simulation', 'generate_comparison', 'record_learning') then
    perform public._irp_require_permission('simulation_operations.manage');
  else
    perform public._irp_require_permission('simulation_operations.view');
  end if;

  if p_action_type = 'create_scenario' then
    insert into public.organization_simulation_scenarios (
      organization_id, scenario_key, scenario_type, simulation_category, title, description, status, variables, domain_id, business_pack_key, created_by_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'scenario_key', gen_random_uuid()::text),
      coalesce(p_payload->>'scenario_type', 'custom'),
      coalesce(p_payload->>'simulation_category', 'operations'),
      coalesce(p_payload->>'title', 'New scenario'),
      coalesce(p_payload->>'description', ''),
      'draft',
      coalesce(p_payload->'variables', '{}'::jsonb),
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      v_user_id
    ) returning id into v_scenario_id;
    perform public._sim543_log(v_org_id, 'scenario_created', 'Scenario created', 'scenarios',
      jsonb_build_object('scenario_id', v_scenario_id) || p_payload);
    return jsonb_build_object('ok', true, 'scenario_id', v_scenario_id);

  elsif p_action_type = 'run_simulation' then
    v_scenario_id := (p_payload->>'scenario_id')::uuid;
    select * into v_scenario from public.organization_simulation_scenarios where id = v_scenario_id and organization_id = v_org_id;
    if v_scenario.id is null then return jsonb_build_object('ok', false, 'error', 'scenario_not_found'); end if;

    v_forecast := public._sim543_run_forecast(v_scenario);
    insert into public.organization_simulation_runs (
      organization_id, scenario_id, run_type, status, forecast, revenue_impact, cost_impact,
      risk_level, forecast_confidence_pct, recommendations, completed_at
    ) values (
      v_org_id, v_scenario_id, coalesce(p_payload->>'run_type', 'expected'), 'completed', v_forecast,
      nullif(p_payload->>'revenue_impact', '')::numeric,
      nullif(p_payload->>'cost_impact', '')::numeric,
      coalesce(p_payload->>'risk_level', 'moderate'),
      coalesce((p_payload->>'forecast_confidence_pct')::numeric, 70),
      coalesce(p_payload->'recommendations', '[]'::jsonb),
      now()
    ) returning id into v_run_id;

    update public.organization_simulation_scenarios set status = 'completed', updated_at = now() where id = v_scenario_id;
    perform public._sim543_log(v_org_id, 'simulation_executed', 'Simulation run completed', 'forecasts', p_payload);
    perform public._sim543_log(v_org_id, 'forecast_generated', 'Forecast generated', 'forecasts', jsonb_build_object('run_id', v_run_id));
    return jsonb_build_object('ok', true, 'run_id', v_run_id, 'forecast', v_forecast);

  elsif p_action_type = 'generate_comparison' then
    insert into public.organization_simulation_comparisons (
      organization_id, comparison_title, scenario_ids, comparison_matrix, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'comparison_title', 'Scenario comparison'),
      coalesce(p_payload->'scenario_ids', '[]'::jsonb),
      coalesce(p_payload->'comparison_matrix', '{}'::jsonb),
      coalesce(p_payload->>'summary', 'Side-by-side scenario comparison generated.')
    ) returning id into v_run_id;
    perform public._sim543_log(v_org_id, 'comparison_generated', 'Comparison generated', 'comparisons', p_payload);
    return jsonb_build_object('ok', true, 'comparison_id', v_run_id);

  elsif p_action_type = 'record_learning' then
    insert into public.organization_simulation_learning_records (
      organization_id, scenario_id, run_id, forecast_summary, actual_summary, variance_pct, decision_taken, outcome, lessons_learned
    ) values (
      v_org_id,
      nullif(p_payload->>'scenario_id', '')::uuid,
      nullif(p_payload->>'run_id', '')::uuid,
      coalesce(p_payload->>'forecast_summary', ''),
      coalesce(p_payload->>'actual_summary', ''),
      nullif(p_payload->>'variance_pct', '')::numeric,
      p_payload->>'decision_taken',
      p_payload->>'outcome',
      p_payload->>'lessons_learned'
    ) returning id into v_run_id;
    perform public._sim543_log(v_org_id, 'learning_recorded', 'Learning loop record added', 'learning', p_payload);
    return jsonb_build_object('ok', true, 'learning_id', v_run_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_simulation_context(p_query text default null, p_scenario_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb;
begin
  perform public._irp_require_permission('simulation_operations.view');
  v_center := public.get_simulation_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_simulation_scenarios(p_query, 15);
  end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps leaders explore the future before committing resources.',
    'query', p_query, 'scenario_id', p_scenario_id,
    'center', v_center, 'search', v_search,
    'companion_prompts', v_center->'companion_advisor'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_simulation_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('simulation_operations.view');
  v_center := public.get_simulation_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('simulation_operations.manage', public._sim543_org()),
    'overview', v_center->'overview',
    'executive_simulation_center', v_center->'executive_simulation_center',
    'scenarios', v_center->'scenarios',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('simulation', '/app/simulation'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'simulation_operations', 'Digital Twin & Organization Simulation', 'simulation-operations', 'companion',
    'Simulate decisions, forecast outcomes, test scenarios and understand consequences before acting.',
    'business', null, 'main', '/app/simulation', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('simulation_operations', 'simulation_operations.view', 'view', 'Simulation — view digital twin, scenarios, and forecasts'),
  ('simulation_operations', 'simulation_operations.manage', 'manage', 'Simulation — create scenarios, run simulations, and record learning')
on conflict do nothing;

grant execute on function public._sim543_scenario_json(public.organization_simulation_scenarios) to authenticated;
grant execute on function public._sim543_run_forecast(public.organization_simulation_scenarios) to authenticated;
grant execute on function public._sim543_seed_simulation(uuid) to authenticated;
grant execute on function public.search_simulation_scenarios(text, int) to authenticated;
grant execute on function public.get_simulation_operations_center(text) to authenticated;
grant execute on function public.perform_simulation_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_simulation_context(text, uuid) to authenticated;
grant execute on function public.get_my_simulation_summary() to authenticated;

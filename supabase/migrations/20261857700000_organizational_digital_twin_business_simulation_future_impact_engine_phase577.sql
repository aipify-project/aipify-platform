-- Phase 577 — Organizational Digital Twin, Business Simulation & Future Impact Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/digital-twin-center (distinct from legacy /app/digital-twin and /app/simulation)
-- Helpers: _cmdt577_*

create table if not exists public.organization_companion_digital_twin_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  digital_twin_enabled boolean not null default true,
  scenario_simulation_enabled boolean not null default true,
  impact_analysis_enabled boolean not null default true,
  what_if_workspace_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_digital_twin_settings enable row level security;
revoke all on public.organization_companion_digital_twin_settings from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  model_key text not null,
  model_title text not null,
  model_type text not null check (
    model_type in (
      'department', 'process', 'project', 'customer', 'partner',
      'workflow', 'business_pack', 'resource', 'custom'
    )
  ),
  model_status text not null default 'active' check (
    model_status in ('active', 'draft', 'archived')
  ),
  coverage_score numeric(5,2) not null default 0 check (coverage_score between 0 and 100),
  owner_name text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, model_key)
);

alter table public.organization_companion_digital_twin_models enable row level security;
revoke all on public.organization_companion_digital_twin_models from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  scenario_type text not null check (
    scenario_type in (
      'growth', 'risk', 'financial', 'operational', 'expansion', 'market', 'custom'
    )
  ),
  scenario_status text not null default 'draft' check (
    scenario_status in ('draft', 'ready', 'simulated', 'archived')
  ),
  confidence_score numeric(5,2) not null default 0 check (confidence_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, scenario_key)
);

alter table public.organization_companion_digital_twin_scenarios enable row level security;
revoke all on public.organization_companion_digital_twin_scenarios from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  forecast_type text not null check (
    forecast_type in ('growth', 'revenue', 'cost', 'capacity', 'risk', 'custom')
  ),
  forecast_value numeric(12,2) not null default 0,
  forecast_period text not null default '12 months',
  confidence_score numeric(5,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, forecast_key)
);

alter table public.organization_companion_digital_twin_forecasts enable row level security;
revoke all on public.organization_companion_digital_twin_forecasts from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_impacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  impact_key text not null,
  impact_title text not null,
  impact_type text not null check (
    impact_type in (
      'revenue', 'cost', 'risk', 'operational', 'resource',
      'customer', 'partner', 'custom'
    )
  ),
  impact_direction text not null default 'neutral' check (
    impact_direction in ('positive', 'negative', 'neutral', 'mixed')
  ),
  impact_magnitude text not null default 'moderate' check (
    impact_magnitude in ('low', 'moderate', 'high', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, impact_key)
);

alter table public.organization_companion_digital_twin_impacts enable row level security;
revoke all on public.organization_companion_digital_twin_impacts from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_experiments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  experiment_key text not null,
  experiment_title text not null,
  experiment_type text not null check (
    experiment_type in ('what_if', 'capacity', 'allocation', 'risk', 'growth', 'custom')
  ),
  experiment_status text not null default 'draft' check (
    experiment_status in ('draft', 'running', 'completed', 'archived')
  ),
  projection_summary text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, experiment_key)
);

alter table public.organization_companion_digital_twin_experiments enable row level security;
revoke all on public.organization_companion_digital_twin_experiments from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_capacity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capacity_key text not null,
  capacity_title text not null,
  capacity_type text not null check (
    capacity_type in (
      'team', 'department', 'resource', 'inventory',
      'support', 'partner', 'custom'
    )
  ),
  current_capacity numeric(12,2) not null default 0,
  projected_demand numeric(12,2) not null default 0,
  capacity_gap numeric(12,2) not null default 0,
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capacity_key)
);

alter table public.organization_companion_digital_twin_capacity enable row level security;
revoke all on public.organization_companion_digital_twin_capacity from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  allocation_key text not null,
  allocation_title text not null,
  allocation_type text not null check (
    allocation_type in ('budget', 'staff', 'project', 'partner', 'technology', 'custom')
  ),
  current_allocation jsonb not null default '{}'::jsonb,
  optimal_allocation jsonb not null default '{}'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, allocation_key)
);

alter table public.organization_companion_digital_twin_allocations enable row level security;
revoke all on public.organization_companion_digital_twin_allocations from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_decision_previews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  preview_key text not null,
  decision_title text not null,
  expected_benefits text not null default '',
  expected_risks text not null default '',
  expected_costs text not null default '',
  expected_timeline text not null default '',
  confidence_score numeric(5,2) not null default 0 check (confidence_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, preview_key)
);

alter table public.organization_companion_digital_twin_decision_previews enable row level security;
revoke all on public.organization_companion_digital_twin_decision_previews from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  forecast_data jsonb not null default '[]'::jsonb,
  operational_data jsonb not null default '[]'::jsonb,
  capacity_data jsonb not null default '[]'::jsonb,
  risk_data jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_digital_twin_business_packs enable row level security;
revoke all on public.organization_companion_digital_twin_business_packs from authenticated, anon;

create table if not exists public.organization_companion_digital_twin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'digital_twin' check (
    audit_category in (
      'scenario', 'simulation', 'forecast', 'impact', 'risk', 'decision', 'digital_twin'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_digital_twin_audit_logs_org_idx
  on public.organization_companion_digital_twin_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_digital_twin_audit_logs enable row level security;
revoke all on public.organization_companion_digital_twin_audit_logs from authenticated, anon;

create or replace function public._cmdt577_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmdt577_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'digital_twin'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_digital_twin_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'digital_twin'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmdt577_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_digital_twin_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmdt577_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_digital_twin_models where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_digital_twin_models (
    organization_id, model_key, model_title, model_type, coverage_score, owner_name, summary
  ) values
    (p_org_id, 'mod_support', 'Support Operations', 'process', 78, 'Support Lead', 'Living operational model — Support processes.'),
    (p_org_id, 'mod_finance', 'Finance Department', 'department', 82, 'CFO', 'Department twin — financial workflows.'),
    (p_org_id, 'mod_nordic', 'Nordic Market Expansion', 'project', 65, 'Project Lead', 'Project model in organizational twin.'),
    (p_org_id, 'mod_support_pack', 'Support Pack', 'business_pack', 85, 'Support Lead', 'Business Pack integrated into twin.');

  insert into public.organization_companion_digital_twin_scenarios (
    organization_id, scenario_key, scenario_title, scenario_type, scenario_status, confidence_score, summary
  ) values
    (p_org_id, 'scn_hire_10', 'Hire 10 Employees', 'growth', 'ready', 72,
     'Growth scenario — Companion simulates outcomes before execution.'),
    (p_org_id, 'scn_new_market', 'Open New Market — Sweden', 'expansion', 'ready', 68,
     'Expansion scenario — market entry simulation.'),
    (p_org_id, 'scn_marketing', 'Increase Marketing Budget 25%', 'financial', 'simulated', 75,
     'Financial scenario — revenue and cost impact estimated.'),
    (p_org_id, 'scn_supplier', 'Replace Primary Supplier', 'operational', 'draft', 60,
     'Operational scenario — supply chain risk simulation.'),
    (p_org_id, 'scn_support_double', 'Support Volume Doubles', 'operational', 'ready', 70,
     'What if support volume doubles? — capacity gap analysis.');

  insert into public.organization_companion_digital_twin_forecasts (
    organization_id, forecast_key, forecast_title, forecast_type, forecast_value, forecast_period, confidence_score, summary
  ) values
    (p_org_id, 'fc_growth', 'Growth Forecast — Nordic', 'growth', 18.5, '12 months', 72,
     'Growth modeling — new market entry potential.'),
    (p_org_id, 'fc_revenue', 'Revenue Forecast Q3-Q4', 'revenue', 2400000, '6 months', 78,
     'Revenue forecast from scenario simulation.'),
    (p_org_id, 'fc_capacity', 'Support Capacity Forecast', 'capacity', 85, '3 months', 70,
     'Capacity forecast — projected demand vs current capacity.');

  insert into public.organization_companion_digital_twin_impacts (
    organization_id, impact_key, impact_title, impact_type, impact_direction, impact_magnitude, summary
  ) values
    (p_org_id, 'imp_revenue_hire', 'Revenue Impact — Hire 10', 'revenue', 'positive', 'moderate',
     'Impact analysis — revenue impact from hiring scenario.'),
    (p_org_id, 'imp_cost_marketing', 'Cost Impact — Marketing Increase', 'cost', 'negative', 'moderate',
     'Cost impact estimated before budget approval.'),
    (p_org_id, 'imp_risk_supplier', 'Risk Impact — Supplier Change', 'risk', 'negative', 'high',
     'Risk impact — supplier replacement simulation (Phase 567 Resilience).'),
    (p_org_id, 'imp_customer_expansion', 'Customer Impact — Sweden Entry', 'customer', 'positive', 'high',
     'Customer impact — new market customer acquisition forecast.'),
    (p_org_id, 'imp_ops_support', 'Operational Impact — Support Doubling', 'operational', 'negative', 'critical',
     'Operational impact — support volume doubles scenario.');

  insert into public.organization_companion_digital_twin_experiments (
    organization_id, experiment_key, experiment_title, experiment_type, experiment_status, projection_summary, summary
  ) values
    (p_org_id, 'exp_whatif_support', 'What if support volume doubles?', 'what_if', 'completed',
     'Capacity gap of 22% — hire 3 support staff or automate triage.',
     'What-If Workspace experiment — Companion generates projections.'),
    (p_org_id, 'exp_whatif_revenue', 'What if revenue drops 20%?', 'what_if', 'ready',
     'Cost reduction of 12% required — defer 2 projects.',
     'What if revenue drops 20%? — financial stress simulation.'),
    (p_org_id, 'exp_whatif_employee', 'What if key employee leaves?', 'what_if', 'draft',
     'Knowledge dependency risk — escalation owner gap identified.',
     'What if a key employee leaves? — people dependency simulation.'),
    (p_org_id, 'exp_risk_cyber', 'Cyber Incident Simulation', 'risk', 'completed',
     '72-hour recovery estimate — customer communication plan required.',
     'Risk simulation — cyber incident impact (Resilience Engine).');

  insert into public.organization_companion_digital_twin_capacity (
    organization_id, capacity_key, capacity_title, capacity_type, current_capacity, projected_demand, capacity_gap, recommendation, summary
  ) values
    (p_org_id, 'cap_support', 'Support Team Capacity', 'support', 100, 122, 22,
     'Hire 3 support staff or deploy automation triage by Q3.',
     'Current Capacity → Projected Demand → Capacity Gap → Recommendation.'),
    (p_org_id, 'cap_engineering', 'Engineering Team', 'team', 100, 95, -5,
     'Capacity sufficient — reallocate 1 engineer to automation project.',
     'Team capacity modeling — engineering headroom available.');

  insert into public.organization_companion_digital_twin_allocations (
    organization_id, allocation_key, allocation_title, allocation_type, current_allocation, optimal_allocation, summary
  ) values
    (p_org_id, 'alloc_budget', 'Budget Allocation Q3', 'budget',
     '{"marketing":30,"support":25,"engineering":35,"operations":10}'::jsonb,
     '{"marketing":25,"support":30,"engineering":35,"operations":10}'::jsonb,
     'Resource allocation — shift budget to support given capacity gap.'),
    (p_org_id, 'alloc_staff', 'Staff Allocation — Projects', 'staff',
     '{"project_a":4,"project_b":3,"support":6}'::jsonb,
     '{"project_a":3,"project_b":2,"support":8}'::jsonb,
     'Staff allocation simulation — optimal distribution identified.');

  insert into public.organization_companion_digital_twin_decision_previews (
    organization_id, preview_key, decision_title, expected_benefits, expected_risks, expected_costs, expected_timeline, confidence_score, summary
  ) values
    (p_org_id, 'prev_sweden', 'Sweden Market Entry Decision',
     'Nordic revenue +18%, partner pipeline expansion',
     'Regulatory compliance, localization cost overrun',
     '€420K setup + €85K/month operational',
     '9-12 months to break-even', 68,
     'Decision Impact Preview — Phase 573 integration before approval.'),
    (p_org_id, 'prev_hire', 'Hire 10 Employees Decision',
     'Delivery capacity +40%, reduced burnout risk',
     'Onboarding time, training investment',
     '€680K annual payroll',
     '3 months ramp-up', 75,
     'Leadership gains visibility before approval.');

  insert into public.organization_companion_digital_twin_business_packs (
    organization_id, pack_key, pack_title, forecast_data, operational_data, capacity_data, risk_data, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack',
     '["Revenue forecast","Cost projection"]'::jsonb, '["Budget workflows"]'::jsonb,
     '[]'::jsonb, '["Financial risk models"]'::jsonb, 'Finance Pack → Financial Forecasts.'),
    (p_org_id, 'support', 'Support Pack',
     '["Ticket volume forecast"]'::jsonb, '["Support workflows"]'::jsonb,
     '["Support capacity model"]'::jsonb, '["Escalation risk"]'::jsonb, 'Support Pack → Support Simulations.'),
    (p_org_id, 'warehouse', 'Warehouse Pack',
     '[]'::jsonb, '["Inventory operations"]'::jsonb,
     '["Inventory capacity"]'::jsonb, '["Supplier risk"]'::jsonb, 'Warehouse Pack → Inventory Simulations.');
end; $$;

create or replace function public.get_organization_companion_digital_twin_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_models jsonb; v_scenarios jsonb;
  v_forecasts jsonb; v_impacts jsonb; v_experiments jsonb; v_capacity jsonb;
  v_allocations jsonb; v_decision_previews jsonb; v_packs jsonb; v_executive jsonb;
  v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmdt577_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmdt577_ensure_settings(v_org_id);
  perform public._cmdt577_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_models', (select count(*) from public.organization_companion_digital_twin_models where organization_id = v_org_id),
    'active_scenarios', (select count(*) from public.organization_companion_digital_twin_scenarios where organization_id = v_org_id and scenario_status in ('ready', 'simulated')),
    'forecasts', (select count(*) from public.organization_companion_digital_twin_forecasts where organization_id = v_org_id),
    'impact_analyses', (select count(*) from public.organization_companion_digital_twin_impacts where organization_id = v_org_id),
    'experiments', (select count(*) from public.organization_companion_digital_twin_experiments where organization_id = v_org_id),
    'capacity_models', (select count(*) from public.organization_companion_digital_twin_capacity where organization_id = v_org_id),
    'decision_previews', (select count(*) from public.organization_companion_digital_twin_decision_previews where organization_id = v_org_id),
    'avg_confidence', coalesce((select round(avg(confidence_score)) from public.organization_companion_digital_twin_scenarios where organization_id = v_org_id), 0)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'model_key', m.model_key, 'model_title', m.model_title, 'model_type', m.model_type,
    'model_status', m.model_status, 'coverage_score', m.coverage_score,
    'owner_name', m.owner_name, 'summary', m.summary
  ) order by m.model_type), '[]'::jsonb)
  into v_models from public.organization_companion_digital_twin_models m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'scenario_key', s.scenario_key, 'scenario_title', s.scenario_title,
    'scenario_type', s.scenario_type, 'scenario_status', s.scenario_status,
    'confidence_score', s.confidence_score, 'summary', s.summary
  ) order by s.confidence_score desc), '[]'::jsonb)
  into v_scenarios from public.organization_companion_digital_twin_scenarios s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'forecast_key', f.forecast_key, 'forecast_title', f.forecast_title,
    'forecast_type', f.forecast_type, 'forecast_value', f.forecast_value,
    'forecast_period', f.forecast_period, 'confidence_score', f.confidence_score, 'summary', f.summary
  ) order by f.forecast_title), '[]'::jsonb)
  into v_forecasts from public.organization_companion_digital_twin_forecasts f where f.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'impact_key', i.impact_key, 'impact_title', i.impact_title,
    'impact_type', i.impact_type, 'impact_direction', i.impact_direction,
    'impact_magnitude', i.impact_magnitude, 'summary', i.summary
  ) order by case i.impact_magnitude when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_impacts from public.organization_companion_digital_twin_impacts i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'experiment_key', e.experiment_key, 'experiment_title', e.experiment_title,
    'experiment_type', e.experiment_type, 'experiment_status', e.experiment_status,
    'projection_summary', e.projection_summary, 'summary', e.summary
  ) order by e.experiment_title), '[]'::jsonb)
  into v_experiments from public.organization_companion_digital_twin_experiments e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'capacity_key', c.capacity_key, 'capacity_title', c.capacity_title,
    'capacity_type', c.capacity_type, 'current_capacity', c.current_capacity,
    'projected_demand', c.projected_demand, 'capacity_gap', c.capacity_gap,
    'recommendation', c.recommendation, 'summary', c.summary
  ) order by c.capacity_gap desc), '[]'::jsonb)
  into v_capacity from public.organization_companion_digital_twin_capacity c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'allocation_key', a.allocation_key, 'allocation_title', a.allocation_title,
    'allocation_type', a.allocation_type, 'current_allocation', a.current_allocation,
    'optimal_allocation', a.optimal_allocation, 'summary', a.summary
  ) order by a.allocation_title), '[]'::jsonb)
  into v_allocations from public.organization_companion_digital_twin_allocations a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'preview_key', dp.preview_key, 'decision_title', dp.decision_title,
    'expected_benefits', dp.expected_benefits, 'expected_risks', dp.expected_risks,
    'expected_costs', dp.expected_costs, 'expected_timeline', dp.expected_timeline,
    'confidence_score', dp.confidence_score, 'summary', dp.summary
  ) order by dp.decision_title), '[]'::jsonb)
  into v_decision_previews from public.organization_companion_digital_twin_decision_previews dp where dp.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'forecast_data', bp.forecast_data, 'operational_data', bp.operational_data,
    'capacity_data', bp.capacity_data, 'risk_data', bp.risk_data, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_digital_twin_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'growth_forecasts', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('title', forecast_title, 'value', forecast_value) as x
      from public.organization_companion_digital_twin_forecasts where organization_id = v_org_id and forecast_type = 'growth'
    ) t),
    'risk_forecasts', v_impacts,
    'capacity_forecasts', v_capacity,
    'scenario_results', v_scenarios,
    'decision_simulations', v_decision_previews,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Address support capacity gap before expansion', 'reason', '22% capacity gap under support doubling scenario'),
      jsonb_build_object('title', 'Review Sweden entry decision preview', 'reason', '68% confidence — regulatory risk needs mitigation'),
      jsonb_build_object('title', 'Run supplier replacement simulation', 'reason', 'High risk impact identified — simulation draft ready')
    )
  ) into v_executive;

  select jsonb_build_object(
    'simulation_advisor_prompts', jsonb_build_array(
      'What happens if we expand?', 'What happens if we hire?',
      'What happens if costs increase?', 'What happens if support volume doubles?',
      'Generate simulation briefing.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'what_if_experiments', v_experiments,
    'capacity_modeling', v_capacity,
    'resource_allocations', v_allocations
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_digital_twin_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'The future cannot be predicted perfectly. But it can be explored.',
    'philosophy', 'One Digital Twin. One Simulation Engine. One Future Impact Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'models', v_models,
    'scenarios', v_scenarios,
    'forecasts', v_forecasts,
    'impacts', v_impacts,
    'experiments', v_experiments,
    'what_if_experiments', v_experiments,
    'capacity', v_capacity,
    'capacity_modeling', v_capacity,
    'allocations', v_allocations,
    'resource_allocations', v_allocations,
    'decision_previews', v_decision_previews,
    'business_packs', v_packs,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'digital_twin_center', '/app/digital-twin-center',
      'what_if_workspace', '/app/digital-twin-center/what-if',
      'digital_twin_legacy', '/app/digital-twin',
      'simulation_lab', '/app/simulation',
      'decision_intelligence', '/app/decisions',
      'resilience_engine', '/app/resilience'
    ),
    'mobile_access', jsonb_build_object(
      'run_simulations', true, 'review_forecasts', true,
      'review_impacts', true, 'review_scenarios', true, 'generate_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_digital_twin_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_scenario_key text := coalesce(p_payload->>'scenario_key', '');
begin
  v_org_id := public._cmdt577_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_twin' then
    perform public._cmdt577_log(v_org_id, 'graph_updated', 'Digital twin refreshed', p_payload, 'digital_twin');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_scenario' then
    perform public._cmdt577_log(v_org_id, 'scenario_created', 'Scenario created', p_payload, 'scenario');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'execute_simulation' and v_scenario_key <> '' then
    update public.organization_companion_digital_twin_scenarios
    set scenario_status = 'simulated' where organization_id = v_org_id and scenario_key = v_scenario_key;
    perform public._cmdt577_log(v_org_id, 'simulation_executed', 'Simulation executed', p_payload, 'simulation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_forecast' then
    perform public._cmdt577_log(v_org_id, 'forecast_generated', 'Forecast generated', p_payload, 'forecast');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_impact_analysis' then
    perform public._cmdt577_log(v_org_id, 'impact_analysis_created', 'Impact analysis created', p_payload, 'impact');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'execute_risk_model' then
    perform public._cmdt577_log(v_org_id, 'risk_model_executed', 'Risk model executed', p_payload, 'risk');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_decision_preview' then
    perform public._cmdt577_log(v_org_id, 'decision_preview_generated', 'Decision preview generated', p_payload, 'decision');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_simulation_briefing' then
    perform public._cmdt577_log(v_org_id, 'report_generated', 'Simulation briefing generated', p_payload, 'digital_twin');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'run_what_if' then
    perform public._cmdt577_log(v_org_id, 'simulation_executed', 'What-if experiment executed', p_payload, 'simulation');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_digital_twin_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmdt577_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_digital_twin_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/digital-twin-center');
end; $$;

create or replace function public.get_assistant_companion_simulation_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmdt577_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations test ideas before they become expensive mistakes.',
    'advisor_prompts', jsonb_build_array(
      'What happens if we expand?', 'What happens if we hire?',
      'What happens if support volume doubles?', 'Generate simulation briefing.'
    ),
    'active_scenarios', (select count(*) from public.organization_companion_digital_twin_scenarios where organization_id = v_org_id and scenario_status in ('ready', 'simulated')),
    'experiments', (select count(*) from public.organization_companion_digital_twin_experiments where organization_id = v_org_id),
    'route', '/app/digital-twin-center'
  );
end; $$;

grant execute on function public.get_organization_companion_digital_twin_center(text) to authenticated;
grant execute on function public.perform_organization_companion_digital_twin_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_digital_twin_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_simulation_advisor_context() to authenticated;

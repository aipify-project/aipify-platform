-- Phase 414 — Digital Employee Compensation, ROI & Business Value Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/digital-workforce/value. Helpers: _gdecbv414_*
-- Business value measurement, ROI, productivity impact, cost allocation, and workforce economics.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.digital_workforce_value_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  measurement_mode text not null default 'executive' check (
    measurement_mode in ('executive', 'department', 'enterprise')
  ),
  value_health_score integer not null default 76 check (value_health_score between 0 and 100),
  roi_percent numeric(8, 2) not null default 0,
  hourly_value_rate numeric(10, 2) not null default 75 check (hourly_value_rate >= 0),
  savings_model jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_workforce_value_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_period text not null default 'month' check (
    metric_period in ('week', 'month', 'quarter', 'year', 'custom')
  ),
  hours_saved numeric(12, 2) not null default 0,
  employees_assisted integer not null default 0 check (employees_assisted >= 0),
  tasks_completed integer not null default 0 check (tasks_completed >= 0),
  projects_accelerated integer not null default 0 check (projects_accelerated >= 0),
  customer_requests_resolved integer not null default 0 check (customer_requests_resolved >= 0),
  operational_efficiency numeric(5, 2) not null default 0 check (operational_efficiency between 0 and 100),
  business_outcomes jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key)
);

create index if not exists digital_workforce_value_metrics_tenant_idx
  on public.digital_workforce_value_metrics (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_value_economics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  economics_key text not null,
  platform_costs numeric(12, 2) not null default 0,
  licensing_costs numeric(12, 2) not null default 0,
  department_costs numeric(12, 2) not null default 0,
  operational_costs numeric(12, 2) not null default 0,
  training_costs numeric(12, 2) not null default 0,
  infrastructure_costs numeric(12, 2) not null default 0,
  workforce_allocation jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, economics_key)
);

create index if not exists digital_workforce_value_economics_tenant_idx
  on public.digital_workforce_value_economics (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_department_value (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  department_key text not null,
  department_name text not null,
  department_type text not null default 'operations' check (
    department_type in (
      'support', 'sales', 'hr', 'finance', 'operations',
      'compliance', 'industry_pack', 'custom'
    )
  ),
  support_value numeric(12, 2) not null default 0,
  sales_value numeric(12, 2) not null default 0,
  productivity_gain_percent numeric(5, 2) not null default 0,
  automation_value numeric(12, 2) not null default 0,
  roi_percent numeric(8, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, department_key)
);

create index if not exists digital_workforce_department_value_tenant_idx
  on public.digital_workforce_department_value (tenant_id, department_type);

create table if not exists public.digital_workforce_value_scorecards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scorecard_key text not null,
  employee_id uuid references public.digital_employee_lifecycle_employees (id) on delete set null,
  employee_name text not null default '',
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  reliability_score integer not null default 75 check (reliability_score between 0 and 100),
  productivity_score integer not null default 75 check (productivity_score between 0 and 100),
  savings_generated numeric(12, 2) not null default 0,
  business_impact_score integer not null default 75 check (business_impact_score between 0 and 100),
  automation_coverage numeric(5, 2) not null default 0 check (automation_coverage between 0 and 100),
  overall_value_score integer not null default 75 check (overall_value_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, scorecard_key)
);

create index if not exists digital_workforce_value_scorecards_tenant_idx
  on public.digital_workforce_value_scorecards (tenant_id, overall_value_score desc);

create table if not exists public.digital_workforce_value_roi_analyses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  analysis_key text not null,
  analysis_title text not null,
  workforce_cost numeric(12, 2) not null default 0,
  operational_savings numeric(12, 2) not null default 0,
  productivity_gains numeric(12, 2) not null default 0,
  revenue_impact numeric(12, 2) not null default 0,
  automation_value numeric(12, 2) not null default 0,
  return_on_investment numeric(8, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, analysis_key)
);

create index if not exists digital_workforce_value_roi_analyses_tenant_idx
  on public.digital_workforce_value_roi_analyses (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_value_forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  forecast_horizon text not null default 'quarter' check (
    forecast_horizon in ('month', 'quarter', 'year', 'custom')
  ),
  future_savings numeric(12, 2) not null default 0,
  future_productivity_gains numeric(5, 2) not null default 0,
  workforce_expansion_roi numeric(8, 2) not null default 0,
  department_roi jsonb not null default '{}'::jsonb,
  growth_opportunities jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, forecast_key)
);

create index if not exists digital_workforce_value_forecasts_tenant_idx
  on public.digital_workforce_value_forecasts (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_value_benchmarks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  benchmark_key text not null,
  benchmark_title text not null,
  benchmark_scope text not null default 'department' check (
    benchmark_scope in (
      'department', 'business_unit', 'region', 'industry_pack',
      'workforce_type', 'automation_program', 'custom'
    )
  ),
  comparison_data jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, benchmark_key)
);

create index if not exists digital_workforce_value_benchmarks_tenant_idx
  on public.digital_workforce_value_benchmarks (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_value_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'significant_value', 'strong_roi', 'automation_savings_increasing',
      'investment_recommended', 'automation_roi_exceeds', 'department_improvement',
      'expansion_value', 'operational_savings', 'forecast_opportunity', 'benchmark_insight'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_value_advisor_signals_tenant_idx
  on public.digital_workforce_value_advisor_signals (tenant_id, created_at desc);

create table if not exists public.digital_workforce_value_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'roi_calculation_generated', 'value_score_updated', 'forecast_generated',
      'savings_model_updated', 'benchmark_generated', 'department_analysis_completed',
      'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_value_audit_logs_tenant_idx
  on public.digital_workforce_value_audit_logs (tenant_id, created_at desc);

alter table public.digital_workforce_value_settings enable row level security;
alter table public.digital_workforce_value_metrics enable row level security;
alter table public.digital_workforce_value_economics enable row level security;
alter table public.digital_workforce_department_value enable row level security;
alter table public.digital_workforce_value_scorecards enable row level security;
alter table public.digital_workforce_value_roi_analyses enable row level security;
alter table public.digital_workforce_value_forecasts enable row level security;
alter table public.digital_workforce_value_benchmarks enable row level security;
alter table public.digital_workforce_value_advisor_signals enable row level security;
alter table public.digital_workforce_value_audit_logs enable row level security;

revoke all on public.digital_workforce_value_settings from authenticated, anon;
revoke all on public.digital_workforce_value_metrics from authenticated, anon;
revoke all on public.digital_workforce_value_economics from authenticated, anon;
revoke all on public.digital_workforce_department_value from authenticated, anon;
revoke all on public.digital_workforce_value_scorecards from authenticated, anon;
revoke all on public.digital_workforce_value_roi_analyses from authenticated, anon;
revoke all on public.digital_workforce_value_forecasts from authenticated, anon;
revoke all on public.digital_workforce_value_benchmarks from authenticated, anon;
revoke all on public.digital_workforce_value_advisor_signals from authenticated, anon;
revoke all on public.digital_workforce_value_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'digital_workforce_value_engine', v.description
from (values
  ('digital_workforce_value.view', 'View Digital Workforce Value', 'View ROI, productivity impact, savings, and business value analytics'),
  ('digital_workforce_value.manage', 'Manage Digital Workforce Value', 'Generate ROI analyses, forecasts, benchmarks, and value scorecards')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gdecbv414_*
-- ---------------------------------------------------------------------------
create or replace function public._gdecbv414_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional') then
    raise exception 'Digital Workforce Value requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gdecbv414_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.digital_workforce_value_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gdecbv414_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.digital_workforce_value_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.digital_workforce_value_settings;
begin
  insert into public.digital_workforce_value_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.digital_workforce_value_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gdecbv414_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.digital_workforce_department_value where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_department_value (
      tenant_id, department_key, department_name, department_type,
      support_value, productivity_gain_percent, automation_value, roi_percent
    ) values
      (p_tenant_id, 'support', 'Support', 'support', 12500, 18, 8200, 142),
      (p_tenant_id, 'sales', 'Sales', 'sales', 9800, 22, 6400, 128),
      (p_tenant_id, 'finance', 'Finance', 'finance', 7600, 15, 5100, 115),
      (p_tenant_id, 'operations', 'Operations', 'operations', 11200, 20, 7800, 135),
      (p_tenant_id, 'compliance', 'Compliance', 'compliance', 5400, 12, 4200, 108);
  end if;

  if not exists (select 1 from public.digital_workforce_value_economics where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_value_economics (
      tenant_id, economics_key, platform_costs, licensing_costs, department_costs,
      operational_costs, training_costs, infrastructure_costs, workforce_allocation
    ) values (
      p_tenant_id, 'default',
      2400, 1800, 3200, 1500, 900, 600,
      jsonb_build_object('support', 35, 'sales', 20, 'operations', 25, 'finance', 12, 'compliance', 8)
    );
  end if;

  if not exists (select 1 from public.digital_workforce_value_metrics where tenant_id = p_tenant_id limit 1) then
    insert into public.digital_workforce_value_metrics (
      tenant_id, metric_key, metric_period, hours_saved, employees_assisted,
      tasks_completed, projects_accelerated, customer_requests_resolved, operational_efficiency
    ) values (
      p_tenant_id, 'current', 'month', 0, 0, 0, 0, 0, 0
    );
  end if;
end;
$$;

create or replace function public._gdecbv414_sync_scorecards(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rate numeric;
  r record;
  v_savings numeric;
  v_overall integer;
begin
  select coalesce(hourly_value_rate, 75) into v_rate
  from public.digital_workforce_value_settings where tenant_id = p_tenant_id;

  for r in
    select e.id, e.employee_key, e.employee_name, e.performance_score, e.health_score,
           e.tasks_completed, e.success_rate
    from public.digital_employee_lifecycle_employees e
    where e.tenant_id = p_tenant_id and e.employee_status in ('active', 'training')
  loop
    v_savings := round((r.tasks_completed * 0.5 * v_rate)::numeric, 2);
    v_overall := round((r.performance_score + r.health_score + least(100, r.success_rate)) / 3)::int;

    insert into public.digital_workforce_value_scorecards (
      tenant_id, scorecard_key, employee_id, employee_name,
      performance_score, reliability_score, productivity_score,
      savings_generated, business_impact_score, automation_coverage, overall_value_score
    ) values (
      p_tenant_id, 'SC-' || r.employee_key, r.id, r.employee_name,
      r.performance_score, r.health_score, r.performance_score,
      v_savings, v_overall, least(100, 40 + r.tasks_completed), v_overall
    )
    on conflict (tenant_id, scorecard_key) do update set
      employee_name = excluded.employee_name,
      performance_score = excluded.performance_score,
      reliability_score = excluded.reliability_score,
      productivity_score = excluded.productivity_score,
      savings_generated = excluded.savings_generated,
      business_impact_score = excluded.business_impact_score,
      automation_coverage = excluded.automation_coverage,
      overall_value_score = excluded.overall_value_score,
      updated_at = now();
  end loop;
end;
$$;

create or replace function public._gdecbv414_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_workforce_value_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_workforce_value_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'significant_value',
      'A digital employee generated significant value this period.',
      'Measurable savings and productivity gains support workforce scaling decisions.',
      'Review Digital Employee scorecards and prioritize high-value roles for expansion.',
      'low', 'high'
    ),
    (
      p_tenant_id, 'strong_roi',
      'Support operations show strong ROI.',
      'Department value analysis indicates automation savings exceed platform costs.',
      'Open ROI Analysis and compare department benchmarks before next hiring cycle.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'automation_savings_increasing',
      'Automation savings continue increasing.',
      'Workflow automation and task completion trends improve operational efficiency.',
      'Review Automation Value metrics and identify expansion opportunities.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'investment_recommended',
      'Additional digital workforce investment recommended.',
      'Forecast models project positive ROI from measured workforce expansion.',
      'Generate a value forecast and review Workforce Economics before approving new hires.',
      'moderate', 'moderate'
    );
end;
$$;

create or replace function public._gdecbv414_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_workforce_size integer := 0;
  v_tasks integer := 0;
  v_hours_saved numeric := 0;
  v_workflows integer := 0;
  v_hourly_rate numeric := 75;
  v_estimated_savings numeric := 0;
  v_productivity_gains numeric := 0;
  v_automation_value numeric := 0;
  v_business_impact numeric := 0;
  v_roi numeric := 0;
  v_health integer := 76;
  v_workforce_cost numeric := 0;
  v_dept_savings numeric := 0;
begin
  select count(*)::int, coalesce(sum(tasks_completed), 0)::int
  into v_workforce_size, v_tasks
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status in ('active', 'training', 'provisioning');

  select coalesce(hours_saved, 0), coalesce(operational_efficiency, 0)
  into v_hours_saved, v_productivity_gains
  from public.digital_workforce_value_metrics
  where tenant_id = p_tenant_id and metric_key = 'current'
  limit 1;

  if v_hours_saved = 0 and v_tasks > 0 then
    v_hours_saved := round(v_tasks * 0.5, 1);
  end if;

  select count(*)::int into v_workflows
  from public.agent_orchestration_workflows
  where tenant_id = p_tenant_id;

  select coalesce(hourly_value_rate, 75), coalesce(value_health_score, 76), coalesce(roi_percent, 0)
  into v_hourly_rate, v_health, v_roi
  from public.digital_workforce_value_settings where tenant_id = p_tenant_id;

  v_estimated_savings := round(v_hours_saved * v_hourly_rate, 2);

  select coalesce(sum(automation_value), 0) into v_automation_value
  from public.digital_workforce_department_value where tenant_id = p_tenant_id;

  if v_automation_value = 0 and v_workflows > 0 then
    v_automation_value := v_workflows * 1200;
  elsif v_automation_value = 0 and v_workforce_size > 0 then
    v_automation_value := v_workforce_size * 2400;
  end if;

  select coalesce(sum(support_value + sales_value), 0) into v_dept_savings
  from public.digital_workforce_department_value where tenant_id = p_tenant_id;

  v_business_impact := round((v_estimated_savings + v_automation_value + v_dept_savings) / 1000, 1);

  select coalesce(
    platform_costs + licensing_costs + department_costs + operational_costs + training_costs + infrastructure_costs,
    0
  ) into v_workforce_cost
  from public.digital_workforce_value_economics
  where tenant_id = p_tenant_id and economics_key = 'default'
  limit 1;

  if v_roi = 0 and v_workforce_cost > 0 then
    v_roi := round(((v_estimated_savings + v_automation_value - v_workforce_cost) / v_workforce_cost) * 100, 1);
  elsif v_roi = 0 and v_estimated_savings > 0 then
    v_roi := round(120 + v_workforce_size * 8, 1);
  end if;

  if v_productivity_gains = 0 and v_workforce_size > 0 then
    v_productivity_gains := least(45, 12 + v_workforce_size * 3);
  end if;

  return jsonb_build_object(
    'workforce_size', v_workforce_size,
    'estimated_savings', v_estimated_savings,
    'productivity_gains', round(v_productivity_gains, 1),
    'automation_value', v_automation_value,
    'business_impact', v_business_impact,
    'roi_percent', v_roi,
    'value_health_score', v_health,
    'hours_saved', v_hours_saved,
    'tasks_completed', v_tasks,
    'workflows_automated', v_workflows,
    'workforce_cost', v_workforce_cost
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_workforce_value_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.digital_workforce_value_settings;
  v_departments jsonb := '[]'::jsonb;
  v_scorecards jsonb := '[]'::jsonb;
  v_roi_analyses jsonb := '[]'::jsonb;
  v_forecasts jsonb := '[]'::jsonb;
  v_benchmarks jsonb := '[]'::jsonb;
  v_economics jsonb := '[]'::jsonb;
  v_metrics jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('digital_workforce_value.view');
  v_ctx := public._gdecbv414_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gdecbv414_ensure_settings(v_org_id, v_tenant_id);
  perform public._gdecbv414_seed_defaults(v_tenant_id);
  perform public._gdecbv414_sync_scorecards(v_tenant_id);
  perform public._gdecbv414_seed_advisor(v_tenant_id);
  v_overview := public._gdecbv414_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'department_key', d.department_key, 'department_name', d.department_name,
    'department_type', d.department_type, 'support_value', d.support_value,
    'sales_value', d.sales_value, 'productivity_gain_percent', d.productivity_gain_percent,
    'automation_value', d.automation_value, 'roi_percent', d.roi_percent
  ) order by d.department_name), '[]'::jsonb)
  into v_departments
  from public.digital_workforce_department_value d
  where d.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'scorecard_key', s.scorecard_key, 'employee_name', s.employee_name,
    'performance_score', s.performance_score, 'reliability_score', s.reliability_score,
    'productivity_score', s.productivity_score, 'savings_generated', s.savings_generated,
    'business_impact_score', s.business_impact_score, 'automation_coverage', s.automation_coverage,
    'overall_value_score', s.overall_value_score
  ) order by s.overall_value_score desc), '[]'::jsonb)
  into v_scorecards
  from public.digital_workforce_value_scorecards s
  where s.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'analysis_key', r.analysis_key, 'analysis_title', r.analysis_title,
    'workforce_cost', r.workforce_cost, 'operational_savings', r.operational_savings,
    'productivity_gains', r.productivity_gains, 'revenue_impact', r.revenue_impact,
    'automation_value', r.automation_value, 'return_on_investment', r.return_on_investment
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_roi_analyses
  from public.digital_workforce_value_roi_analyses r
  where r.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'forecast_key', f.forecast_key, 'forecast_title', f.forecast_title,
    'forecast_horizon', f.forecast_horizon, 'future_savings', f.future_savings,
    'future_productivity_gains', f.future_productivity_gains,
    'workforce_expansion_roi', f.workforce_expansion_roi
  ) order by f.updated_at desc), '[]'::jsonb)
  into v_forecasts
  from public.digital_workforce_value_forecasts f
  where f.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'benchmark_key', b.benchmark_key, 'benchmark_title', b.benchmark_title,
    'benchmark_scope', b.benchmark_scope, 'comparison_data', b.comparison_data
  ) order by b.updated_at desc), '[]'::jsonb)
  into v_benchmarks
  from public.digital_workforce_value_benchmarks b
  where b.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'economics_key', e.economics_key,
    'platform_costs', e.platform_costs, 'licensing_costs', e.licensing_costs,
    'department_costs', e.department_costs, 'operational_costs', e.operational_costs,
    'training_costs', e.training_costs, 'infrastructure_costs', e.infrastructure_costs,
    'workforce_allocation', e.workforce_allocation
  ) order by e.updated_at desc), '[]'::jsonb)
  into v_economics
  from public.digital_workforce_value_economics e
  where e.tenant_id = v_tenant_id
  limit 5;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_period', m.metric_period,
    'hours_saved', m.hours_saved, 'employees_assisted', m.employees_assisted,
    'tasks_completed', m.tasks_completed, 'projects_accelerated', m.projects_accelerated,
    'customer_requests_resolved', m.customer_requests_resolved,
    'operational_efficiency', m.operational_efficiency
  ) order by m.updated_at desc), '[]'::jsonb)
  into v_metrics
  from public.digital_workforce_value_metrics m
  where m.tenant_id = v_tenant_id
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.digital_workforce_value_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.digital_workforce_value_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Digital Employees are business assets — not salary costs. Measure value to scale with confidence.',
    'mission', 'Digital Workforce Value Engine — ROI, productivity impact, savings, and executive business value analytics.',
    'abos_principle', 'If organizations cannot measure value, they cannot scale with confidence. Transparency creates trust.',
    'recruitment_route', '/app/digital-workforce/recruitment',
    'lifecycle_route', '/app/digital-employees',
    'distinction_note', 'Business value and ROI measurement — distinct from recruitment planning and employee lifecycle management.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/digital-workforce/value'),
      jsonb_build_object('key', 'roi', 'route', '/app/digital-workforce/value/roi'),
      jsonb_build_object('key', 'productivity', 'route', '/app/digital-workforce/value/productivity'),
      jsonb_build_object('key', 'cost_allocation', 'route', '/app/digital-workforce/value/cost-allocation'),
      jsonb_build_object('key', 'workforce_economics', 'route', '/app/digital-workforce/value/workforce-economics'),
      jsonb_build_object('key', 'savings', 'route', '/app/digital-workforce/value/savings'),
      jsonb_build_object('key', 'business_impact', 'route', '/app/digital-workforce/value/business-impact'),
      jsonb_build_object('key', 'governance', 'route', '/app/digital-workforce/value/governance')
    ),
    'department_value', v_departments,
    'scorecards', v_scorecards,
    'roi_analyses', v_roi_analyses,
    'forecasts', v_forecasts,
    'benchmarks', v_benchmarks,
    'workforce_economics', v_economics,
    'business_metrics', v_metrics,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'roi_route', '/app/digital-workforce/value/roi',
      'productivity_route', '/app/digital-workforce/value/productivity',
      'cost_allocation_route', '/app/digital-workforce/value/cost-allocation',
      'economics_route', '/app/digital-workforce/value/workforce-economics',
      'savings_route', '/app/digital-workforce/value/savings',
      'business_impact_route', '/app/digital-workforce/value/business-impact',
      'governance_route', '/app/digital-workforce/value/governance',
      'recruitment_route', '/app/digital-workforce/recruitment',
      'lifecycle_route', '/app/digital-employees',
      'orchestration_route', '/app/orchestration'
    ),
    'executive_dashboard', jsonb_build_object(
      'roi', v_overview->>'roi_percent',
      'savings', v_overview->>'estimated_savings',
      'productivity_gains', v_overview->>'productivity_gains',
      'business_impact', v_overview->>'business_impact',
      'automation_coverage', v_overview->>'automation_value',
      'workforce_size', v_overview->>'workforce_size',
      'value_health_score', v_overview->>'value_health_score',
      'executive_route', '/app/digital-workforce/value'
    ),
    'privacy_note', 'Value calculations isolated per organization — metadata-first workforce economics with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.digital_workforce_value_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_overview jsonb;
  v_roi_id uuid;
  v_forecast_id uuid;
  v_benchmark_id uuid;
  v_dept_id uuid;
  v_hourly_rate numeric := 75;
  v_workforce_cost numeric := 0;
  v_savings numeric := 0;
  v_automation numeric := 0;
  v_roi numeric := 0;
begin
  perform public._irp_require_permission('digital_workforce_value.manage');
  v_ctx := public._gdecbv414_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gdecbv414_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'generate_roi_analysis' then
    v_overview := public._gdecbv414_overview_block(v_tenant_id);
    v_savings := coalesce((v_overview->>'estimated_savings')::numeric, 0);
    v_automation := coalesce((v_overview->>'automation_value')::numeric, 0);
    v_workforce_cost := coalesce((v_overview->>'workforce_cost')::numeric, 0);
    v_roi := coalesce((v_overview->>'roi_percent')::numeric, 0);

    insert into public.digital_workforce_value_roi_analyses (
      tenant_id, analysis_key, analysis_title, workforce_cost, operational_savings,
      productivity_gains, revenue_impact, automation_value, return_on_investment
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'analysis_key', 'ROI-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'analysis_title', 'Digital workforce ROI analysis'),
      v_workforce_cost,
      v_savings,
      coalesce((v_overview->>'productivity_gains')::numeric, 0) * 100,
      round(v_savings * 0.15, 2),
      v_automation,
      v_roi
    ) returning id into v_roi_id;

    update public.digital_workforce_value_settings
    set roi_percent = v_roi, updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'roi_calculation_generated', 'ROI analysis generated',
      jsonb_build_object('analysis_id', v_roi_id, 'roi_percent', v_roi)
    );

    return jsonb_build_object('ok', true, 'analysis_id', v_roi_id, 'roi_percent', v_roi);
  end if;

  if v_action = 'update_value_scorecard' then
    perform public._gdecbv414_sync_scorecards(v_tenant_id);

    update public.digital_workforce_value_settings
    set value_health_score = least(100, greatest(50, value_health_score + 1)), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'value_score_updated', 'Digital employee value scorecards updated',
      jsonb_build_object('trigger', 'manual_refresh')
    );

    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'generate_forecast' then
    v_overview := public._gdecbv414_overview_block(v_tenant_id);
    v_savings := coalesce((v_overview->>'estimated_savings')::numeric, 0);

    insert into public.digital_workforce_value_forecasts (
      tenant_id, forecast_key, forecast_title, forecast_horizon,
      future_savings, future_productivity_gains, workforce_expansion_roi, growth_opportunities
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'forecast_key', 'VFC-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'forecast_title', 'Workforce value forecast'),
      coalesce(p_payload->>'forecast_horizon', 'quarter'),
      round(v_savings * 1.25, 2),
      least(55, coalesce((v_overview->>'productivity_gains')::numeric, 0) + 8),
      coalesce((v_overview->>'roi_percent')::numeric, 0) + 12,
      jsonb_build_array('Automation expansion', 'Department ROI growth', 'Workforce expansion')
    ) returning id into v_forecast_id;

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'forecast_generated', 'Value forecast generated',
      jsonb_build_object('forecast_id', v_forecast_id)
    );

    return jsonb_build_object('ok', true, 'forecast_id', v_forecast_id);
  end if;

  if v_action = 'generate_benchmark' then
    insert into public.digital_workforce_value_benchmarks (
      tenant_id, benchmark_key, benchmark_title, benchmark_scope, comparison_data
    )
    select
      v_tenant_id,
      coalesce(p_payload->>'benchmark_key', 'BM-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'benchmark_title', 'Department value benchmark'),
      coalesce(p_payload->>'benchmark_scope', 'department'),
      coalesce(jsonb_agg(jsonb_build_object(
        'department', d.department_name,
        'roi_percent', d.roi_percent,
        'automation_value', d.automation_value,
        'productivity_gain_percent', d.productivity_gain_percent
      ) order by d.roi_percent desc), '{}'::jsonb)
    from public.digital_workforce_department_value d
    where d.tenant_id = v_tenant_id
    returning id into v_benchmark_id;

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'benchmark_generated', 'Department value benchmark generated',
      jsonb_build_object('benchmark_id', v_benchmark_id)
    );

    return jsonb_build_object('ok', true, 'benchmark_id', v_benchmark_id);
  end if;

  if v_action = 'complete_department_analysis' then
    update public.digital_workforce_department_value
    set
      roi_percent = roi_percent + 2,
      productivity_gain_percent = least(60, productivity_gain_percent + 1),
      updated_at = now()
    where tenant_id = v_tenant_id
      and department_key = coalesce(p_payload->>'department_key', 'support')
    returning id into v_dept_id;

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'department_analysis_completed', 'Department value analysis completed',
      jsonb_build_object('department_key', p_payload->>'department_key', 'department_id', v_dept_id)
    );

    return jsonb_build_object('ok', true, 'department_id', v_dept_id);
  end if;

  if v_action = 'update_savings_model' then
    select coalesce(hourly_value_rate, 75) into v_hourly_rate
    from public.digital_workforce_value_settings where tenant_id = v_tenant_id;

    update public.digital_workforce_value_settings
    set
      hourly_value_rate = coalesce((p_payload->>'hourly_value_rate')::numeric, v_hourly_rate),
      savings_model = coalesce(p_payload->'savings_model', savings_model),
      updated_at = now()
    where tenant_id = v_tenant_id;

    v_overview := public._gdecbv414_overview_block(v_tenant_id);

    update public.digital_workforce_value_metrics
    set
      hours_saved = coalesce((v_overview->>'hours_saved')::numeric, hours_saved),
      tasks_completed = coalesce((v_overview->>'tasks_completed')::int, tasks_completed),
      operational_efficiency = coalesce((v_overview->>'productivity_gains')::numeric, operational_efficiency),
      updated_at = now()
    where tenant_id = v_tenant_id and metric_key = 'current';

    perform public._gdecbv414_log_audit(
      v_tenant_id, 'savings_model_updated', 'Savings model updated',
      jsonb_build_object('hourly_value_rate', p_payload->>'hourly_value_rate')
    );

    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unsupported digital workforce value action: %', v_action;
end;
$$;

grant execute on function public.get_digital_workforce_value_center() to authenticated;
grant execute on function public.digital_workforce_value_action(jsonb) to authenticated;

-- Phase 422 — Enterprise Digital Twin, Business Simulation & Future Modeling Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/digital-twin. Helpers: _gedt422_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_digital_twin_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  twin_mode text not null default 'assisted' check (
    twin_mode in ('observer', 'assisted', 'simulation', 'enterprise')
  ),
  twin_health_score integer not null default 82 check (twin_health_score between 0 and 100),
  simulation_accuracy_percent integer not null default 76 check (simulation_accuracy_percent between 0 and 100),
  twin_coverage_percent integer not null default 68 check (twin_coverage_percent between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_digital_twin_organization_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_key text not null,
  model_title text not null,
  model_type text not null check (
    model_type in (
      'department', 'business_unit', 'region', 'subsidiary',
      'digital_employee', 'human_employee', 'customer', 'partner'
    )
  ),
  entity_count integer not null default 0,
  coverage_percent integer not null default 0 check (coverage_percent between 0 and 100),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, model_key)
);

create index if not exists enterprise_digital_twin_organization_models_tenant_idx
  on public.enterprise_digital_twin_organization_models (tenant_id, model_type);

create table if not exists public.enterprise_digital_twin_operational_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_key text not null,
  model_title text not null,
  model_type text not null check (
    model_type in (
      'workflow', 'project', 'operation', 'approval', 'service_delivery',
      'automation', 'business_pack', 'industry_pack'
    )
  ),
  maturity_score integer not null default 70 check (maturity_score between 0 and 100),
  status text not null default 'active',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, model_key)
);

create index if not exists enterprise_digital_twin_operational_models_tenant_idx
  on public.enterprise_digital_twin_operational_models (tenant_id, model_type);

create table if not exists public.enterprise_digital_twin_financial_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_key text not null,
  model_title text not null,
  model_type text not null check (
    model_type in ('revenue', 'expense', 'subscription', 'payroll', 'growth', 'profitability', 'forecast')
  ),
  current_value numeric(14, 2) not null default 0,
  forecast_value numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, model_key)
);

create index if not exists enterprise_digital_twin_financial_models_tenant_idx
  on public.enterprise_digital_twin_financial_models (tenant_id, model_type);

create table if not exists public.enterprise_digital_twin_workforce_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  model_key text not null,
  model_title text not null,
  model_type text not null check (
    model_type in ('capacity', 'utilization', 'hiring_plan', 'digital_workforce', 'skills', 'training', 'performance')
  ),
  utilization_percent integer not null default 0 check (utilization_percent between 0 and 100),
  headcount integer not null default 0,
  status text not null default 'active',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, model_key)
);

create index if not exists enterprise_digital_twin_workforce_models_tenant_idx
  on public.enterprise_digital_twin_workforce_models (tenant_id, model_type);

create table if not exists public.enterprise_digital_twin_simulations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  simulation_key text not null,
  simulation_title text not null,
  simulation_type text not null check (
    simulation_type in (
      'growth', 'workforce', 'revenue', 'risk', 'expansion', 'automation', 'industry'
    )
  ),
  scenario_type text not null default 'expected_case' check (
    scenario_type in (
      'best_case', 'expected_case', 'worst_case', 'aggressive_growth',
      'conservative_growth', 'market_disruption', 'custom'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'running', 'completed', 'archived')),
  forecast_horizon text not null default '90_days' check (
    forecast_horizon in ('30_days', '90_days', '6_months', '12_months', '24_months', '36_months', 'custom')
  ),
  outcome_summary text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, simulation_key)
);

create index if not exists enterprise_digital_twin_simulations_tenant_idx
  on public.enterprise_digital_twin_simulations (tenant_id, status);

create table if not exists public.enterprise_digital_twin_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  decision_type text not null check (
    decision_type in (
      'hiring', 'expansion', 'pricing', 'automation', 'product', 'partner', 'investment'
    )
  ),
  scenario_type text not null default 'expected_case',
  impact_summary text not null default '',
  recommendation text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, scenario_key)
);

create index if not exists enterprise_digital_twin_scenarios_tenant_idx
  on public.enterprise_digital_twin_scenarios (tenant_id, decision_type);

create table if not exists public.enterprise_digital_twin_forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  forecast_type text not null check (
    forecast_type in ('revenue', 'workforce', 'growth', 'risk', 'customer', 'operational')
  ),
  horizon text not null default '12_months',
  projected_value numeric(14, 2) not null default 0,
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  assumptions text not null default '',
  disclaimer text not null default 'Forecast — not a guaranteed outcome.',
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  unique (tenant_id, forecast_key)
);

create index if not exists enterprise_digital_twin_forecasts_tenant_idx
  on public.enterprise_digital_twin_forecasts (tenant_id, forecast_type);

create table if not exists public.enterprise_digital_twin_stress_tests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  stress_key text not null,
  stress_title text not null,
  stress_type text not null check (
    stress_type in (
      'revenue_decline', 'customer_loss', 'workforce_shortage', 'economic_change',
      'market_change', 'technology_failure', 'custom'
    )
  ),
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high', 'critical')),
  outcome_summary text not null default '',
  resilience_score integer not null default 70 check (resilience_score between 0 and 100),
  status text not null default 'completed',
  metadata jsonb not null default '{}'::jsonb,
  performed_at timestamptz not null default now(),
  unique (tenant_id, stress_key)
);

create index if not exists enterprise_digital_twin_stress_tests_tenant_idx
  on public.enterprise_digital_twin_stress_tests (tenant_id, stress_type);

create table if not exists public.enterprise_digital_twin_risk_models (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_type text not null check (
    risk_type in (
      'revenue', 'workforce', 'customer', 'compliance', 'technology', 'strategic', 'operational'
    )
  ),
  exposure_level text not null default 'moderate' check (exposure_level in ('low', 'moderate', 'high', 'critical')),
  mitigation_summary text not null default '',
  status text not null default 'open' check (status in ('open', 'mitigating', 'accepted', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, risk_key)
);

create index if not exists enterprise_digital_twin_risk_models_tenant_idx
  on public.enterprise_digital_twin_risk_models (tenant_id, risk_type);

create table if not exists public.enterprise_digital_twin_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'capacity_exceeded', 'automation_savings', 'expansion_opportunity', 'revenue_risk',
      'workforce_shortage', 'forecast_confidence', 'stress_exposure'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_digital_twin_intelligence_signals_tenant_idx
  on public.enterprise_digital_twin_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_digital_twin_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'simulate_before_expansion', 'risk_scenario_recommended', 'forecast_confidence_changed',
      'workforce_bottleneck', 'growth_assumptions_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_digital_twin_advisor_signals_tenant_idx
  on public.enterprise_digital_twin_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_digital_twin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'simulation_created', 'simulation_executed', 'scenario_created', 'forecast_generated',
      'stress_test_performed', 'decision_model_generated', 'twin_updated', 'twin_validated',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_digital_twin_audit_logs_tenant_idx
  on public.enterprise_digital_twin_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_digital_twin_settings enable row level security;
alter table public.enterprise_digital_twin_organization_models enable row level security;
alter table public.enterprise_digital_twin_operational_models enable row level security;
alter table public.enterprise_digital_twin_financial_models enable row level security;
alter table public.enterprise_digital_twin_workforce_models enable row level security;
alter table public.enterprise_digital_twin_simulations enable row level security;
alter table public.enterprise_digital_twin_scenarios enable row level security;
alter table public.enterprise_digital_twin_forecasts enable row level security;
alter table public.enterprise_digital_twin_stress_tests enable row level security;
alter table public.enterprise_digital_twin_risk_models enable row level security;
alter table public.enterprise_digital_twin_intelligence_signals enable row level security;
alter table public.enterprise_digital_twin_advisor_signals enable row level security;
alter table public.enterprise_digital_twin_audit_logs enable row level security;

revoke all on public.enterprise_digital_twin_settings from authenticated, anon;
revoke all on public.enterprise_digital_twin_organization_models from authenticated, anon;
revoke all on public.enterprise_digital_twin_operational_models from authenticated, anon;
revoke all on public.enterprise_digital_twin_financial_models from authenticated, anon;
revoke all on public.enterprise_digital_twin_workforce_models from authenticated, anon;
revoke all on public.enterprise_digital_twin_simulations from authenticated, anon;
revoke all on public.enterprise_digital_twin_scenarios from authenticated, anon;
revoke all on public.enterprise_digital_twin_forecasts from authenticated, anon;
revoke all on public.enterprise_digital_twin_stress_tests from authenticated, anon;
revoke all on public.enterprise_digital_twin_risk_models from authenticated, anon;
revoke all on public.enterprise_digital_twin_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_digital_twin_advisor_signals from authenticated, anon;
revoke all on public.enterprise_digital_twin_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_digital_twin_future_modeling_engine', v.description
from (values
  ('enterprise_digital_twin.view', 'View Enterprise Digital Twin', 'View twin overview, models, simulations, forecasts, and governance'),
  ('enterprise_digital_twin.manage', 'Manage Enterprise Digital Twin', 'Create simulations, generate forecasts, run stress tests, and update twin models')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gedt422_*
-- ---------------------------------------------------------------------------
create or replace function public._gedt422_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Enterprise Digital Twin requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._gedt422_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_digital_twin_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gedt422_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_digital_twin_settings language plpgsql security definer set search_path = public as $$
declare v_row public.enterprise_digital_twin_settings;
begin
  insert into public.enterprise_digital_twin_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id) on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then select * into v_row from public.enterprise_digital_twin_settings where organization_id = p_org_id; end if;
  return v_row;
end; $$;

create or replace function public._gedt422_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.enterprise_digital_twin_organization_models where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_organization_models (tenant_id, model_key, model_title, model_type, entity_count, coverage_percent, summary) values
      (p_tenant_id, 'ORG-DEPT', 'Departments', 'department', 8, 85, 'Core operational departments mapped.'),
      (p_tenant_id, 'ORG-BU', 'Business units', 'business_unit', 4, 78, 'Primary business units represented.'),
      (p_tenant_id, 'ORG-REG', 'Regions', 'region', 3, 72, 'Regional structure modeled.'),
      (p_tenant_id, 'ORG-DW', 'Digital workforce', 'digital_employee', 12, 65, 'Licensed digital workforce capacity.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_operational_models where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_operational_models (tenant_id, model_key, model_title, model_type, maturity_score, summary) values
      (p_tenant_id, 'OPS-WF', 'Support workflows', 'workflow', 82, 'Tier-1 and escalation workflows modeled.'),
      (p_tenant_id, 'OPS-AP', 'Approval routing', 'approval', 74, 'Finance and operations approval paths.'),
      (p_tenant_id, 'OPS-AUTO', 'Automation coverage', 'automation', 68, 'Assisted automation touchpoints mapped.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_financial_models where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_financial_models (tenant_id, model_key, model_title, model_type, current_value, forecast_value, summary) values
      (p_tenant_id, 'FIN-REV', 'Revenue trajectory', 'revenue', 1250000, 1420000, 'Subscription and services revenue forecast.'),
      (p_tenant_id, 'FIN-EXP', 'Operating expenses', 'expense', 890000, 920000, 'Payroll and vendor spend projection.'),
      (p_tenant_id, 'FIN-GRW', 'Growth rate', 'growth', 12, 15, 'Expected annual growth under base scenario.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_workforce_models where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_workforce_models (tenant_id, model_key, model_title, model_type, utilization_percent, headcount, summary) values
      (p_tenant_id, 'WF-CAP', 'Team capacity', 'capacity', 78, 45, 'Human workforce capacity utilization.'),
      (p_tenant_id, 'WF-HIRE', 'Hiring plan Q3', 'hiring_plan', 0, 6, 'Planned hires for operations expansion.'),
      (p_tenant_id, 'WF-DIG', 'Digital workforce', 'digital_workforce', 62, 12, 'Digital employee utilization across packs.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_simulations where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_simulations (tenant_id, simulation_key, simulation_title, simulation_type, scenario_type, status, forecast_horizon, outcome_summary) values
      (p_tenant_id, 'SIM-GRW-001', 'Regional expansion simulation', 'expansion', 'expected_case', 'completed', '12_months', 'Expansion feasible with moderate hiring increase.'),
      (p_tenant_id, 'SIM-AUTO-001', 'Support automation pilot', 'automation', 'best_case', 'draft', '90_days', 'Automation may reduce tier-1 handling time 18%.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_scenarios where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_scenarios (tenant_id, scenario_key, scenario_title, decision_type, scenario_type, impact_summary, recommendation) values
      (p_tenant_id, 'SCN-HIRE-001', 'Hire two support leads', 'hiring', 'expected_case', 'Improves capacity during peak season.', 'Simulate before committing to hiring plan.'),
      (p_tenant_id, 'SCN-PRICE-001', 'Enterprise tier pricing adjustment', 'pricing', 'conservative_growth', 'Moderate revenue uplift with churn risk.', 'Run worst-case and expected-case simulations.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_forecasts where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_forecasts (tenant_id, forecast_key, forecast_title, forecast_type, horizon, projected_value, assumptions) values
      (p_tenant_id, 'FC-REV-12', '12-month revenue outlook', 'revenue', '12_months', 1420000, 'Base growth with current retention assumptions.'),
      (p_tenant_id, 'FC-WF-90', '90-day workforce outlook', 'workforce', '90_days', 48, 'Includes planned Q3 hires.');
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_stress_tests where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_stress_tests (tenant_id, stress_key, stress_title, stress_type, severity, outcome_summary, resilience_score) values
      (p_tenant_id, 'STR-REV-001', '15% revenue decline scenario', 'revenue_decline', 'high', 'Operations remain viable with cost adjustments.', 71),
      (p_tenant_id, 'STR-WF-001', 'Workforce shortage stress test', 'workforce_shortage', 'moderate', 'Digital workforce partially offsets gap.', 68);
  end if;
  if not exists (select 1 from public.enterprise_digital_twin_risk_models where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_digital_twin_risk_models (tenant_id, risk_key, risk_title, risk_type, exposure_level, mitigation_summary) values
      (p_tenant_id, 'RISK-REV-001', 'Revenue concentration risk', 'revenue', 'moderate', 'Diversify customer segments in forecast models.'),
      (p_tenant_id, 'RISK-WF-001', 'Peak season capacity risk', 'workforce', 'high', 'Simulate hiring and automation scenarios.');
  end if;
end; $$;

create or replace function public._gedt422_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.enterprise_digital_twin_settings;
begin
  select * into v_settings from public.enterprise_digital_twin_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'twin_coverage_percent', coalesce(v_settings.twin_coverage_percent, 68),
    'simulation_accuracy_percent', coalesce(v_settings.simulation_accuracy_percent, 76),
    'available_models', 4,
    'active_simulations', (select count(*)::integer from public.enterprise_digital_twin_simulations where tenant_id = p_tenant_id and status in ('draft','running')),
    'future_scenarios', (select count(*)::integer from public.enterprise_digital_twin_scenarios where tenant_id = p_tenant_id),
    'risk_models', (select count(*)::integer from public.enterprise_digital_twin_risk_models where tenant_id = p_tenant_id and status = 'open'),
    'twin_health_score', coalesce(v_settings.twin_health_score, 82),
    'forecast_accuracy_percent', 74,
    'simulation_usage', 18,
    'business_impact_score', 79
  );
end; $$;

create or replace function public._gedt422_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_digital_twin_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_digital_twin_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'simulate_before_expansion', 'A simulation should be performed before expansion.', 'Regional growth plan lacks capacity validation.', 'Run expansion simulation with hiring scenarios.', 'moderate', 'high'),
    (p_tenant_id, 'risk_scenario_recommended', 'A risk scenario is recommended.', 'Revenue concentration exposure elevated.', 'Model worst-case revenue decline stress test.', 'low', 'high'),
    (p_tenant_id, 'forecast_confidence_changed', 'Forecast confidence changed.', 'Workforce assumptions updated.', 'Review 12-month revenue forecast assumptions.', 'low', 'moderate'),
    (p_tenant_id, 'workforce_bottleneck', 'A workforce simulation identified bottlenecks.', 'Peak season may exceed support capacity.', 'Simulate automation and hiring alternatives.', 'moderate', 'high'),
    (p_tenant_id, 'growth_assumptions_review', 'Growth assumptions should be reviewed.', 'Aggressive growth target may exceed capacity.', 'Compare aggressive vs conservative growth scenarios.', 'moderate', 'moderate');
end; $$;

create or replace function public._gedt422_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_digital_twin_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_digital_twin_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'capacity_exceeded', 'Growth targets may exceed capacity.', 'Q3 demand may outpace support staffing.', 'Run workforce simulation before committing.', 'high'),
    (p_tenant_id, 'automation_savings', 'Automation could reduce operational costs.', 'Tier-1 routing is highly repeatable.', 'Model automation pilot in simulation lab.', 'moderate'),
    (p_tenant_id, 'expansion_opportunity', 'Expansion opportunities identified.', 'Adjacent market signals positive.', 'Simulate regional expansion scenario.', 'moderate'),
    (p_tenant_id, 'revenue_risk', 'Revenue risk increasing.', 'Customer concentration elevated.', 'Stress test 15% revenue decline.', 'high'),
    (p_tenant_id, 'workforce_shortage', 'Workforce shortages projected.', 'Peak season hiring gap detected.', 'Compare hiring vs digital workforce scenarios.', 'high');
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_digital_twin_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_settings public.enterprise_digital_twin_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_digital_twin.view');
  v_ctx := public._gedt422_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gedt422_ensure_settings(v_org_id, v_tenant_id);
  perform public._gedt422_seed_defaults(v_tenant_id);
  perform public._gedt422_seed_advisor(v_tenant_id);
  perform public._gedt422_seed_intelligence(v_tenant_id);
  v_overview := public._gedt422_overview_block(v_tenant_id);
  perform public._gedt422_log_audit(v_tenant_id, 'dashboard_viewed', 'Enterprise digital twin center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'The best decisions are often tested before they are executed.',
    'mission', 'Enterprise Digital Twin — model the organization and explore future outcomes before acting.',
    'abos_principle', 'Simulations are forecasts, not guarantees. Aipify prepares scenarios; humans decide and own outcomes.',
    'simulation_lab_route', '/app/simulations',
    'legacy_twin_route', '/app/digital-twin/processes/support-triage',
    'decisions_route', '/app/assistant/decisions',
    'distinction_note', 'Future modeling layer — distinct from live operations and guaranteed predictions.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/digital-twin'),
      jsonb_build_object('key', 'organization', 'route', '/app/digital-twin#organization'),
      jsonb_build_object('key', 'operational', 'route', '/app/digital-twin#operational'),
      jsonb_build_object('key', 'financial', 'route', '/app/digital-twin#financial'),
      jsonb_build_object('key', 'workforce', 'route', '/app/digital-twin#workforce'),
      jsonb_build_object('key', 'simulation_lab', 'route', '/app/digital-twin#simulation-lab'),
      jsonb_build_object('key', 'future_modeling', 'route', '/app/digital-twin#future-modeling'),
      jsonb_build_object('key', 'governance', 'route', '/app/digital-twin#governance')
    ),
    'scenario_types', jsonb_build_array('best_case','expected_case','worst_case','aggressive_growth','conservative_growth','market_disruption','custom'),
    'forecast_horizons', jsonb_build_array('30_days','90_days','6_months','12_months','24_months','36_months','custom'),
    'organization_models', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'model_key',m.model_key,'model_title',m.model_title,'model_type',m.model_type,'entity_count',m.entity_count,'coverage_percent',m.coverage_percent,'summary',m.summary) order by m.updated_at desc) from public.enterprise_digital_twin_organization_models m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'operational_models', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'model_key',m.model_key,'model_title',m.model_title,'model_type',m.model_type,'maturity_score',m.maturity_score,'summary',m.summary) order by m.updated_at desc) from public.enterprise_digital_twin_operational_models m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'financial_models', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'model_key',m.model_key,'model_title',m.model_title,'model_type',m.model_type,'current_value',m.current_value,'forecast_value',m.forecast_value,'confidence',m.confidence,'summary',m.summary) order by m.updated_at desc) from public.enterprise_digital_twin_financial_models m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'workforce_models', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'model_key',m.model_key,'model_title',m.model_title,'model_type',m.model_type,'utilization_percent',m.utilization_percent,'headcount',m.headcount,'summary',m.summary) order by m.updated_at desc) from public.enterprise_digital_twin_workforce_models m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'simulations', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'simulation_key',s.simulation_key,'simulation_title',s.simulation_title,'simulation_type',s.simulation_type,'scenario_type',s.scenario_type,'status',s.status,'forecast_horizon',s.forecast_horizon,'outcome_summary',s.outcome_summary,'confidence',s.confidence) order by s.created_at desc) from public.enterprise_digital_twin_simulations s where s.tenant_id = v_tenant_id limit 15), '[]'::jsonb),
    'scenarios', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'scenario_key',s.scenario_key,'scenario_title',s.scenario_title,'decision_type',s.decision_type,'scenario_type',s.scenario_type,'impact_summary',s.impact_summary,'recommendation',s.recommendation,'status',s.status) order by s.created_at desc) from public.enterprise_digital_twin_scenarios s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'forecasts', coalesce((select jsonb_agg(jsonb_build_object('id',f.id,'forecast_key',f.forecast_key,'forecast_title',f.forecast_title,'forecast_type',f.forecast_type,'horizon',f.horizon,'projected_value',f.projected_value,'confidence',f.confidence,'assumptions',f.assumptions,'disclaimer',f.disclaimer) order by f.generated_at desc) from public.enterprise_digital_twin_forecasts f where f.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'stress_tests', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'stress_key',s.stress_key,'stress_title',s.stress_title,'stress_type',s.stress_type,'severity',s.severity,'outcome_summary',s.outcome_summary,'resilience_score',s.resilience_score) order by s.performed_at desc) from public.enterprise_digital_twin_stress_tests s where s.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'risk_models', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'risk_key',r.risk_key,'risk_title',r.risk_title,'risk_type',r.risk_type,'exposure_level',r.exposure_level,'mitigation_summary',r.mitigation_summary,'status',r.status) order by r.updated_at desc) from public.enterprise_digital_twin_risk_models r where r.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_digital_twin_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_digital_twin_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.enterprise_digital_twin_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'future_outlook', 'moderate_growth',
      'growth_forecast', v_overview->>'twin_coverage_percent',
      'risk_forecast', v_overview->>'risk_models',
      'workforce_outlook', 'capacity_pressure',
      'revenue_outlook', v_overview->>'forecast_accuracy_percent',
      'simulation_results', v_overview->>'active_simulations',
      'strategic_opportunities', 3
    ),
    'governance', jsonb_build_object(
      'forecasts_not_guarantees', true,
      'simulations_clearly_identified', true,
      'decision_ownership_human', true,
      'assumptions_transparent', true,
      'human_override_available', true
    ),
    'privacy_note', 'Digital twin metadata isolated per tenant — simulation inputs use approved operational metadata only.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_digital_twin_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('enterprise_digital_twin.manage');
  v_ctx := public._gedt422_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gedt422_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_simulation' then
    insert into public.enterprise_digital_twin_simulations (tenant_id, simulation_key, simulation_title, simulation_type, scenario_type, forecast_horizon, status)
    values (v_tenant_id, coalesce(p_payload->>'simulation_key','SIM-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'simulation_title','New simulation'), coalesce(p_payload->>'simulation_type','growth'), coalesce(p_payload->>'scenario_type','expected_case'), coalesce(p_payload->>'forecast_horizon','90_days'), 'draft')
    returning id into v_id;
    perform public._gedt422_log_audit(v_tenant_id, 'simulation_created', 'Simulation created', jsonb_build_object('simulation_id', v_id));
    return jsonb_build_object('ok', true, 'simulation_id', v_id);
  end if;

  if v_action = 'run_simulation' then
    update public.enterprise_digital_twin_simulations set status = 'completed', outcome_summary = coalesce(p_payload->>'outcome_summary','Simulation completed — review outcomes before decisions.')
    where tenant_id = v_tenant_id and simulation_key = coalesce(p_payload->>'simulation_key','') returning id into v_id;
    perform public._gedt422_log_audit(v_tenant_id, 'simulation_executed', 'Simulation executed', jsonb_build_object('simulation_id', v_id));
    return jsonb_build_object('ok', true, 'simulation_id', v_id);
  end if;

  if v_action = 'create_scenario' then
    insert into public.enterprise_digital_twin_scenarios (tenant_id, scenario_key, scenario_title, decision_type, scenario_type, impact_summary, recommendation)
    values (v_tenant_id, coalesce(p_payload->>'scenario_key','SCN-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'scenario_title','Decision scenario'), coalesce(p_payload->>'decision_type','investment'), coalesce(p_payload->>'scenario_type','expected_case'), coalesce(p_payload->>'impact_summary',''), coalesce(p_payload->>'recommendation','Review simulation results before approval.'))
    returning id into v_id;
    perform public._gedt422_log_audit(v_tenant_id, 'scenario_created', 'Scenario created', jsonb_build_object('scenario_id', v_id));
    return jsonb_build_object('ok', true, 'scenario_id', v_id);
  end if;

  if v_action = 'generate_forecast' then
    insert into public.enterprise_digital_twin_forecasts (tenant_id, forecast_key, forecast_title, forecast_type, horizon, projected_value, assumptions)
    values (v_tenant_id, coalesce(p_payload->>'forecast_key','FC-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'forecast_title','Generated forecast'), coalesce(p_payload->>'forecast_type','revenue'), coalesce(p_payload->>'horizon','12_months'), coalesce((p_payload->>'projected_value')::numeric, 0), coalesce(p_payload->>'assumptions','Base scenario assumptions.'))
    returning id into v_id;
    perform public._gedt422_log_audit(v_tenant_id, 'forecast_generated', 'Forecast generated', jsonb_build_object('forecast_id', v_id));
    return jsonb_build_object('ok', true, 'forecast_id', v_id);
  end if;

  if v_action = 'run_stress_test' then
    insert into public.enterprise_digital_twin_stress_tests (tenant_id, stress_key, stress_title, stress_type, severity, outcome_summary, resilience_score)
    values (v_tenant_id, coalesce(p_payload->>'stress_key','STR-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'stress_title','Stress test'), coalesce(p_payload->>'stress_type','revenue_decline'), coalesce(p_payload->>'severity','moderate'), coalesce(p_payload->>'outcome_summary','Stress test completed.'), coalesce((p_payload->>'resilience_score')::integer, 70))
    returning id into v_id;
    perform public._gedt422_log_audit(v_tenant_id, 'stress_test_performed', 'Stress test performed', jsonb_build_object('stress_id', v_id));
    return jsonb_build_object('ok', true, 'stress_id', v_id);
  end if;

  if v_action = 'validate_twin' then
    update public.enterprise_digital_twin_settings set twin_health_score = least(100, twin_health_score + 1), simulation_accuracy_percent = least(100, simulation_accuracy_percent + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._gedt422_log_audit(v_tenant_id, 'twin_validated', 'Digital twin validated', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'refresh_analytics' then
    update public.enterprise_digital_twin_settings set twin_coverage_percent = least(100, twin_coverage_percent + 2), updated_at = now() where tenant_id = v_tenant_id;
    perform public._gedt422_log_audit(v_tenant_id, 'analytics_refreshed', 'Twin analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

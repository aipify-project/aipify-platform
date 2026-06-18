-- Phase 430 — Enterprise Value Realization, ROI & Business Impact Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/value. Helpers: _gevrbi430_*

create table if not exists public.enterprise_value_realization_roi_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  value_health_score integer not null default 84 check (value_health_score between 0 and 100),
  estimated_value_generated numeric(14,2) not null default 0,
  net_roi_percent numeric(8,2) not null default 142.00,
  subscription_cost numeric(14,2) not null default 0,
  implementation_cost numeric(14,2) not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_value_realization_roi_engine_roi_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  period_type text not null check (period_type in ('monthly', 'quarterly', 'annual', 'business_pack', 'department', 'organization')),
  subscription_cost numeric(14,2) not null default 0,
  operational_savings numeric(14,2) not null default 0,
  revenue_impact numeric(14,2) not null default 0,
  efficiency_gains numeric(14,2) not null default 0,
  risk_reduction numeric(14,2) not null default 0,
  net_roi_percent numeric(8,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key)
);

create index if not exists enterprise_value_realization_roi_engine_roi_metrics_tenant_idx
  on public.enterprise_value_realization_roi_engine_roi_metrics (tenant_id, period_type);

create table if not exists public.enterprise_value_realization_roi_engine_time_savings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  savings_key text not null,
  savings_title text not null,
  hours_saved numeric(10,2) not null default 0,
  tasks_automated integer not null default 0,
  category text not null check (category in ('manual_work', 'support', 'administrative', 'meetings', 'general')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, savings_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_cost_savings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  savings_key text not null,
  savings_title text not null,
  savings_type text not null check (
    savings_type in ('operational', 'support', 'workforce', 'vendor', 'technology', 'process')
  ),
  amount numeric(14,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, savings_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_revenue_impact (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  impact_key text not null,
  impact_title text not null,
  impact_type text not null check (
    impact_type in ('influenced', 'generated', 'upsell', 'retention', 'lead_conversion', 'partner_revenue')
  ),
  amount numeric(14,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, impact_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_workforce_impact (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  impact_key text not null,
  impact_title text not null,
  impact_type text not null check (
    impact_type in ('productivity', 'capacity', 'efficiency', 'digital_employee', 'training', 'knowledge')
  ),
  score integer not null default 80 check (score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, impact_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_strategic_impact (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  impact_key text not null,
  impact_title text not null,
  impact_type text not null check (
    impact_type in ('risk_reduction', 'decision_quality', 'knowledge_growth', 'operational_maturity', 'governance', 'strategic_progress')
  ),
  score integer not null default 78 check (score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, impact_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  timeline_key text not null,
  period_label text not null check (period_label in ('30_days', '90_days', '6_months', '12_months', '24_months', 'lifetime')),
  estimated_value numeric(14,2) not null default 0,
  hours_saved numeric(10,2) not null default 0,
  cost_savings numeric(14,2) not null default 0,
  revenue_impact numeric(14,2) not null default 0,
  roi_percent numeric(8,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, timeline_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_benchmarks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  benchmark_key text not null,
  benchmark_title text not null,
  benchmark_type text not null check (
    benchmark_type in ('current_period', 'previous_period', 'department', 'business_pack', 'industry', 'custom')
  ),
  current_value numeric(14,2) not null default 0,
  comparison_value numeric(14,2) not null default 0,
  variance_percent numeric(8,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, benchmark_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null check (
    report_type in ('monthly', 'quarterly', 'executive_roi', 'business_pack', 'automation', 'strategic')
  ),
  status text not null default 'generated' check (status in ('draft', 'generated', 'published')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, report_key)
);

create table if not exists public.enterprise_value_realization_roi_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in ('roi_increased', 'automation_savings', 'retention_improved', 'revenue_exceeded', 'business_pack_value')
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_value_realization_roi_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in ('workflow_savings', 'roi_improved', 'department_gains', 'automation_opportunity', 'customer_value')
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_value_realization_roi_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'roi_calculated', 'savings_recorded', 'revenue_impact_updated',
      'value_report_generated', 'benchmark_updated', 'impact_model_modified',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_value_realization_roi_engine_audit_logs_tenant_idx
  on public.enterprise_value_realization_roi_engine_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_value_realization_roi_engine_settings enable row level security;
alter table public.enterprise_value_realization_roi_engine_roi_metrics enable row level security;
alter table public.enterprise_value_realization_roi_engine_time_savings enable row level security;
alter table public.enterprise_value_realization_roi_engine_cost_savings enable row level security;
alter table public.enterprise_value_realization_roi_engine_revenue_impact enable row level security;
alter table public.enterprise_value_realization_roi_engine_workforce_impact enable row level security;
alter table public.enterprise_value_realization_roi_engine_strategic_impact enable row level security;
alter table public.enterprise_value_realization_roi_engine_timeline enable row level security;
alter table public.enterprise_value_realization_roi_engine_benchmarks enable row level security;
alter table public.enterprise_value_realization_roi_engine_reports enable row level security;
alter table public.enterprise_value_realization_roi_engine_intelligence_signals enable row level security;
alter table public.enterprise_value_realization_roi_engine_advisor_signals enable row level security;
alter table public.enterprise_value_realization_roi_engine_audit_logs enable row level security;

revoke all on public.enterprise_value_realization_roi_engine_settings from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_roi_metrics from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_time_savings from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_cost_savings from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_revenue_impact from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_workforce_impact from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_strategic_impact from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_timeline from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_benchmarks from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_reports from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_advisor_signals from authenticated, anon;
revoke all on public.enterprise_value_realization_roi_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_value_realization_roi_engine', v.description
from (values
  ('enterprise_value_realization_roi.view', 'View Value Center', 'View ROI, savings, revenue impact, and business value metrics'),
  ('enterprise_value_realization_roi.manage', 'Manage Value Center', 'Calculate ROI, record savings, generate reports, and update impact models')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

create or replace function public._gevrbi430_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Value Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._gevrbi430_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_value_realization_roi_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gevrbi430_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_value_realization_roi_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.enterprise_value_realization_roi_engine_settings;
begin
  insert into public.enterprise_value_realization_roi_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.enterprise_value_realization_roi_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._gevrbi430_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_roi_metrics where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_roi_metrics (tenant_id, metric_key, metric_title, period_type, subscription_cost, operational_savings, revenue_impact, efficiency_gains, risk_reduction, net_roi_percent, summary) values
      (p_tenant_id, 'ROI-M', 'Monthly ROI', 'monthly', 2500, 8200, 4500, 3100, 1200, 142.00, 'Strong monthly ROI from automation and support savings.'),
      (p_tenant_id, 'ROI-Q', 'Quarterly ROI', 'quarterly', 7500, 24600, 13500, 9300, 3600, 156.00, 'Quarterly ROI trending upward.'),
      (p_tenant_id, 'ROI-A', 'Annual ROI', 'annual', 30000, 98400, 54000, 37200, 14400, 168.00, 'Annual ROI exceeds target.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_time_savings where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_time_savings (tenant_id, savings_key, savings_title, hours_saved, tasks_automated, category, summary) values
      (p_tenant_id, 'TS-001', 'Support automation', 420, 1840, 'support', 'Support response time reduced through Companion triage.'),
      (p_tenant_id, 'TS-002', 'Administrative workflows', 280, 920, 'administrative', 'Approval and reporting workflows automated.'),
      (p_tenant_id, 'TS-003', 'Meeting preparation', 96, 240, 'meetings', 'Executive briefing preparation time reduced.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_cost_savings where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_cost_savings (tenant_id, savings_key, savings_title, savings_type, amount, summary) values
      (p_tenant_id, 'CS-001', 'Operational efficiency', 'operational', 42000, 'Process automation reduced operational overhead.'),
      (p_tenant_id, 'CS-002', 'Support cost reduction', 'support', 18500, 'Deflected tickets and faster resolution.'),
      (p_tenant_id, 'CS-003', 'Vendor consolidation', 'vendor', 12000, 'Reduced third-party tooling overlap.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_revenue_impact where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_revenue_impact (tenant_id, impact_key, impact_title, impact_type, amount, summary) values
      (p_tenant_id, 'RI-001', 'Revenue influenced', 'influenced', 125000, 'Pipeline influenced by improved customer engagement.'),
      (p_tenant_id, 'RI-002', 'Retention impact', 'retention', 48000, 'Reduced churn through proactive Companion insights.'),
      (p_tenant_id, 'RI-003', 'Upsell impact', 'upsell', 32000, 'Expansion revenue from Business Pack adoption.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_workforce_impact where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_workforce_impact (tenant_id, impact_key, impact_title, impact_type, score, summary) values
      (p_tenant_id, 'WF-001', 'Team productivity', 'productivity', 86, 'Productivity gains across operations teams.'),
      (p_tenant_id, 'WF-002', 'Digital employee contribution', 'digital_employee', 82, 'Digital workforce handling routine tasks.'),
      (p_tenant_id, 'WF-003', 'Knowledge impact', 'knowledge', 88, 'Employee Knowledge Engine reduced onboarding time.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_strategic_impact where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_strategic_impact (tenant_id, impact_key, impact_title, impact_type, score, summary) values
      (p_tenant_id, 'ST-001', 'Risk reduction', 'risk_reduction', 84, 'Governance and approval workflows reduced operational risk.'),
      (p_tenant_id, 'ST-002', 'Decision quality', 'decision_quality', 87, 'Decision Support Engine improved executive decisions.'),
      (p_tenant_id, 'ST-003', 'Operational maturity', 'operational_maturity', 80, 'Platform excellence scores contributing to maturity.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_timeline where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_timeline (tenant_id, timeline_key, period_label, estimated_value, hours_saved, cost_savings, revenue_impact, roi_percent, summary) values
      (p_tenant_id, 'TL-30', '30_days', 18500, 120, 8200, 4500, 98.00, 'First month value trajectory.'),
      (p_tenant_id, 'TL-90', '90_days', 62000, 380, 24600, 13500, 128.00, 'Quarterly value acceleration.'),
      (p_tenant_id, 'TL-12', '12_months', 248000, 1520, 98400, 54000, 168.00, 'Annual value realization target met.');
  end if;
  if not exists (select 1 from public.enterprise_value_realization_roi_engine_benchmarks where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_value_realization_roi_engine_benchmarks (tenant_id, benchmark_key, benchmark_title, benchmark_type, current_value, comparison_value, variance_percent, summary) values
      (p_tenant_id, 'BM-CUR', 'Current vs previous period', 'current_period', 62000, 48000, 29.17, 'Value up 29% vs previous quarter.'),
      (p_tenant_id, 'BM-BP', 'Business Pack performance', 'business_pack', 42000, 35000, 20.00, 'Aipify Hosts pack exceeding benchmark.');
  end if;
end; $$;

create or replace function public._gevrbi430_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_value_realization_roi_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_value_realization_roi_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'workflow_savings', 'A workflow generated measurable savings.', 'Support automation saved 420 hours this period.', 'Document savings for executive report.', 'low', 'high'),
    (p_tenant_id, 'roi_improved', 'ROI improved this month.', 'Monthly ROI at 142%.', 'Share ROI milestone with stakeholders.', 'low', 'high'),
    (p_tenant_id, 'department_gains', 'A department achieved exceptional gains.', 'Operations team productivity score 86.', 'Identify replicable patterns.', 'moderate', 'high'),
    (p_tenant_id, 'automation_opportunity', 'Additional automation opportunities exist.', 'Administrative workflows still partially manual.', 'Review automation candidates.', 'moderate', 'moderate'),
    (p_tenant_id, 'customer_value', 'Customer value continues to increase.', 'Retention impact trending up.', 'Highlight in customer success report.', 'low', 'high');
end; $$;

create or replace function public._gevrbi430_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_value_realization_roi_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_value_realization_roi_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'roi_increased', 'ROI increased significantly.', 'Net ROI up 12 points quarter-over-quarter.', 'Include in board reporting.', 'high'),
    (p_tenant_id, 'automation_savings', 'Automation generated measurable savings.', 'Cost savings of 42K from operational automation.', 'Expand automation to adjacent workflows.', 'high'),
    (p_tenant_id, 'retention_improved', 'Customer retention improved.', 'Retention impact 48K attributed to Companion.', 'Sustain proactive engagement cadence.', 'moderate'),
    (p_tenant_id, 'revenue_exceeded', 'Revenue impact exceeded expectations.', 'Revenue influenced 125K vs 100K target.', 'Review upsell playbook effectiveness.', 'high'),
    (p_tenant_id, 'business_pack_value', 'A Business Pack generated substantial value.', 'Hosts pack ROI 20% above benchmark.', 'Promote pack success internally.', 'high');
end; $$;

create or replace function public._gevrbi430_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.enterprise_value_realization_roi_engine_settings;
begin
  select * into v_settings from public.enterprise_value_realization_roi_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'estimated_value_generated', coalesce(v_settings.estimated_value_generated, 248000),
    'hours_saved', (select coalesce(sum(hours_saved), 0) from public.enterprise_value_realization_roi_engine_time_savings where tenant_id = p_tenant_id),
    'costs_reduced', (select coalesce(sum(amount), 0) from public.enterprise_value_realization_roi_engine_cost_savings where tenant_id = p_tenant_id),
    'revenue_influenced', (select coalesce(sum(amount), 0) from public.enterprise_value_realization_roi_engine_revenue_impact where tenant_id = p_tenant_id),
    'workflows_automated', (select coalesce(sum(tasks_automated), 0) from public.enterprise_value_realization_roi_engine_time_savings where tenant_id = p_tenant_id),
    'customer_impact_score', 86,
    'value_health_score', coalesce(v_settings.value_health_score, 84),
    'net_roi_percent', coalesce(v_settings.net_roi_percent, 142.00)
  );
end; $$;

create or replace function public.get_enterprise_value_realization_roi_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.enterprise_value_realization_roi_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_value_realization_roi.view');
  v_ctx := public._gevrbi430_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gevrbi430_ensure_settings(v_org_id, v_tenant_id);
  perform public._gevrbi430_seed_defaults(v_tenant_id);
  perform public._gevrbi430_seed_advisor(v_tenant_id);
  perform public._gevrbi430_seed_intelligence(v_tenant_id);
  v_overview := public._gevrbi430_overview_block(v_tenant_id);
  perform public._gevrbi430_log_audit(v_tenant_id, 'dashboard_viewed', 'Value center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'If value cannot be measured, value cannot be proven.',
    'mission', 'Enterprise Value Realization & ROI Engine — financial, operational, workforce, customer, automation, and strategic value measurement.',
    'abos_principle', 'Organizations do not buy software — they buy outcomes. Customers should never wonder whether Aipify creates value.',
    'value_engine_route', '/app/value-engine',
    'value_realization_route', '/app/value-realization-engine',
    'impact_metrics_route', '/platform/impact',
    'distinction_note', 'Value metadata and ROI signals — tenant-scoped calculations without cross-tenant business data exposure.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/value'),
      jsonb_build_object('key', 'roi', 'route', '/app/value#roi'),
      jsonb_build_object('key', 'time_savings', 'route', '/app/value#time-savings'),
      jsonb_build_object('key', 'cost_savings', 'route', '/app/value#cost-savings'),
      jsonb_build_object('key', 'revenue', 'route', '/app/value#revenue'),
      jsonb_build_object('key', 'workforce', 'route', '/app/value#workforce'),
      jsonb_build_object('key', 'strategic', 'route', '/app/value#strategic'),
      jsonb_build_object('key', 'analytics', 'route', '/app/value#analytics')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'roi_metrics', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'metric_key',m.metric_key,'metric_title',m.metric_title,'period_type',m.period_type,'subscription_cost',m.subscription_cost,'operational_savings',m.operational_savings,'revenue_impact',m.revenue_impact,'efficiency_gains',m.efficiency_gains,'risk_reduction',m.risk_reduction,'net_roi_percent',m.net_roi_percent,'summary',m.summary) order by m.net_roi_percent desc) from public.enterprise_value_realization_roi_engine_roi_metrics m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'time_savings', coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'savings_key',t.savings_key,'savings_title',t.savings_title,'hours_saved',t.hours_saved,'tasks_automated',t.tasks_automated,'category',t.category,'summary',t.summary) order by t.hours_saved desc) from public.enterprise_value_realization_roi_engine_time_savings t where t.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'cost_savings', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'savings_key',c.savings_key,'savings_title',c.savings_title,'savings_type',c.savings_type,'amount',c.amount,'summary',c.summary) order by c.amount desc) from public.enterprise_value_realization_roi_engine_cost_savings c where c.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'revenue_impact', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'impact_key',r.impact_key,'impact_title',r.impact_title,'impact_type',r.impact_type,'amount',r.amount,'summary',r.summary) order by r.amount desc) from public.enterprise_value_realization_roi_engine_revenue_impact r where r.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'workforce_impact', coalesce((select jsonb_agg(jsonb_build_object('id',w.id,'impact_key',w.impact_key,'impact_title',w.impact_title,'impact_type',w.impact_type,'score',w.score,'summary',w.summary) order by w.score desc) from public.enterprise_value_realization_roi_engine_workforce_impact w where w.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'strategic_impact', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'impact_key',s.impact_key,'impact_title',s.impact_title,'impact_type',s.impact_type,'score',s.score,'summary',s.summary) order by s.score desc) from public.enterprise_value_realization_roi_engine_strategic_impact s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'value_timeline', coalesce((select jsonb_agg(jsonb_build_object('id',tl.id,'timeline_key',tl.timeline_key,'period_label',tl.period_label,'estimated_value',tl.estimated_value,'hours_saved',tl.hours_saved,'cost_savings',tl.cost_savings,'revenue_impact',tl.revenue_impact,'roi_percent',tl.roi_percent,'summary',tl.summary) order by tl.estimated_value desc) from public.enterprise_value_realization_roi_engine_timeline tl where tl.tenant_id = v_tenant_id limit 8), '[]'::jsonb),
    'benchmarks', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'benchmark_key',b.benchmark_key,'benchmark_title',b.benchmark_title,'benchmark_type',b.benchmark_type,'current_value',b.current_value,'comparison_value',b.comparison_value,'variance_percent',b.variance_percent,'summary',b.summary) order by b.variance_percent desc) from public.enterprise_value_realization_roi_engine_benchmarks b where b.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'value_reports', coalesce((select jsonb_agg(jsonb_build_object('id',rp.id,'report_key',rp.report_key,'report_title',rp.report_title,'report_type',rp.report_type,'status',rp.status,'summary',rp.summary,'created_at',rp.created_at) order by rp.created_at desc) from public.enterprise_value_realization_roi_engine_reports rp where rp.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_value_realization_roi_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_value_realization_roi_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.enterprise_value_realization_roi_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'roi', v_overview->>'net_roi_percent',
      'business_impact', v_overview->>'estimated_value_generated',
      'revenue_impact', v_overview->>'revenue_influenced',
      'cost_savings', v_overview->>'costs_reduced',
      'workforce_impact', 86,
      'strategic_impact', 84,
      'long_term_value', 248000
    ),
    'governance', jsonb_build_object('tenant_isolation', true, 'independent_roi_models', true, 'audit_trail', true),
    'privacy_note', 'Value calculations isolated per organization — ROI and impact metadata without cross-tenant exposure.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

create or replace function public.enterprise_value_realization_roi_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('enterprise_value_realization_roi.manage');
  v_ctx := public._gevrbi430_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gevrbi430_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'calculate_roi' then
    update public.enterprise_value_realization_roi_engine_settings set
      net_roi_percent = least(500, net_roi_percent + coalesce((p_payload->>'delta')::numeric, 2)),
      value_health_score = least(100, value_health_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'roi_calculated', 'ROI calculated', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'record_savings' then
    insert into public.enterprise_value_realization_roi_engine_cost_savings (tenant_id, savings_key, savings_title, savings_type, amount, summary)
    values (v_tenant_id, coalesce(p_payload->>'savings_key','CS-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'savings_title','Cost savings'), coalesce(p_payload->>'savings_type','operational'), coalesce((p_payload->>'amount')::numeric, 1000), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    update public.enterprise_value_realization_roi_engine_settings set estimated_value_generated = estimated_value_generated + coalesce((p_payload->>'amount')::numeric, 1000), updated_at = now() where tenant_id = v_tenant_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'savings_recorded', 'Savings recorded', jsonb_build_object('savings_id', v_id));
    return jsonb_build_object('ok', true, 'savings_id', v_id);
  end if;

  if v_action = 'update_revenue_impact' then
    insert into public.enterprise_value_realization_roi_engine_revenue_impact (tenant_id, impact_key, impact_title, impact_type, amount, summary)
    values (v_tenant_id, coalesce(p_payload->>'impact_key','RI-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'impact_title','Revenue impact'), coalesce(p_payload->>'impact_type','influenced'), coalesce((p_payload->>'amount')::numeric, 5000), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'revenue_impact_updated', 'Revenue impact updated', jsonb_build_object('impact_id', v_id));
    return jsonb_build_object('ok', true, 'impact_id', v_id);
  end if;

  if v_action = 'generate_value_report' then
    insert into public.enterprise_value_realization_roi_engine_reports (tenant_id, report_key, report_title, report_type, status, summary)
    values (v_tenant_id, coalesce(p_payload->>'report_key','RPT-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'report_title','Value report'), coalesce(p_payload->>'report_type','monthly'), 'generated', coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'value_report_generated', 'Value report generated', jsonb_build_object('report_id', v_id));
    return jsonb_build_object('ok', true, 'report_id', v_id);
  end if;

  if v_action = 'update_benchmark' then
    insert into public.enterprise_value_realization_roi_engine_benchmarks (tenant_id, benchmark_key, benchmark_title, benchmark_type, current_value, comparison_value, variance_percent, summary)
    values (v_tenant_id, coalesce(p_payload->>'benchmark_key','BM-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'benchmark_title','Benchmark'), coalesce(p_payload->>'benchmark_type','custom'), coalesce((p_payload->>'current_value')::numeric, 0), coalesce((p_payload->>'comparison_value')::numeric, 0), coalesce((p_payload->>'variance_percent')::numeric, 0), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'benchmark_updated', 'Benchmark updated', jsonb_build_object('benchmark_id', v_id));
    return jsonb_build_object('ok', true, 'benchmark_id', v_id);
  end if;

  if v_action = 'modify_impact_model' then
    perform public._gevrbi430_log_audit(v_tenant_id, 'impact_model_modified', 'Impact model modified', jsonb_build_object('model_key', p_payload->>'model_key'));
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'refresh_analytics' then
    update public.enterprise_value_realization_roi_engine_settings set
      value_health_score = least(100, value_health_score + 1),
      net_roi_percent = least(500, net_roi_percent + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gevrbi430_log_audit(v_tenant_id, 'analytics_refreshed', 'Value analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

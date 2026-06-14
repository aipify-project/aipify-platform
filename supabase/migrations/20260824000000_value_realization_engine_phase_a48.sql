-- Phase A.48 — Value Realization Engine
-- Extends Customer Success (A.26), Innovation & Impact (A.28), Executive Insights (A.35), Change Management (A.47).

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_value_metrics (A.48 value_metrics — organization-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_value_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_name text not null,
  category text not null default 'workflow_optimization' check (
    category in (
      'support_efficiency', 'admin_time_savings', 'onboarding_improvements',
      'repetitive_work_reduction', 'faster_decision_making', 'customer_satisfaction',
      'workflow_optimization'
    )
  ),
  baseline_value numeric not null default 0,
  current_value numeric not null default 0,
  improvement_percentage numeric not null default 0,
  measurement_period text not null default 'monthly' check (
    measurement_period in ('monthly', 'quarterly', 'annually')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_name, measurement_period)
);

create index if not exists organization_value_metrics_org_idx
  on public.organization_value_metrics (organization_id, category, measurement_period);

alter table public.organization_value_metrics enable row level security;
revoke all on public.organization_value_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. value_baselines
-- ---------------------------------------------------------------------------
create table if not exists public.value_baselines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  baseline_type text not null check (
    baseline_type in (
      'support_response_time', 'resolution_time', 'manual_task_estimate',
      'approval_turnaround', 'training_completion'
    )
  ),
  baseline_value numeric not null default 0,
  unit text not null default 'minutes',
  metadata jsonb not null default '{}'::jsonb,
  captured_by uuid references public.users (id) on delete set null,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists value_baselines_org_type_idx
  on public.value_baselines (organization_id, baseline_type, captured_at desc);

alter table public.value_baselines enable row level security;
revoke all on public.value_baselines from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. value_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.value_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_name text not null,
  milestone_key text not null check (
    milestone_key in (
      'first_100_hours_saved', 'onboarding_improvement', 'support_target',
      'automation_target', 'decision_speed_target', 'workflow_optimization_target'
    )
  ),
  target_value numeric not null default 0,
  current_value numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'achieved', 'paused')),
  achieved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists value_milestones_org_idx
  on public.value_milestones (organization_id, status, created_at desc);

alter table public.value_milestones enable row level security;
revoke all on public.value_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_value_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_value_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  reporting_enabled boolean not null default true,
  default_measurement_period text not null default 'monthly' check (
    default_measurement_period in ('monthly', 'quarterly', 'annually')
  ),
  executive_visibility boolean not null default true,
  auto_suggest_improvements boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_value_settings enable row level security;
revoke all on public.organization_value_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. value_realization_reports
-- ---------------------------------------------------------------------------
create table if not exists public.value_realization_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null check (
    report_type in ('roi', 'operational_impact', 'value_realization', 'strategic_improvement')
  ),
  period_start date,
  period_end date,
  status text not null default 'generated' check (status in ('draft', 'generated', 'exported')),
  summary_metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.users (id) on delete set null,
  generated_at timestamptz not null default now(),
  exported_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists value_realization_reports_org_idx
  on public.value_realization_reports (organization_id, report_type, generated_at desc);

alter table public.value_realization_reports enable row level security;
revoke all on public.value_realization_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'value_realization', v.description
from (values
  ('value.view', 'View Value', 'View value metrics, baselines, and milestones'),
  ('value.manage', 'Manage Value', 'Capture baselines and record value metrics'),
  ('value.export', 'Export Value', 'Generate and export value reports'),
  ('value.review', 'Review Value', 'Review milestones and improvement suggestions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'value.view'), ('owner', 'value.manage'), ('owner', 'value.export'), ('owner', 'value.review'),
  ('administrator', 'value.view'), ('administrator', 'value.manage'), ('administrator', 'value.export'), ('administrator', 'value.review'),
  ('manager', 'value.view'), ('manager', 'value.manage'), ('manager', 'value.export'), ('manager', 'value.review'),
  ('support_agent', 'value.view'),
  ('viewer', 'value.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_vre_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._vre_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'value_metric',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._vre_calc_improvement(p_baseline numeric, p_current numeric)
returns numeric language sql immutable as $$
  select case
    when coalesce(p_baseline, 0) = 0 then 0
    else round(((p_baseline - p_current) / p_baseline) * 100, 2)
  end;
$$;

create or replace function public._vre_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_value_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._vre_seed_metrics(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_value_metrics (
    organization_id, metric_name, category, baseline_value, current_value,
    improvement_percentage, measurement_period
  )
  select p_organization_id, v.name, v.cat, v.baseline, v.current, v.improvement, 'monthly'
  from (values
    ('Support first response (minutes)', 'support_efficiency', 120::numeric, 48::numeric, 60.0),
    ('Support resolution (hours)', 'support_efficiency', 48::numeric, 22::numeric, 54.2),
    ('Admin task time saved (hours/month)', 'admin_time_savings', 40::numeric, 62::numeric, -55.0),
    ('Onboarding completion (days)', 'onboarding_improvements', 14::numeric, 7::numeric, 50.0),
    ('Repetitive tasks automated (count)', 'repetitive_work_reduction', 12::numeric, 28::numeric, -133.3),
    ('Approval turnaround (hours)', 'faster_decision_making', 72::numeric, 36::numeric, 50.0),
    ('Customer satisfaction score', 'customer_satisfaction', 72::numeric, 84::numeric, -16.7),
    ('Workflow optimization index', 'workflow_optimization', 55::numeric, 78::numeric, -41.8)
  ) as v(name, cat, baseline, current, improvement)
  on conflict (organization_id, metric_name, measurement_period) do nothing;
end; $$;

create or replace function public._vre_seed_baselines(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.value_baselines (organization_id, baseline_type, baseline_value, unit, metadata)
  select p_organization_id, v.type, v.val, v.unit, v.meta
  from (values
    ('support_response_time', 120::numeric, 'minutes', '{"source":"seed","note":"metadata only"}'::jsonb),
    ('resolution_time', 48::numeric, 'hours', '{"source":"seed","note":"metadata only"}'::jsonb),
    ('manual_task_estimate', 40::numeric, 'hours_per_month', '{"source":"seed","note":"metadata only"}'::jsonb),
    ('approval_turnaround', 72::numeric, 'hours', '{"source":"seed","note":"metadata only"}'::jsonb),
    ('training_completion', 65::numeric, 'percent', '{"source":"seed","note":"metadata only"}'::jsonb)
  ) as v(type, val, unit, meta)
  where not exists (
    select 1 from public.value_baselines vb
    where vb.organization_id = p_organization_id and vb.baseline_type = v.type
  );
end; $$;

create or replace function public._vre_seed_milestones(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.value_milestones (
    organization_id, milestone_name, milestone_key, target_value, current_value, status, metadata
  )
  select p_organization_id, v.name, v.key, v.target, v.current, v.status, v.meta
  from (values
    ('First 100 hours saved', 'first_100_hours_saved', 100::numeric, 42::numeric, 'pending', '{"unit":"hours"}'::jsonb),
    ('Onboarding time reduced 50%', 'onboarding_improvement', 50::numeric, 35::numeric, 'pending', '{"unit":"percent"}'::jsonb),
    ('Support efficiency target', 'support_target', 60::numeric, 54::numeric, 'pending', '{"unit":"percent_improvement"}'::jsonb),
    ('Automation adoption target', 'automation_target', 25::numeric, 18::numeric, 'pending', '{"unit":"automations"}'::jsonb)
  ) as v(name, key, target, current, status, meta)
  where not exists (
    select 1 from public.value_milestones vm
    where vm.organization_id = p_organization_id and vm.milestone_key = v.key
  );
end; $$;

create or replace function public._vre_customer_success_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'customer_success_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'latest_score', coalesce((
      select score from public.customer_success_health_scores
      where organization_id = p_organization_id order by assessed_at desc limit 1
    ), 0),
    'open_interventions', coalesce((
      select count(*) from public.customer_success_interventions
      where organization_id = p_organization_id and status in ('open', 'in_progress')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._vre_innovation_impact_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_impact_metrics' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'metrics_count', coalesce((
      select count(*) from public.organization_impact_metrics where organization_id = p_organization_id
    ), 0),
    'avg_improvement', coalesce((
      select round(avg(improvement_percentage), 2) from public.organization_impact_metrics
      where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._vre_change_management_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'change_initiatives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_initiatives', coalesce((
      select count(*) from public.change_initiatives
      where organization_id = p_organization_id and status in ('planning', 'in_progress')
    ), 0),
    'completed_milestones', coalesce((
      select count(*) from public.change_milestones
      where organization_id = p_organization_id and status = 'completed'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.capture_value_baseline(
  p_baseline_type text,
  p_baseline_value numeric,
  p_unit text default 'minutes',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.value_baselines; v_user_id uuid;
begin
  perform public._irp_require_permission('value.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._vre_ensure_settings(v_org_id);

  insert into public.value_baselines (
    organization_id, baseline_type, baseline_value, unit, metadata, captured_by
  )
  values (
    v_org_id, p_baseline_type, coalesce(p_baseline_value, 0),
    coalesce(nullif(trim(p_unit), ''), 'minutes'),
    coalesce(p_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._vre_log(
    v_org_id, 'value_baseline_captured', 'value_baseline', v_row.id,
    jsonb_build_object('baseline_type', p_baseline_type, 'baseline_value', p_baseline_value)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_value_metric(
  p_metric_name text,
  p_category text default 'workflow_optimization',
  p_baseline_value numeric default 0,
  p_current_value numeric default 0,
  p_measurement_period text default 'monthly'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_value_metrics;
begin
  perform public._irp_require_permission('value.manage');
  v_org_id := public._mta_require_organization();
  perform public._vre_ensure_settings(v_org_id);

  if coalesce(trim(p_metric_name), '') = '' then
    raise exception 'Metric name required';
  end if;

  insert into public.organization_value_metrics (
    organization_id, metric_name, category, baseline_value, current_value,
    improvement_percentage, measurement_period
  )
  values (
    v_org_id, left(trim(p_metric_name), 200), p_category,
    coalesce(p_baseline_value, 0), coalesce(p_current_value, 0),
    public._vre_calc_improvement(p_baseline_value, p_current_value),
    coalesce(p_measurement_period, 'monthly')
  )
  returning * into v_row;

  perform public._vre_log(
    v_org_id, 'value_metric_recorded', 'value_metric', v_row.id,
    jsonb_build_object('metric_name', v_row.metric_name, 'category', v_row.category)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_value_metric(
  p_metric_id uuid,
  p_current_value numeric,
  p_baseline_value numeric default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_value_metrics;
begin
  perform public._irp_require_permission('value.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_value_metrics
  set
    current_value = coalesce(p_current_value, current_value),
    baseline_value = coalesce(p_baseline_value, baseline_value),
    improvement_percentage = public._vre_calc_improvement(
      coalesce(p_baseline_value, baseline_value),
      coalesce(p_current_value, current_value)
    ),
    updated_at = now()
  where id = p_metric_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Value metric not found'; end if;

  perform public._vre_log(
    v_org_id, 'value_metric_updated', 'value_metric', v_row.id,
    jsonb_build_object(
      'metric_name', v_row.metric_name,
      'current_value', v_row.current_value,
      'improvement_percentage', v_row.improvement_percentage,
      'baseline_override', p_baseline_value is not null
    )
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_value_report(p_report_type text default 'value_realization')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_id uuid; v_user_id uuid;
  v_metrics_count int; v_avg_improvement numeric; v_milestones_achieved int;
begin
  perform public._irp_require_permission('value.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._vre_seed_metrics(v_org_id);
  perform public._vre_seed_milestones(v_org_id);

  select count(*), round(avg(improvement_percentage), 2)
  into v_metrics_count, v_avg_improvement
  from public.organization_value_metrics where organization_id = v_org_id;

  select count(*) into v_milestones_achieved
  from public.value_milestones
  where organization_id = v_org_id and status = 'achieved';

  insert into public.value_realization_reports (
    organization_id, report_type, period_start, period_end, summary_metadata, generated_by
  )
  values (
    v_org_id,
    coalesce(nullif(trim(p_report_type), ''), 'value_realization'),
    date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month - 1 day')::date,
    jsonb_build_object(
      'metrics_count', coalesce(v_metrics_count, 0),
      'avg_improvement', coalesce(v_avg_improvement, 0),
      'milestones_achieved', coalesce(v_milestones_achieved, 0),
      'privacy_note', 'Metadata only — no PII',
      'sections', jsonb_build_array('roi', 'operational_impact', 'value_realization', 'strategic_improvement')
    ),
    v_user_id
  )
  returning id into v_id;

  perform public._vre_log(
    v_org_id, 'value_report_generated', 'value_report', v_id,
    jsonb_build_object('report_type', p_report_type)
  );

  return jsonb_build_object('id', v_id, 'report_type', p_report_type, 'status', 'generated');
end; $$;

create or replace function public.export_value_report(p_report_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.value_realization_reports;
begin
  perform public._irp_require_permission('value.export');
  v_org_id := public._mta_require_organization();

  update public.value_realization_reports
  set status = 'exported', exported_at = now()
  where id = p_report_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Value report not found'; end if;

  perform public._vre_log(
    v_org_id, 'value_report_exported', 'value_report', v_row.id,
    jsonb_build_object('report_type', v_row.report_type)
  );

  return jsonb_build_object(
    'id', v_row.id,
    'report_type', v_row.report_type,
    'status', v_row.status,
    'period_start', v_row.period_start,
    'period_end', v_row.period_end,
    'summary_metadata', v_row.summary_metadata,
    'exported_at', v_row.exported_at,
    'privacy_note', 'Metadata only — no PII'
  );
end; $$;

create or replace function public.record_value_milestone(
  p_milestone_id uuid,
  p_current_value numeric default null,
  p_status text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.value_milestones;
begin
  perform public._irp_require_permission('value.review');
  v_org_id := public._mta_require_organization();

  update public.value_milestones
  set
    current_value = coalesce(p_current_value, current_value),
    status = coalesce(p_status, status),
    achieved_at = case
      when coalesce(p_status, status) = 'achieved' then now()
      else achieved_at
    end,
    updated_at = now()
  where id = p_milestone_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Value milestone not found'; end if;

  perform public._vre_log(
    v_org_id, 'value_milestone_adjusted', 'value_milestone', v_row.id,
    jsonb_build_object(
      'milestone_key', v_row.milestone_key,
      'current_value', v_row.current_value,
      'status', v_row.status
    )
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.suggest_value_improvements()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_suggestions jsonb;
begin
  perform public._irp_require_permission('value.review');
  v_org_id := public._mta_require_organization();
  perform public._vre_seed_metrics(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'category', m.category,
    'metric_name', m.metric_name,
    'improvement_percentage', m.improvement_percentage,
    'recommendation', case m.category
      when 'support_efficiency' then 'Review support triage automation and knowledge gaps'
      when 'admin_time_savings' then 'Identify repetitive admin tasks for workflow automation'
      when 'onboarding_improvements' then 'Shorten onboarding paths with guided checklists'
      when 'repetitive_work_reduction' then 'Enable approved automations for high-volume tasks'
      when 'faster_decision_making' then 'Streamline approval chains for low-risk actions'
      when 'customer_satisfaction' then 'Align support SLAs with customer success health scores'
      else 'Review workflow optimization opportunities with executive stakeholders'
    end,
    'confidence', case when abs(m.improvement_percentage) >= 30 then 'high' when abs(m.improvement_percentage) >= 10 then 'moderate' else 'low' end
  ) order by abs(m.improvement_percentage) desc), '[]'::jsonb)
  into v_suggestions
  from public.organization_value_metrics m
  where m.organization_id = v_org_id
  limit 5;

  return jsonb_build_object(
    'suggestions', v_suggestions,
    'scaffold', true,
    'privacy_note', 'Metadata only — no PII'
  );
end; $$;

create or replace function public.get_value_realization_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_value_settings;
begin
  perform public._irp_require_permission('value.view');
  v_org_id := public._mta_require_organization();
  perform public._vre_ensure_settings(v_org_id);
  perform public._vre_seed_metrics(v_org_id);
  perform public._vre_seed_baselines(v_org_id);
  perform public._vre_seed_milestones(v_org_id);

  select * into v_settings from public.organization_value_settings where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Outcome-focused value measurement — baselines, improvements, executive visibility, and evidence-based accountability.',
    'principles', jsonb_build_array(
      'Outcome-focused measurement',
      'Tenant-aware reporting',
      'Executive visibility',
      'Evidence-based improvements',
      'Audit-supported accountability'
    ),
    'summary', jsonb_build_object(
      'metrics_count', coalesce((
        select count(*) from public.organization_value_metrics where organization_id = v_org_id
      ), 0),
      'avg_improvement', coalesce((
        select round(avg(improvement_percentage), 2) from public.organization_value_metrics
        where organization_id = v_org_id
      ), 0),
      'baselines_captured', coalesce((
        select count(*) from public.value_baselines where organization_id = v_org_id
      ), 0),
      'milestones_achieved', coalesce((
        select count(*) from public.value_milestones
        where organization_id = v_org_id and status = 'achieved'
      ), 0),
      'pending_milestones', coalesce((
        select count(*) from public.value_milestones
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'reports_generated', coalesce((
        select count(*) from public.value_realization_reports where organization_id = v_org_id
      ), 0)
    ),
    'metrics', coalesce((
      select jsonb_agg(row_to_json(m) order by m.updated_at desc)
      from public.organization_value_metrics m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'baselines', coalesce((
      select jsonb_agg(row_to_json(b) order by b.captured_at desc)
      from public.value_baselines b where b.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(row_to_json(vm) order by vm.created_at)
      from public.value_milestones vm where vm.organization_id = v_org_id
    ), '[]'::jsonb),
    'settings', row_to_json(v_settings)::jsonb,
    'integration_notes', jsonb_build_object(
      'customer_success', 'Extends Customer Success (A.26) health alignment',
      'innovation_impact', 'Builds on Innovation & Impact (A.28) baselines',
      'executive_insights', 'Executive visibility via A.35 report types',
      'change_management', 'Links adoption outcomes from Change Management (A.47)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._vre_customer_success_summary(v_org_id),
      'innovation_impact', public._vre_innovation_impact_summary(v_org_id),
      'change_management', public._vre_change_management_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_value_realization_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._vre_seed_metrics(v_org_id);
  perform public._vre_seed_milestones(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Measure operational value with evidence-based baselines and executive-ready reports.',
    'metrics_count', coalesce((
      select count(*) from public.organization_value_metrics where organization_id = v_org_id
    ), 0),
    'avg_improvement', coalesce((
      select round(avg(improvement_percentage), 2) from public.organization_value_metrics
      where organization_id = v_org_id
    ), 0),
    'pending_milestones', coalesce((
      select count(*) from public.value_milestones
      where organization_id = v_org_id and status = 'pending'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'value-realization-engine', 'Value Realization Engine', 'Outcome-focused value measurement with executive visibility and evidence-based improvements.', 'authenticated', 80
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'value-realization-engine' and tenant_id is null);

grant execute on function public.capture_value_baseline(text, numeric, text, jsonb) to authenticated;
grant execute on function public.record_value_metric(text, text, numeric, numeric, text) to authenticated;
grant execute on function public.update_value_metric(uuid, numeric, numeric) to authenticated;
grant execute on function public.generate_value_report(text) to authenticated;
grant execute on function public.export_value_report(uuid) to authenticated;
grant execute on function public.record_value_milestone(uuid, numeric, text) to authenticated;
grant execute on function public.suggest_value_improvements() to authenticated;
grant execute on function public.get_value_realization_engine_dashboard() to authenticated;
grant execute on function public.get_value_realization_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._vre_ensure_settings(v_org_id);
    perform public._vre_seed_metrics(v_org_id);
    perform public._vre_seed_baselines(v_org_id);
    perform public._vre_seed_milestones(v_org_id);
  end loop;
end $$;

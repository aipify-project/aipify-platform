-- Phase 413 — Digital Employee Recruitment, Provisioning & Workforce Planning Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/digital-workforce/recruitment. Helpers: _gderwp413_*
-- Workforce planning, recruitment, hiring requests, provisioning, and capacity forecasting.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.digital_workforce_recruitment_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  planning_mode text not null default 'supervised' check (
    planning_mode in ('supervised', 'assisted', 'enterprise')
  ),
  health_score integer not null default 73 check (health_score between 0 and 100),
  automation_coverage_percent numeric(5, 2) not null default 0 check (automation_coverage_percent between 0 and 100),
  workforce_roi_percent numeric(5, 2) not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_workforce_position_library (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  position_key text not null,
  position_name text not null,
  position_type text not null default 'custom' check (
    position_type in (
      'support_specialist', 'sales_specialist', 'marketing_specialist', 'hr_specialist',
      'finance_specialist', 'compliance_specialist', 'warehouse_specialist',
      'industry_specialist', 'executive_assistant', 'custom'
    )
  ),
  department text not null default '',
  responsibilities jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  knowledge_requirements jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  training_paths jsonb not null default '[]'::jsonb,
  success_metrics jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, position_key)
);

create index if not exists digital_workforce_position_library_tenant_idx
  on public.digital_workforce_position_library (tenant_id, position_type);

create table if not exists public.digital_workforce_hiring_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_key text not null,
  request_title text not null,
  request_type text not null default 'department' check (
    request_type in (
      'department', 'manager', 'executive', 'capacity',
      'project', 'expansion', 'custom'
    )
  ),
  request_status text not null default 'submitted' check (
    request_status in (
      'draft', 'submitted', 'pending_approval', 'approved',
      'provisioned', 'rejected', 'cancelled'
    )
  ),
  position_id uuid references public.digital_workforce_position_library (id) on delete set null,
  department text not null default '',
  business_justification text not null default '',
  requested_by text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_key)
);

create index if not exists digital_workforce_hiring_requests_tenant_idx
  on public.digital_workforce_hiring_requests (tenant_id, request_status);

create table if not exists public.digital_workforce_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  plan_key text not null,
  plan_name text not null,
  department text not null default '',
  current_headcount integer not null default 0 check (current_headcount >= 0),
  future_headcount integer not null default 0 check (future_headcount >= 0),
  capacity_utilization numeric(5, 2) not null default 0 check (capacity_utilization between 0 and 100),
  gap_type text not null default 'capacity' check (
    gap_type in ('skill', 'department', 'capacity', 'knowledge', 'coverage', 'compliance', 'none')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, plan_key)
);

create index if not exists digital_workforce_plans_tenant_idx
  on public.digital_workforce_plans (tenant_id, department);

create table if not exists public.digital_workforce_forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  forecast_horizon text not null default 'quarter' check (
    forecast_horizon in ('month', 'quarter', 'year', 'custom')
  ),
  projected_hires integer not null default 0 check (projected_hires >= 0),
  projected_capacity numeric(5, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, forecast_key)
);

create index if not exists digital_workforce_forecasts_tenant_idx
  on public.digital_workforce_forecasts (tenant_id, updated_at desc);

create table if not exists public.digital_workforce_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'capacity_limit', 'finance_specialists_recommended', 'marketing_overload',
      'industry_specialist_needed', 'expansion_required', 'department_coverage',
      'capacity_risk', 'expansion_recommended', 'automation_opportunity', 'hiring_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_advisor_signals_tenant_idx
  on public.digital_workforce_advisor_signals (tenant_id, created_at desc);

create table if not exists public.digital_workforce_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'position_created', 'hiring_request_submitted', 'hiring_request_approved',
      'employee_provisioned', 'role_assigned', 'training_assigned',
      'activation_completed', 'forecast_generated', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists digital_workforce_audit_logs_tenant_idx
  on public.digital_workforce_audit_logs (tenant_id, created_at desc);

alter table public.digital_workforce_recruitment_settings enable row level security;
alter table public.digital_workforce_position_library enable row level security;
alter table public.digital_workforce_hiring_requests enable row level security;
alter table public.digital_workforce_plans enable row level security;
alter table public.digital_workforce_forecasts enable row level security;
alter table public.digital_workforce_advisor_signals enable row level security;
alter table public.digital_workforce_audit_logs enable row level security;

revoke all on public.digital_workforce_recruitment_settings from authenticated, anon;
revoke all on public.digital_workforce_position_library from authenticated, anon;
revoke all on public.digital_workforce_hiring_requests from authenticated, anon;
revoke all on public.digital_workforce_plans from authenticated, anon;
revoke all on public.digital_workforce_forecasts from authenticated, anon;
revoke all on public.digital_workforce_advisor_signals from authenticated, anon;
revoke all on public.digital_workforce_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'digital_workforce_recruitment_provisioning_engine', v.description
from (values
  ('digital_workforce.view', 'View Digital Workforce Planning', 'View workforce planning, recruitment, hiring requests, and capacity'),
  ('digital_workforce.manage', 'Manage Digital Workforce Planning', 'Manage positions, hiring requests, provisioning, and workforce forecasts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gderwp413_*
-- ---------------------------------------------------------------------------
create or replace function public._gderwp413_require_access()
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
    raise exception 'Digital Workforce Recruitment requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gderwp413_log_audit(
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
  insert into public.digital_workforce_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gderwp413_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.digital_workforce_recruitment_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.digital_workforce_recruitment_settings;
begin
  insert into public.digital_workforce_recruitment_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.digital_workforce_recruitment_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gderwp413_map_position_to_lifecycle_role(p_position_type text)
returns text
language sql
immutable
as $$
  select case p_position_type
    when 'marketing_specialist' then 'sales_specialist'
    when 'warehouse_specialist' then 'operations_specialist'
    when 'industry_specialist' then 'industry_specialist'
    else coalesce(nullif(p_position_type, ''), 'custom')
  end;
$$;

create or replace function public._gderwp413_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_workforce_position_library where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_workforce_position_library (
    tenant_id, position_key, position_name, position_type, department, responsibilities, skills
  ) values
    (p_tenant_id, 'support-specialist', 'Support Specialist', 'support_specialist', 'Support', '["triage","knowledge","escalation"]'::jsonb, '["support","communication"]'::jsonb),
    (p_tenant_id, 'finance-specialist', 'Finance Specialist', 'finance_specialist', 'Finance', '["reporting","approvals","analysis"]'::jsonb, '["finance","compliance"]'::jsonb),
    (p_tenant_id, 'compliance-specialist', 'Compliance Specialist', 'compliance_specialist', 'Compliance', '["policy","audit","governance"]'::jsonb, '["compliance","risk"]'::jsonb),
    (p_tenant_id, 'executive-assistant', 'Executive Assistant', 'executive_assistant', 'Executive', '["briefings","coordination","priorities"]'::jsonb, '["executive","planning"]'::jsonb);

  insert into public.digital_workforce_plans (
    tenant_id, plan_key, plan_name, department, current_headcount, future_headcount, capacity_utilization, gap_type
  ) values
    (p_tenant_id, 'support-plan', 'Support workforce plan', 'Support', 1, 2, 78, 'capacity'),
    (p_tenant_id, 'finance-plan', 'Finance workforce plan', 'Finance', 0, 1, 45, 'department');

  perform public._gderwp413_log_audit(
    p_tenant_id, 'engine_activated', 'Default position library and workforce plans seeded',
    jsonb_build_object('positions', 4, 'plans', 2)
  );
end;
$$;

create or replace function public._gderwp413_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_workforce_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_workforce_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'capacity_limit',
      'Support capacity indicators may be approaching operational limits.',
      'Capacity constraints delay coverage and increase escalation risk.',
      'Review Workforce Planning and submit a hiring request if justified.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'expansion_recommended',
      'Workforce expansion may be recommended to meet department demand.',
      'Planned hiring improves coverage without uncontrolled automation.',
      'Open Recruitment Center and review open positions.',
      'moderate', 'moderate'
    ),
    (
      p_tenant_id, 'hiring_review',
      'Pending hiring requests may require leadership review.',
      'Approved hiring enables governed provisioning and training.',
      'Review Hiring Requests and confirm business justification.',
      'low', 'high'
    );
end;
$$;

create or replace function public._gderwp413_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_employees integer := 0;
  v_open_positions integer := 0;
  v_departments integer := 0;
  v_workload numeric := 0;
  v_capacity numeric := 0;
  v_automation numeric := 0;
  v_health numeric := 73;
  v_pending_requests integer := 0;
begin
  select count(*)::int into v_employees
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status in ('active', 'training', 'provisioning');

  select count(*)::int into v_open_positions
  from public.digital_workforce_hiring_requests
  where tenant_id = p_tenant_id and request_status in ('submitted', 'pending_approval', 'approved');

  select count(distinct department)::int into v_departments
  from public.digital_workforce_position_library
  where tenant_id = p_tenant_id and department != '';

  select coalesce(avg(capacity_utilization), 0) into v_workload
  from public.digital_workforce_plans where tenant_id = p_tenant_id;

  v_capacity := greatest(0, 100 - v_workload);

  select coalesce(automation_coverage_percent, 0), coalesce(health_score, 73)
  into v_automation, v_health
  from public.digital_workforce_recruitment_settings where tenant_id = p_tenant_id;

  if v_automation = 0 and v_employees > 0 then
    v_automation := least(85, 40 + v_employees * 8);
  end if;

  select count(*)::int into v_pending_requests
  from public.digital_workforce_hiring_requests
  where tenant_id = p_tenant_id and request_status in ('submitted', 'pending_approval');

  return jsonb_build_object(
    'digital_employees', v_employees,
    'open_positions', v_open_positions,
    'departments', v_departments,
    'workload', round(v_workload, 1),
    'capacity', round(v_capacity, 1),
    'automation_coverage', round(v_automation, 1),
    'pending_hiring_requests', v_pending_requests,
    'workforce_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_workforce_recruitment_provisioning_center()
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
  v_settings public.digital_workforce_recruitment_settings;
  v_positions jsonb := '[]'::jsonb;
  v_requests jsonb := '[]'::jsonb;
  v_plans jsonb := '[]'::jsonb;
  v_forecasts jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('digital_workforce.view');
  v_ctx := public._gderwp413_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gderwp413_ensure_settings(v_org_id, v_tenant_id);
  perform public._gderwp413_seed_defaults(v_tenant_id);
  perform public._gderwp413_seed_advisor(v_tenant_id);
  v_overview := public._gderwp413_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'position_key', p.position_key, 'position_name', p.position_name,
    'position_type', p.position_type, 'department', p.department,
    'responsibilities', p.responsibilities, 'skills', p.skills
  ) order by p.position_name), '[]'::jsonb)
  into v_positions
  from public.digital_workforce_position_library p
  where p.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'request_key', r.request_key, 'request_title', r.request_title,
    'request_type', r.request_type, 'request_status', r.request_status,
    'department', r.department, 'position_id', r.position_id
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_requests
  from public.digital_workforce_hiring_requests r
  where r.tenant_id = v_tenant_id and r.request_status not in ('cancelled', 'rejected')
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pl.id, 'plan_key', pl.plan_key, 'plan_name', pl.plan_name,
    'department', pl.department, 'current_headcount', pl.current_headcount,
    'future_headcount', pl.future_headcount, 'capacity_utilization', pl.capacity_utilization,
    'gap_type', pl.gap_type
  ) order by pl.plan_name), '[]'::jsonb)
  into v_plans
  from public.digital_workforce_plans pl
  where pl.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'forecast_key', f.forecast_key, 'forecast_title', f.forecast_title,
    'forecast_horizon', f.forecast_horizon, 'projected_hires', f.projected_hires,
    'projected_capacity', f.projected_capacity
  ) order by f.updated_at desc), '[]'::jsonb)
  into v_forecasts
  from public.digital_workforce_forecasts f
  where f.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.digital_workforce_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.digital_workforce_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Organizations should ask what role they need to hire — not which AI model to use.',
    'mission', 'Digital Workforce Recruitment & Planning — plan, recruit, provision, and expand digital workforces with discipline.',
    'abos_principle', 'Scale digital workforces with the same discipline as human workforces. Planning creates efficiency. Governance creates trust.',
    'lifecycle_route', '/app/digital-employees',
    'distinction_note', 'Recruitment and workforce planning — distinct from Digital Employee Lifecycle performance management.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/digital-workforce/recruitment'),
      jsonb_build_object('key', 'planning', 'route', '/app/digital-workforce/planning'),
      jsonb_build_object('key', 'recruitment', 'route', '/app/digital-workforce/recruitment'),
      jsonb_build_object('key', 'positions', 'route', '/app/digital-workforce/positions'),
      jsonb_build_object('key', 'hiring', 'route', '/app/digital-workforce/hiring'),
      jsonb_build_object('key', 'provisioning', 'route', '/app/digital-workforce/provisioning'),
      jsonb_build_object('key', 'analytics', 'route', '/app/digital-workforce/analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/digital-workforce/governance')
    ),
    'positions', v_positions,
    'hiring_requests', v_requests,
    'workforce_plans', v_plans,
    'forecasts', v_forecasts,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'planning_route', '/app/digital-workforce/planning',
      'positions_route', '/app/digital-workforce/positions',
      'hiring_route', '/app/digital-workforce/hiring',
      'provisioning_route', '/app/digital-workforce/provisioning',
      'analytics_route', '/app/digital-workforce/analytics',
      'governance_route', '/app/digital-workforce/governance',
      'lifecycle_route', '/app/digital-employees',
      'orchestration_route', '/app/orchestration'
    ),
    'executive_dashboard', jsonb_build_object(
      'workforce_size', v_overview->>'digital_employees',
      'department_coverage', v_overview->>'departments',
      'capacity', v_overview->>'capacity',
      'utilization', v_overview->>'workload',
      'automation_coverage', v_overview->>'automation_coverage',
      'workforce_health_score', v_overview->>'workforce_health_score',
      'executive_route', '/app/digital-workforce/analytics'
    ),
    'privacy_note', 'Workforce planning isolated per organization — metadata-first planning with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.digital_workforce_recruitment_provisioning_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_position_id uuid;
  v_request_id uuid;
  v_employee_id uuid;
  v_forecast_id uuid;
  v_training_id uuid;
  v_position public.digital_workforce_position_library;
  v_request_title text;
  v_employee_name text;
  v_lifecycle_role text;
begin
  perform public._irp_require_permission('digital_workforce.manage');
  perform public._gderwp413_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gderwp413_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_position' then
    insert into public.digital_workforce_position_library (
      tenant_id, position_key, position_name, position_type, department, responsibilities, skills
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'position_key', 'pos-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'position_name', 'New position'),
      coalesce(p_payload->>'position_type', 'custom'),
      coalesce(p_payload->>'department', ''),
      coalesce(p_payload->'responsibilities', '[]'::jsonb),
      coalesce(p_payload->'skills', '[]'::jsonb)
    ) returning id into v_position_id;

    perform public._gderwp413_log_audit(
      v_tenant_id, 'position_created', 'Position created',
      jsonb_build_object('position_id', v_position_id)
    );

    return jsonb_build_object('ok', true, 'position_id', v_position_id);
  end if;

  if v_action = 'submit_hiring_request' then
    insert into public.digital_workforce_hiring_requests (
      tenant_id, request_key, request_title, request_type, request_status,
      position_id, department, business_justification, requested_by
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'request_key', 'HIRE-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'request_title', 'Hiring request'),
      coalesce(p_payload->>'request_type', 'department'),
      coalesce(p_payload->>'request_status', 'submitted'),
      nullif(p_payload->>'position_id', '')::uuid,
      coalesce(p_payload->>'department', ''),
      coalesce(p_payload->>'business_justification', ''),
      coalesce(p_payload->>'requested_by', 'Manager')
    ) returning id, request_title into v_request_id, v_request_title;

    perform public._gderwp413_log_audit(
      v_tenant_id, 'hiring_request_submitted', 'Hiring request submitted: ' || v_request_title,
      jsonb_build_object('request_id', v_request_id)
    );

    return jsonb_build_object('ok', true, 'request_id', v_request_id);
  end if;

  if v_action = 'approve_hiring_request' then
    update public.digital_workforce_hiring_requests
    set request_status = 'approved', updated_at = now()
    where id = nullif(p_payload->>'request_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_request_id;

    perform public._gderwp413_log_audit(
      v_tenant_id, 'hiring_request_approved', 'Hiring request approved',
      jsonb_build_object('request_id', v_request_id)
    );

    return jsonb_build_object('ok', true, 'request_id', v_request_id);
  end if;

  if v_action = 'provision_employee' then
    select * into v_position
    from public.digital_workforce_position_library
    where id = nullif(p_payload->>'position_id', '')::uuid and tenant_id = v_tenant_id;

    if v_position.id is null and nullif(p_payload->>'request_id', '') is not null then
      select pl.* into v_position
      from public.digital_workforce_hiring_requests hr
      join public.digital_workforce_position_library pl on pl.id = hr.position_id
      where hr.id = nullif(p_payload->>'request_id', '')::uuid and hr.tenant_id = v_tenant_id;
    end if;

    v_employee_name := coalesce(p_payload->>'employee_name', v_position.position_name, 'New digital employee');
    v_lifecycle_role := public._gderwp413_map_position_to_lifecycle_role(coalesce(v_position.position_type, 'custom'));

    insert into public.digital_employee_lifecycle_employees (
      tenant_id, employee_key, employee_name, department, employee_role,
      career_level, employee_status, supervisor_name, capabilities, permissions, knowledge_sources
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'employee_key', 'emp-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      v_employee_name,
      coalesce(v_position.department, p_payload->>'department', ''),
      v_lifecycle_role,
      'specialist',
      'provisioning',
      coalesce(p_payload->>'supervisor_name', 'Aipify Companion'),
      coalesce(v_position.skills, '[]'::jsonb),
      coalesce(v_position.permissions, '[]'::jsonb),
      coalesce(v_position.knowledge_requirements, '[]'::jsonb)
    ) returning id into v_employee_id;

    if nullif(p_payload->>'request_id', '') is not null then
      update public.digital_workforce_hiring_requests
      set request_status = 'provisioned', updated_at = now()
      where id = nullif(p_payload->>'request_id', '')::uuid and tenant_id = v_tenant_id;
    end if;

    insert into public.digital_employee_lifecycle_training (
      tenant_id, training_key, employee_id, training_type, training_title, training_status
    ) values (
      v_tenant_id,
      'TRN-' || upper(substr(gen_random_uuid()::text, 1, 8)),
      v_employee_id,
      'role',
      'Role onboarding training',
      'assigned'
    ) returning id into v_training_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'training_assigned', 'Provisioning training assigned',
      jsonb_build_object('employee_id', v_employee_id, 'training_id', v_training_id)
    );

    perform public._gderwp413_log_audit(
      v_tenant_id, 'employee_provisioned', 'Digital employee provisioned: ' || v_employee_name,
      jsonb_build_object('employee_id', v_employee_id, 'request_id', p_payload->>'request_id')
    );

    perform public._gderwp413_log_audit(
      v_tenant_id, 'role_assigned', 'Role assigned during provisioning',
      jsonb_build_object('employee_id', v_employee_id, 'role', v_lifecycle_role)
    );

    perform public._gderwp413_log_audit(
      v_tenant_id, 'training_assigned', 'Training assigned during provisioning',
      jsonb_build_object('employee_id', v_employee_id, 'training_id', v_training_id)
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id, 'training_id', v_training_id);
  end if;

  if v_action = 'generate_forecast' then
    insert into public.digital_workforce_forecasts (
      tenant_id, forecast_key, forecast_title, forecast_horizon, projected_hires, projected_capacity
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'forecast_key', 'FCST-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'forecast_title', 'Workforce forecast'),
      coalesce(p_payload->>'forecast_horizon', 'quarter'),
      coalesce((p_payload->>'projected_hires')::int, 1),
      coalesce((p_payload->>'projected_capacity')::numeric, 75)
    ) returning id into v_forecast_id;

    perform public._gderwp413_log_audit(
      v_tenant_id, 'forecast_generated', 'Workforce forecast generated',
      jsonb_build_object('forecast_id', v_forecast_id)
    );

    return jsonb_build_object('ok', true, 'forecast_id', v_forecast_id);
  end if;

  raise exception 'Unsupported digital workforce action: %', v_action;
end;
$$;

grant execute on function public.get_digital_workforce_recruitment_provisioning_center() to authenticated;
grant execute on function public.digital_workforce_recruitment_provisioning_action(jsonb) to authenticated;

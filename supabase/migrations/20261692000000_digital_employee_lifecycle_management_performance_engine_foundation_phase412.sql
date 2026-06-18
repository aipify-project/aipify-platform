-- Phase 412 — Digital Employee Lifecycle, Management & Performance Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/digital-employees. Helpers: _gdelmp412_*
-- HR system for digital workers — lifecycle, roles, training, performance, governance.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.digital_employee_lifecycle_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  governance_mode text not null default 'supervised' check (
    governance_mode in ('supervised', 'assisted', 'enterprise')
  ),
  health_score integer not null default 74 check (health_score between 0 and 100),
  training_coverage_percent numeric(5, 2) not null default 0 check (training_coverage_percent between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_employee_lifecycle_employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  employee_key text not null,
  employee_name text not null,
  department text not null default '',
  employee_role text not null default 'custom' check (
    employee_role in (
      'support_specialist', 'sales_specialist', 'hr_specialist', 'finance_specialist',
      'operations_specialist', 'compliance_specialist', 'industry_specialist',
      'executive_assistant', 'custom'
    )
  ),
  career_level text not null default 'specialist' check (
    career_level in (
      'junior', 'specialist', 'senior_specialist', 'lead_specialist',
      'department_lead', 'executive_agent', 'custom'
    )
  ),
  employee_status text not null default 'provisioning' check (
    employee_status in (
      'provisioning', 'training', 'active', 'paused', 'restricted', 'retired', 'archived'
    )
  ),
  supervisor_name text not null default '',
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  health_score integer not null default 75 check (health_score between 0 and 100),
  tasks_completed integer not null default 0 check (tasks_completed >= 0),
  success_rate numeric(5, 2) not null default 0 check (success_rate between 0 and 100),
  capabilities jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  knowledge_sources jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, employee_key)
);

create index if not exists digital_employee_lifecycle_employees_tenant_idx
  on public.digital_employee_lifecycle_employees (tenant_id, employee_status);

create table if not exists public.digital_employee_lifecycle_role_definitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  role_key text not null,
  role_name text not null,
  responsibilities jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  knowledge_access jsonb not null default '[]'::jsonb,
  tool_access jsonb not null default '[]'::jsonb,
  workflow_access jsonb not null default '[]'::jsonb,
  approval_rights jsonb not null default '[]'::jsonb,
  governance_rules jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, role_key)
);

create index if not exists digital_employee_lifecycle_role_definitions_tenant_idx
  on public.digital_employee_lifecycle_role_definitions (tenant_id);

create table if not exists public.digital_employee_lifecycle_training (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  training_key text not null,
  employee_id uuid references public.digital_employee_lifecycle_employees (id) on delete set null,
  training_type text not null default 'role' check (
    training_type in (
      'knowledge', 'role', 'industry', 'compliance', 'workflow', 'skill', 'continuous'
    )
  ),
  training_title text not null,
  training_status text not null default 'assigned' check (
    training_status in ('assigned', 'in_progress', 'completed', 'expired', 'archived')
  ),
  coverage_percent numeric(5, 2) not null default 0 check (coverage_percent between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (tenant_id, training_key)
);

create index if not exists digital_employee_lifecycle_training_tenant_idx
  on public.digital_employee_lifecycle_training (tenant_id, training_status);

create table if not exists public.digital_employee_lifecycle_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  employee_id uuid references public.digital_employee_lifecycle_employees (id) on delete set null,
  review_type text not null default 'performance' check (
    review_type in ('performance', 'governance', 'quality', 'compliance', 'improvement')
  ),
  review_status text not null default 'scheduled' check (
    review_status in ('scheduled', 'in_progress', 'completed', 'archived')
  ),
  performance_score integer check (performance_score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists digital_employee_lifecycle_reviews_tenant_idx
  on public.digital_employee_lifecycle_reviews (tenant_id, review_status);

create table if not exists public.digital_employee_lifecycle_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'retraining_required', 'performance_improved', 'knowledge_incomplete',
      'role_expansion', 'governance_review', 'training_needed', 'performance_exceeds',
      'knowledge_gaps', 'promotion_eligible'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists digital_employee_lifecycle_advisor_signals_tenant_idx
  on public.digital_employee_lifecycle_advisor_signals (tenant_id, created_at desc);

create table if not exists public.digital_employee_lifecycle_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'employee_created', 'role_assigned', 'training_assigned', 'training_completed',
      'performance_review_completed', 'promotion_approved', 'permission_changed',
      'employee_retired', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists digital_employee_lifecycle_audit_logs_tenant_idx
  on public.digital_employee_lifecycle_audit_logs (tenant_id, created_at desc);

alter table public.digital_employee_lifecycle_settings enable row level security;
alter table public.digital_employee_lifecycle_employees enable row level security;
alter table public.digital_employee_lifecycle_role_definitions enable row level security;
alter table public.digital_employee_lifecycle_training enable row level security;
alter table public.digital_employee_lifecycle_reviews enable row level security;
alter table public.digital_employee_lifecycle_advisor_signals enable row level security;
alter table public.digital_employee_lifecycle_audit_logs enable row level security;

revoke all on public.digital_employee_lifecycle_settings from authenticated, anon;
revoke all on public.digital_employee_lifecycle_employees from authenticated, anon;
revoke all on public.digital_employee_lifecycle_role_definitions from authenticated, anon;
revoke all on public.digital_employee_lifecycle_training from authenticated, anon;
revoke all on public.digital_employee_lifecycle_reviews from authenticated, anon;
revoke all on public.digital_employee_lifecycle_advisor_signals from authenticated, anon;
revoke all on public.digital_employee_lifecycle_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'digital_employee_lifecycle_management_performance_engine', v.description
from (values
  ('digital_employees.view', 'View Digital Employees', 'View digital employee directory, performance, training, and lifecycle'),
  ('digital_employees.manage', 'Manage Digital Employees', 'Manage digital employees, roles, training, reviews, and lifecycle settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gdelmp412_*
-- ---------------------------------------------------------------------------
create or replace function public._gdelmp412_require_access()
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
    raise exception 'Digital Employee Lifecycle requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gdelmp412_log_audit(
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
  insert into public.digital_employee_lifecycle_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gdelmp412_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.digital_employee_lifecycle_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.digital_employee_lifecycle_settings;
begin
  insert into public.digital_employee_lifecycle_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.digital_employee_lifecycle_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gdelmp412_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_employee_lifecycle_employees where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_employee_lifecycle_employees (
    tenant_id, employee_key, employee_name, department, employee_role,
    career_level, employee_status, supervisor_name, performance_score, health_score
  ) values
    (
      p_tenant_id, 'companion-workforce', 'Aipify Companion', 'Executive',
      'executive_assistant', 'executive_agent', 'active', 'Organization Owner', 88, 90
    ),
    (
      p_tenant_id, 'support-specialist', 'Support Specialist', 'Support',
      'support_specialist', 'specialist', 'active', 'Aipify Companion', 82, 85
    ),
    (
      p_tenant_id, 'operations-specialist', 'Operations Specialist', 'Operations',
      'operations_specialist', 'senior_specialist', 'active', 'Aipify Companion', 80, 83
    ),
    (
      p_tenant_id, 'compliance-specialist', 'Compliance Specialist', 'Compliance',
      'compliance_specialist', 'specialist', 'training', 'Aipify Companion', 76, 78
    );

  insert into public.digital_employee_lifecycle_role_definitions (
    tenant_id, role_key, role_name, responsibilities
  ) values
    (p_tenant_id, 'support_specialist', 'Support Specialist', '["triage","knowledge","escalation"]'::jsonb),
    (p_tenant_id, 'compliance_specialist', 'Compliance Specialist', '["policy","audit","approvals"]'::jsonb);

  perform public._gdelmp412_log_audit(
    p_tenant_id, 'engine_activated', 'Default digital employee workforce seeded',
    jsonb_build_object('employees', 4, 'roles', 2)
  );
end;
$$;

create or replace function public._gdelmp412_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.digital_employee_lifecycle_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.digital_employee_lifecycle_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'training_needed',
      'One or more digital employees may require additional training coverage.',
      'Training coverage supports reliable performance and governance compliance.',
      'Review Training module and assign role or compliance training.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'governance_review',
      'Periodic governance review is recommended for active digital employees.',
      'Governance reviews maintain accountability and permission integrity.',
      'Open Governance module and schedule compliance reviews.',
      'low', 'high'
    ),
    (
      p_tenant_id, 'promotion_eligible',
      'Performance indicators may support career path progression for specialists.',
      'Structured promotion paths scale digital workforce capability responsibly.',
      'Review Performance and Promotion framework eligibility.',
      'moderate', 'moderate'
    );
end;
$$;

create or replace function public._gdelmp412_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_active integer := 0;
  v_departments integer := 0;
  v_assigned_tasks integer := 0;
  v_completed_tasks integer := 0;
  v_avg_performance numeric := 0;
  v_training_coverage numeric := 0;
  v_health numeric := 74;
begin
  select count(*)::int into v_active
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status in ('active', 'training');

  select count(distinct department)::int into v_departments
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status != 'archived' and department != '';

  select coalesce(sum(tasks_completed), 0)::int,
         coalesce(avg(performance_score), 0)
  into v_completed_tasks, v_avg_performance
  from public.digital_employee_lifecycle_employees
  where tenant_id = p_tenant_id and employee_status != 'archived';

  select count(*)::int into v_assigned_tasks
  from public.digital_employee_lifecycle_training
  where tenant_id = p_tenant_id and training_status in ('assigned', 'in_progress');

  select case when count(*) filter (where training_status = 'completed') > 0
    then round(avg(coverage_percent) filter (where training_status = 'completed')::numeric, 1)
    else 0 end
  into v_training_coverage
  from public.digital_employee_lifecycle_training
  where tenant_id = p_tenant_id;

  select coalesce(health_score, 74), coalesce(training_coverage_percent, 0)
  into v_health, v_training_coverage
  from public.digital_employee_lifecycle_settings where tenant_id = p_tenant_id;

  if v_training_coverage = 0 then
    v_training_coverage := case when v_active > 0 then 65 else 0 end;
  end if;

  return jsonb_build_object(
    'active_employees', v_active,
    'departments', v_departments,
    'assigned_tasks', v_assigned_tasks,
    'completed_tasks', v_completed_tasks,
    'performance_score', round(v_avg_performance, 1),
    'training_coverage', round(v_training_coverage, 1),
    'employee_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_digital_employee_lifecycle_management_center()
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
  v_settings public.digital_employee_lifecycle_settings;
  v_employees jsonb := '[]'::jsonb;
  v_roles jsonb := '[]'::jsonb;
  v_training jsonb := '[]'::jsonb;
  v_reviews jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('digital_employees.view');
  v_ctx := public._gdelmp412_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gdelmp412_ensure_settings(v_org_id, v_tenant_id);
  perform public._gdelmp412_seed_defaults(v_tenant_id);
  perform public._gdelmp412_seed_advisor(v_tenant_id);
  v_overview := public._gdelmp412_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'employee_key', e.employee_key, 'employee_name', e.employee_name,
    'department', e.department, 'employee_role', e.employee_role,
    'career_level', e.career_level, 'employee_status', e.employee_status,
    'supervisor_name', e.supervisor_name, 'performance_score', e.performance_score,
    'health_score', e.health_score, 'tasks_completed', e.tasks_completed,
    'success_rate', e.success_rate
  ) order by e.employee_name), '[]'::jsonb)
  into v_employees
  from public.digital_employee_lifecycle_employees e
  where e.tenant_id = v_tenant_id and e.employee_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'role_key', r.role_key, 'role_name', r.role_name,
    'responsibilities', r.responsibilities, 'permissions', r.permissions
  ) order by r.role_name), '[]'::jsonb)
  into v_roles
  from public.digital_employee_lifecycle_role_definitions r
  where r.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'training_key', t.training_key, 'training_title', t.training_title,
    'training_type', t.training_type, 'training_status', t.training_status,
    'coverage_percent', t.coverage_percent, 'employee_id', t.employee_id
  ) order by t.updated_at desc), '[]'::jsonb)
  into v_training
  from public.digital_employee_lifecycle_training t
  where t.tenant_id = v_tenant_id and t.training_status != 'archived'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rv.id, 'review_key', rv.review_key, 'review_type', rv.review_type,
    'review_status', rv.review_status, 'performance_score', rv.performance_score,
    'summary', rv.summary, 'employee_id', rv.employee_id
  ) order by rv.updated_at desc), '[]'::jsonb)
  into v_reviews
  from public.digital_employee_lifecycle_reviews rv
  where rv.tenant_id = v_tenant_id and rv.review_status != 'archived'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.digital_employee_lifecycle_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.digital_employee_lifecycle_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'A digital employee is an organizational resource with responsibilities, permissions, performance, history, governance, and accountability.',
    'mission', 'Digital Employee Lifecycle Engine — the HR system for digital workers within Aipify.',
    'abos_principle', 'Organizations manage digital workers with the same seriousness as human workers. Visibility creates trust. Governance creates scale.',
    'orchestration_route', '/app/orchestration',
    'distinction_note', 'Distinct from Agent Orchestration routing — this engine manages employee lifecycle, training, performance, and career paths.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/digital-employees'),
      jsonb_build_object('key', 'directory', 'route', '/app/digital-employees/directory'),
      jsonb_build_object('key', 'roles', 'route', '/app/digital-employees/roles'),
      jsonb_build_object('key', 'performance', 'route', '/app/digital-employees/performance'),
      jsonb_build_object('key', 'training', 'route', '/app/digital-employees/training'),
      jsonb_build_object('key', 'lifecycle', 'route', '/app/digital-employees/lifecycle'),
      jsonb_build_object('key', 'governance', 'route', '/app/digital-employees/governance'),
      jsonb_build_object('key', 'analytics', 'route', '/app/digital-employees/analytics')
    ),
    'employees', v_employees,
    'roles', v_roles,
    'training_records', v_training,
    'reviews', v_reviews,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'directory_route', '/app/digital-employees/directory',
      'roles_route', '/app/digital-employees/roles',
      'performance_route', '/app/digital-employees/performance',
      'training_route', '/app/digital-employees/training',
      'lifecycle_route', '/app/digital-employees/lifecycle',
      'governance_route', '/app/digital-employees/governance',
      'analytics_route', '/app/digital-employees/analytics',
      'orchestration_route', '/app/orchestration'
    ),
    'executive_dashboard', jsonb_build_object(
      'workforce_size', v_overview->>'active_employees',
      'department_coverage', v_overview->>'departments',
      'performance', v_overview->>'performance_score',
      'training_coverage', v_overview->>'training_coverage',
      'employee_health_score', v_overview->>'employee_health_score',
      'executive_route', '/app/digital-employees/analytics'
    ),
    'privacy_note', 'Digital employee data isolated per organization — metadata-first workforce management with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.digital_employee_lifecycle_management_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_employee_id uuid;
  v_training_id uuid;
  v_review_id uuid;
  v_employee_name text;
begin
  perform public._irp_require_permission('digital_employees.manage');
  perform public._gdelmp412_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gdelmp412_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_employee' then
    insert into public.digital_employee_lifecycle_employees (
      tenant_id, employee_key, employee_name, department, employee_role,
      career_level, employee_status, supervisor_name
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'employee_key', 'emp-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'employee_name', 'New digital employee'),
      coalesce(p_payload->>'department', ''),
      coalesce(p_payload->>'employee_role', 'custom'),
      coalesce(p_payload->>'career_level', 'specialist'),
      coalesce(p_payload->>'employee_status', 'provisioning'),
      coalesce(p_payload->>'supervisor_name', 'Aipify Companion')
    ) returning id, employee_name into v_employee_id, v_employee_name;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'employee_created', 'Digital employee created: ' || v_employee_name,
      jsonb_build_object('employee_id', v_employee_id)
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id);
  end if;

  if v_action = 'assign_role' then
    update public.digital_employee_lifecycle_employees
    set
      employee_role = coalesce(p_payload->>'employee_role', employee_role),
      department = coalesce(nullif(p_payload->>'department', ''), department),
      updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_employee_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'role_assigned', 'Role assigned to digital employee',
      jsonb_build_object('employee_id', v_employee_id, 'role', p_payload->>'employee_role')
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id);
  end if;

  if v_action = 'assign_training' then
    insert into public.digital_employee_lifecycle_training (
      tenant_id, training_key, employee_id, training_type, training_title, training_status
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'training_key', 'TRN-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      nullif(p_payload->>'employee_id', '')::uuid,
      coalesce(p_payload->>'training_type', 'role'),
      coalesce(p_payload->>'training_title', 'Assigned training'),
      'assigned'
    ) returning id into v_training_id;

    update public.digital_employee_lifecycle_employees
    set employee_status = case when employee_status = 'provisioning' then 'training' else employee_status end,
        updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'training_assigned', 'Training assigned',
      jsonb_build_object('training_id', v_training_id)
    );

    return jsonb_build_object('ok', true, 'training_id', v_training_id);
  end if;

  if v_action = 'complete_training' then
    update public.digital_employee_lifecycle_training
    set
      training_status = 'completed',
      coverage_percent = coalesce((p_payload->>'coverage_percent')::numeric, 100),
      completed_at = now(),
      updated_at = now()
    where id = nullif(p_payload->>'training_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_training_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'training_completed', 'Training completed',
      jsonb_build_object('training_id', v_training_id)
    );

    return jsonb_build_object('ok', true, 'training_id', v_training_id);
  end if;

  if v_action = 'complete_performance_review' then
    insert into public.digital_employee_lifecycle_reviews (
      tenant_id, review_key, employee_id, review_type, review_status,
      performance_score, summary, completed_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'review_key', 'REV-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      nullif(p_payload->>'employee_id', '')::uuid,
      coalesce(p_payload->>'review_type', 'performance'),
      'completed',
      coalesce((p_payload->>'performance_score')::int, 75),
      coalesce(p_payload->>'summary', 'Performance review completed'),
      now()
    ) returning id into v_review_id;

    update public.digital_employee_lifecycle_employees
    set
      performance_score = coalesce((p_payload->>'performance_score')::int, performance_score),
      updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'performance_review_completed', 'Performance review completed',
      jsonb_build_object('review_id', v_review_id)
    );

    return jsonb_build_object('ok', true, 'review_id', v_review_id);
  end if;

  if v_action = 'approve_promotion' then
    update public.digital_employee_lifecycle_employees
    set
      career_level = coalesce(p_payload->>'career_level', career_level),
      performance_score = greatest(performance_score, coalesce((p_payload->>'performance_score')::int, performance_score)),
      updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_employee_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'promotion_approved', 'Promotion approved',
      jsonb_build_object('employee_id', v_employee_id, 'career_level', p_payload->>'career_level')
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id);
  end if;

  if v_action = 'update_permissions' then
    update public.digital_employee_lifecycle_employees
    set
      permissions = coalesce(p_payload->'permissions', permissions),
      capabilities = coalesce(p_payload->'capabilities', capabilities),
      updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_employee_id;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'permission_changed', 'Permissions updated',
      jsonb_build_object('employee_id', v_employee_id)
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id);
  end if;

  if v_action = 'retire_employee' then
    update public.digital_employee_lifecycle_employees
    set employee_status = 'retired', updated_at = now()
    where id = nullif(p_payload->>'employee_id', '')::uuid and tenant_id = v_tenant_id
    returning id, employee_name into v_employee_id, v_employee_name;

    perform public._gdelmp412_log_audit(
      v_tenant_id, 'employee_retired', 'Digital employee retired: ' || coalesce(v_employee_name, ''),
      jsonb_build_object('employee_id', v_employee_id)
    );

    return jsonb_build_object('ok', true, 'employee_id', v_employee_id);
  end if;

  raise exception 'Unsupported digital employee lifecycle action: %', v_action;
end;
$$;

grant execute on function public.get_digital_employee_lifecycle_management_center() to authenticated;
grant execute on function public.digital_employee_lifecycle_management_action(jsonb) to authenticated;

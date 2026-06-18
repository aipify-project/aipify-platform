-- Phase 516 — Employee Lifecycle, Onboarding & Offboarding Engine
-- Employees join · grow · contribute · leave. Aipify supports the entire journey.
-- Extends Phase 503 employee profiles; integrates Governance (515), Assets (512), Tasks (506)

-- ---------------------------------------------------------------------------
-- 1. Extend employee profiles & invitations
-- ---------------------------------------------------------------------------
alter table public.organization_employee_profiles
  add column if not exists lifecycle_stage text not null default 'active' check (
    lifecycle_stage in (
      'candidate', 'invited', 'accepted', 'onboarding', 'active',
      'role_change', 'offboarding', 'former'
    )
  ),
  add column if not exists employment_type text not null default 'full_time' check (
    employment_type in ('full_time', 'part_time', 'contractor', 'consultant', 'temporary', 'intern', 'custom')
  ),
  add column if not exists preferred_language text not null default 'en';

alter table public.organization_employee_invitations
  add column if not exists preferred_language text not null default 'en',
  add column if not exists assigned_domain_ids jsonb not null default '[]'::jsonb,
  add column if not exists assigned_pack_keys jsonb not null default '[]'::jsonb,
  add column if not exists start_date date;

do $$ begin
  alter table public.organization_employee_invitations drop constraint if exists organization_employee_invitations_status_check;
  alter table public.organization_employee_invitations add constraint organization_employee_invitations_status_check
    check (status in ('pending', 'accepted', 'expired', 'cancelled', 'rejected'));
exception when others then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Lifecycle settings, templates, onboarding, training, documents
-- ---------------------------------------------------------------------------
create table if not exists public.organization_employee_lifecycle_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_onboarding_template_key text not null default 'general_employee',
  require_policy_acknowledgement_onboarding boolean not null default true,
  auto_create_offboarding_tasks boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_employee_lifecycle_settings enable row level security;
revoke all on public.organization_employee_lifecycle_settings from authenticated, anon;

create table if not exists public.organization_employee_onboarding_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  name text not null,
  description text not null default '',
  target_role text,
  is_system boolean not null default false,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_employee_onboarding_templates enable row level security;
revoke all on public.organization_employee_onboarding_templates from authenticated, anon;

create table if not exists public.organization_employee_onboarding_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  template_id uuid references public.organization_employee_onboarding_templates (id) on delete set null,
  status text not null default 'in_progress' check (
    status in ('pending', 'in_progress', 'completed', 'cancelled')
  ),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_employee_onboarding_runs enable row level security;
revoke all on public.organization_employee_onboarding_runs from authenticated, anon;

create table if not exists public.organization_employee_onboarding_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  onboarding_run_id uuid not null references public.organization_employee_onboarding_runs (id) on delete cascade,
  step_key text not null,
  title text not null,
  step_type text not null default 'task' check (
    step_type in ('task', 'approval', 'calendar', 'training', 'equipment', 'document', 'policy', 'companion')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  task_id uuid,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.organization_employee_onboarding_steps enable row level security;
revoke all on public.organization_employee_onboarding_steps from authenticated, anon;

create table if not exists public.organization_employee_training_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  training_key text not null,
  title text not null,
  training_type text not null default 'required' check (
    training_type in ('required', 'optional', 'certification', 'partner', 'business_pack', 'custom')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'expired')
  ),
  business_pack_key text,
  completed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_employee_training_records enable row level security;
revoke all on public.organization_employee_training_records from authenticated, anon;

create table if not exists public.organization_employee_lifecycle_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  document_type text not null check (
    document_type in (
      'employment_agreement', 'policy_acknowledgement', 'training_record',
      'certificate', 'performance', 'internal', 'access_review'
    )
  ),
  title text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  file_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_employee_lifecycle_documents enable row level security;
revoke all on public.organization_employee_lifecycle_documents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Managers, role history, domain/pack assignments, offboarding
-- ---------------------------------------------------------------------------
create table if not exists public.organization_employee_manager_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  manager_user_id uuid not null references public.users (id) on delete cascade,
  manager_role text not null check (
    manager_role in ('primary', 'secondary', 'department', 'approver', 'escalation')
  ),
  is_active boolean not null default true,
  assigned_at timestamptz not null default now(),
  unique (organization_id, employee_profile_id, manager_user_id, manager_role)
);

alter table public.organization_employee_manager_assignments enable row level security;
revoke all on public.organization_employee_manager_assignments from authenticated, anon;

create table if not exists public.organization_employee_role_changes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  change_type text not null check (
    change_type in ('promotion', 'transfer', 'department_change', 'manager_change', 'permission_change', 'custom')
  ),
  from_value jsonb not null default '{}'::jsonb,
  to_value jsonb not null default '{}'::jsonb,
  changed_by uuid references public.users (id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organization_employee_role_changes enable row level security;
revoke all on public.organization_employee_role_changes from authenticated, anon;

create table if not exists public.organization_employee_domain_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  domain_id uuid not null references public.organization_domains (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (organization_id, employee_profile_id, domain_id)
);

alter table public.organization_employee_domain_assignments enable row level security;
revoke all on public.organization_employee_domain_assignments from authenticated, anon;

create table if not exists public.organization_employee_pack_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  pack_key text not null,
  assigned_at timestamptz not null default now(),
  unique (organization_id, employee_profile_id, pack_key)
);

alter table public.organization_employee_pack_assignments enable row level security;
revoke all on public.organization_employee_pack_assignments from authenticated, anon;

create table if not exists public.organization_employee_offboarding_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  status text not null default 'in_progress' check (
    status in ('pending', 'in_progress', 'awaiting_approval', 'completed', 'cancelled')
  ),
  departure_date date,
  final_approver uuid references public.users (id) on delete set null,
  progress_percent integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_employee_offboarding_runs enable row level security;
revoke all on public.organization_employee_offboarding_runs from authenticated, anon;

create table if not exists public.organization_employee_offboarding_checklist (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  offboarding_run_id uuid not null references public.organization_employee_offboarding_runs (id) on delete cascade,
  item_key text not null,
  title text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'skipped', 'not_applicable')),
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.organization_employee_offboarding_checklist enable row level security;
revoke all on public.organization_employee_offboarding_checklist from authenticated, anon;

create table if not exists public.organization_employee_lifecycle_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_employee_lifecycle_audit_logs_org_idx
  on public.organization_employee_lifecycle_audit_logs (organization_id, created_at desc);

alter table public.organization_employee_lifecycle_audit_logs enable row level security;
revoke all on public.organization_employee_lifecycle_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._elc516_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._elc516_log(
  p_org_id uuid, p_action text, p_summary text,
  p_profile_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_employee_lifecycle_audit_logs (
    organization_id, employee_profile_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_profile_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._elc516_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_employee_lifecycle_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._elc516_seed_templates(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_employee_onboarding_templates (organization_id, template_key, name, description, is_system, steps)
  values
    (p_org_id, 'general_employee', 'General Employee', 'Welcome, accounts, policies, and Companion introduction.', true,
      '[{"key":"welcome","title":"Welcome package"},{"key":"accounts","title":"Account creation"},{"key":"policies","title":"Policy acknowledgement"},{"key":"companion","title":"Companion introduction"}]'::jsonb),
    (p_org_id, 'manager', 'Manager', 'Manager onboarding with team and approval setup.', true,
      '[{"key":"welcome","title":"Welcome package"},{"key":"team","title":"Team introduction"},{"key":"approvals","title":"Approval responsibilities"}]'::jsonb),
    (p_org_id, 'warehouse_worker', 'Warehouse Worker', 'Equipment, safety training, and warehouse pack access.', true,
      '[{"key":"equipment","title":"Equipment assignment"},{"key":"safety","title":"Safety training"},{"key":"warehouse_pack","title":"Warehouse pack training"}]'::jsonb),
    (p_org_id, 'support_agent', 'Support Agent', 'Support tools, knowledge base, and customer access policies.', true, '[]'::jsonb),
    (p_org_id, 'finance_employee', 'Finance Employee', 'Financial controls, approvals, and compliance training.', true, '[]'::jsonb),
    (p_org_id, 'sales_employee', 'Sales Employee', 'CRM access, territory assignment, and product training.', true, '[]'::jsonb)
  on conflict (organization_id, template_key) do nothing;
end; $$;

create or replace function public._elc516_employee_json(p_row public.organization_employee_profiles)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id, 'employee_number', p_row.employee_number,
    'full_name', p_row.full_name, 'email', p_row.email, 'phone', p_row.phone,
    'department_id', p_row.department_id,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'job_title', p_row.job_title, 'manager_user_id', p_row.manager_user_id,
    'org_role', p_row.org_role, 'employee_status', p_row.employee_status,
    'lifecycle_stage', p_row.lifecycle_stage, 'employment_type', p_row.employment_type,
    'preferred_language', p_row.preferred_language,
    'start_date', p_row.start_date, 'end_date', p_row.end_date,
    'team_id', p_row.team_id, 'location_id', p_row.location_id
  );
end; $$;

create or replace function public._elc516_start_onboarding(p_org_id uuid, p_profile_id uuid, p_template_key text default 'general_employee')
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_template_id uuid;
  v_run_id uuid;
  v_step jsonb;
  v_i int := 0;
begin
  select id into v_template_id from public.organization_employee_onboarding_templates
  where organization_id = p_org_id and template_key = coalesce(p_template_key, 'general_employee') limit 1;

  insert into public.organization_employee_onboarding_runs (
    organization_id, employee_profile_id, template_id, status
  ) values (p_org_id, p_profile_id, v_template_id, 'in_progress')
  returning id into v_run_id;

  update public.organization_employee_profiles set
    lifecycle_stage = 'onboarding', updated_at = now()
  where id = p_profile_id and organization_id = p_org_id;

  if v_template_id is not null then
    for v_step in select * from jsonb_array_elements(
      (select steps from public.organization_employee_onboarding_templates where id = v_template_id)
    ) loop
      v_i := v_i + 1;
      insert into public.organization_employee_onboarding_steps (
        organization_id, onboarding_run_id, step_key, title, step_type, sort_order
      ) values (
        p_org_id, v_run_id,
        coalesce(v_step->>'key', 'step_' || v_i),
        coalesce(v_step->>'title', 'Onboarding step'),
        coalesce(v_step->>'type', 'task'),
        v_i
      );
    end loop;
  end if;

  perform public._elc516_log(p_org_id, 'onboarding_started', 'Onboarding started', p_profile_id,
    jsonb_build_object('run_id', v_run_id, 'template_key', p_template_key));
  return v_run_id;
end; $$;

create or replace function public._elc516_seed_offboarding_checklist(p_org_id uuid, p_run_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_employee_offboarding_checklist (organization_id, offboarding_run_id, item_key, title, sort_order)
  values
    (p_org_id, p_run_id, 'disable_access', 'Disable accounts and access', 1),
    (p_org_id, p_run_id, 'recover_laptop', 'Recover laptop and equipment', 2),
    (p_org_id, p_run_id, 'recover_phone', 'Recover phone and devices', 3),
    (p_org_id, p_run_id, 'revoke_permissions', 'Revoke permissions and pack access', 4),
    (p_org_id, p_run_id, 'transfer_tasks', 'Transfer open tasks and responsibilities', 5),
    (p_org_id, p_run_id, 'archive_files', 'Archive employee documents', 6),
    (p_org_id, p_run_id, 'exit_review', 'Complete exit review', 7)
  on conflict do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Employee Lifecycle Center
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_lifecycle_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_overview jsonb;
  v_employees jsonb;
  v_invitations jsonb;
  v_onboarding jsonb;
  v_offboarding jsonb;
  v_training jsonb;
  v_reports jsonb;
  v_audit jsonb;
  v_assets_summary jsonb;
begin
  perform public._irp_require_permission('employees.view');
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._elc516_ensure_settings(v_org_id);
  perform public._elc516_seed_templates(v_org_id);
  perform public._elc516_log(v_org_id, 'center_view', 'Employee Lifecycle Center viewed', null, jsonb_build_object('section', p_section));

  select jsonb_build_object(
    'total_employees', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status <> 'offboarded'),
    'active', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'),
    'onboarding', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and lifecycle_stage = 'onboarding'),
    'pending_invitations', (select count(*) from public.organization_employee_invitations where organization_id = v_org_id and status = 'pending'),
    'offboarding', (select count(*) from public.organization_employee_offboarding_runs where organization_id = v_org_id and status in ('pending', 'in_progress', 'awaiting_approval')),
    'training_pending', (select count(*) from public.organization_employee_training_records where organization_id = v_org_id and status in ('pending', 'in_progress')),
    'departments', (select count(*) from public.organization_departments where organization_id = v_org_id and is_active)
  ) into v_overview;

  select coalesce(jsonb_agg(public._elc516_employee_json(p) order by p.full_name), '[]'::jsonb)
  into v_employees
  from (select * from public.organization_employee_profiles where organization_id = v_org_id order by full_name limit 100) p;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'email', i.email, 'full_name', i.full_name, 'org_role', i.org_role,
    'status', i.status, 'start_date', i.start_date, 'preferred_language', i.preferred_language,
    'assigned_pack_keys', i.assigned_pack_keys, 'expires_at', i.expires_at, 'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb)
  into v_invitations
  from public.organization_employee_invitations i where i.organization_id = v_org_id and i.status in ('pending', 'rejected')
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'employee_profile_id', r.employee_profile_id,
    'employee_name', (select full_name from public.organization_employee_profiles where id = r.employee_profile_id),
    'status', r.status, 'progress_percent', r.progress_percent, 'started_at', r.started_at
  ) order by r.started_at desc), '[]'::jsonb)
  into v_onboarding
  from public.organization_employee_onboarding_runs r
  where r.organization_id = v_org_id and r.status <> 'completed'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'employee_profile_id', r.employee_profile_id,
    'employee_name', (select full_name from public.organization_employee_profiles where id = r.employee_profile_id),
    'status', r.status, 'progress_percent', r.progress_percent, 'departure_date', r.departure_date
  ) order by r.started_at desc), '[]'::jsonb)
  into v_offboarding
  from public.organization_employee_offboarding_runs r
  where r.organization_id = v_org_id and r.status <> 'completed'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'employee_profile_id', t.employee_profile_id,
    'employee_name', (select full_name from public.organization_employee_profiles where id = t.employee_profile_id),
    'title', t.title, 'training_type', t.training_type, 'status', t.status, 'business_pack_key', t.business_pack_key
  ) order by t.updated_at desc), '[]'::jsonb)
  into v_training
  from public.organization_employee_training_records t
  where t.organization_id = v_org_id and t.status <> 'completed'
  limit 40;

  select jsonb_build_object(
    'assets_assigned', coalesce((select count(*) from public.organization_assets a join public.organization_employee_profiles p on p.id = a.assigned_employee_id where a.organization_id = v_org_id), 0),
    'licenses_assigned', coalesce((select count(*) from public.organization_asset_software_licenses sl where sl.organization_id = v_org_id), 0)
  ) into v_assets_summary;

  select jsonb_build_object(
    'employee_count', v_overview->'total_employees',
    'department_distribution', coalesce((
      select jsonb_agg(jsonb_build_object('department_name', d.name, 'count', (
        select count(*) from public.organization_employee_profiles p where p.department_id = d.id and p.organization_id = v_org_id and p.employee_status = 'active'
      )) order by d.name)
      from public.organization_departments d where d.organization_id = v_org_id and d.is_active
    ), '[]'::jsonb),
    'onboarding_in_progress', jsonb_array_length(coalesce(v_onboarding, '[]'::jsonb)),
    'offboarding_in_progress', jsonb_array_length(coalesce(v_offboarding, '[]'::jsonb)),
    'role_changes_30d', (select count(*) from public.organization_employee_role_changes where organization_id = v_org_id and created_at >= now() - interval '30 days')
  ) into v_reports;

  select coalesce(jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.organization_employee_lifecycle_audit_logs where organization_id = v_org_id order by created_at desc limit 20) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees join. Employees grow. Employees contribute. Employees leave. Aipify supports the entire journey.',
    'structure', 'PLATFORM → APP → EMPLOYEE ENGINE → EMPLOYEES',
    'overview', v_overview,
    'employees', v_employees,
    'invitations', v_invitations,
    'onboarding', v_onboarding,
    'offboarding', v_offboarding,
    'training', v_training,
    'assets_summary', v_assets_summary,
    'reports', v_reports,
    'audit_recent', v_audit,
    'lifecycle_stages', jsonb_build_array(
      'candidate', 'invited', 'accepted', 'onboarding', 'active', 'role_change', 'offboarding', 'former'
    ),
    'employment_types', jsonb_build_array(
      'full_time', 'part_time', 'contractor', 'consultant', 'temporary', 'intern', 'custom'
    ),
    'routes', jsonb_build_object(
      'onboarding', '/app/employees/onboarding',
      'offboarding', '/app/employees/offboarding',
      'organization', '/app/organization',
      'governance', '/app/governance',
      'assets', '/app/assets'
    ),
    'sections', jsonb_build_array(
      'overview', 'employees', 'invitations', 'onboarding', 'roles', 'departments',
      'managers', 'documents', 'offboarding', 'reports'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Onboarding & Offboarding centers
-- ---------------------------------------------------------------------------
create or replace function public.get_onboarding_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_templates jsonb; v_runs jsonb;
begin
  perform public._irp_require_permission('employees.view');
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  perform public._elc516_seed_templates(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'template_key', t.template_key, 'name', t.name, 'description', t.description, 'is_system', t.is_system
  ) order by t.name), '[]'::jsonb) into v_templates
  from public.organization_employee_onboarding_templates t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'employee_name', (select full_name from public.organization_employee_profiles where id = r.employee_profile_id),
    'status', r.status, 'progress_percent', r.progress_percent,
    'steps', coalesce((
      select jsonb_agg(jsonb_build_object('id', s.id, 'title', s.title, 'step_type', s.step_type, 'status', s.status) order by s.sort_order)
      from public.organization_employee_onboarding_steps s where s.onboarding_run_id = r.id
    ), '[]'::jsonb)
  ) order by r.started_at desc), '[]'::jsonb) into v_runs
  from public.organization_employee_onboarding_runs r where r.organization_id = v_org_id limit 50;

  return jsonb_build_object('found', true, 'templates', v_templates, 'runs', v_runs, 'principle', 'Standardize employee onboarding.');
end; $$;

create or replace function public.get_offboarding_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_runs jsonb;
begin
  perform public._irp_require_permission('employees.view');
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'run_id', r.id, 'employee_name', (select full_name from public.organization_employee_profiles where id = r.employee_profile_id),
    'status', r.status, 'progress_percent', r.progress_percent, 'departure_date', r.departure_date,
    'checklist', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'title', c.title, 'status', c.status) order by c.sort_order)
      from public.organization_employee_offboarding_checklist c where c.offboarding_run_id = r.id
    ), '[]'::jsonb),
    'assets', coalesce((
      select jsonb_agg(jsonb_build_object('name', a.name, 'asset_number', a.asset_number))
      from public.organization_assets a
      where a.assigned_employee_id = r.employee_profile_id and a.status <> 'retired'
    ), '[]'::jsonb)
  ) order by r.started_at desc), '[]'::jsonb) into v_runs
  from public.organization_employee_offboarding_runs r where r.organization_id = v_org_id limit 50;

  return jsonb_build_object('found', true, 'runs', v_runs, 'principle', 'Secure employee departure.');
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_employee_lifecycle_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
  v_run_id uuid;
  v_step_id uuid;
  v_item_id uuid;
  v_result jsonb;
begin
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in ('invite_employee', 'start_offboarding', 'record_role_change', 'assign_manager') then
    perform public._irp_require_permission('employees.manage');
  else
    perform public._irp_require_permission('employees.view');
  end if;

  if p_action_type = 'invite_employee' then
    v_result := public.perform_employee_management_action('invite_employee', p_payload);
    select id into v_profile_id from public.organization_employee_profiles
    where organization_id = v_org_id and lower(email) = lower(trim(p_payload->>'email'))
    order by created_at desc limit 1;

    if v_profile_id is not null then
      update public.organization_employee_profiles set
        lifecycle_stage = 'invited', employment_type = coalesce(nullif(p_payload->>'employment_type', ''), employment_type),
        preferred_language = coalesce(nullif(p_payload->>'preferred_language', ''), preferred_language)
      where id = v_profile_id;

      update public.organization_employee_invitations set
        preferred_language = coalesce(nullif(p_payload->>'preferred_language', ''), preferred_language),
        assigned_pack_keys = coalesce(p_payload->'assigned_pack_keys', assigned_pack_keys),
        start_date = coalesce(nullif(p_payload->>'start_date', '')::date, start_date)
      where employee_profile_id = v_profile_id;

      perform public._elc516_log(v_org_id, 'employee_invited', 'Employee invited: ' || (p_payload->>'email'), v_profile_id, p_payload);
    end if;
    return coalesce(v_result, jsonb_build_object('ok', true));

  elsif p_action_type = 'accept_invitation' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    update public.organization_employee_profiles set lifecycle_stage = 'accepted', updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    perform public._elc516_log(v_org_id, 'employee_accepted', 'Invitation accepted', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'start_onboarding' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    v_run_id := public._elc516_start_onboarding(v_org_id, v_profile_id, p_payload->>'template_key');
    return jsonb_build_object('ok', true, 'onboarding_run_id', v_run_id);

  elsif p_action_type = 'complete_onboarding_step' then
    v_step_id := (p_payload->>'step_id')::uuid;
    update public.organization_employee_onboarding_steps set status = 'completed', completed_at = now()
    where id = v_step_id and organization_id = v_org_id;

    select onboarding_run_id into v_run_id from public.organization_employee_onboarding_steps where id = v_step_id;

    update public.organization_employee_onboarding_runs set
      progress_percent = least(100, (
        select round(100.0 * count(*) filter (where status = 'completed') / greatest(1, count(*)))
        from public.organization_employee_onboarding_steps where onboarding_run_id = v_run_id
      )),
      status = case when (
        select count(*) = count(*) filter (where status = 'completed')
        from public.organization_employee_onboarding_steps where onboarding_run_id = v_run_id
      ) then 'completed' else 'in_progress' end,
      completed_at = case when (
        select count(*) = count(*) filter (where status = 'completed')
        from public.organization_employee_onboarding_steps where onboarding_run_id = v_run_id
      ) then now() else null end,
      updated_at = now()
    where id = v_run_id;

    select employee_profile_id into v_profile_id from public.organization_employee_onboarding_runs where id = v_run_id;
    if exists (select 1 from public.organization_employee_onboarding_runs where id = v_run_id and status = 'completed') then
      update public.organization_employee_profiles set lifecycle_stage = 'active', employee_status = 'active', updated_at = now()
      where id = v_profile_id;
    end if;

    perform public._elc516_log(v_org_id, 'onboarding_step_completed', 'Onboarding step completed', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_training' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_training_records (
      organization_id, employee_profile_id, training_key, title, training_type, status, business_pack_key, completed_at
    ) values (
      v_org_id, v_profile_id,
      coalesce(nullif(p_payload->>'training_key', ''), 'training-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(nullif(p_payload->>'title', ''), 'Training'),
      coalesce(nullif(p_payload->>'training_type', ''), 'required'),
      coalesce(nullif(p_payload->>'status', ''), 'completed'),
      nullif(p_payload->>'business_pack_key', ''),
      case when coalesce(p_payload->>'status', 'completed') = 'completed' then now() else null end
    );
    perform public._elc516_log(v_org_id, 'training_completed', 'Training recorded', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_manager' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_manager_assignments (
      organization_id, employee_profile_id, manager_user_id, manager_role
    ) values (
      v_org_id, v_profile_id,
      (p_payload->>'manager_user_id')::uuid,
      coalesce(nullif(p_payload->>'manager_role', ''), 'primary')
    )
    on conflict (organization_id, employee_profile_id, manager_user_id, manager_role) do update set is_active = true;

    if coalesce(p_payload->>'manager_role', 'primary') = 'primary' then
      update public.organization_employee_profiles set manager_user_id = (p_payload->>'manager_user_id')::uuid, updated_at = now()
      where id = v_profile_id;
    end if;

    perform public._elc516_log(v_org_id, 'manager_assigned', 'Manager assigned', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_role_change' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_role_changes (
      organization_id, employee_profile_id, change_type, from_value, to_value, changed_by, notes
    ) values (
      v_org_id, v_profile_id,
      coalesce(nullif(p_payload->>'change_type', ''), 'custom'),
      coalesce(p_payload->'from_value', '{}'::jsonb),
      coalesce(p_payload->'to_value', '{}'::jsonb),
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'notes', '')
    );

    if p_payload->>'new_department_id' is not null then
      update public.organization_employee_profiles set department_id = (p_payload->>'new_department_id')::uuid, lifecycle_stage = 'role_change', updated_at = now()
      where id = v_profile_id;
    end if;
    if p_payload->>'new_org_role' is not null then
      update public.organization_employee_profiles set org_role = p_payload->>'new_org_role', lifecycle_stage = 'role_change', updated_at = now()
      where id = v_profile_id;
    end if;

    perform public._elc516_log(v_org_id, 'role_changed', 'Role change recorded', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_domain' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_domain_assignments (organization_id, employee_profile_id, domain_id)
    values (v_org_id, v_profile_id, (p_payload->>'domain_id')::uuid)
    on conflict (organization_id, employee_profile_id, domain_id) do nothing;
    perform public._elc516_log(v_org_id, 'access_granted', 'Domain assigned to employee', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_business_pack' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_pack_assignments (organization_id, employee_profile_id, pack_key)
    values (v_org_id, v_profile_id, p_payload->>'pack_key')
    on conflict (organization_id, employee_profile_id, pack_key) do nothing;
    perform public._elc516_log(v_org_id, 'access_granted', 'Business Pack assigned', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'start_offboarding' then
    v_profile_id := (p_payload->>'employee_profile_id')::uuid;
    insert into public.organization_employee_offboarding_runs (
      organization_id, employee_profile_id, status, departure_date
    ) values (
      v_org_id, v_profile_id, 'in_progress',
      coalesce(nullif(p_payload->>'departure_date', '')::date, current_date)
    ) returning id into v_run_id;

    perform public._elc516_seed_offboarding_checklist(v_org_id, v_run_id);

    update public.organization_employee_profiles set
      lifecycle_stage = 'offboarding', updated_at = now()
    where id = v_profile_id;

    perform public._elc516_log(v_org_id, 'offboarding_started', 'Offboarding started', v_profile_id, p_payload);
    return jsonb_build_object('ok', true, 'offboarding_run_id', v_run_id);

  elsif p_action_type = 'complete_offboarding_item' then
    v_item_id := (p_payload->>'checklist_item_id')::uuid;
    update public.organization_employee_offboarding_checklist set status = 'completed', completed_at = now()
    where id = v_item_id and organization_id = v_org_id;

    select offboarding_run_id into v_run_id from public.organization_employee_offboarding_checklist where id = v_item_id;

    update public.organization_employee_offboarding_runs set
      progress_percent = least(100, (
        select round(100.0 * count(*) filter (where status = 'completed') / greatest(1, count(*)))
        from public.organization_employee_offboarding_checklist where offboarding_run_id = v_run_id
      )),
      updated_at = now()
    where id = v_run_id;

    perform public._elc516_log(v_org_id, 'offboarding_progress', 'Offboarding checklist item completed', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'complete_offboarding' then
    v_run_id := (p_payload->>'offboarding_run_id')::uuid;
    select employee_profile_id into v_profile_id from public.organization_employee_offboarding_runs where id = v_run_id;

    update public.organization_employee_offboarding_runs set status = 'completed', completed_at = now(), progress_percent = 100
    where id = v_run_id and organization_id = v_org_id;

    v_result := public.perform_employee_management_action('offboard_employee', jsonb_build_object('employee_profile_id', v_profile_id));

    update public.organization_employee_profiles set lifecycle_stage = 'former', updated_at = now()
    where id = v_profile_id;

    perform public._elc516_log(v_org_id, 'offboarding_completed', 'Offboarding completed', v_profile_id, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_employee_lifecycle_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps everyone stay aligned — managers remain responsible.',
    'onboarding_in_progress', (select count(*) from public.organization_employee_onboarding_runs where organization_id = v_org_id and status = 'in_progress'),
    'offboarding_in_progress', (select count(*) from public.organization_employee_offboarding_runs where organization_id = v_org_id and status = 'in_progress'),
    'training_pending', (select count(*) from public.organization_employee_training_records where organization_id = v_org_id and status in ('pending', 'in_progress')),
    'pending_invitations', (select count(*) from public.organization_employee_invitations where organization_id = v_org_id and status = 'pending'),
    'companion_prompts', jsonb_build_array(
      'Show onboarding progress.',
      'Which employees still need training?',
      'Start offboarding process.',
      'Show employees missing policy acknowledgements.',
      'Who reports to this manager?'
    ),
    'employees_route', '/app/employees',
    'onboarding_route', '/app/employees/onboarding',
    'offboarding_route', '/app/employees/offboarding'
  );
end; $$;

create or replace function public.get_my_employee_lifecycle_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('employees.view');
  v_org_id := public._elc516_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and ou.user_id = v_user_id limit 1;

  return jsonb_build_object(
    'found', true,
    'can_invite', public._irp_has_permission('employees.manage', v_org_id),
    'can_review_employees', true,
    'can_approve_requests', public._irp_has_permission('employees.manage', v_org_id),
    'pending_invitations', (select count(*) from public.organization_employee_invitations where organization_id = v_org_id and status = 'pending'),
    'onboarding_active', (select count(*) from public.organization_employee_onboarding_runs where organization_id = v_org_id and status = 'in_progress'),
    'my_onboarding', coalesce((
      select jsonb_build_object('status', r.status, 'progress_percent', r.progress_percent)
      from public.organization_employee_onboarding_runs r
      where r.employee_profile_id = v_profile_id and r.status <> 'completed'
      order by r.started_at desc limit 1
    ), '{}'::jsonb),
    'routes', jsonb_build_object('employees', '/app/employees', 'onboarding', '/app/employees/onboarding', 'offboarding', '/app/employees/offboarding')
  );
exception when others then
  return jsonb_build_object('found', true, 'can_invite', false, 'routes', jsonb_build_object('employees', '/app/employees'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'employees', 'Employees', 'employees', 'operations',
    'Employee lifecycle, onboarding, and offboarding for the organization.',
    'starter', null, 'operations', '/app/employees', 'licensed', 4
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('employees', 'employees.view', 'view', 'Employees — view directory and lifecycle'),
    ('employees', 'employees.manage', 'manage', 'Employees — invite, onboard, and offboard')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('employees', 'employees.view', 'view', 'Employees — view directory and lifecycle'),
    ('employees', 'employees.manage', 'manage', 'Employees — invite, onboard, and offboard')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_employee_lifecycle_center(text) to authenticated;
grant execute on function public.get_onboarding_center() to authenticated;
grant execute on function public.get_offboarding_center() to authenticated;
grant execute on function public.perform_employee_lifecycle_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_employee_lifecycle_context() to authenticated;
grant execute on function public.get_my_employee_lifecycle_summary() to authenticated;

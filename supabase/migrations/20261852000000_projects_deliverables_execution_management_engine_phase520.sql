-- Phase 520 — Projects, Deliverables & Execution Management Engine
-- Tasks manage individual work. Projects manage coordinated outcomes.
-- Integrates: CRM (517), Employees (516), Tasks (506), Calendar (507), Finance (519), Domains (505A)

-- ---------------------------------------------------------------------------
-- 1. Settings & templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_project_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_project_type text not null default 'internal',
  task_integration_enabled boolean not null default true,
  calendar_integration_enabled boolean not null default true,
  companion_project_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_project_settings enable row level security;
revoke all on public.organization_project_settings from authenticated, anon;

create table if not exists public.organization_project_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  name text not null,
  project_type text not null default 'custom',
  description text not null default '',
  default_milestones jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_project_templates enable row level security;
revoke all on public.organization_project_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Projects, teams, milestones, deliverables
-- ---------------------------------------------------------------------------
create table if not exists public.organization_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_number text,
  name text not null,
  description text not null default '',
  project_type text not null default 'internal' check (
    project_type in (
      'internal', 'customer', 'implementation', 'construction', 'consulting',
      'marketing_campaign', 'product_development', 'business_pack', 'custom'
    )
  ),
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  contact_id uuid references public.organization_crm_contacts (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  project_manager_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  status text not null default 'planning' check (
    status in ('planning', 'active', 'at_risk', 'on_hold', 'completed', 'cancelled')
  ),
  start_date date,
  target_date date,
  completed_at timestamptz,
  budget_amount numeric(14, 2) not null default 0,
  budget_spent numeric(14, 2) not null default 0,
  budget_currency text not null default 'NOK',
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  template_id uuid references public.organization_project_templates (id) on delete set null,
  documents jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, project_number)
);

create index if not exists organization_projects_org_status_idx
  on public.organization_projects (organization_id, status, target_date);

alter table public.organization_projects enable row level security;
revoke all on public.organization_projects from authenticated, anon;

create table if not exists public.organization_project_team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  member_type text not null default 'employee' check (
    member_type in ('employee', 'manager', 'department', 'external_contact', 'partner', 'vendor')
  ),
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  role_label text not null default '',
  created_at timestamptz not null default now()
);

alter table public.organization_project_team_members enable row level security;
revoke all on public.organization_project_team_members from authenticated, anon;

create table if not exists public.organization_project_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  name text not null,
  owner_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  target_date date,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')
  ),
  completion_percent integer not null default 0 check (completion_percent between 0 and 100),
  depends_on_milestone_id uuid references public.organization_project_milestones (id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_project_milestones_project_idx
  on public.organization_project_milestones (project_id, target_date);

alter table public.organization_project_milestones enable row level security;
revoke all on public.organization_project_milestones from authenticated, anon;

create table if not exists public.organization_project_deliverables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  milestone_id uuid references public.organization_project_milestones (id) on delete set null,
  name text not null,
  owner_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  due_date date,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'submitted', 'approved', 'overdue', 'cancelled')
  ),
  approval_status text not null default 'none' check (
    approval_status in ('none', 'pending', 'customer_pending', 'approved', 'rejected')
  ),
  attachments jsonb not null default '[]'::jsonb,
  version_number integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_project_deliverables enable row level security;
revoke all on public.organization_project_deliverables from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Resources, budgets, risks, approvals, timeline
-- ---------------------------------------------------------------------------
create table if not exists public.organization_project_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  resource_type text not null check (
    resource_type in ('employee', 'asset', 'equipment', 'vehicle', 'budget', 'business_pack')
  ),
  resource_label text not null,
  allocated_units numeric(10, 2) not null default 1,
  reserved_from date,
  reserved_until date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_project_resources enable row level security;
revoke all on public.organization_project_resources from authenticated, anon;

create table if not exists public.organization_project_budgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  budget_amount numeric(14, 2) not null default 0,
  spent_amount numeric(14, 2) not null default 0,
  forecast_amount numeric(14, 2),
  variance_amount numeric(14, 2) not null default 0,
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  currency text not null default 'NOK',
  updated_at timestamptz not null default now(),
  unique (project_id)
);

alter table public.organization_project_budgets enable row level security;
revoke all on public.organization_project_budgets from authenticated, anon;

create table if not exists public.organization_project_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  risk_type text not null default 'schedule' check (
    risk_type in ('resource', 'schedule', 'customer', 'budget', 'compliance', 'custom')
  ),
  title text not null,
  owner_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  impact text not null default 'moderate' check (impact in ('low', 'moderate', 'high', 'critical')),
  likelihood text not null default 'moderate' check (likelihood in ('low', 'moderate', 'high', 'critical')),
  mitigation text not null default '',
  status text not null default 'open' check (status in ('open', 'mitigating', 'resolved', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_project_risks enable row level security;
revoke all on public.organization_project_risks from authenticated, anon;

create table if not exists public.organization_project_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  approval_type text not null check (
    approval_type in ('project_creation', 'budget', 'milestone', 'customer', 'closure', 'deliverable')
  ),
  reference_id uuid,
  reference_label text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_by_user_id uuid references public.users (id) on delete set null,
  approver_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.organization_project_approvals enable row level security;
revoke all on public.organization_project_approvals from authenticated, anon;

create table if not exists public.organization_project_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.organization_projects (id) on delete cascade,
  event_type text not null check (
    event_type in ('project', 'milestone', 'deliverable', 'task', 'calendar', 'budget', 'risk', 'approval', 'custom')
  ),
  title text not null,
  summary text not null default '',
  occurred_at timestamptz not null default now(),
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_project_timeline_project_idx
  on public.organization_project_timeline (project_id, occurred_at desc);

alter table public.organization_project_timeline enable row level security;
revoke all on public.organization_project_timeline from authenticated, anon;

create table if not exists public.organization_project_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.organization_projects (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_project_audit_logs_org_idx
  on public.organization_project_audit_logs (organization_id, created_at desc);

alter table public.organization_project_audit_logs enable row level security;
revoke all on public.organization_project_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._proj520_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._proj520_log(
  p_org_id uuid, p_action text, p_summary text,
  p_project_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_project_audit_logs (
    organization_id, project_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_project_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._proj520_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_project_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_project_templates (organization_id, template_key, name, project_type, description, default_milestones)
  values
    (p_org_id, 'customer_onboarding', 'Customer Onboarding', 'customer', 'Standard customer onboarding project',
      '[{"name":"Planning Complete"},{"name":"Implementation Complete"},{"name":"Training Complete"},{"name":"Go Live Complete"}]'::jsonb),
    (p_org_id, 'implementation', 'Implementation Project', 'implementation', 'System implementation rollout', '[]'::jsonb),
    (p_org_id, 'warehouse_rollout', 'Warehouse Rollout', 'business_pack', 'Warehouse optimization rollout', '[]'::jsonb),
    (p_org_id, 'commerce_launch', 'Commerce Launch', 'business_pack', 'Store launch project', '[]'::jsonb),
    (p_org_id, 'hosts_deployment', 'Hosts Deployment', 'business_pack', 'Property deployment project', '[]'::jsonb),
    (p_org_id, 'marketing_campaign', 'Marketing Campaign', 'marketing_campaign', 'Marketing campaign execution', '[]'::jsonb)
  on conflict (organization_id, template_key) do nothing;
end; $$;

create or replace function public._proj520_next_number(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  select count(*) + 1 into v_n from public.organization_projects where organization_id = p_org_id;
  return 'PRJ-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._proj520_project_json(p_row public.organization_projects)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'project_number', p_row.project_number,
    'name', p_row.name,
    'description', p_row.description,
    'project_type', p_row.project_type,
    'customer_id', p_row.customer_id,
    'customer_name', (
      select coalesce(c.company_name, c.name) from public.organization_crm_customers c where c.id = p_row.customer_id
    ),
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'project_manager_name', (
      select full_name from public.organization_employee_profiles where id = p_row.project_manager_profile_id
    ),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'business_pack_key', p_row.business_pack_key,
    'status', p_row.status,
    'start_date', p_row.start_date,
    'target_date', p_row.target_date,
    'budget_amount', p_row.budget_amount,
    'budget_spent', p_row.budget_spent,
    'budget_remaining', greatest(p_row.budget_amount - p_row.budget_spent, 0),
    'completion_percent', p_row.completion_percent,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._proj520_add_timeline(
  p_org_id uuid, p_project_id uuid, p_event_type text, p_title text,
  p_summary text default '', p_payload jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organization_project_timeline (
    organization_id, project_id, event_type, title, summary, actor_user_id, metadata
  ) values (
    p_org_id, p_project_id, p_event_type, p_title, p_summary,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    coalesce(p_payload, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._proj520_refresh_completion(p_org_id uuid, p_project_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_total integer;
  v_done integer;
  v_pct integer;
begin
  select count(*), count(*) filter (where status = 'completed')
  into v_total, v_done
  from public.organization_project_milestones
  where organization_id = p_org_id and project_id = p_project_id;

  v_pct := case when v_total = 0 then 0 else round(v_done::numeric / v_total * 100)::integer end;

  update public.organization_projects set
    completion_percent = v_pct,
    status = case
      when v_pct = 100 and status not in ('cancelled', 'completed') then 'completed'
      when status = 'planning' and v_done > 0 then 'active'
      else status
    end,
    updated_at = now()
  where id = p_project_id and organization_id = p_org_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Project Execution Center
-- ---------------------------------------------------------------------------
create or replace function public.get_project_execution_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('projects.view');
  v_org_id := public._proj520_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._proj520_ensure_settings(v_org_id);
  perform public._proj520_log(v_org_id, 'center_view', 'Project Center viewed', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Tasks manage individual work. Projects manage coordinated outcomes.',
    'overview', jsonb_build_object(
      'total_projects', (select count(*) from public.organization_projects where organization_id = v_org_id),
      'active_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'active'),
      'planning_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'planning'),
      'at_risk_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'at_risk'),
      'completed_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'completed'),
      'overdue_milestones', (
        select count(*) from public.organization_project_milestones m
        join public.organization_projects p on p.id = m.project_id
        where m.organization_id = v_org_id and m.status not in ('completed', 'cancelled')
          and m.target_date is not null and m.target_date < current_date
          and p.status not in ('completed', 'cancelled')
      ),
      'overdue_deliverables', (
        select count(*) from public.organization_project_deliverables d
        join public.organization_projects p on p.id = d.project_id
        where d.organization_id = v_org_id and d.status not in ('approved', 'cancelled')
          and d.due_date is not null and d.due_date < current_date
          and p.status not in ('completed', 'cancelled')
      ),
      'open_risks', (select count(*) from public.organization_project_risks where organization_id = v_org_id and status = 'open'),
      'budget_at_risk', (
        select count(*) from public.organization_project_budgets b
        join public.organization_projects p on p.id = b.project_id
        where b.organization_id = v_org_id and b.risk_level in ('high', 'critical') and p.status not in ('completed', 'cancelled')
      ),
      'pending_approvals', (
        select count(*) from public.organization_project_approvals
        where organization_id = v_org_id and status = 'pending'
      ),
      'avg_completion_percent', coalesce((
        select round(avg(completion_percent)::numeric, 0) from public.organization_projects
        where organization_id = v_org_id and status not in ('cancelled', 'completed')
      ), 0)
    ),
    'active_projects', coalesce((
      select jsonb_agg(public._proj520_project_json(p) order by p.updated_at desc)
      from (
        select * from public.organization_projects
        where organization_id = v_org_id and status in ('active', 'at_risk')
        order by updated_at desc limit 50
      ) p
    ), '[]'::jsonb),
    'planning_projects', coalesce((
      select jsonb_agg(public._proj520_project_json(p) order by p.created_at desc)
      from (
        select * from public.organization_projects
        where organization_id = v_org_id and status = 'planning'
        order by created_at desc limit 30
      ) p
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'project_id', m.project_id,
        'project_name', (select name from public.organization_projects where id = m.project_id),
        'name', m.name, 'target_date', m.target_date, 'status', m.status,
        'completion_percent', m.completion_percent,
        'owner_name', (select full_name from public.organization_employee_profiles where id = m.owner_profile_id)
      ) order by m.target_date nulls last)
      from public.organization_project_milestones m
      where m.organization_id = v_org_id and m.status not in ('completed', 'cancelled')
      limit 60
    ), '[]'::jsonb),
    'deliverables', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'project_id', d.project_id,
        'project_name', (select name from public.organization_projects where id = d.project_id),
        'name', d.name, 'due_date', d.due_date, 'status', d.status, 'approval_status', d.approval_status
      ) order by d.due_date nulls last)
      from public.organization_project_deliverables d
      where d.organization_id = v_org_id and d.status not in ('approved', 'cancelled')
      limit 50
    ), '[]'::jsonb),
    'resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'project_id', r.project_id,
        'project_name', (select name from public.organization_projects where id = r.project_id),
        'resource_type', r.resource_type, 'resource_label', r.resource_label,
        'allocated_units', r.allocated_units, 'reserved_from', r.reserved_from, 'reserved_until', r.reserved_until
      ))
      from public.organization_project_resources r where r.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'budgets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'project_id', b.project_id,
        'project_name', (select name from public.organization_projects where id = b.project_id),
        'budget_amount', b.budget_amount, 'spent_amount', b.spent_amount,
        'remaining', greatest(b.budget_amount - b.spent_amount, 0),
        'forecast_amount', b.forecast_amount, 'variance_amount', b.variance_amount, 'risk_level', b.risk_level
      ))
      from public.organization_project_budgets b
      join public.organization_projects p on p.id = b.project_id
      where b.organization_id = v_org_id and p.status not in ('completed', 'cancelled')
    ), '[]'::jsonb),
    'risks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'project_id', r.project_id,
        'project_name', (select name from public.organization_projects where id = r.project_id),
        'risk_type', r.risk_type, 'title', r.title, 'impact', r.impact,
        'likelihood', r.likelihood, 'status', r.status, 'mitigation', r.mitigation
      ) order by r.created_at desc)
      from public.organization_project_risks r
      where r.organization_id = v_org_id and r.status in ('open', 'mitigating')
      limit 40
    ), '[]'::jsonb),
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'project_id', a.project_id,
        'project_name', (select name from public.organization_projects where id = a.project_id),
        'approval_type', a.approval_type, 'reference_label', a.reference_label, 'status', a.status
      ) order by a.created_at desc)
      from public.organization_project_approvals a
      where a.organization_id = v_org_id and a.status = 'pending' limit 30
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'name', t.name,
        'project_type', t.project_type, 'description', t.description
      ) order by t.name)
      from public.organization_project_templates t where t.organization_id = v_org_id and t.is_active
    ), '[]'::jsonb),
    'timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'project_id', t.project_id,
        'project_name', (select name from public.organization_projects where id = t.project_id),
        'event_type', t.event_type, 'title', t.title, 'summary', t.summary, 'occurred_at', t.occurred_at
      ) order by t.occurred_at desc)
      from public.organization_project_timeline t where t.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'completion_rate', coalesce((
        select round(
          count(*) filter (where status = 'completed')::numeric / greatest(count(*), 1) * 100, 1
        ) from public.organization_projects where organization_id = v_org_id
      ), 0),
      'milestone_on_time_percent', case
        when (select count(*) from public.organization_project_milestones where organization_id = v_org_id and status = 'completed') = 0 then 100
        else round(100.0 * (
          select count(*) from public.organization_project_milestones
          where organization_id = v_org_id and status = 'completed'
            and (target_date is null or completed_at::date <= target_date)
        )::numeric / greatest((
          select count(*) from public.organization_project_milestones where organization_id = v_org_id and status = 'completed'
        ), 1)::numeric, 1)
      end,
      'budget_variance_total', coalesce((
        select sum(variance_amount) from public.organization_project_budgets where organization_id = v_org_id
      ), 0),
      'executive', jsonb_build_object(
        'projects_at_risk', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'at_risk'),
        'upcoming_deadlines_14d', (
          select count(*) from public.organization_projects
          where organization_id = v_org_id and status not in ('completed', 'cancelled')
            and target_date between current_date and current_date + 14
        ),
        'resource_conflicts', 0
      )
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_project_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'project_statuses', jsonb_build_array('planning', 'active', 'at_risk', 'on_hold', 'completed', 'cancelled'),
    'project_types', jsonb_build_array(
      'internal', 'customer', 'implementation', 'construction', 'consulting',
      'marketing_campaign', 'product_development', 'business_pack', 'custom'
    ),
    'sections', jsonb_build_array(
      'overview', 'active_projects', 'planning', 'milestones', 'deliverables',
      'resources', 'budgets', 'risks', 'reports'
    ),
    'routes', jsonb_build_object(
      'projects', '/app/projects',
      'tasks', '/app/tasks',
      'customers', '/app/customers',
      'finance', '/app/finance'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_project_execution_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_project_id uuid;
  v_milestone_id uuid;
  v_deliverable_id uuid;
  v_template public.organization_project_templates;
  v_milestone jsonb;
begin
  v_org_id := public._proj520_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_project', 'update_project', 'create_milestone', 'complete_milestone',
    'create_deliverable', 'approve_deliverable', 'create_risk', 'update_budget',
    'add_team_member', 'create_from_template', 'close_project', 'approve_request'
  ) then
    perform public._irp_require_permission('projects.manage');
  else
    perform public._irp_require_permission('projects.view');
  end if;

  perform public._proj520_ensure_settings(v_org_id);

  if p_action_type = 'create_project' then
    insert into public.organization_projects (
      organization_id, project_number, name, description, project_type, customer_id,
      department_id, project_manager_profile_id, domain_id, business_pack_key,
      status, start_date, target_date, budget_amount, budget_currency
    ) values (
      v_org_id,
      coalesce(p_payload->>'project_number', public._proj520_next_number(v_org_id)),
      coalesce(p_payload->>'name', 'New project'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'project_type', 'internal'),
      nullif(p_payload->>'customer_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'project_manager_profile_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(p_payload->>'status', 'planning'),
      nullif(p_payload->>'start_date', '')::date,
      nullif(p_payload->>'target_date', '')::date,
      coalesce((p_payload->>'budget_amount')::numeric, 0),
      coalesce(p_payload->>'budget_currency', 'NOK')
    ) returning id into v_project_id;

    insert into public.organization_project_budgets (organization_id, project_id, budget_amount, spent_amount, currency)
    values (v_org_id, v_project_id, coalesce((p_payload->>'budget_amount')::numeric, 0), 0, coalesce(p_payload->>'budget_currency', 'NOK'));

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'project', 'Project created', coalesce(p_payload->>'description', ''));
    perform public._proj520_log(v_org_id, 'project_created', 'Project created', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'create_from_template' then
    select * into v_template from public.organization_project_templates
    where organization_id = v_org_id and template_key = coalesce(p_payload->>'template_key', 'customer_onboarding') limit 1;

    insert into public.organization_projects (
      organization_id, project_number, name, description, project_type, customer_id,
      status, template_id, budget_amount
    ) values (
      v_org_id, public._proj520_next_number(v_org_id),
      coalesce(p_payload->>'name', v_template.name, 'Project from template'),
      coalesce(v_template.description, ''),
      coalesce(v_template.project_type, 'custom'),
      nullif(p_payload->>'customer_id', '')::uuid,
      'planning', v_template.id,
      coalesce((p_payload->>'budget_amount')::numeric, 0)
    ) returning id into v_project_id;

    insert into public.organization_project_budgets (organization_id, project_id, budget_amount)
    values (v_org_id, v_project_id, coalesce((p_payload->>'budget_amount')::numeric, 0));

    for v_milestone in select * from jsonb_array_elements(coalesce(v_template.default_milestones, '[]'::jsonb))
    loop
      insert into public.organization_project_milestones (organization_id, project_id, name, status)
      values (v_org_id, v_project_id, coalesce(v_milestone->>'name', 'Milestone'), 'pending');
    end loop;

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'project', 'Project created from template', v_template.name);
    perform public._proj520_log(v_org_id, 'project_created', 'Project created from template', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'update_project' then
    v_project_id := (p_payload->>'project_id')::uuid;
    update public.organization_projects set
      name = coalesce(p_payload->>'name', name),
      description = coalesce(p_payload->>'description', description),
      status = coalesce(p_payload->>'status', status),
      target_date = coalesce(nullif(p_payload->>'target_date', '')::date, target_date),
      budget_amount = coalesce((p_payload->>'budget_amount')::numeric, budget_amount),
      updated_at = now()
    where id = v_project_id and organization_id = v_org_id;

    if p_payload->>'status' = 'at_risk' then
      perform public._proj520_add_timeline(v_org_id, v_project_id, 'project', 'Project marked at risk', '');
    end if;
    perform public._proj520_log(v_org_id, 'project_updated', 'Project updated', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'create_milestone' then
    v_project_id := (p_payload->>'project_id')::uuid;
    insert into public.organization_project_milestones (
      organization_id, project_id, name, owner_profile_id, target_date, status
    ) values (
      v_org_id, v_project_id,
      coalesce(p_payload->>'name', 'Milestone'),
      nullif(p_payload->>'owner_profile_id', '')::uuid,
      nullif(p_payload->>'target_date', '')::date,
      'pending'
    ) returning id into v_milestone_id;

    update public.organization_projects set status = case when status = 'planning' then 'active' else status end, updated_at = now()
    where id = v_project_id and organization_id = v_org_id;

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'milestone', 'Milestone added', coalesce(p_payload->>'name', ''));
    perform public._proj520_log(v_org_id, 'milestone_created', 'Milestone created', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'milestone_id', v_milestone_id);

  elsif p_action_type = 'complete_milestone' then
    v_milestone_id := (p_payload->>'milestone_id')::uuid;
    update public.organization_project_milestones set
      status = 'completed', completion_percent = 100, completed_at = now(), updated_at = now()
    where id = v_milestone_id and organization_id = v_org_id
    returning project_id into v_project_id;

    perform public._proj520_refresh_completion(v_org_id, v_project_id);
    perform public._proj520_add_timeline(v_org_id, v_project_id, 'milestone', 'Milestone completed', coalesce(p_payload->>'name', ''));
    perform public._proj520_log(v_org_id, 'milestone_completed', 'Milestone completed', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'milestone_id', v_milestone_id);

  elsif p_action_type = 'create_deliverable' then
    v_project_id := (p_payload->>'project_id')::uuid;
    insert into public.organization_project_deliverables (
      organization_id, project_id, milestone_id, name, owner_profile_id, due_date, status
    ) values (
      v_org_id, v_project_id,
      nullif(p_payload->>'milestone_id', '')::uuid,
      coalesce(p_payload->>'name', 'Deliverable'),
      nullif(p_payload->>'owner_profile_id', '')::uuid,
      nullif(p_payload->>'due_date', '')::date,
      'pending'
    ) returning id into v_deliverable_id;

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'deliverable', 'Deliverable added', coalesce(p_payload->>'name', ''));
    perform public._proj520_log(v_org_id, 'deliverable_created', 'Deliverable created', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'deliverable_id', v_deliverable_id);

  elsif p_action_type = 'approve_deliverable' then
    v_deliverable_id := (p_payload->>'deliverable_id')::uuid;
    update public.organization_project_deliverables set
      status = 'approved', approval_status = 'approved', updated_at = now()
    where id = v_deliverable_id and organization_id = v_org_id
    returning project_id into v_project_id;

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'deliverable', 'Deliverable approved', '');
    perform public._proj520_log(v_org_id, 'deliverable_approved', 'Deliverable approved', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'deliverable_id', v_deliverable_id);

  elsif p_action_type = 'create_risk' then
    v_project_id := (p_payload->>'project_id')::uuid;
    insert into public.organization_project_risks (
      organization_id, project_id, risk_type, title, impact, likelihood, mitigation, owner_profile_id
    ) values (
      v_org_id, v_project_id,
      coalesce(p_payload->>'risk_type', 'schedule'),
      coalesce(p_payload->>'title', 'Project risk'),
      coalesce(p_payload->>'impact', 'moderate'),
      coalesce(p_payload->>'likelihood', 'moderate'),
      coalesce(p_payload->>'mitigation', ''),
      nullif(p_payload->>'owner_profile_id', '')::uuid
    );

    update public.organization_projects set status = case when status = 'active' then 'at_risk' else status end, updated_at = now()
    where id = v_project_id and organization_id = v_org_id
      and coalesce(p_payload->>'impact', 'moderate') in ('high', 'critical');

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'risk', 'Risk added', coalesce(p_payload->>'title', ''));
    perform public._proj520_log(v_org_id, 'risk_added', 'Risk added', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'update_budget' then
    v_project_id := (p_payload->>'project_id')::uuid;
    update public.organization_project_budgets set
      spent_amount = coalesce((p_payload->>'spent_amount')::numeric, spent_amount),
      forecast_amount = coalesce(nullif(p_payload->>'forecast_amount', '')::numeric, forecast_amount),
      variance_amount = budget_amount - coalesce((p_payload->>'spent_amount')::numeric, spent_amount),
      risk_level = case
        when budget_amount > 0 and coalesce((p_payload->>'spent_amount')::numeric, spent_amount) / budget_amount >= 0.95 then 'critical'
        when budget_amount > 0 and coalesce((p_payload->>'spent_amount')::numeric, spent_amount) / budget_amount >= 0.85 then 'high'
        when budget_amount > 0 and coalesce((p_payload->>'spent_amount')::numeric, spent_amount) / budget_amount >= 0.70 then 'moderate'
        else 'low'
      end,
      updated_at = now()
    where project_id = v_project_id and organization_id = v_org_id;

    update public.organization_projects set
      budget_spent = coalesce((p_payload->>'spent_amount')::numeric, budget_spent),
      updated_at = now()
    where id = v_project_id and organization_id = v_org_id;

    perform public._proj520_log(v_org_id, 'budget_changed', 'Budget updated', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'add_team_member' then
    v_project_id := (p_payload->>'project_id')::uuid;
    insert into public.organization_project_team_members (
      organization_id, project_id, member_type, employee_profile_id, role_label
    ) values (
      v_org_id, v_project_id,
      coalesce(p_payload->>'member_type', 'employee'),
      nullif(p_payload->>'employee_profile_id', '')::uuid,
      coalesce(p_payload->>'role_label', '')
    );
    perform public._proj520_log(v_org_id, 'team_member_added', 'Team member added', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'close_project' then
    v_project_id := (p_payload->>'project_id')::uuid;
    update public.organization_projects set
      status = 'completed', completion_percent = 100, completed_at = now(), updated_at = now()
    where id = v_project_id and organization_id = v_org_id;

    perform public._proj520_add_timeline(v_org_id, v_project_id, 'project', 'Project closed', 'Project completed');
    perform public._proj520_log(v_org_id, 'project_closed', 'Project closed', v_project_id, p_payload);
    return jsonb_build_object('ok', true, 'project_id', v_project_id);

  elsif p_action_type = 'approve_request' then
    update public.organization_project_approvals set status = 'approved', resolved_at = now()
    where id = (p_payload->>'approval_id')::uuid and organization_id = v_org_id;
    perform public._proj520_log(v_org_id, 'approval_granted', 'Project approval granted', null, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_project_execution_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('projects.view');
  v_org_id := public._proj520_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Tasks complete work. Projects create outcomes. Companion helps keep projects on track.',
    'active_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'active'),
    'at_risk_projects', (select count(*) from public.organization_projects where organization_id = v_org_id and status = 'at_risk'),
    'overdue_milestones', (
      select count(*) from public.organization_project_milestones m
      join public.organization_projects p on p.id = m.project_id
      where m.organization_id = v_org_id and m.status not in ('completed', 'cancelled')
        and m.target_date < current_date and p.status not in ('completed', 'cancelled')
    ),
    'budget_at_risk', (
      select count(*) from public.organization_project_budgets b
      join public.organization_projects p on p.id = b.project_id
      where b.organization_id = v_org_id and b.risk_level in ('high', 'critical') and p.status not in ('completed', 'cancelled')
    ),
    'pending_approvals', (select count(*) from public.organization_project_approvals where organization_id = v_org_id and status = 'pending'),
    'companion_prompts', jsonb_build_array(
      'Show active projects.',
      'Which projects are at risk?',
      'Show overdue milestones.',
      'Generate executive project summary.',
      'Show project budget status.'
    ),
    'projects_route', '/app/projects',
    'tasks_route', '/app/tasks'
  );
end; $$;

create or replace function public.get_my_project_execution_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('projects.view');
  v_org_id := public._proj520_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and ou.user_id = v_user_id limit 1;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('projects.manage', v_org_id),
    'my_projects', (
      select count(*) from public.organization_projects
      where organization_id = v_org_id and project_manager_profile_id = v_profile_id
        and status not in ('completed', 'cancelled')
    ),
    'my_milestones_due', (
      select count(*) from public.organization_project_milestones
      where organization_id = v_org_id and owner_profile_id = v_profile_id
        and status not in ('completed', 'cancelled')
        and target_date between current_date and current_date + 7
    ),
    'routes', jsonb_build_object('projects', '/app/projects', 'tasks', '/app/tasks')
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('projects', '/app/projects'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'projects', 'Projects', 'projects', 'operations',
    'Projects, milestones, deliverables, budgets, risks, and execution management.',
    'starter', null, 'operations', '/app/projects', 'licensed', 7
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('projects', 'projects.view', 'view', 'Projects — view projects, milestones, and execution status'),
    ('projects', 'projects.manage', 'manage', 'Projects — create, update, approve, and close projects')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('projects', 'projects.view', 'view', 'Projects — view projects, milestones, and execution status'),
    ('projects', 'projects.manage', 'manage', 'Projects — create, update, approve, and close projects')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_project_execution_center(text) to authenticated;
grant execute on function public.perform_project_execution_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_project_execution_context() to authenticated;
grant execute on function public.get_my_project_execution_summary() to authenticated;

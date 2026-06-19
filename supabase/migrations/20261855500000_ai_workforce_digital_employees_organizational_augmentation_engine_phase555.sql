-- Phase 555 — AI Workforce, Digital Employees & Organizational Augmentation Engine
-- Workforce augmentation layer. Digital employees assist under governance — never replace accountability.
-- Feature owner: CUSTOMER APP. Routes: /app/workforce, /app/workforce/employees, /app/workforce/training

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ai_workforce_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  workforce_enabled boolean not null default true,
  training_enabled boolean not null default true,
  performance_tracking_enabled boolean not null default true,
  governance_required boolean not null default true,
  human_supervisor_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_ai_workforce_settings enable row level security;
revoke all on public.organization_ai_workforce_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Departments & digital employees
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ai_workforce_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_name text not null,
  department_type text not null default 'custom' check (
    department_type in (
      'support', 'finance', 'sales', 'operations', 'hr', 'projects', 'executive', 'custom'
    )
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, department_key)
);

alter table public.organization_ai_workforce_departments enable row level security;
revoke all on public.organization_ai_workforce_departments from authenticated, anon;

create table if not exists public.organization_ai_workforce_employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_key text not null,
  employee_id_label text not null,
  display_name text not null,
  role_title text not null,
  employee_type text not null default 'custom' check (
    employee_type in (
      'support_specialist', 'sales_assistant', 'operations_assistant', 'finance_assistant',
      'hr_assistant', 'project_coordinator', 'inventory_coordinator', 'knowledge_specialist',
      'executive_analyst', 'custom'
    )
  ),
  department_key text not null default '',
  business_packs jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  assigned_manager text not null default '',
  owner_label text not null default '',
  status text not null default 'active' check (
    status in ('active', 'training', 'requires_review', 'restricted', 'disabled')
  ),
  activity_summary text not null default '' check (char_length(activity_summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_key)
);

alter table public.organization_ai_workforce_employees enable row level security;
revoke all on public.organization_ai_workforce_employees from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Assignments, skills, training, performance, teams
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ai_workforce_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  assignment_key text not null,
  employee_key text not null,
  employee_label text not null,
  assignment_type text not null check (
    assignment_type in (
      'task', 'approval', 'project', 'customer', 'domain', 'business_pack', 'queue', 'briefing'
    )
  ),
  target_label text not null,
  tasks_assigned integer not null default 0,
  tasks_completed integer not null default 0,
  approvals_required integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, assignment_key)
);

alter table public.organization_ai_workforce_assignments enable row level security;
revoke all on public.organization_ai_workforce_assignments from authenticated, anon;

create table if not exists public.organization_ai_workforce_skills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  skill_key text not null,
  skill_name text not null,
  skill_category text not null default 'operational',
  governed boolean not null default true,
  permission_scope text not null default 'read,analyze,prepare,recommend',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, skill_key)
);

alter table public.organization_ai_workforce_skills enable row level security;
revoke all on public.organization_ai_workforce_skills from authenticated, anon;

create table if not exists public.organization_ai_workforce_training (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  training_key text not null,
  employee_key text not null,
  employee_label text not null,
  training_source text not null check (
    training_source in ('knowledge_center', 'policy', 'playbook', 'document', 'approved_data')
  ),
  source_label text not null,
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  status text not null default 'in_progress' check (
    status in ('pending', 'in_progress', 'completed', 'recommended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, training_key)
);

alter table public.organization_ai_workforce_training enable row level security;
revoke all on public.organization_ai_workforce_training from authenticated, anon;

create table if not exists public.organization_ai_workforce_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_key text not null,
  employee_label text not null,
  tasks_completed integer not null default 0,
  response_quality_score integer not null default 75 check (response_quality_score between 0 and 100),
  approval_success_pct numeric(5,2) not null default 0,
  escalation_accuracy_pct numeric(5,2) not null default 0,
  usage_score integer not null default 70 check (usage_score between 0 and 100),
  adoption_score integer not null default 65 check (adoption_score between 0 and 100),
  business_impact_score integer not null default 70 check (business_impact_score between 0 and 100),
  performance_status text not null default 'healthy' check (
    performance_status in ('excellent', 'healthy', 'needs_review', 'poor_performance')
  ),
  digital_employee_score integer not null default 75 check (digital_employee_score between 0 and 100),
  summary text not null default '',
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_key)
);

alter table public.organization_ai_workforce_performance enable row level security;
revoke all on public.organization_ai_workforce_performance from authenticated, anon;

create table if not exists public.organization_ai_workforce_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  team_key text not null,
  team_name text not null,
  manager_label text not null default '',
  human_members jsonb not null default '[]'::jsonb,
  digital_members jsonb not null default '[]'::jsonb,
  workload_model text not null default 'hybrid' check (workload_model in ('human', 'digital', 'hybrid')),
  workload_balance_summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, team_key)
);

alter table public.organization_ai_workforce_teams enable row level security;
revoke all on public.organization_ai_workforce_teams from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Business pack roles, marketplace scaffold, governance, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ai_workforce_business_pack_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_label text not null,
  digital_role text not null,
  skills jsonb not null default '[]'::jsonb,
  workflows jsonb not null default '[]'::jsonb,
  training_material text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, pack_key)
);

alter table public.organization_ai_workforce_business_pack_roles enable row level security;
revoke all on public.organization_ai_workforce_business_pack_roles from authenticated, anon;

create table if not exists public.organization_ai_workforce_marketplace_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  catalog_key text not null,
  role_name text not null,
  role_type text not null,
  install_status text not null default 'available' check (
    install_status in ('available', 'installed', 'beta', 'deprecated')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, catalog_key)
);

alter table public.organization_ai_workforce_marketplace_catalog enable row level security;
revoke all on public.organization_ai_workforce_marketplace_catalog from authenticated, anon;

create table if not exists public.organization_ai_workforce_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  governance_key text not null,
  employee_key text not null default '',
  event_type text not null check (
    event_type in (
      'permission', 'action', 'approval', 'escalation', 'training_source',
      'execution_right', 'permission_review', 'governance_alert'
    )
  ),
  severity text not null default 'information' check (severity in ('information', 'attention', 'critical')),
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, governance_key)
);

alter table public.organization_ai_workforce_governance enable row level security;
revoke all on public.organization_ai_workforce_governance from authenticated, anon;

create table if not exists public.organization_ai_workforce_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'digital_employee_created', 'digital_employee_updated', 'assignment_created',
      'permission_granted', 'training_completed', 'action_executed', 'escalation_created',
      'performance_updated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_ai_workforce_audit_logs_org_idx
  on public.organization_ai_workforce_audit_logs (organization_id, created_at desc);

alter table public.organization_ai_workforce_audit_logs enable row level security;
revoke all on public.organization_ai_workforce_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._wkfc555_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._wkfc555_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ai_workforce_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._wkfc555_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_ai_workforce_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._wkfc555_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_ai_workforce_employees where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_ai_workforce_departments (
    organization_id, department_key, department_name, department_type, summary
  ) values
    (p_org_id, 'dept_support', 'Support Department', 'support', 'Customer support operations and triage.'),
    (p_org_id, 'dept_finance', 'Finance Department', 'finance', 'Invoice review, approvals, and reporting.'),
    (p_org_id, 'dept_executive', 'Executive Office', 'executive', 'Executive briefings and strategic analysis.');

  insert into public.organization_ai_workforce_employees (
    organization_id, employee_key, employee_id_label, display_name, role_title, employee_type,
    department_key, business_packs, skills, permissions, assigned_manager, owner_label, status, activity_summary
  ) values
    (p_org_id, 'emp_support_01', 'DE-SUP-001', 'Aipify Support Specialist', 'Support Specialist', 'support_specialist',
     'dept_support', '["Support Pack"]'::jsonb, '["Customer Analysis","Knowledge Search","Task Coordination"]'::jsonb,
     '["read","analyze","prepare","recommend","escalate"]'::jsonb, 'Support Manager', 'Operations Owner', 'active',
     'Handles support triage and escalates when required.'),
    (p_org_id, 'emp_finance_01', 'DE-FIN-001', 'Aipify Finance Assistant', 'Finance Assistant', 'finance_assistant',
     'dept_finance', '["Finance Pack"]'::jsonb, '["Report Generation","Contract Review"]'::jsonb,
     '["read","analyze","prepare","recommend","draft"]'::jsonb, 'Finance Manager', 'Finance Owner', 'active',
     'Reviews invoices, prepares approvals, generates reports.'),
    (p_org_id, 'emp_exec_01', 'DE-EXE-001', 'Executive Analyst', 'Executive Analyst', 'executive_analyst',
     'dept_executive', '["Executive Pack"]'::jsonb, '["Report Generation","Trend Analysis","Meeting Preparation"]'::jsonb,
     '["read","analyze","prepare","recommend","monitor"]'::jsonb, 'Executive Lead', 'CEO Office', 'training',
     'Assigned executive briefings — training in progress.');

  insert into public.organization_ai_workforce_assignments (
    organization_id, assignment_key, employee_key, employee_label, assignment_type, target_label,
    tasks_assigned, tasks_completed, approvals_required, summary
  ) values
    (p_org_id, 'asgn_support_queue', 'emp_support_01', 'Aipify Support Specialist', 'queue', 'Support Queue', 48, 42, 6,
     'Support Assistant assigned to primary support queue.'),
    (p_org_id, 'asgn_inventory_ops', 'emp_support_01', 'Aipify Support Specialist', 'business_pack', 'Warehouse Operations', 12, 10, 2,
     'Inventory monitoring assignments for warehouse pack.'),
    (p_org_id, 'asgn_exec_briefings', 'emp_exec_01', 'Executive Analyst', 'briefing', 'Executive Briefings', 8, 5, 3,
     'Executive Analyst assigned to daily and weekly briefings.');

  insert into public.organization_ai_workforce_skills (
    organization_id, skill_key, skill_name, skill_category, permission_scope, summary
  ) values
    (p_org_id, 'customer_analysis', 'Customer Analysis', 'operational', 'read,analyze,prepare,recommend', 'Governed customer insight skill.'),
    (p_org_id, 'report_generation', 'Report Generation', 'executive', 'read,analyze,prepare,draft', 'Governed report drafting skill.'),
    (p_org_id, 'knowledge_search', 'Knowledge Search', 'knowledge', 'read,analyze', 'Approved knowledge retrieval.'),
    (p_org_id, 'inventory_monitoring', 'Inventory Monitoring', 'operations', 'read,monitor,escalate', 'Warehouse inventory monitoring.');

  insert into public.organization_ai_workforce_training (
    organization_id, training_key, employee_key, employee_label, training_source, source_label, progress_pct, status, summary
  ) values
    (p_org_id, 'tr_support_proc', 'emp_support_01', 'Aipify Support Specialist', 'playbook', 'Support Procedures', 100, 'completed',
     'Support procedures training completed from approved playbook.'),
    (p_org_id, 'tr_exec_brief', 'emp_exec_01', 'Executive Analyst', 'knowledge_center', 'Executive Briefing Standards', 45, 'in_progress',
     'Training on executive briefing format and governance.');

  insert into public.organization_ai_workforce_performance (
    organization_id, employee_key, employee_label, tasks_completed, response_quality_score,
    approval_success_pct, escalation_accuracy_pct, usage_score, adoption_score, business_impact_score,
    performance_status, digital_employee_score, summary
  ) values
    (p_org_id, 'emp_support_01', 'Aipify Support Specialist', 42, 88, 92.5, 95.0, 85, 78, 82, 'excellent', 89,
     'Excellent support triage with accurate escalations.'),
    (p_org_id, 'emp_finance_01', 'Aipify Finance Assistant', 28, 82, 88.0, 90.0, 72, 68, 75, 'healthy', 80,
     'Healthy finance assistant performance.'),
    (p_org_id, 'emp_exec_01', 'Executive Analyst', 5, 70, 75.0, 80.0, 45, 40, 55, 'needs_review', 62,
     'Needs review — still in training phase.');

  insert into public.organization_ai_workforce_teams (
    organization_id, team_key, team_name, manager_label, human_members, digital_members, workload_model, workload_balance_summary
  ) values
    (p_org_id, 'team_support', 'Support Team', 'Support Manager',
     '["Human Agent A","Human Agent B"]'::jsonb, '["Aipify Support Specialist"]'::jsonb, 'hybrid',
     'Digital assistant activated during high workload — human review maintained.'),
    (p_org_id, 'team_sales', 'Sales Team', 'Sales Manager',
     '["Sales Staff"]'::jsonb, '["Digital Sales Assistant"]'::jsonb, 'hybrid',
     'Hybrid sales team with digital assistant for lead preparation.');

  insert into public.organization_ai_workforce_business_pack_roles (
    organization_id, pack_key, pack_label, digital_role, skills, workflows, training_material, summary
  ) values
    (p_org_id, 'finance_pack', 'Finance Pack', 'Finance Assistant', '["Report Generation","Contract Review"]'::jsonb,
     '["Invoice Review","Approval Preparation"]'::jsonb, 'Finance policies and approval playbooks', 'Finance Pack digital role.'),
    (p_org_id, 'support_pack', 'Support Pack', 'Support Specialist', '["Customer Analysis","Knowledge Search"]'::jsonb,
     '["Support Triage","Escalation"]'::jsonb, 'Support procedures and knowledge base', 'Support Pack digital role.'),
    (p_org_id, 'warehouse_pack', 'Warehouse Pack', 'Inventory Coordinator', '["Inventory Monitoring"]'::jsonb,
     '["Stock Alerts","Reorder Preparation"]'::jsonb, 'Warehouse operations playbook', 'Warehouse Pack digital role.');

  insert into public.organization_ai_workforce_marketplace_catalog (
    organization_id, catalog_key, role_name, role_type, install_status, summary
  ) values
    (p_org_id, 'mkt_exec_analyst', 'Executive Analyst', 'executive_analyst', 'installed', 'Installed executive analyst role.'),
    (p_org_id, 'mkt_compliance', 'Compliance Assistant', 'custom', 'available', 'Future installable compliance assistant.'),
    (p_org_id, 'mkt_revenue_analyst', 'Revenue Analyst', 'custom', 'beta', 'Beta revenue analyst for forecasting support.');

  insert into public.organization_ai_workforce_governance (
    organization_id, governance_key, employee_key, event_type, severity, summary, status
  ) values
    (p_org_id, 'gov_perm_review', 'emp_exec_01', 'permission_review', 'attention', 'Executive Analyst permission scope requires review before expansion.', 'open'),
    (p_org_id, 'gov_training_rec', 'emp_exec_01', 'training_source', 'information', 'Training recommended for executive briefing standards.', 'open');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_ai_workforce_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
begin
  v_org_id := public._wkfc555_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._wkfc555_ensure_settings(v_org_id);
  perform public._wkfc555_seed(v_org_id);

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Aipify does not replace employees. Aipify augments employees. Digital employees assist under governance and supervision — never without accountability.',
    'supervisor_rule', 'Every digital employee must have an owner, manager, audit history, and explicit permission scope.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', jsonb_build_object(
      'digital_employees', (select count(*) from public.organization_ai_workforce_employees where organization_id = v_org_id),
      'active_employees', (select count(*) from public.organization_ai_workforce_employees where organization_id = v_org_id and status = 'active'),
      'departments', (select count(*) from public.organization_ai_workforce_departments where organization_id = v_org_id),
      'assignments', (select count(*) from public.organization_ai_workforce_assignments where organization_id = v_org_id and status = 'active'),
      'training_in_progress', (select count(*) from public.organization_ai_workforce_training where organization_id = v_org_id and status in ('pending', 'in_progress')),
      'governance_open', (select count(*) from public.organization_ai_workforce_governance where organization_id = v_org_id and status = 'open'),
      'avg_performance_score', coalesce((select round(avg(digital_employee_score))::int from public.organization_ai_workforce_performance where organization_id = v_org_id), 75),
      'hybrid_teams', (select count(*) from public.organization_ai_workforce_teams where organization_id = v_org_id and workload_model = 'hybrid')
    ),
    'digital_employee_registry', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.display_name)
      from public.organization_ai_workforce_employees e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'digital_departments', coalesce((
      select jsonb_agg(to_jsonb(d) order by d.department_name)
      from public.organization_ai_workforce_departments d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'assignment_engine', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.updated_at desc)
      from public.organization_ai_workforce_assignments a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'skills_framework', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.skill_name)
      from public.organization_ai_workforce_skills s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'training_engine', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.updated_at desc)
      from public.organization_ai_workforce_training t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'performance_engine', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.digital_employee_score desc)
      from public.organization_ai_workforce_performance p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'workload_balancing', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.team_name)
      from public.organization_ai_workforce_teams t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'team_structures', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.team_name)
      from public.organization_ai_workforce_teams t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'business_pack_integration', coalesce((
      select jsonb_agg(to_jsonb(b) order by b.pack_label)
      from public.organization_ai_workforce_business_pack_roles b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'marketplace_prepared', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.role_name)
      from public.organization_ai_workforce_marketplace_catalog m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'governance_center', coalesce((
      select jsonb_agg(to_jsonb(g) order by g.created_at desc)
      from public.organization_ai_workforce_governance g where g.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_workforce_manager', jsonb_build_object(
      'advisor_prompts', jsonb_build_array(
        'Show all digital employees and their status.',
        'Assign Support Assistant to the support queue.',
        'Review Finance Assistant performance.',
        'Create a new Executive Analyst digital employee.',
        'Disable Inventory Assistant and review governance.'
      )
    ),
    'permission_framework', jsonb_build_object(
      'allowed_actions', jsonb_build_array(
        'read', 'analyze', 'prepare', 'recommend', 'draft', 'monitor', 'escalate', 'execute_approved_actions'
      ),
      'explicit_required', true
    ),
    'executive_dashboard', jsonb_build_object(
      'digital_employees', (select count(*) from public.organization_ai_workforce_employees where organization_id = v_org_id),
      'avg_performance_score', coalesce((select round(avg(digital_employee_score))::int from public.organization_ai_workforce_performance where organization_id = v_org_id), 75),
      'workload_impact', (select count(*) from public.organization_ai_workforce_teams where organization_id = v_org_id),
      'governance_status', (select count(*) from public.organization_ai_workforce_governance where organization_id = v_org_id and status = 'open'),
      'training_active', (select count(*) from public.organization_ai_workforce_training where organization_id = v_org_id and status = 'in_progress'),
      'companion_recommendations', (select count(*) from public.organization_ai_workforce_governance where organization_id = v_org_id)
    ),
    'reports', jsonb_build_object(
      'workforce_utilization', (select count(*) from public.organization_ai_workforce_assignments where organization_id = v_org_id),
      'performance_records', (select count(*) from public.organization_ai_workforce_performance where organization_id = v_org_id),
      'training_activity', (select count(*) from public.organization_ai_workforce_training where organization_id = v_org_id),
      'adoption_metrics', coalesce((select round(avg(adoption_score))::int from public.organization_ai_workforce_performance where organization_id = v_org_id), 0)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_ai_workforce_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'workforce', true, 'assignments', true, 'performance', true, 'permissions', true, 'approvals', true
    ),
    'routes', jsonb_build_object(
      'workforce_center', '/app/workforce',
      'employees', '/app/workforce/employees',
      'training', '/app/workforce/training',
      'companion_workforce_legacy', '/app/companion-workforce-engine',
      'governance', '/app/governance/digital-workforce'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_ai_workforce_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._wkfc555_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'create_digital_employee' then
    insert into public.organization_ai_workforce_employees (
      organization_id, employee_key, employee_id_label, display_name, role_title, employee_type,
      department_key, assigned_manager, owner_label, status, activity_summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'employee_key', 'emp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'employee_id_label', 'DE-NEW-001'),
      coalesce(p_payload->>'display_name', 'New Digital Employee'),
      coalesce(p_payload->>'role_title', 'Assistant'),
      coalesce(p_payload->>'employee_type', 'custom'),
      coalesce(p_payload->>'department_key', ''),
      coalesce(p_payload->>'assigned_manager', 'Manager'),
      coalesce(p_payload->>'owner_label', 'Owner'),
      coalesce(p_payload->>'status', 'training'),
      coalesce(p_payload->>'activity_summary', 'Digital employee created.')
    );
    perform public._wkfc555_log(v_org_id, 'digital_employee_created', 'Digital employee created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_assignment' then
    insert into public.organization_ai_workforce_assignments (
      organization_id, assignment_key, employee_key, employee_label, assignment_type, target_label, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'assignment_key', 'asgn_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'employee_key', ''),
      coalesce(p_payload->>'employee_label', 'Digital Employee'),
      coalesce(p_payload->>'assignment_type', 'task'),
      coalesce(p_payload->>'target_label', 'Assignment'),
      coalesce(p_payload->>'summary', '')
    );
    perform public._wkfc555_log(v_org_id, 'assignment_created', 'Assignment created for digital employee.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'grant_permission' then
    update public.organization_ai_workforce_employees
    set permissions = coalesce(p_payload->'permissions', permissions), updated_at = now()
    where organization_id = v_org_id and employee_key = coalesce(p_payload->>'employee_key', employee_key);
    perform public._wkfc555_log(v_org_id, 'permission_granted', 'Permission scope updated for digital employee.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'complete_training' then
    update public.organization_ai_workforce_training
    set status = 'completed', progress_pct = 100, updated_at = now()
    where organization_id = v_org_id and training_key = coalesce(p_payload->>'training_key', training_key);
    perform public._wkfc555_log(v_org_id, 'training_completed', 'Digital employee training completed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'update_performance' then
    insert into public.organization_ai_workforce_performance (
      organization_id, employee_key, employee_label, digital_employee_score, performance_status, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'employee_key', 'emp_unknown'),
      coalesce(p_payload->>'employee_label', 'Digital Employee'),
      coalesce((p_payload->>'digital_employee_score')::int, 75),
      coalesce(p_payload->>'performance_status', 'healthy'),
      coalesce(p_payload->>'summary', 'Performance updated.')
    )
    on conflict (organization_id, employee_key) do update set
      digital_employee_score = excluded.digital_employee_score,
      performance_status = excluded.performance_status,
      summary = excluded.summary,
      updated_at = now();
    perform public._wkfc555_log(v_org_id, 'performance_updated', 'Digital employee performance updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'disable_employee' then
    update public.organization_ai_workforce_employees
    set status = 'disabled', updated_at = now()
    where organization_id = v_org_id and employee_key = coalesce(p_payload->>'employee_key', employee_key);
    perform public._wkfc555_log(v_org_id, 'digital_employee_updated', 'Digital employee disabled.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_ai_workforce_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_ai_workforce_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'digital_employees', v_center->'overview'->'digital_employees',
    'active_employees', v_center->'overview'->'active_employees',
    'avg_performance_score', v_center->'overview'->'avg_performance_score',
    'governance_open', v_center->'overview'->'governance_open',
    'training_in_progress', v_center->'overview'->'training_in_progress',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_workforce_manager_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_ai_workforce_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'supervisor_rule', v_center->'supervisor_rule',
    'advisor', v_center->'companion_workforce_manager',
    'employees', v_center->'digital_employee_registry',
    'performance', v_center->'performance_engine',
    'governance', v_center->'governance_center',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_ai_workforce_center(text) to authenticated;
grant execute on function public.perform_organization_ai_workforce_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_ai_workforce_mobile_summary() to authenticated;
grant execute on function public.get_companion_workforce_manager_context(text) to authenticated;

-- Phase 598 — Aipify Digital Employee, Role Simulation & Autonomous Workforce Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/digital-employees/*
-- Helpers: _dewf598_*

create table if not exists public.organization_dewf598_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  digital_employee_center_enabled boolean not null default true,
  role_simulation_enabled boolean not null default true,
  task_engine_enabled boolean not null default true,
  performance_engine_enabled boolean not null default true,
  escalation_engine_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_dewf598_settings enable row level security;
revoke all on public.organization_dewf598_settings from authenticated, anon;

create table if not exists public.organization_dewf598_employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_key text not null,
  employee_name text not null,
  employee_role text not null,
  department text not null default '',
  employee_status text not null default 'active' check (employee_status in ('active', 'paused', 'review')),
  autonomy_level integer not null default 1 check (autonomy_level between 0 and 5),
  performance_score integer not null default 75 check (performance_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, employee_key)
);

alter table public.organization_dewf598_employees enable row level security;
revoke all on public.organization_dewf598_employees from authenticated, anon;

create table if not exists public.organization_dewf598_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role_key text not null,
  role_title text not null,
  role_type text not null check (
    role_type in (
      'support', 'finance', 'knowledge', 'operations', 'customer_success', 'partner', 'compliance', 'revenue'
    )
  ),
  role_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, role_key)
);

alter table public.organization_dewf598_roles enable row level security;
revoke all on public.organization_dewf598_roles from authenticated, anon;

create table if not exists public.organization_dewf598_responsibilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  responsibility_key text not null,
  responsibility_title text not null,
  responsibility_type text not null check (
    responsibility_type in ('role', 'responsibility', 'allowed_action', 'approval', 'knowledge_access', 'reporting')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, responsibility_key)
);

alter table public.organization_dewf598_responsibilities enable row level security;
revoke all on public.organization_dewf598_responsibilities from authenticated, anon;

create table if not exists public.organization_dewf598_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_key text not null,
  task_title text not null,
  task_status text not null check (
    task_status in ('assigned', 'completed', 'pending', 'escalated', 'rejected')
  ),
  assigned_to text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, task_key)
);

alter table public.organization_dewf598_tasks enable row level security;
revoke all on public.organization_dewf598_tasks from authenticated, anon;

create table if not exists public.organization_dewf598_autonomy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  autonomy_key text not null,
  autonomy_title text not null,
  autonomy_level integer not null check (autonomy_level between 0 and 5),
  autonomy_status text not null default 'governed',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, autonomy_key)
);

alter table public.organization_dewf598_autonomy enable row level security;
revoke all on public.organization_dewf598_autonomy from authenticated, anon;

create table if not exists public.organization_dewf598_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_type text not null check (
    metric_type in (
      'task_completion', 'accuracy', 'response_quality', 'approval_success', 'escalation_rate', 'customer_satisfaction'
    )
  ),
  metric_score integer not null default 75 check (metric_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_dewf598_performance enable row level security;
revoke all on public.organization_dewf598_performance from authenticated, anon;

create table if not exists public.organization_dewf598_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  team_key text not null,
  team_title text not null,
  team_type text not null check (
    team_type in ('support', 'knowledge', 'finance', 'partner', 'operations')
  ),
  member_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, team_key)
);

alter table public.organization_dewf598_teams enable row level security;
revoke all on public.organization_dewf598_teams from authenticated, anon;

create table if not exists public.organization_dewf598_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  escalation_key text not null,
  escalation_title text not null,
  escalation_reason text not null check (
    escalation_reason in ('too_complex', 'permission_missing', 'risk_too_high')
  ),
  escalation_status text not null default 'open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, escalation_key)
);

alter table public.organization_dewf598_escalations enable row level security;
revoke all on public.organization_dewf598_escalations from authenticated, anon;

create table if not exists public.organization_dewf598_collaboration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  collaboration_key text not null,
  collaboration_title text not null,
  workflow_stage text not null check (
    workflow_stage in ('human_employee', 'digital_employee', 'shared_workflow', 'outcome')
  ),
  collaboration_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, collaboration_key)
);

alter table public.organization_dewf598_collaboration enable row level security;
revoke all on public.organization_dewf598_collaboration from authenticated, anon;

create table if not exists public.organization_dewf598_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  deployed_role text not null default '',
  employee_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_dewf598_business_packs enable row level security;
revoke all on public.organization_dewf598_business_packs from authenticated, anon;

create table if not exists public.organization_dewf598_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'digital_employee',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_dewf598_audit_logs enable row level security;
revoke all on public.organization_dewf598_audit_logs from authenticated, anon;

create or replace function public._dewf598_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._dewf598_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'digital_employee'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_dewf598_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'digital_employee'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._dewf598_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_dewf598_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._dewf598_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._dewf598_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_dewf598_employees where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_dewf598_employees (
    organization_id, employee_key, employee_name, employee_role, department, autonomy_level, performance_score, summary
  ) values
    (p_org_id, 'emp_support', 'Support Specialist', 'Support Specialist', 'Customer Success', 2, 82, 'Digital employee — support responsibilities with governance.'),
    (p_org_id, 'emp_knowledge', 'Knowledge Coordinator', 'Knowledge Manager', 'Operations', 1, 78, 'Knowledge coordination role.'),
    (p_org_id, 'emp_revenue', 'Revenue Analyst', 'Revenue Analyst', 'Finance', 2, 85, 'Revenue analysis digital employee.'),
    (p_org_id, 'emp_compliance', 'Compliance Assistant', 'Compliance Assistant', 'Legal', 1, 80, 'Compliance support — approval required.'),
    (p_org_id, 'emp_partner', 'Partner Coordinator', 'Partner Assistant', 'Partnerships', 2, 77, 'Partner coordination role.');

  insert into public.organization_dewf598_roles (
    organization_id, role_key, role_title, role_type, summary
  ) values
    (p_org_id, 'role_support', 'Support Employee', 'support', 'Companion behaves according to support role responsibilities.'),
    (p_org_id, 'role_finance', 'Finance Assistant', 'finance', 'Finance assistant role simulation.'),
    (p_org_id, 'role_knowledge', 'Knowledge Manager', 'knowledge', 'Knowledge manager role.'),
    (p_org_id, 'role_ops', 'Operations Coordinator', 'operations', 'Operations coordinator role.'),
    (p_org_id, 'role_cs', 'Customer Success Assistant', 'customer_success', 'Customer success assistant role.'),
    (p_org_id, 'role_partner', 'Partner Assistant', 'partner', 'Partner assistant role.');

  insert into public.organization_dewf598_responsibilities (
    organization_id, responsibility_key, responsibility_title, responsibility_type, summary
  ) values
    (p_org_id, 'resp_role', 'Defined Role', 'role', 'Every digital employee has a defined role.'),
    (p_org_id, 'resp_duties', 'Defined Responsibilities', 'responsibility', 'Clear responsibility framework.'),
    (p_org_id, 'resp_actions', 'Allowed Actions', 'allowed_action', 'Nothing operates without governance.'),
    (p_org_id, 'resp_approval', 'Approval Requirements', 'approval', 'Level 3+ requires explicit approval.'),
    (p_org_id, 'resp_knowledge', 'Knowledge Access', 'knowledge_access', 'Scoped knowledge access only.'),
    (p_org_id, 'resp_reporting', 'Reporting Structure', 'reporting', 'Accountability through reporting.');

  insert into public.organization_dewf598_tasks (
    organization_id, task_key, task_title, task_status, assigned_to, summary
  ) values
    (p_org_id, 'task_assigned', 'Triage support queue — batch 12', 'assigned', 'Support Specialist', 'Assigned task tracked.'),
    (p_org_id, 'task_completed', 'Draft renewal summary', 'completed', 'Revenue Analyst', 'Completed task recorded.'),
    (p_org_id, 'task_pending', 'Review knowledge article updates', 'pending', 'Knowledge Coordinator', 'Pending task awaiting approval.'),
    (p_org_id, 'task_escalated', 'Complex refund exception', 'escalated', 'Support Specialist', 'Task too complex — escalate human.'),
    (p_org_id, 'task_rejected', 'Policy change draft', 'rejected', 'Compliance Assistant', 'Rejected — permission missing.');

  insert into public.organization_dewf598_autonomy (
    organization_id, autonomy_key, autonomy_title, autonomy_level, summary
  ) values
    (p_org_id, 'auto_0', 'Level 0 — Observe Only', 0, 'Observe only — no actions.'),
    (p_org_id, 'auto_1', 'Level 1 — Recommend', 1, 'Recommend actions — human decides.'),
    (p_org_id, 'auto_2', 'Level 2 — Draft', 2, 'Draft outputs for review.'),
    (p_org_id, 'auto_3', 'Level 3 — Execute With Approval', 3, 'Execute with explicit approval.'),
    (p_org_id, 'auto_4', 'Level 4 — Execute Within Rules', 4, 'Execute within approved rules.'),
    (p_org_id, 'auto_5', 'Level 5 — Enterprise Autonomous Mode', 5, 'Enterprise autonomous — governance permits only.');

  insert into public.organization_dewf598_performance (
    organization_id, metric_key, metric_title, metric_type, metric_score, summary
  ) values
    (p_org_id, 'perf_completion', 'Task Completion', 'task_completion', 84, 'Organizations can evaluate digital workers.'),
    (p_org_id, 'perf_accuracy', 'Accuracy', 'accuracy', 88, 'Response accuracy measured.'),
    (p_org_id, 'perf_quality', 'Response Quality', 'response_quality', 81, 'Quality score tracked.'),
    (p_org_id, 'perf_approval', 'Approval Success', 'approval_success', 79, 'Approval success rate.'),
    (p_org_id, 'perf_escalation', 'Escalation Rate', 'escalation_rate', 72, 'Lower escalation is better.'),
    (p_org_id, 'perf_csat', 'Customer Satisfaction', 'customer_satisfaction', 86, 'Customer satisfaction proxy.');

  insert into public.organization_dewf598_teams (
    organization_id, team_key, team_title, team_type, member_count, summary
  ) values
    (p_org_id, 'team_support', 'Support Team', 'support', 3, 'Multiple digital employees — support team.'),
    (p_org_id, 'team_knowledge', 'Knowledge Team', 'knowledge', 2, 'Knowledge team scaled with organization.'),
    (p_org_id, 'team_finance', 'Finance Team', 'finance', 2, 'Finance digital workforce.'),
    (p_org_id, 'team_partner', 'Partner Team', 'partner', 1, 'Partner coordination team.'),
    (p_org_id, 'team_ops', 'Operations Team', 'operations', 2, 'Operations team.');

  insert into public.organization_dewf598_escalations (
    organization_id, escalation_key, escalation_title, escalation_reason, summary
  ) values
    (p_org_id, 'esc_complex', 'Task Too Complex', 'too_complex', 'Companion knows its limits — escalate human.'),
    (p_org_id, 'esc_perm', 'Permission Missing', 'permission_missing', 'Permission missing — escalate human.'),
    (p_org_id, 'esc_risk', 'Risk Too High', 'risk_too_high', 'Risk too high — escalate human.');

  insert into public.organization_dewf598_collaboration (
    organization_id, collaboration_key, collaboration_title, workflow_stage, summary
  ) values
    (p_org_id, 'collab_human', 'Human Employee', 'human_employee', 'Human + digital collaboration — not replacement.'),
    (p_org_id, 'collab_digital', 'Digital Employee', 'digital_employee', 'Digital employee in shared workflow.'),
    (p_org_id, 'collab_shared', 'Shared Workflow', 'shared_workflow', 'Increase productivity together.'),
    (p_org_id, 'collab_outcome', 'Outcome Delivered', 'outcome', 'Shared outcome — human accountability preserved.');

  insert into public.organization_dewf598_business_packs (
    organization_id, pack_key, pack_title, deployed_role, employee_count, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 'Support Specialist', 2, 'Support Pack → Support Specialist.'),
    (p_org_id, 'finance', 'Finance Pack', 'Finance Assistant', 1, 'Finance Pack → Finance Assistant.'),
    (p_org_id, 'hosts', 'Hosts Pack', 'Property Operations Assistant', 1, 'Hosts Pack → property operations.'),
    (p_org_id, 'commerce', 'Commerce Pack', 'Commerce Coordinator', 1, 'Commerce Pack → commerce coordinator.');

  perform public._dewf598_log(p_org_id, 'digital_employee_created', 'Digital employee center baseline seeded.');
end; $$;

create or replace function public.get_organization_digital_employee_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_avg_performance integer;
begin
  v_org_id := public._dewf598_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._dewf598_seed(v_org_id);

  v_avg_performance := coalesce((
    select round(avg(performance_score)) from public.organization_dewf598_employees where organization_id = v_org_id
  ), 75);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Companion supports employees — digital workers are governed, accountable, and never uncontrolled.',
      'privacy_note', 'Digital employees have defined responsibilities, permissions, and boundaries — humans retain accountability.',
      'executive_dashboard', jsonb_build_object(
        'digital_employees', (select count(*) from public.organization_dewf598_employees where organization_id = v_org_id),
        'task_volume', (select count(*) from public.organization_dewf598_tasks where organization_id = v_org_id),
        'avg_performance', v_avg_performance,
        'open_escalations', (select count(*) from public.organization_dewf598_escalations where organization_id = v_org_id and escalation_status = 'open'),
        'pending_approvals', (select count(*) from public.organization_dewf598_tasks where organization_id = v_org_id and task_status = 'pending'),
        'active_teams', (select count(*) from public.organization_dewf598_teams where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'employees', (select count(*) from public.organization_dewf598_employees where organization_id = v_org_id),
        'roles', (select count(*) from public.organization_dewf598_roles where organization_id = v_org_id),
        'tasks', (select count(*) from public.organization_dewf598_tasks where organization_id = v_org_id),
        'teams', (select count(*) from public.organization_dewf598_teams where organization_id = v_org_id),
        'escalations', (select count(*) from public.organization_dewf598_escalations where organization_id = v_org_id),
        'performance_metrics', (select count(*) from public.organization_dewf598_performance where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'task_title', t.task_title, 'recommendation', t.summary
        ) order by t.task_status)
        from public.organization_dewf598_tasks t
        where t.organization_id = v_org_id and t.task_status in ('escalated', 'pending')
        limit 4
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'A digital employee should be accountable, governed, and help perform work safely.',
    'privacy_note', 'Autonomy levels 0–5 — Level 5 only where governance permits.',
    'executive_dashboard', jsonb_build_object(
      'digital_employees', (select count(*) from public.organization_dewf598_employees where organization_id = v_org_id),
      'task_volume', (select count(*) from public.organization_dewf598_tasks where organization_id = v_org_id),
      'avg_performance', v_avg_performance,
      'open_escalations', (select count(*) from public.organization_dewf598_escalations where organization_id = v_org_id and escalation_status = 'open'),
      'pending_approvals', (select count(*) from public.organization_dewf598_tasks where organization_id = v_org_id and task_status = 'pending'),
      'active_teams', (select count(*) from public.organization_dewf598_teams where organization_id = v_org_id)
    ),
    'employees', coalesce((select jsonb_agg(jsonb_build_object(
      'employee_key', e.employee_key, 'employee_name', e.employee_name, 'employee_role', e.employee_role,
      'department', e.department, 'employee_status', e.employee_status,
      'autonomy_level', e.autonomy_level, 'performance_score', e.performance_score, 'summary', e.summary
    ) order by e.employee_name) from public.organization_dewf598_employees e where e.organization_id = v_org_id), '[]'::jsonb),
    'roles', coalesce((select jsonb_agg(jsonb_build_object(
      'role_key', r.role_key, 'role_title', r.role_title,
      'role_type', r.role_type, 'role_status', r.role_status, 'summary', r.summary
    ) order by r.role_title) from public.organization_dewf598_roles r where r.organization_id = v_org_id), '[]'::jsonb),
    'responsibilities', coalesce((select jsonb_agg(jsonb_build_object(
      'responsibility_key', r.responsibility_key, 'responsibility_title', r.responsibility_title,
      'responsibility_type', r.responsibility_type, 'summary', r.summary
    ) order by r.responsibility_type) from public.organization_dewf598_responsibilities r where r.organization_id = v_org_id), '[]'::jsonb),
    'tasks', coalesce((select jsonb_agg(jsonb_build_object(
      'task_key', t.task_key, 'task_title', t.task_title,
      'task_status', t.task_status, 'assigned_to', t.assigned_to, 'summary', t.summary
    ) order by t.task_status) from public.organization_dewf598_tasks t where t.organization_id = v_org_id), '[]'::jsonb),
    'autonomy_levels', coalesce((select jsonb_agg(jsonb_build_object(
      'autonomy_key', a.autonomy_key, 'autonomy_title', a.autonomy_title,
      'autonomy_level', a.autonomy_level, 'autonomy_status', a.autonomy_status, 'summary', a.summary
    ) order by a.autonomy_level) from public.organization_dewf598_autonomy a where a.organization_id = v_org_id), '[]'::jsonb),
    'performance_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'metric_title', m.metric_title,
      'metric_type', m.metric_type, 'metric_score', m.metric_score, 'summary', m.summary
    ) order by m.metric_score desc) from public.organization_dewf598_performance m where m.organization_id = v_org_id), '[]'::jsonb),
    'teams', coalesce((select jsonb_agg(jsonb_build_object(
      'team_key', t.team_key, 'team_title', t.team_title,
      'team_type', t.team_type, 'member_count', t.member_count, 'summary', t.summary
    ) order by t.team_title) from public.organization_dewf598_teams t where t.organization_id = v_org_id), '[]'::jsonb),
    'escalations', coalesce((select jsonb_agg(jsonb_build_object(
      'escalation_key', e.escalation_key, 'escalation_title', e.escalation_title,
      'escalation_reason', e.escalation_reason, 'escalation_status', e.escalation_status, 'summary', e.summary
    ) order by e.escalation_status) from public.organization_dewf598_escalations e where e.organization_id = v_org_id), '[]'::jsonb),
    'collaboration', coalesce((select jsonb_agg(jsonb_build_object(
      'collaboration_key', c.collaboration_key, 'collaboration_title', c.collaboration_title,
      'workflow_stage', c.workflow_stage, 'collaboration_status', c.collaboration_status, 'summary', c.summary
    ) order by c.workflow_stage) from public.organization_dewf598_collaboration c where c.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'deployed_role', p.deployed_role, 'employee_count', p.employee_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_dewf598_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'employees', 'What digital employees exist?',
      'work', 'What work are they performing?',
      'attention', 'Which tasks require attention?',
      'overloaded', 'Which roles are overloaded?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_dewf598_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'review_employees', true, 'review_assignments', true, 'review_performance', true,
      'review_escalations', true, 'approve_actions', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_workforce_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_digital_employee_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Workforce Report',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'employees',
        'observation', format('%s digital employee(s) across %s team(s).', v_stats->>'employees', v_stats->>'teams'),
        'recommendation', 'Review digital employee registry and role assignments.',
        'href', '/app/digital-employees/employees'
      ),
      jsonb_build_object(
        'key', 'work',
        'observation', format('%s task(s) tracked — avg performance %s.', v_stats->>'tasks', v_exec->>'avg_performance'),
        'recommendation', 'Review assigned and pending work.',
        'href', '/app/digital-employees/assignments'
      ),
      jsonb_build_object(
        'key', 'attention',
        'observation', format('%s open escalation(s) and %s pending approval(s).', v_exec->>'open_escalations', v_exec->>'pending_approvals'),
        'recommendation', 'Address tasks requiring human attention.',
        'href', '/app/digital-employees/approvals'
      ),
      jsonb_build_object(
        'key', 'overloaded',
        'observation', format('%s role simulation profile(s) active.', v_stats->>'roles'),
        'recommendation', 'Balance workload across digital employee teams.',
        'href', '/app/digital-employees/roles'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_digital_employee_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_digital_employee_center('overview');
end;
$$;

grant execute on function public.get_organization_digital_employee_center(text) to authenticated;
grant execute on function public.get_aipify_companion_workforce_advisor_bundle() to authenticated;
grant execute on function public.get_organization_digital_employee_center_mobile_summary() to authenticated;

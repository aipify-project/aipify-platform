-- Phase 411 — Enterprise AI Agent Orchestration Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/orchestration. Helpers: _geaaoe411_*
-- Digital workforce orchestration — agents, teams, task routing, workflows, approvals, governance.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.agent_orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  orchestration_mode text not null default 'supervised' check (
    orchestration_mode in ('supervised', 'assisted', 'enterprise')
  ),
  health_score integer not null default 72 check (health_score between 0 and 100),
  automation_success_rate numeric(5, 2) not null default 0 check (automation_success_rate between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_orchestration_agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  agent_key text not null,
  agent_name text not null,
  agent_role text not null default '',
  agent_type text not null default 'operational' check (
    agent_type in (
      'assistant', 'operational', 'analytical', 'compliance',
      'customer', 'industry', 'executive', 'custom'
    )
  ),
  agent_status text not null default 'active' check (
    agent_status in (
      'active', 'busy', 'awaiting_approval', 'paused',
      'disabled', 'maintenance', 'archived'
    )
  ),
  capabilities jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  knowledge_sources jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  business_packs jsonb not null default '[]'::jsonb,
  industry_packs jsonb not null default '[]'::jsonb,
  workload_score integer not null default 0 check (workload_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, agent_key)
);

create index if not exists agent_orchestration_agents_tenant_idx
  on public.agent_orchestration_agents (tenant_id, agent_status);

create table if not exists public.agent_orchestration_teams (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  team_key text not null,
  team_name text not null,
  team_type text not null default 'custom' check (
    team_type in (
      'support', 'sales', 'operations', 'finance', 'compliance',
      'industry', 'executive', 'custom'
    )
  ),
  agent_ids jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, team_key)
);

create index if not exists agent_orchestration_teams_tenant_idx
  on public.agent_orchestration_teams (tenant_id, team_type);

create table if not exists public.agent_orchestration_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  task_key text not null,
  task_title text not null,
  task_status text not null default 'created' check (
    task_status in (
      'created', 'assigned', 'analysis', 'action_recommended',
      'awaiting_approval', 'executing', 'verification', 'completed',
      'failed', 'cancelled'
    )
  ),
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'critical')
  ),
  department text not null default '',
  assigned_agent_id uuid references public.agent_orchestration_agents (id) on delete set null,
  team_id uuid references public.agent_orchestration_teams (id) on delete set null,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical', 'governance_required')
  ),
  confidence_score numeric(5, 2) check (confidence_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, task_key)
);

create index if not exists agent_orchestration_tasks_tenant_idx
  on public.agent_orchestration_tasks (tenant_id, task_status);

create table if not exists public.agent_orchestration_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null,
  workflow_type text not null default 'single_agent' check (
    workflow_type in (
      'single_agent', 'multi_agent', 'cross_department',
      'industry', 'human_in_loop', 'enterprise'
    )
  ),
  workflow_status text not null default 'pending' check (
    workflow_status in ('pending', 'running', 'completed', 'blocked', 'failed', 'cancelled')
  ),
  agent_ids jsonb not null default '[]'::jsonb,
  task_id uuid references public.agent_orchestration_tasks (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create index if not exists agent_orchestration_workflows_tenant_idx
  on public.agent_orchestration_workflows (tenant_id, workflow_status);

create table if not exists public.agent_orchestration_approval_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approval_key text not null,
  approval_type text not null default 'employee' check (
    approval_type in (
      'employee', 'manager', 'executive', 'finance', 'compliance', 'custom'
    )
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'granted', 'denied', 'expired')
  ),
  task_id uuid references public.agent_orchestration_tasks (id) on delete set null,
  workflow_id uuid references public.agent_orchestration_workflows (id) on delete set null,
  agent_id uuid references public.agent_orchestration_agents (id) on delete set null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, approval_key)
);

create index if not exists agent_orchestration_approval_requests_tenant_idx
  on public.agent_orchestration_approval_requests (tenant_id, approval_status);

create table if not exists public.agent_orchestration_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'task_delegation', 'finance_review_required', 'agents_overloaded',
      'workflow_automation', 'approval_blocked', 'workload_increasing',
      'approval_bottleneck', 'department_automation', 'performance_improving'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists agent_orchestration_advisor_signals_tenant_idx
  on public.agent_orchestration_advisor_signals (tenant_id, created_at desc);

create table if not exists public.agent_orchestration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'agent_created', 'agent_updated', 'task_assigned', 'workflow_started',
      'workflow_completed', 'approval_requested', 'approval_granted',
      'action_executed', 'delegation_performed', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists agent_orchestration_audit_logs_tenant_idx
  on public.agent_orchestration_audit_logs (tenant_id, created_at desc);

alter table public.agent_orchestration_settings enable row level security;
alter table public.agent_orchestration_agents enable row level security;
alter table public.agent_orchestration_teams enable row level security;
alter table public.agent_orchestration_tasks enable row level security;
alter table public.agent_orchestration_workflows enable row level security;
alter table public.agent_orchestration_approval_requests enable row level security;
alter table public.agent_orchestration_advisor_signals enable row level security;
alter table public.agent_orchestration_audit_logs enable row level security;

revoke all on public.agent_orchestration_settings from authenticated, anon;
revoke all on public.agent_orchestration_agents from authenticated, anon;
revoke all on public.agent_orchestration_teams from authenticated, anon;
revoke all on public.agent_orchestration_tasks from authenticated, anon;
revoke all on public.agent_orchestration_workflows from authenticated, anon;
revoke all on public.agent_orchestration_approval_requests from authenticated, anon;
revoke all on public.agent_orchestration_advisor_signals from authenticated, anon;
revoke all on public.agent_orchestration_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_ai_agent_orchestration_engine', v.description
from (values
  ('agent_orchestration.view', 'View Agent Orchestration', 'View digital employees, teams, workflows, and orchestration operations'),
  ('agent_orchestration.manage', 'Manage Agent Orchestration', 'Manage agents, teams, task routing, workflows, and orchestration settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _geaaoe411_*
-- ---------------------------------------------------------------------------
create or replace function public._geaaoe411_require_access()
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
    raise exception 'Enterprise Agent Orchestration requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._geaaoe411_log_audit(
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
  insert into public.agent_orchestration_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._geaaoe411_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.agent_orchestration_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.agent_orchestration_settings;
begin
  insert into public.agent_orchestration_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.agent_orchestration_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._geaaoe411_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.agent_orchestration_agents where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.agent_orchestration_agents (
    tenant_id, agent_key, agent_name, agent_role, agent_type, agent_status, capabilities
  ) values
    (
      p_tenant_id, 'companion', 'Aipify Companion', 'Primary business companion',
      'assistant', 'active', '["guidance","briefings","coordination"]'::jsonb
    ),
    (
      p_tenant_id, 'support-agent', 'Support Specialist', 'Customer support operations',
      'customer', 'active', '["triage","knowledge","escalation"]'::jsonb
    ),
    (
      p_tenant_id, 'operations-agent', 'Operations Specialist', 'Cross-department operations',
      'operational', 'active', '["routing","workflows","monitoring"]'::jsonb
    ),
    (
      p_tenant_id, 'compliance-agent', 'Compliance Specialist', 'Governance and compliance review',
      'compliance', 'active', '["policy","approvals","audit"]'::jsonb
    );

  insert into public.agent_orchestration_teams (
    tenant_id, team_key, team_name, team_type
  ) values
    (p_tenant_id, 'support-team', 'Support Team', 'support'),
    (p_tenant_id, 'operations-team', 'Operations Team', 'operations'),
    (p_tenant_id, 'compliance-team', 'Compliance Team', 'compliance');

  perform public._geaaoe411_log_audit(
    p_tenant_id, 'engine_activated', 'Default digital workforce seeded',
    jsonb_build_object('agents', 4, 'teams', 3)
  );
end;
$$;

create or replace function public._geaaoe411_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.agent_orchestration_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.agent_orchestration_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'workflow_automation',
      'Several workflows may be candidates for supervised automation.',
      'Automation coverage improves productivity when approvals remain in human control.',
      'Review Workflow Execution and confirm human-in-the-loop checkpoints.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'workload_increasing',
      'Agent workload indicators may be trending upward.',
      'Balanced utilization protects service quality and approval responsiveness.',
      'Open Agent Directory and review capacity across teams.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'approval_bottleneck',
      'Approval chains may require attention when pending requests accumulate.',
      'Blocked approvals delay safe action execution and workflow completion.',
      'Review Approval Chains and confirm governance routing.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._geaaoe411_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_active_agents integer := 0;
  v_active_tasks integer := 0;
  v_running_workflows integer := 0;
  v_completed_workflows integer := 0;
  v_pending_approvals integer := 0;
  v_automation_rate numeric := 0;
  v_health numeric := 72;
begin
  select count(*)::int into v_active_agents
  from public.agent_orchestration_agents
  where tenant_id = p_tenant_id and agent_status in ('active', 'busy');

  select count(*)::int into v_active_tasks
  from public.agent_orchestration_tasks
  where tenant_id = p_tenant_id and task_status not in ('completed', 'failed', 'cancelled');

  select count(*)::int into v_running_workflows
  from public.agent_orchestration_workflows
  where tenant_id = p_tenant_id and workflow_status = 'running';

  select count(*)::int into v_completed_workflows
  from public.agent_orchestration_workflows
  where tenant_id = p_tenant_id and workflow_status = 'completed';

  select count(*)::int into v_pending_approvals
  from public.agent_orchestration_approval_requests
  where tenant_id = p_tenant_id and approval_status = 'pending';

  select coalesce(automation_success_rate, 0), coalesce(health_score, 72)
  into v_automation_rate, v_health
  from public.agent_orchestration_settings where tenant_id = p_tenant_id;

  if v_completed_workflows > 0 then
    v_automation_rate := greatest(
      v_automation_rate,
      round((v_completed_workflows::numeric / greatest(v_completed_workflows + v_running_workflows, 1)) * 100, 1)
    );
  end if;

  return jsonb_build_object(
    'active_agents', v_active_agents,
    'active_tasks', v_active_tasks,
    'running_workflows', v_running_workflows,
    'completed_workflows', v_completed_workflows,
    'pending_approvals', v_pending_approvals,
    'automation_success_rate', round(v_automation_rate, 1),
    'orchestration_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_ai_agent_orchestration_center()
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
  v_settings public.agent_orchestration_settings;
  v_agents jsonb := '[]'::jsonb;
  v_teams jsonb := '[]'::jsonb;
  v_tasks jsonb := '[]'::jsonb;
  v_workflows jsonb := '[]'::jsonb;
  v_approvals jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('agent_orchestration.view');
  v_ctx := public._geaaoe411_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._geaaoe411_ensure_settings(v_org_id, v_tenant_id);
  perform public._geaaoe411_seed_defaults(v_tenant_id);
  perform public._geaaoe411_seed_advisor(v_tenant_id);
  v_overview := public._geaaoe411_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'agent_key', a.agent_key, 'agent_name', a.agent_name,
    'agent_role', a.agent_role, 'agent_type', a.agent_type, 'agent_status', a.agent_status,
    'workload_score', a.workload_score, 'capabilities', a.capabilities
  ) order by a.agent_name), '[]'::jsonb)
  into v_agents
  from public.agent_orchestration_agents a
  where a.tenant_id = v_tenant_id and a.agent_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'team_key', t.team_key, 'team_name', t.team_name,
    'team_type', t.team_type, 'agent_ids', t.agent_ids
  ) order by t.team_name), '[]'::jsonb)
  into v_teams
  from public.agent_orchestration_teams t
  where t.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', tk.id, 'task_key', tk.task_key, 'task_title', tk.task_title,
    'task_status', tk.task_status, 'priority', tk.priority, 'department', tk.department,
    'assigned_agent_id', tk.assigned_agent_id, 'risk_level', tk.risk_level
  ) order by tk.updated_at desc), '[]'::jsonb)
  into v_tasks
  from public.agent_orchestration_tasks tk
  where tk.tenant_id = v_tenant_id and tk.task_status not in ('completed', 'cancelled')
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'workflow_key', w.workflow_key, 'workflow_name', w.workflow_name,
    'workflow_type', w.workflow_type, 'workflow_status', w.workflow_status,
    'started_at', w.started_at, 'completed_at', w.completed_at
  ) order by w.updated_at desc), '[]'::jsonb)
  into v_workflows
  from public.agent_orchestration_workflows w
  where w.tenant_id = v_tenant_id and w.workflow_status != 'cancelled'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ar.id, 'approval_key', ar.approval_key, 'approval_type', ar.approval_type,
    'approval_status', ar.approval_status, 'summary', ar.summary,
    'task_id', ar.task_id, 'workflow_id', ar.workflow_id
  ) order by ar.updated_at desc), '[]'::jsonb)
  into v_approvals
  from public.agent_orchestration_approval_requests ar
  where ar.tenant_id = v_tenant_id and ar.approval_status = 'pending'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.agent_orchestration_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.agent_orchestration_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'One assistant is useful — a coordinated digital workforce under human supervision is transformational.',
    'mission', 'Enterprise AI Agent Orchestration — the operational brain coordinating digital employees, workflows, approvals, and business operations.',
    'abos_principle', 'Aipify orchestrates; humans decide. Companion-centered digital workforce with governance always in control.',
    'coordination_route', '/app/orchestration/events',
    'distinction_note', 'Extends Orchestration Engine event coordination with digital employee workforce management.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/orchestration'),
      jsonb_build_object('key', 'agents', 'route', '/app/orchestration/agents'),
      jsonb_build_object('key', 'teams', 'route', '/app/orchestration/teams'),
      jsonb_build_object('key', 'routing', 'route', '/app/orchestration/routing'),
      jsonb_build_object('key', 'workflows', 'route', '/app/orchestration/workflows'),
      jsonb_build_object('key', 'approvals', 'route', '/app/orchestration/approvals'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/orchestration/intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/orchestration/governance')
    ),
    'agents', v_agents,
    'teams', v_teams,
    'tasks', v_tasks,
    'workflows', v_workflows,
    'approval_requests', v_approvals,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'agents_route', '/app/orchestration/agents',
      'teams_route', '/app/orchestration/teams',
      'routing_route', '/app/orchestration/routing',
      'workflows_route', '/app/orchestration/workflows',
      'approvals_route', '/app/orchestration/approvals',
      'intelligence_route', '/app/orchestration/intelligence',
      'governance_route', '/app/orchestration/governance',
      'events_route', '/app/orchestration/events',
      'flows_route', '/app/orchestration/flows',
      'rules_route', '/app/orchestration/rules',
      'settings_route', '/app/orchestration/settings'
    ),
    'executive_dashboard', jsonb_build_object(
      'digital_workforce_size', v_overview->>'active_agents',
      'tasks_completed', v_overview->>'completed_workflows',
      'automation_coverage', v_overview->>'automation_success_rate',
      'pending_approvals', v_overview->>'pending_approvals',
      'orchestration_health_score', v_overview->>'orchestration_health_score',
      'executive_route', '/app/orchestration/intelligence'
    ),
    'privacy_note', 'Agent activity isolated per organization — metadata-first orchestration with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.enterprise_ai_agent_orchestration_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_agent_id uuid;
  v_team_id uuid;
  v_task_id uuid;
  v_workflow_id uuid;
  v_approval_id uuid;
  v_task_title text;
  v_workflow_name text;
  v_agent_name text;
begin
  perform public._irp_require_permission('agent_orchestration.manage');
  perform public._geaaoe411_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._geaaoe411_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_agent' then
    insert into public.agent_orchestration_agents (
      tenant_id, agent_key, agent_name, agent_role, agent_type, agent_status, capabilities
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'agent_key', 'agent-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'agent_name', 'New agent'),
      coalesce(p_payload->>'agent_role', ''),
      coalesce(p_payload->>'agent_type', 'custom'),
      coalesce(p_payload->>'agent_status', 'active'),
      coalesce(p_payload->'capabilities', '[]'::jsonb)
    ) returning id, agent_name into v_agent_id, v_agent_name;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'agent_created', 'Agent created: ' || v_agent_name,
      jsonb_build_object('agent_id', v_agent_id)
    );

    return jsonb_build_object('ok', true, 'agent_id', v_agent_id);
  end if;

  if v_action = 'create_team' then
    insert into public.agent_orchestration_teams (
      tenant_id, team_key, team_name, team_type
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'team_key', 'team-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'team_name', 'New team'),
      coalesce(p_payload->>'team_type', 'custom')
    ) returning id into v_team_id;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'agent_updated', 'Team created',
      jsonb_build_object('team_id', v_team_id)
    );

    return jsonb_build_object('ok', true, 'team_id', v_team_id);
  end if;

  if v_action = 'assign_task' then
    insert into public.agent_orchestration_tasks (
      tenant_id, task_key, task_title, task_status, priority, department,
      assigned_agent_id, team_id, risk_level
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'task_key', 'TASK-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'task_title', 'New task'),
      coalesce(p_payload->>'task_status', 'assigned'),
      coalesce(p_payload->>'priority', 'normal'),
      coalesce(p_payload->>'department', ''),
      nullif(p_payload->>'assigned_agent_id', '')::uuid,
      nullif(p_payload->>'team_id', '')::uuid,
      coalesce(p_payload->>'risk_level', 'low')
    ) returning id, task_title into v_task_id, v_task_title;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'task_assigned', 'Task assigned: ' || v_task_title,
      jsonb_build_object('task_id', v_task_id)
    );

    return jsonb_build_object('ok', true, 'task_id', v_task_id);
  end if;

  if v_action = 'start_workflow' then
    insert into public.agent_orchestration_workflows (
      tenant_id, workflow_key, workflow_name, workflow_type, workflow_status,
      task_id, started_at
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'workflow_key', 'WF-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'workflow_name', 'New workflow'),
      coalesce(p_payload->>'workflow_type', 'single_agent'),
      'running',
      nullif(p_payload->>'task_id', '')::uuid,
      now()
    ) returning id, workflow_name into v_workflow_id, v_workflow_name;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'workflow_started', 'Workflow started: ' || v_workflow_name,
      jsonb_build_object('workflow_id', v_workflow_id)
    );

    return jsonb_build_object('ok', true, 'workflow_id', v_workflow_id);
  end if;

  if v_action = 'request_approval' then
    insert into public.agent_orchestration_approval_requests (
      tenant_id, approval_key, approval_type, approval_status,
      task_id, workflow_id, agent_id, summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'approval_key', 'APR-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'approval_type', 'manager'),
      'pending',
      nullif(p_payload->>'task_id', '')::uuid,
      nullif(p_payload->>'workflow_id', '')::uuid,
      nullif(p_payload->>'agent_id', '')::uuid,
      coalesce(p_payload->>'summary', 'Approval required')
    ) returning id into v_approval_id;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'approval_requested', 'Approval requested',
      jsonb_build_object('approval_id', v_approval_id)
    );

    return jsonb_build_object('ok', true, 'approval_id', v_approval_id);
  end if;

  if v_action = 'delegate_task' then
    update public.agent_orchestration_tasks
    set
      assigned_agent_id = nullif(p_payload->>'assigned_agent_id', '')::uuid,
      team_id = nullif(p_payload->>'team_id', '')::uuid,
      task_status = coalesce(p_payload->>'task_status', 'assigned'),
      updated_at = now()
    where id = nullif(p_payload->>'task_id', '')::uuid and tenant_id = v_tenant_id
    returning id into v_task_id;

    perform public._geaaoe411_log_audit(
      v_tenant_id, 'delegation_performed', 'Task delegated',
      jsonb_build_object('task_id', v_task_id)
    );

    return jsonb_build_object('ok', true, 'task_id', v_task_id);
  end if;

  raise exception 'Unsupported agent orchestration action: %', v_action;
end;
$$;

grant execute on function public.get_enterprise_ai_agent_orchestration_center() to authenticated;
grant execute on function public.enterprise_ai_agent_orchestration_action(jsonb) to authenticated;

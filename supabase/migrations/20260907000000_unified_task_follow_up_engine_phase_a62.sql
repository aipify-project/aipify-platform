-- Phase A.62 — Unified Task & Follow-Up Engine
-- Extends Operations Center (A.32), Workflow Orchestration (A.42),
-- Meeting & Collaboration Intelligence (A.61), Organizational Memory (A.34).

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
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_tasks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  assigned_user_id uuid references public.users (id) on delete set null,
  created_by uuid references public.users (id) on delete set null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'in_progress', 'awaiting_approval', 'completed', 'cancelled', 'overdue')
  ),
  due_date date,
  source_type text not null default 'manual' check (
    source_type in (
      'meeting', 'support', 'incident', 'workflow', 'executive_initiative',
      'improvement_program', 'knowledge_center', 'manual'
    )
  ),
  source_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_tasks_org_idx
  on public.organization_tasks (organization_id, status, priority, due_date);

create index if not exists organization_tasks_assigned_idx
  on public.organization_tasks (organization_id, assigned_user_id, status);

alter table public.organization_tasks enable row level security;
revoke all on public.organization_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_task_reminders
-- ---------------------------------------------------------------------------
create table if not exists public.organization_task_reminders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  remind_at timestamptz not null,
  channel text not null default 'in_app' check (
    channel in ('in_app', 'email', 'desktop', 'calendar')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'sent', 'cancelled', 'failed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_task_reminders_org_idx
  on public.organization_task_reminders (organization_id, task_id, remind_at);

alter table public.organization_task_reminders enable row level security;
revoke all on public.organization_task_reminders from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_task_escalations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_task_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  escalation_level text not null default 'recommended' check (
    escalation_level in ('recommended', 'requested', 'approved', 'dismissed')
  ),
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_task_escalations_org_idx
  on public.organization_task_escalations (organization_id, task_id, created_at desc);

alter table public.organization_task_escalations enable row level security;
revoke all on public.organization_task_escalations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_task_calendar_links
-- ---------------------------------------------------------------------------
create table if not exists public.organization_task_calendar_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  provider text not null check (
    provider in ('google', 'outlook', 'apple', 'aipify_internal')
  ),
  external_event_id text,
  sync_status text not null default 'pending' check (
    sync_status in ('pending', 'synced', 'failed', 'disconnected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_task_calendar_links_org_idx
  on public.organization_task_calendar_links (organization_id, task_id, provider);

alter table public.organization_task_calendar_links enable row level security;
revoke all on public.organization_task_calendar_links from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organization_task_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_task_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  reminders_enabled boolean not null default true,
  escalation_enabled boolean not null default true,
  calendar_sync_enabled boolean not null default false,
  default_reminder_hours int not null default 24,
  overdue_warning_days int not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_task_settings enable row level security;
revoke all on public.organization_task_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions — tasks.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'unified_task_follow_up', v.description
from (values
  ('tasks.view', 'View Tasks', 'View organizational tasks, dashboards, and follow-up status'),
  ('tasks.manage', 'Manage Tasks', 'Create and update organizational tasks and settings'),
  ('tasks.assign', 'Assign Tasks', 'Assign tasks and update ownership'),
  ('tasks.complete', 'Complete Tasks', 'Mark tasks complete or update task status'),
  ('tasks.export', 'Export Tasks', 'Export task manifests and executive summaries')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'tasks.view'), ('owner', 'tasks.manage'), ('owner', 'tasks.assign'), ('owner', 'tasks.complete'), ('owner', 'tasks.export'),
  ('administrator', 'tasks.view'), ('administrator', 'tasks.manage'), ('administrator', 'tasks.assign'), ('administrator', 'tasks.complete'), ('administrator', 'tasks.export'),
  ('manager', 'tasks.view'), ('manager', 'tasks.manage'), ('manager', 'tasks.assign'), ('manager', 'tasks.complete'), ('manager', 'tasks.export'),
  ('support_agent', 'tasks.view'), ('support_agent', 'tasks.complete'),
  ('viewer', 'tasks.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_utfe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._utfe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_task',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._utfe_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_task_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._utfe_mark_overdue_tasks(p_organization_id uuid, p_task_id uuid default null)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int := 0;
begin
  if p_task_id is not null then
    update public.organization_tasks
    set status = 'overdue', updated_at = now()
    where id = p_task_id and organization_id = p_organization_id
      and status in ('open', 'in_progress', 'awaiting_approval')
      and due_date is not null and due_date < current_date;
    get diagnostics v_count = row_count;
  else
    update public.organization_tasks
    set status = 'overdue', updated_at = now()
    where organization_id = p_organization_id
      and status in ('open', 'in_progress', 'awaiting_approval')
      and due_date is not null and due_date < current_date;
    get diagnostics v_count = row_count;
  end if;
  return v_count;
end; $$;

create or replace function public._utfe_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'open_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id and status in ('open', 'in_progress', 'awaiting_approval')
    ), 0),
    'my_open_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and assigned_user_id = v_user_id
        and status in ('open', 'in_progress', 'awaiting_approval')
    ), 0),
    'team_open_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and (assigned_user_id is null or assigned_user_id <> v_user_id)
        and status in ('open', 'in_progress', 'awaiting_approval')
    ), 0),
    'overdue_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id and status = 'overdue'
    ), 0),
    'upcoming_deadlines_7d', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and status in ('open', 'in_progress', 'awaiting_approval')
        and due_date is not null
        and due_date between current_date and current_date + 7
    ), 0),
    'critical_tasks', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and priority = 'critical'
        and status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
    ), 0),
    'completed_tasks_30d', coalesce((
      select count(*) from public.organization_tasks
      where organization_id = p_organization_id
        and status = 'completed'
        and updated_at >= now() - interval '30 days'
    ), 0),
    'scheduled_reminders', coalesce((
      select count(*) from public.organization_task_reminders
      where organization_id = p_organization_id and status = 'scheduled'
    ), 0),
    'pending_escalations', coalesce((
      select count(*) from public.organization_task_escalations
      where organization_id = p_organization_id and escalation_level in ('recommended', 'requested')
    ), 0)
  );
end; $$;

create or replace function public._utfe_meeting_integration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'meeting_action_items' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'open_meeting_actions', coalesce((
      select count(*) from public.meeting_action_items
      where organization_id = p_organization_id and status in ('open', 'in_progress', 'overdue')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._utfe_workflow_integration_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_workflows', coalesce((
      select count(*) from public.organization_workflows
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._utfe_operations_center_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'operations_center_events' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'open_events', coalesce((
      select count(*) from public.operations_center_events
      where organization_id = p_organization_id and status in ('open', 'assigned', 'escalated')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._utfe_memory_hook(
  p_organization_id uuid,
  p_task_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;
  return public.capture_organization_memory(
    'task_completion',
    left(coalesce(p_summary, 'Task outcome captured'), 500),
    jsonb_build_object(
      'source', 'unified_task_follow_up_engine',
      'task_id', p_task_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._utfe_seed_tasks(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user_id uuid;
begin
  perform public._utfe_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_tasks where organization_id = p_organization_id limit 1) then
    return;
  end if;

  v_user_id := public._mta_app_user_id();

  insert into public.organization_tasks (
    organization_id, title, description, assigned_user_id, created_by,
    priority, status, due_date, source_type, metadata
  )
  values
    (
      p_organization_id,
      'Review weekly operational priorities',
      'Confirm open commitments and assign owners for the week ahead.',
      v_user_id,
      v_user_id,
      'high',
      'open',
      current_date + 3,
      'manual',
      jsonb_build_object('seed', true, 'metadata_only', true)
    ),
    (
      p_organization_id,
      'Follow up on meeting action items',
      'Convert meeting outcomes into tracked organizational tasks.',
      null,
      v_user_id,
      'medium',
      'open',
      current_date + 7,
      'meeting',
      jsonb_build_object('seed', true, 'metadata_only', true)
    ),
    (
      p_organization_id,
      'Complete incident review checklist',
      'Post-incident review tasks after resolution — metadata only.',
      null,
      v_user_id,
      'critical',
      'open',
      current_date + 2,
      'incident',
      jsonb_build_object('seed', true, 'metadata_only', true)
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_task(
  p_title text,
  p_description text default null,
  p_priority text default 'medium',
  p_due_date date default null,
  p_assigned_user_id uuid default null,
  p_source_type text default 'manual',
  p_source_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organization_tasks;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._utfe_ensure_settings(v_org_id);

  if coalesce(trim(p_title), '') = '' then raise exception 'Task title required'; end if;

  insert into public.organization_tasks (
    organization_id, title, description, assigned_user_id, created_by,
    priority, status, due_date, source_type, source_id, metadata
  )
  values (
    v_org_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 1000),
    p_assigned_user_id,
    v_user_id,
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    'open',
    p_due_date,
    coalesce(nullif(trim(p_source_type), ''), 'manual'),
    p_source_id,
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning * into v_row;

  perform public._utfe_log(
    v_org_id, 'utfe_task_created', 'organization_task', v_row.id,
    jsonb_build_object('priority', v_row.priority, 'source_type', v_row.source_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.assign_organization_task(
  p_task_id uuid,
  p_assigned_user_id uuid,
  p_due_date date default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_tasks; v_prev uuid;
begin
  perform public._irp_require_permission('tasks.assign');
  v_org_id := public._mta_require_organization();

  select assigned_user_id into v_prev from public.organization_tasks
  where id = p_task_id and organization_id = v_org_id;

  update public.organization_tasks
  set
    assigned_user_id = p_assigned_user_id,
    due_date = coalesce(p_due_date, due_date),
    updated_at = now()
  where id = p_task_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Task not found'; end if;

  perform public._utfe_log(
    v_org_id, 'utfe_task_assigned', 'organization_task', v_row.id,
    jsonb_build_object('previous_assigned_user_id', v_prev, 'assigned_user_id', p_assigned_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_organization_task_status(
  p_task_id uuid,
  p_status text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_tasks; v_prev text;
begin
  perform public._irp_require_permission('tasks.complete');
  v_org_id := public._mta_require_organization();

  select status into v_prev from public.organization_tasks
  where id = p_task_id and organization_id = v_org_id;

  update public.organization_tasks
  set
    status = p_status,
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_task_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Task not found'; end if;

  perform public._utfe_log(
    v_org_id, 'utfe_task_status_updated', 'organization_task', v_row.id,
    jsonb_build_object('previous_status', v_prev, 'status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.complete_organization_task(
  p_task_id uuid,
  p_capture_memory boolean default false,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_tasks; v_memory jsonb;
begin
  perform public._irp_require_permission('tasks.complete');
  v_org_id := public._mta_require_organization();

  update public.organization_tasks
  set
    status = 'completed',
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('completed_at', now()),
    updated_at = now()
  where id = p_task_id and organization_id = v_org_id
    and status not in ('completed', 'cancelled')
  returning * into v_row;

  if v_row.id is null then raise exception 'Task not found or already closed'; end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._utfe_memory_hook(v_org_id, v_row.id, v_row.title, p_metadata);
    update public.organization_tasks
    set metadata = metadata || jsonb_build_object('memory_hook', v_memory)
    where id = v_row.id
    returning * into v_row;
  end if;

  perform public._utfe_log(
    v_org_id, 'utfe_task_completed', 'organization_task', v_row.id,
    jsonb_build_object('memory_hook', v_memory, 'metadata_only', true)
  );

  return jsonb_build_object('task', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.create_task_from_source(
  p_source_type text,
  p_source_id uuid default null,
  p_title text default null,
  p_description text default null,
  p_priority text default 'medium',
  p_due_date date default null,
  p_assigned_user_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_tasks;
  v_title text;
  v_description text;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  v_title := coalesce(nullif(trim(p_title), ''), case p_source_type
    when 'meeting' then 'Follow up on meeting outcomes'
    when 'support' then 'Support follow-up task'
    when 'incident' then 'Incident review task'
    when 'workflow' then 'Workflow implementation task'
    when 'executive_initiative' then 'Executive initiative task'
    when 'improvement_program' then 'Improvement program task'
    when 'knowledge_center' then 'Knowledge Center review task'
    else 'Organizational task'
  end);

  v_description := coalesce(nullif(trim(p_description), ''), left(
    format('Task created from %s source — metadata only.', coalesce(p_source_type, 'manual')),
    500
  ));

  insert into public.organization_tasks (
    organization_id, title, description, assigned_user_id, created_by,
    priority, status, due_date, source_type, source_id, metadata
  )
  values (
    v_org_id,
    left(v_title, 200),
    v_description,
    p_assigned_user_id,
    v_user_id,
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    'open',
    coalesce(p_due_date, current_date + 7),
    coalesce(nullif(trim(p_source_type), ''), 'manual'),
    p_source_id,
    jsonb_build_object('created_from_source', true, 'metadata_only', true)
  )
  returning * into v_row;

  perform public._utfe_log(
    v_org_id, 'utfe_task_created_from_source', 'organization_task', v_row.id,
    jsonb_build_object('source_type', v_row.source_type, 'source_id', v_row.source_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.schedule_task_reminder(
  p_task_id uuid,
  p_remind_at timestamptz default null,
  p_channel text default 'in_app'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_task_settings;
  v_row public.organization_task_reminders;
  v_remind_at timestamptz;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  perform public._utfe_ensure_settings(v_org_id);

  select * into v_settings from public.organization_task_settings where organization_id = v_org_id;

  if not exists (
    select 1 from public.organization_tasks where id = p_task_id and organization_id = v_org_id
  ) then
    raise exception 'Task not found';
  end if;

  v_remind_at := coalesce(
    p_remind_at,
    now() + make_interval(hours => coalesce(v_settings.default_reminder_hours, 24))
  );

  insert into public.organization_task_reminders (
    organization_id, task_id, remind_at, channel, status, metadata
  )
  values (
    v_org_id, p_task_id, v_remind_at,
    coalesce(nullif(trim(p_channel), ''), 'in_app'),
    'scheduled',
    jsonb_build_object('metadata_only', true)
  )
  returning * into v_row;

  perform public._utfe_log(
    v_org_id, 'utfe_reminder_scheduled', 'organization_task_reminder', v_row.id,
    jsonb_build_object('task_id', p_task_id, 'remind_at', v_remind_at, 'channel', v_row.channel)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.escalate_organization_task(
  p_task_id uuid,
  p_reason text default null,
  p_escalation_level text default 'recommended'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_task_escalations;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  perform public._utfe_ensure_settings(v_org_id);

  if not exists (
    select 1 from public.organization_tasks where id = p_task_id and organization_id = v_org_id
  ) then
    raise exception 'Task not found';
  end if;

  insert into public.organization_task_escalations (
    organization_id, task_id, escalation_level, reason, metadata
  )
  values (
    v_org_id,
    p_task_id,
    coalesce(nullif(trim(p_escalation_level), ''), 'recommended'),
    left(coalesce(nullif(trim(p_reason), ''), 'Escalation recommended — overdue or critical priority'), 500),
    jsonb_build_object('metadata_only', true, 'requires_human_approval', true)
  )
  returning * into v_row;

  perform public._utfe_log(
    v_org_id, 'utfe_task_escalated', 'organization_task_escalation', v_row.id,
    jsonb_build_object('task_id', p_task_id, 'escalation_level', v_row.escalation_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.sync_task_calendar_hook(
  p_task_id uuid,
  p_provider text default 'aipify_internal',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_task public.organization_tasks;
  v_link public.organization_task_calendar_links;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  perform public._utfe_ensure_settings(v_org_id);

  select * into v_task from public.organization_tasks
  where id = p_task_id and organization_id = v_org_id;
  if v_task.id is null then raise exception 'Task not found'; end if;

  insert into public.organization_task_calendar_links (
    organization_id, task_id, provider, sync_status, metadata
  )
  values (
    v_org_id,
    p_task_id,
    coalesce(nullif(trim(p_provider), ''), 'aipify_internal'),
    'pending',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
      'scaffold', true,
      'due_date', v_task.due_date,
      'metadata_only', true,
      'note', 'Calendar sync scaffold — Context Engine orchestrates external calendars'
    )
  )
  returning * into v_link;

  perform public._utfe_log(
    v_org_id, 'utfe_calendar_sync_requested', 'organization_task_calendar_link', v_link.id,
    jsonb_build_object('task_id', p_task_id, 'provider', v_link.provider)
  );

  return jsonb_build_object(
    'calendar_link', row_to_json(v_link)::jsonb,
    'scaffold', true,
    'requires_connection', v_link.provider <> 'aipify_internal',
    'metadata_only', true
  );
end; $$;

create or replace function public.export_unified_task_follow_up_manifest(p_manifest_type text default 'tasks_summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_tasks jsonb;
  v_reminders jsonb;
  v_escalations jsonb;
begin
  perform public._irp_require_permission('tasks.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  perform public._utfe_mark_overdue_tasks(v_org_id, null);

  select coalesce(jsonb_agg(row_to_json(t) order by t.due_date nulls last), '[]'::jsonb) into v_tasks
  from public.organization_tasks t where t.organization_id = v_org_id limit 100;

  select coalesce(jsonb_agg(row_to_json(r) order by r.remind_at), '[]'::jsonb) into v_reminders
  from public.organization_task_reminders r where r.organization_id = v_org_id limit 50;

  select coalesce(jsonb_agg(row_to_json(e) order by e.created_at desc), '[]'::jsonb) into v_escalations
  from public.organization_task_escalations e where e.organization_id = v_org_id limit 30;

  perform public._utfe_log(
    v_org_id, 'utfe_manifest_exported', 'organization_task', null,
    jsonb_build_object('manifest_type', p_manifest_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', coalesce(p_manifest_type, 'tasks_summary'),
    'tasks', v_tasks,
    'reminders', v_reminders,
    'escalations', v_escalations,
    'summary', public._utfe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.get_executive_task_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('tasks.view');
  v_org_id := public._mta_require_organization();
  perform public._utfe_seed_tasks(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id, null);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational accountability — metadata tasks; humans assign, approve, and complete.',
    'summary', public._utfe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Operations events may spawn tasks — A.32',
      'workflow_orchestration', 'Approved workflows may create tasks — A.42',
      'meeting_collaboration', 'Meeting outcomes via create_task_from_source(meeting) — A.61',
      'organizational_memory', 'Optional completion hooks — metadata only — A.34'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_unified_task_follow_up_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('tasks.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._utfe_seed_tasks(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id, null);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Clear ownership, transparent accountability, proactive follow-up — metadata only.',
    'principles', jsonb_build_array(
      'Clear ownership',
      'Transparent accountability',
      'Proactive follow-up',
      'Organizational visibility',
      'Audit-supported accountability'
    ),
    'summary', public._utfe_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'my_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.assigned_user_id = v_user_id
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'team_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and (t.assigned_user_id is null or t.assigned_user_id <> v_user_id)
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'overdue_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id and t.status = 'overdue'
        limit 30
      ), '[]'::jsonb),
      'upcoming_deadlines', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.status in ('open', 'in_progress', 'awaiting_approval')
          and t.due_date is not null
          and t.due_date between current_date and current_date + 14
        limit 30
      ), '[]'::jsonb),
      'critical_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.due_date nulls last)
        from public.organization_tasks t
        where t.organization_id = v_org_id
          and t.priority = 'critical'
          and t.status in ('open', 'in_progress', 'awaiting_approval', 'overdue')
        limit 30
      ), '[]'::jsonb),
      'completed_tasks', coalesce((
        select jsonb_agg(row_to_json(t) order by t.updated_at desc)
        from public.organization_tasks t
        where t.organization_id = v_org_id and t.status = 'completed'
        limit 30
      ), '[]'::jsonb)
    ),
    'reminders', coalesce((
      select jsonb_agg(row_to_json(r) order by r.remind_at)
      from public.organization_task_reminders r
      where r.organization_id = v_org_id and r.status = 'scheduled'
      limit 20
    ), '[]'::jsonb),
    'escalations', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.organization_task_escalations e
      where e.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_task_settings s
      where s.organization_id = v_org_id
    ),
    'executive_summary', public._utfe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Extends Operations Center Foundation (A.32)',
      'workflow_orchestration', 'Approved workflows may create tasks — A.42',
      'meeting_collaboration', 'Meeting action items via create_task_from_source — A.61',
      'organizational_memory', 'Completion hooks capture follow-up patterns — A.34',
      'context_engine', 'sync_task_calendar_hook() scaffold — never replaces calendars'
    ),
    'integration_summaries', jsonb_build_object(
      'operations_center', public._utfe_operations_center_summary(v_org_id),
      'workflow_orchestration', public._utfe_workflow_integration_summary(v_org_id),
      'meeting_collaboration', public._utfe_meeting_integration_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_unified_task_follow_up_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._utfe_seed_tasks(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id, null);
  v_summary := public._utfe_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Unified Task & Follow-Up — organizational accountability.',
    'my_open_tasks', v_summary->'my_open_tasks',
    'overdue_tasks', v_summary->'overdue_tasks',
    'critical_tasks', v_summary->'critical_tasks',
    'completed_tasks_30d', v_summary->'completed_tasks_30d'
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
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'unified-task-follow-up-engine', 'Unified Task & Follow-Up Engine', 'Organizational task capture, assignment, follow-up, reminders, escalations, and calendar sync scaffold — metadata only.', 'authenticated', 93
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'unified-task-follow-up-engine' and tenant_id is null);

grant execute on function public.create_organization_task(text, text, text, date, uuid, text, uuid, jsonb) to authenticated;
grant execute on function public.assign_organization_task(uuid, uuid, date) to authenticated;
grant execute on function public.update_organization_task_status(uuid, text, jsonb) to authenticated;
grant execute on function public.complete_organization_task(uuid, boolean, jsonb) to authenticated;
grant execute on function public.create_task_from_source(text, uuid, text, text, text, date, uuid) to authenticated;
grant execute on function public.schedule_task_reminder(uuid, timestamptz, text) to authenticated;
grant execute on function public.escalate_organization_task(uuid, text, text) to authenticated;
grant execute on function public.sync_task_calendar_hook(uuid, text, jsonb) to authenticated;
grant execute on function public.export_unified_task_follow_up_manifest(text) to authenticated;
grant execute on function public.get_executive_task_summary() to authenticated;
grant execute on function public.get_unified_task_follow_up_engine_dashboard() to authenticated;
grant execute on function public.get_unified_task_follow_up_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._utfe_seed_tasks(v_org_id);
  end loop;
end $$;

-- Phase 506 — Tasks, Assignments & Work Management Engine
-- Universal task engine for all APP organizations and Business Packs
-- Extends organization_tasks (Phase A.62)

-- ---------------------------------------------------------------------------
-- 1. Extend organization_tasks
-- ---------------------------------------------------------------------------
alter table public.organization_tasks
  add column if not exists task_number text,
  add column if not exists department_id uuid references public.organization_departments (id) on delete set null,
  add column if not exists domain_id uuid references public.organization_domains (id) on delete set null,
  add column if not exists related_module_key text,
  add column if not exists business_pack_key text,
  add column if not exists assignment_scope text not null default 'single',
  add column if not exists requires_approval boolean not null default false,
  add column if not exists completed_at timestamptz,
  add column if not exists archived_at timestamptz;

do $$ begin
  alter table public.organization_tasks drop constraint if exists organization_tasks_priority_check;
exception when others then null;
end $$;

update public.organization_tasks set priority = 'normal' where priority = 'medium';

alter table public.organization_tasks
  add constraint organization_tasks_priority_check check (
    priority in ('low', 'normal', 'high', 'critical')
  );

do $$ begin
  alter table public.organization_tasks drop constraint if exists organization_tasks_status_check;
exception when others then null;
end $$;

update public.organization_tasks set status = case status
  when 'open' then 'waiting'
  when 'in_progress' then 'needs_attention'
  else status
end where status in ('open', 'in_progress');

alter table public.organization_tasks
  add constraint organization_tasks_status_check check (
    status in ('waiting', 'information', 'needs_attention', 'completed', 'cancelled', 'awaiting_approval', 'overdue')
  );

do $$ begin
  alter table public.organization_tasks drop constraint if exists organization_tasks_assignment_scope_check;
exception when others then null;
end $$;

alter table public.organization_tasks
  add constraint organization_tasks_assignment_scope_check check (
    assignment_scope in ('single', 'multiple', 'department', 'team', 'manager')
  );

create index if not exists organization_tasks_domain_idx
  on public.organization_tasks (organization_id, domain_id, status);

create index if not exists organization_tasks_pack_idx
  on public.organization_tasks (organization_id, business_pack_key, status);

create index if not exists organization_tasks_dept_idx
  on public.organization_tasks (organization_id, department_id, status);

-- ---------------------------------------------------------------------------
-- 2. Multi-assignee, comments, attachments, templates, recurring, approvals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_task_assignees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  assignment_role text not null default 'assignee' check (assignment_role in ('assignee', 'reviewer', 'watcher')),
  created_at timestamptz not null default now(),
  unique (organization_id, task_id, user_id)
);

create table if not exists public.organization_task_comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  author_user_id uuid references public.users (id) on delete set null,
  body text not null,
  is_internal boolean not null default false,
  mentions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_task_attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  file_name text not null,
  file_url text not null,
  uploaded_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_task_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  template_key text not null,
  name text not null,
  description text not null default '',
  default_priority text not null default 'normal',
  default_status text not null default 'waiting',
  checklist jsonb not null default '[]'::jsonb,
  business_pack_key text,
  requires_approval boolean not null default false,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

create table if not exists public.organization_task_recurring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_id uuid references public.organization_task_templates (id) on delete set null,
  title text not null,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  next_run_at timestamptz not null,
  last_run_at timestamptz,
  assigned_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_task_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  submitted_by uuid references public.users (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  review_note text,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.organization_task_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid not null references public.organization_tasks (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in (
      'assigned', 'updated', 'completed', 'overdue', 'approved', 'rejected', 'escalated', 'comment'
    )
  ),
  summary text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_task_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_id uuid references public.organization_tasks (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_task_assignees enable row level security;
alter table public.organization_task_comments enable row level security;
alter table public.organization_task_attachments enable row level security;
alter table public.organization_task_templates enable row level security;
alter table public.organization_task_recurring enable row level security;
alter table public.organization_task_approvals enable row level security;
alter table public.organization_task_notifications enable row level security;
alter table public.organization_task_engine_audit_logs enable row level security;

revoke all on public.organization_task_assignees from authenticated, anon;
revoke all on public.organization_task_comments from authenticated, anon;
revoke all on public.organization_task_attachments from authenticated, anon;
revoke all on public.organization_task_templates from authenticated, anon;
revoke all on public.organization_task_recurring from authenticated, anon;
revoke all on public.organization_task_approvals from authenticated, anon;
revoke all on public.organization_task_notifications from authenticated, anon;
revoke all on public.organization_task_engine_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._tme506_log(
  p_org_id uuid, p_task_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_task_engine_audit_logs (
    organization_id, task_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_task_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
  if exists (select 1 from pg_proc where proname = '_utfe_log') then
    perform public._utfe_log(p_org_id, p_action, 'organization_task', p_task_id, p_payload);
  end if;
end; $$;

create or replace function public._tme506_next_task_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_tasks where organization_id = p_org_id;
  return 'TSK-' || lpad(v_seq::text, 6, '0');
end; $$;

create or replace function public._tme506_notify(
  p_org_id uuid, p_task_id uuid, p_user_id uuid, p_type text, p_summary text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_user_id is null then return; end if;
  insert into public.organization_task_notifications (
    organization_id, task_id, user_id, notification_type, summary
  ) values (p_org_id, p_task_id, p_user_id, p_type, p_summary);
end; $$;

create or replace function public._tme506_task_json(p_task public.organization_tasks)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_task.id,
    'task_number', p_task.task_number,
    'title', p_task.title,
    'description', p_task.description,
    'priority', p_task.priority,
    'status', p_task.status,
    'assigned_user_id', p_task.assigned_user_id,
    'created_by', p_task.created_by,
    'department_id', p_task.department_id,
    'domain_id', p_task.domain_id,
    'related_module_key', p_task.related_module_key,
    'business_pack_key', p_task.business_pack_key,
    'due_date', p_task.due_date,
    'requires_approval', p_task.requires_approval,
    'created_at', p_task.created_at,
    'updated_at', p_task.updated_at,
    'completed_at', p_task.completed_at
  );
end; $$;

create or replace function public._tme506_seed_templates(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_task_templates (
    organization_id, template_key, name, description, default_priority, checklist, business_pack_key, requires_approval, is_system
  ) values
    (p_org_id, 'employee_onboarding', 'New Employee Onboarding', 'Standard onboarding checklist for new team members.', 'normal', '["Welcome briefing","System access","Role training"]'::jsonb, null, false, true),
    (p_org_id, 'customer_complaint', 'Customer Complaint', 'Handle and resolve a customer complaint.', 'high', '["Review case","Draft response","Manager review"]'::jsonb, 'support_pack', true, true),
    (p_org_id, 'property_preparation', 'Property Preparation', 'Prepare property for guest arrival.', 'high', '["Cleaning","Inventory check","Welcome pack"]'::jsonb, 'hosts_pack', false, true),
    (p_org_id, 'inventory_count', 'Inventory Count', 'Section inventory count workflow.', 'normal', '["Count section","Verify discrepancies","Submit report"]'::jsonb, 'warehouse_pack', false, true),
    (p_org_id, 'invoice_approval', 'Invoice Approval', 'Review and approve invoice.', 'high', '["Verify invoice","Check budget","Approve payment"]'::jsonb, null, true, true)
  on conflict (organization_id, template_key) do nothing;
end; $$;

-- Business Pack task creation (single entry point for all packs)
create or replace function public.create_business_pack_task(
  p_pack_key text,
  p_title text,
  p_description text default null,
  p_priority text default 'normal',
  p_due_date date default null,
  p_assigned_user_id uuid default null,
  p_domain_id uuid default null,
  p_department_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organization_tasks;
begin
  perform public._irp_require_permission('tasks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.organization_tasks (
    organization_id, task_number, title, description, assigned_user_id, created_by,
    priority, status, due_date, source_type, business_pack_key, domain_id, department_id,
    related_module_key, metadata
  ) values (
    v_org_id, public._tme506_next_task_number(v_org_id), left(trim(p_title), 200),
    left(coalesce(p_description, ''), 1000), p_assigned_user_id, v_user_id,
    coalesce(nullif(p_priority, ''), 'normal'), 'waiting', p_due_date,
    'workflow', p_pack_key, p_domain_id, p_department_id,
    p_pack_key, coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('pack_task', true)
  ) returning * into v_row;

  if p_assigned_user_id is not null then
    insert into public.organization_task_assignees (organization_id, task_id, user_id)
    values (v_org_id, v_row.id, p_assigned_user_id) on conflict do nothing;
    perform public._tme506_notify(v_org_id, v_row.id, p_assigned_user_id, 'assigned', 'Task assigned: ' || v_row.title);
  end if;

  perform public._tme506_log(v_org_id, v_row.id, 'task_created', 'Business Pack task created', jsonb_build_object('pack_key', p_pack_key));
  return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));
end; $$;

-- Task Management Center
create or replace function public.get_task_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('tasks.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._tme506_seed_templates(v_org_id);
  perform public._utfe_mark_overdue_tasks(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify helps people organize, prioritize, assign, and complete work — Aipify does not do the work.',
    'structure', 'PLATFORM → APP → TASK ENGINE → EMPLOYEES',
    'statuses', jsonb_build_array('waiting', 'information', 'needs_attention', 'completed', 'cancelled', 'awaiting_approval', 'overdue'),
    'priorities', jsonb_build_array('low', 'normal', 'high', 'critical'),
    'overview', jsonb_build_object(
      'open', (select count(*) from public.organization_tasks where organization_id = v_org_id and status not in ('completed', 'cancelled')),
      'my_open', (select count(*) from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status not in ('completed', 'cancelled')),
      'overdue', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue'),
      'awaiting_approval', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'awaiting_approval'),
      'completed_30d', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'completed' and updated_at >= now() - interval '30 days'),
      'completion_rate', case when (select count(*) from public.organization_tasks where organization_id = v_org_id) = 0 then 0
        else round(100.0 * (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'completed') /
          greatest(1, (select count(*) from public.organization_tasks where organization_id = v_org_id)), 1) end
    ),
    'my_tasks', coalesce((
      select jsonb_agg(public._tme506_task_json(t) order by t.due_date nulls last, t.created_at desc)
      from (select * from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status not in ('completed', 'cancelled') limit 50) t
    ), '[]'::jsonb),
    'assigned_by_me', coalesce((
      select jsonb_agg(public._tme506_task_json(t) order by t.created_at desc)
      from (select * from public.organization_tasks where organization_id = v_org_id and created_by = v_user_id limit 50) t
    ), '[]'::jsonb),
    'department_tasks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_id', d.id, 'department_name', d.name,
        'open', (select count(*) from public.organization_tasks t where t.organization_id = v_org_id and t.department_id = d.id and t.status not in ('completed', 'cancelled')),
        'overdue', (select count(*) from public.organization_tasks t where t.organization_id = v_org_id and t.department_id = d.id and t.status = 'overdue'),
        'completed', (select count(*) from public.organization_tasks t where t.organization_id = v_org_id and t.department_id = d.id and t.status = 'completed')
      ) order by d.name)
      from public.organization_departments d where d.organization_id = v_org_id and d.is_active = true
    ), '[]'::jsonb),
    'completed', coalesce((
      select jsonb_agg(public._tme506_task_json(t) order by t.completed_at desc nulls last)
      from (select * from public.organization_tasks where organization_id = v_org_id and status = 'completed' order by updated_at desc limit 30) t
    ), '[]'::jsonb),
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'approval_id', a.id, 'task_id', a.task_id, 'task_title', t.title,
        'approval_status', a.approval_status, 'submitted_by', a.submitted_by, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_task_approvals a
      join public.organization_tasks t on t.id = a.task_id
      where a.organization_id = v_org_id and a.approval_status = 'pending'
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', tpl.id, 'template_key', tpl.template_key, 'name', tpl.name,
        'description', tpl.description, 'business_pack_key', tpl.business_pack_key,
        'requires_approval', tpl.requires_approval
      ) order by tpl.name)
      from public.organization_task_templates tpl
      where tpl.organization_id = v_org_id or tpl.is_system = true
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'open_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status not in ('completed', 'cancelled')),
      'completed_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'completed'),
      'overdue_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue'),
      'by_priority', jsonb_build_object(
        'critical', (select count(*) from public.organization_tasks where organization_id = v_org_id and priority = 'critical' and status not in ('completed', 'cancelled')),
        'high', (select count(*) from public.organization_tasks where organization_id = v_org_id and priority = 'high' and status not in ('completed', 'cancelled'))
      ),
      'by_pack', coalesce((
        select jsonb_agg(jsonb_build_object('pack_key', business_pack_key, 'count', cnt))
        from (select business_pack_key, count(*) cnt from public.organization_tasks where organization_id = v_org_id and business_pack_key is not null group by business_pack_key) s
      ), '[]'::jsonb)
    ),
    'domains_route', '/app/domains'
  );
end; $$;

-- Actions
create or replace function public.perform_task_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_task_id uuid;
  v_row public.organization_tasks;
  v_assignee uuid;
  v_approval_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_task_id := nullif(p_payload->>'task_id', '')::uuid;

  if p_action_type = 'create_task' then
    perform public._irp_require_permission('tasks.manage');
    insert into public.organization_tasks (
      organization_id, task_number, title, description, assigned_user_id, created_by,
      priority, status, due_date, department_id, domain_id, related_module_key,
      business_pack_key, requires_approval, assignment_scope, metadata
    ) values (
      v_org_id, public._tme506_next_task_number(v_org_id),
      left(trim(p_payload->>'title'), 200),
      left(coalesce(p_payload->>'description', ''), 1000),
      nullif(p_payload->>'assigned_user_id', '')::uuid,
      v_user_id,
      coalesce(nullif(p_payload->>'priority', ''), 'normal'),
      coalesce(nullif(p_payload->>'status', ''), 'waiting'),
      nullif(p_payload->>'due_date', '')::date,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'related_module_key',
      p_payload->>'business_pack_key',
      coalesce((p_payload->>'requires_approval')::boolean, false),
      coalesce(p_payload->>'assignment_scope', 'single'),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning * into v_row;

    if v_row.assigned_user_id is not null then
      insert into public.organization_task_assignees (organization_id, task_id, user_id)
      values (v_org_id, v_row.id, v_row.assigned_user_id) on conflict do nothing;
      perform public._tme506_notify(v_org_id, v_row.id, v_row.assigned_user_id, 'assigned', 'Task assigned: ' || v_row.title);
    end if;
    perform public._tme506_log(v_org_id, v_row.id, 'task_created', 'Task created', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'assign_task' then
    perform public._irp_require_permission('tasks.assign');
    update public.organization_tasks set
      assigned_user_id = nullif(p_payload->>'assigned_user_id', '')::uuid,
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      assignment_scope = coalesce(p_payload->>'assignment_scope', assignment_scope),
      updated_at = now()
    where id = v_task_id and organization_id = v_org_id returning * into v_row;
    if v_row.id is null then raise exception 'Task not found'; end if;
    v_assignee := v_row.assigned_user_id;
    if v_assignee is not null then
      insert into public.organization_task_assignees (organization_id, task_id, user_id)
      values (v_org_id, v_row.id, v_assignee) on conflict do nothing;
      perform public._tme506_notify(v_org_id, v_row.id, v_assignee, 'assigned', 'Task assigned: ' || v_row.title);
    end if;
    perform public._tme506_log(v_org_id, v_row.id, 'task_assigned', 'Task assigned', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'complete_task' then
    perform public._irp_require_permission('tasks.complete');
    update public.organization_tasks set
      status = case when requires_approval then 'awaiting_approval' else 'completed' end,
      completed_at = case when requires_approval then null else now() end,
      updated_at = now()
    where id = v_task_id and organization_id = v_org_id and status not in ('completed', 'cancelled')
    returning * into v_row;
    if v_row.id is null then raise exception 'Task not found'; end if;
    if v_row.status = 'awaiting_approval' then
      insert into public.organization_task_approvals (organization_id, task_id, submitted_by, approval_status)
      values (v_org_id, v_row.id, v_user_id, 'pending');
    end if;
    perform public._tme506_log(v_org_id, v_row.id, 'task_completed', 'Task marked complete', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'approve_task' then
    perform public._irp_require_permission('tasks.manage');
    update public.organization_tasks set status = 'completed', completed_at = now(), updated_at = now()
    where id = v_task_id and organization_id = v_org_id returning * into v_row;
    update public.organization_task_approvals set
      approval_status = 'approved', reviewed_by = v_user_id, reviewed_at = now(),
      history = history || jsonb_build_array(jsonb_build_object('action', 'approved', 'at', now(), 'by', v_user_id))
    where task_id = v_task_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._tme506_notify(v_org_id, v_row.id, v_row.created_by, 'approved', 'Task approved: ' || v_row.title);
    perform public._tme506_log(v_org_id, v_row.id, 'task_approved', 'Task approved', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'reject_task' then
    perform public._irp_require_permission('tasks.manage');
    update public.organization_tasks set status = 'needs_attention', updated_at = now()
    where id = v_task_id and organization_id = v_org_id returning * into v_row;
    update public.organization_task_approvals set
      approval_status = 'rejected', reviewed_by = v_user_id, reviewed_at = now(),
      review_note = p_payload->>'review_note',
      history = history || jsonb_build_array(jsonb_build_object('action', 'rejected', 'at', now(), 'by', v_user_id))
    where task_id = v_task_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._tme506_notify(v_org_id, v_row.id, v_row.assigned_user_id, 'rejected', 'Task rejected: ' || v_row.title);
    perform public._tme506_log(v_org_id, v_row.id, 'task_rejected', 'Task rejected', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'add_comment' then
    perform public._irp_require_permission('tasks.view');
    insert into public.organization_task_comments (organization_id, task_id, author_user_id, body, is_internal)
    values (v_org_id, v_task_id, v_user_id, left(p_payload->>'body', 2000), coalesce((p_payload->>'is_internal')::boolean, false));
    perform public._tme506_log(v_org_id, v_task_id, 'comment_added', 'Comment added', '{}'::jsonb);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_from_template' then
    perform public._irp_require_permission('tasks.manage');
    return public.perform_task_management_action('create_task', (
      select jsonb_build_object(
        'title', tpl.name, 'description', tpl.description, 'priority', tpl.default_priority,
        'status', tpl.default_status, 'requires_approval', tpl.requires_approval,
        'business_pack_key', tpl.business_pack_key,
        'assigned_user_id', p_payload->>'assigned_user_id',
        'domain_id', p_payload->>'domain_id', 'department_id', p_payload->>'department_id'
      )
      from public.organization_task_templates tpl
      where tpl.template_key = p_payload->>'template_key'
        and (tpl.organization_id = v_org_id or tpl.is_system = true)
      limit 1
    ) || p_payload);

  elsif p_action_type = 'create_recurring' then
    perform public._irp_require_permission('tasks.manage');
    insert into public.organization_task_recurring (
      organization_id, title, frequency, next_run_at, assigned_user_id, department_id, domain_id, business_pack_key
    ) values (
      v_org_id, p_payload->>'title', coalesce(p_payload->>'frequency', 'weekly'),
      coalesce((p_payload->>'next_run_at')::timestamptz, now() + interval '1 day'),
      nullif(p_payload->>'assigned_user_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key'
    );
    perform public._tme506_log(v_org_id, null, 'recurring_created', 'Recurring task schedule created', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'escalate_task' then
    perform public._irp_require_permission('tasks.manage');
    update public.organization_tasks set priority = 'critical', status = 'needs_attention', updated_at = now()
    where id = v_task_id and organization_id = v_org_id returning * into v_row;
    if exists (select 1 from pg_proc where proname = '_utfe_log') then
      insert into public.organization_task_escalations (organization_id, task_id, escalation_level, reason)
      values (v_org_id, v_task_id, 'requested', coalesce(p_payload->>'reason', 'Escalated via Task Engine'));
    end if;
    perform public._tme506_log(v_org_id, v_task_id, 'task_escalated', 'Task escalated', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));

  elsif p_action_type = 'cancel_task' then
    perform public._irp_require_permission('tasks.manage');
    update public.organization_tasks set status = 'cancelled', updated_at = now()
    where id = v_task_id and organization_id = v_org_id returning * into v_row;
    perform public._tme506_log(v_org_id, v_task_id, 'task_deleted', 'Task cancelled', p_payload);
    return jsonb_build_object('ok', true, 'task', public._tme506_task_json(v_row));
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Companion context
create or replace function public.get_companion_task_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._utfe_mark_overdue_tasks(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion creates and manages tasks through the Task Engine — Aipify coordinates work.',
    'my_overdue', coalesce((
      select jsonb_agg(public._tme506_task_json(t))
      from (select * from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status = 'overdue' limit 10) t
    ), '[]'::jsonb),
    'my_high_priority', coalesce((
      select jsonb_agg(public._tme506_task_json(t))
      from (select * from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and priority in ('high', 'critical') and status not in ('completed', 'cancelled') limit 10) t
    ), '[]'::jsonb),
    'incomplete_assignments', coalesce((
      select jsonb_agg(jsonb_build_object('user_id', u.id, 'full_name', ep.full_name, 'open_count', cnt))
      from (
        select assigned_user_id, count(*) cnt from public.organization_tasks
        where organization_id = v_org_id and status not in ('completed', 'cancelled') and assigned_user_id is not null
        group by assigned_user_id having count(*) > 0
      ) s
      join public.users u on u.id = s.assigned_user_id
      left join public.organization_employee_profiles ep on ep.organization_id = v_org_id and ep.organization_user_id = u.id
    ), '[]'::jsonb),
    'tasks_route', '/app/tasks',
    'supported_intents', jsonb_build_array(
      'create_task', 'assign_task', 'show_overdue', 'show_high_priority', 'incomplete_assignments'
    )
  );
exception when others then
  return jsonb_build_object('found', false);
end; $$;

-- Update module registry route
update public.aipify_module_registry
set route_href = '/app/tasks', updated_at = now()
where module_key = 'tasks';

-- Sync navigation registry if Phase 505 applied
do $$ begin
  if exists (select 1 from pg_proc where proname = '_dmn505_upsert_nav') then
    perform public._dmn505_upsert_nav(
      'tasks', 'Tasks', 'operations', 'check-square', '/app/tasks',
      'tasks', 'tasks.view', null, 'app', 3, false, false
    );
  end if;
end $$;

-- Grants
grant execute on function public.get_task_management_center() to authenticated;
grant execute on function public.perform_task_management_action(text, jsonb) to authenticated;
grant execute on function public.create_business_pack_task(text, text, text, text, date, uuid, uuid, uuid, jsonb) to authenticated;
grant execute on function public.get_companion_task_context() to authenticated;

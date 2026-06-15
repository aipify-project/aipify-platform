-- Phase Airbnb 18 — Aipify Hosts Tasks Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahosttask_* (engine), _ahostbp380_* (blueprint)

create table if not exists public.aipify_hosts_tasks_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'active_tasks' check (
    default_section in ('active_tasks', 'scheduled_tasks', 'completed_tasks', 'playbooks', 'templates')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_tasks_center_settings enable row level security;
revoke all on public.aipify_hosts_tasks_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  task_key text not null,
  title text not null,
  description text,
  category text not null check (
    category in ('cleaning', 'maintenance', 'inspection', 'guest_preparation', 'compliance', 'team_administration')
  ),
  task_status text not null default 'not_started' check (
    task_status in ('not_started', 'in_progress', 'waiting', 'completed', 'cancelled')
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  assignee_role text check (
    assignee_role in ('owner', 'property_manager', 'cleaner', 'maintenance', 'support')
  ),
  assignee_name text,
  due_date date,
  scheduled_for date,
  recurrence text check (
    recurrence in ('daily', 'weekly', 'monthly', 'quarterly', 'annually')
  ),
  playbook_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, task_key)
);
create index if not exists aipify_hosts_tasks_tenant_status_idx
  on public.aipify_hosts_tasks (tenant_id, task_status);
create index if not exists aipify_hosts_tasks_tenant_due_idx
  on public.aipify_hosts_tasks (tenant_id, due_date);
alter table public.aipify_hosts_tasks enable row level security;
revoke all on public.aipify_hosts_tasks from authenticated, anon;

create table if not exists public.aipify_hosts_task_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  template_key text not null,
  title text not null,
  description text,
  category text not null,
  default_priority text not null default 'medium',
  default_assignee_role text,
  recurrence text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, template_key)
);
alter table public.aipify_hosts_task_templates enable row level security;
revoke all on public.aipify_hosts_task_templates from authenticated, anon;

create table if not exists public.aipify_hosts_playbook_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  playbook_key text not null,
  run_status text not null default 'in_progress' check (run_status in ('in_progress', 'completed', 'cancelled')),
  steps_completed jsonb not null default '[]'::jsonb,
  initiated_by uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_playbook_runs_tenant_idx
  on public.aipify_hosts_playbook_runs (tenant_id, created_at desc);
alter table public.aipify_hosts_playbook_runs enable row level security;
revoke all on public.aipify_hosts_playbook_runs from authenticated, anon;

create table if not exists public.aipify_hosts_tasks_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_tasks_center_events_tenant_idx
  on public.aipify_hosts_tasks_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_tasks_center_events enable row level security;
revoke all on public.aipify_hosts_tasks_center_events from authenticated, anon;

create or replace function public._ahosttask_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_tasks_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_tasks_center_settings;
begin
  insert into public.aipify_hosts_tasks_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_tasks_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahosttask_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_tasks_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'tasks_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp380_positioning() returns text language sql immutable as $$
  select 'Standardize hospitality operations — structured tasks and repeatable playbooks for every recurring process.'; $$;

create or replace function public._ahostbp380_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active_tasks', 'label', 'Active Tasks'),
    jsonb_build_object('key', 'scheduled_tasks', 'label', 'Scheduled Tasks'),
    jsonb_build_object('key', 'completed_tasks', 'label', 'Completed Tasks'),
    jsonb_build_object('key', 'playbooks', 'label', 'Playbooks'),
    jsonb_build_object('key', 'templates', 'label', 'Templates')
  ); $$;

create or replace function public._ahostbp380_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'cleaning', 'maintenance', 'inspection', 'guest_preparation', 'compliance', 'team_administration'
  ); $$;

create or replace function public._ahostbp380_playbooks() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'arrival', 'label', 'Arrival Playbook', 'steps', jsonb_build_array(
      'Verify cleaning completed', 'Verify amenities stocked', 'Verify access instructions', 'Verify property readiness'
    )),
    jsonb_build_object('key', 'departure', 'label', 'Departure Playbook', 'steps', jsonb_build_array(
      'Schedule cleaning', 'Verify checkout completed', 'Inspect property', 'Update status'
    )),
    jsonb_build_object('key', 'cleaning', 'label', 'Cleaning Playbook', 'steps', jsonb_build_array(
      'Complete cleaning checklist', 'Replace consumables', 'Report issues', 'Upload completion evidence'
    )),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance Playbook', 'steps', jsonb_build_array(
      'Review issue', 'Assign technician', 'Verify completion', 'Close task'
    )),
    jsonb_build_object('key', 'inspection', 'label', 'Inspection Playbook', 'steps', jsonb_build_array(
      'Walkthrough property', 'Verify standards', 'Document findings', 'Schedule follow-up if needed'
    )),
    jsonb_build_object('key', 'incident', 'label', 'Incident Playbook', 'steps', jsonb_build_array(
      'Record incident', 'Assign owner', 'Document actions', 'Close incident'
    ))
  ); $$;

create or replace function public._ahosttask_row(p_task public.aipify_hosts_tasks, p_property_name text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_task.id,
    'task_key', p_task.task_key,
    'title', p_task.title,
    'description', p_task.description,
    'property', coalesce(p_property_name, '—'),
    'property_id', p_task.property_id,
    'category', p_task.category,
    'status', p_task.task_status,
    'priority', p_task.priority,
    'assignee_role', p_task.assignee_role,
    'assignee_name', p_task.assignee_name,
    'due_date', p_task.due_date,
    'scheduled_for', p_task.scheduled_for,
    'recurrence', p_task.recurrence,
    'playbook_key', p_task.playbook_key,
    'is_overdue', p_task.due_date is not null and p_task.due_date < current_date
      and p_task.task_status not in ('completed', 'cancelled')
  ); $$;

create or replace function public._ahosttask_seed_templates(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_task_templates (tenant_id, template_key, title, description, category, default_priority, default_assignee_role, recurrence)
  select p_tenant_id, v.template_key, v.title, v.description, v.category, v.default_priority, v.default_assignee_role, v.recurrence
  from (values
    ('turnover_cleaning', 'Turnover cleaning', 'Standard turnover between guest stays', 'cleaning', 'high', 'cleaner', 'daily'),
    ('pre_arrival_inspection', 'Pre-arrival inspection', 'Verify property readiness before guest arrival', 'inspection', 'high', 'property_manager', null),
    ('hvac_filter_check', 'HVAC filter check', 'Quarterly HVAC maintenance check', 'maintenance', 'medium', 'maintenance', 'quarterly'),
    ('welcome_kit_restock', 'Welcome kit restock', 'Restock guest welcome amenities', 'guest_preparation', 'medium', 'cleaner', 'weekly'),
    ('compliance_safety_check', 'Safety compliance check', 'Verify safety equipment and compliance items', 'compliance', 'high', 'property_manager', 'monthly'),
    ('team_shift_handover', 'Team shift handover', 'Operational handover between team shifts', 'team_administration', 'medium', 'property_manager', 'daily')
  ) as v(template_key, title, description, category, default_priority, default_assignee_role, recurrence)
  on conflict (tenant_id, template_key) do nothing;
end; $$;

create or replace function public._ahosttask_seed_tasks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop record; v_i int := 0;
begin
  if exists (select 1 from public.aipify_hosts_tasks where tenant_id = p_tenant_id limit 1) then return; end if;
  perform public._ahosttask_seed_templates(p_tenant_id);
  for v_prop in
    select id, display_name from public.aipify_hosts_properties
    where tenant_id = p_tenant_id and status = 'active' order by display_name limit 4
  loop
    v_i := v_i + 1;
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, task_status, priority,
      assignee_role, assignee_name, due_date, scheduled_for, recurrence
    ) values
    (p_tenant_id, v_prop.id, 'task_active_' || v_i, 'Pre-arrival inspection — ' || v_prop.display_name,
     'Verify property readiness before next guest arrival', 'inspection', 'in_progress', 'high',
     'property_manager', 'Operations Lead', current_date + 1, null, null),
    (p_tenant_id, v_prop.id, 'task_sched_' || v_i, 'Turnover cleaning — ' || v_prop.display_name,
     'Standard turnover cleaning between stays', 'cleaning', 'not_started', 'medium',
     'cleaner', 'Nordic Clean Co.', current_date + 3, current_date + 3, 'daily'),
    (p_tenant_id, v_prop.id, 'task_done_' || v_i, 'Welcome kit restock — ' || v_prop.display_name,
     'Restock guest welcome amenities', 'guest_preparation', 'completed', 'low',
     'cleaner', 'Nordic Clean Co.', current_date - 1, null, 'weekly');
  end loop;
  if v_i = 0 then
    insert into public.aipify_hosts_tasks (tenant_id, task_key, title, description, category, task_status, priority, assignee_role, assignee_name, due_date)
    values (p_tenant_id, 'task_default_1', 'Review operational playbooks', 'Familiarize team with arrival and departure playbooks', 'team_administration', 'not_started', 'medium', 'owner', 'Host Owner', current_date + 7);
  end if;
end; $$;

create or replace function public._ahosttask_notifications(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_overdue int; v_critical int; v_assigned int; v_playbook int;
begin
  select count(*)::int into v_overdue from public.aipify_hosts_tasks
  where tenant_id = p_tenant_id and due_date < current_date
    and task_status not in ('completed', 'cancelled');
  select count(*)::int into v_critical from public.aipify_hosts_tasks
  where tenant_id = p_tenant_id and priority = 'critical'
    and task_status not in ('completed', 'cancelled')
    and created_at > now() - interval '7 days';
  select count(*)::int into v_assigned from public.aipify_hosts_tasks_center_events
  where tenant_id = p_tenant_id and event_type = 'task_assigned'
    and created_at > now() - interval '3 days';
  select count(*)::int into v_playbook from public.aipify_hosts_playbook_runs
  where tenant_id = p_tenant_id and run_status = 'in_progress';
  if v_overdue = 0 and v_critical = 0 and v_assigned = 0 and v_playbook = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(x) from (
      select jsonb_build_object('key', 'task_overdue', 'active', v_overdue > 0, 'count', v_overdue,
        'message', v_overdue || ' overdue task(s) require attention') as x where v_overdue > 0
      union all
      select jsonb_build_object('key', 'critical_task', 'active', v_critical > 0, 'count', v_critical,
        'message', v_critical || ' critical task(s) created recently') where v_critical > 0
      union all
      select jsonb_build_object('key', 'task_assigned', 'active', v_assigned > 0, 'count', v_assigned,
        'message', v_assigned || ' task assignment(s) in the last 3 days') where v_assigned > 0
      union all
      select jsonb_build_object('key', 'playbook_initiated', 'active', v_playbook > 0, 'count', v_playbook,
        'message', v_playbook || ' playbook(s) in progress') where v_playbook > 0
    ) n
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_tasks_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_tc public.aipify_hosts_tasks_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_tc := public._ahosttask_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_tc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp380_positioning(),
    'route', '/app/aipify-hosts/tasks'
  );
end; $$;

create or replace function public.get_aipify_hosts_tasks_center_dashboard(
  p_section text default 'active_tasks',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_tc public.aipify_hosts_tasks_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_active jsonb; v_scheduled jsonb; v_completed jsonb; v_templates jsonb; v_runs jsonb; v_properties jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_tc := public._ahosttask_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_tc.default_section, 'active_tasks');
  perform public._ahosttask_seed_tasks(v_tenant_id);
  perform public._ahosttask_log_event(v_tenant_id, 'dashboard_view', 'Tasks Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(
    public._ahosttask_row(t, coalesce(p.display_name, '—')) order by t.due_date nulls last, t.priority desc
  ), '[]'::jsonb) into v_active
  from public.aipify_hosts_tasks t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where t.tenant_id = v_tenant_id and t.task_status in ('not_started', 'in_progress', 'waiting');

  select coalesce(jsonb_agg(
    public._ahosttask_row(t, coalesce(p.display_name, '—')) order by t.scheduled_for nulls last
  ), '[]'::jsonb) into v_scheduled
  from public.aipify_hosts_tasks t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where t.tenant_id = v_tenant_id
    and (t.scheduled_for is not null or t.recurrence is not null)
    and t.task_status not in ('completed', 'cancelled');

  select coalesce(jsonb_agg(
    public._ahosttask_row(t, coalesce(p.display_name, '—')) order by t.updated_at desc
  ), '[]'::jsonb) into v_completed
  from public.aipify_hosts_tasks t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where t.tenant_id = v_tenant_id and t.task_status in ('completed', 'cancelled');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', tm.id, 'template_key', tm.template_key, 'title', tm.title, 'description', tm.description,
    'category', tm.category, 'default_priority', tm.default_priority,
    'default_assignee_role', tm.default_assignee_role, 'recurrence', tm.recurrence
  ) order by tm.title), '[]'::jsonb) into v_templates
  from public.aipify_hosts_task_templates tm where tm.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'playbook_key', r.playbook_key, 'property', coalesce(p.display_name, '—'),
    'property_id', r.property_id, 'run_status', r.run_status,
    'steps_completed', r.steps_completed,
    'started_at', to_char(r.created_at, 'YYYY-MM-DD HH24:MI')
  ) order by r.created_at desc), '[]'::jsonb) into v_runs
  from public.aipify_hosts_playbook_runs r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
  into v_properties
  from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status <> 'archived';

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_tc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp380_positioning(),
    'governance', jsonb_build_object(
      'audit_task_changes', true,
      'audit_playbook_execution', true,
      'role_permissions', true,
      'escalate_overdue_critical', true
    ),
    'sections', public._ahostbp380_sections(),
    'categories', public._ahostbp380_categories(),
    'task_statuses', jsonb_build_array('not_started', 'in_progress', 'waiting', 'completed', 'cancelled'),
    'priorities', jsonb_build_array('low', 'medium', 'high', 'critical'),
    'assignee_roles', jsonb_build_array('owner', 'property_manager', 'cleaner', 'maintenance', 'support'),
    'recurrence_options', jsonb_build_array('daily', 'weekly', 'monthly', 'quarterly', 'annually'),
    'playbooks', public._ahostbp380_playbooks(),
    'notifications', public._ahosttask_notifications(v_tenant_id),
    'active_tasks', v_active,
    'scheduled_tasks', v_scheduled,
    'completed_tasks', v_completed,
    'templates', v_templates,
    'playbook_runs', v_runs,
    'properties', v_properties,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 18 — Tasks Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_18_TASKS_CENTER.text',
      'route', '/app/aipify-hosts/tasks'
    )
  );
end; $$;

create or replace function public.create_aipify_hosts_task(
  p_title text,
  p_description text default null,
  p_property_id uuid default null,
  p_category text default 'cleaning',
  p_priority text default 'medium',
  p_assignee_role text default null,
  p_assignee_name text default null,
  p_due_date date default null,
  p_scheduled_for date default null,
  p_recurrence text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'Title required'; end if;
  v_key := 'task_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_tasks (
    tenant_id, property_id, task_key, title, description, category, priority,
    assignee_role, assignee_name, due_date, scheduled_for, recurrence
  ) values (
    v_tenant_id, p_property_id, v_key, trim(p_title), nullif(trim(p_description), ''),
    coalesce(p_category, 'cleaning'), coalesce(p_priority, 'medium'),
    p_assignee_role, nullif(trim(p_assignee_name), ''), p_due_date, p_scheduled_for, p_recurrence
  ) returning id into v_id;
  perform public._ahosttask_log_event(v_tenant_id, 'task_created', 'Task created',
    jsonb_build_object('task_id', v_id, 'title', trim(p_title)));
  if p_priority = 'critical' then
    perform public._ahosttask_log_event(v_tenant_id, 'critical_task_created', 'Critical task created',
      jsonb_build_object('task_id', v_id));
  end if;
  return jsonb_build_object('success', true, 'task_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_task_status(
  p_task_id uuid,
  p_status text,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_task public.aipify_hosts_tasks;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_status not in ('not_started', 'in_progress', 'waiting', 'completed', 'cancelled') then
    raise exception 'Invalid status';
  end if;
  select * into v_task from public.aipify_hosts_tasks where id = p_task_id and tenant_id = v_tenant_id;
  update public.aipify_hosts_tasks set task_status = p_status, updated_at = now()
  where id = p_task_id and tenant_id = v_tenant_id;
  perform public._ahosttask_log_event(v_tenant_id, 'task_status_changed', 'Task status updated',
    jsonb_build_object('task_id', p_task_id, 'status', p_status));
  if v_task.priority = 'critical' and v_task.due_date < current_date and p_status not in ('completed', 'cancelled') then
    perform public._ahosttask_log_event(v_tenant_id, 'critical_overdue_escalated', 'Overdue critical task escalated',
      jsonb_build_object('task_id', p_task_id));
  end if;
  return jsonb_build_object('success', true, 'task_id', p_task_id, 'status', p_status);
end; $$;

create or replace function public.assign_aipify_hosts_task(
  p_task_id uuid,
  p_assignee_role text,
  p_assignee_name text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_tasks
  set assignee_role = p_assignee_role, assignee_name = nullif(trim(p_assignee_name), ''), updated_at = now()
  where id = p_task_id and tenant_id = v_tenant_id;
  perform public._ahosttask_log_event(v_tenant_id, 'task_assigned', 'Task assigned',
    jsonb_build_object('task_id', p_task_id, 'assignee_role', p_assignee_role));
  return jsonb_build_object('success', true, 'task_id', p_task_id);
end; $$;

create or replace function public.initiate_aipify_hosts_playbook(
  p_playbook_key text,
  p_property_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_task_id uuid; v_key text; v_label text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_playbook_key not in ('arrival', 'departure', 'cleaning', 'maintenance', 'inspection', 'incident') then
    raise exception 'Invalid playbook';
  end if;
  insert into public.aipify_hosts_playbook_runs (tenant_id, property_id, playbook_key, initiated_by)
  values (v_tenant_id, p_property_id, p_playbook_key, auth.uid()) returning id into v_id;
  v_label := initcap(replace(p_playbook_key, '_', ' ')) || ' Playbook';
  v_key := 'pb_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.aipify_hosts_tasks (
    tenant_id, property_id, task_key, title, description, category, task_status, priority,
    assignee_role, playbook_key
  ) values (
    v_tenant_id, p_property_id, v_key, v_label || ' — in progress',
    'Playbook initiated — follow structured steps', 'guest_preparation', 'in_progress', 'high',
    'property_manager', p_playbook_key
  ) returning id into v_task_id;
  perform public._ahosttask_log_event(v_tenant_id, 'playbook_initiated', 'Playbook initiated',
    jsonb_build_object('playbook_run_id', v_id, 'playbook_key', p_playbook_key, 'task_id', v_task_id));
  return jsonb_build_object('success', true, 'playbook_run_id', v_id, 'task_id', v_task_id);
end; $$;

create or replace function public.create_aipify_hosts_task_from_template(
  p_template_key text,
  p_property_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_tm public.aipify_hosts_task_templates; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into v_tm from public.aipify_hosts_task_templates
  where tenant_id = v_tenant_id and template_key = p_template_key;
  if not found then raise exception 'Template not found'; end if;
  v_key := 'tmpl_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.aipify_hosts_tasks (
    tenant_id, property_id, task_key, title, description, category, priority,
    assignee_role, recurrence, scheduled_for
  ) values (
    v_tenant_id, p_property_id, v_key, v_tm.title, v_tm.description, v_tm.category,
    v_tm.default_priority, v_tm.default_assignee_role, v_tm.recurrence,
    case when v_tm.recurrence is not null then current_date + 1 else null end
  ) returning id into v_id;
  perform public._ahosttask_log_event(v_tenant_id, 'task_from_template', 'Task created from template',
    jsonb_build_object('task_id', v_id, 'template_key', p_template_key));
  return jsonb_build_object('success', true, 'task_id', v_id);
end; $$;

create or replace function public.seed_aipify_hosts_tasks_center_knowledge_airbnb18()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-tasks', 'Hosts Tasks Center',
    'Playbooks, task standards, inspections, and operational consistency.', 260
  );
  perform public._ahostkc_seed_article('aipify-hosts-tasks', 'using-playbooks', 'Using playbooks',
    'Initiate arrival, departure, cleaning, maintenance, inspection, and incident playbooks for repeatable hospitality processes.');
  perform public._ahostkc_seed_article('aipify-hosts-tasks', 'hospitality-task-standards', 'Hospitality task standards',
    'Assign priorities, due dates, and roles. Track status from Not Started through Completed with full audit trail.');
  perform public._ahostkc_seed_article('aipify-hosts-tasks', 'inspection-procedures', 'Inspection procedures',
    'Use inspection playbooks and pre-arrival tasks to verify standards before every guest stay.');
  perform public._ahostkc_seed_article('aipify-hosts-tasks', 'operational-consistency', 'Operational consistency',
    'Templates and recurring tasks standardize daily, weekly, monthly, quarterly, and annual hospitality operations.');
end; $$;

select public.seed_aipify_hosts_tasks_center_knowledge_airbnb18();

grant execute on function public.get_aipify_hosts_tasks_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_tasks_center_dashboard(text, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_task(text, text, uuid, text, text, text, text, date, date, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_task_status(uuid, text, uuid) to authenticated;
grant execute on function public.assign_aipify_hosts_task(uuid, text, text, uuid) to authenticated;
grant execute on function public.initiate_aipify_hosts_playbook(text, uuid, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_task_from_template(text, uuid, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_tasks_center_knowledge_airbnb18() to authenticated;

-- Phase 282 — Workspace & Productivity Hub (Customer App)

-- ---------------------------------------------------------------------------
-- 1. Tasks
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_productivity_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  due_date date,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'not_started' check (
    status in ('not_started', 'in_progress', 'waiting', 'completed', 'cancelled')
  ),
  category text not null default 'general',
  assignee_user_id uuid references public.users (id) on delete set null,
  assignee_label text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspace_productivity_tasks_user_idx
  on public.workspace_productivity_tasks (tenant_id, user_id, status, due_date);

create index if not exists workspace_productivity_tasks_search_idx
  on public.workspace_productivity_tasks (tenant_id, user_id, category);

alter table public.workspace_productivity_tasks enable row level security;
revoke all on public.workspace_productivity_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Reminders
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_productivity_reminders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  reminder_type text not null default 'one_time' check (
    reminder_type in ('one_time', 'recurring', 'due_date')
  ),
  due_at timestamptz not null,
  recurrence_rule text,
  linked_task_id uuid references public.workspace_productivity_tasks (id) on delete set null,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspace_productivity_reminders_user_idx
  on public.workspace_productivity_reminders (tenant_id, user_id, due_at)
  where dismissed_at is null;

alter table public.workspace_productivity_reminders enable row level security;
revoke all on public.workspace_productivity_reminders from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Notes
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_productivity_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  body text not null default '',
  note_type text not null default 'personal' check (
    note_type in ('personal', 'team', 'meeting')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspace_productivity_notes_user_idx
  on public.workspace_productivity_notes (tenant_id, user_id, note_type);

alter table public.workspace_productivity_notes enable row level security;
revoke all on public.workspace_productivity_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_productivity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'task_created', 'task_updated', 'task_completed',
      'reminder_created', 'reminder_dismissed', 'note_created'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workspace_productivity_audit_user_idx
  on public.workspace_productivity_audit_logs (tenant_id, user_id, created_at desc);

alter table public.workspace_productivity_audit_logs enable row level security;
revoke all on public.workspace_productivity_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._wph282_resolve_user(
  out tenant_id uuid,
  out user_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  tenant_id := public._presence_tenant_for_auth();
  if tenant_id is null then
    user_id := null;
    return;
  end if;

  select u.id into user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
end;
$$;

create or replace function public._wph282_log_audit(
  p_tenant_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_productivity_audit_logs (
    tenant_id, user_id, event_type, summary, context
  )
  values (p_tenant_id, p_user_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._wph282_build_task_row(p_task public.workspace_productivity_tasks)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_task.id,
    'title', p_task.title,
    'description', p_task.description,
    'due_date', p_task.due_date,
    'priority', p_task.priority,
    'status', p_task.status,
    'category', p_task.category,
    'assignee_user_id', p_task.assignee_user_id,
    'assignee_label', p_task.assignee_label,
    'completed_at', p_task.completed_at,
    'created_at', p_task.created_at,
    'updated_at', p_task.updated_at
  );
end;
$$;

create or replace function public._wph282_build_reminder_row(p_reminder public.workspace_productivity_reminders)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_reminder.id,
    'title', p_reminder.title,
    'reminder_type', p_reminder.reminder_type,
    'due_at', p_reminder.due_at,
    'recurrence_rule', p_reminder.recurrence_rule,
    'linked_task_id', p_reminder.linked_task_id,
    'dismissed_at', p_reminder.dismissed_at,
    'created_at', p_reminder.created_at
  );
end;
$$;

create or replace function public._wph282_build_note_row(p_note public.workspace_productivity_notes)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_note.id,
    'title', p_note.title,
    'body', p_note.body,
    'note_type', p_note.note_type,
    'created_at', p_note.created_at,
    'updated_at', p_note.updated_at
  );
end;
$$;

create or replace function public._wph282_seed_if_empty(
  p_tenant_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_task1 uuid;
  v_task2 uuid;
  v_task3 uuid;
begin
  if exists (
    select 1 from public.workspace_productivity_tasks
    where tenant_id = p_tenant_id and user_id = p_user_id
    limit 1
  ) then
    return;
  end if;

  insert into public.workspace_productivity_tasks (
    tenant_id, user_id, title, description, due_date, priority, status, category
  ) values
    (
      p_tenant_id, p_user_id,
      'Review quarterly priorities',
      'Align personal focus with team objectives.',
      current_date,
      'high', 'in_progress', 'planning'
    ),
    (
      p_tenant_id, p_user_id,
      'Prepare client follow-up',
      'Draft summary and next steps.',
      current_date + 1,
      'medium', 'not_started', 'client'
    ),
    (
      p_tenant_id, p_user_id,
      'Update onboarding checklist',
      'Complete remaining setup items.',
      current_date - 2,
      'high', 'waiting', 'onboarding'
    )
  returning id into v_task1;

  select id into v_task2 from public.workspace_productivity_tasks
  where tenant_id = p_tenant_id and user_id = p_user_id and title = 'Prepare client follow-up';

  select id into v_task3 from public.workspace_productivity_tasks
  where tenant_id = p_tenant_id and user_id = p_user_id and title = 'Update onboarding checklist';

  insert into public.workspace_productivity_reminders (
    tenant_id, user_id, title, reminder_type, due_at, linked_task_id
  ) values
    (p_tenant_id, p_user_id, 'Team stand-up', 'one_time', date_trunc('day', now()) + interval '10 hours', null),
    (p_tenant_id, p_user_id, 'Weekly planning review', 'recurring', now() + interval '2 days', null),
    (p_tenant_id, p_user_id, 'Client follow-up due', 'due_date', now() + interval '1 day', v_task2);

  insert into public.workspace_productivity_notes (
    tenant_id, user_id, title, body, note_type
  ) values
    (
      p_tenant_id, p_user_id,
      'Focus themes this week',
      'Deep work mornings · client follow-ups afternoons · protect Friday for review.',
      'personal'
    ),
    (
      p_tenant_id, p_user_id,
      'Team sync notes',
      'Shared priorities: onboarding quality, support response time, approval backlog.',
      'team'
    );

  perform public._wph282_log_audit(
    p_tenant_id, p_user_id, 'task_created',
    'Sample workspace tasks initialized',
    jsonb_build_object('seed', true)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Overview bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_workspace_productivity_hub(
  p_search text default null,
  p_status text default null,
  p_priority text default null,
  p_category text default null,
  p_due_from date default null,
  p_due_to date default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_user_name text;
  v_my_tasks integer;
  v_today_priorities integer;
  v_upcoming_reminders integer;
  v_pending_approvals integer;
  v_suggested_actions integer;
  v_completed_week integer;
  v_overdue integer;
  v_avg_completion_hours numeric;
  v_tasks jsonb;
  v_reminders jsonb;
  v_notes jsonb;
  v_my_day_tasks jsonb;
  v_meetings jsonb;
  v_focus_areas jsonb;
  v_suggestions jsonb;
  v_insights jsonb;
  v_audit jsonb;
  v_search text;
begin
  select * into v_tenant_id, v_user_id from public._wph282_resolve_user();
  if v_tenant_id is null or v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  perform public._wph282_seed_if_empty(v_tenant_id, v_user_id);

  select u.full_name into v_user_name
  from public.users u where u.id = v_user_id;

  v_search := nullif(trim(coalesce(p_search, '')), '');

  select count(*) into v_my_tasks
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.status not in ('completed', 'cancelled');

  select count(*) into v_today_priorities
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.due_date = current_date
    and t.status not in ('completed', 'cancelled');

  select count(*) into v_upcoming_reminders
  from public.workspace_productivity_reminders r
  where r.tenant_id = v_tenant_id and r.user_id = v_user_id
    and r.dismissed_at is null
    and r.due_at >= now();

  select count(*) into v_pending_approvals
  from public.action_requests ar
  where ar.tenant_id = v_tenant_id and ar.status = 'pending';

  select count(*) into v_suggested_actions
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.status in ('not_started', 'waiting')
    and (t.due_date is null or t.due_date <= current_date + 3);

  select count(*) into v_completed_week
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.status = 'completed'
    and t.completed_at >= date_trunc('week', now());

  select count(*) into v_overdue
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.due_date < current_date
    and t.status not in ('completed', 'cancelled');

  select coalesce(
    round(avg(extract(epoch from (t.completed_at - t.created_at)) / 3600.0)::numeric, 1),
    0
  ) into v_avg_completion_hours
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.status = 'completed'
    and t.completed_at is not null
    and t.completed_at >= now() - interval '30 days';

  select coalesce(jsonb_agg(public._wph282_build_task_row(t.*) order by
    case t.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
    t.due_date nulls last
  ), '[]'::jsonb)
  into v_tasks
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and (p_status is null or t.status = p_status)
    and (p_priority is null or t.priority = p_priority)
    and (p_category is null or t.category = p_category)
    and (p_due_from is null or t.due_date >= p_due_from)
    and (p_due_to is null or t.due_date <= p_due_to)
    and (
      v_search is null
      or t.title ilike '%' || v_search || '%'
      or t.description ilike '%' || v_search || '%'
      or t.category ilike '%' || v_search || '%'
      or (t.due_date is not null and t.due_date::text ilike '%' || v_search || '%')
      or exists (
        select 1 from public.workspace_productivity_notes n
        where n.tenant_id = v_tenant_id and n.user_id = v_user_id
          and (n.title ilike '%' || v_search || '%' or n.body ilike '%' || v_search || '%')
      )
    );

  select coalesce(jsonb_agg(public._wph282_build_reminder_row(r.*) order by r.due_at), '[]'::jsonb)
  into v_reminders
  from (
    select *
    from public.workspace_productivity_reminders rem
    where rem.tenant_id = v_tenant_id and rem.user_id = v_user_id
      and rem.dismissed_at is null
      and rem.due_at >= now() - interval '1 day'
    order by rem.due_at
    limit 20
  ) r;

  select coalesce(jsonb_agg(public._wph282_build_note_row(n.*) order by n.updated_at desc), '[]'::jsonb)
  into v_notes
  from (
    select *
    from public.workspace_productivity_notes note
    where note.tenant_id = v_tenant_id and note.user_id = v_user_id
      and (
        v_search is null
        or note.title ilike '%' || v_search || '%'
        or note.body ilike '%' || v_search || '%'
      )
    order by note.updated_at desc
    limit 20
  ) n;

  select coalesce(jsonb_agg(public._wph282_build_task_row(t.*) order by t.priority, t.due_date), '[]'::jsonb)
  into v_my_day_tasks
  from public.workspace_productivity_tasks t
  where t.tenant_id = v_tenant_id and t.user_id = v_user_id
    and t.due_date = current_date
    and t.status not in ('completed', 'cancelled');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'title', e.title,
    'starts_at', e.starts_at,
    'ends_at', e.ends_at,
    'calendar_purpose', e.calendar_purpose
  ) order by e.starts_at), '[]'::jsonb)
  into v_meetings
  from public.calendar_events e
  where e.tenant_id = v_tenant_id and e.user_id = v_user_id
    and e.status = 'scheduled'
    and e.starts_at >= date_trunc('day', now())
    and e.starts_at < date_trunc('day', now()) + interval '1 day';

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', focus.key,
    'label', focus.label
  )), '[]'::jsonb)
  into v_focus_areas
  from (
    values
      ('deep_work', 'Protect morning focus for priority work'),
      ('approvals', 'Review pending approvals before end of day'),
      ('follow_up', 'Close open client follow-ups')
  ) as focus(key, label);

  v_suggestions := '[]'::jsonb;
  if v_overdue > 0 then
    v_suggestions := v_suggestions || jsonb_build_array(jsonb_build_object(
      'key', 'overdue_tasks',
      'message_key', 'overdue_tasks',
      'count', v_overdue,
      'severity', 'attention'
    ));
  end if;
  if v_pending_approvals > 0 then
    v_suggestions := v_suggestions || jsonb_build_array(jsonb_build_object(
      'key', 'pending_approval',
      'message_key', 'pending_approval',
      'count', v_pending_approvals,
      'severity', 'important'
    ));
  end if;
  if exists (
    select 1 from public.workspace_productivity_tasks t
    where t.tenant_id = v_tenant_id and t.user_id = v_user_id
      and t.category = 'onboarding'
      and t.status not in ('completed', 'cancelled')
  ) then
    v_suggestions := v_suggestions || jsonb_build_array(jsonb_build_object(
      'key', 'onboarding_checklist',
      'message_key', 'onboarding_checklist',
      'severity', 'informational'
    ));
  end if;

  v_insights := jsonb_build_object(
    'completed_this_week', v_completed_week,
    'average_completion_hours', v_avg_completion_hours,
    'overdue_items', v_overdue,
    'focus_trend', case
      when v_completed_week >= 5 then 'strong'
      when v_completed_week >= 2 then 'steady'
      else 'building'
    end
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'event_type', a.event_type,
    'summary', a.summary,
    'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.workspace_productivity_audit_logs a
  where a.tenant_id = v_tenant_id and a.user_id = v_user_id
  limit 15;

  return jsonb_build_object(
    'has_customer', true,
    'user_name', coalesce(v_user_name, ''),
    'overview', jsonb_build_object(
      'my_tasks', v_my_tasks,
      'today_priorities', v_today_priorities,
      'upcoming_reminders', v_upcoming_reminders,
      'pending_approvals', v_pending_approvals,
      'suggested_actions', v_suggested_actions,
      'completed_this_week', v_completed_week
    ),
    'my_day', jsonb_build_object(
      'tasks', v_my_day_tasks,
      'meetings', v_meetings,
      'reminders', v_reminders,
      'focus_areas', v_focus_areas
    ),
    'tasks', v_tasks,
    'reminders', v_reminders,
    'notes', v_notes,
    'insights', v_insights,
    'suggestions', v_suggestions,
    'audit', v_audit,
    'filters', jsonb_build_object(
      'search', v_search,
      'status', p_status,
      'priority', p_priority,
      'category', p_category,
      'due_from', p_due_from,
      'due_to', p_due_to
    ),
    'principle', 'Productivity should reduce stress, not create it.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.record_workspace_productivity_action(
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_task public.workspace_productivity_tasks;
  v_reminder public.workspace_productivity_reminders;
  v_note public.workspace_productivity_notes;
  v_task_id uuid;
  v_assignee uuid;
begin
  select * into v_tenant_id, v_user_id from public._wph282_resolve_user();
  if v_tenant_id is null or v_user_id is null then
    raise exception 'Customer not found';
  end if;

  p_payload := coalesce(p_payload, '{}'::jsonb);

  if p_action = 'create_task' then
    insert into public.workspace_productivity_tasks (
      tenant_id, user_id, title, description, due_date, priority, status, category, assignee_label
    ) values (
      v_tenant_id, v_user_id,
      coalesce(p_payload ->> 'title', 'New task'),
      coalesce(p_payload ->> 'description', ''),
      nullif(p_payload ->> 'due_date', '')::date,
      coalesce(p_payload ->> 'priority', 'medium'),
      coalesce(p_payload ->> 'status', 'not_started'),
      coalesce(p_payload ->> 'category', 'general'),
      coalesce(p_payload ->> 'assignee_label', '')
    )
    returning * into v_task;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'task_created',
      format('Task created: %s', v_task.title),
      jsonb_build_object('task_id', v_task.id)
    );

    return jsonb_build_object('ok', true, 'task', public._wph282_build_task_row(v_task));
  end if;

  if p_action = 'update_task' then
    v_task_id := nullif(p_payload ->> 'task_id', '')::uuid;
    if v_task_id is null then raise exception 'task_id required'; end if;

    update public.workspace_productivity_tasks t
    set
      title = coalesce(nullif(p_payload ->> 'title', ''), t.title),
      description = coalesce(p_payload ->> 'description', t.description),
      due_date = case when p_payload ? 'due_date' then nullif(p_payload ->> 'due_date', '')::date else t.due_date end,
      priority = coalesce(nullif(p_payload ->> 'priority', ''), t.priority),
      status = coalesce(nullif(p_payload ->> 'status', ''), t.status),
      category = coalesce(nullif(p_payload ->> 'category', ''), t.category),
      assignee_label = coalesce(p_payload ->> 'assignee_label', t.assignee_label),
      updated_at = now()
    where t.id = v_task_id and t.tenant_id = v_tenant_id and t.user_id = v_user_id
    returning * into v_task;

    if v_task.id is null then raise exception 'Task not found'; end if;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'task_updated',
      format('Task updated: %s', v_task.title),
      jsonb_build_object('task_id', v_task.id)
    );

    return jsonb_build_object('ok', true, 'task', public._wph282_build_task_row(v_task));
  end if;

  if p_action = 'complete_task' then
    v_task_id := nullif(p_payload ->> 'task_id', '')::uuid;
    if v_task_id is null then raise exception 'task_id required'; end if;

    update public.workspace_productivity_tasks t
    set status = 'completed', completed_at = now(), updated_at = now()
    where t.id = v_task_id and t.tenant_id = v_tenant_id and t.user_id = v_user_id
    returning * into v_task;

    if v_task.id is null then raise exception 'Task not found'; end if;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'task_completed',
      format('Task completed: %s', v_task.title),
      jsonb_build_object('task_id', v_task.id)
    );

    return jsonb_build_object('ok', true, 'task', public._wph282_build_task_row(v_task));
  end if;

  if p_action = 'delegate_task' then
    v_task_id := nullif(p_payload ->> 'task_id', '')::uuid;
    if v_task_id is null then raise exception 'task_id required'; end if;

    v_assignee := nullif(p_payload ->> 'assignee_user_id', '')::uuid;

    update public.workspace_productivity_tasks t
    set
      assignee_user_id = v_assignee,
      assignee_label = coalesce(nullif(p_payload ->> 'assignee_label', ''), t.assignee_label),
      status = case when t.status = 'not_started' then 'waiting' else t.status end,
      updated_at = now()
    where t.id = v_task_id and t.tenant_id = v_tenant_id and t.user_id = v_user_id
    returning * into v_task;

    if v_task.id is null then raise exception 'Task not found'; end if;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'task_updated',
      format('Task delegated: %s', v_task.title),
      jsonb_build_object('task_id', v_task.id, 'assignee_label', v_task.assignee_label)
    );

    return jsonb_build_object('ok', true, 'task', public._wph282_build_task_row(v_task));
  end if;

  if p_action = 'create_reminder' then
    insert into public.workspace_productivity_reminders (
      tenant_id, user_id, title, reminder_type, due_at, recurrence_rule, linked_task_id
    ) values (
      v_tenant_id, v_user_id,
      coalesce(p_payload ->> 'title', 'Reminder'),
      coalesce(p_payload ->> 'reminder_type', 'one_time'),
      coalesce(nullif(p_payload ->> 'due_at', '')::timestamptz, now() + interval '1 hour'),
      nullif(p_payload ->> 'recurrence_rule', ''),
      nullif(p_payload ->> 'linked_task_id', '')::uuid
    )
    returning * into v_reminder;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'reminder_created',
      format('Reminder created: %s', v_reminder.title),
      jsonb_build_object('reminder_id', v_reminder.id)
    );

    return jsonb_build_object('ok', true, 'reminder', public._wph282_build_reminder_row(v_reminder));
  end if;

  if p_action = 'dismiss_reminder' then
    update public.workspace_productivity_reminders r
    set dismissed_at = now(), updated_at = now()
    where r.id = nullif(p_payload ->> 'reminder_id', '')::uuid
      and r.tenant_id = v_tenant_id and r.user_id = v_user_id
    returning * into v_reminder;

    if v_reminder.id is null then raise exception 'Reminder not found'; end if;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'reminder_dismissed',
      format('Reminder dismissed: %s', v_reminder.title),
      jsonb_build_object('reminder_id', v_reminder.id)
    );

    return jsonb_build_object('ok', true, 'reminder', public._wph282_build_reminder_row(v_reminder));
  end if;

  if p_action = 'create_note' then
    insert into public.workspace_productivity_notes (
      tenant_id, user_id, title, body, note_type
    ) values (
      v_tenant_id, v_user_id,
      coalesce(p_payload ->> 'title', 'Note'),
      coalesce(p_payload ->> 'body', ''),
      coalesce(p_payload ->> 'note_type', 'personal')
    )
    returning * into v_note;

    perform public._wph282_log_audit(
      v_tenant_id, v_user_id, 'note_created',
      format('Note created: %s', v_note.title),
      jsonb_build_object('note_id', v_note.id)
    );

    return jsonb_build_object('ok', true, 'note', public._wph282_build_note_row(v_note));
  end if;

  raise exception 'Unknown action: %', p_action;
end;
$$;

grant execute on function public.get_workspace_productivity_hub(text, text, text, text, date, date) to authenticated;
grant execute on function public.record_workspace_productivity_action(text, jsonb) to authenticated;

-- Phase 35 — Context Engine (ACE) & Universal Calendar Layer (UCL)
-- Orchestrates calendars users already trust. Aipify is the intelligence layer above them.

-- ---------------------------------------------------------------------------
-- 1. context_settings — context modes & user control
-- ---------------------------------------------------------------------------
create table if not exists public.context_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  context_mode text not null default 'auto' check (
    context_mode in (
      'auto', 'work', 'personal', 'family', 'vacation',
      'focus', 'recovery', 'planning'
    )
  ),
  proactive_assistance text not null default 'balanced' check (
    proactive_assistance in ('minimal', 'balanced', 'proactive')
  ),
  notification_frequency text not null default 'balanced' check (
    notification_frequency in ('minimal', 'balanced', 'frequent')
  ),
  daily_briefing_enabled boolean not null default true,
  evening_review_enabled boolean not null default true,
  conflict_detection_enabled boolean not null default true,
  cognitive_load_alerts_enabled boolean not null default true,
  privacy_settings jsonb not null default '{
    "share_calendar_metadata": false,
    "external_sync_read_only": true,
    "show_work_in_personal_mode": false
  }'::jsonb,
  planning_preferences jsonb not null default '{
    "default_calendar_purpose": "personal",
    "prefer_internal_calendar": true,
    "prep_time_minutes": 30,
    "reminder_channels": ["in_app"]
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.context_settings enable row level security;
revoke all on public.context_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. calendar_connections — multi-provider orchestration
-- ---------------------------------------------------------------------------
create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  provider text not null check (
    provider in (
      'aipify_internal', 'apple', 'google', 'outlook', 'microsoft365',
      'samsung', 'yahoo', 'fastmail', 'nextcloud', 'exchange', 'caldav'
    )
  ),
  display_name text not null,
  calendar_purpose text not null default 'personal' check (
    calendar_purpose in (
      'work', 'personal', 'family', 'travel', 'health', 'education', 'custom'
    )
  ),
  connection_status text not null default 'pending' check (
    connection_status in ('connected', 'pending', 'disconnected', 'error')
  ),
  sync_enabled boolean not null default true,
  permissions jsonb not null default '{
    "read_events": true,
    "write_events": false,
    "read_availability": true
  }'::jsonb,
  external_calendar_id text,
  last_synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_connections_user_idx
  on public.calendar_connections (tenant_id, user_id, connection_status);

create unique index if not exists calendar_connections_user_provider_idx
  on public.calendar_connections (tenant_id, user_id, provider);

alter table public.calendar_connections enable row level security;
revoke all on public.calendar_connections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. calendar_events — internal Aipify calendar + coordinated events
-- ---------------------------------------------------------------------------
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  connection_id uuid references public.calendar_connections (id) on delete set null,
  title text not null,
  description text not null default '',
  event_type text not null default 'appointment' check (
    event_type in ('appointment', 'reminder', 'task', 'recurring_event')
  ),
  calendar_purpose text not null default 'personal' check (
    calendar_purpose in (
      'work', 'personal', 'family', 'travel', 'health', 'education', 'custom'
    )
  ),
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  recurrence_rule text,
  source text not null default 'internal' check (
    source in ('internal', 'external', 'memory', 'assistant')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'cancelled')
  ),
  reminder_offsets jsonb not null default '[]'::jsonb,
  linked_memory_id uuid references public.personal_memories (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists calendar_events_user_range_idx
  on public.calendar_events (tenant_id, user_id, starts_at)
  where status = 'scheduled';

alter table public.calendar_events enable row level security;
revoke all on public.calendar_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. calendar_sync_log — transparency for sync history
-- ---------------------------------------------------------------------------
create table if not exists public.calendar_sync_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  connection_id uuid references public.calendar_connections (id) on delete set null,
  sync_status text not null check (sync_status in ('success', 'partial', 'failed')),
  events_synced integer not null default 0,
  message text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists calendar_sync_log_user_idx
  on public.calendar_sync_log (tenant_id, user_id, created_at desc);

alter table public.calendar_sync_log enable row level security;
revoke all on public.calendar_sync_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_context_settings(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.context_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.context_settings;
begin
  insert into public.context_settings (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row
  from public.context_settings
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

create or replace function public.ensure_aipify_internal_calendar(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.calendar_connections
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.calendar_connections;
begin
  select * into v_row
  from public.calendar_connections
  where tenant_id = p_tenant_id and user_id = p_user_id
    and provider = 'aipify_internal'
  limit 1;

  if v_row.id is not null then
    return v_row;
  end if;

  insert into public.calendar_connections (
    tenant_id, user_id, provider, display_name, calendar_purpose,
    connection_status, sync_enabled, permissions
  )
  values (
    p_tenant_id, p_user_id, 'aipify_internal', 'Aipify Calendar', 'personal',
    'connected', true,
    '{"read_events": true, "write_events": true, "read_availability": true}'::jsonb
  )
  returning * into v_row;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. update_context_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_context_settings(
  p_context_mode text default null,
  p_proactive_assistance text default null,
  p_notification_frequency text default null,
  p_daily_briefing_enabled boolean default null,
  p_evening_review_enabled boolean default null,
  p_conflict_detection_enabled boolean default null,
  p_cognitive_load_alerts_enabled boolean default null,
  p_privacy_settings jsonb default null,
  p_planning_preferences jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  perform public.ensure_context_settings(v_tenant_id, v_user_id);

  update public.context_settings
  set
    context_mode = coalesce(p_context_mode, context_mode),
    proactive_assistance = coalesce(p_proactive_assistance, proactive_assistance),
    notification_frequency = coalesce(p_notification_frequency, notification_frequency),
    daily_briefing_enabled = coalesce(p_daily_briefing_enabled, daily_briefing_enabled),
    evening_review_enabled = coalesce(p_evening_review_enabled, evening_review_enabled),
    conflict_detection_enabled = coalesce(p_conflict_detection_enabled, conflict_detection_enabled),
    cognitive_load_alerts_enabled = coalesce(p_cognitive_load_alerts_enabled, cognitive_load_alerts_enabled),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    planning_preferences = coalesce(p_planning_preferences, planning_preferences),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. connect_calendar / disconnect_calendar / update_calendar_connection
-- ---------------------------------------------------------------------------
create or replace function public.connect_calendar(
  p_provider text,
  p_display_name text default null,
  p_calendar_purpose text default 'personal',
  p_permissions jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_conn public.calendar_connections;
  v_name text;
  v_status text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  if p_provider = 'aipify_internal' then
    v_conn := public.ensure_aipify_internal_calendar(v_tenant_id, v_user_id);
    return jsonb_build_object(
      'id', v_conn.id,
      'provider', v_conn.provider,
      'connection_status', v_conn.connection_status,
      'message', 'Aipify Calendar is ready.'
    );
  end if;

  select * into v_conn
  from public.calendar_connections
  where tenant_id = v_tenant_id and user_id = v_user_id
    and provider = p_provider
  limit 1;

  if v_conn.id is not null and v_conn.connection_status in ('connected', 'pending') then
    raise exception 'Calendar provider already connected or pending';
  end if;

  v_name := coalesce(
    p_display_name,
    initcap(replace(p_provider, '_', ' ')) || ' Calendar'
  );
  v_status := 'pending';

  if v_conn.id is not null then
    update public.calendar_connections
    set
      display_name = v_name,
      calendar_purpose = coalesce(p_calendar_purpose, calendar_purpose),
      connection_status = v_status,
      sync_enabled = true,
      permissions = coalesce(
        p_permissions,
        '{"read_events": true, "write_events": false, "read_availability": true}'::jsonb
      ),
      updated_at = now()
    where id = v_conn.id
    returning * into v_conn;
  else
    insert into public.calendar_connections (
      tenant_id, user_id, provider, display_name, calendar_purpose,
      connection_status, permissions
    )
    values (
      v_tenant_id, v_user_id, p_provider, v_name, p_calendar_purpose,
      v_status,
      coalesce(p_permissions, '{"read_events": true, "write_events": false, "read_availability": true}'::jsonb)
    )
    returning * into v_conn;
  end if;

  insert into public.calendar_sync_log (
    tenant_id, user_id, connection_id, sync_status, events_synced, message
  )
  values (
    v_tenant_id, v_user_id, v_conn.id, 'partial', 0,
    format('Connection to %s initiated. OAuth authorization required.', p_provider)
  );

  return jsonb_build_object(
    'id', v_conn.id,
    'provider', v_conn.provider,
    'connection_status', v_conn.connection_status,
    'message', format(
      'To connect %s, authorize Aipify when OAuth is available. Your data stays under your control.',
      v_name
    )
  );
end;
$$;

create or replace function public.disconnect_calendar(p_connection_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_conn public.calendar_connections;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_conn
  from public.calendar_connections
  where id = p_connection_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if v_conn.id is null then raise exception 'Connection not found'; end if;
  if v_conn.provider = 'aipify_internal' then
    raise exception 'Aipify internal calendar cannot be disconnected';
  end if;

  update public.calendar_connections
  set connection_status = 'disconnected', sync_enabled = false, updated_at = now()
  where id = p_connection_id;

  insert into public.calendar_sync_log (
    tenant_id, user_id, connection_id, sync_status, events_synced, message
  )
  values (
    v_tenant_id, v_user_id, p_connection_id, 'success', 0,
    format('Disconnected %s.', v_conn.display_name)
  );

  return jsonb_build_object('disconnected', true);
end;
$$;

create or replace function public.update_calendar_connection(
  p_connection_id uuid,
  p_display_name text default null,
  p_calendar_purpose text default null,
  p_sync_enabled boolean default null,
  p_permissions jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.calendar_connections
  set
    display_name = coalesce(p_display_name, display_name),
    calendar_purpose = coalesce(p_calendar_purpose, calendar_purpose),
    sync_enabled = coalesce(p_sync_enabled, sync_enabled),
    permissions = coalesce(p_permissions, permissions),
    updated_at = now()
  where id = p_connection_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if not found then raise exception 'Connection not found'; end if;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. create_calendar_event / update_calendar_event / get_calendar_events
-- ---------------------------------------------------------------------------
create or replace function public.create_calendar_event(
  p_title text,
  p_description text default '',
  p_event_type text default 'appointment',
  p_calendar_purpose text default 'personal',
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_all_day boolean default false,
  p_recurrence_rule text default null,
  p_connection_id uuid default null,
  p_reminder_offsets jsonb default '[]'::jsonb,
  p_linked_memory_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_conn_id uuid;
  v_event_id uuid;
  v_start timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  v_start := coalesce(p_starts_at, now() + interval '1 day');

  if p_connection_id is not null then
    select id into v_conn_id
    from public.calendar_connections
    where id = p_connection_id and tenant_id = v_tenant_id and user_id = v_user_id
      and connection_status = 'connected';
    if v_conn_id is null then raise exception 'Calendar connection not found or not connected'; end if;
  else
    v_conn_id := (public.ensure_aipify_internal_calendar(v_tenant_id, v_user_id)).id;
  end if;

  insert into public.calendar_events (
    tenant_id, user_id, connection_id, title, description, event_type,
    calendar_purpose, starts_at, ends_at, all_day, recurrence_rule,
    source, reminder_offsets, linked_memory_id
  )
  values (
    v_tenant_id, v_user_id, v_conn_id, p_title, coalesce(p_description, ''),
    coalesce(p_event_type, 'appointment'), coalesce(p_calendar_purpose, 'personal'),
    v_start, p_ends_at, coalesce(p_all_day, false), p_recurrence_rule,
    'internal', coalesce(p_reminder_offsets, '[]'::jsonb), p_linked_memory_id
  )
  returning id into v_event_id;

  return v_event_id;
end;
$$;

create or replace function public.update_calendar_event(
  p_event_id uuid,
  p_title text default null,
  p_description text default null,
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_status text default null,
  p_calendar_purpose text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.calendar_events
  set
    title = coalesce(p_title, title),
    description = coalesce(p_description, description),
    starts_at = coalesce(p_starts_at, starts_at),
    ends_at = coalesce(p_ends_at, ends_at),
    status = coalesce(p_status, status),
    calendar_purpose = coalesce(p_calendar_purpose, calendar_purpose),
    updated_at = now()
  where id = p_event_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if not found then raise exception 'Event not found'; end if;

  return jsonb_build_object('updated', true);
end;
$$;

create or replace function public.get_calendar_events(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_calendar_purpose text default null
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
  v_from timestamptz;
  v_to timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false, 'events', '[]'::jsonb);
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_from := coalesce(p_from, now() - interval '1 day');
  v_to := coalesce(p_to, now() + interval '30 days');

  return jsonb_build_object(
    'has_customer', true,
    'events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'title', e.title, 'description', e.description,
        'event_type', e.event_type, 'calendar_purpose', e.calendar_purpose,
        'starts_at', e.starts_at, 'ends_at', e.ends_at, 'all_day', e.all_day,
        'status', e.status, 'source', e.source,
        'connection_id', e.connection_id, 'linked_memory_id', e.linked_memory_id
      ) order by e.starts_at)
      from public.calendar_events e
      where e.tenant_id = v_tenant_id and e.user_id = v_user_id
        and e.status = 'scheduled'
        and e.starts_at between v_from and v_to
        and (p_calendar_purpose is null or e.calendar_purpose = p_calendar_purpose)),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. analyze_user_context — conflicts, cognitive load, prioritization
-- ---------------------------------------------------------------------------
create or replace function public.analyze_user_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.context_settings;
  v_active_tasks integer;
  v_postponed_high integer;
  v_today_events integer;
  v_overlaps integer;
  v_workload_score integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_settings := public.ensure_context_settings(v_tenant_id, v_user_id);
  perform public.ensure_aipify_internal_calendar(v_tenant_id, v_user_id);

  select count(*) into v_active_tasks
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.status = 'active'
    and m.category in ('tasks', 'events');

  select count(*) into v_postponed_high
  from public.personal_memories m
  join public.life_memory_meta lm on lm.memory_id = m.id
  where m.tenant_id = v_tenant_id and m.status = 'active'
    and lm.postponed_count >= 2
    and lm.priority in ('critical', 'important');

  select count(*) into v_today_events
  from public.calendar_events e
  where e.tenant_id = v_tenant_id and e.user_id = v_user_id
    and e.status = 'scheduled' and e.starts_at::date = current_date;

  select count(*) into v_overlaps
  from public.calendar_events e1
  join public.calendar_events e2
    on e1.tenant_id = e2.tenant_id and e1.user_id = e2.user_id
    and e1.id < e2.id and e1.status = 'scheduled' and e2.status = 'scheduled'
  where e1.tenant_id = v_tenant_id and e1.user_id = v_user_id
    and e1.starts_at < coalesce(e2.ends_at, e2.starts_at + interval '1 hour')
    and coalesce(e1.ends_at, e1.starts_at + interval '1 hour') > e2.starts_at
    and e1.starts_at::date between current_date and current_date + 7;

  v_workload_score := least(100, v_active_tasks * 3 + v_postponed_high * 8 + v_today_events * 5);

  return jsonb_build_object(
    'has_customer', true,
    'context_mode', v_settings.context_mode,
    'active_tasks', v_active_tasks,
    'workload_score', v_workload_score,
    'workload_level', case
      when v_workload_score >= 70 then 'high'
      when v_workload_score >= 40 then 'moderate'
      else 'low'
    end,
    'conflicts', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'type', 'overlap',
        'message', format('Overlapping events: %s and %s', e1.title, e2.title),
        'event_ids', jsonb_build_array(e1.id, e2.id)
      ))
      from public.calendar_events e1
      join public.calendar_events e2
        on e1.tenant_id = e2.tenant_id and e1.user_id = e2.user_id
        and e1.id < e2.id
      where e1.tenant_id = v_tenant_id and e1.user_id = v_user_id
        and e1.status = 'scheduled' and e2.status = 'scheduled'
        and e1.starts_at < coalesce(e2.ends_at, e2.starts_at + interval '1 hour')
        and coalesce(e1.ends_at, e1.starts_at + interval '1 hour') > e2.starts_at
        and e1.starts_at >= now()
      limit 5),
      '[]'::jsonb
    ),
    'cognitive_load', case when v_settings.cognitive_load_alerts_enabled then jsonb_build_object(
      'active_tasks', v_active_tasks,
      'postponed_high_priority', v_postponed_high,
      'message', case
        when v_active_tasks >= 15 then
          format('You currently have %s active tasks. Would you like help prioritizing your week?', v_active_tasks)
        when v_postponed_high >= 2 then
          'You have postponed several high-priority items. Would you like help prioritizing?'
        else null
      end,
      'alert', v_active_tasks >= 15 or v_postponed_high >= 2
    ) else null end,
    'suggested_actions', coalesce(
      (select jsonb_agg(jsonb_build_object('id', s.id, 'message', s.msg))
      from (
        select m.id,
          case
            when lm.postponed_count >= 3 then
              format('Reschedule: %s has been postponed %s times.', m.title, lm.postponed_count)
            when v_overlaps > 0 and m.category = 'events' then
              format('Check schedule: %s may conflict with other events.', m.title)
            when m.category = 'important_people' and m.memory_date <= now() + interval '14 days' then
              format('Plan ahead: %s — would you like a reminder on your calendar?', m.title)
            when m.category = 'tasks' and m.memory_date < now() then
              format('Overdue: %s — find time this week?', m.title)
            else format('Still relevant: %s', m.title)
          end as msg
        from public.personal_memories m
        left join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
        order by
          case when lm.postponed_count >= 3 then 0 else 1 end,
          m.memory_date nulls last
        limit 6
      ) s),
      '[]'::jsonb
    ),
    'proactive_assistance', case when v_settings.proactive_assistance != 'minimal' then
      coalesce(
        (select jsonb_agg(msg)
        from (
          select 'You usually prepare presentations the day before meetings. Reserve preparation time?' as msg
          where v_today_events > 0 and v_settings.context_mode in ('work', 'auto')
          union all
          select 'You normally purchase birthday gifts one week in advance. Remind you this Friday?'
          where exists (
            select 1 from public.personal_memories m
            where m.tenant_id = v_tenant_id and m.category = 'important_people'
              and m.status = 'active'
              and m.memory_date between now() + interval '7 days' and now() + interval '14 days'
          )
          union all
          select 'No exercise time scheduled this week. Find an available slot?'
          where not exists (
            select 1 from public.calendar_events e
            where e.tenant_id = v_tenant_id and e.user_id = v_user_id
              and e.calendar_purpose = 'health'
              and e.starts_at between now() and now() + interval '7 days'
          ) and v_settings.context_mode in ('personal', 'recovery', 'auto')
        ) hints),
        '[]'::jsonb
      )
    else '[]'::jsonb end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. get_context_summary — daily briefing & evening review
-- ---------------------------------------------------------------------------
create or replace function public.get_context_summary(p_summary_type text default 'daily_briefing')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.context_settings;
  v_user_name text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  v_settings := public.ensure_context_settings(v_tenant_id, v_user_id);

  if p_summary_type = 'evening_review' then
    if not v_settings.evening_review_enabled then
      return jsonb_build_object('has_customer', true, 'enabled', false);
    end if;
    return jsonb_build_object(
      'has_customer', true,
      'enabled', true,
      'type', 'evening_review',
      'completed_today', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'completed'
          and m.updated_at::date = current_date limit 10),
        '[]'::jsonb
      ),
      'calendar_completed', coalesce(
        (select jsonb_agg(jsonb_build_object('id', e.id, 'title', e.title))
        from public.calendar_events e
        where e.tenant_id = v_tenant_id and e.user_id = v_user_id
          and e.status = 'completed' and e.updated_at::date = current_date limit 10),
        '[]'::jsonb
      ),
      'still_outstanding', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and m.category in ('tasks', 'events')
          and lm.priority in ('critical', 'important')
        limit 10),
        '[]'::jsonb
      ),
      'prompt', 'Would you like me to reschedule these tasks?'
    );
  end if;

  if not v_settings.daily_briefing_enabled then
    return jsonb_build_object('has_customer', true, 'enabled', false);
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', true,
    'type', 'daily_briefing',
    'greeting', format('Good morning, %s.', coalesce(split_part(v_user_name, ' ', 1), 'there')),
    'context_mode', v_settings.context_mode,
    'today_events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'title', e.title, 'starts_at', e.starts_at,
        'calendar_purpose', e.calendar_purpose
      ) order by e.starts_at)
      from public.calendar_events e
      where e.tenant_id = v_tenant_id and e.user_id = v_user_id
        and e.status = 'scheduled' and e.starts_at::date = current_date),
      '[]'::jsonb
    ),
    'follow_ups', coalesce(
      (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.category = 'tasks'
        and m.status = 'active' limit 5),
      '[]'::jsonb
    ),
    'upcoming_reminders', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'title', m.title, 'memory_date', m.memory_date
      ) order by m.memory_date)
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'
        and m.memory_date between now() and now() + interval '14 days'
      limit 5),
      '[]'::jsonb
    ),
    'prompt', 'Would you like me to help plan your day?'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. get_customer_context_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_context_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.context_settings;
  v_user_name text;
  v_analysis jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_context_settings(v_tenant_id, v_user_id);
  perform public.ensure_aipify_internal_calendar(v_tenant_id, v_user_id);
  v_analysis := public.analyze_user_context();

  return jsonb_build_object(
    'has_customer', true,
    'user_name', coalesce(split_part(v_user_name, ' ', 1), 'there'),
    'settings', jsonb_build_object(
      'context_mode', v_settings.context_mode,
      'proactive_assistance', v_settings.proactive_assistance,
      'notification_frequency', v_settings.notification_frequency,
      'daily_briefing_enabled', v_settings.daily_briefing_enabled,
      'evening_review_enabled', v_settings.evening_review_enabled,
      'conflict_detection_enabled', v_settings.conflict_detection_enabled,
      'cognitive_load_alerts_enabled', v_settings.cognitive_load_alerts_enabled,
      'privacy_settings', v_settings.privacy_settings,
      'planning_preferences', v_settings.planning_preferences
    ),
    'connected_calendars', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'provider', c.provider, 'display_name', c.display_name,
        'calendar_purpose', c.calendar_purpose, 'connection_status', c.connection_status,
        'sync_enabled', c.sync_enabled, 'last_synced_at', c.last_synced_at
      ) order by c.provider)
      from public.calendar_connections c
      where c.tenant_id = v_tenant_id and c.user_id = v_user_id
        and c.connection_status != 'disconnected'),
      '[]'::jsonb
    ),
    'upcoming_events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'title', e.title, 'starts_at', e.starts_at,
        'calendar_purpose', e.calendar_purpose, 'event_type', e.event_type
      ) order by e.starts_at)
      from public.calendar_events e
      where e.tenant_id = v_tenant_id and e.user_id = v_user_id
        and e.status = 'scheduled' and e.starts_at >= now()
      limit 10),
      '[]'::jsonb
    ),
    'priority_tasks', coalesce(
      (select jsonb_agg(row order by pri_ord, md nulls last)
      from (
        select jsonb_build_object(
          'id', m.id, 'title', m.title, 'memory_date', m.memory_date,
          'priority', lm.priority, 'life_area', lm.life_area
        ) as row,
        case lm.priority
          when 'critical' then 1 when 'important' then 2
          when 'routine' then 3 else 4
        end as pri_ord,
        m.memory_date as md
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.category = 'tasks'
          and m.status = 'active'
        limit 10
      ) sub),
      '[]'::jsonb
    ),
    'daily_briefing', public.get_context_summary('daily_briefing'),
    'evening_review', public.get_context_summary('evening_review'),
    'analysis', v_analysis,
    'conflicts', v_analysis -> 'conflicts',
    'cognitive_load', v_analysis -> 'cognitive_load',
    'suggested_actions', v_analysis -> 'suggested_actions',
    'proactive_assistance', v_analysis -> 'proactive_assistance',
    'workload', jsonb_build_object(
      'score', v_analysis -> 'workload_score',
      'level', v_analysis -> 'workload_level'
    ),
    'privacy_note', 'Context unifies your calendars and priorities. You control connections, modes, and what Aipify may access.',
    'context_sources', jsonb_build_object(
      'learning_engine', 'Recommendations only',
      'pame', 'Memories inform scheduling suggestions',
      'life_os', 'Life areas and priorities',
      'rsi', 'Relationship reminders',
      'identity', 'Communication style respected',
      'calendars', 'Events from connected providers and Aipify Calendar'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. get_customer_calendar_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_calendar_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  perform public.ensure_aipify_internal_calendar(v_tenant_id, v_user_id);

  return jsonb_build_object(
    'has_customer', true,
    'privacy_note', 'Calendar data belongs to you. Disconnect any provider at any time. Aipify accesses only what you authorize.',
    'supported_providers', jsonb_build_array(
      'aipify_internal', 'apple', 'google', 'outlook', 'microsoft365',
      'samsung', 'yahoo', 'fastmail', 'nextcloud', 'exchange', 'caldav'
    ),
    'connections', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'provider', c.provider, 'display_name', c.display_name,
        'calendar_purpose', c.calendar_purpose, 'connection_status', c.connection_status,
        'sync_enabled', c.sync_enabled, 'permissions', c.permissions,
        'last_synced_at', c.last_synced_at, 'created_at', c.created_at
      ) order by
        case c.connection_status when 'connected' then 0 when 'pending' then 1 else 2 end,
        c.display_name)
      from public.calendar_connections c
      where c.tenant_id = v_tenant_id and c.user_id = v_user_id
        and c.connection_status != 'disconnected'),
      '[]'::jsonb
    ),
    'recent_events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'title', e.title, 'starts_at', e.starts_at,
        'calendar_purpose', e.calendar_purpose, 'source', e.source
      ) order by e.created_at desc)
      from public.calendar_events e
      where e.tenant_id = v_tenant_id and e.user_id = v_user_id
      limit 10),
      '[]'::jsonb
    ),
    'sync_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'connection_id', l.connection_id,
        'sync_status', l.sync_status, 'events_synced', l.events_synced,
        'message', l.message, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.calendar_sync_log l
      where l.tenant_id = v_tenant_id and l.user_id = v_user_id
      limit 15),
      '[]'::jsonb
    ),
    'purposes_by_connection', coalesce(
      (select jsonb_object_agg(c.id::text, c.calendar_purpose)
      from public.calendar_connections c
      where c.tenant_id = v_tenant_id and c.user_id = v_user_id
        and c.connection_status != 'disconnected'),
      '{}'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Platform overview — aggregates only
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_context_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access calendar events or context details. Aggregates only.',
    'context_profiles', (select count(*) from public.context_settings),
    'calendar_connections', (select count(*) from public.calendar_connections where connection_status = 'connected'),
    'pending_connections', (select count(*) from public.calendar_connections where connection_status = 'pending'),
    'internal_events', (select count(*) from public.calendar_events where source = 'internal' and status = 'scheduled'),
    'by_context_mode', coalesce(
      (select jsonb_object_agg(context_mode, cnt)
      from (select context_mode, count(*)::integer as cnt from public.context_settings group by context_mode) sub),
      '{}'::jsonb
    ),
    'by_provider', coalesce(
      (select jsonb_object_agg(provider, cnt)
      from (
        select provider, count(*)::integer as cnt
        from public.calendar_connections where connection_status = 'connected'
        group by provider
      ) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.ensure_context_settings(uuid, uuid) to authenticated;
grant execute on function public.ensure_aipify_internal_calendar(uuid, uuid) to authenticated;
grant execute on function public.update_context_settings(
  text, text, text, boolean, boolean, boolean, boolean, jsonb, jsonb
) to authenticated;
grant execute on function public.connect_calendar(text, text, text, jsonb) to authenticated;
grant execute on function public.disconnect_calendar(uuid) to authenticated;
grant execute on function public.update_calendar_connection(uuid, text, text, boolean, jsonb) to authenticated;
grant execute on function public.create_calendar_event(
  text, text, text, text, timestamptz, timestamptz, boolean, text, uuid, jsonb, uuid
) to authenticated;
grant execute on function public.update_calendar_event(
  uuid, text, text, timestamptz, timestamptz, text, text
) to authenticated;
grant execute on function public.get_calendar_events(timestamptz, timestamptz, text) to authenticated;
grant execute on function public.analyze_user_context() to authenticated;
grant execute on function public.get_context_summary(text) to authenticated;
grant execute on function public.get_customer_context_center() to authenticated;
grant execute on function public.get_customer_calendar_center() to authenticated;
grant execute on function public.get_platform_context_overview() to authenticated;

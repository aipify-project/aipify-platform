-- Phase 528 — Events, Bookings & Scheduling Operations Engine
-- Extends Phase 507 (organization_calendar_*). One scheduling and coordination layer.
-- Time is one of the most valuable resources an organization owns.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_scheduling_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enable_resource_booking boolean not null default true,
  enable_recurring boolean not null default true,
  enable_external_sync boolean not null default true,
  prevent_double_booking boolean not null default true,
  companion_scheduling_enabled boolean not null default true,
  default_view text not null default 'week' check (
    default_view in ('day', 'week', 'month', 'timeline', 'agenda', 'department', 'organization')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_scheduling_settings enable row level security;
revoke all on public.organization_scheduling_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Availability blocks
-- ---------------------------------------------------------------------------
create table if not exists public.organization_scheduling_availability_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  block_number text,
  block_type text not null default 'blocked' check (
    block_type in ('available', 'reserved', 'booked', 'blocked', 'unavailable')
  ),
  resource_id uuid references public.organization_calendar_resources (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (organization_id, block_number)
);

create index if not exists organization_scheduling_availability_org_idx
  on public.organization_scheduling_availability_blocks (organization_id, starts_at, ends_at);

alter table public.organization_scheduling_availability_blocks enable row level security;
revoke all on public.organization_scheduling_availability_blocks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Meeting notes & workflow links
-- ---------------------------------------------------------------------------
create table if not exists public.organization_scheduling_meeting_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.organization_calendar_events (id) on delete cascade,
  notes text not null default '',
  actions jsonb not null default '[]'::jsonb,
  decisions jsonb not null default '[]'::jsonb,
  follow_up_tasks jsonb not null default '[]'::jsonb,
  attendance jsonb not null default '[]'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_scheduling_meeting_notes_event_idx
  on public.organization_scheduling_meeting_notes (organization_id, event_id);

alter table public.organization_scheduling_meeting_notes enable row level security;
revoke all on public.organization_scheduling_meeting_notes from authenticated, anon;

create table if not exists public.organization_scheduling_workflow_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.organization_calendar_events (id) on delete cascade,
  link_type text not null check (
    link_type in ('task', 'approval', 'notification', 'report', 'custom')
  ),
  target_ref text not null default '',
  summary text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'completed', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_scheduling_workflow_links_event_idx
  on public.organization_scheduling_workflow_links (organization_id, event_id);

alter table public.organization_scheduling_workflow_links enable row level security;
revoke all on public.organization_scheduling_workflow_links from authenticated, anon;

create table if not exists public.organization_scheduling_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid references public.organization_calendar_events (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_scheduling_audit_org_idx
  on public.organization_scheduling_audit_logs (organization_id, created_at desc);

alter table public.organization_scheduling_audit_logs enable row level security;
revoke all on public.organization_scheduling_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Extend Phase 507 event statuses for Phase 528 lifecycle
-- ---------------------------------------------------------------------------
alter table public.organization_calendar_events drop constraint if exists organization_calendar_events_status_check;
alter table public.organization_calendar_events add constraint organization_calendar_events_status_check check (
  status in (
    'scheduled', 'information', 'pending', 'confirmed', 'cancelled', 'awaiting_approval',
    'planned', 'requires_action', 'restricted', 'completed'
  )
);

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._sch528_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._sch528_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._sch528_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_event_id uuid default null,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_scheduling_audit_logs (
    organization_id, event_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id, p_event_id, public._sch528_user(),
    p_action, p_summary, p_entity_type, p_entity_id,
    coalesce(p_payload, '{}'::jsonb)
  );
  if p_event_id is not null then
    perform public._cal507_log(p_org_id, p_event_id, p_action, p_summary, p_payload);
  end if;
end; $$;

create or replace function public._sch528_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._sch528_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_scheduling_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
  perform public._cal507_seed_resources(p_org_id);
  perform public._cal507_seed_sync_connections(p_org_id);
end; $$;

create or replace function public._sch528_event_json(p_row public.organization_calendar_events)
returns jsonb language sql stable as $$
  select public._cal507_event_json(p_row);
$$;

-- ---------------------------------------------------------------------------
-- 6. Scheduling Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_scheduling_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_range_start timestamptz := now() - interval '7 days';
  v_range_end timestamptz := now() + interval '60 days';
begin
  perform public._irp_require_permission('scheduling.view');
  v_org_id := public._sch528_org();
  v_user_id := public._sch528_user();
  perform public._sch528_ensure_settings(v_org_id);
  perform public._sch528_log(v_org_id, 'center_view', 'Scheduling Center viewed', null, 'center', null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Time is one of the most valuable resources an organization owns.',
    'philosophy', 'Time is a resource. Scheduling creates coordination. Coordination creates execution.',
    'calendar_views', jsonb_build_array('day', 'week', 'month', 'timeline', 'agenda', 'department', 'organization'),
    'event_statuses', jsonb_build_array(
      'planned', 'confirmed', 'requires_action', 'restricted', 'completed', 'cancelled',
      'scheduled', 'awaiting_approval'
    ),
    'event_categories', jsonb_build_array(
      'meeting', 'appointment', 'booking', 'maintenance', 'training', 'customer_visit', 'internal_event', 'custom_event'
    ),
    'overview', jsonb_build_object(
      'upcoming_events', (
        select count(*) from public.organization_calendar_events
        where organization_id = v_org_id and starts_at >= now() and status not in ('cancelled', 'completed')
      ),
      'my_upcoming', (
        select count(*) from public.organization_calendar_event_assignees a
        join public.organization_calendar_events e on e.id = a.event_id
        where a.organization_id = v_org_id and a.user_id = v_user_id
          and e.starts_at >= now() and e.status not in ('cancelled', 'completed')
      ),
      'active_bookings', (
        select count(*) from public.organization_calendar_resource_bookings b
        join public.organization_calendar_events e on e.id = b.event_id
        where b.organization_id = v_org_id and e.starts_at >= now() and b.booking_status = 'confirmed'
      ),
      'schedule_conflicts', (
        select count(*) from public.organization_calendar_resource_bookings
        where organization_id = v_org_id and conflict_warning = true
      ),
      'resources_available', (
        select count(*) from public.organization_calendar_resources
        where organization_id = v_org_id and is_active = true
      ),
      'recurring_schedules', (
        select count(*) from public.organization_calendar_recurring
        where organization_id = v_org_id and active = true
      ),
      'pending_approvals', (
        select count(*) from public.organization_calendar_approvals
        where organization_id = v_org_id and approval_status = 'pending'
      ),
      'capacity_utilization_pct', least(100, greatest(0,
        coalesce((
          select (count(*)::numeric / greatest((select count(*) from public.organization_calendar_resources where organization_id = v_org_id and is_active = true), 1)) * 100
          from public.organization_calendar_resource_bookings b
          join public.organization_calendar_events e on e.id = b.event_id
          where b.organization_id = v_org_id and e.starts_at >= now() - interval '30 days'
        ), 0)::int
      ))
    ),
    'calendar_events', coalesce((
      select jsonb_agg(public._sch528_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id
        and e.starts_at >= v_range_start and e.starts_at <= v_range_end
        and e.status not in ('cancelled')
      limit 100
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(public._sch528_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id
        and e.starts_at >= now() - interval '30 days'
        and e.status not in ('cancelled')
      limit 50
    ), '[]'::jsonb),
    'bookings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'booking_id', b.id, 'event_id', b.event_id, 'resource_id', b.resource_id,
        'resource_name', r.name, 'resource_type', r.resource_type,
        'event_title', e.title, 'starts_at', e.starts_at, 'ends_at', e.ends_at,
        'booking_status', b.booking_status, 'conflict_warning', b.conflict_warning,
        'department_id', e.department_id, 'domain_id', e.domain_id
      ) order by e.starts_at)
      from public.organization_calendar_resource_bookings b
      join public.organization_calendar_events e on e.id = b.event_id
      join public.organization_calendar_resources r on r.id = b.resource_id
      where b.organization_id = v_org_id and e.starts_at >= now() - interval '7 days'
      limit 50
    ), '[]'::jsonb),
    'appointments', coalesce((
      select jsonb_agg(public._sch528_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id
        and e.event_type in ('appointment', 'customer_visit', 'booking', 'training')
        and e.starts_at >= now() - interval '7 days'
        and e.status not in ('cancelled')
      limit 40
    ), '[]'::jsonb),
    'resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'resource_key', r.resource_key, 'name', r.name,
        'resource_type', r.resource_type, 'location', r.location,
        'capacity', r.capacity, 'is_active', r.is_active
      ) order by r.name)
      from public.organization_calendar_resources r
      where r.organization_id = v_org_id and r.is_active = true
    ), '[]'::jsonb),
    'availability', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ab.id, 'block_number', ab.block_number, 'block_type', ab.block_type,
        'resource_id', ab.resource_id, 'user_id', ab.user_id,
        'starts_at', ab.starts_at, 'ends_at', ab.ends_at, 'reason', ab.reason
      ) order by ab.starts_at)
      from public.organization_scheduling_availability_blocks ab
      where ab.organization_id = v_org_id and ab.ends_at >= now()
      limit 40
    ), '[]'::jsonb),
    'recurring', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rc.id, 'title', rc.title, 'frequency', rc.frequency,
        'next_run_at', rc.next_run_at, 'active', rc.active, 'event_type', rc.event_type
      ) order by rc.next_run_at)
      from public.organization_calendar_recurring rc
      where rc.organization_id = v_org_id and rc.active = true
    ), '[]'::jsonb),
    'sync_connections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'provider', s.provider, 'sync_mode', s.sync_mode,
        'connection_status', s.connection_status
      ) order by s.provider)
      from public.organization_calendar_sync_connections s
      where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'department_calendars', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_id', d.id, 'department_name', d.name,
        'upcoming', (
          select count(*) from public.organization_calendar_events e
          where e.organization_id = v_org_id and e.department_id = d.id
            and e.starts_at >= now() and e.status not in ('cancelled')
        )
      ) order by d.name)
      from public.organization_departments d
      where d.organization_id = v_org_id and d.is_active = true
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'booking_utilization', coalesce((
        select jsonb_agg(jsonb_build_object('resource_name', r.name, 'bookings', cnt))
        from (
          select resource_id, count(*) cnt from public.organization_calendar_resource_bookings
          where organization_id = v_org_id group by resource_id
        ) s join public.organization_calendar_resources r on r.id = s.resource_id
      ), '[]'::jsonb),
      'meeting_volume_30d', (
        select count(*) from public.organization_calendar_events
        where organization_id = v_org_id and event_type = 'meeting'
          and starts_at >= now() - interval '30 days' and status not in ('cancelled')
      ),
      'schedule_conflicts', (
        select count(*) from public.organization_calendar_resource_bookings
        where organization_id = v_org_id and conflict_warning = true
      ),
      'department_activity', coalesce((
        select jsonb_agg(jsonb_build_object('department_id', department_id, 'events', cnt))
        from (
          select department_id, count(*) cnt from public.organization_calendar_events
          where organization_id = v_org_id and starts_at >= now() - interval '30 days'
            and department_id is not null group by department_id
        ) x
      ), '[]'::jsonb),
      'capacity_utilization_pct', least(100, greatest(0,
        coalesce((
          select (count(*)::numeric / greatest((select count(*) from public.organization_calendar_resources where organization_id = v_org_id and is_active = true), 1)) * 100
          from public.organization_calendar_resource_bookings b
          join public.organization_calendar_events e on e.id = b.event_id
          where b.organization_id = v_org_id and e.starts_at >= now() - interval '30 days'
        ), 0)::int
      ))
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_scheduling_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'calendar', 'events', 'bookings', 'appointments', 'resources', 'availability', 'reports'
    ),
    'routes', jsonb_build_object(
      'scheduling', '/app/scheduling',
      'calendar', '/app/calendar',
      'events', '/app/events',
      'bookings', '/app/bookings'
    ),
    'external_calendar_providers', jsonb_build_array(
      'outlook', 'microsoft365', 'google', 'apple', 'exchange'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_scheduling_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user uuid;
  v_id uuid;
  v_result jsonb;
begin
  v_org_id := public._sch528_org();
  v_user := public._sch528_user();
  perform public._sch528_ensure_settings(v_org_id);

  if p_action_type in (
    'create_event', 'book_resource', 'cancel_event', 'create_recurring',
    'block_availability', 'record_meeting_notes', 'create_workflow_link',
    'accept_invitation', 'complete_event', 'approve_event', 'reject_event'
  ) then
    perform public._irp_require_permission('scheduling.manage');
  else
    perform public._irp_require_permission('scheduling.view');
  end if;

  if p_action_type = 'create_event' then
    insert into public.organization_calendar_events (
      organization_id, event_number, title, description, event_type, status,
      owner_user_id, created_by, starts_at, ends_at, all_day,
      department_id, domain_id, related_module_key, business_pack_key,
      location, assignment_scope, requires_approval, recurrence_rule, metadata
    ) values (
      v_org_id, public._cal507_next_event_number(v_org_id),
      left(trim(p_payload->>'title'), 200),
      left(coalesce(p_payload->>'description', ''), 1000),
      coalesce(p_payload->>'event_type', 'meeting'),
      coalesce(p_payload->>'status', 'planned'),
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      v_user,
      coalesce((p_payload->>'starts_at')::timestamptz, now() + interval '1 hour'),
      coalesce((p_payload->>'ends_at')::timestamptz, now() + interval '2 hours'),
      coalesce((p_payload->>'all_day')::boolean, false),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'related_module_key',
      p_payload->>'business_pack_key',
      p_payload->>'location',
      coalesce(p_payload->>'assignment_scope', 'individual'),
      coalesce((p_payload->>'requires_approval')::boolean, false),
      p_payload->>'recurrence_rule',
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning id into v_id;
    perform public._sch528_log(v_org_id, 'event_created', 'Event created', v_id, 'event', v_id, p_payload);
    return jsonb_build_object('ok', true, 'event_id', v_id);

  elsif p_action_type = 'cancel_event' then
    update public.organization_calendar_events set status = 'cancelled', updated_at = now()
    where id = (p_payload->>'event_id')::uuid and organization_id = v_org_id;
    perform public._sch528_log(v_org_id, 'event_cancelled', 'Event cancelled', (p_payload->>'event_id')::uuid, 'event', (p_payload->>'event_id')::uuid, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_recurring' then
    insert into public.organization_calendar_recurring (
      organization_id, title, event_type, frequency, recurrence_rule, next_run_at,
      duration_minutes, owner_user_id, department_id, domain_id, business_pack_key
    ) values (
      v_org_id, coalesce(p_payload->>'title', 'Recurring event'),
      coalesce(p_payload->>'event_type', 'meeting'),
      coalesce(p_payload->>'frequency', 'weekly'), p_payload->>'recurrence_rule',
      coalesce((p_payload->>'next_run_at')::timestamptz, now() + interval '7 days'),
      coalesce((p_payload->>'duration_minutes')::integer, 60),
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    perform public._sch528_log(v_org_id, 'recurring_created', 'Recurring schedule created', null, 'recurring', v_id, p_payload);
    return jsonb_build_object('ok', true, 'recurring_id', v_id);

  elsif p_action_type = 'book_resource' then
    v_result := public.perform_scheduling_operations_action('create_event', p_payload);
    if coalesce((v_result->>'ok')::boolean, false) and nullif(p_payload->>'resource_id', '')::uuid is not null then
      insert into public.organization_calendar_resource_bookings (
        organization_id, event_id, resource_id, booking_status, conflict_warning
      ) values (
        v_org_id, (v_result->>'event_id')::uuid,
        nullif(p_payload->>'resource_id', '')::uuid,
        'confirmed', false
      ) on conflict do nothing;
      perform public._sch528_log(v_org_id, 'booking_created', 'Resource booked', (v_result->>'event_id')::uuid, 'booking', (v_result->>'event_id')::uuid, p_payload);
    end if;
    return v_result;

  end if;

  if p_action_type in ('approve_event', 'reject_event') then
    v_result := public.perform_calendar_management_action(p_action_type, p_payload);
    if coalesce((v_result->>'ok')::boolean, false) then
      perform public._sch528_log(
        v_org_id, p_action_type, 'Scheduling approval action',
        (p_payload->>'event_id')::uuid, 'event', (p_payload->>'event_id')::uuid, p_payload
      );
    end if;
    return v_result;
  end if;

  if p_action_type = 'block_availability' then
    insert into public.organization_scheduling_availability_blocks (
      organization_id, block_number, block_type, resource_id, user_id,
      department_id, domain_id, starts_at, ends_at, reason
    ) values (
      v_org_id,
      coalesce(p_payload->>'block_number', public._sch528_next_number(v_org_id, 'AVL', 'organization_scheduling_availability_blocks')),
      coalesce(p_payload->>'block_type', 'blocked'),
      nullif(p_payload->>'resource_id', '')::uuid,
      coalesce(nullif(p_payload->>'user_id', '')::uuid, v_user),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      (p_payload->>'starts_at')::timestamptz,
      (p_payload->>'ends_at')::timestamptz,
      coalesce(p_payload->>'reason', '')
    ) returning id into v_id;
    perform public._sch528_log(v_org_id, 'availability_blocked', 'Availability block created', null, 'availability', v_id, p_payload);
    return jsonb_build_object('ok', true, 'block_id', v_id);

  elsif p_action_type = 'record_meeting_notes' then
    insert into public.organization_scheduling_meeting_notes (
      organization_id, event_id, notes, actions, decisions, follow_up_tasks, attendance, recorded_by
    ) values (
      v_org_id,
      (p_payload->>'event_id')::uuid,
      coalesce(p_payload->>'notes', ''),
      coalesce(p_payload->'actions', '[]'::jsonb),
      coalesce(p_payload->'decisions', '[]'::jsonb),
      coalesce(p_payload->'follow_up_tasks', '[]'::jsonb),
      coalesce(p_payload->'attendance', '[]'::jsonb),
      v_user
    ) returning id into v_id;
    update public.organization_calendar_events set status = 'completed', updated_at = now()
    where id = (p_payload->>'event_id')::uuid and organization_id = v_org_id;
    perform public._sch528_log(v_org_id, 'attendance_recorded', 'Meeting notes recorded', (p_payload->>'event_id')::uuid, 'meeting_notes', v_id, p_payload);
    return jsonb_build_object('ok', true, 'notes_id', v_id);

  elsif p_action_type = 'create_workflow_link' then
    insert into public.organization_scheduling_workflow_links (
      organization_id, event_id, link_type, target_ref, summary, status, metadata
    ) values (
      v_org_id,
      (p_payload->>'event_id')::uuid,
      coalesce(p_payload->>'link_type', 'task'),
      coalesce(p_payload->>'target_ref', ''),
      coalesce(p_payload->>'summary', 'Workflow link from scheduling'),
      'pending',
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning id into v_id;
    perform public._sch528_log(v_org_id, 'workflow_link_created', 'Scheduling workflow link created', (p_payload->>'event_id')::uuid, 'workflow', v_id, p_payload);
    return jsonb_build_object('ok', true, 'link_id', v_id);

  elsif p_action_type = 'accept_invitation' then
    perform public._sch528_log(v_org_id, 'invitation_accepted', 'Meeting invitation accepted',
      (p_payload->>'event_id')::uuid, 'assignee', v_user, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'complete_event' then
    update public.organization_calendar_events set status = 'completed', updated_at = now()
    where id = (p_payload->>'event_id')::uuid and organization_id = v_org_id;
    perform public._sch528_log(v_org_id, 'event_completed', 'Event completed', (p_payload->>'event_id')::uuid, 'event', (p_payload->>'event_id')::uuid, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_scheduling_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_cal jsonb;
begin
  perform public._irp_require_permission('scheduling.view');
  v_org_id := public._sch528_org();
  v_user_id := public._sch528_user();
  perform public._sch528_ensure_settings(v_org_id);

  v_cal := public.get_companion_calendar_context();

  if p_query is not null and length(trim(p_query)) > 0 then
    perform public._sch528_log(v_org_id, 'companion_query', 'Companion scheduling query', null, null, null,
      jsonb_build_object('query', trim(p_query)));
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands calendars, events, resources, availability, and bookings.',
    'query', p_query,
    'my_upcoming', v_cal->'my_upcoming',
    'available_resources', v_cal->'available_resources',
    'conflicts', v_cal->'conflicts',
    'recurring', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'frequency', frequency))
      from public.organization_calendar_recurring
      where organization_id = v_org_id and active = true limit 5
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'What is on my schedule today?',
      'Show upcoming meetings.',
      'Book Conference Room A.',
      'Show available time next week.',
      'Create recurring management meeting.'
    ),
    'routes', jsonb_build_object(
      'scheduling', '/app/scheduling',
      'calendar', '/app/calendar',
      'events', '/app/events',
      'bookings', '/app/bookings'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_scheduling_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('scheduling.view');
  v_org_id := public._sch528_org();
  v_user_id := public._sch528_user();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('scheduling.manage', v_org_id),
    'upcoming_events', (
      select count(*) from public.organization_calendar_events
      where organization_id = v_org_id and starts_at >= now() and status not in ('cancelled', 'completed')
    ),
    'my_upcoming', (
      select count(*) from public.organization_calendar_event_assignees a
      join public.organization_calendar_events e on e.id = a.event_id
      where a.organization_id = v_org_id and a.user_id = v_user_id
        and e.starts_at >= now() and e.status not in ('cancelled', 'completed')
    ),
    'schedule_conflicts', (
      select count(*) from public.organization_calendar_resource_bookings
      where organization_id = v_org_id and conflict_warning = true
    ),
    'routes', jsonb_build_object(
      'scheduling', '/app/scheduling',
      'calendar', '/app/calendar',
      'events', '/app/events',
      'bookings', '/app/bookings',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('scheduling', '/app/scheduling'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'scheduling', 'Scheduling & Events', 'scheduling', 'operations',
    'Events, bookings, appointments, resources, availability, and calendar coordination.',
    'starter', null, 'operations', '/app/scheduling', 'licensed', 10
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('scheduling', 'scheduling.view', 'view', 'Scheduling — view calendar, events, bookings, and availability'),
    ('scheduling', 'scheduling.manage', 'manage', 'Scheduling — manage events, bookings, resources, and recurring schedules')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('scheduling', 'scheduling.view', 'view', 'Scheduling — view calendar, events, bookings, and availability'),
    ('scheduling', 'scheduling.manage', 'manage', 'Scheduling — manage events, bookings, resources, and recurring schedules')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_scheduling_operations_center(text) to authenticated;
grant execute on function public.perform_scheduling_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_scheduling_operations_context(text) to authenticated;
grant execute on function public.get_my_scheduling_operations_summary() to authenticated;

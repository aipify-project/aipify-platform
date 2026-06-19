-- Phase 507 — Calendar, Scheduling & Resource Management Engine
-- Universal calendar engine for all APP organizations and Business Packs
-- Distinct from Phase 35 personal calendar (calendar_events) — org-scoped planning layer

-- ---------------------------------------------------------------------------
-- 1. Resources (rooms, vehicles, equipment, properties, assets, workstations)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_calendar_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  resource_key text not null,
  name text not null,
  resource_type text not null check (
    resource_type in ('meeting_room', 'vehicle', 'equipment', 'property', 'asset', 'workstation')
  ),
  description text not null default '',
  location text,
  capacity integer,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, resource_key)
);

create index if not exists organization_calendar_resources_org_idx
  on public.organization_calendar_resources (organization_id, resource_type, is_active);

-- ---------------------------------------------------------------------------
-- 2. Calendar events
-- ---------------------------------------------------------------------------
create table if not exists public.organization_calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_number text,
  title text not null,
  description text not null default '',
  event_type text not null default 'meeting' check (
    event_type in (
      'meeting', 'task', 'appointment', 'booking', 'inspection', 'maintenance',
      'training', 'customer_visit', 'property_stay', 'internal_event', 'custom_event'
    )
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'information', 'pending', 'confirmed', 'cancelled', 'awaiting_approval')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  created_by uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  related_module_key text,
  business_pack_key text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  all_day boolean not null default false,
  assignment_scope text not null default 'individual' check (
    assignment_scope in ('individual', 'team', 'department', 'resource')
  ),
  requires_approval boolean not null default false,
  recurrence_rule text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists organization_calendar_events_org_range_idx
  on public.organization_calendar_events (organization_id, starts_at, ends_at);

create index if not exists organization_calendar_events_org_status_idx
  on public.organization_calendar_events (organization_id, status, starts_at);

create index if not exists organization_calendar_events_domain_idx
  on public.organization_calendar_events (organization_id, domain_id, starts_at);

create index if not exists organization_calendar_events_pack_idx
  on public.organization_calendar_events (organization_id, business_pack_key, starts_at);

-- ---------------------------------------------------------------------------
-- 3. Event assignees, resource bookings, recurring, approvals, leave, sync
-- ---------------------------------------------------------------------------
create table if not exists public.organization_calendar_event_assignees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.organization_calendar_events (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  assignment_role text not null default 'participant' check (
    assignment_role in ('owner', 'participant', 'optional', 'reviewer')
  ),
  created_at timestamptz not null default now(),
  unique (organization_id, event_id, user_id)
);

create table if not exists public.organization_calendar_resource_bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.organization_calendar_events (id) on delete cascade,
  resource_id uuid not null references public.organization_calendar_resources (id) on delete cascade,
  booking_status text not null default 'confirmed' check (
    booking_status in ('pending', 'confirmed', 'cancelled', 'conflict_override')
  ),
  conflict_warning boolean not null default false,
  override_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, event_id, resource_id)
);

create table if not exists public.organization_calendar_recurring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  event_type text not null default 'meeting',
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
  recurrence_rule text,
  next_run_at timestamptz not null,
  last_run_at timestamptz,
  duration_minutes integer not null default 60,
  owner_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_calendar_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid not null references public.organization_calendar_events (id) on delete cascade,
  submitted_by uuid references public.users (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  review_note text,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.organization_calendar_leave (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  leave_type text not null check (
    leave_type in ('vacation', 'sick', 'training', 'business_travel', 'parental', 'other')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  notes text not null default '',
  reviewed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_calendar_sync_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  provider text not null check (
    provider in ('outlook', 'google', 'apple', 'microsoft365', 'teams', 'exchange')
  ),
  sync_mode text not null default 'read_only' check (
    sync_mode in ('one_way', 'two_way', 'read_only', 'write')
  ),
  connection_status text not null default 'pending' check (
    connection_status in ('pending', 'connected', 'disconnected', 'error')
  ),
  external_calendar_id text,
  last_synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_calendar_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid references public.organization_calendar_events (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  notification_type text not null check (
    notification_type in (
      'upcoming', 'changed', 'cancelled', 'approval_request', 'approval_decision', 'conflict', 'reminder'
    )
  ),
  summary text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_calendar_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_id uuid references public.organization_calendar_events (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_calendar_resources enable row level security;
alter table public.organization_calendar_events enable row level security;
alter table public.organization_calendar_event_assignees enable row level security;
alter table public.organization_calendar_resource_bookings enable row level security;
alter table public.organization_calendar_recurring enable row level security;
alter table public.organization_calendar_approvals enable row level security;
alter table public.organization_calendar_leave enable row level security;
alter table public.organization_calendar_sync_connections enable row level security;
alter table public.organization_calendar_notifications enable row level security;
alter table public.organization_calendar_audit_logs enable row level security;

revoke all on public.organization_calendar_resources from authenticated, anon;
revoke all on public.organization_calendar_events from authenticated, anon;
revoke all on public.organization_calendar_event_assignees from authenticated, anon;
revoke all on public.organization_calendar_resource_bookings from authenticated, anon;
revoke all on public.organization_calendar_recurring from authenticated, anon;
revoke all on public.organization_calendar_approvals from authenticated, anon;
revoke all on public.organization_calendar_leave from authenticated, anon;
revoke all on public.organization_calendar_sync_connections from authenticated, anon;
revoke all on public.organization_calendar_notifications from authenticated, anon;
revoke all on public.organization_calendar_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
do $$ begin
  if exists (select 1 from pg_proc where proname = '_rpm504_register_module_permissions') then
    perform public._rpm504_register_module_permissions('calendar');
  end if;
end $$;

create or replace function public._cal507_log(
  p_org_id uuid, p_event_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_calendar_audit_logs (
    organization_id, event_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_event_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._cal507_next_event_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_calendar_events where organization_id = p_org_id;
  return 'EVT-' || lpad(v_seq::text, 6, '0');
end; $$;

create or replace function public._cal507_notify(
  p_org_id uuid, p_event_id uuid, p_user_id uuid, p_type text, p_summary text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_user_id is null then return; end if;
  insert into public.organization_calendar_notifications (
    organization_id, event_id, user_id, notification_type, summary
  ) values (p_org_id, p_event_id, p_user_id, p_type, p_summary);
end; $$;

create or replace function public._cal507_event_json(p_event public.organization_calendar_events)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_event.id,
    'event_number', p_event.event_number,
    'title', p_event.title,
    'description', p_event.description,
    'event_type', p_event.event_type,
    'status', p_event.status,
    'owner_user_id', p_event.owner_user_id,
    'created_by', p_event.created_by,
    'department_id', p_event.department_id,
    'domain_id', p_event.domain_id,
    'related_module_key', p_event.related_module_key,
    'business_pack_key', p_event.business_pack_key,
    'location', p_event.location,
    'starts_at', p_event.starts_at,
    'ends_at', p_event.ends_at,
    'all_day', p_event.all_day,
    'requires_approval', p_event.requires_approval,
    'recurrence_rule', p_event.recurrence_rule,
    'created_at', p_event.created_at
  );
end; $$;

create or replace function public._cal507_detect_resource_conflict(
  p_org_id uuid, p_resource_id uuid, p_starts_at timestamptz, p_ends_at timestamptz, p_exclude_event_id uuid default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_conflict uuid;
begin
  select b.event_id into v_conflict
  from public.organization_calendar_resource_bookings b
  join public.organization_calendar_events e on e.id = b.event_id
  where b.organization_id = p_org_id
    and b.resource_id = p_resource_id
    and b.booking_status in ('pending', 'confirmed', 'conflict_override')
    and e.status not in ('cancelled')
    and (p_exclude_event_id is null or e.id <> p_exclude_event_id)
    and e.starts_at < p_ends_at and e.ends_at > p_starts_at
  limit 1;

  return jsonb_build_object('has_conflict', v_conflict is not null, 'conflicting_event_id', v_conflict);
end; $$;

create or replace function public._cal507_seed_resources(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_calendar_resources (organization_id, resource_key, name, resource_type, location)
  values
    (p_org_id, 'meeting_room_a', 'Meeting Room A', 'meeting_room', 'Main office'),
    (p_org_id, 'company_vehicle_2', 'Company Vehicle 2', 'vehicle', 'Parking'),
    (p_org_id, 'forklift_3', 'Forklift 3', 'equipment', 'Warehouse')
  on conflict (organization_id, resource_key) do nothing;
end; $$;

create or replace function public._cal507_seed_sync_connections(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare p text;
begin
  foreach p in array array['outlook', 'google', 'apple', 'microsoft365', 'teams']
  loop
    insert into public.organization_calendar_sync_connections (organization_id, provider, sync_mode, connection_status)
    select p_org_id, p, 'read_only', 'pending'
    where not exists (
      select 1 from public.organization_calendar_sync_connections s
      where s.organization_id = p_org_id and s.provider = p
    );
  end loop;
end; $$;

-- Business Pack calendar event entry point
create or replace function public.create_business_pack_calendar_event(
  p_pack_key text,
  p_title text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_description text default null,
  p_event_type text default 'booking',
  p_domain_id uuid default null,
  p_department_id uuid default null,
  p_resource_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_user_id uuid; v_row public.organization_calendar_events;
  v_conflict jsonb;
begin
  perform public._irp_require_permission('calendar.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.organization_calendar_events (
    organization_id, event_number, title, description, event_type, status,
    owner_user_id, created_by, starts_at, ends_at, domain_id, department_id,
    business_pack_key, related_module_key, metadata
  ) values (
    v_org_id, public._cal507_next_event_number(v_org_id), left(trim(p_title), 200),
    left(coalesce(p_description, ''), 1000), coalesce(p_event_type, 'booking'), 'scheduled',
    v_user_id, v_user_id, p_starts_at, p_ends_at, p_domain_id, p_department_id,
    p_pack_key, p_pack_key, coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('pack_event', true)
  ) returning * into v_row;

  if p_resource_id is not null then
    v_conflict := public._cal507_detect_resource_conflict(v_org_id, p_resource_id, p_starts_at, p_ends_at);
    insert into public.organization_calendar_resource_bookings (
      organization_id, event_id, resource_id, booking_status, conflict_warning, override_by
    ) values (
      v_org_id, v_row.id, p_resource_id,
      case when (v_conflict->>'has_conflict')::boolean then 'pending' else 'confirmed' end,
      coalesce((v_conflict->>'has_conflict')::boolean, false), null
    );
  end if;

  perform public._cal507_log(v_org_id, v_row.id, 'event_created', 'Business Pack calendar event created', jsonb_build_object('pack_key', p_pack_key));
  return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row), 'conflict', v_conflict);
end; $$;

-- Calendar Management Center
create or replace function public.get_calendar_management_center(
  p_range_start timestamptz default (now() - interval '7 days'),
  p_range_end timestamptz default (now() + interval '30 days')
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  perform public._irp_require_permission('calendar.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._cal507_seed_resources(v_org_id);
  perform public._cal507_seed_sync_connections(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify helps organizations organize time — Aipify does not replace people.',
    'structure', 'PLATFORM → APP → CALENDAR ENGINE → EMPLOYEES',
    'views', jsonb_build_array('day', 'week', 'month', 'quarter', 'year', 'agenda', 'timeline', 'resource'),
    'statuses', jsonb_build_array('scheduled', 'information', 'pending', 'confirmed', 'cancelled', 'awaiting_approval'),
    'event_types', jsonb_build_array(
      'meeting', 'task', 'appointment', 'booking', 'inspection', 'maintenance',
      'training', 'customer_visit', 'property_stay', 'internal_event', 'custom_event'
    ),
    'overview', jsonb_build_object(
      'upcoming', (select count(*) from public.organization_calendar_events where organization_id = v_org_id and starts_at >= now() and status not in ('cancelled')),
      'my_upcoming', (select count(*) from public.organization_calendar_event_assignees a join public.organization_calendar_events e on e.id = a.event_id where a.organization_id = v_org_id and a.user_id = v_user_id and e.starts_at >= now() and e.status not in ('cancelled')),
      'pending_approvals', (select count(*) from public.organization_calendar_approvals where organization_id = v_org_id and approval_status = 'pending'),
      'conflicts', (select count(*) from public.organization_calendar_resource_bookings where organization_id = v_org_id and conflict_warning = true),
      'leave_pending', (select count(*) from public.organization_calendar_leave where organization_id = v_org_id and status = 'pending')
    ),
    'my_calendar', coalesce((
      select jsonb_agg(public._cal507_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id
        and e.starts_at >= p_range_start and e.starts_at <= p_range_end
        and e.status not in ('cancelled')
        and (
          e.owner_user_id = v_user_id
          or exists (select 1 from public.organization_calendar_event_assignees a where a.event_id = e.id and a.user_id = v_user_id)
        )
      limit 100
    ), '[]'::jsonb),
    'team_calendar', coalesce((
      select jsonb_agg(public._cal507_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id
        and e.starts_at >= p_range_start and e.starts_at <= p_range_end
        and e.status not in ('cancelled')
        and e.assignment_scope in ('team', 'department')
      limit 100
    ), '[]'::jsonb),
    'department_calendar', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_id', d.id, 'department_name', d.name,
        'upcoming', (select count(*) from public.organization_calendar_events e where e.organization_id = v_org_id and e.department_id = d.id and e.starts_at >= now() and e.status not in ('cancelled'))
      ) order by d.name)
      from public.organization_departments d where d.organization_id = v_org_id and d.is_active = true
    ), '[]'::jsonb),
    'resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'resource_key', r.resource_key, 'name', r.name,
        'resource_type', r.resource_type, 'location', r.location, 'is_active', r.is_active
      ) order by r.name)
      from public.organization_calendar_resources r where r.organization_id = v_org_id and r.is_active = true
    ), '[]'::jsonb),
    'bookings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'booking_id', b.id, 'event_id', b.event_id, 'resource_id', b.resource_id,
        'resource_name', r.name, 'event_title', e.title, 'starts_at', e.starts_at,
        'booking_status', b.booking_status, 'conflict_warning', b.conflict_warning
      ) order by e.starts_at)
      from public.organization_calendar_resource_bookings b
      join public.organization_calendar_events e on e.id = b.event_id
      join public.organization_calendar_resources r on r.id = b.resource_id
      where b.organization_id = v_org_id and e.starts_at >= now()
      limit 50
    ), '[]'::jsonb),
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'approval_id', a.id, 'event_id', a.event_id, 'event_title', e.title,
        'approval_status', a.approval_status, 'starts_at', e.starts_at, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_calendar_approvals a
      join public.organization_calendar_events e on e.id = a.event_id
      where a.organization_id = v_org_id and a.approval_status = 'pending'
    ), '[]'::jsonb),
    'schedules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rc.id, 'title', rc.title, 'frequency', rc.frequency,
        'next_run_at', rc.next_run_at, 'active', rc.active
      ) order by rc.next_run_at)
      from public.organization_calendar_recurring rc
      where rc.organization_id = v_org_id and rc.active = true
    ), '[]'::jsonb),
    'leave', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'user_id', l.user_id, 'leave_type', l.leave_type,
        'starts_at', l.starts_at, 'ends_at', l.ends_at, 'status', l.status
      ) order by l.starts_at desc)
      from public.organization_calendar_leave l
      where l.organization_id = v_org_id and l.starts_at >= now() - interval '30 days'
      limit 30
    ), '[]'::jsonb),
    'sync_connections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'provider', s.provider, 'sync_mode', s.sync_mode,
        'connection_status', s.connection_status
      ) order by s.provider)
      from public.organization_calendar_sync_connections s
      where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'meeting_volume', (select count(*) from public.organization_calendar_events where organization_id = v_org_id and event_type = 'meeting' and starts_at >= now() - interval '30 days'),
      'booking_count', (select count(*) from public.organization_calendar_resource_bookings where organization_id = v_org_id),
      'resource_usage', coalesce((
        select jsonb_agg(jsonb_build_object('resource_name', r.name, 'bookings', cnt))
        from (
          select resource_id, count(*) cnt from public.organization_calendar_resource_bookings
          where organization_id = v_org_id group by resource_id
        ) s join public.organization_calendar_resources r on r.id = s.resource_id
      ), '[]'::jsonb),
      'by_pack', coalesce((
        select jsonb_agg(jsonb_build_object('pack_key', business_pack_key, 'count', cnt))
        from (select business_pack_key, count(*) cnt from public.organization_calendar_events where organization_id = v_org_id and business_pack_key is not null group by business_pack_key) p
      ), '[]'::jsonb)
    ),
    'manager_dashboard', jsonb_build_object(
      'team_availability_note', 'Team availability derived from events and approved leave — full sync when external calendars connect.',
      'pending_approvals', (select count(*) from public.organization_calendar_approvals where organization_id = v_org_id and approval_status = 'pending'),
      'upcoming_conflicts', (select count(*) from public.organization_calendar_resource_bookings where organization_id = v_org_id and conflict_warning = true)
    ),
    'personal_calendar_route', '/app/assistant/calendars'
  );
end; $$;

-- Actions
create or replace function public.perform_calendar_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_user_id uuid; v_event_id uuid; v_row public.organization_calendar_events;
  v_resource_id uuid; v_conflict jsonb; v_override boolean;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_event_id := nullif(p_payload->>'event_id', '')::uuid;
  v_resource_id := nullif(p_payload->>'resource_id', '')::uuid;
  v_override := coalesce((p_payload->>'override_conflict')::boolean, false);

  if p_action_type = 'create_event' then
    perform public._irp_require_permission('calendar.manage');
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
      coalesce(p_payload->>'status', 'scheduled'),
      coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, v_user_id),
      v_user_id,
      (p_payload->>'starts_at')::timestamptz,
      (p_payload->>'ends_at')::timestamptz,
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
    ) returning * into v_row;

    if nullif(p_payload->>'assigned_user_id', '')::uuid is not null then
      insert into public.organization_calendar_event_assignees (organization_id, event_id, user_id)
      values (v_org_id, v_row.id, nullif(p_payload->>'assigned_user_id', '')::uuid) on conflict do nothing;
      perform public._cal507_notify(v_org_id, v_row.id, nullif(p_payload->>'assigned_user_id', '')::uuid, 'upcoming', 'Event scheduled: ' || v_row.title);
    end if;

    if v_resource_id is not null then
      v_conflict := public._cal507_detect_resource_conflict(v_org_id, v_resource_id, v_row.starts_at, v_row.ends_at);
      if (v_conflict->>'has_conflict')::boolean and not v_override then
        perform public._cal507_notify(v_org_id, v_row.id, v_user_id, 'conflict', 'Resource conflict detected for ' || v_row.title);
      end if;
      insert into public.organization_calendar_resource_bookings (
        organization_id, event_id, resource_id, booking_status, conflict_warning, override_by
      ) values (
        v_org_id, v_row.id, v_resource_id,
        case when (v_conflict->>'has_conflict')::boolean and not v_override then 'pending'
             when (v_conflict->>'has_conflict')::boolean and v_override then 'conflict_override'
             else 'confirmed' end,
        coalesce((v_conflict->>'has_conflict')::boolean, false),
        case when v_override then v_user_id else null end
      );
    end if;

    perform public._cal507_log(v_org_id, v_row.id, 'event_created', 'Calendar event created', p_payload);
    return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row), 'conflict', v_conflict);

  elsif p_action_type = 'book_resource' then
    perform public._irp_require_permission('calendar.manage');
    v_conflict := public._cal507_detect_resource_conflict(v_org_id, v_resource_id, (p_payload->>'starts_at')::timestamptz, (p_payload->>'ends_at')::timestamptz, v_event_id);
    if (v_conflict->>'has_conflict')::boolean and not v_override then
      return jsonb_build_object('ok', false, 'error', 'resource_conflict', 'conflict', v_conflict);
    end if;
    return public.perform_calendar_management_action('create_event', p_payload);

  elsif p_action_type = 'cancel_event' then
    perform public._irp_require_permission('calendar.manage');
    update public.organization_calendar_events set status = 'cancelled', updated_at = now()
    where id = v_event_id and organization_id = v_org_id returning * into v_row;
    perform public._cal507_log(v_org_id, v_event_id, 'event_cancelled', 'Event cancelled', p_payload);
    return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row));

  elsif p_action_type = 'submit_for_approval' then
    perform public._irp_require_permission('calendar.manage');
    update public.organization_calendar_events set status = 'awaiting_approval', updated_at = now()
    where id = v_event_id and organization_id = v_org_id returning * into v_row;
    insert into public.organization_calendar_approvals (organization_id, event_id, submitted_by)
    values (v_org_id, v_event_id, v_user_id);
    perform public._cal507_log(v_org_id, v_event_id, 'approval_requested', 'Approval requested', p_payload);
    return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row));

  elsif p_action_type = 'approve_event' then
    perform public._irp_require_permission('calendar.approve');
    update public.organization_calendar_events set status = 'confirmed', updated_at = now()
    where id = v_event_id and organization_id = v_org_id returning * into v_row;
    update public.organization_calendar_approvals set approval_status = 'approved', reviewed_by = v_user_id, reviewed_at = now(),
      history = history || jsonb_build_array(jsonb_build_object('action', 'approved', 'at', now()))
    where event_id = v_event_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._cal507_notify(v_org_id, v_event_id, v_row.created_by, 'approval_decision', 'Event approved: ' || v_row.title);
    perform public._cal507_log(v_org_id, v_event_id, 'approval_granted', 'Event approved', p_payload);
    return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row));

  elsif p_action_type = 'reject_event' then
    perform public._irp_require_permission('calendar.approve');
    update public.organization_calendar_events set status = 'pending', updated_at = now()
    where id = v_event_id and organization_id = v_org_id returning * into v_row;
    update public.organization_calendar_approvals set approval_status = 'rejected', reviewed_by = v_user_id, reviewed_at = now(),
      review_note = p_payload->>'review_note',
      history = history || jsonb_build_array(jsonb_build_object('action', 'rejected', 'at', now()))
    where event_id = v_event_id and organization_id = v_org_id and approval_status = 'pending';
    perform public._cal507_notify(v_org_id, v_event_id, v_row.owner_user_id, 'approval_decision', 'Event rejected: ' || v_row.title);
    perform public._cal507_log(v_org_id, v_event_id, 'approval_rejected', 'Event rejected', p_payload);
    return jsonb_build_object('ok', true, 'event', public._cal507_event_json(v_row));

  elsif p_action_type = 'create_recurring' then
    perform public._irp_require_permission('calendar.manage');
    insert into public.organization_calendar_recurring (
      organization_id, title, event_type, frequency, recurrence_rule, next_run_at,
      duration_minutes, owner_user_id, department_id, domain_id, business_pack_key
    ) values (
      v_org_id, p_payload->>'title', coalesce(p_payload->>'event_type', 'meeting'),
      coalesce(p_payload->>'frequency', 'weekly'), p_payload->>'recurrence_rule',
      coalesce((p_payload->>'next_run_at')::timestamptz, now() + interval '7 days'),
      coalesce((p_payload->>'duration_minutes')::integer, 60),
      nullif(p_payload->>'owner_user_id', '')::uuid,
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key'
    );
    perform public._cal507_log(v_org_id, null, 'recurring_created', 'Recurring schedule created', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'request_leave' then
    perform public._irp_require_permission('calendar.view');
    insert into public.organization_calendar_leave (
      organization_id, user_id, leave_type, starts_at, ends_at, notes, status
    ) values (
      v_org_id, coalesce(nullif(p_payload->>'user_id', '')::uuid, v_user_id),
      coalesce(p_payload->>'leave_type', 'vacation'),
      (p_payload->>'starts_at')::timestamptz,
      (p_payload->>'ends_at')::timestamptz,
      coalesce(p_payload->>'notes', ''), 'pending'
    );
    perform public._cal507_log(v_org_id, null, 'leave_requested', 'Leave requested', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'approve_leave' then
    perform public._irp_require_permission('calendar.approve');
    update public.organization_calendar_leave set status = 'approved', reviewed_by = v_user_id, updated_at = now()
    where id = nullif(p_payload->>'leave_id', '')::uuid and organization_id = v_org_id;
    perform public._cal507_log(v_org_id, null, 'leave_approved', 'Leave approved', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

-- Companion context
create or replace function public.get_companion_calendar_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion coordinates time through the Calendar Engine — schedule, book, and check availability.',
    'my_upcoming', coalesce((
      select jsonb_agg(public._cal507_event_json(e) order by e.starts_at)
      from public.organization_calendar_events e
      where e.organization_id = v_org_id and e.owner_user_id = v_user_id
        and e.starts_at >= now() and e.status not in ('cancelled')
      limit 10
    ), '[]'::jsonb),
    'available_resources', coalesce((
      select jsonb_agg(jsonb_build_object('id', r.id, 'name', r.name, 'resource_type', r.resource_type))
      from public.organization_calendar_resources r
      where r.organization_id = v_org_id and r.is_active = true
    ), '[]'::jsonb),
    'conflicts', coalesce((
      select jsonb_agg(jsonb_build_object('event_id', b.event_id, 'resource_id', b.resource_id))
      from public.organization_calendar_resource_bookings b
      where b.organization_id = v_org_id and b.conflict_warning = true
      limit 5
    ), '[]'::jsonb),
    'calendar_route', '/app/calendar',
    'supported_intents', jsonb_build_array(
      'schedule_meeting', 'book_resource', 'show_availability', 'create_recurring', 'who_is_available'
    ),
    'external_sync', jsonb_build_object(
      'outlook', 'pending', 'google', 'pending', 'apple', 'pending',
      'microsoft365', 'pending', 'teams', 'pending'
    )
  );
exception when others then
  return jsonb_build_object('found', false);
end; $$;

-- Update module registry route
update public.aipify_module_registry
set route_href = '/app/calendar', updated_at = now()
where module_key = 'calendar';

do $$ begin
  if exists (select 1 from pg_proc where proname = '_dmn505_upsert_nav') then
    perform public._dmn505_upsert_nav(
      'calendar', 'Calendar', 'operations', 'calendar', '/app/calendar',
      'calendar', 'calendar.view', null, 'app', 5, false, false
    );
  end if;
end $$;

grant execute on function public.get_calendar_management_center(timestamptz, timestamptz) to authenticated;
grant execute on function public.perform_calendar_management_action(text, jsonb) to authenticated;
grant execute on function public.create_business_pack_calendar_event(text, text, timestamptz, timestamptz, text, text, uuid, uuid, uuid, jsonb) to authenticated;
grant execute on function public.get_companion_calendar_context() to authenticated;

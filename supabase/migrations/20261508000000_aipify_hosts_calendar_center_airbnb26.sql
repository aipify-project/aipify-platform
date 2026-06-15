-- Phase Airbnb 26 — Aipify Hosts Calendar Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostcal_* (engine), _ahostbp388_* (blueprint)

create table if not exists public.aipify_hosts_calendar_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'master_calendar' check (
    default_section in (
      'master_calendar', 'property_calendars', 'occupancy_overview',
      'availability_management', 'calendar_settings'
    )
  ),
  default_view text not null default 'month' check (
    default_view in ('day', 'week', 'month', 'agenda')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_calendar_center_settings enable row level security;
revoke all on public.aipify_hosts_calendar_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_calendar_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  event_key text not null,
  event_type text not null check (
    event_type in (
      'reservation', 'cleaning', 'maintenance', 'inspection',
      'owner_block', 'operational_block'
    )
  ),
  title text not null,
  start_date date not null,
  end_date date not null,
  event_status text not null default 'confirmed' check (
    event_status in ('pending', 'confirmed', 'blocked', 'completed', 'cancelled')
  ),
  assigned_users text,
  internal_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, event_key),
  check (end_date >= start_date)
);
create index if not exists aipify_hosts_calendar_events_tenant_idx
  on public.aipify_hosts_calendar_events (tenant_id, start_date, end_date);
create index if not exists aipify_hosts_calendar_events_property_idx
  on public.aipify_hosts_calendar_events (property_id, start_date);
alter table public.aipify_hosts_calendar_events enable row level security;
revoke all on public.aipify_hosts_calendar_events from authenticated, anon;

create table if not exists public.aipify_hosts_calendar_blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  block_key text not null,
  start_date date not null,
  end_date date not null,
  block_reason text,
  internal_notes text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, block_key),
  check (end_date >= start_date)
);
create index if not exists aipify_hosts_calendar_blocks_tenant_idx
  on public.aipify_hosts_calendar_blocks (tenant_id, is_active, start_date);
alter table public.aipify_hosts_calendar_blocks enable row level security;
revoke all on public.aipify_hosts_calendar_blocks from authenticated, anon;

create table if not exists public.aipify_hosts_calendar_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_calendar_center_events_tenant_idx
  on public.aipify_hosts_calendar_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_calendar_center_events enable row level security;
revoke all on public.aipify_hosts_calendar_center_events from authenticated, anon;

create or replace function public._ahostcal_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_calendar_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_calendar_center_settings;
begin
  insert into public.aipify_hosts_calendar_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_calendar_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostcal_actor_name()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select raw_user_meta_data ->> 'full_name' from auth.users where id = auth.uid()),
    (select raw_user_meta_data ->> 'name' from auth.users where id = auth.uid()),
    'Team member'
  ); $$;

create or replace function public._ahostcal_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_calendar_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'calendar_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostcal_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostcal_occupancy_status(
  p_property_id uuid, p_date date, p_tenant_id uuid
) returns text language plpgsql stable as $$
declare
  v_has_res boolean; v_arrival boolean; v_departure boolean;
  v_maint boolean; v_insp boolean; v_block boolean;
begin
  select exists (
    select 1 from public.aipify_hosts_calendar_events e
    where e.tenant_id = p_tenant_id and e.property_id = p_property_id
      and e.event_type = 'reservation' and e.event_status in ('confirmed', 'pending')
      and p_date between e.start_date and e.end_date
  ) into v_has_res;
  select exists (
    select 1 from public.aipify_hosts_calendar_events e
    where e.tenant_id = p_tenant_id and e.property_id = p_property_id
      and e.event_type = 'reservation' and e.event_status in ('confirmed', 'pending')
      and e.start_date = p_date
  ) into v_arrival;
  select exists (
    select 1 from public.aipify_hosts_calendar_events e
    where e.tenant_id = p_tenant_id and e.property_id = p_property_id
      and e.event_type = 'reservation' and e.event_status in ('confirmed', 'pending')
      and e.end_date = p_date
  ) into v_departure;
  select exists (
    select 1 from public.aipify_hosts_calendar_events e
    where e.tenant_id = p_tenant_id and e.property_id = p_property_id
      and e.event_type = 'maintenance' and e.event_status <> 'cancelled'
      and p_date between e.start_date and e.end_date
  ) into v_maint;
  select exists (
    select 1 from public.aipify_hosts_calendar_events e
    where e.tenant_id = p_tenant_id and e.property_id = p_property_id
      and e.event_type = 'inspection' and e.event_status <> 'cancelled'
      and p_date between e.start_date and e.end_date
  ) into v_insp;
  select exists (
    select 1 from public.aipify_hosts_calendar_blocks b
    where b.tenant_id = p_tenant_id and b.property_id = p_property_id and b.is_active
      and p_date between b.start_date and b.end_date
  ) into v_block;

  if v_arrival then return 'arrival_today'; end if;
  if v_departure then return 'departure_today'; end if;
  if v_maint then return 'maintenance_blocked'; end if;
  if v_insp then return 'inspection_blocked'; end if;
  if v_block then return 'unavailable'; end if;
  if v_has_res then return 'occupied'; end if;
  return 'available';
end; $$;

create or replace function public._ahostbp388_positioning() returns text language sql immutable as $$
  select 'Complete visibility into property availability and occupancy — master calendar, property schedules, and operational holds in one Calendar Center.'; $$;

create or replace function public._ahostbp388_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'master_calendar', 'label', 'Master Calendar'),
    jsonb_build_object('key', 'property_calendars', 'label', 'Property Calendars'),
    jsonb_build_object('key', 'occupancy_overview', 'label', 'Occupancy Overview'),
    jsonb_build_object('key', 'availability_management', 'label', 'Availability Management'),
    jsonb_build_object('key', 'calendar_settings', 'label', 'Calendar Settings')
  ); $$;

create or replace function public._ahostbp388_views() returns jsonb language sql immutable as $$
  select jsonb_build_array('day', 'week', 'month', 'agenda'); $$;

create or replace function public._ahostbp388_event_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'reservation', 'cleaning', 'maintenance', 'inspection', 'owner_block', 'operational_block'
  ); $$;

create or replace function public._ahostbp388_occupancy_statuses() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'available', 'occupied', 'arrival_today', 'departure_today',
    'maintenance_blocked', 'inspection_blocked', 'unavailable'
  ); $$;

create or replace function public._ahostcal_event_row(p_e public.aipify_hosts_calendar_events, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_e.id,
    'event_key', p_e.event_key,
    'event_type', p_e.event_type,
    'title', p_e.title,
    'property_id', p_e.property_id,
    'property', coalesce(p_property, 'All properties'),
    'start_date', p_e.start_date::text,
    'end_date', p_e.end_date::text,
    'status', p_e.event_status,
    'assigned_users', coalesce(p_e.assigned_users, '—'),
    'internal_notes', coalesce(p_e.internal_notes, ''),
    'occupancy_status', public._ahostcal_occupancy_status(p_e.property_id, p_e.start_date, p_e.tenant_id)
  ); $$;

create or replace function public._ahostcal_block_row(p_b public.aipify_hosts_calendar_blocks, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_b.id,
    'block_key', p_b.block_key,
    'property_id', p_b.property_id,
    'property', coalesce(p_property, 'All properties'),
    'start_date', p_b.start_date::text,
    'end_date', p_b.end_date::text,
    'block_reason', coalesce(p_b.block_reason, 'Operational hold'),
    'internal_notes', coalesce(p_b.internal_notes, ''),
    'is_active', p_b.is_active
  ); $$;

create or replace function public._ahostcal_seed_calendar(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid; v_prop2 uuid;
begin
  if exists (select 1 from public.aipify_hosts_calendar_events where tenant_id = p_tenant_id limit 1) then
    return;
  end if;
  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status <> 'archived' order by display_name limit 1;
  select id into v_prop2 from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status <> 'archived' and id <> v_prop order by display_name limit 1;

  if v_prop is null then return; end if;

  insert into public.aipify_hosts_calendar_events (
    tenant_id, property_id, event_key, event_type, title, start_date, end_date,
    event_status, assigned_users
  ) values
    (p_tenant_id, v_prop, 'cal_res_001', 'reservation', 'Guest stay — Andersen',
      current_date + 2, current_date + 5, 'confirmed', 'Front Desk'),
    (p_tenant_id, v_prop, 'cal_cln_001', 'cleaning', 'Turnover cleaning',
      current_date + 5, current_date + 5, 'confirmed', 'CleanCo Team'),
    (p_tenant_id, v_prop, 'cal_mnt_001', 'maintenance', 'HVAC service',
      current_date + 8, current_date + 9, 'confirmed', 'Maintenance Vendor'),
    (p_tenant_id, v_prop, 'cal_insp_001', 'inspection', 'Quarterly quality inspection',
      current_date - 14, current_date - 14, 'completed', 'Quality Lead'),
    (p_tenant_id, coalesce(v_prop2, v_prop), 'cal_res_002', 'reservation', 'Guest stay — Berg',
      current_date, current_date + 3, 'confirmed', 'Front Desk');

  insert into public.aipify_hosts_calendar_blocks (
    tenant_id, property_id, block_key, start_date, end_date, block_reason, internal_notes
  ) values
    (p_tenant_id, v_prop, 'blk_001', current_date + 12, current_date + 14,
      'Owner block', 'Owner personal use — do not book');
end; $$;

create or replace function public._ahostcal_dashboard_stats(p_tenant_id uuid)
returns jsonb language plpgsql stable as $$
declare
  v_props int; v_days int := 30; v_occupied int; v_blocked int; v_available int;
  v_arrivals int; v_departures int;
begin
  select count(*)::int into v_props from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status <> 'archived';
  if v_props = 0 then
    return jsonb_build_object(
      'occupancy_rate', 0, 'available_nights', 0, 'blocked_nights', 0,
      'upcoming_arrivals', 0, 'upcoming_departures', 0, 'property_count', 0
    );
  end if;

  select count(*)::int into v_occupied
  from generate_series(current_date, current_date + v_days - 1, '1 day'::interval) d(day)
  cross join public.aipify_hosts_properties p
  where p.tenant_id = p_tenant_id and p.status <> 'archived'
    and public._ahostcal_occupancy_status(p.id, d.day::date, p_tenant_id) in ('occupied', 'arrival_today', 'departure_today');

  select count(*)::int into v_blocked
  from generate_series(current_date, current_date + v_days - 1, '1 day'::interval) d(day)
  cross join public.aipify_hosts_properties p
  where p.tenant_id = p_tenant_id and p.status <> 'archived'
    and public._ahostcal_occupancy_status(p.id, d.day::date, p_tenant_id) in ('maintenance_blocked', 'inspection_blocked', 'unavailable');

  v_available := (v_props * v_days) - v_occupied - v_blocked;
  if v_available < 0 then v_available := 0; end if;

  select count(*)::int into v_arrivals from public.aipify_hosts_calendar_events
  where tenant_id = p_tenant_id and event_type = 'reservation'
    and start_date between current_date and current_date + 14
    and event_status in ('confirmed', 'pending');

  select count(*)::int into v_departures from public.aipify_hosts_calendar_events
  where tenant_id = p_tenant_id and event_type = 'reservation'
    and end_date between current_date and current_date + 14
    and event_status in ('confirmed', 'pending');

  return jsonb_build_object(
    'occupancy_rate', case when v_props * v_days > 0
      then round((v_occupied::numeric / (v_props * v_days)::numeric) * 100, 1) else 0 end,
    'available_nights', v_available,
    'blocked_nights', v_blocked,
    'upcoming_arrivals', v_arrivals,
    'upcoming_departures', v_departures,
    'property_count', v_props
  );
end; $$;

create or replace function public._ahostcal_property_occupancy(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'property_id', p.id,
    'property_name', p.display_name,
    'occupancy_status', public._ahostcal_occupancy_status(p.id, current_date, p_tenant_id),
    'upcoming_arrivals', (
      select count(*)::int from public.aipify_hosts_calendar_events e
      where e.property_id = p.id and e.event_type = 'reservation'
        and e.start_date >= current_date and e.event_status in ('confirmed', 'pending')
    ),
    'upcoming_departures', (
      select count(*)::int from public.aipify_hosts_calendar_events e
      where e.property_id = p.id and e.event_type = 'reservation'
        and e.end_date >= current_date and e.event_status in ('confirmed', 'pending')
    )
  ) order by p.display_name), '[]'::jsonb)
  from public.aipify_hosts_properties p
  where p.tenant_id = p_tenant_id and p.status <> 'archived'; $$;

create or replace function public._ahostcal_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select e1.id, e1.title, p.display_name from public.aipify_hosts_calendar_events e1
    join public.aipify_hosts_calendar_events e2 on e1.property_id = e2.property_id
      and e1.id <> e2.id and e1.tenant_id = e2.tenant_id
    join public.aipify_hosts_properties p on p.id = e1.property_id
    where e1.tenant_id = p_tenant_id
      and e1.event_status in ('confirmed', 'pending') and e2.event_status in ('confirmed', 'pending')
      and e1.start_date <= e2.end_date and e1.end_date >= e2.start_date
      and e1.event_type = 'reservation' and e2.event_type = 'reservation'
  loop
    perform public._ahostcal_push_notification(p_tenant_id, 'cal_dbl_' || r.id::text, 'critical',
      'Double-booking risk detected', r.display_name || ': ' || r.title);
  end loop;

  for r in
    select e.id, e.title, p.display_name from public.aipify_hosts_calendar_events e
    join public.aipify_hosts_properties p on p.id = e.property_id
    where e.tenant_id = p_tenant_id and e.event_type = 'reservation'
      and e.start_date between current_date and current_date + 3
      and e.event_status in ('confirmed', 'pending')
      and not exists (
        select 1 from public.aipify_hosts_calendar_events c
        where c.tenant_id = p_tenant_id and c.property_id = e.property_id
          and c.event_type = 'cleaning' and c.start_date <= e.start_date
          and c.event_status <> 'cancelled'
      )
  loop
    perform public._ahostcal_push_notification(p_tenant_id, 'cal_cln_' || r.id::text, 'high',
      'Cleaning not scheduled before arrival', r.display_name || ': ' || r.title);
  end loop;

  for r in
    select e.id, e.title, p.display_name from public.aipify_hosts_calendar_events e
    join public.aipify_hosts_calendar_events m on m.property_id = e.property_id
      and m.event_type = 'maintenance' and m.event_status <> 'cancelled'
      and e.start_date <= m.end_date and e.end_date >= m.start_date
    join public.aipify_hosts_properties p on p.id = e.property_id
    where e.tenant_id = p_tenant_id and e.event_type = 'reservation'
      and e.event_status in ('confirmed', 'pending')
  loop
    perform public._ahostcal_push_notification(p_tenant_id, 'cal_mnt_' || r.id::text, 'high',
      'Maintenance overlapping reservation', r.display_name || ': ' || r.title);
  end loop;

  for r in
    select e.id, e.title, p.display_name from public.aipify_hosts_calendar_events e
    join public.aipify_hosts_properties p on p.id = e.property_id
    where e.tenant_id = p_tenant_id and e.event_type = 'inspection'
      and e.event_status = 'pending' and e.start_date < current_date
  loop
    perform public._ahostcal_push_notification(p_tenant_id, 'cal_insp_' || r.id::text, 'important',
      'Inspection overdue', r.display_name || ': ' || r.title);
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_calendar_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_cc public.aipify_hosts_calendar_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_cc := public._ahostcal_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp388_positioning(),
    'route', '/app/aipify-hosts/calendar',
    'stats', public._ahostcal_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_calendar_center_dashboard(
  p_section text default 'master_calendar',
  p_view text default 'month',
  p_property_id uuid default null,
  p_team_member text default null,
  p_event_type text default null,
  p_date_from date default null,
  p_date_to date default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_cc public.aipify_hosts_calendar_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_view text; v_from date; v_to date; v_events jsonb; v_blocks jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_cc := public._ahostcal_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_cc.default_section, 'master_calendar');
  v_view := coalesce(nullif(trim(p_view), ''), v_cc.default_view, 'month');
  v_from := coalesce(p_date_from, current_date - 7);
  v_to := coalesce(p_date_to, current_date + 60);
  perform public._ahostcal_seed_calendar(v_tenant_id);
  perform public._ahostcal_check_notifications(v_tenant_id);
  perform public._ahostcal_log_event(v_tenant_id, 'dashboard_view', 'Calendar Center viewed',
    jsonb_build_object('section', v_section, 'view', v_view));

  select coalesce(jsonb_agg(public._ahostcal_event_row(e, p.display_name) order by e.start_date), '[]'::jsonb)
  into v_events
  from public.aipify_hosts_calendar_events e
  left join public.aipify_hosts_properties p on p.id = e.property_id
  where e.tenant_id = v_tenant_id
    and e.start_date <= v_to and e.end_date >= v_from
    and (p_property_id is null or e.property_id = p_property_id)
    and (p_team_member is null or e.assigned_users ilike '%' || p_team_member || '%')
    and (p_event_type is null or e.event_type = p_event_type)
    and (v_section <> 'property_calendars' or e.property_id is not null);

  select coalesce(jsonb_agg(public._ahostcal_block_row(b, p.display_name) order by b.start_date), '[]'::jsonb)
  into v_blocks
  from public.aipify_hosts_calendar_blocks b
  left join public.aipify_hosts_properties p on p.id = b.property_id
  where b.tenant_id = v_tenant_id and b.is_active
    and b.start_date <= v_to and b.end_date >= v_from
    and (p_property_id is null or b.property_id = p_property_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'active_view', v_view,
    'positioning', public._ahostbp388_positioning(),
    'governance', jsonb_build_object(
      'audit_calendar_changes', true,
      'audit_availability_updates', true,
      'audit_blocked_periods', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp388_sections(),
    'calendar_views', public._ahostbp388_views(),
    'event_types', public._ahostbp388_event_types(),
    'occupancy_statuses', public._ahostbp388_occupancy_statuses(),
    'event_statuses', jsonb_build_array('pending', 'confirmed', 'blocked', 'completed', 'cancelled'),
    'stats', public._ahostcal_dashboard_stats(v_tenant_id),
    'property_occupancy', public._ahostcal_property_occupancy(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'team_members', (
      select coalesce(jsonb_agg(distinct e.assigned_users), '[]'::jsonb)
      from public.aipify_hosts_calendar_events e
      where e.tenant_id = v_tenant_id and e.assigned_users is not null and e.assigned_users <> ''
    ),
    'calendar_events', v_events,
    'blocked_periods', v_blocks,
    'date_range', jsonb_build_object('from', v_from::text, 'to', v_to::text),
    'calendar_settings', jsonb_build_object(
      'default_view', v_cc.default_view,
      'default_section', v_cc.default_section
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 26 — Calendar Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_26_CALENDAR_CENTER.text',
      'route', '/app/aipify-hosts/calendar'
    )
  );
end; $$;

create or replace function public.create_aipify_hosts_calendar_event(
  p_title text,
  p_event_type text,
  p_start_date date,
  p_end_date date,
  p_property_id uuid default null,
  p_assigned_users text default null,
  p_internal_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'Title required'; end if;
  if p_end_date < p_start_date then raise exception 'End date must be on or after start date'; end if;
  v_key := 'cal_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_calendar_events (
    tenant_id, property_id, event_key, event_type, title, start_date, end_date,
    assigned_users, internal_notes
  ) values (
    v_tenant_id, p_property_id, v_key, p_event_type, trim(p_title),
    p_start_date, p_end_date, p_assigned_users, p_internal_notes
  ) returning id into v_id;
  perform public._ahostcal_log_event(v_tenant_id, 'event_created', 'Calendar event created',
    jsonb_build_object('event_id', v_id, 'event_type', p_event_type));
  return jsonb_build_object('success', true, 'event_id', v_id);
end; $$;

create or replace function public.perform_aipify_hosts_calendar_action(
  p_action_type text,
  p_property_id uuid default null,
  p_start_date date default null,
  p_end_date date default null,
  p_block_id uuid default null,
  p_event_id uuid default null,
  p_notes text default null,
  p_reason text default null,
  p_default_view text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_key text; v_id uuid; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'block_dates' then
    if p_start_date is null or p_end_date is null then raise exception 'Dates required'; end if;
    v_key := 'blk_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_hosts_calendar_blocks (
      tenant_id, property_id, block_key, start_date, end_date, block_reason, internal_notes
    ) values (
      v_tenant_id, p_property_id, v_key, p_start_date, p_end_date,
      coalesce(p_reason, 'Blocked period'), p_notes
    ) returning id into v_id;
    perform public._ahostcal_log_event(v_tenant_id, 'block_created', 'Dates blocked',
      jsonb_build_object('block_id', v_id));
    v_summary := 'Dates blocked';
  elsif p_action_type = 'unblock_dates' then
    if p_block_id is null then raise exception 'block_id required'; end if;
    update public.aipify_hosts_calendar_blocks set is_active = false, updated_at = now()
    where id = p_block_id and tenant_id = v_tenant_id;
    perform public._ahostcal_log_event(v_tenant_id, 'block_removed', 'Dates unblocked',
      jsonb_build_object('block_id', p_block_id));
    v_summary := 'Dates unblocked';
  elsif p_action_type = 'create_operational_hold' then
    if p_start_date is null or p_end_date is null then raise exception 'Dates required'; end if;
    v_key := 'cal_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_hosts_calendar_events (
      tenant_id, property_id, event_key, event_type, title, start_date, end_date,
      event_status, internal_notes
    ) values (
      v_tenant_id, p_property_id, v_key, 'operational_block', 'Operational hold',
      p_start_date, p_end_date, 'blocked', coalesce(p_notes, p_reason)
    ) returning id into v_id;
    perform public._ahostcal_log_event(v_tenant_id, 'hold_created', 'Operational hold created',
      jsonb_build_object('event_id', v_id));
    v_summary := 'Operational hold created';
  elsif p_action_type = 'add_internal_notes' then
    if p_event_id is null then raise exception 'event_id required'; end if;
    update public.aipify_hosts_calendar_events set
      internal_notes = coalesce(p_notes, internal_notes), updated_at = now()
    where id = p_event_id and tenant_id = v_tenant_id;
    perform public._ahostcal_log_event(v_tenant_id, 'notes_updated', 'Internal notes updated',
      jsonb_build_object('event_id', p_event_id));
    v_summary := 'Internal notes updated';
  elsif p_action_type = 'update_default_view' then
    if p_default_view is null then raise exception 'default_view required'; end if;
    update public.aipify_hosts_calendar_center_settings set default_view = p_default_view, updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._ahostcal_log_event(v_tenant_id, 'settings_updated', 'Calendar view updated',
      jsonb_build_object('default_view', p_default_view));
    v_summary := 'Calendar settings updated';
  else
    raise exception 'Invalid action type';
  end if;

  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_calendar_center_knowledge_airbnb26()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-calendar', 'Hosts Calendar Center',
    'Calendar management, availability, occupancy planning, and operational scheduling.', 322
  );
  perform public._ahostkc_seed_article('aipify-hosts-calendar', 'calendar-management-best-practices', 'Calendar management best practices',
    'Keep master and property calendars synchronized with reservations, cleaning, maintenance, and inspections.');
  perform public._ahostkc_seed_article('aipify-hosts-calendar', 'managing-availability', 'Managing availability',
    'Block and unblock dates deliberately; document operational holds with clear internal notes.');
  perform public._ahostkc_seed_article('aipify-hosts-calendar', 'occupancy-planning', 'Occupancy planning',
    'Review occupancy rate, available nights, and upcoming arrivals to plan staffing and vendor schedules.');
  perform public._ahostkc_seed_article('aipify-hosts-calendar', 'operational-scheduling-standards', 'Operational scheduling standards',
    'Schedule cleaning before arrivals and avoid maintenance overlaps with confirmed reservations.');
end; $$;

select public.seed_aipify_hosts_calendar_center_knowledge_airbnb26();

grant execute on function public.get_aipify_hosts_calendar_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_calendar_center_dashboard(text, text, uuid, text, text, date, date, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_calendar_event(text, text, date, date, uuid, text, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_calendar_action(text, uuid, date, date, uuid, uuid, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_calendar_center_knowledge_airbnb26() to authenticated;

-- Phase Airbnb 35 — Aipify Hosts Booking Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostbkg_* (engine), _ahostbp397_* (blueprint)

create table if not exists public.aipify_hosts_booking_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'upcoming_bookings' check (
    default_section in (
      'upcoming_bookings', 'active_stays', 'past_bookings',
      'cancellations', 'booking_reports'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_booking_center_settings enable row level security;
revoke all on public.aipify_hosts_booking_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_booking_reservations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  reservation_reference text not null,
  guest_name text not null,
  check_in_date date not null,
  check_out_date date not null,
  number_of_guests int not null default 1 check (number_of_guests > 0),
  booking_status text not null default 'pending' check (
    booking_status in (
      'inquiry', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'
    )
  ),
  booking_channel text,
  internal_notes text,
  guest_profile_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reservation_reference)
);
create index if not exists aipify_hosts_booking_reservations_tenant_idx
  on public.aipify_hosts_booking_reservations (tenant_id, booking_status, check_in_date, check_out_date);
alter table public.aipify_hosts_booking_reservations enable row level security;
revoke all on public.aipify_hosts_booking_reservations from authenticated, anon;

create table if not exists public.aipify_hosts_booking_cancellations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reservation_id uuid references public.aipify_hosts_booking_reservations (id) on delete set null,
  reservation_reference text not null,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  cancellation_date date not null default current_date,
  cancellation_reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_booking_cancellations_tenant_idx
  on public.aipify_hosts_booking_cancellations (tenant_id, cancellation_date desc);
alter table public.aipify_hosts_booking_cancellations enable row level security;
revoke all on public.aipify_hosts_booking_cancellations from authenticated, anon;

create table if not exists public.aipify_hosts_booking_availability_blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  block_key text not null,
  block_type text not null check (block_type in ('operational', 'owner', 'maintenance')),
  block_start date not null,
  block_end date not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, block_key)
);
create index if not exists aipify_hosts_booking_availability_blocks_tenant_idx
  on public.aipify_hosts_booking_availability_blocks (tenant_id, property_id, block_start, block_end);
alter table public.aipify_hosts_booking_availability_blocks enable row level security;
revoke all on public.aipify_hosts_booking_availability_blocks from authenticated, anon;

create table if not exists public.aipify_hosts_booking_timeline_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reservation_id uuid not null references public.aipify_hosts_booking_reservations (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'reservation_created', 'reservation_confirmed', 'guest_checked_in',
      'guest_checked_out', 'reservation_closed'
    )
  ),
  summary text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_booking_timeline_tenant_idx
  on public.aipify_hosts_booking_timeline_events (tenant_id, reservation_id, occurred_at desc);
alter table public.aipify_hosts_booking_timeline_events enable row level security;
revoke all on public.aipify_hosts_booking_timeline_events from authenticated, anon;

create table if not exists public.aipify_hosts_booking_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_booking_center_events_tenant_idx
  on public.aipify_hosts_booking_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_booking_center_events enable row level security;
revoke all on public.aipify_hosts_booking_center_events from authenticated, anon;

create or replace function public._ahostbkg_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_booking_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_booking_center_settings;
begin
  insert into public.aipify_hosts_booking_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_booking_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostbkg_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_booking_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'booking_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbkg_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'booking_updates', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp397_positioning() returns text language sql immutable as $$
  select 'Centralized reservation visibility — upcoming bookings, active stays, cancellations, and availability validation in one Booking Center.'; $$;

create or replace function public._ahostbp397_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'upcoming_bookings', 'label', 'Upcoming Bookings'),
    jsonb_build_object('key', 'active_stays', 'label', 'Active Stays'),
    jsonb_build_object('key', 'past_bookings', 'label', 'Past Bookings'),
    jsonb_build_object('key', 'cancellations', 'label', 'Cancellations'),
    jsonb_build_object('key', 'booking_reports', 'label', 'Booking Reports')
  ); $$;

create or replace function public._ahostbkg_reservation_row(p_r public.aipify_hosts_booking_reservations, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_r.id,
    'reservation_reference', p_r.reservation_reference,
    'guest_name', p_r.guest_name,
    'property_id', p_r.property_id,
    'property', coalesce(p_property, '—'),
    'check_in_date', p_r.check_in_date::text,
    'check_out_date', p_r.check_out_date::text,
    'number_of_guests', p_r.number_of_guests,
    'booking_status', p_r.booking_status,
    'booking_channel', coalesce(p_r.booking_channel, ''),
    'internal_notes', coalesce(p_r.internal_notes, ''),
    'guest_profile_key', coalesce(p_r.guest_profile_key, ''),
    'is_arrival_today', p_r.check_in_date = current_date,
    'is_departure_today', p_r.check_out_date = current_date,
    'nights', greatest(1, (p_r.check_out_date - p_r.check_in_date))
  ); $$;

create or replace function public._ahostbkg_cancellation_row(
  p_c public.aipify_hosts_booking_cancellations, p_property text
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id,
    'reservation_id', p_c.reservation_id,
    'reservation_reference', p_c.reservation_reference,
    'property_id', p_c.property_id,
    'property', coalesce(p_property, '—'),
    'cancellation_date', p_c.cancellation_date::text,
    'cancellation_reason', p_c.cancellation_reason
  ); $$;

create or replace function public._ahostbkg_timeline_row(p_t public.aipify_hosts_booking_timeline_events)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_t.id, 'reservation_id', p_t.reservation_id,
    'event_type', p_t.event_type, 'summary', coalesce(p_t.summary, ''),
    'occurred_at', p_t.occurred_at::text
  ); $$;

create or replace function public._ahostbkg_add_timeline(
  p_tenant_id uuid, p_reservation_id uuid, p_event_type text, p_summary text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_booking_timeline_events (
    tenant_id, reservation_id, event_type, summary, occurred_at
  ) values (p_tenant_id, p_reservation_id, p_event_type, p_summary, now());
end; $$;

create or replace function public._ahostbkg_validate_availability(
  p_tenant_id uuid, p_property_id uuid, p_check_in date, p_check_out date, p_exclude_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_conflicts jsonb := '[]'::jsonb;
  v_available boolean := true;
begin
  if p_property_id is null then
    return jsonb_build_object('available', true, 'conflicts', '[]'::jsonb, 'checks', jsonb_build_object('property', false));
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'type', 'reservation', 'reference', r.reservation_reference,
    'start', r.check_in_date::text, 'end', r.check_out_date::text
  )), '[]'::jsonb) into v_conflicts
  from public.aipify_hosts_booking_reservations r
  where r.tenant_id = p_tenant_id and r.property_id = p_property_id
    and r.booking_status not in ('cancelled', 'checked_out')
    and (p_exclude_id is null or r.id <> p_exclude_id)
    and r.check_in_date < p_check_out and r.check_out_date > p_check_in;

  if jsonb_array_length(v_conflicts) > 0 then v_available := false; end if;

  v_conflicts := v_conflicts || coalesce((
    select jsonb_agg(jsonb_build_object(
      'type', b.block_type || '_block', 'reference', b.block_key,
      'start', b.block_start::text, 'end', b.block_end::text, 'summary', coalesce(b.summary, '')
    ))
    from public.aipify_hosts_booking_availability_blocks b
    where b.tenant_id = p_tenant_id and b.property_id = p_property_id
      and b.block_start < p_check_out and b.block_end > p_check_in
  ), '[]'::jsonb);

  if exists (
    select 1 from public.aipify_hosts_booking_availability_blocks b
    where b.tenant_id = p_tenant_id and b.property_id = p_property_id
      and b.block_start < p_check_out and b.block_end > p_check_in
  ) then v_available := false; end if;

  return jsonb_build_object(
    'available', v_available,
    'conflicts', v_conflicts,
    'checks', jsonb_build_object(
      'property_availability', v_available,
      'operational_blocks', exists (
        select 1 from public.aipify_hosts_booking_availability_blocks
        where tenant_id = p_tenant_id and property_id = p_property_id
          and block_type = 'operational' and block_start < p_check_out and block_end > p_check_in
      ),
      'owner_blocks', exists (
        select 1 from public.aipify_hosts_booking_availability_blocks
        where tenant_id = p_tenant_id and property_id = p_property_id
          and block_type = 'owner' and block_start < p_check_out and block_end > p_check_in
      ),
      'maintenance_blocks', exists (
        select 1 from public.aipify_hosts_booking_availability_blocks
        where tenant_id = p_tenant_id and property_id = p_property_id
          and block_type = 'maintenance' and block_start < p_check_out and block_end > p_check_in
      )
    )
  );
end; $$;

create or replace function public._ahostbkg_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'arrivals_today', (
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and check_in_date = current_date
        and booking_status in ('confirmed', 'pending', 'checked_in')
    ),
    'departures_today', (
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and check_out_date = current_date
        and booking_status in ('checked_in', 'confirmed')
    ),
    'upcoming_reservations', (
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and check_in_date between current_date and current_date + 7
        and booking_status in ('inquiry', 'pending', 'confirmed')
    ),
    'recent_cancellations', (
      select count(*)::int from public.aipify_hosts_booking_cancellations
      where tenant_id = p_tenant_id and cancellation_date >= current_date - 30
    ),
    'active_stays_count', (
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and booking_status = 'checked_in'
    ),
    'confirmed_upcoming', (
      select count(*)::int from public.aipify_hosts_booking_reservations
      where tenant_id = p_tenant_id and booking_status = 'confirmed' and check_in_date >= current_date
    )
  ); $$;

create or replace function public._ahostbkg_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid; v_res uuid;
begin
  if exists (select 1 from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id limit 1) then return; end if;

  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active' order by created_at limit 1;

  insert into public.aipify_hosts_booking_availability_blocks (
    tenant_id, property_id, block_key, block_type, block_start, block_end, summary
  ) values
    (p_tenant_id, v_prop, 'blk_maint_001', 'maintenance', current_date + 20, current_date + 22, 'HVAC service window'),
    (p_tenant_id, v_prop, 'blk_owner_001', 'owner', current_date + 45, current_date + 50, 'Owner personal stay')
  on conflict (tenant_id, block_key) do nothing;

  insert into public.aipify_hosts_booking_reservations (
    tenant_id, property_id, reservation_reference, guest_name,
    check_in_date, check_out_date, number_of_guests, booking_status,
    booking_channel, internal_notes, guest_profile_key
  ) values
    (p_tenant_id, v_prop, 'RES-2026-001', 'Anna Lindstrom',
      current_date, current_date + 3, 2, 'checked_in', 'Airbnb', 'VIP repeat guest — welcome basket prepared.', 'guest_001'),
    (p_tenant_id, v_prop, 'RES-2026-002', 'James O''Connor',
      current_date + 1, current_date + 5, 4, 'confirmed', 'Booking.com', 'Family with children — extra towels requested.', 'guest_002'),
    (p_tenant_id, v_prop, 'RES-2026-003', 'Sofia Hansen',
      current_date + 7, current_date + 10, 2, 'pending', 'Direct', null, null),
    (p_tenant_id, v_prop, 'RES-2026-004', 'Erik Berg',
      current_date - 14, current_date - 10, 2, 'checked_out', 'Vrbo', 'Smooth stay — left positive review.', 'guest_003'),
    (p_tenant_id, v_prop, 'RES-2026-005', 'Maria Santos',
      current_date + 14, current_date + 18, 3, 'inquiry', 'Airbnb', null, null),
    (p_tenant_id, v_prop, 'RES-2026-006', 'Thomas Wright',
      current_date + 4, current_date + 8, 2, 'cancelled', 'Expedia', null, null)
  on conflict (tenant_id, reservation_reference) do nothing;

  insert into public.aipify_hosts_booking_cancellations (
    tenant_id, reservation_id, reservation_reference, property_id, cancellation_date, cancellation_reason
  )
  select p_tenant_id, r.id, r.reservation_reference, r.property_id, current_date - 2, 'Guest travel plans changed'
  from public.aipify_hosts_booking_reservations r
  where r.tenant_id = p_tenant_id and r.reservation_reference = 'RES-2026-006'
  on conflict do nothing;

  for v_res in select id from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id
  loop
    perform public._ahostbkg_add_timeline(p_tenant_id, v_res, 'reservation_created', 'Reservation created');
  end loop;

  perform public._ahostbkg_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id and reservation_reference = 'RES-2026-001'),
    'reservation_confirmed', 'Reservation confirmed');
  perform public._ahostbkg_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id and reservation_reference = 'RES-2026-001'),
    'guest_checked_in', 'Guest checked in');
  perform public._ahostbkg_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id and reservation_reference = 'RES-2026-004'),
    'guest_checked_out', 'Guest checked out');
  perform public._ahostbkg_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_booking_reservations where tenant_id = p_tenant_id and reservation_reference = 'RES-2026-004'),
    'reservation_closed', 'Reservation closed');
end; $$;

create or replace function public.get_aipify_hosts_booking_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hosts public.aipify_hosts_settings; v_stats jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostbkg_ensure_settings(v_tenant_id);
  v_stats := public._ahostbkg_dashboard_stats(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'enabled', v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'arrivals_today', v_stats->'arrivals_today',
    'upcoming_reservations', v_stats->'upcoming_reservations',
    'philosophy', public._ahostbp397_positioning()
  );
end; $$;

create or replace function public.get_aipify_hosts_booking_center_dashboard(
  p_section text default 'upcoming_bookings',
  p_property_id uuid default null,
  p_status text default null,
  p_date_from date default null,
  p_date_to date default null,
  p_guest_name text default null,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_bc public.aipify_hosts_booking_center_settings;
  v_hosts public.aipify_hosts_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'upcoming_bookings');
  v_reservations jsonb := '[]'::jsonb;
  v_cancellations jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_reports jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_bc := public._ahostbkg_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostbkg_seed_demo(v_tenant_id);

  select coalesce(jsonb_agg(
    public._ahostbkg_reservation_row(r, p.display_name) order by r.check_in_date, r.guest_name
  ), '[]'::jsonb) into v_reservations
  from public.aipify_hosts_booking_reservations r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id
    and (p_property_id is null or r.property_id = p_property_id)
    and (p_status is null or r.booking_status = p_status)
    and (p_date_from is null or r.check_out_date >= p_date_from)
    and (p_date_to is null or r.check_in_date <= p_date_to)
    and (p_guest_name is null or r.guest_name ilike '%' || p_guest_name || '%');

  if v_section = 'upcoming_bookings' then
    select coalesce(jsonb_agg(r order by (r->>'check_in_date')), '[]'::jsonb) into v_reservations
    from jsonb_array_elements(v_reservations) r
    where (r->>'check_in_date')::date >= current_date
      and r->>'booking_status' in ('inquiry', 'pending', 'confirmed');
  elsif v_section = 'active_stays' then
    select coalesce(jsonb_agg(r order by (r->>'check_out_date')), '[]'::jsonb) into v_reservations
    from jsonb_array_elements(v_reservations) r
    where r->>'booking_status' = 'checked_in'
      or (r->>'booking_status' = 'confirmed'
        and (r->>'check_in_date')::date <= current_date
        and (r->>'check_out_date')::date > current_date);
  elsif v_section = 'past_bookings' then
    select coalesce(jsonb_agg(r order by (r->>'check_out_date') desc), '[]'::jsonb) into v_reservations
    from jsonb_array_elements(v_reservations) r
    where r->>'booking_status' in ('checked_out')
      or ((r->>'check_out_date')::date < current_date and r->>'booking_status' <> 'cancelled');
  elsif v_section = 'cancellations' then
    v_reservations := '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(
    public._ahostbkg_cancellation_row(c, p.display_name) order by c.cancellation_date desc
  ), '[]'::jsonb) into v_cancellations
  from public.aipify_hosts_booking_cancellations c
  left join public.aipify_hosts_properties p on p.id = c.property_id
  where c.tenant_id = v_tenant_id
    and (p_property_id is null or c.property_id = p_property_id)
    and (p_date_from is null or c.cancellation_date >= p_date_from)
    and (p_date_to is null or c.cancellation_date <= p_date_to);

  select coalesce(jsonb_agg(
    public._ahostbkg_timeline_row(t) order by t.occurred_at desc
  ), '[]'::jsonb) into v_timeline
  from public.aipify_hosts_booking_timeline_events t
  where t.tenant_id = v_tenant_id
  limit 20;

  v_reports := jsonb_build_object(
    'total_reservations', (select count(*) from public.aipify_hosts_booking_reservations where tenant_id = v_tenant_id),
    'by_status', (
      select coalesce(jsonb_object_agg(booking_status, cnt), '{}'::jsonb)
      from (
        select booking_status, count(*)::int cnt
        from public.aipify_hosts_booking_reservations
        where tenant_id = v_tenant_id group by booking_status
      ) s
    ),
    'by_channel', (
      select coalesce(jsonb_object_agg(coalesce(booking_channel, 'unknown'), cnt), '{}'::jsonb)
      from (
        select booking_channel, count(*)::int cnt
        from public.aipify_hosts_booking_reservations
        where tenant_id = v_tenant_id group by booking_channel
      ) ch
    ),
    'avg_nights', (
      select round(avg(greatest(1, check_out_date - check_in_date))::numeric, 1)
      from public.aipify_hosts_booking_reservations where tenant_id = v_tenant_id
    ),
    'avg_guests', (
      select round(avg(number_of_guests)::numeric, 1)
      from public.aipify_hosts_booking_reservations where tenant_id = v_tenant_id
    )
  );

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_bc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp397_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_reservation_updates', true,
      'audit_internal_note_changes', true,
      'audit_cancellation_records', true
    ),
    'sections', public._ahostbp397_sections(),
    'booking_statuses', jsonb_build_array('inquiry', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
    'stats', public._ahostbkg_dashboard_stats(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'reservations', case when v_section not in ('cancellations', 'booking_reports') then v_reservations else '[]'::jsonb end,
    'cancellations', case when v_section in ('cancellations', 'booking_reports') then v_cancellations else v_cancellations end,
    'booking_reports', case when v_section = 'booking_reports' then v_reports else null end,
    'timeline', v_timeline,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 35 — Booking Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_35_BOOKING_CENTER.text',
      'route', '/app/aipify-hosts/bookings'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_booking_action(
  p_action_type text,
  p_reservation_id uuid default null,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_res public.aipify_hosts_booking_reservations;
  v_summary text;
  v_old_notes text;
  v_availability jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_reservation_id is not null then
    select * into v_res from public.aipify_hosts_booking_reservations
    where id = p_reservation_id and tenant_id = v_tenant_id;
    if v_res.id is null then raise exception 'Reservation not found'; end if;
    v_old_notes := v_res.internal_notes;
  end if;

  if p_action_type = 'update_internal_notes' and p_reservation_id is not null then
    update public.aipify_hosts_booking_reservations set
      internal_notes = coalesce(p_notes, internal_notes), updated_at = now()
    where id = p_reservation_id and tenant_id = v_tenant_id;
    perform public._ahostbkg_log_event(v_tenant_id, 'internal_notes_updated', 'Internal notes updated',
      jsonb_build_object('reservation_id', p_reservation_id, 'from', v_old_notes, 'to', p_notes));
    v_summary := 'Internal notes updated';

  elsif p_action_type = 'confirm_reservation' and p_reservation_id is not null then
    v_availability := public._ahostbkg_validate_availability(
      v_tenant_id, v_res.property_id, v_res.check_in_date, v_res.check_out_date, p_reservation_id);
    if not (v_availability->>'available')::boolean then
      perform public._ahostbkg_push_notification(v_tenant_id, 'bkg_conflict_' || p_reservation_id, 'high',
        'Booking conflict identified', 'Availability conflict detected for ' || v_res.reservation_reference);
      return jsonb_build_object('success', false, 'summary', 'Booking conflict identified', 'availability', v_availability);
    end if;
    update public.aipify_hosts_booking_reservations set booking_status = 'confirmed', updated_at = now()
    where id = p_reservation_id and tenant_id = v_tenant_id;
    perform public._ahostbkg_add_timeline(v_tenant_id, p_reservation_id, 'reservation_confirmed', 'Reservation confirmed');
    perform public._ahostbkg_log_event(v_tenant_id, 'reservation_updated', 'Reservation confirmed',
      jsonb_build_object('reservation_id', p_reservation_id));
    v_summary := 'Reservation confirmed';

  elsif p_action_type = 'check_in_guest' and p_reservation_id is not null then
    update public.aipify_hosts_booking_reservations set booking_status = 'checked_in', updated_at = now()
    where id = p_reservation_id and tenant_id = v_tenant_id;
    perform public._ahostbkg_add_timeline(v_tenant_id, p_reservation_id, 'guest_checked_in', 'Guest checked in');
    perform public._ahostbkg_push_notification(v_tenant_id, 'bkg_arrival_' || p_reservation_id, 'informational',
      'Guest checked in', v_res.guest_name || ' checked in at ' || coalesce(v_res.reservation_reference, ''));
    v_summary := 'Guest checked in';

  elsif p_action_type = 'check_out_guest' and p_reservation_id is not null then
    update public.aipify_hosts_booking_reservations set booking_status = 'checked_out', updated_at = now()
    where id = p_reservation_id and tenant_id = v_tenant_id;
    perform public._ahostbkg_add_timeline(v_tenant_id, p_reservation_id, 'guest_checked_out', 'Guest checked out');
    perform public._ahostbkg_add_timeline(v_tenant_id, p_reservation_id, 'reservation_closed', 'Reservation closed');
    perform public._ahostbkg_push_notification(v_tenant_id, 'bkg_departure_' || p_reservation_id, 'informational',
      'Guest checked out', v_res.guest_name || ' checked out.');
    v_summary := 'Guest checked out';

  elsif p_action_type = 'record_cancellation' and p_reservation_id is not null then
    update public.aipify_hosts_booking_reservations set booking_status = 'cancelled', updated_at = now()
    where id = p_reservation_id and tenant_id = v_tenant_id;
    insert into public.aipify_hosts_booking_cancellations (
      tenant_id, reservation_id, reservation_reference, property_id, cancellation_date, cancellation_reason
    ) values (
      v_tenant_id, p_reservation_id, v_res.reservation_reference, v_res.property_id,
      current_date, coalesce(p_notes, 'Cancellation recorded')
    );
    perform public._ahostbkg_log_event(v_tenant_id, 'cancellation_recorded', 'Cancellation recorded',
      jsonb_build_object('reservation_id', p_reservation_id, 'reason', p_notes));
    perform public._ahostbkg_push_notification(v_tenant_id, 'bkg_cancel_' || p_reservation_id, 'high',
      'Reservation cancelled', v_res.reservation_reference || ' — ' || coalesce(p_notes, 'Cancelled'));
    v_summary := 'Cancellation recorded';

  elsif p_action_type = 'validate_availability' and p_reservation_id is not null then
    v_availability := public._ahostbkg_validate_availability(
      v_tenant_id, v_res.property_id, v_res.check_in_date, v_res.check_out_date, p_reservation_id);
    if not (v_availability->>'available')::boolean then
      perform public._ahostbkg_push_notification(v_tenant_id, 'bkg_conflict_' || p_reservation_id, 'high',
        'Booking conflict identified', 'Conflict for ' || v_res.reservation_reference);
    end if;
    return jsonb_build_object('success', true, 'availability', v_availability, 'summary', 'Availability checked');

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostbkg_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'reservation_id', p_reservation_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_booking_center_knowledge_airbnb35()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-booking', 'Hosts Booking Center',
    'Reservation management, arrival preparation, cancellations, and booking workflow standards.', 330
  );
  perform public._ahostkc_seed_article('aipify-hosts-booking', 'reservation-management-best-practices', 'Reservation management best practices',
    'Maintain reservation references, guest details, and internal notes in one workspace. Validate availability before confirming.');
  perform public._ahostkc_seed_article('aipify-hosts-booking', 'preparing-for-guest-arrivals', 'Preparing for guest arrivals',
    'Review arrivals today, assign cleaning and check-in workflows, and confirm property readiness before guest arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-booking', 'handling-cancellations', 'Handling cancellations',
    'Record cancellation date and reason. Update availability and notify operational teams when reservations change.');
  perform public._ahostkc_seed_article('aipify-hosts-booking', 'booking-workflow-standards', 'Booking workflow standards',
    'Track reservation lifecycle from inquiry through check-out. Audit updates and maintain visibility across all properties.');
end; $$;

select public.seed_aipify_hosts_booking_center_knowledge_airbnb35();

grant execute on function public.get_aipify_hosts_booking_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_booking_center_dashboard(text, uuid, text, date, date, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_booking_action(text, uuid, text, uuid) to authenticated;

-- Phase Airbnb 27 — Aipify Hosts Check-In Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostcio_* (engine), _ahostbp389_* (blueprint)

create table if not exists public.aipify_hosts_checkin_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'upcoming_check_ins' check (
    default_section in (
      'upcoming_check_ins', 'active_stays', 'upcoming_check_outs',
      'readiness_status', 'checkout_reviews'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_checkin_center_settings enable row level security;
revoke all on public.aipify_hosts_checkin_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_checkin_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  guest_id uuid references public.aipify_hosts_guests (id) on delete set null,
  checkin_key text not null,
  guest_name text not null,
  check_in_date date not null,
  expected_check_out_date date not null,
  checkin_status text not null default 'scheduled' check (
    checkin_status in ('scheduled', 'preparing', 'ready', 'guest_arrived', 'completed')
  ),
  access_instructions text,
  team_assigned text,
  guest_info_summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, checkin_key)
);
create index if not exists aipify_hosts_checkin_records_tenant_idx
  on public.aipify_hosts_checkin_records (tenant_id, check_in_date, checkin_status);
alter table public.aipify_hosts_checkin_records enable row level security;
revoke all on public.aipify_hosts_checkin_records from authenticated, anon;

create table if not exists public.aipify_hosts_checkin_readiness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checkin_id uuid not null references public.aipify_hosts_checkin_records (id) on delete cascade unique,
  cleaning_completed boolean not null default false,
  inspection_completed boolean not null default false,
  supplies_ready boolean not null default false,
  access_instructions_available boolean not null default false,
  team_assigned_flag boolean not null default false,
  ready_score numeric(5,2) not null default 0,
  readiness_indicator text not null default 'not_ready' check (
    readiness_indicator in ('ready', 'attention_required', 'not_ready')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_checkin_readiness enable row level security;
revoke all on public.aipify_hosts_checkin_readiness from authenticated, anon;

create table if not exists public.aipify_hosts_checkout_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checkin_id uuid references public.aipify_hosts_checkin_records (id) on delete set null,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  guest_id uuid references public.aipify_hosts_guests (id) on delete set null,
  checkout_key text not null,
  guest_name text not null,
  checkout_date date not null,
  checkout_status text not null default 'scheduled' check (
    checkout_status in ('scheduled', 'guest_departed', 'inspection_pending', 'cleaning_pending', 'completed')
  ),
  property_status_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, checkout_key)
);
create index if not exists aipify_hosts_checkout_records_tenant_idx
  on public.aipify_hosts_checkout_records (tenant_id, checkout_date, checkout_status);
alter table public.aipify_hosts_checkout_records enable row level security;
revoke all on public.aipify_hosts_checkout_records from authenticated, anon;

create table if not exists public.aipify_hosts_checkout_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  checkout_id uuid not null references public.aipify_hosts_checkout_records (id) on delete cascade unique,
  damage_observed boolean not null default false,
  missing_items boolean not null default false,
  maintenance_required boolean not null default false,
  exceptional_condition boolean not null default false,
  departure_outcome text not null default 'standard_departure' check (
    departure_outcome in ('standard_departure', 'follow_up_required', 'incident_opened')
  ),
  review_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_checkout_reviews enable row level security;
revoke all on public.aipify_hosts_checkout_reviews from authenticated, anon;

create table if not exists public.aipify_hosts_checkin_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_checkin_center_events_tenant_idx
  on public.aipify_hosts_checkin_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_checkin_center_events enable row level security;
revoke all on public.aipify_hosts_checkin_center_events from authenticated, anon;

create or replace function public._ahostcio_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_checkin_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_checkin_center_settings;
begin
  insert into public.aipify_hosts_checkin_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_checkin_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostcio_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_checkin_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'checkin_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostcio_push_notification(
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

create or replace function public._ahostcio_compute_readiness(
  p_cleaning boolean, p_inspection boolean, p_supplies boolean, p_access boolean, p_team boolean
) returns jsonb language sql immutable as $$
  with flags as (
    select (p_cleaning::int + p_inspection::int + p_supplies::int + p_access::int + p_team::int) as passed
  )
  select jsonb_build_object(
    'ready_score', round((flags.passed::numeric / 5) * 100, 0),
    'readiness_indicator', case
      when flags.passed = 5 then 'ready'
      when flags.passed >= 3 then 'attention_required'
      else 'not_ready'
    end
  )
  from flags; $$;

create or replace function public._ahostcio_refresh_readiness(p_checkin_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_c public.aipify_hosts_checkin_records; v_r public.aipify_hosts_checkin_readiness; v_calc jsonb;
begin
  select * into v_c from public.aipify_hosts_checkin_records where id = p_checkin_id;
  select * into v_r from public.aipify_hosts_checkin_readiness where checkin_id = p_checkin_id;
  if v_r.id is null then
    insert into public.aipify_hosts_checkin_readiness (tenant_id, checkin_id)
    values (v_c.tenant_id, p_checkin_id);
    select * into v_r from public.aipify_hosts_checkin_readiness where checkin_id = p_checkin_id;
  end if;
  v_calc := public._ahostcio_compute_readiness(
    v_r.cleaning_completed, v_r.inspection_completed, v_r.supplies_ready,
    coalesce(v_r.access_instructions_available, v_c.access_instructions is not null and v_c.access_instructions <> ''),
    coalesce(v_r.team_assigned_flag, v_c.team_assigned is not null and v_c.team_assigned <> '')
  );
  update public.aipify_hosts_checkin_readiness set
    access_instructions_available = (v_c.access_instructions is not null and v_c.access_instructions <> ''),
    team_assigned_flag = (v_c.team_assigned is not null and v_c.team_assigned <> ''),
    ready_score = (v_calc ->> 'ready_score')::numeric,
    readiness_indicator = v_calc ->> 'readiness_indicator',
    updated_at = now()
  where checkin_id = p_checkin_id;
end; $$;

create or replace function public._ahostbp389_positioning() returns text language sql immutable as $$
  select 'Standardize guest arrivals and departures — check-ins, active stays, check-outs, readiness, and reviews in one Check-In Center.'; $$;

create or replace function public._ahostbp389_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'upcoming_check_ins', 'label', 'Upcoming Check-Ins'),
    jsonb_build_object('key', 'active_stays', 'label', 'Active Stays'),
    jsonb_build_object('key', 'upcoming_check_outs', 'label', 'Upcoming Check-Outs'),
    jsonb_build_object('key', 'readiness_status', 'label', 'Readiness Status'),
    jsonb_build_object('key', 'checkout_reviews', 'label', 'Checkout Reviews')
  ); $$;

create or replace function public._ahostcio_checkin_row(
  p_c public.aipify_hosts_checkin_records, p_property text, p_r public.aipify_hosts_checkin_readiness
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id, 'checkin_key', p_c.checkin_key, 'guest_name', p_c.guest_name,
    'property_id', p_c.property_id, 'property', coalesce(p_property, '—'),
    'check_in_date', p_c.check_in_date::text,
    'expected_check_out_date', p_c.expected_check_out_date::text,
    'checkin_status', p_c.checkin_status,
    'access_instructions', coalesce(p_c.access_instructions, '—'),
    'team_assigned', coalesce(p_c.team_assigned, '—'),
    'guest_info_summary', coalesce(p_c.guest_info_summary, '—'),
    'ready_score', coalesce(p_r.ready_score, 0),
    'readiness_indicator', coalesce(p_r.readiness_indicator, 'not_ready'),
    'cleaning_completed', coalesce(p_r.cleaning_completed, false),
    'inspection_completed', coalesce(p_r.inspection_completed, false),
    'supplies_ready', coalesce(p_r.supplies_ready, false),
    'access_instructions_available', coalesce(p_r.access_instructions_available, false),
    'team_assigned_flag', coalesce(p_r.team_assigned_flag, false)
  ); $$;

create or replace function public._ahostcio_checkout_row(
  p_o public.aipify_hosts_checkout_records, p_property text, p_rev public.aipify_hosts_checkout_reviews
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_o.id, 'checkout_key', p_o.checkout_key, 'checkin_id', p_o.checkin_id,
    'guest_name', p_o.guest_name, 'property_id', p_o.property_id,
    'property', coalesce(p_property, '—'),
    'checkout_date', p_o.checkout_date::text,
    'checkout_status', p_o.checkout_status,
    'property_status_notes', coalesce(p_o.property_status_notes, ''),
    'damage_observed', coalesce(p_rev.damage_observed, false),
    'missing_items', coalesce(p_rev.missing_items, false),
    'maintenance_required', coalesce(p_rev.maintenance_required, false),
    'exceptional_condition', coalesce(p_rev.exceptional_condition, false),
    'departure_outcome', coalesce(p_rev.departure_outcome, 'standard_departure'),
    'review_notes', coalesce(p_rev.review_notes, '')
  ); $$;

create or replace function public._ahostcio_seed_checkins(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid; v_guest uuid; v_ci1 uuid; v_ci2 uuid; v_ci3 uuid; v_co1 uuid;
begin
  if exists (select 1 from public.aipify_hosts_checkin_records where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  select id into v_guest from public.aipify_hosts_guests where tenant_id = p_tenant_id limit 1;
  if v_prop is null then return; end if;

  insert into public.aipify_hosts_checkin_records (
    tenant_id, property_id, guest_id, checkin_key, guest_name, check_in_date, expected_check_out_date,
    checkin_status, access_instructions, team_assigned, guest_info_summary
  ) values
    (v_tenant_id, v_prop, v_guest, 'cio_in_001', 'Anders Guest', current_date, current_date + 4,
      'preparing', 'Lockbox code 4821 · Wi-Fi on welcome card', 'Front Desk',
      '2 adults · Late arrival expected'),
    (v_tenant_id, v_prop, v_guest, 'cio_in_002', 'Berg Family', current_date + 2, current_date + 7,
      'scheduled', 'Smart lock via app · Parking spot B2', 'Operations',
      '4 guests · Early check-in requested'),
    (v_tenant_id, v_prop, v_guest, 'cio_in_003', 'Chen Stay', current_date - 2, current_date + 1,
      'guest_arrived', 'Key in lockbox 12', 'Front Desk', '1 guest · Business travel');

  select id into v_ci1 from public.aipify_hosts_checkin_records where tenant_id = p_tenant_id and checkin_key = 'cio_in_001';
  select id into v_ci2 from public.aipify_hosts_checkin_records where tenant_id = p_tenant_id and checkin_key = 'cio_in_002';
  select id into v_ci3 from public.aipify_hosts_checkin_records where tenant_id = p_tenant_id and checkin_key = 'cio_in_003';

  insert into public.aipify_hosts_checkin_readiness (
    tenant_id, checkin_id, cleaning_completed, inspection_completed, supplies_ready,
    access_instructions_available, team_assigned_flag, ready_score, readiness_indicator
  ) values
    (v_tenant_id, v_ci1, true, true, false, true, true, 80, 'attention_required'),
    (v_tenant_id, v_ci2, false, false, false, true, true, 40, 'not_ready'),
    (v_tenant_id, v_ci3, true, true, true, true, true, 100, 'ready');

  insert into public.aipify_hosts_checkout_records (
    tenant_id, checkin_id, property_id, guest_id, checkout_key, guest_name, checkout_date, checkout_status
  ) values
    (v_tenant_id, v_ci3, v_prop, v_guest, 'cio_out_001', 'Chen Stay', current_date, 'inspection_pending'),
    (v_tenant_id, v_ci2, v_prop, v_guest, 'cio_out_002', 'Prior Guest', current_date + 1, 'scheduled')
  returning id into v_co1;

  insert into public.aipify_hosts_checkout_reviews (
    tenant_id, checkout_id, damage_observed, missing_items, maintenance_required,
    exceptional_condition, departure_outcome, review_notes
  ) values
    (v_tenant_id, v_co1, false, false, true, false, 'follow_up_required', 'Minor maintenance noted in bathroom');
end; $$;

create or replace function public._ahostcio_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'todays_check_ins', (select count(*)::int from public.aipify_hosts_checkin_records
      where tenant_id = p_tenant_id and check_in_date = current_date
        and checkin_status not in ('completed', 'guest_arrived')),
    'todays_check_outs', (select count(*)::int from public.aipify_hosts_checkout_records
      where tenant_id = p_tenant_id and checkout_date = current_date
        and checkout_status <> 'completed'),
    'properties_requiring_attention', (select count(distinct c.property_id)::int
      from public.aipify_hosts_checkin_records c
      join public.aipify_hosts_checkin_readiness r on r.checkin_id = c.id
      where c.tenant_id = p_tenant_id and r.readiness_indicator <> 'ready'
        and c.checkin_status not in ('completed', 'guest_arrived')),
    'readiness_ready', (select count(*)::int from public.aipify_hosts_checkin_readiness r
      join public.aipify_hosts_checkin_records c on c.id = r.checkin_id
      where c.tenant_id = p_tenant_id and r.readiness_indicator = 'ready'),
    'readiness_attention', (select count(*)::int from public.aipify_hosts_checkin_readiness r
      join public.aipify_hosts_checkin_records c on c.id = r.checkin_id
      where c.tenant_id = p_tenant_id and r.readiness_indicator = 'attention_required'),
    'readiness_not_ready', (select count(*)::int from public.aipify_hosts_checkin_readiness r
      join public.aipify_hosts_checkin_records c on c.id = r.checkin_id
      where c.tenant_id = p_tenant_id and r.readiness_indicator = 'not_ready'),
    'active_stays', (select count(*)::int from public.aipify_hosts_checkin_records
      where tenant_id = p_tenant_id and checkin_status = 'guest_arrived')
  ); $$;

create or replace function public._ahostcio_task_prep(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'arrival_tasks', (select count(*)::int from public.aipify_hosts_tasks
      where tenant_id = p_tenant_id and category in ('guest_preparation', 'cleaning') and task_status = 'open'),
    'departure_tasks', (select count(*)::int from public.aipify_hosts_tasks
      where tenant_id = p_tenant_id and category = 'cleaning' and task_status = 'open'),
    'inspection_tasks', (select count(*)::int from public.aipify_hosts_tasks
      where tenant_id = p_tenant_id and category = 'inspection' and task_status = 'open'),
    'cleaning_tasks', (select count(*)::int from public.aipify_hosts_tasks
      where tenant_id = p_tenant_id and category = 'cleaning' and task_status = 'open')
  ); $$;

create or replace function public._ahostcio_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select c.id, c.guest_name, p.display_name from public.aipify_hosts_checkin_records c
    join public.aipify_hosts_properties p on p.id = c.property_id
    where c.tenant_id = p_tenant_id and c.check_in_date = current_date
      and c.checkin_status not in ('completed', 'guest_arrived', 'ready')
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_today_' || r.id::text, 'important',
      'Check-In Today', r.guest_name || ' at ' || r.display_name);
  end loop;

  for r in
    select c.id, c.guest_name from public.aipify_hosts_checkin_records c
    join public.aipify_hosts_checkin_readiness r2 on r2.checkin_id = c.id
    where c.tenant_id = p_tenant_id and c.check_in_date <= current_date + 1
      and r2.readiness_indicator = 'not_ready' and c.checkin_status in ('scheduled', 'preparing')
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_nrdy_' || r.id::text, 'high',
      'Check-In Not Ready', r.guest_name || ' property is not ready');
  end loop;

  for r in
    select c.id, c.guest_name from public.aipify_hosts_checkin_records c
    where c.tenant_id = p_tenant_id and c.checkin_status = 'guest_arrived'
      and c.updated_at >= now() - interval '1 day'
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_arr_' || r.id::text, 'informational',
      'Guest Arrived', r.guest_name || ' has checked in');
  end loop;

  for r in
    select o.id, o.guest_name, p.display_name from public.aipify_hosts_checkout_records o
    join public.aipify_hosts_properties p on p.id = o.property_id
    where o.tenant_id = p_tenant_id and o.checkout_date = current_date and o.checkout_status <> 'completed'
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_out_' || r.id::text, 'important',
      'Check-Out Today', r.guest_name || ' at ' || r.display_name);
  end loop;

  for r in
    select o.id, o.guest_name from public.aipify_hosts_checkout_records o
    where o.tenant_id = p_tenant_id and o.checkout_status = 'inspection_pending'
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_insp_' || r.id::text, 'high',
      'Inspection Required', 'Post-departure inspection for ' || r.guest_name);
  end loop;

  for r in
    select o.id, o.guest_name from public.aipify_hosts_checkout_records o
    where o.tenant_id = p_tenant_id and o.checkout_status = 'cleaning_pending'
  loop
    perform public._ahostcio_push_notification(p_tenant_id, 'cio_cln_' || r.id::text, 'high',
      'Cleaning Outstanding', 'Departure cleaning for ' || r.guest_name);
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_checkin_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_cc public.aipify_hosts_checkin_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_cc := public._ahostcio_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp389_positioning(),
    'route', '/app/aipify-hosts/check-in',
    'stats', public._ahostcio_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_checkin_center_dashboard(
  p_section text default 'upcoming_check_ins',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_cc public.aipify_hosts_checkin_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_checkins jsonb; v_checkouts jsonb; v_reviews jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_cc := public._ahostcio_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_cc.default_section, 'upcoming_check_ins');
  perform public._ahostcio_seed_checkins(v_tenant_id);
  perform public._ahostcio_check_notifications(v_tenant_id);
  perform public._ahostcio_log_event(v_tenant_id, 'dashboard_view', 'Check-In Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(
    public._ahostcio_checkin_row(c, p.display_name, r) order by c.check_in_date
  ), '[]'::jsonb) into v_checkins
  from public.aipify_hosts_checkin_records c
  left join public.aipify_hosts_properties p on p.id = c.property_id
  left join public.aipify_hosts_checkin_readiness r on r.checkin_id = c.id
  where c.tenant_id = v_tenant_id
    and case v_section
      when 'upcoming_check_ins' then c.check_in_date >= current_date and c.checkin_status in ('scheduled', 'preparing', 'ready')
      when 'active_stays' then c.checkin_status = 'guest_arrived'
        or (c.check_in_date <= current_date and c.expected_check_out_date > current_date and c.checkin_status <> 'completed')
      when 'readiness_status' then true
      else c.check_in_date >= current_date - 7
    end;

  select coalesce(jsonb_agg(
    public._ahostcio_checkout_row(o, p.display_name, rev) order by o.checkout_date
  ), '[]'::jsonb) into v_checkouts
  from public.aipify_hosts_checkout_records o
  left join public.aipify_hosts_properties p on p.id = o.property_id
  left join public.aipify_hosts_checkout_reviews rev on rev.checkout_id = o.id
  where o.tenant_id = v_tenant_id
    and case v_section
      when 'upcoming_check_outs' then o.checkout_date >= current_date and o.checkout_status <> 'completed'
      when 'checkout_reviews' then rev.id is not null
      else o.checkout_date >= current_date - 7
    end;

  v_reviews := case when v_section = 'checkout_reviews' then v_checkouts else '[]'::jsonb end;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp389_positioning(),
    'governance', jsonb_build_object(
      'audit_readiness_confirmations', true,
      'audit_checkout_reviews', true,
      'audit_issue_reporting', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp389_sections(),
    'checkin_statuses', jsonb_build_array('scheduled', 'preparing', 'ready', 'guest_arrived', 'completed'),
    'checkout_statuses', jsonb_build_array('scheduled', 'guest_departed', 'inspection_pending', 'cleaning_pending', 'completed'),
    'readiness_indicators', jsonb_build_array('ready', 'attention_required', 'not_ready'),
    'departure_outcomes', jsonb_build_array('standard_departure', 'follow_up_required', 'incident_opened'),
    'stats', public._ahostcio_dashboard_stats(v_tenant_id),
    'task_preparation', public._ahostcio_task_prep(v_tenant_id),
    'check_ins', v_checkins,
    'check_outs', v_checkouts,
    'checkout_reviews', v_reviews,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 27 — Check-In Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_27_CHECKIN_CENTER.text',
      'route', '/app/aipify-hosts/check-in'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_checkin_action(
  p_action_type text,
  p_record_type text default 'checkin',
  p_record_id uuid default null,
  p_notes text default null,
  p_departure_outcome text default null,
  p_damage boolean default null,
  p_missing boolean default null,
  p_maintenance boolean default null,
  p_exceptional boolean default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_c public.aipify_hosts_checkin_records; v_o public.aipify_hosts_checkout_records;
  v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_record_type = 'checkin' then
    select * into v_c from public.aipify_hosts_checkin_records where id = p_record_id and tenant_id = v_tenant_id;
    if v_c.id is null then raise exception 'Check-in record not found'; end if;

    if p_action_type = 'confirm_property_ready' then
      update public.aipify_hosts_checkin_records set checkin_status = 'ready', updated_at = now() where id = p_record_id;
      update public.aipify_hosts_checkin_readiness set cleaning_completed = true, inspection_completed = true, supplies_ready = true
      where checkin_id = p_record_id;
      perform public._ahostcio_refresh_readiness(p_record_id);
      perform public._ahostcio_log_event(v_tenant_id, 'readiness_confirmed', 'Property ready confirmed',
        jsonb_build_object('checkin_id', p_record_id));
      v_summary := 'Property marked ready';
    elsif p_action_type = 'guest_arrived' then
      update public.aipify_hosts_checkin_records set checkin_status = 'guest_arrived', updated_at = now() where id = p_record_id;
      perform public._ahostcio_push_notification(v_tenant_id, 'cio_arr_act_' || p_record_id::text, 'informational',
        'Guest Arrived', v_c.guest_name || ' checked in');
      v_summary := 'Guest arrival recorded';
    elsif p_action_type = 'assign_outstanding_tasks' then
      v_task_key := 'task_cio_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      insert into public.aipify_hosts_tasks (
        tenant_id, property_id, task_key, title, description, category, priority
      ) values (
        v_tenant_id, v_c.property_id, v_task_key, 'Arrival preparation: ' || v_c.guest_name,
        coalesce(p_notes, 'Outstanding arrival tasks'), 'guest_preparation', 'high'
      );
      v_summary := 'Arrival tasks assigned';
    elsif p_action_type in ('view_guest_information', 'view_access_instructions') then
      perform public._ahostcio_log_event(v_tenant_id, p_action_type, 'Guest info accessed',
        jsonb_build_object('checkin_id', p_record_id));
      v_summary := 'Information viewed';
    else
      raise exception 'Invalid check-in action';
    end if;
  else
    select * into v_o from public.aipify_hosts_checkout_records where id = p_record_id and tenant_id = v_tenant_id;
    if v_o.id is null then raise exception 'Check-out record not found'; end if;

    if p_action_type = 'schedule_cleaning' then
      update public.aipify_hosts_checkout_records set checkout_status = 'cleaning_pending', updated_at = now() where id = p_record_id;
      v_task_key := 'task_cln_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      insert into public.aipify_hosts_tasks (
        tenant_id, property_id, task_key, title, description, category, priority
      ) values (
        v_tenant_id, v_o.property_id, v_task_key, 'Departure cleaning: ' || v_o.guest_name,
        coalesce(p_notes, 'Post-departure cleaning'), 'cleaning', 'high'
      );
      v_summary := 'Cleaning scheduled';
    elsif p_action_type = 'schedule_inspection' then
      update public.aipify_hosts_checkout_records set checkout_status = 'inspection_pending', updated_at = now() where id = p_record_id;
      v_task_key := 'task_insp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      insert into public.aipify_hosts_tasks (
        tenant_id, property_id, task_key, title, description, category, priority
      ) values (
        v_tenant_id, v_o.property_id, v_task_key, 'Departure inspection: ' || v_o.guest_name,
        coalesce(p_notes, 'Post-departure inspection'), 'inspection', 'medium'
      );
      v_summary := 'Inspection scheduled';
    elsif p_action_type = 'record_property_status' then
      update public.aipify_hosts_checkout_records set
        property_status_notes = coalesce(p_notes, property_status_notes),
        checkout_status = 'guest_departed', updated_at = now()
      where id = p_record_id;
      v_summary := 'Property status recorded';
    elsif p_action_type = 'report_issues' then
      insert into public.aipify_hosts_checkout_reviews (
        tenant_id, checkout_id, damage_observed, missing_items, maintenance_required,
        exceptional_condition, departure_outcome, review_notes
      ) values (
        v_tenant_id, p_record_id,
        coalesce(p_damage, false), coalesce(p_missing, false),
        coalesce(p_maintenance, false), coalesce(p_exceptional, false),
        coalesce(p_departure_outcome, 'follow_up_required'), p_notes
      ) on conflict (checkout_id) do update set
        damage_observed = coalesce(p_damage, aipify_hosts_checkout_reviews.damage_observed),
        missing_items = coalesce(p_missing, aipify_hosts_checkout_reviews.missing_items),
        maintenance_required = coalesce(p_maintenance, aipify_hosts_checkout_reviews.maintenance_required),
        exceptional_condition = coalesce(p_exceptional, aipify_hosts_checkout_reviews.exceptional_condition),
        departure_outcome = coalesce(p_departure_outcome, aipify_hosts_checkout_reviews.departure_outcome),
        review_notes = coalesce(p_notes, aipify_hosts_checkout_reviews.review_notes),
        updated_at = now();
      perform public._ahostcio_log_event(v_tenant_id, 'issue_reported', 'Checkout issue reported',
        jsonb_build_object('checkout_id', p_record_id));
      v_summary := 'Issues reported';
    else
      raise exception 'Invalid check-out action';
    end if;
  end if;

  perform public._ahostcio_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'record_type', p_record_type, 'record_id', p_record_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_checkin_center_knowledge_airbnb27()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-check-in', 'Hosts Check-In Center',
    'Check-in standards, checkout procedures, readiness, and guest arrival guidance.', 323
  );
  perform public._ahostkc_seed_article('aipify-hosts-check-in', 'check-in-standards', 'Check-in standards',
    'Confirm cleaning, inspection, supplies, access instructions, and team assignment before every arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-check-in', 'checkout-procedures', 'Checkout procedures',
    'Record property status, schedule cleaning and inspection, and capture departure reviews consistently.');
  perform public._ahostkc_seed_article('aipify-hosts-check-in', 'property-readiness-expectations', 'Property readiness expectations',
    'Use the ready score and indicators to resolve attention items before guest arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-check-in', 'guest-arrival-best-practices', 'Guest arrival best practices',
    'Communicate access instructions clearly and confirm guest arrival to trigger downstream departure workflows.');
end; $$;

select public.seed_aipify_hosts_checkin_center_knowledge_airbnb27();

grant execute on function public.get_aipify_hosts_checkin_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_checkin_center_dashboard(text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_checkin_action(text, text, uuid, text, text, boolean, boolean, boolean, boolean, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_checkin_center_knowledge_airbnb27() to authenticated;

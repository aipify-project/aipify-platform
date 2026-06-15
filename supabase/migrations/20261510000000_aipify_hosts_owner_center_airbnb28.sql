-- Phase Airbnb 28 — Aipify Hosts Owner Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostown_* (engine), _ahostbp390_* (blueprint)

create table if not exists public.aipify_hosts_owner_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'owner_stays' check (
    default_section in (
      'owner_stays', 'property_blocks', 'availability_overrides', 'block_history'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_owner_center_settings enable row level security;
revoke all on public.aipify_hosts_owner_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_owner_blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  block_key text not null,
  start_date date not null,
  end_date date not null,
  block_type text not null check (
    block_type in (
      'personal_stay', 'family_stay', 'maintenance_block', 'inspection_block',
      'operational_block', 'seasonal_closure'
    )
  ),
  block_status text not null default 'scheduled' check (
    block_status in ('scheduled', 'active', 'completed', 'cancelled')
  ),
  notes text,
  prevents_reservations boolean not null default true,
  visible_in_operations boolean not null default true,
  include_in_occupancy boolean not null default true,
  calendar_event_id uuid,
  calendar_block_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, block_key),
  check (end_date >= start_date)
);
create index if not exists aipify_hosts_owner_blocks_tenant_idx
  on public.aipify_hosts_owner_blocks (tenant_id, start_date, block_status);
create index if not exists aipify_hosts_owner_blocks_property_idx
  on public.aipify_hosts_owner_blocks (property_id, start_date, end_date);
alter table public.aipify_hosts_owner_blocks enable row level security;
revoke all on public.aipify_hosts_owner_blocks from authenticated, anon;

create table if not exists public.aipify_hosts_owner_availability_overrides (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  override_key text not null,
  start_date date not null,
  end_date date not null,
  override_type text not null default 'block_reservations' check (
    override_type in ('block_reservations', 'extend_hold', 'min_stay_adjustment')
  ),
  notes text,
  is_active boolean not null default true,
  owner_block_id uuid references public.aipify_hosts_owner_blocks (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, override_key),
  check (end_date >= start_date)
);
create index if not exists aipify_hosts_owner_availability_overrides_tenant_idx
  on public.aipify_hosts_owner_availability_overrides (tenant_id, is_active, start_date);
alter table public.aipify_hosts_owner_availability_overrides enable row level security;
revoke all on public.aipify_hosts_owner_availability_overrides from authenticated, anon;

create table if not exists public.aipify_hosts_owner_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_owner_center_events_tenant_idx
  on public.aipify_hosts_owner_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_owner_center_events enable row level security;
revoke all on public.aipify_hosts_owner_center_events from authenticated, anon;

create or replace function public._ahostown_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_owner_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_owner_center_settings;
begin
  insert into public.aipify_hosts_owner_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_owner_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostown_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_owner_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'owner_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostown_push_notification(
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

create or replace function public._ahostown_calendar_event_type(p_block_type text)
returns text language sql immutable as $$
  select case p_block_type
    when 'personal_stay' then 'owner_block'
    when 'family_stay' then 'owner_block'
    when 'maintenance_block' then 'maintenance'
    when 'inspection_block' then 'inspection'
    when 'operational_block' then 'operational_block'
    when 'seasonal_closure' then 'owner_block'
    else 'owner_block'
  end; $$;

create or replace function public._ahostown_block_title(p_block_type text, p_property text)
returns text language sql immutable as $$
  select case p_block_type
    when 'personal_stay' then 'Owner personal stay · ' || coalesce(p_property, 'Property')
    when 'family_stay' then 'Family stay · ' || coalesce(p_property, 'Property')
    when 'maintenance_block' then 'Maintenance block · ' || coalesce(p_property, 'Property')
    when 'inspection_block' then 'Inspection block · ' || coalesce(p_property, 'Property')
    when 'operational_block' then 'Operational block · ' || coalesce(p_property, 'Property')
    when 'seasonal_closure' then 'Seasonal closure · ' || coalesce(p_property, 'Property')
    else 'Owner block · ' || coalesce(p_property, 'Property')
  end; $$;

create or replace function public._ahostown_refresh_block_status(p_block_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_b public.aipify_hosts_owner_blocks;
begin
  select * into v_b from public.aipify_hosts_owner_blocks where id = p_block_id;
  if v_b.id is null then return; end if;
  if v_b.block_status in ('completed', 'cancelled') then return; end if;
  if v_b.start_date <= current_date and v_b.end_date >= current_date then
    update public.aipify_hosts_owner_blocks set block_status = 'active', updated_at = now()
    where id = p_block_id and block_status = 'scheduled';
  elsif v_b.end_date < current_date then
    update public.aipify_hosts_owner_blocks set block_status = 'completed', updated_at = now()
    where id = p_block_id and block_status in ('scheduled', 'active');
  end if;
end; $$;

create or replace function public._ahostown_sync_calendar(p_block_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_b public.aipify_hosts_owner_blocks;
  v_prop text;
  v_event_key text;
  v_block_key text;
  v_event_id uuid;
  v_cal_block_id uuid;
  v_event_type text;
  v_title text;
begin
  select * into v_b from public.aipify_hosts_owner_blocks where id = p_block_id;
  if v_b.id is null or v_b.block_status = 'cancelled' then return; end if;
  select display_name into v_prop from public.aipify_hosts_properties where id = v_b.property_id;
  v_event_type := public._ahostown_calendar_event_type(v_b.block_type);
  v_title := public._ahostown_block_title(v_b.block_type, v_prop);

  if v_b.calendar_event_id is null then
    v_event_key := 'own_evt_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_calendar_events (
      tenant_id, property_id, event_key, event_type, title, start_date, end_date,
      event_status, internal_notes
    ) values (
      v_b.tenant_id, v_b.property_id, v_event_key, v_event_type, v_title,
      v_b.start_date, v_b.end_date,
      case when v_b.block_status = 'active' then 'blocked' else 'confirmed' end,
      v_b.notes
    ) returning id into v_event_id;
  else
    v_event_id := v_b.calendar_event_id;
    update public.aipify_hosts_calendar_events set
      event_type = v_event_type, title = v_title, start_date = v_b.start_date, end_date = v_b.end_date,
      internal_notes = v_b.notes,
      event_status = case when v_b.block_status = 'active' then 'blocked' else 'confirmed' end,
      updated_at = now()
    where id = v_event_id;
  end if;

  if v_b.prevents_reservations then
    if v_b.calendar_block_id is null then
      v_block_key := 'own_blk_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      insert into public.aipify_hosts_calendar_blocks (
        tenant_id, property_id, block_key, start_date, end_date, block_reason, internal_notes, is_active
      ) values (
        v_b.tenant_id, v_b.property_id, v_block_key, v_b.start_date, v_b.end_date,
        v_b.block_type, v_b.notes, v_b.block_status not in ('completed', 'cancelled')
      ) returning id into v_cal_block_id;
    else
      v_cal_block_id := v_b.calendar_block_id;
      update public.aipify_hosts_calendar_blocks set
        start_date = v_b.start_date, end_date = v_b.end_date,
        block_reason = v_b.block_type, internal_notes = v_b.notes,
        is_active = v_b.block_status not in ('completed', 'cancelled'),
        updated_at = now()
      where id = v_cal_block_id;
    end if;
  end if;

  update public.aipify_hosts_owner_blocks set
    calendar_event_id = v_event_id,
    calendar_block_id = coalesce(v_cal_block_id, calendar_block_id),
    updated_at = now()
  where id = p_block_id;
exception when undefined_table then null;
end; $$;

create or replace function public._ahostown_detect_conflicts(p_tenant_id uuid, p_property_id uuid, p_start date, p_end date, p_exclude uuid default null)
returns int language sql stable as $$
  select count(*)::int from public.aipify_hosts_owner_blocks b
  where b.tenant_id = p_tenant_id
    and b.property_id = p_property_id
    and b.block_status in ('scheduled', 'active')
    and (p_exclude is null or b.id <> p_exclude)
    and b.start_date <= p_end and b.end_date >= p_start; $$;

create or replace function public._ahostbp390_positioning() returns text language sql immutable as $$
  select 'Reserve properties for personal use and operational purposes — owner stays, blocks, overrides, and calendar integration in one Owner Center.'; $$;

create or replace function public._ahostbp390_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'owner_stays', 'label', 'Owner Stays'),
    jsonb_build_object('key', 'property_blocks', 'label', 'Property Blocks'),
    jsonb_build_object('key', 'availability_overrides', 'label', 'Availability Overrides'),
    jsonb_build_object('key', 'block_history', 'label', 'Block History')
  ); $$;

create or replace function public._ahostown_block_row(p_b public.aipify_hosts_owner_blocks, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_b.id, 'block_key', p_b.block_key,
    'property_id', p_b.property_id, 'property', coalesce(p_property, '—'),
    'start_date', p_b.start_date::text, 'end_date', p_b.end_date::text,
    'block_type', p_b.block_type, 'block_status', p_b.block_status,
    'notes', coalesce(p_b.notes, ''),
    'prevents_reservations', p_b.prevents_reservations,
    'visible_in_operations', p_b.visible_in_operations,
    'include_in_occupancy', p_b.include_in_occupancy,
    'night_count', (p_b.end_date - p_b.start_date + 1)
  ); $$;

create or replace function public._ahostown_override_row(p_o public.aipify_hosts_owner_availability_overrides, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_o.id, 'override_key', p_o.override_key,
    'property_id', p_o.property_id, 'property', coalesce(p_property, '—'),
    'start_date', p_o.start_date::text, 'end_date', p_o.end_date::text,
    'override_type', p_o.override_type, 'notes', coalesce(p_o.notes, ''),
    'is_active', p_o.is_active, 'owner_block_id', p_o.owner_block_id
  ); $$;

create or replace function public._ahostown_seed_blocks(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_owner_blocks where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  if v_prop is null then return; end if;

  insert into public.aipify_hosts_owner_blocks (
    tenant_id, property_id, block_key, start_date, end_date, block_type, block_status, notes
  ) values
    (v_tenant_id, v_prop, 'own_stay_001', current_date + 14, current_date + 21,
      'personal_stay', 'scheduled', 'Owner weekend at property'),
    (v_tenant_id, v_prop, 'own_stay_002', current_date + 3, current_date + 7,
      'family_stay', 'scheduled', 'Family holiday'),
    (v_tenant_id, v_prop, 'own_blk_001', current_date, current_date + 2,
      'maintenance_block', 'active', 'HVAC service shutdown'),
    (v_tenant_id, v_prop, 'own_blk_002', current_date + 30, current_date + 60,
      'seasonal_closure', 'scheduled', 'Winter seasonal closure'),
    (v_tenant_id, v_prop, 'own_blk_003', current_date - 14, current_date - 7,
      'operational_block', 'completed', 'Deep cleaning period');

  perform public._ahostown_sync_calendar(id)
  from public.aipify_hosts_owner_blocks
  where tenant_id = v_tenant_id and block_key like 'own_%';

  insert into public.aipify_hosts_owner_availability_overrides (
    tenant_id, property_id, override_key, start_date, end_date, override_type, notes,
    owner_block_id
  )
  select v_tenant_id, v_prop, 'own_ovr_001', current_date, current_date + 2,
    'block_reservations', 'Linked to active maintenance block', b.id
  from public.aipify_hosts_owner_blocks b
  where b.tenant_id = v_tenant_id and b.block_key = 'own_blk_001';
end; $$;

create or replace function public._ahostown_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'upcoming_personal_stays', (
      select count(*)::int from public.aipify_hosts_owner_blocks
      where tenant_id = p_tenant_id and block_type in ('personal_stay', 'family_stay')
        and block_status = 'scheduled' and start_date >= current_date
    ),
    'active_property_blocks', (
      select count(*)::int from public.aipify_hosts_owner_blocks
      where tenant_id = p_tenant_id and block_status = 'active'
    ),
    'seasonal_closures', (
      select count(*)::int from public.aipify_hosts_owner_blocks
      where tenant_id = p_tenant_id and block_type = 'seasonal_closure'
        and block_status in ('scheduled', 'active')
    ),
    'blocked_nights', (
      select coalesce(sum(end_date - start_date + 1), 0)::int
      from public.aipify_hosts_owner_blocks
      where tenant_id = p_tenant_id and block_status in ('scheduled', 'active')
        and start_date <= current_date + 90 and end_date >= current_date
    ),
    'properties_affected', (
      select count(distinct property_id)::int from public.aipify_hosts_owner_blocks
      where tenant_id = p_tenant_id and block_status in ('scheduled', 'active')
        and property_id is not null
    ),
    'block_conflicts', (
      select count(*)::int from (
        select b1.id from public.aipify_hosts_owner_blocks b1
        join public.aipify_hosts_owner_blocks b2
          on b2.tenant_id = b1.tenant_id and b2.property_id = b1.property_id and b2.id <> b1.id
        where b1.tenant_id = p_tenant_id
          and b1.block_status in ('scheduled', 'active')
          and b2.block_status in ('scheduled', 'active')
          and b1.start_date <= b2.end_date and b1.end_date >= b2.start_date
      ) x
    ),
    'availability_impact_pct', (
      select case when prop_count = 0 then 0
        else least(100, round((blocked::numeric / nullif(prop_count * 90, 0)) * 100, 0)::int)
      end
      from (
        select
          (select count(*) from public.aipify_hosts_properties p where p.tenant_id = p_tenant_id and p.status <> 'archived') as prop_count,
          (select coalesce(sum(least(b.end_date, current_date + 90) - greatest(b.start_date, current_date) + 1), 0)
           from public.aipify_hosts_owner_blocks b
           where b.tenant_id = p_tenant_id and b.block_status in ('scheduled', 'active')
             and b.start_date <= current_date + 90 and b.end_date >= current_date) as blocked
      ) s
    )
  ); $$;

create or replace function public._ahostown_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select b.id, p.display_name, b.start_date from public.aipify_hosts_owner_blocks b
    join public.aipify_hosts_properties p on p.id = b.property_id
    where b.tenant_id = p_tenant_id and b.block_type in ('personal_stay', 'family_stay')
      and b.block_status = 'scheduled' and b.start_date between current_date and current_date + 7
  loop
    perform public._ahostown_push_notification(p_tenant_id, 'own_appr_' || r.id::text, 'important',
      'Owner Stay Approaching', r.display_name || ' personal stay starts ' || r.start_date::text);
  end loop;

  for r in
    select b.id, p.display_name, b.end_date from public.aipify_hosts_owner_blocks b
    join public.aipify_hosts_properties p on p.id = b.property_id
    where b.tenant_id = p_tenant_id and b.block_type = 'seasonal_closure'
      and b.block_status = 'active' and b.end_date between current_date and current_date + 14
  loop
    perform public._ahostown_push_notification(p_tenant_id, 'own_seas_' || r.id::text, 'informational',
      'Seasonal Closure Ending', r.display_name || ' closure ends ' || r.end_date::text);
  end loop;

  for r in
    select b1.id, p.display_name from public.aipify_hosts_owner_blocks b1
    join public.aipify_hosts_owner_blocks b2
      on b2.tenant_id = b1.tenant_id and b2.property_id = b1.property_id and b2.id > b1.id
    join public.aipify_hosts_properties p on p.id = b1.property_id
    where b1.tenant_id = p_tenant_id
      and b1.block_status in ('scheduled', 'active')
      and b2.block_status in ('scheduled', 'active')
      and b1.start_date <= b2.end_date and b1.end_date >= b2.start_date
  loop
    perform public._ahostown_push_notification(p_tenant_id, 'own_conf_' || r.id::text, 'high',
      'Block Conflict Detected', 'Overlapping blocks at ' || r.display_name);
  end loop;

  for r in
    select b.id, p.display_name from public.aipify_hosts_owner_blocks b
    join public.aipify_hosts_properties p on p.id = b.property_id
    where b.tenant_id = p_tenant_id and b.block_type = 'operational_block'
      and b.block_status = 'active'
  loop
    perform public._ahostown_push_notification(p_tenant_id, 'own_ops_' || r.id::text, 'important',
      'Property Unavailable', r.display_name || ' blocked for operational use');
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_owner_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_oc public.aipify_hosts_owner_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_oc := public._ahostown_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_oc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp390_positioning(),
    'route', '/app/aipify-hosts/owner',
    'stats', public._ahostown_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_owner_center_dashboard(
  p_section text default 'owner_stays',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_oc public.aipify_hosts_owner_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_blocks jsonb; v_overrides jsonb; v_b record;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_oc := public._ahostown_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_oc.default_section, 'owner_stays');
  perform public._ahostown_seed_blocks(v_tenant_id);

  for v_b in select id from public.aipify_hosts_owner_blocks where tenant_id = v_tenant_id loop
    perform public._ahostown_refresh_block_status(v_b.id);
  end loop;

  perform public._ahostown_check_notifications(v_tenant_id);
  perform public._ahostown_log_event(v_tenant_id, 'dashboard_view', 'Owner Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(
    public._ahostown_block_row(b, p.display_name) order by b.start_date
  ), '[]'::jsonb) into v_blocks
  from public.aipify_hosts_owner_blocks b
  left join public.aipify_hosts_properties p on p.id = b.property_id
  where b.tenant_id = v_tenant_id
    and case v_section
      when 'owner_stays' then b.block_type in ('personal_stay', 'family_stay')
        and b.block_status in ('scheduled', 'active')
      when 'property_blocks' then b.block_type in (
        'maintenance_block', 'inspection_block', 'operational_block', 'seasonal_closure'
      ) and b.block_status in ('scheduled', 'active')
      when 'block_history' then b.block_status in ('completed', 'cancelled')
      else true
    end;

  select coalesce(jsonb_agg(
    public._ahostown_override_row(o, p.display_name) order by o.start_date
  ), '[]'::jsonb) into v_overrides
  from public.aipify_hosts_owner_availability_overrides o
  left join public.aipify_hosts_properties p on p.id = o.property_id
  where o.tenant_id = v_tenant_id and o.is_active
    and (v_section = 'availability_overrides' or v_section = 'owner_stays');

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_oc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp390_positioning(),
    'governance', jsonb_build_object(
      'audit_block_creation', true,
      'audit_block_modifications', true,
      'audit_block_cancellations', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp390_sections(),
    'block_types', jsonb_build_array(
      'personal_stay', 'family_stay', 'maintenance_block', 'inspection_block',
      'operational_block', 'seasonal_closure'
    ),
    'block_statuses', jsonb_build_array('scheduled', 'active', 'completed', 'cancelled'),
    'override_types', jsonb_build_array('block_reservations', 'extend_hold', 'min_stay_adjustment'),
    'stats', public._ahostown_dashboard_stats(v_tenant_id),
    'calendar_integration', jsonb_build_object(
      'master_calendar', true,
      'property_calendars', true,
      'occupancy_reports', true,
      'operations_center', true
    ),
    'owner_blocks', v_blocks,
    'availability_overrides', case when v_section = 'availability_overrides' then v_overrides else '[]'::jsonb end,
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 28 — Owner Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_28_OWNER_CENTER.text',
      'route', '/app/aipify-hosts/owner'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_owner_action(
  p_action_type text,
  p_block_id uuid default null,
  p_property_id uuid default null,
  p_start_date date default null,
  p_end_date date default null,
  p_block_type text default null,
  p_notes text default null,
  p_override_type text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_b public.aipify_hosts_owner_blocks;
  v_key text; v_id uuid; v_summary text; v_conflicts int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'create_owner_stay' then
    if p_start_date is null or p_end_date is null then raise exception 'Dates required'; end if;
    if p_block_type is null or p_block_type not in ('personal_stay', 'family_stay') then
      raise exception 'Invalid owner stay type';
    end if;
    v_conflicts := public._ahostown_detect_conflicts(v_tenant_id, p_property_id, p_start_date, p_end_date);
    v_key := 'own_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_owner_blocks (
      tenant_id, property_id, block_key, start_date, end_date, block_type, block_status, notes
    ) values (
      v_tenant_id, p_property_id, v_key, p_start_date, p_end_date, p_block_type, 'scheduled', p_notes
    ) returning id into v_id;
    perform public._ahostown_sync_calendar(v_id);
    perform public._ahostown_log_event(v_tenant_id, 'block_created', 'Owner stay created',
      jsonb_build_object('block_id', v_id, 'block_type', p_block_type, 'conflicts', v_conflicts));
    if v_conflicts > 0 then
      perform public._ahostown_push_notification(v_tenant_id, 'own_newconf_' || v_id::text, 'high',
        'Block Conflict Detected', 'New owner stay overlaps existing blocks');
    end if;
    v_summary := 'Owner stay scheduled';

  elsif p_action_type = 'create_property_block' then
    if p_start_date is null or p_end_date is null then raise exception 'Dates required'; end if;
    if p_block_type is null or p_block_type not in (
      'maintenance_block', 'inspection_block', 'operational_block', 'seasonal_closure'
    ) then raise exception 'Invalid block type'; end if;
    v_conflicts := public._ahostown_detect_conflicts(v_tenant_id, p_property_id, p_start_date, p_end_date);
    v_key := 'own_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_owner_blocks (
      tenant_id, property_id, block_key, start_date, end_date, block_type, block_status, notes
    ) values (
      v_tenant_id, p_property_id, v_key, p_start_date, p_end_date, p_block_type, 'scheduled', p_notes
    ) returning id into v_id;
    perform public._ahostown_sync_calendar(v_id);
    insert into public.aipify_hosts_owner_availability_overrides (
      tenant_id, property_id, override_key, start_date, end_date, override_type, notes, owner_block_id
    ) values (
      v_tenant_id, p_property_id, 'ovr_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
      p_start_date, p_end_date, 'block_reservations', coalesce(p_notes, 'Auto-linked to property block'), v_id
    );
    perform public._ahostown_log_event(v_tenant_id, 'block_created', 'Property block created',
      jsonb_build_object('block_id', v_id, 'block_type', p_block_type, 'conflicts', v_conflicts));
    if p_block_type = 'operational_block' then
      perform public._ahostown_push_notification(v_tenant_id, 'own_opsnew_' || v_id::text, 'important',
        'Property Unavailable', 'Operational block scheduled');
    end if;
    v_summary := 'Property block created';

  elsif p_action_type = 'modify_block' then
    select * into v_b from public.aipify_hosts_owner_blocks where id = p_block_id and tenant_id = v_tenant_id;
    if v_b.id is null then raise exception 'Block not found'; end if;
    update public.aipify_hosts_owner_blocks set
      start_date = coalesce(p_start_date, start_date),
      end_date = coalesce(p_end_date, end_date),
      notes = coalesce(p_notes, notes),
      updated_at = now()
    where id = p_block_id;
    perform public._ahostown_sync_calendar(p_block_id);
    perform public._ahostown_log_event(v_tenant_id, 'block_modified', 'Block modified',
      jsonb_build_object('block_id', p_block_id));
    v_summary := 'Block updated';

  elsif p_action_type = 'cancel_block' then
    select * into v_b from public.aipify_hosts_owner_blocks where id = p_block_id and tenant_id = v_tenant_id;
    if v_b.id is null then raise exception 'Block not found'; end if;
    update public.aipify_hosts_owner_blocks set block_status = 'cancelled', updated_at = now() where id = p_block_id;
    perform public._ahostown_sync_calendar(p_block_id);
    update public.aipify_hosts_owner_availability_overrides set is_active = false, updated_at = now()
    where owner_block_id = p_block_id;
    perform public._ahostown_log_event(v_tenant_id, 'block_cancelled', 'Block cancelled',
      jsonb_build_object('block_id', p_block_id));
    v_summary := 'Block cancelled';

  elsif p_action_type = 'activate_block' then
    select * into v_b from public.aipify_hosts_owner_blocks where id = p_block_id and tenant_id = v_tenant_id;
    if v_b.id is null then raise exception 'Block not found'; end if;
    update public.aipify_hosts_owner_blocks set block_status = 'active', updated_at = now() where id = p_block_id;
    perform public._ahostown_sync_calendar(p_block_id);
    perform public._ahostown_log_event(v_tenant_id, 'block_activated', 'Block activated',
      jsonb_build_object('block_id', p_block_id));
    v_summary := 'Block activated';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostown_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'block_id', coalesce(p_block_id, v_id)));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary,
    'block_id', coalesce(v_id, p_block_id));
end; $$;

create or replace function public.seed_aipify_hosts_owner_center_knowledge_airbnb28()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-owner', 'Hosts Owner Center',
    'Owner stays, property blocks, seasonal planning, and operational closure guidance.', 324
  );
  perform public._ahostkc_seed_article('aipify-hosts-owner', 'managing-owner-stays', 'Managing owner stays',
    'Schedule personal and family stays with clear dates, notes, and calendar visibility for your team.');
  perform public._ahostkc_seed_article('aipify-hosts-owner', 'seasonal-property-planning', 'Seasonal property planning',
    'Plan seasonal closures early so reservations, staffing, and vendor schedules stay aligned.');
  perform public._ahostkc_seed_article('aipify-hosts-owner', 'blocking-properties-correctly', 'Blocking properties correctly',
    'Owner blocks prevent new reservations and appear on master and property calendars and in occupancy reports.');
  perform public._ahostkc_seed_article('aipify-hosts-owner', 'operational-closure-guidance', 'Operational closure guidance',
    'Use maintenance, inspection, and operational blocks for shutdowns, renovations, deep cleaning, and utility upgrades.');
end; $$;

select public.seed_aipify_hosts_owner_center_knowledge_airbnb28();

grant execute on function public.get_aipify_hosts_owner_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_owner_center_dashboard(text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_owner_action(text, uuid, uuid, date, date, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_owner_center_knowledge_airbnb28() to authenticated;

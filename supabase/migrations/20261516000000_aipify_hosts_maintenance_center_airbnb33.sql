-- Phase Airbnb 33 — Aipify Hosts Maintenance Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostmnt_* (engine), _ahostbp395_* (blueprint)

create table if not exists public.aipify_hosts_maintenance_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'open_work_orders' check (
    default_section in (
      'open_work_orders', 'preventive_maintenance', 'scheduled_maintenance',
      'completed_maintenance', 'contractors'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_maintenance_center_settings enable row level security;
revoke all on public.aipify_hosts_maintenance_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_work_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  contractor_id uuid,
  work_order_key text not null,
  category text not null check (
    category in (
      'plumbing', 'electrical', 'hvac', 'appliances', 'furniture',
      'exterior', 'safety_equipment', 'general_repairs', 'other'
    )
  ),
  description text not null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  assigned_to text,
  due_date date,
  wo_status text not null default 'new' check (
    wo_status in (
      'new', 'assigned', 'scheduled', 'in_progress',
      'waiting_parts', 'completed', 'cancelled'
    )
  ),
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  issue_reported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, work_order_key)
);
create index if not exists aipify_hosts_work_orders_tenant_idx
  on public.aipify_hosts_work_orders (tenant_id, wo_status, priority, due_date);
alter table public.aipify_hosts_work_orders enable row level security;
revoke all on public.aipify_hosts_work_orders from authenticated, anon;

create table if not exists public.aipify_hosts_preventive_maintenance_schedules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  schedule_key text not null,
  task_name text not null,
  category text not null default 'safety_equipment' check (
    category in (
      'plumbing', 'electrical', 'hvac', 'appliances', 'furniture',
      'exterior', 'safety_equipment', 'general_repairs', 'other'
    )
  ),
  recurrence text not null check (
    recurrence in ('monthly', 'quarterly', 'semi_annual', 'annual')
  ),
  next_due_date date not null,
  last_completed_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, schedule_key)
);
create index if not exists aipify_hosts_preventive_maintenance_tenant_idx
  on public.aipify_hosts_preventive_maintenance_schedules (tenant_id, next_due_date, is_active);
alter table public.aipify_hosts_preventive_maintenance_schedules enable row level security;
revoke all on public.aipify_hosts_preventive_maintenance_schedules from authenticated, anon;

create table if not exists public.aipify_hosts_maintenance_contractors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contractor_key text not null,
  company_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  trade_category text not null check (
    trade_category in (
      'plumbing', 'electrical', 'hvac', 'appliances', 'furniture',
      'exterior', 'safety_equipment', 'general_repairs', 'other'
    )
  ),
  coverage_area text,
  contractor_status text not null default 'active' check (
    contractor_status in ('active', 'preferred', 'inactive')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, contractor_key)
);
create index if not exists aipify_hosts_maintenance_contractors_tenant_idx
  on public.aipify_hosts_maintenance_contractors (tenant_id, contractor_status, trade_category);
alter table public.aipify_hosts_maintenance_contractors enable row level security;
revoke all on public.aipify_hosts_maintenance_contractors from authenticated, anon;

alter table public.aipify_hosts_work_orders
  drop constraint if exists aipify_hosts_work_orders_contractor_id_fkey;
alter table public.aipify_hosts_work_orders
  add constraint aipify_hosts_work_orders_contractor_id_fkey
  foreign key (contractor_id) references public.aipify_hosts_maintenance_contractors (id) on delete set null;

create table if not exists public.aipify_hosts_maintenance_timeline_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  work_order_id uuid not null references public.aipify_hosts_work_orders (id) on delete cascade,
  event_type text not null check (
    event_type in ('issue_reported', 'work_order_created', 'assigned', 'started', 'completed')
  ),
  summary text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_maintenance_timeline_tenant_idx
  on public.aipify_hosts_maintenance_timeline_events (tenant_id, work_order_id, occurred_at desc);
alter table public.aipify_hosts_maintenance_timeline_events enable row level security;
revoke all on public.aipify_hosts_maintenance_timeline_events from authenticated, anon;

create table if not exists public.aipify_hosts_maintenance_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_maintenance_center_events_tenant_idx
  on public.aipify_hosts_maintenance_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_maintenance_center_events enable row level security;
revoke all on public.aipify_hosts_maintenance_center_events from authenticated, anon;

create or replace function public._ahostmnt_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_maintenance_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_maintenance_center_settings;
begin
  insert into public.aipify_hosts_maintenance_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_maintenance_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostmnt_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_maintenance_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'maintenance_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostmnt_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'maintenance_updates', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp395_positioning() returns text language sql immutable as $$
  select 'Centralize property maintenance — work orders, preventive schedules, contractors, and completion history in one Maintenance Center.'; $$;

create or replace function public._ahostbp395_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'open_work_orders', 'label', 'Open Work Orders'),
    jsonb_build_object('key', 'preventive_maintenance', 'label', 'Preventive Maintenance'),
    jsonb_build_object('key', 'scheduled_maintenance', 'label', 'Scheduled Maintenance'),
    jsonb_build_object('key', 'completed_maintenance', 'label', 'Completed Maintenance'),
    jsonb_build_object('key', 'contractors', 'label', 'Contractors')
  ); $$;

create or replace function public._ahostmnt_work_order_row(p_w public.aipify_hosts_work_orders, p_property text, p_contractor text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_w.id, 'work_order_key', p_w.work_order_key,
    'property_id', p_w.property_id, 'property', coalesce(p_property, '—'),
    'contractor_id', p_w.contractor_id, 'contractor', coalesce(p_contractor, '—'),
    'category', p_w.category, 'description', p_w.description,
    'priority', p_w.priority, 'assigned_to', coalesce(p_w.assigned_to, '—'),
    'due_date', coalesce(p_w.due_date::text, ''),
    'wo_status', p_w.wo_status,
    'scheduled_at', coalesce(p_w.scheduled_at::text, ''),
    'started_at', coalesce(p_w.started_at::text, ''),
    'completed_at', coalesce(p_w.completed_at::text, ''),
    'issue_reported_at', coalesce(p_w.issue_reported_at::text, ''),
    'is_overdue', case when p_w.due_date is not null and p_w.due_date < current_date
      and p_w.wo_status not in ('completed', 'cancelled') then true else false end
  ); $$;

create or replace function public._ahostmnt_preventive_row(p_s public.aipify_hosts_preventive_maintenance_schedules, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_s.id, 'schedule_key', p_s.schedule_key, 'task_name', p_s.task_name,
    'property_id', p_s.property_id, 'property', coalesce(p_property, '—'),
    'category', p_s.category, 'recurrence', p_s.recurrence,
    'next_due_date', p_s.next_due_date::text,
    'last_completed_at', coalesce(p_s.last_completed_at::text, ''),
    'is_active', p_s.is_active,
    'is_due', p_s.next_due_date <= current_date and p_s.is_active
  ); $$;

create or replace function public._ahostmnt_contractor_row(p_c public.aipify_hosts_maintenance_contractors)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id, 'contractor_key', p_c.contractor_key,
    'company_name', p_c.company_name,
    'contact_name', coalesce(p_c.contact_name, '—'),
    'contact_email', coalesce(p_c.contact_email, ''),
    'contact_phone', coalesce(p_c.contact_phone, ''),
    'trade_category', p_c.trade_category,
    'coverage_area', coalesce(p_c.coverage_area, '—'),
    'contractor_status', p_c.contractor_status
  ); $$;

create or replace function public._ahostmnt_timeline_row(p_t public.aipify_hosts_maintenance_timeline_events)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_t.id, 'work_order_id', p_t.work_order_id,
    'event_type', p_t.event_type, 'summary', coalesce(p_t.summary, ''),
    'occurred_at', p_t.occurred_at::text
  ); $$;

create or replace function public._ahostmnt_add_timeline(
  p_tenant_id uuid, p_work_order_id uuid, p_event_type text, p_summary text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_maintenance_timeline_events (
    tenant_id, work_order_id, event_type, summary, occurred_at
  ) values (p_tenant_id, p_work_order_id, p_event_type, p_summary, now());
end; $$;

create or replace function public._ahostmnt_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'open_work_orders', (
      select count(*)::int from public.aipify_hosts_work_orders
      where tenant_id = p_tenant_id and wo_status not in ('completed', 'cancelled')
    ),
    'critical_items', (
      select count(*)::int from public.aipify_hosts_work_orders
      where tenant_id = p_tenant_id and priority = 'critical'
        and wo_status not in ('completed', 'cancelled')
    ),
    'upcoming_preventive', (
      select count(*)::int from public.aipify_hosts_preventive_maintenance_schedules
      where tenant_id = p_tenant_id and is_active = true
        and next_due_date <= current_date + interval '30 days'
    ),
    'overdue_tasks', (
      select count(*)::int from public.aipify_hosts_work_orders
      where tenant_id = p_tenant_id and due_date < current_date
        and wo_status not in ('completed', 'cancelled')
    ),
    'scheduled_count', (
      select count(*)::int from public.aipify_hosts_work_orders
      where tenant_id = p_tenant_id and wo_status = 'scheduled'
    ),
    'active_contractors', (
      select count(*)::int from public.aipify_hosts_maintenance_contractors
      where tenant_id = p_tenant_id and contractor_status in ('active', 'preferred')
    )
  ); $$;

create or replace function public._ahostmnt_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_prop uuid;
  v_contractor uuid;
  v_wo uuid;
begin
  if exists (select 1 from public.aipify_hosts_work_orders where tenant_id = p_tenant_id limit 1) then return; end if;

  select id into v_prop from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active' order by created_at limit 1;

  insert into public.aipify_hosts_maintenance_contractors (
    tenant_id, contractor_key, company_name, contact_name, contact_email, contact_phone,
    trade_category, coverage_area, contractor_status
  ) values
    (p_tenant_id, 'ctr_001', 'Nordic Plumbing AS', 'Erik Hansen', 'erik@nordicplumbing.no', '+47 900 11 001', 'plumbing', 'Bergen region', 'preferred'),
    (p_tenant_id, 'ctr_002', 'Coastal HVAC Service', 'Anna Berg', 'anna@coastalhvac.no', '+47 900 22 002', 'hvac', 'Western Norway', 'active')
  on conflict (tenant_id, contractor_key) do nothing;

  select id into v_contractor from public.aipify_hosts_maintenance_contractors
  where tenant_id = p_tenant_id and contractor_key = 'ctr_001';

  insert into public.aipify_hosts_preventive_maintenance_schedules (
    tenant_id, property_id, schedule_key, task_name, category, recurrence, next_due_date
  ) values
    (p_tenant_id, v_prop, 'pm_smoke', 'Smoke detector testing', 'safety_equipment', 'quarterly', current_date + 14),
    (p_tenant_id, v_prop, 'pm_hvac', 'HVAC servicing', 'hvac', 'semi_annual', current_date + 45),
    (p_tenant_id, v_prop, 'pm_water_heater', 'Water heater inspection', 'plumbing', 'annual', current_date + 90),
    (p_tenant_id, v_prop, 'pm_fire_ext', 'Fire extinguisher inspection', 'safety_equipment', 'annual', current_date + 60),
    (p_tenant_id, v_prop, 'pm_exterior', 'Exterior inspection', 'exterior', 'semi_annual', current_date + 30)
  on conflict (tenant_id, schedule_key) do nothing;

  insert into public.aipify_hosts_work_orders (
    tenant_id, property_id, contractor_id, work_order_key, category, description,
    priority, assigned_to, due_date, wo_status, issue_reported_at
  ) values
    (p_tenant_id, v_prop, v_contractor, 'wo_001', 'plumbing', 'Guest reported slow kitchen drain — inspect trap and line.', 'high', 'Property Manager', current_date + 2, 'assigned', now() - interval '1 day'),
    (p_tenant_id, v_prop, null, 'wo_002', 'electrical', 'Replace flickering hallway light fixture.', 'medium', 'Maintenance Lead', current_date + 5, 'new', now() - interval '6 hours'),
    (p_tenant_id, v_prop, null, 'wo_003', 'hvac', 'Annual HVAC filter replacement and system check.', 'low', 'Coastal HVAC Service', current_date + 14, 'scheduled', now() - interval '3 days'),
    (p_tenant_id, v_prop, null, 'wo_004', 'general_repairs', 'Repair loose handrail on exterior stairs.', 'critical', 'Property Manager', current_date - 1, 'in_progress', now() - interval '2 days'),
    (p_tenant_id, v_prop, v_contractor, 'wo_005', 'plumbing', 'Fixed leaking bathroom faucet.', 'medium', 'Nordic Plumbing AS', current_date - 7, 'completed', now() - interval '10 days')
  on conflict (tenant_id, work_order_key) do nothing;

  for v_wo in select id from public.aipify_hosts_work_orders where tenant_id = p_tenant_id
  loop
    perform public._ahostmnt_add_timeline(p_tenant_id, v_wo, 'issue_reported', 'Issue reported');
    perform public._ahostmnt_add_timeline(p_tenant_id, v_wo, 'work_order_created', 'Work order created');
  end loop;

  update public.aipify_hosts_work_orders set
    started_at = now() - interval '4 hours', contractor_id = v_contractor
  where tenant_id = p_tenant_id and work_order_key = 'wo_004';

  update public.aipify_hosts_work_orders set
    completed_at = now() - interval '3 days', started_at = now() - interval '5 days'
  where tenant_id = p_tenant_id and work_order_key = 'wo_005';
end; $$;

create or replace function public.get_aipify_hosts_maintenance_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hosts public.aipify_hosts_settings; v_stats jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostmnt_ensure_settings(v_tenant_id);
  v_stats := public._ahostmnt_dashboard_stats(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'enabled', v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'open_work_orders', v_stats->'open_work_orders',
    'critical_items', v_stats->'critical_items',
    'philosophy', public._ahostbp395_positioning()
  );
end; $$;

create or replace function public.get_aipify_hosts_maintenance_center_dashboard(
  p_section text default 'open_work_orders',
  p_property_id uuid default null,
  p_status text default null,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_mc public.aipify_hosts_maintenance_center_settings;
  v_hosts public.aipify_hosts_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'open_work_orders');
  v_work_orders jsonb := '[]'::jsonb;
  v_preventive jsonb := '[]'::jsonb;
  v_contractors jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_mc := public._ahostmnt_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostmnt_seed_demo(v_tenant_id);

  select coalesce(jsonb_agg(
    public._ahostmnt_work_order_row(w, p.display_name, c.company_name)
    order by case w.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end, w.due_date nulls last
  ), '[]'::jsonb) into v_work_orders
  from public.aipify_hosts_work_orders w
  left join public.aipify_hosts_properties p on p.id = w.property_id
  left join public.aipify_hosts_maintenance_contractors c on c.id = w.contractor_id
  where w.tenant_id = v_tenant_id
    and (p_property_id is null or w.property_id = p_property_id)
    and (p_status is null or w.wo_status = p_status)
    and (
      (v_section = 'open_work_orders' and w.wo_status not in ('completed', 'cancelled'))
      or (v_section = 'scheduled_maintenance' and w.wo_status = 'scheduled')
      or (v_section = 'completed_maintenance' and w.wo_status = 'completed')
      or v_section in ('open_work_orders', 'scheduled_maintenance', 'completed_maintenance')
    );

  if v_section = 'open_work_orders' then
    select coalesce(jsonb_agg(r order by (r->>'priority'), (r->>'due_date')), '[]'::jsonb) into v_work_orders
    from jsonb_array_elements(v_work_orders) r
    where r->>'wo_status' not in ('completed', 'cancelled');
  elsif v_section = 'scheduled_maintenance' then
    select coalesce(jsonb_agg(r order by (r->>'scheduled_at')), '[]'::jsonb) into v_work_orders
    from jsonb_array_elements(v_work_orders) r where r->>'wo_status' = 'scheduled';
  elsif v_section = 'completed_maintenance' then
    select coalesce(jsonb_agg(r order by (r->>'completed_at') desc), '[]'::jsonb) into v_work_orders
    from jsonb_array_elements(v_work_orders) r where r->>'wo_status' = 'completed';
  end if;

  select coalesce(jsonb_agg(
    public._ahostmnt_preventive_row(s, p.display_name) order by s.next_due_date
  ), '[]'::jsonb) into v_preventive
  from public.aipify_hosts_preventive_maintenance_schedules s
  left join public.aipify_hosts_properties p on p.id = s.property_id
  where s.tenant_id = v_tenant_id and s.is_active = true
    and (p_property_id is null or s.property_id = p_property_id);

  select coalesce(jsonb_agg(
    public._ahostmnt_contractor_row(c) order by case c.contractor_status when 'preferred' then 1 when 'active' then 2 else 3 end, c.company_name
  ), '[]'::jsonb) into v_contractors
  from public.aipify_hosts_maintenance_contractors c
  where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(
    public._ahostmnt_timeline_row(t) order by t.occurred_at desc
  ), '[]'::jsonb) into v_timeline
  from public.aipify_hosts_maintenance_timeline_events t
  where t.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_mc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp395_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_work_order_creation', true,
      'audit_assignment_changes', true,
      'audit_status_changes', true,
      'audit_closures', true
    ),
    'sections', public._ahostbp395_sections(),
    'stats', public._ahostmnt_dashboard_stats(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'work_orders', case when v_section <> 'preventive_maintenance' and v_section <> 'contractors' then v_work_orders else '[]'::jsonb end,
    'preventive_schedules', case when v_section in ('preventive_maintenance', 'open_work_orders') then v_preventive else '[]'::jsonb end,
    'contractors', case when v_section = 'contractors' or v_section = 'open_work_orders' then v_contractors else v_contractors end,
    'timeline', v_timeline,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 33 — Maintenance Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_33_MAINTENANCE_CENTER.text',
      'route', '/app/aipify-hosts/maintenance'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_maintenance_action(
  p_action_type text,
  p_work_order_id uuid default null,
  p_contractor_id uuid default null,
  p_priority text default null,
  p_scheduled_at timestamptz default null,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_wo public.aipify_hosts_work_orders;
  v_summary text;
  v_old_status text;
  v_old_priority text;
  v_old_contractor uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'create_work_order' then
    insert into public.aipify_hosts_work_orders (
      tenant_id, property_id, work_order_key, category, description, priority, assigned_to, due_date, wo_status
    ) values (
      v_tenant_id,
      (p_notes::jsonb->>'property_id')::uuid,
      'wo_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
      coalesce(p_notes::jsonb->>'category', 'general_repairs'),
      coalesce(p_notes::jsonb->>'description', 'Maintenance work order'),
      coalesce(p_priority, coalesce(p_notes::jsonb->>'priority', 'medium')),
      coalesce(p_notes::jsonb->>'assigned_to', null),
      coalesce((p_notes::jsonb->>'due_date')::date, current_date + 7),
      'new'
    ) returning * into v_wo;
    perform public._ahostmnt_add_timeline(v_tenant_id, v_wo.id, 'issue_reported', 'Issue reported');
    perform public._ahostmnt_add_timeline(v_tenant_id, v_wo.id, 'work_order_created', 'Work order created');
    perform public._ahostmnt_log_event(v_tenant_id, 'work_order_created', 'Work order created',
      jsonb_build_object('work_order_id', v_wo.id, 'priority', v_wo.priority));
    if v_wo.priority = 'critical' then
      perform public._ahostmnt_push_notification(v_tenant_id, 'mnt_critical_' || v_wo.id, 'critical',
        'Critical maintenance work order', v_wo.description);
    end if;
    return jsonb_build_object('success', true, 'work_order_id', v_wo.id, 'summary', 'Work order created');

  elsif p_work_order_id is not null then
    select * into v_wo from public.aipify_hosts_work_orders
    where id = p_work_order_id and tenant_id = v_tenant_id;
    if v_wo.id is null then raise exception 'Work order not found'; end if;
    v_old_status := v_wo.wo_status;
    v_old_priority := v_wo.priority;
    v_old_contractor := v_wo.contractor_id;
  end if;

  if p_action_type = 'assign_contractor' and p_work_order_id is not null then
    update public.aipify_hosts_work_orders set
      contractor_id = p_contractor_id,
      assigned_to = coalesce((select company_name from public.aipify_hosts_maintenance_contractors where id = p_contractor_id), assigned_to),
      wo_status = case when wo_status = 'new' then 'assigned' else wo_status end,
      updated_at = now()
    where id = p_work_order_id and tenant_id = v_tenant_id;
    perform public._ahostmnt_add_timeline(v_tenant_id, p_work_order_id, 'assigned', 'Contractor assigned');
    perform public._ahostmnt_log_event(v_tenant_id, 'assignment_changed', 'Contractor assigned',
      jsonb_build_object('work_order_id', p_work_order_id, 'from_contractor', v_old_contractor, 'to_contractor', p_contractor_id));
    v_summary := 'Contractor assigned';

  elsif p_action_type = 'change_priority' and p_work_order_id is not null then
    update public.aipify_hosts_work_orders set priority = coalesce(p_priority, priority), updated_at = now()
    where id = p_work_order_id and tenant_id = v_tenant_id;
    perform public._ahostmnt_log_event(v_tenant_id, 'priority_changed', 'Priority updated',
      jsonb_build_object('work_order_id', p_work_order_id, 'from', v_old_priority, 'to', p_priority));
    if p_priority = 'critical' then
      perform public._ahostmnt_push_notification(v_tenant_id, 'mnt_critical_' || p_work_order_id, 'critical',
        'Critical maintenance work order', v_wo.description);
    end if;
    v_summary := 'Priority updated';

  elsif p_action_type = 'schedule_maintenance' and p_work_order_id is not null then
    update public.aipify_hosts_work_orders set
      wo_status = 'scheduled', scheduled_at = coalesce(p_scheduled_at, now() + interval '1 day'), updated_at = now()
    where id = p_work_order_id and tenant_id = v_tenant_id;
    perform public._ahostmnt_log_event(v_tenant_id, 'status_changed', 'Maintenance scheduled',
      jsonb_build_object('work_order_id', p_work_order_id, 'from', v_old_status, 'to', 'scheduled'));
    v_summary := 'Maintenance scheduled';

  elsif p_action_type = 'start_work_order' and p_work_order_id is not null then
    update public.aipify_hosts_work_orders set
      wo_status = 'in_progress', started_at = now(), updated_at = now()
    where id = p_work_order_id and tenant_id = v_tenant_id;
    perform public._ahostmnt_add_timeline(v_tenant_id, p_work_order_id, 'started', 'Work started');
    perform public._ahostmnt_log_event(v_tenant_id, 'status_changed', 'Work started',
      jsonb_build_object('work_order_id', p_work_order_id, 'from', v_old_status, 'to', 'in_progress'));
    v_summary := 'Work started';

  elsif p_action_type = 'close_work_order' and p_work_order_id is not null then
    update public.aipify_hosts_work_orders set
      wo_status = 'completed', completed_at = now(), updated_at = now()
    where id = p_work_order_id and tenant_id = v_tenant_id;
    perform public._ahostmnt_add_timeline(v_tenant_id, p_work_order_id, 'completed', coalesce(p_notes, 'Work order closed'));
    perform public._ahostmnt_log_event(v_tenant_id, 'work_order_closed', 'Work order closed',
      jsonb_build_object('work_order_id', p_work_order_id, 'notes', p_notes));
    perform public._ahostmnt_push_notification(v_tenant_id, 'mnt_done_' || p_work_order_id, 'informational',
      'Maintenance completed', coalesce(p_notes, 'Work order marked complete.'));
    v_summary := 'Work order closed';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostmnt_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'work_order_id', p_work_order_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_maintenance_center_knowledge_airbnb33()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-maintenance', 'Hosts Maintenance Center',
    'Preventive maintenance, property repairs, contractors, and hospitality maintenance standards.', 328
  );
  perform public._ahostkc_seed_article('aipify-hosts-maintenance', 'preventive-maintenance-standards', 'Preventive maintenance standards',
    'Schedule smoke detector testing, HVAC servicing, water heater inspection, fire extinguisher checks, and exterior inspections on recurring cycles.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance', 'managing-property-repairs', 'Managing property repairs',
    'Create work orders with clear descriptions, priorities, and due dates. Track status from new through completion.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance', 'working-with-contractors', 'Working with contractors',
    'Maintain contractor records with trade category, coverage area, and preferred status for reliable assignments.');
  perform public._ahostkc_seed_article('aipify-hosts-maintenance', 'hospitality-maintenance-best-practices', 'Hospitality maintenance best practices',
    'Proactive maintenance protects guest experience. Address critical items immediately and schedule preventive tasks before failures impact stays.');
end; $$;

select public.seed_aipify_hosts_maintenance_center_knowledge_airbnb33();

grant execute on function public.get_aipify_hosts_maintenance_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_maintenance_center_dashboard(text, uuid, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_maintenance_action(text, uuid, uuid, text, timestamptz, text, uuid) to authenticated;

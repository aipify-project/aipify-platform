-- Phase 562 — Companion Real-World Services, Approved Action Network & External Coordination Engine
-- Feature owner: CUSTOMER APP. Routes: /app/companion/services/actions, /app/companion/bookings. Helpers: _cmrw562_*

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_real_world_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  coordination_enabled boolean not null default true,
  human_approval_required boolean not null default true,
  cost_governance_enabled boolean not null default true,
  location_awareness_enabled boolean not null default true,
  booking_engine_enabled boolean not null default true,
  audit_logging_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_real_world_settings enable row level security;
revoke all on public.organization_companion_real_world_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Requests, approvals, bookings, executions, deliveries
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_real_world_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_key text not null,
  service_title text not null,
  service_category text not null check (
    service_category in (
      'travel', 'transportation', 'food', 'hospitality', 'flowers', 'property_services',
      'cleaning', 'maintenance', 'professional_services', 'courier', 'events', 'custom'
    )
  ),
  provider_key text not null default '',
  provider_name text not null default '',
  request_status text not null default 'pending_review' check (
    request_status in (
      'draft', 'pending_review', 'pending_approval', 'approved', 'executing',
      'completed', 'cancelled', 'rejected'
    )
  ),
  estimated_cost_nok numeric(12,2),
  currency_code text not null default 'NOK',
  location_label text not null default '',
  country text not null default 'Norway',
  region text not null default '',
  city text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, request_key)
);

alter table public.organization_companion_real_world_requests enable row level security;
revoke all on public.organization_companion_real_world_requests from authenticated, anon;

create table if not exists public.organization_companion_real_world_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  request_key text not null,
  approval_title text not null,
  approval_level text not null check (
    approval_level in ('employee', 'manager', 'department', 'finance', 'executive')
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'denied', 'escalated')
  ),
  step_order integer not null default 1,
  cost_threshold_nok numeric(12,2),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, approval_key)
);

alter table public.organization_companion_real_world_approvals enable row level security;
revoke all on public.organization_companion_real_world_approvals from authenticated, anon;

create table if not exists public.organization_companion_real_world_bookings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  booking_key text not null,
  request_key text not null,
  service_title text not null,
  provider_key text not null default '',
  provider_name text not null default '',
  booking_status text not null default 'pending' check (
    booking_status in ('pending', 'confirmed', 'requires_review', 'cancelled')
  ),
  scheduled_at timestamptz,
  location_label text not null default '',
  estimated_cost_nok numeric(12,2),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'denied', 'not_required')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, booking_key)
);

alter table public.organization_companion_real_world_bookings enable row level security;
revoke all on public.organization_companion_real_world_bookings from authenticated, anon;

create table if not exists public.organization_companion_real_world_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  execution_key text not null,
  request_key text not null,
  execution_title text not null,
  execution_status text not null default 'scheduled' check (
    execution_status in ('scheduled', 'in_progress', 'completed', 'delayed', 'cancelled')
  ),
  provider_name text not null default '',
  outcome_summary text not null default '' check (char_length(outcome_summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, execution_key)
);

alter table public.organization_companion_real_world_executions enable row level security;
revoke all on public.organization_companion_real_world_executions from authenticated, anon;

create table if not exists public.organization_companion_real_world_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  delivery_key text not null,
  delivery_title text not null,
  delivery_type text not null default 'courier' check (
    delivery_type in ('courier', 'flowers', 'equipment', 'food', 'gift', 'custom')
  ),
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'in_transit', 'delivered', 'delayed', 'cancelled')
  ),
  provider_name text not null default '',
  destination_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, delivery_key)
);

alter table public.organization_companion_real_world_deliveries enable row level security;
revoke all on public.organization_companion_real_world_deliveries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Cost governance, availability, locations, business packs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_real_world_cost_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  service_category text not null,
  auto_approve_below_nok numeric(12,2),
  approval_level text not null check (
    approval_level in ('employee', 'manager', 'department', 'finance', 'executive')
  ),
  department_limit_nok numeric(12,2),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_companion_real_world_cost_rules enable row level security;
revoke all on public.organization_companion_real_world_cost_rules from authenticated, anon;

create table if not exists public.organization_companion_real_world_provider_availability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  service_category text not null,
  location_city text not null default '',
  overall_rating numeric(3,2) not null default 4.0,
  response_time_hours numeric(8,2) not null default 4,
  service_capacity text not null default 'available' check (
    service_capacity in ('available', 'limited', 'unavailable')
  ),
  coverage_regions jsonb not null default '[]'::jsonb,
  unique (organization_id, provider_key, service_category)
);

alter table public.organization_companion_real_world_provider_availability enable row level security;
revoke all on public.organization_companion_real_world_provider_availability from authenticated, anon;

create table if not exists public.organization_companion_real_world_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_key text not null,
  location_title text not null,
  location_type text not null check (
    location_type in ('country', 'region', 'city', 'property', 'office', 'warehouse')
  ),
  country text not null default 'Norway',
  region text not null default '',
  city text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, location_key)
);

alter table public.organization_companion_real_world_locations enable row level security;
revoke all on public.organization_companion_real_world_locations from authenticated, anon;

create table if not exists public.organization_companion_real_world_business_pack_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  service_categories jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_real_world_business_pack_links enable row level security;
revoke all on public.organization_companion_real_world_business_pack_links from authenticated, anon;

create table if not exists public.organization_companion_real_world_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'coordination' check (
    audit_category in ('request', 'approval', 'booking', 'execution', 'delivery', 'cost', 'provider')
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_real_world_audit_logs_org_idx
  on public.organization_companion_real_world_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_real_world_audit_logs enable row level security;
revoke all on public.organization_companion_real_world_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmrw562_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmrw562_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'coordination'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_real_world_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'coordination'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmrw562_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_real_world_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmrw562_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_companion_real_world_requests
    where organization_id = p_org_id limit 1
  ) then
    return;
  end if;

  insert into public.organization_companion_real_world_cost_rules (
    organization_id, rule_key, rule_title, service_category,
    auto_approve_below_nok, approval_level, department_limit_nok, summary
  ) values
    (p_org_id, 'cost_taxi', 'Taxi Auto-Approval', 'transportation', 1500, 'employee', 5000,
     'Taxi under 1,500 NOK approved automatically.'),
    (p_org_id, 'cost_hotel', 'Hotel Manager Approval', 'hospitality', null, 'manager', 15000,
     'Hotel booking requires manager approval.'),
    (p_org_id, 'cost_event', 'Conference Executive Approval', 'events', null, 'executive', 50000,
     'Conference events require executive approval.'),
    (p_org_id, 'cost_multi_step', 'High Expense Multi-Step', 'custom', null, 'finance', 100000,
     'Expenses over 10,000 NOK: Manager → Finance → Executive.');

  insert into public.organization_companion_real_world_locations (
    organization_id, location_key, location_title, location_type, country, region, city, summary
  ) values
    (p_org_id, 'loc_norway', 'Norway', 'country', 'Norway', '', '', 'Primary operating country.'),
    (p_org_id, 'loc_bergen', 'Bergen', 'city', 'Norway', 'Vestland', 'Bergen', 'Head office city.'),
    (p_org_id, 'loc_hq_office', 'Head Office', 'office', 'Norway', 'Vestland', 'Bergen', 'Main office location.'),
    (p_org_id, 'loc_warehouse', 'Central Warehouse', 'warehouse', 'Norway', 'Vestland', 'Bergen', 'Logistics hub.');

  insert into public.organization_companion_real_world_provider_availability (
    organization_id, provider_key, provider_name, service_category,
    location_city, overall_rating, response_time_hours, service_capacity, coverage_regions
  ) values
    (p_org_id, 'prov_taxi_bergen', 'Bergen Executive Transport', 'transportation',
     'Bergen', 4.8, 0.5, 'available', '["Vestland","Oslo"]'::jsonb),
    (p_org_id, 'prov_hotel_nordic', 'Nordic Business Hotels', 'hospitality',
     'Bergen', 4.6, 2.0, 'available', '["Norway"]'::jsonb),
    (p_org_id, 'prov_property_nord', 'Property Nord Services', 'cleaning',
     'Bergen', 4.2, 4.0, 'limited', '["Vestland"]'::jsonb),
    (p_org_id, 'prov_nordic_accounting', 'Nordic Accounting AS', 'professional_services',
     'Bergen', 4.8, 4.5, 'available', '["Norway"]'::jsonb);

  insert into public.organization_companion_real_world_requests (
    organization_id, request_key, service_title, service_category, provider_key, provider_name,
    request_status, estimated_cost_nok, location_label, country, city, summary
  ) values
    (p_org_id, 'req_airport_transfer', 'Airport Transfer', 'transportation', 'prov_taxi_bergen', 'Bergen Executive Transport',
     'pending_approval', 890, 'Bergen Airport Flesland', 'Norway', 'Bergen', 'Executive airport transfer — awaiting approval.'),
    (p_org_id, 'req_hotel_oslo', 'Hotel Booking Oslo', 'hospitality', 'prov_hotel_nordic', 'Nordic Business Hotels',
     'pending_approval', 4500, 'Oslo City Centre', 'Norway', 'Oslo', 'Business travel hotel — manager approval required.'),
    (p_org_id, 'req_team_lunch', 'Team Lunch Catering', 'food', 'prov_catering_local', 'Local Catering Partner',
     'approved', 3200, 'Head Office', 'Norway', 'Bergen', 'Meeting catering approved.'),
    (p_org_id, 'req_cleaning_hosts', 'Property Cleaning', 'cleaning', 'prov_property_nord', 'Property Nord Services',
     'executing', 1800, 'Hosts Property', 'Norway', 'Bergen', 'Hosts Pack cleaning service in progress.'),
    (p_org_id, 'req_flowers_client', 'Flower Delivery', 'flowers', 'prov_flowers_bergen', 'Bergen Florist',
     'completed', 650, 'Client Office', 'Norway', 'Bergen', 'Customer appreciation gift delivered.'),
    (p_org_id, 'req_accounting_consult', 'Accounting Consultation', 'professional_services', 'prov_nordic_accounting', 'Nordic Accounting AS',
     'pending_review', 2500, 'Head Office', 'Norway', 'Bergen', 'Verified provider consultation — review terms.');

  insert into public.organization_companion_real_world_approvals (
    organization_id, approval_key, request_key, approval_title, approval_level, approval_status, step_order, cost_threshold_nok, summary
  ) values
    (p_org_id, 'appr_transfer_mgr', 'req_airport_transfer', 'Manager Approval — Transfer', 'manager', 'pending', 1, 1500,
     'Transportation request awaiting manager approval.'),
    (p_org_id, 'appr_hotel_mgr', 'req_hotel_oslo', 'Manager Approval — Hotel', 'manager', 'pending', 1, 4500,
     'Hotel booking requires manager approval per cost governance.'),
    (p_org_id, 'appr_event_exec', 'req_conference_future', 'Executive Approval — Conference', 'executive', 'pending', 3, 10000,
     'Multi-step chain: Manager → Finance → Executive for expenses over 10,000 NOK.');

  insert into public.organization_companion_real_world_bookings (
    organization_id, booking_key, request_key, service_title, provider_key, provider_name,
    booking_status, scheduled_at, location_label, estimated_cost_nok, approval_status, summary
  ) values
    (p_org_id, 'bkg_transfer_001', 'req_airport_transfer', 'Airport Transfer', 'prov_taxi_bergen', 'Bergen Executive Transport',
     'pending', now() + interval '2 days', 'Bergen Airport Flesland', 890, 'pending', 'Pending approval before confirmation.'),
    (p_org_id, 'bkg_lunch_001', 'req_team_lunch', 'Team Lunch Catering', 'prov_catering_local', 'Local Catering Partner',
     'confirmed', now() + interval '1 day', 'Head Office', 3200, 'approved', 'Catering confirmed for team meeting.'),
    (p_org_id, 'bkg_hotel_001', 'req_hotel_oslo', 'Hotel Booking Oslo', 'prov_hotel_nordic', 'Nordic Business Hotels',
     'requires_review', now() + interval '5 days', 'Oslo City Centre', 4500, 'pending', 'Requires manager approval before confirmation.');

  insert into public.organization_companion_real_world_executions (
    organization_id, execution_key, request_key, execution_title, execution_status, provider_name, outcome_summary
  ) values
    (p_org_id, 'exe_cleaning_001', 'req_cleaning_hosts', 'Property Cleaning Execution', 'in_progress', 'Property Nord Services',
     'Cleaning crew scheduled — execution in progress.'),
    (p_org_id, 'exe_flowers_001', 'req_flowers_client', 'Flower Delivery Execution', 'completed', 'Bergen Florist',
     'Delivery confirmed — recipient acknowledged.');

  insert into public.organization_companion_real_world_deliveries (
    organization_id, delivery_key, delivery_title, delivery_type, delivery_status, provider_name, destination_label, summary
  ) values
    (p_org_id, 'del_flowers_001', 'Client Appreciation Flowers', 'flowers', 'delivered', 'Bergen Florist', 'Client Office Bergen',
     'Flower delivery completed successfully.'),
    (p_org_id, 'del_equipment_001', 'Office Equipment Delivery', 'equipment', 'in_transit', 'Courier Nord', 'Head Office',
     'Equipment delivery in transit.');

  insert into public.organization_companion_real_world_business_pack_links (
    organization_id, pack_key, pack_title, service_categories, summary
  ) values
    (p_org_id, 'pack_hosts', 'Hosts Pack', '["cleaning","maintenance","property_services"]'::jsonb,
     'Cleaning and property maintenance for hosts.'),
    (p_org_id, 'pack_executive', 'Executive Pack', '["travel","transportation","hospitality"]'::jsonb,
     'Travel, hotels, and executive transportation.'),
    (p_org_id, 'pack_partner', 'Partner Pack', '["professional_services","consulting"]'::jsonb,
     'Business services and consultations for partners.');
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_companion_real_world_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_overview jsonb;
  v_requests jsonb;
  v_approvals jsonb;
  v_providers jsonb;
  v_bookings jsonb;
  v_deliveries jsonb;
  v_executions jsonb;
  v_reports jsonb;
  v_executive jsonb;
  v_integrations jsonb;
  v_audit jsonb;
begin
  v_org_id := public._cmrw562_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'error', 'Organization not found');
  end if;

  perform public._cmrw562_ensure_settings(v_org_id);
  perform public._cmrw562_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name)
  into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'active_requests', (select count(*) from public.organization_companion_real_world_requests where organization_id = v_org_id and request_status not in ('completed', 'cancelled', 'rejected')),
    'pending_approvals', (select count(*) from public.organization_companion_real_world_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'upcoming_bookings', (select count(*) from public.organization_companion_real_world_bookings where organization_id = v_org_id and booking_status in ('pending', 'confirmed')),
    'active_executions', (select count(*) from public.organization_companion_real_world_executions where organization_id = v_org_id and execution_status in ('scheduled', 'in_progress')),
    'active_deliveries', (select count(*) from public.organization_companion_real_world_deliveries where organization_id = v_org_id and delivery_status in ('pending', 'in_transit')),
    'total_service_cost_nok', coalesce((select sum(estimated_cost_nok) from public.organization_companion_real_world_requests where organization_id = v_org_id), 0),
    'completed_services', (select count(*) from public.organization_companion_real_world_requests where organization_id = v_org_id and request_status = 'completed')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'request_key', r.request_key, 'service_title', r.service_title, 'service_category', r.service_category,
    'provider_key', r.provider_key, 'provider_name', r.provider_name, 'request_status', r.request_status,
    'estimated_cost_nok', r.estimated_cost_nok, 'location_label', r.location_label,
    'country', r.country, 'city', r.city, 'summary', r.summary, 'recorded_at', r.recorded_at
  ) order by r.recorded_at desc), '[]'::jsonb)
  into v_requests from public.organization_companion_real_world_requests r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'approval_key', a.approval_key, 'request_key', a.request_key, 'approval_title', a.approval_title,
    'approval_level', a.approval_level, 'approval_status', a.approval_status,
    'step_order', a.step_order, 'cost_threshold_nok', a.cost_threshold_nok, 'summary', a.summary
  ) order by a.step_order), '[]'::jsonb)
  into v_approvals from public.organization_companion_real_world_approvals a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'provider_key', p.provider_key, 'provider_name', p.provider_name, 'service_category', p.service_category,
    'location_city', p.location_city, 'overall_rating', p.overall_rating,
    'response_time_hours', p.response_time_hours, 'service_capacity', p.service_capacity,
    'coverage_regions', p.coverage_regions
  ) order by p.overall_rating desc), '[]'::jsonb)
  into v_providers from public.organization_companion_real_world_provider_availability p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'booking_key', b.booking_key, 'request_key', b.request_key, 'service_title', b.service_title,
    'provider_name', b.provider_name, 'booking_status', b.booking_status, 'scheduled_at', b.scheduled_at,
    'location_label', b.location_label, 'estimated_cost_nok', b.estimated_cost_nok,
    'approval_status', b.approval_status, 'summary', b.summary
  ) order by b.scheduled_at nulls last), '[]'::jsonb)
  into v_bookings from public.organization_companion_real_world_bookings b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'delivery_key', d.delivery_key, 'delivery_title', d.delivery_title, 'delivery_type', d.delivery_type,
    'delivery_status', d.delivery_status, 'provider_name', d.provider_name,
    'destination_label', d.destination_label, 'summary', d.summary
  ) order by d.delivery_title), '[]'::jsonb)
  into v_deliveries from public.organization_companion_real_world_deliveries d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'execution_key', e.execution_key, 'request_key', e.request_key, 'execution_title', e.execution_title,
    'execution_status', e.execution_status, 'provider_name', e.provider_name,
    'outcome_summary', e.outcome_summary, 'recorded_at', e.recorded_at
  ) order by e.recorded_at desc), '[]'::jsonb)
  into v_executions from public.organization_companion_real_world_executions e where e.organization_id = v_org_id;

  select jsonb_build_object(
    'service_usage', jsonb_build_object(
      'total_requests', (select count(*) from public.organization_companion_real_world_requests where organization_id = v_org_id),
      'by_category', coalesce((
        select jsonb_object_agg(service_category, cnt)
        from (
          select service_category, count(*) as cnt
          from public.organization_companion_real_world_requests where organization_id = v_org_id
          group by service_category
        ) sub
      ), '{}'::jsonb)
    ),
    'cost_analysis', jsonb_build_object(
      'total_nok', coalesce((select sum(estimated_cost_nok) from public.organization_companion_real_world_requests where organization_id = v_org_id), 0),
      'pending_approval_nok', coalesce((
        select sum(r.estimated_cost_nok) from public.organization_companion_real_world_requests r
        where r.organization_id = v_org_id and r.request_status = 'pending_approval'
      ), 0)
    ),
    'provider_analysis', v_providers,
    'booking_trends', jsonb_build_object(
      'confirmed', (select count(*) from public.organization_companion_real_world_bookings where organization_id = v_org_id and booking_status = 'confirmed'),
      'pending', (select count(*) from public.organization_companion_real_world_bookings where organization_id = v_org_id and booking_status = 'pending')
    ),
    'approval_activity', jsonb_build_object(
      'pending', (select count(*) from public.organization_companion_real_world_approvals where organization_id = v_org_id and approval_status = 'pending'),
      'approved', (select count(*) from public.organization_companion_real_world_approvals where organization_id = v_org_id and approval_status = 'approved')
    ),
    'service_history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'request_key', r.request_key, 'service_title', r.service_title,
        'request_status', r.request_status, 'estimated_cost_nok', r.estimated_cost_nok,
        'provider_name', r.provider_name, 'summary', r.summary
      ) order by r.recorded_at desc)
      from public.organization_companion_real_world_requests r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Book airport transfer', 'category', 'transportation'),
      jsonb_build_object('title', 'Find available meeting room', 'category', 'hospitality'),
      jsonb_build_object('title', 'Arrange flowers', 'category', 'flowers'),
      jsonb_build_object('title', 'Schedule cleaning', 'category', 'cleaning')
    )
  ) into v_reports;

  select jsonb_build_object(
    'service_activity', (select count(*) from public.organization_companion_real_world_requests where organization_id = v_org_id),
    'provider_performance', (select count(*) from public.organization_companion_real_world_provider_availability where organization_id = v_org_id),
    'service_costs_nok', coalesce((select sum(estimated_cost_nok) from public.organization_companion_real_world_requests where organization_id = v_org_id), 0),
    'upcoming_bookings', (select count(*) from public.organization_companion_real_world_bookings where organization_id = v_org_id and booking_status in ('pending', 'confirmed')),
    'approval_activity', (select count(*) from public.organization_companion_real_world_approvals where organization_id = v_org_id),
    'companion_recommendations', 4
  ) into v_executive;

  select jsonb_build_object(
    'action_workflow', jsonb_build_array(
      'User Request', 'Companion Recommendation', 'Provider Selection', 'Review',
      'Approval', 'Execution', 'Confirmation', 'Audit Log'
    ),
    'service_categories', jsonb_build_array(
      'travel', 'transportation', 'food', 'hospitality', 'flowers', 'property_services',
      'cleaning', 'maintenance', 'professional_services', 'courier', 'events', 'custom'
    ),
    'cost_governance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'rule_key', c.rule_key, 'rule_title', c.rule_title, 'service_category', c.service_category,
        'auto_approve_below_nok', c.auto_approve_below_nok, 'approval_level', c.approval_level,
        'department_limit_nok', c.department_limit_nok, 'summary', c.summary
      ) order by c.rule_title)
      from public.organization_companion_real_world_cost_rules c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'approval_matrix', jsonb_build_object(
      'levels', jsonb_build_array('employee', 'manager', 'department', 'finance', 'executive'),
      'multi_step_example', 'Expense > 10,000 NOK → Manager → Finance → Executive → Execution'
    ),
    'location_awareness', coalesce((
      select jsonb_agg(jsonb_build_object(
        'location_key', l.location_key, 'location_title', l.location_title,
        'location_type', l.location_type, 'country', l.country, 'region', l.region,
        'city', l.city, 'summary', l.summary
      ) order by l.location_type)
      from public.organization_companion_real_world_locations l where l.organization_id = v_org_id
    ), '[]'::jsonb),
    'service_coordinator_prompts', jsonb_build_array(
      'Book airport transfer.', 'Find available meeting room.', 'Arrange flowers.',
      'Schedule cleaning.', 'Find local accountant.', 'Prepare service request.'
    ),
    'business_pack_links', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
        'service_categories', bp.service_categories, 'summary', bp.summary
      ) order by bp.pack_title)
      from public.organization_companion_real_world_business_pack_links bp where bp.organization_id = v_org_id
    ), '[]'::jsonb),
    'ecosystem_integration', jsonb_build_object('phase', '561', 'route', '/app/companion/ecosystem'),
    'governance_integration', jsonb_build_object('phase', '560', 'route', '/app/companion/governance')
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at
    ) order by al.created_at desc)
    from (
      select * from public.organization_companion_real_world_audit_logs
      where organization_id = v_org_id order by created_at desc limit 10
    ) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should help organizations accomplish real-world outcomes — human approval, governance, and audit remain mandatory.',
    'philosophy', 'Software creates information. Organizations need outcomes. Companion coordinates — humans approve — providers execute.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'requests', v_requests,
    'approvals', v_approvals,
    'providers', v_providers,
    'bookings', v_bookings,
    'deliveries', v_deliveries,
    'executions', v_executions,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'coordination_center', '/app/companion/services/actions',
      'bookings', '/app/companion/bookings',
      'ecosystem', '/app/companion/ecosystem',
      'governance', '/app/companion/governance'
    ),
    'notifications', jsonb_build_object(
      'booking_confirmed', true, 'provider_assigned', true, 'approval_required', true,
      'service_delayed', true, 'service_completed', true, 'cost_threshold_reached', true
    ),
    'mobile_access', jsonb_build_object(
      'request_services', true, 'approve_services', true, 'track_bookings', true,
      'review_providers', true, 'review_costs', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_real_world_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_approval_key text := coalesce(p_payload->>'approval_key', '');
  v_booking_key text := coalesce(p_payload->>'booking_key', '');
begin
  v_org_id := public._cmrw562_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'approve_service' and v_approval_key <> '' then
    update public.organization_companion_real_world_approvals
    set approval_status = 'approved' where organization_id = v_org_id and approval_key = v_approval_key;
    update public.organization_companion_real_world_requests
    set request_status = 'approved'
    where organization_id = v_org_id
      and request_key = (select request_key from public.organization_companion_real_world_approvals where approval_key = v_approval_key and organization_id = v_org_id limit 1);
    perform public._cmrw562_log(v_org_id, 'approval_granted', 'Real-world service approval granted', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'deny_service' and v_approval_key <> '' then
    update public.organization_companion_real_world_approvals
    set approval_status = 'denied' where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmrw562_log(v_org_id, 'approval_denied', 'Real-world service approval denied', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_service_request' then
    insert into public.organization_companion_real_world_requests (
      organization_id, request_key, service_title, service_category, provider_key, provider_name,
      request_status, estimated_cost_nok, location_label, summary
    ) values (
      v_org_id,
      'req_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'service_title', 'New Service Request'),
      coalesce(p_payload->>'service_category', 'custom'),
      coalesce(p_payload->>'provider_key', ''),
      coalesce(p_payload->>'provider_name', 'Verified Provider'),
      'pending_approval',
      (p_payload->>'estimated_cost_nok')::numeric,
      coalesce(p_payload->>'location_label', ''),
      coalesce(p_payload->>'summary', 'Service request created — awaiting approval.')
    );
    perform public._cmrw562_log(v_org_id, 'service_requested', 'Real-world service requested', p_payload, 'request');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'confirm_booking' and v_booking_key <> '' then
    update public.organization_companion_real_world_bookings
    set booking_status = 'confirmed', approval_status = 'approved'
    where organization_id = v_org_id and booking_key = v_booking_key;
    perform public._cmrw562_log(v_org_id, 'booking_created', 'Booking confirmed', p_payload, 'booking');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'cancel_booking' and v_booking_key <> '' then
    update public.organization_companion_real_world_bookings
    set booking_status = 'cancelled'
    where organization_id = v_org_id and booking_key = v_booking_key;
    perform public._cmrw562_log(v_org_id, 'booking_cancelled', 'Booking cancelled', p_payload, 'booking');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_coordination' then
    perform public._cmrw562_log(v_org_id, 'coordination_refreshed', 'Service coordination refreshed', p_payload, 'coordination');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_real_world_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmrw562_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_real_world_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/companion/services/actions');
end; $$;

create or replace function public.get_assistant_companion_real_world_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmrw562_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion coordinates real-world services — humans approve before execution.',
    'coordinator_prompts', jsonb_build_array(
      'Book airport transfer.', 'Find available meeting room.', 'Arrange flowers.',
      'Schedule cleaning.', 'Find local accountant.'
    ),
    'pending_approvals', (select count(*) from public.organization_companion_real_world_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'upcoming_bookings', (select count(*) from public.organization_companion_real_world_bookings where organization_id = v_org_id and booking_status in ('pending', 'confirmed')),
    'route', '/app/companion/services/actions'
  );
end; $$;

grant execute on function public.get_organization_companion_real_world_center(text) to authenticated;
grant execute on function public.perform_organization_companion_real_world_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_real_world_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_real_world_advisor_context() to authenticated;

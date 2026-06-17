-- Phase 405 — Logistics, Transportation & Fleet Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/logistics. Helpers: _gltfo405_*
-- Industry Pack home for fleet, drivers, routes, shipments, and distribution centers.
-- Extends warehouse operations concept into full transportation and logistics management.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.logistics_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  network_type text not null default 'regional' check (
    network_type in ('local', 'regional', 'national', 'international', 'enterprise')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logistics_fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vehicle_key text not null,
  vehicle_name text not null,
  vehicle_type text not null default 'truck' check (
    vehicle_type in ('truck', 'van', 'trailer', 'special_equipment', 'other')
  ),
  fleet_value numeric(14, 2) not null default 0,
  vehicle_status text not null default 'available' check (
    vehicle_status in (
      'available', 'assigned', 'in_transit', 'maintenance',
      'inspection_due', 'out_of_service', 'retired'
    )
  ),
  utilization_percent numeric(5, 2) not null default 0 check (utilization_percent between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, vehicle_key)
);

create index if not exists logistics_fleet_vehicles_tenant_idx
  on public.logistics_fleet_vehicles (tenant_id, vehicle_status);

create table if not exists public.logistics_drivers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  driver_key text not null,
  full_name text not null,
  license_status text not null default 'valid' check (
    license_status in ('valid', 'expiring', 'expired', 'missing')
  ),
  certification_status text not null default 'compliant' check (
    certification_status in ('compliant', 'renewal_due', 'non_compliant')
  ),
  availability_status text not null default 'available' check (
    availability_status in ('available', 'assigned', 'on_route', 'off_duty', 'unavailable')
  ),
  safety_score integer not null default 75 check (safety_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, driver_key)
);

create index if not exists logistics_drivers_tenant_idx
  on public.logistics_drivers (tenant_id, availability_status);

create table if not exists public.logistics_routes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  route_key text not null,
  route_name text not null,
  stop_count integer not null default 0,
  distance_km numeric(10, 2) not null default 0,
  estimated_minutes integer not null default 0,
  route_status text not null default 'planned' check (
    route_status in ('planned', 'assigned', 'in_progress', 'delayed', 'completed', 'cancelled')
  ),
  driver_id uuid references public.logistics_drivers (id) on delete set null,
  vehicle_id uuid references public.logistics_fleet_vehicles (id) on delete set null,
  cost_amount numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, route_key)
);

create index if not exists logistics_routes_tenant_idx
  on public.logistics_routes (tenant_id, route_status);

create table if not exists public.logistics_shipments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  shipment_reference text not null,
  origin_label text not null default '',
  destination_label text not null default '',
  shipment_status text not null default 'scheduled' check (
    shipment_status in (
      'scheduled', 'loaded', 'in_transit', 'delayed',
      'delivered', 'returned', 'exception', 'archived'
    )
  ),
  route_id uuid references public.logistics_routes (id) on delete set null,
  driver_id uuid references public.logistics_drivers (id) on delete set null,
  vehicle_id uuid references public.logistics_fleet_vehicles (id) on delete set null,
  transportation_cost numeric(14, 2) not null default 0,
  on_time boolean,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, shipment_reference)
);

create index if not exists logistics_shipments_tenant_idx
  on public.logistics_shipments (tenant_id, shipment_status);

create table if not exists public.logistics_distribution_centers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  center_key text not null,
  center_name text not null,
  center_type text not null default 'warehouse' check (
    center_type in ('warehouse', 'cross_dock', 'distribution_hub', 'regional_center')
  ),
  capacity_units integer not null default 0,
  utilization_percent numeric(5, 2) not null default 0 check (utilization_percent between 0 and 100),
  performance_label text not null default 'stable' check (
    performance_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, center_key)
);

create index if not exists logistics_distribution_centers_tenant_idx
  on public.logistics_distribution_centers (tenant_id, center_type);

create table if not exists public.logistics_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'delivery_delays_increasing', 'fuel_costs_rising', 'fleet_utilization_improving',
      'distribution_capacity', 'route_optimization', 'maintenance_overdue',
      'fuel_costs_exceed_target', 'route_efficiency', 'driver_certification_renewal',
      'distribution_capacity_constrained'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists logistics_advisor_signals_tenant_idx
  on public.logistics_advisor_signals (tenant_id, created_at desc);

create table if not exists public.logistics_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'vehicle_added', 'driver_added', 'shipment_created', 'shipment_delivered',
      'route_assigned', 'maintenance_recorded', 'distribution_center_updated',
      'cost_record_updated', 'pack_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists logistics_audit_logs_tenant_idx
  on public.logistics_audit_logs (tenant_id, created_at desc);

alter table public.logistics_pack_settings enable row level security;
alter table public.logistics_fleet_vehicles enable row level security;
alter table public.logistics_drivers enable row level security;
alter table public.logistics_routes enable row level security;
alter table public.logistics_shipments enable row level security;
alter table public.logistics_distribution_centers enable row level security;
alter table public.logistics_advisor_signals enable row level security;
alter table public.logistics_audit_logs enable row level security;

revoke all on public.logistics_pack_settings from authenticated, anon;
revoke all on public.logistics_fleet_vehicles from authenticated, anon;
revoke all on public.logistics_drivers from authenticated, anon;
revoke all on public.logistics_routes from authenticated, anon;
revoke all on public.logistics_shipments from authenticated, anon;
revoke all on public.logistics_distribution_centers from authenticated, anon;
revoke all on public.logistics_advisor_signals from authenticated, anon;
revoke all on public.logistics_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'logistics_transportation_fleet_operations_pack', v.description
from (values
  ('logistics.view', 'View Logistics Pack', 'View fleet, drivers, routes, shipments, and distribution operations'),
  ('logistics.manage', 'Manage Logistics Pack', 'Manage fleet, drivers, routes, shipments, and logistics settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Logistics and fleet operations — vehicles, drivers, routes, shipments, distribution centers, and transportation costs on ABOS.',
  lifecycle_status = 'production',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/logistics',
    'warehouse_operations_cross_link', '/app/aipify-warehouse-operations',
    'phase', 405
  ),
  updated_at = now()
where pack_key = 'logistics_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gltfo405_*
-- ---------------------------------------------------------------------------
create or replace function public._gltfo405_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Logistics Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gltfo405_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.logistics_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gltfo405_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.logistics_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.logistics_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'logistics_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 73
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.logistics_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.logistics_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gltfo405_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.logistics_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.logistics_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'route_optimization',
      'Route optimization opportunities may be available across active delivery networks.',
      'Inefficient routes increase fuel costs and reduce on-time delivery performance.',
      'Review Routes module and confirm stop sequences and assigned vehicles.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'fleet_utilization_improving',
      'Fleet utilization indicators are trending positively.',
      'Higher utilization improves asset return without expanding fleet size.',
      'Document successful route assignments in Knowledge Center.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'driver_certification_renewal',
      'Driver certification renewals may be approaching.',
      'Expired certifications create compliance and safety risk.',
      'Open Drivers module and confirm license and certification status.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._gltfo405_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_shipments integer := 0;
  v_fleet integer := 0;
  v_drivers integer := 0;
  v_routes integer := 0;
  v_centers integer := 0;
  v_on_time numeric := 0;
  v_transport_cost numeric := 0;
  v_utilization numeric := 0;
  v_health numeric := 70;
begin
  select count(*)::int into v_shipments
  from public.logistics_shipments
  where tenant_id = p_tenant_id and shipment_status not in ('archived', 'delivered');

  select count(*)::int, coalesce(avg(utilization_percent), 0)
  into v_fleet, v_utilization
  from public.logistics_fleet_vehicles
  where tenant_id = p_tenant_id and vehicle_status != 'retired';

  select count(*)::int into v_drivers
  from public.logistics_drivers where tenant_id = p_tenant_id;

  select count(*)::int into v_routes
  from public.logistics_routes
  where tenant_id = p_tenant_id and route_status not in ('completed', 'cancelled');

  select count(*)::int into v_centers
  from public.logistics_distribution_centers where tenant_id = p_tenant_id;

  select
    case when count(*) filter (where on_time is not null) > 0
      then round(count(*) filter (where on_time = true)::numeric / nullif(count(*) filter (where on_time is not null), 0)::numeric * 100, 1)
      else 0 end,
    coalesce(sum(transportation_cost), 0)
  into v_on_time, v_transport_cost
  from public.logistics_shipments where tenant_id = p_tenant_id;

  select coalesce(health_score, 70) into v_health
  from public.logistics_pack_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'active_shipments', v_shipments,
    'fleet_size', v_fleet,
    'drivers', v_drivers,
    'routes', v_routes,
    'distribution_centers', v_centers,
    'on_time_delivery', v_on_time,
    'transportation_costs', v_transport_cost,
    'fleet_utilization', round(v_utilization, 1),
    'logistics_health_score', round(v_health)::int
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_logistics_transportation_fleet_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.logistics_pack_settings;
  v_vehicles jsonb := '[]'::jsonb;
  v_drivers jsonb := '[]'::jsonb;
  v_routes jsonb := '[]'::jsonb;
  v_shipments jsonb := '[]'::jsonb;
  v_centers jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
  v_warehouse_route text := '/app/aipify-warehouse-operations';
begin
  perform public._irp_require_permission('logistics.view');
  v_ctx := public._gltfo405_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gltfo405_ensure_settings(v_org_id, v_tenant_id);
  perform public._gltfo405_seed_advisor(v_tenant_id);
  v_overview := public._gltfo405_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'vehicle_key', v.vehicle_key, 'vehicle_name', v.vehicle_name,
    'vehicle_type', v.vehicle_type, 'vehicle_status', v.vehicle_status,
    'utilization_percent', v.utilization_percent, 'fleet_value', v.fleet_value
  ) order by v.vehicle_name), '[]'::jsonb)
  into v_vehicles
  from public.logistics_fleet_vehicles v
  where v.tenant_id = v_tenant_id and v.vehicle_status != 'retired'
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'driver_key', d.driver_key, 'full_name', d.full_name,
    'license_status', d.license_status, 'certification_status', d.certification_status,
    'availability_status', d.availability_status, 'safety_score', d.safety_score
  ) order by d.full_name), '[]'::jsonb)
  into v_drivers
  from public.logistics_drivers d
  where d.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'route_key', r.route_key, 'route_name', r.route_name,
    'stop_count', r.stop_count, 'distance_km', r.distance_km,
    'route_status', r.route_status, 'cost_amount', r.cost_amount,
    'driver_id', r.driver_id, 'vehicle_id', r.vehicle_id
  ) order by r.route_name), '[]'::jsonb)
  into v_routes
  from public.logistics_routes r
  where r.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'shipment_reference', s.shipment_reference,
    'origin_label', s.origin_label, 'destination_label', s.destination_label,
    'shipment_status', s.shipment_status, 'transportation_cost', s.transportation_cost,
    'on_time', s.on_time, 'route_id', s.route_id
  ) order by s.updated_at desc), '[]'::jsonb)
  into v_shipments
  from public.logistics_shipments s
  where s.tenant_id = v_tenant_id
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'center_key', c.center_key, 'center_name', c.center_name,
    'center_type', c.center_type, 'capacity_units', c.capacity_units,
    'utilization_percent', c.utilization_percent, 'performance_label', c.performance_label
  ) order by c.center_name), '[]'::jsonb)
  into v_centers
  from public.logistics_distribution_centers c
  where c.tenant_id = v_tenant_id
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.logistics_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.logistics_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Logistics is the movement of products, assets, people, and information — visibility creates efficiency.',
    'mission', 'Logistics & Fleet Operations System — fleet, drivers, routes, shipments, and distribution visibility.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Fleet-ready logistics on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'warehouse_operations_route', v_warehouse_route,
    'distinction_note', 'Extends warehouse operations into full transportation and logistics management.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/logistics'),
      jsonb_build_object('key', 'fleet', 'route', '/app/logistics/fleet'),
      jsonb_build_object('key', 'drivers', 'route', '/app/logistics/drivers'),
      jsonb_build_object('key', 'routes', 'route', '/app/logistics/routes'),
      jsonb_build_object('key', 'shipments', 'route', '/app/logistics/shipments'),
      jsonb_build_object('key', 'distribution_centers', 'route', '/app/logistics/distribution-centers'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/logistics/intelligence'),
      jsonb_build_object('key', 'governance', 'route', '/app/logistics/governance')
    ),
    'vehicles', v_vehicles,
    'drivers', v_drivers,
    'routes', v_routes,
    'shipments', v_shipments,
    'distribution_centers', v_centers,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'fleet_route', '/app/logistics/fleet',
      'drivers_route', '/app/logistics/drivers',
      'routes_route', '/app/logistics/routes',
      'shipments_route', '/app/logistics/shipments',
      'distribution_centers_route', '/app/logistics/distribution-centers',
      'warehouse_route', v_warehouse_route
    ),
    'executive_dashboard', jsonb_build_object(
      'fleet_health', v_overview->>'logistics_health_score',
      'on_time_delivery', v_overview->>'on_time_delivery',
      'transportation_costs', v_overview->>'transportation_costs',
      'fleet_utilization', v_overview->>'fleet_utilization',
      'distribution_centers', v_overview->>'distribution_centers',
      'executive_route', '/app/logistics/intelligence'
    ),
    'privacy_note', 'Fleet, driver, and shipment data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.logistics_transportation_fleet_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_vehicle_id uuid;
  v_vehicle_name text;
  v_driver_id uuid;
  v_shipment_id uuid;
  v_route_id uuid;
  v_center_id uuid;
begin
  perform public._irp_require_permission('logistics.manage');
  perform public._gltfo405_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gltfo405_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_vehicle' then
    insert into public.logistics_fleet_vehicles (
      tenant_id, vehicle_key, vehicle_name, vehicle_type, fleet_value, vehicle_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'vehicle_key', 'vehicle-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'vehicle_name', 'New vehicle'),
      coalesce(p_payload->>'vehicle_type', 'truck'),
      coalesce((p_payload->>'fleet_value')::numeric, 0),
      coalesce(p_payload->>'vehicle_status', 'available')
    ) returning id, vehicle_name into v_vehicle_id, v_vehicle_name;

    perform public._gltfo405_log_audit(
      v_tenant_id, 'vehicle_added', 'Vehicle added: ' || v_vehicle_name,
      jsonb_build_object('vehicle_id', v_vehicle_id)
    );

    return jsonb_build_object('ok', true, 'vehicle_id', v_vehicle_id);
  end if;

  if v_action = 'create_driver' then
    insert into public.logistics_drivers (
      tenant_id, driver_key, full_name, license_status, certification_status
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'driver_key', 'driver-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New driver'),
      coalesce(p_payload->>'license_status', 'valid'),
      coalesce(p_payload->>'certification_status', 'compliant')
    ) returning id into v_driver_id;

    perform public._gltfo405_log_audit(
      v_tenant_id, 'driver_added', 'Driver added',
      jsonb_build_object('driver_id', v_driver_id)
    );

    return jsonb_build_object('ok', true, 'driver_id', v_driver_id);
  end if;

  if v_action = 'create_shipment' then
    insert into public.logistics_shipments (
      tenant_id, shipment_reference, origin_label, destination_label,
      shipment_status, transportation_cost
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'shipment_reference', 'SHP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'origin_label', ''),
      coalesce(p_payload->>'destination_label', ''),
      coalesce(p_payload->>'shipment_status', 'scheduled'),
      coalesce((p_payload->>'transportation_cost')::numeric, 0)
    ) returning id into v_shipment_id;

    perform public._gltfo405_log_audit(
      v_tenant_id, 'shipment_created', 'Shipment created',
      jsonb_build_object('shipment_id', v_shipment_id)
    );

    return jsonb_build_object('ok', true, 'shipment_id', v_shipment_id);
  end if;

  if v_action = 'create_route' then
    insert into public.logistics_routes (
      tenant_id, route_key, route_name, stop_count, distance_km, route_status,
      driver_id, vehicle_id, cost_amount
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'route_key', 'route-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'route_name', 'New route'),
      coalesce((p_payload->>'stop_count')::int, 0),
      coalesce((p_payload->>'distance_km')::numeric, 0),
      coalesce(p_payload->>'route_status', 'planned'),
      nullif(p_payload->>'driver_id', '')::uuid,
      nullif(p_payload->>'vehicle_id', '')::uuid,
      coalesce((p_payload->>'cost_amount')::numeric, 0)
    ) returning id into v_route_id;

    perform public._gltfo405_log_audit(
      v_tenant_id, 'route_assigned', 'Route created',
      jsonb_build_object('route_id', v_route_id)
    );

    return jsonb_build_object('ok', true, 'route_id', v_route_id);
  end if;

  if v_action = 'create_distribution_center' then
    insert into public.logistics_distribution_centers (
      tenant_id, center_key, center_name, center_type, capacity_units
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'center_key', 'center-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'center_name', 'New center'),
      coalesce(p_payload->>'center_type', 'warehouse'),
      coalesce((p_payload->>'capacity_units')::int, 0)
    ) returning id into v_center_id;

    perform public._gltfo405_log_audit(
      v_tenant_id, 'distribution_center_updated', 'Distribution center created',
      jsonb_build_object('center_id', v_center_id)
    );

    return jsonb_build_object('ok', true, 'center_id', v_center_id);
  end if;

  raise exception 'Unsupported logistics action: %', v_action;
end;
$$;

grant execute on function public.get_logistics_transportation_fleet_operations_center() to authenticated;
grant execute on function public.logistics_transportation_fleet_operations_action(jsonb) to authenticated;

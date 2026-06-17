-- Phase 401 — Hospitality & Accommodation Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/hospitality. Helpers: _ghap401_*
-- Federates Aipify Hosts (airbnb01+) into Industry Pack architecture (Phase 400).
-- Canonical home for Hosts, vacation rentals, Airbnb hosts, holiday homes, cabins, apartments, boutique hotels.

-- ---------------------------------------------------------------------------
-- 1. Extension tables (Aipify Hosts federation — do not duplicate core hosts tables)
-- ---------------------------------------------------------------------------
create table if not exists public.hospitality_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  portfolio_type text not null default 'single_property' check (
    portfolio_type in (
      'single_property', 'multi_property', 'regional_portfolio',
      'enterprise_portfolio', 'franchise_portfolio'
    )
  ),
  health_score integer not null default 74 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hospitality_portfolios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  slug text not null,
  portfolio_type text not null default 'multi_property' check (
    portfolio_type in (
      'single_property', 'multi_property', 'regional_portfolio',
      'enterprise_portfolio', 'franchise_portfolio'
    )
  ),
  region_code text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create index if not exists hospitality_portfolios_tenant_idx
  on public.hospitality_portfolios (tenant_id, status);

create table if not exists public.hospitality_property_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null,
  portfolio_id uuid references public.hospitality_portfolios (id) on delete set null,
  property_type text not null default 'apartment' check (
    property_type in (
      'apartment', 'house', 'cabin', 'villa', 'hotel_room',
      'boutique_hotel', 'resort_unit', 'custom'
    )
  ),
  location text not null default '',
  capacity integer not null default 2 check (capacity >= 1),
  amenities jsonb not null default '[]'::jsonb,
  owner_name text not null default '',
  performance_label text not null default 'stable' check (
    performance_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists hospitality_property_profiles_tenant_idx
  on public.hospitality_property_profiles (tenant_id, property_type);

create table if not exists public.hospitality_channel_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  channel_key text not null check (
    channel_key in ('airbnb', 'booking_com', 'vrbo', 'direct', 'future')
  ),
  status text not null default 'prepared' check (
    status in ('prepared', 'connected', 'paused', 'disabled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, channel_key)
);

create table if not exists public.hospitality_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'occupancy_increasing', 'maintenance_required', 'guest_satisfaction_improving',
      'seasonal_demand', 'revenue_exceeds_forecast', 'cleaning_schedule_review',
      'guest_issue_attention', 'maintenance_schedule', 'revenue_opportunity', 'occupancy_forecast'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  property_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists hospitality_advisor_signals_tenant_idx
  on public.hospitality_advisor_signals (tenant_id, created_at desc);

create table if not exists public.hospitality_accommodation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'property_created', 'reservation_created', 'guest_added', 'cleaning_assigned',
      'maintenance_created', 'review_received', 'revenue_recorded', 'portfolio_updated',
      'pack_activated', 'channel_prepared'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists hospitality_accommodation_audit_logs_tenant_idx
  on public.hospitality_accommodation_audit_logs (tenant_id, created_at desc);

alter table public.hospitality_pack_settings enable row level security;
alter table public.hospitality_portfolios enable row level security;
alter table public.hospitality_property_profiles enable row level security;
alter table public.hospitality_channel_connections enable row level security;
alter table public.hospitality_advisor_signals enable row level security;
alter table public.hospitality_accommodation_audit_logs enable row level security;

revoke all on public.hospitality_pack_settings from authenticated, anon;
revoke all on public.hospitality_portfolios from authenticated, anon;
revoke all on public.hospitality_property_profiles from authenticated, anon;
revoke all on public.hospitality_channel_connections from authenticated, anon;
revoke all on public.hospitality_advisor_signals from authenticated, anon;
revoke all on public.hospitality_accommodation_audit_logs from authenticated, anon;

-- Optional FK to Aipify Hosts when that engine is migrated
do $$
begin
  if to_regclass('public.aipify_hosts_properties') is not null then
    if not exists (
      select 1 from pg_constraint where conname = 'hospitality_property_profiles_property_id_fkey'
    ) then
      alter table public.hospitality_property_profiles
        add constraint hospitality_property_profiles_property_id_fkey
        foreign key (property_id) references public.aipify_hosts_properties (id) on delete cascade;
      create unique index if not exists hospitality_property_profiles_property_id_uidx
        on public.hospitality_property_profiles (property_id);
    end if;
    if not exists (
      select 1 from pg_constraint where conname = 'hospitality_advisor_signals_property_id_fkey'
    ) then
      alter table public.hospitality_advisor_signals
        add constraint hospitality_advisor_signals_property_id_fkey
        foreign key (property_id) references public.aipify_hosts_properties (id) on delete set null;
    end if;
  end if;
end $$;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'hospitality_accommodation_pack', v.description
from (values
  ('hospitality.view', 'View Hospitality Pack', 'View hospitality operations, properties, reservations, and guest experience'),
  ('hospitality.manage', 'Manage Hospitality Pack', 'Manage properties, reservations, operations, and portfolio settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Guest experience management for accommodation operators — properties, reservations, cleaning, maintenance, revenue, and portfolios. Home of Aipify Hosts.',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/hospitality',
    'legacy_hosts_route', '/app/aipify-hosts',
    'phase', 401
  ),
  updated_at = now()
where pack_key = 'hospitality_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _ghap401_*
-- ---------------------------------------------------------------------------
create or replace function public._ghap401_require_access()
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
    raise exception 'Hospitality Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._ghap401_log_audit(
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
  insert into public.hospitality_accommodation_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;

  begin
    perform public._ahost_log_audit(p_tenant_id, p_event_type, p_summary, p_context);
  exception when others then
    null;
  end;

  return v_id;
end;
$$;

create or replace function public._ghap401_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.hospitality_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.hospitality_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'hospitality_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 78
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.hospitality_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.hospitality_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._ghap401_seed_channels(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.hospitality_channel_connections (tenant_id, channel_key, status)
  select p_tenant_id, v.channel_key, 'prepared'
  from (values ('airbnb'), ('booking_com'), ('vrbo'), ('direct')) as v(channel_key)
  where not exists (
    select 1 from public.hospitality_channel_connections c
    where c.tenant_id = p_tenant_id and c.channel_key = v.channel_key
  );
end;
$$;

create or replace function public._ghap401_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.hospitality_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.hospitality_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'occupancy_increasing',
      'Occupancy trends are improving across active properties.',
      'Higher occupancy may require cleaning and maintenance coordination.',
      'Review cleaning schedules and upcoming check-ins in Operations.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'guest_satisfaction_improving',
      'Guest satisfaction indicators are trending positively.',
      'Strong guest experience supports repeat bookings and reviews.',
      'Document successful guest communication patterns in Knowledge Center.',
      'low', 'high'
    ),
    (
      p_tenant_id, 'cleaning_schedule_review',
      'Upcoming check-ins may require cleaning schedule verification.',
      'Turnover delays impact guest experience at arrival.',
      'Open Cleaning Operations and confirm assigned cleaners before check-in.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._ghap401_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_properties integer := 0;
  v_reservations integer := 0;
  v_guests integer := 0;
  v_checkins integer := 0;
  v_checkouts integer := 0;
  v_occupancy numeric := 0;
  v_revenue numeric := 0;
  v_satisfaction numeric := 0;
  v_health numeric := 0;
  v_cleaning_pending integer := 0;
  v_maintenance_open integer := 0;
  v_reviews integer := 0;
begin
  if to_regclass('public.aipify_hosts_properties') is not null then
    select count(*)::int, coalesce(avg(health_score), 0)
    into v_properties, v_health
    from public.aipify_hosts_properties where tenant_id = p_tenant_id and status = 'active';
  end if;

  if to_regclass('public.aipify_hosts_booking_reservations') is not null then
    select count(*)::int,
           count(*) filter (where check_in_date = current_date)::int,
           count(*) filter (where check_out_date = current_date)::int
    into v_reservations, v_checkins, v_checkouts
    from public.aipify_hosts_booking_reservations
    where tenant_id = p_tenant_id and booking_status not in ('cancelled');
  end if;

  if to_regclass('public.aipify_hosts_guests') is not null then
    select count(*)::int into v_guests
    from public.aipify_hosts_guests where tenant_id = p_tenant_id;
  end if;

  if to_regclass('public.aipify_hosts_cleaning_tasks') is not null then
    select count(*)::int into v_cleaning_pending
    from public.aipify_hosts_cleaning_tasks
    where tenant_id = p_tenant_id and cleaning_status in ('scheduled', 'assigned', 'in_progress', 'awaiting_review', 'requires_attention');
  end if;

  if to_regclass('public.aipify_hosts_work_orders') is not null then
    select count(*)::int into v_maintenance_open
    from public.aipify_hosts_work_orders
    where tenant_id = p_tenant_id and wo_status in ('new', 'assigned', 'scheduled', 'in_progress', 'waiting_parts');
  end if;

  if to_regclass('public.aipify_hosts_property_reviews') is not null then
    select count(*)::int, coalesce(avg(overall_rating), 0)
    into v_reviews, v_satisfaction
    from public.aipify_hosts_property_reviews where tenant_id = p_tenant_id;
  end if;

  begin
    if to_regprocedure('public._ahostexec_executive_summary(uuid)') is not null then
      v_occupancy := coalesce((
        public._ahostexec_executive_summary(p_tenant_id)->>'occupancy_rate'
      )::numeric, 0);
      v_revenue := coalesce((
        public._ahostexec_executive_summary(p_tenant_id)->>'revenue_this_month'
      )::numeric, 0);
      if v_satisfaction = 0 then
        v_satisfaction := coalesce((
          public._ahostexec_executive_summary(p_tenant_id)->>'guest_satisfaction_score'
        )::numeric, 0);
      end if;
    end if;
  exception when others then
    v_occupancy := 0;
    v_revenue := 0;
  end;

  return jsonb_build_object(
    'properties', v_properties,
    'reservations', v_reservations,
    'occupancy_rate', v_occupancy,
    'upcoming_check_ins', v_checkins,
    'upcoming_check_outs', v_checkouts,
    'revenue', v_revenue,
    'guest_satisfaction', round(v_satisfaction, 1),
    'guest_count', v_guests,
    'hospitality_health_score', round(v_health)::int,
    'cleaning_pending', v_cleaning_pending,
    'maintenance_open', v_maintenance_open,
    'review_count', v_reviews
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_hospitality_accommodation_center()
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
  v_settings public.hospitality_pack_settings;
  v_properties jsonb := '[]'::jsonb;
  v_reservations jsonb := '[]'::jsonb;
  v_guests jsonb := '[]'::jsonb;
  v_channels jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_portfolios jsonb := '[]'::jsonb;
  v_hosts_modules jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('hospitality.view');
  v_ctx := public._ghap401_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._ghap401_ensure_settings(v_org_id, v_tenant_id);
  if to_regprocedure('public._ahost_ensure_settings(uuid)') is not null then
    perform public._ahost_ensure_settings(v_tenant_id);
  end if;
  perform public._ghap401_seed_channels(v_tenant_id);
  perform public._ghap401_seed_advisor(v_tenant_id);

  if to_regclass('public.aipify_hosts_properties') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'property_key', p.property_key, 'display_name', p.display_name,
      'platform_source', p.platform_source, 'status', p.status, 'health_score', p.health_score,
      'property_type', coalesce(hpp.property_type, 'apartment'),
      'location', coalesce(hpp.location, ''),
      'capacity', coalesce(hpp.capacity, 2),
      'owner_name', coalesce(hpp.owner_name, ''),
      'performance_label', coalesce(hpp.performance_label, 'stable'),
      'portfolio_id', hpp.portfolio_id
    ) order by p.display_name), '[]'::jsonb)
    into v_properties
    from public.aipify_hosts_properties p
    left join public.hospitality_property_profiles hpp on hpp.property_id = p.id
    where p.tenant_id = v_tenant_id and p.status = 'active';
  end if;

  if to_regclass('public.aipify_hosts_booking_reservations') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id, 'reservation_reference', r.reservation_reference, 'guest_name', r.guest_name,
      'check_in_date', r.check_in_date, 'check_out_date', r.check_out_date,
      'booking_status', r.booking_status, 'booking_channel', r.booking_channel,
      'number_of_guests', r.number_of_guests, 'property_id', r.property_id
    ) order by r.check_in_date), '[]'::jsonb)
    into v_reservations
    from public.aipify_hosts_booking_reservations r
    where r.tenant_id = v_tenant_id
    limit 50;
  end if;

  if to_regclass('public.aipify_hosts_guests') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', g.id, 'guest_name', g.full_name, 'stay_status', g.stay_status,
      'guest_tier', g.guest_tier, 'check_in_date', g.check_in_date, 'check_out_date', g.check_out_date
    ) order by g.updated_at desc), '[]'::jsonb)
    into v_guests
    from public.aipify_hosts_guests g
    where g.tenant_id = v_tenant_id
    limit 30;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'channel_key', c.channel_key, 'status', c.status
  ) order by c.channel_key), '[]'::jsonb)
  into v_channels
  from public.hospitality_channel_connections c
  where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.hospitality_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.hospitality_accommodation_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pf.id, 'name', pf.name, 'slug', pf.slug, 'portfolio_type', pf.portfolio_type, 'status', pf.status
  ) order by pf.name), '[]'::jsonb)
  into v_portfolios
  from public.hospitality_portfolios pf
  where pf.tenant_id = v_tenant_id and pf.status = 'active';

  v_hosts_modules := case
    when to_regprocedure('public._ahostbp364_modules()') is not null
    then coalesce(public._ahostbp364_modules(), '[]'::jsonb)
    else '[]'::jsonb
  end;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Hospitality is not property management — hospitality is guest experience management.',
    'mission', 'Hospitality & Accommodation Operating System — great guest experiences, efficient operations, clear visibility.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Guest-centric operations on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'aipify_hosts_route', '/app/aipify-hosts',
    'distinction_note', 'Canonical Industry Pack home — federates existing Aipify Hosts modules without duplicating engines.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', public._ghap401_overview_block(v_tenant_id),
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/hospitality'),
      jsonb_build_object('key', 'properties', 'route', '/app/hospitality/properties'),
      jsonb_build_object('key', 'reservations', 'route', '/app/hospitality/reservations'),
      jsonb_build_object('key', 'guests', 'route', '/app/aipify-hosts/guests'),
      jsonb_build_object('key', 'operations', 'route', '/app/aipify-hosts/operations'),
      jsonb_build_object('key', 'revenue', 'route', '/app/aipify-hosts/finance'),
      jsonb_build_object('key', 'reviews', 'route', '/app/aipify-hosts/reputation'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/hospitality/intelligence')
    ),
    'properties', v_properties,
    'reservations', v_reservations,
    'guests', v_guests,
    'channels', v_channels,
    'portfolios', v_portfolios,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'hosts_module_cross_links', v_hosts_modules,
    'operations', jsonb_build_object(
      'cleaning_route', '/app/aipify-hosts/cleaning',
      'maintenance_route', '/app/aipify-hosts/maintenance',
      'check_in_route', '/app/aipify-hosts/check-in',
      'access_route', '/app/aipify-hosts/access',
      'booking_route', '/app/aipify-hosts/bookings'
    ),
    'executive_dashboard', jsonb_build_object(
      'occupancy', public._ghap401_overview_block(v_tenant_id)->>'occupancy_rate',
      'revenue', public._ghap401_overview_block(v_tenant_id)->>'revenue',
      'guest_satisfaction', public._ghap401_overview_block(v_tenant_id)->>'guest_satisfaction',
      'property_health', public._ghap401_overview_block(v_tenant_id)->>'hospitality_health_score',
      'maintenance_open', public._ghap401_overview_block(v_tenant_id)->>'maintenance_open',
      'executive_route', '/app/aipify-hosts/executive'
    ),
    'privacy_note', 'Guest and property data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.hospitality_accommodation_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_property_id uuid;
  v_profile public.hospitality_property_profiles;
  v_reservation_id uuid;
  v_portfolio public.hospitality_portfolios;
  v_display_name text;
begin
  perform public._irp_require_permission('hospitality.manage');
  perform public._ghap401_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._ghap401_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_property' then
    if to_regclass('public.aipify_hosts_properties') is null then
      raise exception 'Aipify Hosts property engine not yet available on this environment';
    end if;
    insert into public.aipify_hosts_properties (
      tenant_id, property_key, display_name, platform_source, status, health_score
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'property_key', 'property-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'display_name', 'New property'),
      coalesce(p_payload->>'platform_source', 'direct'),
      'active',
      coalesce((p_payload->>'health_score')::numeric, 75)
    ) returning id, display_name into v_property_id, v_display_name;

    insert into public.hospitality_property_profiles (
      tenant_id, property_id, property_type, location, capacity, owner_name, amenities
    ) values (
      v_tenant_id, v_property_id,
      coalesce(p_payload->>'property_type', 'apartment'),
      coalesce(p_payload->>'location', ''),
      coalesce((p_payload->>'capacity')::int, 2),
      coalesce(p_payload->>'owner_name', ''),
      coalesce(p_payload->'amenities', '[]'::jsonb)
    ) returning * into v_profile;

    perform public._ghap401_log_audit(
      v_tenant_id, 'property_created', 'Property created: ' || v_display_name,
      jsonb_build_object('property_id', v_property_id, 'property_type', v_profile.property_type)
    );

    return jsonb_build_object('ok', true, 'property_id', v_property_id);
  end if;

  if v_action = 'create_reservation' then
    if to_regclass('public.aipify_hosts_booking_reservations') is null then
      raise exception 'Aipify Hosts booking engine not yet available on this environment';
    end if;
    insert into public.aipify_hosts_booking_reservations (
      tenant_id, property_id, reservation_reference, guest_name,
      check_in_date, check_out_date, number_of_guests, booking_status, booking_channel
    ) values (
      v_tenant_id,
      nullif(p_payload->>'property_id', '')::uuid,
      coalesce(p_payload->>'reservation_reference', 'RES-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'guest_name', 'Guest'),
      coalesce((p_payload->>'check_in_date')::date, current_date + 1),
      coalesce((p_payload->>'check_out_date')::date, current_date + 3),
      coalesce((p_payload->>'number_of_guests')::int, 2),
      coalesce(p_payload->>'booking_status', 'confirmed'),
      coalesce(p_payload->>'booking_channel', 'direct')
    ) returning id into v_reservation_id;

    perform public._ghap401_log_audit(
      v_tenant_id, 'reservation_created', 'Reservation created',
      jsonb_build_object('reservation_id', v_reservation_id)
    );

    return jsonb_build_object('ok', true, 'reservation_id', v_reservation_id);
  end if;

  if v_action = 'create_portfolio' then
    insert into public.hospitality_portfolios (
      organization_id, tenant_id, name, slug, portfolio_type, region_code
    ) values (
      v_org_id, v_tenant_id,
      coalesce(p_payload->>'name', 'Portfolio'),
      lower(regexp_replace(coalesce(p_payload->>'slug', 'portfolio-' || substr(gen_random_uuid()::text, 1, 6)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'portfolio_type', 'multi_property'),
      coalesce(p_payload->>'region_code', '')
    ) returning * into v_portfolio;

    perform public._ghap401_log_audit(
      v_tenant_id, 'portfolio_updated', 'Portfolio created: ' || v_portfolio.name,
      jsonb_build_object('portfolio_id', v_portfolio.id)
    );

    return jsonb_build_object('ok', true, 'portfolio', row_to_json(v_portfolio)::jsonb);
  end if;

  raise exception 'Unsupported hospitality action: %', v_action;
end;
$$;

grant execute on function public.get_hospitality_accommodation_center() to authenticated;
grant execute on function public.hospitality_accommodation_action(jsonb) to authenticated;

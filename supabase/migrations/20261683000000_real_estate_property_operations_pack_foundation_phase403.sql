-- Phase 403 — Real Estate, Property Management & Portfolio Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/real-estate. Helpers: _grep403_*
-- Industry Pack home for long-term property ownership, tenants, leases, maintenance, and portfolio performance.
-- Distinct from Hospitality Pack (guest experience) — focuses on assets, tenants, contracts, and governance.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.real_estate_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  portfolio_type text not null default 'single_property' check (
    portfolio_type in (
      'single_property', 'multi_property', 'regional_portfolio',
      'commercial_portfolio', 'enterprise_portfolio', 'investment_group'
    )
  ),
  health_score integer not null default 73 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.real_estate_portfolios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  slug text not null,
  portfolio_type text not null default 'multi_property' check (
    portfolio_type in (
      'single_property', 'multi_property', 'regional_portfolio',
      'commercial_portfolio', 'enterprise_portfolio', 'investment_group'
    )
  ),
  region_code text not null default '',
  portfolio_value numeric(16, 2) not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create index if not exists real_estate_portfolios_tenant_idx
  on public.real_estate_portfolios (tenant_id, status);

create table if not exists public.real_estate_properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  portfolio_id uuid references public.real_estate_portfolios (id) on delete set null,
  property_key text not null,
  property_name text not null,
  property_type text not null default 'residential' check (
    property_type in (
      'residential', 'apartment_building', 'commercial_building', 'office_building',
      'retail_property', 'industrial_property', 'mixed_use', 'custom'
    )
  ),
  location text not null default '',
  ownership_label text not null default '',
  market_value numeric(14, 2) not null default 0,
  monthly_revenue numeric(14, 2) not null default 0,
  monthly_expenses numeric(14, 2) not null default 0,
  performance_label text not null default 'stable' check (
    performance_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, property_key)
);

create index if not exists real_estate_properties_tenant_idx
  on public.real_estate_properties (tenant_id, status);

create table if not exists public.real_estate_units (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.real_estate_properties (id) on delete cascade,
  unit_number text not null,
  floor_label text not null default '',
  size_sqm numeric(10, 2),
  unit_status text not null default 'vacant' check (
    unit_status in ('vacant', 'occupied', 'reserved', 'maintenance', 'renovation', 'unavailable', 'archived')
  ),
  monthly_rent numeric(12, 2) not null default 0,
  tenant_id_ref uuid,
  lease_status text not null default 'none' check (
    lease_status in ('none', 'draft', 'pending', 'active', 'renewal_due', 'expired', 'terminated', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (property_id, unit_number)
);

create index if not exists real_estate_units_tenant_idx
  on public.real_estate_units (tenant_id, unit_status);

create table if not exists public.real_estate_tenants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  tenant_key text not null,
  full_name text not null,
  email text not null default '',
  phone text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, tenant_key)
);

create index if not exists real_estate_tenants_org_idx
  on public.real_estate_tenants (tenant_id, status);

create table if not exists public.real_estate_leases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.real_estate_properties (id) on delete set null,
  unit_id uuid references public.real_estate_units (id) on delete set null,
  tenant_record_id uuid references public.real_estate_tenants (id) on delete set null,
  lease_reference text not null,
  lease_status text not null default 'draft' check (
    lease_status in ('draft', 'pending', 'active', 'renewal_due', 'expired', 'terminated', 'archived')
  ),
  lease_start date not null,
  lease_end date not null,
  monthly_rent numeric(12, 2) not null default 0,
  deposit_amount numeric(12, 2) not null default 0,
  renewal_status text not null default 'none' check (
    renewal_status in ('none', 'pending', 'approved', 'declined')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, lease_reference)
);

create index if not exists real_estate_leases_tenant_idx
  on public.real_estate_leases (tenant_id, lease_status);

create table if not exists public.real_estate_vendors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  vendor_key text not null,
  vendor_name text not null,
  vendor_type text not null default 'maintenance' check (
    vendor_type in (
      'contractor', 'electrician', 'plumber', 'cleaning', 'inspection',
      'property_service', 'maintenance', 'other'
    )
  ),
  reliability_score integer not null default 70 check (reliability_score between 0 and 100),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, vendor_key)
);

create table if not exists public.real_estate_maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.real_estate_properties (id) on delete set null,
  unit_id uuid references public.real_estate_units (id) on delete set null,
  vendor_id uuid references public.real_estate_vendors (id) on delete set null,
  request_reference text not null,
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  request_status text not null default 'new' check (
    request_status in ('new', 'assigned', 'scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  summary text not null,
  estimated_cost numeric(12, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_reference)
);

create index if not exists real_estate_maintenance_requests_tenant_idx
  on public.real_estate_maintenance_requests (tenant_id, request_status);

create table if not exists public.real_estate_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'lease_renewal_approaching', 'occupancy_improving', 'maintenance_costs_increasing',
      'inspection_required', 'profitability_improving', 'lease_renewal_attention',
      'inspection_overdue', 'vacancy_risk', 'revenue_increasing', 'maintenance_budget_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  property_id uuid references public.real_estate_properties (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists real_estate_advisor_signals_tenant_idx
  on public.real_estate_advisor_signals (tenant_id, created_at desc);

create table if not exists public.real_estate_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'property_created', 'unit_created', 'tenant_added', 'lease_created', 'lease_renewed',
      'maintenance_request_created', 'vendor_assigned', 'financial_record_updated',
      'pack_activated', 'portfolio_updated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists real_estate_audit_logs_tenant_idx
  on public.real_estate_audit_logs (tenant_id, created_at desc);

alter table public.real_estate_units
  add constraint real_estate_units_tenant_record_fkey
  foreign key (tenant_id_ref) references public.real_estate_tenants (id) on delete set null;

alter table public.real_estate_pack_settings enable row level security;
alter table public.real_estate_portfolios enable row level security;
alter table public.real_estate_properties enable row level security;
alter table public.real_estate_units enable row level security;
alter table public.real_estate_tenants enable row level security;
alter table public.real_estate_leases enable row level security;
alter table public.real_estate_vendors enable row level security;
alter table public.real_estate_maintenance_requests enable row level security;
alter table public.real_estate_advisor_signals enable row level security;
alter table public.real_estate_audit_logs enable row level security;

revoke all on public.real_estate_pack_settings from authenticated, anon;
revoke all on public.real_estate_portfolios from authenticated, anon;
revoke all on public.real_estate_properties from authenticated, anon;
revoke all on public.real_estate_units from authenticated, anon;
revoke all on public.real_estate_tenants from authenticated, anon;
revoke all on public.real_estate_leases from authenticated, anon;
revoke all on public.real_estate_vendors from authenticated, anon;
revoke all on public.real_estate_maintenance_requests from authenticated, anon;
revoke all on public.real_estate_advisor_signals from authenticated, anon;
revoke all on public.real_estate_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'real_estate_property_operations_pack', v.description
from (values
  ('real_estate.view', 'View Real Estate Pack', 'View property portfolios, tenants, leases, maintenance, and financials'),
  ('real_estate.manage', 'Manage Real Estate Pack', 'Manage properties, units, tenants, leases, vendors, and portfolio settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Long-term property ownership and portfolio operations — properties, units, tenants, leases, maintenance, vendors, and financial performance.',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/real-estate',
    'hospitality_distinction', 'Hospitality Pack focuses on guests; Real Estate Pack focuses on assets, tenants, contracts, and portfolio performance.',
    'phase', 403
  ),
  updated_at = now()
where pack_key = 'real_estate_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _grep403_*
-- ---------------------------------------------------------------------------
create or replace function public._grep403_require_access()
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
    raise exception 'Real Estate Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._grep403_log_audit(
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
  insert into public.real_estate_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._grep403_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.real_estate_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.real_estate_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'real_estate_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 75
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.real_estate_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.real_estate_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._grep403_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.real_estate_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.real_estate_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'lease_renewal_approaching',
      'Lease renewals may be approaching across active units.',
      'Missed renewals increase vacancy risk and revenue uncertainty.',
      'Review Leases module and confirm renewal timelines with tenants.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'occupancy_improving',
      'Occupancy indicators are trending positively across the portfolio.',
      'Higher occupancy supports revenue stability and investor confidence.',
      'Document successful leasing patterns in Knowledge Center.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'maintenance_budget_review',
      'Maintenance activity may require budget review.',
      'Unplanned maintenance can impact net operating income.',
      'Open Maintenance Operations and review open work orders and vendor assignments.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._grep403_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_properties integer := 0;
  v_units integer := 0;
  v_tenants integer := 0;
  v_leases_active integer := 0;
  v_occupancy numeric := 0;
  v_revenue numeric := 0;
  v_expenses numeric := 0;
  v_portfolio_value numeric := 0;
  v_health numeric := 73;
  v_maintenance_open integer := 0;
  v_vacant_units integer := 0;
  v_occupied_units integer := 0;
begin
  select count(*)::int into v_properties
  from public.real_estate_properties where tenant_id = p_tenant_id and status = 'active';

  select count(*)::int,
         count(*) filter (where unit_status = 'vacant')::int,
         count(*) filter (where unit_status = 'occupied')::int
  into v_units, v_vacant_units, v_occupied_units
  from public.real_estate_units where tenant_id = p_tenant_id and unit_status != 'archived';

  select count(*)::int into v_tenants
  from public.real_estate_tenants where tenant_id = p_tenant_id and status = 'active';

  select count(*)::int into v_leases_active
  from public.real_estate_leases where tenant_id = p_tenant_id and lease_status = 'active';

  select coalesce(sum(monthly_revenue), 0), coalesce(sum(monthly_expenses), 0), coalesce(sum(market_value), 0)
  into v_revenue, v_expenses, v_portfolio_value
  from public.real_estate_properties where tenant_id = p_tenant_id and status = 'active';

  if v_units > 0 then
    v_occupancy := round(v_occupied_units::numeric / v_units::numeric * 100, 1);
  end if;

  select coalesce(health_score, 73) into v_health
  from public.real_estate_pack_settings where tenant_id = p_tenant_id;

  select count(*)::int into v_maintenance_open
  from public.real_estate_maintenance_requests
  where tenant_id = p_tenant_id and request_status not in ('completed', 'cancelled');

  return jsonb_build_object(
    'properties', v_properties,
    'units', v_units,
    'tenants', v_tenants,
    'lease_occupancy', v_occupancy,
    'active_leases', v_leases_active,
    'revenue', v_revenue,
    'expenses', v_expenses,
    'portfolio_value', v_portfolio_value,
    'portfolio_health_score', round(v_health)::int,
    'maintenance_open', v_maintenance_open,
    'vacant_units', v_vacant_units,
    'net_operating_income', v_revenue - v_expenses
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_real_estate_portfolio_operations_center()
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
  v_settings public.real_estate_pack_settings;
  v_properties jsonb := '[]'::jsonb;
  v_units jsonb := '[]'::jsonb;
  v_tenants jsonb := '[]'::jsonb;
  v_leases jsonb := '[]'::jsonb;
  v_vendors jsonb := '[]'::jsonb;
  v_maintenance jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_portfolios jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('real_estate.view');
  v_ctx := public._grep403_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._grep403_ensure_settings(v_org_id, v_tenant_id);
  perform public._grep403_seed_advisor(v_tenant_id);
  v_overview := public._grep403_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'property_key', p.property_key, 'property_name', p.property_name,
    'property_type', p.property_type, 'location', p.location,
    'ownership_label', p.ownership_label, 'market_value', p.market_value,
    'monthly_revenue', p.monthly_revenue, 'monthly_expenses', p.monthly_expenses,
    'performance_label', p.performance_label, 'portfolio_id', p.portfolio_id
  ) order by p.property_name), '[]'::jsonb)
  into v_properties
  from public.real_estate_properties p
  where p.tenant_id = v_tenant_id and p.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'property_id', u.property_id, 'unit_number', u.unit_number,
    'floor_label', u.floor_label, 'size_sqm', u.size_sqm, 'unit_status', u.unit_status,
    'monthly_rent', u.monthly_rent, 'lease_status', u.lease_status
  ) order by u.unit_number), '[]'::jsonb)
  into v_units
  from public.real_estate_units u
  where u.tenant_id = v_tenant_id and u.unit_status != 'archived'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'tenant_key', t.tenant_key, 'full_name', t.full_name,
    'email', t.email, 'phone', t.phone, 'status', t.status
  ) order by t.full_name), '[]'::jsonb)
  into v_tenants
  from public.real_estate_tenants t
  where t.tenant_id = v_tenant_id and t.status = 'active'
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'lease_reference', l.lease_reference, 'lease_status', l.lease_status,
    'lease_start', l.lease_start, 'lease_end', l.lease_end,
    'monthly_rent', l.monthly_rent, 'renewal_status', l.renewal_status,
    'property_id', l.property_id, 'unit_id', l.unit_id
  ) order by l.lease_end), '[]'::jsonb)
  into v_leases
  from public.real_estate_leases l
  where l.tenant_id = v_tenant_id
  limit 40;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'vendor_key', v.vendor_key, 'vendor_name', v.vendor_name,
    'vendor_type', v.vendor_type, 'reliability_score', v.reliability_score
  ) order by v.vendor_name), '[]'::jsonb)
  into v_vendors
  from public.real_estate_vendors v
  where v.tenant_id = v_tenant_id and v.status = 'active'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'request_reference', m.request_reference, 'priority', m.priority,
    'request_status', m.request_status, 'summary', m.summary, 'estimated_cost', m.estimated_cost
  ) order by m.created_at desc), '[]'::jsonb)
  into v_maintenance
  from public.real_estate_maintenance_requests m
  where m.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.real_estate_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.real_estate_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pf.id, 'name', pf.name, 'slug', pf.slug, 'portfolio_type', pf.portfolio_type,
    'portfolio_value', pf.portfolio_value, 'status', pf.status
  ) order by pf.name), '[]'::jsonb)
  into v_portfolios
  from public.real_estate_portfolios pf
  where pf.tenant_id = v_tenant_id and pf.status = 'active';

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Properties are assets — assets require visibility, governance, maintenance, profitability, and planning.',
    'mission', 'Real Estate & Property Operations System — long-term ownership, tenants, leases, maintenance, and portfolio growth.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Asset-centric portfolio governance on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'hospitality_route', '/app/hospitality',
    'distinction_note', 'Hospitality Pack focuses on guests. Real Estate Pack focuses on assets, tenants, contracts, and portfolio performance.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/real-estate'),
      jsonb_build_object('key', 'properties', 'route', '/app/real-estate/properties'),
      jsonb_build_object('key', 'tenants', 'route', '/app/real-estate/tenants'),
      jsonb_build_object('key', 'leases', 'route', '/app/real-estate/leases'),
      jsonb_build_object('key', 'maintenance', 'route', '/app/real-estate/maintenance'),
      jsonb_build_object('key', 'vendors', 'route', '/app/real-estate/vendors'),
      jsonb_build_object('key', 'financials', 'route', '/app/real-estate/financials'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/real-estate/intelligence')
    ),
    'properties', v_properties,
    'units', v_units,
    'tenants', v_tenants,
    'leases', v_leases,
    'vendors', v_vendors,
    'maintenance_requests', v_maintenance,
    'portfolios', v_portfolios,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'maintenance_route', '/app/real-estate/maintenance',
      'leases_route', '/app/real-estate/leases',
      'financials_route', '/app/real-estate/financials',
      'vendors_route', '/app/real-estate/vendors'
    ),
    'executive_dashboard', jsonb_build_object(
      'portfolio_value', v_overview->>'portfolio_value',
      'occupancy', v_overview->>'lease_occupancy',
      'revenue', v_overview->>'revenue',
      'expenses', v_overview->>'expenses',
      'profitability', v_overview->>'net_operating_income',
      'maintenance_open', v_overview->>'maintenance_open',
      'portfolio_health_score', v_overview->>'portfolio_health_score',
      'executive_route', '/app/real-estate/financials'
    ),
    'privacy_note', 'Property, tenant, and financial data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.real_estate_portfolio_operations_action(p_payload jsonb)
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
  v_property_name text;
  v_unit_id uuid;
  v_tenant_record_id uuid;
  v_lease_id uuid;
  v_portfolio public.real_estate_portfolios;
begin
  perform public._irp_require_permission('real_estate.manage');
  perform public._grep403_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._grep403_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_property' then
    insert into public.real_estate_properties (
      tenant_id, property_key, property_name, property_type, location,
      ownership_label, market_value, monthly_revenue, monthly_expenses
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'property_key', 'property-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'property_name', 'New property'),
      coalesce(p_payload->>'property_type', 'residential'),
      coalesce(p_payload->>'location', ''),
      coalesce(p_payload->>'ownership_label', ''),
      coalesce((p_payload->>'market_value')::numeric, 0),
      coalesce((p_payload->>'monthly_revenue')::numeric, 0),
      coalesce((p_payload->>'monthly_expenses')::numeric, 0)
    ) returning id, property_name into v_property_id, v_property_name;

    perform public._grep403_log_audit(
      v_tenant_id, 'property_created', 'Property created: ' || v_property_name,
      jsonb_build_object('property_id', v_property_id)
    );

    return jsonb_build_object('ok', true, 'property_id', v_property_id);
  end if;

  if v_action = 'create_unit' then
    insert into public.real_estate_units (
      tenant_id, property_id, unit_number, floor_label, size_sqm, unit_status, monthly_rent
    ) values (
      v_tenant_id,
      nullif(p_payload->>'property_id', '')::uuid,
      coalesce(p_payload->>'unit_number', '101'),
      coalesce(p_payload->>'floor_label', ''),
      coalesce((p_payload->>'size_sqm')::numeric, null),
      coalesce(p_payload->>'unit_status', 'vacant'),
      coalesce((p_payload->>'monthly_rent')::numeric, 0)
    ) returning id into v_unit_id;

    perform public._grep403_log_audit(
      v_tenant_id, 'unit_created', 'Unit created',
      jsonb_build_object('unit_id', v_unit_id)
    );

    return jsonb_build_object('ok', true, 'unit_id', v_unit_id);
  end if;

  if v_action = 'create_tenant' then
    insert into public.real_estate_tenants (
      tenant_id, tenant_key, full_name, email, phone
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'tenant_key', 'tenant-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'full_name', 'New tenant'),
      coalesce(p_payload->>'email', ''),
      coalesce(p_payload->>'phone', '')
    ) returning id into v_tenant_record_id;

    perform public._grep403_log_audit(
      v_tenant_id, 'tenant_added', 'Tenant added',
      jsonb_build_object('tenant_record_id', v_tenant_record_id)
    );

    return jsonb_build_object('ok', true, 'tenant_record_id', v_tenant_record_id);
  end if;

  if v_action = 'create_lease' then
    insert into public.real_estate_leases (
      tenant_id, property_id, unit_id, tenant_record_id, lease_reference,
      lease_status, lease_start, lease_end, monthly_rent, deposit_amount
    ) values (
      v_tenant_id,
      nullif(p_payload->>'property_id', '')::uuid,
      nullif(p_payload->>'unit_id', '')::uuid,
      nullif(p_payload->>'tenant_record_id', '')::uuid,
      coalesce(p_payload->>'lease_reference', 'LS-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'lease_status', 'pending'),
      coalesce((p_payload->>'lease_start')::date, current_date),
      coalesce((p_payload->>'lease_end')::date, current_date + 365),
      coalesce((p_payload->>'monthly_rent')::numeric, 0),
      coalesce((p_payload->>'deposit_amount')::numeric, 0)
    ) returning id into v_lease_id;

    perform public._grep403_log_audit(
      v_tenant_id, 'lease_created', 'Lease created',
      jsonb_build_object('lease_id', v_lease_id)
    );

    return jsonb_build_object('ok', true, 'lease_id', v_lease_id);
  end if;

  if v_action = 'create_portfolio' then
    insert into public.real_estate_portfolios (
      organization_id, tenant_id, name, slug, portfolio_type, region_code, portfolio_value
    ) values (
      v_org_id, v_tenant_id,
      coalesce(p_payload->>'name', 'Portfolio'),
      lower(regexp_replace(coalesce(p_payload->>'slug', 'portfolio-' || substr(gen_random_uuid()::text, 1, 6)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'portfolio_type', 'multi_property'),
      coalesce(p_payload->>'region_code', ''),
      coalesce((p_payload->>'portfolio_value')::numeric, 0)
    ) returning * into v_portfolio;

    perform public._grep403_log_audit(
      v_tenant_id, 'portfolio_updated', 'Portfolio created: ' || v_portfolio.name,
      jsonb_build_object('portfolio_id', v_portfolio.id)
    );

    return jsonb_build_object('ok', true, 'portfolio', row_to_json(v_portfolio)::jsonb);
  end if;

  raise exception 'Unsupported real estate action: %', v_action;
end;
$$;

grant execute on function public.get_real_estate_portfolio_operations_center() to authenticated;
grant execute on function public.real_estate_portfolio_operations_action(jsonb) to authenticated;

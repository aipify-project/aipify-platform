-- Phase 616 — Multi-Location, Chair Rental, Room Rental & Service Network Engine
-- Feature owner: CUSTOMER APP (/app/services/*)
-- Helpers: _net616_*
-- Extends Phase 610 booking — does not duplicate booking engine
-- Integrates Phase 606 absence and Phase 615 profitability interfaces only

-- ---------------------------------------------------------------------------
-- Section registry
-- ---------------------------------------------------------------------------
create table if not exists public.net616_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 22),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_networks', 1, 'service_networks', 'APP organization service network overview', 'APP organization service network overview')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_locations', 2, 'service_locations', 'Multi-location branches and salons', 'Multi-location branches and salons')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_groups', 3, 'location_groups', 'Optional location groupings for filtering and reporting', 'Optional location groupings for filtering and reporting')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_resources', 4, 'service_resources', 'Shared resource engine', 'Shared resource engine — chairs, rooms, workstations')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_providers', 5, 'service_providers', 'Employees, renters, and governed external providers', 'Employees, renters, and governed external providers')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('rental_agreements', 6, 'rental_agreements', 'Chair and room rental operational agreements', 'Chair and room rental operational agreements')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('provider_assignments', 7, 'provider_assignments', 'Provider to location, resource, and service assignments', 'Provider to location, resource, and service assignments')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_services', 8, 'location_services', 'Location-specific service availability and overrides', 'Location-specific service availability and overrides')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('availability_rules', 9, 'availability_rules', 'Multi-location availability validation rules', 'Multi-location availability validation rules')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('resource_blocks', 10, 'resource_blocks', 'Resource maintenance and manual blocks', 'Resource maintenance and manual blocks')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_hours', 11, 'location_hours', 'Location opening hours', 'Location opening hours')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_closures', 12, 'location_closures', 'Location closure periods', 'Location closure periods')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('customer_access_rules', 13, 'customer_access_rules', 'Renter customer visibility governance', 'Renter customer visibility governance')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('conflict_prevention', 14, 'conflict_prevention', 'Provider and resource double-booking prevention', 'Provider and resource double-booking prevention')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('booking_validation', 15, 'booking_validation', 'Server-side booking validation metadata', 'Server-side booking validation metadata')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('permission_scopes', 16, 'permission_scopes', 'Location and renter permission scopes', 'Location and renter permission scopes')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase610_booking_connection', 17, 'phase610_booking_connection', 'Phase 610 booking engine', 'Phase 610 booking engine — extend, do not duplicate')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase606_absence_connection', 18, 'phase606_absence_connection', 'Phase 606 absence and vacation mode integration', 'Phase 606 absence and vacation mode integration')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase615_profitability_connection', 19, 'phase615_profitability_connection', 'Phase 615 room and chair cost signals', 'Phase 615 room and chair cost signals — interfaces only')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('companion_advisor', 20, 'companion_advisor', 'Companion Service Network Advisor metadata', 'Companion Service Network Advisor metadata')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('mobile_summary', 21, 'mobile_summary', 'Mobile service network summary', 'Mobile service network summary')
on conflict (section_key) do nothing;

insert into public.net616_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('integration_hub', 22, 'integration_hub', 'Cross-phase integration hub references', 'Cross-phase integration hub references')
on conflict (section_key) do nothing;

create table if not exists public.net616_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'network' check (
    status_group in ('location', 'resource', 'provider', 'rental', 'network', 'availability')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.net616_status_defs (status_key, status_title, icon_key, status_group, summary) values
  ('active', 'Active', 'check-circle', 'location', 'Location or resource is active and bookable where permitted.'),
  ('temporarily_closed', 'Temporarily closed', 'alert-triangle', 'location', 'Location is temporarily closed — public booking restricted.'),
  ('opening_soon', 'Opening soon', 'clock', 'location', 'Location is opening soon — limited availability.'),
  ('restricted', 'Restricted', 'lock', 'location', 'Restricted access — authorized users only.'),
  ('archived', 'Archived', 'archive', 'location', 'Archived — historical reference only.'),
  ('available', 'Available', 'check-circle', 'resource', 'Resource is available for assignment or booking.'),
  ('assigned', 'Assigned', 'user-check', 'resource', 'Resource is assigned to a provider or renter.'),
  ('reserved', 'Reserved', 'bookmark', 'resource', 'Resource is reserved for a pending agreement.'),
  ('maintenance', 'Maintenance', 'wrench', 'resource', 'Resource under maintenance — not bookable.'),
  ('temporarily_unavailable', 'Temporarily unavailable', 'pause-circle', 'resource', 'Resource temporarily unavailable.'),
  ('draft', 'Draft', 'file-text', 'rental', 'Rental agreement draft — not yet active.'),
  ('pending_approval', 'Pending approval', 'clock', 'rental', 'Rental agreement awaiting approval.'),
  ('ending_soon', 'Ending soon', 'alert-circle', 'rental', 'Rental agreement ending soon — review required.'),
  ('suspended', 'Suspended', 'ban', 'rental', 'Rental agreement suspended — access restricted.'),
  ('ended', 'Ended', 'check', 'rental', 'Rental agreement ended.'),
  ('attention_required', 'Attention required', 'alert-triangle', 'network', 'Operational issue requires review.')
on conflict (status_key) do nothing;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_net616_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  service_network_enabled boolean not null default true,
  multi_location_enabled boolean not null default true,
  rental_management_enabled boolean not null default true,
  location_selector_enabled boolean not null default true,
  cross_location_double_booking_prevention boolean not null default true,
  resource_conflict_prevention boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  default_location_key text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_net616_settings enable row level security;
revoke all on public.organization_net616_settings from authenticated, anon;

-- APP organization service network overview
create table if not exists public.organization_net616_service_networks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_networks',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_service_networks_org on public.organization_net616_service_networks (organization_id);
create index if not exists idx_organization_net616_service_networks_org_status on public.organization_net616_service_networks (organization_id, record_status);
create index if not exists idx_organization_net616_service_networks_org_location on public.organization_net616_service_networks (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_service_networks enable row level security;
revoke all on public.organization_net616_service_networks from authenticated, anon;

-- Multi-location branches and salons
create table if not exists public.organization_net616_service_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_locations',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_service_locations_org on public.organization_net616_service_locations (organization_id);
create index if not exists idx_organization_net616_service_locations_org_status on public.organization_net616_service_locations (organization_id, record_status);
create index if not exists idx_organization_net616_service_locations_org_location on public.organization_net616_service_locations (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_service_locations enable row level security;
revoke all on public.organization_net616_service_locations from authenticated, anon;

-- Optional location groupings for filtering and reporting
create table if not exists public.organization_net616_location_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_groups',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_location_groups_org on public.organization_net616_location_groups (organization_id);
create index if not exists idx_organization_net616_location_groups_org_status on public.organization_net616_location_groups (organization_id, record_status);
create index if not exists idx_organization_net616_location_groups_org_location on public.organization_net616_location_groups (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_location_groups enable row level security;
revoke all on public.organization_net616_location_groups from authenticated, anon;

-- Shared resource engine — chairs, rooms, workstations
create table if not exists public.organization_net616_service_resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_resources',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_service_resources_org on public.organization_net616_service_resources (organization_id);
create index if not exists idx_organization_net616_service_resources_org_status on public.organization_net616_service_resources (organization_id, record_status);
create index if not exists idx_organization_net616_service_resources_org_location on public.organization_net616_service_resources (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_service_resources enable row level security;
revoke all on public.organization_net616_service_resources from authenticated, anon;

-- Employees, renters, and governed external providers
create table if not exists public.organization_net616_service_providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_providers',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_service_providers_org on public.organization_net616_service_providers (organization_id);
create index if not exists idx_organization_net616_service_providers_org_status on public.organization_net616_service_providers (organization_id, record_status);
create index if not exists idx_organization_net616_service_providers_org_location on public.organization_net616_service_providers (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_service_providers enable row level security;
revoke all on public.organization_net616_service_providers from authenticated, anon;

-- Chair and room rental operational agreements
create table if not exists public.organization_net616_rental_agreements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'rental_agreements',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_rental_agreements_org on public.organization_net616_rental_agreements (organization_id);
create index if not exists idx_organization_net616_rental_agreements_org_status on public.organization_net616_rental_agreements (organization_id, record_status);
create index if not exists idx_organization_net616_rental_agreements_org_location on public.organization_net616_rental_agreements (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_rental_agreements enable row level security;
revoke all on public.organization_net616_rental_agreements from authenticated, anon;

-- Provider to location, resource, and service assignments
create table if not exists public.organization_net616_provider_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'provider_assignments',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_provider_assignments_org on public.organization_net616_provider_assignments (organization_id);
create index if not exists idx_organization_net616_provider_assignments_org_status on public.organization_net616_provider_assignments (organization_id, record_status);
create index if not exists idx_organization_net616_provider_assignments_org_location on public.organization_net616_provider_assignments (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_provider_assignments enable row level security;
revoke all on public.organization_net616_provider_assignments from authenticated, anon;

-- Location-specific service availability and overrides
create table if not exists public.organization_net616_location_services (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_services',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_location_services_org on public.organization_net616_location_services (organization_id);
create index if not exists idx_organization_net616_location_services_org_status on public.organization_net616_location_services (organization_id, record_status);
create index if not exists idx_organization_net616_location_services_org_location on public.organization_net616_location_services (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_location_services enable row level security;
revoke all on public.organization_net616_location_services from authenticated, anon;

-- Multi-location availability validation rules
create table if not exists public.organization_net616_availability_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'availability_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_availability_rules_org on public.organization_net616_availability_rules (organization_id);
create index if not exists idx_organization_net616_availability_rules_org_status on public.organization_net616_availability_rules (organization_id, record_status);
create index if not exists idx_organization_net616_availability_rules_org_location on public.organization_net616_availability_rules (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_availability_rules enable row level security;
revoke all on public.organization_net616_availability_rules from authenticated, anon;

-- Resource maintenance and manual blocks
create table if not exists public.organization_net616_resource_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'resource_blocks',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_resource_blocks_org on public.organization_net616_resource_blocks (organization_id);
create index if not exists idx_organization_net616_resource_blocks_org_status on public.organization_net616_resource_blocks (organization_id, record_status);
create index if not exists idx_organization_net616_resource_blocks_org_location on public.organization_net616_resource_blocks (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_resource_blocks enable row level security;
revoke all on public.organization_net616_resource_blocks from authenticated, anon;

-- Location opening hours
create table if not exists public.organization_net616_location_hours (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_hours',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_location_hours_org on public.organization_net616_location_hours (organization_id);
create index if not exists idx_organization_net616_location_hours_org_status on public.organization_net616_location_hours (organization_id, record_status);
create index if not exists idx_organization_net616_location_hours_org_location on public.organization_net616_location_hours (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_location_hours enable row level security;
revoke all on public.organization_net616_location_hours from authenticated, anon;

-- Location closure periods
create table if not exists public.organization_net616_location_closures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_closures',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_location_closures_org on public.organization_net616_location_closures (organization_id);
create index if not exists idx_organization_net616_location_closures_org_status on public.organization_net616_location_closures (organization_id, record_status);
create index if not exists idx_organization_net616_location_closures_org_location on public.organization_net616_location_closures (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_location_closures enable row level security;
revoke all on public.organization_net616_location_closures from authenticated, anon;

-- Renter customer visibility governance
create table if not exists public.organization_net616_customer_access_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'customer_access_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_customer_access_rules_org on public.organization_net616_customer_access_rules (organization_id);
create index if not exists idx_organization_net616_customer_access_rules_org_status on public.organization_net616_customer_access_rules (organization_id, record_status);
create index if not exists idx_organization_net616_customer_access_rules_org_location on public.organization_net616_customer_access_rules (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_customer_access_rules enable row level security;
revoke all on public.organization_net616_customer_access_rules from authenticated, anon;

-- Provider and resource double-booking prevention
create table if not exists public.organization_net616_conflict_prevention (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'conflict_prevention',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_conflict_prevention_org on public.organization_net616_conflict_prevention (organization_id);
create index if not exists idx_organization_net616_conflict_prevention_org_status on public.organization_net616_conflict_prevention (organization_id, record_status);
create index if not exists idx_organization_net616_conflict_prevention_org_location on public.organization_net616_conflict_prevention (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_conflict_prevention enable row level security;
revoke all on public.organization_net616_conflict_prevention from authenticated, anon;

-- Server-side booking validation metadata
create table if not exists public.organization_net616_booking_validation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'booking_validation',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_booking_validation_org on public.organization_net616_booking_validation (organization_id);
create index if not exists idx_organization_net616_booking_validation_org_status on public.organization_net616_booking_validation (organization_id, record_status);
create index if not exists idx_organization_net616_booking_validation_org_location on public.organization_net616_booking_validation (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_booking_validation enable row level security;
revoke all on public.organization_net616_booking_validation from authenticated, anon;

-- Location and renter permission scopes
create table if not exists public.organization_net616_permission_scopes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'permission_scopes',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_permission_scopes_org on public.organization_net616_permission_scopes (organization_id);
create index if not exists idx_organization_net616_permission_scopes_org_status on public.organization_net616_permission_scopes (organization_id, record_status);
create index if not exists idx_organization_net616_permission_scopes_org_location on public.organization_net616_permission_scopes (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_permission_scopes enable row level security;
revoke all on public.organization_net616_permission_scopes from authenticated, anon;

-- Phase 610 booking engine — extend, do not duplicate
create table if not exists public.organization_net616_phase610_booking_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase610_booking_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_phase610_booking_connection_org on public.organization_net616_phase610_booking_connection (organization_id);
create index if not exists idx_organization_net616_phase610_booking_connection_org_status on public.organization_net616_phase610_booking_connection (organization_id, record_status);
create index if not exists idx_organization_net616_phase610_booking_connection_org_location on public.organization_net616_phase610_booking_connection (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_phase610_booking_connection enable row level security;
revoke all on public.organization_net616_phase610_booking_connection from authenticated, anon;

-- Phase 606 absence and vacation mode integration
create table if not exists public.organization_net616_phase606_absence_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase606_absence_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_phase606_absence_connection_org on public.organization_net616_phase606_absence_connection (organization_id);
create index if not exists idx_organization_net616_phase606_absence_connection_org_status on public.organization_net616_phase606_absence_connection (organization_id, record_status);
create index if not exists idx_organization_net616_phase606_absence_connection_org_location on public.organization_net616_phase606_absence_connection (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_phase606_absence_connection enable row level security;
revoke all on public.organization_net616_phase606_absence_connection from authenticated, anon;

-- Phase 615 room and chair cost signals — interfaces only
create table if not exists public.organization_net616_phase615_profitability_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase615_profitability_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_phase615_profitability_connection_org on public.organization_net616_phase615_profitability_connection (organization_id);
create index if not exists idx_organization_net616_phase615_profitability_connection_org_status on public.organization_net616_phase615_profitability_connection (organization_id, record_status);
create index if not exists idx_organization_net616_phase615_profitability_connection_org_location on public.organization_net616_phase615_profitability_connection (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_phase615_profitability_connection enable row level security;
revoke all on public.organization_net616_phase615_profitability_connection from authenticated, anon;

-- Companion Service Network Advisor metadata
create table if not exists public.organization_net616_companion_advisor (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'companion_advisor',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_companion_advisor_org on public.organization_net616_companion_advisor (organization_id);
create index if not exists idx_organization_net616_companion_advisor_org_status on public.organization_net616_companion_advisor (organization_id, record_status);
create index if not exists idx_organization_net616_companion_advisor_org_location on public.organization_net616_companion_advisor (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_companion_advisor enable row level security;
revoke all on public.organization_net616_companion_advisor from authenticated, anon;

-- Mobile service network summary
create table if not exists public.organization_net616_mobile_summary (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'mobile_summary',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_mobile_summary_org on public.organization_net616_mobile_summary (organization_id);
create index if not exists idx_organization_net616_mobile_summary_org_status on public.organization_net616_mobile_summary (organization_id, record_status);
create index if not exists idx_organization_net616_mobile_summary_org_location on public.organization_net616_mobile_summary (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_mobile_summary enable row level security;
revoke all on public.organization_net616_mobile_summary from authenticated, anon;

-- Cross-phase integration hub references
create table if not exists public.organization_net616_integration_hub (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'integration_hub',
  scope_type text not null default 'organization' check (
    scope_type in ('organization', 'location_group', 'location', 'resource', 'provider', 'renter')
  ),
  location_label text not null default '',
  resource_label text not null default '',
  provider_label text not null default '',
  service_label text not null default '',
  location_key text not null default '',
  resource_key text not null default '',
  provider_key text not null default '',
  resource_type text not null default '',
  provider_type text not null default '',
  rental_model text not null default '',
  rental_amount numeric(14,2),
  currency_code text not null default 'NOK',
  capacity integer,
  city text not null default '',
  timezone text not null default 'Europe/Oslo',
  starts_at timestamptz,
  ends_at timestamptz,
  integration_ref text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists idx_organization_net616_integration_hub_org on public.organization_net616_integration_hub (organization_id);
create index if not exists idx_organization_net616_integration_hub_org_status on public.organization_net616_integration_hub (organization_id, record_status);
create index if not exists idx_organization_net616_integration_hub_org_location on public.organization_net616_integration_hub (organization_id, location_key) where location_key <> '';

alter table public.organization_net616_integration_hub enable row level security;
revoke all on public.organization_net616_integration_hub from authenticated, anon;

create table if not exists public.organization_net616_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'service_network',
  entity_type text not null default '',
  entity_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_net616_audit_org_created on public.organization_net616_audit_logs (organization_id, created_at desc);

alter table public.organization_net616_audit_logs enable row level security;
revoke all on public.organization_net616_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._net616_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._net616_status(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key, 'status_title', d.status_title,
      'icon_key', d.icon_key, 'status_group', d.status_group
    ) from public.net616_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', p_status_key, 'icon_key', 'circle', 'status_group', 'network'));
$$;

create or replace function public._net616_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_entity_type text default '', p_entity_key text default ''
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_net616_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, entity_type, entity_key, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, 'service_network', coalesce(p_entity_type, ''), coalesce(p_entity_key, ''),
    left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._net616_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_net616_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._net616_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_net616_service_locations where organization_id = p_org_id limit 1) then
    return;
  end if;

  perform public._net616_ensure_settings(p_org_id);

  update public.organization_net616_settings
  set default_location_key = 'loc_main', updated_at = now()
  where organization_id = p_org_id;

  insert into public.organization_net616_service_networks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'servicenetwo_base', initcap(replace('service_networks', '_', ' ')), 'active', 'circle', 'Active', 'service_networks', 'organization',
    'Baseline seed — Phase 616 service_networks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_locations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'servicelocat_base', initcap(replace('service_locations', '_', ' ')), 'active', 'circle', 'Active', 'service_locations', 'organization',
    'Baseline seed — Phase 616 service_locations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_groups (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'locationgrou_base', initcap(replace('location_groups', '_', ' ')), 'active', 'circle', 'Active', 'location_groups', 'organization',
    'Baseline seed — Phase 616 location_groups.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_resources (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'serviceresou_base', initcap(replace('service_resources', '_', ' ')), 'active', 'circle', 'Active', 'service_resources', 'organization',
    'Baseline seed — Phase 616 service_resources.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_providers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'serviceprovi_base', initcap(replace('service_providers', '_', ' ')), 'active', 'circle', 'Active', 'service_providers', 'organization',
    'Baseline seed — Phase 616 service_providers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_rental_agreements (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'rentalagreem_base', initcap(replace('rental_agreements', '_', ' ')), 'active', 'circle', 'Active', 'rental_agreements', 'organization',
    'Baseline seed — Phase 616 rental_agreements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_provider_assignments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'providerassi_base', initcap(replace('provider_assignments', '_', ' ')), 'active', 'circle', 'Active', 'provider_assignments', 'organization',
    'Baseline seed — Phase 616 provider_assignments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_services (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'locationserv_base', initcap(replace('location_services', '_', ' ')), 'active', 'circle', 'Active', 'location_services', 'organization',
    'Baseline seed — Phase 616 location_services.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_availability_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'availability_base', initcap(replace('availability_rules', '_', ' ')), 'active', 'circle', 'Active', 'availability_rules', 'organization',
    'Baseline seed — Phase 616 availability_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_resource_blocks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'resourcebloc_base', initcap(replace('resource_blocks', '_', ' ')), 'active', 'circle', 'Active', 'resource_blocks', 'organization',
    'Baseline seed — Phase 616 resource_blocks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_hours (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'locationhour_base', initcap(replace('location_hours', '_', ' ')), 'active', 'circle', 'Active', 'location_hours', 'organization',
    'Baseline seed — Phase 616 location_hours.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_closures (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'locationclos_base', initcap(replace('location_closures', '_', ' ')), 'active', 'circle', 'Active', 'location_closures', 'organization',
    'Baseline seed — Phase 616 location_closures.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_customer_access_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'customeracce_base', initcap(replace('customer_access_rules', '_', ' ')), 'active', 'circle', 'Active', 'customer_access_rules', 'organization',
    'Baseline seed — Phase 616 customer_access_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_conflict_prevention (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'conflictprev_base', initcap(replace('conflict_prevention', '_', ' ')), 'active', 'circle', 'Active', 'conflict_prevention', 'organization',
    'Baseline seed — Phase 616 conflict_prevention.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_booking_validation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'bookingvalid_base', initcap(replace('booking_validation', '_', ' ')), 'active', 'circle', 'Active', 'booking_validation', 'organization',
    'Baseline seed — Phase 616 booking_validation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_permission_scopes (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'permissionsc_base', initcap(replace('permission_scopes', '_', ' ')), 'active', 'circle', 'Active', 'permission_scopes', 'organization',
    'Baseline seed — Phase 616 permission_scopes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase610_booking_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'phase610book_base', initcap(replace('phase610_booking_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase610_booking_connection', 'organization',
    'Baseline seed — Phase 616 phase610_booking_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase606_absence_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'phase606abse_base', initcap(replace('phase606_absence_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase606_absence_connection', 'organization',
    'Baseline seed — Phase 616 phase606_absence_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase615_profitability_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'phase615prof_base', initcap(replace('phase615_profitability_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase615_profitability_connection', 'organization',
    'Baseline seed — Phase 616 phase615_profitability_connection.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_companion_advisor (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'companionadv_base', initcap(replace('companion_advisor', '_', ' ')), 'active', 'circle', 'Active', 'companion_advisor', 'organization',
    'Baseline seed — Phase 616 companion_advisor.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_mobile_summary (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'mobilesummar_base', initcap(replace('mobile_summary', '_', ' ')), 'active', 'circle', 'Active', 'mobile_summary', 'organization',
    'Baseline seed — Phase 616 mobile_summary.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, summary, metadata
  ) values (
    p_org_id, 'integrationh_base', initcap(replace('integration_hub', '_', ' ')), 'active', 'circle', 'Active', 'integration_hub', 'organization',
    'Baseline seed — Phase 616 integration_hub.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_networks (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'net_main', 'Primary service network', 'active', 'network', 'Active', 'service_networks',
    'APP organization service network — locations, resources, providers, and rentals under one license.',
    '{"hierarchy":"platform→app→network→location→resource→provider→service→availability→booking"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_locations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    location_key, location_label, city, timezone, scope_type, summary, metadata
  ) values
    (p_org_id, 'loc_main', 'Main salon', 'active', 'check-circle', 'Active', 'service_locations',
     'loc_main', 'Main salon', 'Oslo', 'Europe/Oslo', 'location',
     'Default location for single-location organizations — migrated safely from existing services.',
     '{"location_type":"salon","manager":"Location manager"}'::jsonb),
    (p_org_id, 'loc_branch', 'Bergen branch', 'active', 'check-circle', 'Active', 'service_locations',
     'loc_branch', 'Bergen branch', 'Bergen', 'Europe/Oslo', 'location',
     'Second location — separate hours, providers, and resources.',
     '{"location_type":"salon","manager":"Branch manager"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_groups (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'grp_west', 'Western Norway', 'active', 'map', 'Active', 'location_groups',
    'Lightweight location group for filtering and regional management.',
    '{"members":["loc_main","loc_branch"]}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_resources (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    location_key, location_label, resource_key, resource_label, resource_type, capacity, rental_model, rental_amount, currency_code, summary, metadata
  ) values
    (p_org_id, 'res_chair_1', 'Chair 1 — Main', 'assigned', 'user-check', 'Assigned', 'service_resources',
     'loc_main', 'Main salon', 'res_chair_1', 'Chair 1', 'chair', 1, 'fixed_monthly_rent', 8500.00, 'NOK',
     'Rentable chair with exclusive use — governed rental agreement required.',
     '{"shared_or_exclusive":"exclusive","bookable":true}'::jsonb),
    (p_org_id, 'res_room_1', 'Treatment room A', 'available', 'check-circle', 'Available', 'service_resources',
     'loc_main', 'Main salon', 'res_room_1', 'Treatment room A', 'room', 1, 'fixed_daily_rent', 450.00, 'NOK',
     'Rentable treatment room with preparation and cleanup buffers.',
     '{"room_type":"treatment_room","cleaning_buffer_minutes":15}'::jsonb),
    (p_org_id, 'res_workstation_1', 'Workstation 3', 'available', 'check-circle', 'Available', 'service_resources',
     'loc_branch', 'Bergen branch', 'res_workstation_1', 'Workstation 3', 'workstation', 1, 'percentage_based', null, 'NOK',
     'Shared workstation — availability evaluated with provider schedule.',
     '{"shared_or_exclusive":"shared"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_service_providers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    provider_key, provider_label, provider_type, location_key, location_label, resource_key, resource_label, summary, metadata
  ) values
    (p_org_id, 'prov_employee_1', 'Anna Nordmann', 'active', 'check-circle', 'Active', 'service_providers',
     'prov_employee_1', 'Anna Nordmann', 'employee', 'loc_main', 'Main salon', '', '',
     'Employee provider — multiple locations with unified schedule.',
     '{"professional_title":"Senior stylist","locations":["loc_main","loc_branch"]}'::jsonb),
    (p_org_id, 'prov_renter_1', 'Kari Olsen', 'active', 'check-circle', 'Active', 'service_providers',
     'prov_renter_1', 'Kari Olsen', 'chair_renter', 'loc_main', 'Main salon', 'res_chair_1', 'Chair 1',
     'Chair renter — governed access to assigned resource and permitted customers.',
     '{"professional_title":"Independent stylist","rental_status":"active"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_rental_agreements (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    location_key, location_label, resource_key, resource_label, provider_key, provider_label,
    rental_model, rental_amount, currency_code, starts_at, ends_at, summary, metadata
  ) values (
    p_org_id, 'rent_chair_1', 'Chair 1 — Kari Olsen', 'active', 'check-circle', 'Active', 'rental_agreements',
    'loc_main', 'Main salon', 'res_chair_1', 'Chair 1', 'prov_renter_1', 'Kari Olsen',
    'fixed_monthly_rent', 8500.00, 'NOK', now() - interval '30 days', now() + interval '335 days',
    'Operational rental agreement — not a legal contract generator.',
    '{"agreement_type":"chair_rental","customer_ownership":"organization_owned","approved_by":"Location manager"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_provider_assignments (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    provider_key, provider_label, location_key, resource_key, service_label, summary, metadata
  ) values (
    p_org_id, 'asgn_renter_chair', 'Kari → Chair 1', 'active', 'link', 'Assigned', 'provider_assignments',
    'prov_renter_1', 'Kari Olsen', 'loc_main', 'res_chair_1', 'Cut & Color',
    'Renter to chair assignment with governed permission scope.',
    '{"assignment_type":"renter_to_chair"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_location_services (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key,
    location_key, location_label, service_label, summary, metadata
  ) values (
    p_org_id, 'svc_loc_main_cut', 'Cut & Color @ Main', 'active', 'scissors', 'Available', 'location_services',
    'loc_main', 'Main salon', 'Cut & Color',
    'Service enabled at location — shared definition with location assignment.',
    '{"required_resource_type":"chair","customer_visible":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_availability_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'avail_validation', 'Multi-location availability validation', 'active', 'shield', 'Active', 'availability_rules',
    'Server-authoritative validation order — location, provider, resource, absence, booking conflict.',
    '{"validation_order":["organization","location","provider","resource","absence","booking"],"client_advisory_only":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_conflict_prevention (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'conflict_engine', 'Cross-location conflict prevention', 'active', 'shield-check', 'Active', 'conflict_prevention',
    'Prevents provider double-booking across locations and resource overlap.',
    '{"provider_cross_location":true,"resource_exclusive":true,"transition_buffer_minutes":30}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_booking_validation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'book_validate', 'Booking validation — Phase 610 extension', 'linked', 'calendar-check', 'Booking linked', 'booking_validation',
    'phase610_appointment_booking',
    'Extends Phase 610 booking — validates location, provider, resource before confirmation.',
    '{"phase610_ref":"get_organization_appointment_center","duplicate_engine":false,"error_codes":["BOOKING_CONFLICT","RESOURCE_UNAVAILABLE","PROVIDER_NOT_AVAILABLE"]}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase610_booking_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appt610_link', 'Phase 610 booking extension', 'linked', 'calendar', 'Booking linked', 'phase610_booking_connection',
    'phase610_appointment_booking',
    'Phase 610 appointment booking — extend availability and validation, do not duplicate engine.',
    '{"phase610_ref":"get_organization_appointment_center","duplicate_engine":false,"href":"/app/appointments"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase606_absence_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vac606_link', 'Phase 606 absence integration', 'linked', 'umbrella', 'Absence linked', 'phase606_absence_connection',
    'phase606_absence',
    'Vacation Mode and absence coverage block provider and location availability.',
    '{"phase606_ref":"get_organization_absence_center","duplicate_engine":false,"href":"/app/absence"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_phase615_profitability_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'prof615_link', 'Phase 615 room and chair cost signals', 'linked', 'trending-up', 'Cost signals linked', 'phase615_profitability_connection',
    'phase615_resource_profitability',
    'Phase 615 resource profitability — chair and room cost signals, interfaces only.',
    '{"phase615_ref":"get_organization_profitability_center","duplicate_engine":false,"href":"/app/profitability/resources"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_net616_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values
    (p_org_id, 'int_610', 'Booking engine', 'linked', 'calendar', 'Booking linked', 'integration_hub', 'phase610', 'Phase 610 appointment booking — extend only.', '{"href":"/app/appointments"}'::jsonb),
    (p_org_id, 'int_606', 'Absence coverage', 'linked', 'umbrella', 'Absence linked', 'integration_hub', 'phase606', 'Phase 606 vacation mode and absence.', '{"href":"/app/absence"}'::jsonb),
    (p_org_id, 'int_615', 'Profitability signals', 'linked', 'trending-up', 'Cost linked', 'integration_hub', 'phase615', 'Phase 615 room and chair cost signals.', '{"href":"/app/profitability/resources"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  perform public._net616_log(p_org_id, 'service_network_seeded', 'Service network center baseline seeded — Phase 616.');
end; $$;

create or replace function public._net616_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''location_label'', location_label, ''resource_label'', resource_label,
      ''provider_label'', provider_label, ''service_label'', service_label,
      ''location_key'', location_key, ''resource_key'', resource_key, ''provider_key'', provider_key,
      ''resource_type'', resource_type, ''provider_type'', provider_type,
      ''rental_model'', rental_model, ''rental_amount'', rental_amount, ''currency_code'', currency_code,
      ''capacity'', capacity, ''city'', city, ''timezone'', timezone,
      ''integration_ref'', integration_ref, ''priority'', priority,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_net616_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public._net616_record_by_key(p_org_id uuid, p_domain text, p_record_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''location_label'', location_label, ''resource_label'', resource_label,
      ''provider_label'', provider_label, ''service_label'', service_label,
      ''location_key'', location_key, ''resource_key'', resource_key, ''provider_key'', provider_key,
      ''resource_type'', resource_type, ''provider_type'', provider_type,
      ''rental_model'', rental_model, ''rental_amount'', rental_amount, ''currency_code'', currency_code,
      ''capacity'', capacity, ''city'', city, ''timezone'', timezone,
      ''integration_ref'', integration_ref, ''priority'', priority,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) from public.organization_net616_%s where organization_id = $1 and record_key = $2 limit 1',
    p_domain
  );
  execute v_sql into v_result using p_org_id, p_record_key;
  return v_result;
end; $$;

create or replace function public.get_organization_service_network_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_net616_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._net616_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._net616_seed(v_org_id);
  select * into v_settings from public.organization_net616_settings where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'service_network_phase616',
      'principle', 'Aipify manages your service network — multiple locations, resources, and providers under one APP organization.',
      'privacy_note', 'Location and renter scopes are enforced server-side. Renters see only permitted customers and bookings.',
      'hierarchy_note', 'Platform → APP → Service Network → Location → Resource → Provider → Service → Availability → Booking',
      'section_count', 22,
      'settings', jsonb_build_object(
        'service_network_enabled', coalesce(v_settings.service_network_enabled, true),
        'multi_location_enabled', coalesce(v_settings.multi_location_enabled, true),
        'rental_management_enabled', coalesce(v_settings.rental_management_enabled, true),
        'location_selector_enabled', coalesce(v_settings.location_selector_enabled, true),
        'cross_location_double_booking_prevention', coalesce(v_settings.cross_location_double_booking_prevention, true),
        'resource_conflict_prevention', coalesce(v_settings.resource_conflict_prevention, true),
        'default_location_key', coalesce(v_settings.default_location_key, 'loc_main')
      ),
      'stats', jsonb_build_object(
        'locations', (select count(*) from public.organization_net616_service_locations where organization_id = v_org_id and record_status not in ('archived')),
        'resources', (select count(*) from public.organization_net616_service_resources where organization_id = v_org_id and record_status not in ('archived')),
        'providers', (select count(*) from public.organization_net616_service_providers where organization_id = v_org_id and record_status not in ('ended')),
        'active_rentals', (select count(*) from public.organization_net616_rental_agreements where organization_id = v_org_id and record_status = 'active'),
        'pending_rentals', (select count(*) from public.organization_net616_rental_agreements where organization_id = v_org_id and record_status = 'pending_approval'),
        'location_groups', (select count(*) from public.organization_net616_location_groups where organization_id = v_org_id)
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.net616_section_defs s), '[]'::jsonb),
      'status_defs', coalesce((select jsonb_agg(public._net616_status(d.status_key) order by d.status_key)
        from public.net616_status_defs d), '[]'::jsonb),
      'locations', public._net616_section_rows(v_org_id, 'service_locations'),
      'resources', public._net616_section_rows(v_org_id, 'service_resources'),
      'providers', public._net616_section_rows(v_org_id, 'service_providers'),
      'rentals', public._net616_section_rows(v_org_id, 'rental_agreements'),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'rentals', 'observation', 'Review pending and ending rental agreements.',
          'recommendation', 'Approve agreements and confirm resource assignments before renters access schedules.', 'href', '/app/services/rentals'),
        jsonb_build_object('key', 'locations', 'observation', 'Verify opening hours and closure periods per location.',
          'recommendation', 'Update location hours before changing public booking availability.', 'href', '/app/services/locations')
      ),
      'integrations', public._net616_section_rows(v_org_id, 'integration_hub'),
      'routes', jsonb_build_object(
        'network', '/app/services/network',
        'locations', '/app/services/locations',
        'resources', '/app/services/resources',
        'providers', '/app/services/providers',
        'rentals', '/app/services/rentals',
        'appointments', '/app/appointments'
      )
    );
  end if;

  case v_section
    when 'network' then v_rows := public._net616_section_rows(v_org_id, 'service_networks');
    when 'locations' then v_rows := public._net616_section_rows(v_org_id, 'service_locations');
    when 'resources' then v_rows := public._net616_section_rows(v_org_id, 'service_resources');
    when 'providers' then v_rows := public._net616_section_rows(v_org_id, 'service_providers');
    when 'rentals' then v_rows := public._net616_section_rows(v_org_id, 'rental_agreements');
    when 'availability' then v_rows := public._net616_section_rows(v_org_id, 'availability_rules');
    when 'assignments' then v_rows := public._net616_section_rows(v_org_id, 'provider_assignments');
    else v_rows := '[]'::jsonb;
  end case;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'service_network_phase616',
    'principle', 'Aipify manages locations, resources, providers, and rentals — one APP organization, governed scopes.',
    'privacy_note', 'Renters and location managers see only permitted operational data.',
    'status_defs', coalesce((select jsonb_agg(public._net616_status(d.status_key) order by d.status_key)
      from public.net616_status_defs d), '[]'::jsonb),
    'records', v_rows,
    'locations', public._net616_section_rows(v_org_id, 'service_locations'),
    'integrations', public._net616_section_rows(v_org_id, 'integration_hub'),
    'settings', jsonb_build_object(
      'default_location_key', coalesce(v_settings.default_location_key, 'loc_main'),
      'location_selector_enabled', coalesce(v_settings.location_selector_enabled, true)
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'entity_type', l.entity_type, 'entity_key', l.entity_key,
      'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_net616_audit_logs where organization_id = v_org_id order by created_at desc limit 15
    ) l), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_organization_service_network_detail(
  p_entity_type text,
  p_record_key text
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_type text := lower(coalesce(nullif(trim(p_entity_type), ''), ''));
  v_key text := coalesce(nullif(trim(p_record_key), ''), '');
  v_domain text;
  v_record jsonb;
begin
  v_org_id := public._net616_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  if v_key = '' then return jsonb_build_object('found', false, 'error', 'Record key required'); end if;

  perform public._net616_seed(v_org_id);

  v_domain := case v_type
    when 'location' then 'service_locations'
    when 'locations' then 'service_locations'
    when 'resource' then 'service_resources'
    when 'resources' then 'service_resources'
    when 'provider' then 'service_providers'
    when 'providers' then 'service_providers'
    when 'rental' then 'rental_agreements'
    when 'rentals' then 'rental_agreements'
    else null
  end;

  if v_domain is null then
    return jsonb_build_object('found', false, 'error', 'INVALID_ENTITY_TYPE');
  end if;

  v_record := public._net616_record_by_key(v_org_id, v_domain, v_key);
  if v_record is null then
    return jsonb_build_object('found', false, 'error', 'RECORD_NOT_FOUND', 'entity_type', v_type, 'record_key', v_key);
  end if;

  return jsonb_build_object(
    'found', true,
    'entity_type', v_type,
    'record_key', v_key,
    'record', v_record,
    'related_assignments', public._net616_section_rows(v_org_id, 'provider_assignments'),
    'related_resources', public._net616_section_rows(v_org_id, 'service_resources'),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_net616_audit_logs
      where organization_id = v_org_id and entity_key = v_key order by created_at desc limit 10
    ) l), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_organization_service_network_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_net616_settings;
begin
  v_org_id := public._net616_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._net616_ensure_settings(v_org_id);
  select * into v_settings from public.organization_net616_settings where organization_id = v_org_id;
  return jsonb_build_object(
    'found', true,
    'settings', jsonb_build_object(
      'service_network_enabled', coalesce(v_settings.service_network_enabled, true),
      'multi_location_enabled', coalesce(v_settings.multi_location_enabled, true),
      'rental_management_enabled', coalesce(v_settings.rental_management_enabled, true),
      'location_selector_enabled', coalesce(v_settings.location_selector_enabled, true),
      'cross_location_double_booking_prevention', coalesce(v_settings.cross_location_double_booking_prevention, true),
      'resource_conflict_prevention', coalesce(v_settings.resource_conflict_prevention, true),
      'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true),
      'default_location_key', coalesce(v_settings.default_location_key, '')
    ),
    'principle', 'One APP organization manages all locations — locations are not separate tenants.'
  );
end; $$;

create or replace function public.get_organization_service_network_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  v_center := public.get_organization_service_network_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  return jsonb_build_object(
    'found', true,
    'summary_title', 'Service network snapshot',
    'stats', v_center->'stats',
    'default_location_key', v_center->'settings'->>'default_location_key',
    'href', '/app/services/network'
  );
end; $$;

create or replace function public.net616_search_availability(
  p_location_key text default '',
  p_service_label text default '',
  p_provider_key text default '',
  p_resource_type text default '',
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  v_org_id := public._net616_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._net616_seed(v_org_id);

  return jsonb_build_object(
    'found', true,
    'search_params', jsonb_build_object(
      'location_key', coalesce(nullif(p_location_key, ''), 'loc_main'),
      'service_label', p_service_label,
      'provider_key', p_provider_key,
      'resource_type', p_resource_type,
      'starts_at', p_starts_at,
      'ends_at', p_ends_at
    ),
    'validation_order', jsonb_build_array(
      'organization_active', 'location_active', 'location_open', 'service_at_location',
      'provider_active', 'provider_not_absent', 'resource_available', 'no_booking_conflict'
    ),
    'available_slots', '[]'::jsonb,
    'principle', 'Server-authoritative availability — client results are advisory only.',
    'phase610_ref', 'get_organization_appointment_center',
    'conflict_prevention', public._net616_section_rows(v_org_id, 'conflict_prevention'),
    'availability_rules', public._net616_section_rows(v_org_id, 'availability_rules')
  );
end; $$;

create or replace function public.net616_validate_booking(
  p_location_key text,
  p_provider_key text default '',
  p_resource_key text default '',
  p_service_label text default '',
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_location_active boolean;
  v_provider_active boolean;
  v_resource_available boolean;
begin
  v_org_id := public._net616_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'valid', false, 'error', 'Organization not found'); end if;
  perform public._net616_seed(v_org_id);

  select exists(
    select 1 from public.organization_net616_service_locations
    where organization_id = v_org_id and location_key = p_location_key and record_status = 'active'
  ) into v_location_active;

  if not v_location_active then
    return jsonb_build_object('found', true, 'valid', false, 'error_code', 'LOCATION_INACTIVE', 'message', 'Location is not active.');
  end if;

  if coalesce(p_provider_key, '') <> '' then
    select exists(
      select 1 from public.organization_net616_service_providers
      where organization_id = v_org_id and provider_key = p_provider_key and record_status = 'active'
    ) into v_provider_active;
    if not v_provider_active then
      return jsonb_build_object('found', true, 'valid', false, 'error_code', 'PROVIDER_NOT_AVAILABLE', 'message', 'Provider is not available.');
    end if;
  end if;

  if coalesce(p_resource_key, '') <> '' then
    select exists(
      select 1 from public.organization_net616_service_resources
      where organization_id = v_org_id and resource_key = p_resource_key
        and record_status in ('available', 'assigned')
    ) into v_resource_available;
    if not v_resource_available then
      return jsonb_build_object('found', true, 'valid', false, 'error_code', 'RESOURCE_UNAVAILABLE', 'message', 'Resource is not available.');
    end if;
  end if;

  return jsonb_build_object(
    'found', true,
    'valid', true,
    'error_code', null,
    'message', 'Booking validation passed — confirm via Phase 610 booking engine.',
    'location_key', p_location_key,
    'provider_key', p_provider_key,
    'resource_key', p_resource_key,
    'phase610_ref', 'get_organization_appointment_center',
    'duplicate_engine', false
  );
end; $$;

create or replace function public.get_aipify_companion_service_network_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_service_network_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Service Network Advisor',
    'principle', 'Aipify observes your service network — locations, resources, rentals, and provider conflicts require human approval.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'locations',
        'observation', format('%s active location(s) in your service network.', v_stats->>'locations'),
        'impact', 'Each location needs hours, providers, and resources before public booking.',
        'recommendation', 'Review location settings and closure periods before peak periods.',
        'effort', 'low',
        'href', '/app/services/locations'
      ),
      jsonb_build_object(
        'key', 'rentals',
        'observation', format('%s active and %s pending rental agreement(s).', v_stats->>'active_rentals', v_stats->>'pending_rentals'),
        'impact', 'Unapproved agreements block renter access to schedules and customers.',
        'recommendation', 'Approve pending agreements and verify resource exclusivity.',
        'effort', 'medium',
        'href', '/app/services/rentals'
      ),
      jsonb_build_object(
        'key', 'conflicts',
        'observation', 'Cross-location double-booking prevention is enabled.',
        'impact', 'Providers working at multiple locations need transition buffers configured.',
        'recommendation', 'Review provider assignments and conflict prevention rules.',
        'effort', 'low',
        'href', '/app/services/network'
      ),
      jsonb_build_object(
        'key', 'integrations',
        'observation', 'Booking extends Phase 610 — absence from Phase 606, cost signals from Phase 615.',
        'impact', 'Duplicating source engines breaks reconciliation and scope enforcement.',
        'recommendation', 'Keep integration references current when source engines update.',
        'effort', 'low',
        'href', '/app/services/network'
      )
    ),
    'center', v_center
  );
end; $$;

grant execute on function public.get_organization_service_network_center(text) to authenticated;
grant execute on function public.get_organization_service_network_detail(text, text) to authenticated;
grant execute on function public.get_organization_service_network_settings() to authenticated;
grant execute on function public.get_organization_service_network_mobile_summary() to authenticated;
grant execute on function public.net616_search_availability(text, text, text, text, timestamptz, timestamptz) to authenticated;
grant execute on function public.net616_validate_booking(text, text, text, text, timestamptz, timestamptz) to authenticated;
grant execute on function public.get_aipify_companion_service_network_advisor_bundle() to authenticated;


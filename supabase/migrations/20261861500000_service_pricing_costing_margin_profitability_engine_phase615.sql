-- Phase 615 — Service Pricing, Costing, Margin & Profitability Engine
-- Feature owner: CUSTOMER APP (/app/profitability)
-- Helpers: _prof615_*
-- NOT audited financial statements — verified vs estimated vs incomplete always explicit
-- Integrates Phase 610/612/613/614 — does not duplicate booking, checkout, inventory, compensation

-- ---------------------------------------------------------------------------
-- Section registry
-- ---------------------------------------------------------------------------
create table if not exists public.prof615_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 39),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_cost_profiles', 1, 'service_cost_profiles', 'Service cost profiles with versioning', 'Service cost profiles with versioning')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_cost_versions', 2, 'service_cost_versions', 'Service cost profile version history', 'Service cost profile version history')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('price_profiles', 3, 'price_profiles', 'Price profiles with versioning', 'Price profiles with versioning')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('price_profile_versions', 4, 'price_profile_versions', 'Price profile version history', 'Price profile version history')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_cost_models', 5, 'location_cost_models', 'Location cost models with versioning', 'Location cost models with versioning')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('location_cost_versions', 6, 'location_cost_versions', 'Location cost model version history', 'Location cost model version history')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('allocation_rules', 7, 'allocation_rules', 'Overhead allocation rules', 'Overhead allocation rules')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('cost_pools', 8, 'cost_pools', 'Cost pools for overhead allocation', 'Cost pools for overhead allocation')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('allocation_drivers', 9, 'allocation_drivers', 'Allocation drivers and weights', 'Allocation drivers and weights')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('margin_results', 10, 'margin_results', 'Margin calculation results', 'Margin calculation results — data quality tagged')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('margin_result_versions', 11, 'margin_result_versions', 'Margin result version history', 'Margin result version history')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('price_recommendations', 12, 'price_recommendations', 'Price recommendation engine outputs', 'Price recommendation engine outputs')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('scenarios', 13, 'scenarios', 'Profitability scenario definitions', 'Profitability scenario definitions')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('scenario_variants', 14, 'scenario_variants', 'Scenario Lab variant runs', 'Scenario Lab variant runs')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('profitability_exceptions', 15, 'profitability_exceptions', 'Profitability exception queue', 'Profitability exception queue')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('profitability_policies', 16, 'profitability_policies', 'Profitability policy definitions', 'Profitability policy definitions')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('calculation_queue', 17, 'calculation_queue', 'Margin calculation queue status', 'Margin calculation queue status')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('service_profitability_cards', 18, 'service_profitability_cards', 'Service profitability cards', 'Service profitability cards')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('overhead_allocation_engine', 19, 'overhead_allocation_engine', 'Overhead Allocation Engine route metadata', 'Overhead Allocation Engine route metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('price_recommendation_engine', 20, 'price_recommendation_engine', 'Price Recommendation Engine route metadata', 'Price Recommendation Engine route metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('scenario_lab', 21, 'scenario_lab', 'Scenario Lab route metadata', 'Scenario Lab route metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('exception_center', 22, 'exception_center', 'Exception Center route metadata', 'Exception Center route metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('policy_center', 23, 'policy_center', 'Policy Center route metadata', 'Policy Center route metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('forecasts', 24, 'forecasts', 'Profitability forecasts', 'Profitability forecasts — estimates not audited profit')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('customer_profitability', 25, 'customer_profitability', 'Customer segment profitability', 'Customer segment profitability')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('employee_profitability', 26, 'employee_profitability', 'Employee contribution profitability', 'Employee contribution profitability')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('product_profitability', 27, 'product_profitability', 'Product profitability signals', 'Product profitability signals')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('resource_profitability', 28, 'resource_profitability', 'Resource utilization profitability', 'Resource utilization profitability')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('recommendations', 29, 'recommendations', 'Companion profitability recommendations', 'Companion profitability recommendations')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('approvals', 30, 'approvals', 'Price and margin approval workflow', 'Price and margin approval workflow')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('reports_catalog', 31, 'reports_catalog', 'Profitability reports catalog', 'Profitability reports catalog')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('companion_advisor', 32, 'companion_advisor', 'Companion Profitability Advisor metadata', 'Companion Profitability Advisor metadata')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('data_quality_catalog', 33, 'data_quality_catalog', 'Verified vs estimated vs incomplete data quality', 'Verified vs estimated vs incomplete data quality')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('profitability_status_catalog', 34, 'profitability_status_catalog', 'Profitability status catalog', 'Profitability status catalog — icon + text always')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase610_booking_connection', 35, 'phase610_booking_connection', 'Phase 610 booking revenue connection', 'Phase 610 booking revenue connection — consume only')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase612_checkout_connection', 36, 'phase612_checkout_connection', 'Phase 612 checkout verified revenue connection', 'Phase 612 checkout verified revenue connection')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase613_inventory_connection', 37, 'phase613_inventory_connection', 'Phase 613 inventory consumable cost connection', 'Phase 613 inventory consumable cost connection')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('phase614_labor_connection', 38, 'phase614_labor_connection', 'Phase 614 labor cost signals connection', 'Phase 614 labor cost signals connection')
on conflict (section_key) do nothing;

insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('integration_hub', 39, 'integration_hub', 'Cross-phase integration hub references', 'Cross-phase integration hub references')
on conflict (section_key) do nothing;

create table if not exists public.prof615_profitability_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'margin' check (
    status_group in ('margin', 'data_quality', 'pricing', 'approval', 'calculation', 'workflow')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.prof615_profitability_status_defs (status_key, status_title, icon_key, status_group, summary) values
  ('verified_positive', 'Verified Positive Margin', 'trending-up', 'margin', 'Verified revenue minus verified costs — positive margin.'),
  ('estimated_positive', 'Estimated Positive Margin', 'activity', 'margin', 'Estimated costs with verified revenue — not audited profit.'),
  ('low_margin', 'Low Margin', 'alert-triangle', 'margin', 'Margin below policy threshold — review pricing or costs.'),
  ('incomplete_data', 'Incomplete Data', 'help-circle', 'data_quality', 'Missing cost or revenue inputs — cannot assert profit.'),
  ('negative_margin', 'Negative Margin', 'trending-down', 'margin', 'Costs exceed revenue — action recommended.'),
  ('approval_required', 'Approval Required', 'shield', 'approval', 'Price or margin change requires human approval.'),
  ('recalculation_pending', 'Recalculation Pending', 'refresh-cw', 'calculation', 'Margin recalculation queued or in progress.'),
  ('verified_against_source', 'Verified Against Source', 'check-circle', 'data_quality', 'Figure reconciled to source engine record.'),
  ('verified_revenue', 'Verified Revenue', 'shield-check', 'data_quality', 'Revenue verified from checkout or booking engine.'),
  ('estimated_labor_cost', 'Estimated Labor Cost', 'users', 'data_quality', 'Labor cost estimated from compensation signals.'),
  ('estimated_consumable_cost', 'Estimated Consumable Cost', 'package', 'data_quality', 'Consumable cost estimated from inventory signals.')
on conflict (status_key) do nothing;

create table if not exists public.prof615_data_quality_defs (
  quality_key text primary key,
  quality_title text not null,
  icon_key text not null default 'circle',
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.prof615_data_quality_defs (quality_key, quality_title, icon_key, summary) values
  ('verified', 'Verified', 'check-circle', 'Reconciled to source engine — suitable for operational decisions.'),
  ('estimated', 'Estimated', 'activity', 'Modelled or inferred — never present as audited profit.'),
  ('incomplete', 'Incomplete', 'help-circle', 'Insufficient inputs — margin cannot be asserted.')
on conflict (quality_key) do nothing;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_prof615_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  profitability_center_enabled boolean not null default true,
  margin_calculation_enabled boolean not null default true,
  price_recommendations_enabled boolean not null default true,
  overhead_allocation_enabled boolean not null default true,
  scenario_lab_enabled boolean not null default true,
  approval_workflow_enabled boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  never_present_estimates_as_audited boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_prof615_settings enable row level security;
revoke all on public.organization_prof615_settings from authenticated, anon;

-- Service cost profiles with versioning
create table if not exists public.organization_prof615_service_cost_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_cost_profiles',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_service_cost_profiles enable row level security;
revoke all on public.organization_prof615_service_cost_profiles from authenticated, anon;

-- Service cost profile version history
create table if not exists public.organization_prof615_service_cost_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_cost_versions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_service_cost_versions enable row level security;
revoke all on public.organization_prof615_service_cost_versions from authenticated, anon;

-- Price profiles with versioning
create table if not exists public.organization_prof615_price_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_profiles',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_price_profiles enable row level security;
revoke all on public.organization_prof615_price_profiles from authenticated, anon;

-- Price profile version history
create table if not exists public.organization_prof615_price_profile_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_profile_versions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_price_profile_versions enable row level security;
revoke all on public.organization_prof615_price_profile_versions from authenticated, anon;

-- Location cost models with versioning
create table if not exists public.organization_prof615_location_cost_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_cost_models',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_location_cost_models enable row level security;
revoke all on public.organization_prof615_location_cost_models from authenticated, anon;

-- Location cost model version history
create table if not exists public.organization_prof615_location_cost_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_cost_versions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_location_cost_versions enable row level security;
revoke all on public.organization_prof615_location_cost_versions from authenticated, anon;

-- Overhead allocation rules
create table if not exists public.organization_prof615_allocation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'allocation_rules',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_allocation_rules enable row level security;
revoke all on public.organization_prof615_allocation_rules from authenticated, anon;

-- Cost pools for overhead allocation
create table if not exists public.organization_prof615_cost_pools (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cost_pools',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_cost_pools enable row level security;
revoke all on public.organization_prof615_cost_pools from authenticated, anon;

-- Allocation drivers and weights
create table if not exists public.organization_prof615_allocation_drivers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'allocation_drivers',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_allocation_drivers enable row level security;
revoke all on public.organization_prof615_allocation_drivers from authenticated, anon;

-- Margin calculation results — data quality tagged
create table if not exists public.organization_prof615_margin_results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'margin_results',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_margin_results enable row level security;
revoke all on public.organization_prof615_margin_results from authenticated, anon;

-- Margin result version history
create table if not exists public.organization_prof615_margin_result_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'margin_result_versions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_margin_result_versions enable row level security;
revoke all on public.organization_prof615_margin_result_versions from authenticated, anon;

-- Price recommendation engine outputs
create table if not exists public.organization_prof615_price_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_recommendations',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_price_recommendations enable row level security;
revoke all on public.organization_prof615_price_recommendations from authenticated, anon;

-- Profitability scenario definitions
create table if not exists public.organization_prof615_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scenarios',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_scenarios enable row level security;
revoke all on public.organization_prof615_scenarios from authenticated, anon;

-- Scenario Lab variant runs
create table if not exists public.organization_prof615_scenario_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scenario_variants',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_scenario_variants enable row level security;
revoke all on public.organization_prof615_scenario_variants from authenticated, anon;

-- Profitability exception queue
create table if not exists public.organization_prof615_profitability_exceptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'profitability_exceptions',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_profitability_exceptions enable row level security;
revoke all on public.organization_prof615_profitability_exceptions from authenticated, anon;

-- Profitability policy definitions
create table if not exists public.organization_prof615_profitability_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'profitability_policies',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_profitability_policies enable row level security;
revoke all on public.organization_prof615_profitability_policies from authenticated, anon;

-- Margin calculation queue status
create table if not exists public.organization_prof615_calculation_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'calculation_queue',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_calculation_queue enable row level security;
revoke all on public.organization_prof615_calculation_queue from authenticated, anon;

-- Service profitability cards
create table if not exists public.organization_prof615_service_profitability_cards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_profitability_cards',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_service_profitability_cards enable row level security;
revoke all on public.organization_prof615_service_profitability_cards from authenticated, anon;

-- Overhead Allocation Engine route metadata
create table if not exists public.organization_prof615_overhead_allocation_engine (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'overhead_allocation_engine',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_overhead_allocation_engine enable row level security;
revoke all on public.organization_prof615_overhead_allocation_engine from authenticated, anon;

-- Price Recommendation Engine route metadata
create table if not exists public.organization_prof615_price_recommendation_engine (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'price_recommendation_engine',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_price_recommendation_engine enable row level security;
revoke all on public.organization_prof615_price_recommendation_engine from authenticated, anon;

-- Scenario Lab route metadata
create table if not exists public.organization_prof615_scenario_lab (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'scenario_lab',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_scenario_lab enable row level security;
revoke all on public.organization_prof615_scenario_lab from authenticated, anon;

-- Exception Center route metadata
create table if not exists public.organization_prof615_exception_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'exception_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_exception_center enable row level security;
revoke all on public.organization_prof615_exception_center from authenticated, anon;

-- Policy Center route metadata
create table if not exists public.organization_prof615_policy_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'policy_center',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_policy_center enable row level security;
revoke all on public.organization_prof615_policy_center from authenticated, anon;

-- Profitability forecasts — estimates not audited profit
create table if not exists public.organization_prof615_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'forecasts',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_forecasts enable row level security;
revoke all on public.organization_prof615_forecasts from authenticated, anon;

-- Customer segment profitability
create table if not exists public.organization_prof615_customer_profitability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'customer_profitability',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_customer_profitability enable row level security;
revoke all on public.organization_prof615_customer_profitability from authenticated, anon;

-- Employee contribution profitability
create table if not exists public.organization_prof615_employee_profitability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_profitability',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_employee_profitability enable row level security;
revoke all on public.organization_prof615_employee_profitability from authenticated, anon;

-- Product profitability signals
create table if not exists public.organization_prof615_product_profitability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_profitability',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_product_profitability enable row level security;
revoke all on public.organization_prof615_product_profitability from authenticated, anon;

-- Resource utilization profitability
create table if not exists public.organization_prof615_resource_profitability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'resource_profitability',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_resource_profitability enable row level security;
revoke all on public.organization_prof615_resource_profitability from authenticated, anon;

-- Companion profitability recommendations
create table if not exists public.organization_prof615_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'recommendations',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_recommendations enable row level security;
revoke all on public.organization_prof615_recommendations from authenticated, anon;

-- Price and margin approval workflow
create table if not exists public.organization_prof615_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'approvals',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_approvals enable row level security;
revoke all on public.organization_prof615_approvals from authenticated, anon;

-- Profitability reports catalog
create table if not exists public.organization_prof615_reports_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reports_catalog',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_reports_catalog enable row level security;
revoke all on public.organization_prof615_reports_catalog from authenticated, anon;

-- Companion Profitability Advisor metadata
create table if not exists public.organization_prof615_companion_advisor (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'companion_advisor',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_companion_advisor enable row level security;
revoke all on public.organization_prof615_companion_advisor from authenticated, anon;

-- Verified vs estimated vs incomplete data quality
create table if not exists public.organization_prof615_data_quality_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'data_quality_catalog',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_data_quality_catalog enable row level security;
revoke all on public.organization_prof615_data_quality_catalog from authenticated, anon;

-- Profitability status catalog — icon + text always
create table if not exists public.organization_prof615_profitability_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'profitability_status_catalog',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_profitability_status_catalog enable row level security;
revoke all on public.organization_prof615_profitability_status_catalog from authenticated, anon;

-- Phase 610 booking revenue connection — consume only
create table if not exists public.organization_prof615_phase610_booking_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase610_booking_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_phase610_booking_connection enable row level security;
revoke all on public.organization_prof615_phase610_booking_connection from authenticated, anon;

-- Phase 612 checkout verified revenue connection
create table if not exists public.organization_prof615_phase612_checkout_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase612_checkout_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_phase612_checkout_connection enable row level security;
revoke all on public.organization_prof615_phase612_checkout_connection from authenticated, anon;

-- Phase 613 inventory consumable cost connection
create table if not exists public.organization_prof615_phase613_inventory_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase613_inventory_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_phase613_inventory_connection enable row level security;
revoke all on public.organization_prof615_phase613_inventory_connection from authenticated, anon;

-- Phase 614 labor cost signals connection
create table if not exists public.organization_prof615_phase614_labor_connection (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'phase614_labor_connection',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_phase614_labor_connection enable row level security;
revoke all on public.organization_prof615_phase614_labor_connection from authenticated, anon;

-- Cross-phase integration hub references
create table if not exists public.organization_prof615_integration_hub (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'integration_hub',
  scope_type text not null default 'organization' check (
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'customer', 'product', 'organization')
  ),
  service_label text not null default '',
  location_label text not null default '',
  employee_label text not null default '',
  revenue_amount numeric(14,2),
  cost_amount numeric(14,2),
  margin_amount numeric(14,2),
  margin_percent numeric(8,2),
  currency_code text not null default 'NOK',
  data_quality text not null default 'estimated' check (data_quality in ('verified', 'estimated', 'incomplete')),
  version_number integer not null default 1,
  integration_ref text not null default '',
  period_label text not null default '',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_prof615_integration_hub enable row level security;
revoke all on public.organization_prof615_integration_hub from authenticated, anon;

create table if not exists public.organization_prof615_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'profitability',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_prof615_audit_logs enable row level security;
revoke all on public.organization_prof615_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._prof615_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._prof615_status(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key, 'status_title', d.status_title,
      'icon_key', d.icon_key, 'status_group', d.status_group
    ) from public.prof615_profitability_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', p_status_key, 'icon_key', 'circle', 'status_group', 'margin'));
$$;

create or replace function public._prof615_data_quality(p_quality_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'quality_key', d.quality_key, 'quality_title', d.quality_title, 'icon_key', d.icon_key
    ) from public.prof615_data_quality_defs d where d.quality_key = p_quality_key
  ), jsonb_build_object('quality_key', p_quality_key, 'quality_title', p_quality_key, 'icon_key', 'circle'));
$$;

create or replace function public._prof615_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'profitability'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_prof615_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'profitability'), left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._prof615_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_prof615_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._prof615_read_settings(p_org_id uuid)
returns public.organization_prof615_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.organization_prof615_settings;
begin
  select * into v_row
  from public.organization_prof615_settings
  where organization_id = p_org_id;

  if found then
    return v_row;
  end if;

  v_row.organization_id := p_org_id;
  v_row.profitability_center_enabled := true;
  v_row.margin_calculation_enabled := true;
  v_row.price_recommendations_enabled := true;
  v_row.overhead_allocation_enabled := true;
  v_row.scenario_lab_enabled := true;
  v_row.approval_workflow_enabled := true;
  v_row.companion_advisor_enabled := true;
  v_row.never_present_estimates_as_audited := true;
  v_row.audit_logging_required := true;
  v_row.metadata := '{}'::jsonb;
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public._prof615_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_prof615_service_cost_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  perform public._prof615_ensure_settings(p_org_id);

  insert into public.organization_prof615_service_cost_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'servicecostp_base', initcap(replace('service_cost_profiles', '_', ' ')), 'active', 'circle', 'Active', 'service_cost_profiles', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 service_cost_profiles.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_service_cost_versions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'servicecostv_base', initcap(replace('service_cost_versions', '_', ' ')), 'active', 'circle', 'Active', 'service_cost_versions', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 service_cost_versions.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'priceprofile_base', initcap(replace('price_profiles', '_', ' ')), 'active', 'circle', 'Active', 'price_profiles', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 price_profiles.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_profile_versions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'priceprofile_base', initcap(replace('price_profile_versions', '_', ' ')), 'active', 'circle', 'Active', 'price_profile_versions', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 price_profile_versions.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_location_cost_models (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'locationcost_base', initcap(replace('location_cost_models', '_', ' ')), 'active', 'circle', 'Active', 'location_cost_models', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 location_cost_models.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_location_cost_versions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'locationcost_base', initcap(replace('location_cost_versions', '_', ' ')), 'active', 'circle', 'Active', 'location_cost_versions', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 location_cost_versions.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_allocation_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'allocationru_base', initcap(replace('allocation_rules', '_', ' ')), 'active', 'circle', 'Active', 'allocation_rules', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 allocation_rules.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_cost_pools (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'costpools_base', initcap(replace('cost_pools', '_', ' ')), 'active', 'circle', 'Active', 'cost_pools', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 cost_pools.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_allocation_drivers (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'allocationdr_base', initcap(replace('allocation_drivers', '_', ' ')), 'active', 'circle', 'Active', 'allocation_drivers', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 allocation_drivers.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_margin_results (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'marginresult_base', initcap(replace('margin_results', '_', ' ')), 'active', 'circle', 'Active', 'margin_results', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 margin_results.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_margin_result_versions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'marginresult_base', initcap(replace('margin_result_versions', '_', ' ')), 'active', 'circle', 'Active', 'margin_result_versions', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 margin_result_versions.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_recommendations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'pricerecomme_base', initcap(replace('price_recommendations', '_', ' ')), 'active', 'circle', 'Active', 'price_recommendations', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 price_recommendations.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_scenarios (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'scenarios_base', initcap(replace('scenarios', '_', ' ')), 'active', 'circle', 'Active', 'scenarios', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 scenarios.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_scenario_variants (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'scenariovari_base', initcap(replace('scenario_variants', '_', ' ')), 'active', 'circle', 'Active', 'scenario_variants', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 scenario_variants.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_profitability_exceptions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'profitabilit_base', initcap(replace('profitability_exceptions', '_', ' ')), 'active', 'circle', 'Active', 'profitability_exceptions', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 profitability_exceptions.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_profitability_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'profitabilit_base', initcap(replace('profitability_policies', '_', ' ')), 'active', 'circle', 'Active', 'profitability_policies', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 profitability_policies.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_calculation_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'calculationq_base', initcap(replace('calculation_queue', '_', ' ')), 'active', 'circle', 'Active', 'calculation_queue', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 calculation_queue.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_service_profitability_cards (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'serviceprofi_base', initcap(replace('service_profitability_cards', '_', ' ')), 'active', 'circle', 'Active', 'service_profitability_cards', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 service_profitability_cards.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_overhead_allocation_engine (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'overheadallo_base', initcap(replace('overhead_allocation_engine', '_', ' ')), 'active', 'circle', 'Active', 'overhead_allocation_engine', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 overhead_allocation_engine.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_recommendation_engine (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'pricerecomme_base', initcap(replace('price_recommendation_engine', '_', ' ')), 'active', 'circle', 'Active', 'price_recommendation_engine', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 price_recommendation_engine.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_scenario_lab (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'scenariolab_base', initcap(replace('scenario_lab', '_', ' ')), 'active', 'circle', 'Active', 'scenario_lab', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 scenario_lab.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_exception_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'exceptioncen_base', initcap(replace('exception_center', '_', ' ')), 'active', 'circle', 'Active', 'exception_center', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 exception_center.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_policy_center (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'policycenter_base', initcap(replace('policy_center', '_', ' ')), 'active', 'circle', 'Active', 'policy_center', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 policy_center.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_forecasts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'forecasts_base', initcap(replace('forecasts', '_', ' ')), 'active', 'circle', 'Active', 'forecasts', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 forecasts.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_customer_profitability (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'customerprof_base', initcap(replace('customer_profitability', '_', ' ')), 'active', 'circle', 'Active', 'customer_profitability', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 customer_profitability.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_employee_profitability (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'employeeprof_base', initcap(replace('employee_profitability', '_', ' ')), 'active', 'circle', 'Active', 'employee_profitability', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 employee_profitability.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_product_profitability (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'productprofi_base', initcap(replace('product_profitability', '_', ' ')), 'active', 'circle', 'Active', 'product_profitability', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 product_profitability.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_resource_profitability (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'resourceprof_base', initcap(replace('resource_profitability', '_', ' ')), 'active', 'circle', 'Active', 'resource_profitability', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 resource_profitability.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_recommendations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'recommendati_base', initcap(replace('recommendations', '_', ' ')), 'active', 'circle', 'Active', 'recommendations', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 recommendations.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_approvals (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'approvals_base', initcap(replace('approvals', '_', ' ')), 'active', 'circle', 'Active', 'approvals', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 approvals.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_reports_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'reportscatal_base', initcap(replace('reports_catalog', '_', ' ')), 'active', 'circle', 'Active', 'reports_catalog', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 reports_catalog.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_companion_advisor (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'companionadv_base', initcap(replace('companion_advisor', '_', ' ')), 'active', 'circle', 'Active', 'companion_advisor', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 companion_advisor.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_data_quality_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'dataqualityc_base', initcap(replace('data_quality_catalog', '_', ' ')), 'active', 'circle', 'Active', 'data_quality_catalog', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 data_quality_catalog.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_profitability_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'profitabilit_base', initcap(replace('profitability_status_catalog', '_', ' ')), 'active', 'circle', 'Active', 'profitability_status_catalog', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 profitability_status_catalog.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase610_booking_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'phase610book_base', initcap(replace('phase610_booking_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase610_booking_connection', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 phase610_booking_connection.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase612_checkout_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'phase612chec_base', initcap(replace('phase612_checkout_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase612_checkout_connection', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 phase612_checkout_connection.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase613_inventory_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'phase613inve_base', initcap(replace('phase613_inventory_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase613_inventory_connection', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 phase613_inventory_connection.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase614_labor_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'phase614labo_base', initcap(replace('phase614_labor_connection', '_', ' ')), 'active', 'circle', 'Active', 'phase614_labor_connection', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 phase614_labor_connection.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, 'integrationh_base', initcap(replace('integration_hub', '_', ' ')), 'active', 'circle', 'Active', 'integration_hub', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 integration_hub.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_service_cost_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label,
    cost_amount, currency_code, data_quality, version_number, summary, metadata
  ) values (
    p_org_id, 'svc_cut_color', 'Cut & Color — cost profile', 'active', 'scissors', 'Cost profile', 'service_cost_profiles', 'Cut & Color',
    285.00, 'NOK', 'estimated', 1,
    'Service cost profile v1 — labor and consumables estimated until verified.',
    '{"duration_minutes":90,"labor_pct":62,"consumables_pct":18}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_profiles (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label,
    revenue_amount, currency_code, data_quality, version_number, summary, metadata
  ) values (
    p_org_id, 'price_cut_color', 'Cut & Color — price profile', 'verified_against_source', 'tag', 'Price profile', 'price_profiles', 'Cut & Color',
    1290.00, 'NOK', 'verified', 2,
    'List price verified against booking catalog — Phase 610 reference.',
    '{"phase610_ref":"appointment_booking","list_price":1290}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_margin_results (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label,
    revenue_amount, cost_amount, margin_amount, margin_percent, currency_code, data_quality, version_number, summary, metadata
  ) values (
    p_org_id, 'margin_cut_color', 'Cut & Color — margin result', 'estimated_positive', 'activity', 'Estimated positive', 'margin_results', 'Cut & Color',
    1290.00, 285.00, 1005.00, 77.91, 'NOK', 'estimated', 1,
    'Estimated positive margin — labor cost from Phase 614 signals, consumables from Phase 613.',
    '{"never_audited_profit":true,"revenue_quality":"verified","cost_quality":"estimated"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_service_profitability_cards (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label,
    revenue_amount, cost_amount, margin_amount, margin_percent, currency_code, data_quality, summary, metadata
  ) values (
    p_org_id, 'card_cut_color', 'Cut & Color profitability', 'estimated_positive', 'activity', 'Estimated positive', 'service_profitability_cards', 'Cut & Color',
    1290.00, 285.00, 1005.00, 77.91, 'NOK', 'estimated',
    'Service Profitability Card — verified revenue, estimated costs.',
    '{"route":"/app/profitability/services"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_price_recommendations (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label,
    revenue_amount, margin_percent, currency_code, data_quality, summary, metadata
  ) values (
    p_org_id, 'rec_blowdry', 'Blow Dry — price increase recommendation', 'approval_required', 'shield', 'Approval required', 'price_recommendations', 'Blow Dry',
    520.00, 68.00, 'NOK', 'estimated',
    'Recommend +8% list price to restore target margin — requires approval.',
    '{"recommended_change_pct":8,"route":"/app/profitability/pricing"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_profitability_exceptions (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, service_label, priority, summary, metadata
  ) values (
    p_org_id, 'exc_missing_labor', 'Missing verified labor cost — Balayage', 'incomplete_data', 'help-circle', 'Incomplete data', 'profitability_exceptions', 'Balayage', 'important',
    'Labor cost incomplete — margin cannot be asserted until Phase 614 signals linked.',
    '{"route":"/app/profitability/exceptions"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_calculation_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'queue_nightly', 'Nightly margin recalculation', 'recalculation_pending', 'refresh-cw', 'Recalculation pending', 'calculation_queue',
    'Queued margin recalculation after checkout batch — not yet complete.',
    '{"batch_id":"2026-03-19"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase610_booking_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appt610_link', 'Phase 610 booking revenue', 'linked', 'calendar', 'Booking linked', 'phase610_booking_connection', 'phase610_appointment_booking',
    'Phase 610 booking revenue — consume only, no duplicate booking engine.',
    '{"phase610_ref":"get_organization_appointment_booking_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase612_checkout_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'pos612_link', 'Phase 612 verified checkout revenue', 'linked', 'shopping-cart', 'Checkout linked', 'phase612_checkout_connection', 'phase612_service_checkout',
    'Phase 612 verified checkout revenue — consume only.',
    '{"phase612_ref":"get_organization_service_checkout_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase613_inventory_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inv613_link', 'Phase 613 consumable costs', 'linked', 'package', 'Inventory linked', 'phase613_inventory_connection', 'phase613_inventory',
    'Phase 613 consumable and purchasing cost signals — consume only.',
    '{"phase613_ref":"get_organization_inventory_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_phase614_labor_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cmp614_link', 'Phase 614 labor cost signals', 'linked', 'users', 'Labor linked', 'phase614_labor_connection', 'phase614_compensation',
    'Phase 614 labor cost signals — estimated labor cost, not payroll processing.',
    '{"phase614_ref":"get_organization_compensation_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_prof615_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values
    (p_org_id, 'int_610', 'Booking revenue', 'linked', 'calendar', 'Booking linked', 'integration_hub', 'phase610', 'Phase 610 appointment booking revenue.', '{"href":"/app/appointments"}'::jsonb),
    (p_org_id, 'int_612', 'Checkout revenue', 'linked', 'shopping-cart', 'Checkout linked', 'integration_hub', 'phase612', 'Phase 612 verified checkout revenue.', '{"href":"/app/checkout"}'::jsonb),
    (p_org_id, 'int_613', 'Inventory costs', 'linked', 'package', 'Inventory linked', 'integration_hub', 'phase613', 'Phase 613 consumable cost signals.', '{"href":"/app/inventory"}'::jsonb),
    (p_org_id, 'int_614', 'Labor costs', 'linked', 'users', 'Labor linked', 'integration_hub', 'phase614', 'Phase 614 labor cost signals.', '{"href":"/app/compensation"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  perform public._prof615_log(p_org_id, 'profitability_seeded', 'Profitability center baseline seeded — Phase 615.');
end; $$;

create or replace function public._prof615_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''service_label'', service_label, ''location_label'', location_label,
      ''employee_label'', employee_label, ''revenue_amount'', revenue_amount, ''cost_amount'', cost_amount,
      ''margin_amount'', margin_amount, ''margin_percent'', margin_percent, ''currency_code'', currency_code,
      ''data_quality'', data_quality, ''version_number'', version_number, ''integration_ref'', integration_ref,
      ''period_label'', period_label, ''priority'', priority,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_prof615_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public.get_organization_profitability_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_prof615_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._prof615_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  v_settings := public._prof615_read_settings(v_org_id);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'profitability_phase615',
      'principle', 'Aipify models service profitability — verified revenue, estimated costs, never audited profit without explicit data quality.',
      'privacy_note', 'Profitability metadata is tenant-scoped. Estimates are never presented as audited financial statements.',
      'distinction_note', 'Verified revenue → Estimated labor & consumables → Margin result → Human approval → Operational decision',
      'data_quality_warning', 'Never present estimates as audited profit — check data_quality on every margin result.',
      'section_count', 39,
      'settings', jsonb_build_object(
        'margin_calculation_enabled', coalesce(v_settings.margin_calculation_enabled, true),
        'price_recommendations_enabled', coalesce(v_settings.price_recommendations_enabled, true),
        'never_present_estimates_as_audited', coalesce(v_settings.never_present_estimates_as_audited, true),
        'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true)
      ),
      'stats', jsonb_build_object(
        'services_tracked', (select count(*) from public.organization_prof615_service_cost_profiles where organization_id = v_org_id),
        'margin_results', (select count(*) from public.organization_prof615_margin_results where organization_id = v_org_id),
        'open_exceptions', (select count(*) from public.organization_prof615_profitability_exceptions where organization_id = v_org_id and record_status in ('incomplete_data', 'negative_margin')),
        'pending_approvals', (select count(*) from public.organization_prof615_approvals where organization_id = v_org_id and record_status = 'approval_required'),
        'recalculation_pending', (select count(*) from public.organization_prof615_calculation_queue where organization_id = v_org_id and record_status = 'recalculation_pending'),
        'price_recommendations', (select count(*) from public.organization_prof615_price_recommendations where organization_id = v_org_id)
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.prof615_section_defs s), '[]'::jsonb),
      'profitability_status_defs', coalesce((select jsonb_agg(public._prof615_status(d.status_key) order by d.status_key)
        from public.prof615_profitability_status_defs d), '[]'::jsonb),
      'data_quality_defs', coalesce((select jsonb_agg(public._prof615_data_quality(d.quality_key) order by d.quality_key)
        from public.prof615_data_quality_defs d), '[]'::jsonb),
      'service_profitability_cards', public._prof615_section_rows(v_org_id, 'service_profitability_cards'),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'exceptions', 'observation', 'Incomplete cost data blocks reliable margin assertions.',
          'recommendation', 'Resolve exceptions and link Phase 614 labor signals before pricing decisions.', 'href', '/app/profitability/exceptions'),
        jsonb_build_object('key', 'pricing', 'observation', 'Price recommendations may require approval before list price changes.',
          'recommendation', 'Review Price Recommendation Engine outputs with data quality labels.', 'href', '/app/profitability/pricing')
      ),
      'integrations', public._prof615_section_rows(v_org_id, 'integration_hub')
    );
  end if;

  case v_section
    when 'services' then v_rows := public._prof615_section_rows(v_org_id, 'service_cost_profiles');
    when 'pricing' then v_rows := public._prof615_section_rows(v_org_id, 'price_recommendation_engine');
    when 'costs' then v_rows := public._prof615_section_rows(v_org_id, 'service_cost_versions');
    when 'margins' then v_rows := public._prof615_section_rows(v_org_id, 'margin_results');
    when 'employees' then v_rows := public._prof615_section_rows(v_org_id, 'employee_profitability');
    when 'locations' then v_rows := public._prof615_section_rows(v_org_id, 'location_cost_models');
    when 'resources' then v_rows := public._prof615_section_rows(v_org_id, 'resource_profitability');
    when 'products' then v_rows := public._prof615_section_rows(v_org_id, 'product_profitability');
    when 'customers' then v_rows := public._prof615_section_rows(v_org_id, 'customer_profitability');
    when 'forecasts' then v_rows := public._prof615_section_rows(v_org_id, 'forecasts');
    when 'scenarios' then v_rows := public._prof615_section_rows(v_org_id, 'scenario_lab');
    when 'recommendations' then v_rows := public._prof615_section_rows(v_org_id, 'recommendations');
    when 'approvals' then v_rows := public._prof615_section_rows(v_org_id, 'approvals');
    when 'policies' then v_rows := public._prof615_section_rows(v_org_id, 'policy_center');
    when 'reports' then v_rows := public._prof615_section_rows(v_org_id, 'reports_catalog');
    when 'allocations' then v_rows := public._prof615_section_rows(v_org_id, 'overhead_allocation_engine');
    when 'exceptions' then v_rows := public._prof615_section_rows(v_org_id, 'exception_center');
    else v_rows := '[]'::jsonb;
  end case;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'profitability_phase615',
    'principle', 'Aipify models service profitability — never present estimates as audited profit.',
    'privacy_note', 'Check data_quality on every margin result before operational decisions.',
    'data_quality_warning', 'Estimates are not audited profit.',
    'profitability_status_defs', coalesce((select jsonb_agg(public._prof615_status(d.status_key) order by d.status_key)
      from public.prof615_profitability_status_defs d), '[]'::jsonb),
    'data_quality_defs', coalesce((select jsonb_agg(public._prof615_data_quality(d.quality_key) order by d.quality_key)
      from public.prof615_data_quality_defs d), '[]'::jsonb),
    'records', v_rows,
    'service_profitability_cards', public._prof615_section_rows(v_org_id, 'service_profitability_cards'),
    'integrations', public._prof615_section_rows(v_org_id, 'integration_hub'),
    'since_last_login', coalesce((select jsonb_build_object(
      'open_exceptions', (select count(*) from public.organization_prof615_profitability_exceptions where organization_id = v_org_id and record_status in ('incomplete_data', 'negative_margin')),
      'pending_approvals', (select count(*) from public.organization_prof615_approvals where organization_id = v_org_id and record_status = 'approval_required'),
      'summary', 'Profitability changes since last login.'
    )), '{}'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_prof615_audit_logs where organization_id = v_org_id order by created_at desc limit 15
    ) l), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_organization_profitability_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_prof615_settings;
begin
  v_org_id := public._prof615_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  v_settings := public._prof615_read_settings(v_org_id);
  return jsonb_build_object(
    'found', true,
    'settings', jsonb_build_object(
      'profitability_center_enabled', coalesce(v_settings.profitability_center_enabled, true),
      'margin_calculation_enabled', coalesce(v_settings.margin_calculation_enabled, true),
      'price_recommendations_enabled', coalesce(v_settings.price_recommendations_enabled, true),
      'overhead_allocation_enabled', coalesce(v_settings.overhead_allocation_enabled, true),
      'scenario_lab_enabled', coalesce(v_settings.scenario_lab_enabled, true),
      'approval_workflow_enabled', coalesce(v_settings.approval_workflow_enabled, true),
      'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true),
      'never_present_estimates_as_audited', coalesce(v_settings.never_present_estimates_as_audited, true)
    ),
    'principle', 'Never present estimates as audited profit — data quality must remain explicit.'
  );
end; $$;

create or replace function public.get_organization_profitability_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  v_center := public.get_organization_profitability_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  return jsonb_build_object(
    'found', true,
    'summary_title', 'Profitability snapshot',
    'stats', v_center->'stats',
    'data_quality_warning', v_center->>'data_quality_warning',
    'href', '/app/profitability'
  );
end; $$;

create or replace function public.get_aipify_companion_profitability_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_profitability_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Profitability Advisor',
    'principle', 'Aipify observes service margins with explicit data quality — humans approve price and policy changes.',
    'data_quality_warning', 'Never present estimates as audited profit.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'exceptions',
        'observation', format('%s profitability exception(s) open.', v_stats->>'open_exceptions'),
        'impact', 'Incomplete or negative margin data blocks reliable pricing decisions.',
        'recommendation', 'Resolve exceptions and verify source engine links before changing list prices.',
        'effort', 'medium',
        'href', '/app/profitability/exceptions'
      ),
      jsonb_build_object(
        'key', 'pricing',
        'observation', format('%s price recommendation(s) available.', v_stats->>'price_recommendations'),
        'impact', 'Recommendations use estimated costs — require approval and data quality review.',
        'recommendation', 'Review Price Recommendation Engine with verified vs estimated labels.',
        'effort', 'low',
        'href', '/app/profitability/pricing'
      ),
      jsonb_build_object(
        'key', 'margins',
        'observation', format('%s margin result(s) tracked.', v_stats->>'margin_results'),
        'impact', 'Margin results mix verified revenue and estimated costs — not audited profit.',
        'recommendation', 'Open Margins section and confirm data_quality before executive reporting.',
        'effort', 'low',
        'href', '/app/profitability/margins'
      ),
      jsonb_build_object(
        'key', 'integrations',
        'observation', 'Revenue from Phase 610/612; costs from Phase 613/614 — consume only.',
        'impact', 'Duplicating source engines would break reconciliation and data quality.',
        'recommendation', 'Keep integration references current when source engines update.',
        'effort', 'low',
        'href', '/app/profitability'
      )
    ),
    'center', v_center
  );
end; $$;

grant execute on function public.get_organization_profitability_center(text) to authenticated;
grant execute on function public.get_organization_profitability_settings() to authenticated;
grant execute on function public.get_organization_profitability_center_mobile_summary() to authenticated;
grant execute on function public.get_aipify_companion_profitability_advisor_bundle() to authenticated;


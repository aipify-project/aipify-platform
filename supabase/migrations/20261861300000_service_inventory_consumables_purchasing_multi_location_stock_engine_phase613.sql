-- Phase 613 — Service Inventory, Consumables, Purchasing & Multi-Location Stock Engine
-- Feature owner: CUSTOMER APP (/app/inventory) + Business Pack
-- Helpers: _inv613_*
-- Integrates: Phase 584 suppliers, 606/610 vacation & appointments, 612 checkout, 611 clients, 588 revenue, 607 crisis, 591 event bus
-- Never deduct stock from failed checkout; never sell expired/quarantined stock.

-- ---------------------------------------------------------------------------
-- Global section definitions (120 domains)
-- ---------------------------------------------------------------------------
create table if not exists public.inv613_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 120),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.inv613_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('settings', 1, 'foundation', 'Inventory center settings', 'Inventory center settings.')
,
  ('inventory_scopes', 2, 'scope', 'Organization inventory scope definitions', 'Organization inventory scope definitions.')
,
  ('domain_assignments', 3, 'scope', 'Domain-scoped inventory assignments', 'Domain-scoped inventory assignments.')
,
  ('location_registry', 4, 'scope', 'Multi-location registry', 'Multi-location registry.')
,
  ('storage_zones', 5, 'scope', 'Storage zones within locations', 'Storage zones within locations.')
,
  ('vehicle_stock_locations', 6, 'scope', 'Service vehicle stock locations', 'Service vehicle stock locations.')
,
  ('employee_kits', 7, 'scope', 'Employee kit assignments', 'Employee kit assignments.')
,
  ('item_types', 8, 'scope', 'Inventory item type catalog', 'Inventory item type catalog.')
,
  ('product_master', 9, 'products', 'Product master records', 'Product master records.')
,
  ('product_variants', 10, 'products', 'Product variant definitions', 'Product variant definitions.')
,
  ('product_categories', 11, 'products', 'Product category hierarchy', 'Product category hierarchy.')
,
  ('units_of_measure', 12, 'products', 'Units of measure catalog', 'Units of measure catalog.')
,
  ('unit_conversions', 13, 'products', 'Unit conversion rules', 'Unit conversion rules.')
,
  ('product_status_catalog', 14, 'products', 'Product status catalog — icon + text', 'Product status catalog — icon + text.')
,
  ('consumable_items', 15, 'consumables', 'Service consumable items', 'Service consumable items.')
,
  ('consumable_categories', 16, 'consumables', 'Consumable category definitions', 'Consumable category definitions.')
,
  ('stock_quantities', 17, 'stock', 'Stock quantity model — on-hand totals', 'Stock quantity model — on-hand totals.')
,
  ('stock_status_catalog', 18, 'stock', 'Stock status catalog — icon + text always', 'Stock status catalog — icon + text always.')
,
  ('available_stock', 19, 'stock', 'Available stock quantities', 'Available stock quantities.')
,
  ('reserved_stock', 20, 'stock', 'Reserved stock quantities', 'Reserved stock quantities.')
,
  ('incoming_stock', 21, 'stock', 'Incoming stock from POs', 'Incoming stock from POs.')
,
  ('quarantined_stock', 22, 'stock', 'Quarantined stock — never sold', 'Quarantined stock — never sold.')
,
  ('stock_allocations', 23, 'stock', 'Stock allocation records', 'Stock allocation records.')
,
  ('location_stock', 24, 'stock', 'Location-level stock balances', 'Location-level stock balances.')
,
  ('zone_stock', 25, 'stock', 'Zone-level stock balances', 'Zone-level stock balances.')
,
  ('stock_movements', 26, 'movements', 'Stock movement records', 'Stock movement records.')
,
  ('stock_ledger', 27, 'movements', 'Immutable stock ledger entries', 'Immutable stock ledger entries.')
,
  ('movement_types', 28, 'movements', 'Movement type definitions', 'Movement type definitions.')
,
  ('consumption_recipes', 29, 'consumption', 'Service consumption recipes', 'Service consumption recipes.')
,
  ('recipe_ingredients', 30, 'consumption', 'Recipe ingredient lines', 'Recipe ingredient lines.')
,
  ('actual_consumption', 31, 'consumption', 'Actual service consumption records', 'Actual service consumption records.')
,
  ('appointment_forecasts', 32, 'consumption', 'Phase 610 — appointment stock forecasts', 'Phase 610 — appointment stock forecasts.')
,
  ('appointment_readiness', 33, 'consumption', 'Phase 610 — appointment readiness checks', 'Phase 610 — appointment readiness checks.')
,
  ('service_reservations', 34, 'reservations', 'Service stock reservations', 'Service stock reservations.')
,
  ('appointment_stock_links', 35, 'consumption', 'Phase 610 appointment inventory links', 'Phase 610 appointment inventory links.')
,
  ('consumption_variance', 36, 'consumption', 'Recipe vs actual consumption variance', 'Recipe vs actual consumption variance.')
,
  ('checkout_deductions', 37, 'checkout', 'Phase 612 — checkout stock deductions', 'Phase 612 — checkout stock deductions.')
,
  ('checkout_failure_guard', 38, 'checkout', 'Never deduct stock from failed checkout', 'Never deduct stock from failed checkout.')
,
  ('product_returns', 39, 'returns', 'Product return records', 'Product return records.')
,
  ('refund_without_return', 40, 'returns', 'Refund without stock return — Phase 612', 'Refund without stock return — Phase 612.')
,
  ('checkout_stock_links', 41, 'checkout', 'Phase 612 checkout integration metadata', 'Phase 612 checkout integration metadata.')
,
  ('pos_inventory_integration', 42, 'checkout', 'POS inventory integration links', 'POS inventory integration links.')
,
  ('product_bundles', 43, 'bundles', 'Product bundle definitions', 'Product bundle definitions.')
,
  ('bundle_components', 44, 'bundles', 'Bundle component lines', 'Bundle component lines.')
,
  ('service_kits', 45, 'bundles', 'Service kit definitions', 'Service kit definitions.')
,
  ('equipment_register', 46, 'equipment', 'Equipment register records', 'Equipment register records.')
,
  ('equipment_reservations', 47, 'equipment', 'Equipment reservation records', 'Equipment reservation records.')
,
  ('equipment_maintenance', 48, 'equipment', 'Equipment maintenance schedules', 'Equipment maintenance schedules.')
,
  ('serial_numbers', 49, 'traceability', 'Serial number tracking', 'Serial number tracking.')
,
  ('batch_lots', 50, 'traceability', 'Batch and lot tracking', 'Batch and lot tracking.')
,
  ('expiry_tracking', 51, 'traceability', 'Expiry date tracking', 'Expiry date tracking.')
,
  ('fefo_fifo_rules', 52, 'traceability', 'FEFO/FIFO picking rules', 'FEFO/FIFO picking rules.')
,
  ('opened_products', 53, 'traceability', 'Opened product partial quantity tracking', 'Opened product partial quantity tracking.')
,
  ('quarantine_records', 54, 'traceability', 'Quarantine records — blocked from sale', 'Quarantine records — blocked from sale.')
,
  ('recall_records', 55, 'traceability', 'Product recall records', 'Product recall records.')
,
  ('lot_traceability', 56, 'traceability', 'Lot traceability chain', 'Lot traceability chain.')
,
  ('expiry_alerts', 57, 'traceability', 'Expiry alert records', 'Expiry alert records.')
,
  ('low_stock_alerts', 58, 'reorder', 'Low stock alert records', 'Low stock alert records.')
,
  ('reorder_points', 59, 'reorder', 'Reorder point definitions', 'Reorder point definitions.')
,
  ('reorder_suggestions', 60, 'reorder', 'Companion reorder suggestions', 'Companion reorder suggestions.')
,
  ('auto_purchasing_rules', 61, 'reorder', 'Governed auto-purchasing rules', 'Governed auto-purchasing rules.')
,
  ('governed_auto_purchase', 62, 'reorder', 'Auto-purchase governance approvals', 'Auto-purchase governance approvals.')
,
  ('supplier_lead_times', 63, 'reorder', 'Supplier lead time metadata', 'Supplier lead time metadata.')
,
  ('purchase_requests', 64, 'purchasing', 'Purchase request records', 'Purchase request records.')
,
  ('purchase_request_approvals', 65, 'purchasing', 'Purchase request approval chain', 'Purchase request approval chain.')
,
  ('purchase_orders', 66, 'purchasing', 'Purchase order center records', 'Purchase order center records.')
,
  ('po_line_items', 67, 'purchasing', 'Purchase order line items', 'Purchase order line items.')
,
  ('supplier_integration_links', 68, 'purchasing', 'Phase 584 — reuse vendor management, no duplicate master', 'Phase 584 — reuse vendor management, no duplicate master.')
,
  ('vendor_catalog_links', 69, 'purchasing', 'Vendor catalog cross-links', 'Vendor catalog cross-links.')
,
  ('po_approval_workflow', 70, 'purchasing', 'PO approval workflow metadata', 'PO approval workflow metadata.')
,
  ('po_status_catalog', 71, 'purchasing', 'PO status catalog — icon + text', 'PO status catalog — icon + text.')
,
  ('receiving_orders', 72, 'receiving', 'Receiving center orders', 'Receiving center orders.')
,
  ('partial_receiving', 73, 'receiving', 'Partial receiving records', 'Partial receiving records.')
,
  ('unplanned_receiving', 74, 'receiving', 'Unplanned receiving records', 'Unplanned receiving records.')
,
  ('quality_checks', 75, 'receiving', 'Receiving quality check records', 'Receiving quality check records.')
,
  ('receiving_differences', 76, 'receiving', 'Receiving difference/discrepancy records', 'Receiving difference/discrepancy records.')
,
  ('supplier_returns', 77, 'receiving', 'Supplier return records from receiving', 'Supplier return records from receiving.')
,
  ('receiving_assistant_meta', 78, 'receiving', 'Companion Receiving Assistant metadata', 'Companion Receiving Assistant metadata.')
,
  ('receiving_status_catalog', 79, 'receiving', 'Receiving status catalog — icon + text', 'Receiving status catalog — icon + text.')
,
  ('stock_transfers', 80, 'transfers', 'Stock transfer records', 'Stock transfer records.')
,
  ('transfer_requests', 81, 'transfers', 'Transfer request workflow', 'Transfer request workflow.')
,
  ('emergency_transfers', 82, 'transfers', 'Emergency transfer records', 'Emergency transfer records.')
,
  ('transfer_recommendations', 83, 'transfers', 'Emergency transfer recommendations', 'Emergency transfer recommendations.')
,
  ('stock_counts', 84, 'counts', 'Stock count center sessions', 'Stock count center sessions.')
,
  ('blind_counts', 85, 'counts', 'Blind count records', 'Blind count records.')
,
  ('double_counts', 86, 'counts', 'Double count verification', 'Double count verification.')
,
  ('count_adjustments', 87, 'counts', 'Count adjustment records', 'Count adjustment records.')
,
  ('inventory_adjustments', 88, 'adjustments', 'Manual inventory adjustments', 'Manual inventory adjustments.')
,
  ('waste_records', 89, 'waste', 'Waste management records', 'Waste management records.')
,
  ('service_waste', 90, 'waste', 'Service-specific waste records', 'Service-specific waste records.')
,
  ('waste_reasons', 91, 'waste', 'Waste reason catalog', 'Waste reason catalog.')
,
  ('demand_forecasts', 92, 'forecasting', 'Demand forecast records', 'Demand forecast records.')
,
  ('vacation_inventory_continuity', 93, 'forecasting', 'Phase 606/610 vacation inventory continuity', 'Phase 606/610 vacation inventory continuity.')
,
  ('appointment_demand_links', 94, 'forecasting', 'Appointment demand forecast links', 'Appointment demand forecast links.')
,
  ('crisis_inventory_metadata', 95, 'crisis', 'Phase 607 crisis integration metadata', 'Phase 607 crisis integration metadata.')
,
  ('emergency_stock_policies', 96, 'crisis', 'Emergency stock policy records', 'Emergency stock policy records.')
,
  ('client_relationship_links', 97, 'integration', 'Phase 611 client relationship links', 'Phase 611 client relationship links.')
,
  ('revenue_ops_links', 98, 'integration', 'Phase 588 revenue operations links', 'Phase 588 revenue operations links.')
,
  ('fiken_accounting_prep', 99, 'integration', 'Fiken accounting preparation metadata', 'Fiken accounting preparation metadata.')
,
  ('inventory_valuation', 100, 'valuation', 'Inventory valuation records', 'Inventory valuation records.')
,
  ('cost_layers', 101, 'valuation', 'Cost layer tracking', 'Cost layer tracking.')
,
  ('landed_costs', 102, 'valuation', 'Landed cost calculations', 'Landed cost calculations.')
,
  ('margin_signals', 103, 'valuation', 'Margin signal records', 'Margin signal records.')
,
  ('service_consumable_costs', 104, 'valuation', 'Service consumable cost tracking', 'Service consumable cost tracking.')
,
  ('reorder_budgets', 105, 'valuation', 'Reorder budget governance', 'Reorder budget governance.')
,
  ('companion_advisor_meta', 106, 'companion', 'Companion Inventory Advisor metadata', 'Companion Inventory Advisor metadata.')
,
  ('mobile_inventory_meta', 107, 'mobile', 'Mobile inventory summary metadata', 'Mobile inventory summary metadata.')
,
  ('offline_handling', 108, 'mobile', 'Offline inventory handling rules', 'Offline inventory handling rules.')
,
  ('import_export_jobs', 109, 'mobile', 'Import and export job records', 'Import and export job records.')
,
  ('inventory_api_meta', 110, 'mobile', 'Inventory API metadata', 'Inventory API metadata.')
,
  ('event_bus_links', 111, 'mobile', 'Phase 591 event bus integration links', 'Phase 591 event bus integration links.')
,
  ('since_last_login_meta', 112, 'dashboards', 'Since Last Login integration metadata', 'Since Last Login integration metadata.')
,
  ('inventory_analytics', 113, 'dashboards', 'Inventory analytics aggregates', 'Inventory analytics aggregates.')
,
  ('access_control', 114, 'security', 'Inventory access control rules', 'Inventory access control rules.')
,
  ('segregation_rules', 115, 'security', 'Inventory segregation of duties', 'Inventory segregation of duties.')
,
  ('inventory_policies', 116, 'policies', 'Inventory policy center records', 'Inventory policy center records.')
,
  ('policy_acknowledgements', 117, 'policies', 'Policy acknowledgement tracking', 'Policy acknowledgement tracking.')
,
  ('inventory_reports', 118, 'reports', 'Inventory report catalog', 'Inventory report catalog.')
,
  ('section_registry', 119, 'reports', 'Section registry — all 120 inventory domains', 'Section registry — all 120 inventory domains.')
,
  ('audit_logs', 120, 'reports', 'Inventory audit log', 'Inventory audit log.')

on conflict (section_key) do nothing;

create table if not exists public.inv613_stock_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'stock' check (
    status_group in ('stock', 'product', 'po', 'receiving', 'transfer', 'count', 'equipment')
  ),
  sellable boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.inv613_stock_status_defs (status_key, status_title, icon_key, status_group, sellable, summary) values
  ('in_stock', 'In stock', 'check-circle', 'stock', true, 'Available for use and sale.'),
  ('low_stock', 'Low stock', 'alert-triangle', 'stock', true, 'Below reorder point — review replenishment.'),
  ('out_of_stock', 'Out of stock', 'x-circle', 'stock', false, 'No available quantity.'),
  ('reserved', 'Reserved', 'lock', 'stock', false, 'Reserved for service or order.'),
  ('incoming', 'Incoming', 'truck', 'stock', false, 'On purchase order — not yet received.'),
  ('quarantined', 'Quarantined', 'shield-off', 'stock', false, 'Blocked — never sold until cleared.'),
  ('expired', 'Expired', 'clock', 'stock', false, 'Expired — never sold.'),
  ('recalled', 'Recalled', 'alert-octagon', 'stock', false, 'Recalled — blocked from use.'),
  ('draft', 'Draft', 'edit', 'po', false, 'Draft purchase document.'),
  ('approval_required', 'Approval required', 'clock', 'po', false, 'Awaiting approval.'),
  ('approved', 'Approved', 'check-circle', 'po', false, 'Approved for processing.'),
  ('received', 'Received', 'package', 'receiving', false, 'Receiving completed.'),
  ('pending', 'Pending', 'circle', 'transfer', false, 'Transfer pending completion.')
on conflict (status_key) do nothing;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inv613_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  inventory_center_enabled boolean not null default true,
  multi_location_enabled boolean not null default true,
  consumables_enabled boolean not null default true,
  serial_batch_tracking_enabled boolean not null default true,
  fefo_fifo_enabled boolean not null default true,
  quarantine_enforced boolean not null default true,
  never_sell_expired boolean not null default true,
  checkout_failure_guard_enabled boolean not null default true,
  auto_purchasing_governed boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  receiving_assistant_enabled boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  offline_handling_enabled boolean not null default false,
  audit_logging_required boolean not null default true,
  since_last_login_enabled boolean not null default true,
  default_currency text not null default 'NOK',
  business_pack_key text not null default 'inventory_service_supplies_pack',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_inv613_settings enable row level security;
revoke all on public.organization_inv613_settings from authenticated, anon;

-- scope: inventory_scopes
create table if not exists public.organization_inv613_inventory_scopes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_scopes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_scopes enable row level security;
revoke all on public.organization_inv613_inventory_scopes from authenticated, anon;

-- scope: domain_assignments
create table if not exists public.organization_inv613_domain_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'domain_assignments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_domain_assignments enable row level security;
revoke all on public.organization_inv613_domain_assignments from authenticated, anon;

-- scope: location_registry
create table if not exists public.organization_inv613_location_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_registry',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_location_registry enable row level security;
revoke all on public.organization_inv613_location_registry from authenticated, anon;

-- scope: storage_zones
create table if not exists public.organization_inv613_storage_zones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'storage_zones',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_storage_zones enable row level security;
revoke all on public.organization_inv613_storage_zones from authenticated, anon;

-- scope: vehicle_stock_locations
create table if not exists public.organization_inv613_vehicle_stock_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vehicle_stock_locations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_vehicle_stock_locations enable row level security;
revoke all on public.organization_inv613_vehicle_stock_locations from authenticated, anon;

-- scope: employee_kits
create table if not exists public.organization_inv613_employee_kits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'employee_kits',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_employee_kits enable row level security;
revoke all on public.organization_inv613_employee_kits from authenticated, anon;

-- scope: item_types
create table if not exists public.organization_inv613_item_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'item_types',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_item_types enable row level security;
revoke all on public.organization_inv613_item_types from authenticated, anon;

-- products: product_master
create table if not exists public.organization_inv613_product_master (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_master',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_master enable row level security;
revoke all on public.organization_inv613_product_master from authenticated, anon;

-- products: product_variants
create table if not exists public.organization_inv613_product_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_variants',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_variants enable row level security;
revoke all on public.organization_inv613_product_variants from authenticated, anon;

-- products: product_categories
create table if not exists public.organization_inv613_product_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_categories',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_categories enable row level security;
revoke all on public.organization_inv613_product_categories from authenticated, anon;

-- products: units_of_measure
create table if not exists public.organization_inv613_units_of_measure (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'units_of_measure',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_units_of_measure enable row level security;
revoke all on public.organization_inv613_units_of_measure from authenticated, anon;

-- products: unit_conversions
create table if not exists public.organization_inv613_unit_conversions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'unit_conversions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_unit_conversions enable row level security;
revoke all on public.organization_inv613_unit_conversions from authenticated, anon;

-- products: product_status_catalog
create table if not exists public.organization_inv613_product_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_status_catalog enable row level security;
revoke all on public.organization_inv613_product_status_catalog from authenticated, anon;

-- consumables: consumable_items
create table if not exists public.organization_inv613_consumable_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'consumable_items',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_consumable_items enable row level security;
revoke all on public.organization_inv613_consumable_items from authenticated, anon;

-- consumables: consumable_categories
create table if not exists public.organization_inv613_consumable_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'consumable_categories',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_consumable_categories enable row level security;
revoke all on public.organization_inv613_consumable_categories from authenticated, anon;

-- stock: stock_quantities
create table if not exists public.organization_inv613_stock_quantities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_quantities',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_quantities enable row level security;
revoke all on public.organization_inv613_stock_quantities from authenticated, anon;

-- stock: stock_status_catalog
create table if not exists public.organization_inv613_stock_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_status_catalog enable row level security;
revoke all on public.organization_inv613_stock_status_catalog from authenticated, anon;

-- stock: available_stock
create table if not exists public.organization_inv613_available_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'available_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_available_stock enable row level security;
revoke all on public.organization_inv613_available_stock from authenticated, anon;

-- stock: reserved_stock
create table if not exists public.organization_inv613_reserved_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reserved_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_reserved_stock enable row level security;
revoke all on public.organization_inv613_reserved_stock from authenticated, anon;

-- stock: incoming_stock
create table if not exists public.organization_inv613_incoming_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'incoming_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_incoming_stock enable row level security;
revoke all on public.organization_inv613_incoming_stock from authenticated, anon;

-- stock: quarantined_stock
create table if not exists public.organization_inv613_quarantined_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'quarantined_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_quarantined_stock enable row level security;
revoke all on public.organization_inv613_quarantined_stock from authenticated, anon;

-- stock: stock_allocations
create table if not exists public.organization_inv613_stock_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_allocations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_allocations enable row level security;
revoke all on public.organization_inv613_stock_allocations from authenticated, anon;

-- stock: location_stock
create table if not exists public.organization_inv613_location_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'location_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_location_stock enable row level security;
revoke all on public.organization_inv613_location_stock from authenticated, anon;

-- stock: zone_stock
create table if not exists public.organization_inv613_zone_stock (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'zone_stock',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_zone_stock enable row level security;
revoke all on public.organization_inv613_zone_stock from authenticated, anon;

-- movements: stock_movements
create table if not exists public.organization_inv613_stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_movements',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_movements enable row level security;
revoke all on public.organization_inv613_stock_movements from authenticated, anon;

-- movements: stock_ledger
create table if not exists public.organization_inv613_stock_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_ledger',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_ledger enable row level security;
revoke all on public.organization_inv613_stock_ledger from authenticated, anon;

-- movements: movement_types
create table if not exists public.organization_inv613_movement_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'movement_types',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_movement_types enable row level security;
revoke all on public.organization_inv613_movement_types from authenticated, anon;

-- consumption: consumption_recipes
create table if not exists public.organization_inv613_consumption_recipes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'consumption_recipes',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_consumption_recipes enable row level security;
revoke all on public.organization_inv613_consumption_recipes from authenticated, anon;

-- consumption: recipe_ingredients
create table if not exists public.organization_inv613_recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'recipe_ingredients',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_recipe_ingredients enable row level security;
revoke all on public.organization_inv613_recipe_ingredients from authenticated, anon;

-- consumption: actual_consumption
create table if not exists public.organization_inv613_actual_consumption (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'actual_consumption',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_actual_consumption enable row level security;
revoke all on public.organization_inv613_actual_consumption from authenticated, anon;

-- consumption: appointment_forecasts
create table if not exists public.organization_inv613_appointment_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_forecasts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_appointment_forecasts enable row level security;
revoke all on public.organization_inv613_appointment_forecasts from authenticated, anon;

-- consumption: appointment_readiness
create table if not exists public.organization_inv613_appointment_readiness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_readiness',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_appointment_readiness enable row level security;
revoke all on public.organization_inv613_appointment_readiness from authenticated, anon;

-- reservations: service_reservations
create table if not exists public.organization_inv613_service_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_reservations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_service_reservations enable row level security;
revoke all on public.organization_inv613_service_reservations from authenticated, anon;

-- consumption: appointment_stock_links
create table if not exists public.organization_inv613_appointment_stock_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_stock_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_appointment_stock_links enable row level security;
revoke all on public.organization_inv613_appointment_stock_links from authenticated, anon;

-- consumption: consumption_variance
create table if not exists public.organization_inv613_consumption_variance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'consumption_variance',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_consumption_variance enable row level security;
revoke all on public.organization_inv613_consumption_variance from authenticated, anon;

-- checkout: checkout_deductions
create table if not exists public.organization_inv613_checkout_deductions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_deductions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_checkout_deductions enable row level security;
revoke all on public.organization_inv613_checkout_deductions from authenticated, anon;

-- checkout: checkout_failure_guard
create table if not exists public.organization_inv613_checkout_failure_guard (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_failure_guard',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_checkout_failure_guard enable row level security;
revoke all on public.organization_inv613_checkout_failure_guard from authenticated, anon;

-- returns: product_returns
create table if not exists public.organization_inv613_product_returns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_returns',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_returns enable row level security;
revoke all on public.organization_inv613_product_returns from authenticated, anon;

-- returns: refund_without_return
create table if not exists public.organization_inv613_refund_without_return (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'refund_without_return',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_refund_without_return enable row level security;
revoke all on public.organization_inv613_refund_without_return from authenticated, anon;

-- checkout: checkout_stock_links
create table if not exists public.organization_inv613_checkout_stock_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'checkout_stock_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_checkout_stock_links enable row level security;
revoke all on public.organization_inv613_checkout_stock_links from authenticated, anon;

-- checkout: pos_inventory_integration
create table if not exists public.organization_inv613_pos_inventory_integration (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'pos_inventory_integration',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_pos_inventory_integration enable row level security;
revoke all on public.organization_inv613_pos_inventory_integration from authenticated, anon;

-- bundles: product_bundles
create table if not exists public.organization_inv613_product_bundles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'product_bundles',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_product_bundles enable row level security;
revoke all on public.organization_inv613_product_bundles from authenticated, anon;

-- bundles: bundle_components
create table if not exists public.organization_inv613_bundle_components (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'bundle_components',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_bundle_components enable row level security;
revoke all on public.organization_inv613_bundle_components from authenticated, anon;

-- bundles: service_kits
create table if not exists public.organization_inv613_service_kits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_kits',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_service_kits enable row level security;
revoke all on public.organization_inv613_service_kits from authenticated, anon;

-- equipment: equipment_register
create table if not exists public.organization_inv613_equipment_register (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'equipment_register',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_equipment_register enable row level security;
revoke all on public.organization_inv613_equipment_register from authenticated, anon;

-- equipment: equipment_reservations
create table if not exists public.organization_inv613_equipment_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'equipment_reservations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_equipment_reservations enable row level security;
revoke all on public.organization_inv613_equipment_reservations from authenticated, anon;

-- equipment: equipment_maintenance
create table if not exists public.organization_inv613_equipment_maintenance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'equipment_maintenance',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_equipment_maintenance enable row level security;
revoke all on public.organization_inv613_equipment_maintenance from authenticated, anon;

-- traceability: serial_numbers
create table if not exists public.organization_inv613_serial_numbers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'serial_numbers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_serial_numbers enable row level security;
revoke all on public.organization_inv613_serial_numbers from authenticated, anon;

-- traceability: batch_lots
create table if not exists public.organization_inv613_batch_lots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'batch_lots',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_batch_lots enable row level security;
revoke all on public.organization_inv613_batch_lots from authenticated, anon;

-- traceability: expiry_tracking
create table if not exists public.organization_inv613_expiry_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'expiry_tracking',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_expiry_tracking enable row level security;
revoke all on public.organization_inv613_expiry_tracking from authenticated, anon;

-- traceability: fefo_fifo_rules
create table if not exists public.organization_inv613_fefo_fifo_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fefo_fifo_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_fefo_fifo_rules enable row level security;
revoke all on public.organization_inv613_fefo_fifo_rules from authenticated, anon;

-- traceability: opened_products
create table if not exists public.organization_inv613_opened_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'opened_products',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_opened_products enable row level security;
revoke all on public.organization_inv613_opened_products from authenticated, anon;

-- traceability: quarantine_records
create table if not exists public.organization_inv613_quarantine_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'quarantine_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_quarantine_records enable row level security;
revoke all on public.organization_inv613_quarantine_records from authenticated, anon;

-- traceability: recall_records
create table if not exists public.organization_inv613_recall_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'recall_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_recall_records enable row level security;
revoke all on public.organization_inv613_recall_records from authenticated, anon;

-- traceability: lot_traceability
create table if not exists public.organization_inv613_lot_traceability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'lot_traceability',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_lot_traceability enable row level security;
revoke all on public.organization_inv613_lot_traceability from authenticated, anon;

-- traceability: expiry_alerts
create table if not exists public.organization_inv613_expiry_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'expiry_alerts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_expiry_alerts enable row level security;
revoke all on public.organization_inv613_expiry_alerts from authenticated, anon;

-- reorder: low_stock_alerts
create table if not exists public.organization_inv613_low_stock_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'low_stock_alerts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_low_stock_alerts enable row level security;
revoke all on public.organization_inv613_low_stock_alerts from authenticated, anon;

-- reorder: reorder_points
create table if not exists public.organization_inv613_reorder_points (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reorder_points',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_reorder_points enable row level security;
revoke all on public.organization_inv613_reorder_points from authenticated, anon;

-- reorder: reorder_suggestions
create table if not exists public.organization_inv613_reorder_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reorder_suggestions',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_reorder_suggestions enable row level security;
revoke all on public.organization_inv613_reorder_suggestions from authenticated, anon;

-- reorder: auto_purchasing_rules
create table if not exists public.organization_inv613_auto_purchasing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'auto_purchasing_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_auto_purchasing_rules enable row level security;
revoke all on public.organization_inv613_auto_purchasing_rules from authenticated, anon;

-- reorder: governed_auto_purchase
create table if not exists public.organization_inv613_governed_auto_purchase (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'governed_auto_purchase',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_governed_auto_purchase enable row level security;
revoke all on public.organization_inv613_governed_auto_purchase from authenticated, anon;

-- reorder: supplier_lead_times
create table if not exists public.organization_inv613_supplier_lead_times (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'supplier_lead_times',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_supplier_lead_times enable row level security;
revoke all on public.organization_inv613_supplier_lead_times from authenticated, anon;

-- purchasing: purchase_requests
create table if not exists public.organization_inv613_purchase_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'purchase_requests',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_purchase_requests enable row level security;
revoke all on public.organization_inv613_purchase_requests from authenticated, anon;

-- purchasing: purchase_request_approvals
create table if not exists public.organization_inv613_purchase_request_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'purchase_request_approvals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_purchase_request_approvals enable row level security;
revoke all on public.organization_inv613_purchase_request_approvals from authenticated, anon;

-- purchasing: purchase_orders
create table if not exists public.organization_inv613_purchase_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'purchase_orders',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_purchase_orders enable row level security;
revoke all on public.organization_inv613_purchase_orders from authenticated, anon;

-- purchasing: po_line_items
create table if not exists public.organization_inv613_po_line_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'po_line_items',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_po_line_items enable row level security;
revoke all on public.organization_inv613_po_line_items from authenticated, anon;

-- purchasing: supplier_integration_links
create table if not exists public.organization_inv613_supplier_integration_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'supplier_integration_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_supplier_integration_links enable row level security;
revoke all on public.organization_inv613_supplier_integration_links from authenticated, anon;

-- purchasing: vendor_catalog_links
create table if not exists public.organization_inv613_vendor_catalog_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vendor_catalog_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_vendor_catalog_links enable row level security;
revoke all on public.organization_inv613_vendor_catalog_links from authenticated, anon;

-- purchasing: po_approval_workflow
create table if not exists public.organization_inv613_po_approval_workflow (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'po_approval_workflow',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_po_approval_workflow enable row level security;
revoke all on public.organization_inv613_po_approval_workflow from authenticated, anon;

-- purchasing: po_status_catalog
create table if not exists public.organization_inv613_po_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'po_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_po_status_catalog enable row level security;
revoke all on public.organization_inv613_po_status_catalog from authenticated, anon;

-- receiving: receiving_orders
create table if not exists public.organization_inv613_receiving_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receiving_orders',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_receiving_orders enable row level security;
revoke all on public.organization_inv613_receiving_orders from authenticated, anon;

-- receiving: partial_receiving
create table if not exists public.organization_inv613_partial_receiving (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'partial_receiving',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_partial_receiving enable row level security;
revoke all on public.organization_inv613_partial_receiving from authenticated, anon;

-- receiving: unplanned_receiving
create table if not exists public.organization_inv613_unplanned_receiving (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'unplanned_receiving',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_unplanned_receiving enable row level security;
revoke all on public.organization_inv613_unplanned_receiving from authenticated, anon;

-- receiving: quality_checks
create table if not exists public.organization_inv613_quality_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'quality_checks',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_quality_checks enable row level security;
revoke all on public.organization_inv613_quality_checks from authenticated, anon;

-- receiving: receiving_differences
create table if not exists public.organization_inv613_receiving_differences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receiving_differences',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_receiving_differences enable row level security;
revoke all on public.organization_inv613_receiving_differences from authenticated, anon;

-- receiving: supplier_returns
create table if not exists public.organization_inv613_supplier_returns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'supplier_returns',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_supplier_returns enable row level security;
revoke all on public.organization_inv613_supplier_returns from authenticated, anon;

-- receiving: receiving_assistant_meta
create table if not exists public.organization_inv613_receiving_assistant_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receiving_assistant_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_receiving_assistant_meta enable row level security;
revoke all on public.organization_inv613_receiving_assistant_meta from authenticated, anon;

-- receiving: receiving_status_catalog
create table if not exists public.organization_inv613_receiving_status_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'receiving_status_catalog',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_receiving_status_catalog enable row level security;
revoke all on public.organization_inv613_receiving_status_catalog from authenticated, anon;

-- transfers: stock_transfers
create table if not exists public.organization_inv613_stock_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_transfers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_transfers enable row level security;
revoke all on public.organization_inv613_stock_transfers from authenticated, anon;

-- transfers: transfer_requests
create table if not exists public.organization_inv613_transfer_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'transfer_requests',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_transfer_requests enable row level security;
revoke all on public.organization_inv613_transfer_requests from authenticated, anon;

-- transfers: emergency_transfers
create table if not exists public.organization_inv613_emergency_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'emergency_transfers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_emergency_transfers enable row level security;
revoke all on public.organization_inv613_emergency_transfers from authenticated, anon;

-- transfers: transfer_recommendations
create table if not exists public.organization_inv613_transfer_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'transfer_recommendations',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_transfer_recommendations enable row level security;
revoke all on public.organization_inv613_transfer_recommendations from authenticated, anon;

-- counts: stock_counts
create table if not exists public.organization_inv613_stock_counts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'stock_counts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_stock_counts enable row level security;
revoke all on public.organization_inv613_stock_counts from authenticated, anon;

-- counts: blind_counts
create table if not exists public.organization_inv613_blind_counts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'blind_counts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_blind_counts enable row level security;
revoke all on public.organization_inv613_blind_counts from authenticated, anon;

-- counts: double_counts
create table if not exists public.organization_inv613_double_counts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'double_counts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_double_counts enable row level security;
revoke all on public.organization_inv613_double_counts from authenticated, anon;

-- counts: count_adjustments
create table if not exists public.organization_inv613_count_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'count_adjustments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_count_adjustments enable row level security;
revoke all on public.organization_inv613_count_adjustments from authenticated, anon;

-- adjustments: inventory_adjustments
create table if not exists public.organization_inv613_inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_adjustments',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_adjustments enable row level security;
revoke all on public.organization_inv613_inventory_adjustments from authenticated, anon;

-- waste: waste_records
create table if not exists public.organization_inv613_waste_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'waste_records',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_waste_records enable row level security;
revoke all on public.organization_inv613_waste_records from authenticated, anon;

-- waste: service_waste
create table if not exists public.organization_inv613_service_waste (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_waste',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_service_waste enable row level security;
revoke all on public.organization_inv613_service_waste from authenticated, anon;

-- waste: waste_reasons
create table if not exists public.organization_inv613_waste_reasons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'waste_reasons',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_waste_reasons enable row level security;
revoke all on public.organization_inv613_waste_reasons from authenticated, anon;

-- forecasting: demand_forecasts
create table if not exists public.organization_inv613_demand_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'demand_forecasts',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_demand_forecasts enable row level security;
revoke all on public.organization_inv613_demand_forecasts from authenticated, anon;

-- forecasting: vacation_inventory_continuity
create table if not exists public.organization_inv613_vacation_inventory_continuity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'vacation_inventory_continuity',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_vacation_inventory_continuity enable row level security;
revoke all on public.organization_inv613_vacation_inventory_continuity from authenticated, anon;

-- forecasting: appointment_demand_links
create table if not exists public.organization_inv613_appointment_demand_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'appointment_demand_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_appointment_demand_links enable row level security;
revoke all on public.organization_inv613_appointment_demand_links from authenticated, anon;

-- crisis: crisis_inventory_metadata
create table if not exists public.organization_inv613_crisis_inventory_metadata (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'crisis_inventory_metadata',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_crisis_inventory_metadata enable row level security;
revoke all on public.organization_inv613_crisis_inventory_metadata from authenticated, anon;

-- crisis: emergency_stock_policies
create table if not exists public.organization_inv613_emergency_stock_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'emergency_stock_policies',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_emergency_stock_policies enable row level security;
revoke all on public.organization_inv613_emergency_stock_policies from authenticated, anon;

-- integration: client_relationship_links
create table if not exists public.organization_inv613_client_relationship_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'client_relationship_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_client_relationship_links enable row level security;
revoke all on public.organization_inv613_client_relationship_links from authenticated, anon;

-- integration: revenue_ops_links
create table if not exists public.organization_inv613_revenue_ops_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'revenue_ops_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_revenue_ops_links enable row level security;
revoke all on public.organization_inv613_revenue_ops_links from authenticated, anon;

-- integration: fiken_accounting_prep
create table if not exists public.organization_inv613_fiken_accounting_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'fiken_accounting_prep',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_fiken_accounting_prep enable row level security;
revoke all on public.organization_inv613_fiken_accounting_prep from authenticated, anon;

-- valuation: inventory_valuation
create table if not exists public.organization_inv613_inventory_valuation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_valuation',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_valuation enable row level security;
revoke all on public.organization_inv613_inventory_valuation from authenticated, anon;

-- valuation: cost_layers
create table if not exists public.organization_inv613_cost_layers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'cost_layers',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_cost_layers enable row level security;
revoke all on public.organization_inv613_cost_layers from authenticated, anon;

-- valuation: landed_costs
create table if not exists public.organization_inv613_landed_costs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'landed_costs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_landed_costs enable row level security;
revoke all on public.organization_inv613_landed_costs from authenticated, anon;

-- valuation: margin_signals
create table if not exists public.organization_inv613_margin_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'margin_signals',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_margin_signals enable row level security;
revoke all on public.organization_inv613_margin_signals from authenticated, anon;

-- valuation: service_consumable_costs
create table if not exists public.organization_inv613_service_consumable_costs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'service_consumable_costs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_service_consumable_costs enable row level security;
revoke all on public.organization_inv613_service_consumable_costs from authenticated, anon;

-- valuation: reorder_budgets
create table if not exists public.organization_inv613_reorder_budgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'reorder_budgets',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_reorder_budgets enable row level security;
revoke all on public.organization_inv613_reorder_budgets from authenticated, anon;

-- companion: companion_advisor_meta
create table if not exists public.organization_inv613_companion_advisor_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'companion_advisor_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_companion_advisor_meta enable row level security;
revoke all on public.organization_inv613_companion_advisor_meta from authenticated, anon;

-- mobile: mobile_inventory_meta
create table if not exists public.organization_inv613_mobile_inventory_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'mobile_inventory_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_mobile_inventory_meta enable row level security;
revoke all on public.organization_inv613_mobile_inventory_meta from authenticated, anon;

-- mobile: offline_handling
create table if not exists public.organization_inv613_offline_handling (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'offline_handling',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_offline_handling enable row level security;
revoke all on public.organization_inv613_offline_handling from authenticated, anon;

-- mobile: import_export_jobs
create table if not exists public.organization_inv613_import_export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'import_export_jobs',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_import_export_jobs enable row level security;
revoke all on public.organization_inv613_import_export_jobs from authenticated, anon;

-- mobile: inventory_api_meta
create table if not exists public.organization_inv613_inventory_api_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_api_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_api_meta enable row level security;
revoke all on public.organization_inv613_inventory_api_meta from authenticated, anon;

-- mobile: event_bus_links
create table if not exists public.organization_inv613_event_bus_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'event_bus_links',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_event_bus_links enable row level security;
revoke all on public.organization_inv613_event_bus_links from authenticated, anon;

-- dashboards: since_last_login_meta
create table if not exists public.organization_inv613_since_last_login_meta (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'since_last_login_meta',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_since_last_login_meta enable row level security;
revoke all on public.organization_inv613_since_last_login_meta from authenticated, anon;

-- dashboards: inventory_analytics
create table if not exists public.organization_inv613_inventory_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_analytics',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_analytics enable row level security;
revoke all on public.organization_inv613_inventory_analytics from authenticated, anon;

-- security: access_control
create table if not exists public.organization_inv613_access_control (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'access_control',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_access_control enable row level security;
revoke all on public.organization_inv613_access_control from authenticated, anon;

-- security: segregation_rules
create table if not exists public.organization_inv613_segregation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'segregation_rules',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_segregation_rules enable row level security;
revoke all on public.organization_inv613_segregation_rules from authenticated, anon;

-- policies: inventory_policies
create table if not exists public.organization_inv613_inventory_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_policies',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_policies enable row level security;
revoke all on public.organization_inv613_inventory_policies from authenticated, anon;

-- policies: policy_acknowledgements
create table if not exists public.organization_inv613_policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'policy_acknowledgements',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_policy_acknowledgements enable row level security;
revoke all on public.organization_inv613_policy_acknowledgements from authenticated, anon;

-- reports: inventory_reports
create table if not exists public.organization_inv613_inventory_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'inventory_reports',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_inventory_reports enable row level security;
revoke all on public.organization_inv613_inventory_reports from authenticated, anon;

-- reports: section_registry
create table if not exists public.organization_inv613_section_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default 'section_registry',
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  quantity numeric(14, 2),
  unit_label text not null default '',
  location_label text not null default '',
  sellable boolean,
  starts_at timestamptz,
  ends_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.organization_inv613_section_registry enable row level security;
revoke all on public.organization_inv613_section_registry from authenticated, anon;

create table if not exists public.organization_inv613_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'inventory',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_inv613_audit_logs enable row level security;
revoke all on public.organization_inv613_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._inv613_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._inv613_status_presentation(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key,
      'status_title', d.status_title,
      'icon_key', d.icon_key,
      'status_group', d.status_group,
      'sellable', d.sellable,
      'summary', d.summary
    ) from public.inv613_stock_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', initcap(replace(p_status_key, '_', ' ')),
    'icon_key', 'circle', 'status_group', 'stock', 'sellable', false, 'summary', ''));
$$;

create or replace function public._inv613_row_presentation(
  p_status text, p_icon text, p_label text
)
returns jsonb language sql immutable set search_path = public as $$
  select jsonb_build_object(
    'status_key', coalesce(nullif(p_status, ''), 'active'),
    'status_title', coalesce(nullif(p_label, ''), initcap(replace(coalesce(p_status, 'active'), '_', ' '))),
    'icon_key', coalesce(nullif(p_icon, ''), 'circle')
  );
$$;

create or replace function public._inv613_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'inventory'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_inv613_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'inventory'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._inv613_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_inv613_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._inv613_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status'', public._inv613_row_presentation(record_status, status_icon, status_label),
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''priority'', priority, ''integration_ref'', integration_ref,
      ''quantity'', quantity, ''unit_label'', unit_label, ''location_label'', location_label,
      ''sellable'', sellable, ''summary'', summary, ''metadata'', metadata,
      ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_inv613_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

create or replace function public._inv613_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_inv613_product_master where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_inv613_inventory_scopes (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_sc_seed', initcap(replace('inventory_scopes', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_scopes', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_scopes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_domain_assignments (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'domain_assig_seed', initcap(replace('domain_assignments', '_', ' ')), 'active', 'circle', 'Active',
    'domain_assignments', 'organization', 'routine', '', 'Baseline seed — Phase 613 domain_assignments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_location_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'location_reg_seed', initcap(replace('location_registry', '_', ' ')), 'active', 'circle', 'Active',
    'location_registry', 'organization', 'routine', '', 'Baseline seed — Phase 613 location_registry.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_storage_zones (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'storage_zone_seed', initcap(replace('storage_zones', '_', ' ')), 'active', 'circle', 'Active',
    'storage_zones', 'organization', 'routine', '', 'Baseline seed — Phase 613 storage_zones.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_vehicle_stock_locations (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vehicle_stoc_seed', initcap(replace('vehicle_stock_locations', '_', ' ')), 'active', 'circle', 'Active',
    'vehicle_stock_locations', 'organization', 'routine', '', 'Baseline seed — Phase 613 vehicle_stock_locations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_employee_kits (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'employee_kit_seed', initcap(replace('employee_kits', '_', ' ')), 'active', 'circle', 'Active',
    'employee_kits', 'organization', 'routine', '', 'Baseline seed — Phase 613 employee_kits.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_item_types (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'item_types_seed', initcap(replace('item_types', '_', ' ')), 'active', 'circle', 'Active',
    'item_types', 'organization', 'routine', '', 'Baseline seed — Phase 613 item_types.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_master (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_mast_seed', initcap(replace('product_master', '_', ' ')), 'active', 'circle', 'Active',
    'product_master', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_master.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_variants (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_vari_seed', initcap(replace('product_variants', '_', ' ')), 'active', 'circle', 'Active',
    'product_variants', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_variants.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_categories (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_cate_seed', initcap(replace('product_categories', '_', ' ')), 'active', 'circle', 'Active',
    'product_categories', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_categories.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_units_of_measure (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'units_of_mea_seed', initcap(replace('units_of_measure', '_', ' ')), 'active', 'circle', 'Active',
    'units_of_measure', 'organization', 'routine', '', 'Baseline seed — Phase 613 units_of_measure.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_unit_conversions (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'unit_convers_seed', initcap(replace('unit_conversions', '_', ' ')), 'active', 'circle', 'Active',
    'unit_conversions', 'organization', 'routine', '', 'Baseline seed — Phase 613 unit_conversions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_stat_seed', initcap(replace('product_status_catalog', '_', ' ')), 'active', 'circle', 'Active',
    'product_status_catalog', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_consumable_items (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'consumable_i_seed', initcap(replace('consumable_items', '_', ' ')), 'active', 'circle', 'Active',
    'consumable_items', 'organization', 'routine', '', 'Baseline seed — Phase 613 consumable_items.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_consumable_categories (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'consumable_c_seed', initcap(replace('consumable_categories', '_', ' ')), 'active', 'circle', 'Active',
    'consumable_categories', 'organization', 'routine', '', 'Baseline seed — Phase 613 consumable_categories.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_quantities (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_quanti_seed', initcap(replace('stock_quantities', '_', ' ')), 'active', 'circle', 'Active',
    'stock_quantities', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_quantities.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_status_seed', initcap(replace('stock_status_catalog', '_', ' ')), 'active', 'circle', 'Active',
    'stock_status_catalog', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_available_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'available_st_seed', initcap(replace('available_stock', '_', ' ')), 'active', 'circle', 'Active',
    'available_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 available_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_reserved_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'reserved_sto_seed', initcap(replace('reserved_stock', '_', ' ')), 'active', 'circle', 'Active',
    'reserved_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 reserved_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_incoming_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'incoming_sto_seed', initcap(replace('incoming_stock', '_', ' ')), 'active', 'circle', 'Active',
    'incoming_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 incoming_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_quarantined_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'quarantined__seed', initcap(replace('quarantined_stock', '_', ' ')), 'active', 'circle', 'Active',
    'quarantined_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 quarantined_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_allocations (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_alloca_seed', initcap(replace('stock_allocations', '_', ' ')), 'active', 'circle', 'Active',
    'stock_allocations', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_allocations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_location_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'location_sto_seed', initcap(replace('location_stock', '_', ' ')), 'active', 'circle', 'Active',
    'location_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 location_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_zone_stock (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'zone_stock_seed', initcap(replace('zone_stock', '_', ' ')), 'active', 'circle', 'Active',
    'zone_stock', 'organization', 'routine', '', 'Baseline seed — Phase 613 zone_stock.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_movements (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_moveme_seed', initcap(replace('stock_movements', '_', ' ')), 'active', 'circle', 'Active',
    'stock_movements', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_movements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_ledger (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_ledger_seed', initcap(replace('stock_ledger', '_', ' ')), 'active', 'circle', 'Active',
    'stock_ledger', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_ledger.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_movement_types (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'movement_typ_seed', initcap(replace('movement_types', '_', ' ')), 'active', 'circle', 'Active',
    'movement_types', 'organization', 'routine', '', 'Baseline seed — Phase 613 movement_types.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_consumption_recipes (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'consumption__seed', initcap(replace('consumption_recipes', '_', ' ')), 'active', 'circle', 'Active',
    'consumption_recipes', 'organization', 'routine', '', 'Baseline seed — Phase 613 consumption_recipes.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_recipe_ingredients (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'recipe_ingre_seed', initcap(replace('recipe_ingredients', '_', ' ')), 'active', 'circle', 'Active',
    'recipe_ingredients', 'organization', 'routine', '', 'Baseline seed — Phase 613 recipe_ingredients.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_actual_consumption (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'actual_consu_seed', initcap(replace('actual_consumption', '_', ' ')), 'active', 'circle', 'Active',
    'actual_consumption', 'organization', 'routine', '', 'Baseline seed — Phase 613 actual_consumption.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_appointment_forecasts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointment__seed', initcap(replace('appointment_forecasts', '_', ' ')), 'active', 'circle', 'Active',
    'appointment_forecasts', 'organization', 'routine', '', 'Baseline seed — Phase 613 appointment_forecasts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_appointment_readiness (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointment__seed', initcap(replace('appointment_readiness', '_', ' ')), 'active', 'circle', 'Active',
    'appointment_readiness', 'organization', 'routine', '', 'Baseline seed — Phase 613 appointment_readiness.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_service_reservations (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_rese_seed', initcap(replace('service_reservations', '_', ' ')), 'active', 'circle', 'Active',
    'service_reservations', 'organization', 'routine', '', 'Baseline seed — Phase 613 service_reservations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_appointment_stock_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointment__seed', initcap(replace('appointment_stock_links', '_', ' ')), 'active', 'circle', 'Active',
    'appointment_stock_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 appointment_stock_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_consumption_variance (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'consumption__seed', initcap(replace('consumption_variance', '_', ' ')), 'active', 'circle', 'Active',
    'consumption_variance', 'organization', 'routine', '', 'Baseline seed — Phase 613 consumption_variance.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_checkout_deductions (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_ded_seed', initcap(replace('checkout_deductions', '_', ' ')), 'active', 'circle', 'Active',
    'checkout_deductions', 'organization', 'routine', '', 'Baseline seed — Phase 613 checkout_deductions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_checkout_failure_guard (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_fai_seed', initcap(replace('checkout_failure_guard', '_', ' ')), 'active', 'circle', 'Active',
    'checkout_failure_guard', 'organization', 'routine', '', 'Baseline seed — Phase 613 checkout_failure_guard.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_returns (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_retu_seed', initcap(replace('product_returns', '_', ' ')), 'active', 'circle', 'Active',
    'product_returns', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_returns.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_refund_without_return (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'refund_witho_seed', initcap(replace('refund_without_return', '_', ' ')), 'active', 'circle', 'Active',
    'refund_without_return', 'organization', 'routine', '', 'Baseline seed — Phase 613 refund_without_return.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_checkout_stock_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'checkout_sto_seed', initcap(replace('checkout_stock_links', '_', ' ')), 'active', 'circle', 'Active',
    'checkout_stock_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 checkout_stock_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_pos_inventory_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'pos_inventor_seed', initcap(replace('pos_inventory_integration', '_', ' ')), 'active', 'circle', 'Active',
    'pos_inventory_integration', 'organization', 'routine', '', 'Baseline seed — Phase 613 pos_inventory_integration.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_bundles (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'product_bund_seed', initcap(replace('product_bundles', '_', ' ')), 'active', 'circle', 'Active',
    'product_bundles', 'organization', 'routine', '', 'Baseline seed — Phase 613 product_bundles.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_bundle_components (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'bundle_compo_seed', initcap(replace('bundle_components', '_', ' ')), 'active', 'circle', 'Active',
    'bundle_components', 'organization', 'routine', '', 'Baseline seed — Phase 613 bundle_components.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_service_kits (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_kits_seed', initcap(replace('service_kits', '_', ' ')), 'active', 'circle', 'Active',
    'service_kits', 'organization', 'routine', '', 'Baseline seed — Phase 613 service_kits.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_equipment_register (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'equipment_re_seed', initcap(replace('equipment_register', '_', ' ')), 'active', 'circle', 'Active',
    'equipment_register', 'organization', 'routine', '', 'Baseline seed — Phase 613 equipment_register.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_equipment_reservations (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'equipment_re_seed', initcap(replace('equipment_reservations', '_', ' ')), 'active', 'circle', 'Active',
    'equipment_reservations', 'organization', 'routine', '', 'Baseline seed — Phase 613 equipment_reservations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_equipment_maintenance (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'equipment_ma_seed', initcap(replace('equipment_maintenance', '_', ' ')), 'active', 'circle', 'Active',
    'equipment_maintenance', 'organization', 'routine', '', 'Baseline seed — Phase 613 equipment_maintenance.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_serial_numbers (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'serial_numbe_seed', initcap(replace('serial_numbers', '_', ' ')), 'active', 'circle', 'Active',
    'serial_numbers', 'organization', 'routine', '', 'Baseline seed — Phase 613 serial_numbers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_batch_lots (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'batch_lots_seed', initcap(replace('batch_lots', '_', ' ')), 'active', 'circle', 'Active',
    'batch_lots', 'organization', 'routine', '', 'Baseline seed — Phase 613 batch_lots.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_expiry_tracking (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'expiry_track_seed', initcap(replace('expiry_tracking', '_', ' ')), 'active', 'circle', 'Active',
    'expiry_tracking', 'organization', 'routine', '', 'Baseline seed — Phase 613 expiry_tracking.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_fefo_fifo_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fefo_fifo_ru_seed', initcap(replace('fefo_fifo_rules', '_', ' ')), 'active', 'circle', 'Active',
    'fefo_fifo_rules', 'organization', 'routine', '', 'Baseline seed — Phase 613 fefo_fifo_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_opened_products (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'opened_produ_seed', initcap(replace('opened_products', '_', ' ')), 'active', 'circle', 'Active',
    'opened_products', 'organization', 'routine', '', 'Baseline seed — Phase 613 opened_products.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_quarantine_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'quarantine_r_seed', initcap(replace('quarantine_records', '_', ' ')), 'active', 'circle', 'Active',
    'quarantine_records', 'organization', 'routine', '', 'Baseline seed — Phase 613 quarantine_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_recall_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'recall_recor_seed', initcap(replace('recall_records', '_', ' ')), 'active', 'circle', 'Active',
    'recall_records', 'organization', 'routine', '', 'Baseline seed — Phase 613 recall_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_lot_traceability (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'lot_traceabi_seed', initcap(replace('lot_traceability', '_', ' ')), 'active', 'circle', 'Active',
    'lot_traceability', 'organization', 'routine', '', 'Baseline seed — Phase 613 lot_traceability.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_expiry_alerts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'expiry_alert_seed', initcap(replace('expiry_alerts', '_', ' ')), 'active', 'circle', 'Active',
    'expiry_alerts', 'organization', 'routine', '', 'Baseline seed — Phase 613 expiry_alerts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_low_stock_alerts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'low_stock_al_seed', initcap(replace('low_stock_alerts', '_', ' ')), 'active', 'circle', 'Active',
    'low_stock_alerts', 'organization', 'routine', '', 'Baseline seed — Phase 613 low_stock_alerts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_reorder_points (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'reorder_poin_seed', initcap(replace('reorder_points', '_', ' ')), 'active', 'circle', 'Active',
    'reorder_points', 'organization', 'routine', '', 'Baseline seed — Phase 613 reorder_points.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_reorder_suggestions (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'reorder_sugg_seed', initcap(replace('reorder_suggestions', '_', ' ')), 'active', 'circle', 'Active',
    'reorder_suggestions', 'organization', 'routine', '', 'Baseline seed — Phase 613 reorder_suggestions.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_auto_purchasing_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'auto_purchas_seed', initcap(replace('auto_purchasing_rules', '_', ' ')), 'active', 'circle', 'Active',
    'auto_purchasing_rules', 'organization', 'routine', '', 'Baseline seed — Phase 613 auto_purchasing_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_governed_auto_purchase (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'governed_aut_seed', initcap(replace('governed_auto_purchase', '_', ' ')), 'active', 'circle', 'Active',
    'governed_auto_purchase', 'organization', 'routine', '', 'Baseline seed — Phase 613 governed_auto_purchase.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_supplier_lead_times (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'supplier_lea_seed', initcap(replace('supplier_lead_times', '_', ' ')), 'active', 'circle', 'Active',
    'supplier_lead_times', 'organization', 'routine', '', 'Baseline seed — Phase 613 supplier_lead_times.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_purchase_requests (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'purchase_req_seed', initcap(replace('purchase_requests', '_', ' ')), 'active', 'circle', 'Active',
    'purchase_requests', 'organization', 'routine', '', 'Baseline seed — Phase 613 purchase_requests.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_purchase_request_approvals (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'purchase_req_seed', initcap(replace('purchase_request_approvals', '_', ' ')), 'active', 'circle', 'Active',
    'purchase_request_approvals', 'organization', 'routine', '', 'Baseline seed — Phase 613 purchase_request_approvals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_purchase_orders (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'purchase_ord_seed', initcap(replace('purchase_orders', '_', ' ')), 'active', 'circle', 'Active',
    'purchase_orders', 'organization', 'routine', '', 'Baseline seed — Phase 613 purchase_orders.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_po_line_items (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'po_line_item_seed', initcap(replace('po_line_items', '_', ' ')), 'active', 'circle', 'Active',
    'po_line_items', 'organization', 'routine', '', 'Baseline seed — Phase 613 po_line_items.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_supplier_integration_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'supplier_int_seed', initcap(replace('supplier_integration_links', '_', ' ')), 'active', 'circle', 'Active',
    'supplier_integration_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 supplier_integration_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_vendor_catalog_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vendor_catal_seed', initcap(replace('vendor_catalog_links', '_', ' ')), 'active', 'circle', 'Active',
    'vendor_catalog_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 vendor_catalog_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_po_approval_workflow (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'po_approval__seed', initcap(replace('po_approval_workflow', '_', ' ')), 'active', 'circle', 'Active',
    'po_approval_workflow', 'organization', 'routine', '', 'Baseline seed — Phase 613 po_approval_workflow.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_po_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'po_status_ca_seed', initcap(replace('po_status_catalog', '_', ' ')), 'active', 'circle', 'Active',
    'po_status_catalog', 'organization', 'routine', '', 'Baseline seed — Phase 613 po_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_receiving_orders (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiving_or_seed', initcap(replace('receiving_orders', '_', ' ')), 'active', 'circle', 'Active',
    'receiving_orders', 'organization', 'routine', '', 'Baseline seed — Phase 613 receiving_orders.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_partial_receiving (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'partial_rece_seed', initcap(replace('partial_receiving', '_', ' ')), 'active', 'circle', 'Active',
    'partial_receiving', 'organization', 'routine', '', 'Baseline seed — Phase 613 partial_receiving.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_unplanned_receiving (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'unplanned_re_seed', initcap(replace('unplanned_receiving', '_', ' ')), 'active', 'circle', 'Active',
    'unplanned_receiving', 'organization', 'routine', '', 'Baseline seed — Phase 613 unplanned_receiving.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_quality_checks (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'quality_chec_seed', initcap(replace('quality_checks', '_', ' ')), 'active', 'circle', 'Active',
    'quality_checks', 'organization', 'routine', '', 'Baseline seed — Phase 613 quality_checks.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_receiving_differences (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiving_di_seed', initcap(replace('receiving_differences', '_', ' ')), 'active', 'circle', 'Active',
    'receiving_differences', 'organization', 'routine', '', 'Baseline seed — Phase 613 receiving_differences.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_supplier_returns (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'supplier_ret_seed', initcap(replace('supplier_returns', '_', ' ')), 'active', 'circle', 'Active',
    'supplier_returns', 'organization', 'routine', '', 'Baseline seed — Phase 613 supplier_returns.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_receiving_assistant_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiving_as_seed', initcap(replace('receiving_assistant_meta', '_', ' ')), 'active', 'circle', 'Active',
    'receiving_assistant_meta', 'organization', 'routine', '', 'Baseline seed — Phase 613 receiving_assistant_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_receiving_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'receiving_st_seed', initcap(replace('receiving_status_catalog', '_', ' ')), 'active', 'circle', 'Active',
    'receiving_status_catalog', 'organization', 'routine', '', 'Baseline seed — Phase 613 receiving_status_catalog.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_transfers (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_transf_seed', initcap(replace('stock_transfers', '_', ' ')), 'active', 'circle', 'Active',
    'stock_transfers', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_transfers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_transfer_requests (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'transfer_req_seed', initcap(replace('transfer_requests', '_', ' ')), 'active', 'circle', 'Active',
    'transfer_requests', 'organization', 'routine', '', 'Baseline seed — Phase 613 transfer_requests.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_emergency_transfers (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'emergency_tr_seed', initcap(replace('emergency_transfers', '_', ' ')), 'active', 'circle', 'Active',
    'emergency_transfers', 'organization', 'routine', '', 'Baseline seed — Phase 613 emergency_transfers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_transfer_recommendations (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'transfer_rec_seed', initcap(replace('transfer_recommendations', '_', ' ')), 'active', 'circle', 'Active',
    'transfer_recommendations', 'organization', 'routine', '', 'Baseline seed — Phase 613 transfer_recommendations.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_counts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'stock_counts_seed', initcap(replace('stock_counts', '_', ' ')), 'active', 'circle', 'Active',
    'stock_counts', 'organization', 'routine', '', 'Baseline seed — Phase 613 stock_counts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_blind_counts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'blind_counts_seed', initcap(replace('blind_counts', '_', ' ')), 'active', 'circle', 'Active',
    'blind_counts', 'organization', 'routine', '', 'Baseline seed — Phase 613 blind_counts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_double_counts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'double_count_seed', initcap(replace('double_counts', '_', ' ')), 'active', 'circle', 'Active',
    'double_counts', 'organization', 'routine', '', 'Baseline seed — Phase 613 double_counts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_count_adjustments (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'count_adjust_seed', initcap(replace('count_adjustments', '_', ' ')), 'active', 'circle', 'Active',
    'count_adjustments', 'organization', 'routine', '', 'Baseline seed — Phase 613 count_adjustments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_adjustments (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_ad_seed', initcap(replace('inventory_adjustments', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_adjustments', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_adjustments.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_waste_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'waste_record_seed', initcap(replace('waste_records', '_', ' ')), 'active', 'circle', 'Active',
    'waste_records', 'organization', 'routine', '', 'Baseline seed — Phase 613 waste_records.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_service_waste (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_wast_seed', initcap(replace('service_waste', '_', ' ')), 'active', 'circle', 'Active',
    'service_waste', 'organization', 'routine', '', 'Baseline seed — Phase 613 service_waste.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_waste_reasons (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'waste_reason_seed', initcap(replace('waste_reasons', '_', ' ')), 'active', 'circle', 'Active',
    'waste_reasons', 'organization', 'routine', '', 'Baseline seed — Phase 613 waste_reasons.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_demand_forecasts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'demand_forec_seed', initcap(replace('demand_forecasts', '_', ' ')), 'active', 'circle', 'Active',
    'demand_forecasts', 'organization', 'routine', '', 'Baseline seed — Phase 613 demand_forecasts.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_vacation_inventory_continuity (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vacation_inv_seed', initcap(replace('vacation_inventory_continuity', '_', ' ')), 'active', 'circle', 'Active',
    'vacation_inventory_continuity', 'organization', 'routine', '', 'Baseline seed — Phase 613 vacation_inventory_continuity.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_appointment_demand_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'appointment__seed', initcap(replace('appointment_demand_links', '_', ' ')), 'active', 'circle', 'Active',
    'appointment_demand_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 appointment_demand_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_crisis_inventory_metadata (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'crisis_inven_seed', initcap(replace('crisis_inventory_metadata', '_', ' ')), 'active', 'circle', 'Active',
    'crisis_inventory_metadata', 'organization', 'routine', '', 'Baseline seed — Phase 613 crisis_inventory_metadata.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_emergency_stock_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'emergency_st_seed', initcap(replace('emergency_stock_policies', '_', ' ')), 'active', 'circle', 'Active',
    'emergency_stock_policies', 'organization', 'routine', '', 'Baseline seed — Phase 613 emergency_stock_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_client_relationship_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'client_relat_seed', initcap(replace('client_relationship_links', '_', ' ')), 'active', 'circle', 'Active',
    'client_relationship_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 client_relationship_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_revenue_ops_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'revenue_ops__seed', initcap(replace('revenue_ops_links', '_', ' ')), 'active', 'circle', 'Active',
    'revenue_ops_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 revenue_ops_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_fiken_accounting_prep (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'fiken_accoun_seed', initcap(replace('fiken_accounting_prep', '_', ' ')), 'active', 'circle', 'Active',
    'fiken_accounting_prep', 'organization', 'routine', '', 'Baseline seed — Phase 613 fiken_accounting_prep.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_valuation (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_va_seed', initcap(replace('inventory_valuation', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_valuation', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_valuation.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_cost_layers (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cost_layers_seed', initcap(replace('cost_layers', '_', ' ')), 'active', 'circle', 'Active',
    'cost_layers', 'organization', 'routine', '', 'Baseline seed — Phase 613 cost_layers.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_landed_costs (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'landed_costs_seed', initcap(replace('landed_costs', '_', ' ')), 'active', 'circle', 'Active',
    'landed_costs', 'organization', 'routine', '', 'Baseline seed — Phase 613 landed_costs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_margin_signals (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'margin_signa_seed', initcap(replace('margin_signals', '_', ' ')), 'active', 'circle', 'Active',
    'margin_signals', 'organization', 'routine', '', 'Baseline seed — Phase 613 margin_signals.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_service_consumable_costs (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_cons_seed', initcap(replace('service_consumable_costs', '_', ' ')), 'active', 'circle', 'Active',
    'service_consumable_costs', 'organization', 'routine', '', 'Baseline seed — Phase 613 service_consumable_costs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_reorder_budgets (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'reorder_budg_seed', initcap(replace('reorder_budgets', '_', ' ')), 'active', 'circle', 'Active',
    'reorder_budgets', 'organization', 'routine', '', 'Baseline seed — Phase 613 reorder_budgets.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_companion_advisor_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'companion_ad_seed', initcap(replace('companion_advisor_meta', '_', ' ')), 'active', 'circle', 'Active',
    'companion_advisor_meta', 'organization', 'routine', '', 'Baseline seed — Phase 613 companion_advisor_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_mobile_inventory_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'mobile_inven_seed', initcap(replace('mobile_inventory_meta', '_', ' ')), 'active', 'circle', 'Active',
    'mobile_inventory_meta', 'organization', 'routine', '', 'Baseline seed — Phase 613 mobile_inventory_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_offline_handling (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'offline_hand_seed', initcap(replace('offline_handling', '_', ' ')), 'active', 'circle', 'Active',
    'offline_handling', 'organization', 'routine', '', 'Baseline seed — Phase 613 offline_handling.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_import_export_jobs (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'import_expor_seed', initcap(replace('import_export_jobs', '_', ' ')), 'active', 'circle', 'Active',
    'import_export_jobs', 'organization', 'routine', '', 'Baseline seed — Phase 613 import_export_jobs.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_api_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_ap_seed', initcap(replace('inventory_api_meta', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_api_meta', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_api_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_event_bus_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'event_bus_li_seed', initcap(replace('event_bus_links', '_', ' ')), 'active', 'circle', 'Active',
    'event_bus_links', 'organization', 'routine', '', 'Baseline seed — Phase 613 event_bus_links.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_since_last_login_meta (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'since_last_l_seed', initcap(replace('since_last_login_meta', '_', ' ')), 'active', 'circle', 'Active',
    'since_last_login_meta', 'organization', 'routine', '', 'Baseline seed — Phase 613 since_last_login_meta.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_analytics (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_an_seed', initcap(replace('inventory_analytics', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_analytics', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_analytics.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_access_control (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'access_contr_seed', initcap(replace('access_control', '_', ' ')), 'active', 'circle', 'Active',
    'access_control', 'organization', 'routine', '', 'Baseline seed — Phase 613 access_control.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_segregation_rules (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'segregation__seed', initcap(replace('segregation_rules', '_', ' ')), 'active', 'circle', 'Active',
    'segregation_rules', 'organization', 'routine', '', 'Baseline seed — Phase 613 segregation_rules.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_policies (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_po_seed', initcap(replace('inventory_policies', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_policies', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_policies.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_policy_acknowledgements (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'policy_ackno_seed', initcap(replace('policy_acknowledgements', '_', ' ')), 'active', 'circle', 'Active',
    'policy_acknowledgements', 'organization', 'routine', '', 'Baseline seed — Phase 613 policy_acknowledgements.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_inventory_reports (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'inventory_re_seed', initcap(replace('inventory_reports', '_', ' ')), 'active', 'circle', 'Active',
    'inventory_reports', 'organization', 'routine', '', 'Baseline seed — Phase 613 inventory_reports.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_section_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, 'section_regi_seed', initcap(replace('section_registry', '_', ' ')), 'active', 'circle', 'Active',
    'section_registry', 'organization', 'routine', '', 'Baseline seed — Phase 613 section_registry.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_product_master (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, quantity, unit_label, sellable, summary, metadata
  ) values (
    p_org_id, 'prod_shampoo_500', 'Professional Shampoo 500ml', 'active', 'package', 'Active',
    'product_master', 48, 'each', true,
    'Salon consumable — tracked in multi-location stock.',
    '{"sku":"SHMP-500","category":"consumables"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_location_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, location_label, summary, metadata
  ) values
    (p_org_id, 'loc_main_salon', 'Main Salon — Oslo', 'active', 'map-pin', 'Active', 'location_registry', 'Oslo HQ', 'Primary service location.', '{"location_type":"salon"}'::jsonb),
    (p_org_id, 'loc_mobile_van', 'Mobile Service Van 02', 'active', 'truck', 'Active', 'location_registry', 'Vehicle', 'Mobile stock location.', '{"location_type":"vehicle"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_stock_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, sellable, summary, metadata
  )
  select p_org_id, 'status_' || d.status_key, d.status_title, d.status_key, d.icon_key, d.status_title,
    'stock_status_catalog', d.sellable, d.summary, jsonb_build_object('status_group', d.status_group)
  from public.inv613_stock_status_defs d
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_checkout_failure_guard (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'chk612_guard', 'Checkout failure stock guard', 'enforced', 'shield-check', 'Enforced',
    'checkout_failure_guard', 'phase612_checkout',
    'Never deduct stock from failed checkout — Phase 612 integration.',
    '{"phase612_ref":"checkout","rule":"no_deduct_on_failure","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_supplier_integration_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'sup584_link', 'Supplier master integration', 'linked', 'link', 'Linked',
    'supplier_integration_links', 'phase584_vendor_management',
    'Reuses Phase 584 vendor management — no duplicate supplier master.',
    '{"phase584_ref":"organization_procurement_vendors","duplicate_master":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_appointment_forecasts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, quantity, unit_label, summary, metadata
  ) values (
    p_org_id, 'apt610_forecast', 'Tomorrow appointment stock forecast', 'ready', 'calendar', 'Ready',
    'appointment_forecasts', 'phase610_appointments', 12, 'services',
    'Phase 610 — forecast consumables for scheduled appointments.',
    '{"phase610_ref":"appointments","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_vacation_inventory_continuity (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vac606_inv', 'Vacation inventory continuity', 'linked', 'palmtree', 'Linked',
    'vacation_inventory_continuity', 'phase606_vacation_mode',
    'Phase 606/610 — inventory continuity during absence coverage.',
    '{"phase606_ref":"vacation_mode","phase610_ref":"appointments"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_crisis_inventory_metadata (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'cr607_inv', 'Crisis inventory metadata', 'standby', 'shield-alert', 'Standby',
    'crisis_inventory_metadata', 'phase607_crisis_mode',
    'Phase 607 — crisis mode inventory policy cross-link.',
    '{"phase607_ref":"crisis_mode"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_client_relationship_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'crm611_link', 'Client relationship link', 'linked', 'users', 'Linked',
    'client_relationship_links', 'phase611_client_relationship',
    'Phase 611 — client-specific product preferences and history metadata.',
    '{"phase611_ref":"client_relationship"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_revenue_ops_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'rev588_link', 'Revenue operations link', 'linked', 'trending-up', 'Linked',
    'revenue_ops_links', 'phase588_revenue_ops',
    'Phase 588 — margin and revenue signal integration.',
    '{"phase588_ref":"revenue_operations"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_low_stock_alerts (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, priority, quantity, unit_label, summary, metadata
  ) values (
    p_org_id, 'low_shampoo', 'Shampoo 500ml — low stock', 'open', 'alert-triangle', 'Low stock',
    'low_stock_alerts', 'important', 6, 'each',
    'Below reorder point at Main Salon — review purchase request.',
    '{"product_key":"prod_shampoo_500","reorder_point":10}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_inv613_purchase_requests (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, quantity, unit_label, summary, metadata
  ) values (
    p_org_id, 'pr_shampoo_q2', 'Reorder shampoo — Q2', 'approval_required', 'clock', 'Approval required',
    'purchase_requests', 24, 'each',
    'Purchase request awaiting approval — supplier via Phase 584 vendor link.',
    '{"supplier_ref":"phase584"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  perform public._inv613_log(p_org_id, 'inventory_center_seeded', 'Inventory center baseline seeded — Phase 613.');
end; $$;

create or replace function public.get_organization_inventory_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_domain text;
  v_overview jsonb;
  v_all_sections jsonb := '{}'::jsonb;
  v_audit jsonb;
  v_rows jsonb;
begin
  v_org_id := public._inv613_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._inv613_ensure_settings(v_org_id);
  perform public._inv613_seed(v_org_id);
  perform public._inv613_log(v_org_id, 'center_view', 'Inventory Center viewed — section ' || v_section);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_products', (select count(*) from public.organization_inv613_product_master where organization_id = v_org_id),
    'total_locations', (select count(*) from public.organization_inv613_location_registry where organization_id = v_org_id),
    'low_stock_count', (select count(*) from public.organization_inv613_low_stock_alerts where organization_id = v_org_id and record_status = 'open'),
    'quarantined_count', (select count(*) from public.organization_inv613_quarantined_stock where organization_id = v_org_id),
    'pending_purchase_requests', (select count(*) from public.organization_inv613_purchase_requests where organization_id = v_org_id and record_status = 'approval_required'),
    'open_purchase_orders', (select count(*) from public.organization_inv613_purchase_orders where organization_id = v_org_id and record_status in ('draft', 'approved')),
    'pending_receiving', (select count(*) from public.organization_inv613_receiving_orders where organization_id = v_org_id and record_status = 'pending'),
    'active_transfers', (select count(*) from public.organization_inv613_stock_transfers where organization_id = v_org_id and record_status = 'pending'),
    'active_reservations', (select count(*) from public.organization_inv613_service_reservations where organization_id = v_org_id and record_status = 'active'),
    'open_stock_counts', (select count(*) from public.organization_inv613_stock_counts where organization_id = v_org_id and record_status = 'open'),
    'expiry_alerts', (select count(*) from public.organization_inv613_expiry_alerts where organization_id = v_org_id),
    'checkout_guard_enforced', (select checkout_failure_guard_enabled from public.organization_inv613_settings where organization_id = v_org_id),
    'never_sell_expired', (select never_sell_expired from public.organization_inv613_settings where organization_id = v_org_id)
  ) into v_overview;

  foreach v_domain in array array['inventory_scopes', 'domain_assignments', 'location_registry', 'storage_zones', 'vehicle_stock_locations', 'employee_kits', 'item_types', 'product_master', 'product_variants', 'product_categories', 'units_of_measure', 'unit_conversions', 'product_status_catalog', 'consumable_items', 'consumable_categories', 'stock_quantities', 'stock_status_catalog', 'available_stock', 'reserved_stock', 'incoming_stock', 'quarantined_stock', 'stock_allocations', 'location_stock', 'zone_stock', 'stock_movements', 'stock_ledger', 'movement_types', 'consumption_recipes', 'recipe_ingredients', 'actual_consumption', 'appointment_forecasts', 'appointment_readiness', 'service_reservations', 'appointment_stock_links', 'consumption_variance', 'checkout_deductions', 'checkout_failure_guard', 'product_returns', 'refund_without_return', 'checkout_stock_links', 'pos_inventory_integration', 'product_bundles', 'bundle_components', 'service_kits', 'equipment_register', 'equipment_reservations', 'equipment_maintenance', 'serial_numbers', 'batch_lots', 'expiry_tracking', 'fefo_fifo_rules', 'opened_products', 'quarantine_records', 'recall_records', 'lot_traceability', 'expiry_alerts', 'low_stock_alerts', 'reorder_points', 'reorder_suggestions', 'auto_purchasing_rules', 'governed_auto_purchase', 'supplier_lead_times', 'purchase_requests', 'purchase_request_approvals', 'purchase_orders', 'po_line_items', 'supplier_integration_links', 'vendor_catalog_links', 'po_approval_workflow', 'po_status_catalog', 'receiving_orders', 'partial_receiving', 'unplanned_receiving', 'quality_checks', 'receiving_differences', 'supplier_returns', 'receiving_assistant_meta', 'receiving_status_catalog', 'stock_transfers', 'transfer_requests', 'emergency_transfers', 'transfer_recommendations', 'stock_counts', 'blind_counts', 'double_counts', 'count_adjustments', 'inventory_adjustments', 'waste_records', 'service_waste', 'waste_reasons', 'demand_forecasts', 'vacation_inventory_continuity', 'appointment_demand_links', 'crisis_inventory_metadata', 'emergency_stock_policies', 'client_relationship_links', 'revenue_ops_links', 'fiken_accounting_prep', 'inventory_valuation', 'cost_layers', 'landed_costs', 'margin_signals', 'service_consumable_costs', 'reorder_budgets', 'companion_advisor_meta', 'mobile_inventory_meta', 'offline_handling', 'import_export_jobs', 'inventory_api_meta', 'event_bus_links', 'since_last_login_meta', 'inventory_analytics', 'access_control', 'segregation_rules', 'inventory_policies', 'policy_acknowledgements', 'inventory_reports', 'section_registry'] loop
    v_all_sections := v_all_sections || jsonb_build_object(v_domain, public._inv613_section_rows(v_org_id, v_domain));
  end loop;

  v_domain := case v_section
    when 'products' then 'product_master'
    when 'consumables' then 'consumable_items'
    when 'stock' then 'stock_quantities'
    when 'locations' then 'location_registry'
    when 'reservations' then 'service_reservations'
    when 'purchase_requests' then 'purchase_requests'
    when 'purchase_orders' then 'purchase_orders'
    when 'suppliers' then 'supplier_integration_links'
    when 'receiving' then 'receiving_orders'
    when 'transfers' then 'stock_transfers'
    when 'stock_counts' then 'stock_counts'
    when 'adjustments' then 'inventory_adjustments'
    when 'waste' then 'waste_records'
    when 'returns' then 'product_returns'
    when 'equipment' then 'equipment_register'
    when 'forecasting' then 'demand_forecasts'
    when 'policies' then 'inventory_policies'
    when 'reports' then 'inventory_reports'
    else 'product_master'
  end;

  v_rows := case when v_section = 'overview' then public._inv613_section_rows(v_org_id, 'product_master')
    else public._inv613_section_rows(v_org_id, v_domain) end;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_inv613_audit_logs where organization_id = v_org_id order by created_at desc limit 20) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'engine', 'inventory_operations_phase613',
    'principle', 'What you have. Where it is. What services consume. What to reorder — Aipify prepares; humans decide.',
    'privacy_note', 'Inventory metadata only — no customer PII in stock records.',
    'companion_identity', 'Companion Inventory Advisor',
    'organization', v_org,
    'settings', (select to_jsonb(s) from public.organization_inv613_settings s where s.organization_id = v_org_id),
    'overview', v_overview,
    'stock_status_defs', coalesce((select jsonb_agg(public._inv613_status_presentation(d.status_key) order by d.status_key)
      from public.inv613_stock_status_defs d), '[]'::jsonb),
    'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
      'section_key', d.section_key, 'section_number', d.section_number, 'domain_key', d.domain_key,
      'section_title', d.section_title, 'summary', d.summary
    ) order by d.section_number) from public.inv613_section_defs d), '[]'::jsonb),
    'section_count', 120,
    'products', public._inv613_section_rows(v_org_id, 'product_master'),
    'consumables', public._inv613_section_rows(v_org_id, 'consumable_items'),
    'stock', public._inv613_section_rows(v_org_id, 'stock_quantities'),
    'locations', public._inv613_section_rows(v_org_id, 'location_registry'),
    'reservations', public._inv613_section_rows(v_org_id, 'service_reservations'),
    'purchase_requests', public._inv613_section_rows(v_org_id, 'purchase_requests'),
    'purchase_orders', public._inv613_section_rows(v_org_id, 'purchase_orders'),
    'suppliers', public._inv613_section_rows(v_org_id, 'supplier_integration_links'),
    'receiving', public._inv613_section_rows(v_org_id, 'receiving_orders'),
    'transfers', public._inv613_section_rows(v_org_id, 'stock_transfers'),
    'stock_counts', public._inv613_section_rows(v_org_id, 'stock_counts'),
    'adjustments', public._inv613_section_rows(v_org_id, 'inventory_adjustments'),
    'waste', public._inv613_section_rows(v_org_id, 'waste_records'),
    'returns', public._inv613_section_rows(v_org_id, 'product_returns'),
    'equipment', public._inv613_section_rows(v_org_id, 'equipment_register'),
    'forecasting', public._inv613_section_rows(v_org_id, 'demand_forecasts'),
    'policies', public._inv613_section_rows(v_org_id, 'inventory_policies'),
    'low_stock_alerts', public._inv613_section_rows(v_org_id, 'low_stock_alerts'),
    'reorder_suggestions', public._inv613_section_rows(v_org_id, 'reorder_suggestions'),
    'integrations', jsonb_build_object(
      'phase584_suppliers', public._inv613_section_rows(v_org_id, 'supplier_integration_links'),
      'phase606_vacation', public._inv613_section_rows(v_org_id, 'vacation_inventory_continuity'),
      'phase610_appointments', public._inv613_section_rows(v_org_id, 'appointment_forecasts'),
      'phase612_checkout', public._inv613_section_rows(v_org_id, 'checkout_failure_guard'),
      'phase611_clients', public._inv613_section_rows(v_org_id, 'client_relationship_links'),
      'phase588_revenue', public._inv613_section_rows(v_org_id, 'revenue_ops_links'),
      'phase607_crisis', public._inv613_section_rows(v_org_id, 'crisis_inventory_metadata'),
      'phase591_event_bus', public._inv613_section_rows(v_org_id, 'event_bus_links')
    ),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review low stock shampoo', 'reason', 'Main Salon below reorder point — purchase request ready.', 'effort', 'low', 'route', '/app/inventory/purchase-requests'),
      jsonb_build_object('title', 'Confirm appointment stock readiness', 'reason', 'Tomorrow appointments forecast 12 service consumable units.', 'effort', 'routine', 'route', '/app/inventory/reservations'),
      jsonb_build_object('title', 'Receiving quality check pending', 'reason', 'One receiving order awaits quality verification.', 'effort', 'low', 'route', '/app/inventory/receiving')
    ),
    'sections', v_all_sections,
    'rows', v_rows,
    'audit_recent', v_audit,
    'since_last_login', coalesce((select jsonb_build_object(
      'low_stock_count', s.pending_purchase_requests,
      'pending_receiving', s.pending_receiving,
      'summary', 'Inventory changes since your last visit.'
    ) from (
      select
        (select count(*) from public.organization_inv613_low_stock_alerts where organization_id = v_org_id and record_status = 'open') as pending_purchase_requests,
        (select count(*) from public.organization_inv613_receiving_orders where organization_id = v_org_id and record_status = 'pending') as pending_receiving
    ) s), '{}'::jsonb),
    'reports', jsonb_build_object(
      'section_count', 120,
      'audit_entries', (select count(*) from public.organization_inv613_audit_logs where organization_id = v_org_id)
    ),
    'routes', jsonb_build_object(
      'center', '/app/inventory',
      'products', '/app/inventory/products',
      'purchase_requests', '/app/inventory/purchase-requests',
      'purchase_orders', '/app/inventory/purchase-orders',
      'receiving', '/app/inventory/receiving',
      'procurement_vendors', '/app/procurement'
    )
  );
end; $$;

create or replace function public.get_aipify_companion_inventory_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_overview jsonb;
begin
  v_center := public.get_organization_inventory_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_overview := v_center->'overview';

  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Inventory Advisor',
    'companion_identity', 'Companion Inventory Advisor',
    'principle', 'Aipify observes stock levels, service consumption, and replenishment needs — humans approve purchases and adjustments.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'low_stock',
        'observation', format('%s item(s) below reorder point.', v_overview->>'low_stock_count'),
        'impact', 'Service appointments may lack consumables if not replenished.',
        'recommendation', 'Review purchase requests and approve replenishment.',
        'effort', 'low',
        'href', '/app/inventory/purchase-requests'
      ),
      jsonb_build_object(
        'key', 'appointment_readiness',
        'observation', 'Appointment stock forecast available for upcoming services.',
        'impact', 'Unprepared stock affects service delivery quality.',
        'recommendation', 'Confirm reservations and transfer stock to service locations.',
        'effort', 'routine',
        'href', '/app/inventory/reservations'
      ),
      jsonb_build_object(
        'key', 'checkout_guard',
        'observation', 'Checkout failure guard active — stock never deducted on failed checkout.',
        'impact', 'Inventory accuracy preserved during Phase 612 checkout.',
        'recommendation', 'No action required — guard is enforced.',
        'effort', 'none',
        'href', '/app/inventory/policies'
      ),
      jsonb_build_object(
        'key', 'quarantine',
        'observation', format('%s quarantined stock record(s).', v_overview->>'quarantined_count'),
        'impact', 'Quarantined and expired stock cannot be sold.',
        'recommendation', 'Review quarantine records and approve disposition.',
        'effort', 'medium',
        'href', '/app/inventory/stock'
      )
    ),
    'receiving_assistant', jsonb_build_object(
      'title', 'Companion Receiving Assistant',
      'principle', 'Aipify prepares receiving checklists and highlights differences — staff confirm quality.',
      'route', '/app/inventory/receiving'
    ),
    'center', v_center
  );
end; $$;

create or replace function public.get_organization_inventory_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  v_center := public.get_organization_inventory_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  return jsonb_build_object(
    'found', true,
    'route', '/app/inventory',
    'companion_identity', 'Companion Inventory Advisor',
    'overview', v_center->'overview',
    'low_stock_alerts', v_center->'low_stock_alerts',
    'companion_recommendations', v_center->'companion_recommendations'
  );
end; $$;

-- Business Pack registration
insert into public.aipify_marketplace_operations_catalog (
  pack_key, pack_name, description, category, industry_key, version,
  starting_price_monthly, trial_days, dependencies, is_featured, sort_order, release_notes
) values (
  'inventory_service_supplies_pack',
  'Inventory & Service Supplies Pack',
  'Service inventory, consumables, multi-location stock, purchasing, and receiving for operations teams.',
  'operations',
  null,
  '1.0.0',
  249.00,
  14,
  '["inventory_pack","supplier_pack"]'::jsonb,
  true,
  16,
  'Phase 613 — full service inventory, consumables, purchasing, and receiving for operations teams.'
) on conflict (pack_key) do update set
  pack_name = excluded.pack_name,
  description = excluded.description,
  version = excluded.version,
  release_notes = excluded.release_notes;

grant execute on function public.get_organization_inventory_center(text) to authenticated;
grant execute on function public.get_aipify_companion_inventory_advisor_bundle() to authenticated;
grant execute on function public.get_organization_inventory_mobile_summary() to authenticated;

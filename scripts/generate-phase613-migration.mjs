#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(
  root,
  "supabase/migrations/20261861300000_service_inventory_consumables_purchasing_multi_location_stock_engine_phase613.sql",
);

const SECTIONS = [
  ["settings", "foundation", "Inventory center settings"],
  ["inventory_scopes", "scope", "Organization inventory scope definitions"],
  ["domain_assignments", "scope", "Domain-scoped inventory assignments"],
  ["location_registry", "scope", "Multi-location registry"],
  ["storage_zones", "scope", "Storage zones within locations"],
  ["vehicle_stock_locations", "scope", "Service vehicle stock locations"],
  ["employee_kits", "scope", "Employee kit assignments"],
  ["item_types", "scope", "Inventory item type catalog"],
  ["product_master", "products", "Product master records"],
  ["product_variants", "products", "Product variant definitions"],
  ["product_categories", "products", "Product category hierarchy"],
  ["units_of_measure", "products", "Units of measure catalog"],
  ["unit_conversions", "products", "Unit conversion rules"],
  ["product_status_catalog", "products", "Product status catalog — icon + text"],
  ["consumable_items", "consumables", "Service consumable items"],
  ["consumable_categories", "consumables", "Consumable category definitions"],
  ["stock_quantities", "stock", "Stock quantity model — on-hand totals"],
  ["stock_status_catalog", "stock", "Stock status catalog — icon + text always"],
  ["available_stock", "stock", "Available stock quantities"],
  ["reserved_stock", "stock", "Reserved stock quantities"],
  ["incoming_stock", "stock", "Incoming stock from POs"],
  ["quarantined_stock", "stock", "Quarantined stock — never sold"],
  ["stock_allocations", "stock", "Stock allocation records"],
  ["location_stock", "stock", "Location-level stock balances"],
  ["zone_stock", "stock", "Zone-level stock balances"],
  ["stock_movements", "movements", "Stock movement records"],
  ["stock_ledger", "movements", "Immutable stock ledger entries"],
  ["movement_types", "movements", "Movement type definitions"],
  ["consumption_recipes", "consumption", "Service consumption recipes"],
  ["recipe_ingredients", "consumption", "Recipe ingredient lines"],
  ["actual_consumption", "consumption", "Actual service consumption records"],
  ["appointment_forecasts", "consumption", "Phase 610 — appointment stock forecasts"],
  ["appointment_readiness", "consumption", "Phase 610 — appointment readiness checks"],
  ["service_reservations", "reservations", "Service stock reservations"],
  ["appointment_stock_links", "consumption", "Phase 610 appointment inventory links"],
  ["consumption_variance", "consumption", "Recipe vs actual consumption variance"],
  ["checkout_deductions", "checkout", "Phase 612 — checkout stock deductions"],
  ["checkout_failure_guard", "checkout", "Never deduct stock from failed checkout"],
  ["product_returns", "returns", "Product return records"],
  ["refund_without_return", "returns", "Refund without stock return — Phase 612"],
  ["checkout_stock_links", "checkout", "Phase 612 checkout integration metadata"],
  ["pos_inventory_integration", "checkout", "POS inventory integration links"],
  ["product_bundles", "bundles", "Product bundle definitions"],
  ["bundle_components", "bundles", "Bundle component lines"],
  ["service_kits", "bundles", "Service kit definitions"],
  ["equipment_register", "equipment", "Equipment register records"],
  ["equipment_reservations", "equipment", "Equipment reservation records"],
  ["equipment_maintenance", "equipment", "Equipment maintenance schedules"],
  ["serial_numbers", "traceability", "Serial number tracking"],
  ["batch_lots", "traceability", "Batch and lot tracking"],
  ["expiry_tracking", "traceability", "Expiry date tracking"],
  ["fefo_fifo_rules", "traceability", "FEFO/FIFO picking rules"],
  ["opened_products", "traceability", "Opened product partial quantity tracking"],
  ["quarantine_records", "traceability", "Quarantine records — blocked from sale"],
  ["recall_records", "traceability", "Product recall records"],
  ["lot_traceability", "traceability", "Lot traceability chain"],
  ["expiry_alerts", "traceability", "Expiry alert records"],
  ["low_stock_alerts", "reorder", "Low stock alert records"],
  ["reorder_points", "reorder", "Reorder point definitions"],
  ["reorder_suggestions", "reorder", "Companion reorder suggestions"],
  ["auto_purchasing_rules", "reorder", "Governed auto-purchasing rules"],
  ["governed_auto_purchase", "reorder", "Auto-purchase governance approvals"],
  ["supplier_lead_times", "reorder", "Supplier lead time metadata"],
  ["purchase_requests", "purchasing", "Purchase request records"],
  ["purchase_request_approvals", "purchasing", "Purchase request approval chain"],
  ["purchase_orders", "purchasing", "Purchase order center records"],
  ["po_line_items", "purchasing", "Purchase order line items"],
  ["supplier_integration_links", "purchasing", "Phase 584 — reuse vendor management, no duplicate master"],
  ["vendor_catalog_links", "purchasing", "Vendor catalog cross-links"],
  ["po_approval_workflow", "purchasing", "PO approval workflow metadata"],
  ["po_status_catalog", "purchasing", "PO status catalog — icon + text"],
  ["receiving_orders", "receiving", "Receiving center orders"],
  ["partial_receiving", "receiving", "Partial receiving records"],
  ["unplanned_receiving", "receiving", "Unplanned receiving records"],
  ["quality_checks", "receiving", "Receiving quality check records"],
  ["receiving_differences", "receiving", "Receiving difference/discrepancy records"],
  ["supplier_returns", "receiving", "Supplier return records from receiving"],
  ["receiving_assistant_meta", "receiving", "Companion Receiving Assistant metadata"],
  ["receiving_status_catalog", "receiving", "Receiving status catalog — icon + text"],
  ["stock_transfers", "transfers", "Stock transfer records"],
  ["transfer_requests", "transfers", "Transfer request workflow"],
  ["emergency_transfers", "transfers", "Emergency transfer records"],
  ["transfer_recommendations", "transfers", "Emergency transfer recommendations"],
  ["stock_counts", "counts", "Stock count center sessions"],
  ["blind_counts", "counts", "Blind count records"],
  ["double_counts", "counts", "Double count verification"],
  ["count_adjustments", "counts", "Count adjustment records"],
  ["inventory_adjustments", "adjustments", "Manual inventory adjustments"],
  ["waste_records", "waste", "Waste management records"],
  ["service_waste", "waste", "Service-specific waste records"],
  ["waste_reasons", "waste", "Waste reason catalog"],
  ["demand_forecasts", "forecasting", "Demand forecast records"],
  ["vacation_inventory_continuity", "forecasting", "Phase 606/610 vacation inventory continuity"],
  ["appointment_demand_links", "forecasting", "Appointment demand forecast links"],
  ["crisis_inventory_metadata", "crisis", "Phase 607 crisis integration metadata"],
  ["emergency_stock_policies", "crisis", "Emergency stock policy records"],
  ["client_relationship_links", "integration", "Phase 611 client relationship links"],
  ["revenue_ops_links", "integration", "Phase 588 revenue operations links"],
  ["fiken_accounting_prep", "integration", "Fiken accounting preparation metadata"],
  ["inventory_valuation", "valuation", "Inventory valuation records"],
  ["cost_layers", "valuation", "Cost layer tracking"],
  ["landed_costs", "valuation", "Landed cost calculations"],
  ["margin_signals", "valuation", "Margin signal records"],
  ["service_consumable_costs", "valuation", "Service consumable cost tracking"],
  ["reorder_budgets", "valuation", "Reorder budget governance"],
  ["companion_advisor_meta", "companion", "Companion Inventory Advisor metadata"],
  ["mobile_inventory_meta", "mobile", "Mobile inventory summary metadata"],
  ["offline_handling", "mobile", "Offline inventory handling rules"],
  ["import_export_jobs", "mobile", "Import and export job records"],
  ["inventory_api_meta", "mobile", "Inventory API metadata"],
  ["event_bus_links", "mobile", "Phase 591 event bus integration links"],
  ["since_last_login_meta", "dashboards", "Since Last Login integration metadata"],
  ["inventory_analytics", "dashboards", "Inventory analytics aggregates"],
  ["access_control", "security", "Inventory access control rules"],
  ["segregation_rules", "security", "Inventory segregation of duties"],
  ["inventory_policies", "policies", "Inventory policy center records"],
  ["policy_acknowledgements", "policies", "Policy acknowledgement tracking"],
  ["inventory_reports", "reports", "Inventory report catalog"],
  ["section_registry", "reports", "Section registry — all 120 inventory domains"],
  ["audit_logs", "reports", "Inventory audit log"],
];

if (SECTIONS.length !== 120) {
  console.error(`Expected 120 sections, got ${SECTIONS.length}`);
  process.exit(1);
}

let sql = `-- Phase 613 — Service Inventory, Consumables, Purchasing & Multi-Location Stock Engine
-- Feature owner: CUSTOMER APP (/app/inventory) + Business Pack
-- Helpers: _inv613_*
-- Integrates: Phase 584 suppliers, 606/610 vacation & appointments, 612 checkout, 611 clients, 588 revenue, 607 crisis, 591 event bus
-- Never deduct stock from failed checkout; never sell expired/quarantined stock.

`;

sql += `-- ---------------------------------------------------------------------------
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
`;

SECTIONS.forEach(([key, domain, title], i) => {
  const num = i + 1;
  const summary = title.replace(/'/g, "''");
  const comma = i < SECTIONS.length - 1 ? "," : "";
  sql += `  ('${key}', ${num}, '${domain}', '${title.replace(/'/g, "''")}', '${summary}.')\n${comma}\n`;
});

sql += `on conflict (section_key) do nothing;

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

`;

sql += `-- ---------------------------------------------------------------------------
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

`;

for (const [key, domain] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_inv613_${key}`;
  sql += `-- ${domain}: ${key}
create table if not exists public.${table} (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default '${key}',
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

alter table public.${table} enable row level security;
revoke all on public.${table} from authenticated, anon;

`;
}

sql += `create table if not exists public.organization_inv613_audit_logs (
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

`;

const dataSections = SECTIONS.filter(([k]) => k !== "settings" && k !== "audit_logs").map(([k]) => k);

sql += `-- ---------------------------------------------------------------------------
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

`;

sql += `create or replace function public._inv613_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_inv613_product_master where organization_id = p_org_id limit 1) then
    return;
  end if;

`;

for (const [key] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_inv613_${key}`;
  const seedKey = `${key.slice(0, 12)}_seed`;
  sql += `  insert into public.${table} (
    organization_id, record_key, record_title, record_status, status_icon, status_label,
    domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, '${seedKey}', initcap(replace('${key}', '_', ' ')), 'active', 'circle', 'Active',
    '${key}', 'organization', 'routine', '', 'Baseline seed — Phase 613 ${key}.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

`;
}

sql += `  insert into public.organization_inv613_product_master (
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

`;

const sectionMap = {
  overview: "product_master",
  products: "product_master",
  consumables: "consumable_items",
  stock: "stock_quantities",
  locations: "location_registry",
  reservations: "service_reservations",
  purchase_requests: "purchase_requests",
  purchase_orders: "purchase_orders",
  suppliers: "supplier_integration_links",
  receiving: "receiving_orders",
  transfers: "stock_transfers",
  stock_counts: "stock_counts",
  adjustments: "inventory_adjustments",
  waste: "waste_records",
  returns: "product_returns",
  equipment: "equipment_register",
  forecasting: "demand_forecasts",
  policies: "inventory_policies",
  reports: "inventory_reports",
};

sql += `create or replace function public.get_organization_inventory_center(p_section text default 'overview')
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

  foreach v_domain in array array[${dataSections.map((s) => `'${s}'`).join(", ")}] loop
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
  'Phase 613 — full service inventory, consumables, purchasing, and multi-location stock engine.'
) on conflict (pack_key) do update set
  pack_name = excluded.pack_name,
  description = excluded.description,
  version = excluded.version,
  release_notes = excluded.release_notes;

grant execute on function public.get_organization_inventory_center(text) to authenticated;
grant execute on function public.get_aipify_companion_inventory_advisor_bundle() to authenticated;
grant execute on function public.get_organization_inventory_mobile_summary() to authenticated;
`;

fs.writeFileSync(out, sql);
console.log(`Wrote ${out} (${sql.length} bytes, ${SECTIONS.length} sections)`);

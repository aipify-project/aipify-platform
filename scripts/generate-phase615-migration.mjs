#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(
  root,
  "supabase/migrations/20261861500000_service_pricing_costing_margin_profitability_engine_phase615.sql",
);

/** 41 sections — settings + 39 domains + audit_logs */
const SECTIONS = [
  ["settings", "Profitability engine settings"],
  ["service_cost_profiles", "Service cost profiles with versioning"],
  ["service_cost_versions", "Service cost profile version history"],
  ["price_profiles", "Price profiles with versioning"],
  ["price_profile_versions", "Price profile version history"],
  ["location_cost_models", "Location cost models with versioning"],
  ["location_cost_versions", "Location cost model version history"],
  ["allocation_rules", "Overhead allocation rules"],
  ["cost_pools", "Cost pools for overhead allocation"],
  ["allocation_drivers", "Allocation drivers and weights"],
  ["margin_results", "Margin calculation results — data quality tagged"],
  ["margin_result_versions", "Margin result version history"],
  ["price_recommendations", "Price recommendation engine outputs"],
  ["scenarios", "Profitability scenario definitions"],
  ["scenario_variants", "Scenario Lab variant runs"],
  ["profitability_exceptions", "Profitability exception queue"],
  ["profitability_policies", "Profitability policy definitions"],
  ["calculation_queue", "Margin calculation queue status"],
  ["service_profitability_cards", "Service profitability cards"],
  ["overhead_allocation_engine", "Overhead Allocation Engine route metadata"],
  ["price_recommendation_engine", "Price Recommendation Engine route metadata"],
  ["scenario_lab", "Scenario Lab route metadata"],
  ["exception_center", "Exception Center route metadata"],
  ["policy_center", "Policy Center route metadata"],
  ["forecasts", "Profitability forecasts — estimates not audited profit"],
  ["customer_profitability", "Customer segment profitability"],
  ["employee_profitability", "Employee contribution profitability"],
  ["product_profitability", "Product profitability signals"],
  ["resource_profitability", "Resource utilization profitability"],
  ["recommendations", "Companion profitability recommendations"],
  ["approvals", "Price and margin approval workflow"],
  ["reports_catalog", "Profitability reports catalog"],
  ["companion_advisor", "Companion Profitability Advisor metadata"],
  ["data_quality_catalog", "Verified vs estimated vs incomplete data quality"],
  ["profitability_status_catalog", "Profitability status catalog — icon + text always"],
  ["phase610_booking_connection", "Phase 610 booking revenue connection — consume only"],
  ["phase612_checkout_connection", "Phase 612 checkout verified revenue connection"],
  ["phase613_inventory_connection", "Phase 613 inventory consumable cost connection"],
  ["phase614_labor_connection", "Phase 614 labor cost signals connection"],
  ["integration_hub", "Cross-phase integration hub references"],
  ["audit_logs", "Profitability audit log"],
];

if (SECTIONS.length !== 41) {
  console.error(`Expected 41 sections, got ${SECTIONS.length}`);
  process.exit(1);
}

const UI_SECTION_MAP = {
  services: "service_cost_profiles",
  pricing: "price_recommendation_engine",
  costs: "service_cost_versions",
  margins: "margin_results",
  employees: "employee_profitability",
  locations: "location_cost_models",
  resources: "resource_profitability",
  products: "product_profitability",
  customers: "customer_profitability",
  forecasts: "forecasts",
  scenarios: "scenario_lab",
  recommendations: "recommendations",
  approvals: "approvals",
  policies: "policy_center",
  reports: "reports_catalog",
  allocations: "overhead_allocation_engine",
  exceptions: "exception_center",
};

let sql = `-- Phase 615 — Service Pricing, Costing, Margin & Profitability Engine
-- Feature owner: CUSTOMER APP (/app/profitability)
-- Helpers: _prof615_*
-- NOT audited financial statements — verified vs estimated vs incomplete always explicit
-- Integrates Phase 610/612/613/614 — does not duplicate booking, checkout, inventory, compensation

`;

sql += `-- ---------------------------------------------------------------------------
-- Section registry
-- ---------------------------------------------------------------------------
create table if not exists public.prof615_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 39),
  domain_key text not null,
  section_title text not null,
  summary text not null default '' check (char_length(summary) <= 500)
);

`;

let sectionNum = 0;
SECTIONS.forEach(([key, desc]) => {
  if (key === "settings" || key === "audit_logs") return;
  sectionNum += 1;
  const title = desc.split("—")[0].trim().replace(/ —.*/, "");
  sql += `insert into public.prof615_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('${key}', ${sectionNum}, '${key}', '${title.replace(/'/g, "''")}', '${desc.replace(/'/g, "''")}')
on conflict (section_key) do nothing;

`;
});

sql += `create table if not exists public.prof615_profitability_status_defs (
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

`;

sql += `-- ---------------------------------------------------------------------------
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

`;

for (const [key, desc] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_prof615_${key}`;
  sql += `-- ${desc}
create table if not exists public.${table} (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_status text not null default 'active',
  status_icon text not null default 'circle',
  status_label text not null default 'Active',
  domain_key text not null default '${key}',
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

alter table public.${table} enable row level security;
revoke all on public.${table} from authenticated, anon;

`;
}

sql += `create table if not exists public.organization_prof615_audit_logs (
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

`;

sql += `-- ---------------------------------------------------------------------------
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

`;

sql += `create or replace function public._prof615_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_prof615_service_cost_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  perform public._prof615_ensure_settings(p_org_id);

`;

for (const [key] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_prof615_${key}`;
  const seedKey = key.replace(/_/g, "").slice(0, 12);
  sql += `  insert into public.${table} (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, service_label, summary, data_quality, metadata
  ) values (
    p_org_id, '${seedKey}_base', initcap(replace('${key}', '_', ' ')), 'active', 'circle', 'Active', '${key}', 'organization', 'Signature Service',
    'Baseline seed — Phase 615 ${key}.', 'estimated', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

`;
}

sql += `  insert into public.organization_prof615_service_cost_profiles (
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

`;

sql += `create or replace function public._prof615_section_rows(p_org_id uuid, p_domain text)
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

`;

const rowsCase = Object.entries(UI_SECTION_MAP)
  .map(([ui, domain]) => `    when '${ui}' then v_rows := public._prof615_section_rows(v_org_id, '${domain}');`)
  .join("\n");

sql += `create or replace function public.get_organization_profitability_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_prof615_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._prof615_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._prof615_seed(v_org_id);
  select * into v_settings from public.organization_prof615_settings where organization_id = v_org_id;

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
${rowsCase}
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
  perform public._prof615_ensure_settings(v_org_id);
  select * into v_settings from public.organization_prof615_settings where organization_id = v_org_id;
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

`;

fs.writeFileSync(out, sql);
console.log(`Wrote ${out} (${sql.length} bytes)`);

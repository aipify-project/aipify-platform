#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(
  root,
  "supabase/migrations/20261861400000_employee_compensation_commission_tips_payroll_input_engine_phase614.sql",
);

/** 96 sections — settings + 94 domains + audit_logs */
const SECTIONS = [
  ["settings", "Compensation engine settings"],
  ["compensation_profiles", "Employee compensation profiles"],
  ["compensation_models", "Compensation models (salary, hourly, commission, hybrid)"],
  ["effective_dated_rules", "Effective-dated compensation rules"],
  ["rule_hierarchy", "Rule hierarchy global→dept→role→location→service→employee"],
  ["commission_plans", "Commission plans catalog"],
  ["commission_types", "Commission type definitions"],
  ["commission_basis", "Commission basis (revenue, margin, units)"],
  ["commission_eligibility", "Commission eligibility rules"],
  ["growth_partner_separation", "Growth Partner separation — never mix with employee payroll"],
  ["service_commission", "Service commission rules"],
  ["product_commission", "Product commission rules"],
  ["membership_commission", "Membership commission rules"],
  ["package_commission", "Package commission rules"],
  ["rebooking_commission", "Rebooking commission rules"],
  ["new_customer_commission", "New customer commission rules"],
  ["multi_employee_commission", "Multi-employee commission splits"],
  ["team_commission", "Team commission pools"],
  ["tiered_commission", "Tiered commission schedules"],
  ["commission_caps", "Commission caps"],
  ["commission_floors", "Commission floors"],
  ["discount_impact_rules", "Discount impact on commission"],
  ["refund_impact_rules", "Refund impact on commission"],
  ["partial_refund_rules", "Partial refund commission rules"],
  ["cancellation_impact_rules", "Cancellation impact on commission"],
  ["chargeback_impact_rules", "Chargeback impact on commission"],
  ["commission_ledger", "Immutable commission ledger entries"],
  ["commission_status_catalog", "Commission status catalog — icon + text always"],
  ["pos612_tip_collection", "Phase 612 tip collection link — allocation only here"],
  ["tip_pools", "Tip pools for payroll input"],
  ["tip_distribution", "Tip distribution methods"],
  ["tip_refunds", "Tip refund handling"],
  ["cash_tips", "Cash tip declarations"],
  ["tip_privacy", "Tip privacy — aggregated analytics only"],
  ["bonus_rules", "Bonus engine rules"],
  ["manual_bonuses", "Manual bonus entries"],
  ["governed_deductions", "Governed deduction rules"],
  ["expense_input_links", "Expense input connection — consume Phase expense engine"],
  ["time609_connection", "Phase 609 approved hours/overtime/TOIL/on-call only"],
  ["payroll_periods", "Payroll periods"],
  ["payroll_input_records", "Payroll input records — not payroll processing"],
  ["payroll_categories", "Payroll input categories"],
  ["readiness_validation", "Payroll readiness validation checks"],
  ["payroll_exceptions", "Payroll exception queue"],
  ["approval_workflow", "Compensation approval workflow"],
  ["approval_segmentation", "Approval segmentation by team or role"],
  ["segregation_of_duties", "Segregation of duties rules"],
  ["employee_preview", "Employee compensation preview"],
  ["dispute_process", "Non-punitive dispute process"],
  ["corrections", "Compensation corrections"],
  ["retroactive_adjustments", "Retroactive adjustments"],
  ["period_locking", "Payroll period locking"],
  ["period_reopening", "Governed period reopening"],
  ["export_center", "Payroll export center metadata"],
  ["provider_mapping", "External payroll provider mapping"],
  ["export_versioning", "Export versioning"],
  ["reconciliation", "Payroll input reconciliation"],
  ["fiken_export_prep", "Fiken export signals prep"],
  ["cost_allocation", "Cost allocation metadata"],
  ["labor_cost_signals_615", "Phase 615 labor cost signals prep — no profitability calc"],
  ["contractor_input", "Contractor compensation input — separate from employees"],
  ["vacation606_integration", "Phase 606 vacation continuity integration"],
  ["continuity607_integration", "Phase 607 crisis continuity integration"],
  ["phase588_revenue_connection", "Phase 588 verified revenue connection"],
  ["phase610_booking_connection", "Phase 610 booking revenue connection"],
  ["phase611_crm_connection", "Phase 611 CRM/membership connection"],
  ["companion_advisor", "Companion Compensation Advisor metadata"],
  ["employee_dashboard", "Employee compensation dashboard"],
  ["manager_dashboard", "Manager compensation dashboard"],
  ["executive_dashboard", "Executive compensation dashboard"],
  ["since_last_login", "Since Last Login integration"],
  ["mobile_summary", "Mobile compensation summary"],
  ["notifications", "Compensation notifications"],
  ["access_control", "Access control — APP roles"],
  ["security_privacy", "Security and privacy governance"],
  ["retention_policies", "Retention policies"],
  ["compensation_policies", "Compensation policy center"],
  ["policy_acknowledgements", "Policy acknowledgement tracking"],
  ["legal_governance", "Legal governance and warnings"],
  ["analytics", "Compensation analytics — aggregate only"],
  ["fairness_review", "Fairness review — not surveillance"],
  ["reports_catalog", "Compensation reports catalog"],
  ["commission_plan_center", "Commission Plan Center route metadata"],
  ["payroll_period_center", "Payroll Period Center route metadata"],
  ["exception_center", "Exception Center route metadata"],
  ["policy_center", "Compensation Policy Center route metadata"],
  ["my_compensation_view", "Employee self-service my compensation view"],
  ["payroll_input_queue", "Payroll input readiness queue"],
  ["adjustment_ledger", "Adjustment ledger entries"],
  ["bonus_accruals", "Bonus accrual tracking"],
  ["tip_allocation_runs", "Tip allocation run records"],
  ["commission_events", "Commission-eligible event prep from checkout"],
  ["revenue_verification_signals", "Verified revenue signals from Phase 612"],
  ["rental616_boundary", "Phase 616 rental model boundary metadata only"],
  ["integration_hub", "Cross-phase integration hub references"],
  ["audit_logs", "Compensation audit log"],
];

if (SECTIONS.length !== 96) {
  console.error(`Expected 96 sections, got ${SECTIONS.length}`);
  process.exit(1);
}

const UI_SECTION_MAP = {
  overview: "commission_plans",
  employees: "compensation_profiles",
  compensation_plans: "commission_plans",
  commissions: "commission_ledger",
  tips: "tip_pools",
  bonuses: "bonus_rules",
  adjustments: "adjustment_ledger",
  payroll_periods: "payroll_periods",
  approvals: "approval_workflow",
  payroll_input: "payroll_input_records",
  exports: "export_center",
  reconciliation: "reconciliation",
  policies: "compensation_policies",
  reports: "reports_catalog",
  my_compensation: "my_compensation_view",
  plans: "commission_plan_center",
  exceptions: "payroll_exceptions",
};

let sql = `-- Phase 614 — Employee Compensation, Commission, Tips & Payroll Input Engine
-- Feature owner: CUSTOMER APP (/app/compensation)
-- Helpers: _cmp614_*
-- NOT a payroll system — prepares payroll INPUT only
-- Integrates Phase 588/609/610/611/612/606/607 — does not duplicate

`;

sql += `-- ---------------------------------------------------------------------------
-- Section registry (96 sections)
-- ---------------------------------------------------------------------------
create table if not exists public.cmp614_section_defs (
  section_key text primary key,
  section_number integer not null unique check (section_number between 1 and 96),
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
  sql += `insert into public.cmp614_section_defs (section_key, section_number, domain_key, section_title, summary) values
  ('${key}', ${sectionNum}, '${key}', '${title.replace(/'/g, "''")}', '${desc.replace(/'/g, "''")}')
on conflict (section_key) do nothing;

`;
});

sql += `create table if not exists public.cmp614_commission_status_defs (
  status_key text primary key,
  status_title text not null,
  icon_key text not null default 'circle',
  status_group text not null default 'workflow' check (
    status_group in ('workflow', 'commission', 'tip', 'bonus', 'payroll', 'approval', 'export')
  ),
  summary text not null default '' check (char_length(summary) <= 500)
);

insert into public.cmp614_commission_status_defs (status_key, status_title, icon_key, status_group, summary) values
  ('recorded', 'Recorded Work', 'edit', 'workflow', 'Work recorded — not yet approved.'),
  ('approved', 'Approved', 'check-circle', 'approval', 'Manager-approved work or revenue.'),
  ('verified_revenue', 'Verified Revenue', 'shield-check', 'commission', 'Payment verified — commission-eligible.'),
  ('commission_pending', 'Commission Pending', 'clock', 'commission', 'Commission calculated — awaiting approval.'),
  ('commission_approved', 'Commission Approved', 'badge-check', 'commission', 'Commission approved for payroll input.'),
  ('payroll_ready', 'Payroll Ready', 'briefcase', 'payroll', 'Validated for payroll export input.'),
  ('exported', 'Exported', 'upload', 'export', 'Payroll input exported to external provider.'),
  ('externally_processed', 'Externally Processed', 'external-link', 'export', 'Processed by external payroll — Aipify does not run payroll.'),
  ('disputed', 'Disputed', 'message-circle', 'workflow', 'Employee dispute — non-punitive review.'),
  ('locked', 'Locked', 'lock', 'payroll', 'Period locked — governed reopen only.')
on conflict (status_key) do nothing;

`;

sql += `-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_cmp614_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  compensation_center_enabled boolean not null default true,
  commission_plans_enabled boolean not null default true,
  tip_allocation_enabled boolean not null default true,
  bonus_engine_enabled boolean not null default true,
  payroll_input_enabled boolean not null default true,
  growth_partner_separation_enforced boolean not null default true,
  segregation_of_duties_required boolean not null default true,
  employee_preview_enabled boolean not null default true,
  dispute_process_enabled boolean not null default true,
  fiken_export_prep_enabled boolean not null default false,
  companion_advisor_enabled boolean not null default true,
  since_last_login_enabled boolean not null default true,
  mobile_summary_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_cmp614_settings enable row level security;
revoke all on public.organization_cmp614_settings from authenticated, anon;

`;

for (const [key, desc] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_cmp614_${key}`;
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
    scope_type in ('global', 'department', 'role', 'location', 'service', 'employee', 'organization')
  ),
  employee_label text not null default '',
  amount numeric(14,2),
  currency_code text not null default 'NOK',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
  period_label text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  immutable boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, record_key)
);

alter table public.${table} enable row level security;
revoke all on public.${table} from authenticated, anon;

`;
}

sql += `create table if not exists public.organization_cmp614_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'compensation',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_cmp614_audit_logs enable row level security;
revoke all on public.organization_cmp614_audit_logs from authenticated, anon;

`;

sql += `-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cmp614_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmp614_status(p_status_key text)
returns jsonb language sql stable set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'status_key', d.status_key, 'status_title', d.status_title,
      'icon_key', d.icon_key, 'status_group', d.status_group
    ) from public.cmp614_commission_status_defs d where d.status_key = p_status_key
  ), jsonb_build_object('status_key', p_status_key, 'status_title', p_status_key, 'icon_key', 'circle', 'status_group', 'workflow'));
$$;

create or replace function public._cmp614_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'compensation'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmp614_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'compensation'), left(coalesce(p_summary, ''), 500), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmp614_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_cmp614_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

`;

sql += `create or replace function public._cmp614_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_cmp614_commission_plans where organization_id = p_org_id limit 1) then
    return;
  end if;

  perform public._cmp614_ensure_settings(p_org_id);

`;

for (const [key] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_cmp614_${key}`;
  const seedKey = key.replace(/_/g, "").slice(0, 10);
  sql += `  insert into public.${table} (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, employee_label, summary, metadata
  ) values (
    p_org_id, '${seedKey}_base', initcap(replace('${key}', '_', ' ')), 'active', 'circle', 'Active', '${key}', 'organization', 'Primary Employee',
    'Baseline seed — Phase 614 ${key}.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

`;
}

sql += `  insert into public.organization_cmp614_growth_partner_separation (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'gp_separation', 'Growth Partner payroll separation', 'enforced', 'shield', 'Enforced', 'growth_partner_separation',
    'Growth Partner commissions never mix with employee payroll — attribution preserved.',
    '{"partner_attribution":true,"employee_payroll_isolated":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_commission_ledger (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, employee_label, amount, currency_code, period_label, immutable, summary, metadata
  ) values (
    p_org_id, 'cl_entry_1', 'Service commission — verified sale', 'commission_approved', 'badge-check', 'Commission approved', 'commission_ledger',
    'Primary Employee', 450.00, 'NOK', 'March 2026', true,
    'Immutable ledger entry — verified revenue from Phase 612 checkout.',
    '{"phase612_ref":"pos612","verified_revenue":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_pos612_tip_collection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'tips612_link', 'Phase 612 tip collection', 'linked', 'heart', 'Tips collected', 'pos612_tip_collection', 'phase612_cart_tips',
    'Phase 612 collects tips — Phase 614 allocates pools and prepares payroll input only.',
    '{"phase612_ref":"organization_pos612_cart_tips","duplicate_collection":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_time609_connection (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'time609_link', 'Approved hours connection', 'linked', 'timer', 'Time linked', 'time609_connection', 'phase609_time_attendance',
    'Phase 609 approved hours, overtime, TOIL, and on-call only — no duplicate time engine.',
    '{"phase609_ref":"get_organization_time_attendance_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_payroll_periods (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, period_label, summary, metadata
  ) values (
    p_org_id, 'pp_mar_2026', 'March 2026 Payroll Period', 'payroll_ready', 'briefcase', 'Payroll ready', 'payroll_periods', 'March 2026',
    'Payroll period — validate readiness before export input.',
    '{"locked":false,"route":"/app/compensation/payroll-periods"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_rental616_boundary (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'rent616_boundary', 'Phase 616 rental boundary', 'metadata_only', 'home', 'Boundary only', 'rental616_boundary',
    'Phase 616 rental model boundary metadata — not implemented in Phase 614.',
    '{"phase616":"rental_model","implemented":false,"compatible_interface":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_labor_cost_signals_615 (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'labor615_prep', 'Labor cost signals prep', 'metadata_only', 'trending-up', 'Signals prep', 'labor_cost_signals_615',
    'Phase 615 labor cost signals — metadata only, no profitability calculation here.',
    '{"phase615_ref":"labor_cost","calculate_profitability":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_cmp614_integration_hub (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values
    (p_org_id, 'int_588', 'Verified revenue', 'linked', 'trending-up', 'Revenue linked', 'integration_hub', 'phase588', 'Phase 588 verified revenue — integrate only.', '{"href":"/app/revenue-growth"}'::jsonb),
    (p_org_id, 'int_609', 'Time & attendance', 'linked', 'timer', 'Time linked', 'integration_hub', 'phase609', 'Phase 609 approved hours.', '{"href":"/app/time-attendance"}'::jsonb),
    (p_org_id, 'int_610', 'Booking revenue', 'linked', 'calendar', 'Booking linked', 'integration_hub', 'phase610', 'Phase 610 booking revenue.', '{"href":"/app/booking"}'::jsonb),
    (p_org_id, 'int_611', 'CRM & packages', 'linked', 'users', 'CRM linked', 'integration_hub', 'phase611', 'Phase 611 membership/packages.', '{"href":"/app/clients"}'::jsonb),
    (p_org_id, 'int_612', 'Checkout & tips', 'linked', 'shopping-cart', 'Checkout linked', 'integration_hub', 'phase612', 'Phase 612 checkout and tip collection.', '{"href":"/app/checkout"}'::jsonb),
    (p_org_id, 'int_606', 'Vacation continuity', 'linked', 'sun', 'Vacation linked', 'integration_hub', 'phase606', 'Phase 606 vacation mode.', '{"href":"/app/absence"}'::jsonb),
    (p_org_id, 'int_607', 'Crisis continuity', 'linked', 'shield', 'Continuity linked', 'integration_hub', 'phase607', 'Phase 607 crisis continuity.', '{"href":"/app/resilience/emergency"}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  perform public._cmp614_log(p_org_id, 'compensation_seeded', 'Compensation center baseline seeded — Phase 614.');
end; $$;

`;

sql += `create or replace function public._cmp614_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''employee_label'', employee_label, ''amount'', amount,
      ''currency_code'', currency_code, ''period_label'', period_label, ''priority'', priority,
      ''integration_ref'', integration_ref, ''immutable'', immutable,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_cmp614_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

`;

const rowsCase = Object.entries(UI_SECTION_MAP)
  .filter(([ui]) => ui !== "overview")
  .map(
    ([ui, domain]) =>
      `    when '${ui}' then v_rows := public._cmp614_section_rows(v_org_id, '${domain}');`
  )
  .join("\n");

sql += `create or replace function public.get_organization_compensation_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_settings public.organization_cmp614_settings;
  v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._cmp614_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmp614_seed(v_org_id);
  select * into v_settings from public.organization_cmp614_settings where organization_id = v_org_id;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'compensation_phase614',
      'principle', 'Aipify prepares payroll INPUT — not payroll processing. Humans approve; external systems pay.',
      'privacy_note', 'Employee compensation data is tenant-scoped. Growth Partner commissions never mix with employee payroll.',
      'distinction_note', 'Recorded work → Approved → Verified revenue → Commission-eligible → Payroll-ready → Exported → Externally processed',
      'section_count', 96,
      'settings', jsonb_build_object(
        'payroll_input_enabled', coalesce(v_settings.payroll_input_enabled, true),
        'growth_partner_separation_enforced', coalesce(v_settings.growth_partner_separation_enforced, true),
        'companion_advisor_enabled', coalesce(v_settings.companion_advisor_enabled, true)
      ),
      'stats', jsonb_build_object(
        'commission_pending', (select count(*) from public.organization_cmp614_commission_ledger where organization_id = v_org_id and record_status = 'commission_pending'),
        'payroll_ready', (select count(*) from public.organization_cmp614_payroll_input_records where organization_id = v_org_id and record_status = 'payroll_ready'),
        'open_exceptions', (select count(*) from public.organization_cmp614_payroll_exceptions where organization_id = v_org_id and record_status = 'active'),
        'pending_approvals', (select count(*) from public.organization_cmp614_approval_workflow where organization_id = v_org_id and record_status = 'approval_required'),
        'tip_pools_open', (select count(*) from public.organization_cmp614_tip_pools where organization_id = v_org_id and record_status = 'active')
      ),
      'sections_registry', coalesce((select jsonb_agg(jsonb_build_object(
        'section_key', s.section_key, 'section_number', s.section_number,
        'domain_key', s.domain_key, 'section_title', s.section_title, 'summary', s.summary
      ) order by s.section_number) from public.cmp614_section_defs s), '[]'::jsonb),
      'commission_status_defs', coalesce((select jsonb_agg(public._cmp614_status(d.status_key) order by d.status_key)
        from public.cmp614_commission_status_defs d), '[]'::jsonb),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('key', 'approvals', 'observation', 'Commission and payroll input items may await approval.',
          'recommendation', 'Review approvals with segregation of duties before export.', 'href', '/app/compensation/approvals'),
        jsonb_build_object('key', 'exceptions', 'observation', 'Payroll exceptions block readiness validation.',
          'recommendation', 'Resolve exceptions before locking the payroll period.', 'href', '/app/compensation/exceptions')
      ),
      'integrations', public._cmp614_section_rows(v_org_id, 'integration_hub')
    );
  end if;

  case v_section
${rowsCase}
    else v_rows := '[]'::jsonb;
  end case;

  return jsonb_build_object(
    'found', true, 'section', v_section, 'engine', 'compensation_phase614',
    'principle', 'Aipify prepares payroll INPUT — not payroll processing.',
    'privacy_note', 'Growth Partner commissions never mix with employee payroll.',
    'commission_status_defs', coalesce((select jsonb_agg(public._cmp614_status(d.status_key) order by d.status_key)
      from public.cmp614_commission_status_defs d), '[]'::jsonb),
    'records', v_rows,
    'integrations', public._cmp614_section_rows(v_org_id, 'integration_hub'),
    'since_last_login', coalesce((select jsonb_build_object(
      'pending_approvals', (select count(*) from public.organization_cmp614_approval_workflow where organization_id = v_org_id and record_status = 'approval_required'),
      'open_exceptions', (select count(*) from public.organization_cmp614_payroll_exceptions where organization_id = v_org_id and record_status = 'active'),
      'summary', 'Compensation changes since last login.'
    )), '{}'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_cmp614_audit_logs where organization_id = v_org_id order by created_at desc limit 15
    ) l), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_employee_my_compensation(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_center := public.get_organization_compensation_center('my_compensation');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  return v_center || jsonb_build_object(
    'view', 'employee_self',
    'section', v_section,
    'principle', 'Your compensation preview — disputes and corrections are non-punitive.',
    'employee_preview', public._cmp614_section_rows(public._cmp614_org(), 'employee_preview'),
    'commission_ledger', public._cmp614_section_rows(public._cmp614_org(), 'commission_ledger'),
    'tip_allocations', public._cmp614_section_rows(public._cmp614_org(), 'tip_allocation_runs'),
    'bonuses', public._cmp614_section_rows(public._cmp614_org(), 'manual_bonuses'),
    'disputes', public._cmp614_section_rows(public._cmp614_org(), 'dispute_process')
  );
end; $$;

create or replace function public.get_aipify_companion_compensation_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_compensation_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'advisor_title', 'Companion Compensation Advisor',
    'principle', 'Aipify observes compensation readiness and prepares payroll input — humans approve and external systems process pay.',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'approvals',
        'observation', format('%s item(s) awaiting compensation approval.', v_stats->>'pending_approvals'),
        'impact', 'Unapproved commissions and adjustments cannot reach payroll-ready status.',
        'recommendation', 'Review approvals with segregation of duties before export.',
        'effort', 'low',
        'href', '/app/compensation/approvals'
      ),
      jsonb_build_object(
        'key', 'exceptions',
        'observation', format('%s payroll exception(s) open.', v_stats->>'open_exceptions'),
        'impact', 'Exceptions block payroll period readiness validation.',
        'recommendation', 'Resolve exceptions in the Exception Center before locking the period.',
        'effort', 'medium',
        'href', '/app/compensation/exceptions'
      ),
      jsonb_build_object(
        'key', 'tips',
        'observation', 'Phase 612 collects tips — Phase 614 allocates pools for payroll input.',
        'impact', 'Tip allocation must complete before payroll export includes tip earnings.',
        'recommendation', 'Review tip pools and distribution before payroll input export.',
        'effort', 'low',
        'href', '/app/compensation/tips'
      ),
      jsonb_build_object(
        'key', 'separation',
        'observation', 'Growth Partner commissions remain separate from employee payroll.',
        'impact', 'Mixing partner and employee compensation violates governance policy.',
        'recommendation', 'Confirm Growth Partner separation policy is acknowledged.',
        'effort', 'low',
        'href', '/app/compensation/policies'
      )
    ),
    'center', v_center
  );
end; $$;

grant execute on function public.get_organization_compensation_center(text) to authenticated;
grant execute on function public.get_employee_my_compensation(text) to authenticated;
grant execute on function public.get_aipify_companion_compensation_advisor_bundle() to authenticated;
`;

fs.writeFileSync(out, sql);
console.log(`Wrote ${out} (${sql.length} bytes, ${SECTIONS.length} sections)`);

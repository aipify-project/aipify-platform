#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(
  root,
  "supabase/migrations/20261861200000_service_checkout_point_of_sale_tips_daily_revenue_operations_engine_phase612.sql",
);

/** 119 sections: settings + 117 domains + audit_logs */
const SECTIONS = [
  ["settings", "Service checkout / POS settings"],
  ["transaction_scopes", "Transaction scopes (org, domain, location, employee, customer, currency)"],
  ["transaction_types", "Checkout transaction types"],
  ["transaction_status_catalog", "Transaction status catalog (icon + text always)"],
  ["checkout_origins", "Checkout origin tracking"],
  ["appointment_handoff_links", "Phase 610 appointment handoff — integrate, do not duplicate booking"],
  ["checkout_carts", "Checkout cart sessions"],
  ["cart_services", "Cart service line items"],
  ["cart_products", "Cart product line items"],
  ["cart_addons", "Cart add-on line items"],
  ["cart_discounts", "Cart discount applications"],
  ["cart_packages", "Cart package items"],
  ["cart_memberships", "Cart membership items"],
  ["cart_loyalty", "Cart loyalty redemptions"],
  ["cart_gift_cards", "Cart gift card applications"],
  ["cart_tips", "Cart tip lines — optional, no preselect, no pressure"],
  ["cart_taxes", "Cart tax/VAT lines"],
  ["price_sources", "Price source tracking"],
  ["price_locks", "Price lock records"],
  ["discount_rules", "Discount engine rules"],
  ["discount_combination_rules", "Discount combination rules"],
  ["discount_approvals", "Discount approval requests"],
  ["promo_codes", "Promo codes"],
  ["membership_redemption_links", "Phase 611 membership redemption integration"],
  ["package_redemption_links", "Phase 611 package redemption integration"],
  ["loyalty_redemption_links", "Phase 611 loyalty redemption integration"],
  ["gift_card_redemption_links", "Phase 611 gift card redemption integration"],
  ["customer_credit_redemption", "Phase 611 customer credit redemption"],
  ["deposit_application", "Phase 610 deposit application"],
  ["deposit_difference", "Phase 610 deposit difference handling"],
  ["tips_settings", "Tips engine settings — optional, no preselect"],
  ["tips_attribution", "Tips attribution to employees"],
  ["tips_privacy_rules", "Tips privacy rules — aggregated analytics only"],
  ["payment_methods", "Payment methods catalog"],
  ["split_payments", "Split payment records"],
  ["multi_person_payments", "Multi-person payment splits"],
  ["terminal_payments", "Terminal payment metadata + verified states"],
  ["vipps_payments", "Vipps payment metadata + verified states"],
  ["stripe_payments", "Stripe payment metadata + verified states"],
  ["klarna_payments", "Klarna payment metadata + verified states"],
  ["invoice_payments", "Invoice payment records"],
  ["payment_links", "Payment link records"],
  ["vacation_payment_continuity", "Phase 606/610 vacation payment continuity"],
  ["payment_failures", "Payment failure records"],
  ["payment_idempotency", "Payment idempotency keys — no duplicate charges"],
  ["auth_capture_records", "Auth vs capture distinction records"],
  ["receipts", "Receipt records"],
  ["receipt_delivery", "Receipt delivery tracking"],
  ["receipt_printer_prep", "Receipt printer prep metadata"],
  ["cash_drawers", "Cash drawer records"],
  ["cash_movements", "Cash movement ledger"],
  ["cash_difference_reviews", "Cash difference review — non-punitive"],
  ["daily_close_records", "Daily close records"],
  ["daily_close_validation", "Daily close validation checks"],
  ["daily_close_reopening", "Governed daily close reopening"],
  ["payment_reconciliation", "Payment reconciliation"],
  ["settlement_reconciliation", "Settlement reconciliation"],
  ["fiken_integration_prep", "Fiken accounting integration prep"],
  ["fiken_export_statuses", "Fiken export status tracking"],
  ["revenue_recognition_signals", "Revenue recognition signals"],
  ["tax_vat_rules", "Tax/VAT rules"],
  ["multi_currency_checkout", "Multi-currency checkout rules"],
  ["refund_requests", "Refund request records"],
  ["partial_refunds", "Partial refund records"],
  ["refund_approvals", "Refund approval workflow"],
  ["cash_refunds", "Cash refund records"],
  ["return_records", "Return merchandise records"],
  ["service_recovery_links", "Phase 611 service recovery connection"],
  ["credit_notes", "Credit note records"],
  ["cancellation_fees", "Phase 610 cancellation fees"],
  ["no_show_fees", "Phase 610 no-show fees"],
  ["chargebacks", "Chargeback records"],
  ["disputes", "Payment dispute records"],
  ["fraud_reviews", "Fraud review records"],
  ["inventory_signals", "Product inventory signals — no duplicate warehouse"],
  ["low_stock_alerts", "Low stock alerts"],
  ["service_consumables", "Service consumable usage signals"],
  ["employee_attribution", "Employee checkout attribution"],
  ["team_attribution", "Team attribution records"],
  ["commission_event_prep", "Commission event preparation"],
  ["front_desk_queue", "Front desk checkout queue"],
  ["self_checkout_sessions", "Self-checkout sessions"],
  ["qr_checkout_sessions", "QR checkout sessions"],
  ["mobile_pos_sessions", "Mobile POS sessions"],
  ["offline_handling", "Offline checkout handling"],
  ["checkout_advisor_meta", "Companion Checkout Assistant metadata"],
  ["customer_experience_rules", "Transparent customer experience rules"],
  ["checkout_approvals", "Checkout approval engine"],
  ["segregation_of_duties", "Segregation of duties rules"],
  ["locale_checkout_copy", "Multilingual checkout copy (en/no/sv/da)"],
  ["accessibility_rules", "Accessibility rules for checkout"],
  ["employee_dashboard_meta", "Employee checkout dashboard"],
  ["manager_dashboard_meta", "Manager checkout dashboard"],
  ["executive_dashboard_meta", "Executive checkout dashboard"],
  ["vacation_revenue_view", "Vacation revenue view — Phase 606 continuity"],
  ["since_last_login_meta", "Since Last Login integration"],
  ["revenue_analytics", "Revenue analytics signals"],
  ["payment_analytics", "Payment analytics signals"],
  ["discount_analytics", "Discount analytics"],
  ["tip_privacy_analytics", "Tip privacy analytics — aggregated only"],
  ["product_analytics", "Product checkout analytics"],
  ["profitability_signals", "Profitability signals"],
  ["revenue_ops_integration", "Phase 588 revenue ops integration"],
  ["client_crm_integration", "Phase 611 client CRM integration"],
  ["booking_integration", "Phase 610 booking integration"],
  ["time_tracking_integration", "Phase 609 time tracking integration"],
  ["import_export_jobs", "Import/export jobs"],
  ["checkout_api_meta", "Checkout API metadata"],
  ["event_bus_signals", "Event bus signals"],
  ["notification_prefs", "Checkout notification preferences"],
  ["security_rules", "Checkout security rules"],
  ["retention_policies", "Data retention policies"],
  ["governance_rules", "Checkout governance rules"],
  ["open_checkouts", "Open checkout sessions"],
  ["completed_sales", "Completed sales records"],
  ["appointment_checkouts", "Appointment-linked checkouts"],
  ["checkout_reports", "Checkout reports catalog"],
  ["business_pack_registry", "Service POS Business Pack registry"],
  ["audit_logs", "Checkout audit log"],
];

if (SECTIONS.length !== 119) {
  console.error(`Expected 119 sections, got ${SECTIONS.length}`);
  process.exit(1);
}

const DATA_SECTIONS = SECTIONS.filter(([k]) => k !== "settings" && k !== "audit_logs").map(([k]) => k);

const UI_SECTION_MAP = {
  overview: "open_checkouts",
  open_checkouts: "open_checkouts",
  completed_sales: "completed_sales",
  appointments: "appointment_checkouts",
  products: "cart_products",
  payments: "payment_methods",
  tips: "cart_tips",
  discounts: "discount_rules",
  gift_cards: "gift_card_redemption_links",
  packages: "package_redemption_links",
  memberships: "membership_redemption_links",
  refunds: "refund_requests",
  invoices: "invoice_payments",
  cash_management: "cash_drawers",
  reconciliation: "payment_reconciliation",
  daily_close: "daily_close_records",
  reports: "checkout_reports",
  front_desk: "front_desk_queue",
};

let sql = `-- Phase 612 — Service Checkout, Point of Sale, Tips & Daily Revenue Operations Engine
-- Feature owner: CUSTOMER APP (/app/checkout) + Service POS Business Pack
-- Helpers: _pos612_*
-- Distinct from Phase 586 platform subscriptions/billing checkout

`;

sql += `-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_pos612_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  checkout_enabled boolean not null default true,
  tips_enabled boolean not null default true,
  tips_preselect_forbidden boolean not null default true,
  payment_verification_required boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  daily_close_required boolean not null default true,
  cash_management_enabled boolean not null default true,
  fiken_export_enabled boolean not null default false,
  vacation_revenue_view_enabled boolean not null default true,
  idempotency_enforced boolean not null default true,
  retention_days integer not null default 365,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_pos612_settings enable row level security;
revoke all on public.organization_pos612_settings from authenticated, anon;

`;

for (const [key, desc] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_pos612_${key}`;
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
  scope_type text not null default 'organization',
  priority text not null default 'routine' check (priority in ('critical', 'important', 'routine', 'optional')),
  integration_ref text not null default '',
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

sql += `create table if not exists public.organization_pos612_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'checkout',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_pos612_audit_logs enable row level security;
revoke all on public.organization_pos612_audit_logs from authenticated, anon;

`;

sql += `-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pos612_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._pos612_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'checkout'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_pos612_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'checkout'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._pos612_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_pos612_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

`;

sql += `create or replace function public._pos612_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_pos612_checkout_carts where organization_id = p_org_id limit 1) then
    return;
  end if;

`;

for (const [key] of SECTIONS) {
  if (key === "settings" || key === "audit_logs") continue;
  const table = `organization_pos612_${key}`;
  const seedKey = key.replace(/_/g, "").slice(0, 8);
  sql += `  insert into public.${table} (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, scope_type, priority, integration_ref, summary, metadata
  ) values (
    p_org_id, '${seedKey}_baseline', initcap(replace('${key}', '_', ' ')), 'active', 'circle', 'Active', '${key}', 'organization', 'routine', '',
    'Baseline seed — Phase 612 ${key}.', '{}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

`;
}

sql += `  insert into public.organization_pos612_transaction_status_catalog (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values
    (p_org_id, 'status_open', 'Open checkout', 'open', 'shopping-cart', 'Open', 'transaction_status_catalog', 'Checkout in progress — payment not verified.', '{"verified":false}'::jsonb),
    (p_org_id, 'status_pending', 'Payment pending', 'pending', 'clock', 'Pending verification', 'transaction_status_catalog', 'Awaiting payment provider verification.', '{"verified":false}'::jsonb),
    (p_org_id, 'status_paid', 'Payment verified', 'paid', 'check-circle', 'Paid', 'transaction_status_catalog', 'Payment verified — sale complete.', '{"verified":true}'::jsonb),
    (p_org_id, 'status_refunded', 'Refunded', 'refunded', 'rotate-ccw', 'Refunded', 'transaction_status_catalog', 'Refund processed with approval.', '{"verified":true}'::jsonb)
  on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_business_pack_registry (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'service_pos_pack', 'Service POS Business Pack', 'registered', 'package', 'Registered', 'business_pack_registry', 'service_pos_business_pack',
    'Service-business checkout, POS, tips, and daily revenue operations — APP Business Pack.',
    '{"pack_key":"service_pos","route":"/app/checkout","phase612":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_appointment_handoff_links (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'book610_handoff', 'Appointment checkout handoff', 'linked', 'calendar', 'Booking linked', 'appointment_handoff_links', 'phase610_booking',
    'Phase 610 appointment handoff — reuses booking engine, does not duplicate.',
    '{"phase610_ref":"booking","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_client_crm_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'crm611_link', 'Client CRM integration', 'linked', 'users', 'CRM linked', 'client_crm_integration', 'phase611_client_crm',
    'Phase 611 membership, packages, loyalty, gift cards — integrate, do not duplicate CRM.',
    '{"phase611_ref":"client_crm","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_booking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'book610_link', 'Booking integration', 'linked', 'calendar-check', 'Booking linked', 'booking_integration', 'phase610_booking',
    'Phase 610 deposits, cancellation/no-show fees — integrate only.',
    '{"phase610_ref":"booking","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_revenue_ops_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'rev588_link', 'Revenue ops integration', 'linked', 'trending-up', 'Revenue ops linked', 'revenue_ops_integration', 'phase588_revenue_ops',
    'Phase 588 revenue operations — metadata signals only.',
    '{"phase588_ref":"get_organization_revenue_operations_center","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_time_tracking_integration (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'time609_link', 'Time tracking integration', 'linked', 'timer', 'Time linked', 'time_tracking_integration', 'phase609_time',
    'Phase 609 time & attendance connection for employee attribution.',
    '{"phase609_ref":"time_attendance","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_vacation_payment_continuity (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, integration_ref, summary, metadata
  ) values (
    p_org_id, 'vac606_continuity', 'Vacation payment continuity', 'active', 'palmtree', 'Continuity active', 'vacation_payment_continuity', 'phase606_vacation_mode',
    'Phase 606/610 vacation payment continuity — revenue view during absence coverage.',
    '{"phase606_ref":"vacation_mode","duplicate_engine":false}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_tips_settings (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'tips_optional', 'Optional tips — no preselect', 'active', 'heart', 'Optional tips', 'tips_settings',
    'Tips are optional. No preselected amounts. No pressure language.',
    '{"preselect_forbidden":true,"pressure_forbidden":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_open_checkouts (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata
  ) values (
    p_org_id, 'checkout_front_1', 'Front desk — Walk-in service', 'open', 'shopping-cart', 'Open checkout', 'open_checkouts', 'important',
    'Service checkout awaiting payment verification.',
    '{"origin":"front_desk","route":"/app/checkout/front-desk"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_completed_sales (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'sale_today_1', 'Verified sale — Haircut + product', 'paid', 'check-circle', 'Payment verified', 'completed_sales',
    'Payment verified via terminal — receipt delivered.',
    '{"amount_nok":890,"verified":true}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_front_desk_queue (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, priority, summary, metadata
  ) values (
    p_org_id, 'queue_1', 'Queue — Appointment handoff', 'waiting', 'users', 'Waiting', 'front_desk_queue', 'routine',
    'Customer arrived from Phase 610 appointment — ready for checkout.',
    '{"handoff":"phase610","route":"/app/checkout/front-desk"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  insert into public.organization_pos612_daily_close_records (
    organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, summary, metadata
  ) values (
    p_org_id, 'close_today', 'Daily close — today', 'pending', 'sunset', 'Pending close', 'daily_close_records',
    'Daily close validation pending — review cash difference before closing.',
    '{"route":"/app/checkout/daily-close"}'::jsonb
  ) on conflict (organization_id, record_key) do nothing;

  perform public._pos612_log(p_org_id, 'service_checkout_seeded', 'Service checkout center baseline seeded — Phase 612.');
end; $$;

`;

sql += `create or replace function public._pos612_section_rows(p_org_id uuid, p_domain text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(
      ''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status,
      ''status_icon'', status_icon, ''status_label'', status_label, ''domain_key'', domain_key,
      ''scope_type'', scope_type, ''priority'', priority, ''integration_ref'', integration_ref,
      ''summary'', summary, ''metadata'', metadata, ''starts_at'', starts_at, ''ends_at'', ends_at
    ) order by record_title), ''[]''::jsonb) from public.organization_pos612_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end; $$;

`;

const rowsCase = Object.entries(UI_SECTION_MAP)
  .map(([ui, domain]) => `      when '${ui}' then public._pos612_section_rows(v_org_id, '${domain}')`)
  .join("\n");

sql += `create or replace function public.get_organization_checkout_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org jsonb;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_overview jsonb;
  v_open jsonb;
  v_completed jsonb;
  v_queue jsonb;
  v_audit jsonb;
  v_all_sections jsonb := '{}'::jsonb;
  v_domain text;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._pos612_ensure_settings(v_org_id);
  perform public._pos612_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'open_checkouts_count', (select count(*) from public.organization_pos612_open_checkouts where organization_id = v_org_id and record_status = 'open'),
    'completed_sales_today', (select count(*) from public.organization_pos612_completed_sales where organization_id = v_org_id and record_status = 'paid'),
    'pending_payments', (select count(*) from public.organization_pos612_checkout_carts where organization_id = v_org_id and record_status = 'pending'),
    'pending_refunds', (select count(*) from public.organization_pos612_refund_requests where organization_id = v_org_id and record_status = 'pending'),
    'daily_close_pending', (select count(*) from public.organization_pos612_daily_close_records where organization_id = v_org_id and record_status = 'pending'),
    'front_desk_queue', (select count(*) from public.organization_pos612_front_desk_queue where organization_id = v_org_id and record_status = 'waiting'),
    'cash_difference_open', (select count(*) from public.organization_pos612_cash_difference_reviews where organization_id = v_org_id and record_status = 'open'),
    'tips_enabled', (select tips_enabled from public.organization_pos612_settings where organization_id = v_org_id),
    'verification_required', (select payment_verification_required from public.organization_pos612_settings where organization_id = v_org_id)
  ) into v_overview;

  v_open := public._pos612_section_rows(v_org_id, 'open_checkouts');
  v_completed := public._pos612_section_rows(v_org_id, 'completed_sales');
  v_queue := public._pos612_section_rows(v_org_id, 'front_desk_queue');

  foreach v_domain in array array[${DATA_SECTIONS.map((s) => `'${s}'`).join(", ")}] loop
    v_all_sections := v_all_sections || jsonb_build_object(v_domain, public._pos612_section_rows(v_org_id, v_domain));
  end loop;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_pos612_audit_logs where organization_id = v_org_id order by created_at desc limit 15) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Service checkout completes verified sales — never mark payment complete without verification.',
    'privacy_note', 'Tip amounts are private to attribution rules — analytics remain aggregated.',
    'companion_identity', 'Companion Checkout Assistant',
    'organization', v_org,
    'overview', v_overview,
    'open_checkouts', v_open,
    'completed_sales', v_completed,
    'front_desk_queue', v_queue,
    'transaction_status_catalog', public._pos612_section_rows(v_org_id, 'transaction_status_catalog'),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Verify pending front desk checkout', 'reason', 'One open checkout awaits payment verification.', 'effort', 'low', 'route', '/app/checkout/front-desk'),
      jsonb_build_object('title', 'Complete daily close validation', 'reason', 'Daily close pending — review cash difference non-punitionally.', 'effort', 'routine', 'route', '/app/checkout/daily-close'),
      jsonb_build_object('title', 'Review appointment handoff queue', 'reason', 'Phase 610 appointment ready for checkout — no duplicate booking.', 'effort', 'low', 'route', '/app/checkout/appointments')
    ),
    'integrations', jsonb_build_object(
      'phase610_booking', public._pos612_section_rows(v_org_id, 'booking_integration'),
      'phase611_client_crm', public._pos612_section_rows(v_org_id, 'client_crm_integration'),
      'phase588_revenue_ops', public._pos612_section_rows(v_org_id, 'revenue_ops_integration'),
      'phase609_time', public._pos612_section_rows(v_org_id, 'time_tracking_integration'),
      'phase606_vacation', public._pos612_section_rows(v_org_id, 'vacation_payment_continuity')
    ),
    'sections', v_all_sections,
    'rows', case v_section
${rowsCase}
      else v_open
    end,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'center', '/app/checkout',
      'daily_close', '/app/checkout/daily-close',
      'refunds', '/app/checkout/refunds',
      'front_desk', '/app/checkout/front-desk'
    ),
    'since_last_login', public._pos612_section_rows(v_org_id, 'since_last_login_meta'),
    'executive_view', public._pos612_section_rows(v_org_id, 'executive_dashboard_meta'),
    'mobile_access', jsonb_build_object('route', '/app/checkout', 'summary_available', true)
  );
end; $$;

create or replace function public.get_aipify_companion_checkout_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._pos612_ensure_settings(v_org_id);
  perform public._pos612_seed(v_org_id);

  return jsonb_build_object(
    'found', true,
    'companion_identity', 'Companion Checkout Assistant',
    'principle', 'Aipify prepares checkout and verifies payments — staff approve completion.',
    'advisor_prompts', jsonb_build_array(
      'What checkouts are open?', 'Is daily close ready?', 'Any pending refunds?',
      'Show front desk queue.', 'Prepare receipt for verified sale.'
    ),
    'open_checkouts', (select count(*) from public.organization_pos612_open_checkouts where organization_id = v_org_id and record_status = 'open'),
    'pending_payments', (select count(*) from public.organization_pos612_checkout_carts where organization_id = v_org_id and record_status = 'pending'),
    'daily_close_pending', (select count(*) from public.organization_pos612_daily_close_records where organization_id = v_org_id and record_status = 'pending'),
    'front_desk_waiting', (select count(*) from public.organization_pos612_front_desk_queue where organization_id = v_org_id and record_status = 'waiting'),
    'integrations', jsonb_build_object(
      'booking', 'phase610',
      'client_crm', 'phase611',
      'revenue_ops', 'phase588',
      'time_tracking', 'phase609',
      'vacation_mode', 'phase606'
    ),
    'route', '/app/checkout',
    'privacy_note', 'Tips remain optional — Companion never preselects tip amounts or applies pressure.'
  );
end; $$;

create or replace function public.get_organization_checkout_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._pos612_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_checkout_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/checkout', 'companion_identity', 'Companion Checkout Assistant');
end; $$;

grant execute on function public.get_organization_checkout_center(text) to authenticated;
grant execute on function public.get_aipify_companion_checkout_advisor_bundle() to authenticated;
grant execute on function public.get_organization_checkout_mobile_summary() to authenticated;
`;

fs.writeFileSync(out, sql);
console.log(`Wrote ${out} (${sql.length} bytes, ${SECTIONS.length} sections)`);

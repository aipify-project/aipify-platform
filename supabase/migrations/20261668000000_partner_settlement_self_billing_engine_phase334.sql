-- Phase 334 — Partner Settlement & Self-Billing Engine
-- Feature owner: GROWTH PARTNER PORTAL. Route: /partner/settlements. Helpers: _gps334_*

create table if not exists public.growth_partner_portal_self_billing_agreements (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  agreement_version text not null default '1.0',
  accepted boolean not null default false,
  accepted_at timestamptz,
  accepted_by uuid,
  acceptance_statement text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  unique (partner_org_id, agreement_version)
);
alter table public.growth_partner_portal_self_billing_agreements enable row level security;
revoke all on public.growth_partner_portal_self_billing_agreements from authenticated, anon;

create table if not exists public.growth_partner_portal_settlements (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  settlement_key text not null,
  settlement_period text not null,
  period_from date not null,
  period_to date not null,
  commission_total numeric(12, 2) not null default 0,
  vat_rate_pct numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_payable numeric(12, 2) not null default 0,
  settlement_status text not null default 'draft' check (
    settlement_status in (
      'draft', 'awaiting_partner_approval', 'approved', 'invoice_generated',
      'sent_to_accounting', 'paid', 'rejected', 'cancelled'
    )
  ),
  partner_approved_at timestamptz,
  partner_approved_by uuid,
  approval_statement text not null default '',
  due_date date,
  payment_terms text not null default '30 days',
  metadata jsonb not null default '{"accounting_ready":true,"fiken_ready":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_org_id, settlement_key),
  unique (partner_org_id, settlement_period)
);
create index if not exists gpp_settlements_org_idx
  on public.growth_partner_portal_settlements (partner_org_id, settlement_status, created_at desc);
alter table public.growth_partner_portal_settlements enable row level security;
revoke all on public.growth_partner_portal_settlements from authenticated, anon;

create table if not exists public.growth_partner_portal_settlement_items (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.growth_partner_portal_settlements (id) on delete cascade,
  commission_record_id uuid references public.growth_partner_portal_commission_engine_records (id) on delete set null,
  sale_reference text not null default '',
  customer_name text not null default '',
  package_label text not null default '',
  sale_value numeric(12, 2) not null default 0,
  commission_rate_pct numeric(5, 2) not null default 0,
  commission_amount numeric(12, 2) not null default 0,
  line_description text not null default '',
  sort_order integer not null default 100
);
alter table public.growth_partner_portal_settlement_items enable row level security;
revoke all on public.growth_partner_portal_settlement_items from authenticated, anon;

create table if not exists public.growth_partner_portal_settlement_invoice_sequences (
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  invoice_year integer not null,
  last_sequence integer not null default 0,
  primary key (partner_org_id, invoice_year)
);
alter table public.growth_partner_portal_settlement_invoice_sequences enable row level security;
revoke all on public.growth_partner_portal_settlement_invoice_sequences from authenticated, anon;

create table if not exists public.growth_partner_portal_settlement_invoices (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  settlement_id uuid not null references public.growth_partner_portal_settlements (id) on delete restrict,
  invoice_number text not null,
  invoice_date date not null default current_date,
  due_date date not null,
  settlement_period text not null,
  description text not null default 'Growth Partner commission — qualifying initial sales',
  commission_total numeric(12, 2) not null default 0,
  vat_rate_pct numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_payable numeric(12, 2) not null default 0,
  payment_terms text not null default '30 days',
  invoice_status text not null default 'draft' check (
    invoice_status in ('draft', 'finalized', 'sent_to_accounting', 'paid', 'cancelled')
  ),
  seller_snapshot jsonb not null default '{}'::jsonb,
  buyer_snapshot jsonb not null default '{}'::jsonb,
  line_items jsonb not null default '[]'::jsonb,
  immutable boolean not null default false,
  finalized_at timestamptz,
  sent_to_accounting_at timestamptz,
  paid_at timestamptz,
  accounting_payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (partner_org_id, invoice_number),
  unique (settlement_id)
);
alter table public.growth_partner_portal_settlement_invoices enable row level security;
revoke all on public.growth_partner_portal_settlement_invoices from authenticated, anon;

create table if not exists public.growth_partner_portal_settlement_audit_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  settlement_id uuid references public.growth_partner_portal_settlements (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_settlement_audit_org_idx
  on public.growth_partner_portal_settlement_audit_logs (partner_org_id, created_at desc);
alter table public.growth_partner_portal_settlement_audit_logs enable row level security;
revoke all on public.growth_partner_portal_settlement_audit_logs from authenticated, anon;

create or replace function public._gps334bp_positioning() returns text language sql immutable as $$
  select 'Sell. Review. Approve. Get paid. Aipify prepares monthly settlement drafts — partners approve, and legal self-billing invoices are generated for Aipify Group AS accounting.'; $$;

create or replace function public._gps334_aipify_buyer() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'company_name', 'Aipify Group AS',
    'city', 'Bergen',
    'country', 'Norway',
    'country_code', 'NO'
  ); $$;

create or replace function public._gps334_log_audit(
  p_org_id uuid, p_settlement_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_settlement_audit_logs (
    partner_org_id, settlement_id, event_type, summary, actor_auth_user_id, context
  ) values (
    p_org_id, p_settlement_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gps334_ensure_agreement_row(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_self_billing_agreements (partner_org_id)
  values (p_org_id) on conflict (partner_org_id, agreement_version) do nothing;
end; $$;

create or replace function public._gps334_seller_snapshot(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_profile public.growth_partner_portal_profiles;
begin
  perform public._gpp331_ensure_profile(p_org_id);
  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  return jsonb_build_object(
    'company_name', coalesce(v_profile.company_name, ''),
    'organization_number', coalesce(v_profile.organization_number, ''),
    'vat_number', coalesce(v_profile.vat_number, ''),
    'business_address', coalesce(v_profile.business_address, ''),
    'country_code', coalesce(v_profile.country_code, 'NO'),
    'bank_account_holder', coalesce(v_profile.bank_account_holder, ''),
    'bank_account_number', coalesce(v_profile.bank_account_number, ''),
    'bank_routing', coalesce(v_profile.bank_routing, ''),
    'contact_email', coalesce(v_profile.contact_email, '')
  );
end; $$;

create or replace function public._gps334_vat_rate(p_org_id uuid)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare v_vat text;
begin
  select vat_number into v_vat from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  if coalesce(trim(v_vat), '') <> '' then return 25.00; end if;
  return 0.00;
end; $$;

create or replace function public._gps334_next_invoice_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_year integer := extract(year from current_date)::integer;
  v_seq integer;
  v_prefix text;
begin
  select left(upper(regexp_replace(coalesce(org_name, 'GP'), '[^A-Za-z0-9]', '', 'g')), 3)
  into v_prefix from public.growth_partner_portal_organizations where id = p_org_id;
  v_prefix := coalesce(nullif(v_prefix, ''), 'GP');

  insert into public.growth_partner_portal_settlement_invoice_sequences (partner_org_id, invoice_year, last_sequence)
  values (p_org_id, v_year, 1)
  on conflict (partner_org_id, invoice_year) do update set last_sequence = (
    public.growth_partner_portal_settlement_invoice_sequences.last_sequence + 1
  )
  returning last_sequence into v_seq;

  return v_prefix || '-' || v_year::text || '-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._gps334_payable_commissions(
  p_org_id uuid, p_period_from date, p_period_to date
) returns numeric language sql stable security definer set search_path = public as $$
  select coalesce(sum(commission_amount), 0)
  from public.growth_partner_portal_commission_engine_records
  where partner_org_id = p_org_id
    and commission_status in ('approved', 'ready_for_settlement')
    and record_date between p_period_from and p_period_to
    and not exists (
      select 1 from public.growth_partner_portal_settlement_items si
      join public.growth_partner_portal_settlements st on st.id = si.settlement_id
      where si.commission_record_id = growth_partner_portal_commission_engine_records.id
        and st.settlement_status not in ('rejected', 'cancelled')
    ); $$;

create or replace function public._gps334_period_bounds(p_period text default null)
returns table(period_label text, period_from date, period_to date) language plpgsql stable as $$
declare v_period text := coalesce(nullif(trim(p_period), ''), to_char(current_date, 'YYYY-MM'));
begin
  period_label := v_period;
  period_from := to_date(v_period || '-01', 'YYYY-MM-DD');
  period_to := (date_trunc('month', period_from) + interval '1 month - 1 day')::date;
  return next;
end; $$;

create or replace function public.prepare_partner_monthly_settlement(p_period text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_bounds record;
  v_total numeric;
  v_vat_rate numeric;
  v_vat_amount numeric;
  v_payable numeric;
  v_settlement_id uuid;
  v_key text;
  v_existing uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gps334_ensure_agreement_row(v_org_id);
  perform public._gpc333_seed_demo(v_org_id);

  select * into v_bounds from public._gps334_period_bounds(p_period);

  select id into v_existing from public.growth_partner_portal_settlements
  where partner_org_id = v_org_id and settlement_period = v_bounds.period_label
    and settlement_status not in ('rejected', 'cancelled')
  limit 1;

  if v_existing is not null then
    return public.get_partner_settlement(v_existing);
  end if;

  v_total := public._gps334_payable_commissions(v_org_id, v_bounds.period_from, v_bounds.period_to);

  if v_total <= 0 then
    return jsonb_build_object(
      'has_access', true,
      'has_payable_settlement', false,
      'message', 'No payable settlement this month.',
      'settlement_period', v_bounds.period_label
    );
  end if;

  v_vat_rate := public._gps334_vat_rate(v_org_id);
  v_vat_amount := round(v_total * v_vat_rate / 100, 2);
  v_payable := v_total + v_vat_amount;
  v_key := 'STL-' || replace(v_bounds.period_label, '-', '') || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);

  insert into public.growth_partner_portal_settlements (
    partner_org_id, settlement_key, settlement_period, period_from, period_to,
    commission_total, vat_rate_pct, vat_amount, total_payable,
    settlement_status, due_date
  ) values (
    v_org_id, v_key, v_bounds.period_label, v_bounds.period_from, v_bounds.period_to,
    v_total, v_vat_rate, v_vat_amount, v_payable,
    'awaiting_partner_approval', current_date + 30
  ) returning id into v_settlement_id;

  insert into public.growth_partner_portal_settlement_items (
    settlement_id, commission_record_id, sale_reference, customer_name, package_label,
    sale_value, commission_rate_pct, commission_amount, line_description, sort_order
  )
  select
    v_settlement_id, cr.id, coalesce(s.sale_reference, cr.commission_key),
    cr.customer_name, cr.package_label, cr.sale_value, cr.commission_rate_pct,
    cr.commission_amount,
    'Commission — initial sale — ' || cr.customer_name || ' (' || cr.package_label || ')',
    row_number() over (order by cr.record_date)::int * 10
  from public.growth_partner_portal_commission_engine_records cr
  left join public.growth_partner_portal_commission_sales s on s.id = cr.sale_id
  where cr.partner_org_id = v_org_id
    and cr.commission_status in ('approved', 'ready_for_settlement')
    and cr.record_date between v_bounds.period_from and v_bounds.period_to;

  perform public._gps334_log_audit(
    v_org_id, v_settlement_id, 'settlement_draft_created',
    'Monthly settlement draft prepared.', jsonb_build_object('total_payable', v_payable)
  );

  return public.get_partner_settlement(v_settlement_id);
end; $$;

create or replace function public.get_partner_settlement(p_settlement_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.growth_partner_portal_settlements;
  v_invoice public.growth_partner_portal_settlement_invoices;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();

  select * into v_row from public.growth_partner_portal_settlements
  where id = p_settlement_id and partner_org_id = v_org_id;
  if v_row.id is null then return jsonb_build_object('has_access', false); end if;

  select * into v_invoice from public.growth_partner_portal_settlement_invoices
  where settlement_id = v_row.id;

  return jsonb_build_object(
    'has_access', true,
    'has_payable_settlement', v_row.total_payable > 0,
    'settlement', jsonb_build_object(
      'id', v_row.id,
      'settlement_key', v_row.settlement_key,
      'settlement_period', v_row.settlement_period,
      'period_from', v_row.period_from::text,
      'period_to', v_row.period_to::text,
      'commission_total', v_row.commission_total,
      'vat_rate_pct', v_row.vat_rate_pct,
      'vat_amount', v_row.vat_amount,
      'total_payable', v_row.total_payable,
      'settlement_status', v_row.settlement_status,
      'due_date', coalesce(v_row.due_date::text, ''),
      'payment_terms', v_row.payment_terms,
      'partner_approved_at', coalesce(v_row.partner_approved_at::text, ''),
      'approval_statement', v_row.approval_statement
    ),
    'seller', public._gps334_seller_snapshot(v_org_id),
    'buyer', public._gps334_aipify_buyer(),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'sale_reference', si.sale_reference,
        'customer_name', si.customer_name,
        'package_label', si.package_label,
        'sale_value', si.sale_value,
        'commission_rate_pct', si.commission_rate_pct,
        'commission_amount', si.commission_amount,
        'line_description', si.line_description
      ) order by si.sort_order)
      from public.growth_partner_portal_settlement_items si where si.settlement_id = v_row.id
    ), '[]'::jsonb),
    'invoice', case when v_invoice.id is null then null else jsonb_build_object(
      'id', v_invoice.id,
      'invoice_number', v_invoice.invoice_number,
      'invoice_date', v_invoice.invoice_date::text,
      'due_date', v_invoice.due_date::text,
      'total_payable', v_invoice.total_payable,
      'invoice_status', v_invoice.invoice_status,
      'immutable', v_invoice.immutable,
      'accounting_payload', v_invoice.accounting_payload
    ) end,
    'approval_text', 'I confirm that this settlement is correct and authorize Aipify Group AS to generate this invoice on behalf of my business.'
  );
end; $$;

create or replace function public.get_partner_settlements()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_bounds record;
  v_agreement public.growth_partner_portal_self_billing_agreements;
  v_payable numeric;
  v_current uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_provision_membership();
  if v_org_id is null then return jsonb_build_object('has_access', false); end if;

  perform public._gpp331_provision(v_org_id);
  perform public._gpc333_seed_demo(v_org_id);
  perform public._gps334_ensure_agreement_row(v_org_id);

  select * into v_agreement from public.growth_partner_portal_self_billing_agreements
  where partner_org_id = v_org_id order by agreement_version desc limit 1;

  select * into v_bounds from public._gps334_period_bounds(null);
  v_payable := public._gps334_payable_commissions(v_org_id, v_bounds.period_from, v_bounds.period_to);

  select id into v_current from public.growth_partner_portal_settlements
  where partner_org_id = v_org_id and settlement_period = v_bounds.period_label
    and settlement_status not in ('rejected', 'cancelled')
  limit 1;

  return jsonb_build_object(
    'has_access', true,
    'positioning', public._gps334bp_positioning(),
    'self_billing_agreement', jsonb_build_object(
      'accepted', coalesce(v_agreement.accepted, false),
      'accepted_at', coalesce(v_agreement.accepted_at::text, ''),
      'version', coalesce(v_agreement.agreement_version, '1.0')
    ),
    'current_period', v_bounds.period_label,
    'has_payable_settlement', v_payable > 0,
    'no_payable_message', case when v_payable <= 0 and v_current is null
      then 'No payable settlement this month.' else null end,
    'current_settlement_id', v_current,
    'pending_total', v_payable,
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'settlement_period', s.settlement_period,
        'total_payable', s.total_payable,
        'settlement_status', s.settlement_status,
        'created_at', s.created_at::text
      ) order by s.created_at desc)
      from public.growth_partner_portal_settlements s
      where s.partner_org_id = v_org_id
      limit 24
    ), '[]'::jsonb),
    'approval_text', 'I confirm that this settlement is correct and authorize Aipify Group AS to generate this invoice on behalf of my business.'
  );
end; $$;

create or replace function public.get_partner_settlements_history()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then return jsonb_build_object('has_access', false); end if;
  v_org_id := public._gppf05_require_org();

  return jsonb_build_object(
    'has_access', true,
    'settlements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'settlement_key', s.settlement_key,
        'settlement_period', s.settlement_period,
        'commission_total', s.commission_total,
        'total_payable', s.total_payable,
        'settlement_status', s.settlement_status,
        'partner_approved_at', coalesce(s.partner_approved_at::text, ''),
        'created_at', s.created_at::text,
        'invoice_number', (select i.invoice_number from public.growth_partner_portal_settlement_invoices i where i.settlement_id = s.id limit 1)
      ) order by s.created_at desc)
      from public.growth_partner_portal_settlements s where s.partner_org_id = v_org_id
    ), '[]'::jsonb),
    'invoices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id,
        'invoice_number', i.invoice_number,
        'settlement_period', i.settlement_period,
        'total_payable', i.total_payable,
        'invoice_status', i.invoice_status,
        'immutable', i.immutable,
        'invoice_date', i.invoice_date::text,
        'paid_at', coalesce(i.paid_at::text, '')
      ) order by i.invoice_date desc)
      from public.growth_partner_portal_settlement_invoices i where i.partner_org_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.accept_partner_self_billing_agreement(p_statement text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gps334_ensure_agreement_row(v_org_id);

  update public.growth_partner_portal_self_billing_agreements set
    accepted = true,
    accepted_at = now(),
    accepted_by = auth.uid(),
    acceptance_statement = coalesce(p_statement, acceptance_statement)
  where partner_org_id = v_org_id and agreement_version = '1.0';

  perform public._gps334_log_audit(
    v_org_id, null, 'self_billing_agreement_accepted',
    'Self-billing agreement accepted.', '{}'::jsonb
  );

  return public.get_partner_settlements();
end; $$;

create or replace function public.approve_partner_settlement(
  p_settlement_id uuid,
  p_approval_statement text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.growth_partner_portal_settlements;
  v_agreement public.growth_partner_portal_self_billing_agreements;
  v_invoice_number text;
  v_seller jsonb;
  v_buyer jsonb;
  v_lines jsonb;
  v_invoice_id uuid;
  v_accounting jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();

  select * into v_agreement from public.growth_partner_portal_self_billing_agreements
  where partner_org_id = v_org_id and agreement_version = '1.0';
  if coalesce(v_agreement.accepted, false) = false then
    raise exception 'Self-billing agreement must be accepted before invoice generation';
  end if;

  select * into v_row from public.growth_partner_portal_settlements
  where id = p_settlement_id and partner_org_id = v_org_id;
  if v_row.id is null then raise exception 'Settlement not found'; end if;
  if v_row.total_payable <= 0 then raise exception 'Cannot approve empty settlement'; end if;
  if v_row.settlement_status not in ('draft', 'awaiting_partner_approval') then
    raise exception 'Settlement is not awaiting approval';
  end if;

  if coalesce(trim(p_approval_statement), '') = '' then
    raise exception 'Partner approval statement is required';
  end if;

  update public.growth_partner_portal_settlements set
    settlement_status = 'approved',
    partner_approved_at = now(),
    partner_approved_by = auth.uid(),
    approval_statement = p_approval_statement,
    updated_at = now()
  where id = p_settlement_id;

  v_invoice_number := public._gps334_next_invoice_number(v_org_id);
  v_seller := public._gps334_seller_snapshot(v_org_id);
  v_buyer := public._gps334_aipify_buyer();

  select coalesce(jsonb_agg(jsonb_build_object(
    'sale_reference', si.sale_reference,
    'customer', si.customer_name,
    'package', si.package_label,
    'commission_pct', si.commission_rate_pct,
    'amount', si.commission_amount
  ) order by si.sort_order), '[]'::jsonb) into v_lines
  from public.growth_partner_portal_settlement_items si where si.settlement_id = p_settlement_id;

  v_accounting := jsonb_build_object(
    'integration', 'fiken_ready',
    'direction', 'incoming_supplier_invoice',
    'supplier', v_seller,
    'buyer', v_buyer,
    'currency', 'NOK',
    'line_items', v_lines
  );

  insert into public.growth_partner_portal_settlement_invoices (
    partner_org_id, settlement_id, invoice_number, invoice_date, due_date,
    settlement_period, commission_total, vat_rate_pct, vat_amount, total_payable,
    payment_terms, invoice_status, seller_snapshot, buyer_snapshot, line_items,
    immutable, finalized_at, sent_to_accounting_at, accounting_payload
  ) values (
    v_org_id, p_settlement_id, v_invoice_number, current_date, v_row.due_date,
    v_row.settlement_period, v_row.commission_total, v_row.vat_rate_pct, v_row.vat_amount, v_row.total_payable,
    v_row.payment_terms, 'sent_to_accounting', v_seller, v_buyer, v_lines,
    true, now(), now(), v_accounting
  ) returning id into v_invoice_id;

  update public.growth_partner_portal_settlements set
    settlement_status = 'sent_to_accounting', updated_at = now()
  where id = p_settlement_id;

  update public.growth_partner_portal_commission_engine_records cr set
    commission_status = 'paid', updated_at = now()
  from public.growth_partner_portal_settlement_items si
  where si.commission_record_id = cr.id and si.settlement_id = p_settlement_id;

  perform public._gps334_log_audit(
    v_org_id, p_settlement_id, 'settlement_approved_invoice_generated',
    'Partner approved settlement; legal invoice generated.',
    jsonb_build_object('invoice_id', v_invoice_id, 'invoice_number', v_invoice_number)
  );

  return public.get_partner_settlement(p_settlement_id);
end; $$;

grant execute on function public.get_partner_settlements() to authenticated;
grant execute on function public.get_partner_settlements_history() to authenticated;
grant execute on function public.get_partner_settlement(uuid) to authenticated;
grant execute on function public.prepare_partner_monthly_settlement(text) to authenticated;
grant execute on function public.accept_partner_self_billing_agreement(text) to authenticated;
grant execute on function public.approve_partner_settlement(uuid, text) to authenticated;

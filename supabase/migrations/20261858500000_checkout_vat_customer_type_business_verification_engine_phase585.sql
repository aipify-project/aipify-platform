-- Phase 585 — Checkout VAT, Customer Type & Business Verification Engine
-- Feature owner: CUSTOMER APP (checkout) + PLATFORM ADMIN (tax verification)
-- Route: /app/checkout · /platform/billing/tax-verification
-- Helpers: _cvt585_*
-- LEGAL: Review with accounting/legal before public launch.

create table if not exists public.checkout_vat_settings (
  company_id uuid primary key references public.companies (id) on delete cascade,
  default_customer_type text not null default 'private' check (
    default_customer_type in ('private', 'business')
  ),
  legal_review_acknowledged boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.checkout_vat_settings enable row level security;
revoke all on public.checkout_vat_settings from authenticated, anon;

create table if not exists public.checkout_vat_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_key text not null,
  product_type text not null default 'subscription' check (
    product_type in (
      'subscription', 'domain_license', 'business_pack', 'user_license',
      'connector_addon', 'growth_partner_service', 'enterprise_upgrade', 'custom'
    )
  ),
  customer_type text not null check (customer_type in ('private', 'business')),
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  country text not null default 'NO',
  billing_address text not null default '',
  billing_email text not null default '',
  reference text not null default '',
  purchase_order_number text not null default '',
  validation_status text not null default 'waiting' check (
    validation_status in ('waiting', 'validating', 'valid', 'invalid', 'service_unavailable', 'not_required')
  ),
  validation_source text not null default '',
  registry_company_name text not null default '',
  subtotal_amount numeric(12, 2) not null default 0,
  vat_rate numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  reverse_charge boolean not null default false,
  reverse_charge_note text not null default '',
  payment_provider text not null default 'stripe',
  payment_provider_reference text not null default '',
  subscription_reference text not null default '',
  domain_license_reference text not null default '',
  business_pack_reference text not null default '',
  tax_configuration jsonb not null default '{}'::jsonb,
  session_status text not null default 'draft' check (
    session_status in ('draft', 'confirmed', 'paid', 'cancelled')
  ),
  unique (company_id, session_key)
);

alter table public.checkout_vat_sessions enable row level security;
revoke all on public.checkout_vat_sessions from authenticated, anon;

create table if not exists public.checkout_vat_validations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_key text not null default '',
  business_number text not null,
  country text not null,
  validation_source text not null check (
    validation_source in ('brreg', 'vies', 'manual', 'none')
  ),
  validation_status text not null check (
    validation_status in ('validating', 'valid', 'invalid', 'service_unavailable')
  ),
  registry_name text not null default '',
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.checkout_vat_validations enable row level security;
revoke all on public.checkout_vat_validations from authenticated, anon;

create table if not exists public.checkout_vat_invoice_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  session_key text not null,
  invoice_reference text not null default '',
  customer_type text not null,
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  validation_status text not null default '',
  validation_source text not null default '',
  country text not null default '',
  billing_address text not null default '',
  vat_rate numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  reverse_charge boolean not null default false,
  payment_provider_reference text not null default '',
  subscription_reference text not null default '',
  domain_license_reference text not null default '',
  business_pack_reference text not null default '',
  tax_notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.checkout_vat_invoice_records enable row level security;
revoke all on public.checkout_vat_invoice_records from authenticated, anon;

create table if not exists public.checkout_vat_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'checkout_vat',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.checkout_vat_audit_logs enable row level security;
revoke all on public.checkout_vat_audit_logs from authenticated, anon;

create or replace function public._cvt585_company()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cvt585_log(
  p_company_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'checkout_vat'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.checkout_vat_audit_logs (
    company_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_company_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'checkout_vat'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cvt585_is_eu_country(p_country text)
returns boolean language sql immutable as $$
  select upper(coalesce(p_country, '')) in (
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
    'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
  );
$$;

create or replace function public._cvt585_calculate_vat(
  p_customer_type text,
  p_country text,
  p_subtotal numeric,
  p_validation_status text,
  p_validation_source text default ''
)
returns jsonb language plpgsql immutable as $$
declare
  v_country text := upper(coalesce(p_country, 'NO'));
  v_rate numeric := 0;
  v_reverse boolean := false;
  v_note text := '';
begin
  if coalesce(p_subtotal, 0) <= 0 then
    return jsonb_build_object(
      'vat_rate', 0, 'vat_amount', 0, 'total_amount', 0,
      'reverse_charge', false, 'reverse_charge_note', ''
    );
  end if;

  if p_customer_type = 'private' then
    if v_country = 'NO' then
      v_rate := 25;
    elsif public._cvt585_is_eu_country(v_country) then
      v_rate := 25;
    else
      v_rate := 0;
    end if;
  elsif p_customer_type = 'business' then
    if v_country = 'NO' then
      v_rate := 25;
    elsif public._cvt585_is_eu_country(v_country) and v_country <> 'NO' then
      if p_validation_status = 'valid' and p_validation_source = 'vies' then
        v_rate := 0;
        v_reverse := true;
        v_note := 'Reverse charge. VAT to be accounted for by the customer.';
      else
        v_rate := 25;
      end if;
    else
      v_rate := 0;
    end if;
  end if;

  return jsonb_build_object(
    'vat_rate', v_rate,
    'vat_amount', round(p_subtotal * v_rate / 100, 2),
    'total_amount', round(p_subtotal + (p_subtotal * v_rate / 100), 2),
    'reverse_charge', v_reverse,
    'reverse_charge_note', v_note
  );
end; $$;

create or replace function public.calculate_checkout_vat_tax(p_payload jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_company_id uuid;
  v_subtotal numeric := coalesce((p_payload->>'subtotal')::numeric, 0);
  v_tax jsonb;
begin
  v_company_id := public._cvt585_company();
  if v_company_id is null then return jsonb_build_object('found', false, 'error', 'Company not found'); end if;

  v_tax := public._cvt585_calculate_vat(
    coalesce(p_payload->>'customer_type', 'private'),
    coalesce(p_payload->>'country', 'NO'),
    v_subtotal,
    coalesce(p_payload->>'validation_status', 'waiting'),
    coalesce(p_payload->>'validation_source', '')
  );

  return jsonb_build_object(
    'found', true,
    'subtotal', v_subtotal,
    'currency', coalesce(p_payload->>'currency', 'NOK'),
    'customer_type', coalesce(p_payload->>'customer_type', 'private'),
    'country', upper(coalesce(p_payload->>'country', 'NO')),
    'validation_status', coalesce(p_payload->>'validation_status', 'waiting'),
    'legal_review_required', true,
    'legal_review_note', 'This checkout tax engine must be reviewed with accounting and legal before public launch.',
    'breakdown', v_tax
  ) || v_tax;
end; $$;

create or replace function public.record_checkout_vat_validation(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_company_id uuid;
  v_status text := coalesce(p_payload->>'validation_status', 'invalid');
  v_source text := coalesce(p_payload->>'validation_source', 'none');
begin
  v_company_id := public._cvt585_company();
  if v_company_id is null then raise exception 'Company not found'; end if;

  insert into public.checkout_vat_validations (
    company_id, session_key, business_number, country,
    validation_source, validation_status, registry_name, raw_response
  ) values (
    v_company_id,
    coalesce(p_payload->>'session_key', ''),
    coalesce(p_payload->>'business_number', ''),
    upper(coalesce(p_payload->>'country', 'NO')),
    v_source,
    v_status,
    coalesce(p_payload->>'registry_company_name', ''),
    coalesce(p_payload->'raw_response', '{}'::jsonb)
  );

  if v_status = 'valid' then
    perform public._cvt585_log(v_company_id, 'validation_passed', 'Business number validation passed', p_payload);
  elsif v_status = 'service_unavailable' then
    perform public._cvt585_log(v_company_id, 'validation_service_failed', 'Validation service unavailable', p_payload);
  else
    perform public._cvt585_log(v_company_id, 'validation_failed', 'Business number validation failed', p_payload);
  end if;

  perform public._cvt585_log(v_company_id, 'validation_started', 'Validation recorded', p_payload);

  return jsonb_build_object('ok', true, 'validation_status', v_status, 'validation_source', v_source);
end; $$;

create or replace function public.upsert_checkout_vat_session(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_company_id uuid;
  v_session_key text := coalesce(p_payload->>'session_key', gen_random_uuid()::text);
  v_subtotal numeric := coalesce((p_payload->>'subtotal')::numeric, 0);
  v_tax jsonb;
  v_customer_type text := coalesce(p_payload->>'customer_type', 'private');
  v_country text := upper(coalesce(p_payload->>'country', 'NO'));
  v_validation_status text := coalesce(p_payload->>'validation_status', 'not_required');
  v_validation_source text := coalesce(p_payload->>'validation_source', '');
begin
  v_company_id := public._cvt585_company();
  if v_company_id is null then raise exception 'Company not found'; end if;

  if v_customer_type = 'private' then
    v_validation_status := 'not_required';
    v_validation_source := '';
  end if;

  v_tax := public._cvt585_calculate_vat(v_customer_type, v_country, v_subtotal, v_validation_status, v_validation_source);

  insert into public.checkout_vat_settings (company_id) values (v_company_id)
  on conflict (company_id) do nothing;

  insert into public.checkout_vat_sessions (
    company_id, session_key, product_type, customer_type, company_name,
    organization_number, vat_number, country, billing_address, billing_email,
    reference, purchase_order_number, validation_status, validation_source,
    registry_company_name, subtotal_amount, vat_rate, vat_amount, total_amount,
    currency, reverse_charge, reverse_charge_note, payment_provider,
    subscription_reference, domain_license_reference, business_pack_reference,
    tax_configuration, session_status
  ) values (
    v_company_id, v_session_key,
    coalesce(p_payload->>'product_type', 'subscription'),
    v_customer_type,
    coalesce(p_payload->>'company_name', ''),
    coalesce(p_payload->>'organization_number', ''),
    coalesce(p_payload->>'vat_number', coalesce(p_payload->>'organization_number', '')),
    v_country,
    coalesce(p_payload->>'billing_address', ''),
    coalesce(p_payload->>'billing_email', ''),
    coalesce(p_payload->>'reference', ''),
    coalesce(p_payload->>'purchase_order_number', ''),
    v_validation_status, v_validation_source,
    coalesce(p_payload->>'registry_company_name', ''),
    v_subtotal,
    (v_tax->>'vat_rate')::numeric,
    (v_tax->>'vat_amount')::numeric,
    (v_tax->>'total_amount')::numeric,
    coalesce(p_payload->>'currency', 'NOK'),
    coalesce((v_tax->>'reverse_charge')::boolean, false),
    coalesce(v_tax->>'reverse_charge_note', ''),
    coalesce(p_payload->>'payment_provider', 'stripe'),
    coalesce(p_payload->>'subscription_reference', ''),
    coalesce(p_payload->>'domain_license_reference', ''),
    coalesce(p_payload->>'business_pack_reference', ''),
    coalesce(p_payload->'tax_configuration', '{}'::jsonb),
    coalesce(p_payload->>'session_status', 'draft')
  )
  on conflict (company_id, session_key) do update set
    customer_type = excluded.customer_type,
    company_name = excluded.company_name,
    organization_number = excluded.organization_number,
    vat_number = excluded.vat_number,
    country = excluded.country,
    billing_address = excluded.billing_address,
    billing_email = excluded.billing_email,
    reference = excluded.reference,
    purchase_order_number = excluded.purchase_order_number,
    validation_status = excluded.validation_status,
    validation_source = excluded.validation_source,
    registry_company_name = excluded.registry_company_name,
    subtotal_amount = excluded.subtotal_amount,
    vat_rate = excluded.vat_rate,
    vat_amount = excluded.vat_amount,
    total_amount = excluded.total_amount,
    currency = excluded.currency,
    reverse_charge = excluded.reverse_charge,
    reverse_charge_note = excluded.reverse_charge_note,
    payment_provider = excluded.payment_provider,
    subscription_reference = excluded.subscription_reference,
    domain_license_reference = excluded.domain_license_reference,
    business_pack_reference = excluded.business_pack_reference,
    tax_configuration = excluded.tax_configuration,
    session_status = excluded.session_status;

  perform public._cvt585_log(v_company_id, 'customer_type_selected', 'Checkout session updated', p_payload);

  return jsonb_build_object(
    'ok', true,
    'session_key', v_session_key,
    'subtotal', v_subtotal,
    'vat_rate', v_tax->>'vat_rate',
    'vat_amount', v_tax->>'vat_amount',
    'total_amount', v_tax->>'total_amount',
    'reverse_charge', v_tax->>'reverse_charge',
    'reverse_charge_note', v_tax->>'reverse_charge_note',
    'legal_review_required', true
  );
end; $$;

create or replace function public.get_checkout_vat_session(p_session_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_company_id uuid; v_row public.checkout_vat_sessions%rowtype;
begin
  v_company_id := public._cvt585_company();
  if v_company_id is null then return jsonb_build_object('found', false); end if;

  select * into v_row from public.checkout_vat_sessions
  where company_id = v_company_id and session_key = p_session_key;

  if not found then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'session_key', v_row.session_key,
    'product_type', v_row.product_type,
    'customer_type', v_row.customer_type,
    'company_name', v_row.company_name,
    'organization_number', v_row.organization_number,
    'vat_number', v_row.vat_number,
    'country', v_row.country,
    'billing_address', v_row.billing_address,
    'billing_email', v_row.billing_email,
    'reference', v_row.reference,
    'purchase_order_number', v_row.purchase_order_number,
    'validation_status', v_row.validation_status,
    'validation_source', v_row.validation_source,
    'registry_company_name', v_row.registry_company_name,
    'subtotal', v_row.subtotal_amount,
    'vat_rate', v_row.vat_rate,
    'vat_amount', v_row.vat_amount,
    'total', v_row.total_amount,
    'currency', v_row.currency,
    'reverse_charge', v_row.reverse_charge,
    'reverse_charge_note', v_row.reverse_charge_note,
    'payment_provider', v_row.payment_provider,
    'session_status', v_row.session_status,
    'legal_review_required', true
  );
end; $$;

create or replace function public.finalize_checkout_vat_session(p_session_key text, p_payment_reference text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_company_id uuid;
  v_row public.checkout_vat_sessions%rowtype;
  v_invoice_ref text;
begin
  v_company_id := public._cvt585_company();
  if v_company_id is null then raise exception 'Company not found'; end if;

  select * into v_row from public.checkout_vat_sessions
  where company_id = v_company_id and session_key = p_session_key for update;

  if not found then raise exception 'Checkout session not found'; end if;

  v_invoice_ref := format('INV-CVT-%s', substr(replace(p_session_key, '-', ''), 1, 12));

  update public.checkout_vat_sessions
  set session_status = 'confirmed',
      payment_provider_reference = coalesce(nullif(p_payment_reference, ''), payment_provider_reference)
  where id = v_row.id;

  insert into public.checkout_vat_invoice_records (
    company_id, session_key, invoice_reference, customer_type, company_name,
    organization_number, vat_number, validation_status, validation_source,
    country, billing_address, vat_rate, vat_amount, reverse_charge,
    payment_provider_reference, subscription_reference, domain_license_reference,
    business_pack_reference, tax_notes
  ) values (
    v_company_id, v_row.session_key, v_invoice_ref, v_row.customer_type, v_row.company_name,
    v_row.organization_number, v_row.vat_number, v_row.validation_status, v_row.validation_source,
    v_row.country, v_row.billing_address, v_row.vat_rate, v_row.vat_amount, v_row.reverse_charge,
    coalesce(nullif(p_payment_reference, ''), v_row.payment_provider_reference),
    v_row.subscription_reference, v_row.domain_license_reference, v_row.business_pack_reference,
    case when v_row.reverse_charge then v_row.reverse_charge_note else '' end
  );

  if v_row.reverse_charge then
    perform public._cvt585_log(v_company_id, 'reverse_charge_applied', 'Reverse charge applied', jsonb_build_object('session_key', p_session_key));
  end if;

  perform public._cvt585_log(v_company_id, 'vat_applied', 'VAT applied to checkout', jsonb_build_object('session_key', p_session_key, 'vat_rate', v_row.vat_rate));
  perform public._cvt585_log(v_company_id, 'invoice_generated', 'Checkout invoice tax record created', jsonb_build_object('invoice_reference', v_invoice_ref));

  return jsonb_build_object('ok', true, 'invoice_reference', v_invoice_ref, 'session_status', 'confirmed');
end; $$;

create or replace function public.get_platform_checkout_tax_verification_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_sessions jsonb;
  v_validations jsonb;
  v_invoices jsonb;
  v_audit jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'session_key', s.session_key, 'company_id', s.company_id,
    'customer_type', s.customer_type, 'company_name', s.company_name,
    'organization_number', s.organization_number, 'vat_number', s.vat_number,
    'country', s.country, 'validation_status', s.validation_status,
    'validation_source', s.validation_source, 'vat_rate', s.vat_rate,
    'vat_amount', s.vat_amount, 'reverse_charge', s.reverse_charge,
    'session_status', s.session_status, 'product_type', s.product_type
  ) order by s.session_key desc), '[]'::jsonb)
  into v_sessions
  from (
    select * from public.checkout_vat_sessions order by id desc limit 50
  ) s;

  select coalesce(jsonb_agg(jsonb_build_object(
    'business_number', v.business_number, 'country', v.country,
    'validation_source', v.validation_source, 'validation_status', v.validation_status,
    'registry_name', v.registry_name, 'created_at', v.created_at
  ) order by v.created_at desc), '[]'::jsonb)
  into v_validations
  from (
    select * from public.checkout_vat_validations order by created_at desc limit 50
  ) v;

  select coalesce(jsonb_agg(jsonb_build_object(
    'invoice_reference', i.invoice_reference, 'customer_type', i.customer_type,
    'company_name', i.company_name, 'vat_number', i.vat_number,
    'validation_status', i.validation_status, 'vat_rate', i.vat_rate,
    'vat_amount', i.vat_amount, 'reverse_charge', i.reverse_charge,
    'tax_notes', i.tax_notes, 'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb)
  into v_invoices
  from (
    select * from public.checkout_vat_invoice_records order by created_at desc limit 50
  ) i;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary,
    'company_id', a.company_id, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.checkout_vat_audit_logs order by created_at desc limit 50
  ) a;

  return jsonb_build_object(
    'found', true,
    'legal_review_required', true,
    'legal_review_note', 'Review checkout VAT logic with accounting and legal before public launch.',
    'principle', 'Checkout must be simple for customers. Tax handling must be strict for Aipify.',
    'sessions', v_sessions,
    'validations', v_validations,
    'invoices', v_invoices,
    'audit_recent', v_audit,
    'stats', jsonb_build_object(
      'total_sessions', (select count(*) from public.checkout_vat_sessions),
      'reverse_charge_count', (select count(*) from public.checkout_vat_sessions where reverse_charge),
      'invalid_validations', (select count(*) from public.checkout_vat_validations where validation_status = 'invalid'),
      'service_failures', (select count(*) from public.checkout_vat_validations where validation_status = 'service_unavailable')
    )
  );
end; $$;

grant execute on function public.calculate_checkout_vat_tax(jsonb) to authenticated;
grant execute on function public.record_checkout_vat_validation(jsonb) to authenticated;
grant execute on function public.upsert_checkout_vat_session(jsonb) to authenticated;
grant execute on function public.get_checkout_vat_session(text) to authenticated;
grant execute on function public.finalize_checkout_vat_session(text, text) to authenticated;
grant execute on function public.get_platform_checkout_tax_verification_center() to authenticated;

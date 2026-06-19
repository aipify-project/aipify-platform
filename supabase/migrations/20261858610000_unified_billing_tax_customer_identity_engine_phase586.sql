-- Phase 586 — Unified Billing, Tax & Customer Identity Engine
-- Feature owner: CUSTOMER APP + PLATFORM ADMIN
-- Routes: /app/billing · /app/billing/profile · /platform/billing/*
-- Helpers: _ube586_*
-- Integrates Phase 585 checkout VAT (VIES + Brønnøysund)

create table if not exists public.aipify_unified_billing_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  multiple_profiles_enabled boolean not null default true,
  billing_advisor_enabled boolean not null default true,
  commission_attribution_enabled boolean not null default true,
  accounting_export_enabled boolean not null default true,
  refund_approval_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.aipify_unified_billing_settings enable row level security;
revoke all on public.aipify_unified_billing_settings from authenticated, anon;

create table if not exists public.aipify_billing_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  profile_label text not null default 'Primary',
  customer_type text not null default 'business' check (
    customer_type in (
      'private_person', 'business', 'enterprise', 'growth_partner', 'provider', 'internal_platform'
    )
  ),
  legal_name text not null default '',
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  country text not null default 'NO',
  billing_address text not null default '',
  billing_email text not null default '',
  invoice_email text not null default '',
  payment_method text not null default 'stripe' check (
    payment_method in ('stripe', 'klarna', 'vipps', 'dnb_invoice', 'manual', 'none')
  ),
  tax_status text not null default 'pending' check (
    tax_status in ('pending', 'valid', 'invalid', 'unavailable', 'manual_review_required')
  ),
  validation_status text not null default 'pending' check (
    validation_status in ('pending', 'valid', 'invalid', 'unavailable', 'manual_review_required')
  ),
  validation_source text not null default '',
  payment_provider_customer_id text not null default '',
  accounting_customer_id text not null default '',
  is_primary boolean not null default false,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_key)
);

create index if not exists aipify_billing_profiles_org_idx
  on public.aipify_billing_profiles (organization_id, is_primary desc, updated_at desc);

alter table public.aipify_billing_profiles enable row level security;
revoke all on public.aipify_billing_profiles from authenticated, anon;

create table if not exists public.aipify_billing_profile_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid references public.aipify_billing_profiles (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_billing_profile_audit_logs enable row level security;
revoke all on public.aipify_billing_profile_audit_logs from authenticated, anon;

create table if not exists public.aipify_billing_subscription_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  subscription_key text not null,
  billing_profile_id uuid references public.aipify_billing_profiles (id) on delete set null,
  plan_key text not null default 'starter',
  subscription_status text not null default 'trial' check (
    subscription_status in (
      'trial', 'active', 'grace_period', 'past_due', 'suspended', 'cancelled', 'expired'
    )
  ),
  start_date date,
  renewal_date date,
  payment_provider text not null default 'stripe',
  payment_provider_subscription_id text not null default '',
  tax_status text not null default 'pending',
  license_status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, subscription_key)
);

alter table public.aipify_billing_subscription_registry enable row level security;
revoke all on public.aipify_billing_subscription_registry from authenticated, anon;

create table if not exists public.aipify_billing_invoice_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invoice_key text not null,
  billing_profile_id uuid references public.aipify_billing_profiles (id) on delete set null,
  customer_type text not null default 'business',
  company_or_person_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  country text not null default 'NO',
  billing_address text not null default '',
  invoice_lines jsonb not null default '[]'::jsonb,
  subtotal_amount numeric(12, 2) not null default 0,
  vat_rate numeric(5, 2) not null default 0,
  vat_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  reverse_charge boolean not null default false,
  reverse_charge_note text not null default '',
  payment_provider_reference text not null default '',
  subscription_reference text not null default '',
  license_reference text not null default '',
  domain_reference text not null default '',
  business_pack_reference text not null default '',
  invoice_status text not null default 'draft' check (
    invoice_status in ('draft', 'sent', 'paid', 'overdue', 'failed', 'cancelled', 'refunded')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, invoice_key)
);

alter table public.aipify_billing_invoice_records enable row level security;
revoke all on public.aipify_billing_invoice_records from authenticated, anon;

create table if not exists public.aipify_billing_license_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  license_key text not null,
  license_type text not null check (
    license_type in (
      'app_subscription', 'domain_license', 'business_pack', 'user_capacity', 'connector_addon'
    )
  ),
  billing_profile_id uuid references public.aipify_billing_profiles (id) on delete set null,
  subscription_registry_id uuid references public.aipify_billing_subscription_registry (id) on delete set null,
  invoice_id uuid references public.aipify_billing_invoice_records (id) on delete set null,
  domain_reference text not null default '',
  purchased_capacity integer not null default 0,
  used_capacity integer not null default 0,
  license_status text not null default 'pending' check (
    license_status in ('pending', 'active', 'suspended', 'expired', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, license_key)
);

alter table public.aipify_billing_license_links enable row level security;
revoke all on public.aipify_billing_license_links from authenticated, anon;

create table if not exists public.aipify_billing_partner_attributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  attribution_key text not null,
  partner_profile_id uuid,
  partner_public_id text not null default '',
  lead_source text not null default '',
  partner_link text not null default '',
  customer_registered_at timestamptz,
  purchase_completed_at timestamptz,
  subscription_registry_id uuid references public.aipify_billing_subscription_registry (id) on delete set null,
  invoice_id uuid references public.aipify_billing_invoice_records (id) on delete set null,
  commission_rule text not null default '',
  commission_amount numeric(12, 2) not null default 0,
  commission_status text not null default 'pending' check (
    commission_status in ('pending', 'eligible', 'approved', 'paid', 'not_eligible', 'clawback')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, attribution_key)
);

alter table public.aipify_billing_partner_attributions enable row level security;
revoke all on public.aipify_billing_partner_attributions from authenticated, anon;

create table if not exists public.aipify_billing_refunds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  refund_key text not null,
  invoice_id uuid references public.aipify_billing_invoice_records (id) on delete set null,
  refund_type text not null default 'full' check (refund_type in ('full', 'partial')),
  refund_status text not null default 'requested' check (
    refund_status in ('requested', 'pending_approval', 'approved', 'processed', 'rejected', 'failed')
  ),
  amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  reason text not null default '',
  payment_provider_reference text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, refund_key)
);

alter table public.aipify_billing_refunds enable row level security;
revoke all on public.aipify_billing_refunds from authenticated, anon;

create table if not exists public.aipify_billing_credit_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  credit_note_key text not null,
  invoice_id uuid references public.aipify_billing_invoice_records (id) on delete set null,
  refund_id uuid references public.aipify_billing_refunds (id) on delete set null,
  amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  credit_status text not null default 'draft' check (
    credit_status in ('draft', 'issued', 'exported', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, credit_note_key)
);

alter table public.aipify_billing_credit_notes enable row level security;
revoke all on public.aipify_billing_credit_notes from authenticated, anon;

create table if not exists public.aipify_billing_accounting_exports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  export_key text not null unique,
  export_target text not null check (
    export_target in ('fiken', 'stripe', 'klarna', 'vipps', 'dnb_invoice', 'generic')
  ),
  export_status text not null default 'pending' check (
    export_status in ('pending', 'processing', 'completed', 'failed')
  ),
  export_scope text not null default 'invoices' check (
    export_scope in ('customers', 'invoices', 'payments', 'refunds', 'vat', 'commissions', 'payouts', 'credit_notes', 'full')
  ),
  record_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_billing_accounting_exports enable row level security;
revoke all on public.aipify_billing_accounting_exports from authenticated, anon;

create table if not exists public.aipify_billing_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  event_type text not null,
  event_status text not null default 'recorded' check (
    event_status in ('recorded', 'processed', 'failed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_billing_events_org_idx
  on public.aipify_billing_events (organization_id, created_at desc);

create index if not exists aipify_billing_events_type_idx
  on public.aipify_billing_events (event_type, created_at desc);

alter table public.aipify_billing_events enable row level security;
revoke all on public.aipify_billing_events from authenticated, anon;

create table if not exists public.aipify_billing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  audit_category text not null default 'unified_billing',
  event_type text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_billing_audit_logs_org_idx
  on public.aipify_billing_audit_logs (organization_id, created_at desc);

alter table public.aipify_billing_audit_logs enable row level security;
revoke all on public.aipify_billing_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public._ube586_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ube586_is_billing_admin(p_org_id uuid)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from public.users where auth_user_id = auth.uid() limit 1;
  if v_user_id is null then return false; end if;

  if exists (
    select 1 from public.users u
    where u.id = v_user_id and u.company_id = p_org_id
      and u.role in ('owner', 'admin')
  ) then
    return true;
  end if;

  if to_regclass('public.organization_users') is not null then
    return exists (
      select 1 from public.organization_users ou
      where ou.organization_id = p_org_id
        and ou.user_id = v_user_id
        and ou.status = 'active'
        and ou.role in ('owner', 'administrator')
    );
  end if;

  return false;
end;
$$;

create or replace function public._ube586_log(
  p_org_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb,
  p_category text default 'unified_billing'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_billing_audit_logs (
    organization_id, actor_user_id, audit_category, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    coalesce(p_category, 'unified_billing'),
    p_event_type,
    p_summary,
    coalesce(p_context, '{}'::jsonb)
  );
end;
$$;

create or replace function public._ube586_record_event(
  p_org_id uuid,
  p_event_type text,
  p_summary text,
  p_payload jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  insert into public.aipify_billing_events (organization_id, event_type, summary, payload)
  values (p_org_id, p_event_type, p_summary, coalesce(p_payload, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._ube586_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_unified_billing_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end;
$$;

create or replace function public._ube586_map_checkout_customer_type(p_type text)
returns text language sql immutable as $$
  select case lower(coalesce(p_type, 'business'))
    when 'private_person' then 'private'
    when 'private' then 'private'
    else 'business'
  end;
$$;

create or replace function public._ube586_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ube586_ensure_settings(p_org_id);

  if exists (select 1 from public.aipify_billing_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.aipify_billing_profiles (
    organization_id, profile_key, profile_label, customer_type,
    company_name, country, billing_email, invoice_email,
    payment_method, tax_status, validation_status, is_primary
  )
  select
    p_org_id,
    'primary',
    'Primary billing profile',
    case when c.customer_type = 'private' then 'private_person' else 'business' end,
    coalesce(c.company_name, c.full_name, 'Customer'),
    coalesce(c.country, 'NO'),
    coalesce(c.email, ''),
    coalesce(c.email, ''),
    'stripe',
    'pending',
    'pending',
    true
  from public.customers c
  where c.id = p_org_id
  on conflict do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tax engine (delegates to Phase 585)
-- ---------------------------------------------------------------------------

create or replace function public.calculate_aipify_unified_tax(p_payload jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_mapped jsonb;
  v_result jsonb;
begin
  v_org_id := public._ube586_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  v_mapped := coalesce(p_payload, '{}'::jsonb)
    || jsonb_build_object(
      'customer_type', public._ube586_map_checkout_customer_type(p_payload->>'customer_type')
    );

  v_result := public.calculate_checkout_vat_tax(v_mapped);

  perform public._ube586_record_event(
    v_org_id,
    'tax.validation.requested',
    'Unified tax calculation requested',
    jsonb_build_object('customer_type', p_payload->>'customer_type', 'country', p_payload->>'country')
  );

  return v_result || jsonb_build_object(
    'engine', 'unified_billing_tax',
    'aipify_owned', true,
    'payment_provider_role', 'processor_only'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Billing profile upsert
-- ---------------------------------------------------------------------------

create or replace function public.upsert_aipify_billing_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
  v_key text := coalesce(nullif(trim(p_payload->>'profile_key'), ''), 'primary');
  v_is_new boolean := false;
begin
  v_org_id := public._ube586_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  if not public._ube586_is_billing_admin(v_org_id) then
    return jsonb_build_object('found', false, 'error', 'Billing admin permission required');
  end if;

  perform public._ube586_ensure_settings(v_org_id);

  insert into public.aipify_billing_profiles (
    organization_id, profile_key, profile_label, customer_type,
    legal_name, company_name, organization_number, vat_number,
    country, billing_address, billing_email, invoice_email,
    payment_method, tax_status, validation_status, validation_source,
    payment_provider_customer_id, accounting_customer_id, is_primary, is_active
  ) values (
    v_org_id,
    v_key,
    coalesce(nullif(trim(p_payload->>'profile_label'), ''), 'Billing profile'),
    coalesce(nullif(trim(p_payload->>'customer_type'), ''), 'business'),
    coalesce(p_payload->>'legal_name', ''),
    coalesce(p_payload->>'company_name', ''),
    coalesce(p_payload->>'organization_number', ''),
    coalesce(p_payload->>'vat_number', ''),
    upper(coalesce(nullif(trim(p_payload->>'country'), ''), 'NO')),
    coalesce(p_payload->>'billing_address', ''),
    coalesce(p_payload->>'billing_email', ''),
    coalesce(p_payload->>'invoice_email', coalesce(p_payload->>'billing_email', '')),
    coalesce(nullif(trim(p_payload->>'payment_method'), ''), 'stripe'),
    coalesce(nullif(trim(p_payload->>'tax_status'), ''), 'pending'),
    coalesce(nullif(trim(p_payload->>'validation_status'), ''), 'pending'),
    coalesce(p_payload->>'validation_source', ''),
    coalesce(p_payload->>'payment_provider_customer_id', ''),
    coalesce(p_payload->>'accounting_customer_id', ''),
    coalesce((p_payload->>'is_primary')::boolean, false),
    coalesce((p_payload->>'is_active')::boolean, true)
  )
  on conflict (organization_id, profile_key) do update set
    profile_label = excluded.profile_label,
    customer_type = excluded.customer_type,
    legal_name = excluded.legal_name,
    company_name = excluded.company_name,
    organization_number = excluded.organization_number,
    vat_number = excluded.vat_number,
    country = excluded.country,
    billing_address = excluded.billing_address,
    billing_email = excluded.billing_email,
    invoice_email = excluded.invoice_email,
    payment_method = excluded.payment_method,
    tax_status = excluded.tax_status,
    validation_status = excluded.validation_status,
    validation_source = excluded.validation_source,
    payment_provider_customer_id = excluded.payment_provider_customer_id,
    accounting_customer_id = excluded.accounting_customer_id,
    is_primary = excluded.is_primary,
    is_active = excluded.is_active,
    updated_at = now()
  returning id, (xmax = 0) into v_profile_id, v_is_new;

  if coalesce((p_payload->>'is_primary')::boolean, false) then
    update public.aipify_billing_profiles
    set is_primary = false, updated_at = now()
    where organization_id = v_org_id and id <> v_profile_id;
    update public.aipify_billing_profiles set is_primary = true where id = v_profile_id;
  end if;

  insert into public.aipify_billing_profile_audit_logs (
    organization_id, profile_id, actor_user_id, event_type, summary, context
  ) values (
    v_org_id, v_profile_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    case when v_is_new then 'billing.profile.created' else 'billing.profile.updated' end,
    case when v_is_new then 'Billing profile created' else 'Billing profile updated' end,
    jsonb_build_object('profile_key', v_key)
  );

  perform public._ube586_record_event(
    v_org_id,
    case when v_is_new then 'billing.profile.created' else 'billing.profile.updated' end,
    case when v_is_new then 'Billing profile created' else 'Billing profile updated' end,
    jsonb_build_object('profile_id', v_profile_id, 'profile_key', v_key)
  );
  perform public._ube586_log(
    v_org_id,
    case when v_is_new then 'billing_profile_created' else 'billing_profile_updated' end,
    case when v_is_new then 'Billing profile created' else 'Billing profile updated' end,
    jsonb_build_object('profile_key', v_key),
    'billing_profile'
  );

  return jsonb_build_object('found', true, 'profile_id', v_profile_id, 'profile_key', v_key);
end;
$$;

-- ---------------------------------------------------------------------------
-- Customer billing center
-- ---------------------------------------------------------------------------

create or replace function public.get_customer_unified_billing_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profiles jsonb;
  v_subscriptions jsonb;
  v_invoices jsonb;
  v_licenses jsonb;
  v_events jsonb;
begin
  v_org_id := public._ube586_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._ube586_seed(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'profile_key', p.profile_key, 'profile_label', p.profile_label,
    'customer_type', p.customer_type, 'company_name', p.company_name,
    'vat_number', p.vat_number, 'country', p.country, 'tax_status', p.tax_status,
    'validation_status', p.validation_status, 'is_primary', p.is_primary
  ) order by p.is_primary desc, p.profile_label), '[]'::jsonb)
  into v_profiles
  from public.aipify_billing_profiles p
  where p.organization_id = v_org_id and p.is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
    'subscription_key', s.subscription_key, 'plan_key', s.plan_key,
    'subscription_status', s.subscription_status, 'renewal_date', s.renewal_date,
    'payment_provider', s.payment_provider, 'license_status', s.license_status
  ) order by s.updated_at desc), '[]'::jsonb)
  into v_subscriptions
  from public.aipify_billing_subscription_registry s
  where s.organization_id = v_org_id;

  if jsonb_array_length(coalesce(v_subscriptions, '[]'::jsonb)) = 0 and to_regclass('public.subscriptions') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'subscription_key', sub.id::text,
      'plan_key', coalesce(sub.plan_name, sub.plan_type),
      'subscription_status', sub.status,
      'renewal_date', sub.trial_ends_at,
      'payment_provider', 'stripe',
      'license_status', sub.status
    ) order by sub.created_at desc), '[]'::jsonb)
    into v_subscriptions
    from public.subscriptions sub
    where sub.customer_id = v_org_id;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'invoice_key', i.invoice_key, 'total_amount', i.total_amount, 'currency', i.currency,
    'invoice_status', i.invoice_status, 'vat_amount', i.vat_amount, 'created_at', i.created_at
  ) order by i.created_at desc), '[]'::jsonb)
  into v_invoices
  from public.aipify_billing_invoice_records i
  where i.organization_id = v_org_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'license_key', l.license_key, 'license_type', l.license_type,
    'purchased_capacity', l.purchased_capacity, 'used_capacity', l.used_capacity,
    'license_status', l.license_status, 'domain_reference', l.domain_reference
  ) order by l.updated_at desc), '[]'::jsonb)
  into v_licenses
  from public.aipify_billing_license_links l
  where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', e.event_type, 'summary', e.summary, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb)
  into v_events
  from (
    select * from public.aipify_billing_events
    where organization_id = v_org_id
    order by created_at desc
    limit 15
  ) e;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify owns the billing truth. Payment providers process payments.',
    'privacy_note', 'Billing metadata only — no raw payment card data stored.',
    'can_manage_profiles', public._ube586_is_billing_admin(v_org_id),
    'profiles', coalesce(v_profiles, '[]'::jsonb),
    'subscriptions', coalesce(v_subscriptions, '[]'::jsonb),
    'invoices', coalesce(v_invoices, '[]'::jsonb),
    'licenses', coalesce(v_licenses, '[]'::jsonb),
    'recent_events', coalesce(v_events, '[]'::jsonb),
    'checkout_flow', jsonb_build_array(
      'select_product', 'select_domain', 'select_billing_profile', 'confirm_customer_type',
      'validate_tax', 'calculate_vat', 'select_payment_method', 'payment',
      'subscription_created', 'license_activated', 'invoice_generated', 'audit_logged'
    ),
    'stats', jsonb_build_object(
      'profile_count', jsonb_array_length(coalesce(v_profiles, '[]'::jsonb)),
      'active_subscriptions', (
        select count(*) from jsonb_array_elements(coalesce(v_subscriptions, '[]'::jsonb)) s
        where s->>'subscription_status' in ('active', 'trial', 'grace_period')
      ),
      'overdue_invoices', (
        select count(*) from public.aipify_billing_invoice_records
        where organization_id = v_org_id and invoice_status = 'overdue'
      ),
      'available_user_capacity', coalesce((
        select sum(greatest(purchased_capacity - used_capacity, 0))
        from public.aipify_billing_license_links
        where organization_id = v_org_id and license_type = 'user_capacity'
      ), 0)
    )
  );
end;
$$;

create or replace function public.get_customer_unified_billing_profile_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_center jsonb;
begin
  v_center := public.get_customer_unified_billing_center();
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_org_id := public._ube586_org();

  return v_center || jsonb_build_object(
    'customer_types', jsonb_build_array(
      'private_person', 'business', 'enterprise', 'growth_partner', 'provider', 'internal_platform'
    ),
    'validation_states', jsonb_build_array(
      'pending', 'valid', 'invalid', 'unavailable', 'manual_review_required'
    ),
    'payment_methods', jsonb_build_array('stripe', 'klarna', 'vipps', 'dnb_invoice'),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_billing_profile_audit_logs
        where organization_id = v_org_id
        order by created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'multiple_profiles_enabled', coalesce((
      select multiple_profiles_enabled from public.aipify_unified_billing_settings where organization_id = v_org_id
    ), true)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Companion billing advisor
-- ---------------------------------------------------------------------------

create or replace function public.get_aipify_billing_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_customer_unified_billing_center();
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'subscription_status',
        'observation', format('You have %s billing profile(s) and %s active subscription(s).',
          v_stats->>'profile_count', v_stats->>'active_subscriptions'),
        'recommendation', 'Review subscription and billing profile at /app/billing.',
        'href', '/app/billing'
      ),
      jsonb_build_object(
        'key', 'user_capacity',
        'observation', format('%s user license capacity available.', v_stats->>'available_user_capacity'),
        'recommendation', 'Upgrade before adding users beyond purchased capacity.',
        'href', '/app/billing/upgrade'
      ),
      jsonb_build_object(
        'key', 'tax_engine',
        'observation', 'Aipify calculates VAT before payment providers process checkout.',
        'recommendation', 'Confirm billing profile tax status before Business Pack or domain purchases.',
        'href', '/app/billing/profile'
      )
    ),
    'center', v_center
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Platform unified billing admin
-- ---------------------------------------------------------------------------

create or replace function public.get_platform_unified_billing_admin_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_rows jsonb := '[]'::jsonb;
  v_stats jsonb := '{}'::jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true,
      'section', v_section,
      'principle', 'Aipify owns billing truth. Payment providers process. Accounting systems record.',
      'modules', jsonb_build_array(
        jsonb_build_object('id', 'customers', 'stat', (select count(*) from public.aipify_billing_profiles)),
        jsonb_build_object('id', 'billing_profiles', 'stat', (select count(*) from public.aipify_billing_profiles)),
        jsonb_build_object('id', 'subscriptions', 'stat', (select count(*) from public.aipify_billing_subscription_registry)),
        jsonb_build_object('id', 'invoices', 'stat', (select count(*) from public.aipify_billing_invoice_records)),
        jsonb_build_object('id', 'payments', 'stat', (select count(*) from public.payment_profiles)),
        jsonb_build_object('id', 'tax_verification', 'stat', (select count(*) from public.checkout_vat_sessions)),
        jsonb_build_object('id', 'licenses', 'stat', (select count(*) from public.aipify_billing_license_links)),
        jsonb_build_object('id', 'commissions', 'stat', (select count(*) from public.aipify_billing_partner_attributions)),
        jsonb_build_object('id', 'accounting_export', 'stat', (select count(*) from public.aipify_billing_accounting_exports)),
        jsonb_build_object('id', 'disputes', 'stat', (select count(*) from public.aipify_billing_refunds where refund_status in ('requested', 'pending_approval'))),
        jsonb_build_object('id', 'reports', 'stat', (select count(*) from public.aipify_billing_events))
      )
    );
  end if;

  if v_section in ('customers', 'billing_profiles') then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', p.organization_id, 'profile_key', p.profile_key,
      'profile_label', p.profile_label, 'customer_type', p.customer_type,
      'company_name', p.company_name, 'vat_number', p.vat_number,
      'tax_status', p.tax_status, 'validation_status', p.validation_status,
      'is_primary', p.is_primary
    ) order by p.updated_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_profiles order by updated_at desc limit 100) p;
    v_stats := jsonb_build_object('total', jsonb_array_length(coalesce(v_rows, '[]'::jsonb)));
  elsif v_section = 'subscriptions' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', s.organization_id, 'subscription_key', s.subscription_key,
      'plan_key', s.plan_key, 'subscription_status', s.subscription_status,
      'renewal_date', s.renewal_date, 'license_status', s.license_status
    ) order by s.updated_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_subscription_registry order by updated_at desc limit 100) s;
  elsif v_section = 'invoices' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', i.organization_id, 'invoice_key', i.invoice_key,
      'total_amount', i.total_amount, 'currency', i.currency,
      'invoice_status', i.invoice_status, 'vat_amount', i.vat_amount
    ) order by i.created_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_invoice_records order by created_at desc limit 100) i;
  elsif v_section = 'licenses' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', l.organization_id, 'license_key', l.license_key,
      'license_type', l.license_type, 'purchased_capacity', l.purchased_capacity,
      'used_capacity', l.used_capacity, 'license_status', l.license_status,
      'domain_reference', l.domain_reference
    ) order by l.updated_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_license_links order by updated_at desc limit 100) l;
  elsif v_section = 'commissions' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', a.organization_id, 'partner_public_id', a.partner_public_id,
      'commission_amount', a.commission_amount, 'commission_status', a.commission_status,
      'lead_source', a.lead_source
    ) order by a.updated_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_partner_attributions order by updated_at desc limit 100) a;
  elsif v_section = 'accounting_export' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'export_key', e.export_key, 'export_target', e.export_target,
      'export_scope', e.export_scope, 'export_status', e.export_status,
      'record_count', e.record_count, 'created_at', e.created_at
    ) order by e.created_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_accounting_exports order by created_at desc limit 100) e;
  elsif v_section = 'disputes' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'organization_id', r.organization_id, 'refund_key', r.refund_key,
      'refund_type', r.refund_type, 'refund_status', r.refund_status,
      'amount', r.amount, 'currency', r.currency
    ) order by r.created_at desc), '[]'::jsonb)
    into v_rows
    from (select * from public.aipify_billing_refunds order by created_at desc limit 100) r;
  elsif v_section = 'reports' then
    v_stats := jsonb_build_object(
      'revenue_invoices', (select count(*) from public.aipify_billing_invoice_records where invoice_status = 'paid'),
      'vat_sessions', (select count(*) from public.checkout_vat_sessions),
      'partner_commissions', (select count(*) from public.aipify_billing_partner_attributions),
      'refunds', (select count(*) from public.aipify_billing_refunds),
      'credit_notes', (select count(*) from public.aipify_billing_credit_notes),
      'accounting_exports', (select count(*) from public.aipify_billing_accounting_exports)
    );
  else
    return public.get_platform_billing_commerce_center(v_section);
  end if;

  return jsonb_build_object(
    'found', true,
    'section', v_section,
    'rows', coalesce(v_rows, '[]'::jsonb),
    'stats', coalesce(v_stats, '{}'::jsonb)
  );
end;
$$;

grant execute on function public.calculate_aipify_unified_tax(jsonb) to authenticated;
grant execute on function public.upsert_aipify_billing_profile(jsonb) to authenticated;
grant execute on function public.get_customer_unified_billing_center() to authenticated;
grant execute on function public.get_customer_unified_billing_profile_center() to authenticated;
grant execute on function public.get_aipify_billing_advisor_bundle() to authenticated;
grant execute on function public.get_platform_unified_billing_admin_center(text) to authenticated;

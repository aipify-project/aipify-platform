-- Phase 264 — Enterprise Invoice & DNB Billing Engine

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_billing_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  company_name text not null default '',
  organization_number text not null default '',
  vat_number text not null default '',
  billing_address jsonb not null default '{}'::jsonb,
  invoice_email text not null default '',
  ap_contact_name text not null default '',
  ap_contact_email text not null default '',
  purchase_order_number text not null default '',
  internal_reference text not null default '',
  payment_terms text not null default 'net_30' check (
    payment_terms in ('due_on_receipt', 'net_7', 'net_14', 'net_30', 'net_60', 'custom')
  ),
  payment_terms_custom text not null default '',
  preferred_currency text not null default 'NOK',
  billing_language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid,
  unique (tenant_id)
);

create index if not exists enterprise_billing_profiles_tenant_idx
  on public.enterprise_billing_profiles (tenant_id);

create table if not exists public.enterprise_billing_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  access_unlock_policy text not null default 'contract_approval' check (
    access_unlock_policy in ('contract_approval', 'invoice_sent', 'payment_received')
  ),
  auto_send_invoices boolean not null default false,
  require_approval_before_send boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id)
);

create table if not exists public.enterprise_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies (id) on delete cascade,
  invoice_number text not null,
  status text not null default 'draft' check (
    status in (
      'draft', 'sent', 'viewed', 'approved', 'partially_paid', 'paid',
      'overdue', 'reminder_sent', 'disputed', 'cancelled', 'credited'
    )
  ),
  plan_key text,
  description text not null default '',
  amount numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  payment_terms text not null default 'net_30',
  due_date date,
  purchase_order_number text not null default '',
  internal_reference text not null default '',
  billing_snapshot jsonb not null default '{}'::jsonb,
  dnb_kid text not null default '',
  bank_reference text not null default '',
  billing_method text not null default 'invoice' check (billing_method in ('invoice', 'dnb_bank_transfer')),
  upgrade_event_id uuid,
  sent_at timestamptz,
  viewed_at timestamptz,
  approved_at timestamptz,
  paid_at timestamptz,
  credited_invoice_id uuid references public.enterprise_invoices (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  unique (tenant_id, invoice_number)
);

create index if not exists enterprise_invoices_tenant_status_idx
  on public.enterprise_invoices (tenant_id, status, created_at desc);

create index if not exists enterprise_invoices_due_date_idx
  on public.enterprise_invoices (due_date)
  where status in ('sent', 'viewed', 'approved', 'partially_paid', 'overdue', 'reminder_sent');

create table if not exists public.enterprise_invoice_notes (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.enterprise_invoices (id) on delete cascade,
  tenant_id uuid not null references public.companies (id) on delete cascade,
  note text not null,
  author_user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_invoice_notes_invoice_idx
  on public.enterprise_invoice_notes (invoice_id, created_at desc);

create table if not exists public.enterprise_invoice_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.companies (id) on delete set null,
  invoice_id uuid references public.enterprise_invoices (id) on delete set null,
  event_type text not null check (
    event_type in (
      'invoice_created', 'invoice_sent', 'invoice_viewed', 'invoice_approved',
      'invoice_paid', 'invoice_overdue', 'reminder_sent', 'payment_registered',
      'invoice_credited', 'billing_details_changed', 'payment_terms_changed',
      'po_number_changed', 'partial_payment_registered', 'invoice_disputed',
      'invoice_cancelled', 'invoice_escalated', 'upgrade_invoice_drafted'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_invoice_audit_logs_tenant_idx
  on public.enterprise_invoice_audit_logs (tenant_id, created_at desc);

create index if not exists enterprise_invoice_audit_logs_invoice_idx
  on public.enterprise_invoice_audit_logs (invoice_id, created_at desc);

alter table public.enterprise_billing_profiles enable row level security;
alter table public.enterprise_billing_policies enable row level security;
alter table public.enterprise_invoices enable row level security;
alter table public.enterprise_invoice_notes enable row level security;
alter table public.enterprise_invoice_audit_logs enable row level security;

revoke all on public.enterprise_billing_profiles from authenticated, anon;
revoke all on public.enterprise_billing_policies from authenticated, anon;
revoke all on public.enterprise_invoices from authenticated, anon;
revoke all on public.enterprise_invoice_notes from authenticated, anon;
revoke all on public.enterprise_invoice_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_invoice_dnb_billing_engine', v.description
from (values
  ('enterprise_invoice.view', 'View Enterprise Invoices', 'View enterprise invoice status and limited billing details'),
  ('enterprise_invoice.manage', 'Manage Enterprise Invoices', 'Create, send, and manage enterprise invoices and billing details'),
  ('enterprise_invoice.finance', 'Finance Admin — Enterprise Billing', 'Register payments, credit invoices, and manage financial terms')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'enterprise_invoice.view'), ('owner', 'enterprise_invoice.manage'), ('owner', 'enterprise_invoice.finance'),
  ('administrator', 'enterprise_invoice.view'), ('administrator', 'enterprise_invoice.manage'),
  ('manager', 'enterprise_invoice.view'),
  ('employee', 'enterprise_invoice.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 3. Helpers — _ei264_*
-- ---------------------------------------------------------------------------
create or replace function public._ei264_payment_terms_days(p_terms text)
returns integer
language sql
immutable
as $$
  select case p_terms
    when 'due_on_receipt' then 0
    when 'net_7' then 7
    when 'net_14' then 14
    when 'net_30' then 30
    when 'net_60' then 60
    else 30
  end;
$$;

create or replace function public._ei264_calculate_due_date(p_terms text, p_from date default current_date)
returns date
language sql
immutable
as $$
  select p_from + public._ei264_payment_terms_days(p_terms);
$$;

create or replace function public._ei264_log_audit(
  p_tenant_id uuid,
  p_invoice_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.enterprise_invoice_audit_logs (
    tenant_id, invoice_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_invoice_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._ei264_require_view(p_tenant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if public.is_platform_admin() then
    return coalesce(p_tenant_id, public._presence_tenant_for_auth());
  end if;

  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  begin
    perform public._irp_require_permission('enterprise_invoice.view', v_tenant_id);
  exception when others then
    perform public._irp_require_permission('subscription.view', v_tenant_id);
  end;

  return v_tenant_id;
end;
$$;

create or replace function public._ei264_require_manage(p_tenant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if public.is_platform_admin() then
    return coalesce(p_tenant_id, public._presence_tenant_for_auth());
  end if;

  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  begin
    perform public._irp_require_permission('enterprise_invoice.manage', v_tenant_id);
  exception when others then
    perform public._irp_require_permission('subscription.manage', v_tenant_id);
  end;

  return v_tenant_id;
end;
$$;

create or replace function public._ei264_require_finance(p_tenant_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if public.is_platform_admin() then
    return coalesce(p_tenant_id, public._presence_tenant_for_auth());
  end if;

  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  begin
    perform public._irp_require_permission('enterprise_invoice.finance', v_tenant_id);
  exception when others then
    perform public._irp_require_permission('subscription.manage', v_tenant_id);
  end;

  return v_tenant_id;
end;
$$;

create or replace function public._ei264_next_invoice_number(p_tenant_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_year text;
begin
  v_year := to_char(now(), 'YYYY');
  select count(*) + 1 into v_count
  from public.enterprise_invoices
  where tenant_id = p_tenant_id
    and extract(year from created_at) = extract(year from now());
  return format('EI-%s-%s-%04s', v_year, left(replace(p_tenant_id::text, '-', ''), 6), v_count);
end;
$$;

create or replace function public._ei264_build_profile_json(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile public.enterprise_billing_profiles;
  v_policy public.enterprise_billing_policies;
  v_company record;
begin
  select * into v_profile from public.enterprise_billing_profiles where tenant_id = p_tenant_id;
  select * into v_policy from public.enterprise_billing_policies where tenant_id = p_tenant_id;
  select id, name, slug into v_company from public.companies where id = p_tenant_id;

  return jsonb_build_object(
    'tenant_id', p_tenant_id,
    'company_name', coalesce(v_profile.company_name, v_company.name, ''),
    'organization_number', coalesce(v_profile.organization_number, ''),
    'vat_number', coalesce(v_profile.vat_number, ''),
    'billing_address', coalesce(v_profile.billing_address, '{}'::jsonb),
    'invoice_email', coalesce(v_profile.invoice_email, ''),
    'ap_contact_name', coalesce(v_profile.ap_contact_name, ''),
    'ap_contact_email', coalesce(v_profile.ap_contact_email, ''),
    'purchase_order_number', coalesce(v_profile.purchase_order_number, ''),
    'internal_reference', coalesce(v_profile.internal_reference, ''),
    'payment_terms', coalesce(v_profile.payment_terms, 'net_30'),
    'payment_terms_custom', coalesce(v_profile.payment_terms_custom, ''),
    'preferred_currency', coalesce(v_profile.preferred_currency, 'NOK'),
    'billing_language', coalesce(v_profile.billing_language, 'en'),
    'access_unlock_policy', coalesce(v_policy.access_unlock_policy, 'contract_approval'),
    'auto_send_invoices', coalesce(v_policy.auto_send_invoices, false),
    'require_approval_before_send', coalesce(v_policy.require_approval_before_send, true),
    'configured', v_profile.id is not null
  );
end;
$$;

create or replace function public._ei264_build_invoice_json(p_invoice public.enterprise_invoices)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company record;
begin
  select id, name, slug into v_company from public.companies where id = p_invoice.tenant_id;

  return jsonb_build_object(
    'id', p_invoice.id,
    'tenant_id', p_invoice.tenant_id,
    'tenant_name', coalesce(v_company.name, ''),
    'invoice_number', p_invoice.invoice_number,
    'status', p_invoice.status,
    'plan_key', p_invoice.plan_key,
    'description', p_invoice.description,
    'amount', p_invoice.amount,
    'tax_amount', p_invoice.tax_amount,
    'total_amount', p_invoice.total_amount,
    'amount_paid', p_invoice.amount_paid,
    'currency', p_invoice.currency,
    'payment_terms', p_invoice.payment_terms,
    'due_date', p_invoice.due_date,
    'purchase_order_number', p_invoice.purchase_order_number,
    'internal_reference', p_invoice.internal_reference,
    'billing_method', p_invoice.billing_method,
    'dnb_kid', p_invoice.dnb_kid,
    'bank_reference', p_invoice.bank_reference,
    'sent_at', p_invoice.sent_at,
    'viewed_at', p_invoice.viewed_at,
    'approved_at', p_invoice.approved_at,
    'paid_at', p_invoice.paid_at,
    'created_at', p_invoice.created_at,
    'updated_at', p_invoice.updated_at,
    'is_overdue', p_invoice.due_date is not null
      and p_invoice.due_date < current_date
      and p_invoice.status in ('sent', 'viewed', 'approved', 'partially_paid', 'overdue', 'reminder_sent'),
    'suggest_reminder', p_invoice.due_date is not null
      and p_invoice.due_date < current_date
      and p_invoice.status in ('sent', 'viewed', 'approved', 'partially_paid', 'overdue')
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. DNB enterprise profile update (separate from self-service providers)
-- ---------------------------------------------------------------------------
create or replace function public._pp262_provider_meta(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'klarna' then jsonb_build_object(
      'name', 'Klarna',
      'billing_tier', 'self_service',
      'regions', jsonb_build_array('NO', 'SE', 'DK', 'FI', 'DE', 'NL', 'EU'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'webhooks', 'upgrades', 'downgrades')
    )
    when 'vipps' then jsonb_build_object(
      'name', 'Vipps MobilePay',
      'billing_tier', 'self_service',
      'regions', jsonb_build_array('NO', 'DK', 'FI', 'Nordics'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'webhooks', 'upgrades')
    )
    when 'stripe' then jsonb_build_object(
      'name', 'Stripe',
      'billing_tier', 'self_service',
      'regions', jsonb_build_array('Global', 'EU', 'US', 'Nordics'),
      'capabilities', jsonb_build_array('subscriptions', 'one_time', 'refunds', 'invoices', 'webhooks', 'upgrades', 'downgrades')
    )
    when 'dnb' then jsonb_build_object(
      'name', 'DNB Invoice',
      'billing_tier', 'enterprise',
      'description', 'Enterprise invoice and bank payment settlement.',
      'regions', jsonb_build_array('NO', 'Nordics'),
      'capabilities', jsonb_build_array(
        'invoice_payments', 'bank_transfer', 'reconciliation', 'enterprise_contracts',
        'manual_approval_workflow', 'payment_reminders'
      )
    )
    else jsonb_build_object('name', p_provider, 'billing_tier', 'self_service', 'regions', '[]'::jsonb, 'capabilities', '[]'::jsonb)
  end;
$$;

create or replace function public._pp262_required_fields(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'dnb' then '[
      {"key":"DNB_MERCHANT_ID","category":"metadata"},
      {"key":"DNB_ACCOUNT_NUMBER","category":"metadata"},
      {"key":"DNB_KID_PREFIX","category":"metadata"},
      {"key":"DNB_API_KEY","category":"secret_key"},
      {"key":"DNB_API_SECRET","category":"secret_key"},
      {"key":"DNB_ENVIRONMENT","category":"metadata"},
      {"key":"DNB_CALLBACK_URL","category":"url"},
      {"key":"DNB_WEBHOOK_SECRET","category":"webhook_secret"}
    ]'::jsonb
    else public._pp262_required_fields(p_provider)
  end;
$$;

-- Fix recursive call above — replace with full function
create or replace function public._pp262_required_fields(p_provider text)
returns jsonb
language sql
immutable
as $$
  select case p_provider
    when 'klarna' then '[
      {"key":"KLARNA_API_USERNAME","category":"secret_key"},
      {"key":"KLARNA_API_PASSWORD","category":"secret_key"},
      {"key":"KLARNA_API_KEY","category":"secret_key"},
      {"key":"KLARNA_CLIENT_ID","category":"public_key"},
      {"key":"KLARNA_ENVIRONMENT","category":"metadata"},
      {"key":"KLARNA_REGION","category":"metadata"},
      {"key":"KLARNA_MERCHANT_ID","category":"metadata"},
      {"key":"KLARNA_WEBHOOK_SIGNING_KEY","category":"webhook_secret"},
      {"key":"KLARNA_RETURN_URL","category":"url"},
      {"key":"KLARNA_CANCEL_URL","category":"url"},
      {"key":"KLARNA_CONFIRMATION_URL","category":"url"},
      {"key":"KLARNA_PUSH_URL","category":"url"}
    ]'::jsonb
    when 'stripe' then '[
      {"key":"STRIPE_PUBLISHABLE_KEY","category":"public_key"},
      {"key":"STRIPE_SECRET_KEY","category":"secret_key"},
      {"key":"STRIPE_RESTRICTED_KEY","category":"secret_key"},
      {"key":"STRIPE_WEBHOOK_SECRET","category":"webhook_secret"},
      {"key":"STRIPE_ACCOUNT_ID","category":"metadata"},
      {"key":"STRIPE_ENVIRONMENT","category":"metadata"},
      {"key":"STRIPE_SUCCESS_URL","category":"url"},
      {"key":"STRIPE_CANCEL_URL","category":"url"},
      {"key":"STRIPE_CUSTOMER_PORTAL_RETURN_URL","category":"url"}
    ]'::jsonb
    when 'vipps' then '[
      {"key":"VIPPS_CLIENT_ID","category":"public_key"},
      {"key":"VIPPS_CLIENT_SECRET","category":"secret_key"},
      {"key":"VIPPS_SUBSCRIPTION_KEY","category":"secret_key"},
      {"key":"VIPPS_MERCHANT_SERIAL_NUMBER","category":"metadata"},
      {"key":"VIPPS_ENVIRONMENT","category":"metadata"},
      {"key":"VIPPS_SYSTEM_NAME","category":"metadata"},
      {"key":"VIPPS_SYSTEM_VERSION","category":"metadata"},
      {"key":"VIPPS_PLUGIN_NAME","category":"metadata"},
      {"key":"VIPPS_PLUGIN_VERSION","category":"metadata"},
      {"key":"VIPPS_CALLBACK_URL","category":"url"},
      {"key":"VIPPS_RETURN_URL","category":"url"},
      {"key":"VIPPS_WEBHOOK_SECRET","category":"webhook_secret"}
    ]'::jsonb
    when 'dnb' then '[
      {"key":"DNB_MERCHANT_ID","category":"metadata"},
      {"key":"DNB_ACCOUNT_NUMBER","category":"metadata"},
      {"key":"DNB_KID_PREFIX","category":"metadata"},
      {"key":"DNB_API_KEY","category":"secret_key"},
      {"key":"DNB_API_SECRET","category":"secret_key"},
      {"key":"DNB_ENVIRONMENT","category":"metadata"},
      {"key":"DNB_CALLBACK_URL","category":"url"},
      {"key":"DNB_WEBHOOK_SECRET","category":"webhook_secret"}
    ]'::jsonb
    else '[]'::jsonb
  end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_invoice_billing_center(p_scope text default 'tenant')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_invoices jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_can_manage boolean := false;
  v_can_finance boolean := false;
begin
  if p_scope = 'platform' then
    if not public.is_platform_admin() then
      raise exception 'Not authorized';
    end if;

    select coalesce(jsonb_agg(public._ei264_build_invoice_json(i) order by i.created_at desc), '[]'::jsonb)
    into v_invoices
    from public.enterprise_invoices i;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'tenant_id', a.tenant_id, 'invoice_id', a.invoice_id,
      'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
    ) order by a.created_at desc), '[]'::jsonb)
    into v_audit
    from (
      select * from public.enterprise_invoice_audit_logs order by created_at desc limit 50
    ) a;

    v_can_manage := true;
    v_can_finance := true;
  else
    v_tenant_id := public._ei264_require_view();

    select coalesce(jsonb_agg(public._ei264_build_invoice_json(i) order by i.created_at desc), '[]'::jsonb)
    into v_invoices
    from public.enterprise_invoices i
    where i.tenant_id = v_tenant_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'invoice_id', a.invoice_id,
      'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
    ) order by a.created_at desc), '[]'::jsonb)
    into v_audit
    from (
      select * from public.enterprise_invoice_audit_logs
      where tenant_id = v_tenant_id
      order by created_at desc limit 30
    ) a;

    v_can_manage := public._irp_has_permission('enterprise_invoice.manage', v_tenant_id)
      or public._irp_has_permission('subscription.manage', v_tenant_id);
    v_can_finance := public._irp_has_permission('enterprise_invoice.finance', v_tenant_id)
      or public._irp_has_permission('subscription.manage', v_tenant_id);
  end if;

  return jsonb_build_object(
    'scope', p_scope,
    'principle', 'Small customers pay fast. Large organizations pay properly.',
    'billing_model', jsonb_build_object(
      'self_service', jsonb_build_array('stripe', 'klarna', 'vipps'),
      'enterprise', jsonb_build_array('invoice', 'dnb_bank_transfer')
    ),
    'profile', case when p_scope = 'platform' then null else public._ei264_build_profile_json(v_tenant_id) end,
    'invoices', v_invoices,
    'recent_audit', v_audit,
    'can_manage', v_can_manage,
    'can_finance', v_can_finance,
    'can_edit_billing_details', v_can_manage,
    'overdue_count', (
      select count(*)::int from public.enterprise_invoices i
      where (p_scope = 'platform' or i.tenant_id = v_tenant_id)
        and i.due_date < current_date
        and i.status in ('sent', 'viewed', 'approved', 'partially_paid', 'overdue', 'reminder_sent')
    ),
    'dnb_provider', public._pp262_build_provider_card('platform', null, 'dnb')
  );
end;
$$;

create or replace function public.upsert_enterprise_billing_profile(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_profile public.enterprise_billing_profiles;
  v_policy public.enterprise_billing_policies;
begin
  v_tenant_id := public._ei264_require_manage(
    nullif(p_payload->>'tenant_id', '')::uuid
  );

  insert into public.enterprise_billing_profiles (
    tenant_id, company_name, organization_number, vat_number, billing_address,
    invoice_email, ap_contact_name, ap_contact_email, purchase_order_number,
    internal_reference, payment_terms, payment_terms_custom, preferred_currency,
    billing_language, updated_by, updated_at
  ) values (
    v_tenant_id,
    coalesce(p_payload->>'company_name', ''),
    coalesce(p_payload->>'organization_number', ''),
    coalesce(p_payload->>'vat_number', ''),
    coalesce(p_payload->'billing_address', '{}'::jsonb),
    coalesce(p_payload->>'invoice_email', ''),
    coalesce(p_payload->>'ap_contact_name', ''),
    coalesce(p_payload->>'ap_contact_email', ''),
    coalesce(p_payload->>'purchase_order_number', ''),
    coalesce(p_payload->>'internal_reference', ''),
    coalesce(p_payload->>'payment_terms', 'net_30'),
    coalesce(p_payload->>'payment_terms_custom', ''),
    coalesce(p_payload->>'preferred_currency', 'NOK'),
    coalesce(p_payload->>'billing_language', 'en'),
    auth.uid(), now()
  )
  on conflict (tenant_id) do update set
    company_name = excluded.company_name,
    organization_number = excluded.organization_number,
    vat_number = excluded.vat_number,
    billing_address = excluded.billing_address,
    invoice_email = excluded.invoice_email,
    ap_contact_name = excluded.ap_contact_name,
    ap_contact_email = excluded.ap_contact_email,
    purchase_order_number = excluded.purchase_order_number,
    internal_reference = excluded.internal_reference,
    payment_terms = excluded.payment_terms,
    payment_terms_custom = excluded.payment_terms_custom,
    preferred_currency = excluded.preferred_currency,
    billing_language = excluded.billing_language,
    updated_by = auth.uid(),
    updated_at = now()
  returning * into v_profile;

  insert into public.enterprise_billing_policies (tenant_id)
  values (v_tenant_id)
  on conflict (tenant_id) do nothing;

  if p_payload ? 'access_unlock_policy' then
    update public.enterprise_billing_policies
    set access_unlock_policy = coalesce(p_payload->>'access_unlock_policy', access_unlock_policy),
        auto_send_invoices = coalesce((p_payload->>'auto_send_invoices')::boolean, auto_send_invoices),
        require_approval_before_send = coalesce((p_payload->>'require_approval_before_send')::boolean, require_approval_before_send),
        updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  perform public._ei264_log_audit(
    v_tenant_id, null, 'billing_details_changed',
    'Enterprise billing profile updated',
    jsonb_build_object('payment_terms', v_profile.payment_terms)
  );

  return public._ei264_build_profile_json(v_tenant_id);
end;
$$;

create or replace function public.enterprise_invoice_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_invoice public.enterprise_invoices;
  v_tenant_id uuid;
  v_amount numeric;
  v_note text;
  v_policy public.enterprise_billing_policies;
  v_profile jsonb;
begin
  if v_action = 'create' then
    v_tenant_id := public._ei264_require_manage(nullif(p_payload->>'tenant_id', '')::uuid);
    v_profile := public._ei264_build_profile_json(v_tenant_id);

    insert into public.enterprise_invoices (
      tenant_id, invoice_number, status, plan_key, description,
      amount, tax_amount, total_amount, currency, payment_terms, due_date,
      purchase_order_number, internal_reference, billing_snapshot,
      billing_method, dnb_kid, created_by
    ) values (
      v_tenant_id,
      public._ei264_next_invoice_number(v_tenant_id),
      'draft',
      p_payload->>'plan_key',
      coalesce(p_payload->>'description', 'Enterprise invoice'),
      coalesce((p_payload->>'amount')::numeric, 0),
      coalesce((p_payload->>'tax_amount')::numeric, 0),
      coalesce((p_payload->>'total_amount')::numeric, (p_payload->>'amount')::numeric, 0),
      coalesce(p_payload->>'currency', v_profile->>'preferred_currency', 'NOK'),
      coalesce(p_payload->>'payment_terms', v_profile->>'payment_terms', 'net_30'),
      public._ei264_calculate_due_date(coalesce(p_payload->>'payment_terms', v_profile->>'payment_terms', 'net_30')),
      coalesce(p_payload->>'purchase_order_number', v_profile->>'purchase_order_number', ''),
      coalesce(p_payload->>'internal_reference', v_profile->>'internal_reference', ''),
      v_profile,
      coalesce(p_payload->>'billing_method', 'invoice'),
      coalesce(p_payload->>'dnb_kid', ''),
      auth.uid()
    ) returning * into v_invoice;

    perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_created', 'Enterprise invoice draft created');
    return public._ei264_build_invoice_json(v_invoice);
  end if;

  select * into v_invoice
  from public.enterprise_invoices
  where id = nullif(p_payload->>'invoice_id', '')::uuid;

  if v_invoice.id is null then
    raise exception 'Invoice not found';
  end if;

  v_tenant_id := v_invoice.tenant_id;

  case v_action
    when 'send' then
      perform public._ei264_require_manage(v_tenant_id);
      select * into v_policy from public.enterprise_billing_policies where tenant_id = v_tenant_id;
      if coalesce(v_policy.require_approval_before_send, true) and not public.is_platform_admin() then
        raise exception 'Invoice send requires approval workflow';
      end if;
      update public.enterprise_invoices
      set status = 'sent', sent_at = now(), updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_sent', 'Enterprise invoice sent to billing contact');

    when 'mark_viewed' then
      perform public._ei264_require_view(v_tenant_id);
      update public.enterprise_invoices
      set status = case when status = 'sent' then 'viewed' else status end,
          viewed_at = coalesce(viewed_at, now()), updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_viewed', 'Enterprise invoice viewed');

    when 'approve' then
      perform public._ei264_require_manage(v_tenant_id);
      update public.enterprise_invoices
      set status = 'approved', approved_at = now(), updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_approved', 'Enterprise invoice approved');

    when 'mark_paid' then
      perform public._ei264_require_finance(v_tenant_id);
      update public.enterprise_invoices
      set status = 'paid', amount_paid = total_amount, paid_at = now(), updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_paid', 'Enterprise invoice marked as paid');

    when 'register_partial_payment' then
      perform public._ei264_require_finance(v_tenant_id);
      v_amount := coalesce((p_payload->>'amount')::numeric, 0);
      update public.enterprise_invoices
      set amount_paid = amount_paid + v_amount,
          status = case
            when amount_paid + v_amount >= total_amount then 'paid'
            else 'partially_paid'
          end,
          paid_at = case when amount_paid + v_amount >= total_amount then now() else paid_at end,
          updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(
        v_tenant_id, v_invoice.id, 'partial_payment_registered',
        format('Partial payment registered: %s %s', v_amount, v_invoice.currency),
        jsonb_build_object('amount', v_amount)
      );

    when 'send_reminder' then
      perform public._ei264_require_manage(v_tenant_id);
      update public.enterprise_invoices
      set status = 'reminder_sent', updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'reminder_sent', 'Payment reminder sent');

    when 'credit' then
      perform public._ei264_require_finance(v_tenant_id);
      update public.enterprise_invoices
      set status = 'credited', updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_credited', 'Enterprise invoice credited');

    when 'cancel' then
      perform public._ei264_require_manage(v_tenant_id);
      update public.enterprise_invoices
      set status = 'cancelled', updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_cancelled', 'Enterprise invoice cancelled');

    when 'dispute' then
      perform public._ei264_require_view(v_tenant_id);
      update public.enterprise_invoices
      set status = 'disputed', updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_disputed', 'Enterprise invoice disputed');

    when 'escalate' then
      perform public._ei264_require_manage(v_tenant_id);
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_escalated', 'Invoice escalated to finance admin');

    when 'add_note' then
      perform public._ei264_require_manage(v_tenant_id);
      v_note := coalesce(p_payload->>'note', '');
      insert into public.enterprise_invoice_notes (invoice_id, tenant_id, note, author_user_id)
      values (v_invoice.id, v_tenant_id, v_note, auth.uid());

    when 'attach_po' then
      perform public._ei264_require_manage(v_tenant_id);
      update public.enterprise_invoices
      set purchase_order_number = coalesce(p_payload->>'purchase_order_number', purchase_order_number),
          updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'po_number_changed', 'Purchase order attached to invoice');

    when 'mark_overdue' then
      perform public._ei264_require_finance(v_tenant_id);
      update public.enterprise_invoices
      set status = 'overdue', updated_at = now()
      where id = v_invoice.id returning * into v_invoice;
      perform public._ei264_log_audit(v_tenant_id, v_invoice.id, 'invoice_overdue', 'Enterprise invoice marked overdue');

    else
      raise exception 'Invalid invoice action: %', v_action;
  end case;

  select * into v_invoice from public.enterprise_invoices where id = v_invoice.id;
  return public._ei264_build_invoice_json(v_invoice);
end;
$$;

create or replace function public.get_enterprise_upgrade_checkout(p_target_package text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_current_package text;
  v_current_price numeric;
  v_new_price numeric;
  v_profile jsonb;
  v_policy public.enterprise_billing_policies;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  perform public._irp_require_permission('package_access.upgrade', v_tenant_id);

  if p_target_package not in ('starter', 'professional', 'business', 'enterprise') then
    raise exception 'Invalid target package';
  end if;

  v_current_package := public._cpa_resolve_package_key(v_tenant_id);
  v_current_price := public._pp262_package_monthly_price(v_current_package);
  v_new_price := public._pp262_package_monthly_price(p_target_package);
  v_profile := public._ei264_build_profile_json(v_tenant_id);
  select * into v_policy from public.enterprise_billing_policies where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'current_plan', v_current_package,
    'new_plan', p_target_package,
    'current_price_monthly', v_current_price,
    'new_price_monthly', v_new_price,
    'price_difference_monthly', greatest(0, v_new_price - v_current_price),
    'currency', coalesce(v_profile->>'preferred_currency', 'NOK'),
    'billing_method', 'invoice',
    'billing_method_label', 'Enterprise invoice billing',
    'payment_terms', coalesce(v_profile->>'payment_terms', 'net_30'),
    'payment_terms_label', coalesce(v_profile->>'payment_terms', 'net_30'),
    'requires_approval', true,
    'access_unlock_policy', coalesce(v_policy.access_unlock_policy, 'contract_approval'),
    'access_unlock_label', case coalesce(v_policy.access_unlock_policy, 'contract_approval')
      when 'contract_approval' then 'Access after contract approval'
      when 'invoice_sent' then 'Access after invoice sent'
      when 'payment_received' then 'Access after payment received'
      else 'Access after contract approval'
    end,
    'profile_configured', coalesce((v_profile->>'configured')::boolean, false),
    'instant_access', false,
    'enterprise_billing', true
  );
end;
$$;

create or replace function public.complete_enterprise_upgrade_with_invoice(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_target text;
  v_invoice jsonb;
  v_policy public.enterprise_billing_policies;
  v_unlock boolean := false;
begin
  v_tenant_id := public._ei264_require_manage(nullif(p_payload->>'tenant_id', '')::uuid);
  v_target := p_payload->>'target_package';

  perform public._irp_require_permission('package_access.upgrade', v_tenant_id);

  v_invoice := public.enterprise_invoice_action(jsonb_build_object(
    'action', 'create',
    'tenant_id', v_tenant_id::text,
    'plan_key', v_target,
    'description', format('Enterprise upgrade to %s', v_target),
    'amount', public._pp262_package_monthly_price(v_target),
    'total_amount', public._pp262_package_monthly_price(v_target),
    'billing_method', coalesce(p_payload->>'billing_method', 'invoice')
  ));

  select * into v_policy from public.enterprise_billing_policies where tenant_id = v_tenant_id;

  v_unlock := coalesce(v_policy.access_unlock_policy, 'contract_approval') = 'contract_approval'
    and coalesce(p_payload->>'approved', 'false') = 'true';

  if v_unlock then
    perform public.complete_package_upgrade_instant(
      jsonb_build_object(
        'target_package', v_target,
        'payment_reference', format('enterprise_invoice_%s', v_invoice->>'id'),
        'payment_provider', 'invoice'
      )
    );
  end if;

  perform public._ei264_log_audit(
    v_tenant_id, (v_invoice->>'id')::uuid, 'upgrade_invoice_drafted',
    format('Enterprise upgrade invoice drafted for %s', v_target),
    jsonb_build_object('target_package', v_target, 'access_unlocked', v_unlock)
  );

  return jsonb_build_object(
    'invoice', v_invoice,
    'access_unlocked', v_unlock,
    'message', case
      when v_unlock then 'Upgrade approved. Invoice draft created and access unlocked per policy.'
      else 'Invoice draft created. Access will unlock per your enterprise billing policy after approval.'
    end
  );
end;
$$;

grant execute on function public.get_enterprise_invoice_billing_center(text) to authenticated;
grant execute on function public.upsert_enterprise_billing_profile(jsonb) to authenticated;
grant execute on function public.enterprise_invoice_action(jsonb) to authenticated;
grant execute on function public.get_enterprise_upgrade_checkout(text) to authenticated;
grant execute on function public.complete_enterprise_upgrade_with_invoice(jsonb) to authenticated;

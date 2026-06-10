-- Phase 6.5: Customer billing RPCs and pilot seed

create or replace function public.format_customer_number(p_seq bigint)
returns text
language sql
immutable
as $$
  select 'AIP-' || lpad(p_seq::text, 6, '0');
$$;

create or replace function public.format_invoice_number(p_seq bigint)
returns text
language sql
immutable
as $$
  select 'AIP-INV-' || lpad(p_seq::text, 6, '0');
$$;

create or replace function public.list_platform_customer_records()
returns table (
  id uuid,
  customer_number text,
  customer_type text,
  display_name text,
  email text,
  country text,
  language text,
  status text,
  company_id uuid,
  installation_count bigint,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select
    c.id,
    c.customer_number,
    c.customer_type,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    c.email,
    c.country,
    c.language,
    c.status,
    c.company_id,
    count(distinct i.id) as installation_count,
    c.created_at
  from public.customers c
  left join public.installations i on i.company_id = c.company_id
  group by c.id
  order by c.customer_number asc;
end;
$$;

grant execute on function public.list_platform_customer_records() to authenticated;

create or replace function public.get_platform_customer_detail(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  select jsonb_build_object(
    'customer', row_to_json(c.*),
    'billing_profile', (
      select row_to_json(bp.*)
      from public.billing_profiles bp
      where bp.customer_id = c.id
    ),
    'subscription', (
      select row_to_json(s.*)
      from public.subscriptions s
      where s.customer_id = c.id
    ),
    'installations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', i.id,
            'name', i.name,
            'site_url', i.site_url,
            'system_type', i.system_type,
            'status', i.status,
            'last_synced_at', i.last_synced_at
          )
          order by i.created_at desc
        )
        from public.installations i
        where i.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'invoices', coalesce(
      (
        select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
        from public.invoices inv
        where inv.customer_id = c.id
      ),
      '[]'::jsonb
    )
  )
  into v_result
  from public.customers c
  where c.id = p_customer_id;

  return v_result;
end;
$$;

grant execute on function public.get_platform_customer_detail(uuid) to authenticated;

create or replace function public.list_platform_invoices()
returns setof public.invoices
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select inv.*
  from public.invoices inv
  order by inv.created_at desc;
end;
$$;

grant execute on function public.list_platform_invoices() to authenticated;

create or replace function public.list_platform_subscriptions()
returns table (
  id uuid,
  customer_id uuid,
  customer_number text,
  display_name text,
  plan_name text,
  plan_type text,
  status text,
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  billing_cycle text,
  price_amount numeric,
  currency text,
  max_users integer,
  max_installations integer,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select
    s.id,
    s.customer_id,
    c.customer_number,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    s.plan_name,
    s.plan_type,
    s.status,
    s.trial_starts_at,
    s.trial_ends_at,
    s.billing_cycle,
    s.price_amount,
    s.currency,
    s.max_users,
    s.max_installations,
    s.created_at
  from public.subscriptions s
  join public.customers c on c.id = s.customer_id
  order by s.created_at desc;
end;
$$;

grant execute on function public.list_platform_subscriptions() to authenticated;

create or replace function public.list_platform_billing_profiles()
returns table (
  id uuid,
  customer_id uuid,
  customer_number text,
  display_name text,
  billing_name text,
  billing_email text,
  billing_address text,
  postal_code text,
  city text,
  country text,
  vat_number text,
  payment_method text,
  currency text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  return query
  select
    bp.id,
    bp.customer_id,
    c.customer_number,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    bp.billing_name,
    bp.billing_email,
    bp.billing_address,
    bp.postal_code,
    bp.city,
    bp.country,
    bp.vat_number,
    bp.payment_method,
    bp.currency,
    bp.created_at
  from public.billing_profiles bp
  join public.customers c on c.id = bp.customer_id
  order by bp.created_at desc;
end;
$$;

grant execute on function public.list_platform_billing_profiles() to authenticated;

create or replace function public.platform_invoice_action(
  p_invoice_id uuid,
  p_action text
)
returns public.invoices
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invoice public.invoices;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  if p_action not in ('send', 'resend', 'mark_paid', 'mark_overdue', 'cancel') then
    raise exception 'Invalid invoice action';
  end if;

  select * into v_invoice from public.invoices where id = p_invoice_id;

  if v_invoice.id is null then
    raise exception 'Invoice not found';
  end if;

  case p_action
    when 'send', 'resend' then
      update public.invoices
      set
        status = 'sent',
        last_sent_at = now(),
        pdf_url = coalesce(pdf_url, '/invoices/placeholder.pdf')
      where id = p_invoice_id
      returning * into v_invoice;
    when 'mark_paid' then
      update public.invoices
      set status = 'paid', paid_at = now()
      where id = p_invoice_id
      returning * into v_invoice;
    when 'mark_overdue' then
      update public.invoices
      set status = 'overdue'
      where id = p_invoice_id
      returning * into v_invoice;
    when 'cancel' then
      update public.invoices
      set status = 'cancelled'
      where id = p_invoice_id
      returning * into v_invoice;
  end case;

  return v_invoice;
end;
$$;

grant execute on function public.platform_invoice_action(uuid, text) to authenticated;

create or replace function public.seed_pilot_customer_billing()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_company_name text;
  v_customer_id uuid;
  v_customer_seq bigint;
  v_invoice_seq bigint;
  v_trial_start timestamptz := now();
  v_trial_end timestamptz := now() + interval '14 days';
begin
  select c.id, c.name
  into v_company_id, v_company_name
  from public.companies c
  where c.is_platform = false
    and exists (
      select 1
      from public.installations i
      where i.company_id = c.id
        and i.status = 'active'
    )
  order by c.created_at
  limit 1;

  if v_company_id is null then
    return null;
  end if;

  select id into v_customer_id
  from public.customers
  where customer_number = 'AIP-000001'
  limit 1;

  if v_customer_id is not null then
    return v_customer_id;
  end if;

  perform setval('public.customer_number_seq', 1, true);
  v_customer_seq := 1;

  insert into public.customers (
    customer_number,
    company_id,
    customer_type,
    company_name,
    email,
    country,
    language,
    status
  )
  values (
    public.format_customer_number(v_customer_seq),
    v_company_id,
    'company',
    v_company_name,
    'support@aipify.ai',
    'NO',
    'en',
    'trial'
  )
  returning id into v_customer_id;

  insert into public.billing_profiles (
    customer_id,
    billing_name,
    billing_email,
    billing_address,
    postal_code,
    city,
    country,
    payment_method,
    currency
  )
  values (
    v_customer_id,
    v_company_name,
    'support@aipify.ai',
    'Billing address pending',
    '0000',
    'Oslo',
    'NO',
    'invoice',
    'EUR'
  );

  insert into public.subscriptions (
    customer_id,
    plan_name,
    plan_type,
    status,
    trial_starts_at,
    trial_ends_at,
    billing_cycle,
    price_amount,
    currency,
    max_users,
    max_installations
  )
  values (
    v_customer_id,
    'Business',
    'business',
    'trialing',
    v_trial_start,
    v_trial_end,
    'monthly',
    299.00,
    'EUR',
    25,
    3
  );

  perform setval('public.invoice_number_seq', 1, true);
  v_invoice_seq := 1;

  insert into public.invoices (
    customer_id,
    invoice_number,
    status,
    amount,
    currency,
    due_date,
    issued_at
  )
  values (
    v_customer_id,
    public.format_invoice_number(v_invoice_seq),
    'draft',
    299.00,
    'EUR',
    (now() + interval '30 days')::date,
    now()
  );

  return v_customer_id;
end;
$$;

select public.seed_pilot_customer_billing();

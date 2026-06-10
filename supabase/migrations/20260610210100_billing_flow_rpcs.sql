-- Billing flow RPCs: payment profiles, payment events, customer billing overview

drop function if exists public.list_platform_subscriptions();
drop function if exists public.list_platform_billing_profiles();

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
    'payment_profile', (
      select row_to_json(pp.*)
      from public.payment_profiles pp
      where pp.customer_id = c.id
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
    ),
    'payment_events', coalesce(
      (
        select jsonb_agg(row_to_json(pe.*) order by pe.created_at desc)
        from public.payment_events pe
        where pe.customer_id = c.id
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

create or replace function public.list_platform_payment_profiles()
returns table (
  id uuid,
  customer_id uuid,
  customer_number text,
  display_name text,
  provider text,
  provider_customer_id text,
  provider_mandate_id text,
  payment_status text,
  kid_number text,
  billing_email text,
  billing_address text,
  postal_code text,
  city text,
  country text,
  vat_number text,
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
    pp.id,
    pp.customer_id,
    c.customer_number,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    pp.provider,
    pp.provider_customer_id,
    pp.provider_mandate_id,
    pp.payment_status,
    pp.kid_number,
    pp.billing_email,
    pp.billing_address,
    pp.postal_code,
    pp.city,
    pp.country,
    pp.vat_number,
    pp.created_at
  from public.payment_profiles pp
  join public.customers c on c.id = pp.customer_id
  order by pp.created_at desc;
end;
$$;

grant execute on function public.list_platform_payment_profiles() to authenticated;

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
  next_billing_date date,
  cancelled_at timestamptz,
  billing_cycle text,
  price_amount numeric,
  currency text,
  max_users integer,
  max_installations integer,
  provider text,
  payment_status text,
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
    s.next_billing_date,
    s.cancelled_at,
    s.billing_cycle,
    s.price_amount,
    s.currency,
    s.max_users,
    s.max_installations,
    pp.provider,
    pp.payment_status,
    s.created_at
  from public.subscriptions s
  join public.customers c on c.id = s.customer_id
  left join public.payment_profiles pp on pp.customer_id = s.customer_id
  order by s.created_at desc;
end;
$$;

create or replace function public.list_platform_payment_providers()
returns table (
  provider text,
  customer_count bigint,
  active_count bigint,
  trialing_count bigint,
  failed_count bigint
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
    pp.provider,
    count(distinct pp.customer_id) as customer_count,
    count(distinct pp.customer_id) filter (
      where pp.payment_status = 'active'
    ) as active_count,
    count(distinct s.customer_id) filter (
      where s.status = 'trialing'
    ) as trialing_count,
    count(distinct pp.customer_id) filter (
      where pp.payment_status = 'failed'
    ) as failed_count
  from public.payment_profiles pp
  left join public.subscriptions s on s.customer_id = pp.customer_id
  group by pp.provider
  order by pp.provider asc;
end;
$$;

grant execute on function public.list_platform_payment_providers() to authenticated;

create or replace function public.list_platform_payment_events()
returns table (
  id uuid,
  customer_id uuid,
  customer_number text,
  display_name text,
  provider text,
  event_type text,
  provider_event_id text,
  status text,
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
    pe.id,
    pe.customer_id,
    c.customer_number,
    coalesce(c.company_name, c.full_name, 'Customer') as display_name,
    pe.provider,
    pe.event_type,
    pe.provider_event_id,
    pe.status,
    pe.created_at
  from public.payment_events pe
  join public.customers c on c.id = pe.customer_id
  order by pe.created_at desc;
end;
$$;

grant execute on function public.list_platform_payment_events() to authenticated;

create or replace function public.get_customer_billing_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id
  into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_company_id is null then
    return null;
  end if;

  select c.id
  into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    return jsonb_build_object(
      'subscription', null,
      'payment_profile', null,
      'invoices', '[]'::jsonb
    );
  end if;

  select jsonb_build_object(
    'subscription', (
      select row_to_json(s.*)
      from public.subscriptions s
      where s.customer_id = v_customer_id
    ),
    'payment_profile', (
      select row_to_json(pp.*)
      from public.payment_profiles pp
      where pp.customer_id = v_customer_id
    ),
    'invoices', coalesce(
      (
        select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
        from public.invoices inv
        where inv.customer_id = v_customer_id
      ),
      '[]'::jsonb
    )
  )
  into v_result;

  return v_result;
end;
$$;

grant execute on function public.get_customer_billing_overview() to authenticated;

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

  if p_action not in ('send', 'resend', 'mark_paid', 'mark_overdue', 'mark_failed', 'cancel') then
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
    when 'mark_failed' then
      update public.invoices
      set status = 'failed'
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

create or replace function public.seed_pilot_billing_flow()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_company_name text;
  v_customer_id uuid;
  v_subscription_id uuid;
  v_trial_end timestamptz;
  v_next_billing date;
begin
  select c.id, c.company_id, c.company_name, s.trial_ends_at, s.id
  into v_customer_id, v_company_id, v_company_name, v_trial_end, v_subscription_id
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  where c.customer_number = 'AIP-000001'
  limit 1;

  if v_customer_id is null then
    return public.seed_pilot_customer_billing();
  end if;

  if v_trial_end is null then
    v_trial_end := now() + interval '14 days';
  end if;

  v_next_billing := (v_trial_end + interval '1 day')::date;

  update public.subscriptions
  set
    plan_name = 'Business',
    plan_type = 'business',
    status = 'trialing',
    trial_starts_at = coalesce(trial_starts_at, now()),
    trial_ends_at = v_trial_end,
    next_billing_date = v_next_billing,
    billing_cycle = 'monthly',
    price_amount = 299.00,
    currency = 'EUR',
    max_users = 25,
    max_installations = 3,
    updated_at = now()
  where customer_id = v_customer_id
  returning id into v_subscription_id;

  insert into public.payment_profiles (
    customer_id,
    provider,
    provider_customer_id,
    provider_mandate_id,
    payment_status,
    kid_number,
    billing_email,
    billing_address,
    postal_code,
    city,
    country
  )
  values (
    v_customer_id,
    'klarna',
    'klarna_customer_placeholder',
    'klarna_mandate_placeholder',
    'pending_setup',
    'KID-PLACEHOLDER-000001',
    'support@aipify.ai',
    'Billing address pending',
    '0000',
    'Oslo',
    'NO'
  )
  on conflict (customer_id) do update
  set
    provider = excluded.provider,
    provider_customer_id = excluded.provider_customer_id,
    provider_mandate_id = excluded.provider_mandate_id,
    payment_status = excluded.payment_status,
    kid_number = excluded.kid_number,
    updated_at = now();

  update public.invoices
  set
    subscription_id = v_subscription_id,
    kid_number = 'KID-PLACEHOLDER-000001',
    status = 'draft',
    amount = 299.00,
    currency = 'EUR'
  where customer_id = v_customer_id
    and invoice_number = 'AIP-INV-000001';

  insert into public.payment_events (
    customer_id,
    provider,
    event_type,
    provider_event_id,
    status,
    raw_payload
  )
  select
    v_customer_id,
    'klarna',
    'trial.started',
    'evt_trial_placeholder',
    'received',
    jsonb_build_object(
      'note', 'Placeholder event for future Klarna webhook integration',
      'trial_days', 14
    )
  where not exists (
    select 1
    from public.payment_events pe
    where pe.customer_id = v_customer_id
      and pe.event_type = 'trial.started'
  );

  return v_customer_id;
end;
$$;

select public.seed_pilot_billing_flow();

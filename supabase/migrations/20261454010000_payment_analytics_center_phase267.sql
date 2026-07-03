-- Phase 267 — Payment Analytics Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.payment_analytics_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_at timestamptz not null default now(),
  provider_key text not null check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null default '',
  customer_type text not null default 'self_service' check (
    customer_type in ('self_service', 'enterprise')
  ),
  country text not null default 'NO',
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'succeeded' check (
    status in ('succeeded', 'failed', 'refunded')
  ),
  failure_reason text,
  retry_count integer not null default 0,
  recommended_action text,
  created_at timestamptz not null default now()
);

create index if not exists payment_analytics_transactions_at_idx
  on public.payment_analytics_transactions (transaction_at desc);

create index if not exists payment_analytics_transactions_provider_idx
  on public.payment_analytics_transactions (provider_key, transaction_at desc);

create index if not exists payment_analytics_transactions_segment_idx
  on public.payment_analytics_transactions (customer_type, country, transaction_at desc);

alter table public.payment_analytics_transactions enable row level security;
revoke all on public.payment_analytics_transactions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Seed sample analytics (only when empty)
-- ---------------------------------------------------------------------------
insert into public.payment_analytics_transactions (
  transaction_at, provider_key, customer_name, customer_type, country,
  amount, currency, status, failure_reason, retry_count, recommended_action
)
select * from (values
  (now() - interval '2 hours', 'stripe'::text, 'Nordic SaaS AS', 'self_service', 'NO', 2490.00, 'NOK', 'succeeded', null::text, 0, null::text),
  (now() - interval '5 hours', 'vipps', 'Oslo Retail Co', 'self_service', 'NO', 890.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '1 day', 'klarna', 'Stockholm Growth AB', 'self_service', 'SE', 1290.00, 'SEK', 'succeeded', null, 0, null),
  (now() - interval '2 days', 'dnb', 'Enterprise Logistics AS', 'enterprise', 'NO', 45000.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '3 days', 'stripe', 'Bergen Digital', 'self_service', 'NO', 990.00, 'NOK', 'failed', 'Card declined', 2, 'Retry with updated payment method'),
  (now() - interval '4 days', 'klarna', 'Copenhagen Commerce ApS', 'self_service', 'DK', 1590.00, 'DKK', 'succeeded', null, 0, null),
  (now() - interval '6 days', 'vipps', 'Trondheim Services', 'self_service', 'NO', 490.00, 'NOK', 'refunded', null, 0, null),
  (now() - interval '8 days', 'dnb', 'Global Manufacturing AS', 'enterprise', 'NO', 125000.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '12 days', 'stripe', 'Helsinki Startup Oy', 'self_service', 'FI', 790.00, 'EUR', 'succeeded', null, 0, null),
  (now() - interval '15 days', 'klarna', 'Malmö Retail AB', 'self_service', 'SE', 690.00, 'SEK', 'failed', 'Insufficient funds', 1, 'Contact customer for alternative payment'),
  (now() - interval '20 days', 'dnb', 'Enterprise Logistics AS', 'enterprise', 'NO', 38000.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '25 days', 'stripe', 'Unonight Pilot', 'enterprise', 'NO', 8900.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '35 days', 'vipps', 'Stavanger Apps', 'self_service', 'NO', 1290.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '45 days', 'klarna', 'Gothenburg Tech AB', 'self_service', 'SE', 2190.00, 'SEK', 'succeeded', null, 0, null),
  (now() - interval '60 days', 'dnb', 'Global Manufacturing AS', 'enterprise', 'NO', 98000.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '90 days', 'stripe', 'Nordic SaaS AS', 'self_service', 'NO', 2490.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '120 days', 'dnb', 'Enterprise Logistics AS', 'enterprise', 'NO', 52000.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '180 days', 'stripe', 'Oslo Retail Co', 'self_service', 'NO', 890.00, 'NOK', 'succeeded', null, 0, null),
  (now() - interval '240 days', 'klarna', 'Stockholm Growth AB', 'self_service', 'SE', 1290.00, 'SEK', 'succeeded', null, 0, null),
  (now() - interval '300 days', 'dnb', 'Global Manufacturing AS', 'enterprise', 'NO', 110000.00, 'NOK', 'succeeded', null, 0, null)
) as v(transaction_at, provider_key, customer_name, customer_type, country, amount, currency, status, failure_reason, retry_count, recommended_action)
where not exists (select 1 from public.payment_analytics_transactions limit 1);

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pac267_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pac267_filter_date_from(p_filters jsonb)
returns timestamptz
language sql
immutable
as $$
  select coalesce(
    (p_filters->>'date_from')::timestamptz,
    now() - interval '30 days'
  );
$$;

create or replace function public._pac267_filter_date_to(p_filters jsonb)
returns timestamptz
language sql
immutable
as $$
  select coalesce((p_filters->>'date_to')::timestamptz, now());
$$;

create or replace function public._pac267_base_transactions(p_filters jsonb)
returns setof public.payment_analytics_transactions
language sql
stable
security definer
set search_path = public
as $$
  select t.*
  from public.payment_analytics_transactions t
  where t.transaction_at >= public._pac267_filter_date_from(p_filters)
    and t.transaction_at <= public._pac267_filter_date_to(p_filters)
    and (
      p_filters->>'provider' is null
      or p_filters->>'provider' = ''
      or t.provider_key = p_filters->>'provider'
    )
    and (
      p_filters->>'customer_type' is null
      or p_filters->>'customer_type' = ''
      or t.customer_type = p_filters->>'customer_type'
    )
    and (
      p_filters->>'country' is null
      or p_filters->>'country' = ''
      or t.country = p_filters->>'country'
    );
$$;

create or replace function public._pac267_provider_breakdown(p_filters jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb := '[]'::jsonb;
  v_provider text;
  v_revenue numeric;
  v_transactions int;
  v_successes int;
  v_refunds int;
  v_failed int;
  v_rate numeric;
begin
  foreach v_provider in array array['stripe', 'vipps', 'klarna', 'dnb']
  loop
    select
      coalesce(sum(amount) filter (where status = 'succeeded'), 0),
      count(*)::int,
      count(*) filter (where status = 'succeeded')::int,
      count(*) filter (where status = 'refunded')::int,
      count(*) filter (where status = 'failed')::int
    into v_revenue, v_transactions, v_successes, v_refunds, v_failed
    from public._pac267_base_transactions(p_filters) t
    where t.provider_key = v_provider
      and t.transaction_at >= now() - interval '30 days';

    v_rate := case when v_transactions = 0 then 100
      else round((v_successes::numeric / v_transactions::numeric) * 100, 2) end;

    v_result := v_result || jsonb_build_array(jsonb_build_object(
      'provider_key', v_provider,
      'revenue_30d', v_revenue,
      'transactions', v_transactions,
      'success_rate', v_rate,
      'refunds', v_refunds,
      'failed_payments', v_failed
    ));
  end loop;

  return v_result;
end;
$$;

create or replace function public._pac267_revenue_series(p_filters jsonb, p_days int)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with days as (
    select generate_series(
      date_trunc('day', now()) - ((p_days - 1) || ' days')::interval,
      date_trunc('day', now()),
      interval '1 day'
    )::date as day
  ),
  agg as (
    select
      date_trunc('day', t.transaction_at)::date as day,
      coalesce(sum(t.amount) filter (where t.status = 'succeeded'), 0) as revenue
    from public._pac267_base_transactions(p_filters) t
    where t.transaction_at >= now() - (p_days || ' days')::interval
    group by 1
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'date', d.day,
    'revenue', coalesce(a.revenue, 0)
  ) order by d.day), '[]'::jsonb)
  from days d
  left join agg a on a.day = d.day;
$$;

create or replace function public._pac267_revenue_months(p_filters jsonb)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with months as (
    select generate_series(
      date_trunc('month', now()) - interval '11 months',
      date_trunc('month', now()),
      interval '1 month'
    )::date as month
  ),
  agg as (
    select
      date_trunc('month', t.transaction_at)::date as month,
      coalesce(sum(t.amount) filter (where t.status = 'succeeded'), 0) as revenue
    from public._pac267_base_transactions(p_filters) t
    where t.transaction_at >= now() - interval '12 months'
    group by 1
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'date', m.month,
    'revenue', coalesce(a.revenue, 0)
  ) order by m.month), '[]'::jsonb)
  from months m
  left join agg a on a.month = m.month;
$$;

create or replace function public._pac267_provider_distribution(p_filters jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total numeric;
  v_result jsonb := '[]'::jsonb;
  v_provider text;
  v_revenue numeric;
  v_pct numeric;
begin
  select coalesce(sum(amount) filter (where status = 'succeeded'), 0)
  into v_total
  from public._pac267_base_transactions(p_filters) t
  where t.transaction_at >= now() - interval '30 days';

  foreach v_provider in array array['stripe', 'vipps', 'klarna', 'dnb']
  loop
    select coalesce(sum(amount) filter (where status = 'succeeded'), 0)
    into v_revenue
    from public._pac267_base_transactions(p_filters) t
    where t.provider_key = v_provider
      and t.transaction_at >= now() - interval '30 days';

    v_pct := case when v_total = 0 then 0 else round((v_revenue / v_total) * 100, 2) end;

    v_result := v_result || jsonb_build_array(jsonb_build_object(
      'provider_key', v_provider,
      'revenue', v_revenue,
      'percentage', v_pct
    ));
  end loop;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_analytics_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_revenue_today numeric;
  v_revenue_month numeric;
  v_active_subs int;
  v_failed int;
  v_arpc numeric;
  v_churned int;
  v_self_service numeric;
  v_enterprise numeric;
  v_customer_count int;
  v_has_activity boolean;
  v_top_enterprise jsonb;
  v_failed_insights jsonb;
  v_countries jsonb;
begin
  perform public._pac267_require_platform_admin();

  select exists(select 1 from public.payment_analytics_transactions limit 1)
  into v_has_activity;

  select
    coalesce(sum(amount) filter (
      where status = 'succeeded' and transaction_at >= date_trunc('day', now())
    ), 0),
    coalesce(sum(amount) filter (
      where status = 'succeeded' and transaction_at >= date_trunc('month', now())
    ), 0),
    count(*) filter (where status = 'failed')::int
  into v_revenue_today, v_revenue_month, v_failed
  from public._pac267_base_transactions(p_filters) t;

  select count(*)::int into v_active_subs
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  select count(*)::int into v_churned
  from public.subscriptions s
  where s.status = 'cancelled'
    and s.cancelled_at >= date_trunc('month', now());

  select count(distinct customer_name)::int into v_customer_count
  from public._pac267_base_transactions(p_filters) t
  where t.status = 'succeeded'
    and t.transaction_at >= date_trunc('month', now());

  v_arpc := case when v_customer_count = 0 then 0
    else round(v_revenue_month / v_customer_count, 2) end;

  select
    coalesce(sum(amount) filter (where customer_type = 'self_service' and status = 'succeeded'), 0),
    coalesce(sum(amount) filter (where customer_type = 'enterprise' and status = 'succeeded'), 0)
  into v_self_service, v_enterprise
  from public._pac267_base_transactions(p_filters) t
  where t.transaction_at >= now() - interval '30 days';

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer', sub.customer_name,
    'revenue', sub.revenue,
    'open_invoices', sub.open_invoices,
    'last_payment', sub.last_payment,
    'status', sub.status
  ) order by sub.revenue desc), '[]'::jsonb)
  into v_top_enterprise
  from (
    select
      t.customer_name,
      sum(t.amount) filter (where t.status = 'succeeded') as revenue,
      (
        select count(*)::int from public.enterprise_invoices ei
        where ei.status in ('sent', 'overdue')
          and ei.tenant_id is not null
        limit 1
      ) as open_invoices,
      max(t.transaction_at) filter (where t.status = 'succeeded') as last_payment,
      case
        when max(t.transaction_at) filter (where t.status = 'succeeded') >= now() - interval '30 days'
        then 'current'
        else 'attention'
      end as status
    from public._pac267_base_transactions(p_filters) t
    where t.customer_type = 'enterprise'
    group by t.customer_name
    order by revenue desc
    limit 10
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer', t.customer_name,
    'provider', t.provider_key,
    'failure_reason', coalesce(t.failure_reason, 'Unknown'),
    'retry_count', t.retry_count,
    'recommended_action', coalesce(t.recommended_action, 'Review payment method'),
    'transaction_at', t.transaction_at
  ) order by t.transaction_at desc), '[]'::jsonb)
  into v_failed_insights
  from (
    select * from public._pac267_base_transactions(p_filters) t
    where t.status = 'failed'
    order by t.transaction_at desc
    limit 15
  ) t;

  select coalesce(jsonb_agg(distinct country order by country), '[]'::jsonb)
  into v_countries
  from public.payment_analytics_transactions;

  return jsonb_build_object(
    'principle', 'Real-time payment visibility supports confident platform decisions without exposing customer operational records.',
    'has_activity', v_has_activity,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'available_countries', v_countries,
    'overview', jsonb_build_object(
      'revenue_today', v_revenue_today,
      'revenue_this_month', v_revenue_month,
      'active_subscriptions', v_active_subs,
      'failed_payments', v_failed,
      'average_revenue_per_customer', v_arpc,
      'churned_subscriptions', v_churned,
      'currency', 'NOK'
    ),
    'provider_breakdown', public._pac267_provider_breakdown(p_filters),
    'revenue_over_time', jsonb_build_object(
      'last_7_days', public._pac267_revenue_series(p_filters, 7),
      'last_30_days', public._pac267_revenue_series(p_filters, 30),
      'last_12_months', public._pac267_revenue_months(p_filters)
    ),
    'provider_distribution', public._pac267_provider_distribution(p_filters),
    'segments', jsonb_build_object(
      'self_service', v_self_service,
      'enterprise', v_enterprise,
      'currency', 'NOK'
    ),
    'top_enterprise_customers', v_top_enterprise,
    'failed_payment_insights', v_failed_insights
  );
end;
$$;

grant execute on function public.get_payment_analytics_center(jsonb) to authenticated;

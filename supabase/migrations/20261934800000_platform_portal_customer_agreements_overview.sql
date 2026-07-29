-- Platform Portal Customer Agreements Overview V1 (read-only).
-- One row per authoritative subscription for ordinary customers.
-- No tables. No data writes. No invented revenue or renewal dates.

create or replace function public.get_platform_portal_customer_agreements_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_payload jsonb;
begin
  perform public._ppsf258_require_platform_access();

  with scoped as (
    select
      o.id as organization_id,
      cu.id as customer_id,
      co.id as company_id,
      coalesce(
        nullif(btrim(co.name), ''),
        nullif(btrim(cu.company_name), ''),
        nullif(btrim(o.name), ''),
        nullif(btrim(o.slug), ''),
        'Customer'
      ) as company_name,
      nullif(btrim(o.slug), '') as customer_key,
      nullif(btrim(cu.organization_number), '') as registration_number,
      nullif(upper(btrim(cu.country)), '') as country_code
    from public.organizations o
    join public.customers cu on cu.id = o.id
    join public.companies co on co.id = cu.company_id
    where coalesce(co.is_platform, false) = false
      and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
      and o.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
      and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
      and lower(coalesce(o.slug, '')) <> 'my-company-1'
      and lower(coalesce(co.slug, '')) <> 'my-company-1'
  ),
  agreement_rows as (
    select distinct on (s.id)
      s.id as agreement_id,
      sc.customer_id,
      sc.company_id,
      sc.customer_key,
      sc.company_name,
      sc.registration_number,
      sc.country_code,
      nullif(btrim(s.plan_name), '') as agreement_name,
      nullif(btrim(s.plan_key), '') as plan_key,
      nullif(btrim(s.plan_type), '') as plan_type,
      nullif(btrim(s.status), '') as agreement_status,
      case
        when lower(coalesce(s.plan_key, '')) = 'lifetime'
          or lower(coalesce(s.plan_type, '')) = 'lifetime'
          or lower(coalesce(s.billing_cycle, '')) = 'lifetime'
        then 'lifetime'
        when lower(coalesce(s.billing_cycle, '')) in ('yearly', 'annual')
        then 'yearly'
        when lower(coalesce(s.billing_cycle, '')) = 'monthly'
        then 'monthly'
        else nullif(btrim(s.billing_cycle), '')
      end as duration,
      true as is_current,
      coalesce(s.current_period_start, s.created_at) as started_at,
      case
        when lower(coalesce(s.plan_key, '')) = 'lifetime'
          or lower(coalesce(s.plan_type, '')) = 'lifetime'
          or lower(coalesce(s.billing_cycle, '')) = 'lifetime'
        then null
        else s.current_period_end
      end as ends_at,
      s.trial_starts_at,
      s.trial_ends_at,
      case
        when s.next_billing_date is null then null
        else (s.next_billing_date::timestamptz)
      end as renews_at,
      s.service_paused_at as paused_at,
      s.cancelled_at,
      nullif(upper(btrim(s.currency)), '') as currency,
      case
        when s.price_amount is null then null
        else s.price_amount::double precision
      end as amount,
      nullif(btrim(s.billing_cycle), '') as billing_interval,
      lower(coalesce(s.status, '')) as status_l,
      case
        when lower(coalesce(s.plan_key, '')) = 'lifetime'
          or lower(coalesce(s.plan_type, '')) = 'lifetime'
          or lower(coalesce(s.billing_cycle, '')) = 'lifetime'
        then true
        else false
      end as is_unlimited
    from public.subscriptions s
    join scoped sc on sc.customer_id = s.customer_id
    order by
      s.id,
      case lower(coalesce(s.status, ''))
        when 'active' then 1
        when 'trialing' then 2
        when 'past_due' then 3
        when 'unpaid' then 4
        when 'paused' then 5
        when 'suspended' then 6
        else 7
      end,
      s.updated_at desc nulls last,
      s.created_at desc nulls last
  ),
  agreement_json as (
    select
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'agreement_id', ar.agreement_id,
            'customer_id', ar.customer_id,
            'company_id', ar.company_id,
            'customer_key', ar.customer_key,
            'company_name', ar.company_name,
            'registration_number', ar.registration_number,
            'country_code', ar.country_code,
            'agreement_name', ar.agreement_name,
            'plan_key', ar.plan_key,
            'plan_type', ar.plan_type,
            'agreement_status', ar.agreement_status,
            'duration', ar.duration,
            'is_current', ar.is_current,
            'started_at', ar.started_at,
            'ends_at', ar.ends_at,
            'trial_starts_at', ar.trial_starts_at,
            'trial_ends_at', ar.trial_ends_at,
            'renews_at', ar.renews_at,
            'paused_at', ar.paused_at,
            'cancelled_at', ar.cancelled_at,
            'currency', ar.currency,
            'amount', ar.amount,
            'billing_interval', ar.billing_interval
          )
          order by lower(ar.company_name), ar.agreement_id
        ),
        '[]'::jsonb
      ) as agreements
    from agreement_rows ar
  ),
  metrics as (
    select jsonb_build_object(
      'total_agreements', count(*)::integer,
      'active_agreements', count(*) filter (
        where status_l = 'active'
      )::integer,
      'trial_agreements', count(*) filter (
        where status_l = 'trialing'
      )::integer,
      'attention_agreements', count(*) filter (
        where status_l in ('pending', 'past_due', 'unpaid', 'paused', 'suspended')
      )::integer,
      'ended_agreements', count(*) filter (
        where status_l in ('cancelled', 'canceled', 'expired')
      )::integer,
      'unlimited_agreements', count(*) filter (
        where is_unlimited
      )::integer
    ) as metrics
    from agreement_rows
  )
  select jsonb_build_object(
    'generated_at', now(),
    'metrics', m.metrics,
    'agreements', aj.agreements
  )
  into v_payload
  from metrics m
  cross join agreement_json aj;

  return coalesce(v_payload, jsonb_build_object(
    'generated_at', now(),
    'metrics', jsonb_build_object(
      'total_agreements', 0,
      'active_agreements', 0,
      'trial_agreements', 0,
      'attention_agreements', 0,
      'ended_agreements', 0,
      'unlimited_agreements', 0
    ),
    'agreements', '[]'::jsonb
  ));
end;
$$;

revoke all on function public.get_platform_portal_customer_agreements_overview()
  from public, anon;
grant execute on function public.get_platform_portal_customer_agreements_overview()
  to authenticated;

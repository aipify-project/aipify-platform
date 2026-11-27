-- PREPARED_ONLY — do not apply until exact owner Staging/Production approval.
-- AIPIFY Platform Analytics V2: enrich get_platform_metrics with subscription headcounts.
-- Additive JSON keys only. No payment mutation. No customer PII.

create or replace function public.get_platform_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_mrr numeric := 0;
  v_active_subs bigint := 0;
  v_trial_subs bigint := 0;
  v_paid_subs bigint := 0;
  v_cancelled_subs bigint := 0;
  v_total_customers bigint := 0;
  v_outstanding numeric := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  select coalesce(sum(
    case
      when s.billing_cycle = 'yearly' then s.price_amount / 12
      else s.price_amount
    end
  ), 0)
  into v_mrr
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  select count(*) into v_total_customers from public.customers;
  select count(*) into v_active_subs from public.subscriptions where status = 'active';
  select count(*) into v_trial_subs from public.subscriptions where status = 'trialing';
  select count(*) into v_paid_subs from public.subscriptions where status = 'active';
  select count(*) into v_cancelled_subs from public.subscriptions where status in ('cancelled', 'canceled');

  select coalesce(sum(inv.amount), 0)
  into v_outstanding
  from public.invoices inv
  where inv.status in ('sent', 'overdue');

  return jsonb_build_object(
    'revenue', jsonb_build_object(
      'mrr', v_mrr,
      'arr', v_mrr * 12,
      'trial_to_paid_conversion_rate',
        case when v_trial_subs + v_paid_subs = 0 then 0
        else round((v_paid_subs::numeric / (v_trial_subs + v_paid_subs)) * 100, 1)
        end,
      'outstanding_invoice_amount', v_outstanding,
      'average_revenue_per_customer',
        case when v_total_customers = 0 then 0
        else round(v_mrr / v_total_customers, 2)
        end,
      'currency_note', 'Amounts are as stored on subscription/invoice rows; no FX conversion is applied.'
    ),
    'subscriptions', jsonb_build_object(
      'active', v_active_subs,
      'trialing', v_trial_subs,
      'paid_active', v_paid_subs,
      'cancelled', v_cancelled_subs
    ),
    'customers', jsonb_build_object(
      'total', v_total_customers,
      'active', (select count(*) from public.customers where status = 'active'),
      'trial', (select count(*) from public.customers where status = 'trial'),
      'paused', (select count(*) from public.customers where status = 'paused'),
      'cancelled', (select count(*) from public.customers where status = 'cancelled'),
      'overdue', (select count(*) from public.customers where status = 'overdue')
    ),
    'installations', jsonb_build_object(
      'total', (select count(*) from public.installations),
      'active', (select count(*) from public.installations where status = 'active'),
      'failed', (select count(*) from public.installations where status in ('revoked', 'paused')),
      'average_per_customer',
        case when v_total_customers = 0 then 0
        else round((select count(*)::numeric from public.installations) / v_total_customers, 1)
        end
    ),
    'ai_activity', jsonb_build_object(
      'support_requests_handled',
        coalesce((select sum(support_requests_handled) from public.usage_statistics), 0),
      'automated_tasks_completed',
        coalesce((select sum(automated_actions) from public.usage_statistics), 0),
      'ai_recommendations_generated',
        coalesce((select sum(ai_recommendations) from public.usage_statistics), 0),
      'average_assistant_response_time_seconds',
        coalesce((select round(avg(avg_response_time_seconds), 1) from public.usage_statistics), 0)
    ),
    'growth', jsonb_build_object(
      'new_customers_30d',
        (select count(*) from public.customers where created_at >= now() - interval '30 days'),
      'new_installations_30d',
        (select count(*) from public.installations where created_at >= now() - interval '30 days'),
      'most_used_modules',
        coalesce(
          (
            select jsonb_agg(module_key order by usage_count desc)
            from (
              select im.module_key, count(*) as usage_count
              from public.installation_modules im
              where im.enabled = true
              group by im.module_key
              order by usage_count desc
              limit 5
            ) modules
          ),
          '[]'::jsonb
        ),
      'customer_retention_rate',
        case when v_total_customers = 0 then 100
        else round(
          ((select count(*) from public.customers where status in ('active', 'trial'))::numeric
            / v_total_customers) * 100,
          1
        )
        end
    )
  );
end;
$$;

revoke all on function public.get_platform_metrics() from public, anon;
grant execute on function public.get_platform_metrics() to authenticated;

comment on function public.get_platform_metrics() is
  'Platform Analytics V2 metrics — adds subscriptions{} headcounts; no FX conversion; platform admin only.';

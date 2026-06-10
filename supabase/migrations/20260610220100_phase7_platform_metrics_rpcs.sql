-- Phase 7 RPCs: platform metrics, enhanced customers, master customer detail

drop function if exists public.list_platform_customer_records();

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
  user_count bigint,
  plan_name text,
  plan_type text,
  trial_days_remaining integer,
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
    count(distinct u.id) as user_count,
    s.plan_name,
    s.plan_type,
    case
      when s.trial_ends_at is not null and s.status = 'trialing'
        then greatest(0, ceil(extract(epoch from (s.trial_ends_at - now())) / 86400)::integer)
      else null
    end as trial_days_remaining,
    c.created_at
  from public.customers c
  left join public.installations i on i.company_id = c.company_id
  left join public.users u on u.company_id = c.company_id
  left join public.subscriptions s on s.customer_id = c.id
  group by c.id, s.plan_name, s.plan_type, s.trial_ends_at, s.status
  order by c.customer_number asc;
end;
$$;

grant execute on function public.list_platform_customer_records() to authenticated;

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
        end
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

grant execute on function public.get_platform_metrics() to authenticated;

create or replace function public.get_platform_customer_master_detail(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_result jsonb;
  v_outstanding numeric := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Insufficient permissions';
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = p_customer_id;

  select coalesce(sum(inv.amount), 0)
  into v_outstanding
  from public.invoices inv
  where inv.customer_id = p_customer_id
    and inv.status in ('sent', 'overdue', 'draft');

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
    'overview', jsonb_build_object(
      'plan_name', s.plan_name,
      'plan_type', s.plan_type,
      'subscription_status', s.status,
      'customer_status', c.status,
      'trial_days_remaining',
        case
          when s.trial_ends_at is not null and s.status = 'trialing'
            then greatest(0, ceil(extract(epoch from (s.trial_ends_at - now())) / 86400)::integer)
          else null
        end,
      'next_billing_date', s.next_billing_date,
      'total_users', (select count(*) from public.users u where u.company_id = c.company_id),
      'total_installations', (select count(*) from public.installations i where i.company_id = c.company_id),
      'outstanding_invoices', v_outstanding,
      'payment_provider', pp.provider
    ),
    'users', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', u.id,
            'full_name', u.full_name,
            'email', au.email,
            'role', u.role,
            'status', u.status,
            'last_login_at', u.last_login_at,
            'is_owner', u.role = 'owner'
          )
          order by u.created_at asc
        )
        from public.users u
        left join auth.users au on au.id = u.auth_user_id
        where u.company_id = c.company_id
      ),
      '[]'::jsonb
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
            'last_synced_at', i.last_synced_at,
            'modules', coalesce(
              (
                select jsonb_agg(im.module_key order by im.module_key)
                from public.installation_modules im
                where im.installation_id = i.id and im.enabled = true
              ),
              '[]'::jsonb
            )
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
    'usage', (
      select row_to_json(us.*)
      from public.usage_statistics us
      where us.customer_id = c.id
    ),
    'support', coalesce(
      (
        select jsonb_agg(row_to_json(sc.*) order by sc.opened_at desc)
        from public.support_cases sc
        where sc.customer_id = c.id
      ),
      '[]'::jsonb
    ),
    'activity_log', coalesce(
      (
        select jsonb_agg(row_to_json(al.*) order by al.created_at desc)
        from public.activity_logs al
        where al.customer_id = c.id
      ),
      '[]'::jsonb
    )
  )
  into v_result
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  left join public.payment_profiles pp on pp.customer_id = c.id
  where c.id = p_customer_id;

  return v_result;
end;
$$;

grant execute on function public.get_platform_customer_master_detail(uuid) to authenticated;

create or replace function public.seed_phase7_pilot_data()
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_customer_id uuid;
  v_company_id uuid;
  v_user_id uuid;
  v_subscription_id uuid;
begin
  select c.id, c.company_id
  into v_customer_id, v_company_id
  from public.customers c
  where c.customer_number = 'AIP-000001'
  limit 1;

  if v_customer_id is null then
    return null;
  end if;

  perform public.seed_pilot_billing_flow();

  update public.users
  set last_login_at = now() - interval '2 hours',
      status = 'active'
  where company_id = v_company_id;

  insert into public.usage_statistics (
    customer_id,
    support_requests_handled,
    automated_actions,
    ai_recommendations,
    avg_response_time_seconds,
    most_used_modules
  )
  values (
    v_customer_id,
    47,
    128,
    23,
    95.5,
    '["assistant", "support", "analytics"]'::jsonb
  )
  on conflict (customer_id) do update
  set
    support_requests_handled = excluded.support_requests_handled,
    automated_actions = excluded.automated_actions,
    ai_recommendations = excluded.ai_recommendations,
    avg_response_time_seconds = excluded.avg_response_time_seconds,
    most_used_modules = excluded.most_used_modules,
    updated_at = now();

  insert into public.support_cases (
    customer_id,
    subject,
    status,
    assigned_agent,
    opened_at,
    last_contact_at
  )
  select v_customer_id, 'Onboarding check-in', 'open', 'Platform Support', now() - interval '3 days', now() - interval '1 day'
  where not exists (
    select 1 from public.support_cases where customer_id = v_customer_id and subject = 'Onboarding check-in'
  );

  insert into public.activity_logs (customer_id, event_type, title, details)
  select v_customer_id, 'customer.created', 'Customer created', jsonb_build_object('customer_number', 'AIP-000001')
  where not exists (select 1 from public.activity_logs where customer_id = v_customer_id and event_type = 'customer.created');

  insert into public.activity_logs (customer_id, event_type, title, details)
  select v_customer_id, 'trial.started', 'Trial started', jsonb_build_object('days', 14)
  where not exists (select 1 from public.activity_logs where customer_id = v_customer_id and event_type = 'trial.started');

  insert into public.activity_logs (customer_id, event_type, title, details)
  select v_customer_id, 'invoice.generated', 'Invoice generated', jsonb_build_object('invoice_number', 'AIP-INV-000001')
  where not exists (select 1 from public.activity_logs where customer_id = v_customer_id and event_type = 'invoice.generated');

  insert into public.activity_logs (customer_id, event_type, title, details)
  select v_customer_id, 'installation.created', 'Installation connected', jsonb_build_object('source', 'pilot')
  where not exists (select 1 from public.activity_logs where customer_id = v_customer_id and event_type = 'installation.created');

  return v_customer_id;
end;
$$;

select public.seed_phase7_pilot_data();

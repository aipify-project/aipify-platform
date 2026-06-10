-- Phase 20 — License, Ownership & Trust Center

-- ---------------------------------------------------------------------------
-- 1. License service state on subscriptions
-- ---------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists license_service_status text not null default 'active',
  add column if not exists grace_period_ends_at timestamptz,
  add column if not exists service_paused_at timestamptz,
  add column if not exists payment_overdue_since timestamptz;

alter table public.subscriptions
  drop constraint if exists subscriptions_license_service_status_check;

alter table public.subscriptions
  add constraint subscriptions_license_service_status_check check (
    license_service_status in ('active', 'grace_period', 'paused')
  );

-- ---------------------------------------------------------------------------
-- 2. Resolve license service status from subscription + payment state
-- ---------------------------------------------------------------------------
create or replace function public.resolve_license_service_status(p_customer_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sub public.subscriptions;
  v_overdue_since timestamptz;
  v_days_overdue integer;
begin
  select * into v_sub
  from public.subscriptions s
  where s.customer_id = p_customer_id;

  if v_sub.id is null then
    return 'paused';
  end if;

  if v_sub.status in ('active', 'trialing') then
    return 'active';
  end if;

  select min(inv.due_date)::timestamptz into v_overdue_since
  from public.invoices inv
  where inv.customer_id = p_customer_id
    and inv.status = 'overdue';

  v_overdue_since := coalesce(v_overdue_since, v_sub.payment_overdue_since, v_sub.updated_at);

  if v_sub.status = 'past_due' or v_overdue_since is not null then
    v_days_overdue := greatest(
      0,
      floor(extract(epoch from (now() - coalesce(v_overdue_since, now()))) / 86400)::integer
    );
    if v_days_overdue <= 3 then
      return 'grace_period';
    end if;
    return 'paused';
  end if;

  if v_sub.status in ('paused', 'cancelled') then
    return 'paused';
  end if;

  return 'active';
end;
$$;

revoke execute on function public.resolve_license_service_status(uuid) from public, anon;

-- ---------------------------------------------------------------------------
-- 3. Customer License & Trust Center overview
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_license_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_company_name text;
  v_license_status text;
  v_limits jsonb;
  v_grace_ends timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id, co.name
  into v_customer_id, v_company_name
  from public.customers c
  join public.companies co on co.id = c.company_id
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_license_status := public.resolve_license_service_status(v_customer_id);
  v_limits := public.get_customer_license_limits(v_customer_id);

  if v_license_status = 'grace_period' then
    v_grace_ends := coalesce(
      (select s.grace_period_ends_at from public.subscriptions s where s.customer_id = v_customer_id),
      now() + interval '3 days'
    );
  end if;

  update public.subscriptions s
  set
    license_service_status = v_license_status,
    grace_period_ends_at = case when v_license_status = 'grace_period' then v_grace_ends else null end,
    service_paused_at = case
      when v_license_status = 'paused' and s.service_paused_at is null then now()
      when v_license_status <> 'paused' then null
      else s.service_paused_at
    end,
    updated_at = now()
  where s.customer_id = v_customer_id;

  return jsonb_build_object(
    'has_customer', true,
    'company_name', v_company_name,
    'software_version', '1.0.0',
    'software_owner', 'Aipify Group AS',
    'license_status', v_license_status,
    'grace_period_days', 3,
    'grace_period_ends_at', v_grace_ends,
    'paused_message',
      case
        when v_license_status = 'paused'
          then 'Aipify services are temporarily paused due to an overdue subscription. Services will resume automatically once payment has been received.'
        else null
      end,
    'reactivation_message', 'Welcome back. Aipify has resumed normal operations.',
    'subscription', jsonb_build_object(
      'plan_name', v_limits ->> 'plan_name',
      'plan_type', v_limits ->> 'plan_type',
      'subscription_status', v_limits ->> 'subscription_status',
      'renewal_date', (
        select s.next_billing_date::text
        from public.subscriptions s
        where s.customer_id = v_customer_id
      ),
      'payment_status', (
        select pp.payment_status
        from public.payment_profiles pp
        where pp.customer_id = v_customer_id
        limit 1
      ),
      'installation_count', coalesce((v_limits ->> 'used_installations')::int, 0),
      'domain_count', coalesce((v_limits ->> 'used_domains')::int, 0),
      'user_count', coalesce((v_limits ->> 'used_users')::int, 0),
      'max_installations', v_limits ->> 'max_installations',
      'max_domains', v_limits ->> 'max_domains',
      'max_users', v_limits ->> 'max_users'
    ),
    'legal', jsonb_build_object(
      'website', 'https://aipify.ai',
      'support_email', 'support@aipify.ai',
      'privacy_email', 'privacy@aipify.ai'
    )
  );
end;
$$;

grant execute on function public.get_customer_license_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Block operational capacity when services are paused
-- ---------------------------------------------------------------------------
create or replace function public.assert_license_capacity(
  p_customer_id uuid,
  p_check_installation boolean default false,
  p_check_domain boolean default false,
  p_domain text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limits jsonb;
  v_status text;
  v_license_status text;
  v_max_inst integer;
  v_max_dom integer;
  v_used_inst integer;
  v_used_dom integer;
  v_domain text;
begin
  v_license_status := public.resolve_license_service_status(p_customer_id);

  if v_license_status = 'paused' then
    perform public.record_license_check(
      p_customer_id, 'subscription_status', 'blocked',
      'Aipify services are paused due to an overdue subscription.', p_domain, null
    );
    raise exception 'Aipify services are paused. Please update billing to continue.';
  end if;

  v_limits := public.get_customer_license_limits(p_customer_id);

  if coalesce((v_limits ->> 'has_subscription')::boolean, false) = false then
    perform public.record_license_check(
      p_customer_id, 'subscription_status', 'blocked',
      'No active subscription found.', p_domain, null
    );
    raise exception 'No active subscription';
  end if;

  v_status := v_limits ->> 'subscription_status';
  if v_status not in ('trialing', 'active', 'past_due') then
    perform public.record_license_check(
      p_customer_id, 'subscription_status', 'blocked',
      'Subscription is not active.', p_domain, null
    );
    raise exception 'Subscription is not active';
  end if;

  v_max_inst := nullif(v_limits ->> 'max_installations', '')::integer;
  v_max_dom := nullif(v_limits ->> 'max_domains', '')::integer;
  v_used_inst := (v_limits ->> 'used_installations')::integer;
  v_used_dom := (v_limits ->> 'used_domains')::integer;

  if p_check_installation and v_max_inst is not null and v_used_inst >= v_max_inst then
    perform public.record_license_check(
      p_customer_id, 'installation_limit', 'blocked',
      format('Installation limit reached (%s of %s).', v_used_inst, v_max_inst),
      p_domain, null
    );
    raise exception 'Installation limit reached. Upgrade your plan to add more websites.';
  end if;

  if p_check_domain then
    v_domain := public.normalize_domain(p_domain);
    if v_domain is null then
      raise exception 'Invalid domain';
    end if;

    if exists (
      select 1 from public.customer_domains cd
      where cd.customer_id = p_customer_id and cd.domain = v_domain
    ) then
      return;
    end if;

    if v_max_dom is not null and v_used_dom >= v_max_dom then
      perform public.record_license_check(
        p_customer_id, 'domain_limit', 'blocked',
        format('Domain limit reached (%s of %s).', v_used_dom, v_max_dom),
        p_domain, null
      );
      raise exception 'Domain limit reached. Upgrade your plan to add more domains.';
    end if;
  end if;
end;
$$;

grant execute on function public.assert_license_capacity(uuid, boolean, boolean, text) to authenticated;

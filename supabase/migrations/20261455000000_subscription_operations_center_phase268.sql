-- Phase 268 — Subscription Operations Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.subscription_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  event_type text not null check (
    event_type in (
      'subscription_created', 'trial_extended', 'plan_upgraded', 'plan_downgraded',
      'subscription_cancelled', 'subscription_reactivated', 'subscription_suspended',
      'trial_converted', 'reminder_sent'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists subscription_operations_audit_created_idx
  on public.subscription_operations_audit_logs (created_at desc);

create table if not exists public.subscription_operations_plan_changes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  change_type text not null check (change_type in ('upgrade', 'downgrade')),
  previous_plan text not null,
  new_plan text not null,
  effective_date date not null default current_date,
  revenue_impact numeric(12, 2) not null default 0,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists subscription_operations_plan_changes_created_idx
  on public.subscription_operations_plan_changes (created_at desc);

create table if not exists public.subscription_operations_enterprise_contracts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  contract_start date not null default current_date,
  contract_end date,
  payment_terms text not null default 'Net 30',
  account_manager text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_operations_past_due_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  outstanding_amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  days_overdue integer not null default 0,
  payment_provider text not null default 'stripe',
  recommended_action text not null default 'Retry payment',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists subscription_operations_past_due_open_idx
  on public.subscription_operations_past_due_cases (resolved, days_overdue desc);

create table if not exists public.subscription_operations_trial_insights (
  customer_id uuid primary key references public.customers (id) on delete cascade,
  conversion_probability numeric(5, 2) not null default 50 check (
    conversion_probability between 0 and 100
  ),
  updated_at timestamptz not null default now()
);

alter table public.subscription_operations_audit_logs enable row level security;
alter table public.subscription_operations_plan_changes enable row level security;
alter table public.subscription_operations_enterprise_contracts enable row level security;
alter table public.subscription_operations_past_due_cases enable row level security;
alter table public.subscription_operations_trial_insights enable row level security;

revoke all on public.subscription_operations_audit_logs from authenticated, anon;
revoke all on public.subscription_operations_plan_changes from authenticated, anon;
revoke all on public.subscription_operations_enterprise_contracts from authenticated, anon;
revoke all on public.subscription_operations_past_due_cases from authenticated, anon;
revoke all on public.subscription_operations_trial_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._soc268_require_platform_admin()
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

create or replace function public._soc268_log_audit(
  p_customer_id uuid,
  p_subscription_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscription_operations_audit_logs (
    customer_id, subscription_id, event_type, summary, actor_user_id, context
  ) values (
    p_customer_id, p_subscription_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  );
end;
$$;

create or replace function public._soc268_display_status(
  p_subscription public.subscriptions,
  p_has_contract boolean
)
returns text
language sql
immutable
as $$
  select case
    when p_has_contract and p_subscription.plan_type = 'enterprise' then 'enterprise_contract'
    when p_subscription.status = 'trialing' then 'trial'
    when p_subscription.status = 'active' then 'active'
    when p_subscription.status = 'past_due' then 'past_due'
    when p_subscription.status = 'paused' then 'suspended'
    when p_subscription.status = 'cancelled' then 'cancelled'
    else 'active'
  end;
$$;

create or replace function public._soc268_build_subscription_row(p_subscription_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sub public.subscriptions;
  v_customer public.customers;
  v_provider text := 'invoice';
  v_has_contract boolean := false;
  v_display_status text;
begin
  select * into v_sub from public.subscriptions where id = p_subscription_id;
  if v_sub.id is null then return null; end if;

  select * into v_customer from public.customers where id = v_sub.customer_id;

  select coalesce(pp.provider, 'invoice') into v_provider
  from public.payment_profiles pp where pp.customer_id = v_sub.customer_id;

  select exists(
    select 1 from public.subscription_operations_enterprise_contracts ec
    where ec.customer_id = v_sub.customer_id
  ) into v_has_contract;

  v_display_status := public._soc268_display_status(v_sub, v_has_contract);

  return jsonb_build_object(
    'id', v_sub.id,
    'customer_id', v_sub.customer_id,
    'customer', coalesce(v_customer.company_name, v_customer.full_name, 'Customer'),
    'customer_number', v_customer.customer_number,
    'plan', v_sub.plan_name,
    'plan_type', v_sub.plan_type,
    'users', v_sub.max_users,
    'billing_provider', v_provider,
    'monthly_value', v_sub.price_amount,
    'currency', v_sub.currency,
    'renewal_date', v_sub.next_billing_date,
    'status', v_display_status,
    'country', v_customer.country
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed audit sample
-- ---------------------------------------------------------------------------
insert into public.subscription_operations_audit_logs (event_type, summary)
select * from (values
  ('subscription_created'::text, 'Subscription operations center initialized.'),
  ('trial_extended', 'Sample trial extension recorded for platform audit visibility.')
) as v(event_type, summary)
where not exists (select 1 from public.subscription_operations_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_subscription_operations_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_subscriptions jsonb;
  v_trials jsonb;
  v_upgrades jsonb;
  v_downgrades jsonb;
  v_renewals jsonb;
  v_past_due jsonb;
  v_contracts jsonb;
  v_audit jsonb;
  v_has_subscriptions boolean;
  v_plan_filter text;
  v_status_filter text;
  v_country_filter text;
  v_provider_filter text;
  v_renewal_filter text;
begin
  perform public._soc268_require_platform_admin();

  v_plan_filter := nullif(p_filters->>'plan', '');
  v_status_filter := nullif(p_filters->>'status', '');
  v_country_filter := nullif(p_filters->>'country', '');
  v_provider_filter := nullif(p_filters->>'provider', '');
  v_renewal_filter := nullif(p_filters->>'renewal_period', '');

  select exists(select 1 from public.subscriptions limit 1) into v_has_subscriptions;

  select jsonb_build_object(
    'active_subscriptions', count(*) filter (where s.status = 'active'),
    'trial_accounts', count(*) filter (where s.status = 'trialing'),
    'upcoming_renewals', count(*) filter (
      where s.next_billing_date is not null
        and s.next_billing_date <= current_date + 30
        and s.status in ('active', 'trialing')
    ),
    'upgrades_this_month', (
      select count(*)::int from public.subscription_operations_plan_changes pc
      where pc.change_type = 'upgrade'
        and pc.created_at >= date_trunc('month', now())
    ),
    'downgrades_this_month', (
      select count(*)::int from public.subscription_operations_plan_changes pc
      where pc.change_type = 'downgrade'
        and pc.created_at >= date_trunc('month', now())
    ),
    'cancelled_subscriptions', count(*) filter (
      where s.status = 'cancelled'
        and s.cancelled_at >= date_trunc('month', now())
    )
  ) into v_overview
  from public.subscriptions s;

  select coalesce(jsonb_agg(row order by (row->>'customer')), '[]'::jsonb)
  into v_subscriptions
  from (
    select public._soc268_build_subscription_row(s.id) as row
    from public.subscriptions s
    join public.customers c on c.id = s.customer_id
    left join public.payment_profiles pp on pp.customer_id = s.customer_id
    where (v_plan_filter is null or s.plan_type = v_plan_filter)
      and (v_country_filter is null or c.country = v_country_filter)
      and (v_provider_filter is null or coalesce(pp.provider, 'invoice') = v_provider_filter)
      and (
        v_status_filter is null
        or public._soc268_display_status(
          s,
          exists(select 1 from public.subscription_operations_enterprise_contracts ec where ec.customer_id = s.customer_id)
        ) = v_status_filter
      )
      and (
        v_renewal_filter is null
        or (
          v_renewal_filter = '7d' and s.next_billing_date <= current_date + 7
        )
        or (
          v_renewal_filter = '30d' and s.next_billing_date <= current_date + 30
        )
        or (
          v_renewal_filter = '90d' and s.next_billing_date <= current_date + 90
        )
      )
    order by coalesce(c.company_name, c.full_name)
    limit 100
  ) sub
  where row is not null;

  select coalesce(jsonb_agg(jsonb_build_object(
    'subscription_id', s.id,
    'customer_id', s.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'trial_start', s.trial_starts_at,
    'trial_end', s.trial_ends_at,
    'days_remaining', greatest(0, (s.trial_ends_at::date - current_date)),
    'conversion_probability', coalesce(ti.conversion_probability, 50)
  ) order by s.trial_ends_at nulls last), '[]'::jsonb)
  into v_trials
  from public.subscriptions s
  join public.customers c on c.id = s.customer_id
  left join public.subscription_operations_trial_insights ti on ti.customer_id = s.customer_id
  where s.status = 'trialing';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pc.id,
    'customer_id', pc.customer_id,
    'previous_plan', pc.previous_plan,
    'new_plan', pc.new_plan,
    'effective_date', pc.effective_date,
    'revenue_impact', pc.revenue_impact
  ) order by pc.created_at desc), '[]'::jsonb)
  into v_upgrades
  from (
    select * from public.subscription_operations_plan_changes
    where change_type = 'upgrade'
    order by created_at desc limit 20
  ) pc;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pc.id,
    'customer_id', pc.customer_id,
    'previous_plan', pc.previous_plan,
    'new_plan', pc.new_plan,
    'effective_date', pc.effective_date,
    'reason', coalesce(pc.reason, 'Not specified')
  ) order by pc.created_at desc), '[]'::jsonb)
  into v_downgrades
  from (
    select * from public.subscription_operations_plan_changes
    where change_type = 'downgrade'
    order by created_at desc limit 20
  ) pc;

  select jsonb_build_object(
    'within_7_days', coalesce((
      select jsonb_agg(public._soc268_build_subscription_row(s.id))
      from public.subscriptions s
      where s.next_billing_date <= current_date + 7
        and s.status in ('active', 'trialing')
    ), '[]'::jsonb),
    'within_30_days', coalesce((
      select jsonb_agg(public._soc268_build_subscription_row(s.id))
      from public.subscriptions s
      where s.next_billing_date <= current_date + 30
        and s.status in ('active', 'trialing')
    ), '[]'::jsonb),
    'within_90_days', coalesce((
      select jsonb_agg(public._soc268_build_subscription_row(s.id))
      from public.subscriptions s
      where s.next_billing_date <= current_date + 90
        and s.status in ('active', 'trialing')
    ), '[]'::jsonb)
  ) into v_renewals;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pd.id,
    'customer_id', pd.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'outstanding_amount', pd.outstanding_amount,
    'currency', pd.currency,
    'days_overdue', pd.days_overdue,
    'payment_provider', pd.payment_provider,
    'recommended_action', pd.recommended_action
  ) order by pd.days_overdue desc), '[]'::jsonb)
  into v_past_due
  from public.subscription_operations_past_due_cases pd
  join public.customers c on c.id = pd.customer_id
  where pd.resolved = false;

  -- Derive past due from subscriptions if no cases seeded
  if jsonb_array_length(v_past_due) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id,
      'customer_id', s.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'outstanding_amount', s.price_amount,
      'currency', s.currency,
      'days_overdue', greatest(0, (current_date - coalesce(s.next_billing_date, current_date))),
      'payment_provider', coalesce(pp.provider, 'invoice'),
      'recommended_action', case
        when greatest(0, (current_date - coalesce(s.next_billing_date, current_date))) > 14 then 'Escalate'
        when greatest(0, (current_date - coalesce(s.next_billing_date, current_date))) > 7 then 'Contact customer'
        else 'Retry payment'
      end
    )), '[]'::jsonb)
    into v_past_due
    from public.subscriptions s
    join public.customers c on c.id = s.customer_id
    left join public.payment_profiles pp on pp.customer_id = s.customer_id
    where s.status = 'past_due';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_id', ec.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'contract_start', ec.contract_start,
    'contract_end', ec.contract_end,
    'payment_terms', ec.payment_terms,
    'account_manager', ec.account_manager
  ) order by ec.contract_start desc), '[]'::jsonb)
  into v_contracts
  from public.subscription_operations_enterprise_contracts ec
  join public.customers c on c.id = ec.customer_id;

  -- Include enterprise plan subscriptions without explicit contract row
  if jsonb_array_length(v_contracts) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'customer_id', s.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'contract_start', s.created_at::date,
      'contract_end', null,
      'payment_terms', 'Net 30',
      'account_manager', 'Aipify Enterprise Team'
    )), '[]'::jsonb)
    into v_contracts
    from public.subscriptions s
    join public.customers c on c.id = s.customer_id
    where s.plan_type = 'enterprise' and s.status in ('active', 'trialing');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'subscription_id', l.subscription_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.subscription_operations_audit_logs order by created_at desc limit 40
  ) l;

  return jsonb_build_object(
    'principle', 'Centralized subscription operations give Aipify Group AS confident control over customer lifecycle and revenue.',
    'has_subscriptions', v_has_subscriptions,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'subscriptions', v_subscriptions,
    'trials', v_trials,
    'upgrades', v_upgrades,
    'downgrades', v_downgrades,
    'renewals', v_renewals,
    'past_due', v_past_due,
    'enterprise_contracts', v_contracts,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_subscription_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_subscription_id uuid;
  v_customer_id uuid;
  v_sub public.subscriptions;
  v_new_plan text;
  v_days int;
  v_reason text;
  v_event_type text;
  v_summary text;
begin
  perform public._soc268_require_platform_admin();

  v_action := p_payload->>'action';
  v_subscription_id := (p_payload->>'subscription_id')::uuid;
  v_customer_id := (p_payload->>'customer_id')::uuid;
  v_new_plan := p_payload->>'new_plan';
  v_days := coalesce((p_payload->>'days')::int, 7);
  v_reason := coalesce(p_payload->>'reason', 'Platform admin action');

  if v_subscription_id is not null then
    select * into v_sub from public.subscriptions where id = v_subscription_id;
    v_customer_id := coalesce(v_customer_id, v_sub.customer_id);
  end if;

  case v_action
    when 'extend_trial' then
      update public.subscriptions set
        trial_ends_at = coalesce(trial_ends_at, now()) + (v_days || ' days')::interval,
        updated_at = now()
      where id = v_subscription_id;
      v_event_type := 'trial_extended';
      v_summary := format('Trial extended by %s days', v_days);

    when 'convert_to_paid' then
      update public.subscriptions set status = 'active', updated_at = now()
      where id = v_subscription_id;
      v_event_type := 'trial_converted';
      v_summary := 'Trial converted to paid subscription';

    when 'upgrade_plan' then
      insert into public.subscription_operations_plan_changes (
        customer_id, subscription_id, change_type, previous_plan, new_plan, revenue_impact
      ) values (
        v_customer_id, v_subscription_id, 'upgrade', v_sub.plan_name,
        coalesce(v_new_plan, v_sub.plan_name), coalesce((p_payload->>'revenue_impact')::numeric, 0)
      );
      if v_new_plan is not null then
        update public.subscriptions set plan_name = v_new_plan, updated_at = now()
        where id = v_subscription_id;
      end if;
      v_event_type := 'plan_upgraded';
      v_summary := format('Plan upgraded to %s', coalesce(v_new_plan, v_sub.plan_name));

    when 'downgrade_plan' then
      insert into public.subscription_operations_plan_changes (
        customer_id, subscription_id, change_type, previous_plan, new_plan, reason
      ) values (
        v_customer_id, v_subscription_id, 'downgrade', v_sub.plan_name,
        coalesce(v_new_plan, v_sub.plan_name), v_reason
      );
      if v_new_plan is not null then
        update public.subscriptions set plan_name = v_new_plan, updated_at = now()
        where id = v_subscription_id;
      end if;
      v_event_type := 'plan_downgraded';
      v_summary := format('Plan downgraded to %s', coalesce(v_new_plan, v_sub.plan_name));

    when 'suspend_access' then
      update public.subscriptions set status = 'paused', updated_at = now()
      where id = v_subscription_id;
      v_event_type := 'subscription_suspended';
      v_summary := 'Subscription access suspended';

    when 'reactivate' then
      update public.subscriptions set status = 'active', updated_at = now()
      where id = v_subscription_id;
      v_event_type := 'subscription_reactivated';
      v_summary := 'Subscription reactivated';

    when 'cancel_subscription' then
      update public.subscriptions set status = 'cancelled', cancelled_at = now(), updated_at = now()
      where id = v_subscription_id;
      v_event_type := 'subscription_cancelled';
      v_summary := 'Subscription cancelled';

    when 'send_reminder' then
      v_event_type := 'reminder_sent';
      v_summary := 'Trial or renewal reminder sent';

    else
      raise exception 'Invalid action';
  end case;

  perform public._soc268_log_audit(
    v_customer_id, v_subscription_id, v_event_type, v_summary, p_payload
  );

  return public._soc268_build_subscription_row(v_subscription_id);
end;
$$;

grant execute on function public.get_subscription_operations_center(jsonb) to authenticated;
grant execute on function public.record_subscription_operations_action(jsonb) to authenticated;

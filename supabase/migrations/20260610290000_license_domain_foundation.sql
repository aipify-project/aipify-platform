-- License, Domain & Plan Limit Enforcement (foundation phase)

-- ---------------------------------------------------------------------------
-- 1. plans catalog
-- ---------------------------------------------------------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique check (
    plan_key in ('starter', 'growth', 'business', 'enterprise')
  ),
  name text not null,
  description text,
  price_amount numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  billing_cycle text not null default 'monthly' check (
    billing_cycle in ('monthly', 'yearly')
  ),
  max_users integer,
  max_installations integer,
  max_domains integer,
  features jsonb not null default '[]'::jsonb,
  allowed_modules jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. extend subscriptions
-- ---------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists plan_id uuid references public.plans (id) on delete set null,
  add column if not exists plan_key text,
  add column if not exists max_domains integer,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz,
  add column if not exists provider text,
  add column if not exists provider_subscription_id text;

-- ---------------------------------------------------------------------------
-- 3. customer_domains
-- ---------------------------------------------------------------------------
create table if not exists public.customer_domains (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.installations (id) on delete set null,
  domain text not null,
  status text not null default 'pending' check (
    status in ('active', 'pending', 'disabled', 'removed')
  ),
  verification_status text not null default 'unverified' check (
    verification_status in ('unverified', 'pending', 'verified', 'failed')
  ),
  verification_method text,
  verified_at timestamptz,
  added_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, domain)
);

create index if not exists customer_domains_customer_id_idx
  on public.customer_domains (customer_id);
create index if not exists customer_domains_domain_idx
  on public.customer_domains (domain);

-- ---------------------------------------------------------------------------
-- 4. license_checks audit log
-- ---------------------------------------------------------------------------
create table if not exists public.license_checks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  domain text,
  installation_id uuid references public.installations (id) on delete set null,
  check_type text not null check (
    check_type in (
      'domain_limit',
      'installation_limit',
      'module_access',
      'subscription_status',
      'payment_status',
      'domain_verification',
      'domain_lock'
    )
  ),
  result text not null check (result in ('allowed', 'blocked', 'warning')),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists license_checks_customer_id_idx
  on public.license_checks (customer_id, created_at desc);

alter table public.plans enable row level security;
alter table public.customer_domains enable row level security;
alter table public.license_checks enable row level security;

revoke all on public.plans from authenticated, anon;
revoke all on public.customer_domains from authenticated, anon;
revoke all on public.license_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Seed plans
-- ---------------------------------------------------------------------------
insert into public.plans (
  plan_key, name, description, price_amount, currency,
  max_users, max_installations, max_domains,
  features, allowed_modules
)
values
  (
    'starter', 'Starter', 'Support AI for a single website.',
    490, 'NOK', 1, 1, 1,
    '["support_ai"]'::jsonb,
    '["support_ai"]'::jsonb
  ),
  (
    'growth', 'Growth', 'Support AI and analytics for growing teams.',
    1490, 'NOK', 5, 3, 3,
    '["support_ai","analytics_ai"]'::jsonb,
    '["support_ai","analytics_ai"]'::jsonb
  ),
  (
    'business', 'Business', 'Full operational suite for multiple sites.',
    3990, 'NOK', 25, 10, 10,
    '["support_ai","analytics_ai","commerce_ai","assistant"]'::jsonb,
    '["support_ai","analytics_ai","commerce_ai","assistant","notifications"]'::jsonb
  ),
  (
    'enterprise', 'Enterprise', 'Custom limits and all modules.',
    0, 'NOK', null, null, null,
    '["all"]'::jsonb,
    '["support_ai","analytics_ai","commerce_ai","assistant","notifications","install_ai"]'::jsonb
  )
on conflict (plan_key) do update set
  name = excluded.name,
  description = excluded.description,
  max_users = excluded.max_users,
  max_installations = excluded.max_installations,
  max_domains = excluded.max_domains,
  features = excluded.features,
  allowed_modules = excluded.allowed_modules,
  updated_at = now();

-- Backfill subscriptions from plans
update public.subscriptions s
set
  plan_id = p.id,
  plan_key = p.plan_key,
  max_users = coalesce(s.max_users, p.max_users),
  max_installations = coalesce(s.max_installations, p.max_installations),
  max_domains = coalesce(s.max_domains, p.max_domains),
  current_period_start = coalesce(s.current_period_start, s.trial_starts_at, s.created_at),
  current_period_end = coalesce(s.current_period_end, s.trial_ends_at, s.next_billing_date::timestamptz),
  updated_at = now()
from public.plans p
where p.plan_key = s.plan_type
  and s.plan_id is null;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.normalize_domain(p_input text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(
    lower(
      regexp_replace(
        regexp_replace(trim(coalesce(p_input, '')), '^https?://', '', 'i'),
        '/.*$', ''
      )
    ),
    ''
  );
$$;

create or replace function public.record_license_check(
  p_customer_id uuid,
  p_check_type text,
  p_result text,
  p_reason text,
  p_domain text default null,
  p_installation_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.license_checks (
    customer_id, domain, installation_id, check_type, result, reason
  )
  values (
    p_customer_id, p_domain, p_installation_id, p_check_type, p_result, p_reason
  )
  returning id into v_id;

  if exists (
    select 1 from pg_proc where proname = 'record_customer_timeline_event'
  ) then
    perform public.record_customer_timeline_event(
      p_customer_id,
      'system',
      case
        when p_result = 'blocked' then 'License check blocked'
        when p_result = 'warning' then 'License check warning'
        else 'License check passed'
      end,
      p_reason,
      jsonb_build_object(
        'check_type', p_check_type,
        'result', p_result,
        'domain', p_domain,
        'installation_id', p_installation_id
      ),
      now()
    );
  end if;

  return v_id;
end;
$$;

grant execute on function public.record_license_check(uuid, text, text, text, text, uuid)
  to authenticated;

create or replace function public.get_customer_license_limits(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_sub record;
  v_used_domains integer;
  v_used_installations integer;
  v_used_users integer;
begin
  select
    s.id,
    s.status,
    s.plan_key,
    s.plan_name,
    s.plan_type,
    s.max_users,
    s.max_installations,
    s.max_domains,
    p.allowed_modules,
    p.features
  into v_sub
  from public.subscriptions s
  left join public.plans p on p.id = s.plan_id
  where s.customer_id = p_customer_id;

  if v_sub.id is null then
    return jsonb_build_object('has_subscription', false);
  end if;

  select count(*) into v_used_domains
  from public.customer_domains cd
  where cd.customer_id = p_customer_id
    and cd.status in ('active', 'pending');

  select count(*) into v_used_installations
  from public.installations i
  join public.customers c on c.company_id = i.company_id
  where c.id = p_customer_id
    and i.status in ('pending', 'active');

  select count(*) into v_used_users
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where c.id = p_customer_id
    and u.status = 'active';

  return jsonb_build_object(
    'has_subscription', true,
    'subscription_status', v_sub.status,
    'plan_key', coalesce(v_sub.plan_key, v_sub.plan_type),
    'plan_name', coalesce(v_sub.plan_name, initcap(v_sub.plan_type::text)),
    'max_users', v_sub.max_users,
    'max_installations', v_sub.max_installations,
    'max_domains', v_sub.max_domains,
    'used_users', v_used_users,
    'used_installations', v_used_installations,
    'used_domains', v_used_domains,
    'allowed_modules', coalesce(v_sub.allowed_modules, '[]'::jsonb),
    'features', coalesce(v_sub.features, '[]'::jsonb),
    'subscription_active', v_sub.status in ('trialing', 'active')
  );
end;
$$;

grant execute on function public.get_customer_license_limits(uuid) to authenticated;

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
  v_max_inst integer;
  v_max_dom integer;
  v_used_inst integer;
  v_used_dom integer;
  v_domain text;
begin
  v_limits := public.get_customer_license_limits(p_customer_id);

  if coalesce((v_limits ->> 'has_subscription')::boolean, false) = false then
    perform public.record_license_check(
      p_customer_id, 'subscription_status', 'blocked',
      'No active subscription found.', p_domain, null
    );
    raise exception 'No active subscription';
  end if;

  v_status := v_limits ->> 'subscription_status';
  if v_status not in ('trialing', 'active') then
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
        and cd.status in ('active', 'pending')
    ) then
      return;
    end if;

    if v_max_dom is not null and v_used_dom >= v_max_dom then
      perform public.record_license_check(
        p_customer_id, 'domain_limit', 'blocked',
        format('Domain limit reached (%s of %s).', v_used_dom, v_max_dom),
        v_domain, null
      );
      raise exception 'Domain limit reached. Upgrade your plan to add more websites.';
    end if;
  end if;
end;
$$;

grant execute on function public.assert_license_capacity(uuid, boolean, boolean, text)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Domain management
-- ---------------------------------------------------------------------------
create or replace function public.add_customer_domain(p_domain text)
returns public.customer_domains
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_domain text;
  v_row public.customer_domains;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer record not found';
  end if;

  v_domain := public.normalize_domain(p_domain);
  if v_domain is null then
    raise exception 'Invalid domain';
  end if;

  perform public.assert_license_capacity(v_customer_id, false, true, v_domain);

  insert into public.customer_domains (
    customer_id, domain, status, verification_status, verification_method
  )
  values (v_customer_id, v_domain, 'pending', 'pending', 'placeholder')
  on conflict (customer_id, domain) do update set
    status = case
      when public.customer_domains.status = 'removed' then 'pending'
      else public.customer_domains.status
    end,
    verification_status = case
      when public.customer_domains.verification_status = 'failed' then 'pending'
      else public.customer_domains.verification_status
    end,
    updated_at = now()
  returning * into v_row;

  perform public.record_license_check(
    v_customer_id, 'domain_limit', 'allowed',
    'Domain added and pending verification.', v_domain, null
  );

  return v_row;
end;
$$;

grant execute on function public.add_customer_domain(text) to authenticated;

create or replace function public.get_customer_domains_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  select c.id into v_customer_id
  from public.customers c where c.company_id = v_company_id limit 1;

  if v_customer_id is null then
    return jsonb_build_object(
      'license', jsonb_build_object('has_subscription', false),
      'domains', '[]'::jsonb
    );
  end if;

  return jsonb_build_object(
    'license', public.get_customer_license_limits(v_customer_id),
    'domains', coalesce(
      (
        select jsonb_agg(row_to_json(cd.*) order by cd.added_at desc)
        from public.customer_domains cd
        where cd.customer_id = v_customer_id
          and cd.status <> 'removed'
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_domains_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- Enforce limits on installation create / activate
-- ---------------------------------------------------------------------------
create or replace function public.create_installation(
  p_system_type text,
  p_name text default null,
  p_site_url text default null
)
returns table (installation_id uuid, installation_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
  v_user_role text;
  v_token text;
  v_token_hash text;
  v_installation_id uuid;
  v_domain text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select u.company_id, u.role
  into v_company_id, v_user_role
  from public.users u
  where u.auth_user_id = auth.uid();

  if v_company_id is null then
    raise exception 'No company profile found';
  end if;

  if v_user_role not in ('owner', 'admin') then
    raise exception 'Insufficient permissions';
  end if;

  if p_system_type not in ('wordpress', 'shopify', 'custom', 'other') then
    raise exception 'Invalid system type';
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_id is not null then
    v_domain := public.normalize_domain(p_site_url);
    perform public.assert_license_capacity(
      v_customer_id,
      true,
      v_domain is not null,
      v_domain
    );
  end if;

  v_token := public.generate_installation_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.installations (
    company_id, system_type, status, installation_token_hash, name, site_url
  )
  values (
    v_company_id, p_system_type, 'pending', v_token_hash,
    nullif(trim(p_name), ''), nullif(trim(p_site_url), '')
  )
  returning id into v_installation_id;

  if v_customer_id is not null and v_domain is not null then
    insert into public.customer_domains (
      customer_id, installation_id, domain, status, verification_status, verification_method
    )
    values (v_customer_id, v_installation_id, v_domain, 'pending', 'pending', 'install_token')
    on conflict (customer_id, domain) do update set
      installation_id = excluded.installation_id,
      updated_at = now();

    perform public.record_license_check(
      v_customer_id, 'installation_limit', 'allowed',
      'Installation created and pending domain verification.',
      v_domain, v_installation_id
    );
  elsif v_customer_id is not null then
    perform public.record_license_check(
      v_customer_id, 'installation_limit', 'allowed',
      'Installation created without domain.',
      null, v_installation_id
    );
  end if;

  return query select v_installation_id, v_token;
end;
$$;

create or replace function public.activate_installation(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation record;
  v_customer_id uuid;
  v_domain text;
  v_verification text;
  v_updated int;
begin
  v_hash := public.hash_installation_token(p_token);

  select i.id, i.company_id, i.site_url, i.status
  into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.status in ('pending', 'active')
  limit 1;

  if v_installation.id is null then
    return false;
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_installation.company_id
  limit 1;

  if v_customer_id is not null then
    perform public.assert_license_capacity(v_customer_id, false, false, null);

    v_domain := public.normalize_domain(v_installation.site_url);
    if v_domain is not null then
      select cd.verification_status into v_verification
      from public.customer_domains cd
      where cd.customer_id = v_customer_id
        and cd.domain = v_domain
        and cd.status in ('active', 'pending')
      limit 1;

      if v_verification is distinct from 'verified' then
        perform public.record_license_check(
          v_customer_id, 'domain_verification', 'blocked',
          'Domain must be verified before activation.',
          v_domain, v_installation.id
        );
        return false;
      end if;
    end if;
  end if;

  update public.installations
  set
    status = 'active',
    installed_at = coalesce(installed_at, now()),
    updated_at = now()
  where id = v_installation.id
    and status in ('pending', 'active');

  get diagnostics v_updated = row_count;

  if v_updated > 0 and v_customer_id is not null then
    perform public.record_license_check(
      v_customer_id, 'domain_lock', 'allowed',
      'Installation activated on authorized domain.',
      v_domain, v_installation.id
    );
  end if;

  return v_updated > 0;
end;
$$;

-- ---------------------------------------------------------------------------
-- Payment webhook placeholder + plan upgrade
-- ---------------------------------------------------------------------------
create or replace function public.handle_payment_webhook_event(
  p_provider text,
  p_event_type text,
  p_payload jsonb default '{}'::jsonb,
  p_customer_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := p_customer_id;
  v_subscription public.subscriptions;
  v_plan public.plans;
  v_event_id uuid;
begin
  if v_customer_id is null and p_payload ? 'customer_id' then
    v_customer_id := (p_payload ->> 'customer_id')::uuid;
  end if;

  insert into public.payment_events (
    customer_id, provider, event_type, provider_event_id, status, raw_payload
  )
  values (
    v_customer_id,
    p_provider,
    p_event_type,
    coalesce(p_payload ->> 'provider_event_id', gen_random_uuid()::text),
    'received',
    p_payload
  )
  returning id into v_event_id;

  if v_customer_id is null then
    return jsonb_build_object('processed', false, 'event_id', v_event_id);
  end if;

  if p_event_type in ('payment_succeeded', 'plan_upgraded', 'subscription_updated') then
    if p_payload ? 'plan_key' then
      select * into v_plan from public.plans where plan_key = p_payload ->> 'plan_key';
      if v_plan.id is not null then
        update public.subscriptions s
        set
          plan_id = v_plan.id,
          plan_key = v_plan.plan_key,
          plan_name = v_plan.name,
          plan_type = v_plan.plan_key,
          max_users = v_plan.max_users,
          max_installations = v_plan.max_installations,
          max_domains = v_plan.max_domains,
          status = 'active',
          current_period_start = now(),
          current_period_end = now() + interval '1 month',
          next_billing_date = (now() + interval '1 month')::date,
          updated_at = now()
        where s.customer_id = v_customer_id
        returning * into v_subscription;

        if exists (select 1 from pg_proc where proname = 'record_customer_timeline_event') then
          perform public.record_customer_timeline_event(
            v_customer_id, 'subscription', 'Plan upgraded',
            'Subscription upgraded to ' || v_plan.name || '.',
            jsonb_build_object('plan_key', v_plan.plan_key, 'event', p_event_type),
            now()
          );
        end if;

        perform public.record_license_check(
          v_customer_id, 'subscription_status', 'allowed',
          'Plan limits recalculated after ' || p_event_type || '.',
          null, null
        );
      end if;
    else
      update public.subscriptions
      set status = 'active', updated_at = now()
      where customer_id = v_customer_id and status in ('trialing', 'past_due');
    end if;
  elsif p_event_type in ('payment_failed', 'subscription_cancelled', 'trial_ended') then
    update public.subscriptions
    set
      status = case
        when p_event_type = 'subscription_cancelled' then 'cancelled'
        else 'past_due'
      end,
      cancelled_at = case when p_event_type = 'subscription_cancelled' then now() else cancelled_at end,
      updated_at = now()
    where customer_id = v_customer_id;

    perform public.record_license_check(
      v_customer_id, 'payment_status', 'blocked',
      'Subscription affected by ' || p_event_type || '.',
      null, null
    );
  end if;

  return jsonb_build_object(
    'processed', true,
    'event_id', v_event_id,
    'customer_id', v_customer_id
  );
end;
$$;

grant execute on function public.handle_payment_webhook_event(text, text, jsonb, uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Extend platform master detail with license + domains
-- ---------------------------------------------------------------------------
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
      select row_to_json(pp.*) from public.payment_profiles pp where pp.customer_id = c.id
    ),
    'subscription', (
      select row_to_json(s.*) from public.subscriptions s where s.customer_id = c.id
    ),
    'license', public.get_customer_license_limits(p_customer_id),
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
    'domains', coalesce(
      (select jsonb_agg(row_to_json(cd.*) order by cd.added_at desc)
       from public.customer_domains cd
       where cd.customer_id = p_customer_id and cd.status <> 'removed'),
      '[]'::jsonb
    ),
    'license_checks', coalesce(
      (select jsonb_agg(row_to_json(lc.*) order by lc.created_at desc)
       from public.license_checks lc
       where lc.customer_id = p_customer_id
       limit 25),
      '[]'::jsonb
    ),
    'users', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', u.id, 'full_name', u.full_name, 'email', au.email,
            'role', u.role, 'status', u.status, 'last_login_at', u.last_login_at,
            'is_owner', u.role = 'owner', 'permissions', '[]'::jsonb
          ) order by u.created_at asc
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
            'id', i.id, 'name', i.name, 'site_url', i.site_url,
            'system_type', i.system_type, 'status', i.status,
            'last_synced_at', i.last_synced_at, 'installed_at', i.installed_at,
            'created_at', i.created_at,
            'version', coalesce(i.metadata ->> 'version', '1.0.0'),
            'modules', coalesce(
              (select jsonb_agg(im.module_key order by im.module_key)
               from public.installation_modules im
               where im.installation_id = i.id and im.enabled = true),
              '[]'::jsonb
            ),
            'integrations', coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'integration_key', ii.integration_key,
                    'status', ii.status,
                    'last_synced_at', ii.last_synced_at
                  ) order by ii.integration_key
                )
                from public.installation_integrations ii
                where ii.installation_id = i.id
              ),
              '[]'::jsonb
            )
          ) order by i.created_at desc
        )
        from public.installations i
        where i.company_id = c.company_id
      ),
      '[]'::jsonb
    ),
    'invoices', coalesce(
      (select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
       from public.invoices inv where inv.customer_id = c.id),
      '[]'::jsonb
    ),
    'usage', (select row_to_json(us.*) from public.usage_statistics us where us.customer_id = c.id),
    'support', coalesce(
      (select jsonb_agg(row_to_json(sc.*) order by sc.opened_at desc)
       from public.support_cases sc where sc.customer_id = c.id limit 50),
      '[]'::jsonb
    ),
    'activity_log', coalesce(
      (select jsonb_agg(row_to_json(al.*) order by al.created_at desc)
       from public.activity_logs al where al.customer_id = c.id limit 100),
      '[]'::jsonb
    ),
    'team_invitations', coalesce(
      (select jsonb_agg(row_to_json(ti.*) order by ti.created_at desc)
       from public.team_invitations ti where ti.customer_id = c.id),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (select jsonb_agg(row_to_json(cr.*) order by cr.created_at desc)
       from public.customer_recommendations cr
       where cr.customer_id = c.id and cr.status = 'active'),
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

  select u.company_id into v_company_id
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_company_id is null then
    return null;
  end if;

  select c.id into v_customer_id
  from public.customers c where c.company_id = v_company_id limit 1;

  if v_customer_id is null then
    return jsonb_build_object(
      'subscription', null,
      'payment_profile', null,
      'invoices', '[]'::jsonb,
      'license', jsonb_build_object('has_subscription', false)
    );
  end if;

  select jsonb_build_object(
    'subscription', (select row_to_json(s.*) from public.subscriptions s where s.customer_id = v_customer_id),
    'payment_profile', (select row_to_json(pp.*) from public.payment_profiles pp where pp.customer_id = v_customer_id),
    'invoices', coalesce(
      (select jsonb_agg(row_to_json(inv.*) order by inv.created_at desc)
       from public.invoices inv where inv.customer_id = v_customer_id),
      '[]'::jsonb
    ),
    'license', public.get_customer_license_limits(v_customer_id)
  )
  into v_result;

  return v_result;
end;
$$;

-- ---------------------------------------------------------------------------
-- Seed pilot domains from installations
-- ---------------------------------------------------------------------------
do $$
declare
  v_customer_id uuid;
begin
  select id into v_customer_id from public.customers where customer_number = 'AIP-000001' limit 1;
  if v_customer_id is null then return; end if;

  insert into public.customer_domains (
    customer_id, installation_id, domain, status, verification_status,
    verification_method, verified_at
  )
  select
    v_customer_id,
    i.id,
    public.normalize_domain(i.site_url),
    'active',
    'verified',
    'pilot_seed',
    now() - interval '14 days'
  from public.installations i
  join public.customers c on c.company_id = i.company_id
  where c.id = v_customer_id
    and i.site_url is not null
    and public.normalize_domain(i.site_url) is not null
  on conflict (customer_id, domain) do update set
    installation_id = excluded.installation_id,
    status = 'active',
    verification_status = 'verified',
    verified_at = coalesce(public.customer_domains.verified_at, excluded.verified_at),
    updated_at = now();

  update public.subscriptions s
  set
    plan_id = p.id,
    plan_key = p.plan_key,
    max_domains = p.max_domains,
    max_installations = p.max_installations,
    max_users = p.max_users
  from public.plans p
  where s.customer_id = v_customer_id
    and p.plan_key = coalesce(s.plan_key, s.plan_type, 'growth');
end;
$$;

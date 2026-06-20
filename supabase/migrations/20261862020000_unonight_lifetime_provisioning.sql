-- Phase 620 P1 — Unonight lifetime customer provisioning (data repair only).
-- Extends canonical subscription schema with lifetime; updates authoritative Unonight org only.

-- ---------------------------------------------------------------------------
-- 1. Canonical lifetime support in subscription schema
-- ---------------------------------------------------------------------------
alter table public.organization_subscriptions
  drop constraint if exists organization_subscriptions_plan_key_check;
alter table public.organization_subscriptions
  add constraint organization_subscriptions_plan_key_check check (
    plan_key in ('starter', 'business', 'professional', 'enterprise', 'internal', 'lifetime')
  );

alter table public.organization_subscriptions
  drop constraint if exists organization_subscriptions_billing_cycle_check;
alter table public.organization_subscriptions
  add constraint organization_subscriptions_billing_cycle_check check (
    billing_cycle in ('monthly', 'yearly', 'lifetime')
  );

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_type_check;
alter table public.subscriptions
  add constraint subscriptions_plan_type_check check (
    plan_type in ('starter', 'growth', 'business', 'enterprise', 'lifetime')
  );

alter table public.subscriptions
  drop constraint if exists subscriptions_billing_cycle_check;
alter table public.subscriptions
  add constraint subscriptions_billing_cycle_check check (
    billing_cycle in ('monthly', 'yearly', 'lifetime')
  );

alter table public.plans
  drop constraint if exists plans_plan_key_check;
alter table public.plans
  add constraint plans_plan_key_check check (
    plan_key in ('starter', 'growth', 'business', 'enterprise', 'lifetime')
  );

alter table public.plans
  drop constraint if exists plans_billing_cycle_check;
alter table public.plans
  add constraint plans_billing_cycle_check check (
    billing_cycle in ('monthly', 'yearly', 'lifetime')
  );

alter table public.plan_modules
  drop constraint if exists plan_modules_plan_key_check;
alter table public.plan_modules
  add constraint plan_modules_plan_key_check check (
    plan_key in ('starter', 'business', 'professional', 'enterprise', 'internal', 'lifetime')
  );

insert into public.plans (
  plan_key,
  name,
  description,
  price_amount,
  currency,
  billing_cycle,
  max_users,
  max_installations,
  max_domains,
  features,
  allowed_modules,
  is_active
)
select
  'lifetime',
  'Lifetime',
  'Non-expiring lifetime APP subscription — standard customer architecture.',
  0,
  currency,
  'lifetime',
  max_users,
  max_installations,
  max_domains,
  features,
  allowed_modules,
  true
from public.plans
where plan_key = 'enterprise'
on conflict (plan_key) do update set
  name = excluded.name,
  description = excluded.description,
  billing_cycle = excluded.billing_cycle,
  max_users = excluded.max_users,
  max_installations = excluded.max_installations,
  max_domains = excluded.max_domains,
  features = excluded.features,
  allowed_modules = excluded.allowed_modules,
  is_active = true,
  updated_at = now();

insert into public.plan_modules (plan_key, module_key, enabled)
select 'lifetime', pm.module_key, pm.enabled
from public.plan_modules pm
where pm.plan_key = 'enterprise'
on conflict (plan_key, module_key) do update set
  enabled = excluded.enabled;

create or replace function public._ls510_plan_default_capacity(p_plan_key text)
returns integer language plpgsql stable as $$
begin
  case coalesce(p_plan_key, 'starter')
    when 'enterprise' then return null;
    when 'lifetime' then return null;
    when 'internal' then return null;
    when 'business' then return 25;
    when 'professional' then return 25;
    when 'starter' then return 5;
    else return 5;
  end case;
end; $$;

create or replace function public._ls510_sync_from_subscription(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_plan text := 'starter';
  v_status text := 'trial';
  v_expires date;
  v_included int;
  v_app_status text;
  v_service text;
begin
  perform public._ls510_ensure_state(p_org_id);

  select s.plan_key, s.status, s.expires_at::date
  into v_plan, v_status, v_expires
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    v_service := public.resolve_license_service_status(p_org_id);
  end if;

  v_app_status := case
    when v_status = 'cancelled' or v_status = 'expired' then 'cancelled'
    when v_service = 'paused' or v_status = 'past_due' and v_service is null then 'suspended'
    when v_service = 'grace_period' then 'grace_period'
    when v_status = 'trial' then 'trial'
    when v_status in ('active', 'internal') then 'active'
    else 'active'
  end;

  v_included := public._ls510_plan_default_capacity(v_plan);

  update public.organization_app_license_state set
    app_license_status = v_app_status,
    license_type = case when v_plan in ('enterprise', 'lifetime') then 'enterprise' else 'app' end,
    renewal_date = case when v_plan = 'lifetime' then null else coalesce(v_expires, renewal_date) end,
    updated_at = now()
  where organization_id = p_org_id;

  if v_included is not null then
    update public.organization_user_capacity_pool set
      included_capacity = greatest(included_capacity, v_included),
      updated_at = now()
    where organization_id = p_org_id;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 2. Unonight lifetime provisioning (guarded — single authoritative org)
-- ---------------------------------------------------------------------------
create or replace function public.provision_unonight_lifetime_subscription()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid := '32d748eb-9a66-4174-a416-18a813610d3e';
  v_company_id uuid := '7126b75f-0cd9-4727-ab89-e7970df9a163';
  v_org_sub_id uuid;
  v_sub_id uuid;
  v_lifetime_plan_id uuid;
  v_pack_count int;
  v_ent_count int;
  v_membership record;
begin
  if not exists (
    select 1
    from public.customers c
    join public.companies co on co.id = c.company_id
    where c.id = v_org_id
      and co.id = v_company_id
      and co.slug = 'unonight'
      and co.is_platform = false
  ) then
    return jsonb_build_object('ok', false, 'reason', 'unonight_guard_failed');
  end if;

  if (
    select count(*)
    from public.customers c
    join public.companies co on co.id = c.company_id
    where co.slug = 'unonight'
      and co.is_platform = false
  ) > 1 then
    return jsonb_build_object('ok', false, 'reason', 'duplicate_unonight_customer');
  end if;

  select id into v_lifetime_plan_id
  from public.plans
  where plan_key = 'lifetime'
  limit 1;

  select os.id into v_org_sub_id
  from public.organization_subscriptions os
  where os.organization_id = v_org_id
  limit 1;

  if v_org_sub_id is null then
    return jsonb_build_object('ok', false, 'reason', 'organization_subscription_missing');
  end if;

  update public.organization_subscriptions set
    plan_key = 'lifetime',
    status = 'active',
    billing_cycle = 'lifetime',
    expires_at = null,
    trial_ends_at = null,
    updated_at = now()
  where id = v_org_sub_id
    and organization_id = v_org_id;

  select s.id into v_sub_id
  from public.subscriptions s
  where s.customer_id = v_org_id
  limit 1;

  if v_sub_id is null then
    return jsonb_build_object('ok', false, 'reason', 'subscription_missing');
  end if;

  update public.subscriptions set
    plan_name = 'Unonight Lifetime',
    plan_type = 'lifetime',
    plan_key = 'lifetime',
    plan_id = v_lifetime_plan_id,
    status = 'active',
    billing_cycle = 'lifetime',
    next_billing_date = null,
    current_period_end = null,
    cancelled_at = null,
    payment_overdue_since = null,
    service_paused_at = null,
    grace_period_ends_at = null,
    license_service_status = 'active',
    provider = coalesce(provider, 'manual'),
    updated_at = now()
  where id = v_sub_id
    and customer_id = v_org_id;

  update public.organization_app_license_state set
    app_license_status = 'active',
    license_type = 'enterprise',
    renewal_date = null,
    grace_period_ends_at = null,
    suspended_at = null,
    cancelled_at = null,
    updated_at = now()
  where organization_id = v_org_id;

  if exists (select 1 from pg_proc where proname = '_ls510_sync_from_subscription') then
    perform public._ls510_sync_from_subscription(v_org_id);
  end if;

  if exists (select 1 from pg_proc where proname = 'sync_app_organization_access') then
    perform public.sync_app_organization_access(v_org_id);
  end if;

  select ou.role, ou.status
  into v_membership
  from public.organization_users ou
  join public.users u on u.id = ou.user_id
  where ou.organization_id = v_org_id
    and u.id = '0f1ea9dd-09c4-48af-b890-834fa87c6e06'
    and ou.status = 'active'
  limit 1;

  select count(*) into v_pack_count
  from public.organization_business_packs
  where organization_id = v_org_id;

  select count(*) into v_ent_count
  from public.marketplace_entitlements
  where tenant_id = v_org_id;

  return jsonb_build_object(
    'ok', true,
    'organization_id', v_org_id,
    'organization_subscription_id', v_org_sub_id,
    'subscription_id', v_sub_id,
    'lifetime_plan_id', v_lifetime_plan_id,
    'owner_membership', v_membership,
    'business_packs', v_pack_count,
    'entitlements', v_ent_count
  );
end;
$$;

revoke all on function public.provision_unonight_lifetime_subscription() from public, anon, authenticated;

select public.provision_unonight_lifetime_subscription();

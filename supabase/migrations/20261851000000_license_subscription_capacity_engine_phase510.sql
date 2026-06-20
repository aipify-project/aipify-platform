-- Phase 510 — License, Subscription & Capacity Engine
-- Business Packs provide functionality. Licenses provide scale.
-- Extends: License Center (20), Domain License (505A), App Store (502), Employee Management (503)

-- ---------------------------------------------------------------------------
-- 1. APP license state & user capacity pool
-- ---------------------------------------------------------------------------
create table if not exists public.organization_app_license_state (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  license_type text not null default 'app' check (
    license_type in ('app', 'enterprise')
  ),
  app_license_status text not null default 'active' check (
    app_license_status in ('active', 'trial', 'grace_period', 'suspended', 'cancelled')
  ),
  renewal_date date,
  grace_period_ends_at timestamptz,
  suspended_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.organization_app_license_state enable row level security;
revoke all on public.organization_app_license_state from authenticated, anon;

create table if not exists public.organization_user_capacity_pool (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  included_capacity integer not null default 5,
  purchased_capacity integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.organization_user_capacity_pool enable row level security;
revoke all on public.organization_user_capacity_pool from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.organization_license_subscription_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  license_type text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  pack_key text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists org_license_sub_audit_org_idx
  on public.organization_license_subscription_audit_logs (organization_id, created_at desc);

alter table public.organization_license_subscription_audit_logs enable row level security;
revoke all on public.organization_license_subscription_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ls510_log(
  p_org_id uuid, p_action text, p_summary text,
  p_license_type text default null, p_domain_id uuid default null, p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_license_subscription_audit_logs (
    organization_id, actor_user_id, action, license_type, domain_id, pack_key, summary, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_license_type, p_domain_id, p_pack_key, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ls510_plan_default_capacity(p_plan_key text)
returns integer language plpgsql stable as $$
begin
  case coalesce(p_plan_key, 'starter')
    when 'enterprise' then return null;
    when 'internal' then return null;
    when 'business' then return 25;
    when 'professional' then return 25;
    when 'starter' then return 5;
    else return 5;
  end case;
end; $$;

create or replace function public._ls510_ensure_state(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_app_license_state (organization_id)
  values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_user_capacity_pool (organization_id)
  values (p_org_id)
  on conflict (organization_id) do nothing;

  perform public._dl505_ensure_license_pool(p_org_id);
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
    license_type = case when v_plan = 'enterprise' then 'enterprise' else 'app' end,
    renewal_date = coalesce(v_expires, renewal_date),
    updated_at = now()
  where organization_id = p_org_id;

  if v_included is not null then
    update public.organization_user_capacity_pool set
      included_capacity = greatest(included_capacity, v_included),
      updated_at = now()
    where organization_id = p_org_id;
  end if;
end; $$;

create or replace function public._ls510_capacity_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_included int;
  v_purchased int;
  v_capacity int;
  v_active int;
  v_pending int;
  v_used int;
  v_available int;
  v_status text;
begin
  select included_capacity, purchased_capacity
  into v_included, v_purchased
  from public.organization_user_capacity_pool
  where organization_id = p_org_id;

  v_capacity := case
    when v_included is null and v_purchased = 0 then null
    else coalesce(v_included, 0) + coalesce(v_purchased, 0)
  end;

  select count(*) into v_active
  from public.organization_employee_profiles p
  where p.organization_id = p_org_id and p.employee_status = 'active';

  select count(*) into v_pending
  from public.organization_employee_invitations i
  where i.organization_id = p_org_id and i.status = 'pending';

  v_used := v_active + v_pending;
  v_available := case
    when v_capacity is null or v_included is null and v_purchased = 0 then null
    else greatest(0, v_capacity - v_used)
  end;

  v_status := case
    when v_capacity is null then 'unlimited'
    when v_used >= v_capacity then 'upgrade_required'
    when v_used >= v_capacity * 0.9 then 'near_capacity'
    else 'full'
  end;

  return jsonb_build_object(
    'included_capacity', v_included,
    'purchased_capacity', v_purchased,
    'total_capacity', v_capacity,
    'active_employees', v_active,
    'pending_invitations', v_pending,
    'used', v_used,
    'available', v_available,
    'capacity_status', v_status,
    'principle', 'Employees are capacity. Business Packs provide functionality — not artificial feature limits.'
  );
end; $$;

create or replace function public._ls510_app_license_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_row public.organization_app_license_state;
  v_plan text;
  v_sub_status text;
  v_renewal date;
  v_license_status text;
  v_app_status text;
begin
  select * into v_row from public.organization_app_license_state where organization_id = p_org_id;

  select s.plan_key, s.status, s.expires_at::date
  into v_plan, v_sub_status, v_renewal
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  if v_plan is null then
    select coalesce(s.plan_key, s.plan_type, 'business'), s.status, s.next_billing_date::date
    into v_plan, v_sub_status, v_renewal
    from public.subscriptions s
    where s.customer_id = p_org_id
    order by s.created_at desc
    limit 1;
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    v_license_status := public.resolve_license_service_status(p_org_id);
  else
    v_license_status := coalesce(v_row.app_license_status, 'active');
  end if;

  v_app_status := coalesce(
    v_row.app_license_status,
    case
      when v_license_status = 'paused' then 'suspended'
      when v_license_status = 'grace_period' then 'grace_period'
      when v_sub_status = 'trial' then 'trial'
      when v_sub_status in ('active', 'trialing', 'internal') then 'active'
      when v_sub_status in ('cancelled', 'expired') then 'cancelled'
      else 'active'
    end
  );

  return jsonb_build_object(
    'license_type', coalesce(v_row.license_type, case when v_plan = 'enterprise' then 'enterprise' else 'app' end),
    'status', v_app_status,
    'renewal_date', coalesce(v_row.renewal_date, v_renewal),
    'plan_key', coalesce(v_plan, 'business'),
    'includes', jsonb_build_array(
      'APP Organization', 'Companion', 'Core Modules', 'Settings', 'Billing',
      'License Management', 'Business Pack Marketplace', 'Domain Management'
    ),
    'access_blocked', v_app_status in ('suspended', 'cancelled'),
    'allowed_when_suspended', jsonb_build_array('billing', 'invoices', 'support', 'renewal', 'licenses')
  );
end; $$;

create or replace function public.assert_organization_employee_capacity(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_summary jsonb;
begin
  v_summary := public._ls510_capacity_summary(p_org_id);

  if (v_summary->>'total_capacity') is not null
     and (v_summary->>'available') is not null
     and (v_summary->>'available')::int <= 0 then
    perform public._ls510_log(p_org_id, 'capacity_blocked', 'Employee capacity exceeded — upgrade required',
      'user_capacity', null, null, v_summary);
    raise exception 'Employee capacity reached. Purchase additional User Capacity License to add employees.';
  end if;
end; $$;

-- Override seat summary — capacity from licenses, not Business Pack tiers
create or replace function public._emae503_seat_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_cap jsonb;
begin
  v_cap := public._ls510_capacity_summary(p_org_id);
  return jsonb_build_object(
    'total_seats', v_cap->'total_capacity',
    'active_employees', v_cap->'active_employees',
    'available_seats', coalesce(v_cap->'available', '999999'::jsonb),
    'pending_invitations', v_cap->'pending_invitations',
    'used_seats', v_cap->'used',
    'capacity_status', v_cap->'capacity_status',
    'included_capacity', v_cap->'included_capacity',
    'purchased_capacity', v_cap->'purchased_capacity'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. License Subscription Center
-- ---------------------------------------------------------------------------
create or replace function public.get_license_subscription_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_domains jsonb;
  v_packs jsonb;
  v_domain_packs jsonb;
  v_invoices jsonb;
  v_audit jsonb;
  v_sub jsonb := '{}'::jsonb;
  v_limits jsonb := '{}'::jsonb;
  v_pack_count int;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  if not public.has_organization_permission('license_center.view')
     and not public.has_organization_permission('license_center.manage') then
    raise exception 'Permission denied: license_center.view';
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    v_sub := coalesce(public.get_customer_license_center()->'subscription', '{}'::jsonb);
  end if;

  if exists (select 1 from pg_proc where proname = 'get_customer_license_limits') then
    v_limits := coalesce(public.get_customer_license_limits(v_org_id), '{}'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'domain', d.domain, 'display_name', coalesce(d.display_name, d.domain),
    'domain_status', d.domain_status, 'license_status', d.license_status, 'is_primary', d.is_primary
  ) order by d.is_primary desc, d.domain), '[]'::jsonb)
  into v_domains
  from public.organization_domains d
  where d.organization_id = v_org_id and d.domain_status in ('pending', 'active');

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', s.pack_key,
    'tier_key', s.tier_key,
    'license_status', s.license_status,
    'renewal_date', s.renewal_date,
    'capacity_limit', s.capacity_limit,
    'card', case when exists (select 1 from pg_proc where proname = '_as502_pack_card')
      then public._as502_pack_card(v_org_id, s.pack_key) else '{}'::jsonb end
  )), '[]'::jsonb)
  into v_packs
  from public.business_pack_license_tenant_state s
  where s.tenant_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'domain_id', i.domain_id, 'domain', d.domain, 'pack_key', i.pack_key,
    'license_status', i.license_status, 'installed_at', i.installed_at
  ) order by i.installed_at desc), '[]'::jsonb)
  into v_domain_packs
  from public.domain_business_pack_installations i
  join public.organization_domains d on d.id = i.domain_id
  where i.organization_id = v_org_id and i.license_status = 'active';

  select count(distinct pack_key) into v_pack_count
  from (
    select pack_key from public.business_pack_license_tenant_state where tenant_id = v_org_id and license_status in ('active', 'trial')
    union
    select pack_key from public.domain_business_pack_installations where organization_id = v_org_id and license_status = 'active'
  ) t;

  begin
    select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
    into v_invoices
    from (
      select inv.id, inv.status, inv.due_date, inv.amount
      from public.invoices inv
      where inv.customer_id = v_org_id
      order by inv.due_date desc nulls last
      limit 5
    ) t;
  exception when undefined_table then
    v_invoices := '[]'::jsonb;
  end;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'license_type', a.license_type,
    'pack_key', a.pack_key, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.organization_license_subscription_audit_logs
    where organization_id = v_org_id
    order by created_at desc limit 10
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Business Packs provide functionality. Licenses provide scale. Domains define deployment. Employees consume capacity.',
    'structure', 'PLATFORM → APP → LICENSES → DOMAINS → BUSINESS PACKS → EMPLOYEES',
    'app_license', public._ls510_app_license_summary(v_org_id),
    'domain_licenses', public._dl505_license_summary(v_org_id),
    'domains', v_domains,
    'capacity', public._ls510_capacity_summary(v_org_id),
    'business_packs', v_packs,
    'domain_pack_installations', v_domain_packs,
    'subscription', v_sub || jsonb_build_object('limits', v_limits),
    'overview', jsonb_build_object(
      'domains_used', (public._dl505_license_summary(v_org_id)->>'used')::int,
      'domains_purchased', (public._dl505_license_summary(v_org_id)->>'purchased')::int,
      'employees_active', (public._ls510_capacity_summary(v_org_id)->>'active_employees')::int,
      'employees_capacity', public._ls510_capacity_summary(v_org_id)->'total_capacity',
      'business_pack_count', v_pack_count,
      'renewal_date', public._ls510_app_license_summary(v_org_id)->>'renewal_date'
    ),
    'reports', jsonb_build_object(
      'license_usage', jsonb_build_object(
        'app_status', public._ls510_app_license_summary(v_org_id)->>'status',
        'domain_usage_pct', case
          when (public._dl505_license_summary(v_org_id)->>'purchased')::int > 0
          then round(100.0 * (public._dl505_license_summary(v_org_id)->>'used')::numeric
            / nullif((public._dl505_license_summary(v_org_id)->>'purchased')::numeric, 0), 1)
          else 0 end,
        'employee_capacity_pct', case
          when (public._ls510_capacity_summary(v_org_id)->>'total_capacity') is not null
            and (public._ls510_capacity_summary(v_org_id)->>'total_capacity')::int > 0
          then round(100.0 * (public._ls510_capacity_summary(v_org_id)->>'used')::numeric
            / (public._ls510_capacity_summary(v_org_id)->>'total_capacity')::numeric, 1)
          else null end,
        'business_pack_adoption', v_pack_count
      ),
      'renewal_forecast', jsonb_build_object(
        'app_renewal', public._ls510_app_license_summary(v_org_id)->>'renewal_date',
        'packs_renewing_30d', (
          select count(*) from public.business_pack_license_tenant_state
          where tenant_id = v_org_id and license_status = 'active'
            and renewal_date between current_date and current_date + 30
        )
      )
    ),
    'upgrade_center', jsonb_build_object(
      'purchase_capacity_route', '/app/store/capacity',
      'purchase_domain_route', '/app/store/additional_domain_license',
      'upgrade_subscription_route', '/app/settings/billing',
      'install_packs_route', '/app/store',
      'enterprise_route', '/app/support'
    ),
    'recent_invoices', v_invoices,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'billing', '/app/settings/billing',
      'trust_center', '/app/license',
      'domains', '/app/domains',
      'store', '/app/store',
      'employees', '/app/employees'
    ),
    'subscription_statuses', jsonb_build_array(
      jsonb_build_object('key', 'active', 'label', 'Active', 'access', 'full'),
      jsonb_build_object('key', 'trial', 'label', 'Trial', 'access', 'limited_time'),
      jsonb_build_object('key', 'grace_period', 'label', 'Grace Period', 'access', 'warning'),
      jsonb_build_object('key', 'suspended', 'label', 'Suspended', 'access', 'billing_only'),
      jsonb_build_object('key', 'cancelled', 'label', 'Cancelled', 'access', 'disabled')
    ),
    'commercial_principle', 'Small companies receive the same Business Packs and functionality. Larger organizations pay for scale — not hidden features.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_license_subscription_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_qty int;
  v_summary jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  perform public._ls510_ensure_state(v_org_id);

  if p_action_type = 'purchase_user_capacity' then
    v_qty := greatest(1, coalesce((p_payload->>'quantity')::int, 5));
    update public.organization_user_capacity_pool
    set purchased_capacity = purchased_capacity + v_qty, updated_at = now()
    where organization_id = v_org_id;

    perform public._ls510_log(v_org_id, 'capacity_purchased',
      format('User Capacity License purchased — %s additional seats', v_qty),
      'user_capacity', null, null, p_payload || jsonb_build_object('quantity', v_qty));

    v_summary := public._ls510_capacity_summary(v_org_id);
    return jsonb_build_object('ok', true, 'capacity', v_summary, 'message', 'Capacity upgraded');

  elsif p_action_type = 'purchase_domain_license' then
    return public.perform_domain_license_action('purchase_domain_license', p_payload);

  elsif p_action_type = 'sync_subscription' then
    perform public._ls510_sync_from_subscription(v_org_id);
    perform public._ls510_log(v_org_id, 'subscription_synced', 'Subscription state synchronized', 'app');
    return jsonb_build_object('ok', true, 'center', public.get_license_subscription_center());

  elsif p_action_type = 'upgrade_subscription' then
    perform public._ls510_log(v_org_id, 'upgrade_requested', 'Subscription upgrade requested', 'app', null, null, p_payload);
    return jsonb_build_object(
      'ok', true, 'redirect', '/app/settings/billing',
      'message', 'Continue in Billing to upgrade your subscription.'
    );

  elsif p_action_type = 'enterprise_inquiry' then
    perform public._ls510_log(v_org_id, 'enterprise_inquiry', 'Enterprise license inquiry', 'enterprise', null, null, p_payload);
    return jsonb_build_object('ok', true, 'redirect', '/app/support', 'message', 'Contact Aipify for Enterprise licensing.');

  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Companion context
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_license_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_cap jsonb; v_dom jsonb; v_packs jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_cap := public._ls510_capacity_summary(v_org_id);
  v_dom := public._dl505_license_summary(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', i.pack_key, 'domain', d.domain, 'status', i.license_status
  )), '[]'::jsonb)
  into v_packs
  from public.domain_business_pack_installations i
  join public.organization_domains d on d.id = i.domain_id
  where i.organization_id = v_org_id and i.license_status = 'active';

  if v_packs = '[]'::jsonb or v_packs is null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', s.pack_key, 'domain', null, 'status', s.license_status
    )), '[]'::jsonb)
    into v_packs
    from public.business_pack_license_tenant_state s
    where s.tenant_id = v_org_id and s.license_status in ('active', 'trial');
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands APP, Domain, Business Pack, and User Capacity licensing.',
    'app_license', public._ls510_app_license_summary(v_org_id),
    'domain_licenses', v_dom,
    'capacity', v_cap,
    'business_packs', coalesce(v_packs, '[]'::jsonb),
    'example_questions', jsonb_build_array(
      'How many licenses are available?',
      'Show my active domains.',
      'How many employees can we still add?',
      'Which Business Packs are installed?'
    ),
    'licenses_route', '/app/licenses',
    'can_add_employees', v_cap->'available' is null or coalesce((v_cap->>'available')::int, 1) > 0,
    'employees_remaining', v_cap->'available'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Patch employee invite/reactivate for capacity enforcement
-- ---------------------------------------------------------------------------
create or replace function public.perform_employee_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
  v_invitation_id uuid;
  v_user_id uuid;
  v_seats jsonb;
  v_setup_token text;
  v_app jsonb;
begin
  v_org_id := public._emae503_org();

  if p_action_type = 'invite_employee' then
    perform public._emae503_require_admin();
    v_app := public._ls510_app_license_summary(v_org_id);
    if coalesce((v_app->>'access_blocked')::boolean, false) then
      raise exception 'APP license suspended — resolve billing before adding employees';
    end if;
    perform public.assert_organization_employee_capacity(v_org_id);
    v_seats := public._emae503_seat_summary(v_org_id);
    if v_seats->'available_seats' is not null and (v_seats->>'available_seats')::int <= 0 then
      raise exception 'No available employee capacity — purchase User Capacity License in License Dashboard';
    end if;

    insert into public.organization_employee_profiles (
      organization_id, full_name, email, phone, department_id, job_title,
      manager_user_id, org_role, custom_role_id, employee_status, start_date, employee_number
    ) values (
      v_org_id,
      coalesce(p_payload->>'full_name', p_payload->>'name'),
      lower(trim(p_payload->>'email')),
      nullif(p_payload->>'phone', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'job_title', ''),
      nullif(p_payload->>'manager_user_id', '')::uuid,
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      nullif(p_payload->>'custom_role_id', '')::uuid,
      'pending_invitation',
      coalesce(nullif(p_payload->>'start_date', '')::date, current_date),
      nullif(p_payload->>'employee_number', '')
    )
    returning id into v_profile_id;

    v_setup_token := encode(gen_random_bytes(24), 'hex');

    insert into public.organization_employee_invitations (
      organization_id, employee_profile_id, email, full_name, org_role,
      department_id, custom_role_id, manager_user_id, welcome_message,
      setup_token_hash, invited_by_user_id
    ) values (
      v_org_id, v_profile_id,
      lower(trim(p_payload->>'email')),
      coalesce(p_payload->>'full_name', p_payload->>'name'),
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'custom_role_id', '')::uuid,
      nullif(p_payload->>'manager_user_id', '')::uuid,
      nullif(p_payload->>'welcome_message', ''),
      encode(extensions.digest(v_setup_token, 'sha256'), 'hex'),
      public._emae503_actor()
    )
    returning id into v_invitation_id;

    insert into public.team_invitations (customer_id, email, role, department, welcome_message, status, invited_by)
    select
      v_org_id,
      lower(trim(p_payload->>'email')),
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      (select name from public.organization_departments where id = nullif(p_payload->>'department_id', '')::uuid),
      nullif(p_payload->>'welcome_message', ''),
      'pending',
      public._emae503_actor()::text
    where not exists (
      select 1 from public.team_invitations ti
      where ti.customer_id = v_org_id and lower(ti.email) = lower(trim(p_payload->>'email')) and ti.status = 'pending'
    );

    perform public._emae503_log(v_org_id, v_profile_id, 'invitation_sent',
      'Employee invitation sent to ' || (p_payload->>'email'),
      jsonb_build_object('invitation_id', v_invitation_id));
    perform public._ls510_log(v_org_id, 'employee_capacity_used',
      'Employee invitation consumes capacity', 'user_capacity', null, null,
      public._ls510_capacity_summary(v_org_id));

    return jsonb_build_object(
      'ok', true,
      'action', p_action_type,
      'employee_id', v_profile_id,
      'invitation_id', v_invitation_id,
      'setup_link', '/auth/setup?token=' || v_setup_token,
      'message', 'Welcome email prepared — employee creates password and enters APP.',
      'capacity', public._ls510_capacity_summary(v_org_id)
    );
  end if;

  if p_action_type = 'update_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles set
      full_name = coalesce(nullif(p_payload->>'full_name', ''), full_name),
      phone = coalesce(nullif(p_payload->>'phone', ''), phone),
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      job_title = coalesce(nullif(p_payload->>'job_title', ''), job_title),
      manager_user_id = coalesce(nullif(p_payload->>'manager_user_id', '')::uuid, manager_user_id),
      org_role = coalesce(nullif(p_payload->>'org_role', ''), org_role),
      notes = coalesce(nullif(p_payload->>'notes', ''), notes),
      office_location = coalesce(nullif(p_payload->>'office_location', ''), office_location),
      updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_updated', 'Employee profile updated', p_payload);
    return jsonb_build_object('ok', true, 'action', p_action_type);
  end if;

  if p_action_type = 'suspend_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles
    set employee_status = 'suspended', updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'suspended', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_suspended', 'Employee suspended — only this employee loses access', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Employee suspended. Only this employee loses access.');
  end if;

  if p_action_type = 'reactivate_employee' then
    perform public._emae503_require_admin();
    perform public.assert_organization_employee_capacity(v_org_id);
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles
    set employee_status = 'active', updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'active', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_reactivated', 'Employee reactivated', p_payload);
    return jsonb_build_object('ok', true, 'capacity', public._ls510_capacity_summary(v_org_id));
  end if;

  if p_action_type = 'offboard_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles set
      employee_status = 'offboarded',
      end_date = coalesce(nullif(p_payload->>'end_date', '')::date, current_date),
      metadata = metadata || jsonb_build_object('offboard_tasks_transferred', true, 'audit_retained', true),
      updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'removed', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_offboarded',
      'Employee offboarded — login disabled, audit retained, nothing deleted', p_payload);
    perform public._ls510_log(v_org_id, 'employee_capacity_released', 'Employee offboarded — capacity released', 'user_capacity');
    return jsonb_build_object(
      'ok', true,
      'message', 'Login disabled. Tasks and ownership transferred per policy. Audit history retained.',
      'capacity', public._ls510_capacity_summary(v_org_id)
    );
  end if;

  if p_action_type = 'create_department' then
    perform public._emae503_require_admin();
    insert into public.organization_departments (organization_id, department_key, name, description)
    values (
      v_org_id,
      lower(regexp_replace(coalesce(p_payload->>'department_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(p_payload->>'description', '')
    )
    on conflict (organization_id, department_key) do update set name = excluded.name, updated_at = now()
    returning id into v_profile_id;
    perform public._emae503_log(v_org_id, null, 'department_created', 'Department created: ' || (p_payload->>'name'), p_payload);
    return jsonb_build_object('ok', true, 'department_id', v_profile_id);
  end if;

  if p_action_type = 'create_custom_role' then
    perform public._emae503_require_admin();
    insert into public.organization_custom_roles (organization_id, role_key, name, base_role, description)
    values (
      v_org_id,
      lower(regexp_replace(p_payload->>'role_key', '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(nullif(p_payload->>'base_role', ''), 'employee'),
      coalesce(p_payload->>'description', '')
    )
    on conflict (organization_id, role_key) do update set name = excluded.name, updated_at = now()
    returning id into v_profile_id;
    perform public._emae503_log(v_org_id, null, 'custom_role_created', 'Custom role created: ' || (p_payload->>'name'), p_payload);
    return jsonb_build_object('ok', true, 'role_id', v_profile_id);
  end if;

  if p_action_type = 'assign_user_module' then
    perform public._emae503_require_admin();
    v_user_id := (p_payload->>'user_id')::uuid;
    insert into public.organization_user_module_grants (
      organization_id, user_id, module_key,
      can_view, can_create, can_edit, can_delete, can_approve, can_manage,
      granted_by_user_id
    ) values (
      v_org_id, v_user_id, p_payload->>'module_key',
      coalesce((p_payload->>'can_view')::boolean, false),
      coalesce((p_payload->>'can_create')::boolean, false),
      coalesce((p_payload->>'can_edit')::boolean, false),
      coalesce((p_payload->>'can_delete')::boolean, false),
      coalesce((p_payload->>'can_approve')::boolean, false),
      coalesce((p_payload->>'can_manage')::boolean, false),
      public._emae503_actor()
    )
    on conflict (organization_id, user_id, module_key) do update set
      can_view = excluded.can_view, can_create = excluded.can_create,
      can_edit = excluded.can_edit, can_delete = excluded.can_delete,
      can_approve = excluded.can_approve, can_manage = excluded.can_manage,
      updated_at = now();
    perform public._emae503_log(v_org_id, null, 'module_assigned',
      'Module assigned to employee: ' || (p_payload->>'module_key'), p_payload);
    return jsonb_build_object('ok', true, 'message', 'Only assigned employees see this module.');
  end if;

  if p_action_type = 'cancel_invitation' then
    perform public._emae503_require_admin();
    v_invitation_id := (p_payload->>'invitation_id')::uuid;
    update public.organization_employee_invitations
    set status = 'cancelled', updated_at = now()
    where id = v_invitation_id and organization_id = v_org_id;
    perform public._emae503_log(v_org_id, null, 'invitation_cancelled', 'Invitation cancelled', p_payload);
    perform public._ls510_log(v_org_id, 'employee_capacity_released', 'Invitation cancelled — capacity released', 'user_capacity');
    return jsonb_build_object('ok', true, 'capacity', public._ls510_capacity_summary(v_org_id));
  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Replace license dashboard RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_license_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  v_center := public.get_license_subscription_center();
  if coalesce((v_center->>'found')::boolean, false) = false then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'principle', v_center->>'principle',
    'current_plan', jsonb_build_object(
      'plan_key', v_center->'app_license'->>'plan_key',
      'status', v_center->'app_license'->>'status',
      'renewal_date', v_center->'app_license'->>'renewal_date'
    ),
    'business_packs', v_center->'business_packs',
    'domain_pack_installations', v_center->'domain_pack_installations',
    'user_licenses', jsonb_build_array(
      jsonb_build_object('tier_key', 'capacity', 'seat_count', v_center->'capacity'->'total_capacity', 'label', 'User Capacity')
    ),
    'consumption', jsonb_build_object(
      'active_pack_licenses', v_center->'overview'->'business_pack_count',
      'total_seats', v_center->'capacity'->'total_capacity',
      'employees', v_center->'capacity'->'active_employees',
      'domains_used', v_center->'overview'->'domains_used',
      'domains_purchased', v_center->'overview'->'domains_purchased'
    ),
    'app_license', v_center->'app_license',
    'domain_licenses', v_center->'domain_licenses',
    'capacity', v_center->'capacity',
    'overview', v_center->'overview',
    'reports', v_center->'reports',
    'upgrade_center', v_center->'upgrade_center',
    'supported_actions', jsonb_build_array(
      'purchase_capacity', 'purchase_domain', 'upgrade_subscription', 'install_packs', 'enterprise'
    ),
    'app_store_route', '/app/store',
    'module_access_route', '/app/settings/module-access',
    'billing_route', '/app/settings/billing',
    'domains_route', '/app/domains'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Module registry & permissions
-- ---------------------------------------------------------------------------
do $$ declare v_kind text; begin
  update public.aipify_module_registry
  set route_href = '/app/licenses', description = 'License, subscription, and capacity management.'
  where module_key = 'licenses';

  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('licenses', 'licenses.view', 'view', 'Licenses — view')
  on conflict (permission_key) do nothing;

  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('licenses', 'licenses.manage', 'manage', 'Licenses — manage')
  on conflict (permission_key) do nothing;

  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values ('licenses', 'licenses.upgrade', 'custom', 'Licenses — upgrade purchases')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_license_subscription_center() to authenticated;
grant execute on function public.perform_license_subscription_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_license_context() to authenticated;
grant execute on function public.assert_organization_employee_capacity(uuid) to authenticated;

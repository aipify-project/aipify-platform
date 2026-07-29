-- Platform portal Commercial Plan Management V1.
-- Authoritative catalog: public.plans
-- Authoritative commercial state: public.subscriptions (UNIQUE customer_id)
-- Does not create licenses, entitlements, domains, installs, Stripe/Fiken, or emails.
-- Trial is not offered: plans catalog has no authoritative trial_days field.

create or replace function public.get_platform_portal_commercial_plans()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plans jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'key', p.plan_key,
        'name', p.name,
        'description', nullif(btrim(p.description), ''),
        'plan_type', p.plan_key,
        'billing_cycle', p.billing_cycle,
        'amount_minor', case
          when p.price_amount is null then null
          when p.price_amount <= 0 then null
          else round(p.price_amount * 100)::bigint
        end,
        'currency', nullif(btrim(p.currency), ''),
        'trial_days', null,
        'active', p.is_active,
        'supports_lifetime', (
          lower(p.plan_key) = 'lifetime'
          or lower(p.billing_cycle) = 'lifetime'
        ),
        'supports_recurring', (
          lower(p.billing_cycle) in ('monthly', 'yearly')
          and lower(p.plan_key) <> 'lifetime'
        ),
        'supports_trial', false
      )
      order by
        case lower(p.plan_key)
          when 'starter' then 1
          when 'growth' then 2
          when 'business' then 3
          when 'enterprise' then 4
          when 'lifetime' then 5
          else 100
        end,
        p.name
    ),
    '[]'::jsonb
  )
  into v_plans
  from public.plans p
  where p.is_active = true
    and p.plan_key in ('starter', 'growth', 'business', 'enterprise', 'lifetime')
    and p.billing_cycle in ('monthly', 'yearly', 'lifetime');

  return jsonb_build_object(
    'plans', v_plans,
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_platform_portal_commercial_plans()
  from public, anon;
grant execute on function public.get_platform_portal_commercial_plans()
  to authenticated;

create or replace function public.set_platform_portal_customer_commercial_plan(
  p_customer_id uuid,
  p_plan_id uuid,
  p_mode text,
  p_start_mode text,
  p_trial_days integer,
  p_internal_reason text,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mode text;
  v_start_mode text;
  v_reason text;
  v_key text;
  v_payload_hash text;
  v_plan public.plans%rowtype;
  v_company_id uuid;
  v_existing public.subscriptions%rowtype;
  v_subscription public.subscriptions%rowtype;
  v_created boolean := false;
  v_replaced_id uuid := null;
  v_status text;
  v_now timestamptz := now();
  v_period_end timestamptz;
  v_audit jsonb;
  v_result jsonb;
  v_prior jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;
  if p_plan_id is null then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;

  v_mode := lower(nullif(btrim(coalesce(p_mode, '')), ''));
  if v_mode is null or v_mode not in ('lifetime', 'recurring') then
    raise exception 'INVALID_MODE' using errcode = 'P0001';
  end if;

  v_start_mode := lower(nullif(btrim(coalesce(p_start_mode, '')), ''));
  if v_start_mode is null or v_start_mode not in ('now', 'trial') then
    raise exception 'INVALID_START_MODE' using errcode = 'P0001';
  end if;

  v_reason := nullif(btrim(coalesce(p_internal_reason, '')), '');
  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  -- Catalog has no trial_days; trial assignment is rejected in V1.
  if v_start_mode = 'trial' then
    raise exception 'TRIAL_NOT_SUPPORTED' using errcode = 'P0001';
  end if;
  if p_trial_days is not null then
    raise exception 'TRIAL_NOT_SUPPORTED' using errcode = 'P0001';
  end if;

  v_payload_hash := md5(
    p_customer_id::text || '|' ||
    p_plan_id::text || '|' ||
    v_mode || '|' ||
    v_start_mode || '|' ||
    coalesce(p_trial_days::text, '') || '|' ||
    v_reason
  );

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_commercial_plan_set'
    and metadata->>'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior->>'payload_hash', '') <> v_payload_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;

    select *
    into v_subscription
    from public.subscriptions s
    where s.id = nullif(v_prior->>'subscription_id', '')::uuid;

    if v_subscription.id is null then
      raise exception 'IDEMPOTENCY_REPLAY_MISSING' using errcode = 'P0001';
    end if;

    return jsonb_build_object(
      'customer_id', p_customer_id,
      'subscription', jsonb_build_object(
        'id', v_subscription.id,
        'plan_id', v_subscription.plan_id,
        'plan_key', v_subscription.plan_key,
        'plan_name', v_subscription.plan_name,
        'mode', case
          when lower(coalesce(v_subscription.billing_cycle, '')) = 'lifetime'
            or lower(coalesce(v_subscription.plan_type, '')) = 'lifetime'
            or lower(coalesce(v_subscription.plan_key, '')) = 'lifetime'
          then 'lifetime'
          else 'recurring'
        end,
        'status', v_subscription.status,
        'trial_starts_at', v_subscription.trial_starts_at,
        'trial_ends_at', v_subscription.trial_ends_at,
        'current_period_starts_at', v_subscription.current_period_start,
        'current_period_ends_at', v_subscription.current_period_end,
        'created_at', v_subscription.created_at,
        'updated_at', v_subscription.updated_at
      ),
      'created', false,
      'replaced_subscription_id', null,
      'idempotent_replay', true
    );
  end if;

  -- Canonical ordinary customer only.
  select cu.company_id
  into v_company_id
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  join public.organizations o on o.id = cu.id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
    and lower(coalesce(o.slug, '')) <> 'my-company-1'
    and lower(coalesce(co.slug, '')) <> 'my-company-1';

  if v_company_id is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  select *
  into v_plan
  from public.plans p
  where p.id = p_plan_id
    and p.is_active = true
    and p.plan_key in ('starter', 'growth', 'business', 'enterprise', 'lifetime')
    and p.billing_cycle in ('monthly', 'yearly', 'lifetime');

  if v_plan.id is null then
    raise exception 'PLAN_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_mode = 'lifetime' then
    if lower(v_plan.plan_key) <> 'lifetime' or lower(v_plan.billing_cycle) <> 'lifetime' then
      raise exception 'PLAN_LIFETIME_UNSUPPORTED' using errcode = 'P0001';
    end if;
  else
    if lower(v_plan.plan_key) = 'lifetime' or lower(v_plan.billing_cycle) = 'lifetime' then
      raise exception 'PLAN_RECURRING_UNSUPPORTED' using errcode = 'P0001';
    end if;
    if lower(v_plan.billing_cycle) not in ('monthly', 'yearly') then
      raise exception 'PLAN_RECURRING_UNSUPPORTED' using errcode = 'P0001';
    end if;
  end if;

  select *
  into v_existing
  from public.subscriptions s
  where s.customer_id = p_customer_id
  for update;

  if v_existing.id is not null
     and lower(coalesce(v_existing.status, '')) in ('active', 'trialing', 'past_due') then
    -- Same active commercial identity without creating a duplicate row.
    if lower(coalesce(v_existing.plan_id::text, '')) = p_plan_id::text
       and (
         (v_mode = 'lifetime' and (
           lower(coalesce(v_existing.billing_cycle, '')) = 'lifetime'
           or lower(coalesce(v_existing.plan_key, '')) = 'lifetime'
         ))
         or
         (v_mode = 'recurring' and lower(coalesce(v_existing.billing_cycle, '')) in ('monthly', 'yearly'))
       )
       and lower(coalesce(v_existing.status, '')) = 'active' then
      raise exception 'ACTIVE_PLAN_CONFLICT' using errcode = 'P0001';
    end if;
    raise exception 'ACTIVE_PLAN_CONFLICT' using errcode = 'P0001';
  end if;

  v_status := 'active';
  if v_mode = 'lifetime' then
    v_period_end := null;
  elsif lower(v_plan.billing_cycle) = 'yearly' then
    v_period_end := v_now + interval '1 year';
  else
    v_period_end := v_now + interval '1 month';
  end if;

  if v_existing.id is null then
    insert into public.subscriptions (
      customer_id,
      plan_name,
      plan_type,
      status,
      trial_starts_at,
      trial_ends_at,
      billing_cycle,
      price_amount,
      currency,
      max_users,
      max_installations,
      max_domains,
      plan_id,
      plan_key,
      current_period_start,
      current_period_end,
      provider,
      provider_subscription_id,
      license_service_status,
      cancelled_at
    ) values (
      p_customer_id,
      v_plan.name,
      v_plan.plan_key,
      v_status,
      null,
      null,
      v_plan.billing_cycle,
      coalesce(v_plan.price_amount, 0),
      coalesce(nullif(btrim(v_plan.currency), ''), 'NOK'),
      coalesce(v_plan.max_users, 5),
      coalesce(v_plan.max_installations, 1),
      v_plan.max_domains,
      v_plan.id,
      v_plan.plan_key,
      v_now,
      v_period_end,
      'manual',
      null,
      'active',
      null
    )
    returning * into v_subscription;
    v_created := true;
  else
    -- Schema enforces one subscription row per customer; cancelled/paused may be replaced in place.
    v_replaced_id := v_existing.id;
    update public.subscriptions s
    set
      plan_name = v_plan.name,
      plan_type = v_plan.plan_key,
      status = v_status,
      trial_starts_at = null,
      trial_ends_at = null,
      billing_cycle = v_plan.billing_cycle,
      price_amount = coalesce(v_plan.price_amount, 0),
      currency = coalesce(nullif(btrim(v_plan.currency), ''), 'NOK'),
      max_users = coalesce(v_plan.max_users, s.max_users),
      max_installations = coalesce(v_plan.max_installations, s.max_installations),
      max_domains = coalesce(v_plan.max_domains, s.max_domains),
      plan_id = v_plan.id,
      plan_key = v_plan.plan_key,
      current_period_start = v_now,
      current_period_end = v_period_end,
      provider = coalesce(nullif(btrim(s.provider), ''), 'manual'),
      license_service_status = 'active',
      cancelled_at = null,
      service_paused_at = null,
      payment_overdue_since = null,
      grace_period_ends_at = null,
      updated_at = v_now
    where s.id = v_existing.id
    returning * into v_subscription;
    v_created := false;
  end if;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'subscription', jsonb_build_object(
      'id', v_subscription.id,
      'plan_id', v_subscription.plan_id,
      'plan_key', v_subscription.plan_key,
      'plan_name', v_subscription.plan_name,
      'mode', v_mode,
      'status', v_subscription.status,
      'trial_starts_at', v_subscription.trial_starts_at,
      'trial_ends_at', v_subscription.trial_ends_at,
      'current_period_starts_at', v_subscription.current_period_start,
      'current_period_ends_at', v_subscription.current_period_end,
      'created_at', v_subscription.created_at,
      'updated_at', v_subscription.updated_at
    ),
    'created', v_created,
    'replaced_subscription_id', v_replaced_id,
    'idempotent_replay', false
  );

  begin
    v_audit := jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_payload_hash,
      'subscription_id', v_subscription.id,
      'plan_id', v_plan.id,
      'plan_key', v_plan.plan_key,
      'mode', v_mode,
      'start_mode', v_start_mode,
      'internal_reason', v_reason,
      'created', v_created,
      'replaced_subscription_id', v_replaced_id,
      'result', v_result
    );
    perform public.record_platform_admin_audit_event(
      'platform_customer_commercial_plan_set',
      'subscription',
      v_subscription.id::text,
      v_audit
    );
  exception
    when others then
      null;
  end;

  return v_result;
end;
$$;

revoke all on function public.set_platform_portal_customer_commercial_plan(
  uuid, uuid, text, text, integer, text, text
) from public, anon;
grant execute on function public.set_platform_portal_customer_commercial_plan(
  uuid, uuid, text, text, integer, text, text
) to authenticated;

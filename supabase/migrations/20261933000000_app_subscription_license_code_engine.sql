-- Wire existing aipify_billing_license_links as APP subscription license-code engine.
-- Reuses Phase 586 billing license registry — no parallel table, no deployment licenses.

-- ---------------------------------------------------------------------------
-- 1. Duplicate guard — one active/pending app_subscription per organization
-- ---------------------------------------------------------------------------
with ranked as (
  select
    l.id,
    row_number() over (
      partition by l.organization_id
      order by l.created_at asc, l.id asc
    ) as rn
  from public.aipify_billing_license_links l
  where l.license_type = 'app_subscription'
    and l.license_status in ('pending', 'active')
)
update public.aipify_billing_license_links l
set
  license_status = 'cancelled',
  updated_at = now()
from ranked r
where l.id = r.id
  and r.rn > 1;

create unique index if not exists aipify_billing_license_links_one_app_subscription_idx
  on public.aipify_billing_license_links (organization_id)
  where license_type = 'app_subscription'
    and license_status in ('pending', 'active');

-- ---------------------------------------------------------------------------
-- 2. Billing license key helpers (Phase 586 namespace)
-- ---------------------------------------------------------------------------
create or replace function public._ube586_generate_license_key()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  return 'AIP-SUB-' || upper(encode(extensions.gen_random_bytes(16), 'hex'));
end;
$$;

revoke all on function public._ube586_generate_license_key() from public, anon, authenticated;

create or replace function public._ube586_mask_license_key(p_license_key text)
returns text
language plpgsql
immutable
as $$
declare
  v_key text := coalesce(trim(p_license_key), '');
begin
  if v_key = '' then
    return null;
  end if;

  if length(v_key) <= 8 then
    return repeat('*', length(v_key));
  end if;

  return left(v_key, 4) || repeat('*', greatest(length(v_key) - 8, 4)) || right(v_key, 4);
end;
$$;

revoke all on function public._ube586_mask_license_key(text) from public, anon, authenticated;

create or replace function public._ube586_app_subscription_is_eligible(p_org_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_status text;
begin
  select s.plan_key, s.status
  into v_plan, v_status
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  if v_plan is null and v_status is null then
    return false;
  end if;

  return coalesce(v_plan, '') = 'lifetime'
    or coalesce(v_status, '') in ('trial', 'active', 'internal');
end;
$$;

revoke all on function public._ube586_app_subscription_is_eligible(uuid) from public, anon, authenticated;

create or replace function public._ube586_map_app_subscription_license_status(p_org_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_status text;
  v_service text;
begin
  select s.plan_key, s.status
  into v_plan, v_status
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  if coalesce(v_plan, '') = 'lifetime'
     and coalesce(v_status, '') in ('trial', 'active', 'internal', 'past_due') then
    return 'active';
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    v_service := public.resolve_license_service_status(p_org_id);
  end if;

  return case
    when coalesce(v_status, '') in ('cancelled', 'expired') then 'cancelled'
    when v_service = 'paused' or coalesce(v_status, '') = 'past_due' then 'suspended'
    when coalesce(v_status, '') in ('trial', 'active', 'internal') then 'active'
    else 'pending'
  end;
end;
$$;

revoke all on function public._ube586_map_app_subscription_license_status(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Idempotent ensure — never rotate existing keys
-- ---------------------------------------------------------------------------
create or replace function public.ensure_aipify_app_subscription_license(p_org_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.aipify_billing_license_links;
  v_created boolean := false;
  v_plan text;
  v_status text;
  v_license_status text;
  v_new_key text;
begin
  if p_org_id is null then
    return jsonb_build_object('ok', false, 'reason', 'organization_required');
  end if;

  select *
  into v_existing
  from public.aipify_billing_license_links l
  where l.organization_id = p_org_id
    and l.license_type = 'app_subscription'
    and l.license_status in ('pending', 'active')
  order by l.created_at asc, l.id asc
  limit 1
  for update;

  select s.plan_key, s.status
  into v_plan, v_status
  from public.organization_subscriptions s
  where s.organization_id = p_org_id
  limit 1;

  v_license_status := public._ube586_map_app_subscription_license_status(p_org_id);

  if v_existing.id is not null then
    update public.aipify_billing_license_links
    set
      license_status = v_license_status,
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
        'plan_key', coalesce(v_plan, metadata ->> 'plan_key'),
        'subscription_status', coalesce(v_status, metadata ->> 'subscription_status'),
        'engine', 'aipify_billing_license_links',
        'license_scope', 'app_subscription'
      ),
      updated_at = now()
    where id = v_existing.id;

    return jsonb_build_object(
      'ok', true,
      'created', false,
      'license_link_id', v_existing.id,
      'license_status', v_license_status
    );
  end if;

  if not public._ube586_app_subscription_is_eligible(p_org_id) then
    return jsonb_build_object(
      'ok', true,
      'created', false,
      'skipped', true,
      'reason', 'not_eligible'
    );
  end if;

  v_new_key := public._ube586_generate_license_key();

  insert into public.aipify_billing_license_links (
    organization_id,
    license_key,
    license_type,
    license_status,
    purchased_capacity,
    used_capacity,
    metadata
  )
  values (
    p_org_id,
    v_new_key,
    'app_subscription',
    v_license_status,
    1,
    0,
    jsonb_build_object(
      'plan_key', coalesce(v_plan, 'starter'),
      'subscription_status', coalesce(v_status, 'trial'),
      'engine', 'aipify_billing_license_links',
      'license_scope', 'app_subscription',
      'issued_by', 'ensure_aipify_app_subscription_license'
    )
  )
  returning * into v_existing;

  v_created := true;

  perform public._ube586_record_event(
    p_org_id,
    'license_activated',
    'APP subscription license code ensured',
    jsonb_build_object(
      'license_type', 'app_subscription',
      'license_link_id', v_existing.id,
      'created', true
    )
  );

  return jsonb_build_object(
    'ok', true,
    'created', v_created,
    'license_link_id', v_existing.id,
    'license_status', v_existing.license_status
  );
end;
$$;

revoke all on function public.ensure_aipify_app_subscription_license(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Audited reveal for current APP organization
-- ---------------------------------------------------------------------------
create or replace function public.reveal_customer_app_license_code()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_license_key text;
  v_link_status text;
  v_link_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if not public.has_organization_permission('license_center.manage') then
    raise exception 'Permission denied: license_center.manage';
  end if;

  v_org_id := public._mta_require_organization();

  select l.id, l.license_key, l.license_status
  into v_link_id, v_license_key, v_link_status
  from public.aipify_billing_license_links l
  where l.organization_id = v_org_id
    and l.license_type = 'app_subscription'
    and l.license_status in ('pending', 'active')
  order by l.created_at asc, l.id asc
  limit 1;

  if v_link_id is null or v_license_key is null then
    return jsonb_build_object(
      'ok', false,
      'reason', 'license_code_unavailable'
    );
  end if;

  perform public.record_trust_audit_event(
    v_org_id,
    'app_subscription_license_code_revealed',
    'success',
    null,
    'Customer revealed APP subscription license code',
    'license_center',
    null,
    jsonb_build_object(
      'license_type', 'app_subscription',
      'license_link_id', v_link_id,
      'license_status', v_link_status
    )
  );

  perform public._ube586_log(
    v_org_id,
    'license_code_revealed',
    'APP subscription license code revealed',
    jsonb_build_object(
      'license_type', 'app_subscription',
      'license_link_id', v_link_id
    ),
    'unified_billing'
  );

  return jsonb_build_object(
    'ok', true,
    'license_code', v_license_key,
    'license_type', 'app_subscription',
    'license_status', v_link_status,
    'revealed_at', now()
  );
end;
$$;

grant execute on function public.reveal_customer_app_license_code() to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Extend Trust License Center GET — masked license_code only
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
  v_license_key text;
  v_link_status text;
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

  if not public.has_organization_permission('license_center.view')
     and not public.has_organization_permission('license_center.manage') then
    raise exception 'Permission denied: license_center.view';
  end if;

  v_license_status := public.resolve_license_service_status(v_customer_id);
  v_limits := public.get_customer_license_limits(v_customer_id);

  if v_license_status = 'grace_period' then
    v_grace_ends := coalesce(
      (select s.grace_period_ends_at from public.subscriptions s where s.customer_id = v_customer_id),
      now() + interval '3 days'
    );
  end if;

  select l.license_key, l.license_status
  into v_license_key, v_link_status
  from public.aipify_billing_license_links l
  where l.organization_id = v_customer_id
    and l.license_type = 'app_subscription'
    and l.license_status in ('pending', 'active')
  order by l.created_at asc, l.id asc
  limit 1;

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
    'has_license_code', v_license_key is not null,
    'license_code', case
      when v_license_key is not null then public._ube586_mask_license_key(v_license_key)
      else null
    end,
    'app_subscription_license_status', v_link_status,
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
    ),
    'pricing_philosophy_note', public._eppcm_philosophy_summary()
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Subscription sync hooks
-- ---------------------------------------------------------------------------
create or replace function public._ls510_sync_from_subscription(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
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

  perform public.ensure_aipify_app_subscription_license(p_org_id);
end;
$$;

create or replace function public._spm_sync_legacy_subscription(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.organization_subscriptions;
  v_legacy_status text;
  v_plan_type text;
begin
  select * into v_sub from public.organization_subscriptions where organization_id = p_organization_id;
  if v_sub.id is null then return; end if;

  v_plan_type := public._spm_legacy_plan_type(v_sub.plan_key);

  v_legacy_status := case v_sub.status
    when 'trial' then 'trialing'
    when 'active' then 'active'
    when 'past_due' then 'past_due'
    when 'cancelled' then 'cancelled'
    when 'expired' then 'paused'
    when 'internal' then 'active'
    else 'active'
  end;

  update public.organizations set
    subscription_plan = v_sub.plan_key,
    updated_at = now()
  where id = p_organization_id;

  insert into public.subscriptions (
    customer_id, plan_name, plan_type, status, trial_starts_at, trial_ends_at, billing_cycle
  )
  values (
    p_organization_id,
    initcap(v_sub.plan_key) || ' Plan',
    v_plan_type,
    v_legacy_status,
    case when v_sub.status = 'trial' then v_sub.started_at else null end,
    v_sub.trial_ends_at,
    v_sub.billing_cycle
  )
  on conflict (customer_id) do update set
    plan_name = excluded.plan_name,
    plan_type = excluded.plan_type,
    status = excluded.status,
    trial_starts_at = excluded.trial_starts_at,
    trial_ends_at = excluded.trial_ends_at,
    billing_cycle = excluded.billing_cycle,
    updated_at = now();

  perform public.ensure_aipify_app_subscription_license(p_organization_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Generic backfill — counts only
-- ---------------------------------------------------------------------------
create or replace function public.backfill_aipify_app_subscription_licenses()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_result jsonb;
  v_eligible int := 0;
  v_created int := 0;
  v_updated int := 0;
  v_skipped int := 0;
begin
  for v_org_id in
    select distinct s.organization_id
    from public.organization_subscriptions s
    where public._ube586_app_subscription_is_eligible(s.organization_id)
  loop
    v_eligible := v_eligible + 1;
    v_result := public.ensure_aipify_app_subscription_license(v_org_id);

    if coalesce(v_result ->> 'created', 'false') = 'true' then
      v_created := v_created + 1;
    elsif coalesce(v_result ->> 'skipped', 'false') = 'true' then
      v_skipped := v_skipped + 1;
    else
      v_updated := v_updated + 1;
    end if;
  end loop;

  return jsonb_build_object(
    'eligible_organizations', v_eligible,
    'created', v_created,
    'updated', v_updated,
    'skipped', v_skipped,
    'active_app_subscription_links', (
      select count(*)
      from public.aipify_billing_license_links
      where license_type = 'app_subscription'
        and license_status in ('pending', 'active')
    )
  );
end;
$$;

revoke all on function public.backfill_aipify_app_subscription_licenses() from public, anon, authenticated;

select public.backfill_aipify_app_subscription_licenses();

notify pgrst, 'reload schema';

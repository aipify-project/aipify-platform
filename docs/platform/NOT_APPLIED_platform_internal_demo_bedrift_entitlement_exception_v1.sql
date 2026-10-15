-- =============================================================================
-- NOT_APPLIED — EXECUTABLE DRAFT — DO NOT AUTO-DEPLOY — DO NOT EXECUTE WITHOUT
-- A SEPARATE NAMED OWNER APPLY YES THAT CITES THIS FILE PATH AND SHA-256.
-- =============================================================================
-- Contract: platform_internal_demo_bedrift_entitlement_exception_v1
-- Job: AIPIFY_KOMPIS_BEDRIFT_D2M_INTERNAL_SANDBOX_ENABLEMENT_CONTRACT_V1
--
-- LOCATION RULE:
--   This file lives under docs/platform/ and MUST NOT be copied into
--   supabase/migrations/ or applied by CI/automatic migration runners until
--   an owner-named apply job explicitly relocates/applies it.
--
-- WHY THIS EXISTS (post D2L):
--   D2L applied internal environment enforcement. Triggers block INSERT/UPDATE on
--   subscriptions, aipify_billing_license_links, organization_domains,
--   customer_domains, and installations for customers.environment_type=internal.
--   Existing activate_platform_portal_customer_kompis_bedrift requires a healthy
--   commercial subscription (agreement_ok) before writing tenant_modules.
--   Therefore an INTERNAL sandbox cannot honestly receive Kompis Bedrift through
--   the commercial agreement path without either (a) violating exposure triggers
--   or (b) a narrow non-billable entitlement exception.
--
-- WHAT THIS FILE DOES (when later applied):
--   1) Adds fail-closed helper
--      _platform_portal_internal_demo_bedrift_entitlement_authorized(uuid) → false
--   2) Extends get_platform_portal_customer_kompis_bedrift_status so eligibility
--      may also be satisfied when:
--        - customer.environment_type = 'internal'
--        - helper returns true
--        - caller is an active platform super_admin
--      Commercial subscription path remains unchanged for non-internal customers.
--   3) Extends activate metadata to record entitlement_path =
--      internal_demo_exception when that path is used.
--
-- EXPLICIT NON-GOALS OF APPLYING THIS FILE:
--   ZERO customer / company / auth / invite / membership writes
--   ZERO tenant_modules grants (helper stays false → still not eligible)
--   ZERO flip of helper to true
--   ZERO subscriptions / license links / domains / installations
--   ZERO Stripe / billing / CMS / Website Kompis public-chain changes
--   ZERO mutation of existing Web pilot / ordinary customers
--   ZERO weakening of D2L exposure triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Fail-closed internal demo Bedrift entitlement gate
-- ---------------------------------------------------------------------------
create or replace function public._platform_portal_internal_demo_bedrift_entitlement_authorized(
  p_customer_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  -- Default deny. A later owner-named job may replace this body to return true
  -- only for an explicitly approved INTERNAL customer id (never an existing
  -- Web pilot or ordinary production customer).
  -- p_customer_id is accepted for a future allowlist body; unused while denied.
  select false and p_customer_id is not null;
$$;

revoke all on function public._platform_portal_internal_demo_bedrift_entitlement_authorized(uuid)
  from public, anon;
grant execute on function public._platform_portal_internal_demo_bedrift_entitlement_authorized(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Status RPC — commercial agreement OR authorized internal demo exception
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_portal_customer_kompis_bedrift_status(
  p_customer_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_subscription public.subscriptions;
  v_module public.tenant_modules;
  v_agreement_ok boolean := false;
  v_internal_demo_ok boolean := false;
  v_entitlement_ok boolean := false;
  v_active boolean := false;
  v_eligible boolean := false;
  v_reasons jsonb := '[]'::jsonb;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    return null;
  end if;

  select cu.*
  into v_customer
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false;

  if v_customer.id is null then
    return null;
  end if;

  select *
  into v_subscription
  from public.subscriptions
  where customer_id = v_customer.id
  order by
    (lower(coalesce(status, '')) in ('active', 'trialing')) desc,
    updated_at desc nulls last
  limit 1;

  v_agreement_ok :=
    v_subscription.id is not null
    and lower(coalesce(v_subscription.status, '')) in ('active', 'trialing')
    and lower(coalesce(v_subscription.license_service_status, '')) is distinct from 'paused';

  v_internal_demo_ok :=
    lower(coalesce(v_customer.environment_type, '')) = 'internal'
    and public._platform_portal_internal_demo_bedrift_entitlement_authorized(v_customer.id)
    and public._platform_portal_is_active_super_admin();

  v_entitlement_ok := v_agreement_ok or v_internal_demo_ok;

  v_reasons := v_reasons || jsonb_build_array(
    jsonb_build_object(
      'code', 'agreement_active',
      'satisfied', v_agreement_ok
    ),
    jsonb_build_object(
      'code', 'internal_demo_entitlement_exception',
      'satisfied', v_internal_demo_ok
    )
  );

  select *
  into v_module
  from public.tenant_modules
  where tenant_id = v_customer.id
    and module_key = 'kompis_bedrift'
  limit 1;

  v_active :=
    v_module.id is not null
    and v_module.licensed
    and v_module.enabled
    and v_module.status in ('enabled', 'trial', 'beta');

  -- Eligible when commercial agreement OR authorized internal demo exception,
  -- and not already active. Domains / Website Kompis installs are NOT required.
  v_eligible := v_entitlement_ok and not v_active;

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'module_key', 'kompis_bedrift',
    'active', v_active,
    'eligible', v_eligible,
    'reasons', v_reasons,
    'entitlement_path', case
      when v_internal_demo_ok then 'internal_demo_exception'
      when v_agreement_ok then 'commercial_agreement'
      else 'none'
    end,
    'existing_activation', case
      when v_module.id is null then null
      else jsonb_build_object(
        'id', v_module.id,
        'status', v_module.status,
        'licensed', v_module.licensed,
        'enabled', v_module.enabled,
        'activated_at', v_module.activated_at
      )
    end,
    'subscription', case
      when v_subscription.id is null then null
      else jsonb_build_object(
        'id', v_subscription.id,
        'status', v_subscription.status,
        'plan_key', v_subscription.plan_key
      )
    end,
    'notes', jsonb_build_object(
      'no_membership_default', true,
      'no_employee_knowledge_alias', true,
      'grants_only_via_platform_activate', true,
      'internal_demo_exception_default_denied', true,
      'internal_exposure_triggers_unchanged', true
    )
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_kompis_bedrift_status(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_kompis_bedrift_status(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Activate RPC — same gates; metadata records entitlement_path
-- ---------------------------------------------------------------------------
create or replace function public.activate_platform_portal_customer_kompis_bedrift(
  p_customer_id uuid,
  p_internal_reason text,
  p_confirmation boolean,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status jsonb;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior jsonb;
  v_hash text;
  v_module public.tenant_modules;
  v_result jsonb;
  v_reason_lower text;
  v_created boolean := false;
  v_path text := 'commercial_agreement';
  v_source text := 'platform_portal_activate';
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001';
  end if;

  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;

  if v_reason is null or char_length(v_reason) < 3 or char_length(v_reason) > 500 then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  v_reason_lower := lower(v_reason);
  if v_reason_lower ~ '(sk-|rk_|bearer |password|secret|api[_-]?key|totp|mfa|authorization:)' then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  if v_key !~ '^bpk-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|kompis_bedrift|' || v_reason || '|true');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_kompis_bedrift_activate'
    and metadata ->> 'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior ->> 'payload_hash', '') <> v_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return coalesce(v_prior -> 'result', '{}'::jsonb)
      || jsonb_build_object('idempotent_replay', true, 'created', false);
  end if;

  perform 1 from public.customers where id = p_customer_id for update;

  v_status := public.get_platform_portal_customer_kompis_bedrift_status(p_customer_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  if coalesce((v_status ->> 'active')::boolean, false) then
    v_result := jsonb_build_object(
      'customer_id', p_customer_id,
      'created', false,
      'idempotent_replay', false,
      'entitlement_path', coalesce(v_status ->> 'entitlement_path', 'none'),
      'activation', jsonb_build_object(
        'id', v_status -> 'existing_activation' ->> 'id',
        'module_code', 'kompis_bedrift',
        'status', coalesce(v_status -> 'existing_activation' ->> 'status', 'enabled'),
        'activated_at', v_status -> 'existing_activation' -> 'activated_at'
      )
    );
    return v_result;
  end if;

  if not coalesce((v_status ->> 'eligible')::boolean, false) then
    raise exception 'PREREQUISITES_NOT_MET' using errcode = 'P0001';
  end if;

  v_path := coalesce(v_status ->> 'entitlement_path', 'commercial_agreement');
  if v_path = 'internal_demo_exception' then
    v_source := 'platform_portal_internal_demo_activate';
  end if;

  perform 1
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'kompis_bedrift'
  for update;

  select *
  into v_module
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'kompis_bedrift'
  limit 1;

  if v_module.id is null then
    insert into public.tenant_modules (
      tenant_id,
      module_key,
      licensed,
      enabled,
      status,
      activated_at,
      metadata
    )
    values (
      p_customer_id,
      'kompis_bedrift',
      true,
      true,
      'enabled',
      now(),
      jsonb_build_object(
        'source', v_source,
        'product', 'kompis_bedrift',
        'entitlement_path', v_path,
        'billable', false
      )
    )
    returning * into v_module;
    v_created := true;
  else
    update public.tenant_modules
    set
      licensed = true,
      enabled = true,
      status = 'enabled',
      activated_at = coalesce(activated_at, now()),
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
        'source', v_source,
        'product', 'kompis_bedrift',
        'entitlement_path', v_path,
        'billable', (v_path = 'commercial_agreement')
      ),
      updated_at = now()
    where id = v_module.id
    returning * into v_module;
  end if;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'created', v_created,
    'idempotent_replay', false,
    'entitlement_path', v_path,
    'activation', jsonb_build_object(
      'id', v_module.id,
      'module_code', 'kompis_bedrift',
      'status', v_module.status,
      'licensed', v_module.licensed,
      'enabled', v_module.enabled,
      'activated_at', v_module.activated_at
    )
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_kompis_bedrift_activate',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'internal_reason', v_reason,
      'organization_id', p_customer_id,
      'module_key', 'kompis_bedrift',
      'activation_id', v_module.id,
      'created', v_created,
      'entitlement_path', v_path,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.activate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.activate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)
  to authenticated;

-- END OF NOT_APPLIED FILE

-- =============================================================================
-- PROPOSAL ONLY — NOT APPLIED — DO NOT RUN ON PRODUCTION WITHOUT OWNER APPROVAL
-- =============================================================================
-- Proposed version key (if later authorized into supabase/migrations/):
--   20261939000000_kompis_bedrift_product_entitlement_register_v1
-- Filename in inert proposals tree:
--   docs/proposals/20261939000000_kompis_bedrift_product_entitlement_register_v1.NOT_APPLIED.sql
--
-- Purpose:
--   Register canonical Platform → Core grant/status RPCs for product key
--   `kompis_bedrift` using the EXISTING `tenant_modules` model
--   (same authority as `website_kompis` via is_tenant_module_enabled).
--
-- Explicit non-goals (this file):
--   - ZERO inserts/updates into tenant_modules for any customer (including UnoNight)
--   - ZERO mapping from membership / employee_knowledge → kompis_bedrift
--   - ZERO changes to subscription_packages.module_keys (no package auto-sync grant)
--   - ZERO Stripe / invoice / Web quota / Website Kompis public-chain changes
--   - ZERO RLS policy rewrites beyond grants already used by sibling Platform RPCs
--
-- Apply-time row impact if authorized later:
--   tenant_modules: 0 rows
--   customers / installations / FAQ: 0 rows
--   New/replaced functions only (CREATE OR REPLACE)
--
-- Prerequisites for a LATER explicit grant (separate owner-approved call, not this apply):
--   Platform operator invokes activate_platform_portal_customer_kompis_bedrift(...)
--   with confirmation + reason + idempotency key prefix bpk-
-- =============================================================================

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

  v_reasons := v_reasons || jsonb_build_array(
    jsonb_build_object(
      'code', 'agreement_active',
      'satisfied', v_agreement_ok
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

  -- Eligible for an explicit Platform grant when agreement is healthy and not already active.
  -- Domain / Website Kompis install are intentionally NOT required (Bedrift is org-scoped).
  v_eligible := v_agreement_ok and not v_active;

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'module_key', 'kompis_bedrift',
    'active', v_active,
    'eligible', v_eligible,
    'reasons', v_reasons,
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
      'grants_only_via_platform_activate', true
    )
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_kompis_bedrift_status(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_kompis_bedrift_status(uuid)
  to authenticated;

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
        'source', 'platform_portal_activate',
        'product', 'kompis_bedrift'
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
        'source', 'platform_portal_activate',
        'product', 'kompis_bedrift'
      ),
      updated_at = now()
    where id = v_module.id
    returning * into v_module;
  end if;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'created', v_created,
    'idempotent_replay', false,
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

create or replace function public.deactivate_platform_portal_customer_kompis_bedrift(
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
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior jsonb;
  v_hash text;
  v_module public.tenant_modules;
  v_result jsonb;
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
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 or v_key !~ '^bpk-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|kompis_bedrift|deactivate|' || v_reason || '|true');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_kompis_bedrift_deactivate'
    and metadata ->> 'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior ->> 'payload_hash', '') <> v_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return coalesce(v_prior -> 'result', '{}'::jsonb)
      || jsonb_build_object('idempotent_replay', true);
  end if;

  update public.tenant_modules
  set
    enabled = false,
    licensed = false,
    status = 'disabled',
    updated_at = now()
  where tenant_id = p_customer_id
    and module_key = 'kompis_bedrift'
  returning * into v_module;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'module_key', 'kompis_bedrift',
    'deactivated', v_module.id is not null,
    'activation', case
      when v_module.id is null then null
      else jsonb_build_object(
        'id', v_module.id,
        'status', v_module.status,
        'licensed', v_module.licensed,
        'enabled', v_module.enabled
      )
    end
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_kompis_bedrift_deactivate',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'internal_reason', v_reason,
      'organization_id', p_customer_id,
      'module_key', 'kompis_bedrift',
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.deactivate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.deactivate_platform_portal_customer_kompis_bedrift(uuid, text, boolean, text)
  to authenticated;

-- End of proposal. Apply-time tenant_modules DML: none.

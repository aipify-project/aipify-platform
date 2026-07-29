-- Platform Portal Website Kompis Activation V1.
-- Reuses tenant_modules + tenant_public_companion_install_config only.
-- No parallel model. No customer data writes on apply. No frozen runtime changes.

create or replace function public._platform_portal_derive_license_provisioning_status(
  p_domain_reference text,
  p_installation_id uuid,
  p_installation_status text
)
returns text
language sql
stable
set search_path = public
as $$
  select case
    when nullif(btrim(coalesce(p_domain_reference, '')), '') is null then 'requires_domain'
    when p_installation_id is null then 'requires_installation'
    when lower(coalesce(p_installation_status, '')) = 'failed' then 'failed'
    when exists (
      select 1
      from public.tenant_public_companion_install_config c
      join public.tenant_modules tm
        on tm.tenant_id = c.tenant_id
       and tm.module_key = 'website_kompis'
      where c.install_id = p_installation_id
        and coalesce((c.config ->> 'enabled')::boolean, false) = true
        and coalesce(tm.licensed, false) = true
        and coalesce(tm.enabled, false) = true
        and lower(coalesce(tm.status, '')) = 'enabled'
    ) then 'active'
    when lower(coalesce(p_installation_status, '')) = 'active' then 'ready_for_activation'
    else 'ready_for_activation'
  end;
$$;

revoke all on function public._platform_portal_derive_license_provisioning_status(text, uuid, text)
  from public, anon, authenticated;

create or replace function public.get_platform_portal_customer_website_kompis_status(
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
  v_license public.aipify_billing_license_links;
  v_domain public.customer_domains;
  v_install public.installations;
  v_module public.tenant_modules;
  v_config public.tenant_public_companion_install_config;
  v_reasons jsonb := '[]'::jsonb;
  v_agreement_ok boolean := false;
  v_license_ok boolean := false;
  v_product_ok boolean := false;
  v_domain_ok boolean := false;
  v_domain_verified boolean := false;
  v_install_ok boolean := false;
  v_install_id_ok boolean := false;
  v_approval_ok boolean := true;
  v_not_conflicting boolean := true;
  v_active boolean := false;
  v_prerequisite_ok boolean := false;
  v_eligible boolean := false;
  v_activation_status text := 'not_ready';
  v_duration text := null;
  v_provisioning text := null;
begin
  perform public._ppsf258_require_platform_access();

  if p_customer_id is null then
    return null;
  end if;

  select cu.*
  into v_customer
  from public.customers cu
  join public.companies co on co.id = cu.company_id
  join public.organizations o on o.id = cu.id
  where cu.id = p_customer_id
    and coalesce(co.is_platform, false) = false
    and co.id <> '2697c432-d03d-44f6-839c-66200fd20b55'::uuid
    and co.id <> '9a2a6eab-e47d-4473-9fd5-baee226d4db7'::uuid
    and cu.id <> '97a4bbcd-a223-47bd-9a3e-eadab02aaf1c'::uuid
    and lower(coalesce(o.slug, '')) <> 'my-company-1'
    and lower(coalesce(co.slug, '')) <> 'my-company-1';

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

  if v_subscription.id is not null then
    if lower(coalesce(v_subscription.plan_key, '')) = 'lifetime'
      or lower(coalesce(v_subscription.plan_type, '')) = 'lifetime'
      or lower(coalesce(v_subscription.billing_cycle, '')) = 'lifetime'
    then
      v_duration := 'lifetime';
    else
      v_duration := coalesce(nullif(btrim(v_subscription.billing_cycle), ''), nullif(btrim(v_subscription.plan_type), ''));
    end if;
  end if;

  select *
  into v_license
  from public.aipify_billing_license_links
  where organization_id = v_customer.id
    and lower(coalesce(license_type, '')) = 'app_subscription'
  order by
    (lower(coalesce(license_status, '')) = 'active') desc,
    created_at desc nulls last
  limit 1;

  v_product_ok := v_license.id is not null and lower(coalesce(v_license.license_type, '')) = 'app_subscription';
  v_license_ok :=
    v_product_ok
    and lower(coalesce(v_license.license_status, '')) = 'active'
    and nullif(btrim(v_license.domain_reference), '') is not null;

  if v_license.id is not null and nullif(btrim(v_license.domain_reference), '') is not null then
    select *
    into v_domain
    from public.customer_domains cd
    where cd.customer_id = v_customer.id
      and lower(btrim(cd.domain)) = lower(btrim(v_license.domain_reference))
      and lower(coalesce(cd.status, '')) not in ('removed', 'suspended')
    order by
      (lower(coalesce(cd.verification_status, '')) = 'verified') desc,
      (lower(coalesce(cd.status, '')) in ('active', 'verified')) desc,
      cd.verified_at desc nulls last
    limit 1;
  end if;

  v_domain_ok := v_domain.id is not null;
  v_domain_verified :=
    v_domain_ok
    and (
      lower(coalesce(v_domain.verification_status, '')) = 'verified'
      or v_domain.verified_at is not null
    );

  if v_domain.installation_id is not null then
    select *
    into v_install
    from public.installations i
    where i.id = v_domain.installation_id
      and i.installation_token_hash is not null
      and i.revoked_at is null;
  end if;

  v_install_ok := v_install.id is not null;
  v_install_id_ok := v_install_ok;

  select *
  into v_module
  from public.tenant_modules
  where tenant_id = v_customer.id
    and module_key = 'website_kompis'
  limit 1;

  if v_install.id is not null then
    select *
    into v_config
    from public.tenant_public_companion_install_config
    where tenant_id = v_customer.id
      and install_id = v_install.id
    limit 1;
  end if;

  v_active :=
    coalesce(v_module.licensed, false)
    and coalesce(v_module.enabled, false)
    and lower(coalesce(v_module.status, '')) = 'enabled'
    and coalesce((v_config.config ->> 'enabled')::boolean, false);

  if v_module.id is not null
    and lower(coalesce(v_module.status, '')) in ('suspended', 'revoked', 'disabled')
  then
    v_not_conflicting := false;
  end if;

  if v_active then
    v_not_conflicting := false;
  end if;

  v_prerequisite_ok :=
    v_agreement_ok
    and v_license_ok
    and v_product_ok
    and v_domain_ok
    and v_domain_verified
    and v_install_ok
    and v_install_id_ok
    and v_approval_ok;

  v_eligible := v_prerequisite_ok and v_not_conflicting and not v_active;

  v_activation_status := case
    when v_active then 'active'
    when not v_not_conflicting then 'suspended'
    when v_eligible then 'ready_for_activation'
    else 'not_ready'
  end;

  v_provisioning := public._platform_portal_derive_license_provisioning_status(
    v_license.domain_reference,
    v_install.id,
    v_install.status
  );

  v_reasons := jsonb_build_array(
    jsonb_build_object('code', 'agreement_active', 'satisfied', v_agreement_ok),
    jsonb_build_object('code', 'license_active', 'satisfied', v_license_ok),
    jsonb_build_object('code', 'license_product_supported', 'satisfied', v_product_ok),
    jsonb_build_object('code', 'domain_linked', 'satisfied', v_domain_ok),
    jsonb_build_object('code', 'domain_verified', 'satisfied', v_domain_verified),
    jsonb_build_object('code', 'installation_linked', 'satisfied', v_install_ok),
    jsonb_build_object('code', 'install_id_present', 'satisfied', v_install_id_ok),
    jsonb_build_object('code', 'approval_satisfied', 'satisfied', v_approval_ok),
    jsonb_build_object('code', 'activation_not_conflicting', 'satisfied', v_not_conflicting)
  );

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'eligible', v_eligible,
    'activation_status', v_activation_status,
    'active', v_active,
    'reasons', v_reasons,
    'agreement', jsonb_build_object(
      'eligible', v_agreement_ok,
      'status', v_subscription.status,
      'duration', v_duration
    ),
    'license', jsonb_build_object(
      'eligible', v_license_ok,
      'id', v_license.id,
      'status', v_license.license_status,
      'product_code', v_license.license_type,
      'provisioning_status', v_provisioning,
      'domain_reference', nullif(btrim(v_license.domain_reference), '')
    ),
    'domain', jsonb_build_object(
      'eligible', v_domain_ok and v_domain_verified,
      'id', v_domain.id,
      'hostname', v_domain.domain,
      'status', v_domain.status,
      'verified', v_domain_verified
    ),
    'installation', jsonb_build_object(
      'eligible', v_install_ok,
      'id', v_install.id,
      'install_id', v_install.id,
      'status', v_install.status
    ),
    'approval', jsonb_build_object(
      'required', false,
      'satisfied', true
    ),
    'existing_activation', jsonb_build_object(
      'id', v_module.id,
      'status', v_module.status,
      'activated_at', v_module.activated_at,
      'entitlement_enabled', coalesce(v_module.enabled, false),
      'config_enabled', coalesce((v_config.config ->> 'enabled')::boolean, false)
    )
  );
end;
$$;

revoke all on function public.get_platform_portal_customer_website_kompis_status(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_customer_website_kompis_status(uuid)
  to authenticated;

create or replace function public.activate_platform_portal_customer_website_kompis(
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
  v_install_id uuid;
  v_module public.tenant_modules;
  v_config public.tenant_public_companion_install_config;
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

  if v_key !~ '^wpk-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|' || v_reason || '|true');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_website_kompis_activate'
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

  v_status := public.get_platform_portal_customer_website_kompis_status(p_customer_id);
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
        'module_code', 'website_kompis',
        'status', coalesce(v_status -> 'existing_activation' ->> 'status', 'enabled'),
        'activated_at', v_status -> 'existing_activation' -> 'activated_at'
      ),
      'entitlement', jsonb_build_object(
        'id', v_status -> 'existing_activation' ->> 'id',
        'status', coalesce(v_status -> 'existing_activation' ->> 'status', 'enabled'),
        'created', false
      ),
      'license', (v_status -> 'license') || jsonb_build_object('provisioning_status', 'active'),
      'domain', jsonb_build_object(
        'id', v_status -> 'domain' ->> 'id',
        'hostname', v_status -> 'domain' ->> 'hostname'
      ),
      'installation', jsonb_build_object(
        'id', v_status -> 'installation' ->> 'id',
        'install_id', v_status -> 'installation' ->> 'install_id'
      )
    );
    return v_result;
  end if;

  if not coalesce((v_status ->> 'eligible')::boolean, false) then
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'agreement_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'COMMERCIAL_PLAN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'license_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      if (v_status -> 'license' ->> 'id') is null then
        raise exception 'LICENSE_REQUIRED' using errcode = 'P0001';
      end if;
      raise exception 'LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
    end if;
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'license_product_supported'
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
    end if;
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' in ('domain_linked', 'domain_verified')
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'DOMAIN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'installation_linked'
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'INSTALLATION_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1
      from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'install_id_present'
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'INSTALL_ID_REQUIRED' using errcode = 'P0001';
    end if;
    raise exception 'PREREQUISITES_NOT_MET' using errcode = 'P0001';
  end if;

  v_install_id := (v_status -> 'installation' ->> 'id')::uuid;
  if v_install_id is null then
    raise exception 'INSTALL_ID_REQUIRED' using errcode = 'P0001';
  end if;

  perform 1
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'website_kompis'
  for update;

  perform 1
  from public.tenant_public_companion_install_config
  where tenant_id = p_customer_id
    and install_id = v_install_id
  for update;

  select *
  into v_module
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'website_kompis'
  limit 1;

  if v_module.id is null then
    insert into public.tenant_modules (
      tenant_id,
      module_key,
      licensed,
      enabled,
      status,
      activated_at
    )
    values (
      p_customer_id,
      'website_kompis',
      true,
      true,
      'enabled',
      now()
    )
    returning * into v_module;
    v_created := true;
  else
    update public.tenant_modules
    set
      licensed = true,
      enabled = true,
      status = 'enabled',
      activated_at = coalesce(activated_at, now())
    where id = v_module.id
    returning * into v_module;
  end if;

  select *
  into v_config
  from public.tenant_public_companion_install_config
  where tenant_id = p_customer_id
    and install_id = v_install_id
  limit 1;

  if v_config.id is null then
    insert into public.tenant_public_companion_install_config (
      tenant_id,
      install_id,
      config,
      updated_by
    )
    values (
      p_customer_id,
      v_install_id,
      public._wpkf_sanitize_install_config_patch(jsonb_build_object('enabled', true)),
      auth.uid()
    )
    returning * into v_config;
    v_created := true;
  else
    update public.tenant_public_companion_install_config
    set
      config = public._wpkf_merge_install_config(
        config,
        jsonb_build_object('enabled', true)
      ),
      updated_at = now(),
      updated_by = auth.uid()
    where id = v_config.id
    returning * into v_config;
  end if;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'created', v_created,
    'idempotent_replay', false,
    'activation', jsonb_build_object(
      'id', v_module.id,
      'module_code', 'website_kompis',
      'status', v_module.status,
      'activated_at', v_module.activated_at
    ),
    'entitlement', jsonb_build_object(
      'id', v_module.id,
      'status', v_module.status,
      'created', v_created
    ),
    'license', jsonb_build_object(
      'id', v_status -> 'license' ->> 'id',
      'status', v_status -> 'license' ->> 'status',
      'provisioning_status', 'active'
    ),
    'domain', jsonb_build_object(
      'id', v_status -> 'domain' ->> 'id',
      'hostname', v_status -> 'domain' ->> 'hostname'
    ),
    'installation', jsonb_build_object(
      'id', v_status -> 'installation' ->> 'id',
      'install_id', v_status -> 'installation' ->> 'install_id'
    )
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_website_kompis_activate',
    'customer',
    p_customer_id::text,
    jsonb_build_object(
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'internal_reason', v_reason,
      'organization_id', p_customer_id,
      'module_key', 'website_kompis',
      'activation_id', v_module.id,
      'entitlement_id', v_module.id,
      'license_id', v_status -> 'license' ->> 'id',
      'domain_id', v_status -> 'domain' ->> 'id',
      'hostname', v_status -> 'domain' ->> 'hostname',
      'installation_id', v_install_id,
      'previous_activation_status', v_status ->> 'activation_status',
      'resulting_activation_status', 'active',
      'created', v_created,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.activate_platform_portal_customer_website_kompis(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.activate_platform_portal_customer_website_kompis(uuid, text, boolean, text)
  to authenticated;

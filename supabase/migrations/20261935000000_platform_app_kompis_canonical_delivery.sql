-- Platform Portal APP + Website Kompis Canonical Delivery V1.
-- Reuses aipify_billing_license_links (parent) + tenant_modules +
-- tenant_public_companion_install_config (child). No parallel model.
-- Auto-install = runtime-config sync. Acknowledgement = public install
-- config resolve + module + installation trust. No customer seeds.
-- No activation on apply. No customer-specific or pilot hardcoding.

create or replace function public._platform_portal_app_kompis_ack(
  p_tenant_id uuid,
  p_install_id uuid,
  p_domain text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_module public.tenant_modules;
  v_install public.installations;
  v_public jsonb;
  v_enabled boolean := false;
  v_ok boolean := false;
  v_licensed boolean := false;
  v_status_enabled boolean := false;
  v_token boolean := false;
  v_not_revoked boolean := false;
  v_status_active boolean := false;
  v_ack boolean := false;
begin
  if p_tenant_id is null or p_install_id is null then
    return jsonb_build_object(
      'ok', false,
      'enabled', false,
      'licensed', false,
      'status_enabled', false,
      'token_present', false,
      'not_revoked', false,
      'status_active', false,
      'checked_at', now()
    );
  end if;

  select * into v_module
  from public.tenant_modules
  where tenant_id = p_tenant_id
    and module_key = 'website_kompis'
  limit 1;

  select * into v_install
  from public.installations
  where id = p_install_id
  limit 1;

  v_licensed := coalesce(v_module.licensed, false);
  v_status_enabled :=
    coalesce(v_module.enabled, false)
    and lower(coalesce(v_module.status, '')) = 'enabled';
  v_token := v_install.id is not null and v_install.installation_token_hash is not null;
  v_not_revoked := v_install.id is not null and v_install.revoked_at is null;
  v_status_active :=
    v_install.id is not null
    and lower(coalesce(v_install.status, '')) = 'active';

  begin
    v_public := public.get_website_kompis_public_install_config(
      p_install_id,
      nullif(btrim(coalesce(p_domain, '')), '')
    );
  exception when others then
    v_public := jsonb_build_object('ok', false);
  end;

  v_ok := coalesce((v_public ->> 'ok')::boolean, false);
  v_enabled := coalesce(
    (v_public -> 'config' ->> 'enabled')::boolean,
    (v_public -> 'normalized_config' ->> 'enabled')::boolean,
    false
  );

  v_ack :=
    v_ok
    and v_enabled
    and v_licensed
    and v_status_enabled
    and v_token
    and v_not_revoked
    and v_status_active;

  return jsonb_build_object(
    'ok', v_ack,
    'enabled', v_enabled,
    'licensed', v_licensed,
    'status_enabled', v_status_enabled,
    'token_present', v_token,
    'not_revoked', v_not_revoked,
    'status_active', v_status_active,
    'public_ok', v_ok,
    'checked_at', now()
  );
end;
$$;

revoke all on function public._platform_portal_app_kompis_ack(uuid, uuid, text)
  from public, anon, authenticated;

create or replace function public.get_platform_portal_app_kompis_delivery_status(
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
  v_org public.organizations;
  v_subscription public.subscriptions;
  v_license public.aipify_billing_license_links;
  v_domain public.customer_domains;
  v_install public.installations;
  v_module public.tenant_modules;
  v_config public.tenant_public_companion_install_config;
  v_ack jsonb;
  v_reasons jsonb := '[]'::jsonb;
  v_agreement_ok boolean := false;
  v_license_ok boolean := false;
  v_product_ok boolean := false;
  v_panel_ok boolean := false;
  v_domain_ok boolean := false;
  v_domain_verified boolean := false;
  v_install_ok boolean := false;
  v_child_ok boolean := false;
  v_config_enabled boolean := false;
  v_active boolean := false;
  v_eligible boolean := false;
  v_blocked boolean := false;
  v_delivery_status text := 'not_started';
  v_duration text := null;
  v_provisioning text := null;
  v_last_attempt timestamptz := null;
  v_meta jsonb := '{}'::jsonb;
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

  select * into v_org from public.organizations where id = v_customer.id limit 1;
  v_panel_ok := v_org.id is not null;

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
      v_duration := coalesce(
        nullif(btrim(v_subscription.billing_cycle), ''),
        nullif(btrim(v_subscription.plan_type), '')
      );
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

  v_product_ok :=
    v_license.id is not null
    and lower(coalesce(v_license.license_type, '')) = 'app_subscription';
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
      (cd.verified_at is not null) desc,
      cd.created_at desc nulls last
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

  v_install_ok :=
    v_install.id is not null
    and lower(coalesce(v_install.status, '')) = 'active';

  select *
  into v_module
  from public.tenant_modules
  where tenant_id = v_customer.id
    and module_key = 'website_kompis'
  limit 1;

  v_meta := coalesce(v_module.metadata, '{}'::jsonb);

  if v_install.id is not null then
    select *
    into v_config
    from public.tenant_public_companion_install_config
    where tenant_id = v_customer.id
      and install_id = v_install.id
    limit 1;
  end if;

  v_config_enabled := coalesce((v_config.config ->> 'enabled')::boolean, false);
  v_child_ok :=
    v_module.id is not null
    and coalesce(v_module.licensed, false)
    and coalesce(v_module.enabled, false)
    and lower(coalesce(v_module.status, '')) = 'enabled'
    and v_config_enabled;

  v_provisioning := public._platform_portal_derive_license_provisioning_status(
    v_license.domain_reference,
    v_install.id,
    v_install.status
  );

  v_ack := public._platform_portal_app_kompis_ack(
    v_customer.id,
    v_install.id,
    coalesce(v_domain.domain, v_license.domain_reference)
  );

  v_active := coalesce((v_ack ->> 'ok')::boolean, false);

  select max(created_at)
  into v_last_attempt
  from public.platform_admin_audit_logs
  where action_type in (
      'platform_customer_app_kompis_deliver',
      'platform_customer_app_kompis_reconcile',
      'platform_customer_website_kompis_activate'
    )
    and (
      target_id::text = v_customer.id::text
      or metadata ->> 'customer_id' = v_customer.id::text
    );

  v_eligible :=
    v_agreement_ok
    and v_license_ok
    and v_product_ok
    and v_panel_ok
    and v_domain_ok
    and v_domain_verified
    and v_install_ok
    and not v_active;

  v_blocked :=
    not v_agreement_ok
    or not v_license_ok
    or not v_domain_ok
    or not v_domain_verified
    or not v_install_ok
    or (
      v_module.id is not null
      and lower(coalesce(v_module.status, '')) in ('suspended', 'revoked', 'disabled')
    );

  v_delivery_status := case
    when v_active then 'active'
    when v_module.id is not null
      and lower(coalesce(v_module.status, '')) in ('suspended', 'revoked')
      then case
        when lower(coalesce(v_module.status, '')) = 'revoked' then 'revoked'
        else 'suspended'
      end
    when v_child_ok and not v_active then 'awaiting_confirmation'
    when v_eligible then 'ready'
    when v_blocked then 'attention'
    when v_module.id is null and v_license.id is null then 'not_started'
    else 'checking_requirements'
  end;

  v_reasons := jsonb_build_array(
    jsonb_build_object('code', 'agreement_active', 'satisfied', v_agreement_ok),
    jsonb_build_object('code', 'parent_license_active', 'satisfied', v_license_ok),
    jsonb_build_object('code', 'parent_license_product_supported', 'satisfied', v_product_ok),
    jsonb_build_object('code', 'app_panel_resolvable', 'satisfied', v_panel_ok),
    jsonb_build_object('code', 'domain_linked', 'satisfied', v_domain_ok),
    jsonb_build_object('code', 'domain_verified', 'satisfied', v_domain_verified),
    jsonb_build_object('code', 'installation_linked', 'satisfied', v_install_ok),
    jsonb_build_object('code', 'install_trust_present', 'satisfied', v_install.id is not null and v_install.installation_token_hash is not null),
    jsonb_build_object('code', 'child_entitlement_ready', 'satisfied', v_child_ok),
    jsonb_build_object('code', 'acknowledgement_verified', 'satisfied', v_active)
  );

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'delivery_status', v_delivery_status,
    'eligible', v_eligible,
    'active', v_active,
    'blocked', v_blocked and not v_active,
    'reasons', v_reasons,
    'agreement', jsonb_build_object(
      'eligible', v_agreement_ok,
      'status', v_subscription.status,
      'duration', v_duration,
      'id', v_subscription.id
    ),
    'parent_license', jsonb_build_object(
      'eligible', v_license_ok,
      'id', v_license.id,
      'status', v_license.license_status,
      'product_code', v_license.license_type,
      'provisioning_status', v_provisioning,
      'domain_reference', nullif(btrim(v_license.domain_reference), '')
    ),
    'app_panel', jsonb_build_object(
      'eligible', v_panel_ok,
      'organization_id', v_org.id,
      'status', case when v_panel_ok then 'ready' else null end
    ),
    'child_entitlement', jsonb_build_object(
      'eligible', v_child_ok,
      'id', v_module.id,
      'module_key', 'website_kompis',
      'status', v_module.status,
      'licensed', coalesce(v_module.licensed, false),
      'enabled', coalesce(v_module.enabled, false),
      'delivery_model', coalesce(v_meta ->> 'delivery_model', null)
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
      'status', v_install.status,
      'token_present', v_install.id is not null and v_install.installation_token_hash is not null,
      'revoked', v_install.id is not null and v_install.revoked_at is not null,
      'active', v_install.id is not null and lower(coalesce(v_install.status, '')) = 'active'
    ),
    'auto_install', jsonb_build_object(
      'config_enabled', v_config_enabled,
      'synced', v_config.id is not null and v_config_enabled,
      'last_synced_at', v_config.updated_at
    ),
    'acknowledgement', v_ack,
    'existing_delivery', jsonb_build_object(
      'id', coalesce(v_meta ->> 'delivery_id', v_module.id::text),
      'status', case when v_active then 'active' else v_delivery_status end,
      'delivered_at', coalesce(
        nullif(v_meta ->> 'delivered_at', '')::timestamptz,
        v_module.activated_at
      )
    ),
    'last_checked_at', now(),
    'last_attempt_at', v_last_attempt
  );
end;
$$;

revoke all on function public.get_platform_portal_app_kompis_delivery_status(uuid)
  from public, anon;
grant execute on function public.get_platform_portal_app_kompis_delivery_status(uuid)
  to authenticated;

create or replace function public.deliver_platform_customer_app_and_website_kompis(
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
  v_license_id uuid;
  v_domain_hostname text;
  v_module public.tenant_modules;
  v_config public.tenant_public_companion_install_config;
  v_ack jsonb;
  v_result jsonb;
  v_reason_lower text;
  v_created boolean := false;
  v_delivery_id uuid := gen_random_uuid();
  v_delivery_status text;
  v_meta jsonb;
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

  if v_key !~ '^akd-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|' || v_reason || '|true|deliver');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_app_kompis_deliver'
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

  v_status := public.get_platform_portal_app_kompis_delivery_status(p_customer_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  if coalesce((v_status ->> 'active')::boolean, false) then
    v_result := jsonb_build_object(
      'customer_id', p_customer_id,
      'created', false,
      'idempotent_replay', false,
      'delivery_status', 'active',
      'delivery', jsonb_build_object(
        'id', v_status -> 'existing_delivery' ->> 'id',
        'status', 'active',
        'delivered_at', v_status -> 'existing_delivery' -> 'delivered_at'
      ),
      'parent_license', jsonb_build_object(
        'id', v_status -> 'parent_license' ->> 'id',
        'status', v_status -> 'parent_license' ->> 'status',
        'provisioning_status', 'active'
      ),
      'app_panel', jsonb_build_object(
        'organization_id', v_status -> 'app_panel' ->> 'organization_id',
        'status', v_status -> 'app_panel' ->> 'status'
      ),
      'child_entitlement', jsonb_build_object(
        'id', v_status -> 'child_entitlement' ->> 'id',
        'status', v_status -> 'child_entitlement' ->> 'status',
        'licensed', coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false),
        'enabled', coalesce((v_status -> 'child_entitlement' ->> 'enabled')::boolean, false)
      ),
      'domain', jsonb_build_object(
        'id', v_status -> 'domain' ->> 'id',
        'hostname', v_status -> 'domain' ->> 'hostname'
      ),
      'installation', jsonb_build_object(
        'id', v_status -> 'installation' ->> 'id',
        'install_id', v_status -> 'installation' ->> 'install_id'
      ),
      'auto_install', jsonb_build_object(
        'config_enabled', coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
      ),
      'acknowledgement', v_status -> 'acknowledgement'
    );

    perform public.record_platform_admin_audit_event(
      'platform_customer_app_kompis_deliver',
      'customer',
      p_customer_id,
      jsonb_build_object(
        'customer_id', p_customer_id,
        'organization_id', p_customer_id,
        'agreement_id', v_status -> 'agreement' ->> 'id',
        'parent_license_id', v_status -> 'parent_license' ->> 'id',
        'child_entitlement_id', v_status -> 'child_entitlement' ->> 'id',
        'domain', v_status -> 'domain' ->> 'hostname',
        'installation_id', v_status -> 'installation' ->> 'id',
        'delivery_id', v_status -> 'existing_delivery' ->> 'id',
        'previous_status', 'active',
        'resulting_status', 'active',
        'internal_reason', v_reason,
        'idempotency_key', v_key,
        'payload_hash', v_hash,
        'created', false,
        'reused', true,
        'reconciled', false,
        'already_active', true,
        'acknowledgement_status', 'verified',
        'result', v_result
      )
    );

    return v_result;
  end if;

  if not coalesce((v_status ->> 'eligible')::boolean, false)
     and not (
       coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false)
       and coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
     )
  then
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'agreement_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'COMMERCIAL_PLAN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'parent_license_active' and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      if (v_status -> 'parent_license' ->> 'id') is null then
        raise exception 'PARENT_LICENSE_REQUIRED' using errcode = 'P0001';
      end if;
      raise exception 'PARENT_LICENSE_NOT_ELIGIBLE' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' in ('domain_linked', 'domain_verified')
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'DOMAIN_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' in ('installation_linked', 'install_trust_present')
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'INSTALLATION_REQUIRED' using errcode = 'P0001';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(v_status -> 'reasons', '[]'::jsonb)) r
      where r ->> 'code' = 'app_panel_resolvable'
        and coalesce((r ->> 'satisfied')::boolean, false) = false
    ) then
      raise exception 'APP_PANEL_REQUIRED' using errcode = 'P0001';
    end if;
    raise exception 'PREREQUISITES_NOT_MET' using errcode = 'P0001';
  end if;

  v_install_id := (v_status -> 'installation' ->> 'id')::uuid;
  v_license_id := (v_status -> 'parent_license' ->> 'id')::uuid;
  v_domain_hostname := v_status -> 'domain' ->> 'hostname';

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

  select * into v_module
  from public.tenant_modules
  where tenant_id = p_customer_id
    and module_key = 'website_kompis'
  limit 1;

  v_meta := jsonb_build_object(
    'parent_license_id', v_license_id,
    'installation_id', v_install_id,
    'domain', v_domain_hostname,
    'app_panel_organization_id', p_customer_id,
    'delivery_model', 'canonical_v1',
    'delivery_id', v_delivery_id,
    'delivered_at', now()
  );

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
      'website_kompis',
      true,
      true,
      'enabled',
      now(),
      v_meta
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
      metadata = coalesce(metadata, '{}'::jsonb) || v_meta,
      updated_at = now()
    where id = v_module.id
    returning * into v_module;
  end if;

  select * into v_config
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
        coalesce(config, '{}'::jsonb),
        public._wpkf_sanitize_install_config_patch(jsonb_build_object('enabled', true))
      ),
      updated_by = auth.uid(),
      updated_at = now()
    where id = v_config.id
    returning * into v_config;
  end if;

  v_ack := public._platform_portal_app_kompis_ack(
    p_customer_id,
    v_install_id,
    v_domain_hostname
  );

  v_delivery_status := case
    when coalesce((v_ack ->> 'ok')::boolean, false) then 'active'
    else 'awaiting_confirmation'
  end;

  v_result := jsonb_build_object(
    'customer_id', p_customer_id,
    'created', v_created,
    'idempotent_replay', false,
    'delivery_status', v_delivery_status,
    'delivery', jsonb_build_object(
      'id', v_delivery_id,
      'status', v_delivery_status,
      'delivered_at', now()
    ),
    'parent_license', jsonb_build_object(
      'id', v_license_id,
      'status', v_status -> 'parent_license' ->> 'status',
      'provisioning_status', case
        when v_delivery_status = 'active' then 'active'
        else v_status -> 'parent_license' ->> 'provisioning_status'
      end
    ),
    'app_panel', jsonb_build_object(
      'organization_id', p_customer_id,
      'status', 'ready'
    ),
    'child_entitlement', jsonb_build_object(
      'id', v_module.id,
      'status', v_module.status,
      'licensed', coalesce(v_module.licensed, false),
      'enabled', coalesce(v_module.enabled, false)
    ),
    'domain', jsonb_build_object(
      'id', v_status -> 'domain' ->> 'id',
      'hostname', v_domain_hostname
    ),
    'installation', jsonb_build_object(
      'id', v_install_id,
      'install_id', v_install_id
    ),
    'auto_install', jsonb_build_object(
      'config_enabled', coalesce((v_config.config ->> 'enabled')::boolean, false)
    ),
    'acknowledgement', v_ack
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_app_kompis_deliver',
    'customer',
    p_customer_id,
    jsonb_build_object(
      'customer_id', p_customer_id,
      'organization_id', p_customer_id,
      'agreement_id', v_status -> 'agreement' ->> 'id',
      'parent_license_id', v_license_id,
      'child_entitlement_id', v_module.id,
      'app_panel_organization_id', p_customer_id,
      'domain', v_domain_hostname,
      'installation_id', v_install_id,
      'delivery_id', v_delivery_id,
      'install_command', 'runtime_config_sync',
      'previous_status', v_status ->> 'delivery_status',
      'resulting_status', v_delivery_status,
      'internal_reason', v_reason,
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'created', v_created,
      'reused', not v_created,
      'reconciled', false,
      'acknowledgement_status', case
        when coalesce((v_ack ->> 'ok')::boolean, false) then 'verified'
        else 'pending'
      end,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.deliver_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.deliver_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  to authenticated;

create or replace function public.reconcile_platform_customer_app_and_website_kompis(
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
  v_deliver jsonb;
  v_reason text := nullif(btrim(coalesce(p_internal_reason, '')), '');
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior jsonb;
  v_hash text;
  v_changes text[] := array[]::text[];
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

  if lower(v_reason) ~ '(sk-|rk_|bearer |password|secret|api[_-]?key|totp|mfa|authorization:)' then
    raise exception 'INVALID_INTERNAL_REASON' using errcode = 'P0001';
  end if;

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 or v_key !~ '^akd-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;

  v_hash := md5(p_customer_id::text || '|' || v_reason || '|true|reconcile');

  select metadata
  into v_prior
  from public.platform_admin_audit_logs
  where action_type = 'platform_customer_app_kompis_reconcile'
    and metadata ->> 'idempotency_key' = v_key
  order by created_at desc
  limit 1;

  if v_prior is not null then
    if coalesce(v_prior ->> 'payload_hash', '') <> v_hash then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return coalesce(v_prior -> 'result', '{}'::jsonb)
      || jsonb_build_object('idempotent_replay', true, 'created', false, 'reconciled', false);
  end if;

  v_status := public.get_platform_portal_app_kompis_delivery_status(p_customer_id);
  if v_status is null then
    raise exception 'CUSTOMER_NOT_FOUND' using errcode = 'P0001';
  end if;

  -- Already fully active with acknowledgement: adopt/verify without writes beyond audit.
  if coalesce((v_status ->> 'active')::boolean, false) then
    if coalesce(v_status -> 'child_entitlement' ->> 'delivery_model', '') is distinct from 'canonical_v1' then
      v_changes := array_append(v_changes, 'adopt_canonical_metadata');
      update public.tenant_modules
      set
        metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
          'parent_license_id', v_status -> 'parent_license' ->> 'id',
          'installation_id', v_status -> 'installation' ->> 'id',
          'domain', v_status -> 'domain' ->> 'hostname',
          'app_panel_organization_id', p_customer_id,
          'delivery_model', 'canonical_v1',
          'delivery_id', coalesce(metadata ->> 'delivery_id', gen_random_uuid()::text),
          'delivered_at', coalesce(metadata ->> 'delivered_at', now()::text),
          'reconciled_at', now()
        ),
        updated_at = now()
      where tenant_id = p_customer_id
        and module_key = 'website_kompis';
    end if;

    v_result := jsonb_build_object(
      'customer_id', p_customer_id,
      'created', false,
      'idempotent_replay', false,
      'reconciled', cardinality(v_changes) > 0,
      'changes', to_jsonb(v_changes),
      'delivery_status', 'active',
      'delivery', jsonb_build_object(
        'id', v_status -> 'existing_delivery' ->> 'id',
        'status', 'active',
        'delivered_at', v_status -> 'existing_delivery' -> 'delivered_at'
      ),
      'parent_license', jsonb_build_object(
        'id', v_status -> 'parent_license' ->> 'id',
        'status', v_status -> 'parent_license' ->> 'status',
        'provisioning_status', 'active'
      ),
      'app_panel', jsonb_build_object(
        'organization_id', v_status -> 'app_panel' ->> 'organization_id',
        'status', v_status -> 'app_panel' ->> 'status'
      ),
      'child_entitlement', jsonb_build_object(
        'id', v_status -> 'child_entitlement' ->> 'id',
        'status', v_status -> 'child_entitlement' ->> 'status',
        'licensed', coalesce((v_status -> 'child_entitlement' ->> 'licensed')::boolean, false),
        'enabled', coalesce((v_status -> 'child_entitlement' ->> 'enabled')::boolean, false)
      ),
      'domain', jsonb_build_object(
        'id', v_status -> 'domain' ->> 'id',
        'hostname', v_status -> 'domain' ->> 'hostname'
      ),
      'installation', jsonb_build_object(
        'id', v_status -> 'installation' ->> 'id',
        'install_id', v_status -> 'installation' ->> 'install_id'
      ),
      'auto_install', jsonb_build_object(
        'config_enabled', coalesce((v_status -> 'auto_install' ->> 'config_enabled')::boolean, false)
      ),
      'acknowledgement', v_status -> 'acknowledgement'
    );

    perform public.record_platform_admin_audit_event(
      'platform_customer_app_kompis_reconcile',
      'customer',
      p_customer_id,
      jsonb_build_object(
        'customer_id', p_customer_id,
        'organization_id', p_customer_id,
        'parent_license_id', v_status -> 'parent_license' ->> 'id',
        'child_entitlement_id', v_status -> 'child_entitlement' ->> 'id',
        'domain', v_status -> 'domain' ->> 'hostname',
        'installation_id', v_status -> 'installation' ->> 'id',
        'delivery_id', v_status -> 'existing_delivery' ->> 'id',
        'previous_status', v_status ->> 'delivery_status',
        'resulting_status', 'active',
        'internal_reason', v_reason,
        'idempotency_key', v_key,
        'payload_hash', v_hash,
        'created', false,
        'reused', true,
        'reconciled', cardinality(v_changes) > 0,
        'already_active', true,
        'acknowledgement_status', 'verified',
        'changes', to_jsonb(v_changes),
        'result', v_result
      )
    );

    return v_result;
  end if;

  -- Incomplete but prerequisites OK / partial state: reuse deliver path.
  v_deliver := public.deliver_platform_customer_app_and_website_kompis(
    p_customer_id,
    v_reason,
    true,
    v_key
  );

  v_result := v_deliver || jsonb_build_object(
    'reconciled', true,
    'changes', jsonb_build_array('canonical_delivery')
  );

  perform public.record_platform_admin_audit_event(
    'platform_customer_app_kompis_reconcile',
    'customer',
    p_customer_id,
    jsonb_build_object(
      'customer_id', p_customer_id,
      'organization_id', p_customer_id,
      'parent_license_id', v_deliver -> 'parent_license' ->> 'id',
      'child_entitlement_id', v_deliver -> 'child_entitlement' ->> 'id',
      'domain', v_deliver -> 'domain' ->> 'hostname',
      'installation_id', v_deliver -> 'installation' ->> 'id',
      'delivery_id', v_deliver -> 'delivery' ->> 'id',
      'previous_status', v_status ->> 'delivery_status',
      'resulting_status', v_deliver ->> 'delivery_status',
      'internal_reason', v_reason,
      'idempotency_key', v_key,
      'payload_hash', v_hash,
      'created', coalesce((v_deliver ->> 'created')::boolean, false),
      'reused', not coalesce((v_deliver ->> 'created')::boolean, false),
      'reconciled', true,
      'acknowledgement_status', case
        when coalesce((v_deliver -> 'acknowledgement' ->> 'ok')::boolean, false) then 'verified'
        else 'pending'
      end,
      'result', v_result
    )
  );

  return v_result;
end;
$$;

revoke all on function public.reconcile_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  from public, anon;
grant execute on function public.reconcile_platform_customer_app_and_website_kompis(uuid, text, boolean, text)
  to authenticated;

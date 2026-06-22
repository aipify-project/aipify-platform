-- Unonight live read-only connection foundation — real credential vault, HTTP verification gate, pilot source activation.

insert into public.app_portal_integration_providers (
  provider_key,
  display_name,
  category,
  setup_type,
  oauth_available,
  default_permission_level,
  recommended_scopes,
  sort_order
) values (
  'unonight',
  'Unonight',
  'pilot',
  'manual',
  false,
  'read_only',
  '["metadata.read","organization.read","integration.status.read"]'::jsonb,
  5
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = excluded.category,
  setup_type = excluded.setup_type,
  oauth_available = excluded.oauth_available,
  default_permission_level = excluded.default_permission_level,
  recommended_scopes = excluded.recommended_scopes,
  sort_order = excluded.sort_order,
  is_available = true;

create or replace function public._un629_company_organization_id(p_company_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.customers c
  where c.company_id = p_company_id
  limit 1;
$$;

create or replace function public._apsf260i_store_credential(
  p_company_id uuid,
  p_connection_id uuid,
  p_secret text,
  p_pre_encrypted boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_vault_id uuid;
  v_key text;
  v_payload text;
begin
  if coalesce(length(trim(p_secret)), 0) < 8 then
    raise exception 'Credential required';
  end if;

  if lower(trim(p_secret)) in ('unonight-pilot-token', 'unonight-pilot-secret-placeholder') then
    raise exception 'Placeholder credentials are not allowed';
  end if;

  v_key := 'app_portal_' || encode(extensions.digest(p_secret || p_connection_id::text, 'sha256'), 'hex');
  v_payload := case
    when p_pre_encrypted then trim(p_secret)
    else encode(extensions.digest(p_secret, 'sha256'), 'hex')
  end;

  update public.app_portal_integration_credential_vault
  set revoked_at = now(), rotated_at = now()
  where connection_id = p_connection_id
    and company_id = p_company_id
    and revoked_at is null;

  insert into public.app_portal_integration_credential_vault (
    company_id, connection_id, vault_key, encrypted_payload
  ) values (
    p_company_id,
    p_connection_id,
    v_key,
    v_payload
  )
  returning id into v_vault_id;

  update public.app_portal_integration_connections
  set
    credentials_reference = v_vault_id,
    masked_credential_hint = case
      when p_pre_encrypted then 'vault••••'
      else public._apsf260i_mask_secret(p_secret)
    end,
    updated_at = now()
  where id = p_connection_id and company_id = p_company_id;

  return v_vault_id;
end;
$$;

create or replace function public.save_app_portal_integration_connection(
  p_provider_key text,
  p_setup_type text,
  p_permission_level text,
  p_approved_scopes jsonb,
  p_api_key text default null,
  p_access_summary jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_connection_id uuid;
  v_level text := coalesce(nullif(trim(p_permission_level), ''), 'read_only');
  v_summary jsonb := coalesce(p_access_summary, '{}'::jsonb);
  v_org_id uuid;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_level <> 'read_only' and v_level <> 'read_write' then
    raise exception 'Invalid permission level';
  end if;

  if p_setup_type = 'manual' and coalesce(length(trim(p_api_key)), 0) < 8 then
    raise exception 'API key required for manual setup';
  end if;

  if p_provider_key = 'unonight' then
    v_org_id := public._un629_company_organization_id(v_company_id);
    v_summary := v_summary || jsonb_build_object(
      'provider', 'unonight',
      'requested_scopes', coalesce(p_approved_scopes, '[]'::jsonb),
      'expected_organization_id', v_org_id::text
    );
  end if;

  insert into public.app_portal_integration_connections (
    company_id, provider_key, setup_type, status, permission_level,
    approved_scopes, access_summary, created_by
  ) values (
    v_company_id, p_provider_key, p_setup_type, 'pending', v_level,
    coalesce(p_approved_scopes, '[]'::jsonb), v_summary, v_user_id
  )
  on conflict (company_id, provider_key) do update set
    setup_type = excluded.setup_type,
    permission_level = excluded.permission_level,
    approved_scopes = excluded.approved_scopes,
    access_summary = excluded.access_summary,
    status = 'pending',
    last_test_success_at = null,
    last_test_failed_at = null,
    last_test_error = null,
    updated_at = now()
  returning id into v_connection_id;

  if p_setup_type = 'manual' and p_api_key is not null then
    perform public._apsf260i_store_credential(v_company_id, v_connection_id, p_api_key, true);
  end if;

  perform public._apsf260i_log(
    v_company_id, v_connection_id, 'create', v_user_id,
    jsonb_build_object(
      'provider_key', p_provider_key,
      'setup_type', p_setup_type,
      'permission_level', v_level,
      'read_only', v_level = 'read_only'
    )
  );

  return jsonb_build_object(
    'connection_id', v_connection_id,
    'status', 'pending',
    'masked_credential_hint', (
      select masked_credential_hint from public.app_portal_integration_connections where id = v_connection_id
    )
  );
end;
$$;

create or replace function public.get_app_portal_integration_test_material(p_connection_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_connection public.app_portal_integration_connections;
  v_payload text;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  select v.encrypted_payload into v_payload
  from public.app_portal_integration_credential_vault v
  where v.connection_id = v_connection.id
    and v.company_id = v_company_id
    and v.revoked_at is null
  order by v.created_at desc
  limit 1;

  return jsonb_build_object(
    'provider_key', v_connection.provider_key,
    'company_id', v_company_id,
    'encrypted_payload', v_payload,
    'access_summary', v_connection.access_summary,
    'approved_scopes', v_connection.approved_scopes,
    'expected_organization_id', v_connection.access_summary->>'expected_organization_id'
  );
end;
$$;

create or replace function public._un629_activate_unonight_platform_api(
  p_organization_id uuid,
  p_verification jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_organization_id is null then
    return;
  end if;

  if coalesce(p_verification->>'connected', 'false') <> 'true' then
    return;
  end if;

  if coalesce(p_verification->>'access_mode', '') <> 'read_only' then
    return;
  end if;

  perform public._un621_ensure_settings(p_organization_id);

  update public.pilot_data_sources
  set
    allowed = true,
    sync_status = 'idle',
    last_error = null,
    updated_at = now()
  where organization_id = p_organization_id
    and source_key = 'unonight_platform_api';

  update public.organization_integrations
  set
    enabled = true,
    status = 'active',
    configuration = configuration || jsonb_build_object(
      'live_connection_verified', true,
      'last_verification', p_verification,
      'access_mode', 'read_only'
    ),
    last_error = null,
    updated_at = now()
  where organization_id = p_organization_id
    and integration_key = 'unonight';
end;
$$;

create or replace function public.record_app_portal_integration_test_result(
  p_connection_id uuid,
  p_success boolean,
  p_error_code text default null,
  p_customer_message_key text default null,
  p_technical_reason text default null,
  p_verification jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_connection public.app_portal_integration_connections;
  v_org_id uuid;
  v_now timestamptz := now();
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  if p_success then
    update public.app_portal_integration_connections
    set
      status = 'connected',
      last_test_success_at = v_now,
      last_test_failed_at = null,
      last_test_error = null,
      access_summary = access_summary || jsonb_build_object(
        'last_verification', coalesce(p_verification, '{}'::jsonb),
        'last_verified_at', v_now
      ),
      updated_at = v_now
    where id = p_connection_id;

    perform public._apsf260i_log(
      v_company_id,
      p_connection_id,
      'test_success',
      v_user_id,
      jsonb_build_object('provider_key', v_connection.provider_key, 'live_http', true)
    );

    if v_connection.provider_key = 'unonight' then
      v_org_id := public._un629_company_organization_id(v_company_id);
      perform public._un629_activate_unonight_platform_api(v_org_id, p_verification);
      perform public._ige_log(
        v_org_id,
        'integration_connected',
        'integration',
        null,
        jsonb_build_object(
          'integration_key', 'unonight',
          'live_connection_verified', true,
          'access_mode', 'read_only'
        )
      );
    end if;

    return jsonb_build_object(
      'success', true,
      'status', 'connected',
      'verification', p_verification
    );
  end if;

  update public.app_portal_integration_connections
  set
    status = 'failed',
    last_test_failed_at = v_now,
    last_test_error = coalesce(p_customer_message_key, p_error_code, 'connection_failed'),
    access_summary = access_summary || jsonb_build_object(
      'last_verification_error', jsonb_build_object(
        'code', p_error_code,
        'message_key', p_customer_message_key,
        'technical_reason', left(coalesce(p_technical_reason, ''), 500),
        'at', v_now
      )
    ),
    updated_at = v_now
  where id = p_connection_id;

  if v_connection.provider_key = 'unonight' then
    v_org_id := public._un629_company_organization_id(v_company_id);
    perform public._un621_ensure_settings(v_org_id);
    update public.pilot_data_sources
    set allowed = false, last_error = left(coalesce(p_technical_reason, p_error_code), 500), updated_at = v_now
    where organization_id = v_org_id and source_key = 'unonight_platform_api';
  end if;

  perform public._apsf260i_log(
    v_company_id,
    p_connection_id,
    'test_failed',
    v_user_id,
    jsonb_build_object(
      'provider_key', v_connection.provider_key,
      'error_code', p_error_code,
      'technical_reason', left(coalesce(p_technical_reason, ''), 500)
    )
  );

  return jsonb_build_object(
    'success', false,
    'status', 'failed',
    'error_code', p_error_code,
    'message_key', p_customer_message_key
  );
end;
$$;

create or replace function public.test_app_portal_integration_connection(p_connection_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_connection public.app_portal_integration_connections;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  if v_connection.provider_key = 'unonight' then
    return jsonb_build_object(
      'success', false,
      'status', 'pending',
      'requires_live_http', true,
      'message', 'Unonight requires server-side live connection test'
    );
  end if;

  if v_connection.credentials_reference is null and v_connection.setup_type <> 'oauth' then
    update public.app_portal_integration_connections
    set status = 'failed', last_test_failed_at = now(), last_test_error = 'Missing credentials', updated_at = now()
    where id = p_connection_id;
    return jsonb_build_object('success', false, 'status', 'failed');
  end if;

  update public.app_portal_integration_connections
  set status = 'connected', last_test_success_at = now(), last_test_failed_at = null, last_test_error = null, updated_at = now()
  where id = p_connection_id;

  return jsonb_build_object('success', true, 'status', 'connected');
end;
$$;

create or replace function public._ige_store_credentials(
  p_organization_id uuid,
  p_integration_id uuid,
  p_secret text,
  p_pre_encrypted boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_vault_id uuid;
  v_key text;
  v_payload text;
begin
  if lower(trim(p_secret)) in ('unonight-pilot-token', 'unonight-pilot-secret-placeholder') then
    raise exception 'Placeholder credentials are not allowed';
  end if;

  v_key := 'vault_' || encode(extensions.digest(p_secret || p_integration_id::text, 'sha256'), 'hex');
  v_payload := case
    when p_pre_encrypted then trim(p_secret)
    else encode(extensions.digest(p_secret, 'sha256'), 'hex')
  end;

  insert into public.integration_credential_vault (
    organization_id, integration_id, vault_key, encrypted_payload
  ) values (
    p_organization_id, p_integration_id, v_key, v_payload
  )
  returning id into v_vault_id;

  update public.organization_integrations
  set credentials_reference = v_vault_id, updated_at = now()
  where id = p_integration_id;

  return v_vault_id;
end;
$$;

create or replace function public._ige_seed_demo_integrations(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_integrations (
    organization_id, integration_key, integration_name, status, enabled, configuration, last_sync_at
  )
  select p_organization_id, c.integration_key, c.integration_name, v.status, v.enabled, v.config, v.synced
  from public.integration_catalog c
  join (values
    ('unonight', 'pending', false, '{"pilot":true,"live_connection_required":true}'::jsonb, null),
    ('email_provider', 'active', true, '{"provider":"smtp","from_address":"support@example.com"}'::jsonb, now() - interval '3 hours'),
    ('knowledge_center_import', 'pending', false, '{"import_format":"markdown"}'::jsonb, null)
  ) as v(key, status, enabled, config, synced) on c.integration_key = v.key
  where c.is_available and not c.is_future
    and not exists (
      select 1 from public.organization_integrations i
      where i.organization_id = p_organization_id and i.integration_key = c.integration_key
    );
end;
$$;

create or replace function public.rotate_integration_credentials(
  p_integration_id uuid,
  p_new_secret text,
  p_pre_encrypted boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_vault_id uuid;
begin
  perform public._irp_require_permission('integrations.update');
  v_org_id := public._mta_require_organization();

  update public.integration_credential_vault
  set revoked_at = now()
  where integration_id = p_integration_id and organization_id = v_org_id and revoked_at is null;

  v_vault_id := public._ige_store_credentials(v_org_id, p_integration_id, p_new_secret, p_pre_encrypted);

  update public.integration_credential_vault set rotated_at = now() where id = v_vault_id;

  perform public._ige_log(v_org_id, 'integration_credential_rotated', 'integration', p_integration_id,
    jsonb_build_object('vault_id', v_vault_id));

  return jsonb_build_object('integration_id', p_integration_id, 'credentials_reference', v_vault_id);
end;
$$;

create or replace function public.connect_unonight_integration(
  p_configuration jsonb default '{}'::jsonb,
  p_secret text default null,
  p_pre_encrypted boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_result jsonb;
  v_id uuid;
begin
  perform public._irp_require_permission('integrations.create');
  v_org_id := public._mta_require_organization();

  if p_secret is null or length(trim(p_secret)) < 8 then
    raise exception 'Unonight read-only connection key required';
  end if;

  select id into v_id
  from public.organization_integrations
  where organization_id = v_org_id and integration_key = 'unonight';

  if v_id is null then
    v_result := public.create_organization_integration(
      'unonight',
      coalesce(p_configuration, '{}'::jsonb) || jsonb_build_object(
        'pilot', true,
        'live_connection_required', true,
        'access_mode', 'read_only'
      ),
      p_secret
    );
    v_id := (v_result->>'id')::uuid;
    if p_pre_encrypted then
      update public.integration_credential_vault
      set encrypted_payload = trim(p_secret)
      where integration_id = v_id and organization_id = v_org_id and revoked_at is null;
    end if;
  else
    perform public.rotate_integration_credentials(v_id, p_secret, p_pre_encrypted);
  end if;

  update public.organization_integrations set
    enabled = false,
    status = 'pending',
    configuration = configuration || coalesce(p_configuration, '{}'::jsonb) || jsonb_build_object(
      'pilot', true,
      'live_connection_required', true,
      'access_mode', 'read_only'
    ),
    updated_at = now()
  where id = v_id;

  perform public._un621_ensure_settings(v_org_id);
  update public.pilot_data_sources
  set allowed = false, last_error = 'Awaiting live read-only connection test', updated_at = now()
  where organization_id = v_org_id and source_key = 'unonight_platform_api';

  perform public._ige_log(v_org_id, 'integration_created', 'integration', v_id,
    jsonb_build_object('integration_key', 'unonight', 'pilot', true, 'live_connection_required', true));

  return jsonb_build_object(
    'id', v_id,
    'integration_key', 'unonight',
    'status', 'pending',
    'enabled', false,
    'requires_live_test', true
  );
end;
$$;

create or replace function public.sync_organization_integration(p_integration_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_int public.organization_integrations;
  v_log_id uuid;
  v_verified boolean := false;
begin
  perform public._irp_require_permission('integrations.sync');
  v_org_id := public._mta_require_organization();

  select * into v_int
  from public.organization_integrations
  where id = p_integration_id and organization_id = v_org_id;

  if v_int.id is null then
    raise exception 'Integration not found';
  end if;

  if not v_int.enabled and v_int.status <> 'pending' then
    raise exception 'Integration is disabled';
  end if;

  insert into public.integration_sync_logs (organization_id, integration_id, sync_type, status)
  values (v_org_id, p_integration_id, 'manual', 'running')
  returning id into v_log_id;

  if v_int.integration_key = 'unonight' then
    v_verified := coalesce((v_int.configuration->>'live_connection_verified')::boolean, false);
    perform public.record_integration_sync_result(
      v_log_id,
      case when v_verified then 'completed' else 'failed' end,
      0,
      case when v_verified then null else 'Unonight live read-only connection not verified' end
    );
    return jsonb_build_object(
      'sync_log_id', v_log_id,
      'status', case when v_verified then 'completed' else 'failed' end,
      'integration_key', v_int.integration_key,
      'requires_live_connection', not v_verified
    );
  end if;

  perform public.record_integration_sync_result(
    v_log_id,
    case when v_int.integration_key in ('email_provider', 'knowledge_center_import') then 'completed' else 'failed' end,
    case when v_int.integration_key in ('email_provider', 'knowledge_center_import') then 0 else 0 end,
    case when v_int.integration_key in ('email_provider', 'knowledge_center_import') then null else 'Sync provider unavailable' end
  );

  return jsonb_build_object(
    'sync_log_id', v_log_id,
    'status', case when v_int.integration_key in ('email_provider', 'knowledge_center_import') then 'completed' else 'failed' end,
    'integration_key', v_int.integration_key
  );
end;
$$;

revoke all on function public._un629_company_organization_id(uuid) from public, anon;
revoke all on function public._un629_activate_unonight_platform_api(uuid, jsonb) from public, anon;
revoke all on function public.get_app_portal_integration_test_material(uuid) from public, anon;
revoke all on function public.record_app_portal_integration_test_result(uuid, boolean, text, text, text, jsonb) from public, anon;

grant execute on function public.get_app_portal_integration_test_material(uuid) to authenticated;
grant execute on function public.record_app_portal_integration_test_result(uuid, boolean, text, text, text, jsonb) to authenticated;
grant execute on function public.connect_unonight_integration(jsonb, text, boolean) to authenticated;

create or replace function public.record_unonight_integration_verification(p_verification jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_int_id uuid;
begin
  perform public._irp_require_permission('integrations.update');
  v_org_id := public._mta_require_organization();

  select id into v_int_id
  from public.organization_integrations
  where organization_id = v_org_id and integration_key = 'unonight'
  limit 1;

  if v_int_id is null then
    raise exception 'Unonight integration not configured';
  end if;

  if coalesce(p_verification->>'connected', 'false') <> 'true' then
    raise exception 'Verification contract invalid';
  end if;

  perform public._un629_activate_unonight_platform_api(v_org_id, p_verification);

  update public.organization_integrations
  set
    enabled = true,
    status = 'active',
    configuration = configuration || jsonb_build_object(
      'live_connection_verified', true,
      'last_verification', p_verification,
      'last_verified_at', now()
    ),
    last_error = null,
    updated_at = now()
  where id = v_int_id;

  perform public._ige_log(
    v_org_id,
    'integration_connected',
    'integration',
    v_int_id,
    jsonb_build_object('integration_key', 'unonight', 'live_connection_verified', true)
  );

  return jsonb_build_object(
    'success', true,
    'integration_id', v_int_id,
    'status', 'active',
    'verification', p_verification
  );
end;
$$;

grant execute on function public.record_unonight_integration_verification(jsonb) to authenticated;

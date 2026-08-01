-- AIPIFY.PLATFORM.CORE.APP.INTEGRATION.SECRET.STREAM.V1
-- Authoritative secret stream: Platform → Core → APP.
-- Adds rotation_required status, vault metadata, decrypt-failure status repair.
-- No plaintext. No external HTTP. No auto-activation.

-- ---------------------------------------------------------------------------
-- Schema: vault metadata + expanded status
-- ---------------------------------------------------------------------------

alter table public.app_portal_integration_credential_vault
  add column if not exists encryption_key_fingerprint text,
  add column if not exists envelope_version int not null default 1;

alter table public.app_portal_integration_connections
  drop constraint if exists app_portal_integration_connections_status_check;

alter table public.app_portal_integration_connections
  add constraint app_portal_integration_connections_status_check
  check (status in (
    'pending', 'connected', 'verified', 'active', 'inactive', 'failed',
    'revoked', 'rotation_required'
  ));

create index if not exists app_portal_integration_vault_connection_active_idx
  on public.app_portal_integration_credential_vault (company_id, connection_id)
  where revoked_at is null;

-- ---------------------------------------------------------------------------
-- Status helpers
-- ---------------------------------------------------------------------------

create or replace function public._apsf260i_is_rotation_required_error(p_error text)
returns boolean
language sql
immutable
as $$
  select coalesce(
    lower(coalesce(p_error, '')) ~ '(rotation_required|secret_decrypt|credentialunavailable|credential_unavailable|decrypt)',
    false
  );
$$;

-- Keep the existing 7-arg signature (no DROP) so dependent RPCs stay valid.
create or replace function public._apsf260i_compute_canonical_status(
  p_status text,
  p_has_credential boolean,
  p_last_test_success_at timestamptz,
  p_last_test_failed_at timestamptz,
  p_activated_at timestamptz,
  p_deactivated_at timestamptz,
  p_removed_at timestamptz
)
returns text
language plpgsql
immutable
as $$
declare
  v_status text := lower(coalesce(nullif(trim(p_status), ''), 'pending'));
  v_test_failed_newer boolean := false;
begin
  if p_removed_at is not null then
    return 'removed';
  end if;

  if v_status = 'revoked' then
    return 'revoked';
  end if;

  if v_status = 'rotation_required' then
    return 'rotation_required';
  end if;

  if p_last_test_failed_at is not null then
    if p_last_test_success_at is null then
      v_test_failed_newer := true;
    elsif p_last_test_failed_at > p_last_test_success_at then
      v_test_failed_newer := true;
    end if;
  end if;

  if v_test_failed_newer then
    return 'verification_failed';
  end if;

  if v_status in ('failed', 'error', 'disconnected') and p_last_test_success_at is null then
    return 'verification_failed';
  end if;

  if v_status = 'pending' or v_status = '' then
    if p_has_credential and p_last_test_success_at is null then
      return 'credential_saved';
    end if;
    if not p_has_credential then
      return 'not_configured';
    end if;
    return 'verification_pending';
  end if;

  if v_status = 'inactive'
     or (p_deactivated_at is not null and (p_activated_at is null or p_deactivated_at >= p_activated_at)) then
    return 'inactive';
  end if;

  -- Never present as active when a newer decrypt/rotation failure exists.
  if v_status = 'active'
     or (p_activated_at is not null and (p_deactivated_at is null or p_activated_at > p_deactivated_at)) then
    return 'active';
  end if;

  if p_last_test_success_at is not null or v_status in ('connected', 'verified') then
    return 'verified';
  end if;

  return 'verification_pending';
end;
$$;

create or replace function public._apsf260i_connection_json(p_connection public.app_portal_integration_connections)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  v_has_credential boolean;
  v_canonical text;
  v_verified_at timestamptz;
  v_fingerprint text;
begin
  v_has_credential :=
    p_connection.credentials_reference is not null
    or nullif(trim(coalesce(p_connection.masked_credential_hint, '')), '') is not null;

  v_canonical := public._apsf260i_compute_canonical_status(
    p_connection.status,
    v_has_credential,
    p_connection.last_test_success_at,
    p_connection.last_test_failed_at,
    p_connection.activated_at,
    p_connection.deactivated_at,
    p_connection.removed_at
  );

  if v_canonical = 'verification_failed'
     and public._apsf260i_is_rotation_required_error(p_connection.last_test_error) then
    v_canonical := 'rotation_required';
  end if;

  v_verified_at := coalesce(
    nullif(p_connection.access_summary->>'last_verified_at', '')::timestamptz,
    p_connection.last_test_success_at
  );

  select v.encryption_key_fingerprint
  into v_fingerprint
  from public.app_portal_integration_credential_vault v
  where v.id = p_connection.credentials_reference
    and v.company_id = p_connection.company_id
    and v.revoked_at is null
  limit 1;

  return jsonb_build_object(
    'id', p_connection.id,
    'provider_key', p_connection.provider_key,
    'setup_type', p_connection.setup_type,
    'status', p_connection.status,
    'canonical_status', v_canonical,
    'permission_level', p_connection.permission_level,
    'approved_scopes', p_connection.approved_scopes,
    'masked_credential_hint', p_connection.masked_credential_hint,
    'credentials_reference', p_connection.credentials_reference,
    'encryption_key_fingerprint', coalesce(
      v_fingerprint,
      nullif(p_connection.access_summary->>'encryption_key_fingerprint', '')
    ),
    'last_test_success_at', p_connection.last_test_success_at,
    'last_test_failed_at', p_connection.last_test_failed_at,
    'last_test_error', p_connection.last_test_error,
    'activated_at', p_connection.activated_at,
    'deactivated_at', p_connection.deactivated_at,
    'removed_at', p_connection.removed_at,
    'updated_at', p_connection.updated_at,
    'access_summary', p_connection.access_summary,
    'last_verified_at', v_verified_at
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Credential store: keep existing 4-arg signature; fingerprint from access_summary
-- ---------------------------------------------------------------------------

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
  v_fingerprint text;
  v_envelope int := 1;
begin
  if coalesce(length(trim(p_secret)), 0) < 8 then
    raise exception 'Credential required';
  end if;

  if lower(trim(p_secret)) in ('unonight-pilot-token', 'unonight-pilot-secret-placeholder') then
    raise exception 'Placeholder credentials are not allowed';
  end if;

  select
    nullif(trim(coalesce(c.access_summary->>'encryption_key_fingerprint', '')), ''),
    coalesce(nullif(trim(coalesce(c.access_summary->>'envelope_version', '')), '')::int, 1)
  into v_fingerprint, v_envelope
  from public.app_portal_integration_connections c
  where c.id = p_connection_id
    and c.company_id = p_company_id;

  if p_pre_encrypted is not true then
    v_payload := encode(extensions.digest(p_secret, 'sha256'), 'hex');
  else
    v_payload := trim(p_secret);
  end if;

  v_key := 'app_portal_' || encode(extensions.digest(v_payload || p_connection_id::text, 'sha256'), 'hex');

  update public.app_portal_integration_credential_vault
  set revoked_at = now(), rotated_at = now()
  where connection_id = p_connection_id
    and company_id = p_company_id
    and revoked_at is null;

  insert into public.app_portal_integration_credential_vault (
    company_id, connection_id, vault_key, encrypted_payload,
    encryption_key_fingerprint, envelope_version, key_version
  ) values (
    p_company_id,
    p_connection_id,
    v_key,
    v_payload,
    v_fingerprint,
    v_envelope,
    1
  )
  returning id into v_vault_id;

  update public.app_portal_integration_connections
  set
    credentials_reference = v_vault_id,
    masked_credential_hint = case
      when p_pre_encrypted then 'vault••••'
      else public._apsf260i_mask_secret(p_secret)
    end,
    status = case
      when status in ('active', 'connected', 'verified', 'failed', 'rotation_required') then 'pending'
      else status
    end,
    updated_at = now()
  where id = p_connection_id and company_id = p_company_id;

  return v_vault_id;
end;
$$;

revoke all on function public._apsf260i_store_credential(uuid, uuid, text, boolean) from public, anon;
revoke all on function public._apsf260i_store_credential(uuid, uuid, text) from public, anon;

-- ---------------------------------------------------------------------------
-- Save: encrypt envelope metadata from access_summary; safe return shape
-- ---------------------------------------------------------------------------

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
  v_has_active_credential boolean := false;
  v_api_key text := nullif(trim(p_api_key), '');
  v_fingerprint text := nullif(trim(coalesce(v_summary->>'encryption_key_fingerprint', '')), '');
  v_envelope int := nullif(trim(coalesce(v_summary->>'envelope_version', '')), '')::int;
  v_hint text;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_level <> 'read_only' and v_level <> 'read_write' then
    raise exception 'Invalid permission level';
  end if;

  select exists (
    select 1
    from public.app_portal_integration_connections c
    join public.app_portal_integration_credential_vault v
      on v.connection_id = c.id
     and v.company_id = c.company_id
     and v.revoked_at is null
    where c.company_id = v_company_id
      and c.provider_key = p_provider_key
      and c.removed_at is null
  ) into v_has_active_credential;

  if p_setup_type = 'manual'
     and coalesce(length(v_api_key), 0) < 8
     and not v_has_active_credential then
    raise exception 'API key required for manual setup';
  end if;

  if p_provider_key = 'unonight' then
    v_org_id := public._un629_company_organization_id(v_company_id);
    v_summary := v_summary || jsonb_build_object(
      'provider', 'unonight',
      'base_url', public._una631_validate_base_url(v_summary->>'base_url'),
      'requested_scopes', coalesce(p_approved_scopes, '[]'::jsonb),
      'expected_organization_id', v_org_id::text
    );
  end if;

  select c.id
  into v_connection_id
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id
    and c.provider_key = p_provider_key
    and c.removed_at is null
  limit 1;

  if v_connection_id is null then
    insert into public.app_portal_integration_connections (
      company_id, provider_key, setup_type, status, permission_level,
      approved_scopes, access_summary, created_by
    ) values (
      v_company_id, p_provider_key, p_setup_type, 'pending', v_level,
      coalesce(p_approved_scopes, '[]'::jsonb), v_summary, v_user_id
    )
    returning id into v_connection_id;
  else
    update public.app_portal_integration_connections
    set
      setup_type = p_setup_type,
      permission_level = v_level,
      approved_scopes = coalesce(p_approved_scopes, '[]'::jsonb),
      access_summary = v_summary,
      status = 'pending',
      last_test_success_at = null,
      last_test_failed_at = null,
      last_test_error = null,
      updated_at = now()
    where id = v_connection_id;
  end if;

  if p_setup_type = 'manual' and v_api_key is not null then
    perform public._apsf260i_store_credential(
      v_company_id,
      v_connection_id,
      v_api_key,
      true
    );
  end if;

  perform public._apsf260i_log(
    v_company_id, v_connection_id, 'create', v_user_id,
    jsonb_build_object(
      'provider_key', p_provider_key,
      'setup_type', p_setup_type,
      'permission_level', v_level,
      'read_only', v_level = 'read_only',
      'stored', v_api_key is not null or v_has_active_credential,
      'encryption_key_fingerprint', v_fingerprint,
      'base_url', case when p_provider_key = 'unonight' then v_summary->>'base_url' else null end
    )
  );

  select masked_credential_hint into v_hint
  from public.app_portal_integration_connections
  where id = v_connection_id;

  return jsonb_build_object(
    'connection_id', v_connection_id,
    'status', 'pending',
    'stored', v_api_key is not null or v_has_active_credential,
    'fingerprint', v_fingerprint,
    'envelope_version', v_envelope,
    'updated_at', now(),
    'masked_credential_hint', v_hint
  );
end;
$$;

grant execute on function public.save_app_portal_integration_connection(text, text, text, jsonb, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Test result: rotation_required on decrypt/secret failures
-- ---------------------------------------------------------------------------

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
  v_was_active boolean := false;
  v_live_scopes jsonb;
  v_error_code text := nullif(trim(coalesce(p_error_code, '')), '');
  v_tech text := left(coalesce(p_technical_reason, ''), 500);
  v_rotation boolean := false;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  v_was_active := v_connection.status = 'active'
    or (v_connection.activated_at is not null
        and (v_connection.deactivated_at is null or v_connection.activated_at > v_connection.deactivated_at));

  if p_success then
    v_live_scopes := case
      when jsonb_typeof(p_verification->'scopes') = 'array' then p_verification->'scopes'
      else null
    end;

    update public.app_portal_integration_connections
    set
      status = case when v_was_active then 'active' else 'connected' end,
      last_test_success_at = v_now,
      last_test_failed_at = null,
      last_test_error = null,
      approved_scopes = case
        when v_live_scopes is not null then public._apsf260i_merge_scope_arrays(approved_scopes, v_live_scopes)
        else approved_scopes
      end,
      access_summary = access_summary || jsonb_build_object(
        'last_verification', coalesce(p_verification, '{}'::jsonb),
        'last_verified_at', v_now,
        'live_scopes', coalesce(v_live_scopes, approved_scopes)
      ),
      updated_at = v_now
    where id = p_connection_id;

    perform public._apsf260i_log(
      v_company_id, p_connection_id, 'test_success', v_user_id,
      jsonb_build_object('provider_key', v_connection.provider_key, 'live_http', true)
    );

    if v_connection.provider_key = 'unonight' and v_was_active then
      v_org_id := public._un629_company_organization_id(v_company_id);
      perform public._un629_activate_unonight_platform_api(v_org_id, p_verification);
    end if;

    select * into v_connection from public.app_portal_integration_connections where id = p_connection_id;

    return public._apsf260i_connection_json(v_connection) || jsonb_build_object(
      'success', true,
      'verification', p_verification
    );
  end if;

  v_rotation := public._apsf260i_is_rotation_required_error(v_error_code)
    or public._apsf260i_is_rotation_required_error(v_tech)
    or public._apsf260i_is_rotation_required_error(p_customer_message_key);

  update public.app_portal_integration_connections
  set
    status = case when v_rotation then 'rotation_required' else 'failed' end,
    last_test_failed_at = v_now,
    last_test_error = coalesce(
      case when v_rotation then 'rotation_required' else v_error_code end,
      p_customer_message_key,
      'connection_failed'
    ),
    access_summary = access_summary || jsonb_build_object(
      'last_verification_error', jsonb_build_object(
        'code', case when v_rotation then 'rotation_required' else v_error_code end,
        'message_key', p_customer_message_key,
        'technical_reason', v_tech,
        'at', v_now
      )
    ),
    updated_at = v_now
  where id = p_connection_id;

  if v_connection.provider_key = 'unonight' then
    perform public._apsf260i_deactivate_unonight_side_effects(v_company_id);
  end if;

  perform public._apsf260i_log(
    v_company_id, p_connection_id, 'test_failed', v_user_id,
    jsonb_build_object(
      'provider_key', v_connection.provider_key,
      'error_code', case when v_rotation then 'rotation_required' else v_error_code end,
      'technical_reason', v_tech,
      'rotation_required', v_rotation
    )
  );

  select * into v_connection from public.app_portal_integration_connections where id = p_connection_id;

  return public._apsf260i_connection_json(v_connection) || jsonb_build_object(
    'success', false,
    'status', v_connection.status,
    'error_code', case when v_rotation then 'rotation_required' else v_error_code end,
    'message_key', p_customer_message_key
  );
end;
$$;

grant execute on function public.record_app_portal_integration_test_result(uuid, boolean, text, text, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Activation: require successful test newer than failure; block rotation_required
-- ---------------------------------------------------------------------------

create or replace function public.activate_app_portal_integration_connection(
  p_connection_id uuid
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
  v_now timestamptz := now();
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id and c.company_id = v_company_id and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  if v_connection.status = 'rotation_required'
     or public._apsf260i_is_rotation_required_error(v_connection.last_test_error) then
    raise exception 'ACTIVATION_PRECONDITION_FAILED: rotation_required';
  end if;

  if v_connection.last_test_success_at is null then
    raise exception 'ACTIVATION_PRECONDITION_FAILED: verified test required';
  end if;

  if v_connection.last_test_failed_at is not null
     and v_connection.last_test_failed_at > v_connection.last_test_success_at then
    raise exception 'ACTIVATION_PRECONDITION_FAILED: latest test failed';
  end if;

  if v_connection.credentials_reference is null then
    raise exception 'ACTIVATION_PRECONDITION_FAILED: credential required';
  end if;

  update public.app_portal_integration_connections
  set
    status = 'active',
    activated_at = v_now,
    deactivated_at = null,
    updated_at = v_now
  where id = p_connection_id;

  if v_connection.provider_key = 'unonight' then
    perform public._un629_activate_unonight_platform_api(
      public._un629_company_organization_id(v_company_id),
      coalesce(v_connection.access_summary->'last_verification', '{}'::jsonb)
    );
  end if;

  perform public._apsf260i_log(
    v_company_id, p_connection_id, 'activate', v_user_id,
    jsonb_build_object('provider_key', v_connection.provider_key)
  );

  select * into v_connection from public.app_portal_integration_connections where id = p_connection_id;
  return public._apsf260i_connection_json(v_connection);
end;
$$;

grant execute on function public.activate_app_portal_integration_connection(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Data repair: mark undecryptable stored secrets as rotation_required (no secret touch)
-- ---------------------------------------------------------------------------

update public.app_portal_integration_connections c
set
  status = 'rotation_required',
  last_test_error = 'rotation_required',
  access_summary = coalesce(c.access_summary, '{}'::jsonb) || jsonb_build_object(
    'rotation_required_reason', 'secret_decryption_failed',
    'rotation_required_at', now()
  ),
  updated_at = now()
where c.removed_at is null
  and c.credentials_reference is not null
  and c.last_test_failed_at is not null
  and (c.last_test_success_at is null or c.last_test_failed_at > c.last_test_success_at)
  and (
    public._apsf260i_is_rotation_required_error(c.last_test_error)
    or public._apsf260i_is_rotation_required_error(c.access_summary->'last_verification_error'->>'code')
    or public._apsf260i_is_rotation_required_error(c.access_summary->'last_verification_error'->>'technical_reason')
    or public._apsf260i_is_rotation_required_error(c.access_summary->'last_verification_error'->>'message_key')
  );

insert into public.app_portal_integration_audit_logs (
  company_id, connection_id, action_type, actor_user_id, metadata
)
select
  c.company_id,
  c.id,
  'update',
  null,
  jsonb_build_object(
    'repair', 'secret_stream_v1_rotation_required',
    'reason', 'secret_decryption_failed',
    'previous_status', 'failed'
  )
from public.app_portal_integration_connections c
where c.removed_at is null
  and c.status = 'rotation_required'
  and c.access_summary->>'rotation_required_reason' = 'secret_decryption_failed'
  and c.access_summary ? 'rotation_required_at'
  and not exists (
    select 1
    from public.app_portal_integration_audit_logs a
    where a.connection_id = c.id
      and a.action_type = 'update'
      and a.metadata->>'repair' = 'secret_stream_v1_rotation_required'
  );

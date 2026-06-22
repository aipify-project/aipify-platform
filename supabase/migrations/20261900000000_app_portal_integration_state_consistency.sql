-- APP Portal integration state consistency — canonical status, activation persistence, soft removal.

-- ---------------------------------------------------------------------------
-- Schema: lifecycle timestamps + expanded status vocabulary
-- ---------------------------------------------------------------------------

alter table public.app_portal_integration_connections
  add column if not exists activated_at timestamptz,
  add column if not exists deactivated_at timestamptz,
  add column if not exists removed_at timestamptz;

alter table public.app_portal_integration_connections
  drop constraint if exists app_portal_integration_connections_status_check;

alter table public.app_portal_integration_connections
  add constraint app_portal_integration_connections_status_check
  check (status in ('pending', 'connected', 'verified', 'active', 'inactive', 'failed', 'revoked'));

alter table public.app_portal_integration_audit_logs
  drop constraint if exists app_portal_integration_audit_logs_action_type_check;

alter table public.app_portal_integration_audit_logs
  add constraint app_portal_integration_audit_logs_action_type_check
  check (action_type in (
    'create', 'update', 'delete', 'test_success', 'test_failed', 'revoke', 'rotate',
    'activate', 'deactivate', 'remove'
  ));

alter table public.app_portal_integration_connections
  drop constraint if exists app_portal_integration_connections_company_id_provider_key_key;

create unique index if not exists app_portal_integration_connections_company_provider_active_uidx
  on public.app_portal_integration_connections (company_id, provider_key)
  where removed_at is null;

create index if not exists app_portal_integration_connections_removed_idx
  on public.app_portal_integration_connections (company_id, removed_at)
  where removed_at is not null;

-- ---------------------------------------------------------------------------
-- Canonical status (single source for hub, setup, companion context)
-- ---------------------------------------------------------------------------

create or replace function public._apsf260i_normalize_base_url(p_url text)
returns text
language sql
immutable
as $$
  select case
    when coalesce(trim(p_url), '') = '' then null
    else lower(regexp_replace(trim(trailing '/' from trim(p_url)), '/+$', ''))
  end;
$$;

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

  if p_last_test_failed_at is not null then
    if p_last_test_success_at is null then
      v_test_failed_newer := true;
    elsif p_last_test_failed_at > p_last_test_success_at then
      v_test_failed_newer := true;
    end if;
  end if;

  if v_test_failed_newer or v_status in ('failed', 'error', 'disconnected') then
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
as $$
declare
  v_has_credential boolean;
  v_canonical text;
  v_verified_at timestamptz;
begin
  v_has_credential := coalesce(
    nullif(trim(p_connection.masked_credential_hint), '') is not null,
    p_connection.credentials_reference is not null
  );

  v_canonical := public._apsf260i_compute_canonical_status(
    p_connection.status,
    v_has_credential,
    p_connection.last_test_success_at,
    p_connection.last_test_failed_at,
    p_connection.activated_at,
    p_connection.deactivated_at,
    p_connection.removed_at
  );

  v_verified_at := coalesce(
    nullif(p_connection.access_summary->>'last_verified_at', '')::timestamptz,
    p_connection.last_test_success_at
  );

  return jsonb_build_object(
    'id', p_connection.id,
    'provider_key', p_connection.provider_key,
    'setup_type', p_connection.setup_type,
    'status', p_connection.status,
    'canonical_status', v_canonical,
    'permission_level', p_connection.permission_level,
    'approved_scopes', p_connection.approved_scopes,
    'masked_credential_hint', p_connection.masked_credential_hint,
    'last_test_success_at', p_connection.last_test_success_at,
    'last_test_failed_at', p_connection.last_test_failed_at,
    'last_test_error', p_connection.last_test_error,
    'activated_at', p_connection.activated_at,
    'deactivated_at', p_connection.deactivated_at,
    'removed_at', p_connection.removed_at,
    'last_verified_at', v_verified_at,
    'access_summary', p_connection.access_summary,
    'updated_at', p_connection.updated_at
  );
end;
$$;

create or replace function public._apsf260i_deactivate_unonight_side_effects(p_company_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  v_org_id := public._un629_company_organization_id(p_company_id);
  if v_org_id is null then
    return;
  end if;

  perform public._un621_ensure_settings(v_org_id);

  update public.pilot_data_sources
  set allowed = false, updated_at = now()
  where organization_id = v_org_id and source_key = 'unonight_platform_api';

  update public.organization_integrations
  set
    enabled = false,
    status = 'disabled',
    updated_at = now()
  where organization_id = v_org_id and integration_key = 'unonight';
end;
$$;

-- ---------------------------------------------------------------------------
-- Hub + setup loaders (exclude removed, include canonical fields)
-- ---------------------------------------------------------------------------

create or replace function public.get_app_portal_integrations_hub()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_role text;
  v_providers jsonb := '[]'::jsonb;
  v_connections jsonb := '[]'::jsonb;
  v_duplicates jsonb := '[]'::jsonb;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;
  v_role := v_access->>'organization_role';

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'provider_key', p.provider_key,
      'display_name', p.display_name,
      'category', p.category,
      'setup_type', p.setup_type,
      'oauth_available', p.oauth_available,
      'default_permission_level', p.default_permission_level,
      'recommended_scopes', p.recommended_scopes
    ) order by p.sort_order
  ), '[]'::jsonb)
  into v_providers
  from public.app_portal_integration_providers p
  where p.is_available;

  select coalesce(jsonb_agg(
    public._apsf260i_connection_json(c) order by c.updated_at desc
  ), '[]'::jsonb)
  into v_connections
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id
    and c.removed_at is null;

  select coalesce(jsonb_agg(dup.row_data), '[]'::jsonb)
  into v_duplicates
  from (
    select jsonb_build_object(
      'normalized_base_url', grp.normalized_base_url,
      'connection_ids', grp.connection_ids,
      'provider_keys', grp.provider_keys,
      'preferred_provider_key', case
        when 'unonight' = any(grp.provider_keys) then 'unonight'
        else grp.provider_keys[1]
      end
    ) as row_data
    from (
      select
        public._apsf260i_normalize_base_url(c.access_summary->>'base_url') as normalized_base_url,
        array_agg(c.id order by c.updated_at desc) as connection_ids,
        array_agg(distinct c.provider_key order by c.provider_key) as provider_keys
      from public.app_portal_integration_connections c
      where c.company_id = v_company_id
        and c.removed_at is null
        and public._apsf260i_normalize_base_url(c.access_summary->>'base_url') is not null
      group by 1
      having count(*) > 1
    ) grp
  ) dup;

  return jsonb_build_object(
    'read_only_principle', 'Aipify only requests the access needed to help your organization. Read-only access is preferred whenever possible.',
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'setup_flow_steps', jsonb_build_array(
      'select_platform', 'explain_needs', 'find_api_key', 'choose_permissions',
      'validate_connection', 'access_summary', 'save_securely', 'log_action'
    ),
    'providers', v_providers,
    'connections', v_connections,
    'duplicate_warnings', v_duplicates,
    'privacy_note', 'Credentials are encrypted at rest. Full secrets are never shown after saving.'
  );
end;
$$;

create or replace function public.get_app_portal_integration_setup(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_provider public.app_portal_integration_providers;
  v_connection public.app_portal_integration_connections;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_provider
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key and p.is_available;

  if v_provider.provider_key is null then
    raise exception 'Provider not found';
  end if;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id
    and c.provider_key = p_provider_key
    and c.removed_at is null;

  return jsonb_build_object(
    'provider_key', v_provider.provider_key,
    'display_name', v_provider.display_name,
    'setup_type', v_provider.setup_type,
    'oauth_available', v_provider.oauth_available,
    'default_permission_level', v_provider.default_permission_level,
    'recommended_scopes', v_provider.recommended_scopes,
    'connection', case when v_connection.id is null then null else public._apsf260i_connection_json(v_connection) end,
    'manual_steps', jsonb_build_array(
      'login', 'open_menu', 'locate_keys', 'choose_permissions',
      'avoid_permissions', 'copy_key', 'paste_in_aipify', 'test_connection'
    ),
    'oauth_steps', jsonb_build_array(
      'connect_button', 'permission_preview', 'provider_redirect', 'success_confirmation', 'connected_summary'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Activation / deactivation persistence
-- ---------------------------------------------------------------------------

create or replace function public.activate_app_portal_integration_connection(p_connection_id uuid)
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
  v_canonical text;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id
    and c.company_id = v_company_id
    and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  v_canonical := public._apsf260i_compute_canonical_status(
    v_connection.status,
    coalesce(v_connection.credentials_reference is not null, false),
    v_connection.last_test_success_at,
    v_connection.last_test_failed_at,
    v_connection.activated_at,
    v_connection.deactivated_at,
    v_connection.removed_at
  );

  if v_canonical not in ('verified', 'active', 'inactive') then
    raise exception 'Connection must be verified before activation';
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

create or replace function public.deactivate_app_portal_integration_connection(p_connection_id uuid)
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
  where c.id = p_connection_id
    and c.company_id = v_company_id
    and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  update public.app_portal_integration_connections
  set
    status = 'inactive',
    deactivated_at = v_now,
    updated_at = v_now
  where id = p_connection_id;

  if v_connection.provider_key = 'unonight' then
    perform public._apsf260i_deactivate_unonight_side_effects(v_company_id);
  end if;

  perform public._apsf260i_log(
    v_company_id, p_connection_id, 'deactivate', v_user_id,
    jsonb_build_object('provider_key', v_connection.provider_key)
  );

  select * into v_connection from public.app_portal_integration_connections where id = p_connection_id;

  return public._apsf260i_connection_json(v_connection);
end;
$$;

-- ---------------------------------------------------------------------------
-- Test result recording — preserve activation when re-testing active connections
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
    update public.app_portal_integration_connections
    set
      status = case when v_was_active then 'active' else 'connected' end,
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
    perform public._apsf260i_deactivate_unonight_side_effects(v_company_id);
  end if;

  perform public._apsf260i_log(
    v_company_id, p_connection_id, 'test_failed', v_user_id,
    jsonb_build_object(
      'provider_key', v_connection.provider_key,
      'error_code', p_error_code,
      'technical_reason', left(coalesce(p_technical_reason, ''), 500)
    )
  );

  select * into v_connection from public.app_portal_integration_connections where id = p_connection_id;

  return public._apsf260i_connection_json(v_connection) || jsonb_build_object(
    'success', false,
    'error_code', p_error_code,
    'message_key', p_customer_message_key
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Soft removal with verified row deletion + audit retention
-- ---------------------------------------------------------------------------

create or replace function public.remove_app_portal_integration_connection(p_connection_id uuid)
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
  v_deleted int;
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id
    and c.company_id = v_company_id
    and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  update public.app_portal_integration_credential_vault
  set revoked_at = v_now
  where connection_id = p_connection_id and company_id = v_company_id and revoked_at is null;

  update public.app_portal_integration_connections
  set
    status = 'revoked',
    removed_at = v_now,
    deactivated_at = coalesce(deactivated_at, v_now),
    updated_at = v_now
  where id = p_connection_id and company_id = v_company_id;

  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'Connection not found';
  end if;

  if v_connection.provider_key = 'unonight' then
    perform public._apsf260i_deactivate_unonight_side_effects(v_company_id);
  end if;

  perform public._apsf260i_log(
    v_company_id, p_connection_id, 'remove', v_user_id,
    jsonb_build_object('provider_key', v_connection.provider_key, 'soft_removed', true)
  );

  return jsonb_build_object('removed', true, 'connection_id', p_connection_id);
end;
$$;

-- Repair inconsistent rows: success newer than failure should not stay failed
update public.app_portal_integration_connections c
set
  status = case
    when c.activated_at is not null
      and (c.deactivated_at is null or c.activated_at > c.deactivated_at) then 'active'
    when c.last_test_success_at is not null then 'connected'
    else c.status
  end,
  last_test_failed_at = null,
  last_test_error = null,
  updated_at = now()
where c.removed_at is null
  and c.status = 'failed'
  and c.last_test_success_at is not null
  and (c.last_test_failed_at is null or c.last_test_success_at >= c.last_test_failed_at);

grant execute on function public.activate_app_portal_integration_connection(uuid) to authenticated;
grant execute on function public.deactivate_app_portal_integration_connection(uuid) to authenticated;

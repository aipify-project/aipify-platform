-- Repair canonical integration status: stale status='failed' must not override newer success.
-- Enhance duplicate detection by normalized base URL + external organization id.

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

-- Repair rows where status still says failed but a newer success exists.
update public.app_portal_integration_connections c
set
  status = case
    when c.activated_at is not null
      and (c.deactivated_at is null or c.activated_at > c.deactivated_at) then 'active'
    when c.last_test_success_at is not null then 'connected'
    else c.status
  end,
  last_test_failed_at = case
    when c.last_test_success_at is not null
      and (c.last_test_failed_at is null or c.last_test_success_at >= c.last_test_failed_at)
      then null
    else c.last_test_failed_at
  end,
  last_test_error = case
    when c.last_test_success_at is not null
      and (c.last_test_failed_at is null or c.last_test_success_at >= c.last_test_failed_at)
      then null
    else c.last_test_error
  end,
  updated_at = now()
where c.removed_at is null
  and c.last_test_success_at is not null
  and (
    c.status in ('failed', 'error', 'disconnected')
    or (
      c.last_test_failed_at is not null
      and c.last_test_success_at >= c.last_test_failed_at
    )
  );

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
      'external_organization_id', grp.external_organization_id,
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
        nullif(trim(coalesce(
          c.access_summary->'last_verification'->>'organization_id',
          c.access_summary->>'expected_organization_id'
        )), '') as external_organization_id,
        array_agg(c.id order by c.updated_at desc) as connection_ids,
        array_agg(distinct c.provider_key order by c.provider_key) as provider_keys
      from public.app_portal_integration_connections c
      where c.company_id = v_company_id
        and c.removed_at is null
        and (
          public._apsf260i_normalize_base_url(c.access_summary->>'base_url') is not null
          or nullif(trim(coalesce(
            c.access_summary->'last_verification'->>'organization_id',
            c.access_summary->>'expected_organization_id'
          )), '') is not null
        )
      group by 1, 2
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

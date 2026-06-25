-- Generic integration duplicate detection: normalized base URL + external organization id.
-- No provider-specific or customer-specific preference rules.

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
      'preferred_provider_key', grp.preferred_provider_key
    ) as row_data
    from (
      select
        public._apsf260i_normalize_base_url(c.access_summary->>'base_url') as normalized_base_url,
        lower(nullif(trim(coalesce(
          c.access_summary->'last_verification'->>'organization_id',
          c.access_summary->>'expected_organization_id'
        )), '')) as external_organization_id,
        array_agg(c.id order by c.updated_at desc) as connection_ids,
        array_agg(distinct c.provider_key order by c.provider_key) as provider_keys,
        (array_agg(c.provider_key order by c.updated_at desc))[1] as preferred_provider_key
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
      having count(distinct c.id) >= 2
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

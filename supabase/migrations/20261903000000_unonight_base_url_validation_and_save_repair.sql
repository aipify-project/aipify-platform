-- Unonight base URL validation, credential-preserving save, and persisted email cleanup.

update public.app_portal_integration_connections c
set access_summary = coalesce(c.access_summary, '{}'::jsonb)
  || jsonb_build_object('base_url', 'https://www.unonight.com')
where c.provider_key = 'unonight'
  and c.removed_at is null
  and coalesce(c.access_summary->>'base_url', '') ~* '^[^/@]+@[^/@]+\.[^/@]+$';

create or replace function public._una631_validate_base_url(p_url text)
returns text
language plpgsql
immutable
as $$
declare
  v_trimmed text := trim(coalesce(p_url, ''));
begin
  if v_trimmed = '' then
    raise exception 'Invalid Unonight base URL: HTTPS URL required';
  end if;

  if v_trimmed ~* '^[^/@[:space:]]+@[^/@[:space:]]+\.[^/@[:space:]]+$' then
    raise exception 'Invalid Unonight base URL: email addresses are not allowed';
  end if;

  if lower(v_trimmed) not like 'https://%' then
    raise exception 'Invalid Unonight base URL: HTTPS URL required';
  end if;

  if lower(v_trimmed) ~ '(^|//|\.)(unonight\.com)' then
    return 'https://www.unonight.com';
  end if;

  return regexp_replace(v_trimmed, '/+$', '');
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
  v_has_active_credential boolean := false;
  v_api_key text := nullif(trim(p_api_key), '');
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
    perform public._apsf260i_store_credential(v_company_id, v_connection_id, v_api_key, true);
  end if;

  perform public._apsf260i_log(
    v_company_id, v_connection_id, 'create', v_user_id,
    jsonb_build_object(
      'provider_key', p_provider_key,
      'setup_type', p_setup_type,
      'permission_level', v_level,
      'read_only', v_level = 'read_only',
      'base_url', case when p_provider_key = 'unonight' then v_summary->>'base_url' else null end
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

grant execute on function public.save_app_portal_integration_connection(text, text, text, jsonb, text, jsonb) to authenticated;

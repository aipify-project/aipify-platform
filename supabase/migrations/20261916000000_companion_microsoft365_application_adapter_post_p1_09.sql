-- POST-P1.09 — Microsoft 365 governed application adapter (Graph OAuth + OneDrive)
-- Feature owner: CUSTOMER APP (Companion external application orchestration — adapter outside Core)

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
  'microsoft365',
  'Microsoft 365',
  'productivity',
  'oauth',
  true,
  'read_write',
  '["User.Read","Files.ReadWrite","offline_access"]'::jsonb,
  41
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

create or replace function public.get_companion_microsoft365_handoff_connection()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
  v_connection public.app_portal_integration_connections;
  v_encrypted text;
  v_account_label text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_tenant');
  end if;

  select c.company_id
  into v_company_id
  from public.customers c
  where c.id = v_tenant_id
  limit 1;

  if v_company_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_company');
  end if;

  select *
  into v_connection
  from public.app_portal_integration_connections ic
  where ic.company_id = v_company_id
    and ic.provider_key = 'microsoft365'
    and ic.removed_at is null
  order by ic.updated_at desc
  limit 1;

  if v_connection.id is null then
    return jsonb_build_object(
      'ok', true,
      'connected', false,
      'connection_id', null,
      'approved_scopes', '[]'::jsonb,
      'encrypted_token', null,
      'account_label', null
    );
  end if;

  select v.encrypted_payload
  into v_encrypted
  from public.app_portal_integration_credential_vault v
  where v.connection_id = v_connection.id
    and v.company_id = v_company_id
    and v.revoked_at is null
  order by v.created_at desc
  limit 1;

  v_account_label := coalesce(
    nullif(v_connection.access_summary->>'account_label', ''),
    nullif(v_connection.access_summary->>'display_name', ''),
    null
  );

  return jsonb_build_object(
    'ok', true,
    'connected', v_connection.status = 'connected' and v_encrypted is not null,
    'connection_id', v_connection.id,
    'approved_scopes', coalesce(v_connection.approved_scopes, '[]'::jsonb),
    'encrypted_token', v_encrypted,
    'account_label', v_account_label
  );
end;
$$;

create or replace function public.store_companion_microsoft365_oauth_connection(
  p_encrypted_token text,
  p_approved_scopes jsonb default '[]'::jsonb,
  p_account_label text default null
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
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if coalesce(length(trim(p_encrypted_token)), 0) < 16 then
    return jsonb_build_object('ok', false, 'error', 'invalid_token');
  end if;

  insert into public.app_portal_integration_connections (
    company_id, provider_key, setup_type, status, permission_level,
    approved_scopes, access_summary, created_by
  ) values (
    v_company_id, 'microsoft365', 'oauth', 'connected', 'read_write',
    coalesce(p_approved_scopes, '[]'::jsonb),
    jsonb_build_object(
      'provider', 'microsoft365',
      'handoff', 'onedrive',
      'account_label', nullif(trim(coalesce(p_account_label, '')), '')
    ),
    v_user_id
  )
  on conflict (company_id, provider_key) do update set
    setup_type = 'oauth',
    status = 'connected',
    permission_level = 'read_write',
    approved_scopes = excluded.approved_scopes,
    access_summary = excluded.access_summary,
    updated_at = now(),
    removed_at = null
  returning id into v_connection_id;

  perform public._apsf260i_store_credential(v_company_id, v_connection_id, p_encrypted_token, true);

  return jsonb_build_object('ok', true, 'connection_id', v_connection_id);
exception
  when others then
    return jsonb_build_object('ok', false, 'error', 'store_failed');
end;
$$;

grant execute on function public.get_companion_microsoft365_handoff_connection() to authenticated;
grant execute on function public.store_companion_microsoft365_oauth_connection(text, jsonb, text) to authenticated;

-- Refresh APP portal integration approved_scopes from live Unonight verification.
-- Prevents stale stored scope lists from blocking platform snapshot after in-place token scope updates.

create or replace function public._apsf260i_merge_scope_arrays(p_current jsonb, p_live jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(
    (
      select jsonb_agg(scope order by lower(scope))
      from (
        select distinct on (lower(value)) value as scope
        from (
          select value from jsonb_array_elements_text(coalesce(p_current, '[]'::jsonb))
          union all
          select value from jsonb_array_elements_text(coalesce(p_live, '[]'::jsonb))
        ) scopes(value)
        where length(trim(value)) > 0
        order by lower(value), value
      ) deduped
    ),
    '[]'::jsonb
  );
$$;

create or replace function public.refresh_app_portal_integration_live_scopes(
  p_connection_id uuid,
  p_live_scopes jsonb,
  p_context jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_connection public.app_portal_integration_connections;
  v_merged jsonb;
  v_now timestamptz := now();
begin
  v_access := public._apsf260i_require_integrations_admin();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.id = p_connection_id
    and c.company_id = v_company_id
    and c.removed_at is null;

  if v_connection.id is null then
    raise exception 'Connection not found';
  end if;

  v_merged := public._apsf260i_merge_scope_arrays(v_connection.approved_scopes, coalesce(p_live_scopes, '[]'::jsonb));

  update public.app_portal_integration_connections
  set
    approved_scopes = v_merged,
    access_summary = access_summary || jsonb_build_object(
      'live_scopes_refreshed_at', v_now,
      'live_scope_refresh_context', coalesce(p_context, '{}'::jsonb),
      'live_scopes', v_merged
    ),
    updated_at = v_now
  where id = p_connection_id;

  perform public._apsf260i_log(
    v_company_id,
    p_connection_id,
    'live_scopes_refreshed',
    (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1),
    jsonb_build_object(
      'provider_key', v_connection.provider_key,
      'scope_count', jsonb_array_length(v_merged),
      'context', coalesce(p_context, '{}'::jsonb)
    )
  );

  return jsonb_build_object(
    'connection_id', p_connection_id,
    'approved_scopes', v_merged,
    'refreshed_at', v_now
  );
end;
$$;

-- Sync approved_scopes from live connection verification on successful tests.
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

revoke all on function public._apsf260i_merge_scope_arrays(jsonb, jsonb) from public, anon;
revoke all on function public.refresh_app_portal_integration_live_scopes(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.refresh_app_portal_integration_live_scopes(uuid, jsonb, jsonb) to authenticated;

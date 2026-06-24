-- OAA hotfix: approver direct grant when no pending employee request exists.

create or replace function public.grant_organization_provider_access_directly(
  p_provider_key text,
  p_capability_key text default null,
  p_scope_keys jsonb default '[]'::jsonb,
  p_access_mode text default 'one_time',
  p_duration_hours integer default null,
  p_risk_level smallint default 1,
  p_reason_summary text default '',
  p_context_payload jsonb default '{}'::jsonb,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_fingerprint text;
  v_pending public.organization_provider_access_requests;
  v_row public.organization_provider_access_requests;
  v_grant public.organization_provider_access_grants;
  v_expires timestamptz;
begin
  v_user_id := public._mta_app_user_id();
  v_org_id := public._oaa_current_org_id();
  if v_user_id is null or v_org_id is null then
    raise exception 'unauthorized';
  end if;

  if public._mta_membership_active(v_org_id, v_user_id) is null then
    raise exception 'unauthorized';
  end if;

  if p_provider_key is null or btrim(p_provider_key) = '' then
    raise exception 'provider_key_required';
  end if;

  if p_scope_keys is null or jsonb_typeof(p_scope_keys) <> 'array' or jsonb_array_length(p_scope_keys) = 0 then
    raise exception 'scope_keys_required';
  end if;

  if not public._oaa_validate_provider_scopes(p_provider_key, p_scope_keys) then
    raise exception 'invalid_scope_keys';
  end if;

  if not public._oaa_can_approve(v_org_id, v_user_id, p_scope_keys) then
    raise exception 'approval_forbidden';
  end if;

  v_fingerprint := md5(p_scope_keys::text);

  select *
  into v_pending
  from public.organization_provider_access_requests r
  where r.organization_id = v_org_id
    and r.provider_key = p_provider_key
    and r.scope_fingerprint = v_fingerprint
    and r.status = 'pending'
  limit 1
  for update;

  if found then
    return public.approve_organization_provider_access_request(v_pending.id);
  end if;

  select g.*
  into v_grant
  from public.organization_provider_access_grants g
  where g.organization_id = v_org_id
    and g.user_id = v_user_id
    and g.provider_key = p_provider_key
    and g.scope_keys = p_scope_keys
    and g.active = true
    and (g.expires_at is null or g.expires_at > now())
  limit 1;

  if found then
    select *
    into v_row
    from public.organization_provider_access_requests r
    where r.id = v_grant.granted_from_request_id;

    perform public._oaa_audit(
      v_org_id,
      v_user_id,
      'duplicate_request_returned',
      v_row.id,
      v_grant.id,
      jsonb_build_object('idempotency_key', p_idempotency_key, 'direct_grant', true)
    );

    return jsonb_build_object(
      'request', public._oaa_request_json(v_row),
      'grant', jsonb_build_object(
        'id', v_grant.id,
        'active', v_grant.active,
        'expires_at', v_grant.expires_at
      )
    );
  end if;

  v_expires := case
    when coalesce(nullif(p_access_mode, ''), 'one_time') = 'one_time' and p_duration_hours is not null then
      now() + make_interval(hours => p_duration_hours)
    else null
  end;

  insert into public.organization_provider_access_requests (
    organization_id,
    requester_user_id,
    provider_key,
    capability_key,
    scope_keys,
    scope_fingerprint,
    access_mode,
    duration_hours,
    risk_level,
    reason_summary,
    context_payload,
    idempotency_key,
    status,
    approved_by_user_id,
    expires_at
  ) values (
    v_org_id,
    v_user_id,
    p_provider_key,
    p_capability_key,
    p_scope_keys,
    v_fingerprint,
    coalesce(nullif(p_access_mode, ''), 'one_time'),
    p_duration_hours,
    coalesce(p_risk_level, 1),
    coalesce(p_reason_summary, ''),
    coalesce(p_context_payload, '{}'::jsonb),
    p_idempotency_key,
    'approved',
    v_user_id,
    v_expires
  )
  returning * into v_row;

  insert into public.organization_provider_access_grants (
    organization_id,
    user_id,
    provider_key,
    scope_keys,
    access_mode,
    granted_from_request_id,
    expires_at
  ) values (
    v_org_id,
    v_user_id,
    p_provider_key,
    p_scope_keys,
    v_row.access_mode,
    v_row.id,
    v_expires
  )
  returning * into v_grant;

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_created',
    v_row.id,
    null,
    jsonb_build_object(
      'provider_key', p_provider_key,
      'scope_keys', p_scope_keys,
      'idempotency_key', p_idempotency_key,
      'direct_grant', true
    )
  );

  perform public._oaa_audit(
    v_org_id,
    v_user_id,
    'request_approved',
    v_row.id,
    v_grant.id,
    jsonb_build_object('scope_keys', p_scope_keys, 'direct_grant', true)
  );

  return jsonb_build_object(
    'request', public._oaa_request_json(v_row),
    'grant', jsonb_build_object(
      'id', v_grant.id,
      'active', v_grant.active,
      'expires_at', v_grant.expires_at
    )
  );
end;
$$;

grant execute on function public.grant_organization_provider_access_directly(
  text, text, jsonb, text, integer, smallint, text, jsonb, text
) to authenticated;

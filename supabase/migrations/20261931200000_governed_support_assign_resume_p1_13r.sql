-- P1.13R — Governed support assign resume RPCs (read + atomic execute).
-- Feature owner: CUSTOMER APP. Production-safe resume for approved support_case.assign.
-- P1.13T — Harden assign_support_case: success only when exactly one row is updated.

-- ---------------------------------------------------------------------------
-- 0. Provider — assign_support_case (row-count guard)
-- ---------------------------------------------------------------------------
create or replace function public.assign_support_case(p_case_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_affected_rows integer;
begin
  perform public._irp_require_permission('support.assign');
  v_org_id := public._mta_require_organization();

  if public._mta_membership_active(v_org_id, p_user_id) is null then
    raise exception 'Invalid assignee';
  end if;

  update public.organization_support_cases
  set assigned_to = p_user_id, updated_at = now()
  where id = p_case_id and organization_id = v_org_id;

  get diagnostics v_affected_rows = row_count;

  if v_affected_rows <> 1 then
    raise exception 'Support case assignment failed';
  end if;

  perform public._sai_log(
    v_org_id,
    'support_case_assigned',
    'support_case',
    p_case_id,
    jsonb_build_object('assigned_to', p_user_id),
    false
  );

  return jsonb_build_object('case_id', p_case_id, 'assigned_to', p_user_id);
end;
$$;

revoke all on function public.assign_support_case(uuid, uuid) from public;
revoke all on function public.assign_support_case(uuid, uuid) from anon;
grant execute on function public.assign_support_case(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 1. Internal helpers (no authenticated execute)
-- ---------------------------------------------------------------------------
create or replace function public._support_companion_write_result(
  p_success boolean,
  p_outcome_code text,
  p_case_id uuid default null,
  p_assigned_to uuid default null,
  p_receipt_id uuid default null,
  p_idempotent_replay boolean default false
)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_build_object(
    'success', p_success,
    'outcome_code', p_outcome_code,
    'case_id', p_case_id,
    'assigned_to', p_assigned_to,
    'receipt_id', p_receipt_id,
    'idempotent_replay', coalesce(p_idempotent_replay, false)
  );
$$;

create or replace function public._support_companion_idempotency_lock_key(
  p_org_id uuid,
  p_idempotency_key text
)
returns bigint
language sql
immutable
set search_path = public
as $$
  select hashtextextended(
    'support_write_idem:' || coalesce(p_org_id::text, '') || ':' || coalesce(p_idempotency_key, ''),
    0
  );
$$;

create or replace function public._support_companion_consume_action_request(
  p_org_id uuid,
  p_user_id uuid,
  p_req public.companion_action_requests,
  p_outcome_code text,
  p_case_id uuid,
  p_assigned_to uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_receipt_id uuid;
begin
  update public.companion_action_requests
  set
    lifecycle_status = 'completed',
    execution_status = 'completed',
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'consumed_at', to_jsonb(now()),
      'outcome_code', p_outcome_code,
      'case_id', p_case_id::text,
      'assigned_to', p_assigned_to::text
    ),
    updated_at = now()
  where id = p_req.id
    and organization_id = p_org_id;

  update public.companion_action_queue
  set
    queue_status = 'completed',
    completed_at = coalesce(completed_at, now())
  where action_request_id = p_req.id
    and organization_id = p_org_id;

  insert into public.companion_action_receipts (
    organization_id,
    action_request_id,
    result_summary,
    duration_ms,
    approver_id,
    audit_reference
  ) values (
    p_org_id,
    p_req.id,
    'Companion support assign write completed.',
    0,
    p_user_id,
    'AUD-' || left(p_req.id::text, 8)
  )
  on conflict (action_request_id) do nothing
  returning id into v_receipt_id;

  if v_receipt_id is null then
    select rc.id into v_receipt_id
    from public.companion_action_receipts rc
    where rc.action_request_id = p_req.id
    limit 1;
  end if;

  perform public._caae346_log_audit(
    p_org_id,
    p_user_id,
    'support_approval_consumed',
    'Governed support approval consumed',
    p_req.id,
    jsonb_build_object(
      'outcome_code', p_outcome_code,
      'case_id', p_case_id::text,
      'assigned_to', p_assigned_to::text
    )
  );

  return v_receipt_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Read RPC — get_companion_support_action_request
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_support_action_request(
  p_action_request_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_row public.companion_action_requests;
  v_expired boolean;
  v_consumed boolean;
  v_payload jsonb;
begin
  v_ctx := public._caae346_require_org();
  v_org_id := (v_ctx->>'organization_id')::uuid;

  perform public._irp_require_permission('support.assign', v_org_id);

  if p_action_request_id is null then
    return jsonb_build_object(
      'success', false,
      'outcome_code', 'NOT_FOUND'
    );
  end if;

  select * into v_row
  from public.companion_action_requests r
  where r.id = p_action_request_id
    and r.organization_id = v_org_id
    and r.action_key = 'support_case.assign'
    and coalesce(r.metadata->>'domain', '') = 'support_write'
    and coalesce(r.metadata->>'schema_version', '') = 'support_write_v1'
    and coalesce(r.metadata->>'provider_key', '') = 'support_ai_engine'
    and coalesce(r.metadata->>'capability_key', '') = 'support_case.assign'
    and coalesce(r.metadata->>'requested_action', '') = 'assign';

  if not found then
    return jsonb_build_object(
      'success', false,
      'outcome_code', 'NOT_FOUND'
    );
  end if;

  v_expired := (
    v_row.approval_status = 'expired'
    or (v_row.expires_at is not null and v_row.expires_at <= now())
  );

  v_consumed := (
    v_row.lifecycle_status = 'completed'
    or v_row.execution_status = 'completed'
    or nullif(trim(v_row.metadata->>'consumed_at'), '') is not null
  );

  v_payload := coalesce(v_row.metadata->'payload', '{}'::jsonb);

  return jsonb_build_object(
    'success', true,
    'outcome_code', 'SUPPORT_ACTION_REQUEST_FOUND',
    'action_request_id', v_row.id,
    'action_key', v_row.action_key,
    'approval_status', v_row.approval_status,
    'lifecycle_status', v_row.lifecycle_status,
    'execution_status', v_row.execution_status,
    'expires_at', v_row.expires_at,
    'payload', jsonb_build_object(
      'case_id', nullif(trim(v_payload->>'case_id'), ''),
      'assignee_user_id', nullif(trim(v_payload->>'assignee_user_id'), '')
    ),
    'payload_hash', v_row.metadata->>'payload_hash',
    'idempotency_key', v_row.metadata->>'idempotency_key',
    'capability_key', v_row.metadata->>'capability_key',
    'provider_key', v_row.metadata->>'provider_key',
    'requested_action', v_row.metadata->>'requested_action',
    'expired', v_expired,
    'consumed', v_consumed
  );
exception
  when others then
    if sqlerrm like 'Permission denied:%'
       or sqlerrm like 'Authentication required%'
       or sqlerrm like 'User context required%'
       or sqlerrm like 'Organization context required%'
       or sqlerrm like 'Access denied for organization%' then
      raise;
    end if;

    return jsonb_build_object(
      'success', false,
      'outcome_code', 'NOT_FOUND'
    );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Execute RPC — execute_companion_support_assign_write
-- ---------------------------------------------------------------------------
create or replace function public.execute_companion_support_assign_write(
  p_action_request_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_req public.companion_action_requests;
  v_payload jsonb;
  v_payload_hash text;
  v_idempotency_key text;
  v_case_id_text text;
  v_assignee_user_id_text text;
  v_case_id uuid;
  v_assignee_user_id uuid;
  v_canonical_payload jsonb;
  v_receipt_id uuid;
  v_provider_result jsonb;
  v_outcome_code text := 'SUPPORT_CASE_ASSIGNED';
  v_extra_key_count integer;
begin
  if auth.uid() is null then
    return public._support_companion_write_result(false, 'NOT_FOUND');
  end if;

  v_ctx := public._caae346_require_org();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'auth_user_id')::uuid;

  begin
    perform public._irp_require_permission('support.assign', v_org_id);
  exception
    when others then
      return public._support_companion_write_result(false, 'NOT_FOUND');
  end;

  if p_action_request_id is null then
    return public._support_companion_write_result(false, 'NOT_FOUND');
  end if;

  select * into v_req
  from public.companion_action_requests r
  where r.id = p_action_request_id
    and r.organization_id = v_org_id
  for update;

  if not found then
    return public._support_companion_write_result(false, 'NOT_FOUND');
  end if;

  v_payload := coalesce(v_req.metadata->'payload', '{}'::jsonb);
  v_payload_hash := coalesce(v_req.metadata->>'payload_hash', '');
  v_idempotency_key := coalesce(v_req.metadata->>'idempotency_key', '');

  if v_req.action_key <> 'support_case.assign' then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if coalesce(v_req.metadata->>'domain', '') <> 'support_write'
     or coalesce(v_req.metadata->>'schema_version', '') <> 'support_write_v1'
     or coalesce(v_req.metadata->>'provider_key', '') <> 'support_ai_engine'
     or coalesce(v_req.metadata->>'capability_key', '') <> 'support_case.assign'
     or coalesce(v_req.metadata->>'requested_action', '') <> 'assign' then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_payload_hash !~ '^[a-f0-9]{64}$'
     or char_length(v_idempotency_key) < 8
     or char_length(v_idempotency_key) > 128 then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_req.approval_status = 'expired'
     or (v_req.expires_at is not null and v_req.expires_at <= now()) then
    return public._support_companion_write_result(false, 'APPROVAL_EXPIRED');
  end if;

  perform pg_advisory_xact_lock(
    public._support_companion_idempotency_lock_key(v_org_id, v_idempotency_key)
  );

  if v_req.lifecycle_status = 'completed'
     or v_req.execution_status = 'completed'
     or nullif(trim(v_req.metadata->>'consumed_at'), '') is not null then
    select rc.id into v_receipt_id
    from public.companion_action_receipts rc
    where rc.action_request_id = v_req.id
    limit 1;

    v_case_id_text := nullif(trim(v_payload->>'case_id'), '');
    v_assignee_user_id_text := nullif(trim(v_payload->>'assignee_user_id'), '');

    begin
      v_case_id := v_case_id_text::uuid;
      v_assignee_user_id := v_assignee_user_id_text::uuid;
    exception
      when others then
        return public._support_companion_write_result(false, 'WRITE_FAILED');
    end;

    if v_receipt_id is null then
      return public._support_companion_write_result(false, 'WRITE_FAILED');
    end if;

    return public._support_companion_write_result(
      true,
      coalesce(nullif(trim(v_req.metadata->>'outcome_code'), ''), v_outcome_code),
      v_case_id,
      v_assignee_user_id,
      v_receipt_id,
      true
    );
  end if;

  if v_req.approval_status in ('rejected', 'expired')
     or v_req.lifecycle_status in ('rejected', 'cancelled')
     or v_req.execution_status in ('failed', 'cancelled') then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if v_req.approval_status <> 'approved'
     or v_req.lifecycle_status <> 'approved'
     or v_req.execution_status <> 'queued' then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if jsonb_typeof(v_payload) <> 'object' then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  select count(*) into v_extra_key_count
  from jsonb_object_keys(v_payload) k
  where k not in ('case_id', 'assignee_user_id');

  if v_extra_key_count > 0 then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  v_case_id_text := nullif(trim(v_payload->>'case_id'), '');
  v_assignee_user_id_text := nullif(trim(v_payload->>'assignee_user_id'), '');

  if v_case_id_text is null
     or v_assignee_user_id_text is null
     or v_assignee_user_id_text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  begin
    v_case_id := v_case_id_text::uuid;
    v_assignee_user_id := v_assignee_user_id_text::uuid;
  exception
    when others then
      return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end;

  v_canonical_payload := jsonb_build_object(
    'case_id', v_case_id_text,
    'assignee_user_id', v_assignee_user_id_text
  );

  if v_payload is distinct from v_canonical_payload then
    return public._support_companion_write_result(false, 'APPROVAL_INVALID');
  end if;

  if public._mta_membership_active(v_org_id, v_assignee_user_id) is null then
    return public._support_companion_write_result(false, 'WRITE_FAILED');
  end if;

  if not exists (
    select 1
    from public.organization_support_cases c
    where c.id = v_case_id
      and c.organization_id = v_org_id
  ) then
    return public._support_companion_write_result(false, 'WRITE_FAILED');
  end if;

  begin
    v_provider_result := public.assign_support_case(v_case_id, v_assignee_user_id);
  exception
    when others then
      return public._support_companion_write_result(false, 'WRITE_FAILED');
  end;

  if coalesce((v_provider_result->>'case_id')::uuid, v_case_id) <> v_case_id
     or coalesce((v_provider_result->>'assigned_to')::uuid, v_assignee_user_id) <> v_assignee_user_id then
    return public._support_companion_write_result(false, 'WRITE_FAILED');
  end if;

  v_receipt_id := public._support_companion_consume_action_request(
    v_org_id,
    v_user_id,
    v_req,
    v_outcome_code,
    v_case_id,
    v_assignee_user_id
  );

  if v_receipt_id is null then
    return public._support_companion_write_result(false, 'WRITE_FAILED');
  end if;

  return public._support_companion_write_result(
    true,
    v_outcome_code,
    v_case_id,
    v_assignee_user_id,
    v_receipt_id,
    false
  );
exception
  when others then
    return public._support_companion_write_result(false, 'WRITE_FAILED');
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------
revoke all on function public.get_companion_support_action_request(uuid) from public;
revoke all on function public.get_companion_support_action_request(uuid) from anon;
grant execute on function public.get_companion_support_action_request(uuid) to authenticated;

revoke all on function public.execute_companion_support_assign_write(uuid) from public;
revoke all on function public.execute_companion_support_assign_write(uuid) from anon;
grant execute on function public.execute_companion_support_assign_write(uuid) to authenticated;

revoke all on function public._support_companion_write_result(boolean, text, uuid, uuid, uuid, boolean) from public, anon, authenticated, service_role;
revoke all on function public._support_companion_idempotency_lock_key(uuid, text) from public, anon, authenticated, service_role;
revoke all on function public._support_companion_consume_action_request(uuid, uuid, public.companion_action_requests, text, uuid, uuid) from public, anon, authenticated, service_role;

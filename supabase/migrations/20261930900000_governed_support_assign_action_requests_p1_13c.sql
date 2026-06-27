-- P1.13C — Governed support assign action requests (companion_action_requests support writes).
-- Feature owner: CUSTOMER APP. Approval queue only — no case assignment execution.

create unique index if not exists companion_action_requests_support_write_idempotency_uidx
  on public.companion_action_requests (organization_id, (metadata->>'idempotency_key'))
  where (metadata->>'domain') = 'support_write'
    and (metadata->>'schema_version') = 'support_write_v1'
    and coalesce(metadata->>'idempotency_key', '') <> '';

create or replace function public.record_companion_support_action_request(
  p_action_key text,
  p_payload jsonb,
  p_payload_hash text,
  p_idempotency_key text,
  p_expires_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb := public._caae346_require_org();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_existing public.companion_action_requests;
  v_row public.companion_action_requests;
  v_case_id text;
  v_assignee_user_id text;
  v_title text;
  v_description text;
  v_reason text;
  v_expected_outcome text;
  v_metadata jsonb;
begin
  perform public._irp_require_permission('support.assign', v_org_id);

  if p_action_key is null or p_action_key <> 'support_case.assign' then
    raise exception 'Unsupported support action: %', coalesce(p_action_key, '(null)');
  end if;

  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'payload must be a JSON object';
  end if;

  v_case_id := nullif(trim(p_payload->>'case_id'), '');
  if v_case_id is null then
    raise exception 'case_id is required';
  end if;

  v_assignee_user_id := nullif(trim(p_payload->>'assignee_user_id'), '');
  if v_assignee_user_id is null
     or v_assignee_user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    raise exception 'assignee_user_id must be a valid UUID';
  end if;

  if p_payload_hash is null or p_payload_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'payload_hash must be 64 lowercase hex characters (SHA-256)';
  end if;

  if p_idempotency_key is null or char_length(p_idempotency_key) < 8 or char_length(p_idempotency_key) > 128 then
    raise exception 'idempotency_key must be between 8 and 128 characters';
  end if;

  if p_expires_at is null or p_expires_at <= now() or p_expires_at > now() + interval '7 days' then
    raise exception 'expires_at must be in the future and within 7 days';
  end if;

  v_title := 'Support case assignment request';
  v_description := 'A governed support case assignment is awaiting approval.';
  v_reason := 'Companion support write proposal';
  v_expected_outcome := 'Support case assignment applied after approval';

  select * into v_existing
  from public.companion_action_requests r
  where r.organization_id = v_org_id
    and r.metadata->>'domain' = 'support_write'
    and r.metadata->>'schema_version' = 'support_write_v1'
    and r.metadata->>'idempotency_key' = p_idempotency_key
  limit 1;

  if found then
    if v_existing.action_key = p_action_key
       and coalesce(v_existing.metadata->>'payload_hash', '') = p_payload_hash then
      return jsonb_build_object(
        'success', true,
        'outcome_code', 'IDEMPOTENT_REPLAY',
        'action_request_id', v_existing.id,
        'approval_status', v_existing.approval_status,
        'lifecycle_status', v_existing.lifecycle_status,
        'expires_at', v_existing.expires_at,
        'idempotent_replay', true
      );
    end if;

    return jsonb_build_object(
      'success', false,
      'outcome_code', 'IDEMPOTENCY_CONFLICT',
      'action_request_id', v_existing.id,
      'approval_status', v_existing.approval_status,
      'lifecycle_status', v_existing.lifecycle_status,
      'expires_at', v_existing.expires_at,
      'idempotent_replay', false
    );
  end if;

  if public._mta_membership_active(v_org_id, v_assignee_user_id::uuid) is null then
    raise exception 'Invalid assignee';
  end if;

  v_metadata := jsonb_build_object(
    'schema_version', 'support_write_v1',
    'domain', 'support_write',
    'provider_key', 'support_ai_engine',
    'capability_key', p_action_key,
    'requested_action', 'assign',
    'payload', jsonb_build_object(
      'case_id', v_case_id,
      'assignee_user_id', v_assignee_user_id
    ),
    'payload_hash', p_payload_hash,
    'idempotency_key', p_idempotency_key,
    'case_id', v_case_id,
    'expires_at', p_expires_at
  );

  begin
    insert into public.companion_action_requests (
      organization_id,
      action_key,
      title,
      description,
      reason,
      requested_by,
      requested_for,
      risk_level,
      category,
      required_permission,
      expected_outcome,
      lifecycle_status,
      approval_status,
      execution_status,
      expires_at,
      metadata
    ) values (
      v_org_id,
      p_action_key,
      v_title,
      v_description,
      v_reason,
      v_user_id,
      'Support operations',
      'medium',
      'operations',
      'support.assign',
      v_expected_outcome,
      'awaiting_approval',
      'pending',
      'none',
      p_expires_at,
      v_metadata
    )
    returning * into v_row;

    perform public._caae346_log_audit(
      v_org_id,
      v_user_id,
      'support_action_requested',
      'Governed support action request submitted',
      v_row.id,
      jsonb_build_object(
        'action_key', p_action_key,
        'requested_action', 'assign',
        'idempotency_key', p_idempotency_key,
        'case_id', v_case_id
      )
    );

    return jsonb_build_object(
      'success', true,
      'outcome_code', 'SUPPORT_ACTION_REQUESTED',
      'action_request_id', v_row.id,
      'approval_status', v_row.approval_status,
      'lifecycle_status', v_row.lifecycle_status,
      'expires_at', v_row.expires_at,
      'idempotent_replay', false
    );
  exception
    when unique_violation then
      select * into v_existing
      from public.companion_action_requests r
      where r.organization_id = v_org_id
        and r.metadata->>'domain' = 'support_write'
        and r.metadata->>'schema_version' = 'support_write_v1'
        and r.metadata->>'idempotency_key' = p_idempotency_key
      limit 1;

      if not found then
        raise;
      end if;

      if v_existing.action_key = p_action_key
         and coalesce(v_existing.metadata->>'payload_hash', '') = p_payload_hash then
        return jsonb_build_object(
          'success', true,
          'outcome_code', 'IDEMPOTENT_REPLAY',
          'action_request_id', v_existing.id,
          'approval_status', v_existing.approval_status,
          'lifecycle_status', v_existing.lifecycle_status,
          'expires_at', v_existing.expires_at,
          'idempotent_replay', true
        );
      end if;

      return jsonb_build_object(
        'success', false,
        'outcome_code', 'IDEMPOTENCY_CONFLICT',
        'action_request_id', v_existing.id,
        'approval_status', v_existing.approval_status,
        'lifecycle_status', v_existing.lifecycle_status,
        'expires_at', v_existing.expires_at,
        'idempotent_replay', false
      );
  end;
end;
$$;

revoke all on function public.record_companion_support_action_request(
  text, jsonb, text, text, timestamptz
) from public;

revoke all on function public.record_companion_support_action_request(
  text, jsonb, text, text, timestamptz
) from anon;

grant execute on function public.record_companion_support_action_request(
  text, jsonb, text, text, timestamptz
) to authenticated;

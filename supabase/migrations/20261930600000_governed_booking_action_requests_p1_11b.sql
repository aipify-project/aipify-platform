-- P1.11B — Governed booking action requests (companion_action_requests scheduling writes).
-- Feature owner: CUSTOMER APP. No booking execution — approval queue only.

create unique index if not exists companion_action_requests_booking_write_idempotency_uidx
  on public.companion_action_requests (organization_id, (metadata->>'idempotency_key'))
  where (metadata->>'domain') = 'booking_write'
    and (metadata->>'schema_version') = 'booking_write_v1'
    and coalesce(metadata->>'idempotency_key', '') <> '';

create or replace function public.record_companion_booking_action_request(
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
  v_requested_action text;
  v_appointment_reference text;
  v_title text;
  v_description text;
  v_reason text;
  v_expected_outcome text;
  v_metadata jsonb;
begin
  perform public._irp_require_permission('appointments.manage', v_org_id);

  if p_action_key is null or p_action_key not in ('booking.create', 'booking.update', 'booking.cancel') then
    raise exception 'Unsupported booking action: %', coalesce(p_action_key, '(null)');
  end if;

  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'payload must be a JSON object';
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

  v_requested_action := case p_action_key
    when 'booking.create' then 'create'
    when 'booking.update' then 'update'
    when 'booking.cancel' then 'cancel'
  end;

  if p_action_key = 'booking.create' then
    v_appointment_reference := null;
  else
    v_appointment_reference := coalesce(
      nullif(trim(p_payload->>'appointment_reference'), ''),
      nullif(trim(p_payload->>'booking_id'), ''),
      nullif(trim(p_payload->>'appointment_id'), '')
    );
  end if;

  case p_action_key
    when 'booking.create' then
      v_title := 'Appointment booking request';
      v_description := 'A governed appointment booking change is awaiting approval.';
      v_reason := 'Companion scheduling write proposal';
      v_expected_outcome := 'Appointment booking applied after approval';
    when 'booking.update' then
      v_title := 'Appointment update request';
      v_description := 'A governed appointment update is awaiting approval.';
      v_reason := 'Companion scheduling write proposal';
      v_expected_outcome := 'Appointment update applied after approval';
    when 'booking.cancel' then
      v_title := 'Appointment cancellation request';
      v_description := 'A governed appointment cancellation is awaiting approval.';
      v_reason := 'Companion scheduling write proposal';
      v_expected_outcome := 'Appointment cancellation applied after approval';
  end case;

  select * into v_existing
  from public.companion_action_requests r
  where r.organization_id = v_org_id
    and r.metadata->>'domain' = 'booking_write'
    and r.metadata->>'schema_version' = 'booking_write_v1'
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

  v_metadata := jsonb_build_object(
    'schema_version', 'booking_write_v1',
    'domain', 'booking_write',
    'provider_key', 'appointment_booking',
    'capability_key', p_action_key,
    'requested_action', v_requested_action,
    'payload', p_payload,
    'payload_hash', p_payload_hash,
    'idempotency_key', p_idempotency_key,
    'appointment_reference', v_appointment_reference,
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
      'Scheduling operations',
      'medium',
      'scheduling',
      'appointments.manage',
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
      'booking_action_requested',
      'Governed booking action request submitted',
      v_row.id,
      jsonb_build_object(
        'action_key', p_action_key,
        'requested_action', v_requested_action,
        'idempotency_key', p_idempotency_key
      )
    );

    return jsonb_build_object(
      'success', true,
      'outcome_code', 'BOOKING_ACTION_REQUESTED',
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
        and r.metadata->>'domain' = 'booking_write'
        and r.metadata->>'schema_version' = 'booking_write_v1'
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

create or replace function public.process_companion_action_request(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._caae346_require_org();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_action text := coalesce(p_payload->>'action', '');
  v_id uuid := (p_payload->>'action_id')::uuid;
  v_settings public.companion_action_execution_settings;
  v_req public.companion_action_requests;
begin
  v_settings := public._caae346_ensure_settings(v_org_id);

  if v_action = 'emergency_stop' then
    update public.companion_action_execution_settings set
      emergency_stop_active = true, automation_disabled = true, execution_enabled = false, updated_at = now()
    where organization_id = v_org_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'emergency_stop', 'Emergency stop activated', null, p_payload);
    return public.get_companion_action_center();
  end if;

  if v_settings.emergency_stop_active then
    raise exception 'Companion action execution is paused (emergency stop active)';
  end if;

  if v_id is null then raise exception 'action_id required'; end if;

  select * into v_req from public.companion_action_requests
  where id = v_id and organization_id = v_org_id;
  if not found then raise exception 'Action not found'; end if;

  if v_action = 'approve' then
    perform public._irp_require_permission('ai.approve', v_org_id);
    update public.companion_action_requests set
      approval_status = 'approved', lifecycle_status = 'approved', execution_status = 'queued', updated_at = now()
    where id = v_id;
    insert into public.companion_action_queue (organization_id, action_request_id, queue_status)
    values (v_org_id, v_id, 'queued')
    on conflict (action_request_id) do update set queue_status = 'queued', queued_at = now();
    perform public._caae346_log_audit(v_org_id, v_user_id, 'approval_granted', 'Action approved: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'reject' then
    perform public._irp_require_permission('ai.approve', v_org_id);
    update public.companion_action_requests set
      approval_status = 'rejected', lifecycle_status = 'rejected', execution_status = 'cancelled', updated_at = now()
    where id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'approval_rejected', 'Action rejected: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'request_changes' then
    perform public._irp_require_permission('ai.approve', v_org_id);
    update public.companion_action_requests set
      approval_status = 'changes_requested', lifecycle_status = 'proposed', updated_at = now()
    where id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'changes_requested', 'Changes requested: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'execute' and v_req.approval_status = 'approved' then
    update public.companion_action_requests set lifecycle_status = 'executing', execution_status = 'executing', updated_at = now()
    where id = v_id;
    update public.companion_action_queue set queue_status = 'executing', started_at = now() where action_request_id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'execution_started', 'Execution started: ' || v_req.title, v_id, p_payload);

    update public.companion_action_requests set lifecycle_status = 'completed', execution_status = 'completed', updated_at = now()
    where id = v_id;
    update public.companion_action_queue set queue_status = 'completed', completed_at = now() where action_request_id = v_id;
    insert into public.companion_action_receipts (
      organization_id, action_request_id, result_summary, duration_ms, approver_id, audit_reference
    ) values (
      v_org_id, v_id, coalesce(p_payload->>'result_summary', 'Action completed successfully.'), 850, v_user_id,
      'AUD-' || left(v_id::text, 8)
    ) on conflict (action_request_id) do nothing;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'execution_completed', 'Execution completed: ' || v_req.title, v_id, p_payload);

  else
    raise exception 'Unsupported action or action not approved for execution';
  end if;

  return public.get_companion_action_center();
end; $$;

grant execute on function public.record_companion_booking_action_request(
  text, jsonb, text, text, timestamptz
) to authenticated;

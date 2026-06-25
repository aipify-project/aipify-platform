-- P1.11C3A — Org-scoped booking action request read RPC.
-- Feature owner: CUSTOMER APP. Read-only verification — no booking execution.

create or replace function public.get_companion_booking_action_request(
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
begin
  v_ctx := public._caae346_require_org();
  v_org_id := (v_ctx->>'organization_id')::uuid;

  perform public._irp_require_permission('appointments.manage', v_org_id);

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
    and r.action_key in ('booking.create', 'booking.update', 'booking.cancel')
    and coalesce(r.metadata->>'domain', '') = 'booking_write'
    and coalesce(r.metadata->>'schema_version', '') = 'booking_write_v1';

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

  return jsonb_build_object(
    'success', true,
    'outcome_code', 'BOOKING_ACTION_REQUEST_FOUND',
    'action_request_id', v_row.id,
    'action_key', v_row.action_key,
    'approval_status', v_row.approval_status,
    'lifecycle_status', v_row.lifecycle_status,
    'execution_status', v_row.execution_status,
    'expires_at', v_row.expires_at,
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

revoke all on function public.get_companion_booking_action_request(uuid) from public;
revoke all on function public.get_companion_booking_action_request(uuid) from anon;
grant execute on function public.get_companion_booking_action_request(uuid) to authenticated;

-- Hotfix cancel RPC status values to match kompis_operator_runs check constraints.
-- approval_status allows: not_required|pending|approved|rejected
-- status allows: ...|failed|rejected|planned (no cancelled)

create or replace function public.cancel_incomplete_kompis_website_approval(
  p_action_request_id uuid,
  p_reason text default 'Approval scope was incomplete and unsafe for execution.'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_req public.action_requests%rowtype;
  v_binding public.kompis_operator_core_approval_bindings;
  v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 500);
  v_email text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  if v_reason is null then
    v_reason := 'Approval scope was incomplete and unsafe for execution.';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_action_request_id and tenant_id = v_org
  for update;
  if v_req.id is null then
    raise exception 'NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where action_request_id = v_req.id and organization_id = v_org
  for update;

  if v_binding.id is not null
     and v_binding.tool_key = 'website_publish_approved_draft'
     and v_binding.cancelled_at is null
     and (
       v_binding.website_id is null
       or v_binding.path is null
       or v_binding.candidate_id is null
       or v_binding.expected_current_version_id is null
       or v_binding.action_checksum is null
       or coalesce(v_binding.scope_json, '{}'::jsonb) = '{}'::jsonb
     ) then
    update public.kompis_operator_core_approval_bindings
    set
      cancelled_at = now(),
      cancel_reason = v_reason,
      updated_at = now()
    where id = v_binding.id;
  elsif v_binding.id is null then
    null;
  else
    raise exception 'CLEANUP_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  if v_req.status = 'pending' then
    update public.action_requests
    set status = 'cancelled', updated_at = now()
    where id = v_req.id;
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  perform public.log_action_audit(
    v_req.id,
    'cancelled',
    coalesce(v_email, 'system'),
    jsonb_build_object('reason', v_reason, 'source', 'kompis_fail_closed_cleanup')
  );

  update public.kompis_operator_runs
  set
    status = 'failed',
    approval_status = 'rejected',
    safe_error_code = 'approval_scope_incomplete',
    result_summary = v_reason,
    updated_at = now()
  where organization_id = v_org
    and core_approval_request_id = v_req.id
    and status in ('awaiting_approval', 'planned');

  perform public.record_trust_audit_event(
    v_org,
    'kompis_incomplete_website_approval_cancelled',
    'success',
    'kompis_operator',
    left(v_reason, 200),
    'operator',
    null,
    jsonb_build_object(
      'action_request_id', v_req.id,
      'binding_id', v_binding.id,
      'reason', v_reason
    )
  );

  return jsonb_build_object(
    'ok', true,
    'action_request_id', v_req.id,
    'status', 'cancelled',
    'binding_cancelled', v_binding.id is not null
  );
end;
$$;

revoke all on function public.cancel_incomplete_kompis_website_approval(uuid, text) from public, anon;
grant execute on function public.cancel_incomplete_kompis_website_approval(uuid, text) to authenticated;

create or replace function public.cancel_false_pending_kompis_operator_run(
  p_run_id uuid,
  p_reason text default 'Run was awaiting approval without a valid CORE approval.'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 500);
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  if v_reason is null then
    v_reason := 'Run was awaiting approval without a valid CORE approval.';
  end if;

  select * into v_run
  from public.kompis_operator_runs
  where id = p_run_id and organization_id = v_org
  for update;
  if v_run.id is null then
    raise exception 'RUN_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_run.status <> 'awaiting_approval' or v_run.core_approval_request_id is not null then
    raise exception 'CLEANUP_NOT_ELIGIBLE' using errcode = 'P0001';
  end if;

  update public.kompis_operator_runs
  set
    status = 'failed',
    approval_status = 'rejected',
    safe_error_code = 'false_pending_without_core_approval',
    result_summary = v_reason,
    updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_false_pending_run_cancelled',
    'success',
    'kompis_operator',
    left(v_reason, 200),
    'operator',
    null,
    jsonb_build_object('run_id', v_run.id, 'reason', v_reason)
  );

  return jsonb_build_object('ok', true, 'run_id', v_run.id, 'status', 'failed');
end;
$$;

revoke all on function public.cancel_false_pending_kompis_operator_run(uuid, text) from public, anon;
grant execute on function public.cancel_false_pending_kompis_operator_run(uuid, text) to authenticated;

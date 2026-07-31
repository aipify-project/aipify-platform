-- AIPIFY.KOMPIS.CORE.APPROVAL.CREATION.DISCOVERY.USER.FLOW.V1
-- Create authoritative CORE.APPROVAL (action_requests) at run creation for
-- publish/rollback tools; unlock runs only via CORE decision; leave Kompis
-- approvals approved until Kompis consumes them. Apply-side effects = 0.

-- ---------------------------------------------------------------------------
-- 1. execute_action_request: do not consume Kompis website approvals early
-- ---------------------------------------------------------------------------
create or replace function public.execute_action_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_req public.action_requests%rowtype;
  v_emergency public.tenant_action_emergency;
  v_email text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_emergency := public.ensure_tenant_action_emergency(v_tenant_id);
  if v_emergency.state in ('paused', 'emergency_shutdown') then
    raise exception 'Execution blocked — emergency stop active';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_request_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Action request not found';
  end if;

  if v_req.status not in ('approved', 'pending') then
    raise exception 'Action cannot be executed in current status';
  end if;

  if v_req.risk_level >= 1 and v_req.status = 'pending' then
    raise exception 'Approval required before execution';
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  -- Website Kompis publish/rollback is executed by the Kompis operator after
  -- CORE approval. Keep status approved until consume_kompis_operator_core_approval.
  if coalesce(v_req.resource_type, '') = 'kompis_operator_run' then
    perform public.log_action_audit(
      p_request_id,
      'approved_ready',
      coalesce(v_email, 'system'),
      jsonb_build_object('deferred_to', 'kompis_operator')
    );
    return jsonb_build_object(
      'ok', true,
      'status', 'approved',
      'deferred_execution', true,
      'resource_type', v_req.resource_type
    );
  end if;

  update public.action_requests
  set status = 'executing', updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(p_request_id, 'executing', v_email, '{}'::jsonb);

  update public.action_requests
  set status = 'completed', executed_at = now(), updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(p_request_id, 'completed', v_email, '{}'::jsonb);

  return jsonb_build_object('ok', true, 'status', 'completed');
end;
$$;

revoke all on function public.execute_action_request(uuid) from public, anon;
grant execute on function public.execute_action_request(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Optional reason on approve_action_request
-- ---------------------------------------------------------------------------
drop function if exists public.approve_action_request(uuid);

create or replace function public.approve_action_request(
  p_request_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_req public.action_requests%rowtype;
  v_role text;
  v_email text;
  v_reason text := left(btrim(coalesce(p_reason, '')), 500);
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_req
  from public.action_requests
  where id = p_request_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Action request not found';
  end if;

  if v_req.status <> 'pending' then
    raise exception 'Action is not pending approval';
  end if;

  if v_req.risk_level >= 4 then
    raise exception 'Critical actions cannot be approved for AI execution';
  end if;

  select u.role, coalesce(au.email, 'unknown')
  into v_role, v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  if not public._user_can_approve_action(v_role, v_req.approver_role_required) then
    raise exception 'Insufficient role to approve this action';
  end if;

  if coalesce(v_req.resource_type, '') = 'kompis_operator_run'
     and (v_reason is null or char_length(v_reason) < 3) then
    raise exception 'REASON_REQUIRED';
  end if;

  update public.action_requests
  set status = 'approved', approved_by = v_email, approved_at = now(), updated_at = now()
  where id = p_request_id;

  perform public.log_action_audit(
    p_request_id, 'approved', v_email,
    jsonb_build_object(
      'approver_role', v_role,
      'reason', nullif(v_reason, '')
    )
  );

  return jsonb_build_object('ok', true, 'status', 'approved');
end;
$$;

revoke all on function public.approve_action_request(uuid, text) from public, anon;
grant execute on function public.approve_action_request(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Sync trigger: CORE decision unlocks / rejects the Kompis run
-- ---------------------------------------------------------------------------
create or replace function public._kompis_sync_run_from_core_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_binding public.kompis_operator_core_approval_bindings;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;
  if new.status is not distinct from old.status then
    return new;
  end if;
  if new.status not in ('approved', 'rejected') then
    return new;
  end if;

  select * into v_binding
  from public.kompis_operator_core_approval_bindings
  where action_request_id = new.id
  limit 1;
  if v_binding.id is null then
    return new;
  end if;

  if new.status = 'approved' then
    insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
    select
      v_binding.run_id,
      ou.user_id,
      coalesce(ou.role::text, 'administrator'),
      true,
      'Mirrored from Approval Center (CORE.APPROVAL).',
      'approved'
    from public.organization_users ou
    where ou.organization_id = v_binding.organization_id
      and ou.status = 'active'
      and ou.role in ('owner', 'administrator')
    order by case when ou.role = 'owner' then 0 else 1 end
    limit 1;

    update public.kompis_operator_runs
    set
      core_approval_request_id = new.id,
      core_approval_required = true,
      approval_status = 'approved',
      status = case
        when status in ('awaiting_approval', 'planned') then 'planned'
        else status
      end,
      updated_at = now()
    where id = v_binding.run_id
      and organization_id = v_binding.organization_id
      and approval_status <> 'rejected';
  elsif new.status = 'rejected' then
    insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
    select
      v_binding.run_id,
      ou.user_id,
      coalesce(ou.role::text, 'administrator'),
      false,
      'Rejected in Approval Center (CORE.APPROVAL).',
      'rejected'
    from public.organization_users ou
    where ou.organization_id = v_binding.organization_id
      and ou.status = 'active'
      and ou.role in ('owner', 'administrator')
    order by case when ou.role = 'owner' then 0 else 1 end
    limit 1;

    update public.kompis_operator_runs
    set
      approval_status = 'rejected',
      status = 'rejected',
      core_approval_request_id = new.id,
      completed_at = coalesce(completed_at, now()),
      updated_at = now()
    where id = v_binding.run_id
      and organization_id = v_binding.organization_id;
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. create_run: create CORE approval before awaiting_approval
-- ---------------------------------------------------------------------------
create or replace function public.create_app_kompis_operator_run(
  p_conversation_id uuid,
  p_request_text text,
  p_plan jsonb,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_user uuid;
  v_role text;
  v_conv public.kompis_operator_conversations;
  v_plan jsonb := coalesce(p_plan, '{}'::jsonb);
  v_request text := left(btrim(coalesce(p_request_text, '')), 4000);
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_prior public.kompis_operator_runs;
  v_risk int;
  v_requires boolean;
  v_status text;
  v_approval text;
  v_run_id uuid;
  v_step jsonb;
  v_tool text;
  v_seq int;
  v_needs_core boolean := false;
  v_step_id uuid;
  v_core_request_id uuid;
  v_requested jsonb;
  v_scope jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  v_user := (v_access->>'user_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');

  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 or v_key !~ '^kor-' then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if v_request = '' or char_length(v_request) < 2 then
    raise exception 'INVALID_REQUEST' using errcode = 'P0001';
  end if;

  select * into v_prior
  from public.kompis_operator_runs
  where organization_id = v_org and idempotency_key = v_key
  limit 1;
  if v_prior.id is not null then
    if v_prior.request_text <> v_request or v_prior.conversation_id <> p_conversation_id then
      raise exception 'IDEMPOTENCY_CONFLICT' using errcode = 'P0001';
    end if;
    return jsonb_build_object(
      'id', v_prior.id,
      'idempotent_replay', true,
      'status', v_prior.status,
      'approval_status', v_prior.approval_status,
      'core_approval_required', v_prior.core_approval_required,
      'core_approval_request_id', v_prior.core_approval_request_id,
      'plan', v_prior.plan_json
    );
  end if;

  select * into v_conv from public.kompis_operator_conversations
  where id = p_conversation_id and organization_id = v_org for update;
  if v_conv.id is null then
    raise exception 'CONVERSATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_risk := coalesce((v_plan->>'riskClass')::int, 0);
  if v_risk < 0 or v_risk > 3 then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;
  if v_risk = 3 then
    raise exception 'CRITICAL_BLOCKED' using errcode = 'P0001';
  end if;

  if jsonb_typeof(v_plan->'steps') <> 'array' or jsonb_array_length(v_plan->'steps') < 1 or jsonb_array_length(v_plan->'steps') > 8 then
    raise exception 'INVALID_PLAN' using errcode = 'P0001';
  end if;

  for v_step in select * from jsonb_array_elements(v_plan->'steps')
  loop
    v_tool := v_step->>'toolKey';
    if not public._kompis_operator_tool_allowed(v_tool) then
      raise exception 'TOOL_NOT_ALLOWED' using errcode = 'P0001';
    end if;
    if public._kompis_operator_tool_requires_core_approval(v_tool) then
      v_needs_core := true;
    end if;
  end loop;

  v_requires := coalesce((v_plan->>'requiresApproval')::boolean, v_risk >= 1) or v_needs_core;

  -- Never advertise awaiting_approval for CORE-gated tools until action_request exists.
  if v_needs_core then
    v_status := 'planned';
    v_approval := 'pending';
  elsif v_requires then
    v_status := 'awaiting_approval';
    v_approval := 'pending';
  else
    v_status := 'planned';
    v_approval := 'not_required';
  end if;

  insert into public.kompis_operator_runs (
    conversation_id, organization_id, requested_by, request_text, normalized_request,
    intent, user_summary, risk_class, requires_approval, status, approval_status,
    idempotency_key, plan_json, started_at, core_approval_required
  ) values (
    v_conv.id, v_org, v_user, v_request, lower(v_request),
    v_plan->>'intent', v_plan->>'userSummary', v_risk, v_requires, v_status, v_approval,
    v_key, v_plan, now(), v_needs_core
  ) returning id into v_run_id;

  v_scope := coalesce(v_plan->'scope', '{}'::jsonb);

  for v_step in select * from jsonb_array_elements(v_plan->'steps')
  loop
    v_seq := coalesce((v_step->>'sequence')::int, 0);
    v_tool := v_step->>'toolKey';
    insert into public.kompis_operator_steps (
      run_id, sequence, tool_key, tool_version, risk_class, purpose, requires_approval, status
    ) values (
      v_run_id,
      v_seq,
      v_tool,
      coalesce(v_step->>'toolVersion', '1'),
      coalesce((v_step->>'riskClass')::int, v_risk),
      coalesce(v_step->>'purpose', ''),
      coalesce(
        (v_step->>'requiresApproval')::boolean,
        v_requires or public._kompis_operator_tool_requires_core_approval(v_tool)
      ),
      'pending'
    ) returning id into v_step_id;

    if public._kompis_operator_tool_requires_core_approval(v_tool) then
      begin
        v_requested := public.request_kompis_operator_core_approval(
          v_run_id,
          v_step_id,
          v_tool,
          v_scope
        );
      exception
        when others then
          raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
      end;

      v_core_request_id := nullif(v_requested->>'action_request_id', '')::uuid;
      if v_core_request_id is null then
        raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
      end if;
    end if;
  end loop;

  if v_needs_core then
    if v_core_request_id is null then
      raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
    end if;
    update public.kompis_operator_runs
    set
      status = 'awaiting_approval',
      approval_status = 'pending',
      core_approval_required = true,
      core_approval_request_id = v_core_request_id,
      requires_approval = true,
      updated_at = now()
    where id = v_run_id;
    v_status := 'awaiting_approval';
    v_approval := 'pending';
  end if;

  update public.kompis_operator_conversations set updated_at = now() where id = v_conv.id;

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_run_created',
    'success',
    'kompis_operator',
    left(v_request, 200),
    'operator',
    null,
    jsonb_build_object(
      'run_id', v_run_id,
      'risk_class', v_risk,
      'idempotency_key', v_key,
      'conversation_id', v_conv.id,
      'core_approval_required', v_needs_core,
      'core_approval_request_id', v_core_request_id
    )
  );

  return jsonb_build_object(
    'id', v_run_id,
    'idempotent_replay', false,
    'status', v_status,
    'approval_status', v_approval,
    'risk_class', v_risk,
    'requires_approval', v_requires,
    'core_approval_required', v_needs_core,
    'core_approval_request_id', v_core_request_id,
    'plan', v_plan
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) from public, anon;
grant execute on function public.create_app_kompis_operator_run(uuid, text, jsonb, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Local approve cannot decide CORE-gated runs
-- ---------------------------------------------------------------------------
create or replace function public.approve_app_kompis_operator_run(
  p_run_id uuid,
  p_confirmation boolean,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_role text;
  v_run public.kompis_operator_runs;
  v_reason text := left(btrim(coalesce(p_reason, '')), 500);
  v_needs_core boolean := false;
  v_step record;
  v_binding public.kompis_operator_core_approval_bindings;
  v_requested jsonb := '{}'::jsonb;
  v_core_id uuid;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  v_role := coalesce(v_access->>'organization_role', '');

  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_run.approval_status = 'approved' then
    return jsonb_build_object(
      'id', v_run.id,
      'approval_status', 'approved',
      'status', v_run.status,
      'core_approval_required', v_run.core_approval_required,
      'core_approval_request_id', v_run.core_approval_request_id,
      'idempotent_replay', true
    );
  end if;
  if v_run.approval_status <> 'pending' then
    raise exception 'APPROVAL_NOT_PENDING' using errcode = 'P0001';
  end if;

  select exists (
    select 1
    from public.kompis_operator_steps s
    where s.run_id = v_run.id
      and public._kompis_operator_tool_requires_core_approval(s.tool_key)
  ) into v_needs_core;

  if v_needs_core or v_run.core_approval_required then
    for v_step in
      select *
      from public.kompis_operator_steps s
      where s.run_id = v_run.id
        and public._kompis_operator_tool_requires_core_approval(s.tool_key)
      order by s.sequence
    loop
      select * into v_binding
      from public.kompis_operator_core_approval_bindings b
      where b.organization_id = v_org
        and b.run_id = v_run.id
        and b.tool_key = v_step.tool_key
      order by b.created_at desc
      limit 1;

      if v_binding.id is null then
        begin
          v_requested := public.request_kompis_operator_core_approval(
            v_run.id,
            v_step.id,
            v_step.tool_key,
            coalesce(v_run.plan_json->'scope', '{}'::jsonb)
          );
        exception
          when others then
            raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
        end;
        v_core_id := nullif(v_requested->>'action_request_id', '')::uuid;
      else
        v_core_id := v_binding.action_request_id;
        v_requested := jsonb_build_object(
          'action_request_id', v_binding.action_request_id,
          'idempotent_replay', true
        );
      end if;
    end loop;

    if v_core_id is null then
      raise exception 'CORE_APPROVAL_CREATE_FAILED' using errcode = 'P0001';
    end if;

    update public.kompis_operator_runs
    set
      status = 'awaiting_approval',
      approval_status = 'pending',
      core_approval_required = true,
      core_approval_request_id = v_core_id,
      requires_approval = true,
      updated_at = now()
    where id = v_run.id;

    -- Local approve is never authoritative for CORE-gated tools.
    return jsonb_build_object(
      'id', v_run.id,
      'approval_status', 'pending',
      'status', 'awaiting_approval',
      'core_approval_required', true,
      'core_approval_request_id', v_core_id,
      'decision_path', 'approval_center',
      'code', 'core_approval_decision_required',
      'idempotent_replay', false
    );
  end if;

  if coalesce(p_confirmation, false) is not true then
    raise exception 'CONFIRMATION_REQUIRED' using errcode = 'P0001';
  end if;
  if v_run.risk_class >= 2 and lower(v_role) not in ('owner', 'admin', 'organization_owner', 'organization_admin') then
    raise exception 'APPROVAL_ROLE_REQUIRED' using errcode = 'P0001';
  end if;
  if v_run.risk_class >= 2 and (v_reason is null or char_length(v_reason) < 3) then
    raise exception 'REASON_REQUIRED' using errcode = 'P0001';
  end if;

  insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
  values (v_run.id, (v_access->>'user_id')::uuid, v_role, true, v_reason, 'approved');

  update public.kompis_operator_runs
  set approval_status = 'approved', status = 'planned', updated_at = now()
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org, 'kompis_operator_run_approved', 'success', 'kompis_operator', v_reason, 'operator', null,
    jsonb_build_object('run_id', v_run.id, 'role', v_role, 'core_gated', false)
  );

  return jsonb_build_object(
    'id', v_run.id,
    'approval_status', 'approved',
    'status', 'planned',
    'core_approval_required', false,
    'core_approval_request_id', null,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.approve_app_kompis_operator_run(uuid, boolean, text) from public, anon;
grant execute on function public.approve_app_kompis_operator_run(uuid, boolean, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Reject also rejects pending CORE approval
-- ---------------------------------------------------------------------------
create or replace function public.reject_app_kompis_operator_run(p_run_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org uuid;
  v_run public.kompis_operator_runs;
  v_reason text := left(btrim(coalesce(p_reason, '')), 500);
  v_email text;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access->>'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org := (v_access->>'organization_id')::uuid;
  select * into v_run from public.kompis_operator_runs where id = p_run_id and organization_id = v_org for update;
  if v_run.id is null then raise exception 'RUN_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_run.approval_status = 'rejected' then
    return jsonb_build_object('id', v_run.id, 'approval_status', 'rejected', 'status', 'rejected', 'idempotent_replay', true);
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.id = (v_access->>'user_id')::uuid
  limit 1;

  if v_run.core_approval_request_id is not null then
    update public.action_requests
    set status = 'rejected', updated_at = now()
    where id = v_run.core_approval_request_id
      and tenant_id = v_org
      and status = 'pending';

    if found then
      perform public.log_action_audit(
        v_run.core_approval_request_id,
        'rejected',
        coalesce(v_email, 'system'),
        jsonb_build_object('reason', v_reason, 'source', 'kompis_operator')
      );
    end if;
  end if;

  insert into public.kompis_operator_approvals (run_id, approved_by, role_snapshot, confirmation, reason, decision)
  values (v_run.id, (v_access->>'user_id')::uuid, v_access->>'organization_role', false, v_reason, 'rejected');

  update public.kompis_operator_runs
  set approval_status = 'rejected', status = 'rejected', completed_at = now(), updated_at = now(), result_summary = 'Plan rejected'
  where id = v_run.id;

  perform public.record_trust_audit_event(
    v_org, 'kompis_operator_run_rejected', 'blocked', 'kompis_operator', v_reason, 'operator', null,
    jsonb_build_object(
      'run_id', v_run.id,
      'core_approval_request_id', v_run.core_approval_request_id
    )
  );

  return jsonb_build_object(
    'id', v_run.id,
    'approval_status', 'rejected',
    'status', 'rejected',
    'core_approval_request_id', v_run.core_approval_request_id,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.reject_app_kompis_operator_run(uuid, text) from public, anon;
grant execute on function public.reject_app_kompis_operator_run(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Mark CORE action completed when Kompis consumes approval
-- ---------------------------------------------------------------------------
create or replace function public.consume_kompis_operator_core_approval(
  p_run_id uuid,
  p_step_id uuid,
  p_tool_key text,
  p_scope jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ready jsonb;
  v_binding_id uuid;
  v_action_id uuid;
  v_access jsonb;
  v_org uuid;
  v_email text;
begin
  v_ready := public.assert_kompis_operator_core_approval_ready(p_run_id, p_step_id, p_tool_key, p_scope);
  if coalesce((v_ready->>'required')::boolean, false) is not true then
    return v_ready;
  end if;

  v_access := public._kompis_operator_require_access();
  v_org := (v_access->>'organization_id')::uuid;
  v_binding_id := (v_ready->>'binding_id')::uuid;
  v_action_id := (v_ready->>'action_request_id')::uuid;

  update public.kompis_operator_core_approval_bindings
  set used_at = now(), updated_at = now()
  where id = v_binding_id
    and organization_id = v_org
    and used_at is null;

  if not found then
    raise exception 'CORE_APPROVAL_ALREADY_USED' using errcode = 'P0001';
  end if;

  select coalesce(au.email, 'system') into v_email
  from public.users u
  left join auth.users au on au.id = u.auth_user_id
  where u.auth_user_id = auth.uid()
  limit 1;

  update public.action_requests
  set
    status = 'completed',
    executed_at = coalesce(executed_at, now()),
    updated_at = now()
  where id = v_action_id
    and tenant_id = v_org
    and status = 'approved';

  perform public.log_action_audit(
    v_action_id,
    'executed',
    coalesce(v_email, 'system'),
    jsonb_build_object(
      'source', 'kompis_operator',
      'run_id', p_run_id,
      'step_id', p_step_id,
      'tool_key', p_tool_key,
      'binding_id', v_binding_id
    )
  );

  perform public.record_trust_audit_event(
    v_org,
    'kompis_operator_core_approval_consumed',
    'success',
    'kompis_operator',
    left(p_tool_key, 80),
    'operator',
    null,
    jsonb_build_object(
      'run_id', p_run_id,
      'step_id', p_step_id,
      'tool_key', p_tool_key,
      'action_request_id', v_action_id,
      'binding_id', v_binding_id
    )
  );

  return jsonb_build_object(
    'ok', true,
    'required', true,
    'binding_id', v_binding_id,
    'action_request_id', v_action_id,
    'consumed', true
  );
end;
$$;

revoke all on function public.consume_kompis_operator_core_approval(uuid, uuid, text, jsonb) from public, anon;
grant execute on function public.consume_kompis_operator_core_approval(uuid, uuid, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Approval Center titles for Kompis website actions + source metadata
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_approvals_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('approvals.view')
     and not public.has_organization_permission('approvals.manage') then
    raise exception 'Permission denied: approvals.view';
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'philosophy', 'Assist. Recommend. Execute responsibly. Aipify never performs irreversible or sensitive actions without appropriate authorization.',
    'mission', 'Allow Aipify to automate and perform approved actions while ensuring humans remain informed and empowered.',
    'abos_principle', 'Automation should strengthen human capability. Not replace human responsibility.',
    'vision', 'Organizations move faster without sacrificing trust, governance, or accountability.',
    'core_philosophy', jsonb_build_array('Assist', 'Recommend', 'Execute responsibly'),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 6 — Action & Approval Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE6_ACTION_APPROVAL_FOUNDATION.md'
    ),
    'action_categories', jsonb_build_array(
      jsonb_build_object(
        'key', 'low',
        'label', 'Low Risk Actions',
        'approval', 'automatic_permitted',
        'examples', jsonb_build_array(
          'Draft responses', 'Create reminders', 'Organize information',
          'Generate reports', 'Recommend knowledge articles'
        ),
        'trust_action_levels', jsonb_build_array(0, 1)
      ),
      jsonb_build_object(
        'key', 'medium',
        'label', 'Medium Risk Actions',
        'approval', 'human_review_recommended',
        'examples', jsonb_build_array(
          'Send approved emails', 'Update documentation', 'Create support tickets',
          'Schedule meetings', 'Modify operational records'
        ),
        'trust_action_levels', jsonb_build_array(1, 2)
      ),
      jsonb_build_object(
        'key', 'high',
        'label', 'High Risk Actions',
        'approval', 'explicit_approval_required',
        'examples', jsonb_build_array(
          'Delete data', 'Change permissions', 'Execute financial actions',
          'Publish externally', 'Modify governance settings'
        ),
        'trust_action_levels', jsonb_build_array(3, 4)
      )
    ),
    'approval_principles', jsonb_build_array(
      jsonb_build_object('risk', 'low', 'rule', 'Automatic execution permitted'),
      jsonb_build_object('risk', 'medium', 'rule', 'Human review recommended'),
      jsonb_build_object('risk', 'high', 'rule', 'Explicit approval required')
    ),
    'approval_workflow_fields', jsonb_build_array(
      'Action summary', 'Reason for recommendation', 'Expected outcome',
      'Potential risks', 'Approval history', 'Responsible approver'
    ),
    'transparency_requirements', jsonb_build_array(
      'What Aipify proposes',
      'Why the action is recommended',
      'What systems are affected',
      'Whether approval is required',
      'Whether the action succeeded'
    ),
    'self_love_note', 'Self Love (A.76 planned) encourages thoughtful action — discouraging impulsive decisions, recommending reflection, and promoting sustainable operational practices.',
    'audit_requirements', jsonb_build_array(
      'Who initiated the action',
      'Who approved the action',
      'What occurred',
      'When it occurred',
      'Which systems were affected'
    ),
    'dogfooding', jsonb_build_object(
      'principle', 'Aipify Group validates action workflows internally; external pilots validate customer workflows.',
      'aipify_group', jsonb_build_object('slug', 'aipify-group')
    ),
    'success_criteria', public._tae_blueprint_success_criteria(v_tenant_id),
    'vision_phrases', jsonb_build_array(
      'Yes, Aipify can handle that.',
      'Because they understand exactly how and why it works.'
    ),
    'integration_links', jsonb_build_array(
      jsonb_build_object('label', 'Human Oversight Engine (A.40)', 'route', '/app/human-oversight-engine'),
      jsonb_build_object('label', 'Secure AI Actions (A.3)', 'route', '/app/secure-ai-actions'),
      jsonb_build_object('label', 'Trust & Explainability (Phase 76)', 'route', '/app/trust'),
      jsonb_build_object('label', 'Governance & Policy (A.14)', 'route', '/app/governance-policy-engine'),
      jsonb_build_object('label', 'Action Center (AEF)', 'route', '/app/action-center'),
      jsonb_build_object('label', 'Kompis', 'route', '/app/kompis')
    ),
    'emergency_state', (select state from public.tenant_action_emergency where tenant_id = v_tenant_id),
    'summary', jsonb_build_object(
      'pending_approvals', coalesce((
        select count(*) from public.action_requests
        where tenant_id = v_tenant_id and status = 'pending'
      ), 0),
      'high_risk_pending', coalesce((
        select count(*) from public.action_requests
        where tenant_id = v_tenant_id and status = 'pending' and risk_level >= 3
      ), 0),
      'audit_events', coalesce((
        select count(*) from public.action_audit_logs where tenant_id = v_tenant_id
      ), 0)
    ),
    'approvals', coalesce(
      (
        select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', ar.id,
            'title', case
              when ar.action_name = 'website_publish_approved_draft' then 'Kompis: publish website draft'
              when ar.action_name = 'website_publish_rollback' then 'Kompis: roll back website version'
              else coalesce(s.name, 'Aipify') || ': ' || ar.action_name
            end,
            'description', coalesce(ae.explanation, ar.description),
            'category', 'action',
            'status', ar.status,
            'risk_level', ar.risk_level::text,
            'action_name', ar.action_name,
            'skill_name', s.name,
            'confidence_score', ae.confidence_score,
            'approver_role_required', ar.approver_role_required,
            'undo_available', ar.undo_available,
            'created_at', ar.created_at,
            'source', case
              when ar.resource_type = 'kompis_operator_run' then 'kompis'
              else 'trust_action'
            end,
            'resource_type', ar.resource_type,
            'resource_id', ar.resource_id,
            'return_to_kompis', case
              when ar.resource_type = 'kompis_operator_run' then true
              else false
            end
          ) as row
          from public.action_requests ar
          left join public.skills s on s.id = ar.skill_id
          left join public.action_explanations ae on ae.action_request_id = ar.id
          where ar.tenant_id = v_tenant_id
            and ar.status in ('pending', 'approved', 'executing')
          union all
          select jsonb_build_object(
            'id', n.id,
            'title', n.title,
            'description', coalesce(n.body, ''),
            'category', 'notification',
            'status', case n.status
              when 'acted' then 'approved'
              when 'dismissed' then 'rejected'
              else 'pending'
            end,
            'risk_level', n.level,
            'created_at', n.created_at,
            'source', 'notification'
          )
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.level in ('action_required', 'important', 'critical')
          union all
          select jsonb_build_object(
            'id', ip.id,
            'title', ip.pattern_title,
            'description', coalesce(ip.suggested_action, 'Recommended action awaiting approval.'),
            'category', 'recommendation',
            'status', case ip.approval_status
              when 'approved' then 'approved'
              when 'rejected' then 'rejected'
              else 'pending'
            end,
            'risk_level', coalesce(ip.potential_impact, 'medium'),
            'created_at', ip.created_at,
            'source', 'recommendation'
          )
          from public.intelligence_patterns ip
          where ip.approval_status in ('pending', 'approved', 'rejected')
            and (ip.tenant_id = v_tenant_id or ip.tenant_id is null)
        ) combined
      ),
      '[]'::jsonb
    )
  );
end;
$$;

revoke all on function public.get_customer_approvals_center() from public, anon;
grant execute on function public.get_customer_approvals_center() to authenticated;

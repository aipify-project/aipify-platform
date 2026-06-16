-- Phase 262 — Action Center Approval & Delegation Engine

create or replace function public._acad_workflow_type(
  p_requires_approval boolean,
  p_required_approvals integer,
  p_risk_level text,
  p_multi_admin boolean
)
returns text
language sql
immutable
as $$
  select case
    when not coalesce(p_requires_approval, true) then 'none'
    when coalesce(p_risk_level, 'low') = 'critical' then 'executive'
    when coalesce(p_required_approvals, 1) > 1 and coalesce(p_multi_admin, false) then 'multi_step'
    when coalesce(p_required_approvals, 1) > 1 then 'parallel'
    else 'single'
  end;
$$;

create or replace function public._acad_sla_status(p_created_at timestamptz, p_escalated boolean)
returns text
language sql
immutable
as $$
  select case
    when p_escalated then 'escalated'
    when p_created_at is null then 'on_track'
    when now() - p_created_at > interval '48 hours' then 'overdue'
    when now() - p_created_at > interval '24 hours' then 'approaching_deadline'
    else 'on_track'
  end;
$$;

create or replace function public._acad_current_owner(p_action_id uuid)
returns text
language sql
stable
as $$
  select coalesce(
    (
      select l.metadata_json ->> 'delegate_to'
      from public.aipify_action_logs l
      where l.action_id = p_action_id
        and l.event_type in ('action_delegated', 'delegation_assigned', 'delegate_review')
      order by l.created_at desc
      limit 1
    ),
    (
      select l.metadata_json ->> 'owner'
      from public.aipify_action_logs l
      where l.action_id = p_action_id
        and l.event_type = 'action_created'
      order by l.created_at asc
      limit 1
    ),
    'Unassigned'
  );
$$;

create or replace function public.get_action_center_approval_delegation_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
  v_settings public.aef_settings;
  v_plan text;
  v_has_access boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('found', false);
  end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');
  v_settings := public.ensure_aef_settings(v_tenant_id);
  v_role := public._aef_user_role();

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'user_role', v_role,
    'settings', jsonb_build_object(
      'multi_admin_approval', v_settings.multi_admin_approval,
      'allow_critical_review', v_settings.allow_critical_review
    ),
    'executive_summary', jsonb_build_object(
      'approval_health_score', greatest(
        40,
        least(
          98,
          100
            - (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'pending_approval' and created_at < now() - interval '48 hours') * 4
            - (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'pending_approval' and risk_level in ('high', 'critical')) * 2
        )
      ),
      'critical_blocked', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status in ('pending_approval', 'blocked') and risk_level = 'critical'),
      'high_risk_awaiting', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'pending_approval' and risk_level in ('high', 'critical')),
      'avg_cycle_hours', coalesce(
        (select round(avg(extract(epoch from (coalesce(approved_at, now()) - created_at)) / 3600.0)::numeric, 1)
         from public.aipify_actions
         where tenant_id = v_tenant_id and approved_at is not null
           and created_at > now() - interval '30 days'),
        0
      ),
      'delegation_events_30d', (
        select count(*) from public.aipify_action_logs l
        where l.tenant_id = v_tenant_id
          and l.event_type in ('action_delegated', 'action_escalated', 'delegate_review')
          and l.created_at > now() - interval '30 days'
      )
    ),
    'pending_approvals', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'action_type', a.action_type,
        'risk_level', a.risk_level, 'status', a.status,
        'preview_text', a.preview_text, 'estimated_impact', a.estimated_impact,
        'created_at', a.created_at, 'required_approvals', a.required_approvals,
        'approval_count', a.approval_count,
        'workflow_type', public._acad_workflow_type(a.requires_approval, a.required_approvals, a.risk_level, v_settings.multi_admin_approval),
        'sla_status', public._acad_sla_status(a.created_at, exists(
          select 1 from public.aipify_action_logs l where l.action_id = a.id and l.event_type = 'action_escalated'
        )),
        'current_owner', public._acad_current_owner(a.id)
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status = 'pending_approval'
      limit 50),
      '[]'::jsonb
    ),
    'awaiting_my_review', coalesce(
      (select jsonb_agg(row order by (row->>'created_at') desc)
       from (
         select jsonb_build_object(
           'id', a.id, 'title', a.title, 'risk_level', a.risk_level,
           'status', a.status, 'current_owner', public._acad_current_owner(a.id),
           'sla_status', public._acad_sla_status(a.created_at, false)
         ) as row
         from public.aipify_actions a
         where a.tenant_id = v_tenant_id
           and a.status = 'pending_approval'
           and (
             public._acad_current_owner(a.id) ilike '%' || v_role || '%'
             or public._acad_current_owner(a.id) = 'Unassigned'
           )
         limit 25
       ) sub),
      '[]'::jsonb
    ),
    'recently_approved', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level,
        'approved_at', a.approved_at, 'approved_by', a.approved_by
      ) order by a.approved_at desc nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('approved', 'executed', 'scheduled')
        and a.approved_at is not null
      limit 20),
      '[]'::jsonb
    ),
    'rejected', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'rejected_at', a.rejected_at,
        'rejected_by', a.rejected_by, 'rejection_reason', a.rejection_reason
      ) order by a.rejected_at desc nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status = 'rejected'
      limit 20),
      '[]'::jsonb
    ),
    'escalated', coalesce(
      (select jsonb_agg(distinct jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status
      ))
      from public.aipify_actions a
      join public.aipify_action_logs l on l.action_id = a.id
      where a.tenant_id = v_tenant_id
        and l.event_type = 'action_escalated'
      limit 20),
      '[]'::jsonb
    ),
    'executive_decisions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status,
        'required_approvals', a.required_approvals, 'approval_count', a.approval_count
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id
        and a.risk_level in ('high', 'critical')
        and a.status in ('pending_approval', 'approved')
      limit 15),
      '[]'::jsonb
    ),
    'permissions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'role_name', p.role_name, 'can_approve_actions', p.can_approve_actions,
        'max_risk_level', p.max_risk_level
      ) order by p.role_name)
      from public.aipify_execution_permissions p where p.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'principle', 'Aipify supports decision processes. Organizations retain authority. Aipify never approves on behalf of humans unless explicitly authorized by governance settings.'
  );
end;
$$;

create or replace function public.get_action_center_approval_detail(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_settings public.aef_settings;
  v_escalated boolean;
  v_workflow text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  v_settings := public.ensure_aef_settings(v_tenant_id);
  v_escalated := exists(
    select 1 from public.aipify_action_logs l
    where l.action_id = p_action_id and l.event_type = 'action_escalated'
  );
  v_workflow := public._acad_workflow_type(
    v_action.requires_approval, v_action.required_approvals,
    v_action.risk_level, v_settings.multi_admin_approval
  );

  return jsonb_build_object(
    'found', true,
    'action', jsonb_build_object(
      'id', v_action.id, 'title', v_action.title, 'description', v_action.description,
      'action_type', v_action.action_type, 'risk_level', v_action.risk_level,
      'status', v_action.status, 'requires_approval', v_action.requires_approval,
      'required_approvals', v_action.required_approvals, 'approval_count', v_action.approval_count,
      'estimated_impact', v_action.estimated_impact, 'created_by_module', v_action.created_by_module,
      'created_at', v_action.created_at, 'approved_by', v_action.approved_by, 'approved_at', v_action.approved_at,
      'rejected_by', v_action.rejected_by, 'rejection_reason', v_action.rejection_reason
    ),
    'workflow', jsonb_build_object(
      'type', v_workflow,
      'steps_completed', v_action.approval_count,
      'steps_required', greatest(v_action.required_approvals, 1),
      'rules', jsonb_build_array(
        jsonb_build_object('key', 'category', 'label', public._acia_action_category(v_action.action_type)),
        jsonb_build_object('key', 'risk_level', 'label', v_action.risk_level),
        jsonb_build_object('key', 'financial_impact', 'label', coalesce(nullif(v_action.estimated_impact, ''), 'Not specified')),
        jsonb_build_object('key', 'department', 'label', case public._acia_action_category(v_action.action_type)
          when 'billing' then 'Finance & Operations'
          when 'support' then 'Support'
          when 'governance' then 'Governance'
          else 'Operations'
        end)
      )
    ),
    'delegation', jsonb_build_object(
      'current_owner', public._acad_current_owner(p_action_id),
      'previous_owners', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'owner', l.metadata_json ->> 'delegate_to',
          'from_owner', l.metadata_json ->> 'from_owner',
          'performed_by', l.performed_by,
          'created_at', l.created_at
        ) order by l.created_at desc)
        from public.aipify_action_logs l
        where l.action_id = p_action_id
          and l.event_type in ('action_delegated', 'delegate_review', 'delegation_assigned')
        limit 20),
        '[]'::jsonb
      ),
      'history', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'event_type', l.event_type,
          'description', l.event_description,
          'performed_by', l.performed_by,
          'metadata', l.metadata_json,
          'created_at', l.created_at
        ) order by l.created_at desc)
        from public.aipify_action_logs l
        where l.action_id = p_action_id
          and l.event_type in (
            'action_delegated', 'action_escalated', 'delegate_review',
            'returned_for_clarification', 'approval_info_requested',
            'executive_oversight_required', 'approval_with_conditions'
          )
        limit 30),
        '[]'::jsonb
      )
    ),
    'sla', jsonb_build_object(
      'status', public._acad_sla_status(v_action.created_at, v_escalated),
      'hours_waiting', greatest(0, round(extract(epoch from (now() - v_action.created_at)) / 3600.0)::integer),
      'escalated', v_escalated,
      'deadline_hours', case v_action.risk_level when 'critical' then 24 when 'high' then 48 else 72 end
    ),
    'audit_trail', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'metadata', l.metadata_json, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.action_id = p_action_id limit 50),
      '[]'::jsonb
    ),
    'approvals', coalesce(
      (select jsonb_agg(jsonb_build_object('approved_by', ap.approved_by, 'approved_at', ap.approved_at))
      from public.aipify_action_approvals ap where ap.action_id = p_action_id),
      '[]'::jsonb
    ),
    'principle', 'Aipify may recommend approvers and delegates. Humans retain accountability for every approval decision.'
  );
end;
$$;

create or replace function public.record_action_center_approval_decision(
  p_action_id uuid,
  p_decision text,
  p_comment text default null,
  p_delegate_to text default null,
  p_conditions jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
  v_action public.aipify_actions;
  v_event text;
  v_desc text;
  v_from_owner text;
  v_result jsonb := '{}'::jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant not found'; end if;

  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_from_owner := public._acad_current_owner(p_action_id);

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id for update;
  if v_action.id is null then raise exception 'Action not found'; end if;

  case p_decision
    when 'approve' then
      v_result := public.approve_aipify_action(p_action_id);
      return v_result;
    when 'approve_with_conditions' then
      v_result := public.approve_aipify_action(p_action_id);
      v_event := 'approval_with_conditions';
      v_desc := coalesce(p_comment, 'Approved with conditions');
      perform public.record_aef_action_log(
        v_tenant_id, p_action_id, v_event, v_desc, v_actor, 'user',
        jsonb_build_object('conditions', p_conditions, 'comment', p_comment)
      );
      return v_result || jsonb_build_object('conditions_recorded', true);
    when 'reject' then
      return public.reject_aipify_action(p_action_id, coalesce(p_comment, 'Rejected'));
    when 'request_information' then
      v_event := 'approval_info_requested';
      v_desc := coalesce(p_comment, 'Additional information requested');
    when 'delegate_review' then
      if coalesce(p_delegate_to, '') = '' then raise exception 'delegate_to required'; end if;
      v_event := 'action_delegated';
      v_desc := coalesce(p_comment, 'Delegated for review');
    when 'require_executive_oversight' then
      v_event := 'executive_oversight_required';
      v_desc := coalesce(p_comment, 'Executive oversight required');
      update public.aipify_actions
      set required_approvals = greatest(required_approvals, 2), updated_at = now()
      where id = p_action_id;
    when 'escalate' then
      v_event := 'action_escalated';
      v_desc := coalesce(p_comment, 'Action escalated');
    when 'return_for_clarification' then
      v_event := 'returned_for_clarification';
      v_desc := coalesce(p_comment, 'Returned for clarification');
    else
      raise exception 'Unknown decision type: %', p_decision;
  end case;

  perform public.record_aef_action_log(
    v_tenant_id, p_action_id, v_event, v_desc, v_actor, 'user',
    jsonb_build_object(
      'decision', p_decision,
      'comment', p_comment,
      'delegate_to', p_delegate_to,
      'from_owner', v_from_owner,
      'conditions', p_conditions
    )
  );

  return jsonb_build_object('recorded', true, 'decision', p_decision, 'event_type', v_event);
end;
$$;

grant execute on function public.get_action_center_approval_delegation_center() to authenticated;
grant execute on function public.get_action_center_approval_detail(uuid) to authenticated;
grant execute on function public.record_action_center_approval_decision(uuid, text, text, text, jsonb) to authenticated;

-- Phase 263 — Action Center Execution Coordination Engine

create or replace function public._acec_lifecycle_stage(p_status text, p_has_blocker boolean, p_waiting_dep boolean)
returns text
language sql
immutable
as $$
  select case
    when p_status = 'draft' then 'recommended'
    when p_status = 'pending_approval' then 'under_review'
    when p_status = 'approved' then 'approved'
    when p_status = 'scheduled' then 'assigned'
    when p_status = 'executing' then 'in_progress'
    when p_status = 'blocked' or p_has_blocker then 'blocked'
    when p_waiting_dep then 'waiting'
    when p_status in ('executed') then 'completed'
    when p_status in ('cancelled', 'rejected') then 'cancelled'
    when p_status = 'failed' then 'blocked'
    else 'approved'
  end;
$$;

create or replace function public._acec_priority_from_action(p_risk text, p_impact text)
returns text
language sql
immutable
as $$
  select case coalesce(p_risk, 'low')
    when 'critical' then 'critical'
    when 'high' then 'high'
    when 'medium' then 'medium'
    else case when coalesce(p_impact, '') <> '' then 'medium' else 'low' end
  end;
$$;

create or replace function public.get_action_center_execution_coordination_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_has_access boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'executive_summary', jsonb_build_object(
      'execution_health_score', greatest(40, least(98,
        100
        - (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'blocked') * 5
        - (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status in ('approved','scheduled') and created_at < now() - interval '7 days') * 3
      )),
      'completion_rate', coalesce(
        (select round(
          (count(*) filter (where status = 'executed')::numeric / nullif(count(*), 0)) * 100
        ) from public.aipify_actions where tenant_id = v_tenant_id and created_at > now() - interval '30 days'),
        0
      ),
      'blocked_count', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status = 'blocked'),
      'overdue_count', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status in ('approved','scheduled','executing') and created_at < now() - interval '14 days'),
      'strategic_in_progress', (select count(*) from public.aipify_actions where tenant_id = v_tenant_id and status in ('executing','scheduled') and risk_level in ('high','critical'))
    ),
    'starting_today', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status,
        'lifecycle_stage', public._acec_lifecycle_stage(a.status, false, false),
        'priority', public._acec_priority_from_action(a.risk_level, a.estimated_impact),
        'scheduled_for', a.scheduled_for, 'created_at', a.created_at
      ) order by a.scheduled_for nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id
        and a.status in ('approved', 'scheduled')
        and (a.scheduled_for::date = current_date or (a.scheduled_for is null and a.approved_at::date = current_date))
      limit 20),
      '[]'::jsonb
    ),
    'in_progress', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status,
        'lifecycle_stage', public._acec_lifecycle_stage(a.status, false, false),
        'priority', public._acec_priority_from_action(a.risk_level, a.estimated_impact)
      ) order by a.updated_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('executing', 'scheduled')
      limit 25),
      '[]'::jsonb
    ),
    'blocked', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status,
        'lifecycle_stage', 'blocked', 'failure_reason', a.failure_reason
      ) order by a.updated_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('blocked', 'failed')
      limit 25),
      '[]'::jsonb
    ),
    'awaiting_dependencies', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'status', a.status,
        'lifecycle_stage', 'waiting'
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status = 'approved'
        and exists (
          select 1 from public.aipify_action_logs l
          where l.action_id = a.id and l.event_type = 'dependency_waiting'
        )
      limit 20),
      '[]'::jsonb
    ),
    'upcoming_deadlines', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'scheduled_for', a.scheduled_for, 'risk_level', a.risk_level
      ) order by a.scheduled_for asc nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id
        and a.status in ('approved', 'scheduled', 'executing')
        and a.scheduled_for is not null
        and a.scheduled_for > now()
        and a.scheduled_for < now() + interval '14 days'
      limit 20),
      '[]'::jsonb
    ),
    'completed', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'executed_at', a.executed_at, 'risk_level', a.risk_level
      ) order by a.executed_at desc nulls last)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status = 'executed'
      limit 20),
      '[]'::jsonb
    ),
    'executive_priority', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'risk_level', a.risk_level, 'status', a.status,
        'priority', public._acec_priority_from_action(a.risk_level, a.estimated_impact)
      ) order by case a.risk_level when 'critical' then 1 when 'high' then 2 else 3 end)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id
        and a.risk_level in ('high', 'critical')
        and a.status not in ('executed', 'cancelled', 'rejected')
      limit 15),
      '[]'::jsonb
    ),
    'principle', 'Aipify coordinates execution. Humans remain responsible for execution decisions.'
  );
end;
$$;

create or replace function public.get_action_center_execution_detail(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_has_blocker boolean;
  v_waiting_dep boolean;
  v_lifecycle text;
  v_category text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  v_has_blocker := exists(
    select 1 from public.aipify_action_logs l
    where l.action_id = p_action_id and l.event_type = 'execution_blocker'
      and coalesce(l.metadata_json->>'resolved', 'false') <> 'true'
  );
  v_waiting_dep := exists(
    select 1 from public.aipify_action_logs l
    where l.action_id = p_action_id and l.event_type = 'dependency_waiting'
      and coalesce(l.metadata_json->>'resolved', 'false') <> 'true'
  );
  v_lifecycle := public._acec_lifecycle_stage(v_action.status, v_has_blocker, v_waiting_dep);
  v_category := public._acia_action_category(v_action.action_type);

  return jsonb_build_object(
    'found', true,
    'action', jsonb_build_object(
      'id', v_action.id, 'title', v_action.title, 'description', v_action.description,
      'action_type', v_action.action_type, 'risk_level', v_action.risk_level,
      'status', v_action.status, 'estimated_impact', v_action.estimated_impact,
      'created_at', v_action.created_at, 'approved_at', v_action.approved_at,
      'scheduled_for', v_action.scheduled_for, 'executed_at', v_action.executed_at,
      'created_by_module', v_action.created_by_module
    ),
    'lifecycle', jsonb_build_object(
      'current_stage', v_lifecycle,
      'stages', jsonb_build_array(
        jsonb_build_object('key', 'recommended', 'status', case when v_lifecycle = 'recommended' then 'current' when v_lifecycle in ('under_review','approved','assigned','in_progress','waiting','blocked','completed') then 'complete' else 'pending' end),
        jsonb_build_object('key', 'under_review', 'status', case when v_lifecycle = 'under_review' then 'current' when v_lifecycle in ('approved','assigned','in_progress','waiting','blocked','completed') then 'complete' when v_lifecycle = 'recommended' then 'pending' else 'pending' end),
        jsonb_build_object('key', 'approved', 'status', case when v_lifecycle = 'approved' then 'current' when v_lifecycle in ('assigned','in_progress','waiting','blocked','completed') then 'complete' else 'pending' end),
        jsonb_build_object('key', 'assigned', 'status', case when v_lifecycle = 'assigned' then 'current' when v_lifecycle in ('in_progress','waiting','blocked','completed') then 'complete' else 'pending' end),
        jsonb_build_object('key', 'in_progress', 'status', case when v_lifecycle = 'in_progress' then 'current' when v_lifecycle = 'completed' then 'complete' when v_lifecycle = 'blocked' then 'blocked' else 'pending' end),
        jsonb_build_object('key', 'waiting', 'status', case when v_lifecycle = 'waiting' then 'current' when v_lifecycle = 'completed' then 'complete' else 'pending' end),
        jsonb_build_object('key', 'blocked', 'status', case when v_lifecycle = 'blocked' then 'current' when v_lifecycle = 'completed' then 'complete' else 'pending' end),
        jsonb_build_object('key', 'completed', 'status', case when v_lifecycle = 'completed' then 'complete' when v_lifecycle = 'cancelled' then 'blocked' else 'pending' end),
        jsonb_build_object('key', 'cancelled', 'status', case when v_lifecycle = 'cancelled' then 'complete' else 'pending' end)
      )
    ),
    'ownership', jsonb_build_object(
      'primary_owner', coalesce(
        (select l.metadata_json->>'primary_owner' from public.aipify_action_logs l
         where l.action_id = p_action_id and l.event_type = 'ownership_assigned'
         order by l.created_at desc limit 1),
        case v_category when 'billing' then 'Finance Lead' when 'support' then 'Support Lead' else 'Operations Lead' end
      ),
      'secondary_owner', coalesce(
        (select l.metadata_json->>'secondary_owner' from public.aipify_action_logs l
         where l.action_id = p_action_id and l.event_type = 'ownership_assigned'
         order by l.created_at desc limit 1), 'Team Coordinator'),
      'contributors', jsonb_build_array('Operations Team'),
      'executive_sponsor', case when v_action.risk_level in ('high','critical') then 'Executive Sponsor' else null end,
      'history', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'event_type', l.event_type, 'performed_by', l.performed_by,
          'metadata', l.metadata_json, 'created_at', l.created_at
        ) order by l.created_at desc)
        from public.aipify_action_logs l
        where l.action_id = p_action_id and l.event_type in ('ownership_assigned', 'ownership_changed', 'escalation_ownership')
        limit 20),
        '[]'::jsonb
      )
    ),
    'dependencies', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'type', coalesce(l.metadata_json->>'dependency_type', 'action'),
        'label', coalesce(l.metadata_json->>'label', l.event_description),
        'status', coalesce(l.metadata_json->>'status', 'waiting_for_dependency'),
        'resolved', coalesce((l.metadata_json->>'resolved')::boolean, false)
      ) order by l.created_at)
      from public.aipify_action_logs l
      where l.action_id = p_action_id and l.event_type in ('dependency_registered', 'dependency_waiting', 'dependency_resolved')
      limit 20),
      jsonb_build_array(
        jsonb_build_object('type', 'approval', 'label', 'Approval completion', 'status', case when v_action.status in ('approved','scheduled','executing','executed') then 'ready' else 'waiting_for_dependency' end, 'resolved', v_action.status in ('approved','scheduled','executing','executed'))
      )
    ),
    'blockers', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'category', coalesce(l.metadata_json->>'category', 'missing_information'),
        'description', l.event_description,
        'severity', coalesce(l.metadata_json->>'severity', 'medium'),
        'owner', coalesce(l.metadata_json->>'owner', 'Unassigned'),
        'resolution_plan', coalesce(l.metadata_json->>'resolution_plan', ''),
        'target_date', l.metadata_json->>'target_date',
        'resolved', coalesce((l.metadata_json->>'resolved')::boolean, false),
        'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l
      where l.action_id = p_action_id and l.event_type = 'execution_blocker'
      limit 20),
      '[]'::jsonb
    ),
    'priority', jsonb_build_object(
      'level', public._acec_priority_from_action(v_action.risk_level, v_action.estimated_impact),
      'factors', jsonb_build_array('business_impact', 'risk_level', 'strategic_alignment')
    ),
    'timeline', jsonb_build_object(
      'planned_start', coalesce(v_action.scheduled_for, v_action.approved_at, v_action.created_at),
      'actual_start', v_action.approved_at,
      'estimated_completion', v_action.scheduled_for,
      'actual_completion', v_action.executed_at,
      'milestones', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'label', l.event_description, 'achieved_at', l.created_at, 'event_type', l.event_type
        ) order by l.created_at)
        from public.aipify_action_logs l
        where l.action_id = p_action_id
          and l.event_type in ('action_approved', 'action_executed', 'execution_update', 'milestone_achieved')
        limit 30),
        '[]'::jsonb
      ),
      'schedule_deviation_hours', case
        when v_action.executed_at is not null and v_action.scheduled_for is not null
        then round(extract(epoch from (v_action.executed_at - v_action.scheduled_for)) / 3600.0)::integer
        else 0
      end
    ),
    'confidence', jsonb_build_object(
      'score', greatest(45, least(95,
        88
        - case v_action.risk_level when 'critical' then 15 when 'high' then 10 when 'medium' then 5 else 0 end
        - case when v_has_blocker then 12 else 0 end
        - case when v_waiting_dep then 8 else 0 end
      )),
      'factors', jsonb_build_array('resource_availability', 'historical_completion', 'dependency_stability', 'complexity', 'team_workload')
    ),
    'collaboration_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'description', l.event_description,
        'performed_by', l.performed_by, 'metadata', l.metadata_json, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l
      where l.action_id = p_action_id
        and l.event_type in ('execution_update', 'execution_note', 'assistance_requested', 'stakeholder_mention')
      limit 50),
      '[]'::jsonb
    ),
    'audit_trail', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.action_id = p_action_id limit 50),
      '[]'::jsonb
    ),
    'principle', 'Aipify coordinates execution. Humans remain responsible for execution decisions.'
  );
end;
$$;

create or replace function public.record_action_center_execution_event(
  p_action_id uuid,
  p_event_type text,
  p_description text default '',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_actor text;
  v_log_id uuid;
  v_action public.aipify_actions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant not found'; end if;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then raise exception 'Action not found'; end if;

  select u.id::text into v_actor from public.users u where u.auth_user_id = auth.uid() limit 1;

  v_log_id := public.record_aef_action_log(
    v_tenant_id, p_action_id, p_event_type, left(coalesce(p_description, ''), 500),
    v_actor, 'user', coalesce(p_metadata, '{}'::jsonb)
  );

  if p_event_type = 'execution_blocker' and coalesce(p_metadata->>'severity', '') = 'critical' then
    update public.aipify_actions set status = 'blocked', updated_at = now()
    where id = p_action_id and status not in ('executed', 'cancelled', 'rejected');
  end if;

  if p_event_type = 'execution_learning' and v_action.status = 'executed' then
    null; -- learning captured in log only
  end if;

  return jsonb_build_object('recorded', true, 'log_id', v_log_id, 'event_type', p_event_type);
end;
$$;

grant execute on function public.get_action_center_execution_coordination_center() to authenticated;
grant execute on function public.get_action_center_execution_detail(uuid) to authenticated;
grant execute on function public.record_action_center_execution_event(uuid, text, text, jsonb) to authenticated;

-- Phase 261 — Action Center Impact Analysis Engine

create or replace function public._acia_action_category(p_action_type text)
returns text
language sql
immutable
as $$
  select case
    when p_action_type ilike '%support%' then 'support'
    when p_action_type ilike '%automation%' or p_action_type ilike '%workflow%' then 'automation'
    when p_action_type ilike '%billing%' or p_action_type ilike '%subscription%' or p_action_type ilike '%invoice%' then 'billing'
    when p_action_type ilike '%install%' then 'installation'
    when p_action_type ilike '%governance%' or p_action_type ilike '%policy%' or p_action_type ilike '%approval%' then 'governance'
    when p_action_type ilike '%customer%' or p_action_type ilike '%follow_up%' or p_action_type ilike '%lead%' then 'customer'
    when p_action_type ilike '%growth%' or p_action_type ilike '%partner%' then 'growth_partner'
    when p_action_type ilike '%recover%' or p_action_type ilike '%failed%' or p_action_type ilike '%restart%' then 'workflow_recovery'
    else 'automation'
  end;
$$;

create or replace function public._acia_affected_systems(p_action_type text, p_module text)
returns jsonb
language sql
immutable
as $$
  select case public._acia_action_category(p_action_type)
    when 'support' then '["Support Engine","Knowledge Center","Notification Engine"]'::jsonb
    when 'billing' then '["Billing Engine","Subscription Engine","Notification Engine"]'::jsonb
    when 'installation' then '["Install Engine","Trust Center","Notification Engine"]'::jsonb
    when 'governance' then '["Trust Center","Approval Center","Audit Engine"]'::jsonb
    when 'customer' then '["Customer Success Engine","Notification Engine","Support Engine"]'::jsonb
    when 'growth_partner' then '["Growth Partner Center","Notification Engine","Trust Center"]'::jsonb
    when 'workflow_recovery' then '["Automation Engine","Action Center","Notification Engine"]'::jsonb
    else '["Operations Engine","Notification Engine"]'::jsonb
  end;
$$;

create or replace function public._acia_priority_from_risk(p_risk text)
returns text
language sql
immutable
as $$
  select case coalesce(p_risk, 'low')
    when 'critical' then 'critical'
    when 'high' then 'high'
    when 'medium' then 'medium'
    else 'low'
  end;
$$;

create or replace function public._acia_timeline_stage(p_status text, p_stage text)
returns text
language sql
immutable
as $$
  select case p_stage
    when 'review' then case when p_status in ('draft','pending_approval') then 'current' when p_status in ('approved','scheduled','executing','executed','failed') then 'complete' else 'pending' end
    when 'approve' then case when p_status = 'pending_approval' then 'pending' when p_status in ('approved','scheduled','executing','executed') then 'complete' when p_status in ('rejected','blocked','cancelled') then 'blocked' else 'pending' end
    when 'execute' then case when p_status = 'executing' then 'current' when p_status in ('executed','failed') then 'complete' when p_status = 'approved' then 'pending' else 'pending' end
    when 'verify' then case when p_status = 'executed' then 'complete' when p_status = 'failed' then 'blocked' else 'pending' end
    when 'monitor' then case when p_status = 'executed' then 'current' else 'pending' end
    when 'close' then case when p_status in ('executed','failed','cancelled','rejected') then 'complete' else 'pending' end
    else 'pending'
  end;
$$;

create or replace function public.get_action_center_impact_analysis(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_category text;
  v_similar_total integer := 0;
  v_similar_success integer := 0;
  v_success_rate integer := 96;
  v_confidence integer := 85;
  v_priority text;
  v_rollback_steps text;
  v_recovery_time text;
  v_side_effects text;
  v_mitigation text;
  v_time_savings text;
  v_benefits text;
  v_teams text;
  v_customer_impact text;
  v_requires_role text := 'Workspace Admin';
  v_escalation text := 'Platform Admin';
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('found', false);
  end if;

  select * into v_action
  from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;

  if v_action.id is null then
    return jsonb_build_object('found', false);
  end if;

  v_category := public._acia_action_category(v_action.action_type);
  v_priority := public._acia_priority_from_risk(v_action.risk_level);

  select count(*)::integer, count(*) filter (where status = 'executed')::integer
  into v_similar_total, v_similar_success
  from public.aipify_actions
  where tenant_id = v_tenant_id
    and action_type = v_action.action_type
    and id <> v_action.id;

  if v_similar_total > 0 then
    v_success_rate := greatest(50, least(100, round((v_similar_success::numeric / v_similar_total::numeric) * 100)));
  end if;

  v_confidence := greatest(55, least(99, v_success_rate - case v_action.risk_level when 'high' then 8 when 'medium' then 4 else 0 end));

  v_benefits := coalesce(nullif(trim(v_action.estimated_impact), ''), case v_category
    when 'support' then 'Improve response quality and reduce manual support workload.'
    when 'billing' then 'Streamline billing operations and reduce revenue leakage.'
    when 'installation' then 'Accelerate customer onboarding and installation success.'
    when 'governance' then 'Strengthen governance visibility and approval accountability.'
    when 'customer' then 'Improve customer engagement and follow-through.'
    when 'growth_partner' then 'Support Growth Partner operations with clearer workflows.'
    when 'workflow_recovery' then 'Restore failed workflows and reduce operational disruption.'
    else 'Complete the recommended workflow with measurable operational benefit.'
  end);

  v_time_savings := case v_category
    when 'support' then '8–12 hours per month'
    when 'automation' then '12 hours per month'
    when 'billing' then '4–6 hours per month'
    else '6–10 hours per month'
  end;

  v_teams := case v_category
    when 'support' then 'Support Team'
    when 'billing' then 'Finance & Operations'
    when 'installation' then 'Operations & Customer Success'
    when 'growth_partner' then 'Growth Partner Operations'
    else 'Operations Team'
  end;

  v_customer_impact := case when v_action.risk_level in ('high','critical') then 'Monitor closely' else 'Positive' end;

  v_side_effects := case v_category
    when 'support' then 'Increased notification or email frequency for affected customers.'
    when 'billing' then 'Temporary changes to billing records or subscription state.'
    when 'automation' then 'Automated workflow changes may affect related processes.'
    else 'Minor operational adjustments during execution.'
  end;

  v_mitigation := 'Monitoring enabled with full audit logging and approval gates.';

  if v_action.rollback_available then
    v_rollback_steps := 'Automatic rollback available.';
    v_recovery_time := 'Under 2 minutes';
  else
    v_rollback_steps := 'Manual intervention required.';
    v_recovery_time := 'Varies — contact administrator';
  end if;

  if v_action.risk_level in ('high','critical') then
    v_requires_role := 'Workspace Admin';
    v_escalation := 'Platform Admin';
  end if;

  return jsonb_build_object(
    'found', true,
    'action', jsonb_build_object(
      'id', v_action.id,
      'action_type', v_action.action_type,
      'title', v_action.title,
      'description', v_action.description,
      'preview_text', v_action.preview_text,
      'payload_json', v_action.payload_json,
      'risk_level', v_action.risk_level,
      'execution_level', v_action.execution_level,
      'status', v_action.status,
      'requires_approval', v_action.requires_approval,
      'required_approvals', v_action.required_approvals,
      'approval_count', v_action.approval_count,
      'estimated_impact', v_action.estimated_impact,
      'created_by_module', v_action.created_by_module,
      'scheduled_for', v_action.scheduled_for,
      'executed_at', v_action.executed_at,
      'failure_reason', v_action.failure_reason,
      'rollback_available', v_action.rollback_available,
      'created_at', v_action.created_at
    ),
    'summary', jsonb_build_object(
      'title', v_action.title,
      'status', v_action.status,
      'recommended_by', coalesce(nullif(v_action.created_by_module, ''), 'Aipify Operations Engine'),
      'priority', v_priority,
      'category', v_category
    ),
    'business_impact', jsonb_build_object(
      'expected_benefits', v_benefits,
      'estimated_time_savings', v_time_savings,
      'affected_teams', v_teams,
      'customer_impact', v_customer_impact
    ),
    'risk_analysis', jsonb_build_object(
      'risk_level', v_action.risk_level,
      'potential_side_effects', v_side_effects,
      'mitigation_strategy', v_mitigation
    ),
    'confidence', jsonb_build_object(
      'score', v_confidence,
      'reasoning_key', case when v_similar_total >= 5 then 'historical_success' else 'operating_conditions' end
    ),
    'rollback', jsonb_build_object(
      'available', v_action.rollback_available,
      'estimated_recovery_time', v_recovery_time,
      'steps', v_rollback_steps
    ),
    'affected_systems', public._acia_affected_systems(v_action.action_type, v_action.created_by_module),
    'approval_chain', jsonb_build_object(
      'requested_by', coalesce(nullif(v_action.created_by_module, ''), 'Aipify Operations Engine'),
      'requires_approval_from', v_requires_role,
      'escalation_path', v_escalation
    ),
    'audit_preview', jsonb_build_object(
      'generates_records', true,
      'records', jsonb_build_array('approval_event', 'execution_event', 'outcome_event', 'rollback_event')
    ),
    'related_actions', jsonb_build_object(
      'similar_count', v_similar_total,
      'similar_success_count', v_similar_success,
      'average_success_rate', v_success_rate
    ),
    'execution_timeline', jsonb_build_array(
      jsonb_build_object('key', 'review', 'status', public._acia_timeline_stage(v_action.status, 'review')),
      jsonb_build_object('key', 'approve', 'status', public._acia_timeline_stage(v_action.status, 'approve')),
      jsonb_build_object('key', 'execute', 'status', public._acia_timeline_stage(v_action.status, 'execute')),
      jsonb_build_object('key', 'verify', 'status', public._acia_timeline_stage(v_action.status, 'verify')),
      jsonb_build_object('key', 'monitor', 'status', public._acia_timeline_stage(v_action.status, 'monitor')),
      jsonb_build_object('key', 'close', 'status', public._acia_timeline_stage(v_action.status, 'close'))
    ),
    'post_execution', case when v_action.status in ('executed', 'failed') then jsonb_build_object(
      'execution_result', case when v_action.status = 'executed' then 'successful' else 'failed' end,
      'execution_time_seconds', case
        when v_action.executed_at is not null and v_action.created_at is not null
        then greatest(1, extract(epoch from (v_action.executed_at - v_action.created_at))::integer)
        else 18
      end,
      'unexpected_events', coalesce(v_action.failure_reason, 'None'),
      'business_outcome', case when v_action.status = 'executed' then 'positive' else 'review_required' end
    ) else null end,
    'safety', public.validate_aipify_action_safety(v_action),
    'logs', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.action_id = v_action.id limit 50),
      '[]'::jsonb
    ),
    'principle', 'Aipify explains why action is recommended, what the impact will be, and how recovery is handled.'
  );
end;
$$;

grant execute on function public.get_action_center_impact_analysis(uuid) to authenticated;

-- Learning loop — capture validated outcomes for future impact predictions
create or replace function public.record_action_center_impact_learning(
  p_action_id uuid,
  p_actual_outcome text,
  p_user_satisfaction text default 'neutral',
  p_goal_achievement text default 'partially',
  p_lessons_learned text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_log_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('recorded', false, 'error', 'tenant_not_found');
  end if;

  select * into v_action
  from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;

  if v_action.id is null then
    return jsonb_build_object('recorded', false, 'error', 'action_not_found');
  end if;

  v_log_id := public.record_aef_action_log(
    v_tenant_id,
    p_action_id,
    'impact_learning_feedback',
    left(coalesce(p_actual_outcome, ''), 500),
    coalesce(auth.jwt() ->> 'email', 'user'),
    'user',
    jsonb_build_object(
      'actual_outcome', p_actual_outcome,
      'user_satisfaction', p_user_satisfaction,
      'goal_achievement', p_goal_achievement,
      'lessons_learned', p_lessons_learned,
      'action_type', v_action.action_type,
      'recorded_at', now()
    )
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.record_action_center_impact_learning(uuid, text, text, text, text) to authenticated;

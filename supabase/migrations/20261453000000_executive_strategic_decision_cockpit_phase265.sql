-- Phase 265 — Executive Strategic Decision Cockpit Engine

create or replace function public._esdc_decision_urgency(p_risk text, p_status text, p_overdue boolean)
returns text
language sql
immutable
as $$
  select case
    when coalesce(p_risk, 'low') = 'critical' or (p_status = 'pending_approval' and coalesce(p_risk, 'low') = 'high') then 'critical'
    when coalesce(p_risk, 'low') = 'high' or coalesce(p_overdue, false) then 'high_priority'
    when p_status in ('pending_approval', 'blocked') then 'medium_priority'
    else 'informational'
  end;
$$;

create or replace function public._esdc_org_health_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'monitor_closely'
    when p_score >= 45 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public._esdc_decision_row(a public.aipify_actions)
returns jsonb
language plpgsql
stable
as $$
declare
  v_overdue boolean;
  v_urgency text;
begin
  v_overdue := a.status in ('pending_approval', 'approved', 'scheduled', 'executing')
    and a.created_at < now() - interval '7 days';
  v_urgency := public._esdc_decision_urgency(a.risk_level, a.status, v_overdue);

  return jsonb_build_object(
    'id', a.id,
    'title', a.title,
    'description', left(coalesce(a.description, ''), 300),
    'urgency', v_urgency,
    'owner', public._acad_current_owner(a.id),
    'required_approvers', case when a.risk_level in ('high', 'critical') then jsonb_build_array('Executive Sponsor', 'Workspace Admin') else jsonb_build_array('Workspace Admin') end,
    'strategic_impact', coalesce(a.estimated_impact, 'Operational improvement'),
    'risk_level', a.risk_level,
    'status', a.status,
    'deadline', coalesce(a.scheduled_for, a.created_at + interval '14 days'),
    'recommended_next_step', case
      when a.status = 'pending_approval' and a.risk_level in ('high', 'critical') then 'Executive review and approval decision'
      when a.status = 'pending_approval' then 'Review impact analysis and approve or reject'
      when a.status = 'blocked' then 'Resolve blockers and reassign ownership'
      when a.status = 'approved' then 'Assign execution owner and begin coordination'
      else 'Monitor progress in Execution Coordination Center'
    end,
    'confidence_score', greatest(45, least(95, 80 - case a.risk_level when 'critical' then 15 when 'high' then 10 else 0 end)),
    'category', public._asip_initiative_category(a.action_type, coalesce(a.created_by_module, ''), coalesce(a.estimated_impact, ''))
  );
end;
$$;

create or replace function public._esdc_opportunity_row(a public.aipify_actions)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', a.id,
    'title', a.title,
    'type', case public._asip_initiative_category(a.action_type, coalesce(a.created_by_module, ''), coalesce(a.estimated_impact, ''))
      when 'revenue_growth' then 'revenue'
      when 'cost_optimization' then 'cost_optimization'
      when 'market_expansion' then 'partnership'
      when 'operational_efficiency' then 'process_improvement'
      when 'market_expansion' then 'expansion'
      else 'innovation'
    end,
    'expected_benefit', coalesce(a.estimated_impact, 'Strategic operational benefit'),
    'estimated_effort', case a.risk_level when 'critical' then 'high' when 'high' then 'medium' else 'moderate' end,
    'risk_assessment', a.risk_level,
    'confidence_level', public._asip_confidence_level(public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status)),
    'confidence_score', public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status)
  )
  from public.aipify_actions a2
  where a2.id = a.id;
$$;

create or replace function public.get_executive_strategic_decision_cockpit()
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
  v_health_score integer;
  v_on_track integer;
  v_at_risk integer;
  v_pending_exec integer;
  v_blocked integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');

  select count(*) filter (where public._asip_portfolio_health(a.status, a.status = 'blocked', false) = 'on_track'),
         count(*) filter (where public._asip_portfolio_health(a.status, false, a.created_at < now() - interval '14 days') = 'at_risk'),
         count(*) filter (where a.status = 'pending_approval' and a.risk_level in ('high', 'critical')),
         count(*) filter (where a.status = 'blocked')
  into v_on_track, v_at_risk, v_pending_exec, v_blocked
  from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('cancelled', 'rejected');

  v_health_score := greatest(40, least(98,
    100 - v_blocked * 8 - v_at_risk * 4 - v_pending_exec * 3
  ));

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'overview', jsonb_build_object(
      'initiatives_on_track', v_on_track,
      'initiatives_at_risk', v_at_risk,
      'critical_decisions_pending', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' and a.risk_level = 'critical'),
      'high_impact_opportunities', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('approved', 'pending_approval') and coalesce(a.estimated_impact, '') <> ''),
      'escalated_approvals', v_pending_exec,
      'organization_health_score', v_health_score,
      'organization_health_status', public._esdc_org_health_status(v_health_score),
      'executive_action_queue_count', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'blocked') and a.risk_level in ('high', 'critical'))
    ),
    'decision_queue', jsonb_build_object(
      'critical', coalesce((select jsonb_agg(public._esdc_decision_row(a) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._esdc_decision_urgency(a.risk_level, a.status, a.created_at < now() - interval '7 days') = 'critical' and a.status not in ('executed', 'cancelled', 'rejected') limit 15), '[]'::jsonb),
      'high_priority', coalesce((select jsonb_agg(public._esdc_decision_row(a) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._esdc_decision_urgency(a.risk_level, a.status, a.created_at < now() - interval '7 days') = 'high_priority' and a.status not in ('executed', 'cancelled', 'rejected') limit 15), '[]'::jsonb),
      'medium_priority', coalesce((select jsonb_agg(public._esdc_decision_row(a) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._esdc_decision_urgency(a.risk_level, a.status, false) = 'medium_priority' and a.status not in ('executed', 'cancelled', 'rejected') limit 15), '[]'::jsonb),
      'informational', coalesce((select jsonb_agg(public._esdc_decision_row(a) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._esdc_decision_urgency(a.risk_level, a.status, false) = 'informational' and a.status not in ('executed', 'cancelled', 'rejected') limit 10), '[]'::jsonb)
    ),
    'organization_health', jsonb_build_object(
      'operational_efficiency', jsonb_build_object('score', greatest(50, v_health_score - 5), 'status', public._esdc_org_health_status(v_health_score - 5)),
      'employee_engagement', jsonb_build_object('score', 78, 'status', 'healthy'),
      'customer_satisfaction', jsonb_build_object('score', greatest(55, v_health_score), 'status', public._esdc_org_health_status(v_health_score)),
      'revenue_momentum', jsonb_build_object('score', greatest(50, v_health_score - 8), 'status', public._esdc_org_health_status(v_health_score - 8)),
      'risk_exposure', jsonb_build_object('score', greatest(40, 100 - v_blocked * 10 - v_at_risk * 5), 'status', public._esdc_org_health_status(greatest(40, 100 - v_blocked * 10 - v_at_risk * 5))),
      'compliance_status', jsonb_build_object('score', 82, 'status', 'healthy'),
      'strategic_execution', jsonb_build_object('score', v_health_score, 'status', public._esdc_org_health_status(v_health_score))
    ),
    'executive_alerts', coalesce(
      (select jsonb_agg(alert order by (alert->>'priority') desc)
      from (
        select jsonb_build_object('id', a.id, 'type', 'initiative_delay', 'title', a.title, 'message', 'Initiative may be delayed — review execution timeline', 'priority', 'high', 'action_id', a.id) as alert
        from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('approved', 'scheduled', 'executing') and a.created_at < now() - interval '14 days'
        union all
        select jsonb_build_object('id', a.id, 'type', 'executive_approval', 'title', a.title, 'message', 'Executive approval pending', 'priority', 'critical', 'action_id', a.id)
        from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' and a.risk_level in ('high', 'critical')
        union all
        select jsonb_build_object('id', a.id, 'type', 'escalated_risk', 'title', a.title, 'message', 'Blocked initiative requires leadership attention', 'priority', 'high', 'action_id', a.id)
        from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked'
        union all
        select jsonb_build_object('id', a.id, 'type', 'high_value_opportunity', 'title', a.title, 'message', 'High-value opportunity identified', 'priority', 'medium', 'action_id', a.id)
        from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' and coalesce(a.estimated_impact, '') <> ''
        limit 20
      ) sub),
      '[]'::jsonb
    ),
    'opportunities', coalesce(
      (select jsonb_agg(public._esdc_opportunity_row(a) order by public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status) desc)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'approved', 'draft') limit 12),
      '[]'::jsonb
    ),
    'meeting_mode', jsonb_build_object(
      'topics_for_discussion', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'reason', 'Strategic decision or blocker') order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'blocked') and a.risk_level in ('high', 'critical') limit 8), '[]'::jsonb),
      'pending_approvals', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' limit 10), '[]'::jsonb),
      'blocked_initiatives', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked' limit 10), '[]'::jsonb),
      'recent_achievements', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'completed_at', a.executed_at) order by a.executed_at desc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed' and a.executed_at > now() - interval '30 days' limit 8), '[]'::jsonb),
      'critical_risks', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'risk_level', a.risk_level) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level = 'critical' and a.status not in ('executed', 'cancelled') limit 8), '[]'::jsonb),
      'suggested_agenda', jsonb_build_array(
        'Portfolio health review',
        'Critical decisions awaiting review',
        'Blocked initiatives escalation',
        'Strategic opportunities discussion',
        'Meeting follow-ups and ownership'
      ),
      'follow_ups', coalesce((select jsonb_agg(jsonb_build_object('title', l.event_description, 'created_at', l.created_at) order by l.created_at desc) from public.aipify_action_logs l join public.aipify_actions a on a.id = l.action_id where a.tenant_id = v_tenant_id and l.event_type in ('execution_update', 'assistance_requested') limit 10), '[]'::jsonb)
    ),
    'cross_organizational', jsonb_build_object(
      'departments', coalesce((select jsonb_agg(jsonb_build_object(
        'department', case public._acia_action_category(a.action_type) when 'billing' then 'Finance' when 'support' then 'Support' when 'customer' then 'Customer Success' else 'Operations' end,
        'active_count', count(*),
        'at_risk_count', count(*) filter (where a.status = 'blocked' or a.created_at < now() - interval '14 days')
      ) order by count(*) desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('cancelled', 'rejected') group by public._acia_action_category(a.action_type)), '[]'::jsonb),
      'strategic_initiatives', jsonb_build_object('on_track', v_on_track, 'at_risk', v_at_risk),
      'trends', jsonb_build_array(
        jsonb_build_object('label', 'Execution completion (30d)', 'direction', 'stable'),
        jsonb_build_object('label', 'High-risk concentration', 'direction', case when v_blocked > 2 then 'up' else 'stable' end),
        jsonb_build_object('label', 'Executive approval backlog', 'direction', case when v_pending_exec > 3 then 'up' else 'down' end)
      ),
      'emerging_issues', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'issue', 'Requires executive attention') order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('blocked', 'pending_approval') and a.risk_level in ('high', 'critical') limit 6), '[]'::jsonb)
    ),
    'decision_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_id', l.action_id, 'event_type', l.event_type,
        'description', l.event_description, 'performed_by', l.performed_by,
        'created_at', l.created_at, 'outcome', coalesce(l.metadata_json->>'actual_outcome', l.metadata_json->>'actual_result', '')
      ) order by l.created_at desc)
      from public.aipify_action_logs l
      join public.aipify_actions a on a.id = l.action_id
      where a.tenant_id = v_tenant_id
        and l.event_type in ('action_approved', 'action_rejected', 'approval_decision', 'initiative_learning', 'execution_learning', 'escalation_ownership')
      limit 30),
      '[]'::jsonb
    ),
    'learning_insights', jsonb_build_object(
      'decision_accuracy_estimate', greatest(60, least(95, v_health_score)),
      'bottleneck_patterns', jsonb_build_array('Approval delays on high-risk actions', 'Blockers on cross-functional dependencies'),
      'intervention_effectiveness', 'Executive review reduces overdue approvals',
      'success_patterns', jsonb_build_array('Clear ownership assignment', 'Early impact analysis review')
    ),
    'principle', 'Aipify supports executives. Executives remain accountable for organizational decisions.'
  );
end;
$$;

create or replace function public.get_executive_strategic_decision_briefing(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_urgency text;
  v_confidence integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  select * into v_action from public.aipify_actions where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  v_urgency := public._esdc_decision_urgency(v_action.risk_level, v_action.status, v_action.created_at < now() - interval '7 days');
  v_confidence := greatest(45, least(95, 80 - case v_action.risk_level when 'critical' then 15 when 'high' then 10 else 0 end));

  return jsonb_build_object(
    'found', true,
    'action_id', v_action.id,
    'title', v_action.title,
    'briefing', jsonb_build_object(
      'situation', format('%s is %s with %s risk level.', v_action.title, v_action.status, v_action.risk_level),
      'context', coalesce(v_action.description, 'Strategic action requiring executive awareness.'),
      'recommendation', case
        when v_action.status = 'pending_approval' then 'Review impact analysis and portfolio alignment before approving.'
        when v_action.status = 'blocked' then 'Convene owners to resolve blockers and restore execution momentum.'
        else 'Monitor in Execution Coordination and Strategic Portfolio views.'
      end,
      'benefits', coalesce(v_action.estimated_impact, 'Operational and strategic improvement'),
      'risks', format('Operational disruption at %s risk level if delayed or mis-executed.', v_action.risk_level),
      'alternatives', jsonb_build_array('Approve and proceed', 'Defer pending more information', 'Reject and reprioritize'),
      'recommended_actions', jsonb_build_array(
        'Review linked impact analysis',
        'Confirm ownership and timeline',
        'Record executive decision in audit trail'
      ),
      'confidence_score', v_confidence,
      'confidence_level', public._asip_confidence_level(v_confidence),
      'decision_urgency', v_urgency
    ),
    'principle', 'Aipify supports executives. Executives remain accountable for organizational decisions.'
  );
end;
$$;

create or replace function public.record_executive_decision_cockpit_learning(
  p_action_id uuid,
  p_expected_outcome text default '',
  p_actual_outcome text default '',
  p_lessons_learned text default '',
  p_effectiveness_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_log_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant not found'; end if;

  if not exists(select 1 from public.aipify_actions where id = p_action_id and tenant_id = v_tenant_id) then
    raise exception 'Action not found';
  end if;

  v_log_id := public.record_aef_action_log(
    v_tenant_id, p_action_id, 'executive_decision_learning',
    left(coalesce(p_lessons_learned, 'Executive decision learning captured'), 500),
    (select u.id::text from public.users u where u.auth_user_id = auth.uid() limit 1),
    'user',
    jsonb_build_object(
      'expected_outcome', left(coalesce(p_expected_outcome, ''), 500),
      'actual_outcome', left(coalesce(p_actual_outcome, ''), 500),
      'lessons_learned', left(coalesce(p_lessons_learned, ''), 500),
      'effectiveness_notes', left(coalesce(p_effectiveness_notes, ''), 500)
    )
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.get_executive_strategic_decision_cockpit() to authenticated;
grant execute on function public.get_executive_strategic_decision_briefing(uuid) to authenticated;
grant execute on function public.record_executive_decision_cockpit_learning(uuid, text, text, text, text) to authenticated;

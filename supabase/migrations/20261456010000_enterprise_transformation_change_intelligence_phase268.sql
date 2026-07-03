-- Phase 268 — Enterprise Transformation & Change Intelligence Engine

create or replace function public._etc_readiness_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 85 then 'ready'
    when p_score >= 70 then 'mostly_ready'
    when p_score >= 55 then 'partially_ready'
    when p_score >= 40 then 'not_ready'
    else 'critical_concerns'
  end;
$$;

create or replace function public._etc_transformation_category(
  p_action_type text,
  p_module text,
  p_impact text
)
returns text
language plpgsql
immutable
as $$
begin
  if coalesce(p_module, '') ilike '%compliance%' or coalesce(p_action_type, '') ilike '%compliance%' then
    return 'compliance_transformation';
  elsif coalesce(p_impact, '') ilike '%customer%' or coalesce(p_action_type, '') ilike '%customer%' then
    return 'customer_experience_transformation';
  elsif coalesce(p_action_type, '') ilike '%restruct%' or coalesce(p_impact, '') ilike '%restruct%' then
    return 'organizational_restructuring';
  elsif coalesce(p_module, '') ilike '%culture%' or coalesce(p_impact, '') ilike '%culture%' then
    return 'cultural_transformation';
  elsif coalesce(p_action_type, '') ilike '%process%' or coalesce(p_module, '') ilike '%process%' then
    return 'process_transformation';
  elsif coalesce(p_action_type, '') ilike '%technology%' or coalesce(p_module, '') ilike '%install%' then
    return 'technology_adoption';
  elsif coalesce(p_impact, '') ilike '%growth%' or coalesce(p_action_type, '') ilike '%growth%' then
    return 'growth_transformation';
  elsif coalesce(p_impact, '') ilike '%pivot%' or coalesce(p_action_type, '') ilike '%pivot%' then
    return 'strategic_pivot_initiatives';
  elsif coalesce(p_impact, '') ilike '%excellence%' or coalesce(p_module, '') ilike '%execution%' then
    return 'operational_excellence_programs';
  elsif coalesce(p_module, '') ilike '%digital%' or coalesce(p_action_type, '') ilike '%digital%' then
    return 'digital_transformation';
  else
    return 'process_transformation';
  end if;
end;
$$;

create or replace function public._etc_program_row(a public.aipify_actions)
returns jsonb
language plpgsql
stable
as $$
declare
  v_category text;
  v_health text;
  v_adoption integer;
begin
  v_category := public._etc_transformation_category(a.action_type, coalesce(a.created_by_module, ''), coalesce(a.estimated_impact, ''));
  v_health := public._asip_portfolio_health(a.status, a.status = 'blocked', a.created_at < now() - interval '21 days' and a.status not in ('executed','cancelled','rejected'));
  v_adoption := greatest(35, least(95, 100 - case when a.status = 'blocked' then 25 when a.status = 'pending_approval' then 12 else 0 end
    - case when a.created_at < now() - interval '30 days' and a.status not in ('executed','cancelled','rejected') then 10 else 0 end));
  return jsonb_build_object(
    'id', a.id,
    'title', a.title,
    'category', v_category,
    'status', a.status,
    'health', v_health,
    'adoption_progress', v_adoption,
    'sponsorship_status', case when a.risk_level in ('high','critical') then 'executive_engaged' when a.status in ('approved','executing') then 'active' else 'developing' end,
    'milestones_achieved', case when a.status = 'executed' then 1 else 0 end,
    'created_at', a.created_at
  );
end;
$$;

create or replace function public.get_enterprise_transformation_change_center()
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
  v_active integer;
  v_on_track integer;
  v_at_risk integer;
  v_blocked integer;
  v_pending integer;
  v_executed integer;
  v_health integer;
  v_readiness integer;
  v_adoption integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');

  select count(*) filter (where status not in ('executed','cancelled','rejected')),
         count(*) filter (where public._asip_portfolio_health(a.status, a.status = 'blocked', false) = 'on_track' and a.status not in ('executed','cancelled','rejected')),
         count(*) filter (where public._asip_portfolio_health(a.status, false, a.created_at < now() - interval '21 days') = 'at_risk' and a.status not in ('executed','cancelled','rejected')),
         count(*) filter (where status = 'blocked'),
         count(*) filter (where status = 'pending_approval'),
         count(*) filter (where status = 'executed' and executed_at > now() - interval '90 days')
  into v_active, v_on_track, v_at_risk, v_blocked, v_pending, v_executed
  from public.aipify_actions a where a.tenant_id = v_tenant_id;

  v_health := greatest(40, least(95, 100 - v_blocked * 10 - v_at_risk * 5 - v_pending * 3));
  v_readiness := greatest(35, v_health - case when v_pending > 4 then 10 else 0 end);
  v_adoption := greatest(40, least(92, v_on_track * 8 + v_executed * 3 + 45));

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'transformation_dashboard', jsonb_build_object(
      'active_programs', v_active,
      'health_status', public._esdc_org_health_status(v_health),
      'health_score', v_health,
      'adoption_progress', v_adoption,
      'change_readiness_score', v_readiness,
      'change_readiness_status', public._etc_readiness_status(v_readiness),
      'resistance_signals_count', v_blocked + v_at_risk,
      'milestones_achieved', v_executed,
      'executive_sponsorship_status', case when v_active > 0 and v_blocked = 0 then 'strong' when v_blocked > 0 then 'needs_attention' else 'developing' end,
      'active_programs_list', coalesce((select jsonb_agg(public._etc_program_row(a) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('executed','cancelled','rejected') limit 12), '[]'::jsonb)
    ),
    'transformation_categories', jsonb_build_array(
      jsonb_build_object('key', 'digital_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'digital_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'organizational_restructuring', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'organizational_restructuring' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'process_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'process_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'technology_adoption', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'technology_adoption' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'cultural_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'cultural_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'compliance_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'compliance_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'customer_experience_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'customer_experience_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'strategic_pivot_initiatives', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'strategic_pivot_initiatives' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'growth_transformation', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'growth_transformation' and a.status not in ('cancelled','rejected')), 0)),
      jsonb_build_object('key', 'operational_excellence_programs', 'count', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and public._etc_transformation_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,'')) = 'operational_excellence_programs' and a.status not in ('cancelled','rejected')), 0))
    ),
    'change_readiness', jsonb_build_object(
      'overall_score', v_readiness,
      'overall_status', public._etc_readiness_status(v_readiness),
      'leadership_alignment', jsonb_build_object('score', v_readiness, 'status', public._etc_readiness_status(v_readiness)),
      'employee_understanding', jsonb_build_object('score', greatest(40, v_readiness - 5), 'status', public._etc_readiness_status(greatest(40, v_readiness - 5))),
      'communication_effectiveness', jsonb_build_object('score', greatest(45, v_readiness - 3), 'status', public._etc_readiness_status(greatest(45, v_readiness - 3))),
      'resource_availability', jsonb_build_object('score', greatest(40, v_health - 8), 'status', public._etc_readiness_status(greatest(40, v_health - 8))),
      'training_readiness', jsonb_build_object('score', v_adoption, 'status', public._etc_readiness_status(v_adoption)),
      'governance_readiness', jsonb_build_object('score', greatest(50, v_health - v_pending * 2), 'status', public._etc_readiness_status(greatest(50, v_health - v_pending * 2)))
    ),
    'adoption_intelligence', jsonb_build_object(
      'training_participation', v_adoption,
      'process_adoption_rate', greatest(45, v_on_track * 10 + 40),
      'usage_pattern', case when v_on_track > v_at_risk then 'positive' else 'monitor' end,
      'support_requests', v_blocked + v_pending,
      'feedback_trend', case when v_executed > 0 then 'improving' else 'baseline' end,
      'department_adoption_notes', 'Derived from initiative execution patterns — not individual surveillance',
      'department_differences', coalesce((select jsonb_agg(jsonb_build_object('area', coalesce(a.created_by_module, 'Operations'), 'adoption', greatest(40, 100 - case when a.status = 'blocked' then 30 else 0 end)) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('cancelled','rejected') limit 6), '[]'::jsonb)
    ),
    'resistance_monitoring', jsonb_build_array(
      case when v_at_risk > 0 then jsonb_build_object('signal', 'repeated_delays', 'severity', 'moderate', 'supportive_note', 'Review timeline expectations and remove blockers with affected teams') else null end,
      case when v_blocked > 0 then jsonb_build_object('signal', 'escalating_concerns', 'severity', 'elevated', 'supportive_note', 'Blocked initiatives may indicate resource or alignment gaps — engage sponsors') else null end,
      case when v_pending > 3 then jsonb_build_object('signal', 'low_participation', 'severity', 'moderate', 'supportive_note', 'Approval backlog may slow adoption — clarify decision ownership') else null end,
      case when v_on_track = 0 and v_active > 0 then jsonb_build_object('signal', 'declining_engagement', 'severity', 'monitor', 'supportive_note', 'No initiatives on track — consider communication and support adjustments') else null end
    ) - null,
    'executive_briefing', jsonb_build_object(
      'current_status', format('%s active transformation programs with health score %s and adoption at %s%%.', v_active, v_health, v_adoption),
      'achievements', coalesce((select jsonb_agg(a.title order by a.executed_at desc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed' and a.executed_at > now() - interval '90 days' limit 5), '[]'::jsonb),
      'emerging_risks', coalesce((select jsonb_agg(a.title order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and (a.status = 'blocked' or a.risk_level in ('high','critical')) limit 5), '[]'::jsonb),
      'adoption_trends', case when v_adoption >= 70 then 'Positive adoption momentum' when v_adoption >= 55 then 'Mixed adoption — targeted support recommended' else 'Early stage — focus on readiness and communication' end,
      'recommended_interventions', jsonb_build_array('Clarify executive sponsorship on blocked programs', 'Strengthen change communication cadence', 'Address approval backlog affecting momentum'),
      'priority_focus', jsonb_build_array('Leadership alignment', 'Training enablement', 'Resistance support'),
      'confidence_score', greatest(55, least(88, v_readiness)),
      'confidence_level', public._asip_confidence_level(v_readiness),
      'disclaimer', 'Transformation intelligence supports leaders — people remain at the center of change.'
    ),
    'stakeholder_mapping', jsonb_build_object(
      'executive_sponsors', coalesce((select jsonb_agg(distinct public._acad_current_owner(a.id)) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level in ('high','critical') limit 5), '[]'::jsonb),
      'transformation_leaders', jsonb_build_array('Executive sponsor network', 'Action Center program owners'),
      'department_champions', jsonb_build_array('Module leads from active initiatives'),
      'subject_matter_experts', jsonb_build_array('Business DNA knowledge owners', 'Install Engine specialists'),
      'impacted_teams', coalesce((select jsonb_agg(distinct coalesce(a.created_by_module, 'Operations')) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('cancelled','rejected') limit 8), '[]'::jsonb),
      'communication_owners', jsonb_build_array('Executive communications lead', 'Program change managers')
    ),
    'communication_intelligence', jsonb_build_object(
      'frequency', case when v_active > 5 then 'regular' when v_active > 0 then 'developing' else 'baseline' end,
      'reach_indicator', v_adoption,
      'acknowledgement_rate', greatest(50, v_readiness - 5),
      'understanding_indicator', v_readiness,
      'missed_audiences', case when v_at_risk > 0 then jsonb_build_array('Teams with delayed initiatives') else '[]'::jsonb end,
      'recommended_actions', jsonb_build_array('Share transformation progress in leadership forums', 'Reinforce why change is necessary', 'Celebrate milestones achieved')
    ),
    'training_enablement', jsonb_build_object(
      'completion_rate', v_adoption,
      'knowledge_gaps', coalesce((select jsonb_agg(a.title order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' limit 4), '[]'::jsonb),
      'department_readiness', public._etc_readiness_status(v_readiness),
      'follow_up_recommendations', jsonb_build_array('Targeted enablement for blocked programs', 'Peer learning from completed initiatives'),
      'learning_pathways', jsonb_build_array('Action Center execution guides', 'Business DNA knowledge articles', 'Employee Knowledge onboarding paths')
    ),
    'milestones', jsonb_build_object(
      'planned', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'status', a.status, 'due', a.scheduled_for) order by a.scheduled_for asc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('approved','executing','scheduled','pending_approval') limit 10), '[]'::jsonb),
      'completed', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'completed_at', a.executed_at) order by a.executed_at desc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed' limit 10), '[]'::jsonb),
      'delayed', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'reason', 'Timeline exceeded') order by a.created_at asc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.created_at < now() - interval '21 days' and a.status not in ('executed','cancelled','rejected') limit 8), '[]'::jsonb),
      'blocked', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'reason', 'Execution blocked') order by a.updated_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked' limit 8), '[]'::jsonb),
      'executive_review', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'risk_level', a.risk_level) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level in ('high','critical') and a.status not in ('executed','cancelled','rejected') limit 6), '[]'::jsonb)
    ),
    'learning_insights', jsonb_build_object(
      'lessons_learned', 'Completed initiatives provide the strongest change signals',
      'successful_interventions', 'Executive sponsorship correlates with faster unblocking',
      'adoption_success_factors', 'Clear communication and training readiness improve outcomes',
      'transformation_bottlenecks', 'Approval backlog and blocked execution paths slow adoption',
      'future_recommendations', 'Document lessons after each milestone; integrate Early Warning signals early'
    ),
    'reflection_prompts', jsonb_build_array(
      jsonb_build_object('prompt', 'What is changing?', 'guidance', 'Review active programs and category distribution'),
      jsonb_build_object('prompt', 'Why is this necessary?', 'guidance', 'Connect initiatives to strategic portfolio priorities'),
      jsonb_build_object('prompt', 'Who is most impacted?', 'guidance', 'Review stakeholder mapping and impacted teams'),
      jsonb_build_object('prompt', 'What support is needed?', 'guidance', 'Assess readiness gaps and training recommendations'),
      jsonb_build_object('prompt', 'What risks should leadership monitor?', 'guidance', 'Cross-reference Early Warning signals and resistance indicators'),
      jsonb_build_object('prompt', 'How will success be measured?', 'guidance', 'Track milestones, adoption progress, and completion outcomes')
    ),
    'principle', 'Aipify supports transformation efforts. People remain at the center of organizational change.'
  );
end;
$$;

create or replace function public.record_transformation_change_event(
  p_event_type text,
  p_description text default '',
  p_metadata jsonb default '{}'::jsonb,
  p_action_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_log_id uuid;
  v_action_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant not found'; end if;

  v_action_id := p_action_id;
  if v_action_id is not null and not exists(select 1 from public.aipify_actions where id = v_action_id and tenant_id = v_tenant_id) then
    raise exception 'Action not found';
  end if;

  if v_action_id is null then
    select id into v_action_id from public.aipify_actions where tenant_id = v_tenant_id order by created_at desc limit 1;
  end if;

  if v_action_id is null then
    return jsonb_build_object('recorded', false, 'reason', 'no_action_context');
  end if;

  v_log_id := public.record_aef_action_log(
    v_tenant_id, v_action_id,
    case when p_event_type in ('transformation_program_created','milestone_updated','executive_review','communication_activity','training_updated','risk_acknowledged','transformation_briefing_generated')
      then p_event_type else 'transformation_change_event' end,
    left(coalesce(p_description, ''), 500),
    (select u.id::text from public.users u where u.auth_user_id = auth.uid() limit 1),
    'user',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('engine', 'transformation_change_intelligence_phase268')
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.get_enterprise_transformation_change_center() to authenticated;
grant execute on function public.record_transformation_change_event(text, text, jsonb, uuid) to authenticated;

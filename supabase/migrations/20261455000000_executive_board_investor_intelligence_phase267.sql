-- Phase 267 — Executive Board & Investor Intelligence Engine

create or replace function public._ebii_governance_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'strong'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'monitor'
    when p_score >= 45 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public.get_executive_board_investor_intelligence_center()
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
  v_health integer;
  v_on_track integer;
  v_at_risk integer;
  v_blocked integer;
  v_pending integer;
  v_executed integer;
  v_governance integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');

  select count(*) filter (where public._asip_portfolio_health(a.status, a.status = 'blocked', false) = 'on_track'),
         count(*) filter (where public._asip_portfolio_health(a.status, false, a.created_at < now() - interval '14 days') = 'at_risk'),
         count(*) filter (where status = 'blocked'),
         count(*) filter (where status = 'pending_approval'),
         count(*) filter (where status = 'executed' and executed_at > now() - interval '90 days')
  into v_on_track, v_at_risk, v_blocked, v_pending, v_executed
  from public.aipify_actions a where a.tenant_id = v_tenant_id;

  v_health := greatest(40, least(98, 100 - v_blocked * 8 - v_at_risk * 4 - v_pending * 2));
  v_governance := greatest(45, least(95, v_health - case when v_pending > 3 then 8 else 0 end));

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'board_dashboard', jsonb_build_object(
      'initiatives_on_track', v_on_track,
      'initiatives_at_risk', v_at_risk,
      'executive_priorities', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level in ('high','critical') and a.status not in ('executed','cancelled','rejected')), 0),
      'organization_health_score', v_health,
      'organization_health_status', public._esdc_org_health_status(v_health),
      'financial_trend_summary', case when v_executed > 0 then 'Positive execution momentum — review portfolio for revenue-linked initiatives' else 'Establish baseline — limited completed initiatives in period' end,
      'risk_landscape_count', v_blocked + v_at_risk,
      'major_opportunities', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and coalesce(a.estimated_impact,'') <> '' and a.status in ('approved','pending_approval')), 0),
      'board_attention_items', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'reason', case when a.risk_level = 'critical' then 'Critical risk item' when a.status = 'blocked' then 'Blocked initiative' else 'Executive priority' end) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and (a.risk_level in ('high','critical') or a.status = 'blocked') limit 8), '[]'::jsonb)
    ),
    'investor_readiness', jsonb_build_object(
      'revenue_trajectory', case when v_executed >= 3 then 'stable_positive' when v_executed > 0 then 'emerging' else 'baseline' end,
      'revenue_trajectory_note', 'Illustrative indicator from execution outcomes — not financial reporting',
      'customer_growth_indicator', greatest(50, v_health - 5),
      'retention_indicator', greatest(55, v_health),
      'product_adoption_trend', case when v_on_track > v_at_risk then 'positive' else 'monitor' end,
      'expansion_readiness', case when v_health >= 75 then 'ready' when v_health >= 60 then 'developing' else 'foundational' end,
      'operational_maturity', public._ebii_governance_status(v_health),
      'governance_maturity', public._ebii_governance_status(v_governance)
    ),
    'board_meeting', jsonb_build_object(
      'executive_highlights', jsonb_build_array(
        format('%s strategic initiatives on track', v_on_track),
        format('%s initiatives completed in last 90 days', v_executed),
        'Integrated intelligence from Action Center, Portfolio, and Early Warning systems'
      ),
      'major_accomplishments', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'completed_at', a.executed_at) order by a.executed_at desc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed' and a.executed_at > now() - interval '90 days' limit 6), '[]'::jsonb),
      'strategic_updates', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'status', a.status, 'health', public._asip_portfolio_health(a.status, a.status = 'blocked', a.created_at < now() - interval '14 days')) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('cancelled','rejected') limit 10), '[]'::jsonb),
      'risks_for_discussion', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'risk_level', a.risk_level) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and (a.status = 'blocked' or a.risk_level in ('high','critical')) limit 8), '[]'::jsonb),
      'investment_opportunities', coalesce((select jsonb_agg(jsonb_build_object('title', a.title, 'impact', coalesce(a.estimated_impact, 'Strategic value')) order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('approved','pending_approval') and coalesce(a.estimated_impact,'') <> '' limit 6), '[]'::jsonb),
      'recommended_decisions', jsonb_build_array('Review critical approval backlog', 'Confirm ownership on blocked initiatives', 'Align portfolio priorities with board strategy'),
      'action_items', coalesce((select jsonb_agg(jsonb_build_object('title', l.event_description, 'created_at', l.created_at) order by l.created_at desc) from public.aipify_action_logs l join public.aipify_actions a on a.id = l.action_id where a.tenant_id = v_tenant_id and l.event_type in ('signal_escalated','approval_decision','executive_decision_learning') limit 8), '[]'::jsonb)
    ),
    'decision_register', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'action_id', l.action_id,
        'decision', l.event_description,
        'event_type', l.event_type,
        'outcome', coalesce(l.metadata_json->>'actual_outcome', l.metadata_json->>'actual_result', 'Pending confirmation'),
        'rationale', coalesce(l.metadata_json->>'lessons_learned', l.metadata_json->>'notes', ''),
        'implementation_status', case when a.status = 'executed' then 'completed' when a.status in ('executing','scheduled','approved') then 'in_progress' else 'pending' end,
        'follow_up', public._acad_current_owner(a.id),
        'created_at', l.created_at,
        'performed_by', l.performed_by
      ) order by l.created_at desc)
      from public.aipify_action_logs l
      join public.aipify_actions a on a.id = l.action_id
      where a.tenant_id = v_tenant_id
        and l.event_type in ('action_approved','action_rejected','approval_decision','executive_decision_learning','initiative_learning','signal_acknowledged')
      limit 25),
      '[]'::jsonb
    ),
    'strategic_performance', jsonb_build_object(
      'revenue_growth', jsonb_build_object('score', greatest(50, v_health - 8), 'status', public._ebii_governance_status(v_health - 8), 'note', 'Proxy from strategic execution — not audited financials'),
      'customer_satisfaction', jsonb_build_object('score', v_health, 'status', public._ebii_governance_status(v_health)),
      'operational_efficiency', jsonb_build_object('score', greatest(45, v_health - 5), 'status', public._ebii_governance_status(v_health - 5)),
      'execution_performance', jsonb_build_object('score', v_health, 'status', public._ebii_governance_status(v_health)),
      'compliance_readiness', jsonb_build_object('score', 82, 'status', 'healthy'),
      'innovation_effectiveness', jsonb_build_object('score', greatest(50, v_executed * 5 + 50), 'status', public._ebii_governance_status(greatest(50, v_executed * 5 + 50))),
      'partner_ecosystem', jsonb_build_object('score', 72, 'status', 'healthy'),
      'organizational_resilience', jsonb_build_object('score', greatest(40, v_health - v_blocked * 5), 'status', public._ebii_governance_status(greatest(40, v_health - v_blocked * 5)))
    ),
    'investor_briefing', jsonb_build_object(
      'current_position', format('Organization health at %s with %s initiatives on track and %s at risk.', v_health, v_on_track, v_at_risk),
      'market_opportunities', 'Growth linked to approved strategic initiatives and operational efficiency gains',
      'growth_potential', case when v_health >= 70 then 'Moderate to strong based on execution patterns' else 'Developing — focus on execution discipline' end,
      'operational_strengths', jsonb_build_array('Integrated Action Center governance', 'Portfolio visibility', 'Early warning signal detection'),
      'material_risks', coalesce((select jsonb_agg(a.title order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and (a.status = 'blocked' or a.risk_level = 'critical') limit 5), '[]'::jsonb),
      'recommended_focus', jsonb_build_array('Clear blocked initiatives', 'Strengthen approval discipline', 'Document board decisions'),
      'confidence_score', greatest(55, least(88, v_governance)),
      'confidence_level', public._asip_confidence_level(v_governance),
      'disclaimer', 'Board and investor intelligence is illustrative governance insight — not financial advice or audited reporting.'
    ),
    'governance_health', jsonb_build_object(
      'overall_score', v_governance,
      'overall_status', public._ebii_governance_status(v_governance),
      'decision_transparency', jsonb_build_object('score', v_governance, 'status', public._ebii_governance_status(v_governance)),
      'approval_discipline', jsonb_build_object('score', greatest(40, 90 - v_pending * 5), 'status', public._ebii_governance_status(greatest(40, 90 - v_pending * 5))),
      'risk_oversight', jsonb_build_object('score', greatest(40, v_health - v_blocked * 6), 'status', public._ebii_governance_status(greatest(40, v_health - v_blocked * 6))),
      'policy_compliance', jsonb_build_object('score', 84, 'status', 'healthy'),
      'executive_accountability', jsonb_build_object('score', v_governance, 'status', public._ebii_governance_status(v_governance)),
      'audit_readiness', jsonb_build_object('score', greatest(50, v_governance - 3), 'status', public._ebii_governance_status(greatest(50, v_governance - 3))),
      'board_effectiveness', jsonb_build_object('score', v_governance, 'status', public._ebii_governance_status(v_governance))
    ),
    'scenarios', jsonb_build_array(
      jsonb_build_object('question', 'What if current growth slows?', 'possibility', 'Execution backlog may increase; early warning signals would elevate — review portfolio priorities.', 'certainty', 'exploratory'),
      jsonb_build_object('question', 'What if execution delays increase?', 'possibility', 'Board attention items and risk landscape would expand; governance health may shift to Monitor.', 'certainty', 'exploratory'),
      jsonb_build_object('question', 'What if customer churn rises?', 'possibility', 'Customer satisfaction indicators would decline; customer-risk warnings would surface in Early Warning Center.', 'certainty', 'exploratory'),
      jsonb_build_object('question', 'What if strategic initiatives succeed faster than expected?', 'possibility', 'Capacity and partner ecosystem indicators become focus areas; replication of successful practices recommended.', 'certainty', 'exploratory')
    ),
    'executive_narrative', jsonb_build_object(
      'summary', format('Over the review period, the organization maintained a health score of %s with %s initiatives on track. %s initiatives were completed while %s require board attention.', v_health, v_on_track, v_executed, v_blocked + case when v_at_risk > 0 then 1 else 0 end),
      'achievements', coalesce((select jsonb_agg(a.title order by a.executed_at desc nulls last) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed' limit 5), '[]'::jsonb),
      'challenges', coalesce((select jsonb_agg(a.title order by a.created_at desc) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked' limit 5), '[]'::jsonb),
      'risks', format('%s blocked initiatives and %s at-risk items in portfolio', v_blocked, v_at_risk),
      'opportunities', format('%s high-impact opportunities awaiting decision', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval' and coalesce(a.estimated_impact,'') <> ''), 0)),
      'recommended_priorities', jsonb_build_array('Resolve blocked execution paths', 'Strengthen board decision documentation', 'Align investor narrative with verified outcomes'),
      'suitable_for', jsonb_build_array('board_meeting', 'investor_update', 'leadership_offsite', 'annual_review', 'strategic_planning')
    ),
    'learning_insights', jsonb_build_object(
      'board_decision_effectiveness', 'Documented decisions correlate with faster implementation',
      'investor_briefing_usefulness', 'Integrated portfolio and warning data improves narrative quality',
      'strategic_outcome_accuracy', 'Improves as completion feedback accumulates',
      'executive_follow_through', 'Track via decision register and audit logs',
      'trend_reliability', 'Increases with historical execution data'
    ),
    'principle', 'Aipify strengthens governance and strategic awareness. Human leadership remains responsible for decisions.'
  );
end;
$$;

create or replace function public.record_board_investor_intelligence_event(
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
    case when p_event_type in ('board_briefing_generated','board_decision_documented','executive_review','investor_report_created','board_intelligence_access')
      then p_event_type else 'board_intelligence_event' end,
    left(coalesce(p_description, ''), 500),
    (select u.id::text from public.users u where u.auth_user_id = auth.uid() limit 1),
    'user',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('engine', 'board_investor_intelligence_phase267')
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.get_executive_board_investor_intelligence_center() to authenticated;
grant execute on function public.record_board_investor_intelligence_event(text, text, jsonb, uuid) to authenticated;

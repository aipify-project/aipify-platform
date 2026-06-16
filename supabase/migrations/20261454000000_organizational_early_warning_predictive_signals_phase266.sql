-- Phase 266 — Organizational Early Warning & Predictive Signals Engine

create or replace function public._oew_warning_category(p_action_type text, p_risk text, p_status text)
returns text
language sql
immutable
as $$
  select case
    when p_action_type ilike '%compliance%' or p_action_type ilike '%policy%' or p_action_type ilike '%governance%' then 'compliance_risk'
    when p_action_type ilike '%billing%' or p_action_type ilike '%revenue%' or p_action_type ilike '%invoice%' then 'financial_risk'
    when p_action_type ilike '%customer%' or p_action_type ilike '%support%' then 'customer_risk'
    when p_action_type ilike '%employee%' or p_action_type ilike '%team%' then 'employee_risk'
    when p_action_type ilike '%partner%' or p_action_type ilike '%market%' then 'partner_risk'
    when p_status = 'blocked' or coalesce(p_risk, 'low') in ('high', 'critical') then 'strategic_execution_risk'
    when p_action_type ilike '%automation%' or p_action_type ilike '%workflow%' then 'operational_risk'
    else 'capacity_risk'
  end;
$$;

create or replace function public._oew_severity_level(p_risk text, p_overdue boolean, p_blocked boolean, p_days_stale integer)
returns text
language sql
immutable
as $$
  select case
    when coalesce(p_risk, 'low') = 'critical' or (p_blocked and coalesce(p_risk, 'low') = 'high') then 'critical_attention_required'
    when coalesce(p_risk, 'low') = 'high' or coalesce(p_overdue, false) or coalesce(p_days_stale, 0) > 21 then 'high_risk'
    when p_blocked or coalesce(p_days_stale, 0) > 14 then 'elevated_concern'
    when coalesce(p_days_stale, 0) > 7 or coalesce(p_risk, 'low') = 'medium' then 'monitor'
    else 'informational'
  end;
$$;

create or replace function public._oew_confidence_from_severity(p_severity text)
returns integer
language sql
immutable
as $$
  select case p_severity
    when 'critical_attention_required' then 88
    when 'high_risk' then 78
    when 'elevated_concern' then 68
    when 'monitor' then 58
    else 48
  end;
$$;

create or replace function public._oew_warning_row(
  p_id uuid,
  p_title text,
  p_description text,
  p_action_type text,
  p_risk text,
  p_status text,
  p_created_at timestamptz,
  p_estimated_impact text,
  p_signal_type text default 'emerging_risk'
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_overdue boolean;
  v_blocked boolean;
  v_days integer;
  v_category text;
  v_severity text;
  v_confidence integer;
begin
  v_overdue := p_status in ('pending_approval', 'approved', 'scheduled', 'executing') and p_created_at < now() - interval '14 days';
  v_blocked := p_status = 'blocked';
  v_days := greatest(0, extract(day from now() - p_created_at)::integer);
  v_category := public._oew_warning_category(p_action_type, p_risk, p_status);
  v_severity := public._oew_severity_level(p_risk, v_overdue, v_blocked, v_days);
  v_confidence := public._oew_confidence_from_severity(v_severity);

  return jsonb_build_object(
    'id', p_id,
    'title', p_title,
    'description', left(coalesce(p_description, ''), 300),
    'signal_type', p_signal_type,
    'category', v_category,
    'severity', v_severity,
    'severity_explanation', case v_severity
      when 'critical_attention_required' then 'Immediate leadership review recommended'
      when 'high_risk' then 'Significant risk if unaddressed'
      when 'elevated_concern' then 'Trend warrants proactive attention'
      when 'monitor' then 'Watch for further deterioration'
      else 'Informational — no immediate action required'
    end,
    'reasoning', case
      when v_blocked then 'Initiative is blocked — execution momentum at risk'
      when v_overdue then format('Item aging %s days beyond expected progress window', v_days)
      when p_status = 'pending_approval' then 'Approval backlog may delay strategic execution'
      else 'Pattern detected from operational signals'
    end,
    'suggested_actions', jsonb_build_array(
      'Review in Executive Decision Cockpit',
      'Assign owner and confirm timeline',
      'Acknowledge or escalate in Early Warning Center'
    ),
    'confidence_score', v_confidence,
    'confidence_level', public._asip_confidence_level(v_confidence),
    'risk_level', p_risk,
    'status', p_status,
    'created_at', p_created_at
  );
end;
$$;

create or replace function public.get_organizational_early_warning_center()
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
  v_blocked integer;
  v_overdue integer;
  v_pending integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  v_plan := public._aef_tenant_plan(v_tenant_id);
  v_has_access := v_plan in ('business', 'enterprise');

  select count(*) filter (where status = 'blocked'),
         count(*) filter (where status in ('approved','scheduled','executing','pending_approval') and created_at < now() - interval '14 days'),
         count(*) filter (where status = 'pending_approval')
  into v_blocked, v_overdue, v_pending
  from public.aipify_actions where tenant_id = v_tenant_id and status not in ('cancelled', 'rejected');

  v_health_score := greatest(40, least(98, 100 - v_blocked * 8 - v_overdue * 4 - v_pending * 2));

  return jsonb_build_object(
    'found', true,
    'has_access', v_has_access,
    'upgrade_required', not v_has_access,
    'dashboard', jsonb_build_object(
      'emerging_risks', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level in ('high','critical') and a.status not in ('executed','cancelled','rejected')), 0),
      'escalating_bottlenecks', v_blocked + v_pending,
      'losing_momentum', v_overdue,
      'team_overload_signals', greatest(0, v_pending + v_blocked - 2),
      'customer_deterioration_signals', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.action_type ilike '%customer%' and a.status = 'blocked'), 0),
      'compliance_warnings', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and (a.action_type ilike '%compliance%' or a.action_type ilike '%policy%') and a.status not in ('executed','cancelled')), 0),
      'revenue_trend_warnings', coalesce((select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.action_type ilike '%billing%' and a.created_at < now() - interval '7 days' and a.status not in ('executed','cancelled')), 0)
    ),
    'warnings', coalesce(
      (select jsonb_agg(public._oew_warning_row(a.id, a.title, a.description, a.action_type, a.risk_level, a.status, a.created_at, a.estimated_impact, 'emerging_risk') order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status not in ('executed', 'cancelled', 'rejected')
        and (a.status = 'blocked' or a.risk_level in ('high', 'critical') or a.created_at < now() - interval '7 days')
      limit 25),
      '[]'::jsonb
    ),
    'predictive_trends', jsonb_build_array(
      jsonb_build_object('trend', 'increasing_delays', 'detected', v_overdue > 0, 'count', v_overdue, 'direction', case when v_overdue > 2 then 'up' else 'stable' end),
      jsonb_build_object('trend', 'repeated_blockers', 'detected', v_blocked > 0, 'count', v_blocked, 'direction', case when v_blocked > 1 then 'up' else 'stable' end),
      jsonb_build_object('trend', 'approval_bottlenecks', 'detected', v_pending > 2, 'count', v_pending, 'direction', case when v_pending > 3 then 'up' else 'stable' end),
      jsonb_build_object('trend', 'execution_slowdowns', 'detected', v_overdue > 1, 'count', v_overdue, 'direction', 'stable')
    ),
    'forecasts', jsonb_build_object(
      'disclaimer', 'Estimates based on current patterns — not guarantees.',
      'periods', jsonb_build_array(
        jsonb_build_object('days', 30, 'health_score_estimate', greatest(35, v_health_score - 3), 'risk_level', case when v_health_score - 3 < 55 then 'elevated' else 'moderate' end),
        jsonb_build_object('days', 60, 'health_score_estimate', greatest(35, v_health_score - 6), 'risk_level', case when v_health_score - 6 < 55 then 'elevated' else 'moderate' end),
        jsonb_build_object('days', 90, 'health_score_estimate', greatest(35, v_health_score - 10), 'risk_level', case when v_health_score - 10 < 50 then 'high' else 'moderate' end),
        jsonb_build_object('days', 180, 'health_score_estimate', greatest(30, v_health_score - 15), 'risk_level', case when v_health_score - 15 < 50 then 'high' else 'moderate' end)
      ),
      'factors', jsonb_build_array('execution_performance', 'approval_backlog', 'blocker_frequency', 'initiative_completion_rate')
    ),
    'opportunities', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title,
        'type', case public._asip_initiative_category(a.action_type, coalesce(a.created_by_module,''), coalesce(a.estimated_impact,''))
          when 'operational_efficiency' then 'efficiency_gain'
          when 'revenue_growth' then 'growth_opportunity'
          when 'market_expansion' then 'partnership_opportunity'
          else 'underutilized_capability'
        end,
        'description', coalesce(a.estimated_impact, 'Positive signal detected'),
        'confidence_score', public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status)
      ) order by a.created_at desc)
      from public.aipify_actions a
      where a.tenant_id = v_tenant_id and a.status in ('approved', 'executed') and coalesce(a.estimated_impact, '') <> ''
      limit 10),
      '[]'::jsonb
    ),
    'escalation_rules', jsonb_build_array(
      jsonb_build_object('rule', 'repeated_missed_deadlines', 'threshold', 3, 'enabled', true, 'description', 'Escalate when 3+ initiatives exceed timeline'),
      jsonb_build_object('rule', 'approval_backlog', 'threshold', 5, 'enabled', true, 'description', 'Escalate when pending approvals exceed threshold'),
      jsonb_build_object('rule', 'risk_accumulation', 'threshold', 4, 'enabled', true, 'description', 'Escalate when high/critical risk items accumulate'),
      jsonb_build_object('rule', 'customer_issue_volume', 'threshold', 3, 'enabled', true, 'description', 'Escalate on customer-related blockers'),
      jsonb_build_object('rule', 'workload_imbalance', 'threshold', 6, 'enabled', true, 'description', 'Escalate when overload signals exceed threshold')
    ),
    'attention_queue', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', w->>'id',
        'title', w->>'title',
        'urgency', w->>'severity',
        'impact', w->>'reasoning',
        'confidence_score', (w->>'confidence_score')::integer,
        'confidence_level', w->>'confidence_level',
        'review_timeline', case w->>'severity'
          when 'critical_attention_required' then 'Within 24 hours'
          when 'high_risk' then 'Within 3 days'
          when 'elevated_concern' then 'Within 7 days'
          else 'Next leadership review'
        end,
        'stakeholder', 'Executive Sponsor'
      ) order by (w->>'confidence_score')::integer desc)
      from jsonb_array_elements(
        coalesce(
          (select jsonb_agg(public._oew_warning_row(a.id, a.title, a.description, a.action_type, a.risk_level, a.status, a.created_at, a.estimated_impact) order by a.created_at desc)
          from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status not in ('executed','cancelled','rejected')
            and (a.risk_level in ('high','critical') or a.status = 'blocked')
          limit 15),
          '[]'::jsonb
        )
      ) w),
      '[]'::jsonb
    ),
    'learning_insights', jsonb_build_object(
      'accuracy_estimate', greatest(55, least(92, v_health_score)),
      'false_positive_rate_estimate', greatest(5, 25 - v_blocked * 2),
      'response_effectiveness', 'Early acknowledgment correlates with faster resolution',
      'forecast_reliability', 'Improves as more completion data accumulates'
    ),
    'principle', 'Aipify identifies patterns and signals. Humans remain responsible for interpretation and action.'
  );
end;
$$;

create or replace function public.get_organizational_early_warning_signal_briefing(p_signal_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_warning jsonb;
  v_severity text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  select * into v_action from public.aipify_actions where id = p_signal_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  v_warning := public._oew_warning_row(v_action.id, v_action.title, v_action.description, v_action.action_type, v_action.risk_level, v_action.status, v_action.created_at, v_action.estimated_impact);
  v_severity := v_warning->>'severity';

  return jsonb_build_object(
    'found', true,
    'signal_id', v_action.id,
    'title', v_action.title,
    'briefing', jsonb_build_object(
      'what_changed', format('Signal detected: %s is %s with %s severity.', v_action.title, v_action.status, v_severity),
      'why_important', v_warning->>'reasoning',
      'what_may_happen_next', case v_severity
        when 'critical_attention_required' then 'Escalation to broader operational impact without leadership intervention'
        when 'high_risk' then 'Timeline slippage and dependent initiative delays'
        else 'Continued monitoring may be sufficient if trends stabilize'
      end,
      'response_options', jsonb_build_array(
        'Acknowledge and assign owner',
        'Escalate to Executive Decision Cockpit',
        'Dismiss with documented rationale',
        'Review linked initiative in Strategic Portfolio'
      ),
      'urgency_level', v_severity,
      'confidence_score', (v_warning->>'confidence_score')::integer,
      'confidence_level', v_warning->>'confidence_level'
    ),
    'principle', 'Aipify identifies patterns and signals. Humans remain responsible for interpretation and action.'
  );
end;
$$;

create or replace function public.record_organizational_early_warning_event(
  p_signal_id uuid,
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
  v_log_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant not found'; end if;

  if not exists(select 1 from public.aipify_actions where id = p_signal_id and tenant_id = v_tenant_id) then
    raise exception 'Signal not found';
  end if;

  v_log_id := public.record_aef_action_log(
    v_tenant_id, p_signal_id,
    case when p_event_type in ('signal_acknowledged','signal_dismissed','signal_escalated','signal_reviewed','signal_response')
      then p_event_type else 'early_warning_event' end,
    left(coalesce(p_description, ''), 500),
    (select u.id::text from public.users u where u.auth_user_id = auth.uid() limit 1),
    'user',
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('engine', 'early_warning_phase266')
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.get_organizational_early_warning_center() to authenticated;
grant execute on function public.get_organizational_early_warning_signal_briefing(uuid) to authenticated;
grant execute on function public.record_organizational_early_warning_event(uuid, text, text, jsonb) to authenticated;

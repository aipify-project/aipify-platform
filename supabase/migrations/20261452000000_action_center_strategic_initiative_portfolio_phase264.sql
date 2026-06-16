-- Phase 264 — Action Center Strategic Initiative Portfolio Engine

create or replace function public._asip_initiative_category(
  p_action_type text,
  p_module text default '',
  p_impact text default ''
)
returns text
language sql
immutable
as $$
  select case
    when p_action_type ilike '%billing%' or p_action_type ilike '%cost%' or p_action_type ilike '%invoice%' then 'cost_optimization'
    when p_action_type ilike '%compliance%' or p_action_type ilike '%policy%' or p_action_type ilike '%governance%' then 'compliance'
    when p_action_type ilike '%risk%' or p_action_type ilike '%recover%' or p_action_type ilike '%failed%' then 'risk_reduction'
    when p_action_type ilike '%employee%' or p_action_type ilike '%onboard%' or p_action_type ilike '%team%' then 'employee_experience'
    when p_action_type ilike '%product%' or p_action_type ilike '%feature%' or p_action_type ilike '%install%' then 'product_development'
    when p_action_type ilike '%market%' or p_action_type ilike '%partner%' or p_action_type ilike '%expansion%' then 'market_expansion'
    when p_action_type ilike '%customer%' or p_action_type ilike '%support%' or p_action_type ilike '%experience%' then 'customer_experience'
    when p_action_type ilike '%revenue%' or p_action_type ilike '%sales%' or p_action_type ilike '%lead%' or p_action_type ilike '%follow_up%' then 'revenue_growth'
    when p_action_type ilike '%automation%' or p_action_type ilike '%workflow%' or p_action_type ilike '%efficiency%' then 'operational_efficiency'
    when coalesce(p_impact, '') ilike '%innov%' then 'innovation'
    else 'operational_efficiency'
  end;
$$;

create or replace function public._asip_portfolio_health(
  p_status text,
  p_has_blocker boolean,
  p_overdue boolean
)
returns text
language sql
immutable
as $$
  select case
    when p_status in ('executed') then 'completed'
    when p_status in ('cancelled', 'rejected') then 'completed'
    when p_status = 'blocked' or coalesce(p_has_blocker, false) then 'blocked'
    when coalesce(p_overdue, false) then 'overdue'
    when p_status in ('pending_approval') then 'at_risk'
    when p_status in ('executing', 'scheduled', 'approved') then 'on_track'
    else 'at_risk'
  end;
$$;

create or replace function public._asip_alignment_score(
  p_risk text,
  p_impact text,
  p_status text
)
returns integer
language sql
immutable
as $$
  select greatest(35, least(98,
    70
    + case coalesce(p_risk, 'low')
        when 'critical' then 15 when 'high' then 10 when 'medium' then 5 else 0
      end
    + case when coalesce(p_impact, '') <> '' then 8 else 0 end
    + case when p_status in ('approved', 'scheduled', 'executing', 'executed') then 5 else 0 end
  ));
$$;

create or replace function public._asip_confidence_level(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'very_high'
    when p_score >= 75 then 'high'
    when p_score >= 60 then 'moderate'
    when p_score >= 45 then 'low'
    else 'very_low'
  end;
$$;

create or replace function public._asip_initiative_row(a public.aipify_actions)
returns jsonb
language plpgsql
stable
as $$
declare
  v_category text;
  v_health text;
  v_has_blocker boolean;
  v_overdue boolean;
  v_alignment integer;
  v_confidence integer;
  v_lifecycle text;
  v_waiting_dep boolean;
begin
  v_category := public._asip_initiative_category(a.action_type, coalesce(a.created_by_module, ''), coalesce(a.estimated_impact, ''));
  v_has_blocker := a.status = 'blocked' or exists(
    select 1 from public.aipify_action_logs l
    where l.action_id = a.id and l.event_type = 'execution_blocker'
      and coalesce(l.metadata_json->>'resolved', 'false') <> 'true'
  );
  v_waiting_dep := exists(
    select 1 from public.aipify_action_logs l
    where l.action_id = a.id and l.event_type = 'dependency_waiting'
      and coalesce(l.metadata_json->>'resolved', 'false') <> 'true'
  );
  v_overdue := a.status in ('approved', 'scheduled', 'executing', 'pending_approval')
    and a.created_at < now() - interval '14 days';
  v_health := public._asip_portfolio_health(a.status, v_has_blocker, v_overdue);
  v_alignment := public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status);
  v_confidence := greatest(40, least(95, v_alignment - case when v_has_blocker then 12 else 0 end - case when v_waiting_dep then 8 else 0 end));
  v_lifecycle := public._acec_lifecycle_stage(a.status, v_has_blocker, v_waiting_dep);

  return jsonb_build_object(
    'id', a.id,
    'title', a.title,
    'description', left(coalesce(a.description, ''), 300),
    'category', v_category,
    'status', a.status,
    'portfolio_health', v_health,
    'lifecycle_stage', v_lifecycle,
    'priority', public._acec_priority_from_action(a.risk_level, a.estimated_impact),
    'risk_level', a.risk_level,
    'alignment_score', v_alignment,
    'confidence_score', v_confidence,
    'confidence_level', public._asip_confidence_level(v_confidence),
    'expected_strategic_value', coalesce(a.estimated_impact, 'Strategic operational improvement'),
    'owner', public._acad_current_owner(a.id),
    'executive_sponsor', case when a.risk_level in ('high', 'critical') then 'Executive Sponsor' else null end,
    'department', case public._acia_action_category(a.action_type)
      when 'billing' then 'Finance' when 'support' then 'Support' when 'customer' then 'Customer Success'
      when 'governance' then 'Governance' else 'Operations' end,
    'business_goal', case v_category
      when 'revenue_growth' then 'Increase revenue and customer retention'
      when 'customer_experience' then 'Improve customer satisfaction and loyalty'
      when 'operational_efficiency' then 'Streamline operations and reduce friction'
      when 'compliance' then 'Meet regulatory and policy requirements'
      when 'risk_reduction' then 'Reduce operational and business risk'
      when 'product_development' then 'Deliver product capabilities customers need'
      when 'employee_experience' then 'Support team effectiveness and wellbeing'
      when 'market_expansion' then 'Expand market reach and partnerships'
      when 'cost_optimization' then 'Optimize cost structure sustainably'
      else 'Drive innovation and competitive advantage' end,
    'created_at', a.created_at,
    'scheduled_for', a.scheduled_for,
    'executed_at', a.executed_at,
    'requires_executive_decision', a.status = 'pending_approval' and a.risk_level in ('high', 'critical')
  );
end;
$$;

create or replace function public.get_action_center_strategic_initiative_portfolio()
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
    'portfolio_health_summary', jsonb_build_object(
      'on_track', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and public._asip_portfolio_health(a.status, a.status = 'blocked', a.created_at < now() - interval '14 days' and a.status not in ('executed','cancelled','rejected')) = 'on_track'),
      'at_risk', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and public._asip_portfolio_health(a.status, false, false) = 'at_risk' and a.status not in ('executed','cancelled','rejected')),
      'blocked', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked'),
      'overdue', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.status in ('approved','scheduled','executing','pending_approval') and a.created_at < now() - interval '14 days'),
      'completed', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed')
    ),
    'executive_priority', jsonb_build_object(
      'top_strategic', coalesce(
        (select jsonb_agg(public._asip_initiative_row(a) order by
          case a.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end, a.created_at desc)
        from public.aipify_actions a
        where a.tenant_id = v_tenant_id and a.status not in ('executed','cancelled','rejected')
        limit 8), '[]'::jsonb),
      'highest_risk', coalesce(
        (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
        from public.aipify_actions a
        where a.tenant_id = v_tenant_id and a.risk_level in ('critical','high') and a.status not in ('executed','cancelled','rejected')
        limit 8), '[]'::jsonb),
      'highest_value', coalesce(
        (select jsonb_agg(public._asip_initiative_row(a) order by public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status) desc)
        from public.aipify_actions a
        where a.tenant_id = v_tenant_id and a.status not in ('cancelled','rejected')
        limit 8), '[]'::jsonb),
      'most_delayed', coalesce(
        (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at asc)
        from public.aipify_actions a
        where a.tenant_id = v_tenant_id and a.status in ('approved','scheduled','executing','pending_approval')
          and a.created_at < now() - interval '7 days'
        limit 8), '[]'::jsonb),
      'executive_decisions', coalesce(
        (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
        from public.aipify_actions a
        where a.tenant_id = v_tenant_id and a.status = 'pending_approval' and a.risk_level in ('high','critical')
        limit 8), '[]'::jsonb)
    ),
    'risk_analysis', jsonb_build_object(
      'high_risk_concentration', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id and a.risk_level in ('high','critical') and a.status not in ('executed','cancelled','rejected')),
      'unresolved_blockers', (select count(distinct l.action_id) from public.aipify_action_logs l
        join public.aipify_actions a on a.id = l.action_id
        where a.tenant_id = v_tenant_id and l.event_type = 'execution_blocker'
          and coalesce(l.metadata_json->>'resolved', 'false') <> 'true'),
      'missing_owners', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.status not in ('executed','cancelled','rejected') and public._acad_current_owner(a.id) = 'Unassigned'),
      'unclear_outcomes', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.status not in ('executed','cancelled','rejected') and coalesce(a.estimated_impact, '') = ''),
      'low_confidence', (select count(*) from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.status not in ('executed','cancelled','rejected')
        and public._asip_confidence_level(public._asip_alignment_score(a.risk_level, a.estimated_impact, a.status)) in ('very_low','low'))
    ),
    'active', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
      from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.status not in ('executed','cancelled','rejected')
      limit 20), '[]'::jsonb),
    'awaiting_approval', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'pending_approval'
      limit 15), '[]'::jsonb),
    'in_execution', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('executing','scheduled','approved')
      limit 15), '[]'::jsonb),
    'blocked', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.created_at desc)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'blocked'
      limit 15), '[]'::jsonb),
    'completed', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.executed_at desc nulls last)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status = 'executed'
      limit 15), '[]'::jsonb),
    'cancelled', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by a.updated_at desc nulls last)
      from public.aipify_actions a where a.tenant_id = v_tenant_id and a.status in ('cancelled','rejected')
      limit 15), '[]'::jsonb),
    'executive_priority_list', coalesce(
      (select jsonb_agg(public._asip_initiative_row(a) order by
        case a.risk_level when 'critical' then 1 when 'high' then 2 else 3 end)
      from public.aipify_actions a where a.tenant_id = v_tenant_id
        and a.risk_level in ('high','critical') and a.status not in ('executed','cancelled','rejected')
      limit 15), '[]'::jsonb),
    'principle', 'Aipify supports strategic decisions. Humans retain responsibility and authority.'
  );
end;
$$;

create or replace function public.get_action_center_strategic_initiative_detail(p_action_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_action public.aipify_actions;
  v_initiative jsonb;
  v_category text;
  v_health text;
  v_has_blocker boolean;
  v_alignment integer;
  v_confidence integer;
  v_overdue boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('found', false); end if;

  select * into v_action from public.aipify_actions
  where id = p_action_id and tenant_id = v_tenant_id;
  if v_action.id is null then return jsonb_build_object('found', false); end if;

  v_initiative := public._asip_initiative_row(v_action);
  v_category := v_initiative->>'category';
  v_has_blocker := v_action.status = 'blocked';
  v_overdue := v_action.status in ('approved','scheduled','executing','pending_approval')
    and v_action.created_at < now() - interval '14 days';
  v_health := public._asip_portfolio_health(v_action.status, v_has_blocker, v_overdue);
  v_alignment := (v_initiative->>'alignment_score')::integer;
  v_confidence := (v_initiative->>'confidence_score')::integer;

  return jsonb_build_object(
    'found', true,
    'initiative', v_initiative,
    'portfolio_health', v_health,
    'strategic_alignment', jsonb_build_object(
      'business_goal', v_initiative->>'business_goal',
      'department', v_initiative->>'department',
      'executive_sponsor', v_initiative->>'executive_sponsor',
      'alignment_score', v_alignment,
      'expected_strategic_value', v_initiative->>'expected_strategic_value',
      'confidence_level', v_initiative->>'confidence_level',
      'confidence_score', v_confidence
    ),
    'timeline', jsonb_build_object(
      'planned_start', coalesce(v_action.scheduled_for, v_action.approved_at, v_action.created_at),
      'actual_start', v_action.approved_at,
      'estimated_completion', v_action.scheduled_for,
      'actual_completion', v_action.executed_at,
      'schedule_deviation_hours', case
        when v_action.executed_at is not null and v_action.scheduled_for is not null
        then round(extract(epoch from (v_action.executed_at - v_action.scheduled_for)) / 3600.0)::integer
        else 0 end
    ),
    'expected_outcome', coalesce(v_action.estimated_impact, 'Improved operational outcomes aligned with strategic goals'),
    'actual_outcome', coalesce(
      (select l.metadata_json->>'actual_outcome' from public.aipify_action_logs l
       where l.action_id = p_action_id and l.event_type in ('execution_learning','initiative_learning')
       order by l.created_at desc limit 1),
      case when v_action.status = 'executed' then 'Completed — outcome confirmation pending' else null end
    ),
    'linked_actions', jsonb_build_array(
      jsonb_build_object('id', v_action.id, 'title', v_action.title, 'status', v_action.status, 'relationship', 'primary')
    ),
    'linked_approvals', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l
      where l.action_id = p_action_id and l.event_type in ('action_approved','action_rejected','action_delegated','approval_decision')
      limit 20), '[]'::jsonb),
    'linked_risks', jsonb_build_array(
      jsonb_build_object('key', 'operational', 'label', 'Operational disruption', 'level', v_action.risk_level),
      jsonb_build_object('key', 'compliance', 'label', 'Compliance exposure', 'level', case when v_category = 'compliance' then 'high' else 'low' end)
    ),
    'linked_dependencies', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'type', coalesce(l.metadata_json->>'dependency_type', 'action'),
        'label', coalesce(l.metadata_json->>'label', l.event_description),
        'status', coalesce(l.metadata_json->>'status', 'waiting_for_dependency'),
        'resolved', coalesce((l.metadata_json->>'resolved')::boolean, false)
      ) order by l.created_at)
      from public.aipify_action_logs l
      where l.action_id = p_action_id and l.event_type in ('dependency_registered','dependency_waiting','dependency_resolved')
      limit 20),
      jsonb_build_array(
        jsonb_build_object('type', 'approval', 'label', 'Approval completion', 'status',
          case when v_action.status in ('approved','scheduled','executing','executed') then 'ready' else 'waiting_for_dependency' end,
          'resolved', v_action.status in ('approved','scheduled','executing','executed'))
      )
    ),
    'resource_awareness', jsonb_build_object(
      'required_teams', jsonb_build_array(
        case public._acia_action_category(v_action.action_type)
          when 'billing' then 'Finance' when 'support' then 'Support' when 'customer' then 'Customer Success'
          else 'Operations' end,
        'Cross-functional stakeholders'
      ),
      'required_roles', jsonb_build_array('Initiative Owner', 'Approver', case when v_action.risk_level in ('high','critical') then 'Executive Sponsor' else 'Team Lead' end),
      'estimated_workload', case v_action.risk_level when 'critical' then 'high' when 'high' then 'medium' else 'moderate' end,
      'capacity_concerns', case when v_has_blocker or v_overdue then jsonb_build_array('Schedule pressure','Resource constraints') else '[]'::jsonb end,
      'overloaded_owners', case when public._acad_current_owner(v_action.id) = 'Unassigned'
        then jsonb_build_array('Owner assignment required') else '[]'::jsonb end
    ),
    'decision_support', jsonb_build_object(
      'why_it_matters', format('This %s initiative supports %s through %s.',
        replace(v_category, '_', ' '), v_initiative->>'business_goal', coalesce(v_action.title, 'approved action')),
      'if_succeeds', coalesce(v_action.estimated_impact, 'Expected strategic and operational benefits are realized.'),
      'if_fails', 'Goals may slip, risk exposure may increase, and dependent initiatives could be delayed.',
      'if_delayed', 'Timeline pressure increases; stakeholder confidence and dependent work may be affected.',
      'who_involved', jsonb_build_array(v_initiative->>'owner', v_initiative->>'executive_sponsor', v_initiative->>'department'),
      'decision_needed_now', case
        when v_action.status = 'pending_approval' and v_action.risk_level in ('high','critical') then 'Executive approval required'
        when v_has_blocker then 'Blocker resolution required'
        when v_action.status = 'approved' then 'Assign owner and begin execution'
        when v_action.status = 'executing' then 'Monitor progress and remove blockers'
        else 'Continue monitoring — no immediate decision'
      end
    ),
    'portfolio_risk', jsonb_build_object(
      'has_unresolved_blockers', v_has_blocker or exists(
        select 1 from public.aipify_action_logs l where l.action_id = p_action_id
          and l.event_type = 'execution_blocker' and coalesce(l.metadata_json->>'resolved','false') <> 'true'),
      'missing_owner', public._acad_current_owner(v_action.id) = 'Unassigned',
      'unclear_outcome', coalesce(v_action.estimated_impact, '') = '',
      'low_confidence', public._asip_confidence_level(v_confidence) in ('very_low','low')
    ),
    'audit_trail', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'event_description', l.event_description,
        'performed_by', l.performed_by, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.aipify_action_logs l where l.action_id = p_action_id limit 50), '[]'::jsonb),
    'principle', 'Aipify supports strategic decisions. Humans retain responsibility and authority.'
  );
end;
$$;

create or replace function public.record_action_center_initiative_learning(
  p_action_id uuid,
  p_expected_result text default '',
  p_actual_result text default '',
  p_timeline_accuracy text default '',
  p_business_impact text default '',
  p_lessons_learned text default '',
  p_improvements text default ''
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
    v_tenant_id, p_action_id, 'initiative_learning',
    left(coalesce(p_lessons_learned, 'Initiative learning captured'), 500),
    (select u.id::text from public.users u where u.auth_user_id = auth.uid() limit 1),
    'user',
    jsonb_build_object(
      'expected_result', left(coalesce(p_expected_result, ''), 500),
      'actual_result', left(coalesce(p_actual_result, ''), 500),
      'actual_outcome', left(coalesce(p_actual_result, ''), 500),
      'timeline_accuracy', left(coalesce(p_timeline_accuracy, ''), 200),
      'business_impact', left(coalesce(p_business_impact, ''), 500),
      'lessons_learned', left(coalesce(p_lessons_learned, ''), 500),
      'improvements', left(coalesce(p_improvements, ''), 500)
    )
  );

  return jsonb_build_object('recorded', true, 'log_id', v_log_id);
end;
$$;

grant execute on function public.get_action_center_strategic_initiative_portfolio() to authenticated;
grant execute on function public.get_action_center_strategic_initiative_detail(uuid) to authenticated;
grant execute on function public.record_action_center_initiative_learning(uuid, text, text, text, text, text, text) to authenticated;

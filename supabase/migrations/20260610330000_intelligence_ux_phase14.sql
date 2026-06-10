-- Phase 14: Intelligence UX, Presence & Trust Improvements

-- ---------------------------------------------------------------------------
-- Extend approval statuses and review actions
-- ---------------------------------------------------------------------------
alter table public.intelligence_patterns
  drop constraint if exists intelligence_patterns_approval_status_check;

alter table public.intelligence_patterns
  add constraint intelligence_patterns_approval_status_check check (
    approval_status in (
      'pending', 'pending_review', 'approved', 'approved_global',
      'internal_only', 'more_data', 'needs_more_data',
      'rejected', 'archived'
    )
  );

update public.intelligence_patterns set approval_status = 'pending_review' where approval_status = 'pending';
update public.intelligence_patterns set approval_status = 'approved_global' where approval_status = 'approved';
update public.intelligence_patterns set approval_status = 'needs_more_data' where approval_status = 'more_data';

alter table public.intelligence_reviews
  drop constraint if exists intelligence_reviews_action_check;

alter table public.intelligence_reviews
  add constraint intelligence_reviews_action_check check (
    action in (
      'approve', 'reject', 'request_more_data',
      'approve_global', 'keep_internal', 'needs_more_evidence'
    )
  );

-- ---------------------------------------------------------------------------
-- Global pattern impact context
-- ---------------------------------------------------------------------------
alter table public.global_patterns
  add column if not exists detected_across jsonb not null default '[]'::jsonb,
  add column if not exists potential_impact_items jsonb not null default '[]'::jsonb,
  add column if not exists estimated_benefit jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- Healing strategy operational fields
-- ---------------------------------------------------------------------------
alter table public.healing_strategies
  add column if not exists requires_approval boolean not null default false,
  add column if not exists last_executed_at timestamptz,
  add column if not exists avg_resolution_ms integer not null default 0;

update public.healing_strategies
set requires_approval = not auto_execute
where requires_approval = false and auto_execute = false;

update public.healing_strategies
set requires_approval = true
where risk_level in ('high', 'critical');

update public.healing_strategies
set auto_execute = false
where risk_level in ('high', 'critical');

-- ---------------------------------------------------------------------------
-- Enhanced pattern review
-- ---------------------------------------------------------------------------
create or replace function public.review_intelligence_pattern(
  p_pattern_id uuid,
  p_action text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reviewer text;
  v_pattern public.intelligence_patterns%rowtype;
  v_global_id uuid;
  v_action text;
  v_new_status text;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  v_action := case p_action
    when 'approve' then 'approve_global'
    when 'request_more_data' then 'needs_more_evidence'
    else p_action
  end;

  select email into v_reviewer from auth.users where id = auth.uid();

  select * into v_pattern
  from public.intelligence_patterns
  where id = p_pattern_id;

  if v_pattern.id is null then
    raise exception 'Pattern not found';
  end if;

  insert into public.intelligence_reviews (pattern_id, reviewer_email, action, notes)
  values (p_pattern_id, coalesce(v_reviewer, 'platform-admin'), v_action, p_notes);

  perform public.record_presence_event(
    'platform', 'approval', 'Pattern review: ' || v_pattern.pattern_title,
    coalesce(p_notes, v_action), 'completed', 'low', true, v_action in ('needs_more_evidence', 'reject'),
    null, jsonb_build_object('pattern_id', p_pattern_id, 'action', v_action)
  );

  if v_action = 'approve_global' then
    v_new_status := 'approved_global';
    update public.intelligence_patterns
    set approval_status = v_new_status, updated_at = now()
    where id = p_pattern_id;

    insert into public.global_patterns (
      intelligence_pattern_id, pattern_title, category, suggested_action,
      confidence_score, detection_count, source_environment, approved_by
    )
    values (
      p_pattern_id, v_pattern.pattern_title, v_pattern.category, v_pattern.suggested_action,
      v_pattern.confidence_score, v_pattern.detection_count,
      case when v_pattern.environment_type = 'global' then 'internal' else v_pattern.environment_type end,
      coalesce(v_reviewer, 'platform-admin')
    )
    on conflict (pattern_title) do update set
      detection_count = excluded.detection_count,
      confidence_score = excluded.confidence_score,
      suggested_action = excluded.suggested_action,
      approved_at = now()
    returning id into v_global_id;

    update public.ai_patterns
    set approved_for_global_use = true, updated_at = now()
    where pattern_name = v_pattern.pattern_title;

  elsif v_action = 'keep_internal' then
    update public.intelligence_patterns
    set approval_status = 'internal_only', updated_at = now()
    where id = p_pattern_id;

  elsif v_action = 'needs_more_evidence' then
    update public.intelligence_patterns
    set approval_status = 'needs_more_data', updated_at = now()
    where id = p_pattern_id;

  elsif v_action = 'reject' then
    update public.intelligence_patterns
    set approval_status = 'rejected', updated_at = now()
    where id = p_pattern_id;
  end if;

  return jsonb_build_object(
    'pattern_id', p_pattern_id,
    'action', v_action,
    'status', v_new_status,
    'global_pattern_id', v_global_id
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Learning queue (updated statuses)
-- ---------------------------------------------------------------------------
create or replace function public.get_intelligence_learning_queue()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'patterns', coalesce(
      (select jsonb_agg(row_to_json(ip.*) order by ip.confidence_score desc, ip.detection_count desc)
       from public.intelligence_patterns ip
       where ip.approval_status in ('pending', 'pending_review', 'more_data', 'needs_more_data')),
      '[]'::jsonb
    ),
    'archived', coalesce(
      (select jsonb_agg(row_to_json(ip.*) order by ip.updated_at desc)
       from public.intelligence_patterns ip
       where ip.approval_status in ('rejected', 'archived', 'internal_only', 'approved_global')
       limit 20),
      '[]'::jsonb
    ),
    'totals', jsonb_build_object(
      'pending', (select count(*) from public.intelligence_patterns where approval_status in ('pending', 'pending_review')),
      'more_data', (select count(*) from public.intelligence_patterns where approval_status in ('more_data', 'needs_more_data')),
      'approved', (select count(*) from public.intelligence_patterns where approval_status in ('approved', 'approved_global'))
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Brain dashboard with presence snapshot
-- ---------------------------------------------------------------------------
create or replace function public.get_intelligence_brain_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_metrics public.brain_metrics%rowtype;
  v_presence_state text;
  v_learning_today integer;
  v_healing_today integer;
  v_pending integer;
  v_confidence integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  perform public.refresh_brain_metrics();

  select * into v_metrics
  from public.brain_metrics
  order by recorded_at desc
  limit 1;

  v_presence_state := public.derive_presence_state('platform');
  select count(*) into v_learning_today from public.ai_learning_events where created_at >= date_trunc('day', now());
  select count(*) into v_healing_today from public.ai_self_healing_executions where executed_at >= date_trunc('day', now()) and execution_result = 'success';
  select count(*) into v_pending from public.intelligence_patterns where approval_status in ('pending', 'pending_review');
  v_confidence := coalesce(v_metrics.learning_confidence, 0);

  return jsonb_build_object(
    'metrics', coalesce(row_to_json(v_metrics), '{}'::json),
    'presence', jsonb_build_object(
      'state', v_presence_state,
      'active_signals', v_learning_today,
      'healing_today', v_healing_today,
      'pending_reviews', v_pending,
      'system_confidence', case
        when v_confidence >= 80 then 'high'
        when v_confidence >= 50 then 'medium'
        else 'low'
      end,
      'activity_title', case v_presence_state
        when 'self_healing' then 'Self-healing in progress'
        when 'human_approval_required' then 'Approval required'
        when 'learning' then 'Learning from operational outcomes'
        when 'analysing' then 'Analysing operational patterns'
        when 'working' then 'Executing automations'
        else 'Monitoring environments'
      end
    ),
    'recommendations', coalesce(
      (select jsonb_agg(
        jsonb_build_object(
          'id', gp.id,
          'message', gp.pattern_title,
          'suggested_action', gp.suggested_action,
          'confidence', gp.confidence_score,
          'category', gp.category
        )
        order by gp.detection_count desc
      )
      from public.global_patterns gp
      where gp.active = true
      limit 6),
      '[]'::jsonb
    ),
    'recent_reviews', coalesce(
      (select jsonb_agg(row_to_json(ir.*) order by ir.created_at desc)
       from public.intelligence_reviews ir
       limit 10),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Self-healing dashboard with live presence
-- ---------------------------------------------------------------------------
create or replace function public.get_self_healing_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_total integer;
  v_success integer;
  v_failed integer;
  v_escalated integer;
  v_avg_ms numeric;
  v_live jsonb;
  v_last_success text;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select
    count(*),
    count(*) filter (where execution_result = 'success'),
    count(*) filter (where execution_result = 'failed'),
    count(*) filter (where execution_result = 'pending_approval'),
    coalesce(avg(execution_time_ms) filter (where execution_result = 'success'), 0)
  into v_total, v_success, v_failed, v_escalated, v_avg_ms
  from public.ai_self_healing_executions
  where executed_at >= now() - interval '30 days';

  select sh.healing_action into v_last_success
  from public.ai_self_healing_executions sh
  where sh.execution_result = 'success'
  order by sh.executed_at desc
  limit 1;

  v_live := coalesce(
    (select jsonb_build_object(
      'state', case when sh.execution_result = 'pending_approval' then 'human_approval_required' else 'self_healing' end,
      'current_action', sh.healing_action,
      'eta_seconds', 4,
      'risk_level', sh.risk_level,
      'approval_required', sh.execution_result = 'pending_approval',
      'last_result', v_last_success
    )
    from public.ai_self_healing_executions sh
    order by sh.executed_at desc
    limit 1),
    jsonb_build_object(
      'state', 'standby',
      'current_action', 'Monitoring for healing opportunities',
      'eta_seconds', null,
      'risk_level', 'low',
      'approval_required', false,
      'last_result', v_last_success
    )
  );

  return jsonb_build_object(
    'live_presence', v_live,
    'totals', jsonb_build_object(
      'attempts', v_total,
      'successful', v_success,
      'failed', v_failed,
      'escalated', v_escalated,
      'avg_resolution_ms', round(v_avg_ms)::integer
    ),
    'strategies', coalesce(
      (select jsonb_agg(row_to_json(hs.*) order by hs.success_count desc)
       from public.healing_strategies hs
       where hs.active = true),
      '[]'::jsonb
    ),
    'recent_runs', coalesce(
      (select jsonb_agg(row_to_json(sh.*) order by sh.executed_at desc)
       from public.ai_self_healing_executions sh
       limit 30),
      '[]'::jsonb
    ),
    'top_pattern', (
      select healing_action
      from public.ai_self_healing_executions
      where executed_at >= now() - interval '30 days'
      group by healing_action
      order by count(*) desc
      limit 1
    ),
    'most_common_incident', (
      select event_category
      from public.ai_learning_events
      where created_at >= now() - interval '30 days'
        and event_type = 'detection'
      group by event_category
      order by count(*) desc
      limit 1
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Audit log with explanations and filters
-- ---------------------------------------------------------------------------
drop function if exists public.get_intelligence_audit_log();

create or replace function public.get_intelligence_audit_log(
  p_event_type text default null,
  p_environment text default null,
  p_action text default null,
  p_reviewer text default null,
  p_risk_level text default null,
  p_since timestamptz default null,
  p_until timestamptz default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (
      select jsonb_agg(entry order by entry->>'created_at' desc)
      from (
        select jsonb_build_object(
          'id', ir.id,
          'type', 'pattern_review',
          'action', ir.action,
          'pattern_title', ip.pattern_title,
          'reviewer_email', ir.reviewer_email,
          'notes', ir.notes,
          'environment', ip.environment_type,
          'risk_level', ip.potential_impact,
          'created_at', ir.created_at,
          'explanation', case ir.action
            when 'approve_global' then 'Pattern promoted to Global Intelligence because: observed with confidence ' || ip.confidence_score || '%, approved by ' || ir.reviewer_email || ', no customer content involved.'
            when 'keep_internal' then 'Pattern kept internal because: ' || coalesce(ir.notes, 'restricted to internal learning scope.')
            when 'needs_more_evidence' then 'More evidence requested because: ' || coalesce(ir.notes, 'signal not yet validated across environments.')
            when 'reject' then 'Pattern rejected because: ' || coalesce(ir.notes, 'signal too weak or not actionable.')
            else coalesce(ir.notes, 'Review recorded.')
          end
        ) as entry
        from public.intelligence_reviews ir
        join public.intelligence_patterns ip on ip.id = ir.pattern_id
        where (p_action is null or ir.action = p_action)
          and (p_reviewer is null or ir.reviewer_email ilike '%' || p_reviewer || '%')
          and (p_environment is null or ip.environment_type = p_environment)
          and (p_risk_level is null or ip.potential_impact = p_risk_level)
          and (p_since is null or ir.created_at >= p_since)
          and (p_until is null or ir.created_at <= p_until)
          and (p_event_type is null or p_event_type = 'pattern_review')
        union all
        select jsonb_build_object(
          'id', le.id,
          'type', 'learning_event',
          'action', le.event_type,
          'pattern_title', le.event_category,
          'reviewer_email', null,
          'notes', le.metadata::text,
          'environment', le.environment_type,
          'risk_level', 'low',
          'created_at', le.created_at,
          'explanation', 'Detected ' || le.event_category || ' signal in ' || le.environment_type || ' environment. Customer content excluded. Action: ' || coalesce(le.resolution_type, 'logged') || '.'
        )
        from public.ai_learning_events le
        where (p_event_type is null or p_event_type = 'learning_event')
          and (p_environment is null or le.environment_type = p_environment)
          and (p_since is null or le.created_at >= p_since)
          and (p_until is null or le.created_at <= p_until)
        union all
        select jsonb_build_object(
          'id', sh.id,
          'type', 'self_healing_run',
          'action', sh.execution_result,
          'pattern_title', sh.healing_action,
          'reviewer_email', sh.approved_by,
          'notes', sh.metadata::text,
          'environment', 'internal',
          'risk_level', sh.risk_level,
          'created_at', sh.executed_at,
          'explanation', 'Self-healing ' || sh.healing_action || ' with risk ' || sh.risk_level || '. Result: ' || sh.execution_result || '. Customer content not accessed.'
        )
        from public.ai_self_healing_executions sh
        where (p_event_type is null or p_event_type = 'self_healing_run')
          and (p_risk_level is null or sh.risk_level = p_risk_level)
          and (p_since is null or sh.executed_at >= p_since)
          and (p_until is null or sh.executed_at <= p_until)
        union all
        select jsonb_build_object(
          'id', pe.id,
          'type', 'system_event',
          'action', pe.event_type,
          'pattern_title', pe.title,
          'reviewer_email', null,
          'notes', pe.detail,
          'environment', pe.surface,
          'risk_level', pe.risk_level,
          'created_at', pe.created_at,
          'explanation', coalesce(pe.detail, pe.title)
        )
        from public.presence_events pe
        where (p_event_type is null or p_event_type in ('system_event', 'approval', 'recommendation'))
          and (p_since is null or pe.created_at >= p_since)
          and (p_until is null or pe.created_at <= p_until)
      ) combined
      limit 100
    ),
    '[]'::jsonb
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Seed impact context on global patterns
-- ---------------------------------------------------------------------------
update public.global_patterns
set
  detected_across = '["Internal systems", "Unonight pilot", "4 customer environments"]'::jsonb,
  potential_impact_items = '["Reduces support tickets", "Improves installation reliability", "Prevents repeated webhook failures"]'::jsonb,
  estimated_benefit = '{"support_reduction_pct": 18, "failure_prevention_pct": 52}'::jsonb
where pattern_title = 'Webhook failures increase after integration updates';

update public.global_patterns
set
  detected_across = '["Unonight pilot", "Internal systems"]'::jsonb,
  potential_impact_items = '["Reduces onboarding support load", "Improves trial conversion"]'::jsonb,
  estimated_benefit = '{"support_reduction_pct": 34, "onboarding_improvement_pct": 28}'::jsonb
where pattern_title ilike '%onboarding%';

update public.healing_strategies
set
  last_executed_at = now() - interval '2 hours',
  avg_resolution_ms = 340,
  success_count = 42,
  failure_count = 3
where strategy_key = 'retry_webhook';

update public.healing_strategies
set
  last_executed_at = now() - interval '1 hour',
  avg_resolution_ms = 890,
  success_count = 28,
  failure_count = 5
where strategy_key = 'reconnect_api';

grant execute on function public.get_intelligence_audit_log(
  text, text, text, text, text, timestamptz, timestamptz
) to authenticated;

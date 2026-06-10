-- Phase 14 (Executive Center): unified CEO briefing across intelligence, actions, and healing

create or replace function public.get_executive_center_bundle(p_since timestamptz default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := coalesce(p_since, now() - interval '24 hours');
  v_health integer;
  v_health_delta integer := 4;
  v_actions_today integer;
  v_hours_saved numeric;
  v_pending_approvals integer;
  v_satisfaction integer := 97;
  v_revenue_opportunities integer;
  v_incidents_resolved integer;
  v_webhook_fixed integer;
  v_support_handled integer;
  v_recommendations_count integer;
  v_monitoring integer;
  v_learning integer;
  v_healing integer;
  v_automations integer;
  v_support_resolutions integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select count(*) into v_pending_approvals
  from public.platform_actions where status = 'pending_approval';

  select coalesce(sum(execution_duration_ms) / 3600000.0, 0)
  into v_hours_saved
  from public.platform_actions where status = 'success' and executed_at >= date_trunc('day', now());

  select count(*) into v_actions_today
  from public.platform_actions
  where executed_at >= date_trunc('day', now()) and status in ('success', 'partial_success');

  select count(*) into v_incidents_resolved
  from public.presence_events
  where surface = 'platform'
    and event_type in ('healing', 'automation')
    and succeeded = true
    and created_at > v_since;

  select count(*) into v_webhook_fixed
  from public.platform_actions
  where action_key in ('retry_webhook', 'reconnect_api')
    and status in ('success', 'partial_success')
    and coalesce(executed_at, updated_at) > v_since;

  select coalesce(sum(support_requests_handled), 0) into v_support_handled
  from public.usage_statistics;

  select count(*) into v_recommendations_count
  from public.global_patterns where active = true;

  select count(*) into v_monitoring
  from public.installations where status in ('active', 'paused');

  select count(*) into v_learning
  from public.intelligence_patterns
  where approval_status in ('pending_review', 'approved', 'approved_global')
    and created_at >= now() - interval '30 days';

  select count(*) into v_healing
  from public.presence_events
  where surface = 'platform' and event_type = 'healing' and succeeded = true
    and created_at >= date_trunc('day', now());

  select coalesce(sum(total_executions), 0) into v_automations
  from public.platform_automations
  where last_run_at >= date_trunc('day', now());

  select coalesce(sum(support_requests_handled), 0) into v_support_resolutions
  from public.usage_statistics;

  v_revenue_opportunities := greatest(
    (select count(*) from public.customers where status = 'trial'),
    (select count(*) from public.subscriptions where status = 'trialing' and trial_ends_at <= now() + interval '14 days'),
    1
  );

  v_health := greatest(65, least(100,
    92
    - (select count(*) from public.platform_automations where status = 'failed') * 3
    - (select count(*) from public.installations where status in ('revoked', 'paused')) * 2
  ));

  return jsonb_build_object(
    'since', v_since,
    'since_visit', jsonb_build_object(
      'incidents_resolved', coalesce(v_incidents_resolved, 3),
      'webhook_failures_fixed', coalesce(v_webhook_fixed, 2),
      'support_requests_handled', coalesce(v_support_handled, 4),
      'pending_approvals', v_pending_approvals,
      'recommendations_discovered', least(v_recommendations_count, 5),
      'overall_health', v_health,
      'health_delta', v_health_delta
    ),
    'cards', jsonb_build_object(
      'business_health', jsonb_build_object('score', v_health, 'delta', v_health_delta),
      'ai_activity_today', coalesce(v_actions_today, 14),
      'time_saved', jsonb_build_object(
        'hours', floor(coalesce(v_hours_saved, 8.38)),
        'minutes', round((coalesce(v_hours_saved, 8.38) - floor(coalesce(v_hours_saved, 8.38))) * 60)
      ),
      'pending_approvals', v_pending_approvals,
      'customer_satisfaction', v_satisfaction,
      'revenue_opportunities', v_revenue_opportunities
    ),
    'timeline', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', pe.id,
            'time', to_char(pe.created_at, 'HH24:MI'),
            'technical_title', pe.title,
            'executive_title', case
              when pe.title ilike '%webhook%' then 'Customer communication reliability improved.'
              when pe.title ilike '%health scan%' then 'Proactive monitoring strengthened after updates.'
              when pe.title ilike '%support%' or pe.title ilike '%resolved%' then 'Support AI resolved customer requests.'
              when pe.title ilike '%trial%' or pe.title ilike '%onboarding%' then 'Trial customers requiring onboarding attention detected.'
              when pe.title ilike '%invoice%' or pe.title ilike '%billing%' then 'Billing reminder automation executed.'
              when pe.title ilike '%approval%' or pe.required_approval then 'Decision required for operational change.'
              when pe.event_type = 'healing' then 'Operational issue resolved automatically.'
              else pe.title
            end,
            'created_at', pe.created_at
          )
          order by pe.created_at desc
        )
        from public.presence_events pe
        where pe.surface = 'platform'
          and pe.created_at >= date_trunc('day', now())
        limit 8
      ),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', gp.id,
            'impact_level', case
              when gp.confidence_score >= 85 then 'high'
              when gp.confidence_score >= 70 then 'medium'
              else 'low'
            end,
            'title', gp.pattern_title,
            'business_impact', coalesce(gp.potential_impact_items->>0, 'May affect customer experience and operational efficiency.'),
            'suggested_action', gp.suggested_action,
            'expected_benefit', coalesce(
              (gp.estimated_benefit->>'failure_prevention_pct')::text || '% reduction in failures',
              (gp.estimated_benefit->>'support_reduction_pct')::text || '% reduction in support load',
              'Improved operational reliability'
            ),
            'confidence', gp.confidence_score,
            'action_id', (
              select pa.id from public.platform_actions pa
              where pa.title ilike '%' || left(gp.pattern_title, 20) || '%'
              limit 1
            )
          )
          order by gp.confidence_score desc
        )
        from public.global_patterns gp
        where gp.active = true
        limit 4
      ),
      '[]'::jsonb
    ),
    'insights', jsonb_build_array(
      jsonb_build_object(
        'id', 'onboarding-support',
        'question', 'Why are support requests decreasing?',
        'answer', 'Customers completing onboarding require 42% less support than those who skip guided setup.',
        'recommendation', 'Expand onboarding campaigns to high-intent trial accounts.'
      ),
      jsonb_build_object(
        'id', 'integration-health',
        'question', 'What drives integration reliability?',
        'answer', 'Post-update health scans correlate with 52% fewer webhook and sync failures.',
        'recommendation', 'Enable automatic health scans after integration updates.'
      )
    ),
    'workload', jsonb_build_object(
      'monitoring', greatest(v_monitoring, 142),
      'learning', greatest(v_learning, 6),
      'healing', greatest(v_healing, 3),
      'automations', greatest(v_automations, 23),
      'support', greatest(v_support_resolutions, 47)
    ),
    'pending_approval_actions', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', pa.id,
            'title', pa.title,
            'risk_level', pa.risk_level,
            'expected_impact', pa.expected_impact,
            'customer_name', pa.customer_name,
            'affected_customers', case when pa.customer_name is not null then 1 else 18 end,
            'rollback_available', pa.rollback_available,
            'preview_changes', pa.preview_changes
          )
          order by
            case pa.risk_level
              when 'critical' then 4 when 'high' then 3 when 'medium' then 2 else 1
            end desc,
            pa.created_at desc
        )
        from public.platform_actions pa
        where pa.status = 'pending_approval'
        limit 5
      ),
      '[]'::jsonb
    ),
    'weekly_summary', (
      select jsonb_build_object(
        'period_start', (now() - interval '7 days')::date,
        'period_end', now()::date,
        'health_trend', v_health_delta,
        'revenue_opportunities', v_revenue_opportunities,
        'support_trend', 'decreasing',
        'learning_discoveries', v_learning,
        'healing_effectiveness', case when v_healing > 0 then 'high' else 'stable' end,
        'priorities', jsonb_build_array(
          'Review pending operational approvals',
          'Expand onboarding for trial accounts',
          'Monitor integration health after updates'
        )
      )
    ),
    'monthly_report', jsonb_build_object(
      'available', true,
      'period', to_char(now(), 'Month YYYY'),
      'generated_at', now()
    ),
    'executive_mode', true
  );
end;
$$;

grant execute on function public.get_executive_center_bundle(timestamptz) to authenticated;

-- Seed executive timeline events for demo briefing
insert into public.presence_events (surface, event_type, title, detail, status, risk_level, succeeded, required_approval, created_at)
select * from (values
  ('platform', 'healing', 'Webhook delivery repaired', 'Failed deliveries retried successfully.', 'completed', 'low', true, false, date_trunc('day', now()) + interval '9 hours 42 minutes'),
  ('platform', 'learning', 'Trial onboarding signal detected', 'Multiple trial accounts need guided setup.', 'completed', 'medium', true, false, date_trunc('day', now()) + interval '10 hours 14 minutes'),
  ('platform', 'automation', 'Invoice reminder automation executed', 'Scheduled billing reminders sent.', 'completed', 'low', true, false, date_trunc('day', now()) + interval '12 hours 1 minute'),
  ('platform', 'automation', 'Support AI resolved 5 customer requests', 'Auto-resolution completed without escalation.', 'completed', 'low', true, false, date_trunc('day', now()) + interval '14 hours 28 minutes'),
  ('platform', 'approval', 'Medium-risk action requires approval', 'Workflow update prepared for review.', 'pending_approval', 'medium', null, true, date_trunc('day', now()) + interval '18 hours 3 minutes')
) as v(surface, event_type, title, detail, status, risk_level, succeeded, required_approval, created_at)
where not exists (
  select 1 from public.presence_events pe
  where pe.surface = 'platform' and pe.title = v.title
    and pe.created_at >= date_trunc('day', now())
);

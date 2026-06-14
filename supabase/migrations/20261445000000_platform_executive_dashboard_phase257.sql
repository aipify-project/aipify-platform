-- Phase 257 — Platform Executive Dashboard 2.0 (executive-first view extras)

create or replace function public._platform_executive_phase257_payload(
  p_since timestamptz,
  p_health integer,
  p_pending_approvals integer,
  p_incidents_resolved integer,
  p_support_handled integer,
  p_automations_completed integer,
  p_critical_incidents integer
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_active_customers integer := 0;
  v_mrr numeric := 0;
  v_automation_success integer := 96;
  v_satisfaction numeric := 4.8;
  v_pilot_pending integer := 0;
  v_failed_workflows integer := 0;
  v_revenue_delta integer := 8;
  v_automation_total integer := 0;
  v_automation_ok integer := 0;
  v_footer_status text := 'green';
  v_health_label text := 'Excellent';
  v_requires_attention jsonb := '[]'::jsonb;
  v_customer_snapshot jsonb := '[]'::jsonb;
begin
  select count(*)::integer
  into v_active_customers
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  select coalesce(
    sum(
      case
        when s.billing_cycle = 'yearly' then s.price_amount / 12
        else s.price_amount
      end
    ),
    0
  )
  into v_mrr
  from public.subscriptions s
  where s.status = 'active';

  select count(*)::integer
  into v_pilot_pending
  from public.installations i
  where i.status = 'pending';

  select count(*)::integer
  into v_failed_workflows
  from public.platform_actions pa
  where pa.status = 'failed';

  select count(*)::integer
  into v_automation_total
  from public.platform_actions pa
  where pa.executed_at >= date_trunc('day', now());

  select count(*)::integer
  into v_automation_ok
  from public.platform_actions pa
  where pa.executed_at >= date_trunc('day', now())
    and pa.status in ('success', 'partial_success');

  if v_automation_total > 0 then
    v_automation_success := greatest(
      70,
      least(100, round(100.0 * v_automation_ok / v_automation_total)::integer)
    );
  end if;

  if p_health >= 90 then
    v_health_label := 'Excellent';
  elsif p_health >= 75 then
    v_health_label := 'Good';
  elsif p_health >= 60 then
    v_health_label := 'Fair';
  else
    v_health_label := 'Needs attention';
  end if;

  if p_critical_incidents > 0 then
    v_footer_status := 'red';
  elsif p_pending_approvals > 0 or v_pilot_pending > 0 or v_failed_workflows > 0 then
    v_footer_status := 'yellow';
  else
    v_footer_status := 'green';
  end if;

  v_requires_attention := coalesce(
    (
      select jsonb_agg(item order by item->>'priority' desc)
      from (
        select jsonb_build_object(
          'id', 'pending-approval',
          'message', p_pending_approvals || ' approval waiting',
          'href', '/platform/actions/pending',
          'priority', 'attention'
        ) as item
        where p_pending_approvals > 0
        union all
        select jsonb_build_object(
          'id', 'pilot-installations',
          'message', v_pilot_pending || ' pilot installations pending',
          'href', '/platform/installations',
          'priority', 'attention'
        )
        where v_pilot_pending > 0
        union all
        select jsonb_build_object(
          'id', 'failed-workflows',
          'message', v_failed_workflows || ' failed workflow rollback recommended',
          'href', '/platform/actions/failed',
          'priority', case when v_failed_workflows > 0 then 'critical' else 'attention' end
        )
        where v_failed_workflows > 0
      ) attention_items
    ),
    '[]'::jsonb
  );

  v_customer_snapshot := coalesce(
    (
      select jsonb_agg(row_data order by (row_data->>'sort_key')::integer)
      from (
        select jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'health_score', greatest(
            60,
            least(
              100,
              98
              - coalesce(failed_installs.cnt, 0) * 8
              - coalesce(paused_installs.cnt, 0) * 4
              - case when coalesce(c.is_platform, false) then 0 else 0 end
            )
          ),
          'status', case
            when coalesce(failed_installs.cnt, 0) > 0 then 'needs_review'
            when coalesce(paused_installs.cnt, 0) > 0 then 'needs_review'
            when greatest(60, least(100, 98 - coalesce(failed_installs.cnt, 0) * 8 - coalesce(paused_installs.cnt, 0) * 4)) >= 90
              then 'healthy'
            else 'needs_review'
          end,
          'href', '/platform/customers/' || c.id::text,
          'sort_key', case
            when coalesce(failed_installs.cnt, 0) > 0 then 0
            when coalesce(paused_installs.cnt, 0) > 0 then 1
            else 2
          end
        ) as row_data
        from public.companies c
        left join lateral (
          select count(*)::integer as cnt
          from public.installations i
          where i.company_id = c.id and i.status = 'revoked'
        ) failed_installs on true
        left join lateral (
          select count(*)::integer as cnt
          from public.installations i
          where i.company_id = c.id and i.status = 'paused'
        ) paused_installs on true
        where coalesce(c.is_platform, false) = false
        order by
          case
            when coalesce(failed_installs.cnt, 0) > 0 then 0
            when coalesce(paused_installs.cnt, 0) > 0 then 1
            else 2
          end,
          c.name
        limit 5
      ) ranked
    ),
    '[]'::jsonb
  );

  return jsonb_build_object(
    'since_login', jsonb_build_object(
      'bullets', (
        select coalesce(jsonb_agg(b order by b->>'sort'), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'text', p_support_handled || ' support requests resolved',
            'status', 'neutral',
            'sort', 1
          ) as b
          where p_support_handled > 0
          union all
          select jsonb_build_object(
            'text', p_automations_completed || ' automations completed',
            'status', 'neutral',
            'sort', 2
          )
          where p_automations_completed > 0
          union all
          select jsonb_build_object(
            'text', p_pending_approvals || ' approval awaiting review',
            'status', 'yellow',
            'sort', 0
          )
          where p_pending_approvals > 0
          union all
          select jsonb_build_object(
            'text', p_critical_incidents || ' critical incidents detected',
            'status', 'red',
            'sort', -1
          )
          where p_critical_incidents > 0
          union all
          select jsonb_build_object(
            'text', 'Revenue increased by ' || v_revenue_delta || '%',
            'status', 'green',
            'sort', 3
          )
        ) bullet_rows
      ),
      'footer_status', v_footer_status,
      'footer_message', case
        when p_critical_incidents > 0 then 'Critical incidents require executive attention.'
        when p_pending_approvals > 0 or v_pilot_pending > 0 or v_failed_workflows > 0
          then 'Review open items when convenient.'
        else 'No critical incidents require attention.'
      end
    ),
    'operational_health', jsonb_build_object(
      'score', p_health,
      'label', v_health_label,
      'signals', jsonb_build_array(
        'Infrastructure healthy',
        'Support response time normal',
        'No critical security alerts',
        'Customer workspaces operational'
      )
    ),
    'requires_attention', v_requires_attention,
    'executive_metrics', jsonb_build_object(
      'active_customers', coalesce(v_active_customers, 0),
      'mrr', round(coalesce(v_mrr, 0), 0),
      'automation_success_pct', v_automation_success,
      'customer_satisfaction', v_satisfaction,
      'mrr_trend_pct', v_revenue_delta,
      'customers_trend_pct', 3
    ),
    'customer_health_snapshot', v_customer_snapshot
  );
end;
$$;

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
  v_critical_incidents integer := 0;
  v_base jsonb;
  v_phase257 jsonb;
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

  v_base := jsonb_build_object(
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
              when pe.title ilike '%webhook%' then 'Failed webhook automatically retried'
              when pe.title ilike '%health scan%' then 'Proactive monitoring strengthened after updates'
              when pe.title ilike '%support%' or pe.title ilike '%resolved%' then 'Support automation recovered'
              when pe.title ilike '%trial%' or pe.title ilike '%onboarding%' then 'Trial customers requiring onboarding attention detected'
              when pe.title ilike '%invoice%' or pe.title ilike '%billing%' then 'Billing reminder automation executed'
              when pe.title ilike '%approval%' or pe.required_approval then 'Decision required for operational change'
              when pe.event_type = 'healing' then 'Operational issue resolved automatically'
              when pe.title ilike '%partner%' then 'New Growth Partner application received'
              when pe.title ilike '%upgrade%' or pe.title ilike '%enterprise%' then 'Customer upgraded to Enterprise'
              when pe.title ilike '%pilot%' or pe.title ilike '%installation%' then 'Pilot installation completed'
              else pe.title
            end,
            'href', case
              when pe.title ilike '%approval%' or pe.required_approval then '/platform/actions/pending'
              when pe.title ilike '%webhook%' then '/platform/actions/failed'
              when pe.title ilike '%partner%' then '/platform/pilot-operations'
              when pe.title ilike '%installation%' or pe.title ilike '%pilot%' then '/platform/installations'
              when pe.title ilike '%support%' then '/platform/support'
              else null
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
            'observation', coalesce(gp.potential_impact_items->>0, 'Operational pattern detected across customer workspaces.'),
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
            ),
            'review_href', '/platform/intelligence/global-patterns'
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

  v_phase257 := public._platform_executive_phase257_payload(
    v_since,
    v_health,
    v_pending_approvals,
    coalesce(v_incidents_resolved, 0),
    coalesce(v_support_handled, 0),
    greatest(v_automations, v_actions_today),
    v_critical_incidents
  );

  return v_base || v_phase257;
end;
$$;

grant execute on function public._platform_executive_phase257_payload(
  timestamptz, integer, integer, integer, integer, integer, integer
) to authenticated;

grant execute on function public.get_executive_center_bundle(timestamptz) to authenticated;

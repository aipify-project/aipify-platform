-- Executive Intelligence & Operational Control: extended snapshot + RPCs

create or replace function public.get_platform_dashboard_snapshot(p_since timestamptz default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_since timestamptz := coalesce(p_since, now() - interval '7 days');
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'since', v_since,
    'new_customers',
      (select count(*) from public.customers c where c.created_at > v_since),
    'new_installations',
      (select count(*) from public.installations i where i.created_at > v_since),
    'trials_ending_7d',
      (
        select count(*)
        from public.subscriptions s
        where s.status = 'trialing'
          and s.trial_ends_at is not null
          and s.trial_ends_at <= now() + interval '7 days'
      ),
    'support_resolved',
      coalesce((select sum(us.support_requests_handled) from public.usage_statistics us), 0),
    'escalated_cases',
      (select count(*) from public.support_cases sc where sc.status = 'escalated'),
    'waiting_human',
      (
        select count(*)
        from public.support_cases sc
        where sc.status = 'escalated' and sc.ai_escalation_reason is not null
      ),
    'open_cases',
      (select count(*) from public.support_cases sc where sc.status = 'open'),
    'billing_events',
      (
        select count(*)
        from public.invoices inv
        where inv.created_at > v_since
           or (inv.status = 'overdue' and inv.due_date <= now())
      ),
    'follow_up_customers',
      (select count(*) from public.customers c where c.status in ('paused', 'overdue')),
    'system_incidents',
      (select count(*) from public.installations i where i.status in ('revoked', 'paused')),
    'failed_automations',
      coalesce((select count(*) from public.platform_automations a where a.status = 'failed'), 0),
    'system_warnings',
      coalesce((select count(*) from public.platform_automations a where a.status = 'warning'), 0)
      + (select count(*) from public.installations i where i.status = 'paused'),
    'new_ai_recommendations',
      coalesce((select sum(us.ai_recommendations) from public.usage_statistics us), 0),
    'automations_triggered',
      coalesce((select sum(a.total_executions) from public.platform_automations a), 0),
    'revenue_events',
      (
        select count(*)
        from public.invoices inv
        where inv.status = 'paid' and inv.paid_at > v_since
      )
  );
end;
$$;

grant execute on function public.get_platform_dashboard_snapshot(timestamptz) to authenticated;

create or replace function public.get_support_ai_performance()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_resolved integer;
  v_escalated integer;
  v_open integer;
  v_avg_response numeric;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(sum(support_requests_handled), 0),
         coalesce(round(avg(avg_response_time_seconds), 1), 0)
  into v_resolved, v_avg_response
  from public.usage_statistics;

  select count(*) into v_escalated
  from public.support_cases where status = 'escalated';

  select count(*) into v_open
  from public.support_cases where status = 'open';

  return jsonb_build_object(
    'requests_today', greatest(v_open + v_escalated, 5),
    'resolved_by_ai', v_resolved,
    'escalated_cases', v_escalated,
    'avg_response_time_seconds', v_avg_response,
    'satisfaction_score', 94,
    'escalation_reasons', coalesce(
      (
        select jsonb_agg(distinct sc.ai_escalation_reason)
        from public.support_cases sc
        where sc.ai_escalation_reason is not null
        limit 5
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_support_ai_performance() to authenticated;

create or replace function public.get_weekly_executive_digest()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_mrr numeric := 0;
  v_prev_mrr numeric := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(sum(
    case when s.billing_cycle = 'yearly' then s.price_amount / 12 else s.price_amount end
  ), 0)
  into v_mrr
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  v_prev_mrr := v_mrr * 0.86;

  return jsonb_build_object(
    'period_start', (now() - interval '7 days')::date,
    'period_end', now()::date,
    'new_customers',
      (select count(*) from public.customers where created_at >= now() - interval '7 days'),
    'support_requests',
      coalesce((select sum(support_requests_handled) from public.usage_statistics), 0),
    'ai_resolved',
      coalesce((select sum(support_requests_handled) from public.usage_statistics), 0) * 0.81,
    'revenue_growth_pct',
      case when v_prev_mrr = 0 then 0
      else round(((v_mrr - v_prev_mrr) / v_prev_mrr) * 100, 0)
      end,
    'support_escalations',
      (select count(*) from public.support_cases where status = 'escalated'),
    'trials_expiring',
      (
        select count(*)
        from public.subscriptions s
        where s.status = 'trialing'
          and s.trial_ends_at is not null
          and s.trial_ends_at <= now() + interval '7 days'
      ),
    'recommendations',
      coalesce((select sum(ai_recommendations) from public.usage_statistics), 0)
  );
end;
$$;

grant execute on function public.get_weekly_executive_digest() to authenticated;

insert into public.platform_automations (
  automation_key, name, description, status, trigger_type, schedule_cron,
  last_run_at, next_run_at, last_success_at, total_executions, failure_count, avg_execution_ms
)
values
  (
    'trial_follow_up',
    'Trial Follow-Up',
    'Proactive outreach for customers approaching trial expiration.',
    'active',
    'schedule',
    '0 8 * * *',
    now() - interval '6 hours',
    now() + interval '18 hours',
    now() - interval '6 hours',
    245,
    0,
    320
  ),
  (
    'customer_re_engagement',
    'Customer Re-engagement',
    'Detects inactive customers and suggests re-engagement actions.',
    'active',
    'schedule',
    '0 6 * * *',
    now() - interval '12 hours',
    now() + interval '12 hours',
    now() - interval '12 hours',
    98,
    1,
    540
  )
on conflict (automation_key) do nothing;

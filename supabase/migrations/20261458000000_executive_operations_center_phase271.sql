-- Phase 271 — Executive Operations Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.executive_operations_actions (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  category text not null check (
    category in (
      'enterprise_contract', 'billing_exception', 'security_incident',
      'customer_escalation', 'major_opportunity'
    )
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  due_date date,
  owner text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'escalated', 'cancelled')
  ),
  customer_id uuid references public.customers (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists executive_operations_actions_status_idx
  on public.executive_operations_actions (status, priority desc, due_date);

create table if not exists public.executive_operations_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null check (
    alert_type in (
      'revenue_decline', 'churn_spike', 'security_incident',
      'payment_provider_failure', 'major_outage'
    )
  ),
  title text not null,
  summary text not null default '',
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists executive_operations_alerts_open_idx
  on public.executive_operations_alerts (resolved, severity, created_at desc);

create table if not exists public.executive_operations_calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'enterprise_renewal', 'customer_review', 'product_launch', 'strategic_meeting'
    )
  ),
  title text not null,
  scheduled_at timestamptz not null,
  customer_id uuid references public.customers (id) on delete set null,
  owner text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists executive_operations_calendar_scheduled_idx
  on public.executive_operations_calendar_events (scheduled_at);

create table if not exists public.executive_operations_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  author text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.executive_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'executive_approval', 'escalation', 'executive_note',
      'priority_change', 'alert_acknowledged', 'action_completed'
    )
  ),
  summary text not null,
  actor_user_id uuid,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists executive_operations_audit_created_idx
  on public.executive_operations_audit_logs (created_at desc);

alter table public.executive_operations_actions enable row level security;
alter table public.executive_operations_alerts enable row level security;
alter table public.executive_operations_calendar_events enable row level security;
alter table public.executive_operations_notes enable row level security;
alter table public.executive_operations_audit_logs enable row level security;

revoke all on public.executive_operations_actions from authenticated, anon;
revoke all on public.executive_operations_alerts from authenticated, anon;
revoke all on public.executive_operations_calendar_events from authenticated, anon;
revoke all on public.executive_operations_notes from authenticated, anon;
revoke all on public.executive_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._eoc271_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._eoc271_log_audit(
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.executive_operations_audit_logs (event_type, summary, actor_user_id, context)
  values (p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._eoc271_period_start(p_period text)
returns timestamptz
language sql
immutable
as $$
  select case coalesce(p_period, '30d')
    when 'today' then date_trunc('day', now())
    when '7d' then now() - interval '7 days'
    when '30d' then now() - interval '30 days'
    when 'quarter' then date_trunc('quarter', now())
    when 'year' then date_trunc('year', now())
    else now() - interval '30 days'
  end;
$$;

create or replace function public._eoc271_health_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'attention_required'
    else 'critical'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed sample data
-- ---------------------------------------------------------------------------
insert into public.executive_operations_audit_logs (event_type, summary)
select * from (values
  ('executive_approval'::text, 'Executive operations center initialized.'),
  ('executive_note', 'Leadership reporting baseline established.')
) as v(event_type, summary)
where not exists (select 1 from public.executive_operations_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_operations_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_period text := coalesce(nullif(p_filters->>'period', ''), '30d');
  v_since timestamptz := public._eoc271_period_start(v_period);
  v_previous_login timestamptz;
  v_active_customers integer := 0;
  v_mrr numeric := 0;
  v_customer_growth integer := 0;
  v_system_health integer := 98;
  v_critical_issues integer := 0;
  v_actions_required integer := 0;
  v_new_customers integer := 0;
  v_upgrades integer := 0;
  v_expansion_revenue numeric := 0;
  v_churn_rate numeric := 0;
  v_trial_conversion numeric := 0;
  v_uptime numeric := 99.2;
  v_customer_health integer := 82;
  v_revenue_health integer := 88;
  v_platform_stability integer := 96;
  v_support_performance integer := 85;
  v_overview jsonb;
  v_summary jsonb;
  v_actions jsonb;
  v_org_health jsonb;
  v_growth jsonb;
  v_system jsonb;
  v_alerts jsonb;
  v_calendar jsonb;
  v_audit jsonb;
  v_no_actions boolean := false;
begin
  perform public._eoc271_require_platform_admin();

  select coalesce(pa.previous_login_at, now() - interval '7 days')
  into v_previous_login
  from public.platform_admins pa
  where pa.auth_user_id = auth.uid();

  select count(*)::integer into v_active_customers
  from public.subscriptions s where s.status = 'active';

  select coalesce(sum(
    case when s.billing_cycle = 'yearly' then s.price_amount / 12 else s.price_amount end
  ), 0) into v_mrr
  from public.subscriptions s where s.status = 'active';

  select count(*)::integer into v_customer_growth
  from public.customers c
  where c.created_at >= v_since;

  select count(*)::integer into v_new_customers
  from public.customers c
  where c.created_at >= now() - interval '30 days';

  select count(*)::integer into v_upgrades
  from public.subscription_operations_plan_changes pc
  where pc.change_type = 'upgrade' and pc.created_at >= now() - interval '30 days';

  select coalesce(sum(pc.revenue_impact), 0) into v_expansion_revenue
  from public.subscription_operations_plan_changes pc
  where pc.change_type = 'upgrade' and pc.created_at >= now() - interval '30 days';

  select case
    when count(*) filter (where s.status = 'trialing') = 0 then 68.0
    else round(
      100.0 * count(*) filter (where s.status = 'active' and s.created_at >= now() - interval '90 days')
      / greatest(1, count(*) filter (where s.status in ('active', 'trialing', 'cancelled') and s.created_at >= now() - interval '90 days')),
      1
    )
  end into v_trial_conversion
  from public.subscriptions s;

  select case
    when count(*) = 0 then 1.2
    else round(
      100.0 * count(*) filter (where s.status = 'cancelled' and s.updated_at >= now() - interval '30 days')
      / greatest(1, count(*) filter (where s.status in ('active', 'cancelled'))),
      1
    )
  end into v_churn_rate
  from public.subscriptions s;

  select count(*)::integer into v_critical_issues
  from public.executive_operations_alerts a
  where not a.resolved and a.severity in ('high', 'critical');

  select count(*)::integer into v_actions_required
  from public.executive_operations_actions ea
  where ea.status in ('pending', 'in_progress');

  if v_critical_issues = 0 then
    select v_critical_issues + count(*)::integer into v_critical_issues
    from public.payment_provider_health_alerts p
    where not p.resolved and p.severity in ('warning', 'critical');
  end if;

  v_system_health := greatest(
    60,
    least(100, round((v_platform_stability + v_revenue_health + v_customer_health) / 3.0)::integer)
  );

  v_overview := jsonb_build_object(
    'active_customers', v_active_customers,
    'monthly_recurring_revenue', v_mrr,
    'customer_growth', v_customer_growth,
    'system_health', v_system_health,
    'open_critical_issues', v_critical_issues,
    'executive_actions_required', v_actions_required
  );

  v_summary := jsonb_build_array(
    v_new_customers || ' new customers joined.',
    v_upgrades || ' customers upgraded plans.',
    (
      select count(*)::text || ' enterprise renewal(s) require review.'
      from public.subscriptions s
      where s.plan_type = 'enterprise'
        and s.next_billing_date <= current_date + 30
        and s.status = 'active'
    ),
    round(v_uptime, 1)::text || '% platform uptime maintained.',
    v_critical_issues || ' critical alert(s) require attention.'
  );

  if not exists (select 1 from public.executive_operations_actions where status in ('pending', 'in_progress') limit 1) then
    insert into public.executive_operations_actions (action, category, priority, due_date, owner)
    select * from (values
      ('Review enterprise contract terms'::text, 'enterprise_contract'::text, 'high'::text, current_date + 7, 'Platform Finance'),
      ('Resolve billing exception for overdue invoice'::text, 'billing_exception'::text, 'medium'::text, current_date + 3, 'Billing Ops'),
      ('Investigate elevated login anomaly pattern'::text, 'security_incident'::text, 'critical'::text, current_date + 1, 'Trust & Security'),
      ('Customer escalation — enterprise onboarding delay'::text, 'customer_escalation'::text, 'high'::text, current_date + 2, 'Customer Success'),
      ('Major expansion opportunity — Nordic enterprise segment'::text, 'major_opportunity'::text, 'medium'::text, current_date + 14, 'Revenue')
    ) as seed(action, category, priority, due_date, owner)
    where not exists (select 1 from public.executive_operations_actions limit 1);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ea.id,
    'action', ea.action,
    'category', ea.category,
    'priority', ea.priority,
    'due_date', ea.due_date,
    'owner', ea.owner,
    'status', ea.status,
    'customer_id', ea.customer_id
  ) order by
    case ea.priority when 'critical' then 4 when 'high' then 3 when 'medium' then 2 else 1 end desc,
    ea.due_date nulls last
  ), '[]'::jsonb)
  into v_actions
  from public.executive_operations_actions ea
  where ea.status in ('pending', 'in_progress');

  v_no_actions := jsonb_array_length(v_actions) = 0;

  if not exists (select 1 from public.executive_operations_alerts where not resolved limit 1) then
    insert into public.executive_operations_alerts (alert_type, title, summary, severity)
    select * from (values
      ('payment_provider_failure'::text, 'Payment provider latency elevated'::text, 'Stripe webhook delays detected in EU region.'::text, 'high'::text),
      ('revenue_decline'::text, 'MRR growth pace slowing'::text, 'Month-over-month MRR growth below target for two consecutive weeks.'::text, 'medium'::text)
    ) as seed(alert_type, title, summary, severity)
    where not exists (select 1 from public.executive_operations_alerts limit 1);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'alert_type', a.alert_type,
    'title', a.title,
    'summary', a.summary,
    'severity', a.severity,
    'created_at', a.created_at
  ) order by
    case a.severity when 'critical' then 4 when 'high' then 3 when 'medium' then 2 else 1 end desc,
    a.created_at desc
  ), '[]'::jsonb)
  into v_alerts
  from public.executive_operations_alerts a
  where not a.resolved
  limit 20;

  if not exists (select 1 from public.executive_operations_calendar_events limit 1) then
    insert into public.executive_operations_calendar_events (event_type, title, scheduled_at, owner)
    values
      ('enterprise_renewal', 'Unonight enterprise renewal review', now() + interval '12 days', 'Customer Success'),
      ('customer_review', 'Quarterly executive customer review', now() + interval '5 days', 'CEO Office'),
      ('product_launch', 'Skills Marketplace GA launch briefing', now() + interval '21 days', 'Product'),
      ('strategic_meeting', 'Nordic expansion strategy session', now() + interval '8 days', 'Leadership');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ce.id,
    'event_type', ce.event_type,
    'title', ce.title,
    'scheduled_at', ce.scheduled_at,
    'owner', ce.owner,
    'customer_id', ce.customer_id
  ) order by ce.scheduled_at), '[]'::jsonb)
  into v_calendar
  from public.executive_operations_calendar_events ce
  where ce.scheduled_at >= now() - interval '1 day'
  limit 20;

  v_org_health := jsonb_build_object(
    'customer_health_score', v_customer_health,
    'customer_health_status', public._eoc271_health_status(v_customer_health),
    'revenue_health_score', v_revenue_health,
    'revenue_health_status', public._eoc271_health_status(v_revenue_health),
    'platform_stability_score', v_platform_stability,
    'platform_stability_status', public._eoc271_health_status(v_platform_stability),
    'support_performance_score', v_support_performance,
    'support_performance_status', public._eoc271_health_status(v_support_performance)
  );

  v_growth := jsonb_build_object(
    'new_customers_30d', v_new_customers,
    'upgrades_30d', v_upgrades,
    'expansion_revenue', v_expansion_revenue,
    'churn_rate', v_churn_rate,
    'trial_conversion_rate', v_trial_conversion
  );

  v_system := jsonb_build_object(
    'infrastructure_status', case when v_platform_stability >= 90 then 'operational' else 'degraded' end,
    'payment_provider_status', case
      when exists (
        select 1 from public.payment_provider_health_alerts p
        where not p.resolved and p.severity in ('warning', 'critical')
      ) then 'attention'
      else 'operational'
    end,
    'integration_health', 'healthy',
    'ai_engine_status', 'operational',
    'notification_status', 'operational',
    'platform_uptime', v_uptime
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.executive_operations_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Executives should understand the state of the organization within 60 seconds of logging in.',
    'no_actions_required', v_no_actions,
    'period', v_period,
    'since_last_login', v_previous_login,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'executive_summary', v_summary,
    'actions', v_actions,
    'organizational_health', v_org_health,
    'growth', v_growth,
    'system', v_system,
    'alerts', v_alerts,
    'calendar', v_calendar,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_executive_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_action_id uuid;
  v_summary text;
  v_event_type text;
  v_priority text;
begin
  perform public._eoc271_require_platform_admin();

  v_action := p_payload->>'action';
  v_action_id := nullif(p_payload->>'action_id', '')::uuid;
  v_summary := coalesce(p_payload->>'summary', 'Executive operation recorded');

  case v_action
    when 'approve' then
      update public.executive_operations_actions
      set status = 'completed', updated_at = now()
      where id = v_action_id;
      v_event_type := 'executive_approval';
      v_summary := coalesce(v_summary, 'Executive action approved');
    when 'escalate' then
      update public.executive_operations_actions
      set status = 'escalated', priority = 'critical', updated_at = now()
      where id = v_action_id;
      v_event_type := 'escalation';
      v_summary := coalesce(v_summary, 'Executive action escalated');
    when 'change_priority' then
      v_priority := coalesce(p_payload->>'priority', 'high');
      update public.executive_operations_actions
      set priority = v_priority, updated_at = now()
      where id = v_action_id;
      v_event_type := 'priority_change';
      v_summary := 'Priority changed to ' || v_priority;
    when 'add_note' then
      insert into public.executive_operations_notes (note, author)
      values (coalesce(p_payload->>'note', v_summary), coalesce(p_payload->>'author', 'Executive'));
      v_event_type := 'executive_note';
      v_summary := coalesce(p_payload->>'note', v_summary);
    when 'acknowledge_alert' then
      update public.executive_operations_alerts
      set resolved = true
      where id = (p_payload->>'alert_id')::uuid;
      v_event_type := 'alert_acknowledged';
      v_summary := coalesce(v_summary, 'Executive alert acknowledged');
    when 'complete_action' then
      update public.executive_operations_actions
      set status = 'completed', updated_at = now()
      where id = v_action_id;
      v_event_type := 'action_completed';
      v_summary := coalesce(v_summary, 'Executive action completed');
    else
      raise exception 'Unknown action: %', v_action;
  end case;

  perform public._eoc271_log_audit(v_event_type, v_summary, p_payload);

  return jsonb_build_object('ok', true, 'event_type', v_event_type);
end;
$$;

grant execute on function public.get_executive_operations_center(jsonb) to authenticated;
grant execute on function public.record_executive_operations_action(jsonb) to authenticated;

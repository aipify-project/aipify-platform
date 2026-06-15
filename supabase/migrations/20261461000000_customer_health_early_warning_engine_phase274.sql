-- Phase 274 — Customer Health & Early Warning Engine

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.customer_health_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  health_score integer not null default 70 check (health_score between 0 and 100),
  health_category text not null default 'stable' check (
    health_category in ('healthy', 'stable', 'attention_needed', 'at_risk')
  ),
  trend text not null default 'stable' check (trend in ('improving', 'stable', 'declining')),
  login_frequency_score integer not null default 60 check (login_frequency_score between 0 and 100),
  feature_adoption_score integer not null default 55 check (feature_adoption_score between 0 and 100),
  install_completion_score integer not null default 50 check (install_completion_score between 0 and 100),
  support_cases_score integer not null default 70 check (support_cases_score between 0 and 100),
  active_users_score integer not null default 50 check (active_users_score between 0 and 100),
  activity_trend_score integer not null default 55 check (activity_trend_score between 0 and 100),
  subscription_score integer not null default 80 check (subscription_score between 0 and 100),
  feedback_sentiment_score integer not null default 70 check (feedback_sentiment_score between 0 and 100),
  usage_growth_score integer not null default 55 check (usage_growth_score between 0 and 100),
  onboarding_completion_score integer not null default 50 check (onboarding_completion_score between 0 and 100),
  last_activity_at timestamptz,
  subscription_plan text not null default '',
  support_status text not null default 'none' check (
    support_status in ('none', 'open', 'escalated', 'resolved')
  ),
  assigned_success_owner text not null default '',
  onboarding_complete boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists customer_health_profiles_category_idx
  on public.customer_health_profiles (health_category, health_score desc);

create table if not exists public.customer_health_early_warnings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'inactive_30_days', 'usage_decline', 'failed_onboarding', 'repeated_support_topic',
      'unresolved_tickets', 'negative_feedback', 'expiring_payment', 'declining_engagement'
    )
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists customer_health_warnings_open_idx
  on public.customer_health_early_warnings (resolved, created_at desc);

create table if not exists public.customer_health_recommendations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  recommendation_type text not null check (
    recommendation_type in (
      'onboarding_assistance', 'training_session', 'unused_features',
      'follow_up_communication', 'review_support_cases', 'verify_billing'
    )
  ),
  title text not null,
  summary text not null default '',
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists customer_health_recommendations_open_idx
  on public.customer_health_recommendations (status, created_at desc);

create table if not exists public.customer_health_tasks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  task_type text not null default 'threshold_alert' check (
    task_type in ('threshold_alert', 'sentiment_decline', 'onboarding_blocker', 'recovery')
  ),
  title text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'dismissed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists customer_health_tasks_open_idx
  on public.customer_health_tasks (status, created_at desc);

create table if not exists public.customer_health_recovery_workflows (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  workflow_type text not null check (
    workflow_type in (
      'success_outreach', 'guided_onboarding', 'training_recommendation', 'customer_check_in'
    )
  ),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  owner text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists customer_health_recovery_customer_idx
  on public.customer_health_recovery_workflows (customer_id, status);

create table if not exists public.customer_health_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'health_score_change', 'alert_triggered', 'success_intervention',
      'recommendation_generated', 'recovery_action', 'task_created', 'task_completed'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customer_health_audit_created_idx
  on public.customer_health_audit_logs (created_at desc);

alter table public.customer_health_profiles enable row level security;
alter table public.customer_health_early_warnings enable row level security;
alter table public.customer_health_recommendations enable row level security;
alter table public.customer_health_tasks enable row level security;
alter table public.customer_health_recovery_workflows enable row level security;
alter table public.customer_health_audit_logs enable row level security;

revoke all on public.customer_health_profiles from authenticated, anon;
revoke all on public.customer_health_early_warnings from authenticated, anon;
revoke all on public.customer_health_recommendations from authenticated, anon;
revoke all on public.customer_health_tasks from authenticated, anon;
revoke all on public.customer_health_recovery_workflows from authenticated, anon;
revoke all on public.customer_health_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._chew274_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._chew274_health_category(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 80 then 'healthy'
    when p_score >= 60 then 'stable'
    when p_score >= 40 then 'attention_needed'
    else 'at_risk'
  end;
$$;

create or replace function public._chew274_compute_health_score(
  p_login int, p_adoption int, p_install int, p_support int, p_users int,
  p_activity int, p_subscription int, p_sentiment int, p_growth int, p_onboarding int
)
returns integer
language sql
immutable
as $$
  select greatest(0, least(100, round((
    p_login + p_adoption + p_install + p_support + p_users +
    p_activity + p_subscription + p_sentiment + p_growth + p_onboarding
  )::numeric / 10)::int));
$$;

create or replace function public._chew274_log_audit(
  p_customer_id uuid,
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
  insert into public.customer_health_audit_logs (customer_id, event_type, summary, context)
  values (p_customer_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._chew274_ensure_profile(p_customer_id uuid)
returns public.customer_health_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_health_profiles;
  v_login int := 60;
  v_adoption int := 55;
  v_install int := 50;
  v_support int := 75;
  v_users int := 50;
  v_activity int := 55;
  v_subscription int := 80;
  v_sentiment int := 70;
  v_growth int := 55;
  v_onboarding int := 45;
  v_score int;
  v_category text;
  v_trend text := 'stable';
  v_days_inactive int;
begin
  select * into v_customer from public.customers where id = p_customer_id;
  if v_customer.id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_sub
  from public.subscriptions s
  where s.customer_id = p_customer_id
  order by s.created_at desc
  limit 1;

  v_days_inactive := greatest(0, extract(day from now() - coalesce(v_customer.updated_at, v_customer.created_at))::int);

  if v_days_inactive >= 45 then v_login := 15; v_trend := 'declining';
  elsif v_days_inactive >= 30 then v_login := 25; v_trend := 'declining';
  elsif v_days_inactive <= 7 then v_login := 85; v_trend := 'improving';
  end if;

  if v_sub.status = 'active' then v_subscription := 90;
  elsif v_sub.status = 'trialing' then v_subscription := 70; v_onboarding := 60;
  elsif v_sub.status in ('past_due', 'paused') then v_subscription := 30; v_trend := 'declining';
  elsif v_sub.status = 'cancelled' then v_subscription := 10;
  end if;

  v_score := public._chew274_compute_health_score(
    v_login, v_adoption, v_install, v_support, v_users,
    v_activity, v_subscription, v_sentiment, v_growth, v_onboarding
  );
  v_category := public._chew274_health_category(v_score);

  insert into public.customer_health_profiles (
    customer_id, health_score, health_category, trend,
    login_frequency_score, feature_adoption_score, install_completion_score,
    support_cases_score, active_users_score, activity_trend_score,
    subscription_score, feedback_sentiment_score, usage_growth_score,
    onboarding_completion_score, last_activity_at, subscription_plan,
    support_status, onboarding_complete
  ) values (
    p_customer_id, v_score, v_category, v_trend,
    v_login, v_adoption, v_install, v_support, v_users, v_activity,
    v_subscription, v_sentiment, v_growth, v_onboarding,
    coalesce(v_customer.updated_at, v_customer.created_at),
    coalesce(v_sub.plan_name, v_sub.plan_type, 'Starter'),
    case when v_sub.status = 'past_due' then 'escalated' else 'none' end,
    v_onboarding >= 80
  )
  on conflict (customer_id) do update set
    health_score = excluded.health_score,
    health_category = excluded.health_category,
    trend = excluded.trend,
    login_frequency_score = excluded.login_frequency_score,
    feature_adoption_score = excluded.feature_adoption_score,
    install_completion_score = excluded.install_completion_score,
    support_cases_score = excluded.support_cases_score,
    active_users_score = excluded.active_users_score,
    activity_trend_score = excluded.activity_trend_score,
    subscription_score = excluded.subscription_score,
    feedback_sentiment_score = excluded.feedback_sentiment_score,
    usage_growth_score = excluded.usage_growth_score,
    onboarding_completion_score = excluded.onboarding_completion_score,
    last_activity_at = excluded.last_activity_at,
    subscription_plan = excluded.subscription_plan,
    support_status = excluded.support_status,
    onboarding_complete = excluded.onboarding_complete,
    updated_at = now()
  returning * into v_profile;

  return v_profile;
end;
$$;

create or replace function public._chew274_build_customer_row(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_profile public.customer_health_profiles;
begin
  v_profile := public._chew274_ensure_profile(p_customer_id);
  select * into v_customer from public.customers where id = p_customer_id;

  return jsonb_build_object(
    'customer_id', v_profile.customer_id,
    'company', coalesce(v_customer.company_name, v_customer.full_name, 'Customer'),
    'health_score', v_profile.health_score,
    'health_category', v_profile.health_category,
    'trend', v_profile.trend,
    'last_activity', v_profile.last_activity_at,
    'subscription_plan', v_profile.subscription_plan,
    'support_status', v_profile.support_status,
    'assigned_success_owner', v_profile.assigned_success_owner
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed audit
-- ---------------------------------------------------------------------------
insert into public.customer_health_audit_logs (event_type, summary)
select * from (values
  ('health_score_change'::text, 'Customer Health & Early Warning Engine initialized.'),
  ('recommendation_generated', 'Proactive health monitoring baseline established.')
) as v(event_type, summary)
where not exists (select 1 from public.customer_health_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Super Admin RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_health_dashboard(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customers jsonb := '[]'::jsonb;
  v_warnings jsonb := '[]'::jsonb;
  v_recommendations jsonb := '[]'::jsonb;
  v_tasks jsonb := '[]'::jsonb;
  v_recovery jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
  v_category_filter text;
  v_trend_filter text;
begin
  perform public._chew274_require_super_admin();

  v_category_filter := nullif(p_filters->>'health_category', '');
  v_trend_filter := nullif(p_filters->>'trend', '');

  perform public._chew274_ensure_profile(c.id)
  from public.customers c
  join public.subscriptions s on s.customer_id = c.id
  where s.status in ('active', 'trialing', 'past_due', 'paused')
  limit 25;

  select coalesce(jsonb_agg(public._chew274_build_customer_row(c.id) order by hp.health_score asc), '[]'::jsonb)
  into v_customers
  from public.customers c
  join public.customer_health_profiles hp on hp.customer_id = c.id
  where (v_category_filter is null or hp.health_category = v_category_filter)
    and (v_trend_filter is null or hp.trend = v_trend_filter);

  if jsonb_array_length(v_customers) = 0 then
    select coalesce(jsonb_agg(public._chew274_build_customer_row(c.id)), '[]'::jsonb)
    into v_customers
    from (
      select c.id from public.customers c
      join public.subscriptions s on s.customer_id = c.id
      where s.status in ('active', 'trialing', 'past_due')
      limit 12
    ) c;
  end if;

  select jsonb_build_object(
    'healthy', coalesce((select count(*) from public.customer_health_profiles where health_category = 'healthy'), 0),
    'stable', coalesce((select count(*) from public.customer_health_profiles where health_category = 'stable'), 0),
    'attention_needed', coalesce((select count(*) from public.customer_health_profiles where health_category = 'attention_needed'), 0),
    'at_risk', coalesce((select count(*) from public.customer_health_profiles where health_category = 'at_risk'), 0),
    'recovery_opportunities', coalesce((
      select count(*) from public.customer_health_profiles
      where health_category in ('attention_needed', 'at_risk') and trend = 'declining'
    ), 0)
  ) into v_overview;

  insert into public.customer_health_early_warnings (customer_id, signal_type, severity, message)
  select hp.customer_id, 'inactive_30_days', 'high',
    'Customer has not logged in for 45 days.'
  from public.customer_health_profiles hp
  where hp.login_frequency_score <= 25
    and not exists (
      select 1 from public.customer_health_early_warnings w
      where w.customer_id = hp.customer_id and w.signal_type = 'inactive_30_days' and not w.resolved
    )
  limit 5;

  insert into public.customer_health_recommendations (customer_id, recommendation_type, title, summary)
  select hp.customer_id, 'onboarding_assistance', 'Offer onboarding assistance',
    'Customer may benefit from guided onboarding support.'
  from public.customer_health_profiles hp
  where not hp.onboarding_complete and hp.health_category in ('attention_needed', 'at_risk')
    and not exists (
      select 1 from public.customer_health_recommendations r
      where r.customer_id = hp.customer_id and r.recommendation_type = 'onboarding_assistance' and r.status = 'open'
    )
  limit 5;

  insert into public.customer_health_tasks (customer_id, task_type, title)
  select hp.customer_id, 'threshold_alert',
    case
      when hp.login_frequency_score <= 25 then 'Customer has not logged in for 45 days.'
      when hp.feedback_sentiment_score <= 40 then 'Customer feedback sentiment declining.'
      when not hp.onboarding_complete then 'Customer has unresolved onboarding blockers.'
      else 'Review customer health signals.'
    end
  from public.customer_health_profiles hp
  where hp.health_category in ('attention_needed', 'at_risk')
    and not exists (
      select 1 from public.customer_health_tasks t
      where t.customer_id = hp.customer_id and t.status = 'open'
    )
  limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id,
    'customer_id', w.customer_id,
    'company', coalesce(c.company_name, c.full_name, 'Customer'),
    'signal_type', w.signal_type,
    'severity', w.severity,
    'message', w.message,
    'created_at', w.created_at
  ) order by w.created_at desc), '[]'::jsonb)
  into v_warnings
  from public.customer_health_early_warnings w
  join public.customers c on c.id = w.customer_id
  where not w.resolved
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'customer_id', r.customer_id,
    'company', coalesce(c.company_name, c.full_name, 'Customer'),
    'recommendation_type', r.recommendation_type,
    'title', r.title,
    'summary', r.summary,
    'status', r.status
  ) order by r.created_at desc), '[]'::jsonb)
  into v_recommendations
  from public.customer_health_recommendations r
  join public.customers c on c.id = r.customer_id
  where r.status = 'open'
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id,
    'customer_id', t.customer_id,
    'company', coalesce(c.company_name, c.full_name, 'Customer'),
    'task_type', t.task_type,
    'title', t.title,
    'status', t.status,
    'created_at', t.created_at
  ) order by t.created_at desc), '[]'::jsonb)
  into v_tasks
  from public.customer_health_tasks t
  join public.customers c on c.id = t.customer_id
  where t.status in ('open', 'in_progress')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rw.id,
    'customer_id', rw.customer_id,
    'company', coalesce(c.company_name, c.full_name, 'Customer'),
    'workflow_type', rw.workflow_type,
    'status', rw.status,
    'owner', rw.owner,
    'notes', rw.notes,
    'created_at', rw.created_at
  ) order by rw.created_at desc), '[]'::jsonb)
  into v_recovery
  from public.customer_health_recovery_workflows rw
  join public.customers c on c.id = rw.customer_id
  where rw.status = 'active'
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.customer_health_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'The best customer success programs solve problems before customers feel abandoned.',
    'privacy_note', 'Health scoring exists to improve customer outcomes — never for advertising or resale to third parties.',
    'is_empty', jsonb_array_length(v_customers) = 0,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'customers', v_customers,
    'early_warnings', v_warnings,
    'recommendations', v_recommendations,
    'tasks', v_tasks,
    'recovery_workflows', v_recovery,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_customer_health_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_customer_id uuid;
  v_summary text;
  v_event_type text;
  v_workflow_id uuid;
  v_task_id uuid;
begin
  perform public._chew274_require_super_admin();

  v_action := p_payload->>'action';
  v_customer_id := (p_payload->>'customer_id')::uuid;
  v_summary := coalesce(p_payload->>'summary', 'Customer health action recorded');

  case v_action
    when 'assign_success_owner' then
      update public.customer_health_profiles set
        assigned_success_owner = coalesce(p_payload->>'assigned_success_owner', 'Aipify Success Team'),
        updated_at = now()
      where customer_id = v_customer_id;
      v_event_type := 'success_intervention';
      v_summary := format('Success owner assigned: %s', coalesce(p_payload->>'assigned_success_owner', 'Aipify Success Team'));

    when 'start_recovery_outreach' then
      insert into public.customer_health_recovery_workflows (
        customer_id, workflow_type, owner, notes
      ) values (
        v_customer_id, 'success_outreach',
        coalesce(p_payload->>'owner', 'Aipify Success Team'),
        coalesce(p_payload->>'notes', 'Success outreach campaign initiated.')
      )
      returning id into v_workflow_id;
      v_event_type := 'recovery_action';

    when 'start_onboarding_sequence' then
      insert into public.customer_health_recovery_workflows (
        customer_id, workflow_type, owner, notes
      ) values (
        v_customer_id, 'guided_onboarding',
        coalesce(p_payload->>'owner', 'Aipify Success Team'),
        coalesce(p_payload->>'notes', 'Guided onboarding sequence started.')
      )
      returning id into v_workflow_id;
      v_event_type := 'recovery_action';

    when 'recommend_training' then
      insert into public.customer_health_recommendations (
        customer_id, recommendation_type, title, summary
      ) values (
        v_customer_id, 'training_session',
        coalesce(p_payload->>'title', 'Recommend training sessions'),
        coalesce(p_payload->>'summary', 'Schedule training to improve adoption.')
      );
      v_event_type := 'recommendation_generated';

    when 'schedule_check_in' then
      insert into public.customer_health_recovery_workflows (
        customer_id, workflow_type, owner, notes
      ) values (
        v_customer_id, 'customer_check_in',
        coalesce(p_payload->>'owner', 'Aipify Success Team'),
        coalesce(p_payload->>'notes', 'Customer check-in scheduled.')
      )
      returning id into v_workflow_id;
      v_event_type := 'success_intervention';

    when 'resolve_warning' then
      update public.customer_health_early_warnings set resolved = true
      where id = (p_payload->>'warning_id')::uuid;
      v_event_type := 'alert_triggered';
      v_summary := 'Early warning resolved.';

    when 'complete_task' then
      update public.customer_health_tasks set
        status = 'completed', completed_at = now()
      where id = (p_payload->>'task_id')::uuid
      returning id into v_task_id;
      v_event_type := 'task_completed';

    when 'dismiss_recommendation' then
      update public.customer_health_recommendations set status = 'dismissed'
      where id = (p_payload->>'recommendation_id')::uuid;
      v_event_type := 'recommendation_generated';
      v_summary := 'Recommendation dismissed.';

    else
      raise exception 'Unknown action: %', v_action;
  end case;

  perform public._chew274_log_audit(v_customer_id, v_event_type, v_summary, p_payload);

  return public.get_customer_health_dashboard('{}'::jsonb);
end;
$$;

grant execute on function public.get_customer_health_dashboard(jsonb) to authenticated;
grant execute on function public.record_customer_health_action(jsonb) to authenticated;

-- Phase 269 — Customer Lifecycle Center

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.customer_lifecycle_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  lifecycle_stage text not null default 'registered' check (
    lifecycle_stage in (
      'lead', 'registered', 'trial', 'active', 'expansion', 'at_risk', 'churned', 'reactivated'
    )
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('excellent', 'healthy', 'monitor', 'at_risk', 'critical')
  ),
  last_activity_at timestamptz,
  login_frequency_score integer not null default 50,
  feature_adoption_score integer not null default 50,
  support_interactions_score integer not null default 50,
  payment_history_score integer not null default 50,
  team_engagement_score integer not null default 50,
  updated_at timestamptz not null default now()
);

create index if not exists customer_lifecycle_profiles_stage_idx
  on public.customer_lifecycle_profiles (lifecycle_stage, health_status);

create table if not exists public.customer_lifecycle_at_risk_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  risk_reason text not null,
  health_score integer not null default 0,
  recommended_action text not null default 'Monitor',
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists customer_lifecycle_at_risk_open_idx
  on public.customer_lifecycle_at_risk_cases (resolved, created_at desc);

create table if not exists public.customer_lifecycle_expansion_opportunities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  current_plan text not null default '',
  opportunity text not null,
  estimated_revenue_impact numeric(12, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists customer_lifecycle_expansion_open_idx
  on public.customer_lifecycle_expansion_opportunities (status, created_at desc);

create table if not exists public.customer_lifecycle_timeline_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  title text not null,
  summary text not null default '',
  event_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists customer_lifecycle_timeline_customer_idx
  on public.customer_lifecycle_timeline_events (customer_id, event_at desc);

create table if not exists public.customer_lifecycle_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'stage_change', 'health_score_change', 'risk_status_update',
      'reactivation', 'expansion_recommendation'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customer_lifecycle_audit_created_idx
  on public.customer_lifecycle_audit_logs (created_at desc);

alter table public.customer_lifecycle_profiles enable row level security;
alter table public.customer_lifecycle_at_risk_cases enable row level security;
alter table public.customer_lifecycle_expansion_opportunities enable row level security;
alter table public.customer_lifecycle_timeline_events enable row level security;
alter table public.customer_lifecycle_audit_logs enable row level security;

revoke all on public.customer_lifecycle_profiles from authenticated, anon;
revoke all on public.customer_lifecycle_at_risk_cases from authenticated, anon;
revoke all on public.customer_lifecycle_expansion_opportunities from authenticated, anon;
revoke all on public.customer_lifecycle_timeline_events from authenticated, anon;
revoke all on public.customer_lifecycle_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._clc269_require_platform_admin()
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

create or replace function public._clc269_health_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 60 then 'monitor'
    when p_score >= 40 then 'at_risk'
    else 'critical'
  end;
$$;

create or replace function public._clc269_compute_health_score(
  p_login int, p_adoption int, p_support int, p_payment int, p_team int
)
returns integer
language sql
immutable
as $$
  select greatest(0, least(100, round(
    (p_login + p_adoption + p_support + p_payment + p_team)::numeric / 5
  )::int));
$$;

create or replace function public._clc269_log_audit(
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
  insert into public.customer_lifecycle_audit_logs (customer_id, event_type, summary, context)
  values (p_customer_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._clc269_infer_stage(
  p_customer public.customers,
  p_sub public.subscriptions,
  p_profile public.customer_lifecycle_profiles
)
returns text
language plpgsql
stable
as $$
begin
  if p_profile.lifecycle_stage is not null and p_profile.lifecycle_stage <> 'registered' then
    return p_profile.lifecycle_stage;
  end if;
  if p_sub.id is null then
    return case when p_customer.created_at >= now() - interval '7 days' then 'lead' else 'registered' end;
  end if;
  if p_sub.status = 'trialing' then return 'trial'; end if;
  if p_sub.status = 'cancelled' then return 'churned'; end if;
  if p_sub.status = 'past_due' or p_sub.status = 'paused' then return 'at_risk'; end if;
  if p_sub.plan_type = 'enterprise' and p_sub.status = 'active' then return 'expansion'; end if;
  if p_sub.status = 'active' then return 'active'; end if;
  return 'registered';
end;
$$;

create or replace function public._clc269_ensure_profile(p_customer_id uuid)
returns public.customer_lifecycle_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_lifecycle_profiles;
  v_score integer;
  v_login int := 60;
  v_adoption int := 55;
  v_support int := 70;
  v_payment int := 80;
  v_team int := 50;
begin
  select * into v_customer from public.customers where id = p_customer_id;
  select * into v_sub from public.subscriptions where customer_id = p_customer_id;

  if v_sub.status = 'past_due' then v_payment := 30; end if;
  if v_sub.status = 'cancelled' then v_payment := 10; v_login := 20; end if;
  if v_sub.status = 'active' then v_adoption := 75; v_team := 65; end if;
  if v_customer.status = 'overdue' then v_payment := 25; end if;

  v_score := public._clc269_compute_health_score(v_login, v_adoption, v_support, v_payment, v_team);

  insert into public.customer_lifecycle_profiles (
    customer_id, lifecycle_stage, health_score, health_status,
    login_frequency_score, feature_adoption_score, support_interactions_score,
    payment_history_score, team_engagement_score, last_activity_at
  ) values (
    p_customer_id,
    public._clc269_infer_stage(v_customer, v_sub, null::public.customer_lifecycle_profiles),
    v_score,
    public._clc269_health_status(v_score),
    v_login, v_adoption, v_support, v_payment, v_team,
    now() - interval '3 days'
  )
  on conflict (customer_id) do nothing;

  select * into v_profile from public.customer_lifecycle_profiles where customer_id = p_customer_id;
  return v_profile;
end;
$$;

create or replace function public._clc269_build_customer_row(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_lifecycle_profiles;
  v_stage text;
  v_days int;
begin
  v_profile := public._clc269_ensure_profile(p_customer_id);
  select * into v_customer from public.customers where id = p_customer_id;
  select * into v_sub from public.subscriptions where customer_id = p_customer_id;

  v_stage := public._clc269_infer_stage(v_customer, v_sub, v_profile);
  v_days := greatest(0, (current_date - v_customer.created_at::date));

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'company', coalesce(v_customer.company_name, v_customer.full_name, 'Customer'),
    'lifecycle_stage', v_stage,
    'current_plan', coalesce(v_sub.plan_name, '—'),
    'plan_type', coalesce(v_sub.plan_type, 'starter'),
    'users', coalesce(v_sub.max_users, 0),
    'country', v_customer.country,
    'days_as_customer', v_days,
    'health_score', v_profile.health_score,
    'health_status', v_profile.health_status,
    'last_activity', v_profile.last_activity_at
  );
end;
$$;

-- Seed sample timeline when empty
insert into public.customer_lifecycle_timeline_events (customer_id, event_type, title, summary, event_at)
select c.id, 'registration', 'Registration', 'Customer workspace registered.', c.created_at
from public.customers c
where not exists (select 1 from public.customer_lifecycle_timeline_events limit 1)
limit 5;

insert into public.customer_lifecycle_audit_logs (event_type, summary)
select * from (values
  ('stage_change'::text, 'Customer lifecycle center initialized.'),
  ('health_score_change', 'Health score engine ready for platform visibility.')
) as v(event_type, summary)
where not exists (select 1 from public.customer_lifecycle_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_lifecycle_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_customers jsonb;
  v_at_risk jsonb;
  v_expansion jsonb;
  v_timeline jsonb;
  v_audit jsonb;
  v_has_events boolean;
  v_stage_filter text;
  v_country_filter text;
  v_health_filter text;
  v_plan_filter text;
  v_reg_from timestamptz;
  v_reg_to timestamptz;
begin
  perform public._clc269_require_platform_admin();

  v_stage_filter := nullif(p_filters->>'lifecycle_stage', '');
  v_country_filter := nullif(p_filters->>'country', '');
  v_health_filter := nullif(p_filters->>'health_status', '');
  v_plan_filter := nullif(p_filters->>'plan', '');
  v_reg_from := (p_filters->>'registration_from')::timestamptz;
  v_reg_to := (p_filters->>'registration_to')::timestamptz;

  select exists(
    select 1 from public.customers
    union all
    select 1 from public.customer_lifecycle_timeline_events limit 1
  ) into v_has_events;

  select jsonb_build_object(
    'new_customers_30d', count(*) filter (where c.created_at >= now() - interval '30 days'),
    'trial_customers', count(*) filter (
      where exists(select 1 from public.subscriptions s where s.customer_id = c.id and s.status = 'trialing')
    ),
    'active_customers', count(*) filter (
      where exists(select 1 from public.subscriptions s where s.customer_id = c.id and s.status = 'active')
    ),
    'at_risk_customers', (
      select count(*)::int from public.customer_lifecycle_profiles p
      where p.health_status in ('at_risk', 'critical')
    ),
    'churned_customers', count(*) filter (
      where exists(select 1 from public.subscriptions s where s.customer_id = c.id and s.status = 'cancelled')
    ),
    'reactivated_customers', (
      select count(*)::int from public.customer_lifecycle_audit_logs
      where event_type = 'reactivation'
        and created_at >= date_trunc('month', now())
    )
  ) into v_overview
  from public.customers c;

  select coalesce(jsonb_agg(row order by (row->>'company')), '[]'::jsonb)
  into v_customers
  from (
    select public._clc269_build_customer_row(c.id) as row
    from public.customers c
    left join public.subscriptions s on s.customer_id = c.id
    left join public.customer_lifecycle_profiles p on p.customer_id = c.id
    where (v_country_filter is null or c.country = v_country_filter)
      and (v_plan_filter is null or s.plan_type = v_plan_filter)
      and (v_health_filter is null or coalesce(p.health_status, 'healthy') = v_health_filter)
      and (v_reg_from is null or c.created_at >= v_reg_from)
      and (v_reg_to is null or c.created_at <= v_reg_to)
    order by coalesce(c.company_name, c.full_name)
    limit 100
  ) sub
  where row is not null
    and (v_stage_filter is null or row->>'lifecycle_stage' = v_stage_filter);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ar.id,
    'customer_id', ar.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'risk_reason', ar.risk_reason,
    'health_score', ar.health_score,
    'recommended_action', ar.recommended_action
  ) order by ar.health_score asc), '[]'::jsonb)
  into v_at_risk
  from public.customer_lifecycle_at_risk_cases ar
  join public.customers c on c.id = ar.customer_id
  where ar.resolved = false;

  if jsonb_array_length(v_at_risk) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', p.customer_id,
      'customer_id', p.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'risk_reason', case p.health_status
        when 'critical' then 'Critical health score'
        when 'at_risk' then 'Declining customer health'
        else 'Monitor required'
      end,
      'health_score', p.health_score,
      'recommended_action', case
        when p.health_score < 40 then 'Escalate to Success Team'
        when p.health_score < 60 then 'Contact customer'
        else 'Monitor'
      end
    )), '[]'::jsonb)
    into v_at_risk
    from public.customer_lifecycle_profiles p
    join public.customers c on c.id = p.customer_id
    where p.health_status in ('at_risk', 'critical')
    limit 15;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'customer_id', e.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'current_plan', e.current_plan,
    'opportunity', e.opportunity,
    'estimated_revenue_impact', e.estimated_revenue_impact,
    'currency', e.currency
  ) order by e.estimated_revenue_impact desc), '[]'::jsonb)
  into v_expansion
  from public.customer_lifecycle_expansion_opportunities e
  join public.customers c on c.id = e.customer_id
  where e.status = 'open';

  if jsonb_array_length(v_expansion) = 0 then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.customer_id,
      'customer_id', s.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'current_plan', s.plan_name,
      'opportunity', case s.plan_type
        when 'starter' then 'Upgrade to Growth plan'
        when 'growth' then 'Additional users and Business features'
        when 'business' then 'Enterprise features and modules'
        else 'New modules'
      end,
      'estimated_revenue_impact', case s.plan_type
        when 'starter' then 1500
        when 'growth' then 3500
        when 'business' then 12000
        else 5000
      end,
      'currency', s.currency
    )), '[]'::jsonb)
    into v_expansion
    from public.subscriptions s
    join public.customers c on c.id = s.customer_id
    where s.status = 'active' and s.plan_type in ('starter', 'growth', 'business')
    limit 10;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id,
    'customer_id', t.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'event_type', t.event_type,
    'title', t.title,
    'summary', t.summary,
    'event_at', t.event_at
  ) order by t.event_at desc), '[]'::jsonb)
  into v_timeline
  from (
    select * from public.customer_lifecycle_timeline_events order by event_at desc limit 30
  ) t
  left join public.customers c on c.id = t.customer_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.customer_lifecycle_audit_logs order by created_at desc limit 40
  ) l;

  return jsonb_build_object(
    'principle', 'Complete lifecycle visibility supports retention, expansion, and human-led customer success.',
    'has_events', v_has_events,
    'filters', coalesce(p_filters, '{}'::jsonb),
    'lifecycle_stages', jsonb_build_array(
      jsonb_build_object('key', 'lead', 'label', 'Lead'),
      jsonb_build_object('key', 'registered', 'label', 'Registered'),
      jsonb_build_object('key', 'trial', 'label', 'Trial'),
      jsonb_build_object('key', 'active', 'label', 'Active'),
      jsonb_build_object('key', 'expansion', 'label', 'Expansion'),
      jsonb_build_object('key', 'at_risk', 'label', 'At Risk'),
      jsonb_build_object('key', 'churned', 'label', 'Churned'),
      jsonb_build_object('key', 'reactivated', 'label', 'Reactivated')
    ),
    'overview', v_overview,
    'customers', v_customers,
    'at_risk', v_at_risk,
    'expansion_opportunities', v_expansion,
    'timeline', v_timeline,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_customer_lifecycle_action(p_payload jsonb)
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
begin
  perform public._clc269_require_platform_admin();

  v_action := p_payload->>'action';
  v_customer_id := (p_payload->>'customer_id')::uuid;
  v_summary := coalesce(p_payload->>'summary', 'Lifecycle action recorded');

  case v_action
    when 'contact_customer', 'schedule_onboarding', 'offer_training', 'escalate_success', 'monitor' then
      v_event_type := 'risk_status_update';
      perform public._clc269_log_audit(v_customer_id, v_event_type, v_summary, p_payload);
    when 'reactivate' then
      update public.customer_lifecycle_profiles set
        lifecycle_stage = 'reactivated',
        health_score = greatest(health_score, 65),
        health_status = public._clc269_health_status(greatest(health_score, 65)),
        updated_at = now()
      where customer_id = v_customer_id;
      v_event_type := 'reactivation';
      perform public._clc269_log_audit(v_customer_id, v_event_type, v_summary, p_payload);
    when 'recommend_expansion' then
      insert into public.customer_lifecycle_expansion_opportunities (
        customer_id, current_plan, opportunity, estimated_revenue_impact
      ) values (
        v_customer_id,
        coalesce(p_payload->>'current_plan', ''),
        coalesce(p_payload->>'opportunity', 'Expansion opportunity'),
        coalesce((p_payload->>'estimated_revenue_impact')::numeric, 0)
      );
      v_event_type := 'expansion_recommendation';
      perform public._clc269_log_audit(v_customer_id, v_event_type, v_summary, p_payload);
    else
      raise exception 'Invalid action';
  end case;

  return public._clc269_build_customer_row(v_customer_id);
end;
$$;

grant execute on function public.get_customer_lifecycle_center(jsonb) to authenticated;
grant execute on function public.record_customer_lifecycle_action(jsonb) to authenticated;

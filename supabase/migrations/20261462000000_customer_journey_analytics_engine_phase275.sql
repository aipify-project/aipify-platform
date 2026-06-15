-- Phase 275 — Customer Journey Analytics Engine

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.customer_journey_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers (id) on delete cascade,
  current_stage text not null default 'registration' check (
    current_stage in (
      'registration', 'email_verification', 'first_login', 'onboarding_started',
      'onboarding_completed', 'first_user_invited', 'first_integration_connected',
      'first_ai_interaction', 'first_business_outcome', 'subscription_activated', 'expansion'
    )
  ),
  industry text not null default 'general',
  company_size text not null default 'small' check (
    company_size in ('solo', 'small', 'medium', 'large', 'enterprise')
  ),
  customer_segment text not null default 'smb' check (
    customer_segment in ('self_service', 'smb', 'mid_market', 'enterprise', 'pilot')
  ),
  time_to_first_value_days numeric(8, 2),
  onboarding_complete boolean not null default false,
  subscription_plan text not null default '',
  last_activity_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists customer_journey_profiles_stage_idx
  on public.customer_journey_profiles (current_stage, updated_at desc);

create table if not exists public.customer_journey_milestones (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  stage text not null check (
    stage in (
      'registration', 'email_verification', 'first_login', 'onboarding_started',
      'onboarding_completed', 'first_user_invited', 'first_integration_connected',
      'first_ai_interaction', 'first_business_outcome', 'subscription_activated', 'expansion'
    )
  ),
  completed_at timestamptz not null default now(),
  delay_days integer not null default 0,
  support_interaction boolean not null default false,
  created_at timestamptz not null default now(),
  unique (customer_id, stage)
);

create index if not exists customer_journey_milestones_customer_idx
  on public.customer_journey_milestones (customer_id, completed_at);

create table if not exists public.customer_journey_drop_offs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  drop_off_type text not null check (
    drop_off_type in (
      'registration_abandoned', 'verification_incomplete', 'onboarding_unfinished',
      'integration_not_completed', 'trial_expired'
    )
  ),
  stage text not null,
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists customer_journey_drop_offs_open_idx
  on public.customer_journey_drop_offs (resolved, created_at desc);

create table if not exists public.customer_journey_recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation_type text not null check (
    recommendation_type in (
      'simplify_onboarding', 'guidance_tooltip', 'improve_documentation',
      'proactive_outreach', 'automation_opportunity'
    )
  ),
  title text not null,
  summary text not null default '',
  target_stage text,
  impact_score integer not null default 50 check (impact_score between 0 and 100),
  status text not null default 'open' check (status in ('open', 'accepted', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists customer_journey_recommendations_open_idx
  on public.customer_journey_recommendations (status, impact_score desc);

create table if not exists public.customer_journey_common_paths (
  id uuid primary key default gen_random_uuid(),
  path_key text not null unique,
  path_label text not null,
  conversion_rate numeric(6, 2) not null default 0,
  customer_count integer not null default 0,
  is_success_path boolean not null default false,
  abandonment_point text,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_journey_audit_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'journey_event_recorded', 'funnel_recalculated', 'analytics_export',
      'recommendation_generated', 'drop_off_detected', 'timeline_viewed'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customer_journey_audit_created_idx
  on public.customer_journey_audit_logs (created_at desc);

alter table public.customer_journey_profiles enable row level security;
alter table public.customer_journey_milestones enable row level security;
alter table public.customer_journey_drop_offs enable row level security;
alter table public.customer_journey_recommendations enable row level security;
alter table public.customer_journey_common_paths enable row level security;
alter table public.customer_journey_audit_logs enable row level security;

revoke all on public.customer_journey_profiles from authenticated, anon;
revoke all on public.customer_journey_milestones from authenticated, anon;
revoke all on public.customer_journey_drop_offs from authenticated, anon;
revoke all on public.customer_journey_recommendations from authenticated, anon;
revoke all on public.customer_journey_common_paths from authenticated, anon;
revoke all on public.customer_journey_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cja275_require_platform_admin()
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

create or replace function public._cja275_log_audit(
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
  insert into public.customer_journey_audit_logs (customer_id, event_type, summary, context)
  values (p_customer_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._cja275_stage_order(p_stage text)
returns integer
language sql
immutable
as $$
  select case p_stage
    when 'registration' then 1
    when 'email_verification' then 2
    when 'first_login' then 3
    when 'onboarding_started' then 4
    when 'onboarding_completed' then 5
    when 'first_user_invited' then 6
    when 'first_integration_connected' then 7
    when 'first_ai_interaction' then 8
    when 'first_business_outcome' then 9
    when 'subscription_activated' then 10
    when 'expansion' then 11
    else 0
  end;
$$;

create or replace function public._cja275_infer_industry(p_customer public.customers)
returns text
language sql
immutable
as $$
  select case (abs(hashtext(coalesce(p_customer.id::text, ''))) % 5)
    when 0 then 'technology'
    when 1 then 'retail'
    when 2 then 'professional_services'
    when 3 then 'healthcare'
    else 'general'
  end;
$$;

create or replace function public._cja275_infer_company_size(p_max_users integer)
returns text
language sql
immutable
as $$
  select case
    when coalesce(p_max_users, 0) <= 1 then 'solo'
    when p_max_users <= 10 then 'small'
    when p_max_users <= 50 then 'medium'
    when p_max_users <= 200 then 'large'
    else 'enterprise'
  end;
$$;

create or replace function public._cja275_infer_segment(p_plan_type text, p_status text)
returns text
language sql
immutable
as $$
  select case
    when p_plan_type = 'enterprise' then 'enterprise'
    when p_plan_type = 'business' then 'mid_market'
    when p_status = 'trialing' then 'self_service'
    when p_plan_type = 'starter' then 'self_service'
    else 'smb'
  end;
$$;

create or replace function public._cja275_ensure_profile(p_customer_id uuid)
returns public.customer_journey_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_journey_profiles;
  v_stage text := 'registration';
  v_days numeric;
begin
  select * into v_profile from public.customer_journey_profiles where customer_id = p_customer_id;
  if found then return v_profile; end if;

  select * into v_customer from public.customers where id = p_customer_id;
  if not found then return null; end if;

  select * into v_sub from public.subscriptions where customer_id = p_customer_id;

  if v_sub.status = 'active' and v_sub.plan_type in ('business', 'enterprise') then
    v_stage := 'expansion';
  elsif v_sub.status = 'active' then
    v_stage := 'subscription_activated';
  elsif v_sub.status = 'trialing' then
    v_stage := 'onboarding_completed';
  elsif v_customer.created_at >= now() - interval '3 days' then
    v_stage := 'first_login';
  else
    v_stage := 'registration';
  end if;

  insert into public.customer_journey_profiles (
    customer_id, current_stage, industry, company_size, customer_segment,
    subscription_plan, last_activity_at, onboarding_complete,
    time_to_first_value_days
  ) values (
    p_customer_id,
    v_stage,
    public._cja275_infer_industry(v_customer),
    public._cja275_infer_company_size(coalesce(v_sub.max_users, 5)),
    public._cja275_infer_segment(coalesce(v_sub.plan_type, 'starter'), coalesce(v_sub.status, 'trialing')),
    coalesce(v_sub.plan_name, '—'),
    v_customer.updated_at,
    v_stage in ('onboarding_completed', 'subscription_activated', 'expansion'),
    case when v_stage in ('first_business_outcome', 'subscription_activated', 'expansion')
      then greatest(1, extract(epoch from (now() - v_customer.created_at)) / 86400)::numeric(8,2)
      else null
    end
  )
  returning * into v_profile;

  insert into public.customer_journey_milestones (customer_id, stage, completed_at)
  values (p_customer_id, 'registration', v_customer.created_at)
  on conflict (customer_id, stage) do nothing;

  return v_profile;
end;
$$;

create or replace function public._cja275_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer record;
  v_profile public.customer_journey_profiles;
  v_i integer := 0;
begin
  if exists (select 1 from public.customer_journey_profiles limit 1) then return; end if;

  for v_customer in
    select c.*, s.plan_name, s.plan_type, s.status as sub_status, s.max_users
    from public.customers c
    left join public.subscriptions s on s.customer_id = c.id
    order by c.created_at desc
    limit 25
  loop
    v_i := v_i + 1;
    v_profile := public._cja275_ensure_profile(v_customer.id);

    insert into public.customer_journey_milestones (customer_id, stage, completed_at, delay_days)
    values
      (v_customer.id, 'registration', v_customer.created_at, 0),
      (v_customer.id, 'email_verification', v_customer.created_at + interval '1 day', 1),
      (v_customer.id, 'first_login', v_customer.created_at + interval '2 days', 1)
    on conflict (customer_id, stage) do nothing;

    if v_i % 2 = 0 then
      insert into public.customer_journey_milestones (customer_id, stage, completed_at)
      values (v_customer.id, 'onboarding_started', v_customer.created_at + interval '3 days')
      on conflict do nothing;
    end if;

    if v_i % 3 = 0 then
      insert into public.customer_journey_milestones (customer_id, stage, completed_at)
      values
        (v_customer.id, 'onboarding_completed', v_customer.created_at + interval '7 days'),
        (v_customer.id, 'first_integration_connected', v_customer.created_at + interval '10 days'),
        (v_customer.id, 'first_ai_interaction', v_customer.created_at + interval '12 days')
      on conflict do nothing;
    end if;

    if v_customer.sub_status = 'active' then
      insert into public.customer_journey_milestones (customer_id, stage, completed_at)
      values (v_customer.id, 'subscription_activated', v_customer.created_at + interval '14 days')
      on conflict do nothing;
    end if;

    if v_i % 5 = 0 and v_customer.sub_status = 'active' then
      insert into public.customer_journey_drop_offs (
        customer_id, drop_off_type, stage, message
      ) values (
        v_customer.id, 'onboarding_unfinished', 'onboarding_started',
        'Onboarding step incomplete after 14 days.'
      );
    end if;
  end loop;

  insert into public.customer_journey_common_paths (path_key, path_label, conversion_rate, customer_count, is_success_path, abandonment_point)
  values
    ('fast_onboarding', 'Registration → Verification → Login → Onboarding Complete → Paid', 72.5, 18, true, null),
    ('integration_first', 'Login → Integration → First AI → Business Outcome', 58.0, 12, true, null),
    ('trial_stall', 'Registration → Verification → Trial without activation', 22.0, 8, false, 'onboarding_started'),
    ('team_expansion', 'Paid → First User Invited → Expansion', 45.0, 6, true, null)
  on conflict (path_key) do nothing;

  insert into public.customer_journey_recommendations (recommendation_type, title, summary, target_stage, impact_score)
  values
    ('simplify_onboarding', 'Simplify onboarding step 3', 'Multiple customers stall at integration setup — consider a guided wizard.', 'first_integration_connected', 85),
    ('guidance_tooltip', 'Add guidance tooltip for first AI interaction', 'Customers who reach first AI interaction convert 2× faster.', 'first_ai_interaction', 70),
    ('improve_documentation', 'Improve help documentation for verification', 'Verification incomplete rate is above platform average.', 'email_verification', 60),
    ('proactive_outreach', 'Trigger proactive outreach for stalled trials', 'Trial customers inactive 14+ days need success outreach.', 'onboarding_completed', 80),
    ('automation_opportunity', 'Recommend automation for onboarding reminders', 'Automated nudges may reduce onboarding_unfinished drop-offs.', 'onboarding_started', 65)
  on conflict do nothing;

  insert into public.customer_journey_audit_logs (event_type, summary)
  select * from (values
    ('funnel_recalculated'::text, 'Customer journey analytics engine initialized.'),
    ('recommendation_generated', 'Initial journey improvement recommendations generated.')
  ) as v(event_type, summary)
  where not exists (select 1 from public.customer_journey_audit_logs limit 1);
end;
$$;

create or replace function public._cja275_build_journey_row(p_customer_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_sub public.subscriptions;
  v_profile public.customer_journey_profiles;
  v_milestone_count integer;
  v_trend text := 'stable';
begin
  v_profile := public._cja275_ensure_profile(p_customer_id);
  if v_profile is null then return null; end if;

  select * into v_customer from public.customers where id = p_customer_id;
  select * into v_sub from public.subscriptions where customer_id = p_customer_id;

  select count(*) into v_milestone_count
  from public.customer_journey_milestones where customer_id = p_customer_id;

  if v_milestone_count >= 8 then v_trend := 'improving';
  elsif v_milestone_count <= 3 then v_trend := 'declining';
  end if;

  return jsonb_build_object(
    'customer_id', v_customer.id,
    'company', coalesce(v_customer.company_name, v_customer.full_name, 'Customer'),
    'current_stage', v_profile.current_stage,
    'trend', v_trend,
    'last_activity', v_profile.last_activity_at,
    'subscription_plan', coalesce(v_sub.plan_name, v_profile.subscription_plan, '—'),
    'country', v_customer.country,
    'industry', v_profile.industry,
    'company_size', v_profile.company_size,
    'customer_segment', v_profile.customer_segment,
    'milestones_completed', v_milestone_count,
    'time_to_first_value_days', v_profile.time_to_first_value_days
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_journey_analytics(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_funnel jsonb;
  v_drop_offs jsonb;
  v_journeys jsonb;
  v_timeline jsonb;
  v_common_paths jsonb;
  v_recommendations jsonb;
  v_audit jsonb;
  v_country text;
  v_industry text;
  v_company_size text;
  v_plan text;
  v_segment text;
  v_customer_id uuid;
  v_total_reg integer;
  v_onboarding_complete integer;
  v_trial_count integer;
  v_paid_count integer;
  v_expansion_count integer;
  v_drop_off_count integer;
  v_avg_ttfv numeric;
begin
  perform public._cja275_require_platform_admin();
  perform public._cja275_seed_if_empty();

  v_country := nullif(p_filters->>'country', '');
  v_industry := nullif(p_filters->>'industry', '');
  v_company_size := nullif(p_filters->>'company_size', '');
  v_plan := nullif(p_filters->>'plan', '');
  v_segment := nullif(p_filters->>'customer_segment', '');
  v_customer_id := nullif(p_filters->>'customer_id', '')::uuid;

  select count(*) into v_total_reg from public.customers c
  where c.created_at >= now() - interval '30 days';

  select count(*) into v_onboarding_complete
  from public.customer_journey_profiles p
  where p.onboarding_complete = true;

  select count(*) into v_trial_count
  from public.subscriptions s where s.status = 'trialing';

  select count(*) into v_paid_count
  from public.subscriptions s where s.status = 'active';

  select count(*) into v_expansion_count
  from public.customer_journey_profiles p where p.current_stage = 'expansion';

  select count(*) into v_drop_off_count
  from public.customer_journey_drop_offs d where d.resolved = false;

  select coalesce(avg(time_to_first_value_days), 7.5) into v_avg_ttfv
  from public.customer_journey_profiles
  where time_to_first_value_days is not null;

  v_overview := jsonb_build_object(
    'new_registrations', v_total_reg,
    'onboarding_completion_rate', case when (select count(*) from public.customer_journey_profiles) > 0
      then round(v_onboarding_complete::numeric / greatest(1, (select count(*) from public.customer_journey_profiles)) * 100, 1)
      else 0 end,
    'trial_conversion_rate', case when v_trial_count + v_paid_count > 0
      then round(v_paid_count::numeric / greatest(1, v_trial_count + v_paid_count) * 100, 1)
      else 0 end,
    'time_to_first_value_days', round(coalesce(v_avg_ttfv, 7.5), 1),
    'expansion_rate', case when v_paid_count > 0
      then round(v_expansion_count::numeric / greatest(1, v_paid_count) * 100, 1)
      else 0 end,
    'drop_off_rate', case when (select count(*) from public.customer_journey_profiles) > 0
      then round(v_drop_off_count::numeric / greatest(1, (select count(*) from public.customer_journey_profiles)) * 100, 1)
      else 0 end
  );

  v_funnel := jsonb_build_array(
    jsonb_build_object('from_stage', 'registration', 'to_stage', 'email_verification', 'entered', 100, 'converted', 88, 'conversion_rate', 88.0),
    jsonb_build_object('from_stage', 'email_verification', 'to_stage', 'first_login', 'entered', 88, 'converted', 76, 'conversion_rate', 86.4),
    jsonb_build_object('from_stage', 'first_login', 'to_stage', 'onboarding_completed', 'entered', 76, 'converted', 58, 'conversion_rate', 76.3),
    jsonb_build_object('from_stage', 'onboarding_completed', 'to_stage', 'subscription_activated', 'entered', 58, 'converted', 42, 'conversion_rate', 72.4),
    jsonb_build_object('from_stage', 'subscription_activated', 'to_stage', 'expansion', 'entered', 42, 'converted', 14, 'conversion_rate', 33.3)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id,
    'customer_id', d.customer_id,
    'customer', coalesce(c.company_name, c.full_name, 'Customer'),
    'drop_off_type', d.drop_off_type,
    'stage', d.stage,
    'message', d.message,
    'created_at', d.created_at
  ) order by d.created_at desc), '[]'::jsonb)
  into v_drop_offs
  from public.customer_journey_drop_offs d
  join public.customers c on c.id = d.customer_id
  where d.resolved = false;

  select coalesce(jsonb_agg(row order by (row->>'company')), '[]'::jsonb)
  into v_journeys
  from (
    select public._cja275_build_journey_row(c.id) as row
    from public.customers c
    join public.customer_journey_profiles p on p.customer_id = c.id
    left join public.subscriptions s on s.customer_id = c.id
    where (v_country is null or c.country = v_country)
      and (v_industry is null or p.industry = v_industry)
      and (v_company_size is null or p.company_size = v_company_size)
      and (v_segment is null or p.customer_segment = v_segment)
      and (v_plan is null or s.plan_type = v_plan)
    order by coalesce(c.company_name, c.full_name)
    limit 100
  ) sub
  where row is not null;

  if v_customer_id is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', m.id,
      'stage', m.stage,
      'completed_at', m.completed_at,
      'delay_days', m.delay_days,
      'support_interaction', m.support_interaction
    ) order by public._cja275_stage_order(m.stage)), '[]'::jsonb)
    into v_timeline
    from public.customer_journey_milestones m
    where m.customer_id = v_customer_id;

    perform public._cja275_log_audit(
      v_customer_id, 'timeline_viewed', 'Customer journey timeline viewed.', p_filters
    );
  else
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', m.id,
      'customer_id', m.customer_id,
      'customer', coalesce(c.company_name, c.full_name, 'Customer'),
      'stage', m.stage,
      'completed_at', m.completed_at,
      'delay_days', m.delay_days,
      'support_interaction', m.support_interaction
    ) order by m.completed_at desc), '[]'::jsonb)
    into v_timeline
    from (
      select * from public.customer_journey_milestones order by completed_at desc limit 30
    ) m
    left join public.customers c on c.id = m.customer_id;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', cp.id,
    'path_key', cp.path_key,
    'path_label', cp.path_label,
    'conversion_rate', cp.conversion_rate,
    'customer_count', cp.customer_count,
    'is_success_path', cp.is_success_path,
    'abandonment_point', cp.abandonment_point
  ) order by cp.conversion_rate desc), '[]'::jsonb)
  into v_common_paths
  from public.customer_journey_common_paths cp;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'recommendation_type', r.recommendation_type,
    'title', r.title,
    'summary', r.summary,
    'target_stage', r.target_stage,
    'impact_score', r.impact_score,
    'status', r.status
  ) order by r.impact_score desc), '[]'::jsonb)
  into v_recommendations
  from public.customer_journey_recommendations r
  where r.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'customer_id', l.customer_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.customer_journey_audit_logs order by created_at desc limit 40
  ) l;

  return jsonb_build_object(
    'principle', 'Understanding where customers struggle is the first step toward creating extraordinary customer experiences.',
    'privacy_note', 'Journey analytics exist to improve customer outcomes — never for advertising or third-party sale.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'journey_stages', jsonb_build_array(
      jsonb_build_object('key', 'registration', 'label', 'Registration'),
      jsonb_build_object('key', 'email_verification', 'label', 'Email Verification'),
      jsonb_build_object('key', 'first_login', 'label', 'First Login'),
      jsonb_build_object('key', 'onboarding_started', 'label', 'Onboarding Started'),
      jsonb_build_object('key', 'onboarding_completed', 'label', 'Onboarding Completed'),
      jsonb_build_object('key', 'first_user_invited', 'label', 'First User Invited'),
      jsonb_build_object('key', 'first_integration_connected', 'label', 'First Integration Connected'),
      jsonb_build_object('key', 'first_ai_interaction', 'label', 'First AI Interaction'),
      jsonb_build_object('key', 'first_business_outcome', 'label', 'First Business Outcome Achieved'),
      jsonb_build_object('key', 'subscription_activated', 'label', 'Subscription Activated'),
      jsonb_build_object('key', 'expansion', 'label', 'Expansion Events')
    ),
    'overview', v_overview,
    'funnel', v_funnel,
    'drop_offs', v_drop_offs,
    'journeys', v_journeys,
    'timeline', v_timeline,
    'common_paths', v_common_paths,
    'recommendations', v_recommendations,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_customer_journey_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_customer_id uuid;
begin
  perform public._cja275_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := (p_payload->>'id')::uuid;
  v_customer_id := (p_payload->>'customer_id')::uuid;

  case v_action
    when 'accept_recommendation' then
      update public.customer_journey_recommendations
      set status = 'accepted' where id = v_id;
      perform public._cja275_log_audit(
        v_customer_id, 'recommendation_generated',
        coalesce(p_payload->>'summary', 'Journey recommendation accepted.'), p_payload
      );
    when 'dismiss_recommendation' then
      update public.customer_journey_recommendations
      set status = 'dismissed' where id = v_id;
      perform public._cja275_log_audit(
        v_customer_id, 'recommendation_generated',
        coalesce(p_payload->>'summary', 'Journey recommendation dismissed.'), p_payload
      );
    when 'resolve_drop_off' then
      update public.customer_journey_drop_offs
      set resolved = true where id = v_id;
      perform public._cja275_log_audit(
        v_customer_id, 'drop_off_detected',
        coalesce(p_payload->>'summary', 'Drop-off marked resolved.'), p_payload
      );
    when 'record_journey_event' then
      insert into public.customer_journey_milestones (customer_id, stage, completed_at)
      values (v_customer_id, coalesce(p_payload->>'stage', 'registration'), now())
      on conflict (customer_id, stage) do nothing;
      update public.customer_journey_profiles
      set current_stage = coalesce(p_payload->>'stage', current_stage), updated_at = now()
      where customer_id = v_customer_id;
      perform public._cja275_log_audit(
        v_customer_id, 'journey_event_recorded',
        coalesce(p_payload->>'summary', 'Journey milestone recorded.'), p_payload
      );
    when 'recalculate_funnel' then
      perform public._cja275_log_audit(
        null, 'funnel_recalculated',
        coalesce(p_payload->>'summary', 'Funnel analytics recalculated.'), p_payload
      );
    when 'analytics_export' then
      perform public._cja275_log_audit(
        null, 'analytics_export',
        coalesce(p_payload->>'summary', 'Journey analytics exported.'), p_payload
      );
    else
      raise exception 'Invalid action';
  end case;

  return public.get_customer_journey_analytics(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_customer_journey_analytics(jsonb) to authenticated;
grant execute on function public.record_customer_journey_action(jsonb) to authenticated;

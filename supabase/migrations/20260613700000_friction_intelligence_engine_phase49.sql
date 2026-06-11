-- Phase 49 — Friction Intelligence Engine (FIE)

-- ---------------------------------------------------------------------------
-- 1. aipify_friction_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_friction_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in ('support', 'sales', 'process', 'team', 'customer', 'meeting', 'email', 'task')
  ),
  source_module text not null default 'fie',
  title text not null,
  description text not null default '',
  frequency_level text not null default 'medium' check (
    frequency_level in ('low', 'medium', 'high')
  ),
  impact_level text not null default 'medium' check (
    impact_level in ('low', 'medium', 'high')
  ),
  recommendation_text text not null default '',
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists aipify_friction_events_tenant_idx
  on public.aipify_friction_events (tenant_id, category, detected_at desc);

alter table public.aipify_friction_events enable row level security;
revoke all on public.aipify_friction_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_friction_scores
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_friction_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in ('support', 'sales', 'process', 'team', 'customer', 'meeting', 'email', 'task', 'overall')
  ),
  score_level text not null default 'low' check (
    score_level in ('low', 'moderate', 'elevated', 'high')
  ),
  explanation text not null default '',
  measurement_period text not null default 'daily',
  created_at timestamptz not null default now()
);

create index if not exists aipify_friction_scores_tenant_idx
  on public.aipify_friction_scores (tenant_id, category, created_at desc);

alter table public.aipify_friction_scores enable row level security;
revoke all on public.aipify_friction_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_friction_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_friction_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  friction_event_id uuid references public.aipify_friction_events (id) on delete set null,
  recommendation_type text not null default 'improvement',
  recommendation_text text not null,
  action_center_reference uuid,
  status text not null default 'active' check (
    status in ('active', 'accepted', 'dismissed', 'implemented')
  ),
  created_at timestamptz not null default now(),
  implemented_at timestamptz
);

create index if not exists aipify_friction_recommendations_tenant_idx
  on public.aipify_friction_recommendations (tenant_id, status, created_at desc);

alter table public.aipify_friction_recommendations enable row level security;
revoke all on public.aipify_friction_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._fie_tenant_plan(p_tenant_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;
$$;

create or replace function public._fie_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._fie_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._fie_enterprise_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._fie_tenant_plan(p_tenant_id) = 'enterprise';
$$;

create or replace function public._fie_score_from_signals(p_high integer, p_medium integer)
returns text
language sql
immutable
as $$
  select case
    when p_high >= 2 then 'high'
    when p_high >= 1 or p_medium >= 3 then 'elevated'
    when p_medium >= 1 then 'moderate'
    else 'low'
  end;
$$;

create or replace function public._fie_score_explanation(p_level text, p_category text)
returns text
language sql
immutable
as $$
  select case p_level
    when 'low' then format('Operational flow in %s appears relatively smooth.', p_category)
    when 'moderate' then format('Some recurring patterns in %s may benefit from review.', p_category)
    when 'elevated' then format('Several friction points in %s may be worth simplifying.', p_category)
    else format('Multiple friction signals in %s suggest improvement opportunities.', p_category)
  end;
$$;

-- ---------------------------------------------------------------------------
-- 5. detect_friction_for_tenant
-- ---------------------------------------------------------------------------
create or replace function public.detect_friction_for_tenant(p_tenant_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_count integer := 0;
  v_open_support integer := 0;
  v_pending_approvals integer := 0;
  v_failed_automation integer := 0;
  v_waiting_automation integer := 0;
  v_at_risk_goals integer := 0;
  v_event_id uuid;
  v_rec_id uuid;
  v_goal_title text;
  v_cat text;
  v_high integer;
  v_medium integer;
  v_level text;
  v_categories text[] := array['support','sales','process','customer','meeting','email','task'];
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then return 0; end if;
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  if public._fie_enterprise_allows(v_tenant_id) then
    v_categories := v_categories || array['team'];
  end if;

  select count(*) into v_open_support
  from public.support_cases sc
  where sc.tenant_id = v_tenant_id and sc.status in ('open', 'pending');

  select count(*) into v_pending_approvals
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status = 'pending_approval';

  select count(*) into v_failed_automation
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status in ('failed', 'blocked')
    and a.created_at > now() - interval '7 days';

  select count(*) into v_waiting_automation
  from public.aipify_actions a
  where a.tenant_id = v_tenant_id and a.status in ('pending_approval', 'approved');

  select count(*) into v_at_risk_goals
  from public.aipify_goals g
  where g.tenant_id = v_tenant_id
    and g.status in ('needs_attention', 'at_risk', 'behind_schedule');

  if v_open_support >= 5 then
    insert into public.aipify_friction_events (
      tenant_id, category, source_module, title, description,
      frequency_level, impact_level, recommendation_text
    )
    values (
      v_tenant_id, 'support', 'fie',
      'Repeated support patterns detected',
      'I have identified repeated support patterns that may benefit from process improvements.',
      case when v_open_support >= 10 then 'high' else 'medium' end,
      case when v_open_support >= 10 then 'high' else 'medium' end,
      'Consider FAQ articles, self-service guidance, or workflow review for common questions.'
    )
    returning id into v_event_id;

    insert into public.aipify_friction_recommendations (
      tenant_id, friction_event_id, recommendation_type, recommendation_text
    )
    values (
      v_tenant_id, v_event_id, 'faq',
      'Create or update FAQ content for frequently repeated support questions.'
    );
    v_count := v_count + 1;
  end if;

  if v_pending_approvals >= 3 then
    insert into public.aipify_friction_events (
      tenant_id, category, source_module, title, description,
      frequency_level, impact_level, recommendation_text
    )
    values (
      v_tenant_id, 'process', 'fie',
      'Approval delays in workflows',
      'This workflow may contain opportunities for simplification.',
      case when v_pending_approvals >= 8 then 'high' else 'medium' end,
      'medium',
      'Review approval chains and consider delegating routine approvals.'
    )
    returning id into v_event_id;

    insert into public.aipify_friction_recommendations (
      tenant_id, friction_event_id, recommendation_type, recommendation_text
    )
    values (
      v_tenant_id, v_event_id, 'workflow_review',
      'Schedule a process review to reduce unnecessary approval steps.'
    );
    v_count := v_count + 1;
  end if;

  if v_failed_automation >= 2 or v_waiting_automation >= 5 then
    insert into public.aipify_friction_events (
      tenant_id, category, source_module, title, description,
      frequency_level, impact_level, recommendation_text
    )
    values (
      v_tenant_id, 'task', 'fie',
      'Automation and task bottlenecks',
      'Several tasks appear to encounter similar obstacles.',
      'medium',
      case when v_failed_automation >= 3 then 'high' else 'medium' end,
      'Review failed automations and blocked actions in the Action Center.'
    )
    returning id into v_event_id;

    insert into public.aipify_friction_recommendations (
      tenant_id, friction_event_id, recommendation_type, recommendation_text
    )
    values (
      v_tenant_id, v_event_id, 'automation',
      'Configure or refine automation rules to reduce manual follow-up.'
    );
    v_count := v_count + 1;
  end if;

  if v_at_risk_goals > 0 then
    for v_goal_title, v_cat in
      select g.title, g.category
      from public.aipify_goals g
      where g.tenant_id = v_tenant_id
        and g.status in ('needs_attention', 'at_risk', 'behind_schedule')
      limit 3
    loop
      insert into public.aipify_friction_events (
        tenant_id, category, source_module, title, description,
        frequency_level, impact_level, recommendation_text
      )
      values (
        v_tenant_id,
        case v_cat
          when 'support' then 'support'
          when 'sales' then 'sales'
          when 'operations' then 'process'
          else 'process'
        end,
        'sge',
        format('Friction affecting goal: %s', v_goal_title),
        'Recurring inefficiencies may be contributing to goal progress challenges.',
        'medium', 'medium',
        format('Prioritize improvements that support the active goal: %s', v_goal_title)
      )
      returning id into v_event_id;

      insert into public.aipify_friction_recommendations (
        tenant_id, friction_event_id, recommendation_type, recommendation_text
      )
      values (
        v_tenant_id, v_event_id, 'goal_alignment',
        format('This recommendation supports your objective: %s', v_goal_title)
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if exists (
    select 1 from public.aipify_business_pulse_snapshots s
    where s.tenant_id = v_tenant_id
      and s.support_status in ('needs_attention', 'requires_action')
      and s.pulse_date >= current_date - 3
  ) then
    insert into public.aipify_friction_events (
      tenant_id, category, source_module, title, description,
      frequency_level, impact_level, recommendation_text
    )
    values (
      v_tenant_id, 'support', 'bpe',
      'Support pulse indicates recurring friction',
      'Business Pulse detected changes that may reflect underlying support friction.',
      'high', 'medium',
      'Review support queue patterns and identify root causes of increased volume.'
    )
    returning id into v_event_id;

    insert into public.aipify_friction_recommendations (
      tenant_id, friction_event_id, recommendation_type, recommendation_text
    )
    values (
      v_tenant_id, v_event_id, 'process_review',
      'Review support workflow and identify recurring question patterns.'
    );
    v_count := v_count + 1;
  end if;

  if public._fie_enterprise_allows(v_tenant_id) and (v_open_support + v_pending_approvals) >= 8 then
    insert into public.aipify_friction_events (
      tenant_id, category, source_module, title, description,
      frequency_level, impact_level, recommendation_text
    )
    values (
      v_tenant_id, 'team', 'fie',
      'Workflow area experiencing repeated delays',
      'One area of the workflow appears to experience repeated delays.',
      'medium', 'medium',
      'Review aggregated workload distribution and consider rebalancing support.'
    );
    v_count := v_count + 1;
  end if;

  foreach v_cat in array v_categories loop
    select
      count(*) filter (where e.impact_level = 'high'),
      count(*) filter (where e.impact_level = 'medium')
    into v_high, v_medium
    from public.aipify_friction_events e
    where e.tenant_id = v_tenant_id
      and e.category = v_cat
      and e.detected_at > now() - interval '30 days'
      and e.resolved_at is null;

    v_level := public._fie_score_from_signals(coalesce(v_high, 0), coalesce(v_medium, 0));

    insert into public.aipify_friction_scores (
      tenant_id, category, score_level, explanation, measurement_period
    )
    values (
      v_tenant_id, v_cat, v_level,
      public._fie_score_explanation(v_level, v_cat),
      'daily'
    );
  end loop;

  select
    count(*) filter (where e.impact_level = 'high'),
    count(*) filter (where e.impact_level = 'medium')
  into v_high, v_medium
  from public.aipify_friction_events e
  where e.tenant_id = v_tenant_id
    and e.detected_at > now() - interval '30 days'
    and e.resolved_at is null;

  v_level := public._fie_score_from_signals(coalesce(v_high, 0), coalesce(v_medium, 0));

  insert into public.aipify_friction_scores (
    tenant_id, category, score_level, explanation, measurement_period
  )
  values (
    v_tenant_id, 'overall', v_level,
    'Overall operational friction based on detected patterns across connected systems.',
    'daily'
  );

  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. get_customer_friction_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_friction_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_enterprise boolean;
  v_overall text := 'low';
  v_briefing text;
  v_cards jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._fie_tenant_plan(v_tenant_id);
  v_enterprise := v_plan = 'enterprise';

  if not public._fie_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Friction Intelligence identifies improvement opportunities without employee surveillance.'
    );
  end if;

  if not exists (
    select 1 from public.aipify_friction_scores s
    where s.tenant_id = v_tenant_id and s.created_at::date = current_date
  ) then
    perform public.detect_friction_for_tenant(v_tenant_id);
  end if;

  select s.score_level into v_overall
  from public.aipify_friction_scores s
  where s.tenant_id = v_tenant_id and s.category = 'overall'
  order by s.created_at desc
  limit 1;

  v_briefing := case v_overall
    when 'low' then 'Operational flow appears relatively smooth. A few small improvements may still be worthwhile.'
    when 'moderate' then 'Some recurring patterns may benefit from review. Improvement opportunities are available.'
    when 'elevated' then 'Several friction points have been identified that may be worth simplifying.'
    else 'Multiple friction signals suggest meaningful improvement opportunities across operations.'
  end;

  v_cards := coalesce(
    (select jsonb_agg(jsonb_build_object(
      'category', s.category,
      'score_level', s.score_level,
      'explanation', s.explanation,
      'trend', 'stable',
      'event_count', (
        select count(*) from public.aipify_friction_events e
        where e.tenant_id = v_tenant_id and e.category = s.category
          and e.resolved_at is null
          and e.detected_at > now() - interval '30 days'
      )
    ) order by
      case s.score_level when 'high' then 1 when 'elevated' then 2 when 'moderate' then 3 else 4 end)
    from (
      select distinct on (category) *
      from public.aipify_friction_scores
      where tenant_id = v_tenant_id and category != 'overall'
      order by category, created_at desc
    ) s
    where s.category != 'team' or v_enterprise),
    '[]'::jsonb
  );

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'enterprise_features', v_enterprise,
    'overall_score_level', coalesce(v_overall, 'low'),
    'briefing', v_briefing,
    'category_cards', v_cards,
    'events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'category', e.category, 'source_module', e.source_module,
        'title', e.title, 'description', e.description,
        'frequency_level', e.frequency_level, 'impact_level', e.impact_level,
        'recommendation_text', e.recommendation_text, 'detected_at', e.detected_at
      ) order by e.detected_at desc)
      from public.aipify_friction_events e
      where e.tenant_id = v_tenant_id and e.resolved_at is null
      limit 20),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'friction_event_id', r.friction_event_id,
        'recommendation_type', r.recommendation_type,
        'recommendation_text', r.recommendation_text,
        'status', r.status, 'action_center_reference', r.action_center_reference,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.aipify_friction_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'active'
      limit 15),
      '[]'::jsonb
    ),
    'history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'category', s.category, 'score_level', s.score_level,
        'explanation', s.explanation, 'created_at', s.created_at
      ) order by s.created_at desc)
      from public.aipify_friction_scores s
      where s.tenant_id = v_tenant_id
      limit 30),
      '[]'::jsonb
    ),
    'privacy_note', 'Friction data is aggregated and tenant-isolated. Never used for employee ranking or hidden surveillance.'
  );
end;
$$;

create or replace function public.get_friction_history()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  return jsonb_build_object(
    'history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'category', s.category, 'score_level', s.score_level,
        'explanation', s.explanation, 'measurement_period', s.measurement_period,
        'created_at', s.created_at
      ) order by s.created_at desc)
      from public.aipify_friction_scores s
      where s.tenant_id = v_tenant_id
      limit 60),
      '[]'::jsonb
    ),
    'events', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'category', e.category, 'title', e.title,
        'description', e.description, 'detected_at', e.detected_at,
        'resolved_at', e.resolved_at
      ) order by e.detected_at desc)
      from public.aipify_friction_events e
      where e.tenant_id = v_tenant_id
      limit 40),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.get_friction_recommendations()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', r.id, 'friction_event_id', r.friction_event_id,
      'recommendation_type', r.recommendation_type,
      'recommendation_text', r.recommendation_text,
      'status', r.status, 'action_center_reference', r.action_center_reference,
      'created_at', r.created_at
    ) order by r.created_at desc)
    from public.aipify_friction_recommendations r
    where r.tenant_id = v_tenant_id and r.status in ('active', 'accepted')
    limit 25),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.get_friction_scores()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'category', s.category, 'score_level', s.score_level,
      'explanation', s.explanation, 'measurement_period', s.measurement_period,
      'created_at', s.created_at
    ) order by s.created_at desc)
    from (
      select distinct on (category) *
      from public.aipify_friction_scores
      where tenant_id = v_tenant_id
      order by category, created_at desc
    ) s),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.accept_friction_recommendation(p_recommendation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  update public.aipify_friction_recommendations
  set status = 'accepted'
  where id = p_recommendation_id and tenant_id = v_tenant_id and status = 'active';

  return jsonb_build_object('accepted', true);
end;
$$;

create or replace function public.dismiss_friction_recommendation(p_recommendation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  update public.aipify_friction_recommendations
  set status = 'dismissed'
  where id = p_recommendation_id and tenant_id = v_tenant_id and status in ('active', 'accepted');

  return jsonb_build_object('dismissed', true);
end;
$$;

create or replace function public.send_friction_to_action_center(p_recommendation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_rec public.aipify_friction_recommendations;
  v_event public.aipify_friction_events;
  v_action_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._fie_package_allows(v_tenant_id) then
    raise exception 'Friction Intelligence requires Business Pro or Enterprise';
  end if;

  select * into v_rec
  from public.aipify_friction_recommendations r
  where r.id = p_recommendation_id and r.tenant_id = v_tenant_id;

  if v_rec.id is null then raise exception 'Recommendation not found'; end if;

  select * into v_event
  from public.aipify_friction_events e
  where e.id = v_rec.friction_event_id;

  v_action_id := public.create_aipify_action(
    coalesce(v_rec.recommendation_type, 'process_review'),
    coalesce(v_event.title, 'Friction improvement'),
    v_rec.recommendation_text,
    jsonb_build_object('friction_recommendation_id', v_rec.id, 'friction_event_id', v_rec.friction_event_id),
    v_rec.recommendation_text,
    'low',
    'assistant',
    'fie',
    true,
    'Operational simplification opportunity'
  );

  update public.aipify_friction_recommendations
  set status = 'accepted', action_center_reference = v_action_id
  where id = p_recommendation_id;

  return jsonb_build_object('action_id', v_action_id, 'sent', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_friction_center() to authenticated;
grant execute on function public.get_friction_history() to authenticated;
grant execute on function public.get_friction_recommendations() to authenticated;
grant execute on function public.get_friction_scores() to authenticated;
grant execute on function public.detect_friction_for_tenant(uuid) to authenticated;
grant execute on function public.accept_friction_recommendation(uuid) to authenticated;
grant execute on function public.dismiss_friction_recommendation(uuid) to authenticated;
grant execute on function public.send_friction_to_action_center(uuid) to authenticated;

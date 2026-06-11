-- Phase 48 — Strategic Goal Engine (SGE)

-- ---------------------------------------------------------------------------
-- 1. aipify_goals
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_goals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'custom' check (
    category in ('sales', 'support', 'operations', 'marketing', 'hr', 'custom')
  ),
  status text not null default 'not_started' check (
    status in (
      'not_started', 'on_track', 'needs_attention', 'at_risk',
      'behind_schedule', 'completed', 'archived'
    )
  ),
  priority text not null default 'standard' check (
    priority in ('critical', 'high', 'standard', 'low')
  ),
  owner_user_id uuid,
  parent_goal_id uuid references public.aipify_goals (id) on delete set null,
  baseline_value numeric not null default 0,
  target_value numeric not null default 100,
  current_value numeric not null default 0,
  measurement_unit text not null default '',
  start_date date not null default current_date,
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_goals_tenant_idx
  on public.aipify_goals (tenant_id, status, priority);

create index if not exists aipify_goals_parent_idx
  on public.aipify_goals (tenant_id, parent_goal_id);

alter table public.aipify_goals enable row level security;
revoke all on public.aipify_goals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_goal_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_goal_milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.aipify_goals (id) on delete cascade,
  milestone_name text not null,
  target_value numeric not null default 0,
  achieved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists aipify_goal_milestones_goal_idx
  on public.aipify_goal_milestones (goal_id, target_value);

alter table public.aipify_goal_milestones enable row level security;
revoke all on public.aipify_goal_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_goal_activity
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_goal_activity (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.aipify_goals (id) on delete cascade,
  activity_type text not null default 'update',
  activity_description text not null default '',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists aipify_goal_activity_goal_idx
  on public.aipify_goal_activity (goal_id, created_at desc);

alter table public.aipify_goal_activity enable row level security;
revoke all on public.aipify_goal_activity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._sge_tenant_plan(p_tenant_id uuid)
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

create or replace function public._sge_package_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._sge_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._sge_enterprise_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._sge_tenant_plan(p_tenant_id) = 'enterprise';
$$;

create or replace function public._sge_require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select u.role into v_role
  from public.users u
  where u.id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Strategic goal changes require owner or admin role';
  end if;
end;
$$;

create or replace function public._sge_goal_direction(
  p_baseline numeric,
  p_target numeric
)
returns text
language sql
immutable
as $$
  select case when p_target < p_baseline then 'decrease' else 'increase' end;
$$;

create or replace function public._sge_goal_progress_percent(
  p_baseline numeric,
  p_current numeric,
  p_target numeric
)
returns numeric
language plpgsql
immutable
as $$
declare
  v_range numeric;
  v_delta numeric;
begin
  if p_target = p_baseline then
    return case when p_current >= p_target then 100 else 0 end;
  end if;

  v_range := p_target - p_baseline;
  v_delta := p_current - p_baseline;

  if public._sge_goal_direction(p_baseline, p_target) = 'decrease' then
    v_delta := p_baseline - p_current;
    v_range := p_baseline - p_target;
  end if;

  return greatest(0, least(100, round((v_delta / nullif(v_range, 0)) * 100, 1)));
end;
$$;

create or replace function public._sge_expected_progress_percent(
  p_start_date date,
  p_target_date date
)
returns numeric
language plpgsql
stable
as $$
declare
  v_total numeric;
  v_elapsed numeric;
begin
  if p_target_date is null or p_target_date <= p_start_date then
    return 100;
  end if;

  v_total := greatest(1, p_target_date - p_start_date);
  v_elapsed := greatest(0, current_date - p_start_date);

  return least(100, round((v_elapsed / v_total) * 100, 1));
end;
$$;

create or replace function public._sge_pulse_status_for_category(
  p_tenant_id uuid,
  p_category text
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_snapshot public.aipify_business_pulse_snapshots;
  v_status text := 'normal';
begin
  select * into v_snapshot
  from public.aipify_business_pulse_snapshots s
  where s.tenant_id = p_tenant_id
  order by s.pulse_date desc
  limit 1;

  if v_snapshot.id is null then
    return 'normal';
  end if;

  v_status := case p_category
    when 'support' then v_snapshot.support_status
    when 'sales' then v_snapshot.sales_status
    when 'operations' then v_snapshot.operations_status
    else 'normal'
  end;

  return coalesce(v_status, 'normal');
end;
$$;

create or replace function public._sge_evaluate_goal_status(
  p_goal public.aipify_goals,
  p_pulse_status text default 'normal'
)
returns text
language plpgsql
stable
as $$
declare
  v_progress numeric;
  v_expected numeric;
  v_gap numeric;
begin
  if p_goal.status = 'archived' then
    return 'archived';
  end if;

  v_progress := public._sge_goal_progress_percent(
    p_goal.baseline_value, p_goal.current_value, p_goal.target_value
  );

  if v_progress >= 100 or (p_goal.completed_at is not null) then
    return 'completed';
  end if;

  if current_date < p_goal.start_date then
    return 'not_started';
  end if;

  v_expected := public._sge_expected_progress_percent(p_goal.start_date, p_goal.target_date);
  v_gap := v_expected - v_progress;

  if p_goal.target_date is not null and current_date > p_goal.target_date and v_progress < 100 then
    return 'behind_schedule';
  end if;

  if v_gap >= 35 or p_pulse_status in ('requires_action') then
    return 'at_risk';
  end if;

  if v_gap >= 20 or p_pulse_status in ('needs_attention') then
    return 'needs_attention';
  end if;

  if v_gap >= 10 or p_pulse_status in ('worth_reviewing') then
    return 'needs_attention';
  end if;

  return 'on_track';
end;
$$;

create or replace function public._sge_goal_health_explanation(
  p_status text
)
returns text
language sql
immutable
as $$
  select case p_status
    when 'on_track' then 'This goal is progressing as expected.'
    when 'needs_attention' then 'This goal may benefit from additional attention.'
    when 'at_risk' then 'This objective may require additional attention if current trends continue.'
    when 'behind_schedule' then 'This goal is behind the expected timeline.'
    when 'not_started' then 'This goal has not started yet.'
    when 'completed' then 'This milestone has been achieved.'
    else 'Goal status is being evaluated.'
  end;
$$;

create or replace function public._sge_goal_to_json(p_goal public.aipify_goals)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pulse text;
  v_status text;
  v_progress numeric;
begin
  v_pulse := public._sge_pulse_status_for_category(p_goal.tenant_id, p_goal.category);
  v_status := public._sge_evaluate_goal_status(p_goal, v_pulse);
  v_progress := public._sge_goal_progress_percent(
    p_goal.baseline_value, p_goal.current_value, p_goal.target_value
  );

  return jsonb_build_object(
    'id', p_goal.id,
    'title', p_goal.title,
    'description', p_goal.description,
    'category', p_goal.category,
    'status', v_status,
    'priority', p_goal.priority,
    'owner_user_id', p_goal.owner_user_id,
    'parent_goal_id', p_goal.parent_goal_id,
    'baseline_value', p_goal.baseline_value,
    'target_value', p_goal.target_value,
    'current_value', p_goal.current_value,
    'measurement_unit', p_goal.measurement_unit,
    'progress_percent', v_progress,
    'start_date', p_goal.start_date,
    'target_date', p_goal.target_date,
    'completed_at', p_goal.completed_at,
    'health_explanation', public._sge_goal_health_explanation(v_status),
    'pulse_influence', v_pulse,
    'created_at', p_goal.created_at,
    'updated_at', p_goal.updated_at
  );
end;
$$;

create or replace function public.refresh_strategic_goals_health(p_tenant_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_goal public.aipify_goals;
  v_pulse text;
  v_status text;
  v_count integer := 0;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then return 0; end if;

  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  for v_goal in
    select * from public.aipify_goals g
    where g.tenant_id = v_tenant_id and g.status not in ('archived', 'completed')
  loop
    v_pulse := public._sge_pulse_status_for_category(v_tenant_id, v_goal.category);
    v_status := public._sge_evaluate_goal_status(v_goal, v_pulse);

    update public.aipify_goals
    set status = v_status,
        completed_at = case when v_status = 'completed' and completed_at is null then now() else completed_at end,
        updated_at = now()
    where id = v_goal.id;

    update public.aipify_goal_milestones m
    set achieved_at = case
      when achieved_at is null and public._sge_goal_progress_percent(
        v_goal.baseline_value, v_goal.current_value, v_goal.target_value
      ) >= m.target_value then now()
      else achieved_at
    end
    where m.goal_id = v_goal.id;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. get_customer_strategic_goals_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_strategic_goals_center()
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
  v_active jsonb;
  v_at_risk jsonb;
  v_completed jsonb;
  v_milestones jsonb;
  v_timeline jsonb;
  v_recommended jsonb;
  v_on_track integer := 0;
  v_attention integer := 0;
  v_briefing text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._sge_tenant_plan(v_tenant_id);
  v_enterprise := v_plan = 'enterprise';

  if not public._sge_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Strategic goals are tenant-isolated. Aipify never scores employees invisibly.'
    );
  end if;

  perform public.refresh_strategic_goals_health(v_tenant_id);

  select count(*) filter (where g.status = 'on_track'),
         count(*) filter (where g.status in ('needs_attention', 'at_risk', 'behind_schedule'))
  into v_on_track, v_attention
  from public.aipify_goals g
  where g.tenant_id = v_tenant_id and g.status not in ('archived', 'completed');

  if v_attention > 0 then
    v_briefing := format(
      '%s active goal(s) remain on track. %s goal(s) may benefit from additional focus based on recent progress and pulse signals.',
      v_on_track, v_attention
    );
  elsif v_on_track > 0 then
    v_briefing := format('%s active goal(s) remain on track.', v_on_track);
  else
    v_briefing := 'Define strategic goals to align daily work with what matters most.';
  end if;

  v_active := coalesce(
    (select jsonb_agg(public._sge_goal_to_json(g.*) order by
      case g.priority when 'critical' then 1 when 'high' then 2 when 'standard' then 3 else 4 end,
      g.target_date nulls last)
    from public.aipify_goals g
    where g.tenant_id = v_tenant_id and g.status not in ('archived', 'completed')),
    '[]'::jsonb
  );

  v_at_risk := coalesce(
    (select jsonb_agg(public._sge_goal_to_json(g.*) order by g.target_date nulls last)
    from public.aipify_goals g
    where g.tenant_id = v_tenant_id
      and g.status in ('needs_attention', 'at_risk', 'behind_schedule')),
    '[]'::jsonb
  );

  v_completed := coalesce(
    (select jsonb_agg(public._sge_goal_to_json(g.*) order by g.completed_at desc nulls last)
    from public.aipify_goals g
    where g.tenant_id = v_tenant_id and g.status = 'completed'
    limit 10),
    '[]'::jsonb
  );

  v_milestones := coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', m.id, 'goal_id', m.goal_id, 'goal_title', g.title,
      'milestone_name', m.milestone_name, 'target_value', m.target_value,
      'achieved_at', m.achieved_at
    ) order by m.achieved_at nulls first, m.target_value)
    from public.aipify_goal_milestones m
    join public.aipify_goals g on g.id = m.goal_id
    where g.tenant_id = v_tenant_id and g.status not in ('archived')
      and m.achieved_at is null
    limit 12),
    '[]'::jsonb
  );

  v_timeline := coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', a.id, 'goal_id', a.goal_id, 'goal_title', g.title,
      'activity_type', a.activity_type, 'activity_description', a.activity_description,
      'created_by', a.created_by, 'created_at', a.created_at
    ) order by a.created_at desc)
    from public.aipify_goal_activity a
    join public.aipify_goals g on g.id = a.goal_id
    where g.tenant_id = v_tenant_id
    limit 20),
    '[]'::jsonb
  );

  v_recommended := coalesce(
    (select jsonb_agg(jsonb_build_object(
      'goal_id', g.id,
      'goal_title', g.title,
      'recommendation', public._sge_goal_health_explanation(public._sge_evaluate_goal_status(
        g, public._sge_pulse_status_for_category(v_tenant_id, g.category)
      )),
      'action_center_hint', format('Supports Goal: %s', g.title)
    ) order by
      case g.priority when 'critical' then 1 when 'high' then 2 when 'standard' then 3 else 4 end)
    from public.aipify_goals g
    where g.tenant_id = v_tenant_id
      and g.status in ('needs_attention', 'at_risk', 'behind_schedule')
    limit 8),
    '[]'::jsonb
  );

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'enterprise_features', v_enterprise,
    'briefing', v_briefing,
    'active_goals', v_active,
    'goals_at_risk', v_at_risk,
    'completed_goals', v_completed,
    'upcoming_milestones', v_milestones,
    'goal_timeline', v_timeline,
    'recommended_actions', v_recommended,
    'health_summary', jsonb_build_object(
      'on_track', v_on_track,
      'needs_attention', v_attention,
      'total_active', v_on_track + v_attention
    ),
    'privacy_note', 'Strategic goals are tenant-isolated. Department goals respect permissions. No hidden employee scoring.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. CRUD RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_strategic_goal(p_goal_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_goal public.aipify_goals;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  select * into v_goal
  from public.aipify_goals g
  where g.id = p_goal_id and g.tenant_id = v_tenant_id;

  if v_goal.id is null then
    raise exception 'Goal not found';
  end if;

  return jsonb_build_object(
    'goal', public._sge_goal_to_json(v_goal.*),
    'milestones', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'milestone_name', m.milestone_name,
        'target_value', m.target_value, 'achieved_at', m.achieved_at, 'created_at', m.created_at
      ) order by m.target_value)
      from public.aipify_goal_milestones m where m.goal_id = v_goal.id),
      '[]'::jsonb
    ),
    'activity', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'activity_type', a.activity_type,
        'activity_description', a.activity_description,
        'created_by', a.created_by, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_goal_activity a where a.goal_id = v_goal.id limit 30),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.create_strategic_goal(
  p_title text,
  p_description text default '',
  p_category text default 'custom',
  p_priority text default 'standard',
  p_owner_user_id uuid default null,
  p_parent_goal_id uuid default null,
  p_baseline_value numeric default 0,
  p_target_value numeric default 100,
  p_current_value numeric default null,
  p_measurement_unit text default '',
  p_start_date date default current_date,
  p_target_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_goal_id uuid;
  v_current numeric;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  perform public._sge_require_admin();

  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  if p_parent_goal_id is not null and not public._sge_enterprise_allows(v_tenant_id) then
    raise exception 'Goal hierarchy requires Enterprise';
  end if;

  v_current := coalesce(p_current_value, p_baseline_value);

  insert into public.aipify_goals (
    tenant_id, title, description, category, status, priority,
    owner_user_id, parent_goal_id, baseline_value, target_value,
    current_value, measurement_unit, start_date, target_date
  )
  values (
    v_tenant_id, p_title, coalesce(p_description, ''), p_category, 'not_started',
    coalesce(p_priority, 'standard'), p_owner_user_id, p_parent_goal_id,
    coalesce(p_baseline_value, 0), coalesce(p_target_value, 100),
    v_current, coalesce(p_measurement_unit, ''), coalesce(p_start_date, current_date),
    p_target_date
  )
  returning id into v_goal_id;

  insert into public.aipify_goal_milestones (goal_id, milestone_name, target_value)
  values
    (v_goal_id, '25%', 25),
    (v_goal_id, '50%', 50),
    (v_goal_id, '75%', 75),
    (v_goal_id, '100%', 100);

  insert into public.aipify_goal_activity (goal_id, activity_type, activity_description, created_by)
  values (v_goal_id, 'created', format('Goal created: %s', p_title), auth.uid()::text);

  perform public.refresh_strategic_goals_health(v_tenant_id);

  return public.get_strategic_goal(v_goal_id);
end;
$$;

create or replace function public.update_strategic_goal(
  p_goal_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_priority text default null,
  p_status text default null,
  p_owner_user_id uuid default null,
  p_parent_goal_id uuid default null,
  p_baseline_value numeric default null,
  p_target_value numeric default null,
  p_current_value numeric default null,
  p_measurement_unit text default null,
  p_start_date date default null,
  p_target_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_goal public.aipify_goals;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  perform public._sge_require_admin();

  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  select * into v_goal
  from public.aipify_goals g
  where g.id = p_goal_id and g.tenant_id = v_tenant_id;

  if v_goal.id is null then raise exception 'Goal not found'; end if;

  if p_parent_goal_id is not null and not public._sge_enterprise_allows(v_tenant_id) then
    raise exception 'Goal hierarchy requires Enterprise';
  end if;

  update public.aipify_goals
  set title = coalesce(p_title, title),
      description = coalesce(p_description, description),
      category = coalesce(p_category, category),
      priority = coalesce(p_priority, priority),
      status = coalesce(p_status, status),
      owner_user_id = coalesce(p_owner_user_id, owner_user_id),
      parent_goal_id = coalesce(p_parent_goal_id, parent_goal_id),
      baseline_value = coalesce(p_baseline_value, baseline_value),
      target_value = coalesce(p_target_value, target_value),
      current_value = coalesce(p_current_value, current_value),
      measurement_unit = coalesce(p_measurement_unit, measurement_unit),
      start_date = coalesce(p_start_date, start_date),
      target_date = coalesce(p_target_date, target_date),
      updated_at = now()
  where id = p_goal_id;

  insert into public.aipify_goal_activity (goal_id, activity_type, activity_description, created_by)
  values (p_goal_id, 'updated', 'Goal details were updated.', auth.uid()::text);

  perform public.refresh_strategic_goals_health(v_tenant_id);

  return public.get_strategic_goal(p_goal_id);
end;
$$;

create or replace function public.archive_strategic_goal(p_goal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  perform public._sge_require_admin();

  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  update public.aipify_goals
  set status = 'archived', updated_at = now()
  where id = p_goal_id and tenant_id = v_tenant_id;

  insert into public.aipify_goal_activity (goal_id, activity_type, activity_description, created_by)
  values (p_goal_id, 'archived', 'Goal was archived.', auth.uid()::text);

  return jsonb_build_object('archived', true, 'goal_id', p_goal_id);
end;
$$;

create or replace function public.delete_strategic_goal(p_goal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  perform public._sge_require_admin();

  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  delete from public.aipify_goals
  where id = p_goal_id and tenant_id = v_tenant_id;

  return jsonb_build_object('deleted', true, 'goal_id', p_goal_id);
end;
$$;

create or replace function public.get_strategic_goal_progress(p_goal_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_goal public.aipify_goals;
  v_pulse text;
  v_status text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._sge_package_allows(v_tenant_id) then
    raise exception 'Strategic Goal Engine requires Business Pro or Enterprise';
  end if;

  select * into v_goal
  from public.aipify_goals g
  where g.id = p_goal_id and g.tenant_id = v_tenant_id;

  if v_goal.id is null then raise exception 'Goal not found'; end if;

  v_pulse := public._sge_pulse_status_for_category(v_tenant_id, v_goal.category);
  v_status := public._sge_evaluate_goal_status(v_goal, v_pulse);

  return jsonb_build_object(
    'goal_id', v_goal.id,
    'progress_percent', public._sge_goal_progress_percent(
      v_goal.baseline_value, v_goal.current_value, v_goal.target_value
    ),
    'expected_progress_percent', public._sge_expected_progress_percent(v_goal.start_date, v_goal.target_date),
    'current_value', v_goal.current_value,
    'target_value', v_goal.target_value,
    'baseline_value', v_goal.baseline_value,
    'status', v_status,
    'health_explanation', public._sge_goal_health_explanation(v_status),
    'pulse_influence', v_pulse
  );
end;
$$;

create or replace function public.get_strategic_goals_briefing()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_center jsonb;
begin
  v_center := public.get_customer_strategic_goals_center();
  return jsonb_build_object(
    'briefing', v_center->'briefing',
    'health_summary', v_center->'health_summary',
    'goals_at_risk', v_center->'goals_at_risk',
    'recommended_actions', v_center->'recommended_actions'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_strategic_goals_center() to authenticated;
grant execute on function public.get_strategic_goal(uuid) to authenticated;
grant execute on function public.create_strategic_goal(
  text, text, text, text, uuid, uuid, numeric, numeric, numeric, text, date, date
) to authenticated;
grant execute on function public.update_strategic_goal(
  uuid, text, text, text, text, text, uuid, uuid, numeric, numeric, numeric, text, date, date
) to authenticated;
grant execute on function public.archive_strategic_goal(uuid) to authenticated;
grant execute on function public.delete_strategic_goal(uuid) to authenticated;
grant execute on function public.get_strategic_goal_progress(uuid) to authenticated;
grant execute on function public.get_strategic_goals_briefing() to authenticated;
grant execute on function public.refresh_strategic_goals_health(uuid) to authenticated;

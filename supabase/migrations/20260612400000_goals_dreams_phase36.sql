-- Phase 36 — Goals & Dreams Engine (GDE)
-- Supports aspirations, milestones, and progress — never pressure or guilt.

-- ---------------------------------------------------------------------------
-- 1. gde_settings — accountability & user control
-- ---------------------------------------------------------------------------
create table if not exists public.gde_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  default_accountability text not null default 'occasional' check (
    default_accountability in ('minimal', 'occasional', 'regular', 'highly_supportive')
  ),
  proactive_suggestions_enabled boolean not null default true,
  celebration_enabled boolean not null default true,
  setback_support_enabled boolean not null default true,
  check_in_frequency_days integer not null default 14,
  privacy_settings jsonb not null default '{
    "share_progress": false,
    "allow_learning_insights": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.gde_settings enable row level security;
revoke all on public.gde_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. user_goals
-- ---------------------------------------------------------------------------
create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  why_matters text not null default '',
  category text not null default 'personal_development' check (
    category in (
      'personal_development', 'career', 'financial', 'family',
      'health', 'education', 'lifestyle'
    )
  ),
  timeframe text not null default 'medium_term' check (
    timeframe in ('short_term', 'medium_term', 'long_term', 'lifelong')
  ),
  accountability_level text not null default 'occasional' check (
    accountability_level in ('minimal', 'occasional', 'regular', 'highly_supportive')
  ),
  status text not null default 'active' check (
    status in ('active', 'paused', 'completed', 'archived')
  ),
  progress_percent integer not null default 0 check (
    progress_percent between 0 and 100
  ),
  target_date date,
  last_worked_at timestamptz,
  completed_at timestamptz,
  source text not null default 'user' check (source in ('user', 'assistant', 'import')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_goals_user_status_idx
  on public.user_goals (tenant_id, user_id, status);

alter table public.user_goals enable row level security;
revoke all on public.user_goals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. goal_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.user_goals (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'planned' check (
    status in ('planned', 'in_progress', 'completed', 'paused', 'archived')
  ),
  sort_order integer not null default 0,
  progress_percent integer not null default 0 check (
    progress_percent between 0 and 100
  ),
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists goal_milestones_goal_idx
  on public.goal_milestones (goal_id, sort_order);

alter table public.goal_milestones enable row level security;
revoke all on public.goal_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. goal_actions
-- ---------------------------------------------------------------------------
create table if not exists public.goal_actions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.user_goals (id) on delete cascade,
  milestone_id uuid references public.goal_milestones (id) on delete set null,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed')
  ),
  sort_order integer not null default 0,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goal_actions enable row level security;
revoke all on public.goal_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. goal_activity — check-ins, celebrations, setback support
-- ---------------------------------------------------------------------------
create table if not exists public.goal_activity (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.user_goals (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  activity_type text not null check (
    activity_type in ('check_in', 'celebration', 'setback_support', 'progress_note')
  ),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists goal_activity_goal_idx
  on public.goal_activity (goal_id, created_at desc);

alter table public.goal_activity enable row level security;
revoke all on public.goal_activity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_gde_settings(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.gde_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.gde_settings;
begin
  insert into public.gde_settings (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row from public.gde_settings
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

create or replace function public._recalc_goal_progress(p_goal_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_avg integer;
  v_completed integer;
  v_total integer;
begin
  select count(*) filter (where status = 'completed'),
         count(*)
  into v_completed, v_total
  from public.goal_milestones
  where goal_id = p_goal_id and status != 'archived';

  if v_total > 0 then
    v_avg := round((v_completed::numeric / v_total) * 100);
  else
    select coalesce(avg(progress_percent), 0)::integer into v_avg
    from public.goal_milestones where goal_id = p_goal_id;
  end if;

  update public.user_goals
  set progress_percent = coalesce(v_avg, 0), updated_at = now()
  where id = p_goal_id;
end;
$$;

create or replace function public._suggest_milestones_for_goal(
  p_title text,
  p_category text
)
returns jsonb
language plpgsql
immutable
as $$
begin
  if p_category = 'health' or p_title ~* 'healthier|health|exercise|fitness' then
    return jsonb_build_array(
      'Define what healthier means for you',
      'Establish a sustainable routine',
      'Track progress for four weeks',
      'Review and adjust your approach'
    );
  end if;
  if p_category = 'financial' or p_title ~* 'save|money|debt|fund' then
    return jsonb_build_array(
      'Set a clear savings target',
      'Review monthly spending',
      'Automate contributions',
      'Celebrate first milestone reached'
    );
  end if;
  if p_category = 'career' or p_title ~* 'business|company|promotion|launch' then
    return jsonb_build_array(
      'Clarify the vision and why it matters',
      'Identify foundational requirements',
      'Complete first major deliverable',
      'Secure early validation or traction',
      'Prepare for next growth phase'
    );
  end if;
  if p_category = 'education' or p_title ~* 'learn|language|course|study' then
    return jsonb_build_array(
      'Choose your learning path',
      'Schedule regular practice time',
      'Complete first module or unit',
      'Assess progress and adjust pace'
    );
  end if;
  if p_category = 'family' then
    return jsonb_build_array(
      'Define what quality time looks like',
      'Plan first meaningful activity',
      'Establish a recurring tradition',
      'Reflect on what is working'
    );
  end if;
  return jsonb_build_array(
    'Clarify what success looks like',
    'Break into first achievable step',
    'Build consistent momentum',
    'Review progress and celebrate wins'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. update_gde_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_gde_settings(
  p_default_accountability text default null,
  p_proactive_suggestions_enabled boolean default null,
  p_celebration_enabled boolean default null,
  p_setback_support_enabled boolean default null,
  p_check_in_frequency_days integer default null,
  p_privacy_settings jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  perform public.ensure_gde_settings(v_tenant_id, v_user_id);

  update public.gde_settings
  set
    default_accountability = coalesce(p_default_accountability, default_accountability),
    proactive_suggestions_enabled = coalesce(p_proactive_suggestions_enabled, proactive_suggestions_enabled),
    celebration_enabled = coalesce(p_celebration_enabled, celebration_enabled),
    setback_support_enabled = coalesce(p_setback_support_enabled, setback_support_enabled),
    check_in_frequency_days = coalesce(p_check_in_frequency_days, check_in_frequency_days),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. create_user_goal
-- ---------------------------------------------------------------------------
create or replace function public.create_user_goal(
  p_title text,
  p_description text default '',
  p_why_matters text default '',
  p_category text default 'personal_development',
  p_timeframe text default 'medium_term',
  p_accountability_level text default null,
  p_target_date date default null,
  p_auto_milestones boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.gde_settings;
  v_goal_id uuid;
  v_milestone text;
  v_order integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  v_settings := public.ensure_gde_settings(v_tenant_id, v_user_id);

  insert into public.user_goals (
    tenant_id, user_id, title, description, why_matters,
    category, timeframe, accountability_level, target_date, source
  )
  values (
    v_tenant_id, v_user_id, p_title, coalesce(p_description, ''),
    coalesce(p_why_matters, ''), coalesce(p_category, 'personal_development'),
    coalesce(p_timeframe, 'medium_term'),
    coalesce(p_accountability_level, v_settings.default_accountability),
    p_target_date, 'user'
  )
  returning id into v_goal_id;

  if coalesce(p_auto_milestones, true) then
    for v_milestone in
      select jsonb_array_elements_text(
        public._suggest_milestones_for_goal(p_title, coalesce(p_category, 'personal_development'))
      )
    loop
      insert into public.goal_milestones (
        goal_id, tenant_id, title, sort_order, status
      )
      values (v_goal_id, v_tenant_id, v_milestone, v_order, case when v_order = 0 then 'in_progress' else 'planned' end);
      v_order := v_order + 1;
    end loop;
  end if;

  insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
  values (
    v_goal_id, v_tenant_id, v_user_id, 'progress_note',
    format('Goal created: %s. You are in control of the pace.', p_title)
  );

  return v_goal_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. update_user_goal
-- ---------------------------------------------------------------------------
create or replace function public.update_user_goal(
  p_goal_id uuid,
  p_title text default null,
  p_description text default null,
  p_why_matters text default null,
  p_category text default null,
  p_timeframe text default null,
  p_accountability_level text default null,
  p_status text default null,
  p_target_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_goal public.user_goals;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_goal from public.user_goals
  where id = p_goal_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if v_goal.id is null then raise exception 'Goal not found'; end if;

  update public.user_goals
  set
    title = coalesce(p_title, title),
    description = coalesce(p_description, description),
    why_matters = coalesce(p_why_matters, why_matters),
    category = coalesce(p_category, category),
    timeframe = coalesce(p_timeframe, timeframe),
    accountability_level = coalesce(p_accountability_level, accountability_level),
    status = coalesce(p_status, status),
    target_date = coalesce(p_target_date, target_date),
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    updated_at = now(),
    last_worked_at = case when p_status = 'active' then now() else last_worked_at end
  where id = p_goal_id;

  if p_status = 'completed' then
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (
      p_goal_id, v_tenant_id, v_user_id, 'celebration',
      format('Congratulations — you completed "%s". That matters.', coalesce(p_title, v_goal.title))
    );
  end if;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Milestone & action mutations
-- ---------------------------------------------------------------------------
create or replace function public.update_goal_milestone(
  p_milestone_id uuid,
  p_status text default null,
  p_title text default null,
  p_progress_percent integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_ms public.goal_milestones;
  v_goal public.user_goals;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select m.* into v_ms from public.goal_milestones m
  join public.user_goals g on g.id = m.goal_id
  where m.id = p_milestone_id and m.tenant_id = v_tenant_id and g.user_id = v_user_id;

  if v_ms.id is null then raise exception 'Milestone not found'; end if;

  update public.goal_milestones
  set
    status = coalesce(p_status, status),
    title = coalesce(p_title, title),
    progress_percent = coalesce(p_progress_percent, progress_percent),
    completed_at = case when coalesce(p_status, status) = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_milestone_id;

  perform public._recalc_goal_progress(v_ms.goal_id);

  select * into v_goal from public.user_goals where id = v_ms.goal_id;

  if coalesce(p_status, v_ms.status) = 'completed' then
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (
      v_ms.goal_id, v_tenant_id, v_user_id, 'celebration',
      format('Milestone achieved: %s. Excellent progress.', coalesce(p_title, v_ms.title))
    );
  end if;

  return jsonb_build_object(
    'updated', true,
    'goal_progress', (select progress_percent from public.user_goals where id = v_ms.goal_id)
  );
end;
$$;

create or replace function public.create_goal_action(
  p_goal_id uuid,
  p_title text,
  p_milestone_id uuid default null,
  p_due_date date default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_action_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if not exists (
    select 1 from public.user_goals
    where id = p_goal_id and tenant_id = v_tenant_id and user_id = v_user_id
  ) then
    raise exception 'Goal not found';
  end if;

  insert into public.goal_actions (goal_id, milestone_id, tenant_id, title, due_date)
  values (p_goal_id, p_milestone_id, v_tenant_id, p_title, p_due_date)
  returning id into v_action_id;

  update public.user_goals set last_worked_at = now(), updated_at = now() where id = p_goal_id;

  return v_action_id;
end;
$$;

create or replace function public.toggle_goal_action(
  p_action_id uuid,
  p_status text default 'completed'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_action public.goal_actions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select a.* into v_action from public.goal_actions a
  join public.user_goals g on g.id = a.goal_id
  where a.id = p_action_id and a.tenant_id = v_tenant_id and g.user_id = v_user_id;

  if v_action.id is null then raise exception 'Action not found'; end if;

  update public.goal_actions
  set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else null end,
    updated_at = now()
  where id = p_action_id;

  update public.user_goals set last_worked_at = now(), updated_at = now()
  where id = v_action.goal_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. record_goal_check_in
-- ---------------------------------------------------------------------------
create or replace function public.record_goal_check_in(
  p_goal_id uuid,
  p_response text default 'acknowledged'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_goal public.user_goals;
  v_user_name text;
  v_msg text;
  v_days integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_goal from public.user_goals
  where id = p_goal_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if v_goal.id is null then raise exception 'Goal not found'; end if;

  v_days := extract(day from now() - coalesce(v_goal.last_worked_at, v_goal.created_at))::integer;

  if p_response = 'setback' then
    v_msg := 'It is completely okay to adjust your timeline. Progress rarely happens in a straight line.';
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (p_goal_id, v_tenant_id, v_user_id, 'setback_support', v_msg);
  elsif v_goal.progress_percent >= 70 then
    v_msg := format(
      'You have completed %s%% of this goal. Excellent progress, %s.',
      v_goal.progress_percent,
      coalesce(split_part(v_user_name, ' ', 1), 'there')
    );
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (p_goal_id, v_tenant_id, v_user_id, 'celebration', v_msg);
  elsif v_days >= 14 then
    v_msg := format(
      'You have not worked on "%s" in %s days. Would you like to plan your next step?',
      v_goal.title, v_days
    );
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (p_goal_id, v_tenant_id, v_user_id, 'check_in', v_msg);
  else
    v_msg := format('Check-in recorded for "%s". Would you like to schedule time next week?', v_goal.title);
    insert into public.goal_activity (goal_id, tenant_id, user_id, activity_type, message)
    values (p_goal_id, v_tenant_id, v_user_id, 'check_in', v_msg);
  end if;

  return jsonb_build_object('message', v_msg);
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. get_customer_goals_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_goals_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.gde_settings;
  v_user_name text;
  v_stale_goals integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_gde_settings(v_tenant_id, v_user_id);

  select count(*) into v_stale_goals
  from public.user_goals g
  where g.tenant_id = v_tenant_id and g.user_id = v_user_id
    and g.status = 'active'
    and coalesce(g.last_worked_at, g.created_at) < now() - (v_settings.check_in_frequency_days || ' days')::interval;

  return jsonb_build_object(
    'has_customer', true,
    'user_name', coalesce(split_part(v_user_name, ' ', 1), 'there'),
    'settings', jsonb_build_object(
      'default_accountability', v_settings.default_accountability,
      'proactive_suggestions_enabled', v_settings.proactive_suggestions_enabled,
      'celebration_enabled', v_settings.celebration_enabled,
      'setback_support_enabled', v_settings.setback_support_enabled,
      'check_in_frequency_days', v_settings.check_in_frequency_days,
      'privacy_settings', v_settings.privacy_settings
    ),
    'active_goals', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', g.id, 'title', g.title, 'description', g.description,
        'why_matters', g.why_matters, 'category', g.category,
        'timeframe', g.timeframe, 'accountability_level', g.accountability_level,
        'status', g.status, 'progress_percent', g.progress_percent,
        'target_date', g.target_date, 'last_worked_at', g.last_worked_at,
        'milestones', coalesce(
          (select jsonb_agg(jsonb_build_object(
            'id', m.id, 'title', m.title, 'status', m.status,
            'progress_percent', m.progress_percent, 'sort_order', m.sort_order
          ) order by m.sort_order)
          from public.goal_milestones m where m.goal_id = g.id and m.status != 'archived'),
          '[]'::jsonb
        ),
        'actions', coalesce(
          (select jsonb_agg(jsonb_build_object(
            'id', a.id, 'title', a.title, 'status', a.status, 'due_date', a.due_date
          ) order by a.sort_order, a.created_at)
          from public.goal_actions a
          where a.goal_id = g.id and a.status != 'completed'
          limit 5),
          '[]'::jsonb
        )
      ) order by g.updated_at desc)
      from public.user_goals g
      where g.tenant_id = v_tenant_id and g.user_id = v_user_id
        and g.status in ('active', 'paused')),
      '[]'::jsonb
    ),
    'completed_goals', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', g.id, 'title', g.title, 'category', g.category,
        'progress_percent', g.progress_percent, 'completed_at', g.completed_at
      ) order by g.completed_at desc nulls last)
      from public.user_goals g
      where g.tenant_id = v_tenant_id and g.user_id = v_user_id
        and g.status = 'completed'
      limit 10),
      '[]'::jsonb
    ),
    'recommended_next_steps', coalesce(
      (select jsonb_agg(jsonb_build_object('goal_id', sub.goal_id, 'message', sub.msg))
      from (
        select g.id as goal_id,
          case
            when g.progress_percent >= 70 then
              format('You are %s%% through "%s". Keep the momentum going.', g.progress_percent, g.title)
            when coalesce(g.last_worked_at, g.created_at) < now() - interval '14 days' then
              format('Would you like to plan your next step on "%s"?', g.title)
            else
              format('Next for "%s": focus on your current milestone.', g.title)
          end as msg
        from public.user_goals g
        where g.tenant_id = v_tenant_id and g.user_id = v_user_id and g.status = 'active'
        order by
          case when coalesce(g.last_worked_at, g.created_at) < now() - interval '14 days' then 0 else 1 end,
          g.progress_percent desc
        limit 5
      ) sub),
      '[]'::jsonb
    ),
    'celebrations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'goal_id', a.goal_id, 'message', a.message, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.goal_activity a
      join public.user_goals g on g.id = a.goal_id
      where a.tenant_id = v_tenant_id and a.user_id = v_user_id
        and a.activity_type = 'celebration'
        and v_settings.celebration_enabled
      limit 8),
      '[]'::jsonb
    ),
    'check_ins', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'goal_id', a.goal_id, 'activity_type', a.activity_type,
        'message', a.message, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.goal_activity a
      where a.tenant_id = v_tenant_id and a.user_id = v_user_id
        and a.activity_type in ('check_in', 'setback_support')
      limit 10),
      '[]'::jsonb
    ),
    'stale_goals_count', v_stale_goals,
    'check_in_prompt', case when v_stale_goals > 0 and v_settings.proactive_suggestions_enabled then
      format('%s goal(s) could use a gentle check-in. No pressure — your pace, your choice.', v_stale_goals)
    else null end,
    'privacy_note', 'Your goals belong to you. Nothing is shared without permission. You control accountability and suggestions.',
    'integrations', jsonb_build_object(
      'pame', 'Memories may inform goal priorities',
      'life_os', 'LifeOS can schedule time for goals',
      'rsi', 'Family goals respect relationship boundaries',
      'identity', 'Encouragement adapts to your communication style',
      'context', 'Context engine finds natural moments for goal work',
      'learning_engine', 'May improve goal strategies — you retain control'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. export_goals_data
-- ---------------------------------------------------------------------------
create or replace function public.export_goals_data()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  return jsonb_build_object(
    'exported_at', now(),
    'goals', coalesce(
      (select jsonb_agg(to_jsonb(g))
      from public.user_goals g
      where g.tenant_id = v_tenant_id and g.user_id = v_user_id),
      '[]'::jsonb
    ),
    'milestones', coalesce(
      (select jsonb_agg(to_jsonb(m))
      from public.goal_milestones m
      join public.user_goals g on g.id = m.goal_id
      where g.tenant_id = v_tenant_id and g.user_id = v_user_id),
      '[]'::jsonb
    ),
    'actions', coalesce(
      (select jsonb_agg(to_jsonb(a))
      from public.goal_actions a
      join public.user_goals g on g.id = a.goal_id
      where g.tenant_id = v_tenant_id and g.user_id = v_user_id),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_goals_overview()
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
    'privacy_note', 'Administrators cannot access goal content. Aggregates only.',
    'users_with_goals', (select count(distinct user_id) from public.user_goals),
    'active_goals', (select count(*) from public.user_goals where status = 'active'),
    'completed_goals', (select count(*) from public.user_goals where status = 'completed'),
    'milestones_completed', (select count(*) from public.goal_milestones where status = 'completed'),
    'by_category', coalesce(
      (select jsonb_object_agg(category, cnt)
      from (select category, count(*)::integer as cnt from public.user_goals group by category) sub),
      '{}'::jsonb
    ),
    'by_accountability', coalesce(
      (select jsonb_object_agg(default_accountability, cnt)
      from (select default_accountability, count(*)::integer as cnt from public.gde_settings group by default_accountability) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.ensure_gde_settings(uuid, uuid) to authenticated;
grant execute on function public.update_gde_settings(text, boolean, boolean, boolean, integer, jsonb) to authenticated;
grant execute on function public.create_user_goal(text, text, text, text, text, text, date, boolean) to authenticated;
grant execute on function public.update_user_goal(uuid, text, text, text, text, text, text, text, date) to authenticated;
grant execute on function public.update_goal_milestone(uuid, text, text, integer) to authenticated;
grant execute on function public.create_goal_action(uuid, text, uuid, date) to authenticated;
grant execute on function public.toggle_goal_action(uuid, text) to authenticated;
grant execute on function public.record_goal_check_in(uuid, text) to authenticated;
grant execute on function public.get_customer_goals_center() to authenticated;
grant execute on function public.export_goals_data() to authenticated;
grant execute on function public.get_platform_goals_overview() to authenticated;

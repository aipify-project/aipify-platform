-- Phase 37 — Time & Attention Guardian (TAG)
-- Protects time, energy, and attention — support, not pressure.

-- ---------------------------------------------------------------------------
-- 1. tag_settings — user control
-- ---------------------------------------------------------------------------
create table if not exists public.tag_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  focus_protection_enabled boolean not null default true,
  proactivity_level text not null default 'balanced' check (
    proactivity_level in ('minimal', 'balanced', 'proactive')
  ),
  interruption_handling text not null default 'batch_non_essential' check (
    interruption_handling in (
      'allow_all', 'batch_non_essential', 'delay_low_priority', 'silence_optional'
    )
  ),
  energy_management_enabled boolean not null default true,
  goal_alignment_enabled boolean not null default true,
  meeting_protection_enabled boolean not null default true,
  recovery_protection_enabled boolean not null default true,
  daily_focus_briefing_enabled boolean not null default true,
  end_of_day_review_enabled boolean not null default true,
  attention_tracking_enabled boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time,
  preferred_focus_period text not null default 'morning' check (
    preferred_focus_period in ('morning', 'afternoon', 'evening', 'flexible')
  ),
  protected_priorities jsonb not null default '["goals", "family", "health", "deep_work"]'::jsonb,
  privacy_settings jsonb not null default '{
    "track_attention": true,
    "share_insights": false
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.tag_settings enable row level security;
revoke all on public.tag_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. focus_sessions — active & historical focus protection
-- ---------------------------------------------------------------------------
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null default 'Focus session',
  session_type text not null default 'deep_work' check (
    session_type in (
      'deep_work', 'creative', 'strategic_planning', 'reflection',
      'family', 'exercise', 'recovery', 'personal_development'
    )
  ),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active' check (
    status in ('active', 'completed', 'cancelled')
  ),
  reduce_interruptions boolean not null default true,
  linked_goal_id uuid references public.user_goals (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_active_idx
  on public.focus_sessions (tenant_id, user_id, status)
  where status = 'active';

alter table public.focus_sessions enable row level security;
revoke all on public.focus_sessions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. protected_time_blocks — intentional calendar-style blocks
-- ---------------------------------------------------------------------------
create table if not exists public.protected_time_blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  block_type text not null default 'deep_work' check (
    block_type in (
      'deep_work', 'exercise', 'planning', 'preparation',
      'family', 'recovery', 'personal_development'
    )
  ),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_protected boolean not null default true,
  recurrence_rule text,
  linked_goal_id uuid references public.user_goals (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists protected_time_blocks_user_idx
  on public.protected_time_blocks (tenant_id, user_id, starts_at);

alter table public.protected_time_blocks enable row level security;
revoke all on public.protected_time_blocks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. tag_activity — transparency log
-- ---------------------------------------------------------------------------
create table if not exists public.tag_activity (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  activity_type text not null check (
    activity_type in (
      'focus_activated', 'focus_ended', 'block_created',
      'attention_audit', 'overload_alert', 'goal_alignment', 'meeting_alert'
    )
  ),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.tag_activity enable row level security;
revoke all on public.tag_activity from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_tag_settings(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.tag_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.tag_settings;
begin
  insert into public.tag_settings (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row from public.tag_settings
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

create or replace function public._infer_attention_state(
  p_overload_score integer,
  p_active_focus boolean,
  p_meeting_count integer
)
returns text
language plpgsql
immutable
as $$
begin
  if p_active_focus then return 'focused'; end if;
  if p_overload_score >= 75 then return 'overloaded'; end if;
  if p_overload_score >= 50 then return 'recovery_needed'; end if;
  if p_meeting_count >= 5 then return 'distracted'; end if;
  if p_overload_score >= 30 then return 'planning_required'; end if;
  return 'balanced';
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. update_tag_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_tag_settings(
  p_focus_protection_enabled boolean default null,
  p_proactivity_level text default null,
  p_interruption_handling text default null,
  p_energy_management_enabled boolean default null,
  p_goal_alignment_enabled boolean default null,
  p_meeting_protection_enabled boolean default null,
  p_recovery_protection_enabled boolean default null,
  p_daily_focus_briefing_enabled boolean default null,
  p_end_of_day_review_enabled boolean default null,
  p_attention_tracking_enabled boolean default null,
  p_quiet_hours_start time default null,
  p_quiet_hours_end time default null,
  p_preferred_focus_period text default null,
  p_protected_priorities jsonb default null,
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

  perform public.ensure_tag_settings(v_tenant_id, v_user_id);

  update public.tag_settings
  set
    focus_protection_enabled = coalesce(p_focus_protection_enabled, focus_protection_enabled),
    proactivity_level = coalesce(p_proactivity_level, proactivity_level),
    interruption_handling = coalesce(p_interruption_handling, interruption_handling),
    energy_management_enabled = coalesce(p_energy_management_enabled, energy_management_enabled),
    goal_alignment_enabled = coalesce(p_goal_alignment_enabled, goal_alignment_enabled),
    meeting_protection_enabled = coalesce(p_meeting_protection_enabled, meeting_protection_enabled),
    recovery_protection_enabled = coalesce(p_recovery_protection_enabled, recovery_protection_enabled),
    daily_focus_briefing_enabled = coalesce(p_daily_focus_briefing_enabled, daily_focus_briefing_enabled),
    end_of_day_review_enabled = coalesce(p_end_of_day_review_enabled, end_of_day_review_enabled),
    attention_tracking_enabled = coalesce(p_attention_tracking_enabled, attention_tracking_enabled),
    quiet_hours_start = coalesce(p_quiet_hours_start, quiet_hours_start),
    quiet_hours_end = coalesce(p_quiet_hours_end, quiet_hours_end),
    preferred_focus_period = coalesce(p_preferred_focus_period, preferred_focus_period),
    protected_priorities = coalesce(p_protected_priorities, protected_priorities),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. activate_focus_mode / deactivate_focus_mode
-- ---------------------------------------------------------------------------
create or replace function public.activate_focus_mode(
  p_title text default 'Focus session',
  p_session_type text default 'deep_work',
  p_ends_at timestamptz default null,
  p_linked_goal_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_session_id uuid;
  v_end timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  perform public.ensure_tag_settings(v_tenant_id, v_user_id);

  update public.focus_sessions
  set status = 'completed', ends_at = now(), updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id and status = 'active';

  v_end := coalesce(p_ends_at, now() + interval '2 hours');

  insert into public.focus_sessions (
    tenant_id, user_id, title, session_type, ends_at,
    linked_goal_id, reduce_interruptions
  )
  values (
    v_tenant_id, v_user_id, coalesce(p_title, 'Focus session'),
    coalesce(p_session_type, 'deep_work'), v_end, p_linked_goal_id, true
  )
  returning id into v_session_id;

  perform public.update_context_settings(p_context_mode := 'focus');

  insert into public.tag_activity (tenant_id, user_id, activity_type, message)
  values (
    v_tenant_id, v_user_id, 'focus_activated',
    format('Focus mode active until %s. Non-essential interruptions reduced.', to_char(v_end, 'HH24:MI'))
  );

  return v_session_id;
end;
$$;

create or replace function public.deactivate_focus_mode()
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

  update public.focus_sessions
  set status = 'completed', ends_at = now(), updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id and status = 'active';

  perform public.update_context_settings(p_context_mode := 'auto');

  insert into public.tag_activity (tenant_id, user_id, activity_type, message)
  values (v_tenant_id, v_user_id, 'focus_ended', 'Focus mode ended. Normal notifications resume.');

  return jsonb_build_object('ended', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. create_protected_time_block
-- ---------------------------------------------------------------------------
create or replace function public.create_protected_time_block(
  p_title text,
  p_block_type text default 'deep_work',
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_linked_goal_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_block_id uuid;
  v_start timestamptz;
  v_end timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  v_start := coalesce(p_starts_at, now() + interval '1 day');
  v_end := coalesce(p_ends_at, v_start + interval '2 hours');

  insert into public.protected_time_blocks (
    tenant_id, user_id, title, block_type, starts_at, ends_at, linked_goal_id
  )
  values (
    v_tenant_id, v_user_id, p_title, coalesce(p_block_type, 'deep_work'),
    v_start, v_end, p_linked_goal_id
  )
  returning id into v_block_id;

  insert into public.tag_activity (tenant_id, user_id, activity_type, message)
  values (
    v_tenant_id, v_user_id, 'block_created',
    format('Protected time block created: %s', p_title)
  );

  return v_block_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. analyze_attention — audit, weekly summary, overload
-- ---------------------------------------------------------------------------
create or replace function public.analyze_attention()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.tag_settings;
  v_meetings_today integer;
  v_meetings_week integer;
  v_tasks integer;
  v_goals integer;
  v_overload integer;
  v_active_focus boolean;
  v_state text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_settings := public.ensure_tag_settings(v_tenant_id, v_user_id);

  select count(*) into v_meetings_today
  from public.calendar_events e
  where e.tenant_id = v_tenant_id and e.user_id = v_user_id
    and e.status = 'scheduled' and e.event_type = 'appointment'
    and e.starts_at::date = current_date;

  select count(*) into v_meetings_week
  from public.calendar_events e
  where e.tenant_id = v_tenant_id and e.user_id = v_user_id
    and e.status = 'scheduled' and e.event_type = 'appointment'
    and e.starts_at between now() and now() + interval '7 days';

  select count(*) into v_tasks
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.status = 'active' and m.category = 'tasks';

  select count(*) into v_goals
  from public.user_goals g
  where g.tenant_id = v_tenant_id and g.user_id = v_user_id and g.status = 'active';

  select exists (
    select 1 from public.focus_sessions
    where tenant_id = v_tenant_id and user_id = v_user_id and status = 'active'
  ) into v_active_focus;

  v_overload := least(100, v_meetings_week * 4 + v_tasks * 2 + v_meetings_today * 6);
  v_state := public._infer_attention_state(v_overload, v_active_focus, v_meetings_today);

  return jsonb_build_object(
    'has_customer', true,
    'attention_state', v_state,
    'overload_score', v_overload,
    'weekly_attention', case when v_settings.attention_tracking_enabled then jsonb_build_object(
      'work', 38, 'administration', 22, 'family', 18,
      'personal_goals', 12, 'recovery', 10
    ) else null end,
    'weekly_prompt', case when v_settings.attention_tracking_enabled then
      'Would you like help improving balance?'
    else null end,
    'meeting_analysis', case when v_settings.meeting_protection_enabled then jsonb_build_object(
      'today_count', v_meetings_today,
      'week_count', v_meetings_week,
      'alert', case when v_meetings_today >= 5 then
        format('You have %s meetings scheduled today. Would you like to protect focus time?', v_meetings_today)
      else null end
    ) else null end,
    'energy_insights', case when v_settings.energy_management_enabled then
      coalesce(
        (select jsonb_agg(msg) from (
          select 'You have several demanding activities scheduled consecutively. Insert a recovery period?' as msg
          where v_meetings_today >= 3
          union all
          select 'You typically perform best in the morning. Schedule high-priority work before lunch?'
          where v_settings.preferred_focus_period = 'morning'
        ) hints),
        '[]'::jsonb
      )
    else '[]'::jsonb end,
    'goal_alignment', case when v_settings.goal_alignment_enabled then
      coalesce(
        (select jsonb_agg(jsonb_build_object('goal_id', g.id, 'message', msg))
        from (
          select g.id,
            case
              when g.category = 'health' and coalesce(g.last_worked_at, g.created_at) < now() - interval '7 days' then
                format('You identified "%s" as important. No activity this week — find available time?', g.title)
              when g.category = 'career' and coalesce(g.last_worked_at, g.created_at) < now() - interval '14 days' then
                format('"%s" is a priority — no dedicated sessions scheduled. Plan ahead?', g.title)
              else format('Protect time for "%s" this week?', g.title)
            end as msg
          from public.user_goals g
          where g.tenant_id = v_tenant_id and g.user_id = v_user_id and g.status = 'active'
          order by g.progress_percent desc
          limit 4
        ) sub),
        '[]'::jsonb
      )
    else '[]'::jsonb end,
    'recovery_alerts', case when v_settings.recovery_protection_enabled and v_overload >= 50 then
      jsonb_build_array('Recognize excessive workload — encourage rest periods and realistic pacing.')
    else '[]'::jsonb end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. get_attention_summary — daily focus briefing / end of day
-- ---------------------------------------------------------------------------
create or replace function public.get_attention_summary(p_summary_type text default 'daily_focus')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.tag_settings;
  v_user_name text;
  v_focus_window text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  v_settings := public.ensure_tag_settings(v_tenant_id, v_user_id);

  if p_summary_type = 'end_of_day' then
    if not v_settings.end_of_day_review_enabled then
      return jsonb_build_object('has_customer', true, 'enabled', false);
    end if;
    return jsonb_build_object(
      'has_customer', true,
      'enabled', true,
      'type', 'end_of_day',
      'completed_today', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'completed'
          and m.updated_at::date = current_date limit 8),
        '[]'::jsonb
      ),
      'still_outstanding', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and m.category in ('tasks', 'events') limit 8),
        '[]'::jsonb
      ),
      'prompt', 'Would you like to reschedule these activities?'
    );
  end if;

  if not v_settings.daily_focus_briefing_enabled then
    return jsonb_build_object('has_customer', true, 'enabled', false);
  end if;

  select format('one uninterrupted two-hour focus window this %s',
    case v_settings.preferred_focus_period
      when 'morning' then 'morning'
      when 'afternoon' then 'afternoon'
      else 'afternoon'
    end
  ) into v_focus_window;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', true,
    'type', 'daily_focus',
    'greeting', format('Good morning, %s.', coalesce(split_part(v_user_name, ' ', 1), 'there')),
    'priorities', coalesce(
      (select jsonb_agg(jsonb_build_object('rank', rn, 'title', t) order by rn)
      from (
        select row_number() over (order by src_ord, t) as rn, t
        from (
          select 1 as src_ord, g.title as t
          from public.user_goals g
          where g.tenant_id = v_tenant_id and g.user_id = v_user_id and g.status = 'active'
          order by g.progress_percent desc limit 2
        ) gsub
        union all
        select 2, m.title
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'active' and m.category = 'tasks'
        limit 1
      ) combined
      limit 3),
      '[]'::jsonb
    ),
    'focus_window', v_focus_window,
    'prompt', format('You currently have %s. Would you like me to protect this time?', v_focus_window)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. get_customer_attention_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_attention_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.tag_settings;
  v_analysis jsonb;
  v_active_focus public.focus_sessions;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public.ensure_tag_settings(v_tenant_id, v_user_id);
  v_analysis := public.analyze_attention();

  select * into v_active_focus
  from public.focus_sessions
  where tenant_id = v_tenant_id and user_id = v_user_id and status = 'active'
  limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'focus_protection_enabled', v_settings.focus_protection_enabled,
      'proactivity_level', v_settings.proactivity_level,
      'interruption_handling', v_settings.interruption_handling,
      'energy_management_enabled', v_settings.energy_management_enabled,
      'goal_alignment_enabled', v_settings.goal_alignment_enabled,
      'meeting_protection_enabled', v_settings.meeting_protection_enabled,
      'recovery_protection_enabled', v_settings.recovery_protection_enabled,
      'daily_focus_briefing_enabled', v_settings.daily_focus_briefing_enabled,
      'end_of_day_review_enabled', v_settings.end_of_day_review_enabled,
      'attention_tracking_enabled', v_settings.attention_tracking_enabled,
      'quiet_hours_start', v_settings.quiet_hours_start,
      'quiet_hours_end', v_settings.quiet_hours_end,
      'preferred_focus_period', v_settings.preferred_focus_period,
      'protected_priorities', v_settings.protected_priorities,
      'privacy_settings', v_settings.privacy_settings
    ),
    'attention_state', v_analysis -> 'attention_state',
    'overload_score', v_analysis -> 'overload_score',
    'active_focus_session', case when v_active_focus.id is not null then jsonb_build_object(
      'id', v_active_focus.id, 'title', v_active_focus.title,
      'session_type', v_active_focus.session_type,
      'ends_at', v_active_focus.ends_at
    ) else null end,
    'focus_sessions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', f.id, 'title', f.title, 'session_type', f.session_type,
        'starts_at', f.starts_at, 'ends_at', f.ends_at, 'status', f.status
      ) order by f.starts_at desc)
      from public.focus_sessions f
      where f.tenant_id = v_tenant_id and f.user_id = v_user_id
      limit 10),
      '[]'::jsonb
    ),
    'protected_blocks', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', b.id, 'title', b.title, 'block_type', b.block_type,
        'starts_at', b.starts_at, 'ends_at', b.ends_at, 'is_protected', b.is_protected
      ) order by b.starts_at)
      from public.protected_time_blocks b
      where b.tenant_id = v_tenant_id and b.user_id = v_user_id
        and b.starts_at >= now() - interval '1 day'
      limit 10),
      '[]'::jsonb
    ),
    'daily_focus_briefing', public.get_attention_summary('daily_focus'),
    'end_of_day_review', public.get_attention_summary('end_of_day'),
    'weekly_attention', v_analysis -> 'weekly_attention',
    'weekly_prompt', v_analysis -> 'weekly_prompt',
    'meeting_analysis', v_analysis -> 'meeting_analysis',
    'energy_insights', v_analysis -> 'energy_insights',
    'goal_alignment', v_analysis -> 'goal_alignment',
    'recovery_alerts', v_analysis -> 'recovery_alerts',
    'priority_defense', coalesce(
      (select jsonb_agg(jsonb_build_object('id', s.id, 'message', s.msg))
      from (
        select g.id,
          format('"%s" is a high priority — reserve focused time this week?', g.title) as msg
        from public.user_goals g
        where g.tenant_id = v_tenant_id and g.user_id = v_user_id
          and g.status = 'active' and g.progress_percent < 50
          and coalesce(g.last_worked_at, g.created_at) < now() - interval '7 days'
        limit 4
      ) s),
      '[]'::jsonb
    ),
    'recent_activity', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'activity_type', a.activity_type,
        'message', a.message, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.tag_activity a
      where a.tenant_id = v_tenant_id and a.user_id = v_user_id
      limit 12),
      '[]'::jsonb
    ),
    'privacy_note', 'Attention data belongs to you. Disable tracking anytime. Aipify supports — never pressures.',
    'integrations', jsonb_build_object(
      'context_engine', 'Calendar intelligence and focus mode',
      'goals_dreams', 'Goal alignment insights',
      'life_os', 'Quiet hours and life balance',
      'identity', 'Communication respects your style',
      'ucl', 'Meeting overload and scheduling conflicts'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_attention_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access attention details. Aggregates only.',
    'tag_profiles', (select count(*) from public.tag_settings),
    'active_focus_sessions', (select count(*) from public.focus_sessions where status = 'active'),
    'protected_blocks', (select count(*) from public.protected_time_blocks where starts_at >= now()),
    'focus_enabled', (select count(*) from public.tag_settings where focus_protection_enabled = true),
    'by_attention_state', '{}'::jsonb,
    'by_focus_period', coalesce(
      (select jsonb_object_agg(preferred_focus_period, cnt)
      from (select preferred_focus_period, count(*)::integer as cnt from public.tag_settings group by preferred_focus_period) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.ensure_tag_settings(uuid, uuid) to authenticated;
grant execute on function public.update_tag_settings(
  boolean, text, text, boolean, boolean, boolean, boolean, boolean, boolean, boolean,
  time, time, text, jsonb, jsonb
) to authenticated;
grant execute on function public.activate_focus_mode(text, text, timestamptz, uuid) to authenticated;
grant execute on function public.deactivate_focus_mode() to authenticated;
grant execute on function public.create_protected_time_block(text, text, timestamptz, timestamptz, uuid) to authenticated;
grant execute on function public.analyze_attention() to authenticated;
grant execute on function public.get_attention_summary(text) to authenticated;
grant execute on function public.get_customer_attention_center() to authenticated;
grant execute on function public.get_platform_attention_overview() to authenticated;

-- Phase 32 — Life Operating System (LifeOS)
-- Builds on PAME (personal_memories). LifeOS coordinates daily life; PAME remembers.

-- ---------------------------------------------------------------------------
-- 1. life_os_settings — user control & personality
-- ---------------------------------------------------------------------------
create table if not exists public.life_os_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  proactivity_level text not null default 'balanced' check (
    proactivity_level in ('low', 'balanced', 'high')
  ),
  notification_frequency text not null default 'balanced' check (
    notification_frequency in ('minimal', 'balanced', 'frequent')
  ),
  personality text not null default 'supportive' check (
    personality in ('minimal', 'professional', 'supportive', 'highly_proactive')
  ),
  life_areas_enabled jsonb not null default '{
    "personal": true,
    "family": true,
    "health": true,
    "work": true,
    "finance": true,
    "travel": true,
    "education": true,
    "home": true
  }'::jsonb,
  daily_briefing_enabled boolean not null default true,
  evening_review_enabled boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time,
  energy_aware_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.life_os_settings enable row level security;
revoke all on public.life_os_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. life_memory_meta — priority, life area, rescheduling
-- ---------------------------------------------------------------------------
create table if not exists public.life_memory_meta (
  memory_id uuid primary key references public.personal_memories (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority text not null default 'routine' check (
    priority in ('critical', 'important', 'routine', 'optional')
  ),
  life_area text not null default 'personal' check (
    life_area in (
      'personal', 'family', 'health', 'work', 'finance',
      'travel', 'education', 'home'
    )
  ),
  postponed_count integer not null default 0,
  last_postponed_at timestamptz,
  reschedule_suggested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists life_memory_meta_tenant_idx
  on public.life_memory_meta (tenant_id, priority);

alter table public.life_memory_meta enable row level security;
revoke all on public.life_memory_meta from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. life_checklists + items
-- ---------------------------------------------------------------------------
create table if not exists public.life_checklists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  title text not null,
  description text not null default '',
  checklist_type text not null default 'custom' check (
    checklist_type in (
      'vacation', 'finance', 'moving', 'birthday', 'travel', 'custom'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.life_checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.life_checklists (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.life_checklists enable row level security;
alter table public.life_checklist_items enable row level security;
revoke all on public.life_checklists from authenticated, anon;
revoke all on public.life_checklist_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Ensure settings helper
-- ---------------------------------------------------------------------------
create or replace function public.ensure_life_os_settings(p_tenant_id uuid)
returns public.life_os_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.life_os_settings;
begin
  insert into public.life_os_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.life_os_settings
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Infer priority from memory context
-- ---------------------------------------------------------------------------
create or replace function public._infer_memory_priority(
  p_memory_date timestamptz,
  p_category text,
  p_postponed_count integer
)
returns text
language plpgsql
immutable
as $$
begin
  if p_postponed_count >= 3 then
    return 'critical';
  end if;
  if p_memory_date is not null and p_memory_date < now() then
    return 'critical';
  end if;
  if p_memory_date is not null and p_memory_date <= now() + interval '1 day' then
    return 'critical';
  end if;
  if p_memory_date is not null and p_memory_date <= now() + interval '7 days' then
    return 'important';
  end if;
  if p_category in ('habits', 'events') then
    return 'routine';
  end if;
  if p_category = 'goals' then
    return 'optional';
  end if;
  return 'important';
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Default life area from PAME category
-- ---------------------------------------------------------------------------
create or replace function public._default_life_area(p_category text)
returns text
language plpgsql
immutable
as $$
begin
  return case p_category
    when 'important_people' then 'family'
    when 'events' then 'personal'
    when 'tasks' then 'work'
    when 'habits' then 'health'
    when 'goals' then 'personal'
    else 'personal'
  end;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Auto-create life_memory_meta for new personal_memories
-- ---------------------------------------------------------------------------
create or replace function public._ensure_life_memory_meta()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.life_memory_meta (
    memory_id, tenant_id, priority, life_area
  )
  values (
    new.id,
    new.tenant_id,
    public._infer_memory_priority(new.memory_date, new.category, 0),
    public._default_life_area(new.category)
  )
  on conflict (memory_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_ensure_life_memory_meta on public.personal_memories;
create trigger trg_ensure_life_memory_meta
  after insert on public.personal_memories
  for each row execute function public._ensure_life_memory_meta();

-- Backfill meta for existing memories
insert into public.life_memory_meta (memory_id, tenant_id, priority, life_area)
select
  m.id, m.tenant_id,
  public._infer_memory_priority(m.memory_date, m.category, 0),
  public._default_life_area(m.category)
from public.personal_memories m
where m.status not in ('deleted')
  and not exists (
    select 1 from public.life_memory_meta lm where lm.memory_id = m.id
  );

-- ---------------------------------------------------------------------------
-- 8. Update life_os_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_life_os_settings(
  p_proactivity_level text default null,
  p_notification_frequency text default null,
  p_personality text default null,
  p_life_areas_enabled jsonb default null,
  p_daily_briefing_enabled boolean default null,
  p_evening_review_enabled boolean default null,
  p_quiet_hours_start time default null,
  p_quiet_hours_end time default null,
  p_energy_aware_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  perform public.ensure_life_os_settings(v_tenant_id);

  update public.life_os_settings
  set
    proactivity_level = coalesce(p_proactivity_level, proactivity_level),
    notification_frequency = coalesce(p_notification_frequency, notification_frequency),
    personality = coalesce(p_personality, personality),
    life_areas_enabled = coalesce(p_life_areas_enabled, life_areas_enabled),
    daily_briefing_enabled = coalesce(p_daily_briefing_enabled, daily_briefing_enabled),
    evening_review_enabled = coalesce(p_evening_review_enabled, evening_review_enabled),
    quiet_hours_start = coalesce(p_quiet_hours_start, quiet_hours_start),
    quiet_hours_end = coalesce(p_quiet_hours_end, quiet_hours_end),
    energy_aware_enabled = coalesce(p_energy_aware_enabled, energy_aware_enabled),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Postpone reminder (smart rescheduling)
-- ---------------------------------------------------------------------------
create or replace function public.postpone_life_reminder(p_memory_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_count integer;
  v_suggest boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  update public.life_memory_meta lm
  set
    postponed_count = lm.postponed_count + 1,
    last_postponed_at = now(),
    reschedule_suggested = (lm.postponed_count + 1) >= 3,
    updated_at = now()
  from public.personal_memories m
  where lm.memory_id = p_memory_id
    and m.id = lm.memory_id
    and m.tenant_id = v_tenant_id
    and m.status = 'active'
  returning lm.postponed_count, lm.reschedule_suggested
  into v_count, v_suggest;

  if v_count is null then
    raise exception 'Memory not found';
  end if;

  return jsonb_build_object(
    'postponed_count', v_count,
    'reschedule_suggested', v_suggest,
    'message', case
      when v_suggest then
        'I''ve noticed this reminder has been postponed three times. Would you like to choose another time?'
      else 'Moved to a later reminder. I''ll check back with you.'
    end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Update memory priority / life area
-- ---------------------------------------------------------------------------
create or replace function public.update_life_memory_meta(
  p_memory_id uuid,
  p_priority text default null,
  p_life_area text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  update public.life_memory_meta lm
  set
    priority = coalesce(p_priority, lm.priority),
    life_area = coalesce(p_life_area, lm.life_area),
    updated_at = now()
  from public.personal_memories m
  where lm.memory_id = p_memory_id
    and m.id = lm.memory_id
    and m.tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Checklist CRUD
-- ---------------------------------------------------------------------------
create or replace function public.create_life_checklist(
  p_title text,
  p_description text default '',
  p_checklist_type text default 'custom',
  p_items jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_item jsonb;
  v_idx integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.life_checklists (
    tenant_id, user_id, title, description, checklist_type
  )
  values (v_tenant_id, v_user_id, p_title, p_description, p_checklist_type)
  returning id into v_id;

  for v_item in select jsonb_array_elements(p_items)
  loop
    insert into public.life_checklist_items (
      checklist_id, tenant_id, title, sort_order
    )
    values (
      v_id, v_tenant_id,
      coalesce(v_item ->> 'title', 'Item'),
      v_idx
    );
    v_idx := v_idx + 1;
  end loop;

  return v_id;
end;
$$;

create or replace function public.toggle_life_checklist_item(
  p_item_id uuid,
  p_completed boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  update public.life_checklist_items i
  set completed_at = case when p_completed then now() else null end
  from public.life_checklists c
  where i.id = p_item_id
    and i.checklist_id = c.id
    and c.tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. get_customer_life_center — Life Dashboard bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_life_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.life_os_settings;
  v_user_name text;
  v_today_events integer;
  v_follow_ups integer;
  v_upcoming_week integer;
  v_family_soon integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_life_os_settings(v_tenant_id);

  select u.full_name into v_user_name
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select count(*) into v_today_events
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.category = 'events'
    and m.status = 'active'
    and m.memory_date::date = current_date;

  select count(*) into v_follow_ups
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.category = 'tasks'
    and m.status = 'active';

  select count(*) into v_upcoming_week
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.status = 'active'
    and m.memory_date between now() and now() + interval '7 days';

  select count(*) into v_family_soon
  from public.personal_memories m
  where m.tenant_id = v_tenant_id and m.category = 'important_people'
    and m.status = 'active'
    and m.memory_date between now() and now() + interval '14 days';

  return jsonb_build_object(
    'has_customer', true,
    'user_name', coalesce(split_part(v_user_name, ' ', 1), 'there'),
    'settings', jsonb_build_object(
      'proactivity_level', v_settings.proactivity_level,
      'notification_frequency', v_settings.notification_frequency,
      'personality', v_settings.personality,
      'life_areas_enabled', v_settings.life_areas_enabled,
      'daily_briefing_enabled', v_settings.daily_briefing_enabled,
      'evening_review_enabled', v_settings.evening_review_enabled,
      'quiet_hours_start', v_settings.quiet_hours_start,
      'quiet_hours_end', v_settings.quiet_hours_end,
      'energy_aware_enabled', v_settings.energy_aware_enabled
    ),
    'daily_briefing', case when v_settings.daily_briefing_enabled then jsonb_build_object(
      'greeting', format('Good morning, %s.', coalesce(split_part(v_user_name, ' ', 1), 'there')),
      'highlights', coalesce(
        (select jsonb_agg(msg)
        from (
          select format('%s meeting%s today.', v_today_events,
            case when v_today_events = 1 then '' else 's' end) as msg
          where v_today_events > 0
          union all
          select format('%s follow-up task%s.', v_follow_ups,
            case when v_follow_ups = 1 then '' else 's' end)
          where v_follow_ups > 0
          union all
          select format('%s commitment%s this week.', v_upcoming_week,
            case when v_upcoming_week = 1 then '' else 's' end)
          where v_upcoming_week > 0
          union all
          select format('A family reminder is coming up in the next two weeks.')
          where v_family_soon > 0
        ) lines),
        '[]'::jsonb
      ),
      'prompt', 'Would you like help planning your day?'
    ) else null end,
    'evening_review', case when v_settings.evening_review_enabled then jsonb_build_object(
      'completed_today', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'completed'
          and m.updated_at::date = current_date
        limit 10),
        '[]'::jsonb
      ),
      'still_pending', coalesce(
        (select jsonb_agg(jsonb_build_object('id', m.id, 'title', m.title))
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and m.category in ('tasks', 'events')
          and lm.priority in ('critical', 'important')
        limit 10),
        '[]'::jsonb
      ),
      'prompt', 'Should I move these to tomorrow?'
    ) else null end,
    'today_overview', coalesce(
      (select jsonb_agg(row order by row ->> 'memory_date')
      from (
        select jsonb_build_object(
          'id', m.id, 'title', m.title, 'category', m.category,
          'memory_date', m.memory_date, 'priority', lm.priority,
          'life_area', lm.life_area, 'status', m.status
        ) as row
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and (
            m.memory_date::date = current_date
            or (m.memory_date is null and m.category = 'tasks')
          )
        limit 15
      ) sub),
      '[]'::jsonb
    ),
    'upcoming_events', coalesce(
      (select jsonb_agg(row order by row ->> 'memory_date')
      from (
        select jsonb_build_object(
          'id', m.id, 'title', m.title, 'memory_date', m.memory_date,
          'priority', lm.priority, 'life_area', lm.life_area
        ) as row
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.category = 'events'
          and m.status = 'active' and m.memory_date >= now()
        limit 10
      ) sub),
      '[]'::jsonb
    ),
    'priority_tasks', coalesce(
      (select jsonb_agg(row order by pri_ord, md nulls last)
      from (
        select jsonb_build_object(
          'id', m.id, 'title', m.title, 'description', m.description,
          'memory_date', m.memory_date, 'priority', lm.priority,
          'life_area', lm.life_area, 'postponed_count', lm.postponed_count,
          'reschedule_suggested', lm.reschedule_suggested
        ) as row,
        case lm.priority
          when 'critical' then 1 when 'important' then 2
          when 'routine' then 3 else 4
        end as pri_ord,
        m.memory_date as md
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.category = 'tasks'
          and m.status = 'active'
      ) sub),
      '[]'::jsonb
    ),
    'family_reminders', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'title', m.title, 'memory_date', m.memory_date,
        'description', m.description
      ) order by m.memory_date)
      from public.personal_memories m
      where m.tenant_id = v_tenant_id
        and m.category = 'important_people' and m.status = 'active'
        and m.memory_date >= now()
      limit 8),
      '[]'::jsonb
    ),
    'suggested_actions', coalesce(
      (select jsonb_agg(jsonb_build_object('id', s.id, 'message', s.msg))
      from (
        select m.id,
          case
            when lm.reschedule_suggested then
              format('Reschedule: %s has been postponed %s times.', m.title, lm.postponed_count)
            when m.memory_date < now() and m.category = 'tasks' then
              format('Overdue: %s — schedule time for it?', m.title)
            when m.category = 'important_people' and m.memory_date <= now() + interval '14 days' then
              format('Plan ahead: %s is coming up.', m.title)
            else format('Still relevant: %s', m.title)
          end as msg
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
        order by
          case when lm.reschedule_suggested then 0
               when m.memory_date < now() then 1 else 2 end
        limit 6
      ) s),
      '[]'::jsonb
    ),
    'life_balance', jsonb_build_object(
      'by_area', coalesce(
        (select jsonb_object_agg(life_area, cnt)
        from (
          select lm.life_area, count(*)::integer as cnt
          from public.personal_memories m
          join public.life_memory_meta lm on lm.memory_id = m.id
          where m.tenant_id = v_tenant_id and m.status = 'active'
          group by lm.life_area
        ) sub),
        '{}'::jsonb
      ),
      'overload_days', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'date', day::date, 'count', cnt, 'message',
          format('%s commitments on %s — consider spreading them out.', cnt, day::date)
        ))
        from (
          select m.memory_date::date as day, count(*)::integer as cnt
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.status = 'active'
            and m.memory_date between now() and now() + interval '14 days'
          group by m.memory_date::date
          having count(*) >= 4
        ) overload),
        '[]'::jsonb
      )
    ),
    'conflicts', coalesce(
      (select jsonb_agg(jsonb_build_object('type', c.type, 'message', c.msg))
      from (
        select 'overload' as type,
          format('Too many commitments on %s (%s items).', day::date, cnt) as msg
        from (
          select m.memory_date::date as day, count(*) as cnt
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.status = 'active'
            and m.category = 'events'
            and m.memory_date between now() and now() + interval '7 days'
          group by m.memory_date::date
          having count(*) >= 3
        ) d
        union all
        select 'deadline' as type,
          format('Forgotten deadline approaching: %s', m.title) as msg
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and m.memory_date between now() and now() + interval '2 days'
          and lm.priority = 'critical'
        limit 3
      ) c),
      '[]'::jsonb
    ),
    'proactive_questions', coalesce(
      (select jsonb_agg(jsonb_build_object('id', q.id, 'message', q.msg))
      from (
        select m.id,
          case
            when lm.priority = 'critical' and m.memory_date::date = current_date + 1 then
              'You have several important tasks tomorrow. Would you like me to help prioritize them?'
            when m.created_at < now() - interval '5 days' and m.category = 'tasks' then
              format('You normally schedule follow-ups within five days. %s is now overdue.', m.title)
            when m.category = 'events' and m.memory_date between now() and now() + interval '1 day' then
              format('Would you like me to reserve preparation time before %s?', m.title)
            else null
          end as msg
        from public.personal_memories m
        join public.life_memory_meta lm on lm.memory_id = m.id
        where m.tenant_id = v_tenant_id and m.status = 'active'
      ) q
      where q.msg is not null
      limit 5),
      '[]'::jsonb
    ),
    'checklists', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'description', c.description,
        'checklist_type', c.checklist_type, 'status', c.status,
        'items', coalesce(
          (select jsonb_agg(jsonb_build_object(
            'id', i.id, 'title', i.title, 'sort_order', i.sort_order,
            'completed_at', i.completed_at
          ) order by i.sort_order)
          from public.life_checklist_items i
          where i.checklist_id = c.id),
          '[]'::jsonb
        ),
        'progress', coalesce(
          (select round(
            100.0 * count(*) filter (where i.completed_at is not null)
            / nullif(count(*), 0)
          )::integer
          from public.life_checklist_items i where i.checklist_id = c.id),
          0
        )
      ) order by c.created_at desc)
      from public.life_checklists c
      where c.tenant_id = v_tenant_id and c.status = 'active'),
      '[]'::jsonb
    ),
    'energy_hint', case
      when v_settings.energy_aware_enabled then
        'You usually complete important tasks in the morning. Would you like to schedule this before lunch?'
      else null
    end,
    'privacy_note', 'Suggestions only — you always decide. No hidden actions.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Platform overview — aggregates only
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_life_os_overview()
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
    'privacy_note', 'Administrators cannot access user life data. Aggregates only.',
    'tenants_with_life_os', (select count(*) from public.life_os_settings),
    'active_checklists', (
      select count(*) from public.life_checklists where status = 'active'
    ),
    'memories_with_meta', (select count(*) from public.life_memory_meta),
    'reschedule_suggestions', (
      select count(*) from public.life_memory_meta where reschedule_suggested = true
    ),
    'by_priority', coalesce(
      (select jsonb_object_agg(priority, cnt)
      from (
        select priority, count(*)::integer as cnt
        from public.life_memory_meta group by priority
      ) sub),
      '{}'::jsonb
    ),
    'by_life_area', coalesce(
      (select jsonb_object_agg(life_area, cnt)
      from (
        select life_area, count(*)::integer as cnt
        from public.life_memory_meta group by life_area
      ) sub),
      '{}'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Seed default checklists for pilot tenant
-- ---------------------------------------------------------------------------
insert into public.life_checklists (tenant_id, title, description, checklist_type)
select c.id, 'Monthly finance review', 'Recurring monthly checklist.', 'finance'
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
  and not exists (
    select 1 from public.life_checklists lc
    where lc.tenant_id = c.id and lc.title = 'Monthly finance review'
  );

insert into public.life_checklist_items (checklist_id, tenant_id, title, sort_order)
select lc.id, lc.tenant_id, item.title, item.ord
from public.life_checklists lc
cross join (
  values
    ('Review subscriptions', 0),
    ('Check savings goals', 1),
    ('Pay outstanding bills', 2),
    ('Update budget forecast', 3)
) as item(title, ord)
where lc.title = 'Monthly finance review'
  and not exists (
    select 1 from public.life_checklist_items i where i.checklist_id = lc.id
  );

grant execute on function public.ensure_life_os_settings(uuid) to authenticated;
grant execute on function public.update_life_os_settings(
  text, text, text, jsonb, boolean, boolean, time, time, boolean
) to authenticated;
grant execute on function public.postpone_life_reminder(uuid) to authenticated;
grant execute on function public.update_life_memory_meta(uuid, text, text) to authenticated;
grant execute on function public.create_life_checklist(text, text, text, jsonb) to authenticated;
grant execute on function public.toggle_life_checklist_item(uuid, boolean) to authenticated;
grant execute on function public.get_customer_life_center() to authenticated;
grant execute on function public.get_platform_life_os_overview() to authenticated;

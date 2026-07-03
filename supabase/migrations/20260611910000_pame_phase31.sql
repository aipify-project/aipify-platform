-- Phase 31 — Personal Assistant Memory Engine (PAME)

-- ---------------------------------------------------------------------------
-- 1. personal_memories (canonical PAME store)
-- ---------------------------------------------------------------------------
create table if not exists public.personal_memories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  category text not null check (
    category in ('important_people', 'events', 'tasks', 'habits', 'goals')
  ),
  title text not null,
  description text not null default '',
  memory_date timestamptz,
  recurring boolean not null default false,
  recurrence_rule text,
  status text not null default 'active' check (
    status in ('active', 'completed', 'archived', 'deleted', 'paused')
  ),
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  reminder_offsets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personal_memories_tenant_idx
  on public.personal_memories (tenant_id, status, created_at desc);

alter table public.personal_memories enable row level security;
revoke all on public.personal_memories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. important_people
-- ---------------------------------------------------------------------------
create table if not exists public.important_people (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  name text not null,
  relationship text,
  birthday date,
  notes text,
  memory_id uuid references public.personal_memories (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.important_people enable row level security;
revoke all on public.important_people from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. memory_notifications (reminder engine)
-- ---------------------------------------------------------------------------
create table if not exists public.memory_notifications (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.personal_memories (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  notification_type text not null default 'in_app' check (
    notification_type in ('in_app', 'push', 'email', 'calendar', 'sms')
  ),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'cancelled', 'paused')
  ),
  created_at timestamptz not null default now()
);

create index if not exists memory_notifications_scheduled_idx
  on public.memory_notifications (tenant_id, scheduled_for, status);

alter table public.memory_notifications enable row level security;
revoke all on public.memory_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Migrate legacy assistant memories
-- ---------------------------------------------------------------------------
insert into public.personal_memories (
  tenant_id, user_id, category, title, description, memory_date,
  recurring, recurrence_rule, status, confidence_level, reminder_offsets, created_at
)
select
  m.tenant_id, m.user_id,
  case m.category
    when 'personal' then 'important_people'
    when 'work' then 'tasks'
    when 'temporary' then 'tasks'
    when 'recurring' then 'habits'
    else 'tasks'
  end,
  m.title, m.summary,
  m.event_date::timestamptz,
  m.recurrence is not null,
  m.recurrence,
  case m.status when 'removed' then 'deleted' when 'archived' then 'archived' else 'active' end,
  case
    when m.confidence_score >= 80 then 'high'
    when m.confidence_score >= 50 then 'medium'
    else 'low'
  end,
  m.reminder_offsets, m.created_at
from public.customer_assistant_memories m
where not exists (
  select 1 from public.personal_memories p
  where p.tenant_id = m.tenant_id and p.title = m.title and p.created_at = m.created_at
);

-- ---------------------------------------------------------------------------
-- 5. Update settings categories to PAME types
-- ---------------------------------------------------------------------------
update public.customer_assistant_settings
set categories_enabled = '{
  "important_people": true,
  "events": true,
  "tasks": true,
  "habits": true,
  "goals": true
}'::jsonb
where categories_enabled ? 'personal';

-- ---------------------------------------------------------------------------
-- 6. Schedule reminders helper
-- ---------------------------------------------------------------------------
create or replace function public._schedule_memory_notifications(
  p_memory_id uuid,
  p_tenant_id uuid,
  p_memory_date timestamptz,
  p_offsets jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offset text;
  v_scheduled timestamptz;
begin
  if p_memory_date is null or p_offsets is null then
    return;
  end if;

  for v_offset in select jsonb_array_elements_text(p_offsets)
  loop
    v_scheduled := p_memory_date;
    if v_offset = '14_days_before' then v_scheduled := p_memory_date - interval '14 days';
    elsif v_offset = '7_days_before' then v_scheduled := p_memory_date - interval '7 days';
    elsif v_offset = '1_day_before' then v_scheduled := p_memory_date - interval '1 day';
    elsif v_offset = 'same_day' then v_scheduled := p_memory_date;
    elsif v_offset = 'next_week' then v_scheduled := now() + interval '7 days';
    end if;

    insert into public.memory_notifications (
      memory_id, tenant_id, notification_type, scheduled_for
    )
    values (p_memory_id, p_tenant_id, 'in_app', v_scheduled);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Record personal memory (replaces record_assistant_memory)
-- ---------------------------------------------------------------------------
create or replace function public.record_assistant_memory(
  p_category text,
  p_title text,
  p_summary text,
  p_event_date date default null,
  p_intent_key text default 'general',
  p_reminder_offsets jsonb default '[]'::jsonb,
  p_expires_at timestamptz default null,
  p_recurrence text default null,
  p_source text default 'explicit',
  p_confidence_score integer default 70,
  p_person_name text default null,
  p_relationship text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_assistant_settings;
  v_id uuid;
  v_user_id uuid;
  v_confidence text;
  v_memory_ts timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_settings := public.ensure_customer_assistant_settings(v_tenant_id);
  if not v_settings.memory_enabled then
    raise exception 'Assistant memory is disabled';
  end if;

  if p_category not in ('important_people', 'events', 'tasks', 'habits', 'goals') then
    raise exception 'Invalid memory category';
  end if;

  if coalesce((v_settings.categories_enabled ->> p_category)::boolean, true) = false then
    raise exception 'Memory category is disabled';
  end if;

  v_confidence := case
    when coalesce(p_confidence_score, 70) >= 80 or p_source = 'explicit' then 'high'
    when coalesce(p_confidence_score, 70) >= 50 then 'medium'
    else 'low'
  end;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_memory_ts := p_event_date::timestamptz;

  insert into public.personal_memories (
    tenant_id, user_id, category, title, description, memory_date,
    recurring, recurrence_rule, confidence_level, reminder_offsets
  )
  values (
    v_tenant_id, v_user_id, p_category,
    left(p_title, 200), left(p_summary, 500),
    v_memory_ts, p_recurrence is not null, p_recurrence, v_confidence,
    coalesce(p_reminder_offsets, '[]'::jsonb)
  )
  returning id into v_id;

  if p_category = 'important_people' and p_person_name is not null then
    insert into public.important_people (
      tenant_id, user_id, name, relationship, birthday, notes, memory_id
    )
    values (
      v_tenant_id, v_user_id, p_person_name, p_relationship,
      p_event_date, left(p_summary, 300), v_id
    );
  end if;

  perform public._schedule_memory_notifications(
    v_id, v_tenant_id, v_memory_ts, coalesce(p_reminder_offsets, '[]'::jsonb)
  );

  insert into public.customer_assistant_memory_reviews (
    tenant_id, memory_id, action_type, actor_user_id, notes
  )
  values (v_tenant_id, v_id, 'recorded', v_user_id, p_category);

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Memory status controls
-- ---------------------------------------------------------------------------
create or replace function public.update_personal_memory_status(
  p_memory_id uuid,
  p_status text
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

  if p_status not in ('active', 'completed', 'archived', 'deleted', 'paused') then
    raise exception 'Invalid status';
  end if;

  update public.personal_memories
  set status = p_status, updated_at = now()
  where id = p_memory_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Memory not found';
  end if;

  if p_status = 'paused' then
    update public.memory_notifications
    set status = 'paused'
    where memory_id = p_memory_id and status = 'pending';
  end if;

  if p_status in ('deleted', 'completed') then
    update public.memory_notifications
    set status = 'cancelled'
    where memory_id = p_memory_id and status = 'pending';
  end if;

  return jsonb_build_object('ok', true, 'status', p_status);
end;
$$;

grant execute on function public.update_personal_memory_status(uuid, text) to authenticated;

create or replace function public.remove_assistant_memory(p_memory_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.update_personal_memory_status(p_memory_id, 'deleted');
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Assistant center with PAME dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_assistant_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_assistant_settings;
  v_memories jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_customer_assistant_settings(v_tenant_id);

  v_memories := coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', m.id,
      'category', m.category,
      'title', m.title,
      'description', m.description,
      'memory_date', m.memory_date,
      'recurring', m.recurring,
      'recurrence_rule', m.recurrence_rule,
      'status', m.status,
      'confidence_level', m.confidence_level,
      'reminder_offsets', m.reminder_offsets,
      'created_at', m.created_at,
      'updated_at', m.updated_at
    ) order by m.created_at desc)
    from public.personal_memories m
    where m.tenant_id = v_tenant_id and m.status not in ('deleted')
    limit 100),
    '[]'::jsonb
  );

  return jsonb_build_object(
    'has_customer', true,
    'ask_before_remembering', v_settings.ask_before_remembering,
    'categories_enabled', v_settings.categories_enabled,
    'memory_enabled', v_settings.memory_enabled,
    'memories', v_memories,
    'important_people', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ip.id, 'name', ip.name, 'relationship', ip.relationship,
        'birthday', ip.birthday, 'notes', ip.notes
      ))
      from public.important_people ip
      where ip.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'dashboard', jsonb_build_object(
      'important_people', coalesce(
        (select jsonb_agg(row order by row ->> 'memory_date')
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.category = 'important_people'
            and m.status = 'active'
        ) sub),
        '[]'::jsonb
      ),
      'upcoming_events', coalesce(
        (select jsonb_agg(row order by row ->> 'memory_date')
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.category = 'events'
            and m.status = 'active' and m.memory_date >= now()
          limit 10
        ) sub),
        '[]'::jsonb
      ),
      'active_tasks', coalesce(
        (select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.category = 'tasks'
            and m.status = 'active'
        ) sub),
        '[]'::jsonb
      ),
      'recurring_reminders', coalesce(
        (select jsonb_agg(row)
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id
            and (m.category = 'habits' or m.recurring = true)
            and m.status = 'active'
        ) sub),
        '[]'::jsonb
      ),
      'completed_items', coalesce(
        (select jsonb_agg(row order by row ->> 'updated_at' desc)
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.status = 'completed'
          limit 10
        ) sub),
        '[]'::jsonb
      ),
      'recently_added', coalesce(
        (select jsonb_agg(row order by row ->> 'created_at' desc)
        from (
          select jsonb_build_object(
            'id', m.id, 'category', m.category, 'title', m.title,
            'description', m.description, 'memory_date', m.memory_date,
            'status', m.status, 'confidence_level', m.confidence_level,
            'reminder_offsets', m.reminder_offsets, 'recurring', m.recurring,
            'recurrence_rule', m.recurrence_rule, 'created_at', m.created_at,
            'updated_at', m.updated_at
          ) as row
          from public.personal_memories m
          where m.tenant_id = v_tenant_id and m.status = 'active'
          order by m.created_at desc
          limit 5
        ) sub),
        '[]'::jsonb
      )
    ),
    'proactive_suggestions', coalesce(
      (select jsonb_agg(jsonb_build_object('id', m.id, 'message',
        case
          when m.category = 'important_people' and m.memory_date <= now() + interval '30 days'
            then format('You mentioned %s is coming up. Would you like help planning?', m.title)
          when m.category = 'tasks' and m.created_at < now() - interval '5 days'
            then format('You have not followed up yet: %s. Schedule time for it?', m.title)
          when m.category = 'habits' and extract(day from now()) >= 28
            then 'You usually review finances at month-end. Should I prepare your checklist?'
          else format('Still relevant: %s', m.title)
        end
      ))
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'
      limit 5),
      '[]'::jsonb
    ),
    'pending_count', (
      select count(*) from public.personal_memories
      where tenant_id = v_tenant_id and status = 'active'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Export from personal_memories
-- ---------------------------------------------------------------------------
create or replace function public.export_assistant_memories()
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
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.customer_assistant_memory_reviews (
    tenant_id, action_type, actor_user_id, notes
  )
  values (v_tenant_id, 'exported', v_user_id, 'user_export');

  return jsonb_build_object(
    'exported_at', now(),
    'memories', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'category', m.category, 'title', m.title, 'description', m.description,
        'memory_date', m.memory_date, 'status', m.status,
        'reminder_offsets', m.reminder_offsets, 'recurrence_rule', m.recurrence_rule,
        'created_at', m.created_at
      ) order by m.created_at)
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.status not in ('deleted')),
      '[]'::jsonb
    ),
    'important_people', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'name', ip.name, 'relationship', ip.relationship,
        'birthday', ip.birthday, 'notes', ip.notes
      ))
      from public.important_people ip where ip.tenant_id = v_tenant_id),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Platform overview — aggregates only, no user memory content
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_assistant_memory_overview()
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
    'privacy_note', 'Administrators cannot access user memory content. Aggregates only.',
    'active_memories', (
      select count(*) from public.personal_memories where status = 'active'
    ),
    'tenants_with_memory', (
      select count(distinct tenant_id) from public.personal_memories where status = 'active'
    ),
    'pending_notifications', (
      select count(*) from public.memory_notifications where status = 'pending'
    ),
    'by_category', coalesce(
      (select jsonb_object_agg(category, cnt)
      from (
        select category, count(*)::integer as cnt
        from public.personal_memories where status = 'active'
        group by category
      ) sub),
      '{}'::jsonb
    ),
    'memory_disabled_tenants', (
      select count(*) from public.customer_assistant_settings where memory_enabled = false
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Seed Unonight PAME data
-- ---------------------------------------------------------------------------
insert into public.personal_memories (
  tenant_id, category, title, description, memory_date,
  recurring, recurrence_rule, confidence_level, reminder_offsets
)
select c.id, 'important_people', 'Wife''s birthday',
  'Birthday on April 3rd — reminders before the date.',
  make_timestamptz(extract(year from current_date)::integer, 4, 3, 9, 0, 0),
  true, 'annual', 'high', '["14_days_before","7_days_before","1_day_before"]'::jsonb
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
  and not exists (
    select 1 from public.personal_memories p
    where p.tenant_id = c.id and p.title = 'Wife''s birthday' and p.status = 'active'
  );

insert into public.important_people (tenant_id, name, relationship, birthday, notes)
select c.id, 'Wife', 'wife', make_date(extract(year from current_date)::integer, 4, 3),
  'Birthday reminders enabled.'
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
  and not exists (
    select 1 from public.important_people ip
    where ip.tenant_id = c.id and ip.name = 'Wife'
  );

grant execute on function public.record_assistant_memory(
  text, text, text, date, text, jsonb, timestamptz, text, text, integer, text, text
) to authenticated;

-- Phase 33 — Relationship & Social Intelligence Engine (RSI)
-- Builds on PAME important_people. Strengthens connection — never impersonates the user.

-- ---------------------------------------------------------------------------
-- 1. relationship_settings — user control
-- ---------------------------------------------------------------------------
create table if not exists public.relationship_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  rsi_enabled boolean not null default true,
  ask_before_remembering boolean not null default true,
  gift_suggestions_enabled boolean not null default true,
  follow_up_enabled boolean not null default true,
  shared_memory_prepared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.relationship_settings enable row level security;
revoke all on public.relationship_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Extend important_people directory
-- ---------------------------------------------------------------------------
alter table public.important_people
  add column if not exists person_type text default 'friend' check (
    person_type in (
      'partner', 'child', 'parent', 'friend',
      'colleague', 'client', 'mentor', 'other'
    )
  ),
  add column if not exists anniversary date,
  add column if not exists preferred_gifts jsonb not null default '[]'::jsonb,
  add column if not exists favorite_activities jsonb not null default '[]'::jsonb,
  add column if not exists communication_preferences text,
  add column if not exists milestone_notes text,
  add column if not exists last_contact_at timestamptz,
  add column if not exists status text not null default 'active' check (
    status in ('active', 'paused', 'archived')
  );

-- ---------------------------------------------------------------------------
-- 3. relationship_notes — conversation tags (explicit approval required)
-- ---------------------------------------------------------------------------
create table if not exists public.relationship_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  person_id uuid not null references public.important_people (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  topic text not null,
  tags jsonb not null default '[]'::jsonb,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.relationship_notes enable row level security;
revoke all on public.relationship_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. relationship_timeline — per-person events
-- ---------------------------------------------------------------------------
create table if not exists public.relationship_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  person_id uuid not null references public.important_people (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'birthday', 'anniversary', 'milestone', 'reminder',
      'commitment', 'conversation', 'gift'
    )
  ),
  title text not null,
  description text not null default '',
  event_date timestamptz,
  memory_id uuid references public.personal_memories (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists relationship_timeline_person_idx
  on public.relationship_timeline (tenant_id, person_id, event_date desc);

alter table public.relationship_timeline enable row level security;
revoke all on public.relationship_timeline from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. shared_memory_spaces — future architecture (consent-gated scaffold)
-- ---------------------------------------------------------------------------
create table if not exists public.shared_memory_spaces (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  space_type text not null default 'household' check (
    space_type in ('couple', 'family', 'household', 'caregiver')
  ),
  status text not null default 'pending_consent' check (
    status in ('pending_consent', 'active', 'paused', 'archived')
  ),
  consent_note text not null default 'Requires explicit approval from all participants.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shared_memory_spaces enable row level security;
revoke all on public.shared_memory_spaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_relationship_settings(p_tenant_id uuid)
returns public.relationship_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.relationship_settings;
begin
  insert into public.relationship_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row from public.relationship_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public._sync_person_timeline(
  p_person_id uuid,
  p_tenant_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_person public.important_people;
begin
  select * into v_person from public.important_people
  where id = p_person_id and tenant_id = p_tenant_id;

  if v_person.birthday is not null and not exists (
    select 1 from public.relationship_timeline
    where person_id = p_person_id and event_type = 'birthday'
  ) then
    insert into public.relationship_timeline (
      tenant_id, person_id, event_type, title, event_date
    )
    values (
      p_tenant_id, p_person_id, 'birthday',
      format('%s birthday', v_person.name),
      v_person.birthday::timestamptz
    );
  end if;

  if v_person.anniversary is not null and not exists (
    select 1 from public.relationship_timeline
    where person_id = p_person_id and event_type = 'anniversary'
  ) then
    insert into public.relationship_timeline (
      tenant_id, person_id, event_type, title, event_date
    )
    values (
      p_tenant_id, p_person_id, 'anniversary',
      format('%s anniversary', v_person.name),
      v_person.anniversary::timestamptz
    );
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Upsert relationship person
-- ---------------------------------------------------------------------------
create or replace function public.upsert_relationship_person(
  p_person_id uuid default null,
  p_name text default null,
  p_relationship text default null,
  p_person_type text default 'friend',
  p_birthday date default null,
  p_anniversary date default null,
  p_notes text default null,
  p_preferred_gifts jsonb default '[]'::jsonb,
  p_favorite_activities jsonb default '[]'::jsonb,
  p_communication_preferences text default null
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
  v_settings public.relationship_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  v_settings := public.ensure_relationship_settings(v_tenant_id);
  if not v_settings.rsi_enabled then raise exception 'Relationship assistance is disabled'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  if p_person_id is not null then
    update public.important_people
    set
      name = coalesce(p_name, name),
      relationship = coalesce(p_relationship, relationship),
      person_type = coalesce(p_person_type, person_type),
      birthday = coalesce(p_birthday, birthday),
      anniversary = coalesce(p_anniversary, anniversary),
      notes = coalesce(left(p_notes, 500), notes),
      preferred_gifts = coalesce(p_preferred_gifts, preferred_gifts),
      favorite_activities = coalesce(p_favorite_activities, favorite_activities),
      communication_preferences = coalesce(p_communication_preferences, communication_preferences),
      updated_at = now()
    where id = p_person_id and tenant_id = v_tenant_id
    returning id into v_id;
  else
    if p_name is null or trim(p_name) = '' then
      raise exception 'Name required';
    end if;
    insert into public.important_people (
      tenant_id, user_id, name, relationship, person_type,
      birthday, anniversary, notes, preferred_gifts,
      favorite_activities, communication_preferences
    )
    values (
      v_tenant_id, v_user_id, trim(p_name), p_relationship, p_person_type,
      p_birthday, p_anniversary, left(coalesce(p_notes, ''), 500),
      coalesce(p_preferred_gifts, '[]'::jsonb),
      coalesce(p_favorite_activities, '[]'::jsonb),
      p_communication_preferences
    )
    returning id into v_id;
  end if;

  perform public._sync_person_timeline(v_id, v_tenant_id);
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Remove / pause person
-- ---------------------------------------------------------------------------
create or replace function public.update_relationship_person_status(
  p_person_id uuid,
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
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  if p_status not in ('active', 'paused', 'archived') then
    raise exception 'Invalid status';
  end if;

  update public.important_people
  set status = p_status, updated_at = now()
  where id = p_person_id and tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Record conversation note (requires approval flag)
-- ---------------------------------------------------------------------------
create or replace function public.record_relationship_note(
  p_person_id uuid,
  p_topic text,
  p_tags jsonb default '[]'::jsonb,
  p_approved boolean default false
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
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  if not p_approved then
    raise exception 'Conversation notes require explicit approval';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.relationship_notes (
    tenant_id, person_id, user_id, topic, tags, approved
  )
  values (
    v_tenant_id, p_person_id, v_user_id,
    left(p_topic, 300), coalesce(p_tags, '[]'::jsonb), true
  )
  returning id into v_id;

  insert into public.relationship_timeline (
    tenant_id, person_id, event_type, title, description
  )
  values (
    v_tenant_id, p_person_id, 'conversation',
    left(p_topic, 200), 'Remembered with your approval.'
  );

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Update relationship settings
-- ---------------------------------------------------------------------------
create or replace function public.update_relationship_settings(
  p_rsi_enabled boolean default null,
  p_ask_before_remembering boolean default null,
  p_gift_suggestions_enabled boolean default null,
  p_follow_up_enabled boolean default null
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
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  perform public.ensure_relationship_settings(v_tenant_id);

  update public.relationship_settings
  set
    rsi_enabled = coalesce(p_rsi_enabled, rsi_enabled),
    ask_before_remembering = coalesce(p_ask_before_remembering, ask_before_remembering),
    gift_suggestions_enabled = coalesce(p_gift_suggestions_enabled, gift_suggestions_enabled),
    follow_up_enabled = coalesce(p_follow_up_enabled, follow_up_enabled),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. get_customer_relationship_center — RSI dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_relationship_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.relationship_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_relationship_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'rsi_enabled', v_settings.rsi_enabled,
      'ask_before_remembering', v_settings.ask_before_remembering,
      'gift_suggestions_enabled', v_settings.gift_suggestions_enabled,
      'follow_up_enabled', v_settings.follow_up_enabled,
      'shared_memory_prepared', v_settings.shared_memory_prepared
    ),
    'ethical_boundaries', jsonb_build_array(
      'Never impersonate the user',
      'Never send personal messages automatically',
      'Never manipulate relationships',
      'Suggestions only — you always decide'
    ),
    'privacy_note', 'Relationship data is private and belongs exclusively to you.',
    'people', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ip.id, 'name', ip.name, 'relationship', ip.relationship,
        'person_type', ip.person_type, 'birthday', ip.birthday,
        'anniversary', ip.anniversary, 'notes', ip.notes,
        'preferred_gifts', ip.preferred_gifts,
        'favorite_activities', ip.favorite_activities,
        'communication_preferences', ip.communication_preferences,
        'last_contact_at', ip.last_contact_at, 'status', ip.status,
        'timeline', coalesce(
          (select jsonb_agg(jsonb_build_object(
            'id', t.id, 'event_type', t.event_type, 'title', t.title,
            'description', t.description, 'event_date', t.event_date
          ) order by t.event_date desc nulls last)
          from public.relationship_timeline t
          where t.person_id = ip.id limit 10),
          '[]'::jsonb
        ),
        'notes', coalesce(
          (select jsonb_agg(jsonb_build_object(
            'id', n.id, 'topic', n.topic, 'tags', n.tags, 'created_at', n.created_at
          ) order by n.created_at desc)
          from public.relationship_notes n
          where n.person_id = ip.id and n.approved = true limit 5),
          '[]'::jsonb
        )
      ) order by ip.name)
      from public.important_people ip
      where ip.tenant_id = v_tenant_id and ip.status != 'archived'),
      '[]'::jsonb
    ),
    'upcoming_milestones', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ip.id, 'name', ip.name, 'type',
        case when ip.birthday between current_date and current_date + 30
          then 'birthday' else 'anniversary' end,
        'date', coalesce(
          case when ip.birthday between current_date and current_date + 30 then ip.birthday end,
          ip.anniversary
        ),
        'message', format('%s is coming up soon.', ip.name)
      ) order by coalesce(ip.birthday, ip.anniversary))
      from public.important_people ip
      where ip.tenant_id = v_tenant_id and ip.status = 'active'
        and (
          ip.birthday between current_date and current_date + 30
          or ip.anniversary between current_date and current_date + 30
        )),
      '[]'::jsonb
    ),
    'social_reminders', coalesce(
      (select jsonb_agg(jsonb_build_object('id', s.id, 'message', s.msg))
      from (
        select ip.id,
          case
            when ip.birthday between current_date and current_date + 7 then
              format('Your %s''s birthday is next week.', coalesce(ip.relationship, ip.name))
            when ip.anniversary between current_date and current_date + 14 then
              format('Your wedding anniversary with %s is approaching.', ip.name)
            when ip.last_contact_at is null and ip.created_at < now() - interval '30 days' then
              format('You haven''t logged contact with %s in a while.', ip.name)
            when ip.last_contact_at < now() - interval '60 days' then
              format('You haven''t spoken to %s in a while.', ip.name)
            else null
          end as msg
        from public.important_people ip
        where ip.tenant_id = v_tenant_id and ip.status = 'active'
      ) s where s.msg is not null
      union all
      select m.id,
        format('Your client follow-up is overdue: %s', m.title)
      from public.personal_memories m
      join public.life_memory_meta lm on lm.memory_id = m.id
      where m.tenant_id = v_tenant_id and m.status = 'active'
        and m.category = 'tasks' and lm.life_area = 'work'
        and m.created_at < now() - interval '5 days'
        and m.title ~* 'follow|client|call'
      limit 8),
      '[]'::jsonb
    ),
    'pending_follow_ups', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'title', m.title, 'message',
        format('You planned to: %s', m.title)
      ))
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'
        and m.category = 'tasks'
        and m.created_at < now() - interval '7 days'
        and (m.description ~* 'call|congratulate|check in|mother|father|friend|colleague|client')
      limit 10),
      '[]'::jsonb
    ),
    'gift_opportunities', case when v_settings.gift_suggestions_enabled then coalesce(
      (select jsonb_agg(jsonb_build_object(
        'person_id', ip.id, 'name', ip.name,
        'message',
        case
          when jsonb_array_length(ip.favorite_activities) > 0 then
            format('You mentioned %s enjoys %s. Would you like gift suggestions?',
              ip.name, ip.favorite_activities ->> 0)
          when ip.birthday between current_date and current_date + 14 then
            format('%s''s birthday is soon. Would you like gift suggestions?', ip.name)
          else format('Would you like gift ideas for %s?', ip.name)
        end,
        'preferred_gifts', ip.preferred_gifts,
        'favorite_activities', ip.favorite_activities
      ))
      from public.important_people ip
      where ip.tenant_id = v_tenant_id and ip.status = 'active'
        and (
          ip.birthday between current_date and current_date + 21
          or jsonb_array_length(ip.favorite_activities) > 0
        )
      limit 5),
      '[]'::jsonb
    ) else '[]'::jsonb end,
    'suggested_actions', coalesce(
      (select jsonb_agg(jsonb_build_object('id', a.id, 'message', a.msg))
      from (
        select ip.id,
          format('Would you like me to remind you to buy flowers for %s?', ip.name) as msg
        from public.important_people ip
        where ip.tenant_id = v_tenant_id and ip.status = 'active'
          and ip.anniversary between current_date and current_date + 7
        union all
        select ip.id,
          format('Would you like to schedule time to prepare for %s''s birthday?', ip.name)
        from public.important_people ip
        where ip.tenant_id = v_tenant_id and ip.status = 'active'
          and ip.birthday between current_date and current_date + 14
        union all
        select m.id,
          'Would you like me to add this to your planning checklist?' as msg
        from public.personal_memories m
        where m.tenant_id = v_tenant_id and m.status = 'active'
          and m.category = 'important_people'
          and m.memory_date between now() and now() + interval '14 days'
        limit 6
      ) a),
      '[]'::jsonb
    ),
    'proactive_assistance', coalesce(
      (select jsonb_agg(jsonb_build_object('id', p.id, 'message', p.msg))
      from (
        select ip.id,
          'You usually prepare birthday gifts two weeks in advance. Would you like a preparation overview?' as msg
        from public.important_people ip
        where ip.tenant_id = v_tenant_id and ip.status = 'active'
          and ip.birthday between current_date and current_date + 21
        union all
        select count(*)::text::uuid,
          format('You have %s family events next month. Would you like a preparation overview?',
            count(*))
        from public.important_people ip
        where ip.tenant_id = v_tenant_id and ip.status = 'active'
          and ip.person_type in ('partner', 'child', 'parent')
          and (ip.birthday between current_date and current_date + 30
            or ip.anniversary between current_date and current_date + 30)
        having count(*) >= 2
        limit 4
      ) p),
      '[]'::jsonb
    ),
    'shared_commitments', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id, 'title', m.title, 'memory_date', m.memory_date
      ) order by m.memory_date)
      from public.personal_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'
        and m.category in ('important_people', 'events')
        and m.memory_date >= now()
      limit 10),
      '[]'::jsonb
    ),
    'shared_memory_architecture', jsonb_build_object(
      'prepared', true,
      'status', 'pending_consent',
      'message', 'Shared memories require explicit approval from all involved parties.',
      'future_types', jsonb_build_array('couple', 'family', 'household', 'caregiver')
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Export relationship data
-- ---------------------------------------------------------------------------
create or replace function public.export_relationship_data()
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
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  return jsonb_build_object(
    'exported_at', now(),
    'people', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'name', ip.name, 'relationship', ip.relationship,
        'person_type', ip.person_type, 'birthday', ip.birthday,
        'anniversary', ip.anniversary, 'notes', ip.notes,
        'preferred_gifts', ip.preferred_gifts,
        'favorite_activities', ip.favorite_activities
      ))
      from public.important_people ip
      where ip.tenant_id = v_tenant_id and ip.status != 'archived'),
      '[]'::jsonb
    ),
    'notes', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'person_id', n.person_id, 'topic', n.topic, 'tags', n.tags
      ))
      from public.relationship_notes n
      where n.tenant_id = v_tenant_id and n.approved = true),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Platform overview — aggregates only
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_relationship_overview()
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
    'privacy_note', 'Administrators cannot access relationship data. Aggregates only.',
    'tenants_with_rsi', (select count(*) from public.relationship_settings),
    'active_people', (
      select count(*) from public.important_people where status = 'active'
    ),
    'approved_notes', (
      select count(*) from public.relationship_notes where approved = true
    ),
    'timeline_events', (select count(*) from public.relationship_timeline),
    'rsi_disabled_tenants', (
      select count(*) from public.relationship_settings where rsi_enabled = false
    ),
    'shared_spaces_pending', (
      select count(*) from public.shared_memory_spaces where status = 'pending_consent'
    ),
    'by_person_type', coalesce(
      (select jsonb_object_agg(person_type, cnt)
      from (
        select person_type, count(*)::integer as cnt
        from public.important_people where status = 'active'
        group by person_type
      ) sub),
      '{}'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. Seed RSI data for pilot tenant
-- ---------------------------------------------------------------------------
update public.important_people ip
set
  person_type = 'partner',
  favorite_activities = '["spa experiences"]'::jsonb,
  anniversary = make_date(extract(year from current_date)::integer, 6, 15)
from public.customers c
where ip.tenant_id = c.id and c.slug = 'unonight' and ip.name = 'Wife';

do $$
declare
  v_person_id uuid;
  v_tenant_id uuid;
begin
  select ip.id, ip.tenant_id into v_person_id, v_tenant_id
  from public.important_people ip
  join public.customers c on c.id = ip.tenant_id
  where c.slug = 'unonight' and ip.name = 'Wife'
  limit 1;

  if v_person_id is not null then
    perform public._sync_person_timeline(v_person_id, v_tenant_id);
  end if;
end;
$$;

grant execute on function public.ensure_relationship_settings(uuid) to authenticated;
grant execute on function public.upsert_relationship_person(
  uuid, text, text, text, date, date, text, jsonb, jsonb, text
) to authenticated;
grant execute on function public.update_relationship_person_status(uuid, text) to authenticated;
grant execute on function public.record_relationship_note(uuid, text, jsonb, boolean) to authenticated;
grant execute on function public.update_relationship_settings(boolean, boolean, boolean, boolean) to authenticated;
grant execute on function public.get_customer_relationship_center() to authenticated;
grant execute on function public.export_relationship_data() to authenticated;
grant execute on function public.get_platform_relationship_overview() to authenticated;

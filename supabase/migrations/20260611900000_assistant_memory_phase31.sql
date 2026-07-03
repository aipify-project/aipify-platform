-- Phase 31 — Assistant Memory (natural human communication layer)

-- ---------------------------------------------------------------------------
-- 1. Assistant settings (per tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_assistant_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  ask_before_remembering boolean not null default true,
  categories_enabled jsonb not null default '{
    "personal": true, "work": true, "temporary": true, "recurring": true
  }'::jsonb,
  memory_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.customer_assistant_settings enable row level security;
revoke all on public.customer_assistant_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Assistant memories (metadata only — no raw conversations)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_assistant_memories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  category text not null check (
    category in ('personal', 'work', 'temporary', 'recurring')
  ),
  title text not null,
  summary text not null,
  event_date date,
  intent_key text not null default 'general',
  reminder_offsets jsonb not null default '[]'::jsonb,
  expires_at timestamptz,
  recurrence text,
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  source text not null default 'explicit' check (source in ('explicit', 'inferred')),
  status text not null default 'active' check (status in ('active', 'archived', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_assistant_memories_tenant_idx
  on public.customer_assistant_memories (tenant_id, status, created_at desc);

alter table public.customer_assistant_memories enable row level security;
revoke all on public.customer_assistant_memories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Memory review audit
-- ---------------------------------------------------------------------------
create table if not exists public.customer_assistant_memory_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_id uuid references public.customer_assistant_memories (id) on delete set null,
  action_type text not null check (
    action_type in ('recorded', 'updated', 'removed', 'exported', 'category_disabled')
  ),
  actor_user_id uuid references public.users (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.customer_assistant_memory_reviews enable row level security;
revoke all on public.customer_assistant_memory_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.ensure_customer_assistant_settings(p_tenant_id uuid)
returns public.customer_assistant_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.customer_assistant_settings;
begin
  insert into public.customer_assistant_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row from public.customer_assistant_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

grant execute on function public.ensure_customer_assistant_settings(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Record assistant memory
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
  p_confidence_score integer default 70
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
  v_expires timestamptz;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_settings := public.ensure_customer_assistant_settings(v_tenant_id);

  if not v_settings.memory_enabled then
    raise exception 'Assistant memory is disabled';
  end if;

  if coalesce((v_settings.categories_enabled ->> p_category)::boolean, true) = false then
    raise exception 'Memory category is disabled';
  end if;

  if p_category not in ('personal', 'work', 'temporary', 'recurring') then
    raise exception 'Invalid memory category';
  end if;

  select u.id into v_user_id
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  v_expires := p_expires_at;
  if p_category = 'temporary' and v_expires is null then
    v_expires := now() + interval '14 days';
  end if;

  insert into public.customer_assistant_memories (
    tenant_id, user_id, category, title, summary, event_date,
    intent_key, reminder_offsets, expires_at, recurrence,
    confidence_score, source
  )
  values (
    v_tenant_id, v_user_id, p_category,
    left(p_title, 200), left(p_summary, 500),
    p_event_date, coalesce(p_intent_key, 'general'),
    coalesce(p_reminder_offsets, '[]'::jsonb),
    v_expires, p_recurrence,
    coalesce(p_confidence_score, 70),
    coalesce(p_source, 'explicit')
  )
  returning id into v_id;

  insert into public.customer_assistant_memory_reviews (
    tenant_id, memory_id, action_type, actor_user_id, notes
  )
  values (v_tenant_id, v_id, 'recorded', v_user_id, p_category);

  return v_id;
end;
$$;

grant execute on function public.record_assistant_memory(
  text, text, text, date, text, jsonb, timestamptz, text, text, integer
) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Remove / update memory
-- ---------------------------------------------------------------------------
create or replace function public.remove_assistant_memory(p_memory_id uuid)
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
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  update public.customer_assistant_memories
  set status = 'removed', updated_at = now()
  where id = p_memory_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Memory not found';
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  insert into public.customer_assistant_memory_reviews (
    tenant_id, memory_id, action_type, actor_user_id
  )
  values (v_tenant_id, p_memory_id, 'removed', v_user_id);

  return jsonb_build_object('removed', true);
end;
$$;

grant execute on function public.remove_assistant_memory(uuid) to authenticated;

create or replace function public.update_assistant_memory_settings(
  p_ask_before_remembering boolean default null,
  p_categories_enabled jsonb default null,
  p_memory_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.customer_assistant_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_settings := public.ensure_customer_assistant_settings(v_tenant_id);

  update public.customer_assistant_settings
  set
    ask_before_remembering = coalesce(p_ask_before_remembering, ask_before_remembering),
    categories_enabled = coalesce(p_categories_enabled, categories_enabled),
    memory_enabled = coalesce(p_memory_enabled, memory_enabled),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_settings;

  return jsonb_build_object(
    'ask_before_remembering', v_settings.ask_before_remembering,
    'categories_enabled', v_settings.categories_enabled,
    'memory_enabled', v_settings.memory_enabled
  );
end;
$$;

grant execute on function public.update_assistant_memory_settings(boolean, jsonb, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Assistant center bundle
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
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public.ensure_customer_assistant_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'ask_before_remembering', v_settings.ask_before_remembering,
    'categories_enabled', v_settings.categories_enabled,
    'memory_enabled', v_settings.memory_enabled,
    'memories', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'category', m.category,
        'title', m.title,
        'summary', m.summary,
        'event_date', m.event_date,
        'intent_key', m.intent_key,
        'reminder_offsets', m.reminder_offsets,
        'expires_at', m.expires_at,
        'recurrence', m.recurrence,
        'confidence_score', m.confidence_score,
        'source', m.source,
        'status', m.status,
        'created_at', m.created_at,
        'updated_at', m.updated_at
      ) order by m.created_at desc)
      from public.customer_assistant_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'
      limit 50),
      '[]'::jsonb
    ),
    'proactive_suggestions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'message', case
          when m.event_date is not null and m.event_date <= current_date + 14
            then format('You mentioned %s is coming up. Would you like a reminder?', m.title)
          when m.category = 'work' and m.created_at < now() - interval '5 days'
            then format('This follow-up has been open for a while: %s', m.title)
          else format('Still relevant: %s', m.title)
        end
      ))
      from public.customer_assistant_memories m
      where m.tenant_id = v_tenant_id
        and m.status = 'active'
        and (
          (m.event_date is not null and m.event_date <= current_date + 14)
          or (m.category = 'work' and m.created_at < now() - interval '5 days')
        )
      limit 5),
      '[]'::jsonb
    ),
    'pending_count', (
      select count(*) from public.customer_assistant_memories
      where tenant_id = v_tenant_id and status = 'active'
    )
  );
end;
$$;

grant execute on function public.get_customer_assistant_center() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Export memories (tenant-scoped)
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
        'category', m.category,
        'title', m.title,
        'summary', m.summary,
        'event_date', m.event_date,
        'reminder_offsets', m.reminder_offsets,
        'recurrence', m.recurrence,
        'created_at', m.created_at
      ) order by m.created_at)
      from public.customer_assistant_memories m
      where m.tenant_id = v_tenant_id and m.status = 'active'),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.export_assistant_memories() to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Platform overview
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
    'active_memories', (
      select count(*) from public.customer_assistant_memories where status = 'active'
    ),
    'tenants_with_memory', (
      select count(distinct tenant_id) from public.customer_assistant_memories where status = 'active'
    ),
    'by_category', coalesce(
      (select jsonb_object_agg(category, cnt)
      from (
        select category, count(*)::integer as cnt
        from public.customer_assistant_memories
        where status = 'active'
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

grant execute on function public.get_platform_assistant_memory_overview() to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Seed Unonight pilot memory
-- ---------------------------------------------------------------------------
insert into public.customer_assistant_settings (tenant_id)
select c.id
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
on conflict (tenant_id) do nothing;

insert into public.customer_assistant_memories (
  tenant_id, category, title, summary, event_date, intent_key,
  reminder_offsets, recurrence, source, confidence_score
)
select c.id, 'personal', 'Wife''s birthday',
  'Birthday on April 3rd — user asked for reminders before the date.',
  make_date(extract(year from current_date)::integer, 4, 3),
  'remember', '["14_days_before","7_days_before","1_day_before"]'::jsonb,
  'annual', 'explicit', 92
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
  and not exists (
    select 1 from public.customer_assistant_memories m
    where m.tenant_id = c.id and m.title = 'Wife''s birthday' and m.status = 'active'
  );

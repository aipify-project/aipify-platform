-- Phase 50 — Organizational Memory Engine (OME)

-- ---------------------------------------------------------------------------
-- 1. aipify_memory_entries
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_memory_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null default 'operational' check (
    category in ('strategic_decision', 'project', 'operational', 'customer', 'improvement')
  ),
  title text not null,
  summary text not null default '',
  detailed_notes text not null default '',
  created_by text,
  memory_date date not null default current_date,
  tags_json jsonb not null default '[]'::jsonb,
  visibility_level text not null default 'personal' check (
    visibility_level in ('personal', 'tenant', 'department', 'executive')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_memory_entries_tenant_idx
  on public.aipify_memory_entries (tenant_id, memory_date desc);

create index if not exists aipify_memory_entries_search_idx
  on public.aipify_memory_entries using gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(detailed_notes, ''))
  );

alter table public.aipify_memory_entries enable row level security;
revoke all on public.aipify_memory_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_decision_records
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_decision_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_title text not null,
  decision_summary text not null default '',
  rationale text not null default '',
  alternatives_considered text not null default '',
  expected_outcome text not null default '',
  actual_outcome text not null default '',
  decision_owner text,
  decision_date date not null default current_date,
  visibility_level text not null default 'tenant' check (
    visibility_level in ('tenant', 'department', 'executive')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_decision_records_tenant_idx
  on public.aipify_decision_records (tenant_id, decision_date desc);

alter table public.aipify_decision_records enable row level security;
revoke all on public.aipify_decision_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_lessons_learned
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_lessons_learned (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  related_project text not null default '',
  what_worked text not null default '',
  what_did_not_work text not null default '',
  future_recommendations text not null default '',
  recorded_by text,
  lesson_date date not null default current_date,
  visibility_level text not null default 'tenant' check (
    visibility_level in ('tenant', 'department', 'executive')
  ),
  created_at timestamptz not null default now()
);

create index if not exists aipify_lessons_learned_tenant_idx
  on public.aipify_lessons_learned (tenant_id, created_at desc);

alter table public.aipify_lessons_learned enable row level security;
revoke all on public.aipify_lessons_learned from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ome_tenant_plan(p_tenant_id uuid)
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

create or replace function public._ome_starter_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select true;
$$;

create or replace function public._ome_business_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._ome_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._ome_enterprise_allows(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public._ome_tenant_plan(p_tenant_id) = 'enterprise';
$$;

create or replace function public._ome_auth_user_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid()::text;
$$;

create or replace function public._ome_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.role, 'staff')
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public._ome_can_view_visibility(
  p_visibility text,
  p_created_by text,
  p_tenant_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role text;
  v_user text;
begin
  v_role := public._ome_user_role();
  v_user := public._ome_auth_user_id();

  if p_visibility = 'personal' then
    return p_created_by = v_user or v_role in ('owner', 'admin');
  end if;

  if p_visibility = 'executive' then
    return public._ome_enterprise_allows(p_tenant_id)
      and v_role in ('owner', 'admin');
  end if;

  if p_visibility = 'department' then
    return public._ome_enterprise_allows(p_tenant_id)
      or public._ome_business_allows(p_tenant_id);
  end if;

  return public._ome_business_allows(p_tenant_id) or p_created_by = v_user;
end;
$$;

create or replace function public._ome_memory_entry_json(m public.aipify_memory_entries)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', m.id,
    'category', m.category,
    'title', m.title,
    'summary', m.summary,
    'detailed_notes', m.detailed_notes,
    'created_by', m.created_by,
    'memory_date', m.memory_date,
    'tags_json', m.tags_json,
    'visibility_level', m.visibility_level,
    'created_at', m.created_at,
    'updated_at', m.updated_at,
    'entry_type', 'memory'
  );
$$;

create or replace function public._ome_decision_json(d public.aipify_decision_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', d.id,
    'decision_title', d.decision_title,
    'decision_summary', d.decision_summary,
    'rationale', d.rationale,
    'alternatives_considered', d.alternatives_considered,
    'expected_outcome', d.expected_outcome,
    'actual_outcome', d.actual_outcome,
    'decision_owner', d.decision_owner,
    'decision_date', d.decision_date,
    'visibility_level', d.visibility_level,
    'created_at', d.created_at,
    'updated_at', d.updated_at,
    'entry_type', 'decision'
  );
$$;

create or replace function public._ome_lesson_json(l public.aipify_lessons_learned)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', l.id,
    'related_project', l.related_project,
    'what_worked', l.what_worked,
    'what_did_not_work', l.what_did_not_work,
    'future_recommendations', l.future_recommendations,
    'recorded_by', l.recorded_by,
    'lesson_date', l.lesson_date,
    'visibility_level', l.visibility_level,
    'created_at', l.created_at,
    'entry_type', 'lesson'
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. get_customer_organizational_memory_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_organizational_memory_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_business boolean;
  v_enterprise boolean;
  v_briefing text;
  v_since_login jsonb;
  v_entry_count integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._ome_tenant_plan(v_tenant_id);
  v_business := public._ome_business_allows(v_tenant_id);
  v_enterprise := public._ome_enterprise_allows(v_tenant_id);

  select count(*) into v_entry_count
  from public.aipify_memory_entries m
  where m.tenant_id = v_tenant_id
    and public._ome_can_view_visibility(m.visibility_level, m.created_by, v_tenant_id);

  if v_business then
    v_briefing := format(
      'Organizational memory contains %s preserved record(s). Aipify helps retain context, reasoning and lessons learned.',
      v_entry_count
    );
  else
    v_briefing := 'Capture personal notes and manual knowledge entries. Upgrade to Business Pro for organizational timeline and decision logging.';
  end if;

  v_since_login := coalesce(
    (select jsonb_agg(public._ome_memory_entry_json(m.*) order by m.created_at desc)
    from public.aipify_memory_entries m
    where m.tenant_id = v_tenant_id
      and m.created_at > now() - interval '7 days'
      and public._ome_can_view_visibility(m.visibility_level, m.created_by, v_tenant_id)
    limit 5),
    '[]'::jsonb
  );

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'plan', v_plan,
    'starter_mode', not v_business,
    'business_features', v_business,
    'enterprise_features', v_enterprise,
    'briefing', v_briefing,
    'since_last_login', v_since_login,
    'entry_count', v_entry_count,
    'recent_entries', coalesce(
      (select jsonb_agg(public._ome_memory_entry_json(m.*) order by m.memory_date desc)
      from public.aipify_memory_entries m
      where m.tenant_id = v_tenant_id
        and public._ome_can_view_visibility(m.visibility_level, m.created_by, v_tenant_id)
      limit 10),
      '[]'::jsonb
    ),
    'decisions', case when v_business then coalesce(
      (select jsonb_agg(public._ome_decision_json(d.*) order by d.decision_date desc)
      from public.aipify_decision_records d
      where d.tenant_id = v_tenant_id
        and public._ome_can_view_visibility(d.visibility_level, d.decision_owner, v_tenant_id)
      limit 8),
      '[]'::jsonb
    ) else '[]'::jsonb end,
    'lessons', case when v_business then coalesce(
      (select jsonb_agg(public._ome_lesson_json(l.*) order by l.lesson_date desc)
      from public.aipify_lessons_learned l
      where l.tenant_id = v_tenant_id
        and public._ome_can_view_visibility(l.visibility_level, l.recorded_by, v_tenant_id)
      limit 8),
      '[]'::jsonb
    ) else '[]'::jsonb end,
    'integration_context', jsonb_build_object(
      'completed_goals', coalesce(
        (select jsonb_agg(jsonb_build_object('title', sub.title, 'completed_at', sub.completed_at))
        from (
          select g.title, g.completed_at
          from public.aipify_goals g
          where g.tenant_id = v_tenant_id and g.status = 'completed'
          order by g.completed_at desc nulls last
          limit 3
        ) sub),
        '[]'::jsonb
      ),
      'implemented_friction', coalesce(
        (select jsonb_agg(jsonb_build_object('text', sub.recommendation_text, 'implemented_at', sub.implemented_at))
        from (
          select r.recommendation_text, r.implemented_at
          from public.aipify_friction_recommendations r
          where r.tenant_id = v_tenant_id and r.status = 'implemented'
          order by r.implemented_at desc nulls last
          limit 3
        ) sub),
        '[]'::jsonb
      ),
      'pulse_history', coalesce(
        (select jsonb_agg(jsonb_build_object('date', sub.pulse_date, 'summary', sub.summary_text))
        from (
          select s.pulse_date, s.summary_text
          from public.aipify_business_pulse_snapshots s
          where s.tenant_id = v_tenant_id
          order by s.pulse_date desc
          limit 3
        ) sub),
        '[]'::jsonb
      )
    ),
    'privacy_note', 'Memory is tenant-isolated with role-based visibility. Never used for employee surveillance.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Timeline & search
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_memory_timeline()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_timeline jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  v_timeline := coalesce(
    (select jsonb_agg(item order by (item->>'sort_date')::date desc)
    from (
      select public._ome_memory_entry_json(m.*) || jsonb_build_object('sort_date', m.memory_date) as item
      from public.aipify_memory_entries m
      where m.tenant_id = v_tenant_id
        and public._ome_can_view_visibility(m.visibility_level, m.created_by, v_tenant_id)
      union all
      select public._ome_decision_json(d.*) || jsonb_build_object('sort_date', d.decision_date)
      from public.aipify_decision_records d
      where d.tenant_id = v_tenant_id
        and public._ome_business_allows(v_tenant_id)
        and public._ome_can_view_visibility(d.visibility_level, d.decision_owner, v_tenant_id)
      union all
      select public._ome_lesson_json(l.*) || jsonb_build_object('sort_date', l.lesson_date)
      from public.aipify_lessons_learned l
      where l.tenant_id = v_tenant_id
        and public._ome_business_allows(v_tenant_id)
        and public._ome_can_view_visibility(l.visibility_level, l.recorded_by, v_tenant_id)
    ) combined
    limit 50),
    '[]'::jsonb
  );

  return jsonb_build_object('timeline', v_timeline);
end;
$$;

create or replace function public.search_organizational_memory(p_query text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_q text := trim(coalesce(p_query, ''));
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;
  if v_q = '' then return jsonb_build_object('results', '[]'::jsonb); end if;

  return jsonb_build_object(
    'query', v_q,
    'results', coalesce(
      (select jsonb_agg(item order by relevance desc)
      from (
        select public._ome_memory_entry_json(m.*) || jsonb_build_object(
          'relevance', ts_rank(
            to_tsvector('simple', coalesce(m.title,'') || ' ' || coalesce(m.summary,'') || ' ' || coalesce(m.detailed_notes,'')),
            plainto_tsquery('simple', v_q)
          )
        ) as item,
        ts_rank(
          to_tsvector('simple', coalesce(m.title,'') || ' ' || coalesce(m.summary,'') || ' ' || coalesce(m.detailed_notes,'')),
          plainto_tsquery('simple', v_q)
        ) as relevance
        from public.aipify_memory_entries m
        where m.tenant_id = v_tenant_id
          and public._ome_can_view_visibility(m.visibility_level, m.created_by, v_tenant_id)
          and (
            to_tsvector('simple', coalesce(m.title,'') || ' ' || coalesce(m.summary,'') || ' ' || coalesce(m.detailed_notes,''))
            @@ plainto_tsquery('simple', v_q)
            or m.title ilike '%' || v_q || '%'
            or m.summary ilike '%' || v_q || '%'
          )
        union all
        select public._ome_decision_json(d.*) || jsonb_build_object('relevance', 0.5),
        0.5
        from public.aipify_decision_records d
        where d.tenant_id = v_tenant_id
          and public._ome_business_allows(v_tenant_id)
          and public._ome_can_view_visibility(d.visibility_level, d.decision_owner, v_tenant_id)
          and (d.decision_title ilike '%' || v_q || '%' or d.rationale ilike '%' || v_q || '%')
        union all
        select public._ome_lesson_json(l.*) || jsonb_build_object('relevance', 0.5),
        0.5
        from public.aipify_lessons_learned l
        where l.tenant_id = v_tenant_id
          and public._ome_business_allows(v_tenant_id)
          and public._ome_can_view_visibility(l.visibility_level, l.recorded_by, v_tenant_id)
          and (l.related_project ilike '%' || v_q || '%' or l.future_recommendations ilike '%' || v_q || '%')
      ) ranked
      limit 25),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. CRUD
-- ---------------------------------------------------------------------------
create or replace function public.create_memory_entry(
  p_title text,
  p_summary text default '',
  p_detailed_notes text default '',
  p_category text default 'operational',
  p_memory_date date default current_date,
  p_tags_json jsonb default '[]'::jsonb,
  p_visibility_level text default 'personal'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
  v_vis text;
  v_row public.aipify_memory_entries;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant'; end if;

  v_vis := coalesce(p_visibility_level, 'personal');
  if not public._ome_business_allows(v_tenant_id) then
    v_vis := 'personal';
  elsif v_vis = 'executive' and not public._ome_enterprise_allows(v_tenant_id) then
    raise exception 'Executive visibility requires Enterprise';
  elsif v_vis = 'department' and not public._ome_enterprise_allows(v_tenant_id) then
    v_vis := 'tenant';
  end if;

  insert into public.aipify_memory_entries (
    tenant_id, category, title, summary, detailed_notes,
    created_by, memory_date, tags_json, visibility_level
  )
  values (
    v_tenant_id, coalesce(p_category, 'operational'), p_title,
    coalesce(p_summary, ''), coalesce(p_detailed_notes, ''),
    public._ome_auth_user_id(), coalesce(p_memory_date, current_date),
    coalesce(p_tags_json, '[]'::jsonb), v_vis
  )
  returning * into v_row;

  return public._ome_memory_entry_json(v_row);
end;
$$;

create or replace function public.update_memory_entry(
  p_id uuid,
  p_title text default null,
  p_summary text default null,
  p_detailed_notes text default null,
  p_category text default null,
  p_memory_date date default null,
  p_tags_json jsonb default null,
  p_visibility_level text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_memory_entries;
  v_role text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_role := public._ome_user_role();

  update public.aipify_memory_entries
  set title = coalesce(p_title, title),
      summary = coalesce(p_summary, summary),
      detailed_notes = coalesce(p_detailed_notes, detailed_notes),
      category = coalesce(p_category, category),
      memory_date = coalesce(p_memory_date, memory_date),
      tags_json = coalesce(p_tags_json, tags_json),
      visibility_level = coalesce(p_visibility_level, visibility_level),
      updated_at = now()
  where id = p_id and tenant_id = v_tenant_id
    and (created_by = public._ome_auth_user_id() or v_role in ('owner', 'admin'))
  returning * into v_row;

  if v_row.id is null then raise exception 'Memory entry not found or not permitted'; end if;
  return public._ome_memory_entry_json(v_row);
end;
$$;

create or replace function public.delete_memory_entry(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_role text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_role := public._ome_user_role();

  delete from public.aipify_memory_entries
  where id = p_id and tenant_id = v_tenant_id
    and (created_by = public._ome_auth_user_id() or v_role in ('owner', 'admin'));

  return jsonb_build_object('deleted', true);
end;
$$;

create or replace function public.create_decision_record(
  p_decision_title text,
  p_decision_summary text default '',
  p_rationale text default '',
  p_alternatives_considered text default '',
  p_expected_outcome text default '',
  p_actual_outcome text default '',
  p_decision_owner text default null,
  p_decision_date date default current_date,
  p_visibility_level text default 'tenant'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_decision_records;
  v_vis text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._ome_business_allows(v_tenant_id) then
    raise exception 'Decision logging requires Business Pro or Enterprise';
  end if;

  v_vis := coalesce(p_visibility_level, 'tenant');
  if v_vis = 'executive' and not public._ome_enterprise_allows(v_tenant_id) then
    raise exception 'Executive decision journals require Enterprise';
  end if;

  insert into public.aipify_decision_records (
    tenant_id, decision_title, decision_summary, rationale,
    alternatives_considered, expected_outcome, actual_outcome,
    decision_owner, decision_date, visibility_level
  )
  values (
    v_tenant_id, p_decision_title, coalesce(p_decision_summary, ''),
    coalesce(p_rationale, ''), coalesce(p_alternatives_considered, ''),
    coalesce(p_expected_outcome, ''), coalesce(p_actual_outcome, ''),
    coalesce(p_decision_owner, public._ome_auth_user_id()),
    coalesce(p_decision_date, current_date), v_vis
  )
  returning * into v_row;

  return public._ome_decision_json(v_row);
end;
$$;

create or replace function public.create_lesson_learned(
  p_related_project text default '',
  p_what_worked text default '',
  p_what_did_not_work text default '',
  p_future_recommendations text default '',
  p_lesson_date date default current_date,
  p_visibility_level text default 'tenant'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_lessons_learned;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if not public._ome_business_allows(v_tenant_id) then
    raise exception 'Lessons learned requires Business Pro or Enterprise';
  end if;

  insert into public.aipify_lessons_learned (
    tenant_id, related_project, what_worked, what_did_not_work,
    future_recommendations, recorded_by, lesson_date, visibility_level
  )
  values (
    v_tenant_id, coalesce(p_related_project, ''),
    coalesce(p_what_worked, ''), coalesce(p_what_did_not_work, ''),
    coalesce(p_future_recommendations, ''), public._ome_auth_user_id(),
    coalesce(p_lesson_date, current_date),
    coalesce(p_visibility_level, 'tenant')
  )
  returning * into v_row;

  return public._ome_lesson_json(v_row);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_customer_organizational_memory_center() to authenticated;
grant execute on function public.get_organizational_memory_timeline() to authenticated;
grant execute on function public.search_organizational_memory(text) to authenticated;
grant execute on function public.create_memory_entry(text, text, text, text, date, jsonb, text) to authenticated;
grant execute on function public.update_memory_entry(uuid, text, text, text, text, date, jsonb, text) to authenticated;
grant execute on function public.delete_memory_entry(uuid) to authenticated;
grant execute on function public.create_decision_record(text, text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.create_lesson_learned(text, text, text, text, date, text) to authenticated;

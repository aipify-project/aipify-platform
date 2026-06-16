-- Phase 283 (APP) — Meetings & Action Outcomes Center

create table if not exists public.app_portal_meetings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  meeting_type text not null check (meeting_type in (
    'executive_meeting', 'team_meeting', 'project_meeting', 'customer_meeting', 'vendor_meeting',
    'retrospective', 'planning_session', 'incident_review', 'compliance_review', 'custom_meeting'
  )),
  organizer_id uuid references public.users (id) on delete set null,
  participant_ids jsonb not null default '[]'::jsonb,
  meeting_at timestamptz not null default now(),
  duration_minutes integer not null default 60 check (duration_minutes > 0 and duration_minutes <= 1440),
  status text not null default 'scheduled' check (status in (
    'scheduled', 'in_progress', 'completed', 'cancelled'
  )),
  objectives text not null default '',
  notes text not null default '',
  related_modules jsonb not null default '[]'::jsonb,
  related_goal_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_meetings_company_idx
  on public.app_portal_meetings (company_id, meeting_type, status, meeting_at desc);

create table if not exists public.app_portal_meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.app_portal_meetings (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  owner_id uuid references public.users (id) on delete set null,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in (
    'open', 'in_progress', 'waiting', 'completed', 'cancelled'
  )),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_meeting_actions_meeting_idx
  on public.app_portal_meeting_action_items (meeting_id, status, due_date);

create table if not exists public.app_portal_meeting_decisions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.app_portal_meetings (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  rationale text not null default '',
  owner_id uuid references public.users (id) on delete set null,
  related_goal_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_meeting_decisions_meeting_idx
  on public.app_portal_meeting_decisions (meeting_id, created_at desc);

create table if not exists public.app_portal_meeting_audit_logs (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.app_portal_meetings (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_meeting_audit_idx
  on public.app_portal_meeting_audit_logs (meeting_id, created_at desc);

alter table public.app_portal_meetings enable row level security;
alter table public.app_portal_meeting_action_items enable row level security;
alter table public.app_portal_meeting_decisions enable row level security;
alter table public.app_portal_meeting_audit_logs enable row level security;
revoke all on public.app_portal_meetings from authenticated, anon;
revoke all on public.app_portal_meeting_action_items from authenticated, anon;
revoke all on public.app_portal_meeting_decisions from authenticated, anon;
revoke all on public.app_portal_meeting_audit_logs from authenticated, anon;

create or replace function public._amao283_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._amao283_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._amao283_can_view(
  m public.app_portal_meetings,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> m.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return m.organizer_id = v_uid
    or coalesce(m.participant_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._amao283_needs_outcomes(m public.app_portal_meetings)
returns boolean
language sql
stable
as $$
  select (
    m.status in ('completed', 'in_progress') and trim(coalesce(m.notes, '')) = ''
  ) or (
    m.status = 'scheduled' and m.meeting_at < now() - interval '1 day'
  );
$$;

create or replace function public._amao283_action_row(a public.app_portal_meeting_action_items)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', a.id,
    'meeting_id', a.meeting_id,
    'title', a.title,
    'description', left(a.description, 300),
    'owner_id', a.owner_id,
    'owner_name', public._amao283_user_name(a.owner_id),
    'due_date', a.due_date,
    'priority', a.priority,
    'status', a.status,
    'overdue', (a.due_date is not null and a.due_date < current_date and a.status not in ('completed', 'cancelled')),
    'created_at', a.created_at,
    'updated_at', a.updated_at
  );
$$;

create or replace function public._amao283_decision_row(d public.app_portal_meeting_decisions)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', d.id,
    'meeting_id', d.meeting_id,
    'title', d.title,
    'rationale', left(d.rationale, 500),
    'owner_id', d.owner_id,
    'owner_name', public._amao283_user_name(d.owner_id),
    'related_goal_ids', d.related_goal_ids,
    'related_follow_up_ids', d.related_follow_up_ids,
    'created_at', d.created_at
  );
$$;

create or replace function public._amao283_meeting_row(m public.app_portal_meetings)
returns jsonb
language plpgsql
stable
as $$
declare
  v_open_actions integer;
  v_overdue_actions integer;
begin
  select count(*)::int into v_open_actions
  from public.app_portal_meeting_action_items a
  where a.meeting_id = m.id and a.status not in ('completed', 'cancelled');

  select count(*)::int into v_overdue_actions
  from public.app_portal_meeting_action_items a
  where a.meeting_id = m.id
    and a.due_date is not null and a.due_date < current_date
    and a.status not in ('completed', 'cancelled');

  return jsonb_build_object(
    'id', m.id,
    'title', m.title,
    'description', left(m.description, 300),
    'meeting_type', m.meeting_type,
    'organizer_id', m.organizer_id,
    'organizer_name', public._amao283_user_name(m.organizer_id),
    'participant_ids', m.participant_ids,
    'meeting_at', m.meeting_at,
    'duration_minutes', m.duration_minutes,
    'status', m.status,
    'objectives', left(m.objectives, 300),
    'notes', left(m.notes, 300),
    'related_modules', m.related_modules,
    'related_goal_ids', m.related_goal_ids,
    'related_follow_up_ids', m.related_follow_up_ids,
    'needs_outcomes', public._amao283_needs_outcomes(m),
    'without_notes', trim(coalesce(m.notes, '')) = '' and m.status not in ('cancelled'),
    'open_actions', v_open_actions,
    'overdue_actions', v_overdue_actions,
    'created_at', m.created_at,
    'updated_at', m.updated_at
  );
end;
$$;

create or replace function public._amao283_build_recommendations(p_items jsonb, p_overdue integer)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if coalesce((v_item->>'needs_outcomes')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'outcomes-' || (v_item->>'id'), 'key', 'recordOutcomes', 'meeting_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'open_actions')::integer, 0) > 0 and (v_item->>'status') = 'completed' then
      v_recs := v_recs || jsonb_build_object('id', 'actions-' || (v_item->>'id'), 'key', 'assignActionOwners', 'meeting_id', v_item->>'id', 'priority', 'medium');
    end if;
  end loop;
  if p_overdue > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'overdue-actions', 'key', 'followUpOverdue', 'priority', 'high');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'link-goals', 'key', 'linkGoals', 'priority', 'low');
  v_recs := v_recs || jsonb_build_object('id', 'recurring-review', 'key', 'scheduleRecurringReview', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_meetings(
  p_meeting_type text default null,
  p_organizer_id uuid default null,
  p_status text default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_participant_id uuid default null,
  p_outstanding_actions boolean default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_upcoming integer := 0;
  v_needs_outcomes integer := 0;
  v_outstanding_actions integer := 0;
  v_recent_completed jsonb := '[]'::jsonb;
  v_without_notes integer := 0;
  v_overdue_actions integer := 0;
begin
  v_ctx := public._amao283_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._amao283_meeting_row(m) order by m.meeting_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_meetings m
  where m.company_id = v_company_id
    and public._amao283_can_view(m, v_ctx)
    and (p_meeting_type is null or m.meeting_type = p_meeting_type)
    and (p_organizer_id is null or m.organizer_id = p_organizer_id)
    and (p_status is null or m.status = p_status)
    and (p_date_from is null or m.meeting_at >= p_date_from)
    and (p_date_to is null or m.meeting_at <= p_date_to)
    and (p_participant_id is null or coalesce(m.participant_ids, '[]'::jsonb) @> jsonb_build_array(p_participant_id::text))
    and (
      p_outstanding_actions is null or p_outstanding_actions = false
      or exists (
        select 1 from public.app_portal_meeting_action_items a
        where a.meeting_id = m.id and a.status not in ('completed', 'cancelled')
      )
    )
    and (
      p_search is null or trim(p_search) = ''
      or m.title ilike '%' || trim(p_search) || '%'
      or m.description ilike '%' || trim(p_search) || '%'
      or m.objectives ilike '%' || trim(p_search) || '%'
      or m.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_upcoming
  from public.app_portal_meetings m
  where m.company_id = v_company_id and m.status = 'scheduled' and m.meeting_at >= now();

  select count(*)::int into v_needs_outcomes
  from public.app_portal_meetings m
  where m.company_id = v_company_id and public._amao283_needs_outcomes(m);

  select count(*)::int into v_outstanding_actions
  from public.app_portal_meeting_action_items a
  where a.company_id = v_company_id and a.status not in ('completed', 'cancelled');

  select count(*)::int into v_without_notes
  from public.app_portal_meetings m
  where m.company_id = v_company_id
    and trim(coalesce(m.notes, '')) = '' and m.status not in ('cancelled');

  select count(*)::int into v_overdue_actions
  from public.app_portal_meeting_action_items a
  where a.company_id = v_company_id
    and a.due_date is not null and a.due_date < current_date
    and a.status not in ('completed', 'cancelled');

  select coalesce(jsonb_agg(public._amao283_meeting_row(m) order by m.updated_at desc), '[]'::jsonb)
  into v_recent_completed
  from (
    select * from public.app_portal_meetings
    where company_id = v_company_id and status = 'completed'
    order by updated_at desc limit 5
  ) m;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'upcoming', v_upcoming,
      'needs_outcomes', v_needs_outcomes,
      'outstanding_actions', v_outstanding_actions,
      'recently_completed', v_recent_completed,
      'without_notes', v_without_notes,
      'overdue_actions', v_overdue_actions
    ),
    'recommendations', public._amao283_build_recommendations(v_items, v_overdue_actions),
    'principle', 'Meeting effectiveness comes from documented outcomes — people execute agreed actions.'
  );
end;
$$;

create or replace function public.get_app_portal_meeting(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_m public.app_portal_meetings;
  v_participants jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
begin
  v_ctx := public._amao283_access_context();
  select * into v_m from public.app_portal_meetings where id = p_id;
  if v_m.id is null then return jsonb_build_object('found', false); end if;
  if not public._amao283_can_view(v_m, v_ctx) then
    raise exception 'Meeting access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_participants
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_m.participant_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(public._amao283_action_row(a) order by a.created_at), '[]'::jsonb)
  into v_actions
  from public.app_portal_meeting_action_items a where a.meeting_id = p_id;

  select coalesce(jsonb_agg(public._amao283_decision_row(d) order by d.created_at desc), '[]'::jsonb)
  into v_decisions
  from public.app_portal_meeting_decisions d where d.meeting_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._amao283_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_meeting_audit_logs l where l.meeting_id = p_id;

  if to_regclass('public.app_portal_goals') is not null and jsonb_array_length(coalesce(v_m.related_goal_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals
    from public.app_portal_goals g
    where g.id in (select t.value::uuid from jsonb_array_elements_text(v_m.related_goal_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null and jsonb_array_length(coalesce(v_m.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_m.related_follow_up_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'meeting', public._amao283_meeting_row(v_m) || jsonb_build_object(
      'description_full', v_m.description,
      'objectives_full', v_m.objectives,
      'notes_full', v_m.notes
    ),
    'participants', v_participants,
    'action_items', v_actions,
    'decisions', v_decisions,
    'related_goals', v_goals,
    'related_follow_ups', v_follow_ups,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._amao283_build_recommendations(
      jsonb_build_array(public._amao283_meeting_row(v_m)),
      (select count(*)::int from public.app_portal_meeting_action_items a
       where a.meeting_id = p_id and a.due_date < current_date and a.status not in ('completed', 'cancelled'))
    )
  );
end;
$$;

create or replace function public.create_app_portal_meeting(
  p_title text,
  p_description text default '',
  p_meeting_type text default 'team_meeting',
  p_meeting_at timestamptz default now(),
  p_duration_minutes integer default 60,
  p_objectives text default '',
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_m public.app_portal_meetings;
begin
  v_ctx := public._amao283_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Meeting creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_meetings (
    company_id, title, description, meeting_type, organizer_id, participant_ids,
    meeting_at, duration_minutes, objectives, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_meeting_type), ''), 'team_meeting'),
    v_user_id,
    jsonb_build_array(v_user_id::text),
    coalesce(p_meeting_at, now()),
    greatest(1, least(coalesce(p_duration_minutes, 60), 1440)),
    left(coalesce(p_objectives, ''), 2000),
    left(coalesce(p_notes, ''), 5000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_meeting_audit_logs (meeting_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Meeting created', v_user_id);

  select * into v_m from public.app_portal_meetings where id = v_id;
  return jsonb_build_object('created', true, 'meeting', public._amao283_meeting_row(v_m));
end;
$$;

create or replace function public.update_app_portal_meeting(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_meeting_type text default null,
  p_status text default null,
  p_meeting_at timestamptz default null,
  p_duration_minutes integer default null,
  p_objectives text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_m public.app_portal_meetings;
  v_user_id uuid;
begin
  v_ctx := public._amao283_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_m from public.app_portal_meetings where id = p_id;
  if v_m.id is null then raise exception 'Meeting not found'; end if;
  if v_m.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;
  if not public._amao283_can_view(v_m, v_ctx) then raise exception 'Meeting access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' and v_m.organizer_id <> v_user_id then
    raise exception 'Meeting update requires manager or organizer access';
  end if;

  update public.app_portal_meetings set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    meeting_type = coalesce(nullif(trim(p_meeting_type), ''), meeting_type),
    status = coalesce(nullif(trim(p_status), ''), status),
    meeting_at = coalesce(p_meeting_at, meeting_at),
    duration_minutes = case when p_duration_minutes is not null then greatest(1, least(p_duration_minutes, 1440)) else duration_minutes end,
    objectives = case when p_objectives is not null then left(p_objectives, 2000) else objectives end,
    notes = case when p_notes is not null then left(p_notes, 5000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_meeting_audit_logs (meeting_id, company_id, event_type, description, performed_by)
  values (p_id, v_m.company_id, 'updated', 'Meeting updated', v_user_id);

  select * into v_m from public.app_portal_meetings where id = p_id;
  return jsonb_build_object('updated', true, 'meeting', public._amao283_meeting_row(v_m));
end;
$$;

create or replace function public.create_app_portal_meeting_action(
  p_meeting_id uuid,
  p_title text,
  p_description text default '',
  p_owner_id uuid default null,
  p_due_date date default null,
  p_priority text default 'medium',
  p_status text default 'open'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_m public.app_portal_meetings;
  v_user_id uuid;
  v_id uuid;
  v_a public.app_portal_meeting_action_items;
begin
  v_ctx := public._amao283_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_m from public.app_portal_meetings where id = p_meeting_id;
  if v_m.id is null then raise exception 'Meeting not found'; end if;
  if not public._amao283_can_view(v_m, v_ctx) then raise exception 'Meeting access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' and v_m.organizer_id <> v_user_id then
    raise exception 'Action creation requires manager or organizer access';
  end if;

  insert into public.app_portal_meeting_action_items (
    meeting_id, company_id, title, description, owner_id, due_date, priority, status, created_by
  ) values (
    p_meeting_id,
    v_m.company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 2000),
    p_owner_id,
    p_due_date,
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    coalesce(nullif(trim(p_status), ''), 'open'),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_meeting_audit_logs (meeting_id, company_id, event_type, description, performed_by)
  values (p_meeting_id, v_m.company_id, 'action_created', 'Action item added', v_user_id);

  select * into v_a from public.app_portal_meeting_action_items where id = v_id;
  return jsonb_build_object('created', true, 'action', public._amao283_action_row(v_a));
end;
$$;

create or replace function public.create_app_portal_meeting_decision(
  p_meeting_id uuid,
  p_title text,
  p_rationale text default '',
  p_owner_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_m public.app_portal_meetings;
  v_user_id uuid;
  v_id uuid;
  v_d public.app_portal_meeting_decisions;
begin
  v_ctx := public._amao283_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_m from public.app_portal_meetings where id = p_meeting_id;
  if v_m.id is null then raise exception 'Meeting not found'; end if;
  if not public._amao283_can_view(v_m, v_ctx) then raise exception 'Meeting access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' and v_m.organizer_id <> v_user_id then
    raise exception 'Decision recording requires manager or organizer access';
  end if;

  insert into public.app_portal_meeting_decisions (
    meeting_id, company_id, title, rationale, owner_id, created_by
  ) values (
    p_meeting_id,
    v_m.company_id,
    left(trim(p_title), 200),
    left(coalesce(p_rationale, ''), 2000),
    p_owner_id,
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_meeting_audit_logs (meeting_id, company_id, event_type, description, performed_by)
  values (p_meeting_id, v_m.company_id, 'decision_recorded', 'Decision recorded', v_user_id);

  select * into v_d from public.app_portal_meeting_decisions where id = v_id;
  return jsonb_build_object('created', true, 'decision', public._amao283_decision_row(v_d));
end;
$$;

grant execute on function public.list_app_portal_meetings(text, uuid, text, timestamptz, timestamptz, uuid, boolean, text) to authenticated;
grant execute on function public.get_app_portal_meeting(uuid) to authenticated;
grant execute on function public.create_app_portal_meeting(text, text, text, timestamptz, integer, text, text) to authenticated;
grant execute on function public.update_app_portal_meeting(uuid, text, text, text, text, timestamptz, integer, text, text) to authenticated;
grant execute on function public.create_app_portal_meeting_action(uuid, text, text, uuid, date, text, text) to authenticated;
grant execute on function public.create_app_portal_meeting_decision(uuid, text, text, uuid) to authenticated;

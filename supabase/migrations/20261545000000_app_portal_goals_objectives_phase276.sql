-- Phase 276 (APP) — Organizational Goals & Objectives Center

create table if not exists public.app_portal_goals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  goal_type text not null default 'operational' check (goal_type in (
    'strategic', 'operational', 'customer_experience', 'employee_experience',
    'revenue', 'security', 'growth', 'innovation', 'compliance'
  )),
  owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in (
    'draft', 'active', 'at_risk', 'on_track', 'achieved', 'cancelled'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  start_date date,
  target_date date,
  success_criteria text not null default '',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  related_business_packs jsonb not null default '[]'::jsonb,
  related_initiatives jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_goals_company_idx
  on public.app_portal_goals (company_id, status, target_date);

create table if not exists public.app_portal_goal_progress_updates (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.app_portal_goals (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  update_type text not null check (update_type in (
    'milestone_achieved', 'progress_change', 'challenge', 'lesson_learned', 'support_needed'
  )),
  progress_percent integer check (progress_percent is null or progress_percent between 0 and 100),
  milestone_title text,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_goal_progress_goal_idx
  on public.app_portal_goal_progress_updates (goal_id, created_at desc);

create table if not exists public.app_portal_goal_audit_logs (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.app_portal_goals (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_goal_audit_goal_idx
  on public.app_portal_goal_audit_logs (goal_id, created_at desc);

alter table public.app_portal_goals enable row level security;
alter table public.app_portal_goal_progress_updates enable row level security;
alter table public.app_portal_goal_audit_logs enable row level security;
revoke all on public.app_portal_goals from authenticated, anon;
revoke all on public.app_portal_goal_progress_updates from authenticated, anon;
revoke all on public.app_portal_goal_audit_logs from authenticated, anon;

create or replace function public._apgo276_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', (v_access->>'organization_role') in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_read', true
  );
end;
$$;

create or replace function public._apgo276_log_event(
  p_goal_id uuid,
  p_company_id uuid,
  p_event_type text,
  p_description text,
  p_performed_by uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.app_portal_goal_audit_logs (
    goal_id, company_id, event_type, description, performed_by, metadata
  ) values (
    p_goal_id, p_company_id, p_event_type, left(coalesce(p_description, ''), 500),
    p_performed_by, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._apgo276_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._apgo276_goal_row(g public.app_portal_goals)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'id', g.id,
    'title', g.title,
    'description', left(g.description, 500),
    'goal_type', g.goal_type,
    'owner_id', g.owner_id,
    'owner_name', public._apgo276_user_name(g.owner_id),
    'contributor_ids', g.contributor_ids,
    'status', g.status,
    'priority', g.priority,
    'start_date', g.start_date,
    'target_date', g.target_date,
    'success_criteria', left(g.success_criteria, 300),
    'progress_percent', g.progress_percent,
    'related_business_packs', g.related_business_packs,
    'related_initiatives', g.related_initiatives,
    'related_follow_up_ids', g.related_follow_up_ids,
    'created_by', g.created_by,
    'created_at', g.created_at,
    'updated_at', g.updated_at
  );
end;
$$;

create or replace function public._apgo276_build_recommendations(p_goals jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_g jsonb;
begin
  for v_g in select * from jsonb_array_elements(p_goals)
  loop
    if (v_g->>'status') in ('active', 'on_track', 'at_risk')
       and v_g->>'target_date' is not null
       and (v_g->>'target_date')::date <= current_date + 14
    then
      v_recs := v_recs || jsonb_build_object('id', 'review-deadline-' || (v_g->>'id'), 'key', 'reviewDeadlines', 'goal_id', v_g->>'id', 'priority', 'high');
    end if;
    if coalesce((v_g->'contributor_ids')::jsonb, '[]'::jsonb) = '[]'::jsonb
       and (v_g->>'status') in ('active', 'on_track')
    then
      v_recs := v_recs || jsonb_build_object('id', 'assign-contributors-' || (v_g->>'id'), 'key', 'assignContributors', 'goal_id', v_g->>'id', 'priority', 'medium');
    end if;
    if coalesce((v_g->'related_follow_up_ids')::jsonb, '[]'::jsonb) = '[]'::jsonb
       and (v_g->>'status') in ('active', 'at_risk')
    then
      v_recs := v_recs || jsonb_build_object('id', 'link-follow-ups-' || (v_g->>'id'), 'key', 'linkFollowUps', 'goal_id', v_g->>'id', 'priority', 'medium');
    end if;
    if (v_g->>'status') = 'achieved' then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || (v_g->>'id'), 'key', 'celebrateCompleted', 'goal_id', v_g->>'id', 'priority', 'low');
    end if;
  end loop;
  if jsonb_array_length(v_recs) = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'update-progress', 'key', 'updateProgress', 'priority', 'low');
  end if;
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_goals(
  p_goal_type text default null,
  p_status text default null,
  p_priority text default null,
  p_owner_id uuid default null,
  p_target_before date default null,
  p_progress_min integer default null,
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
  v_active integer := 0;
  v_achieved_q integer := 0;
  v_attention integer := 0;
  v_upcoming jsonb := '[]'::jsonb;
begin
  v_ctx := public._apgo276_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._apgo276_goal_row(g) order by g.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_goals g
  where g.company_id = v_company_id
    and (p_goal_type is null or g.goal_type = p_goal_type)
    and (p_status is null or g.status = p_status)
    and (p_priority is null or g.priority = p_priority)
    and (p_owner_id is null or g.owner_id = p_owner_id)
    and (p_target_before is null or g.target_date <= p_target_before)
    and (p_progress_min is null or g.progress_percent >= p_progress_min)
    and (
      p_search is null or trim(p_search) = ''
      or g.title ilike '%' || trim(p_search) || '%'
      or g.description ilike '%' || trim(p_search) || '%'
      or g.success_criteria ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_goals g
  where g.company_id = v_company_id and g.status in ('active', 'on_track', 'at_risk');

  select count(*)::int into v_achieved_q
  from public.app_portal_goals g
  where g.company_id = v_company_id and g.status = 'achieved'
    and g.updated_at >= date_trunc('quarter', current_date);

  select count(*)::int into v_attention
  from public.app_portal_goals g
  where g.company_id = v_company_id and g.status in ('at_risk', 'draft')
    and g.target_date is not null and g.target_date <= current_date + 14;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'title', g.title, 'target_date', g.target_date, 'status', g.status
  ) order by g.target_date asc), '[]'::jsonb)
  into v_upcoming
  from (
    select * from public.app_portal_goals g
    where g.company_id = v_company_id
      and g.status in ('active', 'on_track', 'at_risk')
      and g.target_date is not null
      and g.target_date >= current_date
    order by g.target_date asc
    limit 5
  ) g;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active_goals', v_active,
      'achieved_this_quarter', v_achieved_q,
      'requiring_attention', v_attention,
      'upcoming_target_dates', v_upcoming
    ),
    'recommendations', public._apgo276_build_recommendations(v_items),
    'principle', 'Organizational alignment through clear goals — human teams remain responsible for execution.'
  );
end;
$$;

create or replace function public.get_app_portal_goal(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_g public.app_portal_goals;
  v_contributors jsonb := '[]'::jsonb;
  v_progress jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_uid uuid;
begin
  v_ctx := public._apgo276_access_context();
  select * into v_g from public.app_portal_goals where id = p_id;
  if v_g.id is null then return jsonb_build_object('found', false); end if;
  if v_g.company_id <> (v_ctx->>'company_id')::uuid then
    raise exception 'Goal access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', u.id, 'name', u.full_name
  )), '[]'::jsonb)
  into v_contributors
  from public.users u
  where u.id in (
    select t.value::uuid
    from jsonb_array_elements_text(coalesce(v_g.contributor_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'update_type', p.update_type, 'progress_percent', p.progress_percent,
    'milestone_title', p.milestone_title, 'notes', p.notes,
    'created_at', p.created_at, 'created_by', public._apgo276_user_name(p.created_by)
  ) order by p.created_at desc), '[]'::jsonb)
  into v_progress
  from public.app_portal_goal_progress_updates p where p.goal_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._apgo276_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_goal_audit_logs l where l.goal_id = p_id;

  if to_regclass('public.app_portal_follow_ups') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (
      select t.value::uuid
      from jsonb_array_elements_text(coalesce(v_g.related_follow_up_ids, '[]'::jsonb)) as t(value)
    );
  end if;

  if to_regclass('public.app_portal_decisions') is not null then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status)), '[]'::jsonb)
    into v_decisions
    from (
      select d.id, d.title, d.status
      from public.app_portal_decisions d
      where d.company_id = v_g.company_id
      order by d.updated_at desc
      limit 5
    ) d;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'goal', public._apgo276_goal_row(v_g) || jsonb_build_object(
      'description_full', v_g.description,
      'success_criteria_full', v_g.success_criteria
    ),
    'contributors', v_contributors,
    'progress_timeline', v_progress,
    'related_follow_ups', v_follow_ups,
    'related_decisions', v_decisions,
    'related_actions', v_follow_ups,
    'activity_history', v_audit,
    'audit_history', v_audit,
    'recommendations', public._apgo276_build_recommendations(jsonb_build_array(public._apgo276_goal_row(v_g)))
  );
end;
$$;

create or replace function public.create_app_portal_goal(
  p_title text,
  p_description text default '',
  p_goal_type text default 'operational',
  p_owner_id uuid default null,
  p_contributor_ids jsonb default '[]'::jsonb,
  p_status text default 'draft',
  p_priority text default 'medium',
  p_start_date date default null,
  p_target_date date default null,
  p_success_criteria text default '',
  p_progress_percent integer default 0,
  p_related_business_packs jsonb default '[]'::jsonb,
  p_related_initiatives jsonb default '[]'::jsonb,
  p_related_follow_up_ids jsonb default '[]'::jsonb
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
  v_g public.app_portal_goals;
begin
  v_ctx := public._apgo276_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Goal creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_goals (
    company_id, title, description, goal_type, owner_id, contributor_ids, status, priority,
    start_date, target_date, success_criteria, progress_percent,
    related_business_packs, related_initiatives, related_follow_up_ids, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_goal_type), ''), 'operational'),
    coalesce(p_owner_id, v_user_id),
    coalesce(p_contributor_ids, '[]'::jsonb),
    coalesce(nullif(trim(p_status), ''), 'draft'),
    coalesce(nullif(trim(p_priority), ''), 'medium'),
    p_start_date,
    p_target_date,
    left(coalesce(p_success_criteria, ''), 2000),
    greatest(0, least(100, coalesce(p_progress_percent, 0))),
    coalesce(p_related_business_packs, '[]'::jsonb),
    coalesce(p_related_initiatives, '[]'::jsonb),
    coalesce(p_related_follow_up_ids, '[]'::jsonb),
    v_user_id
  ) returning id into v_id;

  perform public._apgo276_log_event(v_id, v_company_id, 'created', 'Goal created', v_user_id, jsonb_build_object('status', coalesce(nullif(trim(p_status), ''), 'draft')));

  select * into v_g from public.app_portal_goals where id = v_id;
  return jsonb_build_object('created', true, 'goal', public._apgo276_goal_row(v_g));
end;
$$;

create or replace function public.update_app_portal_goal(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_goal_type text default null,
  p_owner_id uuid default null,
  p_contributor_ids jsonb default null,
  p_status text default null,
  p_priority text default null,
  p_start_date date default null,
  p_target_date date default null,
  p_success_criteria text default null,
  p_progress_percent integer default null,
  p_related_business_packs jsonb default null,
  p_related_initiatives jsonb default null,
  p_related_follow_up_ids jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_g public.app_portal_goals;
  v_user_id uuid;
  v_new_status text;
begin
  v_ctx := public._apgo276_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_g from public.app_portal_goals where id = p_id;
  if v_g.id is null then raise exception 'Goal not found'; end if;
  if v_g.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Goal access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Goal update requires manager access';
  end if;

  v_new_status := coalesce(nullif(trim(p_status), ''), v_g.status);

  update public.app_portal_goals set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    goal_type = coalesce(nullif(trim(p_goal_type), ''), goal_type),
    owner_id = coalesce(p_owner_id, owner_id),
    contributor_ids = coalesce(p_contributor_ids, contributor_ids),
    status = v_new_status,
    priority = coalesce(nullif(trim(p_priority), ''), priority),
    start_date = coalesce(p_start_date, start_date),
    target_date = coalesce(p_target_date, target_date),
    success_criteria = case when p_success_criteria is not null then left(p_success_criteria, 2000) else success_criteria end,
    progress_percent = case when p_progress_percent is not null then greatest(0, least(100, p_progress_percent)) else progress_percent end,
    related_business_packs = coalesce(p_related_business_packs, related_business_packs),
    related_initiatives = coalesce(p_related_initiatives, related_initiatives),
    related_follow_up_ids = coalesce(p_related_follow_up_ids, related_follow_up_ids),
    updated_at = now()
  where id = p_id;

  if p_status is not null and v_new_status <> v_g.status then
    perform public._apgo276_log_event(p_id, v_g.company_id, 'status_changed', format('Status updated to %s', v_new_status), v_user_id, jsonb_build_object('status', v_new_status));
  else
    perform public._apgo276_log_event(p_id, v_g.company_id, 'updated', 'Goal updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_g from public.app_portal_goals where id = p_id;
  return jsonb_build_object('updated', true, 'goal', public._apgo276_goal_row(v_g));
end;
$$;

create or replace function public.add_app_portal_goal_progress(
  p_goal_id uuid,
  p_update_type text,
  p_progress_percent integer default null,
  p_milestone_title text default null,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_g public.app_portal_goals;
  v_user_id uuid;
  v_id uuid;
begin
  v_ctx := public._apgo276_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_g from public.app_portal_goals where id = p_goal_id;
  if v_g.id is null then raise exception 'Goal not found'; end if;
  if v_g.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Goal access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and v_g.owner_id <> v_user_id
     and not (coalesce(v_g.contributor_ids, '[]'::jsonb) @> jsonb_build_array(v_user_id::text))
  then
    raise exception 'Progress update not permitted';
  end if;

  insert into public.app_portal_goal_progress_updates (
    goal_id, company_id, update_type, progress_percent, milestone_title, notes, created_by
  ) values (
    p_goal_id, v_g.company_id, p_update_type,
    case when p_progress_percent is not null then greatest(0, least(100, p_progress_percent)) end,
    nullif(trim(p_milestone_title), ''),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  if p_progress_percent is not null then
    update public.app_portal_goals
    set progress_percent = greatest(0, least(100, p_progress_percent)), updated_at = now()
    where id = p_goal_id;
  end if;

  if p_update_type = 'milestone_achieved' and p_progress_percent is null then
    update public.app_portal_goals
    set progress_percent = least(100, progress_percent + 10), updated_at = now()
    where id = p_goal_id;
  end if;

  perform public._apgo276_log_event(
    p_goal_id, v_g.company_id, 'progress_update', format('Progress update: %s', p_update_type),
    v_user_id, jsonb_build_object('update_type', p_update_type, 'progress_id', v_id)
  );

  return public.get_app_portal_goal(p_goal_id);
end;
$$;

grant execute on function public.list_app_portal_goals(text, text, text, uuid, date, integer, text) to authenticated;
grant execute on function public.get_app_portal_goal(uuid) to authenticated;
grant execute on function public.create_app_portal_goal(text, text, text, uuid, jsonb, text, text, date, date, text, integer, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.update_app_portal_goal(uuid, text, text, text, uuid, jsonb, text, text, date, date, text, integer, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.add_app_portal_goal_progress(uuid, text, integer, text, text) to authenticated;

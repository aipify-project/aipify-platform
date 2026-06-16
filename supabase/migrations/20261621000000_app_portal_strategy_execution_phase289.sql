-- Phase 289 (APP) — Organizational Strategy Execution Center

create table if not exists public.app_portal_strategy_initiatives (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'growth_strategy', 'customer_strategy', 'operational_excellence', 'digital_transformation',
    'innovation_strategy', 'employee_strategy', 'financial_strategy', 'risk_strategy',
    'sustainability_strategy', 'custom_strategic_theme'
  )),
  executive_sponsor_id uuid references public.users (id) on delete set null,
  initiative_owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'planning' check (status in (
    'planning', 'active', 'on_track', 'needs_attention', 'delayed', 'completed', 'archived'
  )),
  strategic_importance text not null default 'important' check (strategic_importance in (
    'important', 'high_priority', 'critical_priority', 'transformational'
  )),
  start_date date,
  target_date date,
  success_definition text not null default '',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  related_goal_ids jsonb not null default '[]'::jsonb,
  related_decision_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_risk_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_strategy_initiatives_company_idx
  on public.app_portal_strategy_initiatives (company_id, category, status, target_date, updated_at desc);

create table if not exists public.app_portal_strategy_milestones (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references public.app_portal_strategy_initiatives (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  owner_id uuid references public.users (id) on delete set null,
  target_date date,
  completion_date date,
  status text not null default 'pending' check (status in (
    'pending', 'in_progress', 'completed', 'missed', 'cancelled'
  )),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_strategy_milestones_initiative_idx
  on public.app_portal_strategy_milestones (initiative_id, target_date);

create table if not exists public.app_portal_strategy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references public.app_portal_strategy_initiatives (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_strategy_audit_idx
  on public.app_portal_strategy_audit_logs (initiative_id, created_at desc);

alter table public.app_portal_strategy_initiatives enable row level security;
alter table public.app_portal_strategy_milestones enable row level security;
alter table public.app_portal_strategy_audit_logs enable row level security;
revoke all on public.app_portal_strategy_initiatives from authenticated, anon;
revoke all on public.app_portal_strategy_milestones from authenticated, anon;
revoke all on public.app_portal_strategy_audit_logs from authenticated, anon;

create or replace function public._aose289_access_context()
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
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'is_executive', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._aose289_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aose289_can_view(
  s public.app_portal_strategy_initiatives,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> s.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  if s.initiative_owner_id = v_uid or s.executive_sponsor_id = v_uid then return true; end if;
  if exists (
    select 1 from jsonb_array_elements_text(coalesce(s.contributor_ids, '[]'::jsonb)) t
    where t.value::uuid = v_uid
  ) then return true; end if;
  return false;
end;
$$;

create or replace function public._aose289_row(s public.app_portal_strategy_initiatives)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', s.id,
    'title', s.title,
    'description', left(s.description, 300),
    'category', s.category,
    'executive_sponsor_id', s.executive_sponsor_id,
    'executive_sponsor_name', public._aose289_user_name(s.executive_sponsor_id),
    'initiative_owner_id', s.initiative_owner_id,
    'initiative_owner_name', public._aose289_user_name(s.initiative_owner_id),
    'contributor_ids', s.contributor_ids,
    'status', s.status,
    'strategic_importance', s.strategic_importance,
    'start_date', s.start_date,
    'target_date', s.target_date,
    'success_definition', left(s.success_definition, 300),
    'progress_percent', s.progress_percent,
    'notes', left(s.notes, 300),
    'needs_attention', s.status in ('needs_attention', 'delayed'),
    'created_at', s.created_at,
    'updated_at', s.updated_at
  );
$$;

create or replace function public._aose289_milestone_row(m public.app_portal_strategy_milestones)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', m.id,
    'initiative_id', m.initiative_id,
    'title', m.title,
    'owner_id', m.owner_id,
    'owner_name', public._aose289_user_name(m.owner_id),
    'target_date', m.target_date,
    'completion_date', m.completion_date,
    'status', m.status,
    'notes', left(m.notes, 500),
    'created_at', m.created_at,
    'updated_at', m.updated_at
  );
$$;

create or replace function public._aose289_build_insights(p_items jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_insights jsonb := '[]'::jsonb;
  v_delayed integer := 0;
  v_attention integer := 0;
  v_on_track integer := 0;
begin
  select count(*)::int into v_delayed
  from jsonb_array_elements(p_items) e
  where (e->>'status') = 'delayed';

  select count(*)::int into v_attention
  from jsonb_array_elements(p_items) e
  where (e->>'status') = 'needs_attention';

  select count(*)::int into v_on_track
  from jsonb_array_elements(p_items) e
  where (e->>'status') in ('on_track', 'active');

  if v_delayed > 0 then
    v_insights := v_insights || jsonb_build_object('id', 'delayed', 'key', 'consistentlyDelayed', 'count', v_delayed);
  end if;
  if v_attention > 0 then
    v_insights := v_insights || jsonb_build_object('id', 'attention', 'key', 'resourceConflicts', 'count', v_attention);
  end if;
  if v_on_track > 0 then
    v_insights := v_insights || jsonb_build_object('id', 'momentum', 'key', 'positiveMomentum', 'count', v_on_track);
  end if;
  v_insights := v_insights || jsonb_build_object('id', 'dependencies', 'key', 'dependenciesSlowing', 'priority', 'medium');
  return v_insights;
end;
$$;

create or replace function public._aose289_build_recommendations(p_items jsonb)
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
    if (v_item->>'status') in ('delayed', 'needs_attention') then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewDelayed', 'initiative_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') = 'completed' then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || (v_item->>'id'), 'key', 'celebrateMilestones', 'initiative_id', v_item->>'id', 'priority', 'low');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'ownership', 'key', 'assignOwnership', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'criteria', 'key', 'clarifySuccessCriteria', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'dependencies', 'key', 'reassessDependencies', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_strategy_initiatives(
  p_category text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_sponsor_id uuid default null,
  p_importance text default null,
  p_target_from date default null,
  p_target_to date default null,
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
  v_attention jsonb := '[]'::jsonb;
  v_avg_progress numeric := 0;
  v_upcoming jsonb := '[]'::jsonb;
  v_completed jsonb := '[]'::jsonb;
  v_trends jsonb := '[]'::jsonb;
begin
  v_ctx := public._aose289_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aose289_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_strategy_initiatives s
  where s.company_id = v_company_id
    and public._aose289_can_view(s, v_ctx)
    and (p_category is null or s.category = p_category)
    and (p_status is null or s.status = p_status)
    and (p_owner_id is null or s.initiative_owner_id = p_owner_id)
    and (p_sponsor_id is null or s.executive_sponsor_id = p_sponsor_id)
    and (p_importance is null or s.strategic_importance = p_importance)
    and (p_target_from is null or s.target_date >= p_target_from)
    and (p_target_to is null or s.target_date <= p_target_to)
    and (
      p_search is null or trim(p_search) = ''
      or s.title ilike '%' || trim(p_search) || '%'
      or s.description ilike '%' || trim(p_search) || '%'
      or s.success_definition ilike '%' || trim(p_search) || '%'
      or s.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_strategy_initiatives s
  where s.company_id = v_company_id
    and s.status in ('planning', 'active', 'on_track');

  select coalesce(jsonb_agg(public._aose289_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_attention
  from public.app_portal_strategy_initiatives s
  where s.company_id = v_company_id
    and s.status in ('needs_attention', 'delayed')
    and public._aose289_can_view(s, v_ctx)
  limit 5;

  select coalesce(avg(s.progress_percent), 0) into v_avg_progress
  from public.app_portal_strategy_initiatives s
  where s.company_id = v_company_id
    and s.status not in ('archived', 'completed');

  select coalesce(jsonb_agg(public._aose289_milestone_row(m) order by m.target_date asc nulls last), '[]'::jsonb)
  into v_upcoming
  from public.app_portal_strategy_milestones m
  join public.app_portal_strategy_initiatives s on s.id = m.initiative_id
  where m.company_id = v_company_id
    and m.status in ('pending', 'in_progress')
    and m.target_date is not null
    and m.target_date <= current_date + interval '30 days'
    and public._aose289_can_view(s, v_ctx)
  limit 5;

  select coalesce(jsonb_agg(public._aose289_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_completed
  from (
    select * from public.app_portal_strategy_initiatives
    where company_id = v_company_id and status = 'completed'
    order by updated_at desc limit 5
  ) s;

  select coalesce(jsonb_agg(public._aose289_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_trends
  from (select * from public.app_portal_strategy_initiatives where company_id = v_company_id order by updated_at desc limit 5) s;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'requiring_attention', v_attention,
      'progress_overview', round(v_avg_progress),
      'upcoming_milestones', v_upcoming,
      'recently_completed', v_completed,
      'execution_trends', v_trends
    ),
    'execution_insights', public._aose289_build_insights(v_items),
    'recommendations', public._aose289_build_recommendations(v_items),
    'principle', 'Organizations succeed when strategy is translated into disciplined execution.'
  );
end;
$$;

create or replace function public.get_app_portal_strategy_initiative(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_s public.app_portal_strategy_initiatives;
  v_audit jsonb := '[]'::jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
begin
  v_ctx := public._aose289_access_context();
  select * into v_s from public.app_portal_strategy_initiatives where id = p_id;
  if v_s.id is null then return jsonb_build_object('found', false); end if;
  if not public._aose289_can_view(v_s, v_ctx) then
    raise exception 'Strategy initiative access denied';
  end if;

  select coalesce(jsonb_agg(public._aose289_milestone_row(m) order by m.target_date asc nulls last), '[]'::jsonb)
  into v_milestones
  from public.app_portal_strategy_milestones m where m.initiative_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aose289_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_strategy_audit_logs l where l.initiative_id = p_id;

  if to_regclass('public.app_portal_goals') is not null
     and jsonb_array_length(coalesce(v_s.related_goal_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals from public.app_portal_goals g
    where g.id in (select t.value::uuid from jsonb_array_elements_text(v_s.related_goal_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_decisions') is not null
     and jsonb_array_length(coalesce(v_s.related_decision_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status)), '[]'::jsonb)
    into v_decisions from public.app_portal_decisions d
    where d.id in (select t.value::uuid from jsonb_array_elements_text(v_s.related_decision_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_s.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_s.related_follow_up_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_risks') is not null
     and jsonb_array_length(coalesce(v_s.related_risk_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'title', r.title, 'status', r.status)), '[]'::jsonb)
    into v_risks from public.app_portal_risks r
    where r.id in (select t.value::uuid from jsonb_array_elements_text(v_s.related_risk_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'initiative', public._aose289_row(v_s) || jsonb_build_object(
      'description_full', v_s.description,
      'success_definition_full', v_s.success_definition,
      'notes_full', v_s.notes
    ),
    'milestones', v_milestones,
    'related_goals', v_goals,
    'related_decisions', v_decisions,
    'related_follow_ups', v_follow_ups,
    'related_risks', v_risks,
    'milestone_timeline', v_milestones,
    'audit_history', v_audit,
    'execution_insights', public._aose289_build_insights(jsonb_build_array(public._aose289_row(v_s))),
    'recommendations', public._aose289_build_recommendations(jsonb_build_array(public._aose289_row(v_s)))
  );
end;
$$;

create or replace function public.create_app_portal_strategy_initiative(
  p_title text,
  p_description text default '',
  p_category text default 'growth_strategy',
  p_strategic_importance text default 'important',
  p_success_definition text default '',
  p_target_date date default null,
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
  v_s public.app_portal_strategy_initiatives;
begin
  v_ctx := public._aose289_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Strategy initiative creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_strategy_initiatives (
    company_id, title, description, category, executive_sponsor_id, initiative_owner_id,
    strategic_importance, success_definition, start_date, target_date, notes, created_by, status
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'growth_strategy'),
    v_user_id,
    v_user_id,
    coalesce(nullif(trim(p_strategic_importance), ''), 'important'),
    left(coalesce(p_success_definition, ''), 2000),
    current_date,
    p_target_date,
    left(coalesce(p_notes, ''), 2000),
    v_user_id,
    'planning'
  ) returning id into v_id;

  insert into public.app_portal_strategy_audit_logs (initiative_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Strategic initiative created', v_user_id);

  select * into v_s from public.app_portal_strategy_initiatives where id = v_id;
  return jsonb_build_object('created', true, 'initiative', public._aose289_row(v_s));
end;
$$;

create or replace function public.update_app_portal_strategy_initiative(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_status text default null,
  p_strategic_importance text default null,
  p_success_definition text default null,
  p_progress_percent integer default null,
  p_target_date date default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_s public.app_portal_strategy_initiatives;
  v_user_id uuid;
begin
  v_ctx := public._aose289_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Strategy initiative update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_s from public.app_portal_strategy_initiatives where id = p_id;
  if v_s.id is null then raise exception 'Strategy initiative not found'; end if;

  update public.app_portal_strategy_initiatives set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    status = coalesce(nullif(trim(p_status), ''), status),
    strategic_importance = coalesce(nullif(trim(p_strategic_importance), ''), strategic_importance),
    success_definition = case when p_success_definition is not null then left(p_success_definition, 2000) else success_definition end,
    progress_percent = case when p_progress_percent is not null then greatest(0, least(100, p_progress_percent)) else progress_percent end,
    target_date = coalesce(p_target_date, target_date),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_strategy_audit_logs (initiative_id, company_id, event_type, description, performed_by)
  values (p_id, v_s.company_id, 'updated', 'Strategic initiative updated', v_user_id);

  select * into v_s from public.app_portal_strategy_initiatives where id = p_id;
  return jsonb_build_object('updated', true, 'initiative', public._aose289_row(v_s));
end;
$$;

create or replace function public.create_app_portal_strategy_milestone(
  p_initiative_id uuid,
  p_title text,
  p_target_date date default null,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_s public.app_portal_strategy_initiatives;
  v_user_id uuid;
  v_id uuid;
  v_m public.app_portal_strategy_milestones;
begin
  v_ctx := public._aose289_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Strategy milestone creation requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_s from public.app_portal_strategy_initiatives where id = p_initiative_id;
  if v_s.id is null then raise exception 'Strategy initiative not found'; end if;

  insert into public.app_portal_strategy_milestones (
    initiative_id, company_id, title, owner_id, target_date, notes
  ) values (
    p_initiative_id,
    v_s.company_id,
    left(trim(p_title), 200),
    v_user_id,
    p_target_date,
    left(coalesce(p_notes, ''), 2000)
  ) returning id into v_id;

  insert into public.app_portal_strategy_audit_logs (initiative_id, company_id, event_type, description, performed_by, metadata)
  values (p_initiative_id, v_s.company_id, 'milestone_added', 'Milestone added: ' || left(trim(p_title), 100), v_user_id, jsonb_build_object('milestone_id', v_id));

  select * into v_m from public.app_portal_strategy_milestones where id = v_id;
  return jsonb_build_object('created', true, 'milestone', public._aose289_milestone_row(v_m));
end;
$$;

grant execute on function public.list_app_portal_strategy_initiatives(text, text, uuid, uuid, text, date, date, text) to authenticated;
grant execute on function public.get_app_portal_strategy_initiative(uuid) to authenticated;
grant execute on function public.create_app_portal_strategy_initiative(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.update_app_portal_strategy_initiative(uuid, text, text, text, text, text, text, integer, date, text) to authenticated;
grant execute on function public.create_app_portal_strategy_milestone(uuid, text, date, text) to authenticated;

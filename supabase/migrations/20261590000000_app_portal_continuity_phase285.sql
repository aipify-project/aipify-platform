-- Phase 285 (APP) — Organizational Continuity & Critical Preparedness Center

create table if not exists public.app_portal_continuity_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'business_continuity', 'incident_response', 'technology_recovery', 'workforce_continuity',
    'vendor_continuity', 'communications_continuity', 'executive_continuity', 'operational_recovery',
    'facility_preparedness', 'custom_continuity_area'
  )),
  owner_id uuid references public.users (id) on delete set null,
  backup_owner_id uuid references public.users (id) on delete set null,
  criticality_level text not null default 'moderate' check (criticality_level in (
    'low', 'moderate', 'high', 'mission_critical'
  )),
  status text not null default 'draft' check (status in (
    'draft', 'active', 'under_review', 'testing', 'archived'
  )),
  review_frequency text not null default 'quarterly' check (review_frequency in (
    'monthly', 'quarterly', 'semi_annual', 'annual'
  )),
  last_reviewed_date date,
  next_review_date date,
  recovery_objectives text not null default '',
  critical_dependencies jsonb not null default '[]'::jsonb,
  key_stakeholders jsonb not null default '[]'::jsonb,
  alternative_procedures text not null default '',
  escalation_paths text not null default '',
  minimum_operational_requirements text not null default '',
  related_risk_ids jsonb not null default '[]'::jsonb,
  related_playbook_ids jsonb not null default '[]'::jsonb,
  related_external_relationship_ids jsonb not null default '[]'::jsonb,
  stakeholder_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_continuity_plans_company_idx
  on public.app_portal_continuity_plans (company_id, category, status, next_review_date);

create table if not exists public.app_portal_continuity_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.app_portal_continuity_plans (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  exercise_type text not null check (exercise_type in ('tabletop', 'simulation')),
  exercise_date date not null default current_date,
  lessons_learned text not null default '',
  improvement_actions text not null default '',
  participant_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_continuity_exercises_plan_idx
  on public.app_portal_continuity_exercises (plan_id, exercise_date desc);

create table if not exists public.app_portal_continuity_audit_logs (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.app_portal_continuity_plans (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_continuity_audit_idx
  on public.app_portal_continuity_audit_logs (plan_id, created_at desc);

alter table public.app_portal_continuity_plans enable row level security;
alter table public.app_portal_continuity_exercises enable row level security;
alter table public.app_portal_continuity_audit_logs enable row level security;
revoke all on public.app_portal_continuity_plans from authenticated, anon;
revoke all on public.app_portal_continuity_exercises from authenticated, anon;
revoke all on public.app_portal_continuity_audit_logs from authenticated, anon;

create or replace function public._aocp285_access_context()
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

create or replace function public._aocp285_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aocp285_can_view(
  p public.app_portal_continuity_plans,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> p.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  if coalesce(p_ctx->>'is_executive', 'false') = 'true'
     and p.criticality_level in ('high', 'mission_critical') then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return p.owner_id = v_uid
    or p.backup_owner_id = v_uid
    or coalesce(p.stakeholder_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._aocp285_needs_review(p public.app_portal_continuity_plans)
returns boolean
language sql
stable
as $$
  select p.status in ('active', 'under_review', 'testing')
    and (
      p.next_review_date is not null and p.next_review_date <= current_date
      or (p.last_reviewed_date is null and p.updated_at < now() - interval '180 days')
    );
$$;

create or replace function public._aocp285_row(p public.app_portal_continuity_plans)
returns jsonb
language plpgsql
stable
as $$
declare v_upcoming_exercise date;
begin
  select min(e.exercise_date) into v_upcoming_exercise
  from public.app_portal_continuity_exercises e
  where e.plan_id = p.id and e.exercise_date >= current_date;

  return jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', left(p.description, 300),
    'category', p.category,
    'owner_id', p.owner_id,
    'owner_name', public._aocp285_user_name(p.owner_id),
    'backup_owner_id', p.backup_owner_id,
    'backup_owner_name', public._aocp285_user_name(p.backup_owner_id),
    'criticality_level', p.criticality_level,
    'status', p.status,
    'review_frequency', p.review_frequency,
    'last_reviewed_date', p.last_reviewed_date,
    'next_review_date', p.next_review_date,
    'needs_review', public._aocp285_needs_review(p),
    'upcoming_exercise_date', v_upcoming_exercise,
    'related_risk_ids', p.related_risk_ids,
    'related_playbook_ids', p.related_playbook_ids,
    'related_external_relationship_ids', p.related_external_relationship_ids,
    'notes', left(p.notes, 300),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  );
end;
$$;

create or replace function public._aocp285_build_recommendations(p_items jsonb)
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
    if coalesce((v_item->>'needs_review')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewOutdated', 'plan_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'owner_id') is null and (v_item->>'status') not in ('archived') then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignBackupOwner', 'plan_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'backup_owner_id') is null and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'backup-' || (v_item->>'id'), 'key', 'assignBackupOwner', 'plan_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'criticality_level') = 'mission_critical' and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'critical-' || (v_item->>'id'), 'key', 'updateDependencies', 'plan_id', v_item->>'id', 'priority', 'high');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'schedule-exercise', 'key', 'scheduleExercise', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'review-vendors', 'key', 'reviewVendorAssumptions', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_continuity_plans(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_criticality text default null,
  p_review_before date default null,
  p_exercise_before date default null,
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
  v_needs_review integer := 0;
  v_critical integer := 0;
  v_no_owner integer := 0;
  v_upcoming_exercises integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._aocp285_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aocp285_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_continuity_plans p
  where p.company_id = v_company_id
    and public._aocp285_can_view(p, v_ctx)
    and (p_category is null or p.category = p_category)
    and (p_owner_id is null or p.owner_id = p_owner_id)
    and (p_status is null or p.status = p_status)
    and (p_criticality is null or p.criticality_level = p_criticality)
    and (p_review_before is null or p.next_review_date <= p_review_before)
    and (
      p_exercise_before is null
      or exists (
        select 1 from public.app_portal_continuity_exercises e
        where e.plan_id = p.id and e.exercise_date <= p_exercise_before and e.exercise_date >= current_date
      )
    )
    and (
      p_search is null or trim(p_search) = ''
      or p.title ilike '%' || trim(p_search) || '%'
      or p.description ilike '%' || trim(p_search) || '%'
      or p.notes ilike '%' || trim(p_search) || '%'
      or p.recovery_objectives ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_continuity_plans p where p.company_id = v_company_id and p.status = 'active';

  select count(*)::int into v_needs_review
  from public.app_portal_continuity_plans p where p.company_id = v_company_id and public._aocp285_needs_review(p);

  select count(*)::int into v_critical
  from public.app_portal_continuity_plans p
  where p.company_id = v_company_id and p.criticality_level = 'mission_critical' and p.status not in ('archived');

  select count(*)::int into v_no_owner
  from public.app_portal_continuity_plans p
  where p.company_id = v_company_id and p.owner_id is null and p.status not in ('archived');

  select count(*)::int into v_upcoming_exercises
  from public.app_portal_continuity_exercises e
  where e.company_id = v_company_id and e.exercise_date between current_date and current_date + interval '90 days';

  select coalesce(jsonb_agg(public._aocp285_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_continuity_plans where company_id = v_company_id order by updated_at desc limit 5) p;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'needs_review', v_needs_review,
      'mission_critical', v_critical,
      'without_owner', v_no_owner,
      'upcoming_exercises', v_upcoming_exercises,
      'recently_updated', v_recent
    ),
    'recommendations', public._aocp285_build_recommendations(v_items),
    'principle', 'Preparedness strengthens resilience — people lead decisions during disruptions.'
  );
end;
$$;

create or replace function public.get_app_portal_continuity_plan(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_continuity_plans;
  v_audit jsonb := '[]'::jsonb;
  v_exercises jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_playbooks jsonb := '[]'::jsonb;
  v_relationships jsonb := '[]'::jsonb;
begin
  v_ctx := public._aocp285_access_context();
  select * into v_p from public.app_portal_continuity_plans where id = p_id;
  if v_p.id is null then return jsonb_build_object('found', false); end if;
  if not public._aocp285_can_view(v_p, v_ctx) then
    raise exception 'Continuity plan access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aocp285_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_continuity_audit_logs l where l.plan_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'title', e.title, 'exercise_type', e.exercise_type,
    'exercise_date', e.exercise_date, 'lessons_learned', left(e.lessons_learned, 500),
    'improvement_actions', left(e.improvement_actions, 500),
    'participant_ids', e.participant_ids, 'notes', left(e.notes, 300),
    'created_at', e.created_at
  ) order by e.exercise_date desc), '[]'::jsonb)
  into v_exercises
  from public.app_portal_continuity_exercises e where e.plan_id = p_id;

  if to_regclass('public.app_portal_risks') is not null and jsonb_array_length(coalesce(v_p.related_risk_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'title', r.title, 'status', r.status)), '[]'::jsonb)
    into v_risks from public.app_portal_risks r
    where r.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_risk_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_playbooks') is not null and jsonb_array_length(coalesce(v_p.related_playbook_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', pb.id, 'title', pb.title, 'status', pb.status)), '[]'::jsonb)
    into v_playbooks from public.app_portal_playbooks pb
    where pb.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_playbook_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_external_relationships') is not null
     and jsonb_array_length(coalesce(v_p.related_external_relationship_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', rel.id, 'name', rel.organization_name, 'status', rel.status)), '[]'::jsonb)
    into v_relationships from public.app_portal_external_relationships rel
    where rel.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_external_relationship_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'plan', public._aocp285_row(v_p) || jsonb_build_object(
      'description_full', v_p.description,
      'recovery_objectives', v_p.recovery_objectives,
      'critical_dependencies', v_p.critical_dependencies,
      'key_stakeholders', v_p.key_stakeholders,
      'alternative_procedures', v_p.alternative_procedures,
      'escalation_paths', v_p.escalation_paths,
      'minimum_operational_requirements', v_p.minimum_operational_requirements,
      'notes_full', v_p.notes
    ),
    'exercises', v_exercises,
    'related_risks', v_risks,
    'related_playbooks', v_playbooks,
    'related_external_relationships', v_relationships,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aocp285_build_recommendations(jsonb_build_array(public._aocp285_row(v_p)))
  );
end;
$$;

create or replace function public.create_app_portal_continuity_plan(
  p_title text,
  p_description text default '',
  p_category text default 'business_continuity',
  p_criticality_level text default 'moderate',
  p_review_frequency text default 'quarterly',
  p_recovery_objectives text default '',
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
  v_p public.app_portal_continuity_plans;
begin
  v_ctx := public._aocp285_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Continuity plan creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_continuity_plans (
    company_id, title, description, category, owner_id, criticality_level,
    review_frequency, recovery_objectives, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'business_continuity'),
    v_user_id,
    coalesce(nullif(trim(p_criticality_level), ''), 'moderate'),
    coalesce(nullif(trim(p_review_frequency), ''), 'quarterly'),
    left(coalesce(p_recovery_objectives, ''), 2000),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_continuity_audit_logs (plan_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Continuity plan created', v_user_id);

  select * into v_p from public.app_portal_continuity_plans where id = v_id;
  return jsonb_build_object('created', true, 'plan', public._aocp285_row(v_p));
end;
$$;

create or replace function public.update_app_portal_continuity_plan(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_status text default null,
  p_criticality_level text default null,
  p_review_frequency text default null,
  p_last_reviewed_date date default null,
  p_next_review_date date default null,
  p_recovery_objectives text default null,
  p_critical_dependencies jsonb default null,
  p_alternative_procedures text default null,
  p_escalation_paths text default null,
  p_minimum_operational_requirements text default null,
  p_notes text default null,
  p_owner_id uuid default null,
  p_backup_owner_id uuid default null,
  p_clear_owner boolean default false,
  p_clear_backup_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_continuity_plans;
  v_user_id uuid;
begin
  v_ctx := public._aocp285_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Continuity plan update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_continuity_plans where id = p_id;
  if v_p.id is null then raise exception 'Continuity plan not found'; end if;
  if v_p.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_continuity_plans set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    status = coalesce(nullif(trim(p_status), ''), status),
    criticality_level = coalesce(nullif(trim(p_criticality_level), ''), criticality_level),
    review_frequency = coalesce(nullif(trim(p_review_frequency), ''), review_frequency),
    last_reviewed_date = coalesce(p_last_reviewed_date, last_reviewed_date),
    next_review_date = coalesce(p_next_review_date, next_review_date),
    recovery_objectives = case when p_recovery_objectives is not null then left(p_recovery_objectives, 2000) else recovery_objectives end,
    critical_dependencies = coalesce(p_critical_dependencies, critical_dependencies),
    alternative_procedures = case when p_alternative_procedures is not null then left(p_alternative_procedures, 2000) else alternative_procedures end,
    escalation_paths = case when p_escalation_paths is not null then left(p_escalation_paths, 2000) else escalation_paths end,
    minimum_operational_requirements = case when p_minimum_operational_requirements is not null then left(p_minimum_operational_requirements, 2000) else minimum_operational_requirements end,
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    backup_owner_id = case when p_clear_backup_owner then null when p_backup_owner_id is not null then p_backup_owner_id else backup_owner_id end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_continuity_audit_logs (plan_id, company_id, event_type, description, performed_by)
  values (p_id, v_p.company_id, 'updated', 'Continuity plan updated', v_user_id);

  select * into v_p from public.app_portal_continuity_plans where id = p_id;
  return jsonb_build_object('updated', true, 'plan', public._aocp285_row(v_p));
end;
$$;

create or replace function public.create_app_portal_continuity_exercise(
  p_plan_id uuid,
  p_title text,
  p_exercise_type text default 'tabletop',
  p_exercise_date date default current_date,
  p_lessons_learned text default '',
  p_improvement_actions text default '',
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_continuity_plans;
  v_user_id uuid;
  v_id uuid;
  v_e public.app_portal_continuity_exercises;
begin
  v_ctx := public._aocp285_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Exercise recording requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_continuity_plans where id = p_plan_id;
  if v_p.id is null then raise exception 'Continuity plan not found'; end if;

  insert into public.app_portal_continuity_exercises (
    plan_id, company_id, title, exercise_type, exercise_date,
    lessons_learned, improvement_actions, notes, created_by
  ) values (
    p_plan_id,
    v_p.company_id,
    left(trim(p_title), 200),
    coalesce(nullif(trim(p_exercise_type), ''), 'tabletop'),
    coalesce(p_exercise_date, current_date),
    left(coalesce(p_lessons_learned, ''), 2000),
    left(coalesce(p_improvement_actions, ''), 2000),
    left(coalesce(p_notes, ''), 1000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_continuity_audit_logs (plan_id, company_id, event_type, description, performed_by)
  values (p_plan_id, v_p.company_id, 'exercise_recorded', 'Continuity exercise recorded', v_user_id);

  select * into v_e from public.app_portal_continuity_exercises where id = v_id;
  return jsonb_build_object('created', true, 'exercise', jsonb_build_object(
    'id', v_e.id, 'title', v_e.title, 'exercise_type', v_e.exercise_type,
    'exercise_date', v_e.exercise_date, 'lessons_learned', v_e.lessons_learned,
    'improvement_actions', v_e.improvement_actions, 'created_at', v_e.created_at
  ));
end;
$$;

grant execute on function public.list_app_portal_continuity_plans(text, uuid, text, text, date, date, text) to authenticated;
grant execute on function public.get_app_portal_continuity_plan(uuid) to authenticated;
grant execute on function public.create_app_portal_continuity_plan(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.update_app_portal_continuity_plan(uuid, text, text, text, text, text, text, date, date, text, jsonb, text, text, text, text, uuid, uuid, boolean, boolean) to authenticated;
grant execute on function public.create_app_portal_continuity_exercise(uuid, text, text, date, text, text, text) to authenticated;

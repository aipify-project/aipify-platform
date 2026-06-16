-- Phase 286 (APP) — Organizational Learning & Improvement Center

create table if not exists public.app_portal_learning_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'operational_improvement', 'customer_experience', 'security_improvement', 'incident_learning',
    'leadership_learning', 'process_improvement', 'team_collaboration', 'technology_learning',
    'vendor_learning', 'custom_learning'
  )),
  submitted_by_id uuid references public.users (id) on delete set null,
  owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  status text not null default 'identified' check (status in (
    'identified', 'under_review', 'approved', 'in_progress', 'implemented', 'archived'
  )),
  impact_level text not null default 'moderate_improvement' check (impact_level in (
    'minor_improvement', 'moderate_improvement', 'significant_improvement', 'transformational_improvement'
  )),
  date_identified date not null default current_date,
  date_implemented date,
  related_modules jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_decision_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_learning_records_company_idx
  on public.app_portal_learning_records (company_id, category, status, date_identified desc);

create table if not exists public.app_portal_learning_actions (
  id uuid primary key default gen_random_uuid(),
  learning_record_id uuid not null references public.app_portal_learning_records (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  root_causes text not null default '',
  recommended_actions text not null default '',
  assigned_owner_id uuid references public.users (id) on delete set null,
  success_criteria text not null default '',
  expected_outcomes text not null default '',
  lessons_applied_elsewhere text not null default '',
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_learning_actions_record_idx
  on public.app_portal_learning_actions (learning_record_id, created_at desc);

create table if not exists public.app_portal_learning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  learning_record_id uuid not null references public.app_portal_learning_records (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_learning_audit_idx
  on public.app_portal_learning_audit_logs (learning_record_id, created_at desc);

alter table public.app_portal_learning_records enable row level security;
alter table public.app_portal_learning_actions enable row level security;
alter table public.app_portal_learning_audit_logs enable row level security;
revoke all on public.app_portal_learning_records from authenticated, anon;
revoke all on public.app_portal_learning_actions from authenticated, anon;
revoke all on public.app_portal_learning_audit_logs from authenticated, anon;

create or replace function public._aoli286_access_context()
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
    'can_contribute', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._aoli286_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aoli286_can_view(
  r public.app_portal_learning_records,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
begin
  if (p_ctx->>'company_id')::uuid <> r.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  if r.submitted_by_id = v_uid or r.owner_id = v_uid then return true; end if;
  if coalesce(r.contributor_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text) then return true; end if;
  if r.status in ('approved', 'in_progress', 'implemented') then return true; end if;
  return false;
end;
$$;

create or replace function public._aoli286_row(r public.app_portal_learning_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 300),
    'category', r.category,
    'submitted_by_id', r.submitted_by_id,
    'submitted_by_name', public._aoli286_user_name(r.submitted_by_id),
    'owner_id', r.owner_id,
    'owner_name', public._aoli286_user_name(r.owner_id),
    'contributor_ids', r.contributor_ids,
    'status', r.status,
    'impact_level', r.impact_level,
    'date_identified', r.date_identified,
    'date_implemented', r.date_implemented,
    'related_modules', r.related_modules,
    'notes', left(r.notes, 300),
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
$$;

create or replace function public._aoli286_recurring_themes(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_themes jsonb := '[]'::jsonb;
  v_row record;
begin
  for v_row in
    select r.category, count(*)::int as cnt
    from public.app_portal_learning_records r
    where r.company_id = p_company_id and r.status not in ('archived')
    group by r.category
    having count(*) >= 2
    order by count(*) desc
    limit 5
  loop
    v_themes := v_themes || jsonb_build_object(
      'theme_key', v_row.category,
      'count', v_row.cnt,
      'label', v_row.category
    );
  end loop;
  return v_themes;
end;
$$;

create or replace function public._aoli286_build_recommendations(p_items jsonb)
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
    if (v_item->>'status') in ('identified', 'under_review') then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewRepeated', 'record_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'owner_id') is null and (v_item->>'status') not in ('archived', 'implemented') then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignOwner', 'record_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') = 'implemented' then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || (v_item->>'id'), 'key', 'celebrateImplemented', 'record_id', v_item->>'id', 'priority', 'low');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'share-success', 'key', 'shareSuccess', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'evaluate-patterns', 'key', 'evaluatePatterns', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_learning_records(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_impact_level text default null,
  p_identified_from date default null,
  p_identified_to date default null,
  p_recently_implemented boolean default null,
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
  v_recent jsonb := '[]'::jsonb;
  v_archived jsonb := '[]'::jsonb;
  v_implemented integer := 0;
  v_awaiting_review integer := 0;
  v_high_impact integer := 0;
begin
  v_ctx := public._aoli286_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoli286_row(r) order by r.date_identified desc), '[]'::jsonb)
  into v_items
  from public.app_portal_learning_records r
  where r.company_id = v_company_id
    and public._aoli286_can_view(r, v_ctx)
    and (p_category is null or r.category = p_category)
    and (p_owner_id is null or r.owner_id = p_owner_id)
    and (p_status is null or r.status = p_status)
    and (p_impact_level is null or r.impact_level = p_impact_level)
    and (p_identified_from is null or r.date_identified >= p_identified_from)
    and (p_identified_to is null or r.date_identified <= p_identified_to)
    and (
      p_recently_implemented is null
      or (p_recently_implemented = true and r.date_implemented is not null and r.date_implemented >= current_date - interval '90 days')
      or (p_recently_implemented = false and (r.date_implemented is null or r.date_implemented < current_date - interval '90 days'))
    )
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_implemented
  from public.app_portal_learning_records r
  where r.company_id = v_company_id and r.status = 'implemented';

  select count(*)::int into v_awaiting_review
  from public.app_portal_learning_records r
  where r.company_id = v_company_id and r.status in ('identified', 'under_review');

  select count(*)::int into v_high_impact
  from public.app_portal_learning_records r
  where r.company_id = v_company_id
    and r.impact_level in ('significant_improvement', 'transformational_improvement')
    and r.status not in ('archived');

  select coalesce(jsonb_agg(public._aoli286_row(r) order by r.date_identified desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_learning_records where company_id = v_company_id order by date_identified desc limit 5) r;

  select coalesce(jsonb_agg(public._aoli286_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_archived
  from (select * from public.app_portal_learning_records where company_id = v_company_id and status = 'archived' order by updated_at desc limit 5) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_contribute', coalesce(v_ctx->>'can_contribute', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'recently_identified', v_recent,
      'implemented', v_implemented,
      'awaiting_review', v_awaiting_review,
      'high_impact', v_high_impact,
      'recurring_themes', public._aoli286_recurring_themes(v_company_id),
      'recently_archived', v_archived
    ),
    'pattern_insights', jsonb_build_array(
      jsonb_build_object('key', 'repeated_bottlenecks', 'active', (
        select count(*) >= 2 from public.app_portal_learning_records r
        where r.company_id = v_company_id and r.category in ('process_improvement', 'operational_improvement') and r.status <> 'archived'
      )),
      jsonb_build_object('key', 'common_support_issues', 'active', (
        select count(*) >= 2 from public.app_portal_learning_records r
        where r.company_id = v_company_id and r.category = 'customer_experience' and r.status <> 'archived'
      )),
      jsonb_build_object('key', 'delayed_activities', 'active', (
        select count(*) >= 2 from public.app_portal_learning_records r
        where r.company_id = v_company_id and r.category = 'operational_improvement' and r.status <> 'archived'
      )),
      jsonb_build_object('key', 'approval_challenges', 'active', (
        select count(*) >= 2 from public.app_portal_learning_records r
        where r.company_id = v_company_id and r.category = 'process_improvement' and r.status <> 'archived'
      )),
      jsonb_build_object('key', 'onboarding_obstacles', 'active', (
        select count(*) >= 2 from public.app_portal_learning_records r
        where r.company_id = v_company_id and r.category = 'team_collaboration' and r.status <> 'archived'
      ))
    ),
    'recommendations', public._aoli286_build_recommendations(v_items),
    'principle', 'Organizations improve when they remember what they have learned and apply those lessons consistently.'
  );
end;
$$;

create or replace function public.get_app_portal_learning_record(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_learning_records;
  v_audit jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
begin
  v_ctx := public._aoli286_access_context();
  select * into v_r from public.app_portal_learning_records where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._aoli286_can_view(v_r, v_ctx) then
    raise exception 'Learning record access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aoli286_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_learning_audit_logs l where l.learning_record_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'title', a.title, 'root_causes', left(a.root_causes, 500),
    'recommended_actions', left(a.recommended_actions, 500),
    'assigned_owner_id', a.assigned_owner_id,
    'assigned_owner_name', public._aoli286_user_name(a.assigned_owner_id),
    'success_criteria', left(a.success_criteria, 500),
    'expected_outcomes', left(a.expected_outcomes, 500),
    'lessons_applied_elsewhere', left(a.lessons_applied_elsewhere, 500),
    'notes', left(a.notes, 300), 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_actions
  from public.app_portal_learning_actions a where a.learning_record_id = p_id;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_r.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_r.related_follow_up_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_decisions') is not null
     and jsonb_array_length(coalesce(v_r.related_decision_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status)), '[]'::jsonb)
    into v_decisions from public.app_portal_decisions d
    where d.id in (select t.value::uuid from jsonb_array_elements_text(v_r.related_decision_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'record', public._aoli286_row(v_r) || jsonb_build_object(
      'description_full', v_r.description,
      'notes_full', v_r.notes,
      'related_follow_up_ids', v_r.related_follow_up_ids,
      'related_decision_ids', v_r.related_decision_ids
    ),
    'actions', v_actions,
    'related_follow_ups', v_follow_ups,
    'related_decisions', v_decisions,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aoli286_build_recommendations(jsonb_build_array(public._aoli286_row(v_r)))
  );
end;
$$;

create or replace function public.create_app_portal_learning_record(
  p_title text,
  p_description text default '',
  p_category text default 'operational_improvement',
  p_impact_level text default 'moderate_improvement',
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
  v_r public.app_portal_learning_records;
begin
  v_ctx := public._aoli286_access_context();
  if coalesce(v_ctx->>'can_contribute', 'false') <> 'true' then
    raise exception 'Learning record creation requires organization access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_learning_records (
    company_id, title, description, category, submitted_by_id, owner_id,
    impact_level, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'operational_improvement'),
    v_user_id,
    v_user_id,
    coalesce(nullif(trim(p_impact_level), ''), 'moderate_improvement'),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_learning_audit_logs (learning_record_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Learning record created', v_user_id);

  select * into v_r from public.app_portal_learning_records where id = v_id;
  return jsonb_build_object('created', true, 'record', public._aoli286_row(v_r));
end;
$$;

create or replace function public.update_app_portal_learning_record(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_status text default null,
  p_impact_level text default null,
  p_date_implemented date default null,
  p_notes text default null,
  p_owner_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_learning_records;
  v_user_id uuid;
begin
  v_ctx := public._aoli286_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Learning record update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_learning_records where id = p_id;
  if v_r.id is null then raise exception 'Learning record not found'; end if;
  if v_r.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_learning_records set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    status = coalesce(nullif(trim(p_status), ''), status),
    impact_level = coalesce(nullif(trim(p_impact_level), ''), impact_level),
    date_implemented = coalesce(p_date_implemented, date_implemented),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    owner_id = coalesce(p_owner_id, owner_id),
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_learning_audit_logs (learning_record_id, company_id, event_type, description, performed_by)
  values (p_id, v_r.company_id, 'updated', 'Learning record updated', v_user_id);

  select * into v_r from public.app_portal_learning_records where id = p_id;
  return jsonb_build_object('updated', true, 'record', public._aoli286_row(v_r));
end;
$$;

create or replace function public.create_app_portal_learning_action(
  p_record_id uuid,
  p_title text,
  p_root_causes text default '',
  p_recommended_actions text default '',
  p_success_criteria text default '',
  p_expected_outcomes text default '',
  p_lessons_applied_elsewhere text default '',
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_learning_records;
  v_user_id uuid;
  v_id uuid;
  v_a public.app_portal_learning_actions;
begin
  v_ctx := public._aoli286_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Improvement action creation requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_learning_records where id = p_record_id;
  if v_r.id is null then raise exception 'Learning record not found'; end if;

  insert into public.app_portal_learning_actions (
    learning_record_id, company_id, title, root_causes, recommended_actions,
    assigned_owner_id, success_criteria, expected_outcomes, lessons_applied_elsewhere, notes, created_by
  ) values (
    p_record_id,
    v_r.company_id,
    left(trim(p_title), 200),
    left(coalesce(p_root_causes, ''), 2000),
    left(coalesce(p_recommended_actions, ''), 2000),
    v_r.owner_id,
    left(coalesce(p_success_criteria, ''), 2000),
    left(coalesce(p_expected_outcomes, ''), 2000),
    left(coalesce(p_lessons_applied_elsewhere, ''), 2000),
    left(coalesce(p_notes, ''), 1000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_learning_audit_logs (learning_record_id, company_id, event_type, description, performed_by)
  values (p_record_id, v_r.company_id, 'action_added', 'Improvement action recorded', v_user_id);

  select * into v_a from public.app_portal_learning_actions where id = v_id;
  return jsonb_build_object('created', true, 'action', jsonb_build_object(
    'id', v_a.id, 'title', v_a.title, 'root_causes', v_a.root_causes,
    'recommended_actions', v_a.recommended_actions, 'created_at', v_a.created_at
  ));
end;
$$;

grant execute on function public.list_app_portal_learning_records(text, uuid, text, text, date, date, boolean, text) to authenticated;
grant execute on function public.get_app_portal_learning_record(uuid) to authenticated;
grant execute on function public.create_app_portal_learning_record(text, text, text, text, text) to authenticated;
grant execute on function public.update_app_portal_learning_record(uuid, text, text, text, text, text, date, text, uuid) to authenticated;
grant execute on function public.create_app_portal_learning_action(uuid, text, text, text, text, text, text, text) to authenticated;

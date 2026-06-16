-- Phase 288 (APP) — Organizational Success & Value Realization Center

create table if not exists public.app_portal_success_initiatives (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'financial_value', 'operational_value', 'customer_value', 'employee_value',
    'strategic_value', 'productivity_value', 'quality_improvement', 'risk_reduction',
    'innovation_value', 'custom_value_category'
  )),
  initiative_owner_id uuid references public.users (id) on delete set null,
  executive_sponsor_id uuid references public.users (id) on delete set null,
  status text not null default 'planned' check (status in (
    'planned', 'in_progress', 'measuring', 'successful', 'partially_successful',
    'did_not_meet_expectations', 'archived'
  )),
  value_level text not null default 'moderate_value' check (value_level in (
    'emerging_value', 'moderate_value', 'significant_value', 'transformational_value'
  )),
  expected_outcomes text not null default '',
  actual_outcomes text not null default '',
  value_hypothesis text not null default '',
  measurement_method text not null default '',
  start_date date,
  completion_date date,
  review_date date,
  goals_achieved text not null default '',
  goals_missed text not null default '',
  unexpected_benefits text not null default '',
  unexpected_consequences text not null default '',
  recommended_adjustments text not null default '',
  replication_opportunities text not null default '',
  lessons_learned text not null default '',
  related_decision_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_success_initiatives_company_idx
  on public.app_portal_success_initiatives (company_id, category, status, review_date, updated_at desc);

create table if not exists public.app_portal_success_audit_logs (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references public.app_portal_success_initiatives (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_success_audit_idx
  on public.app_portal_success_audit_logs (initiative_id, created_at desc);

alter table public.app_portal_success_initiatives enable row level security;
alter table public.app_portal_success_audit_logs enable row level security;
revoke all on public.app_portal_success_initiatives from authenticated, anon;
revoke all on public.app_portal_success_audit_logs from authenticated, anon;

create or replace function public._aosv288_access_context()
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

create or replace function public._aosv288_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aosv288_can_view(
  s public.app_portal_success_initiatives,
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
  if s.status in ('successful', 'partially_successful', 'measuring') then return true; end if;
  return false;
end;
$$;

create or replace function public._aosv288_row(s public.app_portal_success_initiatives)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', s.id,
    'title', s.title,
    'description', left(s.description, 300),
    'category', s.category,
    'initiative_owner_id', s.initiative_owner_id,
    'initiative_owner_name', public._aosv288_user_name(s.initiative_owner_id),
    'executive_sponsor_id', s.executive_sponsor_id,
    'executive_sponsor_name', public._aosv288_user_name(s.executive_sponsor_id),
    'status', s.status,
    'value_level', s.value_level,
    'expected_outcomes', left(s.expected_outcomes, 300),
    'actual_outcomes', left(s.actual_outcomes, 300),
    'value_hypothesis', left(s.value_hypothesis, 200),
    'measurement_method', left(s.measurement_method, 200),
    'start_date', s.start_date,
    'completion_date', s.completion_date,
    'review_date', s.review_date,
    'missing_measurement', trim(coalesce(s.measurement_method, '')) = '' or trim(coalesce(s.actual_outcomes, '')) = '',
    'notes', left(s.notes, 300),
    'created_at', s.created_at,
    'updated_at', s.updated_at
  );
$$;

create or replace function public._aosv288_build_recommendations(p_items jsonb)
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
    if coalesce((v_item->>'missing_measurement')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'measure-' || (v_item->>'id'), 'key', 'reviewMeasurements', 'initiative_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'status') in ('successful', 'partially_successful') then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || (v_item->>'id'), 'key', 'celebrateSuccess', 'initiative_id', v_item->>'id', 'priority', 'low');
    elsif (v_item->>'status') = 'did_not_meet_expectations' then
      v_recs := v_recs || jsonb_build_object('id', 'reeval-' || (v_item->>'id'), 'key', 'reevaluateUnderperforming', 'initiative_id', v_item->>'id', 'priority', 'high');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'share-success', 'key', 'shareSuccess', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'replicate', 'key', 'replicatePractices', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_success_initiatives(
  p_category text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_sponsor_id uuid default null,
  p_value_level text default null,
  p_review_from date default null,
  p_review_to date default null,
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
  v_realized jsonb := '[]'::jsonb;
  v_under_review integer := 0;
  v_high_impact integer := 0;
  v_missing integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._aosv288_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aosv288_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_success_initiatives s
  where s.company_id = v_company_id
    and public._aosv288_can_view(s, v_ctx)
    and (p_category is null or s.category = p_category)
    and (p_status is null or s.status = p_status)
    and (p_owner_id is null or s.initiative_owner_id = p_owner_id)
    and (p_sponsor_id is null or s.executive_sponsor_id = p_sponsor_id)
    and (p_value_level is null or s.value_level = p_value_level)
    and (p_review_from is null or s.review_date >= p_review_from)
    and (p_review_to is null or s.review_date <= p_review_to)
    and (
      p_search is null or trim(p_search) = ''
      or s.title ilike '%' || trim(p_search) || '%'
      or s.description ilike '%' || trim(p_search) || '%'
      or s.expected_outcomes ilike '%' || trim(p_search) || '%'
      or s.actual_outcomes ilike '%' || trim(p_search) || '%'
      or s.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_success_initiatives s
  where s.company_id = v_company_id and s.status in ('planned', 'in_progress', 'measuring');

  select coalesce(jsonb_agg(public._aosv288_row(s) order by s.completion_date desc nulls last), '[]'::jsonb)
  into v_realized
  from (
    select * from public.app_portal_success_initiatives
    where company_id = v_company_id and status in ('successful', 'partially_successful')
    order by completion_date desc nulls last limit 5
  ) s;

  select count(*)::int into v_under_review
  from public.app_portal_success_initiatives s
  where s.company_id = v_company_id and s.status = 'measuring';

  select count(*)::int into v_high_impact
  from public.app_portal_success_initiatives s
  where s.company_id = v_company_id
    and s.value_level in ('significant_value', 'transformational_value')
    and s.status not in ('archived');

  select count(*)::int into v_missing
  from public.app_portal_success_initiatives s
  where s.company_id = v_company_id
    and s.status not in ('archived')
    and (trim(coalesce(s.measurement_method, '')) = '' or trim(coalesce(s.actual_outcomes, '')) = '');

  select coalesce(jsonb_agg(public._aosv288_row(s) order by s.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_success_initiatives where company_id = v_company_id order by updated_at desc limit 5) s;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'recently_realized', v_realized,
      'under_review', v_under_review,
      'highest_impact', v_high_impact,
      'missing_measurements', v_missing,
      'success_trends', v_recent
    ),
    'recommendations', public._aosv288_build_recommendations(v_items),
    'principle', 'Organizations thrive when they understand what creates value and why.'
  );
end;
$$;

create or replace function public.get_app_portal_success_initiative(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_s public.app_portal_success_initiatives;
  v_audit jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
begin
  v_ctx := public._aosv288_access_context();
  select * into v_s from public.app_portal_success_initiatives where id = p_id;
  if v_s.id is null then return jsonb_build_object('found', false); end if;
  if not public._aosv288_can_view(v_s, v_ctx) then
    raise exception 'Success initiative access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aosv288_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_success_audit_logs l where l.initiative_id = p_id;

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

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'initiative', public._aosv288_row(v_s) || jsonb_build_object(
      'description_full', v_s.description,
      'expected_outcomes_full', v_s.expected_outcomes,
      'actual_outcomes_full', v_s.actual_outcomes,
      'value_hypothesis_full', v_s.value_hypothesis,
      'measurement_method_full', v_s.measurement_method,
      'goals_achieved', v_s.goals_achieved,
      'goals_missed', v_s.goals_missed,
      'unexpected_benefits', v_s.unexpected_benefits,
      'unexpected_consequences', v_s.unexpected_consequences,
      'recommended_adjustments', v_s.recommended_adjustments,
      'replication_opportunities', v_s.replication_opportunities,
      'lessons_learned', v_s.lessons_learned,
      'notes_full', v_s.notes
    ),
    'related_decisions', v_decisions,
    'related_follow_ups', v_follow_ups,
    'review_timeline', v_audit,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aosv288_build_recommendations(jsonb_build_array(public._aosv288_row(v_s)))
  );
end;
$$;

create or replace function public.create_app_portal_success_initiative(
  p_title text,
  p_description text default '',
  p_category text default 'operational_value',
  p_value_level text default 'moderate_value',
  p_expected_outcomes text default '',
  p_value_hypothesis text default '',
  p_measurement_method text default '',
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
  v_s public.app_portal_success_initiatives;
begin
  v_ctx := public._aosv288_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Success initiative creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_success_initiatives (
    company_id, title, description, category, initiative_owner_id, executive_sponsor_id,
    value_level, expected_outcomes, value_hypothesis, measurement_method, start_date, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'operational_value'),
    v_user_id,
    v_user_id,
    coalesce(nullif(trim(p_value_level), ''), 'moderate_value'),
    left(coalesce(p_expected_outcomes, ''), 2000),
    left(coalesce(p_value_hypothesis, ''), 2000),
    left(coalesce(p_measurement_method, ''), 2000),
    current_date,
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_success_audit_logs (initiative_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Success initiative recorded', v_user_id);

  select * into v_s from public.app_portal_success_initiatives where id = v_id;
  return jsonb_build_object('created', true, 'initiative', public._aosv288_row(v_s));
end;
$$;

create or replace function public.update_app_portal_success_initiative(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_status text default null,
  p_value_level text default null,
  p_expected_outcomes text default null,
  p_actual_outcomes text default null,
  p_value_hypothesis text default null,
  p_measurement_method text default null,
  p_completion_date date default null,
  p_review_date date default null,
  p_goals_achieved text default null,
  p_goals_missed text default null,
  p_unexpected_benefits text default null,
  p_unexpected_consequences text default null,
  p_recommended_adjustments text default null,
  p_replication_opportunities text default null,
  p_lessons_learned text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_s public.app_portal_success_initiatives;
  v_user_id uuid;
begin
  v_ctx := public._aosv288_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Success initiative update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_s from public.app_portal_success_initiatives where id = p_id;
  if v_s.id is null then raise exception 'Success initiative not found'; end if;

  update public.app_portal_success_initiatives set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    status = coalesce(nullif(trim(p_status), ''), status),
    value_level = coalesce(nullif(trim(p_value_level), ''), value_level),
    expected_outcomes = case when p_expected_outcomes is not null then left(p_expected_outcomes, 2000) else expected_outcomes end,
    actual_outcomes = case when p_actual_outcomes is not null then left(p_actual_outcomes, 2000) else actual_outcomes end,
    value_hypothesis = case when p_value_hypothesis is not null then left(p_value_hypothesis, 2000) else value_hypothesis end,
    measurement_method = case when p_measurement_method is not null then left(p_measurement_method, 2000) else measurement_method end,
    completion_date = coalesce(p_completion_date, completion_date),
    review_date = coalesce(p_review_date, review_date),
    goals_achieved = case when p_goals_achieved is not null then left(p_goals_achieved, 2000) else goals_achieved end,
    goals_missed = case when p_goals_missed is not null then left(p_goals_missed, 2000) else goals_missed end,
    unexpected_benefits = case when p_unexpected_benefits is not null then left(p_unexpected_benefits, 2000) else unexpected_benefits end,
    unexpected_consequences = case when p_unexpected_consequences is not null then left(p_unexpected_consequences, 2000) else unexpected_consequences end,
    recommended_adjustments = case when p_recommended_adjustments is not null then left(p_recommended_adjustments, 2000) else recommended_adjustments end,
    replication_opportunities = case when p_replication_opportunities is not null then left(p_replication_opportunities, 2000) else replication_opportunities end,
    lessons_learned = case when p_lessons_learned is not null then left(p_lessons_learned, 2000) else lessons_learned end,
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_success_audit_logs (initiative_id, company_id, event_type, description, performed_by)
  values (p_id, v_s.company_id, 'updated', 'Success initiative updated', v_user_id);

  select * into v_s from public.app_portal_success_initiatives where id = p_id;
  return jsonb_build_object('updated', true, 'initiative', public._aosv288_row(v_s));
end;
$$;

grant execute on function public.list_app_portal_success_initiatives(text, text, uuid, uuid, text, date, date, text) to authenticated;
grant execute on function public.get_app_portal_success_initiative(uuid) to authenticated;
grant execute on function public.create_app_portal_success_initiative(text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.update_app_portal_success_initiative(uuid, text, text, text, text, text, text, text, text, text, date, date, text, text, text, text, text, text, text, text) to authenticated;

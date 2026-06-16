-- Phase 290 (APP) — Organizational Prioritization Engine

create table if not exists public.app_portal_prioritization_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'strategic_initiative', 'operational_improvement', 'customer_initiative', 'technology_initiative',
    'risk_mitigation', 'compliance_requirement', 'revenue_opportunity', 'workforce_initiative',
    'innovation_opportunity', 'custom_category'
  )),
  owner_id uuid references public.users (id) on delete set null,
  executive_sponsor_id uuid references public.users (id) on delete set null,
  priority_status text not null default 'under_evaluation' check (priority_status in (
    'under_evaluation', 'recommended', 'high_priority', 'medium_priority', 'low_priority', 'deferred', 'completed'
  )),
  strategic_alignment_score integer not null default 3 check (strategic_alignment_score between 1 and 5),
  impact_score integer not null default 3 check (impact_score between 1 and 5),
  urgency_score integer not null default 3 check (urgency_score between 1 and 5),
  effort_estimate integer not null default 3 check (effort_estimate between 1 and 5),
  capacity_requirement integer not null default 3 check (capacity_requirement between 1 and 5),
  scoring_factors jsonb not null default '{}'::jsonb,
  scoring_weights jsonb not null default '{"strategic_alignment":1,"impact":1,"urgency":1,"effort":1,"capacity":1}'::jsonb,
  due_date date,
  dependencies text not null default '',
  capacity_considerations text not null default '',
  related_goal_ids jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_risk_ids jsonb not null default '[]'::jsonb,
  related_strategy_initiative_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_prioritization_items_company_idx
  on public.app_portal_prioritization_items (company_id, category, priority_status, due_date, updated_at desc);

create table if not exists public.app_portal_prioritization_score_history (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.app_portal_prioritization_items (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  priority_status text,
  strategic_alignment_score integer check (strategic_alignment_score between 1 and 5),
  impact_score integer check (impact_score between 1 and 5),
  urgency_score integer check (urgency_score between 1 and 5),
  effort_estimate integer check (effort_estimate between 1 and 5),
  capacity_requirement integer check (capacity_requirement between 1 and 5),
  scoring_factors jsonb not null default '{}'::jsonb,
  composite_score numeric(5,2),
  matrix_quadrant text,
  notes text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_prioritization_score_history_item_idx
  on public.app_portal_prioritization_score_history (item_id, created_at desc);

create table if not exists public.app_portal_prioritization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.app_portal_prioritization_items (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_prioritization_audit_idx
  on public.app_portal_prioritization_audit_logs (item_id, created_at desc);

alter table public.app_portal_prioritization_items enable row level security;
alter table public.app_portal_prioritization_score_history enable row level security;
alter table public.app_portal_prioritization_audit_logs enable row level security;
revoke all on public.app_portal_prioritization_items from authenticated, anon;
revoke all on public.app_portal_prioritization_score_history from authenticated, anon;
revoke all on public.app_portal_prioritization_audit_logs from authenticated, anon;

create or replace function public._aope290_access_context()
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

create or replace function public._aope290_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aope290_can_view(
  p public.app_portal_prioritization_items,
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
  v_uid := (p_ctx->>'user_id')::uuid;
  if p.owner_id = v_uid or p.executive_sponsor_id = v_uid then return true; end if;
  return false;
end;
$$;

create or replace function public._aope290_matrix_quadrant(p_impact integer, p_effort integer)
returns text
language sql
immutable
as $$
  select case
    when p_impact >= 4 and p_effort <= 2 then 'quick_wins'
    when p_impact >= 4 and p_effort >= 3 then 'major_projects'
    when p_impact <= 3 and p_effort <= 2 then 'fill_ins'
    else 'reconsider'
  end;
$$;

create or replace function public._aope290_composite_score(
  p_alignment integer,
  p_impact integer,
  p_urgency integer,
  p_effort integer,
  p_capacity integer,
  p_weights jsonb default null
)
returns numeric
language plpgsql
immutable
as $$
declare
  v_w jsonb := coalesce(p_weights, '{"strategic_alignment":1,"impact":1,"urgency":1,"effort":1,"capacity":1}'::jsonb);
  v_sa numeric := coalesce((v_w->>'strategic_alignment')::numeric, 1);
  v_imp numeric := coalesce((v_w->>'impact')::numeric, 1);
  v_urg numeric := coalesce((v_w->>'urgency')::numeric, 1);
  v_eff numeric := coalesce((v_w->>'effort')::numeric, 1);
  v_cap numeric := coalesce((v_w->>'capacity')::numeric, 1);
  v_total numeric := v_sa + v_imp + v_urg + v_eff + v_cap;
begin
  if v_total = 0 then v_total := 1; end if;
  return round((
    (p_alignment * v_sa) + (p_impact * v_imp) + (p_urgency * v_urg)
    + ((6 - p_effort) * v_eff) + ((6 - p_capacity) * v_cap)
  ) / v_total, 2);
end;
$$;

create or replace function public._aope290_row(p public.app_portal_prioritization_items)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', left(p.description, 300),
    'category', p.category,
    'owner_id', p.owner_id,
    'owner_name', public._aope290_user_name(p.owner_id),
    'executive_sponsor_id', p.executive_sponsor_id,
    'executive_sponsor_name', public._aope290_user_name(p.executive_sponsor_id),
    'priority_status', p.priority_status,
    'strategic_alignment_score', p.strategic_alignment_score,
    'impact_score', p.impact_score,
    'urgency_score', p.urgency_score,
    'effort_estimate', p.effort_estimate,
    'capacity_requirement', p.capacity_requirement,
    'scoring_factors', p.scoring_factors,
    'scoring_weights', p.scoring_weights,
    'composite_score', public._aope290_composite_score(
      p.strategic_alignment_score, p.impact_score, p.urgency_score,
      p.effort_estimate, p.capacity_requirement, p.scoring_weights
    ),
    'matrix_quadrant', public._aope290_matrix_quadrant(p.impact_score, p.effort_estimate),
    'due_date', p.due_date,
    'dependencies', left(p.dependencies, 200),
    'capacity_considerations', left(p.capacity_considerations, 200),
    'capacity_conflict', p.capacity_requirement >= 4 and p.priority_status in ('high_priority', 'recommended'),
    'notes', left(p.notes, 300),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  );
$$;

create or replace function public._aope290_build_recommendations(p_items jsonb)
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
    if (v_item->>'strategic_alignment_score')::int >= 4 and (v_item->>'priority_status') not in ('high_priority', 'completed') then
      v_recs := v_recs || jsonb_build_object('id', 'elevate-' || (v_item->>'id'), 'key', 'elevateStrategic', 'item_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'matrix_quadrant') = 'reconsider' then
      v_recs := v_recs || jsonb_build_object('id', 'reconsider-' || (v_item->>'id'), 'key', 'reconsiderLowValue', 'item_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'urgency_score')::int >= 4 and (v_item->>'category') = 'customer_initiative' then
      v_recs := v_recs || jsonb_build_object('id', 'urgent-' || (v_item->>'id'), 'key', 'addressUrgentCustomer', 'item_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'capacity_conflict')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'defer-' || (v_item->>'id'), 'key', 'deferOverCapacity', 'item_id', v_item->>'id', 'priority', 'medium');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'conflicts', 'key', 'reviewConflicts', 'priority', 'medium');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_prioritization_items(
  p_category text default null,
  p_priority_status text default null,
  p_owner_id uuid default null,
  p_sponsor_id uuid default null,
  p_alignment_min integer default null,
  p_due_from date default null,
  p_due_to date default null,
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
  v_highest jsonb := '[]'::jsonb;
  v_deferred jsonb := '[]'::jsonb;
  v_conflicts integer := 0;
  v_alignment_avg numeric := 0;
  v_reprioritized jsonb := '[]'::jsonb;
begin
  v_ctx := public._aope290_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aope290_row(p) order by
    public._aope290_composite_score(p.strategic_alignment_score, p.impact_score, p.urgency_score, p.effort_estimate, p.capacity_requirement, p.scoring_weights) desc,
    p.updated_at desc
  ), '[]'::jsonb)
  into v_items
  from public.app_portal_prioritization_items p
  where p.company_id = v_company_id
    and public._aope290_can_view(p, v_ctx)
    and (p_category is null or p.category = p_category)
    and (p_priority_status is null or p.priority_status = p_priority_status)
    and (p_owner_id is null or p.owner_id = p_owner_id)
    and (p_sponsor_id is null or p.executive_sponsor_id = p_sponsor_id)
    and (p_alignment_min is null or p.strategic_alignment_score >= p_alignment_min)
    and (p_due_from is null or p.due_date >= p_due_from)
    and (p_due_to is null or p.due_date <= p_due_to)
    and (
      p_search is null or trim(p_search) = ''
      or p.title ilike '%' || trim(p_search) || '%'
      or p.description ilike '%' || trim(p_search) || '%'
      or p.notes ilike '%' || trim(p_search) || '%'
    );

  select coalesce(jsonb_agg(e order by (e->>'composite_score')::numeric desc), '[]'::jsonb)
  into v_highest
  from (
    select e from jsonb_array_elements(v_items) e
    where (e->>'priority_status') in ('high_priority', 'recommended')
    limit 5
  ) sub;

  select coalesce(jsonb_agg(e), '[]'::jsonb)
  into v_deferred
  from (
    select e from jsonb_array_elements(v_items) e
    where (e->>'priority_status') = 'deferred'
    limit 5
  ) sub;

  select count(*)::int into v_conflicts
  from jsonb_array_elements(v_items) e
  where coalesce((e->>'capacity_conflict')::boolean, false);

  select coalesce(avg(p.strategic_alignment_score), 0) into v_alignment_avg
  from public.app_portal_prioritization_items p
  where p.company_id = v_company_id and p.priority_status <> 'completed';

  select coalesce(jsonb_agg(sub.row_data), '[]'::jsonb)
  into v_reprioritized
  from (
    select jsonb_build_object(
      'id', h.id, 'item_id', h.item_id, 'priority_status', h.priority_status,
      'composite_score', h.composite_score, 'matrix_quadrant', h.matrix_quadrant,
      'created_at', h.created_at, 'performed_by', public._aope290_user_name(h.performed_by)
    ) as row_data
    from public.app_portal_prioritization_score_history h
    where h.company_id = v_company_id
    order by h.created_at desc
    limit 5
  ) sub;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'highest_priority', v_highest,
      'deferred', v_deferred,
      'capacity_conflicts', v_conflicts,
      'strategic_alignment_overview', round(v_alignment_avg, 1),
      'recently_reprioritized', v_reprioritized
    ),
    'matrix', jsonb_build_object(
      'quick_wins', (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(v_items) e where e->>'matrix_quadrant' = 'quick_wins'),
      'major_projects', (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(v_items) e where e->>'matrix_quadrant' = 'major_projects'),
      'fill_ins', (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(v_items) e where e->>'matrix_quadrant' = 'fill_ins'),
      'reconsider', (select coalesce(jsonb_agg(e), '[]'::jsonb) from jsonb_array_elements(v_items) e where e->>'matrix_quadrant' = 'reconsider')
    ),
    'recommendations', public._aope290_build_recommendations(v_items),
    'principle', 'Organizations perform better when they focus on what matters most.'
  );
end;
$$;

create or replace function public.get_app_portal_prioritization_item(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_prioritization_items;
  v_audit jsonb := '[]'::jsonb;
  v_score_history jsonb := '[]'::jsonb;
  v_goals jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_strategies jsonb := '[]'::jsonb;
begin
  v_ctx := public._aope290_access_context();
  select * into v_p from public.app_portal_prioritization_items where id = p_id;
  if v_p.id is null then return jsonb_build_object('found', false); end if;
  if not public._aope290_can_view(v_p, v_ctx) then
    raise exception 'Prioritization item access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aope290_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_prioritization_audit_logs l where l.item_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'priority_status', h.priority_status,
    'strategic_alignment_score', h.strategic_alignment_score,
    'impact_score', h.impact_score,
    'urgency_score', h.urgency_score,
    'effort_estimate', h.effort_estimate,
    'capacity_requirement', h.capacity_requirement,
    'composite_score', h.composite_score,
    'matrix_quadrant', h.matrix_quadrant,
    'notes', h.notes,
    'created_at', h.created_at,
    'performed_by', public._aope290_user_name(h.performed_by)
  ) order by h.created_at desc), '[]'::jsonb)
  into v_score_history
  from public.app_portal_prioritization_score_history h where h.item_id = p_id;

  if to_regclass('public.app_portal_goals') is not null
     and jsonb_array_length(coalesce(v_p.related_goal_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'title', g.title, 'status', g.status)), '[]'::jsonb)
    into v_goals from public.app_portal_goals g
    where g.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_goal_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_follow_ups') is not null
     and jsonb_array_length(coalesce(v_p.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups from public.app_portal_follow_ups f
    where f.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_follow_up_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_risks') is not null
     and jsonb_array_length(coalesce(v_p.related_risk_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'title', r.title, 'status', r.status)), '[]'::jsonb)
    into v_risks from public.app_portal_risks r
    where r.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_risk_ids) as t(value));
  end if;

  if to_regclass('public.app_portal_strategy_initiatives') is not null
     and jsonb_array_length(coalesce(v_p.related_strategy_initiative_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'title', s.title, 'status', s.status)), '[]'::jsonb)
    into v_strategies from public.app_portal_strategy_initiatives s
    where s.id in (select t.value::uuid from jsonb_array_elements_text(v_p.related_strategy_initiative_ids) as t(value));
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'item', public._aope290_row(v_p) || jsonb_build_object(
      'description_full', v_p.description,
      'dependencies_full', v_p.dependencies,
      'capacity_considerations_full', v_p.capacity_considerations,
      'notes_full', v_p.notes
    ),
    'related_goals', v_goals,
    'related_follow_ups', v_follow_ups,
    'related_risks', v_risks,
    'related_strategic_initiatives', v_strategies,
    'recommendation_history', v_score_history,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aope290_build_recommendations(jsonb_build_array(public._aope290_row(v_p)))
  );
end;
$$;

create or replace function public.create_app_portal_prioritization_item(
  p_title text,
  p_description text default '',
  p_category text default 'strategic_initiative',
  p_due_date date default null,
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
  v_p public.app_portal_prioritization_items;
begin
  v_ctx := public._aope290_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Prioritization item creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_prioritization_items (
    company_id, title, description, category, owner_id, executive_sponsor_id, due_date, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'strategic_initiative'),
    v_user_id,
    v_user_id,
    p_due_date,
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_prioritization_audit_logs (item_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Prioritization item created', v_user_id);

  select * into v_p from public.app_portal_prioritization_items where id = v_id;
  return jsonb_build_object('created', true, 'item', public._aope290_row(v_p));
end;
$$;

create or replace function public.update_app_portal_prioritization_item(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_priority_status text default null,
  p_dependencies text default null,
  p_capacity_considerations text default null,
  p_due_date date default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_prioritization_items;
  v_user_id uuid;
begin
  v_ctx := public._aope290_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Prioritization item update requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_prioritization_items where id = p_id;
  if v_p.id is null then raise exception 'Prioritization item not found'; end if;

  update public.app_portal_prioritization_items set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    priority_status = coalesce(nullif(trim(p_priority_status), ''), priority_status),
    dependencies = case when p_dependencies is not null then left(p_dependencies, 2000) else dependencies end,
    capacity_considerations = case when p_capacity_considerations is not null then left(p_capacity_considerations, 2000) else capacity_considerations end,
    due_date = coalesce(p_due_date, due_date),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_prioritization_audit_logs (item_id, company_id, event_type, description, performed_by)
  values (p_id, v_p.company_id, 'updated', 'Prioritization item updated', v_user_id);

  select * into v_p from public.app_portal_prioritization_items where id = p_id;
  return jsonb_build_object('updated', true, 'item', public._aope290_row(v_p));
end;
$$;

create or replace function public.record_app_portal_prioritization_score(
  p_id uuid,
  p_priority_status text default null,
  p_strategic_alignment_score integer default null,
  p_impact_score integer default null,
  p_urgency_score integer default null,
  p_effort_estimate integer default null,
  p_capacity_requirement integer default null,
  p_scoring_factors jsonb default null,
  p_scoring_weights jsonb default null,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_prioritization_items;
  v_user_id uuid;
  v_sa integer;
  v_imp integer;
  v_urg integer;
  v_eff integer;
  v_cap integer;
  v_comp numeric;
  v_quad text;
begin
  v_ctx := public._aope290_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Prioritization scoring requires manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_prioritization_items where id = p_id;
  if v_p.id is null then raise exception 'Prioritization item not found'; end if;

  v_sa := coalesce(greatest(1, least(5, p_strategic_alignment_score)), v_p.strategic_alignment_score);
  v_imp := coalesce(greatest(1, least(5, p_impact_score)), v_p.impact_score);
  v_urg := coalesce(greatest(1, least(5, p_urgency_score)), v_p.urgency_score);
  v_eff := coalesce(greatest(1, least(5, p_effort_estimate)), v_p.effort_estimate);
  v_cap := coalesce(greatest(1, least(5, p_capacity_requirement)), v_p.capacity_requirement);
  v_comp := public._aope290_composite_score(v_sa, v_imp, v_urg, v_eff, v_cap, coalesce(p_scoring_weights, v_p.scoring_weights));
  v_quad := public._aope290_matrix_quadrant(v_imp, v_eff);

  update public.app_portal_prioritization_items set
    priority_status = coalesce(nullif(trim(p_priority_status), ''), priority_status),
    strategic_alignment_score = v_sa,
    impact_score = v_imp,
    urgency_score = v_urg,
    effort_estimate = v_eff,
    capacity_requirement = v_cap,
    scoring_factors = coalesce(p_scoring_factors, scoring_factors),
    scoring_weights = coalesce(p_scoring_weights, scoring_weights),
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_prioritization_score_history (
    item_id, company_id, priority_status, strategic_alignment_score, impact_score,
    urgency_score, effort_estimate, capacity_requirement, scoring_factors,
    composite_score, matrix_quadrant, notes, performed_by
  ) values (
    p_id, v_p.company_id,
    coalesce(nullif(trim(p_priority_status), ''), v_p.priority_status),
    v_sa, v_imp, v_urg, v_eff, v_cap,
    coalesce(p_scoring_factors, v_p.scoring_factors),
    v_comp, v_quad,
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  );

  insert into public.app_portal_prioritization_audit_logs (item_id, company_id, event_type, description, performed_by, metadata)
  values (p_id, v_p.company_id, 'scored', 'Prioritization scores updated', v_user_id,
    jsonb_build_object('composite_score', v_comp, 'matrix_quadrant', v_quad));

  select * into v_p from public.app_portal_prioritization_items where id = p_id;
  return jsonb_build_object('scored', true, 'item', public._aope290_row(v_p));
end;
$$;

grant execute on function public.list_app_portal_prioritization_items(text, text, uuid, uuid, integer, date, date, text) to authenticated;
grant execute on function public.get_app_portal_prioritization_item(uuid) to authenticated;
grant execute on function public.create_app_portal_prioritization_item(text, text, text, date, text) to authenticated;
grant execute on function public.update_app_portal_prioritization_item(uuid, text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.record_app_portal_prioritization_score(uuid, text, integer, integer, integer, integer, integer, jsonb, jsonb, text) to authenticated;

-- Phase 279 (APP) — Organizational Risks & Mitigation Center

create table if not exists public.app_portal_risks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'operational', 'financial', 'security', 'compliance', 'customer',
    'vendor', 'strategic', 'technology', 'reputational', 'workforce'
  )),
  owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  shared_with_ids jsonb not null default '[]'::jsonb,
  status text not null default 'identified' check (status in (
    'identified', 'under_review', 'mitigation_in_progress', 'monitoring',
    'accepted', 'resolved', 'archived'
  )),
  likelihood text not null default 'moderate' check (likelihood in (
    'very_low', 'low', 'moderate', 'high', 'very_high'
  )),
  impact text not null default 'moderate' check (impact in (
    'negligible', 'minor', 'moderate', 'major', 'critical'
  )),
  identified_date date not null default current_date,
  review_frequency text check (review_frequency is null or review_frequency in (
    'monthly', 'quarterly', 'semi_annual', 'annual'
  )),
  next_review_date date,
  mitigation_strategy text not null default '',
  contingency_plan text not null default '',
  related_modules jsonb not null default '[]'::jsonb,
  related_follow_up_ids jsonb not null default '[]'::jsonb,
  related_decision_ids jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_risks_company_idx
  on public.app_portal_risks (company_id, category, status, updated_at desc);

create table if not exists public.app_portal_risk_mitigations (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.app_portal_risks (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  action_taken text not null default '',
  effectiveness_review text not null default '',
  residual_likelihood text check (residual_likelihood is null or residual_likelihood in (
    'very_low', 'low', 'moderate', 'high', 'very_high'
  )),
  residual_impact text check (residual_impact is null or residual_impact in (
    'negligible', 'minor', 'moderate', 'major', 'critical'
  )),
  next_review_date date,
  escalation_required boolean not null default false,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_risk_mitigations_risk_idx
  on public.app_portal_risk_mitigations (risk_id, created_at desc);

create table if not exists public.app_portal_risk_audit_logs (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.app_portal_risks (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_risk_audit_idx
  on public.app_portal_risk_audit_logs (risk_id, created_at desc);

alter table public.app_portal_risks enable row level security;
alter table public.app_portal_risk_mitigations enable row level security;
alter table public.app_portal_risk_audit_logs enable row level security;
revoke all on public.app_portal_risks from authenticated, anon;
revoke all on public.app_portal_risk_mitigations from authenticated, anon;
revoke all on public.app_portal_risk_audit_logs from authenticated, anon;

create or replace function public._aprisk279_access_context()
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
    'is_security_leader', v_role in ('organization_owner', 'organization_admin')
  );
end;
$$;

create or replace function public._aprisk279_score(p_likelihood text, p_impact text)
returns integer
language sql
immutable
as $$
  select (
    case p_likelihood
      when 'very_low' then 1 when 'low' then 2 when 'moderate' then 3 when 'high' then 4 when 'very_high' then 5 else 3
    end
  ) * (
    case p_impact
      when 'negligible' then 1 when 'minor' then 2 when 'moderate' then 3 when 'major' then 4 when 'critical' then 5 else 3
    end
  );
$$;

create or replace function public._aprisk279_overall_level(p_likelihood text, p_impact text)
returns text
language sql
immutable
as $$
  select case
    when public._aprisk279_score(p_likelihood, p_impact) >= 17 then 'critical'
    when public._aprisk279_score(p_likelihood, p_impact) >= 10 then 'high'
    when public._aprisk279_score(p_likelihood, p_impact) >= 5 then 'medium'
    else 'low'
  end;
$$;

create or replace function public._aprisk279_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._aprisk279_can_view(
  r public.app_portal_risks,
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
  if coalesce(p_ctx->>'is_security_leader', 'false') = 'true'
     and r.category in ('security', 'compliance') then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  return r.owner_id = v_uid
    or coalesce(r.contributor_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text)
    or coalesce(r.shared_with_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text);
end;
$$;

create or replace function public._aprisk279_needs_review(r public.app_portal_risks)
returns boolean
language sql
stable
as $$
  select r.status not in ('resolved', 'archived', 'accepted')
    and (
      r.next_review_date is not null and r.next_review_date <= current_date
      or r.next_review_date is null and r.identified_date < current_date - interval '90 days'
    );
$$;

create or replace function public._aprisk279_row(r public.app_portal_risks)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'description', left(r.description, 500),
    'category', r.category,
    'owner_id', r.owner_id,
    'owner_name', public._aprisk279_user_name(r.owner_id),
    'contributor_ids', r.contributor_ids,
    'shared_with_ids', r.shared_with_ids,
    'status', r.status,
    'likelihood', r.likelihood,
    'impact', r.impact,
    'overall_level', public._aprisk279_overall_level(r.likelihood, r.impact),
    'risk_score', public._aprisk279_score(r.likelihood, r.impact),
    'identified_date', r.identified_date,
    'review_frequency', r.review_frequency,
    'next_review_date', r.next_review_date,
    'mitigation_strategy', left(r.mitigation_strategy, 300),
    'contingency_plan', left(r.contingency_plan, 300),
    'related_modules', r.related_modules,
    'notes', left(r.notes, 300),
    'needs_review', public._aprisk279_needs_review(r),
    'created_at', r.created_at,
    'updated_at', r.updated_at
  );
end;
$$;

create or replace function public._aprisk279_build_recommendations(p_items jsonb)
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
    if (v_item->>'owner_id') is null and (v_item->>'status') not in ('resolved', 'archived') then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignOwner', 'risk_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->>'needs_review')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewOverdue', 'risk_id', v_item->>'id', 'priority', 'medium');
    elsif (v_item->>'overall_level') in ('critical', 'high') and (v_item->>'status') not in ('resolved', 'archived', 'mitigation_in_progress') then
      v_recs := v_recs || jsonb_build_object('id', 'escalate-' || (v_item->>'id'), 'key', 'escalateCritical', 'risk_id', v_item->>'id', 'priority', 'high');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'update-mitigation', 'key', 'updateMitigation', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'archive-resolved', 'key', 'archiveResolved', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public.list_app_portal_risks(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_overall_level text default null,
  p_review_before date default null,
  p_recently_updated boolean default null,
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
  v_high integer := 0;
  v_needs_review integer := 0;
  v_no_owner integer := 0;
  v_approaching integer := 0;
  v_resolved jsonb := '[]'::jsonb;
begin
  v_ctx := public._aprisk279_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aprisk279_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_risks r
  where r.company_id = v_company_id
    and public._aprisk279_can_view(r, v_ctx)
    and (p_category is null or r.category = p_category)
    and (p_owner_id is null or r.owner_id = p_owner_id)
    and (p_status is null or r.status = p_status)
    and (p_overall_level is null or public._aprisk279_overall_level(r.likelihood, r.impact) = p_overall_level)
    and (p_review_before is null or r.next_review_date <= p_review_before)
    and (p_recently_updated is null or p_recently_updated = false or r.updated_at >= now() - interval '30 days')
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
      or r.mitigation_strategy ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_risks r
  where r.company_id = v_company_id and r.status not in ('resolved', 'archived');

  select count(*)::int into v_high
  from public.app_portal_risks r
  where r.company_id = v_company_id
    and public._aprisk279_overall_level(r.likelihood, r.impact) in ('high', 'critical')
    and r.status not in ('resolved', 'archived');

  select count(*)::int into v_needs_review
  from public.app_portal_risks r
  where r.company_id = v_company_id and public._aprisk279_needs_review(r);

  select count(*)::int into v_no_owner
  from public.app_portal_risks r
  where r.company_id = v_company_id and r.owner_id is null and r.status not in ('resolved', 'archived');

  select count(*)::int into v_approaching
  from public.app_portal_risks r
  where r.company_id = v_company_id
    and r.next_review_date is not null
    and r.next_review_date between current_date and current_date + interval '14 days'
    and r.status not in ('resolved', 'archived');

  select coalesce(jsonb_agg(public._aprisk279_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_resolved
  from (
    select * from public.app_portal_risks
    where company_id = v_company_id and status = 'resolved'
    order by updated_at desc limit 5
  ) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'high_risk', v_high,
      'needs_review', v_needs_review,
      'without_owner', v_no_owner,
      'approaching_review', v_approaching,
      'recently_resolved', v_resolved
    ),
    'recommendations', public._aprisk279_build_recommendations(v_items),
    'principle', 'Prepared organizations respond with clarity — human teams own risk decisions and mitigation.'
  );
end;
$$;

create or replace function public.get_app_portal_risk(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_risks;
  v_mitigations jsonb := '[]'::jsonb;
  v_contributors jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_follow_ups jsonb := '[]'::jsonb;
  v_decisions jsonb := '[]'::jsonb;
begin
  v_ctx := public._aprisk279_access_context();
  select * into v_r from public.app_portal_risks where id = p_id;
  if v_r.id is null then return jsonb_build_object('found', false); end if;
  if not public._aprisk279_can_view(v_r, v_ctx) then
    raise exception 'Risk access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'action_taken', m.action_taken, 'effectiveness_review', m.effectiveness_review,
    'residual_likelihood', m.residual_likelihood, 'residual_impact', m.residual_impact,
    'residual_level', case when m.residual_likelihood is not null and m.residual_impact is not null
      then public._aprisk279_overall_level(m.residual_likelihood, m.residual_impact) else null end,
    'next_review_date', m.next_review_date, 'escalation_required', m.escalation_required,
    'created_at', m.created_at, 'performed_by', public._aprisk279_user_name(m.created_by)
  ) order by m.created_at desc), '[]'::jsonb)
  into v_mitigations
  from public.app_portal_risk_mitigations m where m.risk_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_contributors
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_r.contributor_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._aprisk279_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_risk_audit_logs l where l.risk_id = p_id;

  if to_regclass('public.app_portal_follow_ups') is not null and jsonb_array_length(coalesce(v_r.related_follow_up_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (
      select t.value::uuid from jsonb_array_elements_text(v_r.related_follow_up_ids) as t(value)
    );
  end if;

  if to_regclass('public.app_portal_decisions') is not null and jsonb_array_length(coalesce(v_r.related_decision_ids, '[]'::jsonb)) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status)), '[]'::jsonb)
    into v_decisions
    from public.app_portal_decisions d
    where d.id in (
      select t.value::uuid from jsonb_array_elements_text(v_r.related_decision_ids) as t(value)
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'risk', public._aprisk279_row(v_r) || jsonb_build_object(
      'description_full', v_r.description,
      'mitigation_strategy_full', v_r.mitigation_strategy,
      'contingency_plan_full', v_r.contingency_plan,
      'notes_full', v_r.notes,
      'related_follow_up_ids', v_r.related_follow_up_ids,
      'related_decision_ids', v_r.related_decision_ids
    ),
    'mitigations', v_mitigations,
    'contributors', v_contributors,
    'related_follow_ups', v_follow_ups,
    'related_decisions', v_decisions,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._aprisk279_build_recommendations(jsonb_build_array(public._aprisk279_row(v_r)))
  );
end;
$$;

create or replace function public.create_app_portal_risk(
  p_title text,
  p_description text default '',
  p_category text default 'operational',
  p_owner_id uuid default null,
  p_contributor_ids jsonb default '[]'::jsonb,
  p_shared_with_ids jsonb default '[]'::jsonb,
  p_status text default 'identified',
  p_likelihood text default 'moderate',
  p_impact text default 'moderate',
  p_identified_date date default null,
  p_review_frequency text default null,
  p_next_review_date date default null,
  p_mitigation_strategy text default '',
  p_contingency_plan text default '',
  p_related_modules jsonb default '[]'::jsonb,
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
  v_r public.app_portal_risks;
begin
  v_ctx := public._aprisk279_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and coalesce(v_ctx->>'is_security_leader', 'false') <> 'true' then
    raise exception 'Risk creation requires manager or security leader access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_risks (
    company_id, title, description, category, owner_id, contributor_ids, shared_with_ids,
    status, likelihood, impact, identified_date, review_frequency, next_review_date,
    mitigation_strategy, contingency_plan, related_modules, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'operational'),
    p_owner_id,
    coalesce(p_contributor_ids, '[]'::jsonb),
    coalesce(p_shared_with_ids, '[]'::jsonb),
    coalesce(nullif(trim(p_status), ''), 'identified'),
    coalesce(nullif(trim(p_likelihood), ''), 'moderate'),
    coalesce(nullif(trim(p_impact), ''), 'moderate'),
    coalesce(p_identified_date, current_date),
    nullif(trim(p_review_frequency), ''),
    p_next_review_date,
    left(coalesce(p_mitigation_strategy, ''), 5000),
    left(coalesce(p_contingency_plan, ''), 5000),
    coalesce(p_related_modules, '[]'::jsonb),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_risk_audit_logs (risk_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Risk record created', v_user_id);

  select * into v_r from public.app_portal_risks where id = v_id;
  return jsonb_build_object('created', true, 'risk', public._aprisk279_row(v_r));
end;
$$;

create or replace function public.update_app_portal_risk(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_owner_id uuid default null,
  p_contributor_ids jsonb default null,
  p_shared_with_ids jsonb default null,
  p_status text default null,
  p_likelihood text default null,
  p_impact text default null,
  p_review_frequency text default null,
  p_next_review_date date default null,
  p_mitigation_strategy text default null,
  p_contingency_plan text default null,
  p_related_modules jsonb default null,
  p_notes text default null,
  p_clear_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_risks;
  v_user_id uuid;
begin
  v_ctx := public._aprisk279_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and coalesce(v_ctx->>'is_security_leader', 'false') <> 'true' then
    raise exception 'Risk update requires manager or security leader access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_risks where id = p_id;
  if v_r.id is null then raise exception 'Risk not found'; end if;
  if v_r.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  update public.app_portal_risks set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    contributor_ids = coalesce(p_contributor_ids, contributor_ids),
    shared_with_ids = coalesce(p_shared_with_ids, shared_with_ids),
    status = coalesce(nullif(trim(p_status), ''), status),
    likelihood = coalesce(nullif(trim(p_likelihood), ''), likelihood),
    impact = coalesce(nullif(trim(p_impact), ''), impact),
    review_frequency = case when p_review_frequency is not null then nullif(trim(p_review_frequency), '') else review_frequency end,
    next_review_date = coalesce(p_next_review_date, next_review_date),
    mitigation_strategy = case when p_mitigation_strategy is not null then left(p_mitigation_strategy, 5000) else mitigation_strategy end,
    contingency_plan = case when p_contingency_plan is not null then left(p_contingency_plan, 5000) else contingency_plan end,
    related_modules = coalesce(p_related_modules, related_modules),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    updated_at = now()
  where id = p_id;

  insert into public.app_portal_risk_audit_logs (risk_id, company_id, event_type, description, performed_by)
  values (p_id, v_r.company_id, 'updated', 'Risk record updated', v_user_id);

  select * into v_r from public.app_portal_risks where id = p_id;
  return jsonb_build_object('updated', true, 'risk', public._aprisk279_row(v_r));
end;
$$;

create or replace function public.add_app_portal_risk_mitigation(
  p_risk_id uuid,
  p_action_taken text,
  p_effectiveness_review text default '',
  p_residual_likelihood text default null,
  p_residual_impact text default null,
  p_next_review_date date default null,
  p_escalation_required boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_r public.app_portal_risks;
  v_user_id uuid;
  v_id uuid;
begin
  v_ctx := public._aprisk279_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true'
     and coalesce(v_ctx->>'is_security_leader', 'false') <> 'true' then
    raise exception 'Mitigation recording requires manager or security leader access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_r from public.app_portal_risks where id = p_risk_id;
  if v_r.id is null then raise exception 'Risk not found'; end if;
  if v_r.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  insert into public.app_portal_risk_mitigations (
    risk_id, company_id, action_taken, effectiveness_review,
    residual_likelihood, residual_impact, next_review_date, escalation_required, created_by
  ) values (
    p_risk_id, v_r.company_id,
    left(coalesce(p_action_taken, ''), 3000),
    left(coalesce(p_effectiveness_review, ''), 2000),
    nullif(trim(p_residual_likelihood), ''),
    nullif(trim(p_residual_impact), ''),
    p_next_review_date,
    coalesce(p_escalation_required, false),
    v_user_id
  ) returning id into v_id;

  update public.app_portal_risks set
    status = case when status = 'identified' then 'mitigation_in_progress' else status end,
    next_review_date = coalesce(p_next_review_date, next_review_date),
    updated_at = now()
  where id = p_risk_id;

  insert into public.app_portal_risk_audit_logs (risk_id, company_id, event_type, description, performed_by)
  values (p_risk_id, v_r.company_id, 'mitigation', 'Mitigation activity recorded', v_user_id);

  return jsonb_build_object(
    'created', true,
    'mitigation_id', v_id,
    'risk', public._aprisk279_row((select r from public.app_portal_risks r where r.id = p_risk_id))
  );
end;
$$;

grant execute on function public.list_app_portal_risks(text, uuid, text, text, date, boolean, text) to authenticated;
grant execute on function public.get_app_portal_risk(uuid) to authenticated;
grant execute on function public.create_app_portal_risk(text, text, text, uuid, jsonb, jsonb, text, text, text, date, text, date, text, text, jsonb, text) to authenticated;
grant execute on function public.update_app_portal_risk(uuid, text, text, text, uuid, jsonb, jsonb, text, text, text, text, date, text, text, jsonb, text, boolean) to authenticated;
grant execute on function public.add_app_portal_risk_mitigation(uuid, text, text, text, text, date, boolean) to authenticated;

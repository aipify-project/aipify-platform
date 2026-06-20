-- Phase 269 (APP) — Decision Center & Decision History Engine

create table if not exists public.app_portal_decisions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'strategic', 'financial', 'operational', 'customer_experience', 'human_resources',
    'security', 'technology', 'compliance', 'marketing', 'growth'
  )),
  decision_owner_id uuid references public.users (id) on delete set null,
  contributors jsonb not null default '[]'::jsonb,
  decision_date timestamptz not null default now(),
  status text not null default 'proposed' check (status in (
    'proposed', 'under_review', 'approved', 'rejected', 'implemented', 'evaluated'
  )),
  impact_level text not null default 'moderate' check (impact_level in (
    'low', 'moderate', 'high', 'critical'
  )),
  expected_outcome text not null default '',
  supporting_evidence jsonb not null default '[]'::jsonb,
  related_business_packs jsonb not null default '[]'::jsonb,
  linked_follow_up_ids jsonb not null default '[]'::jsonb,
  outcome_rating integer check (outcome_rating is null or outcome_rating between 1 and 5),
  lessons_learned text not null default '',
  unexpected_consequences text not null default '',
  would_repeat text check (would_repeat is null or would_repeat in ('yes', 'partially', 'no')),
  evaluated_at timestamptz,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_decisions_company_idx
  on public.app_portal_decisions (company_id, status, decision_date desc);

create index if not exists app_portal_decisions_search_idx
  on public.app_portal_decisions using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));

create table if not exists public.app_portal_decision_audit_logs (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.app_portal_decisions (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_decision_audit_decision_idx
  on public.app_portal_decision_audit_logs (decision_id, created_at desc);

alter table public.app_portal_decisions enable row level security;
alter table public.app_portal_decision_audit_logs enable row level security;
revoke all on public.app_portal_decisions from authenticated, anon;
revoke all on public.app_portal_decision_audit_logs from authenticated, anon;

create or replace function public._apdc269_access_context()
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

create or replace function public._apdc269_decision_row(d public.app_portal_decisions)
returns jsonb
language plpgsql
stable
as $$
declare
  v_owner_name text;
begin
  select coalesce(u.full_name, 'Unassigned') into v_owner_name
  from public.users u where u.id = d.decision_owner_id;

  return jsonb_build_object(
    'id', d.id,
    'title', d.title,
    'description', left(d.description, 500),
    'category', d.category,
    'decision_owner_id', d.decision_owner_id,
    'decision_owner', coalesce(v_owner_name, 'Unassigned'),
    'contributors', d.contributors,
    'decision_date', d.decision_date,
    'status', d.status,
    'impact_level', d.impact_level,
    'expected_outcome', d.expected_outcome,
    'supporting_evidence', d.supporting_evidence,
    'related_business_packs', d.related_business_packs,
    'linked_follow_up_ids', d.linked_follow_up_ids,
    'outcome_rating', d.outcome_rating,
    'lessons_learned', d.lessons_learned,
    'unexpected_consequences', d.unexpected_consequences,
    'would_repeat', d.would_repeat,
    'evaluated_at', d.evaluated_at,
    'created_at', d.created_at,
    'updated_at', d.updated_at
  );
end;
$$;

create or replace function public._apdc269_log_event(
  p_decision_id uuid,
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
  insert into public.app_portal_decision_audit_logs (
    decision_id, company_id, event_type, description, performed_by, metadata
  ) values (
    p_decision_id, p_company_id, p_event_type, left(coalesce(p_description, ''), 500),
    p_performed_by, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.list_app_portal_decisions(
  p_category text default null,
  p_status text default null,
  p_owner_id uuid default null,
  p_impact_level text default null,
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_outcome_rating integer default null,
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
  v_suggestions jsonb := '[]'::jsonb;
  v_packs integer := 0;
  v_recent_approvals integer := 0;
begin
  v_ctx := public._apdc269_access_context();
  if coalesce(v_ctx->>'can_read', 'false') <> 'true' then
    raise exception 'Decision Center access denied';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._apdc269_decision_row(d) order by d.decision_date desc), '[]'::jsonb)
  into v_items
  from public.app_portal_decisions d
  where d.company_id = v_company_id
    and (p_category is null or d.category = p_category)
    and (p_status is null or d.status = p_status)
    and (p_owner_id is null or d.decision_owner_id = p_owner_id)
    and (p_impact_level is null or d.impact_level = p_impact_level)
    and (p_date_from is null or d.decision_date >= p_date_from)
    and (p_date_to is null or d.decision_date <= p_date_to)
    and (p_outcome_rating is null or d.outcome_rating = p_outcome_rating)
    and (
      p_search is null or trim(p_search) = ''
      or d.title ilike '%' || trim(p_search) || '%'
      or d.description ilike '%' || trim(p_search) || '%'
    );

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.tenant_id = (select c.id from public.customers c where c.company_id = v_company_id limit 1)
      and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.action_requests') is not null then
    select count(*)::int into v_recent_approvals
    from public.action_requests ar
    where ar.tenant_id = (select c.id from public.customers c where c.company_id = v_company_id limit 1)
      and ar.status = 'approved'
      and ar.updated_at > now() - interval '14 days';
  end if;

  if v_packs > 0 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-business-pack',
      'title', 'New Business Pack adopted — consider documenting the decision',
      'category', 'technology',
      'impact_level', 'moderate',
      'requires_review', true
    );
  end if;

  if v_recent_approvals > 2 then
    v_suggestions := v_suggestions || jsonb_build_object(
      'id', 'suggest-operational-change',
      'title', 'Major operational changes detected through recent approvals',
      'category', 'operational',
      'impact_level', 'high',
      'requires_review', true
    );
  end if;

  v_suggestions := v_suggestions || jsonb_build_object(
    'id', 'suggest-strategic-review',
    'title', 'Periodic strategic decision review recommended',
    'category', 'strategic',
    'impact_level', 'moderate',
    'requires_review', true
  );

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'suggestions', v_suggestions,
    'principle', 'Aipify supports human decision-making through documentation and organizational memory. Final authority always remains with people.'
  );
end;
$$;

create or replace function public.get_app_portal_decision(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_d public.app_portal_decisions;
  v_timeline jsonb;
  v_linked_follow_ups jsonb := '[]'::jsonb;
  v_related_approvals jsonb := '[]'::jsonb;
begin
  v_ctx := public._apdc269_access_context();
  select * into v_d from public.app_portal_decisions where id = p_id;
  if v_d.id is null then return jsonb_build_object('found', false); end if;
  if v_d.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Decision access denied'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', coalesce(u.full_name, 'System')
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_decision_audit_logs l
  left join public.users u on u.id = l.performed_by
  where l.decision_id = p_id;

  if to_regclass('public.app_portal_follow_ups') is not null and jsonb_array_length(v_d.linked_follow_up_ids) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('id', f.id, 'title', f.title, 'status', f.status)), '[]'::jsonb)
    into v_linked_follow_ups
    from public.app_portal_follow_ups f
    where f.id in (select jsonb_array_elements_text(v_d.linked_follow_up_ids)::uuid);
  end if;

  if to_regclass('public.action_requests') is not null then
    select coalesce(jsonb_agg(sub.order_by_created), '[]'::jsonb)
    into v_related_approvals
    from (
      select jsonb_build_object('id', ar.id, 'title', ar.action_type, 'status', ar.status) as order_by_created
      from public.action_requests ar
      where ar.tenant_id = (select c.id from public.customers c where c.company_id = v_d.company_id limit 1)
        and ar.status in ('approved', 'pending')
      order by ar.created_at desc
      limit 5
    ) sub;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'decision', public._apdc269_decision_row(v_d) || jsonb_build_object(
      'description_full', v_d.description,
      'supporting_evidence', v_d.supporting_evidence
    ),
    'timeline', v_timeline,
    'linked_follow_ups', v_linked_follow_ups,
    'related_approvals', v_related_approvals,
    'outcome_evaluation', case when v_d.status = 'evaluated' or v_d.outcome_rating is not null then jsonb_build_object(
      'outcome_rating', v_d.outcome_rating,
      'lessons_learned', v_d.lessons_learned,
      'unexpected_consequences', v_d.unexpected_consequences,
      'would_repeat', v_d.would_repeat,
      'evaluated_at', v_d.evaluated_at
    ) else null end,
    'audit_history', v_timeline
  );
end;
$$;

create or replace function public.create_app_portal_decision(
  p_title text,
  p_description text default '',
  p_category text default 'operational',
  p_decision_owner_id uuid default null,
  p_contributors jsonb default '[]'::jsonb,
  p_decision_date timestamptz default null,
  p_status text default 'proposed',
  p_impact_level text default 'moderate',
  p_expected_outcome text default '',
  p_supporting_evidence jsonb default '[]'::jsonb,
  p_related_business_packs jsonb default '[]'::jsonb,
  p_linked_follow_up_ids jsonb default '[]'::jsonb
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
  v_d public.app_portal_decisions;
begin
  v_ctx := public._apdc269_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Decision creation requires manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_decisions (
    company_id, title, description, category, decision_owner_id, contributors,
    decision_date, status, impact_level, expected_outcome, supporting_evidence,
    related_business_packs, linked_follow_up_ids, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'operational'),
    coalesce(p_decision_owner_id, v_user_id),
    coalesce(p_contributors, '[]'::jsonb),
    coalesce(p_decision_date, now()),
    coalesce(nullif(trim(p_status), ''), 'proposed'),
    coalesce(nullif(trim(p_impact_level), ''), 'moderate'),
    left(coalesce(p_expected_outcome, ''), 2000),
    coalesce(p_supporting_evidence, '[]'::jsonb),
    coalesce(p_related_business_packs, '[]'::jsonb),
    coalesce(p_linked_follow_up_ids, '[]'::jsonb),
    v_user_id
  ) returning id into v_id;

  perform public._apdc269_log_event(v_id, v_company_id, 'created', 'Decision recorded', v_user_id, jsonb_build_object('status', 'proposed'));

  select * into v_d from public.app_portal_decisions where id = v_id;
  return jsonb_build_object('created', true, 'decision', public._apdc269_decision_row(v_d));
end;
$$;

create or replace function public.update_app_portal_decision(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_status text default null,
  p_impact_level text default null,
  p_expected_outcome text default null,
  p_supporting_evidence jsonb default null,
  p_outcome_rating integer default null,
  p_lessons_learned text default null,
  p_unexpected_consequences text default null,
  p_would_repeat text default null,
  p_linked_follow_up_ids jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_d public.app_portal_decisions;
  v_user_id uuid;
  v_new_status text;
begin
  v_ctx := public._apdc269_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_d from public.app_portal_decisions where id = p_id;
  if v_d.id is null then raise exception 'Decision not found'; end if;
  if v_d.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Decision access denied'; end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then raise exception 'Decision update requires manager access'; end if;

  v_new_status := coalesce(nullif(trim(p_status), ''), v_d.status);

  update public.app_portal_decisions set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    status = v_new_status,
    impact_level = coalesce(nullif(trim(p_impact_level), ''), impact_level),
    expected_outcome = case when p_expected_outcome is not null then left(p_expected_outcome, 2000) else expected_outcome end,
    supporting_evidence = coalesce(p_supporting_evidence, supporting_evidence),
    linked_follow_up_ids = coalesce(p_linked_follow_up_ids, linked_follow_up_ids),
    outcome_rating = coalesce(p_outcome_rating, outcome_rating),
    lessons_learned = case when p_lessons_learned is not null then left(p_lessons_learned, 2000) else lessons_learned end,
    unexpected_consequences = case when p_unexpected_consequences is not null then left(p_unexpected_consequences, 2000) else unexpected_consequences end,
    would_repeat = coalesce(nullif(trim(p_would_repeat), ''), would_repeat),
    evaluated_at = case
      when p_outcome_rating is not null or p_would_repeat is not null then coalesce(evaluated_at, now())
      else evaluated_at
    end,
    updated_at = now()
  where id = p_id;

  if p_status is not null then
    perform public._apdc269_log_event(p_id, v_d.company_id, 'status_changed', format('Status updated to %s', v_new_status), v_user_id, jsonb_build_object('status', v_new_status));
  elsif p_outcome_rating is not null or p_would_repeat is not null then
    perform public._apdc269_log_event(p_id, v_d.company_id, 'evaluated', 'Outcome evaluation recorded', v_user_id, jsonb_build_object('outcome_rating', p_outcome_rating));
    update public.app_portal_decisions set status = 'evaluated' where id = p_id and status = 'implemented';
  else
    perform public._apdc269_log_event(p_id, v_d.company_id, 'updated', 'Decision updated', v_user_id, '{}'::jsonb);
  end if;

  select * into v_d from public.app_portal_decisions where id = p_id;
  return jsonb_build_object('updated', true, 'decision', public._apdc269_decision_row(v_d));
end;
$$;

grant execute on function public.list_app_portal_decisions(text, text, uuid, text, timestamptz, timestamptz, integer, text) to authenticated;
grant execute on function public.get_app_portal_decision(uuid) to authenticated;
grant execute on function public.create_app_portal_decision(text, text, text, uuid, jsonb, timestamptz, text, text, text, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.update_app_portal_decision(uuid, text, text, text, text, text, text, jsonb, integer, text, text, text, jsonb) to authenticated;

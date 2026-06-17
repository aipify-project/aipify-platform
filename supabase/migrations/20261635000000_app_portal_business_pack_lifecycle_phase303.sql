-- Phase 303 (APP) — Business Pack Lifecycle Management Center

create table if not exists public.app_portal_business_pack_lifecycle_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_lifecycle_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  lifecycle_stage text not null default 'active' check (lifecycle_stage in (
    'planned', 'evaluating', 'implementing', 'active', 'optimizing', 'mature',
    'under_review', 'retiring', 'retired'
  )),
  installed_at timestamptz,
  last_activity_at timestamptz,
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  users_assigned integer not null default 0,
  review_frequency text not null default 'quarterly' check (review_frequency in ('quarterly', 'annual', 'on_demand')),
  review_owner text not null default '',
  responsible_department text not null default '',
  related_packs jsonb not null default '[]'::jsonb,
  lifecycle_notes text not null default '',
  next_review_at date,
  review_status text not null default 'scheduled' check (review_status in (
    'scheduled', 'in_progress', 'completed', 'overdue'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_lifecycle_records_company_idx
  on public.app_portal_business_pack_lifecycle_records (company_id, lifecycle_stage, review_status, next_review_at);

create table if not exists public.app_portal_business_pack_lifecycle_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  review_type text not null default 'quarterly' check (review_type in ('quarterly', 'annual', 'on_demand')),
  status text not null default 'completed' check (status in ('scheduled', 'in_progress', 'completed')),
  review_owner text not null default '',
  answers jsonb not null default '{}'::jsonb,
  notes text not null default '',
  completed_by uuid references public.users (id) on delete set null,
  completed_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_lifecycle_reviews_company_idx
  on public.app_portal_business_pack_lifecycle_reviews (company_id, pack_key, completed_at desc);

create table if not exists public.app_portal_business_pack_lifecycle_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_lifecycle_timeline_idx
  on public.app_portal_business_pack_lifecycle_timeline (company_id, pack_key, created_at desc);

create table if not exists public.app_portal_business_pack_lifecycle_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_lifecycle_audit_idx
  on public.app_portal_business_pack_lifecycle_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_lifecycle_state enable row level security;
alter table public.app_portal_business_pack_lifecycle_records enable row level security;
alter table public.app_portal_business_pack_lifecycle_reviews enable row level security;
alter table public.app_portal_business_pack_lifecycle_timeline enable row level security;
alter table public.app_portal_business_pack_lifecycle_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_lifecycle_state from authenticated, anon;
revoke all on public.app_portal_business_pack_lifecycle_records from authenticated, anon;
revoke all on public.app_portal_business_pack_lifecycle_reviews from authenticated, anon;
revoke all on public.app_portal_business_pack_lifecycle_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_lifecycle_audit_logs from authenticated, anon;

create or replace function public._abplm303_access_context()
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
  v_member_enabled boolean := true;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';

  select coalesce(ls.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_lifecycle_state ls
  where ls.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Lifecycle Center access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abplm303_infer_stage(p_adoption integer, p_status text default null)
returns text
language sql
immutable
as $$
  select case
    when p_status in ('retired', 'retiring', 'under_review', 'planned', 'evaluating', 'implementing') then p_status
    when p_adoption >= 85 then 'mature'
    when p_adoption >= 70 then 'optimizing'
    when p_adoption >= 45 then 'active'
    when p_adoption >= 20 then 'implementing'
    else 'under_review'
  end;
$$;

create or replace function public._abplm303_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption record;
begin
  insert into public.app_portal_business_pack_lifecycle_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status, tm.activated_at, tm.updated_at
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta', 'deprecated')
    loop
      insert into public.app_portal_business_pack_lifecycle_records (
        company_id, pack_key, pack_name, lifecycle_stage, installed_at, last_activity_at,
        adoption_score, users_assigned, next_review_at, review_status
      ) values (
        p_company_id,
        v_pack.module_key,
        initcap(replace(v_pack.module_key, '_', ' ')),
        case when v_pack.status = 'deprecated' then 'retiring' else 'active' end,
        coalesce(v_pack.activated_at, now()),
        coalesce(v_pack.updated_at, now()),
        0, 0,
        (current_date + interval '90 days')::date,
        'scheduled'
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        last_activity_at = coalesce(public.app_portal_business_pack_lifecycle_records.last_activity_at, excluded.last_activity_at),
        updated_at = now();
    end loop;
  end if;

  if to_regclass('public.app_portal_business_pack_adoption') is not null then
    for v_adoption in
      select a.* from public.app_portal_business_pack_adoption a where a.company_id = p_company_id
    loop
      update public.app_portal_business_pack_lifecycle_records lr set
        adoption_score = v_adoption.adoption_score,
        users_assigned = v_adoption.users_assigned,
        last_activity_at = coalesce(v_adoption.last_activity_at, lr.last_activity_at),
        lifecycle_stage = case
          when lr.lifecycle_stage in ('retired', 'retiring', 'planned', 'evaluating') then lr.lifecycle_stage
          else public._abplm303_infer_stage(v_adoption.adoption_score, lr.lifecycle_stage)
        end,
        review_status = case
          when v_adoption.adoption_score < 30 and lr.next_review_at <= current_date then 'overdue'
          when lr.next_review_at <= current_date then 'overdue'
          else lr.review_status
        end,
        updated_at = now()
      where lr.company_id = p_company_id and lr.pack_key = v_adoption.pack_key;
    end loop;
  end if;
end;
$$;

create or replace function public._abplm303_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_pack record;
begin
  for v_pack in
    select lr.* from public.app_portal_business_pack_lifecycle_records lr where lr.company_id = p_company_id
  loop
    if v_pack.lifecycle_stage = 'optimizing' then
      v_recs := v_recs || jsonb_build_object('id', 'opt-' || v_pack.pack_key, 'key', 'scheduleOptimizationReview', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.adoption_score >= 70 and v_pack.users_assigned < 5 then
      v_recs := v_recs || jsonb_build_object('id', 'expand-' || v_pack.pack_key, 'key', 'expandUsageTeams', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.adoption_score < 40 then
      v_recs := v_recs || jsonb_build_object('id', 'train-' || v_pack.pack_key, 'key', 'completeTrainingInitiatives', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.lifecycle_stage in ('under_review', 'retiring') then
      v_recs := v_recs || jsonb_build_object('id', 'retire-' || v_pack.pack_key, 'key', 'reassessRetirementCandidates', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.adoption_score < 25 then
      v_recs := v_recs || jsonb_build_object('id', 'under-' || v_pack.pack_key, 'key', 'reviewUnderutilizedCapabilities', 'pack_key', v_pack.pack_key);
    end if;
    if v_pack.lifecycle_stage = 'mature' then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || v_pack.pack_key, 'key', 'celebrateMatureImplementations', 'pack_key', v_pack.pack_key);
    end if;
  end loop;
  return v_recs;
end;
$$;

create or replace function public._abplm303_pack_card(p_company_id uuid, p_pack record)
returns jsonb
language plpgsql
stable
as $$
declare
  v_timeline jsonb;
  v_milestones jsonb := '[]'::jsonb;
begin
  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_timeline
  from (
    select jsonb_build_object(
      'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_lifecycle_timeline t
    where t.company_id = p_company_id and t.pack_key = p_pack.pack_key
    order by t.created_at desc
    limit 12
  ) sub;

  if to_regclass('public.app_portal_business_pack_milestones') is not null then
    select coalesce(jsonb_agg(row order by row->>'achieved_at' desc), '[]'::jsonb)
    into v_milestones
    from (
      select jsonb_build_object('key', m.milestone_key, 'achieved_at', m.achieved_at) as row
      from public.app_portal_business_pack_milestones m
      where m.company_id = p_company_id and m.pack_key = p_pack.pack_key
      order by m.achieved_at desc
      limit 5
    ) sub;
  end if;

  return jsonb_build_object(
    'id', p_pack.pack_key,
    'pack_key', p_pack.pack_key,
    'name', p_pack.pack_name,
    'lifecycle_stage', p_pack.lifecycle_stage,
    'installed_at', p_pack.installed_at,
    'last_activity_at', p_pack.last_activity_at,
    'adoption_score', p_pack.adoption_score,
    'users_assigned', p_pack.users_assigned,
    'review_frequency', p_pack.review_frequency,
    'review_owner', p_pack.review_owner,
    'responsible_department', p_pack.responsible_department,
    'related_packs', p_pack.related_packs,
    'next_review_at', p_pack.next_review_at,
    'review_status', p_pack.review_status,
    'lifecycle_notes', p_pack.lifecycle_notes,
    'upcoming_milestones', v_milestones,
    'timeline', v_timeline
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_lifecycle(
  p_lifecycle_stage text default null,
  p_review_owner text default null,
  p_department text default null,
  p_adoption_status text default null,
  p_review_status text default null,
  p_period_from date default null,
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
  v_user_id uuid;
  v_packs jsonb := '[]'::jsonb;
  v_distribution jsonb := '{}'::jsonb;
  v_requiring_review integer := 0;
  v_recently_activated jsonb := '[]'::jsonb;
  v_recently_retired jsonb := '[]'::jsonb;
  v_upcoming jsonb := '[]'::jsonb;
  v_pack record;
  v_count integer := 0;
begin
  v_ctx := public._abplm303_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abplm303_sync_records(v_company_id, v_user_id);

  for v_pack in
    select lr.* from public.app_portal_business_pack_lifecycle_records lr
    where lr.company_id = v_company_id
      and (p_lifecycle_stage is null or lr.lifecycle_stage = p_lifecycle_stage)
      and (p_review_owner is null or trim(p_review_owner) = '' or lr.review_owner ilike '%' || trim(p_review_owner) || '%')
      and (p_department is null or trim(p_department) = '' or lr.responsible_department ilike '%' || trim(p_department) || '%')
      and (p_review_status is null or lr.review_status = p_review_status)
      and (p_adoption_status is null or (
        (p_adoption_status = 'low' and lr.adoption_score < 40) or
        (p_adoption_status = 'healthy' and lr.adoption_score >= 40 and lr.adoption_score < 75) or
        (p_adoption_status = 'high' and lr.adoption_score >= 75)
      ))
      and (p_period_from is null or lr.installed_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or lr.pack_name ilike '%' || trim(p_search) || '%' or lr.pack_key ilike '%' || trim(p_search) || '%')
    order by lr.adoption_score desc
  loop
    v_packs := v_packs || public._abplm303_pack_card(v_company_id, v_pack);
    v_count := v_count + 1;
    v_distribution := v_distribution || jsonb_build_object(v_pack.lifecycle_stage, coalesce((v_distribution->>v_pack.lifecycle_stage)::int, 0) + 1);
    if v_pack.review_status in ('overdue', 'scheduled') and v_pack.next_review_at <= current_date + 30 then
      v_requiring_review := v_requiring_review + 1;
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', lr.pack_key, 'name', lr.pack_name, 'installed_at', lr.installed_at)), '[]'::jsonb)
  into v_recently_activated
  from (
    select lr.* from public.app_portal_business_pack_lifecycle_records lr
    where lr.company_id = v_company_id and lr.lifecycle_stage not in ('retired', 'planned')
    order by lr.installed_at desc nulls last limit 5
  ) lr;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', lr.pack_key, 'name', lr.pack_name)), '[]'::jsonb)
  into v_recently_retired
  from (
    select lr.* from public.app_portal_business_pack_lifecycle_records lr
    where lr.company_id = v_company_id and lr.lifecycle_stage in ('retired', 'retiring')
    order by lr.updated_at desc limit 5
  ) lr;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', lr.pack_key, 'name', lr.pack_name, 'next_review_at', lr.next_review_at, 'review_owner', lr.review_owner
  ) order by lr.next_review_at), '[]'::jsonb)
  into v_upcoming
  from public.app_portal_business_pack_lifecycle_records lr
  where lr.company_id = v_company_id and lr.next_review_at is not null and lr.next_review_at <= current_date + 60
  limit 8;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_lifecycle_data', v_count > 0,
    'total_installed', v_count,
    'lifecycle_distribution', v_distribution,
    'packs_requiring_review', v_requiring_review,
    'recently_activated', v_recently_activated,
    'recently_retired', v_recently_retired,
    'upcoming_reviews', v_upcoming,
    'packs', v_packs,
    'recommendations', public._abplm303_build_recommendations(v_company_id),
    'principle', 'Organizations remain in full control of Business Pack activation and retirement — Aipify provides visibility and advisory guidance.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_lifecycle_detail(p_pack_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_pack record;
  v_reviews jsonb;
begin
  v_ctx := public._abplm303_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abplm303_sync_records(v_company_id, v_user_id);

  select lr.* into v_pack
  from public.app_portal_business_pack_lifecycle_records lr
  where lr.company_id = v_company_id and lr.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'review_type', r.review_type, 'status', r.status,
    'review_owner', r.review_owner, 'answers', r.answers, 'notes', r.notes, 'completed_at', r.completed_at
  ) order by r.completed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_business_pack_lifecycle_reviews r
  where r.company_id = v_company_id and r.pack_key = p_pack_key;

  return public._abplm303_pack_card(v_company_id, v_pack) || jsonb_build_object(
    'found', true,
    'governance', jsonb_build_object(
      'review_owner', v_pack.review_owner,
      'responsible_department', v_pack.responsible_department,
      'review_history', v_reviews,
      'lifecycle_notes', v_pack.lifecycle_notes,
      'decision_history', v_reviews
    ),
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abplm303_build_recommendations(v_company_id)) r
        where r->>'pack_key' = p_pack_key
      ) sub
    ),
    'can_update', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_manage', 'false') = 'true'
  );
end;
$$;

create or replace function public.complete_app_portal_business_pack_lifecycle_review(
  p_pack_key text,
  p_review_type text default 'on_demand',
  p_review_owner text default null,
  p_answers jsonb default '{}'::jsonb,
  p_notes text default null
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
  v_next date;
begin
  v_ctx := public._abplm303_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Lifecycle reviews require manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_next := case p_review_type
    when 'annual' then (current_date + interval '365 days')::date
    when 'quarterly' then (current_date + interval '90 days')::date
    else (current_date + interval '90 days')::date
  end;

  insert into public.app_portal_business_pack_lifecycle_reviews (
    company_id, pack_key, review_type, status, review_owner, answers, notes, completed_by
  ) values (
    v_company_id, p_pack_key, coalesce(p_review_type, 'on_demand'), 'completed',
    coalesce(nullif(trim(p_review_owner), ''), 'Unassigned'), coalesce(p_answers, '{}'::jsonb),
    coalesce(p_notes, ''), v_user_id
  );

  update public.app_portal_business_pack_lifecycle_records set
    review_status = 'completed',
    next_review_at = v_next,
    review_owner = coalesce(nullif(trim(p_review_owner), ''), review_owner),
    updated_at = now()
  where company_id = v_company_id and pack_key = p_pack_key;

  insert into public.app_portal_business_pack_lifecycle_timeline (company_id, pack_key, event_type, description, performed_by)
  values (v_company_id, p_pack_key, 'review_conducted', 'Lifecycle review completed', v_user_id);

  insert into public.app_portal_business_pack_lifecycle_audit_logs (company_id, pack_key, event_type, description, performed_by)
  values (v_company_id, p_pack_key, 'review_completed', 'Business Pack lifecycle review completed', v_user_id);

  return public.get_app_portal_business_pack_lifecycle_detail(p_pack_key);
end;
$$;

create or replace function public.update_app_portal_business_pack_lifecycle(
  p_pack_key text,
  p_lifecycle_stage text default null,
  p_review_owner text default null,
  p_responsible_department text default null,
  p_review_frequency text default null,
  p_lifecycle_notes text default null,
  p_next_review_at date default null
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
begin
  v_ctx := public._abplm303_access_context();
  if coalesce(v_ctx->>'can_full', 'false') <> 'true' then
    raise exception 'Lifecycle updates require owner or administrator access';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  update public.app_portal_business_pack_lifecycle_records set
    lifecycle_stage = coalesce(p_lifecycle_stage, lifecycle_stage),
    review_owner = coalesce(nullif(trim(p_review_owner), ''), review_owner),
    responsible_department = coalesce(nullif(trim(p_responsible_department), ''), responsible_department),
    review_frequency = coalesce(p_review_frequency, review_frequency),
    lifecycle_notes = coalesce(p_lifecycle_notes, lifecycle_notes),
    next_review_at = coalesce(p_next_review_at, next_review_at),
    updated_at = now()
  where company_id = v_company_id and pack_key = p_pack_key;

  if p_lifecycle_stage in ('retiring', 'retired') then
    insert into public.app_portal_business_pack_lifecycle_timeline (company_id, pack_key, event_type, description, performed_by)
    values (v_company_id, p_pack_key, 'retirement_initiated', 'Retirement lifecycle stage updated', v_user_id);
  elsif p_lifecycle_stage is not null then
    insert into public.app_portal_business_pack_lifecycle_timeline (company_id, pack_key, event_type, description, performed_by)
    values (v_company_id, p_pack_key, 'stage_updated', 'Lifecycle stage updated to ' || p_lifecycle_stage, v_user_id);
  end if;

  insert into public.app_portal_business_pack_lifecycle_audit_logs (company_id, pack_key, event_type, description, performed_by, metadata)
  values (v_company_id, p_pack_key, 'lifecycle_updated', 'Business Pack lifecycle record updated', v_user_id,
    jsonb_build_object('lifecycle_stage', p_lifecycle_stage, 'review_owner', p_review_owner));

  return public.get_app_portal_business_pack_lifecycle_detail(p_pack_key);
end;
$$;

grant execute on function public.list_app_portal_business_pack_lifecycle(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_lifecycle_detail(text) to authenticated;
grant execute on function public.complete_app_portal_business_pack_lifecycle_review(text, text, text, jsonb, text) to authenticated;
grant execute on function public.update_app_portal_business_pack_lifecycle(text, text, text, text, text, text, date) to authenticated;

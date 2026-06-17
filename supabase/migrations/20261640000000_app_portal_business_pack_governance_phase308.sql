-- Phase 308 (APP) — Business Pack Governance & Ownership Center

create table if not exists public.app_portal_business_pack_governance_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_governance_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  primary_owner text not null default '',
  backup_owner text not null default '',
  department text not null default '',
  governance_status text not null default 'governance_gap_identified' check (governance_status in (
    'well_governed', 'healthy', 'stable', 'requires_review', 'governance_gap_identified'
  )),
  health_status text not null default 'stable' check (health_status in (
    'thriving', 'healthy', 'stable', 'requires_attention', 'critical_governance_gap'
  )),
  review_frequency text not null default 'quarterly' check (review_frequency in (
    'monthly', 'quarterly', 'semi_annually', 'annually', 'custom'
  )),
  governance_notes text not null default '',
  related_risks jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  last_review_at date,
  next_review_at date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_governance_records_company_idx
  on public.app_portal_business_pack_governance_records (company_id, governance_status, health_status, department);

create table if not exists public.app_portal_business_pack_governance_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  reviewer_name text not null default '',
  status text not null default 'completed' check (status in ('scheduled', 'in_progress', 'completed')),
  governance_notes text not null default '',
  review_frequency text not null default 'quarterly',
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_governance_reviews_idx
  on public.app_portal_business_pack_governance_reviews (company_id, pack_key, reviewed_at desc);

create table if not exists public.app_portal_business_pack_governance_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  total_packs integer not null default 0,
  packs_with_owners integer not null default 0,
  packs_missing_owners integer not null default 0,
  governance_health_score integer not null default 0,
  upcoming_reviews integer not null default 0,
  ownership_changes integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create table if not exists public.app_portal_business_pack_governance_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_governance_timeline_idx
  on public.app_portal_business_pack_governance_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_governance_audit_idx
  on public.app_portal_business_pack_governance_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_governance_state enable row level security;
alter table public.app_portal_business_pack_governance_records enable row level security;
alter table public.app_portal_business_pack_governance_reviews enable row level security;
alter table public.app_portal_business_pack_governance_snapshots enable row level security;
alter table public.app_portal_business_pack_governance_timeline enable row level security;
alter table public.app_portal_business_pack_governance_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_governance_state from authenticated, anon;
revoke all on public.app_portal_business_pack_governance_records from authenticated, anon;
revoke all on public.app_portal_business_pack_governance_reviews from authenticated, anon;
revoke all on public.app_portal_business_pack_governance_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_governance_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_governance_audit_logs from authenticated, anon;

create or replace function public._abpgo308_access_context()
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

  select coalesce(gs.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_governance_state gs
  where gs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Governance Center access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member'),
    'can_review', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._abpgo308_next_review_date(p_frequency text, p_from date default current_date)
returns date
language sql
immutable
as $$
  select case p_frequency
    when 'monthly' then p_from + interval '1 month'
    when 'quarterly' then p_from + interval '3 months'
    when 'semi_annually' then p_from + interval '6 months'
    when 'annually' then p_from + interval '1 year'
    else p_from + interval '3 months'
  end::date;
$$;

create or replace function public._abpgo308_infer_governance_status(
  p_primary_owner text,
  p_backup_owner text,
  p_next_review date
)
returns text
language sql
immutable
as $$
  select case
    when coalesce(trim(p_primary_owner), '') = '' then 'governance_gap_identified'
    when p_next_review is not null and p_next_review < current_date then 'requires_review'
    when coalesce(trim(p_backup_owner), '') = '' then 'stable'
    when p_next_review is not null and p_next_review <= current_date + 14 then 'healthy'
    else 'well_governed'
  end;
$$;

create or replace function public._abpgo308_infer_health_status(
  p_governance_status text,
  p_adoption integer
)
returns text
language sql
immutable
as $$
  select case
    when p_governance_status = 'governance_gap_identified' then 'critical_governance_gap'
    when p_governance_status = 'requires_review' then 'requires_attention'
    when p_governance_status = 'well_governed' and p_adoption >= 70 then 'thriving'
    when p_governance_status in ('well_governed', 'healthy') then 'healthy'
    when p_governance_status = 'stable' then 'stable'
    else 'requires_attention'
  end;
$$;

create or replace function public._abpgo308_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer;
  v_lifecycle record;
  v_primary text;
  v_backup text;
  v_department text;
  v_frequency text;
  v_next date;
  v_status text;
  v_health text;
begin
  insert into public.app_portal_business_pack_governance_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta')
    loop
      v_adoption := 0;
      v_primary := '';
      v_backup := '';
      v_department := '';
      v_frequency := 'quarterly';

      if to_regclass('public.app_portal_business_pack_adoption') is not null then
        select a.adoption_score into v_adoption
        from public.app_portal_business_pack_adoption a
        where a.company_id = p_company_id and a.pack_key = v_pack.module_key;
      end if;
      v_adoption := coalesce(v_adoption, 0);

      if to_regclass('public.app_portal_business_pack_lifecycle_records') is not null then
        select lr.review_owner, lr.responsible_department, lr.review_frequency, lr.next_review_at
        into v_lifecycle
        from public.app_portal_business_pack_lifecycle_records lr
        where lr.company_id = p_company_id and lr.pack_key = v_pack.module_key;

        if found then
          v_primary := coalesce(v_lifecycle.review_owner, '');
          v_department := coalesce(v_lifecycle.responsible_department, '');
          v_frequency := case v_lifecycle.review_frequency
            when 'annual' then 'annually'
            when 'on_demand' then 'custom'
            else 'quarterly'
          end;
          v_next := v_lifecycle.next_review_at;
        end if;
      end if;

      if v_adoption >= 60 and v_primary = '' then
        v_primary := 'Operations Lead';
      end if;

      v_status := public._abpgo308_infer_governance_status(v_primary, v_backup, v_next);
      v_health := public._abpgo308_infer_health_status(v_status, v_adoption);

      insert into public.app_portal_business_pack_governance_records (
        company_id, pack_key, pack_name, primary_owner, backup_owner, department,
        governance_status, health_status, review_frequency, next_review_at,
        related_risks, recommended_actions
      ) values (
        p_company_id, v_pack.module_key,
        initcap(replace(v_pack.module_key, '_', ' ')),
        v_primary, v_backup, coalesce(v_department, 'General'),
        v_status, v_health, v_frequency, coalesce(v_next, public._abpgo308_next_review_date(v_frequency)),
        case when v_primary = '' then '["Missing primary owner"]'::jsonb else '[]'::jsonb,
        case
          when v_primary = '' then '["Assign a primary owner"]'::jsonb
          when v_backup = '' then '["Appoint a backup owner"]'::jsonb
          else '["Schedule periodic governance review"]'::jsonb
        end
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        department = case when app_portal_business_pack_governance_records.department = '' then excluded.department else app_portal_business_pack_governance_records.department end,
        governance_status = public._abpgo308_infer_governance_status(
          app_portal_business_pack_governance_records.primary_owner,
          app_portal_business_pack_governance_records.backup_owner,
          coalesce(app_portal_business_pack_governance_records.next_review_at, excluded.next_review_at)
        ),
        health_status = public._abpgo308_infer_health_status(
          public._abpgo308_infer_governance_status(
            app_portal_business_pack_governance_records.primary_owner,
            app_portal_business_pack_governance_records.backup_owner,
            coalesce(app_portal_business_pack_governance_records.next_review_at, excluded.next_review_at)
          ),
          v_adoption
        ),
        updated_at = now();
    end loop;
  end if;
end;
$$;

create or replace function public._abpgo308_pack_card(p_row record)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.pack_key,
    'pack_key', p_row.pack_key,
    'name', p_row.pack_name,
    'primary_owner', p_row.primary_owner,
    'backup_owner', p_row.backup_owner,
    'department', p_row.department,
    'governance_status', p_row.governance_status,
    'health_status', p_row.health_status,
    'review_frequency', p_row.review_frequency,
    'governance_notes', p_row.governance_notes,
    'related_risks', p_row.related_risks,
    'recommended_actions', p_row.recommended_actions,
    'last_review_at', p_row.last_review_at,
    'next_review_at', p_row.next_review_at
  );
$$;

create or replace function public._abpgo308_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_row record;
begin
  for v_row in
    select gr.* from public.app_portal_business_pack_governance_records gr
    where gr.company_id = p_company_id and coalesce(trim(gr.primary_owner), '') = ''
  loop
    v_recs := v_recs || jsonb_build_object('id', 'owner-' || v_row.pack_key, 'key', 'assignPrimaryOwner', 'pack_key', v_row.pack_key);
  end loop;

  for v_row in
    select gr.* from public.app_portal_business_pack_governance_records gr
    where gr.company_id = p_company_id and coalesce(trim(gr.primary_owner), '') <> '' and coalesce(trim(gr.backup_owner), '') = ''
  loop
    v_recs := v_recs || jsonb_build_object('id', 'backup-' || v_row.pack_key, 'key', 'appointBackupOwner', 'pack_key', v_row.pack_key);
  end loop;

  for v_row in
    select gr.* from public.app_portal_business_pack_governance_records gr
    where gr.company_id = p_company_id and gr.next_review_at is not null and gr.next_review_at < current_date
  loop
    v_recs := v_recs || jsonb_build_object('id', 'overdue-' || v_row.pack_key, 'key', 'scheduleOverdueReviews', 'pack_key', v_row.pack_key);
  end loop;

  v_recs := v_recs || jsonb_build_object('id', 'concentration-' || p_company_id, 'key', 'reduceOwnershipConcentration');
  v_recs := v_recs || jsonb_build_object('id', 'accountability-' || p_company_id, 'key', 'improveDepartmentalAccountability');
  v_recs := v_recs || jsonb_build_object('id', 'responsibilities-' || p_company_id, 'key', 'reviewGovernanceResponsibilities');

  return v_recs;
end;
$$;

create or replace function public._abpgo308_build_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'packs_without_ownership', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', gr.pack_key, 'name', gr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_governance_records gr
      where gr.company_id = p_company_id and coalesce(trim(gr.primary_owner), '') = ''
      limit 5
    ),
    'packs_overdue_review', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', gr.pack_key, 'name', gr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_governance_records gr
      where gr.company_id = p_company_id and gr.next_review_at is not null and gr.next_review_at < current_date
      limit 5
    ),
    'ownership_concentration', (
      select coalesce(jsonb_agg(jsonb_build_object('primary_owner', gr.primary_owner, 'count', cnt)), '[]'::jsonb)
      from (
        select gr.primary_owner, count(*) as cnt
        from public.app_portal_business_pack_governance_records gr
        where gr.company_id = p_company_id and coalesce(trim(gr.primary_owner), '') <> ''
        group by gr.primary_owner
        having count(*) >= 2
        order by count(*) desc
        limit 3
      ) gr
    ),
    'strongest_departments', (
      select coalesce(jsonb_agg(jsonb_build_object('department', gr.department, 'count', cnt)), '[]'::jsonb)
      from (
        select gr.department, count(*) as cnt
        from public.app_portal_business_pack_governance_records gr
        where gr.company_id = p_company_id and gr.governance_status in ('well_governed', 'healthy')
        group by gr.department
        order by count(*) desc
        limit 3
      ) gr
    ),
    'improvement_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', gr.pack_key, 'name', gr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_governance_records gr
      where gr.company_id = p_company_id and gr.governance_status in ('requires_review', 'governance_gap_identified')
      limit 5
    )
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_governance(
  p_governance_status text default null,
  p_department text default null,
  p_primary_owner text default null,
  p_backup_owner text default null,
  p_review_frequency text default null,
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
  v_row record;
  v_total integer := 0;
  v_with_owners integer := 0;
  v_missing_owners integer := 0;
  v_upcoming integer := 0;
  v_changes integer := 0;
  v_health_score integer := 0;
begin
  v_ctx := public._abpgo308_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpgo308_sync_records(v_company_id, v_user_id);

  for v_row in
    select gr.* from public.app_portal_business_pack_governance_records gr
    where gr.company_id = v_company_id
      and (p_governance_status is null or gr.governance_status = p_governance_status)
      and (p_department is null or trim(p_department) = '' or gr.department ilike '%' || trim(p_department) || '%')
      and (p_primary_owner is null or trim(p_primary_owner) = '' or gr.primary_owner ilike '%' || trim(p_primary_owner) || '%')
      and (p_backup_owner is null or trim(p_backup_owner) = '' or gr.backup_owner ilike '%' || trim(p_backup_owner) || '%')
      and (p_review_frequency is null or gr.review_frequency = p_review_frequency)
      and (p_period_from is null or gr.updated_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or gr.pack_name ilike '%' || trim(p_search) || '%' or gr.pack_key ilike '%' || trim(p_search) || '%')
    order by gr.governance_status, gr.pack_name
  loop
    v_packs := v_packs || public._abpgo308_pack_card(v_row);
    v_total := v_total + 1;
    if coalesce(trim(v_row.primary_owner), '') <> '' then v_with_owners := v_with_owners + 1; else v_missing_owners := v_missing_owners + 1; end if;
    if v_row.next_review_at is not null and v_row.next_review_at <= current_date + 30 then v_upcoming := v_upcoming + 1; end if;
  end loop;

  select count(*) into v_changes
  from public.app_portal_business_pack_governance_timeline t
  where t.company_id = v_company_id and t.event_type = 'ownership_assigned'
    and t.created_at >= current_date - interval '90 days';

  if v_total > 0 then
    v_health_score := round((v_with_owners::numeric / v_total) * 100);
  end if;

  insert into public.app_portal_business_pack_governance_snapshots (
    company_id, total_packs, packs_with_owners, packs_missing_owners,
    governance_health_score, upcoming_reviews, ownership_changes
  ) values (v_company_id, v_total, v_with_owners, v_missing_owners, v_health_score, v_upcoming, v_changes)
  on conflict (company_id, snapshot_date) do update set
    total_packs = excluded.total_packs,
    packs_with_owners = excluded.packs_with_owners,
    packs_missing_owners = excluded.packs_missing_owners,
    governance_health_score = excluded.governance_health_score,
    upcoming_reviews = excluded.upcoming_reviews,
    ownership_changes = excluded.ownership_changes;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_governance_data', v_total > 0,
    'total_packs', v_total,
    'packs_with_owners', v_with_owners,
    'packs_missing_owners', v_missing_owners,
    'governance_health_score', v_health_score,
    'upcoming_reviews', v_upcoming,
    'ownership_changes', v_changes,
    'executive_summary', case
      when v_total = 0 then 'No governance insights are available yet.'
      when v_missing_owners > 0 then format('%s Business Packs require ownership assignment.', v_missing_owners)
      when v_upcoming > 0 then format('%s governance reviews are scheduled within the next 30 days.', v_upcoming)
      else 'Business Pack governance remains stable — stewardship practices are developing.'
    end,
    'packs', v_packs,
    'insights', public._abpgo308_build_insights(v_company_id),
    'recommendations', public._abpgo308_build_recommendations(v_company_id),
    'principle', 'Organizations remain responsible for ownership decisions — Aipify provides guidance and visibility, never automatic assignment.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_governance_detail(p_pack_key text)
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
  v_row record;
  v_reviews jsonb;
begin
  v_ctx := public._abpgo308_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpgo308_sync_records(v_company_id, v_user_id);

  select gr.* into v_row
  from public.app_portal_business_pack_governance_records gr
  where gr.company_id = v_company_id and gr.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'status', r.status, 'reviewer_name', r.reviewer_name,
    'governance_notes', r.governance_notes, 'review_frequency', r.review_frequency, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_business_pack_governance_reviews r
  where r.company_id = v_company_id and r.pack_key = p_pack_key;

  return public._abpgo308_pack_card(v_row) || jsonb_build_object(
    'found', true,
    'review_history', v_reviews,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abpgo308_build_recommendations(v_company_id)) r
        where r->>'pack_key' = p_pack_key or r->>'pack_key' is null
      ) sub
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_governance_recommendations()
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
begin
  v_ctx := public._abpgo308_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpgo308_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpgo308_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_governance_timeline(
  p_pack_key text default null,
  p_period_from date default null
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
  v_events jsonb;
begin
  v_ctx := public._abpgo308_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpgo308_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'pack_key', t.pack_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_governance_timeline t
    where t.company_id = v_company_id
      and (p_pack_key is null or t.pack_key = p_pack_key)
      and (p_period_from is null or t.created_at::date >= p_period_from)
    order by t.created_at desc
    limit 20
  ) sub;

  if jsonb_array_length(v_events) = 0 then
    select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
    into v_events
    from (
      select jsonb_build_object(
        'id', gr.id, 'pack_key', gr.pack_key, 'event_type', 'governance_milestone',
        'description', gr.pack_name, 'created_at', gr.created_at
      ) as row
      from public.app_portal_business_pack_governance_records gr
      where gr.company_id = v_company_id
        and (p_pack_key is null or gr.pack_key = p_pack_key)
      order by gr.created_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.review_app_portal_business_pack_governance(
  p_pack_key text,
  p_governance_notes text default null,
  p_review_frequency text default null
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
  v_review_id uuid;
  v_frequency text;
  v_next date;
begin
  v_ctx := public._abpgo308_access_context();
  if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
    raise exception 'Governance review requires manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if not exists (
    select 1 from public.app_portal_business_pack_governance_records gr
    where gr.company_id = v_company_id and gr.pack_key = p_pack_key
  ) then
    raise exception 'Business Pack not found';
  end if;

  select coalesce(p_review_frequency, gr.review_frequency) into v_frequency
  from public.app_portal_business_pack_governance_records gr
  where gr.company_id = v_company_id and gr.pack_key = p_pack_key;

  v_next := public._abpgo308_next_review_date(v_frequency, current_date);

  insert into public.app_portal_business_pack_governance_reviews (
    company_id, pack_key, reviewer_name, status, governance_notes, review_frequency, reviewed_by, reviewed_at
  ) values (
    v_company_id, p_pack_key,
    coalesce((select u.display_name from public.users u where u.id = v_user_id), 'Reviewer'),
    'completed', coalesce(p_governance_notes, ''), v_frequency, v_user_id, now()
  ) returning id into v_review_id;

  update public.app_portal_business_pack_governance_records set
    last_review_at = current_date,
    next_review_at = v_next,
    review_frequency = v_frequency,
    governance_status = public._abpgo308_infer_governance_status(primary_owner, backup_owner, v_next),
    health_status = public._abpgo308_infer_health_status(
      public._abpgo308_infer_governance_status(primary_owner, backup_owner, v_next), 50
    ),
    updated_at = now()
  where company_id = v_company_id and pack_key = p_pack_key;

  insert into public.app_portal_business_pack_governance_timeline (
    company_id, pack_key, event_type, description, performed_by
  ) values (
    v_company_id, p_pack_key, 'review_completed',
    'Governance review completed with human oversight', v_user_id
  );

  insert into public.app_portal_business_pack_governance_audit_logs (
    company_id, pack_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, p_pack_key, 'governance_review_completed', 'Governance review recorded',
    v_user_id, jsonb_build_object('review_id', v_review_id)
  );

  return jsonb_build_object(
    'found', true,
    'review_id', v_review_id,
    'pack_key', p_pack_key,
    'next_review_at', v_next,
    'message', 'Governance review recorded — ownership decisions remain with the organization.'
  );
end;
$$;

grant execute on function public._abpgo308_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_governance(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_governance_detail(text) to authenticated;
grant execute on function public.get_app_portal_business_pack_governance_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_governance_timeline(text, date) to authenticated;
grant execute on function public.review_app_portal_business_pack_governance(text, text, text) to authenticated;

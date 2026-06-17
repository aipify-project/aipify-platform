-- Phase 309 (APP) — Business Pack Compliance & Policy Center

create table if not exists public.app_portal_business_pack_compliance_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_compliance_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  compliance_status text not null default 'requires_review' check (compliance_status in (
    'aligned', 'healthy', 'requires_review', 'review_overdue', 'immediate_attention'
  )),
  assigned_reviewer text not null default '',
  review_frequency text not null default 'quarterly' check (review_frequency in (
    'monthly', 'quarterly', 'semi_annually', 'annually', 'custom'
  )),
  priority_level text not null default 'moderate' check (priority_level in (
    'low', 'moderate', 'high', 'critical'
  )),
  governance_notes text not null default '',
  policies_linked jsonb not null default '[]'::jsonb,
  open_recommendations jsonb not null default '[]'::jsonb,
  policy_alignment jsonb not null default '{}'::jsonb,
  last_review_at date,
  next_review_at date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_compliance_records_company_idx
  on public.app_portal_business_pack_compliance_records (company_id, compliance_status, priority_level);

create table if not exists public.app_portal_business_pack_compliance_policies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  policy_key text not null,
  policy_name text not null default '',
  category text not null default 'internal_governance' check (category in (
    'information_security', 'data_governance', 'access_management', 'operational_procedures',
    'customer_policies', 'vendor_management', 'internal_governance', 'business_continuity', 'custom'
  )),
  alignment_status text not null default 'requires_review' check (alignment_status in (
    'reviewed', 'acknowledged', 'requires_review', 'pending_approval', 'requires_update'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key, policy_key)
);

create index if not exists app_portal_business_pack_compliance_policies_idx
  on public.app_portal_business_pack_compliance_policies (company_id, pack_key, category);

create table if not exists public.app_portal_business_pack_compliance_reviews (
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

create index if not exists app_portal_business_pack_compliance_reviews_idx
  on public.app_portal_business_pack_compliance_reviews (company_id, pack_key, reviewed_at desc);

create table if not exists public.app_portal_business_pack_compliance_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  compliance_health_score integer not null default 0,
  packs_under_review integer not null default 0,
  packs_missing_reviews integer not null default 0,
  upcoming_reviews integer not null default 0,
  recently_completed integer not null default 0,
  open_recommendations integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create table if not exists public.app_portal_business_pack_compliance_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_compliance_timeline_idx
  on public.app_portal_business_pack_compliance_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_compliance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_compliance_audit_idx
  on public.app_portal_business_pack_compliance_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_compliance_state enable row level security;
alter table public.app_portal_business_pack_compliance_records enable row level security;
alter table public.app_portal_business_pack_compliance_policies enable row level security;
alter table public.app_portal_business_pack_compliance_reviews enable row level security;
alter table public.app_portal_business_pack_compliance_snapshots enable row level security;
alter table public.app_portal_business_pack_compliance_timeline enable row level security;
alter table public.app_portal_business_pack_compliance_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_compliance_state from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_records from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_policies from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_reviews from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_compliance_audit_logs from authenticated, anon;

create or replace function public._abpco309_access_context()
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

  select coalesce(cs.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_compliance_state cs
  where cs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Compliance Center access requires organization authorization';
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

create or replace function public._abpco309_next_review_date(p_frequency text, p_from date default current_date)
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

create or replace function public._abpco309_infer_compliance_status(
  p_reviewer text,
  p_next_review date,
  p_open_recs integer
)
returns text
language sql
immutable
as $$
  select case
    when p_open_recs >= 3 then 'immediate_attention'
    when p_next_review is not null and p_next_review < current_date then 'review_overdue'
    when coalesce(trim(p_reviewer), '') = '' then 'requires_review'
    when p_next_review is not null and p_next_review <= current_date + 14 then 'requires_review'
    when p_next_review is not null and p_next_review <= current_date + 30 then 'healthy'
    else 'aligned'
  end;
$$;

create or replace function public._abpco309_default_policies(p_pack_key text)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', p_pack_key || '-info-sec', 'name', 'Information Security', 'category', 'information_security'),
    jsonb_build_object('key', p_pack_key || '-data-gov', 'name', 'Data Governance', 'category', 'data_governance'),
    jsonb_build_object('key', p_pack_key || '-access', 'name', 'Access Management', 'category', 'access_management'),
    jsonb_build_object('key', p_pack_key || '-internal-gov', 'name', 'Internal Governance', 'category', 'internal_governance')
  );
$$;

create or replace function public._abpco309_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer;
  v_reviewer text;
  v_next date;
  v_frequency text;
  v_status text;
  v_policy jsonb;
  v_alignment jsonb;
begin
  insert into public.app_portal_business_pack_compliance_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta')
    loop
      v_adoption := 0;
      v_reviewer := '';
      v_frequency := 'quarterly';
      v_next := public._abpco309_next_review_date(v_frequency);

      if to_regclass('public.app_portal_business_pack_adoption') is not null then
        select a.adoption_score into v_adoption
        from public.app_portal_business_pack_adoption a
        where a.company_id = p_company_id and a.pack_key = v_pack.module_key;
      end if;
      v_adoption := coalesce(v_adoption, 0);

      if to_regclass('public.app_portal_business_pack_governance_records') is not null then
        select gr.primary_owner, gr.next_review_at, gr.review_frequency
        into v_reviewer, v_next, v_frequency
        from public.app_portal_business_pack_governance_records gr
        where gr.company_id = p_company_id and gr.pack_key = v_pack.module_key;
      end if;

      v_status := public._abpco309_infer_compliance_status(v_reviewer, v_next, 0);

      v_alignment := jsonb_build_object(
        'policies_reviewed', case when v_adoption >= 40 then 2 else 0 end,
        'policies_acknowledged', case when v_adoption >= 60 then 2 else 0 end,
        'policies_requiring_review', case when v_adoption < 60 then 2 else 0 end,
        'policies_pending_approval', case when v_adoption < 40 then 1 else 0 end,
        'policies_requiring_updates', 0
      );

      insert into public.app_portal_business_pack_compliance_records (
        company_id, pack_key, pack_name, compliance_status, assigned_reviewer,
        review_frequency, next_review_at, policy_alignment, open_recommendations
      ) values (
        p_company_id, v_pack.module_key, initcap(replace(v_pack.module_key, '_', ' ')),
        v_status, coalesce(v_reviewer, ''), v_frequency, v_next, v_alignment,
        case when v_status in ('review_overdue', 'immediate_attention') then '["Schedule compliance review"]'::jsonb else '[]'::jsonb
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        compliance_status = public._abpco309_infer_compliance_status(
          app_portal_business_pack_compliance_records.assigned_reviewer,
          coalesce(app_portal_business_pack_compliance_records.next_review_at, excluded.next_review_at),
          jsonb_array_length(app_portal_business_pack_compliance_records.open_recommendations)
        ),
        updated_at = now();

      for v_policy in select * from jsonb_array_elements(public._abpco309_default_policies(v_pack.module_key))
      loop
        insert into public.app_portal_business_pack_compliance_policies (
          company_id, pack_key, policy_key, policy_name, category, alignment_status
        ) values (
          p_company_id, v_pack.module_key,
          v_policy->>'key', v_policy->>'name', v_policy->>'category',
          case when v_adoption >= 60 then 'acknowledged' when v_adoption >= 40 then 'reviewed' else 'requires_review' end
        )
        on conflict (company_id, pack_key, policy_key) do nothing;
      end loop;
    end loop;
  end if;
end;
$$;

create or replace function public._abpco309_compliance_card(p_row record)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.pack_key,
    'pack_key', p_row.pack_key,
    'name', p_row.pack_name,
    'compliance_status', p_row.compliance_status,
    'assigned_reviewer', p_row.assigned_reviewer,
    'review_frequency', p_row.review_frequency,
    'priority_level', p_row.priority_level,
    'governance_notes', p_row.governance_notes,
    'policies_linked', p_row.policies_linked,
    'open_recommendations', p_row.open_recommendations,
    'policy_alignment', p_row.policy_alignment,
    'last_review_at', p_row.last_review_at,
    'next_review_at', p_row.next_review_at
  );
$$;

create or replace function public._abpco309_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_row record;
begin
  for v_row in
    select cr.* from public.app_portal_business_pack_compliance_records cr
    where cr.company_id = p_company_id and cr.compliance_status = 'review_overdue'
  loop
    v_recs := v_recs || jsonb_build_object('id', 'overdue-' || v_row.pack_key, 'key', 'scheduleOverdueReviews', 'pack_key', v_row.pack_key);
  end loop;

  for v_row in
    select cr.* from public.app_portal_business_pack_compliance_records cr
    where cr.company_id = p_company_id and coalesce(trim(cr.assigned_reviewer), '') = ''
  loop
    v_recs := v_recs || jsonb_build_object('id', 'reviewer-' || v_row.pack_key, 'key', 'assignReviewers', 'pack_key', v_row.pack_key);
  end loop;

  v_recs := v_recs || jsonb_build_object('id', 'ack-' || p_company_id, 'key', 'reviewPolicyAcknowledgements');
  v_recs := v_recs || jsonb_build_object('id', 'docs-' || p_company_id, 'key', 'strengthenGovernanceDocumentation');
  v_recs := v_recs || jsonb_build_object('id', 'freq-' || p_company_id, 'key', 'improveReviewFrequency');
  v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || p_company_id, 'key', 'celebrateStrongCompliance');

  return v_recs;
end;
$$;

create or replace function public._abpco309_build_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'approaching_deadlines', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_compliance_records cr
      where cr.company_id = p_company_id and cr.next_review_at is not null and cr.next_review_at <= current_date + 30
      limit 5
    ),
    'missing_acknowledgements', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cp.pack_key, 'name', cp.policy_name)), '[]'::jsonb)
      from public.app_portal_business_pack_compliance_policies cp
      where cp.company_id = p_company_id and cp.alignment_status in ('requires_review', 'pending_approval')
      limit 5
    ),
    'governance_gaps', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_compliance_records cr
      where cr.company_id = p_company_id and cr.compliance_status in ('requires_review', 'immediate_attention')
      limit 5
    ),
    'strong_practices', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_compliance_records cr
      where cr.company_id = p_company_id and cr.compliance_status = 'aligned'
      limit 5
    ),
    'improvement_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_compliance_records cr
      where cr.company_id = p_company_id and cr.compliance_status in ('healthy', 'requires_review')
      limit 5
    )
  );
end;
$$;

create or replace function public._abpco309_aggregate_policy_alignment(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_reviewed integer := 0;
  v_acknowledged integer := 0;
  v_requires_review integer := 0;
  v_pending integer := 0;
  v_updates integer := 0;
begin
  select
    count(*) filter (where alignment_status = 'reviewed'),
    count(*) filter (where alignment_status = 'acknowledged'),
    count(*) filter (where alignment_status = 'requires_review'),
    count(*) filter (where alignment_status = 'pending_approval'),
    count(*) filter (where alignment_status = 'requires_update')
  into v_reviewed, v_acknowledged, v_requires_review, v_pending, v_updates
  from public.app_portal_business_pack_compliance_policies
  where company_id = p_company_id;

  return jsonb_build_object(
    'policies_reviewed', v_reviewed,
    'policies_acknowledged', v_acknowledged,
    'policies_requiring_review', v_requires_review,
    'policies_pending_approval', v_pending,
    'policies_requiring_updates', v_updates
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_compliance(
  p_compliance_status text default null,
  p_pack_key text default null,
  p_policy_category text default null,
  p_reviewer text default null,
  p_period_from date default null,
  p_priority_level text default null,
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
  v_under_review integer := 0;
  v_missing integer := 0;
  v_upcoming integer := 0;
  v_completed integer := 0;
  v_open_recs integer := 0;
  v_health_score integer := 0;
  v_aligned integer := 0;
  v_immediate integer := 0;
begin
  v_ctx := public._abpco309_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpco309_sync_records(v_company_id, v_user_id);

  for v_row in
    select cr.* from public.app_portal_business_pack_compliance_records cr
    where cr.company_id = v_company_id
      and (p_compliance_status is null or cr.compliance_status = p_compliance_status)
      and (p_pack_key is null or cr.pack_key = p_pack_key)
      and (p_reviewer is null or trim(p_reviewer) = '' or cr.assigned_reviewer ilike '%' || trim(p_reviewer) || '%')
      and (p_period_from is null or cr.updated_at::date >= p_period_from)
      and (p_priority_level is null or cr.priority_level = p_priority_level)
      and (p_search is null or trim(p_search) = '' or cr.pack_name ilike '%' || trim(p_search) || '%' or cr.pack_key ilike '%' || trim(p_search) || '%')
      and (p_policy_category is null or exists (
        select 1 from public.app_portal_business_pack_compliance_policies cp
        where cp.company_id = v_company_id and cp.pack_key = cr.pack_key and cp.category = p_policy_category
      ))
    order by cr.compliance_status, cr.pack_name
  loop
    v_packs := v_packs || public._abpco309_compliance_card(v_row);
    v_total := v_total + 1;
    if v_row.compliance_status in ('requires_review', 'review_overdue', 'immediate_attention') then v_under_review := v_under_review + 1; end if;
    if coalesce(trim(v_row.assigned_reviewer), '') = '' then v_missing := v_missing + 1; end if;
    if v_row.next_review_at is not null and v_row.next_review_at <= current_date + 30 then v_upcoming := v_upcoming + 1; end if;
    if v_row.compliance_status = 'aligned' then v_aligned := v_aligned + 1; end if;
    if v_row.compliance_status = 'immediate_attention' then v_immediate := v_immediate + 1; end if;
    v_open_recs := v_open_recs + jsonb_array_length(v_row.open_recommendations);
  end loop;

  select count(*) into v_completed
  from public.app_portal_business_pack_compliance_reviews r
  where r.company_id = v_company_id and r.reviewed_at >= current_date - interval '30 days';

  if v_total > 0 then
    v_health_score := round((v_aligned::numeric / v_total) * 100);
  end if;

  insert into public.app_portal_business_pack_compliance_snapshots (
    company_id, compliance_health_score, packs_under_review, packs_missing_reviews,
    upcoming_reviews, recently_completed, open_recommendations
  ) values (v_company_id, v_health_score, v_under_review, v_missing, v_upcoming, v_completed, v_open_recs)
  on conflict (company_id, snapshot_date) do update set
    compliance_health_score = excluded.compliance_health_score,
    packs_under_review = excluded.packs_under_review,
    packs_missing_reviews = excluded.packs_missing_reviews,
    upcoming_reviews = excluded.upcoming_reviews,
    recently_completed = excluded.recently_completed,
    open_recommendations = excluded.open_recommendations;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'has_compliance_data', v_total > 0,
    'compliance_health_score', v_health_score,
    'packs_under_review', v_under_review,
    'packs_missing_reviews', v_missing,
    'upcoming_compliance_reviews', v_upcoming,
    'recently_completed_reviews', v_completed,
    'open_compliance_recommendations', v_open_recs,
    'executive_summary', case
      when v_total = 0 then 'No compliance insights are available yet.'
      when v_immediate > 0 then format('%s Business Pack(s) require immediate compliance reviews.', v_immediate)
      when v_under_review > 0 then format('%s Business Pack(s) require compliance review attention.', v_under_review)
      when v_completed > 0 then 'Review completion rates continue to improve across Business Packs.'
      else 'Most Business Packs remain aligned with organizational policies.'
    end,
    'packs', v_packs,
    'policy_alignment', public._abpco309_aggregate_policy_alignment(v_company_id),
    'insights', public._abpco309_build_insights(v_company_id),
    'recommendations', public._abpco309_build_recommendations(v_company_id),
    'principle', 'Aipify provides visibility and governance support — organizations remain responsible for compliance decisions. This is not legal advice.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_compliance_detail(p_pack_key text)
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
  v_policies jsonb;
begin
  v_ctx := public._abpco309_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpco309_sync_records(v_company_id, v_user_id);

  select cr.* into v_row
  from public.app_portal_business_pack_compliance_records cr
  where cr.company_id = v_company_id and cr.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'status', r.status, 'reviewer_name', r.reviewer_name,
    'governance_notes', r.governance_notes, 'review_frequency', r.review_frequency, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb)
  into v_reviews
  from public.app_portal_business_pack_compliance_reviews r
  where r.company_id = v_company_id and r.pack_key = p_pack_key;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'policy_key', p.policy_key, 'policy_name', p.policy_name,
    'category', p.category, 'alignment_status', p.alignment_status
  ) order by p.category), '[]'::jsonb)
  into v_policies
  from public.app_portal_business_pack_compliance_policies p
  where p.company_id = v_company_id and p.pack_key = p_pack_key;

  return public._abpco309_compliance_card(v_row) || jsonb_build_object(
    'found', true,
    'review_history', v_reviews,
    'policies', v_policies,
    'can_review', coalesce(v_ctx->>'can_review', 'false') = 'true',
    'recommendations', (
      select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select r from jsonb_array_elements(public._abpco309_build_recommendations(v_company_id)) r
        where r->>'pack_key' = p_pack_key or r->>'pack_key' is null
      ) sub
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_compliance_recommendations()
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
  v_ctx := public._abpco309_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpco309_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpco309_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_compliance_timeline(
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
  v_ctx := public._abpco309_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpco309_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'pack_key', t.pack_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_compliance_timeline t
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
        'id', cr.id, 'pack_key', cr.pack_key, 'event_type', 'compliance_milestone',
        'description', cr.pack_name, 'created_at', cr.created_at
      ) as row
      from public.app_portal_business_pack_compliance_records cr
      where cr.company_id = v_company_id
        and (p_pack_key is null or cr.pack_key = p_pack_key)
      order by cr.created_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

create or replace function public.review_app_portal_business_pack_compliance(
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
  v_ctx := public._abpco309_access_context();
  if coalesce(v_ctx->>'can_review', 'false') <> 'true' then
    raise exception 'Compliance review requires manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if not exists (
    select 1 from public.app_portal_business_pack_compliance_records cr
    where cr.company_id = v_company_id and cr.pack_key = p_pack_key
  ) then
    raise exception 'Business Pack not found';
  end if;

  select coalesce(p_review_frequency, cr.review_frequency) into v_frequency
  from public.app_portal_business_pack_compliance_records cr
  where cr.company_id = v_company_id and cr.pack_key = p_pack_key;

  v_next := public._abpco309_next_review_date(v_frequency, current_date);

  insert into public.app_portal_business_pack_compliance_reviews (
    company_id, pack_key, reviewer_name, status, governance_notes, review_frequency, reviewed_by, reviewed_at
  ) values (
    v_company_id, p_pack_key,
    coalesce((select u.display_name from public.users u where u.id = v_user_id), 'Reviewer'),
    'completed', coalesce(p_governance_notes, ''), v_frequency, v_user_id, now()
  ) returning id into v_review_id;

  update public.app_portal_business_pack_compliance_records set
    last_review_at = current_date,
    next_review_at = v_next,
    review_frequency = v_frequency,
    compliance_status = 'aligned',
    open_recommendations = '[]'::jsonb,
    updated_at = now()
  where company_id = v_company_id and pack_key = p_pack_key;

  insert into public.app_portal_business_pack_compliance_timeline (
    company_id, pack_key, event_type, description, performed_by
  ) values (
    v_company_id, p_pack_key, 'review_completed',
    'Compliance review completed — organization retains compliance decision authority', v_user_id
  );

  insert into public.app_portal_business_pack_compliance_audit_logs (
    company_id, pack_key, event_type, description, performed_by, metadata
  ) values (
    v_company_id, p_pack_key, 'compliance_review_completed', 'Compliance review recorded',
    v_user_id, jsonb_build_object('review_id', v_review_id)
  );

  return jsonb_build_object(
    'found', true,
    'review_id', v_review_id,
    'pack_key', p_pack_key,
    'next_review_at', v_next,
    'message', 'Compliance review recorded — organizations remain responsible for compliance outcomes.'
  );
end;
$$;

grant execute on function public._abpco309_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_compliance(text, text, text, text, date, text, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_compliance_detail(text) to authenticated;
grant execute on function public.get_app_portal_business_pack_compliance_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_compliance_timeline(text, date) to authenticated;
grant execute on function public.review_app_portal_business_pack_compliance(text, text, text) to authenticated;

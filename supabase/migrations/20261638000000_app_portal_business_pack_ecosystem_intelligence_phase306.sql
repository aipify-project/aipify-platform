-- Phase 306 (APP) — Business Pack Ecosystem Intelligence Center

create table if not exists public.app_portal_business_pack_ecosystem_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_ecosystem_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  ecosystem_role text not null default 'operational',
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  cross_utilization_score integer not null default 0 check (cross_utilization_score between 0 and 100),
  coverage_category text not null default 'operational' check (coverage_category in (
    'operational', 'executive', 'governance', 'customer', 'knowledge', 'growth'
  )),
  coverage_status text not null default 'moderate_coverage' check (coverage_status in (
    'comprehensive', 'well_covered', 'moderate_coverage', 'limited_coverage', 'coverage_gap_identified'
  )),
  related_packs jsonb not null default '[]'::jsonb,
  installed_at timestamptz,
  last_activity_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_ecosystem_records_company_idx
  on public.app_portal_business_pack_ecosystem_records (company_id, coverage_category, coverage_status);

create table if not exists public.app_portal_business_pack_ecosystem_relationships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  source_pack_key text not null,
  target_pack_key text not null,
  relationship_label text not null default '',
  strength text not null default 'moderate' check (strength in (
    'strong', 'moderate', 'emerging', 'underutilized'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, source_pack_key, target_pack_key)
);

create index if not exists app_portal_business_pack_ecosystem_relationships_idx
  on public.app_portal_business_pack_ecosystem_relationships (company_id, strength);

create table if not exists public.app_portal_business_pack_ecosystem_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  ecosystem_status text not null default 'stable' check (ecosystem_status in (
    'thriving', 'healthy', 'stable', 'requires_optimization', 'fragmented'
  )),
  health_score integer not null default 0 check (health_score between 0 and 100),
  cross_utilization_score integer not null default 0 check (cross_utilization_score between 0 and 100),
  pack_count integer not null default 0,
  opportunity_count integer not null default 0,
  risk_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create index if not exists app_portal_business_pack_ecosystem_snapshots_idx
  on public.app_portal_business_pack_ecosystem_snapshots (company_id, snapshot_date desc);

create table if not exists public.app_portal_business_pack_ecosystem_recommendations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  recommendation_key text not null,
  priority_level text not null default 'recommended' check (priority_level in (
    'opportunity', 'recommended', 'important', 'immediate_attention'
  )),
  status text not null default 'active' check (status in ('active', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_ecosystem_recommendations_idx
  on public.app_portal_business_pack_ecosystem_recommendations (company_id, status, priority_level);

create table if not exists public.app_portal_business_pack_ecosystem_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_ecosystem_timeline_idx
  on public.app_portal_business_pack_ecosystem_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_ecosystem_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_ecosystem_audit_idx
  on public.app_portal_business_pack_ecosystem_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_ecosystem_state enable row level security;
alter table public.app_portal_business_pack_ecosystem_records enable row level security;
alter table public.app_portal_business_pack_ecosystem_relationships enable row level security;
alter table public.app_portal_business_pack_ecosystem_snapshots enable row level security;
alter table public.app_portal_business_pack_ecosystem_recommendations enable row level security;
alter table public.app_portal_business_pack_ecosystem_timeline enable row level security;
alter table public.app_portal_business_pack_ecosystem_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_ecosystem_state from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_records from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_relationships from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_recommendations from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_ecosystem_audit_logs from authenticated, anon;

create or replace function public._abpei306_access_context()
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

  select coalesce(es.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_ecosystem_state es
  where es.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Ecosystem Intelligence access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abpei306_infer_coverage_category(p_pack_key text)
returns text
language sql
immutable
as $$
  select case
    when p_pack_key ilike '%executive%' or p_pack_key ilike '%strategy%' then 'executive'
    when p_pack_key ilike '%governance%' or p_pack_key ilike '%compliance%' or p_pack_key ilike '%security%' then 'governance'
    when p_pack_key ilike '%support%' or p_pack_key ilike '%customer%' then 'customer'
    when p_pack_key ilike '%knowledge%' or p_pack_key ilike '%learning%' then 'knowledge'
    when p_pack_key ilike '%commerce%' or p_pack_key ilike '%growth%' or p_pack_key ilike '%sales%' then 'growth'
    else 'operational'
  end;
$$;

create or replace function public._abpei306_infer_coverage_status(p_adoption integer, p_cross integer)
returns text
language sql
immutable
as $$
  select case
    when p_adoption >= 80 and p_cross >= 70 then 'comprehensive'
    when p_adoption >= 65 then 'well_covered'
    when p_adoption >= 40 then 'moderate_coverage'
    when p_adoption >= 20 then 'limited_coverage'
    else 'coverage_gap_identified'
  end;
$$;

create or replace function public._abpei306_infer_ecosystem_status(p_health integer, p_gaps integer, p_pack_count integer)
returns text
language sql
immutable
as $$
  select case
    when p_pack_count = 0 then 'stable'
    when p_gaps >= greatest(1, p_pack_count / 2) then 'fragmented'
    when p_health >= 80 then 'thriving'
    when p_health >= 65 then 'healthy'
    when p_health >= 45 then 'stable'
    else 'requires_optimization'
  end;
$$;

create or replace function public._abpei306_relationship_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('source', 'hosts', 'target', 'operations', 'label', 'Hosts ↔ Operations'),
    jsonb_build_object('source', 'operations', 'target', 'executive', 'label', 'Operations ↔ Executive Intelligence'),
    jsonb_build_object('source', 'support', 'target', 'knowledge', 'label', 'Support ↔ Knowledge Center'),
    jsonb_build_object('source', 'governance', 'target', 'security', 'label', 'Governance ↔ Security'),
    jsonb_build_object('source', 'commerce', 'target', 'analytics', 'label', 'Commerce ↔ Analytics')
  );
$$;

create or replace function public._abpei306_match_pack(p_pack_key text, p_pattern text)
returns boolean
language sql
immutable
as $$
  select p_pack_key ilike '%' || p_pattern || '%';
$$;

create or replace function public._abpei306_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer;
  v_cross integer;
  v_rel jsonb;
  v_source text;
  v_target text;
  v_label text;
  v_strength text;
  v_source_key text;
  v_target_key text;
begin
  insert into public.app_portal_business_pack_ecosystem_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status, tm.activated_at, tm.updated_at
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta')
    loop
      insert into public.app_portal_business_pack_ecosystem_records (
        company_id, pack_key, pack_name, installed_at, last_activity_at
      ) values (
        p_company_id, v_pack.module_key, initcap(replace(v_pack.module_key, '_', ' ')),
        coalesce(v_pack.activated_at, now()), coalesce(v_pack.updated_at, now())
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        last_activity_at = coalesce(public.app_portal_business_pack_ecosystem_records.last_activity_at, excluded.last_activity_at),
        updated_at = now();
    end loop;
  end if;

  for v_pack in
    select er.* from public.app_portal_business_pack_ecosystem_records er where er.company_id = p_company_id
  loop
    v_adoption := 0;
    if to_regclass('public.app_portal_business_pack_adoption') is not null then
      select a.adoption_score into v_adoption
      from public.app_portal_business_pack_adoption a
      where a.company_id = p_company_id and a.pack_key = v_pack.pack_key;
    end if;
    v_adoption := coalesce(v_adoption, 0);
    v_cross := least(100, v_adoption + 15);

    update public.app_portal_business_pack_ecosystem_records set
      adoption_score = v_adoption,
      cross_utilization_score = v_cross,
      coverage_category = public._abpei306_infer_coverage_category(pack_key),
      coverage_status = public._abpei306_infer_coverage_status(v_adoption, v_cross),
      updated_at = now()
    where company_id = p_company_id and pack_key = v_pack.pack_key;
  end loop;

  for v_rel in select * from jsonb_array_elements(public._abpei306_relationship_catalog())
  loop
    v_source := v_rel->>'source';
    v_target := v_rel->>'target';
    v_label := v_rel->>'label';
    v_source_key := null;
    v_target_key := null;

    select er.pack_key into v_source_key
    from public.app_portal_business_pack_ecosystem_records er
    where er.company_id = p_company_id and public._abpei306_match_pack(er.pack_key, v_source)
    limit 1;

    select er.pack_key into v_target_key
    from public.app_portal_business_pack_ecosystem_records er
    where er.company_id = p_company_id and public._abpei306_match_pack(er.pack_key, v_target)
    limit 1;

    if v_source_key is not null and v_target_key is not null then
      select case
        when s.adoption_score >= 70 and t.adoption_score >= 70 then 'strong'
        when s.adoption_score >= 45 or t.adoption_score >= 45 then 'moderate'
        when s.adoption_score >= 20 or t.adoption_score >= 20 then 'emerging'
        else 'underutilized'
      end into v_strength
      from public.app_portal_business_pack_ecosystem_records s
      join public.app_portal_business_pack_ecosystem_records t
        on t.company_id = s.company_id
      where s.company_id = p_company_id and s.pack_key = v_source_key and t.pack_key = v_target_key;

      insert into public.app_portal_business_pack_ecosystem_relationships (
        company_id, source_pack_key, target_pack_key, relationship_label, strength
      ) values (p_company_id, v_source_key, v_target_key, v_label, coalesce(v_strength, 'emerging'))
      on conflict (company_id, source_pack_key, target_pack_key) do update set
        relationship_label = excluded.relationship_label,
        strength = excluded.strength,
        updated_at = now();
    end if;
  end loop;
end;
$$;

create or replace function public._abpei306_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_pack record;
  v_underutilized integer := 0;
begin
  select count(*) into v_underutilized
  from public.app_portal_business_pack_ecosystem_relationships r
  where r.company_id = p_company_id and r.strength = 'underutilized';

  if v_underutilized > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'collab-' || p_company_id, 'key', 'strengthenCollaboration', 'priority_level', 'recommended');
  end if;

  for v_pack in
    select er.* from public.app_portal_business_pack_ecosystem_records er where er.company_id = p_company_id
  loop
    if v_pack.adoption_score < 45 then
      v_recs := v_recs || jsonb_build_object('id', 'cross-' || v_pack.pack_key, 'key', 'encourageCrossFunctional', 'pack_key', v_pack.pack_key, 'priority_level', 'recommended');
    end if;
    if v_pack.coverage_status = 'coverage_gap_identified' then
      v_recs := v_recs || jsonb_build_object('id', 'gap-' || v_pack.pack_key, 'key', 'addressCoverageGaps', 'pack_key', v_pack.pack_key, 'priority_level', 'important');
    end if;
    if v_pack.adoption_score >= 75 then
      v_recs := v_recs || jsonb_build_object('id', 'celebrate-' || v_pack.pack_key, 'key', 'celebrateMaturity', 'pack_key', v_pack.pack_key, 'priority_level', 'opportunity');
    end if;
  end loop;

  v_recs := v_recs || jsonb_build_object('id', 'learn-' || p_company_id, 'key', 'expandEcosystemLearning', 'priority_level', 'recommended');
  v_recs := v_recs || jsonb_build_object('id', 'owner-' || p_company_id, 'key', 'reviewEcosystemOwnership', 'priority_level', 'recommended');

  return v_recs;
end;
$$;

create or replace function public._abpei306_build_risks(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_risks jsonb := '[]'::jsonb;
  v_low integer;
  v_underutilized integer;
begin
  select count(*) into v_low
  from public.app_portal_business_pack_ecosystem_records er
  where er.company_id = p_company_id and er.adoption_score < 30;

  select count(*) into v_underutilized
  from public.app_portal_business_pack_ecosystem_relationships r
  where r.company_id = p_company_id and r.strength = 'underutilized';

  if v_low > 0 then
    v_risks := v_risks || jsonb_build_object('id', 'underutilized', 'key', 'underutilizedPacks');
  end if;
  if v_underutilized > 0 then
    v_risks := v_risks || jsonb_build_object('id', 'integration', 'key', 'lowIntegration');
  end if;
  if exists (
    select 1 from public.app_portal_business_pack_ecosystem_records er
    where er.company_id = p_company_id and er.coverage_status = 'coverage_gap_identified'
  ) then
    v_risks := v_risks || jsonb_build_object('id', 'fragmented', 'key', 'fragmentedAdoption');
  end if;
  v_risks := v_risks || jsonb_build_object('id', 'ownership', 'key', 'missingOwnership');
  return v_risks;
end;
$$;

create or replace function public._abpei306_build_opportunities(p_company_id uuid)
returns jsonb
language sql
stable
as $$
  select jsonb_build_array(
    jsonb_build_object('id', 'synergy', 'key', 'greaterValueTogether'),
    jsonb_build_object('id', 'training', 'key', 'ecosystemTraining'),
    jsonb_build_object('id', 'workflows', 'key', 'expandCrossFunctional'),
    jsonb_build_object('id', 'governance', 'key', 'strengthenGovernance'),
    jsonb_build_object('id', 'executive', 'key', 'improveExecutiveVisibility')
  );
$$;

create or replace function public._abpei306_executive_summary(p_company_id uuid, p_status text, p_gaps integer)
returns text
language plpgsql
stable
as $$
declare
  v_count integer;
begin
  select count(*) into v_count from public.app_portal_business_pack_ecosystem_records where company_id = p_company_id;
  if v_count = 0 then return 'No ecosystem insights are available yet.'; end if;
  if p_status in ('thriving', 'healthy') then return 'Your Business Pack ecosystem remains healthy.'; end if;
  if p_gaps > 0 then return format('%s ecosystem gap%s require%s attention.', p_gaps, case when p_gaps = 1 then '' else 's' end, case when p_gaps = 1 then 's' else '' end); end if;
  if p_status = 'requires_optimization' then return 'Several opportunities exist to strengthen collaboration between Business Packs.'; end if;
  return 'The organization continues to improve ecosystem maturity.';
end;
$$;

create or replace function public.list_app_portal_business_pack_ecosystem_intelligence(
  p_pack_key text default null,
  p_coverage_category text default null,
  p_ecosystem_status text default null,
  p_relationship_strength text default null,
  p_priority_level text default null,
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
  v_coverage jsonb := '{}'::jsonb;
  v_pack record;
  v_count integer := 0;
  v_health integer := 0;
  v_cross integer := 0;
  v_gaps integer := 0;
  v_status text;
begin
  v_ctx := public._abpei306_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpei306_sync_records(v_company_id, v_user_id);

  for v_pack in
    select er.* from public.app_portal_business_pack_ecosystem_records er
    where er.company_id = v_company_id
      and (p_pack_key is null or er.pack_key = p_pack_key)
      and (p_coverage_category is null or er.coverage_category = p_coverage_category)
      and (p_period_from is null or er.installed_at::date >= p_period_from)
      and (p_search is null or trim(p_search) = '' or er.pack_name ilike '%' || trim(p_search) || '%' or er.pack_key ilike '%' || trim(p_search) || '%')
    order by er.adoption_score desc
  loop
    v_packs := v_packs || jsonb_build_object(
      'pack_key', v_pack.pack_key, 'name', v_pack.pack_name,
      'adoption_score', v_pack.adoption_score, 'cross_utilization_score', v_pack.cross_utilization_score,
      'coverage_category', v_pack.coverage_category, 'coverage_status', v_pack.coverage_status
    );
    v_count := v_count + 1;
    v_coverage := v_coverage || jsonb_build_object(v_pack.coverage_category, coalesce((v_coverage->>v_pack.coverage_category)::int, 0) + 1);
    if v_pack.coverage_status in ('limited_coverage', 'coverage_gap_identified') then v_gaps := v_gaps + 1; end if;
  end loop;

  select coalesce(round(avg(adoption_score)), 0)::integer, coalesce(round(avg(cross_utilization_score)), 0)::integer
  into v_health, v_cross
  from public.app_portal_business_pack_ecosystem_records where company_id = v_company_id;

  v_status := public._abpei306_infer_ecosystem_status(v_health, v_gaps, v_count);
  if p_ecosystem_status is not null and v_status <> p_ecosystem_status then
    null;
  end if;

  insert into public.app_portal_business_pack_ecosystem_snapshots (
    company_id, ecosystem_status, health_score, cross_utilization_score, pack_count, opportunity_count, risk_count
  ) values (
    v_company_id, v_status, v_health, v_cross, v_count,
    jsonb_array_length(public._abpei306_build_opportunities(v_company_id)),
    jsonb_array_length(public._abpei306_build_risks(v_company_id))
  )
  on conflict (company_id, snapshot_date) do update set
    ecosystem_status = excluded.ecosystem_status,
    health_score = excluded.health_score,
    cross_utilization_score = excluded.cross_utilization_score,
    pack_count = excluded.pack_count,
    opportunity_count = excluded.opportunity_count,
    risk_count = excluded.risk_count;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_ecosystem_data', v_count > 0,
    'health_score', v_health,
    'ecosystem_status', v_status,
    'cross_utilization_score', v_cross,
    'coverage_overview', v_coverage,
    'packs', v_packs,
    'opportunities', public._abpei306_build_opportunities(v_company_id),
    'risks', public._abpei306_build_risks(v_company_id),
    'recommendations', public._abpei306_build_recommendations(v_company_id),
    'executive_summary', public._abpei306_executive_summary(v_company_id, v_status, v_gaps),
    'principle', 'Organizations remain responsible for all implementation decisions — Aipify recommendations are advisory.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_ecosystem_relationships(
  p_relationship_strength text default null,
  p_pack_key text default null
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
begin
  v_ctx := public._abpei306_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpei306_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'relationships', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id,
        'source_pack_key', r.source_pack_key,
        'target_pack_key', r.target_pack_key,
        'label', r.relationship_label,
        'strength', r.strength
      ) order by r.strength), '[]'::jsonb)
      from public.app_portal_business_pack_ecosystem_relationships r
      where r.company_id = v_company_id
        and (p_relationship_strength is null or r.strength = p_relationship_strength)
        and (p_pack_key is null or r.source_pack_key = p_pack_key or r.target_pack_key = p_pack_key)
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_ecosystem_recommendations()
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
  v_ctx := public._abpei306_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpei306_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpei306_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_ecosystem_timeline(
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
  v_ctx := public._abpei306_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpei306_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'pack_key', t.pack_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_ecosystem_timeline t
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
        'id', er.id, 'pack_key', er.pack_key, 'event_type', 'pack_added',
        'description', er.pack_name || ' added to ecosystem', 'created_at', er.installed_at
      ) as row
      from public.app_portal_business_pack_ecosystem_records er
      where er.company_id = v_company_id
        and (p_pack_key is null or er.pack_key = p_pack_key)
        and (p_period_from is null or er.installed_at::date >= p_period_from)
        and er.installed_at is not null
      order by er.installed_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

grant execute on function public._abpei306_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_ecosystem_intelligence(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_ecosystem_relationships(text, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_ecosystem_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_ecosystem_timeline(text, date) to authenticated;

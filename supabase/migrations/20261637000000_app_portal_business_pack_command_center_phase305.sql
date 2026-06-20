-- Phase 305 (APP) — Business Pack Operations Command Center

create table if not exists public.app_portal_business_pack_command_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_command_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  health_status text not null default 'stable' check (health_status in (
    'thriving', 'healthy', 'stable', 'requires_attention', 'at_risk'
  )),
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  value_score integer not null default 0 check (value_score between 0 and 100),
  usage_trend text not null default 'stable' check (usage_trend in ('growing', 'stable', 'declining')),
  assigned_owner text not null default '',
  recommended_action text not null default '',
  priority_level text not null default 'opportunity' check (priority_level in (
    'opportunity', 'recommended', 'important', 'immediate_attention'
  )),
  value_category text not null default 'productivity_value',
  is_active boolean not null default true,
  last_activity_at timestamptz,
  installed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_command_records_company_idx
  on public.app_portal_business_pack_command_records (company_id, health_status, priority_level, is_active);

create table if not exists public.app_portal_business_pack_command_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  snapshot_date date not null default current_date,
  ecosystem_status text not null default 'stable' check (ecosystem_status in (
    'thriving', 'healthy', 'stable', 'requires_attention', 'critical_review_needed'
  )),
  total_installed integer not null default 0,
  active_packs integer not null default 0,
  avg_adoption_score integer not null default 0,
  avg_value_score integer not null default 0,
  packs_requiring_attention integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (company_id, snapshot_date)
);

create index if not exists app_portal_business_pack_command_snapshots_idx
  on public.app_portal_business_pack_command_snapshots (company_id, snapshot_date desc);

create table if not exists public.app_portal_business_pack_command_recommendations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  recommendation_key text not null,
  priority_level text not null default 'recommended' check (priority_level in (
    'opportunity', 'recommended', 'important', 'immediate_attention'
  )),
  status text not null default 'active' check (status in ('active', 'resolved', 'dismissed')),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_command_recommendations_idx
  on public.app_portal_business_pack_command_recommendations (company_id, status, priority_level);

create table if not exists public.app_portal_business_pack_command_timeline (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null default '',
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_command_timeline_idx
  on public.app_portal_business_pack_command_timeline (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_command_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_command_audit_idx
  on public.app_portal_business_pack_command_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_command_state enable row level security;
alter table public.app_portal_business_pack_command_records enable row level security;
alter table public.app_portal_business_pack_command_snapshots enable row level security;
alter table public.app_portal_business_pack_command_recommendations enable row level security;
alter table public.app_portal_business_pack_command_timeline enable row level security;
alter table public.app_portal_business_pack_command_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_command_state from authenticated, anon;
revoke all on public.app_portal_business_pack_command_records from authenticated, anon;
revoke all on public.app_portal_business_pack_command_snapshots from authenticated, anon;
revoke all on public.app_portal_business_pack_command_recommendations from authenticated, anon;
revoke all on public.app_portal_business_pack_command_timeline from authenticated, anon;
revoke all on public.app_portal_business_pack_command_audit_logs from authenticated, anon;

create or replace function public._abpoc305_access_context()
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
  from public.app_portal_business_pack_command_state cs
  where cs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Business Pack Command Center access requires organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abpoc305_infer_health(p_adoption integer, p_value integer)
returns text
language sql
immutable
as $$
  select case
    when p_adoption >= 85 and p_value >= 75 then 'thriving'
    when p_adoption >= 70 and p_value >= 55 then 'healthy'
    when p_adoption >= 45 then 'stable'
    when p_adoption >= 25 then 'requires_attention'
    else 'at_risk'
  end;
$$;

create or replace function public._abpoc305_infer_ecosystem(p_avg_adoption integer, p_attention integer, p_total integer)
returns text
language sql
immutable
as $$
  select case
    when p_total = 0 then 'stable'
    when p_attention >= greatest(1, p_total / 3) then 'critical_review_needed'
    when p_avg_adoption >= 75 then 'thriving'
    when p_avg_adoption >= 55 then 'healthy'
    when p_avg_adoption >= 35 then 'stable'
    else 'requires_attention'
  end;
$$;

create or replace function public._abpoc305_infer_priority(p_health text)
returns text
language sql
immutable
as $$
  select case p_health
    when 'at_risk' then 'immediate_attention'
    when 'requires_attention' then 'important'
    when 'stable' then 'recommended'
    else 'opportunity'
  end;
$$;

create or replace function public._abpoc305_recommended_action(p_health text, p_adoption integer)
returns text
language sql
immutable
as $$
  select case
    when p_health = 'at_risk' then 'Schedule Business Pack review'
    when p_health = 'requires_attention' then 'Increase adoption through targeted learning'
    when p_adoption >= 70 then 'Explore expansion opportunities'
    else 'Monitor adoption progress'
  end;
$$;

create or replace function public._abpoc305_sync_records(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_adoption integer := 0;
  v_value integer := 0;
  v_trend text := 'stable';
  v_owner text := '';
  v_category text := 'productivity_value';
  v_health text;
  v_active boolean := true;
begin
  insert into public.app_portal_business_pack_command_state (company_id, updated_by)
  values (p_company_id, p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status, tm.activated_at, tm.updated_at
      from public.tenant_modules tm
      where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta', 'deprecated')
    loop
      insert into public.app_portal_business_pack_command_records (
        company_id, pack_key, pack_name, installed_at, last_activity_at, is_active
      ) values (
        p_company_id, v_pack.module_key, initcap(replace(v_pack.module_key, '_', ' ')),
        coalesce(v_pack.activated_at, now()), coalesce(v_pack.updated_at, now()),
        v_pack.status <> 'deprecated'
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        is_active = excluded.is_active,
        last_activity_at = coalesce(public.app_portal_business_pack_command_records.last_activity_at, excluded.last_activity_at),
        updated_at = now();
    end loop;
  end if;

  for v_pack in
    select cr.* from public.app_portal_business_pack_command_records cr where cr.company_id = p_company_id
  loop
    v_adoption := 0;
    v_value := 0;
    v_trend := 'stable';
    v_owner := '';
    v_category := 'productivity_value';

    if to_regclass('public.app_portal_business_pack_adoption') is not null then
      select a.adoption_score, a.usage_trend into v_adoption, v_trend
      from public.app_portal_business_pack_adoption a
      where a.company_id = p_company_id and a.pack_key = v_pack.pack_key;
    end if;

    if to_regclass('public.app_portal_business_pack_value_records') is not null then
      select least(100, round(vr.estimated_value / nullif(vr.potential_value, 0) * 100)::integer), vr.primary_category
      into v_value, v_category
      from public.app_portal_business_pack_value_records vr
      where vr.company_id = p_company_id and vr.pack_key = v_pack.pack_key;
    end if;

    if to_regclass('public.app_portal_business_pack_lifecycle_records') is not null then
      select lr.review_owner into v_owner
      from public.app_portal_business_pack_lifecycle_records lr
      where lr.company_id = p_company_id and lr.pack_key = v_pack.pack_key;
    end if;

    v_adoption := coalesce(v_adoption, 0);
    v_value := coalesce(v_value, least(100, v_adoption + 10));
    v_health := public._abpoc305_infer_health(v_adoption, v_value);

    update public.app_portal_business_pack_command_records set
      adoption_score = v_adoption,
      value_score = v_value,
      usage_trend = coalesce(v_trend, 'stable'),
      assigned_owner = coalesce(nullif(v_owner, ''), assigned_owner),
      value_category = coalesce(v_category, value_category),
      health_status = v_health,
      priority_level = public._abpoc305_infer_priority(v_health),
      recommended_action = public._abpoc305_recommended_action(v_health, v_adoption),
      updated_at = now()
    where company_id = p_company_id and pack_key = v_pack.pack_key;
  end loop;
end;
$$;

create or replace function public._abpoc305_pack_card(p_company_id uuid, p_pack public.app_portal_business_pack_command_records)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_pack.pack_key,
    'pack_key', p_pack.pack_key,
    'name', p_pack.pack_name,
    'health_status', p_pack.health_status,
    'adoption_score', p_pack.adoption_score,
    'value_score', p_pack.value_score,
    'usage_trend', p_pack.usage_trend,
    'last_activity_at', p_pack.last_activity_at,
    'assigned_owner', p_pack.assigned_owner,
    'recommended_action', p_pack.recommended_action,
    'priority_level', p_pack.priority_level,
    'value_category', p_pack.value_category,
    'is_active', p_pack.is_active
  );
$$;

create or replace function public._abpoc305_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_pack record;
begin
  for v_pack in
    select cr.* from public.app_portal_business_pack_command_records cr where cr.company_id = p_company_id
  loop
    if v_pack.health_status in ('requires_attention', 'at_risk') then
      v_recs := v_recs || jsonb_build_object(
        'id', 'review-' || v_pack.pack_key, 'key', 'scheduleReviews',
        'pack_key', v_pack.pack_key, 'priority_level', 'important'
      );
    end if;
    if v_pack.adoption_score < 45 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'learn-' || v_pack.pack_key, 'key', 'increaseAdoptionLearning',
        'pack_key', v_pack.pack_key, 'priority_level', 'recommended'
      );
    end if;
    if v_pack.health_status = 'at_risk' and coalesce(v_pack.assigned_owner, '') = '' then
      v_recs := v_recs || jsonb_build_object(
        'id', 'owner-' || v_pack.pack_key, 'key', 'reassignOwnership',
        'pack_key', v_pack.pack_key, 'priority_level', 'important'
      );
    end if;
    if v_pack.adoption_score >= 75 and v_pack.value_score >= 65 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'expand-' || v_pack.pack_key, 'key', 'exploreExpansion',
        'pack_key', v_pack.pack_key, 'priority_level', 'opportunity'
      );
    end if;
    if v_pack.adoption_score < 20 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'retire-' || v_pack.pack_key, 'key', 'retireUnderutilized',
        'pack_key', v_pack.pack_key, 'priority_level', 'recommended'
      );
    end if;
    if v_pack.health_status = 'thriving' then
      v_recs := v_recs || jsonb_build_object(
        'id', 'celebrate-' || v_pack.pack_key, 'key', 'celebrateSuccess',
        'pack_key', v_pack.pack_key, 'priority_level', 'opportunity'
      );
    end if;
  end loop;
  return v_recs;
end;
$$;

create or replace function public._abpoc305_executive_summary(p_company_id uuid)
returns text
language plpgsql
stable
as $$
declare
  v_total integer := 0;
  v_attention integer := 0;
  v_avg_adoption numeric := 0;
  v_thriving integer := 0;
begin
  select count(*), count(*) filter (where health_status in ('requires_attention', 'at_risk')),
    coalesce(avg(adoption_score), 0), count(*) filter (where health_status = 'thriving')
  into v_total, v_attention, v_avg_adoption, v_thriving
  from public.app_portal_business_pack_command_records
  where company_id = p_company_id and is_active;

  if v_total = 0 then
    return 'No Business Pack insights are available yet.';
  end if;
  if v_attention = 0 and v_avg_adoption >= 65 then
    return 'Most Business Packs are operating effectively.';
  end if;
  if v_attention > 0 then
    return format('%s Business Pack%s require optimization reviews.', v_attention, case when v_attention = 1 then '' else 's' end);
  end if;
  if v_avg_adoption >= 50 then
    return 'Adoption continues to improve across the organization.';
  end if;
  if v_thriving > 0 then
    return 'Significant value has been realized through recent initiatives.';
  end if;
  return 'Additional training opportunities have been identified.';
end;
$$;

create or replace function public.list_app_portal_business_pack_command_center(
  p_pack_key text default null,
  p_health_status text default null,
  p_adoption_level text default null,
  p_value_category text default null,
  p_owner text default null,
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
  v_pack record;
  v_count integer := 0;
  v_active integer := 0;
  v_attention integer := 0;
  v_avg_adoption integer := 0;
  v_avg_value integer := 0;
  v_ecosystem text;
begin
  v_ctx := public._abpoc305_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpoc305_sync_records(v_company_id, v_user_id);

  for v_pack in
    select cr.* from public.app_portal_business_pack_command_records cr
    where cr.company_id = v_company_id
      and (p_pack_key is null or cr.pack_key = p_pack_key)
      and (p_health_status is null or cr.health_status = p_health_status)
      and (p_value_category is null or cr.value_category = p_value_category)
      and (p_owner is null or trim(p_owner) = '' or cr.assigned_owner ilike '%' || trim(p_owner) || '%')
      and (p_priority_level is null or cr.priority_level = p_priority_level)
      and (p_period_from is null or cr.installed_at::date >= p_period_from)
      and (p_adoption_level is null or (
        (p_adoption_level = 'low' and cr.adoption_score < 40) or
        (p_adoption_level = 'healthy' and cr.adoption_score >= 40 and cr.adoption_score < 75) or
        (p_adoption_level = 'high' and cr.adoption_score >= 75)
      ))
      and (p_search is null or trim(p_search) = '' or cr.pack_name ilike '%' || trim(p_search) || '%' or cr.pack_key ilike '%' || trim(p_search) || '%')
    order by cr.adoption_score desc
  loop
    v_packs := v_packs || public._abpoc305_pack_card(v_company_id, v_pack);
    v_count := v_count + 1;
    if v_pack.is_active then v_active := v_active + 1; end if;
    if v_pack.health_status in ('requires_attention', 'at_risk') then v_attention := v_attention + 1; end if;
  end loop;

  select coalesce(round(avg(adoption_score)), 0)::integer, coalesce(round(avg(value_score)), 0)::integer
  into v_avg_adoption, v_avg_value
  from public.app_portal_business_pack_command_records
  where company_id = v_company_id;

  v_ecosystem := public._abpoc305_infer_ecosystem(v_avg_adoption, v_attention, v_count);

  insert into public.app_portal_business_pack_command_snapshots (
    company_id, ecosystem_status, total_installed, active_packs,
    avg_adoption_score, avg_value_score, packs_requiring_attention
  ) values (
    v_company_id, v_ecosystem, v_count, v_active,
    v_avg_adoption, v_avg_value, v_attention
  )
  on conflict (company_id, snapshot_date) do update set
    ecosystem_status = excluded.ecosystem_status,
    total_installed = excluded.total_installed,
    active_packs = excluded.active_packs,
    avg_adoption_score = excluded.avg_adoption_score,
    avg_value_score = excluded.avg_value_score,
    packs_requiring_attention = excluded.packs_requiring_attention;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_command_data', v_count > 0,
    'total_installed', v_count,
    'active_packs', v_active,
    'ecosystem_status', v_ecosystem,
    'adoption_overview', jsonb_build_object('average_score', v_avg_adoption, 'pack_count', v_count),
    'value_overview', jsonb_build_object('average_score', v_avg_value, 'pack_count', v_count),
    'packs_requiring_attention', v_attention,
    'optimization_opportunities', v_attention + (
      select count(*) from public.app_portal_business_pack_command_records cr
      where cr.company_id = v_company_id and cr.adoption_score < 50
    ),
    'executive_summary', public._abpoc305_executive_summary(v_company_id),
    'packs', v_packs,
    'recommendations', public._abpoc305_build_recommendations(v_company_id),
    'principle', 'Organizations remain responsible for all operational decisions — Aipify recommendations are advisory.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_command_insights()
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
  v_ctx := public._abpoc305_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpoc305_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'most_valuable', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name, 'value_score', cr.value_score) order by cr.value_score desc), '[]'::jsonb)
      from (select cr.* from public.app_portal_business_pack_command_records cr where cr.company_id = v_company_id order by cr.value_score desc limit 5) cr
    ),
    'least_adopted', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name, 'adoption_score', cr.adoption_score) order by cr.adoption_score), '[]'::jsonb)
      from (select cr.* from public.app_portal_business_pack_command_records cr where cr.company_id = v_company_id order by cr.adoption_score asc limit 5) cr
    ),
    'fastest_growing', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name, 'usage_trend', cr.usage_trend)), '[]'::jsonb)
      from public.app_portal_business_pack_command_records cr
      where cr.company_id = v_company_id and cr.usage_trend = 'growing'
      limit 5
    ),
    'requiring_review', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name, 'health_status', cr.health_status)), '[]'::jsonb)
      from public.app_portal_business_pack_command_records cr
      where cr.company_id = v_company_id and cr.health_status in ('requires_attention', 'at_risk')
      limit 8
    ),
    'training_opportunities', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', cr.pack_key, 'name', cr.pack_name)), '[]'::jsonb)
      from public.app_portal_business_pack_command_records cr
      where cr.company_id = v_company_id and cr.adoption_score < 50
      limit 8
    ),
    'governance_observations', jsonb_build_array(
      'Review ownership assignments for Business Packs requiring attention.',
      'Schedule periodic ecosystem reviews to maintain operational clarity.'
    )
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_command_recommendations()
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
  v_ctx := public._abpoc305_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpoc305_sync_records(v_company_id, v_user_id);

  return jsonb_build_object(
    'found', true,
    'recommendations', public._abpoc305_build_recommendations(v_company_id)
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_command_timeline(
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
  v_events jsonb := '[]'::jsonb;
begin
  v_ctx := public._abpoc305_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._abpoc305_sync_records(v_company_id, v_user_id);

  select coalesce(jsonb_agg(row order by row->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'pack_key', t.pack_key, 'event_type', t.event_type,
      'description', t.description, 'created_at', t.created_at
    ) as row
    from public.app_portal_business_pack_command_timeline t
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
        'id', cr.id, 'pack_key', cr.pack_key, 'event_type', 'installation_completed',
        'description', cr.pack_name || ' installed', 'created_at', cr.installed_at
      ) as row
      from public.app_portal_business_pack_command_records cr
      where cr.company_id = v_company_id
        and (p_pack_key is null or cr.pack_key = p_pack_key)
        and (p_period_from is null or cr.installed_at::date >= p_period_from)
        and cr.installed_at is not null
      order by cr.installed_at desc
      limit 15
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'events', v_events);
end;
$$;

grant execute on function public._abpoc305_access_context() to authenticated;
grant execute on function public.list_app_portal_business_pack_command_center(text, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_command_insights() to authenticated;
grant execute on function public.get_app_portal_business_pack_command_recommendations() to authenticated;
grant execute on function public.get_app_portal_business_pack_command_timeline(text, date) to authenticated;

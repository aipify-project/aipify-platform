-- Phase 301 (APP) — Business Pack Success Center

create table if not exists public.app_portal_business_pack_success_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  journey_started_at timestamptz,
  resolved_recommendations jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_adoption (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  pack_name text not null default '',
  status text not null default 'getting_started' check (status in (
    'getting_started', 'active', 'healthy', 'optimized', 'requires_attention'
  )),
  adoption_score integer not null default 0 check (adoption_score between 0 and 100),
  usage_trend text not null default 'stable' check (usage_trend in ('growing', 'stable', 'declining')),
  users_assigned integer not null default 0,
  features_activated integer not null default 0,
  last_activity_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, pack_key)
);

create index if not exists app_portal_business_pack_adoption_company_idx
  on public.app_portal_business_pack_adoption (company_id, status, adoption_score desc);

create table if not exists public.app_portal_business_pack_milestones (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  milestone_key text not null,
  achieved_at timestamptz not null default now(),
  auto_detected boolean not null default true,
  achieved_by uuid references public.users (id) on delete set null,
  unique (company_id, pack_key, milestone_key)
);

create index if not exists app_portal_business_pack_milestones_company_idx
  on public.app_portal_business_pack_milestones (company_id, pack_key, achieved_at desc);

create table if not exists public.app_portal_business_pack_success_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_success_audit_idx
  on public.app_portal_business_pack_success_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_success_state enable row level security;
alter table public.app_portal_business_pack_adoption enable row level security;
alter table public.app_portal_business_pack_milestones enable row level security;
alter table public.app_portal_business_pack_success_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_success_state from authenticated, anon;
revoke all on public.app_portal_business_pack_adoption from authenticated, anon;
revoke all on public.app_portal_business_pack_milestones from authenticated, anon;
revoke all on public.app_portal_business_pack_success_audit_logs from authenticated, anon;

create or replace function public._abpsc301_access_context()
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
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abpsc301_milestone_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'installed_successfully', 'title', 'Installed successfully'),
    jsonb_build_object('key', 'first_user_assigned', 'title', 'First user assigned'),
    jsonb_build_object('key', 'first_workflow_completed', 'title', 'First workflow completed'),
    jsonb_build_object('key', 'first_report_generated', 'title', 'First report generated'),
    jsonb_build_object('key', 'recommended_setup_completed', 'title', 'Recommended setup completed'),
    jsonb_build_object('key', 'team_training_completed', 'title', 'Team training completed'),
    jsonb_build_object('key', 'adoption_threshold_reached', 'title', 'Adoption threshold reached')
  );
$$;

create or replace function public._abpsc301_onboarding_checklist(p_pack_key text)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'initial_setup', 'title', 'Complete initial setup', 'category', 'setup'),
    jsonb_build_object('key', 'recommended_configuration', 'title', 'Apply recommended configuration', 'category', 'configuration'),
    jsonb_build_object('key', 'assign_users', 'title', 'Assign users to this Business Pack', 'category', 'training'),
    jsonb_build_object('key', 'integration_setup', 'title', 'Activate recommended integrations', 'category', 'integration'),
    jsonb_build_object('key', 'governance_review', 'title', 'Review governance recommendations', 'category', 'governance')
  );
$$;

create or replace function public._abpsc301_pack_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 85 then 'optimized'
    when p_score >= 70 then 'healthy'
    when p_score >= 45 then 'active'
    when p_score >= 20 then 'getting_started'
    else 'requires_attention'
  end;
$$;

create or replace function public._abpsc301_sync_adoption(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_team_count integer := 0;
  v_score integer;
  v_features integer;
  v_users integer;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.tenant_modules') is not null then
    for v_pack in
      select tm.module_key, tm.status, tm.updated_at, tm.metadata
      from public.tenant_modules tm
      where tm.company_id = p_company_id
        and tm.status in ('enabled', 'trial', 'beta')
    loop
      v_features := least(5, 1 + coalesce((v_pack.metadata->>'features_activated')::int, 0));
      v_users := greatest(1, least(v_team_count, coalesce((v_pack.metadata->>'users_assigned')::int, greatest(1, v_team_count / 2))));
      v_score := least(100, 15 + v_features * 12 + v_users * 8 + case v_pack.status when 'enabled' then 20 when 'trial' then 10 else 5 end);

      insert into public.app_portal_business_pack_adoption (
        company_id, pack_key, pack_name, status, adoption_score, usage_trend,
        users_assigned, features_activated, last_activity_at, updated_at
      ) values (
        p_company_id,
        v_pack.module_key,
        initcap(replace(v_pack.module_key, '_', ' ')),
        public._abpsc301_pack_status(v_score),
        v_score,
        case when v_score >= 60 then 'growing' when v_score >= 30 then 'stable' else 'declining' end,
        v_users,
        v_features,
        coalesce(v_pack.updated_at, now()),
        now()
      )
      on conflict (company_id, pack_key) do update set
        pack_name = excluded.pack_name,
        status = excluded.status,
        adoption_score = excluded.adoption_score,
        usage_trend = excluded.usage_trend,
        users_assigned = excluded.users_assigned,
        features_activated = excluded.features_activated,
        last_activity_at = excluded.last_activity_at,
        updated_at = now();
    end loop;
  end if;

  insert into public.app_portal_business_pack_success_state (company_id, journey_started_at, updated_by)
  values (p_company_id, now(), p_user_id)
  on conflict (company_id) do update set updated_at = now(), updated_by = p_user_id;
end;
$$;

create or replace function public._abpsc301_sync_milestones(p_company_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pack record;
  v_team_count integer := 0;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  for v_pack in
    select a.* from public.app_portal_business_pack_adoption a where a.company_id = p_company_id
  loop
    insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
    values (p_company_id, v_pack.pack_key, 'installed_successfully', p_user_id)
    on conflict (company_id, pack_key, milestone_key) do nothing;

    if v_pack.users_assigned >= 1 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'first_user_assigned', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;

    if v_pack.features_activated >= 2 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'first_workflow_completed', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;

    if v_pack.adoption_score >= 40 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'first_report_generated', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;

    if v_pack.adoption_score >= 55 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'recommended_setup_completed', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;

    if v_team_count >= 3 and v_pack.adoption_score >= 50 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'team_training_completed', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;

    if v_pack.adoption_score >= 75 then
      insert into public.app_portal_business_pack_milestones (company_id, pack_key, milestone_key, achieved_by)
      values (p_company_id, v_pack.pack_key, 'adoption_threshold_reached', p_user_id)
      on conflict (company_id, pack_key, milestone_key) do nothing;
    end if;
  end loop;
end;
$$;

create or replace function public._abpsc301_build_recommendations(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_pack record;
  v_team_count integer := 0;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  for v_pack in
    select a.* from public.app_portal_business_pack_adoption a where a.company_id = p_company_id
  loop
    if v_pack.adoption_score < 40 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'onboard-' || v_pack.pack_key, 'key', 'completeOnboardingSteps', 'priority', 'important',
        'pack_key', v_pack.pack_key, 'type', 'onboarding'
      );
    end if;
    if v_pack.features_activated < 3 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'explore-' || v_pack.pack_key, 'key', 'exploreAdvancedCapabilities', 'priority', 'recommended',
        'pack_key', v_pack.pack_key, 'type', 'adoption'
      );
    end if;
    if v_pack.users_assigned < v_team_count and v_team_count > 1 then
      v_recs := v_recs || jsonb_build_object(
        'id', 'train-' || v_pack.pack_key, 'key', 'trainAdditionalUsers', 'priority', 'recommended',
        'pack_key', v_pack.pack_key, 'type', 'training'
      );
    end if;
    if v_pack.status = 'requires_attention' then
      v_recs := v_recs || jsonb_build_object(
        'id', 'review-' || v_pack.pack_key, 'key', 'scheduleBusinessPackReview', 'priority', 'high_impact',
        'pack_key', v_pack.pack_key, 'type', 'review'
      );
    end if;
  end loop;

  if (select count(*) from public.app_portal_business_pack_adoption a where a.company_id = p_company_id) = 0 then
    v_recs := v_recs || jsonb_build_object(
      'id', 'explore-packs', 'key', 'exploreBusinessPacks', 'priority', 'high_impact', 'pack_key', null, 'type', 'discovery'
    );
  else
    v_recs := v_recs || jsonb_build_object(
      'id', 'integrations', 'key', 'activateRecommendedIntegrations', 'priority', 'opportunity', 'pack_key', null, 'type', 'integration'
    );
    v_recs := v_recs || jsonb_build_object(
      'id', 'best-practices', 'key', 'reviewBestPractices', 'priority', 'opportunity', 'pack_key', null, 'type', 'best_practices'
    );
  end if;

  return v_recs;
end;
$$;

create or replace function public._abpsc301_build_adoption_insights(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_frequent jsonb := '[]'::jsonb;
  v_rare jsonb := '[]'::jsonb;
  v_engaging jsonb := '[]'::jsonb;
  v_onboarding jsonb := '[]'::jsonb;
  v_learning jsonb := '[]'::jsonb;
  v_config jsonb := '[]'::jsonb;
  v_pack record;
begin
  for v_pack in
    select a.* from public.app_portal_business_pack_adoption a where a.company_id = p_company_id
  loop
    if v_pack.adoption_score >= 60 then
      v_frequent := v_frequent || to_jsonb(v_pack.pack_name);
    elsif v_pack.adoption_score < 40 then
      v_rare := v_rare || to_jsonb(v_pack.pack_name);
      v_onboarding := v_onboarding || to_jsonb(v_pack.pack_name);
    end if;
    if v_pack.users_assigned >= 2 then
      v_engaging := v_engaging || to_jsonb(v_pack.pack_name);
    end if;
    if v_pack.status in ('getting_started', 'requires_attention') then
      v_learning := v_learning || to_jsonb(v_pack.pack_name);
      v_config := v_config || to_jsonb(v_pack.pack_name);
    end if;
  end loop;

  return jsonb_build_object(
    'features_frequently_used', v_frequent,
    'features_rarely_used', v_rare,
    'users_actively_engaging', v_engaging,
    'areas_requiring_onboarding', v_onboarding,
    'learning_opportunities', v_learning,
    'recommended_configurations', v_config
  );
end;
$$;

create or replace function public._abpsc301_pack_card(p_company_id uuid, p_pack record)
returns jsonb
language plpgsql
stable
as $$
declare
  v_milestones jsonb;
  v_recs jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'key', m.milestone_key,
    'title', cat->>'title',
    'achieved_at', m.achieved_at
  ) order by m.achieved_at), '[]'::jsonb)
  into v_milestones
  from public.app_portal_business_pack_milestones m
  cross join lateral (
    select c as cat from jsonb_array_elements(public._abpsc301_milestone_catalog()) c
    where c->>'key' = m.milestone_key limit 1
  ) cat
  where m.company_id = p_company_id and m.pack_key = p_pack.pack_key;

  v_recs := (
    select coalesce(jsonb_agg(r), '[]'::jsonb) from (
      select r from jsonb_array_elements(public._abpsc301_build_recommendations(p_company_id)) r
      where r->>'pack_key' = p_pack.pack_key or r->>'pack_key' is null
      limit 3
    ) sub
  );

  return jsonb_build_object(
    'id', p_pack.pack_key,
    'pack_key', p_pack.pack_key,
    'name', p_pack.pack_name,
    'status', p_pack.status,
    'adoption_score', p_pack.adoption_score,
    'usage_trend', p_pack.usage_trend,
    'users_assigned', p_pack.users_assigned,
    'features_activated', p_pack.features_activated,
    'last_activity', p_pack.last_activity_at,
    'milestones', v_milestones,
    'recommended_actions', v_recs,
    'onboarding_checklist', public._abpsc301_onboarding_checklist(p_pack.pack_key)
  );
end;
$$;

create or replace function public.list_app_portal_business_pack_success(
  p_pack_key text default null,
  p_adoption_status text default null,
  p_priority text default null,
  p_period_from date default null,
  p_success_status text default null,
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
  v_overall integer := 0;
  v_most_active jsonb := '[]'::jsonb;
  v_underutilized jsonb := '[]'::jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recs jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_insights jsonb;
  v_pack record;
  v_count integer := 0;
  v_journey_started timestamptz;
begin
  v_ctx := public._abpsc301_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpsc301_sync_adoption(v_company_id, v_user_id);
  perform public._abpsc301_sync_milestones(v_company_id, v_user_id);

  select ss.journey_started_at into v_journey_started
  from public.app_portal_business_pack_success_state ss where ss.company_id = v_company_id;

  for v_pack in
    select a.* from public.app_portal_business_pack_adoption a
    where a.company_id = v_company_id
      and (p_pack_key is null or a.pack_key = p_pack_key)
      and (p_adoption_status is null or a.status = p_adoption_status)
      and (p_success_status is null or a.status = p_success_status)
      and (p_search is null or trim(p_search) = '' or a.pack_name ilike '%' || trim(p_search) || '%' or a.pack_key ilike '%' || trim(p_search) || '%')
    order by a.adoption_score desc
  loop
    v_packs := v_packs || public._abpsc301_pack_card(v_company_id, v_pack);
    v_overall := v_overall + v_pack.adoption_score;
    v_count := v_count + 1;
  end loop;

  if v_count > 0 then
    v_overall := round(v_overall::numeric / v_count)::int;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', a.pack_key, 'name', a.pack_name, 'score', a.adoption_score)), '[]'::jsonb)
  into v_most_active
  from (
    select a.* from public.app_portal_business_pack_adoption a
    where a.company_id = v_company_id order by a.adoption_score desc limit 3
  ) a;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', a.pack_key, 'name', a.pack_name, 'score', a.adoption_score)), '[]'::jsonb)
  into v_underutilized
  from (
    select a.* from public.app_portal_business_pack_adoption a
    where a.company_id = v_company_id and a.adoption_score < 45 order by a.adoption_score asc limit 3
  ) a;

  select coalesce(jsonb_agg(row order by row->>'achieved_at' desc), '[]'::jsonb)
  into v_milestones
  from (
    select jsonb_build_object(
      'key', m.milestone_key, 'pack_key', m.pack_key, 'title', cat->>'title', 'achieved_at', m.achieved_at
    ) as row
    from public.app_portal_business_pack_milestones m
    cross join lateral (
      select c as cat from jsonb_array_elements(public._abpsc301_milestone_catalog()) c
      where c->>'key' = m.milestone_key limit 1
    ) cat
    where m.company_id = v_company_id
      and (p_period_from is null or m.achieved_at::date >= p_period_from)
    order by m.achieved_at desc
    limit 12
  ) sub;

  v_recs := public._abpsc301_build_recommendations(v_company_id);
  if p_priority is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'pack_key', l.pack_key, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_business_pack_success_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from);

  v_insights := public._abpsc301_build_adoption_insights(v_company_id);

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'journey_started', v_journey_started is not null,
    'has_installed_packs', v_count > 0,
    'overall_adoption_score', v_overall,
    'installed_packs', v_packs,
    'most_active_packs', v_most_active,
    'underutilized_packs', v_underutilized,
    'milestones_achieved', v_milestones,
    'recommendations', v_recs,
    'adoption_insights', v_insights,
    'learning_opportunities', v_insights->'learning_opportunities',
    'timeline', v_timeline,
    'principle', 'Aipify provides recommendations and insights — organizations remain responsible for implementation.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_success_detail(p_pack_key text)
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
  v_timeline jsonb := '[]'::jsonb;
begin
  v_ctx := public._abpsc301_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._abpsc301_sync_adoption(v_company_id, v_user_id);
  perform public._abpsc301_sync_milestones(v_company_id, v_user_id);

  select a.* into v_pack
  from public.app_portal_business_pack_adoption a
  where a.company_id = v_company_id and a.pack_key = p_pack_key;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_business_pack_success_audit_logs l
  where l.company_id = v_company_id and (l.pack_key = p_pack_key or l.pack_key is null)
  limit 20;

  return public._abpsc301_pack_card(v_company_id, v_pack)
    || jsonb_build_object(
      'found', true,
      'adoption_insights', public._abpsc301_build_adoption_insights(v_company_id),
      'timeline', v_timeline,
      'recommendations', (
        select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select r from jsonb_array_elements(public._abpsc301_build_recommendations(v_company_id)) r
          where r->>'pack_key' = p_pack_key or r->>'pack_key' is null
        ) sub
      )
    );
end;
$$;

create or replace function public.list_app_portal_business_pack_recommendations(
  p_pack_key text default null,
  p_priority text default null,
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
  v_recs jsonb;
begin
  v_ctx := public._abpsc301_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._abpsc301_sync_adoption(v_company_id, (v_ctx->>'user_id')::uuid);

  v_recs := public._abpsc301_build_recommendations(v_company_id);

  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
    select r from jsonb_array_elements(v_recs) r
    where (p_pack_key is null or r->>'pack_key' = p_pack_key or r->>'pack_key' is null)
      and (p_priority is null or r->>'priority' = p_priority)
      and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
  ) sub;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end;
$$;

create or replace function public.list_app_portal_business_pack_adoption(
  p_pack_key text default null,
  p_adoption_status text default null,
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
  v_packs jsonb := '[]'::jsonb;
  v_pack record;
begin
  v_ctx := public._abpsc301_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._abpsc301_sync_adoption(v_company_id, (v_ctx->>'user_id')::uuid);

  for v_pack in
    select a.* from public.app_portal_business_pack_adoption a
    where a.company_id = v_company_id
      and (p_pack_key is null or a.pack_key = p_pack_key)
      and (p_adoption_status is null or a.status = p_adoption_status)
      and (p_search is null or trim(p_search) = '' or a.pack_name ilike '%' || trim(p_search) || '%')
    order by a.adoption_score desc
  loop
    v_packs := v_packs || jsonb_build_object(
      'pack_key', v_pack.pack_key,
      'name', v_pack.pack_name,
      'status', v_pack.status,
      'adoption_score', v_pack.adoption_score,
      'usage_trend', v_pack.usage_trend,
      'users_assigned', v_pack.users_assigned,
      'features_activated', v_pack.features_activated,
      'last_activity', v_pack.last_activity_at
    );
  end loop;

  return jsonb_build_object(
    'found', true,
    'adoption_insights', public._abpsc301_build_adoption_insights(v_company_id),
    'packs', v_packs
  );
end;
$$;

grant execute on function public.list_app_portal_business_pack_success(text, text, text, date, text, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_success_detail(text) to authenticated;
grant execute on function public.list_app_portal_business_pack_recommendations(text, text, text) to authenticated;
grant execute on function public.list_app_portal_business_pack_adoption(text, text, text) to authenticated;

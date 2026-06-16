-- Phase 295 (APP) — Customer Success & Adoption Center

create table if not exists public.app_portal_customer_success_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  journey_started_at timestamptz,
  resolved_recommendations jsonb not null default '[]'::jsonb,
  dismissed_milestones jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_customer_success_milestones (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  milestone_key text not null,
  achieved_at timestamptz not null default now(),
  auto_detected boolean not null default true,
  achieved_by uuid references public.users (id) on delete set null,
  unique (company_id, milestone_key)
);

create index if not exists app_portal_customer_success_milestones_company_idx
  on public.app_portal_customer_success_milestones (company_id, achieved_at desc);

create table if not exists public.app_portal_customer_success_recommendations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  recommendation_key text not null,
  priority text not null default 'recommended' check (priority in (
    'opportunity', 'recommended', 'important', 'high_impact'
  )),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  category text not null default 'adoption',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.users (id) on delete set null
);

create index if not exists app_portal_customer_success_recommendations_company_idx
  on public.app_portal_customer_success_recommendations (company_id, status, priority, created_at desc);

create table if not exists public.app_portal_customer_success_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_customer_success_audit_idx
  on public.app_portal_customer_success_audit_logs (company_id, created_at desc);

alter table public.app_portal_customer_success_state enable row level security;
alter table public.app_portal_customer_success_milestones enable row level security;
alter table public.app_portal_customer_success_recommendations enable row level security;
alter table public.app_portal_customer_success_audit_logs enable row level security;
revoke all on public.app_portal_customer_success_state from authenticated, anon;
revoke all on public.app_portal_customer_success_milestones from authenticated, anon;
revoke all on public.app_portal_customer_success_recommendations from authenticated, anon;
revoke all on public.app_portal_customer_success_audit_logs from authenticated, anon;

create or replace function public._acsc295_access_context()
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
    'can_admin', v_role in ('organization_owner', 'organization_admin'),
    'is_member', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._acsc295_milestone_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'first_employee_invited', 'title', 'First employee invited'),
    jsonb_build_object('key', 'first_business_pack_installed', 'title', 'First Business Pack installed'),
    jsonb_build_object('key', 'first_integration_connected', 'title', 'First integration connected'),
    jsonb_build_object('key', 'first_certification_earned', 'title', 'First certification earned'),
    jsonb_build_object('key', 'first_team_training_completed', 'title', 'First team training completed'),
    jsonb_build_object('key', 'governance_setup_completed', 'title', 'Governance setup completed'),
    jsonb_build_object('key', 'security_configuration_completed', 'title', 'Security configuration completed')
  );
$$;

create or replace function public._acsc295_org_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_2fa_count integer := 0;
  v_packs integer := 0;
  v_integrations integer := 0;
  v_connected integer := 0;
  v_academy_completions integer := 0;
  v_academy_certs integer := 0;
  v_academy_assignments_done integer := 0;
  v_operations_records integer := 0;
  v_compliance_records integer := 0;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int into v_packs
    from public.tenant_modules tm
    where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*)::int, count(*) filter (where ic.status = 'connected')::int
    into v_integrations, v_connected
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_completions') is not null then
    select count(*)::int into v_academy_completions
    from public.app_portal_academy_completions co where co.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_academy_certifications') is not null then
    select count(*)::int into v_academy_certs
    from public.app_portal_academy_certifications ce
    where ce.company_id = p_company_id and ce.status = 'earned';
  end if;

  if to_regclass('public.app_portal_academy_assignments') is not null then
    select count(*)::int into v_academy_assignments_done
    from public.app_portal_academy_assignments a
    where a.company_id = p_company_id and a.status = 'completed';
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_briefings') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_briefings where company_id = p_company_id);
  end if;
  if to_regclass('public.app_portal_strategy_initiatives') is not null then
    v_operations_records := v_operations_records + (select count(*)::int from public.app_portal_strategy_initiatives where company_id = p_company_id);
  end if;

  if to_regclass('public.app_portal_compliance_policies') is not null then
    select count(*)::int into v_compliance_records
    from public.app_portal_compliance_policies cp where cp.company_id = p_company_id;
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'two_fa_count', v_2fa_count,
    'packs', v_packs,
    'integrations', v_integrations,
    'connected_integrations', v_connected,
    'academy_completions', v_academy_completions,
    'academy_certifications', v_academy_certs,
    'team_training_completed', v_academy_assignments_done,
    'operations_records', v_operations_records,
    'compliance_records', v_compliance_records
  );
end;
$$;

create or replace function public._acsc295_sync_milestones(p_company_id uuid, p_metrics jsonb, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_checks jsonb := jsonb_build_array(
    jsonb_build_object('key', 'first_employee_invited', 'done', (p_metrics->>'team_count')::int > 1),
    jsonb_build_object('key', 'first_business_pack_installed', 'done', (p_metrics->>'packs')::int >= 1),
    jsonb_build_object('key', 'first_integration_connected', 'done', (p_metrics->>'connected_integrations')::int >= 1),
    jsonb_build_object('key', 'first_certification_earned', 'done', (p_metrics->>'academy_certifications')::int >= 1),
    jsonb_build_object('key', 'first_team_training_completed', 'done', (p_metrics->>'team_training_completed')::int >= 1),
    jsonb_build_object('key', 'governance_setup_completed', 'done', (p_metrics->>'compliance_records')::int >= 1),
    jsonb_build_object('key', 'security_configuration_completed', 'done', (p_metrics->>'two_fa_count')::int > 0)
  );
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(v_checks)
  loop
    if (v_item->>'done')::boolean then
      insert into public.app_portal_customer_success_milestones (company_id, milestone_key, auto_detected, achieved_by)
      values (p_company_id, v_item->>'key', true, p_user_id)
      on conflict (company_id, milestone_key) do nothing;
    end if;
  end loop;
end;
$$;

create or replace function public._acsc295_category_scores(p_metrics jsonb, p_journey_started boolean)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_team integer := greatest(1, (p_metrics->>'team_count')::int);
  v_learning integer;
  v_features integer;
  v_engagement integer;
  v_operational integer;
  v_security integer;
  v_integration integer;
  v_feature_modules integer := 0;
begin
  v_learning := least(100, round(((p_metrics->>'academy_completions')::numeric / 14) * 100)::int);
  if (p_metrics->>'operations_records')::int > 0 then v_feature_modules := v_feature_modules + 1; end if;
  if (p_metrics->>'packs')::int > 0 then v_feature_modules := v_feature_modules + 1; end if;
  if (p_metrics->>'connected_integrations')::int > 0 then v_feature_modules := v_feature_modules + 1; end if;
  if (p_metrics->>'academy_completions')::int > 0 then v_feature_modules := v_feature_modules + 1; end if;
  if (p_metrics->>'compliance_records')::int > 0 then v_feature_modules := v_feature_modules + 1; end if;
  v_features := least(100, v_feature_modules * 20);

  v_engagement := least(100, round(((p_metrics->>'two_fa_count')::numeric / v_team) * 50
    + least(50, (p_metrics->>'academy_completions')::numeric * 3))::int);

  v_operational := least(100, round(least(100, (p_metrics->>'operations_records')::numeric * 8))::int);
  v_security := case when (p_metrics->>'two_fa_count')::int = 0 then 10
    else least(100, round(((p_metrics->>'two_fa_count')::numeric / v_team) * 100)::int) end;
  v_integration := case when (p_metrics->>'connected_integrations')::int = 0 then 0
    else least(100, 40 + (p_metrics->>'connected_integrations')::int * 20) end;

  if not p_journey_started then
    v_learning := 0; v_features := 0; v_engagement := 0; v_operational := 0; v_security := 0; v_integration := 0;
  end if;

  return jsonb_build_object(
    'learning_completion', v_learning,
    'feature_adoption', v_features,
    'user_engagement', v_engagement,
    'operational_maturity', v_operational,
    'security_completion', v_security,
    'integration_usage', v_integration
  );
end;
$$;

create or replace function public._acsc295_success_status(p_score integer)
returns text
language sql
immutable
as $$
  select case
    when p_score >= 85 then 'high_performing'
    when p_score >= 70 then 'advanced'
    when p_score >= 50 then 'established'
    when p_score >= 25 then 'developing'
    else 'getting_started'
  end;
$$;

create or replace function public._acsc295_maturity_stage(p_score integer)
returns jsonb
language sql
immutable
as $$
  select case
    when p_score >= 85 then jsonb_build_object('stage', 5, 'key', 'transformational')
    when p_score >= 70 then jsonb_build_object('stage', 4, 'key', 'strategic')
    when p_score >= 50 then jsonb_build_object('stage', 3, 'key', 'optimized')
    when p_score >= 25 then jsonb_build_object('stage', 2, 'key', 'operational')
    else jsonb_build_object('stage', 1, 'key', 'getting_started')
  end;
$$;

create or replace function public._acsc295_build_recommendations(p_metrics jsonb, p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_team integer := greatest(1, (p_metrics->>'team_count')::int);
begin
  if (p_metrics->>'two_fa_count')::int < v_team then
    v_recs := v_recs || jsonb_build_object('id', '2fa-all', 'key', 'activate2faAllUsers', 'priority', 'high_impact', 'category', 'security');
  end if;
  if (p_metrics->>'academy_completions')::int < 3 then
    v_recs := v_recs || jsonb_build_object('id', 'onboarding-training', 'key', 'completeOnboardingTraining', 'priority', 'important', 'category', 'learning');
  end if;
  if (p_metrics->>'packs')::int < 2 then
    v_recs := v_recs || jsonb_build_object('id', 'unused-packs', 'key', 'exploreUnusedBusinessPacks', 'priority', 'recommended', 'category', 'adoption');
  end if;
  if (p_metrics->>'connected_integrations')::int = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'connect-integrations', 'key', 'connectIntegrations', 'priority', 'important', 'category', 'integration');
  end if;
  if (p_metrics->>'operations_records')::int < 3 then
    v_recs := v_recs || jsonb_build_object('id', 'review-dashboards', 'key', 'reviewOperationalDashboards', 'priority', 'recommended', 'category', 'operations');
  end if;
  if (p_metrics->>'academy_certifications')::int = 0 then
    v_recs := v_recs || jsonb_build_object('id', 'certifications', 'key', 'encourageCertification', 'priority', 'opportunity', 'category', 'learning');
  end if;

  return v_recs;
end;
$$;

create or replace function public.begin_app_portal_customer_success_journey()
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
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_customer_success_state (company_id, journey_started_at, updated_by)
  values (v_company_id, now(), v_user_id)
  on conflict (company_id) do update set
    journey_started_at = coalesce(public.app_portal_customer_success_state.journey_started_at, now()),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_customer_success_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'journey_started', 'Customer success journey began', v_user_id);

  return public.list_app_portal_customer_success(null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_customer_success(
  p_department text default null,
  p_category text default null,
  p_priority text default null,
  p_success_status text default null,
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
  v_journey_started timestamptz;
  v_metrics jsonb;
  v_categories jsonb;
  v_adoption integer;
  v_utilization integer;
  v_status text;
  v_maturity jsonb;
  v_milestones jsonb := '[]'::jsonb;
  v_recs jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_improved jsonb := '[]'::jsonb;
  v_attention jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_insights jsonb;
  v_personal jsonb := '{}'::jsonb;
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select cs.journey_started_at into v_journey_started
  from public.app_portal_customer_success_state cs where cs.company_id = v_company_id;

  v_metrics := public._acsc295_org_metrics(v_company_id);
  if v_journey_started is not null then
    perform public._acsc295_sync_milestones(v_company_id, v_metrics, v_user_id);
  end if;

  v_categories := public._acsc295_category_scores(v_metrics, v_journey_started is not null);
  v_adoption := round((
    (v_categories->>'learning_completion')::numeric +
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'user_engagement')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'security_completion')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 6)::int;
  v_utilization := round((
    (v_categories->>'feature_adoption')::numeric +
    (v_categories->>'operational_maturity')::numeric +
    (v_categories->>'integration_usage')::numeric
  ) / 3)::int;
  v_status := public._acsc295_success_status(v_adoption);
  v_maturity := public._acsc295_maturity_stage(v_adoption);

  if p_success_status is not null and v_status <> p_success_status then
    return jsonb_build_object('found', true, 'filtered_out', true, 'journey_started', v_journey_started is not null);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', m.milestone_key,
    'title', cat->>'title',
    'achieved_at', m.achieved_at,
    'auto_detected', m.auto_detected
  ) order by m.achieved_at desc), '[]'::jsonb)
  into v_milestones
  from public.app_portal_customer_success_milestones m
  cross join lateral (
    select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c
    where c->>'key' = m.milestone_key limit 1
  ) cat
  where m.company_id = v_company_id
    and (p_period_from is null or m.achieved_at::date >= p_period_from);

  v_recs := public._acsc295_build_recommendations(v_metrics, v_company_id);

  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_timeline
  from public.app_portal_customer_success_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from)
  limit 20;

  v_timeline := v_timeline || (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', 'ms-' || m.milestone_key, 'event_type', 'milestone', 'description', cat->>'title', 'created_at', m.achieved_at
    ) order by m.achieved_at desc), '[]'::jsonb)
    from public.app_portal_customer_success_milestones m
    cross join lateral (
      select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c where c->>'key' = m.milestone_key limit 1
    ) cat
    where m.company_id = v_company_id
  );

  if (v_categories->>'learning_completion')::int >= 50 then
    v_improved := v_improved || jsonb_build_object('id', 'learning', 'text', 'Learning completion is progressing well.');
  end if;
  if (v_metrics->>'operations_records')::int >= 5 then
    v_improved := v_improved || jsonb_build_object('id', 'operations', 'text', 'Operational module usage is increasing.');
  end if;

  if (v_categories->>'security_completion')::int < 50 then
    v_attention := v_attention || jsonb_build_object('id', 'security', 'text', 'Security configuration requires attention.');
  end if;
  if (v_categories->>'integration_usage')::int < 30 then
    v_attention := v_attention || jsonb_build_object('id', 'integration', 'text', 'Integration usage remains low.');
  end if;

  v_opportunities := v_recs;

  v_insights := jsonb_build_object(
    'features_frequently_used', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Operations modules' as x where (v_metrics->>'operations_records')::int > 0
        union all select 'Academy learning' where (v_metrics->>'academy_completions')::int > 0
        union all select 'Integrations' where (v_metrics->>'connected_integrations')::int > 0
      ) s
    ),
    'features_rarely_used', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Business Packs' as x where (v_metrics->>'packs')::int = 0
        union all select 'Integrations' where (v_metrics->>'connected_integrations')::int = 0
        union all select 'Certifications' where (v_metrics->>'academy_certifications')::int = 0
      ) s
    ),
    'teams_high_engagement', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Teams completing assigned training' as x where (v_metrics->>'team_training_completed')::int > 0
      ) s
    ),
    'teams_requiring_support', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Security adoption' as x where (v_categories->>'security_completion')::int < 50
      ) s
    ),
    'training_opportunities', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Getting Started courses' as x where (v_metrics->>'academy_completions')::int < 5
      ) s
    ),
    'security_recommendations', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select 'Activate 2FA for all users' as x
        where (v_metrics->>'two_fa_count')::int < (v_metrics->>'team_count')::int
      ) s
    )
  );

  if to_regclass('public.app_portal_academy_completions') is not null then
    select jsonb_build_object(
      'courses_completed', count(*)::int,
      'certifications', coalesce((
        select count(*)::int from public.app_portal_academy_certifications ce
        where ce.company_id = v_company_id and ce.user_id = v_user_id and ce.status = 'earned'
      ), 0)
    ) into v_personal
    from public.app_portal_academy_completions co
    where co.company_id = v_company_id and co.user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'journey_started', v_journey_started is not null,
    'adoption_score', v_adoption,
    'utilization_score', v_utilization,
    'success_status', v_status,
    'maturity', v_maturity,
    'category_scores', v_categories,
    'milestones_achieved', v_milestones,
    'recently_improved', v_improved,
    'areas_requiring_attention', v_attention,
    'upcoming_opportunities', v_opportunities,
    'recommendations', v_recs,
    'timeline', v_timeline,
    'adoption_insights', v_insights,
    'personal_progress', v_personal,
    'team_reporting', case when coalesce(v_ctx->>'can_manage', 'false') = 'true' then jsonb_build_object(
      'team_count', v_metrics->>'team_count',
      'two_fa_adoption_percent', case when (v_metrics->>'team_count')::int > 0
        then round(((v_metrics->>'two_fa_count')::numeric / (v_metrics->>'team_count')::int) * 100)::int else 0 end,
      'learning_completions', v_metrics->>'academy_completions'
    ) else null end,
    'principle', 'Aipify provides recommendations and insights — organizations remain responsible for implementation.'
  );
end;
$$;

create or replace function public.list_app_portal_customer_success_milestones(
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
  v_items jsonb := '[]'::jsonb;
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  perform public._acsc295_sync_milestones(v_company_id, public._acsc295_org_metrics(v_company_id), (v_ctx->>'user_id')::uuid);

  select coalesce(jsonb_agg(jsonb_build_object(
    'key', m.milestone_key, 'title', cat->>'title', 'achieved_at', m.achieved_at, 'auto_detected', m.auto_detected
  ) order by m.achieved_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_customer_success_milestones m
  cross join lateral (
    select c as cat from jsonb_array_elements(public._acsc295_milestone_catalog()) c where c->>'key' = m.milestone_key limit 1
  ) cat
  where m.company_id = v_company_id
    and (p_period_from is null or m.achieved_at::date >= p_period_from)
    and (p_search is null or trim(p_search) = '' or cat->>'title' ilike '%' || trim(p_search) || '%');

  return jsonb_build_object('found', true, 'milestones', v_items, 'catalog', public._acsc295_milestone_catalog());
end;
$$;

create or replace function public.list_app_portal_customer_success_recommendations(
  p_priority text default null,
  p_category text default null,
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
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_recs := public._acsc295_build_recommendations(public._acsc295_org_metrics(v_company_id), v_company_id);

  if p_priority is not null or p_category is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_category is null or r->>'category' = p_category)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end;
$$;

create or replace function public.get_app_portal_customer_success_adoption(
  p_department text default null
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
  v_metrics jsonb;
  v_categories jsonb;
  v_journey boolean;
begin
  v_ctx := public._acsc295_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_metrics := public._acsc295_org_metrics(v_company_id);
  select cs.journey_started_at is not null into v_journey
  from public.app_portal_customer_success_state cs where cs.company_id = v_company_id;
  v_categories := public._acsc295_category_scores(v_metrics, coalesce(v_journey, false));

  return jsonb_build_object(
    'found', true,
    'metrics', v_metrics,
    'category_scores', v_categories,
    'adoption_insights', (public.list_app_portal_customer_success(p_department, null, null, null, null, null)->'adoption_insights')
  );
end;
$$;

grant execute on function public.list_app_portal_customer_success(text, text, text, text, date, text) to authenticated;
grant execute on function public.list_app_portal_customer_success_milestones(date, text) to authenticated;
grant execute on function public.list_app_portal_customer_success_recommendations(text, text, text) to authenticated;
grant execute on function public.get_app_portal_customer_success_adoption(text) to authenticated;
grant execute on function public.begin_app_portal_customer_success_journey() to authenticated;

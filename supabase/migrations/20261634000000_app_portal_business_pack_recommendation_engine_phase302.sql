-- Phase 302 (APP) — Business Pack Recommendation Engine

create table if not exists public.app_portal_business_pack_recommendation_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  member_access_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_business_pack_saved_recommendations (
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  saved_by uuid references public.users (id) on delete set null,
  saved_at timestamptz not null default now(),
  primary key (company_id, pack_key, saved_by)
);

create index if not exists app_portal_business_pack_saved_recommendations_idx
  on public.app_portal_business_pack_saved_recommendations (company_id, saved_at desc);

create table if not exists public.app_portal_business_pack_dismissed_recommendations (
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  dismissed_by uuid references public.users (id) on delete set null,
  dismissed_at timestamptz not null default now(),
  primary key (company_id, pack_key)
);

create table if not exists public.app_portal_business_pack_recommendation_views (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_key text not null,
  viewed_by uuid references public.users (id) on delete set null,
  viewed_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_recommendation_views_idx
  on public.app_portal_business_pack_recommendation_views (company_id, viewed_at desc);

create table if not exists public.app_portal_business_pack_comparison_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  pack_keys jsonb not null default '[]'::jsonb,
  compared_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_comparison_history_idx
  on public.app_portal_business_pack_comparison_history (company_id, created_at desc);

create table if not exists public.app_portal_business_pack_recommendation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_business_pack_recommendation_audit_idx
  on public.app_portal_business_pack_recommendation_audit_logs (company_id, created_at desc);

alter table public.app_portal_business_pack_recommendation_state enable row level security;
alter table public.app_portal_business_pack_saved_recommendations enable row level security;
alter table public.app_portal_business_pack_dismissed_recommendations enable row level security;
alter table public.app_portal_business_pack_recommendation_views enable row level security;
alter table public.app_portal_business_pack_comparison_history enable row level security;
alter table public.app_portal_business_pack_recommendation_audit_logs enable row level security;
revoke all on public.app_portal_business_pack_recommendation_state from authenticated, anon;
revoke all on public.app_portal_business_pack_saved_recommendations from authenticated, anon;
revoke all on public.app_portal_business_pack_dismissed_recommendations from authenticated, anon;
revoke all on public.app_portal_business_pack_recommendation_views from authenticated, anon;
revoke all on public.app_portal_business_pack_comparison_history from authenticated, anon;
revoke all on public.app_portal_business_pack_recommendation_audit_logs from authenticated, anon;

insert into public.app_portal_business_pack_recommendation_state (company_id)
select c.id
from public.companies c
where exists (select 1 from public.customers cu where cu.company_id = c.id)
  and not exists (
    select 1
    from public.app_portal_business_pack_recommendation_state rs
    where rs.company_id = c.id
  )
on conflict (company_id) do nothing;

create or replace function public._abpre302_access_context()
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

  select coalesce(rs.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_recommendation_state rs
  where rs.company_id = (v_access->>'company_id')::uuid;

  if v_role = 'organization_member' and not v_member_enabled then
    raise exception 'Business Pack recommendations require organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', v_role in ('organization_owner', 'organization_admin'),
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_view', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._abpre302_pack_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('pack_key', 'aipify_hosts', 'name', 'Aipify Hosts', 'category', 'operational', 'industry', 'general', 'complexity', 'moderate', 'impact', 'meaningful_improvement', 'confidence', 'strong_match', 'reason_key', 'similarOrganizationsInstall', 'benefits_key', 'hostsBenefits', 'features', jsonb_build_array('Host management', 'Deployment visibility', 'Operational coordination'), 'suggested_users', 'Operations teams', 'audience', 'Operations leaders', 'related', jsonb_build_array('support_operations', 'governance')),
    jsonb_build_object('pack_key', 'governance', 'name', 'Governance', 'category', 'security', 'industry', 'general', 'complexity', 'advanced', 'impact', 'high_business_impact', 'confidence', 'highly_relevant', 'reason_key', 'securityPostureBenefit', 'benefits_key', 'governanceBenefits', 'features', jsonb_build_array('Policy controls', 'Approval workflows', 'Audit visibility'), 'suggested_users', 'Administrators', 'audience', 'Governance teams', 'related', jsonb_build_array('executive_intelligence')),
    jsonb_build_object('pack_key', 'commerce_intelligence', 'name', 'Commerce Intelligence', 'category', 'efficiency', 'industry', 'commerce', 'complexity', 'moderate', 'impact', 'meaningful_improvement', 'confidence', 'suggested', 'reason_key', 'complementsExisting', 'benefits_key', 'commerceBenefits', 'features', jsonb_build_array('Commerce insights', 'Trend analysis', 'Operational reporting'), 'suggested_users', 'Commerce teams', 'audience', 'Revenue operations', 'related', jsonb_build_array('analytics')),
    jsonb_build_object('pack_key', 'support_operations', 'name', 'Support Operations', 'category', 'customer_success', 'industry', 'general', 'complexity', 'simple', 'impact', 'incremental_improvement', 'confidence', 'suggested', 'reason_key', 'teamsSimilarNeeds', 'benefits_key', 'supportBenefits', 'features', jsonb_build_array('Support triage', 'Knowledge guidance', 'Case visibility'), 'suggested_users', 'Support teams', 'audience', 'Customer support leaders', 'related', jsonb_build_array('aipify_hosts')),
    jsonb_build_object('pack_key', 'executive_intelligence', 'name', 'Executive Intelligence', 'category', 'executive', 'industry', 'general', 'complexity', 'advanced', 'impact', 'strategic_transformation', 'confidence', 'exploratory', 'reason_key', 'maturityReadiness', 'benefits_key', 'executiveBenefits', 'features', jsonb_build_array('Executive briefings', 'Strategic visibility', 'Decision support'), 'suggested_users', 'Executives', 'audience', 'Leadership teams', 'related', jsonb_build_array('governance', 'analytics')),
    jsonb_build_object('pack_key', 'analytics', 'name', 'Analytics', 'category', 'operational', 'industry', 'general', 'complexity', 'moderate', 'impact', 'meaningful_improvement', 'confidence', 'strong_match', 'reason_key', 'operationalMaturity', 'benefits_key', 'analyticsBenefits', 'features', jsonb_build_array('Operational metrics', 'Trend dashboards', 'Reporting'), 'suggested_users', 'Analysts', 'audience', 'Operations managers', 'related', jsonb_build_array('commerce_intelligence')),
    jsonb_build_object('pack_key', 'workflows', 'name', 'Workflows', 'category', 'efficiency', 'industry', 'general', 'complexity', 'simple', 'impact', 'incremental_improvement', 'confidence', 'suggested', 'reason_key', 'complementsExisting', 'benefits_key', 'workflowsBenefits', 'features', jsonb_build_array('Process automation', 'Task routing', 'Operational consistency'), 'suggested_users', 'Operations staff', 'audience', 'Process owners', 'related', jsonb_build_array('support_operations'))
  );
$$;

create or replace function public._abpre302_org_context(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_packs integer := 0;
  v_installed jsonb := '[]'::jsonb;
  v_integrations integer := 0;
  v_operations integer := 0;
  v_maturity integer := 40;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.tenant_modules') is not null then
    select count(*)::int,
           coalesce(jsonb_agg(tm.module_key), '[]'::jsonb)
    into v_packs, v_installed
    from public.tenant_modules tm
    where tm.company_id = p_company_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*) filter (where ic.status = 'connected')::int into v_integrations
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_commitments') is not null then
    v_operations := v_operations + (select count(*)::int from public.app_portal_commitments where company_id = p_company_id);
  end if;

  v_maturity := least(100, 20 + v_packs * 12 + v_team_count * 3 + v_integrations * 8 + v_operations);

  return jsonb_build_object(
    'team_count', v_team_count,
    'packs_installed', v_packs,
    'installed_keys', v_installed,
    'integrations', v_integrations,
    'maturity_score', v_maturity
  );
end;
$$;

create or replace function public._abpre302_score_pack(p_pack jsonb, p_ctx jsonb, p_installed jsonb)
returns integer
language plpgsql
immutable
as $$
declare
  v_score integer := 0;
  v_key text := p_pack->>'pack_key';
begin
  if exists(
    select 1 from jsonb_array_elements_text(coalesce(p_installed, '[]'::jsonb)) k where k = v_key
  ) then return 0; end if;

  v_score := case p_pack->>'confidence'
    when 'highly_relevant' then 85
    when 'strong_match' then 70
    when 'suggested' then 55
    else 40
  end;

  if (p_ctx->>'maturity_score')::int >= 60 and p_pack->>'category' in ('executive', 'security') then
    v_score := v_score + 10;
  end if;
  if (p_ctx->>'packs_installed')::int >= 1 and p_pack->>'reason_key' = 'complementsExisting' then
    v_score := v_score + 8;
  end if;
  if (p_ctx->>'team_count')::int >= 5 then v_score := v_score + 5; end if;

  return least(100, v_score);
end;
$$;

create or replace function public._abpre302_build_recommendations(p_company_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_ctx jsonb;
  v_installed jsonb;
  v_dismissed jsonb := '[]'::jsonb;
  v_items jsonb := '[]'::jsonb;
  v_pack jsonb;
  v_score integer;
  v_saved boolean;
begin
  v_ctx := public._abpre302_org_context(p_company_id);
  v_installed := coalesce(v_ctx->'installed_keys', '[]'::jsonb);

  select coalesce(jsonb_agg(d.pack_key), '[]'::jsonb) into v_dismissed
  from public.app_portal_business_pack_dismissed_recommendations d
  where d.company_id = p_company_id;

  for v_pack in select p from jsonb_array_elements(public._abpre302_pack_catalog()) p loop
    if exists(
      select 1 from jsonb_array_elements_text(v_dismissed) k where k = v_pack->>'pack_key'
    ) then continue; end if;

    v_score := public._abpre302_score_pack(v_pack, v_ctx, v_installed);
    if v_score <= 0 then continue; end if;

    select exists(
      select 1 from public.app_portal_business_pack_saved_recommendations s
      where s.company_id = p_company_id and s.pack_key = v_pack->>'pack_key' and s.saved_by = p_user_id
    ) into v_saved;

    v_items := v_items || jsonb_build_object(
      'id', v_pack->>'pack_key',
      'pack_key', v_pack->>'pack_key',
      'name', v_pack->>'name',
      'category', v_pack->>'category',
      'industry', v_pack->>'industry',
      'confidence_level', v_pack->>'confidence',
      'confidence_score', v_score,
      'complexity', v_pack->>'complexity',
      'business_impact', v_pack->>'impact',
      'reason_key', v_pack->>'reason_key',
      'benefits_key', v_pack->>'benefits_key',
      'suggested_users', v_pack->>'suggested_users',
      'related_packs', v_pack->'related',
      'installed', false,
      'saved', v_saved
    );
  end loop;

  return v_items;
end;
$$;

create or replace function public._abpre302_filter_items(
  p_items jsonb,
  p_industry text,
  p_category text,
  p_complexity text,
  p_impact text,
  p_confidence text,
  p_installed_status text,
  p_search text
)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_result jsonb := '[]'::jsonb;
begin
  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_result from (
    select r from jsonb_array_elements(p_items) r
    where (p_industry is null or r->>'industry' = p_industry)
      and (p_category is null or r->>'category' = p_category)
      and (p_complexity is null or r->>'complexity' = p_complexity)
      and (p_impact is null or r->>'business_impact' = p_impact)
      and (p_confidence is null or r->>'confidence_level' = p_confidence)
      and (p_installed_status is null or p_installed_status = 'all'
        or (p_installed_status = 'installed' and (r->>'installed')::boolean = true)
        or (p_installed_status = 'not_installed' and coalesce((r->>'installed')::boolean, false) = false))
      and (p_search is null or trim(p_search) = ''
        or r->>'name' ilike '%' || trim(p_search) || '%'
        or r->>'pack_key' ilike '%' || trim(p_search) || '%')
  ) sub;
  return v_result;
end;
$$;

create or replace function public.list_app_portal_business_pack_recommendation_engine(
  p_industry text default null,
  p_category text default null,
  p_complexity text default null,
  p_business_impact text default null,
  p_confidence_level text default null,
  p_installed_status text default null,
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
  v_items jsonb;
  v_filtered jsonb;
  v_installed jsonb := '[]'::jsonb;
  v_saved jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_categories jsonb := '[]'::jsonb;
begin
  v_ctx := public._abpre302_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_items := public._abpre302_build_recommendations(v_company_id, v_user_id);
  v_filtered := public._abpre302_filter_items(
    v_items, p_industry, p_category, p_complexity, p_business_impact,
    p_confidence_level, p_installed_status, p_search
  );

  if to_regclass('public.tenant_modules') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', tm.module_key, 'name', initcap(replace(tm.module_key, '_', ' ')), 'status', tm.status
    )), '[]'::jsonb)
    into v_installed
    from public.tenant_modules tm
    where tm.company_id = v_company_id and tm.status in ('enabled', 'trial', 'beta');
  end if;

  if coalesce(v_ctx->>'can_full', 'false') = 'true' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', s.pack_key, 'saved_at', s.saved_at
    ) order by s.saved_at desc), '[]'::jsonb)
    into v_saved
    from public.app_portal_business_pack_saved_recommendations s
    where s.company_id = v_company_id and s.saved_by = v_user_id;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('pack_key', rv.pack_key, 'viewed_at', rv.viewed_at)), '[]'::jsonb)
  into v_recent
  from (
    select v.pack_key, max(v.viewed_at) as viewed_at
    from public.app_portal_business_pack_recommendation_views v
    where v.company_id = v_company_id and v.viewed_by = v_user_id
    group by v.pack_key
    order by max(v.viewed_at) desc
    limit 5
  ) rv;

  select coalesce(jsonb_agg(distinct r->>'category'), '[]'::jsonb) into v_categories
  from jsonb_array_elements(v_filtered) r;

  return jsonb_build_object(
    'found', true,
    'can_full', coalesce(v_ctx->>'can_full', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_view', coalesce(v_ctx->>'can_view', 'false') = 'true',
    'has_recommendations', jsonb_array_length(v_filtered) > 0,
    'recommendations', v_filtered,
    'installed_packs', v_installed,
    'saved_recommendations', v_saved,
    'recently_viewed', v_recent,
    'operational_categories', v_categories,
    'principle', 'Aipify provides advisory recommendations — organizations always decide what to install.'
  );
end;
$$;

create or replace function public.get_app_portal_business_pack_recommendation_detail(p_pack_key text)
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
  v_pack jsonb;
  v_item jsonb;
  v_saved boolean := false;
begin
  v_ctx := public._abpre302_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select p into v_pack
  from jsonb_array_elements(public._abpre302_pack_catalog()) p
  where p->>'pack_key' = p_pack_key
  limit 1;

  if v_pack is null then
    return jsonb_build_object('found', false);
  end if;

  select r into v_item
  from jsonb_array_elements(public._abpre302_build_recommendations(v_company_id, v_user_id)) r
  where r->>'pack_key' = p_pack_key
  limit 1;

  if v_item is null then
    v_item := jsonb_build_object(
      'id', v_pack->>'pack_key',
      'pack_key', v_pack->>'pack_key',
      'name', v_pack->>'name',
      'category', v_pack->>'category',
      'confidence_level', v_pack->>'confidence',
      'complexity', v_pack->>'complexity',
      'business_impact', v_pack->>'impact',
      'reason_key', v_pack->>'reason_key',
      'benefits_key', v_pack->>'benefits_key',
      'suggested_users', v_pack->>'suggested_users',
      'related_packs', v_pack->'related',
      'installed', false
    );
  end if;

  select exists(
    select 1 from public.app_portal_business_pack_saved_recommendations s
    where s.company_id = v_company_id and s.pack_key = p_pack_key and s.saved_by = v_user_id
  ) into v_saved;

  return v_item || jsonb_build_object(
    'found', true,
    'saved', v_saved,
    'features', v_pack->'features',
    'recommended_audience', v_pack->>'audience',
    'can_save', coalesce(v_ctx->>'can_full', 'false') = 'true'
  );
end;
$$;

create or replace function public.save_app_portal_business_pack_recommendation(p_pack_key text)
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
  v_ctx := public._abpre302_access_context();
  if coalesce(v_ctx->>'can_full', 'false') <> 'true' then
    raise exception 'Saving recommendations requires owner or administrator access';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_business_pack_saved_recommendations (company_id, pack_key, saved_by)
  values (v_company_id, p_pack_key, v_user_id)
  on conflict (company_id, pack_key, saved_by) do update set saved_at = now();

  insert into public.app_portal_business_pack_recommendation_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'recommendation_saved', 'Business Pack recommendation saved', v_user_id, jsonb_build_object('pack_key', p_pack_key));

  return public.list_app_portal_business_pack_recommendation_engine(null, null, null, null, null, null, null);
end;
$$;

create or replace function public.dismiss_app_portal_business_pack_recommendation(p_pack_key text)
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
  v_ctx := public._abpre302_access_context();
  if coalesce(v_ctx->>'can_full', 'false') <> 'true' and coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Dismissing recommendations requires manager authorization or higher';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_business_pack_dismissed_recommendations (company_id, pack_key, dismissed_by)
  values (v_company_id, p_pack_key, v_user_id)
  on conflict (company_id, pack_key) do update set dismissed_at = now(), dismissed_by = v_user_id;

  insert into public.app_portal_business_pack_recommendation_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'recommendation_dismissed', 'Business Pack recommendation dismissed', v_user_id, jsonb_build_object('pack_key', p_pack_key));

  return public.list_app_portal_business_pack_recommendation_engine(null, null, null, null, null, null, null);
end;
$$;

create or replace function public.compare_app_portal_business_pack_recommendations(p_pack_keys jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_key text;
  v_pack jsonb;
begin
  v_ctx := public._abpre302_access_context();
  if coalesce(v_ctx->>'can_full', 'false') <> 'true' then
    raise exception 'Comparing recommendations requires owner or administrator access';
  end if;

  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  for v_key in select jsonb_array_elements_text(coalesce(p_pack_keys, '[]'::jsonb)) loop
    select p into v_pack from jsonb_array_elements(public._abpre302_pack_catalog()) p where p->>'pack_key' = v_key limit 1;
    if v_pack is not null then
      v_items := v_items || jsonb_build_object(
        'pack_key', v_pack->>'pack_key',
        'name', v_pack->>'name',
        'features', v_pack->'features',
        'benefits_key', v_pack->>'benefits_key',
        'complexity', v_pack->>'complexity',
        'business_impact', v_pack->>'impact',
        'recommended_audience', v_pack->>'audience',
        'related_packs', v_pack->'related'
      );
    end if;
  end loop;

  insert into public.app_portal_business_pack_comparison_history (company_id, pack_keys, compared_by)
  values (v_company_id, coalesce(p_pack_keys, '[]'::jsonb), v_user_id);

  insert into public.app_portal_business_pack_recommendation_audit_logs (company_id, event_type, description, performed_by, metadata)
  values (v_company_id, 'recommendations_compared', 'Business Pack recommendations compared', v_user_id, jsonb_build_object('pack_keys', p_pack_keys));

  return jsonb_build_object('found', true, 'comparison', v_items);
end;
$$;

grant execute on function public.list_app_portal_business_pack_recommendation_engine(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.get_app_portal_business_pack_recommendation_detail(text) to authenticated;
grant execute on function public.save_app_portal_business_pack_recommendation(text) to authenticated;
grant execute on function public.dismiss_app_portal_business_pack_recommendation(text) to authenticated;
grant execute on function public.compare_app_portal_business_pack_recommendations(jsonb) to authenticated;

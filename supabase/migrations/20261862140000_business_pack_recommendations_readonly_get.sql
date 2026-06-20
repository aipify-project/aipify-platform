-- Phase 620 P1 — Business Pack Recommendations read-only GET/list repair.
-- Root cause: list_app_portal_business_pack_recommendation_engine (STABLE) performed
-- settings initialization INSERT on every list call.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('business_recommendations.view', 'View Business Recommendations', null, 'View Business Pack recommendation engine'),
  ('business_recommendations.manage', 'Manage Business Recommendations', null, 'Save, dismiss, and compare Business Pack recommendations')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_recommendations.view'),
  ('owner', 'business_recommendations.manage'),
  ('administrator', 'business_recommendations.view'),
  ('administrator', 'business_recommendations.manage'),
  ('manager', 'business_recommendations.view'),
  ('manager', 'business_recommendations.manage'),
  ('support_agent', 'business_recommendations.view'),
  ('viewer', 'business_recommendations.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

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
  v_member_enabled boolean := true;
  v_company_id uuid;
begin
  if not public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.view';
  end if;

  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_company_id := (v_access->>'company_id')::uuid;

  select coalesce(rs.member_access_enabled, true) into v_member_enabled
  from public.app_portal_business_pack_recommendation_state rs
  where rs.company_id = v_company_id;

  if public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage')
     and not v_member_enabled then
    raise exception 'Business Pack recommendations require organization authorization';
  end if;

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_full', public.has_organization_permission('business_recommendations.manage'),
    'can_manage', public.has_organization_permission('business_recommendations.manage'),
    'can_view', public.has_organization_permission('business_recommendations.view')
      or public.has_organization_permission('business_recommendations.manage')
  );
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
  if not public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.view';
  end if;

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
  if not public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.view';
  end if;

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
  if not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.manage';
  end if;

  v_ctx := public._abpre302_access_context();
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

create or replace function public.record_app_portal_business_pack_recommendation_view(p_pack_key text)
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
begin
  if not public.has_organization_permission('business_recommendations.view')
     and not public.has_organization_permission('business_recommendations.manage') then
    raise exception 'Permission denied: business_recommendations.view';
  end if;

  v_ctx := public._abpre302_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_business_pack_recommendation_views (company_id, pack_key, viewed_by)
  values (v_company_id, p_pack_key, v_user_id);

  return jsonb_build_object('recorded', true, 'pack_key', p_pack_key);
end;
$$;

grant execute on function public.record_app_portal_business_pack_recommendation_view(text) to authenticated;

notify pgrst, 'reload schema';

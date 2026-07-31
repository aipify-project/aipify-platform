-- AIPIFY.APP.PRODUCTION.EXPERIENCE.CONSISTENCY.V1
-- Exclude QA/smoke/probe/example identities and Phase 620 showcase rows
-- from ordinary customer APP list RPCs. Audit and registry rows are preserved.
-- No agreement/license/entitlement/runtime/CMS mutation. No hard deletes.

create or replace function public._app_is_non_production_identity(
  p_email text,
  p_full_name text
)
returns boolean
language sql
immutable
as $$
  select
    case
      when coalesce(nullif(btrim(p_email), ''), '') = ''
        and coalesce(nullif(btrim(p_full_name), ''), '') = ''
        then false
      when lower(coalesce(p_email, '')) ~ '\.invalid$' then true
      when lower(coalesce(p_email, '')) ~ '@example\.com$' then true
      when lower(coalesce(p_email, '')) ~ '@example\.' then true
      when lower(coalesce(p_email, '')) like '%@aipify-gate.invalid' then true
      when lower(coalesce(p_email, '')) like '%aipify-showcase.invalid' then true
      when coalesce(p_full_name, '') ~* '^oaa-debug-' then true
      when coalesce(p_full_name, '') ~* '^oaa-direct-grant-probe-' then true
      when coalesce(p_full_name, '') ~* '^oaa-gate-' then true
      when coalesce(p_full_name, '') ~* '-smoke-viewer-' then true
      when coalesce(p_full_name, '') ~* '-probe-' then true
      when coalesce(p_full_name, '') ~* '^p[0-9]+[a-z]*-smoke-' then true
      else false
    end;
$$;

revoke all on function public._app_is_non_production_identity(text, text) from public, anon, authenticated;
grant execute on function public._app_is_non_production_identity(text, text) to service_role;

create or replace function public._app_is_showcase_record(
  p_organization_id uuid,
  p_table_name text,
  p_record_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_showcase_data_registry r
    where r.organization_id = p_organization_id
      and r.table_name = p_table_name
      and r.record_id = p_record_id
  );
$$;

revoke all on function public._app_is_showcase_record(uuid, text, uuid) from public, anon;
grant execute on function public._app_is_showcase_record(uuid, text, uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Team center — exclude non-production identities from ordinary APP views
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_team_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
begin
  if not public.has_organization_permission('users.view') then
    raise exception 'Permission denied: users.view';
  end if;

  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select c.company_id into v_company_id
  from public.customers c
  where c.id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'members', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', u.id,
        'name', u.full_name,
        'email', coalesce(au.email, ''),
        'role', u.role,
        'status', 'active'
      ) order by u.created_at)
      from public.users u
      left join auth.users au on au.id = u.auth_user_id
      where u.company_id = v_company_id
        and not public._app_is_non_production_identity(coalesce(au.email, ''), coalesce(u.full_name, ''))),
      '[]'::jsonb
    ),
    'invitations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ti.id,
        'email', ti.email,
        'role', ti.role,
        'status', ti.status,
        'created_at', ti.created_at
      ) order by ti.created_at desc)
      from public.team_invitations ti
      where ti.customer_id = v_tenant_id
        and not public._app_is_non_production_identity(coalesce(ti.email, ''), '')),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_customer_team_center() to authenticated;

-- ---------------------------------------------------------------------------
-- External relationships — exclude showcase registry rows
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_external_relationships(
  p_relationship_type text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_criticality text default null,
  p_country text default null,
  p_renewal_before date default null,
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
  v_org_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_active integer := 0;
  v_upcoming integer := 0;
  v_critical integer := 0;
  v_needs_review integer := 0;
  v_no_owner integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  if not public.has_organization_permission('external_relationships.view')
     and not public.has_organization_permission('external_relationships.manage') then
    raise exception 'Permission denied: external_relationships.view';
  end if;

  v_ctx := public._aper281_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  if v_org_id is null then
    select c.id into v_org_id from public.customers c where c.company_id = v_company_id limit 1;
  end if;

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and public._aper281_can_view(r, v_ctx)
    and (p_relationship_type is null or r.relationship_type = p_relationship_type)
    and (p_owner_id is null or r.owner_id = p_owner_id)
    and (p_status is null or public._aper281_derive_status(r) = p_status)
    and (p_criticality is null or r.criticality_level = p_criticality)
    and (p_country is null or trim(p_country) = '' or lower(r.country) = lower(trim(p_country)))
    and (p_renewal_before is null or r.contract_end_date <= p_renewal_before)
    and (
      p_search is null or trim(p_search) = ''
      or r.organization_name ilike '%' || trim(p_search) || '%'
      or r.primary_contact ilike '%' || trim(p_search) || '%'
      or r.service_description ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and public._aper281_derive_status(r) = 'active';

  select count(*)::int into v_upcoming
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and r.contract_end_date between current_date and current_date + interval '90 days'
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_critical
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and r.criticality_level in ('high', 'mission_critical')
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_needs_review
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and public._aper281_needs_review(r);

  select count(*)::int into v_no_owner
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    and r.owner_id is null
    and public._aper281_derive_status(r) not in ('ended');

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select * from public.app_portal_external_relationships r
    where company_id = v_company_id
      and not public._app_is_showcase_record(v_org_id, 'app_portal_external_relationships', r.id)
    order by updated_at desc
    limit 5
  ) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'upcoming_renewals', v_upcoming,
      'critical', v_critical,
      'needs_review', v_needs_review,
      'without_owner', v_no_owner,
      'recently_updated', v_recent
    ),
    'recommendations', public._aper281_build_recommendations(v_items),
    'principle', 'Proactive relationship management strengthens resilience — humans retain vendor decisions.'
  );
end;
$$;

grant execute on function public.list_app_portal_external_relationships(text, uuid, text, text, text, date, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Goals — exclude showcase registry rows
-- ---------------------------------------------------------------------------
create or replace function public.list_app_portal_goals(
  p_goal_type text default null,
  p_status text default null,
  p_priority text default null,
  p_owner_id uuid default null,
  p_target_before date default null,
  p_progress_min integer default null,
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
  v_org_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_active integer := 0;
  v_achieved_q integer := 0;
  v_attention integer := 0;
  v_upcoming jsonb := '[]'::jsonb;
begin
  v_ctx := public._apgo276_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  if v_org_id is null then
    select c.id into v_org_id from public.customers c where c.company_id = v_company_id limit 1;
  end if;

  select coalesce(jsonb_agg(public._apgo276_goal_row(g) order by g.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_goals g
  where g.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_goals', g.id)
    and (p_goal_type is null or g.goal_type = p_goal_type)
    and (p_status is null or g.status = p_status)
    and (p_priority is null or g.priority = p_priority)
    and (p_owner_id is null or g.owner_id = p_owner_id)
    and (p_target_before is null or g.target_date <= p_target_before)
    and (p_progress_min is null or g.progress_percent >= p_progress_min)
    and (
      p_search is null or trim(p_search) = ''
      or g.title ilike '%' || trim(p_search) || '%'
      or g.description ilike '%' || trim(p_search) || '%'
      or g.success_criteria ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_goals g
  where g.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_goals', g.id)
    and g.status in ('active', 'on_track', 'at_risk');

  select count(*)::int into v_achieved_q
  from public.app_portal_goals g
  where g.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_goals', g.id)
    and g.status = 'achieved'
    and g.updated_at >= date_trunc('quarter', current_date);

  select count(*)::int into v_attention
  from public.app_portal_goals g
  where g.company_id = v_company_id
    and not public._app_is_showcase_record(v_org_id, 'app_portal_goals', g.id)
    and g.status in ('at_risk', 'draft')
    and g.target_date is not null and g.target_date <= current_date + 14;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'title', g.title, 'target_date', g.target_date, 'status', g.status
  ) order by g.target_date asc), '[]'::jsonb)
  into v_upcoming
  from (
    select * from public.app_portal_goals g
    where g.company_id = v_company_id
      and not public._app_is_showcase_record(v_org_id, 'app_portal_goals', g.id)
      and g.status in ('active', 'on_track', 'at_risk')
      and g.target_date is not null
      and g.target_date >= current_date
    order by g.target_date asc
    limit 5
  ) g;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active_goals', v_active,
      'achieved_this_quarter', v_achieved_q,
      'requiring_attention', v_attention,
      'upcoming_target_dates', v_upcoming
    ),
    'recommendations', public._apgo276_build_recommendations(v_items),
    'principle', 'Organizational alignment through clear goals — human teams remain responsible for execution.'
  );
end;
$$;

grant execute on function public.list_app_portal_goals(text, text, text, uuid, date, integer, text) to authenticated;

notify pgrst, 'reload schema';

-- Phase 620 P1 — External Relationships RPC permissions (read-only list path).

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('external_relationships.view', 'View External Relationships', null, 'View vendor and external relationship center'),
  ('external_relationships.manage', 'Manage External Relationships', null, 'Create and update external relationships')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'external_relationships.view'),
  ('owner', 'external_relationships.manage'),
  ('administrator', 'external_relationships.view'),
  ('administrator', 'external_relationships.manage'),
  ('manager', 'external_relationships.view'),
  ('manager', 'external_relationships.manage'),
  ('support_agent', 'external_relationships.view'),
  ('viewer', 'external_relationships.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._aper281_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_can_manage boolean;
begin
  if auth.uid() is null then
    raise exception 'APP portal access denied';
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    raise exception 'APP portal access denied';
  end if;

  if not public.has_organization_permission('external_relationships.view')
     and not public.has_organization_permission('external_relationships.manage') then
    raise exception 'Permission denied: external_relationships.view';
  end if;

  v_access := public._apsf260_require_app_access();
  v_can_manage := public.has_organization_permission('external_relationships.manage');

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_can_manage,
    'is_procurement_leader', v_can_manage
  );
end;
$$;

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

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
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
  where r.company_id = v_company_id and public._aper281_derive_status(r) = 'active';

  select count(*)::int into v_upcoming
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and r.contract_end_date between current_date and current_date + interval '90 days'
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_critical
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id
    and r.criticality_level in ('high', 'mission_critical')
    and public._aper281_derive_status(r) not in ('ended', 'suspended');

  select count(*)::int into v_needs_review
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id and public._aper281_needs_review(r);

  select count(*)::int into v_no_owner
  from public.app_portal_external_relationships r
  where r.company_id = v_company_id and r.owner_id is null and public._aper281_derive_status(r) not in ('ended');

  select coalesce(jsonb_agg(public._aper281_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select * from public.app_portal_external_relationships
    where company_id = v_company_id
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

notify pgrst, 'reload schema';

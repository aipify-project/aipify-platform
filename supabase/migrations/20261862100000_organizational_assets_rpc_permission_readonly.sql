-- Phase 620 P1 — Organizational Assets RPC permissions (read-only list path).

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('organizational_assets.view', 'View Organizational Assets', null, 'View organization asset registry'),
  ('organizational_assets.manage', 'Manage Organizational Assets', null, 'Create and update organization assets')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_assets.view'),
  ('owner', 'organizational_assets.manage'),
  ('administrator', 'organizational_assets.view'),
  ('administrator', 'organizational_assets.manage'),
  ('manager', 'organizational_assets.view'),
  ('manager', 'organizational_assets.manage'),
  ('support_agent', 'organizational_assets.view'),
  ('viewer', 'organizational_assets.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._aoar282_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
begin
  if auth.uid() is null then
    raise exception 'APP portal access denied';
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    raise exception 'APP portal access denied';
  end if;

  if not public.has_organization_permission('organizational_assets.view')
     and not public.has_organization_permission('organizational_assets.manage') then
    raise exception 'Permission denied: organizational_assets.view';
  end if;

  v_access := public._apsf260_require_app_access();

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', public.has_organization_permission('organizational_assets.manage')
  );
end;
$$;

create or replace function public.list_app_portal_organizational_assets(
  p_asset_type text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_vendor text default null,
  p_criticality text default null,
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
  if not public.has_organization_permission('organizational_assets.view')
     and not public.has_organization_permission('organizational_assets.manage') then
    raise exception 'Permission denied: organizational_assets.view';
  end if;

  v_ctx := public._aoar282_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoar282_row(a) order by a.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and public._aoar282_can_view(a, v_ctx)
    and (p_asset_type is null or a.asset_type = p_asset_type)
    and (p_owner_id is null or a.owner_id = p_owner_id)
    and (p_status is null or public._aoar282_derive_status(a) = p_status)
    and (p_vendor is null or trim(p_vendor) = '' or lower(a.vendor) = lower(trim(p_vendor)))
    and (p_criticality is null or a.criticality_level = p_criticality)
    and (p_renewal_before is null or a.renewal_date <= p_renewal_before)
    and (
      p_search is null or trim(p_search) = ''
      or a.asset_name ilike '%' || trim(p_search) || '%'
      or a.description ilike '%' || trim(p_search) || '%'
      or a.vendor ilike '%' || trim(p_search) || '%'
      or a.internal_notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and public._aoar282_derive_status(a) = 'active';

  select count(*)::int into v_upcoming
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and a.renewal_date between current_date and current_date + interval '90 days'
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select count(*)::int into v_critical
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id
    and a.criticality_level = 'mission_critical'
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select count(*)::int into v_needs_review
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and public._aoar282_needs_review(a);

  select count(*)::int into v_no_owner
  from public.app_portal_organizational_assets a
  where a.company_id = v_company_id and a.owner_id is null
    and public._aoar282_derive_status(a) not in ('retired', 'archived');

  select coalesce(jsonb_agg(public._aoar282_row(a) order by a.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select * from public.app_portal_organizational_assets
    where company_id = v_company_id
    order by updated_at desc
    limit 5
  ) a;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'needs_review', v_needs_review,
      'upcoming_renewals', v_upcoming,
      'mission_critical', v_critical,
      'without_owner', v_no_owner,
      'recently_updated', v_recent
    ),
    'recommendations', public._aoar282_build_recommendations(v_items),
    'principle', 'Operational awareness strengthens continuity — store references only, never credentials.'
  );
end;
$$;

grant execute on function public.list_app_portal_organizational_assets(text, uuid, text, text, text, date, text) to authenticated;

notify pgrst, 'reload schema';

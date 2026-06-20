-- Phase 620 P1 — Responsibilities RPC permissions (read-only list path).

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('responsibilities.view', 'View Responsibilities', null, 'View organization responsibilities and ownership center'),
  ('responsibilities.manage', 'Manage Responsibilities', null, 'Create and update organization responsibilities')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'responsibilities.view'),
  ('owner', 'responsibilities.manage'),
  ('administrator', 'responsibilities.view'),
  ('administrator', 'responsibilities.manage'),
  ('manager', 'responsibilities.view'),
  ('manager', 'responsibilities.manage'),
  ('support_agent', 'responsibilities.view'),
  ('viewer', 'responsibilities.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._apresp277_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_access jsonb;
begin
  if auth.uid() is null then
    raise exception 'APP portal access denied';
  end if;

  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user.id is null then
    raise exception 'APP portal access denied';
  end if;

  if not public.has_organization_permission('responsibilities.view')
     and not public.has_organization_permission('responsibilities.manage') then
    raise exception 'Permission denied: responsibilities.view';
  end if;

  v_access := public._apsf260_require_app_access();

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', public.has_organization_permission('responsibilities.manage')
  );
end;
$$;

create or replace function public.list_app_portal_responsibilities(
  p_area text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_review_before date default null,
  p_has_backup boolean default null,
  p_related_module text default null,
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
  v_assigned integer := 0;
  v_unassigned integer := 0;
  v_needs_review integer := 0;
  v_no_backup integer := 0;
  v_overloaded jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
begin
  if not public.has_organization_permission('responsibilities.view')
     and not public.has_organization_permission('responsibilities.manage') then
    raise exception 'Permission denied: responsibilities.view';
  end if;

  v_ctx := public._apresp277_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(
    public._apresp277_row(r) || jsonb_build_object('status', public._apresp277_derive_status(r))
    order by r.updated_at desc
  ), '[]'::jsonb)
  into v_items
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id
    and public._apresp277_can_view(r, v_ctx)
    and (p_area is null or r.area = p_area)
    and (p_owner_id is null or r.primary_owner_id = p_owner_id or r.backup_owner_id = p_owner_id)
    and (p_status is null or public._apresp277_derive_status(r) = p_status)
    and (p_review_before is null or r.last_reviewed_date <= p_review_before)
    and (p_has_backup is null or (p_has_backup = true and r.backup_owner_id is not null) or (p_has_backup = false and r.backup_owner_id is null))
    and (p_related_module is null or r.related_module = p_related_module)
    and (
      p_search is null or trim(p_search) = ''
      or r.title ilike '%' || trim(p_search) || '%'
      or r.description ilike '%' || trim(p_search) || '%'
      or r.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_assigned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id is not null;

  select count(*)::int into v_unassigned
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and r.primary_owner_id is null;

  select count(*)::int into v_needs_review
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id and public._apresp277_derive_status(r) = 'needs_review';

  select count(*)::int into v_no_backup
  from public.app_portal_responsibilities r
  where r.company_id = v_company_id
    and r.primary_owner_id is not null
    and r.backup_owner_id is null
    and r.area in ('security', 'billing', 'approvals', 'operations');

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', x.primary_owner_id, 'name', public._apresp277_user_name(x.primary_owner_id), 'count', x.cnt
  ) order by x.cnt desc), '[]'::jsonb)
  into v_overloaded
  from (
    select r.primary_owner_id, count(*)::int as cnt
    from public.app_portal_responsibilities r
    where r.company_id = v_company_id and r.primary_owner_id is not null and r.status <> 'inactive'
    group by r.primary_owner_id
    having count(*) >= 3
    order by cnt desc
    limit 5
  ) x;

  select coalesce(jsonb_agg(public._apresp277_row(r) order by r.updated_at desc), '[]'::jsonb)
  into v_recent
  from (
    select * from public.app_portal_responsibilities r
    where r.company_id = v_company_id
    order by r.updated_at desc
    limit 5
  ) r;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'assigned', v_assigned,
      'unassigned', v_unassigned,
      'needs_review', v_needs_review,
      'critical_no_backup', v_no_backup,
      'overloaded_owners', v_overloaded,
      'recently_updated', v_recent
    ),
    'recommendations', public._apresp277_build_recommendations(v_items),
    'principle', 'Clear ownership reduces ambiguity — human administrators assign responsibility.'
  );
end;
$$;

grant execute on function public.list_app_portal_responsibilities(text, uuid, text, date, boolean, text, text) to authenticated;

notify pgrst, 'reload schema';

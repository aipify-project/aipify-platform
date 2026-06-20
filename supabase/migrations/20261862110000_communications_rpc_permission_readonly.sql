-- Phase 620 P1 — Communications RPC permissions (read-only list path).

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('communications.view', 'View Communications', null, 'View organization communications center'),
  ('communications.manage', 'Manage Communications', null, 'Create and publish organization communications')
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'communications.view'),
  ('owner', 'communications.manage'),
  ('administrator', 'communications.view'),
  ('administrator', 'communications.manage'),
  ('manager', 'communications.view'),
  ('manager', 'communications.manage'),
  ('support_agent', 'communications.view'),
  ('viewer', 'communications.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;

create or replace function public._aoca284_access_context()
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

  if not public.has_organization_permission('communications.view')
     and not public.has_organization_permission('communications.manage') then
    raise exception 'Permission denied: communications.view';
  end if;

  v_access := public._apsf260_require_app_access();

  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', public.has_organization_permission('communications.manage'),
    'is_executive', public.has_organization_permission('communications.manage')
  );
end;
$$;

create or replace function public.list_app_portal_communications(
  p_communication_type text default null,
  p_author_id uuid default null,
  p_status text default null,
  p_priority text default null,
  p_audience_type text default null,
  p_publish_from timestamptz default null,
  p_publish_to timestamptz default null,
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
  v_scheduled integer := 0;
  v_critical integer := 0;
  v_expiring integer := 0;
  v_drafts integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  if not public.has_organization_permission('communications.view')
     and not public.has_organization_permission('communications.manage') then
    raise exception 'Permission denied: communications.view';
  end if;

  v_ctx := public._aoca284_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._aoca284_row(c, v_ctx) order by coalesce(c.publish_date, c.created_at) desc), '[]'::jsonb)
  into v_items
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and public._aoca284_can_view(c, v_ctx)
    and (p_communication_type is null or c.communication_type = p_communication_type)
    and (p_author_id is null or c.author_id = p_author_id)
    and (p_status is null or public._aoca284_derive_status(c) = p_status)
    and (p_priority is null or c.priority = p_priority)
    and (p_audience_type is null or c.audience_type = p_audience_type)
    and (p_publish_from is null or c.publish_date >= p_publish_from)
    and (p_publish_to is null or c.publish_date <= p_publish_to)
    and (
      p_search is null or trim(p_search) = ''
      or c.title ilike '%' || trim(p_search) || '%'
      or c.summary ilike '%' || trim(p_search) || '%'
      or c.full_message ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_scheduled
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'scheduled';

  select count(*)::int into v_critical
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and c.priority = 'critical' and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_expiring
  from public.app_portal_communications c
  where c.company_id = v_company_id
    and c.expiration_date between now() and now() + interval '30 days'
    and public._aoca284_derive_status(c) = 'published';

  select count(*)::int into v_drafts
  from public.app_portal_communications c
  where c.company_id = v_company_id and public._aoca284_derive_status(c) = 'draft'
    and coalesce(v_ctx->>'can_manage', 'false') = 'true';

  select coalesce(jsonb_agg(public._aoca284_row(c, v_ctx) order by c.publish_date desc nulls last), '[]'::jsonb)
  into v_recent
  from (
    select c2.* from public.app_portal_communications c2
    where c2.company_id = v_company_id and public._aoca284_derive_status(c2) = 'published'
    order by c2.publish_date desc nulls last
    limit 5
  ) c;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'scheduled', v_scheduled,
      'critical', v_critical,
      'expiring_soon', v_expiring,
      'drafts', v_drafts,
      'recent', v_recent
    ),
    'recommendations', public._aoca284_build_recommendations(v_items, v_critical),
    'principle', 'Clear communication builds trust — humans approve what gets published.'
  );
end;
$$;

grant execute on function public.list_app_portal_communications(text, uuid, text, text, text, timestamptz, timestamptz, text) to authenticated;

notify pgrst, 'reload schema';

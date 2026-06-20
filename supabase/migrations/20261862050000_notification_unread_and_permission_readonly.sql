-- Phase 620 P1 — restore notification unread RPC (read-only) and permission helper.

create or replace function public.has_organization_permission(p_permission_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_membership public.organization_users;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null or p_permission_key is null then
    return false;
  end if;

  select c.id
  into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  if v_org_id is null then
    return false;
  end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then
    return false;
  end if;

  if exists (
    select 1
    from public.organization_user_permissions oup
    where oup.organization_id = v_org_id
      and oup.user_id = v_user_id
      and oup.permission_key = p_permission_key
  ) then
    return (
      select oup.granted
      from public.organization_user_permissions oup
      where oup.organization_id = v_org_id
        and oup.user_id = v_user_id
        and oup.permission_key = p_permission_key
      limit 1
    );
  end if;

  if not exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key
  into v_module_key
  from public.aipify_permissions
  where permission_key = p_permission_key;

  if v_module_key is not null and exists (
    select 1
    from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
  ) and not exists (
    select 1
    from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
      and m.status in ('active', 'beta')
  ) then
    return false;
  end if;

  return true;
exception
  when others then
    return false;
end;
$$;

create or replace function public.get_notification_unread_count()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  if not public.has_organization_permission('notifications.view') then
    raise exception 'Permission denied';
  end if;

  v_user_id := public._mta_app_user_id();

  select c.id
  into v_org_id
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.id = v_user_id
  limit 1;

  if v_org_id is null then
    raise exception 'Organization context required';
  end if;

  return jsonb_build_object(
    'unread', coalesce((
      select count(*)
      from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and coalesce(n.status, 'pending') in ('delivered', 'pending', 'unread')
        and n.read_at is null
    ), 0),
    'critical_unread', coalesce((
      select count(*)
      from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.priority = 'critical'
        and coalesce(n.status, 'pending') in ('delivered', 'pending', 'unread')
        and n.read_at is null
    ), 0)
  );
end;
$$;

grant execute on function public.has_organization_permission(text) to authenticated;
grant execute on function public.get_notification_unread_count() to authenticated;

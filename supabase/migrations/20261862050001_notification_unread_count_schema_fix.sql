-- Patch notification unread count for production organization_communication_notifications schema.

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

grant execute on function public.get_notification_unread_count() to authenticated;

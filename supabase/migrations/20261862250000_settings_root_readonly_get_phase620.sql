-- Phase 620 P1 — Settings root read-only GET repair.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  ('settings.view', 'View Settings', 'admin_assistant', 'View organization and user settings'),
  ('settings.manage', 'Manage Settings', 'admin_assistant', 'Manage organization settings')
) as v(key, label, module_key, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'settings.view'), ('owner', 'settings.manage'),
  ('administrator', 'settings.view'), ('administrator', 'settings.manage'),
  ('manager', 'settings.view'),
  ('support_agent', 'settings.view'),
  ('viewer', 'settings.view')
) as v(role, key)
where exists (select 1 from public.aipify_permissions p where p.permission_key = v.key)
on conflict (organization_id, role, permission_key) do nothing;

insert into public.presence_notification_preferences (tenant_id, timezone)
select c.id, coalesce(public.resolve_customer_timezone(c.id), 'UTC')
from public.customers c
where not exists (
  select 1 from public.presence_notification_preferences p where p.tenant_id = c.id
)
on conflict (tenant_id) do nothing;

create or replace function public._presence_read_notification_preferences(p_tenant_id uuid)
returns public.presence_notification_preferences
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.presence_notification_preferences;
  v_default_tz text;
begin
  select * into v_row
  from public.presence_notification_preferences
  where tenant_id = p_tenant_id;

  if found then
    return v_row;
  end if;

  v_default_tz := coalesce(public.resolve_customer_timezone(p_tenant_id), 'UTC');
  v_row.id := null;
  v_row.tenant_id := p_tenant_id;
  v_row.quiet_hours_mode := 'standard';
  v_row.working_hours_start := '09:00';
  v_row.working_hours_end := '17:00';
  v_row.timezone := v_default_tz;
  v_row.vacation_until := null;
  v_row.channel_in_app := true;
  v_row.channel_desktop := true;
  v_row.channel_email_digest := false;
  v_row.channel_mobile_push := false;
  v_row.min_level_in_app := 'informational';
  v_row.min_level_desktop := 'important';
  v_row.min_level_email := 'important';
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.get_presence_notification_preferences()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_prefs public.presence_notification_preferences;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('settings.view')
     and not public.has_organization_permission('settings.manage') then
    raise exception 'Permission denied: settings.view';
  end if;

  v_prefs := public._presence_read_notification_preferences(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'preferences', row_to_json(v_prefs)
  );
end;
$$;

grant execute on function public._presence_read_notification_preferences(uuid) to authenticated;

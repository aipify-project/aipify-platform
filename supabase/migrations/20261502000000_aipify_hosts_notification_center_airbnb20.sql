-- Phase Airbnb 20 — Aipify Hosts Notification Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostnotif_* (engine), _ahostbp382_* (blueprint)

create table if not exists public.aipify_hosts_notification_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'all_notifications' check (
    default_section in (
      'all_notifications', 'critical_alerts', 'operational_updates',
      'guest_activity', 'team_activity', 'notification_settings'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_notification_center_settings enable row level security;
revoke all on public.aipify_hosts_notification_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  channel_in_app boolean not null default true,
  channel_email boolean not null default true,
  channel_push boolean not null default false,
  quiet_hours_enabled boolean not null default false,
  quiet_hours_start time default '22:00',
  quiet_hours_end time default '07:00',
  min_priority text not null default 'informational' check (
    min_priority in ('informational', 'important', 'high', 'critical')
  ),
  escalate_critical_to_owner boolean not null default true,
  escalate_critical_to_property_manager boolean not null default true,
  repeat_critical_alerts boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_notification_preferences enable row level security;
revoke all on public.aipify_hosts_notification_preferences from authenticated, anon;

create table if not exists public.aipify_hosts_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  notification_key text not null,
  category text not null check (
    category in (
      'guest_requests', 'arrivals', 'departures', 'cleaning_updates', 'maintenance_updates',
      'incidents', 'approvals', 'financial_events', 'team_events'
    )
  ),
  priority text not null default 'informational' check (
    priority in ('informational', 'important', 'high', 'critical')
  ),
  notification_status text not null default 'unread' check (
    notification_status in ('unread', 'read', 'archived')
  ),
  title text not null,
  message text not null,
  requires_attention boolean not null default false,
  acknowledged_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, notification_key)
);
create index if not exists aipify_hosts_notifications_tenant_idx
  on public.aipify_hosts_notifications (tenant_id, notification_status, priority);
alter table public.aipify_hosts_notifications enable row level security;
revoke all on public.aipify_hosts_notifications from authenticated, anon;

create table if not exists public.aipify_hosts_notification_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_notification_center_events_tenant_idx
  on public.aipify_hosts_notification_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_notification_center_events enable row level security;
revoke all on public.aipify_hosts_notification_center_events from authenticated, anon;

create or replace function public._ahostnotif_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_notification_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_notification_center_settings;
begin
  insert into public.aipify_hosts_notification_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_notification_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostnotif_ensure_preferences(p_tenant_id uuid)
returns public.aipify_hosts_notification_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_notification_preferences;
begin
  insert into public.aipify_hosts_notification_preferences (tenant_id)
  values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_notification_preferences where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostnotif_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_notification_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'notif_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp382_positioning() returns text language sql immutable as $$
  select 'Ensure important operational events are never missed — alerts, updates, and preferences in one Notification Center.'; $$;

create or replace function public._ahostbp382_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'all_notifications', 'label', 'All Notifications'),
    jsonb_build_object('key', 'critical_alerts', 'label', 'Critical Alerts'),
    jsonb_build_object('key', 'operational_updates', 'label', 'Operational Updates'),
    jsonb_build_object('key', 'guest_activity', 'label', 'Guest Activity'),
    jsonb_build_object('key', 'team_activity', 'label', 'Team Activity'),
    jsonb_build_object('key', 'notification_settings', 'label', 'Notification Settings')
  ); $$;

create or replace function public._ahostbp382_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'guest_requests', 'arrivals', 'departures', 'cleaning_updates', 'maintenance_updates',
    'incidents', 'approvals', 'financial_events', 'team_events'
  ); $$;

create or replace function public._ahostnotif_row(p_n public.aipify_hosts_notifications)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_n.id,
    'notification_key', p_n.notification_key,
    'category', p_n.category,
    'priority', p_n.priority,
    'status', p_n.notification_status,
    'title', p_n.title,
    'message', p_n.message,
    'requires_attention', p_n.requires_attention,
    'acknowledged', p_n.acknowledged_at is not null,
    'created_at', to_char(p_n.created_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostnotif_seed_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_hosts_notifications where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_hosts_notifications (tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention)
  values
    (p_tenant_id, 'notif_guest_req_1', 'guest_requests', 'high', 'unread', 'New guest request', 'Early check-in requested for Fjord View Apartment', true),
    (p_tenant_id, 'notif_arrival_1', 'arrivals', 'important', 'unread', 'Arrival today', 'Guest arriving today — verify property readiness', true),
    (p_tenant_id, 'notif_departure_1', 'departures', 'informational', 'read', 'Departure today', 'Checkout scheduled for 11:00', false),
    (p_tenant_id, 'notif_clean_1', 'cleaning_updates', 'important', 'unread', 'Cleaning overdue', 'Turnover cleaning past scheduled completion time', true),
    (p_tenant_id, 'notif_maint_1', 'maintenance_updates', 'high', 'unread', 'High-priority maintenance issue', 'Plumbing issue reported — assign technician', true),
    (p_tenant_id, 'notif_incident_1', 'incidents', 'critical', 'unread', 'Critical incident detected', 'Safety concern reported — immediate review required', true),
    (p_tenant_id, 'notif_approval_1', 'approvals', 'important', 'unread', 'Approval requested', 'Late check-out approval awaiting host decision', false),
    (p_tenant_id, 'notif_fin_1', 'financial_events', 'important', 'unread', 'Delayed payout', 'Booking.com payout delayed — review finance center', true),
    (p_tenant_id, 'notif_team_1', 'team_events', 'informational', 'read', 'Invitation accepted', 'Maintenance team member accepted invitation', false);
end; $$;

create or replace function public._ahostnotif_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'unread_count', (select count(*)::int from public.aipify_hosts_notifications
      where tenant_id = p_tenant_id and notification_status = 'unread'),
    'critical_alerts', (select count(*)::int from public.aipify_hosts_notifications
      where tenant_id = p_tenant_id and priority = 'critical' and notification_status <> 'archived'),
    'requires_attention', (select count(*)::int from public.aipify_hosts_notifications
      where tenant_id = p_tenant_id and requires_attention and notification_status = 'unread')
  ); $$;

create or replace function public.get_aipify_hosts_notification_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_nc public.aipify_hosts_notification_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_nc := public._ahostnotif_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_nc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp382_positioning(),
    'route', '/app/aipify-hosts/notifications',
    'stats', public._ahostnotif_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_notification_center_dashboard(
  p_section text default 'all_notifications',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_nc public.aipify_hosts_notification_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_prefs public.aipify_hosts_notification_preferences; v_all jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_nc := public._ahostnotif_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_prefs := public._ahostnotif_ensure_preferences(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_nc.default_section, 'all_notifications');
  perform public._ahostnotif_seed_notifications(v_tenant_id);
  perform public._ahostnotif_log_event(v_tenant_id, 'dashboard_view', 'Notification Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(public._ahostnotif_row(n) order by n.created_at desc), '[]'::jsonb) into v_all
  from public.aipify_hosts_notifications n where n.tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_nc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp382_positioning(),
    'governance', jsonb_build_object(
      'role_visibility', true,
      'audit_preference_changes', true,
      'audit_critical_acknowledgements', true
    ),
    'sections', public._ahostbp382_sections(),
    'categories', public._ahostbp382_categories(),
    'priorities', jsonb_build_array('informational', 'important', 'high', 'critical'),
    'notification_statuses', jsonb_build_array('unread', 'read', 'archived'),
    'delivery_channels', jsonb_build_array('in_app', 'email', 'push'),
    'stats', public._ahostnotif_dashboard_stats(v_tenant_id),
    'preferences', jsonb_build_object(
      'channel_in_app', v_prefs.channel_in_app,
      'channel_email', v_prefs.channel_email,
      'channel_push', v_prefs.channel_push,
      'quiet_hours_enabled', v_prefs.quiet_hours_enabled,
      'quiet_hours_start', v_prefs.quiet_hours_start::text,
      'quiet_hours_end', v_prefs.quiet_hours_end::text,
      'min_priority', v_prefs.min_priority,
      'escalate_critical_to_owner', v_prefs.escalate_critical_to_owner,
      'escalate_critical_to_property_manager', v_prefs.escalate_critical_to_property_manager,
      'repeat_critical_alerts', v_prefs.repeat_critical_alerts
    ),
    'all_notifications', v_all,
    'critical_alerts', (
      select coalesce(jsonb_agg(public._ahostnotif_row(n) order by n.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_notifications n
      where n.tenant_id = v_tenant_id and n.priority = 'critical' and n.notification_status <> 'archived'
    ),
    'operational_updates', (
      select coalesce(jsonb_agg(public._ahostnotif_row(n) order by n.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_notifications n
      where n.tenant_id = v_tenant_id
        and n.category in ('cleaning_updates', 'maintenance_updates', 'approvals')
        and n.notification_status <> 'archived'
    ),
    'guest_activity', (
      select coalesce(jsonb_agg(public._ahostnotif_row(n) order by n.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_notifications n
      where n.tenant_id = v_tenant_id
        and n.category in ('guest_requests', 'arrivals', 'departures')
        and n.notification_status <> 'archived'
    ),
    'team_activity', (
      select coalesce(jsonb_agg(public._ahostnotif_row(n) order by n.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_notifications n
      where n.tenant_id = v_tenant_id
        and n.category = 'team_events' and n.notification_status <> 'archived'
    ),
    'recent_activity', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select public._ahostnotif_row(n) as x
        from public.aipify_hosts_notifications n
        where n.tenant_id = v_tenant_id
        order by n.created_at desc
        limit 10
      ) s
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 20 — Notification Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_20_NOTIFICATION_CENTER.text',
      'route', '/app/aipify-hosts/notifications'
    )
  );
end; $$;

create or replace function public.update_aipify_hosts_notification_status(
  p_notification_id uuid,
  p_status text,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_status not in ('unread', 'read', 'archived') then raise exception 'Invalid status'; end if;
  update public.aipify_hosts_notifications
  set notification_status = p_status, updated_at = now()
  where id = p_notification_id and tenant_id = v_tenant_id;
  return jsonb_build_object('success', true, 'notification_id', p_notification_id, 'status', p_status);
end; $$;

create or replace function public.acknowledge_aipify_hosts_critical_alert(
  p_notification_id uuid,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_notifications
  set notification_status = 'read', acknowledged_at = now(), updated_at = now()
  where id = p_notification_id and tenant_id = v_tenant_id and priority = 'critical';
  perform public._ahostnotif_log_event(v_tenant_id, 'critical_acknowledged', 'Critical alert acknowledged',
    jsonb_build_object('notification_id', p_notification_id));
  return jsonb_build_object('success', true, 'notification_id', p_notification_id);
end; $$;

create or replace function public.update_aipify_hosts_notification_preferences(
  p_channel_in_app boolean default null,
  p_channel_email boolean default null,
  p_channel_push boolean default null,
  p_quiet_hours_enabled boolean default null,
  p_min_priority text default null,
  p_escalate_critical_to_owner boolean default null,
  p_escalate_critical_to_property_manager boolean default null,
  p_repeat_critical_alerts boolean default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_notification_preferences set
    channel_in_app = coalesce(p_channel_in_app, channel_in_app),
    channel_email = coalesce(p_channel_email, channel_email),
    channel_push = coalesce(p_channel_push, channel_push),
    quiet_hours_enabled = coalesce(p_quiet_hours_enabled, quiet_hours_enabled),
    min_priority = coalesce(p_min_priority, min_priority),
    escalate_critical_to_owner = coalesce(p_escalate_critical_to_owner, escalate_critical_to_owner),
    escalate_critical_to_property_manager = coalesce(p_escalate_critical_to_property_manager, escalate_critical_to_property_manager),
    repeat_critical_alerts = coalesce(p_repeat_critical_alerts, repeat_critical_alerts),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._ahostnotif_log_event(v_tenant_id, 'preferences_updated', 'Notification preferences updated', '{}'::jsonb);
  return jsonb_build_object('success', true);
end; $$;

create or replace function public.seed_aipify_hosts_notification_center_knowledge_airbnb20()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-notifications', 'Hosts Notification Center',
    'Managing notifications, recommended settings, and critical alert procedures.', 280
  );
  perform public._ahostkc_seed_article('aipify-hosts-notifications', 'managing-notifications', 'Managing notifications',
    'Configure delivery channels, quiet hours, and priority thresholds so operational events are never missed.');
  perform public._ahostkc_seed_article('aipify-hosts-notifications', 'recommended-notification-settings', 'Recommended notification settings',
    'Enable in-app and email for important and critical alerts. Use quiet hours for non-critical updates.');
  perform public._ahostkc_seed_article('aipify-hosts-notifications', 'critical-alert-procedures', 'Critical alert procedures',
    'Critical alerts repeat and escalate to Owners and Property Managers until acknowledged.');
end; $$;

select public.seed_aipify_hosts_notification_center_knowledge_airbnb20();

grant execute on function public.get_aipify_hosts_notification_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_notification_center_dashboard(text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_notification_status(uuid, text, uuid) to authenticated;
grant execute on function public.acknowledge_aipify_hosts_critical_alert(uuid, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_notification_preferences(boolean, boolean, boolean, boolean, text, boolean, boolean, boolean, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_notification_center_knowledge_airbnb20() to authenticated;

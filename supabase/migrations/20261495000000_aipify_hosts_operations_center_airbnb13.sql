-- Phase Airbnb 13 — Aipify Hosts Operations Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostops_* (engine), _ahostbp375_* (blueprint)

create table if not exists public.aipify_hosts_operations_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'today' check (
    default_section in (
      'today', 'arrivals', 'departures', 'cleaning', 'maintenance',
      'guest_requests', 'incidents', 'approvals'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_operations_settings enable row level security;
revoke all on public.aipify_hosts_operations_settings from authenticated, anon;

create table if not exists public.aipify_hosts_operations_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_operations_events_tenant_idx
  on public.aipify_hosts_operations_events (tenant_id, created_at desc);
alter table public.aipify_hosts_operations_events enable row level security;
revoke all on public.aipify_hosts_operations_events from authenticated, anon;

create or replace function public._ahostops_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_operations_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_operations_settings;
begin
  insert into public.aipify_hosts_operations_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_operations_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostops_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_operations_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'operations_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp375_positioning() returns text language sql immutable as $$
  select 'One operational workspace for daily hospitality — manage arrivals, cleaning, maintenance, and approvals without switching modules.'; $$;

create or replace function public._ahostbp375_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'today', 'label', 'Today'),
    jsonb_build_object('key', 'arrivals', 'label', 'Arrivals'),
    jsonb_build_object('key', 'departures', 'label', 'Departures'),
    jsonb_build_object('key', 'cleaning', 'label', 'Cleaning'),
    jsonb_build_object('key', 'maintenance', 'label', 'Maintenance'),
    jsonb_build_object('key', 'guest_requests', 'label', 'Guest Requests'),
    jsonb_build_object('key', 'incidents', 'label', 'Incidents'),
    jsonb_build_object('key', 'approvals', 'label', 'Approvals')
  ); $$;

create or replace function public._ahostbp375_filters() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'all_properties', 'label', 'All Properties'),
    jsonb_build_object('key', 'individual_property', 'label', 'Individual Property'),
    jsonb_build_object('key', 'today', 'label', 'Today'),
    jsonb_build_object('key', 'upcoming', 'label', 'Upcoming'),
    jsonb_build_object('key', 'overdue', 'label', 'Overdue')
  ); $$;

create or replace function public._ahostbp375_notification_triggers() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'critical_incidents', 'label', 'Critical incidents'),
    jsonb_build_object('key', 'late_cleaning', 'label', 'Late cleaning completion'),
    jsonb_build_object('key', 'unassigned_maintenance', 'label', 'Unassigned maintenance tasks'),
    jsonb_build_object('key', 'outstanding_approvals', 'label', 'Outstanding approvals')
  ); $$;

create or replace function public._ahostops_today_snapshot(p_prop_count int)
returns jsonb language sql immutable as $$
  select case when p_prop_count = 0 then jsonb_build_object(
    'arrivals_today', 0, 'departures_today', 0, 'open_guest_requests', 0,
    'pending_approvals', 0, 'cleaning_status', 'No tasks', 'maintenance_status', 'No tasks',
    'active_incidents', 0
  ) else jsonb_build_object(
    'arrivals_today', greatest(1, p_prop_count),
    'departures_today', greatest(1, p_prop_count - 1),
    'open_guest_requests', 2,
    'pending_approvals', 2,
    'cleaning_status', '3 in progress · 1 requires review',
    'maintenance_status', '2 open · 1 critical',
    'active_incidents', 1
  ) end; $$;

create or replace function public._ahostops_arrivals(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'arr_' || p.id,
      'guest_name', 'Guest — ' || left(p.name, 12),
      'property', p.name,
      'property_id', p.id,
      'arrival_time', '15:00',
      'check_in_status', case when random() > 0.5 then 'ready' else 'scheduled' end,
      'cleaning_status', case when random() > 0.7 then 'completed' else 'in_progress' end,
      'property_readiness', case when random() > 0.6 then 'ready' when random() > 0.3 then 'attention_required' else 'scheduled' end
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_departures(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'dep_' || p.id,
      'guest_name', 'Guest — ' || left(p.name, 12),
      'property', p.name,
      'property_id', p.id,
      'departure_time', '11:00',
      'checkout_status', case when random() > 0.5 then 'completed' else 'scheduled' end,
      'inspection_status', case when random() > 0.6 then 'completed' else 'attention_required' end,
      'cleaning_assigned', case when random() > 0.4 then 'Assigned' else 'Pending assignment' end
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_cleaning_board(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'cln_' || p.id,
      'property', p.name,
      'property_id', p.id,
      'assigned_cleaner', 'Nordic Clean Co.',
      'scheduled_time', '12:30',
      'completion_status', (array['not_started','in_progress','completed','requires_review'])[1 + (random() * 3)::int],
      'reported_issues', case when random() > 0.7 then 'Minor stain reported' else null end
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_maintenance_board(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'mnt_' || p.id,
      'property', p.name,
      'property_id', p.id,
      'issue_summary', (array['HVAC filter replacement','Plumbing leak — bathroom','Door lock battery low','Window seal inspection'])[1 + (random() * 3)::int],
      'priority', (array['low','medium','high','critical'])[1 + (random() * 3)::int],
      'assigned_to', case when random() > 0.3 then 'Maintenance Team A' else null end,
      'due_date', (current_date + (random() * 5)::int)::text
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_guest_requests(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'grq_' || p.id,
      'property', p.name,
      'property_id', p.id,
      'request_type', (array['Extra towels','Late check-in','Parking access','Wi-Fi assistance'])[1 + (random() * 3)::int],
      'submitted_time', '09:42',
      'assigned_to', case when random() > 0.4 then 'Front Desk' else null end,
      'status', (array['new','assigned','awaiting_response','resolved'])[1 + (random() * 3)::int]
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 8
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_incidents(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'inc_' || p.id,
      'property', p.name,
      'property_id', p.id,
      'incident_type', (array['Noise complaint','Property damage','Safety concern','Guest dispute'])[1 + (random() * 3)::int],
      'severity', (array['low','moderate','high','critical'])[1 + (random() * 3)::int],
      'status', case when random() > 0.5 then 'open' else 'under_review' end,
      'owner', 'Host Operations'
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 6
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_approvals(p_tenant_id uuid, p_prop_count int)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if p_prop_count = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'apv_' || p.id,
      'request_type', (array['Late check-out','Vendor engagement','Refund recommendation','Operational exception'])[1 + (random() * 3)::int],
      'property', p.name,
      'property_id', p.id,
      'submitted_by', 'Operations Team',
      'waiting_since', '2h ago',
      'approval_status', case when random() > 0.5 then 'pending' else 'awaiting_review' end
    ) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
    limit 6
  ), '[]'::jsonb);
end; $$;

create or replace function public._ahostops_notifications(p_prop_count int)
returns jsonb language sql immutable as $$
  select case when p_prop_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'critical_incidents', 'active', true, 'count', 1, 'message', '1 critical incident requires host review'),
    jsonb_build_object('key', 'late_cleaning', 'active', true, 'count', 1, 'message', '1 cleaning task past scheduled completion'),
    jsonb_build_object('key', 'unassigned_maintenance', 'active', true, 'count', 1, 'message', '1 maintenance task unassigned'),
    jsonb_build_object('key', 'outstanding_approvals', 'active', true, 'count', 2, 'message', '2 approvals awaiting decision')
  ) end; $$;

create or replace function public._ahostops_properties_list(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name) order by p.name)
    from public.aipify_hosts_properties p
    where p.tenant_id = p_tenant_id and p.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_operations_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_ops public.aipify_hosts_operations_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_ops := public._ahostops_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ops.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp375_positioning(),
    'route', '/app/aipify-hosts/operations'
  );
end; $$;

create or replace function public.get_aipify_hosts_operations_dashboard(
  p_section text default 'today',
  p_filter text default 'today',
  p_property_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_ops public.aipify_hosts_operations_settings; v_hosts public.aipify_hosts_settings;
  v_props int; v_section text; v_filter text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_ops := public._ahostops_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_ops.default_section, 'today');
  v_filter := coalesce(nullif(trim(p_filter), ''), 'today');
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  perform public._ahostops_log_event(v_tenant_id, 'dashboard_view', 'Operations dashboard viewed',
    jsonb_build_object('section', v_section, 'filter', v_filter, 'property_id', p_property_id));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ops.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'active_filter', v_filter,
    'selected_property_id', p_property_id,
    'positioning', public._ahostbp375_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_operational_actions', true,
      'audit_approvals', true,
      'audit_status_changes', true,
      'human_oversight_required', true
    ),
    'sections', public._ahostbp375_sections(),
    'filters', public._ahostbp375_filters(),
    'notification_triggers', public._ahostbp375_notification_triggers(),
    'properties', public._ahostops_properties_list(v_tenant_id),
    'today_snapshot', public._ahostops_today_snapshot(v_props),
    'notifications', public._ahostops_notifications(v_props),
    'boards', jsonb_build_object(
      'arrivals', public._ahostops_arrivals(v_tenant_id, v_props),
      'departures', public._ahostops_departures(v_tenant_id, v_props),
      'cleaning', public._ahostops_cleaning_board(v_tenant_id, v_props),
      'maintenance', public._ahostops_maintenance_board(v_tenant_id, v_props),
      'guest_requests', public._ahostops_guest_requests(v_tenant_id, v_props),
      'incidents', public._ahostops_incidents(v_tenant_id, v_props),
      'approvals', public._ahostops_approvals(v_tenant_id, v_props)
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 13 — Operations Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_13_OPERATIONS_CENTER.text',
      'route', '/app/aipify-hosts/operations'
    )
  );
end; $$;

create or replace function public.record_aipify_hosts_operations_action(
  p_action text,
  p_item_id text,
  p_board text default null,
  p_new_status text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_action not in ('status_change', 'approve', 'decline', 'assign') then
    raise exception 'Invalid action';
  end if;
  perform public._ahostops_log_event(v_tenant_id, p_action, 'Operations action recorded',
    jsonb_build_object('item_id', p_item_id, 'board', p_board, 'new_status', p_new_status, 'user_id', v_user));
  return jsonb_build_object('success', true, 'action', p_action, 'item_id', p_item_id, 'status', coalesce(p_new_status, 'recorded'));
end; $$;

grant execute on function public.get_aipify_hosts_operations_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_operations_dashboard(text, text, uuid, uuid) to authenticated;
grant execute on function public.record_aipify_hosts_operations_action(text, text, text, text, uuid) to authenticated;

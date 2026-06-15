-- Phase Airbnb 21 — Aipify Hosts Incident Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostinc_* (engine), _ahostbp383_* (blueprint)

create table if not exists public.aipify_hosts_incident_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'active_incidents' check (
    default_section in (
      'active_incidents', 'emergency_events', 'incident_history',
      'recovery_actions', 'incident_playbooks'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_incident_center_settings enable row level security;
revoke all on public.aipify_hosts_incident_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  incident_key text not null,
  incident_type text not null check (
    incident_type in (
      'guest_complaint', 'property_damage', 'noise_complaint', 'access_problem',
      'cleaning_failure', 'maintenance_failure', 'safety_concern', 'utility_outage',
      'security_concern', 'other'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  incident_status text not null default 'open' check (
    incident_status in ('open', 'investigating', 'action_required', 'resolved', 'closed')
  ),
  description text not null,
  reported_by text,
  assigned_owner text,
  escalated boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (tenant_id, incident_key)
);
create index if not exists aipify_hosts_incidents_tenant_status_idx
  on public.aipify_hosts_incidents (tenant_id, incident_status, severity);
alter table public.aipify_hosts_incidents enable row level security;
revoke all on public.aipify_hosts_incidents from authenticated, anon;

create table if not exists public.aipify_hosts_emergency_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  event_key text not null,
  event_type text not null check (
    event_type in (
      'fire', 'flood', 'gas_leak', 'medical_emergency', 'security_threat', 'major_utility_failure'
    )
  ),
  severity text not null default 'critical' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  emergency_status text not null default 'open' check (
    emergency_status in ('open', 'responding', 'resolved', 'closed')
  ),
  description text not null,
  reported_by text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (tenant_id, event_key)
);
create index if not exists aipify_hosts_emergency_events_tenant_idx
  on public.aipify_hosts_emergency_events (tenant_id, emergency_status);
alter table public.aipify_hosts_emergency_events enable row level security;
revoke all on public.aipify_hosts_emergency_events from authenticated, anon;

create table if not exists public.aipify_hosts_emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contact_role text not null check (
    contact_role in ('property_manager', 'emergency_services', 'maintenance_contact', 'backup_contact')
  ),
  contact_name text not null,
  contact_phone text,
  contact_email text,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, contact_role)
);
alter table public.aipify_hosts_emergency_contacts enable row level security;
revoke all on public.aipify_hosts_emergency_contacts from authenticated, anon;

create table if not exists public.aipify_hosts_incident_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_id uuid references public.aipify_hosts_incidents (id) on delete cascade,
  emergency_event_id uuid references public.aipify_hosts_emergency_events (id) on delete cascade,
  timeline_type text not null check (
    timeline_type in ('incident_reported', 'owner_assigned', 'action_taken', 'escalation', 'resolution')
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_incident_timeline_incident_idx
  on public.aipify_hosts_incident_timeline (incident_id, created_at desc);
alter table public.aipify_hosts_incident_timeline enable row level security;
revoke all on public.aipify_hosts_incident_timeline from authenticated, anon;

create table if not exists public.aipify_hosts_incident_recovery_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_id uuid not null references public.aipify_hosts_incidents (id) on delete cascade,
  action_type text not null check (
    action_type in ('create_task', 'assign_owner', 'escalate', 'schedule_inspection', 'initiate_playbook')
  ),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_incident_recovery_actions_tenant_idx
  on public.aipify_hosts_incident_recovery_actions (tenant_id, created_at desc);
alter table public.aipify_hosts_incident_recovery_actions enable row level security;
revoke all on public.aipify_hosts_incident_recovery_actions from authenticated, anon;

create table if not exists public.aipify_hosts_incident_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_incident_center_events_tenant_idx
  on public.aipify_hosts_incident_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_incident_center_events enable row level security;
revoke all on public.aipify_hosts_incident_center_events from authenticated, anon;

create or replace function public._ahostinc_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_incident_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_incident_center_settings;
begin
  insert into public.aipify_hosts_incident_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_incident_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostinc_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_incident_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'incident_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostinc_add_timeline(
  p_tenant_id uuid, p_incident_id uuid, p_emergency_id uuid, p_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_incident_timeline (tenant_id, incident_id, emergency_event_id, timeline_type, summary, context)
  values (p_tenant_id, p_incident_id, p_emergency_id, p_type, p_summary, p_context) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ahostinc_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'incidents', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority,
    title = excluded.title,
    message = excluded.message,
    requires_attention = excluded.requires_attention,
    notification_status = 'unread',
    updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp383_positioning() returns text language sql immutable as $$
  select 'Manage operational disruptions with clarity — incidents, emergencies, recovery actions, and playbooks in one Incident Center.'; $$;

create or replace function public._ahostbp383_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active_incidents', 'label', 'Active Incidents'),
    jsonb_build_object('key', 'emergency_events', 'label', 'Emergency Events'),
    jsonb_build_object('key', 'incident_history', 'label', 'Incident History'),
    jsonb_build_object('key', 'recovery_actions', 'label', 'Recovery Actions'),
    jsonb_build_object('key', 'incident_playbooks', 'label', 'Incident Playbooks')
  ); $$;

create or replace function public._ahostbp383_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'guest_complaint', 'property_damage', 'noise_complaint', 'access_problem', 'cleaning_failure',
    'maintenance_failure', 'safety_concern', 'utility_outage', 'security_concern', 'other'
  ); $$;

create or replace function public._ahostbp383_emergency_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'fire', 'flood', 'gas_leak', 'medical_emergency', 'security_threat', 'major_utility_failure'
  ); $$;

create or replace function public._ahostbp383_playbooks() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'guest_complaint', 'label', 'Guest Complaint Playbook', 'steps', jsonb_build_array(
      'Acknowledge guest concern', 'Review reservation details', 'Assign owner', 'Document resolution', 'Follow up with guest'
    )),
    jsonb_build_object('key', 'access_failure', 'label', 'Access Failure Playbook', 'steps', jsonb_build_array(
      'Verify lock code status', 'Contact guest immediately', 'Dispatch backup access', 'Document root cause', 'Close incident'
    )),
    jsonb_build_object('key', 'safety_incident', 'label', 'Safety Incident Playbook', 'steps', jsonb_build_array(
      'Assess immediate risk', 'Notify emergency contacts', 'Escalate to owner', 'Schedule inspection', 'Document resolution'
    )),
    jsonb_build_object('key', 'property_damage', 'label', 'Property Damage Playbook', 'steps', jsonb_build_array(
      'Document damage with photos', 'Assess severity', 'Assign maintenance', 'Schedule repair', 'Update property record'
    ))
  ); $$;

create or replace function public._ahostinc_row(p_i public.aipify_hosts_incidents, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_i.id,
    'incident_key', p_i.incident_key,
    'property', coalesce(p_property, '—'),
    'property_id', p_i.property_id,
    'incident_type', p_i.incident_type,
    'severity', p_i.severity,
    'status', p_i.incident_status,
    'description', p_i.description,
    'reported_by', coalesce(p_i.reported_by, '—'),
    'assigned_owner', coalesce(p_i.assigned_owner, '—'),
    'escalated', p_i.escalated,
    'created_at', to_char(p_i.created_at, 'YYYY-MM-DD HH24:MI'),
    'resolved_at', case when p_i.resolved_at is not null then to_char(p_i.resolved_at, 'YYYY-MM-DD HH24:MI') else null end
  ); $$;

create or replace function public._ahostinc_emergency_row(p_e public.aipify_hosts_emergency_events, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_e.id,
    'event_key', p_e.event_key,
    'property', coalesce(p_property, '—'),
    'property_id', p_e.property_id,
    'event_type', p_e.event_type,
    'severity', p_e.severity,
    'status', p_e.emergency_status,
    'description', p_e.description,
    'reported_by', coalesce(p_e.reported_by, '—'),
    'created_at', to_char(p_e.created_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostinc_seed_contacts(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_emergency_contacts (tenant_id, contact_role, contact_name, contact_phone, contact_email)
  values
    (p_tenant_id, 'property_manager', 'Property Manager', '+47 400 00 001', 'manager@example.com'),
    (p_tenant_id, 'emergency_services', 'Emergency Services', '112', null),
    (p_tenant_id, 'maintenance_contact', 'Maintenance Lead', '+47 400 00 002', 'maintenance@example.com'),
    (p_tenant_id, 'backup_contact', 'Backup Contact', '+47 400 00 003', 'backup@example.com')
  on conflict (tenant_id, contact_role) do nothing;
end; $$;

create or replace function public._ahostinc_seed_incidents(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_incidents where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  insert into public.aipify_hosts_incidents (
    tenant_id, property_id, incident_key, incident_type, severity, incident_status,
    description, reported_by, assigned_owner
  ) values
    (p_tenant_id, v_prop, 'inc_001', 'guest_complaint', 'medium', 'investigating',
      'Guest reported noise from adjacent unit after 22:00', 'Guest — Booking #4821', 'Property Manager'),
    (p_tenant_id, v_prop, 'inc_002', 'access_problem', 'high', 'action_required',
      'Smart lock failed — guest unable to enter property', 'Guest — Airbnb', null),
    (p_tenant_id, v_prop, 'inc_003', 'cleaning_failure', 'medium', 'open',
      'Turnover cleaning incomplete — bathroom not ready', 'Cleaner Team', null),
    (p_tenant_id, v_prop, 'inc_004', 'safety_concern', 'critical', 'investigating',
      'Smoke detector reported as non-functional during stay', 'Guest', 'Owner'),
    (p_tenant_id, v_prop, 'inc_005', 'property_damage', 'high', 'resolved',
      'Minor water damage reported in kitchen area', 'Property Manager', 'Maintenance Lead');
  update public.aipify_hosts_incidents set resolved_at = now() - interval '2 days'
  where tenant_id = p_tenant_id and incident_key = 'inc_005';
  perform public._ahostinc_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_incidents where tenant_id = p_tenant_id and incident_key = 'inc_001'),
    null, 'incident_reported', 'Guest complaint reported', '{}'::jsonb);
  perform public._ahostinc_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_incidents where tenant_id = p_tenant_id and incident_key = 'inc_001'),
    null, 'owner_assigned', 'Assigned to Property Manager', '{}'::jsonb);
end; $$;

create or replace function public._ahostinc_seed_emergencies(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_emergency_events where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  insert into public.aipify_hosts_emergency_events (
    tenant_id, property_id, event_key, event_type, severity, emergency_status, description, reported_by
  ) values
    (p_tenant_id, v_prop, 'emg_001', 'major_utility_failure', 'critical', 'responding',
      'Complete power outage reported — backup generator status unknown', 'Property Manager');
end; $$;

create or replace function public._ahostinc_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'active_incidents', (select count(*)::int from public.aipify_hosts_incidents
      where tenant_id = p_tenant_id and incident_status not in ('resolved', 'closed')),
    'critical_incidents', (select count(*)::int from public.aipify_hosts_incidents
      where tenant_id = p_tenant_id and severity = 'critical' and incident_status not in ('resolved', 'closed')),
    'open_emergencies', (select count(*)::int from public.aipify_hosts_emergency_events
      where tenant_id = p_tenant_id and emergency_status in ('open', 'responding')),
    'recovery_actions_count', (select count(*)::int from public.aipify_hosts_incident_recovery_actions
      where tenant_id = p_tenant_id and created_at > now() - interval '30 days')
  ); $$;

create or replace function public.get_aipify_hosts_incident_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_ic public.aipify_hosts_incident_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_ic := public._ahostinc_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ic.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp383_positioning(),
    'route', '/app/aipify-hosts/incidents',
    'stats', public._ahostinc_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_incident_center_dashboard(
  p_section text default 'active_incidents',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_ic public.aipify_hosts_incident_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_properties jsonb; v_contacts jsonb; v_timeline jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_ic := public._ahostinc_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_ic.default_section, 'active_incidents');
  perform public._ahostinc_seed_contacts(v_tenant_id);
  perform public._ahostinc_seed_incidents(v_tenant_id);
  perform public._ahostinc_seed_emergencies(v_tenant_id);
  perform public._ahostinc_log_event(v_tenant_id, 'dashboard_view', 'Incident Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
  into v_properties from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status <> 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'contact_role', c.contact_role, 'contact_name', c.contact_name,
    'contact_phone', c.contact_phone, 'contact_email', c.contact_email
  ) order by c.contact_role), '[]'::jsonb) into v_contacts
  from public.aipify_hosts_emergency_contacts c where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(x order by x->>'created_at' desc), '[]'::jsonb) into v_timeline
  from (
    select jsonb_build_object(
      'id', t.id, 'incident_id', t.incident_id, 'timeline_type', t.timeline_type,
      'summary', t.summary, 'created_at', to_char(t.created_at, 'YYYY-MM-DD HH24:MI')
    ) as x
    from public.aipify_hosts_incident_timeline t
    where t.tenant_id = v_tenant_id
    order by t.created_at desc
    limit 20
  ) s;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_ic.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp383_positioning(),
    'governance', jsonb_build_object(
      'audit_incident_creation', true,
      'audit_severity_changes', true,
      'audit_escalations', true,
      'audit_resolutions', true
    ),
    'sections', public._ahostbp383_sections(),
    'incident_categories', public._ahostbp383_categories(),
    'severity_levels', jsonb_build_array('low', 'medium', 'high', 'critical'),
    'incident_statuses', jsonb_build_array('open', 'investigating', 'action_required', 'resolved', 'closed'),
    'emergency_types', public._ahostbp383_emergency_types(),
    'emergency_statuses', jsonb_build_array('open', 'responding', 'resolved', 'closed'),
    'recovery_action_types', jsonb_build_array('create_task', 'assign_owner', 'escalate', 'schedule_inspection', 'initiate_playbook'),
    'playbooks', public._ahostbp383_playbooks(),
    'stats', public._ahostinc_dashboard_stats(v_tenant_id),
    'properties', v_properties,
    'emergency_contacts', v_contacts,
    'timeline', v_timeline,
    'active_incidents', (
      select coalesce(jsonb_agg(public._ahostinc_row(i, coalesce(p.display_name, '—')) order by
        case i.severity when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end, i.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_incidents i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.incident_status not in ('resolved', 'closed')
    ),
    'emergency_events', (
      select coalesce(jsonb_agg(public._ahostinc_emergency_row(e, coalesce(p.display_name, '—')) order by e.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_emergency_events e
      left join public.aipify_hosts_properties p on p.id = e.property_id
      where e.tenant_id = v_tenant_id and e.emergency_status not in ('resolved', 'closed')
    ),
    'incident_history', (
      select coalesce(jsonb_agg(public._ahostinc_row(i, coalesce(p.display_name, '—')) order by i.updated_at desc), '[]'::jsonb)
      from public.aipify_hosts_incidents i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.incident_status in ('resolved', 'closed')
    ),
    'recovery_actions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', r.id, 'incident_id', r.incident_id, 'action_type', r.action_type,
        'summary', r.summary, 'created_at', to_char(r.created_at, 'YYYY-MM-DD HH24:MI')
      ) order by r.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_incident_recovery_actions r where r.tenant_id = v_tenant_id
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 21 — Incident Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_21_INCIDENT_CENTER.text',
      'route', '/app/aipify-hosts/incidents'
    )
  );
end; $$;

create or replace function public.create_aipify_hosts_incident(
  p_incident_type text,
  p_description text,
  p_property_id uuid default null,
  p_severity text default 'medium',
  p_reported_by text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_description), '') = '' then raise exception 'Description required'; end if;
  v_key := 'inc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_incidents (
    tenant_id, property_id, incident_key, incident_type, severity, description, reported_by
  ) values (
    v_tenant_id, p_property_id, v_key, p_incident_type, coalesce(p_severity, 'medium'), trim(p_description), p_reported_by
  ) returning id into v_id;
  perform public._ahostinc_add_timeline(v_tenant_id, v_id, null, 'incident_reported', 'Incident reported', '{}'::jsonb);
  perform public._ahostinc_log_event(v_tenant_id, 'incident_created', 'Incident created',
    jsonb_build_object('incident_id', v_id, 'severity', p_severity));
  if coalesce(p_severity, 'medium') = 'critical' then
    perform public._ahostinc_push_notification(v_tenant_id, 'inc_' || v_id::text, 'critical',
      'Critical incident created', left(trim(p_description), 120));
  end if;
  return jsonb_build_object('success', true, 'incident_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_incident_status(
  p_incident_id uuid, p_status text, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_status not in ('open', 'investigating', 'action_required', 'resolved', 'closed') then
    raise exception 'Invalid status';
  end if;
  update public.aipify_hosts_incidents set
    incident_status = p_status,
    resolved_at = case when p_status in ('resolved', 'closed') then now() else resolved_at end,
    updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id;
  if p_status in ('resolved', 'closed') then
    perform public._ahostinc_add_timeline(v_tenant_id, p_incident_id, null, 'resolution', 'Incident ' || p_status, '{}'::jsonb);
    perform public._ahostinc_log_event(v_tenant_id, 'incident_resolved', 'Incident resolution recorded',
      jsonb_build_object('incident_id', p_incident_id, 'status', p_status));
    perform public._ahostinc_push_notification(v_tenant_id, 'inc_res_' || p_incident_id::text, 'important',
      'Resolution completed', 'An incident has been marked as ' || p_status);
  end if;
  return jsonb_build_object('success', true, 'incident_id', p_incident_id, 'status', p_status);
end; $$;

create or replace function public.update_aipify_hosts_incident_severity(
  p_incident_id uuid, p_severity text, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_severity not in ('low', 'medium', 'high', 'critical') then raise exception 'Invalid severity'; end if;
  update public.aipify_hosts_incidents set severity = p_severity, updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id;
  perform public._ahostinc_log_event(v_tenant_id, 'severity_changed', 'Incident severity updated',
    jsonb_build_object('incident_id', p_incident_id, 'severity', p_severity));
  if p_severity = 'critical' then
    perform public._ahostinc_push_notification(v_tenant_id, 'inc_sev_' || p_incident_id::text, 'critical',
      'Critical incident severity', 'Incident severity raised to critical');
  end if;
  return jsonb_build_object('success', true, 'incident_id', p_incident_id, 'severity', p_severity);
end; $$;

create or replace function public.assign_aipify_hosts_incident_owner(
  p_incident_id uuid, p_owner text, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_incidents set assigned_owner = p_owner, updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id;
  perform public._ahostinc_add_timeline(v_tenant_id, p_incident_id, null, 'owner_assigned',
    'Owner assigned: ' || coalesce(p_owner, '—'), '{}'::jsonb);
  insert into public.aipify_hosts_incident_recovery_actions (tenant_id, incident_id, action_type, summary)
  values (v_tenant_id, p_incident_id, 'assign_owner', 'Assigned owner: ' || coalesce(p_owner, '—'));
  return jsonb_build_object('success', true, 'incident_id', p_incident_id);
end; $$;

create or replace function public.escalate_aipify_hosts_incident(
  p_incident_id uuid, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_severity text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select severity into v_severity from public.aipify_hosts_incidents where id = p_incident_id and tenant_id = v_tenant_id;
  update public.aipify_hosts_incidents set
    escalated = true,
    incident_status = 'action_required',
    severity = case v_severity when 'critical' then 'critical' when 'high' then 'critical' else 'high' end,
    updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id;
  perform public._ahostinc_add_timeline(v_tenant_id, p_incident_id, null, 'escalation', 'Incident escalated', '{}'::jsonb);
  perform public._ahostinc_log_event(v_tenant_id, 'incident_escalated', 'Incident escalated',
    jsonb_build_object('incident_id', p_incident_id));
  insert into public.aipify_hosts_incident_recovery_actions (tenant_id, incident_id, action_type, summary)
  values (v_tenant_id, p_incident_id, 'escalate', 'Incident escalated for immediate attention');
  perform public._ahostinc_push_notification(v_tenant_id, 'inc_esc_' || p_incident_id::text, 'critical',
    'Incident escalated', 'An incident has been escalated and requires immediate attention');
  return jsonb_build_object('success', true, 'incident_id', p_incident_id);
end; $$;

create or replace function public.report_aipify_hosts_emergency_event(
  p_event_type text,
  p_description text,
  p_property_id uuid default null,
  p_reported_by text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_description), '') = '' then raise exception 'Description required'; end if;
  v_key := 'emg_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_emergency_events (
    tenant_id, property_id, event_key, event_type, description, reported_by
  ) values (v_tenant_id, p_property_id, v_key, p_event_type, trim(p_description), p_reported_by)
  returning id into v_id;
  perform public._ahostinc_add_timeline(v_tenant_id, null, v_id, 'incident_reported',
    'Emergency event reported: ' || p_event_type, '{}'::jsonb);
  perform public._ahostinc_log_event(v_tenant_id, 'emergency_reported', 'Emergency event reported',
    jsonb_build_object('emergency_id', v_id, 'event_type', p_event_type));
  perform public._ahostinc_push_notification(v_tenant_id, 'emg_' || v_id::text, 'critical',
    'Emergency event reported', left(trim(p_description), 120));
  return jsonb_build_object('success', true, 'emergency_id', v_id);
end; $$;

create or replace function public.perform_aipify_hosts_incident_recovery_action(
  p_incident_id uuid,
  p_action_type text,
  p_summary text default null,
  p_assignee_role text default null,
  p_playbook_key text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_inc public.aipify_hosts_incidents; v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into v_inc from public.aipify_hosts_incidents where id = p_incident_id and tenant_id = v_tenant_id;
  if v_inc.id is null then raise exception 'Incident not found'; end if;
  v_summary := coalesce(nullif(trim(p_summary), ''), p_action_type);

  if p_action_type = 'create_task' then
    v_task_key := 'task_inc_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority, assignee_role
    ) values (
      v_tenant_id, v_inc.property_id, v_task_key, 'Incident follow-up: ' || left(v_inc.description, 80),
      v_inc.description, 'maintenance', v_inc.severity, p_assignee_role
    );
    v_summary := 'Recovery task created from incident';
  elsif p_action_type = 'schedule_inspection' then
    v_task_key := 'task_insp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority, scheduled_for
    ) values (
      v_tenant_id, v_inc.property_id, v_task_key, 'Inspection scheduled — incident review',
      v_inc.description, 'inspection', v_inc.severity, current_date + 1
    );
    v_summary := 'Inspection scheduled for next business day';
  elsif p_action_type = 'initiate_playbook' then
    if coalesce(p_playbook_key, '') = '' then raise exception 'playbook_key required'; end if;
    insert into public.aipify_hosts_playbook_runs (tenant_id, property_id, playbook_key, initiated_by)
    values (v_tenant_id, v_inc.property_id, p_playbook_key, auth.uid());
    v_summary := 'Playbook initiated: ' || p_playbook_key;
  elsif p_action_type not in ('assign_owner', 'escalate') then
    raise exception 'Invalid recovery action';
  end if;

  insert into public.aipify_hosts_incident_recovery_actions (tenant_id, incident_id, action_type, summary)
  values (v_tenant_id, p_incident_id, p_action_type, v_summary);
  perform public._ahostinc_add_timeline(v_tenant_id, p_incident_id, null, 'action_taken', v_summary, '{}'::jsonb);
  perform public._ahostinc_log_event(v_tenant_id, 'recovery_action', v_summary,
    jsonb_build_object('incident_id', p_incident_id, 'action_type', p_action_type));
  return jsonb_build_object('success', true, 'incident_id', p_incident_id, 'action_type', p_action_type);
end; $$;

create or replace function public.initiate_aipify_hosts_incident_playbook(
  p_incident_id uuid, p_playbook_key text, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.perform_aipify_hosts_incident_recovery_action(
    p_incident_id, 'initiate_playbook', null, null, p_playbook_key, p_org_id
  );
end; $$;

create or replace function public.seed_aipify_hosts_incident_center_knowledge_airbnb21()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-incidents', 'Hosts Incident Center',
    'Handling guest complaints, emergency preparedness, escalation, and property recovery.', 290
  );
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'handling-guest-complaints', 'Handling guest complaints',
    'Acknowledge promptly, assign an owner, document actions, and follow up until resolution.');
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'emergency-preparedness', 'Emergency preparedness',
    'Maintain emergency contacts, verify access to services, and review procedures quarterly.');
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'incident-escalation-procedures', 'Incident escalation procedures',
    'Escalate when severity is high or critical, response is delayed, or guest safety is at risk.');
  perform public._ahostkc_seed_article('aipify-hosts-incidents', 'property-recovery-standards', 'Property recovery standards',
    'Document damage, schedule inspections, assign maintenance, and close incidents only after verification.');
end; $$;

select public.seed_aipify_hosts_incident_center_knowledge_airbnb21();

grant execute on function public.get_aipify_hosts_incident_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_incident_center_dashboard(text, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_incident(text, text, uuid, text, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_incident_status(uuid, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_incident_severity(uuid, text, uuid) to authenticated;
grant execute on function public.assign_aipify_hosts_incident_owner(uuid, text, uuid) to authenticated;
grant execute on function public.escalate_aipify_hosts_incident(uuid, uuid) to authenticated;
grant execute on function public.report_aipify_hosts_emergency_event(text, text, uuid, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_incident_recovery_action(uuid, text, text, text, text, uuid) to authenticated;
grant execute on function public.initiate_aipify_hosts_incident_playbook(uuid, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_incident_center_knowledge_airbnb21() to authenticated;

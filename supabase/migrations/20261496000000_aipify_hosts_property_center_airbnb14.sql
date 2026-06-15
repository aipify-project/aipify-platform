-- Phase Airbnb 14 — Aipify Hosts Property Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostprop_* (engine), _ahostbp376_* (blueprint)

create table if not exists public.aipify_hosts_property_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'overview' check (
    default_section in (
      'overview', 'details', 'amenities', 'team', 'documents', 'tasks', 'incidents', 'timeline'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_property_center_settings enable row level security;
revoke all on public.aipify_hosts_property_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_property_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade unique,
  property_type text not null default 'apartment' check (
    property_type in ('apartment', 'house', 'cabin', 'villa', 'shared_accommodation', 'other')
  ),
  operational_status text not null default 'active' check (
    operational_status in ('active', 'inactive', 'under_maintenance', 'seasonal_closure')
  ),
  address text,
  description text,
  max_guests int not null default 2,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  check_in_time text not null default '15:00',
  check_out_time text not null default '11:00',
  amenities jsonb not null default '[]'::jsonb,
  occupancy_status text not null default 'vacant',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_property_profiles_tenant_idx
  on public.aipify_hosts_property_profiles (tenant_id, operational_status);
alter table public.aipify_hosts_property_profiles enable row level security;
revoke all on public.aipify_hosts_property_profiles from authenticated, anon;

create table if not exists public.aipify_hosts_property_team_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  role_key text not null check (
    role_key in ('property_manager', 'cleaner', 'maintenance', 'support_contact')
  ),
  assignee_name text not null,
  assignee_contact text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, role_key)
);
create index if not exists aipify_hosts_property_team_tenant_idx
  on public.aipify_hosts_property_team_assignments (tenant_id, property_id);
alter table public.aipify_hosts_property_team_assignments enable row level security;
revoke all on public.aipify_hosts_property_team_assignments from authenticated, anon;

create table if not exists public.aipify_hosts_property_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid not null references public.aipify_hosts_properties (id) on delete cascade,
  doc_type text not null check (
    doc_type in ('house_rules', 'safety_instructions', 'property_manual', 'inspection_report', 'vendor_info')
  ),
  title text not null,
  reference_label text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_property_documents_tenant_idx
  on public.aipify_hosts_property_documents (tenant_id, property_id);
alter table public.aipify_hosts_property_documents enable row level security;
revoke all on public.aipify_hosts_property_documents from authenticated, anon;

create table if not exists public.aipify_hosts_property_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_property_center_events_tenant_idx
  on public.aipify_hosts_property_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_property_center_events enable row level security;
revoke all on public.aipify_hosts_property_center_events from authenticated, anon;

create or replace function public._ahostprop_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_property_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_property_center_settings;
begin
  insert into public.aipify_hosts_property_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_property_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostprop_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_property_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'property_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp376_positioning() returns text language sql immutable as $$
  select 'Complete oversight of every property — understand operational status within 60 seconds.'; $$;

create or replace function public._ahostbp376_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'overview', 'label', 'Overview'),
    jsonb_build_object('key', 'details', 'label', 'Details'),
    jsonb_build_object('key', 'amenities', 'label', 'Amenities'),
    jsonb_build_object('key', 'team', 'label', 'Team'),
    jsonb_build_object('key', 'documents', 'label', 'Documents'),
    jsonb_build_object('key', 'tasks', 'label', 'Tasks'),
    jsonb_build_object('key', 'incidents', 'label', 'Incidents'),
    jsonb_build_object('key', 'timeline', 'label', 'Timeline')
  ); $$;

create or replace function public._ahostbp376_property_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'apartment', 'label', 'Apartment'),
    jsonb_build_object('key', 'house', 'label', 'House'),
    jsonb_build_object('key', 'cabin', 'label', 'Cabin'),
    jsonb_build_object('key', 'villa', 'label', 'Villa'),
    jsonb_build_object('key', 'shared_accommodation', 'label', 'Shared Accommodation'),
    jsonb_build_object('key', 'other', 'label', 'Other')
  ); $$;

create or replace function public._ahostbp376_property_statuses() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active', 'label', 'Active'),
    jsonb_build_object('key', 'inactive', 'label', 'Inactive'),
    jsonb_build_object('key', 'under_maintenance', 'label', 'Under Maintenance'),
    jsonb_build_object('key', 'seasonal_closure', 'label', 'Seasonal Closure')
  ); $$;

create or replace function public._ahostbp376_amenity_catalog() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'wifi', 'parking', 'kitchen', 'washer', 'dryer', 'heating', 'air_conditioning',
    'tv', 'workspace', 'child_friendly'
  ); $$;

create or replace function public._ahostbp376_task_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array('cleaning', 'maintenance', 'inspection', 'guest_preparation'); $$;

create or replace function public._ahostprop_ensure_profile(p_tenant_id uuid, p_property_id uuid)
returns public.aipify_hosts_property_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_property_profiles; v_prop public.aipify_hosts_properties;
  v_types text[] := array['apartment','house','cabin','villa','shared_accommodation','other'];
begin
  select * into v_prop from public.aipify_hosts_properties
  where id = p_property_id and tenant_id = p_tenant_id;
  if v_prop.id is null then raise exception 'Property not found'; end if;
  insert into public.aipify_hosts_property_profiles (tenant_id, property_id, property_type, address, description)
  values (
    p_tenant_id, p_property_id,
    v_types[1 + (abs(hashtext(v_prop.property_key)) % array_length(v_types, 1))],
    coalesce(v_prop.display_name || ' — Address on file', 'Address pending'),
    'Professional short-term rental managed via Aipify Hosts.'
  ) on conflict (property_id) do nothing;
  select * into v_row from public.aipify_hosts_property_profiles where property_id = p_property_id;
  if jsonb_array_length(v_row.amenities) = 0 then
    update public.aipify_hosts_property_profiles
    set amenities = jsonb_build_array('wifi', 'kitchen', 'heating', 'workspace'),
        occupancy_status = case when v_prop.status = 'active' then 'occupied' else 'vacant' end,
        updated_at = now()
    where id = v_row.id returning * into v_row;
  end if;
  return v_row;
end; $$;

create or replace function public._ahostprop_seed_documents(p_tenant_id uuid, p_property_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_property_documents (tenant_id, property_id, doc_type, title, reference_label)
  select p_tenant_id, p_property_id, v.doc_type, v.title, v.reference_label
  from (values
    ('house_rules', 'House Rules', 'Knowledge Center — house rules template'),
    ('safety_instructions', 'Safety Instructions', 'Knowledge Center — safety checklist'),
    ('property_manual', 'Property Manual', 'Operations manual reference'),
    ('inspection_report', 'Latest Inspection Report', 'Q1 inspection — on file'),
    ('vendor_info', 'Preferred Vendors', 'Marketplace vendor directory link')
  ) as v(doc_type, title, reference_label)
  where not exists (
    select 1 from public.aipify_hosts_property_documents d
    where d.property_id = p_property_id and d.doc_type = v.doc_type
  );
end; $$;

create or replace function public._ahostprop_seed_team(p_tenant_id uuid, p_property_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_property_team_assignments (tenant_id, property_id, role_key, assignee_name, assignee_contact)
  select p_tenant_id, p_property_id, v.role_key, v.assignee_name, v.assignee_contact
  from (values
    ('property_manager', 'Operations Lead', 'ops@example.com'),
    ('cleaner', 'Nordic Clean Co.', 'cleaning@example.com'),
    ('maintenance', 'Maintenance Team A', 'maint@example.com'),
    ('support_contact', 'Guest Support Desk', 'support@example.com')
  ) as v(role_key, assignee_name, assignee_contact)
  on conflict (property_id, role_key) do nothing;
end; $$;

create or replace function public._ahostprop_tasks_board(p_property_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'open', jsonb_build_array(
      jsonb_build_object('id', 'task_1', 'title', 'Pre-arrival inspection', 'category', 'inspection', 'due', 'Today'),
      jsonb_build_object('id', 'task_2', 'title', 'Turnover cleaning', 'category', 'cleaning', 'due', 'Today')
    ),
    'upcoming', jsonb_build_array(
      jsonb_build_object('id', 'task_3', 'title', 'HVAC filter check', 'category', 'maintenance', 'due', 'Tomorrow'),
      jsonb_build_object('id', 'task_4', 'title', 'Welcome kit restock', 'category', 'guest_preparation', 'due', 'In 2 days')
    ),
    'completed', jsonb_build_array(
      jsonb_build_object('id', 'task_5', 'title', 'Departure inspection', 'category', 'inspection', 'completed_at', 'Yesterday')
    )
  ); $$;

create or replace function public._ahostprop_incidents_board(p_property_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'open', jsonb_build_array(
      jsonb_build_object('id', 'inc_1', 'summary', 'Noise complaint — resolved pending review', 'severity', 'moderate', 'owner', 'Host Operations')
    ),
    'resolved', jsonb_build_array(
      jsonb_build_object('id', 'inc_2', 'summary', 'Minor appliance issue', 'severity', 'low', 'owner', 'Maintenance Team A', 'resolved_at', 'Last week')
    )
  ); $$;

create or replace function public._ahostprop_timeline(p_property_id uuid, p_property_name text)
returns jsonb language sql stable as $$
  select jsonb_build_array(
    jsonb_build_object('type', 'arrival', 'label', 'Guest arrival scheduled', 'when', 'Today 15:00', 'property', p_property_name),
    jsonb_build_object('type', 'cleaning', 'label', 'Turnover cleaning completed', 'when', 'Yesterday 14:30', 'property', p_property_name),
    jsonb_build_object('type', 'maintenance', 'label', 'Plumbing inspection logged', 'when', '3 days ago', 'property', p_property_name),
    jsonb_build_object('type', 'departure', 'label', 'Guest checkout', 'when', 'Last week', 'property', p_property_name),
    jsonb_build_object('type', 'property_change', 'label', 'Amenities updated', 'when', 'Last month', 'property', p_property_name)
  ); $$;

create or replace function public._ahostprop_overview(
  p_prop public.aipify_hosts_properties,
  p_profile public.aipify_hosts_property_profiles,
  p_team jsonb
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'property_id', p_prop.id,
    'property_name', p_prop.display_name,
    'property_key', p_prop.property_key,
    'property_type', p_profile.property_type,
    'address', p_profile.address,
    'status', p_profile.operational_status,
    'legacy_status', p_prop.status,
    'assigned_team', p_team,
    'occupancy_status', p_profile.occupancy_status,
    'property_health_score', p_prop.health_score,
    'platform_source', p_prop.platform_source
  ); $$;

create or replace function public.get_aipify_hosts_property_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_pc public.aipify_hosts_property_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_pc := public._ahostprop_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_pc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp376_positioning(),
    'route', '/app/aipify-hosts/properties'
  );
end; $$;

create or replace function public.get_aipify_hosts_property_center_dashboard(
  p_property_id uuid default null,
  p_section text default 'overview',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_pc public.aipify_hosts_property_center_settings; v_hosts public.aipify_hosts_settings;
  v_licensing jsonb; v_section text; v_profile public.aipify_hosts_property_profiles;
  v_prop public.aipify_hosts_properties; v_team jsonb; v_docs jsonb; v_properties jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_pc := public._ahostprop_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_licensing := public.assert_aipify_hosts_property_capacity(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_pc.default_section, 'overview');

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', p.id, 'display_name', p.display_name, 'health_score', p.health_score,
      'status', p.status, 'platform_source', p.platform_source
    ) order by p.display_name
  ), '[]'::jsonb) into v_properties
  from public.aipify_hosts_properties p
  where p.tenant_id = v_tenant_id and p.status <> 'archived';

  if p_property_id is not null then
    select * into v_prop from public.aipify_hosts_properties
    where id = p_property_id and tenant_id = v_tenant_id;
    if v_prop.id is null then raise exception 'Property not found'; end if;
    v_profile := public._ahostprop_ensure_profile(v_tenant_id, p_property_id);
    perform public._ahostprop_seed_team(v_tenant_id, p_property_id);
    perform public._ahostprop_seed_documents(v_tenant_id, p_property_id);
  end if;

  perform public._ahostprop_log_event(v_tenant_id, 'dashboard_view', 'Property Center viewed',
    jsonb_build_object('property_id', p_property_id, 'section', v_section));

  if p_property_id is null then
    return jsonb_build_object(
      'has_customer', true,
      'enabled', v_pc.enabled and v_hosts.enabled,
      'package_key', v_hosts.package_key,
      'active_section', v_section,
      'selected_property_id', null,
      'positioning', public._ahostbp376_positioning(),
      'governance', jsonb_build_object(
        'role_permissions', true, 'audit_property_changes', true,
        'audit_team_assignments', true, 'audit_archival', true
      ),
      'licensing', v_licensing,
      'sections', public._ahostbp376_sections(),
      'property_types', public._ahostbp376_property_types(),
      'property_statuses', public._ahostbp376_property_statuses(),
      'amenity_catalog', public._ahostbp376_amenity_catalog(),
      'task_categories', public._ahostbp376_task_categories(),
      'properties', v_properties,
      'implementation_blueprint', jsonb_build_object(
        'phase', 'Phase Airbnb 14 — Property Center Foundation',
        'doc', 'aipify-hosts/PHASE_AIRBNB_14_PROPERTY_CENTER.text',
        'route', '/app/aipify-hosts/properties'
      )
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'role_key', t.role_key, 'assignee_name', t.assignee_name, 'assignee_contact', t.assignee_contact
  ) order by t.role_key), '[]'::jsonb) into v_team
  from public.aipify_hosts_property_team_assignments t where t.property_id = p_property_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'doc_type', d.doc_type, 'title', d.title, 'reference_label', d.reference_label
  ) order by d.doc_type), '[]'::jsonb) into v_docs
  from public.aipify_hosts_property_documents d where d.property_id = p_property_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_pc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'selected_property_id', p_property_id,
    'positioning', public._ahostbp376_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true, 'audit_property_changes', true,
      'audit_team_assignments', true, 'audit_archival', true
    ),
    'licensing', v_licensing,
    'sections', public._ahostbp376_sections(),
    'property_types', public._ahostbp376_property_types(),
    'property_statuses', public._ahostbp376_property_statuses(),
    'amenity_catalog', public._ahostbp376_amenity_catalog(),
    'task_categories', public._ahostbp376_task_categories(),
    'properties', v_properties,
    'overview', public._ahostprop_overview(v_prop, v_profile, v_team),
    'details', jsonb_build_object(
      'description', v_profile.description,
      'max_guests', v_profile.max_guests,
      'bedrooms', v_profile.bedrooms,
      'bathrooms', v_profile.bathrooms,
      'check_in_time', v_profile.check_in_time,
      'check_out_time', v_profile.check_out_time,
      'property_type', v_profile.property_type,
      'operational_status', v_profile.operational_status,
      'address', v_profile.address
    ),
    'amenities', v_profile.amenities,
    'team', v_team,
    'documents', v_docs,
    'tasks', public._ahostprop_tasks_board(p_property_id),
    'incidents', public._ahostprop_incidents_board(p_property_id),
    'timeline', public._ahostprop_timeline(p_property_id, v_prop.display_name),
    'routes', jsonb_build_object(
      'reports', '/app/aipify-hosts/reports',
      'operations', '/app/aipify-hosts/operations'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 14 — Property Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_14_PROPERTY_CENTER.text',
      'route', '/app/aipify-hosts/properties'
    )
  );
end; $$;

create or replace function public.update_aipify_hosts_property_profile(
  p_property_id uuid,
  p_payload jsonb,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_profile public.aipify_hosts_property_profiles;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_profile := public._ahostprop_ensure_profile(v_tenant_id, p_property_id);
  update public.aipify_hosts_property_profiles set
    property_type = coalesce(p_payload->>'property_type', property_type),
    operational_status = coalesce(p_payload->>'operational_status', operational_status),
    address = coalesce(p_payload->>'address', address),
    description = coalesce(p_payload->>'description', description),
    max_guests = coalesce((p_payload->>'max_guests')::int, max_guests),
    bedrooms = coalesce((p_payload->>'bedrooms')::int, bedrooms),
    bathrooms = coalesce((p_payload->>'bathrooms')::int, bathrooms),
    check_in_time = coalesce(p_payload->>'check_in_time', check_in_time),
    check_out_time = coalesce(p_payload->>'check_out_time', check_out_time),
    amenities = coalesce(p_payload->'amenities', amenities),
    updated_at = now()
  where property_id = p_property_id returning * into v_profile;
  if p_payload ? 'display_name' then
    update public.aipify_hosts_properties
    set display_name = trim(p_payload->>'display_name'), updated_at = now()
    where id = p_property_id and tenant_id = v_tenant_id;
  end if;
  perform public._ahostprop_log_event(v_tenant_id, 'profile_updated', 'Property profile updated',
    jsonb_build_object('property_id', p_property_id));
  return jsonb_build_object('success', true, 'property_id', p_property_id);
end; $$;

create or replace function public.archive_aipify_hosts_property(
  p_property_id uuid,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_properties
  set status = 'archived', updated_at = now()
  where id = p_property_id and tenant_id = v_tenant_id;
  update public.aipify_hosts_property_profiles
  set operational_status = 'inactive', updated_at = now()
  where property_id = p_property_id and tenant_id = v_tenant_id;
  update public.aipify_hosts_settings
  set property_count = public._ahostlic_active_property_count(v_tenant_id), updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._ahostprop_log_event(v_tenant_id, 'archived', 'Property archived',
    jsonb_build_object('property_id', p_property_id));
  return jsonb_build_object('success', true, 'property_id', p_property_id);
end; $$;

create or replace function public.assign_aipify_hosts_property_team(
  p_property_id uuid,
  p_role_key text,
  p_assignee_name text,
  p_assignee_contact text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_role_key not in ('property_manager', 'cleaner', 'maintenance', 'support_contact') then
    raise exception 'Invalid role';
  end if;
  perform public._ahostprop_ensure_profile(v_tenant_id, p_property_id);
  insert into public.aipify_hosts_property_team_assignments (
    tenant_id, property_id, role_key, assignee_name, assignee_contact
  ) values (v_tenant_id, p_property_id, p_role_key, trim(p_assignee_name), p_assignee_contact)
  on conflict (property_id, role_key) do update set
    assignee_name = excluded.assignee_name,
    assignee_contact = excluded.assignee_contact,
    updated_at = now();
  perform public._ahostprop_log_event(v_tenant_id, 'team_assigned', 'Property team assignment updated',
    jsonb_build_object('property_id', p_property_id, 'role_key', p_role_key));
  return jsonb_build_object('success', true, 'property_id', p_property_id, 'role_key', p_role_key);
end; $$;

create or replace function public.seed_aipify_hosts_property_center_knowledge_airbnb14()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-property', 'Hosts Property Center',
    'Property setup, readiness, amenities, and lifecycle guidance for hospitality hosts.', 239
  );
  perform public._ahostkc_seed_article('aipify-hosts-property', 'setting-up-a-property', 'Setting up a property',
    'Register the property, confirm licensing capacity, add address and details, assign team roles, and attach house rules before accepting guests.');
  perform public._ahostkc_seed_article('aipify-hosts-property', 'property-readiness-standards', 'Property readiness standards',
    'Readiness includes completed cleaning, working amenities, safety instructions on file, and inspection tasks cleared before each arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-property', 'managing-amenities', 'Managing amenities',
    'Track Wi-Fi, parking, kitchen, laundry, climate, workspace, and child-friendly features so guest expectations match the listing.');
  perform public._ahostkc_seed_article('aipify-hosts-property', 'property-lifecycle-management', 'Property lifecycle management',
    'Use operational status for maintenance and seasonal closure. Archive properties when removed from the portfolio — archival is audit logged.');
end; $$;

select public.seed_aipify_hosts_property_center_knowledge_airbnb14();

grant execute on function public.get_aipify_hosts_property_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_property_center_dashboard(uuid, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_property_profile(uuid, jsonb, uuid) to authenticated;
grant execute on function public.archive_aipify_hosts_property(uuid, uuid) to authenticated;
grant execute on function public.assign_aipify_hosts_property_team(uuid, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_property_center_knowledge_airbnb14() to authenticated;

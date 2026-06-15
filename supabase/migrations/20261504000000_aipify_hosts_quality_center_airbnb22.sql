-- Phase Airbnb 22 — Aipify Hosts Quality Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostqa_* (engine), _ahostbp384_* (blueprint)

create table if not exists public.aipify_hosts_quality_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'upcoming_inspections' check (
    default_section in (
      'upcoming_inspections', 'active_inspections', 'completed_inspections',
      'quality_reviews', 'standards_library'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_quality_center_settings enable row level security;
revoke all on public.aipify_hosts_quality_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_inspections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  inspection_key text not null,
  inspection_type text not null check (
    inspection_type in (
      'arrival', 'departure', 'routine', 'seasonal', 'emergency', 'compliance'
    )
  ),
  inspection_status text not null default 'scheduled' check (
    inspection_status in ('scheduled', 'in_progress', 'awaiting_review', 'approved', 'requires_action')
  ),
  assigned_inspector text,
  scheduled_date date,
  completion_date date,
  inspection_outcome text check (
    inspection_outcome in ('passed', 'passed_with_notes', 'action_required', 'failed')
  ),
  checklist_results jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, inspection_key)
);
create index if not exists aipify_hosts_inspections_tenant_status_idx
  on public.aipify_hosts_inspections (tenant_id, inspection_status, scheduled_date);
alter table public.aipify_hosts_inspections enable row level security;
revoke all on public.aipify_hosts_inspections from authenticated, anon;

create table if not exists public.aipify_hosts_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  inspection_id uuid references public.aipify_hosts_inspections (id) on delete set null,
  property_score numeric(5,2) not null default 0 check (property_score >= 0 and property_score <= 100),
  inspector_notes text,
  recommended_actions text,
  improvement_opportunities text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_quality_reviews_tenant_idx
  on public.aipify_hosts_quality_reviews (tenant_id, created_at desc);
alter table public.aipify_hosts_quality_reviews enable row level security;
revoke all on public.aipify_hosts_quality_reviews from authenticated, anon;

create table if not exists public.aipify_hosts_inspection_corrective_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  inspection_id uuid not null references public.aipify_hosts_inspections (id) on delete cascade,
  action_summary text not null,
  assigned_owner text,
  due_date date,
  escalated boolean not null default false,
  action_status text not null default 'open' check (action_status in ('open', 'in_progress', 'completed', 'overdue')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_inspection_corrective_actions_tenant_idx
  on public.aipify_hosts_inspection_corrective_actions (tenant_id, action_status);
alter table public.aipify_hosts_inspection_corrective_actions enable row level security;
revoke all on public.aipify_hosts_inspection_corrective_actions from authenticated, anon;

create table if not exists public.aipify_hosts_inspection_photo_evidence (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  inspection_id uuid not null references public.aipify_hosts_inspections (id) on delete cascade,
  checklist_category text not null,
  reference_label text not null,
  caption text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_inspection_photo_evidence_inspection_idx
  on public.aipify_hosts_inspection_photo_evidence (inspection_id);
alter table public.aipify_hosts_inspection_photo_evidence enable row level security;
revoke all on public.aipify_hosts_inspection_photo_evidence from authenticated, anon;

create table if not exists public.aipify_hosts_inspection_timeline (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  inspection_id uuid not null references public.aipify_hosts_inspections (id) on delete cascade,
  timeline_type text not null check (
    timeline_type in (
      'inspection_created', 'inspection_started', 'findings_recorded',
      'actions_assigned', 'inspection_closed'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_inspection_timeline_inspection_idx
  on public.aipify_hosts_inspection_timeline (inspection_id, created_at desc);
alter table public.aipify_hosts_inspection_timeline enable row level security;
revoke all on public.aipify_hosts_inspection_timeline from authenticated, anon;

create table if not exists public.aipify_hosts_quality_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_quality_center_events_tenant_idx
  on public.aipify_hosts_quality_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_quality_center_events enable row level security;
revoke all on public.aipify_hosts_quality_center_events from authenticated, anon;

create or replace function public._ahostqa_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_quality_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_quality_center_settings;
begin
  insert into public.aipify_hosts_quality_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_quality_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostqa_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_quality_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'qa_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostqa_add_timeline(
  p_tenant_id uuid, p_inspection_id uuid, p_type text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_inspection_timeline (tenant_id, inspection_id, timeline_type, summary, context)
  values (p_tenant_id, p_inspection_id, p_type, p_summary, p_context) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ahostqa_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'incidents', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp384_positioning() returns text language sql immutable as $$
  select 'Ensure consistent hospitality standards across all properties — inspections, quality reviews, and standards in one Quality Center.'; $$;

create or replace function public._ahostbp384_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'upcoming_inspections', 'label', 'Upcoming Inspections'),
    jsonb_build_object('key', 'active_inspections', 'label', 'Active Inspections'),
    jsonb_build_object('key', 'completed_inspections', 'label', 'Completed Inspections'),
    jsonb_build_object('key', 'quality_reviews', 'label', 'Quality Reviews'),
    jsonb_build_object('key', 'standards_library', 'label', 'Standards Library')
  ); $$;

create or replace function public._ahostbp384_inspection_types() returns jsonb language sql immutable as $$
  select jsonb_build_array('arrival', 'departure', 'routine', 'seasonal', 'emergency', 'compliance'); $$;

create or replace function public._ahostbp384_checklist_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'exterior_condition', 'interior_cleanliness', 'safety_equipment', 'amenities',
    'kitchen_standards', 'bathroom_standards', 'bedroom_standards', 'technology_readiness', 'property_presentation'
  ); $$;

create or replace function public._ahostbp384_standards_library() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'exterior_condition', 'title', 'Exterior Condition', 'expectation', 'Entryways, signage, and exterior surfaces meet brand presentation standards.'),
    jsonb_build_object('key', 'interior_cleanliness', 'title', 'Interior Cleanliness', 'expectation', 'All rooms are clean, odor-free, and ready for guest arrival.'),
    jsonb_build_object('key', 'safety_equipment', 'title', 'Safety Equipment', 'expectation', 'Smoke detectors, fire extinguishers, and emergency exits verified functional.'),
    jsonb_build_object('key', 'amenities', 'title', 'Amenities', 'expectation', 'Listed amenities present, stocked, and in working order.'),
    jsonb_build_object('key', 'kitchen_standards', 'title', 'Kitchen Standards', 'expectation', 'Appliances clean, cookware complete, consumables stocked.'),
    jsonb_build_object('key', 'bathroom_standards', 'title', 'Bathroom Standards', 'expectation', 'Fixtures clean, linens fresh, toiletries replenished.'),
    jsonb_build_object('key', 'bedroom_standards', 'title', 'Bedroom Standards', 'expectation', 'Beds made to spec, linens fresh, storage tidy.'),
    jsonb_build_object('key', 'technology_readiness', 'title', 'Technology Readiness', 'expectation', 'Wi-Fi, locks, thermostats, and entertainment systems operational.'),
    jsonb_build_object('key', 'property_presentation', 'title', 'Property Presentation', 'expectation', 'Staging, lighting, and overall guest-ready presentation verified.')
  ); $$;

create or replace function public._ahostqa_row(p_i public.aipify_hosts_inspections, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_i.id,
    'inspection_key', p_i.inspection_key,
    'property', coalesce(p_property, '—'),
    'property_id', p_i.property_id,
    'inspection_type', p_i.inspection_type,
    'status', p_i.inspection_status,
    'assigned_inspector', coalesce(p_i.assigned_inspector, '—'),
    'scheduled_date', p_i.scheduled_date::text,
    'completion_date', p_i.completion_date::text,
    'outcome', p_i.inspection_outcome,
    'checklist_results', p_i.checklist_results,
    'photo_count', (
      select count(*)::int from public.aipify_hosts_inspection_photo_evidence ph
      where ph.inspection_id = p_i.id
    ),
    'created_at', to_char(p_i.created_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostqa_seed_inspections(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid; v_insp uuid;
begin
  if exists (select 1 from public.aipify_hosts_inspections where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  insert into public.aipify_hosts_inspections (
    tenant_id, property_id, inspection_key, inspection_type, inspection_status,
    assigned_inspector, scheduled_date, completion_date, inspection_outcome
  ) values
    (p_tenant_id, v_prop, 'insp_001', 'arrival', 'scheduled', 'Property Manager', current_date + 2, null, null),
    (p_tenant_id, v_prop, 'insp_002', 'routine', 'in_progress', 'Quality Inspector', current_date, null, null),
    (p_tenant_id, v_prop, 'insp_003', 'departure', 'awaiting_review', 'Cleaner Lead', current_date - 1, null, null),
    (p_tenant_id, v_prop, 'insp_004', 'seasonal', 'approved', 'Owner', current_date - 7, current_date - 6, 'passed'),
    (p_tenant_id, v_prop, 'insp_005', 'compliance', 'requires_action', 'Property Manager', current_date - 14, current_date - 13, 'action_required');
  select id into v_insp from public.aipify_hosts_inspections where tenant_id = p_tenant_id and inspection_key = 'insp_002';
  perform public._ahostqa_add_timeline(p_tenant_id, v_insp, 'inspection_created', 'Routine inspection scheduled', '{}'::jsonb);
  perform public._ahostqa_add_timeline(p_tenant_id, v_insp, 'inspection_started', 'Inspection started', '{}'::jsonb);
  insert into public.aipify_hosts_quality_reviews (tenant_id, property_id, inspection_id, property_score, inspector_notes, recommended_actions, improvement_opportunities)
  select v_tenant_id, v_prop, i.id, 88.5, 'Overall strong presentation with minor kitchen notes.',
    'Restock consumables before next arrival.', 'Consider upgraded bedding in master bedroom.'
  from public.aipify_hosts_inspections i where i.tenant_id = p_tenant_id and i.inspection_key = 'insp_004';
  insert into public.aipify_hosts_inspection_corrective_actions (tenant_id, inspection_id, action_summary, assigned_owner, due_date)
  select v_tenant_id, i.id, 'Replace smoke detector battery', 'Maintenance Lead', current_date + 3
  from public.aipify_hosts_inspections i where i.tenant_id = p_tenant_id and i.inspection_key = 'insp_005';
end; $$;

create or replace function public._ahostqa_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'upcoming_count', (select count(*)::int from public.aipify_hosts_inspections
      where tenant_id = p_tenant_id and inspection_status = 'scheduled'),
    'active_count', (select count(*)::int from public.aipify_hosts_inspections
      where tenant_id = p_tenant_id and inspection_status in ('in_progress', 'awaiting_review')),
    'overdue_count', (select count(*)::int from public.aipify_hosts_inspections
      where tenant_id = p_tenant_id and inspection_status = 'scheduled' and scheduled_date < current_date),
    'failed_count', (select count(*)::int from public.aipify_hosts_inspections
      where tenant_id = p_tenant_id and inspection_outcome = 'failed'),
    'avg_property_score', coalesce((
      select round(avg(property_score)::numeric, 1) from public.aipify_hosts_quality_reviews
      where tenant_id = p_tenant_id
    ), 0)
  ); $$;

create or replace function public.get_aipify_hosts_quality_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_qc public.aipify_hosts_quality_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_qc := public._ahostqa_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_qc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp384_positioning(),
    'route', '/app/aipify-hosts/quality',
    'stats', public._ahostqa_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_quality_center_dashboard(
  p_section text default 'upcoming_inspections',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_qc public.aipify_hosts_quality_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_properties jsonb; v_timeline jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_qc := public._ahostqa_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_qc.default_section, 'upcoming_inspections');
  perform public._ahostqa_seed_inspections(v_tenant_id);
  perform public._ahostqa_log_event(v_tenant_id, 'dashboard_view', 'Quality Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
  into v_properties from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status <> 'archived';

  select coalesce(jsonb_agg(x order by x->>'created_at' desc), '[]'::jsonb) into v_timeline
  from (
    select jsonb_build_object(
      'id', t.id, 'inspection_id', t.inspection_id, 'timeline_type', t.timeline_type,
      'summary', t.summary, 'created_at', to_char(t.created_at, 'YYYY-MM-DD HH24:MI')
    ) as x
    from public.aipify_hosts_inspection_timeline t where t.tenant_id = v_tenant_id
    order by t.created_at desc limit 15
  ) s;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_qc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp384_positioning(),
    'governance', jsonb_build_object(
      'audit_inspection_changes', true,
      'audit_quality_reviews', true,
      'audit_corrective_actions', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp384_sections(),
    'inspection_types', public._ahostbp384_inspection_types(),
    'inspection_statuses', jsonb_build_array('scheduled', 'in_progress', 'awaiting_review', 'approved', 'requires_action'),
    'checklist_categories', public._ahostbp384_checklist_categories(),
    'inspection_outcomes', jsonb_build_array('passed', 'passed_with_notes', 'action_required', 'failed'),
    'standards_library', public._ahostbp384_standards_library(),
    'stats', public._ahostqa_dashboard_stats(v_tenant_id),
    'properties', v_properties,
    'timeline', v_timeline,
    'upcoming_inspections', (
      select coalesce(jsonb_agg(public._ahostqa_row(i, coalesce(p.display_name, '—')) order by i.scheduled_date nulls last), '[]'::jsonb)
      from public.aipify_hosts_inspections i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.inspection_status = 'scheduled'
    ),
    'active_inspections', (
      select coalesce(jsonb_agg(public._ahostqa_row(i, coalesce(p.display_name, '—')) order by i.updated_at desc), '[]'::jsonb)
      from public.aipify_hosts_inspections i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.inspection_status in ('in_progress', 'awaiting_review')
    ),
    'completed_inspections', (
      select coalesce(jsonb_agg(public._ahostqa_row(i, coalesce(p.display_name, '—')) order by i.completion_date desc nulls last), '[]'::jsonb)
      from public.aipify_hosts_inspections i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.inspection_status in ('approved', 'requires_action')
    ),
    'quality_reviews', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', q.id, 'property', coalesce(p.display_name, '—'), 'property_id', q.property_id,
        'inspection_id', q.inspection_id, 'property_score', q.property_score,
        'inspector_notes', q.inspector_notes, 'recommended_actions', q.recommended_actions,
        'improvement_opportunities', q.improvement_opportunities,
        'created_at', to_char(q.created_at, 'YYYY-MM-DD HH24:MI')
      ) order by q.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_quality_reviews q
      left join public.aipify_hosts_properties p on p.id = q.property_id
      where q.tenant_id = v_tenant_id
    ),
    'corrective_actions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', c.id, 'inspection_id', c.inspection_id, 'action_summary', c.action_summary,
        'assigned_owner', c.assigned_owner, 'due_date', c.due_date::text,
        'escalated', c.escalated, 'action_status', c.action_status,
        'created_at', to_char(c.created_at, 'YYYY-MM-DD HH24:MI')
      ) order by c.due_date nulls last), '[]'::jsonb)
      from public.aipify_hosts_inspection_corrective_actions c where c.tenant_id = v_tenant_id
    ),
    'photo_evidence', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', ph.id, 'inspection_id', ph.inspection_id, 'checklist_category', ph.checklist_category,
        'reference_label', ph.reference_label, 'caption', ph.caption,
        'created_at', to_char(ph.created_at, 'YYYY-MM-DD HH24:MI')
      ) order by ph.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_inspection_photo_evidence ph where ph.tenant_id = v_tenant_id
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 22 — Quality Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_22_QUALITY_CENTER.text',
      'route', '/app/aipify-hosts/quality'
    )
  );
end; $$;

create or replace function public.schedule_aipify_hosts_inspection(
  p_inspection_type text,
  p_property_id uuid default null,
  p_assigned_inspector text default null,
  p_scheduled_date date default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_key := 'insp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_inspections (
    tenant_id, property_id, inspection_key, inspection_type, assigned_inspector, scheduled_date
  ) values (
    v_tenant_id, p_property_id, v_key, p_inspection_type,
    p_assigned_inspector, coalesce(p_scheduled_date, current_date + 1)
  ) returning id into v_id;
  perform public._ahostqa_add_timeline(v_tenant_id, v_id, 'inspection_created', 'Inspection scheduled', '{}'::jsonb);
  perform public._ahostqa_log_event(v_tenant_id, 'inspection_scheduled', 'Inspection scheduled',
    jsonb_build_object('inspection_id', v_id));
  perform public._ahostqa_push_notification(v_tenant_id, 'qa_sched_' || v_id::text, 'important',
    'Inspection scheduled', 'A property inspection has been scheduled');
  return jsonb_build_object('success', true, 'inspection_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_inspection_status(
  p_inspection_id uuid, p_status text, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_insp public.aipify_hosts_inspections;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_status not in ('scheduled', 'in_progress', 'awaiting_review', 'approved', 'requires_action') then
    raise exception 'Invalid status';
  end if;
  select * into v_insp from public.aipify_hosts_inspections where id = p_inspection_id and tenant_id = v_tenant_id;
  update public.aipify_hosts_inspections set inspection_status = p_status, updated_at = now(),
    completion_date = case when p_status in ('approved', 'requires_action') then current_date else completion_date end
  where id = p_inspection_id and tenant_id = v_tenant_id;
  if p_status = 'in_progress' then
    perform public._ahostqa_add_timeline(v_tenant_id, p_inspection_id, 'inspection_started', 'Inspection started', '{}'::jsonb);
  elsif p_status in ('approved', 'requires_action') then
    perform public._ahostqa_add_timeline(v_tenant_id, p_inspection_id, 'inspection_closed', 'Inspection closed', '{}'::jsonb);
  end if;
  perform public._ahostqa_log_event(v_tenant_id, 'inspection_status_changed', 'Inspection status updated',
    jsonb_build_object('inspection_id', p_inspection_id, 'status', p_status));
  if v_insp.scheduled_date < current_date and v_insp.inspection_status = 'scheduled' then
    perform public._ahostqa_push_notification(v_tenant_id, 'qa_over_' || p_inspection_id::text, 'high',
      'Inspection overdue', 'A scheduled inspection is past its due date');
  end if;
  return jsonb_build_object('success', true, 'inspection_id', p_inspection_id, 'status', p_status);
end; $$;

create or replace function public.record_aipify_hosts_inspection_outcome(
  p_inspection_id uuid, p_outcome text, p_checklist_results jsonb default '{}'::jsonb, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_outcome not in ('passed', 'passed_with_notes', 'action_required', 'failed') then
    raise exception 'Invalid outcome';
  end if;
  update public.aipify_hosts_inspections set
    inspection_outcome = p_outcome,
    checklist_results = coalesce(p_checklist_results, '{}'::jsonb),
    inspection_status = case p_outcome
      when 'passed' then 'approved' when 'passed_with_notes' then 'approved'
      when 'action_required' then 'requires_action' else 'requires_action' end,
    completion_date = current_date,
    updated_at = now()
  where id = p_inspection_id and tenant_id = v_tenant_id;
  perform public._ahostqa_add_timeline(v_tenant_id, p_inspection_id, 'findings_recorded', 'Findings recorded: ' || p_outcome, '{}'::jsonb);
  perform public._ahostqa_log_event(v_tenant_id, 'outcome_recorded', 'Inspection outcome recorded',
    jsonb_build_object('inspection_id', p_inspection_id, 'outcome', p_outcome));
  if p_outcome = 'failed' then
    perform public._ahostqa_push_notification(v_tenant_id, 'qa_fail_' || p_inspection_id::text, 'critical',
      'Failed inspection recorded', 'An inspection did not meet quality standards');
  end if;
  return jsonb_build_object('success', true, 'inspection_id', p_inspection_id, 'outcome', p_outcome);
end; $$;

create or replace function public.create_aipify_hosts_quality_review(
  p_inspection_id uuid,
  p_property_score numeric default 0,
  p_inspector_notes text default null,
  p_recommended_actions text default null,
  p_improvement_opportunities text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select property_id into v_prop from public.aipify_hosts_inspections where id = p_inspection_id and tenant_id = v_tenant_id;
  insert into public.aipify_hosts_quality_reviews (
    tenant_id, property_id, inspection_id, property_score, inspector_notes, recommended_actions, improvement_opportunities
  ) values (
    v_tenant_id, v_prop, p_inspection_id, coalesce(p_property_score, 0),
    p_inspector_notes, p_recommended_actions, p_improvement_opportunities
  );
  perform public._ahostqa_log_event(v_tenant_id, 'quality_review_created', 'Quality review recorded',
    jsonb_build_object('inspection_id', p_inspection_id, 'score', p_property_score));
  return jsonb_build_object('success', true, 'inspection_id', p_inspection_id);
end; $$;

create or replace function public.create_aipify_hosts_inspection_corrective_action(
  p_inspection_id uuid,
  p_action_summary text,
  p_assigned_owner text default null,
  p_due_date date default null,
  p_create_task boolean default true,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_insp public.aipify_hosts_inspections; v_task_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_action_summary), '') = '' then raise exception 'Action summary required'; end if;
  select * into v_insp from public.aipify_hosts_inspections where id = p_inspection_id and tenant_id = v_tenant_id;
  insert into public.aipify_hosts_inspection_corrective_actions (
    tenant_id, inspection_id, action_summary, assigned_owner, due_date
  ) values (
    v_tenant_id, p_inspection_id, trim(p_action_summary), p_assigned_owner,
    coalesce(p_due_date, current_date + 7)
  ) returning id into v_id;
  if p_create_task then
    v_task_key := 'task_qa_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority, due_date, assignee_name
    ) values (
      v_tenant_id, v_insp.property_id, v_task_key, 'QA corrective: ' || left(trim(p_action_summary), 60),
      trim(p_action_summary), 'inspection', 'high', coalesce(p_due_date, current_date + 7), p_assigned_owner
    );
  end if;
  perform public._ahostqa_add_timeline(v_tenant_id, p_inspection_id, 'actions_assigned', trim(p_action_summary), '{}'::jsonb);
  perform public._ahostqa_log_event(v_tenant_id, 'corrective_action_created', 'Corrective action created',
    jsonb_build_object('inspection_id', p_inspection_id, 'action_id', v_id));
  return jsonb_build_object('success', true, 'action_id', v_id, 'inspection_id', p_inspection_id);
end; $$;

create or replace function public.escalate_aipify_hosts_inspection_finding(
  p_inspection_id uuid, p_action_id uuid default null, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_action_id is not null then
    update public.aipify_hosts_inspection_corrective_actions set escalated = true, action_status = 'overdue', updated_at = now()
    where id = p_action_id and tenant_id = v_tenant_id;
  end if;
  update public.aipify_hosts_inspections set inspection_status = 'requires_action', updated_at = now()
  where id = p_inspection_id and tenant_id = v_tenant_id;
  perform public._ahostqa_push_notification(v_tenant_id, 'qa_esc_' || p_inspection_id::text, 'critical',
    'Critical finding escalated', 'A critical quality finding requires immediate attention');
  perform public._ahostqa_log_event(v_tenant_id, 'finding_escalated', 'Critical finding escalated',
    jsonb_build_object('inspection_id', p_inspection_id));
  return jsonb_build_object('success', true, 'inspection_id', p_inspection_id);
end; $$;

create or replace function public.add_aipify_hosts_inspection_photo_evidence(
  p_inspection_id uuid,
  p_checklist_category text,
  p_reference_label text,
  p_caption text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_reference_label), '') = '' then raise exception 'Reference label required'; end if;
  insert into public.aipify_hosts_inspection_photo_evidence (
    tenant_id, inspection_id, checklist_category, reference_label, caption
  ) values (
    v_tenant_id, p_inspection_id, p_checklist_category, trim(p_reference_label), p_caption
  ) returning id into v_id;
  perform public._ahostqa_log_event(v_tenant_id, 'photo_evidence_added', 'Photo evidence reference added',
    jsonb_build_object('inspection_id', p_inspection_id, 'evidence_id', v_id));
  return jsonb_build_object('success', true, 'evidence_id', v_id, 'inspection_id', p_inspection_id);
end; $$;

create or replace function public.seed_aipify_hosts_quality_center_knowledge_airbnb22()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-quality', 'Hosts Quality Center',
    'Property inspection standards, quality expectations, and assurance best practices.', 300
  );
  perform public._ahostkc_seed_article('aipify-hosts-quality', 'property-inspection-standards', 'Property inspection standards',
    'Use the checklist categories to verify exterior, interior, safety, amenities, and presentation before every guest arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-quality', 'hospitality-quality-expectations', 'Hospitality quality expectations',
    'Every property should meet the same guest-ready standard regardless of who performs the inspection.');
  perform public._ahostkc_seed_article('aipify-hosts-quality', 'seasonal-readiness-procedures', 'Seasonal readiness procedures',
    'Schedule seasonal inspections before peak periods and document corrective actions with due dates.');
  perform public._ahostkc_seed_article('aipify-hosts-quality', 'quality-assurance-best-practices', 'Quality assurance best practices',
    'Record outcomes, attach photo evidence references, assign owners, and close inspections only after verification.');
end; $$;

select public.seed_aipify_hosts_quality_center_knowledge_airbnb22();

grant execute on function public.get_aipify_hosts_quality_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_quality_center_dashboard(text, uuid) to authenticated;
grant execute on function public.schedule_aipify_hosts_inspection(text, uuid, text, date, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_inspection_status(uuid, text, uuid) to authenticated;
grant execute on function public.record_aipify_hosts_inspection_outcome(uuid, text, jsonb, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_quality_review(uuid, numeric, text, text, text, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_inspection_corrective_action(uuid, text, text, date, boolean, uuid) to authenticated;
grant execute on function public.escalate_aipify_hosts_inspection_finding(uuid, uuid, uuid) to authenticated;
grant execute on function public.add_aipify_hosts_inspection_photo_evidence(uuid, text, text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_quality_center_knowledge_airbnb22() to authenticated;

-- Phase Airbnb 34 — Aipify Hosts Cleaning Operations Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostcln_* (engine), _ahostbp396_* (blueprint)

create table if not exists public.aipify_hosts_cleaning_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'todays_cleaning' check (
    default_section in (
      'todays_cleaning', 'upcoming_cleaning', 'active_cleaning_tasks',
      'cleaning_teams', 'cleaning_history'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_cleaning_center_settings enable row level security;
revoke all on public.aipify_hosts_cleaning_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_cleaners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  cleaner_key text not null,
  cleaner_name text not null,
  contact_email text,
  contact_phone text,
  assigned_properties jsonb not null default '[]'::jsonb,
  cleaner_status text not null default 'active' check (
    cleaner_status in ('active', 'unavailable', 'suspended')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, cleaner_key)
);
create index if not exists aipify_hosts_cleaning_cleaners_tenant_idx
  on public.aipify_hosts_cleaning_cleaners (tenant_id, cleaner_status);
alter table public.aipify_hosts_cleaning_cleaners enable row level security;
revoke all on public.aipify_hosts_cleaning_cleaners from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  cleaner_id uuid references public.aipify_hosts_cleaning_cleaners (id) on delete set null,
  cleaning_key text not null,
  category text not null default 'standard_turnover' check (
    category in (
      'standard_turnover', 'deep_cleaning', 'emergency_cleaning',
      'seasonal_cleaning', 'inspection_cleaning'
    )
  ),
  departure_date date,
  arrival_date date,
  assigned_cleaner text,
  cleaning_status text not null default 'scheduled' check (
    cleaning_status in (
      'scheduled', 'assigned', 'in_progress', 'awaiting_review',
      'completed', 'requires_attention'
    )
  ),
  due_time timestamptz not null,
  scheduled_date date not null default current_date,
  started_at timestamptz,
  completed_at timestamptz,
  checklist jsonb not null default '{
    "bedrooms": false, "bathrooms": false, "kitchen": false, "living_areas": false,
    "outdoor_areas": false, "amenities_restocked": false, "trash_removed": false,
    "laundry_completed": false, "supplies_verified": false
  }'::jsonb,
  completion_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, cleaning_key)
);
create index if not exists aipify_hosts_cleaning_tasks_tenant_idx
  on public.aipify_hosts_cleaning_tasks (tenant_id, cleaning_status, scheduled_date, due_time);
alter table public.aipify_hosts_cleaning_tasks enable row level security;
revoke all on public.aipify_hosts_cleaning_tasks from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_issues (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  cleaning_task_id uuid not null references public.aipify_hosts_cleaning_tasks (id) on delete cascade,
  issue_category text not null check (
    issue_category in (
      'damage_detected', 'missing_inventory', 'maintenance_required',
      'supplies_missing', 'other'
    )
  ),
  description text not null,
  reported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_cleaning_issues_tenant_idx
  on public.aipify_hosts_cleaning_issues (tenant_id, cleaning_task_id, reported_at desc);
alter table public.aipify_hosts_cleaning_issues enable row level security;
revoke all on public.aipify_hosts_cleaning_issues from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_evidence (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  cleaning_task_id uuid not null references public.aipify_hosts_cleaning_tasks (id) on delete cascade,
  evidence_type text not null check (evidence_type in ('completion_notes', 'issue_report', 'photo_upload')),
  summary text,
  photo_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_cleaning_evidence_tenant_idx
  on public.aipify_hosts_cleaning_evidence (tenant_id, cleaning_task_id, created_at desc);
alter table public.aipify_hosts_cleaning_evidence enable row level security;
revoke all on public.aipify_hosts_cleaning_evidence from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_timeline_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  cleaning_task_id uuid not null references public.aipify_hosts_cleaning_tasks (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'cleaning_scheduled', 'cleaner_assigned', 'cleaning_started',
      'cleaning_completed', 'issues_reported'
    )
  ),
  summary text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_cleaning_timeline_tenant_idx
  on public.aipify_hosts_cleaning_timeline_events (tenant_id, cleaning_task_id, occurred_at desc);
alter table public.aipify_hosts_cleaning_timeline_events enable row level security;
revoke all on public.aipify_hosts_cleaning_timeline_events from authenticated, anon;

create table if not exists public.aipify_hosts_cleaning_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_cleaning_center_events_tenant_idx
  on public.aipify_hosts_cleaning_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_cleaning_center_events enable row level security;
revoke all on public.aipify_hosts_cleaning_center_events from authenticated, anon;

create or replace function public._ahostcln_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_cleaning_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_cleaning_center_settings;
begin
  insert into public.aipify_hosts_cleaning_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_cleaning_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostcln_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_cleaning_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'cleaning_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostcln_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'cleaning_updates', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp396_positioning() returns text language sql immutable as $$
  select 'Ensure every property is guest-ready — today''s cleanings, team assignments, checklists, and completion history in one Cleaning Center.'; $$;

create or replace function public._ahostbp396_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'todays_cleaning', 'label', 'Today''s Cleaning'),
    jsonb_build_object('key', 'upcoming_cleaning', 'label', 'Upcoming Cleaning'),
    jsonb_build_object('key', 'active_cleaning_tasks', 'label', 'Active Cleaning Tasks'),
    jsonb_build_object('key', 'cleaning_teams', 'label', 'Cleaning Teams'),
    jsonb_build_object('key', 'cleaning_history', 'label', 'Cleaning History')
  ); $$;

create or replace function public._ahostcln_checklist_keys() returns text[] language sql immutable as $$
  select array[
    'bedrooms', 'bathrooms', 'kitchen', 'living_areas', 'outdoor_areas',
    'amenities_restocked', 'trash_removed', 'laundry_completed', 'supplies_verified'
  ]; $$;

create or replace function public._ahostcln_checklist_progress(p_checklist jsonb)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'completed_count', (
      select count(*)::int from unnest(public._ahostcln_checklist_keys()) k
      where coalesce((p_checklist->>k)::boolean, false)
    ),
    'total_count', 9,
    'items', p_checklist
  ); $$;

create or replace function public._ahostcln_cleaning_row(
  p_t public.aipify_hosts_cleaning_tasks, p_property text, p_cleaner text, p_issue_count int default 0
) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_t.id, 'cleaning_key', p_t.cleaning_key,
    'property_id', p_t.property_id, 'property', coalesce(p_property, '—'),
    'cleaner_id', p_t.cleaner_id, 'assigned_cleaner', coalesce(p_t.assigned_cleaner, coalesce(p_cleaner, '—')),
    'category', p_t.category,
    'departure_date', coalesce(p_t.departure_date::text, ''),
    'arrival_date', coalesce(p_t.arrival_date::text, ''),
    'cleaning_status', p_t.cleaning_status,
    'due_time', p_t.due_time::text,
    'scheduled_date', p_t.scheduled_date::text,
    'started_at', coalesce(p_t.started_at::text, ''),
    'completed_at', coalesce(p_t.completed_at::text, ''),
    'checklist', public._ahostcln_checklist_progress(p_t.checklist),
    'completion_notes', coalesce(p_t.completion_notes, ''),
    'issue_count', p_issue_count,
    'is_overdue', p_t.due_time < now() and p_t.cleaning_status not in ('completed', 'awaiting_review'),
    'is_today', p_t.scheduled_date = current_date
  ); $$;

create or replace function public._ahostcln_cleaner_row(p_c public.aipify_hosts_cleaning_cleaners, p_active_tasks int default 0)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_c.id, 'cleaner_key', p_c.cleaner_key,
    'cleaner_name', p_c.cleaner_name,
    'contact_email', coalesce(p_c.contact_email, ''),
    'contact_phone', coalesce(p_c.contact_phone, ''),
    'assigned_properties', p_c.assigned_properties,
    'cleaner_status', p_c.cleaner_status,
    'active_tasks', p_active_tasks
  ); $$;

create or replace function public._ahostcln_issue_row(p_i public.aipify_hosts_cleaning_issues, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_i.id, 'cleaning_task_id', p_i.cleaning_task_id,
    'issue_category', p_i.issue_category,
    'description', p_i.description,
    'property', coalesce(p_property, '—'),
    'reported_at', p_i.reported_at::text
  ); $$;

create or replace function public._ahostcln_timeline_row(p_t public.aipify_hosts_cleaning_timeline_events)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_t.id, 'cleaning_task_id', p_t.cleaning_task_id,
    'event_type', p_t.event_type, 'summary', coalesce(p_t.summary, ''),
    'occurred_at', p_t.occurred_at::text
  ); $$;

create or replace function public._ahostcln_add_timeline(
  p_tenant_id uuid, p_task_id uuid, p_event_type text, p_summary text default null
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_cleaning_timeline_events (
    tenant_id, cleaning_task_id, event_type, summary, occurred_at
  ) values (p_tenant_id, p_task_id, p_event_type, p_summary, now());
end; $$;

create or replace function public._ahostcln_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'cleanings_today', (
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and scheduled_date = current_date
        and cleaning_status not in ('completed')
    ),
    'overdue_cleanings', (
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and due_time < now()
        and cleaning_status not in ('completed', 'awaiting_review')
    ),
    'properties_awaiting_cleaning', (
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and cleaning_status in ('scheduled', 'assigned')
        and scheduled_date <= current_date
    ),
    'issues_requiring_attention', (
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and cleaning_status = 'requires_attention'
    ),
    'active_tasks', (
      select count(*)::int from public.aipify_hosts_cleaning_tasks
      where tenant_id = p_tenant_id and cleaning_status in ('assigned', 'in_progress', 'awaiting_review', 'requires_attention')
    ),
    'active_cleaners', (
      select count(*)::int from public.aipify_hosts_cleaning_cleaners
      where tenant_id = p_tenant_id and cleaner_status = 'active'
    )
  ); $$;

create or replace function public._ahostcln_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_prop uuid;
  v_cleaner uuid;
  v_task uuid;
  v_prop_name text;
begin
  if exists (select 1 from public.aipify_hosts_cleaning_tasks where tenant_id = p_tenant_id limit 1) then return; end if;

  select id, display_name into v_prop, v_prop_name from public.aipify_hosts_properties
  where tenant_id = p_tenant_id and status = 'active' order by created_at limit 1;

  insert into public.aipify_hosts_cleaning_cleaners (
    tenant_id, cleaner_key, cleaner_name, contact_email, contact_phone,
    assigned_properties, cleaner_status
  ) values
    (p_tenant_id, 'cln_001', 'Maria Solberg', 'maria@coastclean.no', '+47 900 33 001',
      coalesce(jsonb_build_array(v_prop_name), '[]'::jsonb), 'active'),
    (p_tenant_id, 'cln_002', 'Jonas Nilsen', 'jonas@coastclean.no', '+47 900 33 002',
      coalesce(jsonb_build_array(v_prop_name), '[]'::jsonb), 'active')
  on conflict (tenant_id, cleaner_key) do nothing;

  select id into v_cleaner from public.aipify_hosts_cleaning_cleaners
  where tenant_id = p_tenant_id and cleaner_key = 'cln_001';

  insert into public.aipify_hosts_cleaning_tasks (
    tenant_id, property_id, cleaner_id, cleaning_key, category,
    departure_date, arrival_date, assigned_cleaner, cleaning_status,
    due_time, scheduled_date
  ) values
    (p_tenant_id, v_prop, v_cleaner, 'cln_today_001', 'standard_turnover',
      current_date - 1, current_date, 'Maria Solberg', 'in_progress',
      date_trunc('day', now()) + interval '14 hours', current_date),
    (p_tenant_id, v_prop, null, 'cln_today_002', 'standard_turnover',
      current_date, current_date + 1, null, 'scheduled',
      date_trunc('day', now()) + interval '16 hours', current_date),
    (p_tenant_id, v_prop, v_cleaner, 'cln_upcoming_001', 'deep_cleaning',
      current_date + 3, current_date + 4, 'Maria Solberg', 'assigned',
      (current_date + 3)::timestamptz + interval '12 hours', current_date + 3),
    (p_tenant_id, v_prop, null, 'cln_overdue_001', 'standard_turnover',
      current_date - 2, current_date - 1, null, 'requires_attention',
      now() - interval '6 hours', current_date - 1),
    (p_tenant_id, v_prop, v_cleaner, 'cln_hist_001', 'standard_turnover',
      current_date - 5, current_date - 4, 'Maria Solberg', 'completed',
      (current_date - 4)::timestamptz + interval '15 hours', current_date - 4)
  on conflict (tenant_id, cleaning_key) do nothing;

  update public.aipify_hosts_cleaning_tasks set
    started_at = now() - interval '2 hours',
    checklist = '{"bedrooms":true,"bathrooms":true,"kitchen":true,"living_areas":true,"outdoor_areas":false,"amenities_restocked":false,"trash_removed":true,"laundry_completed":true,"supplies_verified":false}'::jsonb
  where tenant_id = p_tenant_id and cleaning_key = 'cln_today_001';

  update public.aipify_hosts_cleaning_tasks set
    completed_at = (current_date - 4)::timestamptz + interval '16 hours',
    started_at = (current_date - 4)::timestamptz + interval '13 hours',
    completion_notes = 'Turnover completed. All areas verified.',
    checklist = '{"bedrooms":true,"bathrooms":true,"kitchen":true,"living_areas":true,"outdoor_areas":true,"amenities_restocked":true,"trash_removed":true,"laundry_completed":true,"supplies_verified":true}'::jsonb
  where tenant_id = p_tenant_id and cleaning_key = 'cln_hist_001';

  select id into v_task from public.aipify_hosts_cleaning_tasks
  where tenant_id = p_tenant_id and cleaning_key = 'cln_overdue_001';

  insert into public.aipify_hosts_cleaning_issues (
    tenant_id, cleaning_task_id, issue_category, description
  ) values (
    p_tenant_id, v_task, 'maintenance_required', 'Bathroom faucet dripping — maintenance follow-up needed.'
  );

  for v_task in select id from public.aipify_hosts_cleaning_tasks where tenant_id = p_tenant_id
  loop
    perform public._ahostcln_add_timeline(p_tenant_id, v_task, 'cleaning_scheduled', 'Cleaning scheduled');
  end loop;

  perform public._ahostcln_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_cleaning_tasks where tenant_id = p_tenant_id and cleaning_key = 'cln_today_001'),
    'cleaner_assigned', 'Maria Solberg assigned');
  perform public._ahostcln_add_timeline(p_tenant_id,
    (select id from public.aipify_hosts_cleaning_tasks where tenant_id = p_tenant_id and cleaning_key = 'cln_today_001'),
    'cleaning_started', 'Cleaning started');
end; $$;

create or replace function public.get_aipify_hosts_cleaning_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_hosts public.aipify_hosts_settings; v_stats jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostcln_ensure_settings(v_tenant_id);
  v_stats := public._ahostcln_dashboard_stats(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true, 'enabled', v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'cleanings_today', v_stats->'cleanings_today',
    'overdue_cleanings', v_stats->'overdue_cleanings',
    'philosophy', public._ahostbp396_positioning()
  );
end; $$;

create or replace function public.get_aipify_hosts_cleaning_center_dashboard(
  p_section text default 'todays_cleaning',
  p_property_id uuid default null,
  p_status text default null,
  p_org_id uuid default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_cc public.aipify_hosts_cleaning_center_settings;
  v_hosts public.aipify_hosts_settings;
  v_section text := coalesce(nullif(trim(p_section), ''), 'todays_cleaning');
  v_tasks jsonb := '[]'::jsonb;
  v_cleaners jsonb := '[]'::jsonb;
  v_issues jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_cc := public._ahostcln_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  perform public._ahostcln_seed_demo(v_tenant_id);

  select coalesce(jsonb_agg(
    public._ahostcln_cleaning_row(t, p.display_name, c.cleaner_name, coalesce(ic.cnt, 0))
    order by t.due_time
  ), '[]'::jsonb) into v_tasks
  from public.aipify_hosts_cleaning_tasks t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  left join public.aipify_hosts_cleaning_cleaners c on c.id = t.cleaner_id
  left join lateral (
    select count(*)::int cnt from public.aipify_hosts_cleaning_issues i where i.cleaning_task_id = t.id
  ) ic on true
  where t.tenant_id = v_tenant_id
    and (p_property_id is null or t.property_id = p_property_id)
    and (p_status is null or t.cleaning_status = p_status);

  if v_section = 'todays_cleaning' then
    select coalesce(jsonb_agg(r order by (r->>'due_time')), '[]'::jsonb) into v_tasks
    from jsonb_array_elements(v_tasks) r
    where (r->>'scheduled_date')::date = current_date and r->>'cleaning_status' <> 'completed';
  elsif v_section = 'upcoming_cleaning' then
    select coalesce(jsonb_agg(r order by (r->>'scheduled_date'), (r->>'due_time')), '[]'::jsonb) into v_tasks
    from jsonb_array_elements(v_tasks) r
    where (r->>'scheduled_date')::date > current_date;
  elsif v_section = 'active_cleaning_tasks' then
    select coalesce(jsonb_agg(r order by (r->>'due_time')), '[]'::jsonb) into v_tasks
    from jsonb_array_elements(v_tasks) r
    where r->>'cleaning_status' in ('assigned', 'in_progress', 'awaiting_review', 'requires_attention');
  elsif v_section = 'cleaning_history' then
    select coalesce(jsonb_agg(r order by (r->>'completed_at') desc nulls last), '[]'::jsonb) into v_tasks
    from jsonb_array_elements(v_tasks) r
    where r->>'cleaning_status' in ('completed', 'awaiting_review');
  end if;

  select coalesce(jsonb_agg(
    public._ahostcln_cleaner_row(c, coalesce(tc.cnt, 0))
    order by case c.cleaner_status when 'active' then 1 when 'unavailable' then 2 else 3 end, c.cleaner_name
  ), '[]'::jsonb) into v_cleaners
  from public.aipify_hosts_cleaning_cleaners c
  left join lateral (
    select count(*)::int cnt from public.aipify_hosts_cleaning_tasks t
    where t.cleaner_id = c.id and t.cleaning_status in ('assigned', 'in_progress')
  ) tc on true
  where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(
    public._ahostcln_issue_row(i, p.display_name) order by i.reported_at desc
  ), '[]'::jsonb) into v_issues
  from public.aipify_hosts_cleaning_issues i
  join public.aipify_hosts_cleaning_tasks t on t.id = i.cleaning_task_id
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where i.tenant_id = v_tenant_id
  limit 15;

  select coalesce(jsonb_agg(
    public._ahostcln_timeline_row(ev) order by ev.occurred_at desc
  ), '[]'::jsonb) into v_timeline
  from public.aipify_hosts_cleaning_timeline_events ev
  where ev.tenant_id = v_tenant_id
  limit 20;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp396_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_cleaning_assignments', true,
      'audit_status_changes', true,
      'audit_issue_reports', true,
      'audit_completion_confirmations', true
    ),
    'sections', public._ahostbp396_sections(),
    'checklist_keys', to_jsonb(public._ahostcln_checklist_keys()),
    'stats', public._ahostcln_dashboard_stats(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'cleaning_tasks', case when v_section <> 'cleaning_teams' then v_tasks else '[]'::jsonb end,
    'cleaners', v_cleaners,
    'issues', v_issues,
    'timeline', v_timeline,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 34 — Cleaning Operations Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_34_CLEANING_OPERATIONS_CENTER.text',
      'route', '/app/aipify-hosts/cleaning'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_cleaning_action(
  p_action_type text,
  p_cleaning_task_id uuid default null,
  p_cleaner_id uuid default null,
  p_notes text default null,
  p_issue_category text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_task public.aipify_hosts_cleaning_tasks;
  v_cleaner public.aipify_hosts_cleaning_cleaners;
  v_summary text;
  v_old_cleaner uuid;
  v_old_status text;
  v_payload jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_payload := coalesce(p_notes::jsonb, '{}'::jsonb);

  if p_action_type = 'schedule_deep_cleaning' then
    insert into public.aipify_hosts_cleaning_tasks (
      tenant_id, property_id, cleaning_key, category, departure_date, arrival_date,
      cleaning_status, due_time, scheduled_date
    ) values (
      v_tenant_id,
      coalesce((v_payload->>'property_id')::uuid, (select id from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active' limit 1)),
      'cln_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
      'deep_cleaning',
      coalesce((v_payload->>'departure_date')::date, current_date + 7),
      coalesce((v_payload->>'arrival_date')::date, current_date + 8),
      'scheduled',
      coalesce((v_payload->>'due_time')::timestamptz, (current_date + 7)::timestamptz + interval '12 hours'),
      coalesce((v_payload->>'scheduled_date')::date, current_date + 7)
    ) returning * into v_task;
    perform public._ahostcln_add_timeline(v_tenant_id, v_task.id, 'cleaning_scheduled', 'Deep cleaning scheduled');
    perform public._ahostcln_log_event(v_tenant_id, 'cleaning_scheduled', 'Deep cleaning scheduled',
      jsonb_build_object('cleaning_task_id', v_task.id, 'category', 'deep_cleaning'));
    return jsonb_build_object('success', true, 'cleaning_task_id', v_task.id, 'summary', 'Deep cleaning scheduled');

  elsif p_cleaning_task_id is not null then
    select * into v_task from public.aipify_hosts_cleaning_tasks
    where id = p_cleaning_task_id and tenant_id = v_tenant_id;
    if v_task.id is null then raise exception 'Cleaning task not found'; end if;
    v_old_cleaner := v_task.cleaner_id;
    v_old_status := v_task.cleaning_status;
  end if;

  if p_action_type in ('assign_cleaner', 'reassign_cleaner') and p_cleaning_task_id is not null then
    select * into v_cleaner from public.aipify_hosts_cleaning_cleaners
    where id = p_cleaner_id and tenant_id = v_tenant_id;
    update public.aipify_hosts_cleaning_tasks set
      cleaner_id = p_cleaner_id,
      assigned_cleaner = coalesce(v_cleaner.cleaner_name, assigned_cleaner),
      cleaning_status = case when cleaning_status = 'scheduled' then 'assigned' else cleaning_status end,
      updated_at = now()
    where id = p_cleaning_task_id and tenant_id = v_tenant_id;
    perform public._ahostcln_add_timeline(v_tenant_id, p_cleaning_task_id, 'cleaner_assigned',
      coalesce(v_cleaner.cleaner_name, 'Cleaner assigned'));
    perform public._ahostcln_log_event(v_tenant_id, 'assignment_changed',
      case when p_action_type = 'reassign_cleaner' then 'Cleaner reassigned' else 'Cleaner assigned' end,
      jsonb_build_object('cleaning_task_id', p_cleaning_task_id, 'from_cleaner', v_old_cleaner, 'to_cleaner', p_cleaner_id));
    perform public._ahostcln_push_notification(v_tenant_id, 'cln_assigned_' || p_cleaning_task_id, 'informational',
      'Cleaning assigned', coalesce(v_cleaner.cleaner_name, 'A cleaner has been assigned.'));
    v_summary := case when p_action_type = 'reassign_cleaner' then 'Cleaner reassigned' else 'Cleaner assigned' end;

  elsif p_action_type = 'start_cleaning' and p_cleaning_task_id is not null then
    update public.aipify_hosts_cleaning_tasks set
      cleaning_status = 'in_progress', started_at = now(), updated_at = now()
    where id = p_cleaning_task_id and tenant_id = v_tenant_id;
    perform public._ahostcln_add_timeline(v_tenant_id, p_cleaning_task_id, 'cleaning_started', 'Cleaning started');
    perform public._ahostcln_log_event(v_tenant_id, 'status_changed', 'Cleaning started',
      jsonb_build_object('cleaning_task_id', p_cleaning_task_id, 'from', v_old_status, 'to', 'in_progress'));
    v_summary := 'Cleaning started';

  elsif p_action_type = 'mark_complete' and p_cleaning_task_id is not null then
    update public.aipify_hosts_cleaning_tasks set
      cleaning_status = case when exists (
        select 1 from public.aipify_hosts_cleaning_issues where cleaning_task_id = p_cleaning_task_id
      ) then 'awaiting_review' else 'completed' end,
      completed_at = now(),
      completion_notes = coalesce(p_notes, completion_notes),
      checklist = coalesce(v_payload->'checklist', checklist),
      updated_at = now()
    where id = p_cleaning_task_id and tenant_id = v_tenant_id;
    if coalesce(p_notes, '') <> '' then
      insert into public.aipify_hosts_cleaning_evidence (
        tenant_id, cleaning_task_id, evidence_type, summary
      ) values (v_tenant_id, p_cleaning_task_id, 'completion_notes', p_notes);
    end if;
    perform public._ahostcln_add_timeline(v_tenant_id, p_cleaning_task_id, 'cleaning_completed', coalesce(p_notes, 'Cleaning completed'));
    perform public._ahostcln_log_event(v_tenant_id, 'cleaning_completed', 'Cleaning marked complete',
      jsonb_build_object('cleaning_task_id', p_cleaning_task_id, 'notes', p_notes));
    perform public._ahostcln_push_notification(v_tenant_id, 'cln_done_' || p_cleaning_task_id, 'informational',
      'Cleaning completed', coalesce(p_notes, 'Property cleaning marked complete.'));
    v_summary := 'Cleaning marked complete';

  elsif p_action_type = 'report_issue' and p_cleaning_task_id is not null then
    insert into public.aipify_hosts_cleaning_issues (
      tenant_id, cleaning_task_id, issue_category, description
    ) values (
      v_tenant_id, p_cleaning_task_id,
      coalesce(p_issue_category, coalesce(v_payload->>'issue_category', 'other')),
      coalesce(p_notes, coalesce(v_payload->>'description', 'Issue reported during cleaning'))
    );
    update public.aipify_hosts_cleaning_tasks set
      cleaning_status = 'requires_attention', updated_at = now()
    where id = p_cleaning_task_id and tenant_id = v_tenant_id;
    insert into public.aipify_hosts_cleaning_evidence (
      tenant_id, cleaning_task_id, evidence_type, summary, photo_reference
    ) values (
      v_tenant_id, p_cleaning_task_id, 'issue_report', p_notes,
      coalesce(v_payload->>'photo_reference', null)
    );
    perform public._ahostcln_add_timeline(v_tenant_id, p_cleaning_task_id, 'issues_reported', coalesce(p_notes, 'Issue reported'));
    perform public._ahostcln_log_event(v_tenant_id, 'issue_reported', 'Issue reported during cleaning',
      jsonb_build_object('cleaning_task_id', p_cleaning_task_id, 'issue_category', p_issue_category));
    perform public._ahostcln_push_notification(v_tenant_id, 'cln_issue_' || p_cleaning_task_id, 'high',
      'Issue reported during cleaning', coalesce(p_notes, 'Review required before guest arrival.'));
    v_summary := 'Issue reported';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostcln_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type, 'cleaning_task_id', p_cleaning_task_id));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_cleaning_center_knowledge_airbnb34()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-cleaning', 'Hosts Cleaning Center',
    'Hospitality cleaning standards, turnover practices, team management, and arrival preparation.', 329
  );
  perform public._ahostkc_seed_article('aipify-hosts-cleaning', 'hospitality-cleaning-standards', 'Hospitality cleaning standards',
    'Every turnover follows a consistent checklist — bedrooms, bathrooms, kitchen, living areas, outdoor spaces, amenities, trash, laundry, and supplies.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning', 'turnover-best-practices', 'Turnover best practices',
    'Align departure and arrival dates, assign cleaners early, and complete cleanings before due time to ensure guest-ready properties.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning', 'managing-cleaning-teams', 'Managing cleaning teams',
    'Maintain cleaner profiles with contact information, assigned properties, and availability status for reliable scheduling.');
  perform public._ahostkc_seed_article('aipify-hosts-cleaning', 'preparing-properties-for-arrivals', 'Preparing properties for arrivals',
    'Report issues during cleaning, document completion notes, and verify checklist items before confirming the property is ready for guests.');
end; $$;

select public.seed_aipify_hosts_cleaning_center_knowledge_airbnb34();

grant execute on function public.get_aipify_hosts_cleaning_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_cleaning_center_dashboard(text, uuid, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_cleaning_action(text, uuid, uuid, text, text, uuid) to authenticated;

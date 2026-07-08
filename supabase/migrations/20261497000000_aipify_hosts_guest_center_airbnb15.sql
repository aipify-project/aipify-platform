-- Phase Airbnb 15 — Aipify Hosts Guest Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostguest_* (engine), _ahostbp377_* (blueprint)

create table if not exists public.aipify_hosts_guest_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'active_guests' check (
    default_section in (
      'active_guests', 'upcoming_guests', 'guest_history', 'guest_requests',
      'guest_notes', 'guest_timeline'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_guest_center_settings enable row level security;
revoke all on public.aipify_hosts_guest_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_guests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  guest_key text not null,
  full_name text not null,
  contact_email text,
  contact_phone text,
  stay_status text not null default 'upcoming' check (
    stay_status in ('upcoming', 'checked_in', 'checked_out', 'cancelled')
  ),
  check_in_date date,
  check_out_date date,
  guest_tier text not null default 'first_stay' check (
    guest_tier in ('first_stay', 'returning', 'frequent')
  ),
  requires_attention boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, guest_key)
);
create index if not exists aipify_hosts_guests_tenant_idx
  on public.aipify_hosts_guests (tenant_id, stay_status);
alter table public.aipify_hosts_guests enable row level security;
revoke all on public.aipify_hosts_guests from authenticated, anon;

create table if not exists public.aipify_hosts_guest_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  guest_id uuid not null references public.aipify_hosts_guests (id) on delete cascade,
  note_text text not null,
  created_by uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_guest_notes_guest_idx
  on public.aipify_hosts_guest_notes (guest_id, created_at desc);
alter table public.aipify_hosts_guest_notes enable row level security;
revoke all on public.aipify_hosts_guest_notes from authenticated, anon;

create table if not exists public.aipify_hosts_guest_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  guest_id uuid not null references public.aipify_hosts_guests (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  request_type text not null check (
    request_type in ('early_check_in', 'late_check_out', 'maintenance', 'general_question')
  ),
  status text not null default 'new' check (
    status in ('new', 'assigned', 'awaiting_response', 'resolved', 'closed')
  ),
  summary text,
  assigned_to text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_guest_requests_tenant_idx
  on public.aipify_hosts_guest_requests (tenant_id, status);
alter table public.aipify_hosts_guest_requests enable row level security;
revoke all on public.aipify_hosts_guest_requests from authenticated, anon;

create table if not exists public.aipify_hosts_guest_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_guest_center_events_tenant_idx
  on public.aipify_hosts_guest_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_guest_center_events enable row level security;
revoke all on public.aipify_hosts_guest_center_events from authenticated, anon;

create or replace function public._ahostguest_center_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_guest_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_guest_center_settings;
begin
  insert into public.aipify_hosts_guest_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_guest_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostguest_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_guest_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'guest_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp377_positioning() returns text language sql immutable as $$
  select 'Complete overview of every guest and guest interaction — understand active guest situations from one workspace.'; $$;

create or replace function public._ahostbp377_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active_guests', 'label', 'Active Guests'),
    jsonb_build_object('key', 'upcoming_guests', 'label', 'Upcoming Guests'),
    jsonb_build_object('key', 'guest_history', 'label', 'Guest History'),
    jsonb_build_object('key', 'guest_requests', 'label', 'Guest Requests'),
    jsonb_build_object('key', 'guest_notes', 'label', 'Guest Notes'),
    jsonb_build_object('key', 'guest_timeline', 'label', 'Guest Timeline')
  ); $$;

create or replace function public._ahostbp377_filters() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'active_guests', 'label', 'Active Guests'),
    jsonb_build_object('key', 'upcoming_guests', 'label', 'Upcoming Guests'),
    jsonb_build_object('key', 'returning_guests', 'label', 'Returning Guests'),
    jsonb_build_object('key', 'requiring_attention', 'label', 'Guests Requiring Attention')
  ); $$;

create or replace function public._ahostguest_seed_guests(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop record; v_i int := 0;
  v_statuses text[] := array['checked_in','upcoming','checked_out'];
  v_tiers text[] := array['first_stay','returning','frequent'];
begin
  if exists (select 1 from public.aipify_hosts_guests where tenant_id = p_tenant_id limit 1) then return; end if;
  for v_prop in
    select id, display_name from public.aipify_hosts_properties
    where tenant_id = p_tenant_id and status = 'active' order by display_name limit 6
  loop
    v_i := v_i + 1;
    insert into public.aipify_hosts_guests (
      tenant_id, property_id, guest_key, full_name, contact_email, contact_phone,
      stay_status, check_in_date, check_out_date, guest_tier, requires_attention
    ) values (
      p_tenant_id, v_prop.id, 'guest_' || v_i,
      'Guest ' || v_i || ' — ' || left(v_prop.display_name, 10),
      'guest' || v_i || '@example.com', '+47 400 00 ' || lpad(v_i::text, 3, '0'),
      v_statuses[1 + (v_i % 3)],
      current_date + (v_i - 2),
      current_date + v_i + 2,
      v_tiers[1 + (v_i % 3)],
      v_i = 2
    ) on conflict (tenant_id, guest_key) do nothing;
  end loop;
end; $$;

create or replace function public._ahostguest_seed_requests(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_guest_requests (
    tenant_id, guest_id, property_id, request_type, status, summary, assigned_to
  )
  select g.tenant_id, g.id, g.property_id,
    (array['early_check_in','late_check_out','maintenance','general_question'])[1 + (random() * 3)::int],
    (array['new','assigned','awaiting_response','resolved'])[1 + (random() * 3)::int],
    'Guest request for ' || g.full_name,
    case when random() > 0.4 then 'Front Desk' else null end
  from public.aipify_hosts_guests g
  where g.tenant_id = p_tenant_id
  and not exists (select 1 from public.aipify_hosts_guest_requests r where r.guest_id = g.id);
end; $$;

create or replace function public._ahostguest_guest_row(g public.aipify_hosts_guests, p_name text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', g.id,
    'guest_key', g.guest_key,
    'full_name', g.full_name,
    'property', p_name,
    'property_id', g.property_id,
    'check_in_date', g.check_in_date,
    'check_out_date', g.check_out_date,
    'status', g.stay_status,
    'guest_tier', g.guest_tier,
    'requires_attention', g.requires_attention,
    'contact_email', g.contact_email,
    'contact_phone', g.contact_phone
  ); $$;

create or replace function public._ahostguest_timeline(p_guest_id uuid, p_name text)
returns jsonb language sql stable as $$
  select jsonb_build_array(
    jsonb_build_object('type', 'booking_created', 'label', 'Booking created', 'when', '14 days ago'),
    jsonb_build_object('type', 'arrival', 'label', 'Guest arrival', 'when', 'Today'),
    jsonb_build_object('type', 'request_submitted', 'label', 'Request submitted', 'when', 'Yesterday'),
    jsonb_build_object('type', 'incident', 'label', 'Minor incident logged', 'when', '3 days ago'),
    jsonb_build_object('type', 'departure', 'label', 'Scheduled departure', 'when', 'In 3 days')
  ); $$;

create or replace function public._ahostguest_notifications(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_new int; v_late int; v_attn int;
begin
  select count(*) into v_new from public.aipify_hosts_guest_requests
  where tenant_id = p_tenant_id and status in ('new', 'assigned');
  select count(*) into v_late from public.aipify_hosts_guest_requests
  where tenant_id = p_tenant_id and request_type = 'late_check_out' and status <> 'closed';
  select count(*) into v_attn from public.aipify_hosts_guests
  where tenant_id = p_tenant_id and requires_attention;
  if v_new = 0 and v_late = 0 and v_attn = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(x) from (
      select jsonb_build_object('key', 'new_requests', 'active', v_new > 0, 'count', v_new, 'message', v_new || ' new guest requests') as x where v_new > 0
      union all
      select jsonb_build_object('key', 'late_checkout', 'active', v_late > 0, 'count', v_late, 'message', v_late || ' late check-out requests pending') where v_late > 0
      union all
      select jsonb_build_object('key', 'requiring_attention', 'active', v_attn > 0, 'count', v_attn, 'message', v_attn || ' guests requiring attention') where v_attn > 0
    ) n
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_guest_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_gc public.aipify_hosts_guest_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_gc := public._ahostguest_center_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_gc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp377_positioning(),
    'route', '/app/aipify-hosts/guests'
  );
end; $$;

create or replace function public.get_aipify_hosts_guest_center_dashboard(
  p_section text default 'active_guests',
  p_filter text default 'active_guests',
  p_guest_id uuid default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_gc public.aipify_hosts_guest_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_filter text; v_guests jsonb; v_requests jsonb; v_notes jsonb; v_profile jsonb; v_timeline jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_gc := public._ahostguest_center_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_gc.default_section, 'active_guests');
  v_filter := coalesce(nullif(trim(p_filter), ''), 'active_guests');
  perform public._ahostguest_seed_guests(v_tenant_id);
  perform public._ahostguest_seed_requests(v_tenant_id);
  perform public._ahostguest_log_event(v_tenant_id, 'dashboard_view', 'Guest Center viewed',
    jsonb_build_object('section', v_section, 'filter', v_filter, 'guest_id', p_guest_id));

  select coalesce(jsonb_agg(
    public._ahostguest_guest_row(g, coalesce(p.display_name, 'Unassigned'))
    order by g.check_in_date desc nulls last
  ), '[]'::jsonb) into v_guests
  from public.aipify_hosts_guests g
  left join public.aipify_hosts_properties p on p.id = g.property_id
  where g.tenant_id = v_tenant_id
  and case v_filter
    when 'active_guests' then g.stay_status in ('checked_in', 'upcoming')
    when 'upcoming_guests' then g.stay_status = 'upcoming'
    when 'returning_guests' then g.guest_tier in ('returning', 'frequent')
    when 'requiring_attention' then g.requires_attention
    else true
  end;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'guest_id', r.guest_id, 'guest_name', g.full_name, 'property', coalesce(p.display_name, '—'),
    'request_type', r.request_type, 'status', r.status, 'summary', r.summary, 'assigned_to', r.assigned_to,
    'submitted_at', to_char(r.created_at, 'YYYY-MM-DD HH24:MI')
  ) order by r.created_at desc), '[]'::jsonb) into v_requests
  from public.aipify_hosts_guest_requests r
  join public.aipify_hosts_guests g on g.id = r.guest_id
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'guest_id', n.guest_id, 'guest_name', g.full_name, 'note_text', n.note_text,
    'created_at', to_char(n.created_at, 'YYYY-MM-DD HH24:MI')
  ) order by n.created_at desc), '[]'::jsonb) into v_notes
  from public.aipify_hosts_guest_notes n
  join public.aipify_hosts_guests g on g.id = n.guest_id
  where n.tenant_id = v_tenant_id;

  if p_guest_id is not null then
    select public._ahostguest_guest_row(g, coalesce(p.display_name, 'Unassigned')) into v_profile
    from public.aipify_hosts_guests g
    left join public.aipify_hosts_properties p on p.id = g.property_id
    where g.id = p_guest_id and g.tenant_id = v_tenant_id;
    v_timeline := public._ahostguest_timeline(p_guest_id, (v_profile->>'full_name'));
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_gc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'active_filter', v_filter,
    'selected_guest_id', p_guest_id,
    'positioning', public._ahostbp377_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_notes', true,
      'audit_profile_changes', true,
      'audit_request_status', true,
      'notes_professional_only', true
    ),
    'sections', public._ahostbp377_sections(),
    'filters', public._ahostbp377_filters(),
    'guest_tiers', jsonb_build_array('first_stay', 'returning', 'frequent'),
    'request_types', jsonb_build_array('early_check_in', 'late_check_out', 'maintenance', 'general_question'),
    'request_statuses', jsonb_build_array('new', 'assigned', 'awaiting_response', 'resolved', 'closed'),
    'stay_statuses', jsonb_build_array('upcoming', 'checked_in', 'checked_out', 'cancelled'),
    'notifications', public._ahostguest_notifications(v_tenant_id),
    'guests', v_guests,
    'active_guests', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select public._ahostguest_guest_row(g, coalesce(p.display_name, 'Unassigned')) as x
        from public.aipify_hosts_guests g
        left join public.aipify_hosts_properties p on p.id = g.property_id
        where g.tenant_id = v_tenant_id and g.stay_status in ('checked_in', 'upcoming')
      ) s
    ),
    'upcoming_guests', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select public._ahostguest_guest_row(g, coalesce(p.display_name, 'Unassigned')) as x
        from public.aipify_hosts_guests g
        left join public.aipify_hosts_properties p on p.id = g.property_id
        where g.tenant_id = v_tenant_id and g.stay_status = 'upcoming'
      ) s
    ),
    'guest_history', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select public._ahostguest_guest_row(g, coalesce(p.display_name, 'Unassigned')) as x
        from public.aipify_hosts_guests g
        left join public.aipify_hosts_properties p on p.id = g.property_id
        where g.tenant_id = v_tenant_id and g.stay_status in ('checked_out', 'cancelled')
      ) s
    ),
    'guest_requests', v_requests,
    'guest_notes', v_notes,
    'guest_profile', v_profile,
    'guest_timeline', coalesce(v_timeline, '[]'::jsonb),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 15 — Guest Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_15_GUEST_CENTER.text',
      'route', '/app/aipify-hosts/guests'
    )
  );
end; $$;

create or replace function public.add_aipify_hosts_guest_note(
  p_guest_id uuid,
  p_note_text text,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_user := auth.uid();
  if v_user is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_note_text), '') = '' then raise exception 'Note text required'; end if;
  if length(trim(p_note_text)) > 500 then raise exception 'Note exceeds maximum length'; end if;
  insert into public.aipify_hosts_guest_notes (tenant_id, guest_id, note_text, created_by)
  values (v_tenant_id, p_guest_id, trim(p_note_text), v_user) returning id into v_id;
  perform public._ahostguest_log_event(v_tenant_id, 'note_created', 'Guest note added',
    jsonb_build_object('note_id', v_id, 'guest_id', p_guest_id));
  return jsonb_build_object('success', true, 'note_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_guest_request_status(
  p_request_id uuid,
  p_status text,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_status not in ('new', 'assigned', 'awaiting_response', 'resolved', 'closed') then
    raise exception 'Invalid status';
  end if;
  update public.aipify_hosts_guest_requests
  set status = p_status, updated_at = now()
  where id = p_request_id and tenant_id = v_tenant_id;
  perform public._ahostguest_log_event(v_tenant_id, 'request_status', 'Guest request status updated',
    jsonb_build_object('request_id', p_request_id, 'status', p_status));
  return jsonb_build_object('success', true, 'request_id', p_request_id, 'status', p_status);
end; $$;

create or replace function public.seed_aipify_hosts_guest_center_knowledge_airbnb15()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-guest', 'Hosts Guest Center',
    'Guest expectations, requests, communication, and returning guest support.', 240
  );
  perform public._ahostkc_seed_article('aipify-hosts-guest', 'managing-guest-expectations', 'Managing guest expectations',
    'Set clear arrival, amenity, and communication expectations before check-in. Professional notes help the team stay consistent.');
  perform public._ahostkc_seed_article('aipify-hosts-guest', 'handling-guest-requests', 'Handling guest requests',
    'Track early check-in, late check-out, maintenance, and general questions with assigned ownership and auditable status changes.');
  perform public._ahostkc_seed_article('aipify-hosts-guest', 'guest-communication-standards', 'Guest communication standards',
    'Use calm, professional language. Document preferences in operational notes — never store unnecessary personal data.');
  perform public._ahostkc_seed_article('aipify-hosts-guest', 'supporting-returning-guests', 'Supporting returning guests',
    'Identify first stay, returning, and frequent guests. Prepare personalized readiness without impersonating the host.');
end; $$;

select public.seed_aipify_hosts_guest_center_knowledge_airbnb15();

grant execute on function public.get_aipify_hosts_guest_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_guest_center_dashboard(text, text, uuid, uuid) to authenticated;
grant execute on function public.add_aipify_hosts_guest_note(uuid, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_guest_request_status(uuid, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_guest_center_knowledge_airbnb15() to authenticated;

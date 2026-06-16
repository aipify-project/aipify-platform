-- Phase Airbnb 31 — Aipify Hosts Communication Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostcom_* (engine), _ahostbp393_* (blueprint)

create table if not exists public.aipify_hosts_communication_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'guest_communications' check (
    default_section in (
      'guest_communications', 'team_communications', 'templates',
      'announcements', 'communication_history'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_communication_center_settings enable row level security;
revoke all on public.aipify_hosts_communication_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_guest_communications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  comm_key text not null,
  guest_name text not null,
  message_type text not null check (
    message_type in (
      'arrival_information', 'departure_information', 'property_updates',
      'maintenance_notices', 'welcome_messages', 'follow_up_messages'
    )
  ),
  delivery_channel text not null default 'email' check (
    delivery_channel in ('email', 'sms', 'push')
  ),
  comm_status text not null default 'draft' check (
    comm_status in ('draft', 'scheduled', 'sent', 'delivered', 'failed')
  ),
  subject text,
  body_preview text,
  sender_name text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, comm_key)
);
create index if not exists aipify_hosts_guest_communications_tenant_idx
  on public.aipify_hosts_guest_communications (tenant_id, comm_status, sent_at desc);
alter table public.aipify_hosts_guest_communications enable row level security;
revoke all on public.aipify_hosts_guest_communications from authenticated, anon;

create table if not exists public.aipify_hosts_team_communications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  comm_key text not null,
  recipient text not null,
  subject text not null,
  category text not null default 'internal_team_messages' check (
    category in (
      'internal_team_messages', 'operational_notices', 'maintenance_notices', 'property_updates'
    )
  ),
  comm_status text not null default 'draft' check (
    comm_status in ('draft', 'scheduled', 'sent', 'delivered', 'failed')
  ),
  sender_name text,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, comm_key)
);
create index if not exists aipify_hosts_team_communications_tenant_idx
  on public.aipify_hosts_team_communications (tenant_id, comm_status, sent_at desc);
alter table public.aipify_hosts_team_communications enable row level security;
revoke all on public.aipify_hosts_team_communications from authenticated, anon;

create table if not exists public.aipify_hosts_communication_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  template_key text not null,
  template_name text not null,
  template_type text not null check (
    template_type in (
      'welcome_template', 'check_in_instructions', 'checkout_reminder',
      'thank_you_message', 'maintenance_notification', 'emergency_notice'
    )
  ),
  subject_line text not null,
  body_template text not null,
  delivery_channel text not null default 'email' check (delivery_channel in ('email', 'sms', 'push')),
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, template_key)
);
alter table public.aipify_hosts_communication_templates enable row level security;
revoke all on public.aipify_hosts_communication_templates from authenticated, anon;

create table if not exists public.aipify_hosts_communication_announcements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  announcement_key text not null,
  announcement_type text not null check (
    announcement_type in ('property_wide', 'team_announcement', 'operational_notice')
  ),
  title text not null,
  body text not null,
  comm_status text not null default 'draft' check (
    comm_status in ('draft', 'scheduled', 'sent', 'delivered', 'failed')
  ),
  is_critical boolean not null default false,
  scheduled_at timestamptz,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, announcement_key)
);
create index if not exists aipify_hosts_communication_announcements_tenant_idx
  on public.aipify_hosts_communication_announcements (tenant_id, comm_status, is_critical);
alter table public.aipify_hosts_communication_announcements enable row level security;
revoke all on public.aipify_hosts_communication_announcements from authenticated, anon;

create table if not exists public.aipify_hosts_communication_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_communication_center_events_tenant_idx
  on public.aipify_hosts_communication_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_communication_center_events enable row level security;
revoke all on public.aipify_hosts_communication_center_events from authenticated, anon;

create or replace function public._ahostcom_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_communication_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_communication_center_settings;
begin
  insert into public.aipify_hosts_communication_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_communication_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostcom_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_communication_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'communication_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostcom_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'team_events', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostbp393_positioning() returns text language sql immutable as $$
  select 'Centralize hospitality communication — guest messages, team updates, templates, announcements, and delivery history in one Communication Center.'; $$;

create or replace function public._ahostbp393_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'guest_communications', 'label', 'Guest Communications'),
    jsonb_build_object('key', 'team_communications', 'label', 'Team Communications'),
    jsonb_build_object('key', 'templates', 'label', 'Templates'),
    jsonb_build_object('key', 'announcements', 'label', 'Announcements'),
    jsonb_build_object('key', 'communication_history', 'label', 'Communication History')
  ); $$;

create or replace function public._ahostcom_guest_row(p_g public.aipify_hosts_guest_communications, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_g.id, 'comm_key', p_g.comm_key, 'guest_name', p_g.guest_name,
    'property_id', p_g.property_id, 'property', coalesce(p_property, '—'),
    'message_type', p_g.message_type, 'delivery_channel', p_g.delivery_channel,
    'comm_status', p_g.comm_status, 'subject', coalesce(p_g.subject, ''),
    'body_preview', coalesce(p_g.body_preview, ''),
    'sender_name', coalesce(p_g.sender_name, '—'),
    'sent_at', coalesce(p_g.sent_at::text, ''),
    'scheduled_at', coalesce(p_g.scheduled_at::text, ''),
    'recipient_type', 'guest'
  ); $$;

create or replace function public._ahostcom_team_row(p_t public.aipify_hosts_team_communications, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_t.id, 'comm_key', p_t.comm_key, 'recipient', p_t.recipient,
    'property_id', p_t.property_id, 'property', coalesce(p_property, '—'),
    'subject', p_t.subject, 'category', p_t.category,
    'comm_status', p_t.comm_status, 'sender_name', coalesce(p_t.sender_name, '—'),
    'sent_at', coalesce(p_t.sent_at::text, ''),
    'recipient_type', 'team'
  ); $$;

create or replace function public._ahostcom_template_row(p_tpl public.aipify_hosts_communication_templates)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_tpl.id, 'template_key', p_tpl.template_key, 'template_name', p_tpl.template_name,
    'template_type', p_tpl.template_type, 'subject_line', p_tpl.subject_line,
    'body_template', p_tpl.body_template, 'delivery_channel', p_tpl.delivery_channel,
    'is_active', p_tpl.is_active
  ); $$;

create or replace function public._ahostcom_announcement_row(p_a public.aipify_hosts_communication_announcements, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_a.id, 'announcement_key', p_a.announcement_key,
    'property_id', p_a.property_id, 'property', coalesce(p_property, 'All properties'),
    'announcement_type', p_a.announcement_type, 'title', p_a.title,
    'body', p_a.body, 'comm_status', p_a.comm_status, 'is_critical', p_a.is_critical,
    'scheduled_at', coalesce(p_a.scheduled_at::text, ''),
    'sent_at', coalesce(p_a.sent_at::text, '')
  ); $$;

create or replace function public._ahostcom_history_row(
  p_sender text, p_recipient text, p_property text, p_type text,
  p_status text, p_date text, p_channel text default null, p_id uuid default null
) returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p_id, 'sender', p_sender, 'recipient', p_recipient,
    'property', p_property, 'message_type', p_type,
    'comm_status', p_status, 'sent_at', p_date,
    'delivery_channel', coalesce(p_channel, 'email')
  ); $$;

create or replace function public._ahostcom_seed_communications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_guest_communications where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  if v_prop is null then return; end if;

  insert into public.aipify_hosts_communication_templates (
    tenant_id, template_key, template_name, template_type, subject_line, body_template, delivery_channel
  ) values
    (v_tenant_id, 'tpl_welcome', 'Welcome Template', 'welcome_template',
      'Welcome to your stay', 'Dear guest, welcome to {property}. We hope you enjoy your visit.', 'email'),
    (v_tenant_id, 'tpl_checkin', 'Check-In Instructions', 'check_in_instructions',
      'Your check-in details', 'Check-in is from 3 PM. Access code: {code}. Wi-Fi: {wifi}.', 'email'),
    (v_tenant_id, 'tpl_checkout', 'Checkout Reminder', 'checkout_reminder',
      'Checkout reminder', 'Checkout is at 11 AM tomorrow. Please leave keys in the lockbox.', 'sms'),
    (v_tenant_id, 'tpl_thanks', 'Thank You Message', 'thank_you_message',
      'Thank you for staying with us', 'Thank you for choosing us. We hope to welcome you again.', 'email'),
    (v_tenant_id, 'tpl_maint', 'Maintenance Notification', 'maintenance_notification',
      'Scheduled maintenance notice', 'Brief maintenance is scheduled during your stay. We apologize for any inconvenience.', 'email'),
    (v_tenant_id, 'tpl_emerg', 'Emergency Notice', 'emergency_notice',
      'Important property notice', 'Please review this important notice regarding your property.', 'push');

  insert into public.aipify_hosts_guest_communications (
    tenant_id, property_id, comm_key, guest_name, message_type, delivery_channel,
    comm_status, subject, body_preview, sender_name, sent_at, scheduled_at
  ) values
    (v_tenant_id, v_prop, 'gcom_001', 'Anders Guest', 'welcome_messages', 'email',
      'delivered', 'Welcome to your stay', 'Welcome message with check-in details', 'Guest Services', now() - interval '2 days', null),
    (v_tenant_id, v_prop, 'gcom_002', 'Berg Family', 'arrival_information', 'sms',
      'scheduled', 'Arrival information', 'Arrival instructions and parking details', 'Operations', null, now() + interval '1 day'),
    (v_tenant_id, v_prop, 'gcom_003', 'Chen Stay', 'maintenance_notices', 'email',
      'failed', 'Maintenance notice', 'HVAC service scheduled during stay', 'Property Manager', now() - interval '1 day', null),
    (v_tenant_id, v_prop, 'gcom_004', 'Dahl Guest', 'follow_up_messages', 'email',
      'sent', 'Thank you for your stay', 'Post-departure thank you message', 'Guest Services', now() - interval '5 hours', null);

  insert into public.aipify_hosts_team_communications (
    tenant_id, property_id, comm_key, recipient, subject, category, comm_status, sender_name, sent_at
  ) values
    (v_tenant_id, v_prop, 'tcom_001', 'Housekeeping Team', 'Departure cleaning schedule', 'internal_team_messages', 'delivered', 'Operations Lead', now() - interval '1 day'),
    (v_tenant_id, v_prop, 'tcom_002', 'Front Desk', 'Guest arrival briefing', 'operational_notices', 'sent', 'Guest Services', now() - interval '3 hours'),
    (v_tenant_id, null, 'tcom_003', 'All Team Members', 'Weekly operations update', 'internal_team_messages', 'scheduled', 'Operations Manager', null);

  insert into public.aipify_hosts_communication_announcements (
    tenant_id, property_id, announcement_key, announcement_type, title, body,
    comm_status, is_critical, scheduled_at, sent_at
  ) values
    (v_tenant_id, v_prop, 'ann_001', 'property_wide', 'Pool maintenance this week',
      'The pool will be closed Tuesday for scheduled maintenance.', 'sent', false, null, now() - interval '2 days'),
    (v_tenant_id, null, 'ann_002', 'team_announcement', 'New guest communication standards',
      'Please review updated hospitality communication standards in the Knowledge Center.', 'scheduled', false, now() + interval '6 hours', null),
    (v_tenant_id, v_prop, 'ann_003', 'operational_notice', 'Emergency water shutoff',
      'Water will be temporarily shut off Thursday 9–11 AM for repairs.', 'draft', true, null, null);
end; $$;

create or replace function public._ahostcom_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'guest_messages_30d', (select count(*)::int from public.aipify_hosts_guest_communications
      where tenant_id = p_tenant_id and sent_at >= now() - interval '30 days'),
    'team_messages_30d', (select count(*)::int from public.aipify_hosts_team_communications
      where tenant_id = p_tenant_id and sent_at >= now() - interval '30 days'),
    'scheduled_count', (
      (select count(*)::int from public.aipify_hosts_guest_communications where tenant_id = p_tenant_id and comm_status = 'scheduled') +
      (select count(*)::int from public.aipify_hosts_team_communications where tenant_id = p_tenant_id and comm_status = 'scheduled') +
      (select count(*)::int from public.aipify_hosts_communication_announcements where tenant_id = p_tenant_id and comm_status = 'scheduled')
    ),
    'failed_count', (
      (select count(*)::int from public.aipify_hosts_guest_communications where tenant_id = p_tenant_id and comm_status = 'failed') +
      (select count(*)::int from public.aipify_hosts_team_communications where tenant_id = p_tenant_id and comm_status = 'failed')
    ),
    'active_templates', (select count(*)::int from public.aipify_hosts_communication_templates
      where tenant_id = p_tenant_id and is_active),
    'pending_critical_announcements', (select count(*)::int from public.aipify_hosts_communication_announcements
      where tenant_id = p_tenant_id and is_critical and comm_status in ('draft', 'scheduled')),
    'delivered_count', (select count(*)::int from public.aipify_hosts_guest_communications
      where tenant_id = p_tenant_id and comm_status = 'delivered')
  ); $$;

create or replace function public._ahostcom_check_notifications(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select g.id, g.guest_name, g.message_type from public.aipify_hosts_guest_communications g
    where g.tenant_id = p_tenant_id and g.comm_status = 'failed'
  loop
    perform public._ahostcom_push_notification(p_tenant_id, 'com_fail_' || r.id::text, 'high',
      'Message Delivery Failed', 'Failed to deliver ' || replace(r.message_type, '_', ' ') || ' to ' || r.guest_name);
  end loop;

  for r in
    select g.id, g.guest_name from public.aipify_hosts_guest_communications g
    where g.tenant_id = p_tenant_id and g.comm_status = 'scheduled'
      and g.scheduled_at is not null and g.scheduled_at <= now() + interval '2 hours'
  loop
    perform public._ahostcom_push_notification(p_tenant_id, 'com_sched_' || r.id::text, 'important',
      'Scheduled Communication Due', 'Message to ' || r.guest_name || ' is due soon');
  end loop;

  for r in
    select a.id, a.title from public.aipify_hosts_communication_announcements a
    where a.tenant_id = p_tenant_id and a.is_critical and a.comm_status in ('draft', 'scheduled')
  loop
    perform public._ahostcom_push_notification(p_tenant_id, 'com_crit_' || r.id::text, 'critical',
      'Critical Announcement Pending', r.title);
  end loop;
end; $$;

create or replace function public.get_aipify_hosts_communication_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_cc public.aipify_hosts_communication_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_cc := public._ahostcom_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp393_positioning(),
    'route', '/app/aipify-hosts/communications',
    'stats', public._ahostcom_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_communication_center_dashboard(
  p_section text default 'guest_communications',
  p_property_id uuid default null,
  p_status text default null,
  p_recipient_type text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_cc public.aipify_hosts_communication_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_guest jsonb; v_team jsonb; v_templates jsonb; v_announcements jsonb; v_history jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_cc := public._ahostcom_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_cc.default_section, 'guest_communications');
  perform public._ahostcom_seed_communications(v_tenant_id);
  perform public._ahostcom_check_notifications(v_tenant_id);
  perform public._ahostcom_log_event(v_tenant_id, 'dashboard_view', 'Communication Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(
    public._ahostcom_guest_row(g, p.display_name) order by coalesce(g.sent_at, g.scheduled_at, g.created_at) desc
  ), '[]'::jsonb) into v_guest
  from public.aipify_hosts_guest_communications g
  left join public.aipify_hosts_properties p on p.id = g.property_id
  where g.tenant_id = v_tenant_id
    and (p_property_id is null or g.property_id = p_property_id)
    and (p_status is null or g.comm_status = p_status)
    and (p_recipient_type is null or p_recipient_type = 'guest')
    and (v_section in ('guest_communications', 'communication_history') or v_section = 'guest_communications');

  select coalesce(jsonb_agg(
    public._ahostcom_team_row(t, p.display_name) order by coalesce(t.sent_at, t.created_at) desc
  ), '[]'::jsonb) into v_team
  from public.aipify_hosts_team_communications t
  left join public.aipify_hosts_properties p on p.id = t.property_id
  where t.tenant_id = v_tenant_id
    and (p_property_id is null or t.property_id = p_property_id or t.property_id is null)
    and (p_status is null or t.comm_status = p_status)
    and (p_recipient_type is null or p_recipient_type = 'team')
    and (v_section in ('team_communications', 'communication_history') or v_section = 'team_communications');

  select coalesce(jsonb_agg(
    public._ahostcom_template_row(tpl) order by tpl.template_name
  ), '[]'::jsonb) into v_templates
  from public.aipify_hosts_communication_templates tpl
  where tpl.tenant_id = v_tenant_id and tpl.is_active;

  select coalesce(jsonb_agg(
    public._ahostcom_announcement_row(a, p.display_name) order by a.created_at desc
  ), '[]'::jsonb) into v_announcements
  from public.aipify_hosts_communication_announcements a
  left join public.aipify_hosts_properties p on p.id = a.property_id
  where a.tenant_id = v_tenant_id
    and (p_property_id is null or a.property_id = p_property_id or a.property_id is null);

  select coalesce(jsonb_agg(h order by (h ->> 'sent_at') desc nulls last), '[]'::jsonb) into v_history
  from (
    select public._ahostcom_history_row(
      coalesce(g.sender_name, 'System'), g.guest_name, coalesce(p.display_name, '—'),
      g.message_type, g.comm_status, coalesce(g.sent_at::text, g.scheduled_at::text, g.created_at::text),
      g.delivery_channel, g.id
    ) as h
    from public.aipify_hosts_guest_communications g
    left join public.aipify_hosts_properties p on p.id = g.property_id
    where g.tenant_id = v_tenant_id and g.comm_status not in ('draft')
    union all
    select public._ahostcom_history_row(
      coalesce(t.sender_name, 'System'), t.recipient, coalesce(p.display_name, '—'),
      t.category, t.comm_status, coalesce(t.sent_at::text, t.created_at::text),
      'email', t.id
    )
    from public.aipify_hosts_team_communications t
    left join public.aipify_hosts_properties p on p.id = t.property_id
    where t.tenant_id = v_tenant_id and t.comm_status not in ('draft')
  ) combined;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_cc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp393_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_communication_creation', true,
      'audit_communication_edits', true,
      'audit_delivery_status', true
    ),
    'sections', public._ahostbp393_sections(),
    'communication_types', jsonb_build_array(
      'arrival_information', 'departure_information', 'property_updates',
      'maintenance_notices', 'welcome_messages', 'follow_up_messages', 'internal_team_messages'
    ),
    'communication_statuses', jsonb_build_array('draft', 'scheduled', 'sent', 'delivered', 'failed'),
    'delivery_channels', jsonb_build_array('email', 'sms', 'push'),
    'recipient_types', jsonb_build_array('guest', 'team'),
    'stats', public._ahostcom_dashboard_stats(v_tenant_id),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p
      where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'guest_communications', case when v_section in ('guest_communications', 'communication_history') then v_guest else '[]'::jsonb end,
    'team_communications', case when v_section in ('team_communications', 'communication_history') then v_team else '[]'::jsonb end,
    'templates', case when v_section = 'templates' then v_templates else v_templates end,
    'announcements', case when v_section = 'announcements' then v_announcements else '[]'::jsonb end,
    'communication_history', case when v_section = 'communication_history' then v_history else '[]'::jsonb end,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 31 — Communication Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_31_COMMUNICATION_CENTER.text',
      'route', '/app/aipify-hosts/communications'
    )
  );
end; $$;

create or replace function public.perform_aipify_hosts_communication_action(
  p_action_type text,
  p_comm_id uuid default null,
  p_comm_type text default 'guest',
  p_template_id uuid default null,
  p_announcement_id uuid default null,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  if p_action_type = 'send_message' then
    if p_comm_type = 'guest' then
      update public.aipify_hosts_guest_communications set
        comm_status = 'sent', sent_at = now(), updated_at = now()
      where id = p_comm_id and tenant_id = v_tenant_id;
    else
      update public.aipify_hosts_team_communications set
        comm_status = 'sent', sent_at = now(), updated_at = now()
      where id = p_comm_id and tenant_id = v_tenant_id;
    end if;
    perform public._ahostcom_log_event(v_tenant_id, 'message_sent', 'Communication sent',
      jsonb_build_object('comm_id', p_comm_id, 'comm_type', p_comm_type));
    v_summary := 'Message sent';

  elsif p_action_type = 'mark_delivered' then
    if p_comm_type = 'guest' then
      update public.aipify_hosts_guest_communications set comm_status = 'delivered', updated_at = now()
      where id = p_comm_id and tenant_id = v_tenant_id;
    else
      update public.aipify_hosts_team_communications set comm_status = 'delivered', updated_at = now()
      where id = p_comm_id and tenant_id = v_tenant_id;
    end if;
    perform public._ahostcom_log_event(v_tenant_id, 'delivery_confirmed', 'Delivery confirmed',
      jsonb_build_object('comm_id', p_comm_id));
    v_summary := 'Marked delivered';

  elsif p_action_type = 'retry_failed' then
    update public.aipify_hosts_guest_communications set comm_status = 'scheduled', updated_at = now()
    where id = p_comm_id and tenant_id = v_tenant_id and comm_status = 'failed';
    perform public._ahostcom_log_event(v_tenant_id, 'retry_scheduled', 'Failed message retry scheduled',
      jsonb_build_object('comm_id', p_comm_id));
    v_summary := 'Retry scheduled';

  elsif p_action_type = 'publish_announcement' then
    update public.aipify_hosts_communication_announcements set
      comm_status = 'sent', sent_at = now(), updated_at = now()
    where id = p_announcement_id and tenant_id = v_tenant_id;
    perform public._ahostcom_log_event(v_tenant_id, 'announcement_published', 'Announcement published',
      jsonb_build_object('announcement_id', p_announcement_id));
    v_summary := 'Announcement published';

  elsif p_action_type = 'use_template' then
    perform public._ahostcom_log_event(v_tenant_id, 'template_used', 'Template applied',
      jsonb_build_object('template_id', p_template_id, 'notes', p_notes));
    v_summary := 'Template ready to use';

  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostcom_log_event(v_tenant_id, 'action', v_summary,
    jsonb_build_object('action_type', p_action_type));
  return jsonb_build_object('success', true, 'action_type', p_action_type, 'summary', v_summary);
end; $$;

create or replace function public.seed_aipify_hosts_communication_center_knowledge_airbnb31()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-communication', 'Hosts Communication Center',
    'Hospitality communication standards, guest messaging, team updates, and templates.', 327
  );
  perform public._ahostkc_seed_article('aipify-hosts-communication', 'hospitality-communication-standards', 'Hospitality communication standards',
    'Use consistent tone, clear timing, and approved channels for every guest and team message.');
  perform public._ahostkc_seed_article('aipify-hosts-communication', 'writing-effective-guest-messages', 'Writing effective guest messages',
    'Keep guest messages concise, property-specific, and action-oriented with clear next steps.');
  perform public._ahostkc_seed_article('aipify-hosts-communication', 'team-communication-best-practices', 'Team communication best practices',
    'Route operational updates to the right recipients and confirm delivery for time-sensitive notices.');
  perform public._ahostkc_seed_article('aipify-hosts-communication', 'managing-communication-templates', 'Managing communication templates',
    'Maintain welcome, check-in, checkout, thank-you, maintenance, and emergency templates for consistent hospitality.');
end; $$;

select public.seed_aipify_hosts_communication_center_knowledge_airbnb31();

grant execute on function public.get_aipify_hosts_communication_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_communication_center_dashboard(text, uuid, text, text, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_communication_action(text, uuid, text, uuid, uuid, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_communication_center_knowledge_airbnb31() to authenticated;

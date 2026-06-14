-- Phase 25 — Desktop Presence Foundation (notification architecture)

-- ---------------------------------------------------------------------------
-- 1. Presence notifications
-- ---------------------------------------------------------------------------
create table if not exists public.presence_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  surface text not null default 'customer' check (surface in ('platform', 'customer', 'pilot')),
  event_type text not null,
  level text not null default 'informational' check (
    level in ('informational', 'important', 'action_required', 'critical')
  ),
  title text not null,
  body text,
  status text not null default 'pending' check (
    status in ('pending', 'delivered', 'read', 'dismissed', 'acted')
  ),
  channels jsonb not null default '["in_app"]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  action_href text,
  metadata jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists presence_notifications_tenant_idx
  on public.presence_notifications (tenant_id, created_at desc);
create index if not exists presence_notifications_status_idx
  on public.presence_notifications (tenant_id, status);

alter table public.presence_notifications enable row level security;
revoke all on public.presence_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Notification preferences (quiet hours + channels)
-- ---------------------------------------------------------------------------
create table if not exists public.presence_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  quiet_hours_mode text not null default 'standard' check (
    quiet_hours_mode in ('standard', 'working_hours_only', 'minimal', 'vacation')
  ),
  working_hours_start time not null default '09:00',
  working_hours_end time not null default '17:00',
  timezone text not null default 'UTC',
  vacation_until date,
  channel_in_app boolean not null default true,
  channel_desktop boolean not null default true,
  channel_email_digest boolean not null default false,
  channel_mobile_push boolean not null default false,
  min_level_in_app text not null default 'informational' check (
    min_level_in_app in ('informational', 'important', 'action_required', 'critical')
  ),
  min_level_desktop text not null default 'important' check (
    min_level_desktop in ('informational', 'important', 'action_required', 'critical')
  ),
  min_level_email text not null default 'important' check (
    min_level_email in ('informational', 'important', 'action_required', 'critical')
  ),
  updated_at timestamptz not null default now()
);

alter table public.presence_notification_preferences enable row level security;
revoke all on public.presence_notification_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Desktop client registry (future macOS / Windows / Linux apps)
-- ---------------------------------------------------------------------------
create table if not exists public.presence_desktop_clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  platform text not null check (platform in ('macos', 'windows', 'linux')),
  device_name text,
  status text not null default 'registered' check (status in ('registered', 'active', 'revoked')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists presence_desktop_clients_tenant_idx
  on public.presence_desktop_clients (tenant_id, platform);

alter table public.presence_desktop_clients enable row level security;
revoke all on public.presence_desktop_clients from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._presence_tenant_for_auth()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_customer_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  return v_customer_id;
end;
$$;

create or replace function public.ensure_presence_notification_preferences(p_tenant_id uuid)
returns public.presence_notification_preferences
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.presence_notification_preferences;
begin
  insert into public.presence_notification_preferences (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.presence_notification_preferences
  where tenant_id = p_tenant_id;

  return v_row;
end;
$$;

grant execute on function public.ensure_presence_notification_preferences(uuid) to authenticated;

create or replace function public.record_presence_notification(
  p_tenant_id uuid,
  p_event_type text,
  p_level text,
  p_title text,
  p_body text default null,
  p_channels jsonb default '["in_app"]'::jsonb,
  p_actions jsonb default '[]'::jsonb,
  p_action_href text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.presence_notifications (
    tenant_id, surface, event_type, level, title, body,
    status, channels, actions, action_href, metadata, delivered_at
  )
  values (
    p_tenant_id, 'customer', p_event_type, p_level, p_title, p_body,
    'delivered', coalesce(p_channels, '["in_app"]'::jsonb),
    coalesce(p_actions, '[]'::jsonb), p_action_href, coalesce(p_metadata, '{}'::jsonb), now()
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_presence_notification(
  uuid, text, text, text, text, jsonb, jsonb, text, jsonb
) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. List notifications
-- ---------------------------------------------------------------------------
create or replace function public.list_presence_notifications(
  p_limit integer default 20,
  p_unread_only boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('notifications', '[]'::jsonb, 'unread_count', 0);
  end if;

  return jsonb_build_object(
    'notifications', coalesce(
      (select jsonb_agg(
        jsonb_build_object(
          'id', n.id,
          'event_type', n.event_type,
          'level', n.level,
          'title', n.title,
          'body', n.body,
          'status', n.status,
          'channels', n.channels,
          'actions', n.actions,
          'action_href', n.action_href,
          'created_at', n.created_at,
          'read_at', n.read_at
        ) order by n.created_at desc
      )
      from public.presence_notifications n
      where n.tenant_id = v_tenant_id
        and (not p_unread_only or n.status in ('pending', 'delivered'))
      limit greatest(p_limit, 1)),
      '[]'::jsonb
    ),
    'unread_count', (
      select count(*)::integer from public.presence_notifications n
      where n.tenant_id = v_tenant_id
        and n.status in ('pending', 'delivered')
    )
  );
end;
$$;

grant execute on function public.list_presence_notifications(integer, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Perform notification action
-- ---------------------------------------------------------------------------
create or replace function public.perform_presence_notification_action(
  p_notification_id uuid,
  p_action_type text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_notification public.presence_notifications;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_notification
  from public.presence_notifications n
  where n.id = p_notification_id and n.tenant_id = v_tenant_id;

  if v_notification.id is null then
    raise exception 'Notification not found';
  end if;

  if p_action_type = 'dismiss' then
    update public.presence_notifications
    set status = 'dismissed', dismissed_at = now()
    where id = p_notification_id;
  elsif p_action_type in ('view_details', 'open_dashboard', 'approve_recommendation', 'escalate') then
    update public.presence_notifications
    set status = 'acted', read_at = coalesce(read_at, now())
    where id = p_notification_id;
  else
    raise exception 'Invalid action type';
  end if;

  return jsonb_build_object(
    'notification_id', p_notification_id,
    'action', p_action_type,
    'href', v_notification.action_href
  );
end;
$$;

grant execute on function public.perform_presence_notification_action(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Preferences get / update
-- ---------------------------------------------------------------------------
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

  v_prefs := public.ensure_presence_notification_preferences(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'preferences', row_to_json(v_prefs)
  );
end;
$$;

grant execute on function public.get_presence_notification_preferences() to authenticated;

create or replace function public.update_presence_notification_preferences(
  p_quiet_hours_mode text default null,
  p_working_hours_start time default null,
  p_working_hours_end time default null,
  p_timezone text default null,
  p_vacation_until date default null,
  p_channel_in_app boolean default null,
  p_channel_desktop boolean default null,
  p_channel_email_digest boolean default null,
  p_channel_mobile_push boolean default null,
  p_min_level_in_app text default null,
  p_min_level_desktop text default null,
  p_min_level_email text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_prefs public.presence_notification_preferences;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_prefs := public.ensure_presence_notification_preferences(v_tenant_id);

  update public.presence_notification_preferences
  set
    quiet_hours_mode = coalesce(p_quiet_hours_mode, quiet_hours_mode),
    working_hours_start = coalesce(p_working_hours_start, working_hours_start),
    working_hours_end = coalesce(p_working_hours_end, working_hours_end),
    timezone = coalesce(p_timezone, timezone),
    vacation_until = coalesce(p_vacation_until, vacation_until),
    channel_in_app = coalesce(p_channel_in_app, channel_in_app),
    channel_desktop = coalesce(p_channel_desktop, channel_desktop),
    channel_email_digest = coalesce(p_channel_email_digest, channel_email_digest),
    channel_mobile_push = coalesce(p_channel_mobile_push, channel_mobile_push),
    min_level_in_app = coalesce(p_min_level_in_app, min_level_in_app),
    min_level_desktop = coalesce(p_min_level_desktop, min_level_desktop),
    min_level_email = coalesce(p_min_level_email, min_level_email),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_prefs;

  return jsonb_build_object('preferences', row_to_json(v_prefs));
end;
$$;

grant execute on function public.update_presence_notification_preferences(
  text, time, time, text, date, boolean, boolean, boolean, boolean, text, text, text
) to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Desktop presence bundle (future desktop sidebar)
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_presence_bundle()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_company_id uuid;
  v_health integer;
  v_pending integer;
  v_skills integer;
  v_summary text;
  v_unread integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.company_id into v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  v_health := coalesce((
    select score from public.installation_health_scans ihs
    join public.installations i on i.id = ihs.installation_id
    where i.customer_id = v_tenant_id
    order by ihs.created_at desc limit 1
  ), 90);

  select count(*) into v_pending
  from public.intelligence_patterns ip
  where ip.approval_status in ('pending', 'pending_review');

  select count(*) into v_skills
  from public.tenant_skills ts
  where ts.tenant_id = v_tenant_id and ts.status = 'active';

  v_summary := coalesce((
    select executive_summary from (
      select 'Platform health at ' || v_health::text || '%.' as executive_summary
    ) s
  ), 'Monitoring your environment.');

  select count(*)::integer into v_unread
  from public.presence_notifications n
  where n.tenant_id = v_tenant_id and n.status in ('pending', 'delivered');

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify should work quietly in the background and speak up only when it has something valuable to say.',
    'unread_count', v_unread,
    'desktop_clients_prepared', jsonb_build_array('macos', 'windows', 'linux'),
    'sidebar', jsonb_build_object(
      'health_status', jsonb_build_object('score', v_health, 'label', case
        when v_health >= 85 then 'healthy'
        when v_health >= 70 then 'needs_attention'
        else 'critical'
      end),
      'recent_activity', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'id', pe.id, 'title', pe.title, 'created_at', pe.created_at
        ) order by pe.created_at desc)
        from public.presence_events pe
        where pe.tenant_id = v_tenant_id or pe.surface = 'customer'
        limit 8),
        '[]'::jsonb
      ),
      'recommendations', coalesce(
        (select jsonb_agg(jsonb_build_object('id', gp.id, 'message', gp.pattern_title)
          order by gp.confidence_score desc)
        from public.global_patterns gp where gp.active = true limit 5),
        '[]'::jsonb
      ),
      'executive_summary', v_summary,
      'pending_approvals', v_pending,
      'active_skills', v_skills
    )
  );
end;
$$;

grant execute on function public.get_desktop_presence_bundle() to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Unonight pilot metrics (platform admin)
-- ---------------------------------------------------------------------------
create or replace function public.get_presence_pilot_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pilot_id uuid;
  v_sent integer;
  v_acted integer;
  v_dismissed integer;
  v_total integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select c.id into v_pilot_id
  from public.customers c
  join public.companies co on co.id = c.company_id
  where co.slug = 'unonight'
  limit 1;

  if v_pilot_id is null then
    return jsonb_build_object('has_pilot', false);
  end if;

  select count(*) into v_sent
  from public.presence_notifications
  where tenant_id = v_pilot_id
    and created_at >= now() - interval '7 days';

  select count(*) into v_acted
  from public.presence_notifications
  where tenant_id = v_pilot_id
    and status = 'acted'
    and created_at >= now() - interval '7 days';

  select count(*) into v_dismissed
  from public.presence_notifications
  where tenant_id = v_pilot_id
    and status = 'dismissed'
    and created_at >= now() - interval '7 days';

  v_total := greatest(v_sent, 1);

  return jsonb_build_object(
    'has_pilot', true,
    'tenant_slug', 'unonight',
    'notifications_sent_7d', v_sent,
    'actions_completed_7d', v_acted,
    'dismiss_rate_pct', round((v_dismissed::numeric / v_total) * 100),
    'usefulness_score', greatest(0, least(100, 100 - round((v_dismissed::numeric / v_total) * 40)))
  );
end;
$$;

grant execute on function public.get_presence_pilot_metrics() to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Seed pilot notifications
-- ---------------------------------------------------------------------------
insert into public.presence_notification_preferences (tenant_id)
select c.id
from public.customers c
join public.companies co on co.id = c.company_id
where co.slug = 'unonight'
on conflict (tenant_id) do nothing;

insert into public.presence_notifications (
  tenant_id, event_type, level, title, body, status, channels, actions, action_href
)
select
  c.id,
  v.event_type,
  v.level,
  v.title,
  v.body,
  'delivered',
  '["in_app","desktop"]'::jsonb,
  v.actions,
  v.href
from public.customers c
join public.companies co on co.id = c.company_id
cross join (
  values
    (
      'support_cases_resolved', 'informational',
      'Support cases resolved', 'Support AI resolved 5 customer questions.',
      '[{"id":"view","type":"view_details","label":"View details"}]'::jsonb,
      '/app/support'
    ),
    (
      'executive_briefing_ready', 'important',
      'Executive summary ready', 'Your executive summary is ready.',
      '[{"id":"open","type":"open_dashboard","label":"Open dashboard"}]'::jsonb,
      '/app/presence'
    ),
    (
      'recommendation_generated', 'action_required',
      'New recommendation', 'Aipify generated a recommendation for your review.',
      '[{"id":"approve","type":"approve_recommendation","label":"Approve"},{"id":"dismiss","type":"dismiss","label":"Dismiss"}]'::jsonb,
      '/app/recommendations'
    )
) as v(event_type, level, title, body, actions, href)
where co.slug = 'unonight'
  and not exists (
    select 1 from public.presence_notifications n
    where n.tenant_id = c.id and n.title = v.title
  );

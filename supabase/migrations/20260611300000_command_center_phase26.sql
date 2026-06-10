-- Phase 26 — Command Center & unified Notification Engine (extends Phase 25)

-- ---------------------------------------------------------------------------
-- 1. Executive feed (operational awareness timeline)
-- ---------------------------------------------------------------------------
create table if not exists public.presence_executive_feed (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  time_label text not null,
  message text not null,
  level text not null default 'informational' check (
    level in ('informational', 'important', 'action_required', 'critical')
  ),
  source_engine text not null default 'notification_engine',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists presence_executive_feed_tenant_idx
  on public.presence_executive_feed (tenant_id, created_at desc);

alter table public.presence_executive_feed enable row level security;
revoke all on public.presence_executive_feed from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Engagement tracking (prevent alert fatigue)
-- ---------------------------------------------------------------------------
create table if not exists public.presence_engagement_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  notification_id uuid references public.presence_notifications (id) on delete set null,
  action_type text,
  channel text default 'web',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists presence_engagement_tenant_idx
  on public.presence_engagement_events (tenant_id, created_at desc);

alter table public.presence_engagement_events enable row level security;
revoke all on public.presence_engagement_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Do Not Disturb quiet hours mode
-- ---------------------------------------------------------------------------
alter table public.presence_notification_preferences
  drop constraint if exists presence_notification_preferences_quiet_hours_mode_check;

alter table public.presence_notification_preferences
  add constraint presence_notification_preferences_quiet_hours_mode_check check (
    quiet_hours_mode in (
      'standard', 'working_hours_only', 'minimal', 'vacation', 'do_not_disturb'
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Record engagement
-- ---------------------------------------------------------------------------
create or replace function public.record_presence_engagement(
  p_event_type text,
  p_action_type text default null,
  p_notification_id uuid default null,
  p_channel text default 'web',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  insert into public.presence_engagement_events (
    tenant_id, event_type, notification_id, action_type, channel, metadata
  )
  values (
    v_tenant_id, p_event_type, p_notification_id, p_action_type, p_channel,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_presence_engagement(text, text, uuid, text, jsonb)
  to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Quick action handler
-- ---------------------------------------------------------------------------
create or replace function public.perform_presence_quick_action(
  p_action_id text,
  p_notification_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_href text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_href := case p_action_id
    when 'approve_recommendation' then '/app/recommendations'
    when 'review_support_escalation' then '/app/support'
    when 'open_executive_summary' then '/app/command-center'
    when 'view_installation_health' then '/app/install'
    when 'open_web_dashboard' then '/app'
    else null
  end;

  if p_action_id = 'dismiss_notification' and p_notification_id is not null then
    perform public.perform_presence_notification_action(p_notification_id, 'dismiss');
  elsif p_action_id = 'mark_as_reviewed' and p_notification_id is not null then
    perform public.perform_presence_notification_action(p_notification_id, 'mark_as_reviewed');
  elsif p_action_id = 'pause_notifications' then
    update public.presence_notification_preferences
    set quiet_hours_mode = 'do_not_disturb', updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  perform public.record_presence_engagement(
    'quick_action',
    p_action_id,
    p_notification_id,
    'web',
    jsonb_build_object('href', v_href)
  );

  return jsonb_build_object('action', p_action_id, 'href', v_href);
end;
$$;

grant execute on function public.perform_presence_quick_action(text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Extend notification actions (mark_as_reviewed, approve)
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
  elsif p_action_type in (
    'view_details', 'open_dashboard', 'approve', 'approve_recommendation',
    'escalate', 'mark_as_reviewed'
  ) then
    update public.presence_notifications
    set status = 'acted', read_at = coalesce(read_at, now())
    where id = p_notification_id;
  else
    raise exception 'Invalid action type';
  end if;

  perform public.record_presence_engagement(
    'notification_action', p_action_type, p_notification_id, 'web', '{}'::jsonb
  );

  return jsonb_build_object(
    'notification_id', p_notification_id,
    'action', p_action_type,
    'href', v_notification.action_href
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Unified Command Center bundle (single Aipify Core surface)
-- ---------------------------------------------------------------------------
create or replace function public.get_command_center_bundle()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_desktop jsonb;
  v_notifications jsonb;
  v_limits jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');
  v_desktop := public.get_desktop_presence_bundle();
  v_notifications := public.list_presence_notifications(10, false);

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify should quietly watch over the business. When something truly matters, Aipify should speak up.',
    'core_principle', 'There is only ONE Aipify. Web, Desktop and Mobile are interfaces to the same intelligence layer.',
    'plan', v_plan,
    'capabilities', jsonb_build_object(
      'web', true,
      'enhanced_presence', v_plan in ('growth', 'business', 'enterprise'),
      'executive_feed', v_plan in ('growth', 'business', 'enterprise'),
      'desktop_presence', v_plan in ('business', 'enterprise'),
      'command_center', v_plan in ('business', 'enterprise'),
      'advanced_notifications', v_plan in ('business', 'enterprise'),
      'actionable_approvals', v_plan in ('business', 'enterprise'),
      'mobile_presence', v_plan = 'enterprise',
      'dedicated_policies', v_plan = 'enterprise'
    ),
    'health_overview', v_desktop -> 'sidebar' -> 'health_status',
    'pending_approvals', v_desktop -> 'sidebar' -> 'pending_approvals',
    'active_skills', v_desktop -> 'sidebar' -> 'active_skills',
    'executive_summary', v_desktop -> 'sidebar' -> 'executive_summary',
    'recent_activity', v_desktop -> 'sidebar' -> 'recent_activity',
    'recommendations', v_desktop -> 'sidebar' -> 'recommendations',
    'presence_timeline', v_desktop -> 'sidebar' -> 'recent_activity',
    'executive_feed', coalesce(
      (select jsonb_agg(
        jsonb_build_object(
          'id', f.id,
          'time_label', f.time_label,
          'message', f.message,
          'level', f.level,
          'created_at', f.created_at
        ) order by f.created_at desc
      )
      from public.presence_executive_feed f
      where f.tenant_id = v_tenant_id
      limit 20),
      '[]'::jsonb
    ),
    'notifications', v_notifications -> 'notifications',
    'unread_count', v_notifications -> 'unread_count',
    'desktop_clients_prepared', v_desktop -> 'desktop_clients_prepared',
    'quick_actions', jsonb_build_array(
      jsonb_build_object('id', 'approve_recommendation', 'label', 'Approve recommendation', 'href', '/app/recommendations'),
      jsonb_build_object('id', 'review_support_escalation', 'label', 'Review support escalation', 'href', '/app/support'),
      jsonb_build_object('id', 'open_executive_summary', 'label', 'Open executive summary', 'href', '/app/command-center'),
      jsonb_build_object('id', 'view_installation_health', 'label', 'View installation health', 'href', '/app/install'),
      jsonb_build_object('id', 'open_web_dashboard', 'label', 'Open web dashboard', 'href', '/app'),
      jsonb_build_object('id', 'pause_notifications', 'label', 'Pause notifications', 'href', null)
    )
  );
end;
$$;

grant execute on function public.get_command_center_bundle() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Extended Unonight pilot metrics
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
  v_feed integer;
  v_engagement integer;
  v_total integer;
  v_approval_rate integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select c.id into v_pilot_id
  from public.customers c
  where c.slug = 'unonight'
  limit 1;

  if v_pilot_id is null then
    return jsonb_build_object('has_pilot', false);
  end if;

  select count(*) into v_sent
  from public.presence_notifications
  where tenant_id = v_pilot_id and created_at >= now() - interval '7 days';

  select count(*) into v_acted
  from public.presence_notifications
  where tenant_id = v_pilot_id and status = 'acted'
    and created_at >= now() - interval '7 days';

  select count(*) into v_dismissed
  from public.presence_notifications
  where tenant_id = v_pilot_id and status = 'dismissed'
    and created_at >= now() - interval '7 days';

  select count(*) into v_feed
  from public.presence_executive_feed
  where tenant_id = v_pilot_id;

  select count(*) into v_engagement
  from public.presence_engagement_events
  where tenant_id = v_pilot_id and created_at >= now() - interval '7 days';

  v_total := greatest(v_sent, 1);
  v_approval_rate := round((v_acted::numeric / v_total) * 100);

  return jsonb_build_object(
    'has_pilot', true,
    'tenant_slug', 'unonight',
    'notifications_sent_7d', v_sent,
    'actions_completed_7d', v_acted,
    'dismiss_rate_pct', round((v_dismissed::numeric / v_total) * 100),
    'usefulness_score', greatest(0, least(100, 100 - round((v_dismissed::numeric / v_total) * 40))),
    'executive_feed_entries', v_feed,
    'engagement_events_7d', v_engagement,
    'approval_completion_rate_pct', v_approval_rate,
    'feed_quality_score', least(100, v_feed * 20)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Seed executive feed for Unonight pilot
-- ---------------------------------------------------------------------------
insert into public.presence_executive_feed (tenant_id, time_label, message, level)
select c.id, v.time_label, v.message, v.level
from public.customers c
cross join (
  values
    ('08:30', 'Good morning. Aipify resolved 14 support conversations overnight.', 'informational'),
    ('11:20', 'Aipify completed scheduled maintenance successfully.', 'informational'),
    ('14:15', 'A recommendation is awaiting approval.', 'action_required'),
    ('17:00', 'Daily summary is ready.', 'important')
) as v(time_label, message, level)
where c.slug = 'unonight'
  and not exists (
    select 1 from public.presence_executive_feed f
    where f.tenant_id = c.id and f.time_label = v.time_label
  );

-- Phase 61 — Desktop Companion, Smart Notifications & Assistant Companion

-- ---------------------------------------------------------------------------
-- 1. desktop_modes (reference)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_modes (
  id uuid primary key default gen_random_uuid(),
  mode_key text not null unique,
  name text not null,
  description text not null,
  min_severity text not null default 'important' check (
    min_severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  include_daily_brief boolean not null default false,
  include_mini_chat boolean not null default false,
  include_suggestions boolean not null default false,
  include_reminders boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.desktop_modes enable row level security;
revoke all on public.desktop_modes from authenticated, anon;

insert into public.desktop_modes (mode_key, name, description, min_severity, include_daily_brief, include_mini_chat, include_suggestions, include_reminders, sort_order)
values
  ('silent', 'Silent Mode', 'Critical alerts only.', 'critical', false, false, false, false, 1),
  ('balanced', 'Balanced Mode', 'Critical and important items plus daily briefing.', 'high', true, false, false, true, 2),
  ('active_assistant', 'Active Assistant Mode', 'Notifications, mini-chat, suggestions, and reminders.', 'medium', true, true, true, true, 3),
  ('focus', 'Focus Mode', 'User-selected categories only.', 'medium', false, true, false, true, 4)
on conflict (mode_key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. desktop_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  mode_key text not null default 'balanced' references public.desktop_modes (mode_key),
  enabled boolean not null default true,
  focus_categories text[] not null default '{}',
  quiet_hours jsonb not null default '{"enabled": false, "start": "22:00", "end": "07:00"}'::jsonb,
  timezone text not null default 'Europe/Oslo',
  include_briefing boolean not null default true,
  include_governance boolean not null default true,
  include_quality boolean not null default true,
  include_support boolean not null default true,
  include_knowledge boolean not null default true,
  include_integrations boolean not null default true,
  include_security boolean not null default true,
  max_notifications_per_day int not null default 25,
  dedupe_window_minutes int not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.desktop_preferences enable row level security;
revoke all on public.desktop_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. desktop_notification_events (source events before delivery)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_notification_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_module text not null,
  source_type text not null,
  source_id uuid,
  event_key text not null,
  category text not null default 'general',
  title text not null,
  summary text,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  priority_score int not null default 0,
  requires_action boolean not null default false,
  action_url text,
  recommendation text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);

create index if not exists desktop_notification_events_tenant_idx
  on public.desktop_notification_events (tenant_id, occurred_at desc);

alter table public.desktop_notification_events enable row level security;
revoke all on public.desktop_notification_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. desktop_notifications (delivered to user)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  event_id uuid references public.desktop_notification_events (id) on delete set null,
  source_module text not null,
  category text not null default 'general',
  title text not null,
  body text,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'delivered', 'read', 'dismissed', 'acted')
  ),
  action_url text,
  recommendation text,
  explanation text,
  metadata jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists desktop_notifications_tenant_idx
  on public.desktop_notifications (tenant_id, created_at desc);
create index if not exists desktop_notifications_user_status_idx
  on public.desktop_notifications (tenant_id, user_id, status);

alter table public.desktop_notifications enable row level security;
revoke all on public.desktop_notifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. desktop_reminders
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_reminders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  reminder_type text not null default 'personal' check (
    reminder_type in ('one_time', 'recurring', 'business', 'approval', 'knowledge_review', 'personal')
  ),
  title text not null,
  body text,
  due_at timestamptz not null,
  recurrence_rule text,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'sent', 'completed', 'cancelled', 'snoozed')
  ),
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists desktop_reminders_tenant_due_idx
  on public.desktop_reminders (tenant_id, user_id, due_at);

alter table public.desktop_reminders enable row level security;
revoke all on public.desktop_reminders from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. desktop_chat_history
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_chat_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  intent text,
  action_href text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists desktop_chat_history_user_idx
  on public.desktop_chat_history (tenant_id, user_id, created_at desc);

alter table public.desktop_chat_history enable row level security;
revoke all on public.desktop_chat_history from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._dk_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._dk_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._dk_priority_score(p_severity text, p_requires_action boolean default false)
returns int language sql immutable as $$
  select (
    case p_severity
      when 'critical' then 100
      when 'high' then 75
      when 'medium' then 50
      when 'low' then 25
      else 10
    end
  ) + case when p_requires_action then 20 else 0 end;
$$;

create or replace function public._dk_ensure_preferences(p_tenant_id uuid, p_user_id uuid)
returns public.desktop_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.desktop_preferences;
begin
  insert into public.desktop_preferences (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do update set updated_at = now();
  select * into v_row from public.desktop_preferences
  where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._dk_severity_rank(p_severity text)
returns int language sql immutable as $$
  select case p_severity
    when 'critical' then 5 when 'high' then 4 when 'medium' then 3 when 'low' then 2 else 1 end;
$$;

create or replace function public._dk_mode_allows(
  p_mode_key text,
  p_severity text,
  p_category text,
  p_focus_categories text[]
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_min text;
begin
  select min_severity into v_min from public.desktop_modes where mode_key = p_mode_key;
  if v_min is null then return false; end if;
  if public._dk_severity_rank(p_severity) < public._dk_severity_rank(v_min) then
    return false;
  end if;
  if p_mode_key = 'focus' then
    return p_category = any(coalesce(p_focus_categories, '{}'::text[]));
  end if;
  return true;
end; $$;

create or replace function public._dk_upsert_event(
  p_tenant_id uuid,
  p_source_module text,
  p_source_type text,
  p_source_id uuid,
  p_event_key text,
  p_category text,
  p_title text,
  p_summary text,
  p_severity text,
  p_requires_action boolean,
  p_action_url text,
  p_recommendation text,
  p_occurred_at timestamptz,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.desktop_notification_events (
    tenant_id, source_module, source_type, source_id, event_key, category, title, summary,
    severity, priority_score, requires_action, action_url, recommendation, occurred_at, metadata
  ) values (
    p_tenant_id, p_source_module, p_source_type, p_source_id, p_event_key, p_category, p_title, p_summary,
    coalesce(p_severity, 'info'), public._dk_priority_score(p_severity, p_requires_action),
    coalesce(p_requires_action, false), p_action_url, p_recommendation,
    coalesce(p_occurred_at, now()), coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (tenant_id, event_key) do update set
    title = excluded.title, summary = excluded.summary, severity = excluded.severity,
    priority_score = excluded.priority_score, requires_action = excluded.requires_action,
    action_url = excluded.action_url, recommendation = excluded.recommendation,
    occurred_at = excluded.occurred_at, metadata = excluded.metadata;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Collect events from modules
-- ---------------------------------------------------------------------------
create or replace function public.upsert_desktop_notification_events_batch(p_events jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_item jsonb; v_count int := 0;
begin
  v_tenant_id := public._dk_require_tenant();
  for v_item in select * from jsonb_array_elements(coalesce(p_events, '[]'::jsonb))
  loop
    perform public._dk_upsert_event(
      v_tenant_id,
      v_item->>'source_module', v_item->>'source_type',
      nullif(v_item->>'source_id', '')::uuid,
      v_item->>'event_key', coalesce(v_item->>'category', 'general'),
      v_item->>'title', v_item->>'summary',
      coalesce(v_item->>'severity', 'info'),
      coalesce((v_item->>'requires_action')::boolean, false),
      v_item->>'action_url', v_item->>'recommendation',
      coalesce((v_item->>'occurred_at')::timestamptz, now()),
      coalesce(v_item->'metadata', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('upserted', v_count);
end; $$;

create or replace function public.collect_desktop_notification_events(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prefs public.desktop_preferences;
  v_since timestamptz;
  v_count int := 0;
  r record;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is not null then
    v_prefs := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  end if;
  v_since := coalesce(p_since, now() - interval '7 days');

  if coalesce(v_prefs.include_quality, true) then
    for r in
      select id, incident_key, title, severity, category, observed_behavior, created_at
      from public.aipify_quality_incidents
      where tenant_id = v_tenant_id and status in ('open', 'investigating')
        and created_at >= v_since
    loop
      perform public._dk_upsert_event(
        v_tenant_id, 'quality', 'quality_incident', r.id,
        'desktop.quality.' || r.incident_key, 'quality', r.title, r.observed_behavior, r.severity,
        r.severity in ('high', 'critical'), '/app/quality/incidents', 'Review incident and assign owner',
        r.created_at, jsonb_build_object('category', r.category)
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if coalesce(v_prefs.include_governance, true) then
    for r in
      select id, title, risk_level, status, created_at
      from public.aipify_approval_requests
      where tenant_id = v_tenant_id and status = 'pending' and created_at >= v_since
    loop
      perform public._dk_upsert_event(
        v_tenant_id, 'governance', 'approval_request', r.id,
        'desktop.governance.approval.' || r.id::text, 'governance',
        'Approval pending: ' || r.title, 'Requires admin review',
        coalesce(r.risk_level, 'medium'), true, '/app/approvals', 'Open Approval Center',
        r.created_at, '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if coalesce(v_prefs.include_knowledge, true) then
    for r in
      select id, question, status, created_at
      from public.aipify_knowledge_gaps
      where tenant_id = v_tenant_id and status in ('open', 'pending') and created_at >= v_since
    loop
      perform public._dk_upsert_event(
        v_tenant_id, 'knowledge', 'knowledge_gap', r.id,
        'desktop.knowledge.gap.' || r.id::text, 'knowledge',
        'Knowledge gap opened', left(r.question, 200), 'medium', true,
        '/app/knowledge-center/gaps', 'Review and draft answer', r.created_at, '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  for r in
    select id, source_module, source_type, source_id, event_key, title, summary, severity,
           requires_action, action_url, occurred_at, metadata
    from public.aipify_briefing_events
    where tenant_id = v_tenant_id and occurred_at >= v_since
    limit 50
  loop
    perform public._dk_upsert_event(
      v_tenant_id, coalesce(r.source_module, 'briefing'), r.source_type, r.source_id,
      'desktop.briefing.' || r.event_key, coalesce(r.source_module, 'briefing'),
      r.title, r.summary, r.severity, r.requires_action, r.action_url,
      'See briefing for context', r.occurred_at, coalesce(r.metadata, '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;

  for r in
    select id, event_type, summary, created_at
    from public.aipify_tenant_pilot_events
    where tenant_id = v_tenant_id and created_at >= v_since
    limit 30
  loop
    perform public._dk_upsert_event(
      v_tenant_id, 'unonight', 'pilot_event', r.id,
      'desktop.unonight.' || r.id::text, 'unonight',
      coalesce(r.event_type, 'Pilot update'), coalesce(r.summary, ''),
      'medium', false, '/app/installations', null, r.created_at, '{}'::jsonb
    );
    v_count := v_count + 1;
  end loop;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'desktop_events_collected', 'desktop', 'success', null,
    jsonb_build_object('count', v_count, 'since', v_since));

  return jsonb_build_object('collected', v_count, 'since', v_since);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Deliver notifications (mode + dedupe)
-- ---------------------------------------------------------------------------
create or replace function public.deliver_desktop_notifications()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prefs public.desktop_preferences;
  v_mode public.desktop_modes;
  v_delivered int := 0;
  r record;
  v_existing int;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then raise exception 'User required'; end if;
  v_prefs := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  if v_prefs.enabled = false then
    return jsonb_build_object('delivered', 0, 'enabled', false);
  end if;

  select * into v_mode from public.desktop_modes where mode_key = v_prefs.mode_key;

  perform public.collect_desktop_notification_events(now() - interval '24 hours');

  for r in
    select e.*
    from public.desktop_notification_events e
    where e.tenant_id = v_tenant_id
      and public._dk_mode_allows(v_prefs.mode_key, e.severity, e.category, v_prefs.focus_categories)
    order by e.priority_score desc, e.occurred_at desc
    limit 20
  loop
    select count(*) into v_existing
    from public.desktop_notifications n
    where n.tenant_id = v_tenant_id
      and n.user_id = v_user_id
      and n.event_id = r.id
      and n.created_at >= now() - make_interval(mins => v_prefs.dedupe_window_minutes);

    if v_existing = 0 then
      insert into public.desktop_notifications (
        tenant_id, user_id, event_id, source_module, category, title, body, severity,
        status, action_url, recommendation, explanation, metadata, delivered_at
      ) values (
        v_tenant_id, v_user_id, r.id, r.source_module, r.category, r.title, r.summary, r.severity,
        'delivered', r.action_url, r.recommendation,
        format('Source: %s · Severity: %s · %s', r.source_module, r.severity, coalesce(r.recommendation, 'Review when convenient')),
        r.metadata, now()
      );
      v_delivered := v_delivered + 1;
    end if;
  end loop;

  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_notifications_delivered', 'desktop', 'success', v_user_id,
    jsonb_build_object('count', v_delivered, 'mode', v_prefs.mode_key));

  return jsonb_build_object('delivered', v_delivered, 'mode', v_prefs.mode_key);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Read APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_companion_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prefs public.desktop_preferences;
  v_mode public.desktop_modes;
  v_unread int;
  v_reminders int;
  v_items jsonb;
  v_brief jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_prefs := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  select * into v_mode from public.desktop_modes where mode_key = v_prefs.mode_key;

  perform public.deliver_desktop_notifications();

  select count(*) into v_unread
  from public.desktop_notifications
  where tenant_id = v_tenant_id and user_id = v_user_id and status in ('pending', 'delivered');

  select count(*) into v_reminders
  from public.desktop_reminders
  where tenant_id = v_tenant_id and user_id = v_user_id
    and status = 'scheduled' and due_at <= now() + interval '24 hours';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'title', n.title, 'body', n.body, 'severity', n.severity,
    'action_url', n.action_url, 'source_module', n.source_module, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb) into v_items
  from (
    select * from public.desktop_notifications
    where tenant_id = v_tenant_id and user_id = v_user_id
      and status in ('pending', 'delivered', 'read')
    order by created_at desc limit 5
  ) n;

  if v_prefs.include_briefing then
    begin
      v_brief := public.get_briefing_card();
    exception when others then
      v_brief := '{}'::jsonb;
    end;
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_prefs.enabled,
    'mode_key', v_prefs.mode_key,
    'mode_name', v_mode.name,
    'unread_count', v_unread,
    'upcoming_reminders', v_reminders,
    'notifications', v_items,
    'briefing_summary', coalesce(v_brief->>'summary', 'Aipify is monitoring your business.'),
    'briefing_greeting', v_brief->>'greeting',
    'mini_chat_enabled', coalesce(v_mode.include_mini_chat, false),
    'privacy_note', 'Desktop Companion respects permissions and never exposes sensitive data across tenants.'
  );
end; $$;

create or replace function public.get_desktop_notifications(p_limit int default 20, p_status text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', n.id, 'title', n.title, 'body', n.body, 'severity', n.severity, 'status', n.status,
    'source_module', n.source_module, 'category', n.category, 'action_url', n.action_url,
    'recommendation', n.recommendation, 'explanation', n.explanation, 'created_at', n.created_at
  ) order by n.created_at desc) from (
    select * from public.desktop_notifications
    where tenant_id = v_tenant_id and user_id = v_user_id
      and (p_status is null or status = p_status)
    order by created_at desc limit greatest(1, least(p_limit, 100))
  ) n), '[]'::jsonb);
end; $$;

create or replace function public.get_desktop_notification_history(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_desktop_notifications(p_limit, null);
end; $$;

create or replace function public.explain_desktop_notification(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_row public.desktop_notifications;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  select * into v_row from public.desktop_notifications
  where id = p_notification_id and tenant_id = v_tenant_id and user_id = v_user_id;
  if v_row.id is null then raise exception 'Notification not found'; end if;
  return jsonb_build_object(
    'id', v_row.id, 'title', v_row.title, 'source_module', v_row.source_module,
    'severity', v_row.severity, 'explanation', v_row.explanation,
    'recommendation', v_row.recommendation, 'action_url', v_row.action_url
  );
end; $$;

create or replace function public.mark_desktop_notification_read(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  update public.desktop_notifications set status = 'read', read_at = now()
  where id = p_notification_id and tenant_id = v_tenant_id and user_id = v_user_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_notification_read', 'desktop', 'success', v_user_id,
    jsonb_build_object('notification_id', p_notification_id));
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.dismiss_desktop_notification(p_notification_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  update public.desktop_notifications set status = 'dismissed', dismissed_at = now()
  where id = p_notification_id and tenant_id = v_tenant_id and user_id = v_user_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_notification_dismissed', 'desktop', 'success', v_user_id,
    jsonb_build_object('notification_id', p_notification_id));
  return jsonb_build_object('ok', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Reminders
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_reminders(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', r.id, 'reminder_type', r.reminder_type, 'title', r.title, 'body', r.body,
    'due_at', r.due_at, 'recurrence_rule', r.recurrence_rule, 'status', r.status,
    'action_url', r.action_url, 'created_at', r.created_at
  ) order by r.due_at asc) from (
    select * from public.desktop_reminders
    where tenant_id = v_tenant_id and user_id = v_user_id and status != 'cancelled'
    order by due_at asc limit greatest(1, least(p_limit, 100))
  ) r), '[]'::jsonb);
end; $$;

create or replace function public.create_desktop_reminder(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then raise exception 'User required'; end if;
  insert into public.desktop_reminders (
    tenant_id, user_id, reminder_type, title, body, due_at, recurrence_rule, action_url, metadata
  ) values (
    v_tenant_id, v_user_id,
    coalesce(p_patch->>'reminder_type', 'personal'),
    coalesce(p_patch->>'title', 'Reminder'),
    p_patch->>'body',
    coalesce((p_patch->>'due_at')::timestamptz, now() + interval '1 day'),
    p_patch->>'recurrence_rule',
    p_patch->>'action_url',
    coalesce(p_patch->'metadata', '{}'::jsonb)
  ) returning id into v_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_reminder_created', 'desktop', 'success', v_user_id, p_patch);
  return jsonb_build_object('reminder_id', v_id);
end; $$;

create or replace function public.update_desktop_reminder(p_reminder_id uuid, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  update public.desktop_reminders set
    title = coalesce(p_patch->>'title', title),
    body = coalesce(p_patch->>'body', body),
    due_at = coalesce((p_patch->>'due_at')::timestamptz, due_at),
    status = coalesce(p_patch->>'status', status),
    updated_at = now()
  where id = p_reminder_id and tenant_id = v_tenant_id and user_id = v_user_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_reminder_updated', 'desktop', 'success', v_user_id, p_patch);
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.delete_desktop_reminder(p_reminder_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  update public.desktop_reminders set status = 'cancelled', updated_at = now()
  where id = p_reminder_id and tenant_id = v_tenant_id and user_id = v_user_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_reminder_cancelled', 'desktop', 'success', v_user_id,
    jsonb_build_object('reminder_id', p_reminder_id));
  return jsonb_build_object('ok', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Chat history
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_chat_history(p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', c.id, 'role', c.role, 'content', c.content, 'intent', c.intent,
    'action_href', c.action_href, 'created_at', c.created_at
  ) order by c.created_at asc) from (
    select * from public.desktop_chat_history
    where tenant_id = v_tenant_id and user_id = v_user_id
    order by created_at desc limit greatest(1, least(p_limit, 100))
  ) c), '[]'::jsonb);
end; $$;

create or replace function public.append_desktop_chat_message(
  p_role text,
  p_content text,
  p_intent text default null,
  p_action_href text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then raise exception 'User required'; end if;
  insert into public.desktop_chat_history (tenant_id, user_id, role, content, intent, action_href, metadata)
  values (v_tenant_id, v_user_id, p_role, p_content, p_intent, p_action_href, coalesce(p_metadata, '{}'::jsonb))
  returning id into v_id;
  return jsonb_build_object('message_id', v_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Preferences & modes
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_preferences()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_row public.desktop_preferences;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;
  v_row := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_row.enabled,
    'mode_key', v_row.mode_key,
    'focus_categories', v_row.focus_categories,
    'quiet_hours', v_row.quiet_hours,
    'timezone', v_row.timezone,
    'include_briefing', v_row.include_briefing,
    'include_governance', v_row.include_governance,
    'include_quality', v_row.include_quality,
    'include_support', v_row.include_support,
    'include_knowledge', v_row.include_knowledge,
    'include_integrations', v_row.include_integrations,
    'include_security', v_row.include_security,
    'max_notifications_per_day', v_row.max_notifications_per_day,
    'dedupe_window_minutes', v_row.dedupe_window_minutes
  );
end; $$;

create or replace function public.update_desktop_preferences(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  perform public._dk_ensure_preferences(v_tenant_id, v_user_id);
  update public.desktop_preferences set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    mode_key = coalesce(p_patch->>'mode_key', mode_key),
    focus_categories = coalesce(
      array(select jsonb_array_elements_text(p_patch->'focus_categories')),
      focus_categories
    ),
    quiet_hours = coalesce(p_patch->'quiet_hours', quiet_hours),
    timezone = coalesce(p_patch->>'timezone', timezone),
    include_briefing = coalesce((p_patch->>'include_briefing')::boolean, include_briefing),
    include_governance = coalesce((p_patch->>'include_governance')::boolean, include_governance),
    include_quality = coalesce((p_patch->>'include_quality')::boolean, include_quality),
    include_support = coalesce((p_patch->>'include_support')::boolean, include_support),
    include_knowledge = coalesce((p_patch->>'include_knowledge')::boolean, include_knowledge),
    include_integrations = coalesce((p_patch->>'include_integrations')::boolean, include_integrations),
    include_security = coalesce((p_patch->>'include_security')::boolean, include_security),
    max_notifications_per_day = coalesce((p_patch->>'max_notifications_per_day')::int, max_notifications_per_day),
    dedupe_window_minutes = coalesce((p_patch->>'dedupe_window_minutes')::int, dedupe_window_minutes),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'desktop_preferences_updated', 'desktop', 'success', v_user_id, p_patch);
  return public.get_desktop_preferences();
end; $$;

create or replace function public.get_desktop_modes()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return coalesce((select jsonb_agg(jsonb_build_object(
    'mode_key', m.mode_key, 'name', m.name, 'description', m.description,
    'min_severity', m.min_severity, 'include_daily_brief', m.include_daily_brief,
    'include_mini_chat', m.include_mini_chat, 'include_suggestions', m.include_suggestions,
    'include_reminders', m.include_reminders
  ) order by m.sort_order) from public.desktop_modes m), '[]'::jsonb);
end; $$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'desktop-companion', 'Desktop Companion', 'Notifications, reminders, and assistant companion', 'authenticated', 100
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'desktop-companion' and tenant_id is null);

-- Grants
grant execute on function public.get_desktop_companion_card() to authenticated;
grant execute on function public.get_desktop_notifications(int, text) to authenticated;
grant execute on function public.get_desktop_notification_history(int) to authenticated;
grant execute on function public.explain_desktop_notification(uuid) to authenticated;
grant execute on function public.mark_desktop_notification_read(uuid) to authenticated;
grant execute on function public.dismiss_desktop_notification(uuid) to authenticated;
grant execute on function public.collect_desktop_notification_events(timestamptz) to authenticated;
grant execute on function public.upsert_desktop_notification_events_batch(jsonb) to authenticated;
grant execute on function public.deliver_desktop_notifications() to authenticated;
grant execute on function public.get_desktop_reminders(int) to authenticated;
grant execute on function public.create_desktop_reminder(jsonb) to authenticated;
grant execute on function public.update_desktop_reminder(uuid, jsonb) to authenticated;
grant execute on function public.delete_desktop_reminder(uuid) to authenticated;
grant execute on function public.get_desktop_chat_history(int) to authenticated;
grant execute on function public.append_desktop_chat_message(text, text, text, text, jsonb) to authenticated;
grant execute on function public.get_desktop_preferences() to authenticated;
grant execute on function public.update_desktop_preferences(jsonb) to authenticated;
grant execute on function public.get_desktop_modes() to authenticated;

-- Phase 341 — Desktop Companion Foundation
-- Feature owner: CUSTOMER APP + Desktop client. Routes: /app/desktop/*, /api/desktop/*. Helpers: _dcf341_*

-- ---------------------------------------------------------------------------
-- 1. Desktop companion profiles (first-run + workspace identity)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  locale text not null default 'en',
  timezone text not null default 'Europe/Oslo',
  working_hours jsonb not null default '{"start": "09:00", "end": "17:00", "days": ["mon","tue","wed","thu","fri"]}'::jsonb,
  companion_style text not null default 'balanced' check (
    companion_style in ('calm', 'balanced', 'proactive')
  ),
  first_run_complete boolean not null default false,
  first_run_intro_seen boolean not null default false,
  hotkey_config jsonb not null default '{"macos": "Command+Space", "windows": "Control+Space", "linux": "Control+Space"}'::jsonb,
  offline_mode_enabled boolean not null default true,
  workspace_detection_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
create index if not exists desktop_companion_profiles_user_idx
  on public.desktop_companion_profiles (tenant_id, user_id);
alter table public.desktop_companion_profiles enable row level security;
revoke all on public.desktop_companion_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permission grants (explicit approval — no silent access)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  permission_key text not null check (
    permission_key in ('calendar', 'email', 'files', 'integrations', 'notifications', 'workspace')
  ),
  granted boolean not null default false,
  granted_at timestamptz,
  revoked_at timestamptz,
  granted_by_user_id uuid references public.users (id) on delete set null,
  explanation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, permission_key)
);
create index if not exists desktop_companion_permissions_user_idx
  on public.desktop_companion_permissions (tenant_id, user_id, permission_key);
alter table public.desktop_companion_permissions enable row level security;
revoke all on public.desktop_companion_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Notification level settings
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_notification_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  default_level text not null default 'normal' check (
    default_level in ('critical', 'important', 'normal', 'silent')
  ),
  tasks_level text not null default 'important',
  follow_ups_level text not null default 'important',
  calendar_level text not null default 'normal',
  recommendations_level text not null default 'normal',
  companion_alerts_level text not null default 'important',
  quiet_hours_override boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
alter table public.desktop_companion_notification_settings enable row level security;
revoke all on public.desktop_companion_notification_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Companion state (focus mode, workspace hints)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_state (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  focus_mode_active boolean not null default false,
  focus_priority text not null default '',
  focus_task_id text not null default '',
  focus_time_estimate_minutes integer,
  focus_suggested_next text not null default '',
  active_project_key text not null default '',
  active_document_hint text not null default '',
  calendar_context_summary text not null default '',
  last_search_query text not null default '',
  sidebar_collapsed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
alter table public.desktop_companion_state enable row level security;
revoke all on public.desktop_companion_state from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Device registrations (links desktop clients to companion profile)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_device_registrations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  client_id uuid references public.presence_desktop_clients (id) on delete set null,
  platform text not null default 'macos' check (platform in ('macos', 'windows', 'linux')),
  device_name text not null default '',
  app_version text not null default '',
  last_sync_at timestamptz,
  offline_capable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists desktop_companion_device_reg_user_idx
  on public.desktop_companion_device_registrations (tenant_id, user_id, platform);
alter table public.desktop_companion_device_registrations enable row level security;
revoke all on public.desktop_companion_device_registrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Offline cache items (notes, tasks, reminders, briefings)
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_offline_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  item_type text not null check (
    item_type in ('note', 'task', 'reminder', 'briefing')
  ),
  title text not null default '',
  body text not null default '',
  due_at timestamptz,
  sync_status text not null default 'local' check (
    sync_status in ('local', 'pending_sync', 'synced', 'conflict')
  ),
  local_id text not null default '',
  server_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists desktop_companion_offline_items_user_idx
  on public.desktop_companion_offline_items (tenant_id, user_id, item_type, sync_status);
alter table public.desktop_companion_offline_items enable row level security;
revoke all on public.desktop_companion_offline_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.desktop_companion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'profile_created', 'profile_updated', 'first_run_completed',
      'permission_granted', 'permission_revoked', 'focus_started', 'focus_ended',
      'offline_item_created', 'offline_synced', 'device_registered', 'search_performed',
      'quick_action', 'preferences_updated'
    )
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists desktop_companion_audit_logs_user_idx
  on public.desktop_companion_audit_logs (tenant_id, user_id, created_at desc);
alter table public.desktop_companion_audit_logs enable row level security;
revoke all on public.desktop_companion_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public._dcf341bp_positioning() returns text language sql immutable as $$
  select 'A trusted colleague beside you — Aipify helps you think, organize, prioritize, and execute with permission and transparency.'; $$;

create or replace function public._dcf341_log_audit(
  p_tenant_id uuid, p_user_id uuid, p_event text, p_summary text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.desktop_companion_audit_logs (tenant_id, user_id, event_type, summary, metadata)
  values (p_tenant_id, p_user_id, p_event, left(p_summary, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._dcf341_web_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then raise exception 'User context required'; end if;
  return jsonb_build_object('tenant_id', v_tenant_id, 'user_id', v_user_id);
end; $$;

create or replace function public._dcf341_session(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_row public.presence_desktop_sessions;
begin
  v_row := public._validate_desktop_session_row(p_token);
  if v_row.id is null then raise exception 'Invalid or expired desktop session'; end if;
  update public.presence_desktop_sessions set last_seen_at = now() where id = v_row.id;
  return jsonb_build_object(
    'tenant_id', v_row.tenant_id,
    'user_id', v_row.user_id,
    'client_id', v_row.client_id,
    'session_id', v_row.id
  );
end; $$;

create or replace function public._dcf341_ensure_profile(p_tenant_id uuid, p_user_id uuid)
returns public.desktop_companion_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.desktop_companion_profiles;
begin
  insert into public.desktop_companion_profiles (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;
  select * into v_row from public.desktop_companion_profiles
  where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._dcf341_ensure_notification_settings(p_tenant_id uuid, p_user_id uuid)
returns public.desktop_companion_notification_settings language plpgsql security definer set search_path = public as $$
declare v_row public.desktop_companion_notification_settings;
begin
  insert into public.desktop_companion_notification_settings (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;
  select * into v_row from public.desktop_companion_notification_settings
  where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._dcf341_ensure_state(p_tenant_id uuid, p_user_id uuid)
returns public.desktop_companion_state language plpgsql security definer set search_path = public as $$
declare v_row public.desktop_companion_state;
begin
  insert into public.desktop_companion_state (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;
  select * into v_row from public.desktop_companion_state
  where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._dcf341_default_permissions(p_tenant_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_key text;
begin
  foreach v_key in array array['calendar','email','files','integrations','notifications','workspace'] loop
    insert into public.desktop_companion_permissions (tenant_id, user_id, permission_key, granted, explanation)
    values (p_tenant_id, p_user_id, v_key, false, 'Awaiting explicit approval')
    on conflict (tenant_id, user_id, permission_key) do nothing;
  end loop;
end; $$;

create or replace function public._dcf341_build_profile_payload(p_tenant_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_profile public.desktop_companion_profiles;
  v_prefs public.desktop_preferences;
  v_notif public.desktop_companion_notification_settings;
  v_state public.desktop_companion_state;
  v_permissions jsonb;
begin
  v_profile := public._dcf341_ensure_profile(p_tenant_id, p_user_id);
  perform public._dcf341_default_permissions(p_tenant_id, p_user_id);
  v_prefs := public._dk_ensure_preferences(p_tenant_id, p_user_id);
  v_notif := public._dcf341_ensure_notification_settings(p_tenant_id, p_user_id);
  v_state := public._dcf341_ensure_state(p_tenant_id, p_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', p.permission_key,
    'granted', p.granted,
    'granted_at', p.granted_at,
    'explanation', p.explanation
  ) order by p.permission_key), '[]'::jsonb)
  into v_permissions
  from public.desktop_companion_permissions p
  where p.tenant_id = p_tenant_id and p.user_id = p_user_id;

  return jsonb_build_object(
    'has_customer', true,
    'positioning', public._dcf341bp_positioning(),
    'profile', jsonb_build_object(
      'locale', v_profile.locale,
      'timezone', v_profile.timezone,
      'working_hours', v_profile.working_hours,
      'companion_style', v_profile.companion_style,
      'first_run_complete', v_profile.first_run_complete,
      'first_run_intro_seen', v_profile.first_run_intro_seen,
      'hotkey_config', v_profile.hotkey_config,
      'offline_mode_enabled', v_profile.offline_mode_enabled,
      'workspace_detection_enabled', v_profile.workspace_detection_enabled
    ),
    'preferences', jsonb_build_object(
      'enabled', v_prefs.enabled,
      'mode_key', v_prefs.mode_key,
      'timezone', v_prefs.timezone,
      'quiet_hours', v_prefs.quiet_hours,
      'include_briefing', v_prefs.include_briefing
    ),
    'notification_settings', jsonb_build_object(
      'default_level', v_notif.default_level,
      'tasks_level', v_notif.tasks_level,
      'follow_ups_level', v_notif.follow_ups_level,
      'calendar_level', v_notif.calendar_level,
      'recommendations_level', v_notif.recommendations_level,
      'companion_alerts_level', v_notif.companion_alerts_level
    ),
    'state', jsonb_build_object(
      'focus_mode_active', v_state.focus_mode_active,
      'focus_priority', v_state.focus_priority,
      'focus_task_id', v_state.focus_task_id,
      'focus_time_estimate_minutes', v_state.focus_time_estimate_minutes,
      'focus_suggested_next', v_state.focus_suggested_next,
      'active_project_key', v_state.active_project_key
    ),
    'permissions', v_permissions,
    'privacy_note', 'Aipify only accesses calendar, email, files, and integrations you explicitly approve.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- RPCs — web session
-- ---------------------------------------------------------------------------
create or replace function public.get_desktop_companion_profile()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb;
begin
  v_ctx := public._dcf341_web_context();
  return public._dcf341_build_profile_payload(
    (v_ctx->>'tenant_id')::uuid,
    (v_ctx->>'user_id')::uuid
  );
end; $$;

create or replace function public.get_desktop_companion_home()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile jsonb;
  v_briefing jsonb;
  v_tasks jsonb;
  v_notifs jsonb;
  v_card jsonb;
  v_insights jsonb := '[]'::jsonb;
  v_actions jsonb := '[]'::jsonb;
  v_activity jsonb := '[]'::jsonb;
begin
  v_ctx := public._dcf341_web_context();
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_profile := public._dcf341_build_profile_payload(v_tenant_id, v_user_id);
  v_briefing := public.get_desktop_companion_briefing();
  v_tasks := public.get_desktop_companion_tasks();
  v_notifs := public.get_desktop_companion_notifications();
  v_card := public.get_desktop_companion_card();

  if v_card ? 'engagement_summary' then
    v_insights := coalesce(v_card->'engagement_summary', '{}'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.event_type,
    'label', a.summary,
    'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_activity
  from public.desktop_companion_audit_logs a
  where a.tenant_id = v_tenant_id and a.user_id = v_user_id
  limit 8;

  v_actions := jsonb_build_array(
    jsonb_build_object('id', 'create_note', 'label', 'Create Note'),
    jsonb_build_object('id', 'create_task', 'label', 'Create Task'),
    jsonb_build_object('id', 'create_reminder', 'label', 'Create Reminder'),
    jsonb_build_object('id', 'open_calendar', 'label', 'Open Calendar'),
    jsonb_build_object('id', 'start_focus', 'label', 'Start Focus Mode'),
    jsonb_build_object('id', 'ask_aipify', 'label', 'Ask Aipify')
  );

  return jsonb_build_object(
    'has_customer', true,
    'greeting', coalesce(v_briefing->>'greeting', 'Good morning'),
    'profile', v_profile,
    'todays_focus', coalesce(v_briefing->>'headline', v_briefing->>'summary', ''),
    'daily_briefing', v_briefing,
    'tasks', v_tasks,
    'calendar', coalesce(v_briefing->'calendar_hints', '[]'::jsonb),
    'companion_insights', v_insights,
    'recommended_actions', coalesce(v_card->'notifications', '[]'::jsonb),
    'recent_activity', v_activity,
    'quick_actions', v_actions,
    'notifications', v_notifs,
    'positioning', public._dcf341bp_positioning()
  );
end; $$;

create or replace function public.get_desktop_companion_briefing()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_card jsonb;
  v_ctx record;
  v_greeting text;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_card := public.get_desktop_companion_card();

  select * into v_ctx
  from public.companion_user_context_snapshots s
  where s.organization_id = (
    select o.id from public.organizations o
    join public.customers c on c.company_id = o.company_id
    where c.id = v_tenant_id limit 1
  )
  and s.auth_user_id = auth.uid()
  order by s.snapshot_at desc
  limit 1;

  v_greeting := coalesce(v_card->>'briefing_greeting', 'Good morning');

  return jsonb_build_object(
    'has_customer', true,
    'greeting', v_greeting,
    'headline', coalesce(v_card->>'briefing_summary', 'Your briefing is ready.'),
    'summary', coalesce(v_card->>'briefing_summary', ''),
    'bullets', coalesce(v_card->'notifications', '[]'::jsonb),
    'calendar_hints', coalesce(v_ctx.calendar_hints, '[]'::jsonb),
    'likely_next_task', coalesce(v_ctx.likely_next_task, ''),
    'recent_work_summary', coalesce(v_ctx.recent_work_summary, '')
  );
exception when others then
  return jsonb_build_object(
    'has_customer', true,
    'greeting', coalesce(v_card->>'briefing_greeting', 'Good morning'),
    'headline', coalesce(v_card->>'briefing_summary', 'Your briefing is ready.'),
    'summary', coalesce(v_card->>'briefing_summary', ''),
    'bullets', '[]'::jsonb,
    'calendar_hints', '[]'::jsonb
  );
end; $$;

create or replace function public.get_desktop_companion_tasks()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_tasks jsonb := '[]'::jsonb;
  v_reminders jsonb := '[]'::jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false, 'items', '[]'::jsonb); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'due_at', r.due_at,
    'status', r.status,
    'source', 'reminder'
  ) order by r.due_at nulls last), '[]'::jsonb)
  into v_reminders
  from public.desktop_reminders r
  where r.tenant_id = v_tenant_id
    and (r.user_id is null or r.user_id = v_user_id)
    and r.status = 'scheduled'
  limit 20;

  begin
    select coalesce(s.active_tasks, '[]'::jsonb) into v_tasks
    from public.companion_user_context_snapshots s
    where s.organization_id = (
      select o.id from public.organizations o
      join public.customers c on c.company_id = o.company_id
      where c.id = v_tenant_id limit 1
    )
    and s.auth_user_id = auth.uid()
    order by s.snapshot_at desc
    limit 1;
  exception when others then
    v_tasks := '[]'::jsonb;
  end;

  return jsonb_build_object(
    'has_customer', true,
    'items', v_reminders || coalesce(v_tasks, '[]'::jsonb),
    'reminders', v_reminders,
    'context_tasks', coalesce(v_tasks, '[]'::jsonb)
  );
end; $$;

create or replace function public.get_desktop_companion_notifications()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false, 'items', '[]'::jsonb); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id,
    'title', n.title,
    'body', n.body,
    'severity', n.severity,
    'level', case
      when n.severity in ('critical') then 'critical'
      when n.severity in ('high') then 'important'
      when n.severity in ('medium', 'low') then 'normal'
      else 'silent'
    end,
    'status', n.status,
    'category', n.category,
    'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_items
  from public.desktop_notifications n
  where n.tenant_id = v_tenant_id
    and (n.user_id is null or n.user_id = v_user_id)
    and n.status in ('unread', 'read')
  limit 30;

  return jsonb_build_object('has_customer', true, 'items', coalesce(v_items, '[]'::jsonb));
end; $$;

create or replace function public.update_desktop_companion_preferences(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.desktop_companion_profiles;
begin
  v_ctx := public._dcf341_web_context();
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_profile := public._dcf341_ensure_profile(v_tenant_id, v_user_id);

  if p_patch ? 'profile' then
    update public.desktop_companion_profiles set
      locale = coalesce(p_patch#>>'{profile,locale}', locale),
      timezone = coalesce(p_patch#>>'{profile,timezone}', timezone),
      working_hours = coalesce(p_patch->'profile'->'working_hours', working_hours),
      companion_style = coalesce(p_patch#>>'{profile,companion_style}', companion_style),
      first_run_complete = coalesce((p_patch#>>'{profile,first_run_complete}')::boolean, first_run_complete),
      first_run_intro_seen = coalesce((p_patch#>>'{profile,first_run_intro_seen}')::boolean, first_run_intro_seen),
      hotkey_config = coalesce(p_patch->'profile'->'hotkey_config', hotkey_config),
      offline_mode_enabled = coalesce((p_patch#>>'{profile,offline_mode_enabled}')::boolean, offline_mode_enabled),
      workspace_detection_enabled = coalesce((p_patch#>>'{profile,workspace_detection_enabled}')::boolean, workspace_detection_enabled),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if p_patch ? 'permissions' then
    insert into public.desktop_companion_permissions (tenant_id, user_id, permission_key, granted, granted_at, explanation)
    select v_tenant_id, v_user_id, elem->>'permission_key',
      coalesce((elem->>'granted')::boolean, false),
      case when coalesce((elem->>'granted')::boolean, false) then now() else null end,
      coalesce(elem->>'explanation', '')
    from jsonb_array_elements(p_patch->'permissions') elem
    on conflict (tenant_id, user_id, permission_key) do update set
      granted = excluded.granted,
      granted_at = case when excluded.granted then now() else desktop_companion_permissions.granted_at end,
      revoked_at = case when not excluded.granted then now() else null end,
      explanation = excluded.explanation,
      updated_at = now();
  end if;

  if p_patch ? 'notification_settings' then
    perform public._dcf341_ensure_notification_settings(v_tenant_id, v_user_id);
    update public.desktop_companion_notification_settings set
      default_level = coalesce(p_patch#>>'{notification_settings,default_level}', default_level),
      tasks_level = coalesce(p_patch#>>'{notification_settings,tasks_level}', tasks_level),
      follow_ups_level = coalesce(p_patch#>>'{notification_settings,follow_ups_level}', follow_ups_level),
      calendar_level = coalesce(p_patch#>>'{notification_settings,calendar_level}', calendar_level),
      recommendations_level = coalesce(p_patch#>>'{notification_settings,recommendations_level}', recommendations_level),
      companion_alerts_level = coalesce(p_patch#>>'{notification_settings,companion_alerts_level}', companion_alerts_level),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if p_patch ? 'focus' then
    perform public._dcf341_ensure_state(v_tenant_id, v_user_id);
    update public.desktop_companion_state set
      focus_mode_active = coalesce((p_patch#>>'{focus,active}')::boolean, focus_mode_active),
      focus_priority = coalesce(p_patch#>>'{focus,priority}', focus_priority),
      focus_task_id = coalesce(p_patch#>>'{focus,task_id}', focus_task_id),
      focus_time_estimate_minutes = coalesce((p_patch#>>'{focus,time_estimate_minutes}')::integer, focus_time_estimate_minutes),
      focus_suggested_next = coalesce(p_patch#>>'{focus,suggested_next}', focus_suggested_next),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if p_patch ? 'desktop_preferences' then
    perform public.update_desktop_preferences(p_patch->'desktop_preferences');
  end if;

  perform public._dcf341_log_audit(v_tenant_id, v_user_id, 'preferences_updated', 'Desktop Companion preferences updated', p_patch);

  return public._dcf341_build_profile_payload(v_tenant_id, v_user_id);
end; $$;

create or replace function public.search_desktop_companion(p_query text, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_q text := lower(trim(coalesce(p_query, '')));
  v_results jsonb := '[]'::jsonb;
  v_tasks jsonb;
  v_notifs jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null or v_q = '' then
    return jsonb_build_object('has_customer', false, 'results', '[]'::jsonb);
  end if;

  v_tasks := public.get_desktop_companion_tasks();
  v_notifs := public.get_desktop_companion_notifications();

  select coalesce(jsonb_agg(r), '[]'::jsonb) into v_results
  from (
    select jsonb_build_object('type', 'task', 'title', elem->>'title', 'id', elem->>'id') as r
    from jsonb_array_elements(coalesce(v_tasks->'items', '[]'::jsonb)) elem
    where lower(elem->>'title') like '%' || v_q || '%'
    union all
    select jsonb_build_object('type', 'notification', 'title', elem->>'title', 'id', elem->>'id')
    from jsonb_array_elements(coalesce(v_notifs->'items', '[]'::jsonb)) elem
    where lower(elem->>'title') like '%' || v_q || '%'
  ) sub
  limit greatest(1, least(p_limit, 50));

  perform public._dcf341_log_audit(v_tenant_id, v_user_id, 'search_performed', 'Companion search: ' || left(v_q, 120), jsonb_build_object('query', v_q));

  return jsonb_build_object('has_customer', true, 'query', p_query, 'results', v_results);
end; $$;

-- ---------------------------------------------------------------------------
-- RPCs — desktop session token (spec /api/desktop/*)
-- ---------------------------------------------------------------------------
create or replace function public.desktop_get_profile(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb;
begin
  v_ctx := public._dcf341_session(p_token);
  return public._dcf341_build_profile_payload(
    (v_ctx->>'tenant_id')::uuid,
    (v_ctx->>'user_id')::uuid
  );
end; $$;

create or replace function public.desktop_get_briefing(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_card jsonb;
begin
  v_ctx := public._dcf341_session(p_token);
  v_card := public.get_desktop_companion_card();
  return jsonb_build_object(
    'has_customer', true,
    'greeting', coalesce(v_card->>'briefing_greeting', 'Good morning'),
    'headline', coalesce(v_card->>'briefing_summary', 'Your briefing is ready.'),
    'summary', coalesce(v_card->>'briefing_summary', '')
  );
end; $$;

create or replace function public.desktop_get_tasks(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_tenant_id uuid;
  v_user_id uuid;
  v_reminders jsonb;
begin
  v_ctx := public._dcf341_session(p_token);
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'due_at', r.due_at, 'status', r.status
  ) order by r.due_at nulls last), '[]'::jsonb)
  into v_reminders
  from public.desktop_reminders r
  where r.tenant_id = v_tenant_id
    and (r.user_id is null or r.user_id = v_user_id)
    and r.status = 'scheduled'
  limit 20;

  return jsonb_build_object('has_customer', true, 'items', coalesce(v_reminders, '[]'::jsonb));
end; $$;

create or replace function public.desktop_get_notifications(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_tenant_id uuid;
  v_user_id uuid;
  v_items jsonb;
begin
  v_ctx := public._dcf341_session(p_token);
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'title', n.title, 'severity', n.severity, 'status', n.status, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb)
  into v_items
  from public.desktop_notifications n
  where n.tenant_id = v_tenant_id
    and (n.user_id is null or n.user_id = v_user_id)
    and n.status in ('unread', 'read')
  limit 30;

  return jsonb_build_object('has_customer', true, 'items', coalesce(v_items, '[]'::jsonb));
end; $$;

create or replace function public.desktop_update_preferences(p_token text, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb;
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_ctx := public._dcf341_session(p_token);
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  perform public._dcf341_ensure_profile(v_tenant_id, v_user_id);

  if p_patch ? 'profile' then
    update public.desktop_companion_profiles set
      locale = coalesce(p_patch#>>'{profile,locale}', locale),
      timezone = coalesce(p_patch#>>'{profile,timezone}', timezone),
      working_hours = coalesce(p_patch->'profile'->'working_hours', working_hours),
      companion_style = coalesce(p_patch#>>'{profile,companion_style}', companion_style),
      first_run_complete = coalesce((p_patch#>>'{profile,first_run_complete}')::boolean, first_run_complete),
      first_run_intro_seen = coalesce((p_patch#>>'{profile,first_run_intro_seen}')::boolean, first_run_intro_seen),
      hotkey_config = coalesce(p_patch->'profile'->'hotkey_config', hotkey_config),
      offline_mode_enabled = coalesce((p_patch#>>'{profile,offline_mode_enabled}')::boolean, offline_mode_enabled),
      workspace_detection_enabled = coalesce((p_patch#>>'{profile,workspace_detection_enabled}')::boolean, workspace_detection_enabled),
      updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;

  if p_patch ? 'permissions' then
    insert into public.desktop_companion_permissions (tenant_id, user_id, permission_key, granted, granted_at, explanation)
    select v_tenant_id, v_user_id, elem->>'permission_key',
      coalesce((elem->>'granted')::boolean, false),
      case when coalesce((elem->>'granted')::boolean, false) then now() else null end,
      coalesce(elem->>'explanation', '')
    from jsonb_array_elements(p_patch->'permissions') elem
    on conflict (tenant_id, user_id, permission_key) do update set
      granted = excluded.granted,
      granted_at = case when excluded.granted then now() else desktop_companion_permissions.granted_at end,
      revoked_at = case when not excluded.granted then now() else null end,
      explanation = excluded.explanation,
      updated_at = now();
  end if;

  perform public._dcf341_log_audit(v_tenant_id, v_user_id, 'preferences_updated', 'Desktop preferences updated via companion', p_patch);

  return public._dcf341_build_profile_payload(v_tenant_id, v_user_id);
end; $$;

grant execute on function public.get_desktop_companion_profile() to authenticated;
grant execute on function public.get_desktop_companion_home() to authenticated;
grant execute on function public.get_desktop_companion_briefing() to authenticated;
grant execute on function public.get_desktop_companion_tasks() to authenticated;
grant execute on function public.get_desktop_companion_notifications() to authenticated;
grant execute on function public.update_desktop_companion_preferences(jsonb) to authenticated;
grant execute on function public.search_desktop_companion(text, integer) to authenticated;
grant execute on function public.desktop_get_profile(text) to anon, authenticated;
grant execute on function public.desktop_get_briefing(text) to anon, authenticated;
grant execute on function public.desktop_get_tasks(text) to anon, authenticated;
grant execute on function public.desktop_get_notifications(text) to anon, authenticated;
grant execute on function public.desktop_update_preferences(text, jsonb) to anon, authenticated;

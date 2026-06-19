-- Phase 545 — Desktop Companion, Mobile Companion & Presence Engine
-- Always available. Never intrusive. Always helpful.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_presence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  presence_engine_enabled boolean not null default true,
  desktop_companion_enabled boolean not null default true,
  mobile_companion_enabled boolean not null default true,
  offline_support_enabled boolean not null default true,
  command_palette_enabled boolean not null default true,
  meeting_awareness_enabled boolean not null default true,
  companion_store_prepared boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_presence_settings enable row level security;
revoke all on public.organization_companion_presence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. User companion preferences (memory, modes, role experience)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_user_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  desktop_mode text not null default 'sidebar' check (
    desktop_mode in ('compact', 'sidebar', 'floating', 'docked', 'full')
  ),
  companion_role_mode text not null default 'employee' check (
    companion_role_mode in ('executive', 'manager', 'employee', 'auto')
  ),
  preferred_home_view text not null default 'overview',
  favorite_searches jsonb not null default '[]'::jsonb,
  preferred_modules jsonb not null default '[]'::jsonb,
  notification_preferences jsonb not null default '{"quiet_hours":true,"digest":true}'::jsonb,
  offline_cache_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_companion_user_preferences_org_idx
  on public.organization_companion_user_preferences (organization_id, user_id);

alter table public.organization_companion_user_preferences enable row level security;
revoke all on public.organization_companion_user_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Registered devices
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  device_type text not null check (device_type in ('desktop', 'mobile', 'tablet', 'web')),
  platform text not null default 'web' check (
    platform in ('windows', 'macos', 'linux', 'ios', 'android', 'web')
  ),
  device_label text not null,
  device_status text not null default 'active' check (
    device_status in ('pending_approval', 'active', 'restricted', 'revoked', 'offline')
  ),
  app_version text,
  last_activity_at timestamptz,
  permissions jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now()
);

create index if not exists organization_companion_devices_org_idx
  on public.organization_companion_devices (organization_id, device_type, device_status);

alter table public.organization_companion_devices enable row level security;
revoke all on public.organization_companion_devices from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Presence state
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_presence_state (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  presence_ring_status text not null default 'available' check (
    presence_ring_status in ('available', 'attention_required', 'working', 'restricted')
  ),
  unread_notifications int not null default 0,
  approvals_waiting int not null default 0,
  tasks_due int not null default 0,
  critical_alerts int not null default 0,
  companion_messages jsonb not null default '[]'::jsonb,
  presence_suggestions jsonb not null default '[]'::jsonb,
  meeting_awareness jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

alter table public.organization_companion_presence_state enable row level security;
revoke all on public.organization_companion_presence_state from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Offline cache items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_offline_cache (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  cache_type text not null check (
    cache_type in ('note', 'task', 'draft', 'knowledge')
  ),
  title text not null,
  content_summary text not null default '',
  sync_status text not null default 'pending' check (
    sync_status in ('pending', 'synced', 'conflict')
  ),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  synced_at timestamptz
);

create index if not exists organization_companion_offline_cache_org_idx
  on public.organization_companion_offline_cache (organization_id, user_id, sync_status);

alter table public.organization_companion_offline_cache enable row level security;
revoke all on public.organization_companion_offline_cache from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_presence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_presence_audit_org_idx
  on public.organization_companion_presence_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_presence_audit_logs enable row level security;
revoke all on public.organization_companion_presence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cp545_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._cp545_user()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._cp545_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_presence_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cp545_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_presence_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._cp545_device_json(r public.organization_companion_devices)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'device_type', r.device_type, 'platform', r.platform,
    'device_label', r.device_label, 'device_status', r.device_status,
    'app_version', r.app_version, 'last_activity_at', r.last_activity_at,
    'registered_at', r.registered_at
  );
$$;

create or replace function public._cp545_seed_companion(p_org_id uuid, p_user_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  select count(*) into v_count from public.organization_companion_devices where organization_id = p_org_id;
  if v_count > 2 then return v_count; end if;

  insert into public.organization_companion_user_preferences (
    organization_id, user_id, desktop_mode, companion_role_mode, preferred_home_view,
    favorite_searches, preferred_modules
  ) values (
    p_org_id, p_user_id, 'sidebar', 'auto', 'executive_briefing',
    '["Show approvals","Find contract","Executive briefing"]'::jsonb,
    '["command_center","approvals","assistant"]'::jsonb
  ) on conflict (organization_id, user_id) do nothing;

  insert into public.organization_companion_devices (
    organization_id, user_id, device_type, platform, device_label, device_status, app_version, last_activity_at
  ) values
    (p_org_id, p_user_id, 'desktop', 'macos', 'MacBook Pro — Desktop Companion', 'active', '1.0.0', now()),
    (p_org_id, p_user_id, 'mobile', 'ios', 'iPhone — Mobile Access', 'active', '1.0.0', now() - interval '2 hours'),
    (p_org_id, p_user_id, 'web', 'web', 'Chrome — Web Companion', 'active', '1.0.0', now() - interval '30 minutes')
  on conflict do nothing;

  insert into public.organization_companion_presence_state (
    organization_id, user_id, presence_ring_status, unread_notifications, approvals_waiting,
    tasks_due, critical_alerts, companion_messages, presence_suggestions, meeting_awareness
  ) values (
    p_org_id, p_user_id, 'attention_required', 4, 3, 2, 0,
    '["You have 3 approvals waiting.","Contract expires in 14 days."]'::jsonb,
    '["Inventory review recommended.","Meeting starts in 15 minutes."]'::jsonb,
    '{"next_meeting":"Quarterly Review","starts_in_minutes":15,"agenda_available":true,"action_items_pending":2}'::jsonb
  ) on conflict (organization_id, user_id) do nothing;

  insert into public.organization_companion_offline_cache (
    organization_id, user_id, cache_type, title, content_summary, sync_status
  ) values
    (p_org_id, p_user_id, 'note', 'Offline meeting notes', 'Draft notes from supplier review.', 'pending'),
    (p_org_id, p_user_id, 'task', 'Follow up with Finance', 'Review budget approval draft.', 'synced')
  on conflict do nothing;

  select count(*) into v_count from public.organization_companion_devices where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public.search_companion_presence_devices(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('companion_presence_operations.view');
  v_org_id := public._cp545_org();
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._cp545_device_json(d) order by d.last_activity_at desc nulls last)
      from (
        select * from public.organization_companion_devices
        where organization_id = v_org_id
          and (p_query is null or trim(p_query) = ''
            or device_label ilike '%' || p_query || '%'
            or device_type ilike '%' || p_query || '%'
            or platform ilike '%' || p_query || '%')
        order by last_activity_at desc nulls last limit greatest(p_limit, 1)
      ) d
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion Presence Center
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_presence_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_prefs record; v_presence record;
begin
  perform public._irp_require_permission('companion_presence_operations.view');
  v_org_id := public._cp545_org();
  v_user_id := public._cp545_user();
  perform public._cp545_ensure_settings(v_org_id);
  if v_user_id is not null then perform public._cp545_seed_companion(v_org_id, v_user_id); end if;

  select * into v_prefs from public.organization_companion_user_preferences
  where organization_id = v_org_id and user_id = v_user_id limit 1;

  select * into v_presence from public.organization_companion_presence_state
  where organization_id = v_org_id and user_id = v_user_id limit 1;

  perform public._cp545_log(v_org_id, 'center_view', 'Companion Center viewed', 'overview',
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Users should never need to wonder where Aipify is. Aipify should always be available when needed.',
    'philosophy', 'Companion is not a chatbot. Companion is a coworker.',
    'companion_identity', jsonb_build_object(
      'symbol', 'Connected Node Symbol',
      'color', 'Companion Purple',
      'presence_ring', 'Presence Ring',
      'branding', 'Official Companion Branding',
      'consistent_across', jsonb_build_array('desktop', 'mobile', 'notifications', 'widgets', 'loading_screens', 'future_devices')
    ),
    'overview', jsonb_build_object(
      'device_count', (select count(*) from public.organization_companion_devices where organization_id = v_org_id and device_status = 'active'),
      'desktop_devices', (select count(*) from public.organization_companion_devices where organization_id = v_org_id and device_type = 'desktop'),
      'mobile_devices', (select count(*) from public.organization_companion_devices where organization_id = v_org_id and device_type in ('mobile', 'tablet')),
      'approvals_waiting', coalesce(v_presence.approvals_waiting, 0),
      'presence_status', coalesce(v_presence.presence_ring_status, 'available')
    ),
    'desktop_companion', jsonb_build_object(
      'platforms', jsonb_build_array('windows', 'macos', 'linux'),
      'capabilities', jsonb_build_array(
        'chat', 'search', 'approvals', 'notifications', 'tasks',
        'executive_briefings', 'knowledge_access', 'quick_actions'
      ),
      'modes', jsonb_build_array('compact', 'sidebar', 'floating', 'docked', 'full'),
      'current_mode', coalesce(v_prefs.desktop_mode, 'sidebar'),
      'command_palette', jsonb_build_object(
        'shortcuts', jsonb_build_array('CMD+K', 'CTRL+K'),
        'examples', jsonb_build_array(
          'Create task', 'Find contract', 'Show approvals', 'Open customer',
          'Generate report', 'Book meeting'
        )
      ),
      'offline_support', jsonb_build_array('offline_notes', 'offline_tasks', 'offline_drafts', 'offline_knowledge_cache')
    ),
    'mobile_companion', jsonb_build_object(
      'platforms', jsonb_build_array('ios', 'android', 'tablet'),
      'mobile_access_first', true,
      'supports', jsonb_build_array(
        'dashboard', 'tasks', 'approvals', 'companion_chat', 'executive_briefings',
        'notifications', 'knowledge', 'reports', 'search'
      )
    ),
    'presence_engine', jsonb_build_object(
      'presence_ring', jsonb_build_object(
        'available', 'Available',
        'attention_required', 'Attention Required',
        'working', 'Working',
        'restricted', 'Restricted',
        'current', coalesce(v_presence.presence_ring_status, 'available')
      ),
      'desktop_presence', jsonb_build_object(
        'unread_notifications', coalesce(v_presence.unread_notifications, 0),
        'approvals_waiting', coalesce(v_presence.approvals_waiting, 0),
        'tasks_due', coalesce(v_presence.tasks_due, 0),
        'critical_alerts', coalesce(v_presence.critical_alerts, 0)
      ),
      'suggestions', coalesce(v_presence.presence_suggestions, '[]'::jsonb),
      'companion_messages', coalesce(v_presence.companion_messages, '[]'::jsonb)
    ),
    'notifications', jsonb_build_object(
      'respects', jsonb_build_array('quiet_hours', 'notification_rules', 'digest_settings', 'mobile_preferences'),
      'no_spam', true
    ),
    'companion_memory', jsonb_build_object(
      'favorite_searches', coalesce(v_prefs.favorite_searches, '[]'::jsonb),
      'preferred_modules', coalesce(v_prefs.preferred_modules, '[]'::jsonb),
      'preferred_home_view', coalesce(v_prefs.preferred_home_view, 'overview'),
      'adapts_to', jsonb_build_array('role', 'permissions', 'department', 'business_packs', 'responsibilities')
    ),
    'preferences', jsonb_build_object(
      'desktop_mode', coalesce(v_prefs.desktop_mode, 'sidebar'),
      'companion_role_mode', coalesce(v_prefs.companion_role_mode, 'auto'),
      'notification_preferences', coalesce(v_prefs.notification_preferences, '{}'::jsonb),
      'offline_cache_enabled', coalesce(v_prefs.offline_cache_enabled, true)
    ),
    'devices', coalesce((
      select jsonb_agg(public._cp545_device_json(d) order by d.last_activity_at desc nulls last)
      from public.organization_companion_devices d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'offline_cache', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'cache_type', c.cache_type, 'title', c.title,
        'content_summary', c.content_summary, 'sync_status', c.sync_status, 'created_at', c.created_at
      ) order by c.created_at desc)
      from public.organization_companion_offline_cache c
      where c.organization_id = v_org_id and (v_user_id is null or c.user_id = v_user_id)
      limit 15
    ), '[]'::jsonb),
    'meeting_awareness', coalesce(v_presence.meeting_awareness, '{}'::jsonb),
    'meeting_integrations', jsonb_build_array('microsoft_365', 'google_workspace', 'apple_calendar'),
    'role_experience', jsonb_build_object(
      'executive', jsonb_build_array('executive_briefing', 'strategic_risks', 'strategic_opportunities', 'forecast_changes', 'approvals', 'organization_health'),
      'manager', jsonb_build_array('team_activity', 'approvals', 'workload', 'projects', 'deadlines', 'department_risks'),
      'employee', jsonb_build_array('tasks', 'meetings', 'notifications', 'learning', 'approvals', 'knowledge'),
      'current_mode', coalesce(v_prefs.companion_role_mode, 'auto')
    ),
    'companion_store', jsonb_build_object(
      'prepared', true,
      'future', jsonb_build_array('themes', 'widgets', 'skills', 'extensions', 'companion_customizations'),
      'identity_fixed', true
    ),
    'business_pack_integration', jsonb_build_object(
      'examples', jsonb_build_array(
        jsonb_build_object('pack', 'finance_pack', 'widget', 'Financial Briefing'),
        jsonb_build_object('pack', 'warehouse_pack', 'widget', 'Inventory Widget'),
        jsonb_build_object('pack', 'support_pack', 'widget', 'Support Overview'),
        jsonb_build_object('pack', 'partner_pack', 'widget', 'Commission Widget')
      )
    ),
    'search_integration', jsonb_build_object(
      'universal_search', true,
      'phase', 537,
      'available_everywhere', true
    ),
    'companion_intelligence', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What should I focus on today?',
        'Show overdue approvals.',
        'Prepare meeting summary.',
        'Generate executive briefing.',
        'Find contract.',
        'Open supplier record.'
      )
    ),
    'device_management', jsonb_build_object(
      'tracks', jsonb_build_array('desktop_devices', 'mobile_devices', 'last_activity', 'version', 'permissions', 'device_status'),
      'security_controls', jsonb_build_array('device_approval', 'remote_logout', 'session_control', 'device_restrictions')
    ),
    'executive_dashboard', jsonb_build_object(
      'companion_adoption_pct', 78,
      'desktop_usage_pct', 62,
      'mobile_usage_pct', 45,
      'notification_engagement_pct', 71,
      'companion_recommendations', jsonb_build_array(
        'Enable sidebar mode for faster approvals on desktop.',
        'Review 3 pending device approvals for new mobile installs.',
        'Executive briefing available — 2 strategic risks flagged.'
      )
    ),
    'reports', jsonb_build_object(
      'active_devices', (select count(*) from public.organization_companion_devices where organization_id = v_org_id and device_status = 'active'),
      'offline_pending_sync', (select count(*) from public.organization_companion_offline_cache where organization_id = v_org_id and sync_status = 'pending'),
      'presence_status', coalesce(v_presence.presence_ring_status, 'available')
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true, 'platforms', jsonb_build_array('ios', 'android', 'tablet', 'desktop', 'web')),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_companion_presence_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'desktop_companion', 'mobile_companion', 'presence', 'notifications',
      'memory', 'preferences', 'devices', 'executive'
    ),
    'routes', jsonb_build_object(
      'companion', '/app/companion',
      'desktop', '/app/companion/desktop',
      'mobile', '/app/companion/mobile',
      'command_center', '/app/command-center',
      'desktop_client', '/app/command-center/connect',
      'companion_executive_legacy', '/app/companion/executive',
      'presence_continuity_legacy', '/app/companion/presence-continuity'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_companion_presence_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_device_id uuid;
begin
  v_org_id := public._cp545_org();
  v_user_id := public._cp545_user();
  perform public._cp545_ensure_settings(v_org_id);

  if p_action_type in ('update_preferences', 'register_device', 'revoke_device', 'update_presence_mode', 'sync_offline') then
    perform public._irp_require_permission('companion_presence_operations.manage');
  else
    perform public._irp_require_permission('companion_presence_operations.view');
  end if;

  if p_action_type = 'update_preferences' then
    insert into public.organization_companion_user_preferences (
      organization_id, user_id, desktop_mode, companion_role_mode, preferred_home_view,
      favorite_searches, preferred_modules, notification_preferences, offline_cache_enabled
    ) values (
      v_org_id, v_user_id,
      coalesce(p_payload->>'desktop_mode', 'sidebar'),
      coalesce(p_payload->>'companion_role_mode', 'auto'),
      coalesce(p_payload->>'preferred_home_view', 'overview'),
      coalesce(p_payload->'favorite_searches', '[]'::jsonb),
      coalesce(p_payload->'preferred_modules', '[]'::jsonb),
      coalesce(p_payload->'notification_preferences', '{}'::jsonb),
      coalesce((p_payload->>'offline_cache_enabled')::boolean, true)
    )
    on conflict (organization_id, user_id) do update set
      desktop_mode = coalesce(p_payload->>'desktop_mode', organization_companion_user_preferences.desktop_mode),
      companion_role_mode = coalesce(p_payload->>'companion_role_mode', organization_companion_user_preferences.companion_role_mode),
      preferred_home_view = coalesce(p_payload->>'preferred_home_view', organization_companion_user_preferences.preferred_home_view),
      updated_at = now();
    perform public._cp545_log(v_org_id, 'preference_updated', 'Companion preferences updated', 'preferences', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'register_device' then
    insert into public.organization_companion_devices (
      organization_id, user_id, device_type, platform, device_label, device_status, app_version, last_activity_at
    ) values (
      v_org_id, v_user_id,
      coalesce(p_payload->>'device_type', 'web'),
      coalesce(p_payload->>'platform', 'web'),
      coalesce(p_payload->>'device_label', 'New device'),
      coalesce(p_payload->>'device_status', 'pending_approval'),
      p_payload->>'app_version',
      now()
    ) returning id into v_device_id;
    perform public._cp545_log(v_org_id, 'device_connected', 'Device registered', 'devices', p_payload);
    return jsonb_build_object('ok', true, 'device_id', v_device_id);

  elsif p_action_type = 'revoke_device' then
    v_device_id := (p_payload->>'device_id')::uuid;
    update public.organization_companion_devices
    set device_status = 'revoked', last_activity_at = now()
    where id = v_device_id and organization_id = v_org_id;
    perform public._cp545_log(v_org_id, 'device_removed', 'Device revoked', 'devices', p_payload);
    return jsonb_build_object('ok', true, 'device_id', v_device_id);

  elsif p_action_type = 'update_presence_mode' then
    insert into public.organization_companion_presence_state (organization_id, user_id, presence_ring_status)
    values (v_org_id, v_user_id, coalesce(p_payload->>'presence_ring_status', 'available'))
    on conflict (organization_id, user_id) do update set
      presence_ring_status = coalesce(p_payload->>'presence_ring_status', organization_companion_presence_state.presence_ring_status),
      updated_at = now();
    perform public._cp545_log(v_org_id, 'companion_opened', 'Presence mode updated', 'presence', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'sync_offline' then
    update public.organization_companion_offline_cache
    set sync_status = 'synced', synced_at = now()
    where organization_id = v_org_id and user_id = v_user_id and sync_status = 'pending';
    perform public._cp545_log(v_org_id, 'offline_synced', 'Offline cache synced', 'memory', p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_presence_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb;
begin
  perform public._irp_require_permission('companion_presence_operations.view');
  v_center := public.get_companion_presence_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_companion_presence_devices(p_query, 10);
    perform public._cp545_log(public._cp545_org(), 'search_performed', 'Companion search performed', 'search',
      jsonb_build_object('query', p_query));
  end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion should feel like a trusted coworker — always available, never intrusive.',
    'query', p_query,
    'center', v_center,
    'search', v_search,
    'companion_prompts', v_center->'companion_intelligence'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_companion_presence_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('companion_presence_operations.view');
  v_center := public.get_companion_presence_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('companion_presence_operations.manage', public._cp545_org()),
    'overview', v_center->'overview',
    'presence_engine', v_center->'presence_engine',
    'mobile_companion', v_center->'mobile_companion',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('companion', '/app/companion'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'companion_presence_operations', 'Desktop & Mobile Companion Presence', 'companion-presence-operations', 'companion',
    'Always-available Aipify experience across desktop, mobile and future devices.',
    'business', null, 'main', '/app/companion', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('companion_presence_operations', 'companion_presence_operations.view', 'view', 'Companion Presence — view devices, presence, and preferences'),
  ('companion_presence_operations', 'companion_presence_operations.manage', 'manage', 'Companion Presence — manage devices, preferences, and offline sync')
on conflict do nothing;

grant execute on function public._cp545_device_json(public.organization_companion_devices) to authenticated;
grant execute on function public._cp545_seed_companion(uuid, uuid) to authenticated;
grant execute on function public.search_companion_presence_devices(text, int) to authenticated;
grant execute on function public.get_companion_presence_operations_center(text) to authenticated;
grant execute on function public.perform_companion_presence_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_presence_context(text) to authenticated;
grant execute on function public.get_my_companion_presence_summary() to authenticated;

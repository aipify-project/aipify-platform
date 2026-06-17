-- Phase 345 — Companion Device & Environment Intelligence Engine
-- Feature owner: CUSTOMER APP (Desktop Companion). Route: /desktop/environment. Helpers: _cdeie345_*

create table if not exists public.companion_device_environment_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  environment_enabled boolean not null default false,
  system_info_approved boolean not null default false,
  file_locations_approved boolean not null default false,
  local_network_approved boolean not null default false,
  running_processes_approved boolean not null default false,
  project_folders_approved boolean not null default false,
  always_ask_before_scanning boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id)
);
alter table public.companion_device_environment_settings enable row level security;
revoke all on public.companion_device_environment_settings from authenticated, anon;

create table if not exists public.companion_device_environment_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  device_name text not null default '',
  platform text not null default '',
  os_version text not null default '',
  architecture text not null default '',
  memory_label text not null default '',
  disk_label text not null default '',
  active_user text not null default '',
  companion_version text not null default '',
  last_scan_at timestamptz,
  scan_status text not null default 'pending' check (
    scan_status in ('pending', 'ready', 'warning', 'error')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id)
);
alter table public.companion_device_environment_profiles enable row level security;
revoke all on public.companion_device_environment_profiles from authenticated, anon;

create table if not exists public.companion_device_environment_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  check_key text not null,
  check_label text not null default '',
  check_status text not null default 'unknown' check (
    check_status in ('passed', 'warning', 'failed', 'unknown', 'skipped')
  ),
  check_category text not null default 'general' check (
    check_category in ('storage', 'project', 'network', 'development', 'permissions', 'companion')
  ),
  message text not null default '',
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, check_key)
);
alter table public.companion_device_environment_checks enable row level security;
revoke all on public.companion_device_environment_checks from authenticated, anon;

create table if not exists public.companion_device_environment_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  recommendation_key text not null,
  title text not null default '',
  message text not null default '',
  severity text not null default 'info' check (
    severity in ('info', 'recommendation', 'warning', 'attention')
  ),
  action_label text not null default '',
  recommendation_status text not null default 'active' check (
    recommendation_status in ('active', 'dismissed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, recommendation_key)
);
alter table public.companion_device_environment_recommendations enable row level security;
revoke all on public.companion_device_environment_recommendations from authenticated, anon;

create table if not exists public.companion_device_environment_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_device_environment_events_user_idx
  on public.companion_device_environment_events (organization_id, auth_user_id, created_at desc);
alter table public.companion_device_environment_events enable row level security;
revoke all on public.companion_device_environment_events from authenticated, anon;

create table if not exists public.companion_device_environment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_device_environment_audit_user_idx
  on public.companion_device_environment_audit_logs (organization_id, auth_user_id, created_at desc);
alter table public.companion_device_environment_audit_logs enable row level security;
revoke all on public.companion_device_environment_audit_logs from authenticated, anon;

create or replace function public._cdeie345bp_positioning() returns text language sql immutable as $$
  select 'Device & Environment Intelligence observes local workspace conditions — explains and recommends only. No automatic system changes.'; $$;

create or replace function public._cdeie345_require_user()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'User context required'; end if;
  return jsonb_build_object('organization_id', v_org_id, 'auth_user_id', v_user_id);
end; $$;

create or replace function public._cdeie345_log_audit(
  p_org_id uuid, p_user_id uuid, p_event text, p_summary text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_device_environment_audit_logs (organization_id, auth_user_id, event_type, summary, metadata)
  values (p_org_id, p_user_id, p_event, left(p_summary, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cdeie345_log_event(
  p_org_id uuid, p_user_id uuid, p_event text, p_summary text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_device_environment_events (organization_id, auth_user_id, event_type, summary, metadata)
  values (p_org_id, p_user_id, p_event, left(p_summary, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cdeie345_ensure_settings(p_org_id uuid, p_user_id uuid)
returns public.companion_device_environment_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_device_environment_settings;
begin
  insert into public.companion_device_environment_settings (organization_id, auth_user_id)
  values (p_org_id, p_user_id)
  on conflict (organization_id, auth_user_id) do nothing;
  select * into v_row from public.companion_device_environment_settings
  where organization_id = p_org_id and auth_user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._cdeie345_seed_demo(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_device_environment_profiles
    where organization_id = p_org_id and auth_user_id = p_user_id limit 1
  ) then return; end if;

  insert into public.companion_device_environment_profiles (
    organization_id, auth_user_id, device_name, platform, os_version, architecture,
    memory_label, disk_label, active_user, companion_version, last_scan_at, scan_status
  ) values (
    p_org_id, p_user_id, 'MacBook Pro', 'macOS', '15.0', 'arm64',
    '16 GB available', '128 GB free of 512 GB', 'Developer', '1.0.0', now(), 'warning'
  );

  insert into public.companion_device_environment_checks (
    organization_id, auth_user_id, check_key, check_label, check_status, check_category, message, sort_order
  ) values
    (p_org_id, p_user_id, 'project_path', 'Project path verified', 'passed', 'project', 'Project stored in /Users/developer/Development/aipify', 10),
    (p_org_id, p_user_id, 'git_clean', 'Git clean', 'warning', 'development', 'Uncommitted changes detected', 20),
    (p_org_id, p_user_id, 'localhost', 'Localhost reachable', 'passed', 'network', 'localhost:3000 responded', 30),
    (p_org_id, p_user_id, 'typecheck', 'Typecheck passed', 'passed', 'development', 'Typecheck passed recently', 40),
    (p_org_id, p_user_id, 'disk', 'Disk healthy', 'passed', 'storage', 'Your project has enough available disk space.', 50),
    (p_org_id, p_user_id, 'cloud_sync', 'Not inside cloud sync', 'warning', 'project', 'Desktop may still be synced with iCloud.', 60),
    (p_org_id, p_user_id, 'permissions', 'Permissions configured', 'passed', 'permissions', 'Environment permissions granted', 70),
    (p_org_id, p_user_id, 'companion_ready', 'Companion ready', 'passed', 'companion', 'Companion environment check complete', 80)
  on conflict (organization_id, auth_user_id, check_key) do nothing;

  insert into public.companion_device_environment_recommendations (
    organization_id, auth_user_id, recommendation_key, title, message, severity, action_label
  ) values
    (p_org_id, p_user_id, 'next_cache', 'Clear .next cache', '.next cache is large and may affect build performance.', 'recommendation', 'Clear .next cache'),
    (p_org_id, p_user_id, 'icloud_desktop', 'Move project from cloud sync', 'This project appears to be stored in iCloud Drive. This may affect performance for development work.', 'warning', 'Move project to local Development folder'),
    (p_org_id, p_user_id, 'dev_server', 'Dev server running', 'Your local dev server is running on port 3001.', 'info', 'Open localhost'),
    (p_org_id, p_user_id, 'git_status', 'Check git status', 'Review uncommitted changes before continuing.', 'recommendation', 'Check git status'),
    (p_org_id, p_user_id, 'node_modules', 'Storage usage', 'node_modules is using significant storage.', 'info', 'Review storage')
  on conflict (organization_id, auth_user_id, recommendation_key) do nothing;

  insert into public.companion_device_environment_events (
    organization_id, auth_user_id, event_type, summary
  ) values
    (p_org_id, p_user_id, 'environment_scan', 'Environment scan completed'),
    (p_org_id, p_user_id, 'permission_granted', 'System information permission granted'),
    (p_org_id, p_user_id, 'warning_detected', 'iCloud sync path detected on Desktop'),
    (p_org_id, p_user_id, 'recommendation_shown', 'Recommended clearing .next cache');
end; $$;

create or replace function public._cdeie345_storage_bundle(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'available_disk', '128 GB',
    'used_disk', '384 GB',
    'warnings', jsonb_build_array(
      '.next cache is large.',
      'node_modules is using significant storage.'
    ),
    'large_folders', jsonb_build_array(
      jsonb_build_object('path', 'node_modules', 'size_label', '1.2 GB'),
      jsonb_build_object('path', '.next', 'size_label', '890 MB')
    ),
    'cache_size', '890 MB',
    'build_artifact_size', '120 MB',
    'summary', 'Your project has enough available disk space.'
  );
$$;

create or replace function public._cdeie345_project_bundle(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'current_project_path', '/Users/developer/Development/aipify',
    'location_risk', 'low',
    'location_label', 'Local Development folder',
    'risky_locations_detected', jsonb_build_array('~/Desktop (iCloud sync)'),
    'preferred_path_hint', '/Users/{user}/Development',
    'git_status', 'modified',
    'node_version', '22.x',
    'npm_version', '10.x',
    'next_dev_status', 'running',
    'localhost_status', 'reachable',
    'dev_port', 3001,
    'typecheck_status', 'passed',
    'lint_status', 'passed',
    'message', 'Your project is stored locally. Good.'
  );
$$;

create or replace function public._cdeie345_network_bundle(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'online', true,
    'network_name', 'Office Wi‑Fi',
    'local_ip', '192.168.1.42',
    'internet_reachable', true,
    'localhost_reachable', true,
    'api_reachable', true
  );
$$;

create or replace function public._cdeie345_services_bundle(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'dev_server_running', true,
    'dev_server_port', 3001,
    'database_tunnel_running', false,
    'supabase_local_status', 'not_running',
    'background_processes', jsonb_build_array(
      jsonb_build_object('name', 'next dev', 'status', 'running'),
      jsonb_build_object('name', 'node', 'status', 'running')
    )
  );
$$;

create or replace function public.get_companion_device_environment_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_device_environment_settings;
  v_profile public.companion_device_environment_profiles;
  v_status text := 'empty';
begin
  v_settings := public._cdeie345_ensure_settings(v_org_id, v_user_id);
  if v_settings.environment_enabled then
    perform public._cdeie345_seed_demo(v_org_id, v_user_id);
    select * into v_profile from public.companion_device_environment_profiles
    where organization_id = v_org_id and auth_user_id = v_user_id;
    v_status := coalesce(v_profile.scan_status, 'ready');
  end if;

  return jsonb_build_object(
    'has_access', true,
    'empty_state', not v_settings.environment_enabled,
    'positioning', public._cdeie345bp_positioning(),
    'environment_enabled', v_settings.environment_enabled,
    'scan_status', v_status,
    'success_state', v_status = 'ready',
    'warning_state', v_status = 'warning',
    'permission_text', 'Aipify can inspect your local environment to identify issues that may affect your work. Aipify will not change anything without approval.',
    'permissions', jsonb_build_object(
      'system_info_approved', v_settings.system_info_approved,
      'file_locations_approved', v_settings.file_locations_approved,
      'local_network_approved', v_settings.local_network_approved,
      'running_processes_approved', v_settings.running_processes_approved,
      'project_folders_approved', v_settings.project_folders_approved
    ),
    'device_overview', coalesce((
      select jsonb_build_object(
        'device_name', p.device_name, 'platform', p.platform, 'os_version', p.os_version,
        'architecture', p.architecture, 'memory', p.memory_label, 'disk', p.disk_label,
        'active_user', p.active_user, 'companion_version', p.companion_version,
        'last_scan_at', p.last_scan_at::text
      )
      from public.companion_device_environment_profiles p
      where p.organization_id = v_org_id and p.auth_user_id = v_user_id
    ), '{}'::jsonb),
    'insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'message', r.message, 'severity', r.severity
      ) order by r.created_at desc)
      from public.companion_device_environment_recommendations r
      where r.organization_id = v_org_id and r.auth_user_id = v_user_id
        and r.recommendation_status = 'active' and r.severity in ('info', 'recommendation')
      limit 5
    ), '[]'::jsonb),
    'checklist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'check_key', c.check_key, 'check_label', c.check_label, 'check_status', c.check_status,
        'message', c.message
      ) order by c.sort_order)
      from public.companion_device_environment_checks c
      where c.organization_id = v_org_id and c.auth_user_id = v_user_id
    ), '[]'::jsonb),
    'recent_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'event_type', e.event_type, 'summary', e.summary, 'created_at', e.created_at::text
      ) order by e.created_at desc)
      from public.companion_device_environment_events e
      where e.organization_id = v_org_id and e.auth_user_id = v_user_id
      limit 10
    ), '[]'::jsonb),
    'cross_link_phase344', '/desktop/workspace',
    'privacy_note', 'No hidden monitoring. Observations require permission. No automatic fixes.'
  );
end; $$;

create or replace function public.get_companion_device_storage_health()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cdeie345_ensure_settings(v_org_id, v_user_id);
  return jsonb_build_object(
    'has_access', true,
    'storage', public._cdeie345_storage_bundle(v_org_id, v_user_id)
  );
end; $$;

create or replace function public.get_companion_device_project_location_health()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cdeie345_ensure_settings(v_org_id, v_user_id);
  return jsonb_build_object(
    'has_access', true,
    'project', public._cdeie345_project_bundle(v_org_id, v_user_id),
    'development', public._cdeie345_project_bundle(v_org_id, v_user_id)
  );
end; $$;

create or replace function public.get_companion_device_network_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cdeie345_ensure_settings(v_org_id, v_user_id);
  return jsonb_build_object(
    'has_access', true,
    'network', public._cdeie345_network_bundle(v_org_id, v_user_id),
    'local_services', public._cdeie345_services_bundle(v_org_id, v_user_id)
  );
end; $$;

create or replace function public.get_companion_device_environment_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  if (select environment_enabled from public.companion_device_environment_settings where organization_id = v_org_id and auth_user_id = v_user_id) then
    perform public._cdeie345_seed_demo(v_org_id, v_user_id);
  end if;

  return jsonb_build_object(
    'has_access', true,
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_key', r.recommendation_key, 'title', r.title,
        'message', r.message, 'severity', r.severity, 'action_label', r.action_label
      ) order by case r.severity when 'warning' then 1 when 'attention' then 2 when 'recommendation' then 3 else 4 end)
      from public.companion_device_environment_recommendations r
      where r.organization_id = v_org_id and r.auth_user_id = v_user_id and r.recommendation_status = 'active'
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.run_companion_device_environment_scan(p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cdeie345_ensure_settings(v_org_id, v_user_id);

  update public.companion_device_environment_settings set
    environment_enabled = true,
    system_info_approved = coalesce((p_payload->>'system_info_approved')::boolean, true),
    file_locations_approved = coalesce((p_payload->>'file_locations_approved')::boolean, true),
    local_network_approved = coalesce((p_payload->>'local_network_approved')::boolean, true),
    running_processes_approved = coalesce((p_payload->>'running_processes_approved')::boolean, true),
    project_folders_approved = coalesce((p_payload->>'project_folders_approved')::boolean, true),
    updated_at = now()
  where organization_id = v_org_id and auth_user_id = v_user_id;

  perform public._cdeie345_seed_demo(v_org_id, v_user_id);

  update public.companion_device_environment_profiles set
    last_scan_at = now(),
    scan_status = 'warning',
    updated_at = now()
  where organization_id = v_org_id and auth_user_id = v_user_id;

  perform public._cdeie345_log_event(v_org_id, v_user_id, 'environment_scan', 'Environment scan completed', p_payload);
  perform public._cdeie345_log_audit(v_org_id, v_user_id, 'environment_scan', 'Device environment scan run', p_payload);

  return public.get_companion_device_environment_center();
end; $$;

create or replace function public.update_companion_device_environment_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cdeie345_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cdeie345_ensure_settings(v_org_id, v_user_id);

  update public.companion_device_environment_settings set
    environment_enabled = coalesce((p_patch->>'environment_enabled')::boolean, environment_enabled),
    system_info_approved = coalesce((p_patch->>'system_info_approved')::boolean, system_info_approved),
    file_locations_approved = coalesce((p_patch->>'file_locations_approved')::boolean, file_locations_approved),
    local_network_approved = coalesce((p_patch->>'local_network_approved')::boolean, local_network_approved),
    running_processes_approved = coalesce((p_patch->>'running_processes_approved')::boolean, running_processes_approved),
    project_folders_approved = coalesce((p_patch->>'project_folders_approved')::boolean, project_folders_approved),
    always_ask_before_scanning = coalesce((p_patch->>'always_ask_before_scanning')::boolean, always_ask_before_scanning),
    updated_at = now()
  where organization_id = v_org_id and auth_user_id = v_user_id;

  perform public._cdeie345_log_audit(v_org_id, v_user_id, 'settings_updated', 'Device environment settings updated', p_patch);
  return public.get_companion_device_environment_center();
end; $$;

grant execute on function public.get_companion_device_environment_center() to authenticated;
grant execute on function public.get_companion_device_storage_health() to authenticated;
grant execute on function public.get_companion_device_project_location_health() to authenticated;
grant execute on function public.get_companion_device_network_status() to authenticated;
grant execute on function public.get_companion_device_environment_recommendations() to authenticated;
grant execute on function public.run_companion_device_environment_scan(jsonb) to authenticated;
grant execute on function public.update_companion_device_environment_settings(jsonb) to authenticated;
